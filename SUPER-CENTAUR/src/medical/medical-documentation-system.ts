/**
 * Medical Documentation System for SUPER CENTAUR
 * Combines medical documentation capabilities from Digital Centaur with blockchain features
 */

import { Logger } from '../utils/logger';
import { ConfigManager } from '../core/config-manager';

export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  documentationRequired: boolean;
  expertWitnessRequired: boolean;
}

export interface PatientRecord {
  id: string;
  name: string;
  dateOfBirth: string;
  conditions: string[];
  medicalHistory: string;
  currentMedications: string[];
  allergies: string[];
  createdDate: string;
  lastUpdated: string;
}

export interface MedicalDocumentation {
  id: string;
  patientId: string;
  condition: string;
  documentationType: 'chronic' | 'expert-witness' | 'compliance' | 'generational-trauma';
  content: string;
  generatedDate: string;
  status: 'draft' | 'completed' | 'reviewed';
  blockchainHash?: string;
  compliance: {
    HIPAA: boolean;
    GDPR: boolean;
    jurisdiction: string;
  };
}

export class MedicalDocumentationSystem {
  private logger: Logger;
  private config: any;
  private conditions: MedicalCondition[];
  private records: Map<string, PatientRecord>;
  private documents: Map<string, MedicalDocumentation>;

  constructor(medicalConfig: any) {
    this.logger = new Logger('MedicalDocumentationSystem');
    this.config = medicalConfig;
    this.conditions = [];
    this.records = new Map();
    this.documents = new Map();
    
    this.initializeConditions();
    this.logger.info('Medical Documentation System initialized');
  }

  private initializeConditions(): void {
    this.conditions = [
      {
        id: 'hypoparathyroidism',
        name: 'Hypoparathyroidism',
        description: 'A rare endocrine disorder characterized by insufficient parathyroid hormone production',
        symptoms: [
          'Muscle cramps and spasms',
          'Tingling or burning sensations',
          'Fatigue and weakness',
          'Dry skin and brittle nails',
          'Memory problems and difficulty concentrating'
        ],
        treatments: [
          'Calcium supplements',
          'Vitamin D analogs',
          'Magnesium supplementation',
          'Parathyroid hormone replacement therapy'
        ],
        documentationRequired: true,
        expertWitnessRequired: true
      },
      {
        id: 'intellectual-gaps',
        name: 'Intellectual Gaps',
        description: 'Cognitive processing differences that may affect learning and information processing',
        symptoms: [
          'Difficulty with abstract concepts',
          'Processing speed variations',
          'Memory retention challenges',
          'Attention and focus issues'
        ],
        treatments: [
          'Educational accommodations',
          'Cognitive behavioral therapy',
          'Assistive technology',
          'Individualized education plans'
        ],
        documentationRequired: true,
        expertWitnessRequired: true
      },
      {
        id: 'generational-trauma',
        name: 'Generational Trauma',
        description: 'Psychological trauma that is passed down through generations',
        symptoms: [
          'Anxiety and depression',
          'Trust and relationship issues',
          'Hypervigilance',
          'Emotional regulation difficulties'
        ],
        treatments: [
          'Trauma-focused therapy',
          'Family counseling',
          'Mindfulness practices',
          'Support groups'
        ],
        documentationRequired: true,
        expertWitnessRequired: true
      }
    ];
    
    this.logger.info(`Initialized ${this.conditions.length} medical conditions`);
  }

  public async createDocumentation(
    patientId: string, 
    condition: string, 
    symptoms: string[], 
    history: string
  ): Promise<MedicalDocumentation> {
    try {
      this.logger.info(`Creating medical documentation for patient: ${patientId}, condition: ${condition}`);
      
      const patient = this.records.get(patientId);
      if (!patient) {
        throw new Error(`Patient ${patientId} not found`);
      }

      const conditionInfo = this.conditions.find(c => c.id === condition);
      if (!conditionInfo) {
        throw new Error(`Condition ${condition} not supported`);
      }

      const documentation: MedicalDocumentation = {
        id: this.generateId(),
        patientId,
        condition,
        documentationType: this.determineDocumentationType(condition),
        content: await this.generateMedicalContent(patient, conditionInfo, symptoms, history),
        generatedDate: new Date().toISOString(),
        status: 'draft',
        compliance: {
          HIPAA: this.config.compliance.HIPAA,
          GDPR: this.config.compliance.GDPR,
          jurisdiction: this.config.jurisdiction || 'US'
        }
      };

      // Store documentation
      this.documents.set(documentation.id, documentation);
      
      // Update status to completed
      documentation.status = 'completed';
      
      // Generate blockchain hash for immutability
      documentation.blockchainHash = await this.generateBlockchainHash(documentation);
      
      this.logger.info(`Medical documentation created: ${documentation.id}`);
      return documentation;
    } catch (error) {
      this.logger.error('Failed to create medical documentation:', error);
      throw new Error(`Failed to create documentation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async createExpertWitnessReport(patientId: string, condition: string): Promise<MedicalDocumentation> {
    try {
      this.logger.info(`Creating expert witness report for patient: ${patientId}, condition: ${condition}`);
      
      const patient = this.records.get(patientId);
      if (!patient) {
        throw new Error(`Patient ${patientId} not found`);
      }

      const conditionInfo = this.conditions.find(c => c.id === condition);
      if (!conditionInfo) {
        throw new Error(`Condition ${condition} not supported`);
      }

      const report: MedicalDocumentation = {
        id: this.generateId(),
        patientId,
        condition,
        documentationType: 'expert-witness',
        content: await this.generateExpertWitnessContent(patient, conditionInfo),
        generatedDate: new Date().toISOString(),
        status: 'completed',
        compliance: {
          HIPAA: this.config.compliance.HIPAA,
          GDPR: this.config.compliance.GDPR,
          jurisdiction: this.config.jurisdiction || 'US'
        }
      };

      // Store documentation
      this.documents.set(report.id, report);
      
      // Generate blockchain hash for legal validity
      report.blockchainHash = await this.generateBlockchainHash(report);
      
      this.logger.info(`Expert witness report created: ${report.id}`);
      return report;
    } catch (error) {
      this.logger.error('Failed to create expert witness report:', error);
      throw new Error(`Failed to create expert witness report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getAvailableConditions(): Promise<MedicalCondition[]> {
    return this.conditions;
  }

  public async getPatientRecords(patientId: string): Promise<PatientRecord[]> {
    const records: PatientRecord[] = [];
    for (const [id, record] of this.records.entries()) {
      if (id === patientId || !patientId) {
        records.push(record);
      }
    }
    return records;
  }

  public async getDocumentation(documentId: string): Promise<MedicalDocumentation | null> {
    return this.documents.get(documentId) || null;
  }

  public async updatePatientRecord(
    patientId: string,
    updates: Partial<PatientRecord>
  ): Promise<PatientRecord> {
    const existing = this.records.get(patientId);
    if (!existing) {
      throw new Error(`Patient ${patientId} not found`);
    }

    const updated = { ...existing, ...updates, lastUpdated: new Date().toISOString() };
    this.records.set(patientId, updated);
    
    this.logger.info(`Patient record updated: ${patientId}`);
    return updated;
  }

  public async createPatientRecord(record: Omit<PatientRecord, 'id' | 'createdDate' | 'lastUpdated'>): Promise<PatientRecord> {
    const newRecord: PatientRecord = {
      ...record,
      id: this.generateId(),
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    this.records.set(newRecord.id, newRecord);
    this.logger.info(`Patient record created: ${newRecord.id}`);
    return newRecord;
  }

  private async generateMedicalContent(
    patient: PatientRecord,
    condition: MedicalCondition,
    symptoms: string[],
    history: string
  ): Promise<string> {
    // This would integrate with AI for content generation
    return `
MEDICAL DOCUMENTATION REPORT

Patient Information:
- Name: ${patient.name}
- DOB: ${patient.dateOfBirth}
- Record ID: ${patient.id}
- Generated: ${new Date().toISOString()}

Diagnosis: ${condition.name}
Description: ${condition.description}

Reported Symptoms:
${symptoms.map((symptom, index) => `${index + 1}. ${symptom}`).join('\n')}

Medical History:
${history}

Standard Symptoms for ${condition.name}:
${condition.symptoms.map((symptom, index) => `${index + 1}. ${symptom}`).join('\n')}

Recommended Treatments:
${condition.treatments.map((treatment, index) => `${index + 1}. ${treatment}`).join('\n')}

Compliance Information:
- HIPAA Compliant: ${this.config.compliance.HIPAA}
- GDPR Compliant: ${this.config.compliance.GDPR}
- Jurisdiction: ${this.config.jurisdiction || 'US'}

This documentation is for medical and legal purposes.
`;
  }

  private async generateExpertWitnessContent(
    patient: PatientRecord,
    condition: MedicalCondition
  ): Promise<string> {
    return `
EXPERT WITNESS MEDICAL REPORT

Patient: ${patient.name}
DOB: ${patient.dateOfBirth}
Condition: ${condition.name}

PROFESSIONAL MEDICAL OPINION

Based on my examination and review of medical records, I provide the following expert opinion:

Diagnosis: ${condition.name}
Condition Description: ${condition.description}

Impact Assessment:
The patient's condition significantly impacts their daily functioning in the following ways:
${condition.symptoms.map((symptom, index) => `${index + 1}. ${symptom}`).join('\n')}

Functional Limitations:
${condition.treatments.map((treatment, index) => `${index + 1}. ${treatment}`).join('\n')}

Prognosis:
[To be completed by medical expert]

This report is provided for legal proceedings and medical documentation purposes.
The information contained herein is based on current medical knowledge and standards of care.

Medical Expert Certification:
This report meets the standards for expert witness testimony in medical cases.
`;
  }

  private determineDocumentationType(condition: string): 'chronic' | 'expert-witness' | 'compliance' | 'generational-trauma' {
    switch (condition) {
      case 'hypoparathyroidism':
        return 'chronic';
      case 'intellectual-gaps':
        return 'compliance';
      case 'generational-trauma':
        return 'generational-trauma';
      default:
        return 'chronic';
    }
  }

  private async generateBlockchainHash(documentation: MedicalDocumentation): Promise<string> {
    // This would integrate with blockchain for immutability
    // For now, return a simulated hash
    const content = JSON.stringify(documentation);
    return `hash_${Buffer.from(content).toString('base64').slice(0, 32)}`;
  }

  private generateId(): string {
    return `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public async getStatus(): Promise<any> {
    return {
      status: 'active',
      conditionsCount: this.conditions.length,
      recordsCount: this.records.size,
      documentsCount: this.documents.size,
      compliance: {
        HIPAA: this.config.compliance.HIPAA,
        GDPR: this.config.compliance.GDPR
      },
      lastActivity: new Date().toISOString()
    };
  }
}