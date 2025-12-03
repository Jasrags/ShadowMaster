# ShadowMaster Bootstrap Stories - Next.js Rebuild

_Created: 2025-12-03_

This document contains user stories for bootstrapping a fresh Next.js implementation of ShadowMaster, focusing on core infrastructure and authentication.

---

## Epic: Bootstrap & Authentication

### Story 1: Project Initialization

**As a** developer  
**I want** a fresh Next.js 15 project with TypeScript, Tailwind, and essential tooling  
**So that** I have a consistent foundation to build upon

#### Acceptance Criteria
- [ ] Next.js 15 with App Router and TypeScript
- [ ] Tailwind CSS configured
- [ ] ESLint and Prettier configured
- [ ] Project structure follows Next.js conventions
- [ ] `npm run dev` starts the dev server successfully
- [ ] Basic layout component with header placeholder

#### Technical Notes
- Use `create-next-app` with TypeScript template
- Enable `src/` directory structure
- Configure path aliases (@/ for src/)

---

### Story 2: Database Setup

**As a** developer  
**I want** a SQLite database with type-safe ORM  
**So that** I can persist data locally without external dependencies

#### Acceptance Criteria
- [ ] Drizzle ORM installed and configured
- [ ] SQLite database file created in `data/` directory
- [ ] User schema defined (id, email, username, passwordHash, roles, createdAt, updatedAt)
- [ ] Database migrations working (`npm run db:push` or `db:migrate`)
- [ ] Database client exported for use in API routes

#### Technical Notes
- Use `better-sqlite3` driver for SQLite
- Store DB file at `./data/shadowmaster.db`
- Add `data/*.db` to .gitignore
- Create `src/db/schema.ts` for table definitions
- Create `src/db/index.ts` for client export

---

### Story 3: User Registration

**As a** new user  
**I want** to register with email, username, and password  
**So that** I can create an account and access the application

#### Acceptance Criteria
- [ ] POST `/api/auth/register` endpoint accepts email, username, password
- [ ] Passwords are hashed with bcrypt before storage
- [ ] Email and username must be unique (return 409 on conflict)
- [ ] Input validation with Zod (email format, password min 8 chars, username 3-30 chars)
- [ ] Returns user object (without password) on success
- [ ] Registration form at `/register` route
- [ ] Form shows validation errors inline
- [ ] Successful registration redirects to login page

#### Technical Notes
- Use Zod schema for validation, share between frontend and backend
- Use `bcrypt` or `@node-rs/bcrypt` for password hashing
- Create `src/lib/validations/auth.ts` for shared schemas

---

### Story 4: User Login & Session

**As a** registered user  
**I want** to log in with my email and password  
**So that** I can access protected features

#### Acceptance Criteria
- [ ] POST `/api/auth/login` endpoint validates credentials
- [ ] On success, creates HTTP-only session cookie
- [ ] On failure, returns 401 with generic error message
- [ ] Login form at `/login` route
- [ ] Form shows error on invalid credentials
- [ ] Successful login redirects to home/dashboard

#### Technical Notes
- Use Lucia for session management OR iron-session for simpler cookie-based sessions
- Session cookie should be HTTP-only, Secure in production, SameSite=Lax
- Store session in database (Lucia) or signed cookie (iron-session)

---

### Story 5: Session Management

**As a** logged-in user  
**I want** to see my current session state and log out  
**So that** I can verify my identity and securely end my session

#### Acceptance Criteria
- [ ] GET `/api/auth/me` returns current user or null if not authenticated
- [ ] POST `/api/auth/logout` clears session cookie
- [ ] Logout redirects to home page
- [ ] Header component shows login/register links when logged out
- [ ] Header component shows username and logout button when logged in

#### Technical Notes
- Create React context for auth state (`src/contexts/AuthContext.tsx`)
- Fetch `/api/auth/me` on app mount to hydrate auth state
- Consider using SWR or TanStack Query for caching

---

### Story 6: Protected Routes

**As a** developer  
**I want** middleware that protects routes based on authentication  
**So that** unauthenticated users cannot access protected pages

#### Acceptance Criteria
- [ ] Next.js middleware checks session on protected routes
- [ ] Unauthenticated requests to protected routes redirect to `/login`
- [ ] Login/register pages redirect to `/` if already authenticated
- [ ] Protected routes include: `/dashboard`, `/characters/*`, `/campaigns/*`

#### Technical Notes
- Use Next.js middleware (`src/middleware.ts`)
- Define route matchers for protected and auth-only paths
- Middleware should validate session cookie existence and validity

---

### Story 7: First User Auto-Admin

**As** the first user to register  
**I want** to automatically receive administrator privileges  
**So that** I can manage the application without manual database edits

#### Acceptance Criteria
- [ ] Registration checks if any users exist in database
- [ ] If no users exist, new user receives `administrator` role
- [ ] Subsequent users receive default `player` role
- [ ] Role is included in user response and session

#### Technical Notes
- Add roles field to user schema (array or JSON column in SQLite)
- Default roles: `['player']`, first user: `['administrator', 'player']`

---

## Implementation Order

```
1. Story 1: Project Init          → Foundation
2. Story 2: Database Setup        → Persistence layer
3. Story 3: Registration API      → Backend first
4. Story 3: Registration Form     → Frontend second
5. Story 4: Login API             → Backend
6. Story 4: Login Form            → Frontend
5. Story 5: Me endpoint + Context → State management
6. Story 6: Middleware            → Route protection
7. Story 7: Auto-admin            → Polish
```

---

## Related Documents

- `07-ai-development-prompts.md` - Prompt templates for AI-driven development
- `08-tech-stack-recommendation.md` - Recommended technologies and file structure

