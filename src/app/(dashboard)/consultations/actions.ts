"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createConsultation(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const doctorId = formData.get("doctorId") as string;
  const date = formData.get("date") as string;
  const visitType = formData.get("visitType") as string;
  const chiefComplaint = formData.get("chiefComplaint") as string;
  const diagnosis = formData.get("diagnosis") as string;
  const secondaryDiag = formData.get("secondaryDiag") as string;
  const icdCodes = formData.get("icdCodes") as string;
  const followUpDate = formData.get("followUpDate") as string;
  const followUpNotes = formData.get("followUpNotes") as string;
  const privateNotes = formData.get("privateNotes") as string;
  const status = formData.get("status") as string || "COMPLETED";

  // JSON fields
  const hpi = formData.get("hpi") as string;
  const pastHistory = formData.get("pastHistory") as string;
  const vitalSigns = formData.get("vitalSigns") as string;
  const physicalExam = formData.get("physicalExam") as string;
  const treatmentPlan = formData.get("treatmentPlan") as string;
  const attachments = formData.get("attachments") as string;

  if (!patientId || !doctorId || !date) {
    throw new Error("Missing required fields");
  }

  const consultation = await prisma.consultation.create({
    data: {
      patientId,
      doctorId,
      date: new Date(date),
      visitType,
      chiefComplaint,
      hpi,
      pastHistory,
      vitalSigns,
      physicalExam,
      diagnosis,
      secondaryDiag,
      icdCodes,
      treatmentPlan,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpNotes,
      privateNotes,
      status,
      attachments,
    },
  });

  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/consultations");
  
  return consultation;
}

export async function updateConsultation(id: string, formData: FormData) {
  const visitType = formData.get("visitType") as string;
  const chiefComplaint = formData.get("chiefComplaint") as string;
  const diagnosis = formData.get("diagnosis") as string;
  const secondaryDiag = formData.get("secondaryDiag") as string;
  const icdCodes = formData.get("icdCodes") as string;
  const followUpDate = formData.get("followUpDate") as string;
  const followUpNotes = formData.get("followUpNotes") as string;
  const privateNotes = formData.get("privateNotes") as string;
  const status = formData.get("status") as string;

  const hpi = formData.get("hpi") as string;
  const pastHistory = formData.get("pastHistory") as string;
  const vitalSigns = formData.get("vitalSigns") as string;
  const physicalExam = formData.get("physicalExam") as string;
  const treatmentPlan = formData.get("treatmentPlan") as string;
  const attachments = formData.get("attachments") as string;

  const consultation = await prisma.consultation.update({
    where: { id },
    data: {
      visitType,
      chiefComplaint,
      hpi,
      pastHistory,
      vitalSigns,
      physicalExam,
      diagnosis,
      secondaryDiag,
      icdCodes,
      treatmentPlan,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpNotes,
      privateNotes,
      status,
      attachments,
    },
  });

  revalidatePath(`/patients/${consultation.patientId}`);
  revalidatePath("/consultations");
  
  return consultation;
}
