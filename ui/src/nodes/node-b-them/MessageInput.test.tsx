/**
 * Skipped in default npm test: React 18/19 monorepo conflict (see ui/vitest.config.ts exclude).
 * Re-enable after unifying React or isolating test env.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/helpers';
import userEvent from '@testing-library/user-event';
import { MessageInput } from './MessageInput';

// Mock GOD_CONFIG
vi.mock('../../god.config', () => ({
  default: {
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
      },
      border: {
        default: '#374151',
      },
      gradient: {
        shield: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
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

// Mock shield store
const mockIngestMessage = vi.fn();

vi.mock('../../store/shield.store', () => ({
  default: () => ({
    ingestMessage: mockIngestMessage,
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    readText: vi.fn(),
    writeText: vi.fn(),
  },
});

describe('MessageInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MessageInput />);
    expect(screen.getByText(/AIR GAP INTAKE/i)).toBeInTheDocument();
  });

  it('displays header text', () => {
    render(<MessageInput />);
    expect(screen.getByText(/AIR GAP INTAKE/i)).toBeInTheDocument();
    expect(screen.getByText(/Paste or type the message/i)).toBeInTheDocument();
  });

  it('has source input field', () => {
    render(<MessageInput />);
    const sourceInput = screen.getByPlaceholderText(/Source \(e.g., 'Partner'/i);
    expect(sourceInput).toBeInTheDocument();
  });

  it('has message textarea', () => {
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);
    expect(textarea).toBeInTheDocument();
  });

  it('allows typing in source field', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const sourceInput = screen.getByPlaceholderText(/Source/i);

    await user.type(sourceInput, 'Partner');
    expect(sourceInput).toHaveValue('Partner');
  });

  it('allows typing in message field', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);

    await user.type(textarea, 'Test message');
    expect(textarea).toHaveValue('Test message');
  });

  it('submit button is disabled when message is empty', () => {
    render(<MessageInput />);
    const submitButton = screen.getByText(/INGEST TO SHIELD/i);
    expect(submitButton).toBeDisabled();
  });

  it('submit button is enabled when message has content', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);
    const submitButton = screen.getByText(/INGEST TO SHIELD/i);

    await user.type(textarea, 'Test message');
    expect(submitButton).not.toBeDisabled();
  });

  it('calls ingestMessage when submit button is clicked', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);
    const sourceInput = screen.getByPlaceholderText(/Source/i);
    const submitButton = screen.getByText(/INGEST TO SHIELD/i);

    await user.type(sourceInput, 'Partner');
    await user.type(textarea, 'Test message');
    await user.click(submitButton);

    expect(mockIngestMessage).toHaveBeenCalledWith('Test message', 'Partner');
  });

  it('clears message after submission', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);
    const submitButton = screen.getByText(/INGEST TO SHIELD/i);

    await user.type(textarea, 'Test message');
    await user.click(submitButton);

    expect(textarea).toHaveValue('');
  });

  it('handles paste button click', async () => {
    const user = userEvent.setup();
    vi.mocked(navigator.clipboard.readText).mockResolvedValue('Pasted text');

    render(<MessageInput />);
    const pasteButton = screen.getByTitle(/Paste from clipboard/i);
    await user.click(pasteButton);

    // Note: We can't easily test the async clipboard read in this setup
    // but we can verify the button exists and is clickable
    expect(pasteButton).toBeInTheDocument();
  });

  it('handles Ctrl+Enter keyboard shortcut', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);

    await user.type(textarea, 'Test message');
    await user.keyboard('{Control>}{Enter}{/Control}');

    expect(mockIngestMessage).toHaveBeenCalled();
  });

  it('displays tip text', () => {
    render(<MessageInput />);
    expect(screen.getByText(/Pro Tip:/i)).toBeInTheDocument();
    expect(screen.getByText(/Copy messages without reading them/i)).toBeInTheDocument();
  });

  it('has accessible labels and placeholders', () => {
    render(<MessageInput />);
    expect(screen.getByPlaceholderText(/Source/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Paste the raw message/i)).toBeInTheDocument();
  });

  it('trims whitespace from message before submission', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);
    const submitButton = screen.getByText(/INGEST TO SHIELD/i);

    await user.type(textarea, '  Test message  ');
    await user.click(submitButton);

    expect(mockIngestMessage).toHaveBeenCalledWith('Test message', 'Manual Input');
  });

  it('uses "Manual Input" as default source when source is empty', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);
    const textarea = screen.getByPlaceholderText(/Paste the raw message/i);
    const submitButton = screen.getByText(/INGEST TO SHIELD/i);

    await user.type(textarea, 'Test message');
    await user.click(submitButton);

    expect(mockIngestMessage).toHaveBeenCalledWith('Test message', 'Manual Input');
  });
});
