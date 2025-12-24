# Milestone Snapshot: MVP Polish

**Date:** 2025-12-23

## 🎯 Project Scope (Current)

As of December 2025, Shadow Master is a specialized character management suite for Shadowrun, with a primary focus on the **5th Edition (SR5)** ruleset. The architecture is designed to eventually support all 1E-6E editions, but the current functional scope is centered on the Priority-based character creation wizard and campaign-integrated character sheets for SR5.

## ✅ Implemented Systems

### Foundation

- **Multi-Edition Ruleset Engine**: A sandboxed ruleset system that merges core rulebooks and sourcebooks into a unified context.
- **Atomic Storage Layer**: File-based JSON persistence for users, characters, campaigns, and rulesets.
- **Secure Authentication**: Session-based auth with User, GM, and Administrator role definitions.

### Character Management

- **SR5 Priority Creation Wizard**: A comprehensive, step-driven interface for building characters, including metatypes, attributes, skills, magic/resonance, and gear.
- **Dynamic Character Sheet**: A theme-aware dashboard that automatically calculates derived stats, wound modifiers, and integrates with a digital dice roller.
- **Qualities & Dynamic State**: Full implementation of positive/negative qualities with lifecycle management for Addiction, Allergy, and Dependents.
- **Character Advancement**: Karma-based progression logic with essential GM approval workflows for campaign-linked characters.

### Gameplay & Campaigns

- **Campaign Support**: Basic infrastructure for GMing, including member rosters, calendar management, and location tracking.
- **Dice Roller**: A standalone and integrated utility for standard Shadowrun tests (hits, glitches).

## ⚠️ Known Limitations

- **Edition Support**: 1E-4E and 6E rulesets are architecturally supported but currently lack functional data payloads and specific creation logic.
- **Editing Restrictions**: Character sheet editing is primarily confined to "Draft" characters; finalized characters must use the advancement system for changes.
- **Modifications**: Weapon and gear modification (mount points, custom essence costs) is partially implemented in UI but lacks a full mechanical simulation engine.

## 💤 Deferred Work

- **Combat Tracker**: Real-time initiative and turn tracking is specified but not yet implemented.
- **NPC / Grunt System**: Rapid NPC generation logic is in design only status.
- **Inventory & Ammo Tracking**: Post-creation management of consumables and fine-grained inventory state is planned for a future gameplay phase.
- **System Synchronization**: Protocol for updating legacy characters against newer rulebook versions is in draft status.

---

_This document serves as a historical record of the system's state and should not be modified to reflect future changes._
