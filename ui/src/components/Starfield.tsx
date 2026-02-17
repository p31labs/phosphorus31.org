/**
 * Starfield — canvas-based particle system. Full viewport. Behind everything.
 * 800 stars on desktop, 400 on mobile. Parallax with mouse/touch.
 * Nebula clouds. Stars drift toward viewer. The void hums.
 */

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  birth: number;
  life: number;
}

const NEBULA_COLORS = ['#00FF88', '#00D4FF', '#7A27FF'];

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const frameRef = useRef(0);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const starCount = isMobile ? 400 : 800;
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        size: 0.3 + Math.random() * 1.5,
        speed: 0.05 + Math.random() * 0.2,
      });
    }
    starsRef.current = stars;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX / window.innerWidth, y: e.touches[0].clientY / window.innerHeight };
      }
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });

    let raf: number;
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, w, h);

      frameRef.current++;
      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;

      // Nebulae
      if (!isMobile && !reducedMotion) {
        const nebs = nebulaeRef.current;
        if (frameRef.current % 200 === 0 && nebs.length < 3) {
          nebs.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: 100 + Math.random() * 200,
            color: NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]!,
            opacity: 0.02 + Math.random() * 0.02,
            birth: frameRef.current,
            life: 600,
          });
        }
        for (let i = nebs.length - 1; i >= 0; i--) {
          const n = nebs[i]!;
          const age = frameRef.current - n.birth;
          if (age > n.life) { nebs.splice(i, 1); continue; }
          const fade = age < 60 ? age / 60 : age > n.life - 60 ? (n.life - age) / 60 : 1;
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
          grad.addColorStop(0, n.color + Math.round(n.opacity * fade * 255).toString(16).padStart(2, '0'));
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
          if (!reducedMotion) { n.x += 0.2; n.y += 0.1; }
        }
      }

      // Stars
      for (const s of stars) {
        if (!reducedMotion) {
          s.z += s.speed * 0.003;
          if (s.z > 1) {
            s.z = 0;
            s.x = Math.random();
            s.y = Math.random();
          }
        }

        const parallaxX = reducedMotion ? 0 : mx * 0.02 * s.z;
        const parallaxY = reducedMotion ? 0 : my * 0.02 * s.z;
        const sx = (s.x + parallaxX) * w;
        const sy = (s.y + parallaxY) * h;
        const sz = 0.3 + s.z * 1.5;
        const opacity = 0.1 + s.z * 0.5;

        // Color shift: faint green at high z
        const greenMix = s.z > 0.7 ? (s.z - 0.7) / 0.3 : 0;
        const r = Math.round(255 * (1 - greenMix));
        const g = Math.round(255);
        const b = Math.round(255 * (1 - greenMix) + 136 * greenMix);

        ctx.beginPath();
        ctx.arc(sx, sy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [isMobile, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
