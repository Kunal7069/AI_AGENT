import { Context } from "hono";
import { chatService } from "../services/chat.service";
import { prisma } from "../db/prisma";

export const sendMessage = async (c: Context) => {
  const body = await c.req.json();
  return chatService.handleMessage(c, body);
};

export const getAllConversations = async (c: Context) => {
  const conversations = await prisma.conversation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return c.json(conversations);
};

export const getConversationById = async (c: Context) => {
  const id = c.req.param("id");

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return c.json({ message: "Conversation not found" }, 404);
  }

  return c.json(conversation);
};

export const deleteConversation = async (c: Context) => {
  const id = c.req.param("id");

  // Check existence
  const conversation = await prisma.conversation.findUnique({
    where: { id },
  });

  if (!conversation) {
    return c.json({ message: "Conversation not found" }, 404);
  }

  // Delete messages first (safe)
  await prisma.message.deleteMany({
    where: { conversationId: id },
  });

  // Delete conversation
  await prisma.conversation.delete({
    where: { id },
  });

  return c.json({ message: "Conversation deleted successfully" });
};
