# Character Advancement Specification

**Last Updated:** 2025-01-27  
**Status:** Draft - Awaiting Requirements  
**Category:** Core Functionality, Character Management, Post-Creation Features  
**Affected Editions:** All editions (edition-aware implementation)

---

## Overview

Character advancement allows players to improve their characters after creation by spending earned karma on attributes, skills, qualities, spells, and other improvements. Unlike character creation, advancement requires training time (downtime) for most improvements and follows different cost structures (often 2× for qualities).

**Key Features:**
- Post-creation karma spending on attributes, skills, spells, etc.
- Training time tracking and downtime management
- Advancement history and ledger
- Validation against character state and rules
- Integration with campaign downtime periods

---

## What We Know (Current State)

### 1. Karma Tracking (Implemented)

**Current Implementation:**
- Character has `karmaTotal`, `karmaCurrent`, `karmaSpentAtCreation` fields
- Basic storage functions: `spendKarma()`, `awardKarma()`
- API endpoint: `POST /api/characters/[id]/gameplay` with `spendKarma`/`awardKarma` actions
- Basic validation (sufficient karma available)

**Status:** ✅ Basic karma tracking works

### 2. Quality Advancement (Phase 7 - Completed)

**Current Implementation:**
- Post-creation quality acquisition (2× karma cost)
- Negative quality buy-off (2× original karma bonus)
- Validation functions: `validateQualityAcquisition()`, `validateQualityRemoval()`
- API endpoints: `POST /api/characters/[id]/qualities`, `DELETE /api/characters/[id]/qualities/[qualityId]`
- UI component: `/characters/[id]/advancement/qualities`

**Status:** ✅ Quality advancement fully implemented

### 3. Advancement Rules (Documented)

**Karma Costs (from `docs/rules/reference.md`):**
- **Attributes (Physical, Mental, Magic, Resonance):** `new rating × 5`
- **Active skills:** `new rating × 2`
- **Knowledge/Language skills:** `new rating × 1`
- **Skill groups:** `new rating × 5`
- **Specializations:** 7 karma
- **New knowledge/language skill:** 1 karma
- **New complex form:** 4 karma
- **New spell / ritual / preparation:** 5 karma
- **Initiation:** `10 + (grade × 3)` karma
- **Positive quality (post-play):** listed cost × 2
- **Removing negative quality:** bonus karma × 2 (with GM approval)
- **Focus bonding:** varies by type (Force × 2-6)
- **Edge:** same as attributes (`new rating × 5`) but no downtime required

**Training Times:**
- **Attributes:** `new rating × 1 week`
- **Active skills:**
  - Ratings 1–4: `new rating × 1 day`
  - Ratings 5–8: `new rating × 1 week`
  - Ratings 9–13: `new rating × 2 weeks`
- **Skill groups:** `new rating × 2 weeks`
- **Specializations:** 1 month
- **Edge:** no downtime required

**Training Rules:**
- Training is required before karma is spent (except Edge)
- Attribute training time cannot be reduced
- Instructor can reduce skill training time by 25% (round down)
- A downtime period may cover:
  - One physical + one mental attribute, OR
  - One attribute + one skill
- Skill groups consume the whole downtime
- Rating increases capped per downtime:
  - Attributes: +2 max
  - Skills: +3 max
  - Skill groups: +1 max
- Augmentation recovery blocks attribute training for the same rating in that downtime
- If character focuses only on skills during downtime, may learn/improve up to `Logic ÷ 2` (round up) skills
- Specializations take 1 month and cannot be learned with anything else
- Training can be interrupted but must resume quickly or benefits are lost

**Status:** ✅ Rules documented, not yet implemented

---

## Major Gaps (What's Missing)

### 1. Advancement UI/System

**Gap:** No centralized advancement interface or workflow

**Missing:**
- [ ] Unified advancement page/section
- [ ] Attribute advancement interface
- [ ] Skill advancement interface
- [ ] Spell/ritual/complex form learning interface
- [ ] Specialization learning interface
- [ ] Focus bonding interface
- [ ] Initiation/Submersion interface
- [ ] Edge advancement interface

**Question:** Should advancement be:
- [X] A single unified page with tabs/sections for each advancement type?
- [ ] Separate pages for each advancement type?
- [ ] A wizard-style flow (like character creation)?
- [ ] Something else? (Please specify: _______________)

### 2. Training Time Tracking

**Gap:** No system to track training periods, downtime, or training progress

**Missing:**
- [ ] Training queue/active training tracking
- [ ] Downtime period management
- [ ] Training progress tracking
- [ ] Training interruption handling
- [ ] Instructor bonus application (25% time reduction)
- [ ] Dependents quality time modifier application (+50% training time)

**Question:** How should training time be managed?
- [ ] Manual entry by player (player enters downtime dates)
- [X] Campaign-driven (tied to campaign downtime periods)
- [X] Automatic calculation (system calculates when training completes)
- [ ] Hybrid approach (Please specify: _______________)

**Question:** Should training be:
- [ ] Required (cannot spend karma until training completes)?
- [ ] Optional (can spend karma immediately, training tracked separately)?
- [X] Configurable per campaign/GM preference?

**Question:** How should we handle training interruptions?
- [ ] Training resets if interrupted
- [X] Training pauses and resumes
- [ ] Partial progress is lost after X days
- [ ] Other? (Please specify: _______________)

### 3. Advancement Constraints & Validation

**Gap:** No validation of per-downtime limits, augmentation recovery, or other constraints

**Missing:**
- [ ] Per-downtime limit validation (attributes +2, skills +3, skill groups +1)
- [ ] Augmentation recovery blocking validation
- [ ] Training prerequisite validation (must complete training before spending karma)
- [ ] Maximum rating validation (attributes, skills)
- [ ] Skill group integrity validation
- [ ] Specialization prerequisite validation (must have skill at rating 4+)

**Question:** Should validation be:
- [ ] Strict (block invalid actions)?
- [ ] Warning-based (allow but warn)?
- [X] Configurable per campaign?

### 4. Advancement History & Ledger

**Gap:** No tracking of what was advanced, when, or how much karma was spent

**Missing:**
- [ ] Advancement history/ledger
- [ ] Karma transaction log with timestamps
- [ ] Training completion records
- [ ] Advancement source tracking (which downtime/campaign session)

**Question:** What level of detail should the advancement ledger track?
- [ ] Basic: What was advanced, karma cost, date
- [ ] Detailed: Include training time, downtime period, GM approval status
- [ ] Comprehensive: Full audit trail with before/after values, validation results
- [ ] Other? (Please specify: _______________)

### 5. Data Structures

**Gap:** Missing data models for advancement tracking

**Missing Types/Interfaces:**
- [ ] `AdvancementRecord` - Single advancement entry
- [ ] `TrainingPeriod` - Active training tracking
- [ ] `DowntimePeriod` - Downtime management
- [ ] `AdvancementQueue` - Planned advancements
- [ ] `KarmaTransaction` - Karma spending history

**Question:** Should we add these to the Character type or create separate storage?
- [X] Add to Character type (e.g., `character.advancementHistory[]`)
- [ ] Separate storage (e.g., `/data/advancements/{characterId}/`)
- [ ] Hybrid (recent in Character, full history in separate storage)

### 6. Campaign Integration

**Gap:** No connection between advancement and campaign downtime/events

**Missing:**
- [ ] Campaign downtime period tracking
- [ ] GM approval workflow for advancement
- [ ] Advancement tied to specific campaign sessions
- [ ] Campaign-level advancement rules/restrictions

**Question:** How should advancement integrate with campaigns?
- [ ] Advancement is independent (player manages their own downtime)
- [X] Advancement tied to campaign downtime periods (GM creates downtime, players advance during it)
- [X] GM must approve all advancements
- [ ] Hybrid (Please specify: _______________)

**Question:** Should campaigns be able to set advancement rules?
- [ ] Yes, campaigns can override default rules (e.g., different karma costs, training times)
- [ ] No, advancement always follows core rules
- [X] Campaigns can enable/disable certain advancement types

### 7. Edge Cases & Special Rules

**Gap:** No handling of special cases

**Missing:**
- [ ] Edge advancement (no downtime, but karma cost)
- [ ] Focus bonding workflow
- [ ] Initiation/Submersion workflow
- [ ] Technomancer Echoes (post-submersion)
- [ ] Augmentation recovery blocking
- [ ] Character death during training
- [ ] Quality effects on training (Dependents, etc.)

**Question:** Which special cases are highest priority?
- [X] Edge advancement (simple, no downtime)
- [ ] Focus bonding
- [ ] Initiation/Submersion
- [ ] Technomancer Echoes
- [ ] Other? (Please specify: _______________)

---

## User Experience Questions

### Workflow

**Question:** What should the advancement workflow look like?
- [X] Step 1: Select what to advance → Step 2: Pay karma → Step 3: Start training → Step 4: Complete training
- [ ] Step 1: Start training → Step 2: Complete training → Step 3: Pay karma (karma locked during training)
- [ ] Single action: Pay karma and training starts automatically
- [ ] Other? (Please specify: _______________)

**Question:** Should players be able to queue multiple advancements?
- [ ] Yes, queue multiple items for a single downtime period
- [ ] Yes, queue across multiple downtime periods
- [X] No, one advancement at a time
- [ ] Other? (Please specify: _______________)

### UI/UX

**Question:** How should the advancement interface be organized?
- [X] Single page with sections/tabs for each advancement type
- [ ] Separate pages for each advancement type (like current `/advancement/qualities`)
- [ ] Wizard-style flow (like character creation)
- [ ] Dashboard view showing all advancement options with quick actions
- [ ] Other? (Please specify: _______________)

**Question:** Should there be a training dashboard/queue view?
- [X] Yes, show all active training with progress bars
- [ ] Yes, show training queue for upcoming downtime
- [ ] No, training is just a background process
- [ ] Other? (Please specify: _______________)

**Question:** How should karma costs be displayed?
- [ ] Show cost for each rating level (e.g., "Rating 5: 10 karma, Rating 6: 12 karma")
- [X] Show incremental cost (e.g., "Current: 4, Next: 5 (costs 10 karma)")
- [ ] Show cumulative cost table
- [ ] Other? (Please specify: _______________)

---

## Implementation Priorities

**Question:** What should be implemented first? (Rank 1-10, 1 = highest priority)

- [ ] **1. Attribute Advancement** - Most common advancement type
- [ ] **2. Skill Advancement** - Very common, multiple types (active, knowledge, language)
- [ ] **3. Training Time System** - Core mechanic for advancement
- [ ] **4. Advancement History/Ledger** - Track what's been done
- [ ] **5. Spell/Ritual Learning** - For magical characters
- [ ] **6. Specialization Learning** - Common skill improvement
- [ ] **7. Edge Advancement** - Simple (no downtime)
- [ ] **8. Focus Bonding** - For magical characters
- [ ] **9. Initiation/Submersion** - Advanced magical/technomancer feature
- [ ] **10. Complex Form Learning** - For technomancers

**Question:** Should we implement a minimal viable advancement system first?
- [X] Yes, start with attributes + skills + basic training tracking
- [ ] No, implement full system from the start
- [ ] Phased approach (Please specify phases: _______________)

---

## Technical Questions

### Data Model

**Question:** Should advancement records be immutable (append-only)?
- [X] Yes, create new records, never modify (full audit trail)
- [ ] No, allow editing/canceling advancements
- [ ] Hybrid (recent can be edited, old are immutable)

**Question:** How should we handle character state updates?
- [ ] Immediate (update character when advancement is initiated)
- [ ] Deferred (update character when training completes)
- [X] Hybrid (karma spent immediately, attributes/skills updated when training completes)

### API Design

**Question:** Should advancement have dedicated API endpoints?
- [ ] Yes, `/api/characters/[id]/advancement/*` endpoints
- [ ] No, use existing `/api/characters/[id]/gameplay` endpoint
- [ ] Hybrid (some via gameplay, complex via dedicated endpoints)

**Question:** Should training management have separate endpoints?
- [ ] Yes, `/api/characters/[id]/training/*` endpoints
- [ ] No, training is part of advancement endpoints
- [ ] Other? (Please specify: _______________)

### Validation

**Question:** Where should validation logic live?
- [ ] Client-side only (faster UX)
- [ ] Server-side only (security)
- [X] Both (client for UX, server for security)

---

## Open Questions (Your Input Needed)

### General Philosophy

**Question:** What is the primary goal of the advancement system?
- [ ] Track character growth over time
- [ ] Enforce rules and prevent errors
- [ ] Provide tools for players to manage advancement
- [ ] Support GM oversight and campaign management
- [X] All of the above
- [ ] Other? (Please specify: _______________)

**Question:** Should advancement be:
- [ ] Strictly rule-compliant (no house rules)
- [ ] Flexible (allow GM/campaign overrides)
- [X] Configurable (settings for common house rules)

### Edge Cases

**Question:** What happens if a character dies during training?
- [ ] Training is lost, karma is refunded
- [X] Training is lost, karma is not refunded
- [ ] Training completes posthumously (if that makes sense)
- [ ] Other? (Please specify: _______________)

**Question:** How should we handle characters who leave/join campaigns mid-training?
- [X] Training continues regardless
- [ ] Training pauses when character leaves campaign
- [ ] Training is tied to campaign downtime
- [ ] Other? (Please specify: _______________)

---

## Next Steps

Once this document is filled in, we will:
1. Create detailed feature specifications for each advancement type
2. Design data models and API endpoints
3. Create implementation plan with phases
4. Begin implementation based on priorities

---

## Notes

- Quality advancement (Phase 7) is already complete and can serve as a reference implementation
- All advancement costs and training times are documented in `docs/rules/reference.md`
- Character creation karma spending is already implemented and can inform advancement UI patterns
