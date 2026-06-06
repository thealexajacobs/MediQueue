import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.AUTH_URL,
].filter(Boolean) as string[];

export function validateOrigin(req: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') return true;

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  if (!origin && !referer) return false;

  const source = origin ?? referer!;
  try {
    const parsed = new URL(source);
    return ALLOWED_ORIGINS.some(
      (allowed) => new URL(allowed).origin === parsed.origin,
    );
  } catch {
    return false;
  }
}

export function csrfGuard(req: NextRequest): Response | null {
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    if (!validateOrigin(req)) {
      return Response.json(
        { success: false, message: 'Invalid request origin' },
        { status: 403 },
      );
    }
  }
  return null;
}
