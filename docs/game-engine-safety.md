# Game Engine Safety Features

**Comprehensive safety system for child protection, privacy, and physical safety**

## Overview

The game engine includes a comprehensive safety system with three main components:

1. **Child Safety Manager** - Content filtering, time limits, parental controls
2. **Physical Safety Manager** - Motion sickness prevention, seizure prevention
3. **Privacy Safety Manager** - Data protection, GDPR compliance, consent management

## Child Safety Manager 🛡️

### Features

- **Time Limits**: Maximum play time per session (default: 60 minutes)
- **Break Reminders**: Automatic breaks every 30 minutes (configurable)
- **Content Filtering**: Blocks unsafe words and phrases
- **Age Restrictions**: Minimum/maximum age limits
- **Parental Approval**: Requires approval for sensitive actions
- **Session Tracking**: Monitors play time and break frequency

### Configuration

```typescript
{
  enabled: true,
  maxPlayTime: 60,        // minutes
  breakInterval: 30,     // minutes
  breakDuration: 5,       // minutes
  contentFiltering: true,
  safeMode: true,
  requireParentalApproval: true,
  ageRestrictions: {
    minAge: 4,
    maxAge: 18
  }
}
```

### Usage

```typescript
const safety = engine.getSafetyManager();
const childSafety = safety.getChildSafety();

// Start session with age check
await engine.start(6); // Age 6

// Check remaining time
const remaining = childSafety.getRemainingPlayTime();

// Get session stats
const stats = childSafety.getSessionStats();
```

### Events

The child safety manager emits events for UI integration:

- `childSafety:breakRequested` - Break time approaching
- `childSafety:breakForced` - Break enforced
- `childSafety:breakEnded` - Break completed
- `childSafety:sessionEndWarning` - Max play time warning
- `childSafety:sessionEnded` - Session ended

## Physical Safety Manager 🏥

### Features

- **Motion Sickness Prevention**: Limits camera speed and rotation
- **Seizure Prevention**: Detects and prevents flashing patterns
- **FOV Limits**: Restricts field of view to safe ranges
- **Motion Blur**: Applies motion blur for high-speed movement
- **Flash Detection**: Monitors flash rate (max 3 Hz)
- **Contrast Limits**: Prevents high-contrast patterns

### Configuration

```typescript
{
  enabled: true,
  preventMotionSickness: true,
  preventSeizures: true,
  maxCameraSpeed: 5.0,
  maxRotationSpeed: 2.0,
  flashWarningThreshold: 3.0,  // Hz
  contrastWarningThreshold: 0.8,
  motionBlurEnabled: true,
  fovLimits: {
    min: 45,
    max: 90
  }
}
```

### Usage

```typescript
const safety = engine.getSafetyManager();
const physicalSafety = safety.getPhysicalSafety();

// Check camera movement
const result = physicalSafety.checkCameraMovement(velocity, rotationVelocity);
if (!result.safe) {
  console.warn('Unsafe movement:', result.warnings);
}

// Check visual effects
const visualResult = physicalSafety.checkVisualEffects(flashRate, contrast, colorChanges);
if (!visualResult.safe) {
  console.warn('Unsafe visuals:', visualResult.warnings);
}

// Get safe camera parameters
const safeParams = physicalSafety.getSafeCameraParams({
  speed: 10,
  rotationSpeed: 5,
  fov: 100
});
```

## Privacy Safety Manager 🔒

### Features

- **Data Encryption**: Encrypts local data storage
- **Data Anonymization**: Removes PII from data
- **Consent Management**: GDPR-compliant consent system
- **Data Retention**: Automatic cleanup of old data
- **Data Export**: GDPR right to data portability
- **Data Deletion**: GDPR right to be forgotten
- **Privacy Events**: Audit trail of privacy events

### Configuration

```typescript
{
  enabled: true,
  encryptLocalData: true,
  anonymizeData: true,
  requireConsent: true,
  dataRetentionDays: 90,
  allowDataSharing: false,
  allowAnalytics: false,
  allowLocationTracking: false
}
```

### Usage

```typescript
const safety = engine.getSafetyManager();
const privacySafety = safety.getPrivacySafety();

// Request consent (shows UI dialog)
const hasConsent = await privacySafety.requestConsent();

// Check permissions
if (privacySafety.canShareData()) {
  // Share data
}

if (privacySafety.canCollectAnalytics()) {
  // Collect analytics
}

// Anonymize data
const anonymized = privacySafety.anonymizeData(userData);

// Encrypt data
const encrypted = await privacySafety.encryptData(sensitiveData);

// Export user data (GDPR)
const userData = await privacySafety.exportUserData();

// Delete user data (GDPR)
await privacySafety.deleteUserData();
```

## Safety Manager Integration

The `SafetyManager` combines all safety features:

```typescript
const safety = engine.getSafetyManager();

// Start session with all safety checks
await safety.startSession(6); // Age 6

// Update safety checks (in game loop)
safety.update(deltaTime);

// Check content safety
if (!safety.isContentSafe(content)) {
  // Block unsafe content
}

// Filter structure name
const safeName = safety.filterStructureName(userInput);

// Check if action requires approval
if (safety.requiresParentalApproval('delete_structure')) {
  // Request parental approval
}
```

## Safety Events

Listen for safety events in the UI:

```typescript
// Child safety events
window.addEventListener('childSafety:breakRequested', (e) => {
  showBreakNotification(e.detail.duration);
});

window.addEventListener('childSafety:sessionEnded', () => {
  showSessionEndMessage();
});

// Privacy events
window.addEventListener('privacy:consentRequested', (e) => {
  showConsentDialog(e.detail.onAccept, e.detail.onReject);
});
```

## Default Safety Settings

### For Children (Age 4-12)

```typescript
{
  childSafety: {
    maxPlayTime: 60,
    breakInterval: 30,
    breakDuration: 5,
    contentFiltering: true,
    safeMode: true,
    requireParentalApproval: true,
    ageRestrictions: { minAge: 4, maxAge: 12 }
  },
  physicalSafety: {
    preventMotionSickness: true,
    preventSeizures: true,
    maxCameraSpeed: 3.0,
    maxRotationSpeed: 1.5
  },
  privacy: {
    requireConsent: true,
    allowDataSharing: false,
    allowAnalytics: false
  }
}
```

### For Teens (Age 13-17)

```typescript
{
  childSafety: {
    maxPlayTime: 120,
    breakInterval: 60,
    contentFiltering: true,
    requireParentalApproval: true,
    ageRestrictions: { minAge: 13, maxAge: 17 }
  },
  physicalSafety: {
    preventMotionSickness: true,
    preventSeizures: true,
    maxCameraSpeed: 5.0,
    maxRotationSpeed: 2.0
  },
  privacy: {
    requireConsent: true,
    allowDataSharing: false,
    allowAnalytics: false
  }
}
```

### For Adults (Age 18+)

```typescript
{
  childSafety: {
    enabled: false
  },
  physicalSafety: {
    preventSeizures: true, // Always enabled
    maxCameraSpeed: 10.0,
    maxRotationSpeed: 5.0
  },
  privacy: {
    requireConsent: false,
    allowDataSharing: true,
    allowAnalytics: true
  }
}
```

## Safety Checks in Game Loop

Safety checks are automatically performed:

1. **Child Safety**: Time limits and break reminders
2. **Physical Safety**: Camera movement and visual effects
3. **Privacy Safety**: Data access and sharing permissions

## Parental Controls

Parents can configure safety settings:

```typescript
const safety = engine.getSafetyManager();

// Update child safety
safety.getChildSafety().updateConfig({
  maxPlayTime: 45,
  breakInterval: 20
});

// Update physical safety
safety.getPhysicalSafety().updateConfig({
  maxCameraSpeed: 2.0
});

// Update privacy
safety.getPrivacySafety().updateConfig({
  allowDataSharing: false
});
```

## Compliance

- **COPPA**: Child safety features comply with COPPA requirements
- **GDPR**: Privacy features comply with GDPR requirements
- **WCAG**: Accessibility features comply with WCAG 2.1

## Kids privacy & security

For device-level crypto, key handling, and AI-companion safety on hardware (e.g. P31 NodeZero / donation-wallet firmware), see the **Node One Firmware Foundation Summary**: [FOUNDATION_SUMMARY.md](../../phenix-donation-wallet-v2/donation-wallet-v2/firmware/FOUNDATION_SUMMARY.md). It covers Keccak256, RLP encoding, the crypto abstraction layer, and AI companion hooks so firmware stays safe and evolvable for kids.

## Best Practices

1. **Always enable safety for children**: Set appropriate age restrictions
2. **Request consent**: Always request privacy consent before collecting data
3. **Respect time limits**: Enforce break reminders and session limits
4. **Monitor content**: Filter user-generated content for safety
5. **Protect privacy**: Encrypt and anonymize sensitive data
6. **Prevent seizures**: Always check flash rates and contrast
7. **Prevent motion sickness**: Limit camera movement speeds

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
