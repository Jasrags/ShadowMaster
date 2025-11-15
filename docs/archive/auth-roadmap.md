# User Authentication Roadmap

> **Roadmap Reference:** Current milestone tracking is consolidated in `docs/product/roadmap.md`. Keep this document focused on authentication-specific requirements and history.

## Overview & Scope
This document captures the agreed plan for implementing user registration, login, and role-based access control (RBAC) using the existing Go + JSON storage stack. It summarizes current requirements, outlines the phased implementation strategy, and serves as the living reference that should be updated as work progresses.

### Current Status
- No authentication endpoints exist in the Go API.
- Frontend only shows character creation flows; no login/registration UI is present.
- JSON repositories manage campaigns/groups but not users.

### Requirements Summary
- **User registration**
  - First registered user becomes `Administrator`; all subsequent users default to `Player`.
  - Required fields: email, password, username (unique).
  - Password policy: ≥8 characters, includes upper+lower+digit, must not contain username, email, player name, campaign name, or session name.
- **User login**
  - Authenticate via email + password.
  - Provide logout endpoint.
  - Password reset is deferred but future-ready.
  - Users can change password (obey policy) and username (must stay unique); email is immutable.
- **RBAC roles**
  - `Administrator`: full access.
  - `Gamemaster`: manage campaigns/sessions.
  - `Player`: access campaigns they belong to.

## Implementation Phases

### Backend
1. **Domain & Repository**
   - Define `User` model (ID, email, username, bcrypt hash, roles, created/updated timestamps).
   - Add JSON repository (`internal/repository/json/user.go`) plus index updates for fast lookup by email/username.
   - Update central repository wiring (`internal/repository/json/repository.go`) and ensure user index persists alongside existing indices.
2. **Service Layer**
   - Implement `UserService` (e.g., `internal/service/user.go`) with registration/login logic.
   - Validate password policy and uniqueness, assign roles, hash with `golang.org/x/crypto/bcrypt`, verify on login.
   - Provide helpers for password change, role checks, and sanitizing `User` objects before returning to API layer.
3. **API & Middleware**
   - Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/password` (change password).
   - Session handling (signed cookie, contains user ID + version) via middleware in `internal/api/middleware/auth.go`.
   - RBAC middleware ensuring route access matches role requirements; expose helpers to guard campaign/session handlers.
   - Ensure responses omit sensitive data (hashes, etc.).

### Frontend
1. **UI & State**
   - Add login/register forms to home page (per spec) plus dedicated registration route/modal; reuse shared form components.
   - Client-side validation for password policy, matching confirm password, and username uniqueness hints.
   - Show authenticated user banner with role badges; provide navigation to campaigns/home post-login.
2. **API Integration**
   - Create JS utilities for calling auth endpoints, managing cookies/session storage, and refreshing campaign list post-login.
   - Handle failure states (invalid credentials, policy violations) with inline messaging.
   - Provide logout control and password change flow when user is authenticated.
3. **UX Enhancements**
   - Display current user info, role-based nav (e.g., show GM tools only when permitted).
   - Fallback messaging when user lacks campaign memberships and link to create/join flow.

### Testing & Documentation
- Backend unit tests for password policy, hashing/verification, role assignment.
- Integration tests (Go or minimal HTTP checks) for register/login happy path and failure cases.
- Frontend smoke tests covering form submission flows plus manual QA checklist for browsers.
- Update README and relevant docs with usage instructions, password guidelines, and session handling notes.

## Links & Maintenance
- Align with multi-edition plan: `docs/multi-edition-plan.md` (React migration, JSON data separation).
- Update this roadmap as tasks complete (mirrors plan todos).
- Track open questions (password reset UX, session expiry) in future revisions.

## Next Steps Checklist
- [x] Add user domain model and JSON repository wiring.
- [x] Implement backend services and endpoints with bcrypt hashing.
- [x] Build frontend login/register UI with API integration.
- [x] Document auth usage and add automated tests.
