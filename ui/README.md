# The Scope - P31 Dashboard

Dashboard and visualization layer for the P31 ecosystem. Shows network health, signal strength, and system status. Built with Vite, React, TypeScript, and Three.js.

## ⚛️ Quantum-optimized

- **QuantumCanvas** — Fisher–Escolà, tetrahedron trust geometry, golden-ratio spirals, coherence-driven particles.
- **IVM lattice** — Isotropic vector matrix (Fuller) as 3D scaffold; `engine/ivm.ts`, IVMLatticePoints, IVMLatticeEdges.
- **VoltageIcosahedron** — Buffer visualization; voltage-driven rotation, color (green → red), jitter at overload.
- **MATA Demo Cockpit** — Timeline scrub (dysregulation → intervention → stability); spoon gauge, mesh log, 3D Buffer.
- **Quantum store** — Zustand: coherence, phase, purity, entangled nodes, UI adaptation (glow, animation speed).
- **Geodesic engine** — Message curvature/complexity; voltage and genre for ontological volume.
- **Meta** — `index.html`: `p31:quantum-optimized`, title "P31 Scope · Quantum-Optimized Dashboard".

## 🚀 Features

### Core Development Infrastructure
- **Hot Module Replacement (HMR)** - Instant updates during development
- **TypeScript Support** - Full type safety and IntelliSense
- **ESLint & Prettier** - Code quality and formatting
- **Vite Build System** - Fast development server and optimized builds

### 3D Graphics & Performance
- **Three.js Integration** - Full 3D graphics capabilities
- **React Three Fiber** - React bindings for Three.js
- **Drei Helpers** - Essential Three.js helpers and abstractions
- **Performance Monitoring** - Real-time performance metrics
- **Scene Inspector** - Interactive 3D scene debugging

### Advanced Components
- **Quantum Canvas** - 3D visualization component with geodesic analysis
- **Performance Monitor** - Real-time performance tracking
- **Scene Inspector** - Interactive 3D debugging tools
- **Toast System** - User feedback and notifications

### Services & Utilities
- **History Service** - Message and interaction history management
- **CatchersMitt** - 60-second message batching buffer
- **Geodesic Engine** - Geodesic analysis and message processing
- **Toast System** - User feedback and notifications

## 📦 Installation

**From the repo root (recommended for workspaces):**

```bash
cd C:\Users\sandra\Downloads\p31
npm install --legacy-peer-deps
```

Then run the Scope:

```bash
cd ui
npm run dev
```

**If you see `Cannot find module '../caching.js'` (Babel):** The root `package.json` pins `@babel/core` and the UI declares it explicitly. Do a clean reinstall: close any running dev servers and terminals, then from the repo root run:

```powershell
Remove-Item -Recurse -Force node_modules, ui\node_modules, cognitive-shield\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
cd ui; npm run dev
```

**If you see ERESOLVE / peer dependency conflicts:** Use `npm install --legacy-peer-deps` from the repo root. The root has `installConfig.legacyPeerDeps: true` so a plain `npm install` may also work.

## 🏃‍♂️ Running the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5173` (or another available port).

## 🏗️ Project Structure

```
ui/
├── src/
│   ├── components/
│   │   ├── 3d/           # 3D graphics components
│   │   │   ├── PerformanceMonitor.tsx
│   │   │   └── SceneInspector.tsx
│   │   └── ui/           # UI components
│   │       └── QuantumCanvas.tsx
│   ├── services/         # Business logic services
│   │   ├── geodesic-engine.ts
│   │   └── history.service.ts
│   ├── lib/              # Utility libraries
│   │   └── catchers-mitt.ts
│   ├── config/           # Configuration files
│   │   └── god.config.ts
│   └── test-dev-server.ts # Development server test
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🌍 Quantum Geodesic Platform

- **World Builder** — Code (P31 language) or visual mode; geodesic analysis (stability, Maxwell's rule, weak points); coherence HUD.
- **Colyseus (optional)** — Multiplayer sync. Set `VITE_COLYSEUS_URL` in `.env` (see `.env.example`). Install `colyseus.js` for the client; run the Colyseus server from `../server` with the GeodesicRoom.
- **Geodesic WASM (optional)** — From repo root: `cd geodesic-engine && wasm-pack build --target web`, then copy `pkg/` to `ui/src/geodesic-engine`. The app uses JS `engine/structure-analysis.ts` by default; you can switch the hook to the WASM module for heavier workloads.

## 🔧 Configuration

### Vite Configuration (`vite.config.ts`)
- **React Plugin** - JSX/TSX support
- **TypeScript Paths** - Path mapping for easier imports
- **Development Server** - Port 5173 with CORS enabled
- **Build Optimization** - Production-ready builds

### TypeScript Configuration (`tsconfig.json`)
- **Strict Type Checking** - Full type safety
- **ES2020 Target** - Modern JavaScript features
- **Module Resolution** - Path mapping support

### ESLint Configuration
- **React Hooks** - Hook usage validation
- **TypeScript** - Type-aware linting
- **Prettier Integration** - Consistent formatting

## 🎯 Key Components

### QuantumCanvas
A sophisticated 3D visualization component that:
- Renders interactive 3D scenes
- Integrates geodesic analysis
- Provides real-time feedback
- Supports performance monitoring

### PerformanceMonitor
Real-time performance tracking that:
- Monitors frame rate
- Tracks memory usage
- Measures render times
- Provides performance insights

### SceneInspector
Interactive debugging tools that:
- Visualize 3D scene hierarchy
- Inspect object properties
- Debug lighting and materials
- Monitor scene performance

## 🛠️ Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Code with Hot Reload**
   - Changes are reflected instantly
   - TypeScript errors show in browser
   - Performance metrics update in real-time

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📊 Performance Features

### Real-time Monitoring
- Frame rate tracking
- Memory usage monitoring
- Render performance metrics
- Component lifecycle tracking

### Optimization Tools
- Bundle size analysis
- Import optimization
- Tree shaking
- Code splitting

## 🔌 Available Scripts

- `dev` - Start development server with HMR
- `build` - Create production build
- `preview` - Preview production build locally
- `lint` - Run ESLint
- `format` - Format code with Prettier

## 🎨 Styling

The project uses CSS-in-JS with styled-components for:
- Component-level styling
- Responsive design
- Theme support
- Animation support

## 🚀 Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```
   For a subpath (e.g. GitHub Pages at `username.github.io/p31`):  
   `VITE_BASE_PATH=/p31/ npm run build`

2. The build output is in the `dist/` directory.
3. Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

**GitHub Pages & Cloudflare Pages:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for base path, SPA fallback (404.html / `_redirects`), and wallet graceful degradation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include reproduction steps when possible

---

**Built with ❤️ for 3D graphics development**