<!-- e939a606-8132-4ac1-88db-7af0e895b210 4c6f15a0-9217-4ae3-80b7-4cedaae656c1 -->
# Supabase Client Setup & Authentication

This plan implements complete Supabase authentication integration for the Next.js 14 App Router project.

## Status: ✅ COMPLETED

All authentication setup has been implemented and committed. The following files were created:

- Supabase client files (browser, server, middleware)
- Root middleware with route protection
- Authentication components (LoginForm, SignupForm, UserMenu, AuthNav)
- Auth pages (login, signup) with centered layout
- Auth utilities (session helpers, types)
- Updated root layout with auth state checking

**Commit:** `63e0460` - "feat: implement Supabase authentication setup"

## Implementation Overview

### 1. Supabase Client Files

**`src/lib/supabase/client.ts`**

- Create browser client using `createBrowserClient` from `@supabase/ssr`
- Configure cookie handling for authentication state
- Export typed Supabase client instance
- Include error handling for initialization

**`src/lib/supabase/server.ts`**

- Create server-side client using `createServerClient` from `@supabase/ssr`
- Handle cookies for Server Components and Route Handlers
- Export helper functions: `createClient()` for Server Components and `createClientForRouteHandler()` for Route Handlers
- Type-safe with proper Next.js request/response types

**`src/lib/supabase/middleware.ts`**

- Create auth middleware helper functions
- Session refresh logic
- Redirect handling utilities
- Type-safe route protection helpers

### 2. Root Middleware

**`middleware.ts`** (root level)

- Integrate Supabase auth middleware
- Define protected route patterns (e.g., `/campaigns/*`, `/characters/*`, `/play/*`)
- Handle auth state changes and session refresh
- Redirect unauthenticated users to `/login`
- Allow public access to auth routes (`/login`, `/signup`)

### 3. Authentication Components

**`src/components/auth/LoginForm.tsx`**

- Email/password login form
- Error handling and display
- Loading states during submission
- Redirect to dashboard on success
- Use Intent UI components (Input, Button)

**`src/components/auth/SignupForm.tsx`**

- Email/password signup form
- Password confirmation
- Error handling and validation
- Loading states
- Redirect to login or dashboard on success

**`src/components/auth/UserMenu.tsx`**

- Dropdown menu component showing user info
- Logout functionality
- User avatar/name display
- Use Intent UI Menu component

### 4. Authentication Pages

**`src/app/(auth)/login/page.tsx`**

- Server component that checks if user is already authenticated
- Redirects to home if authenticated
- Renders LoginForm component

**`src/app/(auth)/signup/page.tsx`**

- Server component that checks if user is already authenticated
- Redirects to home if authenticated
- Renders SignupForm component

**`src/app/(auth)/layout.tsx`**

- Centered layout for auth pages
- Clean, minimal design
- Responsive styling

### 5. Auth Utilities

**`src/lib/auth/session.ts`**

- `getSession()` - Get current session (server-side)
- `checkSession()` - Verify session validity
- `getUser()` - Get current user from session
- Type-safe helpers with proper error handling

**`src/lib/auth/types.ts`**

- TypeScript types for User and Session
- Extend Supabase types as needed
- Export user profile types

### 6. Root Layout Updates

**`src/app/layout.tsx`**

- Check auth state using server-side session
- Conditionally render UserMenu when authenticated
- Show navigation for authenticated users
- Handle loading states during auth check

## Technical Details

- Use `@supabase/ssr` package (already installed) for proper Next.js integration
- Implement proper cookie handling for both client and server
- Add TypeScript types throughout
- Include error boundaries and loading states
- Follow Next.js 14 App Router patterns (Server Components where possible)
- Use environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Files to Create

1. `src/lib/supabase/client.ts`
2. `src/lib/supabase/server.ts`
3. `src/lib/supabase/middleware.ts`
4. `middleware.ts` (root)
5. `src/components/auth/LoginForm.tsx`
6. `src/components/auth/SignupForm.tsx`
7. `src/components/auth/UserMenu.tsx`
8. `src/app/(auth)/login/page.tsx`
9. `src/app/(auth)/signup/page.tsx`
10. `src/app/(auth)/layout.tsx`
11. `src/lib/auth/session.ts`
12. `src/lib/auth/types.ts`
13. Update `src/app/layout.tsx`

## Implementation Notes

- All components use TypeScript with proper typing
- Error handling and loading states implemented throughout
- LoginForm wrapped in Suspense for useSearchParams compatibility
- AuthNav component created as server component wrapper for UserMenu
- Database types file created as placeholder (will be updated when schema is generated)
- All files pass linting with no errors

### To-dos

- [x] Create Supabase client files: client.ts (browser), server.ts (server-side), and middleware.ts (auth helpers)
- [x] Create root middleware.ts with route protection and auth state handling
- [x] Create authentication components: LoginForm, SignupForm, and UserMenu
- [x] Create auth pages: login/page.tsx, signup/page.tsx, and (auth)/layout.tsx
- [x] Create auth utilities: session.ts and types.ts with helper functions
- [x] Update root layout.tsx to check auth state and conditionally render UserMenu