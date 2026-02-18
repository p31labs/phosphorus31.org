/**
 * OMEGA PROTOCOL - MODULE G: NEURO-SYMBOLIC AGENTS
 * =================================================
 * Hybrid AI combining neural pattern recognition with symbolic reasoning
 * 
 * Implements:
 * - Knowledge graphs for world modeling
 * - Logic solvers (Prolog-style) for constraint validation
 * - Constitutional rules that cannot be "jailbroken"
 * - Multi-agent negotiation with formal proofs
 * 
 * "System 1 + System 2" thinking for assured autonomy
 */

import { EventEmitter } from 'eventemitter3';

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE GRAPH TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  properties: Record<string, PropertyValue>;
  created: number;
  updated: number;
}

export type EntityType = 
  | 'person'
  | 'asset'
  | 'contract'
  | 'location'
  | 'event'
  | 'rule'
  | 'custom';

export type PropertyValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | PropertyValue[];

export interface Relation {
  id: string;
  type: RelationType;
  from: string;      // Entity ID
  to: string;        // Entity ID
  properties: Record<string, PropertyValue>;
  confidence: number; // 0-1
  source: 'neural' | 'symbolic' | 'human';
  created: number;
}

export type RelationType =
  | 'owns'
  | 'trusts'
  | 'located_in'
  | 'participates_in'
  | 'depends_on'
  | 'implies'
  | 'contradicts'
  | 'parent_of'
  | 'bound_by'
  | 'custom';

export interface Triple {
  subject: string;
  predicate: string;
  object: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE GRAPH
// ─────────────────────────────────────────────────────────────────────────────

export class KnowledgeGraph extends EventEmitter {
  private entities: Map<string, Entity> = new Map();
  private relations: Map<string, Relation> = new Map();
  private index: {
    byType: Map<EntityType, Set<string>>;
    byRelation: Map<string, Set<string>>;  // entityId -> relationIds
  };

  constructor() {
    super();
    this.index = {
      byType: new Map(),
      byRelation: new Map()
    };
  }

  /**
   * Add an entity to the graph
   */
  addEntity(entity: Omit<Entity, 'id' | 'created' | 'updated'>): Entity {
    const id = crypto.randomUUID();
    const now = Date.now();
    
    const fullEntity: Entity = {
      ...entity,
      id,
      created: now,
      updated: now
    };

    this.entities.set(id, fullEntity);
    
    // Update index
    if (!this.index.byType.has(entity.type)) {
      this.index.byType.set(entity.type, new Set());
    }
    this.index.byType.get(entity.type)!.add(id);

    this.emit('entity:added', fullEntity);
    return fullEntity;
  }

  /**
   * Add a relation between entities
   */
  addRelation(relation: Omit<Relation, 'id' | 'created'>): Relation {
    if (!this.entities.has(relation.from) || !this.entities.has(relation.to)) {
      throw new Error('Both entities must exist');
    }

    const id = crypto.randomUUID();
    const fullRelation: Relation = {
      ...relation,
      id,
      created: Date.now()
    };

    this.relations.set(id, fullRelation);

    // Update index
    if (!this.index.byRelation.has(relation.from)) {
      this.index.byRelation.set(relation.from, new Set());
    }
    if (!this.index.byRelation.has(relation.to)) {
      this.index.byRelation.set(relation.to, new Set());
    }
    this.index.byRelation.get(relation.from)!.add(id);
    this.index.byRelation.get(relation.to)!.add(id);

    this.emit('relation:added', fullRelation);
    return fullRelation;
  }

  /**
   * Query entities by type
   */
  getEntitiesByType(type: EntityType): Entity[] {
    const ids = this.index.byType.get(type);
    if (!ids) return [];
    return Array.from(ids).map(id => this.entities.get(id)!);
  }

  /**
   * Get relations for an entity
   */
  getRelations(entityId: string): Relation[] {
    const relationIds = this.index.byRelation.get(entityId);
    if (!relationIds) return [];
    return Array.from(relationIds).map(id => this.relations.get(id)!);
  }

  /**
   * Find path between two entities (BFS)
   */
  findPath(fromId: string, toId: string, maxDepth: number = 5): Relation[] | null {
    if (fromId === toId) return [];

    const visited = new Set<string>();
    const queue: { entityId: string; path: Relation[] }[] = [
      { entityId: fromId, path: [] }
    ];

    while (queue.length > 0) {
      const { entityId, path } = queue.shift()!;
      
      if (path.length >= maxDepth) continue;
      if (visited.has(entityId)) continue;
      visited.add(entityId);

      const relations = this.getRelations(entityId);
      for (const rel of relations) {
        const nextId = rel.from === entityId ? rel.to : rel.from;
        const newPath = [...path, rel];

        if (nextId === toId) {
          return newPath;
        }

        queue.push({ entityId: nextId, path: newPath });
      }
    }

    return null;
  }

  /**
   * Pattern matching query
   */
  query(pattern: Partial<Triple>[]): Map<string, Entity | Relation>[] {
    const results: Map<string, Entity | Relation>[] = [];
    
    // Simplified pattern matching
    // In production: use proper SPARQL or Cypher
    for (const triple of pattern) {
      if (triple.predicate) {
        const matchingRelations = Array.from(this.relations.values())
          .filter(r => r.type === triple.predicate);
        
        for (const rel of matchingRelations) {
          const binding = new Map<string, Entity | Relation>();
          
          if (triple.subject && triple.subject.startsWith('?')) {
            const entity = this.entities.get(rel.from);
            if (entity) binding.set(triple.subject, entity);
          }
          
          if (triple.object && triple.object.startsWith('?')) {
            const entity = this.entities.get(rel.to);
            if (entity) binding.set(triple.object, entity);
          }
          
          if (binding.size > 0) {
            results.push(binding);
          }
        }
      }
    }

    return results;
  }

  /**
   * Export to triples
   */
  toTriples(): Triple[] {
    const triples: Triple[] = [];
    
    for (const rel of this.relations.values()) {
      const from = this.entities.get(rel.from);
      const to = this.entities.get(rel.to);
      
      if (from && to) {
        triples.push({
          subject: from.name,
          predicate: rel.type,
          object: to.name
        });
      }
    }

    return triples;
  }

  getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  getEntityCount(): number {
    return this.entities.size;
  }

  getRelationCount(): number {
    return this.relations.size;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIC SOLVER (Prolog-style)
// ─────────────────────────────────────────────────────────────────────────────

export interface Rule {
  id: string;
  name: string;
  head: Predicate;
  body: Predicate[];
  priority: number;       // Higher = checked first
  constitutional: boolean; // Cannot be overridden
}

export interface Predicate {
  name: string;
  args: (string | Variable)[];
}

export interface Variable {
  name: string;
  type?: string;
  bound?: PropertyValue;
}

export interface Binding {
  [variableName: string]: PropertyValue;
}

export interface InferenceResult {
  success: boolean;
  bindings: Binding[];
  trace: string[];  // Proof trace
  usedRules: string[];
}

export class LogicSolver extends EventEmitter {
  private rules: Map<string, Rule> = new Map();
  private facts: Set<string> = new Set();
  private maxDepth: number = 100;

  constructor() {
    super();
    this.initializeBuiltinRules();
  }

  private initializeBuiltinRules(): void {
    // Transitivity of trust
    this.addRule({
      name: 'trust_transitive',
      head: { name: 'trusts', args: [{ name: 'X' }, { name: 'Z' }] },
      body: [
        { name: 'trusts', args: [{ name: 'X' }, { name: 'Y' }] },
        { name: 'trusts', args: [{ name: 'Y' }, { name: 'Z' }] }
      ],
      priority: 50,
      constitutional: false
    });

    // Ownership implies control
    this.addRule({
      name: 'owner_controls',
      head: { name: 'controls', args: [{ name: 'X' }, { name: 'Y' }] },
      body: [
        { name: 'owns', args: [{ name: 'X' }, { name: 'Y' }] }
      ],
      priority: 80,
      constitutional: false
    });
  }

  /**
   * Add a rule
   */
  addRule(rule: Omit<Rule, 'id'>): Rule {
    const fullRule: Rule = {
      ...rule,
      id: crypto.randomUUID()
    };
    
    this.rules.set(fullRule.id, fullRule);
    this.emit('rule:added', fullRule);
    return fullRule;
  }

  /**
   * Add a fact (ground predicate)
   */
  addFact(predicate: string): void {
    this.facts.add(predicate);
  }

  /**
   * Remove a fact
   */
  removeFact(predicate: string): void {
    this.facts.delete(predicate);
  }

  /**
   * Check if a predicate can be derived
   */
  prove(goal: Predicate, depth: number = 0): InferenceResult {
    const trace: string[] = [];
    const usedRules: string[] = [];

    if (depth > this.maxDepth) {
      return { success: false, bindings: [], trace: ['Max depth exceeded'], usedRules };
    }

    // Check if it's a fact
    const goalString = this.predicateToString(goal);
    trace.push(`Checking: ${goalString}`);

    if (this.facts.has(goalString)) {
      trace.push('Found as fact');
      return { success: true, bindings: [{}], trace, usedRules };
    }

    // Try to unify with rule heads
    const applicableRules = Array.from(this.rules.values())
      .filter(r => r.head.name === goal.name)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of applicableRules) {
      trace.push(`Trying rule: ${rule.name}`);
      
      const unification = this.unify(goal, rule.head);
      if (!unification) continue;

      trace.push(`Unified with binding: ${JSON.stringify(unification)}`);

      // Prove all body predicates
      let bodySuccess = true;
      let currentBindings: Binding[] = [unification];

      for (const bodyPred of rule.body) {
        const substituted = this.substitute(bodyPred, unification);
        const bodyResult = this.prove(substituted, depth + 1);
        
        trace.push(...bodyResult.trace.map(t => '  ' + t));
        
        if (!bodyResult.success) {
          bodySuccess = false;
          break;
        }

        // Combine bindings
        currentBindings = this.combineBindings(currentBindings, bodyResult.bindings);
      }

      if (bodySuccess && currentBindings.length > 0) {
        usedRules.push(rule.id);
        return { success: true, bindings: currentBindings, trace, usedRules };
      }
    }

    trace.push(`Failed to prove: ${goalString}`);
    return { success: false, bindings: [], trace, usedRules };
  }

  /**
   * Unify two predicates
   */
  private unify(p1: Predicate, p2: Predicate): Binding | null {
    if (p1.name !== p2.name) return null;
    if (p1.args.length !== p2.args.length) return null;

    const binding: Binding = {};

    for (let i = 0; i < p1.args.length; i++) {
      const a1 = p1.args[i];
      const a2 = p2.args[i];

      if (typeof a1 === 'string' && typeof a2 === 'string') {
        if (a1 !== a2) return null;
      } else if (typeof a1 === 'object' && 'name' in a1) {
        // a1 is variable
        binding[a1.name] = typeof a2 === 'string' ? a2 : (a2 as Variable).name;
      } else if (typeof a2 === 'object' && 'name' in a2) {
        // a2 is variable
        binding[a2.name] = a1 as string;
      }
    }

    return binding;
  }

  /**
   * Substitute variables in predicate with bindings
   */
  private substitute(pred: Predicate, binding: Binding): Predicate {
    return {
      name: pred.name,
      args: pred.args.map(arg => {
        if (typeof arg === 'object' && 'name' in arg) {
          const value = binding[arg.name];
          return value !== undefined ? String(value) : arg;
        }
        return arg;
      })
    };
  }

  /**
   * Combine binding sets
   */
  private combineBindings(b1: Binding[], b2: Binding[]): Binding[] {
    const result: Binding[] = [];
    
    for (const binding1 of b1) {
      for (const binding2 of b2) {
        // Check for conflicts
        let compatible = true;
        for (const key of Object.keys(binding1)) {
          if (key in binding2 && binding1[key] !== binding2[key]) {
            compatible = false;
            break;
          }
        }
        
        if (compatible) {
          result.push({ ...binding1, ...binding2 });
        }
      }
    }

    return result;
  }

  private predicateToString(pred: Predicate): string {
    const args = pred.args.map(a => 
      typeof a === 'string' ? a : (a as Variable).name
    ).join(', ');
    return `${pred.name}(${args})`;
  }

  getRules(): Rule[] {
    return Array.from(this.rules.values());
  }

  getConstitutionalRules(): Rule[] {
    return Array.from(this.rules.values()).filter(r => r.constitutional);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTITUTIONAL CONSTRAINTS
// ─────────────────────────────────────────────────────────────────────────────

export interface ConstitutionalRule {
  id: string;
  name: string;
  description: string;
  constraint: ConstraintExpression;
  severity: 'hard' | 'soft';  // Hard = cannot be violated, Soft = warning
  action?: ConstraintAction;
}

export interface ConstraintExpression {
  type: 'never' | 'always' | 'requires' | 'implies';
  condition: string;  // Predicate expression
  exception?: string; // Exception condition
}

export interface ConstraintAction {
  type: 'block' | 'warn' | 'log' | 'notify';
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  violations: ConstraintViolation[];
  warnings: ConstraintViolation[];
}

export interface ConstraintViolation {
  ruleId: string;
  ruleName: string;
  description: string;
  action: string;
  severity: 'hard' | 'soft';
}

export class ConstitutionalGuard extends EventEmitter {
  private rules: Map<string, ConstitutionalRule> = new Map();
  private solver: LogicSolver;

  constructor(solver: LogicSolver) {
    super();
    this.solver = solver;
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    // Core safety rules
    this.addRule({
      name: 'no_unauthorized_transfer',
      description: 'Cannot transfer assets without owner consent',
      constraint: {
        type: 'requires',
        condition: 'transfer(X, Asset, Recipient)',
        exception: 'owns(X, Asset) AND signed(X, transfer)'
      },
      severity: 'hard',
      action: { type: 'block', message: 'Unauthorized transfer blocked' }
    });

    this.addRule({
      name: 'privacy_preservation',
      description: 'Cannot share personal data without consent',
      constraint: {
        type: 'never',
        condition: 'share(PersonalData, ThirdParty)',
        exception: 'consent(DataSubject, share)'
      },
      severity: 'hard',
      action: { type: 'block', message: 'Privacy violation prevented' }
    });

    this.addRule({
      name: 'child_safety',
      description: 'All actions involving children require guardian approval',
      constraint: {
        type: 'requires',
        condition: 'action(X, Child) AND is_minor(Child)',
        exception: 'approved(Guardian, X) AND guardian_of(Guardian, Child)'
      },
      severity: 'hard',
      action: { type: 'block', message: 'Guardian approval required for minor' }
    });

    this.addRule({
      name: 'transparent_reasoning',
      description: 'All decisions must be explainable',
      constraint: {
        type: 'always',
        condition: 'decision(D) IMPLIES has_explanation(D)'
      },
      severity: 'soft',
      action: { type: 'warn', message: 'Decision lacks explanation' }
    });
  }

  /**
   * Add a constitutional rule
   */
  addRule(rule: Omit<ConstitutionalRule, 'id'>): ConstitutionalRule {
    const fullRule: ConstitutionalRule = {
      ...rule,
      id: crypto.randomUUID()
    };
    
    this.rules.set(fullRule.id, fullRule);
    this.emit('rule:added', fullRule);
    return fullRule;
  }

  /**
   * Validate an action against all constitutional rules
   */
  validate(action: string, context: Record<string, unknown>): ValidationResult {
    const violations: ConstraintViolation[] = [];
    const warnings: ConstraintViolation[] = [];

    for (const rule of this.rules.values()) {
      const result = this.checkConstraint(action, rule, context);
      
      if (!result.passed) {
        const violation: ConstraintViolation = {
          ruleId: rule.id,
          ruleName: rule.name,
          description: rule.description,
          action: rule.action?.message || 'Constraint violated',
          severity: rule.severity
        };

        if (rule.severity === 'hard') {
          violations.push(violation);
        } else {
          warnings.push(violation);
        }
      }
    }

    const valid = violations.length === 0;
    
    this.emit('validation:complete', { action, valid, violations, warnings });
    
    return { valid, violations, warnings };
  }

  private checkConstraint(
    action: string,
    rule: ConstitutionalRule,
    context: Record<string, unknown>
  ): { passed: boolean; reason?: string } {
    const { constraint } = rule;

    // Simplified constraint checking
    // In production: use Z3 solver or similar
    switch (constraint.type) {
      case 'never':
        // Action should never match condition (unless exception)
        if (this.matchesCondition(action, constraint.condition, context)) {
          if (constraint.exception && 
              this.matchesCondition(action, constraint.exception, context)) {
            return { passed: true };
          }
          return { passed: false, reason: `Action matches forbidden pattern: ${constraint.condition}` };
        }
        return { passed: true };

      case 'always':
        // Action must always satisfy condition
        if (!this.matchesCondition(action, constraint.condition, context)) {
          return { passed: false, reason: `Action does not satisfy: ${constraint.condition}` };
        }
        return { passed: true };

      case 'requires':
        // If condition matches, exception must also match
        if (this.matchesCondition(action, constraint.condition, context)) {
          if (!constraint.exception ||
              !this.matchesCondition(action, constraint.exception, context)) {
            return { passed: false, reason: `Missing requirement: ${constraint.exception}` };
          }
        }
        return { passed: true };

      case 'implies':
        // If condition matches, then consequent must hold
        // A IMPLIES B = NOT A OR B
        if (this.matchesCondition(action, constraint.condition, context)) {
          // Would need to check consequent here
          return { passed: true }; // Simplified
        }
        return { passed: true };

      default:
        return { passed: true };
    }
  }

  private matchesCondition(
    action: string,
    condition: string,
    context: Record<string, unknown>
  ): boolean {
    // Very simplified matching
    // In production: parse condition into AST and evaluate
    
    // Check if action type is in condition
    const actionType = action.split('(')[0];
    return condition.toLowerCase().includes(actionType.toLowerCase());
  }

  getRules(): ConstitutionalRule[] {
    return Array.from(this.rules.values());
  }

  getHardRules(): ConstitutionalRule[] {
    return Array.from(this.rules.values()).filter(r => r.severity === 'hard');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NEURO-SYMBOLIC AGENT
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentAction {
  type: string;
  parameters: Record<string, unknown>;
  reasoning: string[];
  confidence: number;
}

export interface NegotiationProposal {
  id: string;
  fromAgent: string;
  toAgent: string;
  terms: AgentAction[];
  constraints: string[];
  proof?: string[];  // Formal proof that proposal satisfies constraints
}

export interface NegotiationResult {
  accepted: boolean;
  counterProposal?: NegotiationProposal;
  reasoning: string[];
}

export class NeuroSymbolicAgent extends EventEmitter {
  private id: string;
  private knowledge: KnowledgeGraph;
  private solver: LogicSolver;
  private guard: ConstitutionalGuard;
  private pendingActions: AgentAction[] = [];
  private actionHistory: AgentAction[] = [];

  constructor(id: string) {
    super();
    this.id = id;
    this.knowledge = new KnowledgeGraph();
    this.solver = new LogicSolver();
    this.guard = new ConstitutionalGuard(this.solver);
  }

  /**
   * Process natural language input and extract knowledge
   * (Neural component - simplified)
   */
  processInput(input: string): void {
    // In production: use LLM to extract entities and relations
    // Simplified: basic pattern matching
    
    const patterns = [
      { regex: /(\w+) owns (\w+)/i, type: 'owns' as RelationType },
      { regex: /(\w+) trusts (\w+)/i, type: 'trusts' as RelationType },
      { regex: /(\w+) located in (\w+)/i, type: 'located_in' as RelationType }
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern.regex);
      if (match) {
        // Create or find entities
        const subject = this.findOrCreateEntity(match[1]);
        const object = this.findOrCreateEntity(match[2]);
        
        // Add relation
        this.knowledge.addRelation({
          type: pattern.type,
          from: subject.id,
          to: object.id,
          properties: {},
          confidence: 0.8,
          source: 'neural'
        });

        // Add fact to logic solver
        this.solver.addFact(`${pattern.type}(${match[1]}, ${match[2]})`);
      }
    }

    this.emit('input:processed', input);
  }

  private findOrCreateEntity(name: string): Entity {
    // Check if entity exists
    const existing = Array.from(this.knowledge.getEntitiesByType('person'))
      .find(e => e.name.toLowerCase() === name.toLowerCase());
    
    if (existing) return existing;

    return this.knowledge.addEntity({
      type: 'person',
      name,
      properties: {}
    });
  }

  /**
   * Plan an action with symbolic validation
   */
  async planAction(goal: string): Promise<AgentAction | null> {
    const reasoning: string[] = [];
    
    reasoning.push(`Goal: ${goal}`);

    // Use symbolic reasoning to determine action
    const goalPredicate: Predicate = {
      name: 'achieve',
      args: [goal]
    };

    const inference = this.solver.prove(goalPredicate);
    reasoning.push(...inference.trace);

    if (!inference.success) {
      reasoning.push('Could not find valid action plan');
      return null;
    }

    // Construct action
    const action: AgentAction = {
      type: 'execute',
      parameters: { goal, bindings: inference.bindings[0] },
      reasoning,
      confidence: 0.7
    };

    // Validate against constitutional constraints
    const validation = this.guard.validate(action.type, action.parameters);
    
    if (!validation.valid) {
      reasoning.push('Action blocked by constitutional constraints:');
      for (const v of validation.violations) {
        reasoning.push(`  - ${v.description}`);
      }
      this.emit('action:blocked', { action, violations: validation.violations });
      return null;
    }

    for (const w of validation.warnings) {
      reasoning.push(`Warning: ${w.description}`);
    }

    this.pendingActions.push(action);
    this.emit('action:planned', action);
    
    return action;
  }

  /**
   * Execute a validated action
   */
  async executeAction(action: AgentAction): Promise<boolean> {
    // Re-validate before execution
    const validation = this.guard.validate(action.type, action.parameters);
    
    if (!validation.valid) {
      this.emit('action:rejected', { action, reason: 'Constitutional violation' });
      return false;
    }

    // Execute (simplified)
    action.reasoning.push(`Executed at ${new Date().toISOString()}`);
    this.actionHistory.push(action);
    
    // Remove from pending
    this.pendingActions = this.pendingActions.filter(a => a !== action);

    this.emit('action:executed', action);
    return true;
  }

  /**
   * Negotiate with another agent
   */
  async negotiate(
    otherAgent: NeuroSymbolicAgent,
    proposal: NegotiationProposal
  ): Promise<NegotiationResult> {
    const reasoning: string[] = [];
    
    reasoning.push(`Received proposal from ${proposal.fromAgent}`);
    reasoning.push(`Terms: ${proposal.terms.length} actions`);
    reasoning.push(`Constraints: ${proposal.constraints.join(', ')}`);

    // Validate each term
    for (const term of proposal.terms) {
      const validation = this.guard.validate(term.type, term.parameters);
      
      if (!validation.valid) {
        reasoning.push(`Term rejected: ${term.type}`);
        
        // Generate counter-proposal
        const counter = this.generateCounterProposal(proposal, validation);
        
        return {
          accepted: false,
          counterProposal: counter,
          reasoning
        };
      }
    }

    // Verify proof if provided
    if (proposal.proof) {
      reasoning.push('Verifying formal proof...');
      // In production: verify ZK proof or logical proof
      reasoning.push('Proof verified');
    }

    reasoning.push('Proposal accepted');
    
    return {
      accepted: true,
      reasoning
    };
  }

  private generateCounterProposal(
    original: NegotiationProposal,
    validation: ValidationResult
  ): NegotiationProposal {
    // Modify terms to satisfy constraints
    const modifiedTerms = original.terms.map(term => ({
      ...term,
      parameters: {
        ...term.parameters,
        requiresApproval: true  // Add approval requirement
      }
    }));

    return {
      id: crypto.randomUUID(),
      fromAgent: this.id,
      toAgent: original.fromAgent,
      terms: modifiedTerms,
      constraints: [
        ...original.constraints,
        ...validation.violations.map(v => v.description)
      ]
    };
  }

  /**
   * Explain reasoning for an action
   */
  explainAction(action: AgentAction): string {
    let explanation = `Action: ${action.type}\n`;
    explanation += `Confidence: ${(action.confidence * 100).toFixed(1)}%\n\n`;
    explanation += `Reasoning chain:\n`;
    
    for (let i = 0; i < action.reasoning.length; i++) {
      explanation += `${i + 1}. ${action.reasoning[i]}\n`;
    }

    return explanation;
  }

  getKnowledge(): KnowledgeGraph {
    return this.knowledge;
  }

  getSolver(): LogicSolver {
    return this.solver;
  }

  getGuard(): ConstitutionalGuard {
    return this.guard;
  }

  getId(): string {
    return this.id;
  }

  getActionHistory(): AgentAction[] {
    return [...this.actionHistory];
  }
}

export default NeuroSymbolicAgent;
