<!-- Generated: 2026-04-13 | Files scanned: ~650 | Token estimate: ~600 -->

# Architecture Overview

## System Type

Single Next.js 16 application (App Router), file-based JSON storage, no database.

## High-Level Data Flow

```
Browser → Next.js App Router → API Routes → Storage Layer → JSON Files (/data/)
                                    ↓
                              Rules Engine (/lib/rules/)
                                    ↓
                              Edition Data (/data/editions/sr5/)
```

## Service Boundaries

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (React 19 + React Aria)                        │
│  Pages: 31 routes │ Components: ~240 │ Contexts: 6      │
├─────────────────────────────────────────────────────────┤
│ API Layer (Next.js Route Handlers)                      │
│  217 route files │ 9 domains │ Auth + Rate Limiting      │
├─────────────────────────────────────────────────────────┤
│ Business Logic                                          │
│  Rules Engine: 55 modules │ Storage: 22 modules          │
│  Auth: session + magic-link │ Email: SMTP/Resend/mock    │
├─────────────────────────────────────────────────────────┤
│ Persistence (JSON files)                                │
│  Characters: ~1268 │ Campaigns: ~493 │ Users: ~119       │
│  Edition data: SR5 (core-rulebook, run-faster, errata)   │
└─────────────────────────────────────────────────────────┘
```

## Key Domains

| Domain         | Pages | API Routes | Components              |
| -------------- | ----- | ---------- | ----------------------- |
| Characters     | 8     | 80+        | ~170 (creation + sheet) |
| Campaigns      | 8+    | 25+        | ~20                     |
| Combat         | 0     | 14         | ~8                      |
| Auth/Account   | 5     | 13         | ~5                      |
| Editions/Rules | 1     | 9          | ~7                      |
| Locations      | 5     | 14         | ~10                     |
| Grunt Teams    | 4     | 10         | ~10                     |

## Cross-Cutting Concerns

- **Auth**: Cookie-based sessions (httpOnly, 7-day), bcryptjs passwords, magic links
- **Observability**: Sentry error tracking, Pino structured logging
- **Security**: Rate limiting, audit logging, input validation, RBAC (owner/GM/admin)
- **Email**: Pluggable transport (SMTP, Resend, file, mock)
