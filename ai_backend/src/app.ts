import { Hono } from "hono";
import { chatRoutes } from "./routes/chat.routes";
// import { agentRoutes } from "./routes/agents.routes";
import { healthRoutes } from "./routes/health.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.route("/api/chat", chatRoutes);
// app.route("/api/agents", agentRoutes);
app.route("/api/health", healthRoutes);

export default app;
