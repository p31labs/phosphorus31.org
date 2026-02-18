import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimit } from "./middleware/rate-limit";
import health from "./routes/health";
import rewrite from "./routes/rewrite";

type Bindings = { GEMINI_API_KEY: string; ENVIRONMENT: string };

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors({
  origin: ["http://localhost:5173", "https://phosphorus31.org", "https://p31.io"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"],
}));

app.use("*", rateLimit());

app.route("/", health);
app.route("/", rewrite);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(`[buffer-api] ${err.message}`);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
