import { prisma } from "@/lib/prisma";
import { PrescriptionForm } from "@/components/prescriptions/PrescriptionForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewPrescriptionPage() {
  const [patients, doctors] = await Promise.all([
    prisma.patient.findMany(),
    prisma.doctor.findMany()
  ]);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8 flex items-center gap-4 print:hidden">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Generate Prescription
          </h2>
          <p className="mt-1 text-sm text-slate-500">Create and print medical prescriptions.</p>
        </div>
      </div>

      <PrescriptionForm patients={patients} doctors={doctors} />
    </div>
  );
}
