import type { NextRequest } from 'next/server';

function getStaticOrigins(): string[] {
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ].filter(Boolean) as string[];
}

export function validateOrigin(req: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') return true;

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  if (!origin && !referer) return false;

  const source = origin ?? referer!;
  try {
    const parsed = new URL(source);
    const staticOrigins = getStaticOrigins();

    if (staticOrigins.some((allowed) => new URL(allowed).origin === parsed.origin)) {
      return true;
    }

    // When AUTH_TRUST_HOST is set, trust any origin that matches the Host header
    if (process.env.AUTH_TRUST_HOST && host) {
      const hostOrigin = `${parsed.protocol}//${host}`;
      if (parsed.origin === hostOrigin) return true;
    }

    return false;
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
