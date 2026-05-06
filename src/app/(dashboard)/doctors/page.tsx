import { prisma } from "@/lib/prisma";
import { DoctorManager } from "@/components/doctors/DoctorManager";

export default async function DoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    orderBy: { lastName: "asc" },
  });

  return <DoctorManager doctors={doctors} />;
}
