// L.O.V.E. Economy Test Suite
import loveEconomy from './index';

describe('L.O.V.E. Economy', () => {
  it('should report healthy status after initialize', async () => {
    await loveEconomy.initialize({});
    const status = loveEconomy.getStatus();
    expect(status.healthy).toBe(true);
    expect(status.message).toMatch(/active/i);
  });

  it('should have correct id and name', () => {
    expect(loveEconomy.id).toBe('love-economy');
    expect(loveEconomy.name).toBe('L.O.V.E. Economy');
  });
});
