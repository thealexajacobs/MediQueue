import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateQueueSchema } from '@/features/queues/schemas/queue';
import { requireRole } from '@/lib/auth';
import { Role } from '@/types';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();
    requireRole(session.user, Role.CLINIC_ADMIN);

    const { id } = await params;

    const existing = await prisma.queue.findFirst({
      where: { id, clinicId: session.user.clinicId },
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
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();
    requireRole(session.user, Role.CLINIC_ADMIN);

    const { id } = await params;

    const existing = await prisma.queue.findFirst({
      where: { id, clinicId: session.user.clinicId },
    });
    if (!existing) throw new NotFoundError('Queue not found');

    await prisma.queue.delete({ where: { id } });

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
}
