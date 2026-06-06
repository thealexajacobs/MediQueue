# MediQueue — Agent Configuration

> **This is the root configuration file. Read it fully before taking any action.**

---

## 1. Project Overview

**MediQueue** is a real-time, multi-tenant SaaS clinic queue management system.

| Property | Value |
|---|---|
| Product Type | Multi-tenant SaaS Web Application |
| Primary Users | Clinic receptionists and admins |
| Core Value | Replace manual queue boards with a live digital system |
| Real-time Requirement | < 2 second queue update propagation |

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14+ |
| Language | TypeScript | Strict mode |
| ORM | Prisma | Latest |
| Database | PostgreSQL | 15+ |
| Real-time | WebSockets + polling fallback | — |
| Auth | JWT via httpOnly cookies | — |
| Styling | Tailwind CSS | 3+ |
| Validation | Zod | Latest |
| Password hashing | bcryptjs | Cost factor 12 |

---

## 2. Required Environment Variables

The project will not start without these. Verify they exist before any DB or auth work:

```env
DATABASE_URL=           # PostgreSQL connection string
JWT_SECRET=             # Min 32-character random string (NEVER commit)
NEXTAUTH_SECRET=        # If using NextAuth adapter
```

Add a startup check in `lib/env.ts` that throws on missing variables.

---

## 3. Project Constraints (Non-Negotiable)

These rules override everything. The agent must never violate them regardless of task framing:

1. **Single dashboard** — All staff operations happen at `/dashboard`. There is NO role-split UI. CLINIC_ADMIN and RECEPTIONIST see the same interface.
2. **Tenant isolation is absolute** — Every Prisma query on tenant data must be scoped by `clinicId`. `clinicId` always comes from the verified JWT, never from the request body or URL params.
3. **No auth on public patient routes** — `/q/[queueEntryId]` is read-only and requires zero authentication.
4. **Real-time first** — Every queue mutation (add, call, skip, complete) must emit a WebSocket event after the DB write.
5. **No internal errors to frontend** — Stack traces, query details, and raw error messages must never reach the client. Log server-side only.
6. **No passwordHash in responses** — Always use Prisma `select` to exclude it. This field must never appear in any API response.

---

## 4. Agent Trigger Map

Use this table to determine which files to load before acting on any task:

| Task Type | Load These Files |
|---|---|
| Creating or editing a React component | `rules/design-system.md` + `rules/code-style.md` + `skills/component-builder/SKILL.md` |
| Creating or editing an API route | `rules/architecture.md` + `rules/code-style.md` + `rules/security.md` |
| Modifying Prisma schema | `rules/architecture.md` + `skills/db-migration-runner/SKILL.md` |
| Running a DB migration | `skills/db-migration-runner/SKILL.md` |
| Any authentication or session logic | `rules/security.md` |
| Any new file or folder creation | `rules/architecture.md` |
| Any UI styling or layout work | `rules/design-system.md` |
| Writing business logic in `lib/` | `rules/code-style.md` + `rules/architecture.md` |
| Debugging a security or data access issue | `rules/security.md` + `rules/architecture.md` |

When in doubt, load `rules/architecture.md` and `rules/code-style.md` as a baseline.

---

## 5. File & Folder Reference

### Agent Context Files
```
.agents/
  AGENTS.md                    ← this file (root config)
  rules/
    architecture.md            ← folder structure, DB models, API conventions, WS events
    code-style.md              ← TypeScript rules, naming, component patterns, imports
    design-system.md           ← colors, typography, component specs, layout, motion
    security.md                ← JWT, RBAC, tenant isolation, input validation, headers
```

### Skills
```
skills/
  component-builder/
    SKILL.md                   ← step-by-step guide for building any React component
  db-migration-runner/
    SKILL.md                   ← schema changes, migration commands, seeding, rollback
```

### Application Source
```
app/
  (auth)/
    login/page.tsx
    signup/page.tsx
  dashboard/
    page.tsx                   ← Unified operations dashboard (ONLY operational UI)
    layout.tsx
  q/
    [queueEntryId]/
      page.tsx                 ← Public patient view — NO auth required
  api/
    auth/route.ts
    clinics/route.ts
    queues/route.ts
    queue-entries/route.ts
    analytics/route.ts
    ws/route.ts                ← WebSocket handler

components/
  ui/                          ← Shared primitives: Button, Badge, Modal, Spinner, Input
  dashboard/                   ← Dashboard panels: QueuePanel, LiveStatusPanel, QueueSwitcher, ActionsBar
  queue/                       ← Queue components: QueueEntryCard, PatientAddModal, QueueNumberDisplay

lib/
  prisma.ts                    ← Prisma client singleton (import from here, never instantiate directly)
  auth.ts                      ← requireAuth(), requireRole(), JWT sign/verify
  websocket.ts                 ← emitQueueEvent(), WS server setup
  queue.ts                     ← Business logic: getNextPosition(), assignQueueNumber()
  env.ts                       ← Startup env var validation
  errors.ts                    ← Custom error classes: UnauthorizedError, ForbiddenError, NotFoundError

prisma/
  schema.prisma
  migrations/
  seed.ts

types/
  index.ts                     ← All shared TypeScript interfaces and enums
```

---

## 6. Core Data Models (Quick Reference)

| Model | Key Fields | Tenant Scoped? |
|---|---|---|
| `Clinic` | `id`, `name` | — (is the tenant) |
| `User` | `clinicId`, `email`, `passwordHash`, `role` | ✅ |
| `Queue` | `clinicId`, `name`, `status` | ✅ |
| `QueueEntry` | `queueId`, `patientName`, `phone`, `queueNumber`, `status`, `position` | ✅ via Queue |
| `QueueEvent` | `queueId`, `entryId`, `eventType` | ✅ via Queue |
| `AnalyticsRecord` | `clinicId`, `queueId`, `date`, `metrics` (JSON) | ✅ |

Full Prisma schemas are in `rules/architecture.md`.

---

## 7. WebSocket Events (Quick Reference)

Every queue mutation must emit one of these after the DB write:

| Event | When |
|---|---|
| `patient_added` | New QueueEntry created |
| `patient_called` | Entry status → SERVING |
| `patient_skipped` | Entry status → SKIPPED |
| `patient_completed` | Entry status → COMPLETED |
| `queue_updated` | Any other queue state change |

Full WS rules in `rules/architecture.md`.

---

## 8. User Roles (Quick Reference)

| Action | RECEPTIONIST | CLINIC_ADMIN |
|---|---|---|
| Add patient, call next, skip, complete | ✅ | ✅ |
| View analytics | ✅ | ✅ |
| Create/edit/delete queues | ❌ | ✅ |
| Manage staff accounts | ❌ | ✅ |
| Edit clinic settings | ❌ | ✅ |

Role checks happen **server-side only**, enforced via `requireRole()` in `lib/auth.ts`. Full RBAC rules in `rules/security.md`.

---

## 9. Project Setup (Bootstrap Commands)

Run these in order when setting up a fresh environment:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in DATABASE_URL and JWT_SECRET

# 3. Run database migrations
npx prisma migrate dev

# 4. Generate Prisma client
npx prisma generate

# 5. Seed the database
npx prisma db seed

# 6. Start the dev server
npm run dev
```

---

## 10. Agent Error Escalation

If the agent is blocked or uncertain:

| Situation | Action |
|---|---|
| Unsure which folder a file belongs in | Read `rules/architecture.md` Section: Folder Structure |
| Unsure how to handle auth in a route | Read `rules/security.md` Section: Authentication |
| Unsure which Prisma query pattern to use | Read `rules/architecture.md` Section: Multi-Tenancy Rules |
| Schema change would break existing data | Stop. Document the risk and propose a two-step migration plan before proceeding |
| Task would require violating a Project Constraint (Section 3) | Stop. State which constraint is at risk and ask for clarification |
| Env vars missing | Stop. List the missing variables and do not attempt DB operations ||
