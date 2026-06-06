import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth?mode=login');

  const queueCount = await prisma.queue.count({
    where: { clinicId: session.user.clinicId },
  });

  if (queueCount === 0) redirect('/dashboard/setup');

  return <DashboardShell />;
}
