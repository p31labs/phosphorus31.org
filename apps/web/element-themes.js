/* ═══════════════════════════════════════════════
   P31 LABS — Element Theme System
   Personalize your experience by choosing your element
   ═══════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── ELEMENT THEMES ──
  const ELEMENT_THEMES = {
    'P31': {
      name: 'Phosphorus-31',
      symbol: 'P',
      atomicNumber: 15,
      atomicMass: 30.974,
      description: 'The only stable isotope',
      primary: '#2ecc71',      // Phosphorus Green
      primaryDim: '#1a7a43',
      primaryGlow: 'rgba(46, 204, 113, 0.15)',
      primaryFlare: 'rgba(46, 204, 113, 0.4)',
      secondary: '#60a5fa',    // Calcium Blue
      secondaryDim: '#2563eb',
      secondaryGlow: 'rgba(96, 165, 250, 0.12)',
      shape: 'tetrahedron',     // 4-sided, stable
      vibe: 'stable',
      personality: 'The foundation. The only stable isotope.'
    },
    'H': {
      name: 'Hydrogen',
      symbol: 'H',
      atomicNumber: 1,
      atomicMass: 1.008,
      description: 'The first element',
      primary: '#f0f9ff',       // Light blue-white
      primaryDim: '#bae6fd',
      primaryGlow: 'rgba(240, 249, 255, 0.2)',
      primaryFlare: 'rgba(186, 230, 253, 0.4)',
      secondary: '#38bdf8',     // Sky blue
      secondaryDim: '#0ea5e9',
      secondaryGlow: 'rgba(56, 189, 248, 0.15)',
      shape: 'sphere',          // Simple, minimal
      vibe: 'light',
      personality: 'The beginning. Pure potential.'
    },
    'C': {
      name: 'Carbon',
      symbol: 'C',
      atomicNumber: 6,
      atomicMass: 12.011,
      description: 'The foundation of life',
      primary: '#1e293b',       // Dark slate
      primaryDim: '#0f172a',
      primaryGlow: 'rgba(30, 41, 59, 0.3)',
      primaryFlare: 'rgba(30, 41, 59, 0.5)',
      secondary: '#64748b',     // Slate gray
      secondaryDim: '#475569',
      secondaryGlow: 'rgba(100, 116, 139, 0.15)',
      shape: 'diamond',         // Crystalline structure
      vibe: 'grounded',
      personality: 'The structure. Life itself.'
    },
    'O': {
      name: 'Oxygen',
      symbol: 'O',
      atomicNumber: 8,
      atomicMass: 15.999,
      description: 'The breath of life',
      primary: '#e0f2fe',       // Light cyan
      primaryDim: '#7dd3fc',
      primaryGlow: 'rgba(224, 242, 254, 0.2)',
      primaryFlare: 'rgba(125, 211, 252, 0.4)',
      secondary: '#0ea5e9',     // Sky blue
      secondaryDim: '#0284c7',
      secondaryGlow: 'rgba(14, 165, 233, 0.15)',
      shape: 'circle',          // Airy, flowing
      vibe: 'airy',
      personality: 'The breath. Movement and flow.'
    },
    'Fe': {
      name: 'Iron',
      symbol: 'Fe',
      atomicNumber: 26,
      atomicMass: 55.845,
      description: 'The strength',
      primary: '#dc2626',       // Iron red
      primaryDim: '#991b1b',
      primaryGlow: 'rgba(220, 38, 38, 0.2)',
      primaryFlare: 'rgba(220, 38, 38, 0.4)',
      secondary: '#f59e0b',     // Amber
      secondaryDim: '#d97706',
      secondaryGlow: 'rgba(245, 158, 11, 0.15)',
      shape: 'cube',            // Strong, geometric
      vibe: 'strong',
      personality: 'The strength. Unbreakable.'
    },
    'Ca': {
      name: 'Calcium',
      symbol: 'Ca',
      atomicNumber: 20,
      atomicMass: 40.078,
      description: 'The structure',
      primary: '#60a5fa',       // Calcium Blue
      primaryDim: '#2563eb',
      primaryGlow: 'rgba(96, 165, 250, 0.15)',
      primaryFlare: 'rgba(96, 165, 250, 0.4)',
      secondary: '#2ecc71',     // Phosphorus Green
      secondaryDim: '#1a7a43',
      secondaryGlow: 'rgba(46, 204, 113, 0.12)',
      shape: 'octahedron',     // 8-sided, structured
      vibe: 'structured',
      personality: 'The framework. Building blocks.'
    },
    'N': {
      name: 'Nitrogen',
      symbol: 'N',
      atomicNumber: 7,
      atomicMass: 14.007,
      description: 'The atmosphere',
      primary: '#a78bfa',       // Purple
      primaryDim: '#7c3aed',
      primaryGlow: 'rgba(167, 139, 250, 0.15)',
      primaryFlare: 'rgba(167, 139, 250, 0.4)',
      secondary: '#ec4899',     // Pink
      secondaryDim: '#db2777',
      secondaryGlow: 'rgba(236, 72, 153, 0.12)',
      shape: 'wave',            // Flowing, atmospheric
      vibe: 'ethereal',
      personality: 'The atmosphere. Between states.'
    },
    'Si': {
      name: 'Silicon',
      symbol: 'Si',
      atomicNumber: 14,
      atomicMass: 28.085,
      description: 'The conductor',
      primary: '#fbbf24',       // Amber
      primaryDim: '#f59e0b',
      primaryGlow: 'rgba(251, 191, 36, 0.2)',
      primaryFlare: 'rgba(251, 191, 36, 0.4)',
      secondary: '#34d399',     // Emerald
      secondaryDim: '#10b981',
      secondaryGlow: 'rgba(52, 211, 153, 0.15)',
      shape: 'hexagon',         // Crystalline, tech
      vibe: 'tech',
      personality: 'The conductor. Information flows.'
    }
  };

  // ── STORAGE KEY ──
  const STORAGE_KEY = 'p31_element_theme';

  // ── GET CURRENT THEME ──
  function getCurrentTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && ELEMENT_THEMES[stored] ? stored : 'P31';
  }

  // ── APPLY THEME ──
  function applyTheme(elementKey) {
    const theme = ELEMENT_THEMES[elementKey];
    if (!theme) return;

    const root = document.documentElement;
    
    // Update CSS custom properties
    root.style.setProperty('--phosphorus', theme.primary);
    root.style.setProperty('--phosphorus-dim', theme.primaryDim);
    root.style.setProperty('--phosphorus-glow', theme.primaryGlow);
    root.style.setProperty('--phosphorus-flare', theme.primaryFlare);
    root.style.setProperty('--calcium', theme.secondary);
    root.style.setProperty('--calcium-dim', theme.secondaryDim);
    root.style.setProperty('--calcium-glow', theme.secondaryGlow);

    // Update data attribute for shape-based styling
    root.setAttribute('data-element', elementKey);
    root.setAttribute('data-shape', theme.shape);
    root.setAttribute('data-vibe', theme.vibe);

    // Store preference
    localStorage.setItem(STORAGE_KEY, elementKey);

    // Update geometry engine colors if it exists
    if (window.updateGeometryColors) {
      window.updateGeometryColors(theme.primary, theme.secondary);
    }

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { element: elementKey, theme }
    }));
  }

  // ── CREATE ELEMENT SELECTOR UI ──
  function createElementSelector() {
    // Check if already exists
    if (document.getElementById('element-selector')) return;

    const selector = document.createElement('div');
    selector.id = 'element-selector';
    selector.className = 'element-selector';
    selector.setAttribute('aria-label', 'Choose your element');

    const button = document.createElement('button');
    button.className = 'element-selector-btn';
    button.setAttribute('aria-label', 'Open element selector');
    button.innerHTML = `
      <span class="element-symbol">${ELEMENT_THEMES[getCurrentTheme()].symbol}</span>
      <span class="element-number">${ELEMENT_THEMES[getCurrentTheme()].atomicNumber}</span>
    `;

    const panel = document.createElement('div');
    panel.className = 'element-selector-panel';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', 'Element selection menu');

    // Create element cards
    Object.entries(ELEMENT_THEMES).forEach(([key, element]) => {
      const card = document.createElement('button');
      card.className = 'element-card';
      card.setAttribute('role', 'menuitem');
      card.setAttribute('data-element', key);
      card.setAttribute('aria-label', `Select ${element.name}`);
      
      const isActive = key === getCurrentTheme();
      if (isActive) card.classList.add('active');

      card.innerHTML = `
        <div class="element-card-inner">
          <span class="element-card-number">${element.atomicNumber}</span>
          <span class="element-card-symbol">${element.symbol}</span>
          <span class="element-card-mass">${element.atomicMass.toFixed(3)}</span>
          <span class="element-card-name">${element.name}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        applyTheme(key);
        updateSelectorUI();
        panel.classList.remove('open');
        button.focus();
      });

      panel.appendChild(card);
    });

    selector.appendChild(button);
    selector.appendChild(panel);

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        button.setAttribute('aria-expanded', 'true');
      } else {
        button.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        panel.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        panel.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        button.focus();
      }
    });

    document.body.appendChild(selector);
  }

  // ── UPDATE SELECTOR UI ──
  function updateSelectorUI() {
    const current = getCurrentTheme();
    const theme = ELEMENT_THEMES[current];
    const button = document.querySelector('.element-selector-btn');
    const cards = document.querySelectorAll('.element-card');

    if (button) {
      button.querySelector('.element-symbol').textContent = theme.symbol;
      button.querySelector('.element-number').textContent = theme.atomicNumber;
    }

    cards.forEach(card => {
      if (card.getAttribute('data-element') === current) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // ── INITIALIZE ──
  function init() {
    // Apply saved theme on load
    applyTheme(getCurrentTheme());

    // Create selector UI
    createElementSelector();

    // Update hero isotope card if it exists
    const isotopeCard = document.querySelector('.hero-isotope');
    if (isotopeCard) {
      const current = getCurrentTheme();
      const theme = ELEMENT_THEMES[current];
      
      const num = isotopeCard.querySelector('.isotope-num');
      const symbol = isotopeCard.querySelector('.isotope-symbol');
      const mass = isotopeCard.querySelector('.isotope-mass');
      const note = isotopeCard.querySelector('.isotope-note');

      if (num) num.textContent = theme.atomicNumber;
      if (symbol) symbol.textContent = theme.symbol;
      if (mass) mass.textContent = theme.atomicMass.toFixed(3);
      if (note) note.textContent = theme.description;
    }
  }

  // ── EXPOSE API ──
  window.P31ElementThemes = {
    apply: applyTheme,
    getCurrent: getCurrentTheme,
    getTheme: (key) => ELEMENT_THEMES[key],
    getAllThemes: () => ELEMENT_THEMES
  };

  // ── INIT ON DOM READY ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
