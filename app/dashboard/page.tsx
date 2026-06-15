import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import type { QueueDTO } from '@/types';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    console.warn('[dashboard] no session, redirecting to login');
    redirect('/login');
  }

  const [facility, allQueues, activeQueues] = await Promise.all([
    prisma.facility.findUnique({
      where: { id: session.user.facilityId },
      select: { name: true },
    }),
    prisma.queue.findMany({
      where: { facilityId: session.user.facilityId },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.queue.findMany({
      where: { facilityId: session.user.facilityId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  if (allQueues.length === 0) {
    redirect('/onboarding');
  }

  const waitingEntries = await prisma.queueEntry.findMany({
    where: {
      queueId: { in: activeQueues.map((q) => q.id) },
      status: 'WAITING',
    },
    select: { queueId: true },
  });

  const countMap = new Map<string, number>();
  for (const e of waitingEntries) {
    countMap.set(e.queueId, (countMap.get(e.queueId) ?? 0) + 1);
  }

  const queuesWithCounts: QueueDTO[] = activeQueues.map((queue) => ({
    id: queue.id,
    facilityId: queue.facilityId,
    name: queue.name,
    status: queue.status as QueueDTO['status'],
    deletedAt: null,
    createdAt: queue.createdAt,
    updatedAt: queue.updatedAt,
    waitingCount: countMap.get(queue.id) ?? 0,
  }));

  return (
    <DashboardShell
      clinicName={facility?.name ?? 'Facility'}
      clinicId={session.user.facilityId}
      userName={session.user.name ?? ''}
      userEmail={session.user.email ?? ''}
      initialQueues={queuesWithCounts}
    />
  );
}
