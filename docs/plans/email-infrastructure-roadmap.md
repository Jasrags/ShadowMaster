# Email Infrastructure Roadmap

> **Status:** Planning
> **Created:** 2026-01-23
> **Related ADRs:** [013-Email Transport Strategy](../decisions/013-infrastructure.email-transport-strategy.md), [014-Hybrid Authentication Model](../decisions/014-security.hybrid-authentication-model.md)
> **Related Capabilities:** [draft-infrastructure.notifications](../capabilities/draft-infrastructure.notifications.md), [security.account-security](../capabilities/security.account-security.md)

---

## Overview

This roadmap outlines the phased implementation of email infrastructure to support account security features (email verification, password reset) and future notification capabilities.

---

## Phase 1: Email Infrastructure Foundation

**Goal:** Establish email sending capability with environment-appropriate transports.

### Deliverables

- [ ] Email service abstraction layer (`lib/email/`)
- [ ] Transport implementations:
  - [ ] SMTP transport (for Mailpit dev, Mailtrap test)
  - [ ] Resend API transport (for production)
  - [ ] File transport (fallback for environments without SMTP)
- [ ] Environment configuration (`EMAIL_TRANSPORT`, provider credentials)
- [ ] Docker Compose addition for Mailpit
- [ ] Basic email template system (HTML + plain text)
- [ ] Unit tests with mock transport

### Environment Variables

```env
# Transport selection
EMAIL_TRANSPORT=smtp|resend|file

# SMTP configuration (Mailpit, Mailtrap)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=

# Resend configuration (production)
RESEND_API_KEY=

# Common
EMAIL_FROM=noreply@shadowmaster.app
EMAIL_FROM_NAME=Shadow Master
```

### File Structure

```
lib/
└── email/
    ├── index.ts              # Public API: sendEmail()
    ├── types.ts              # Email types (EmailMessage, EmailResult)
    ├── transports/
    │   ├── smtp.ts           # Nodemailer SMTP transport
    │   ├── resend.ts         # Resend API transport
    │   └── file.ts           # File-based transport for testing
    ├── templates/
    │   ├── base.tsx          # Base template layout (React Email)
    │   ├── verification.tsx  # Email verification template
    │   └── password-reset.tsx # Password reset template
    └── __tests__/
        └── email.test.ts
```

### Dependencies to Add

```json
{
  "dependencies": {
    "nodemailer": "^6.9.x",
    "resend": "^3.x.x",
    "@react-email/components": "^0.x.x"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.x"
  }
}
```

---

## Phase 2: Email Verification

**Goal:** Require email verification for new accounts; verify email changes.

### Deliverables

- [ ] Verification token generation and storage
- [ ] `POST /api/auth/verify-email` - Request verification email
- [ ] `GET /api/auth/verify-email/[token]` - Confirm verification
- [ ] User record updates: `emailVerified: boolean`, `emailVerifiedAt: string`
- [ ] Verification email template
- [ ] Resend verification flow
- [ ] Account status handling (unverified accounts)

### User Flow

```
Registration:
1. User signs up with email/password
2. Account created with emailVerified=false
3. Verification email sent automatically
4. User clicks link → emailVerified=true
5. Full account access granted

Email Change:
1. User requests email change in settings
2. Verification email sent to NEW address
3. User clicks link → email updated, emailVerified=true
```

### Token Requirements

- 32+ bytes cryptographically random
- URL-safe base64 encoding
- Stored as bcrypt hash (not plaintext)
- 24-hour expiration
- Single-use (deleted after verification)
- Rate limited: 3 requests per email per hour

### Decision Point

**Should unverified accounts have restricted access?**

Options:

1. **Full access, reminder banner** - Least friction, users can still use the app
2. **Read-only access** - Can view but not create/modify
3. **No access until verified** - Most secure, highest friction

Recommendation: Option 1 for MVP, consider tightening later.

---

## Phase 3: Password Reset

**Goal:** Secure password recovery flow via email.

### Deliverables

- [ ] `POST /api/auth/forgot-password` - Request reset email
- [ ] `GET /api/auth/reset-password/[token]` - Validate token, show reset form
- [ ] `POST /api/auth/reset-password` - Complete reset with new password
- [ ] Password reset email template
- [ ] Session invalidation on password reset (per ADR-001, ADR-008)
- [ ] Rate limiting: 3 requests per email per hour

### User Flow

```
1. User clicks "Forgot password?" on sign-in page
2. User enters email address
3. System sends reset email (success message shown regardless of email existence)
4. User clicks link → shown password reset form
5. User enters new password → password updated, all sessions invalidated
6. User redirected to sign-in page
```

### Token Requirements

- Same as verification tokens
- 1-hour expiration (shorter for security)
- Single-use
- Stored as hash

### Security Considerations

- Always show success message (prevent email enumeration)
- Log all reset requests for security auditing
- Invalidate all sessions on successful reset
- Rate limit aggressively

---

## Phase 4: Security Alerts

**Goal:** Notify users of security-relevant events.

### Deliverables

- [ ] Account lockout notification email
- [ ] New device/location sign-in alert (optional, may defer)
- [ ] Password change confirmation email
- [ ] Email templates for each alert type

### Alert Types

| Event                            | Email Sent                 | Bypassable |
| -------------------------------- | -------------------------- | ---------- |
| Account locked (failed attempts) | Yes                        | No         |
| Password changed                 | Yes                        | No         |
| Email changed                    | Yes (to old address)       | No         |
| New device sign-in               | Optional (user preference) | Yes        |

---

## Phase 5: Magic Link Authentication (Deferred)

**Goal:** Implement passwordless sign-in option per ADR-014.

### Deliverables

- [ ] `POST /api/auth/magic-link` - Request sign-in link
- [ ] `GET /api/auth/magic-link/[token]` - Verify and create session
- [ ] Magic link email template
- [ ] Updated sign-in UI with both options
- [ ] User preference for default method

### Deferred Until

- Email infrastructure is stable and reliable
- Phases 1-3 are complete and tested
- Usage data suggests passwordless would be beneficial

---

## Testing Strategy

### Unit Tests

- Transport abstraction with mock
- Token generation and validation
- Template rendering

### Integration Tests

- Full email flow with Mailpit capture
- Verification and reset flows
- Rate limiting behavior

### E2E Tests

- Registration → verification → sign-in
- Password reset complete flow
- Email change flow

### Manual Testing

- Mailpit web UI inspection (dev)
- Mailtrap inspection (staging)
- Deliverability testing (production)

---

## Monitoring and Observability

### Metrics to Track

- Email send attempts (success/failure by type)
- Verification completion rate
- Password reset completion rate
- Email delivery latency

### Logging

- All email send attempts (no sensitive content)
- Token generation events
- Verification/reset completions
- Rate limit triggers

---

## Open Questions

1. **Resend vs SendGrid vs AWS SES for production?**
   - Recommendation: Start with Resend (simpler), migrate if needed

2. **Should we support email preference (HTML vs plain text)?**
   - Recommendation: Always send both, let email client decide

3. **Email verification grace period?**
   - Recommendation: 7 days before any restrictions, with reminders

4. **Magic link expiration time?**
   - Recommendation: 15 minutes (balance security and UX)

---

## GitHub Issues to Create

When ready to implement, create issues for:

1. `[Infrastructure] Email service abstraction and transports`
2. `[Infrastructure] Docker Compose Mailpit integration`
3. `[Security] Email verification flow`
4. `[Security] Password reset flow`
5. `[Security] Security alert emails`
6. `[Security] Magic link authentication` (future)
