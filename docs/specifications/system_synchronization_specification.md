# System-Wide Synchronization Specification

**Status:** Draft / Specification  
**Category:** Data Integrity, User Experience  
**AFFECTS:** Character Data (Gear, Spells, Skills, Attributes), Rulebook Integration

---

## Overview

Characters in Shadow Master are snapshots of a specific ruleset version. This protocol defines how to manage "drift" between a character and its source rulebooks across all systems, utilizing a **Hybrid Snapshot Model** to balance stability with ease-of-use.

## Goals

- **Stability First**: Prevent unexpected changes to dice pools or limits during a session.
- **Hybrid Data Flow**: Auto-update non-mechanical data (flavor) while buffering mechanical data (math).
- **Structural Integrity**: Safely handle schema changes like new attributes or merged skills.

---

## The Hybrid Snapshot Model

Data is categorized into three layers to determine its synchronization behavior:

### 1. Live Layer (Auto-Sync)
Purely aesthetic or descriptive data. Updates are applied automatically.
- **Examples**: Item descriptions, flavor text, icons, category names, spell lore.

### 2. Snapshot Layer (Buffered)
Game-mechanical values that directly impact calculations. These only change when a user explicitly performs a "Sync".
- **Examples**: Damage, AP, Mode, Skill Ratings, Attribute Minimums, Drain codes.

### 3. Delta Layer (Character-Specific)
Data that belongs uniquely to the character instance. These are never overwritten by rulebook updates.
- **Examples**: Current ammo, installed mods, custom notes, point allocations.

---

## Handling Structural Changes

A "Structural Change" occurs when the base ruleset modifies its schema. These are categorized by severity:

### Category A: Non-Breaking (Additive)
*Example: Adding a new "Sixth Sense" attribute.*
- **Detection**: Found a key in Rulebook not in Character.
- **Action**: Highlight in Sync Lab. Initialize to metametatype minimum (1) upon user approval.
- **Impact**: Non-blocking. Character stays "Active".

### Category B: Breaking (Transformative)
*Example: Merging "Pistols" and "Automatics" into "Firearms".*
- **Detection**: Required keys in Version N are missing or replaced in Version N+1.
- **Action**: Requires a **Migration Wizard**. User must manually allocate legacy points into the new structure.
- **Impact**: **Blocking**. Character is marked as "Invalid/Draft" until migrated.

---

## Logic: Reconciliation by Component

| Component | Sync Strategy | Structural Impact |
| :--- | :--- | :--- |
| **Attributes** | Snapshot (Min/Max) | High (Recalculates Limits/Init) |
| **Skills** | Snapshot (Rating Calc) | High (Impacts Dice Pools) |
| **Gear** | Hybrid (Stats Snapshotted) | Medium (Recalculates AR/Damage) |
| **Augs** | Hybrid (Essence Snapshotted) | High (Impacts Essence/Magic) |
| **Spells** | Hybrid (Drain Snapshotted) | Medium (Impacts Drain Tests) |

---

## UI/UX: The System Sync Lab

### 1. The "Stability Shield"
A visual indicator on the character sheet showing:
- 🛡️ **Shielded**: Snapshots match Rulebook (Latest version).
- 🔄 **Update Pending**: Ruleset has updates available (Non-breaking).
- ⚠️ **Critical Drift**: Structural changes detected (Requires Migration).

### 2. The Migration Wizard
For Category B changes, a specialized UI steps the user through the transformation:
- "Skill Pistol (Rating 4) is being replaced by Firearms." -> [Apply 4 points to Firearms] [Cancel and keep as Custom].

---

## Technical Architecture: The Overlay

```typescript
interface CharacterInstance {
  baseSync: {
    bookId: string;
    lockedVersion: string;
  };
  // The 'Snapshot' stores the rulebook values as they were at 'lockedVersion'
  snapshot: Record<string, any>;
  // The 'Delta' stores user-specific modifications
  delta: Record<string, any>;
}

// Final Runtime Value = Merge(LiveRulebookFlavor, SnapshotMath, CharacterDelta)
```

---

## Character Legality (The "Rules Legal" Check)

A character is considered **Rules Legal** only if:
1. It contains all mandatory keys defined in the current ruleset.
2. It has passed all structural migrations.
3. If structural drift is detected, the character's status is toggled to `Invalid` and must be reviewed in the Sync Lab before being used in a session.
