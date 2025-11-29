# Portainer Configuration Information Required

This document lists the configuration values you'll need when deploying ShadowMaster to Portainer. 

**Where to provide these values:**
- Fill in your local `.env` file with these values (for reference)
- Enter them in Portainer's **Environment variables** section when creating the stack
- See [How to Provide This Information](#how-to-provide-this-information) below for details

Before deploying to Portainer, gather the following configuration details:

## Required Information

### 1. Registry Configuration
- **Registry URL**: 
  - Local Docker registry URL (e.g., `registry.local:5000`)
  - Or Docker Hub username (e.g., `yourusername`)
  - Or leave empty if building images directly in Portainer from Git repository

### 2. Network Configuration
- **Network Name**: 
  - Preferred network name (default: `shadowmaster-network`)
  - Or existing network name to use
  - Network driver preference (default: `bridge`)

### 3. Volume Configuration
- **Volume Type**:
  - Named volume (default: `shadowmaster-data`)
  - Or bind mount path (e.g., `/host/path/to/data:/data`)
  
- **Volume Driver**: (if using named volume)
  - Default: `local`
  - Or specify if using external volume driver

### 4. Port Mapping
- **External Port**: 
  - Default: `8080:8080`
  - Or custom port mapping (e.g., `9000:8080`)

### 5. Environment Variables
- **SESSION_SECRET**: 
  - **REQUIRED** - A secure random string for session cookie signing
  - Generate with: `openssl rand -hex 32`
  - Minimum 32 characters recommended

### 6. Resource Limits (Optional)
- **CPU Limit**: 
  - e.g., `1` (one CPU), `0.5` (half CPU), or leave empty for no limit
  
- **Memory Limit**: 
  - e.g., `512m`, `1g`, or leave empty for no limit
  
- **CPU Reservation**: 
  - Minimum CPU guaranteed (optional)
  
- **Memory Reservation**: 
  - Minimum memory guaranteed (optional)

### 7. Restart Policy
- **Policy**: 
  - `always` - Always restart
  - `unless-stopped` - Restart unless explicitly stopped (default)
  - `on-failure` - Restart only on failure
  - `no` - Never restart

## How to Provide This Information

You have two options for providing this configuration:

### Option 1: Use Your Local `.env` File (Recommended)

1. **Update your `.env` file** with the values from this document
2. **Copy the values** from your `.env` file when deploying in Portainer
3. **Enter them** in Portainer's "Environment variables" section when creating the stack

### Option 2: Enter Directly in Portainer

When deploying the stack in Portainer:
1. Go to **Stacks** → **Add stack**
2. In the **Environment variables** section, add each variable from this document
3. Portainer will use these values to substitute variables in `docker-compose.portainer.yml`

### Where to Enter in Portainer

When creating a new stack in Portainer:
- **Stack name**: `shadowmaster`
- **Build method**: Repository (or Web editor if pasting compose file)
- **Compose path**: `docker-compose.portainer.yml` (if using Repository method)
- **Environment variables**: Add all variables from your `.env` file here

See the [Portainer Deployment Guide](./portainer.md) for detailed step-by-step instructions.

## Quick Start Template

If you want to proceed with defaults, you can use this minimal configuration:

```env
IMAGE_NAME=shadowmaster
VERSION=0.1.0
PORT=8080
SESSION_SECRET=<generate-a-secure-random-string>
RESTART_POLICY=unless-stopped
```

All other settings will use the defaults defined in `docker-compose.portainer.yml`.

