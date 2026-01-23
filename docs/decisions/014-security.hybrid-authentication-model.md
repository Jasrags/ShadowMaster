# ADR-014.security: Hybrid Authentication Model

## Decision

The system WILL support **both password-based and passwordless (magic link) authentication**, with passwordless as the recommended primary method for new users once email infrastructure is stable.

The hybrid approach allows:

1. Password authentication (current, fully implemented)
2. Magic link authentication (future, email-dependent)
3. User choice between methods

This decision is **deferred for implementation** until email infrastructure (ADR-013) is operational. Password authentication remains the only method until then.

## Context

Authentication method selection involves tradeoffs between security, user experience, and infrastructure dependencies:

**Password-based authentication:**

- Self-contained (no external dependencies)
- Immediate sign-in (no latency)
- Vulnerable to credential stuffing, password reuse, phishing
- Requires password reset flow (which needs email anyway)
- Users forget passwords, especially for infrequently-used applications

**Passwordless (magic link) authentication:**

- Eliminates password-related vulnerabilities
- Simpler UX (email only, no password to remember)
- Requires reliable email delivery infrastructure
- Introduces sign-in latency (email delivery time)
- Email account compromise = account compromise

Shadow Master's usage pattern (weekly/monthly gaming sessions) suggests users will frequently forget passwords. However, the application currently has no email infrastructure, making passwordless authentication premature.

## Consequences

### Positive

- **Flexibility**: Users choose the method that works for them
- **Incremental Adoption**: Can introduce magic links without breaking existing accounts
- **Graceful Degradation**: If email fails, password auth still works
- **Reduced Support Burden**: Magic links eliminate "forgot password" for users who adopt them
- **Preserved Investment**: Existing bcrypt password infrastructure is not wasted

### Negative

- **Dual Maintenance**: Two authentication paths to secure and maintain
- **UI Complexity**: Sign-in page must present both options clearly
- **Delayed Benefit**: Full passwordless benefits only realized after email infrastructure is stable
- **User Confusion**: Some users may not understand the difference

## Proposed Sign-In Flow (Future)

```
┌─────────────────────────────────────────────────┐
│  Sign In                                        │
│                                                 │
│  Email: [____________________________]          │
│                                                 │
│  [Send me a sign-in link]  ← Primary action     │
│                                                 │
│  ───────────── or ─────────────                 │
│                                                 │
│  Password: [____________________________]       │
│  [Sign in with password]   ← Secondary option   │
└─────────────────────────────────────────────────┘
```

New accounts may default to passwordless, with an option to set a password in account settings.

## Implementation Phases

| Phase   | Milestone                        | Authentication State                        |
| ------- | -------------------------------- | ------------------------------------------- |
| Current | MVP                              | Password only                               |
| Phase 1 | Email infrastructure operational | Password only (but can send emails)         |
| Phase 2 | Magic link implementation        | Password + Magic link (password primary)    |
| Phase 3 | Adoption measurement             | Password + Magic link (magic link primary)  |
| Future  | Data-driven decision             | Possibly password-optional for new accounts |

## Magic Link Security Requirements

When implemented, magic links MUST:

- Expire after 15 minutes
- Be single-use (invalidated after first use)
- Be cryptographically random (minimum 32 bytes, URL-safe encoding)
- Be stored as hashes (like passwords) to prevent database leak exploitation
- Include rate limiting (max 5 link requests per email per hour)
- Log all link generation and usage for security auditing

## Alternatives Considered

- **Passwordless only**: Rejected. Creates hard dependency on email; no fallback for delivery failures.
- **Password only (status quo)**: Acceptable for MVP, but limits long-term UX improvement.
- **OAuth/Social login**: Deferred to Phase 4+. Adds complexity and third-party dependencies. May be valuable for reducing friction but not critical.
- **WebAuthn/Passkeys**: Deferred. Excellent security but limited browser/device support and complex implementation.

## Related Capabilities

- `security.account-security` - Authentication security requirements
- `security.account-governance` - Account identity management
- `draft-infrastructure.notifications` - Email delivery (required for magic links)

## Related ADRs

- ADR-001: Account Security Defense
- ADR-008: Cookie-Based Sessions (session creation after either auth method)
- ADR-013: Email Transport Strategy (required infrastructure)
