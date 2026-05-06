"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBilling(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const consultationId = formData.get("consultationId") as string || null;
  const discountType = formData.get("discountType") as string;
  const discountAmount = parseFloat(formData.get("discountAmount") as string) || 0;
  const items = JSON.parse(formData.get("items") as string);
  const paymentMethod = formData.get("paymentMethod") as string;
  const amountPaid = parseFloat(formData.get("amountPaid") as string) || 0;
  const hmoProvider = formData.get("hmoProvider") as string || null;
  const hmoApprovalCode = formData.get("hmoApprovalCode") as string || null;
  const hmoCoverage = parseFloat(formData.get("hmoCoverage") as string) || 0;
  const notes = formData.get("notes") as string;

  const subtotal = items.reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0);
  const totalAmount = subtotal - discountAmount;
  const balance = totalAmount - hmoCoverage - amountPaid;
  const status = balance <= 0 ? "PAID" : (amountPaid > 0 || hmoCoverage > 0 ? "PARTIAL" : "UNPAID");

  // Auto-generate Invoice No: 2026-0001
  const dateStr = new Date().getFullYear().toString();
  const count = await prisma.billing.count();
  const invoiceNo = `${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

  const billing = await prisma.billing.create({
    data: {
      patientId,
      consultationId: (consultationId && consultationId !== "null") ? consultationId : null,
      invoiceNo,
      subtotal,
      discountType,
      discountAmount,
      totalAmount,
      hmoProvider,
      hmoApprovalCode,
      hmoCoverage,
      amountPaid,
      balance,
      paymentMethod,
      status,
      notes,
      items: {
        create: items.map((item: any) => ({
          description: item.description,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          subtotal: item.unitPrice * item.quantity,
          category: item.category
        }))
      }
    }
  });

  revalidatePath("/billing");
  revalidatePath(`/patients/${patientId}`);
  return billing;
}

export async function processPayment(billingId: string, amount: number, method: string) {
  const billing = await prisma.billing.findUnique({
    where: { id: billingId }
  });

  if (!billing) throw new Error("Billing not found");

  const newAmountPaid = billing.amountPaid + amount;
  const newBalance = billing.totalAmount - newAmountPaid;
  const status = newBalance <= 0 ? "PAID" : "PARTIAL";

  await prisma.billing.update({
    where: { id: billingId },
    data: {
      amountPaid: newAmountPaid,
      balance: newBalance,
      status,
      paymentMethod: method,
      orNo: status === "PAID" ? `OR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined
    }
  });

  revalidatePath("/billing");
}

export async function deleteBilling(id: string) {
  await prisma.billing.delete({ where: { id } });
  revalidatePath("/billing");
}
