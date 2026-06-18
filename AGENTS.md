# MediQueue — Agent Configuration

> **This is the root configuration file. Read it fully before taking any action.**

---

# 1. Product Overview

## Product Summary

MediQueue is a real-time medical facility queue management system that helps healthcare facilities manage walk-in patient flow while providing patients with live queue visibility through QR codes and unique tracking links.

The product is designed as an operational tool, not an administration platform.

The primary focus is queue management, patient flow visibility, and operational efficiency.

---

## Product Philosophy

MediQueue is a live operations system.

Every feature should prioritize:

1. Current patient visibility
2. Queue progression
3. Fast queue actions
4. Real-time updates
5. Minimal navigation

Avoid building:

* Hospital management software
* Administration-heavy workflows
* Complex configuration systems
* Enterprise reporting platforms

The product should feel closer to a modern operations center than a traditional SaaS dashboard.

---

## Product Scope

### Core Workflow

Clinic staff:

* Select queue
* Add patient
* Call next patient
* Skip patient
* Complete patient

Patients:

* Scan QR code or open tracking link
* View queue position
* View current serving patient
* Receive live queue updates

---

## Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Framework        | Next.js App Router     |
| Language         | TypeScript             |
| ORM              | Prisma                 |
| Database         | PostgreSQL             |
| Real-Time        | WebSockets             |
| Authentication   | JWT (httpOnly cookies) |
| Styling          | Tailwind CSS           |
| Validation       | Zod                    |
| Password Hashing | bcryptjs               |

---

# 2. Required Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
```

Application startup must fail if any required variable is missing.

Validate inside:

```text
lib/env.ts
```

---

# 3. Project Constraints (Non-Negotiable)

## Dashboard First

All operations occur inside:

```text
/dashboard
```

There are no separate admin or receptionist dashboards.

---

## Single Clinic Account Model

The MVP uses a single clinic account.

Do not build:

* Staff management
* Invitations
* Role assignment
* Permission management

---

## Public Patient Access

Patient tracking routes:

```text
/q/[queueEntryId]
```

Must:

* Require no authentication
* Be read-only
* Never expose clinic data beyond queue status

---

## Real-Time First

Every queue mutation must trigger a real-time event.

Examples:

* Add patient
* Call next
* Skip patient
* Complete patient

All connected clients must update instantly.

---

## Tenant Isolation

Every database query involving clinic data must be scoped by:

```typescript
clinicId
```

Clinic identity must come from authenticated session data only.

Never trust client-supplied clinic IDs.

---

## Security

Never expose:

* Stack traces
* Database errors
* Internal implementation details

Log errors server-side only.

---

# 4. Core Application Structure

---

## Dashboard

Primary operational screen.

Route:

```text
/dashboard
```

### Dashboard Sections

#### Queue Tabs

Examples:

* General Consultation
* Dental
* Pediatrics
* Pharmacy

Used for switching queues.

---

#### Current Patient Hero

Primary focal point.

Displays:

* Queue Number
* Patient Name
* Current Status
* Waiting Time

---

#### Queue Metrics

Displays:

* Waiting
* Serving
* Completed Today
* Average Wait Time

---

#### Queue Actions

Primary actions:

* Add Patient
* Call Next
* Skip
* Complete

---

#### Next Up Queue

Displays upcoming patients.

Focus on readability.

Avoid large tables.

---

#### Recent Activity

Displays recent queue events:

* Patient Added
* Patient Called
* Patient Completed
* Patient Skipped

---

## Analytics

Separate page.

Route:

```text
/dashboard/analytics
```

Purpose:

Provide lightweight operational insights.

### Analytics Sections

#### Overview

* Patients Today
* Average Wait Time
* Active Queues
* Completed Today

#### Queue Performance

Table:

* Queue Name
* Patients Served
* Average Wait Time

#### Daily Activity

Simple activity chart.

Do not add:

* Revenue
* Billing
* Productivity reports
* Advanced filters

---

## Settings

Settings are accessed from the user avatar.

Use a right-side drawer.

Do not create a dedicated settings dashboard.

### Facility

Fields:

* Facility Name
* Facility Logo

### Account

Fields:

* Full Name
* Email
* Change Password

Do not include:

* Staff Management
* Roles
* Billing
* Notifications
* Integrations
* Appearance Settings

---

# 5. Folder Structure

```text
app/

├── (auth)
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── dashboard
│   ├── page.tsx
│   └── analytics/page.tsx
│
├── q
│   └── [queueEntryId]/page.tsx
│
└── api
    ├── auth
    ├── queues
    ├── queue-entries
    ├── analytics
    └── websocket
```

---

# 6. Core Data Models

## Clinic

```text
id
name
logo
createdAt
```

---

## User

```text
id
clinicId
email
passwordHash
createdAt
```

---

## Queue

```text
id
clinicId
name
status
createdAt
```

---

## QueueEntry

```text
id
queueId
patientName
phone
queueNumber
status
position
createdAt
```

---

## QueueEvent

```text
id
queueId
entryId
eventType
timestamp
```

---

## AnalyticsRecord

```text
id
clinicId
queueId
date
metrics
```

---

# 7. WebSocket Events

Every queue mutation must emit:

```text
patient_added
patient_called
patient_skipped
patient_completed
queue_updated
```

Events must be emitted after successful database writes.

---

# 8. Design Principles

The interface should feel:

* Modern
* Minimal
* Fast
* Operational
* Professional

Inspired by:

* Linear
* Stripe
* Notion Calendar
* Modern dispatch software

Avoid:

* Admin templates
* Enterprise dashboards
* Heavy navigation
* Data overload

---

# 9. Agent Error Escalation

Stop and request clarification when:

* A task introduces staff management
* A task introduces role-based UI
* A task introduces hospital-management features
* A task introduces scheduling systems
* A task introduces billing or insurance workflows
* A task violates tenant isolation
* A task exposes internal system details

Always preserve the core MediQueue principle:

> Fast queue operations and real-time patient visibility are more important than administration, configuration, or reporting.
