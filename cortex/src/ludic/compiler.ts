/**
 * OMEGA PROTOCOL - MODULE F: LUDIC GOVERNANCE
 * ============================================
 * Ricardian contracts as game mechanics
 * 
 * Implements:
 * - Contracts as game objects (visual nodes)
 * - Triple compilation: Legal prose + Smart contract + Game logic
 * - Kleros-style decentralized arbitration
 * - Reputation-weighted jury selection
 * 
 * "Code is Law, Law is Code"
 */

import { EventEmitter } from 'eventemitter3';

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface RicardianContract {
  id: string;
  title: string;
  version: number;
  
  // Parties
  parties: ContractParty[];
  
  // Content
  clauses: ContractClause[];
  
  // Signatures
  signatures: ContractSignature[];
  
  // State
  state: ContractState;
  
  // Hashes
  legalHash: string;
  codeHash: string;
  gameHash: string;
  
  // Timestamps
  created: number;
  executed?: number;
  expires?: number;
}

export interface ContractParty {
  id: string;
  did: string;           // Decentralized identifier
  role: string;          // e.g., "parent", "child", "guardian"
  publicKey: Uint8Array;
}

export interface ContractClause {
  id: string;
  type: ClauseType;
  description: string;   // Human-readable
  logic: ClauseLogic;    // Machine-readable
  weight: number;        // Importance for disputes (0-1)
}

export type ClauseType = 
  | 'transfer'           // Asset transfer
  | 'condition'          // If-then logic
  | 'escrow'             // Held funds
  | 'recurring'          // Periodic obligation
  | 'penalty'            // Breach consequences
  | 'termination';       // Exit conditions

export interface ClauseLogic {
  trigger: LogicCondition;
  action: LogicAction;
  parties: string[];     // IDs of affected parties
}

export interface LogicCondition {
  type: 'time' | 'event' | 'value' | 'signature' | 'oracle';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains';
  value: unknown;
  source?: string;       // Oracle address or event name
}

export interface LogicAction {
  type: 'transfer' | 'unlock' | 'lock' | 'notify' | 'slash' | 'reward';
  asset?: string;
  amount?: number;
  recipient?: string;
  metadata?: Record<string, unknown>;
}

export interface ContractSignature {
  partyId: string;
  signature: Uint8Array;
  timestamp: number;
  deviceKey?: string;    // Hardware attestation
}

export type ContractState = 
  | 'draft'
  | 'pending-signatures'
  | 'active'
  | 'disputed'
  | 'resolved'
  | 'completed'
  | 'terminated';

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE TEMPLATES (Visual Building Blocks)
// ─────────────────────────────────────────────────────────────────────────────

export interface ClauseTemplate {
  id: string;
  name: string;
  description: string;
  type: ClauseType;
  parameters: TemplateParameter[];
  legalTemplate: string;  // Markdown with {{placeholders}}
  codeTemplate: string;   // Solidity/GDScript with {{placeholders}}
}

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'address' | 'date' | 'asset';
  required: boolean;
  default?: unknown;
  validation?: string;   // Regex or range
}

export const DEFAULT_TEMPLATES: ClauseTemplate[] = [
  {
    id: 'transfer-asset',
    name: 'Transfer Asset',
    description: 'Transfer ownership of an asset from one party to another',
    type: 'transfer',
    parameters: [
      { name: 'asset', type: 'asset', required: true },
      { name: 'from', type: 'address', required: true },
      { name: 'to', type: 'address', required: true },
      { name: 'amount', type: 'number', required: true, default: 1 }
    ],
    legalTemplate: `The party identified as "{{from}}" hereby transfers {{amount}} unit(s) of "{{asset}}" to the party identified as "{{to}}", effective upon execution of this agreement.`,
    codeTemplate: `transfer({{from}}, {{to}}, {{asset}}, {{amount}});`
  },
  {
    id: 'escrow-funds',
    name: 'Escrow Funds',
    description: 'Hold funds until a condition is met',
    type: 'escrow',
    parameters: [
      { name: 'amount', type: 'number', required: true },
      { name: 'asset', type: 'asset', required: true },
      { name: 'depositor', type: 'address', required: true },
      { name: 'releaseCondition', type: 'string', required: true },
      { name: 'timeout', type: 'date', required: false }
    ],
    legalTemplate: `{{depositor}} shall deposit {{amount}} {{asset}} in escrow, to be released upon satisfaction of the following condition: {{releaseCondition}}. {{#timeout}}If unreleased by {{timeout}}, funds shall be returned to depositor.{{/timeout}}`,
    codeTemplate: `escrow.deposit({{depositor}}, {{amount}}, {{asset}}, "{{releaseCondition}}", {{timeout}});`
  },
  {
    id: 'weekly-allowance',
    name: 'Weekly Allowance',
    description: 'Recurring payment from parent to child',
    type: 'recurring',
    parameters: [
      { name: 'parent', type: 'address', required: true },
      { name: 'child', type: 'address', required: true },
      { name: 'amount', type: 'number', required: true },
      { name: 'dayOfWeek', type: 'number', required: true, default: 0 }
    ],
    legalTemplate: `{{parent}} agrees to pay {{child}} an allowance of {{amount}} LOVE tokens weekly, disbursed every {{dayOfWeek}}.`,
    codeTemplate: `schedule.recurring({{parent}}, {{child}}, {{amount}}, WEEKLY, {{dayOfWeek}});`
  },
  {
    id: 'care-reward',
    name: 'Care Reward',
    description: 'Reward for verified care provision',
    type: 'condition',
    parameters: [
      { name: 'caregiver', type: 'address', required: true },
      { name: 'rewardAmount', type: 'number', required: true },
      { name: 'hoursRequired', type: 'number', required: true }
    ],
    legalTemplate: `Upon verification of {{hoursRequired}} hours of care provision by {{caregiver}} (as attested by Proof of Care credential), {{caregiver}} shall receive {{rewardAmount}} LOVE tokens.`,
    codeTemplate: `if (proofOfCare.verify({{caregiver}}, {{hoursRequired}})) { reward({{caregiver}}, {{rewardAmount}}); }`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACT COMPILER
// ─────────────────────────────────────────────────────────────────────────────

export interface CompiledContract {
  legal: string;         // Markdown document
  smartContract: string; // Solidity code
  gameLogic: string;     // GDScript
  metadata: ContractMetadata;
}

export interface ContractMetadata {
  legalHash: string;
  codeHash: string;
  gameHash: string;
  version: string;
  jurisdiction?: string;
}

export class ContractCompiler extends EventEmitter {
  private templates: Map<string, ClauseTemplate> = new Map();

  constructor() {
    super();
    DEFAULT_TEMPLATES.forEach(t => this.templates.set(t.id, t));
  }

  /**
   * Compile a contract to all three formats
   */
  compile(contract: RicardianContract): CompiledContract {
    const legal = this.compileLegal(contract);
    const smartContract = this.compileSmartContract(contract);
    const gameLogic = this.compileGameLogic(contract);

    const metadata: ContractMetadata = {
      legalHash: this.hash(legal),
      codeHash: this.hash(smartContract),
      gameHash: this.hash(gameLogic),
      version: `${contract.version}.0.0`
    };

    this.emit('contract:compiled', { id: contract.id, metadata });

    return { legal, smartContract, gameLogic, metadata };
  }

  /**
   * Compile to legal prose (Markdown)
   */
  private compileLegal(contract: RicardianContract): string {
    let doc = `# ${contract.title}\n\n`;
    doc += `**Contract ID:** ${contract.id}\n`;
    doc += `**Version:** ${contract.version}\n`;
    doc += `**Date:** ${new Date(contract.created).toISOString().split('T')[0]}\n\n`;

    doc += `## Parties\n\n`;
    for (const party of contract.parties) {
      doc += `- **${party.role}**: ${party.did}\n`;
    }
    doc += `\n`;

    doc += `## Terms and Conditions\n\n`;
    for (let i = 0; i < contract.clauses.length; i++) {
      const clause = contract.clauses[i];
      const template = this.templates.get(clause.type);
      doc += `### ${i + 1}. ${clause.description}\n\n`;
      
      if (template) {
        doc += this.renderTemplate(template.legalTemplate, clause.logic) + '\n\n';
      } else {
        doc += `${clause.description}\n\n`;
      }
    }

    doc += `## Signatures\n\n`;
    for (const sig of contract.signatures) {
      const party = contract.parties.find(p => p.id === sig.partyId);
      doc += `- **${party?.role || sig.partyId}**: Signed on ${new Date(sig.timestamp).toISOString()}\n`;
    }

    doc += `\n---\n`;
    doc += `*This is a machine-readable Ricardian Contract. Hash: {{CONTRACT_HASH}}*\n`;

    return doc;
  }

  /**
   * Compile to smart contract (Solidity)
   */
  private compileSmartContract(contract: RicardianContract): string {
    let code = `// SPDX-License-Identifier: Apache-2.0\n`;
    code += `pragma solidity ^0.8.20;\n\n`;
    code += `/**\n * @title ${contract.title}\n`;
    code += ` * @notice Auto-generated from Ricardian Contract ${contract.id}\n */\n\n`;

    code += `contract Contract_${contract.id.replace(/-/g, '_')} {\n`;
    code += `    // Parties\n`;
    
    for (const party of contract.parties) {
      code += `    address public ${party.role.replace(/\s/g, '_')};\n`;
    }
    code += `\n`;

    code += `    // State\n`;
    code += `    enum State { Draft, Active, Disputed, Completed, Terminated }\n`;
    code += `    State public state = State.Draft;\n\n`;

    code += `    // Events\n`;
    code += `    event ContractActivated(uint256 timestamp);\n`;
    code += `    event ClauseExecuted(uint256 clauseIndex);\n`;
    code += `    event ContractDisputed(address disputant);\n\n`;

    code += `    constructor(`;
    code += contract.parties.map(p => `address _${p.role.replace(/\s/g, '_')}`).join(', ');
    code += `) {\n`;
    for (const party of contract.parties) {
      code += `        ${party.role.replace(/\s/g, '_')} = _${party.role.replace(/\s/g, '_')};\n`;
    }
    code += `    }\n\n`;

    // Generate clause functions
    for (let i = 0; i < contract.clauses.length; i++) {
      const clause = contract.clauses[i];
      code += `    // Clause ${i + 1}: ${clause.description}\n`;
      code += `    function executeClause${i}() external {\n`;
      code += `        require(state == State.Active, "Contract not active");\n`;
      code += `        // ${clause.logic.action.type} logic\n`;
      code += `        emit ClauseExecuted(${i});\n`;
      code += `    }\n\n`;
    }

    code += `    function activate() external {\n`;
    code += `        require(state == State.Draft, "Already activated");\n`;
    code += `        state = State.Active;\n`;
    code += `        emit ContractActivated(block.timestamp);\n`;
    code += `    }\n\n`;

    code += `    function dispute() external {\n`;
    code += `        state = State.Disputed;\n`;
    code += `        emit ContractDisputed(msg.sender);\n`;
    code += `    }\n`;

    code += `}\n`;

    return code;
  }

  /**
   * Compile to game logic (GDScript for Godot)
   */
  private compileGameLogic(contract: RicardianContract): string {
    let code = `# Auto-generated from Ricardian Contract ${contract.id}\n`;
    code += `extends Node\n`;
    code += `class_name Contract_${contract.id.replace(/-/g, '_')}\n\n`;

    code += `# Signals\n`;
    code += `signal contract_activated\n`;
    code += `signal clause_executed(clause_index: int)\n`;
    code += `signal contract_disputed(disputant: String)\n\n`;

    code += `# State\n`;
    code += `enum State { DRAFT, ACTIVE, DISPUTED, COMPLETED, TERMINATED }\n`;
    code += `var state: State = State.DRAFT\n\n`;

    code += `# Parties\n`;
    for (const party of contract.parties) {
      code += `var ${party.role.replace(/\s/g, '_')}: String = "${party.did}"\n`;
    }
    code += `\n`;

    code += `# Visual representation\n`;
    code += `@export var contract_visual: Node3D\n`;
    code += `@export var seal_effect: GPUParticles3D\n\n`;

    code += `func _ready():\n`;
    code += `\tpass\n\n`;

    code += `func activate() -> bool:\n`;
    code += `\tif state != State.DRAFT:\n`;
    code += `\t\treturn false\n`;
    code += `\tstate = State.ACTIVE\n`;
    code += `\t# Play seal animation\n`;
    code += `\tif seal_effect:\n`;
    code += `\t\tseal_effect.emitting = true\n`;
    code += `\tcontract_activated.emit()\n`;
    code += `\treturn true\n\n`;

    // Generate clause methods
    for (let i = 0; i < contract.clauses.length; i++) {
      const clause = contract.clauses[i];
      code += `# Clause ${i}: ${clause.description}\n`;
      code += `func execute_clause_${i}() -> bool:\n`;
      code += `\tif state != State.ACTIVE:\n`;
      code += `\t\treturn false\n`;
      
      // Generate action-specific code
      switch (clause.logic.action.type) {
        case 'transfer':
          code += `\t# Transfer ${clause.logic.action.asset}\n`;
          code += `\tGameEconomy.transfer("${clause.logic.action.asset}", ${clause.logic.action.amount})\n`;
          break;
        case 'unlock':
          code += `\t# Unlock game element\n`;
          code += `\tif contract_visual:\n`;
          code += `\t\tcontract_visual.get_node("Lock").visible = false\n`;
          break;
        case 'lock':
          code += `\t# Lock game element\n`;
          code += `\tif contract_visual:\n`;
          code += `\t\tcontract_visual.get_node("Lock").visible = true\n`;
          break;
      }
      
      code += `\tclause_executed.emit(${i})\n`;
      code += `\treturn true\n\n`;
    }

    code += `func dispute(disputant: String):\n`;
    code += `\tstate = State.DISPUTED\n`;
    code += `\t# Visual feedback\n`;
    code += `\tif contract_visual:\n`;
    code += `\t\tvar tween = create_tween()\n`;
    code += `\t\ttween.tween_property(contract_visual, "modulate", Color.RED, 0.5)\n`;
    code += `\tcontract_disputed.emit(disputant)\n`;

    return code;
  }

  private renderTemplate(template: string, logic: ClauseLogic): string {
    let result = template;
    
    // Replace action parameters
    if (logic.action.amount) {
      result = result.replace(/\{\{amount\}\}/g, String(logic.action.amount));
    }
    if (logic.action.asset) {
      result = result.replace(/\{\{asset\}\}/g, logic.action.asset);
    }
    if (logic.action.recipient) {
      result = result.replace(/\{\{to\}\}/g, logic.action.recipient);
    }
    
    // Replace condition value
    if (logic.trigger.value) {
      result = result.replace(/\{\{value\}\}/g, String(logic.trigger.value));
    }

    return result;
  }

  private hash(content: string): string {
    // Simple hash for demo (use SHA-256 in production)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  addTemplate(template: ClauseTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): ClauseTemplate | undefined {
    return this.templates.get(id);
  }

  getTemplates(): ClauseTemplate[] {
    return Array.from(this.templates.values());
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPUTE RESOLUTION (Kleros-style)
// ─────────────────────────────────────────────────────────────────────────────

export interface Dispute {
  id: string;
  contractId: string;
  plaintiffId: string;
  defendantId: string;
  clauseIndex: number;
  description: string;
  evidence: Evidence[];
  jurors: Juror[];
  votes: JurorVote[];
  state: DisputeState;
  verdict?: Verdict;
  created: number;
  deadline: number;
}

export type DisputeState = 
  | 'filing'
  | 'evidence'
  | 'jury-selection'
  | 'voting'
  | 'appeal'
  | 'resolved';

export interface Evidence {
  id: string;
  submittedBy: string;
  type: 'document' | 'proof' | 'testimony' | 'log';
  contentHash: string;
  zkProof?: Uint8Array;  // Privacy-preserving evidence
  timestamp: number;
}

export interface Juror {
  id: string;
  did: string;
  reputation: number;
  stake: number;
  selected: boolean;
}

export interface JurorVote {
  jurorId: string;
  vote: 'plaintiff' | 'defendant' | 'split';
  commitment: Uint8Array;  // Hidden until reveal
  revealed: boolean;
  timestamp?: number;
}

export interface Verdict {
  winner: 'plaintiff' | 'defendant' | 'split';
  damages?: number;
  actions: VerdictAction[];
  reasoning: string;
}

export interface VerdictAction {
  type: 'transfer' | 'slash' | 'restore' | 'terminate';
  target: string;
  amount?: number;
  asset?: string;
}

export class DisputeResolution extends EventEmitter {
  private disputes: Map<string, Dispute> = new Map();
  private jurorPool: Juror[] = [];
  private readonly JURY_SIZE = 3;
  private readonly MIN_STAKE = 100;

  /**
   * File a new dispute
   */
  fileDispute(
    contractId: string,
    plaintiffId: string,
    defendantId: string,
    clauseIndex: number,
    description: string
  ): Dispute {
    const dispute: Dispute = {
      id: crypto.randomUUID(),
      contractId,
      plaintiffId,
      defendantId,
      clauseIndex,
      description,
      evidence: [],
      jurors: [],
      votes: [],
      state: 'filing',
      created: Date.now(),
      deadline: Date.now() + 7 * 24 * 60 * 60 * 1000  // 7 days
    };

    this.disputes.set(dispute.id, dispute);
    this.emit('dispute:filed', dispute);

    return dispute;
  }

  /**
   * Submit evidence
   */
  submitEvidence(
    disputeId: string,
    submittedBy: string,
    type: Evidence['type'],
    contentHash: string,
    zkProof?: Uint8Array
  ): Evidence {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');
    if (dispute.state !== 'filing' && dispute.state !== 'evidence') {
      throw new Error('Evidence period closed');
    }

    const evidence: Evidence = {
      id: crypto.randomUUID(),
      submittedBy,
      type,
      contentHash,
      zkProof,
      timestamp: Date.now()
    };

    dispute.evidence.push(evidence);
    dispute.state = 'evidence';
    
    this.emit('evidence:submitted', { disputeId, evidence });
    return evidence;
  }

  /**
   * Add juror to pool
   */
  addJurorToPool(id: string, did: string, reputation: number, stake: number): void {
    if (stake < this.MIN_STAKE) {
      throw new Error(`Minimum stake is ${this.MIN_STAKE}`);
    }

    this.jurorPool.push({
      id,
      did,
      reputation,
      stake,
      selected: false
    });
  }

  /**
   * Select jury using reputation-weighted random selection
   */
  selectJury(disputeId: string): Juror[] {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    // Filter eligible jurors (not parties to dispute)
    const eligible = this.jurorPool.filter(j => 
      j.id !== dispute.plaintiffId && 
      j.id !== dispute.defendantId &&
      !j.selected
    );

    if (eligible.length < this.JURY_SIZE) {
      throw new Error('Insufficient jurors in pool');
    }

    // Reputation-weighted selection
    const totalWeight = eligible.reduce((sum, j) => sum + j.reputation * j.stake, 0);
    const selected: Juror[] = [];

    while (selected.length < this.JURY_SIZE) {
      let random = Math.random() * totalWeight;
      
      for (const juror of eligible) {
        if (selected.includes(juror)) continue;
        
        random -= juror.reputation * juror.stake;
        if (random <= 0) {
          juror.selected = true;
          selected.push(juror);
          break;
        }
      }
    }

    dispute.jurors = selected;
    dispute.state = 'jury-selection';
    
    this.emit('jury:selected', { disputeId, jurors: selected });
    return selected;
  }

  /**
   * Cast a vote (commitment phase)
   */
  castVote(
    disputeId: string,
    jurorId: string,
    vote: JurorVote['vote'],
    randomness: Uint8Array
  ): JurorVote {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');
    
    const juror = dispute.jurors.find(j => j.id === jurorId);
    if (!juror) throw new Error('Juror not on this case');

    // Create commitment (hide vote)
    const commitment = this.createCommitment(vote, randomness);

    const jurorVote: JurorVote = {
      jurorId,
      vote,
      commitment,
      revealed: false
    };

    // Remove any existing vote
    dispute.votes = dispute.votes.filter(v => v.jurorId !== jurorId);
    dispute.votes.push(jurorVote);

    if (dispute.votes.length === dispute.jurors.length) {
      dispute.state = 'voting';
    }

    this.emit('vote:cast', { disputeId, jurorId });
    return jurorVote;
  }

  /**
   * Reveal vote
   */
  revealVote(
    disputeId: string,
    jurorId: string,
    vote: JurorVote['vote'],
    randomness: Uint8Array
  ): boolean {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    const jurorVote = dispute.votes.find(v => v.jurorId === jurorId);
    if (!jurorVote) throw new Error('Vote not found');

    // Verify commitment
    const expectedCommitment = this.createCommitment(vote, randomness);
    if (!this.compareBytes(expectedCommitment, jurorVote.commitment)) {
      throw new Error('Vote does not match commitment');
    }

    jurorVote.revealed = true;
    jurorVote.vote = vote;
    jurorVote.timestamp = Date.now();

    // Check if all votes revealed
    const allRevealed = dispute.votes.every(v => v.revealed);
    if (allRevealed) {
      this.tallyVotes(disputeId);
    }

    this.emit('vote:revealed', { disputeId, jurorId, vote });
    return true;
  }

  /**
   * Tally votes and determine verdict
   */
  private tallyVotes(disputeId: string): Verdict {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    const tally = { plaintiff: 0, defendant: 0, split: 0 };
    
    for (const vote of dispute.votes) {
      if (vote.revealed) {
        tally[vote.vote]++;
      }
    }

    let winner: Verdict['winner'];
    if (tally.plaintiff > tally.defendant) {
      winner = 'plaintiff';
    } else if (tally.defendant > tally.plaintiff) {
      winner = 'defendant';
    } else {
      winner = 'split';
    }

    const verdict: Verdict = {
      winner,
      actions: this.determineActions(dispute, winner),
      reasoning: `Verdict reached by ${this.JURY_SIZE}-member jury. Vote: ${tally.plaintiff} for plaintiff, ${tally.defendant} for defendant, ${tally.split} split.`
    };

    dispute.verdict = verdict;
    dispute.state = 'resolved';

    // Reward/slash jurors based on majority alignment
    this.processJurorStakes(dispute, winner);

    this.emit('verdict:reached', { disputeId, verdict });
    return verdict;
  }

  private determineActions(dispute: Dispute, winner: Verdict['winner']): VerdictAction[] {
    const actions: VerdictAction[] = [];

    if (winner === 'plaintiff') {
      actions.push({
        type: 'restore',
        target: dispute.plaintiffId
      });
    } else if (winner === 'defendant') {
      actions.push({
        type: 'slash',
        target: dispute.plaintiffId,
        amount: 10  // Frivolous claim penalty
      });
    }

    return actions;
  }

  private processJurorStakes(dispute: Dispute, winner: Verdict['winner']): void {
    for (const vote of dispute.votes) {
      const juror = this.jurorPool.find(j => j.id === vote.jurorId);
      if (!juror) continue;

      if (vote.vote === winner || winner === 'split') {
        // Reward for voting with majority
        juror.reputation += 0.01;
        juror.stake += 5;
      } else {
        // Slash for voting against majority
        juror.reputation = Math.max(0, juror.reputation - 0.02);
        juror.stake = Math.max(0, juror.stake - 10);
      }

      juror.selected = false;
    }
  }

  private createCommitment(vote: string, randomness: Uint8Array): Uint8Array {
    const data = new TextEncoder().encode(`${vote}:${this.bytesToHex(randomness)}`);
    // Simple hash (use SHA-256 in production)
    const hash = new Uint8Array(32);
    for (let i = 0; i < data.length; i++) {
      hash[i % 32] ^= data[i];
    }
    return hash;
  }

  private compareBytes(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  getDispute(id: string): Dispute | undefined {
    return this.disputes.get(id);
  }

  getDisputes(): Dispute[] {
    return Array.from(this.disputes.values());
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LUDIC GOVERNANCE (Main Interface)
// ─────────────────────────────────────────────────────────────────────────────

export class LudicGovernance extends EventEmitter {
  private compiler: ContractCompiler;
  private resolution: DisputeResolution;
  private contracts: Map<string, RicardianContract> = new Map();

  constructor() {
    super();
    this.compiler = new ContractCompiler();
    this.resolution = new DisputeResolution();

    // Wire events
    this.compiler.on('contract:compiled', (data) => this.emit('contract:compiled', data));
    this.resolution.on('dispute:filed', (d) => this.emit('dispute:filed', d));
    this.resolution.on('verdict:reached', (v) => this.emit('verdict:reached', v));
  }

  /**
   * Create a new contract
   */
  createContract(title: string, parties: ContractParty[]): RicardianContract {
    const contract: RicardianContract = {
      id: crypto.randomUUID(),
      title,
      version: 1,
      parties,
      clauses: [],
      signatures: [],
      state: 'draft',
      legalHash: '',
      codeHash: '',
      gameHash: '',
      created: Date.now()
    };

    this.contracts.set(contract.id, contract);
    return contract;
  }

  /**
   * Add clause to contract
   */
  addClause(contractId: string, clause: ContractClause): void {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');
    if (contract.state !== 'draft') throw new Error('Contract not in draft state');

    contract.clauses.push(clause);
  }

  /**
   * Sign contract
   */
  signContract(
    contractId: string,
    partyId: string,
    signature: Uint8Array,
    deviceKey?: string
  ): void {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const party = contract.parties.find(p => p.id === partyId);
    if (!party) throw new Error('Party not found in contract');

    const existingSig = contract.signatures.find(s => s.partyId === partyId);
    if (existingSig) throw new Error('Party already signed');

    contract.signatures.push({
      partyId,
      signature,
      timestamp: Date.now(),
      deviceKey
    });

    if (contract.state === 'draft') {
      contract.state = 'pending-signatures';
    }

    // Check if all parties signed
    if (contract.signatures.length === contract.parties.length) {
      this.activateContract(contractId);
    }
  }

  /**
   * Activate contract (all parties signed)
   */
  private activateContract(contractId: string): void {
    const contract = this.contracts.get(contractId);
    if (!contract) return;

    // Compile
    const compiled = this.compiler.compile(contract);
    
    contract.legalHash = compiled.metadata.legalHash;
    contract.codeHash = compiled.metadata.codeHash;
    contract.gameHash = compiled.metadata.gameHash;
    contract.state = 'active';

    this.emit('contract:activated', { contractId, compiled });
  }

  /**
   * File dispute on contract
   */
  fileDispute(
    contractId: string,
    plaintiffId: string,
    defendantId: string,
    clauseIndex: number,
    description: string
  ): Dispute {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');
    
    contract.state = 'disputed';
    
    return this.resolution.fileDispute(
      contractId,
      plaintiffId,
      defendantId,
      clauseIndex,
      description
    );
  }

  getCompiler(): ContractCompiler {
    return this.compiler;
  }

  getResolution(): DisputeResolution {
    return this.resolution;
  }

  getContract(id: string): RicardianContract | undefined {
    return this.contracts.get(id);
  }

  getContracts(): RicardianContract[] {
    return Array.from(this.contracts.values());
  }
}

export default LudicGovernance;
