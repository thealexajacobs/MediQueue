import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const entry = await prisma.queueEntry.findUnique({
      where: { id },
      include: {
        queue: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!entry) throw new NotFoundError();

    const position = await prisma.queueEntry.count({
      where: {
        queueId: entry.queueId,
        position: { lt: entry.position },
        status: { in: ['WAITING', 'SERVING'] },
      },
    });

    const serving = await prisma.queueEntry.findFirst({
      where: { queueId: entry.queueId, status: 'SERVING' },
      select: { queueNumber: true, patientName: true },
    });

    const totalCount = await prisma.queueEntry.count({
      where: { queueId: entry.queueId, status: 'WAITING' },
    });

    const aheadCount = entry.status === 'WAITING'
      ? Math.max(0, totalCount - 1)
      : totalCount;

    const recentCompleted = await prisma.queueEvent.findMany({
      where: { queueId: entry.queueId, eventType: 'PATIENT_COMPLETED', entryId: { not: null } },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: { entryId: true, timestamp: true },
    });

    let avgServeMs = 12 * 60 * 1000;
    if (recentCompleted.length > 0) {
      const entriesWithCreate = await Promise.all(
        recentCompleted.map(async (ev) => {
          const e = await prisma.queueEntry.findUnique({
            where: { id: ev.entryId! },
            select: { createdAt: true },
          });
          return e ? ev.timestamp.getTime() - new Date(e.createdAt).getTime() : null;
        }),
      );
      const validDiffs = entriesWithCreate.filter((d): d is number => d !== null && d > 0);
      if (validDiffs.length > 0) {
        avgServeMs = validDiffs.reduce((a, b) => a + b, 0) / validDiffs.length;
      }
    }
    const avgServeMinutes = Math.max(1, Math.round(avgServeMs / 60000));
    const estWaitMinutes = (position + 1) * avgServeMinutes;

    return NextResponse.json({
      success: true,
      data: {
        entry: {
          id: entry.id,
          queueNumber: entry.queueNumber,
          patientName: entry.patientName,
          status: entry.status,
          position: position + 1,
        },
        queue: {
          id: entry.queue.id,
          name: entry.queue.name,
          status: entry.queue.status,
        },
        serving: serving
          ? { queueNumber: serving.queueNumber, patientName: serving.patientName }
          : null,
        waitingCount: aheadCount,
        totalInQueue: totalCount + (serving ? 1 : 0),
        estWaitMinutes,
      },
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { success: false, message: 'This queue session is no longer available. Please contact the clinic reception.' },
        { status: 404 },
      );
    }
    console.error('[public/queue-entry] GET error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
