import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateEntrySchema } from '@/features/queue-entries/schemas/entry';
import { UnauthorizedError, NotFoundError, ConflictError } from '@/lib/errors';
import { recalculatePositions } from '@/lib/queue';
import { emitQueueEvent } from '@/lib/websocket';
import { EntryStatus, QueueEventType } from '@/types';

const actionStatusMap: Record<string, EntryStatus> = {
  call: EntryStatus.SERVING,
  skip: EntryStatus.SKIPPED,
  complete: EntryStatus.COMPLETED,
};

const actionEventMap: Record<string, QueueEventType> = {
  call: QueueEventType.PATIENT_CALLED,
  skip: QueueEventType.PATIENT_SKIPPED,
  complete: QueueEventType.PATIENT_COMPLETED,
};

export const PATCH = auth(async (
  req,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const { id } = await params;
    const body = await req.json();
    const parsed = updateEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    const { action } = parsed.data;
    const clinicId = req.auth.user.clinicId;

    const entry = await prisma.queueEntry.findUnique({
      where: { id },
      include: { queue: { select: { clinicId: true } } },
    });
    if (!entry) throw new NotFoundError('Entry not found');
    if (entry.queue.clinicId !== req.auth.user.clinicId) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    if (action === 'call') {
      let autoCompletedId: string | undefined;

      await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM "Queue" WHERE id = ${entry.queueId} FOR UPDATE`;

        const serving = await tx.queueEntry.findFirst({
          where: { queueId: entry.queueId, status: 'SERVING' },
        });
        if (serving && serving.id !== id) {
          await tx.queueEntry.update({
            where: { id: serving.id },
            data: { status: 'COMPLETED' },
          });
          await tx.queueEvent.create({
            data: {
              queueId: entry.queueId,
              entryId: serving.id,
              eventType: 'PATIENT_COMPLETED',
            },
          });
          autoCompletedId = serving.id;
        }

        await tx.queueEntry.update({
          where: { id },
          data: { status: 'SERVING' },
        });

        await tx.queueEvent.create({
          data: {
            queueId: entry.queueId,
            entryId: id,
            eventType: 'PATIENT_CALLED',
          },
        });
      });

      if (autoCompletedId) {
        emitQueueEvent({
          type: QueueEventType.PATIENT_COMPLETED,
          clinicId,
          queueId: entry.queueId,
          entryId: autoCompletedId,
        });
      }

      await recalculatePositions(entry.queueId);

      emitQueueEvent({
        type: QueueEventType.PATIENT_CALLED,
        clinicId,
        queueId: entry.queueId,
        entryId: id,
      });
    } else {
      const newStatus = actionStatusMap[action];
      const eventType = actionEventMap[action] as QueueEventType;

      await prisma.$transaction(async (tx) => {
        await tx.queueEntry.update({
          where: { id },
          data: { status: newStatus },
        });

        await tx.queueEvent.create({
          data: {
            queueId: entry.queueId,
            entryId: id,
            eventType,
          },
        });
      });

      await recalculatePositions(entry.queueId);

      emitQueueEvent({
        type: action === 'skip' ? QueueEventType.PATIENT_SKIPPED : QueueEventType.PATIENT_COMPLETED,
        clinicId,
        queueId: entry.queueId,
        entryId: id,
      });
    }

    const updated = await prisma.queueEntry.findUnique({ where: { id } });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ success: false, message: 'Entry not found' }, { status: 404 });
    }
    if (err instanceof ConflictError) {
      return NextResponse.json({ success: false, message: err.message }, { status: 409 });
    }
    console.error('[queue-entries] PATCH error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
