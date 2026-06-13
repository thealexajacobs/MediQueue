import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { createHmac } from 'crypto';
import { z } from 'zod';

const forgotSchema = z.object({
  email: z.string().email().trim(),
});

function createResetToken(email: string): string {
  const timestamp = Date.now() + 3600000;
  const payload = `${email}:${timestamp}`;
  const hmac = createHmac('sha256', process.env.JWT_SECRET!).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    const token = createResetToken(email);
    const resetUrl = `${process.env.AUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    if (user) {
      await sendEmail({
        to: email,
        subject: 'Reset your MediQueue password',
        html: `<p>Hi ${user.name || 'there'},</p><p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
      });
    }

    return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('[forgot-password] POST error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
