"use server";

import { prisma } from "@/lib/prisma";

export async function getRevenueReport() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [monthTotal, dayTotal, topServices, unpaidInvoices, hmoStats] = await Promise.all([
    prisma.billing.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: { in: ["PAID", "PARTIAL"] } },
      _sum: { amountPaid: true }
    }),
    prisma.billing.aggregate({
      where: { createdAt: { gte: startOfDay }, status: { in: ["PAID", "PARTIAL"] } },
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
    }),
    prisma.billing.aggregate({
      where: { hmoProvider: { not: null } },
      _count: { id: true },
      _sum: { hmoCoverage: true }
    })
  ]);

  return {
    monthTotal: monthTotal._sum.amountPaid || 0,
    dayTotal: dayTotal._sum.amountPaid || 0,
    topServices,
    unpaidInvoices,
    hmoStats: {
      count: hmoStats._count.id || 0,
      total: hmoStats._sum.hmoCoverage || 0
    }
  };
}
