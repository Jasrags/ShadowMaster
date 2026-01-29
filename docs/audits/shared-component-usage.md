# Shared Component Usage Audit

Audit Date: 2026-01-22
Reference: `/components/creation/shared/`

## Summary

| Shared Component     | Used By       | Should Also Use                                 | Notes                              |
| -------------------- | ------------- | ----------------------------------------------- | ---------------------------------- |
| CreationCard         | 22 components | —                                               | Universal adoption                 |
| BudgetIndicator      | 7 components  | ArmorPanel, GearPanel, FociCard, MatrixGearCard | Pattern requires budget bar at top |
| ValidationBadge      | 1 (internal)  | —                                               | Used internally by CreationCard    |
| RatingSelector       | 1 component   | Multiple modals                                 | Underutilized                      |
| BulkQuantitySelector | 3 components  | —                                               | Appropriate scope                  |
| KarmaConversionModal | 6 components  | —                                               | All nuyen panels using conversion  |
| CardSkeleton         | Unknown       | All cards                                       | Loading state pattern              |
| **EmptyState**       | 3 components  | All purchase cards                              | ✅ **NEW** - Created 2026-01-22    |
| **SummaryFooter**    | 3 components  | All purchase cards                              | ✅ **NEW** - Created 2026-01-22    |

---

## Detailed Usage Analysis

### 1. CreationCard

**Path:** `/components/creation/shared/CreationCard.tsx`

**Purpose:** Base card wrapper with collapsible behavior, validation badge, and consistent styling.

**Current Users (22):**

- AdeptPowersCard
- ArmorPanel
- AttributesCard
- AugmentationsCard
- CharacterInfoCard
- ComplexFormsCard
- ContactsCard
- DerivedStatsCard
- FociCard
- GearCard
- GearPanel
- IdentitiesCard
- KnowledgeLanguagesCard
- MagicPathCard
- MatrixGearCard
- MetatypeCard
- PrioritySelectionCard
- QualitiesCard
- SkillsCard
- SpellsCard
- VehiclesCard
- WeaponsPanel

**Status:** ✅ Universal adoption - all creation cards use this component.

---

### 2. BudgetIndicator

**Path:** `/components/creation/shared/BudgetIndicator.tsx`

**Purpose:** Progress bar with spent/total display, optional karma warning, tooltip support.

**Current Users (7):**
| Component | Budget Type | Notes |
|-----------|-------------|-------|
| AttributesCard | Attribute Points, Special Attr Points | Dual budget bars |
| SkillsCard | Skill Points, Group Points | Dual budget bars |
| QualitiesCard | Positive/Negative Karma | Dual budget bars |
| KnowledgeLanguagesCard | Knowledge Points | Single budget |
| ComplexFormsCard | Free Complex Forms | Single budget |
| SpellsCard | Free Spells | Single budget |
| AdeptPowersCard | Power Points | Single budget |

**Should Also Use:**
| Component | Current Implementation | Recommendation |
|-----------|------------------------|----------------|
| ArmorPanel | No budget bar (relies on shared nuyen context) | Add BudgetIndicator or document as intentional |
| GearPanel | No budget bar (relies on shared nuyen context) | Add BudgetIndicator or document as intentional |
| FociCard | Has karma summary but not BudgetIndicator | Add BudgetIndicator for consistency |
| MatrixGearCard | Uses inline budget display | Good - reference implementation |
| VehiclesCard | Uses inline nuyen bar | Good - compliant |
| WeaponsPanel | Uses inline budget display | Good - compliant |
| AugmentationsCard | Uses essence bar | Good - compliant |

**Design Decision Needed:**
ArmorPanel and GearPanel share the nuyen budget with other panels. Showing individual budget bars might be confusing since they all draw from the same pool. Options:

1. Add BudgetIndicator showing shared nuyen budget
2. Document as intentional deviation (panels share budget display elsewhere)
3. Create a "shared budget context" indicator pattern

---

### 3. ValidationBadge

**Path:** `/components/creation/shared/ValidationBadge.tsx`

**Purpose:** Status indicator (valid/warning/error/pending) for card headers.

**Current Users:** Used internally by CreationCard only.

**Status:** ✅ Correct usage - all cards get validation badge through CreationCard.

---

### 4. RatingSelector

**Path:** `/components/creation/shared/RatingSelector.tsx`

**Purpose:** Increment/decrement control for rating values.

**Current Users (1):**

- AugmentationModal (for rating selection)

**Duplication Opportunities:**
The following components implement inline +/- controls that could use RatingSelector:

- AttributesCard (InlineAttributeRow)
- SkillsCard (skill rating controls)
- KnowledgeLanguagesCard (language/skill rating controls)
- SkillGroupCard (group rating controls)

**Recommendation:** Evaluate whether RatingSelector's interface fits these use cases or if a more generic stepper component should be created.

---

### 5. BulkQuantitySelector

**Path:** `/components/creation/shared/BulkQuantitySelector.tsx`

**Purpose:** Quantity selection for stackable items (ammo, consumables).

**Current Users (3):**

- WeaponPurchaseModal (ammunition selection)
- AmmunitionModal (ammo quantity)
- GearPurchaseModal (stackable gear)

**Status:** ✅ Appropriate scope - only used where bulk quantity matters.

---

### 6. KarmaConversionModal

**Path:** `/components/creation/shared/KarmaConversionModal.tsx`

**Purpose:** Modal for converting karma to nuyen (2000¥ per karma).

**Current Users (6):**

- WeaponsPanel
- GearPanel
- ArmorPanel
- MatrixGearCard
- VehiclesCard
- AugmentationsCard

**Status:** ✅ All nuyen-based purchase panels use conversion modal.

---

### 7. CardSkeleton

**Path:** `/components/creation/shared/CardSkeleton.tsx`

**Purpose:** Loading placeholder for cards.

**Current Users:** Unknown - needs investigation.

**Recommendation:** Audit where loading states are needed and ensure consistent usage.

---

### 8. Lifestyle Components

**Paths:**

- `/components/creation/shared/LifestyleModificationSelector.tsx`
- `/components/creation/shared/LifestyleSubscriptionSelector.tsx`

**Purpose:** Lifestyle-specific configuration components.

**Current Users:** Used in IdentitiesCard/LifestyleModal flow.

**Status:** ✅ Domain-specific - appropriate scope.

---

## Code Duplication Hotspots

### 1. +/- Stepper Controls

**Pattern:** Increment/decrement buttons with value display.

**Found In:**

- AttributesCard (InlineAttributeRow, SpecialAttributeRow)
- SkillsCard (skill rating, group rating)
- KnowledgeLanguagesCard (language rating, skill rating)
- Multiple row components

**Current State:** Each implementation is slightly different (styling, layout, behavior).

**Recommendation:** Create a generic `Stepper` or `NumericInput` shared component with:

- Configurable min/max
- Disabled states for buttons
- Keyboard support (arrow keys)
- Consistent button sizing (h-6 w-6)
- "MAX" badge support

---

### 2. Empty State Pattern ✅ RESOLVED

**Pattern:** Dashed border box with "No X added/purchased" text.

**Status:** ✅ Created `/components/creation/shared/EmptyState.tsx` on 2026-01-22

**Usage:**

```tsx
import { EmptyState } from "./shared";

<EmptyState message="No weapons purchased" />
<EmptyState message="No items" icon={Package} size="lg" />
```

**Features:**

- Size variants: `sm`, `md`, `lg`
- Optional icon support
- Consistent dark mode styling

**Current Users:** ArmorPanel, GearPanel, WeaponsPanel

---

### 3. Section Header with Add Button

**Pattern:** Uppercase label with amber "Add" button aligned right.

**Found In:** All purchase cards with categories.

**Current State:** Duplicated but consistent.

**Recommendation:** Consider a `SectionHeader` shared component:

```tsx
<SectionHeader
  icon={<Sparkles className="h-3.5 w-3.5 text-purple-500" />}
  title="Foci"
  count={items.length}
  onAdd={() => setIsModalOpen(true)}
/>
```

---

### 4. Summary Footer ✅ RESOLVED

**Pattern:** Row with count on left, total on right.

**Status:** ✅ Created `/components/creation/shared/SummaryFooter.tsx` on 2026-01-22

**Usage:**

```tsx
import { SummaryFooter } from "./shared";

<SummaryFooter count={5} total={12500} format="currency" />
<SummaryFooter count={3} total={3} format="number" label="power" />
<SummaryFooter count={2} total={gearSpent} variant="background" />
```

**Features:**

- Format options: `currency` (¥), `number`, `decimal`
- Custom label with auto-pluralization
- Variants: `border` (default with border-top), `background` (subtle bg)
- Optional border control

**Current Users:** ArmorPanel, GearPanel, WeaponsPanel

---

### 5. Item Row with Remove Button

**Pattern:** Row displaying item info with X button for removal.

**Found In:** All purchase cards, list cards.

**Current State:** Each card implements its own row component.

**Recommendation:** Too varied to generalize - keep per-component implementations.

---

## Consolidation Recommendations

### Priority 1 (High Value, Low Effort) ✅ COMPLETE

| New Component   | Status     | Notes                                       |
| --------------- | ---------- | ------------------------------------------- |
| `EmptyState`    | ✅ Created | Used by ArmorPanel, GearPanel, WeaponsPanel |
| `SummaryFooter` | ✅ Created | Used by ArmorPanel, GearPanel, WeaponsPanel |

### Priority 2 (Medium Value, Medium Effort)

| New Component   | Replaces                     | Effort | Status                        |
| --------------- | ---------------------------- | ------ | ----------------------------- |
| `SectionHeader` | Duplicated section headers   | Medium | Deferred - low priority       |
| `Stepper`       | Multiple +/- implementations | Medium | See RatingSelector evaluation |

### Priority 3 (Low Priority)

| Component      | Action             | Notes                                      |
| -------------- | ------------------ | ------------------------------------------ |
| RatingSelector | Evaluate expansion | May need API changes for stepper use cases |
| CardSkeleton   | Audit usage        | Ensure consistent loading states           |

---

## BaseModal Usage

**Path:** `/components/ui/BaseModal.tsx`

**Modal Components Using BaseModal (23):**
| Component | Size | Pattern Compliance |
|-----------|------|--------------------|
| AmmunitionModal | 2xl | ✅ |
| ArmorModificationModal | 2xl | ✅ |
| ArmorPurchaseModal | 2xl | ✅ |
| AugmentationModal | 2xl | ✅ |
| AutosoftModal | lg | ⚠️ Should be 2xl |
| CommlinkPurchaseModal | 2xl | ✅ Reference |
| CyberdeckPurchaseModal | 2xl | ✅ Reference |
| CyberlimbAccessoryModal | lg | ⚠️ Should be 2xl |
| CyberlimbWeaponModal | lg | ⚠️ Should be 2xl |
| CyberwareEnhancementModal | lg | ⚠️ Should be 2xl |
| DroneModal | lg | ⚠️ Should be 2xl |
| FocusModal | lg | ⚠️ Should be 2xl |
| GearModificationModal | 2xl | ✅ |
| GearPurchaseModal | 2xl | ✅ |
| QualitySelectionModal | 2xl | ✅ |
| RCCModal | lg | ⚠️ Should be 2xl |
| SkillCustomizeModal | lg | ⚠️ Configuration modal |
| SkillGroupBreakModal | md | ✅ Confirmation modal |
| SkillGroupModal | 2xl | ✅ |
| SkillModal | 2xl | ✅ |
| VehicleModal | lg | ⚠️ Should be 2xl |
| WeaponModificationModal | 2xl | ✅ |
| WeaponPurchaseModal | 2xl | ✅ Reference |

**Modals Using Wrong Size:** ✅ All fixed as of 2026-01-22. All selection modals now use `size="2xl"`.

---

## Design Token Consistency

### Colors Used for Budget Indicators

| Budget Type      | Color   | Used Consistently |
| ---------------- | ------- | ----------------- |
| Nuyen            | emerald | ✅                |
| Karma            | amber   | ✅                |
| Essence          | purple  | ✅                |
| Attribute Points | blue    | ✅                |
| Skill Points     | purple  | ✅                |
| Power Points     | violet  | ✅                |

### Section Header Colors by Category

| Category      | Icon Color  | Used Consistently |
| ------------- | ----------- | ----------------- |
| Weapons       | amber-500   | ✅                |
| Matrix        | cyan-500    | ✅                |
| Armor         | blue-500    | ✅                |
| Vehicles      | emerald-500 | ✅                |
| Augmentations | purple-500  | ✅                |
| Magic         | purple-500  | ✅                |
| Skills        | purple-500  | ✅                |

---

## Summary of Findings

### Strengths

- ✅ Universal CreationCard adoption
- ✅ Consistent KarmaConversionModal usage
- ✅ Good BudgetIndicator coverage for point-based cards
- ✅ Consistent color usage across categories
- ✅ All modal sizes now compliant (2026-01-22)
- ✅ EmptyState shared component created (2026-01-22)
- ✅ SummaryFooter shared component created (2026-01-22)

### Remaining Considerations

- ⚠️ Some purchase cards missing BudgetIndicator (pending design decision on shared budget display)
- ⚠️ RatingSelector underutilized (P3 priority)

### Completed Recommendations

1. ✅ Fix modal sizes - All 8 modals fixed
2. ⚠️ Add BudgetIndicator to missing cards or document exceptions - Pending design decision
3. ✅ Create EmptyState and SummaryFooter shared components - Done
4. ⚠️ Evaluate Stepper component creation - Deferred (P3)
