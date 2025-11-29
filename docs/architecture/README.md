# Architecture Documentation

Technical and application architecture documentation for ShadowMaster.

## Contents

- **[Technical Architecture Guide](./technical-guide.md)** - System architecture, stack, API, and deployment
- **[Application Architecture Plan](./application-plan.md)** - Domain models, relationships, and implementation roadmap

## Overview

ShadowMaster is built with:
- **Backend:** Go 1.24.3+, Chi router, JSON file storage
- **Frontend:** React 18 (TypeScript), Vite build, Tailwind CSS, React Aria Components
- **Authentication:** HMAC-signed session cookies with RBAC
- **Development:** AI-assisted development with Cursor

See the [Technical Architecture Guide](./technical-guide.md) for detailed information.
