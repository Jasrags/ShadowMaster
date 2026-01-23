# Purchase Card Pattern Compliance Audit

Audit Date: 2026-01-22
Reference Pattern: `/docs/patterns/purchase-card-pattern.md`

## Summary

| Status           | Count |
| ---------------- | ----- |
| ✅ Compliant     | 6     |
| ⚠️ Partial       | 2     |
| ❌ Non-Compliant | 2     |

## Compliance Matrix

### Legend

- ✅ Pass - Meets requirement
- ⚠️ Partial - Partially meets requirement
- ❌ Fail - Does not meet requirement
- N/A - Not applicable to this component

### Checklist Items

1. Budget bar at top with progress indicator
2. Category section header pattern used
3. Add button uses amber styling (`bg-amber-500`)
4. Add button is compact (`px-2 py-1 text-xs`)
5. Add button positioned in header (right-aligned)
6. Empty state uses dashed border box
7. Empty state text is descriptive ("No X purchased/selected")
8. No full-width dashed buttons for add actions
9. Item rows have consistent remove button
10. Footer shows count and total
11. All elements have dark mode support

---

## Component Audit Results

### 1. MatrixGearCard ✅ COMPLIANT (Reference Implementation)

**Path:** `/components/creation/matrix-gear/MatrixGearCard.tsx`
**Budget Type:** Nuyen

| #   | Requirement             | Status | Notes                     |
| --- | ----------------------- | ------ | ------------------------- |
| 1   | Budget bar at top       | ✅     | Uses BudgetIndicator      |
| 2   | Category section header | ✅     | CategorySection component |
| 3   | Amber add button        | ✅     | `bg-amber-500`            |
| 4   | Compact button          | ✅     | `px-2 py-1 text-xs`       |
| 5   | Header position         | ✅     | Right-aligned in header   |
| 6   | Dashed empty state      | ✅     | `border-2 border-dashed`  |
| 7   | Descriptive text        | ✅     | "No {items} purchased"    |
| 8   | No full-width dashed    | ✅     | No violations             |
| 9   | Remove button           | ✅     | Consistent X icon         |
| 10  | Footer summary          | ✅     | Count and total           |
| 11  | Dark mode               | ✅     | Full support              |

**Status:** Reference implementation - all items pass

---

### 2. WeaponsPanel ✅ COMPLIANT

**Path:** `/components/creation/WeaponsPanel.tsx`
**Budget Type:** Nuyen

| #   | Requirement             | Status | Notes                           |
| --- | ----------------------- | ------ | ------------------------------- |
| 1   | Budget bar at top       | ✅     | Inline budget display           |
| 2   | Category section header | ✅     | WeaponCategorySection component |
| 3   | Amber add button        | ✅     | `bg-amber-500`                  |
| 4   | Compact button          | ✅     | `px-2 py-1 text-xs`             |
| 5   | Header position         | ✅     | Right-aligned                   |
| 6   | Dashed empty state      | ✅     | `border-2 border-dashed`        |
| 7   | Descriptive text        | ✅     | "No weapons purchased"          |
| 8   | No full-width dashed    | ✅     | No violations                   |
| 9   | Remove button           | ✅     | Via WeaponRow                   |
| 10  | Footer summary          | ✅     | Shows count and total           |
| 11  | Dark mode               | ✅     | Full support                    |

**Status:** Fully compliant with pattern

---

### 3. ArmorPanel ⚠️ PARTIAL COMPLIANCE

**Path:** `/components/creation/armor/ArmorPanel.tsx`
**Budget Type:** Nuyen

| #   | Requirement             | Status | Notes                                                 |
| --- | ----------------------- | ------ | ----------------------------------------------------- |
| 1   | Budget bar at top       | ❌     | No BudgetIndicator, relies on shared nuyen context    |
| 2   | Category section header | ⚠️     | No category header - uses `headerAction` prop instead |
| 3   | Amber add button        | ✅     | `bg-amber-500`                                        |
| 4   | Compact button          | ⚠️     | `px-3 py-1.5` (slightly larger than spec)             |
| 5   | Header position         | ⚠️     | Via `headerAction` prop, not in-card                  |
| 6   | Dashed empty state      | ✅     | `border-2 border-dashed`                              |
| 7   | Descriptive text        | ✅     | "No armor purchased"                                  |
| 8   | No full-width dashed    | ✅     | No violations                                         |
| 9   | Remove button           | ✅     | Via ArmorRow                                          |
| 10  | Footer summary          | ✅     | Shows count and total                                 |
| 11  | Dark mode               | ✅     | Full support                                          |

**Issues:**

- P2: Missing budget bar at top
- P3: Uses `headerAction` prop instead of in-card category section
- P3: Button padding slightly larger (`px-3 py-1.5` vs `px-2 py-1`)

---

### 4. GearPanel ⚠️ PARTIAL COMPLIANCE

**Path:** `/components/creation/gear/GearPanel.tsx`
**Budget Type:** Nuyen

| #   | Requirement             | Status | Notes                                         |
| --- | ----------------------- | ------ | --------------------------------------------- |
| 1   | Budget bar at top       | ❌     | No BudgetIndicator                            |
| 2   | Category section header | ⚠️     | No category header - uses `headerAction` prop |
| 3   | Amber add button        | ✅     | `bg-amber-500`                                |
| 4   | Compact button          | ⚠️     | `px-3 py-1.5` (slightly larger)               |
| 5   | Header position         | ⚠️     | Via `headerAction` prop                       |
| 6   | Dashed empty state      | ✅     | `border-2 border-dashed`                      |
| 7   | Descriptive text        | ✅     | "No gear purchased"                           |
| 8   | No full-width dashed    | ✅     | No violations                                 |
| 9   | Remove button           | ✅     | Via GearRow                                   |
| 10  | Footer summary          | ✅     | Shows count and total                         |
| 11  | Dark mode               | ✅     | Full support                                  |

**Issues:**

- P2: Missing budget bar at top
- P3: Uses `headerAction` prop instead of in-card category section
- P3: Button padding slightly larger

---

### 5. VehiclesCard ✅ COMPLIANT

**Path:** `/components/creation/VehiclesCard.tsx`
**Budget Type:** Nuyen

| #   | Requirement             | Status | Notes                                            |
| --- | ----------------------- | ------ | ------------------------------------------------ |
| 1   | Budget bar at top       | ✅     | Inline nuyen bar with progress                   |
| 2   | Category section header | ✅     | Four sections: Vehicles, Drones, RCCs, Autosofts |
| 3   | Amber add button        | ✅     | `bg-amber-500`                                   |
| 4   | Compact button          | ✅     | `px-2 py-1 text-xs`                              |
| 5   | Header position         | ✅     | Right-aligned in each section                    |
| 6   | Dashed empty state      | ✅     | Per-section dashed empty states                  |
| 7   | Descriptive text        | ✅     | "No {category} purchased"                        |
| 8   | No full-width dashed    | ✅     | No violations                                    |
| 9   | Remove button           | ✅     | Consistent X icon per item                       |
| 10  | Footer summary          | ✅     | Shows breakdown and total                        |
| 11  | Dark mode               | ✅     | Full support                                     |

**Status:** Fully compliant - good multi-category example

---

### 6. AugmentationsCard ✅ COMPLIANT

**Path:** `/components/creation/AugmentationsCard.tsx`
**Budget Type:** Nuyen + Essence

| #   | Requirement             | Status | Notes                                |
| --- | ----------------------- | ------ | ------------------------------------ |
| 1   | Budget bar at top       | ✅     | Essence bar with magic loss warnings |
| 2   | Category section header | ✅     | Cyberware and Bioware sections       |
| 3   | Amber add button        | ✅     | `bg-amber-500` for both sections     |
| 4   | Compact button          | ✅     | `px-2 py-1 text-xs`                  |
| 5   | Header position         | ✅     | Right-aligned                        |
| 6   | Dashed empty state      | ✅     | Per-section empty states             |
| 7   | Descriptive text        | ✅     | "No cyberware/bioware installed"     |
| 8   | No full-width dashed    | ✅     | No violations                        |
| 9   | Remove button           | ✅     | Via AugmentationItem                 |
| 10  | Footer summary          | ✅     | Shows breakdown and total cost       |
| 11  | Dark mode               | ✅     | Full support                         |

**Status:** Fully compliant with dual-category pattern

---

### 7. SpellsCard ✅ COMPLIANT

**Path:** `/components/creation/SpellsCard.tsx`
**Budget Type:** Free Spells + Karma

| #   | Requirement             | Status | Notes                                |
| --- | ----------------------- | ------ | ------------------------------------ |
| 1   | Budget bar at top       | ✅     | BudgetIndicator for free spells      |
| 2   | Category section header | ✅     | "Spells" section with icon and count |
| 3   | Amber add button        | ✅     | `bg-amber-500`                       |
| 4   | Compact button          | ✅     | `px-2 py-1 text-xs`                  |
| 5   | Header position         | ✅     | Right-aligned                        |
| 6   | Dashed empty state      | ✅     | `border-2 border-dashed`             |
| 7   | Descriptive text        | ✅     | "No spells selected"                 |
| 8   | No full-width dashed    | ✅     | No violations                        |
| 9   | Remove button           | ✅     | Via SpellRow                         |
| 10  | Footer summary          | ✅     | Shows count and karma status         |
| 11  | Dark mode               | ✅     | Full support                         |

**Status:** Fully compliant (recently updated in commit e521adf)

---

### 8. FociCard ✅ COMPLIANT

**Path:** `/components/creation/foci/FociCard.tsx`
**Budget Type:** Nuyen + Bonding Karma

| #   | Requirement             | Status | Notes                                     |
| --- | ----------------------- | ------ | ----------------------------------------- |
| 1   | Budget bar at top       | ⚠️     | Has karma summary but not BudgetIndicator |
| 2   | Category section header | ✅     | "Foci" section with icon and count        |
| 3   | Amber add button        | ✅     | `bg-amber-500`                            |
| 4   | Compact button          | ✅     | `px-2 py-1 text-xs`                       |
| 5   | Header position         | ✅     | Right-aligned                             |
| 6   | Dashed empty state      | ✅     | `border-2 border-dashed`                  |
| 7   | Descriptive text        | ✅     | "No foci purchased"                       |
| 8   | No full-width dashed    | ✅     | No violations                             |
| 9   | Remove button           | ✅     | Via FocusItem                             |
| 10  | Footer summary          | ✅     | Shows total cost                          |
| 11  | Dark mode               | ✅     | Full support                              |

**Status:** Compliant (recently updated in commit f7f6578)

---

### 9. AdeptPowersCard ❌ NON-COMPLIANT

**Path:** `/components/creation/AdeptPowersCard.tsx`
**Budget Type:** Power Points

| #   | Requirement             | Status | Notes                                        |
| --- | ----------------------- | ------ | -------------------------------------------- |
| 1   | Budget bar at top       | ✅     | BudgetIndicator for power points             |
| 2   | Category section header | ❌     | No category header pattern                   |
| 3   | Amber add button        | ❌     | Uses violet dashed button                    |
| 4   | Compact button          | ❌     | Full-width `py-3`                            |
| 5   | Header position         | ❌     | Not in header - inline full-width            |
| 6   | Dashed empty state      | ❌     | Add button IS the empty state (anti-pattern) |
| 7   | Descriptive text        | N/A    | No separate empty state                      |
| 8   | No full-width dashed    | ❌     | **EXPLICIT ANTI-PATTERN** (line 520-526)     |
| 9   | Remove button           | ✅     | "Remove" text button                         |
| 10  | Footer summary          | ✅     | Shows PP spent/remaining                     |
| 11  | Dark mode               | ✅     | Full support                                 |

**Critical Issue (P0):**

```tsx
// Line 520-526 - Full-width dashed add button
<button
  onClick={() => setShowAddModal(true)}
  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 py-3 text-sm font-medium text-zinc-600..."
>
  <Plus className="h-4 w-4" />
  Add Adept Power
</button>
```

**Status:** Requires remediation - uses explicit anti-pattern

---

### 10. ComplexFormsCard ❌ NON-COMPLIANT

**Path:** `/components/creation/ComplexFormsCard.tsx`
**Budget Type:** Free Forms + Karma

| #   | Requirement             | Status | Notes                                     |
| --- | ----------------------- | ------ | ----------------------------------------- |
| 1   | Budget bar at top       | ✅     | BudgetIndicator for free forms            |
| 2   | Category section header | ❌     | No category header                        |
| 3   | Amber add button        | ❌     | No add button - inline checkbox selection |
| 4   | Compact button          | N/A    | No add button                             |
| 5   | Header position         | N/A    | No add button                             |
| 6   | Dashed empty state      | ✅     | Has locked state for non-technomancer     |
| 7   | Descriptive text        | N/A    | Uses inline selection, not modal          |
| 8   | No full-width dashed    | ✅     | No violations                             |
| 9   | Remove button           | ✅     | X icon on selected form chips             |
| 10  | Footer summary          | ⚠️     | Shows selected forms list, no total       |
| 11  | Dark mode               | ✅     | Full support                              |

**Note:** This component uses an **inline selection pattern** rather than the modal-based purchase card pattern. It may be intentional design choice given the typically small number of complex forms.

**Consider:** Reclassifying as "Selection Card Pattern" rather than "Purchase Card Pattern"

---

## Priority Summary

### P0 (Critical) - Must Fix

| Component       | Issue                                                | Line Reference |
| --------------- | ---------------------------------------------------- | -------------- |
| AdeptPowersCard | Full-width dashed add button (explicit anti-pattern) | 520-526        |

### P1 (High) - Should Fix

| Component       | Issue                           | Effort |
| --------------- | ------------------------------- | ------ |
| AdeptPowersCard | Missing category section header | Medium |
| AdeptPowersCard | Missing amber button styling    | Low    |

### P2 (Medium) - Nice to Have

| Component  | Issue                     | Effort |
| ---------- | ------------------------- | ------ |
| ArmorPanel | Missing budget bar at top | Low    |
| GearPanel  | Missing budget bar at top | Low    |

### P3 (Low) - Minor Inconsistencies

| Component  | Issue                                         | Effort |
| ---------- | --------------------------------------------- | ------ |
| ArmorPanel | Uses `headerAction` instead of in-card header | Medium |
| GearPanel  | Uses `headerAction` instead of in-card header | Medium |
| ArmorPanel | Button padding `px-3` instead of `px-2`       | Low    |
| GearPanel  | Button padding `px-3` instead of `px-2`       | Low    |

---

## Recommendations

### Immediate Actions (P0/P1)

1. **Refactor AdeptPowersCard** to use category section header pattern with amber add button
2. Remove full-width dashed add button anti-pattern

### Short-term (P2)

1. Consider adding BudgetIndicator to ArmorPanel and GearPanel
2. These panels share nuyen budget, so individual budget bars may be intentionally omitted

### Design Decision Needed

1. **ComplexFormsCard**: Confirm whether inline selection is intentional or should switch to modal pattern
2. **ArmorPanel/GearPanel**: Decide if `headerAction` approach is acceptable deviation

---

## Appendix: Pattern Reference

### Correct Add Button

```tsx
<button
  onClick={() => setIsModalOpen(true)}
  className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
>
  <Plus className="h-3 w-3" />
  Add
</button>
```

### Correct Empty State

```tsx
<div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
  <p className="text-xs text-zinc-400 dark:text-zinc-500">No {items} purchased</p>
</div>
```

### Correct Category Section Header

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-{color}-500" />
    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      {Title}
    </span>
    {count > 0 && (
      <span className="rounded-full bg-{color}-100 px-1.5 py-0.5 text-[10px] font-medium text-{color}-700 dark:bg-{color}-900/40 dark:text-{color}-400">
        {count}
      </span>
    )}
  </div>
  {/* Add button here */}
</button>
```
