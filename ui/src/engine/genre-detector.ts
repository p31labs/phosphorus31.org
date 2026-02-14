/**
 * Genre Detector
 * Pure function to classify messages as "Physics" (factual) or "Poetics" (emotional)
 * 
 * Physics = Factual, direct, task-oriented
 * Poetics = Emotional, relational, context-dependent
 */

export type Genre = 'physics' | 'poetics' | 'mixed';

export interface GenreAnalysis {
  genre: Genre;
  confidence: number; // 0-1
  physicsScore: number;
  poeticsScore: number;
  indicators: string[];
}

/**
 * Detect the genre (Physics vs Poetics) of a message
 */
export function detectGenre(content: string): GenreAnalysis {
  const lowerContent = content.toLowerCase();
  
  // Physics indicators (factual, task-oriented)
  const physicsKeywords = [
    'deadline', 'task', 'meeting', 'schedule', 'data', 'report', 'status',
    'complete', 'submit', 'review', 'update', 'confirm', 'verify', 'check',
    'need', 'required', 'must', 'should', 'action', 'item', 'list'
  ];

  // Poetics indicators (emotional, relational)
  const poeticsKeywords = [
    'feel', 'feeling', 'emotion', 'hurt', 'happy', 'sad', 'angry', 'frustrated',
    'love', 'care', 'appreciate', 'thank', 'grateful', 'sorry', 'apologize',
    'relationship', 'connection', 'understand', 'support', 'help', 'concern'
  ];

  // Count matches
  const physicsCount = physicsKeywords.filter(kw => lowerContent.includes(kw)).length;
  const poeticsCount = poeticsKeywords.filter(kw => lowerContent.includes(kw)).length;

  // Calculate scores (normalized)
  const totalWords = content.split(/\s+/).length;
  const physicsScore = Math.min(1, physicsCount / Math.max(totalWords / 20, 1));
  const poeticsScore = Math.min(1, poeticsCount / Math.max(totalWords / 20, 1));

  // Determine genre
  let genre: Genre;
  const indicators: string[] = [];

  if (physicsScore > poeticsScore * 1.5) {
    genre = 'physics';
    indicators.push('Factual/task-oriented language');
  } else if (poeticsScore > physicsScore * 1.5) {
    genre = 'poetics';
    indicators.push('Emotional/relational language');
  } else {
    genre = 'mixed';
    indicators.push('Mixed factual and emotional content');
  }

  // Calculate confidence
  const scoreDiff = Math.abs(physicsScore - poeticsScore);
  const confidence = Math.min(1, scoreDiff * 2); // Higher difference = higher confidence

  return {
    genre,
    confidence,
    physicsScore,
    poeticsScore,
    indicators
  };
}
