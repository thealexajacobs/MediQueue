import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const tenantModels = ['Queue', 'QueueEntry', 'QueueEvent', 'AnalyticsRecord'];

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

prisma.$use(async (params, next) => {
  if (tenantModels.includes(params.model ?? '')) {
    if (params.action === 'create' && !params.args.data?.clinicId) {
      throw new Error(`clinicId required for ${params.model} creation`);
    }
    if (['update', 'delete', 'updateMany', 'deleteMany'].includes(params.action)) {
      if (!params.args.where?.clinicId) {
        throw new Error(`clinicId required in where clause for ${params.model} ${params.action}`);
      }
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
