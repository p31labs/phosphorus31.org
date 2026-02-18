import { Hono } from "hono";

const health = new Hono();

health.get("/health", (c) =>
  c.json({ status: "ok", version: "0.1.0", service: "p31-buffer-api" }),
);

export default health;
