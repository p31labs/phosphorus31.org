/**
 * The Centaur API Client Example
 * 
 * Complete example of using The Centaur API client.
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { CentaurClient } from '@p31/centaur';

const centaur = new CentaurClient({
  url: process.env.CENTAUR_URL || 'http://localhost:3000',
  apiKey: process.env.CENTAUR_API_KEY,
});

// Example: Health check
async function checkHealth() {
  const health = await centaur.health();
  console.log('The Centaur health:', health.status);
}

// Example: Authentication
async function authenticate() {
  const result = await centaur.login({
    username: 'user@example.com',
    password: 'password',
  });
  
  if (result.requiresMFA) {
    const mfaResult = await centaur.completeMFA({
      mfaToken: result.mfaToken,
      mfaCode: '123456',
    });
    return mfaResult.token;
  }
  
  return result.token;
}

// Example: Chat with AI
async function chatWithAI(message: string) {
  const response = await centaur.chat({
    message,
    context: {
      userId: 'user-123',
      sessionId: 'session-456',
    },
  });
  
  return response.message;
}

// Example: Generate legal document
async function generateLegalDocument() {
  const document = await centaur.generateLegalDocument({
    documentType: 'motion',
    context: {
      caseNumber: 'FC-2026-001',
      court: 'Family Court',
    },
  });
  
  return document;
}

// Example: Generate SOP
async function generateSOP() {
  const sop = await centaur.generateSOP({
    domain: 'technical',
    objective: 'Deploy new feature',
    priority: 'high',
  });
  
  return sop;
}

export { checkHealth, authenticate, chatWithAI, generateLegalDocument, generateSOP };
