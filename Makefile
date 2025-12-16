# Shadow Master - Development and Deployment Makefile
# Provides shortcuts for common development and deployment tasks

.PHONY: help install dev lint build test docker-build docker-run docker-dev docker-push docker-push-ghcr docker-push-dockerhub deploy-test clean

# Load environment variables from .env.local or .env file if they exist
# Variables in .env files will override defaults but can still be overridden by command line
# The - prefix means it won't error if the files don't exist
-include .env.local
-include .env

# Export all variables so they're available to sub-commands (docker, pnpm, etc.)
export

# Default values (can be overridden via environment variables or .env files)
REGISTRY ?= ghcr.io
OWNER ?= jasrags
REPO ?= shadow-master
IMAGE ?= $(REGISTRY)/$(OWNER)/$(REPO)
TAG ?= latest

# GHCR specific
GHCR_REGISTRY ?= ghcr.io
GHCR_OWNER ?= jasrags
GHCR_IMAGE ?= $(GHCR_REGISTRY)/$(GHCR_OWNER)/$(REPO)

# Docker Hub specific
DOCKERHUB_REGISTRY ?= docker.io
DOCKERHUB_OWNER ?= jasrags
DOCKERHUB_IMAGE ?= $(DOCKERHUB_REGISTRY)/$(DOCKERHUB_OWNER)/$(REPO)

PORTAINER_WEBHOOK ?=
PORTAINER_URL ?=
PORTAINER_API_TOKEN ?=
PORTAINER_STACK_ID ?=

# Help target - shows available commands
help:
	@echo "Shadow Master - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install       - Install dependencies"
	@echo "  make dev          - Run development server (native)"
	@echo "  make lint         - Run ESLint"
	@echo "  make build        - Build production bundle"
	@echo "  make test         - Run tests"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build          - Build production Docker image"
	@echo "  make docker-run            - Run production Docker container"
	@echo "  make docker-dev            - Run development Docker container with hot-reload"
	@echo "  make docker-push           - Build and push Docker image (uses REGISTRY, default: GHCR)"
	@echo "  make docker-push-ghcr      - Build and push Docker image to GitHub Container Registry"
	@echo "  make docker-push-dockerhub - Build and push Docker image to Docker Hub"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-test  - Trigger Portainer test deployment via webhook"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        - Clean build artifacts and Docker images"
	@echo ""
	@echo "Environment Variables:"
	@echo "  General:"
	@echo "    REPO              - Repository name (default: shadow-master)"
	@echo "    TAG               - Image tag (default: latest)"
	@echo "  GHCR (GitHub Container Registry):"
	@echo "    GHCR_REGISTRY     - GHCR registry URL (default: ghcr.io)"
	@echo "    GHCR_OWNER        - GHCR repository owner (default: jasrags)"
	@echo "    GITHUB_TOKEN      - GitHub Personal Access Token with 'write:packages' scope"
	@echo "  Docker Hub:"
	@echo "    DOCKERHUB_REGISTRY - Docker Hub registry (default: docker.io)"
	@echo "    DOCKERHUB_OWNER    - Docker Hub username (default: jasrags)"
	@echo "    DOCKERHUB_USERNAME - Docker Hub login username (optional, defaults to DOCKERHUB_OWNER)"
	@echo "    DOCKERHUB_TOKEN    - Docker Hub access token or password"
	@echo "  Legacy/General:"
	@echo "    REGISTRY          - Docker registry (default: ghcr.io, used by docker-push)"
	@echo "    OWNER             - Repository owner (default: jasrags, used by docker-push)"
	@echo "  Portainer:"
	@echo "    PORTAINER_WEBHOOK - Portainer webhook URL for test deployment"
	@echo "    PORTAINER_URL     - Portainer API URL (alternative to webhook)"
	@echo "    PORTAINER_API_TOKEN - Portainer API token (required if using PORTAINER_URL)"
	@echo "    PORTAINER_STACK_ID - Portainer stack ID (required if using PORTAINER_URL)"

# Development commands
install:
	pnpm install

dev:
	pnpm dev

lint:
	pnpm lint

build:
	pnpm build

test:
	pnpm test

# Docker commands
docker-build:
	@echo "Building Docker image: $(IMAGE):$(TAG)"
	docker build -t $(IMAGE):$(TAG) -f Dockerfile .

docker-run:
	@echo "Running Docker container: $(IMAGE):$(TAG)"
	docker run -p 3000:3000 --rm $(IMAGE):$(TAG)

docker-dev:
	@echo "Starting development environment with Docker Compose"
	docker-compose -f docker-compose.dev.yml up --build

docker-push: docker-build
	@echo "Pushing Docker image: $(IMAGE):$(TAG)"
	@if [ -z "$$GITHUB_TOKEN" ]; then \
		echo "Error: GITHUB_TOKEN environment variable not set"; \
		echo "Create a GitHub Personal Access Token with 'write:packages' scope"; \
		echo "Then: export GITHUB_TOKEN=your_token"; \
		exit 1; \
	fi
	@echo "Logging in to $(REGISTRY)..."
	@echo $$GITHUB_TOKEN | docker login $(REGISTRY) -u $(OWNER) --password-stdin
	docker push $(IMAGE):$(TAG)
	@echo "Image pushed successfully: $(IMAGE):$(TAG)"

docker-push-ghcr:
	@echo "Building and pushing to GitHub Container Registry: $(GHCR_IMAGE):$(TAG)"
	@if [ -z "$$GITHUB_TOKEN" ]; then \
		echo "Error: GITHUB_TOKEN environment variable not set"; \
		echo "Create a GitHub Personal Access Token with 'write:packages' scope"; \
		echo "See: https://github.com/settings/tokens"; \
		echo "Then: export GITHUB_TOKEN=your_token"; \
		exit 1; \
	fi
	@echo "Building Docker image: $(GHCR_IMAGE):$(TAG)"
	docker build -t $(GHCR_IMAGE):$(TAG) -f Dockerfile .
	@echo "Logging in to $(GHCR_REGISTRY) as $(GHCR_OWNER)..."
	@echo $$GITHUB_TOKEN | docker login $(GHCR_REGISTRY) -u $(GHCR_OWNER) --password-stdin
	@echo "Pushing $(GHCR_IMAGE):$(TAG)..."
	docker push $(GHCR_IMAGE):$(TAG)
	@echo "Successfully pushed to GHCR: $(GHCR_IMAGE):$(TAG)"

docker-push-dockerhub:
	@echo "Building and pushing to Docker Hub: $(DOCKERHUB_IMAGE):$(TAG)"
	@if [ -z "$$DOCKERHUB_TOKEN" ]; then \
		echo "Error: DOCKERHUB_TOKEN environment variable not set"; \
		echo "Create a Docker Hub access token at: https://hub.docker.com/settings/security"; \
		echo "Then: export DOCKERHUB_TOKEN=your_token"; \
		echo "Note: You can use your Docker Hub password, but tokens are recommended"; \
		exit 1; \
	fi
	@DOCKERHUB_USERNAME=$${DOCKERHUB_USERNAME:-$(DOCKERHUB_OWNER)}; \
	echo "Building Docker image: $(DOCKERHUB_IMAGE):$(TAG)"; \
	docker build -t $(DOCKERHUB_IMAGE):$(TAG) -f Dockerfile .; \
	echo "Logging in to Docker Hub as $$DOCKERHUB_USERNAME..."; \
	echo $$DOCKERHUB_TOKEN | docker login $(DOCKERHUB_REGISTRY) -u $$DOCKERHUB_USERNAME --password-stdin; \
	echo "Pushing $(DOCKERHUB_IMAGE):$(TAG)..."; \
	docker push $(DOCKERHUB_IMAGE):$(TAG); \
	echo "Successfully pushed to Docker Hub: $(DOCKERHUB_IMAGE):$(TAG)"

# Deployment commands
deploy-test:
	@if [ -n "$(PORTAINER_WEBHOOK)" ]; then \
		echo "Triggering Portainer webhook: $(PORTAINER_WEBHOOK)"; \
		curl -X POST $(PORTAINER_WEBHOOK) || echo "Webhook call failed"; \
	elif [ -n "$(PORTAINER_URL)" ] && [ -n "$(PORTAINER_API_TOKEN)" ]; then \
		if [ -z "$(PORTAINER_STACK_ID)" ]; then \
			echo "Error: PORTAINER_STACK_ID required when using PORTAINER_URL"; \
			exit 1; \
		fi; \
		echo "Deploying stack $(PORTAINER_STACK_ID) via Portainer API..."; \
		curl -X POST "$(PORTAINER_URL)/api/stacks/$(PORTAINER_STACK_ID)/git/redeploy" \
			-H "X-API-Key: $(PORTAINER_API_TOKEN)" \
			-H "Content-Type: application/json" \
			-d '{"pullImage": true}' || echo "API call failed"; \
	else \
		echo "Error: Either PORTAINER_WEBHOOK or (PORTAINER_URL + PORTAINER_API_TOKEN) must be set"; \
		echo "Example: make deploy-test PORTAINER_WEBHOOK=https://portainer.example.com/api/webhooks/xxx"; \
		echo "Or: make deploy-test PORTAINER_URL=https://portainer.example.com PORTAINER_API_TOKEN=xxx PORTAINER_STACK_ID=1"; \
		exit 1; \
	fi

# Cleanup
clean:
	@echo "Cleaning build artifacts..."
	rm -rf .next
	rm -rf node_modules
	rm -rf dist
	@echo "Cleaning Docker images..."
	docker rmi $(IMAGE):$(TAG) 2>/dev/null || true
	docker rmi shadow-master:local 2>/dev/null || true
	docker rmi shadow-master:dev 2>/dev/null || true
	@echo "Cleanup complete"

