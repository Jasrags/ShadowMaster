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

CHARACTER ADVANCEMENT
Character generation is only the start. Your character
will go on some runs, pick up some Karma and nuyen,
and then look for ways to get better at what he does.
Character advancement rules tell you how to build your
runner from a street novice to a big, bad, fire-breath-
ing street legend. (Gamemasters: for information on
awarding Karma, see Gamemaster Advice, p. 332).
Karma advancement works similar to the way you
spent Karma at the end of character creation to cus-
tomize the character, improve skills and attributes, and
purchase things like bound spirits and registered sprites,
but with one fundamental difference. When you create
your character, it’s assumed your character has taken the
time needed to develop and improve whatever skills he
possesses. Once roleplaying starts, though, he’s going
to need time to get better at his skills. He cannot, for
example, simply rise from a Blades skill of 5 to Blades 6
overnight. He must train, possibly under the instruction
of a master, and practice, practice, practice to improve
his skill. This training and practice normally takes place
during the runner’s downtime.
The time it takes to improve an attribute or skill is
meant to reflect the in-world time a character must invest
in improving his abilities and is measured in days, weeks,
or months. The higher the rating in a skill or attribute, the
more difficult and time-consuming it is to advance to the
next level. Some qualities, such as Dependents, extend
this timeframe. This training time can be interrupted by
going out on runs or doing other activities, but the char-
acter must resume his interrupted training as quickly as
possible. Waiting too long before getting back into train-
ing can result in losing the benefits of previous sessions
and having to start from the beginning again. Karma for
the new or improved rating of an attribute or skill does
not need to be paid until the character has fully com-
pleted their training period. For the duration of training
required per attribute or skill rating, refer to the Training
Rate Table. This time can be reduced with the help of an
instructor (see Using Instruction, p. 141).
The time it takes to improve attributes cannot be de-
creased. Building muscle for Body or Strength, or improv-
ing cognitive functions, always takes a serious investment
of time. Note that you can’t improve Physical or Mental
attributes during the same downtime period when you
receive implants or augmentations that improve those
same attributes. That downtime is used solely for re-
covery from the augmentation implanting process and
for getting used to their body’s new modifications. The
character will have to wait to the next downtime to begin
training for another improvement. A character may only
train to improve one Mental and one Physical attribute, or
one attribute and one skill, in a single downtime period.
Skills can be taught for improvement purposes. If
the player is able to find an instructor to train him and
help him perfect his techniques, the time it takes im-
prove his skill is reduced by 25 percent (round down). If
the character chooses to focus on improving only skills
during a downtime, the character may choose to learn
or improve a number of skills up to their Logic rating
divided by 2 (round up). Specializations for skills take
1 month of dedicated training to learn and cannot be
learned at the same time as anything else. Skill groups
are improved at a rate of [new Rating] x 2 weeks. A
character in the process of training to improve a skill
group cannot learn or improve any other attributes or
skills at the same time. Improving a skill group is con-
sidered time consuming and focus intensive.
Edge is a unique quality. Because it reflects the char-
acter’s luck, it requires no special amount of time to
raise. Edge can be raised anytime the character has the
Karma to do so.

ATTRIBUTE AND SKILL TABLES
The cost to improve an attribute is new Rating x 5 Karma.
The calculations for these improvements have already
been made in the Karma Advancement Table. To use the
table, first find your current Rating in the Starting Rating
column on the left, then move to the right until you are
in the column whose header matches your desired new
rating. For example, if you are raising an Attribute from
4 to 5, find 4 in the Starting Rating column, and move
to the right along the row until you find the desired Rat-
ing (column 5, in this case). In this case the entry is 25,
which means you need to pay 25 Karma for the attribute
rating increase (which is equal to Rating 5 x 5 Karma). If
you wanted to go from 4 to 6, you’d move one column
further to the right and see that you needed a total of 55
Karma to make this increase.
The maximum number of ratings you can increase
a single Attribute by in any given period of downtime
during a campaign is 2. If you wish to raise the Attribute
any further, you will have to wait for more downtime.
The skill table works on a similar principle, though
Active Skill ratings costs are computed at new Rating x
2. If you are purchasing a brand new skill, find the desired
rating on the table and pay that cumulative amount. For
example, if you are purchasing the running skill for the
first time, and are buying it up to Rating 3, you will pay
12 Karma. To go from 7 to 8 in a skill, you will pay 16
Karma (rating 8 x 2 Karma). To calculate the cost of
jumping more than one level, subtract the number in the
column with your current Rating from the number in the
column with your desired higher Rating. Knowledge and
Language skills work in a similar manner, though their
cost is only new Rating x 1. A character may raise the
Rating of their Active, Knowledge, or Language skills up
by a maximum of 3 rating points per any one downtime.
To raise the skill(s) any further, they have to wait for an-
other period of downtime.
Active Skill Groups cost new Rating x 5 to raise and
can only be raised by 1 rating per downtime.

LEARNING COMPLEX FORMS
To gain access to a new complex form, a technomancer
must spend 4 Karma. Details on learning complex
forms can be found in the Resonance Library section
(p. 252).

LEARNING MAGIC
Aspected magicians, magicians, and mystic adepts
may purchase new spells, rituals, or preparations to use
(see Magic, p. 276). The magic user must spend 5 Kar-
ma to learn the spell, ritual, or preparation. For details
on how to learn magic, see p. 299.

QUALITIES
There are two ways for a character to pick up new qual-
ities. First, they can be assigned by the gamemaster as a
result of events or actions in the course of a campaign.
Positive qualities may be assigned as reward for good
roleplaying, while Negative qualities may be assigned
if something traumatic or significant happens or the
character does something for which the Negative qual-
ity is a reasonable consequence (“reasonable” is de-
fined by the gamemaster). A player may also purchase
Positive qualities for his character at any time during
game play. The cost for purchasing a Positive quality
during game play is the listed Karma cost x 2. Similarly,
if a character wishes to get rid of a Negative quality, has
met any stipulated requirements, and the gamemaster
has given the player permission, the player may do so
at a rate of listed Karma x 2.
