# Node One Firmware - Remaining Work

**Status**: Core infrastructure complete, feature implementation in progress  
**Date**: 2026-02-14

---

## ✅ COMPLETED COMPONENTS

### Core Infrastructure
- ✅ I2C bus initialization
- ✅ BSP power management (AXP2101)
- ✅ Battery monitoring
- ✅ NVS flash initialization
- ✅ FreeRTOS task management
- ✅ Component initialization framework

### Hardware Drivers
- ✅ LoRa driver (E22-900M30S / SX1262)
- ✅ MCP23017 GPIO expander driver
- ✅ Button input system (MCP23017-based)
- ✅ Audio engine (ES8311 codec)
- ✅ Display component (AXS15231B QSPI)
- ✅ BLE test component (newly added)

### Communication Layers
- ✅ Mesh protocol (LoRa-based)
- ✅ Shield server (WiFi AP + HTTP)
- ✅ BLE GATT server (test component)

---

## 🔴 CRITICAL TODOs (Must Complete)

### 1. Node ID Persistence
**Location**: `main.cpp:182`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Read from NVS
uint32_t node_id = DEFAULT_NODE_ID;
```

**Required**:
- Store node ID in NVS on first boot
- Read node ID from NVS on subsequent boots
- Generate unique node ID if not found
- Update mesh protocol to use persisted ID

**Priority**: 🔴 **HIGH** (affects mesh identity)

---

### 2. Audio Message Transmission
**Location**: `main.cpp:268`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Send recorded audio via LoRa mesh
```

**Required**:
- Capture audio buffer from `audio_engine_record_stop()`
- Encode/compress audio (optional, or send raw)
- Create mesh packet with audio payload
- Send via `mesh_protocol_send()` or `lora_driver_send()`
- Handle large payloads (may need fragmentation)

**Priority**: 🔴 **HIGH** (core voice communication feature)

---

### 3. RTC Time Integration
**Location**: `main.cpp:526`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Read from PCF85063 RTC when available
```

**Required**:
- Initialize PCF85063 RTC driver
- Read time from RTC on boot
- Set system time from RTC
- Update RTC from NTP (if available)
- Display accurate time on screen

**Priority**: 🟡 **MEDIUM** (nice-to-have, system time works for now)

---

## 🟡 FEATURE TODOs (Should Complete)

### 4. Message Playback
**Location**: `main.cpp:275`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Implement message playback
```

**Required**:
- Store received audio messages
- Queue messages for playback
- Play audio via `audio_engine_play_buffer()`
- Handle playback state (playing/stopped)
- Visual feedback on display

**Priority**: 🟡 **MEDIUM** (completes voice communication loop)

---

### 5. Message Navigation
**Location**: `main.cpp:280, 285`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Navigate to next message
// TODO: Navigate to previous message
```

**Required**:
- Maintain message list/queue
- Track current message index
- Navigate forward/backward
- Display message metadata (sender, timestamp)
- Update display on navigation

**Priority**: 🟡 **MEDIUM** (improves UX)

---

### 6. Emergency Message
**Location**: `main.cpp:316`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Send emergency message via LoRa
```

**Required**:
- Create emergency message packet
- Set high priority flag
- Broadcast to all nodes
- Repeat transmission (3x for reliability)
- Visual/audio alert on device

**Priority**: 🟡 **MEDIUM** (safety feature)

---

### 7. Mute Functionality
**Location**: `main.cpp:310`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Implement mute functionality
```

**Required**:
- Toggle mute state
- Store mute state
- Apply mute to audio output
- Visual indicator on display
- Persist mute preference (optional)

**Priority**: 🟢 **LOW** (nice-to-have)

---

### 8. Buffer Filter Toggle
**Location**: `main.cpp:321`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Toggle Buffer filter
```

**Required**:
- Integrate with shield_server filter
- Toggle filter on/off
- Visual indicator on display
- Store filter state preference

**Priority**: 🟡 **MEDIUM** (core P31 feature)

---

### 9. Energy Level Tracking
**Location**: `main.cpp:547`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Get actual energy level
display_update_spoons(8, 12); // Placeholder
```

**Required**:
- Implement spoon economy tracking
- Track energy expenditure (operations, time)
- Calculate available energy
- Update display with real values
- Integrate with battery level

**Priority**: 🟡 **MEDIUM** (core P31 feature)

---

## 🟢 ENHANCEMENT TODOs (Nice-to-Have)

### 10. Audio Duration Tracking
**Location**: `shield_server.c:453`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Track actual audio duration using esp_timer or FreeRTOS tick count
```

**Required**:
- Track recording start time
- Calculate duration on stop
- Include duration in metadata
- Display duration on UI

**Priority**: 🟢 **LOW** (enhancement)

---

### 11. Buffer Filter Integration
**Location**: `shield_server.c:649`  
**Status**: ⚠️ **INCOMPLETE**

```cpp
// TODO: Integrate with actual The Buffer filter when available
```

**Required**:
- Implement voltage assessment algorithm
- Detect URGENCY, COERCION, SHAME patterns
- Auto-hold messages ≥6 voltage
- Critical alert for ≥8 voltage
- Generate accommodation documentation

**Priority**: 🟡 **MEDIUM** (core P31 feature)

---

## 📋 COMPONENT STATUS

### Display Component
**Status**: ✅ **INITIALIZED** | ⚠️ **FEATURES INCOMPLETE**

**Working**:
- Display initialization
- Splash screen
- Basic status updates (battery, WiFi, LoRa, time, messages, mode, spoons)

**Missing**:
- Message list UI
- Navigation UI
- Settings menu
- Audio playback UI
- Buffer filter status UI

---

### Audio Engine
**Status**: ✅ **INITIALIZED** | ⚠️ **INTEGRATION INCOMPLETE**

**Working**:
- Codec initialization
- Tone playback
- Recording start/stop
- Volume control

**Missing**:
- Audio buffer management
- Message storage
- Playback queue
- Audio compression/encoding

---

### Mesh Protocol
**Status**: ✅ **INITIALIZED** | ⚠️ **FEATURES INCOMPLETE**

**Working**:
- Packet reception
- Callback registration
- Message storage in shield_server

**Missing**:
- Audio payload transmission
- Emergency message handling
- Message acknowledgment
- Retry mechanism

---

### Shield Server
**Status**: ✅ **INITIALIZED** | ⚠️ **FEATURES INCOMPLETE**

**Working**:
- WiFi AP mode
- HTTP server
- WebSocket support (configured)
- Message storage
- Button broadcasting

**Missing**:
- Buffer filter integration
- Audio duration tracking
- Message metadata API

---

## 🔧 INFRASTRUCTURE GAPS

### 1. Message Storage System
**Status**: ⚠️ **NEEDED**

**Required**:
- Persistent message storage (SPIFFS or NVS)
- Message indexing
- Metadata storage (sender, timestamp, voltage)
- Message expiration/cleanup
- Storage quota management

**Priority**: 🟡 **MEDIUM**

---

### 2. Audio Buffer Management
**Status**: ⚠️ **NEEDED**

**Required**:
- Circular buffer for recording
- Buffer allocation/deallocation
- Compression/encoding (optional)
- Fragmentation for large payloads
- Memory pool management

**Priority**: 🔴 **HIGH** (required for audio transmission)

---

### 3. State Management
**Status**: ⚠️ **NEEDED**

**Required**:
- Application state machine
- Mode tracking (IDLE, RECORDING, PLAYING, etc.)
- Settings persistence
- State synchronization across components

**Priority**: 🟡 **MEDIUM**

---

## 📊 COMPLETION ESTIMATE

### By Priority

**Critical (Must Complete)**:
- Node ID persistence: ~2 hours
- Audio transmission: ~4-6 hours
- RTC integration: ~2-3 hours
- **Total**: ~8-11 hours

**Feature (Should Complete)**:
- Message playback: ~3-4 hours
- Message navigation: ~2-3 hours
- Emergency message: ~2 hours
- Buffer filter toggle: ~1-2 hours
- Energy tracking: ~3-4 hours
- **Total**: ~11-15 hours

**Enhancement (Nice-to-Have)**:
- Audio duration: ~1 hour
- Buffer filter integration: ~6-8 hours
- **Total**: ~7-9 hours

### Overall Estimate
- **Minimum Viable Product**: ~8-11 hours (critical only)
- **Feature Complete**: ~19-26 hours (critical + features)
- **Full Implementation**: ~26-35 hours (all items)

---

## 🎯 RECOMMENDED DEVELOPMENT ORDER

### Phase 1: Core Communication (MVP)
1. ✅ Node ID persistence
2. ✅ Audio transmission
3. ✅ Message playback
4. ✅ Emergency message

**Goal**: Basic voice communication working end-to-end

### Phase 2: User Experience
5. ✅ Message navigation
6. ✅ RTC integration
7. ✅ Mute functionality
8. ✅ Energy tracking

**Goal**: Polished user experience

### Phase 3: P31 Features
9. ✅ Buffer filter integration
10. ✅ Buffer filter toggle
11. ✅ Audio duration tracking

**Goal**: Core P31 ecosystem features

---

## 🚨 BLOCKING ISSUES

### None Currently Identified

All TODOs are feature additions, not blocking issues. The firmware will compile and boot with current implementation.

---

## 📝 NOTES

- Display and audio components are initialized but need UI/UX work
- Mesh protocol receives messages but needs transmission features
- Shield server provides infrastructure but needs filter integration
- All hardware drivers are functional
- BLE test component is complete and tested

---

**Last Updated**: 2026-02-14  
**Next Review**: After Phase 1 completion
