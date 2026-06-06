---
trigger: always_on
---

# Security Rules — MediQueue

## Principles
1. **Tenant isolation is absolute** — no clinic can ever access another clinic's data
2. **Authenticate before authorizing** — verify the JWT before checking roles
3. **Fail closed** — when in doubt, deny access and log the attempt
4. **No secrets in frontend** — all sensitive logic stays server-side
5. **Sanitize all output** — never expose internal error details to clients

---

## Authentication

### JWT
- JWTs are signed with `HS256` using `process.env.JWT_SECRET` (min 32 chars)
- Token payload must include: `{ userId, clinicId, role, iat, exp }`
- Access token expiry: **1 hour**
- Refresh token expiry: **7 days**, stored in an `httpOnly` cookie
- Cookie attributes: `httpOnly`, `SameSite=Strict`, `Secure` (production only), `Path=/`
- Never store JWTs in `localStorage` — use `httpOnly` cookies only

### CSRF Protection
- The `SameSite=Strict` cookie attribute mitigates most CSRF attacks
- Additionally, validate `Origin` and `Referer` headers on state-changing requests (`POST`, `PATCH`, `DELETE`)
- Reject requests with missing or mismatched origin headers
- Do NOT rely on CSRF tokens unless SameSite is insufficient (e.g., cross-subdomain scenarios)

### Session Validation
Every protected route handler must call `requireAuth(req)` before any other logic:

```ts
// lib/auth.ts
export async function requireAuth(req: NextRequest): Promise<AuthPayload> {
  const token = req.cookies.get('session')?.value;
  if (!token) throw new UnauthorizedError('No session');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    return payload;
  } catch {
    throw new UnauthorizedError('Invalid or expired session');
  }
}
```

### Public Routes (No Auth)
ONLY these routes are exempt from authentication:
- `GET /q/[queueEntryId]` — patient queue view
- `POST /api/auth/login`
- `POST /api/auth/signup`

All other routes MUST authenticate.

---

## Authorization (Role-Based Access Control)

### Role Permissions Matrix
| Action | RECEPTIONIST | CLINIC_ADMIN |
|---|---|---|
| View dashboard | ✅ | ✅ |
| Add patient | ✅ | ✅ |
| Call next / Skip / Complete | ✅ | ✅ |
| View analytics | ✅ | ✅ |
| Create/edit queues | ❌ | ✅ |
| Manage staff | ❌ | ✅ |
| Edit clinic settings | ❌ | ✅ |
| Delete queues | ❌ | ✅ |

### Enforcement
- Role checks happen **server-side only** in route handlers
- Never use role data from request body — always from the verified JWT
- Use `requireRole(payload, minimumRole)` to check hierarchical permissions — CLINIC_ADMIN inherits all RECEPTIONIST permissions

```ts
// lib/auth.ts
const roleHierarchy: Record<Role, number> = {
  RECEPTIONIST: 0,
  CLINIC_ADMIN: 1,
};

export function requireRole(payload: AuthPayload, minimumRole: Role) {
  if (roleHierarchy[payload.role] < roleHierarchy[minimumRole]) {
    throw new ForbiddenError('Insufficient permissions');
  }
}
```

---

## Multi-Tenancy / Data Isolation

### The Golden Rule
> `clinicId` must ALWAYS come from the verified JWT, never from request parameters or body.

```ts
// ✅ Correct
const { clinicId } = await requireAuth(req);
const queues = await prisma.queue.findMany({ where: { clinicId } });

// ❌ NEVER DO THIS
const { clinicId } = await req.json();
const queues = await prisma.queue.findMany({ where: { clinicId } });
```

### Prisma Middleware (Tenancy Guard — Last Resort)
A Prisma middleware can serve as a **last-resort safety net**, but must never replace explicit `where: { clinicId }` scoping in route handlers.

The middleware guards **all mutating actions** (create, update, delete, upsert), not just create:

```ts
prisma.$use(async (params, next) => {
  const tenantModels = ['Queue', 'QueueEntry', 'QueueEvent', 'AnalyticsRecord'];

  if (tenantModels.includes(params.model ?? '')) {
    if (params.action === 'create' && !params.args.data?.clinicId) {
      throw new Error(`clinicId required for ${params.model} creation`);
    }
    if (['update', 'delete', 'updateMany', 'deleteMany'].includes(params.action)) {
      if (!params.args.where?.clinicId) {
        throw new Error(`clinicId required in where clause for ${params.model} ${params.action}`);
      }
    }
  }
  return next(params);
});
```

> **Note**: Middleware can still be bypassed via `$queryRaw`. Always prefer explicit `where: { clinicId }` at the route level.

---

## Input Validation

- Validate ALL incoming request bodies before touching the database
- Use [Zod](https://zod.dev) for schema validation on all API routes
- Reject requests with unexpected fields (strict mode)
- Sanitize string inputs: trim whitespace, limit lengths

```ts
// Example: Add Patient validation
const addPatientSchema = z.object({
  patientName: z.string().min(1).max(100).trim(),
  phone: z.string().max(20).optional(),
  queueId: z.string().cuid(),
});
```

---

## Password Security

- Hash passwords with **bcryptjs**, minimum cost factor 12
- Never log, return, or store plaintext passwords
- Never return `passwordHash` in any API response — use Prisma `select` to exclude it
- Enforce minimum password length of 8 characters

```ts
// ✅ Sign-in: select passwordHash only for verification, then discard
const user = await prisma.user.findUnique({
  where: { email },
  select: { id: true, clinicId: true, role: true, passwordHash: true },
});
if (!user) throw new UnauthorizedError('Invalid credentials');
const valid = await bcrypt.compare(password, user.passwordHash);
if (!valid) throw new UnauthorizedError('Invalid credentials');

// ✅ All subsequent queries: exclude passwordHash
const safeUser = await prisma.user.findUnique({
  where: { id: user.id },
  select: { id: true, email: true, clinicId: true, role: true, createdAt: true },
});
```

---

## Error Handling & Information Leakage

```ts
// ✅ Safe error response
return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });

// ❌ NEVER expose internals
return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
```

- Log full error details **server-side only** with `console.error` (or structured logger)
- Return only generic messages to the client for 500-level errors
- For 400-level errors, return helpful but non-sensitive messages
- Never expose: DB query details, file paths, library versions, internal IDs in error messages

---

## HTTP Security Headers
Set the following headers via `next.config.js` or middleware:

```ts
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
}
```

---

## CORS

- Configure CORS via Next.js middleware or `next.config.js`
- In development, allow `http://localhost:3000` (or the dev server origin)
- In production, restrict to the app's canonical domain only — no wildcards
- For WebSocket connections, match the same origin policy
- Never set `Access-Control-Allow-Origin: *` on routes that handle cookies or JWTs

---

## WebSocket Security

- WS connections must present a valid JWT on handshake
- After auth, extract `clinicId` and join only the clinic's room
- Server must validate `clinicId` on every event, not just at connection time
- Never broadcast events across clinic boundaries
- Rate-limit WS connections per IP to prevent abuse

---

## General API Security
- All API endpoints (except public `/q/` and auth routes) MUST enforce rate limiting — see Operations section in `architecture.md`
- Never use Prisma's `$queryRaw` or `$executeRawUnsafe` with user-supplied input; always use the type-safe Prisma Client API
- All production traffic must be served over HTTPS — enforce via `next.config.js` redirect rules or reverse proxy
- Log security-relevant events: failed login attempts, unauthorized access attempts (401/403), and role changes

---

## Environment Variables

Required secrets (never commit these):
```
DATABASE_URL=             # PostgreSQL connection string
JWT_SECRET=               # Min 32-character random string
NEXTAUTH_SECRET=          # If using NextAuth
```

Rules:
- All secrets via environment variables only — never hardcoded
- `.env.local` is gitignored, always
- Use `process.env.VARIABLE!` with TypeScript non-null assertion only after validating at startup
- Add a startup check that throws if required env vars are missing