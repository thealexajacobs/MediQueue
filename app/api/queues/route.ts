import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createQueueSchema } from '@/features/queues/schemas/queue';
import { requireRole } from '@/lib/auth';
import { Role } from '@/types';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';

export const GET = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    const queues = await prisma.queue.findMany({
      where: { clinicId: req.auth.user.clinicId },
      orderBy: { createdAt: 'asc' },
    });

    const queuesWithCounts = await Promise.all(
      queues.map(async (queue) => {
        const waitingCount = await prisma.queueEntry.count({
          where: { queueId: queue.id, status: 'WAITING' },
        });
        return { ...queue, waitingCount };
      }),
    );

    return NextResponse.json({ success: true, data: queuesWithCounts });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[queues] GET error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    if (!req.auth?.user) throw new UnauthorizedError();

    requireRole(req.auth.user, Role.CLINIC_ADMIN);

    const body = await req.json();
    const parsed = createQueueSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    const queue = await prisma.queue.create({
      data: {
        clinicId: req.auth.user.clinicId,
        name: parsed.data.name,
      },
    });

    return NextResponse.json({ success: true, data: queue }, { status: 201 });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }
    console.error('[queues] POST error:', err);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
});
