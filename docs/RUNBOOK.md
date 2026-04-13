# Runbook

## Deployment

### Local Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev                    # http://localhost:3000
```

### Docker (Local)

```bash
cp .env.example .env.local
pnpm docker:dev             # Builds and starts containers
pnpm docker:logs            # Tail logs
pnpm docker:down            # Stop
```

### Staging (Portainer)

1. Push image to GHCR: `make docker-push-ghcr`
2. Portainer webhook triggers stack redeploy
3. Verify via amber environment badge in UI

### Production

1. Push tagged image to registry
2. Deploy via Portainer or manual `docker compose up -d`
3. Verify: no environment badge visible in UI

## Health Check

```bash
# Local
curl http://localhost:3000/api/health

# Script-based
pnpm health-check
```

## Common Issues

### Build Failures

```bash
pnpm type-check      # Check for TypeScript errors first
pnpm lint             # Then lint errors
pnpm knip             # Dead code / unused exports
```

### Data Validation Errors

```bash
pnpm verify-data      # JSON structure validation
pnpm verify-naming    # kebab-case convention check
pnpm verify-reference # Reference data consistency
```

### Test Failures

```bash
pnpm test             # Run all unit tests
pnpm test:e2e         # Run E2E tests
pnpm check-tests      # Find coverage gaps
```

### Email Not Working

1. Check `EMAIL_TRANSPORT` in `.env.local`
2. For local dev: use `file` transport (emails saved to `data/emails/`)
3. For SMTP: verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
4. For Resend: verify `RESEND_API_KEY`

### Docker Issues

```bash
pnpm docker:build:fresh   # Rebuild without cache
pnpm docker:logs          # Check container logs
pnpm docker:down          # Clean restart
```

## Rollback

### Code Rollback

```bash
git log --oneline -10          # Find target commit
git revert <commit-sha>        # Create revert commit
# Or for Docker deployment:
docker compose down
IMAGE_TAG=<previous-tag> docker compose up -d
```

### Data Rollback

```bash
pnpm backup                    # Create backup first
# Restore from backup in data/ directory
```

## Monitoring

- **Sentry**: Error tracking and performance monitoring (`@sentry/nextjs`)
- **Pino logs**: Structured JSON logging (check `LOG_LEVEL` setting)
- **Environment badge**: Visual indicator in UI header
  - Purple = local, Blue = docker, Amber = staging, Hidden = production
