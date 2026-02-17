# OPERATION: PHENIX PROTOCOL
## The Complete Sensory-Communicator Integration Architecture

---

## THE MISSION

**From Trimtab's Documents:**

```
"The Sensory-Communicator represents a paradigm shift from 
utilitarian engineering to empathetic engineering."

"By combining long-range connectivity of LoRa with deep 
sensory satisfaction of mechanical keyboards and haptics, 
we create a device that solves two problems at once: 
reliable, anxiety-free communication and sensory regulation."

"Neurodivergence is not a deficit. It is a design constraint 
that can be engineered around."
```

---

## THE ARCHITECTURE

### Layer 1: The Physical Device (Phenix Navigator)

**Hardware Specifications:**
```
Core: ESP32-S3 (dual-core, native USB)
Radio: SX1262 (Ebyte E22-900M30S) - 30dBm, 1W
Power: 18650 Li-Ion (3000mAh) + Qi wireless charging
Input: Kailh hot-swap mechanical switches + rotary encoder
Output: Haptic (LRA + DRV2605L), RGB LEDs, OLED display
Range: 10km urban, 30km+ rural (LoRa)
Battery: 4+ days always-on mesh standby
```

**Sensory Regulation Features:**
```
Tactile: Heavy aluminum knob (rotational inertia)
         Clicky switches (60gf actuation force)
         Textured PCB (exposed gold traces)
         
Auditory: Piezo beeper patterns
          Click-bar hysteresis (deep pressure)
          
Visual: RGB underglow (mood lighting)
        OLED animations (confirmation)
        
Proprioceptive: Weight + mass distribution
                Breathing LED pulse (calming)
                
Haptic: LRA "heartbeat" pattern when idle
        Sharp "tap" on message received
        Rumble on critical alert
```

---

### Layer 2: The Communication Protocol

**Meshtastic Mesh Network:**

```
Protocol: LoRa P2P mesh (decentralized)
Frequency: 915MHz (US) / 868MHz (EU)
Encryption: AES-256 (channel-based)
Range: Multi-hop relay (neighbor extends range)
Bandwidth: ~5-10kbps (text/location only)
Latency: 1-30 seconds (acceptable for async)
```

**Why Meshtastic:**
```
✅ No infrastructure (no towers, no internet)
✅ Works during disasters
✅ Private encrypted channels
✅ Public neighborhood channels
✅ Location sharing (GPS optional)
✅ Open source (auditable crypto)
✅ Active community
✅ Perfect for neurodivergent communication
   (asynchronous, low-pressure)
```

---

### Layer 3: The G.O.D. Protocol Bridge

**WebSerial API Integration:**

The G.O.D. web app connects to Phenix via USB using WebSerial API.

```typescript
// src/lib/meshtastic/serial.ts

import { createSerialConnection } from '@meshtastic/js';

class PhenixBridge {
  private connection: SerialConnection | null = null;
  
  async connect() {
    // Request USB serial port
    const port = await navigator.serial.requestPort({
      filters: [
        { usbVendorId: 0x303A, usbProductId: 0x1001 } // ESP32-S3
      ]
    });
    
    // Connect at 115200 baud
    await port.open({ baudRate: 115200 });
    
    // Initialize Meshtastic connection
    this.connection = createSerialConnection();
    await this.connection.connect(port);
    
    console.log('✅ Phenix Communicator connected');
  }
  
  async sendMessage(text: string, channel: string = 'LongFast') {
    if (!this.connection) throw new Error('Not connected');
    
    await this.connection.sendText(text, channel);
    
    // Trigger haptic feedback via serial command
    await this.triggerHaptic('success');
  }
  
  async receiveMessage(callback: (msg: Message) => void) {
    if (!this.connection) throw new Error('Not connected');
    
    this.connection.onMessageReceived((msg) => {
      // Trigger haptic on receive
      this.triggerHaptic('notification');
      
      // Show notification in app
      callback(msg);
    });
  }
  
  async triggerHaptic(pattern: 'success' | 'error' | 'notification') {
    // Send serial command to ESP32
    const commands = {
      success: 'HAPTIC:TAP\n',
      error: 'HAPTIC:BUZZ\n',
      notification: 'HAPTIC:PULSE\n'
    };
    
    await this.connection?.sendRaw(commands[pattern]);
  }
  
  async getDeviceStatus() {
    // Request node info
    const node = await this.connection?.getMyNodeInfo();
    
    return {
      battery: node.deviceMetrics.batteryLevel,
      voltage: node.deviceMetrics.voltage,
      signalStrength: node.signalStrength,
      meshNodes: node.meshNodes,
    };
  }
}
```

---

### Layer 4: The Crypto Layer

**End-to-End Encryption:**

```typescript
// src/lib/meshtastic/crypto.ts

import { webcrypto } from 'crypto';

class MeshCrypto {
  // Meshtastic uses AES-256
  async generateChannelKey(): Promise<Uint8Array> {
    const key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const exported = await webcrypto.subtle.exportKey('raw', key);
    return new Uint8Array(exported);
  }
  
  // Phenix stores key in secure element
  async storeKey(key: Uint8Array) {
    // ESP32 has secure storage
    await phenixBridge.connection?.sendRaw(
      `KEY:SET:${Buffer.from(key).toString('base64')}\n`
    );
  }
  
  // Share key via QR code (out of band)
  async exportKeyQR(): Promise<string> {
    const key = await this.getChannelKey();
    
    // Encode as base64 URL
    const b64 = Buffer.from(key).toString('base64url');
    const url = `https://meshtastic.org/e/#${b64}`;
    
    return generateQRCode(url);
  }
}
```

**Why This Crypto Matters:**

```
1. Zero Trust: Even relay nodes can't read messages
2. No Central Server: Keys never leave devices
3. Quantum Resistant: Can upgrade to post-quantum later
4. Family Safety: Kids' messages are private
5. Constitutional: Aligns with G.O.D. Protocol privacy mandate
```

---

### Layer 5: The Sensory API

**Haptic Patterns Library:**

```typescript
// src/lib/phenix/haptics.ts

export const HAPTIC_PATTERNS = {
  // Calming patterns
  heartbeat: [
    { intensity: 0.3, duration: 100 },
    { intensity: 0, duration: 200 },
    { intensity: 0.5, duration: 150 },
    { intensity: 0, duration: 550 },
  ],
  
  breathe: [
    { intensity: 0.1, duration: 2000, ease: 'in-out' },
    { intensity: 0.3, duration: 2000, ease: 'in-out' },
  ],
  
  // Alert patterns
  tap: [
    { intensity: 1.0, duration: 50 },
  ],
  
  pulse: [
    { intensity: 0.7, duration: 100 },
    { intensity: 0, duration: 100 },
    { intensity: 0.7, duration: 100 },
  ],
  
  buzz: [
    { intensity: 0.8, duration: 500 },
  ],
  
  // Emergency
  sos: [
    { intensity: 1.0, duration: 100 }, // S
    { intensity: 0, duration: 50 },
    { intensity: 1.0, duration: 100 },
    { intensity: 0, duration: 50 },
    { intensity: 1.0, duration: 100 },
    { intensity: 0, duration: 100 },
    { intensity: 1.0, duration: 300 }, // O
    { intensity: 0, duration: 50 },
    { intensity: 1.0, duration: 300 },
    { intensity: 0, duration: 50 },
    { intensity: 1.0, duration: 300 },
    { intensity: 0, duration: 100 },
    { intensity: 1.0, duration: 100 }, // S
    { intensity: 0, duration: 50 },
    { intensity: 1.0, duration: 100 },
    { intensity: 0, duration: 50 },
    { intensity: 1.0, duration: 100 },
  ],
};

class PhenixHaptics {
  async play(pattern: keyof typeof HAPTIC_PATTERNS) {
    const sequence = HAPTIC_PATTERNS[pattern];
    
    for (const step of sequence) {
      await phenixBridge.connection?.sendRaw(
        `HAPTIC:${step.intensity}:${step.duration}\n`
      );
      await sleep(step.duration);
    }
  }
  
  // Continuous background calming
  async startCalming() {
    while (true) {
      await this.play('heartbeat');
      await sleep(2000);
    }
  }
}
```

---

### Layer 6: The UI Integration

**Phenix Status Component:**

```typescript
// src/components/phenix/PhenixStatus.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { phenixBridge } from '@/lib/phenix/bridge';

export function PhenixStatus() {
  const [connected, setConnected] = useState(false);
  const [battery, setBattery] = useState(100);
  const [meshNodes, setMeshNodes] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // Connect on mount
    phenixBridge.connect()
      .then(() => setConnected(true))
      .catch(console.error);
    
    // Poll status
    const interval = setInterval(async () => {
      const status = await phenixBridge.getDeviceStatus();
      setBattery(status.battery);
      setMeshNodes(status.meshNodes);
    }, 5000);
    
    // Listen for messages
    phenixBridge.receiveMessage((msg) => {
      setLastMessage(msg.text);
    });
    
    return () => clearInterval(interval);
  }, []);
  
  if (!connected) {
    return (
      <div className="fixed top-4 right-4 z-toast">
        <button
          onClick={() => phenixBridge.connect()}
          className="
            px-4 py-2
            bg-alert/20 border border-alert
            rounded-lg
            text-alert font-bold
            hover:bg-alert/30
            transition-colors
          "
        >
          📡 Connect Phenix
        </button>
      </div>
    );
  }
  
  return (
    <div className="fixed top-4 right-4 z-toast">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="
          p-4
          bg-surface/95 backdrop-blur-md
          border border-primary
          rounded-lg
          shadow-glow-primary
        "
      >
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="relative">
            <div className="
              w-3 h-3 rounded-full
              bg-success
              animate-pulse
            " />
            <div className="
              absolute inset-0
              w-3 h-3 rounded-full
              bg-success
              animate-ping
            " />
          </div>
          
          {/* Info */}
          <div>
            <div className="text-xs text-primary font-bold">
              PHENIX ONLINE
            </div>
            <div className="text-xs text-text-muted">
              {meshNodes} nodes • {battery}% battery
            </div>
          </div>
        </div>
        
        {/* Last message */}
        {lastMessage && (
          <div className="mt-3 pt-3 border-t border-border-base">
            <div className="text-xs text-text-dim mb-1">
              Last Message:
            </div>
            <div className="text-sm text-text-main">
              {lastMessage}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
```

---

### Layer 7: The Sensory Dashboard

**Regulation Tools:**

```typescript
// src/app/sensory/page.tsx

'use client';

import { useState } from 'react';
import { phenixHaptics } from '@/lib/phenix/haptics';
import { useResponsive } from '@/lib/hooks/useResponsive';

export default function SensoryDashboard() {
  const responsive = useResponsive();
  const [activePattern, setActivePattern] = useState<string | null>(null);
  
  const tools = [
    {
      id: 'calming',
      name: 'Calming Heartbeat',
      icon: '💓',
      color: 'primary',
      pattern: 'heartbeat',
      description: 'Slow, rhythmic pulse for grounding',
    },
    {
      id: 'breathe',
      name: 'Breathe Cycle',
      icon: '🌊',
      color: 'success',
      pattern: 'breathe',
      description: 'Match your breath to the pattern',
    },
    {
      id: 'focus',
      name: 'Focus Tap',
      icon: '🎯',
      color: 'warning',
      pattern: 'tap',
      description: 'Sharp attention reset',
    },
    {
      id: 'alert',
      name: 'Alert Pulse',
      icon: '⚡',
      color: 'alert',
      pattern: 'pulse',
      description: 'Notification pattern',
    },
  ];
  
  const handleTrigger = async (tool: typeof tools[0]) => {
    setActivePattern(tool.id);
    await phenixHaptics.play(tool.pattern as any);
    setTimeout(() => setActivePattern(null), 2000);
  };
  
  return (
    <div className="min-h-screen p-6 bg-void">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">
            🧠 Sensory Regulation
          </h1>
          <p className="text-text-muted">
            Your Phenix Communicator provides haptic patterns to help regulate your nervous system.
          </p>
        </div>
        
        {/* Tools grid */}
        <div className={`grid ${responsive.grid.cols2} gap-6`}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleTrigger(tool)}
              disabled={activePattern !== null}
              className={`
                ${responsive.padding.lg}
                bg-surface border-2
                rounded-xl
                text-left
                transition-all
                hover:scale-105
                disabled:opacity-50
                ${activePattern === tool.id
                  ? `border-${tool.color} shadow-glow-${tool.color}`
                  : 'border-border-base hover:border-primary'
                }
              `}
            >
              <div className="text-5xl mb-4">{tool.icon}</div>
              <h3 className={`text-xl font-bold text-${tool.color} mb-2`}>
                {tool.name}
              </h3>
              <p className="text-sm text-text-muted">
                {tool.description}
              </p>
              
              {activePattern === tool.id && (
                <div className="mt-4 text-xs text-primary font-bold">
                  ● Playing...
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Intensity control */}
        <div className="mt-8 p-6 bg-surface border border-border-base rounded-xl">
          <h3 className="text-lg font-bold text-text-main mb-4">
            Haptic Intensity
          </h3>
          
          <input
            type="range"
            min="0"
            max="100"
            className="w-full"
            onChange={(e) => {
              // Send intensity to Phenix
              phenixBridge.connection?.sendRaw(
                `HAPTIC:INTENSITY:${e.target.value}\n`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

### Layer 8: The Emergency Protocol

**SOS System:**

```typescript
// src/lib/phenix/emergency.ts

class EmergencyProtocol {
  async sendSOS() {
    // 1. Trigger SOS haptic pattern
    await phenixHaptics.play('sos');
    
    // 2. Send mesh broadcast
    await phenixBridge.sendMessage(
      '🚨 EMERGENCY - Location attached',
      'LongFast' // Public channel
    );
    
    // 3. Log to G.O.D. Protocol
    await gossip.broadcast({
      type: 'EMERGENCY',
      timestamp: Date.now(),
      userId: 'operator-id',
      location: await getGPSLocation(),
      priority: 'CRITICAL',
    });
    
    // 4. Visual alert on device
    await phenixBridge.connection?.sendRaw(
      'LED:RED:FLASH:FAST\n'
    );
    
    // 5. Alert all tetrahedron members
    const tetrahedron = useTetrahedronStore.getState().vertices;
    tetrahedron.forEach(async (vertex) => {
      await notifyVertex(vertex, 'EMERGENCY');
    });
  }
  
  // Family check-in
  async sendCheckIn() {
    await phenixHaptics.play('tap');
    
    await phenixBridge.sendMessage(
      '✓ All good here',
      'Family' // Private channel
    );
  }
}
```

---

## THE COMPLETE STACK

```
┌─────────────────────────────────────┐
│   G.O.D. Web App (React/Next.js)    │
│                                     │
│  • Tetrahedron Navigation           │
│  • Mission Control Dashboard        │
│  • Sensory Regulation Tools         │
│  • Tutorial System                  │
└──────────────┬──────────────────────┘
               │
               │ WebSerial API
               │ (USB connection)
               │
┌──────────────▼──────────────────────┐
│    Phenix Communicator (ESP32-S3)   │
│                                     │
│  • Meshtastic Firmware              │
│  • Haptic Driver (DRV2605L)         │
│  • OLED Display                     │
│  • Mechanical Switches              │
│  • Rotary Encoder                   │
└──────────────┬──────────────────────┘
               │
               │ LoRa (915MHz)
               │ AES-256 Encrypted
               │
┌──────────────▼──────────────────────┐
│       Mesh Network (P2P)            │
│                                     │
│  • Other Phenix devices             │
│  • Standard Meshtastic nodes        │
│  • Family tetrahedron members       │
│  • Neighborhood public mesh         │
└─────────────────────────────────────┘
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: WebSerial Bridge (Week 1)
```
File: src/lib/meshtastic/serial.ts
File: src/lib/meshtastic/types.ts
File: src/components/phenix/PhenixConnector.tsx

Tasks:
- WebSerial API integration
- Meshtastic protocol parser
- Connection status UI
- Error handling
```

### Phase 2: Crypto Layer (Week 2)
```
File: src/lib/meshtastic/crypto.ts
File: src/components/phenix/ChannelManager.tsx

Tasks:
- AES-256 key generation
- QR code export/import
- Secure key storage
- Channel management UI
```

### Phase 3: Haptic API (Week 3)
```
File: src/lib/phenix/haptics.ts
File: src/app/sensory/page.tsx

Tasks:
- Haptic pattern library
- Serial command protocol
- Sensory dashboard UI
- Intensity controls
```

### Phase 4: Emergency Protocol (Week 4)
```
File: src/lib/phenix/emergency.ts
File: src/components/phenix/SOSButton.tsx

Tasks:
- SOS broadcast system
- Location sharing
- Alert notifications
- Family check-in
```

### Phase 5: Integration Testing (Week 5)
```
Tasks:
- End-to-end message flow
- Multi-device testing
- Range testing
- Battery life testing
- Sensory effectiveness testing
```

---

## SUCCESS CRITERIA

**For Trimtab:**
```
✅ Seamless USB connection (WebSerial)
✅ Encrypted mesh communication
✅ Haptic patterns work reliably
✅ Sensory tools are effective
✅ Emergency protocol is fast (<5 seconds)
✅ Battery lasts 4+ days
✅ Range exceeds 10km urban
✅ Zero configuration for family members
✅ Works offline (no internet required)
✅ Constitutional compliance (privacy, encryption)
```

**For Neurodivergent Users:**
```
✅ Reduces communication anxiety
✅ Provides grounding through haptics
✅ Enables async communication (low pressure)
✅ Works when overwhelmed (pre-programmed messages)
✅ Feels good to hold and use
✅ Doesn't draw stigmatizing attention
✅ Empowers rather than labels
```

---

## THE TRIMTAB PRINCIPLE

**From Fuller:**

```
"Something hit me very hard once, thinking about what 
one little man could do. Think of the Queen Mary—the 
whole ship goes by and then comes the rudder. And 
there's a tiny thing at the edge of the rudder called 
a trim tab. It's a miniature rudder. Just moving the 
little trim tab builds a low pressure that pulls the 
rudder around. Takes almost no effort at all."
```

**For This Mission:**

```
The Phenix Communicator is the TRIM TAB.

It is the small, high-leverage intervention that:
1. Solves the Operator's communication challenge
2. Demonstrates technical mastery for career
3. Models problem-solving for children
4. Creates a product for other families
5. Validates neurodivergence as design constraint
6. Shifts the entire trajectory of the life-ship

By focusing on THIS ONE PROJECT, everything else 
follows. The mesh network grows. The community forms. 
The career pivots. The family connects.

This is not a hobby.
This is the fulcrum.
This is the trim tab.
```

---

**⚡ OPERATION: PHENIX PROTOCOL ⚡**

**CALL SIGN: TRIMTAB**

**MISSION: SEAMLESS INTEGRATION**

**STATUS: ARCHITECTURE COMPLETE**

**NEXT: EXECUTE**
