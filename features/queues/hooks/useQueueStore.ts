import { create } from 'zustand';

interface QueueStore {
  selectedQueueId: string | null;
  setSelectedQueueId: (id: string) => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
  selectedQueueId: null,
  setSelectedQueueId: (id) => set({ selectedQueueId: id }),
}));
