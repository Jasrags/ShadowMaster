# ShadowMaster RPG System

A tabletop RPG management system for Shadowrun 3rd edition with support for multiple interfaces (web and CLI) and extensibility for other editions.

## Features

- **Character Management**: Create and manage Shadowrun 3rd edition characters with full attribute and skill systems
- **Campaign Organization**: Organize characters into groups, create campaigns, manage sessions and scenes
- **Multiple Interfaces**: 
  - Web interface (HTML/CSS/JavaScript)
  - CLI interface (command-line)
- **JSON File Storage**: All data stored in JSON files (extensible to database in future)
- **REST API**: Complete REST API for all entities
- **User Authentication**: Email-based registration, secure login, and role-based access control (Admin, Gamemaster, Player)
- **Real-time Support**: WebSocket support for live updates (planned)

## Architecture

### Backend
- **Language**: Go
- **Routing**: Chi router
- **Storage**: JSON files with file locking for concurrency safety
- **API**: RESTful API with CRUD operations for all entities

### Frontend
- **Web**: Vanilla JavaScript (can migrate to framework if needed)
- **Style**: Custom CSS with dark theme

## Project Structure

```
cmd/
  shadowmaster-server/     # HTTP + WebSocket server
  shadowmaster-cli/         # CLI application (in progress)
internal/
  domain/                   # Domain models (Character, Campaign, Session, etc.)
  repository/               # Repository interfaces
    json/                   # JSON file implementation
  service/                  # Business logic
  api/                      # HTTP handlers
  cli/                      # CLI command handlers (in progress)
  config/                   # Configuration management
pkg/
  shadowrun/                # Shadowrun-specific game mechanics
    edition/v3/             # SR3 specific logic
  storage/                  # JSON file storage utilities
data/                       # JSON data files directory
  characters/
  groups/
  campaigns/
  sessions/
  scenes/
web/
  static/                   # Static assets
    index.html
    css/
    js/
```

## Getting Started

### Quick Setup

**macOS/Linux:**
```bash
./scripts/setup.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

For detailed platform-specific setup instructions, see the [Setup Guide](docs/getting-started/SETUP.md).

### Prerequisites
- Go 1.21 or later
- Node.js 18+ and npm
- Make (for using Makefile commands on macOS/Linux/WSL)
- Docker (optional, for containerized deployment)

**Windows Users:** You can use WSL (Windows Subsystem for Linux) for Makefile support, or use the PowerShell scripts in the `scripts/` directory.

**Note for Windows:** If you get a PowerShell execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Or use the helper script: `powershell -ExecutionPolicy Bypass -File .\scripts\enable-scripts.ps1`

### Using the Makefile (macOS/Linux/WSL)

The project includes a Makefile for common development tasks:

```bash
# Show all available commands
make help

# Initialize project (install dependencies and create directories)
make init

# Build the server binary
make build

# Run the server (default port 8080)
make server
# or
make run

# Run in development mode
make run-dev
# or for server only
make dev

# Format code and run linting
make lint

# Run tests
make test

# Clean build artifacts
make clean
```

### Using PowerShell Scripts (Windows)

Windows users can use PowerShell scripts as an alternative to Makefile:

```powershell
# Check prerequisites
.\scripts\check-prerequisites.ps1

# Build the project
.\scripts\build.ps1

# Run the server
.\scripts\run.ps1

# Run in development mode (with live reload if Air is installed)
.\scripts\run-dev.ps1

# Run tests
.\scripts\test.ps1
```

### Running the Server Manually

```bash
SESSION_SECRET="change-me" go run cmd/shadowmaster-server/main.go
```

The server will start on port 8080 by default. Options:
- `-port`: Server port (default: 8080)
- `-data`: Path to data directory (default: ./data)
- `-web`: Path to web static files (default: ./web/static)
- `SESSION_SECRET`: Environment variable used to sign session cookies (generates a default if unset, but using a unique value per environment is strongly recommended)

### Building Binaries

```bash
# Build server
make build
# Output: bin/shadowmaster-server

# Build CLI (when implemented)
make build-cli
# Output: bin/shadowmaster-cli

# Build both
make build-all
```

### Accessing the Web Interface

After starting the server, open your browser to `http://localhost:8080`
You will be greeted with a combined login/registration panel powered by the React shell. The first account created will automatically be granted **Administrator** permissions; additional accounts default to **Player** role but can be elevated later.

## API Endpoints

### Characters
- `GET /api/characters` - List all characters
- `GET /api/characters/{id}` - Get character by ID
- `POST /api/characters` - Create character
- `PUT /api/characters/{id}` - Update character
- `DELETE /api/characters/{id}` - Delete character

### Groups
- `GET /api/groups` - List all groups
- `GET /api/groups/{id}` - Get group by ID
- `POST /api/groups` - Create group
- `PUT /api/groups/{id}` - Update group
- `DELETE /api/groups/{id}` - Delete group

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/{id}` - Get campaign by ID
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/{id}` - Update campaign
- `DELETE /api/campaigns/{id}` - Delete campaign

### Sessions
- `GET /api/sessions` - List all sessions
- `GET /api/sessions/{id}` - Get session by ID
- `POST /api/sessions` - Create session
- `PUT /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Delete session

### Scenes
- `GET /api/scenes` - List all scenes
- `GET /api/scenes/{id}` - Get scene by ID
- `POST /api/scenes` - Create scene
- `PUT /api/scenes/{id}` - Update scene
- `DELETE /api/scenes/{id}` - Delete scene

### Authentication
- `POST /api/auth/register` - Create a user account (first user becomes Administrator)
- `POST /api/auth/login` - Authenticate with email + password
- `POST /api/auth/logout` - Clear session cookie (requires active session)
- `GET /api/auth/me` - Fetch current authenticated user profile
- `POST /api/auth/password` - Change password (requires current password + policy-compliant new password)

All authentication endpoints return/accept JSON and rely on HTTP-only cookies for session management. The frontend client automatically includes credentials (`fetch(..., { credentials: 'include' })`) when communicating with the API.

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make init` | Initialize project (install deps, create directories) |
| `make deps` | Download and install dependencies |
| `make build` | Build the server binary |
| `make build-cli` | Build the CLI binary |
| `make build-all` | Build both server and CLI |
| `make server` | Run the server |
| `make dev` | Run the server in development mode (with live reload if Air is installed) |
| `make run-dev` | Run both API server and frontend dev server (with live reload if Air is installed) |
| `make cli` | Run the CLI |
| `make install` | Build and install server to GOPATH/bin |
| `make test` | Run tests |
| `make test-coverage` | Run tests with coverage report |
| `make fmt` | Format Go code |
| `make vet` | Run go vet |
| `make lint` | Format code and run vet |
| `make clean` | Clean build artifacts |
| `make clean-data` | Clean data directory (with confirmation) |

## Development Status

### Completed (Phase 1: Foundation)
- ✅ Project structure and Go module setup
- ✅ JSON file storage system with file locking
- ✅ Domain models (Character, Group, Campaign, Session, Scene)
- ✅ Repository layer with JSON file implementation
- ✅ REST API endpoints for CRUD operations
- ✅ Basic web server serving static files
- ✅ Basic character service for SR3 character creation

### In Progress
- Character management (SR3 character creation workflow)
- Web UI for character creation/editing
- CLI application

### Planned
- Dice rolling system
- Initiative tracking
- Combat state management
- Notes/journal system
- WebSocket real-time updates
- Edition abstraction layer

## Docker Deployment

ShadowMaster can be deployed using Docker for easy containerized deployment. See the [Deployment Guide](docs/deployment/README.md) for detailed instructions.

### Quick Start with Docker

```bash
# Build Docker image
make docker-build

# Run container
make docker-run
```

Or using docker-compose:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:8080`.

For Portainer deployment, see the [Portainer Deployment Guide](docs/deployment/portainer.md).

## License

[Add license information]

