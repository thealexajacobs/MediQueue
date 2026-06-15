import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/errors';

export const GET = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const { searchParams } = new URL(req.url);
    const queueId = searchParams.get('queueId');
    const cursor = searchParams.get('cursor');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    if (!queueId) {
      return NextResponse.json({ success: false, message: 'queueId is required' }, { status: 400 });
    }

    const queue = await prisma.queue.findFirst({
      where: { id: queueId, facilityId: req.auth.user.facilityId },
      select: { id: true },
    });
    if (!queue) {
      return NextResponse.json({ success: false, message: 'Queue not found' }, { status: 404 });
    }

    const where: Record<string, unknown> = { queueId, deletedAt: null };
    if (cursor) {
      where.timestamp = { lt: new Date(cursor) };
    }

    const events = await prisma.queueEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit + 1,
      include: {
        entry: {
          select: { patientName: true, queueNumber: true },
        },
      },
    });

    const hasMore = events.length > limit;
    const items = hasMore ? events.slice(0, limit) : events;
    const nextCursor = hasMore ? items[items.length - 1].timestamp.toISOString() : null;

    return NextResponse.json({
      success: true,
      data: items,
      nextCursor,
      total: items.length,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[events] GET error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
