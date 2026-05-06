"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPrescription(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const doctorId = formData.get("doctorId") as string;
  const medications = formData.get("medications") as string; // Expecting stringified JSON
  const notes = formData.get("notes") as string;

  if (!patientId || !doctorId || !medications) {
    throw new Error("Missing required fields");
  }

  const prescription = await prisma.prescription.create({
    data: {
      patientId,
      doctorId,
      medications,
      notes,
    },
  });

  revalidatePath(`/patients/${patientId}`);
  return prescription;
}
