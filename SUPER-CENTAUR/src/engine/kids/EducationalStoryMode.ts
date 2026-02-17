/**
 * Educational Story Mode
 * Teaching geometric principles through narrative
 * 
 * "The Tetrahedron Quest" - A story for Bash and Willow
 */

export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  tier: AgeTier;
  narrative: string;                 // Story text
  learningObjective: string;
  challenge: string;                 // Challenge ID
  unlockable: string | null;        // What unlocks after completion
  nextChapter: string | null;      // Next chapter ID
}

export interface StoryProgress {
  kidId: string;
  currentChapter: string;
  completedChapters: string[];
  unlockedChapters: string[];
  storyPoints: number;               // Points earned in story mode
}

export type AgeTier = 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';

export class EducationalStoryMode {
  private chapters: Map<string, StoryChapter> = new Map();
  private progress: Map<string, StoryProgress> = new Map();

  /**
   * Initialize story mode with chapters
   */
  init(): void {
    this.loadStoryChapters();
    console.log('📚 Educational Story Mode initialized');
  }

  /**
   * Load story chapters (The Tetrahedron Quest)
   */
  private loadStoryChapters(): void {
    // Chapter 1: The Beginning (Sprout tier - Willow)
    this.chapters.set('ch01-beginning', {
      id: 'ch01-beginning',
      title: 'The First Shape',
      description: 'Discover the magic of the tetrahedron',
      tier: 'sprout',
      narrative: `Once upon a time, in a world made of shapes, there lived a special shape called the Tetrahedron. 
      
The Tetrahedron had four points, six edges, and four faces. It was the strongest shape in all the land!

"Every structure needs a strong foundation," the Tetrahedron said. "I am the minimum stable system. With me, you can build anything!"

Your quest begins: Build your first tetrahedron and discover its power!`,
      learningObjective: 'Learn what a tetrahedron is and why it\'s special',
      challenge: 'sprout-001',
      unlockable: 'ch02-discovery',
      nextChapter: 'ch02-discovery',
    });

    // Chapter 2: The Discovery (Sprout tier - Willow)
    this.chapters.set('ch02-discovery', {
      id: 'ch02-discovery',
      title: 'The Rainbow Bridge',
      description: 'Build a bridge using your new knowledge',
      tier: 'sprout',
      narrative: `The Tetrahedron smiled. "You've learned my secret! Now, let's build something beautiful together."

"Can we make a rainbow bridge?" you ask.

"Yes!" the Tetrahedron replied. "But remember - beauty needs strength. Your bridge must stand on its own!"

Build a colorful bridge that connects two points. Use all the colors of the rainbow!`,
      learningObjective: 'Learn about stability and balance',
      challenge: 'sprout-002',
      unlockable: 'ch03-family',
      nextChapter: 'ch03-family',
    });

    // Chapter 3: The Family (Sapling tier - Bash)
    this.chapters.set('ch03-family', {
      id: 'ch03-family',
      title: 'The Family Tetrahedron',
      description: 'Discover how families are like tetrahedrons',
      tier: 'sapling',
      narrative: `"Did you know," the Tetrahedron said, "that families are like me?"

You look confused. "How?"

"Families have four important parts," the Tetrahedron explained. "Like my four points. Each point is connected to every other point. That's what makes us strong!"

"Four parts?" you ask.

"Yes! You, your sibling, and your parents. Four vertices. Six connections. Four faces of love. The minimum stable system!"

Your challenge: Build a structure with exactly four connection points, just like a family!`,
      learningObjective: 'Understand tetrahedron topology and family structure',
      challenge: 'sapling-002',
      unlockable: 'ch04-maxwell',
      nextChapter: 'ch04-maxwell',
    });

    // Chapter 4: Maxwell's Secret (Sapling tier - Bash)
    this.chapters.set('ch04-maxwell', {
      id: 'ch04-maxwell',
      title: 'Maxwell\'s Secret Rule',
      description: 'Learn the rule that makes structures strong',
      tier: 'sapling',
      narrative: `"There's a secret rule," the Tetrahedron whispered. "A rule that engineers use to make buildings strong."

"What is it?" you ask eagerly.

"Maxwell's Rule!" the Tetrahedron said. "It says: For a structure to be strong, you need at least three times the number of points, minus six, connections!"

You think about this. "So if I have 4 points..."

"Exactly! You need at least 3 times 4, minus 6. That's 6 connections! And I have exactly 6 edges!"

Build a structure that follows Maxwell's Rule. Make it strong!`,
      learningObjective: 'Learn Maxwell\'s Rule (E ≥ 3V - 6) for structural rigidity',
      challenge: 'sapling-001',
      unlockable: 'ch05-together',
      nextChapter: 'ch05-together',
    });

    // Chapter 5: Building Together (Family co-op)
    this.chapters.set('ch05-together', {
      id: 'ch05-together',
      title: 'Building Together',
      description: 'Work with your family to build something amazing',
      tier: 'sapling',
      narrative: `"The strongest structures are built together," the Tetrahedron said. "Just like families!"

You call your family. "Let's build something together!"

Everyone comes. You, your sibling, and your parents. Four people. Four vertices. One family.

"Each of you will place pieces," the Tetrahedron explained. "Work together. Communicate. Support each other. That's how you build not just structures, but relationships!"

Your family challenge: Build something amazing together!`,
      learningObjective: 'Learn collaboration, communication, and family bonding',
      challenge: 'family-001',
      unlockable: null,
      nextChapter: null, // End of story (for now)
    });
  }

  /**
   * Start story mode for a kid
   */
  startStory(kidId: string): StoryProgress {
    const existing = this.progress.get(kidId);
    if (existing) {
      return existing;
    }

    const progress: StoryProgress = {
      kidId,
      currentChapter: 'ch01-beginning',
      completedChapters: [],
      unlockedChapters: ['ch01-beginning'],
      storyPoints: 0,
    };

    this.progress.set(kidId, progress);
    this.saveProgress(progress);
    return progress;
  }

  /**
   * Get current chapter for a kid
   */
  getCurrentChapter(kidId: string): StoryChapter | null {
    const progress = this.progress.get(kidId);
    if (!progress) return null;

    return this.chapters.get(progress.currentChapter) || null;
  }

  /**
   * Complete a chapter
   */
  completeChapter(kidId: string, chapterId: string): boolean {
    const progress = this.progress.get(kidId);
    const chapter = this.chapters.get(chapterId);

    if (!progress || !chapter) return false;

    // Mark as completed
    if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId);
      progress.storyPoints += 10;
    }

    // Unlock next chapter
    if (chapter.nextChapter && !progress.unlockedChapters.includes(chapter.nextChapter)) {
      progress.unlockedChapters.push(chapter.nextChapter);
      progress.currentChapter = chapter.nextChapter;
    }

    this.saveProgress(progress);
    console.log(`📖 Chapter completed: ${chapter.title}`);
    return true;
  }

  /**
   * Get story progress
   */
  getProgress(kidId: string): StoryProgress | null {
    return this.progress.get(kidId) || null;
  }

  /**
   * Get all chapters (for display)
   */
  getAllChapters(): StoryChapter[] {
    return Array.from(this.chapters.values());
  }

  /**
   * Get unlocked chapters for a kid
   */
  getUnlockedChapters(kidId: string): StoryChapter[] {
    const progress = this.progress.get(kidId);
    if (!progress) return [];

    return progress.unlockedChapters
      .map(id => this.chapters.get(id))
      .filter((c): c is StoryChapter => c !== undefined);
  }

  // Save/load methods
  private saveProgress(progress: StoryProgress): void {
    localStorage.setItem(`p31_story_progress_${progress.kidId}`, JSON.stringify(progress));
  }
}
