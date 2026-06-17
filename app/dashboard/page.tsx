import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    console.warn('[dashboard] no session, redirecting to login');
    redirect('/login');
  }

  const facility = await prisma.facility.findUnique({
    where: { id: session.user.facilityId },
    select: { name: true },
  });

  return (
    <DashboardShell
      clinicName={facility?.name ?? 'Facility'}
      clinicId={session.user.facilityId}
      userName={session.user.name ?? ''}
      userEmail={session.user.email ?? ''}
    />
  );
}
