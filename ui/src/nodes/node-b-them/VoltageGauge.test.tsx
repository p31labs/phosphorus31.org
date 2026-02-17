/**
 * Skipped in default npm test: React 18/19 monorepo conflict (see ui/vitest.config.ts exclude).
 * Re-enable after unifying React or isolating test env.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/helpers';
import { VoltageGauge } from './VoltageDetector';

// Mock GOD_CONFIG
vi.mock('../../god.config', () => ({
  default: {
    voltage: {
      low: { threshold: 0.3, color: '#10b981' },
      medium: { threshold: 0.6, color: '#f59e0b' },
      high: { threshold: 0.9, color: '#ef4444' },
    },
    theme: {
      text: { secondary: '#d1d5db' },
      bg: { accent: '#4b5563' },
      border: { default: '#374151' },
    },
    typography: {
      fontFamily: { display: 'system-ui' },
    },
  },
}));

describe('VoltageGauge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<VoltageGauge voltage={0.5} />);
    expect(screen.getByText('VOLTAGE')).toBeInTheDocument();
  });

  it('displays LOW voltage correctly', () => {
    render(<VoltageGauge voltage={0.2} />);
    expect(screen.getByText(/LOW/i)).toBeInTheDocument();
    expect(screen.getByText(/20%/i)).toBeInTheDocument();
  });

  it('displays MEDIUM voltage correctly', () => {
    render(<VoltageGauge voltage={0.5} />);
    expect(screen.getByText(/MEDIUM/i)).toBeInTheDocument();
    expect(screen.getByText(/50%/i)).toBeInTheDocument();
  });

  it('displays HIGH voltage correctly', () => {
    render(<VoltageGauge voltage={0.95} />);
    expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
    expect(screen.getByText(/95%/i)).toBeInTheDocument();
  });

  it('handles voltage at low threshold boundary', () => {
    render(<VoltageGauge voltage={0.3} />);
    expect(screen.getByText(/LOW/i)).toBeInTheDocument();
  });

  it('handles voltage at medium threshold boundary', () => {
    render(<VoltageGauge voltage={0.6} />);
    expect(screen.getByText(/MEDIUM/i)).toBeInTheDocument();
  });

  it('handles voltage at high threshold boundary', () => {
    render(<VoltageGauge voltage={0.9} />);
    expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
  });

  it('handles zero voltage', () => {
    render(<VoltageGauge voltage={0} />);
    expect(screen.getByText(/LOW/i)).toBeInTheDocument();
    expect(screen.getByText(/0%/i)).toBeInTheDocument();
  });

  it('handles maximum voltage (1.0)', () => {
    render(<VoltageGauge voltage={1.0} />);
    expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<VoltageGauge voltage={0.5} size="sm" />);
    const gauge = container.querySelector('.voltage-gauge');
    expect(gauge).toBeInTheDocument();
  });

  it('renders with medium size (default)', () => {
    const { container } = render(<VoltageGauge voltage={0.5} size="md" />);
    const gauge = container.querySelector('.voltage-gauge');
    expect(gauge).toBeInTheDocument();
  });

  it('renders with large size', () => {
    const { container } = render(<VoltageGauge voltage={0.5} size="lg" />);
    const gauge = container.querySelector('.voltage-gauge');
    expect(gauge).toBeInTheDocument();
  });

  it('displays percentage correctly for various voltages', () => {
    const { rerender } = render(<VoltageGauge voltage={0.25} />);
    expect(screen.getByText(/25%/i)).toBeInTheDocument();

    rerender(<VoltageGauge voltage={0.75} />);
    expect(screen.getByText(/75%/i)).toBeInTheDocument();

    rerender(<VoltageGauge voltage={0.123} />);
    expect(screen.getByText(/12%/i)).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<VoltageGauge voltage={0.5} />);
    expect(screen.getByText('VOLTAGE')).toBeInTheDocument();
  });

  it('renders voltage markers', () => {
    const { container } = render(<VoltageGauge voltage={0.5} />);
    const markers = container.querySelectorAll('div[style*="position: absolute"]');
    expect(markers.length).toBeGreaterThanOrEqual(2); // 33% and 66% markers
  });
});
