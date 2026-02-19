/**
 * Quantum Hello World — AI-powered onboarding.
 * Phases: boot → void → converse → covenant → forming → born → mesh | returning.
 * Uses window.storage only. No localStorage/sessionStorage in this file.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PosnerViz } from './PosnerViz';
import { SonicMolecule } from '../SonicMolecule';
import { Waveform } from '../Waveform';
import * as Tone from 'tone';
import { ResonanceEngine, type NoteRecord, type FreqPoint } from '../../lib/resonance-engine';
import { speak, stopSpeaking, startListening, stopListening, isSpeechRecognitionSupported } from '../../lib/voice';
import { genesis, storedToP31Molecule, pullMetabolism, pullWallet, pullMeshDirectory } from '../../lib/game-client';
import type { GameClient, GameBehavior } from '@p31/game-integration';
import {
  BRAND,
  DELTA_COVENANT,
  FOOTER_TEXT,
} from './constants';
import {
  callPhosphorus,
  detectProvider,
  detectProviderFromKey,
  type AIProvider,
  type ConversationMessage,
} from '../../lib/ai-provider';
import type { QuantumPhase, StoredMolecule, ConverseMessage } from './types';

const STORAGE_KEYS = {
  molecule: 'p31:molecule',
  dome: (fp: string) => `p31:dome:${fp}`,
  dir: (fp: string) => `p31:dir:${fp}`,
};

function useStorage() {
  return typeof window !== 'undefined' ? window.storage : undefined;
}

async function sha256Hex(data: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function coherenceLevel(c: number): string {
  if (c >= 0.85) return 'POSNER';
  if (c >= 0.65) return 'BONDED';
  if (c >= 0.4) return 'CALCIUM';
  return 'SEED';
}

export function QuantumHelloWorld() {
  const storage = useStorage();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<QuantumPhase>('boot');
  const [molecule, setMolecule] = useState<StoredMolecule | null>(null);
  const [converseMessages, setConverseMessages] = useState<ConverseMessage[]>([]);
  const [converseInput, setConverseInput] = useState('');
  const [converseLoading, setConverseLoading] = useState(false);
  const [coherence, setCoherence] = useState(0.15);
  const [covenantIndex, setCovenantIndex] = useState(0);
  const [domeName, setDomeName] = useState('');
  const [domeColor, setDomeColor] = useState<string>(BRAND.green);
  const [domeIntent, setDomeIntent] = useState('');
  const [fingerprint, setFingerprint] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [engine] = useState(() => new ResonanceEngine());
  const [activeNote, setActiveNote] = useState<NoteRecord | null>(null);
  const [freqSig, setFreqSig] = useState<FreqPoint[]>([]);
  const [moleculeHash, setMoleculeHash] = useState('');
  const [noteCount, setNoteCount] = useState(0);
  const [, setAudioReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const voiceEnabledRef = useRef(true);
  voiceEnabledRef.current = voiceEnabled;
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const canListen = isSpeechRecognitionSupported();
  const containerWidthRef = useRef(320);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [, setGameClient] = useState<GameClient | null>(null);
  const [gameMode, setGameMode] = useState<GameBehavior | null>(null);
  const [walletBalance, setWalletBalance] = useState<{ sovereigntyPool: number; performancePool: number; totalEarned: number } | null>(null);
  const [, setAllDomes] = useState<Array<{ name: string; color: string; intent: string; fingerprint: string; created: string }>>([]);

  const [runtimeKey, setRuntimeKey] = useState('');
  const [runtimeProvider, setRuntimeProvider] = useState<AIProvider>('none');
  const [activeProvider, setActiveProvider] = useState<AIProvider>('none');
  const effectiveProvider: AIProvider =
    runtimeKey.trim() ? (runtimeProvider !== 'none' ? runtimeProvider : detectProviderFromKey(runtimeKey)) : detectProvider();
  const hasKey = effectiveProvider !== 'none';
  const firstMessageTriggered = useRef(false);

  useEffect(() => () => engine.dispose(), [engine]);
  useEffect(() => {
    engine.onNoteCallback = (note) => {
      setActiveNote(note);
      setNoteCount(engine.noteHistory.length);
      setFreqSig(engine.getFrequencySignature());
      setMoleculeHash(engine.getMoleculeHash());
      setTimeout(() => setActiveNote(null), 400);
    };
  }, [engine]);

  useEffect(() => {
    engine.setMuted(muted);
  }, [muted, engine]);

  // Returning: play saved resonance melody if we have history
  useEffect(() => {
    if (phase !== 'returning' || !molecule?.resonanceHistory?.length) return;
    (async () => {
      await engine.init();
      const history = molecule.resonanceHistory!.map((n, i) => ({
        freq: n.freq,
        duration: n.duration,
        velocity: n.velocity,
        time: 0,
        word: n.word ?? '',
        mood: n.mood ?? 'calm',
        coherence: molecule.coherence ?? 0.85,
        role: (n.role as 'human' | 'phosphorus') ?? 'human',
        index: i,
      }));
      engine.playReturnMelody(history);
    })();
  }, [phase, molecule?.resonanceHistory, molecule?.coherence, engine]);

  // BOOT: check for existing molecule; if returning, wire game client
  useEffect(() => {
    if (phase !== 'boot' || !storage) return;
    storage.get(STORAGE_KEYS.molecule).then((raw) => {
      if (raw) {
        try {
          const mol = JSON.parse(raw) as StoredMolecule;
          setMolecule(mol);
          setPhase('returning');
          (async () => {
            try {
              const gc = await genesis(storedToP31Molecule(mol));
              setGameClient(gc);
              const mode = await pullMetabolism();
              if (mode) setGameMode(mode);
            } catch {
              // Offline is fine.
            }
          })();
        } catch {
          setPhase('void');
        }
      } else {
        setPhase('void');
      }
    });
  }, [phase, storage]);

  const converse = useCallback(
    async (userText: string | null) => {
      setConverseLoading(true);
      setError(null);
      const history: ConversationMessage[] = converseMessages.map((m) => ({ role: m.role, content: m.content }));
      if (userText) {
        history.push({ role: 'user', content: userText });
        setConverseMessages((prev) => [...prev, { role: 'user', content: userText }]);
      }

      try {
        if (userText) {
          await engine.playPhrase(userText, coherence, 'human');
          setFreqSig(engine.getFrequencySignature());
          setMoleculeHash(engine.getMoleculeHash());
          setNoteCount(engine.noteHistory.length);
        }

        const overrideKey = runtimeKey.trim() ? runtimeKey : undefined;
        const overrideProv = runtimeKey.trim() ? runtimeProvider !== 'none' ? runtimeProvider : detectProviderFromKey(runtimeKey) : undefined;
        const response = await callPhosphorus(history, coherence, overrideKey, overrideProv);

        if (userText === null && history.length === 0 && response.message.includes('Set any AI key')) {
          setError(null);
          setConverseLoading(false);
          return;
        }

        setActiveProvider(overrideProv ?? effectiveProvider);
        const nextCoherence = Math.max(0.05, Math.min(0.95, response.coherence));
        setCoherence(nextCoherence);

        await engine.playPhrase(response.message, nextCoherence, 'phosphorus');
        setFreqSig(engine.getFrequencySignature());
        setMoleculeHash(engine.getMoleculeHash());
        setNoteCount(engine.noteHistory.length);

        setConverseMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.message, coherence: nextCoherence },
        ]);

        if (voiceEnabledRef.current) {
          speak(response.message).catch(() => {});
        }

        if (response.ready) setPhase('covenant');
      } catch (e) {
        setError('Connection lost. The signal will return.');
      } finally {
        setConverseLoading(false);
      }
    },
    [converseMessages, coherence, engine, runtimeKey, runtimeProvider, effectiveProvider]
  );

  const acceptCovenant = useCallback(() => {
    if (covenantIndex < DELTA_COVENANT.length - 1) {
      setCovenantIndex((i) => i + 1);
    } else {
      setPhase('forming');
    }
  }, [covenantIndex]);

  const runForming = useCallback(async () => {
    await engine.init();
    engine.playFormationChord();
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
    const pubJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const privJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    const fp = await sha256Hex(JSON.stringify(pubJwk));
    const covenantPayload = DELTA_COVENANT.map((d) => `${d.symbol} ${d.text}`).join('\n');
    const sigBuffer = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      keyPair.privateKey,
      new TextEncoder().encode(covenantPayload)
    );
    const sigHex = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const now = new Date().toISOString();
    const mol: StoredMolecule = {
      fingerprint: fp,
      publicKey: pubJwk,
      privateKey: privJwk,
      created: now,
      covenantSig: sigHex,
      covenantAt: now,
      dome: { name: domeName || 'My Dome', color: domeColor, intent: domeIntent || 'To hold.' },
      coherence,
      metabolism: { spoons: 12, maxSpoons: 12, color: 'GREEN', lastSync: now },
      resonanceSignature: engine.getMoleculeHash(),
      noteCount: engine.noteHistory.length,
      resonanceHistory: engine.noteHistory.slice(-100).map((n) => ({
        freq: n.freq,
        duration: n.duration,
        velocity: n.velocity,
        word: n.word,
        mood: n.mood,
        role: n.role,
      })),
    };
    if (storage) {
      await storage.set(STORAGE_KEYS.molecule, JSON.stringify(mol));
      await storage.set(STORAGE_KEYS.dome(fp), JSON.stringify(mol.dome));
    }
    const p31Mol = storedToP31Molecule(mol);
    const gameClientResult = await genesis(p31Mol);
    setGameClient(gameClientResult);
    setMolecule(mol);
    setFingerprint(fp);
    setPhase('born');
  }, [domeName, domeColor, domeIntent, coherence, storage, engine]);

  // Provider is determined by effectiveProvider (line ~87):
  // manual dropdown selection takes priority, auto-detect is fallback only.

  useEffect(() => {
    if (phase !== 'converse' || converseMessages.length !== 0 || !hasKey || firstMessageTriggered.current) return;
    firstMessageTriggered.current = true;
    converse(null);
  }, [phase, converseMessages.length, hasKey, converse]);

  useEffect(() => {
    if (phase === 'forming') runForming();
  }, [phase, runForming]);

  useEffect(() => {
    if (phase === 'born' && molecule) {
      setDomeName(molecule.dome.name);
      setDomeColor(molecule.dome.color);
      setDomeIntent(molecule.dome.intent);
    }
  }, [phase, molecule]);

  const enterMesh = useCallback(async () => {
    const mode = await pullMetabolism();
    if (mode) setGameMode(mode);
    if (molecule) {
      const wallet = await pullWallet(molecule.fingerprint);
      if (wallet) setWalletBalance(wallet);
    }
    const shelterDomes = await pullMeshDirectory();
    if (shelterDomes.length > 0) {
      setAllDomes((prev) => {
        const fps = new Set(prev.map((d) => d.fingerprint));
        const merged = [...prev];
        for (const d of shelterDomes) {
          if (!fps.has(d.fingerprint)) {
            merged.push({
              name: d.dome_name,
              color: d.dome_color,
              intent: d.dome_intent ?? '',
              fingerprint: d.fingerprint,
              created: d.created_at,
            });
          }
        }
        return merged;
      });
    }
    setPhase('mesh');
    navigate('/mesh');
  }, [molecule, navigate]);

  if (phase === 'boot') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-live="polite"
        aria-label="Loading"
      >
        <PosnerViz coherence={0.15} />
      </div>
    );
  }

  if (phase === 'void') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: BRAND.muted,
          fontFamily: 'Oxanium, sans-serif',
        }}
        role="button"
        tabIndex={0}
        onClick={async () => {
          await engine.init();
          setAudioReady(true);
          setPhase('converse');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            engine.init().then(() => {
              setAudioReady(true);
              setPhase('converse');
            });
          }
        }}
        aria-label="Tap to awaken the phosphorus"
      >
        <PosnerViz coherence={0.15} />
        <p style={{ marginTop: 24, fontSize: 14 }}>Tap to awaken the phosphorus</p>
      </div>
    );
  }

  if (phase === 'converse') {
    const playing = engine.playing;
    const inputDisabled = converseLoading || playing;
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'Oxanium, sans-serif',
          color: BRAND.text,
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
          <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 4, zIndex: 2 }}>
            <button
              type="button"
              onClick={() => {
                setVoiceEnabled((v) => {
                  if (v) stopSpeaking();
                  return !v;
                });
              }}
              style={{
                fontSize: 8,
                padding: 4,
                background: 'transparent',
                border: 'none',
                color: voiceEnabled ? BRAND.cyan : BRAND.dim,
                cursor: 'pointer',
              }}
              aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? '🗣️' : '🤫'}
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              style={{
                fontSize: 8,
                padding: 4,
                background: 'transparent',
                border: 'none',
                color: BRAND.dim,
                cursor: 'pointer',
              }}
              aria-label={muted ? 'Unmute resonance' : 'Mute resonance'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
          <SonicMolecule
            notes={freqSig}
            coherence={coherence}
            activeNote={activeNote}
            sz={220}
            reducedMotion={reducedMotion}
          />
          <Waveform notes={freqSig} width={containerWidthRef.current || 320} height={40} />
          <p style={{ color: BRAND.muted, fontSize: 10, marginTop: 8 }}>
            {noteCount} NOTES · {coherenceLevel(coherence)}
            {activeProvider !== 'none' && converseMessages.length > 0 && (
              <span
                style={{
                  marginLeft: 12,
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 7,
                  letterSpacing: 2,
                  color:
                    activeProvider === 'anthropic'
                      ? BRAND.cyan
                      : activeProvider === 'openai'
                        ? BRAND.green
                        : BRAND.amber,
                }}
              >
                VIA {activeProvider === 'anthropic' ? 'CLAUDE' : activeProvider === 'openai' ? 'GPT' : 'GEMINI'}
              </span>
            )}
          </p>
          {moleculeHash && (
            <p style={{ color: BRAND.dim, fontSize: 9, fontFamily: 'Space Mono, monospace' }}>
              {moleculeHash.slice(0, 16)}
            </p>
          )}
        </div>
        <div style={{ maxWidth: 480, width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {converseMessages.length === 0 && hasKey && (
            <p style={{ color: BRAND.muted, fontSize: 14, marginBottom: 16 }}>
              What brings you to the phosphorus?
            </p>
          )}
          {!hasKey && (
            <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: BRAND.muted, marginBottom: 6, fontFamily: 'Space Mono, monospace', letterSpacing: 2 }}>
                ENTER ANY AI KEY TO BEGIN
              </div>
              <input
                type="password"
                placeholder="sk-ant-... or sk-... or AI..."
                value={runtimeKey}
                onChange={(e) => setRuntimeKey(e.target.value)}
                style={{
                  background: '#0A0A1F',
                  border: '1px solid #1A1A3E',
                  color: BRAND.text,
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 11,
                  padding: '8px 14px',
                  borderRadius: 6,
                  width: '280px',
                  textAlign: 'center',
                }}
                aria-label="AI API key (optional)"
              />
              <select
                value={runtimeProvider}
                onChange={(e) => setRuntimeProvider(e.target.value as AIProvider)}
                style={{
                  background: '#0A0A1F',
                  border: '1px solid #1A1A3E',
                  color: BRAND.text,
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 10,
                  padding: '6px 10px',
                  borderRadius: 6,
                  marginTop: 6,
                }}
                aria-label="AI provider"
              >
                <option value="none">Auto-detect</option>
                <option value="deepseek">DeepSeek</option>
                <option value="anthropic">Claude (Anthropic)</option>
                <option value="openai">GPT (OpenAI)</option>
                <option value="gemini">Gemini (Google)</option>
              </select>
              <div style={{ fontSize: 8, color: BRAND.dim, marginTop: 4 }}>
                Your key stays in this browser. Never stored. Never transmitted except to the AI provider.
              </div>
            </div>
          )}
          <div style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}>
            {converseMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === 'user' ? 'right' : 'left',
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 8,
                  background: m.role === 'user' ? BRAND.surface2 : 'transparent',
                  borderLeft: m.role === 'assistant' ? `3px solid ${BRAND.cyan}` : undefined,
                }}
              >
                {m.content}
              </div>
            ))}
          </div>
          {error && (
            <p style={{ color: BRAND.magenta, fontSize: 12, marginBottom: 8 }}>{error}</p>
          )}
          {!hasKey && converseMessages.length === 0 && (
            <p style={{ color: BRAND.dim, fontSize: 11, marginBottom: 8 }}>
              Set any AI key to begin: VITE_DEEPSEEK_KEY, VITE_ANTHROPIC_KEY, VITE_OPENAI_KEY, or VITE_GEMINI_KEY. Or paste above.
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              Tone.start();
              stopSpeaking();
              const t = converseInput.trim();
              if (t && !inputDisabled) {
                setConverseInput('');
                converse(t);
              }
            }}
            style={{ display: 'flex', gap: 8, alignItems: 'center' }}
          >
            {canListen && (
              <button
                type="button"
                disabled={inputDisabled}
                onClick={() => {
                  if (listening) {
                    stopListening();
                    setListening(false);
                    const text = interimText.trim();
                    setInterimText('');
                    if (text) {
                      converse(text);
                    }
                    return;
                  }
                  Tone.start();
                  stopSpeaking();
                  setInterimText('');
                  const started = startListening({
                    onInterim: (text) => setInterimText(text),
                    onFinal: (result) => {
                      setInterimText(result.transcript);
                    },
                    onEnd: () => {
                      setListening(false);
                    },
                    onError: () => {
                      setListening(false);
                      setInterimText('');
                    },
                  });
                  if (started) setListening(true);
                }}
                style={{
                  padding: '10px 14px',
                  background: listening ? BRAND.magenta : BRAND.surface3,
                  color: listening ? '#fff' : BRAND.text,
                  border: listening ? `2px solid ${BRAND.magenta}` : `1px solid ${BRAND.dim}`,
                  borderRadius: 8,
                  fontSize: 18,
                  cursor: inputDisabled ? 'not-allowed' : 'pointer',
                  animation: listening ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                aria-label={listening ? 'Stop listening' : 'Speak to the phosphorus'}
                title={listening ? 'Listening... click to stop' : 'Voice input'}
              >
                {listening ? '⏹' : '🎤'}
              </button>
            )}
            <input
              type="text"
              value={listening ? (interimText || 'Listening...') : converseInput}
              onChange={(e) => { if (!listening) setConverseInput(e.target.value); }}
              placeholder={listening ? 'Listening...' : 'Type or speak...'}
              disabled={inputDisabled || listening}
              aria-label="Message to the phosphorus"
              style={{
                flex: 1,
                padding: 12,
                background: BRAND.surface2,
                border: `1px solid ${listening ? BRAND.magenta : BRAND.dim}`,
                borderRadius: 8,
                color: listening ? BRAND.magenta : BRAND.text,
                fontFamily: 'Space Mono, monospace',
                fontSize: 14,
                transition: 'border-color 0.2s ease',
              }}
            />
            <button
              type="submit"
              disabled={inputDisabled || !converseInput.trim() || !hasKey || listening}
              style={{
                padding: '12px 20px',
                background: BRAND.green,
                color: BRAND.void,
                border: 'none',
                borderRadius: 8,
                fontFamily: 'Oxanium, sans-serif',
                fontWeight: 600,
                cursor: inputDisabled ? 'not-allowed' : 'pointer',
                flexShrink: 0,
              }}
            >
              {converseLoading || playing ? '…' : 'Send'}
            </button>
          </form>
        </div>
        <p style={{ color: BRAND.dim, fontSize: 11, marginTop: 24 }}>{FOOTER_TEXT}</p>
      </div>
    );
  }

  if (phase === 'covenant') {
    const current = DELTA_COVENANT[covenantIndex];
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Oxanium, sans-serif',
          color: BRAND.text,
        }}
      >
        <PosnerViz coherence={coherence} />
        <button
          type="button"
          onClick={acceptCovenant}
          style={{
            marginTop: 32,
            maxWidth: 420,
            padding: 24,
            background: BRAND.surface2,
            border: `1px solid ${BRAND.cyan}`,
            borderRadius: 12,
            color: BRAND.text,
            fontSize: 18,
            cursor: 'pointer',
            textAlign: 'center',
          }}
          aria-label={`Accept value ${covenantIndex + 1} of 5: ${current.text}`}
        >
          <span style={{ color: BRAND.green, fontSize: 24, display: 'block', marginBottom: 8 }}>
            {current.symbol}
          </span>
          {current.text}
        </button>
        <p style={{ color: BRAND.dim, fontSize: 12, marginTop: 16 }}>
          Tap to accept. {covenantIndex + 1} of 5.
        </p>
        <p style={{ color: BRAND.dim, fontSize: 11, marginTop: 32 }}>{FOOTER_TEXT}</p>
      </div>
    );
  }

  if (phase === 'forming') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Oxanium, sans-serif',
          color: BRAND.muted,
        }}
      >
        <PosnerViz coherence={coherence} forming />
        <p style={{ marginTop: 24, fontSize: 16 }}>Forming your molecule…</p>
        <p style={{ color: BRAND.dim, fontSize: 11, marginTop: 32 }}>{FOOTER_TEXT}</p>
      </div>
    );
  }

  if (phase === 'born') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'Oxanium, sans-serif',
          color: BRAND.text,
        }}
      >
        <p style={{ color: BRAND.green, fontSize: 14, letterSpacing: 4, marginBottom: 8 }}>
          YOUR FINGERPRINT
        </p>
        <p
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 18,
            letterSpacing: 2,
            color: BRAND.cyan,
            marginBottom: 24,
          }}
          aria-label={`Fingerprint: ${fingerprint.slice(0, 16)}...`}
        >
          {fingerprint.slice(0, 24)}…
        </p>
        <div style={{ width: '100%', maxWidth: 360, marginBottom: 24 }}>
          <label style={{ display: 'block', color: BRAND.muted, fontSize: 12, marginBottom: 4 }}>
            Dome name
          </label>
          <input
            type="text"
            value={domeName}
            onChange={(e) => setDomeName(e.target.value)}
            placeholder="My Dome"
            style={{
              width: '100%',
              padding: 12,
              background: BRAND.surface2,
              border: `1px solid ${BRAND.dim}`,
              borderRadius: 8,
              color: BRAND.text,
              fontFamily: 'Space Mono, monospace',
            }}
          />
          <label style={{ display: 'block', color: BRAND.muted, fontSize: 12, marginBottom: 4, marginTop: 12 }}>
            Color (hex)
          </label>
          <input
            type="text"
            value={domeColor}
            onChange={(e) => setDomeColor(e.target.value)}
            aria-label="Dome color as hex code"
            placeholder="#00FF88"
            style={{
              width: '100%',
              padding: 12,
              background: BRAND.surface2,
              border: `1px solid ${BRAND.dim}`,
              borderRadius: 8,
              color: BRAND.text,
            }}
          />
          <label style={{ display: 'block', color: BRAND.muted, fontSize: 12, marginBottom: 4, marginTop: 12 }}>
            Intent
          </label>
          <input
            type="text"
            value={domeIntent}
            onChange={(e) => setDomeIntent(e.target.value)}
            placeholder="To hold."
            style={{
              width: '100%',
              padding: 12,
              background: BRAND.surface2,
              border: `1px solid ${BRAND.dim}`,
              borderRadius: 8,
              color: BRAND.text,
              fontFamily: 'Space Mono, monospace',
            }}
          />
        </div>
        <button
          type="button"
          onClick={async () => {
            if (molecule && storage) {
              const updated = { ...molecule, dome: { name: domeName || 'My Dome', color: domeColor, intent: domeIntent || 'To hold.' } };
              await storage.set(STORAGE_KEYS.molecule, JSON.stringify(updated));
              await storage.set(STORAGE_KEYS.dome(molecule.fingerprint), JSON.stringify(updated.dome));
              setMolecule(updated);
            }
            await enterMesh();
          }}
          style={{
            padding: '14px 28px',
            background: BRAND.green,
            color: BRAND.void,
            border: 'none',
            borderRadius: 8,
            fontFamily: 'Oxanium, sans-serif',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ENTER THE MESH
        </button>
        <p style={{ color: BRAND.dim, fontSize: 11, marginTop: 32 }}>{FOOTER_TEXT}</p>
      </div>
    );
  }

  if (phase === 'returning') {
    const hasResonance = molecule?.resonanceHistory && molecule.resonanceHistory.length > 0;
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Oxanium, sans-serif',
          color: BRAND.text,
        }}
      >
        <PosnerViz coherence={molecule?.coherence ?? 0.85} />
        <p style={{ color: BRAND.green, fontSize: 18, marginTop: 24, letterSpacing: 2 }}>
          {hasResonance ? 'Your resonance remembered.' : 'MOLECULE RECOGNIZED'}
        </p>
        <p style={{ color: BRAND.muted, fontSize: 14, marginTop: 8 }}>
          {molecule?.dome?.name ?? 'Your dome'}
        </p>
        <button
          type="button"
          onClick={() => enterMesh()}
          style={{
            marginTop: 32,
            padding: '14px 28px',
            background: BRAND.green,
            color: BRAND.void,
            border: 'none',
            borderRadius: 8,
            fontFamily: 'Oxanium, sans-serif',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ENTER THE MESH
        </button>
        <p style={{ color: BRAND.dim, fontSize: 11, marginTop: 32 }}>{FOOTER_TEXT}</p>
      </div>
    );
  }

  // MESH (fallback when still on / after enterMesh — router will show /mesh view)
  return (
    <div
      style={{
        minHeight: '100vh',
        background: BRAND.void,
        padding: 24,
        fontFamily: 'Oxanium, sans-serif',
        color: BRAND.text,
      }}
    >
      <h1 style={{ fontSize: 14, letterSpacing: 4, color: BRAND.muted, marginBottom: 24 }}>
        THE MESH
      </h1>
      {gameMode?.uiMode === 'rest' && (
        <p style={{ border: `1px solid ${BRAND.magenta}`, padding: 12, borderRadius: 8, marginBottom: 16 }}>
          The phosphorus is resting. {gameMode.message}
        </p>
      )}
      {gameMode?.uiMode === 'simplified' && (
        <p style={{ border: `1px solid ${BRAND.amber}`, padding: 12, borderRadius: 8, marginBottom: 16 }}>
          YELLOW · BUILD MODE AVAILABLE · CHALLENGES PAUSED
        </p>
      )}
      {walletBalance && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ color: BRAND.amber }}>{walletBalance.totalEarned} LOVE</span>
          <span style={{ color: BRAND.green }}>SOVEREIGN {walletBalance.sovereigntyPool}</span>
          <span style={{ color: BRAND.cyan }}>PERFORM {walletBalance.performancePool}</span>
        </div>
      )}
      <p style={{ color: BRAND.dim, marginBottom: 24 }}>
        You are in the mesh. Use the navigation to explore.
      </p>
      <p style={{ color: BRAND.dim, fontSize: 11 }}>{FOOTER_TEXT}</p>
    </div>
  );
}
