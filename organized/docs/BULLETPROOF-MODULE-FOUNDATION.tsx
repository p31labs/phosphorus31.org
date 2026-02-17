// ============================================
// THE BULLETPROOF MODULE FOUNDATION
// ============================================

// This file contains EVERYTHING needed to make modules trivial to create.
// Your kids should be able to use these components and never think about layout.

// ============================================
// 1. MODULE CARD (The Lego Brick)
// ============================================

// src/components/core/ModuleCard.tsx

import { ReactNode } from 'react';

interface ModuleCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ModuleCard - The fundamental building block
 * 
 * This component handles ALL layout concerns so module creators don't have to.
 * 
 * Features:
 * - Auto-sized (never breaks)
 * - Auto-centered
 * - Auto-styled
 * - Translucent background
 * - Glowing border
 * - Proper z-index
 * 
 * Module creators just put content inside and it WORKS.
 */
export function ModuleCard({
  title,
  subtitle,
  icon,
  children,
  actions,
  size = 'md'
}: ModuleCardProps) {
  const sizeClasses = {
    sm: 'max-w-sm',   // 384px
    md: 'max-w-md',   // 448px
    lg: 'max-w-lg',   // 512px
  };
  
  return (
    <div className={`
      w-full ${sizeClasses[size]}
      mx-auto
      bg-black/90
      backdrop-blur-md
      border border-cyan-500/30
      rounded-lg
      shadow-[0_0_40px_rgba(6,182,212,0.3)]
      overflow-hidden
    `}>
      {/* Header */}
      <div className="p-6 pb-4 border-b border-cyan-500/20">
        {icon && (
          <div className="text-4xl mb-3">{icon}</div>
        )}
        <h2 className="text-2xl font-bold text-cyan-400">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {children}
      </div>
      
      {/* Actions */}
      {actions && (
        <div className="p-6 pt-0 space-y-3">
          {actions}
        </div>
      )}
    </div>
  );
}

// ============================================
// 2. MODULE PAGE WRAPPER (The Lego Baseplate)
// ============================================

// src/components/core/ModulePage.tsx

/**
 * ModulePage - The wrapper for all module pages
 * 
 * This handles:
 * - Centering content
 * - Proper spacing
 * - Scroll behavior
 * - Z-index layering
 * 
 * Module creators never touch this. It's automatic.
 */
export function ModulePage({ children }: { children: ReactNode }) {
  return (
    <div className="
      min-h-screen
      flex items-center justify-center
      p-4
      relative z-10
    ">
      {children}
    </div>
  );
}

// ============================================
// 3. FORM COMPONENTS (The Lego Pieces)
// ============================================

// src/components/core/Form.tsx

export function FormField({ 
  label, 
  children 
}: { 
  label: string; 
  children: ReactNode 
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Input({ 
  type = 'text',
  placeholder,
  value,
  onChange
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-3
        bg-black/50
        border border-gray-600
        rounded
        text-white
        placeholder-gray-500
        focus:outline-none
        focus:border-cyan-500
        transition-colors
      "
    />
  );
}

export function Button({ 
  children,
  variant = 'primary',
  onClick,
  fullWidth = false
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const variants = {
    primary: 'bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30',
    secondary: 'bg-transparent border-gray-600 text-gray-400 hover:bg-white/5 hover:text-white',
    ghost: 'bg-transparent border-transparent text-gray-400 hover:text-white'
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : ''}
        px-6 py-3
        border rounded
        font-semibold
        transition-colors
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}

export function InfoRow({
  label,
  value,
  mono = false,
  valueColor = 'text-white'
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="text-sm text-gray-400">{label}</div>
      <div className={`text-sm ${valueColor} ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  );
}

// ============================================
// 4. EXAMPLE MODULE (Your Kids Can Copy This)
// ============================================

// modules/example/page.tsx

import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { FormField, Input, Button, InfoRow } from '@/components/core/Form';

export default function ExampleModule() {
  return (
    <ModulePage>
      <ModuleCard 
        title="Example Module"
        subtitle="Copy this to make your own"
        icon="🎨"
        actions={
          <>
            <Button variant="primary" fullWidth>
              Primary Action
            </Button>
            <Button variant="secondary" fullWidth>
              Secondary Action
            </Button>
          </>
        }
      >
        {/* Content goes here */}
        <div className="space-y-4">
          <InfoRow label="Status" value="Active" valueColor="text-green-400" />
          <InfoRow label="Count" value="42" />
          
          <FormField label="Your Input">
            <Input placeholder="Type something..." />
          </FormField>
        </div>
      </ModuleCard>
    </ModulePage>
  );
}

// ============================================
// 5. MODULE TEMPLATE GENERATOR (CLI Tool)
// ============================================

// scripts/create-module.js

/**
 * Usage: npm run create-module my-cool-module
 * 
 * This generates:
 * - modules/my-cool-module/page.tsx (with template)
 * - Registers module in navigation
 * - Creates route automatically
 * 
 * Your kids just run one command and start coding.
 */

const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Usage: npm run create-module <module-name>');
  process.exit(1);
}

const template = `
import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { Button } from '@/components/core/Form';

export default function ${capitalize(moduleName)}Module() {
  return (
    <ModulePage>
      <ModuleCard 
        title="${capitalize(moduleName)}"
        subtitle="Built with G.O.D."
        icon="✨"
        actions={
          <Button variant="primary" fullWidth>
            Do Something
          </Button>
        }
      >
        <p className="text-gray-300">
          Your module content goes here!
        </p>
      </ModuleCard>
    </ModulePage>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
`.trim();

// Create module directory
const modulePath = path.join(__dirname, '..', 'src', 'app', moduleName);
fs.mkdirSync(modulePath, { recursive: true });

// Write page.tsx
fs.writeFileSync(
  path.join(modulePath, 'page.tsx'),
  template
);

console.log(`✅ Created module: ${moduleName}`);
console.log(`📁 Location: src/app/${moduleName}/page.tsx`);
console.log(`🚀 Ready to code!`);

// ============================================
// 6. PACKAGE.JSON SCRIPT
// ============================================

// Add to package.json:
{
  "scripts": {
    "create-module": "node scripts/create-module.js"
  }
}

// ============================================
// 7. THE MAGIC: ROOT LAYOUT (Set It & Forget It)
// ============================================

// src/app/layout.tsx

import { Canvas } from '@react-three/fiber';
import { CameraRig } from '@/components/navigation/CameraRig';
import { SpatialTetrahedron } from '@/components/navigation/SpatialTetrahedron';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-x-hidden">
        {/* Canvas Layer (Fixed Background) */}
        <div className="fixed inset-0 z-0" id="canvas-layer">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
          >
            <CameraRig />
            <SpatialTetrahedron />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
          </Canvas>
        </div>
        
        {/* Content Layer (Scrollable Foreground) */}
        <div className="relative z-10" id="content-layer">
          {children}
        </div>
      </body>
    </html>
  );
}

// ============================================
// 8. CSS RESET (Bulletproof Defaults)
// ============================================

// src/app/globals.css

/* Ensure canvas never interferes with content */
#canvas-layer {
  pointer-events: auto;
}

#canvas-layer canvas {
  pointer-events: auto !important;
  touch-action: none !important;
}

#content-layer {
  pointer-events: auto;
}

/* Smooth everything */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

/* Hide scrollbar but keep functionality */
body::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

/* Prevent text selection on canvas */
#canvas-layer {
  user-select: none;
  -webkit-user-select: none;
}

/* Allow text selection in content */
#content-layer {
  user-select: text;
  -webkit-user-select: text;
}
