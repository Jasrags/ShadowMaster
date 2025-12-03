# ShadowMaster Tech Stack Recommendation

_Created: 2025-12-03_

This document outlines the recommended technology stack for the Next.js rebuild of ShadowMaster.

---

## Core Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | **Next.js 15** (App Router) | Full-stack React, API routes, great DX |
| Language | **TypeScript** (strict mode) | Type safety across frontend and backend |
| Database | **SQLite** | File-based, no external dependencies, easy local dev |
| ORM | **Drizzle ORM** | Type-safe, lightweight, great SQLite support |
| Validation | **Zod** | Shared schemas between frontend and backend |
| Auth | **Lucia** | Simple, flexible session management |
| Styling | **Tailwind CSS** | Utility-first, consistent with existing codebase |
| UI Components | **shadcn/ui** | Accessible, customizable, Tailwind-native |

---

## Alternative Choices

### Auth Options
- **Lucia** - Recommended for custom email/password auth, database sessions
- **iron-session** - Simpler cookie-only sessions (no DB), good for prototyping
- **NextAuth v5** - Better if you want OAuth providers (Google, GitHub, etc.)

### Database Options
- **SQLite + Drizzle** - Recommended for simplicity and portability
- **PostgreSQL + Drizzle** - If you need multi-user concurrent access
- **Turso** - SQLite-compatible cloud database if you want hosted option

### State Management
- **React Context** - Sufficient for auth state
- **TanStack Query** - Add later for server state caching (campaigns, characters)
- **Zustand** - Add if client-side state becomes complex

---

## Target File Structure

```
shadowmaster-next/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Auth route group (no layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (protected)/               # Protected route group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── characters/
│   │   │   │   └── page.tsx
│   │   │   └── campaigns/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── register/
│   │   │       │   └── route.ts
│   │   │       ├── login/
│   │   │       │   └── route.ts
│   │   │       ├── logout/
│   │   │       │   └── route.ts
│   │   │       └── me/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── ui/                        # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── card.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── db/
│   │   ├── index.ts                   # Database client export
│   │   ├── schema.ts                  # Drizzle table definitions
│   │   └── migrations/                # Generated migrations
│   ├── lib/
│   │   ├── auth.ts                    # Lucia config and helpers
│   │   ├── utils.ts                   # General utilities (cn, etc.)
│   │   └── validations/
│   │       └── auth.ts                # Zod schemas for auth
│   └── middleware.ts                  # Route protection
├── data/
│   └── shadowmaster.db                # SQLite database (gitignored)
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                         # Environment variables
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Environment Variables

```bash
# .env.local
DATABASE_URL="file:./data/shadowmaster.db"
SESSION_SECRET="your-secret-key-min-32-chars"
```

---

## Initial Dependencies

```bash
# Core
npm install next@latest react@latest react-dom@latest

# Database
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# Auth
npm install lucia @lucia-auth/adapter-drizzle
npm install bcrypt
npm install -D @types/bcrypt

# Validation
npm install zod

# UI
npm install tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react                    # Icons for shadcn
npm install @radix-ui/react-slot           # For shadcn Button

# Dev
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next
```

---

## Key Decisions Explained

### Why SQLite over JSON files?
- **Queries** - Can filter, sort, join without loading everything into memory
- **Indexing** - Automatic indexes on foreign keys
- **Transactions** - ACID compliance for data integrity
- **Still portable** - Single file, no server process

### Why Drizzle over Prisma?
- **Lighter weight** - No generated client, faster builds
- **SQL-like syntax** - Closer to actual queries
- **Better SQLite support** - First-class, not an afterthought

### Why Lucia over NextAuth?
- **Simpler** - Less magic, more explicit
- **Custom auth** - Designed for email/password, not OAuth-first
- **Database sessions** - Easy to query, revoke, extend

### Why shadcn/ui over other component libraries?
- **Copy-paste** - You own the code, can customize everything
- **Accessible** - Built on Radix primitives
- **Tailwind-native** - No CSS conflicts

---

## Related Documents

- `06-nextjs-bootstrap-stories.md` - User stories to implement
- `07-ai-development-prompts.md` - Prompt templates for AI-driven development

