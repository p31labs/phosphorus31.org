import express from 'express';
import { SovereignAgent } from './agent.ts';

const app = express();
const port = process.env.PORT || 3000;

const agent = new SovereignAgent();

app.get('/', (req, res) => {
  res.send(agent.greet());
});

// Example endpoints for plugins
app.get('/wallet/balance', (req, res) => {
  res.json({ balance: agent.wallet.getBalance() });
});

app.get('/onboarding/step', (req, res) => {
  res.json({ step: agent.onboarding.getCurrentStep() });
});

app.get('/knowledge/:topic', (req, res) => {
  res.json({ doc: agent.knowledge.getDoc(req.params.topic) });
});

app.get('/community/feedback', (req, res) => {
  res.json({ feedback: agent.community.getFeedback() });
});

app.listen(port, () => {
  console.log(`Sovereign Agent Core listening at http://localhost:${port}`);
});