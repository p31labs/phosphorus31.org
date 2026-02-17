/* ═══════════════════════════════════════════════
   P31 LABS — main.js (quantum-optimized)
   Geometry Engine: SIC-POVM, Jitterbug, IVM-aligned mesh.
   Phosphorus-31 / coherence-first. Zero deps. Pure math.
   ═══════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── CONSTANTS ──
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const TAU = Math.PI * 2;
  let PHOSPHORUS = '#2ecc71';
  let CALCIUM = '#60a5fa';
  const VOID = '#050510';
  const DIM = 'rgba(232, 232, 240, 0.06)';

  // ── HEX TO RGBA HELPER ──
  function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ── UPDATE GEOMETRY COLORS (called by element-themes.js) ──
  window.updateGeometryColors = function(primary, secondary) {
    PHOSPHORUS = primary;
    CALCIUM = secondary;
    // Re-initialize geometry if already created
    if (meshCanvas) initMesh();
    if (heroCanvas) initHeroGeometry();
  };

  // ── UTILITY: 3D MATH ──
  function rotateY(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
  }
  function rotateX(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
  }
  function rotateZ(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
  }
  function project(p, cx, cy, scale, perspective = 4) {
    const z = perspective / (perspective + p[2]);
    return [cx + p[0] * scale * z, cy + p[1] * scale * z, z];
  }
  function lerp3(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }
  function normalize(p) {
    const len = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    return len > 0 ? [p[0] / len, p[1] / len, p[2] / len] : [0, 0, 0];
  }


  const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PARTICLE_COUNT = 80; // < 100 per spec
  const PARTICLE_ALPHA = 0.05;

  // ═══════════════════════════════════════════
  //  1. MESH BACKGROUND — Living network topology
  // ═══════════════════════════════════════════
  const meshCanvas = document.getElementById('mesh-bg');
  if (meshCanvas && !REDUCE_MOTION) {
    const ctx = meshCanvas.getContext('2d');
    let particles = [];
    const CONNECTION_DIST = 150;
    let mouseX = -1000, mouseY = -1000;
    let w, h;

    function resizeMesh() {
      w = meshCanvas.width = window.innerWidth;
      h = meshCanvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          r: Math.random() * 1.2 + 0.5,
          phase: Math.random() * TAU
        });
      }
    }

    function drawMesh(time) {
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = [0, 255, 136]; // #00FF88

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse = 0.5 + 0.5 * Math.sin(time * 0.0005 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.8 + pulse * 0.3), 0, TAU);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${PARTICLE_ALPHA * (0.8 + pulse * 0.4)})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * PARTICLE_ALPHA * 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawMesh);
    }

    resizeMesh();
    initParticles();
    requestAnimationFrame(drawMesh);

    window.addEventListener('resize', () => { resizeMesh(); initParticles(); });
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  } else if (meshCanvas && REDUCE_MOTION) {
    meshCanvas.style.display = 'none';
  }


  // ═══════════════════════════════════════════
  //  2. HERO GEOMETRY — SIC-POVM Tetrahedron
  //     inscribed in Bloch Sphere
  // ═══════════════════════════════════════════
  const heroCanvas = document.getElementById('hero-geometry');
  if (heroCanvas && window.innerWidth > 768 && !REDUCE_MOTION) {
    const ctx = heroCanvas.getContext('2d');
    let hw, hh;

    function resizeHero() {
      heroCanvas.width = heroCanvas.offsetWidth;
      heroCanvas.height = heroCanvas.offsetHeight;
      hw = heroCanvas.width;
      hh = heroCanvas.height;
    }

    // SIC-POVM states for d=2 (qubit): 4 vectors forming a tetrahedron
    // on the Bloch sphere. These are the Bloch vectors.
    const sicVectors = [
      [0, 0, 1],                                           // |0⟩ (north pole)
      [2 * Math.sqrt(2) / 3, 0, -1 / 3],                  // 120° rotated
      [-Math.sqrt(2) / 3, Math.sqrt(6) / 3, -1 / 3],      // 240° rotated
      [-Math.sqrt(2) / 3, -Math.sqrt(6) / 3, -1 / 3]      // 360° rotated
    ];

    const tetEdges = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

    function drawBlochSphere(time) {
      ctx.clearRect(0, 0, hw, hh);

      const cx = hw * 0.5;
      const cy = hh * 0.48;
      const radius = Math.min(hw, hh) * 0.32;
      const rotY = time * 0.0003;
      const rotX = Math.sin(time * 0.0002) * 0.15 + 0.3;

      // ── Sphere wireframe (latitude/longitude circles) ──
      ctx.strokeStyle = 'rgba(46, 204, 113, 0.06)';
      ctx.lineWidth = 0.5;

      // Longitude lines
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * TAU;
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const phi = (j / 60) * Math.PI;
          let p = [Math.sin(phi) * Math.cos(angle), Math.cos(phi), Math.sin(phi) * Math.sin(angle)];
          p = rotateX(rotateY(p, rotY), rotX);
          const proj = project(p, cx, cy, radius);
          j === 0 ? ctx.moveTo(proj[0], proj[1]) : ctx.lineTo(proj[0], proj[1]);
        }
        ctx.stroke();
      }

      // Latitude lines
      for (let i = 1; i < 6; i++) {
        const phi = (i / 6) * Math.PI;
        const r = Math.sin(phi);
        const y = Math.cos(phi);
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const angle = (j / 60) * TAU;
          let p = [r * Math.cos(angle), y, r * Math.sin(angle)];
          p = rotateX(rotateY(p, rotY), rotX);
          const proj = project(p, cx, cy, radius);
          j === 0 ? ctx.moveTo(proj[0], proj[1]) : ctx.lineTo(proj[0], proj[1]);
        }
        ctx.stroke();
      }

      // ── Equator (brighter) ──
      ctx.strokeStyle = 'rgba(46, 204, 113, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const angle = (j / 60) * TAU;
        let p = [Math.cos(angle), 0, Math.sin(angle)];
        p = rotateX(rotateY(p, rotY), rotX);
        const proj = project(p, cx, cy, radius);
        j === 0 ? ctx.moveTo(proj[0], proj[1]) : ctx.lineTo(proj[0], proj[1]);
      }
      ctx.stroke();

      // ── SIC-POVM Tetrahedron ──
      // Transform all vertices
      const transformed = sicVectors.map(v => {
        let p = rotateX(rotateY(v, rotY), rotX);
        return project(p, cx, cy, radius);
      });

      // Draw edges
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
      ctx.lineWidth = 1.5;
      for (const [a, b] of tetEdges) {
        ctx.beginPath();
        ctx.moveTo(transformed[a][0], transformed[a][1]);
        ctx.lineTo(transformed[b][0], transformed[b][1]);
        ctx.stroke();
      }

      // Draw face fills (subtle)
      const faces = [[0,1,2],[0,1,3],[0,2,3],[1,2,3]];
      for (const face of faces) {
        ctx.beginPath();
        ctx.moveTo(transformed[face[0]][0], transformed[face[0]][1]);
        ctx.lineTo(transformed[face[1]][0], transformed[face[1]][1]);
        ctx.lineTo(transformed[face[2]][0], transformed[face[2]][1]);
        ctx.closePath();
        ctx.fillStyle = 'rgba(96, 165, 250, 0.03)';
        ctx.fill();
      }

      // Draw vertices with glow
      const labels = ['|ψ₁⟩', '|ψ₂⟩', '|ψ₃⟩', '|ψ₄⟩'];
      for (let i = 0; i < transformed.length; i++) {
        const [x, y, z] = transformed[i];
        const size = 3 + z * 2;

        // Glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 6);
        grad.addColorStop(0, 'rgba(46, 204, 113, 0.4)');
        grad.addColorStop(1, 'rgba(46, 204, 113, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size * 6, 0, TAU);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, size, 0, TAU);
        ctx.fillStyle = PHOSPHORUS;
        ctx.fill();

        // Label
        ctx.font = `${10 + z * 2}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(96, 165, 250, ${0.3 + z * 0.3})`;
        ctx.fillText(labels[i], x + size + 6, y + 4);
      }

      // ── Axes (faint) ──
      const axes = [
        { v: [1.3, 0, 0], label: 'x' },
        { v: [0, 1.3, 0], label: 'z' },
        { v: [0, 0, 1.3], label: 'y' }
      ];
      ctx.strokeStyle = 'rgba(232, 232, 240, 0.06)';
      ctx.lineWidth = 0.5;
      for (const axis of axes) {
        let p = rotateX(rotateY(axis.v, rotY), rotX);
        const proj = project(p, cx, cy, radius);
        let pn = rotateX(rotateY(axis.v.map(v => -v), rotY), rotX);
        const projn = project(pn, cx, cy, radius);
        ctx.beginPath();
        ctx.moveTo(projn[0], projn[1]);
        ctx.lineTo(proj[0], proj[1]);
        ctx.stroke();
      }

      // ── Title annotation ──
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
      ctx.fillText('SIC-POVM d=2', cx - 45, cy + radius + 40);
      ctx.fillText('Bloch Sphere', cx - 40, cy + radius + 55);

      requestAnimationFrame(drawBlochSphere);
    }

    resizeHero();
    requestAnimationFrame(drawBlochSphere);
    window.addEventListener('resize', resizeHero);
  } else if (heroCanvas && (window.innerWidth <= 768 || REDUCE_MOTION)) {
    heroCanvas.style.display = 'none';
  }


  // ═══════════════════════════════════════════
  //  3. JITTERBUG TRANSFORMATION — Fuller
  //     Cuboctahedron ↔ Icosahedron ↔ Octahedron
  // ═══════════════════════════════════════════
  const jCanvas = document.getElementById('jitterbug-canvas');
  const morphSlider = document.getElementById('morph-slider');

  if (jCanvas && morphSlider) {
    const jCtx = jCanvas.getContext('2d');
    let jw, jh, morphT = 0;
    let autoRotY = 0, autoRotX = 0.4;
    let isDragging = false, lastDragX = 0, lastDragY = 0;
    let dragRotY = 0, dragRotX = 0.4;

    function resizeJitterbug() {
      const rect = jCanvas.getBoundingClientRect();
      jCanvas.width = rect.width * (window.devicePixelRatio || 1);
      jCanvas.height = rect.height * (window.devicePixelRatio || 1);
      jCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      jw = rect.width;
      jh = rect.height;
    }

    // ── Polyhedra vertex definitions ──

    // Cuboctahedron: 12 vertices (midpoints of cube edges)
    const cuboct = [
      [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],
      [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
      [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1]
    ].map(normalize);

    // Octahedron: 6 vertices
    const octa = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1]
    ];

    // For the jitterbug, we morph the 12 cuboctahedron vertices.
    // At t=0: cuboctahedron (12 verts, all on unit sphere)
    // At t=0.5: icosahedron (12 verts with golden ratio coords)
    // At t=1: octahedron (12 verts collapse to 6 — pairs merge)

    // Icosahedron: 12 vertices
    const ico = [
      [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
      [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
      [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1]
    ].map(normalize);

    // Octahedron with 12 points (pairs that will merge)
    const octaPaired = [
      [1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 0, 1],
      [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0],
      [0, 0, 1], [0, 1, 0], [0, 0, -1], [0, -1, 0]
    ].map(normalize);

    // Edges for visualization (cuboctahedron topology)
    const edges = [
      [0,4],[0,5],[0,8],[0,9],
      [1,4],[1,5],[1,10],[1,11],
      [2,6],[2,7],[2,8],[2,9],
      [3,6],[3,7],[3,10],[3,11],
      [4,8],[4,10],[5,9],[5,11],
      [6,8],[6,10],[7,9],[7,11]
    ];

    // Triangle faces (8 triangular faces of cuboctahedron)
    const triFaces = [
      [0,4,8],[0,5,9],[1,4,10],[1,5,11],
      [2,6,8],[2,7,9],[3,6,10],[3,7,11]
    ];

    function getJitterbugVerts(t) {
      const verts = [];
      if (t <= 0.5) {
        // Cuboct → Ico
        const s = t * 2; // 0 → 1
        for (let i = 0; i < 12; i++) {
          verts.push(lerp3(cuboct[i], ico[i], s));
        }
      } else {
        // Ico → Octa
        const s = (t - 0.5) * 2; // 0 → 1
        for (let i = 0; i < 12; i++) {
          verts.push(lerp3(ico[i], octaPaired[i], s));
        }
      }
      return verts;
    }

    function drawJitterbug(time) {
      jCtx.clearRect(0, 0, jw, jh);

      const cx = jw / 2;
      const cy = jh / 2;
      const scale = Math.min(jw, jh) * 0.3;

      // Auto-rotation when not dragging
      if (!isDragging) {
        autoRotY += 0.003;
      }

      const ry = isDragging ? dragRotY : autoRotY;
      const rx = isDragging ? dragRotX : 0.4 + Math.sin(time * 0.0003) * 0.1;

      const verts = getJitterbugVerts(morphT);

      // Transform
      const projected = verts.map(v => {
        let p = rotateX(rotateY(v, ry), rx);
        return project(p, cx, cy, scale, 5);
      });

      // Sort faces by depth for painter's algorithm
      const sortedFaces = triFaces.map((face, idx) => {
        const avgZ = face.reduce((sum, vi) => sum + projected[vi][2], 0) / face.length;
        return { face, avgZ, idx };
      }).sort((a, b) => a.avgZ - b.avgZ);

      // Draw faces
      for (const { face } of sortedFaces) {
        jCtx.beginPath();
        jCtx.moveTo(projected[face[0]][0], projected[face[0]][1]);
        jCtx.lineTo(projected[face[1]][0], projected[face[1]][1]);
        jCtx.lineTo(projected[face[2]][0], projected[face[2]][1]);
        jCtx.closePath();
        const brightness = 0.02 + projected[face[0]][2] * 0.03;
        jCtx.fillStyle = `rgba(46, 204, 113, ${brightness})`;
        jCtx.fill();
      }

      // Draw edges
      for (const [a, b] of edges) {
        const alpha = 0.15 + (projected[a][2] + projected[b][2]) * 0.1;
        jCtx.beginPath();
        jCtx.moveTo(projected[a][0], projected[a][1]);
        jCtx.lineTo(projected[b][0], projected[b][1]);
        jCtx.strokeStyle = `rgba(96, 165, 250, ${Math.max(0.05, alpha)})`;
        jCtx.lineWidth = 1;
        jCtx.stroke();
      }

      // Draw vertices
      for (let i = 0; i < projected.length; i++) {
        const [x, y, z] = projected[i];
        const size = 2 + z * 1.5;

        // Glow
        const grad = jCtx.createRadialGradient(x, y, 0, x, y, size * 4);
        grad.addColorStop(0, `rgba(46, 204, 113, ${0.3 + z * 0.2})`);
        grad.addColorStop(1, 'rgba(46, 204, 113, 0)');
        jCtx.fillStyle = grad;
        jCtx.beginPath();
        jCtx.arc(x, y, size * 4, 0, TAU);
        jCtx.fill();

        // Core
        jCtx.beginPath();
        jCtx.arc(x, y, Math.max(1, size), 0, TAU);
        jCtx.fillStyle = PHOSPHORUS;
        jCtx.fill();
      }

      // Phase label
      let phaseName = 'Cuboctahedron';
      if (morphT > 0.15 && morphT < 0.35) phaseName = 'Morphing...';
      else if (morphT >= 0.35 && morphT <= 0.65) phaseName = 'Icosahedron';
      else if (morphT > 0.65 && morphT < 0.85) phaseName = 'Collapsing...';
      else if (morphT >= 0.85) phaseName = 'Octahedron';

      jCtx.font = "11px 'JetBrains Mono', monospace";
      jCtx.fillStyle = 'rgba(46, 204, 113, 0.3)';
      jCtx.textAlign = 'center';
      jCtx.fillText(phaseName, cx, jh - 20);
      jCtx.fillText(`V=${verts.length}  E=${edges.length}  t=${morphT.toFixed(2)}`, cx, jh - 6);
      jCtx.textAlign = 'left';

      requestAnimationFrame(drawJitterbug);
    }

    // Slider
    morphSlider.addEventListener('input', e => {
      morphT = parseInt(e.target.value) / 100;
    });

    // Drag rotation
    jCanvas.addEventListener('mousedown', e => {
      isDragging = true;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      dragRotY = autoRotY;
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      dragRotY += (e.clientX - lastDragX) * 0.01;
      dragRotX += (e.clientY - lastDragY) * 0.01;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        autoRotY = dragRotY;
      }
    });

    // Touch support
    jCanvas.addEventListener('touchstart', e => {
      isDragging = true;
      lastDragX = e.touches[0].clientX;
      lastDragY = e.touches[0].clientY;
      dragRotY = autoRotY;
      e.preventDefault();
    }, { passive: false });
    jCanvas.addEventListener('touchmove', e => {
      if (!isDragging) return;
      dragRotY += (e.touches[0].clientX - lastDragX) * 0.01;
      dragRotX += (e.touches[0].clientY - lastDragY) * 0.01;
      lastDragX = e.touches[0].clientX;
      lastDragY = e.touches[0].clientY;
      e.preventDefault();
    }, { passive: false });
    jCanvas.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        autoRotY = dragRotY;
      }
    });

    resizeJitterbug();
    requestAnimationFrame(drawJitterbug);
    window.addEventListener('resize', resizeJitterbug);
  }


  // ═══════════════════════════════════════════
  //  4. SCROLL REVEALS — Intersection Observer
  // ═══════════════════════════════════════════
  function initReveals() {
    // Add .reveal to elements
    const revealSelectors = [
      '.section-header', '.stack-card', '.math-block',
      '.why-content blockquote', '.why-stats', '.why-text',
      '.founder-content', '.contact-link'
    ];

    revealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.08}s`;
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }


  // ═══════════════════════════════════════════
  //  5. CARD GLOW TRACKING — Mouse follow
  // ═══════════════════════════════════════════
  function initCardGlow() {
    document.querySelectorAll('.stack-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }


  // ═══════════════════════════════════════════
  //  6. METRIC COUNTERS — Animated count-up
  // ═══════════════════════════════════════════
  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-target');
          if (target === null) return;

          const val = parseInt(target);
          const duration = 1200;
          const start = performance.now();

          function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out expo
            const eased = 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.round(val * eased);
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
  }


  // ═══════════════════════════════════════════
  //  7. NAV SCROLL STATE
  // ═══════════════════════════════════════════
  function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 100) {
            nav.style.background = 'rgba(5, 5, 16, 0.9)';
          } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(5,5,16,1) 0%, transparent 100%)';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }


  // ═══════════════════════════════════════════
  //  8. WALLET COPY FUNCTIONALITY
  // ═══════════════════════════════════════════
  function initWalletCopy() {
    const btn = document.getElementById('copy-wallet-btn');
    const addrEl = document.getElementById('wallet-addr');
    if (!btn || !addrEl) return;

    const walletAddr = '0x90048cbb3CDCef200a54D6D336EbB4e0ce18d82c';
    const originalText = btn.textContent;

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(walletAddr);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = walletAddr;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Visual feedback
        btn.textContent = 'Copied!';
        btn.setAttribute('aria-label', 'Wallet address copied to clipboard');
        btn.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
          btn.textContent = originalText;
          btn.setAttribute('aria-label', 'Copy wallet address to clipboard');
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Graceful degradation
        console.warn('Failed to copy wallet address:', err);
        btn.textContent = 'Copy failed';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    });
  }


  // ═══════════════════════════════════════════
  //  9. ENHANCED PARTICLE SYSTEM — Advanced mesh
  // ═══════════════════════════════════════════
  function enhanceMeshParticles() {
    if (!meshCanvas) return;
    const ctx = meshCanvas.getContext('2d');
    
    // Add more particle types
    particles.forEach(p => {
      p.size = p.r * (1 + Math.sin(Date.now() * 0.001 + p.phase) * 0.3);
      p.energy = 0.5 + Math.sin(Date.now() * 0.002 + p.phase) * 0.5;
    });

    // Enhanced connection rendering with gradient
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(46, 204, 113, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(96, 165, 250, ${alpha * 0.8})`);
          gradient.addColorStop(1, `rgba(46, 204, 113, ${alpha})`);
          
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5 + (1 - dist / CONNECTION_DIST) * 1;
          ctx.stroke();
        }
      }
    }
  }

  // ═══════════════════════════════════════════
  //  10. PARALLAX SCROLLING — Depth effect
  // ═══════════════════════════════════════════
  function initParallax() {
    const sections = document.querySelectorAll('.section');
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionCenter = sectionTop + rect.height / 2;
        const distance = scrollY + windowHeight / 2 - sectionCenter;
        const parallaxSpeed = 0.1 + (index % 3) * 0.05;

        // Only apply parallax if section is in viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
          const translateY = distance * parallaxSpeed;
          section.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════
  //  11. MOUSE TRAIL EFFECT — Interactive cursor
  // ═══════════════════════════════════════════
  function initMouseTrail() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const trail = [];
    const TRAIL_LENGTH = 15;
    let mouseX = 0, mouseY = 0;

    function createTrailDot() {
      const dot = document.createElement('div');
      const [r, g, b] = PHOSPHORUS.match(/\w\w/g).map(x => parseInt(x, 16));
      dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: radial-gradient(circle, ${PHOSPHORUS}, transparent);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(dot);
      return dot;
    }

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trail.push(createTrailDot());
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      trail.forEach((dot, i) => {
        const delay = i * 0.05;
        const scale = 1 - (i / TRAIL_LENGTH) * 0.8;
        const opacity = 1 - (i / TRAIL_LENGTH);

        setTimeout(() => {
          dot.style.left = `${mouseX}px`;
          dot.style.top = `${mouseY}px`;
          dot.style.transform = `scale(${scale})`;
          dot.style.opacity = opacity;
        }, delay * 100);
      });
    }, { passive: true });
  }

  // ═══════════════════════════════════════════
  //  12. ENHANCED CARD INTERACTIONS — 3D tilt
  // ═══════════════════════════════════════════
  function init3DCards() {
    const cards = document.querySelectorAll('.stack-card, .economy-card, .math-block');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `
          translateY(-8px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          perspective(1000px)
        `;
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════════════
  //  13. ENHANCED HERO GEOMETRY — More depth
  // ═══════════════════════════════════════════
  function enhanceHeroGeometry() {
    if (!heroCanvas || window.innerWidth <= 768) return;
    
    // This enhancement is handled by the existing drawBlochSphere function
    // Additional visual enhancements are applied via CSS
  }

  // ═══════════════════════════════════════════
  //  14. SCROLL PROGRESS INDICATOR
  // ═══════════════════════════════════════════
  function initScrollProgress() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: linear-gradient(90deg, ${PHOSPHORUS}, ${CALCIUM}, ${PHOSPHORUS});
      background-size: 200% 100%;
      z-index: 10000;
      transition: width 0.1s ease;
      animation: gradientFlow 3s ease infinite;
      pointer-events: none;
    `;
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      indicator.style.width = `${progress}%`;
    }, { passive: true });
  }

  // ═══════════════════════════════════════════
  //  15. ENHANCED METRIC COUNTERS — With glow
  // ═══════════════════════════════════════════
  function enhanceCounters() {
    const metricVals = document.querySelectorAll('.metric-val[data-target]');
    
    metricVals.forEach(el => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.style.animation = 'glowPulse 2s ease infinite';
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
    initCardGlow();
    initCounters();
    initNavScroll();
    initWalletCopy();

    if (!REDUCE_MOTION) {
      initParallax();
      init3DCards();
      initScrollProgress();
    }
    enhanceCounters();
  });

})();
