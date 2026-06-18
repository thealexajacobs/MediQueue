import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Models that have a direct facilityId field — enforce facilityId in where/data
const directTenantModels = ['Queue', 'AnalyticsRecord'];

function getUrl(): string {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? '';
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

prisma.$use(async (params, next) => {
  const model = params.model ?? '';
  if (directTenantModels.includes(model)) {
    if (params.action === 'create' && !params.args.data?.facilityId) {
      throw new Error(`facilityId required for ${model} creation`);
    }
    if (['update', 'delete', 'updateMany', 'deleteMany'].includes(params.action)) {
      if (!params.args.where?.facilityId) {
        throw new Error(`facilityId required in where clause for ${model} ${params.action}`);
      }
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
