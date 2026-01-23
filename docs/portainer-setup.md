# Portainer Deployment Setup

This guide covers setting up automated deployment of Shadow Master to Portainer using GitHub Container Registry (GHCR).

## Prerequisites

- Portainer installed and accessible on your network
- GitHub repository with push access
- Docker image building via GitHub Actions (already configured)

## Architecture

```
Push to main → GitHub Actions builds image → Pushes to GHCR → Webhook triggers Portainer → Container redeploys
```

## Step 1: Generate GitHub Personal Access Token

Portainer needs a token to pull images from GitHub Container Registry.

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Configure:
   - **Note**: `portainer-ghcr-read`
   - **Expiration**: 90 days (or longer)
   - **Scopes**: Check only `read:packages`
4. Click **Generate token**
5. **Copy the token immediately** - you won't see it again

## Step 2: Configure GHCR Registry in Portainer

1. In Portainer, navigate to **Registries** → **Add registry**
2. Fill in the following:

| Field          | Value                       |
| -------------- | --------------------------- |
| Registry type  | Custom registry             |
| Name           | `GitHub Container Registry` |
| Registry URL   | `ghcr.io`                   |
| Authentication | Enabled                     |
| Username       | `jasrags`                   |
| Password       | _GitHub PAT from Step 1_    |

3. Click **Add registry**

## Step 3: Create the Stack

1. Navigate to **Stacks** → **Add stack**
2. Configure:
   - **Name**: `shadow-master`
   - **Build method**: Web editor
3. Paste the following compose configuration:

```yaml
version: "3.8"

services:
  shadow-master:
    image: ghcr.io/jasrags/shadow-master:latest
    container_name: shadow-master-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
    restart: unless-stopped
    volumes:
      - shadow-master-data:/app/data
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  shadow-master-data:
    driver: local
```

4. Click **Deploy the stack**

## Step 4: Enable Webhook for Auto-Deployment

1. After the stack deploys, go to your stack details
2. Click the **Settings** (gear icon)
3. Enable **Webhooks**
4. Copy the generated webhook URL (format: `https://your-portainer:9443/api/webhooks/abc123...`)

## Step 5: Add Webhook to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `PORTAINER_WEBHOOK_URL`
   - **Value**: _paste the webhook URL from Step 4_
5. Click **Add secret**

## Verification

### Test the Deployment Pipeline

1. Make a small change to the codebase
2. Commit and push to `main`
3. Watch GitHub Actions: https://github.com/jasrags/ShadowMaster/actions
4. After the workflow completes, verify:
   - Portainer shows the container restarting
   - App is accessible at `http://<portainer-host>:3000`
   - Health check passes: `curl http://<portainer-host>:3000/api/health`

### Check Container Logs

In Portainer, click on the container → **Logs** to view application output.

### Verify Data Persistence

1. Create a test user/character via the UI
2. In Portainer, restart the container
3. Verify the data still exists after restart

## Data Management

### What's Persisted

| Data Type                | Location                | Persistence      |
| ------------------------ | ----------------------- | ---------------- |
| Edition data (SR5 rules) | `/app/data/editions/`   | Baked into image |
| User accounts            | `/app/data/users/`      | Docker volume    |
| Characters               | `/app/data/characters/` | Docker volume    |
| Campaigns                | `/app/data/campaigns/`  | Docker volume    |

### Backup Data

From the Portainer host:

```bash
# Create backup
docker cp shadow-master-app:/app/data ./shadow-master-backup-$(date +%Y%m%d)

# Restore from backup
docker cp ./shadow-master-backup-20240115/. shadow-master-app:/app/data/
```

### Volume Location

```bash
# Find volume on host
docker volume inspect shadowmaster_shadow-master-data
```

## Troubleshooting

### Container Won't Start

1. Check Portainer logs for the container
2. Verify the image was pulled successfully
3. Check if port 3000 is available

### Webhook Not Triggering

1. Verify `PORTAINER_WEBHOOK_URL` secret is set in GitHub
2. Check GitHub Actions logs for the "Trigger Portainer Deployment" step
3. Ensure Portainer is accessible from GitHub (may need public URL or tunnel)

### Registry Authentication Fails

1. Verify the GitHub PAT hasn't expired
2. Ensure the PAT has `read:packages` scope
3. Check username matches exactly (`jasrags`)

### Data Not Persisting

1. Verify the volume is mounted: check container details in Portainer
2. Ensure the volume wasn't accidentally deleted
3. Check container user permissions on `/app/data`

## Optional: External Access

### Expose to Internet

Option 1: Port forwarding on your router (port 3000)

Option 2: Reverse proxy with HTTPS (recommended):

- Use Traefik, nginx, or Caddy
- Configure SSL certificate (Let's Encrypt)
- Example Traefik labels can be added to the compose file

### Custom Domain

1. Set up DNS A record pointing to your public IP
2. Configure reverse proxy with the domain
3. Enable HTTPS via Let's Encrypt
