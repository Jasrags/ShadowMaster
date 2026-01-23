# Stats, Configuration & Display Card Compliance Audit

Audit Date: 2026-01-22

---

## Executive Summary

| Pattern            | Components Audited | Compliant | Issues Found |
| ------------------ | ------------------ | --------- | ------------ |
| Stats Card         | 4                  | 2         | 8            |
| Configuration Card | 3                  | 3         | 2            |
| Display Card       | 3                  | 3         | 3            |

**Total Issues:** 13 (most are minor accessibility gaps)

---

## Stats Card Pattern Compliance

### Checklist Reference (13 items)

| #   | Requirement                                   |
| --- | --------------------------------------------- |
| 1   | Budget indicator(s) at top                    |
| 2   | Grouped sections with uppercase headers       |
| 3   | +/- controls with consistent sizing (h-6 w-6) |
| 4   | Emerald increase button, zinc decrease button |
| 5   | Value display with h-7 w-8                    |
| 6   | MAX badge when at maximum                     |
| 7   | Keyboard arrow key navigation                 |
| 8   | ARIA labels on all controls                   |
| 9   | aria-live on value displays                   |
| 10  | Dashed empty state for empty sections         |
| 11  | Summary footer with count/total               |
| 12  | Locked state when prerequisites not met       |
| 13  | Dark mode support                             |

---

### AttributesCard ✅ FULLY COMPLIANT

**File:** `/components/creation/AttributesCard.tsx`

| #   | Requirement                             | Status | Notes                                        |
| --- | --------------------------------------- | ------ | -------------------------------------------- |
| 1   | Budget indicator(s) at top              | ✅     | Dual BudgetIndicator (Attribute + Special)   |
| 2   | Grouped sections with uppercase headers | ✅     | Physical, Mental, Special sections           |
| 3   | +/- controls h-6 w-6                    | ✅     | Line 195, 216                                |
| 4   | Emerald/zinc button colors              | ✅     | Emerald increase, zinc decrease              |
| 5   | Value display h-7 w-8                   | ✅     | Line 204                                     |
| 6   | MAX badge                               | ✅     | Line 226-230                                 |
| 7   | Keyboard navigation                     | ✅     | ArrowLeft/Down/Right/Up handlers             |
| 8   | ARIA labels                             | ✅     | `aria-label={Decrease/Increase ${name}}`     |
| 9   | aria-live                               | ✅     | `aria-live="polite" aria-atomic="true"`      |
| 10  | Dashed empty state                      | ✅     | Locked state has dashed border               |
| 11  | Summary footer                          | ✅     | Shows metatype + priority info               |
| 12  | Locked state                            | ✅     | Two locked states (no priority, no metatype) |
| 13  | Dark mode                               | ✅     | Full dark mode classes                       |

**Score: 13/13**

---

### SkillsCard ⚠️ ACCESSIBILITY GAPS

**File:** `/components/creation/SkillsCard.tsx`

| #   | Requirement                             | Status | Notes                                         |
| --- | --------------------------------------- | ------ | --------------------------------------------- |
| 1   | Budget indicator(s) at top              | ✅     | Dual BudgetIndicator (Skill + Group)          |
| 2   | Grouped sections with uppercase headers | ✅     | "Skill Groups" + "Skills" sections            |
| 3   | +/- controls h-6 w-6                    | ✅     | SkillGroupCard uses h-6 w-6                   |
| 4   | Emerald/zinc button colors              | ⚠️     | Uses `bg-purple-500` for groups (intentional) |
| 5   | Value display h-7 w-8                   | ✅     | Line 135                                      |
| 6   | MAX badge                               | ✅     | Line 115-119                                  |
| 7   | Keyboard navigation                     | ❌     | **Missing in SkillGroupCard**                 |
| 8   | ARIA labels                             | ❌     | **Missing on +/- buttons**                    |
| 9   | aria-live                               | ❌     | **Missing on value display**                  |
| 10  | Dashed empty state                      | ✅     | Lines 936-939, 1004-1007                      |
| 11  | Summary footer                          | ✅     | Uses SummaryFooter component                  |
| 12  | Locked state                            | ✅     | Shows locked when no priority                 |
| 13  | Dark mode                               | ✅     | Full dark mode classes                        |

**Score: 10/13**

**Issues:**
| Priority | Issue | Fix Effort |
|----------|-------|------------|
| P1 | SkillGroupCard missing keyboard navigation | Low |
| P1 | SkillGroupCard +/- buttons missing aria-label | Low |
| P1 | SkillGroupCard value display missing aria-live | Low |
| P3 | Uses purple instead of emerald for + button | Document as variant |

---

### PrioritySelectionCard ⚠️ UNIQUE PATTERN

**File:** `/components/creation/PrioritySelectionCard.tsx`

This component uses drag-and-drop reordering instead of +/- controls. It's a **unique pattern** that doesn't fit the Stats Card checklist.

| #   | Requirement                | Status | Notes                     |
| --- | -------------------------- | ------ | ------------------------- |
| 1   | Budget indicator(s) at top | N/A    | Priorities have no budget |
| 2   | Grouped sections           | N/A    | Single list               |
| 3-6 | +/- controls               | N/A    | Uses drag-and-drop        |
| 7   | Keyboard navigation        | ✅     | ArrowUp/ArrowDown + Enter |
| 8   | ARIA labels                | ✅     | All buttons labeled       |
| 9   | aria-live                  | N/A    | No value to announce      |
| 10  | Empty state                | N/A    | Always shows 5 categories |
| 11  | Summary footer             | ❌     | No footer (has help text) |
| 12  | Locked state               | N/A    | Is the first step         |
| 13  | Dark mode                  | ✅     | Full dark mode classes    |

**Recommendation:** Document as "Priority Selection Card" variant in stats-card-pattern.md or create separate pattern.

---

### KnowledgeLanguagesCard ✅ COMPLIANT (via Stepper)

**File:** `/components/creation/knowledge-languages/KnowledgeLanguagesCard.tsx`

| #   | Requirement                             | Status | Notes                             |
| --- | --------------------------------------- | ------ | --------------------------------- |
| 1   | Budget indicator(s) at top              | ✅     | Knowledge Points budget           |
| 2   | Grouped sections with uppercase headers | ✅     | Languages + Knowledge Skills      |
| 3   | +/- controls h-6 w-6                    | ✅     | Via Stepper component             |
| 4   | Emerald/zinc button colors              | ✅     | Stepper uses emerald accent       |
| 5   | Value display h-7 w-8                   | ✅     | Via Stepper component             |
| 6   | MAX badge                               | ⚠️     | Stepper has showMaxBadge={false}  |
| 7   | Keyboard navigation                     | ✅     | Via Stepper component             |
| 8   | ARIA labels                             | ✅     | Via Stepper component             |
| 9   | aria-live                               | ✅     | Via Stepper component             |
| 10  | Dashed empty state                      | ✅     | Lines 242-245, 274-277            |
| 11  | Summary footer                          | ✅     | Uses SummaryFooter                |
| 12  | Locked state                            | ⚠️     | Shows message but not full locked |
| 13  | Dark mode                               | ✅     | Full dark mode classes            |

**Score: 11/13**

**Issues:**
| Priority | Issue | Fix Effort |
|----------|-------|------------|
| P3 | MAX badge disabled in LanguageRow | Low |
| P3 | Missing full locked state (shows help text only) | Low |

---

## Configuration Card Pattern Compliance

### Checklist Reference (12 items)

| #   | Requirement                                   |
| --- | --------------------------------------------- |
| 1   | Locked state when prerequisite not met        |
| 2   | Dashed border "Select" button when empty      |
| 3   | Colored border "Change" button when selected  |
| 4   | Selected option details with tree formatting  |
| 5   | Inline sub-configuration with expand/collapse |
| 6   | Budget indicator (if point-based)             |
| 7   | Edit and Remove buttons (if list-based)       |
| 8   | Dashed empty state for empty lists            |
| 9   | Summary footer with count/total               |
| 10  | Auto-collapse on valid (single selection)     |
| 11  | Validation status reflects completeness       |
| 12  | Dark mode support                             |

---

### MetatypeCard ✅ FULLY COMPLIANT

**File:** `/components/creation/metatype/MetatypeCard.tsx`

| #   | Requirement             | Status | Notes                                |
| --- | ----------------------- | ------ | ------------------------------------ |
| 1   | Locked state            | ✅     | Shows when no priority (lines 84-92) |
| 2   | Dashed "Select" button  | ✅     | Lines 174-184                        |
| 3   | Colored "Change" button | ✅     | Emerald border (lines 134-142)       |
| 4   | Tree formatting         | ✅     | Uses `└─` for traits (line 164)      |
| 5   | Inline sub-config       | N/A    | No sub-configuration                 |
| 6   | Budget indicator        | N/A    | No budget                            |
| 7   | Edit/Remove buttons     | N/A    | Single selection                     |
| 8   | Dashed empty state      | N/A    | Single selection                     |
| 9   | Summary footer          | N/A    | Single selection                     |
| 10  | Auto-collapse           | ✅     | `autoCollapseOnValid` prop           |
| 11  | Validation status       | ✅     | pending/warning/valid                |
| 12  | Dark mode               | ✅     | Full dark mode classes               |

**Score: 12/12 applicable**

---

### MagicPathCard ✅ FULLY COMPLIANT

**File:** `/components/creation/magic-path/MagicPathCard.tsx`

| #   | Requirement             | Status | Notes                                    |
| --- | ----------------------- | ------ | ---------------------------------------- |
| 1   | Locked state            | ✅     | Shows when no priority (lines 245-253)   |
| 2   | Dashed "Select" button  | ✅     | Lines 529-538                            |
| 3   | Colored "Change" button | ✅     | Purple/cyan/emerald variants             |
| 4   | Tree formatting         | ✅     | Uses `├─` and `└─` (lines 369-370)       |
| 5   | Inline sub-config       | ✅     | Tradition, Aspected Group, Mentor Spirit |
| 6   | Budget indicator        | N/A    | No budget                                |
| 7   | Edit/Remove buttons     | N/A    | Single selection                         |
| 8   | Dashed empty state      | N/A    | Single selection                         |
| 9   | Summary footer          | N/A    | Single selection                         |
| 10  | Auto-collapse           | ❌     | Missing autoCollapseOnValid              |
| 11  | Validation status       | ✅     | pending/warning/valid                    |
| 12  | Dark mode               | ✅     | Full dark mode classes                   |

**Score: 11/12 applicable**

**Issues:**
| Priority | Issue | Fix Effort |
|----------|-------|------------|
| P3 | Missing autoCollapseOnValid prop | Low |

---

### ContactsCard ✅ FULLY COMPLIANT

**File:** `/components/creation/contacts/ContactsCard.tsx`

| #   | Requirement             | Status | Notes                       |
| --- | ----------------------- | ------ | --------------------------- |
| 1   | Locked state            | N/A    | No prerequisites            |
| 2   | Dashed "Select" button  | N/A    | List-based                  |
| 3   | Colored "Change" button | N/A    | List-based                  |
| 4   | Tree formatting         | N/A    | List-based                  |
| 5   | Inline sub-config       | N/A    | Uses modal                  |
| 6   | Budget indicator        | ✅     | Contact Points progress bar |
| 7   | Edit/Remove buttons     | ✅     | Lines 336-351               |
| 8   | Dashed empty state      | ✅     | Lines 360-363               |
| 9   | Summary footer          | ✅     | Uses SummaryFooter          |
| 10  | Auto-collapse           | N/A    | List-based                  |
| 11  | Validation status       | ✅     | pending/valid               |
| 12  | Dark mode               | ✅     | Full dark mode classes      |

**Score: 12/12 applicable**

---

## Display Card Pattern Compliance

### Checklist Reference (12 items)

| #   | Requirement                                 |
| --- | ------------------------------------------- |
| 1   | Text inputs have consistent styling         |
| 2   | Labels show required/optional indicators    |
| 3   | Textareas have appropriate row counts       |
| 4   | Word counts displayed for long text fields  |
| 5   | Stat blocks use consistent sizing           |
| 6   | Section headers have icons                  |
| 7   | Grid layouts appropriate for content        |
| 8   | Tooltips on computed values                 |
| 9   | Augmentation effects visually indicated     |
| 10  | Description shows key info or pending state |
| 11  | Validation status reflects completion       |
| 12  | Dark mode support                           |

---

### CharacterInfoCard ✅ FULLY COMPLIANT

**File:** `/components/creation/CharacterInfoCard.tsx`

| #   | Requirement                  | Status | Notes                             |
| --- | ---------------------------- | ------ | --------------------------------- |
| 1   | Consistent input styling     | ✅     | All inputs share same classes     |
| 2   | Required/optional indicators | ✅     | "(Required)" / "(Optional)" spans |
| 3   | Appropriate row counts       | ✅     | description=2, background=3       |
| 4   | Word counts                  | ✅     | Lines 119-131                     |
| 5-9 | Stat blocks                  | N/A    | Text input form                   |
| 10  | Description shows key info   | ✅     | Shows name or "Name your runner"  |
| 11  | Validation status            | ✅     | pending/warning/valid             |
| 12  | Dark mode                    | ✅     | Full dark mode classes            |

**Score: 12/12 applicable**

---

### DerivedStatsCard ✅ FULLY COMPLIANT

**File:** `/components/creation/DerivedStatsCard.tsx`

| #   | Requirement                    | Status | Notes                                      |
| --- | ------------------------------ | ------ | ------------------------------------------ |
| 1-4 | Text inputs                    | N/A    | Computed display                           |
| 5   | Stat blocks consistent sizing  | ✅     | StatBlock component                        |
| 6   | Section headers have icons     | ✅     | Activity, Shield, Heart, Brain, Footprints |
| 7   | Grid layouts appropriate       | ✅     | cols-1, cols-2, cols-3 as needed           |
| 8   | Tooltips on computed values    | ✅     | All StatBlocks have tooltip prop           |
| 9   | Augmentation effects indicated | ✅     | Ring indicator + Essence panel             |
| 10  | Description shows key info     | ✅     | Shows Initiative + Limits or pending       |
| 11  | Validation status              | ✅     | pending/valid                              |
| 12  | Dark mode                      | ✅     | Full dark mode classes                     |

**Score: 12/12 applicable**

---

### EditionSelector ⚠️ FLOW STEP VARIANT

**File:** `/components/creation/EditionSelector.tsx`

This is a **flow step** component, not a card. It doesn't use CreationCard wrapper.

| #   | Requirement                | Status | Notes                       |
| --- | -------------------------- | ------ | --------------------------- |
| 1-4 | Text inputs                | N/A    | Selection grid              |
| 5   | Consistent sizing          | ✅     | Cards have same structure   |
| 6   | Section headers            | N/A    | Has title text instead      |
| 7   | Grid layouts               | ✅     | `grid gap-4 sm:grid-cols-2` |
| 8   | Tooltips                   | N/A    | Not computed values         |
| 9   | Augmentation effects       | N/A    | Not applicable              |
| 10  | Description shows key info | ✅     | Card descriptions present   |
| 11  | Validation status          | N/A    | No validation               |
| 12  | Dark mode                  | ✅     | Full dark mode classes      |

**Issues:**
| Priority | Issue | Fix Effort |
|----------|-------|------------|
| P3 | CSS class formatting issues (extra spaces) | Low |

**Note:** Lines 72, 89, 100 have malformed class strings like `inline - flex` instead of `inline-flex`.

---

## Prioritized Remediation Summary

### P1 (High) - Should Fix

| Component                 | Issue                         | Fix Effort |
| ------------------------- | ----------------------------- | ---------- |
| SkillsCard/SkillGroupCard | Missing keyboard navigation   | Low        |
| SkillsCard/SkillGroupCard | Missing aria-label on buttons | Low        |
| SkillsCard/SkillGroupCard | Missing aria-live on value    | Low        |

### P3 (Low) - Minor

| Component              | Issue                             | Fix Effort    |
| ---------------------- | --------------------------------- | ------------- |
| SkillsCard             | Document purple accent as variant | Documentation |
| KnowledgeLanguagesCard | MAX badge disabled                | Low           |
| KnowledgeLanguagesCard | Missing full locked state         | Low           |
| MagicPathCard          | Missing autoCollapseOnValid       | Low           |
| EditionSelector        | CSS class formatting issues       | Low           |
| PrioritySelectionCard  | Document as unique pattern        | Documentation |

---

## Documentation Recommendations

### 1. Add Stats Card Pattern Variants

In `/docs/patterns/stats-card-pattern.md`, add:

**Variant: Skill-Based Stats Card**

- Uses category-specific accent colors (purple for skill groups) instead of universal emerald
- Rationale: Visual distinction between attribute allocation and skill allocation

**Variant: Priority Selection Card**

- Uses drag-and-drop reordering instead of +/- controls
- Unique UI pattern for assigning priorities

### 2. Add Configuration Card Pattern Note

In `/docs/patterns/configuration-card-pattern.md`:

**Variant: Inline Sub-Configuration**

- MagicPathCard demonstrates inline expand/collapse pattern for Tradition, Aspected Group, and Mentor Spirit selection
- Pattern includes optional karma-cost badges for qualities like Mentor Spirit

---

## Success Metrics

| Metric                        | Before | Current | Target          |
| ----------------------------- | ------ | ------- | --------------- |
| Stats Cards Compliant         | 4      | 2       | 4               |
| Configuration Cards Compliant | 3      | 3       | 3               |
| Display Cards Compliant       | 3      | 3       | 3               |
| P1 Accessibility Issues       | 3      | 3       | 0               |
| P3 Minor Issues               | 6      | 6       | 0 or documented |

---

## Related Documents

- `/docs/patterns/stats-card-pattern.md` - Stats card requirements
- `/docs/patterns/configuration-card-pattern.md` - Configuration card requirements
- `/docs/patterns/display-card-pattern.md` - Display card requirements
- `/docs/audit/purchase-card-compliance.md` - Purchase card audit
- `/docs/audit/selection-modal-compliance.md` - Selection modal audit
