/**
 * Spoon Calculator
 * Pure function to estimate cognitive cost (spoons) of tasks
 *
 * Spoons represent finite cognitive energy. Each task costs spoons.
 * Recovery activities restore spoons.
 */

export interface SpoonCost {
  cost: number;
  category: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

/**
 * Calculate spoon cost for processing a message
 */
export function calculateSpoonCost(message: {
  voltage: number;
  length: number;
  complexity?: number;
  threatFlags?: number; // Number of threat categories detected
  isHostileContact?: boolean; // Known hostile contact
  timestamp?: Date; // Time of day affects cost
}): SpoonCost {
  let cost = 0;

  // Base cost from voltage (high voltage = high cognitive load)
  cost += message.voltage * 0.5;

  // Length factor (longer messages require more processing)
  const wordCount = message.length;
  if (wordCount > 500) {
    cost += 2;
  } else if (wordCount > 200) {
    cost += 1;
  } else if (wordCount > 100) {
    cost += 0.5;
  }

  // Complexity factor (if provided)
  if (message.complexity) {
    cost += message.complexity * 1.5;
  }

  // Threat multiplier (multiple threat categories increase cost)
  if (message.threatFlags && message.threatFlags > 0) {
    cost *= 1 + message.threatFlags * 0.3; // 30% increase per threat category
  }

  // Hostile contact multiplier (messages from known hostile contacts cost more)
  if (message.isHostileContact) {
    cost *= 1.5; // 50% increase for hostile contacts
  }

  // Time of day factor (late night = +1)
  if (message.timestamp) {
    const hour = message.timestamp.getHours();
    // Late night: 11 PM - 6 AM
    if (hour >= 23 || hour < 6) {
      cost += 1;
    }
  }

  // Clamp to reasonable range (0-10 spoons per message)
  cost = Math.max(0, Math.min(10, cost));

  // Determine category
  let category: 'low' | 'medium' | 'high' | 'critical';
  let description: string;

  if (cost <= 2) {
    category = 'low';
    description = 'Minimal cognitive cost';
  } else if (cost <= 4) {
    category = 'medium';
    description = 'Moderate cognitive cost';
  } else if (cost <= 7) {
    category = 'high';
    description = 'High cognitive cost - consider delaying';
  } else {
    category = 'critical';
    description = 'Very high cognitive cost - delay recommended';
  }

  return {
    cost: Math.round(cost * 10) / 10,
    category,
    description,
  };
}

/**
 * Calculate spoon recovery from activities
 */
export function calculateSpoonRecovery(activity: {
  type: 'rest' | 'heavy_work' | 'breathing' | 'somatic';
  duration: number; // minutes
}): number {
  let recovery = 0;

  switch (activity.type) {
    case 'rest':
      // Rest: 1 spoon per 15 minutes
      recovery = activity.duration / 15;
      break;
    case 'heavy_work':
      // Heavy work: 1 spoon per 5 minutes (proprioceptive regulation)
      recovery = activity.duration / 5;
      break;
    case 'breathing':
      // Breathing exercises: 0.5 spoons per 5 minutes
      recovery = (activity.duration / 5) * 0.5;
      break;
    case 'somatic':
      // Somatic regulation: 1 spoon per 10 minutes
      recovery = activity.duration / 10;
      break;
  }

  return Math.round(recovery * 10) / 10;
}
