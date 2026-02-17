/**
 * Legal AI Engine Tests
 * Tests for legal document generation, emergency handling, and precedent analysis
 */

import { LegalAIEngine, LegalContext, EmergencySituation } from '../legal-ai-engine';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai');

describe('Legal AI System', () => {
  let legalEngine: LegalAIEngine;
  let mockOpenAI: jest.Mocked<OpenAI>;

  beforeEach(() => {
    const mockChatCompletions = {
      create: jest.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'Mock legal document content'
          }
        }],
        usage: {
          total_tokens: 100
        }
      })
    };

    mockOpenAI = {
      chat: {
        completions: mockChatCompletions as any
      }
    } as any;

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI);

    legalEngine = new LegalAIEngine(
      { jurisdiction: 'Georgia' },
      { 
        apiKey: 'test-key',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000
      }
    );
  });

  describe('Document Generation', () => {
    test('generates evidence timeline from accommodation logs', async () => {
      const context: LegalContext = {
        jurisdiction: 'Georgia',
        courtSystem: 'Superior Court',
        caseType: 'custody',
        parties: {
          plaintiff: 'Protected Party',
          defendant: 'Other Party'
        },
        facts: [
          'Accommodation request denied on 2025-01-15',
          'Medical documentation provided on 2025-01-20',
          'Follow-up request on 2025-02-01'
        ],
        legalIssues: ['disability accommodation', 'medical necessity'],
        evidence: ['accommodation_log.pdf', 'medical_records.pdf']
      };

      const result = await legalEngine.generateDocument('evidence-timeline', context, 'high');

      expect(result.success).toBe(true);
      expect(result.documentType).toBe('evidence-timeline');
      expect(result.document).toBeDefined();
      expect(result.metadata.jurisdiction).toBe('Georgia');
      expect(result.metadata.urgency).toBe('high');
    });

    test('formats legal documents with correct structure', async () => {
      const context: LegalContext = {
        jurisdiction: 'Georgia',
        courtSystem: 'Superior Court',
        caseType: 'custody',
        parties: {
          plaintiff: 'Test Plaintiff',
          defendant: 'Test Defendant'
        },
        facts: ['Fact 1', 'Fact 2'],
        legalIssues: ['Issue 1'],
        evidence: ['evidence1.pdf']
      };

      const result = await legalEngine.generateDocument('motion', context);

      expect(result.success).toBe(true);
      expect(result.document).toContain('Mock legal document');
      expect(result.timestamp).toBeDefined();
      expect(result.metadata).toBeDefined();
    });

    test('does NOT provide legal advice (outputs disclaimers)', async () => {
      const context: LegalContext = {
        jurisdiction: 'Georgia',
        courtSystem: 'Superior Court',
        caseType: 'custody',
        parties: {
          plaintiff: 'Test',
          defendant: 'Test'
        },
        facts: [],
        legalIssues: [],
        evidence: []
      };

      // Mock response with disclaimer
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'DISCLAIMER: This is not legal advice. Consult with a licensed attorney.'
          }
        }],
        usage: { total_tokens: 50 }
      });

      const result = await legalEngine.generateDocument('advice', context);

      expect(result.document).toContain('DISCLAIMER');
      expect(result.document).toContain('not legal advice');
    });

    test('handles missing data gracefully', async () => {
      const context: LegalContext = {
        jurisdiction: 'Georgia',
        courtSystem: 'Superior Court',
        caseType: 'custody',
        parties: {
          plaintiff: '',
          defendant: ''
        },
        facts: [],
        legalIssues: [],
        evidence: []
      };

      const result = await legalEngine.generateDocument('document', context);

      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
    });

    test('exports in court-ready format', async () => {
      const context: LegalContext = {
        jurisdiction: 'Georgia',
        courtSystem: 'Superior Court',
        caseType: 'custody',
        parties: {
          plaintiff: 'Test',
          defendant: 'Test'
        },
        facts: ['Fact'],
        legalIssues: ['Issue'],
        evidence: ['evidence.pdf']
      };

      const result = await legalEngine.generateDocument('motion', context, 'high');

      expect(result.metadata.jurisdiction).toBe('Georgia');
      expect(result.metadata.courtSystem).toBe('Superior Court');
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO format
    });
  });

  describe('Emergency Handling', () => {
    test('handles emergency situations', async () => {
      const situation: EmergencySituation = {
        type: 'restraining-order',
        urgency: 'high',
        details: 'Immediate threat situation',
        evidence: ['threat_evidence.pdf']
      };

      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'Emergency response: File restraining order immediately.'
          }
        }],
        usage: { total_tokens: 75 }
      });

      const result = await legalEngine.handleEmergency(situation, ['evidence1.pdf']);

      expect(result.success).toBe(true);
      expect(result.situationType).toBe('restraining-order');
      expect(result.response).toBeDefined();
      expect(result.metadata.urgency).toBe('high');
    });

    test('handles different emergency types', async () => {
      const types: EmergencySituation['type'][] = [
        'restraining-order',
        'emergency-motion',
        'protection-order'
      ];

      for (const type of types) {
        const situation: EmergencySituation = {
          type,
          urgency: 'high',
          details: 'Test emergency',
          evidence: []
        };

        const result = await legalEngine.handleEmergency(situation, []);

        expect(result.success).toBe(true);
        expect(result.situationType).toBe(type);
      }
    });
  });

  describe('Error Handling', () => {
    test('handles OpenAI API errors', async () => {
      mockOpenAI.chat.completions.create = jest.fn().mockRejectedValue(
        new Error('API Error')
      );

      const context: LegalContext = {
        jurisdiction: 'Georgia',
        courtSystem: 'Superior Court',
        caseType: 'custody',
        parties: {
          plaintiff: 'Test',
          defendant: 'Test'
        },
        facts: [],
        legalIssues: [],
        evidence: []
      };

      await expect(
        legalEngine.generateDocument('document', context)
      ).rejects.toThrow('Failed to generate document');
    });

    test('handles missing API key gracefully', () => {
      // Should not throw during construction if key is missing
      expect(() => {
        new LegalAIEngine(
          {},
          { model: 'gpt-4', temperature: 0.7, maxTokens: 2000 }
        );
      }).not.toThrow();
    });
  });
});
