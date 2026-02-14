/**
 * Quantum Lab API Routes
 * 
 * REST API endpoints for Quantum Lab functionality
 */

import { Router, Request, Response } from 'express';
import { QuantumLab } from './quantum-lab';

export function createQuantumLabRoutes(quantumLab: QuantumLab): Router {
  const router = Router();

  /**
   * GET /api/quantum-lab/status
   * Get Quantum Lab status
   */
  router.get('/status', (req: Request, res: Response) => {
    try {
      const status = quantumLab.getStatus();
      res.json({ success: true, status });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/quantum-lab/start
   * Start Quantum Lab
   */
  router.post('/start', async (req: Request, res: Response) => {
    try {
      const started = await quantumLab.start();
      if (started) {
        res.json({ success: true, message: 'Quantum Lab started' });
      } else {
        res.status(500).json({ error: 'Failed to start Quantum Lab' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/quantum-lab/stop
   * Stop Quantum Lab
   */
  router.post('/stop', (req: Request, res: Response) => {
    try {
      quantumLab.stop();
      res.json({ success: true, message: 'Quantum Lab stopped' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/quantum-lab/state
   * Get current quantum state
   */
  router.get('/state', (req: Request, res: Response) => {
    try {
      const state = quantumLab.getCurrentState();
      if (state) {
        res.json({ success: true, state });
      } else {
        res.status(404).json({ error: 'No quantum state available' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/quantum-lab/history
   * Get quantum state history
   * Query params: timeWindow (ms)
   */
  router.get('/history', (req: Request, res: Response) => {
    try {
      const timeWindow = req.query.timeWindow 
        ? parseInt(req.query.timeWindow as string)
        : undefined;
      
      const history = quantumLab.getStateHistory(timeWindow);
      res.json({ success: true, history, count: history.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/quantum-lab/coherence
   * Get current coherence value
   */
  router.get('/coherence', (req: Request, res: Response) => {
    try {
      const status = quantumLab.getStatus();
      const coherence = status.currentCoherence;
      
      if (coherence !== null) {
        res.json({ 
          success: true, 
          coherence,
          averageCoherence: status.averageCoherence,
        });
      } else {
        res.status(404).json({ error: 'Coherence data not available' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/quantum-lab/imu/status
   * Get IMU status
   */
  router.get('/imu/status', (req: Request, res: Response) => {
    try {
      const imu = quantumLab.getIMU();
      const status = imu.getStatus();
      const config = imu.getConfig();
      
      res.json({ success: true, status, config });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
