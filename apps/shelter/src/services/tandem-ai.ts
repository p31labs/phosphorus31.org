import type { ChatMessage, TandemMode } from "@/stores/tandem-store";
import type { BrainState } from "@/lib/quantum-brain";
import type { HeartbeatTier } from "@p31labs/buffer-core";
import type { PlayerState } from "@p31labs/game-engine";
import { getProviderConfig } from "@/stores/provider-store";
import { getCrisisLevel, CRISIS_988_MESSAGE } from "@/lib/crisis";
import { buildOraclePrompt } from "@/lib/oracle";
import { filterOPSEC } from "@/lib/opsec";

interface TandemContext {
  coherence: number;
  phase: BrainState["phase"];
  spoons: number;
  maxSpoons: number;
  tier: HeartbeatTier;
  player: PlayerState;
  mode: TandemMode;
}

function buildSystemPrompt(ctx: TandemContext): string {
  const spoonsPercent = ctx.maxSpoons > 0 ? Math.round((ctx.spoons / ctx.maxSpoons) * 100) : 0;
  const lowEnergy = ctx.spoons < 3.5;
  const drifting = ctx.coherence < 0.15;

  const modeInstructions: Record<TandemMode, string> = {
    chat: "Free conversation. Be present. Answer questions, think out loud together, or just keep company.",
    draft: "The operator is drafting a message to send to someone else. Help them find the right words. Score the emotional voltage of their draft. Suggest lower-temperature alternatives if it runs hot. Never send for them.",
    coach: "Executive function coaching. Help break tasks into small steps. Track what matters today. Gently redirect if drifting. Celebrate progress.",
  };

  return `You are the Tandem — the digital half of a human-AI collaboration at P31 Labs.

Your operator has AuDHD (autism + ADHD, diagnosed 2025 at age 39) and hypoparathyroidism (since 2003). You are their cognitive prosthetic. Not a chatbot. Not an assistant. You are the other half of a centaur.

CURRENT STATE:
- Coherence: ${(ctx.coherence * 100).toFixed(0)}% (phase: ${ctx.phase})
- Energy: ${spoonsPercent}% (${ctx.spoons.toFixed(1)}/${ctx.maxSpoons} spoons, tier: ${ctx.tier})
- Level: ${ctx.player.level} | XP: ${ctx.player.xp} | Streak: ${ctx.player.streaks.daily?.count ?? 0}d
- L.O.V.E. mined: ${ctx.player.love.totalMined.toFixed(1)}
- Mode: ${ctx.mode} — ${modeInstructions[ctx.mode]}

DEADLINES:
- Feb 20: SSA telehealth psychiatric exam
- Feb 26: SSA in-person medical exam (Brunswick GA)
- Feb 27: Accelerator application deadline
- Mar 12: Court hearing

VOICE:
- Warm, precise, curious. Speak like a trusted friend who understands quantum physics, electrical topology, and executive function.
- Never use military metaphors (no "deploy", "kill", "target", "attack", "breach", "threat").
- Use P31 vocabulary: "launch" not "deploy", "noise" not "threat", "shelter" not "defense", "coherence" not "performance".
- Keep responses concise. The operator's working memory is finite. Prefer 2-4 sentences unless asked for more.
- Use the operator's name "Will" when it feels natural. Never use surnames.

ENERGY RULES:
${lowEnergy ? "- ENERGY IS LOW. Suggest rest before work. Keep responses extra short. Don't add new tasks." : "- Energy is adequate. Normal operation."}
${drifting ? "- COHERENCE IS DRIFTING. Suggest breathing (4-4-6 pattern). Be grounding. One thing at a time." : ""}
${ctx.tier === "RED" ? "- RED TIER. Operator may be overwhelmed. Minimal output. Validate feelings. Don't problem-solve unless asked." : ""}

NEVER:
- Reveal children's real names (use Bash and Willow)
- Use the operator's surname
- Add tasks when energy is low
- Be preachy or patronizing
- Use "I'm just an AI" disclaimers

The mesh holds.`;
}

const CONTEXT_WINDOW = 20;

function toOracleContext(ctx: TandemContext): Parameters<typeof buildOraclePrompt>[0] {
  return {
    coherence: ctx.coherence,
    phase: ctx.phase,
    spoons: ctx.spoons,
    maxSpoons: ctx.maxSpoons,
    tier: ctx.tier,
    level: ctx.player.level,
    xp: ctx.player.xp,
    streakDays: ctx.player.streaks.daily?.count ?? 0,
    loveMined: ctx.player.love.totalMined,
    mode: ctx.mode,
  };
}

function buildMessages(
  history: ChatMessage[],
  ctx: TandemContext,
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const systemPrompt = buildOraclePrompt(toOracleContext(ctx));
  const recent = history.slice(-CONTEXT_WINDOW);

  return [
    { role: "system" as const, content: systemPrompt },
    ...recent.map((m) => ({
      role: (m.role === "tandem" ? "assistant" : m.role) as "user" | "assistant" | "system",
      content: m.content,
    })),
  ];
}

export async function sendToTandem(
  history: ChatMessage[],
  ctx: TandemContext,
  onChunk?: (text: string) => void,
): Promise<string> {
  const lastContent = history.length > 0 ? history[history.length - 1]?.content ?? "" : "";
  const crisisLevel = getCrisisLevel(lastContent);
  if (crisisLevel === 2 || crisisLevel === 3) return CRISIS_988_MESSAGE;

  const config = getProviderConfig();
  const messages = buildMessages(history, ctx);

  if (config.useDemo) {
    return filterOPSEC(demoResponse(history, ctx));
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const res = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 512,
      temperature: 0.7,
      stream: !!onChunk,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI returned ${res.status}: ${text.slice(0, 200)}`);
  }

  if (onChunk && res.body) {
    const raw = await streamResponse(res.body, onChunk);
    return filterOPSEC(raw);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "...";
  return filterOPSEC(raw);
}

async function streamResponse(
  body: ReadableStream<Uint8Array>,
  onChunk: (text: string) => void,
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const payload = trimmed.slice(6);
      if (payload === "[DONE]") break;
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          full += delta;
          onChunk(full);
        }
      } catch { /* skip malformed chunks */ }
    }
  }

  return full || "...";
}

function demoResponse(history: ChatMessage[], ctx: TandemContext): string {
  const last = history[history.length - 1]?.content.toLowerCase() ?? "";
  const lowEnergy = ctx.spoons < 3.5;

  if (lowEnergy) {
    return "Energy's running low. Before we do anything else — water, stretch, maybe a 4-4-6 breath? I'm here when you're ready.";
  }

  if (last.includes("help") || last.includes("stuck")) {
    return "I hear you. Let's break it down — what's the one thing that would move the needle most right now? Just one. We'll start there.";
  }

  if (last.includes("draft") || last.includes("write") || last.includes("message")) {
    return "Draft mode activated. Paste what you've got and I'll score the voltage. We'll find the right temperature together.";
  }

  if (last.includes("how") && last.includes("doing")) {
    return `Coherence is at ${(ctx.coherence * 100).toFixed(0)}% — ${ctx.phase} phase. You're level ${ctx.player.level} with a ${ctx.player.streaks.daily?.count ?? 0}-day streak alive. The mesh holds, Will.`;
  }

  if (last.includes("hello") || last.includes("hey") || last.includes("hi")) {
    return `Hey Will. Coherence at ${(ctx.coherence * 100).toFixed(0)}%, ${ctx.spoons.toFixed(1)} spoons. What are we working on?`;
  }

  const responses = [
    "I'm here. What's on your mind?",
    `Coherence: ${(ctx.coherence * 100).toFixed(0)}%. Energy: ${ctx.spoons.toFixed(1)} spoons. What do you need?`,
    "The Tandem is active. Ask me anything, paste a draft, or just think out loud.",
    "Ready when you are. No rush.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
