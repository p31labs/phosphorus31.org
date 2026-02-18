import { z } from "zod";
import type { Context, Next } from "hono";

export const RewriteInput = z.object({
  text: z.string().min(1).max(10_000),
  score: z.object({
    urgency: z.number(),
    emotional: z.number(),
    cognitive: z.number(),
    voltage: z.number(),
    gate: z.string(),
  }),
  temperature: z.number().min(0.1).max(1.0).default(0.7),
});

export type RewritePayload = z.infer<typeof RewriteInput>;

export function validateRewrite() {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const parsed = RewriteInput.parse(body);
      c.set("validated", parsed);
      await next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return c.json({ error: "Validation failed", details: err.issues }, 400);
      }
      return c.json({ error: "Invalid JSON body" }, 400);
    }
  };
}
