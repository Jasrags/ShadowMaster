# Quick Start Guide

Get ShadowMaster up and running in minutes!

## 1. Prerequisites Check

**macOS/Linux:**
```bash
./scripts/check-prerequisites.sh
```

**Windows:**
```powershell
.\scripts\check-prerequisites.ps1
```

## 2. Setup

**macOS/Linux:**
```bash
./scripts/setup.sh
```

**Windows:**

If you get an execution policy error, first run:
```powershell
# Enable script execution (one-time setup)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use the helper script
powershell -ExecutionPolicy Bypass -File .\scripts\enable-scripts.ps1
```

Then run:
```powershell
.\scripts\setup.ps1
```

## 3. Build

**Using Makefile (macOS/Linux/WSL):**
```bash
make build
```

**Using PowerShell (Windows):**
```powershell
.\scripts\build.ps1
```

## 4. Run

**Using Makefile:**
```bash
# Production mode (serves built static files)
make run

# Development mode (runs API server + frontend dev server with hot reload)
make run-dev
```

**Using PowerShell:**
```powershell
# Production mode
.\scripts\run.ps1

# Development mode (if available)
.\scripts\run-dev.ps1
```

## 5. Access

**Production mode:**
- Open your browser to: **http://localhost:8080**

**Development mode:**
- API server: **http://localhost:8080**
- Frontend dev server: **http://localhost:5173** (with hot module reload)

The first user you create will automatically become an Administrator.

## What's Next?

- Read the [Setup Guide](SETUP.md) for detailed platform-specific instructions
- Check the [Application Flow](application-flow.md) to understand how to use ShadowMaster
- See the [Deployment Guide](../deployment/README.md) for Docker deployment

## Need Help?

- **Setup issues?** See [Troubleshooting](SETUP.md#troubleshooting)
- **Docker deployment?** See [Deployment Guide](../deployment/README.md)
- **General questions?** Check the [main README](../../README.md)

