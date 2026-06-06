---
trigger: always_on
---

# Code Style Rules — MediQueue

## Language & Runtime
- TypeScript **strict mode** everywhere (`"strict": true` in tsconfig)
- No `any` types — use `unknown` and narrow, or define proper interfaces
- No `@ts-ignore` or `@ts-expect-error` unless absolutely unavoidable (must leave a comment explaining why)
- Environment variables accessed server-side via `process.env`; client-side vars must have `NEXT_PUBLIC_` prefix
- Validate all required env vars at startup via `lib/env.ts`

---

## File & Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `QueueEntryCard.tsx` |
| Hooks | camelCase with `use` prefix | `useQueueSync.ts` |
| Utilities/helpers | camelCase | `formatQueueNumber.ts` |
| API routes | kebab-case folders | `queue-entries/route.ts` |
| Types/interfaces | PascalCase | `QueueEntry`, `ClinicUser` |
| Enums | PascalCase | `EntryStatus.WAITING` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_QUEUE_SIZE` |
| DB model files | camelCase | `prisma.ts` |

---

## Component Rules

### Structure (order within a file)
1. Imports (external → internal → types → styles)
2. Types/interfaces local to the file
3. Constants
4. Component function
5. Sub-components (if small and tightly coupled)
6. Exports

### Component Guidelines
- Prefer **Server Components** by default in Next.js App Router
- Only use `"use client"` when you need: state, effects, browser APIs, event handlers, or WebSocket subscriptions
- Props interfaces must be named `[ComponentName]Props`
- Destructure props in the function signature
- No inline styles — use Tailwind classes only
- No magic numbers — extract to named constants
- Always use named exports (`export function`) — never `export default`

```tsx
// ✅ Good
interface QueueEntryCardProps {
  entry: QueueEntry;
  onCall: (id: string) => void;
}

export function QueueEntryCard({ entry, onCall }: QueueEntryCardProps) {
  return (...)
}

// ❌ Bad
export default function card(props: any) {
  return <div style={{ marginTop: '12px' }}>...</div>
}
```

---

## Tailwind / CSS Conventions

- Install and configure `prettier-plugin-tailwindcss` for automatic class sorting (layout → typography → color → spacing)
- Use `clsx` or `tailwind-merge` (`twMerge`) for conditional class merging
- Define repeated class patterns via `@apply` in a `globals.css` `@layer` only
- Prefer Tailwind design tokens over arbitrary values (e.g., `w-8` over `w-[32px]`)
- Mobile-first responsive design using `sm:`, `md:`, `lg:`, `xl:` prefixes
- No custom CSS files unless absolutely necessary — use Tailwind utilities exclusively

---

## API Route Rules

- Every route handler must be typed with `NextRequest` and return `NextResponse`
- Always wrap handlers in try/catch
- Never expose raw error messages or stack traces to the client
- Validate all inputs before touching the database
- Use HTTP status codes correctly: `200`, `201`, `400`, `401`, `403`, `404`, `500`

```ts
// ✅ Correct pattern
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId } = await requireAuth(req); // always authenticate first

    // validate input
    if (!body.patientName) {
      return NextResponse.json({ error: 'patientName is required' }, { status: 400 });
    }

    const entry = await prisma.queueEntry.create({ ... });
    return NextResponse.json({ data: entry }, { status: 201 });

  } catch (err) {
    logger.error({ err, route: 'queue-entries/POST' });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

---

## Data Fetching (App Router)

- Prefer Server Components for data fetching — fetch directly in `async` page/layout components
- Client-side data fetching goes through React Query, SWR, or `useEffect` + `useReducer`
- Use Next.js `loading.tsx` for streaming fallback UI during data fetch
- Never fetch inside a layout unless the data is needed by every child page
- Co-locate `fetch` calls with the component that consumes the data
- Use Next.js `fetch` extensions (`next: { revalidate }`, `cache: 'force-cache'`) for caching strategy

---

## Prisma / Database Rules

- Always use the shared Prisma client from `lib/prisma.ts` — never instantiate a new one
- All queries on tenant data must include `clinicId` in the `where` clause
- Use `select` to return only the fields the client needs — never return `passwordHash`
- Wrap multi-step operations in `prisma.$transaction()`
- Add indexes for: `clinicId`, `queueId`, `status`, `createdAt` on frequently queried models

```ts
// ✅ Good — scoped, selective
const entries = await prisma.queueEntry.findMany({
  where: { queueId, queue: { clinicId } },
  select: { id: true, patientName: true, queueNumber: true, status: true, position: true },
  orderBy: { position: 'asc' },
});

// ❌ Bad — unscoped, returns everything
const entries = await prisma.queueEntry.findMany();
```

---

## Error Handling

- Use a consistent error response shape: `{ error: string, code?: string }`
- Define custom error classes in `lib/errors.ts` for domain errors (e.g., `QueueClosedError`, `UnauthorizedError`)
- Always log errors server-side with context: `[route] [method]` prefix
- Never `console.log` in production — use a structured logger

---

## Testing Conventions

- Use **Vitest** as the test runner (matching Next.js ecosystem preference)
- Co-locate test files with the module they test: `ComponentName.test.tsx`
- Structure tests with `describe` / `it` blocks
- Use `@testing-library/react` for component tests — prefer `getByRole` and `findByText` over test IDs
- API routes: import handler functions directly and test them
- Every custom hook must have at least one test covering: happy path, error state, and cleanup
- Mock external services (Prisma, WebSocket) — never hit real databases in tests

---

## Hooks & State

### General Rules
- Co-locate hooks with the components that use them unless reused in 2+ places
- Prefix all custom hooks with `use`
- No business logic inside components — extract to hooks or `lib/` utilities
- Use `useReducer` for complex queue state management — avoid chains of `useState`
- Always satisfy the `exhaustive-deps` ESLint rule — never suppress it without a documented reason

### WebSocket Hook Pattern
- Extract WebSocket connections into dedicated hooks (e.g., `useQueueSubscription`)
- Hooks must handle: connect, disconnect on unmount, automatic reconnection with exponential backoff, and message type filtering
- WS hooks should return `{ data, error, isConnected }` as their public interface
- Never open a raw WebSocket inside a component — always wrap in a hook

```ts
// ✅ Pattern
function useQueueSubscription(queueId: string) {
  const [state, setState] = useState<WSState>({
    data: null, error: null, isConnected: false,
  });

  useEffect(() => {
    const ws = new WebSocket(`/api/ws?queueId=${queueId}`);
    ws.onmessage = (event) => { /* ... */ };
    return () => ws.close();
  }, [queueId]);

  return state;
}
```

---

## Imports

- Use absolute imports via `@/` alias (maps to `./`, configured via `paths` in `tsconfig.json`)
  - `@/components` → `components/`
  - `@/lib` → `lib/`
  - `@/types` → `types/`
  - `@/app` → `app/`
- Group imports: (1) React/Next, (2) third-party, (3) internal `@/`, (4) types
- No wildcard imports (`import * as`)

```ts
// ✅ Correct
import { useState } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { QueueEntry } from '@/types';
```

---

## Accessibility

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<section>`, `<article>`) — avoid `<div>` for interactive elements
- All interactive elements must be keyboard accessible (focus visible, Enter/Space to activate)
- Use `aria-label`, `aria-labelledby`, or `aria-describedby` where visual labels are insufficient
- Modals and dialogs must trap focus while open and restore focus on close
- Color must never be the sole means of conveying information
- Use Tailwind's `focus-visible:` ring utilities for visible focus indicators
- Run `@axe-core/react` in development to catch a11y violations early

---

## Comments & Documentation

- No commented-out code in commits
- Write JSDoc for all exported functions in `lib/`
- Inline comments only for non-obvious logic — don't narrate what the code does
- TODO comments must include a ticket/issue reference: `// TODO(#42): add retry logic`