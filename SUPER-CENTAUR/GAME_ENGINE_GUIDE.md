# Constructor's Challenge - Game Engine Guide

## 🎮 Overview

The Constructor's Challenge is a 3D geometric building game built with React Three Fiber and Three.js. Players construct stable structures using tetrahedrons, octahedrons, icosahedrons, struts, and hubs to earn LOVE tokens and progress through tiers.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Run the launch script:
   ```bash
   .\LAUNCH_GAME.bat
   ```
3. Open your browser to `http://localhost:5173`

### Manual Installation
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## 🎯 Game Controls

### Building Controls
- **Left Click**: Place pieces
- **Right Click**: Select pieces
- **1-5**: Change piece type
  - `1`: Tetrahedron
  - `2`: Octahedron
  - `3`: Icosahedron
  - `4`: Strut
  - `5`: Hub
- **W/M/C/Q**: Change material
  - `W`: Wood
  - `M`: Metal
  - `C`: Crystal
  - `Q`: Quantum
- **+/-**: Scale pieces up/down
- **G**: Toggle grid visibility
- **V**: Toggle snap to grid
- **T**: Test structure stability
- **Escape**: Pause game

### Camera Controls
- **Left Click + Drag**: Rotate view
- **Right Click + Drag**: Pan view
- **Scroll Wheel**: Zoom in/out

## 🏗️ Game Mechanics

### Piece Types
1. **Tetrahedron**: Basic building block, stable pyramid shape
2. **Octahedron**: Eight-faced polyhedron, good for connections
3. **Icosahedron**: Twenty-faced polyhedron, complex geometry
4. **Strut**: Connecting rod between pieces
5. **Hub**: Central connection point for multiple pieces

### Materials
- **Wood**: Basic material, moderate properties
- **Metal**: Strong material, higher stability
- **Crystal**: Transparent material, special visual effects
- **Quantum**: Advanced material, unique properties

### Scoring System
- **LOVE Tokens**: Earned for successful constructions
- **Build Streak**: Bonus for consecutive successful builds
- **Tier Progression**: Unlock new materials and pieces
- **Challenge Completion**: Complete specific construction tasks

### Structure Validation
- **Geometric Stability**: Physics-based stability testing
- **Connection Integrity**: Proper piece connections required
- **Load Testing**: Simulated stress testing
- **Material Properties**: Different materials have different strengths

## 🎨 Visual Features

### Real-time Rendering
- **3D Graphics**: High-quality Three.js rendering
- **Lighting Effects**: Dynamic lighting and shadows
- **Material Shaders**: Realistic material appearances
- **Post-processing**: Bloom and visual effects

### User Interface
- **HUD Display**: Real-time stats and progress
- **Build Controls**: On-screen control buttons
- **Instructions Overlay**: Context-sensitive help
- **Error Messages**: Clear feedback for invalid actions

## 🔧 Technical Architecture

### Frontend Stack
- **React**: Component-based UI framework
- **React Three Fiber**: Three.js integration for React
- **Three.js**: 3D graphics library
- **Tailwind CSS**: Styling framework
- **React Router**: Client-side routing

### Game Engine Components
- **SceneManager**: 3D scene management and rendering
- **BuildMode**: Building and placement logic
- **PhysicsWorld**: Physics simulation (placeholder)
- **ChallengeEngine**: Challenge system and validation
- **GameEngine**: Main game loop and state management

### Backend Integration
- **REST API**: Backend communication
- **Authentication**: Secure user authentication
- **Progress Saving**: Player progress persistence
- **Multiplayer Support**: Future real-time collaboration

## 🛠️ Development

### Project Structure
```
src/
├── engine/           # Game engine core
│   ├── core/        # Main engine components
│   ├── building/    # Building mode logic
│   ├── physics/     # Physics integration
│   └── types/       # TypeScript definitions
├── frontend/        # React application
│   ├── components/  # UI components
│   ├── pages/       # Game pages
│   └── routes/      # Route definitions
└── types/          # Shared type definitions
```

### Adding New Features
1. **New Piece Types**: Add to `GeometricPrimitiveType` enum and implement geometry
2. **New Materials**: Add to `MaterialType` enum and implement shaders
3. **New Challenges**: Extend `ChallengeEngine` with validation logic
4. **New UI**: Create React components in `frontend/components/`

### Testing
```bash
# Run frontend tests
cd frontend
npm test

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## 🎯 Future Enhancements

### Planned Features
- **Multiplayer Mode**: Real-time collaborative building
- **Advanced Physics**: Full Rapier3D integration
- **Procedural Challenges**: AI-generated construction tasks
- **VR Support**: Virtual reality building experience
- **Mobile Support**: Touch controls for mobile devices
- **Asset Import**: Import custom 3D models
- **Scripting**: Custom building automation scripts

### Performance Optimizations
- **Level of Detail**: Dynamic geometry simplification
- **Instanced Rendering**: Efficient rendering of similar objects
- **Web Workers**: Background physics calculations
- **Caching**: Asset and computation caching

## 🐛 Troubleshooting

### Common Issues
1. **Game won't load**: Check browser console for errors
2. **Performance issues**: Reduce graphics quality in settings
3. **Controls not working**: Check keyboard shortcuts and mouse buttons
4. **Missing dependencies**: Run `npm install` in both root and frontend

### Browser Support
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Partial support (some features may be limited)
- **Edge**: Full support

### System Requirements
- **CPU**: Modern dual-core processor
- **RAM**: 4GB minimum, 8GB recommended
- **GPU**: WebGL 2.0 compatible graphics card
- **Browser**: Latest version of Chrome, Firefox, or Edge

## 📚 Additional Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Constructor's Challenge** - Building the future, one geometric shape at a time! 🏗️✨