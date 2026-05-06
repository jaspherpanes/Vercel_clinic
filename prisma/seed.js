const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const staffPassword = await bcrypt.hash('staff123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: {
      email: 'admin@clinic.com',
      name: 'System Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: 'staff@clinic.com' },
    update: {},
    create: {
      email: 'staff@clinic.com',
      name: 'Receptionist',
      password: staffPassword,
      role: 'STAFF',
    },
  })

  const doctorPassword = await bcrypt.hash('doctor123', 10)
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@clinic.com' },
    update: {},
    create: {
      email: 'doctor@clinic.com',
      name: 'Dr. Jane Smith',
      password: doctorPassword,
      role: 'DOCTOR',
    },
  })

  // Create a sample doctor
  const doc1 = await prisma.doctor.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      specialty: 'Cardiology',
      contactInfo: 'jane.smith@clinic.com',
    }
  })

  // Create a sample patient
  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'Male',
      contactInfo: '123-456-7890',
      address: '123 Main St, Cityville',
    }
  })

  console.log({ admin, staff, doc1, patient1 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
