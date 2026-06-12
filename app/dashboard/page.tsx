import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import type { QueueDTO } from '@/types';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    console.warn('[dashboard] no session, redirecting to login');
    redirect('/auth?mode=login');
  }

  const [clinic, queues] = await Promise.all([
    prisma.clinic.findUnique({
      where: { id: session.user.clinicId },
      select: { name: true },
    }),
    prisma.queue.findMany({
      where: { clinicId: session.user.clinicId },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  if (queues.length === 0) {
    redirect('/onboarding');
  }

  const waitingEntries = await prisma.queueEntry.findMany({
    where: {
      queueId: { in: queues.map((q) => q.id) },
      status: 'WAITING',
    },
    select: { queueId: true },
  });

  const countMap = new Map<string, number>();
  for (const e of waitingEntries) {
    countMap.set(e.queueId, (countMap.get(e.queueId) ?? 0) + 1);
  }

  const queuesWithCounts: QueueDTO[] = queues.map((queue) => ({
    id: queue.id,
    clinicId: queue.clinicId,
    name: queue.name,
    status: queue.status as QueueDTO['status'],
    createdAt: queue.createdAt,
    updatedAt: queue.updatedAt,
    waitingCount: countMap.get(queue.id) ?? 0,
  }));

  return (
    <DashboardShell
      clinicName={clinic?.name ?? 'Clinic'}
      clinicId={session.user.clinicId}
      userName={session.user.name}
      userEmail={session.user.email}
      initialQueues={queuesWithCounts}
    />
  );
}
