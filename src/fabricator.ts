/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import * as THREE from 'three';

// This assumes Kiri:Moto's engine script is loaded globally via index.html
// This declaration prevents TypeScript errors for the 'kiri' global.
declare const kiri: any;

export const materializeObject = async (scene: THREE.Scene): Promise<string> => {
  // 1. Find the VoxelWorld mesh in the scene by its name
  const voxelMesh = scene.getObjectByName('voxelWorld');
  if (!voxelMesh) {
    throw new Error("Fabrication Error: VoxelWorld mesh not found in the scene.");
  }

  // 2. Export the specific mesh to a GLB Blob
  const exporter = new GLTFExporter();
  const glbBlob: Blob = await new Promise((resolve, reject) => {
    exporter.parse(
      voxelMesh,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(new Blob([result], { type: 'application/octet-stream' }));
        } else {
          reject(new Error("GLTFExporter did not return an ArrayBuffer."));
        }
      },
      (error) => reject(error),
      { binary: true } // Export as a binary GLB file
    );
  });

  // 3. Initialize Kiri Engine in headless mode
  // NOTE: This requires kiri-engine.js and kiri-worker.js to be in the /public/kiri/ directory.
  const engine = new kiri.Engine({ worker: '/kiri/worker.js' });

  // 4. Load model, configure slicer, and export G-code
  await engine.load(glbBlob, 'glb');
  await engine.setMode('FDM'); // Fused Deposition Modeling (standard 3D printing)

  // Apply simple, reliable settings for a successful first print
  await engine.setProcess({
    sliceShells: 2,
    sliceFillSparse: 0.15, // 15% infill
    sliceHeight: 0.2,
    sliceTopLayers: 3,
    sliceBottomLayers: 3,
  });

  await engine.slice();
  await engine.prepare();
  const gcode = await engine.export();

  return gcode; // Returns the G-code as a string
};