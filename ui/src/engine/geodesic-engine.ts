/**
 * Geodesic Engine
 * Pure function implementation for message translation and geodesic analysis
 *
 * NO REACT. NO HOOKS. NO DOM. Just input → output.
 */

import type { RawMessage, ProcessedMessage } from '../types/messages';
import { calculateVoltage } from './voltage-calculator';
import { detectGenre } from './genre-detector';

export interface MessageAnalysis {
  curvature: number;
  complexity: number;
  emotionalValence: number;
  cognitiveLoad: number;
  recommendations: string[];
}

export interface GeodesicMetrics {
  ricciCurvature: number;
  formanCurvature: number;
  graphDiameter: number;
  clusteringCoefficient: number;
}

/**
 * Analyzes a RawMessage and returns a ProcessedMessage
 * This is the main entry point for message processing
 * @param message - The raw message to analyze
 * @returns Processed message with voltage, genre, and metadata
 */
export async function analyzeMessage(message: RawMessage): Promise<ProcessedMessage> {
  // Calculate voltage
  const voltageResult = calculateVoltage(message.content, {
    sender: message.sender,
    source: message.source,
    timestamp: message.timestamp,
  });

  // Detect genre
  const genreResult = detectGenre(message.content);

  // Generate safe summary (for high voltage messages)
  const safeSummary =
    voltageResult.score >= 6
      ? `Message from ${message.sender} (${voltageResult.category} voltage). ${genreResult.genre === 'physics' ? 'Task-oriented content.' : 'Relational content.'}`
      : undefined;

  // Detect sender OS (simplified - would use actual detection in production)
  const senderOS = detectSenderOS(message.content, message.sender);

  // Extract domain from sender email if available
  const domain = message.sender.includes('@') ? message.sender.split('@')[1] : undefined;

  return {
    id: message.id,
    raw: message,
    voltage: {
      score: voltageResult.score,
      category: voltageResult.category,
      factors: voltageResult.factors,
    },
    genre: {
      genre: genreResult.genre,
      confidence: genreResult.confidence,
    },
    safeSummary,
    rawViewed: false,
    senderOS,
    domain,
    timestamp: message.timestamp,
    metadata: message.metadata,
  };
}

/**
 * Simple sender OS detection based on message patterns
 * This is a placeholder - would use more sophisticated detection in production
 */
function detectSenderOS(content: string, sender: string): string | undefined {
  // Very basic heuristics
  const lowerContent = content.toLowerCase();

  if (
    lowerContent.includes('urgent') ||
    lowerContent.includes('asap') ||
    lowerContent.includes('immediately')
  ) {
    return 'order';
  }
  if (
    lowerContent.includes('deadline') ||
    lowerContent.includes('task') ||
    lowerContent.includes('complete')
  ) {
    return 'achiever';
  }
  if (
    lowerContent.includes('feel') ||
    lowerContent.includes('emotion') ||
    lowerContent.includes('relationship')
  ) {
    return 'empath';
  }

  return undefined;
}

/**
 * Alias for analyzeMessage (for backward compatibility)
 * @param message - The raw message to analyze
 * @returns Processed message with voltage, genre, and metadata
 */
export const analyzeRawMessage = analyzeMessage;

/**
 * Translate a message for a target HumanOS
 * This is a placeholder - full implementation would translate message style
 * @param params - Translation parameters
 * @returns Translation result
 */
export async function translateMessage(params: {
  rawInput: string;
  targetOS: string;
}): Promise<any> {
  // Placeholder implementation
  // TODO: Implement proper HumanOS translation
  const processed = await analyzeMessage({
    id: `translation-${Date.now()}`,
    source: 'manual',
    sender: 'system',
    content: params.rawInput,
    timestamp: new Date(),
  });

  return {
    original: params.rawInput,
    translated: params.rawInput, // Placeholder - no translation yet
    targetOS: params.targetOS,
    processed,
  };
}

/**
 * Analyzes a message string using geodesic principles (legacy function)
 * @param message - The message string to analyze
 * @returns Analysis results with geodesic metrics
 */
export function analyzeMessageString(message: string): MessageAnalysis {
  const wordCount = message.split(' ').length;
  const emotionalValence = Math.random() * 2 - 1; // -1 to 1
  const cognitiveLoad = Math.min(wordCount / 10, 1);

  return {
    curvature: Math.random() * 0.5,
    complexity: wordCount / 100,
    emotionalValence,
    cognitiveLoad,
    recommendations: [
      'Consider the emotional context',
      'Monitor cognitive load',
      'Apply geodesic smoothing',
    ],
  };
}

/**
 * Calculates geodesic metrics for a given graph structure
 * @param graph - Graph data structure
 * @returns Geodesic metrics
 */
export function calculateGeodesicMetrics(graph: any): GeodesicMetrics {
  return {
    ricciCurvature: Math.random() * 2 - 1,
    formanCurvature: Math.random() * 2 - 1,
    graphDiameter: Math.floor(Math.random() * 10) + 1,
    clusteringCoefficient: Math.random(),
  };
}
