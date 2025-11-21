# Portainer Deployment Guide

This guide provides step-by-step instructions for deploying ShadowMaster using Portainer.

## Prerequisites

- Portainer instance running and accessible
- Docker registry configured in Portainer (optional, for pulling pre-built images)
- Access to Portainer with stack creation permissions

## Deployment Steps

### Step 1: Prepare Your Image

You have two options:

#### Option A: Build and Push to Registry (Recommended)

1. **Build the image locally**:
   ```bash
   make docker-build
   ```

2. **Tag for your registry**:
   ```bash
   DOCKER_REGISTRY=your-registry.com make docker-tag
   ```

3. **Push to registry**:
   ```bash
   DOCKER_REGISTRY=your-registry.com make docker-push
   ```

#### Option B: Build in Portainer

Portainer can build the image from your Git repository during stack deployment.

### Step 2: Configure Environment Variables

Before deploying, you'll need to provide the following Portainer-specific configuration:

#### Required Information

Please provide the following details:

1. **Registry URL**: 
   - Local Docker registry URL (e.g., `registry.local:5000`)
   - Or Docker Hub username (e.g., `yourusername`)
   - Or leave empty if using Portainer's local images

2. **Network Configuration**:
   - Preferred network name (default: `shadowmaster-network`)
   - Or use existing network name

3. **Volume Configuration**:
   - Named volume name (default: `shadowmaster-data`)
   - Or bind mount path (e.g., `/host/path/to/data:/data`)

4. **Port Mapping**:
   - External port (default: `8080:8080`)
   - Or custom port mapping

5. **Environment Variables**:
   - `SESSION_SECRET`: **REQUIRED** - A secure random string for session signing
   - Any additional environment variables needed

6. **Resource Limits** (optional):
   - CPU limit (e.g., `1` or `0.5`)
   - Memory limit (e.g., `512m` or `1g`)
   - CPU reservation
   - Memory reservation

7. **Restart Policy**:
   - `always`, `unless-stopped`, `on-failure`, or `no`
   - Default: `unless-stopped`

### Step 3: Deploy Stack in Portainer

1. **Navigate to Stacks**:
   - Log into Portainer
   - Go to **Stacks** in the left sidebar
   - Click **Add stack**

2. **Configure Stack**:
   - **Name**: `shadowmaster`
   - **Build method**: Choose one:
     - **Repository**: If building from Git
     - **Web editor**: If pasting compose file directly
     - **Upload**: If uploading compose file

3. **Repository Configuration** (if using Repository method):
   - **Repository URL**: Your Git repository URL
   - **Reference**: Branch or tag (e.g., `main`, `v1.0.0`)
   - **Compose path**: `docker-compose.portainer.yml`
   - **Repository authentication**: If private repo

4. **Environment Variables**:
   Add the following environment variables:

   ```env
   IMAGE_NAME=shadowmaster
   VERSION=0.1.0
   PORT=8080
   SESSION_SECRET=your-secure-random-string-here
   RESTART_POLICY=unless-stopped
   ```

   Optional variables:
   ```env
   CPU_LIMIT=1
   MEMORY_LIMIT=512m
   CPU_RESERVATION=0.5
   MEMORY_RESERVATION=256m
   ```

   Watchtower configuration (automatic updates):
   ```env
   WATCHTOWER_RESTART_POLICY=unless-stopped
   WATCHTOWER_CLEANUP=true
   WATCHTOWER_SCHEDULE=0 0 4 * * *
   WATCHTOWER_CPU_LIMIT=0.1
   WATCHTOWER_MEMORY_LIMIT=64m
   ```

5. **Deploy the Stack**:
   - Click **Deploy the stack**
   - Wait for the stack to be created and container to start

### Step 4: Verify Deployment

1. **Check Stack Status**:
   - In Portainer, go to **Stacks** → `shadowmaster`
   - Verify the service shows as "Running"

2. **Check Container Logs**:
   - Click on the container name
   - Go to **Logs** tab
   - Verify no errors and server started successfully

3. **Test Health Endpoint**:
   ```bash
   curl http://your-server:8080/health
   ```
   Should return: `{"status":"ok"}`

4. **Access Application**:
   - Open browser to `http://your-server:8080`
   - You should see the ShadowMaster login page

## Automatic Updates with Watchtower

The deployment includes Watchtower, which automatically monitors and updates containers when new images are available.

### How Watchtower Works

- **Monitors**: Watchtower checks for new images based on the configured schedule (default: daily at 4 AM UTC)
- **Updates**: When a new image is detected, it automatically pulls and restarts the container
- **Cleanup**: Old images are automatically removed to save disk space
- **Label-based**: Only containers with the `com.centurylinklabs.watchtower.enable=true` label are monitored

### Watchtower Configuration

The following environment variables control Watchtower behavior:

- `WATCHTOWER_SCHEDULE`: Cron schedule for checking updates (default: `0 0 4 * * *` - daily at 4 AM UTC)
- `WATCHTOWER_CLEANUP`: Remove old images after update (default: `true`)
- `WATCHTOWER_INCLUDE_STOPPED`: Include stopped containers (default: `false`)
- `WATCHTOWER_POLL_INTERVAL`: Polling interval in seconds (leave empty to use schedule)

### Disabling Watchtower

To disable automatic updates, you can:
1. Remove the watchtower service from the compose file, or
2. Set `WATCHTOWER_LABEL_ENABLE=false` and remove the label from the shadowmaster service

## Updating the Deployment

### Automatic Updates (Recommended)

With Watchtower enabled, simply push a new image version to your registry:

```bash
# Update VERSION file
echo "1.0.1" > VERSION

# Build and push new version
make docker-build
DOCKER_REGISTRY=your-registry.com make docker-push
```

Watchtower will automatically detect and deploy the new version according to its schedule.

### Manual Update

1. **Build and push new version**:
   ```bash
   # Update VERSION file
   echo "1.0.1" > VERSION
   
   # Build and push
   make docker-build
   DOCKER_REGISTRY=your-registry.com make docker-push
   ```

2. **Update in Portainer**:
   - Go to **Stacks** → `shadowmaster`
   - Click **Editor**
   - Update `VERSION` environment variable
   - Click **Update the stack**

### Update Configuration

1. Go to **Stacks** → `shadowmaster`
2. Click **Editor**
3. Modify environment variables or compose file
4. Click **Update the stack**

## Monitoring

### View Logs

- **In Portainer**: Stacks → shadowmaster → Container → Logs
- **Via CLI**:
  ```bash
  docker logs shadowmaster -f
  ```

### Health Checks

Portainer will automatically monitor the health check endpoint. You can view health status in:
- **Stacks** → `shadowmaster` → Container → **Inspect** → Health status

### Resource Usage

Monitor resource usage in Portainer:
- **Stacks** → `shadowmaster` → Container → **Stats**

## Backup and Restore

### Backup Data

1. **Via Portainer**:
   - Go to **Volumes**
   - Find `shadowmaster-data` volume
   - Use volume backup feature (if available)

2. **Via CLI**:
   ```bash
   docker run --rm \
     -v shadowmaster-data:/data \
     -v $(pwd):/backup \
     alpine tar czf /backup/shadowmaster-backup-$(date +%Y%m%d).tar.gz -C /data .
   ```

### Restore Data

```bash
docker run --rm \
  -v shadowmaster-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/shadowmaster-backup-YYYYMMDD.tar.gz -C /data
```

## Troubleshooting

### Container Won't Start

1. **Check logs in Portainer**:
   - Stacks → shadowmaster → Container → Logs

2. **Common issues**:
   - **Port already in use**: Change `PORT` environment variable
   - **Missing SESSION_SECRET**: Ensure it's set in environment variables
   - **Volume permission issues**: Check volume mount configuration

### Image Pull Errors

1. **Registry authentication**:
   - Go to **Registries** in Portainer
   - Add your registry credentials
   - Ensure registry is accessible from Portainer host

2. **Image not found**:
   - Verify image name and version
   - Check registry URL is correct
   - Ensure image was pushed successfully

### Health Check Failing

1. **Check container logs** for errors
2. **Verify health endpoint**:
   ```bash
   curl http://localhost:8080/health
   ```
3. **Check network configuration** in Portainer

## Security Best Practices

1. **SESSION_SECRET**:
   - Use a strong, random string (at least 32 characters)
   - Generate with: `openssl rand -hex 32`
   - Store securely (consider using Portainer secrets)

2. **Network Security**:
   - Use Portainer networks for isolation
   - Consider reverse proxy (Traefik, Nginx) for HTTPS

3. **Resource Limits**:
   - Set appropriate CPU/memory limits
   - Monitor resource usage

4. **Regular Updates**:
   - Keep images updated
   - Monitor for security vulnerabilities

## Next Steps

- Set up reverse proxy for HTTPS
- Configure automated backups
- Set up monitoring and alerting
- Plan for scaling (multiple instances with shared storage)

