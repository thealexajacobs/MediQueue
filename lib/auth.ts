import { auth } from '@/auth';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import type { Role } from '@/types';

const roleHierarchy: Record<Role, number> = {
  RECEPTIONIST: 0,
  CLINIC_ADMIN: 1,
};

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  return session.user;
}

export function requireRole(
  user: { role: Role },
  minimumRole: Role,
): void {
  if (roleHierarchy[user.role] < roleHierarchy[minimumRole]) {
    throw new ForbiddenError('Insufficient permissions');
  }
}

export function isAdmin(user: { role: Role }): boolean {
  return user.role === 'CLINIC_ADMIN';
}
