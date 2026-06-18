import { PrismaClient } from '@prisma/client';

async function main() {
  const p = new PrismaClient();
  try {
    const r = await p.user.deleteMany();
    console.log('Deleted', r.count, 'users');
  } finally {
    await p.$disconnect();
  }
}

main();
