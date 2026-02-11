import { prisma } from "../db/prisma";

export const getConversationHistory = async (
  conversationId: string,
  limit = 10,
) => {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      role: true,
      content: true,
    },
  });
};
