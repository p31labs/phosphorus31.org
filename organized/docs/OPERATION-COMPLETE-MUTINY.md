# OPERATION: COMPLETE MUTINY
## Remove ALL Old Navigation - Tetrahedron Only

---

## THE PROBLEM

**Lightning bolt menu still present:**
```
❌ Interferes with tetrahedron interaction
❌ Blocks 3D manipulation
❌ Competes for attention
❌ Old paradigm still alive
```

**Must be DESTROYED.**

---

## CURSOR PROMPT: KILL ALL OLD NAV

```
TASK: Remove ALL old navigation components completely

PRIORITY: CRITICAL - Old nav interfering with Spatial OS

STEP 1: Find and remove lightning bolt component

Search for the component:

```bash
# Search for lightning bolt
grep -r "lightning\|⚡\|bolt" src/components/

# Search for nav components
find src/components/navigation -type f

# Search for old menu references
grep -r "GeometricNavEngine\|JitterbugNav\|NavOrb" src/
```

Likely locations:
- src/components/navigation/GeometricNavEngine.tsx
- src/components/navigation/JitterbugNav.tsx
- src/components/navigation/NavOrb.tsx
- src/components/layout/Navigation.tsx

DELETE ALL OF THEM:

```bash
rm -rf src/components/navigation
```

---

STEP 2: Remove from layout.tsx

File: src/app/layout.tsx

REMOVE any imports like:

```typescript
// DELETE THESE:
import { GeometricNavEngine } from '@/components/navigation/GeometricNavEngine';
import { JitterbugNav } from '@/components/navigation/JitterbugNav';
import { NavOrb } from '@/components/navigation/NavOrb';
import { Navigation } from '@/components/layout/Navigation';
```

REMOVE any usage in JSX:

```typescript
// DELETE THESE:
<GeometricNavEngine />
<JitterbugNav />
<NavOrb />
<Navigation />
```

FINAL layout.tsx should look like:

```typescript
import { Inter } from 'next/font/google';
import './globals.css';
import { CanvasLayer } from '@/components/layout/CanvasLayer';
import { CanvasKeyProvider } from '@/components/layout/CanvasKeyProvider';
import { LayoutDebug } from '@/components/debug/LayoutDebug';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white overflow-hidden`}>
        <CanvasKeyProvider>
          {/* LAYER 0: Canvas - Interactive Background */}
          <div className="fixed inset-0 z-canvas pointer-events-auto">
            <CanvasLayer />
          </div>
          
          {/* LAYER 1: Content - Overlays */}
          <div className="relative z-content pointer-events-none">
            <div className="pointer-events-auto">
              {children}
            </div>
          </div>
          
          {/* Debug overlay (dev only) */}
          <LayoutDebug />
        </CanvasKeyProvider>
      </body>
    </html>
  );
}
```

NO OTHER COMPONENTS.
JUST: Canvas + Content + Debug

---

STEP 3: Search for floating UI elements

Check for ANY floating buttons/orbs:

```bash
# Search for fixed/absolute positioned nav
grep -r "fixed.*z-\[" src/components/ | grep -i "nav\|menu\|button"

# Search for floating action buttons
grep -r "FloatingActionButton\|FAB" src/

# Search for orb components
grep -r "Orb\|orb" src/components/
```

DELETE ANY floating nav elements found.

---

STEP 4: Check for keyboard shortcuts

File: Search globally for keyboard event listeners

```bash
# Find keyboard shortcuts
grep -r "addEventListener.*keydown\|onKeyDown" src/
grep -r "KeyboardEvent" src/
```

If you find navigation shortcuts (like pressing 'N' to open menu):

REMOVE THEM or UPDATE to only control tetrahedron:

```typescript
// ACCEPTABLE (tetrahedron control):
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'h') router.push('/'); // Home
    if (e.key === 'Escape') router.push('/'); // Back
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, []);

// NOT ACCEPTABLE (opens old menu):
if (e.key === 'n') setMenuOpen(true); // DELETE THIS
```

---

STEP 5: Remove menu state stores

Check for menu-related Zustand stores:

```bash
# Find nav stores
find src/lib/store -name "*nav*" -o -name "*menu*"
```

DELETE any stores like:
- src/lib/store/navStore.ts
- src/lib/store/menuStore.ts

KEEP only:
- sceneStore.ts (Spatial OS)
- tetrahedronStore.ts (geometry state)
- gameStore.ts (mission system)
- etc.

---

STEP 6: Clean up any "Back" buttons

Old navigation might have "Back" buttons that conflict.

Search for them:

```bash
grep -r "Back\|←" src/app/
```

UPDATE Back buttons to use router.push('/'):

```typescript
// GOOD (routes home):
<button onClick={() => router.push('/')}>
  ← Home
</button>

// ALSO GOOD (browser back):
<button onClick={() => router.back()}>
  ← Back
</button>

// BAD (opens old menu):
<button onClick={() => setMenuOpen(false)}>
  ← Back
</button>
```

---

STEP 7: Verify pointer events

CRITICAL: Ensure no elements blocking tetrahedron clicks

Check layout structure:

```typescript
// CORRECT STRUCTURE:

<body>
  {/* Canvas - pointer-events-auto */}
  <div className="fixed inset-0 z-canvas pointer-events-auto">
    <CanvasLayer />
  </div>
  
  {/* Content - pointer-events-none on container */}
  <div className="relative z-content pointer-events-none">
    {/* pointer-events-auto on actual content */}
    <div className="pointer-events-auto">
      {children}
    </div>
  </div>
</body>

// WRONG (blocks tetrahedron):
<div className="fixed inset-0 z-50 pointer-events-auto">
  <OldNavMenu /> {/* Blocks clicks to canvas */}
</div>
```

---

STEP 8: Test tetrahedron interaction

After removing all old nav:

TEST CHECKLIST:

[ ] No lightning bolt visible
[ ] No floating nav buttons
[ ] No menu overlays
[ ] Can click tetrahedron vertices
[ ] Can rotate tetrahedron (if OrbitControls enabled)
[ ] Clicking vertex navigates correctly
[ ] Camera transitions smooth
[ ] No UI blocking 3D interaction
[ ] Cursor changes on vertex hover
[ ] Haptic feedback works

INTERACTION TEST:
1. Hover over vertex → cursor: pointer
2. Click vertex → navigate to page
3. Drag anywhere → rotate tetrahedron (if enabled)
4. No interference from UI

---

STEP 9: Add minimal home indicator (optional)

If you want a small hint for users:

File: src/app/page.tsx

```typescript
'use client';

export default function HomePage() {
  return (
    <div className="fixed inset-0 flex items-end justify-center pb-12 pointer-events-none">
      {/* Minimal hint - non-interactive */}
      <div className="text-center space-y-2">
        <p className="text-sm tracking-[0.3em] uppercase font-bold text-cyan-400/60">
          Click vertices to navigate
        </p>
      </div>
    </div>
  );
}
```

IMPORTANT:
- pointer-events-none (doesn't block clicks)
- Low opacity (doesn't compete)
- Bottom position (out of the way)
- Minimal text (just a hint)

---

STEP 10: Final cleanup

Delete unused files:

```bash
# Remove navigation directory entirely
rm -rf src/components/navigation

# Remove any menu components
find src/components -name "*Menu*" -delete
find src/components -name "*Nav*" -delete

# Remove old nav stores
rm -f src/lib/store/navStore.ts
rm -f src/lib/store/menuStore.ts
```

Search for orphaned imports:

```bash
# Find broken imports
npm run build

# Or use TypeScript to find errors
npx tsc --noEmit
```

Fix any import errors by removing the imports.

---

VERIFICATION CHECKLIST:

**Visual:**
[ ] No lightning bolt
[ ] No floating buttons
[ ] No menu overlays
[ ] No nav bars
[ ] Just tetrahedron + content

**Interaction:**
[ ] Can click vertices
[ ] Can hover vertices
[ ] Camera transitions work
[ ] No UI interference
[ ] Smooth 3D manipulation

**Code:**
[ ] No navigation imports in layout
[ ] No nav components exist
[ ] No menu state stores
[ ] Pointer events configured correctly
[ ] TypeScript builds without errors

**Navigation:**
[ ] Click vertex → navigate
[ ] Back button → go home
[ ] Keyboard shortcuts (optional)
[ ] All routes accessible via vertices
[ ] No dead ends

---

EXPECTED RESULT:

**Before (current):**
- Tetrahedron visible
- Lightning bolt menu present
- Clicks blocked by menu
- Competing navigation systems
- Confusing UX

**After (correct):**
- Tetrahedron visible
- NO other navigation
- Clicks go to tetrahedron
- Single navigation paradigm
- Clear UX

---

COMMON ISSUES:

**Issue: Can't find lightning bolt in code**

Solution:
```bash
# Search more broadly
grep -r "⚡\|lightning\|bolt\|flash" src/
grep -r "fixed.*nav\|absolute.*nav" src/

# Check for SVG icons
grep -r "<svg.*lightning\|<path.*bolt" src/

# Check public folder
ls public/icons/
```

**Issue: Still can't click tetrahedron**

Solution:
1. Check z-index order (canvas should be 0, content 10+)
2. Verify pointer-events-auto on canvas
3. Check for overlaying divs
4. Use browser DevTools to inspect layers
5. Add background color to canvas layer temporarily

**Issue: Clicks go through content to canvas**

Solution:
- Add pointer-events-auto to content container
- Wrap content in explicit div with pointer-events-auto
- Check that content elements have higher z-index

---

EXECUTE THIS PROMPT NOW.

Find ALL old navigation.
Delete EVERY component.
Remove EVERY import.
Clean EVERY reference.
Verify COMPLETE destruction.

Only the tetrahedron survives.
```

---

**⚡ OPERATION: COMPLETE MUTINY ⚡**
