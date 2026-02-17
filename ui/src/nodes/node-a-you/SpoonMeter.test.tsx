/**
 * Skipped in default npm test: React 18/19 monorepo conflict (see ui/vitest.config.ts exclude).
 * Re-enable after unifying React or isolating test env.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/helpers';
import { SpoonMeter } from './SpoonMeter';
import * as heartbeatStore from '../../stores/heartbeat.store';

// Mock the heartbeat store
vi.mock('../../stores/heartbeat.store', () => ({
  useSpoons: vi.fn(),
  useHeartbeatStatus: vi.fn(),
  useHeartbeatPercent: vi.fn(),
}));

describe('SpoonMeter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(6);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('green');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(50);

    render(<SpoonMeter />);
    expect(screen.getByText(/Cognitive Energy \(Spoons\)/i)).toBeInTheDocument();
  });

  it('displays correct spoon count and max spoons', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(6);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('green');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(50);

    render(<SpoonMeter />);
    expect(screen.getByText('6 / 12')).toBeInTheDocument();
  });

  it('displays 0 spoons correctly', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(0);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('red');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(0);

    render(<SpoonMeter />);
    expect(screen.getByText('0 / 12')).toBeInTheDocument();
  });

  it('displays 12 spoons correctly', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(12);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('green');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(100);

    render(<SpoonMeter />);
    expect(screen.getByText('12 / 12')).toBeInTheDocument();
  });

  it('displays heartbeat percentage', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(6);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('yellow');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(50);

    render(<SpoonMeter />);
    expect(screen.getByText(/Heartbeat: 50%/i)).toBeInTheDocument();
  });

  it('displays correct color for green heartbeat', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(10);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('green');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(83);

    const { container } = render(<SpoonMeter />);
    const colorElement = container.querySelector('span[style*="color"]');
    expect(colorElement).toBeInTheDocument();
  });

  it('displays correct color for yellow heartbeat', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(6);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('yellow');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(50);

    render(<SpoonMeter />);
    expect(screen.getByText(/yellow/i)).toBeInTheDocument();
  });

  it('displays correct color for orange heartbeat', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(4);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('orange');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(33);

    render(<SpoonMeter />);
    expect(screen.getByText(/orange/i)).toBeInTheDocument();
  });

  it('displays correct color for red heartbeat', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(2);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('red');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(17);

    render(<SpoonMeter />);
    expect(screen.getByText(/red/i)).toBeInTheDocument();
  });

  it('renders 12 spoon bars', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(6);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('green');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(50);

    const { container } = render(<SpoonMeter />);
    const spoonBars = container.querySelectorAll('div[style*="height: 8"]');
    expect(spoonBars.length).toBeGreaterThanOrEqual(12);
  });

  it('has accessible text content', () => {
    vi.mocked(heartbeatStore.useSpoons).mockReturnValue(6);
    vi.mocked(heartbeatStore.useHeartbeatStatus).mockReturnValue('green');
    vi.mocked(heartbeatStore.useHeartbeatPercent).mockReturnValue(50);

    render(<SpoonMeter />);
    expect(screen.getByText(/Cognitive Energy/i)).toBeInTheDocument();
    expect(screen.getByText(/Heartbeat:/i)).toBeInTheDocument();
  });
});
