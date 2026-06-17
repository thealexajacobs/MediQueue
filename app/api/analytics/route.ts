import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/errors';

function getDateRange(period: string) {
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  switch (period) {
    case 'yesterday': {
      const start = new Date(todayStart);
      start.setUTCDate(start.getUTCDate() - 1);
      return { start, end: new Date(todayStart), label: 'yesterday' };
    }
    case 'last7': {
      const start = new Date(todayStart);
      start.setUTCDate(start.getUTCDate() - 6);
      return { start, end: new Date(todayEnd), label: 'last7' };
    }
    default: {
      return { start: new Date(todayStart), end: new Date(todayEnd), label: 'today' };
    }
  }
}

export const GET = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const facilityId = req.auth.user.facilityId;

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'today';
    const { start, end, label } = getDateRange(period);

    const queues = await prisma.queue.findMany({
      where: { facilityId },
      select: { id: true, name: true },
      orderBy: { createdAt: 'asc' },
    });

    const entries = await prisma.queueEntry.findMany({
      where: {
        queue: { facilityId },
        createdAt: { gte: start, lt: end },
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

    const completed = entries.filter((e) => e.status === 'COMPLETED');

    const totalPatients = entries.length;
    const totalCompleted = completed.length;
    const activeQueues = queues.length;

    const queuePerformance = queues.map((q) => {
      const served = completed.filter((e) => e.queueId === q.id).length;
      const completedForQueue = completed.filter((e) => e.queueId === q.id);
      let avgWait = 0;
      if (completedForQueue.length > 0) {
        const totalMs = completedForQueue.reduce(
          (sum, e) => sum + (e.updatedAt.getTime() - e.createdAt.getTime()),
          0,
        );
        avgWait = Math.round(totalMs / completedForQueue.length / 60000);
      }
      return { name: q.name, served, avgWait };
    });

    let averageWaitTime = 0;
    if (completed.length > 0) {
      const totalMs = completed.reduce(
        (sum, e) => sum + (e.updatedAt.getTime() - e.createdAt.getTime()),
        0,
      );
      averageWaitTime = Math.round(totalMs / completed.length / 60000);
    }

    let chartData;

    if (label === 'last7') {
      const dayBuckets: { label: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(start);
        dayStart.setUTCDate(dayStart.getUTCDate() + i);
        const dayLabel = dayStart.toISOString().split('T')[0];
        const dayEnd = new Date(dayStart);
        dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
        const count = entries.filter((e) => {
          const t = e.createdAt.getTime();
          return t >= dayStart.getTime() && t < dayEnd.getTime();
        }).length;
        dayBuckets.push({ label: dayLabel, count });
      }
      chartData = { type: 'daily', buckets: dayBuckets };
    } else {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const hourlyBuckets = hours.map((hour) => {
        const count = entries.filter((e) => e.createdAt.getUTCHours() === hour).length;
        return { hour, count };
      });
      chartData = { type: 'hourly', buckets: hourlyBuckets };
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalPatients,
          totalCompleted,
          averageWaitTime,
          activeQueues,
        },
        queuePerformance,
        chartData,
        period: label,
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