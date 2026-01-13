# Account Security Capability Walkthrough

## Overview

This walkthrough audits the implementation of the **Account Security** capability against its defined guarantees, requirements, and constraints.

**Capability Document:** [security.account-security.md](../security.account-security.md)  
**Implementation Locations:**

- `/lib/auth/password.ts` - Password hashing
- `/lib/auth/session.ts` - Session management
- `/lib/security/rate-limit.ts` - Rate limiting
- `/lib/security/audit-logger.ts` - Security auditing
- `/app/api/auth/signin/route.ts` - Sign-in endpoint

---

## Capability Fulfillment Table

### Guarantees

| Guarantee                                               | Code Location                        | Status | Evidence                                        |
| ------------------------------------------------------- | ------------------------------------ | ------ | ----------------------------------------------- |
| Accounts MUST be protected against brute-force attempts | `app/api/auth/signin/route.ts:21-47` | ✅ Met | IP and account-based rate limiting              |
| Endpoints MUST enforce restrictive rate limits          | `app/api/auth/signin/route.ts:11-12` | ✅ Met | 20/15min IP, 5/15min account                    |
| Sessions MUST be invalidated on password change         | `lib/auth/session.ts:40-44`          | ✅ Met | `sessionVersion` check invalidates old sessions |
| Security-critical events MUST be recorded               | `lib/security/audit-logger.ts`       | ✅ Met | `AuditLogger.log()` for all auth events         |

### Requirements

#### Access Protection

| Requirement                                                 | Code Location                                      | Status | Evidence                                       |
| ----------------------------------------------------------- | -------------------------------------------------- | ------ | ---------------------------------------------- |
| Authentication MUST NOT reveal specific credential failures | `app/api/auth/signin/route.ts:52-61`               | ✅ Met | Unified `"Invalid email or password"` response |
| Account access MUST be restricted after failed attempts     | `lib/storage/users.ts` `incrementFailedAttempts()` | ✅ Met | `lockoutUntil` set after threshold             |
| Restrictions MUST automatically expire                      | `app/api/auth/signin/route.ts:63-69`               | ✅ Met | Lockout checked with time comparison           |

#### Rate Control

| Requirement                                              | Code Location                              | Status | Evidence                       |
| -------------------------------------------------------- | ------------------------------------------ | ------ | ------------------------------ |
| Auth requests MUST be rate-limited by account and source | `app/api/auth/signin/route.ts:21-47`       | ✅ Met | Separate IP and email limiters |
| Account creation MUST be restricted by source            | Signup endpoint                            | ✅ Met | Rate limiting on signup        |
| Consistent rate limit algorithm                          | `lib/security/rate-limit.ts` `RateLimiter` | ✅ Met | Configurable window and max    |

#### Session Integrity

| Requirement                                         | Code Location               | Status | Evidence                                        |
| --------------------------------------------------- | --------------------------- | ------ | ----------------------------------------------- |
| Sessions MUST be managed through secure identifiers | `lib/auth/session.ts:12-23` | ✅ Met | `httpOnly`, `secure`, `sameSite` flags          |
| Password change MUST revoke all sessions            | Session version increment   | ✅ Met | `sessionVersion` incremented on password change |
| Every request MUST verify session validity          | `lib/auth/session.ts:31-47` | ✅ Met | `getSession()` validates version                |
| Sessions MUST use secure transport                  | `lib/auth/session.ts:18`    | ✅ Met | `secure: process.env.NODE_ENV === "production"` |

#### Integrity Auditing

| Requirement                                       | Code Location                                    | Status | Evidence                                 |
| ------------------------------------------------- | ------------------------------------------------ | ------ | ---------------------------------------- |
| Every auth attempt MUST result in security record | `app/api/auth/signin/route.ts:24,42,59,64,75,85` | ✅ Met | `AuditLogger.log()` on all paths         |
| Sensitive modifications MUST be recorded          | Audit logger                                     | ✅ Met | `password.change` event type             |
| Records MUST NOT include sensitive credentials    | `lib/security/audit-logger.ts:15-22`             | ✅ Met | Only `userId`, `email`, `ip`, `metadata` |

### Constraints

| Constraint                                                     | Code Location               | Status | Evidence                   |
| -------------------------------------------------------------- | --------------------------- | ------ | -------------------------- |
| Restrictions MUST NOT prevent legitimate access beyond minimum | Timed lockout               | ✅ Met | 15-minute lockout duration |
| Passwords MUST NOT be stored in plaintext                      | `lib/auth/password.ts:1-10` | ✅ Met | bcrypt with 12 salt rounds |
| Audit logging MUST NOT expose sensitive data                   | `SecurityRecord` type       | ✅ Met | No password fields         |

---

## Security Event Types

```typescript
type SecurityEvent =
  | "signin.success"
  | "signin.failure"
  | "signup.success"
  | "lockout.triggered"
  | "lockout.expired"
  | "password.change";
```

---

## Session Security Features

- **httpOnly**: Cookie not accessible via JavaScript
- **secure**: Cookie only sent over HTTPS in production
- **sameSite**: "lax" prevents CSRF attacks
- **Session versioning**: Password changes invalidate all existing sessions

---

## Conclusion

The Account Security capability is **fully implemented** with comprehensive brute-force protection, rate limiting, session integrity, and security auditing.

**Verification Date:** 2025-12-30  
**Verified By:** AI Audit
