import { prisma } from "../db/prisma";

/**
 * Get full order details for a user
 */
export const getOrderDetailsByUser = async (userId: string) => {
  console.log("Fetching order details for user:", userId);

  const order = await prisma.order.findFirst({
    where: { userId },
    select: {
      id: true,
      userId: true,
      status: true,
      tracking: true,
      items: true,
    },
  });

  if (!order) return null;

  // Add extra computed / mock data
  return {
    ...order,
  };
};

/**
 * Get only delivery / order status for a user
 */
export const getOrderStatusByUser = async (userId: string) => {
  console.log("Fetching order status for user:", userId);
  return prisma.order.findFirst({
    where: { userId },
    select: {
      status: true,
      // tracking: true,
    },
  });
};
