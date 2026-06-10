import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/errors';

export const GET = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const { searchParams } = new URL(req.url);
    const queueId = searchParams.get('queueId');
    const days = Math.min(parseInt(searchParams.get('days') ?? '7', 10), 90);

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const queueFilter = queueId ? { queueId } : {};

    const records = await prisma.analyticsRecord.findMany({
      where: {
        clinicId: req.auth.user.clinicId,
        ...queueFilter,
        date: { gte: dateFrom },
      },
      orderBy: { date: 'asc' },
    });

    const clinicId = req.auth.user.clinicId;

    const totalPatientsToday = await prisma.queueEntry.count({
      where: {
        queueId: queueId ?? undefined,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        queue: { clinicId },
      },
    });

    const totalCompleted = await prisma.queueEntry.count({
      where: {
        queueId: queueId ?? undefined,
        status: 'COMPLETED',
        queue: { clinicId },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        records,
        summary: {
          totalPatientsToday,
          totalCompleted,
        },
      },
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[analytics] GET error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
