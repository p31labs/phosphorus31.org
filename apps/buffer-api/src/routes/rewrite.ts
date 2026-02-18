import { Hono } from "hono";
import { validateRewrite, type RewritePayload } from "../middleware/validate";
import { callGemini } from "../services/gemini";

type Bindings = { GEMINI_API_KEY: string };

const rewrite = new Hono<{ Bindings: Bindings }>();

rewrite.post("/rewrite", validateRewrite(), async (c) => {
  const payload = c.get("validated") as RewritePayload;

  const apiKey = c.env.GEMINI_API_KEY;
  if (!apiKey) {
    return c.json({ error: "GEMINI_API_KEY not configured" }, 500);
  }

  try {
    const result = await callGemini(payload, apiKey);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: "Rewrite failed", detail: message }, 502);
  }
});

export default rewrite;
