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
make run
```

**Using PowerShell:**
```powershell
.\scripts\run.ps1
```

## 5. Access

Open your browser to: **http://localhost:8080**

The first user you create will automatically become an Administrator.

## What's Next?

- Read the [Setup Guide](SETUP.md) for detailed platform-specific instructions
- Check the [Application Flow](application-flow.md) to understand how to use ShadowMaster
- See the [Deployment Guide](../deployment/README.md) for Docker deployment

## Need Help?

- **Setup issues?** See [Troubleshooting](SETUP.md#troubleshooting)
- **Docker deployment?** See [Deployment Guide](../deployment/README.md)
- **General questions?** Check the [main README](../../README.md)

