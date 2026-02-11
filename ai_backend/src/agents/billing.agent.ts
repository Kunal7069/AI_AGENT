import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export type BillingTool = "getInvoiceDetails" | "getRefundStatus" | "none";

export interface BillingAgentResult {
  tool: BillingTool;
  userId: string | null;
}

export const billingAgent = async (
  message: string,
  conversationId: string,
): Promise<BillingAgentResult> => {
  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are a billing intent and parameter extraction agent.

Your job:
- Decide which billing tool to use
- Extract userId if explicitly mentioned

Available tools:
- getInvoiceDetails → for invoice amount, payment, or invoice info
- getRefundStatus → for refund-related questions
- none → if unclear

Rules:
- If userId is not present, return null
- Respond ONLY with valid JSON
- No explanation, no markdown

JSON format:
{
  "tool": "<getInvoiceDetails | getRefundStatus | none>",
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
