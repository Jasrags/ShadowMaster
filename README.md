# Shadow Master

A Shadowrun 5th Edition character creation and management application built with Next.js.

![CI](https://github.com/jasrags/shadow-master/actions/workflows/ci.yml/badge.svg)

## Getting Started

### Local Development

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Using the Makefile

This project includes a `Makefile` with convenient shortcuts for common tasks. View all available commands:

```bash
make help
```

#### Development Commands

```bash
make install     # Install dependencies
make dev         # Run development server (native, no Docker)
make lint        # Run ESLint
make build       # Build production bundle
make test        # Run tests
```

#### Docker Commands

```bash
make docker-build   # Build production Docker image
make docker-run     # Run production Docker container
make docker-dev     # Run development Docker container with hot-reload
make docker-push    # Build and push Docker image to GHCR (requires GITHUB_TOKEN)
```

#### Deployment Commands

```bash
# Deploy to test environment via Portainer webhook
make deploy-test PORTAINER_WEBHOOK=https://portainer.example.com/api/webhooks/xxx

# Or using Portainer API
make deploy-test PORTAINER_URL=https://portainer.example.com PORTAINER_API_TOKEN=xxx PORTAINER_STACK_ID=1
```

See `.env.example` for configurable environment variables used by the Makefile.

### Docker Deployment

This project includes full Docker support for both development and production deployments.

#### Development with Docker (Hot-Reload)

Run the development environment in Docker with automatic hot-reload:

```bash
make docker-dev
# or
docker-compose -f docker-compose.dev.yml up
```

This uses `Dockerfile.dev` and `docker-compose.dev.yml` to mount your source code as volumes, enabling live code changes without rebuilding.

#### Production with Docker

**Option 1: Using Makefile**

```bash
make docker-build          # Build the image
make docker-run            # Run the container
make docker-push-ghcr      # Build and push to GitHub Container Registry
make docker-push-dockerhub # Build and push to Docker Hub
```

**Option 2: Using Docker directly**

```bash
# Build the Docker image
docker build -t shadow-master .

# Run the container
docker run -p 3000:3000 shadow-master
```

**Option 3: Using Docker Compose**

```bash
# Production (with persistent volumes and Watchtower)
docker-compose -f docker-compose.stack.yml up

# Or use the basic production compose
docker-compose up
```

#### Comprehensive Guides

- **[Local Docker Testing](docs/deployment/local-docker-testing.md)** - Build and test Docker containers locally
- **[Portainer Deployment](docs/deployment/portainer-setup.md)** - Deploy using Portainer
- **[CI/CD Pipeline](docs/deployment/cicd-guide.md)** - GitHub Actions automated builds and deployment

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **CI**: Automated linting, testing, and build verification on every push/PR
- **Docker Build**: Runs lint/build checks, then builds and pushes multi-platform images (AMD64/ARM64) to GitHub Container Registry
- **CD**: Manual deployment workflows with environment selection and optional Portainer webhook integration

### Workflow Triggers

- **Push to `main`**: Automatically builds and pushes Docker image with `latest` tag
- **Git tags (`v*`)**: Builds and pushes with semantic version tags
- **Manual dispatch**: Trigger workflow manually with optional custom tag and test deployment

### Docker Images

Pre-built images are available at:
```
ghcr.io/jasrags/shadow-master:latest
ghcr.io/jasrags/shadow-master:git-<sha>  # Tagged with git commit SHA
```

### Portainer Integration

The Docker Build workflow supports optional test deployment via Portainer webhook:

1. Set `PORTAINER_TEST_WEBHOOK` secret in GitHub repository settings
2. When manually triggering the workflow, check "Deploy to test environment via Portainer webhook"
3. After successful build, the workflow will call your Portainer webhook to trigger a stack update

See the [CI/CD Guide](docs/deployment/cicd-guide.md) for detailed usage instructions.

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

### Key Variables

- **Application**: `NODE_ENV`, `PORT`, `NEXT_TELEMETRY_DISABLED`
- **GHCR (GitHub Container Registry)**: `GHCR_REGISTRY`, `GHCR_OWNER`, `GITHUB_TOKEN` (for `make docker-push-ghcr`)
- **Docker Hub**: `DOCKERHUB_REGISTRY`, `DOCKERHUB_OWNER`, `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` (for `make docker-push-dockerhub`)
- **Legacy/General**: `REGISTRY`, `OWNER`, `REPO`, `IMAGE_TAG` (for generic `make docker-push`)
- **Portainer**: `PORTAINER_WEBHOOK`, `PORTAINER_URL`, `PORTAINER_API_TOKEN`, `PORTAINER_STACK_ID`

See `.env.example` for complete list and descriptions.

### Pushing Docker Images

Push images to registries using separate commands:

```bash
# Push to GitHub Container Registry (requires GITHUB_TOKEN)
export GITHUB_TOKEN=ghp_your_token_here
make docker-push-ghcr

# Push to Docker Hub (requires DOCKERHUB_TOKEN)
export DOCKERHUB_TOKEN=dckr_pat_your_token_here
make docker-push-dockerhub

# Or use custom tags
make docker-push-ghcr TAG=v1.0.0
make docker-push-dockerhub TAG=v1.0.0
```

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - React components
- `/lib` - Utility functions and helpers
- `/data` - Game data (rulesets, equipment, etc.)
- `/docs` - Project documentation

## Learn More

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

See [LICENSE](LICENSE) for license information.
