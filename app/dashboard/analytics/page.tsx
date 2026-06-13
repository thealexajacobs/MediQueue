import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AnalyticsDashboard } from '@/features/analytics/components/AnalyticsDashboard';

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return <AnalyticsDashboard />;
}
