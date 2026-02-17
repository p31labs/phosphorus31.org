/**
 * Deadline Tracker API Routes
 * REST API endpoints for deadline tracking
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Router, Request, Response } from 'express';
import { DeadlineTracker } from './DeadlineTracker';
import { Logger } from '../utils/logger';

export function createDeadlineRoutes(): Router {
  const router = Router();
  const logger = new Logger('DeadlineRoutes');
  const tracker = new DeadlineTracker();

  /**
   * GET /api/strategic/deadlines
   * Get all deadlines
   */
  router.get('/', (req: Request, res: Response) => {
    try {
      const { priority, status, upcoming, overdue } = req.query;
      let deadlines;

      if (upcoming === 'true') {
        const days = parseInt(req.query.days as string) || 30;
        deadlines = tracker.getUpcomingDeadlines(days);
      } else if (overdue === 'true') {
        deadlines = tracker.getOverdueDeadlines();
      } else if (priority) {
        deadlines = tracker.getDeadlinesByPriority(priority as any);
      } else if (status) {
        deadlines = tracker.getDeadlinesByStatus(status as any);
      } else {
        deadlines = tracker.getAllDeadlines();
      }

      res.json({
        success: true,
        count: deadlines.length,
        deadlines,
      });
    } catch (error: any) {
      logger.error('Error getting deadlines:', error);
      res.status(500).json({
        error: 'Failed to get deadlines',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/strategic/deadlines/critical
   * Get critical deadlines (next 14 days)
   */
  router.get('/critical', (req: Request, res: Response) => {
    try {
      const deadlines = tracker.getCriticalDeadlines();
      res.json({
        success: true,
        count: deadlines.length,
        deadlines,
      });
    } catch (error: any) {
      logger.error('Error getting critical deadlines:', error);
      res.status(500).json({
        error: 'Failed to get critical deadlines',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/strategic/deadlines/summary
   * Get deadline summary
   */
  router.get('/summary', (req: Request, res: Response) => {
    try {
      const summary = tracker.getSummary();
      res.json({
        success: true,
        summary,
      });
    } catch (error: any) {
      logger.error('Error getting deadline summary:', error);
      res.status(500).json({
        error: 'Failed to get deadline summary',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/strategic/deadlines/:id
   * Get deadline by ID
   */
  router.get('/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deadline = tracker.getDeadline(id);

      if (!deadline) {
        return res.status(404).json({
          error: 'Deadline not found',
          id,
        });
      }

      res.json({
        success: true,
        deadline,
      });
    } catch (error: any) {
      logger.error('Error getting deadline:', error);
      res.status(500).json({
        error: 'Failed to get deadline',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/strategic/deadlines
   * Create new deadline
   */
  router.post('/', (req: Request, res: Response) => {
    try {
      const { title, date, priority, category, description, actionItems, value, url, notes } = req.body;

      if (!title || !date) {
        return res.status(400).json({
          error: 'Missing required fields: title, date',
        });
      }

      const deadline = tracker.createDeadline({
        title,
        date: new Date(date).getTime(),
        priority: priority || 'medium',
        status: 'pending',
        category: category || 'other',
        description: description || '',
        actionItems: actionItems || [],
        value,
        url,
        notes,
      });

      res.status(201).json({
        success: true,
        deadline,
      });
    } catch (error: any) {
      logger.error('Error creating deadline:', error);
      res.status(500).json({
        error: 'Failed to create deadline',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * PUT /api/strategic/deadlines/:id
   * Update deadline
   */
  router.put('/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Remove fields that shouldn't be updated directly
      delete updates.id;
      delete updates.createdAt;

      const deadline = tracker.updateDeadline(id, updates);

      if (!deadline) {
        return res.status(404).json({
          error: 'Deadline not found',
          id,
        });
      }

      res.json({
        success: true,
        deadline,
      });
    } catch (error: any) {
      logger.error('Error updating deadline:', error);
      res.status(500).json({
        error: 'Failed to update deadline',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/strategic/deadlines/:id/complete
   * Mark deadline as completed
   */
  router.post('/:id/complete', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deadline = tracker.completeDeadline(id);

      if (!deadline) {
        return res.status(404).json({
          error: 'Deadline not found',
          id,
        });
      }

      res.json({
        success: true,
        deadline,
      });
    } catch (error: any) {
      logger.error('Error completing deadline:', error);
      res.status(500).json({
        error: 'Failed to complete deadline',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/strategic/deadlines/:id/start
   * Mark deadline as in-progress
   */
  router.post('/:id/start', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deadline = tracker.startDeadline(id);

      if (!deadline) {
        return res.status(404).json({
          error: 'Deadline not found',
          id,
        });
      }

      res.json({
        success: true,
        deadline,
      });
    } catch (error: any) {
      logger.error('Error starting deadline:', error);
      res.status(500).json({
        error: 'Failed to start deadline',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * DELETE /api/strategic/deadlines/:id
   * Delete deadline
   */
  router.delete('/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = tracker.deleteDeadline(id);

      if (!success) {
        return res.status(404).json({
          error: 'Deadline not found',
          id,
        });
      }

      res.json({
        success: true,
        message: 'Deadline deleted',
      });
    } catch (error: any) {
      logger.error('Error deleting deadline:', error);
      res.status(500).json({
        error: 'Failed to delete deadline',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  return router;
}
