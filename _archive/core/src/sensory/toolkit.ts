/**
 * SENSORY TOOLKIT - Neurodivergent Regulation & Stim Management System
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🎨
 * 
 * Based on occupational therapy principles for sensory processing
 * Extended with:
 * - 8-modality sensory profiling (including interoception)
 * - AI-powered regulation suggestions
 * - Stim pattern tracking & analysis
 * - Spoon-integrated activity costs
 * - IoT scene integration for environmental control
 * - Calm-down protocol library with guided steps
 * - Sensory diet generation
 */

import { EventEmitter } from 'events';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SENSORY_CONFIG = {
  // Arousal state levels
  AROUSAL_LEVELS: ['too-low', 'low', 'optimal', 'high', 'too-high'],
  
  // Sensory modalities
  MODALITIES: [
    'visual',
    'auditory', 
    'tactile',
    'vestibular',      // Movement/balance
    'proprioceptive',  // Body awareness/deep pressure
    'olfactory',       // Smell
    'gustatory',       // Taste
    'interoceptive'    // Internal body signals
  ],
  
  // Preference types
  PREFERENCE_TYPES: ['seeking', 'avoiding', 'neutral'],
  
  // Tool effect categories
  EFFECT_CATEGORIES: ['calming', 'alerting', 'organizing'],
  
  // Default sensitivity levels
  DEFAULT_SENSITIVITY: 5,
  MIN_SENSITIVITY: 1,
  MAX_SENSITIVITY: 10,
  
  // Session configuration
  SESSION_TIMEOUT_MS: 30 * 60 * 1000,  // 30 minutes
  MAX_STIM_LOG_SIZE: 5000,
  HISTORY_RETENTION_DAYS: 90,
  
  // Spoon costs/restores (baseline)
  SPOON_COSTS: {
    calming_activity: 0.25,
    alerting_activity: 0.5,
    organizing_activity: 0.5,
    protocol_execution: 0.5
  },
  
  // IoT integration settings
  IOT_INTEGRATION: {
    enabled: true,
    dimBrightness: 10,
    brightBrightness: 100,
    emergencyColor: { r: 255, g: 100, b: 50 },  // Warm dim
    calmColor: { r: 100, g: 150, b: 255 },      // Soft blue
    alertColor: { r: 255, g: 200, b: 100 }      // Energizing yellow
  },
  
  // Audio integration
  AUDIO_PRESETS: {
    brown_noise: { type: 'noise', frequency: 'brown', duration: 600 },
    white_noise: { type: 'noise', frequency: 'white', duration: 600 },
    rain_sounds: { type: 'ambient', source: 'rain', duration: 600 },
    upbeat_playlist: { type: 'music', mood: 'energetic', duration: 180 }
  }
};

// ============================================================================
// SENSORY TOOLS DATABASE
// ============================================================================

const SENSORY_TOOLS = {
  // ===== CALMING (High Arousal → Lower) =====
  calming: [
    {
      id: 'deep_pressure',
      name: '🤗 Deep Pressure Hug',
      description: 'Firm, steady pressure like a big hug',
      icon: '🤗',
      modality: 'proprioceptive',
      effect: 'calming',
      instructions: [
        'Find a cozy spot',
        'Wrap yourself in a heavy blanket',
        'Or ask for a big squeeze hug',
        'Hold for 20 seconds, breathing slowly'
      ],
      duration: 60,
      ageMin: 2,
      spoonCost: 0.5,
      spoonRestore: 1,
      intensity: 7,
      tags: ['pressure', 'comfort', 'immediate']
    },
    {
      id: 'weighted_lap_pad',
      name: '🏋️ Weighted Lap Buddy',
      description: 'Put a weighted pad on your lap',
      icon: '🏋️',
      modality: 'proprioceptive',
      effect: 'calming',
      instructions: [
        'Sit comfortably in a chair',
        'Place weighted pad across your thighs',
        'Let the weight settle and ground you',
        'Stay still and breathe deeply'
      ],
      duration: 300,
      ageMin: 3,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 5,
      tags: ['weighted', 'grounding', 'passive']
    },
    {
      id: 'slow_breathing',
      name: '🌬️ Dragon Breath',
      description: 'Breathe in like smelling a flower, out like cooling soup',
      icon: '🌬️',
      modality: 'interoceptive',
      effect: 'calming',
      instructions: [
        '🌸 Smell the flower (breathe in for 4)',
        '🫧 Hold it (hold for 4)',
        '🍜 Cool the soup (breathe out for 6)',
        'Repeat 5 times'
      ],
      duration: 90,
      ageMin: 4,
      spoonCost: 0,
      spoonRestore: 1,
      intensity: 3,
      tags: ['breathing', 'self-regulation', 'portable']
    },
    {
      id: 'noise_cancelling',
      name: '🎧 Quiet Bubble',
      description: 'Put on noise-cancelling headphones',
      icon: '🎧',
      modality: 'auditory',
      effect: 'calming',
      instructions: [
        'Find your headphones',
        'Turn on noise cancelling',
        'Close your eyes if comfortable',
        'Enjoy the quiet'
      ],
      duration: 600,
      ageMin: 3,
      spoonCost: 0,
      spoonRestore: 1.5,
      intensity: 8,
      tags: ['auditory', 'isolation', 'equipment']
    },
    {
      id: 'dim_lights',
      name: '🌙 Gentle Darkness',
      description: 'Dim the lights or use a sleep mask',
      icon: '🌙',
      modality: 'visual',
      effect: 'calming',
      triggersIoT: { action: 'dim', brightness: 10 },
      instructions: [
        'Dim the lights or put on a sleep mask',
        'Find a comfortable position',
        'Let your eyes rest',
        'Notice the calm spreading'
      ],
      duration: 600,
      ageMin: 3,
      spoonCost: 0,
      spoonRestore: 1,
      intensity: 6,
      tags: ['visual', 'environmental', 'restful']
    },
    {
      id: 'cold_water',
      name: '💧 Ice Wizard',
      description: 'Cold water on face or ice cube on wrists',
      icon: '💧',
      modality: 'tactile',
      effect: 'calming',
      instructions: [
        'Get a cup of cold water',
        'Splash some on your face',
        'Or hold ice cubes in your hands',
        'Feel the cool calm spreading'
      ],
      duration: 60,
      ageMin: 5,
      spoonCost: 0.25,
      spoonRestore: 1,
      intensity: 8,
      tags: ['cold', 'tactile', 'immediate']
    },
    {
      id: 'brown_noise',
      name: '🌊 Ocean Brain',
      description: 'Listen to brown noise or rain sounds',
      icon: '🌊',
      modality: 'auditory',
      effect: 'calming',
      triggersAudio: 'brown_noise',
      instructions: [
        'Put on headphones or use speakers',
        'Play brown noise or rain sounds',
        'Close your eyes and listen',
        'Let the sound wash over you'
      ],
      duration: 600,
      ageMin: 2,
      spoonCost: 0,
      spoonRestore: 1,
      intensity: 4,
      tags: ['auditory', 'ambient', 'passive']
    },
    {
      id: 'lavender_scent',
      name: '💜 Lavender Cloud',
      description: 'Smell lavender essential oil or sachets',
      icon: '💜',
      modality: 'olfactory',
      effect: 'calming',
      instructions: [
        'Get lavender oil or sachet',
        'Hold near your nose',
        'Take slow, deep breaths',
        'Notice the calming scent'
      ],
      duration: 120,
      ageMin: 3,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 3,
      tags: ['scent', 'aromatherapy', 'portable']
    },
    {
      id: 'soft_music',
      name: '🎶 Gentle Melodies',
      description: 'Listen to soft, slow music',
      icon: '🎶',
      modality: 'auditory',
      effect: 'calming',
      triggersAudio: 'calm_playlist',
      instructions: [
        'Find a comfortable spot',
        'Play soft, slow music',
        'Let your body relax',
        'Breathe with the rhythm'
      ],
      duration: 300,
      ageMin: 2,
      spoonCost: 0,
      spoonRestore: 1,
      intensity: 3,
      tags: ['music', 'passive', 'ambient']
    }
  ],

  // ===== ALERTING (Low Arousal → Higher) =====
  alerting: [
    {
      id: 'jumping_jacks',
      name: '⭐ Star Jumps',
      description: '10 big jumping jacks!',
      icon: '⭐',
      modality: 'vestibular',
      effect: 'alerting',
      instructions: [
        'Stand with feet together',
        'Jump and spread arms/legs wide',
        'Jump back to start position',
        'Do 10 jumps!'
      ],
      duration: 30,
      ageMin: 4,
      spoonCost: 0.5,
      spoonRestore: 1.5,
      intensity: 8,
      tags: ['movement', 'exercise', 'energizing']
    },
    {
      id: 'cold_drink',
      name: '🧊 Brain Freeze',
      description: 'Sip something cold and crunchy',
      icon: '🧊',
      modality: 'gustatory',
      effect: 'alerting',
      instructions: [
        'Get a cold drink with ice',
        'Chew on the ice cubes',
        'Feel the cold sensation',
        'Notice your brain waking up'
      ],
      duration: 60,
      ageMin: 3,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 6,
      tags: ['oral', 'cold', 'immediate']
    },
    {
      id: 'sour_candy',
      name: '🍋 Sour Power',
      description: 'A sour candy wakes up your brain!',
      icon: '🍋',
      modality: 'gustatory',
      effect: 'alerting',
      instructions: [
        'Get a sour candy',
        'Let it sit on your tongue',
        'Feel the sour sensation',
        'Notice your alertness increase'
      ],
      duration: 60,
      ageMin: 4,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 7,
      tags: ['oral', 'taste', 'immediate']
    },
    {
      id: 'spinning',
      name: '🌀 Spin Cycle',
      description: 'Spin in a circle (carefully!)',
      icon: '🌀',
      modality: 'vestibular',
      effect: 'alerting',
      instructions: [
        'Stand in a clear space',
        'Arms out like airplane wings',
        'Spin slowly 5 times one way',
        'Then 5 times the other way'
      ],
      duration: 30,
      ageMin: 4,
      spoonCost: 0.5,
      spoonRestore: 1,
      intensity: 9,
      tags: ['movement', 'vestibular', 'intense']
    },
    {
      id: 'bright_lights',
      name: '☀️ Sunshine Mode',
      description: 'Turn up the lights',
      icon: '☀️',
      modality: 'visual',
      effect: 'alerting',
      triggersIoT: { action: 'bright', brightness: 100 },
      instructions: [
        'Turn on all the lights',
        'Open curtains/blinds',
        'Face the brightest light',
        'Let the light energize you'
      ],
      duration: 300,
      ageMin: 2,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 5,
      tags: ['visual', 'environmental', 'passive']
    },
    {
      id: 'upbeat_music',
      name: '🎵 Dance Party',
      description: 'Put on your favorite upbeat song!',
      icon: '🎵',
      modality: 'auditory',
      effect: 'alerting',
      triggersAudio: 'upbeat_playlist',
      instructions: [
        'Pick your favorite energetic song',
        'Turn up the volume',
        'Move your body to the beat',
        'Dance like nobody is watching!'
      ],
      duration: 180,
      ageMin: 2,
      spoonCost: 0.5,
      spoonRestore: 2,
      intensity: 7,
      tags: ['music', 'movement', 'fun']
    },
    {
      id: 'wall_pushups',
      name: '💪 Wall Power',
      description: 'Push against the wall 10 times',
      icon: '💪',
      modality: 'proprioceptive',
      effect: 'alerting',
      instructions: [
        'Stand arm\'s length from wall',
        'Place hands on wall, shoulder width',
        'Do 10 push-ups against wall',
        'Feel your muscles working'
      ],
      duration: 30,
      ageMin: 4,
      spoonCost: 0.25,
      spoonRestore: 1,
      intensity: 6,
      tags: ['exercise', 'proprioceptive', 'quick']
    },
    {
      id: 'peppermint_scent',
      name: '🌿 Peppermint Power',
      description: 'Smell peppermint for alertness',
      icon: '🌿',
      modality: 'olfactory',
      effect: 'alerting',
      instructions: [
        'Get peppermint oil or candy',
        'Hold near your nose',
        'Take a deep breath',
        'Feel the refreshing sensation'
      ],
      duration: 60,
      ageMin: 4,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 5,
      tags: ['scent', 'aromatherapy', 'quick']
    },
    {
      id: 'cold_face_splash',
      name: '💦 Wake Up Splash',
      description: 'Cold water on face for instant alertness',
      icon: '💦',
      modality: 'tactile',
      effect: 'alerting',
      instructions: [
        'Go to the sink',
        'Run cold water',
        'Splash on your face',
        'Pat dry with towel'
      ],
      duration: 30,
      ageMin: 5,
      spoonCost: 0.25,
      spoonRestore: 1,
      intensity: 8,
      tags: ['cold', 'tactile', 'immediate']
    }
  ],

  // ===== ORGANIZING (Any State → Optimal) =====
  organizing: [
    {
      id: 'heavy_work',
      name: '🏗️ Heavy Helper',
      description: 'Carry something heavy or push/pull',
      icon: '🏗️',
      modality: 'proprioceptive',
      effect: 'organizing',
      examples: [
        'Carry grocery bags',
        'Push a laundry basket',
        'Stack heavy books',
        'Wheelbarrow walk'
      ],
      instructions: [
        'Find something heavy to carry',
        'Use proper lifting technique',
        'Carry it across the room',
        'Repeat several times'
      ],
      duration: 300,
      ageMin: 4,
      spoonCost: 1,
      spoonRestore: 2,
      intensity: 7,
      tags: ['heavy work', 'proprioceptive', 'organizing']
    },
    {
      id: 'chewy_snack',
      name: '🥨 Chewy Challenge',
      description: 'Eat something chewy (bagel, jerky, dried fruit)',
      icon: '🥨',
      modality: 'proprioceptive',
      effect: 'organizing',
      instructions: [
        'Get a chewy snack',
        'Chew slowly and deliberately',
        'Notice the resistance',
        'Feel your jaw muscles working'
      ],
      duration: 300,
      ageMin: 4,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 4,
      tags: ['oral', 'chewy', 'snack']
    },
    {
      id: 'fidget_time',
      name: '🔮 Fidget Magic',
      description: 'Use a fidget toy for 5 minutes',
      icon: '🔮',
      modality: 'tactile',
      effect: 'organizing',
      instructions: [
        'Get your favorite fidget toy',
        'Manipulate it with your hands',
        'Focus on the sensation',
        'Let your mind settle'
      ],
      duration: 300,
      ageMin: 3,
      spoonCost: 0,
      spoonRestore: 0.5,
      intensity: 2,
      tags: ['tactile', 'fidget', 'portable']
    },
    {
      id: 'swinging',
      name: '🎠 Swing Time',
      description: 'Swing on a swing or hammock',
      icon: '🎠',
      modality: 'vestibular',
      effect: 'organizing',
      instructions: [
        'Find a swing or hammock',
        'Sit and start gentle swinging',
        'Keep a steady rhythm',
        'Breathe deeply as you swing'
      ],
      duration: 600,
      ageMin: 2,
      spoonCost: 0.5,
      spoonRestore: 2,
      intensity: 5,
      tags: ['vestibular', 'rhythmic', 'relaxing']
    },
    {
      id: 'texture_box',
      name: '📦 Texture Treasure',
      description: 'Dig in rice, beans, or kinetic sand',
      icon: '📦',
      modality: 'tactile',
      effect: 'organizing',
      instructions: [
        'Get a bin with rice/sand/beans',
        'Dig your hands deep inside',
        'Find hidden objects',
        'Let the texture soothe you'
      ],
      duration: 600,
      ageMin: 2,
      spoonCost: 0.25,
      spoonRestore: 1.5,
      intensity: 4,
      tags: ['tactile', 'sensory bin', 'exploratory']
    },
    {
      id: 'body_sock',
      name: '🧦 Body Sock Adventure',
      description: 'Stretch and move in a body sock',
      icon: '🧦',
      modality: 'proprioceptive',
      effect: 'organizing',
      instructions: [
        'Get inside the body sock',
        'Stretch your arms and legs',
        'Push against the fabric',
        'Feel the resistance all around'
      ],
      duration: 300,
      ageMin: 3,
      spoonCost: 0.5,
      spoonRestore: 1.5,
      intensity: 6,
      tags: ['proprioceptive', 'full body', 'equipment']
    },
    {
      id: 'rocking_chair',
      name: '🪑 Rock and Roll',
      description: 'Rock in a rocking chair',
      icon: '🪑',
      modality: 'vestibular',
      effect: 'organizing',
      instructions: [
        'Sit in a rocking chair',
        'Start gentle rocking',
        'Keep a steady rhythm',
        'Close your eyes if comfortable'
      ],
      duration: 600,
      ageMin: 2,
      spoonCost: 0,
      spoonRestore: 1,
      intensity: 3,
      tags: ['vestibular', 'passive', 'rhythmic']
    },
    {
      id: 'playdough',
      name: '🎨 Playdough Power',
      description: 'Squeeze, roll, and mold playdough',
      icon: '🎨',
      modality: 'tactile',
      effect: 'organizing',
      instructions: [
        'Get a ball of playdough',
        'Squeeze it hard in your fist',
        'Roll it into snakes',
        'Press and mold into shapes'
      ],
      duration: 600,
      ageMin: 2,
      spoonCost: 0.25,
      spoonRestore: 1,
      intensity: 4,
      tags: ['tactile', 'creative', 'portable']
    }
  ]
};

// ============================================================================
// CALM DOWN PROTOCOLS
// ============================================================================

const CALM_DOWN_PROTOCOLS = {
  'early_warning': {
    id: 'early_warning',
    name: '🟡 Yellow Zone Protocol',
    description: 'When you notice first signs of dysregulation',
    severity: 'mild',
    steps: [
      { action: 'recognize', text: '🧠 "I notice my body feels different"', duration: 10 },
      { action: 'breathe', text: '🌬️ 3 dragon breaths', duration: 30 },
      { action: 'choose', text: '🎯 Pick ONE calming tool', duration: 10 },
      { action: 'do', text: '⏰ Use it for 2-5 minutes', duration: 180 },
      { action: 'check', text: '💚 Check: Am I feeling more green?', duration: 10 }
    ],
    spoonCost: 0.25,
    spoonRestore: 1,
    triggersIoT: null
  },
  
  'red_zone': {
    id: 'red_zone',
    name: '🔴 Red Zone Emergency',
    description: 'When close to or in meltdown',
    severity: 'severe',
    steps: [
      { action: 'stop', text: '🛑 STOP - Everything stops', duration: 5 },
      { action: 'safe', text: '🏠 Go to safe space', duration: 30 },
      { action: 'quiet', text: '🔇 Reduce all input (lights, sound)', duration: 10 },
      { action: 'pressure', text: '🤗 Deep pressure (blanket, hug)', duration: 120 },
      { action: 'wait', text: '⏳ Wait. No talking. Just wait.', duration: 300 },
      { action: 'recover', text: '🩹 Recovery snack & drink when ready', duration: 60 }
    ],
    spoonCost: 0.5,
    spoonRestore: 2,
    triggersIoT: { 
      action: 'emergency_calm',
      lights: 'dim_warm',
      sound: 'off',
      notify: 'guardians'
    }
  },
  
  'grounding_54321': {
    id: 'grounding_54321',
    name: '👋 5-4-3-2-1 Grounding',
    description: 'When feeling disconnected or anxious',
    severity: 'moderate',
    steps: [
      { action: 'see', text: '👀 Name 5 things you can SEE', duration: 30 },
      { action: 'touch', text: '✋ Name 4 things you can TOUCH', duration: 30 },
      { action: 'hear', text: '👂 Name 3 things you can HEAR', duration: 30 },
      { action: 'smell', text: '👃 Name 2 things you can SMELL', duration: 30 },
      { action: 'taste', text: '👅 Name 1 thing you can TASTE', duration: 30 }
    ],
    spoonCost: 0.25,
    spoonRestore: 0.5,
    triggersIoT: null
  },
  
  'lime_drag': {
    id: 'lime_drag',
    name: '🍋 Lime Drag Protocol',
    description: 'Trigeminal nerve activation for instant grounding',
    severity: 'moderate',
    steps: [
      { action: 'get', text: '🧊 Get: Ice + Lime + Salt', duration: 30 },
      { action: 'lick', text: '👅 Lick the lime', duration: 10 },
      { action: 'salt', text: '🧂 Add a tiny bit of salt', duration: 5 },
      { action: 'ice', text: '🧊 Hold ice on your wrist', duration: 60 },
      { action: 'breathe', text: '🌬️ Breathe and feel your body', duration: 30 }
    ],
    spoonCost: 0.25,
    spoonRestore: 1.5,
    triggersIoT: null
  },

  'body_scan': {
    id: 'body_scan',
    name: '🧘 Body Scan Adventure',
    description: 'Notice each part of your body',
    severity: 'mild',
    steps: [
      { action: 'feet', text: '🦶 Notice your feet. Wiggle toes.', duration: 20 },
      { action: 'legs', text: '🦵 Notice your legs. Are they heavy?', duration: 20 },
      { action: 'tummy', text: '🫃 Notice your tummy. Is it tight?', duration: 20 },
      { action: 'hands', text: '🤲 Notice your hands. Squeeze and release.', duration: 20 },
      { action: 'shoulders', text: '🤷 Notice shoulders. Drop them down.', duration: 20 },
      { action: 'face', text: '😊 Notice your face. Relax your jaw.', duration: 20 }
    ],
    spoonCost: 0,
    spoonRestore: 1,
    triggersIoT: { action: 'dim', brightness: 30 }
  },
  
  'butterfly_hug': {
    id: 'butterfly_hug',
    name: '🦋 Butterfly Hug',
    description: 'Self-administered bilateral stimulation',
    severity: 'moderate',
    steps: [
      { action: 'position', text: '🤗 Cross arms over chest, hands on shoulders', duration: 10 },
      { action: 'tap', text: '👐 Tap alternating shoulders slowly', duration: 60 },
      { action: 'breathe', text: '🌬️ Breathe slowly while tapping', duration: 60 },
      { action: 'slow', text: '🐢 Slow the tapping gradually', duration: 30 },
      { action: 'rest', text: '💤 Rest with hands still on shoulders', duration: 30 }
    ],
    spoonCost: 0,
    spoonRestore: 1,
    triggersIoT: null
  }
};

// ============================================================================
// STIM CATEGORIES
// ============================================================================

const STIM_CATEGORIES = {
  visual: [
    { id: 'watching_spinning', name: 'Watching things spin', icon: '🌀', healthy: true },
    { id: 'light_patterns', name: 'Looking at light patterns', icon: '✨', healthy: true },
    { id: 'lining_up', name: 'Lining things up', icon: '📏', healthy: true },
    { id: 'color_sorting', name: 'Sorting by color', icon: '🌈', healthy: true },
    { id: 'watching_fans', name: 'Watching fans/wheels', icon: '🎡', healthy: true }
  ],
  auditory: [
    { id: 'humming', name: 'Humming', icon: '🎵', healthy: true },
    { id: 'echolalia', name: 'Repeating sounds/words', icon: '🔁', healthy: true },
    { id: 'clicking', name: 'Clicking or snapping', icon: '👆', healthy: true },
    { id: 'vocalizing', name: 'Making sounds', icon: '🗣️', healthy: true },
    { id: 'scripting', name: 'Repeating movie lines', icon: '🎬', healthy: true }
  ],
  tactile: [
    { id: 'rubbing_textures', name: 'Rubbing textures', icon: '🧸', healthy: true },
    { id: 'picking', name: 'Picking at things', icon: '🤏', healthy: false },
    { id: 'squeezing', name: 'Squeezing/pinching', icon: '✊', healthy: true },
    { id: 'hair_twirling', name: 'Hair twirling', icon: '💇', healthy: true },
    { id: 'nail_biting', name: 'Nail biting', icon: '💅', healthy: false }
  ],
  vestibular: [
    { id: 'rocking', name: 'Rocking back and forth', icon: '🪑', healthy: true },
    { id: 'spinning_self', name: 'Spinning', icon: '💫', healthy: true },
    { id: 'bouncing', name: 'Bouncing', icon: '⬆️', healthy: true },
    { id: 'swaying', name: 'Swaying', icon: '🌊', healthy: true },
    { id: 'head_shaking', name: 'Head shaking', icon: '🙅', healthy: true }
  ],
  proprioceptive: [
    { id: 'hand_flapping', name: 'Hand flapping', icon: '🙌', healthy: true },
    { id: 'jumping', name: 'Jumping', icon: '🦘', healthy: true },
    { id: 'crashing', name: 'Crashing into things', icon: '💥', healthy: false },
    { id: 'chewing', name: 'Chewing (non-food)', icon: '😬', healthy: false },
    { id: 'finger_flicking', name: 'Finger flicking', icon: '🤌', healthy: true }
  ]
};

// ============================================================================
// SENSORY PROFILE CLASS
// ============================================================================

/**
 * Individual sensory profile for a hero
 */
class SensoryProfile {
  constructor(heroId, preferences = {}) {
    this.heroId = heroId;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    
    // Sensory seeking vs avoiding per modality
    this.preferences = {};
    for (const modality of SENSORY_CONFIG.MODALITIES) {
      this.preferences[modality] = preferences[modality] || 'neutral';
    }
    
    // Known triggers
    this.triggers = preferences.triggers || [];
    
    // Favorite calming activities
    this.favoriteCalm = preferences.favoriteCalm || [];
    
    // Favorite stims
    this.favoriteStims = preferences.favoriteStims || [];
    
    // Safe foods (texture safe)
    this.safeFoods = preferences.safeFoods || [];
    
    // Sensitivity levels (1-10)
    this.noiseSensitivity = preferences.noiseSensitivity || SENSORY_CONFIG.DEFAULT_SENSITIVITY;
    this.lightSensitivity = preferences.lightSensitivity || SENSORY_CONFIG.DEFAULT_SENSITIVITY;
    this.touchSensitivity = preferences.touchSensitivity || SENSORY_CONFIG.DEFAULT_SENSITIVITY;
    this.movementSensitivity = preferences.movementSensitivity || SENSORY_CONFIG.DEFAULT_SENSITIVITY;
    
    // Current sensory state
    this.currentState = {
      arousal: 'optimal',
      lastCheck: Date.now(),
      needsSupport: false
    };
    
    // Stats
    this.stats = {
      regulationSuccess: 0,
      meltdownsAvoided: 0,
      sessionsCompleted: 0,
      favoriteToolsUsed: {}
    };
  }
  
  /**
   * Update arousal state
   */
  updateState(arousal) {
    const previous = this.currentState.arousal;
    this.currentState = {
      arousal,
      lastCheck: Date.now(),
      needsSupport: arousal === 'too-low' || arousal === 'too-high'
    };
    this.updatedAt = Date.now();
    return { previous, current: arousal };
  }
  
  /**
   * Record tool usage
   */
  recordToolUse(toolId, helpful) {
    if (!this.stats.favoriteToolsUsed[toolId]) {
      this.stats.favoriteToolsUsed[toolId] = { count: 0, helpful: 0 };
    }
    this.stats.favoriteToolsUsed[toolId].count++;
    if (helpful) {
      this.stats.favoriteToolsUsed[toolId].helpful++;
    }
    
    // Auto-favorite if used 3+ times with 60%+ success
    const usage = this.stats.favoriteToolsUsed[toolId];
    if (usage.count >= 3 && (usage.helpful / usage.count) >= 0.6) {
      if (!this.favoriteCalm.includes(toolId)) {
        this.favoriteCalm.push(toolId);
      }
    }
    
    this.updatedAt = Date.now();
  }
  
  /**
   * Get profile summary
   */
  toJSON() {
    return {
      heroId: this.heroId,
      preferences: this.preferences,
      triggers: this.triggers,
      favoriteCalm: this.favoriteCalm,
      favoriteStims: this.favoriteStims,
      sensitivities: {
        noise: this.noiseSensitivity,
        light: this.lightSensitivity,
        touch: this.touchSensitivity,
        movement: this.movementSensitivity
      },
      currentState: this.currentState,
      stats: this.stats
    };
  }
}

// ============================================================================
// MAIN SENSORY TOOLKIT CLASS
// ============================================================================

/**
 * Sensory Toolkit for Neurodivergent Kids
 * Regulation tools, stim tracking, calm-down protocols
 * Integrates with L.O.V.E. Economy for spoon-aware suggestions
 */
class SensoryToolkit extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...SENSORY_CONFIG, ...config };
    
    // Sensory profiles per hero
    this.profiles = new Map();
    
    // Active regulation sessions
    this.activeSessions = new Map();
    
    // Stim tracking
    this.stimLog = [];
    
    // Protocol history
    this.protocolHistory = [];
    
    // Stats
    this.stats = {
      profilesCreated: 0,
      sessionsStarted: 0,
      sessionsCompleted: 0,
      protocolsExecuted: 0,
      stimsLogged: 0,
      iotTriggered: 0
    };
    
    console.log('[SensoryToolkit] Initialized with', 
      Object.keys(SENSORY_TOOLS).length, 'tool categories,',
      Object.keys(CALM_DOWN_PROTOCOLS).length, 'protocols');
  }

  // ============================================
  // SENSORY PROFILE MANAGEMENT
  // ============================================

  /**
   * Create sensory profile for a hero
   */
  createProfile(heroId, preferences = {}) {
    const profile = new SensoryProfile(heroId, preferences);
    this.profiles.set(heroId, profile);
    this.stats.profilesCreated++;
    
    this.emit('profile_created', { heroId, profile: profile.toJSON() });
    return profile;
  }
  
  /**
   * Get profile for hero
   */
  getProfile(heroId) {
    return this.profiles.get(heroId) || null;
  }
  
  /**
   * Update profile preferences
   */
  updateProfile(heroId, updates) {
    const profile = this.profiles.get(heroId);
    if (!profile) return null;
    
    // Update fields
    if (updates.preferences) {
      Object.assign(profile.preferences, updates.preferences);
    }
    if (updates.triggers) {
      profile.triggers = [...new Set([...profile.triggers, ...updates.triggers])];
    }
    if (updates.noiseSensitivity !== undefined) {
      profile.noiseSensitivity = Math.max(1, Math.min(10, updates.noiseSensitivity));
    }
    if (updates.lightSensitivity !== undefined) {
      profile.lightSensitivity = Math.max(1, Math.min(10, updates.lightSensitivity));
    }
    
    profile.updatedAt = Date.now();
    this.emit('profile_updated', { heroId, updates });
    return profile;
  }

  /**
   * Update sensory state for hero
   */
  updateState(heroId, arousal, source = 'manual') {
    const profile = this.profiles.get(heroId);
    if (!profile) return null;

    const { previous, current } = profile.updateState(arousal);
    
    this.emit('state_changed', { 
      heroId, 
      previousState: previous, 
      newState: current, 
      source 
    });

    // Auto-suggest tools if needed
    if (profile.currentState.needsSupport) {
      const suggestions = this.getSuggestions(heroId);
      this.emit('support_needed', { heroId, arousal, suggestions });
    }

    return profile.currentState;
  }

  // ============================================
  // TOOL MANAGEMENT
  // ============================================
  
  /**
   * Get all tools
   */
  getAllTools() {
    return SENSORY_TOOLS;
  }
  
  /**
   * Get tools by category
   */
  getToolsByCategory(category) {
    return SENSORY_TOOLS[category] || [];
  }
  
  /**
   * Get tools by modality
   */
  getToolsByModality(modality) {
    const tools = [];
    for (const category of Object.values(SENSORY_TOOLS)) {
      tools.push(...category.filter(t => t.modality === modality));
    }
    return tools;
  }

  /**
   * Find tool by ID
   */
  findTool(toolId) {
    for (const category of Object.values(SENSORY_TOOLS)) {
      const tool = category.find(t => t.id === toolId);
      if (tool) return tool;
    }
    return null;
  }

  // ============================================
  // SUGGESTIONS ENGINE
  // ============================================

  /**
   * Get personalized tool suggestions
   */
  getSuggestions(heroId, options = {}) {
    const profile = this.profiles.get(heroId);
    if (!profile) return [];

    const arousal = profile.currentState.arousal;
    const spoonBudget = options.spoonBudget || 12;
    const maxAge = options.maxAge;
    
    let toolCategory;
    switch (arousal) {
      case 'too-high':
      case 'high':
        toolCategory = 'calming';
        break;
      case 'too-low':
      case 'low':
        toolCategory = 'alerting';
        break;
      default:
        toolCategory = 'organizing';
    }

    // Get tools from category
    let tools = [...SENSORY_TOOLS[toolCategory]];

    // Filter by preferences
    tools = tools.filter(tool => {
      // Check modality preference
      const pref = profile.preferences[tool.modality];
      if (pref === 'avoiding') return false;
      
      // Check spoon budget
      if (tool.spoonCost > spoonBudget) return false;
      
      // Check age if specified
      if (maxAge && tool.ageMin > maxAge) return false;

      return true;
    });

    // Score and sort tools
    tools = tools.map(tool => {
      let score = 0;
      
      // Boost favorites
      if (profile.favoriteCalm.includes(tool.id)) score += 10;
      
      // Boost seeking modalities
      if (profile.preferences[tool.modality] === 'seeking') score += 5;
      
      // Consider usage history
      const usage = profile.stats.favoriteToolsUsed[tool.id];
      if (usage) {
        const successRate = usage.helpful / usage.count;
        score += successRate * 5;
      }
      
      // Spoon efficiency (restore / cost ratio)
      if (tool.spoonCost > 0) {
        score += (tool.spoonRestore / tool.spoonCost) * 2;
      } else {
        score += tool.spoonRestore * 2;
      }
      
      return { ...tool, score };
    });
    
    // Sort by score descending
    tools.sort((a, b) => b.score - a.score);

    // Return top suggestions
    return tools.slice(0, options.limit || 3);
  }

  // ============================================
  // REGULATION SESSIONS
  // ============================================

  /**
   * Start a regulation session with a tool
   */
  startSession(heroId, toolId) {
    const tool = this.findTool(toolId);
    if (!tool) {
      return { success: false, error: 'Tool not found' };
    }

    const profile = this.profiles.get(heroId);
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      heroId,
      toolId,
      tool,
      startedAt: Date.now(),
      arousalBefore: profile?.currentState.arousal || 'unknown',
      status: 'active',
      stepIndex: 0
    };

    this.activeSessions.set(session.id, session);
    this.stats.sessionsStarted++;
    
    this.emit('session_started', { heroId, session });

    // Trigger IoT actions if specified
    if (tool.triggersIoT) {
      this.emit('trigger_iot', { ...tool.triggersIoT, sessionId: session.id });
      this.stats.iotTriggered++;
    }

    // Trigger audio if specified
    if (tool.triggersAudio) {
      const audioPreset = this.config.AUDIO_PRESETS[tool.triggersAudio];
      this.emit('trigger_audio', { preset: tool.triggersAudio, ...audioPreset, sessionId: session.id });
    }

    return { success: true, session };
  }

  /**
   * Complete a session
   */
  completeSession(sessionId, feedback = {}) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    session.status = 'completed';
    session.completedAt = Date.now();
    session.duration = session.completedAt - session.startedAt;
    session.feedback = {
      arousalAfter: feedback.arousalAfter || 'unknown',
      helpful: feedback.helpful,
      wouldUseAgain: feedback.wouldUseAgain,
      notes: feedback.notes
    };

    this.activeSessions.delete(sessionId);
    this.stats.sessionsCompleted++;

    // Update profile stats
    const profile = this.profiles.get(session.heroId);
    if (profile) {
      profile.recordToolUse(session.toolId, feedback.helpful);
      if (feedback.helpful) {
        profile.stats.regulationSuccess++;
        profile.stats.sessionsCompleted++;
      }
    }

    this.emit('session_completed', { session, feedback });

    // Award XP if helpful
    if (feedback.helpful) {
      this.emit('award_xp', { 
        heroId: session.heroId, 
        amount: 15, 
        reason: 'Used regulation tool' 
      });
    }

    return { success: true, session };
  }

  /**
   * Cancel an active session
   */
  cancelSession(sessionId, reason = 'user_cancelled') {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }
    
    session.status = 'cancelled';
    session.cancelledAt = Date.now();
    session.cancelReason = reason;
    
    this.activeSessions.delete(sessionId);
    this.emit('session_cancelled', { session, reason });
    
    return { success: true, session };
  }

  // ============================================
  // CALM DOWN PROTOCOLS
  // ============================================

  /**
   * Get all protocols
   */
  getAllProtocols() {
    return CALM_DOWN_PROTOCOLS;
  }

  /**
   * Run a calm-down protocol
   */
  startProtocol(heroId, protocolId) {
    const protocol = CALM_DOWN_PROTOCOLS[protocolId];
    if (!protocol) {
      return { success: false, error: 'Protocol not found' };
    }

    const profile = this.profiles.get(heroId);
    const session = {
      id: `protocol_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      heroId,
      protocolId,
      protocol,
      startedAt: Date.now(),
      arousalBefore: profile?.currentState.arousal || 'unknown',
      status: 'active',
      currentStep: 0,
      stepsCompleted: []
    };

    this.activeSessions.set(session.id, session);
    this.stats.protocolsExecuted++;
    
    this.emit('protocol_started', { heroId, session });

    // Trigger IoT for emergency protocols
    if (protocol.triggersIoT) {
      this.emit('trigger_iot', { ...protocol.triggersIoT, sessionId: session.id });
      this.stats.iotTriggered++;
    }

    return { success: true, session };
  }
  
  /**
   * Advance to next protocol step
   */
  advanceProtocolStep(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.protocol) {
      return { success: false, error: 'Protocol session not found' };
    }
    
    // Mark current step complete
    session.stepsCompleted.push({
      step: session.currentStep,
      completedAt: Date.now()
    });
    
    // Advance to next step
    session.currentStep++;
    
    // Check if protocol complete
    if (session.currentStep >= session.protocol.steps.length) {
      return this.completeProtocol(sessionId);
    }
    
    const nextStep = session.protocol.steps[session.currentStep];
    this.emit('protocol_step_advanced', { 
      sessionId, 
      step: session.currentStep,
      nextStep 
    });
    
    return { 
      success: true, 
      currentStep: session.currentStep,
      nextStep,
      remainingSteps: session.protocol.steps.length - session.currentStep
    };
  }
  
  /**
   * Complete a protocol
   */
  completeProtocol(sessionId, feedback = {}) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }
    
    session.status = 'completed';
    session.completedAt = Date.now();
    session.duration = session.completedAt - session.startedAt;
    session.feedback = feedback;
    
    this.protocolHistory.push({
      ...session,
      timestamp: Date.now()
    });
    
    // Keep history bounded
    if (this.protocolHistory.length > 1000) {
      this.protocolHistory = this.protocolHistory.slice(-500);
    }
    
    this.activeSessions.delete(sessionId);
    
    // Update profile
    const profile = this.profiles.get(session.heroId);
    if (profile && feedback.helpful) {
      profile.stats.meltdownsAvoided++;
    }
    
    this.emit('protocol_completed', { session, feedback });
    
    // Award XP
    this.emit('award_xp', {
      heroId: session.heroId,
      amount: 25,
      reason: 'Completed calm-down protocol'
    });
    
    return { success: true, session };
  }

  // ============================================
  // STIM TRACKING
  // ============================================

  /**
   * Log a stim occurrence
   */
  logStim(heroId, stimId, context = {}) {
    const entry = {
      id: `stim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      heroId,
      stimId,
      timestamp: Date.now(),
      context: {
        arousal: context.arousal || 'unknown',
        location: context.location || 'unknown',
        trigger: context.trigger || 'unknown',
        helpful: context.helpful,
        duration: context.duration
      }
    };

    this.stimLog.push(entry);
    this.stats.stimsLogged++;
    
    // Keep log bounded
    if (this.stimLog.length > this.config.MAX_STIM_LOG_SIZE) {
      this.stimLog = this.stimLog.slice(-Math.floor(this.config.MAX_STIM_LOG_SIZE / 2));
    }
    
    // Update profile favorites
    const profile = this.profiles.get(heroId);
    if (profile && !profile.favoriteStims.includes(stimId)) {
      profile.favoriteStims.push(stimId);
    }

    this.emit('stim_logged', entry);
    return entry;
  }

  /**
   * Get stim patterns for hero
   */
  getStimPatterns(heroId) {
    const heroStims = this.stimLog.filter(s => s.heroId === heroId);
    
    // Count frequency
    const frequency = {};
    heroStims.forEach(s => {
      frequency[s.stimId] = (frequency[s.stimId] || 0) + 1;
    });

    // Find triggers
    const triggers = {};
    heroStims.forEach(s => {
      if (s.context.trigger !== 'unknown') {
        triggers[s.context.trigger] = (triggers[s.context.trigger] || 0) + 1;
      }
    });
    
    // Time patterns
    const hourly = {};
    heroStims.forEach(s => {
      const hour = new Date(s.timestamp).getHours();
      hourly[hour] = (hourly[hour] || 0) + 1;
    });

    return {
      totalStims: heroStims.length,
      frequency,
      topStims: Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({ id, count })),
      triggers: Object.entries(triggers)
        .sort((a, b) => b[1] - a[1])
        .map(([trigger, count]) => ({ trigger, count })),
      hourlyDistribution: hourly
    };
  }
  
  /**
   * Get stim categories
   */
  getStimCategories() {
    return STIM_CATEGORIES;
  }

  // ============================================
  // SENSORY DIET GENERATOR
  // ============================================

  /**
   * Generate a sensory diet (daily schedule of activities)
   */
  generateSensoryDiet(heroId, options = {}) {
    const profile = this.profiles.get(heroId);
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    const diet = {
      heroId,
      generatedAt: Date.now(),
      morning: [],
      midday: [],
      afternoon: [],
      evening: [],
      asNeeded: []
    };
    
    // Filter tools by profile preferences
    const filterByProfile = (tools) => {
      return tools.filter(t => profile.preferences[t.modality] !== 'avoiding');
    };

    // Morning: Alerting activities
    const alerting = filterByProfile(SENSORY_TOOLS.alerting);
    diet.morning = alerting.slice(0, 2).map(t => ({
      ...t,
      suggestedTime: '7:00 AM - 8:00 AM',
      reason: 'Wake up the nervous system'
    }));

    // Midday: Organizing (helps focus for school/activities)
    const organizing = filterByProfile(SENSORY_TOOLS.organizing);
    diet.midday = organizing.slice(0, 2).map(t => ({
      ...t,
      suggestedTime: '11:00 AM - 12:00 PM',
      reason: 'Prepare for focused activities'
    }));

    // Afternoon: Mix of alerting and organizing
    diet.afternoon = [
      ...alerting.slice(2, 3),
      ...organizing.slice(2, 3)
    ].map(t => ({
      ...t,
      suggestedTime: '3:00 PM - 4:00 PM',
      reason: 'Combat afternoon slump'
    }));

    // Evening: Calming activities
    const calming = filterByProfile(SENSORY_TOOLS.calming);
    diet.evening = calming.slice(0, 3).map(t => ({
      ...t,
      suggestedTime: '7:00 PM - 8:00 PM',
      reason: 'Wind down for sleep'
    }));
    
    // As needed tools based on favorites
    diet.asNeeded = profile.favoriteCalm
      .map(id => this.findTool(id))
      .filter(Boolean)
      .slice(0, 3);

    this.emit('diet_generated', { heroId, diet });
    return { success: true, diet };
  }

  // ============================================
  // STATUS & STATS
  // ============================================

  /**
   * Get comprehensive status
   */
  getStatus() {
    return {
      profileCount: this.profiles.size,
      activeSessions: this.activeSessions.size,
      totalStims: this.stimLog.length,
      toolCategories: Object.keys(SENSORY_TOOLS),
      protocolCount: Object.keys(CALM_DOWN_PROTOCOLS).length,
      config: {
        modalities: this.config.MODALITIES,
        arousalLevels: this.config.AROUSAL_LEVELS
      }
    };
  }
  
  /**
   * Get detailed statistics
   */
  getStats() {
    const activeSessions = Array.from(this.activeSessions.values());
    
    return {
      // Core stats
      ...this.stats,
      
      // Profile breakdown
      profiles: {
        total: this.profiles.size,
        byArousal: this._countByArousal()
      },
      
      // Session stats
      sessions: {
        active: this.activeSessions.size,
        activeDetails: activeSessions.map(s => ({
          id: s.id,
          heroId: s.heroId,
          type: s.protocol ? 'protocol' : 'tool',
          duration: Date.now() - s.startedAt
        }))
      },
      
      // Stim stats
      stims: {
        total: this.stimLog.length,
        last24h: this.stimLog.filter(s => 
          Date.now() - s.timestamp < 24 * 60 * 60 * 1000
        ).length
      },
      
      // Tool usage
      toolUsage: this._getToolUsageStats(),
      
      // Protocol usage
      protocolUsage: this._getProtocolUsageStats()
    };
  }
  
  _countByArousal() {
    const counts = {};
    for (const level of this.config.AROUSAL_LEVELS) {
      counts[level] = 0;
    }
    for (const profile of this.profiles.values()) {
      const arousal = profile.currentState.arousal;
      if (counts[arousal] !== undefined) {
        counts[arousal]++;
      }
    }
    return counts;
  }
  
  _getToolUsageStats() {
    const usage = {};
    for (const profile of this.profiles.values()) {
      for (const [toolId, stats] of Object.entries(profile.stats.favoriteToolsUsed)) {
        if (!usage[toolId]) {
          usage[toolId] = { total: 0, helpful: 0 };
        }
        usage[toolId].total += stats.count;
        usage[toolId].helpful += stats.helpful;
      }
    }
    return Object.entries(usage)
      .map(([id, stats]) => ({
        id,
        ...stats,
        successRate: stats.total > 0 ? (stats.helpful / stats.total * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }
  
  _getProtocolUsageStats() {
    const usage = {};
    for (const entry of this.protocolHistory) {
      const id = entry.protocolId;
      if (!usage[id]) {
        usage[id] = { total: 0, completed: 0 };
      }
      usage[id].total++;
      if (entry.status === 'completed') {
        usage[id].completed++;
      }
    }
    return usage;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  SENSORY_CONFIG,
  SENSORY_TOOLS,
  CALM_DOWN_PROTOCOLS,
  STIM_CATEGORIES,
  SensoryProfile,
  SensoryToolkit
};

// For backwards compatibility
export default SensoryToolkit;