import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { UnauthorizedError } from '@/lib/errors';

const updateClinicSchema = z.object({
  name: z.string().min(1, 'Clinic name is required').max(100).trim(),
});

export const PATCH = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = updateClinicSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const facility = await prisma.facility.update({
      where: { id: req.auth.user.facilityId },
      data: { name: parsed.data.name },
    });

    return NextResponse.json({ success: true, data: { id: facility.id, name: facility.name } });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[clinics] PATCH error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
