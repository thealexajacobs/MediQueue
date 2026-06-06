---
trigger: always_on
---

# Architecture Rules — MediQueue

## Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| ORM | Prisma |
| Database | PostgreSQL |
| Real-time | WebSockets (with polling fallback) |
| Auth | JWT (via server-side sessions) |
| Styling | Tailwind CSS |

---

## Folder Structure
```
app/
  (auth)/
    login/
    signup/
  dashboard/
    page.tsx                  ← Unified operations dashboard
    layout.tsx
  q/
    [queueEntryId]/
      page.tsx                ← Public patient view (no auth)
  api/
    auth/
    clinics/
    queues/
    queue-entries/
    analytics/
    ws/                       ← WebSocket handler

components/
  dashboard/                  ← Dashboard-specific components
  queue/                      ← Queue UI components
  ui/                         ← Shared primitives (Button, Modal, Badge, etc.)

lib/
  prisma.ts                   ← Prisma client singleton
  auth.ts                     ← JWT utilities
  websocket.ts                ← WS server/client utilities
  queue.ts                    ← Queue business logic helpers

prisma/
  schema.prisma
  migrations/

types/
  index.ts                    ← Shared TypeScript types
```

---

## Core Models (Prisma)

### Clinic
```prisma
model Clinic {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]
  queues    Queue[]
  analytics AnalyticsRecord[]
}
```

### User
```prisma
model User {
  id           String   @id @default(cuid())
  clinicId     String
  email        String   @unique
  passwordHash String
  role         Role     @default(RECEPTIONIST)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  clinic       Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)

  @@index([clinicId])
}

enum Role {
  CLINIC_ADMIN
  RECEPTIONIST
}
```

### Queue
```prisma
model Queue {
  id        String       @id @default(cuid())
  clinicId  String
  name      String
  status    QueueStatus  @default(ACTIVE)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  clinic    Clinic       @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  entries   QueueEntry[]
  events    QueueEvent[]
  analytics AnalyticsRecord[]

  @@index([clinicId])
  @@index([status])
}

enum QueueStatus {
  ACTIVE
  PAUSED
  CLOSED
}
```

### QueueEntry
```prisma
model QueueEntry {
  id          String      @id @default(cuid())
  queueId     String
  patientName String
  phone       String?
  queueNumber Int
  status      EntryStatus @default(WAITING)
  position    Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  queue       Queue       @relation(fields: [queueId], references: [id], onDelete: Cascade)

  @@index([queueId])
  @@index([status])
  @@index([position])
}

enum EntryStatus {
  WAITING
  SERVING
  COMPLETED
  SKIPPED
}
```

### QueueEvent
```prisma
model QueueEvent {
  id        String         @id @default(cuid())
  queueId   String
  entryId   String?
  eventType QueueEventType
  timestamp DateTime       @default(now())
  queue     Queue          @relation(fields: [queueId], references: [id], onDelete: Cascade)

  @@index([queueId])
  @@index([timestamp])
}

enum QueueEventType {
  PATIENT_ADDED
  PATIENT_CALLED
  PATIENT_SKIPPED
  PATIENT_COMPLETED
  QUEUE_UPDATED
}
```

### AnalyticsRecord
```prisma
model AnalyticsRecord {
  id       String   @id @default(cuid())
  clinicId String
  queueId  String
  date     DateTime
  metrics  Json
  clinic   Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  queue    Queue    @relation(fields: [queueId], references: [id], onDelete: Cascade)

  @@index([clinicId])
  @@index([queueId])
  @@index([date])
}
```

---

## API Route Conventions

- All routes live under `app/api/`
- Routes are grouped by resource: `clinics`, `queues`, `queue-entries`, `analytics`, `auth`
- Every route handler MUST:
  1. Authenticate the request (except public `/q/` routes)
  2. Extract and validate `clinicId` from the JWT
  3. Scope all Prisma queries to that `clinicId`
  4. Return consistent JSON: `{ data, error, status }`

### Example Structure
```
app/api/queues/
  route.ts         → GET (list), POST (create)
  [id]/
    route.ts       → GET, PATCH, DELETE
    entries/
      route.ts     → GET (list), POST (add patient)
```

---

## Pagination Convention

- List endpoints (`GET /api/queues`, `GET /api/queue-entries`, `GET /api/analytics`) MUST support cursor-based pagination
- Request params: `cursor` (opaque string), `limit` (default 50, max 200)
- Response: `{ data: [...], nextCursor: string | null, total: number }`
- Sort order defaults to `createdAt: desc` unless specified via `?sort=field:dir`

---

## Real-Time Architecture

### WebSocket Events
| Event | Trigger |
|---|---|
| `queue_updated` | Any queue state change |
| `patient_added` | New QueueEntry created |
| `patient_called` | Entry moves to SERVING |
| `patient_skipped` | Entry status → SKIPPED |
| `patient_completed` | Entry status → COMPLETED |

### Rules
- Every mutation endpoint MUST emit the relevant WS event after DB write
- Public patient view subscribes to `queue_updated` events for its `queueId`
- WS connections are scoped to `clinicId` (no cross-tenant leakage)
- Fallback to polling every 3s if WS is unavailable

---

## Multi-Tenancy Rules
- **Every** Prisma query on tenant data must include `where: { clinicId }`
- `clinicId` is always extracted from the verified JWT, never from the request body
- No query should ever return data across clinic boundaries
- Never rely on Prisma middleware for tenancy enforcement — middleware can be bypassed via `$queryRaw` and obscures query intent; use explicit `where: { clinicId }` on every query instead

---

## Performance Targets
| Operation | Target |
|---|---|
| Add patient | < 2 seconds end-to-end |
| Queue update propagation | < 2 seconds |
| Dashboard initial load | < 3 seconds |
| Concurrent sessions | 1000+ per clinic cluster |

---

## Operations

### Database Migrations
- Migrations live in `prisma/migrations/` and are managed via `npx prisma migrate`
- Create a migration: `npx prisma migrate dev --name <description>`
- Apply in production: `npx prisma migrate deploy`
- Rollbacks require a new down-migration — never modify a committed migration file
- All schema changes MUST be reviewed before running against production

### Connection Pooling
- Use PgBouncer or Prisma Accelerate for connection pooling in production
- Configure `connection_limit` in Prisma datasource for concurrent session limits
- Connection strings should use a pooled connection string, not a direct database URL

### Rate Limiting
- API routes (except public `/q/`) MUST enforce rate limiting
- Recommended: Token bucket at 100 requests/minute per clinic ID, 10 requests/second burst
- Unauthenticated routes (`/q/[queueEntryId]`) should be limited to 30 requests/minute per IP

### Logging & Monitoring
- Use structured JSON logging for all server-side operations
- Log queue mutations with event type, clinic ID, user ID, and duration
- Never log `passwordHash`, JWT secrets, or raw query parameters
- Monitor WebSocket connection counts and reconnection rates as health indicators

### Soft Deletes
- Records critical for audit (QueueEntry, QueueEvent, AnalyticsRecord) should use soft deletes
- Add `deletedAt DateTime?` field to models that require audit trails
- All queries on audit-critical models must include `where: { deletedAt: null }` by default

### Phone Validation
- Phone numbers should be stored in E.164 format (`+1234567890`)
- Validate format on input
- Field length in DB should be constrained via `String @db.VarChar(16)` in Prisma schema