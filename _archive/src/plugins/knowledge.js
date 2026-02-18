// src/plugins/knowledge.js

/**
 * Documentation/Knowledge Plugin (MVP)
 * - Modular, context-aware documentation
 * - Supports plain language, visual, and neurodiversity-friendly formats
 * - Can be extended with AI-powered Q&A and search
 */

class Knowledge {
  constructor() {
    this.docs = {
      'intro': 'Welcome to the Sovereign Agent documentation. Here you’ll find guides, FAQs, and resources.',
      'wallet': 'Your wallet is local-first and user-owned. Learn how to manage your assets and transactions.',
      'onboarding': 'Onboarding is self-paced and adaptive. Choose your learning style and go at your own speed.'
    };
  }

  getDoc(topic) {
    return this.docs[topic] || 'Documentation not found.';
  }

  addDoc(topic, content) {
    this.docs[topic] = content;
  }
}

module.exports = { Knowledge };