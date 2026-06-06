---
name: component-builder
description: >
  Use this skill when building any React component for MediQueue. Covers
  dashboard panels, queue cards, modals, status badges, action buttons, and
  the public patient view. Enforces the MediQueue design system, TypeScript
  strict mode, and Next.js App Router patterns (Server vs Client components).
---

# Skill: Component Builder

## When to Use This Skill
Activate this skill any time you are asked to create or modify a React component in MediQueue. This includes:
- Dashboard panels (queue list, live status, queue switcher)
- Queue entry cards and action buttons
- Modals (Add Patient, Confirm actions)
- Status badges, indicators, loading states
- The public patient view (`/q/[queueEntryId]`)
- Shared UI primitives (`Button`, `Badge`, `Modal`, `Spinner`)

---

## Step 1 — Classify the Component

Before writing any code, determine:

| Question | Determines |
|---|---|
| Does it need state, effects, or event handlers? | `"use client"` directive required |
| Does it subscribe to WebSocket events? | `"use client"` + `useQueueSync` hook |
| Does it fetch data directly (no interactivity)? | Server Component — no directive needed |
| Is it a shared primitive (Button, Badge, etc.)? | Goes in `components/ui/` |
| Is it dashboard-specific? | Goes in `components/dashboard/` |
| Is it queue-related but shared? | Goes in `components/queue/` |

---

## Step 2 — File Setup

```
components/
  ui/             ← Button, Badge, Modal, Spinner, Input
  dashboard/      ← QueuePanel, LiveStatusPanel, QueueSwitcher, ActionsBar
  queue/          ← QueueEntryCard, PatientAddModal, QueueNumberDisplay
```

**File naming:** PascalCase, `.tsx` extension
**Export:** Named export (not default), e.g. `export function QueueEntryCard(...)`
**Prerequisite:** Verify `tailwind.config.ts` maps design system CSS variables to Tailwind color names (`primary`, `surface`, `border`, `text-primary`, etc.) — otherwise classes like `bg-primary` won't resolve

---

## Step 3 — Component Template

```tsx
// components/queue/QueueEntryCard.tsx
"use client"; // only if interactive

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { QueueEntry } from "@/types";

// 1. Props interface — always named [ComponentName]Props
interface QueueEntryCardProps {
  entry: QueueEntry;
  onCall: (id: string) => void;
  onSkip: (id: string) => void;
  isLoading?: boolean;
}

// 2. Component function — named export
export function QueueEntryCard({
  entry,
  onCall,
  onSkip,
  isLoading = false,
}: QueueEntryCardProps) {
  // 3. Hooks first
  const [isActing, setIsActing] = useState(false);

  // 4. Handlers
  async function handleCall() {
    try {
      setIsActing(true);
      await onCall(entry.id);
    } catch {
      // Error handled by parent or toast
    } finally {
      setIsActing(false);
    }
  }

  // 5. Render
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface border border-border p-4 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono text-2xl font-bold text-text-primary">
          #{String(entry.queueNumber).padStart(3, "0")}
        </span>
        <div className="min-w-0">
          <p className="text-base font-medium text-text-primary truncate">
            {entry.patientName}
          </p>
          <Badge status={entry.status} />
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button
          variant="primary"
          onClick={handleCall}
          disabled={isLoading || isActing}
          aria-label={`Call patient ${entry.patientName}`}
        >
          Call
        </Button>
        <Button
          variant="secondary"
          onClick={() => onSkip(entry.id)}
          disabled={isLoading || isActing}
          aria-label={`Skip patient ${entry.patientName}`}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
```

---

## Step 4 — Design System Checklist

Apply these rules from `design-system.md`:

- [ ] Colors use CSS variables (via Tailwind config), not hardcoded hex
- [ ] Touch targets minimum 44px height for interactive elements
- [ ] Font classes: `font-mono` for queue numbers, `font-display` for headings, `font-body` for body text
- [ ] Status badge uses `<Badge status={...} />` component, not inline styling
- [ ] No inline `style={{}}` — Tailwind only
- [ ] Mobile-first: test at 375px width first, then expand
- [ ] Form inputs use Zod validation schema — validate on submit, show inline errors per field

---

## Step 5 — Real-Time Components

For components that must reflect live queue state, use the `useQueueSync` hook:

```tsx
"use client";

import { useQueueSync } from "@/lib/hooks/useQueueSync";

export function ActiveQueuePanel({ queueId }: { queueId: string }) {
  const { entries, isConnected, error } = useQueueSync(queueId);

  if (error) return <QueueErrorState message={error} />;

  return (
    <div>
      {!isConnected && <OfflineBanner />}
      {entries.map((entry) => (
        <QueueEntryCard key={entry.id} entry={entry} ... />
      ))}
      {entries.length === 0 && <EmptyQueueState />}
    </div>
  );
}
```

---

## Step 6 — Error & Loading States

Every data-dependent component must handle three states:

```tsx
// Loading
if (isLoading) return <Spinner label="Loading queue..." />;

// Error
if (error) return <ErrorState message="Unable to load queue. Please refresh." />;

// Empty
if (entries.length === 0) return <EmptyState message="No patients currently waiting." />;

// Data
return <QueueList entries={entries} />;
```

---

## Step 7 — Accessibility Checklist

- [ ] All buttons have `aria-label` if icon-only
- [ ] Focus rings visible (`focus:ring-2 focus:ring-primary`)
- [ ] `disabled` attribute set when actions are loading
- [ ] Color is NOT the only visual indicator (pair with text or icon)
- [ ] Keyboard navigable (Tab through actions, Enter to confirm)

---

## Common Components Reference

| Component | Location | Purpose |
|---|---|---|
| `<Badge status />` | `components/ui/Badge.tsx` | Queue entry status pill |
| `<Button variant size />` | `components/ui/Button.tsx` | All clickable actions |
| `<Modal>` | `components/ui/Modal.tsx` | Add Patient, confirmations |
| `<Spinner label />` | `components/ui/Spinner.tsx` | Loading states |
| `<OfflineBanner />` | `components/ui/OfflineBanner.tsx` | WS disconnect indicator |
| `<QueueEntryCard />` | `components/queue/QueueEntryCard.tsx` | Single patient in queue |
| `<QueueSwitcher />` | `components/dashboard/QueueSwitcher.tsx` | Tab strip for queues |
| `<LiveStatusPanel />` | `components/dashboard/LiveStatusPanel.tsx` | Now serving + stats |
| `<ActionsBar />` | `components/dashboard/ActionsBar.tsx` | Call Next / Add Patient |

---

## Step 8 — Testing

- Write a test file alongside each component: `ComponentName.test.tsx`
- Test three states: render with data, render loading skeleton, render empty state
- Use `@testing-library/react` — prefer `getByRole` and `findByText` over test IDs
- For interactive components, test the callback: simulate click, assert the handler was called
- See Testing Conventions in `code-style.md` for full guidelines
