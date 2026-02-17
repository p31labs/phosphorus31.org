/**
 * Smart Chatbot for SUPER CENTAUR
 * Wired to OpenAI for real AI responses, with smart keyword fallback
 */

import { Logger } from '../../utils/logger';
import OpenAI from 'openai';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  type: 'text' | 'document' | 'analysis' | 'error';
  metadata?: any;
}

export interface ChatSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  messages: ChatMessage[];
  context: {
    legalKnowledge: boolean;
    medicalKnowledge: boolean;
    blockchainKnowledge: boolean;
    lastInteraction: string;
  };
}

export interface BotResponse {
  message: string;
  suggestions: string[];
  nextActions: string[];
  confidence: number;
  sources: string[];
}

export class Chatbot {
  private logger: Logger;
  private sessions: Map<string, ChatSession>;
  private aiConfig: any;
  private openai: OpenAI | null = null;

  constructor(aiConfig: any) {
    this.logger = new Logger('Chatbot');
    this.aiConfig = aiConfig;
    this.sessions = new Map();

    const apiKey = aiConfig?.apiKey || process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        organization: process.env.OPENAI_ORGANIZATION,
      });
      this.logger.info('Smart Chatbot initialized with OpenAI');
    } else {
      this.logger.warn('Smart Chatbot initialized without OpenAI — using keyword-based responses');
    }
  }

  public async processMessage(message: string, sessionId: string, userId: string = 'anonymous'): Promise<BotResponse> {
    try {
      this.logger.info(`Processing message from session: ${sessionId}`);

      let session = this.sessions.get(sessionId);
      if (!session) {
        session = this.createSession(sessionId, userId);
        this.sessions.set(sessionId, session);
      }

      session.context.lastInteraction = new Date().toISOString();
      session.messages.push({
        id: this.generateMessageId(),
        sender: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        type: 'text',
      });

      let response: BotResponse;
      if (this.openai) {
        response = await this.generateAIResponse(message, session);
      } else {
        response = await this.generateSmartFallback(message, session);
      }

      session.messages.push({
        id: this.generateMessageId(),
        sender: 'bot',
        content: response.message,
        timestamp: new Date().toISOString(),
        type: 'text',
        metadata: { suggestions: response.suggestions, confidence: response.confidence },
      });

      if (session.messages.length > 50) {
        session.messages = session.messages.slice(-30);
      }

      return response;
    } catch (error) {
      this.logger.error('Failed to process message:', error);
      return {
        message: "I encountered an issue processing your request. Could you rephrase your question?",
        suggestions: ['Try asking about legal matters', 'Ask about medical documentation', 'Ask about blockchain status'],
        nextActions: ['Retry your question', 'Use a quick action button'],
        confidence: 0.5,
        sources: ['System'],
      };
    }
  }

  private async generateAIResponse(message: string, session: ChatSession): Promise<BotResponse> {
    try {
      const recentMessages = session.messages.slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }));

      const completion = await this.openai!.chat.completions.create({
        model: this.aiConfig?.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are the SUPER CENTAUR AI Assistant — a sophisticated, compassionate, and capable assistant specializing in:

1. **Legal AI**: Family law, custody cases, emergency legal motions, compliance, precedent analysis
2. **Medical Documentation**: ADA compliance, expert witness preparation, chronic condition docs
3. **Financial Sovereignty**: L.O.V.E. Economy, transaction tracking, family financial planning
4. **Blockchain Operations**: Autonomous agents, smart contracts, document verification
5. **Family Support**: Custody case management, emergency protocols, support coordination
6. **System Monitoring**: Consciousness metrics, performance optimization, security

Your personality: warm but professional, action-oriented. Give specific, actionable advice.
When appropriate, suggest which SUPER CENTAUR page the user should visit.
Keep responses concise (2-4 sentences for simple questions, longer for complex analysis).

With love and light. As above, so below.`,
          },
          ...recentMessages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiMessage = completion.choices[0].message.content || 'Let me help you with that.';
      const intent = this.analyzeIntent(message);

      return {
        message: aiMessage,
        suggestions: this.getSuggestionsForIntent(intent.type),
        nextActions: this.getNextActionsForIntent(intent.type),
        confidence: 0.95,
        sources: ['OpenAI', 'SUPER CENTAUR Knowledge Base'],
      };
    } catch (error) {
      this.logger.warn('OpenAI call failed, using smart fallback:', error);
      return this.generateSmartFallback(message, session);
    }
  }

  private async generateSmartFallback(message: string, session: ChatSession): Promise<BotResponse> {
    const intent = this.analyzeIntent(message);
    const lower = message.toLowerCase();

    const responses: Record<string, string> = {
      legal: `I can help with your legal matter. I recommend heading to the **Legal AI** page where you can generate documents, analyze cases, and research precedents. For emergencies, our emergency legal response is available 24/7.\n\nWhat specific legal assistance do you need?`,
      medical: `For medical documentation, our **Medical Hub** provides chronic condition documentation (including hypoparathyroidism), ADA compliance statements, and expert witness preparation.\n\nWould you like help with a specific medical document?`,
      blockchain: `Your blockchain operations are managed through the **Blockchain Console** — create/manage agents, deploy smart contracts, and verify transactions.\n\nWould you like to check agent status or deploy a new contract?`,
      financial: `The **L.O.V.E. Economy** page gives you full control over family financial sovereignty — balance tracking, transactions, and privacy-first financial management.\n\nWould you like to review transactions or add a new one?`,
      consciousness: `Your **Consciousness Monitor** tracks coherence, focus, creativity, awareness, and balance in real-time with optimization controls.\n\nShall I check your current levels?`,
      family: `**Family Support** provides fortress-level protection — custody case tracking, emergency protocols, and support coordination.\n\nWhat type of family support do you need?`,
      greeting: `Welcome to SUPER CENTAUR! I can help with:\n\n- **Legal AI** — case analysis, documents\n- **Medical Hub** — documentation, ADA\n- **L.O.V.E. Economy** — financial sovereignty\n- **Blockchain** — agents, contracts\n- **Family Support** — custody, emergencies\n\nWhat can I help you with?`,
      general: `I'm here to help! Ask me about:\n- **Legal** — "legal help" or "custody"\n- **Medical** — "documentation" or "ADA"\n- **Financial** — "balance" or "transaction"\n- **Family** — "family support" or "emergency"\n\nJust ask and I'll guide you to the right tool.`,
    };

    if (['hello', 'hi', 'hey', 'help', 'start'].some(w => lower.includes(w))) {
      intent.type = 'greeting';
    }

    return {
      message: responses[intent.type] || responses.general,
      suggestions: this.getSuggestionsForIntent(intent.type),
      nextActions: this.getNextActionsForIntent(intent.type),
      confidence: intent.confidence,
      sources: ['SUPER CENTAUR Knowledge Base'],
    };
  }

  private getSuggestionsForIntent(intent: string): string[] {
    const map: Record<string, string[]> = {
      legal: ['Generate a legal document', 'Analyze a custody case', 'Research precedents'],
      medical: ['Create medical documentation', 'ADA compliance statement', 'Expert witness report'],
      blockchain: ['Check agent status', 'Deploy smart contract', 'View transactions'],
      financial: ['Check wallet balance', 'Add a transaction', 'Review insights'],
      consciousness: ['Check consciousness levels', 'Run optimization', 'View trends'],
      family: ['View custody cases', 'Submit support request', 'Emergency protocols'],
      greeting: ['Explore Legal AI', 'Check system status', 'Start a task'],
      general: ['Ask about legal matters', 'Check system health', 'View dashboard'],
    };
    return map[intent] || map.general;
  }

  private getNextActionsForIntent(intent: string): string[] {
    const map: Record<string, string[]> = {
      legal: ['Go to Legal AI page', 'Generate document', 'File emergency motion'],
      medical: ['Go to Medical Hub', 'Auto-fill condition', 'Create expert report'],
      blockchain: ['Go to Blockchain Console', 'Create agent', 'Deploy contract'],
      financial: ['Go to L.O.V.E. Economy', 'Add transaction', 'Check balance'],
      consciousness: ['Go to Consciousness Monitor', 'Run optimization', 'View metrics'],
      family: ['Go to Family Support', 'Submit request', 'Activate protocol'],
      greeting: ['Explore the dashboard', 'Try a quick action', 'Ask me anything'],
      general: ['Visit a specific page', 'Ask a focused question', 'Check system status'],
    };
    return map[intent] || map.general;
  }

  public getSessionHistory(sessionId: string): ChatSession | null {
    return this.sessions.get(sessionId) || null;
  }

  public async clearSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date().toISOString();
      this.sessions.delete(sessionId);
    }
  }

  public async getAvailableFeatures(): Promise<string[]> {
    return [
      'Legal document generation', 'Medical documentation', 'Compliance analysis',
      'Legal precedent research', 'Expert witness preparation', 'Blockchain verification',
      'Autonomous agent coordination', 'Emergency legal response', 'Family support',
      'Consciousness optimization',
    ];
  }

  private createSession(sessionId: string, userId: string): ChatSession {
    return {
      id: sessionId, userId, startTime: new Date().toISOString(), messages: [],
      context: { legalKnowledge: true, medicalKnowledge: true, blockchainKnowledge: true, lastInteraction: new Date().toISOString() },
    };
  }

  private analyzeIntent(message: string): { type: string; confidence: number } {
    const lower = message.toLowerCase();
    if (/\b(legal|law|court|custody|motion|judge|case|attorney|lawyer|filing)\b/.test(lower)) return { type: 'legal', confidence: 0.9 };
    if (/\b(medical|health|doctor|condition|hypoparathyroidism|ada|diagnosis|symptom|treatment)\b/.test(lower)) return { type: 'medical', confidence: 0.9 };
    if (/\b(blockchain|crypto|smart contract|agent|deploy|hash|ethereum)\b/.test(lower)) return { type: 'blockchain', confidence: 0.9 };
    if (/\b(money|balance|transaction|income|expense|financial|wallet|love economy)\b/.test(lower)) return { type: 'financial', confidence: 0.9 };
    if (/\b(consciousness|coherence|focus|creativity|awareness|optimize|quantum)\b/.test(lower)) return { type: 'consciousness', confidence: 0.85 };
    if (/\b(family|child|protect|custody|emergency|support|domestic)\b/.test(lower)) return { type: 'family', confidence: 0.85 };
    return { type: 'general', confidence: 0.7 };
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public async getStatus(): Promise<any> {
    return {
      status: 'active',
      aiEnabled: !!this.openai,
      activeSessions: this.sessions.size,
      totalMessages: Array.from(this.sessions.values()).reduce((total, s) => total + s.messages.length, 0),
      lastActivity: new Date().toISOString(),
      features: await this.getAvailableFeatures(),
    };
  }
}
