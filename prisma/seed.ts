import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const facility = await prisma.facility.upsert({
    where: { id: 'demo-facility-1' },
    update: {},
    create: { id: 'demo-facility-1', name: 'MediQueue Demo Facility' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      facilityId: facility.id,
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: await bcrypt.hash('Demo1234!', 12),
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
      create: { id, facilityId: facility.id, name, status: 'ACTIVE' },
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
