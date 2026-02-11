import type { OrderTool } from "../agents/order.agent";

export interface OrderContext {
  tool: OrderTool;
  userId: string | null;
}

// conversationId -> order context
const orderContextStore = new Map<string, OrderContext>();

export function getOrderContext(conversationId: string): OrderContext | null {
  return orderContextStore.get(conversationId) || null;
}

export function setOrderContext(conversationId: string, context: OrderContext) {
  orderContextStore.set(conversationId, context);
}
