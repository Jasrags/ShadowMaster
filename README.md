# ShadowMaster RPG System

A tabletop RPG management system for Shadowrun with support for multiple editions (SR3, SR5), multiple interfaces (web and CLI), and extensibility for future editions.

## Features

- **Character Management**: Create and manage Shadowrun characters with full attribute and skill systems
  - **Shadowrun 3rd Edition (SR3)**: Full character creation support
  - **Shadowrun 5th Edition (SR5)**: Character creation with Priority, Sum to Ten, and Karma build methods
- **Campaign Organization**: Organize characters into groups, create campaigns, manage sessions and scenes
- **Multiple Interfaces**: 
  - Web interface (React + TypeScript with Vite)
  - CLI interface (command-line, in progress)
- **JSON File Storage**: All data stored in JSON files (extensible to database in future)
- **REST API**: Complete REST API for all entities
- **User Authentication**: Email-based registration, secure login, and role-based access control (Admin, Gamemaster, Player)
- **Real-time Support**: WebSocket support for live updates (planned)

## Architecture

### Backend
- **Language**: Go 1.24.3+
- **Routing**: Chi router
- **Storage**: JSON files with file locking for concurrency safety
- **API**: RESTful API with CRUD operations for all entities
- **Edition System**: Extensible edition registry supporting multiple Shadowrun editions

### Frontend
- **Web**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: React Aria Components
- **Styling**: Tailwind CSS

## Development Approach

This project is being developed using a **full AI-assisted approach** with [Cursor](https://cursor.sh) and its integrated AI tools. The development process leverages:

- **AI Pair Programming**: Real-time code generation, refactoring, and optimization using Cursor's AI assistant
- **Semantic Code Search**: AI-powered codebase understanding for context-aware suggestions and implementations
- **Automated Documentation**: AI-assisted documentation generation and updates
- **Intelligent Code Review**: AI-driven code quality checks, linting, and best practice suggestions
- **Cross-Language Support**: Seamless assistance across Go backend and React/TypeScript frontend development

This AI-first development methodology enables rapid iteration, consistent code quality, and comprehensive feature implementation while maintaining clean architecture and best practices. The AI assistant helps with everything from initial feature design to bug fixes, test writing, and documentation updates.

**Note**: While AI tools significantly accelerate development, all code decisions, architecture choices, and final implementations are reviewed and approved by the developer to ensure quality and alignment with project goals.

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
    edition/                # Edition registry and interfaces
      v3/                   # SR3 specific logic
      v5/                   # SR5 specific logic
  storage/                  # JSON file storage utilities
data/                       # JSON data files directory
  characters/
  groups/
  campaigns/
  sessions/
  scenes/
  editions/                 # Edition-specific data files
    sr3/
    sr5/
web/
  static/                   # Built static assets (generated)
  ui/                       # React frontend source
    src/
    package.json
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
- Go 1.24.3 or later
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

# Install dependencies (Go and Node.js)
make deps

# Initialize project (install dependencies and create directories)
make init

# Build the server binary
make build

# Run the server (default port 8080)
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

### Health
- `GET /health` - Health check endpoint (no authentication required)

### Authentication
- `POST /api/auth/register` - Create a user account (first user becomes Administrator)
- `POST /api/auth/login` - Authenticate with email + password
- `GET /api/auth/me` - Fetch current authenticated user profile
- `POST /api/auth/logout` - Clear session cookie (requires active session)
- `POST /api/auth/password` - Change password (requires current password + policy-compliant new password)

All authentication endpoints return/accept JSON and rely on HTTP-only cookies for session management. The frontend client automatically includes credentials (`fetch(..., { credentials: 'include' })`) when communicating with the API.

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
- `GET /api/campaigns/{id}/character-creation` - Get character creation data for campaign
- `POST /api/campaigns` - Create campaign (requires Admin/GM role)
- `PUT /api/campaigns/{id}` - Update campaign (requires Admin/GM role)
- `DELETE /api/campaigns/{id}` - Delete campaign (requires Admin/GM role)
- `POST /api/campaigns/{id}/invitations` - Invite player to campaign (requires Admin/GM role)
- `GET /api/campaigns/{id}/invitations` - Get campaign invitations (requires Admin/GM role)
- `DELETE /api/campaigns/{id}/invitations/{playerId}` - Remove invitation (requires Admin/GM role)
- `DELETE /api/campaigns/{id}/players/{playerId}` - Remove player from campaign (requires Admin/GM role)

### Campaign Invitations
- `GET /api/invitations` - Get current user's invitations (requires authentication)
- `POST /api/invitations/{id}/accept` - Accept invitation (requires authentication)
- `POST /api/invitations/{id}/decline` - Decline invitation (requires authentication)

### Sessions
- `GET /api/sessions` - List all sessions
- `GET /api/sessions/{id}` - Get session by ID
- `POST /api/sessions` - Create session (requires Admin/GM role)
- `PUT /api/sessions/{id}` - Update session (requires Admin/GM role)
- `DELETE /api/sessions/{id}` - Delete session (requires Admin/GM role)

### Scenes
- `GET /api/scenes` - List all scenes
- `GET /api/scenes/{id}` - Get scene by ID
- `POST /api/scenes` - Create scene (requires Admin/GM role)
- `PUT /api/scenes/{id}` - Update scene (requires Admin/GM role)
- `DELETE /api/scenes/{id}` - Delete scene (requires Admin/GM role)

### Editions
- `GET /api/editions/{edition}/character-creation` - Get character creation data for edition
- `GET /api/editions/{edition}/books` - List available source books for edition

### Skills
- `GET /api/skills/active` - Get active skills
- `GET /api/skills/knowledge` - Get knowledge skills

### Equipment (Public)
- `GET /api/equipment/armor` - Get armor equipment
- `GET /api/equipment/cyberware` - Get cyberware equipment

### Equipment (Admin Only)
- `GET /api/equipment/skills` - Get skills data
- `GET /api/equipment/weapons` - Get weapons data
- `GET /api/equipment/weapon-accessories` - Get weapon accessories
- `GET /api/equipment/gear` - Get gear
- `GET /api/equipment/qualities` - Get qualities
- `GET /api/equipment/books` - Get books
- `GET /api/equipment/lifestyles` - Get lifestyles
- `GET /api/equipment/weapon-consumables` - Get weapon consumables
- `GET /api/equipment/contacts` - Get contacts
- `GET /api/equipment/actions` - Get actions
- `GET /api/equipment/bioware` - Get bioware
- `GET /api/equipment/complex-forms` - Get complex forms
- `GET /api/equipment/mentors` - Get mentors
- `GET /api/equipment/metatypes` - Get metatypes
- `GET /api/equipment/powers` - Get powers
- `GET /api/equipment/programs` - Get programs
- `GET /api/equipment/spells` - Get spells
- `GET /api/equipment/traditions` - Get traditions
- `GET /api/equipment/vehicle-modifications` - Get vehicle modifications
- `GET /api/equipment/vehicles` - Get vehicles

### Users
- `GET /api/users` - List all users (requires Admin/GM role)
- `GET /api/users/search` - Search users (requires authentication)

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make init` | Initialize project (install deps, create directories) |
| `make deps` | Download and install dependencies |
| `make frontend-build` | Build the frontend only |
| `make build` | Build the server binary (includes frontend build) |
| `make build-cli` | Build the CLI binary |
| `make build-all` | Build both server and CLI |
| `make run` | Build and run the server in production mode |
| `make dev` | Run the server in development mode |
| `make run-dev` | Run both API server and frontend dev server |
| `make cli` | Run the CLI |
| `make install` | Build and install server to GOPATH/bin |
| `make install-cli` | Build and install CLI to GOPATH/bin |
| `make test` | Run Go and React tests |
| `make test-go` | Run Go tests only |
| `make test-react` | Run React lint checks |
| `make test-coverage` | Run tests with coverage report |
| `make fmt` | Format Go code |
| `make vet` | Run go vet |
| `make lint` | Format code and run vet |
| `make clean` | Clean build artifacts |
| `make clean-data` | Clean data directory (with confirmation) |
| `make watch` | Watch for file changes and rebuild (requires fswatch or entr) |
| `make docker-build` | Build Docker image with version tagging |
| `make docker-tag` | Tag Docker image for registry (requires DOCKER_REGISTRY) |
| `make docker-push` | Push Docker image to registry (requires DOCKER_REGISTRY) |
| `make docker-run` | Run Docker container locally |
| `make docker-clean` | Remove Docker images |

## Development Status

### Completed
- ✅ Project structure and Go module setup
- ✅ JSON file storage system with file locking
- ✅ Domain models (Character, Group, Campaign, Session, Scene)
- ✅ Repository layer with JSON file implementation
- ✅ REST API endpoints for CRUD operations
- ✅ React + TypeScript frontend with Vite
- ✅ User authentication and role-based access control
- ✅ Character service with edition registry
- ✅ SR3 character creation support
- ✅ SR5 character creation support (Priority, Sum to Ten, Karma methods)
- ✅ Campaign management with edition and creation method selection
- ✅ Session and scene management

### In Progress
- Character creation wizard UI improvements
- Equipment and gear selection
- Skill allocation interface

### Planned
- Dice rolling system
- Initiative tracking
- Combat state management
- Notes/journal system
- WebSocket real-time updates
- Additional Shadowrun editions

## Active Plans & Remaining Work

This section tracks active development plans and remaining work items. See individual plan files in `.cursor/plans/` for detailed implementation details.

### TypeScript & Code Quality

- **[Fix Remaining TypeScript Errors](.cursor/plans/fix-remaining-typescript-errors-f1582b49.plan.md)** - ⏳ In Progress
  - Fix ReactNode type errors in ArmorViewModal and WeaponAccessoryViewModal
  - Fix duplicate AttributeRange interface declarations
  - Fix index signature errors in SumToTenSelector and Step2MetatypeAttributes
  - Fix unused variable/parameter warnings across multiple files
  - Fix Spell array type mismatch in Step3MagicResonance
  - Fix DataTable generic type constraint

### Character Creation & UI

- **[SR5 Character Creation UI Implementation](.cursor/plans/sr5-character-creation-ui-implementation.plan.md)** - ⏳ In Progress
  - Backend complete, UI components pending
  - Multi-step wizard for Priority, Sum-to-Ten, and Karma build methods
  - Step components for all 9 character creation steps

- **[SR5 Character Creation Implementation](.cursor/plans/sr5-character-creation-implementation-c4059700.plan.md)** - ✅ Backend Complete
  - All backend implementation complete
  - UI/frontend components not yet built

- **[Reorder Character Creation Steps](.cursor/plans/reorder-character-creation-steps-13411a0f.plan.md)** - Status unknown

### Campaign & Session Management

- **[Campaign Creation Flow](.cursor/plans/campaign-creation-flow.plan.md)** - ⏳ Pending
  - Multi-step wizard for GM onboarding
  - Roster & roles management
  - World backbone (factions, locations)
  - Automation & house rules configuration
  - Session seed creation

- **[NPC Library](.cursor/plans/npc-library.plan.md)** - ⏳ Pending
  - NPC creation and management system
  - Template library for reusable NPCs
  - Campaign integration
  - Quick stat block creation

### Database & Data Management

- **[Wire in Missing v5 Database Tabs](.cursor/plans/wire-in-missing-v5-database-tabs-bbfa3b59.plan.md)** - ✅ Complete
  - All 11 missing v5 data files have been wired in
  - Backend handlers, frontend components, and routes all implemented

- **[Data Generation, Normalization, and Cleanup](.cursor/plans/data-generation-normalization-cleanup.plan.md)** - ⏳ In Progress
  - Type safety refactoring (converting `interface{}` to concrete types)
  - Armor: ✅ 100% complete
  - Gear: ✅ ~99% complete (1 intentionally complex field remaining)
  - Qualities: 🟡 ~36% complete (incremental approach)
  - Remaining: ~30 data sets with ~181 `interface{}` fields

### Infrastructure & Development

- **[Live Reload Support](.cursor/plans/live-reload-support.plan.md)** - ⏳ Pending
  - Air integration for Go API server
  - Cross-platform support (Windows, Linux, macOS)
  - Fallback to `go run` when Air not installed

- **[UI Code Quality Improvements](.cursor/plans/ui-code-quality-improvements-65c3c29d.plan.md)** - Status unknown

### Data Processing & Generation

- **[Web Scraping and Markdown Conversion](.cursor/plans/web-scraping-and-markdown-conversion-94075bec.plan.md)** - ✅ Complete

### Backend & Domain Model

- **[SR5 Character Model](.cursor/plans/sr5-character-model.plan.md)** - Status unknown
- **[V5 Struct Improvements](.cursor/plans/v5-struct-improvements-df95544e.plan.md)** - Status unknown
- **[V5 Struct Standardization](.cursor/plans/v5-struct-standardization-8c93ace5.plan.md)** - Status unknown
- **[V5 Structure Improvements](.cursor/plans/v5-structure-improvements.plan.md)** - Status unknown
- **[SR5 Character Struct](.cursor/plans/sr5-character-struct-6e1397a3.plan.md)** - Status unknown

### Other Plans

- **[Campaign Defaults](.cursor/plans/expose-campaign-defaults.plan.md)** - Status unknown
- **[Enum Helper Functions](.cursor/plans/enum-helper-functions-creation.plan.md)** - Status unknown
- **[Migrate Handlers to New Datasets](.cursor/plans/migrate-handlers-to-new-datasets.plan.md)** - Status unknown
- **[Docs Consolidation Opportunities](.cursor/plans/docs-consolidation-opportunities.md)** - Status unknown

### Plan Status Legend

- ✅ **Complete** - All work finished
- ⏳ **In Progress** - Active development
- 🟡 **Partial** - Some work done, more remaining
- ⚠️ **Blocked** - Waiting on dependencies
- ❓ **Status Unknown** - Needs review to determine current status

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

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Third-Party Content Disclaimer

ShadowMaster is a tabletop RPG management tool that supports Shadowrun editions (SR3, SR5). This software includes game rules, equipment statistics, character creation mechanics, and other game-related data derived from Shadowrun source materials.

**Shadowrun** is a trademark of [Catalyst Game Labs](https://www.catalystgamelabs.com/) and/or [Topps Company, Inc.](https://www.topps.com/). This project is not affiliated with, endorsed by, or sponsored by Catalyst Game Labs, Topps, or any Shadowrun license holders.

All Shadowrun game content (rules, mechanics, terminology, equipment stats, etc.) included in this repository is for reference and utility purposes only. The copyright and trademarks for Shadowrun game content belong to their respective owners. This software is a fan-created utility tool intended to assist players in managing their Shadowrun games and characters.

Users should own the appropriate Shadowrun sourcebooks to use this tool legally and are responsible for ensuring their use complies with applicable copyright and trademark laws.

