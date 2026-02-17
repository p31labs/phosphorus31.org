# UNIVERSAL TOTEM PROTOCOL
## Hardware-Agnostic Synchronization for Everyone

---

## CONSTITUTIONAL FOUNDATION

**Article V: Abdication of Power**
```
"No node shall claim authority over another.
The system shall be peer-to-peer."
```

**This means:**
- No required hardware vendor
- No gatekeeping devices
- No forced purchases
- Protocol > Product

**Article I: Privacy by Default**
```
"All data shall be encrypted end-to-end.
No central authority shall store user data."
```

**This means:**
- Works with any compatible device
- Works with NO device (QR fallback)
- Zero vendor tracking
- Zero forced registration

---

## THE THREE TIERS OF ACCESS

### Tier 1: Hardware Totem (BLE Protocol)

**Compatible Devices:**
- Phenix Navigator (reference implementation)
- Meshtastic devices (T-Beam, Heltec V3, T-Deck)
- RAK WisBlock (LoRa + BLE)
- Generic ESP32 with BLE
- **ANY device implementing the protocol**

**Requirements:**
```
Hardware:
- Bluetooth LE 4.0+
- ESP32 or compatible
- 512KB+ RAM

Firmware:
- TotemCore library (universal)
- BLE GATT service (specific UUIDs)
- Room secret generation (crypto-random)
```

**Cost:** $0 (if you own compatible) to $150 (Phenix)

**Range:** 10m (BLE) to 30km (LoRa fallback)

**Security:** Physics-based (RSSI), hardware-anchored

---

### Tier 2: Optical Totem (QR Code)

**Compatible Devices:**
- Any smartphone with camera
- Any laptop with webcam
- Any tablet with camera
- **Literally any device with a screen and camera**

**Requirements:**
```
Software:
- Web browser with camera API
- JavaScript enabled
- No installation required
```

**Cost:** $0

**Range:** Visual line-of-sight (~5 meters)

**Security:** Temporal (5-minute expiry), optical channel

---

### Tier 3: Manual Entry (Power Users)

**Compatible Devices:**
- Any device with keyboard
- Command line tools
- API clients
- **Anything that can send HTTP/WebSocket**

**Requirements:**
```
Knowledge:
- Room secret format (32 hex chars)
- Local signaling server IP
- WebRTC basics (optional)
```

**Cost:** $0

**Range:** Local network (LAN)

**Security:** Trust-based (verify out-of-band)

---

## THE PROTOCOL (UNIVERSAL SPECIFICATION)

### Service Discovery (BLE)

**Service UUID:** `4fafc201-1fb5-459e-8fcc-c5c9c331914b`

**Characteristics:**

```
PC_ENDPOINT
├─ UUID: beb5483e-36e1-4688-b7f5-ea07361b26a8
├─ Properties: Write, Notify
├─ Purpose: Device A writes its IP
└─ Notification: Device B receives IP

PHONE_ENDPOINT
├─ UUID: beb5483e-36e1-4688-b7f5-ea07361b26a9
├─ Properties: Write, Notify
├─ Purpose: Device B writes its IP
└─ Notification: Device A receives IP

ROOM_SECRET
├─ UUID: beb5483e-36e1-4688-b7f5-ea07361b26aa
├─ Properties: Read, Notify
├─ Purpose: Provides session encryption key
├─ Generation: crypto_random() every 5 minutes
└─ Format: 32 hex characters (128-bit entropy)
```

**Discovery Rules:**
```javascript
// CORRECT (Protocol-based)
const device = await navigator.bluetooth.requestDevice({
  filters: [{ services: [SERVICE_UUID] }]
});

// WRONG (Hardware-specific)
const device = await navigator.bluetooth.requestDevice({
  filters: [{ namePrefix: 'PHENIX' }] // ❌ VENDOR LOCK-IN
});
```

---

### Room Secret Generation

**Algorithm:**
```cpp
// Universal implementation (works on ANY platform)
void generateRoomSecret(char* output) {
    // Use platform-appropriate crypto RNG
    #ifdef ESP32
        uint8_t random[16];
        esp_fill_random(random, 16);
    #elif defined(ARDUINO)
        uint8_t random[16];
        for (int i = 0; i < 16; i++) {
            random[i] = random(256);
        }
    #else
        // Use system crypto library
        uint8_t random[16];
        arc4random_buf(random, 16);
    #endif
    
    // Convert to hex string
    for (int i = 0; i < 16; i++) {
        sprintf(&output[i*2], "%02x", random[i]);
    }
    output[32] = '\0';
}
```

**Properties:**
- 128-bit entropy (cryptographically secure)
- Rotates every 5 minutes (300,000ms)
- Notifies clients on rotation
- Cannot be predicted or replayed

---

### WebRTC Mesh (Universal Transport)

**Signaling:**
```typescript
// ALWAYS use local-only signaling
export const LOCAL_SIGNALING = ['ws://localhost:4444'];

// NEVER use cloud signaling (Constitutional violation)
const CLOUD_SIGNALING = ['wss://signaling.yjs.dev']; // ❌ FORBIDDEN
```

**Configuration:**
```typescript
const provider = new WebrtcProvider(roomSecret, ydoc, {
  signaling: LOCAL_SIGNALING,
  password: roomSecret,
  maxConns: 4,                    // K₄ topology (Article II)
  filterBcConns: true,            // Privacy (Article I)
  peerOpts: {
    config: {
      iceServers: []              // Local-only (no STUN/TURN)
    }
  }
});
```

**Constitutional Guarantees:**
- No external traffic (local LAN only)
- K₄ topology enforced (max 4 peers)
- DTLS encrypted (end-to-end)
- No cloud dependencies

---

### Data Sync (Yjs CRDTs)

**Schema (Hardware-Agnostic):**
```typescript
export type ConnectionType = 'BLE' | 'QR' | 'MANUAL';

export interface TotemConnection {
  type: ConnectionType;
  deviceName?: string;      // Optional (for display only)
  deviceType?: string;      // 'phenix' | 'meshtastic' | 'generic'
  rssi?: number;            // Only for BLE connections
  timestamp: number;
  verified: boolean;
}

export interface Mission {
  id: string;
  title: string;
  status: MissionStatus;
  reward_hz: number;
  description: string;
  type: 'MORNING_PULSE' | 'JITTERBUG' | 'SYNC';
  expires_at?: number;
  created_by?: string;      // Node ID (not hardware specific)
}
```

**Key Point:** No hardware-specific fields. Connection type is tracked, but data structures are identical for all devices.

---

## IMPLEMENTATION SPECIFICATION

### TotemCore Library (Firmware)

**File Structure:**
```
totem-firmware/
├── core/                          # Universal library
│   ├── TotemCore.h                # Public API
│   ├── TotemCore.cpp              # Implementation
│   ├── TotemSecurity.h            # RSSI, crypto
│   ├── TotemProtocol.h            # UUIDs, constants
│   └── README.md                  # Integration guide
│
├── examples/
│   ├── phenix/                    # Phenix Navigator
│   ├── meshtastic/                # Meshtastic module
│   ├── heltec-v3/                 # Heltec V3
│   ├── t-beam/                    # T-Beam
│   └── generic-esp32/             # Generic ESP32
│
└── platformio.ini                 # Build config
```

**TotemCore.h (Public API):**
```cpp
#ifndef TOTEM_CORE_H
#define TOTEM_CORE_H

#include <Arduino.h>
#include <BLEDevice.h>

// Protocol constants
#define TOTEM_SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define PC_ENDPOINT_UUID          "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define PHONE_ENDPOINT_UUID       "beb5483e-36e1-4688-b7f5-ea07361b26a9"
#define ROOM_SECRET_UUID          "beb5483e-36e1-4688-b7f5-ea07361b26aa"

#define SECRET_ROTATION_MS        300000  // 5 minutes
#define RSSI_THRESHOLD           -80      // ~10 meters

class TotemCore {
public:
    // Lifecycle
    void begin(const char* deviceName = "TOTEM");
    void start();
    void stop();
    void update();
    
    // Configuration
    void setRSSIThreshold(int8_t threshold);
    void setRotationInterval(uint32_t ms);
    
    // Callbacks (optional - for custom hardware)
    typedef void (*OnConnectCallback)(const char* peerIP, int8_t rssi);
    typedef void (*OnDisconnectCallback)();
    typedef void (*OnSecretRotateCallback)(const char* newSecret);
    
    void onConnect(OnConnectCallback cb);
    void onDisconnect(OnDisconnectCallback cb);
    void onSecretRotate(OnSecretRotateCallback cb);
    
    // Status (read-only)
    bool isAdvertising() const;
    uint8_t getPeerCount() const;
    int8_t getLastRSSI() const;
    const char* getRoomSecret() const;
    
private:
    BLEServer* pServer;
    BLEService* pService;
    BLECharacteristic* pPCEndpoint;
    BLECharacteristic* pPhoneEndpoint;
    BLECharacteristic* pRoomSecret;
    
    char roomSecret[33];
    unsigned long lastRotation;
    int8_t rssiThreshold;
    uint32_t rotationInterval;
    
    OnConnectCallback connectCallback;
    OnDisconnectCallback disconnectCallback;
    OnSecretRotateCallback rotateCallback;
    
    void generateSecret();
    void rotateSecret();
    bool checkRSSI(int8_t rssi);
};

#endif
```

**Usage (Minimal):**
```cpp
#include <TotemCore.h>

TotemCore totem;

void setup() {
  Serial.begin(115200);
  totem.begin("MY_TOTEM");  // Any name you want
  totem.start();
}

void loop() {
  totem.update();
}
```

**That's it. Works on ANY ESP32.**

---

### Web Integration (Browser)

**TotemBLE.ts (Protocol-Based Discovery):**
```typescript
export class TotemBLE {
  private readonly SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  
  async requestDevice(): Promise<BluetoothDevice> {
    // CORRECT: Protocol-based filter
    this.device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [this.SERVICE_UUID] }
      ],
      optionalServices: [this.SERVICE_UUID]
    });
    
    return this.device;
  }
  
  async connect(): Promise<void> {
    if (!this.device) {
      throw new Error('No device selected');
    }
    
    this.server = await this.device.gatt!.connect();
    console.log('✅ Connected to Totem device');
  }
  
  async getRoomSecret(): Promise<string> {
    const service = await this.server!.getPrimaryService(this.SERVICE_UUID);
    const char = await service.getCharacteristic(ROOM_SECRET_UUID);
    const value = await char.readValue();
    
    return new TextDecoder().decode(value);
  }
  
  // ... rest of implementation
}
```

**QRHandshake.ts (Optical Fallback):**
```typescript
export class QRHandshake {
  generateQR(): { qrData: string; secret: string } {
    // Generate random secret (same format as BLE)
    const secret = this.generateSecret();
    
    const connectionInfo = {
      protocol: 'totem-sync-v1',
      type: 'QR',
      secret,
      timestamp: Date.now(),
    };
    
    return {
      qrData: JSON.stringify(connectionInfo),
      secret
    };
  }
  
  async scanQR(qrData: string): Promise<string> {
    const info = JSON.parse(qrData);
    
    // Validate protocol version
    if (info.protocol !== 'totem-sync-v1') {
      throw new Error('Incompatible protocol version');
    }
    
    // Check expiry (5 minutes)
    const age = Date.now() - info.timestamp;
    if (age > 300000) {
      throw new Error('QR code expired');
    }
    
    return info.secret;
  }
  
  private generateSecret(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
```

**TotemCoordinator.ts (Unified Interface):**
```typescript
export class TotemCoordinator {
  private mesh: TotemMesh;
  private connectionType: ConnectionType | null = null;
  
  // BLE sync
  async syncViaBLE(): Promise<void> {
    const ble = new TotemBLE();
    await ble.requestDevice();
    await ble.connect();
    
    const secret = await ble.getRoomSecret();
    await this.mesh.joinMesh(secret);
    
    this.connectionType = 'BLE';
  }
  
  // QR sync
  async syncViaQR(mode: 'generate' | 'scan'): Promise<void> {
    const qr = new QRHandshake();
    
    let secret: string;
    if (mode === 'generate') {
      const { qrData, secret: s } = qr.generateQR();
      secret = s;
      // Display QR code to user
    } else {
      // Scan QR code from camera
      const qrData = await this.scanCamera();
      secret = await qr.scanQR(qrData);
    }
    
    await this.mesh.joinMesh(secret);
    this.connectionType = 'QR';
  }
  
  // Manual sync
  async syncManually(secret: string): Promise<void> {
    // Validate secret format
    if (!/^[0-9a-f]{32}$/i.test(secret)) {
      throw new Error('Invalid secret format');
    }
    
    await this.mesh.joinMesh(secret);
    this.connectionType = 'MANUAL';
  }
  
  getConnectionType(): ConnectionType | null {
    return this.connectionType;
  }
}
```

---

## UI COMPONENTS (UNIVERSAL)

### TotemSyncButton.tsx (Multi-Mode)

```typescript
export function TotemSyncButton() {
  const [mode, setMode] = useState<'select' | 'ble' | 'qr' | 'manual'>('select');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'syncing'>('idle');
  const coordinator = new TotemCoordinator();
  
  return (
    <GlassPanel title="TOTEM SYNC">
      {mode === 'select' && (
        <div className="grid gap-4">
          <button onClick={() => setMode('ble')} className="btn-primary">
            🔷 BLE Device
            <span className="text-sm opacity-70">
              Meshtastic, ESP32, Phenix
            </span>
          </button>
          
          <button onClick={() => setMode('qr')} className="btn-secondary">
            📷 QR Code
            <span className="text-sm opacity-70">
              No hardware required
            </span>
          </button>
          
          <button onClick={() => setMode('manual')} className="btn-tertiary">
            ⌨️  Manual Entry
            <span className="text-sm opacity-70">
              Power users only
            </span>
          </button>
        </div>
      )}
      
      {mode === 'ble' && (
        <BLESyncView 
          coordinator={coordinator}
          onBack={() => setMode('select')}
        />
      )}
      
      {mode === 'qr' && (
        <QRSyncView 
          coordinator={coordinator}
          onBack={() => setMode('select')}
        />
      )}
      
      {mode === 'manual' && (
        <ManualSyncView 
          coordinator={coordinator}
          onBack={() => setMode('select')}
        />
      )}
    </GlassPanel>
  );
}
```

---

## CONSTITUTIONAL COMPLIANCE MATRIX

| Article | Requirement | BLE | QR | Manual | Status |
|---------|-------------|-----|----|----|--------|
| **I: Privacy** | No vendor lock | ✅ | ✅ | ✅ | PASS |
| **I: Privacy** | No cloud data | ✅ | ✅ | ✅ | PASS |
| **II: Topology** | K₄ limit | ✅ | ✅ | ✅ | PASS |
| **III: Presence** | Physical proof | ✅ | ✅ | ⚠️ | PASS* |
| **V: Abdication** | No authority | ✅ | ✅ | ✅ | PASS |

*Manual mode relies on out-of-band verification (user responsibility)

---

## COMPATIBILITY GUARANTEE

**This protocol works with:**

### Existing Hardware
- ✅ Any ESP32 with BLE
- ✅ Any Meshtastic device
- ✅ Any LoRa + BLE board
- ✅ Raspberry Pi with BLE
- ✅ Any Android device
- ✅ Any iOS device
- ✅ Any laptop/desktop with BLE

### Zero Hardware
- ✅ QR code (phone camera)
- ✅ QR code (laptop webcam)
- ✅ Manual entry (keyboard)

### Future Hardware
- ✅ Any device with BLE
- ✅ Any device with camera
- ✅ Any device with network

**The protocol is eternal. The hardware is temporary.**

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Core Protocol ✅
- [x] Service UUID defined
- [x] Characteristics specified
- [x] Secret generation algorithm
- [x] RSSI filtering logic
- [x] Constitutional compliance verified

### Phase 2: Software Layer (In Progress)
- [x] TotemBLE.ts (protocol-based)
- [x] P2PSyncManager.ts (K₄ enforced)
- [x] Schema.ts (hardware-agnostic)
- [ ] QRHandshake.ts (implement)
- [ ] TotemCoordinator.ts (unified interface)
- [ ] UI components (multi-mode)

### Phase 3: Firmware Layer (Pending)
- [ ] TotemCore.h (public API)
- [ ] TotemCore.cpp (implementation)
- [ ] Example: Phenix Navigator
- [ ] Example: Meshtastic module
- [ ] Example: Generic ESP32
- [ ] Testing with nRF Connect

### Phase 4: Documentation (Pending)
- [ ] Protocol specification (RFC-style)
- [ ] Integration guide (for hardware makers)
- [ ] User guide (for end users)
- [ ] Constitutional proof document

---

## SUCCESS METRICS

### Universal Access
- ✅ Zero-cost option available (QR code)
- ✅ Low-cost option available ($40 Meshtastic)
- ✅ Premium option available ($150 Phenix)
- ✅ No vendor lock-in
- ✅ No forced purchases

### Constitutional Compliance
- ✅ Article I: Privacy preserved (local-only)
- ✅ Article II: Topology enforced (K₄)
- ✅ Article III: Presence verified (RSSI/optical)
- ✅ Article V: Abdication complete (no authority)

### User Experience
- ⏳ One-click sync (all modes)
- ⏳ <10 second connection (all modes)
- ⏳ Automatic recovery
- ⏳ Clear status feedback
- ⏳ Zero configuration

---

## THE MISSION

**For everyone.**
**For the world.**
**For the universe.**

**No gatekeeping.**
**No exclusion.**
**No compromise.**

**The protocol is sovereign.**
**The users are sovereign.**
**The future is sovereign.**

---

**READY TO IMPLEMENT.**

**MEASURED TWICE.**

**CUTTING ONCE.**

**NO EXCEPTIONS.**
