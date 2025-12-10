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

### Docker Deployment

This project includes full Docker support for containerized deployment.

#### Quick Start with Docker

```bash
# Build the Docker image
docker build -t shadow-master .

# Run the container
docker run -p 3000:3000 shadow-master

# Or use Docker Compose
docker-compose up
```

#### Comprehensive Guides

- **[Local Docker Testing](docs/deployment/local-docker-testing.md)** - Build and test Docker containers locally
- **[Portainer Deployment](docs/deployment/portainer-setup.md)** - Deploy using Portainer
- **[CI/CD Pipeline](docs/deployment/cicd-guide.md)** - GitHub Actions automated builds and deployment

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **CI**: Automated linting and build verification on every push/PR
- **Docker Build**: Multi-platform image builds (AMD64/ARM64) published to GitHub Container Registry
- **CD**: Manual deployment workflows with environment selection

### Docker Images

Pre-built images are available at:
```
ghcr.io/jasrags/shadow-master:latest
```

See the [CI/CD Guide](docs/deployment/cicd-guide.md) for detailed usage instructions.

## Environment Variables

Copy `.env.example` to `.env.local` and configure as needed:

```bash
cp .env.example .env.local
```

See `.env.example` for available configuration options.

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
