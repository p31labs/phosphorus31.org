/**
 * Buffer API — Cloudflare Workers entry point
 *
 * Stub: Hono.js router with /rewrite and /health endpoints.
 * Privacy: messages processed in-memory only, NEVER logged or persisted.
 */
import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok", service: "buffer-api", version: "0.1.0" }));

app.post("/rewrite", async (c) => {
  return c.json({ error: "Not yet implemented" }, 501);
});

export default app;
