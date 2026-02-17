/**
 * Cognitive Prosthetics API Routes
 * REST API endpoints for cognitive prosthetic features
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Router, Request, Response } from 'express';
import { CognitiveProstheticsManager } from './CognitiveProstheticsManager';
import { Logger } from '../utils/logger';
import { BufferClient } from '../buffer/buffer-client';

export function createCognitiveProstheticsRoutes(bufferClient?: BufferClient): Router {
  const router = Router();
  const logger = new Logger('CognitiveProstheticsRoutes');

  // Initialize prosthetics manager (in production, these would be per-user instances)
  const manager = new CognitiveProstheticsManager(bufferClient);
  
  // Initialize if buffer client provided
  if (bufferClient) {
    manager.init(bufferClient).catch(err => {
      logger.error('Failed to initialize Cognitive Prosthetics Manager:', err);
    });
  }

  const prosthetic = manager.getProsthetic();
  const attention = manager.getAttentionSupport();
  const executive = manager.getExecutiveFunctionSupport();
  const memory = manager.getWorkingMemorySupport();

  /**
   * GET /api/cognitive-prosthetics/state
   * Get current cognitive state
   */
  router.get('/state', (req: Request, res: Response) => {
    try {
      const state = prosthetic.getCurrentState();
      const healthScore = prosthetic.getCognitiveHealthScore();
      const interventions = prosthetic.getRecentInterventions(5);
      const recommendations = prosthetic.getRecommendations();

      res.json({
        success: true,
        state,
        healthScore,
        interventions,
        recommendations,
      });
    } catch (error: any) {
      logger.error('Error getting cognitive state:', error);
      res.status(500).json({
        error: 'Failed to get cognitive state',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/cognitive-prosthetics/state
   * Update cognitive state
   */
  router.post('/state', (req: Request, res: Response) => {
    try {
      const { attention, executiveFunction, workingMemory, emotionalRegulation, sensoryProcessing } = req.body;

      prosthetic.updateState({
        attention,
        executiveFunction,
        workingMemory,
        emotionalRegulation,
        sensoryProcessing,
      });

      const state = prosthetic.getCurrentState();
      const interventions = prosthetic.getRecentInterventions(5);

      res.json({
        success: true,
        state,
        interventions,
      });
    } catch (error: any) {
      logger.error('Error updating cognitive state:', error);
      res.status(500).json({
        error: 'Failed to update cognitive state',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/cognitive-prosthetics/attention/session
   * Get current focus session
   */
  router.get('/attention/session', (req: Request, res: Response) => {
    try {
      const session = attention.getCurrentSession();
      const history = attention.getSessionHistory(10);
      const averageScore = attention.getAverageFocusScore();
      const isOnBreak = attention.isOnBreakTime();

      res.json({
        success: true,
        session,
        history,
        averageScore,
        isOnBreak,
      });
    } catch (error: any) {
      logger.error('Error getting attention session:', error);
      res.status(500).json({
        error: 'Failed to get attention session',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/cognitive-prosthetics/attention/session/start
   * Start focus session
   */
  router.post('/attention/session/start', (req: Request, res: Response) => {
    try {
      const session = attention.startSession();
      res.json({
        success: true,
        session,
      });
    } catch (error: any) {
      logger.error('Error starting focus session:', error);
      res.status(500).json({
        error: 'Failed to start focus session',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/cognitive-prosthetics/attention/pomodoro/start
   * Start Pomodoro timer
   */
  router.post('/attention/pomodoro/start', (req: Request, res: Response) => {
    try {
      attention.startPomodoro(() => {
        logger.info('Pomodoro complete');
      });
      res.json({
        success: true,
        message: 'Pomodoro timer started',
      });
    } catch (error: any) {
      logger.error('Error starting Pomodoro:', error);
      res.status(500).json({
        error: 'Failed to start Pomodoro',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/cognitive-prosthetics/executive/tasks
   * Get all tasks
   */
  router.get('/executive/tasks', (req: Request, res: Response) => {
    try {
      const { status, priority } = req.query;
      let tasks = executive.getAllTasks();

      if (status) {
        tasks = tasks.filter(t => t.status === status);
      }
      if (priority) {
        tasks = tasks.filter(t => t.priority === priority);
      }

      res.json({
        success: true,
        tasks,
      });
    } catch (error: any) {
      logger.error('Error getting tasks:', error);
      res.status(500).json({
        error: 'Failed to get tasks',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/cognitive-prosthetics/executive/tasks
   * Create new task
   */
  router.post('/executive/tasks', (req: Request, res: Response) => {
    try {
      const { title, description, priority } = req.body;

      if (!title) {
        return res.status(400).json({
          error: 'Missing required field: title',
        });
      }

      const task = executive.createTask(title, description || '', priority || 'medium');
      res.status(201).json({
        success: true,
        task,
      });
    } catch (error: any) {
      logger.error('Error creating task:', error);
      res.status(500).json({
        error: 'Failed to create task',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/cognitive-prosthetics/memory/notes
   * Get notes
   */
  router.get('/memory/notes', (req: Request, res: Response) => {
    try {
      const { query, category, tag } = req.query;
      let notes;

      if (query) {
        notes = memory.searchNotes(query as string);
      } else if (category) {
        notes = memory.getNotesByCategory(category as string);
      } else if (tag) {
        notes = memory.getNotesByTag(tag as string);
      } else {
        // Return all notes (in production, would be paginated)
        notes = Array.from(memory['notes'].values());
      }

      res.json({
        success: true,
        notes,
      });
    } catch (error: any) {
      logger.error('Error getting notes:', error);
      res.status(500).json({
        error: 'Failed to get notes',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/cognitive-prosthetics/memory/notes
   * Create note
   */
  router.post('/memory/notes', (req: Request, res: Response) => {
    try {
      const { content, category, tags, importance } = req.body;

      if (!content) {
        return res.status(400).json({
          error: 'Missing required field: content',
        });
      }

      const note = memory.createNote(
        content,
        category || 'general',
        tags || [],
        importance || 'medium'
      );

      res.status(201).json({
        success: true,
        note,
      });
    } catch (error: any) {
      logger.error('Error creating note:', error);
      res.status(500).json({
        error: 'Failed to create note',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/cognitive-prosthetics/memory/reminders
   * Get due reminders
   */
  router.get('/memory/reminders', (req: Request, res: Response) => {
    try {
      const dueReminders = memory.getDueReminders();
      res.json({
        success: true,
        reminders: dueReminders,
      });
    } catch (error: any) {
      logger.error('Error getting reminders:', error);
      res.status(500).json({
        error: 'Failed to get reminders',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/cognitive-prosthetics/status
   * Get comprehensive cognitive support status
   */
  router.get('/status', (req: Request, res: Response) => {
    try {
      const status = manager.getStatus();
      res.json({
        success: true,
        status,
      });
    } catch (error: any) {
      logger.error('Error getting cognitive prosthetics status:', error);
      res.status(500).json({
        error: 'Failed to get status',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/cognitive-prosthetics/health
   * Health check
   */
  router.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Cognitive Prosthetics',
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
