/**
 * Filter Patterns
 * Threat detection patterns (keyword/regex) for message filtering
 *
 * Pure functions - no React, no DOM, just pattern matching
 */

export interface ThreatPattern {
  id: string;
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface ThreatMatch {
  pattern: ThreatPattern;
  match: string;
  position: number;
}

/**
 * Threat category types for classification
 */
export type ThreatCategory =
  | 'legal'
  | 'emotional'
  | 'financial'
  | 'gaslighting'
  | 'pressure'
  | 'general';

/**
 * Extended threat pattern with category
 */
export interface ExtendedThreatPattern extends ThreatPattern {
  category?: ThreatCategory;
}

/**
 * Default threat patterns
 */
export const DEFAULT_THREAT_PATTERNS: ExtendedThreatPattern[] = [
  // Legal threats
  {
    id: 'legal_threat',
    name: 'Legal Threat',
    category: 'legal',
    pattern:
      /(i'm going to take you to court|taking you to court|suing you|file (a|an) (lawsuit|suit)|my attorney|my lawyer|legal action|legal proceedings|we file|filing against)/i,
    severity: 'critical',
    description: 'Legal action threats',
  },
  {
    id: 'legal_pressure',
    name: 'Legal Pressure',
    category: 'legal',
    pattern:
      /(you have until|deadline to respond|or we file|or else we|before we take|legal consequences)/i,
    severity: 'high',
    description: 'Legal pressure and deadlines',
  },
  // Emotional manipulation
  {
    id: 'absolutist_language',
    name: 'Absolutist Language',
    category: 'emotional',
    pattern:
      /(you (always|never) (do|think|say|are)|you're (always|never)|this is all your fault|everything is your fault)/i,
    severity: 'high',
    description: 'Absolutist language patterns',
  },
  {
    id: 'blame_shifting',
    name: 'Blame Shifting',
    category: 'emotional',
    pattern:
      /(this is all your fault|it's your fault|you caused this|you're to blame|because of you)/i,
    severity: 'high',
    description: 'Blame-shifting patterns',
  },
  {
    id: 'criticism',
    name: 'Criticism',
    category: 'emotional',
    pattern: /(you (always|never|should|shouldn't|can't|won't)|why (didn't|can't|won't) you)/i,
    severity: 'medium',
    description: 'Critical language patterns',
  },
  {
    id: 'guilt_trip',
    name: 'Guilt Trip',
    category: 'emotional',
    pattern: /(after all (i|we) (did|do) for you|i (thought|hoped) (you|we)|disappointed in you)/i,
    severity: 'high',
    description: 'Guilt-inducing language',
  },
  // Financial coercion
  {
    id: 'financial_demand',
    name: 'Financial Demand',
    category: 'financial',
    pattern:
      /(you owe me|you owe us|owe \$\d+|wages garnished|garnish your wages|child support|alimony|payment due)/i,
    severity: 'high',
    description: 'Financial demands and threats',
  },
  {
    id: 'financial_threat',
    name: 'Financial Threat',
    category: 'financial',
    pattern:
      /(i'll (have|get) your (wages|paycheck) (garnished|seized)|collection agency|debt collector)/i,
    severity: 'critical',
    description: 'Financial threats',
  },
  // Gaslighting
  {
    id: 'gaslighting_denial',
    name: 'Gaslighting - Denial',
    category: 'gaslighting',
    pattern:
      /(that (never|didn't) happen|that never happened|that's not what happened|you're (remembering|imagining) (it|that) wrong)/i,
    severity: 'critical',
    description: 'Gaslighting denial patterns',
  },
  {
    id: 'gaslighting_invalidation',
    name: 'Gaslighting - Invalidation',
    category: 'gaslighting',
    pattern:
      /(you're (overreacting|being (dramatic|crazy)|crazy|insane|paranoid)|you're imagining things|everyone thinks you're (the problem|crazy|wrong))/i,
    severity: 'critical',
    description: 'Gaslighting invalidation patterns',
  },
  {
    id: 'gaslighting',
    name: 'Gaslighting',
    category: 'gaslighting',
    pattern:
      /(that (never|didn't) happen|you're (remembering|imagining) (it|that) wrong|you're (overreacting|being (dramatic|crazy)))/i,
    severity: 'critical',
    description: 'Gaslighting patterns',
  },
  // Deadline pressure
  {
    id: 'urgent_demand',
    name: 'Urgent Demand',
    category: 'pressure',
    pattern:
      /(urgent|asap|immediately|right now|drop everything|you need to decide (right now|immediately)|this is your (last chance|final chance))/i,
    severity: 'high',
    description: 'Urgent language that may trigger stress',
  },
  {
    id: 'deadline_pressure',
    name: 'Deadline Pressure',
    category: 'pressure',
    pattern:
      /(if you don't (respond|reply|answer) (by|before)|you have until|deadline is|must respond by|last chance|final warning)/i,
    severity: 'high',
    description: 'Deadline pressure patterns',
  },
  // General threats
  {
    id: 'threat',
    name: 'Threat',
    category: 'general',
    pattern: /(if you (don't|won't)|or else|consequences|you'll (regret|be sorry))/i,
    severity: 'critical',
    description: 'Threatening language',
  },
];

/**
 * Scan message for threat patterns
 */
export function scanForThreats(
  content: string,
  patterns: ThreatPattern[] = DEFAULT_THREAT_PATTERNS
): ThreatMatch[] {
  const matches: ThreatMatch[] = [];

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.pattern);
    const match = content.match(regex);

    if (match) {
      matches.push({
        pattern,
        match: match[0],
        position: match.index || 0,
      });
    }
  }

  return matches;
}

/**
 * Check if message contains high-severity threats
 */
export function hasHighSeverityThreats(content: string): boolean {
  const matches = scanForThreats(content);
  return matches.some((m) => m.pattern.severity === 'high' || m.pattern.severity === 'critical');
}

/**
 * Get threat categories detected in a message
 */
export function getThreatCategories(content: string): ThreatCategory[] {
  const matches = scanForThreats(content);
  const categories = new Set<ThreatCategory>();

  for (const match of matches) {
    const pattern = match.pattern as ExtendedThreatPattern;
    if (pattern.category) {
      categories.add(pattern.category);
    }
  }

  return Array.from(categories);
}

/**
 * Check if message has threats of a specific category
 */
export function hasThreatCategory(content: string, category: ThreatCategory): boolean {
  const matches = scanForThreats(content);
  return matches.some((m) => {
    const pattern = m.pattern as ExtendedThreatPattern;
    return pattern.category === category;
  });
}
