# Email Provider Setup Guide

This guide covers setting up email providers for Shadow Master in staging and production environments.

## Overview

| Environment    | Provider | Purpose                                          |
| -------------- | -------- | ------------------------------------------------ |
| Local (Docker) | Mailpit  | Captures all emails locally for development      |
| Staging        | Mailtrap | Email sandbox - captures emails without delivery |
| Production     | Resend   | Transactional email delivery to real users       |

---

## Mailtrap Setup (Staging)

Mailtrap provides an email sandbox that captures emails for testing without delivering them to real recipients.

### Step 1: Create Account

1. Go to [mailtrap.io](https://mailtrap.io) and sign up
2. You'll land on the dashboard with two products:
   - **Email Testing** - Sandbox for catching test emails
   - **Email Sending** - Transactional API for production

### Step 2: Choose Your Approach

#### Option A: Email Testing (SMTP Sandbox)

Use this for true staging where you want to **catch and inspect** emails without any real delivery.

1. Navigate to **Email Testing** → **Inboxes**
2. Click on your inbox (or create one)
3. Go to **SMTP Settings** tab
4. Find your credentials:
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: (copy this)
   - **Password**: (copy this)

**Portainer Environment Variables:**

```
EMAIL_TRANSPORT=smtp
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<your-username>
SMTP_PASS=<your-password>
EMAIL_FROM=noreply@shadowmaster.app
EMAIL_FROM_NAME=Shadow Master
```

#### Option B: Email Sending (API)

Use this if you want staging to **actually deliver emails** (e.g., to a test email address).

1. Navigate to **Email Sending** → **Sending Domains**
2. Add and verify your domain (requires DNS records)
3. Go to **API Tokens** and create a token
4. Copy the API token

**Note:** This requires adding a Mailtrap API transport to the codebase (not yet implemented). For now, use Option A or Resend for actual delivery.

### Step 3: Configure in Portainer

1. Open Portainer → **Stacks** → **shadow-master**
2. Go to **Environment variables**
3. Add the SMTP credentials from Option A above
4. Click **Update the stack**

### Step 4: Test the Configuration

1. In your staging app, trigger an email:
   - Sign up for a new account (verification email)
   - Request a password reset
   - Request a magic link
2. Go to [mailtrap.io](https://mailtrap.io) → **Email Testing** → **Inboxes**
3. Verify the email appears in your inbox
4. Check:
   - Email renders correctly (HTML tab)
   - Plain text version exists (Text tab)
   - No spam score issues (Analysis tab)

---

## Resend Setup (Production)

Resend is a modern transactional email API with excellent deliverability and React Email integration.

### Step 1: Create Account

1. Go to [resend.com](https://resend.com) and sign up
2. You'll get 3,000 free emails/month

### Step 2: Add and Verify Domain

1. Go to **Domains** → **Add Domain**
2. Enter your domain (e.g., `shadowmaster.app`)
3. Add the required DNS records:

| Type | Name                | Value                                 |
| ---- | ------------------- | ------------------------------------- |
| TXT  | `resend._domainkey` | (provided by Resend)                  |
| TXT  | @ or root           | `v=spf1 include:_spf.resend.com ~all` |

4. Click **Verify** - this can take a few minutes to several hours
5. Status will change from "Pending" to "Verified"

### Step 3: Create API Key

1. Go to **API Keys** → **Create API Key**
2. Give it a name (e.g., "Shadow Master Production")
3. Set permissions:
   - **Sending access**: Full access (or restrict to your domain)
4. Copy the API key immediately (it won't be shown again)
   - Format: `re_xxxxxxxxxx`

### Step 4: Configure in Portainer

For production, you'll need a separate compose file or override. Add these environment variables:

```
EMAIL_TRANSPORT=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Shadow Master
```

**Important:** The `EMAIL_FROM` address must be from your verified domain.

### Step 5: Test the Configuration

#### Quick Test (Before Full Deployment)

Use the test script locally with your Resend API key:

```bash
# Set environment temporarily
export EMAIL_TRANSPORT=resend
export RESEND_API_KEY=re_your_api_key
export EMAIL_FROM=noreply@yourdomain.com

# Run test script
pnpm test-email your-real-email@example.com
```

#### Production Test

1. Deploy with Resend configuration
2. Sign up with a real email address you control
3. Verify you receive the verification email
4. Check your Resend dashboard for delivery status

### Step 6: Monitor Deliverability

In the Resend dashboard:

- **Logs**: View all sent emails and their status
- **Analytics**: Track open rates, bounces, complaints
- **Webhooks**: Set up notifications for bounces/complaints (optional)

---

## Environment Configuration Reference

### Local Development (docker-compose.yml)

```yaml
environment:
  - EMAIL_TRANSPORT=smtp
  - SMTP_HOST=mailpit
  - SMTP_PORT=1025
  - SMTP_SECURE=false
  - EMAIL_FROM=noreply@shadowmaster.local
  - EMAIL_FROM_NAME=Shadow Master
```

Mailpit Web UI: http://localhost:8025

### Staging (docker-compose.portainer.yml)

```yaml
environment:
  - EMAIL_TRANSPORT=smtp
  - SMTP_HOST=sandbox.smtp.mailtrap.io
  - SMTP_PORT=2525
  - SMTP_USER=${MAILTRAP_USER}
  - SMTP_PASS=${MAILTRAP_PASS}
  - EMAIL_FROM=${EMAIL_FROM:-noreply@shadowmaster.app}
  - EMAIL_FROM_NAME=${EMAIL_FROM_NAME:-Shadow Master}
```

### Production

```yaml
environment:
  - EMAIL_TRANSPORT=resend
  - RESEND_API_KEY=${RESEND_API_KEY}
  - EMAIL_FROM=noreply@yourdomain.com
  - EMAIL_FROM_NAME=Shadow Master
```

---

## Troubleshooting

### Emails Not Appearing in Mailtrap

1. Check the SMTP credentials are correct
2. Verify the container can reach `sandbox.smtp.mailtrap.io:2525`
3. Check application logs for email send errors
4. Ensure you're looking at the correct inbox

### Resend Domain Not Verifying

1. DNS propagation can take up to 48 hours (usually faster)
2. Use [dnschecker.org](https://dnschecker.org) to verify records
3. Ensure no typos in the DNS record values
4. Check if your DNS provider requires the full record name (e.g., `resend._domainkey.yourdomain.com`)

### Resend Emails Going to Spam

1. Verify SPF record is correctly set
2. Check DKIM is passing in email headers
3. Avoid spam trigger words in subject/body
4. Warm up your domain by sending gradually
5. Monitor bounce/complaint rates in dashboard

### Email Delivery Delays

- Mailtrap: Should appear within seconds
- Resend: Usually < 10 seconds, check Logs tab for status
- If delayed, check for rate limiting or API errors

---

## Security Notes

- Never commit API keys or SMTP credentials to version control
- Use environment variables in Portainer/Docker
- Rotate API keys periodically
- Monitor for unusual sending patterns
- Keep EMAIL_FROM consistent to build sender reputation

---

## Related Documentation

- [ADR-013: Email Transport Strategy](../decisions/013-infrastructure.email-transport-strategy.md)
- [Email Infrastructure Roadmap](../plans/email-infrastructure-roadmap.md)
- [Portainer Setup Guide](./portainer-setup.md)
