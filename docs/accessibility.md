# Universal Accessibility Guide

**Making P31 work for everyone - from 6 to 70+**

## Overview

P31 is designed for universal access. The system adapts to the user, not the other way around. Whether you're 6 years old or 70 years old, P31 should feel natural and fluid.

## Quick Access

### For Children (6+)
1. Click **"Simple"** button in The Scope
2. Large buttons and clear text
3. Sound feedback when actions complete
4. Voice commands available
5. Visual icons for everything

### For Seniors (70+)
1. Click **"Simple"** button in The Scope
2. Extra-large text and buttons
3. High contrast mode
4. Sound and vibration feedback
5. Voice commands available
6. Reduced motion for comfort

### For Everyone
1. Click **"♿ Settings"** button
2. Adjust text size, contrast, and features
3. Enable/disable sound, vibration, voice commands
4. Choose simplified or advanced interface

## Features

### Age-Adaptive Modes

**Child Mode:**
- Large text (20px)
- High contrast
- Sound feedback enabled
- Vibration feedback enabled
- Simplified interface
- Voice commands enabled
- Animations enabled (kids like them!)

**Senior Mode:**
- Extra-large text (24px)
- High contrast
- Sound feedback enabled
- Vibration feedback enabled
- Simplified interface
- Voice commands enabled
- Reduced motion (comfort)

**Standard Mode:**
- Medium text (16px)
- Normal contrast
- Optional features
- Full interface available

### Text Sizes

- **Small** - 14px (for advanced users)
- **Medium** - 16px (default)
- **Large** - 20px (recommended for children)
- **Extra Large** - 24px (recommended for seniors)

### Contrast Modes

- **Normal** - Standard color scheme
- **High** - Maximum contrast (black/white/yellow)

### Feedback Options

- **Sound Feedback** - Audio confirmation for actions
- **Vibration Feedback** - Haptic feedback (The Thick Click)
- **Screen Reader** - Full screen reader support
- **Voice Commands** - Speak instead of type

### Interface Modes

- **Simplified** - Large buttons, clear labels, minimal options
- **Advanced** - Full feature set, technical details

## Simple Buffer Interface

The Simple Buffer is designed for non-technical users:

1. **Large, clear buttons** - Easy to see and tap
2. **Simple language** - No jargon, plain English
3. **Visual feedback** - Icons and colors show status
4. **Sound confirmation** - Hear when messages are sent
5. **Voice input** - Speak your message
6. **One-touch actions** - Minimal steps to complete tasks

## Voice Commands

Available in Simple Mode:

- **"Send message [your message]"** - Sends a message
- **"Check status"** - Shows connection status
- **"Help"** - Shows help information

## Hardware Accessibility

### Node One (ESP32-S3)

- **Large display** - 320x480 portrait, easy to read
- **Haptic feedback** - The Thick Click provides physical confirmation
- **Voice output** - Audio feedback via ES8311 codec
- **Simple controls** - Touch screen with large targets

### The Thick Click

- **Haptic feedback** - Physical confirmation for all actions
- **Pattern recognition** - Different patterns for different actions
- **Adjustable intensity** - User can set vibration strength

## Best Practices

### For Children
- Use Simple Mode
- Enable sound feedback
- Use voice commands
- Keep interface colorful and engaging
- Provide clear visual feedback

### For Seniors
- Use Simple Mode
- Set text to Extra Large
- Enable high contrast
- Enable sound and vibration feedback
- Reduce motion for comfort
- Use voice commands if preferred

### For All Users
- Start with Simple Mode
- Adjust settings as needed
- Use accessibility panel to customize
- Test with actual users
- Iterate based on feedback

## Technical Implementation

### Accessibility Store

All accessibility settings are managed in `accessibility.store.ts`:

```typescript
const { mode, fontSize, contrast } = useAccessibilityStore();
```

### Simple Components

- `SimpleButton` - Large, accessible button
- `SimpleMessageInput` - Easy-to-use text input
- `SimpleBuffer` - Simplified Buffer interface
- `AccessibilityPanel` - Settings interface

### CSS Variables

Accessibility styles use CSS variables for easy theming:

```css
.high-contrast {
  --bg-primary: #000000;
  --text-primary: #ffffff;
  --accent-color: #ffff00;
}
```

## Testing

Test with:
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- High contrast mode
- Large text sizes
- Reduced motion
- Voice commands

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
