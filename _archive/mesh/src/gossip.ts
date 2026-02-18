/**
 * OMEGA PROTOCOL - MODULE B: MYCELIAL GOSSIP SWARM
 * =================================================
 * Decentralized intelligence via gossip protocols
 * 
 * Implements:
 * - Gossip Learning (GL) for peer-to-peer model training
 * - Distributed inference via layer sharding
 * - Vector-native memory synchronization with CRDTs
 * 
 * "The mycelium is the neurological network of nature"
 */

import { EventEmitter } from 'eventemitter3';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface MeshNode {
  id: string;
  publicKey: Uint8Array;
  capabilities: NodeCapability[];
  computeUnits: number;        // Relative compute power (1-100)
  lastSeen: number;
  latency: number;             // ms
  reputation: number;          // 0-1
  modelVersion: number;        // For gossip learning sync
}

export type NodeCapability = 
  | 'inference'      // Can run model inference
  | 'storage'        // Has vector DB storage
  | 'relay'          // Can relay messages
  | 'biometric'      // Has biometric sensors
  | 'gateway';       // Internet gateway

export interface GossipMessage {
  id: string;
  type: GossipMessageType;
  from: string;
  to: string | 'broadcast';
  payload: unknown;
  ttl: number;
  timestamp: number;
  signature?: Uint8Array;
}

export type GossipMessageType =
  | 'peer-sample'        // Random peer sampling
  | 'model-weights'      // Gossip learning weights
  | 'vector-sync'        // Vector memory sync
  | 'inference-request'  // Distributed inference
  | 'inference-result'   // Inference result
  | 'heartbeat'          // Node liveness
  | 'discovery';         // Peer discovery

export interface ModelWeights {
  layerId: number;
  weights: Float32Array;
  version: number;
  nodeId: string;
  timestamp: number;
}

export interface VectorMemory {
  id: string;
  embedding: Float32Array;
  metadata: Record<string, unknown>;
  timestamp: number;
  source: string;
}

export interface InferenceRequest {
  id: string;
  prompt: string;
  layers: LayerAssignment[];
  timeout: number;
}

export interface LayerAssignment {
  layerId: number;
  nodeId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// GOSSIP LEARNING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export class GossipLearning extends EventEmitter {
  private nodeId: string;
  private modelWeights: Map<number, Float32Array> = new Map();
  private modelVersion: number = 0;
  private peers: Map<string, MeshNode> = new Map();
  private gossipInterval: ReturnType<typeof setInterval> | null = null;

  constructor(nodeId: string) {
    super();
    this.nodeId = nodeId;
  }

  /**
   * Initialize local model weights
   */
  initializeModel(layerCount: number, weightsPerLayer: number): void {
    for (let i = 0; i < layerCount; i++) {
      // Initialize with small random weights
      const weights = new Float32Array(weightsPerLayer);
      for (let j = 0; j < weightsPerLayer; j++) {
        weights[j] = (Math.random() - 0.5) * 0.1;
      }
      this.modelWeights.set(i, weights);
    }
    this.modelVersion = 1;
    console.log(`[GossipLearning] Initialized model with ${layerCount} layers`);
  }

  /**
   * Start the gossip cycle
   */
  startGossiping(intervalMs: number = 5000): void {
    if (this.gossipInterval) return;

    this.gossipInterval = setInterval(() => {
      this.performGossipCycle();
    }, intervalMs);

    console.log('[GossipLearning] Started gossip cycle');
  }

  stopGossiping(): void {
    if (this.gossipInterval) {
      clearInterval(this.gossipInterval);
      this.gossipInterval = null;
    }
  }

  /**
   * The core gossip cycle
   */
  private performGossipCycle(): void {
    // 1. Select random peer
    const peer = this.selectRandomPeer();
    if (!peer) return;

    // 2. Request their model weights
    this.emit('gossip:request', {
      type: 'model-weights',
      from: this.nodeId,
      to: peer.id,
      payload: { version: this.modelVersion }
    });

    // 3. Emit our weights for exchange
    this.emit('gossip:send', {
      type: 'model-weights',
      from: this.nodeId,
      to: peer.id,
      payload: this.packWeights()
    });
  }

  /**
   * Select random peer using weighted sampling
   */
  private selectRandomPeer(): MeshNode | null {
    const peerArray = Array.from(this.peers.values());
    if (peerArray.length === 0) return null;

    // Weight by reputation and recency
    const weights = peerArray.map(p => {
      const recency = Math.max(0, 1 - (Date.now() - p.lastSeen) / 60000);
      return p.reputation * 0.7 + recency * 0.3;
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < peerArray.length; i++) {
      random -= weights[i];
      if (random <= 0) return peerArray[i];
    }

    return peerArray[0];
  }

  /**
   * Pack weights for transmission
   */
  private packWeights(): ModelWeights[] {
    const packed: ModelWeights[] = [];
    
    for (const [layerId, weights] of this.modelWeights) {
      packed.push({
        layerId,
        weights: weights,
        version: this.modelVersion,
        nodeId: this.nodeId,
        timestamp: Date.now()
      });
    }

    return packed;
  }

  /**
   * Receive and merge weights from peer
   * Uses weighted averaging for aggregation
   */
  receiveWeights(peerWeights: ModelWeights[]): void {
    let updated = false;

    for (const pw of peerWeights) {
      const localWeights = this.modelWeights.get(pw.layerId);
      if (!localWeights) continue;

      // Weighted average: give more weight to newer versions
      const localWeight = this.modelVersion / (this.modelVersion + pw.version);
      const peerWeight = 1 - localWeight;

      const merged = new Float32Array(localWeights.length);
      for (let i = 0; i < localWeights.length; i++) {
        merged[i] = localWeights[i] * localWeight + pw.weights[i] * peerWeight;
      }

      this.modelWeights.set(pw.layerId, merged);
      updated = true;
    }

    if (updated) {
      this.modelVersion++;
      this.emit('model:updated', this.modelVersion);
    }
  }

  /**
   * Apply local training update (delta learning)
   */
  applyLocalUpdate(layerId: number, gradient: Float32Array, learningRate: number = 0.01): void {
    const weights = this.modelWeights.get(layerId);
    if (!weights) return;

    for (let i = 0; i < weights.length; i++) {
      weights[i] -= learningRate * gradient[i];
    }

    this.modelVersion++;
    this.emit('model:updated', this.modelVersion);
  }

  /**
   * Register a peer
   */
  addPeer(node: MeshNode): void {
    this.peers.set(node.id, node);
    this.emit('peer:added', node);
  }

  removePeer(nodeId: string): void {
    this.peers.delete(nodeId);
    this.emit('peer:removed', nodeId);
  }

  getPeers(): MeshNode[] {
    return Array.from(this.peers.values());
  }

  getModelVersion(): number {
    return this.modelVersion;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DISTRIBUTED INFERENCE ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export interface InferenceLayer {
  id: number;
  type: 'embedding' | 'attention' | 'ffn' | 'output';
  inputSize: number;
  outputSize: number;
}

export class DistributedInference extends EventEmitter {
  private nodeId: string;
  private peers: Map<string, MeshNode> = new Map();
  private assignedLayers: Set<number> = new Set();
  private pendingRequests: Map<string, InferenceRequest> = new Map();

  constructor(nodeId: string) {
    super();
    this.nodeId = nodeId;
  }

  /**
   * Assign layers this node will handle
   */
  assignLayers(layerIds: number[]): void {
    this.assignedLayers = new Set(layerIds);
    console.log(`[DistributedInference] Node ${this.nodeId} assigned layers: ${layerIds.join(', ')}`);
  }

  /**
   * Route inference request across mesh
   * Returns layer assignments based on peer capabilities
   */
  planInference(layers: InferenceLayer[]): LayerAssignment[] {
    const assignments: LayerAssignment[] = [];
    const peerArray = Array.from(this.peers.values())
      .filter(p => p.capabilities.includes('inference'))
      .sort((a, b) => b.computeUnits - a.computeUnits);

    // Add self
    peerArray.unshift({
      id: this.nodeId,
      publicKey: new Uint8Array(),
      capabilities: ['inference'],
      computeUnits: 10, // Assume moderate local compute
      lastSeen: Date.now(),
      latency: 0,
      reputation: 1,
      modelVersion: 0
    });

    // Distribute layers based on compute capacity
    let peerIndex = 0;
    for (const layer of layers) {
      assignments.push({
        layerId: layer.id,
        nodeId: peerArray[peerIndex % peerArray.length].id
      });
      peerIndex++;
    }

    return assignments;
  }

  /**
   * Execute local layer computation
   */
  async computeLayer(
    layerId: number,
    input: Float32Array,
    weights: Float32Array
  ): Promise<Float32Array> {
    if (!this.assignedLayers.has(layerId)) {
      throw new Error(`Layer ${layerId} not assigned to this node`);
    }

    // Simplified matrix multiplication (in production: use ONNX/TensorFlow)
    // Assuming input is [batchSize * inputDim] and weights is [inputDim * outputDim]
    const inputDim = Math.sqrt(weights.length);
    const outputDim = inputDim;
    const output = new Float32Array(outputDim);

    for (let o = 0; o < outputDim; o++) {
      let sum = 0;
      for (let i = 0; i < Math.min(input.length, inputDim); i++) {
        sum += input[i] * weights[i * outputDim + o];
      }
      output[o] = Math.tanh(sum); // Simple activation
    }

    // Simulate computation time
    await new Promise(r => setTimeout(r, 10));

    return output;
  }

  /**
   * Handle incoming inference request
   */
  async handleInferenceRequest(request: InferenceRequest): Promise<void> {
    this.pendingRequests.set(request.id, request);

    // Find which layers we're responsible for
    const ourLayers = request.layers.filter(l => l.nodeId === this.nodeId);

    for (const layer of ourLayers) {
      this.emit('layer:processing', { requestId: request.id, layerId: layer.layerId });
    }
  }

  /**
   * Send activations to next node in chain
   */
  async forwardActivations(
    requestId: string,
    activations: Float32Array,
    nextLayerId: number
  ): Promise<void> {
    const request = this.pendingRequests.get(requestId);
    if (!request) return;

    const nextLayer = request.layers.find(l => l.layerId === nextLayerId);
    if (!nextLayer) return;

    this.emit('activations:forward', {
      requestId,
      nextNodeId: nextLayer.nodeId,
      activations,
      layerId: nextLayerId
    });
  }

  addPeer(node: MeshNode): void {
    this.peers.set(node.id, node);
  }

  removePeer(nodeId: string): void {
    this.peers.delete(nodeId);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VECTOR MEMORY SYNC (CRDT-based)
// ─────────────────────────────────────────────────────────────────────────────

export interface VectorClock {
  [nodeId: string]: number;
}

export class VectorMemorySync extends EventEmitter {
  private nodeId: string;
  private vectors: Map<string, VectorMemory> = new Map();
  private vectorClock: VectorClock = {};
  private readonly SIMILARITY_THRESHOLD = 0.85; // Cosine similarity threshold for novelty

  constructor(nodeId: string) {
    super();
    this.nodeId = nodeId;
    this.vectorClock[nodeId] = 0;
  }

  /**
   * Add a new memory vector
   */
  addMemory(embedding: Float32Array, metadata: Record<string, unknown>): string {
    const id = crypto.randomUUID();
    const memory: VectorMemory = {
      id,
      embedding,
      metadata,
      timestamp: Date.now(),
      source: this.nodeId
    };

    this.vectors.set(id, memory);
    this.vectorClock[this.nodeId]++;

    this.emit('memory:added', memory);
    return id;
  }

  /**
   * Receive memory from peer (gossip sync)
   */
  receiveMemory(memory: VectorMemory): boolean {
    // Check novelty via cosine similarity
    const isNovel = this.checkNovelty(memory.embedding);

    if (isNovel) {
      this.vectors.set(memory.id, memory);
      
      // Update vector clock
      if (!this.vectorClock[memory.source]) {
        this.vectorClock[memory.source] = 0;
      }
      this.vectorClock[memory.source]++;

      this.emit('memory:received', memory);
      return true;
    }

    return false;
  }

  /**
   * Check if embedding is novel (low similarity to existing memories)
   */
  private checkNovelty(embedding: Float32Array): boolean {
    for (const memory of this.vectors.values()) {
      const similarity = this.cosineSimilarity(embedding, memory.embedding);
      if (similarity > this.SIMILARITY_THRESHOLD) {
        return false; // Too similar to existing memory
      }
    }
    return true;
  }

  /**
   * Cosine similarity between two vectors
   */
  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Semantic search
   */
  search(queryEmbedding: Float32Array, topK: number = 5): VectorMemory[] {
    const scored: { memory: VectorMemory; score: number }[] = [];

    for (const memory of this.vectors.values()) {
      const score = this.cosineSimilarity(queryEmbedding, memory.embedding);
      scored.push({ memory, score });
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.memory);
  }

  /**
   * Get memories to sync (for gossip)
   */
  getMemoriesForSync(since: number): VectorMemory[] {
    return Array.from(this.vectors.values())
      .filter(m => m.timestamp > since);
  }

  /**
   * Merge vector clocks (CRDT operation)
   */
  mergeVectorClock(otherClock: VectorClock): void {
    for (const [nodeId, timestamp] of Object.entries(otherClock)) {
      this.vectorClock[nodeId] = Math.max(
        this.vectorClock[nodeId] || 0,
        timestamp
      );
    }
  }

  getVectorClock(): VectorClock {
    return { ...this.vectorClock };
  }

  getMemoryCount(): number {
    return this.vectors.size;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MYCELIAL GOSSIP SWARM (Main Coordinator)
// ─────────────────────────────────────────────────────────────────────────────

export interface SwarmConfig {
  nodeId: string;
  gossipIntervalMs: number;
  modelLayers: number;
  weightsPerLayer: number;
  embeddingDimension: number;
}

export class MycelialGossipSwarm extends EventEmitter {
  private nodeId: string;
  private learning: GossipLearning;
  private inference: DistributedInference;
  private memory: VectorMemorySync;
  private isActive: boolean = false;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: SwarmConfig) {
    super();
    this.nodeId = config.nodeId;
    
    this.learning = new GossipLearning(config.nodeId);
    this.inference = new DistributedInference(config.nodeId);
    this.memory = new VectorMemorySync(config.nodeId);

    // Initialize model
    this.learning.initializeModel(config.modelLayers, config.weightsPerLayer);

    // Wire up events
    this.wireEvents();
  }

  private wireEvents(): void {
    this.learning.on('gossip:send', (msg) => this.emit('mesh:send', msg));
    this.learning.on('model:updated', (v) => this.emit('model:updated', v));
    
    this.inference.on('activations:forward', (data) => {
      this.emit('mesh:send', {
        type: 'inference-result',
        ...data
      });
    });

    this.memory.on('memory:added', (mem) => {
      this.emit('mesh:send', {
        type: 'vector-sync',
        payload: mem
      });
    });
  }

  /**
   * Start the swarm
   */
  start(): void {
    if (this.isActive) return;
    this.isActive = true;

    // Start gossip learning
    this.learning.startGossiping(5000);

    // Start heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.emit('mesh:send', {
        type: 'heartbeat',
        from: this.nodeId,
        to: 'broadcast',
        payload: {
          modelVersion: this.learning.getModelVersion(),
          memoryCount: this.memory.getMemoryCount(),
          vectorClock: this.memory.getVectorClock()
        }
      });
    }, 10000);

    console.log('[MycelialSwarm] Swarm active');
    this.emit('swarm:started');
  }

  /**
   * Stop the swarm
   */
  stop(): void {
    this.learning.stopGossiping();
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.isActive = false;
    this.emit('swarm:stopped');
  }

  /**
   * Handle incoming mesh message
   */
  handleMessage(msg: GossipMessage): void {
    switch (msg.type) {
      case 'model-weights':
        this.learning.receiveWeights(msg.payload as ModelWeights[]);
        break;
      case 'vector-sync':
        this.memory.receiveMemory(msg.payload as VectorMemory);
        break;
      case 'inference-request':
        this.inference.handleInferenceRequest(msg.payload as InferenceRequest);
        break;
      case 'heartbeat':
        this.handleHeartbeat(msg);
        break;
      case 'peer-sample':
        this.handlePeerSample(msg);
        break;
    }
  }

  private handleHeartbeat(msg: GossipMessage): void {
    const payload = msg.payload as {
      modelVersion: number;
      memoryCount: number;
      vectorClock: VectorClock;
    };

    // Update peer info
    this.learning.addPeer({
      id: msg.from,
      publicKey: new Uint8Array(),
      capabilities: ['inference', 'storage'],
      computeUnits: 10,
      lastSeen: Date.now(),
      latency: Date.now() - msg.timestamp,
      reputation: 0.5,
      modelVersion: payload.modelVersion
    });

    // Merge vector clocks
    this.memory.mergeVectorClock(payload.vectorClock);
  }

  private handlePeerSample(msg: GossipMessage): void {
    // Return random subset of known peers
    const peers = this.learning.getPeers();
    const sample = peers.slice(0, 5);
    
    this.emit('mesh:send', {
      type: 'peer-sample',
      from: this.nodeId,
      to: msg.from,
      payload: sample
    });
  }

  /**
   * Add peer to swarm
   */
  addPeer(node: MeshNode): void {
    this.learning.addPeer(node);
    this.inference.addPeer(node);
  }

  /**
   * Perform distributed inference
   */
  async infer(prompt: string): Promise<string> {
    // In production, this would coordinate across nodes
    // Simplified: return placeholder
    this.emit('inference:start', { prompt });
    
    await new Promise(r => setTimeout(r, 100));
    
    const result = `[Swarm Response to: ${prompt.slice(0, 50)}...]`;
    this.emit('inference:complete', { prompt, result });
    
    return result;
  }

  /**
   * Store semantic memory
   */
  storeMemory(text: string, metadata: Record<string, unknown> = {}): string {
    // Generate embedding (simplified - would use actual model)
    const embedding = this.textToEmbedding(text);
    return this.memory.addMemory(embedding, { text, ...metadata });
  }

  /**
   * Search semantic memory
   */
  searchMemory(query: string, topK: number = 5): VectorMemory[] {
    const embedding = this.textToEmbedding(query);
    return this.memory.search(embedding, topK);
  }

  /**
   * Simplified text to embedding (would use real model)
   */
  private textToEmbedding(text: string, dim: number = 384): Float32Array {
    const embedding = new Float32Array(dim);
    
    // Hash-based embedding (placeholder)
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      embedding[i % dim] += charCode / 256;
      embedding[(i * 7) % dim] += Math.sin(charCode);
    }

    // Normalize
    let norm = 0;
    for (let i = 0; i < dim; i++) {
      norm += embedding[i] * embedding[i];
    }
    norm = Math.sqrt(norm);
    
    if (norm > 0) {
      for (let i = 0; i < dim; i++) {
        embedding[i] /= norm;
      }
    }

    return embedding;
  }

  /**
   * Get swarm statistics
   */
  getStats(): {
    peerCount: number;
    modelVersion: number;
    memoryCount: number;
    isActive: boolean;
  } {
    return {
      peerCount: this.learning.getPeers().length,
      modelVersion: this.learning.getModelVersion(),
      memoryCount: this.memory.getMemoryCount(),
      isActive: this.isActive
    };
  }
}

export default MycelialGossipSwarm;
