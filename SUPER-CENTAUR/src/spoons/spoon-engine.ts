/**
 * Spoon Economy Engine - Energy budget management based on Spoon Theory
 * Tracks daily energy budgets, activity costs, and recovery suggestions.
 */

import { Logger } from '../utils/logger';
import { DataStore } from '../database/store';

interface SpoonEntry {
  id: string;
  memberId: string;
  activity: string;
  cost: number;
  timestamp: string;
  date: string;
  category: string;
}

interface SpoonBudget {
  id: string;
  memberId: string;
  date: string;
  totalBudget: number;
  remaining: number;
}

interface ActivityCost {
  activity: string;
  cost: number;
  category: string;
}

interface RecoverySuggestion {
  activity: string;
  recovery: number;
  category: string;
  description: string;
}

export class SpoonEngine {
  private logger: Logger;
  private store: DataStore;

  private readonly DEFAULT_BUDGET = 12;

  private readonly ACTIVITY_COSTS: ActivityCost[] = [
    { activity: 'Morning routine', cost: 1, category: 'self-care' },
    { activity: 'Cooking a meal', cost: 2, category: 'self-care' },
    { activity: 'Grocery shopping', cost: 3, category: 'errands' },
    { activity: 'Doctor appointment', cost: 3, category: 'medical' },
    { activity: 'Work meeting', cost: 2, category: 'work' },
    { activity: 'Deep focus work', cost: 3, category: 'work' },
    { activity: 'School run', cost: 2, category: 'family' },
    { activity: 'Homework help', cost: 2, category: 'family' },
    { activity: 'Bedtime routine (kids)', cost: 2, category: 'family' },
    { activity: 'Cleaning house', cost: 3, category: 'chores' },
    { activity: 'Laundry', cost: 2, category: 'chores' },
    { activity: 'Phone calls', cost: 1, category: 'social' },
    { activity: 'Social event', cost: 4, category: 'social' },
    { activity: 'Exercise', cost: 2, category: 'health' },
    { activity: 'Therapy session', cost: 3, category: 'health' },
    { activity: 'Court appearance', cost: 5, category: 'legal' },
    { activity: 'Legal paperwork', cost: 3, category: 'legal' },
    { activity: 'Conflict/argument', cost: 4, category: 'stress' },
    { activity: 'Sensory overload', cost: 3, category: 'stress' },
    { activity: 'Poor sleep night', cost: 2, category: 'health' },
  ];

  private readonly RECOVERY_SUGGESTIONS: RecoverySuggestion[] = [
    { activity: 'Power nap (20 min)', recovery: 2, category: 'rest', description: 'A short nap can restore significant energy without grogginess.' },
    { activity: 'Gentle stretching', recovery: 1, category: 'movement', description: 'Light movement releases tension and improves circulation.' },
    { activity: 'Breathing exercises', recovery: 1, category: 'mindfulness', description: 'Box breathing or 4-7-8 technique to calm the nervous system.' },
    { activity: 'Nature walk', recovery: 2, category: 'nature', description: 'Even 10 minutes outside can lower cortisol and restore focus.' },
    { activity: 'Warm bath/shower', recovery: 1, category: 'comfort', description: 'Warm water soothes muscles and activates the parasympathetic system.' },
    { activity: 'Listen to music', recovery: 1, category: 'comfort', description: 'Familiar, calming music reduces stress hormones.' },
    { activity: 'Creative expression', recovery: 2, category: 'joy', description: 'Drawing, writing, or crafting engages a different brain mode.' },
    { activity: 'Cuddle time', recovery: 2, category: 'connection', description: 'Physical closeness with loved ones releases oxytocin.' },
    { activity: 'Meditation (10 min)', recovery: 1, category: 'mindfulness', description: 'Guided or silent meditation resets the stress response.' },
    { activity: 'Hydrate + snack', recovery: 1, category: 'nourishment', description: 'Dehydration and low blood sugar drain spoons fast.' },
  ];

  constructor() {
    this.logger = new Logger('SpoonEngine');
    this.store = DataStore.getInstance();
    this.logger.info('Spoon Economy Engine initialized');
  }

  private todayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private ensureBudget(memberId: string, date: string): SpoonBudget {
    const budgetId = `budget_${memberId}_${date}`;
    let budget = this.store.get<any>('spoon_budgets', budgetId);
    if (!budget) {
      budget = this.store.insert('spoon_budgets', {
        id: budgetId,
        memberId,
        date,
        totalBudget: this.DEFAULT_BUDGET,
        remaining: this.DEFAULT_BUDGET,
      });
    }
    return budget;
  }

  getToday(memberId: string): { budget: SpoonBudget; entries: SpoonEntry[] } {
    const date = this.todayString();
    const budget = this.ensureBudget(memberId, date);
    const entries = this.store.list<any>('spoon_entries', { memberId, date });
    return { budget, entries };
  }

  logActivity(memberId: string, activity: string, cost: number, category: string = 'general'): SpoonEntry {
    const date = this.todayString();
    const budget = this.ensureBudget(memberId, date);

    const entry = this.store.insert<any>('spoon_entries', {
      memberId,
      activity,
      cost,
      category,
      date,
      timestamp: new Date().toISOString(),
    });

    this.store.update('spoon_budgets', budget.id, {
      remaining: Math.max(0, budget.remaining - cost),
    });

    this.logger.info(`Spoon logged: ${activity} (-${cost}) for ${memberId}`);
    return entry;
  }

  getHistory(memberId: string, days: number = 7): { date: string; budget: SpoonBudget; entries: SpoonEntry[] }[] {
    const history: { date: string; budget: SpoonBudget; entries: SpoonEntry[] }[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const date = d.toISOString().split('T')[0];
      const budget = this.ensureBudget(memberId, date);
      const entries = this.store.list<any>('spoon_entries', { memberId, date });
      history.push({ date, budget, entries });
    }

    return history;
  }

  getActivityCosts(): ActivityCost[] {
    return [...this.ACTIVITY_COSTS];
  }

  getRecoverySuggestions(memberId: string): RecoverySuggestion[] {
    const { budget } = this.getToday(memberId);
    const remaining = budget.remaining;

    if (remaining <= 2) {
      return this.RECOVERY_SUGGESTIONS.filter(s => s.category === 'rest' || s.category === 'comfort' || s.category === 'nourishment');
    } else if (remaining <= 5) {
      return this.RECOVERY_SUGGESTIONS.filter(s => s.recovery >= 1);
    }
    return [...this.RECOVERY_SUGGESTIONS];
  }
}

export default SpoonEngine;
