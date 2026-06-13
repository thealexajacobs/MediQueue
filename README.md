# MediQueue

Real-time, multi-tenant SaaS clinic queue management system.

Built with Next.js 15, PostgreSQL, Prisma, Socket.IO, and Tailwind CSS.

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in DATABASE_URL and JWT_SECRET (min 32 chars)

# 3. Start PostgreSQL and create database
createdb mediqueue

# 4. Run database migrations
npx prisma migrate dev

# 5. Generate Prisma client
npx prisma generate

# 6. Seed the database
npx prisma db seed

# 7. Start Socket.IO server (separate terminal)
cd socket-server
npm install
npm run dev

# 8. Start the Next.js dev server
npm run dev
```

Demo credentials after seeding:
- Admin: `admin@demo.com` / `Demo1234!`
- Receptionist: `reception@demo.com` / `Demo1234!`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Min 32-character random string |
| `AUTH_URL` | No | Defaults to `http://localhost:3000` |
| `SOCKET_SERVER_URL` | No | Defaults to `http://localhost:3001` |
| `UPSTASH_REDIS_REST_URL` | No | Rate limiting (Upstash Redis) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting (Upstash Redis) |

---

## Architecture

### Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5 (Auth.js) with JWT strategy
- **Real-time**: Socket.IO (separate server on Railway/Fly/Render)
- **State**: TanStack Query (server) + Zustand (client)
- **Styling**: Tailwind CSS 3+
- **Validation**: Zod + React Hook Form

### Folder Structure
```
app/              # Next.js App Router pages and API routes
components/       # React components
  ui/             # Shared primitives (Button, Badge, Dialog, Spinner)
  dashboard/      # Dashboard-specific components
  queue/          # Queue-related components
features/         # Feature-based organization
  auth/           # Authentication
  queues/         # Queue management
  queue-entries/  # Patient queue operations
  analytics/      # Analytics and metrics
lib/              # Shared utilities (Prisma, auth, socket, env)
prisma/           # Schema, migrations, seed
socket-server/    # Standalone Socket.IO server
types/            # Shared TypeScript types
```

### Real-Time Architecture
```
[Next.js on Vercel] ──emit events──► [Socket.IO server on Railway/Fly/Render]
[Browser clients]   ◄──subscribe────  [Socket.IO server on Railway/Fly/Render]
```

---

## Running Tests

```bash
# Unit + integration tests
npm test

# End-to-end tests
npm run test:e2e

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Deployment

### Vercel (Next.js App)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# DATABASE_URL, JWT_SECRET, AUTH_URL, SOCKET_SERVER_URL
```

### Socket.IO Server (Railway/Fly/Render)

```bash
cd socket-server

# Deploy to Railway:
railway up

# Set env: PORT (default 3001), CORS_ORIGIN (your Vercel domain)
```

---

## License

Private — internal use only.
