import type { Intent } from "../agents/intent.agent";

// conversationId -> lastIntent
const intentStore = new Map<string, Intent>();

export function getLastIntent(conversationId: string): Intent | null {
  return intentStore.get(conversationId) || null;
}

export function setLastIntent(conversationId: string, intent: Intent) {
  intentStore.set(conversationId, intent);
}
