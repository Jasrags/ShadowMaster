<!-- Generated: 2026-04-13 | Source: .env.example -->

# Environment Variables

## Application Settings

| Variable              | Required | Description                                                             | Default                 |
| --------------------- | -------- | ----------------------------------------------------------------------- | ----------------------- |
| `NODE_ENV`            | No       | Node environment                                                        | `development`           |
| `NEXT_PUBLIC_APP_ENV` | No       | UI environment badge (`local`, `docker`, `staging`, `production`)       | `local`                 |
| `NEXT_PUBLIC_APP_URL` | No       | Canonical app URL                                                       | `http://localhost:3000` |
| `NEXT_PUBLIC_GIT_SHA` | No       | Git SHA for UI display (set by CI)                                      | —                       |
| `LOG_LEVEL`           | No       | Override log level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`) | env-based               |
| `PORT`                | No       | Application port                                                        | `3000`                  |

## Email Configuration

| Variable                   | Required    | Description                                      | Default             |
| -------------------------- | ----------- | ------------------------------------------------ | ------------------- |
| `EMAIL_TRANSPORT`          | Yes\*       | Transport type: `smtp`, `resend`, `file`, `mock` | `file`              |
| `EMAIL_FROM`               | Yes\*       | Sender email address                             | `noreply@localhost` |
| `EMAIL_FROM_NAME`          | Yes\*       | Sender display name                              | `Shadow Master`     |
| `SMTP_HOST`                | When smtp   | SMTP server hostname                             | `localhost`         |
| `SMTP_PORT`                | When smtp   | SMTP server port                                 | `1025`              |
| `SMTP_SECURE`              | When smtp   | Use TLS                                          | `false`             |
| `SMTP_USER`                | When smtp   | SMTP username                                    | —                   |
| `SMTP_PASS`                | When smtp   | SMTP password                                    | —                   |
| `RESEND_API_KEY`           | When resend | Resend API key (`re_xxx`)                        | —                   |
| `ADMIN_NOTIFICATION_EMAIL` | No          | Admin notification recipient(s), comma-separated | —                   |

\*Required for email features; defaults work for local development.

## Docker & Deployment

| Variable                  | Required    | Description               | Default         |
| ------------------------- | ----------- | ------------------------- | --------------- |
| `HOSTNAME`                | Docker      | Bind address              | `0.0.0.0`       |
| `NEXT_TELEMETRY_DISABLED` | No          | Disable Next.js telemetry | `1`             |
| `REPO`                    | Docker push | Image repository name     | `shadow-master` |
| `IMAGE_TAG`               | Docker push | Image tag                 | `latest`        |

## Container Registry

| Variable             | Required       | Description                               |
| -------------------- | -------------- | ----------------------------------------- |
| `GHCR_REGISTRY`      | GHCR push      | GitHub Container Registry URL (`ghcr.io`) |
| `GHCR_OWNER`         | GHCR push      | GitHub username/org                       |
| `GITHUB_TOKEN`       | GHCR push      | PAT with `write:packages` scope           |
| `DOCKERHUB_REGISTRY` | DockerHub push | Registry URL (`docker.io`)                |
| `DOCKERHUB_OWNER`    | DockerHub push | DockerHub username/org                    |
| `DOCKERHUB_TOKEN`    | DockerHub push | DockerHub access token                    |

## Portainer Deployment (Optional)

| Variable              | Required | Description                        |
| --------------------- | -------- | ---------------------------------- |
| `PORTAINER_WEBHOOK`   | No       | Webhook URL for stack redeployment |
| `PORTAINER_URL`       | No       | Direct API access URL              |
| `PORTAINER_API_TOKEN` | No       | Portainer API token                |

## HTTPS (Caddy Reverse Proxy)

| Variable       | Required | Description                             |
| -------------- | -------- | --------------------------------------- |
| `CF_API_TOKEN` | HTTPS    | Cloudflare API token (DNS-01 challenge) |
| `DOMAIN`       | HTTPS    | Domain for TLS certificate              |
| `HTTPS_PORT`   | HTTPS    | HTTPS port (default: `2075`)            |

## Testing

| Variable            | Required | Description                                              |
| ------------------- | -------- | -------------------------------------------------------- |
| `E2E_BYPASS_SECRET` | No       | Bypasses signup restrictions in non-production E2E tests |
