# Local Docker Testing Guide

This guide helps you build, test, and debug Docker containers locally before pushing to CI/CD.

## Prerequisites

- Docker Desktop installed (Mac/Windows) or Docker Engine (Linux)
- Docker Compose installed (usually included with Docker Desktop)
- pnpm installed locally for development

## Quick Start

### Build and Run with Docker Compose

```bash
# Build and start the application
docker-compose up --build

# Access the application
open http://localhost:3000

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Building the Docker Image

### Standard Build

```bash
# Build the image
docker build -t shadow-master:local .

# View images
docker images | grep shadow-master
```

### Build with Different Targets

```bash
# Build only dependencies stage (for debugging)
docker build --target deps -t shadow-master:deps .

# Build only builder stage
docker build --target builder -t shadow-master:builder .

# Build production image (default)
docker build --target runner -t shadow-master:local .
```

### Build with Cache

```bash
# First build (no cache)
docker build -t shadow-master:local .

# Subsequent builds (uses cache)
docker build -t shadow-master:local .

# Force rebuild without cache
docker build --no-cache -t shadow-master:local .
```

### Build for Specific Platform

```bash
# Build for AMD64 (most common)
docker build --platform linux/amd64 -t shadow-master:local-amd64 .

# Build for ARM64 (M1/M2 Macs, Raspberry Pi)
docker build --platform linux/arm64 -t shadow-master:local-arm64 .

# Multi-platform build (requires buildx)
docker buildx build --platform linux/amd64,linux/arm64 -t shadow-master:local .
```

## Running Containers

### Basic Run

```bash
# Run the container
docker run -p 3000:3000 shadow-master:local

# Run in background (detached)
docker run -d -p 3000:3000 --name shadow-master shadow-master:local

# View logs
docker logs -f shadow-master

# Stop container
docker stop shadow-master
docker rm shadow-master
```

### Run with Environment Variables

```bash
# Pass environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  shadow-master:local

# Use .env file
docker run -p 3000:3000 --env-file .env.local shadow-master:local
```

### Run with Volume Mounts (Development)

```bash
# Mount source code for live updates (NOT for production image)
docker run -p 3000:3000 \
  -v $(pwd)/app:/app/app \
  -v $(pwd)/components:/app/components \
  shadow-master:local
```

## Using Docker Compose

### Basic Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs
docker-compose logs -f shadow-master

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# Remove everything (including volumes)
docker-compose down -v
```

### Custom Docker Compose Files

Create `docker-compose.dev.yml` for development:

```yaml
version: '3.8'

services:
  shadow-master:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      # Mount source for hot reload (if using dev Dockerfile)
      - ./app:/app/app
      - ./components:/app/components
```

Use with:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Testing

### Health Check

```bash
# Start container
docker run -d -p 3000:3000 --name shadow-master shadow-master:local

# Wait for startup
sleep 10

# Test health endpoint
curl http://localhost:3000/api/health

# Expected output: {"status":"ok","timestamp":"..."}
```

### Container Inspection

```bash
# View container details
docker inspect shadow-master

# Check health status
docker inspect --format='{{json .State.Health}}' shadow-master | jq

# View environment variables
docker inspect --format='{{.Config.Env}}' shadow-master

# Check resource usage
docker stats shadow-master
```

### Testing Different Scenarios

```bash
# Test with minimal resources
docker run -p 3000:3000 \
  --memory="256m" \
  --cpus="0.5" \
  shadow-master:local

# Test with read-only filesystem (security)
docker run -p 3000:3000 \
  --read-only \
  --tmpfs /tmp \
  shadow-master:local
```

## Debugging

### Interactive Shell Access

```bash
# Run shell in running container
docker exec -it shadow-master sh

# Inside container, you can:
# - Check files: ls -la
# - View processes: ps aux
# - Check environment: env
# - Test network: wget http://localhost:3000/api/health

# Exit shell
exit
```

### Debug Build Issues

```bash
# Build with verbose output
docker build --progress=plain -t shadow-master:local .

# Build and inspect intermediate layers
docker build --target deps -t shadow-master:debug .
docker run -it shadow-master:debug sh

# Check specific layer
docker history shadow-master:local
```

### Debug Runtime Issues

```bash
# View detailed logs
docker logs shadow-master

# Follow logs in real-time
docker logs -f --tail 100 shadow-master

# Check container processes
docker top shadow-master

# Inspect networking
docker network inspect bridge
```

### Common Issues and Solutions

#### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
docker run -p 3001:3000 shadow-master:local
```

#### Build Fails: Dependencies

```bash
# Clear Docker build cache
docker builder prune

# Remove all stopped containers and images
docker system prune -a

# Rebuild from scratch
docker build --no-cache -t shadow-master:local .
```

#### Container Exits Immediately

```bash
# Check exit code and logs
docker ps -a
docker logs shadow-master

# Run with interactive shell to debug
docker run -it --entrypoint sh shadow-master:local
```

#### Health Check Failing

```bash
# Disable health check for testing
docker run -p 3000:3000 --no-healthcheck shadow-master:local

# Check if app is actually running
docker exec shadow-master ps aux | grep node

# Test health endpoint manually
docker exec shadow-master wget -O- http://localhost:3000/api/health
```

## Performance Testing

### Measure Build Time

```bash
# Time the build
time docker build -t shadow-master:local .

# Build with cache
time docker build -t shadow-master:local .  # Should be faster
```

### Measure Image Size

```bash
# Check image size
docker images shadow-master:local

# Analyze layers
docker history shadow-master:local

# Detailed size breakdown
docker inspect shadow-master:local | jq '.[0].Size'
```

### Benchmark Container

```bash
# Start container
docker run -d -p 3000:3000 --name shadow-master shadow-master:local

# Simple load test with curl
for i in {1..100}; do
  curl -s http://localhost:3000/api/health > /dev/null
  echo "Request $i completed"
done

# Or use Apache Bench if installed
ab -n 1000 -c 10 http://localhost:3000/api/health
```

## Environment Management

### Create .env.local (for testing)

```bash
# Create .env.local file
cat > .env.local << EOF
NODE_ENV=production
PORT=3000
# Add your test variables here
EOF
```

### Test with Different Environments

```bash
# Development environment
docker run -p 3000:3000 -e NODE_ENV=development shadow-master:local

# Production environment
docker run -p 3000:3000 -e NODE_ENV=production shadow-master:local

# Custom configuration
docker run -p 3000:3000 --env-file .env.staging shadow-master:local
```

## Cleanup

### Remove Containers

```bash
# Stop and remove specific container
docker stop shadow-master
docker rm shadow-master

# Remove all stopped containers
docker container prune

# Force remove running container
docker rm -f shadow-master
```

### Remove Images

```bash
# Remove specific image
docker rmi shadow-master:local

# Remove all shadow-master images
docker images | grep shadow-master | awk '{print $3}' | xargs docker rmi

# Remove dangling images
docker image prune
```

### Complete Cleanup

```bash
# Remove everything (containers, images, volumes, networks)
docker system prune -a --volumes

# This will ask for confirmation
# WARNING: This removes ALL unused Docker objects
```

## Integration with Local Development

### Workflow Recommendation

1. **Develop locally with hot reload**:
   ```bash
   pnpm dev
   ```

2. **Test Docker build before committing**:
   ```bash
   docker build -t shadow-master:test .
   docker run -p 3000:3000 shadow-master:test
   # Test functionality
   docker stop $(docker ps -q --filter ancestor=shadow-master:test)
   ```

3. **If build/tests pass, commit and push**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin feature-branch
   ```

4. **CI/CD takes over** for production builds

## Best Practices

1. **Always test Docker builds locally** before pushing
2. **Use `.dockerignore`** to optimize build context
3. **Tag images meaningfully** (e.g., `shadow-master:feature-xyz`)
4. **Check logs** for any warnings or errors
5. **Clean up regularly** to save disk space
6. **Use Docker Compose** for multi-service testing
7. **Test health checks** to ensure monitoring works
8. **Verify multi-platform builds** if targeting different architectures

## Next Steps

- Review [Portainer Setup Guide](./portainer-setup.md) for deployment
- Check [CI/CD Guide](./cicd-guide.md) for automated builds
- Configure environment variables for your use case

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
