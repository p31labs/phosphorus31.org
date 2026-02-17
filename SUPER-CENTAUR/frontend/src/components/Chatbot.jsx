import React, { useState, useRef, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  LightBulbIcon,
  CpuChipIcon,
  ScaleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import api from '../lib/api';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your SUPER CENTAUR AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.post('/api/chat/message', {
        message: inputMessage,
        sessionId: 'default',
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply || response.data.message || 'Response received.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to the Quantum Brain right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { key: 'legal', label: 'Legal Help', icon: ScaleIcon },
    { key: 'medical', label: 'Medical Docs', icon: ShieldCheckIcon },
    { key: 'finance', label: 'Finance', icon: CurrencyDollarIcon },
    { key: 'blockchain', label: 'Blockchain', icon: ChartBarIcon },
    { key: 'consciousness', label: 'Consciousness', icon: CpuChipIcon },
  ];

  const quickMessages = {
    legal: 'Help me with a legal case analysis',
    medical: 'I need medical documentation assistance',
    finance: 'Show me my L.O.V.E. Economy status',
    blockchain: 'Check my blockchain agents status',
    consciousness: 'Monitor my consciousness levels',
  };

  const handleQuickAction = (action) => {
    setInputMessage(quickMessages[action]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">AI Assistant</h1>
          <p className="text-muted mt-1">Your SUPER CENTAUR Quantum Brain Companion</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-primary to-accent rounded-xl flex items-center justify-center">
          <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-96 flex flex-col p-0! overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-label="Chat messages" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-linear-to-r from-primary to-secondary text-white'
                    : 'bg-surface text-main border border-border'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs text-muted mt-1 text-right">{message.timestamp}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start" role="status" aria-label="Assistant is typing">
              <div className="bg-surface text-main border border-border rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="border-t border-border p-3">
          <div className="flex flex-wrap gap-2">
            {quickActions.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleQuickAction(key)}
                className="flex items-center space-x-1 px-3 py-1 bg-surface text-muted rounded-full text-sm hover:text-main hover:border-primary border border-border transition-colors"
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-3">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <input
              id="chat-input"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send)"
              className="ui-input flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="flex items-center space-x-2 px-6"
            >
              <PaperAirplaneIcon className="w-5 h-5" aria-hidden="true" />
              <span>Send</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center space-x-3 mb-3">
            <SparklesIcon className="w-6 h-6 text-accent" aria-hidden="true" />
            <h4 className="font-semibold text-main">Smart Responses</h4>
          </div>
          <p className="text-sm text-muted">Get intelligent, context-aware responses powered by the Quantum Brain</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-3">
            <LightBulbIcon className="w-6 h-6 text-warning" aria-hidden="true" />
            <h4 className="font-semibold text-main">Quick Actions</h4>
          </div>
          <p className="text-sm text-muted">Access common tasks with one click for maximum efficiency</p>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-3">
            <CpuChipIcon className="w-6 h-6 text-primary" aria-hidden="true" />
            <h4 className="font-semibold text-main">24/7 Availability</h4>
          </div>
          <p className="text-sm text-muted">Always here to assist you with any SUPER CENTAUR feature</p>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
