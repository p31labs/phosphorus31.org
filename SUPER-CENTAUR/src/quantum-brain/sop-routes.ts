/**
 * Quantum SOP Generator API Routes
 * 
 * REST API endpoints for SOP generation and management.
 */

import { Router, Request, Response } from 'express';
import { QuantumSOPGenerator, SOPContext } from './sop-generator';
import { QuantumBrainBridge } from './index';

export function createSOPRoutes(quantumBrain: QuantumBrainBridge): Router {
  const router = Router();
  const sopGenerator = new QuantumSOPGenerator(quantumBrain);

  /**
   * POST /api/quantum-brain/sop/generate
   * Generate a new SOP
   */
  router.post('/generate', async (req: Request, res: Response) => {
    try {
      const context: SOPContext = {
        domain: req.body.domain,
        objective: req.body.objective,
        constraints: req.body.constraints || [],
        priority: req.body.priority || 'normal',
        audience: req.body.audience,
      };

      // Validate required fields
      if (!context.domain || !context.objective) {
        return res.status(400).json({
          error: 'Missing required fields: domain and objective are required',
        });
      }

      const sop = await sopGenerator.generateSOP(context);
      
      res.status(201).json({
        success: true,
        sop,
        message: 'SOP generated successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to generate SOP',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/quantum-brain/sop/:id
   * Get a specific SOP
   */
  router.get('/:id', (req: Request, res: Response) => {
    try {
      const sop = sopGenerator.getSOP(req.params.id);
      
      if (!sop) {
        return res.status(404).json({
          error: 'SOP not found',
        });
      }

      res.json({
        success: true,
        sop,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to retrieve SOP',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/quantum-brain/sop
   * List all SOPs (optionally filtered by domain)
   */
  router.get('/', (req: Request, res: Response) => {
    try {
      const domain = req.query.domain as string | undefined;
      const sops = sopGenerator.listSOPs(domain);

      res.json({
        success: true,
        count: sops.length,
        sops,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to list SOPs',
        message: error.message,
      });
    }
  });

  /**
   * PUT /api/quantum-brain/sop/:id
   * Update an existing SOP
   */
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const updates: Partial<SOPContext> = {
        domain: req.body.domain,
        objective: req.body.objective,
        constraints: req.body.constraints,
        priority: req.body.priority,
        audience: req.body.audience,
      };

      const sop = await sopGenerator.updateSOP(req.params.id, updates);

      res.json({
        success: true,
        sop,
        message: 'SOP updated successfully',
      });
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: error.message,
        });
      }
      res.status(500).json({
        error: 'Failed to update SOP',
        message: error.message,
      });
    }
  });

  /**
   * GET /api/quantum-brain/sop/:id/export
   * Export SOP in various formats
   */
  router.get('/:id/export', (req: Request, res: Response) => {
    try {
      const format = (req.query.format as 'json' | 'markdown' | 'pdf') || 'json';
      const exported = sopGenerator.exportSOP(req.params.id, format);

      // Set appropriate content type
      const contentType = format === 'json' ? 'application/json' :
                          format === 'markdown' ? 'text/markdown' :
                          'application/pdf';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="sop-${req.params.id}.${format}"`);
      res.send(exported);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: error.message,
        });
      }
      res.status(500).json({
        error: 'Failed to export SOP',
        message: error.message,
      });
    }
  });

  return router;
}
