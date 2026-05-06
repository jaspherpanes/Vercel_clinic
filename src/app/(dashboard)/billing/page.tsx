import { prisma } from "@/lib/prisma";
import { BillingDashboard } from "@/components/billing/BillingDashboard";

export default async function BillingPage() {
  const [invoices, billingStats] = await Promise.all([
    prisma.billing.findMany({
      include: { patient: true },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.billing.aggregate({
      _sum: { totalAmount: true, amountPaid: true, balance: true },
      _count: { id: true }
    })
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCollection = await prisma.billing.aggregate({
    where: { createdAt: { gte: today } },
    _sum: { amountPaid: true }
  });

  const stats = {
    totalRevenue: billingStats._sum.amountPaid || 0,
    pendingPayments: billingStats._sum.balance || 0,
    paidInvoices: await prisma.billing.count({ where: { status: "PAID" } }),
    todayCollection: todayCollection._sum.amountPaid || 0
  };

  return <BillingDashboard stats={stats} recentInvoices={invoices} />;
}
