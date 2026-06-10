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

  const clinic = await prisma.clinic.findUnique({
    where: { id: session.user.clinicId },
    select: { name: true },
  });

  const queueCount = await prisma.queue.count({
    where: { clinicId: session.user.clinicId },
  });

  if (queueCount === 0) {
    redirect('/onboarding');
  }

  const queues = await prisma.queue.findMany({
    where: { clinicId: session.user.clinicId },
    orderBy: { createdAt: 'asc' },
  });

  const queuesWithCounts: QueueDTO[] = await Promise.all(
    queues.map(async (queue) => ({
      id: queue.id,
      clinicId: queue.clinicId,
      name: queue.name,
      status: queue.status as QueueDTO['status'],
      createdAt: queue.createdAt,
      updatedAt: queue.updatedAt,
      waitingCount: await prisma.queueEntry.count({
        where: { queueId: queue.id, status: 'WAITING' },
      }),
    })),
  );

  return (
    <DashboardShell
      clinicName={clinic?.name ?? 'Clinic'}
      clinicId={session.user.clinicId}
      initialQueues={queuesWithCounts}
    />
  );
}
