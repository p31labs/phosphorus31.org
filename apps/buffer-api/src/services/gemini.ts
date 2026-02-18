import type { RewritePayload } from "../middleware/validate";

export interface RewriteResult {
  neutral_rewrite: string;
  emotional_subtext: string;
  action_items: string[];
  suggested_response: string;
}

export async function callGemini(
  payload: RewritePayload,
  apiKey: string,
): Promise<RewriteResult> {
  const systemPrompt = `You are The Buffer — a communication bridge for neurodivergent users.
Rewrite the following message in neutral, clear, actionable language.
Remove passive aggression. Extract the core request. Use active voice, present tense. Be direct.
VOLTAGE: ${payload.score.voltage}/10 (U:${payload.score.urgency} E:${payload.score.emotional} C:${payload.score.cognitive}) GATE: ${payload.score.gate}
Respond ONLY in JSON (no markdown, no backticks):
{"neutral_rewrite":"...","emotional_subtext":"...","action_items":["..."],"suggested_response":"..."}`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nMESSAGE:\n${payload.text}` }] }],
        generationConfig: {
          temperature: payload.temperature,
          maxOutputTokens: 1000,
        },
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data: { candidates?: { content?: { parts?: { text?: string }[] } }[] } = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned) as RewriteResult;
}
