import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export type Intent = "order" | "billing" | "support" | "none";

export async function detectIntent(message: string): Promise<Intent> {
  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are an intent classification engine.

Your task:
- Read the user message
- Decide the intent

Allowed intents:
- order
- billing
- support
- none

Rules:
- Respond ONLY with valid JSON
- No explanations
- No markdown
- No extra text

JSON format:
{ "intent": "<one_of_the_allowed_values>" }
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
    return parsed.intent as Intent;
  } catch {
    return "none";
  }
}
