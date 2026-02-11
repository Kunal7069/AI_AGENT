import { prisma } from "../db/prisma";

/**
 * Get full invoice details for a user
 */
export const getInvoiceDetailsByUser = async (userId: string) => {
  console.log("Fetching invoice details for user:", userId);

  const invoice = await prisma.invoice.findFirst({
    where: { userId },
    select: {
      id: true,
      userId: true,
      amount: true,
      status: true,
      refundStatus: true,
    },
  });

  if (!invoice) return null;

  return {
    ...invoice,
  };
};

/**
 * Get only refund status for a user
 */
export const getRefundStatusByUser = async (userId: string) => {
  console.log("Fetching refund status for user:", userId);

  return prisma.invoice.findFirst({
    where: { userId },
    select: {
      id: true,
      refundStatus: true,
    },
  });
};
