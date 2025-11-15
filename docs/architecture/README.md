# Architecture Documentation

Technical and application architecture documentation for ShadowMaster.

## Contents

- **[Technical Architecture Guide](./technical-guide.md)** - System architecture, stack, API, and deployment
- **[Application Architecture Plan](./application-plan.md)** - Domain models, relationships, and implementation roadmap

## Overview

ShadowMaster is built with:
- **Backend:** Go 1.24, Chi router, JSON file storage
- **Frontend:** React (TypeScript), Vite build
- **Authentication:** HMAC-signed session cookies with RBAC

See the [Technical Architecture Guide](./technical-guide.md) for detailed information.
