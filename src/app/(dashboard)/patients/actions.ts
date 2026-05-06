"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPatient(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;
  const contactInfo = formData.get("contactInfo") as string;
  const address = formData.get("address") as string;

  if (!firstName || !lastName || !dateOfBirth || !gender) {
    throw new Error("Missing required fields");
  }

  await prisma.patient.create({
    data: {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      contactInfo,
      address,
    },
  });

  revalidatePath("/patients");
  redirect("/patients");
}

export async function updatePatient(id: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;
  const contactInfo = formData.get("contactInfo") as string;
  const address = formData.get("address") as string;

  if (!firstName || !lastName || !dateOfBirth || !gender) {
    throw new Error("Missing required fields");
  }

  await prisma.patient.update({
    where: { id },
    data: {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      contactInfo,
      address,
    },
  });

  revalidatePath("/patients");
  redirect("/patients");
}

export async function deletePatient(id: string) {
  await prisma.patient.delete({
    where: { id },
  });

  revalidatePath("/patients");
}
