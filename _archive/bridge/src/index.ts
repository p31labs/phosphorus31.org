// Entry point for the bridge package (hardware and IoT integration)
import { IoTManager } from './iot/manager';
import { PhenixBridge } from './phenix/bridge';
import { GadgetbridgeIngestor } from './wearables/gadgetbridge';

console.log("GENESIS_GATE bridge package started.");

// Initialize bridge modules
export const initializeBridge = async () => {
  console.log("Initializing bridge modules...");

  // IoT Manager
  const iotManager = new IoTManager({});
  await iotManager.initialize();

  // Phenix Bridge
  const phenixBridge = new PhenixBridge();
  await phenixBridge.initialize();

  // Gadgetbridge
  const gadgetbridge = new GadgetbridgeIngestor();
  await gadgetbridge.initialize();

  console.log("Bridge modules initialized successfully.");
  return { iotManager, phenixBridge, gadgetbridge };
};

// Auto-initialize on import
initializeBridge().catch(console.error);