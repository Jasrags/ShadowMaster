#!/bin/bash
# Docker build script for ShadowMaster with version tagging

set -e

# Colors for output
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Default values
IMAGE_NAME="shadowmaster"
REGISTRY=""
VERSION_FILE="VERSION"
PUSH_IMAGE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --registry)
            REGISTRY="$2"
            shift 2
            ;;
        --push)
            PUSH_IMAGE=true
            shift
            ;;
        --version)
            VERSION="$2"
            shift 2
            ;;
        --image-name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--registry REGISTRY_URL] [--push] [--version VERSION] [--image-name NAME]"
            exit 1
            ;;
    esac
done

# Get version from VERSION file or git tag, or use provided version
if [ -z "$VERSION" ]; then
    if [ -f "$VERSION_FILE" ]; then
        VERSION=$(cat "$VERSION_FILE" | tr -d '[:space:]')
    elif git rev-parse --git-dir > /dev/null 2>&1; then
        # Try to get version from git tag
        VERSION=$(git describe --tags --always --dirty 2>/dev/null || echo "dev")
    else
        VERSION="dev"
    fi
fi

# Get build metadata
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_COMMIT=""
if git rev-parse --git-dir > /dev/null 2>&1; then
    GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
fi

echo -e "${CYAN}Building Docker image: ${IMAGE_NAME}${NC}"
echo -e "${CYAN}Version: ${VERSION}${NC}"
echo -e "${CYAN}Build Time: ${BUILD_TIME}${NC}"
echo -e "${CYAN}Git Commit: ${GIT_COMMIT}${NC}"

# Build the image with build arguments
docker build \
    --build-arg VERSION="${VERSION}" \
    --build-arg BUILD_TIME="${BUILD_TIME}" \
    --build-arg GIT_COMMIT="${GIT_COMMIT}" \
    -t "${IMAGE_NAME}:${VERSION}" \
    -t "${IMAGE_NAME}:latest" \
    .

echo -e "${GREEN}✓ Image built successfully${NC}"

# Tag for registry if provided
if [ -n "$REGISTRY" ]; then
    REGISTRY_IMAGE="${REGISTRY}/${IMAGE_NAME}"
    docker tag "${IMAGE_NAME}:${VERSION}" "${REGISTRY_IMAGE}:${VERSION}"
    docker tag "${IMAGE_NAME}:latest" "${REGISTRY_IMAGE}:latest"
    echo -e "${GREEN}✓ Tagged for registry: ${REGISTRY_IMAGE}${NC}"
    
    # Push if requested
    if [ "$PUSH_IMAGE" = true ]; then
        echo -e "${CYAN}Pushing images to registry...${NC}"
        docker push "${REGISTRY_IMAGE}:${VERSION}"
        docker push "${REGISTRY_IMAGE}:latest"
        echo -e "${GREEN}✓ Images pushed successfully${NC}"
    fi
fi

echo -e "${GREEN}Build complete!${NC}"
echo -e "${YELLOW}Image tags:${NC}"
echo -e "  - ${IMAGE_NAME}:${VERSION}"
echo -e "  - ${IMAGE_NAME}:latest"
if [ -n "$REGISTRY" ]; then
    echo -e "  - ${REGISTRY_IMAGE}:${VERSION}"
    echo -e "  - ${REGISTRY_IMAGE}:latest"
fi

