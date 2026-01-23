# Portainer Deployment Setup

This guide covers setting up automated deployment of Shadow Master to Portainer using GitHub Container Registry (GHCR) and Watchtower for automatic updates.

## Prerequisites

- Portainer installed and accessible on your network
- GitHub repository with push access
- Docker image building via GitHub Actions (already configured)

## Architecture

```
Push to main → GitHub Actions builds image → Pushes to GHCR → Watchtower detects new image → Container auto-updates
```

Watchtower polls GHCR every 5 minutes for new images - no exposed ports or webhooks required.

## Step 1: Generate GitHub Personal Access Token

Watchtower needs a token to pull images from GitHub Container Registry.

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Configure:
   - **Note**: `watchtower-ghcr-read`
   - **Expiration**: 90 days (or longer)
   - **Scopes**: Check only `read:packages`
4. Click **Generate token**
5. **Copy the token immediately** - you won't see it again

## Step 2: Configure Docker Registry Auth on Portainer Host

On your Portainer/Docker host, create or update the Docker config file:

```bash
# Create .docker directory if it doesn't exist
mkdir -p ~/.docker

# Login to GHCR (this creates/updates config.json)
docker login ghcr.io -u jasrags -p YOUR_GITHUB_PAT
```

This creates `~/.docker/config.json` which Watchtower will use for authentication.

## Step 3: Configure GHCR Registry in Portainer (Optional)

If you want to manually pull images via Portainer UI:

1. In Portainer, navigate to **Registries** → **Add registry**
2. Fill in:

| Field          | Value                       |
| -------------- | --------------------------- |
| Registry type  | Custom registry             |
| Name           | `GitHub Container Registry` |
| Registry URL   | `ghcr.io`                   |
| Authentication | Enabled                     |
| Username       | `jasrags`                   |
| Password       | _GitHub PAT from Step 1_    |

3. Click **Add registry**

## Step 4: Create the Stack

1. Navigate to **Stacks** → **Add stack**
2. Configure:
   - **Name**: `shadow-master`
   - **Build method**: Web editor
3. Paste the following compose configuration:

```yaml
version: "3.8"

services:
  shadow-master:
    image: ghcr.io/jasrags/shadowmaster:latest
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
    labels:
      - "com.centurylinklabs.watchtower.enable=true"

  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    restart: unless-stopped
    environment:
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=300
      - WATCHTOWER_LABEL_ENABLE=true
      - WATCHTOWER_INCLUDE_RESTARTING=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ~/.docker/config.json:/config.json:ro
    labels:
      - "com.centurylinklabs.watchtower.enable=false"

volumes:
  shadow-master-data:
    driver: local
```

4. Click **Deploy the stack**

## How Watchtower Works

- **Polls every 5 minutes** (`WATCHTOWER_POLL_INTERVAL=300` seconds)
- **Label-based**: Only updates containers with `com.centurylinklabs.watchtower.enable=true`
- **Cleanup**: Removes old images after update (`WATCHTOWER_CLEANUP=true`)
- **Self-exclusion**: Watchtower doesn't update itself (label set to false)

## Verification

### Test the Deployment Pipeline

1. Make a small change to the codebase
2. Commit and push to `main`
3. Watch GitHub Actions: https://github.com/jasrags/ShadowMaster/actions
4. Wait up to 5 minutes for Watchtower to detect the new image
5. Check Watchtower logs in Portainer to see the update

### Check Watchtower Logs

In Portainer, click on the `watchtower` container → **Logs** to see update activity:

```
time="2024-01-15T12:00:00Z" level=info msg="Found new ghcr.io/jasrags/shadowmaster:latest image"
time="2024-01-15T12:00:05Z" level=info msg="Stopping /shadow-master-app"
time="2024-01-15T12:00:10Z" level=info msg="Creating /shadow-master-app"
```

### Verify App is Running

```bash
curl http://<portainer-host>:3000/api/health
# Should return: {"status":"ok"}
```

### Verify Data Persistence

1. Create a test user/character via the UI
2. Wait for Watchtower to update the container (or manually restart)
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

### Watchtower Not Updating

1. Check Watchtower logs for errors
2. Verify `~/.docker/config.json` exists and has GHCR credentials
3. Ensure the GitHub PAT hasn't expired
4. Check the container has the watchtower label enabled

### Container Won't Start

1. Check Portainer logs for the container
2. Verify the image was pulled successfully
3. Check if port 3000 is available

### Registry Authentication Fails

1. Re-run `docker login ghcr.io` on the host
2. Verify the GitHub PAT has `read:packages` scope
3. Check `~/.docker/config.json` permissions

### Data Not Persisting

1. Verify the volume is mounted: check container details in Portainer
2. Ensure the volume wasn't accidentally deleted
3. Check container user permissions on `/app/data`

## Watchtower Configuration Options

To change poll interval or other settings, modify the environment variables:

| Variable                        | Default | Description                         |
| ------------------------------- | ------- | ----------------------------------- |
| `WATCHTOWER_POLL_INTERVAL`      | 300     | Seconds between checks (5 min)      |
| `WATCHTOWER_CLEANUP`            | true    | Remove old images after update      |
| `WATCHTOWER_LABEL_ENABLE`       | true    | Only update labeled containers      |
| `WATCHTOWER_INCLUDE_RESTARTING` | true    | Include restarting containers       |
| `WATCHTOWER_NOTIFICATIONS`      | -       | Optional: email/slack notifications |

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
