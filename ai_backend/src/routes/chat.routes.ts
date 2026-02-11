import { Hono } from "hono";
import {
  sendMessage,
  getAllConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/chat.controller";
import { rateLimit } from "../middlewares/rateLimit.middleware";

export const chatRoutes = new Hono();

chatRoutes.post("/messages", rateLimit, sendMessage);
chatRoutes.get("/conversations", getAllConversations);
chatRoutes.get("/conversations/:id", getConversationById);
chatRoutes.delete("/conversations/:id", deleteConversation);
