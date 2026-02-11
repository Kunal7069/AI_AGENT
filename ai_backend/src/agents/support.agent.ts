import { getConversationHistory } from "../tools/conversation.tools";

export const supportAgent = async (message: string, conversationId: string) => {
  const history = await getConversationHistory(conversationId);
  console.log("Support Agent History:", history);
  return [
    {
      role: "system",
      content: `
You are a helpful customer support agent.
Your job is to answer general questions, FAQs, and troubleshooting issues.
Be polite, clear, and concise.
If the question is related to orders or billing, politely say you will connect them to the right department.
      `.trim(),
    },

    // Previous conversation context
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),

    // Current user message
    {
      role: "user",
      content: message,
    },
  ];
};
