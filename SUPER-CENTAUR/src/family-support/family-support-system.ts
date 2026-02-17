import express from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Import existing modules
import { LegalAIEngine } from '../legal/legal-ai-engine';
import { MedicalDocumentationSystem } from '../medical/medical-documentation-system';

interface FamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'support' | 'legal';
  contactInfo: {
    email?: string;
    phone?: string;
    emergencyContact?: boolean;
  };
  accessLevel: 'view' | 'limited' | 'full';
  lastAccessed: Date;
}

interface CustodyCase {
  id: string;
  caseNumber: string;
  status: 'active' | 'pending' | 'resolved';
  court: string;
  judge: string;
  filingDate: Date;
  lastHearing: Date;
  nextHearing: Date;
  documents: Document[];
  communications: Communication[];
  timeline: TimelineEvent[];
  legalStrategy: string;
  currentIssues: string[];
  supportNetwork: string[];
}

interface Communication {
  id: string;
  type: 'email' | 'text' | 'call' | 'in-person' | 'court';
  date: Date;
  participants: string[];
  summary: string;
  attachments: string[];
  flagged: boolean;
  legalRelevance: 'high' | 'medium' | 'low';
}

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'hearing' | 'filing' | 'meeting' | 'incident' | 'milestone';
  description: string;
  importance: 'critical' | 'important' | 'routine';
  documents: string[];
}

interface MedicalRecord {
  id: string;
  date: Date;
  type: 'symptom' | 'medication' | 'appointment' | 'therapy' | 'emergency';
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  attachments: string[];
}

interface SupportRequest {
  id: string;
  type: 'emotional' | 'legal' | 'financial' | 'practical' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requestedBy: string;
  assignedTo: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

interface EmergencyProtocol {
  id: string;
  trigger: string;
  actions: EmergencyAction[];
  contacts: string[];
  escalationLevel: number;
  isActive: boolean;
}

interface EmergencyAction {
  type: 'call' | 'message' | 'email' | 'alert' | 'lockdown';
  target: string;
  message: string;
  delay: number; // minutes
}

class FamilySupportSystem {
  private app: express.Application;
  private legalAI: LegalAIEngine;
  private medicalSystem: MedicalDocumentationSystem;
  private familyMembers: FamilyMember[] = [];
  private custodyCases: CustodyCase[] = [];
  private supportRequests: SupportRequest[] = [];
  private emergencyProtocols: EmergencyProtocol[] = [];
  private secretKey: string;

  constructor() {
    this.app = express();
    this.legalAI = new LegalAIEngine();
    this.medicalSystem = new MedicalDocumentationSystem();
    // CRITICAL: Require JWT secret from environment
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required for family support security');
    }
    this.secretKey = process.env.JWT_SECRET;
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeEmergencyProtocols();
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(this.authenticateToken.bind(this));
  }

  private authenticateToken(req: Request, res: Response, next: any) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, this.secretKey, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  }

  private setupRoutes() {
    // Family Member Management
    this.app.post('/api/family/members', this.addFamilyMember.bind(this));
    this.app.get('/api/family/members', this.getFamilyMembers.bind(this));
    this.app.put('/api/family/members/:id', this.updateFamilyMember.bind(this));
    this.app.delete('/api/family/members/:id', this.removeFamilyMember.bind(this));

    // Custody Case Management
    this.app.post('/api/family/custody', this.createCustodyCase.bind(this));
    this.app.get('/api/family/custody', this.getCustodyCases.bind(this));
    this.app.get('/api/family/custody/:id', this.getCustodyCase.bind(this));
    this.app.put('/api/family/custody/:id', this.updateCustodyCase.bind(this));
    this.app.delete('/api/family/custody/:id', this.deleteCustodyCase.bind(this));

    // Communication Tracking
    this.app.post('/api/family/communications', this.addCommunication.bind(this));
    this.app.get('/api/family/communications', this.getCommunications.bind(this));
    this.app.put('/api/family/communications/:id', this.updateCommunication.bind(this));

    // Timeline Management
    this.app.post('/api/family/timeline', this.addTimelineEvent.bind(this));
    this.app.get('/api/family/timeline', this.getTimeline.bind(this));

    // Support Requests
    this.app.post('/api/family/support', this.createSupportRequest.bind(this));
    this.app.get('/api/family/support', this.getSupportRequests.bind(this));
    this.app.put('/api/family/support/:id', this.updateSupportRequest.bind(this));

    // Medical Integration
    this.app.post('/api/family/medical', this.logMedicalEvent.bind(this));
    this.app.get('/api/family/medical', this.getMedicalRecords.bind(this));

    // Emergency Protocols
    this.app.post('/api/family/emergency/trigger', this.triggerEmergency.bind(this));
    this.app.get('/api/family/emergency/protocols', this.getEmergencyProtocols.bind(this));

    // Analytics & Reports
    this.app.get('/api/family/analytics/custody', this.getCustodyAnalytics.bind(this));
    this.app.get('/api/family/analytics/communications', this.getCommunicationAnalytics.bind(this));
    this.app.get('/api/family/analytics/support', this.getSupportAnalytics.bind(this));
  }

  // Family Member Management
  private async addFamilyMember(req: Request, res: Response) {
    try {
      const member: FamilyMember = {
        id: uuidv4(),
        ...req.body,
        lastAccessed: new Date()
      };
      
      this.familyMembers.push(member);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add family member' });
    }
  }

  private async getFamilyMembers(req: Request, res: Response) {
    try {
      const { relationship, accessLevel } = req.query;
      
      let members = this.familyMembers;
      
      if (relationship) {
        members = members.filter(m => m.relationship === relationship);
      }
      
      if (accessLevel) {
        members = members.filter(m => m.accessLevel === accessLevel);
      }
      
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve family members' });
    }
  }

  // Custody Case Management
  private async createCustodyCase(req: Request, res: Response) {
    try {
      const caseData: Partial<CustodyCase> = req.body;
      const custodyCase: CustodyCase = {
        id: uuidv4(),
        documents: [],
        communications: [],
        timeline: [],
        currentIssues: [],
        supportNetwork: [],
        ...caseData,
        filingDate: new Date(caseData.filingDate || new Date()),
        lastHearing: new Date(caseData.lastHearing || new Date()),
        nextHearing: new Date(caseData.nextHearing || new Date())
      };
      
      this.custodyCases.push(custodyCase);
      
      // Generate initial legal strategy using AI
      const strategy = await this.legalAI.generateLegalStrategy({
        caseType: 'custody',
        facts: caseData.legalStrategy || '',
        jurisdiction: 'Georgia'
      });
      
      custodyCase.legalStrategy = strategy;
      
      res.status(201).json(custodyCase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create custody case' });
    }
  }

  private async getCustodyCases(req: Request, res: Response) {
    try {
      const { status, caseNumber } = req.query;
      
      let cases = this.custodyCases;
      
      if (status) {
        cases = cases.filter(c => c.status === status);
      }
      
      if (caseNumber) {
        cases = cases.filter(c => c.caseNumber.includes(caseNumber as string));
      }
      
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve custody cases' });
    }
  }

  // Communication Tracking
  private async addCommunication(req: Request, res: Response) {
    try {
      const communication: Communication = {
        id: uuidv4(),
        ...req.body,
        date: new Date(),
        flagged: false
      };
      
      // Auto-flag potentially problematic communications
      if (this.shouldFlagCommunication(communication)) {
        communication.flagged = true;
      }
      
      // Add to relevant custody case
      const caseId = req.body.caseId;
      if (caseId) {
        const custodyCase = this.custodyCases.find(c => c.id === caseId);
        if (custodyCase) {
          custodyCase.communications.push(communication);
        }
      }
      
      res.status(201).json(communication);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add communication' });
    }
  }

  private shouldFlagCommunication(communication: Communication): boolean {
    const triggerWords = [
      'threat', 'violence', 'abuse', 'harass', 'stalker', 'fear', 'unsafe',
      'police', 'restraining', 'emergency', 'help', 'danger'
    ];
    
    const text = `${communication.summary} ${communication.participants.join(' ')}`.toLowerCase();
    
    return triggerWords.some(word => text.includes(word));
  }

  // Support Request Management
  private async createSupportRequest(req: Request, res: Response) {
    try {
      const request: SupportRequest = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date(),
        status: 'pending'
      };
      
      this.supportRequests.push(request);
      
      // Auto-assign based on type and priority
      this.autoAssignSupportRequest(request);
      
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create support request' });
    }
  }

  private autoAssignSupportRequest(request: SupportRequest) {
    // Logic to auto-assign support requests based on type, priority, and availability
    const availableMembers = this.familyMembers.filter(m => 
      m.accessLevel === 'full' && 
      m.relationship !== 'spouse'
    );
    
    if (availableMembers.length > 0) {
      request.assignedTo = [availableMembers[0].id];
    }
  }

  // Medical Integration
  private async logMedicalEvent(req: Request, res: Response) {
    try {
      const medicalEvent: MedicalRecord = {
        id: uuidv4(),
        ...req.body,
        date: new Date()
      };
      
      // Log to medical system
      await this.medicalSystem.logEvent(medicalEvent);
      
      // Check if this should trigger support request
      if (medicalEvent.severity === 'high' || medicalEvent.severity === 'critical') {
        const supportRequest: Partial<SupportRequest> = {
          type: 'emotional',
          priority: medicalEvent.severity === 'critical' ? 'critical' : 'high',
          description: `Medical event logged: ${medicalEvent.details}`,
          requestedBy: (req as any).user?.id || 'unknown'
        };
        
        this.createSupportRequest({ body: supportRequest } as Request, res);
      }
      
      res.status(201).json(medicalEvent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to log medical event' });
    }
  }

  // Emergency Protocols
  private initializeEmergencyProtocols() {
    this.emergencyProtocols = [
      {
        id: 'domestic-violence',
        trigger: 'domestic violence incident',
        actions: [
          { type: 'call', target: '911', message: 'DOMESTIC VIOLENCE EMERGENCY', delay: 0 },
          { type: 'message', target: 'support-network', message: 'EMERGENCY: Domestic violence incident reported', delay: 1 },
          { type: 'email', target: 'legal-counsel', message: 'URGENT: Domestic violence incident - immediate legal action required', delay: 2 }
        ],
        contacts: ['emergency-services', 'support-network', 'legal-counsel'],
        escalationLevel: 1,
        isActive: true
      },
      {
        id: 'medical-emergency',
        trigger: 'medical emergency',
        actions: [
          { type: 'call', target: '911', message: 'MEDICAL EMERGENCY', delay: 0 },
          { type: 'message', target: 'family-members', message: 'MEDICAL EMERGENCY: Immediate assistance required', delay: 1 },
          { type: 'email', target: 'medical-provider', message: 'URGENT: Medical emergency - patient requires immediate attention', delay: 2 }
        ],
        contacts: ['emergency-services', 'family-members', 'medical-provider'],
        escalationLevel: 2,
        isActive: true
      },
      {
        id: 'custody-violation',
        trigger: 'custody order violation',
        actions: [
          { type: 'message', target: 'legal-counsel', message: 'CUSTODY VIOLATION: Immediate legal action required', delay: 0 },
          { type: 'email', target: 'court-officer', message: 'VIOLATION: Custody order violation reported', delay: 5 },
          { type: 'alert', target: 'support-network', message: 'CUSTODY ISSUE: Support needed', delay: 10 }
        ],
        contacts: ['legal-counsel', 'court-officer', 'support-network'],
        escalationLevel: 3,
        isActive: true
      }
    ];
  }

  private async triggerEmergency(req: Request, res: Response) {
    try {
      const { protocolId, details } = req.body;
      
      const protocol = this.emergencyProtocols.find(p => p.id === protocolId);
      if (!protocol) {
        return res.status(404).json({ error: 'Emergency protocol not found' });
      }
      
      // Execute emergency actions
      for (const action of protocol.actions) {
        setTimeout(() => {
          this.executeEmergencyAction(action, details);
        }, action.delay * 60000); // Convert minutes to milliseconds
      }
      
      res.json({ message: 'Emergency protocol activated', protocol });
    } catch (error) {
      res.status(500).json({ error: 'Failed to trigger emergency protocol' });
    }
  }

  private executeEmergencyAction(action: EmergencyAction, details: any) {
    // Implementation of emergency actions
    console.log(`Executing emergency action: ${action.type} to ${action.target}`);
    console.log(`Message: ${action.message}`);
    console.log(`Details:`, details);
  }

  // Analytics
  private async getCustodyAnalytics(req: Request, res: Response) {
    try {
      const caseId = req.query.caseId as string;
      const custodyCase = caseId ? 
        this.custodyCases.find(c => c.id === caseId) : 
        this.custodyCases[0]; // Default to first case
      
      if (!custodyCase) {
        return res.status(404).json({ error: 'Custody case not found' });
      }
      
      const analytics = {
        caseStatus: custodyCase.status,
        daysSinceLastHearing: Math.floor((Date.now() - custodyCase.lastHearing.getTime()) / (1000 * 60 * 60 * 24)),
        daysUntilNextHearing: Math.floor((custodyCase.nextHearing.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        totalCommunications: custodyCase.communications.length,
        flaggedCommunications: custodyCase.communications.filter(c => c.flagged).length,
        totalDocuments: custodyCase.documents.length,
        activeIssues: custodyCase.currentIssues.length,
        supportNetworkSize: custodyCase.supportNetwork.length,
        communicationTrend: this.analyzeCommunicationTrend(custodyCase.communications),
        riskLevel: this.calculateRiskLevel(custodyCase)
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate custody analytics' });
    }
  }

  private analyzeCommunicationTrend(communications: Communication[]): string {
    const recentCommunications = communications.filter(c => 
      Date.now() - c.date.getTime() < 30 * 24 * 60 * 60 * 1000 // Last 30 days
    );
    
    const flaggedRate = recentCommunications.filter(c => c.flagged).length / recentCommunications.length;
    
    if (flaggedRate > 0.3) return 'high-risk';
    if (flaggedRate > 0.1) return 'moderate-risk';
    return 'low-risk';
  }

  private calculateRiskLevel(custodyCase: CustodyCase): string {
    let riskScore = 0;
    
    // Factor in flagged communications
    const flaggedRate = custodyCase.communications.filter(c => c.flagged).length / 
                       Math.max(custodyCase.communications.length, 1);
    riskScore += flaggedRate * 50;
    
    // Factor in active issues
    riskScore += custodyCase.currentIssues.length * 10;
    
    // Factor in time since last hearing
    const daysSinceHearing = Math.floor((Date.now() - custodyCase.lastHearing.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceHearing > 90) riskScore += 20;
    
    // Factor in support network size
    if (custodyCase.supportNetwork.length < 3) riskScore += 15;
    
    if (riskScore > 70) return 'high';
    if (riskScore > 30) return 'moderate';
    return 'low';
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Family Support System running on port ${port}`);
      console.log('🛡️ Family Fortress Active - Protecting Your Loved Ones');
    });
  }
}

export default FamilySupportSystem;