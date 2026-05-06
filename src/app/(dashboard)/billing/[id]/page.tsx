import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InvoiceView } from "@/components/billing/InvoiceView";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.billing.findUnique({
    where: { id },
    include: {
      patient: true,
      items: true
    }
  });

  if (!invoice) notFound();

  return <InvoiceView invoice={invoice} />;
}
