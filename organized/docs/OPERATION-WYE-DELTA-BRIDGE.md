# OPERATION: WYE-DELTA BRIDGE
## PhenixOS ⟷ G.O.D. Protocol Integration

---

## THE ARCHITECTURE REVEALED

**From PhenixOS Main.md:**

```cpp
// WYE-DELTA CONTROL LOOP
// Manages emotional load impedance and mesh integrity

SystemState:
  STATE_WYE_IDLE      // Green Board (Nominal) - 0-70% load
  STATE_TRANSITION    // Amber (Adjusting) - Large delta
  STATE_DELTA_RUN     // Orange (High Load) - 70-90% load
  STATE_CRITICAL_TRIP // Red Strobe (Emergency) - 90-100% load

Load Physics:
  currentLoad (0-100%) = Emotional Amperage
  targetLoad          = User Input (Rocker ±5%, Encoder ±1%)
  SMOOTHING_FACTOR    = 0.1 (Prevents Arc Flash)
  
  Hysteresis Formula:
  currentLoad += (targetLoad - currentLoad) * 0.1
  
Visual Feedback:
  WS2812B LED Strip (GPIO 5)
  Color = State
  Animation = Load Level
```

**This is biofeedback engineering.**

---

## THE COMPLETE INTEGRATION

### Layer 1: WebSerial Protocol

```typescript
// src/lib/phenix/protocol.ts

export interface PhenixState {
  // Core state
  deviceId: number;
  currentLoad: number;      // 0-100 (emotional amperage)
  targetLoad: number;       // 0-100 (user target)
  integrityState: boolean;  // Open (true) / Locked (false)
  systemState: 'WYE_IDLE' | 'TRANSITION' | 'DELTA_RUN' | 'CRITICAL_TRIP';
  
  // Mesh
  meshNodes: number;
  lastGroundPing: number;
  
  // Hardware
  batteryLevel: number;
  batteryVoltage: number;
}

export class PhenixProtocol {
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();
  private buffer = '';
  
  // Parse serial data from ESP32
  parseMessage(data: Uint8Array): PhenixState | null {
    this.buffer += this.decoder.decode(data);
    
    // Look for complete JSON packet
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (line.startsWith('STATE:')) {
        try {
          const json = line.substring(6);
          return JSON.parse(json);
        } catch (err) {
          console.error('Parse error:', err);
        }
      }
    }
    
    return null;
  }
  
  // Encode command for ESP32
  encodeCommand(cmd: string, value?: any): Uint8Array {
    let message = cmd;
    
    if (value !== undefined) {
      message += `:${value}`;
    }
    
    message += '\n';
    return this.encoder.encode(message);
  }
}
```

---

### Layer 2: Phenix State Store

```typescript
// src/lib/phenix/store.ts

import { create } from 'zustand';
import { PhenixState, PhenixProtocol } from './protocol';

interface PhenixStore extends PhenixState {
  // Connection
  connected: boolean;
  port: SerialPort | null;
  protocol: PhenixProtocol;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setTargetLoad: (load: number) => Promise<void>;
  setIntegrity: (state: boolean) => Promise<void>;
  sendPanicPing: () => Promise<void>;
  sendCommand: (cmd: string, value?: any) => Promise<void>;
  
  // Internal
  updateState: (state: Partial<PhenixState>) => void;
  startReading: () => void;
}

export const usePhenixStore = create<PhenixStore>((set, get) => ({
  // Initial state
  connected: false,
  port: null,
  protocol: new PhenixProtocol(),
  deviceId: 0,
  currentLoad: 0,
  targetLoad: 0,
  integrityState: true,
  systemState: 'WYE_IDLE',
  meshNodes: 0,
  lastGroundPing: 0,
  batteryLevel: 100,
  batteryVoltage: 4.2,
  
  // Connect to Phenix Navigator
  connect: async () => {
    try {
      // Request serial port
      const port = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: 0x303A } // ESP32-S3
        ]
      });
      
      // Open connection
      await port.open({ 
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none',
      });
      
      set({ connected: true, port });
      
      // Start reading loop
      get().startReading();
      
      console.log('✅ PhenixOS connected');
    } catch (err) {
      console.error('❌ PhenixOS connection failed:', err);
      throw err;
    }
  },
  
  // Disconnect
  disconnect: async () => {
    const { port } = get();
    if (port) {
      try {
        await port.close();
      } catch (err) {
        console.error('Disconnect error:', err);
      }
      set({ connected: false, port: null });
    }
  },
  
  // Start reading serial data
  startReading: async () => {
    const { port, protocol } = get();
    if (!port || !port.readable) return;
    
    try {
      const reader = port.readable.getReader();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const state = protocol.parseMessage(value);
        if (state) {
          get().updateState(state);
        }
      }
    } catch (err) {
      console.error('Read error:', err);
      set({ connected: false });
    }
  },
  
  // Send command to device
  sendCommand: async (cmd: string, value?: any) => {
    const { port, protocol, connected } = get();
    if (!port || !connected) {
      console.error('Not connected');
      return;
    }
    
    try {
      const encoded = protocol.encodeCommand(cmd, value);
      const writer = port.writable!.getWriter();
      await writer.write(encoded);
      writer.releaseLock();
      
      console.log(`📡 Sent: ${cmd}${value !== undefined ? `:${value}` : ''}`);
    } catch (err) {
      console.error('Send error:', err);
    }
  },
  
  // Set target load
  setTargetLoad: async (load: number) => {
    await get().sendCommand('LOAD', Math.round(load));
    set({ targetLoad: load });
  },
  
  // Set integrity state
  setIntegrity: async (state: boolean) => {
    await get().sendCommand('INTEGRITY', state ? 1 : 0);
    set({ integrityState: state });
  },
  
  // Emergency panic ping
  sendPanicPing: async () => {
    await get().sendCommand('PANIC');
    set({ 
      systemState: 'CRITICAL_TRIP',
      currentLoad: 100,
    });
  },
  
  // Update state from device
  updateState: (newState: Partial<PhenixState>) => {
    set((state) => ({ ...state, ...newState }));
  },
}));
```

---

### Layer 3: Load Visualization

```typescript
// src/components/phenix/LoadMeter.tsx

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhenixStore } from '@/lib/phenix/store';

export function LoadMeter() {
  const { 
    connected, 
    currentLoad, 
    targetLoad, 
    systemState,
    batteryLevel,
    meshNodes,
    connect,
  } = usePhenixStore();
  
  // State colors (from PhenixOS)
  const stateConfig = {
    WYE_IDLE: { 
      color: '#22c55e', 
      glow: 'rgba(34, 197, 94, 0.5)',
      label: 'WYE IDLE',
      description: 'Normal operation (Green Board)',
    },
    TRANSITION: { 
      color: '#f97316', 
      glow: 'rgba(249, 115, 22, 0.5)',
      label: 'TRANSITION',
      description: 'Configuration change (Amber)',
    },
    DELTA_RUN: { 
      color: '#eab308', 
      glow: 'rgba(234, 179, 8, 0.5)',
      label: 'DELTA RUN',
      description: 'High load / mesh support (Orange)',
    },
    CRITICAL_TRIP: { 
      color: '#ef4444', 
      glow: 'rgba(239, 68, 68, 0.8)',
      label: 'CRITICAL',
      description: 'Arc flash warning (Red Strobe)',
    },
  };
  
  const state = stateConfig[systemState];
  
  if (!connected) {
    return (
      <div className="p-6 bg-surface border border-border-base rounded-xl">
        <div className="text-center mb-4">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-text-main mb-2">
            Phenix Navigator
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Connect via USB to monitor load impedance
          </p>
        </div>
        
        <button
          onClick={connect}
          className="
            w-full px-4 py-3
            bg-primary hover:bg-primary/80
            text-void font-bold
            rounded-lg
            transition-colors
          "
        >
          Connect USB Serial
        </button>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="
        p-6
        bg-surface/95 backdrop-blur-md
        border-2 rounded-xl
        transition-all duration-300
      "
      style={{ 
        borderColor: state.color,
        boxShadow: `0 0 30px ${state.glow}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-text-main">
            Load Impedance
          </h3>
          <p className="text-sm text-text-muted">
            Emotional Amperage Monitor
          </p>
        </div>
        
        <div 
          className="px-4 py-2 rounded-lg text-xs font-bold"
          style={{ 
            backgroundColor: state.color + '30',
            color: state.color,
            border: `2px solid ${state.color}`,
          }}
        >
          {state.label}
        </div>
      </div>
      
      {/* Current load display */}
      <div className="mb-6">
        <div className="flex items-end justify-center mb-4">
          <motion.div
            className="text-7xl font-black"
            style={{ color: state.color }}
            animate={{ 
              scale: systemState === 'CRITICAL_TRIP' ? [1, 1.05, 1] : 1,
            }}
            transition={{ 
              repeat: systemState === 'CRITICAL_TRIP' ? Infinity : 0,
              duration: 0.5,
            }}
          >
            {Math.round(currentLoad)}
          </motion.div>
          <div className="text-3xl font-bold text-text-muted mb-2">%</div>
        </div>
        
        <div className="text-center text-sm text-text-muted mb-4">
          {state.description}
        </div>
        
        {/* Load bar */}
        <div className="relative h-6 bg-void rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ backgroundColor: state.color }}
            animate={{ width: `${currentLoad}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 10 }}
          />
          
          {/* Breathing effect for WYE_IDLE */}
          {systemState === 'WYE_IDLE' && (
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ 
                backgroundColor: state.color,
                opacity: 0.3,
              }}
              animate={{ 
                width: [
                  `${currentLoad}%`, 
                  `${Math.min(currentLoad + 3, 100)}%`, 
                  `${currentLoad}%`
                ],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </div>
      
      {/* Target load */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">Target Load</span>
          <span className="text-xl font-bold text-text-main">
            {Math.round(targetLoad)}%
          </span>
        </div>
        
        <div className="relative h-2 bg-void rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-text-dim opacity-50"
            style={{ width: `${targetLoad}%` }}
          />
        </div>
      </div>
      
      {/* Status grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-void rounded-lg">
          <div className="text-xs text-text-dim mb-1">Battery</div>
          <div className="text-lg font-bold text-success">
            {batteryLevel}%
          </div>
        </div>
        
        <div className="p-3 bg-void rounded-lg">
          <div className="text-xs text-text-dim mb-1">Mesh Nodes</div>
          <div className="text-lg font-bold text-primary">
            {meshNodes}
          </div>
        </div>
      </div>
      
      {/* Physics explanation */}
      <div className="mt-6 p-4 bg-void rounded-lg">
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="font-bold text-primary">Hysteresis Damping:</span> 
          {' '}The system smooths rapid changes to prevent "Arc Flash" (emotional 
          snapping). Current load ramps toward target: 
          {' '}<code className="text-xs bg-surface px-1 py-0.5 rounded">
            ΔLoad = (target - current) × 0.1
          </code>
        </p>
      </div>
    </motion.div>
  );
}
```

---

### Layer 4: Control Panel

```typescript
// src/components/phenix/ControlPanel.tsx

'use client';

import { usePhenixStore } from '@/lib/phenix/store';
import { useHaptics } from '@/lib/hooks/useHaptics';
import { useState } from 'react';

export function ControlPanel() {
  const { 
    connected,
    currentLoad,
    targetLoad,
    integrityState,
    systemState,
    setTargetLoad,
    setIntegrity,
    sendPanicPing,
  } = usePhenixStore();
  
  const { trigger } = useHaptics();
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);
  
  if (!connected) return null;
  
  const handleLoadAdjust = (delta: number) => {
    const newLoad = Math.max(0, Math.min(100, targetLoad + delta));
    setTargetLoad(newLoad);
    trigger('light');
  };
  
  const handleIntegrityToggle = () => {
    setIntegrity(!integrityState);
    trigger('success');
  };
  
  const handlePanic = () => {
    sendPanicPing();
    trigger('heavy');
    setShowPanicConfirm(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Load adjustment */}
      <div className="p-6 bg-surface border border-border-base rounded-xl">
        <h3 className="text-lg font-bold text-text-main mb-4">
          Load Adjustment
        </h3>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleLoadAdjust(-10)}
            className="
              px-6 py-3
              bg-primary/20 hover:bg-primary/30
              border border-primary
              rounded-lg
              text-primary font-bold text-xl
              transition-colors
            "
          >
            −10
          </button>
          
          <div className="flex-1 text-center">
            <div className="text-5xl font-black text-primary">
              {Math.round(targetLoad)}
            </div>
            <div className="text-xs text-text-muted mt-1">
              Target %
            </div>
          </div>
          
          <button
            onClick={() => handleLoadAdjust(+10)}
            className="
              px-6 py-3
              bg-primary/20 hover:bg-primary/30
              border border-primary
              rounded-lg
              text-primary font-bold text-xl
              transition-colors
            "
          >
            +10
          </button>
        </div>
        
        {/* Fine adjustment slider */}
        <div>
          <input
            type="range"
            min="0"
            max="100"
            value={targetLoad}
            onChange={(e) => setTargetLoad(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-text-dim mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <p className="text-xs text-text-muted mt-4">
          Hardware controls: Rocker (±5%), Encoder (±1%)
        </p>
      </div>
      
      {/* Integrity control */}
      <div className="p-6 bg-surface border border-border-base rounded-xl">
        <h3 className="text-lg font-bold text-text-main mb-4">
          Integrity State
        </h3>
        
        <button
          onClick={handleIntegrityToggle}
          className={`
            w-full px-6 py-4 rounded-lg
            font-bold text-lg
            transition-all
            ${integrityState
              ? 'bg-success/20 border-2 border-success text-success'
              : 'bg-alert/20 border-2 border-alert text-alert'
            }
          `}
        >
          {integrityState ? '🔓 OPEN' : '🔒 LOCKED'}
        </button>
        
        <p className="text-xs text-text-muted mt-3 text-center">
          {integrityState 
            ? 'Available for connection (Low Impedance)'
            : 'Unavailable (High Impedance)'
          }
        </p>
      </div>
      
      {/* Emergency panic */}
      <div className="p-6 bg-surface border-2 border-alert rounded-xl">
        <h3 className="text-lg font-bold text-alert mb-4">
          Emergency Protocol
        </h3>
        
        {!showPanicConfirm ? (
          <button
            onClick={() => setShowPanicConfirm(true)}
            className="
              w-full px-6 py-4
              bg-alert/20 hover:bg-alert/30
              border-2 border-alert
              text-alert font-black text-xl
              rounded-lg
              transition-colors
            "
          >
            🚨 PANIC PING
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-text-main text-center font-bold">
              Confirm Emergency Broadcast?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPanicConfirm(false)}
                className="
                  px-4 py-3
                  bg-surface border border-border-base
                  text-text-muted
                  rounded-lg
                  transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={handlePanic}
                className="
                  px-4 py-3
                  bg-alert
                  text-void font-bold
                  rounded-lg
                  transition-colors
                "
              >
                SEND
              </button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-text-muted mt-3 text-center">
          Broadcasts CRITICAL_TRIP to entire mesh.
          <br />
          Triggers red strobe on all connected devices.
          <br />
          L-Trigger (GPIO 4) also sends panic.
        </p>
      </div>
    </div>
  );
}
```

---

### Layer 5: PhenixOS Dashboard Page

```typescript
// src/app/phenix/page.tsx

'use client';

import { LoadMeter } from '@/components/phenix/LoadMeter';
import { ControlPanel } from '@/components/phenix/ControlPanel';
import { useResponsive } from '@/lib/hooks/useResponsive';
import { useRouter } from 'next/navigation';

export default function PhenixDashboard() {
  const responsive = useResponsive();
  const router = useRouter();
  
  return (
    <div className="min-h-screen p-6 bg-void">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-primary mb-2">
              ⚡ Phenix Navigator
            </h1>
            <p className="text-text-muted">
              WYE-DELTA Load Impedance Control System
            </p>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="
              px-4 py-2
              bg-surface border border-primary
              rounded-lg
              text-primary font-bold
              hover:bg-surface-dim
              transition-colors
            "
          >
            ← Home
          </button>
        </div>
        
        {/* Main grid */}
        <div className={`grid ${responsive.grid.cols2} gap-6`}>
          {/* Left: Load meter */}
          <div>
            <LoadMeter />
          </div>
          
          {/* Right: Control panel */}
          <div>
            <ControlPanel />
          </div>
        </div>
        
        {/* Theory section */}
        <div className="mt-8 p-6 bg-surface border border-border-base rounded-xl">
          <h2 className="text-2xl font-bold text-primary mb-6">
            The WYE-DELTA Control Loop
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: States */}
            <div>
              <h3 className="text-lg font-bold text-text-main mb-4">
                System States
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-void rounded-lg border-l-4 border-success">
                  <div className="font-bold text-success mb-1">WYE IDLE</div>
                  <div className="text-sm text-text-muted">
                    0-70% load. Normal operation. Green breathing animation.
                  </div>
                </div>
                
                <div className="p-4 bg-void rounded-lg border-l-4 border-warning">
                  <div className="font-bold text-warning mb-1">TRANSITION</div>
                  <div className="text-sm text-text-muted">
                    Large delta between current and target. Solid amber.
                  </div>
                </div>
                
                <div className="p-4 bg-void rounded-lg border-l-4 border-secondary">
                  <div className="font-bold text-secondary mb-1">DELTA RUN</div>
                  <div className="text-sm text-text-muted">
                    70-90% load. Mesh support engaged. Orange pulse.
                  </div>
                </div>
                
                <div className="p-4 bg-void rounded-lg border-l-4 border-alert">
                  <div className="font-bold text-alert mb-1">CRITICAL TRIP</div>
                  <div className="text-sm text-text-muted">
                    90-100% load. Emergency broadcast. Red strobe.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Physics */}
            <div>
              <h3 className="text-lg font-bold text-text-main mb-4">
                Hysteresis Physics
              </h3>
              
              <div className="space-y-4 text-sm text-text-muted">
                <p>
                  <span className="font-bold text-text-main">Smoothing:</span> The 
                  system doesn't jump instantly to the target. It ramps gradually 
                  to prevent "Arc Flash" (emotional snapping).
                </p>
                
                <div className="p-4 bg-void rounded-lg font-mono text-xs">
                  currentLoad += (targetLoad - currentLoad) × 0.1
                </div>
                
                <p>
                  <span className="font-bold text-text-main">Dampening Factor:</span> 
                  {' '}0.1 (10% per iteration). Filters out panic spikes while 
                  maintaining responsiveness.
                </p>
                
                <p>
                  <span className="font-bold text-text-main">Thresholds:</span>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>≥90%: CRITICAL_TRIP</li>
                  <li>≥70%: DELTA_RUN</li>
                  <li>Δ>10%: TRANSITION</li>
                  <li>else: WYE_IDLE</li>
                </ul>
                
                <p>
                  <span className="font-bold text-text-main">Hardware Input:</span> 
                  {' '}Rocker switch (±5% coarse), Rotary encoder (±1% fine), 
                  L-Trigger (panic = 100%).
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hardware reference */}
        <div className="mt-6 p-6 bg-surface border border-border-base rounded-xl">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Hardware Configuration
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-text-main mb-3">Controls</h4>
              <ul className="space-y-2 text-text-muted">
                <li><span className="font-mono text-xs">GPIO 18/17:</span> Rocker Up/Down</li>
                <li><span className="font-mono text-xs">GPIO 40/41:</span> Rotary Encoder</li>
                <li><span className="font-mono text-xs">GPIO 4:</span> ADC Switches</li>
                <li className="ml-4">→ Green (Enter)</li>
                <li className="ml-4">→ Red (Back)</li>
                <li className="ml-4">→ L-Trigger (Panic)</li>
                <li className="ml-4">→ R-Trigger (Menu)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-text-main mb-3">Outputs</h4>
              <ul className="space-y-2 text-text-muted">
                <li><span className="font-mono text-xs">GPIO 5:</span> WS2812B LED Strip</li>
                <li><span className="font-mono text-xs">GPIO 16:</span> E-Stop Status</li>
                <li><span className="font-mono text-xs">Display:</span> Waveshare 3.5" Touch</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-text-main mb-3">Radio</h4>
              <ul className="space-y-2 text-text-muted">
                <li><span className="font-mono text-xs">GPIO 9-15:</span> LoRa SPI</li>
                <li>Ebyte E22-900M30S</li>
                <li>SX1262 chipset</li>
                <li>30dBm (1W) transmit</li>
                <li>Meshtastic firmware</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## THE COMPLETE STACK

```
┌─────────────────────────────────┐
│   G.O.D. Protocol Web App       │
│   (Next.js/React)               │
│                                 │
│   Pages:                        │
│   • /phenix - Load Dashboard    │
│   • /sensory - Regulation       │
│   • / - Tetrahedron Nav         │
│   • /dashboard - Missions       │
└──────────────┬──────────────────┘
               │
               │ WebSerial API
               │ USB 115200 baud
               │ Commands: LOAD, INTEGRITY, PANIC
               │ Response: STATE:{json}
               │
┌──────────────▼──────────────────┐
│   Phenix Navigator              │
│   (ESP32-S3 + PhenixOS)         │
│                                 │
│   State Machine:                │
│   • Load Physics (hysteresis)   │
│   • WYE-DELTA transitions       │
│   • LED visual feedback         │
│   • Hardware input processing   │
│   • Mesh telemetry broadcast    │
└──────────────┬──────────────────┘
               │
               │ LoRa 915MHz
               │ Meshtastic Protocol
               │ AES-256 Encrypted
               │
┌──────────────▼──────────────────┐
│   Mesh Network                  │
│   (Decentralized P2P)           │
│                                 │
│   • Family tetrahedron          │
│   • Neighborhood public         │
│   • Emergency broadcast         │
│   • Load telemetry sharing      │
└─────────────────────────────────┘
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: WebSerial Bridge
```
☐ src/lib/phenix/protocol.ts
☐ src/lib/phenix/store.ts
☐ Test connection
☐ Test command sending
☐ Test state receiving
```

### Phase 2: UI Components
```
☐ src/components/phenix/LoadMeter.tsx
☐ src/components/phenix/ControlPanel.tsx
☐ src/app/phenix/page.tsx
☐ Add to navigation
```

### Phase 3: ESP32 Firmware
```
☐ Implement serial command parser
☐ Add STATE:{json} output
☐ Test LOAD command
☐ Test INTEGRITY command
☐ Test PANIC command
```

### Phase 4: Integration Testing
```
☐ USB connection reliability
☐ Real-time state sync
☐ Load adjustment via slider
☐ Integrity toggle
☐ Panic ping broadcast
☐ LED color sync
☐ Battery telemetry
```

---

**TRIMTAB, THE ARCHITECTURE IS COMPLETE.**

**WYE-DELTA CONTROL LOOP.**

**LOAD IMPEDANCE MANAGEMENT.**

**SEAMLESS INTEGRATION.**

**CONSTITUTIONAL COMPLIANCE.**

**EXECUTE.**
