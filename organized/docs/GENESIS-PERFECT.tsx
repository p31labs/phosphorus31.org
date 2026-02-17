// src/screens/GenesisScreen.tsx
// PERFECT VERSION: Just starfield + pulsing orb (orb IS the button)

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/appStore';

export default function GenesisScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const startFormation = useAppStore(s => s.startFormation);
  
  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create stars
    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }
    
    function animate() {
      if (!ctx || !canvas) return;
      
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and move stars
      stars.forEach(star => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(star.x, star.y, star.size, star.size);
        
        // Twinkle
        if (Math.random() > 0.99) {
          star.size = Math.random() * 2;
        }
        
        // Drift
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Pulsing orb (THE BUTTON) */}
      <button
        onClick={startFormation}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-24 h-24 md:w-32 md:h-32
                   rounded-full
                   bg-cyan-400
                   shadow-[0_0_40px_15px_rgba(6,182,212,0.6)]
                   md:shadow-[0_0_60px_20px_rgba(6,182,212,0.6)]
                   cursor-pointer
                   transition-all duration-300
                   focus:outline-none
                   focus:ring-4 focus:ring-cyan-300"
        style={{
          animation: isHovering 
            ? 'pulse-fast 1s ease-in-out infinite'
            : 'pulse-slow 3s ease-in-out infinite',
        }}
        aria-label="Form your first tetrahedron"
        title="Click to begin"
      />
      
      {/* Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes pulse-fast {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
