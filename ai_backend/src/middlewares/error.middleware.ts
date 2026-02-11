import { Context, Next } from "hono";

// export const errorMiddleware = async (c, next) => {
export const errorMiddleware = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
  const message = err instanceof Error ? err.message : "Unknown error";
  return c.json({ success: false, message }, 500);
}
};
