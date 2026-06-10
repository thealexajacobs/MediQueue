import { prisma } from '@/lib/prisma';

export async function getNextPosition(queueId: string): Promise<number> {
  const result = await prisma.queueEntry.aggregate({
    where: { queueId },
    _max: { position: true },
  });
  return (result._max.position ?? 0) + 1;
}

export async function getNextQueueNumber(queueId: string): Promise<number> {
  const result = await prisma.queueEntry.aggregate({
    where: { queueId },
    _max: { queueNumber: true },
  });
  return (result._max.queueNumber ?? 0) + 1;
}

export async function recalculatePositions(queueId: string): Promise<void> {
  const waiting = await prisma.queueEntry.findMany({
    where: { queueId, status: 'WAITING' },
    orderBy: { position: 'asc' },
    select: { id: true },
  });

  await prisma.$transaction(
    waiting.map((entry, index) =>
      prisma.queueEntry.update({
        where: { id: entry.id },
        data: { position: index + 1 },
      }),
    ),
  );
}
