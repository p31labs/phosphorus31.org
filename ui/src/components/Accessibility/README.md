# Universal Accessibility Components

Components designed for users from 6 to 70+ years old.

## Components

### SimpleButton
Large, clear button with haptic and audio feedback.

```tsx
<SimpleButton
  label="Send Message"
  onClick={handleClick}
  variant="primary"
  size="large"
/>
```

### SimpleMessageInput
Easy-to-use text input with character count and large submit button.

```tsx
<SimpleMessageInput
  onSubmit={handleSubmit}
  placeholder="Type your message..."
  submitLabel="Send"
/>
```

### SimpleBuffer
Simplified Buffer interface - full-screen, easy to use.

```tsx
<SimpleBuffer />
```

### AccessibilityPanel
Settings panel for customizing accessibility options.

```tsx
<AccessibilityPanel />
```

### VoiceCommands
Voice command interface for hands-free operation.

```tsx
<VoiceCommands
  onCommand={(command, transcript) => {
    // Handle command
  }}
/>
```

### QuickActions
One-touch action buttons for common tasks.

```tsx
<QuickActions
  actions={[
    { id: '1', label: 'Send', icon: '📤', action: handleSend },
    { id: '2', label: 'Status', icon: '📊', action: handleStatus },
  ]}
/>
```

## Usage

1. Wrap your app with `AccessibilityProvider`
2. Use `useAccessibilityStore` to access settings
3. Use Simple components for universal access
4. Apply presets for child/senior modes

## Presets

- **Child Mode** - Large text, high contrast, sound, voice
- **Senior Mode** - Extra-large text, high contrast, reduced motion
- **Standard Mode** - Default settings

---

**The Mesh Holds.** 🔺
