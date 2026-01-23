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
6. [HTTPS Deployment](#https-deployment)
7. [Troubleshooting](#troubleshooting)

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

Stacks provide better configuration management and multi-service deployments.

### Create a Stack

1. Navigate to **Stacks** → **Add stack**

2. **Name**: `shadow-master`

3. **Build method**: Web editor

4. **Stack file content**:

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
      # Add your custom environment variables here
      # - DATABASE_URL=your_database_url
      # - API_KEY=your_api_key
    restart: unless-stopped
    healthcheck:
      test:
        ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - shadow-master-network

networks:
  shadow-master-network:
    driver: bridge

# Optional: Add volumes for persistent data
# volumes:
#   shadow-master-data:
#     driver: local
```

5. **Environment variables** (optional):
   - Click **Add environment variable** to override stack variables
   - Or use the `.env` file section

6. Click **Deploy the stack**

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

### Automated Updates with Watchtower (Optional)

Add Watchtower to automatically update containers:

```yaml
services:
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - WATCHTOWER_POLL_INTERVAL=300 # Check every 5 minutes
      - WATCHTOWER_CLEANUP=true
    restart: unless-stopped
```

> [!WARNING]
> Automatic updates in production should be carefully considered. Test updates in staging first.

## HTTPS Deployment

For production deployments, Shadow Master uses Caddy as a reverse proxy with automatic Let's Encrypt certificates via Cloudflare DNS-01 challenge. Port **2075** is used (the year the Sixth World begins in Shadowrun).

### Prerequisites

1. **Cloudflare Account** (free tier):
   - Create account at [cloudflare.com](https://cloudflare.com)
   - Add your domain to Cloudflare
   - Update nameservers at your registrar to Cloudflare's nameservers
   - Create A record pointing to your server's public IP

2. **Cloudflare API Token**:
   - Cloudflare Dashboard → My Profile → API Tokens
   - Create Token with permission: Zone:DNS:Edit for your domain
   - Save token securely

3. **Router Port Forwarding**:
   - Forward port 2075 from your router to server:2075

### Deploy HTTPS Stack

Use `docker-compose.portainer.yml` from the repository, or copy the stack content below.

1. Navigate to **Stacks** → **Add stack**

2. **Name**: `shadow-master`

3. **Build method**: Repository or Web editor

4. **Environment variables** (required):

   | Variable       | Value                                  |
   | -------------- | -------------------------------------- |
   | `CF_API_TOKEN` | Your Cloudflare API token              |
   | `DOMAIN`       | `home.jasrags.net`                     |
   | `HTTPS_PORT`   | `2075` (optional, this is the default) |

5. Click **Deploy the stack**

### Verify HTTPS Deployment

1. **Check Caddy logs for certificate acquisition**:

   ```bash
   docker logs caddy-proxy 2>&1 | grep -i "certificate\|tls"
   ```

2. **Test HTTPS endpoint**:

   ```bash
   curl -I https://home.jasrags.net:2075
   ```

3. **Verify security headers**:

   ```bash
   curl -I https://home.jasrags.net:2075 | grep -E "Strict-Transport|X-Frame|X-Content"
   ```

4. **Health check**:
   ```bash
   curl https://home.jasrags.net:2075/api/health
   ```

### Security Headers

The HTTPS deployment includes these security headers:

| Header                      | Value                                 | Purpose                |
| --------------------------- | ------------------------------------- | ---------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS for 1 year |
| `X-Frame-Options`           | `SAMEORIGIN`                          | Prevent clickjacking   |
| `X-Content-Type-Options`    | `nosniff`                             | Prevent MIME sniffing  |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`     | Control referrer info  |

### HTTPS Troubleshooting

**Certificate not obtained**:

- Check Cloudflare API token has correct permissions
- Verify DNS records are correct in Cloudflare
- Check Caddy logs: `docker logs caddy-proxy`

**Connection refused on port 2075**:

- Verify router port forwarding is configured
- Check firewall rules on the server
- Ensure Caddy container is running: `docker ps`

**Certificate renewal failing**:

- Caddy handles renewal automatically
- Check Cloudflare API token hasn't expired
- Verify DNS records haven't changed

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

### Performance issues

1. **Set resource limits**:

   ```yaml
   deploy:
     resources:
       limits:
         cpus: "1"
         memory: 512M
       reservations:
         memory: 256M
   ```

2. **Monitor container stats**:
   - Use Portainer **Stats** view
   - Check CPU and memory usage

## Additional Resources

- [Portainer Documentation](https://docs.portainer.io/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Project CI/CD Guide](./cicd-guide.md)

## Security Best Practices

> [!CAUTION]
>
> - Never commit secrets or API keys to version control
> - Use Portainer's secrets management for sensitive data
> - Keep your Personal Access Token secure and rotate regularly
> - Use specific image tags in production rather than `latest`
> - Enable Docker Content Trust for image verification
