/**
 * Voltage Calculator
 * Pure function to calculate emotional intensity (voltage) of messages
 * 
 * Voltage scale: 0-10
 * 0-3: Low (safe to view immediately)
 * 4-6: Medium (buffer recommended)
 * 7-9: High (require sanitization)
 * 10: Critical (escalate to guardian)
 */

export interface VoltageResult {
  score: number; // 0-10
  category: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
}

/**
 * Calculate voltage score for a message
 */
export function calculateVoltage(content: string, metadata?: {
  sender?: string;
  source?: string;
  timestamp?: Date;
}): VoltageResult {
  let score = 0;
  const factors: string[] = [];

  // Word count factor (longer messages = higher cognitive load)
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 200) {
    score += 1;
    factors.push('Long message');
  }

  // Emotional indicators (simple keyword detection)
  const emotionalKeywords = {
    high: ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'angry', 'furious', 'disappointed', 'frustrated'],
    medium: ['concerned', 'worried', 'unhappy', 'confused', 'disappointed'],
    low: ['thanks', 'appreciate', 'happy', 'excited', 'pleased']
  };

  const lowerContent = content.toLowerCase();
  
  const highCount = emotionalKeywords.high.filter(kw => lowerContent.includes(kw)).length;
  const mediumCount = emotionalKeywords.medium.filter(kw => lowerContent.includes(kw)).length;
  const lowCount = emotionalKeywords.low.filter(kw => lowerContent.includes(kw)).length;

  score += highCount * 1.5;
  score += mediumCount * 0.5;
  score -= lowCount * 0.3;

  if (highCount > 0) factors.push('High-emotion keywords');
  if (mediumCount > 0) factors.push('Medium-emotion keywords');

  // Exclamation marks (intensity indicator)
  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    score += 1;
    factors.push('High punctuation intensity');
  }

  // Question marks (uncertainty/urgency)
  const questionCount = (content.match(/\?/g) || []).length;
  if (questionCount > 5) {
    score += 0.5;
    factors.push('Many questions');
  }

  // ALL CAPS detection (improved)
  const capsRatio = (content.match(/[A-Z]/g) || []).length / Math.max(content.length, 1);
  if (capsRatio > 0.3 && content.length > 10) {
    score += 2; // Increased from 1.5 to 2 as per requirements
    factors.push('All caps detected');
  }
  
  // Curse words detection
  const curseWords = ['damn', 'hell', 'shit', 'fuck', 'ass', 'bitch', 'bastard', 'crap', 'piss'];
  const curseCount = curseWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(content)
  ).length;
  if (curseCount > 0) {
    score += curseCount * 1.5;
    factors.push(`Curse words detected (${curseCount})`);
  }

  // Clamp score to 0-10
  score = Math.max(0, Math.min(10, score));

  // Determine category
  let category: 'low' | 'medium' | 'high' | 'critical';
  if (score <= 3) {
    category = 'low';
  } else if (score <= 6) {
    category = 'medium';
  } else if (score <= 9) {
    category = 'high';
  } else {
    category = 'critical';
  }

  return {
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    category,
    factors
  };
}
