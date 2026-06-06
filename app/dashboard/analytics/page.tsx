import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AnalyticsDashboard } from '@/features/analytics/components/AnalyticsDashboard';

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth?mode=login');

  const queues = await prisma.queue.findMany({
    where: { clinicId: session.user.clinicId },
    select: { id: true, name: true },
  });

  return <AnalyticsDashboard queues={queues} />;
}
