# Implementation Roadmap & Documentation Requirements

_Last updated: 2025-01-27_

## Priority 1: Foundation & Data Structures

### 1. TypeScript Data Structures (Schemas)

- ✅ User, Character, and Campaign data record types
- ✅ Ruleset and Book data record types
- ✅ CreationMethod module data record types
- ✅ Ruleset bundle JSON specification (structure for book data files)

### 2. System Architecture Documentation

- ✅ Complete system architecture diagram (frontend, backend, rules engine, data layer)
- ✅ Ruleset loading and merging architecture diagram
- ✅ Ruleset loading/merging algorithm specification

## Priority 2: Product Design & Planning

### 3. Product Requirements Document (PRD)

- ✅ Polished full PRD document (multi-section, project-manager style)
- ✅ Expanded PRD incorporating all technical details section-by-section

### 4. Feature Roadmap

- ✅ Complete roadmap with milestones: MVP → Beta → v1 → v2
- See detailed breakdown below

### 5. User Personas

- ✅ Player persona for Shadowrun
- ✅ GM persona for Shadowrun

## Priority 3: Character Creation System

### 6. Character Creation Data & Algorithms

- ✅ JSON schema for CreationMethod module
- ✅ Ruleset loading/merging algorithm for character creation
- ✅ Flowchart of character creation load and validation process

### 7. Character Creation UX/UI

- ✅ Edition selection UX flow
- ✅ Modular character creation wizard UI/UX design
- ✅ React component structure for character creation UI

---

## Feature Roadmap Summary

### MVP Phase — SR5 Priority Character Creation

**Completed:**

- Priority Selection Grid (A-E across 5 categories)
- Metatype Selection with racial traits
- Physical/Mental Attribute allocation
- Magic/Resonance Path Selection
- Active Skills (individual + group points)
- Qualities Selection (Positive/Negative)
- Review Step with basic validation
- Draft Auto-save

**Remaining (High Priority):**

- Special Attribute Points (Edge/Magic/Resonance) allocation UI
- Knowledge & Language Skills with free points
- Contacts System (Connection + Loyalty)
- Gear/Resources Step (catalog, nuyen tracking, lifestyle)
- Leftover Karma Step
- Final Calculations (derived stats)
- Full validation rules enforcement

**Remaining (Medium Priority):**

- Skill Specializations
- Cyberware/Bioware with Essence tracking
- Spell/Complex Form selection for magical characters
- Karma-to-Nuyen conversion
- Tradition selection for Magicians

### Beta Phase — GM Tools + Sourcebook Support

- Sourcebook merging (Run Faster, Street Grimoire)
- Combat tracker
- Full inventory management
- Adept Powers system
- Spell management catalog
- Complex Forms catalog
- Mobile-responsive UI
- PDF character sheet export

### v1 Phase — Multi-Edition + Advanced Features

- SR6 and SR4A support
- Advanced creation methods (Life Modules, Sum-to-Ten, Karma Point-Buy)
- Street-Level / Prime Runner variants
- NPC manager
- Spirits & Sprites system
- Foci system
- Module marketplace
- VTT integration hooks

### v2 Phase — Deep Automation + Content

- Matrix automation
- Rigger subsystems
- Spells automation
- Mentor Spirits
- AI-assisted rule linking
- Offline capabilities
- Expanded edition support (SR1-SR3 + Anarchy)
- Third-party plugin API

---

_See detailed roadmaps:_

- **[v1_roadmap.md](./v1_roadmap.md)** - Comprehensive v1.0 roadmap with phases, timelines, and priorities
- **[implementation_roadmap_documentation.md](./implementation_roadmap_documentation.md)** - Detailed task breakdowns, TypeScript schemas, and architecture diagrams
- **[mvp_gap_analysis.md](./mvp_gap_analysis.md)** - Current MVP gaps and remaining work
