---
name: db-migration-runner
description: >
  Use this skill whenever modifying the Prisma schema or running database
  migrations in MediQueue. Covers schema changes, migration creation,
  applying migrations, seeding, and rollback strategies. Enforces
  multi-tenant safety and zero-downtime migration patterns.
---

# Skill: DB Migration Runner

## When to Use This Skill
Activate this skill any time you are asked to:
- Add, modify, or remove a model in `prisma/schema.prisma`
- Add fields, indexes, or relations to existing models
- Run `prisma migrate dev` or `prisma migrate deploy`
- Seed the database with initial data
- Rename or transform existing data
- Troubleshoot Prisma/PostgreSQL connection issues

---

## Step 1 — Schema Change Protocol

### Before Editing the Schema

1. **Read the current schema** in full: `cat prisma/schema.prisma`
2. **Check existing migrations**: `ls prisma/migrations/` to understand history
3. **Identify impact**: Is this additive (safe) or destructive (risky)?

| Change Type | Risk | Strategy |
|---|---|---|
| Add new model | Low | Add and migrate |
| Add nullable column | Low | Add and migrate |
| Add non-null column without default | High | Provide default or migrate in two steps |
| Rename column | High | Use two-step: add new → backfill → remove old |
| Delete column | High | Verify no code references it first |
| Change column type | High | Multi-step migration |
| Add index | Low | Add and migrate |

---

## Step 2 — Making Schema Changes

### Editing `prisma/schema.prisma`

Always follow this ordering within each model:
1. `id` field
2. Foreign key fields (`clinicId`, `queueId`, etc.)
3. Required scalar fields
4. Optional scalar fields
5. Enum fields (defaults first, then without)
6. Timestamps (`createdAt`, `updatedAt`)
7. Relations (always last)

```prisma
// ✅ Correct model structure
model QueueEntry {
  id          String      @id @default(cuid())
  queueId     String                              // FK first
  patientName String                              // required scalars
  phone       String?                             // optional scalars
  queueNumber Int
  status      EntryStatus @default(WAITING)       // enums with defaults
  position    Int
  createdAt   DateTime    @default(now())         // timestamps
  updatedAt   DateTime    @updatedAt
  queue       Queue       @relation(fields: [queueId], references: [id], onDelete: Cascade)  // relations last
}
```

### Required Indexes
Always add indexes for fields used in `where` clauses:

```prisma
model QueueEntry {
  // ... fields ...

  @@index([queueId])           // most common filter
  @@index([status])            // queue operations filter by status
  @@index([queueId, status])   // compound: active entries per queue
  @@index([createdAt])         // analytics time-range queries
}

model Queue {
  @@index([clinicId])          // tenant isolation — on every tenant model
  @@index([clinicId, status])  // active queues per clinic
}
```

---

## Step 3 — Running Migrations

### Development Environment
```bash
# 0. Validate schema before creating a migration
npx prisma validate
npx prisma format

# 1. Generate migration SQL (two options):
#    Option A: create + apply in one step (quick iteration)
npx prisma migrate dev --name <descriptive-name>

#    Option B: create only — review SQL, then apply manually (safer for complex changes)
npx prisma migrate dev --create-only --name <descriptive-name>
npx prisma migrate deploy

# Naming convention: <verb>_<model>_<change>
# Examples:
#   add_queue_entry_indexes
#   add_analytics_record_model
#   add_updated_at_to_queue_entry
#   remove_deprecated_position_field

# 2. Regenerate the Prisma Client
npx prisma generate

# 3. Review the migration SQL before committing (always)
cat prisma/migrations/<latest>/migration.sql

# 4. Verify migration results visually (optional but recommended)
npx prisma studio
```

### Production Environment
```bash
# NEVER use migrate dev in production
# Use migrate deploy — applies pending migrations only, no schema drift detection

npx prisma migrate deploy
npx prisma generate
```

### CI/CD Pipeline Integration
- Run `npx prisma migrate deploy` as a pre-deployment step — before the new app version starts
- Run `npx prisma generate` during the build step (not at runtime)
- Set `DATABASE_URL` as a CI/CD secret — never hardcode it in pipeline config
- For concurrent deployments, Prisma uses advisory locks; if a migration times out, increase `statement_timeout` in PostgreSQL or retry
- Add a smoke test after deployment to verify the database is reachable and all migrations applied

---

## Step 4 — Multi-Tenant Safety Checks

Before running any migration that touches tenant data models, verify:

- [ ] New columns on tenant models have a default value OR are nullable
- [ ] No migration drops `clinicId` from any model that had it
- [ ] Backfill scripts for new required fields are prepared
- [ ] Indexes on `clinicId` are present on all new tenant models

**Tenant models** (must always have `clinicId`):
- `Queue`
- `QueueEntry`
- `QueueEvent`
- `AnalyticsRecord`

---

## Step 5 — Seeding

### Seed File Location
`prisma/seed.ts`

### Configuration
Ensure `package.json` has a `prisma.seed` entry:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```
If using `tsx` instead of `ts-node`, use: `"seed": "tsx prisma/seed.ts"`

### Running Seeds
```bash
npx prisma db seed
```

### Seed Structure for MediQueue
```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create demo clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: 'demo-clinic-1' },
    update: {},
    create: { id: 'demo-clinic-1', name: 'MediQueue Demo Clinic' },
  });

  // 2. Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      clinicId: clinic.id,
      email: 'admin@demo.com',
      passwordHash: await bcrypt.hash('Demo1234!', 12),
      role: 'CLINIC_ADMIN',
    },
  });

  // 3. Create default queues
  const queueNames = ['General Consultation', 'Pediatrics', 'Dental', 'Pharmacy'];
  const queueIds: string[] = [];
  for (const name of queueNames) {
    const id = `demo-queue-${name.toLowerCase().replace(/ /g, '-')}`;
    queueIds.push(id);
    await prisma.queue.upsert({
      where: { id },
      update: {},
      create: { id, clinicId: clinic.id, name, status: 'ACTIVE' },
    });
  }

  // 4. Add demo patients to the first queue
  const demoPatients = [
    { name: 'John Adeyemi', phone: '+2348012345678' },
    { name: 'Sarah Okafor', phone: '+2348023456789' },
    { name: 'Emeka Nwosu', phone: null },
    { name: 'Funmi Adebayo', phone: '+2348034567890' },
  ];
  for (let i = 0; i < demoPatients.length; i++) {
    await prisma.queueEntry.create({
      data: {
        queueId: queueIds[0],
        patientName: demoPatients[i].name,
        phone: demoPatients[i].phone,
        queueNumber: i + 1,
        position: i + 1,
        status: i === 0 ? 'SERVING' : 'WAITING',
      },
    });
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

---

## Step 6 — Troubleshooting

### Common Issues

**"Table already exists" / migration out of sync**
```bash
# Reset dev database (DESTROYS ALL DATA — dev only)
npx prisma migrate reset

# Or mark a migration as already applied
npx prisma migrate resolve --applied <migration_name>
```

**"Can't reach database server"**
- Check `DATABASE_URL` in `.env.local`
- Verify PostgreSQL is running: `pg_isready`
- For Docker: `docker ps` and check container health

**Prisma Client out of date after schema change**
```bash
npx prisma generate
# Then restart the Next.js dev server
```

**Shadow database issues (dev)**
```
# Ensure your DB user has permission to create databases
# Or set shadowDatabaseUrl in the datasource block of schema.prisma:
#
#   datasource db {
#     provider          = "postgresql"
#     url               = env("DATABASE_URL")
#     shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
#   }
```

**Production migration rollback**
```
# If a migration was deployed and needs to be reverted:
# 1. Mark it as rolled back in the migration tracking table
npx prisma migrate resolve --rolled-back <migration_name>

# 2. Manually revert the SQL changes (write a down-migration script)
#    Prisma does NOT auto-generate rollback SQL — you must write it.

# 3. Deploy the fix as a new forward migration
npx prisma migrate deploy
```

---

## Step 7 — Migration Checklist

Before committing a migration:

- [ ] Migration name is descriptive and follows naming convention
- [ ] `migration.sql` reviewed — no unexpected DROP statements
- [ ] Prisma Client regenerated (`prisma generate`)
- [ ] Seed still runs cleanly (`prisma db seed`)
- [ ] New indexes added for all FK and filter fields
- [ ] All tenant models retain `clinicId` with index
- [ ] No nullable-to-required changes without a default
- [ ] TypeScript types still compile (`tsc --noEmit`)
