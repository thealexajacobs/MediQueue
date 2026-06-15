import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { addPatientSchema } from '@/features/queue-entries/schemas/entry';
import { getNextPosition, getNextQueueNumber } from '@/lib/queue';
import { UnauthorizedError } from '@/lib/errors';
import { emitQueueEvent } from '@/lib/websocket';
import { QueueEventType } from '@/types';

export const GET = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const { searchParams } = new URL(req.url);
    const queueId = searchParams.get('queueId');

    if (!queueId) {
      return NextResponse.json({ success: false, message: 'queueId is required' }, { status: 400 });
    }

    const queue = await prisma.queue.findFirst({
      where: { id: queueId, facilityId: req.auth.user.facilityId },
    });
    if (!queue) {
      return NextResponse.json({ success: false, message: 'Queue not found' }, { status: 404 });
    }

    const entries = await prisma.queueEntry.findMany({
      where: { queueId },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ success: true, data: entries });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[queue-entries] GET error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = addPatientSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const { queueId, patientName, phone } = parsed.data;

    const queue = await prisma.queue.findFirst({
      where: { id: queueId, facilityId: req.auth.user.facilityId },
    });
    if (!queue) {
      return NextResponse.json({ success: false, message: 'Queue not found' }, { status: 404 });
    }

    const queueNumber = await getNextQueueNumber(queueId);
    const position = await getNextPosition(queueId);

    const entry = await prisma.queueEntry.create({
      data: {
        queueId,
        patientName,
        phone: phone || null,
        queueNumber,
        position,
        status: 'WAITING',
      },
    });

    await prisma.queueEvent.create({
      data: {
        queueId,
        entryId: entry.id,
        eventType: 'PATIENT_ADDED',
      },
    });

    await emitQueueEvent({
      type: QueueEventType.PATIENT_ADDED,
      facilityId: req.auth.user.facilityId,
      queueId,
      entryId: entry.id,
    });

    const baseUrl = process.env.AUTH_URL || 'http://localhost:3000';

    return NextResponse.json(
      {
        success: true,
        data: {
          ...entry,
          publicUrl: `${baseUrl}/q/${entry.id}`,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[queue-entries] POST error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});