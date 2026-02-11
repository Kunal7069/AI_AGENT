import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { routerAgent } from "../agents/router.agent";
import { prisma } from "../db/prisma";
import type { Context } from "hono";

export const chatService = {
  async handleMessage(
    c: Context,
    {
      message,
      conversationId,
      userId,
    }: {
      message: string;
      conversationId: string;
      userId: string;
    },
  ) {
    // 1. Save user message
    await prisma.message.create({
      data: {
        conversationId,
        role: "user",
        content: message,
      },
    });

    // 2. Route to agent
    const agentMessages = await routerAgent(message, conversationId);
    console.log("Agent Messages:", agentMessages);

    // 3. Stream response using Groq
    const messages = [
      {
        role: "system" as const,
        content: `
You are a customer support assistant.
Convert structured backend data into a short, polite, user-friendly reply.
Do not mention tools, JSON, or internal logic.
        `,
      },
      {
        role: "user" as const,
        content: `
Here is the data:
${JSON.stringify(agentMessages, null, 2)}
        `,
      },
    ];

    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages,
      onFinish: async ({ text }) => {
        // Save assistant message AFTER stream finishes
        await prisma.message.create({
          data: {
            conversationId,
            role: "assistant",
            content: text,
          },
        });
      },
    });

    return result.toTextStreamResponse();
  },
};
