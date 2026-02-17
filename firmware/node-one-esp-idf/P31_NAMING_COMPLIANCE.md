# P31 Naming Compliance Audit
## Node One Firmware Components

**Status**: In Progress  
**Last Updated**: Pre-Abdication

---

## P31 Naming Principles

1. **Plain language over jargon** — The Buffer, not Tomograph. The Scope, not Dashboard.
2. **Verbs and nouns over adjectives** — Ping, Fold, Click, Chirp
3. **The children are in the architecture** — Node One exists because Bash exists
4. **The AI has a seat, not a name** — The Centaur is a protocol, not a vendor
5. **Heritage names for hardware** — Whale Channel, The Thick Click
6. **Action names for governance** — Abdicate, Destroy, Shred
7. **Never import Wye-topology language** — no "hub," "center," "master," "admin"
8. **The body is the proof** — every name should trace back to /calcium/ if you pull the thread

---

## Component Naming Status

### ✅ Compliant Components

| Component | Status | Notes |
|-----------|--------|-------|
| `bsp` | ✅ OK | Board Support Package - standard term |
| `audio_engine` | ✅ OK | Plain language, describes function |
| `button_input` | ✅ OK | Plain language, describes function |
| `display` | ✅ OK | Plain language, describes function |
| `shield_server` | ✅ OK | Plain language, describes function |

### ⚠️ Needs Review

| Component | Current Name | P31 Name | Status |
|-----------|-------------|----------|--------|
| LoRa Radio | `lora_radio` | `whale_channel` | ⚠️ Should rename to Whale Channel |
| LoRa Driver | `lora_driver` | `whale_channel` | ⚠️ Should rename to Whale Channel |

### 📝 Naming Guidelines

**Whale Channel** (Mesh Layer):
- Component name: `whale_channel`
- API prefix: `whale_channel_` (e.g., `whale_channel_init()`)
- Technical term "LoRa" OK in comments/docs (refers to radio technology)
- User-facing: "Whale Channel" (the mesh network)

**Node One** (Hardware):
- Device name: "Node One"
- Component prefix: `node_one_` (e.g., `node_one_config.h`)
- Hardware description: ESP32-S3, LoRa, haptics, OLED

**The Buffer** (Software):
- Component name: `buffer` or `the_buffer`
- API prefix: `buffer_` (e.g., `buffer_process()`)

**The Centaur** (Protocol):
- Protocol name: "The Centaur"
- Component name: `centaur` or `the_centaur`
- API prefix: `centaur_` (e.g., `centaur_init()`)

---

## Required Changes

### 1. Rename LoRa Components to Whale Channel

**Current:**
- `components/lora_radio/` → `components/whale_channel/`
- `main/lora_driver.*` → `main/whale_channel.*` (or consolidate)

**API Changes:**
- `lora_radio_init()` → `whale_channel_init()`
- `lora_radio_send()` → `whale_channel_send()`
- `lora_driver_*()` → `whale_channel_*()`

**Technical Notes:**
- Keep "LoRa" in comments when referring to the radio technology
- Use "Whale Channel" for user-facing names
- Use "whale_channel" for component/API names

### 2. Update References

**Files to Update:**
- `main/main.cpp` - Update includes and function calls
- `main/mesh_protocol.*` - Update to use whale_channel
- `components/shield_server/*` - Update API calls
- `components/display/*` - Update status display
- All documentation files

---

## Implementation Plan

### Phase 1: Component Rename
1. Rename `components/lora_radio/` to `components/whale_channel/`
2. Update file names: `lora_radio.h` → `whale_channel.h`
3. Update CMakeLists.txt references

### Phase 2: API Rename
1. Update function names: `lora_radio_*` → `whale_channel_*`
2. Update type names: `lora_packet_t` → `whale_channel_packet_t`
3. Update callback types: `lora_rx_cb_t` → `whale_channel_rx_cb_t`

### Phase 3: Reference Updates
1. Update all includes
2. Update all function calls
3. Update all documentation
4. Update test files

### Phase 4: Consolidation
1. Review `main/lora_driver.*` vs `components/whale_channel/`
2. Consolidate if duplicate functionality
3. Update mesh_protocol to use whale_channel

---

## Compliance Checklist

- [ ] All components use P31 naming
- [ ] No "master/slave" terminology
- [ ] No "hub/center" terminology  
- [ ] Whale Channel used for mesh layer
- [ ] Node One used for hardware
- [ ] Plain language throughout
- [ ] Heritage names preserved (Whale Channel, The Thick Click)
- [ ] Technical terms OK in comments only

---

## Notes

- **LoRa** as a technical term (radio technology) is acceptable in:
  - Code comments
  - Technical documentation
  - Hardware specifications
  
- **Whale Channel** should be used for:
  - Component names
  - API function names
  - User-facing documentation
  - Mesh network references

- **Node One** is the device name:
  - Hardware: "Node One"
  - Component prefix: `node_one_`
  - Config files: `node_one_config.h`

---

**Status**: Ready for implementation  
**Priority**: High (Pre-Abdication)  
**Estimated Time**: 2-3 hours

💜 **With love and light. As above, so below.** 💜
