# BUILD OPTIMIZATION REPORT
**Date:** 2026-02-14  
**Swarm:** SWARM 05 — SCOPE FRONTEND AUDIT  
**Agent:** 7 — Build Optimization

---

## CURRENT CONFIGURATION

### Vite Config (`vite.config.ts`)
**Status:** ✅ Already Optimized

**Optimizations Present:**
- ✅ **Terser minification** with `drop_console` and `drop_debugger`
- ✅ **Manual chunks** — React, Three.js, Zustand separated
- ✅ **CSS minification** enabled
- ✅ **Assets inline limit** — 4KB (small assets inlined)
- ✅ **Base path** — `/web/` (SPIFFS-ready)
- ✅ **Chunk size warning** — 200KB threshold

**Chunk Strategy:**
1. `react-vendor` — React + React DOM
2. `three-core` — Three.js core (separate from R3F)
3. `react-three` — React Three Fiber + Drei
4. `zustand` — Zustand state management
5. `vendor` — Other node_modules

---

## BUILD SCRIPTS

### Current Scripts (`package.json`)
```json
{
  "build": "tsc && vite build",
  "build:spiffs": "tsc && vite build && echo 'Build complete. Copy dist/* to firmware/node-one-esp-idf/spiffs/web/ manually on Windows.'",
  "size": "vite build && powershell -Command \"Get-ChildItem -Path dist -Recurse -File | Measure-Object -Property Length -Sum | Select-Object @{Name='Size(MB)';Expression={[math]::Round($_.Sum/1MB,2)}}\""
}
```

**Status:** ✅ Good, but could be enhanced

---

## SIZE TARGETS

### Full Build (with Three.js)
**Target:** <2MB  
**Status:** ⚠️ Need to verify actual size

**Action Required:**
- Run `npm run size` to check current bundle size
- If >2MB, consider lazy-loading more Three.js components

### Lite Build (no Three.js)
**Target:** <500KB  
**Status:** ⚠️ Not yet implemented

**Action Required:**
- Create lite build config that excludes Three.js
- Use for SPIFFS deployment

### SPIFFS Build
**Target:** <500KB  
**Status:** ⚠️ Currently uses full build

**Action Required:**
- Use lite build for SPIFFS
- Or create separate entry point without 3D components

---

## RECOMMENDATIONS

### 1. Create Lite Build Config
**Priority:** High

**Implementation:**
```typescript
// vite.config.lite.ts
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './src/main-lite.tsx', // Entry without Three.js imports
      },
    },
  },
});
```

**Or use environment variable:**
```typescript
// vite.config.ts
const isLite = process.env.VITE_LITE === 'true';

export default defineConfig({
  build: {
    rollupOptions: {
      external: isLite ? ['three', '@react-three/fiber', '@react-three/drei'] : [],
    },
  },
});
```

### 2. Enhance Build Scripts
**Priority:** Medium

**Add to `package.json`:**
```json
{
  "build:lite": "VITE_LITE=true tsc && vite build",
  "build:spiffs": "npm run build:lite && echo 'SPIFFS build complete. Copy dist/* to firmware/node-one-esp-idf/spiffs/web/'",
  "analyze": "vite build --mode analyze"
}
```

### 3. Lazy-Load Three.js Components
**Priority:** High (if bundle >2MB)

**Current Status:**
- Some components already lazy-loaded
- Need to verify all 3D components are lazy

**Action:**
- Audit all Three.js imports
- Convert to `React.lazy()` where needed
- Ensure 3D components never block initial render

### 4. Bundle Analysis
**Priority:** Medium

**Tool:** `rollup-plugin-visualizer` (already in dependencies)

**Add to `vite.config.ts`:**
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, filename: 'dist/stats.html' }),
  ],
});
```

---

## SPIFFS DEPLOYMENT

### Current Process
1. Run `npm run build:spiffs`
2. Manually copy `dist/*` to `firmware/node-one-esp-idf/spiffs/web/`

### Recommended Process
1. Run `npm run build:lite` (creates <500KB build)
2. Copy `dist/*` to SPIFFS directory
3. Flash to ESP32

### Windows Script
```powershell
# build-spiffs.ps1
npm run build:lite
Copy-Item -Path "dist\*" -Destination "..\firmware\node-one-esp-idf\spiffs\web\" -Recurse -Force
Write-Host "SPIFFS build deployed"
```

---

## VERIFICATION CHECKLIST

- [ ] Run `npm run size` — Check full build size
- [ ] Verify chunk sizes <200KB each
- [ ] Test lite build (if implemented)
- [ ] Verify SPIFFS build <500KB
- [ ] Test production build loads correctly
- [ ] Verify Three.js components lazy-load
- [ ] Check bundle analyzer output

---

## CURRENT STATUS

✅ **Vite config optimized** — Manual chunks, minification, CSS minify  
✅ **Base path set** — `/web/` for SPIFFS  
⚠️ **Lite build not implemented** — Need to create  
⚠️ **Bundle size unknown** — Need to measure  
⚠️ **Three.js lazy-loading** — Need to verify all components  

---

## NEXT STEPS

1. **Measure current bundle size** — Run `npm run size`
2. **Create lite build config** — Exclude Three.js for SPIFFS
3. **Verify lazy-loading** — Audit all Three.js imports
4. **Add bundle analyzer** — Visualize bundle composition
5. **Test SPIFFS deployment** — Verify <500KB target

---

**The Scope shows the truth. The Buffer protects from the lie. The mesh holds.** 🔺
