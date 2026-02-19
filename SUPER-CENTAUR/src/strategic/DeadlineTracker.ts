/**
 * Deadline Tracker
 * System for tracking strategic deadlines and opportunities
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import { Logger } from '../utils/logger';
import { DataStore } from '../database/store';

export interface Deadline {
  id: string;
  title: string;
  date: number; // Unix timestamp
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'missed';
  category: 'grant' | 'conference' | 'certification' | 'event' | 'application' | 'other';
  description: string;
  actionItems: string[];
  value?: string; // Monetary or strategic value
  url?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export class DeadlineTracker {
  private logger: Logger;
  private store: DataStore;

  constructor() {
    this.logger = new Logger('DeadlineTracker');
    this.store = DataStore.getInstance();
    this.initializeDefaultDeadlines();
  }

  /**
   * Initialize default deadlines from strategic plan
   */
  private initializeDefaultDeadlines(): void {
    if (this.store.count('deadlines') > 0) return;

    const defaults: Deadline[] = [
      {
        id: 'autism-tech-accelerator',
        title: 'Autism Tech Accelerator Application',
        date: new Date('2026-02-27').getTime(),
        priority: 'critical',
        status: 'pending',
        category: 'application',
        description: 'Free, 10-week virtual accelerator (March 31 – June 4). No equity. Perfect fit for P31.',
        actionItems: [
          'Review application requirements',
          'Prepare company overview',
          'Highlight AuDHD lived experience',
          'Describe neurodivergent communication accommodation focus',
          'Submit application before deadline',
        ],
        value: 'Free 10-week accelerator, no equity, mentorship, investor exposure',
        url: 'https://multiple.co/autism-tech-accelerator',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'mario-day',
        title: 'Mario Day + 10th Birthday',
        date: new Date('2026-03-10').getTime(),
        priority: 'high',
        status: 'pending',
        category: 'event',
        description: 'Mario Day celebration and 10th birthday party. Galaxy theme with Super Mario Galaxy Movie connection.',
        actionItems: [
          'Watch for Nintendo announcements',
          'Book Super Nintendo World tickets (if feasible)',
          'Plan Galaxy-themed party',
          'Prepare activities and food',
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'beyond-compliance-conference',
        title: 'Beyond Compliance Virtual Conference',
        date: new Date('2026-03-10').getTime(),
        priority: 'high',
        status: 'pending',
        category: 'conference',
        description: 'Southeast ADA Center virtual conference. Free. On Mario Day itself.',
        actionItems: ['Register for conference', 'Attend sessions'],
        value: 'Free virtual conference, regional ADA center',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'family-court-hearing',
        title: 'Family Court Hearing',
        date: new Date('2026-03-12').getTime(),
        priority: 'critical',
        status: 'pending',
        category: 'other',
        description: 'Family court hearing. Requires full presence.',
        actionItems: ['Prepare documentation', 'Attend hearing'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'mario-movie-release',
        title: 'Super Mario Galaxy Movie Release',
        date: new Date('2026-04-01').getTime(),
        priority: 'medium',
        status: 'pending',
        category: 'event',
        description: 'Super Mario Galaxy Movie hits theaters. Consider "birthday part two" movie trip.',
        actionItems: ['Plan movie theater trip', 'Coordinate with birthday celebration'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    defaults.forEach(deadline => {
      this.store.insert('deadlines', deadline);
    });

    this.logger.info('Default deadlines initialized');
  }

  /**
   * Create new deadline
   */
  public createDeadline(deadline: Omit<Deadline, 'id' | 'createdAt' | 'updatedAt'>): Deadline {
    const newDeadline: Deadline = {
      ...deadline,
      id: `deadline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.store.insert('deadlines', newDeadline);
    this.logger.info(`Deadline created: ${newDeadline.title}`);
    return newDeadline;
  }

  /**
   * Get deadline by ID
   */
  public getDeadline(id: string): Deadline | null {
    return this.store.get<Deadline>('deadlines', id) || null;
  }

  /**
   * Get all deadlines
   */
  public getAllDeadlines(): Deadline[] {
    return this.store.list<Deadline>('deadlines');
  }

  /**
   * Get deadlines by priority
   */
  public getDeadlinesByPriority(priority: Deadline['priority']): Deadline[] {
    return this.getAllDeadlines().filter(d => d.priority === priority);
  }

  /**
   * Get deadlines by status
   */
  public getDeadlinesByStatus(status: Deadline['status']): Deadline[] {
    return this.getAllDeadlines().filter(d => d.status === status);
  }

  /**
   * Get upcoming deadlines
   */
  public getUpcomingDeadlines(days: number = 30): Deadline[] {
    const now = Date.now();
    const future = now + (days * 24 * 60 * 60 * 1000);
    
    return this.getAllDeadlines()
      .filter(d => d.date >= now && d.date <= future)
      .sort((a, b) => a.date - b.date);
  }

  /**
   * Get overdue deadlines
   */
  public getOverdueDeadlines(): Deadline[] {
    const now = Date.now();
    return this.getAllDeadlines()
      .filter(d => d.date < now && d.status === 'pending')
      .sort((a, b) => a.date - b.date);
  }

  /**
   * Update deadline
   */
  public updateDeadline(id: string, updates: Partial<Deadline>): Deadline | null {
    const deadline = this.getDeadline(id);
    if (!deadline) return null;

    const updated: Deadline = {
      ...deadline,
      ...updates,
      id, // Preserve ID
      updatedAt: Date.now(),
    };

    this.store.update('deadlines', id, updated);
    this.logger.info(`Deadline updated: ${updated.title}`);
    return updated;
  }

  /**
   * Mark deadline as completed
   */
  public completeDeadline(id: string): Deadline | null {
    return this.updateDeadline(id, { status: 'completed' });
  }

  /**
   * Mark deadline as in-progress
   */
  public startDeadline(id: string): Deadline | null {
    return this.updateDeadline(id, { status: 'in-progress' });
  }

  /**
   * Get critical deadlines (next 14 days)
   */
  public getCriticalDeadlines(): Deadline[] {
    return this.getUpcomingDeadlines(14)
      .filter(d => d.priority === 'critical' && d.status === 'pending')
      .sort((a, b) => a.date - b.date);
  }

  /**
   * Get deadline summary
   */
  public getSummary(): {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    critical: number;
    upcoming: number;
  } {
    const all = this.getAllDeadlines();
    const now = Date.now();
    const twoWeeks = now + (14 * 24 * 60 * 60 * 1000);

    return {
      total: all.length,
      pending: all.filter(d => d.status === 'pending').length,
      inProgress: all.filter(d => d.status === 'in-progress').length,
      completed: all.filter(d => d.status === 'completed').length,
      overdue: all.filter(d => d.date < now && d.status === 'pending').length,
      critical: all.filter(d => d.priority === 'critical' && d.status === 'pending' && d.date <= twoWeeks).length,
      upcoming: all.filter(d => d.date >= now && d.date <= twoWeeks && d.status === 'pending').length,
    };
  }

  /**
   * Delete deadline
   */
  public deleteDeadline(id: string): boolean {
    const deadline = this.getDeadline(id);
    if (!deadline) return false;

    this.store.delete('deadlines', id);
    this.logger.info(`Deadline deleted: ${deadline.title}`);
    return true;
  }
}
