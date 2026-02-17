# P31 Tetrahedron Protocol Restructuring Status

## ✅ Completed

### Directory Structure
- ✅ Created target directory structure:
  - `nodes/node-a-you/` - Your internal state
  - `nodes/node-b-them/` - External signal intake
  - `nodes/node-c-context/` - Environmental calibration
  - `nodes/node-d-shield/` - Processing engine
  - `engine/` - Pure logic functions
  - `bridge/` - Hardware/API bridges
  - `types/` - Type definitions
  - `stores/` - State management (already existed)
  - `hooks/` - React hooks (already existed)
  - `utils/` - Utility functions (already existed)

### Components Moved
- ✅ `YouAreSafe.tsx` → `nodes/node-a-you/YouAreSafe.tsx`
- ✅ `SomaticRegulation.tsx` → `nodes/node-a-you/SomaticRegulation.tsx`
- ✅ `HeartbeatPanel.tsx` → `nodes/node-a-you/HeartbeatPanel.tsx`
- ✅ `MessageInput.tsx` → `nodes/node-b-them/MessageInput.tsx`
- ✅ `CatchersMitt.tsx` → `nodes/node-b-them/CatchersMitt.tsx`
- ✅ `CalibrationReport.tsx` → `nodes/node-c-context/CalibrationReport.tsx`
- ✅ `ResponseComposer.tsx` → `nodes/node-d-shield/ResponseComposer.tsx`

### New Components Created
- ✅ `nodes/node-a-you/SpoonMeter.tsx` - Energy level display
- ✅ `nodes/node-b-them/MessageList.tsx` - Processed message history
- ✅ `nodes/node-c-context/TimelineView.tsx` - Temporal context (placeholder)
- ✅ `nodes/node-c-context/MeshStatus.tsx` - Network status (placeholder)
- ✅ `nodes/node-d-shield/ProgressiveDisclosure.tsx` - Raw content consent gate

### Engine (Pure Functions)
- ✅ `engine/geodesic-engine.ts` - Message translation logic
- ✅ `engine/voltage-calculator.ts` - Emotional intensity scoring
- ✅ `engine/spoon-calculator.ts` - Cognitive cost estimation
- ✅ `engine/genre-detector.ts` - Physics vs Poetics classification
- ✅ `engine/filter-patterns.ts` - Threat detection patterns
- ✅ `engine/shield-filter.ts` - Core filtering logic

### Bridge Modules
- ✅ `bridge/api-client.ts` - REST client for Node One
- ✅ `bridge/websocket-client.ts` - WebSocket connection manager
- ✅ `bridge/audio-bridge.ts` - Audio record/playback
- ✅ `bridge/lora-bridge.ts` - LoRa send/receive

### Types
- ✅ `types/messages.ts` - Message types
- ✅ `types/state.ts` - App state types
- ✅ `types/lora.ts` - LoRa/mesh types
- ✅ `types/api.ts` - REST/WebSocket types
- ✅ `types/index.ts` - Central export

### Configuration
- ✅ Updated `tsconfig.json` with path aliases (`@/*` → `src/*`)
- ✅ `vite.config.ts` already has path alias configured

## ⚠️ Remaining Tasks

### Import Updates Required
All moved components need their import paths updated. Examples:

**Before:**
```typescript
import GOD_CONFIG from '../god.config';
import useShieldStore from '../store/shield.store';
```

**After:**
```typescript
import GOD_CONFIG from '../../config/god.config';
import { useShieldStore } from '../../stores/shield.store';
```

### Components Needing Import Fixes
1. `nodes/node-a-you/YouAreSafe.tsx` - Update imports for `god.config`, `lib/tone-meter`, `lib/haptic-feedback`, `types/shield.types`
2. `nodes/node-a-you/SomaticRegulation.tsx` - Update imports for `god.config`, `lib/haptic-feedback`
3. `nodes/node-a-you/HeartbeatPanel.tsx` - Update imports for `god.config`, `store/heartbeat.store`, peer components
4. `nodes/node-b-them/MessageInput.tsx` - Update imports for `god.config`, `store/shield.store`
5. `nodes/node-b-them/CatchersMitt.tsx` - Update imports for `god.config`, `store/shield.store`
6. `nodes/node-c-context/CalibrationReport.tsx` - Update imports
7. `nodes/node-d-shield/ResponseComposer.tsx` - Update imports

### Store Updates
- Update `stores/shield.store.ts` to import from new locations:
  - `services/geodesic-engine` → `engine/geodesic-engine`
  - `lib/catchers-mitt` → Check if this needs to move or stay
- Update `stores/heartbeat.store.ts` imports if needed

### Missing Components
- `VoltageDetector.tsx` - May need to be created or renamed from `VoltageGauge.tsx`
- `GeodesicEngine.tsx` - Pure function, no UI needed (already in `engine/`)
- `ShieldFilter.tsx` - Pure function, no UI needed (already in `engine/`)

### Services to Update
- `services/geodesic-engine.ts` - Should be replaced by `engine/geodesic-engine.ts`
- Any other services that import from old locations

## 📝 Next Steps

1. **Update all import paths** in moved components
2. **Update store imports** to use new engine locations
3. **Remove old service files** that have been replaced
4. **Run TypeScript check**: `npx tsc --noEmit`
5. **Run build**: `npm run build`
6. **Test in browser**: Verify app still renders

## 🔍 Files to Check

Search for these patterns and update:
- `../god.config` → `../../config/god.config` or `@/config/god.config`
- `../store/` → `../../stores/` or `@/stores/`
- `../services/geodesic-engine` → `../../engine/geodesic-engine` or `@/engine/geodesic-engine`
- `../lib/` → Check if lib files should move or stay
- `../types/` → `../../types/` or `@/types/`

## 📦 Structure Summary

```
src/
├── main.tsx
├── App.tsx
├── nodes/
│   ├── node-a-you/        ✅ Created
│   ├── node-b-them/       ✅ Created
│   ├── node-c-context/     ✅ Created
│   └── node-d-shield/      ✅ Created
├── engine/                 ✅ Created (pure functions)
├── bridge/                 ✅ Created
├── types/                  ✅ Created
├── stores/                 ✅ Exists
├── hooks/                  ✅ Exists
├── utils/                  ✅ Exists
└── styles/                 ✅ Exists
```
