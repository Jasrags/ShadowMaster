# Shadow Master v1.0 Roadmap

_Last updated: 2025-01-27_

## Overview

This document outlines the roadmap to **Shadow Master v1.0**, a production-ready character management system for Shadowrun tabletop RPG. Version 1.0 represents the first stable release with complete SR5 character creation, multi-edition support foundation, and essential GM tools.

**Current Status:** MVP (v0.1.0) - SR5 Priority-based character creation with core features implemented.

**Target Release:** v1.0.0 - Complete SR5 support + SR6 foundation + GM tools

---

## Release Strategy

### Version Progression

- **v0.1.0 (MVP)** - Current: Basic SR5 Priority character creation
- **v0.2.0 (Beta)** - SR5 completion + GM tools + sourcebook support
- **v1.0.0** - Production-ready: Multi-edition foundation + complete SR5 + essential features

### Success Criteria for v1.0

1. ✅ Complete SR5 Priority character creation (all archetypes)
2. ✅ SR6 edition support (data structures + basic creation)
3. ✅ GM campaign management tools
4. ✅ Sourcebook system fully operational
5. ✅ Character sheet with all derived stats
6. ✅ Mobile-responsive UI
7. ✅ Production-ready deployment (Docker + CI/CD)
8. ✅ Comprehensive documentation

---

## Phase Breakdown

## Phase 1: MVP Completion (v0.1.x → v0.2.0)

**Goal:** Complete all remaining SR5 Priority character creation gaps

**Status:** In Progress

### 1.1 Critical Character Creation Gaps

#### Special Attribute Allocation

- [ ] **SpecialAttributeAllocator Component**
  - Edge allocation (starts at 1, 2 for Humans)
  - Magic allocation (from Magic priority)
  - Resonance allocation (from Resonance priority)
  - Validation: all points must be spent
  - Edge cap enforcement (7 for humans, 6 for others)
  - Exceptional Attribute quality support
- **Effort:** Medium (2-3 days)
- **Priority:** Critical

#### Knowledge & Language Skills

- [ ] **KnowledgeSkillsStep Component**
  - Academic knowledge (Logic-linked)
  - Interest knowledge (Intuition-linked)
  - Professional knowledge (Logic-linked)
  - Street knowledge (Intuition-linked)
  - Free points: (Intuition + Logic) × 2
- [ ] **LanguageSkillsStep Component**
  - Native language at rating 6 (free)
  - Bilingual quality support
  - Max rating 6 enforcement
- [ ] **Skill Specializations**
  - Cost: 1 skill point per specialization
  - Grant +2 dice bonus
  - Cannot apply to skill groups
- **Effort:** Medium (3-4 days)
- **Priority:** Critical

#### Contacts System

- [ ] **ContactsStep Component**
  - Free Karma: Charisma × 3
  - Connection rating (1-6)
  - Loyalty rating (1-6)
  - Max 7 Karma per contact
  - Contact management UI
- **Effort:** Medium (2-3 days)
- **Priority:** Critical

#### Gear & Resources

- [ ] **Gear Catalog System**
  - Searchable/filterable gear database
  - Categories: Weapons, Armor, Electronics, Vehicles, etc.
  - Shopping cart functionality
  - Availability validation (≤12 at creation)
  - Device Rating validation (≤6)
- [ ] **Nuyen Budget Tracking**
  - Priority-based starting nuyen
  - Karma-to-Nuyen conversion (max 10 Karma = 20,000¥)
  - 5,000¥ carryover limit enforcement
  - Starting nuyen roll (based on lifestyle)
- [ ] **Lifestyle Selection**
  - Street (Free), Squatter (500¥), Low (2,000¥), Middle (5,000¥), High (10,000¥), Luxury (100,000¥)
  - Metatype lifestyle modifiers (Troll +10%, Dwarf +20%)
- [ ] **Cyberware/Bioware System**
  - Essence cost tracking
  - Essence loss reduces Magic/Resonance
  - Grade selection (Standard/Alpha at creation)
  - Augmentation bonus ≤+4 per attribute
- **Effort:** Large (5-7 days)
- **Priority:** Critical

#### Leftover Karma Step

- [ ] **KarmaSpendingStep Component**
  - Karma management UI
  - Attribute purchases: new rating × 5
  - Active Skills: new rating × 2
  - Knowledge/Language Skills: new rating × 1
  - Skill Groups: new rating × 5
  - Spells: 5 Karma each
  - Complex Forms: 4 Karma each
  - Bound Spirits: 1 Karma per service
  - Registered Sprites: 1 Karma per task
  - Foci bonding: variable cost
  - 7 Karma carryover maximum enforcement
- **Effort:** Medium (3-4 days)
- **Priority:** High

#### Magic & Resonance Features

- [ ] **Spell Selection**
  - Spell catalog for Magicians/Mystic Adepts
  - Max spells = MAG × 2
  - Tradition selection for Magicians
  - Spell categories and descriptions
- [ ] **Complex Forms Selection**
  - Complex form catalog for Technomancers
  - Max complex forms = LOG
  - Form descriptions and effects
- [ ] **Adept Powers**
  - Power Point allocation
  - Adept power catalog
  - Power descriptions and costs
- [ ] **Bound Spirits & Registered Sprites**
  - Spirit binding at creation (1 Karma per service)
  - Sprite registration at creation (1 Karma per task)
  - Max bound spirits = CHA
  - Max registered sprites = CHA
- **Effort:** Medium (4-5 days)
- **Priority:** High

#### Final Calculations & Validation

- [ ] **Derived Stats Calculation**
  - Initiative: Intuition + Reaction
  - Physical Limit: ceil((STR×2 + BOD + REA) / 3)
  - Mental Limit: ceil((LOG×2 + INT + WIL) / 3)
  - Social Limit: ceil((CHA×2 + WIL + ceil(ESS)) / 3)
  - Physical CM: ceil(BOD / 2) + 8
  - Stun CM: ceil(WIL / 2) + 8
  - Overflow: Body + augmentation bonuses
  - Astral Initiative: INT × 2 + 2d6
  - Matrix Initiative (Cold): Data Processing + INT + 3d6
  - Matrix Initiative (Hot): Data Processing + INT + 4d6
  - Living Persona stats (Technomancers)
- [ ] **Comprehensive Validation Engine**
  - One attribute at natural max enforcement
  - All attribute points spent enforcement
  - All skill points spent enforcement
  - Max 7 Karma carryover enforcement
  - Max 5,000¥ carryover enforcement
  - Gear Availability ≤12 enforcement
  - Device Rating ≤6 enforcement
  - Augmentation bonus ≤+4/attr enforcement
  - Max bound spirits = CHA enforcement
  - Max registered sprites = CHA enforcement
  - Max complex forms = LOG enforcement
  - Max spells = MAG × 2 enforcement
  - Max foci Force = MAG × 2 enforcement
- **Effort:** Medium (3-4 days)
- **Priority:** Critical

### 1.2 Character Sheet Enhancements

- [ ] **Complete Character Sheet Display**
  - All attributes and derived stats
  - Skills with specializations
  - Knowledge and language skills
  - Qualities (positive and negative)
  - Contacts with Connection/Loyalty
  - Gear inventory with stats
  - Cyberware/Bioware with Essence costs
  - Spells/Complex Forms/Adept Powers
  - Lifestyle and SIN information
  - Print-friendly layout
- **Effort:** Medium (3-4 days)
- **Priority:** High

---

## Phase 2: Beta Features (v0.2.0)

**Goal:** GM tools, sourcebook support, and production polish

**Status:** Planned

### 2.1 Sourcebook System

- [ ] **Sourcebook Loading & Merging**
  - Run Faster support (Life Modules, new metatypes)
  - Street Grimoire support (new spells, traditions)
  - Chrome Flesh support (extended cyberware)
  - Data & Destiny support (extended technomancer options)
  - Book enable/disable UI for GMs
  - Merge strategy validation
- **Effort:** Large (5-7 days)
- **Priority:** High

### 2.2 GM Campaign Management

- [ ] **Campaign Creation & Management**
  - Campaign creation UI
  - Edition selection per campaign
  - Enabled sourcebooks per campaign
  - Allowed creation methods per campaign
  - Optional rules flags (Street-Level, Prime Runner, etc.)
- [ ] **Player Management**
  - Invite players to campaign
  - View all campaign characters
  - Character approval workflow
  - Character status management
- [ ] **Campaign Settings**
  - House rules configuration
  - Availability limits
  - Karma/Nuyen adjustments
- **Effort:** Large (6-8 days)
- **Priority:** High

### 2.3 Advanced Character Creation Methods

- [ ] **Life Modules (Run Faster)**
  - Life module selection system
  - Module-based attribute/skill bonuses
  - Karma adjustments
- [ ] **Sum-to-Ten Variant**
  - Modified priority system
  - Point allocation rules
- [ ] **Karma Point-Buy**
  - Full karma-based creation
  - Budget calculations
- [ ] **Street-Level Variant**
  - Reduced starting resources
  - Gear availability caps
- [ ] **Prime Runner Variant**
  - Enhanced starting resources
  - Expanded options
- **Effort:** Very Large (10-14 days)
- **Priority:** Medium

### 2.4 Character Management Features

- [ ] **Character Editing**
  - Post-creation editing UI
  - Karma spending interface
  - Nuyen tracking
  - Advancement history
- [ ] **Character Export**
  - PDF character sheet export
  - JSON export for backup
  - Print-optimized layout
- [ ] **Character Import**
  - JSON import for migration
  - Validation on import
- **Effort:** Medium (4-5 days)
- **Priority:** Medium

### 2.5 UI/UX Improvements

- [ ] **Mobile Responsiveness**
  - Responsive character creation wizard
  - Mobile-friendly character sheet
  - Touch-optimized interactions
- [ ] **Accessibility**
  - ARIA labels and roles
  - Keyboard navigation
  - Screen reader support
  - Color contrast compliance
- [ ] **Performance Optimization**
  - Code splitting
  - Lazy loading
  - Image optimization
  - Caching strategies
- **Effort:** Medium (5-6 days)
- **Priority:** High

---

## Phase 3: v1.0 Foundation (v0.3.0 → v1.0.0)

**Goal:** Multi-edition support foundation and production readiness

**Status:** Planned

### 3.1 SR6 Edition Support

- [ ] **SR6 Data Structures**
  - SR6 edition metadata
  - SR6 core rulebook JSON
  - SR6 character type compatibility
  - SR6 attribute system (Body, Agility, Reaction, Strength, Willpower, Logic, Intuition, Charisma)
  - SR6 Edge system (Edge points vs. Edge attribute)
- [ ] **SR6 Character Creation**
  - SR6 Priority system
  - SR6 attribute allocation
  - SR6 skill system
  - SR6 qualities
  - SR6 gear system
- [ ] **SR6 Character Sheet**
  - SR6-specific derived stats
  - SR6 Edge tracking
  - SR6 action economy display
- **Effort:** Very Large (12-16 days)
- **Priority:** High (v1.0 requirement)

### 3.2 Multi-Edition Architecture

- [ ] **Edition-Aware Type System**
  - Edition-specific type guards
  - Edition conversion utilities
  - Cross-edition compatibility layer
- [ ] **Edition Selection UI**
  - Edition picker in character creation
  - Edition filtering in character list
  - Edition badges/indicators
- [ ] **Ruleset Versioning**
  - Ruleset snapshot system
  - Version compatibility checks
  - Migration utilities
- **Effort:** Large (6-8 days)
- **Priority:** High

### 3.3 NPC Management

- [ ] **NPC Creation Tools**
  - Quick NPC generator
  - NPC templates
  - NPC stat blocks
- [ ] **NPC Library**
  - Common NPC types
  - NPC sharing between GMs
  - NPC import/export
- **Effort:** Medium (4-5 days)
- **Priority:** Medium

### 3.4 Spirits & Sprites System

- [ ] **Spirit Management**
  - Spirit catalog
  - Spirit binding tracking
  - Spirit services management
  - Spirit stats and abilities
- [ ] **Sprite Management**
  - Sprite catalog
  - Sprite registration tracking
  - Sprite tasks management
  - Sprite stats and abilities
- **Effort:** Medium (4-5 days)
- **Priority:** Medium

### 3.5 Foci System

- [ ] **Foci Catalog**
  - Foci types and descriptions
  - Foci Force ratings
  - Foci costs
- [ ] **Foci Bonding**
  - Foci bonding at creation
  - Foci bonding post-creation
  - Karma cost calculations
  - Max foci Force = MAG × 2 enforcement
- **Effort:** Small (2-3 days)
- **Priority:** Low

### 3.6 Production Readiness

- [ ] **Error Handling & Logging**
  - Comprehensive error boundaries
  - Error logging system
  - User-friendly error messages
  - Error recovery mechanisms
- [ ] **Testing Infrastructure**
  - Unit test coverage (>80%)
  - Integration tests for critical flows
  - E2E tests for character creation
  - Test data fixtures
- [ ] **Documentation**
  - User guide
  - GM guide
  - API documentation
  - Developer documentation
  - Video tutorials
- [ ] **Security Hardening**
  - Input validation
  - XSS prevention
  - CSRF protection
  - Rate limiting
  - Security audit
- [ ] **Performance Monitoring**
  - Performance metrics
  - Error tracking
  - User analytics (privacy-respecting)
- **Effort:** Large (8-10 days)
- **Priority:** Critical (v1.0 requirement)

### 3.7 Deployment & Infrastructure

- [ ] **Production Deployment**
  - Production Docker configuration
  - Environment variable management
  - Database migration system (if migrating from file storage)
  - Backup and recovery procedures
- [ ] **CI/CD Pipeline**
  - Automated testing in CI
  - Automated deployment workflows
  - Version tagging
  - Release notes automation
- [ ] **Monitoring & Alerting**
  - Health check endpoints
  - Uptime monitoring
  - Error alerting
- **Effort:** Medium (4-5 days)
- **Priority:** High

---

## Feature Prioritization Matrix

### Must-Have for v1.0 (P0)

- Complete SR5 Priority character creation
- SR6 edition support (basic)
- GM campaign management
- Sourcebook system
- Character sheet with all stats
- Mobile-responsive UI
- Production deployment ready
- Comprehensive validation

### Should-Have for v1.0 (P1)

- Advanced creation methods (Life Modules, Sum-to-Ten)
- Character editing post-creation
- PDF export
- NPC management
- Spirits & Sprites system
- Foci system

### Nice-to-Have for v1.0 (P2)

- Street-Level/Prime Runner variants
- Character import
- Advanced GM tools
- Performance optimizations beyond basics

---

## Timeline Estimate

### Phase 1: MVP Completion

**Duration:** 4-6 weeks

- Critical gaps: 2-3 weeks
- High priority features: 2-3 weeks

### Phase 2: Beta Features

**Duration:** 6-8 weeks

- Sourcebook system: 2 weeks
- GM tools: 2-3 weeks
- Advanced creation methods: 2-3 weeks
- UI/UX improvements: 1-2 weeks

### Phase 3: v1.0 Foundation

**Duration:** 8-10 weeks

- SR6 support: 3-4 weeks
- Multi-edition architecture: 2 weeks
- Production readiness: 2-3 weeks
- Additional features: 1-2 weeks

### Total Estimated Timeline

**v0.1.0 → v1.0.0:** 18-24 weeks (4.5-6 months)

_Note: Timeline assumes single developer. Parallel workstreams could reduce duration._

---

## Risk Assessment

### High Risk Items

1. **SR6 Edition Support** - Significant effort, may require architecture changes
2. **Sourcebook Merging** - Complex merge logic, potential edge cases
3. **Production Deployment** - Database migration if moving from file storage
4. **Performance at Scale** - File-based storage may not scale

### Mitigation Strategies

1. **SR6 Support:** Start early, validate architecture early, iterate
2. **Sourcebook Merging:** Comprehensive test suite, incremental rollout
3. **Deployment:** Plan migration early, test thoroughly, have rollback plan
4. **Performance:** Monitor early, plan database migration path

---

## Success Metrics

### User Metrics

- Character creation completion rate >90%
- Average character creation time <30 minutes
- User satisfaction score >4/5
- Mobile usage >30% of total usage

### Technical Metrics

- Test coverage >80%
- Page load time <2 seconds
- API response time <500ms (p95)
- Uptime >99.5%

### Feature Metrics

- All SR5 archetypes creatable
- SR6 basic creation functional
- Sourcebook system operational
- GM tools adoption >50% of campaigns

---

## Post-v1.0 Considerations

### v1.1 Potential Features

- SR4A edition support
- Advanced combat tracker
- Matrix automation
- Rigger subsystems
- Spell automation
- Mentor Spirits
- VTT integration hooks

### v2.0 Vision

- Full multi-edition support (SR1-SR6 + Anarchy)
- Advanced automation
- AI-assisted rule linking
- Offline capabilities
- Third-party plugin API
- Module marketplace

---

## Notes

- This roadmap is a living document and will be updated as priorities shift
- Effort estimates are rough and may vary based on complexity discovered during implementation
- Features may be reprioritized based on user feedback
- Some features may be deferred to v1.1 if timeline pressure increases

---

_For detailed implementation plans, see:_

- `mvp_gap_analysis.md` - Detailed MVP gaps
- `beta_implementation_plan_v2.md` - Beta phase details
- `implementation_roadmap.md` - Overall roadmap context
