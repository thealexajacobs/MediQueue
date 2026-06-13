import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createHmac } from 'crypto';
import { z } from 'zod';

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string()
    .min(8, 'At least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
});

function verifyResetToken(token: string): { email: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const lastColon = decoded.lastIndexOf(':');
    if (lastColon === -1) return null;
    const hmac = decoded.slice(lastColon + 1);
    const payload = decoded.slice(0, lastColon);
    const parts = payload.split(':');
    const email = parts[0];
    const timestamp = parseInt(parts[1], 10);
    if (isNaN(timestamp) || Date.now() > timestamp) return null;
    const expectedHmac = createHmac('sha256', process.env.JWT_SECRET!).update(payload).digest('hex');
    if (hmac !== expectedHmac) return null;
    return { email };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const { token, password } = parsed.data;
    const payload = verifyResetToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired reset token' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('[reset-password] POST error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
