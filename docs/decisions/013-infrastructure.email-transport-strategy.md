# ADR-013.infrastructure: Email Transport Strategy

## Decision

The system MUST use **environment-specific email transports** to ensure safe development, reliable testing, and production delivery:

| Environment  | Transport               | Provider                        |
| ------------ | ----------------------- | ------------------------------- |
| Development  | Local capture           | Mailpit (Docker) or file-based  |
| Test/Staging | Cloud sandbox           | Mailtrap                        |
| Production   | Transactional email API | Resend (primary recommendation) |

Email transport MUST be selected via environment configuration, with no code changes required between environments.

## Context

Shadow Master requires email delivery for security-critical features:

- **Email verification** - Confirming account ownership at registration
- **Password reset** - Secure recovery flow for forgotten passwords
- **Security alerts** - Notifications for suspicious activity, account lockout
- **Future features** - Campaign invites, turn alerts, session reminders

Email infrastructure introduces risks that vary by environment:

- **Development**: Accidental delivery to real users, spam complaints, blocked sender reputation
- **Testing**: Need to inspect email content without real delivery
- **Production**: Deliverability, reliability, and compliance requirements

A consistent abstraction layer allows feature development without environment-specific code paths.

## Consequences

### Positive

- **Safe Development**: Emails captured locally; no risk of accidental production delivery
- **Inspectable Testing**: QA can view rendered emails in Mailtrap web interface
- **Production Reliability**: Resend/SendGrid provide high deliverability and analytics
- **Environment Parity**: Same email-sending code runs everywhere; only transport differs
- **Cost Efficiency**: Free tiers sufficient for development and low-volume testing

### Negative

- **Infrastructure Dependency**: Production email requires external service account
- **Delivery Latency**: All transports add latency vs. synchronous operations
- **Failure Modes**: Email delivery failures must be handled gracefully (queuing, retries)
- **Configuration Complexity**: Multiple environment variables for each transport

## Transport Details

### Development: Mailpit

[Mailpit](https://mailpit.axllent.org/) is a modern, actively-maintained email testing tool that captures all outgoing emails for local inspection.

**Configuration:**

```env
EMAIL_TRANSPORT=smtp
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
```

**Docker Compose integration:**

```yaml
services:
  mailpit:
    image: axllent/mailpit
    ports:
      - "1025:1025" # SMTP
      - "8025:8025" # Web UI
```

**Web UI**: http://localhost:8025 displays all captured emails.

**Alternative**: File transport writes emails to `/data/emails/` as `.eml` files for environments without Docker.

### Test/Staging: Mailtrap

[Mailtrap](https://mailtrap.io/) provides a cloud-based email sandbox that captures emails without delivering them.

**Benefits:**

- Team members can view test emails without local setup
- Spam score analysis
- HTML/text preview with rendering validation
- API access for automated testing assertions

**Configuration:**

```env
EMAIL_TRANSPORT=smtp
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<mailtrap-user>
SMTP_PASS=<mailtrap-pass>
```

### Production: Resend

[Resend](https://resend.com/) is recommended for production transactional email:

**Why Resend:**

- Modern API designed for developers
- React Email integration for template development
- Generous free tier (3,000 emails/month)
- Good deliverability defaults
- Simple SDK

**Alternatives considered:**

- **SendGrid**: More established, but complex pricing and configuration
- **AWS SES**: Cheapest at scale, but requires more setup and warm-up
- **Postmark**: Excellent deliverability, but higher cost

**Configuration:**

```env
EMAIL_TRANSPORT=resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@shadowmaster.app
```

## Email Types and Priority

| Email Type            | Bypass Batching | Retry Policy               | Template Required |
| --------------------- | --------------- | -------------------------- | ----------------- |
| Email verification    | Yes             | 3 attempts, 5 min backoff  | Yes               |
| Password reset        | Yes             | 3 attempts, 5 min backoff  | Yes               |
| Account lockout alert | Yes             | 3 attempts, 5 min backoff  | Yes               |
| Campaign invite       | No              | 3 attempts, 1 hour backoff | Yes               |
| Turn reminder         | No              | 1 attempt                  | Yes               |

Security-critical emails MUST bypass any batching or digest mechanisms.

## Alternatives Considered

- **Single provider for all environments**: Rejected. Risk of accidental production delivery during development; higher cost for test environments.
- **Self-hosted SMTP (Postfix)**: Rejected. Deliverability challenges, IP reputation management, and maintenance overhead inappropriate for this project.
- **No email abstraction**: Rejected. Would require conditional code paths and increase risk of environment-specific bugs.

## Related Capabilities

- `draft-infrastructure.notifications` - Email delivery requirements
- `security.account-security` - Password reset, security alerts
- `security.account-governance` - Email verification

## Related ADRs

- ADR-001: Account Security Defense (defines email notification requirements)
