import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export type OrderTool = "getOrderDetails" | "getDeliveryStatus" | "none";

export interface OrderAgentResult {
  tool: OrderTool;
  userId: string | null;
}

export const orderAgent = async (
  message: string,
  conversationId: string,
): Promise<OrderAgentResult> => {
  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are an order intent and parameter extraction agent.

Your job:
- Decide which tool to use
- Extract userId if explicitly mentioned

Available tools:
- getOrderDetails → for questions about order info
- getDeliveryStatus → for tracking or delivery questions
- none → if unclear

Rules:
- If userId is not present, return null
- Respond ONLY with valid JSON
- No explanation, no markdown

JSON format:
{
  "tool": "<getOrderDetails | getDeliveryStatus | none>",
  "userId": "<string | null>"
}
        `.trim(),
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  try {
    const parsed = JSON.parse(result.text);

    return {
      tool: parsed.tool ?? "none",
      userId: parsed.userId ?? null,
    };
  } catch {
    return {
      tool: "none",
      userId: null,
    };
  }
};
