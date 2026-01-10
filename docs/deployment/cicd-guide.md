# CI/CD Pipeline Guide

This guide explains the GitHub Actions CI/CD pipeline for Shadow Master, including workflows, configuration, and best practices.

## Overview

The CI/CD pipeline consists of three main workflows:

1. **CI (Continuous Integration)** - Automated testing and building
2. **Docker Build** - Building and publishing Docker images
3. **CD (Continuous Deployment)** - Manual deployment orchestration

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs**:

- Install dependencies with pnpm
- Run ESLint checks
- Build the application
- Verify build artifacts

**Purpose**: Ensures code quality and buildability before merging.

### 2. Docker Build Workflow (`.github/workflows/docker-build.yml`)

**Triggers**:

- Push to `main` branch
- Push of version tags (e.g., `v1.0.0`)
- Manual workflow dispatch

**Jobs**:

- Build multi-platform Docker images (linux/amd64, linux/arm64)
- Push images to GitHub Container Registry (GHCR)
- Generate build summary

**Image Tags**:

- `latest` - Built from main branch
- `git-<sha>` - Specific commit (e.g., `git-abc1234`)
- `v1.0.0` - Semantic version from tags
- `v1.0`, `v1` - Major/minor version tags
- Custom tags via manual dispatch

### 3. CD Workflow (`.github/workflows/cd.yml`)

**Triggers**:

- Manual workflow dispatch only

**Inputs**:

- **Environment**: development, staging, or production
- **Image Tag**: Docker image tag to deploy (default: latest)

**Purpose**: Provides deployment orchestration and instructions for Portainer updates.

## Setup Instructions

### Required GitHub Secrets

The workflows use GitHub's built-in `GITHUB_TOKEN`, which is automatically available. No additional secrets are required for GHCR.

**Automatic**:

- `GITHUB_TOKEN` - Provided by GitHub Actions (for GHCR authentication)

### Recommended: GitHub Environments

For better deployment control, set up GitHub environments:

1. Go to **Repository Settings** → **Environments**
2. Create environments: `development`, `staging`, `production`
3. For production, enable:
   - **Required reviewers** (1-2 people)
   - **Wait timer** (optional, e.g., 5 minutes)
   - **Deployment branches** (only `main`)

## Using the Pipeline

### Continuous Integration

**Automatic on every push/PR**:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature-branch

# Create PR to main
# CI workflow runs automatically
```

### Building Docker Images

#### Automatic Build (Push to Main)

```bash
# Merge PR to main
git checkout main
git pull origin main

# Workflow triggers automatically
# Image tagged as 'latest' and 'git-<sha>'
```

#### Manual Build with Custom Tag

1. Go to **Actions** → **Docker Build and Push**
2. Click **Run workflow**
3. Select branch (usually `main`)
4. Enter custom tag if desired
5. Click **Run workflow**

#### Version Release

```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Workflow builds images with tags:
# - latest
# - git-abc1234
# - v1.0.0
# - v1.0
# - v1
```

### Deployment

1. Go to **Actions** → **CD - Deploy**
2. Click **Run workflow**
3. Select inputs:
   - **Environment**: Choose target environment
   - **Image Tag**: Specify tag (default: `latest`)
4. Click **Run workflow**
5. Follow the generated deployment summary
6. Deploy via Portainer using the specified image

## Image Tagging Strategy

### Tag Types

| Tag         | Example       | When Used        | Purpose                   |
| ----------- | ------------- | ---------------- | ------------------------- |
| `latest`    | `latest`      | Main branch push | Latest stable version     |
| Git SHA     | `git-abc1234` | Every build      | Exact commit traceability |
| Semantic    | `v1.0.0`      | Version tags     | Specific releases         |
| Major.Minor | `v1.0`        | Version tags     | Latest patch version      |
| Major       | `v1`          | Version tags     | Latest in major version   |
| Custom      | `beta-1`      | Manual dispatch  | Special builds            |

### Pull Commands

```bash
# Latest stable
docker pull ghcr.io/jasrags/shadow-master:latest

# Specific version
docker pull ghcr.io/jasrags/shadow-master:v1.0.0

# Specific commit
docker pull ghcr.io/jasrags/shadow-master:git-abc1234
```

## Branch Protection Rules

Recommended branch protection for `main`:

1. Go to **Repository Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - Select: `Lint and Build` (from CI workflow)
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

## Workflow Monitoring

### Viewing Workflow Runs

1. Go to **Actions** tab in repository
2. Select workflow from left sidebar
3. Click on specific run to view details

### Notifications

Configure notifications:

1. **GitHub Settings** → **Notifications**
2. Enable **Actions** notifications
3. Choose email or web notifications

### Build Status Badge

Add to README.md:

```markdown
![CI](https://github.com/jasrags/shadow-master/actions/workflows/ci.yml/badge.svg)
```

## Troubleshooting

### CI Workflow Failures

**Lint errors**:

```bash
# Run locally first
pnpm lint

# Fix issues
pnpm lint --fix
```

**Build errors**:

```bash
# Test build locally
pnpm build

# Check for type errors
pnpm build --debug
```

### Docker Build Failures

**Build context too large**:

- Verify `.dockerignore` is working
- Check for large files in repository

**Multi-platform build issues**:

- Ensure Docker Buildx is available (handled by workflow)
- Check build logs for platform-specific errors

**Image push failures**:

- Verify GITHUB_TOKEN has `write:packages` permission
- Check if image name matches repository

### Deployment Issues

**Image not found**:

```bash
# Verify image exists in GHCR
# Go to Packages tab in GitHub repository
# Or check: https://github.com/jasrags/shadow-master/pkgs/container/shadow-master
```

**Authentication errors**:

- Regenerate GitHub Personal Access Token
- Update credentials in Portainer
- Ensure PAT has `read:packages` scope

## Best Practices

### For Development

1. **Always create feature branches**:

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Keep PRs small and focused**
3. **Wait for CI to pass before requesting review**
4. **Write meaningful commit messages**

### For Releases

1. **Use semantic versioning** (MAJOR.MINOR.PATCH)
   - MAJOR: Breaking changes
   - MINOR: New features, backward compatible
   - PATCH: Bug fixes

2. **Create release notes** in GitHub Releases

3. **Test in staging before production**:

   ```bash
   # Deploy to staging first
   # Use CD workflow with 'staging' environment

   # After testing, deploy to production
   # Use CD workflow with 'production' environment
   ```

4. **Use specific tags in production**:
   - ❌ Don't use: `latest` in production
   - ✅ Use: `v1.0.0` or `v1.0`

### Security

1. **Never commit secrets**:
   - Use GitHub Secrets for sensitive data
   - Use `.env.local` for local development (gitignored)

2. **Review Dependabot alerts**:
   - Enable Dependabot in repository settings
   - Review and merge security updates promptly

3. **Scan images for vulnerabilities**:
   - Consider adding Trivy or Snyk to workflows
   - Review GHCR security scanning results

4. **Rotate access tokens regularly**:
   - Update GitHub PATs every 90 days
   - Update Portainer credentials when changing PATs

## Advanced Topics

### Adding Tests

When you add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

Update `.github/workflows/ci.yml`:

```yaml
- name: Run tests
  run: pnpm test

- name: Generate coverage report
  run: pnpm test:coverage
```

### Custom Deployment Actions

Extend `.github/workflows/cd.yml` to automate deployment:

```yaml
# Example: Webhook to Portainer
- name: Trigger Portainer webhook
  run: |
    curl -X POST https://portainer.example.com/api/webhooks/${{ secrets.PORTAINER_WEBHOOK_ID }}
```

### Multi-Environment Docker Builds

Create environment-specific Dockerfiles:

```yaml
# In docker-build.yml
- name: Build production image
  uses: docker/build-push-action@v5
  with:
    file: ./Dockerfile.prod
    target: production
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Support

For issues with the CI/CD pipeline:

1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Create an issue in the repository
