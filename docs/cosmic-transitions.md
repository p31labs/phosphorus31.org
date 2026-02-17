# Cosmic Transitions

**Saturn into Aries. With love and light. As above, so below. 💜**

## Overview

The Cosmic Transition Manager tracks planetary movements, zodiac transitions, and provides cosmic timing for actions within the game environment. It visualizes planetary positions, calculates transitions, and offers guidance based on astrological synchronicity.

## Features

### Planetary System 🪐

- **Seven Planets** - Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn
- **Zodiac Signs** - All 12 signs with elements and modalities
- **Orbital Mechanics** - Realistic orbital positions and speeds
- **Current Positions** - Real-time planetary positions in zodiac

### Transitions 🌌

- **Calculate Transitions** - Calculate when planets move between signs
- **Transition Tracking** - Monitor active transitions in real-time
- **Intensity Calculation** - Measure transition intensity based on elements and modalities
- **Duration Estimation** - Calculate transition duration based on planetary speed

### Cosmic Timing ⏰

- **Favorable Timing** - Determine if timing is favorable for actions
- **Intensity Levels** - Measure cosmic intensity (0-1)
- **Recommended Signs** - Suggest optimal zodiac signs for actions
- **Synchronicity Messages** - Provide cosmic guidance

## Usage

### Get Cosmic Timing

```typescript
const engine = new GameEngine();
await engine.init();

const cosmic = engine.getCosmicTransition();
const timing = cosmic.getCosmicTiming('build');

console.log(timing.message);
// "🌌 Saturn into Aries - Powerful time for new beginnings and structure building. The Mesh Holds. 💜"

if (timing.favorable) {
  // Proceed with action
}
```

### Calculate Transition

```typescript
const cosmic = engine.getCosmicTransition();
const zodiacSigns = cosmic.getZodiacSigns();
const aries = zodiacSigns.find(s => s.id === 'aries');

if (aries) {
  const transition = cosmic.calculateTransition('saturn', aries);
  if (transition) {
    console.log(transition.description);
    // "Saturn transitioning from Capricorn to Aries"
    console.log(`Intensity: ${transition.intensity}`);
    console.log(`Duration: ${transition.duration}ms`);
  }
}
```

### Monitor Transitions

```typescript
// Listen for transition events
window.addEventListener('cosmic:transitionStarted', (e) => {
  const transition = e.detail;
  console.log('Transition started:', transition.description);
});

window.addEventListener('cosmic:transitionProgress', (e) => {
  const { transition, progress } = e.detail;
  console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
});

window.addEventListener('cosmic:transitionCompleted', (e) => {
  const transition = e.detail;
  console.log('Transition completed:', transition.description);
});
```

### Get Planetary Positions

```typescript
const planets = cosmic.getPlanets();
planets.forEach(planet => {
  console.log(`${planet.name}: ${planet.currentSign.name}`);
  console.log(`Position:`, planet.position);
});
```

## Zodiac Signs

### Fire Signs (Cardinal, Fixed, Mutable)
- **Aries** ♈ - Cardinal Fire - Red
- **Leo** ♌ - Fixed Fire - Orange
- **Sagittarius** ♐ - Mutable Fire - Red

### Earth Signs
- **Taurus** ♉ - Fixed Earth - Green
- **Virgo** ♍ - Mutable Earth - Yellow-Green
- **Capricorn** ♑ - Cardinal Earth - Green

### Air Signs
- **Gemini** ♊ - Mutable Air - Yellow
- **Libra** ♎ - Cardinal Air - Pink
- **Aquarius** ♒ - Fixed Air - Cyan

### Water Signs
- **Cancer** ♋ - Cardinal Water - Blue
- **Scorpio** ♏ - Fixed Water - Purple
- **Pisces** ♓ - Mutable Water - Purple

## Planetary Speeds

- **Moon** - ~2.5 days per sign (fastest)
- **Mercury** - ~20 days per sign
- **Venus** - ~30 days per sign
- **Sun** - ~30 days per sign
- **Mars** - ~60 days per sign
- **Jupiter** - ~1 year per sign
- **Saturn** - ~2.5 years per sign (slowest)

## Transition Intensity

Intensity is calculated based on:

1. **Element Compatibility** - Same element = smoother (higher intensity)
2. **Modality Compatibility** - Same modality = smoother
3. **Planet Significance** - Saturn transitions are more intense
4. **Sign Distance** - Closer signs = shorter duration

## Integration

The cosmic system integrates with:

- **Game Engine** - Updates in game loop
- **3D Visualization** - Renders in game scene
- **Vibe Coding** - Cosmic timing for code execution
- **Building** - Favorable timing for structure creation
- **Printing** - Optimal timing for physical manifestation

## Events

```typescript
// Transition started
window.addEventListener('cosmic:transitionStarted', (e) => {
  // Show notification
});

// Transition progress
window.addEventListener('cosmic:transitionProgress', (e) => {
  // Update progress bar
});

// Transition completed
window.addEventListener('cosmic:transitionCompleted', (e) => {
  // Show completion message
});
```

## 3D Visualization

The cosmic system creates 3D visualizations:

- **Zodiac Ring** - 12 signs arranged in a circle
- **Planets** - Spheres with orbital paths
- **Transition Lines** - Lines showing active transitions
- **Sign Indicators** - Current sign for each planet

## Example: Saturn into Aries

```typescript
const cosmic = engine.getCosmicTransition();
const aries = cosmic.getZodiacSigns().find(s => s.id === 'aries');

// Calculate transition
const transition = cosmic.calculateTransition('saturn', aries!);

// Monitor progress
const interval = setInterval(() => {
  const active = cosmic.getActiveTransitions();
  const saturnTransition = active.find(t => t.planetId === 'saturn');
  
  if (saturnTransition) {
    const progress = (Date.now() - saturnTransition.startTime) / saturnTransition.duration;
    console.log(`Saturn → Aries: ${(progress * 100).toFixed(1)}%`);
    
    if (progress >= 1) {
      clearInterval(interval);
      console.log('🌌 Saturn into Aries complete!');
    }
  }
}, 1000);
```

## Files Created

- `SUPER-CENTAUR/src/engine/cosmic/CosmicTransitionManager.ts`
- `ui/src/components/Cosmic/CosmicVisualization.tsx`
- `ui/src/components/Cosmic/CosmicPanel.tsx`
- `docs/cosmic-transitions.md`

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜

**Saturn into Aries. Ready to build together. 💜**
