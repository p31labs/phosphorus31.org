// God Configuration - Core system parameters
// This file contains the fundamental configuration for The Buffer (P31 communication processing system)

export interface MetabolismConfig {
  maxSpoons: number;
  spoonRecoveryRate: number;
  stressThreshold: number;
  recoveryThreshold: number;
}

export interface HeartbeatConfig {
  thresholds: {
    green: number;
    yellow: number;
    red: number;
  };
  maxHeartbeat: number;
  minHeartbeat: number;
}

export const MetabolismConfig: MetabolismConfig = {
  maxSpoons: 12,
  spoonRecoveryRate: 0.1,
  stressThreshold: 8,
  recoveryThreshold: 4
};

export const HeartbeatConfig: HeartbeatConfig = {
  thresholds: {
    green: 70,
    yellow: 50,
    red: 30
  },
  maxHeartbeat: 100,
  minHeartbeat: 0
};

export const GodConfig = {
  Metabolism: MetabolismConfig,
  Heartbeat: HeartbeatConfig
};

export default GodConfig;