/**
 * Skipped in default npm test: React 18/19 monorepo conflict (see ui/vitest.config.ts exclude).
 * Re-enable after unifying React or isolating test env.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/helpers';
import userEvent from '@testing-library/user-event';
import { HeartbeatPanel } from './HeartbeatPanel';

// Mock GOD_CONFIG
vi.mock('../../god.config', () => ({
  default: {
    heartbeat: {
      statuses: {
        green: { label: 'Green', icon: '🟢', color: '#10b981', meaning: 'All systems operational' },
        yellow: { label: 'Yellow', icon: '🟡', color: '#f59e0b', meaning: 'Moderate stress' },
        orange: { label: 'Orange', icon: '🟠', color: '#f97316', meaning: 'High stress' },
        red: { label: 'Red', icon: '🔴', color: '#ef4444', meaning: 'Critical stress' },
      },
      checkInIntervals: [
        { id: '15m', label: '15 minutes', ms: 900000 },
        { id: '30m', label: '30 minutes', ms: 1800000 },
        { id: '1h', label: '1 hour', ms: 3600000 },
      ],
    },
    theme: {
      bg: {
        primary: '#0a0a0b',
        secondary: '#1f2937',
        tertiary: '#374151',
      },
      text: {
        primary: '#ffffff',
        secondary: '#d1d5db',
        muted: '#9ca3af',
        accent: '#3b82f6',
      },
      border: {
        default: '#374151',
      },
      voltage: {
        low: { color: '#10b981' },
        medium: { color: '#f59e0b' },
        high: { color: '#ef4444' },
      },
    },
    typography: {
      fontFamily: {
        display: 'system-ui',
        body: 'system-ui',
      },
    },
  },
}));

// Mock heartbeat store
const mockStore = {
  currentStatus: 'green' as const,
  checkInInterval: '30m',
  checkInTimerRemaining: 1800000,
  missedCheckIns: 0,
  isDeadManActive: false,
  peers: [],
  connectionCode: null as string | null,
  escalationConfig: { webhookUrl: '', enabled: false },
  dailyCheckIn: null,
  checkInHistory: [],
  setStatus: vi.fn(),
  checkIn: vi.fn(),
  setCheckInInterval: vi.fn(),
  generateConnectionCode: vi.fn(),
  clearConnectionCode: vi.fn(),
  addPeer: vi.fn(),
  removePeer: vi.fn(),
  setEscalationConfig: vi.fn(),
  exportLog: vi.fn(() => '{}'),
  exportCheckInHistory: vi.fn(() => '[]'),
  getTodayCheckIn: vi.fn(() => null),
  initializeMesh: vi.fn(),
  destroyMesh: vi.fn(),
};

vi.mock('../../store/heartbeat.store', () => ({
  default: () => mockStore,
}));

// Mock child components
vi.mock('./PeerStatus', () => ({
  default: ({ peer, onRemove }: any) => (
    <div data-testid="peer-status">
      {peer.name} <button onClick={onRemove}>Remove</button>
    </div>
  ),
}));

vi.mock('./DailyCheckIn', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? <div data-testid="daily-checkin">Daily Check-In</div> : null,
}));

vi.mock('./CheckInStatusBadge', () => ({
  default: ({ checkIn, onClick }: any) => (
    <div data-testid="checkin-badge" onClick={onClick}>
      Badge
    </div>
  ),
}));

vi.mock('./CheckInHistory', () => ({
  default: ({ history, onExport }: any) => <div data-testid="checkin-history">History</div>,
}));

describe('HeartbeatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.currentStatus = 'green';
    mockStore.isDeadManActive = false;
    mockStore.peers = [];
    mockStore.connectionCode = null;
    mockStore.getTodayCheckIn.mockReturnValue(null);
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
  });

  it('displays user name input', () => {
    render(<HeartbeatPanel />);
    const nameInput = screen.getByPlaceholderText(/Your name/i);
    expect(nameInput).toBeInTheDocument();
  });

  it('displays current status', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByText(/All systems operational/i)).toBeInTheDocument();
  });

  it('displays status buttons for all statuses', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByText(/Green/i)).toBeInTheDocument();
    expect(screen.getByText(/Yellow/i)).toBeInTheDocument();
    expect(screen.getByText(/Orange/i)).toBeInTheDocument();
    expect(screen.getByText(/Red/i)).toBeInTheDocument();
  });

  it('calls setStatus when status button is clicked', async () => {
    const user = userEvent.setup();
    render(<HeartbeatPanel />);
    const yellowButton = screen.getByText(/Yellow/i);

    await user.click(yellowButton);
    expect(mockStore.setStatus).toHaveBeenCalledWith('yellow');
  });

  it('displays daily check-in prompt when needed', () => {
    mockStore.getTodayCheckIn.mockReturnValue(null);
    render(<HeartbeatPanel />);
    expect(screen.getByText(/Daily Check-In Due/i)).toBeInTheDocument();
  });

  it('does not display daily check-in when completed', () => {
    mockStore.getTodayCheckIn.mockReturnValue({
      date: new Date().toISOString().split('T')[0],
      metrics: {},
    });
    render(<HeartbeatPanel />);
    expect(screen.queryByText(/Daily Check-In Due/i)).not.toBeInTheDocument();
  });

  it('displays check-in timer when dead man switch is active', () => {
    mockStore.isDeadManActive = true;
    render(<HeartbeatPanel />);
    expect(screen.getByText(/CHECK-IN TIMER/i)).toBeInTheDocument();
  });

  it('displays check-in button when dead man switch is active', () => {
    mockStore.isDeadManActive = true;
    render(<HeartbeatPanel />);
    expect(screen.getByText(/I'm Safe - Check In/i)).toBeInTheDocument();
  });

  it('calls checkIn when check-in button is clicked', async () => {
    const user = userEvent.setup();
    mockStore.isDeadManActive = true;
    render(<HeartbeatPanel />);
    const checkInButton = screen.getByText(/I'm Safe - Check In/i);

    await user.click(checkInButton);
    expect(mockStore.checkIn).toHaveBeenCalled();
  });

  it('displays connection code section', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByText(/CONNECTION CODE/i)).toBeInTheDocument();
  });

  it('generates connection code when button is clicked', async () => {
    const user = userEvent.setup();
    render(<HeartbeatPanel />);
    const generateButton = screen.getByText(/Generate/i);

    await user.click(generateButton);
    expect(mockStore.generateConnectionCode).toHaveBeenCalled();
  });

  it('displays connection code when available', () => {
    mockStore.connectionCode = 'test-code-123';
    render(<HeartbeatPanel />);
    expect(screen.getByText(/test-code-123/i)).toBeInTheDocument();
  });

  it('displays peers section', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByText(/TRUSTED PEERS/i)).toBeInTheDocument();
  });

  it('displays peer count', () => {
    mockStore.peers = [
      { id: '1', name: 'Peer 1', status: 'green', lastSeen: new Date() },
      { id: '2', name: 'Peer 2', status: 'yellow', lastSeen: new Date() },
    ];
    render(<HeartbeatPanel />);
    expect(screen.getByText(/TRUSTED PEERS \(2\)/i)).toBeInTheDocument();
  });

  it('displays empty state when no peers', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByText(/No peers connected/i)).toBeInTheDocument();
  });

  it('opens add peer form when button is clicked', async () => {
    const user = userEvent.setup();
    render(<HeartbeatPanel />);
    const addPeerButton = screen.getByText(/Add Peer/i);

    await user.click(addPeerButton);
    expect(screen.getByPlaceholderText(/Peer name/i)).toBeInTheDocument();
  });

  it('displays settings section', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByText(/SETTINGS/i)).toBeInTheDocument();
  });

  it('has accessible structure', () => {
    render(<HeartbeatPanel />);
    expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
    expect(screen.getByText(/Green/i)).toBeInTheDocument();
  });
});
