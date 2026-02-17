/**
 * Cognitive Prosthetics Manager Tests
 * Tests for executive function support, task breakdown, and spoon economy
 */

import { CognitiveProstheticsManager } from '../CognitiveProstheticsManager';
import { BufferClient } from '../../buffer/buffer-client';

// Mock BufferClient
jest.mock('../../buffer/buffer-client');

describe('Executive Function Support', () => {
  let manager: CognitiveProstheticsManager;

  beforeEach(() => {
    manager = new CognitiveProstheticsManager();
  });

  describe('Task Management', () => {
    test('generates task breakdown from complex goal', async () => {
      const executive = manager.getExecutiveFunctionSupport();
      
      const goal = 'Complete SSA application';
      const breakdown = await executive.breakDownTask(goal);
      
      expect(breakdown).toBeDefined();
      expect(breakdown.tasks).toBeDefined();
      expect(Array.isArray(breakdown.tasks)).toBe(true);
      expect(breakdown.tasks.length).toBeGreaterThan(0);
    });

    test('estimates spoon cost per task', async () => {
      const executive = manager.getExecutiveFunctionSupport();
      
      const task = {
        id: 'test-1',
        title: 'Test Task',
        description: 'A test task',
        priority: 'high',
        deadline: new Date().toISOString(),
        status: 'pending',
        subtasks: []
      };
      
      const cost = executive.estimateSpoonCost(task);
      
      expect(typeof cost).toBe('number');
      expect(cost).toBeGreaterThan(0);
    });

    test('prioritizes by deadline and spoon budget', async () => {
      const executive = manager.getExecutiveFunctionSupport();
      
      const tasks = [
        {
          id: 'task-1',
          title: 'Urgent Task',
          description: 'Due soon',
          priority: 'high',
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending' as const,
          subtasks: []
        },
        {
          id: 'task-2',
          title: 'Later Task',
          description: 'Due later',
          priority: 'medium',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending' as const,
          subtasks: []
        }
      ];
      
      const prioritized = executive.prioritizeTasks(tasks, 10); // 10 spoon budget
      
      expect(prioritized).toBeDefined();
      expect(Array.isArray(prioritized)).toBe(true);
      if (prioritized.length > 0) {
        expect(prioritized[0].id).toBe('task-1'); // Urgent should come first
      }
    });

    test('adjusts plan when spoon count changes', async () => {
      const executive = manager.getExecutiveFunctionSupport();
      
      const tasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Test',
          priority: 'high',
          deadline: new Date().toISOString(),
          status: 'pending' as const,
          subtasks: []
        }
      ];
      
      const plan1 = executive.prioritizeTasks(tasks, 5);
      const plan2 = executive.prioritizeTasks(tasks, 20);
      
      expect(plan1).toBeDefined();
      expect(plan2).toBeDefined();
      // Plan should adapt to available spoons
    });

    test('generates reminders at appropriate intervals', async () => {
      const executive = manager.getExecutiveFunctionSupport();
      
      const task = {
        id: 'test-1',
        title: 'Test Task',
        description: 'Test',
        priority: 'high',
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        status: 'pending' as const,
        subtasks: []
      };
      
      const reminders = executive.generateReminders(task);
      
      expect(reminders).toBeDefined();
      expect(Array.isArray(reminders)).toBe(true);
    });
  });

  describe('Attention Support', () => {
    test('manages focus sessions', () => {
      const attention = manager.getAttentionSupport();
      
      const session = attention.startFocusSession(25); // 25 minute Pomodoro
      
      expect(session).toBeDefined();
      expect(session.duration).toBe(25);
      expect(session.startTime).toBeDefined();
    });

    test('tracks attention state', () => {
      const attention = manager.getAttentionSupport();
      
      const state = attention.getState();
      
      expect(state).toBeDefined();
      expect(state).toHaveProperty('attention');
      expect(typeof state.attention).toBe('number');
    });
  });

  describe('Working Memory', () => {
    test('creates memory notes', () => {
      const memory = manager.getWorkingMemorySupport();
      
      const note = memory.createNote('Test note', 'Test content');
      
      expect(note).toBeDefined();
      expect(note.content).toBe('Test content');
    });

    test('creates reminders', () => {
      const memory = manager.getWorkingMemorySupport();
      
      const reminder = memory.createReminder('Test reminder', new Date());
      
      expect(reminder).toBeDefined();
      expect(reminder.message).toBe('Test reminder');
    });
  });

  describe('Status and Health', () => {
    test('reports comprehensive status', () => {
      const status = manager.getStatus();
      
      expect(status).toBeDefined();
      expect(status).toHaveProperty('cognitive');
      expect(status).toHaveProperty('attention');
      expect(status).toHaveProperty('executive');
      expect(status).toHaveProperty('memory');
    });

    test('tracks health score', () => {
      const status = manager.getStatus();
      
      expect(status.cognitive.healthScore).toBeDefined();
      expect(typeof status.cognitive.healthScore).toBe('number');
      expect(status.cognitive.healthScore).toBeGreaterThanOrEqual(0);
      expect(status.cognitive.healthScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Buffer Integration', () => {
    test('integrates with buffer client when provided', async () => {
      const mockBufferClient = {
        sendMessage: jest.fn(),
        getStatus: jest.fn().mockResolvedValue({ connected: true })
      } as any;

      const managerWithBuffer = new CognitiveProstheticsManager(mockBufferClient);
      
      const integration = managerWithBuffer.getBufferIntegration();
      expect(integration).toBeDefined();
    });

    test('works without buffer client', () => {
      const managerWithoutBuffer = new CognitiveProstheticsManager();
      
      const integration = managerWithoutBuffer.getBufferIntegration();
      expect(integration).toBeNull();
    });
  });
});
