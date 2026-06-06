---
trigger: always_on
---

# Design System Rules — MediQueue

## Design Philosophy
MediQueue is a **speed-first, operational interface** for clinic receptionists under pressure.
Every design decision must serve:
1. **Clarity** — staff know exactly what to do at a glance
2. **Speed** — core actions reachable in 1–2 clicks, no page switching
3. **Touch-friendliness** — works on tablets at a reception desk
4. **Reliability** — visual feedback on every action, clear error states

> This is NOT a consumer app. Avoid decorative UI that slows comprehension.

---

## Color Palette

```css
/* Base */
--color-bg:           #0F1117;   /* near-black background */
--color-surface:      #1A1D27;   /* card / panel surface */
--color-surface-2:    #242736;   /* elevated surface */
--color-border:       #2E3142;   /* subtle borders */

/* Text */
--color-text-primary:   #F0F2F8; /* primary text */
--color-text-secondary: #8B90A7; /* secondary / metadata */
--color-text-muted:     #555A72; /* placeholders, disabled */

/* Brand / Actions */
--color-primary:      #3B7DFF;   /* primary CTA — Call Next */
--color-primary-hover:#5491FF;
--color-success:      #22C55E;   /* completed state */
--color-warning:      #F59E0B;   /* serving / active */
--color-danger:       #EF4444;   /* skip / error */
--color-neutral:      #6B7280;   /* waiting state */

/* Status badge mapping */
--status-waiting:     var(--color-neutral);
--status-serving:     var(--color-warning);
--status-completed:   var(--color-success);
--status-skipped:     var(--color-danger);
```

---

## Typography

```css
/* Font Stack */
--font-display: 'DM Sans', sans-serif;     /* headings, queue numbers */
--font-body:    'Inter', sans-serif;        /* body, labels, inputs */
--font-mono:    'JetBrains Mono', monospace; /* queue numbers, IDs */

/* Scale */
--text-xs:   0.75rem;   /* 12px — metadata, timestamps */
--text-sm:   0.875rem;  /* 14px — secondary labels */
--text-base: 1rem;      /* 16px — body default */
--text-lg:   1.125rem;  /* 18px — card titles */
--text-xl:   1.25rem;   /* 20px — panel headers */
--text-2xl:  1.5rem;    /* 24px — section headings */
--text-3xl:  1.875rem;  /* 30px — queue number display */
--text-5xl:  3rem;      /* 48px — "Now Serving" number */

### Font Loading
- Load all fonts via `next/font` (`next/font/google` for Google-hosted, `next/font/local` for self-hosted)
- Configure DM Sans, Inter, and JetBrains Mono in `app/layout.tsx` using the `variable` export for CSS variable injection
- Do NOT use `<link>` tags or `@import` in CSS — `next/font` optimizes via preloading and eliminates layout shift

---

## Spacing System
Use Tailwind's default spacing scale. Common values:
- `p-3` (12px) — compact card padding
- `p-4` (16px) — standard card padding
- `p-6` (24px) — panel padding
- `gap-3` — between list items
- `gap-4` — between panels
- `gap-6` — between sections

---

## Visual Tokens

### Border Radius
| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Inputs, buttons |
| `rounded-md` | 6px | Cards, modals |
| `rounded-lg` | 8px | Panels, dropdowns |
| `rounded-full` | 9999px | Badges, pills |

### Elevation
- Use Tailwind shadow scale: `shadow-sm` for cards, `shadow-md` for modals/dropdowns, `shadow-lg` for overlays
- Do not define custom shadow values unless absolutely necessary

### Icons
- Use **Lucide** for all UI icons (consistent with Tailwind ecosystem)
- Import individual icons: `import { Play, X, SkipForward } from 'lucide-react'`
- No icon-only buttons without `aria-label`
- Default icon size: 16–20px; inline with text: match `currentColor`

---

## Component Specifications

### Queue Entry Card
```
┌─────────────────────────────────────────┐
│  #042          ⏱ 12 min ago             │
│  John Adeyemi                           │
│  ● WAITING                              │
│                          [Call] [Skip]  │
└─────────────────────────────────────────┘
```
- Height: min 72px, touch target minimum 44px on actions
- Status dot: 8px circle with status color
- Queue number: monospace, bold, `text-2xl`
- Actions only visible on hover (desktop) or always visible (mobile/tablet)

### Primary CTA — "Call Next"
```
┌──────────────────────────┐
│    ▶  Call Next Patient  │
└──────────────────────────┘
```
- Full-width on mobile
- Min height: 52px
- Background: `--color-primary`
- Font: `text-lg`, `font-semibold`
- Always visible, never hidden behind scroll

### Status Badge
```tsx
<Badge status="WAITING" />    // grey pill
<Badge status="SERVING" />    // amber pill
<Badge status="COMPLETED" />  // green pill
<Badge status="SKIPPED" />    // red pill
```
- Pill shape, `px-2.5 py-0.5 rounded-full`
- Font: `text-xs font-medium uppercase tracking-wide`

### Add Patient Modal
- Full-screen on mobile, centered modal on desktop
- Max width: 480px
- Fields: Patient Name (required), Phone (optional)
- Submit on Enter key
- Auto-focus on patient name field on open
- Loading state on submit button

### Queue Switcher
- Horizontal tab strip at top of dashboard
- Active tab: `--color-primary` underline, `text-primary`
- Badge showing waiting count per queue
- Scrollable horizontally on mobile

### Button
| Variant | Background | Text | Hover | Usage |
|---|---|---|---|---|
| Primary | `--color-primary` | White | `--color-primary-hover` | Call Next, Submit |
| Secondary | Transparent + `--color-border` | `--color-text-primary` | `--color-surface-2` | Cancel, Skip |
| Ghost | Transparent | `--color-text-secondary` | `--color-surface` | Icon buttons, dismiss |
| Danger | `--color-danger` | White | darker shade (`opacity-90`) | Delete, force-skip |

- Min height: 44px (touch target), 36px for inline/compact variants
- Border-radius: `rounded-sm`
- Disabled state: `opacity-50`, `cursor-not-allowed`, no hover effect
- Loading state: replace text with `<Spinner />`, preserve button outer width

### Input
- Height: 44px, padding: `px-3`, border-radius: `rounded-sm`
- Border: `--color-border`, focus: `ring-2 ring-primary` with `ring-offset-2`
- Background: `--color-surface`, text: `--color-text-primary`
- Placeholder: `--color-text-muted`
- Error state: `--color-danger` border, error message below in `text-sm text-danger`
- Label: `text-sm text-secondary` above input, `mb-1` spacing

### Toast / Notification
- Position: fixed top-right on desktop, top-center on mobile
- Types: success (green `--color-success`), error (red `--color-danger`), info (blue `--color-primary`)
- Auto-dismiss after 4s for success/info; manual dismiss required for errors
- Slide-in from top, `200ms ease-out`, slide-out `150ms`
- Content: status icon + message text + optional dismiss button

---

## Layout — Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────────┐
│  MediQueue      [Queue Switcher Tabs]     [Settings] │
├──────────────────────────┬──────────────────────────┤
│                          │                          │
│   Active Queue Panel     │   Live Status Panel      │
│   (patient list)         │   Now Serving: #042      │
│                          │   Queue Length: 8        │
│                          │   Est. Wait: ~24 min     │
├──────────────────────────┴──────────────────────────┤
│  [+ Add Patient]    [▶ Call Next]   [Skip]  [Done]  │
└─────────────────────────────────────────────────────┘
```

- Actions bar is always **fixed to the bottom** on mobile
- Left panel scrolls independently; right panel is sticky
- Mobile: single column, actions bar pinned bottom

---

## Public Patient View (`/q/[id]`)

```
┌──────────────────────────┐
│       MediQueue          │
│                          │
│   Your Queue Number      │
│        #042              │
│                          │
│   Position in line       │
│          3rd             │
│                          │
│   Now Serving: #039      │
│   Est. Wait: ~9 minutes  │
│                          │
│   [●●●] Live updating    │
└──────────────────────────┘
```
- Full-screen, centered, minimal
- Queue number: `text-5xl font-bold font-mono`
- Live indicator: pulsing green dot
- No navigation, no login prompts

---

## Motion & Animation

- Queue entry additions: slide-in from bottom, `200ms ease-out`
- Queue entry completion/skip: fade + slide out, `150ms`
- "Now Serving" change: number flip animation
- Status badge changes: cross-fade `100ms`
- NO gratuitous animations — every animation must serve a functional purpose
- Respect `prefers-reduced-motion`

---

## States

### Loading (Skeleton)
- Queue list: show 3–5 skeleton cards with `animate-pulse` shimmer
- "Now Serving" panel: skeleton number block + skeleton text lines
- Buttons: show `<Spinner />` inside button, preserve original width
- Never show a full-page spinner — skeleton at component level only

### Empty
- No patients in queue: centered illustration + "No patients waiting" + "Add a patient to get started" + prominent Add Patient button
- No queues configured (admin only): "No queues yet. Create your first queue."
- Search yields no results: "No matches found" with clear filter action

### Error / Disconnected
- WebSocket disconnected: subtle banner at top of dashboard — "Reconnecting…" with pulsing amber dot — auto-dismiss on reconnect
- Mutation failure (add/call/skip/complete): inline error toast — "Failed to call patient. Try again." — include retry action
- Network offline: persistent banner — "You're offline. Changes will sync when reconnected." — grey out action buttons
- API 500: generic toast — "Something went wrong. Please try again." — no stack traces or raw messages

---

## Responsive Breakpoints
```
Mobile:  < 640px   → single column, pinned action bar (with safe-area bottom padding)
Tablet:  640–1024px → two columns, larger touch targets
Desktop: > 1024px  → full dashboard layout
```

---

## Accessibility
- All interactive elements must have visible focus rings: `ring-2 ring-primary ring-offset-2`
- ARIA labels on icon-only buttons
- Keyboard navigation for all queue actions
- Color is never the only differentiator — use icons + text alongside color
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text (18px+ bold / 24px+ regular)
- Fixed bottom bars on mobile must include `pb-safe` or `padding-bottom: env(safe-area-inset-bottom)` for notched devices