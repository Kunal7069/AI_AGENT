import { orderAgent } from "./order.agent";
import { supportAgent } from "./support.agent";

import { detectIntent } from "./intent.agent";
import { getLastIntent, setLastIntent } from "../state/intent.store";
import {
  getOrderDetailsByUser,
  getOrderStatusByUser,
} from "../tools/order.tools";
import { getOrderContext, setOrderContext } from "../state/order-tool.store";

import { billingAgent } from "./billing.agent";
import {
  getInvoiceDetailsByUser,
  getRefundStatusByUser,
} from "../tools/billing.tools";
import {
  getBillingContext,
  setBillingContext,
} from "../state/billing-context.store";

export const routerAgent = async (message: string, conversationId: string) => {
  let intent = await detectIntent(message);

  console.log("Detected intent:", intent);

  if (intent === "none") {
    let lastIntent = getLastIntent(conversationId);
    if (lastIntent) {
      intent = lastIntent;
    } else {
      intent = "support";
    }
  } else {
    // Save new intent in memory
    setLastIntent(conversationId, intent);
  }

  let result = null;
  switch (intent) {
    case "order":
      const orderResult = await orderAgent(message, conversationId);

      const previousContext = getOrderContext(conversationId);

      // Resolve tool
      let toolToUse =
        orderResult.tool !== "none"
          ? orderResult.tool
          : previousContext?.tool || "getOrderDetails";

      // Resolve userId
      let userIdToUse =
        orderResult.userId !== null
          ? orderResult.userId
          : previousContext?.userId || null;

      // Save resolved context
      setOrderContext(conversationId, {
        tool: toolToUse,
        userId: userIdToUse,
      });

      if (!userIdToUse) {
        result = { message: "Give your user id to track order." };
      } else if (toolToUse == "getOrderDetails") {
        result = await getOrderDetailsByUser(userIdToUse);
      } else if (toolToUse == "getDeliveryStatus") {
        result = await getOrderStatusByUser(userIdToUse);
      }

      return result;

    case "support":
      result = await supportAgent(message, conversationId);
      return result;

    case "none":
      result = await supportAgent(message, conversationId);
      return result;

    case "billing": {
      const billingResult = await billingAgent(message, conversationId);

      const previousContext = getBillingContext(conversationId);

      // Resolve tool
      let toolToUse =
        billingResult.tool !== "none"
          ? billingResult.tool
          : previousContext?.tool || "getInvoiceDetails";

      // Resolve userId
      let userIdToUse =
        billingResult.userId !== null
          ? billingResult.userId
          : previousContext?.userId || null;

      // Save resolved context
      setBillingContext(conversationId, {
        tool: toolToUse,
        userId: userIdToUse,
      });

      let result;

      if (!userIdToUse) {
        result = {
          message: "Please provide your user ID for billing details.",
        };
      } else if (toolToUse === "getInvoiceDetails") {
        result = await getInvoiceDetailsByUser(userIdToUse);
      } else if (toolToUse === "getRefundStatus") {
        result = await getRefundStatusByUser(userIdToUse);
      }

      return result;
    }
  }
};
