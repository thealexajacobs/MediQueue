import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SetupForm } from '@/features/queues/components/SetupForm';

export default async function SetupPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const queueCount = await prisma.queue.count({
    where: { clinicId: session.user.clinicId },
  });

  if (queueCount > 0) redirect('/dashboard');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-8 max-w-md">
        <h1 className="text-3xl font-bold text-foreground">Welcome to MediQueue</h1>
        <p className="mt-3 text-muted-foreground">
          Your clinic is all set up. Create your first queue to start managing patients.
        </p>
      </div>

      <SetupForm />

      <p className="mt-4 text-xs text-muted-foreground">
        You can create additional queues later from the dashboard.
      </p>
    </div>
  );
}
