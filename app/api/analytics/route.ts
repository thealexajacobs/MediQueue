import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/errors';

export const GET = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const facilityId = req.auth.user.facilityId;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const queues = await prisma.queue.findMany({
      where: { facilityId },
      select: { id: true, name: true },
      orderBy: { createdAt: 'asc' },
    });

    const todayEntries = await prisma.queueEntry.findMany({
      where: {
        queue: { facilityId },
        createdAt: { gte: todayStart },
      },
      select: {
        id: true,
        queueId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        queue: { select: { name: true } },
      },
    });

    const allCompleted = await prisma.queueEntry.findMany({
      where: {
        queue: { facilityId },
        status: 'COMPLETED',
      },
      select: {
        id: true,
        queueId: true,
        createdAt: true,
        updatedAt: true,
        queue: { select: { name: true } },
      },
    });

    const totalPatientsToday = todayEntries.length;
    const totalCompleted = allCompleted.length;
    const activeQueues = queues.length;

    const queuePerformance = queues.map((q) => {
      const served = allCompleted.filter((e) => e.queueId === q.id).length;
      const todayCompletedForQueue = todayEntries.filter(
        (e) => e.queueId === q.id && e.status === 'COMPLETED',
      );
      let avgWait = 0;
      if (todayCompletedForQueue.length > 0) {
        const totalMs = todayCompletedForQueue.reduce(
          (sum, e) => sum + (e.updatedAt.getTime() - e.createdAt.getTime()),
          0,
        );
        avgWait = Math.round(totalMs / todayCompletedForQueue.length / 60000);
      }
      return { name: q.name, served, avgWait };
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const hourlyActivity = hours.map((hour) => {
      const count = todayEntries.filter((e) => e.createdAt.getHours() === hour).length;
      return { hour, count };
    });

    let averageWaitTime = 0;
    const todayCompleted = todayEntries.filter((e) => e.status === 'COMPLETED');
    if (todayCompleted.length > 0) {
      const totalMs = todayCompleted.reduce(
        (sum, e) => sum + (e.updatedAt.getTime() - e.createdAt.getTime()),
        0,
      );
      averageWaitTime = Math.round(totalMs / todayCompleted.length / 60000);
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalPatientsToday,
          totalCompleted,
          averageWaitTime,
          activeQueues,
        },
        queuePerformance,
        hourlyActivity,
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
