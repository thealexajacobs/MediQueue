const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const result = await p.user.deleteMany();
  console.log('Deleted', result.count, 'users');
  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
