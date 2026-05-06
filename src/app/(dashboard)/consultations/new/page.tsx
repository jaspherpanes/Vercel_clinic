import { prisma } from "@/lib/prisma";
import { EnhancedConsultationForm } from "@/components/consultations/EnhancedConsultationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function NewConsultationPage({ searchParams }: { searchParams: Promise<{ patientId?: string }> }) {
  const { patientId } = await searchParams;

  if (!patientId) {
    const patients = await prisma.patient.findMany({
      orderBy: { lastName: "asc" },
      select: { id: true, firstName: true, lastName: true, contactInfo: true }
    });

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900">New Consultation</h2>
          <p className="text-slate-500 font-medium">Select a patient to begin their medical encounter.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((p) => (
            <Link
              key={p.id}
              href={`/consultations/new?patientId=${p.id}`}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-black group-hover:bg-primary-600 group-hover:text-white transition-all">
                  {p.firstName[0]}{p.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{p.firstName} {p.lastName}</h3>
                  <p className="text-xs text-slate-400 font-medium">{p.contactInfo || "No contact info"}</p>
                </div>
              </div>
            </Link>
          ))}
          {patients.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <p>No patients found. Please register a patient first.</p>
              <Link href="/patients" className="text-primary-600 font-bold hover:underline mt-2 inline-block">Go to Patients</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  const [patient, doctors] = await Promise.all([
    prisma.patient.findUnique({ 
      where: { id: patientId },
      select: { id: true, firstName: true, lastName: true, dateOfBirth: true, gender: true } 
    }),
    prisma.doctor.findMany({ select: { id: true, firstName: true, lastName: true } })
  ]);

  if (!patient) {
    redirect("/patients");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/patients/${patientId}`} className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Consultation Form
          </h2>
          <p className="mt-1 text-sm text-slate-500">Document medical encounter for {patient.firstName} {patient.lastName}.</p>
        </div>
      </div>

      <EnhancedConsultationForm patient={patient} doctors={doctors} />
    </div>
  );
}
