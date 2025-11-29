# ShadowMaster Deployment Guide

This guide covers deploying ShadowMaster using Docker, with support for local Portainer deployment and preparation for cloud deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Building Docker Images](#building-docker-images)
- [Version Management](#version-management)
- [Local Development](#local-development)
- [Portainer Deployment](#portainer-deployment)
- [Data Persistence](#data-persistence)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)
- [Future Cloud Deployment](#future-cloud-deployment)

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
  - **macOS**: We use [Colima](https://github.com/abiosoft/colima) for local Docker. Install with `brew install colima docker docker-compose && colima start`
  - **Linux**: Docker Engine (see [installation guide](https://docs.docker.com/engine/install/))
  - **Windows**: Docker Desktop (see [installation guide](https://docs.docker.com/desktop/install/windows-install/))
- Docker Compose 2.0+ (optional, for docker-compose)
- Make (optional, for Makefile targets)
- Git (for version extraction)

## Quick Start

### Build and Run Locally

```bash
# Build the Docker image
make docker-build

# Run the container
make docker-run
```

Or using docker-compose:

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The application will be available at `http://localhost:8080`.

## Building Docker Images

### Using Makefile

```bash
# Build with automatic version detection
make docker-build

# Build and tag for registry
DOCKER_REGISTRY=your-registry.com make docker-build

# Push to registry
DOCKER_REGISTRY=your-registry.com make docker-push
```

### Using Build Script

```bash
# Basic build
./scripts/docker-build.sh

# Build with custom version
./scripts/docker-build.sh --version 1.0.0

# Build and tag for registry
./scripts/docker-build.sh --registry your-registry.com

# Build, tag, and push
./scripts/docker-build.sh --registry your-registry.com --push
```

### Manual Docker Build

```bash
docker build \
  --build-arg VERSION=1.0.0 \
  --build-arg BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) \
  -t shadowmaster:1.0.0 \
  -t shadowmaster:latest \
  .
```

## Version Management

ShadowMaster uses semantic versioning (MAJOR.MINOR.PATCH). Version information is:

1. **Extracted from** (in order of priority):
   - `--version` flag in build script
   - `VERSION` file in project root
   - Git tag (via `git describe`)
   - Falls back to "dev" if none available

2. **Embedded in**:
   - Docker image tags (`shadowmaster:VERSION` and `shadowmaster:latest`)
   - Go binary (via build-time ldflags)

3. **Updating Version**:
   ```bash
   # Update VERSION file
   echo "1.0.0" > VERSION
   
   # Or use git tags
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

## Local Development

### Development with Docker Compose

The `docker-compose.yml` file is configured for local development:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f shadowmaster

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Environment Variables

Create a `.env` file (or copy from `.env.example`):

```env
VERSION=0.1.0
PORT=8080
SESSION_SECRET=your-secret-key-here
```

## Portainer Deployment

See [Portainer Deployment Guide](./portainer.md) for detailed instructions.

The Portainer deployment includes **Watchtower** for automatic container updates. Watchtower monitors your registry for new image versions and automatically updates containers according to a configurable schedule (default: daily at 4 AM UTC).

### Quick Portainer Setup

1. **Prepare Environment File**:
   Create `.env` file with required variables (see `.env.example` template below)

2. **Build and Push Image**:
   ```bash
   # Build image
   make docker-build
   
   # Tag and push to your registry
   DOCKER_REGISTRY=your-registry.com make docker-push
   ```

3. **Deploy Stack in Portainer**:
   - Go to Stacks → Add Stack
   - Name: `shadowmaster`
   - Build method: Repository
   - Repository URL: Your git repository
   - Compose path: `docker-compose.portainer.yml`
   - Environment variables: Copy from your `.env` file

### Environment Variables Template

Create a `.env` file with the following variables:

```env
# Image Configuration
IMAGE_NAME=shadowmaster
VERSION=0.1.0

# Server Configuration
PORT=8080

# Security (REQUIRED - change in production!)
SESSION_SECRET=change-me-in-production

# Restart Policy
RESTART_POLICY=unless-stopped

# Resource Limits (optional)
CPU_LIMIT=
MEMORY_LIMIT=
CPU_RESERVATION=
MEMORY_RESERVATION=
```

## Data Persistence

ShadowMaster stores all data in the `/data` directory inside the container. This is persisted using Docker volumes.

### Volume Configuration

- **Development** (`docker-compose.yml`): Uses named volume `shadowmaster-data`
- **Production** (`docker-compose.portainer.yml`): Uses named volume `shadowmaster-data`

### Backup and Restore

```bash
# Backup data volume
docker run --rm \
  -v shadowmaster_shadowmaster-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/shadowmaster-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restore data volume
docker run --rm \
  -v shadowmaster_shadowmaster-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/shadowmaster-backup-YYYYMMDD.tar.gz -C /data
```

## Health Checks

The Docker image includes a health check endpoint at `/health`:

```bash
# Check health manually
curl http://localhost:8080/health

# Expected response
{"status":"ok"}
```

The health check runs every 30 seconds with a 3-second timeout. The container is considered healthy after 3 consecutive successful checks.

## Troubleshooting

### Container Won't Start

1. **Check logs**:
   ```bash
   docker-compose logs shadowmaster
   ```

2. **Verify environment variables**:
   ```bash
   docker-compose config
   ```

3. **Check port availability**:
   ```bash
   # Linux/Mac
   lsof -i :8080
   
   # Windows
   netstat -ano | findstr :8080
   ```

### Data Not Persisting

1. **Verify volume exists**:
   ```bash
   docker volume ls | grep shadowmaster
   ```

2. **Check volume mount**:
   ```bash
   docker inspect shadowmaster | grep -A 10 Mounts
   ```

### Build Failures

1. **Clear Docker cache**:
   ```bash
   docker builder prune
   ```

2. **Rebuild without cache**:
   ```bash
   docker build --no-cache -t shadowmaster:latest .
   ```

## Future Cloud Deployment

The Docker setup is designed to be cloud-agnostic. For cloud deployment:

1. **Use cloud container registries**:
   - AWS ECR
   - Google Container Registry
   - Azure Container Registry
   - Docker Hub

2. **Container orchestration**:
   - Kubernetes (manifests can be added)
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances

3. **Configuration management**:
   - Use environment variables (already supported)
   - Consider secrets management (AWS Secrets Manager, etc.)
   - Use cloud-native storage for `/data` (EBS, Persistent Disks, etc.)

## Security Considerations

1. **SESSION_SECRET**: Always use a strong, random secret in production
2. **Non-root user**: Container runs as non-root user (UID 1000)
3. **Minimal base image**: Uses Alpine Linux for smaller attack surface
4. **Health checks**: Enable monitoring and automatic restarts
5. **Resource limits**: Set appropriate CPU/memory limits in production

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Portainer Documentation](https://documentation.portainer.io/)

