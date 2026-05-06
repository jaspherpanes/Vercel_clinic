import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PrescriptionView } from "@/components/prescriptions/PrescriptionView";

export default async function PrescriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });

  if (!prescription) notFound();

  return <PrescriptionView prescription={prescription} />;
}
