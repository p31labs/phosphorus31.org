import type { VoltageScore } from "@p31labs/buffer-core";
import type { AIRewriteResult } from "@/types";

export async function rewriteMessage(
  text: string,
  score: VoltageScore,
  temperature: number,
): Promise<AIRewriteResult | null> {
  try {
    const endpoint = import.meta.env.VITE_API_URL || "https://p31-buffer-api.trimtab-signal.workers.dev";
    const res = await fetch(`${endpoint}/rewrite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, score, temperature }),
    });

    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}
