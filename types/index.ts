export enum QueueStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
}

export enum EntryStatus {
  WAITING = 'WAITING',
  SERVING = 'SERVING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

export enum QueueEventType {
  PATIENT_ADDED = 'PATIENT_ADDED',
  PATIENT_CALLED = 'PATIENT_CALLED',
  PATIENT_SKIPPED = 'PATIENT_SKIPPED',
  PATIENT_COMPLETED = 'PATIENT_COMPLETED',
  QUEUE_UPDATED = 'QUEUE_UPDATED',
}

export interface AuthPayload {
  userId: string;
  facilityId: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  nextCursor: string | null;
  total: number;
}

export interface ClinicDTO {
  id: string;
  name: string;
  createdAt: Date;
}

export interface UserDTO {
  id: string;
  email: string;
  facilityId: string;
  createdAt: Date;
}

export interface QueueDTO {
  id: string;
  facilityId: string;
  name: string;
  status: QueueStatus;
  waitingCount?: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueueEntryDTO {
  id: string;
  queueId: string;
  patientName: string;
  phone: string | null;
  queueNumber: number;
  status: EntryStatus;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueueEventDTO {
  id: string;
  queueId: string;
  entryId: string | null;
  eventType: QueueEventType;
  timestamp: Date;
}

export interface AnalyticsDTO {
  id: string;
  facilityId: string;
  queueId: string;
  date: Date;
  metrics: Record<string, unknown>;
}

export interface WSQueueEvent {
  type: QueueEventType;
  facilityId: string;
  queueId: string;
  entryId?: string;
  timestamp: string;
}
