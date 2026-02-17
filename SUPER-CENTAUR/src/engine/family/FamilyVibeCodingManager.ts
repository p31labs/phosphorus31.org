/**
 * Family Vibe Coding Manager
 * Family collaboration for vibe coding inside the game environment
 * with internal slicing and push straight to printer
 * 
 * "Family vibe coding inside the game environment with internal slicing and push straight to printer"
 */

import { VibeCodingManager, CodeProject, CodeExecution } from '../maker/VibeCodingManager';
import { SlicingEngine, SliceConfig, SlicedModel } from '../maker/SlicingEngine';
import { PrinterIntegration, PrintJob } from '../maker/PrinterIntegration';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child' | 'teen' | 'adult';
  permissions: {
    canEdit: boolean;
    canExecute: boolean;
    canSlice: boolean;
    canPrint: boolean;
  };
}

export interface FamilyCodingSession {
  id: string;
  name: string;
  hostId: string;
  members: FamilyMember[];
  projectId: string;
  isActive: boolean;
  createdAt: number;
  lastActivity: number;
}

export interface FamilySliceJob {
  id: string;
  sessionId: string;
  structureId: string;
  slicedModel: SlicedModel;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'slicing' | 'ready' | 'printing' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface FamilyPrintJob {
  id: string;
  sessionId: string;
  sliceJobId: string;
  printJob: PrintJob;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'printing' | 'completed' | 'cancelled';
  createdAt: number;
}

export class FamilyVibeCodingManager {
  private vibeCoding: VibeCodingManager;
  private slicingEngine: SlicingEngine;
  private printerIntegration: PrinterIntegration;
  private sessions: Map<string, FamilyCodingSession> = new Map();
  private sliceJobs: Map<string, FamilySliceJob> = new Map();
  private printJobs: Map<string, FamilyPrintJob> = new Map();
  private currentSessionId: string | null = null;
  private requireParentalApproval: boolean = true;

  constructor(
    vibeCoding: VibeCodingManager,
    slicingEngine: SlicingEngine,
    printerIntegration: PrinterIntegration
  ) {
    this.vibeCoding = vibeCoding;
    this.slicingEngine = slicingEngine;
    this.printerIntegration = printerIntegration;
  }

  /**
   * Initialize family vibe coding manager
   */
  public async init(): Promise<void> {
    console.log('👨‍👩‍👧‍👦 Family Vibe Coding Manager initialized');
  }

  /**
   * Create family coding session
   */
  public createSession(name: string, host: FamilyMember): FamilyCodingSession {
    const session: FamilyCodingSession = {
      id: `family_session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      hostId: host.id,
      members: [host],
      projectId: '',
      isActive: true,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    // Create shared project
    const project = this.vibeCoding.createProject(`${name} - Family Project`, 'javascript');
    session.projectId = project.id;

    this.sessions.set(session.id, session);
    this.currentSessionId = session.id;

    console.log(`👨‍👩‍👧‍👦 Family coding session created: ${session.name} (${session.id})`);
    return session;
  }

  /**
   * Join family coding session
   */
  public joinSession(sessionId: string, member: FamilyMember): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Check if member already in session
    if (session.members.some(m => m.id === member.id)) {
      return;
    }

    session.members.push(member);
    session.lastActivity = Date.now();

    // Emit join event
    window.dispatchEvent(new CustomEvent('familyvibecoding:memberJoined', {
      detail: { sessionId, member }
    }));

    console.log(`👨‍👩‍👧‍👦 ${member.name} joined session: ${session.name}`);
  }

  /**
   * Leave family coding session
   */
  public leaveSession(sessionId: string, memberId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    session.members = session.members.filter(m => m.id !== memberId);
    session.lastActivity = Date.now();

    // If host leaves, transfer to another member or end session
    if (session.hostId === memberId && session.members.length > 0) {
      session.hostId = session.members[0].id;
    }

    // End session if no members left
    if (session.members.length === 0) {
      session.isActive = false;
    }

    console.log(`👨‍👩‍👧‍👦 Member left session: ${sessionId}`);
  }

  /**
   * Update code in family session (with permissions)
   */
  public updateCode(sessionId: string, memberId: string, code: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const member = session.members.find(m => m.id === memberId);
    if (!member) {
      throw new Error(`Member ${memberId} not in session`);
    }

    if (!member.permissions.canEdit) {
      throw new Error(`Member ${memberId} does not have edit permission`);
    }

    // Update project code
    this.vibeCoding.updateProject(session.projectId, code);
    session.lastActivity = Date.now();

    // Emit code update event for real-time sync
    window.dispatchEvent(new CustomEvent('familyvibecoding:codeUpdated', {
      detail: { sessionId, memberId, code, timestamp: Date.now() }
    }));

    console.log(`👨‍👩‍👧‍👦 Code updated by ${member.name} in session: ${session.name}`);
  }

  /**
   * Execute code in family session (with permissions)
   */
  public async executeCode(sessionId: string, memberId: string): Promise<CodeExecution> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const member = session.members.find(m => m.id === memberId);
    if (!member) {
      throw new Error(`Member ${memberId} not in session`);
    }

    if (!member.permissions.canExecute) {
      throw new Error(`Member ${memberId} does not have execute permission`);
    }

    const execution = await this.vibeCoding.executeCode(session.projectId);
    session.lastActivity = Date.now();

    // Emit execution event
    window.dispatchEvent(new CustomEvent('familyvibecoding:codeExecuted', {
      detail: { sessionId, memberId, execution }
    }));

    return execution;
  }

  /**
   * Request slice (with parental approval if needed)
   */
  public async requestSlice(
    sessionId: string,
    memberId: string,
    geometry: any,
    sliceConfig?: Partial<SliceConfig>
  ): Promise<FamilySliceJob> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const member = session.members.find(m => m.id === memberId);
    if (!member) {
      throw new Error(`Member ${memberId} not in session`);
    }

    if (!member.permissions.canSlice) {
      throw new Error(`Member ${memberId} does not have slice permission`);
    }

    // Check if parental approval needed
    const needsApproval = this.requireParentalApproval && 
                          (member.role === 'child' || member.role === 'teen');

    // Slice immediately if no approval needed
    if (!needsApproval) {
      return await this.sliceModel(sessionId, memberId, geometry, sliceConfig);
    }

    // Create pending slice job
    const sliceJob: FamilySliceJob = {
      id: `slice_job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sessionId,
      structureId: 'current',
      slicedModel: null as any, // Will be set after approval
      requestedBy: memberId,
      status: 'pending',
      createdAt: Date.now()
    };

    // Store geometry for later slicing
    (sliceJob as any).geometry = geometry;
    (sliceJob as any).sliceConfig = sliceConfig;

    this.sliceJobs.set(sliceJob.id, sliceJob);

    // Request parental approval
    window.dispatchEvent(new CustomEvent('familyvibecoding:sliceRequested', {
      detail: { sliceJob, member }
    }));

    console.log(`👨‍👩‍👧‍👦 Slice requested by ${member.name} (pending approval)`);
    return sliceJob;
  }

  /**
   * Approve slice job
   */
  public async approveSlice(sliceJobId: string, approverId: string): Promise<FamilySliceJob> {
    const sliceJob = this.sliceJobs.get(sliceJobId);
    if (!sliceJob) {
      throw new Error(`Slice job ${sliceJobId} not found`);
    }

    const session = this.sessions.get(sliceJob.sessionId);
    if (!session) {
      throw new Error(`Session ${sliceJob.sessionId} not found`);
    }

    const approver = session.members.find(m => m.id === approverId);
    if (!approver || (approver.role !== 'parent' && approver.role !== 'adult')) {
      throw new Error(`Only parents/adults can approve slice jobs`);
    }

    // Perform slicing
    const geometry = (sliceJob as any).geometry;
    const sliceConfig = (sliceJob as any).sliceConfig;

    sliceJob.status = 'slicing';
    const slicedModel = await this.slicingEngine.sliceModel(geometry, sliceConfig);
    
    sliceJob.slicedModel = slicedModel;
    sliceJob.approvedBy = approverId;
    sliceJob.status = 'ready';

    // Emit approval event
    window.dispatchEvent(new CustomEvent('familyvibecoding:sliceApproved', {
      detail: { sliceJob }
    }));

    console.log(`👨‍👩‍👧‍👦 Slice approved by ${approver.name}`);
    return sliceJob;
  }

  /**
   * Slice model directly (no approval needed)
   */
  private async sliceModel(
    sessionId: string,
    memberId: string,
    geometry: any,
    sliceConfig?: Partial<SliceConfig>
  ): Promise<FamilySliceJob> {
    const slicedModel = await this.slicingEngine.sliceModel(geometry, sliceConfig);

    const sliceJob: FamilySliceJob = {
      id: `slice_job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sessionId,
      structureId: 'current',
      slicedModel,
      requestedBy: memberId,
      status: 'ready',
      createdAt: Date.now()
    };

    this.sliceJobs.set(sliceJob.id, sliceJob);
    return sliceJob;
  }

  /**
   * Request print (with parental approval if needed)
   */
  public async requestPrint(
    sessionId: string,
    memberId: string,
    sliceJobId: string,
    printerId?: string
  ): Promise<FamilyPrintJob> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const sliceJob = this.sliceJobs.get(sliceJobId);
    if (!sliceJob || sliceJob.status !== 'ready') {
      throw new Error(`Slice job ${sliceJobId} not ready`);
    }

    const member = session.members.find(m => m.id === memberId);
    if (!member) {
      throw new Error(`Member ${memberId} not in session`);
    }

    if (!member.permissions.canPrint) {
      throw new Error(`Member ${memberId} does not have print permission`);
    }

    // Check if parental approval needed
    const needsApproval = this.requireParentalApproval && 
                          (member.role === 'child' || member.role === 'teen');

    // Print immediately if no approval needed
    if (!needsApproval) {
      return await this.printModel(sessionId, memberId, sliceJobId, printerId);
    }

    // Create pending print job
    const printJob: FamilyPrintJob = {
      id: `print_job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sessionId,
      sliceJobId,
      printJob: null as any, // Will be set after approval
      requestedBy: memberId,
      status: 'pending',
      createdAt: Date.now()
    };

    (printJob as any).printerId = printerId;

    this.printJobs.set(printJob.id, printJob);

    // Request parental approval
    window.dispatchEvent(new CustomEvent('familyvibecoding:printRequested', {
      detail: { printJob, member, sliceJob }
    }));

    console.log(`👨‍👩‍👧‍👦 Print requested by ${member.name} (pending approval)`);
    return printJob;
  }

  /**
   * Approve print job
   */
  public async approvePrint(printJobId: string, approverId: string): Promise<FamilyPrintJob> {
    const printJob = this.printJobs.get(printJobId);
    if (!printJob) {
      throw new Error(`Print job ${printJobId} not found`);
    }

    const session = this.sessions.get(printJob.sessionId);
    if (!session) {
      throw new Error(`Session ${printJob.sessionId} not found`);
    }

    const approver = session.members.find(m => m.id === approverId);
    if (!approver || (approver.role !== 'parent' && approver.role !== 'adult')) {
      throw new Error(`Only parents/adults can approve print jobs`);
    }

    const sliceJob = this.sliceJobs.get(printJob.sliceJobId);
    if (!sliceJob) {
      throw new Error(`Slice job ${printJob.sliceJobId} not found`);
    }

    // Generate G-code and print
    const gcode = this.slicingEngine.exportToGCode(sliceJob.slicedModel);
    const printerId = (printJob as any).printerId;
    const actualPrintJob = await this.printerIntegration.printGCode(gcode, printerId);

    printJob.printJob = actualPrintJob;
    printJob.approvedBy = approverId;
    printJob.status = 'printing';

    // Emit approval event
    window.dispatchEvent(new CustomEvent('familyvibecoding:printApproved', {
      detail: { printJob }
    }));

    console.log(`👨‍👩‍👧‍👦 Print approved by ${approver.name}, printing started`);
    return printJob;
  }

  /**
   * Print model directly (no approval needed)
   */
  private async printModel(
    sessionId: string,
    memberId: string,
    sliceJobId: string,
    printerId?: string
  ): Promise<FamilyPrintJob> {
    const sliceJob = this.sliceJobs.get(sliceJobId);
    if (!sliceJob) {
      throw new Error(`Slice job ${sliceJobId} not found`);
    }

    const gcode = this.slicingEngine.exportToGCode(sliceJob.slicedModel);
    const actualPrintJob = await this.printerIntegration.printGCode(gcode, printerId);

    const printJob: FamilyPrintJob = {
      id: `print_job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sessionId,
      sliceJobId,
      printJob: actualPrintJob,
      requestedBy: memberId,
      status: 'printing',
      createdAt: Date.now()
    };

    this.printJobs.set(printJob.id, printJob);
    return printJob;
  }

  /**
   * Complete workflow: Code → Execute → Slice → Print
   */
  public async codeToPrint(
    sessionId: string,
    memberId: string,
    code: string,
    geometry: any,
    sliceConfig?: Partial<SliceConfig>,
    printerId?: string
  ): Promise<{
    execution: CodeExecution;
    sliceJob: FamilySliceJob;
    printJob: FamilyPrintJob;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Step 1: Update and execute code
    this.updateCode(sessionId, memberId, code);
    const execution = await this.executeCode(sessionId, memberId);

    if (execution.error) {
      throw new Error(`Code execution failed: ${execution.error}`);
    }

    // Step 2: Request slice
    const sliceJob = await this.requestSlice(sessionId, memberId, geometry, sliceConfig);

    // Step 3: If slice needs approval, wait for it
    if (sliceJob.status === 'pending') {
      // Wait for approval (in production, use proper async waiting)
      throw new Error('Slice requires parental approval. Please approve first.');
    }

    // Step 4: Request print
    const printJob = await this.requestPrint(sessionId, memberId, sliceJob.id, printerId);

    // Step 5: If print needs approval, wait for it
    if (printJob.status === 'pending') {
      throw new Error('Print requires parental approval. Please approve first.');
    }

    console.log(`👨‍👩‍👧‍👦 Family Code → Print complete!`);
    console.log(`   Session: ${session.name}`);
    console.log(`   Execution: ${execution.id}`);
    console.log(`   Slice: ${sliceJob.id}`);
    console.log(`   Print: ${printJob.id}`);

    return { execution, sliceJob, printJob };
  }

  /**
   * Get current session
   */
  public getCurrentSession(): FamilyCodingSession | null {
    return this.currentSessionId ? this.sessions.get(this.currentSessionId) || null : null;
  }

  /**
   * Get session
   */
  public getSession(sessionId: string): FamilyCodingSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get all sessions
   */
  public getSessions(): FamilyCodingSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get slice jobs for session
   */
  public getSliceJobs(sessionId: string): FamilySliceJob[] {
    return Array.from(this.sliceJobs.values())
      .filter(job => job.sessionId === sessionId);
  }

  /**
   * Get print jobs for session
   */
  public getPrintJobs(sessionId: string): FamilyPrintJob[] {
    return Array.from(this.printJobs.values())
      .filter(job => job.sessionId === sessionId);
  }

  /**
   * Set require parental approval
   */
  public setRequireParentalApproval(require: boolean): void {
    this.requireParentalApproval = require;
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.sessions.clear();
    this.sliceJobs.clear();
    this.printJobs.clear();
    this.currentSessionId = null;
  }
}
