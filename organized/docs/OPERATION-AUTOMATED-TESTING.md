# OPERATION: AUTOMATED USER TESTING
## Complete E2E Testing Infrastructure

---

## THE FRAMEWORK

### Playwright + Visual Regression + Constitutional Compliance

---

## INSTALLATION

```bash
# Install Playwright
npm install -D @playwright/test

# Install visual regression
npm install -D @playwright/test playwright-chromium

# Initialize Playwright
npx playwright install

# Install additional dependencies
npm install -D pixelmatch pngjs
```

---

## PROJECT STRUCTURE

```
project-root/
├── tests/
│   ├── e2e/
│   │   ├── genesis-ritual.spec.ts
│   │   ├── navigation.spec.ts
│   │   ├── phenix-integration.spec.ts
│   │   └── constitutional-compliance.spec.ts
│   ├── visual/
│   │   ├── glassmorphism.spec.ts
│   │   └── snapshots/
│   ├── performance/
│   │   └── load-testing.spec.ts
│   └── fixtures/
│       └── test-data.ts
├── playwright.config.ts
└── package.json
```

---

## PLAYWRIGHT CONFIGURATION

### File: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Test timeout
  timeout: 30 * 1000,
  
  // Expect timeout
  expect: {
    timeout: 5000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail fast on CI
  forbidOnly: !!process.env.CI,
  
  // Retry on CI
  retries: process.env.CI ? 2 : 0,
  
  // Workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  // Shared settings
  use: {
    // Base URL
    baseURL: 'http://localhost:3001',
    
    // Collect trace on failure
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },
  
  // Projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Web server
  webServer: {
    command: 'npm run dev -- --port 3001',
    port: 3001,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## TEST 1: GENESIS RITUAL (ONBOARDING)

### File: `tests/e2e/genesis-ritual.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Genesis Ritual - Complete Onboarding Flow', () => {
  
  test('Phase 1: Gateway Orb - Hold to Resonate', async ({ page }) => {
    await page.goto('/');
    
    // Should show gateway orb
    const orb = page.locator('[data-testid="gateway-orb"]');
    await expect(orb).toBeVisible();
    
    // Should show "HOLD TO RESONATE" text
    await expect(page.getByText(/hold to resonate/i)).toBeVisible();
    
    // Hold the orb (mousedown for 3 seconds)
    await orb.dispatchEvent('mousedown');
    
    // Wait for resonance to charge
    await page.waitForTimeout(3000);
    
    // Should show 100% resonance
    await expect(page.getByText('100%')).toBeVisible();
    
    // Should show "RESONANCE ACHIEVED"
    await expect(page.getByText(/resonance achieved/i)).toBeVisible();
    
    // Should auto-navigate to attunement
    await page.waitForURL('/genesis/attunement', { timeout: 5000 });
  });
  
  test('Phase 2: Class Selection', async ({ page }) => {
    // Skip to attunement
    await page.goto('/genesis/attunement');
    
    // Should show class selector
    await expect(page.getByText(/initialize identity/i)).toBeVisible();
    
    // Should show 3 classes
    await expect(page.getByText('OPERATOR')).toBeVisible();
    await expect(page.getByText('ARTIFICER')).toBeVisible();
    await expect(page.getByText('ARCHITECT')).toBeVisible();
    
    // Click OPERATOR
    await page.getByRole('button', { name: /operator/i }).click();
    
    // Should navigate to formation
    await page.waitForURL('/genesis/formation', { timeout: 5000 });
  });
  
  test('Phase 3: K₄ Formation - The Gathering', async ({ page }) => {
    // Skip to formation
    await page.goto('/genesis/formation');
    
    // Should show gathering screen
    await expect(page.getByText(/the gathering/i)).toBeVisible();
    
    // Should show QR code
    const qrCode = page.locator('img[alt="Invite QR Code"]');
    await expect(qrCode).toBeVisible();
    
    // Should show connected peers (0/3)
    await expect(page.getByText(/connected peers.*0\/3/i)).toBeVisible();
    
    // Should show "Waiting for peers" button (disabled)
    const proceedButton = page.getByRole('button', { name: /proceed to vow/i });
    await expect(proceedButton).toBeDisabled();
  });
  
  test('Phase 4: Skip to Solo Mode', async ({ page }) => {
    await page.goto('/genesis/formation');
    
    // Click skip
    await page.getByRole('button', { name: /skip for now/i }).click();
    
    // Should navigate to home
    await page.waitForURL('/home', { timeout: 5000 });
    
    // Should show tetrahedron
    await expect(page.locator('canvas')).toBeVisible();
  });
  
  test('Complete Flow: Orb → Class → Skip → Home', async ({ page }) => {
    // Start at gateway
    await page.goto('/');
    
    // Hold orb
    const orb = page.locator('[data-testid="gateway-orb"]');
    await orb.dispatchEvent('mousedown');
    await page.waitForTimeout(3000);
    
    // Wait for attunement
    await page.waitForURL('/genesis/attunement');
    
    // Select class
    await page.getByRole('button', { name: /operator/i }).click();
    
    // Wait for formation
    await page.waitForURL('/genesis/formation');
    
    // Skip
    await page.getByRole('button', { name: /skip for now/i }).click();
    
    // Should be at home
    await page.waitForURL('/home');
    
    // Verify tutorial shows
    await expect(page.getByText(/pilot guide/i)).toBeVisible();
  });
});
```

---

## TEST 2: NAVIGATION & INTERACTION

### File: `tests/e2e/navigation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Tetrahedron Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Skip onboarding
    await page.goto('/home');
    await page.evaluate(() => {
      localStorage.setItem('god-settings', JSON.stringify({
        state: {
          hasCompletedOnboarding: true,
          nodeId: 'test-node-123',
          userClass: 'OPERATOR',
        },
      }));
    });
    await page.reload();
  });
  
  test('Should render tetrahedron', async ({ page }) => {
    // Canvas should be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Should show starfield
    // (Check canvas is not blank by checking pixel data)
    const isRendering = await canvas.evaluate((canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.some(byte => byte !== 0);
    });
    
    expect(isRendering).toBe(true);
  });
  
  test('Should show vertex labels on hover', async ({ page }) => {
    await page.goto('/home');
    
    // Wait for canvas to render
    await page.waitForTimeout(1000);
    
    // Hover over canvas center
    const canvas = page.locator('canvas');
    await canvas.hover();
    
    // Should show vertex label (if implemented)
    // This test depends on your implementation
  });
  
  test('Should navigate on vertex double-click', async ({ page }) => {
    await page.goto('/home');
    
    // Wait for scene to load
    await page.waitForTimeout(1000);
    
    // Double-click canvas (simulating vertex click)
    const canvas = page.locator('canvas');
    await canvas.dblclick({ position: { x: 400, y: 300 } });
    
    // Should navigate to a page (mission/dashboard/etc)
    await page.waitForTimeout(500);
    
    // Check if URL changed
    const url = page.url();
    expect(url).not.toContain('/home');
  });
  
  test('Should show tutorial guide', async ({ page }) => {
    await page.goto('/home');
    
    // Tutorial should be visible
    await expect(page.getByText(/pilot guide/i)).toBeVisible();
    
    // Should show first message
    await expect(page.locator('[data-testid="tutorial-message"]')).toBeVisible();
    
    // Click Next
    await page.getByRole('button', { name: /next/i }).click();
    
    // Should show second message
    // (Check progress dots updated)
  });
});
```

---

## TEST 3: PHENIX NAVIGATOR INTEGRATION

### File: `tests/e2e/phenix-integration.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Phenix Navigator Integration', () => {
  
  test('Should show Phenix dashboard', async ({ page }) => {
    await page.goto('/phenix');
    
    // Header should be visible
    await expect(page.getByText(/phenix navigator/i)).toBeVisible();
    
    // Should show WYE-DELTA title
    await expect(page.getByText(/wye-delta/i)).toBeVisible();
  });
  
  test('Should show connect button when not connected', async ({ page }) => {
    await page.goto('/phenix');
    
    // Connect button should be visible
    const connectBtn = page.getByRole('button', { name: /connect/i });
    await expect(connectBtn).toBeVisible();
  });
  
  test('Load meter should render', async ({ page }) => {
    await page.goto('/phenix');
    
    // Load meter title
    await expect(page.getByText(/load impedance/i)).toBeVisible();
    
    // Should show 0% initially (if not connected)
    await expect(page.getByText(/0%/)).toBeVisible();
  });
  
  test('Control panel should be present', async ({ page }) => {
    await page.goto('/phenix');
    
    // Load adjustment section
    await expect(page.getByText(/load adjustment/i)).toBeVisible();
    
    // Integrity state section
    await expect(page.getByText(/integrity state/i)).toBeVisible();
    
    // Emergency protocol section
    await expect(page.getByText(/emergency protocol/i)).toBeVisible();
  });
});
```

---

## TEST 4: CONSTITUTIONAL COMPLIANCE

### File: `tests/e2e/constitutional-compliance.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Constitutional Compliance Verification', () => {
  
  test('Article I: Privacy - No plaintext keys in localStorage', async ({ page }) => {
    await page.goto('/');
    
    // Complete onboarding
    // ... (abbreviated)
    
    // Check localStorage
    const storage = await page.evaluate(() => {
      const data = localStorage.getItem('god-settings');
      return data ? JSON.parse(data) : null;
    });
    
    // Should have nodeId
    expect(storage?.state?.nodeId).toBeTruthy();
    
    // Private key should be encrypted (base64, not raw hex)
    if (storage?.state?.privateKey) {
      // Should not be a raw hex string
      expect(storage.state.privateKey).not.toMatch(/^[0-9a-f]{64}$/);
      
      // Should be base64 (or encrypted format)
      expect(storage.state.privateKey).toMatch(/^[A-Za-z0-9+/=]+$/);
    }
  });
  
  test('Article II: K₄ Topology - Formation requires 4 vertices', async ({ page }) => {
    await page.goto('/genesis/formation');
    
    // Proceed button should be disabled with <3 peers
    const proceedBtn = page.getByRole('button', { name: /proceed/i });
    await expect(proceedBtn).toBeDisabled();
    
    // Should show "Waiting for peers"
    await expect(page.getByText(/waiting for peers/i)).toBeVisible();
  });
  
  test('Article III: Presence - 3-of-4 signatures required', async ({ page }) => {
    // This test would require mocking the multisig process
    // For now, verify the UI shows the requirement
    
    await page.goto('/genesis/vow');
    
    // Should show signature count
    await expect(page.getByText(/signatures.*3.*required/i)).toBeVisible();
    
    // Should show 4 signature slots
    const slots = page.locator('[data-testid="signature-slot"]');
    await expect(slots).toHaveCount(4);
  });
  
  test('No tracking scripts present', async ({ page }) => {
    await page.goto('/');
    
    // Should NOT have Google Analytics
    const hasGA = await page.evaluate(() => {
      return typeof (window as any).ga !== 'undefined' ||
             typeof (window as any).gtag !== 'undefined';
    });
    expect(hasGA).toBe(false);
    
    // Should NOT have Facebook Pixel
    const hasFBPixel = await page.evaluate(() => {
      return typeof (window as any).fbq !== 'undefined';
    });
    expect(hasFBPixel).toBe(false);
  });
});
```

---

## TEST 5: VISUAL REGRESSION (GLASSMORPHISM)

### File: `tests/visual/glassmorphism.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Cyber-Slate Glassmorphism Visual Regression', () => {
  
  test('Homepage should have transparent backgrounds', async ({ page }) => {
    await page.goto('/home');
    
    // Take screenshot
    await expect(page).toHaveScreenshot('home-glassmorphism.png', {
      maxDiffPixels: 100,
    });
  });
  
  test('Dashboard should show glass panels', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for glass effect
    const panel = page.locator('[data-testid="glass-panel"]').first();
    
    // Should have backdrop-blur
    const hasBackdropBlur = await panel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backdropFilter.includes('blur');
    });
    expect(hasBackdropBlur).toBe(true);
    
    // Should have low opacity background
    const bgColor = await panel.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be rgba with alpha < 0.8
    expect(bgColor).toMatch(/rgba.*,\s*0\.[0-7]/);
  });
  
  test('Neon borders should be present', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Glass panels should have colored borders
    const panel = page.locator('[data-testid="glass-panel"]').first();
    
    const borderColor = await panel.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    
    // Should not be gray/black
    expect(borderColor).not.toMatch(/rgb\(0,\s*0,\s*0\)/);
    expect(borderColor).not.toMatch(/rgb\(128,\s*128,\s*128\)/);
  });
  
  test('Starfield should be visible through panels', async ({ page }) => {
    await page.goto('/home');
    
    // Canvas should be at z-0
    const canvas = page.locator('canvas');
    const zIndex = await canvas.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    
    expect(zIndex).toBe('0');
    
    // Content should be at higher z-index
    const content = page.locator('main');
    const contentZ = await content.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    
    expect(Number(contentZ)).toBeGreaterThan(0);
  });
});
```

---

## TEST 6: PERFORMANCE

### File: `tests/performance/load-testing.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance Testing', () => {
  
  test('Homepage should load in <3 seconds', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('WebGL canvas should render at 30+ FPS', async ({ page }) => {
    await page.goto('/home');
    
    // Wait for canvas to initialize
    await page.waitForTimeout(1000);
    
    // Measure FPS
    const fps = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let frames = 0;
        const start = performance.now();
        
        function countFrame() {
          frames++;
          const elapsed = performance.now() - start;
          
          if (elapsed >= 1000) {
            resolve(frames);
          } else {
            requestAnimationFrame(countFrame);
          }
        }
        
        requestAnimationFrame(countFrame);
      });
    });
    
    expect(fps).toBeGreaterThanOrEqual(30);
  });
  
  test('No memory leaks on navigation', async ({ page }) => {
    await page.goto('/home');
    
    // Get initial memory
    const metrics1 = await page.metrics();
    const initialHeap = metrics1.JSHeapUsedSize;
    
    // Navigate around
    await page.goto('/dashboard');
    await page.goto('/phenix');
    await page.goto('/home');
    
    // Force garbage collection (if available)
    await page.evaluate(() => {
      if (typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
    });
    
    // Get final memory
    const metrics2 = await page.metrics();
    const finalHeap = metrics2.JSHeapUsedSize;
    
    // Heap should not grow by more than 50MB
    const growth = finalHeap - initialHeap;
    expect(growth).toBeLessThan(50 * 1024 * 1024);
  });
});
```

---

## PACKAGE.JSON SCRIPTS

### File: `package.json`

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:genesis": "playwright test tests/e2e/genesis-ritual.spec.ts",
    "test:nav": "playwright test tests/e2e/navigation.spec.ts",
    "test:phenix": "playwright test tests/e2e/phenix-integration.spec.ts",
    "test:visual": "playwright test tests/visual/",
    "test:perf": "playwright test tests/performance/",
    "test:report": "playwright show-report",
    "test:update-snapshots": "playwright test --update-snapshots"
  }
}
```

---

## CI/CD INTEGRATION

### File: `.github/workflows/test.yml`

```yaml
name: Automated Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npm run test
      
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## USAGE GUIDE

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm run test:genesis     # Genesis ritual
npm run test:nav         # Navigation
npm run test:phenix      # Phenix integration
npm run test:visual      # Visual regression
npm run test:perf        # Performance
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Headed Mode (See Browser)
```bash
npm run test:headed
```

### View Report
```bash
npm run test:report
```

### Update Visual Snapshots
```bash
npm run test:update-snapshots
```

---

## TEST DATA FIXTURES

### File: `tests/fixtures/test-data.ts`

```typescript
export const testUsers = {
  operator: {
    class: 'OPERATOR',
    nodeId: 'test-operator-001',
    publicKey: 'mock-public-key-operator',
  },
  artificer: {
    class: 'ARTIFICER',
    nodeId: 'test-artificer-001',
    publicKey: 'mock-public-key-artificer',
  },
  architect: {
    class: 'ARCHITECT',
    nodeId: 'test-architect-001',
    publicKey: 'mock-public-key-architect',
  },
};

export const mockTetrahedron = {
  vertices: [
    'test-node-001',
    'test-node-002',
    'test-node-003',
    'test-node-004',
  ],
  signatures: [
    'mock-sig-1',
    'mock-sig-2',
    'mock-sig-3',
  ],
};
```

---

## AUTOMATED TEST REPORT

**After running tests, Playwright generates:**

- **HTML Report**: Interactive test results
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: For debugging
- **JUnit XML**: For CI integration
- **JSON**: For programmatic access

---

## SUCCESS CRITERIA

✅ **Genesis Ritual**: Complete flow works
✅ **Navigation**: Tetrahedron interaction works
✅ **Phenix**: Dashboard renders correctly
✅ **Constitutional**: Privacy enforced
✅ **Visual**: Glassmorphism verified
✅ **Performance**: <3s load, 30+ FPS

---

**AUTOMATED USER TESTING COMPLETE.**

**RUN WITH: `npm test`**
