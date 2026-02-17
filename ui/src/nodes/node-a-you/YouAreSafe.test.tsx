/**
 * Skipped in default npm test: React 18/19 monorepo conflict (see ui/vitest.config.ts exclude).
 * Re-enable after unifying React or isolating test env.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/helpers';
import userEvent from '@testing-library/user-event';
import { YouAreSafe } from './YouAreSafe';

// Mock GOD_CONFIG
vi.mock('../../god.config', () => ({
  default: {
    theme: {
      bg: {
        primary: '#0a0a0b',
        secondary: '#1f2937',
        tertiary: '#374151',
        accent: '#4b5563',
      },
      text: {
        primary: '#ffffff',
        secondary: '#d1d5db',
        muted: '#9ca3af',
      },
      border: {
        default: '#374151',
      },
      gradient: {
        shield: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
    },
    voltage: {
      low: { color: '#10b981' },
      medium: { color: '#f59e0b' },
      high: { color: '#ef4444' },
    },
    spoons: {
      max: 12,
      thresholds: {
        healthy: 8,
        caution: 4,
        critical: 2,
      },
    },
    youAreSafe: {
      nodes: {
        panic: {
          name: 'Panic',
          icon: '😰',
          color: '#ef4444',
          validation: 'Your body is trying to protect you.',
          physics: 'The amygdala has activated fight-or-flight.',
          somatic: 'Breathe. You are safe. The threat is not immediate.',
        },
        overwhelm: {
          name: 'Overwhelm',
          icon: '🌊',
          color: '#f59e0b',
          validation: 'You are experiencing sensory overload.',
          physics: 'The nervous system is saturated with input.',
          somatic: 'Reduce input. Close your eyes. One thing at a time.',
        },
        shutdown: {
          name: 'Shutdown',
          icon: '🔋',
          color: '#6b7280',
          validation: 'Your system is conserving energy.',
          physics: 'The parasympathetic nervous system is dominant.',
          somatic: 'Rest is not failure. You are recharging.',
        },
        dissociation: {
          name: 'Dissociation',
          icon: '🌫️',
          color: '#8b5cf6',
          validation: 'Your mind is protecting you from overwhelm.',
          physics: 'The prefrontal cortex has reduced connectivity.',
          somatic: 'Ground yourself. Name 5 things you see. You are here.',
        },
      },
      breathingExercises: {
        calm: {
          name: '4-4-8 Calm',
          description: 'Inhale for 4, hold for 4, exhale for 8',
          pattern: [4, 4, 8, 4],
        },
      },
      coreReassurance: {
        one: 'You are safe. This feeling will pass.',
        two: 'Your body is doing its job. You are not broken.',
        three: 'Rest is mandatory maintenance, not failure.',
      },
    },
    emotionalValence: {
      calm: { color: '#10b981' },
    },
    typography: {
      fontFamily: {
        display: 'system-ui',
      },
    },
  },
}));

// Mock haptic feedback
vi.mock('../../lib/haptic-feedback', () => ({
  triggerVagusSignal: vi.fn(),
  triggerHapticPulse: vi.fn(),
}));

// Mock tone meter
vi.mock('../../lib/tone-meter', () => ({
  analyzeTone: vi.fn(() => ({
    genreError: false,
    tone: 'neutral',
  })),
  getToneColor: vi.fn(() => '#10b981'),
}));

describe('YouAreSafe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<YouAreSafe isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/You Are Safe/i)).toBeInTheDocument();
  });

  it('displays header with title', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/You Are Safe/i)).toBeInTheDocument();
    expect(screen.getByText(/The Fourth Node/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<YouAreSafe isOpen={true} onClose={onClose} />);

    const closeButton =
      screen.getByRole('button', { name: /close/i }) ||
      document.querySelector('button[aria-label*="close" i]') ||
      document.querySelector('button:has(svg)');

    if (closeButton) {
      await user.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('displays spoons meter', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/COGNITIVE ENERGY \(SPOONS\)/i)).toBeInTheDocument();
  });

  it('displays initial spoon count', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/12 \/ 12/i)).toBeInTheDocument();
  });

  it('decreases spoons when "Spent Energy" is clicked', async () => {
    const user = userEvent.setup();
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);

    const spentButton = screen.getByText(/Spent Energy/i);
    await user.click(spentButton);

    expect(screen.getByText(/11 \/ 12/i)).toBeInTheDocument();
  });

  it('increases spoons when "Recovered" is clicked', async () => {
    const user = userEvent.setup();
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);

    // First decrease
    const spentButton = screen.getByText(/Spent Energy/i);
    await user.click(spentButton);

    // Then increase
    const recoveredButton = screen.getByText(/Recovered/i);
    await user.click(recoveredButton);

    expect(screen.getByText(/12 \/ 12/i)).toBeInTheDocument();
  });

  it('displays all four safety nodes', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Panic/i)).toBeInTheDocument();
    expect(screen.getByText(/Overwhelm/i)).toBeInTheDocument();
    expect(screen.getByText(/Shutdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Dissociation/i)).toBeInTheDocument();
  });

  it('displays node content when node is selected', async () => {
    const user = userEvent.setup();
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);

    const panicButton = screen.getByText(/Panic/i);
    await user.click(panicButton);

    expect(screen.getByText(/Your body is trying to protect you/i)).toBeInTheDocument();
    expect(screen.getByText(/The amygdala has activated/i)).toBeInTheDocument();
  });

  it('toggles node selection when clicked again', async () => {
    const user = userEvent.setup();
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);

    const panicButton = screen.getByText(/Panic/i);
    await user.click(panicButton);
    expect(screen.getByText(/Your body is trying to protect you/i)).toBeInTheDocument();

    await user.click(panicButton);
    expect(screen.queryByText(/Your body is trying to protect you/i)).not.toBeInTheDocument();
  });

  it('displays breathing exercise section', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/BREATHING EXERCISE/i)).toBeInTheDocument();
  });

  it('starts breathing exercise when button is clicked', async () => {
    const user = userEvent.setup();
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);

    const startButton = screen.getByText(/Begin Breathing Exercise/i);
    await user.click(startButton);

    expect(screen.getByText(/Stop/i)).toBeInTheDocument();
  });

  it('displays core reassurance section', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Core Reassurance/i)).toBeInTheDocument();
  });

  it('toggles core reassurance content', async () => {
    const user = userEvent.setup();
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);

    const toggleButton = screen.getByText(/Core Reassurance/i);
    await user.click(toggleButton);

    expect(screen.getByText(/You are safe. This feeling will pass/i)).toBeInTheDocument();
  });

  it('displays critical energy warning when spoons are low', async () => {
    const user = userEvent.setup();
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);

    // Decrease spoons to critical level
    const spentButton = screen.getByText(/Spent Energy/i);
    for (let i = 0; i < 11; i++) {
      await user.click(spentButton);
    }

    expect(screen.getByText(/Critical energy level/i)).toBeInTheDocument();
  });

  it('has accessible structure', () => {
    render(<YouAreSafe isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/You Are Safe/i)).toBeInTheDocument();
    expect(screen.getByText(/COGNITIVE ENERGY/i)).toBeInTheDocument();
  });

  it('closes when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<YouAreSafe isOpen={true} onClose={onClose} />);

    const overlay = container.querySelector('.you-are-safe-overlay');
    if (overlay) {
      await user.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });
});
