<!-- Generated: 2026-04-13 | Files scanned: package.json | Token estimate: ~400 -->

# Dependencies

## Framework

- `next@16.1.6` — App Router, React Server Components
- `react@19.2.4` / `react-dom@19.2.4` — React 19
- `server-only@0.0.1` — Server-side execution enforcement

## UI

- `react-aria-components@1.14.0` — Accessible UI components (buttons, inputs, selects, modals)
- `lucide-react@0.563.0` — Icon library
- `tw-animate-css@1.4.0` — Tailwind CSS animations
- Tailwind CSS 4 — Utility-first styling (dark mode)

## Auth & Security

- `bcryptjs@3.0.3` — Password hashing
- Cookie-based sessions (httpOnly, 7-day, built-in)

## Email

- `nodemailer@7.0.13` — SMTP email transport
- `resend@6.9.1` — Managed email service (alternative transport)
- `@react-email/components@1.0.6` — Email template components

## Observability

- `@sentry/nextjs@10.38.0` — Error tracking, performance monitoring
- `pino@10.3.0` — Structured JSON logging

## Utilities

- `uuid@13.0.0` — UUID generation
- `@tanstack/react-virtual@3.13.18` — Virtual scrolling for large lists

## External Services

- **Sentry** — Error tracking (cloud)
- **Resend** — Email delivery (optional, cloud)
- **SMTP** — Email delivery (configurable)

## No External Dependencies For

- Database (JSON file storage)
- State management (React Context)
- Routing (Next.js App Router)
- Validation (custom, no Zod/Yup)
- ORM (no database)
