import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "@/components/billing/InvoiceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewInvoicePage() {
  const [patients, consultations] = await Promise.all([
    prisma.patient.findMany({
      select: { id: true, firstName: true, lastName: true, address: true }
    }),
    prisma.consultation.findMany({
      where: { status: "COMPLETED" },
      select: { id: true, patientId: true, diagnosis: true, date: true }
    })
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/billing" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Generate Invoice</h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">Create a new medical bill and official receipt.</p>
        </div>
      </div>

      <InvoiceForm patients={patients} consultations={consultations} />
    </div>
  );
}
