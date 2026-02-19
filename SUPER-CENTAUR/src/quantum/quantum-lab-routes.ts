/**
 * Quantum Lab API Routes
 * REST API endpoints for quantum experiments and simulations
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import { Router, Request, Response } from 'express';
import { QuantumLab, QuantumExperiment } from './quantum-lab';
import { Logger } from '../utils/logger';

export function createQuantumLabRoutes(quantumLab: QuantumLab): Router {
  const router = Router();
  const logger = new Logger('QuantumLabRoutes');

  /**
   * POST /api/quantum-lab/experiment
   * Run a quantum experiment
   */
  router.post('/experiment', (req: Request, res: Response) => {
    try {
      const { type, parameters } = req.body;

      if (!type) {
        return res.status(400).json({
          error: 'Missing required field: type',
          validTypes: ['coherence', 'entanglement', 'decoherence', 'superposition'],
        });
      }

      if (!['coherence', 'entanglement', 'decoherence', 'superposition'].includes(type)) {
        return res.status(400).json({
          error: `Invalid experiment type: ${type}`,
          validTypes: ['coherence', 'entanglement', 'decoherence', 'superposition'],
        });
      }

      const experiment = quantumLab.runExperiment(type, parameters || {});
      
      logger.info(`Experiment created: ${experiment.id}`, { type, parameters });
      
      res.status(201).json({
        success: true,
        experiment,
      });
    } catch (error: any) {
      logger.error('Error running experiment:', error);
      res.status(500).json({
        error: 'Failed to run experiment',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/quantum-lab/experiment/:id
   * Get experiment by ID
   */
  router.get('/experiment/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const experiment = quantumLab.getExperiment(id);

      if (!experiment) {
        return res.status(404).json({
          error: 'Experiment not found',
          id,
        });
      }

      res.json({
        success: true,
        experiment,
      });
    } catch (error: any) {
      logger.error('Error getting experiment:', error);
      res.status(500).json({
        error: 'Failed to get experiment',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/quantum-lab/experiments
   * List all experiments
   */
  router.get('/experiments', (req: Request, res: Response) => {
    try {
      const experiments = quantumLab.listExperiments();
      
      res.json({
        success: true,
        count: experiments.length,
        experiments,
      });
    } catch (error: any) {
      logger.error('Error listing experiments:', error);
      res.status(500).json({
        error: 'Failed to list experiments',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * DELETE /api/quantum-lab/experiments
   * Clear all experiments
   */
  router.delete('/experiments', (req: Request, res: Response) => {
    try {
      quantumLab.clearExperiments();
      
      res.json({
        success: true,
        message: 'All experiments cleared',
      });
    } catch (error: any) {
      logger.error('Error clearing experiments:', error);
      res.status(500).json({
        error: 'Failed to clear experiments',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/quantum-lab/decay-rate
   * Set coherence decay rate
   */
  router.post('/decay-rate', (req: Request, res: Response) => {
    try {
      const { rate } = req.body;

      if (rate === undefined || rate === null) {
        return res.status(400).json({
          error: 'Missing required field: rate',
        });
      }

      if (typeof rate !== 'number' || rate < 0 || rate > 1) {
        return res.status(400).json({
          error: 'Invalid rate: must be a number between 0 and 1',
        });
      }

      quantumLab.setCoherenceDecayRate(rate);
      
      res.json({
        success: true,
        rate: quantumLab.getCoherenceDecayRate(),
      });
    } catch (error: any) {
      logger.error('Error setting decay rate:', error);
      res.status(500).json({
        error: 'Failed to set decay rate',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/quantum-lab/decay-rate
   * Get current coherence decay rate
   */
  router.get('/decay-rate', (req: Request, res: Response) => {
    try {
      const rate = quantumLab.getCoherenceDecayRate();
      
      res.json({
        success: true,
        rate,
      });
    } catch (error: any) {
      logger.error('Error getting decay rate:', error);
      res.status(500).json({
        error: 'Failed to get decay rate',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/quantum-lab/health
   * Health check endpoint
   */
  router.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Quantum Lab',
      timestamp: new Date().toISOString(),
      experiments: quantumLab.listExperiments().length,
    });
  });

  return router;
}
