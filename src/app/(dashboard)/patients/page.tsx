import { prisma } from "@/lib/prisma";
import { PatientManager } from "@/components/patients/PatientManager";
import { Suspense } from "react";

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { lastName: "asc" },
  });

  return (
    <Suspense fallback={<div>Loading patients...</div>}>
      <PatientManager patients={patients} />
    </Suspense>
  );
}
