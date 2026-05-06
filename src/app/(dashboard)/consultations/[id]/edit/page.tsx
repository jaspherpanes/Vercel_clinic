import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EnhancedConsultationForm } from "@/components/consultations/EnhancedConsultationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [consultation, doctors] = await Promise.all([
    prisma.consultation.findUnique({
      where: { id },
      include: { patient: true },
    }),
    prisma.doctor.findMany({ select: { id: true, firstName: true, lastName: true } })
  ]);

  if (!consultation) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/consultations/${id}`} className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Consultation
          </h2>
          <p className="mt-1 text-sm text-slate-500">Updating record for {consultation.patient.firstName} {consultation.patient.lastName}.</p>
        </div>
      </div>

      <EnhancedConsultationForm 
        patient={consultation.patient} 
        doctors={doctors} 
        consultation={consultation} 
      />
    </div>
  );
}
