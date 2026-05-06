import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ConsultationDetail } from "@/components/consultations/ConsultationDetail";

export default async function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });

  if (!consultation) notFound();

  return <ConsultationDetail consultation={consultation} />;
}
