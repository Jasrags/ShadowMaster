<!-- 13411a0f-1583-4303-acb3-273bd92f1406 f20bbd04-8ee2-47f8-bda5-51cc42580701 -->
# Reorder Character Creation Wizard Steps

## Overview

The character creation wizard currently doesn't follow the recommended order documented in `docs/rules/5e/character-creation.md`. This plan reorganizes the steps to match the documented workflow.

## Current vs Recommended Order

**Current Order:**

1. Concept
2. Metatype & Attributes (combined)
3. Magic/Resonance
4. Qualities
5. Skills
6. Resources
7. Karma Spending
8. Final Calculations
9. Final Touches

**Recommended Order (from docs):**

1. Concept (keep as intro step)
2. **Magic or Resonance Priority** ← Currently Step 3
3. **Positive and Negative Qualities** ← Currently Step 4
4. **Metatype Priority** (includes Special Attribute Points)
5. **Attributes Priority** (can remain combined with Metatype)
6. Skills Priority
7. Resources Priority
8. Spend Leftover Karma
9. Final Calculations
10. Final Touches

## Key Dependencies

- **Qualities must come early** - They can change maximum Attribute and Skill levels, so must be selected before allocating attributes/skills
- **Magic/Resonance Priority must be first** - Records starting Magic/Resonance value before Special Attribute Points allocation
- **Special Attribute Points** - Allocated in Metatype step, but Magic/Resonance starting value comes from Priority step

## Implementation Tasks

### 1. Update Step Order in CharacterCreationWizard.tsx

- **File:** `web/ui/src/components/character/CharacterCreationWizard.tsx`
- Reorder step numbers and stepNames array
- Update renderStep() switch statement
- Ensure step validation logic reflects new order

### 2. Update Step Component Imports

- Reorder imports to match new step sequence
- Verify all step components remain functional after reordering

### 3. Adjust Step Dependencies

- **Step 2 (Magic/Resonance):** Should work with Priority selection but not require Metatype yet
- **Step 3 (Qualities):** May need to reference Magic/Resonance choice for filtering (e.g., Qualities that require Magic)
- **Step 4 (Metatype):** May reference Qualities if any affect metatype selection (verify this)
- **Step 5 (Attributes):** Must account for Qualities that affect attribute maximums
- **Step 6 (Skills):** Must account for Qualities that affect skill maximums (e.g., Aptitude)

### 4. Update Validation Logic

- Adjust `validateStep()` function to reflect new step dependencies
- Ensure Step 2 (Magic/Resonance) can validate without Metatype selected
- Ensure Step 3 (Qualities) validates correctly with Magic/Resonance selected

### 5. Update UI Text and Guidance

- Update step titles and descriptions in CharacterCreationWizard.tsx
- Ensure step transition messages are appropriate for new order
- Update any inline help text that references step order

### 6. Verify Priority Selection Flow

- Priority selection should still happen early (in Step 1 or integrated into Step 4)
- Magic/Resonance Priority affects Step 2 options
- Verify Priority table values are accessible when needed

## Files to Modify

1. `web/ui/src/components/character/CharacterCreationWizard.tsx`

- Reorder steps array
- Update switch statement in renderStep()
- Update validateStep() logic
- Update step names display

2. Step component files (if needed):

- `web/ui/src/components/character/steps/Step3MagicResonance.tsx` → Becomes Step 2
- `web/ui/src/components/character/steps/Step4Qualities.tsx` → Becomes Step 3
- `web/ui/src/components/character/steps/Step2MetatypeAttributes.tsx` → Becomes Step 4
- Verify components handle dependencies correctly in new order

## Testing Considerations

- Verify Magic/Resonance selection works before Metatype selection
- Verify Qualities selection works before Attribute/Skill allocation
- Test that Qualities that affect maximums (e.g., Aptitude) properly update limits in later steps
- Ensure all validation rules still work in new order
- Test priority selection flow through all steps