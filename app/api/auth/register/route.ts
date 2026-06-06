import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required').max(100).trim(),
  email: z.string().email('Invalid email address').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
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

    const { clinicName, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 },
      );
    }

    const clinic = await prisma.clinic.create({
      data: { name: clinicName },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        clinicId: clinic.id,
        email,
        passwordHash,
        role: 'CLINIC_ADMIN',
      },
    });

    return NextResponse.json(
      { success: true, data: { clinicId: clinic.id } },
      { status: 201 },
    );
  } catch (err) {
    console.error('[register] POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
