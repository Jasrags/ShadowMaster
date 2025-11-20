# Portainer Configuration Information Required

Before deploying to Portainer, please provide the following configuration details:

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

Once you have these details, we can:
1. Update `docker-compose.portainer.yml` with your specific configuration
2. Create a customized `.env` file template
3. Provide specific deployment instructions for your setup

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

