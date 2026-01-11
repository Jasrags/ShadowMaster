# Bug Report Template

## (Tailored for Game/Character Management Applications)

## Basic Information

**Title:** Nuyen Remaining Calculation Does Not Aggregate Spending Across All Purchase Categories
**Severity:** High
**Priority:** P1
**Reported By:** [User]
**Date:** 2025-01-27
**Environment:** Development
**Edition:** SR5 (likely affects all editions)
**Character Creation Method:** Priority

---

## Description

**What happened?**
The "Remaining Nuyen" calculation in character creation does not properly aggregate nuyen spending across all purchase categories. Each step (Gear, Augmentations) calculates remaining nuyen independently, only accounting for spending within that step, not across all steps.

**What did you expect to happen?**
The remaining nuyen should be calculated as: `Total Available Nuyen - (Gear Spending + Augmentation Spending + Lifestyle Spending + Any Other Cash Purchases)`. All spending should be aggregated across all creation steps.

**What actually happened?**

- In the Gear step, remaining nuyen only accounts for gear purchases and lifestyle, ignoring augmentation spending
- In the Augmentations step, remaining nuyen attempts to read gear spending from `state.budgets?.["nuyen-spent-gear"]`, but this value is never actually saved to state by the Gear step
- Users can overspend their nuyen budget because neither step has a complete picture of total spending
- Example scenario: Total available 6,000¥, spent 4,000¥ in augmentations, 3,900¥ in gear = 7,900¥ total spending (exceeds budget by 1,900¥), but the system does not prevent or warn about this

**Game Rules Reference:**

- Edition: SR5
- Rulebook: Core Rulebook
- Page/Section: p. 94, Character Creation - Spending your Nuyen
- Expected rule: "You have a single nuyen budget from your Resources Priority that must cover all purchases: gear, augmentations, lifestyle, and any other cash purchases during character creation."

---

## Steps to Reproduce

1. Start character creation in SR5 edition
2. Select Priority creation method
3. Assign Resources Priority that provides 6,000¥ (or any amount)
4. Navigate to Augmentations step
5. Purchase augmentations totaling 4,000¥
6. Navigate to Gear step
7. Purchase gear totaling 3,900¥ (or any amount that when combined with augmentation spending exceeds available nuyen)
8. Observe that the Gear step shows remaining nuyen calculated only from gear spending, not including augmentation spending
9. Navigate back to Augmentations step
10. Observe that Augmentations step may show incorrect remaining nuyen because gear spending is not properly saved to state

**Reproducibility:** Always - 100% of the time

**Character Data:**

- Resources Priority provides: 6,000¥
- Augmentation purchases: 4,000¥
- Gear purchases: 3,900¥
- Expected remaining: 6,000 - 4,000 - 3,900 = -1,900¥ (should show negative/error)
- Actual remaining in Gear step: 6,000 - 3,900 = 2,100¥ (incorrect, ignores augmentation spending)

---

## Environment Details

**Browser/Platform:**

- Browser: Any modern browser
- OS: Any OS
- Device: Desktop

**Application Version:**

- Version: Current development build
- Build: [Current commit]

**Game Configuration:**

- Edition: SR5
- Creation Method: Priority
- Books/Modules Loaded: Core Rulebook
- House Rules: None

---

## Error Details

**Error Message:**
No error message displayed - the bug manifests as incorrect calculation display and lack of validation.

**Console Errors:**
No console errors observed.

**Calculation Errors:**

- **GearStep.tsx (line 95-100):** Calculates `totalSpent = gearSpent + lifestyleCost` but does not include augmentation spending
  - Expected: `totalSpent = gearSpent + lifestyleCost + augmentationSpent`
  - Actual: `totalSpent = gearSpent + lifestyleCost`
- **AugmentationsStep.tsx (line 131-136):** Attempts to read gear spending from `state.budgets?.["nuyen-spent-gear"]`, but this value is never saved to state by GearStep
  - Expected: GearStep should save `nuyen-spent-gear` to state when gear is updated
  - Actual: GearStep calculates gear spending locally but never persists it

- **State Budget Tracking:** The system uses separate budget keys (`nuyen-spent-gear`, `nuyen-spent-augmentations`) but they are not consistently updated or aggregated

**Validation Errors:**

- Character creation validation does not prevent overspending nuyen across steps
- Users can create characters with negative effective nuyen remaining

**Network Errors:**
N/A

**Stack Trace:**
N/A - No runtime errors, only calculation logic errors

---

## Game Rules Impact

**Rule Violation:**
This violates the fundamental character creation rule that all nuyen spending must stay within the Resources Priority budget. Characters can be created with more equipment than their budget allows, breaking game balance and character creation constraints.

**Correct Behavior:**

1. All nuyen spending should be aggregated across all creation steps
2. Remaining nuyen should be calculated as: `Total Budget - (All Purchases)`
3. The system should prevent purchases that would exceed the remaining budget
4. Visual warnings/errors should be shown when total spending exceeds available nuyen
5. Character creation should be blocked if nuyen budget is exceeded

**Affected Game Mechanics:**

- Character creation budget validation
- Nuyen tracking during character creation
- Financial constraint enforcement
- Character balance (characters can have more equipment than rules allow)

---

## Visual Evidence

**Screenshots:**

- [Screenshot of Gear step showing incorrect remaining nuyen that doesn't account for augmentation spending]
- [Screenshot of Augmentations step showing remaining nuyen that doesn't account for gear spending]
- [Screenshot showing both steps with overspending scenario]

**Screen Recording:**

- [Link to video demonstrating the bug if available]

**Before/After:**

- **Expected:** Remaining nuyen = 6,000¥ - 4,000¥ (augmentations) - 3,900¥ (gear) = -1,900¥ (with error/warning)
- **Actual Gear Step:** Remaining nuyen = 6,000¥ - 3,900¥ = 2,100¥ (incorrect)
- **Actual Augmentations Step:** Remaining nuyen = 6,000¥ - 4,000¥ = 2,000¥ (incorrect, or may show error if gear spending lookup fails)

**Character Data:**

```json
{
  "edition": "SR5",
  "creationMethod": "priority",
  "budgets": {
    "nuyen": 6000,
    "nuyen-spent-gear": null,
    "nuyen-spent-augmentations": 4000
  },
  "selections": {
    "gear": [
      {
        "name": "Example Item",
        "cost": 3900,
        "quantity": 1
      }
    ],
    "augmentations": [
      {
        "name": "Example Augmentation",
        "cost": 4000
      }
    ]
  }
}
```

---

## Impact

**User Impact:**

- All users creating characters are affected
- Users can accidentally create illegal characters that exceed their nuyen budget
- Confusing user experience - different steps show different remaining nuyen values
- No clear warning when overspending occurs
- Users must manually track total spending across steps

**Game Impact:**

- Creates illegal characters that violate Resources Priority constraints
- Breaks game balance - characters can have more equipment than intended
- Financial constraint rules are not enforced
- Characters created with this bug would not be legal in actual play

**Affected Features:**

- Character creation wizard (Gear step, Augmentations step)
- Nuyen budget tracking
- Budget validation
- Character creation validation
- Financial constraint enforcement

**Data Integrity:**

- Existing characters created before fix may have invalid nuyen balances
- Characters saved during creation may have incorrect `nuyenRemaining` values
- Draft characters in localStorage may have inconsistent budget tracking

---

## Additional Context

**Related Issues:**

- May be related to budget tracking implementation across multiple steps
- Related to shopping cart sidebar relocation feature (recent changes)

**Recent Changes:**

- Shopping cart sidebar relocation work may have affected budget tracking
- Files modified: `CreationWizard.tsx`, `ValidationPanel.tsx`, `AugmentationsStep.tsx`, `GearStep.tsx`

**Known Workarounds:**

- Manually track total spending using external calculator
- Avoid spending in multiple categories to stay within budget
- Complete all purchases in a single step to see accurate remaining balance

**Community Reports:**

- None at this time

**Ruleset Information:**

- Ruleset version: Current SR5 ruleset
- Book/module versions: Core Rulebook

---

## Proposed Solution (Optional)

**Suggested Fix:**

1. **Centralize Nuyen Tracking in CreationWizard:**
   - Create a single source of truth for total nuyen spending
   - Calculate total spending across all categories: `gear + augmentations + lifestyle + other`
   - Update this calculation whenever any purchase is made

2. **Update GearStep.tsx:**
   - Save gear spending to state: `updateState({ budgets: { ...state.budgets, "nuyen-spent-gear": gearSpent } })`
   - Calculate remaining nuyen using aggregated total: `remaining = totalNuyen - (gearSpent + augmentationSpent + lifestyleCost)`
   - Read augmentation spending from state: `state.budgets?.["nuyen-spent-augmentations"] || 0`

3. **Update AugmentationsStep.tsx:**
   - Save augmentation spending to state when selections change
   - Read gear spending from state (after GearStep is fixed to save it)
   - Calculate remaining nuyen using aggregated total

4. **Add Validation:**
   - Prevent purchases that would exceed remaining budget
   - Show visual warnings when budget is exceeded
   - Block character creation completion if nuyen budget is negative

5. **Update Budget Value Propagation:**
   - Ensure `CreationWizard` passes consistent budget state to all steps
   - Use a single budget calculation function shared across steps

**Technical Approach:**

- Modify `GearStep.tsx` to persist `nuyen-spent-gear` to state in `updateState` calls
- Modify `AugmentationsStep.tsx` to persist `nuyen-spent-augmentations` to state
- Create helper function in `CreationWizard.tsx` to calculate total nuyen spent across all categories
- Pass aggregated totals as `budgetValues` or calculate in each step from state
- Update validation logic to check total spending

**Rule reference for correct implementation:**

- SR5 Core Rulebook, p. 94: "Spending your Nuyen" - All purchases during character creation must come from the single Resources Priority budget.

**Test Cases:**

1. Purchase augmentations (4,000¥) then gear (3,900¥) with 6,000¥ budget - should show negative remaining and prevent completion
2. Purchase gear (2,000¥) then augmentations (2,500¥) with 6,000¥ budget - should show 1,500¥ remaining correctly
3. Purchase augmentations, then remove some - verify remaining nuyen updates correctly
4. Navigate between Gear and Augmentations steps - verify remaining nuyen is consistent
5. Complete character creation with valid nuyen spending - should succeed
6. Attempt to complete character creation with overspending - should be blocked with error message
7. Test with karma-to-nuyen conversion - verify converted nuyen is included in total budget
8. Test lifestyle purchases - verify lifestyle cost is included in total spending calculation
