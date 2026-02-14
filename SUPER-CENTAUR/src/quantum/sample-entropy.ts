/**
 * Sample Entropy Algorithm
 * 
 * Calculates quantum coherence from IMU data using Sample Entropy.
 * Based on the work of Richman & Moorman (2000) and adapted for
 * quantum coherence measurement in biological systems.
 * 
 * Sample Entropy measures the regularity and predictability of a time series.
 * Higher entropy = lower coherence (more randomness)
 * Lower entropy = higher coherence (more structure)
 * 
 * For quantum coherence: coherence = 1 - normalized_entropy
 */

export interface IMUDataPoint {
  timestamp: number;
  accel: { x: number; y: number; z: number };
  gyro: { x: number; y: number; z: number };
}

export interface CoherenceResult {
  sampleEntropy: number;
  coherence: number; // 0-1, where 1 = perfect coherence
  confidence: number; // 0-1, confidence in measurement
  dataPoints: number;
  windowSize: number;
  timestamp: number;
}

/**
 * Calculate Sample Entropy for a time series
 * 
 * @param data - Time series data (1D array)
 * @param m - Template length (typically 2)
 * @param r - Tolerance (typically 0.2 * std)
 * @returns Sample Entropy value
 */
export function calculateSampleEntropy(
  data: number[],
  m: number = 2,
  r?: number
): number {
  const N = data.length;
  
  if (N < 10) {
    return 0; // Not enough data
  }

  // Calculate tolerance if not provided
  if (r === undefined) {
    const std = calculateStdDev(data);
    r = 0.2 * std;
  }

  // Count matches for template length m
  let matchesM = 0;
  let matchesMPlus1 = 0;

  for (let i = 0; i < N - m; i++) {
    const templateM = data.slice(i, i + m);
    let localMatchesM = 0;
    let localMatchesMPlus1 = 0;

    for (let j = 0; j < N - m; j++) {
      if (i === j) continue; // Don't compare template to itself

      const candidateM = data.slice(j, j + m);
      const distanceM = calculateMaxDistance(templateM, candidateM);

      if (distanceM <= r) {
        localMatchesM++;
        
        // Check m+1 length if m matches
        if (j + m < N) {
          const templateMPlus1 = data.slice(i, i + m + 1);
          const candidateMPlus1 = data.slice(j, j + m + 1);
          const distanceMPlus1 = calculateMaxDistance(templateMPlus1, candidateMPlus1);
          
          if (distanceMPlus1 <= r) {
            localMatchesMPlus1++;
          }
        }
      }
    }

    matchesM += localMatchesM;
    matchesMPlus1 += localMatchesMPlus1;
  }

  // Calculate Sample Entropy
  if (matchesM === 0 || matchesMPlus1 === 0) {
    return 0; // No matches found
  }

  const A = matchesMPlus1;
  const B = matchesM;
  const SampEn = -Math.log(A / B);

  return SampEn;
}

/**
 * Calculate quantum coherence from IMU data
 * 
 * @param imuData - Array of IMU data points
 * @param windowSize - Size of sliding window for calculation
 * @returns Coherence result
 */
export function calculateQuantumCoherence(
  imuData: IMUDataPoint[],
  windowSize: number = 100
): CoherenceResult {
  if (imuData.length < windowSize) {
    return {
      sampleEntropy: 0,
      coherence: 0,
      confidence: 0,
      dataPoints: imuData.length,
      windowSize,
      timestamp: Date.now(),
    };
  }

  // Use most recent window
  const window = imuData.slice(-windowSize);

  // Extract magnitude of acceleration (combines x, y, z)
  const accelMagnitude = window.map(point => {
    const { x, y, z } = point.accel;
    return Math.sqrt(x * x + y * y + z * z);
  });

  // Extract magnitude of gyroscope
  const gyroMagnitude = window.map(point => {
    const { x, y, z } = point.gyro;
    return Math.sqrt(x * x + y * y + z * z);
  });

  // Calculate Sample Entropy for both
  const accelEntropy = calculateSampleEntropy(accelMagnitude);
  const gyroEntropy = calculateSampleEntropy(gyroMagnitude);

  // Combined entropy (weighted average)
  const combinedEntropy = (accelEntropy * 0.6 + gyroEntropy * 0.4);

  // Normalize entropy to 0-1 range
  // Typical Sample Entropy values: 0-2 for most signals
  // Higher entropy = lower coherence
  const normalizedEntropy = Math.min(1, combinedEntropy / 2);

  // Coherence = 1 - normalized entropy
  // Higher coherence = lower entropy (more structured, predictable)
  const coherence = Math.max(0, 1 - normalizedEntropy);

  // Calculate confidence based on data quality
  const confidence = calculateConfidence(window, accelEntropy, gyroEntropy);

  return {
    sampleEntropy: combinedEntropy,
    coherence,
    confidence,
    dataPoints: window.length,
    windowSize,
    timestamp: Date.now(),
  };
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(data: number[]): number {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
}

/**
 * Calculate maximum distance between two vectors
 */
function calculateMaxDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    return Infinity;
  }

  let maxDist = 0;
  for (let i = 0; i < vec1.length; i++) {
    const dist = Math.abs(vec1[i] - vec2[i]);
    if (dist > maxDist) {
      maxDist = dist;
    }
  }

  return maxDist;
}

/**
 * Calculate confidence in the measurement
 */
function calculateConfidence(
  window: IMUDataPoint[],
  accelEntropy: number,
  gyroEntropy: number
): number {
  // Check data quality indicators
  let confidence = 1.0;

  // Check for sufficient variation (low variation = low confidence)
  const accelVariance = calculateVariance(
    window.map(p => Math.sqrt(p.accel.x ** 2 + p.accel.y ** 2 + p.accel.z ** 2))
  );
  const gyroVariance = calculateVariance(
    window.map(p => Math.sqrt(p.gyro.x ** 2 + p.gyro.y ** 2 + p.gyro.z ** 2))
  );

  if (accelVariance < 0.01) confidence *= 0.5; // Very low variation
  if (gyroVariance < 0.01) confidence *= 0.5;

  // Check for reasonable entropy values
  if (accelEntropy < 0 || accelEntropy > 3) confidence *= 0.7;
  if (gyroEntropy < 0 || gyroEntropy > 3) confidence *= 0.7;

  // Check for data gaps (timestamps)
  const timeGaps = window.slice(1).map((p, i) => p.timestamp - window[i].timestamp);
  const avgGap = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
  const maxGap = Math.max(...timeGaps);
  
  if (maxGap > avgGap * 3) confidence *= 0.8; // Large gaps indicate missing data

  return Math.max(0, Math.min(1, confidence));
}

/**
 * Calculate variance
 */
function calculateVariance(data: number[]): number {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  return variance;
}

/**
 * Real-time coherence monitor
 * Maintains a sliding window of IMU data and calculates coherence
 */
export class CoherenceMonitor {
  private dataWindow: IMUDataPoint[] = [];
  private maxWindowSize: number;
  private coherenceHistory: CoherenceResult[] = [];
  private maxHistorySize: number = 1000;

  constructor(windowSize: number = 100) {
    this.maxWindowSize = windowSize;
  }

  /**
   * Add new IMU data point
   */
  addDataPoint(point: IMUDataPoint): void {
    this.dataWindow.push(point);

    // Maintain window size
    if (this.dataWindow.length > this.maxWindowSize) {
      this.dataWindow.shift();
    }
  }

  /**
   * Get current coherence
   */
  getCurrentCoherence(): CoherenceResult | null {
    if (this.dataWindow.length < 10) {
      return null; // Not enough data
    }

    const result = calculateQuantumCoherence(this.dataWindow, this.maxWindowSize);
    
    // Store in history
    this.coherenceHistory.push(result);
    if (this.coherenceHistory.length > this.maxHistorySize) {
      this.coherenceHistory.shift();
    }

    return result;
  }

  /**
   * Get coherence history
   */
  getHistory(): CoherenceResult[] {
    return [...this.coherenceHistory];
  }

  /**
   * Get average coherence over time window
   */
  getAverageCoherence(timeWindowMs: number = 60000): number {
    const cutoff = Date.now() - timeWindowMs;
    const recent = this.coherenceHistory.filter(r => r.timestamp >= cutoff);
    
    if (recent.length === 0) return 0;

    const sum = recent.reduce((acc, r) => acc + r.coherence, 0);
    return sum / recent.length;
  }

  /**
   * Clear data
   */
  clear(): void {
    this.dataWindow = [];
    this.coherenceHistory = [];
  }
}
