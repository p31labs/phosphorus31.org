/**
 * Synergy Engine API Routes
 * REST API endpoints for infinite synergy compounding
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Router, Request, Response } from 'express';
import { SynergyEngine } from './SynergyEngine';
import { Logger } from '../utils/logger';

export function createSynergyRoutes(): Router {
  const router = Router();
  const logger = new Logger('SynergyRoutes');
  const engine = new SynergyEngine();

  // Initialize default P31 components
  engine.registerComponent('buffer', 'The Buffer', 1.0);
  engine.registerComponent('centaur', 'The Centaur', 1.0);
  engine.registerComponent('scope', 'The Scope', 1.0);
  engine.registerComponent('node_one', 'Node One', 1.0);
  engine.registerComponent('quantum', 'Quantum Lab', 1.5);
  engine.registerComponent('metabolism', 'Metabolism System', 1.2);
  engine.registerComponent('cognitive', 'Cognitive Prosthetics', 1.3);
  engine.registerComponent('wallet', 'Wallet Manager', 1.1);
  engine.registerComponent('game', 'Game Engine', 1.0);
  engine.registerComponent('mesh', 'The Mesh', 2.0); // Highest base synergy

  /**
   * GET /api/synergy
   * Get total synergy and state
   */
  router.get('/', (req: Request, res: Response) => {
    try {
      const state = engine.getState();
      res.json({
        success: true,
        totalSynergy: engine.getTotalSynergy(),
        compoundingRate: state.compoundingRate,
        nodeCount: state.nodes.size,
        connectionCount: state.connections.length,
        infinity: state.infinity,
      });
    } catch (error: any) {
      logger.error('Error getting synergy:', error);
      res.status(500).json({
        error: 'Failed to get synergy',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/synergy/nodes
   * Get all synergy nodes
   */
  router.get('/nodes', (req: Request, res: Response) => {
    try {
      const state = engine.getState();
      const nodes = Array.from(state.nodes.values()).map(node => ({
        id: node.id,
        component: node.component,
        baseSynergy: node.baseSynergy,
        compoundedSynergy: node.compoundedSynergy,
        multiplier: node.multiplier,
        connections: node.connections,
      }));

      res.json({
        success: true,
        count: nodes.length,
        nodes,
      });
    } catch (error: any) {
      logger.error('Error getting nodes:', error);
      res.status(500).json({
        error: 'Failed to get nodes',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/synergy/network
   * Get network visualization data
   */
  router.get('/network', (req: Request, res: Response) => {
    try {
      const network = engine.getNetworkData();
      res.json({
        success: true,
        network,
      });
    } catch (error: any) {
      logger.error('Error getting network:', error);
      res.status(500).json({
        error: 'Failed to get network',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/synergy/nodes/:id
   * Get specific node synergy
   */
  router.get('/nodes/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const synergy = engine.getNodeSynergy(id);
      const state = engine.getState();
      const node = state.nodes.get(id);

      if (!node) {
        return res.status(404).json({
          error: 'Node not found',
          id,
        });
      }

      res.json({
        success: true,
        node: {
          id: node.id,
          component: node.component,
          baseSynergy: node.baseSynergy,
          compoundedSynergy: node.compoundedSynergy,
          multiplier: node.multiplier,
          connections: node.connections,
        },
        synergy,
      });
    } catch (error: any) {
      logger.error('Error getting node synergy:', error);
      res.status(500).json({
        error: 'Failed to get node synergy',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/synergy/nodes
   * Register new component
   */
  router.post('/nodes', (req: Request, res: Response) => {
    try {
      const { id, component, baseSynergy, connections } = req.body;

      if (!id || !component) {
        return res.status(400).json({
          error: 'Missing required fields: id, component',
        });
      }

      const node = engine.registerComponent(
        id,
        component,
        baseSynergy || 1.0,
        connections || []
      );

      res.status(201).json({
        success: true,
        node: {
          id: node.id,
          component: node.component,
          baseSynergy: node.baseSynergy,
          compoundedSynergy: node.compoundedSynergy,
        },
      });
    } catch (error: any) {
      logger.error('Error registering component:', error);
      res.status(500).json({
        error: 'Failed to register component',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/synergy/connections
   * Create synergy connection
   */
  router.post('/connections', (req: Request, res: Response) => {
    try {
      const { from, to, strength, type } = req.body;

      if (!from || !to) {
        return res.status(400).json({
          error: 'Missing required fields: from, to',
        });
      }

      const connection = engine.createConnection(
        from,
        to,
        strength || 1.0,
        type || 'direct'
      );

      res.status(201).json({
        success: true,
        connection,
      });
    } catch (error: any) {
      logger.error('Error creating connection:', error);
      res.status(500).json({
        error: 'Failed to create connection',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/synergy/boost/:id
   * Boost node synergy
   */
  router.post('/boost/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { multiplier, duration } = req.body;

      if (!multiplier) {
        return res.status(400).json({
          error: 'Missing required field: multiplier',
        });
      }

      engine.boostSynergy(id, multiplier, duration || 5000);

      res.json({
        success: true,
        message: `Synergy boost applied to ${id}`,
      });
    } catch (error: any) {
      logger.error('Error boosting synergy:', error);
      res.status(500).json({
        error: 'Failed to boost synergy',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/synergy/reset
   * Reset synergy values
   */
  router.post('/reset', (req: Request, res: Response) => {
    try {
      engine.reset();
      res.json({
        success: true,
        message: 'Synergy reset',
      });
    } catch (error: any) {
      logger.error('Error resetting synergy:', error);
      res.status(500).json({
        error: 'Failed to reset synergy',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  });

  return router;
}
