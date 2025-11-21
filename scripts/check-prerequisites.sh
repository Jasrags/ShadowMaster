#!/bin/bash
# Quick prerequisite check script for Mac and Linux

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${CYAN}Checking prerequisites...${NC}"
echo ""

ALL_OK=true

# Check Go
if command_exists go; then
    GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
    echo -e "${GREEN}✓ Go ${GO_VERSION}${NC}"
else
    echo -e "${RED}✗ Go not found${NC}"
    ALL_OK=false
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ALL_OK=false
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    ALL_OK=false
fi

# Check Make (optional)
if command_exists make; then
    echo -e "${GREEN}✓ Make${NC}"
else
    echo -e "${YELLOW}⚠ Make not found (optional)${NC}"
fi

# Check Docker (optional)
if command_exists docker; then
    if docker info >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Docker (running)${NC}"
    else
        echo -e "${YELLOW}⚠ Docker (not running)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker not found (optional)${NC}"
fi

echo ""

if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}All required prerequisites are installed!${NC}"
    exit 0
else
    echo -e "${RED}Some required prerequisites are missing.${NC}"
    echo "Run ./scripts/setup.sh for installation instructions."
    exit 1
fi

