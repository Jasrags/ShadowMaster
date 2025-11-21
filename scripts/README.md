# ShadowMaster Scripts

This directory contains helper scripts for setting up, building, and running ShadowMaster across different platforms.

## Setup Scripts

### `setup.sh` / `setup.ps1`
Automated setup script that checks prerequisites and initializes the project.

**Usage:**
- **macOS/Linux**: `./scripts/setup.sh`
- **Windows**: `.\scripts\setup.ps1`

**What it does:**
- Checks for required tools (Go, Node.js, npm)
- Verifies versions
- Creates necessary directories
- Installs Go dependencies
- Installs frontend dependencies

### `check-prerequisites.sh` / `check-prerequisites.ps1`
Quick check to verify all prerequisites are installed.

**Usage:**
- **macOS/Linux**: `./scripts/check-prerequisites.sh`
- **Windows**: `.\scripts\check-prerequisites.ps1`

## Build Scripts

### `build.ps1`
PowerShell script to build the project (Windows alternative to `make build`).

**Usage:**
```powershell
.\scripts\build.ps1
```

**What it does:**
- Builds the frontend (React/TypeScript)
- Builds the Go backend binary
- Outputs to `bin/shadowmaster-server.exe`

## Run Scripts

### `run.ps1`
PowerShell script to run the server in production mode (Windows alternative to `make run`).

**Usage:**
```powershell
.\scripts\run.ps1
```

**Options:**
```powershell
.\scripts\run.ps1 [port] [data-dir] [web-dir]
```

**What it does:**
- Builds the project if binary doesn't exist
- Creates data directory if needed
- Starts the server with default or specified options
- Serves built static files from `web/static`

### `run-dev.ps1`
PowerShell script to run both API server and frontend dev server (Windows alternative to `make run-dev`).

**Usage:**
```powershell
.\scripts\run-dev.ps1
```

**Options:**
```powershell
.\scripts\run-dev.ps1 [port] [data-dir] [web-dir]
```

**What it does:**
- Runs the Go API server on port 8080 (default)
- Runs the Vite frontend dev server on port 5173
- Provides hot-reload for frontend development
- Proxies `/api` requests to the backend server
- Press Ctrl+C to stop both servers

**Note:** This is the recommended way to develop, as it provides hot-reload and better error messages.

## Test Scripts

### `test.ps1`
PowerShell script to run all tests (Windows alternative to `make test`).

**Usage:**
```powershell
.\scripts\test.ps1
```

**What it does:**
- Runs Go tests
- Runs frontend lint checks
- Installs frontend dependencies if needed

## Docker Scripts

### `docker-build.sh`
Builds Docker images with version tagging.

**Usage:**
```bash
./scripts/docker-build.sh [options]
```

**Options:**
- `--registry REGISTRY_URL` - Tag images for registry
- `--push` - Push images to registry after building
- `--version VERSION` - Specify version (default: from VERSION file or git)
- `--image-name NAME` - Image name (default: shadowmaster)

**Examples:**
```bash
# Basic build
./scripts/docker-build.sh

# Build and tag for registry
./scripts/docker-build.sh --registry myregistry.com

# Build, tag, and push
./scripts/docker-build.sh --registry myregistry.com --push
```

## Helper Scripts

### `enable-scripts.ps1`
Helper script to configure PowerShell execution policy on Windows.

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\enable-scripts.ps1
```

**What it does:**
- Checks current execution policy
- Provides options to set execution policy
- Recommended: RemoteSigned for CurrentUser (allows local scripts, requires signed remote scripts)

**If you get execution policy errors:**
1. Run the helper script above, or
2. Manually set: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Platform-Specific Notes

### macOS/Linux
- Use `setup.sh` and `check-prerequisites.sh` for setup
- Use Makefile commands for building/running/testing
- Scripts require execute permissions: `chmod +x scripts/*.sh`

### Windows
- **First time:** Run `enable-scripts.ps1` to allow script execution
- Use `setup.ps1` and `check-prerequisites.ps1` for setup
- Use PowerShell scripts (`build.ps1`, `run.ps1`, `test.ps1`) as alternatives to Makefile
- Or install WSL (Windows Subsystem for Linux) to use Makefile commands

### WSL (Windows Subsystem for Linux)
- Follow Linux setup instructions
- Use `setup.sh` and Makefile commands
- Access project from `/mnt/c/...` path

## See Also

- [Setup Guide](../docs/getting-started/SETUP.md) - Detailed setup instructions
- [Quick Start Guide](../docs/getting-started/QUICK-START.md) - Quick setup guide
- [Main README](../README.md) - Project overview

