import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Models that have a direct clinicId field — enforce clinicId in where/data
const directTenantModels = ['Queue', 'AnalyticsRecord'];

function getUrl() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? '';
  if (!url) throw new Error('DATABASE_URL is not set');
  return url;
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
    if (params.action === 'create' && !params.args.data?.clinicId) {
      throw new Error(`clinicId required for ${model} creation`);
    }
    if (['update', 'delete', 'updateMany', 'deleteMany'].includes(params.action)) {
      if (!params.args.where?.clinicId) {
        throw new Error(`clinicId required in where clause for ${model} ${params.action}`);
      }
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
