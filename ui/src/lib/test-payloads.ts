/**
 * Test Payloads for First Light Verification
 * Sample messages for testing the Cognitive Shield
 */

export interface TestPayload {
  readonly id: string;
  readonly text: string;
  readonly expectedVoltage: number;
  readonly category: 'urgent' | 'coercive' | 'neutral' | 'supportive';
}

export function getAllTestPayloads(): readonly TestPayload[] {
  return [
    {
      id: 'test-1',
      text: 'This is urgent! You need to respond immediately!',
      expectedVoltage: 8,
      category: 'urgent',
    },
    {
      id: 'test-2',
      text: 'You should feel ashamed for not responding sooner.',
      expectedVoltage: 9,
      category: 'coercive',
    },
    {
      id: 'test-3',
      text: 'How are you doing today?',
      expectedVoltage: 2,
      category: 'neutral',
    },
    {
      id: 'test-4',
      text: "I hope you're having a good day. Take care of yourself.",
      expectedVoltage: 1,
      category: 'supportive',
    },
  ];
}
