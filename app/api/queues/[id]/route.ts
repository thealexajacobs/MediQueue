import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateQueueSchema } from '@/features/queues/schemas/queue';
import { z } from 'zod';
import { QueueEventType } from '@/types';
import { emitQueueEvent } from '@/lib/websocket';
import { UnauthorizedError, NotFoundError } from '@/lib/errors';

const restoreSchema = z.object({
  restore: z.literal(true),
});

export const PATCH = auth(async (
  req,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const { id } = await params;

    const existing = await prisma.queue.findFirst({
      where: { id, facilityId: req.auth.user.facilityId },
    });
    if (!existing) throw new NotFoundError('Queue not found');

    const body = await req.json();

    // Handle restore action
    const restoreParsed = restoreSchema.safeParse(body);
    if (restoreParsed.success) {
      const queue = await prisma.queue.update({
        where: { id, facilityId: req.auth.user.facilityId },
        data: { deletedAt: null },
      });

      emitQueueEvent({
        type: QueueEventType.QUEUE_UPDATED,
        facilityId: req.auth.user.facilityId,
        queueId: id,
      });

      return NextResponse.json({ success: true, data: queue });
    }

    // Handle regular update
    const parsed = updateQueueSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const queue = await prisma.queue.update({
      where: { id, facilityId: req.auth.user.facilityId },
      data: parsed.data,
    });

    emitQueueEvent({
      type: QueueEventType.QUEUE_UPDATED,
      facilityId: req.auth.user.facilityId,
      queueId: id,
    });

    return NextResponse.json({ success: true, data: queue });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ success: false, message: 'Queue not found' }, { status: 404 });
    }
    console.error('[queues] PATCH error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});

export const DELETE = auth(async (
  _req,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    if (!_req.auth?.user) throw new UnauthorizedError();

    const { id } = await params;

    const existing = await prisma.queue.findFirst({
      where: { id, facilityId: _req.auth.user.facilityId },
    });
    if (!existing) throw new NotFoundError('Queue not found');

    await prisma.queue.update({
      where: { id, facilityId: _req.auth.user.facilityId },
      data: { deletedAt: new Date() },
    });

    emitQueueEvent({
      type: QueueEventType.QUEUE_UPDATED,
      facilityId: _req.auth.user.facilityId,
      queueId: id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ success: false, message: 'Queue not found' }, { status: 404 });
    }
    console.error('[queues] DELETE error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
