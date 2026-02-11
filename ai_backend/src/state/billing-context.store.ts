import type { BillingTool } from "../agents/billing.agent";

export interface BillingContext {
  tool: BillingTool;
  userId: string | null;
}

const billingContextStore = new Map<string, BillingContext>();

export const getBillingContext = (conversationId: string) => {
  return billingContextStore.get(conversationId) || null;
};

export const setBillingContext = (
  conversationId: string,
  context: BillingContext,
) => {
  billingContextStore.set(conversationId, context);
};
