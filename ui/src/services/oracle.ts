/**
 * The Oracle — AI-powered coherence prediction for the Quantum Geodesic Platform
 * Uses a lightweight model (TensorFlow.js) to predict coherence drop risk.
 * In production, load a trained LSTM from /models/oracle/model.json.
 * For development, createMockOracle() provides a minimal inference-ready model.
 */

import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

const MODEL_URL = '/models/oracle/model.json';

export async function loadOracleModel(): Promise<void> {
  try {
    model = await tf.loadLayersModel(MODEL_URL);
  } catch {
    model = null;
  }
}

/**
 * Create a minimal mock model for development when no trained model is available.
 * Two dense layers: 6 inputs → 8 ReLU → 1 sigmoid (probability of coherence drop).
 */
export function createMockOracle(): void {
  model = tf.sequential({
    layers: [
      tf.layers.dense({ units: 8, activation: 'relu', inputShape: [6] }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' }),
    ],
  });
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
}

/**
 * Predict probability (0..1) of a coherence drop in the next time window.
 * Features: vertex count, edge count, fractal dimension, latest stability, average stability, recent actions.
 */
export function predictCoherenceDrop(
  vertices: number[],
  edges: number[],
  stabilityHistory: number[],
  fractalDimension: number,
  recentActions: number
): number {
  const vertexCount = vertices.length / 3;
  const edgeCount = edges.length / 2;
  const latestStability = stabilityHistory.length > 0 ? stabilityHistory[stabilityHistory.length - 1]! : 0.5;
  const avgStability =
    stabilityHistory.length > 0
      ? stabilityHistory.reduce((a, b) => a + b, 0) / stabilityHistory.length
      : 0.5;

  if (!model) {
    // Heuristic fallback when no model is loaded
    const instability = 1 - avgStability;
    return Math.min(1, Math.max(0, instability * 0.7 + (Math.random() - 0.5) * 0.2));
  }

  const input = tf.tensor2d([
    [
      vertexCount,
      edgeCount,
      fractalDimension,
      latestStability,
      avgStability,
      recentActions,
    ],
  ]);

  const prediction = model.predict(input) as tf.Tensor;
  const result = (prediction as tf.Tensor1D).dataSync()[0] ?? 0.5;
  tf.dispose([input, prediction]);
  return Math.min(1, Math.max(0, result));
}

export function getOracleModel(): tf.LayersModel | null {
  return model;
}
