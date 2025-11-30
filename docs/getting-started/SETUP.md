# ShadowMaster Setup Guide

This guide provides platform-specific instructions for setting up ShadowMaster on macOS, Linux, and Windows.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Platform-Specific Setup](#platform-specific-setup)
  - [macOS](#macos)
  - [Linux](#linux)
  - [Windows](#windows)
- [Verification](#verification)
- [Building and Running](#building-and-running)
- [Testing](#testing)
- [Docker Setup](#docker-setup)
- [Troubleshooting](#troubleshooting)

## Quick Start

The fastest way to get started is using the setup scripts:

**macOS/Linux:**
```bash
./scripts/setup.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

These scripts will check prerequisites and set up the project automatically.

## Prerequisites

### Required

- **Go 1.24.3 or later** - [Download](https://go.dev/dl/)
- **Node.js 18+ and npm** - [Download](https://nodejs.org/)
- **Git** - Usually pre-installed

### Optional

- **Make** - For using Makefile commands (Unix/macOS) or WSL (Windows)
- **Docker** - For containerized deployment

## Platform-Specific Setup

### macOS

#### 1. Install Prerequisites

**Using Homebrew (Recommended):**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Go
brew install go

# Install Node.js
brew install node

# Install Make (usually pre-installed, but if not)
xcode-select --install
```

**Manual Installation:**
- Go: Download from [go.dev/dl](https://go.dev/dl/) and follow installer
- Node.js: Download from [nodejs.org](https://nodejs.org/) and run installer
- Make: Install Xcode Command Line Tools: `xcode-select --install`

#### 2. Verify Installation

```bash
go version    # Should show 1.24.3 or later
node --version # Should show v18 or later
npm --version
make --version
```

#### 3. Run Setup Script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Linux

#### 1. Install Prerequisites

**Debian/Ubuntu:**
```bash
# Update package list
sudo apt update

# Install Go
sudo apt install golang-go

# Install Node.js (using NodeSource repository for latest version)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Make and build tools
sudo apt install build-essential
```

**RHEL/CentOS/Fedora:**
```bash
# Install Go
sudo dnf install golang

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install Make and build tools
sudo dnf groupinstall "Development Tools"
```

**Arch Linux:**
```bash
sudo pacman -S go nodejs npm make
```

#### 2. Verify Installation

```bash
go version
node --version
npm --version
make --version
```

#### 3. Run Setup Script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Windows

#### Option A: Native Windows Setup

**1. Install Prerequisites:**

- **Go**: Download installer from [go.dev/dl](https://go.dev/dl/) and run
- **Node.js**: Download installer from [nodejs.org](https://nodejs.org/) and run
- **Git**: Download from [git-scm.com](https://git-scm.com/download/win) or use Git for Windows

**2. Verify Installation:**

Open PowerShell and run:
```powershell
go version
node --version
npm --version
```

**Note:** If `node` or `npm` commands are not found, they may be installed but not in your PATH. The setup script will detect and use them automatically, but you may want to add `C:\Program Files\nodejs` to your system PATH permanently (see Troubleshooting section).

**3. Enable PowerShell Script Execution (if needed):**

If you get an execution policy error, you need to allow script execution:

```powershell
# Check current execution policy
Get-ExecutionPolicy

# Set execution policy for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run script with bypass (one-time)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

**4. Run Setup Script:**

```powershell
.\scripts\setup.ps1
```

**4. Using PowerShell Scripts:**

Since Make may not be available on Windows, use PowerShell scripts:

```powershell
# Build
.\scripts\build.ps1

# Run
.\scripts\run.ps1

# Test
.\scripts\test.ps1
```

#### Option B: Windows Subsystem for Linux (WSL) - Recommended

WSL allows you to use the same setup as Linux, including Makefile commands.

**1. Install WSL:**

```powershell
# Run as Administrator
wsl --install
```

**2. Restart your computer** when prompted

**3. Set up Linux environment:**

After restart, complete WSL setup and then follow the [Linux setup instructions](#linux)

**4. Access project from WSL:**

```bash
# Navigate to your project (adjust path as needed)
cd /mnt/c/Users/YourUsername/OneDrive/Documents/GitHub/ShadowMaster

# Use Linux setup script
./scripts/setup.sh
```

## Verification

After running the setup script, verify everything is working:

**macOS/Linux:**
```bash
./scripts/check-prerequisites.sh
```

**Windows:**
```powershell
.\scripts\check-prerequisites.ps1
```

## Building and Running

### Using Makefile (macOS/Linux/WSL)

```bash
# Install dependencies (Go and Node.js)
make deps

# Initialize project (creates directories - deps are already installed)
make init

# Build the project
make build

# Run the server
make run

# Or run in development mode
make dev
```

**Note:** `make init` automatically runs `make deps`, so you can skip the `make deps` step if you're running `make init`. However, if you only need to update dependencies without recreating directories, you can run `make deps` separately.

### Using PowerShell Scripts (Windows)

```powershell
# Build the project
.\scripts\build.ps1

# Run the server
.\scripts\run.ps1
```

### Manual Build

**Install Dependencies:**
```bash
# Install Go dependencies
go mod download
go mod tidy

# Install Node.js dependencies
cd web/ui
npm install
cd ../..
```

**Build:**
```bash
# Build backend
go build -o bin/shadowmaster-server ./cmd/shadowmaster-server

# Build frontend
cd web/ui
npm run build
cd ../..
```

**Note:** Using `make deps` is recommended as it handles both Go and Node.js dependencies automatically.

**Run:**
```bash
# Set session secret (optional, but recommended)
export SESSION_SECRET="your-secret-key"

# Run server
./bin/shadowmaster-server -port 8080 -data ./data -web ./web/static
```

## Testing

### Using Makefile

```bash
# Run all tests
make test

# Run Go tests only
make test-go

# Run frontend tests only
make test-react

# Run with coverage
make test-coverage
```

### Using PowerShell Scripts (Windows)

```powershell
.\scripts\test.ps1
```

### Manual Testing

**Go Tests:**
```bash
go test ./...
```

**Frontend Tests:**
```bash
cd web/ui
npm run lint
npm test
```

## Docker Setup

### Prerequisites

Install Docker for your platform:
- **macOS**: We use [Colima](https://github.com/abiosoft/colima) for local Docker. Install with:
  ```bash
  brew install colima docker docker-compose
  colima start
  ```
  Alternatively, you can use [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/).
- **Linux**: [Installation Guide](https://docs.docker.com/engine/install/)
- **Windows**: [Download Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)

### Build and Run with Docker

**Using Makefile:**
```bash
# Build Docker image
make docker-build

# Run container
make docker-run
```

**Using Docker Compose:**
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

For detailed Docker deployment instructions, see [Deployment Guide](../deployment/README.md).

## Troubleshooting

### Common Issues

#### Go Version Issues

**Problem:** `go: go.mod requires go >= 1.24.3`

**Solution:**
- Update Go to version 1.24.3 or later
- Verify: `go version`
- If using package manager, update: `brew upgrade go` (macOS) or `sudo apt upgrade golang-go` (Linux)

#### Node.js Version Issues

**Problem:** Frontend build fails or npm errors

**Solution:**
- Ensure Node.js 18+ is installed: `node --version`
- Update npm: `npm install -g npm@latest`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf web/ui/node_modules && cd web/ui && npm install`

#### Permission Denied (macOS/Linux)

**Problem:** `Permission denied` when running scripts

**Solution:**
```bash
chmod +x scripts/*.sh
```

#### Make Not Found (Windows)

**Problem:** `'make' is not recognized`

**Solutions:**
1. **Use WSL** (Recommended): Install WSL and use Linux commands
2. **Use PowerShell scripts**: Use `.\scripts\build.ps1` instead of `make build`
3. **Install Make for Windows**: Download from [GnuWin32](http://gnuwin32.sourceforge.net/packages/make.htm) or use Chocolatey: `choco install make`

#### PowerShell Execution Policy (Windows)

**Problem:** `cannot be loaded because running scripts is disabled on this system`

**Solution:**
```powershell
# Option 1: Set execution policy for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Option 2: Bypass for current session only
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Option 3: Run script with bypass flag
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

**Note:** `RemoteSigned` allows local scripts to run but requires downloaded scripts to be signed. This is the recommended setting for development.

#### Node.js Not Found in PATH (Windows)

**Problem:** Node.js is installed but script says it's not found

**Solution:**

The setup script will automatically detect Node.js in common locations and add it to PATH for the current session. To make it permanent:

1. **Find Node.js installation path** (usually `C:\Program Files\nodejs`)

2. **Add to System PATH:**
   - Open System Properties → Advanced → Environment Variables
   - Under "System variables", find `Path` and click Edit
   - Click New and add: `C:\Program Files\nodejs`
   - Click OK on all dialogs

3. **Or use PowerShell (as Administrator):**
   ```powershell
   [Environment]::SetEnvironmentVariable(
       "Path",
       [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\Program Files\nodejs",
       "Machine"
   )
   ```

4. **Restart PowerShell** for changes to take effect

**Note:** The setup script will work even if Node.js isn't in PATH - it will add it for the current session automatically.

#### Port Already in Use

**Problem:** `bind: address already in use` or `port 8080 is already in use`

**Solution:**
```bash
# Find process using port 8080
# macOS/Linux:
lsof -i :8080
kill -9 <PID>

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or use a different port
make run PORT=8081
```

#### Docker Daemon Not Running

**Problem:** `Cannot connect to the Docker daemon`

**Solution:**
- **macOS (Colima)**: Start Colima: `colima start`
- **macOS (Docker Desktop)**: Start Docker Desktop application
- **Windows**: Start Docker Desktop application
- **Linux**: Start Docker service: `sudo systemctl start docker`

#### Frontend Build Fails

**Problem:** `npm run build` fails

**Solution:**
```bash
cd web/ui
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Getting Help

If you encounter issues not covered here:

1. Check the [main README](../../README.md) for general information
2. Review [Deployment Guide](../deployment/README.md) for Docker-specific issues
3. Check project issues on GitHub
4. Verify all prerequisites are installed correctly

## Next Steps

After successful setup:

1. **Install dependencies**: `make deps` or `make init` (which includes deps)
2. **Build the project**: `make build` or `.\scripts\build.ps1`
3. **Run the server**: `make run` or `.\scripts\run.ps1`
4. **Access the application**: Open `http://localhost:8080` in your browser
5. **Create an account**: The first user becomes an Administrator
6. **Read the documentation**: See [Application Flow](./application-flow.md) for usage

## Development Workflow

### Daily Development

```bash
# Ensure dependencies are installed (first time or after updates)
make deps

# Start development server (runs both API and frontend dev server)
make run-dev

# Or run separately:
# Terminal 1: API server
make dev

# Terminal 2: Frontend dev server
cd web/ui && npm run dev
```

### Code Quality

```bash
# Format code
make fmt

# Run linter
make lint

# Run tests
make test
```

### Building for Production

```bash
# Build binary
make build

# Build Docker image
make docker-build
```

For more information, see the [main README](../../README.md) and [Deployment Guide](../deployment/README.md).

