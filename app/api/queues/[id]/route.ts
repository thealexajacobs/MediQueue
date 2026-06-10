import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateQueueSchema } from '@/features/queues/schemas/queue';
import { requireRole } from '@/lib/auth';
import { Role, QueueEventType } from '@/types';
import { emitQueueEvent } from '@/lib/websocket';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors';

export const PATCH = auth(async (
  req,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();
    requireRole(req.auth.user, Role.CLINIC_ADMIN);

    const { id } = await params;

    const existing = await prisma.queue.findFirst({
      where: { id, clinicId: req.auth.user.clinicId },
    });
    if (!existing) throw new NotFoundError('Queue not found');

    const body = await req.json();
    const parsed = updateQueueSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const queue = await prisma.queue.update({
      where: { id },
      data: parsed.data,
    });

    emitQueueEvent({
      type: QueueEventType.QUEUE_UPDATED,
      clinicId: req.auth.user.clinicId,
      queueId: id,
    });

    return NextResponse.json({ success: true, data: queue });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
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
    requireRole(_req.auth.user, Role.CLINIC_ADMIN);

    const { id } = await params;

    const existing = await prisma.queue.findFirst({
      where: { id, clinicId: _req.auth.user.clinicId },
    });
    if (!existing) throw new NotFoundError('Queue not found');

    await prisma.queue.delete({ where: { id } });

    emitQueueEvent({
      type: QueueEventType.QUEUE_UPDATED,
      clinicId: _req.auth.user.clinicId,
      queueId: id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ success: false, message: 'Queue not found' }, { status: 404 });
    }
    console.error('[queues] DELETE error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
