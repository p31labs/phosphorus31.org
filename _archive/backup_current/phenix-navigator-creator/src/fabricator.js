// ══════════════════════════════════════════════════════════════════════════════
// FABRICATOR
// GLB export from R3F scene → Kiri:Moto headless FDM slicer → G-code
// Sovereign fabrication: client-side only, no cloud dependency.
//
// SETUP:
// 1. Clone GridSpace Kiri:Moto: https://github.com/GridSpace/grid-apps
// 2. Copy engine.js and worker.js into /public/kiri/
// 3. Ensure manifold.wasm is co-located if required
// ══════════════════════════════════════════════════════════════════════════════

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { FABRICATION_DEFAULTS } from './constants.js';

/**
 * Fabricator class
 * Manages the materialize pipeline with progress callbacks and abort support
 */
export class Fabricator {
  /**
   * @param {function} onProgress - Progress callback ({ status, progress, error })
   */
  constructor(onProgress) {
    this.onProgress = onProgress || (() => {});
    this.engine = null;
    this._aborted = false;
  }

  // ── Abort Control ──────────────────────────────────────────────────────────
  
  abort() {
    this._aborted = true;
  }

  _checkAbort() {
    if (this._aborted) {
      throw new Error('AbortError');
    }
  }

  // ── Step 1: Export R3F Scene to GLB ────────────────────────────────────────
  
  /**
   * Export scene to GLB binary
   * @param {THREE.Scene} scene - R3F scene
   * @returns {Promise<Blob>} GLB blob
   */
  async exportToGLB(scene) {
    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter();
      
      exporter.parse(
        scene,
        (result) => {
          // Result is ArrayBuffer when binary: true
          const blob = new Blob([result], { type: 'model/gltf-binary' });
          resolve(blob);
        },
        (error) => {
          reject(new Error(`[Fabricator] GLB export: ${error.message || error}`));
        },
        {
          binary: true,
          onlyVisible: true,
          includeNormals: true,
          embedImages: true
        }
      );
    });
  }

  // ── Step 2: Load Kiri:Moto Engine ──────────────────────────────────────────
  
  async _loadKiriScript() {
    if (window.kiri) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/kiri/engine.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(
        '[Fabricator] Failed to load /kiri/engine.js. ' +
        'Ensure Kiri:Moto files are in /public/kiri/'
      ));
      document.head.appendChild(script);
    });
  }

  async _initEngine() {
    await this._loadKiriScript();

    if (typeof window.kiri === 'undefined') {
      throw new Error('[Fabricator] kiri global not defined after script load.');
    }

    this.engine = new window.kiri.Engine({
      worker: '/kiri/worker.js'
    });

    return this.engine;
  }

  // ── Full Pipeline ──────────────────────────────────────────────────────────
  
  /**
   * Materialize: export → slice → output G-code
   * @param {THREE.Scene} scene - R3F scene
   * @param {object} settings - FDM process overrides
   * @returns {Promise<string>} G-code content
   */
  async materialize(scene, settings = {}) {
    this._aborted = false;
    const config = { ...FABRICATION_DEFAULTS, ...settings };

    try {
      // Export to GLB
      this.onProgress({ status: 'slicing', progress: 10 });
      this._checkAbort();
      const glb = await this.exportToGLB(scene);
      console.log('[Fabricator] GLB size:', glb.size, 'bytes');

      // Initialize Kiri engine
      this.onProgress({ status: 'slicing', progress: 25 });
      this._checkAbort();
      const engine = await this._initEngine();

      // Load geometry
      this.onProgress({ status: 'slicing', progress: 40 });
      this._checkAbort();
      await engine.load(glb);

      // Configure FDM mode
      this._checkAbort();
      await engine.setMode('FDM');
      this.onProgress({ status: 'slicing', progress: 55 });
      await engine.setProcess(config);

      // Slice
      this._checkAbort();
      console.log('[Fabricator] Slicing...');
      await engine.slice();

      // Prepare output
      this._checkAbort();
      this.onProgress({ status: 'preparing', progress: 75 });
      console.log('[Fabricator] Preparing output...');
      const gcode = await engine.export();

      this.onProgress({ status: 'complete', progress: 100 });
      return gcode;
      
    } catch (error) {
      if (error.message === 'AbortError') {
        this.onProgress({ status: 'idle', progress: 0 });
        throw error;
      }
      this.onProgress({ status: 'error', progress: 0, error: error.message });
      throw error;
    }
  }
}

// ── Utility: Download G-code ─────────────────────────────────────────────────

/**
 * Trigger browser download of G-code content
 * @param {string} content - G-code string
 * @param {string} filename - Output filename
 */
export function downloadGcode(content, filename = 'phenix_artifact.gcode') {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}
