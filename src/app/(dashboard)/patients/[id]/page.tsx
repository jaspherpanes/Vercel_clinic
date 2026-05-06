import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PatientProfileView } from "@/components/patients/PatientProfileView";

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      consultations: {
        include: { doctor: true },
        orderBy: { date: "desc" }
      },
      billings: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!patient) notFound();

  return <PatientProfileView patient={patient} />;
}
