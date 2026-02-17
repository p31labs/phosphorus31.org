declare const loveEconomy: {
  id: string;
  name: string;
  initialize: (config: Record<string, unknown>) => Promise<void>;
  getStatus: () => { healthy: boolean; message: string };
};
export default loveEconomy;
