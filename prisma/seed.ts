import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const clinic = await prisma.clinic.upsert({
    where: { id: 'demo-clinic-1' },
    update: {},
    create: { id: 'demo-clinic-1', name: 'MediQueue Demo Clinic' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      clinicId: clinic.id,
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: await bcrypt.hash('Demo1234!', 12),
      role: 'CLINIC_ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'reception@demo.com' },
    update: {},
    create: {
      clinicId: clinic.id,
      name: 'Reception User',
      email: 'reception@demo.com',
      passwordHash: await bcrypt.hash('Demo1234!', 12),
      role: 'RECEPTIONIST',
    },
  });

  const queueNames = ['General Consultation', 'Pediatrics', 'Dental', 'Pharmacy'];
  const queueIds: string[] = [];
  for (const name of queueNames) {
    const id = `demo-queue-${name.toLowerCase().replace(/ /g, '-')}`;
    queueIds.push(id);
    await prisma.queue.upsert({
      where: { id },
      update: {},
      create: { id, clinicId: clinic.id, name, status: 'ACTIVE' },
    });
  }

  const demoPatients = [
    { name: 'John Adeyemi', phone: '+2348012345678' },
    { name: 'Sarah Okafor', phone: '+2348023456789' },
    { name: 'Emeka Nwosu', phone: null },
    { name: 'Funmi Adebayo', phone: '+2348034567890' },
  ];
  for (let i = 0; i < demoPatients.length; i++) {
    await prisma.queueEntry.create({
      data: {
        queueId: queueIds[0],
        patientName: demoPatients[i].name,
        phone: demoPatients[i].phone,
        queueNumber: i + 1,
        position: i + 1,
        status: i === 0 ? 'SERVING' : 'WAITING',
      },
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
