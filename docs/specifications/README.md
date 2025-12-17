# Specifications Index

**Last Updated:** 2025-01-27

This directory contains detailed specifications for all major features and systems in Shadow Master. This document tracks the status and progress of each specification.

---

## Overview

Specifications in this directory define requirements, user stories, technical designs, and implementation details for Shadow Master features. Each specification follows a consistent format with status tracking, last updated dates, and comprehensive coverage of the feature area.

**Status Legend:**
- **Specification** - Documented but not yet implemented
- **Implemented (MVP)** - Basic implementation complete, may have enhancements planned
- **Fully Implemented** - Complete implementation with all core features

---

## Specification Status Table

| Specification | Status | Category | Last Updated | Notes |
|---------------|--------|----------|--------------|-------|
| [Authentication](authentication_specification.md) | Specification | Security, Authentication | 2025-01-27 | Basic auth implemented; enhancements planned |
| [Campaign Support](campaign_support_specification.md) | Specification | UI/UX, Campaign Management | 2025-01-27 | Not implemented |
| [Character Creation & Management](character_creation_and_management_specification.md) | Specification | Core Functionality | 2025-01-27 | Basic implementation complete, ongoing enhancements |
| [Character Sheet](character_sheet_specification.md) | Specification | User Interface | 2025-01-27 | Fully implemented for viewing; editing limited to drafts |
| [Dice Roller](dice_roller_specification.md) | Specification | Gameplay, Core Mechanics | 2025-01-27 | Fully implemented |
| [Gameplay Actions](gameplay_actions_specification.md) | Specification | Gameplay, Core Mechanics | 2025-01-27 | Basic character lifecycle actions implemented |
| [Locations](locations_specification.md) | Specification | Campaign Management | 2025-01-27 | Not implemented |
| [NPCs & Grunts](npcs_grunts_specification.md) | Specification | Campaign Management | 2025-01-27 | Not implemented |
| [Ruleset Architecture](ruleset_architecture_and_source_material_system.md) | N/A | Architecture | N/A | Architecture documentation (different format) |
| [Rulesets Page](rulesets_page_specification.md) | Implemented (MVP) | User Interface | 2025-01-27 | Basic implementation complete |
| [Settings Page](settings_page_specification.md) | Implemented (MVP) | User Interface | 2025-01-27 | Basic implementation complete |
| [User Management](user_management_specification.md) | Implemented (MVP) | Administration | 2025-01-27 | Basic implementation complete |

---

## Implementation Status Summary

### ✅ Fully Implemented (MVP+)
- **Dice Roller** - Complete dice pool system with glitch detection, Edge rerolls, and visual feedback
- **Character Sheet** - Full viewing capabilities; editing limited to draft characters
- **Character Creation & Management** - Basic wizard complete with ongoing enhancements

### ✅ Implemented (MVP)
- **Authentication** - Basic email/password auth with sessions
- **User Management** - Admin user management interface
- **Settings Page** - User settings and preferences
- **Rulesets Page** - Ruleset browsing and selection

### 📋 Specification Only (Not Implemented)
- **Campaign Support** - GM campaign creation and management
- **Locations** - Location management for campaigns
- **NPCs & Grunts** - NPC creation and management
- **Gameplay Actions** - Combat, magic, and matrix action resolution

### 📚 Architecture Documentation
- **Ruleset Architecture** - System architecture documentation (different format, no status tracking)

---

## Quick Reference by Category

### Core Functionality
- [Character Creation & Management](character_creation_and_management_specification.md) - ✅ Basic implementation
- [Character Sheet](character_sheet_specification.md) - ✅ Fully implemented (viewing)

### Gameplay Systems
- [Dice Roller](dice_roller_specification.md) - ✅ Fully implemented
- [Gameplay Actions](gameplay_actions_specification.md) - 📋 Specification only

### Campaign Management
- [Campaign Support](campaign_support_specification.md) - 📋 Specification only
- [Locations](locations_specification.md) - 📋 Specification only
- [NPCs & Grunts](npcs_grunts_specification.md) - 📋 Specification only

### User Interface
- [Character Sheet](character_sheet_specification.md) - ✅ Fully implemented
- [Settings Page](settings_page_specification.md) - ✅ Implemented (MVP)
- [Rulesets Page](rulesets_page_specification.md) - ✅ Implemented (MVP)

### Security & Administration
- [Authentication](authentication_specification.md) - ✅ Basic implementation
- [User Management](user_management_specification.md) - ✅ Implemented (MVP)

### Architecture
- [Ruleset Architecture](ruleset_architecture_and_source_material_system.md) - 📚 Architecture documentation

---

## How to Update This Document

When updating specification status:

1. **Update the specification file** - Modify the `**Status:**` field in the specification header
2. **Update this README** - Update the status table and summary sections
3. **Add notes** - Include implementation details or known limitations in the Notes column

### Status Update Guidelines

- **Specification** → **Implemented (MVP)**: When basic/core features are working
- **Implemented (MVP)** → **Fully Implemented**: When all core features and most enhancements are complete
- Add notes for partial implementations or known gaps

---

## Related Documentation

- [Architecture Overview](../../docs/architecture/architecture-overview.md) - System architecture and design principles
- [Implementation Roadmap](../../docs/architecture/beta_implementation_plan_v2.md) - Detailed implementation phases
- [Gameplay Features Plan](../../docs/architecture/gameplay_features_implementation_plan.md) - Gameplay feature roadmap

---

## Notes

- Specifications are living documents and may be updated as implementation progresses
- Status reflects current implementation state as of the "Last Updated" date
- Some specifications may have detailed "Current Status" sections with additional implementation notes
- Architecture documents (like Ruleset Architecture) follow a different format and don't use status tracking

