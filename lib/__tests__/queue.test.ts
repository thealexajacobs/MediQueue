import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    queueEntry: {
      aggregate: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const { getNextPosition, getNextQueueNumber, recalculatePositions } = await import('@/lib/queue');

describe('getNextPosition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 1 when no entries exist', async () => {
    vi.mocked(prisma.queueEntry.aggregate).mockResolvedValue({
      _max: { position: null },
    } as never);

    const result = await getNextPosition('queue-1');
    expect(result).toBe(1);
  });

  it('returns max position + 1 when entries exist', async () => {
    vi.mocked(prisma.queueEntry.aggregate).mockResolvedValue({
      _max: { position: 5 },
    } as never);

    const result = await getNextPosition('queue-1');
    expect(result).toBe(6);
  });
});

describe('getNextQueueNumber', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 1 when no entries exist', async () => {
    vi.mocked(prisma.queueEntry.aggregate).mockResolvedValue({
      _max: { queueNumber: null },
    } as never);

    const result = await getNextQueueNumber('queue-1');
    expect(result).toBe(1);
  });

  it('returns max queueNumber + 1 when entries exist', async () => {
    vi.mocked(prisma.queueEntry.aggregate).mockResolvedValue({
      _max: { queueNumber: 42 },
    } as never);

    const result = await getNextQueueNumber('queue-1');
    expect(result).toBe(43);
  });
});

describe('recalculatePositions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renumbers waiting entries sequentially', async () => {
    vi.mocked(prisma.queueEntry.findMany).mockResolvedValue([
      { id: 'entry-1' },
      { id: 'entry-2' },
      { id: 'entry-3' },
    ] as never);

    await recalculatePositions('queue-1');

    expect(prisma.queueEntry.update).toHaveBeenCalledTimes(3);
    expect(prisma.queueEntry.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'entry-1' },
      data: { position: 1 },
    });
    expect(prisma.queueEntry.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'entry-2' },
      data: { position: 2 },
    });
    expect(prisma.queueEntry.update).toHaveBeenNthCalledWith(3, {
      where: { id: 'entry-3' },
      data: { position: 3 },
    });
  });

  it('does nothing when no waiting entries', async () => {
    vi.mocked(prisma.queueEntry.findMany).mockResolvedValue([] as never);

    await recalculatePositions('queue-1');

    expect(prisma.queueEntry.update).not.toHaveBeenCalled();
  });
});
