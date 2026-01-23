# Character Creation Pattern Compliance Audit

## Context

Shadow Master's character creation system uses a sheet-based, single-page approach with all sections visible simultaneously. The codebase has **existing documented patterns** that define standards for purchase cards and selection modals. This audit will verify component compliance against these patterns, identify gaps, and create new pattern documentation where needed.

**Existing Documentation:**

- `/docs/patterns/purchase-card-pattern.md` - Canonical purchase card standard with 11-item checklist
- `/docs/patterns/selection-modal-pattern.md` - Canonical selection modal standard with 11-item checklist
- `/docs/plans/character-creation-audit-remediation.md` - Existing 6-phase remediation plan (Phases 1-3 largely complete)

**Current Component Inventory:**

- ~100 files across `/components/creation/` in 17 subfolders
- Existing shared components in `/components/creation/shared/`
- Accessible modal foundation in `/components/ui/BaseModal.tsx`

This audit continues Phase 4 (Component Consolidation) with focus on **visual/UX consistency** and **pattern compliance**.

## Objectives

1. **Classify all creation components** into documented pattern categories
2. **Audit compliance** against existing pattern checklists
3. **Document deviations** (intentional design decisions vs. bugs to fix)
4. **Create new pattern documentation** for categories not yet covered
5. **Generate prioritized remediation plan** for non-compliant components

## Component Categories

### 1. Purchase Cards (see `/docs/patterns/purchase-card-pattern.md`)

**Purpose:** Cards that allow purchasing/selecting items with budget tracking

**Pattern Requirements:**

- Budget bar at top with progress indicator
- Category section header with collapse toggle, icon, title, count badge
- Add button uses amber styling (`bg-amber-500`), compact (`px-2 py-1 text-xs`), positioned in header
- Empty state uses dashed border box with descriptive text
- Item rows with icon, name, badges, cost, remove button
- Footer showing count and total

**Components to Audit:**
| Component | Budget Type | Reference Implementation |
|-----------|-------------|-------------------------|
| `GearCard` / `GearPanel` | Nuyen | — |
| `WeaponsPanel` | Nuyen | — |
| `ArmorPanel` | Nuyen | — |
| `VehiclesCard` | Nuyen | — |
| `MatrixGearCard` | Nuyen | ✓ Canonical |
| `AugmentationsCard` | Nuyen + Essence | — |
| `SpellsCard` | Free Spells + Karma | — |
| `FociCard` | Nuyen + Bonding Karma | — |
| `AdeptPowersCard` | Power Points | — |
| `ComplexFormsCard` | Free Forms + Karma | — |

### 2. Selection Modals (see `/docs/patterns/selection-modal-pattern.md`)

**Purpose:** Modals for browsing catalogs and selecting/purchasing items

**Pattern Requirements:**

- Uses `BaseModalRoot` with `size="2xl"` and `max-h-[85vh]`
- Header with title, budget info subtitle, close button
- Search bar with icon inside input
- Split content area (`w-1/2` columns) with border separator
- Left: scrollable item list (virtualized if >50 items)
- Right: detail preview with empty state when nothing selected
- Item rows have selected/selectable/disabled states with accent colors
- Purchase button full-width with accent color, "Cannot Afford" disabled state
- Footer with item count and Cancel button

**Accent Colors by Category:**
| Category | Accent Color |
|----------|--------------|
| Weapons | `amber` |
| Matrix Gear | `cyan` |
| Armor | `blue` |
| Vehicles/Drones | `emerald` |
| Augmentations | `purple` |
| General Gear | `blue` |
| Magic (Spells, Foci) | `purple` |
| Qualities (Positive) | `blue` |
| Qualities (Negative) | `amber` |

**Components to Audit:**
| Component | Reference Implementation |
|-----------|-------------------------|
| `GearPurchaseModal` | — |
| `WeaponPurchaseModal` | ✓ With category filters |
| `ArmorPurchaseModal` | — |
| `CommlinkPurchaseModal` | ✓ Simple dual-column |
| `CyberdeckPurchaseModal` | ✓ Matrix variant |
| `VehicleModal` | — |
| `DroneModal` | — |
| `AugmentationModal` | — |
| `QualitySelectionModal` | — |
| `FocusModal` | — |

### 3. Stats/Budget Cards (NEW PATTERN NEEDED)

**Purpose:** Cards for allocating points within defined ranges

**Key Characteristics:**

- Static content layout (no modal for selection)
- Range-bound value controls with +/- buttons
- Live budget impact calculation
- Derived stat display
- Integration with `CreationBudgetContext`

**Components to Audit:**

- `AttributesCard`
- `SkillsCard`
- `PrioritySelectionCard`
- `KnowledgeLanguagesCard`

### 4. Configuration Cards (NEW PATTERN NEEDED)

**Purpose:** Single-selection from catalog without nuyen budget

**Key Characteristics:**

- Modal opens for browsing/selection
- No nuyen tracking (may use karma, free slots, or no cost)
- Selection stored as ID or simple configuration object
- Often has prerequisite dependencies (e.g., metatype requires priority)

**Components to Audit:**

- `MetatypeCard` / `MetatypeModal`
- `MagicPathCard` / `MagicPathModal`
- `ContactsCard` / `ContactModal`
- `IdentitiesCard` / `IdentityModal` / `LifestyleModal` / `LicenseModal`

### 5. Display Cards (NEW PATTERN NEEDED)

**Purpose:** Present static or computed character information

**Key Characteristics:**

- Primarily display-focused
- Minimal interaction (text input, computed values)
- No modal workflows
- May show validation status

**Components to Audit:**

- `CharacterInfoCard`
- `DerivedStatsCard`
- `EditionSelector`

## Analysis Tasks

### Phase 1: Component Inventory & Classification

**For each component in `/components/creation/`:**

1. **Classify** into one of the five categories above
2. **Identify** which pattern document applies (existing or needs creation)
3. **Note** subcomponents and their relationships

**Deliverable:** Component classification matrix

### Phase 2: Compliance Audit Against Existing Patterns

**For Purchase Cards, check against 11-item checklist:**
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Budget bar at top with progress indicator | ☐ |
| 2 | Category section header pattern used | ☐ |
| 3 | Add button uses amber styling (`bg-amber-500`) | ☐ |
| 4 | Add button is compact (`px-2 py-1 text-xs`) | ☐ |
| 5 | Add button positioned in header (right-aligned) | ☐ |
| 6 | Empty state uses dashed border box | ☐ |
| 7 | Empty state text is descriptive | ☐ |
| 8 | No full-width dashed buttons for add actions | ☐ |
| 9 | Item rows have consistent remove button | ☐ |
| 10 | Footer shows count and total | ☐ |
| 11 | All elements have dark mode support | ☐ |

**For Selection Modals, check against 11-item checklist:**
| # | Requirement | Status |
|---|-------------|--------|
| 1 | Uses `BaseModalRoot` with `size="2xl"` | ☐ |
| 2 | Has `max-h-[85vh]` container | ☐ |
| 3 | Header has title, budget info, close button | ☐ |
| 4 | Search bar with icon inside input | ☐ |
| 5 | Split content with `w-1/2` columns | ☐ |
| 6 | Left column has `border-r` separator | ☐ |
| 7 | Both columns have `overflow-y-auto` | ☐ |
| 8 | Item rows have selected/selectable/disabled states | ☐ |
| 9 | Detail preview has empty state | ☐ |
| 10 | Purchase button full-width with accent color | ☐ |
| 11 | Footer has item count and cancel button | ☐ |

**Deliverable:** Compliance matrix with pass/fail per checklist item

### Phase 3: Shared Component & Design Token Audit

**Existing Shared Components (`/components/creation/shared/`):**

- `CreationCard.tsx` - Base card with collapsible, validation badge
- `BudgetIndicator.tsx` - Budget bar with progress, karma warning
- `ValidationBadge.tsx` - Status indicator (valid/warning/error/pending)
- `CardSkeleton.tsx` - Loading state
- `RatingSelector.tsx` - Rating increment/decrement
- `BulkQuantitySelector.tsx` - Quantity for stackable items
- `KarmaConversionModal.tsx` - Karma-to-nuyen conversion

**Existing UI Components (`/components/ui/`):**

- `BaseModal.tsx` - Accessible modal with `BaseModalRoot`, `ModalHeader`, `ModalBody`, `ModalFooter`
- `Tooltip.tsx` - Accessible tooltip

**Design Tokens (`/app/globals.css`):**

Audit the CSS custom properties defined in `:root` and `.dark`:

```css
/* Semantic colors */
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--destructive, --destructive-foreground
--border, --input, --ring

/* Cyber accents */
--cyber-accent, --cyber-glow
```

**Tasks:**

1. Document which shared components each card uses
2. Identify code duplication that should use shared components
3. Verify design token usage consistency
4. Note any inline styles that should use tokens

**Deliverable:** Shared component usage matrix, duplication hotspots

### Phase 4: New Pattern Documentation

Create pattern documentation for categories without existing docs:

**4.1 Stats Card Pattern** (`/docs/patterns/stats-card-pattern.md`)

- Structure: Budget indicator, grouped controls, validation
- Control patterns: +/- steppers with keyboard support
- Budget integration approach
- Accessibility requirements (ARIA labels, live regions)

**4.2 Configuration Card Pattern** (`/docs/patterns/configuration-card-pattern.md`)

- Structure: Selection display, change button, modal workflow
- Empty vs. selected states
- Dependency handling (locked until prerequisite met)
- Modal structure (simpler than purchase modals)

**4.3 Display Card Pattern** (`/docs/patterns/display-card-pattern.md`)

- Structure: Form inputs or computed displays
- Validation status integration
- Text input styling standards

**Deliverable:** Three new pattern documents following existing format

### Phase 5: Gap Analysis

**Identify:**

1. **Anti-patterns in use** - Components violating documented patterns
2. **Missing shared components** - Patterns duplicated across 3+ components
3. **Inconsistent styling** - Deviations in spacing, typography, colors
4. **Accessibility gaps** - Missing ARIA labels, keyboard support, focus management

**Deliverable:** Gap analysis report with severity ratings

## Deliverables

### 1. Component Classification Matrix

| Component      | Path                           | Category      | Pattern Doc                | Notes |
| -------------- | ------------------------------ | ------------- | -------------------------- | ----- |
| GearCard       | `/creation/GearCard.tsx`       | Purchase Card | purchase-card-pattern.md   | —     |
| AttributesCard | `/creation/AttributesCard.tsx` | Stats Card    | NEW: stats-card-pattern.md | —     |
| ...            | ...                            | ...           | ...                        | ...   |

### 2. Compliance Audit Spreadsheet

For each component against its applicable pattern checklist:

- Component name and path
- Pattern applied
- Pass/Fail per checklist item
- Screenshot of deviation (if applicable)
- Fix complexity (Low/Medium/High)

### 3. Shared Component Usage Report

| Shared Component  | Used By                                  | Should Also Use        | Notes                                 |
| ----------------- | ---------------------------------------- | ---------------------- | ------------------------------------- |
| `BudgetIndicator` | AttributesCard, QualitiesCard            | GearCard, WeaponsPanel | Currently using inline implementation |
| `BaseModalRoot`   | GearPurchaseModal, QualitySelectionModal | FocusModal             | Uses older pattern                    |
| ...               | ...                                      | ...                    | ...                                   |

### 4. New Pattern Documents

- `/docs/patterns/stats-card-pattern.md`
- `/docs/patterns/configuration-card-pattern.md`
- `/docs/patterns/display-card-pattern.md`

Each following the format of existing pattern docs with:

- Overview and purpose
- Required elements with code examples
- Anti-patterns section
- Audit checklist
- Reference implementations

### 5. Prioritized Remediation Plan

**Priority Levels:**

- **P0 (Critical)**: Anti-patterns causing UX confusion or accessibility violations
- **P1 (High)**: Missing required pattern elements
- **P2 (Medium)**: Inconsistent styling (spacing, colors, typography)
- **P3 (Low)**: Could benefit from shared component but works correctly

**Format:**
| Priority | Component | Issue | Pattern Violation | Fix Effort | Dependencies |
|----------|-----------|-------|-------------------|------------|--------------|
| P0 | SpellsCard | Full-width dashed add button | purchase-card #8 | Low | None |
| P1 | FociCard | Missing budget bar | purchase-card #1 | Medium | BudgetIndicator |
| ... | ... | ... | ... | ... | ... |

### 6. Testing Checklist Templates

**Per-Component Manual Test:**

- [ ] Visual matches pattern reference implementation
- [ ] Modal workflow: open → interact → confirm → close
- [ ] Budget updates reflect correctly
- [ ] Validation displays appropriately
- [ ] Empty state displays correctly
- [ ] Loading states work as expected
- [ ] Keyboard navigation functions (Tab, Enter, Escape, Arrow keys)
- [ ] Dark mode renders correctly
- [ ] Responsive at mobile breakpoint (768px)

## Technical Constraints

- **Tech Stack**: Next.js 16, React 19, React Aria Components, Tailwind CSS 4
- **Design Tokens**: CSS custom properties in `app/globals.css` (not JS config)
- **Modal Foundation**: Must use `BaseModalRoot` from `/components/ui/BaseModal.tsx`
- **Shared Components**: Prefer existing shared components over new implementations
- **Path Alias**: Use `@/*` for imports
- **Column Layout**: Maintain existing 3-column layout organization
- **No Breaking Changes**: Refactoring must maintain `CreationBudgetContext` integration

## Success Criteria

- [ ] All ~100 creation components classified and audited
- [ ] Compliance matrix completed for all Purchase Cards and Selection Modals
- [ ] Three new pattern documents created and approved
- [ ] Zero P0 (Critical) issues remaining
- [ ] P1 issues have assigned remediation plan
- [ ] Shared component usage increased (measure before/after)
- [ ] All unit tests pass after any refactoring
- [ ] Manual UI testing confirms no regressions

## Initial Tasks

1. **Read existing pattern docs** (`/docs/patterns/purchase-card-pattern.md`, `/docs/patterns/selection-modal-pattern.md`)
2. **Inventory all components** in `/components/creation/` with file paths
3. **Classify each component** into one of the five categories
4. **Identify reference implementations** for each pattern
5. **Begin compliance audit** starting with Purchase Cards (highest standardization value)
6. **Document findings** in compliance matrix format

## Out of Scope

- Performance optimization (covered in existing remediation plan Phase 3)
- Accessibility deep-dive (covered in existing remediation plan Phases 1-2)
- New feature implementation (covered in existing remediation plan Phase 5)
- Code splitting (covered in existing remediation plan Phase 3)

This audit focuses specifically on **visual/UX pattern consistency** to complement the existing remediation work.
