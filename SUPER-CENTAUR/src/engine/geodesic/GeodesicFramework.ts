/**
 * Geodesic Framework
 * P31 Geodesic Operations and Topology
 * 
 * "The mesh holds. Four vertices. Six edges. Four faces. The minimum stable system."
 * 
 * With love and light. As above, so below. 💜
 */

export interface Vertex {
  id: string;
  x: number;
  y: number;
  z: number;
  quantumState?: any;
}

export interface Edge {
  id: string;
  vertex1: Vertex;
  vertex2: Vertex;
  strength: number;  // 0.0 - 1.0
  coherence: number; // 0.0 - 1.0
}

export interface Face {
  id: string;
  vertices: [Vertex, Vertex, Vertex];
  area: number;
  normal: { x: number; y: number; z: number };
}

export interface Tetrahedron {
  id: string;
  vertices: [Vertex, Vertex, Vertex, Vertex];
  edges: [Edge, Edge, Edge, Edge, Edge, Edge];
  faces: [Face, Face, Face, Face];
  coherence: number;  // 0.0 - 1.0
  stability: number;  // 0.0 - 1.0
}

export interface Connection {
  tetrahedron1: number;
  tetrahedron2: number;
  edge: Edge;
}

export interface GeodesicDome {
  id: string;
  frequency: number;
  polyhedronClass: 'Icosahedron' | 'Octahedron' | 'Tetrahedron';
  tetrahedra: Tetrahedron[];
  vertices: Vertex[];
  edges: Edge[];
  faces: Face[];
  coherence: number;
  stability: number;
  radius: number;
}

export interface Mesh {
  id: string;
  tetrahedra: Tetrahedron[];
  connections: Connection[];
  coherence: number;
  stability: number;
  resilience: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class GeodesicFramework {
  private tetrahedraCounter: number = 0;
  private vertexCounter: number = 0;
  private edgeCounter: number = 0;
  private faceCounter: number = 0;

  /**
   * Create a tetrahedron from four vertices
   */
  createTetrahedron(
    v1: Vertex,
    v2: Vertex,
    v3: Vertex,
    v4: Vertex
  ): Tetrahedron {
    // Validate: exactly 4 unique vertices
    const vertices = [v1, v2, v3, v4];
    const vertexIds = vertices.map(v => v.id);
    if (new Set(vertexIds).size !== 4) {
      throw new Error('Tetrahedron must have exactly 4 unique vertices');
    }

    // Create 6 edges
    const edges: Edge[] = [
      this.createEdge(v1, v2),
      this.createEdge(v1, v3),
      this.createEdge(v1, v4),
      this.createEdge(v2, v3),
      this.createEdge(v2, v4),
      this.createEdge(v3, v4)
    ];

    // Create 4 faces
    const faces: Face[] = [
      this.createFace(v1, v2, v3),
      this.createFace(v1, v2, v4),
      this.createFace(v1, v3, v4),
      this.createFace(v2, v3, v4)
    ];

    // Validate Maxwell's Rule: E ≥ 3V - 6
    // For tetrahedron: 6 ≥ 3(4) - 6 = 6 ≥ 6 ✓
    if (edges.length < 3 * vertices.length - 6) {
      throw new Error('Maxwell\'s Rule violation: E < 3V - 6');
    }

    // Calculate coherence and stability
    const coherence = this.calculateCoherence(vertices, edges);
    const stability = this.calculateStability(edges, faces);

    const tetrahedron: Tetrahedron = {
      id: `tetra_${++this.tetrahedraCounter}`,
      vertices: [v1, v2, v3, v4] as [Vertex, Vertex, Vertex, Vertex],
      edges: edges as [Edge, Edge, Edge, Edge, Edge, Edge],
      faces: faces as [Face, Face, Face, Face],
      coherence,
      stability
    };

    console.log(`🔺 Created tetrahedron: ${tetrahedron.id} (coherence: ${coherence.toFixed(2)}, stability: ${stability.toFixed(2)})`);

    return tetrahedron;
  }

  /**
   * Create an edge between two vertices
   */
  private createEdge(v1: Vertex, v2: Vertex): Edge {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const dz = v2.z - v1.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Calculate edge strength (inverse of length, normalized)
    const strength = Math.max(0, 1 - length / 10);

    // Calculate edge coherence (based on vertex quantum states)
    const coherence = this.calculateEdgeCoherence(v1, v2);

    return {
      id: `edge_${++this.edgeCounter}`,
      vertex1: v1,
      vertex2: v2,
      strength,
      coherence
    };
  }

  /**
   * Create a face from three vertices
   */
  private createFace(v1: Vertex, v2: Vertex, v3: Vertex): Face {
    // Calculate face area using cross product
    const v12 = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
    const v13 = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };
    const cross = {
      x: v12.y * v13.z - v12.z * v13.y,
      y: v12.z * v13.x - v12.x * v13.z,
      z: v12.x * v13.y - v12.y * v13.x
    };
    const area = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2) / 2;

    // Calculate face normal
    const length = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2);
    const normal = length > 0 ? {
      x: cross.x / length,
      y: cross.y / length,
      z: cross.z / length
    } : { x: 0, y: 0, z: 1 };

    return {
      id: `face_${++this.faceCounter}`,
      vertices: [v1, v2, v3],
      area,
      normal
    };
  }

  /**
   * Generate a geodesic dome
   */
  generateGeodesicDome(
    frequency: number,
    polyhedronClass: 'Icosahedron' | 'Octahedron' | 'Tetrahedron',
    radius: number = 10
  ): GeodesicDome {
    console.log(`🔺 Generating geodesic dome: frequency=${frequency}, class=${polyhedronClass}, radius=${radius}`);

    // Generate base polyhedron
    const basePolyhedron = this.generateBasePolyhedron(polyhedronClass, radius);

    // Subdivide faces based on frequency
    const subdividedFaces = this.subdivideFaces(basePolyhedron.faces, frequency);

    // Convert to tetrahedra
    const tetrahedra = this.convertToTetrahedra(subdividedFaces, radius);

    // Project to sphere
    const projectedTetrahedra = this.projectToSphere(tetrahedra, radius);

    // Extract unique vertices, edges, and faces
    const vertices = this.extractUniqueVertices(projectedTetrahedra);
    const edges = this.extractUniqueEdges(projectedTetrahedra);
    const faces = this.extractUniqueFaces(projectedTetrahedra);

    // Calculate overall coherence and stability
    const coherence = this.calculateMeshCoherence(projectedTetrahedra);
    const stability = this.calculateMeshStability(projectedTetrahedra);

    const dome: GeodesicDome = {
      id: `dome_${Date.now()}`,
      frequency,
      polyhedronClass,
      tetrahedra: projectedTetrahedra,
      vertices,
      edges,
      faces,
      coherence,
      stability,
      radius
    };

    console.log(`✅ Geodesic dome created: ${dome.tetrahedra.length} tetrahedra, coherence: ${coherence.toFixed(2)}, stability: ${stability.toFixed(2)}`);

    return dome;
  }

  /**
   * Generate base polyhedron
   */
  private generateBasePolyhedron(
    polyhedronClass: 'Icosahedron' | 'Octahedron' | 'Tetrahedron',
    radius: number
  ): { vertices: Vertex[]; faces: Face[] } {
    // Simplified base polyhedron generation
    // In production, would use proper icosahedron/octahedron/tetrahedron generation

    const vertices: Vertex[] = [];
    const faces: Face[] = [];

    if (polyhedronClass === 'Tetrahedron') {
      // Simple tetrahedron
      vertices.push(
        { id: `v_${++this.vertexCounter}`, x: 0, y: 0, z: radius },
        { id: `v_${++this.vertexCounter}`, x: radius, y: 0, z: 0 },
        { id: `v_${++this.vertexCounter}`, x: -radius / 2, y: radius * Math.sqrt(3) / 2, z: 0 },
        { id: `v_${++this.vertexCounter}`, x: -radius / 2, y: -radius * Math.sqrt(3) / 2, z: 0 }
      );
    } else {
      // Simplified icosahedron/octahedron (would use proper generation)
      for (let i = 0; i < 12; i++) {
        const theta = (i * Math.PI * 2) / 12;
        vertices.push({
          id: `v_${++this.vertexCounter}`,
          x: radius * Math.cos(theta),
          y: radius * Math.sin(theta),
          z: radius * 0.5
        });
      }
    }

    return { vertices, faces };
  }

  /**
   * Subdivide faces based on frequency
   */
  private subdivideFaces(faces: Face[], frequency: number): Face[] {
    if (frequency === 1) return faces;

    const subdivided: Face[] = [];
    for (const face of faces) {
      // Subdivide each face into frequency^2 smaller faces
      const subFaces = this.subdivideFace(face, frequency);
      subdivided.push(...subFaces);
    }

    return subdivided;
  }

  /**
   * Subdivide a single face
   */
  private subdivideFace(face: Face, frequency: number): Face[] {
    const [v1, v2, v3] = face.vertices;
    const subdivided: Face[] = [];

    // Create new vertices along edges
    for (let i = 0; i < frequency; i++) {
      for (let j = 0; j < frequency - i; j++) {
        // Create subdivided triangular faces
        // Simplified subdivision (would use proper barycentric coordinates)
        const newV1 = this.interpolateVertex(v1, v2, i / frequency);
        const newV2 = this.interpolateVertex(v2, v3, j / frequency);
        const newV3 = this.interpolateVertex(v1, v3, (i + j) / frequency);

        subdivided.push(this.createFace(newV1, newV2, newV3));
      }
    }

    return subdivided;
  }

  /**
   * Interpolate between two vertices
   */
  private interpolateVertex(v1: Vertex, v2: Vertex, t: number): Vertex {
    return {
      id: `v_${++this.vertexCounter}`,
      x: v1.x + (v2.x - v1.x) * t,
      y: v1.y + (v2.y - v1.y) * t,
      z: v1.z + (v2.z - v1.z) * t
    };
  }

  /**
   * Convert faces to tetrahedra
   */
  private convertToTetrahedra(faces: Face[], radius: number): Tetrahedron[] {
    const tetrahedra: Tetrahedron[] = [];
    const center: Vertex = { id: `v_${++this.vertexCounter}`, x: 0, y: 0, z: 0 };

    for (const face of faces) {
      // Create tetrahedron from face and center
      const tetra = this.createTetrahedron(
        face.vertices[0],
        face.vertices[1],
        face.vertices[2],
        center
      );
      tetrahedra.push(tetra);
    }

    return tetrahedra;
  }

  /**
   * Project vertices to sphere surface
   */
  private projectToSphere(tetrahedra: Tetrahedron[], radius: number): Tetrahedron[] {
    return tetrahedra.map(tetra => {
      const projectedVertices = tetra.vertices.map(v => {
        const distance = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
        if (distance === 0) return v;
        const scale = radius / distance;
        return {
          ...v,
          x: v.x * scale,
          y: v.y * scale,
          z: v.z * scale
        };
      });

      // Recreate tetrahedron with projected vertices
      return this.createTetrahedron(
        projectedVertices[0],
        projectedVertices[1],
        projectedVertices[2],
        projectedVertices[3]
      );
    });
  }

  /**
   * Create a mesh from tetrahedra
   */
  createMesh(tetrahedra: Tetrahedron[]): Mesh {
    // Validate all tetrahedra
    for (const tetra of tetrahedra) {
      this.validateTetrahedron(tetra);
    }

    // Find connections (shared edges)
    const connections = this.findConnections(tetrahedra);

    // Validate mesh connectivity
    if (!this.isConnected(tetrahedra, connections)) {
      throw new Error('Mesh is not connected');
    }

    // Calculate mesh-wide properties
    const coherence = this.calculateMeshCoherence(tetrahedra);
    const stability = this.calculateMeshStability(tetrahedra);
    const resilience = this.calculateResilience(tetrahedra, connections);

    const mesh: Mesh = {
      id: `mesh_${Date.now()}`,
      tetrahedra,
      connections,
      coherence,
      stability,
      resilience
    };

    console.log(`🔺 Mesh created: ${mesh.tetrahedra.length} tetrahedra, ${mesh.connections.length} connections, coherence: ${coherence.toFixed(2)}, stability: ${stability.toFixed(2)}, resilience: ${resilience.toFixed(2)}`);

    return mesh;
  }

  /**
   * Find connections between tetrahedra
   */
  private findConnections(tetrahedra: Tetrahedron[]): Connection[] {
    const connections: Connection[] = [];

    for (let i = 0; i < tetrahedra.length; i++) {
      for (let j = i + 1; j < tetrahedra.length; j++) {
        const sharedEdges = this.findSharedEdges(tetrahedra[i], tetrahedra[j]);
        for (const edge of sharedEdges) {
          connections.push({
            tetrahedron1: i,
            tetrahedron2: j,
            edge
          });
        }
      }
    }

    return connections;
  }

  /**
   * Find shared edges between two tetrahedra
   */
  private findSharedEdges(tetra1: Tetrahedron, tetra2: Tetrahedron): Edge[] {
    const shared: Edge[] = [];

    for (const edge1 of tetra1.edges) {
      for (const edge2 of tetra2.edges) {
        if (this.edgesEqual(edge1, edge2)) {
          shared.push(edge1);
        }
      }
    }

    return shared;
  }

  /**
   * Check if two edges are equal
   */
  private edgesEqual(e1: Edge, e2: Edge): boolean {
    return (
      (e1.vertex1.id === e2.vertex1.id && e1.vertex2.id === e2.vertex2.id) ||
      (e1.vertex1.id === e2.vertex2.id && e1.vertex2.id === e2.vertex1.id)
    );
  }

  /**
   * Check if mesh is connected
   */
  private isConnected(tetrahedra: Tetrahedron[], connections: Connection[]): boolean {
    if (tetrahedra.length === 0) return true;
    if (tetrahedra.length === 1) return true;

    // Build adjacency graph
    const adj: number[][] = Array(tetrahedra.length).fill(null).map(() => []);
    for (const conn of connections) {
      adj[conn.tetrahedron1].push(conn.tetrahedron2);
      adj[conn.tetrahedron2].push(conn.tetrahedron1);
    }

    // BFS to check connectivity
    const visited = new Set<number>();
    const queue = [0];
    visited.add(0);

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of adj[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return visited.size === tetrahedra.length;
  }

  /**
   * Calculate coherence for vertices and edges
   */
  calculateCoherence(vertices: Vertex[], edges: Edge[]): number {
    const vertexCoherence = this.calculateVertexCoherence(vertices);
    const edgeCoherence = this.calculateEdgeCoherenceFromEdges(edges);
    const geometricCoherence = this.calculateGeometricCoherence(vertices, edges);

    // Weighted average
    return (
      vertexCoherence * 0.4 +
      edgeCoherence * 0.4 +
      geometricCoherence * 0.2
    );
  }

  /**
   * Calculate vertex coherence
   */
  private calculateVertexCoherence(vertices: Vertex[]): number {
    // Simplified: based on vertex distribution
    if (vertices.length === 0) return 0;

    // Calculate average distance
    let totalDistance = 0;
    let count = 0;
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[j].x - vertices[i].x;
        const dy = vertices[j].y - vertices[i].y;
        const dz = vertices[j].z - vertices[i].z;
        totalDistance += Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
        count++;
      }
    }

    const avgDistance = count > 0 ? totalDistance / count : 0;
    // Coherence inversely related to distance variance
    return Math.max(0, Math.min(1, 1 - avgDistance / 20));
  }

  /**
   * Calculate edge coherence from array of edges
   */
  private calculateEdgeCoherenceFromEdges(edges: Edge[]): number {
    if (edges.length === 0) return 0;
    const avgCoherence = edges.reduce((sum, e) => sum + e.coherence, 0) / edges.length;
    return avgCoherence;
  }

  /**
   * Calculate edge coherence between two vertices
   */
  private calculateEdgeCoherence(v1: Vertex, v2: Vertex): number {
    // Simplified: based on distance
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const dz = v2.z - v1.z;
    const distance = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
    return Math.max(0, Math.min(1, 1 - distance / 10));
  }

  /**
   * Calculate geometric coherence
   */
  private calculateGeometricCoherence(vertices: Vertex[], edges: Edge[]): number {
    // Simplified: based on symmetry and regularity
    // In production, would use proper geometric analysis
    return 0.8; // Placeholder
  }

  /**
   * Calculate stability for edges and faces
   */
  calculateStability(edges: Edge[], faces: Face[]): number {
    const edgeStability = this.calculateEdgeStability(edges);
    const faceStability = this.calculateFaceStability(faces);
    const loadStability = this.calculateLoadStability(edges, faces);

    // Weighted average
    return (
      edgeStability * 0.3 +
      faceStability * 0.4 +
      loadStability * 0.3
    );
  }

  /**
   * Calculate edge stability
   */
  private calculateEdgeStability(edges: Edge[]): number {
    if (edges.length === 0) return 0;
    const avgStrength = edges.reduce((sum, e) => sum + e.strength, 0) / edges.length;
    return avgStrength;
  }

  /**
   * Calculate face stability
   */
  private calculateFaceStability(faces: Face[]): number {
    if (faces.length === 0) return 0;
    // Triangular faces are inherently stable
    return 0.9; // Placeholder
  }

  /**
   * Calculate load stability
   */
  private calculateLoadStability(edges: Edge[], faces: Face[]): number {
    // Simplified load analysis
    return 0.8; // Placeholder
  }

  /**
   * Calculate mesh coherence
   */
  private calculateMeshCoherence(tetrahedra: Tetrahedron[]): number {
    if (tetrahedra.length === 0) return 0;
    const avgCoherence = tetrahedra.reduce((sum, t) => sum + t.coherence, 0) / tetrahedra.length;
    return avgCoherence;
  }

  /**
   * Calculate mesh stability
   */
  private calculateMeshStability(tetrahedra: Tetrahedron[]): number {
    if (tetrahedra.length === 0) return 0;
    const avgStability = tetrahedra.reduce((sum, t) => sum + t.stability, 0) / tetrahedra.length;
    return avgStability;
  }

  /**
   * Calculate resilience
   */
  private calculateResilience(tetrahedra: Tetrahedron[], connections: Connection[]): number {
    // Resilience based on connectivity and redundancy
    const connectivity = connections.length / (tetrahedra.length * (tetrahedra.length - 1) / 2);
    const avgStability = this.calculateMeshStability(tetrahedra);
    return (connectivity * 0.5 + avgStability * 0.5);
  }

  /**
   * Validate tetrahedron
   */
  validateTetrahedron(tetra: Tetrahedron): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check vertex count
    if (tetra.vertices.length !== 4) {
      errors.push(`Tetrahedron must have exactly 4 vertices, got ${tetra.vertices.length}`);
    }

    // Check edge count
    if (tetra.edges.length !== 6) {
      errors.push(`Tetrahedron must have exactly 6 edges, got ${tetra.edges.length}`);
    }

    // Check face count
    if (tetra.faces.length !== 4) {
      errors.push(`Tetrahedron must have exactly 4 faces, got ${tetra.faces.length}`);
    }

    // Check Maxwell's Rule
    if (tetra.edges.length < 3 * tetra.vertices.length - 6) {
      errors.push('Maxwell\'s Rule violation: E < 3V - 6');
    }

    // Check coherence threshold
    if (tetra.coherence < 0.7) {
      warnings.push(`Tetrahedron coherence is below recommended threshold (0.7): ${tetra.coherence.toFixed(2)}`);
    }

    // Check stability threshold
    if (tetra.stability < 0.8) {
      warnings.push(`Tetrahedron stability is below recommended threshold (0.8): ${tetra.stability.toFixed(2)}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate mesh
   */
  validateMesh(mesh: Mesh): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check all tetrahedra
    for (const tetra of mesh.tetrahedra) {
      const result = this.validateTetrahedron(tetra);
      if (!result.valid) {
        errors.push(...result.errors.map(e => `${tetra.id}: ${e}`));
      }
      if (result.warnings.length > 0) {
        warnings.push(...result.warnings.map(w => `${tetra.id}: ${w}`));
      }
    }

    // Check connectivity
    if (!this.isConnected(mesh.tetrahedra, mesh.connections)) {
      errors.push('Mesh is not connected');
    }

    // Check coherence threshold
    if (mesh.coherence < 0.7) {
      warnings.push(`Mesh coherence is below recommended threshold (0.7): ${mesh.coherence.toFixed(2)}`);
    }

    // Check stability threshold
    if (mesh.stability < 0.8) {
      warnings.push(`Mesh stability is below recommended threshold (0.8): ${mesh.stability.toFixed(2)}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Extract unique vertices from tetrahedra
   */
  private extractUniqueVertices(tetrahedra: Tetrahedron[]): Vertex[] {
    const vertexMap = new Map<string, Vertex>();
    for (const tetra of tetrahedra) {
      for (const vertex of tetra.vertices) {
        if (!vertexMap.has(vertex.id)) {
          vertexMap.set(vertex.id, vertex);
        }
      }
    }
    return Array.from(vertexMap.values());
  }

  /**
   * Extract unique edges from tetrahedra
   */
  private extractUniqueEdges(tetrahedra: Tetrahedron[]): Edge[] {
    const edgeMap = new Map<string, Edge>();
    for (const tetra of tetrahedra) {
      for (const edge of tetra.edges) {
        if (!edgeMap.has(edge.id)) {
          edgeMap.set(edge.id, edge);
        }
      }
    }
    return Array.from(edgeMap.values());
  }

  /**
   * Extract unique faces from tetrahedra
   */
  private extractUniqueFaces(tetrahedra: Tetrahedron[]): Face[] {
    const faceMap = new Map<string, Face>();
    for (const tetra of tetrahedra) {
      for (const face of tetra.faces) {
        if (!faceMap.has(face.id)) {
          faceMap.set(face.id, face);
        }
      }
    }
    return Array.from(faceMap.values());
  }
}
