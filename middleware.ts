import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoginRatelimit, getRegisterRatelimit } from '@/lib/rate-limit';
import { csrfGuard } from '@/lib/csrf';

async function handleRateLimiting(req: NextRequest): Promise<NextResponse | null> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';

  if (req.method !== 'POST') return null;
  const path = req.nextUrl.pathname;

  if (path === '/api/auth/callback/credentials') {
    const rl = getLoginRatelimit();
    if (rl) {
      const { success } = await rl.limit(ip);
      if (!success) {
        return NextResponse.json(
          { success: false, message: 'Too many login attempts. Try again later.' },
          { status: 429 },
        );
      }
    }
  }

  if (path === '/api/auth/register') {
    const rl = getRegisterRatelimit();
    if (rl) {
      const { success } = await rl.limit(ip);
      if (!success) {
        return NextResponse.json(
          { success: false, message: 'Too many registration attempts. Try again later.' },
          { status: 429 },
        );
      }
    }
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // CSRF guard for state-changing API requests
  if (path.startsWith('/api/') && !path.includes('/public')) {
    const csrfResponse = csrfGuard(req);
    if (csrfResponse) return csrfResponse;
  }

  // Rate limiting on auth routes
  const rateLimitResponse = await handleRateLimiting(req);
  if (rateLimitResponse) return rateLimitResponse;

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
