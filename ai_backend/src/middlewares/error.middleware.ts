export const errorMiddleware = async (c, next) => {
  try {
    await next();
  } catch (err) {
    return c.json({ success: false, message: err.message }, 500);
  }
};
