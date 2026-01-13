# Shadow Master

**Shadow Master** is a comprehensive character management system for the Shadowrun tabletop RPG, designed to support all editions (1E-6E plus Anarchy). The application provides multi-edition character creation with edition-specific rules, a flexible ruleset system supporting sourcebooks and errata, and a robust character lifecycle management.

Currently, the project is in its **MVP phase**, focusing on **Shadowrun 5th Edition** Priority-based character creation.

---

## 🚀 Core Features

### Implemented Systems

- **Modular Ruleset System**: Data-driven ruleset loading and merging algorithm supporting multiple books and editions.
- **Character Creation Framework**: Sheet-based single-page creation (SR5 Priority) with auto-save drafts.
- **Dynamic Character Sheet**: Responsive UI with theme-aware sections, automated derived stats, and dice-roller integration.
- **Character Advancement**: Full karma-based progression with GM approval workflows.
- **Campaign Management**: Integrated campaign support including calendar management, locations, and member tracking.
- **Secure Authentication**: Session-based auth with role-based access control (User, GM, Admin).

### Planned Features

- **NPC / Grunt System**: Rapid NPC generation and team management.
- **Combat Tracker**: Real-time initiative and turn tracking for encounters.
- **Inventory & Gear Management**: Detailed tracking of items, ammo, and modifications.
- **System Synchronization**: Protocol for managing data drift between characters and updated rulebooks.

---

## 🏗️ High-Level Architecture

Shadow Master follows a modern, performance-oriented stack designed for atomic data integrity:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) with [React 19](https://react.dev/) and [Tailwind CSS 4](https://tailwindcss.com/).
- **UI Components**: [React Aria Components](https://react-spectrum.adobe.com/react-aria/index.html) for first-class accessibility and headless logic.
- **Persistence**: Atomic file-based storage using JSON for all user, character, and ruleset data.
- **Rules Engine**: A custom merging algorithm that processes edition metadata and sourcebook payloads into a unified runtime context.

---

## 📊 Project Status

For a detailed breakdown of subsystem statuses, current blockers, and development priorities, please refer to:
👉 **[PROJECT_STATE.md](PROJECT_STATE.md)**

---

## 🛠️ Getting Started

### Local Development

First, install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker Deployment

```bash
# Build the Docker image
docker build -t shadow-master .

# Run the container
docker run -p 3000:3000 shadow-master

# Or use Docker Compose
docker-compose up
```

For more details, see our **[Portainer Setup Guide](docs/deployment/portainer-setup.md)** or the **[CI/CD Pipeline documentation](docs/deployment/cicd-guide.md)**.

---

## 📂 Project Structure

- `/app` - Application routes, pages, and API handlers.
- `/components` - Shared React UI components and layouts.
- `/lib` - Core business logic, storage layers, and ruleset engines.
- `/data` - Static and persistent JSON storage for rulesets and user entities.
- `/docs` - Comprehensive technical specifications and architectural guides.

---

## ⚖️ License

See [LICENSE](LICENSE) for license information.
