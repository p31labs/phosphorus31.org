/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                         📝 POETRY PAD ✨                                       ║
 * ║                   Where words become magic                                      ║
 * ║                                                                                 ║
 * ║  "Words are how we share our hearts. Write what you feel,                      ║
 * ║   and never be afraid of your own truth."              - Dad 💜                ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * EASTER EGGS:
 * - Write "I love you" → hearts appear
 * - Type "dad" or "daddy" → special message
 * - Complete 5 poems → "Word Wizard" badge
 */

import { useState, useEffect, useRef } from 'react';

// Age-appropriate writing prompts
const PROMPTS = [
  { emoji: '🌈', text: 'If I could be any color, I would be...' },
  { emoji: '🦄', text: 'Once upon a time, there was a magical...' },
  { emoji: '🌟', text: 'The thing that makes me happiest is...' },
  { emoji: '🐱', text: 'If my pet could talk, they would say...' },
  { emoji: '🚀', text: 'If I could travel anywhere, I would go to...' },
  { emoji: '🧁', text: 'My favorite day ever was when...' },
  { emoji: '🌸', text: 'Spring smells like... Summer sounds like...' },
  { emoji: '⭐', text: 'At night, the stars tell me...' },
  { emoji: '🎈', text: 'If I could fly, I would...' },
  { emoji: '💎', text: 'The most special thing about me is...' },
  { emoji: '🌊', text: 'The ocean waves whisper...' },
  { emoji: '🏰', text: 'In my magical castle, I would...' },
];

// Word bank for inspiration
const WORD_BANK = {
  feelings: ['happy', 'brave', 'curious', 'excited', 'peaceful', 'silly', 'cozy', 'sparkly'],
  colors: ['golden', 'silver', 'purple', 'turquoise', 'rainbow', 'midnight', 'sunset'],
  nature: ['butterfly', 'moonbeam', 'thunder', 'flower', 'river', 'mountain', 'forest'],
  magic: ['sparkle', 'wish', 'dream', 'wonder', 'adventure', 'treasure', 'secret'],
};

export function PoetryPad() {
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState('');
  const [poems, setPoems] = useState<{ prompt: string; text: string; date: string }[]>([]);
  const [showHearts, setShowHearts] = useState(false);
  const [showDadMessage, setShowDadMessage] = useState(false);
  const [showWordWizard, setShowWordWizard] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showWordBank, setShowWordBank] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const heartsShownRef = useRef(false);
  const dadMessageShownRef = useRef(false);

  // Count words
  useEffect(() => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    setWordCount(words.length);

    // Easter egg: "I love you"
    if (text.toLowerCase().includes('i love you') && !heartsShownRef.current) {
      heartsShownRef.current = true;
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 3000);
    }

    // Easter egg: "dad" or "daddy"
    if (
      (text.toLowerCase().includes('dad') || text.toLowerCase().includes('daddy')) &&
      !dadMessageShownRef.current
    ) {
      dadMessageShownRef.current = true;
      setShowDadMessage(true);
      setTimeout(() => setShowDadMessage(false), 5000);
    }
  }, [text]);

  // Check for Word Wizard achievement
  useEffect(() => {
    if (poems.length === 5 && !showWordWizard) {
      setShowWordWizard(true);
      setTimeout(() => setShowWordWizard(false), 4000);
    }
  }, [poems.length, showWordWizard]);

  const newPrompt = () => {
    const available = PROMPTS.filter((p) => p.text !== prompt.text);
    setPrompt(available[Math.floor(Math.random() * available.length)]);
    heartsShownRef.current = false;
    dadMessageShownRef.current = false;
  };

  const savePoem = () => {
    if (text.trim().length > 0) {
      setPoems((prev) => [
        ...prev,
        {
          prompt: prompt.text,
          text: text,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setText('');
      newPrompt();
    }
  };

  const insertWord = (word: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + word + ' ' + text.substring(end);
    setText(newText);

    // Focus and place cursor after inserted word
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + word.length + 1;
    }, 0);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
        background: 'linear-gradient(135deg, #1F2937 0%, #1E1B4B 100%)',
        borderRadius: '20px',
        border: '1px solid #374151',
        minHeight: '450px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hearts animation */}
      {showHearts && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '60px',
            animation: 'heartBurst 3s ease-out forwards',
          }}
        >
          💜💖💜
        </div>
      )}

      {/* Dad message easter egg */}
      {showDadMessage && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(139, 92, 246, 0.95)',
            padding: '24px',
            borderRadius: '16px',
            zIndex: 100,
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-out',
            maxWidth: '280px',
          }}
        >
          <div style={{ fontSize: '48px' }}>💜📝💜</div>
          <div style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
            You wrote about me!
          </div>
          <div style={{ color: 'white', fontSize: '14px', marginTop: '8px' }}>
            I love you more than all the words in all the books in all the world.
            <br />
            <br />
            Keep writing, little poet.
            <br />
            <em>- Dad</em>
          </div>
        </div>
      )}

      {/* Word Wizard achievement */}
      {showWordWizard && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            padding: '24px',
            borderRadius: '16px',
            zIndex: 100,
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <div style={{ fontSize: '48px' }}>📝✨🏆</div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>Word Wizard!</div>
          <div style={{ color: 'white', fontSize: '14px' }}>
            5 poems written! You're a real writer!
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes heartBurst {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
        <span style={{ fontSize: '28px' }}>📝</span>
        <h2
          style={{
            color: '#F3F4F6',
            fontSize: '22px',
            fontWeight: 700,
            margin: 0,
            letterSpacing: '2px',
          }}
        >
          POETRY PAD
        </h2>
        <span style={{ fontSize: '28px' }}>✨</span>
      </div>

      {/* Poems counter */}
      <div
        style={{
          background: '#8B5CF620',
          padding: '6px 14px',
          borderRadius: '12px',
          color: '#A78BFA',
          fontSize: '13px',
          zIndex: 1,
        }}
      >
        📚 Poems Written: {poems.length}
      </div>

      {/* Prompt card */}
      <div
        style={{
          background: '#374151',
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          maxWidth: '340px',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>{prompt.emoji}</span>
          <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Writing prompt:</span>
        </div>
        <div style={{ color: '#F3F4F6', fontSize: '15px', fontStyle: 'italic' }}>
          "{prompt.text}"
        </div>
        <button
          onClick={newPrompt}
          style={{
            marginTop: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #4B5563',
            background: '#1F2937',
            color: '#9CA3AF',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          🎲 New Prompt
        </button>
      </div>

      {/* Writing area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing your poem here..."
        style={{
          width: '100%',
          maxWidth: '340px',
          minHeight: '120px',
          padding: '16px',
          borderRadius: '12px',
          border: '2px solid #4B5563',
          background: '#111827',
          color: '#F3F4F6',
          fontSize: '15px',
          lineHeight: 1.6,
          resize: 'vertical',
          fontFamily: 'Georgia, serif',
          zIndex: 1,
        }}
      />

      {/* Word count */}
      <div
        style={{
          color: '#6B7280',
          fontSize: '12px',
          zIndex: 1,
        }}
      >
        Words: {wordCount}
      </div>

      {/* Word bank toggle */}
      <button
        onClick={() => setShowWordBank(!showWordBank)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #4B5563',
          background: showWordBank ? '#8B5CF620' : '#374151',
          color: '#F3F4F6',
          fontSize: '13px',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        {showWordBank ? '📕 Hide Words' : '📖 Word Ideas'}
      </button>

      {/* Word bank */}
      {showWordBank && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            maxWidth: '340px',
            padding: '12px',
            background: '#1F2937',
            borderRadius: '12px',
            zIndex: 1,
          }}
        >
          {Object.entries(WORD_BANK).map(([category, words]) => (
            <div key={category}>
              <div
                style={{
                  color: '#9CA3AF',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                {category}
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {words.map((word) => (
                  <button
                    key={word}
                    onClick={() => insertWord(word)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #4B5563',
                      background: '#374151',
                      color: '#D1D5DB',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '12px', zIndex: 1 }}>
        <button
          onClick={() => setText('')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #6B7280',
            background: '#37415180',
            color: '#9CA3AF',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ✖️ Clear
        </button>
        <button
          onClick={savePoem}
          disabled={text.trim().length === 0}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: '1px solid #22C55E',
            background: text.trim().length > 0 ? '#22C55E30' : '#37415140',
            color: text.trim().length > 0 ? '#22C55E' : '#6B7280',
            fontSize: '14px',
            cursor: text.trim().length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          ✅ Save Poem
        </button>
      </div>

      {/* Instructions */}
      <div
        style={{
          color: '#6B7280',
          fontSize: '11px',
          textAlign: 'center',
          maxWidth: '280px',
          zIndex: 1,
        }}
      >
        There's no wrong way to write! Let your imagination flow. 💫
      </div>

      {/* Hidden signature */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          color: '#4B556320',
          fontSize: '10px',
          fontFamily: 'monospace',
        }}
      >
        📝💜
      </div>
    </div>
  );
}

export default PoetryPad;
