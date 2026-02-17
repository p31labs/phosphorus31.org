# Assistive Technology Features

**Comprehensive assistive technology support for universal access** 🔺

## Overview

The P31 ecosystem includes comprehensive assistive technology support, ensuring the system is accessible to everyone, regardless of ability. The assistive technology system integrates with the game engine, UI components, and all P31 features.

## Features

### 1. Screen Reader Support 📢

**Supported Screen Readers:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)
- Auto-detection

**Features:**
- ARIA live regions for announcements
- Semantic HTML structure
- Descriptive labels and alt text
- Verbosity levels (minimal, normal, verbose)
- Role-based announcements (status, alert, log, timer)

**Usage:**
```typescript
const assistiveTech = engine.getAssistiveTech();
assistiveTech.announce('Structure created successfully', 'polite');
assistiveTech.announce('Error occurred', 'assertive', 'alert');
```

### 2. Voice Control 🎤

**Supported Providers:**
- Web Speech API (browser-native)
- Dragon NaturallySpeaking (future)
- Voice Access (Android, future)
- Voice Control (iOS, future)

**Features:**
- Continuous recognition
- Custom command registration
- Multi-language support
- Visual feedback indicator
- Command confirmation

**Default Commands:**
- "start" / "begin" / "play" / "go" - Start game
- "stop" / "end" / "quit" / "exit" - Stop game
- "pause" / "wait" / "hold" - Pause game
- "resume" / "continue" / "unpause" - Resume game
- "help" / "assistance" / "guide" - Show help

**Usage:**
```typescript
// Start voice control
assistiveTech.startVoiceRecognition();

// Register custom command
assistiveTech.registerVoiceCommand({
  command: 'build',
  action: () => engine.createNewStructure('New Build'),
  description: 'Create a new structure',
  keywords: ['build', 'create', 'make', 'new']
});
```

### 3. Switch Control 🔘

**Features:**
- 1-4 switch support
- Configurable scan speed (100-5000ms)
- Multiple scan modes (linear, row-column, group)
- Visual highlighting
- Keyboard navigation support

**Usage:**
```typescript
// Register items for switch control
assistiveTech.registerSwitchControlItems([
  { id: 'start-btn', label: 'Start Game', action: () => engine.start() },
  { id: 'stop-btn', label: 'Stop Game', action: () => engine.stop() },
  { id: 'pause-btn', label: 'Pause Game', action: () => engine.pause() }
]);

// Start scanning
assistiveTech.startSwitchControlScanning();

// Navigate with arrow keys or switches
// Select with Space/Enter or switch activation
```

### 4. Eye Tracking 👁️

**Supported Providers:**
- Tobii Eye Tracker (future)
- EyeTribe (future)
- Auto-detection

**Features:**
- Dwell time activation
- Calibration support
- Gaze-based navigation
- Click-by-dwell

**Usage:**
```typescript
// Eye tracking is automatically initialized if hardware detected
// Dwell time is configurable (default: 1000ms)
```

### 5. Haptic Feedback 📳

**Features:**
- Vibration patterns (short, medium, long, double, triple)
- Custom patterns (success, error, warning, info)
- Intensity control (0-1)
- Cross-platform support (Vibration API)

**Patterns:**
- `success`: [100ms, 50ms pause, 100ms]
- `error`: [200ms, 100ms pause, 200ms]
- `warning`: [150ms]
- `info`: [50ms]

**Usage:**
```typescript
assistiveTech.triggerHaptic('success');
assistiveTech.triggerHaptic('error');
assistiveTech.triggerHaptic('custom-pattern');
```

### 6. Visual Aids 👓

**Features:**
- High contrast mode
- Magnification (1.0x - 5.0x)
- Color blind modes (Protanopia, Deuteranopia, Tritanopia)
- Focus indicators
- Cursor size (normal, large, extra-large)

**Usage:**
```typescript
assistiveTech.updateConfig({
  visualAids: {
    highContrast: true,
    magnification: 2.0,
    colorBlindMode: 'protanopia',
    cursorSize: 'large'
  }
});
```

### 7. Cognitive Support 🧠

**Features:**
- Simplified UI mode
- Step-by-step guidance
- Reminders system
- Time limits
- Clear instructions

**Usage:**
```typescript
assistiveTech.updateConfig({
  cognitive: {
    simplifiedUI: true,
    stepByStep: true,
    reminders: true,
    timeLimits: true
  }
});
```

## React Integration

### Provider Setup

```tsx
import { AssistiveTechProvider } from './components/AssistiveTech/AssistiveTechProvider';

function App() {
  return (
    <AssistiveTechProvider>
      {/* Your app */}
    </AssistiveTechProvider>
  );
}
```

### Using the Hook

```tsx
import { useAssistiveTech } from './hooks/useAssistiveTech';

function MyComponent() {
  const { announce, triggerHaptic, startVoiceControl } = useAssistiveTech();

  const handleSuccess = () => {
    announce('Operation successful', 'polite');
    triggerHaptic('success');
  };

  return (
    <button onClick={handleSuccess}>
      Do Something
    </button>
  );
}
```

### Components

- `AssistiveTechProvider` - Context provider
- `AssistiveTechPanel` - Settings panel
- `VoiceControlIndicator` - Visual indicator when listening
- `SwitchControlHighlight` - Visual highlight for switch control

## Game Engine Integration

```typescript
const engine = new GameEngine();
await engine.init();

// Get assistive tech manager
const assistiveTech = engine.getAssistiveTech();

// Announce game events
assistiveTech.announce('Game started', 'polite');

// Trigger haptic feedback
assistiveTech.triggerHaptic('success');

// Register voice commands
assistiveTech.registerVoiceCommand({
  command: 'test',
  action: () => engine.testStructure(),
  description: 'Test structure',
  keywords: ['test', 'check', 'validate']
});
```

## Configuration

### Default Configuration

```typescript
{
  enabled: true,
  screenReader: {
    enabled: true,
    provider: 'auto',
    verbosity: 'normal'
  },
  voiceControl: {
    enabled: true,
    provider: 'auto',
    language: 'en-US',
    continuous: false
  },
  switchControl: {
    enabled: false,
    switches: 1,
    scanSpeed: 1000,
    scanMode: 'linear'
  },
  eyeTracking: {
    enabled: false,
    provider: 'auto',
    dwellTime: 1000,
    calibration: false
  },
  haptic: {
    enabled: true,
    intensity: 0.5,
    patterns: {
      success: 'short',
      error: 'long',
      warning: 'medium',
      info: 'short'
    }
  },
  visualAids: {
    enabled: true,
    highContrast: false,
    magnification: 1.0,
    colorBlindMode: 'none',
    focusIndicator: true,
    cursorSize: 'normal'
  },
  cognitive: {
    enabled: true,
    simplifiedUI: false,
    stepByStep: false,
    reminders: false,
    timeLimits: false
  }
}
```

## Events

The assistive technology system emits events for UI integration:

```typescript
// Voice control events
window.addEventListener('assistive:voiceListening', () => {
  // Show listening indicator
});

window.addEventListener('assistive:voiceStopped', () => {
  // Hide listening indicator
});

window.addEventListener('assistive:voiceTranscript', (e: CustomEvent) => {
  console.log('Transcript:', e.detail.transcript);
});

// Switch control events
window.addEventListener('assistive:highlightItem', (e: CustomEvent) => {
  // Highlight item: e.detail.itemId
});

// Haptic events
window.addEventListener('assistive:haptic', (e: CustomEvent) => {
  // Custom haptic device integration
  console.log('Pattern:', e.detail.pattern);
  console.log('Vibration:', e.detail.vibration);
});
```

## Best Practices

1. **Always announce important events** - Use `announce()` for state changes
2. **Provide haptic feedback** - Use `triggerHaptic()` for actions
3. **Register voice commands** - Make all actions voice-accessible
4. **Support switch control** - Register interactive elements
5. **Test with screen readers** - Verify announcements work
6. **Respect verbosity settings** - Adjust detail level
7. **Provide visual feedback** - Show what's happening
8. **Support keyboard navigation** - Essential for switch control

## Accessibility Standards

- **WCAG 2.1 Level AA/AAA** - Full compliance
- **Section 508** - US federal compliance
- **EN 301 549** - European standard
- **ADA** - Americans with Disabilities Act

## Integration with Existing Features

The assistive technology system integrates with:

- **Accessibility Manager** - Shares settings
- **Safety Manager** - Respects safety settings
- **Game Engine** - Announces game events
- **UI Components** - Provides context and labels
- **Willow's World** - Age-appropriate announcements

## Examples

### Game Event Announcements

```typescript
// In game engine
assistiveTech.announce('Structure validated', 'polite');
assistiveTech.announce('Challenge completed!', 'assertive', 'alert');
assistiveTech.triggerHaptic('success');
```

### Voice-Controlled Game

```typescript
// Register game commands
assistiveTech.registerVoiceCommand({
  command: 'place',
  action: () => buildMode.placePiece(),
  description: 'Place a piece',
  keywords: ['place', 'put', 'add', 'build']
});

assistiveTech.startVoiceRecognition();
```

### Switch Control Navigation

```typescript
// Register all interactive elements
assistiveTech.registerSwitchControlItems([
  { id: 'start', label: 'Start Game', action: () => engine.start() },
  { id: 'build', label: 'Build Mode', action: () => buildMode.activate() },
  { id: 'test', label: 'Test Structure', action: () => engine.testStructure() }
]);

// Start scanning
assistiveTech.startSwitchControlScanning();
```

## Files Created

- `SUPER-CENTAUR/src/engine/assistive/AssistiveTechnologyManager.ts`
- `ui/src/components/AssistiveTech/AssistiveTechProvider.tsx`
- `ui/src/components/AssistiveTech/AssistiveTechPanel.tsx`
- `ui/src/components/AssistiveTech/VoiceControlIndicator.tsx`
- `ui/src/components/AssistiveTech/SwitchControlHighlight.tsx`
- `ui/src/hooks/useAssistiveTech.ts`
- `docs/assistive-technology.md`

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
