"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDoctor(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const specialty = formData.get("specialty") as string;
  const contactInfo = formData.get("contactInfo") as string;

  if (!firstName || !lastName || !specialty) {
    throw new Error("Missing required fields");
  }

  await prisma.doctor.create({
    data: {
      firstName,
      lastName,
      specialty,
      contactInfo,
    },
  });

  revalidatePath("/doctors");
}

export async function updateDoctor(id: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const specialty = formData.get("specialty") as string;
  const contactInfo = formData.get("contactInfo") as string;

  await prisma.doctor.update({
    where: { id },
    data: {
      firstName,
      lastName,
      specialty,
      contactInfo,
    },
  });

  revalidatePath("/doctors");
}

export async function deleteDoctor(id: string) {
  await prisma.doctor.delete({
    where: { id },
  });

  revalidatePath("/doctors");
}
