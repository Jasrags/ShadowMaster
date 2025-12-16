# Portainer Deployment Guide

This guide explains how to deploy the Shadow Master application using Portainer and the Docker images published to GitHub Container Registry (GHCR).

## Prerequisites

- Portainer CE or EE installed and running
- Access to your Portainer instance (local or remote)
- Docker environment connected to Portainer
- Network access to GitHub Container Registry (ghcr.io)

## Table of Contents

1. [Connecting to GHCR](#connecting-to-ghcr)
2. [Deploying as a Container](#deploying-as-a-container)
3. [Deploying as a Stack](#deploying-as-a-stack)
4. [Environment Variables](#environment-variables)
5. [Updating the Deployment](#updating-the-deployment)
6. [Troubleshooting](#troubleshooting)

## Connecting to GHCR

### Option 1: Public Images (if repository is public)

If your repository is public, you can pull images without authentication:

```bash
docker pull ghcr.io/jasrags/shadow-master:latest
```

### Option 2: Private Images (authentication required)

For private repositories, you need to authenticate with GHCR:

1. **Create a GitHub Personal Access Token (PAT)**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `read:packages`
   - Copy the generated token

2. **Configure Portainer Registry**:
   - In Portainer, go to **Registries** → **Add Registry**
   - Select **Custom Registry**
   - Configuration:
     - **Name**: GitHub Container Registry
     - **Registry URL**: `ghcr.io`
     - **Authentication**: Enabled
     - **Username**: Your GitHub username
     - **Password**: Your Personal Access Token
   - Click **Add registry**

## Deploying as a Container

### Quick Deployment

1. Navigate to **Containers** → **Add container**

2. **Basic Configuration**:
   - **Name**: `shadow-master`
   - **Image**: `ghcr.io/jasrags/shadow-master:latest`

3. **Network ports configuration**:
   - Click **publish a new network port**
   - **host**: `3000`
   - **container**: `3000`
   - **protocol**: `TCP`

4. **Advanced container settings** (optional but recommended):
   - **Restart policy**: `Unless stopped`
   - **Runtime & Resources**: Set memory limits if needed (e.g., 512MB)

5. **Environment variables** (see [Environment Variables](#environment-variables) section)

6. Click **Deploy the container**

### Verifying the Deployment

1. Check container logs in Portainer:
   - Go to **Containers** → Click on `shadow-master`
   - View **Logs** tab
   - Look for "Ready" or "Server listening on port 3000"

2. Access the application:
   - Open browser to `http://<portainer-host>:3000`
   - Or if using localhost: `http://localhost:3000`

3. Check health:
   - Visit `http://<portainer-host>:3000/api/health`
   - Should return `{"status":"ok","timestamp":"..."}`

## Deploying as a Stack

Stacks provide better configuration management and multi-service deployments. The recommended stack configuration includes:

- **Persistent volumes** for user and character data (`/data/users` and `/data/characters`)
- **Watchtower** for automated container updates
- **Health checks** for monitoring container status

### Recommended: Use the Provided Stack File

The repository includes a ready-to-use stack configuration file: `docker-compose.stack.yml`

1. Navigate to **Stacks** → **Add stack**

2. **Name**: `shadow-master`

3. **Build method**: Choose one:
   - **Web editor**: Copy and paste the contents of `docker-compose.stack.yml`
   - **Repository**: Use Git repository method and reference the file
   - **Upload**: Upload the `docker-compose.stack.yml` file directly

4. **Stack file content** (from `docker-compose.stack.yml`):

The stack includes:
- Shadow Master application service with persistent volumes
- Watchtower service for automatic updates
- Named volumes for data persistence
- Health checks and restart policies

See the `docker-compose.stack.yml` file in the repository root for the complete configuration.

### Key Features of the Stack Configuration

**Persistent Volumes:**
- `shadow-master-users`: Stores user account data (`/data/users`)
- `shadow-master-characters`: Stores character data (`/data/characters`)
- Data persists across container updates and recreations

**Watchtower Integration:**
- Automatically monitors for new image versions
- Updates containers when new images are available
- Configurable poll interval (default: 1 hour)
- Automatic cleanup of old images

**Health Monitoring:**
- Built-in health checks via `/api/health` endpoint
- Automatic container restart on failure
- Start period grace time for application initialization

5. **Environment variables** (optional):
   - Click **Add environment variable** to override stack variables
   - Or use the `.env` file section
   - See [Environment Variables](#environment-variables) section below

6. Click **Deploy the stack**

### Alternative: Minimal Stack (Without Watchtower)

If you prefer manual updates, you can use a minimal stack configuration without Watchtower:

```yaml
services:
  shadow-master:
    image: ghcr.io/jasrags/shadow-master:latest
    container_name: shadow-master-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - shadow-master-users:/app/data/users
      - shadow-master-characters:/app/data/characters
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - shadow-master-network

volumes:
  shadow-master-users:
    driver: local
  shadow-master-characters:
    driver: local

networks:
  shadow-master-network:
    driver: bridge
```

## Environment Variables

Configure these environment variables based on your deployment needs:

### Required Variables

- `NODE_ENV`: Set to `production` for production deployments
- `PORT`: Container port (default: `3000`)

### Optional Variables

Add these as needed for your application:

```bash
# Database configuration (if applicable)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# API Keys (example)
API_KEY=your-api-key-here

# Custom application settings
# Add your application-specific variables here
```

### Setting Variables in Portainer

**For Containers**:
1. Go to container settings
2. Scroll to **Env** section
3. Add variables in key-value format

**For Stacks**:
1. Edit stack
2. Add variables in the `environment:` section
3. Or use the **Environment variables** tab

## Updating the Deployment

### Manual Update (Containers)

1. **Pull the new image**:
   - Go to **Images** → **Pull image**
   - Enter: `ghcr.io/jasrags/shadow-master:latest` (or specific tag)
   - Click **Pull**

2. **Recreate the container**:
   - Go to **Containers** → Select `shadow-master`
   - Click **Recreate**
   - Ensure **Pull latest image** is checked
   - Click **Recreate**

### Manual Update (Stacks)

1. **Pull the new image**:
   - Go to **Stacks** → Select `shadow-master`
   - Click **Pull and redeploy**
   
2. **Alternative method**:
   - Click **Editor**
   - Update image tag if needed (e.g., `:v1.0.0` → `:v1.1.0`)
   - Click **Update the stack**

### Automated Updates with Watchtower

The provided `docker-compose.stack.yml` includes Watchtower for automated container updates.

**How Watchtower Works:**
- Polls Docker registry (GHCR) at configured intervals
- Detects when new images are available
- Automatically pulls and updates containers with the `com.centurylinklabs.watchtower.enable=true` label
- Cleans up old images to save disk space

**Configuration:**
- **Poll Interval**: Default is 3600 seconds (1 hour) for production
- **Cleanup**: Automatically removes old images after updates
- **Label-based**: Only updates containers with the watchtower label

**Adjusting Poll Interval:**
Edit the `WATCHTOWER_POLL_INTERVAL` environment variable in the stack:
- `300` = 5 minutes (for testing/staging)
- `3600` = 1 hour (recommended for production)
- `86400` = 24 hours (for critical production)

**Disabling Watchtower:**
If you prefer manual updates, you can:
1. Remove the watchtower service from the stack
2. Remove the `com.centurylinklabs.watchtower.enable=true` label from the shadow-master service

> [!WARNING]
> Automatic updates in production should be carefully considered. Test updates in staging first. Watchtower will update containers automatically, so ensure you have proper backups and monitoring in place.

## Data Management and Backups

### Persistent Volumes

The stack configuration uses Docker named volumes to persist user and character data:

- **shadow-master-users**: User account data stored in `/app/data/users`
- **shadow-master-characters**: Character data stored in `/app/data/characters`

These volumes persist data across container updates, recreations, and restarts.

### Backup Strategy

**Option 1: Backup Docker Volumes Directly**

```bash
# List volumes
docker volume ls

# Backup a volume
docker run --rm \
  -v shadow-master-users:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/users-backup-$(date +%Y%m%d).tar.gz -C /data .

docker run --rm \
  -v shadow-master-characters:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/characters-backup-$(date +%Y%m%d).tar.gz -C /data .
```

**Option 2: Backup via Container**

```bash
# Create backup from running container
docker exec shadow-master-app tar czf /tmp/users-backup.tar.gz -C /app/data/users .
docker exec shadow-master-app tar czf /tmp/characters-backup.tar.gz -C /app/data/characters .
docker cp shadow-master-app:/tmp/users-backup.tar.gz .
docker cp shadow-master-app:/tmp/characters-backup.tar.gz .
```

**Option 3: Use Bind Mounts (Advanced)**

For more control over backup location, you can modify the stack to use bind mounts:

```yaml
volumes:
  - /path/to/backups/users:/app/data/users
  - /path/to/backups/characters:/app/data/characters
```

> [!NOTE]
> When using bind mounts, ensure the host directories exist and have correct permissions. The container runs as user `nextjs` (UID 1001).

### Restoring from Backup

```bash
# Restore a volume from backup
docker run --rm \
  -v shadow-master-users:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/users-backup-YYYYMMDD.tar.gz"
```

### Volume Location

Docker volumes are typically stored at:
- **Linux**: `/var/lib/docker/volumes/`
- **macOS/Windows (Docker Desktop)**: Managed by Docker Desktop

To find the exact location:
```bash
docker volume inspect shadow-master-users
```

## Troubleshooting

### Container won't start

1. **Check logs**:
   ```bash
   docker logs shadow-master-app
   ```

2. **Common issues**:
   - Port 3000 already in use → Change host port
   - Missing environment variables → Check required vars
   - Image pull failed → Verify GHCR authentication

### Application not accessible

1. **Verify container is running**:
   - Check Portainer containers list
   - Status should be "running"

2. **Check port mapping**:
   - Ensure port is published correctly
   - Verify firewall rules allow traffic

3. **Test locally on Portainer host**:
   ```bash
   curl http://localhost:3000/api/health
   ```

### Health check failing

1. **Inspect health check logs**:
   - Go to container **Inspect** tab
   - Check **Health** section

2. **Common causes**:
   - Application not fully started → Wait longer
   - Health endpoint misconfigured
   - Container resource constraints

### Image pull errors

1. **Authentication failed**:
   - Verify GHCR credentials in Portainer
   - Check PAT has `read:packages` permission
   - Ensure token hasn't expired

2. **Image not found**:
   - Verify image name is correct
   - Check if image was actually published
   - Confirm tag exists (e.g., `latest` vs `v1.0.0`)

### Volume and data persistence issues

1. **Data not persisting after container restart**:
   - Verify volumes are properly defined in the stack
   - Check volume mount paths match (`/app/data/users`, `/app/data/characters`)
   - Ensure volumes exist: `docker volume ls | grep shadow-master`
   - Inspect volume: `docker volume inspect shadow-master-users`

2. **Permission errors on volumes**:
   - Container runs as user `nextjs` (UID 1001)
   - If using bind mounts, ensure host directory permissions allow UID 1001
   - Check container logs for permission errors

3. **Volume backup/restore issues**:
   - Ensure container is stopped before backing up volumes (or use live backup methods)
   - Verify backup file integrity before restoring
   - Test restore in a separate environment first

### Performance issues

1. **Set resource limits**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
       reservations:
         memory: 256M
   ```

2. **Monitor container stats**:
   - Use Portainer **Stats** view
   - Check CPU and memory usage

### Watchtower issues

1. **Watchtower not updating containers**:
   - Verify container has label: `com.centurylinklabs.watchtower.enable=true`
   - Check Watchtower logs: `docker logs shadow-master-watchtower`
   - Ensure `WATCHTOWER_LABEL_ENABLE=true` is set in Watchtower environment
   - Verify image registry is accessible from Watchtower container

2. **Too frequent updates**:
   - Increase `WATCHTOWER_POLL_INTERVAL` (default: 3600 seconds = 1 hour)
   - Use specific image tags instead of `latest` in production

3. **Old images not being cleaned up**:
   - Verify `WATCHTOWER_CLEANUP=true` is set
   - Check available disk space: `docker system df`

## Additional Resources

- [Portainer Documentation](https://docs.portainer.io/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Project CI/CD Guide](./cicd-guide.md)

## Security Best Practices

> [!CAUTION]
> - Never commit secrets or API keys to version control
> - Use Portainer's secrets management for sensitive data
> - Keep your Personal Access Token secure and rotate regularly
> - Use specific image tags in production rather than `latest`
> - Enable Docker Content Trust for image verification
