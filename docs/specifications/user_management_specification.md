> [!NOTE]
> This implementation guide is governed by the [Capability (security.account-governance.md)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/security.account-governance.md).

# User Management Specification

**Last Updated:** 2025-01-27  
**Status:** Implemented (MVP)  
**Category:** Administration, Access Control, Security  
**Affected Areas:** All user-facing features (foundational administrative feature)

---

## Overview

User management provides administrators with the ability to view, edit, and manage user accounts in the Shadow Master system. This feature enables role-based access control by allowing administrators to assign and modify user roles (user, administrator, gamemaster), update user information, and maintain system security through proper account management.

**Key Features:**
- View all registered users in a sortable, searchable table
- Edit user information (email, username, roles)
- Delete user accounts (with safety validations)
- Search and filter users
- Sort users by various criteria
- Pagination for large user lists
- Role management (multi-role support)
- Safety validations (prevent removing last administrator)
- Admin-only access control

**Current Status:** Basic implementation complete. This specification documents current implementation and defines enhancements.

---


## Page Structure

### Routes

#### User Management Page
- **Path:** `/app/users/page.tsx`
- **Layout:** Uses `AuthenticatedLayout` (inherits sidebar navigation)
- **Authentication:** Required (protected route)
- **Authorization:** Administrator role required
- **Description:** Main user management interface with user table

---

## Components

### 1. UsersPage (Main Page Component)

**Location:** `/app/users/page.tsx`

**Responsibilities:**
- Verify administrator access
- Fetch initial user list from server
- Render UserTable component
- Handle server-side errors and redirects

**Implementation:**
- Server component (Next.js App Router)
- Uses `requireAdmin()` middleware for access control
- Redirects to home if not admin or not authenticated
- Fetches users via `getAllUsers()` storage function
- Passes initial users to UserTable client component

**Props:** None (server component)

---

### 2. UserTable

**Location:** `/app/users/UserTable.tsx`

**Description:** Client component displaying user list with search, sort, pagination, and actions.

**Responsibilities:**
- Display users in table format
- Handle search input
- Handle sorting by column
- Handle pagination
- Trigger user edit modal
- Handle user deletion
- Refresh user list after modifications
- Display loading and error states

**State:**
- `users: PublicUser[]` - Current page of users
- `search: string` - Search query
- `page: number` - Current page number
- `limit: number` - Users per page (default: 20)
- `sortBy: SortColumn` - Column to sort by
- `sortOrder: SortOrder` - Sort direction (asc/desc)
- `loading: boolean` - Loading state
- `error: string | null` - Error message
- `editingUser: PublicUser | null` - User being edited
- `isModalOpen: boolean` - Edit modal visibility

**Props:**
```typescript
interface UserTableProps {
  initialUsers: PublicUser[];
}
```

**Features:**
- **Search:** Filter users by email or username (client-side and server-side)
- **Sorting:** Click column headers to sort (toggle asc/desc)
- **Pagination:** Previous/Next buttons with page indicator
- **Edit Action:** Opens UserEditModal for selected user
- **Delete Action:** Confirms and deletes user
- **Loading States:** Shows loading indicator during operations
- **Error Display:** Shows error messages for failed operations

---

### 3. UserEditModal

**Location:** `/app/users/UserEditModal.tsx`

**Description:** Modal dialog for editing user information.

**Responsibilities:**
- Display user edit form
- Validate input (email, username, roles)
- Handle form submission
- Display validation errors
- Call onSave callback with update data

**State:**
- `email: string` - User email
- `username: string` - Username
- `selectedRoles: Set<UserRole>` - Selected roles (multi-select)
- `errors: Record<string, string>` - Validation errors

**Props:**
```typescript
interface UserEditModalProps {
  user: PublicUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateUserRequest) => Promise<void>;
  isLoading?: boolean;
}
```

**Form Fields:**
- **Email** (required, email format validation)
- **Username** (required, 3-50 characters)
- **Roles** (required, multi-select: user, gamemaster, administrator)
- **Read-only:** User ID, Created date

**Validation:**
- Email format validation
- Username length validation (3-50 characters)
- At least one role required
- Client-side validation before submission

---

### 4. AuthenticatedLayout

**Location:** `/app/users/AuthenticatedLayout.tsx`

**Description:** Layout wrapper with sidebar navigation (shared component).

---

### 5. ErrorBoundary

**Location:** `/app/users/ErrorBoundary.tsx`

**Description:** Error boundary for catching React errors in UserTable.

---

## Data Model

### User Type

See `/lib/types/user.ts` for complete type definition:

```typescript
export type UserRole = "user" | "administrator" | "gamemaster";

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string; // Not exposed in PublicUser
  role: UserRole[]; // Array - users can have multiple roles
  createdAt: string; // ISO 8601 date string
  lastLogin: string | null; // ISO 8601 date string or null
  characters: string[]; // Array of character IDs
}

export type PublicUser = Omit<User, "passwordHash">;

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  role?: UserRole[]; // Array of roles
}

export interface UpdateUserResponse {
  success: boolean;
  user?: PublicUser;
  error?: string;
}

export interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

export interface UsersListResponse {
  success: boolean;
  users: PublicUser[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}
```

### Role System

**Roles:**
- **user** - Standard user (default for new registrations)
- **gamemaster** - Game Master role (for campaign management, future)
- **administrator** - System administrator (access to user management, full system access)

**Multi-Role Support:**
- Users can have multiple roles simultaneously
- Roles are stored as an array: `role: UserRole[]`
- First user created automatically gets "administrator" role
- Subsequent users get "user" role by default

---

## Data Requirements

### API Endpoints

#### 1. GET `/api/users`

**Purpose:** List all users (paginated, searchable, sortable)

**Authorization:** Administrator role required

**Query Parameters:**
- `search?: string` - Search query (filters email and username)
- `page?: number` - Page number (default: 1)
- `limit?: number` - Users per page (default: 20)
- `sortBy?: SortColumn` - Column to sort by (default: "createdAt")
  - Options: "email", "username", "role", "createdAt"
- `sortOrder?: SortOrder` - Sort direction (default: "asc")
  - Options: "asc", "desc"

**Response:**
```typescript
{
  success: boolean;
  users: PublicUser[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}
```

**Status Codes:**
- `200` - Success
- `403` - Forbidden (not administrator)
- `500` - Server error

**Implementation:**
- Verifies administrator role via `requireAdmin()`
- Fetches all users from storage
- Filters users (removes passwordHash, converts to PublicUser)
- Applies search filter (email or username)
- Applies sorting
- Applies pagination
- Returns paginated results with metadata

---

#### 2. PUT `/api/users/[id]`

**Purpose:** Update user information

**Authorization:** Administrator role required

**Request:**
```typescript
{
  email?: string;
  username?: string;
  role?: UserRole[];
}
```

**Response:**
```typescript
{
  success: boolean;
  user?: PublicUser;
  error?: string;
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (validation errors)
- `403` - Forbidden (not administrator)
- `404` - User not found
- `500` - Server error

**Validation:**
- Email: Valid email format (if provided)
- Username: 3-50 characters (if provided)
- Role: Must be array, at least one role, valid role values
- Safety: Cannot remove administrator role from last administrator

**Implementation:**
- Verifies administrator role
- Validates user exists
- Validates email format (if provided)
- Validates username length (if provided)
- Validates roles (array, non-empty, valid values)
- Checks if removing admin role from last admin (prevents if true)
- Updates user in storage
- Returns updated user (without passwordHash)

---

#### 3. DELETE `/api/users/[id]`

**Purpose:** Delete a user account

**Authorization:** Administrator role required

**Request:** None (user ID from route)

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (cannot delete last admin)
- `403` - Forbidden (not administrator)
- `404` - User not found
- `500` - Server error

**Safety Validation:**
- Prevents deletion of last administrator
- Returns error if attempting to delete last admin

**Implementation:**
- Verifies administrator role
- Validates user exists
- Checks if user is administrator
- Counts total administrators
- Prevents deletion if user is last administrator
- Deletes user file from storage
- Returns success response

**Note:** Currently does not delete associated data (characters, etc.). Future enhancement: cascade delete or data cleanup.

---

### Storage Layer

**File Structure:**
```
data/users/
├── {userId}.json
├── {userId}.json
└── ...
```

**Functions in `/lib/storage/users.ts`:**

```typescript
// CRUD operations
export function getUserById(userId: string): Promise<User | null>;
export function getUserByEmail(email: string): Promise<User | null>;
export function getAllUsers(): Promise<User[]>;
export function createUser(userData: Omit<User, "id" | "createdAt" | "lastLogin" | "characters">): Promise<User>;
export function updateUser(userId: string, updates: Partial<User>): Promise<User>;
export function deleteUser(userId: string): Promise<void>;
```

---

## Access Control

### Authorization

**Middleware:** `/lib/auth/middleware.ts`

**Functions:**
- `requireAuth()` - Requires authenticated user (throws if not)
- `requireAdmin()` - Requires administrator role (throws if not authenticated or not admin)
- `isAdmin()` - Checks if current user is admin (returns boolean)

**Usage:**
- Server components use `await requireAdmin()` before rendering
- API routes use `await requireAdmin()` before processing requests
- Throws error if unauthorized, which triggers redirect (server components) or 403 response (API routes)

### Role Checks

**Current User Role:**
- Retrieved from session cookie (user ID)
- User record loaded from storage
- Role array checked for "administrator"

**Role Hierarchy:**
- No strict hierarchy (roles are independent)
- Administrator role grants access to user management
- Gamemaster role (future use for campaign management)
- User role (default, standard access)

---

## Security Considerations

### Access Control

- ✅ User management accessible only to administrators
- ✅ Server-side authorization checks (not just client-side)
- ✅ API routes verify administrator role
- ✅ Server components verify administrator role before rendering

### Data Protection

- ✅ Passwords never exposed (passwordHash excluded from PublicUser)
- ✅ Only necessary user data exposed to administrators
- ✅ User data validated before updates

### Safety Validations

- ✅ Cannot remove administrator role from last administrator
- ✅ Cannot delete last administrator
- ✅ Users must have at least one role
- ✅ Email and username validation

### Input Validation

- ✅ Email format validation (client and server)
- ✅ Username length validation (3-50 characters, client and server)
- ✅ Role validation (valid role values, array format)
- ✅ Server-side validation is mandatory (never trust client)

### Error Handling

- ✅ Generic error messages for security (don't reveal system details)
- ✅ Specific validation errors for user feedback
- ✅ Proper HTTP status codes (403 for unauthorized, 400 for validation errors)

---

## UI/UX Considerations

### Visual Design

- **Consistent with existing UI:** Follow Tailwind CSS patterns and dark mode support
- **Table layout:** Clean, sortable table with clear column headers
- **Modal dialogs:** UserEditModal for editing with clear form layout
- **Loading states:** Loading indicators during operations
- **Error display:** Clear error messages in dedicated error area
- **Responsive design:** Mobile-first, adapts to tablet and desktop

### Accessibility

- **Keyboard navigation:** Full keyboard support for all interactive elements
- **Screen readers:** Proper ARIA labels and semantic HTML
- **Table semantics:** Proper table markup with `<thead>`, `<tbody>`
- **Form labels:** All inputs have associated labels
- **Error announcements:** ARIA live regions for error messages
- **Focus management:** Clear focus indicators, logical tab order

### User Experience

- **Search:** Real-time search filtering (debounced API calls)
- **Sorting:** Click column headers to sort, visual indicators for sort direction
- **Pagination:** Clear page navigation with Previous/Next buttons
- **Edit workflow:** Modal dialog for editing, saves on confirmation
- **Delete workflow:** Confirmation dialog before deletion
- **Feedback:** Success feedback via list refresh, error messages for failures
- **Loading feedback:** Loading states during operations

---

## Implementation Notes

### File Structure

```
app/users/
├── page.tsx                      # Main user management page (server component)
├── UserTable.tsx                 # User table component (client)
├── UserEditModal.tsx             # Edit user modal (client)
├── AuthenticatedLayout.tsx       # Layout wrapper
└── ErrorBoundary.tsx             # Error boundary

lib/
├── auth/
│   └── middleware.ts             # requireAdmin(), requireAuth() functions
├── storage/
│   └── users.ts                  # User storage layer
└── types/
    └── user.ts                   # User type definitions

app/api/users/
├── route.ts                      # GET /api/users
└── [id]/
    └── route.ts                  # PUT, DELETE /api/users/[id]
```

### Dependencies

- **Existing:**
  - `@/lib/types` - Type definitions
  - `@/lib/storage/users` - User storage layer
  - `@/lib/auth/middleware` - Authorization middleware
  - `@/lib/auth/validation` - Input validation functions
  - `react-aria-components` - UI components (Dialog, Modal, Button, etc.)
  - `next/navigation` - Server-side redirects

### State Management

- **Client-side state:** React `useState` for UI state (search, sort, pagination, modal)
- **Server data:** Fetch via API routes on page load and filter changes
- **Initial data:** Server component fetches initial users, passes to client component

### Search and Filtering

**Current Implementation:**
- Search filters by email or username (case-insensitive)
- Search is performed server-side via API query parameter
- Client triggers API call when search input changes (debounced)

**Future Enhancements:**
- Advanced filters (by role, creation date range, etc.)
- Full-text search across all user fields
- Client-side filtering for instant feedback (with server-side validation)

---


## Security Checklist

Use this checklist when reviewing user management security:

### Access Control
- [x] Page requires administrator authentication
- [x] API endpoints verify administrator role
- [x] Server-side authorization checks (not just client-side)
- [x] Non-administrators cannot access user management

### Data Protection
- [x] Passwords never exposed (passwordHash excluded)
- [x] Only necessary user data exposed
- [x] Sensitive operations require confirmation

### Safety Validations
- [x] Cannot remove admin role from last administrator
- [x] Cannot delete last administrator
- [x] Users must have at least one role
- [x] Input validation (email, username, roles)

### Input Validation
- [x] Email format validation (client + server)
- [x] Username length validation (client + server)
- [x] Role validation (valid values, array format)
- [x] Server-side validation mandatory

### Error Handling
- [x] Generic error messages for security
- [x] Specific validation errors for user feedback
- [x] Proper HTTP status codes

---

## Related Documentation

- **Authentication:** `/docs/specifications/authentication_specification.md`
- **Settings Page:** `/docs/specifications/settings_page_specification.md` (self-service user management)
- **User Management Feature Request:** `/docs/prompts/user-management-feature-request.md`
- **Architecture:** `/docs/architecture/architecture-overview.md`

---

## Open Questions

1. **Associated Data Deletion:** Should deleting a user also delete their characters and other associated data?
   - **Recommendation:** Phase 2 feature - currently only deletes user record, add cascade delete or data cleanup option

2. **Soft Delete:** Should user deletion be soft (deactivation) or hard (permanent deletion)?
   - **Recommendation:** Consider soft delete in Phase 2 for audit trails and recovery

3. **Bulk Operations:** Should administrators be able to perform bulk actions on multiple users?
   - **Recommendation:** Phase 2 feature - useful for managing large user bases

4. **Password Reset:** Should administrators be able to reset user passwords?
   - **Recommendation:** Phase 2 feature - useful for account recovery, requires secure token generation

5. **User Notes:** Should administrators be able to add notes/comments to user accounts?
   - **Recommendation:** Phase 3 feature - useful for tracking user issues or special circumstances

6. **Activity Tracking:** Should the system track more detailed user activity (page views, API calls, etc.)?
   - **Recommendation:** Phase 3 feature - useful for security monitoring and usage analytics

7. **Character Count Display:** Should the user table show how many characters each user has?
   - **Recommendation:** Phase 2 feature - useful information at a glance

8. **Export Functionality:** Should administrators be able to export user lists?
   - **Recommendation:** Phase 2 feature - useful for reporting and data analysis

9. **User Import:** Should administrators be able to bulk import users (e.g., from CSV)?
   - **Recommendation:** Phase 3 feature - useful for migration or bulk account creation

10. **Audit Logging:** Should all user management actions be logged for audit purposes?
    - **Recommendation:** Phase 2 feature - important for security and compliance

---

## Implementation Priority

**Priority:** High (Administrative functionality, security-critical)  
**Current Status:** ✅ Basic implementation complete

**Recent Enhancements:**
- Multi-role support (users can have multiple roles)
- Server-side authorization checks
- Safety validations (prevent removing last admin)
- Search, sort, and pagination

**Future Enhancements (Priority Order):**

1. **Audit Logging** (High Priority)
   - Log all user management actions
   - Track who made changes and when
   - Useful for security and compliance
   - Estimated effort: 2-3 days

2. **Associated Data Handling** (High Priority)
   - Decide on cascade delete vs. data cleanup
   - Handle character deletion when user deleted
   - Estimated effort: 2-3 days

3. **Password Reset** (Medium Priority)
   - Admin-initiated password reset
   - Secure token generation
   - Email notification (if email system exists)
   - Estimated effort: 3-4 days

4. **Character Count Display** (Medium Priority)
   - Show character count in user table
   - Link to user's characters
   - Estimated effort: 1 day

5. **Bulk Operations** (Medium Priority)
   - Bulk role assignment
   - Bulk delete (with confirmations)
   - Estimated effort: 3-4 days

6. **Export Functionality** (Low Priority)
   - Export user list as CSV/JSON
   - Include selected fields
   - Estimated effort: 2-3 days

7. **Soft Delete** (Low Priority)
   - Deactivate users instead of deleting
   - Recovery mechanism
   - Estimated effort: 3-4 days

---

## Notes

- User management is a critical administrative feature that enables proper access control
- Safety validations are essential to prevent system-breaking changes (e.g., removing last admin)
- Multi-role support provides flexibility for future permission systems
- Current implementation provides solid foundation, but audit logging should be added for production use
- Consider data retention policies when implementing user deletion (GDPR compliance, future)
- Integration with character management: Consider showing character count and linking to user's characters
- Future: Consider user groups or permission templates for easier role management

