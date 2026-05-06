const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const patient = await prisma.patient.findFirst();
  if (!patient) {
    console.log("No patient found. Please seed patients first.");
    return;
  }

  const consultation = await prisma.consultation.findFirst({
    where: { patientId: patient.id }
  });

  // Create a sample paid invoice
  await prisma.billing.create({
    data: {
      invoiceNo: "2026-0001",
      orNo: "OR-2026-8842",
      patientId: patient.id,
      consultationId: consultation?.id,
      subtotal: 1500,
      discountType: "SENIOR",
      discountAmount: 300,
      totalAmount: 1200,
      amountPaid: 1200,
      balance: 0,
      status: "PAID",
      paymentMethod: "CASH",
      items: {
        create: [
          { description: "Consultation Fee", quantity: 1, unitPrice: 500, subtotal: 500, category: "CONSULTATION" },
          { description: "Blood Test (CBC)", quantity: 1, unitPrice: 1000, subtotal: 1000, category: "LAB" }
        ]
      }
    }
  });

  // Create a sample unpaid invoice
  await prisma.billing.create({
    data: {
      invoiceNo: "2026-0002",
      patientId: patient.id,
      subtotal: 2500,
      discountType: "NONE",
      discountAmount: 0,
      totalAmount: 2500,
      amountPaid: 0,
      balance: 2500,
      status: "UNPAID",
      items: {
        create: [
          { description: "Minor Procedure - Wound Dressing", quantity: 1, unitPrice: 2500, subtotal: 2500, category: "PROCEDURE" }
        ]
      }
    }
  });

  console.log("Billing seed completed.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
