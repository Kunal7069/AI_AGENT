import type { Context, Next } from "hono";

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export const rateLimit = async (c: Context, next: Next) => {
  // Prefer userId, fallback to IP
  const body =
    c.req.method === "POST" ? await c.req.json().catch(() => null) : null;

  const identifier =
    body?.userId ||
    c.req.header("x-forwarded-for") ||
    c.req.raw?.socket?.remoteAddress ||
    "anonymous";

  const now = Date.now();

  const entry = rateLimitStore.get(identifier);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      windowStart: now,
    });
  } else {
    if (entry.count >= MAX_REQUESTS) {
      return c.json(
        {
          message: "Too many requests. Please try again later.",
        },
        429,
      );
    }

    entry.count += 1;
    rateLimitStore.set(identifier, entry);
  }

  await next();
};
