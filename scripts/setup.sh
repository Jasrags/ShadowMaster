#!/bin/bash
# ShadowMaster Setup Script for Mac and Linux
# This script checks prerequisites and sets up the development environment

set -e

# Colors for output
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}ShadowMaster Setup Script${NC}"
echo "================================"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check version
check_version() {
    local cmd=$1
    local min_version=$2
    local current_version=$3
    
    if [ "$(printf '%s\n' "$min_version" "$current_version" | sort -V | head -n1)" != "$min_version" ]; then
        return 1
    fi
    return 0
}

# Check prerequisites
echo -e "${CYAN}Checking prerequisites...${NC}"

# Check Go
if ! command_exists go; then
    echo -e "${RED}✗ Go is not installed${NC}"
    echo "  Please install Go 1.21 or later from https://go.dev/dl/"
    exit 1
else
    GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
    if check_version "1.21" "$GO_VERSION"; then
        echo -e "${GREEN}✓ Go ${GO_VERSION} installed${NC}"
    else
        echo -e "${YELLOW}⚠ Go ${GO_VERSION} installed, but 1.21+ is recommended${NC}"
    fi
fi

# Check Node.js
if ! command_exists node; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js 18+ from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node --version | sed 's/v//')
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}✓ Node.js ${NODE_VERSION} installed${NC}"
    else
        echo -e "${YELLOW}⚠ Node.js ${NODE_VERSION} installed, but 18+ is recommended${NC}"
    fi
fi

# Check npm
if ! command_exists npm; then
    echo -e "${RED}✗ npm is not installed${NC}"
    echo "  npm should come with Node.js. Please reinstall Node.js."
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm ${NPM_VERSION} installed${NC}"
fi

# Check Make (optional but recommended)
if ! command_exists make; then
    echo -e "${YELLOW}⚠ Make is not installed${NC}"
    echo "  Make is recommended for using Makefile commands."
    echo "  Install with:"
    echo "    macOS: xcode-select --install"
    echo "    Linux: sudo apt-get install build-essential (Debian/Ubuntu)"
    echo "           sudo yum groupinstall 'Development Tools' (RHEL/CentOS)"
else
    echo -e "${GREEN}✓ Make installed${NC}"
fi

# Check Docker (optional)
if command_exists docker; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    echo -e "${GREEN}✓ Docker ${DOCKER_VERSION} installed${NC}"
    
    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Docker daemon is running${NC}"
    else
        echo -e "${YELLOW}⚠ Docker is installed but daemon is not running${NC}"
        echo "  Start Docker Desktop or Docker daemon to use Docker commands"
    fi
else
    echo -e "${YELLOW}⚠ Docker is not installed (optional)${NC}"
    echo "  Install Docker for containerized deployment: https://docs.docker.com/get-docker/"
fi

echo ""
echo -e "${CYAN}Setting up project...${NC}"

# Create necessary directories
echo "Creating directories..."
mkdir -p data/characters
mkdir -p data/groups
mkdir -p data/campaigns
mkdir -p data/sessions
mkdir -p data/scenes
mkdir -p bin
echo -e "${GREEN}✓ Directories created${NC}"

# Install Go dependencies
echo "Installing Go dependencies..."
go mod download
go mod tidy
echo -e "${GREEN}✓ Go dependencies installed${NC}"

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd web/ui
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi
cd ../..

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Build the project: make build"
echo "  2. Run the server: make run"
echo "  3. Access the app: http://localhost:8080"
echo ""
echo "For more information, see docs/getting-started/SETUP.md"

