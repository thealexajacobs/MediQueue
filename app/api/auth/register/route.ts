import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/email';

const registerSchema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required').max(100).trim(),
  name: z.string().max(100).trim().default(''),
  email: z.string().email('Invalid email address').trim(),
  password: z.string()
    .min(8, 'At least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json(
        { success: false, message: msg },
        { status: 400 },
      );
    }

    const { clinicName, name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 },
      );
    }

    const facility = await prisma.facility.create({
      data: { name: clinicName },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        facilityId: facility.id,
        name,
        email,
        passwordHash,
      },
    });

    sendEmail({
      to: email,
      subject: 'Welcome to MediQueue',
      html: `<p>Hi ${name || 'there'},</p><p>Welcome to MediQueue! Your account for <strong>${clinicName}</strong> has been created successfully.</p><p>You can now sign in to start managing your queues.</p><p><a href="${env.AUTH_URL}/login" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;margin-top:8px">Sign in to MediQueue</a></p>`,
    }).catch((err) => console.error('[register] email send failed (non-blocking):', err));

    return NextResponse.json(
      { success: true, data: { facilityId: facility.id } },
      { status: 201 },
    );
  } catch (err) {
    console.error('[register] POST error:', err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Something went wrong' },
      { status: 500 },
    );
  }
}
