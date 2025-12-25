# Implementation Plan: Participant Governance Capability

## Goal Description

Implement the **Participant Governance** capability to provide complete administrative control over participant identities and access permissions. This capability ensures strict RBAC enforcement, secure account state transitions, and systematic management of participant records with a verifiable audit trail.

**Current State:** The codebase has solid foundational RBAC infrastructure with working role-based access control, multi-role support (`user`, `gamemaster`, `administrator`), and last-admin protection. The primary gap is **audit logging of administrative actions** and **account state management** (suspension/deactivation).

**Target State:** Full Participant Governance with:
- Complete audit trail of all administrative actions
- Account state transitions (active, suspended, locked)
- Enhanced visibility into participant activity
- Administrative action history UI

---

## Architectural Decisions (Approved)

1. **Audit Storage Strategy** ✅
   - **Decision:** Separate `/data/audit/users/` directory
   - **Rationale:** Better separation of concerns and query performance

2. **Account State Transitions** ✅
   - **Decision:** Force immediate logout via sessionVersion increment on suspension
   - **Rationale:** Ensures suspended users cannot continue accessing resources

3. **Audit Retention Policy** ✅
   - **Decision:** No automatic pruning in MVP
   - **Future:** Add configurable retention policy in later iteration

4. **Admin Granularity** ✅
   - **Decision:** Keep single "administrator" role for MVP
   - **Future:** Consider sub-roles (user-admin, system-admin) if needed

---

## Proposed Changes

### Phase 1: Type Definitions and Storage Layer

#### 1.1 Extend User Types
**File:** `/lib/types/user.ts`
**References:** Capability Requirement: "Participant metadata transitions MUST be atomic and verified"

```typescript
// Add to existing types
type AccountStatus = "active" | "suspended" | "locked";

interface UserStatusMetadata {
  status: AccountStatus;
  statusChangedAt: ISODateString | null;
  statusChangedBy: ID | null;
  statusReason: string | null;
}

// Extend User interface
interface User {
  // ... existing fields ...
  accountStatus: AccountStatus;         // NEW: Account state
  statusChangedAt: ISODateString | null; // NEW: Last status change
  statusChangedBy: ID | null;            // NEW: Who changed status
  lastRoleChangeAt: ISODateString | null; // NEW: Last role modification
  lastRoleChangeBy: ID | null;            // NEW: Who modified roles
}
```

#### 1.2 Define User Audit Types
**File:** `/lib/types/audit.ts`
**References:** Capability Requirement: "Administrative actions SHOULD be recorded"

```typescript
// Add user management audit actions
type UserAuditAction =
  | "user_created"
  | "user_role_granted"
  | "user_role_revoked"
  | "user_email_changed"
  | "user_username_changed"
  | "user_suspended"
  | "user_reactivated"
  | "user_deleted"
  | "user_lockout_triggered"
  | "user_lockout_cleared";

interface UserAuditEntry {
  id: ID;
  timestamp: ISODateString;
  action: UserAuditAction;
  actor: {
    userId: ID;
    role: "admin" | "system";
  };
  targetUserId: ID;
  details: {
    previousValue?: unknown;
    newValue?: unknown;
    reason?: string;
  };
}
```

#### 1.3 Create User Audit Storage
**File:** `/lib/storage/user-audit.ts` (NEW)
**References:** Capability Guarantee: "Participant metadata transitions MUST be atomic"

```typescript
// Functions to implement:
export function createUserAuditEntry(entry: Omit<UserAuditEntry, "id" | "timestamp">): UserAuditEntry;
export function getUserAuditLog(userId: ID, options?: { limit?: number; offset?: number }): UserAuditEntry[];
export function getAllUserAuditLog(options?: { limit?: number; offset?: number; action?: UserAuditAction }): UserAuditEntry[];
```

**Storage Location:** `/data/audit/users/{userId}.json` (array of audit entries per user)

#### 1.4 Extend User Storage Layer
**File:** `/lib/storage/users.ts`
**References:** Capability Requirement: "Modifications to participant roles MUST be immediately propagated"

Add functions:
```typescript
export function suspendUser(userId: ID, actorId: ID, reason: string): User;
export function reactivateUser(userId: ID, actorId: ID): User;
export function updateUserRoles(userId: ID, roles: UserRole[], actorId: ID): User;
```

Update existing functions to:
- Record `lastRoleChangeAt` and `lastRoleChangeBy` on role modifications
- Record `statusChangedAt` and `statusChangedBy` on status changes
- Increment `sessionVersion` on suspension (force logout)

---

### Phase 2: API Endpoints

#### 2.1 Enhance User Update Endpoint
**File:** `/app/api/users/[id]/route.ts`
**References:** Capability Guarantee: "Real-time administrative authorization checks"

Modifications:
- Add audit logging for all changes (email, username, role)
- Record previous and new values in audit entry
- Trigger session invalidation on role demotion
- Return updated audit count in response

#### 2.2 Add User Suspension Endpoint
**File:** `/app/api/users/[id]/suspend/route.ts` (NEW)
**References:** Capability Requirement: "Account Stewardship and Safety"

```typescript
// POST /api/users/{userId}/suspend
// Body: { reason: string }
// - Validates not suspending last admin
// - Sets accountStatus to "suspended"
// - Increments sessionVersion (force logout)
// - Creates audit entry

// DELETE /api/users/{userId}/suspend
// - Reactivates user
// - Sets accountStatus to "active"
// - Creates audit entry
```

#### 2.3 Add User Audit Log Endpoint
**File:** `/app/api/users/[id]/audit/route.ts` (NEW)
**References:** Capability Requirement: "Verifiable audit trail of system governance"

```typescript
// GET /api/users/{userId}/audit
// Query params: ?limit=50&offset=0
// Returns: { entries: UserAuditEntry[], total: number }
```

#### 2.4 Add System Audit Log Endpoint
**File:** `/app/api/audit/users/route.ts` (NEW)
**References:** Capability Requirement: "Systematic Oversight"

```typescript
// GET /api/audit/users
// Query params: ?limit=50&offset=0&action=user_role_granted
// Returns all user management audit entries (admin only)
```

#### 2.5 Enhance User Delete Endpoint
**File:** `/app/api/users/[id]/route.ts`
**References:** Capability Guarantee: "Deletion MUST be an explicit, administrative action"

Modifications:
- Create audit entry before deletion
- Store deleted user metadata in audit entry for forensic purposes
- Cascade delete user's audit log (or archive it)

---

### Phase 3: UI Enhancements

#### 3.1 Add Account Status Column to User Table
**File:** `/app/users/UserTable.tsx`
**References:** Capability Requirement: "Participant records MUST expose verifiable metadata"

Changes:
- Add "Status" column showing active/suspended/locked
- Add color-coded badges (green/yellow/red)
- Add "Suspend/Reactivate" action button
- Add "Last Role Change" column

#### 3.2 Create User Audit Modal
**File:** `/app/users/UserAuditModal.tsx` (NEW)
**References:** Capability Requirement: "Verifiable audit trail"

Features:
- Display chronological list of all actions on user
- Show actor (who performed action), timestamp, and details
- Filter by action type
- Pagination for large histories

#### 3.3 Enhance User Edit Modal
**File:** `/app/users/UserEditModal.tsx`
**References:** Capability Requirement: "Administrators MUST have authority to initiate profile updates"

Changes:
- Add "Account Status" section with suspend/reactivate toggle
- Add "Reason" field when suspending
- Display last role change timestamp and actor
- Add "View Audit History" button linking to audit modal

#### 3.4 Create Admin Audit Dashboard
**File:** `/app/admin/audit/page.tsx` (NEW)
**References:** Capability Requirement: "Systematic Oversight"

Features:
- Global view of all user management actions
- Filter by action type, actor, date range
- Search by target user
- Export capability (CSV)

---

### Phase 4: Validation and Safety Checks

#### 4.1 Enhance Last-Admin Protection
**File:** `/lib/storage/users.ts`
**References:** Capability Guarantee: "MUST prevent deletion or demotion of the final remaining administrative identity"

Add checks for:
- Cannot suspend last admin
- Cannot change last admin's role to non-admin
- Cannot delete last admin
- Return descriptive error message explaining why action was blocked

#### 4.2 Add Role-less State Prevention
**File:** `/lib/storage/users.ts`
**References:** Capability Guarantee: "No identity is left in a role-less state"

Validation:
- Reject any update that would result in empty role array
- Enforce at storage layer (defense in depth with API validation)

#### 4.3 Session Invalidation on Role Changes
**File:** `/lib/storage/users.ts`
**References:** Capability Requirement: "Modifications to participant roles MUST be immediately propagated"

Behavior:
- On role demotion (admin → user, gm → user): increment sessionVersion
- On suspension: increment sessionVersion
- Forces re-authentication with new permissions

---

## Verification Plan

### Automated Tests

#### Unit Tests (`/__tests__/lib/storage/user-audit.test.ts`)

| Test Case | Capability Reference |
|-----------|---------------------|
| Create audit entry records correct timestamp and actor | Audit trail requirement |
| Get user audit log returns entries in chronological order | Systematic oversight |
| Get user audit log respects pagination limits | Large registries navigation |
| Audit entries include previous and new values | Verifiable transitions |

#### Unit Tests (`/__tests__/lib/storage/users.test.ts`)

| Test Case | Capability Reference |
|-----------|---------------------|
| Cannot delete last administrator | Final admin protection |
| Cannot demote last administrator | Final admin protection |
| Cannot suspend last administrator | Final admin protection |
| Role update increments sessionVersion on demotion | Immediate propagation |
| Status update records changedAt and changedBy | Atomic transitions |
| User cannot be left with empty role array | Role-less state prevention |

#### API Tests (`/app/api/users/__tests__/`)

| Test Case | Capability Reference |
|-----------|---------------------|
| PUT /users/:id requires admin role | Administrative authority restriction |
| PUT /users/:id creates audit entry for role change | Audit trail |
| POST /users/:id/suspend creates audit entry | Audit trail |
| DELETE /users/:id/suspend reactivates user and logs | Audit trail |
| GET /users/:id/audit returns only target user's entries | Access control |
| Non-admins receive 403 on all user management endpoints | Authority restriction |

#### Integration Tests (`/__tests__/integration/participant-governance.test.ts`)

| Test Case | Capability Reference |
|-----------|---------------------|
| Full lifecycle: create user → grant role → suspend → reactivate → delete | End-to-end governance |
| Suspended user cannot access protected resources | Session invalidation |
| Role change propagates to next request | Immediate propagation |
| Audit log captures full change history | Verifiable audit trail |

### Manual Verification Steps

1. **Admin Access Control**
   - [ ] Login as non-admin user
   - [ ] Verify /users page returns 403 or redirects
   - [ ] Verify /admin/audit returns 403 or redirects

2. **Last Admin Protection**
   - [ ] With single admin, attempt to delete via UI → Confirm blocked with message
   - [ ] With single admin, attempt to remove admin role → Confirm blocked
   - [ ] With single admin, attempt to suspend → Confirm blocked

3. **Audit Trail Verification**
   - [ ] Change user's role and verify audit entry created
   - [ ] Suspend user and verify audit entry includes reason
   - [ ] Delete user and verify audit entry preserved

4. **Session Invalidation**
   - [ ] Open two browser sessions as same admin user
   - [ ] In session 1, demote user to "user" role only
   - [ ] In session 2, verify next request requires re-authentication

5. **UI Functionality**
   - [ ] Verify user table shows status column with colored badges
   - [ ] Verify audit modal displays chronological action history
   - [ ] Verify search and filter work in audit dashboard

---

## Dependency Ordering

```
Phase 1.1 → Phase 1.2 → Phase 1.3 → Phase 1.4
                              ↓
Phase 2.1 → Phase 2.2 → Phase 2.3 → Phase 2.4 → Phase 2.5
                              ↓
Phase 3.1 → Phase 3.2 → Phase 3.3 → Phase 3.4
                              ↓
Phase 4.1 → Phase 4.2 → Phase 4.3
                              ↓
                     Verification
```

**Critical Path:** Types (1.1, 1.2) → Storage (1.3, 1.4) → APIs (2.x) → UI (3.x)

Phase 4 (validation) should be implemented incrementally alongside Phases 1-3, not as a separate final phase.

---

## File Summary

### New Files
| File | Purpose |
|------|---------|
| `/lib/storage/user-audit.ts` | Audit entry CRUD for user management |
| `/app/api/users/[id]/suspend/route.ts` | Suspend/reactivate user endpoint |
| `/app/api/users/[id]/audit/route.ts` | User-specific audit log endpoint |
| `/app/api/audit/users/route.ts` | Global user audit log endpoint |
| `/app/users/UserAuditModal.tsx` | Audit history modal component |
| `/app/admin/audit/page.tsx` | Admin audit dashboard page |
| `/__tests__/lib/storage/user-audit.test.ts` | Audit storage tests |
| `/__tests__/integration/participant-governance.test.ts` | Integration tests |

### Modified Files
| File | Changes |
|------|---------|
| `/lib/types/user.ts` | Add AccountStatus, status metadata fields |
| `/lib/types/audit.ts` | Add UserAuditAction, UserAuditEntry types |
| `/lib/storage/users.ts` | Add suspend/reactivate, enhance update with audit |
| `/app/api/users/[id]/route.ts` | Add audit logging to PUT/DELETE |
| `/app/users/UserTable.tsx` | Add status column, suspend action |
| `/app/users/UserEditModal.tsx` | Add status section, audit link |

---

## ADR References

- **ADR-001 (File-Based Storage):** Audit entries will use same atomic write pattern
- **ADR-002 (Session Management):** sessionVersion mechanism used for forced logout
- **ADR-003 (Role-Based Access):** Extends existing RBAC without breaking changes
