const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const userResult = await p.user.deleteMany();
  console.log('Deleted', userResult.count, 'users');

  const orphaned = await p.facility.findMany({
    where: { users: { none: {} } },
    select: { id: true, name: true },
  });

  if (orphaned.length > 0) {
    const facilityResult = await p.facility.deleteMany({
      where: { id: { in: orphaned.map((f) => f.id) } },
    });
    console.log('Deleted', facilityResult.count, 'orphaned facilities:', orphaned.map((f) => f.name).join(', '));
  } else {
    console.log('No orphaned facilities to clean up');
  }

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
