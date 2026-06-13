import { auth } from '@/auth';
import { UnauthorizedError } from '@/lib/errors';

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  return session.user;
}
