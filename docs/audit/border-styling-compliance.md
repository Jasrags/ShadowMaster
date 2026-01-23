# Border Styling Compliance Audit

**Audit Date:** 2026-01-23
**Scope:** `/components/creation/**/*.tsx`
**Total Files Analyzed:** 72

---

## Executive Summary

The character creation sheet has **6 distinct border patterns** being used, but with **inconsistent application** across components. The main issues are:

| Issue                                           | Severity | Count     |
| ----------------------------------------------- | -------- | --------- |
| Inconsistent form input border colors           | Medium   | ~15 files |
| Mixed border thickness (`border` vs `border-2`) | Low      | ~8 files  |
| Dark mode border inconsistency                  | Low      | ~12 files |
| Non-standard container borders                  | Low      | ~3 files  |

---

## Current Border Patterns

### 1. Card Container Border (Status-Based)

**Source:** `CreationCard.tsx:111-122`

```tsx
const getBorderColor = () => {
  switch (status) {
    case "valid":
      return "border-emerald-200 dark:border-emerald-800";
    case "warning":
      return "border-amber-200 dark:border-amber-800";
    case "error":
      return "border-red-200 dark:border-red-800";
    default:
      return "border-zinc-200 dark:border-zinc-700";
  }
};
// Applied as: rounded-lg border bg-white dark:bg-zinc-900 ${getBorderColor()}
```

**Status:** ✅ Consistent - All cards using `CreationCard` inherit this correctly.

---

### 2. Inner Section Container Border

**Purpose:** Groups related content within a card (e.g., attribute sections, skill lists, quality lists)

**Canonical Pattern:**

```tsx
className =
  "rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900";
```

**Actual Usage (Sample):**

| File               | Line | Pattern                                           | Issue                 |
| ------------------ | ---- | ------------------------------------------------- | --------------------- |
| AttributesCard.tsx | 695  | `border border-zinc-200 ... dark:border-zinc-700` | ✅ Correct            |
| QualitiesCard.tsx  | 221  | `border border-zinc-200 ... dark:border-zinc-700` | ✅ Correct            |
| SkillsCard.tsx     | 884  | `border border-zinc-200 ... dark:border-zinc-700` | ✅ Correct            |
| GearCard.tsx       | 1143 | `border border-zinc-200 ... dark:border-zinc-700` | ✅ Correct            |
| VehiclesCard.tsx   | 506  | `border border-zinc-200 ... dark:border-zinc-700` | ⚠️ Missing `bg-white` |

**Status:** ⚠️ Mostly consistent, minor background variations

---

### 3. Empty State Border (Dashed)

**Source:** `EmptyState.tsx:49`

**Canonical Pattern:**

```tsx
className = "rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700";
```

**Actual Usage:** Consistent across all 25+ empty states

**Status:** ✅ Consistent

---

### 4. Form Input Border

**Purpose:** Text inputs, selects, and dropdowns

**Expected Pattern:**

```tsx
// Standard input
className = "rounded-lg border border-zinc-200 dark:border-zinc-700";

// Focused state
className = "focus:border-{accent}-500 focus:ring-1 focus:ring-{accent}-500";
```

**Actual Usage (INCONSISTENT):**

| File                       | Line | Border Color       | Issue                    |
| -------------------------- | ---- | ------------------ | ------------------------ |
| WeaponPurchaseModal.tsx    | 346  | `border-zinc-200`  | ✅ Correct               |
| QualitySelectionModal.tsx  | 190  | `border-zinc-300`  | ❌ Should be 200         |
| ContactModal.tsx           | 230  | `border-zinc-300`  | ❌ Should be 200         |
| IdentityModal.tsx          | 75   | `border-zinc-300`  | ❌ Should be 200         |
| LifestyleModal.tsx         | 139  | `border-zinc-300`  | ❌ Should be 200         |
| LicenseModal.tsx           | 77   | `border-zinc-300`  | ❌ Should be 200         |
| AddLanguageModal.tsx       | 73   | `border-amber-300` | ⚠️ Semantic (acceptable) |
| AddKnowledgeSkillModal.tsx | 77   | `border-amber-300` | ⚠️ Semantic (acceptable) |
| SkillCustomizeModal.tsx    | 294  | `border-zinc-300`  | ❌ Should be 200         |
| RatingSelector.tsx         | 191  | `border-zinc-300`  | ❌ Should be 200         |

**Dark Mode Inconsistency:**

| Pattern                | Count |
| ---------------------- | ----- |
| `dark:border-zinc-700` | ~45   |
| `dark:border-zinc-600` | ~18   |
| `dark:border-zinc-800` | ~3    |

**Status:** ❌ Inconsistent - needs standardization

---

### 5. Selectable Item Border

**Purpose:** Items in selection lists that can be clicked/selected

**Patterns Found:**

```tsx
// Pattern A: Standard border (1px) with hover
className = "rounded-lg border border-zinc-200 hover:border-zinc-300";

// Pattern B: Thick border (2px) with selection state
className = "rounded-lg border-2 border-zinc-200"; // unselected
className = "rounded-lg border-2 border-emerald-500"; // selected

// Pattern C: Mixed (2px dashed for add action)
className = "rounded-lg border-2 border-dashed border-zinc-300";
```

**Actual Usage:**

| Component             | Border Type | Selected State       |
| --------------------- | ----------- | -------------------- |
| MagicPathModal        | `border-2`  | `border-emerald-500` |
| MetatypeModal         | `border-2`  | `border-emerald-500` |
| IdentityModal         | `border-2`  | `border-emerald-500` |
| QualitySelectionModal | `border`    | `border-emerald-500` |
| WeaponPurchaseModal   | `border`    | `border-amber-500`   |
| GearPurchaseModal     | `border`    | `border-amber-500`   |

**Status:** ⚠️ Mixed - `border` vs `border-2` for similar UI patterns

---

### 6. Contextual Alert/Info Border

**Purpose:** Information boxes, warnings, success messages

**Canonical Patterns:**

```tsx
// Info
"border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20";

// Warning
"border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20";

// Success
"border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20";

// Error
"border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
```

**Status:** ✅ Consistent across files

---

## Proposed Standardization

### Border Color Token System

Create consistent border color tokens for light and dark mode:

| Purpose                   | Light Mode            | Dark Mode                  |
| ------------------------- | --------------------- | -------------------------- |
| **Container (neutral)**   | `border-zinc-200`     | `dark:border-zinc-700`     |
| **Input (neutral)**       | `border-zinc-200`     | `dark:border-zinc-700`     |
| **Input (hover)**         | `border-zinc-300`     | `dark:border-zinc-600`     |
| **Input (focus)**         | `border-{accent}-500` | `dark:border-{accent}-500` |
| **Empty state**           | `border-zinc-200`     | `dark:border-zinc-700`     |
| **Selectable item**       | `border-zinc-200`     | `dark:border-zinc-700`     |
| **Selectable (hover)**    | `border-zinc-300`     | `dark:border-zinc-600`     |
| **Selectable (selected)** | `border-{accent}-500` | `dark:border-{accent}-500` |

### Border Thickness Guidelines

| Use Case         | Thickness        | Reason                   |
| ---------------- | ---------------- | ------------------------ |
| Card container   | `border` (1px)   | Subtle separation        |
| Inner sections   | `border` (1px)   | Grouping, not emphasis   |
| Form inputs      | `border` (1px)   | Standard form pattern    |
| Selectable items | `border-2` (2px) | Selection needs emphasis |
| Empty state      | `border-2` (2px) | Visual distinction       |
| Alert/info boxes | `border` (1px)   | Color provides emphasis  |

### Accent Colors by Context

| Context        | Accent Color                  | Used For              |
| -------------- | ----------------------------- | --------------------- |
| Skills         | `purple`                      | Skill groups, ratings |
| Attributes     | `emerald`                     | Core attributes       |
| Qualities      | `emerald` (pos) / `red` (neg) | Quality types         |
| Gear/Equipment | `amber`                       | All gear purchasing   |
| Matrix         | `cyan` / `purple`             | Cyberdecks, programs  |
| Magic          | `purple` / `violet`           | Spells, powers        |
| Contacts       | `emerald`                     | Contact management    |

---

## Remediation Tasks

### P1 (High) - Form Input Standardization

**Files to Update:**

1. `QualitySelectionModal.tsx` - Change `border-zinc-300` to `border-zinc-200`
2. `ContactModal.tsx` - Change `border-zinc-300` to `border-zinc-200`
3. `IdentityModal.tsx` - Change `border-zinc-300` to `border-zinc-200`
4. `LifestyleModal.tsx` - Change `border-zinc-300` to `border-zinc-200`
5. `LicenseModal.tsx` - Change `border-zinc-300` to `border-zinc-200`
6. `SkillCustomizeModal.tsx` - Change `border-zinc-300` to `border-zinc-200`
7. `SkillGroupBreakModal.tsx` - Change `border-zinc-300` to `border-zinc-200`
8. `RatingSelector.tsx` - Change `border-zinc-300` to `border-zinc-200`

**Also standardize dark mode:** Change `dark:border-zinc-600` to `dark:border-zinc-700`

**Effort:** Low (2-3 hours)

### P2 (Medium) - Selectable Item Border Consistency

Standardize all selectable items to use `border-2` for selection emphasis:

1. `QualitySelectionModal.tsx:258` - Change `border` to `border-2`
2. `WeaponPurchaseModal.tsx:154` - Change `border` to `border-2`
3. `GearPurchaseModal.tsx:224` - Change `border` to `border-2`
4. `ArmorPurchaseModal.tsx:201` - Change `border` to `border-2`
5. `CyberdeckPurchaseModal.tsx:79` - Change `border` to `border-2`
6. `CommlinkPurchaseModal.tsx:74` - Change `border` to `border-2`

**Effort:** Low (1-2 hours)

### P3 (Low) - Create Shared Border Utilities

Consider creating Tailwind CSS custom classes or a shared utility:

```tsx
// lib/styles/borders.ts
export const borders = {
  container: "border border-zinc-200 dark:border-zinc-700",
  input: "border border-zinc-200 dark:border-zinc-700",
  inputHover: "hover:border-zinc-300 dark:hover:border-zinc-600",
  selectable: "border-2 border-zinc-200 dark:border-zinc-700",
  selectableHover: "hover:border-zinc-300 dark:hover:border-zinc-600",
  selected: (color: string) => `border-2 border-${color}-500`,
  empty: "border-2 border-dashed border-zinc-200 dark:border-zinc-700",
} as const;
```

**Effort:** Medium (4-6 hours including refactor)

---

## Summary

| Category                 | Status               | Action      |
| ------------------------ | -------------------- | ----------- |
| Card container borders   | ✅ Consistent        | None        |
| Inner section borders    | ✅ Mostly consistent | Minor fixes |
| Empty state borders      | ✅ Consistent        | None        |
| Form input borders       | ❌ Inconsistent      | **P1 Fix**  |
| Selectable item borders  | ⚠️ Mixed             | **P2 Fix**  |
| Contextual alert borders | ✅ Consistent        | None        |

**Total Estimated Effort:** 4-6 hours for P1+P2

---

## Related Documents

- `/docs/audit/purchase-card-compliance.md`
- `/docs/audit/selection-modal-compliance.md`
- `/docs/audit/shared-component-usage.md`
- `/docs/patterns/purchase-card-pattern.md`
- `/docs/patterns/selection-modal-pattern.md`
