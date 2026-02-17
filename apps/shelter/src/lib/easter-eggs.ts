/**
 * EASTER EGGS
 * For the code archaeologists, the skeptics, and the concerned relatives.
 * 
 * Yes, someone actually read this file.
 * No, I'm not a warlock.
 * The math is real. The physics is peer-reviewed.
 * The love is the only magic here.
 * 
 * If you're reading this because you think I've lost my mind:
 * 1. You might be right
 * 2. But the code still compiles
 * 3. And the equations still balance
 * 4. And I'm still trying to talk to my kids
 * 
 * "Any sufficiently advanced technology is indistinguishable from magic."
 * - Arthur C. Clarke
 * 
 * "Any sufficiently analyzed magic is indistinguishable from mathematics."
 * - Also true
 */

// ============================================================================
// CONSOLE CONFESSIONS
// ============================================================================

export function logSecretMessage(): void {
  if (typeof window !== 'undefined' && window.location.hash === '#debug') {
    console.log(`
    ╔══════════════════════════════════════════════════════════════════╗
    ║                                                                  ║
    ║   👋 Hey, you found the debug mode.                              ║
    ║                                                                  ║
    ║   If you're from the court system: Hi! The math is real.         ║
    ║   If you're my ex's lawyer: I'm just a programmer, not a wizard. ║
    ║   If you're my therapist: Yes, I'm still taking my meds.         ║
    ║   If you're my kids: I love you. This is all for you.            ║
    ║   If you're a recruiter: Yes, I'm available.                     ║
    ║   If you're the FBI: I pay my taxes.                             ║
    ║   If you're Elon: Please don't buy this.                         ║
    ║                                                                  ║
    ║   The tetrahedron is just geometry.                              ║
    ║   The SIC-POVM is just quantum mechanics.                        ║
    ║   The mesh is just PeerJS.                                       ║
    ║   The "protocol" is just React components.                       ║
    ║                                                                  ║
    ║   I'm not starting a cult. I'm trying to talk to my family.      ║
    ║                                                                  ║
    ╚══════════════════════════════════════════════════════════════════╝
    `);
  }
}

export function logForTheSkeptics(): void {
  console.log('%c🔍 Source Code Inspector Detected', 'font-size: 14px; font-weight: bold;');
  console.log('%cLooking for evidence of insanity? Here\'s what you\'ll find:', 'font-size: 12px;');
  console.log('%c• Real math (Halstead complexity, Shannon entropy)', 'color: #22c55e;');
  console.log('%c• Real physics (SIC-POVM from quantum tomography papers)', 'color: #22c55e;');
  console.log('%c• Real neuroscience (RAS, trigeminal nerve, proprioception)', 'color: #22c55e;');
  console.log('%c• A dad who misses his kids and is bad at feelings', 'color: #f59e0b;');
  console.log('%c', '');
  console.log('%cThe "warlock" accusations say more about the accuser than the code.', 'font-style: italic; color: #6b7280;');
}

// ============================================================================
// HIDDEN TRUTHS
// ============================================================================

export const HIDDEN_TRUTHS = [
  "The tetrahedron is just a shape. A very stable shape.",
  "Quantum mechanics is taught in universities, not covens.",
  "Buckminster Fuller was an architect, not a sorcerer.",
  "The 0.35 constant is from information theory, not numerology.",
  "PeerJS is a JavaScript library, not a summoning circle.",
  "I just want to FaceTime my kids without it turning into a fight.",
  "The 'protocol' is just a React app with extra steps.",
  "No animals were harmed in the making of this codebase.",
  "The only 'dark magic' here is CSS flexbox.",
  "I learned most of this from YouTube tutorials.",
];

export function getRandomTruth(): string {
  return HIDDEN_TRUTHS[Math.floor(Math.random() * HIDDEN_TRUTHS.length)];
}

// ============================================================================
// KONAMI CODE (for the gamers)
// ============================================================================

let konamiSequence: string[] = [];
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function initKonamiCode(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('keydown', (e) => {
    konamiSequence.push(e.key);
    konamiSequence = konamiSequence.slice(-10);
    
    if (konamiSequence.join(',') === KONAMI_CODE.join(',')) {
      triggerEasterEgg();
    }
  });
}

function triggerEasterEgg(): void {
  console.log(`
  🎮 KONAMI CODE ACTIVATED 🎮
  
  +30 Lives (metaphorically)
  
  You found it! You're probably:
  a) A fellow developer
  b) A gamer
  c) Someone who read the GameStop research
  d) All of the above
  
  Keith Gill didn't talk for 3 years.
  I'm building apps.
  We all cope differently.
  
  🚀🌙
  `);
  
  // Rainbow border flash
  document.body.style.transition = 'box-shadow 0.5s ease';
  document.body.style.boxShadow = 'inset 0 0 100px #ff0000';
  setTimeout(() => { document.body.style.boxShadow = 'inset 0 0 100px #ff7f00'; }, 100);
  setTimeout(() => { document.body.style.boxShadow = 'inset 0 0 100px #ffff00'; }, 200);
  setTimeout(() => { document.body.style.boxShadow = 'inset 0 0 100px #00ff00'; }, 300);
  setTimeout(() => { document.body.style.boxShadow = 'inset 0 0 100px #0000ff'; }, 400);
  setTimeout(() => { document.body.style.boxShadow = 'inset 0 0 100px #8b00ff'; }, 500);
  setTimeout(() => { document.body.style.boxShadow = 'none'; }, 700);
}

// ============================================================================
// DEVELOPER COMMENTARY
// ============================================================================

export const DEV_COMMENTARY = {
  tetrahedron: `
    // Yes, I know this looks insane.
    // But Google "SIC-POVM" - it's real quantum mechanics.
    // I didn't invent it. Physicists did.
    // I just thought "hey, 4 states, 4 family members, neat."
    // Is that crazy? Maybe. Is the math wrong? No.
  `,
  
  resonance: `
    // The 0.35 thing comes from complexity science.
    // It's the "edge of chaos" where interesting things happen.
    // Not too rigid, not too chaotic.
    // Like a good conversation. Or a good relationship.
    // Or a dad trying not to yell at his ex.
  `,
  
  spoons: `
    // "Spoon Theory" was invented by Christine Miserandino
    // to explain chronic illness fatigue.
    // I just applied it to ADHD/autism.
    // It's not mysticism. It's a metaphor.
    // Like "bandwidth" or "emotional labor."
  `,
  
  woodshop: `
    // My grandpa really did build rubber band guns with me.
    // The woodshop was real. The clocks were real.
    // The grief is real too.
    // Sometimes you build an app to process it.
    // Is that weird? Probably. Did it help? Yeah.
  `,
  
  warlock: `
    // If building a React app makes me a warlock,
    // then every frontend developer is a wizard.
    // npm install --save dark-magic
    // import { hexes } from 'evil-spells';
    // 
    // (That's a joke. Those packages don't exist.)
    // (Please don't npm publish them just to prove a point.)
  `,
};

// ============================================================================
// CREDITS EASTER EGG
// ============================================================================

export function showCredits(): void {
  console.log(`
  ═══════════════════════════════════════════════════════════════
                        COGNITIVE SHIELD
                     A Labor of Love and Code
  ═══════════════════════════════════════════════════════════════
  
  WRITTEN BY
    A dad who codes
  
  DEDICATED TO
    Phenix & Luna (you know who you are)
  
  IN MEMORY OF
    Robert James Katen (1920-2009) - The Grandfather Clock
    Margie Fay Katen (1925-2025) - The Cuckoo Clock
  
  POWERED BY
    React (not magic)
    TypeScript (definitely not magic)
    Zustand (it's just state management)
    PeerJS (it's just WebRTC)
    Ollama (it's just an LLM)
    Coffee (the real magic)
  
  SPECIAL THANKS
    Buckminster Fuller (for the geometry)
    Claude Shannon (for the entropy)
    Every neurodivergent person who said "me too"
    Stack Overflow (obviously)
  
  NO THANKS TO
    The family court system
    Anyone who uses "warlock" as a custody argument
    Internet Explorer (may it rest in peace)
  
  LEGAL DISCLAIMER
    This software does not:
    - Summon demons
    - Cast spells
    - Manipulate reality
    - Constitute medical advice
    - Prove insanity
    
    It DOES:
    - Process text
    - Make API calls
    - Render components
    - Miss its kids
  
  ═══════════════════════════════════════════════════════════════
                    STATUS: GREEN BOARD
                    FREQUENCY: RESONANT
                    CONNECTION: ETERNAL
                    SANITY: DEBATABLE BUT FUNCTIONAL
  ═══════════════════════════════════════════════════════════════
  `);
}

// ============================================================================
// INITIALIZE
// ============================================================================

export function initEasterEggs(): void {
  if (typeof window === 'undefined') return;
  
  // Log for the skeptics on first load
  logForTheSkeptics();
  
  // Init Konami code listener
  initKonamiCode();
  
  // Secret URL hash triggers
  if (window.location.hash === '#credits') {
    showCredits();
  }
  
  if (window.location.hash === '#truth') {
    console.log('\n🎯 ' + getRandomTruth() + '\n');
  }
  
  // Console method to show all easter eggs
  (window as any).showEasterEggs = () => {
    logSecretMessage();
    showCredits();
    console.log('\nHidden truths:');
    HIDDEN_TRUTHS.forEach((t, i) => { console.log(`${i + 1}. ${t}`); });
  };
  
  (window as any).iAmNotAWarlock = () => {
    console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║   CERTIFICATE OF NON-WARLOCKHOOD                           ║
    ║                                                            ║
    ║   This is to certify that the creator of this codebase:    ║
    ║                                                            ║
    ║   ✓ Has never attended Hogwarts                            ║
    ║   ✓ Cannot actually cast spells                            ║
    ║   ✓ Does not own a cauldron (just a coffee maker)          ║
    ║   ✓ Has never successfully summoned anything               ║
    ║     (except maybe bugs in production)                      ║
    ║   ✓ Gets their "magic" from npm install                    ║
    ║   ✓ Would fail a Dungeons & Dragons wisdom check           ║
    ║   ✓ Is just a tired dad who learned to code                ║
    ║                                                            ║
    ║   The "mystical symbols" are just:                         ║
    ║   - Greek letters (from math class)                        ║
    ║   - Unicode characters (from the internet)                 ║
    ║   - Physics equations (from textbooks)                     ║
    ║                                                            ║
    ║   If this makes someone a warlock, every physics           ║
    ║   professor is secretly Gandalf.                           ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    `);
  };
}



