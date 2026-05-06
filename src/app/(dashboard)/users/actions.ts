"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) {
    throw new Error("Missing required fields");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "DOCTOR") {
      const names = name.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || "Doctor";
      
      await tx.doctor.create({
        data: {
          firstName,
          lastName,
          specialty: "General Medicine",
          contactInfo: email,
        }
      });
    }
  });

  revalidatePath("/users");
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  const data: any = { name, email, role };
  
  if (password && password.trim() !== "") {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.$transaction(async (tx) => {
    const oldUser = await tx.user.findUnique({ where: { id } });
    await tx.user.update({
      where: { id },
      data,
    });

    // If role changed to DOCTOR or name changed for a DOCTOR
    if (role === "DOCTOR") {
      const names = name.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || "Doctor";

      const existingDoctor = await tx.doctor.findFirst({
        where: { contactInfo: oldUser?.email }
      });

      if (existingDoctor) {
        await tx.doctor.update({
          where: { id: existingDoctor.id },
          data: { firstName, lastName, contactInfo: email }
        });
      } else {
        await tx.doctor.create({
          data: { firstName, lastName, specialty: "General Medicine", contactInfo: email }
        });
      }
    }
  });

  revalidatePath("/users");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/users");
}
