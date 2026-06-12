import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { UnauthorizedError } from '@/lib/errors';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim().optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, 'At least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character')
    .optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) return false;
    return true;
  },
  { message: 'Current password is required to set a new password', path: ['currentPassword'] },
);

export const PATCH = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const { name, currentPassword, newPassword } = parsed.data;

    if (!name && !newPassword) {
      return NextResponse.json({ success: false, message: 'Nothing to update' }, { status: 400 });
    }

    if (newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: req.auth.user.id },
        select: { passwordHash: true },
      });

      if (!user) throw new UnauthorizedError();

      const isValid = await bcrypt.compare(currentPassword!, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
      }
    }

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;
    if (newPassword) updateData.passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.auth.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[profile] PATCH error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
