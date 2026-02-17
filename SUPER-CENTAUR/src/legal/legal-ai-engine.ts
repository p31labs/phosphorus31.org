/**
 * Legal AI Engine for SUPER CENTAUR
 * Combines legal AI capabilities from Digital Centaur with autonomous agent features
 */

import { Logger } from '../utils/logger';
import OpenAI from 'openai';

export interface LegalContext {
  jurisdiction: string;
  courtSystem: string;
  caseType: string;
  parties: {
    plaintiff: string;
    defendant: string;
  };
  facts: string[];
  legalIssues: string[];
  evidence: string[];
}

export interface EmergencySituation {
  type: 'restraining-order' | 'emergency-motion' | 'protection-order';
  urgency: 'high' | 'medium' | 'low';
  details: string;
  evidence: string[];
}

export interface DocumentTemplate {
  type: string;
  template: string;
  requiredFields: string[];
  optionalFields: string[];
}

export class LegalAIEngine {
  private logger: Logger;
  private openai: OpenAI;
  private config: any;

  constructor(legalConfig: any, aiConfig: any) {
    this.logger = new Logger('LegalAIEngine');
    this.config = { legal: legalConfig, ai: aiConfig };
    
    this.openai = new OpenAI({
      apiKey: aiConfig.apiKey || process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
    });
    
    this.logger.info('Legal AI Engine initialized');
  }

  public async generateDocument(type: string, context: LegalContext, urgency: string = 'medium'): Promise<any> {
    try {
      this.logger.info(`Generating legal document: ${type}`);
      
      const prompt = this.buildDocumentPrompt(type, context, urgency);
      const response = await this.openai.chat.completions.create({
        model: this.config.ai.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.ai.temperature,
        max_tokens: this.config.ai.maxTokens,
      });

      const document = response.choices[0].message.content;
      
      return {
        success: true,
        documentType: type,
        document: document,
        timestamp: new Date().toISOString(),
        metadata: {
          jurisdiction: context.jurisdiction,
          courtSystem: context.courtSystem,
          urgency: urgency,
          tokensUsed: response.usage?.total_tokens
        }
      };
    } catch (error) {
      this.logger.error('Document generation error:', error);
      throw new Error(`Failed to generate ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async handleEmergency(situation: EmergencySituation, evidence: string[]): Promise<any> {
    try {
      this.logger.info(`Handling emergency situation: ${situation.type}`);
      
      const prompt = this.buildEmergencyPrompt(situation, evidence);
      const response = await this.openai.chat.completions.create({
        model: this.config.ai.model,
        messages: [
          {
            role: 'system',
            content: this.getEmergencySystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more precise emergency responses
        max_tokens: 2000,
      });

      const responseText = response.choices[0].message.content;
      
      return {
        success: true,
        situationType: situation.type,
        response: responseText,
        timestamp: new Date().toISOString(),
        metadata: {
          urgency: situation.urgency,
          evidenceCount: evidence.length,
          tokensUsed: response.usage?.total_tokens
        }
      };
    } catch (error) {
      this.logger.error('Emergency response error:', error);
      throw new Error(`Failed to handle emergency: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async analyzeLegalPrecedent(query: string, jurisdiction: string): Promise<any> {
    try {
      this.logger.info(`Analyzing legal precedent for: ${query}`);
      
      const prompt = this.buildPrecedentPrompt(query, jurisdiction);
      const response = await this.openai.chat.completions.create({
        model: this.config.ai.model,
        messages: [
          {
            role: 'system',
            content: this.getPrecedentSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 3000,
      });

      const analysis = response.choices[0].message.content;
      
      return {
        success: true,
        query: query,
        jurisdiction: jurisdiction,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        metadata: {
          tokensUsed: response.usage?.total_tokens
        }
      };
    } catch (error) {
      this.logger.error('Legal precedent analysis error:', error);
      throw new Error(`Failed to analyze precedent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async generateComplianceReport(jurisdiction: string, requirements: string[]): Promise<any> {
    try {
      this.logger.info('Generating compliance report');
      
      const prompt = this.buildCompliancePrompt(jurisdiction, requirements);
      const response = await this.openai.chat.completions.create({
        model: this.config.ai.model,
        messages: [
          {
            role: 'system',
            content: this.getComplianceSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 2500,
      });

      const report = response.choices[0].message.content;
      
      return {
        success: true,
        report: report,
        jurisdiction: jurisdiction,
        timestamp: new Date().toISOString(),
        metadata: {
          requirementsCount: requirements.length,
          tokensUsed: response.usage?.total_tokens
        }
      };
    } catch (error) {
      this.logger.error('Compliance report generation error:', error);
      throw new Error(`Failed to generate compliance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildDocumentPrompt(type: string, context: LegalContext, urgency: string): string {
    return `
Generate a ${type} document with the following specifications:

JURISDICTION: ${context.jurisdiction}
COURT SYSTEM: ${context.courtSystem}
URGENCY LEVEL: ${urgency}

PARTIES:
- Plaintiff: ${context.parties.plaintiff}
- Defendant: ${context.parties.defendant}

FACTS:
${context.facts.map((fact, index) => `${index + 1}. ${fact}`).join('\n')}

LEGAL ISSUES:
${context.legalIssues.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}

EVIDENCE:
${context.evidence.map((ev, index) => `${index + 1}. ${ev}`).join('\n')}

Please generate a comprehensive legal document that includes:
1. Proper legal formatting and structure
2. Applicable legal standards and precedents
3. Clear and concise language
4. All necessary legal citations
5. Proper formatting for the specified jurisdiction

The document should be professional, thorough, and ready for court submission.
`;
  }

  private buildEmergencyPrompt(situation: EmergencySituation, evidence: string[]): string {
    return `
EMERGENCY LEGAL SITUATION: ${situation.type.toUpperCase()}
URGENCY LEVEL: ${situation.urgency.toUpperCase()}

SITUATION DETAILS:
${situation.details}

EVIDENCE PROVIDED:
${evidence.map((ev, index) => `${index + 1}. ${ev}`).join('\n')}

Please provide an immediate legal response that includes:
1. Emergency legal procedures for this situation
2. Required documentation and filings
3. Immediate actions to take
4. Legal rights and protections available
5. Contact information for emergency legal resources

This is a time-sensitive emergency requiring immediate action.
`;
  }

  private buildPrecedentPrompt(query: string, jurisdiction: string): string {
    return `
LEGAL PRECEDENT ANALYSIS REQUEST

QUERY: ${query}
JURISDICTION: ${jurisdiction}

Please provide a comprehensive analysis of relevant legal precedents including:
1. Similar cases and their outcomes
2. Applicable case law
3. Legal principles established
4. Relevance to current query
5. Potential legal strategies

Focus on cases within the specified jurisdiction and provide detailed citations.
`;
  }

  private buildCompliancePrompt(jurisdiction: string, requirements: string[]): string {
    return `
COMPLIANCE ANALYSIS FOR JURISDICTION: ${jurisdiction}

REQUIREMENTS TO ANALYZE:
${requirements.map((req, index) => `${index + 1}. ${req}`).join('\n')}

Please generate a comprehensive compliance report that includes:
1. Analysis of each requirement
2. Compliance obligations
3. Implementation steps
4. Penalties for non-compliance
5. Best practices for compliance
6. Relevant regulations and statutes

Provide specific guidance for the specified jurisdiction.
`;
  }

  private getSystemPrompt(): string {
    return `
You are a highly skilled legal AI assistant specializing in legal document generation and analysis. 
Your responses must be:
- Accurate and legally sound
- Jurisdiction-specific when applicable
- Professional and comprehensive
- Ready for court submission
- Include proper legal citations and formatting

Do not provide general advice - provide specific, actionable legal documents and analysis.
Always consider the jurisdiction and applicable laws.
`;
  }

  private getEmergencySystemPrompt(): string {
    return `
You are a legal emergency response AI. This is a time-sensitive situation requiring immediate action.
Your responses must be:
- Immediate and actionable
- Focused on emergency procedures
- Include specific steps to take
- Provide emergency contact information
- Prioritize safety and legal protection

Do not provide general information - provide specific emergency legal guidance.
Time is critical in this situation.
`;
  }

  private getPrecedentSystemPrompt(): string {
    return `
You are a legal research AI specializing in precedent analysis.
Your responses must be:
- Thorough and comprehensive
- Include specific case citations
- Analyze relevance to current query
- Provide legal reasoning
- Focus on applicable jurisdiction

Provide detailed legal research and analysis of relevant precedents.
`;
  }

  private getComplianceSystemPrompt(): string {
    return `
You are a compliance analysis AI specializing in regulatory requirements.
Your responses must be:
- Comprehensive and detailed
- Jurisdiction-specific
- Include specific compliance steps
- Identify potential risks
- Provide practical guidance

Focus on actionable compliance strategies and requirements.
`;
  }

  public async getStatus(): Promise<any> {
    return {
      status: 'active',
      capabilities: [
        'Document Generation',
        'Emergency Response',
        'Precedent Analysis',
        'Compliance Reporting'
      ],
      lastActivity: new Date().toISOString(),
      model: this.config.ai.model,
      jurisdiction: this.config.legal.jurisdiction
    };
  }
}