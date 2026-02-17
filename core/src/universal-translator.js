/**
 * UNIVERSAL TRANSLATOR - The Bridge Between All Minds
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🌈
 * 
 * For ALL combinations:
 * - ND parent + NT kid
 * - NT parent + ND kid  
 * - ND parent + ND kid (different neurotypes!)
 * - Late-diagnosed adults discovering themselves
 * - Mixed neurotype families
 * - Anyone trying to understand anyone else
 * 
 * "We do not need to change each other. We need to build the 
 * Universal Translation Layer that allows us to love each other 
 * across the impedance mismatch."
 * 
 * Features:
 * - Multi-neurotype profiling and compatibility analysis
 * - Behavior translation for cross-neurotype understanding
 * - GenSync mesh protocol with Human OS types
 * - Love language bridging (classic + ND-extended)
 * - Conflict pattern detection and repair strategies
 * - Late-diagnosis support and grief stage guidance
 * - Spoon-aware communication simplification
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const TRANSLATOR_CONFIG = {
  // Profile settings
  DEFAULT_LOVE_LANGUAGE_PRIORITY: 3,
  MAX_PROFILES: 1000,
  MAX_BRIDGES: 5000,
  
  // Interaction logging
  MAX_INTERACTION_LOG: 10000,
  INTERACTION_RETENTION_DAYS: 365,
  
  // Spoon-aware communication thresholds
  SPOON_THRESHOLDS: {
    FULL_COMMUNICATION: 8,      // Full detail mode
    SIMPLIFIED: 5,              // Reduce complexity
    MINIMAL: 3,                 // Essential only
    EMERGENCY: 1                // Crisis mode
  },
  
  // GenSync primitive weights
  GENSYNC_WEIGHTS: {
    frequency: 0.30,
    paralleling: 0.25,
    binaryLogic: 0.25,
    tetrahedron: 0.20
  },
  
  // Human OS detection sensitivity
  OS_DETECTION: {
    MIN_KEYWORD_SCORE: 10,
    CONFIDENCE_THRESHOLD: 30
  },
  
  // Late diagnosis stages
  GRIEF_STAGES: [
    'denial', 'anger', 'bargaining', 
    'depression', 'acceptance', 'integration'
  ],
  
  // Communication style compatibility matrix
  STYLE_COMPATIBILITY: {
    'direct_explicit': {
      compatible: ['direct_explicit', 'logical_analytical'],
      friction: ['indirect_implicit', 'emotional_first']
    },
    'indirect_implicit': {
      compatible: ['indirect_implicit', 'emotional_first'],
      friction: ['direct_explicit']
    },
    'logical_analytical': {
      compatible: ['direct_explicit', 'logical_analytical'],
      friction: ['emotional_first']
    },
    'emotional_first': {
      compatible: ['emotional_first', 'indirect_implicit'],
      friction: ['logical_analytical']
    }
  }
};

class UniversalTranslator extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    
    // Individual profiles
    this.profiles = new Map();
    
    // Relationship bridges
    this.bridges = new Map();
    
    // Communication log for learning
    this.interactionLog = [];
    
    // Initialize translation libraries
    this.neurotypes = this.initializeNeurotypes();
    this.communicationStyles = this.initializeCommunicationStyles();
    this.loveLanguages = this.initializeLoveLanguages();
    this.conflictPatterns = this.initializeConflictPatterns();
    this.translations = this.initializeTranslations();
    
    // GenSync Integration - Spiral Dynamics / Human OS
    this.humanOS = this.initializeHumanOS();
    this.genSyncPrimitives = this.initializeGenSyncPrimitives();
  }

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Create a comprehensive profile for any person
   */
  createProfile(personId, data = {}) {
    const profile = {
      id: personId,
      name: data.name || 'Anonymous',
      age: data.age,
      role: data.role || 'family_member', // parent | child | partner | caregiver | self
      
      // Neurotype (can be multiple, can be uncertain)
      neurotype: {
        identified: data.neurotype?.identified || [], // ['adhd', 'autism', 'neurotypical', etc]
        suspected: data.neurotype?.suspected || [],
        exploring: data.neurotype?.exploring || false, // For late-diagnosed/questioning
        diagnosed: data.neurotype?.diagnosed || null, // Date of diagnosis if applicable
        selfIdentified: data.neurotype?.selfIdentified || false
      },
      
      // Communication preferences
      communication: {
        style: data.communication?.style || 'unknown', // Will be assessed
        processingSpeed: data.communication?.processingSpeed || 'medium', // slow | medium | fast
        preferredMedium: data.communication?.preferredMedium || ['verbal'], // verbal, written, visual, etc
        needsTime: data.communication?.needsTime || false, // Needs time to process before responding
        directness: data.communication?.directness || 'neutral', // very-direct | direct | neutral | indirect
        literalness: data.communication?.literalness || 'neutral', // literal | neutral | figurative
        emotionalExpression: data.communication?.emotionalExpression || 'medium',
        conflictStyle: data.communication?.conflictStyle || 'unknown'
      },
      
      // Sensory profile (condensed from SensoryToolkit)
      sensory: {
        seekers: data.sensory?.seekers || [], // Which modalities they seek
        avoiders: data.sensory?.avoiders || [], // Which modalities they avoid
        overloadSigns: data.sensory?.overloadSigns || [],
        calmingInputs: data.sensory?.calmingInputs || []
      },
      
      // Energy/Spoon management
      energy: {
        baselineSpoons: data.energy?.baselineSpoons || 12,
        socialDrain: data.energy?.socialDrain || 'medium', // low | medium | high
        aloneRecharge: data.energy?.aloneRecharge || false, // Introvert indicator
        maskingCost: data.energy?.maskingCost || 0, // Extra spoons spent masking
        peakHours: data.energy?.peakHours || [], // When they're at their best
        lowHours: data.energy?.lowHours || [] // When they need gentleness
      },
      
      // Love language priorities (1-5)
      loveLanguages: {
        wordsOfAffirmation: data.loveLanguages?.wordsOfAffirmation || 3,
        qualityTime: data.loveLanguages?.qualityTime || 3,
        actsOfService: data.loveLanguages?.actsOfService || 3,
        gifts: data.loveLanguages?.gifts || 3,
        physicalTouch: data.loveLanguages?.physicalTouch || 3,
        // Extended for ND folks
        parallelPlay: data.loveLanguages?.parallelPlay || 3, // Together but separate
        infoDumping: data.loveLanguages?.infoDumping || 3, // Sharing special interests
        protectiveActions: data.loveLanguages?.protectiveActions || 3, // Shielding from overwhelm
        routineMaintenance: data.loveLanguages?.routineMaintenance || 3 // Respecting routines
      },
      
      // Triggers and needs
      triggers: data.triggers || [],
      needs: data.needs || [],
      boundaries: data.boundaries || [],
      
      // Special interests / passions
      specialInterests: data.specialInterests || [],
      
      // Masking awareness
      masking: {
        awareness: data.masking?.awareness || 'unknown', // unaware | aware | working-on-it
        cost: data.masking?.cost || 'medium',
        safeSpaces: data.masking?.safeSpaces || [], // Where they can unmask
        safePeople: data.masking?.safePeople || [] // Who they can unmask with
      },
      
      // For late-diagnosed adults
      lateDiagnosis: data.lateDiagnosis ? {
        diagnosisAge: data.lateDiagnosis.diagnosisAge,
        griefStage: data.lateDiagnosis.griefStage || 'processing', // denial | anger | bargaining | depression | acceptance | integration
        reframingProgress: data.lateDiagnosis.reframingProgress || 0, // 0-100
        needsSupport: data.lateDiagnosis.needsSupport || true
      } : null,
      
      // Learning and growth
      learning: {
        aboutSelf: [],
        aboutOthers: [],
        breakthroughs: []
      },
      
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.profiles.set(personId, profile);
    this.emit('profileCreated', { personId, profile });
    return profile;
  }

  // ============================================
  // NEUROTYPE LIBRARY
  // ============================================

  initializeNeurotypes() {
    return {
      'adhd': {
        name: 'ADHD',
        commonTraits: [
          'Variable attention (hyperfocus ↔ scattered)',
          'Time blindness',
          'Emotional intensity',
          'Need for novelty/stimulation',
          'Difficulty with boring tasks',
          'Creative/divergent thinking',
          'Impulsivity (sometimes)',
          'Working memory challenges',
          'Rejection sensitivity'
        ],
        communicationTips: [
          'Be direct and concise',
          'Important info first (may tune out)',
          'Written follow-ups help',
          'Don\'t take forgotten things personally',
          'Engage their interest/passion',
          'Break tasks into small steps',
          'Patience with interruptions',
          'Celebrate hyperfocus, don\'t interrupt it unnecessarily'
        ],
        needsFromOthers: [
          'Understanding of time blindness',
          'Reminders without judgment',
          'Flexibility',
          'Stimulation',
          'Body doubling support',
          'Dopamine-friendly activities'
        ],
        strengths: [
          'Creativity', 'Hyperfocus', 'Energy', 'Enthusiasm',
          'Out-of-box thinking', 'Resilience', 'Humor'
        ]
      },
      
      'autism': {
        name: 'Autism',
        commonTraits: [
          'Deep focus on interests',
          'Pattern recognition',
          'Sensory differences',
          'Need for routine/predictability',
          'Literal communication style',
          'Detailed thinking',
          'Strong sense of justice',
          'Different social processing',
          'Stimming for regulation'
        ],
        communicationTips: [
          'Be literal and clear',
          'Say what you mean (no hints)',
          'Explain social expectations explicitly',
          'Give processing time',
          'Respect need for routine',
          'Don\'t force eye contact',
          'Written communication often preferred',
          'Respect stimming',
          'Ask directly about feelings rather than inferring'
        ],
        needsFromOthers: [
          'Predictability',
          'Clear communication',
          'Sensory accommodations',
          'Acceptance of differences',
          'Respect for boundaries',
          'Space for special interests'
        ],
        strengths: [
          'Deep expertise', 'Honesty', 'Loyalty', 'Attention to detail',
          'Pattern recognition', 'Systematic thinking', 'Authenticity'
        ]
      },
      
      'audhd': {
        name: 'AuDHD (Autism + ADHD)',
        commonTraits: [
          'Need routine BUT also crave novelty',
          'Hyperfocus + hyperfixation',
          'Sensory seeking AND avoiding',
          'Executive dysfunction squared',
          'Internal conflict between needs',
          'Extra masking exhaustion',
          'Intense emotions + difficulty identifying them',
          'Time blindness + schedule rigidity clash'
        ],
        communicationTips: [
          'Understand the internal contradiction',
          'Be patient with changing needs',
          'Both structure AND flexibility needed',
          'Clear communication + engagement',
          'More processing time',
          'Validate the difficulty of competing needs'
        ],
        needsFromOthers: [
          'Understanding of complex needs',
          'No judgment for contradictions',
          'Help with executive function',
          'Sensory accommodations',
          'Patience, patience, patience'
        ],
        strengths: [
          'Incredible depth AND breadth', 'Creative problem-solving',
          'Passionate', 'Resilient', 'Unique perspective'
        ]
      },
      
      'neurotypical': {
        name: 'Neurotypical',
        commonTraits: [
          'Intuitive social navigation',
          'Implicit communication understanding',
          'Flexible attention',
          'Standard sensory processing',
          'Typical executive function',
          'Expected developmental path'
        ],
        communicationTips: [
          'Can handle implicit communication',
          'Picks up on social cues',
          'May not understand why ND folks struggle',
          'May need education on neurodivergence',
          'May unintentionally cause harm through assumptions'
        ],
        needsFromNDFolks: [
          'Explicit communication about needs',
          'Patience while learning',
          'Understanding they\'re trying',
          'Clear feedback (not hints)',
          'Education and resources'
        ],
        growthAreas: [
          'Learning to be explicit',
          'Understanding different processing styles',
          'Unlearning ableist assumptions',
          'Flexibility in expectations'
        ]
      },
      
      'hsp': {
        name: 'Highly Sensitive Person',
        commonTraits: [
          'Deep processing of information',
          'Emotional sensitivity',
          'Sensory sensitivity',
          'Overwhelm in stimulating environments',
          'Strong empathy',
          'Need for downtime'
        ],
        communicationTips: [
          'Gentle approach',
          'Avoid harsh criticism',
          'Acknowledge feelings',
          'Quiet environments preferred'
        ],
        strengths: [
          'Empathy', 'Intuition', 'Creativity', 'Conscientiousness'
        ]
      },
      
      'gifted': {
        name: 'Gifted/2e',
        commonTraits: [
          'Asynchronous development',
          'Intense curiosity',
          'Perfectionism',
          'Existential concerns',
          'Overexcitabilities',
          'May mask other neurotypes'
        ],
        communicationTips: [
          'Intellectual engagement',
          'Don\'t dismiss "advanced" concerns',
          'Acknowledge emotional intensity',
          'Support for perfectionism struggles'
        ],
        strengths: [
          'Quick learning', 'Deep thinking', 'Problem-solving', 'Creativity'
        ]
      },
      
      'pda': {
        name: 'PDA (Pathological Demand Avoidance)',
        commonTraits: [
          'Nervous system-level demand avoidance',
          'Need for autonomy and control',
          'Anxiety-driven',
          'Creative avoidance strategies',
          'Not "won\'t" but "can\'t"'
        ],
        communicationTips: [
          'Offer choices instead of demands',
          'Reduce pressure language',
          'Collaborate, don\'t command',
          'Understand it\'s anxiety, not defiance',
          'Indirect requests work better'
        ],
        needsFromOthers: [
          'Autonomy',
          'Low-demand environment',
          'Understanding',
          'Collaborative approach'
        ]
      },
      
      'exploring': {
        name: 'Exploring/Questioning',
        description: 'Currently exploring neurodivergence',
        commonExperiences: [
          'Relating to ND content',
          '"Wait, not everyone experiences this?"',
          'Reframing past experiences',
          'Imposter syndrome',
          'Grief for undiagnosed years',
          'Relief and confusion',
          'Identity reconstruction'
        ],
        needsFromOthers: [
          'Space to explore',
          'No gatekeeping',
          'Resources and support',
          'Validation',
          'Patience during identity work'
        ]
      }
    };
  }

  // ============================================
  // COMMUNICATION STYLE LIBRARY
  // ============================================

  initializeCommunicationStyles() {
    return {
      'direct_explicit': {
        name: 'Direct & Explicit',
        description: 'Says exactly what they mean, appreciates the same',
        compatible: ['direct_explicit', 'logical_analytical'],
        friction: ['indirect_implicit', 'emotional_first'],
        tips: 'Don\'t hint. Just say it.'
      },
      'indirect_implicit': {
        name: 'Indirect & Implicit',
        description: 'Uses context, tone, and implication',
        compatible: ['indirect_implicit', 'emotional_first'],
        friction: ['direct_explicit'],
        tips: 'May need to learn to be more explicit with direct communicators'
      },
      'logical_analytical': {
        name: 'Logical & Analytical',
        description: 'Leads with facts and analysis',
        compatible: ['direct_explicit', 'logical_analytical'],
        friction: ['emotional_first'],
        tips: 'Remember to acknowledge emotions before problem-solving'
      },
      'emotional_first': {
        name: 'Emotional First',
        description: 'Processes through feelings first',
        compatible: ['emotional_first', 'indirect_implicit'],
        friction: ['logical_analytical'],
        tips: 'May need logical partners to validate feelings before offering solutions'
      },
      'visual_spatial': {
        name: 'Visual & Spatial',
        description: 'Thinks in pictures, needs visual aids',
        compatible: ['any'],
        friction: ['verbal_only'],
        tips: 'Draw it, show it, diagram it'
      },
      'verbal_processor': {
        name: 'Verbal Processor',
        description: 'Thinks by talking it out',
        compatible: ['patient_listeners'],
        friction: ['internal_processors'],
        tips: 'Needs space to talk through things without interruption'
      },
      'internal_processor': {
        name: 'Internal Processor',
        description: 'Needs time alone to think before responding',
        compatible: ['patient_types'],
        friction: ['verbal_processor', 'immediate_responders'],
        tips: 'Give them time. Don\'t push for immediate answers.'
      }
    };
  }

  // ============================================
  // LOVE LANGUAGE LIBRARY (Extended for ND)
  // ============================================

  initializeLoveLanguages() {
    return {
      // Classic 5
      'wordsOfAffirmation': {
        name: 'Words of Affirmation',
        examples: ['Compliments', 'Encouragement', 'Written notes', 'Verbal appreciation'],
        ndConsiderations: 'Some ND folks may prefer written over verbal'
      },
      'qualityTime': {
        name: 'Quality Time',
        examples: ['Focused attention', 'Shared activities', 'Deep conversations'],
        ndConsiderations: 'May need to be sensory-friendly or interest-aligned'
      },
      'actsOfService': {
        name: 'Acts of Service',
        examples: ['Helping with tasks', 'Taking on chores', 'Problem-solving'],
        ndConsiderations: 'Executive function support is a HUGE act of love for ND folks'
      },
      'gifts': {
        name: 'Receiving Gifts',
        examples: ['Thoughtful presents', 'Surprises', 'Symbolic items'],
        ndConsiderations: 'Special interest items are GOLD'
      },
      'physicalTouch': {
        name: 'Physical Touch',
        examples: ['Hugs', 'Holding hands', 'Physical closeness'],
        ndConsiderations: 'HIGHLY variable for ND folks. Some crave it, some avoid it. ALWAYS consent-based.'
      },
      
      // Extended ND Love Languages
      'parallelPlay': {
        name: 'Parallel Play',
        description: 'Being together in the same space, doing separate things',
        examples: ['Reading in same room', 'Working on own projects together', 'Silent companionship'],
        ndConsiderations: 'MAJOR love language for many ND folks. Don\'t dismiss it as "not quality time"'
      },
      'infoDumping': {
        name: 'Info Dumping',
        description: 'Sharing detailed information about special interests',
        examples: ['Long explanations', 'Sharing discoveries', 'Teaching about passions'],
        ndConsiderations: 'This IS love. Receiving it? Listen genuinely.'
      },
      'protectiveActions': {
        name: 'Protective Actions',
        description: 'Shielding from sensory/social/emotional overwhelm',
        examples: ['Handling phone calls', 'Running interference socially', 'Creating quiet spaces'],
        ndConsiderations: 'One of the deepest forms of ND love'
      },
      'routineMaintenance': {
        name: 'Routine Respect',
        description: 'Honoring and protecting routines and rituals',
        examples: ['Not disrupting schedules', 'Maintaining household systems', 'Warning about changes'],
        ndConsiderations: 'Disrupting routines without warning can feel like betrayal'
      },
      'stimAcceptance': {
        name: 'Stim Acceptance',
        description: 'Welcoming and normalizing stimming',
        examples: ['Not commenting on stims', 'Creating stim-friendly spaces', 'Stimming together'],
        ndConsiderations: 'Acceptance of full self = profound love'
      },
      'bodyDoubling': {
        name: 'Body Doubling',
        description: 'Being present to help someone focus/function',
        examples: ['Working in same room', 'Video call while doing tasks', 'Quiet companionship during hard tasks'],
        ndConsiderations: 'Massive executive function support for ADHD'
      }
    };
  }

  // ============================================
  // TRANSLATION ENGINE
  // ============================================

  initializeTranslations() {
    return {
      // Behavior translations
      behaviors: {
        'not_listening': {
          ntInterpretation: 'They don\'t care / They\'re being rude',
          possibleNDReality: [
            'Auditory processing delay',
            'Overwhelmed and can\'t process',
            'Hyperfocused on something',
            'Didn\'t realize they were being addressed',
            'Processing previous input'
          ],
          bridgePhrase: 'Can you help me understand what\'s happening for you right now?'
        },
        'avoiding_eye_contact': {
          ntInterpretation: 'They\'re hiding something / Not paying attention',
          possibleNDReality: [
            'Eye contact is overwhelming/painful',
            'Listening better WITHOUT eye contact',
            'Regulating sensory input',
            'Processing deeply'
          ],
          bridgePhrase: 'I know eye contact can be hard. I\'m listening to your words.'
        },
        'meltdown': {
          ntInterpretation: 'Tantrum / Manipulation / Bad behavior',
          possibleNDReality: [
            'Nervous system overload - NOT a choice',
            'Accumulated sensory/emotional overwhelm',
            'Fight/flight/freeze response',
            'Communication when words fail'
          ],
          bridgePhrase: 'Your nervous system is overwhelmed. Let\'s get you somewhere safe. We can talk later.'
        },
        'shutdown': {
          ntInterpretation: 'Ignoring me / Being difficult',
          possibleNDReality: [
            'Nervous system has disconnected to protect',
            'Processing overload',
            'Cannot access speech/movement',
            'Recovery mode'
          ],
          bridgePhrase: 'I see you need space. I\'m here when you\'re ready. No rush.'
        },
        'rigid_about_routine': {
          ntInterpretation: 'Being difficult / Controlling',
          possibleNDReality: [
            'Routine = safety/predictability',
            'Change causes genuine distress',
            'Executive function relies on routine',
            'Anxiety management strategy'
          ],
          bridgePhrase: 'I understand routine is important. If we need to change something, let\'s plan it together.'
        },
        'intense_emotions': {
          ntInterpretation: 'Overreacting / Being dramatic',
          possibleNDReality: [
            'Emotional intensity is neurological',
            'Rejection Sensitive Dysphoria',
            'Difficulty regulating emotions',
            'Feeling things MORE, not wrong'
          ],
          bridgePhrase: 'Your feelings are real and valid. This is hard for you.'
        },
        'forgetting': {
          ntInterpretation: 'They don\'t care / Lazy / Irresponsible',
          possibleNDReality: [
            'Working memory differences',
            'Time blindness',
            'Object permanence issues',
            'Executive function challenges'
          ],
          bridgePhrase: 'I know you didn\'t mean to forget. How can we set up a system to help?'
        },
        'interrupting': {
          ntInterpretation: 'Rude / Doesn\'t care what I\'m saying',
          possibleNDReality: [
            'Will lose the thought if don\'t say it NOW',
            'Excited and engaged',
            'Processing differently',
            'Impulsivity (neurological, not character)'
          ],
          bridgePhrase: 'I can see you have something important to say. Hold that thought - I want to hear it in just a moment.'
        },
        'stimming': {
          ntInterpretation: 'Weird / Distracting / Should stop',
          possibleNDReality: [
            'Regulation mechanism',
            'Processing aid',
            'Emotional expression',
            'JOY and comfort'
          ],
          bridgePhrase: 'I see you\'re [stimming]. Is there anything you need right now?'
        }
      },
      
      // Communication translations
      communication: {
        'no_response': {
          ntSays: 'Why won\'t you answer me?!',
          ndMayHear: 'Attack / Demand / Pressure',
          betterApproach: 'I asked something and I\'m waiting. Let me know when you\'re ready to respond.',
          ndMightNeed: 'Processing time, less pressure, written format option'
        },
        'criticism': {
          ntSays: 'You always do X wrong',
          ndMayHear: 'You are fundamentally broken / You will never be good enough',
          betterApproach: 'I\'ve noticed X happening. Can we problem-solve together?',
          ndMightNeed: 'Specific feedback, problem-solving approach, reassurance of relationship'
        },
        'implied_request': {
          ntSays: 'The trash is really full...',
          ndMayHear: 'Observation about trash' (literally),
          betterApproach: 'Could you take the trash out?',
          ndMightNeed: 'Direct requests, not hints'
        },
        'sarcasm': {
          ntSays: 'Oh GREAT, another problem',
          ndMayHear: 'Wait, is this good? They said great...',
          betterApproach: 'I\'m frustrated that there\'s another problem',
          ndMightNeed: 'Literal communication or clear sarcasm markers'
        },
        'vague_time': {
          ntSays: 'We\'ll leave soon / in a bit',
          ndMayHear: 'Unknown = anxiety / Can\'t prepare',
          betterApproach: 'We\'ll leave in 20 minutes',
          ndMightNeed: 'Specific times, countdown warnings'
        }
      }
    };
  }

  // ============================================
  // CONFLICT PATTERNS
  // ============================================

  initializeConflictPatterns() {
    return {
      'demand_avoidance_pressure': {
        pattern: 'NT increases pressure → PDA/ND increases avoidance → cycle escalates',
        break: 'Reduce demands, offer choices, wait',
        script: 'I can see this isn\'t working. Let\'s take a break and try a different approach.'
      },
      'rejection_sensitivity_criticism': {
        pattern: 'NT gives feedback → RSD activation → defensive/emotional response → NT frustrated',
        break: 'Sandwich feedback, affirm relationship, separate behavior from identity',
        script: 'I love you and our relationship is solid. I want to talk about something that\'s not working. You\'re not in trouble.'
      },
      'time_blindness_frustration': {
        pattern: 'ND loses track of time → NT frustrated about waiting/lateness → conflict',
        break: 'External time cues, no moral judgment, collaborative systems',
        script: 'Time got away from you. That happens. Let\'s figure out a system that helps.'
      },
      'sensory_overwhelm_misread': {
        pattern: 'ND overwhelmed → NT perceives as moody/difficult → pushes for interaction → escalation',
        break: 'Recognize overwhelm signs, offer space, reduce input',
        script: 'I think you might be overwhelmed. Do you need some quiet time?'
      },
      'different_needs_collision': {
        pattern: 'NT needs connection → ND needs alone time → both feel rejected',
        break: 'Schedule both, validate both needs, parallel play as compromise',
        script: 'We both have valid needs right now. Can we do parallel play - together but quiet?'
      }
    };
  }

  // ============================================
  // BRIDGE BUILDER
  // ============================================

  /**
   * Create a bridge between two people
   */
  createBridge(person1Id, person2Id) {
    const p1 = this.profiles.get(person1Id);
    const p2 = this.profiles.get(person2Id);
    
    if (!p1 || !p2) throw new Error('Both profiles required');

    const bridgeId = `${person1Id}_${person2Id}`;
    
    const bridge = {
      id: bridgeId,
      person1: person1Id,
      person2: person2Id,
      
      // Compatibility analysis
      compatibility: this.analyzeCompatibility(p1, p2),
      
      // Potential friction points
      frictionPoints: this.identifyFrictionPoints(p1, p2),
      
      // Custom translations for this pair
      translations: this.generatePairTranslations(p1, p2),
      
      // Love language bridge
      loveLanguageBridge: this.bridgeLoveLanguages(p1, p2),
      
      // Communication cheat sheet
      communicationGuide: this.generateCommunicationGuide(p1, p2),
      
      // Conflict patterns to watch
      conflictRisks: this.identifyConflictRisks(p1, p2),
      
      // Repair strategies
      repairStrategies: this.generateRepairStrategies(p1, p2),
      
      // Growth opportunities
      growthAreas: this.identifyGrowthAreas(p1, p2),
      
      createdAt: Date.now()
    };

    this.bridges.set(bridgeId, bridge);
    this.emit('bridgeCreated', { bridge });
    return bridge;
  }

  /**
   * Analyze compatibility between two profiles
   */
  analyzeCompatibility(p1, p2) {
    const analysis = {
      overallMatch: 'compatible', // Will calculate
      strengths: [],
      challenges: [],
      opportunities: []
    };

    // Check communication style compatibility
    const style1 = this.communicationStyles[p1.communication.style];
    const style2 = this.communicationStyles[p2.communication.style];
    
    if (style1 && style2) {
      if (style1.compatible.includes(p2.communication.style)) {
        analysis.strengths.push('Communication styles complement each other');
      }
      if (style1.friction.includes(p2.communication.style)) {
        analysis.challenges.push('Communication style differences need awareness');
      }
    }

    // Check neurotype understanding
    const nt1 = p1.neurotype.identified;
    const nt2 = p2.neurotype.identified;
    
    if (nt1.includes('neurotypical') && nt2.some(n => n !== 'neurotypical')) {
      analysis.challenges.push('NT/ND dynamic requires active learning from NT partner');
      analysis.opportunities.push('NT can learn to be more explicit communicator');
    }
    
    if (nt1.some(n => n !== 'neurotypical') && nt2.includes('neurotypical')) {
      analysis.challenges.push('ND partner may need to teach NT about their needs');
      analysis.opportunities.push('ND can practice self-advocacy in safe relationship');
    }

    // Check love language alignment
    const loveMatch = this.compareLoveLanguages(p1.loveLanguages, p2.loveLanguages);
    analysis.loveLanguageMatch = loveMatch;
    
    return analysis;
  }

  /**
   * Compare love language priorities
   */
  compareLoveLanguages(ll1, ll2) {
    const matches = [];
    const gaps = [];
    
    for (const [lang, priority1] of Object.entries(ll1)) {
      const priority2 = ll2[lang];
      
      // If one person rates high and other rates low, there's a gap
      if (Math.abs(priority1 - priority2) >= 3) {
        gaps.push({
          language: lang,
          person1Priority: priority1,
          person2Priority: priority2,
          note: priority1 > priority2 
            ? `Person 1 needs more ${lang} than Person 2 naturally gives`
            : `Person 2 needs more ${lang} than Person 1 naturally gives`
        });
      }
      
      // If both rate high, it's a match
      if (priority1 >= 4 && priority2 >= 4) {
        matches.push({ language: lang, shared: true });
      }
    }
    
    return { matches, gaps };
  }

  /**
   * Identify friction points
   */
  identifyFrictionPoints(p1, p2) {
    const friction = [];
    
    // Processing speed mismatch
    if (p1.communication.processingSpeed !== p2.communication.processingSpeed) {
      friction.push({
        area: 'Processing Speed',
        issue: `${p1.name} processes ${p1.communication.processingSpeed}, ${p2.name} processes ${p2.communication.processingSpeed}`,
        solution: 'Slower partner may need more time; faster partner practices patience'
      });
    }
    
    // Directness mismatch
    if ((p1.communication.directness === 'very-direct' && p2.communication.directness === 'indirect') ||
        (p2.communication.directness === 'very-direct' && p1.communication.directness === 'indirect')) {
      friction.push({
        area: 'Communication Directness',
        issue: 'One person is very direct, other is indirect',
        solution: 'Direct person: soften delivery. Indirect person: be more explicit.'
      });
    }
    
    // Energy/social needs mismatch
    if (p1.energy.aloneRecharge !== p2.energy.aloneRecharge) {
      friction.push({
        area: 'Energy Recharge',
        issue: 'One recharges alone, other recharges socially',
        solution: 'Schedule both alone time and together time. Neither is wrong.'
      });
    }
    
    return friction;
  }

  /**
   * Generate pair-specific translations
   */
  generatePairTranslations(p1, p2) {
    // Custom translations based on their specific profiles
    return {
      forPerson1: {
        when: `When ${p2.name} does X`,
        understand: 'It might mean Y',
        try: 'Try responding with Z'
      },
      forPerson2: {
        when: `When ${p1.name} does X`,
        understand: 'It might mean Y',
        try: 'Try responding with Z'
      }
    };
  }

  /**
   * Bridge love languages
   */
  bridgeLoveLanguages(p1, p2) {
    return {
      howToLovePerson1: Object.entries(p1.loveLanguages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang, priority]) => ({
          language: lang,
          priority,
          details: this.loveLanguages[lang],
          examples: this.loveLanguages[lang]?.examples || []
        })),
      howToLovePerson2: Object.entries(p2.loveLanguages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang, priority]) => ({
          language: lang,
          priority,
          details: this.loveLanguages[lang],
          examples: this.loveLanguages[lang]?.examples || []
        }))
    };
  }

  /**
   * Generate communication guide for pair
   */
  generateCommunicationGuide(p1, p2) {
    return {
      forPerson1TalkingToPerson2: this.getCommunicationTips(p1, p2),
      forPerson2TalkingToPerson1: this.getCommunicationTips(p2, p1)
    };
  }

  getCommunicationTips(speaker, listener) {
    const tips = [];
    
    // Based on listener's neurotype
    for (const nt of listener.neurotype.identified) {
      const ntData = this.neurotypes[nt];
      if (ntData?.communicationTips) {
        tips.push(...ntData.communicationTips.slice(0, 3));
      }
    }
    
    // Based on listener's communication style
    if (listener.communication.needsTime) {
      tips.push('Give time to process before expecting response');
    }
    
    if (listener.communication.literalness === 'literal') {
      tips.push('Be literal and explicit. Avoid sarcasm or hints.');
    }
    
    return [...new Set(tips)]; // Remove duplicates
  }

  /**
   * Identify potential conflict patterns
   */
  identifyConflictRisks(p1, p2) {
    const risks = [];
    
    // Check each conflict pattern
    for (const [patternId, pattern] of Object.entries(this.conflictPatterns)) {
      // Logic to determine if this pattern applies to this pair
      // (Simplified - would be more sophisticated in reality)
      risks.push({
        pattern: patternId,
        ...pattern,
        likelihood: 'possible'
      });
    }
    
    return risks.slice(0, 3); // Top 3 most relevant
  }

  /**
   * Generate repair strategies
   */
  generateRepairStrategies(p1, p2) {
    return {
      generalStrategies: [
        'Take space before discussing (minimum 20 minutes)',
        'Start with "I feel" not "You always"',
        'Assume positive intent',
        'Address one issue at a time',
        'Repair bids: accept them even if imperfect'
      ],
      forPerson1: this.getRepairStrategies(p1),
      forPerson2: this.getRepairStrategies(p2)
    };
  }

  getRepairStrategies(person) {
    const strategies = [];
    
    if (person.neurotype.identified.includes('adhd')) {
      strategies.push('May need help getting back on topic');
      strategies.push('Written follow-up may help retention');
    }
    
    if (person.neurotype.identified.includes('autism')) {
      strategies.push('Be explicit about repair being complete');
      strategies.push('Don\'t expect "reading the room"');
    }
    
    return strategies;
  }

  /**
   * Identify growth areas
   */
  identifyGrowthAreas(p1, p2) {
    return {
      person1Growth: this.getGrowthAreas(p1, p2),
      person2Growth: this.getGrowthAreas(p2, p1),
      sharedGrowth: [
        'Learning each other\'s language of love',
        'Building shared systems that work for both',
        'Creating safety for authentic expression'
      ]
    };
  }

  getGrowthAreas(person, partner) {
    const areas = [];
    
    if (person.neurotype.identified.includes('neurotypical') && 
        partner.neurotype.identified.some(n => n !== 'neurotypical')) {
      areas.push('Learn about partner\'s neurotype');
      areas.push('Practice explicit communication');
      areas.push('Unlearn assumptions about "normal"');
    }
    
    return areas;
  }

  // ============================================
  // TRANSLATION REQUESTS
  // ============================================

  /**
   * Get translation for a specific behavior
   */
  translateBehavior(behaviorId, observerType = 'nt') {
    const translation = this.translations.behaviors[behaviorId];
    if (!translation) return null;
    
    return {
      behavior: behaviorId,
      commonMisinterpretation: translation.ntInterpretation,
      possibleRealities: translation.possibleNDReality,
      howToRespond: translation.bridgePhrase
    };
  }

  /**
   * Get communication translation
   */
  translateCommunication(communicationId) {
    return this.translations.communication[communicationId];
  }

  /**
   * Quick lookup: What might this mean?
   */
  whatMightThisMean(behavior, observerProfile, actorProfile) {
    // Context-aware translation based on specific profiles
    const actor = this.profiles.get(actorProfile);
    if (!actor) return this.translateBehavior(behavior);
    
    // Generate personalized translation
    return {
      behavior,
      forThisSpecificPerson: `Based on ${actor.name}'s profile...`,
      likelyMeaning: this.getPersonalizedMeaning(behavior, actor),
      suggestedResponse: this.getPersonalizedResponse(behavior, actor)
    };
  }

  getPersonalizedMeaning(behavior, actor) {
    // Would look up based on actor's specific neurotype, history, etc.
    return this.translations.behaviors[behavior]?.possibleNDReality || ['Unknown'];
  }

  getPersonalizedResponse(behavior, actor) {
    return this.translations.behaviors[behavior]?.bridgePhrase || 'Ask with curiosity, not judgment.';
  }

  // ============================================
  // LATE DIAGNOSIS SUPPORT
  // ============================================

  /**
   * Get resources for late-diagnosed adults
   */
  getLateDiagnosisSupport(personId) {
    const profile = this.profiles.get(personId);
    if (!profile?.lateDiagnosis) return null;

    return {
      currentStage: profile.lateDiagnosis.griefStage,
      validations: this.getStageValidations(profile.lateDiagnosis.griefStage),
      reframes: this.getReframes(profile.neurotype.identified),
      resources: this.getStageResources(profile.lateDiagnosis.griefStage),
      affirmations: this.getAffirmations()
    };
  }

  getStageValidations(stage) {
    const validations = {
      'denial': [
        'It\'s okay to question. This is a lot to process.',
        'You don\'t have to accept anything immediately.',
        'Taking time to evaluate is valid.'
      ],
      'anger': [
        'Your anger is valid. You deserved support earlier.',
        'It\'s okay to grieve the years without understanding.',
        'Anger at a system that failed you is reasonable.'
      ],
      'bargaining': [
        'Wondering "what if" is part of processing.',
        'You\'re not weak for having needed help.',
        'The past can\'t be changed, but understanding changes everything.'
      ],
      'depression': [
        'Grieving your past self is necessary.',
        'This sadness is love for the child who struggled alone.',
        'It gets better. This is part of healing.'
      ],
      'acceptance': [
        'You\'re integrating this into your identity.',
        'Self-knowledge is power.',
        'You\'re allowed to be proud of who you are.'
      ],
      'integration': [
        'You\'re living authentically now.',
        'Using this knowledge is wisdom.',
        'You can help others on this journey.'
      ]
    };
    return validations[stage] || validations['processing'];
  }

  getReframes(neurotypes) {
    const reframes = {
      'adhd': [
        '"Lazy" → Your brain needs interest/urgency to activate',
        '"Irresponsible" → Executive function is a brain feature, not a character trait',
        '"Too much" → Your enthusiasm and energy are gifts',
        '"Can\'t focus" → You have variable attention, including hyperfocus'
      ],
      'autism': [
        '"Weird" → Your brain processes differently, which gives unique insights',
        '"Cold" → You feel deeply, express differently',
        '"Rigid" → You value consistency and have strong values',
        '"Antisocial" → You connect differently, not less'
      ]
    };
    
    const result = [];
    for (const nt of neurotypes) {
      if (reframes[nt]) result.push(...reframes[nt]);
    }
    return result;
  }

  getAffirmations() {
    return [
      'You are not broken. You are different.',
      'Needing accommodations is not weakness.',
      'Your struggles were real, even undiagnosed.',
      'You survived without knowing why it was so hard. You\'re resilient.',
      'Understanding yourself is not an excuse - it\'s a tool.',
      'You\'re allowed to grieve AND celebrate.',
      'Your brain is not a bug - it\'s a feature.',
      'You deserve love and accommodation.',
      'Late is better than never. You\'re here now.'
    ];
  }

  getStageResources(stage) {
    return {
      books: ['Unmasking Autism', 'Dirty Laundry', 'I Think I Might Be Autistic'],
      communities: ['r/AutismInWomen', 'r/ADHD', 'Neurodivergent Discord servers'],
      practices: ['Self-compassion meditation', 'Identity journaling', 'Community connection']
    };
  }

  // ============================================
  // GENSYNC INTEGRATION - Human Operating Systems
  // ============================================

  /**
   * Initialize Human OS types (Spiral Dynamics / GenSync)
   */
  initializeHumanOS() {
    return {
      'wolf': {
        name: 'Wolf (Guardian/Red)',
        color: 'red',
        keywords: ['Power', 'Pack', 'Respect', 'Forbidden', 'Strength', 'Protect', 'Territory'],
        values: ['Power', 'Respect', 'Loyalty to tribe', 'Self-expression'],
        communicationStyle: 'Direct, commanding, respects strength',
        needs: ['Autonomy', 'Recognition of strength', 'Clear hierarchy'],
        triggers: ['Disrespect', 'Weakness', 'Being controlled'],
        examples: ['Protect your pack', 'This is forbidden', 'Show your power'],
        neurotypesCommon: ['adhd', 'pda'], // Often correlates
        howToSpeak: 'Use power words. Be direct. Show respect. Don\'t be weak or wishy-washy.'
      },
      
      'soldier': {
        name: 'Soldier (Order/Blue)',
        color: 'blue',
        keywords: ['Rules', 'Duty', 'Standard', 'Correct', 'Proper', 'Protocol', 'Discipline'],
        values: ['Order', 'Tradition', 'Authority', 'Purpose', 'Sacrifice'],
        communicationStyle: 'Formal, structured, by-the-book',
        needs: ['Clear rules', 'Structure', 'Purpose', 'Respect for tradition'],
        triggers: ['Chaos', 'Disrespect of authority', 'Breaking rules'],
        examples: ['Follow the protocol', 'This is the correct procedure', 'Duty calls'],
        neurotypesCommon: ['autism'], // Often correlates with need for structure
        howToSpeak: 'Be orderly. Reference rules and standards. Show respect for process.'
      },
      
      'winner': {
        name: 'Winner (Achiever/Orange)',
        color: 'orange',
        keywords: ['Win', 'Profit', 'Fast', 'Strategy', 'Success', 'Opportunity', 'Results'],
        values: ['Achievement', 'Success', 'Progress', 'Science', 'Strategy'],
        communicationStyle: 'Goal-oriented, efficient, data-driven',
        needs: ['Challenges', 'Recognition', 'Autonomy', 'Results'],
        triggers: ['Inefficiency', 'Being held back', 'Wasted time'],
        examples: ['Here\'s the strategy', 'This will maximize profit', 'Fast track to success'],
        neurotypesCommon: ['adhd', 'gifted'], // Often correlates
        howToSpeak: 'Be efficient. Show ROI. Focus on outcomes and wins.'
      },
      
      'healer': {
        name: 'Healer (Empath/Green)',
        color: 'green',
        keywords: ['Vibe', 'Community', 'Feelings', 'Together', 'Harmony', 'Care', 'Share'],
        values: ['Community', 'Equality', 'Harmony', 'Feelings', 'Consensus'],
        communicationStyle: 'Warm, inclusive, feelings-first',
        needs: ['Connection', 'Harmony', 'Feeling heard', 'Community'],
        triggers: ['Exclusion', 'Hierarchy', 'Cold logic without heart'],
        examples: ['How does everyone feel?', 'Let\'s do this together', 'The vibe is important'],
        neurotypesCommon: ['hsp', 'autism'], // Often correlates
        howToSpeak: 'Acknowledge feelings first. Emphasize togetherness. Be warm.'
      },
      
      'builder': {
        name: 'Builder (Integrator/Yellow)',
        color: 'yellow',
        keywords: ['System', 'Flow', 'Design', 'Function', 'Integrate', 'Pattern', 'Meta'],
        values: ['Integration', 'Systems thinking', 'Flexibility', 'Knowledge', 'Natural flow'],
        communicationStyle: 'Flexible, systems-aware, integrative',
        needs: ['Understanding the whole system', 'Freedom to explore', 'Complexity'],
        triggers: ['Rigid either/or thinking', 'Oversimplification', 'Forced conformity'],
        examples: ['Let\'s look at the whole system', 'How does this integrate?', 'The flow needs adjustment'],
        neurotypesCommon: ['audhd', 'gifted'], // Often correlates
        howToSpeak: 'Show the big picture. Discuss systems and patterns. Be flexible.'
      },
      
      'visionary': {
        name: 'Visionary (Holistic/Turquoise)',
        color: 'turquoise',
        keywords: ['Global', 'Interconnected', 'Conscious', 'Holistic', 'Spiritual', 'Unity'],
        values: ['Global harmony', 'Ecological thinking', 'Collective consciousness'],
        communicationStyle: 'Holistic, spiritual, long-term thinking',
        needs: ['Meaning', 'Connection to larger purpose', 'Holistic solutions'],
        triggers: ['Short-term thinking', 'Disconnection', 'Purely materialistic views'],
        examples: ['We\'re all connected', 'Think of the planet', 'The collective consciousness'],
        neurotypesCommon: ['hsp', 'gifted'],
        howToSpeak: 'Connect to larger purpose. Show interconnectedness. Be holistic.'
      }
    };
  }

  /**
   * Initialize GenSync 4 Primitives (Physics of Systems)
   */
  initializeGenSyncPrimitives() {
    return {
      'frequency': {
        name: 'Frequency (Heartbeat)',
        symbol: '~',
        principle: 'Everything needs a rhythm (60Hz). No rhythm = Chaos.',
        inFamily: 'Regular routines, predictable schedules, consistent check-ins',
        violations: [
          'Irregular mealtimes',
          'Unpredictable schedules',
          'No bedtime routine',
          'Random household chaos'
        ],
        fixes: [
          'Establish daily "heartbeat" routines',
          'Create visual schedules',
          'Set regular check-in times',
          'Morning and evening anchors'
        ],
        forND: 'CRITICAL for autism/ADHD - routine = safety. Lack of frequency = anxiety.'
      },
      
      'paralleling': {
        name: 'Paralleling (Equalizer)',
        symbol: '||',
        principle: 'Share the load. If one person works too hard, they burn out.',
        inFamily: 'Distributed responsibilities, no single point of failure, team effort',
        violations: [
          'One parent does everything',
          'All burden on oldest child',
          '"Mom/Dad burnout"',
          'Unfair task distribution'
        ],
        fixes: [
          'Task sharing charts',
          'Rotate responsibilities',
          'Body doubling (working together)',
          'Spoon redistribution'
        ],
        forND: 'ND family members may need different types of tasks, not necessarily fewer.'
      },
      
      'binaryLogic': {
        name: 'Binary Logic (The Cut)',
        symbol: '0/1',
        principle: 'In emergencies, there is no "maybe." It is YES or NO.',
        inFamily: 'Clear emergency protocols, unambiguous boundaries, simple decision trees',
        violations: [
          '"Maybe we\'ll see"',
          'Inconsistent boundaries',
          'Unclear consequences',
          'Wishy-washy responses to meltdowns'
        ],
        fixes: [
          'Yes/No family decisions',
          'Clear meltdown protocol (RED ZONE)',
          'Unambiguous safe words',
          'Binary choices, not open-ended'
        ],
        forND: 'ND brains often need binary clarity. Ambiguity = anxiety. "Maybe" is torture.'
      },
      
      'tetrahedron': {
        name: 'Tetrahedron (Geometry)',
        symbol: '△',
        principle: 'You need 4 points to be strong. A triangle falls over. A pyramid stands.',
        inFamily: 'Multiple support connections, not just parent-child dyads, community',
        violations: [
          'Child only connected to one parent',
          'No outside support network',
          'Isolated nuclear family',
          'Single point of connection failure'
        ],
        fixes: [
          'Build 4+ connection points per person',
          'Grandparents, aunts, friends, therapists',
          'Support groups for ND families',
          'Community mesh network'
        ],
        forND: 'ND families need MORE support nodes, not fewer. Isolation = collapse.'
      }
    };
  }

  /**
   * Detect Human OS from text/behavior
   */
  detectHumanOS(text) {
    const scores = {};
    
    for (const [osId, os] of Object.entries(this.humanOS)) {
      let score = 0;
      const lowerText = text.toLowerCase();
      
      for (const keyword of os.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += 10;
        }
      }
      
      scores[osId] = score;
    }
    
    // Find highest score
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0];
    const secondary = sorted[1];
    
    return {
      primary: { os: primary[0], score: primary[1], data: this.humanOS[primary[0]] },
      secondary: secondary[1] > 0 ? { os: secondary[0], score: secondary[1], data: this.humanOS[secondary[0]] } : null,
      allScores: scores
    };
  }

  /**
   * Translate message for a specific Human OS
   */
  translateForOS(message, targetOS) {
    const os = this.humanOS[targetOS];
    if (!os) return message;
    
    return {
      original: message,
      targetOS: targetOS,
      howToDeliver: os.howToSpeak,
      suggestedKeywords: os.keywords.slice(0, 5),
      reframeSuggestion: `Reframe using: ${os.keywords.slice(0, 3).join(', ')}`,
      avoid: os.triggers
    };
  }

  /**
   * Diagnose family system using GenSync primitives
   */
  diagnoseFamily(familyData) {
    const diagnosis = {
      frequency: { status: 'unknown', issues: [], fixes: [] },
      paralleling: { status: 'unknown', issues: [], fixes: [] },
      binaryLogic: { status: 'unknown', issues: [], fixes: [] },
      tetrahedron: { status: 'unknown', issues: [], fixes: [] },
      overallStability: 0
    };

    // Check Frequency (Routines)
    if (familyData.hasRoutines === false) {
      diagnosis.frequency.status = 'critical';
      diagnosis.frequency.issues.push('No established routines');
      diagnosis.frequency.fixes = this.genSyncPrimitives.frequency.fixes;
    } else {
      diagnosis.frequency.status = 'stable';
    }

    // Check Paralleling (Load distribution)
    if (familyData.singleParentBurnout || familyData.unequalLoad) {
      diagnosis.paralleling.status = 'critical';
      diagnosis.paralleling.issues.push('Load not distributed equally');
      diagnosis.paralleling.fixes = this.genSyncPrimitives.paralleling.fixes;
    } else {
      diagnosis.paralleling.status = 'stable';
    }

    // Check Binary Logic (Clear rules)
    if (familyData.inconsistentBoundaries) {
      diagnosis.binaryLogic.status = 'critical';
      diagnosis.binaryLogic.issues.push('Boundaries unclear or inconsistent');
      diagnosis.binaryLogic.fixes = this.genSyncPrimitives.binaryLogic.fixes;
    } else {
      diagnosis.binaryLogic.status = 'stable';
    }

    // Check Tetrahedron (Support network)
    if (familyData.isolatedFamily || (familyData.supportNodes || 0) < 4) {
      diagnosis.tetrahedron.status = 'critical';
      diagnosis.tetrahedron.issues.push('Insufficient support network');
      diagnosis.tetrahedron.fixes = this.genSyncPrimitives.tetrahedron.fixes;
    } else {
      diagnosis.tetrahedron.status = 'stable';
    }

    // Calculate overall stability
    const statusScores = { 'stable': 25, 'warning': 15, 'critical': 0, 'unknown': 10 };
    diagnosis.overallStability = 
      statusScores[diagnosis.frequency.status] +
      statusScores[diagnosis.paralleling.status] +
      statusScores[diagnosis.binaryLogic.status] +
      statusScores[diagnosis.tetrahedron.status];

    return diagnosis;
  }

  /**
   * Create cross-OS bridge (GenSync + Neurotype)
   */
  createFullBridge(person1Id, person2Id) {
    const p1 = this.profiles.get(person1Id);
    const p2 = this.profiles.get(person2Id);
    
    if (!p1 || !p2) throw new Error('Both profiles required');
    
    // Standard neurotype bridge
    const neurotypeBridge = this.createBridge(person1Id, person2Id);
    
    // Add GenSync Human OS layer
    const humanOSBridge = {
      person1OS: p1.humanOS || this.detectHumanOS(p1.name + ' ' + (p1.specialInterests || []).join(' ')),
      person2OS: p2.humanOS || this.detectHumanOS(p2.name + ' ' + (p2.specialInterests || []).join(' ')),
      
      translationGuide: {
        p1ToP2: p1.humanOS && p2.humanOS ? 
          this.translateForOS('Your message', p2.humanOS.primary?.os || 'builder') : null,
        p2ToP1: p2.humanOS && p1.humanOS ? 
          this.translateForOS('Your message', p1.humanOS.primary?.os || 'builder') : null
      }
    };
    
    return {
      ...neurotypeBridge,
      humanOS: humanOSBridge,
      genSyncPrimitives: this.genSyncPrimitives,
      integratedRecommendations: this.getIntegratedRecommendations(p1, p2)
    };
  }

  /**
   * Get integrated recommendations combining neurotype + GenSync
   */
  getIntegratedRecommendations(p1, p2) {
    const recommendations = [];
    
    // Check if NT + ND combination
    const p1NT = p1.neurotype.identified.includes('neurotypical');
    const p2NT = p2.neurotype.identified.includes('neurotypical');
    
    if (p1NT && !p2NT) {
      recommendations.push({
        priority: 'high',
        for: p1.name,
        message: `Learn ${p2.name}'s neurotype. Your "normal" is not their normal.`,
        genSyncFix: 'Apply BINARY LOGIC: Be explicit. No hints.'
      });
    }
    
    if (!p1NT && p2NT) {
      recommendations.push({
        priority: 'high',
        for: p2.name,
        message: `Learn ${p1.name}'s neurotype. Your "normal" is not their normal.`,
        genSyncFix: 'Apply BINARY LOGIC: Be explicit. No hints.'
      });
    }
    
    // ADHD + Autism combo (AuDHD or partners)
    const p1ADHD = p1.neurotype.identified.includes('adhd');
    const p1Autism = p1.neurotype.identified.includes('autism');
    const p2ADHD = p2.neurotype.identified.includes('adhd');
    const p2Autism = p2.neurotype.identified.includes('autism');
    
    if ((p1ADHD && p2Autism) || (p1Autism && p2ADHD)) {
      recommendations.push({
        priority: 'high',
        for: 'Both',
        message: 'ADHD craves novelty, Autism craves routine. Schedule BOTH.',
        genSyncFix: 'Apply FREQUENCY: Create flexible routine with novelty windows.'
      });
    }
    
    return recommendations;
  }

  /**
   * Add Human OS to profile
   */
  setHumanOS(personId, osType) {
    const profile = this.profiles.get(personId);
    if (!profile) return null;
    
    profile.humanOS = {
      primary: { os: osType, data: this.humanOS[osType] },
      detectedAt: Date.now()
    };
    
    return profile;
  }

  // ============================================
  // STATUS & STATS
  // ============================================

  getStatus() {
    return {
      profiles: this.profiles.size,
      bridges: this.bridges.size,
      neurotypesLibrary: Object.keys(this.neurotypes).length,
      translationsAvailable: Object.keys(this.translations.behaviors).length,
      humanOSTypes: Object.keys(this.humanOS).length,
      genSyncPrimitives: Object.keys(this.genSyncPrimitives).length
    };
  }
  
  /**
   * Get comprehensive statistics
   */
  getStats() {
    const profilesArray = Array.from(this.profiles.values());
    
    // Count by neurotype
    const neurotypeCounts = {};
    for (const profile of profilesArray) {
      for (const nt of profile.neurotype.identified) {
        neurotypeCounts[nt] = (neurotypeCounts[nt] || 0) + 1;
      }
    }
    
    // Count by Human OS
    const osCounts = {};
    for (const profile of profilesArray) {
      if (profile.humanOS?.primary?.os) {
        const os = profile.humanOS.primary.os;
        osCounts[os] = (osCounts[os] || 0) + 1;
      }
    }
    
    return {
      // Core counts
      profiles: {
        total: this.profiles.size,
        byNeurotype: neurotypeCounts,
        byHumanOS: osCounts,
        exploring: profilesArray.filter(p => p.neurotype.exploring).length,
        lateDiagnosed: profilesArray.filter(p => p.lateDiagnosis).length
      },
      
      // Bridges
      bridges: {
        total: this.bridges.size,
        recentlyCreated: Array.from(this.bridges.values())
          .filter(b => Date.now() - b.createdAt < 24 * 60 * 60 * 1000)
          .length
      },
      
      // Interaction log
      interactions: {
        total: this.interactionLog.length,
        last24h: this.interactionLog.filter(i => 
          Date.now() - i.timestamp < 24 * 60 * 60 * 1000
        ).length
      },
      
      // Libraries
      libraries: {
        neurotypes: Object.keys(this.neurotypes).length,
        communicationStyles: Object.keys(this.communicationStyles).length,
        loveLanguages: Object.keys(this.loveLanguages).length,
        conflictPatterns: Object.keys(this.conflictPatterns).length,
        behaviorTranslations: Object.keys(this.translations.behaviors).length,
        humanOSTypes: Object.keys(this.humanOS).length,
        genSyncPrimitives: Object.keys(this.genSyncPrimitives).length
      },
      
      // Config
      config: {
        maxProfiles: this.config.MAX_PROFILES || TRANSLATOR_CONFIG.MAX_PROFILES,
        maxBridges: this.config.MAX_BRIDGES || TRANSLATOR_CONFIG.MAX_BRIDGES
      }
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  TRANSLATOR_CONFIG,
  UniversalTranslator
};

// For backwards compatibility
module.exports.default = UniversalTranslator;
