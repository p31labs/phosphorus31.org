# WORKING TETRAHEDRON SETUP

## 1. ROOT LAYOUT (src/app/layout.tsx)

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-hidden">
        {/* CANVAS LAYER - Only on home */}
        {isHome && (
          <div className="fixed inset-0 z-0">
            <Canvas
              camera={{ position: [0, 0, 7], fov: 50 }}
              gl={{ alpha: true, antialias: true }}
            >
              {/* Lights */}
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              
              {/* Tetrahedron */}
              <SimpleTetrahedron />
            </Canvas>
          </div>
        )}

        {/* CONTENT LAYER */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

// SIMPLE TETRAHEDRON COMPONENT (inline for now)
function SimpleTetrahedron() {
  // Tetrahedron vertex positions
  const positions: [number, number, number][] = [
    [0, 1.5, 0],           // Top
    [-1, -0.5, 1],         // Front-left
    [1, -0.5, 1],          // Front-right
    [0, -0.5, -1.5],       // Back
  ];

  // Edge connections (all pairs)
  const edges: [number, number][] = [
    [0, 1], [0, 2], [0, 3], // Top to all
    [1, 2], [1, 3], [2, 3], // Bottom triangle
  ];

  return (
    <group>
      {/* Vertices */}
      {positions.map((pos, i) => (
        <mesh key={`vertex-${i}`} position={pos}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Edges */}
      {edges.map(([i, j], idx) => {
        const start = positions[i];
        const end = positions[j];
        const mid = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2,
          (start[2] + end[2]) / 2,
        ] as [number, number, number];

        const length = Math.sqrt(
          Math.pow(end[0] - start[0], 2) +
          Math.pow(end[1] - start[1], 2) +
          Math.pow(end[2] - start[2], 2)
        );

        return (
          <mesh key={`edge-${idx}`} position={mid}>
            <cylinderGeometry args={[0.02, 0.02, length, 8]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>
        );
      })}
    </group>
  );
}
```

---

## 2. HOME PAGE (src/app/page.tsx)

```tsx
'use client';

export default function HomePage() {
  return (
    <div className="h-screen flex items-center justify-center">
      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-cyan-400 text-sm tracking-wider">
          CLICK A VERTEX TO EXPLORE
        </p>
      </div>
    </div>
  );
}
```

---

## 3. GLOBALS CSS (src/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  background: #000;
  color: #fff;
}

/* Prevent canvas text selection */
canvas {
  user-select: none;
  -webkit-user-select: none;
  outline: none;
}
```

---

## 4. TROUBLESHOOTING

### Issue: Black screen, no tetrahedron

**Check 1: Console errors?**
```
F12 → Console tab
Look for errors about:
- Canvas
- Three.js
- React Three Fiber
```

**Check 2: Is pathname correct?**
```tsx
// Add this to see pathname
console.log('Current path:', pathname);
console.log('Is home?', isHome);
```

**Check 3: Is Canvas rendering?**
```tsx
// Add this to Canvas div
<div className="fixed inset-0 z-0 bg-red-500">
  {/* If you see red, div is there but Canvas isn't rendering */}
  <Canvas>...</Canvas>
</div>
```

**Check 4: Camera position**
```tsx
// Try moving camera closer
<Canvas camera={{ position: [0, 0, 5] }}>
```

**Check 5: Dependencies installed?**
```bash
npm list @react-three/fiber
npm list @react-three/drei
npm list three
```

If missing:
```bash
npm install three@latest @react-three/fiber@latest @react-three/drei@latest
```

---

## 5. MINIMAL TEST

If still broken, use this ULTRA MINIMAL test:

```tsx
// src/app/layout.tsx

'use client';

import { Canvas } from '@react-three/fiber';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'black' }}>
        {/* JUST A CUBE TO TEST */}
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 0 
        }}>
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <mesh>
              <boxGeometry />
              <meshStandardMaterial color="cyan" />
            </mesh>
          </Canvas>
        </div>
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
```

**If you see cyan cube → Canvas works → Issue is tetrahedron code**

**If you see nothing → Canvas broken → Check dependencies**

---

## 6. PACKAGE.JSON CHECK

Make sure you have:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^14.2.0",
    "three": "^0.171.0",
    "@react-three/fiber": "^8.17.10",
    "@react-three/drei": "^9.114.3"
  }
}
```

---

## 7. NEXT.JS CONFIG

Make sure next.config.js allows Canvas:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Canvas SSR workaround
  webpack: (config) => {
    config.externals.push({
      canvas: 'commonjs canvas',
    });
    return config;
  },
};

module.exports = nextConfig;
```

---

## 8. IF STILL BROKEN

Send me:
1. Console errors (F12 → Console)
2. Network errors (F12 → Network)
3. package.json dependencies
4. Current layout.tsx code

And I'll debug it.

---

## THE GOAL

When working, you should see:

```
Black screen
4 cyan glowing spheres (vertices)
6 cyan lines connecting them (edges)
Slowly rotating
"CLICK A VERTEX TO EXPLORE" at bottom
```

That's the WYE configuration.

Click vertex → Transition to DELTA (module page).
