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

    const waitingCount = await prisma.queueEntry.count({
      where: { queueId: entry.queueId, status: 'WAITING' },
    });

    const avgServeMinutes = 12;
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
          name: entry.queue.name,
          status: entry.queue.status,
        },
        serving: serving
          ? { queueNumber: serving.queueNumber, patientName: serving.patientName }
          : null,
        waitingCount,
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
