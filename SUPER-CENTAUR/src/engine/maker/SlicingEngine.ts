/**
 * Slicing Engine
 * 3D model slicing for 3D printing
 * 
 * "Internal slicing and push straight to printer"
 */

import * as THREE from 'three';

export interface SliceLayer {
  layerIndex: number;
  z: number;
  paths: Array<{ points: THREE.Vector2[]; type: 'perimeter' | 'infill' | 'support' }>;
  thickness: number;
}

export interface SliceConfig {
  layerHeight: number; // mm
  infillDensity: number; // 0-1
  infillPattern: 'grid' | 'honeycomb' | 'lines' | 'triangles';
  supportEnabled: boolean;
  supportAngle: number; // degrees
  supportDensity: number; // 0-1
  perimeterCount: number;
  topLayers: number;
  bottomLayers: number;
  printSpeed: number; // mm/s
  travelSpeed: number; // mm/s
  temperature: number; // Celsius
  bedTemperature: number; // Celsius
}

export interface SlicedModel {
  id: string;
  modelId: string;
  layers: SliceLayer[];
  config: SliceConfig;
  estimatedTime: number; // minutes
  estimatedMaterial: number; // grams
  boundingBox: { min: THREE.Vector3; max: THREE.Vector3 };
  createdAt: number;
}

export class SlicingEngine {
  private defaultConfig: SliceConfig = {
    layerHeight: 0.2,
    infillDensity: 0.2,
    infillPattern: 'grid',
    supportEnabled: false,
    supportAngle: 45,
    supportDensity: 0.15,
    perimeterCount: 2,
    topLayers: 4,
    bottomLayers: 4,
    printSpeed: 50,
    travelSpeed: 150,
    temperature: 210,
    bedTemperature: 60
  };

  /**
   * Initialize slicing engine
   */
  public async init(): Promise<void> {
    console.log('🔪 Slicing Engine initialized');
  }

  /**
   * Slice 3D model
   */
  public async sliceModel(
    geometry: THREE.BufferGeometry,
    config?: Partial<SliceConfig>
  ): Promise<SlicedModel> {
    const sliceConfig = { ...this.defaultConfig, ...config };

    // Get bounding box
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox!;

    // Calculate number of layers
    const modelHeight = boundingBox.max.y - boundingBox.min.y;
    const layerCount = Math.ceil(modelHeight / sliceConfig.layerHeight);

    // Generate layers
    const layers: SliceLayer[] = [];
    for (let i = 0; i < layerCount; i++) {
      const z = boundingBox.min.y + (i * sliceConfig.layerHeight);
      const layer = await this.generateLayer(geometry, z, sliceConfig, i, layerCount);
      layers.push(layer);
    }

    // Calculate estimates
    const estimatedTime = this.estimatePrintTime(layers, sliceConfig);
    const estimatedMaterial = this.estimateMaterial(layers, sliceConfig);

    const slicedModel: SlicedModel = {
      id: `slice_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      modelId: 'current_model',
      layers,
      config: sliceConfig,
      estimatedTime,
      estimatedMaterial,
      boundingBox: {
        min: boundingBox.min.clone(),
        max: boundingBox.max.clone()
      },
      createdAt: Date.now()
    };

    console.log(`🔪 Sliced model: ${layerCount} layers, ${estimatedTime.toFixed(1)} min, ${estimatedMaterial.toFixed(1)}g`);
    return slicedModel;
  }

  /**
   * Generate single layer
   */
  private async generateLayer(
    geometry: THREE.BufferGeometry,
    z: number,
    config: SliceConfig,
    layerIndex: number,
    totalLayers: number
  ): Promise<SliceLayer> {
    const paths: Array<{ points: THREE.Vector2[]; type: 'perimeter' | 'infill' | 'support' }> = [];

    // Get intersection with plane at z
    const intersections = this.intersectWithPlane(geometry, z);

    if (intersections.length === 0) {
      return {
        layerIndex,
        z,
        paths: [],
        thickness: config.layerHeight
      };
    }

    // Generate perimeters
    const perimeters = this.generatePerimeters(intersections, config.perimeterCount);
    perimeters.forEach(perimeter => {
      paths.push({ points: perimeter, type: 'perimeter' });
    });

    // Generate infill (skip for top/bottom layers)
    const isTopLayer = layerIndex >= totalLayers - config.topLayers;
    const isBottomLayer = layerIndex < config.bottomLayers;

    if (!isTopLayer && !isBottomLayer) {
      const infill = this.generateInfill(intersections, config);
      paths.push({ points: infill, type: 'infill' });
    }

    // Generate support if needed
    if (config.supportEnabled) {
      const support = this.generateSupport(intersections, config, layerIndex);
      if (support.length > 0) {
        paths.push({ points: support, type: 'support' });
      }
    }

    return {
      layerIndex,
      z,
      paths,
      thickness: config.layerHeight
    };
  }

  /**
   * Intersect geometry with plane
   */
  private intersectWithPlane(geometry: THREE.BufferGeometry, z: number): THREE.Vector2[] {
    const positions = geometry.attributes.position;
    const indices = geometry.index;
    const intersections: THREE.Vector2[] = [];

    if (!indices) {
      return intersections;
    }

    // Simple intersection algorithm
    // In production, use more sophisticated mesh slicing
    for (let i = 0; i < indices.count; i += 3) {
      const i0 = indices.getX(i);
      const i1 = indices.getX(i + 1);
      const i2 = indices.getX(i + 2);

      const v0 = new THREE.Vector3(
        positions.getX(i0),
        positions.getY(i0),
        positions.getZ(i0)
      );
      const v1 = new THREE.Vector3(
        positions.getX(i1),
        positions.getY(i1),
        positions.getZ(i1)
      );
      const v2 = new THREE.Vector3(
        positions.getX(i2),
        positions.getY(i2),
        positions.getZ(i2)
      );

      // Check if triangle intersects plane
      const minZ = Math.min(v0.z, v1.z, v2.z);
      const maxZ = Math.max(v0.z, v1.z, v2.z);

      if (z >= minZ && z <= maxZ) {
        // Calculate intersection points (simplified)
        const intersection = new THREE.Vector2(
          (v0.x + v1.x + v2.x) / 3,
          (v0.y + v1.y + v2.y) / 3
        );
        intersections.push(intersection);
      }
    }

    return intersections;
  }

  /**
   * Generate perimeters
   */
  private generatePerimeters(
    intersections: THREE.Vector2[],
    count: number
  ): THREE.Vector2[][] {
    // Simplified perimeter generation
    // In production, use proper contour extraction
    const perimeters: THREE.Vector2[][] = [];

    if (intersections.length === 0) {
      return perimeters;
    }

    // Create convex hull as perimeter (simplified)
    const hull = this.convexHull(intersections);
    perimeters.push(hull);

    // Generate inner perimeters (offset inward)
    for (let i = 1; i < count; i++) {
      const offset = this.offsetPolygon(hull, -0.4 * i); // 0.4mm offset
      if (offset.length > 0) {
        perimeters.push(offset);
      }
    }

    return perimeters;
  }

  /**
   * Generate infill
   */
  private generateInfill(
    intersections: THREE.Vector2[],
    config: SliceConfig
  ): THREE.Vector2[] {
    // Simplified infill generation
    // In production, use proper infill algorithms
    const infill: THREE.Vector2[] = [];

    if (intersections.length === 0) {
      return infill;
    }

    // Get bounding box
    const bounds = this.getBounds(intersections);
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;

    // Generate grid infill
    const spacing = 2.0 / config.infillDensity; // Adjust based on density
    for (let x = bounds.min.x; x <= bounds.max.x; x += spacing) {
      for (let y = bounds.min.y; y <= bounds.max.y; y += spacing) {
        const point = new THREE.Vector2(x, y);
        if (this.isPointInside(point, intersections)) {
          infill.push(point);
        }
      }
    }

    return infill;
  }

  /**
   * Generate support
   */
  private generateSupport(
    intersections: THREE.Vector2[],
    config: SliceConfig,
    layerIndex: number
  ): THREE.Vector2[] {
    // Simplified support generation
    // In production, use proper support algorithms
    return [];
  }

  /**
   * Convex hull (simplified)
   */
  private convexHull(points: THREE.Vector2[]): THREE.Vector2[] {
    if (points.length < 3) return points;

    // Graham scan algorithm (simplified)
    // Sort by angle
    const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    const hull: THREE.Vector2[] = [];

    // Build lower hull
    for (const point of sorted) {
      while (hull.length >= 2 && this.cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) {
        hull.pop();
      }
      hull.push(point);
    }

    // Build upper hull
    const upper: THREE.Vector2[] = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const point = sorted[i];
      while (upper.length >= 2 && this.cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
        upper.pop();
      }
      upper.push(point);
    }

    hull.pop();
    upper.pop();
    return hull.concat(upper);
  }

  /**
   * Cross product for convex hull
   */
  private cross(o: THREE.Vector2, a: THREE.Vector2, b: THREE.Vector2): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }

  /**
   * Offset polygon
   */
  private offsetPolygon(polygon: THREE.Vector2[], offset: number): THREE.Vector2[] {
    // Simplified offset (in production, use proper offset algorithm)
    return polygon.map(p => new THREE.Vector2(p.x + offset, p.y + offset));
  }

  /**
   * Get bounds
   */
  private getBounds(points: THREE.Vector2[]): { min: THREE.Vector2; max: THREE.Vector2 } {
    if (points.length === 0) {
      return { min: new THREE.Vector2(), max: new THREE.Vector2() };
    }

    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;

    for (const point of points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return {
      min: new THREE.Vector2(minX, minY),
      max: new THREE.Vector2(maxX, maxY)
    };
  }

  /**
   * Check if point is inside polygon
   */
  private isPointInside(point: THREE.Vector2, polygon: THREE.Vector2[]): boolean {
    // Ray casting algorithm
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Estimate print time
   */
  private estimatePrintTime(layers: SliceLayer[], config: SliceConfig): number {
    let totalDistance = 0;

    layers.forEach(layer => {
      layer.paths.forEach(path => {
        for (let i = 1; i < path.points.length; i++) {
          const dist = path.points[i].distanceTo(path.points[i - 1]);
          totalDistance += dist;
        }
      });
    });

    const timeSeconds = totalDistance / config.printSpeed;
    return timeSeconds / 60; // Convert to minutes
  }

  /**
   * Estimate material usage
   */
  private estimateMaterial(layers: SliceLayer[], config: SliceConfig): number {
    // Simplified material estimation
    // In production, calculate actual volume
    let totalVolume = 0;

    layers.forEach(layer => {
      layer.paths.forEach(path => {
        if (path.type === 'perimeter' || path.type === 'infill') {
          // Estimate volume based on path length and layer height
          let pathLength = 0;
          for (let i = 1; i < path.points.length; i++) {
            pathLength += path.points[i].distanceTo(path.points[i - 1]);
          }
          // Assume 0.4mm nozzle diameter
          const volume = pathLength * config.layerHeight * 0.4;
          totalVolume += volume;
        }
      });
    });

    // Convert to grams (assume PLA density ~1.24 g/cm³)
    const volumeCm3 = totalVolume / 1000; // mm³ to cm³
    return volumeCm3 * 1.24;
  }

  /**
   * Export to G-code
   */
  public exportToGCode(slicedModel: SlicedModel): string {
    let gcode = '; G-code generated by P31 Slicing Engine\n';
    gcode += '; The Mesh Holds 🔺\n';
    gcode += '; With love and light. As above, so below. 💜\n\n';

    gcode += `M104 S${slicedModel.config.temperature} ; Set extruder temperature\n`;
    gcode += `M140 S${slicedModel.config.bedTemperature} ; Set bed temperature\n`;
    gcode += 'G28 ; Home all axes\n';
    gcode += 'G1 Z15.0 F6000 ; Move to start position\n';
    gcode += 'M109 ; Wait for extruder temperature\n';
    gcode += 'M190 ; Wait for bed temperature\n\n';

    gcode += `G1 F${slicedModel.config.printSpeed * 60} ; Set print speed\n\n`;

    // Generate G-code for each layer
    slicedModel.layers.forEach((layer, index) => {
      gcode += `; Layer ${index + 1}\n`;
      gcode += `G1 Z${layer.z.toFixed(3)} F${slicedModel.config.printSpeed * 60}\n`;

      layer.paths.forEach(path => {
        if (path.points.length === 0) return;

        // Move to first point
        gcode += `G1 X${path.points[0].x.toFixed(3)} Y${path.points[0].y.toFixed(3)} F${slicedModel.config.travelSpeed * 60}\n`;

        // Extrude along path
        path.points.slice(1).forEach(point => {
          gcode += `G1 X${point.x.toFixed(3)} Y${point.y.toFixed(3)} E0.1\n`;
        });
      });

      gcode += '\n';
    });

    gcode += 'G28 X0 Y0 ; Home X and Y\n';
    gcode += 'M104 S0 ; Turn off extruder\n';
    gcode += 'M140 S0 ; Turn off bed\n';
    gcode += 'M84 ; Disable steppers\n';

    return gcode;
  }
}
