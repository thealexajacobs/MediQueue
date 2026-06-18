import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { UnauthorizedError } from '@/lib/errors';

const updateClinicSchema = z.object({
  name: z.string().min(1, 'Clinic name is required').max(100).trim().optional(),
  logo: z.string().optional(),
});

export const GET = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const facility = await prisma.facility.findUnique({
      where: { id: req.auth.user.facilityId },
      select: { id: true, name: true, logo: true },
    });

    if (!facility) {
      return NextResponse.json({ success: false, message: 'Facility not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: facility });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[clinics] GET error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
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

    const data: Record<string, string> = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.logo !== undefined) data.logo = parsed.data.logo;

    const facility = await prisma.facility.update({
      where: { id: req.auth.user.facilityId },
      data,
    });

    return NextResponse.json({ success: true, data: { id: facility.id, name: facility.name, logo: facility.logo } });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[clinics] PATCH error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
