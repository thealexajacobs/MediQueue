import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateEntrySchema } from '@/features/queue-entries/schemas/entry';
import { UnauthorizedError, NotFoundError, ConflictError } from '@/lib/errors';
import { recalculatePositions } from '@/lib/queue';
import { emitQueueEvent } from '@/lib/websocket';
import type { EntryStatus } from '@prisma/client';

const actionStatusMap: Record<string, EntryStatus> = {
  call: 'SERVING',
  skip: 'SKIPPED',
  complete: 'COMPLETED',
};

const actionEventMap: Record<string, string> = {
  call: 'PATIENT_CALLED',
  skip: 'PATIENT_SKIPPED',
  complete: 'PATIENT_COMPLETED',
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const { id } = await params;
    const body = await req.json();
    const parsed = updateEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    const { action } = parsed.data;

    const entry = await prisma.queueEntry.findUnique({
      where: { id },
      include: { queue: { select: { clinicId: true } } },
    });
    if (!entry) throw new NotFoundError('Entry not found');
    if (entry.queue.clinicId !== session.user.clinicId) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    if (action === 'call') {
      await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM "Queue" WHERE id = ${entry.queueId} FOR UPDATE`;

        const serving = await tx.queueEntry.findFirst({
          where: { queueId: entry.queueId, status: 'SERVING' },
        });
        if (serving && serving.id !== id) {
          throw new ConflictError('A patient is already being served');
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

      emitQueueEvent({
        type: 'PATIENT_CALLED',
        clinicId: session.user.clinicId,
        queueId: entry.queueId,
        entryId: id,
      });
    } else {
      const newStatus = actionStatusMap[action];
      const eventType = actionEventMap[action] as string;

      await prisma.$transaction(async (tx) => {
        await tx.queueEntry.update({
          where: { id },
          data: { status: newStatus },
        });

        await tx.queueEvent.create({
          data: {
            queueId: entry.queueId,
            entryId: id,
            eventType: eventType as 'PATIENT_SKIPPED' | 'PATIENT_COMPLETED',
          },
        });
      });

      await recalculatePositions(entry.queueId);

      emitQueueEvent({
        type: action === 'skip' ? 'PATIENT_SKIPPED' : 'PATIENT_COMPLETED',
        clinicId: session.user.clinicId,
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
}
