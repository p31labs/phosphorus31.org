/**
 * Working Memory Support
 * Cognitive prosthetic for working memory support
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';

export interface MemoryNote {
  id: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
  accessedAt: number;
  accessCount: number;
  importance: 'low' | 'medium' | 'high';
}

export interface Reminder {
  id: string;
  message: string;
  dueTime: number;
  completed: boolean;
  recurring?: {
    interval: number; // milliseconds
    endDate?: number;
  };
}

export interface Context {
  id: string;
  name: string;
  notes: string[];
  relatedNotes: string[];
  createdAt: number;
  updatedAt: number;
}

export class WorkingMemorySupport {
  private logger: Logger;
  private notes: Map<string, MemoryNote> = new Map();
  private reminders: Map<string, Reminder> = new Map();
  private contexts: Map<string, Context> = new Map();
  private reminderCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.logger = new Logger('WorkingMemorySupport');
    this.startReminderChecker();
  }

  /**
   * Create memory note
   */
  public createNote(
    content: string,
    category: string = 'general',
    tags: string[] = [],
    importance: MemoryNote['importance'] = 'medium'
  ): MemoryNote {
    const note: MemoryNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      category,
      tags,
      createdAt: Date.now(),
      accessedAt: Date.now(),
      accessCount: 0,
      importance,
    };

    this.notes.set(note.id, note);
    this.logger.info(`Note created: ${content.substring(0, 50)}...`);
    return note;
  }

  /**
   * Get note
   */
  public getNote(noteId: string): MemoryNote | undefined {
    const note = this.notes.get(noteId);
    if (note) {
      note.accessedAt = Date.now();
      note.accessCount++;
    }
    return note;
  }

  /**
   * Search notes
   */
  public searchNotes(query: string): MemoryNote[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.notes.values()).filter(note =>
      note.content.toLowerCase().includes(lowerQuery) ||
      note.category.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get notes by category
   */
  public getNotesByCategory(category: string): MemoryNote[] {
    return Array.from(this.notes.values()).filter(note => note.category === category);
  }

  /**
   * Get notes by tag
   */
  public getNotesByTag(tag: string): MemoryNote[] {
    return Array.from(this.notes.values()).filter(note => note.tags.includes(tag));
  }

  /**
   * Create reminder
   */
  public createReminder(
    message: string,
    dueTime: number,
    recurring?: Reminder['recurring']
  ): Reminder {
    const reminder: Reminder = {
      id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      dueTime,
      completed: false,
      recurring,
    };

    this.reminders.set(reminder.id, reminder);
    this.logger.info(`Reminder created: ${message}`);
    return reminder;
  }

  /**
   * Get due reminders
   */
  public getDueReminders(): Reminder[] {
    const now = Date.now();
    return Array.from(this.reminders.values()).filter(
      reminder => !reminder.completed && reminder.dueTime <= now
    );
  }

  /**
   * Complete reminder
   */
  public completeReminder(reminderId: string): void {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) {
      throw new Error(`Reminder not found: ${reminderId}`);
    }

    reminder.completed = true;
    this.logger.info(`Reminder completed: ${reminder.message}`);

    // Handle recurring reminders
    if (reminder.recurring) {
      const nextDueTime = reminder.dueTime + reminder.recurring.interval;
      
      if (!reminder.recurring.endDate || nextDueTime <= reminder.recurring.endDate) {
        reminder.dueTime = nextDueTime;
        reminder.completed = false;
        this.logger.info(`Recurring reminder rescheduled: ${reminder.message}`);
      }
    }
  }

  /**
   * Create context
   */
  public createContext(name: string, notes: string[] = []): Context {
    const context: Context = {
      id: `context_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      notes,
      relatedNotes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.contexts.set(context.id, context);
    this.logger.info(`Context created: ${name}`);
    return context;
  }

  /**
   * Add note to context
   */
  public addNoteToContext(contextId: string, noteId: string): void {
    const context = this.contexts.get(contextId);
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    if (!context.notes.includes(noteId)) {
      context.notes.push(noteId);
      context.updatedAt = Date.now();
      this.logger.info(`Note added to context: ${context.name}`);
    }
  }

  /**
   * Get context
   */
  public getContext(contextId: string): Context | undefined {
    return this.contexts.get(contextId);
  }

  /**
   * Start reminder checker
   */
  private startReminderChecker(): void {
    this.reminderCheckInterval = setInterval(() => {
      const dueReminders = this.getDueReminders();
      if (dueReminders.length > 0) {
        this.logger.info(`${dueReminders.length} reminder(s) due`);
        // In a real implementation, this would trigger notifications
      }
    }, 60000); // Check every minute
  }

  /**
   * Stop reminder checker
   */
  private stopReminderChecker(): void {
    if (this.reminderCheckInterval) {
      clearInterval(this.reminderCheckInterval);
      this.reminderCheckInterval = null;
    }
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.stopReminderChecker();
    this.notes.clear();
    this.reminders.clear();
    this.contexts.clear();
    this.logger.info('Working Memory Support disposed');
  }
}
