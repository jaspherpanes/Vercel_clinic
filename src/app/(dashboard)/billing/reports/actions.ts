"use server";

import { prisma } from "@/lib/prisma";

export async function getRevenueReport() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [monthTotal, dayTotal, topServices, unpaidInvoices] = await Promise.all([
    prisma.billing.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: "PAID" },
      _sum: { amountPaid: true }
    }),
    prisma.billing.aggregate({
      where: { createdAt: { gte: startOfDay }, status: "PAID" },
      _sum: { amountPaid: true }
    }),
    prisma.billingItem.groupBy({
      by: ['description'],
      _count: { id: true },
      _sum: { subtotal: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    }),
    prisma.billing.findMany({
      where: { status: { in: ["UNPAID", "PARTIAL"] } },
      include: { patient: true },
      orderBy: { balance: "desc" },
      take: 10
    })
  ]);

  return {
    monthTotal: monthTotal._sum.amountPaid || 0,
    dayTotal: dayTotal._sum.amountPaid || 0,
    topServices,
    unpaidInvoices
  };
}
