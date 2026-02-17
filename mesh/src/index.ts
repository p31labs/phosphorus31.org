// Entry point for the mesh package (P2P mesh networking)
import MycelialGossipSwarm from './mycelial-swarm';

console.log("GENESIS_GATE mesh package started.");

// Initialize mesh modules
export const initializeMesh = async () => {
  console.log("Initializing mesh modules...");

  // Mycelial Swarm - main coordinator for P2P gossip
  const swarmConfig = {
    nodeId: `node_${Date.now()}`,
    gossipIntervalMs: 5000,
    modelLayers: 4,
    weightsPerLayer: 256,
    embeddingDimension: 384
  };
  const swarm = new MycelialGossipSwarm(swarmConfig);
  swarm.start();

  console.log("Mesh modules initialized successfully.");
  return { swarm };
};

export { MycelialGossipSwarm };
export * from './mycelial-swarm';
