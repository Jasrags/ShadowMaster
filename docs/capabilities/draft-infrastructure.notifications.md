# Notification Infrastructure Capability

> [!NOTE] > **Draft Status:** This capability is in draft. This is a cross-cutting infrastructure capability that many other features depend upon.

## Purpose

The Notification Infrastructure capability ensures reliable delivery of time-sensitive information to users across multiple channels. It provides email, push notification, and in-app notification services with preference management and delivery tracking, enabling features like async play turn alerts, session invites, and account security notifications.

## Guarantees

- Notification delivery MUST be attempted through user-configured channels.
- Failed notification attempts MUST be logged and retryable.
- The system MUST NOT send notifications to users who have opted out.
- Notification content MUST respect user privacy and data sensitivity rules.
- The system MUST support development and testing without sending real emails.

## Requirements

### Email Delivery

- The system MUST support sending transactional emails (password reset, session invites, turn alerts).
- Email delivery MUST use a configurable transport provider (SMTP, API-based services).
- The system MUST validate email addresses before delivery attempts.
- Email templates MUST be maintainable and support dynamic content insertion.
- The system MUST track email delivery status (sent, delivered, bounced, failed).
- Emails MUST include proper headers (Reply-To, List-Unsubscribe) for deliverability.

### Push Notifications

- The system MAY support web push notifications via Service Workers.
- The system MAY support mobile push notifications where platform permits.
- Push notification subscriptions MUST be stored per device/browser.
- Users MUST be able to revoke push permissions at any time.
- Push notifications MUST degrade gracefully when unavailable.

### In-App Notifications

- The system MUST provide an in-app notification queue for real-time alerts.
- Notifications MUST persist until acknowledged by the user.
- The system MUST support notification categories (turn alert, system, social).
- Notifications MUST be retrievable via API for client rendering.
- Read/unread status MUST be tracked per notification.

### Preference Management

- Users MUST be able to configure notification preferences per channel (email, push, in-app).
- Preferences MUST be configurable per notification type (turn alerts, session invites, etc.).
- The system MUST support "quiet hours" configuration.
- Users MUST be able to disable all non-essential notifications with a single setting.
- Preference changes MUST take effect immediately.

### Batching and Rate Limiting

- The system MUST support notification batching to prevent spam.
- Batching windows MUST be configurable (immediate, hourly digest, daily digest).
- The system MUST enforce rate limits on notification frequency per user.
- Critical notifications (password reset, security alerts) MUST bypass batching.

### Delivery Tracking

- All notification attempts MUST be logged with timestamp and result.
- The system MUST track delivery failures and categorize failure types.
- Delivery statistics MUST be available for system monitoring.
- Bounce handling MUST update user email validity status.

### Template System

- Email templates MUST support HTML and plain text variants.
- Templates MUST support variable substitution (username, character name, etc.).
- Templates MUST be versioned and auditable.
- The system MUST support localization of notification content.

---

## Development and Testing Support

> [!IMPORTANT] > The system MUST support email testing without sending to real SMTP servers.

### Development Environment

- The system MUST support configurable transport backends:
  - **Mock Transport**: Logs emails to console/file without sending.
  - **Local SMTP Sandbox**: Captures emails in a local testing server.
  - **Cloud Sandbox**: Uses hosted email testing services.
- Development mode MUST be configurable via environment variables.
- Captured test emails MUST be viewable via web interface or API.

### Recommended Testing Tools

The following tools are recommended for development email testing:

| Tool               | Type               | Best For                    | Notes                                                   |
| ------------------ | ------------------ | --------------------------- | ------------------------------------------------------- |
| **Mailpit**        | Local, Open Source | Docker-based development    | Modern Mailhog replacement, actively maintained         |
| **Mailtrap**       | Cloud, Freemium    | Team collaboration, CI/CD   | Spam analysis, HTML validation, production-safe sandbox |
| **Ethereal**       | Cloud, Free        | Quick testing, Nodemailer   | Auto-generated test accounts, no setup                  |
| **File Transport** | Built-in           | Simplest option, unit tests | Writes emails to local files                            |

### Testing Requirements

- Unit tests MUST use mock transport to verify notification content.
- Integration tests MUST use local sandbox (Mailpit) to verify delivery flow.
- CI/CD pipelines MUST NOT send emails to real external services.
- The system MUST provide a test endpoint to trigger sample notifications.

---

## Constraints

- Email delivery MUST NOT block user-facing operations.
- Notification content MUST NOT include sensitive data in push notifications (which may appear on lock screens).
- The system MUST handle provider rate limits gracefully.
- Notification preferences MUST be exportable for GDPR compliance.
- The system MUST NOT retry email delivery indefinitely; maximum retry limits MUST be enforced.

## Non-Goals

- This capability does not define the content or business logic for specific notification types.
- This capability does not provide marketing email or newsletter functionality.
- This capability does not address SMS/text message notifications.
- This capability does not provide email address verification workflows (see `security.account-governance`).

## Dependencies

- `security.account-governance` - User email addresses and account preferences.
- `security.account-security` - Security-related notification triggers.

## Dependents

The following capabilities depend on this infrastructure:

- `campaign.async-play` - Turn alerts, deadline reminders.
- `campaign.live-sessions` - Session invites, join notifications.
- `campaign.participant-governance` - Campaign membership notifications.
- `campaign.governance-approval` - Approval request notifications.
