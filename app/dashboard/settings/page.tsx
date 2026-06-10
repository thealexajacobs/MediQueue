import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SettingsContent } from '@/components/dashboard/SettingsContent';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth?mode=login');

  return <SettingsContent />;
}
