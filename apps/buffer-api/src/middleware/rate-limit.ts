import type { Context, Next } from "hono";

const windowMs = 60_000;
const maxRequests = 60;

const hits = new Map<string, { count: number; resetAt: number }>();

function cleanup() {
  const now = Date.now();
  for (const [key, val] of hits) {
    if (now > val.resetAt) hits.delete(key);
  }
}

export function rateLimit() {
  return async (c: Context, next: Next) => {
    const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
    const now = Date.now();

    cleanup();

    const record = hits.get(ip);
    if (!record || now > record.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
    } else {
      record.count++;
      if (record.count > maxRequests) {
        c.header("Retry-After", String(Math.ceil((record.resetAt - now) / 1000)));
        return c.json({ error: "Rate limit exceeded. 60 requests per minute." }, 429);
      }
    }

    await next();
  };
}
