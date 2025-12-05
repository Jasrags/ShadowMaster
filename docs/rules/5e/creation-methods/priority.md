# Shadowrun 5E – Priority Character Creation

_Last updated: 2025-01-27_

The Priority system is the standard character creation method for Shadowrun 5th Edition. Players assign the letters A–E uniquely across five columns: Metatype, Attributes, Magic/Resonance, Skills, and Resources.

## Overview

Each priority level (A through E) grants specific benefits:
- **Priority A:** Highest tier benefits
- **Priority B:** Strong benefits
- **Priority C:** Moderate benefits
- **Priority D:** Basic benefits
- **Priority E:** Minimal benefits

Each column must receive a unique priority level—no duplicates allowed.

## Priority Columns

1. **Metatype:** Determines metatype selection and special attribute points
2. **Attributes:** Attribute point pool for physical and mental attributes
3. **Magic/Resonance:** Magic or Resonance rating and related resources
4. **Skills:** Skill points and skill groups
5. **Resources:** Starting nuyen

## Priority System Flow

The recommended order for Priority-based character creation:

1. **Step 1:** Choose concept and role
2. **Step 2:** Assign Priority to Metatype → get Special Attribute Points → assign Priority to Attributes → spend attribute points
3. **Step 3:** Assign Priority to Magic/Resonance (if applicable) → select skills/spells/complex forms
4. **Step 4:** Purchase Qualities (Positive and Negative) → adjust Karma total
5. **Step 5:** Assign Priority to Skills → spend skill points and skill group points → assign free Knowledge/Language points
6. **Step 6:** Assign Priority to Resources → purchase gear → select Lifestyle
7. **Step 7:** Spend remaining Karma → purchase contacts → buy additional spells/sprites/spirits
8. **Step 8:** Calculate derived values (Initiative, Limits, Condition Monitors)
9. **Step 9:** Develop background → get GM approval

## Key Validation Rules

When implementing Priority character creation, enforce these rules:

- Each Priority Level (A-E) used exactly once
- Only one Physical or Mental attribute at natural maximum
- Maximum 25 Karma in Positive Qualities
- Maximum 25 Karma in Negative Qualities
- Maximum 7 Karma carryover
- Maximum 5,000¥ carryover
- All attribute points spent
- All skill points spent
- Gear Availability ≤ 12
- Gear Device Rating ≤ 6
- Augmentation bonus ≤ +4 per attribute
- Maximum bound spirits = Charisma
- Maximum registered sprites = Charisma
- Maximum complex forms = Logic
- Maximum spells = Magic Rating × 2
- Maximum foci Force = Magic Rating × 2

## Implementation Considerations

### UI/UX Recommendations

- Show available Priority Levels at each step
- Display remaining resources (Karma, nuyen, skill points)
- Validate restrictions in real-time
- Show calculated values (Initiative, Limits) as they change
- Provide tooltips/explanations for complex rules
- Allow saving progress at each step
- Show examples from the guide
- Display metatype racial bonuses/penalties clearly
- Warn about Essence loss for magic users
- Highlight restrictions (max attributes, availability, etc.)

## Reference

- See [Character Creation Guide](../character-creation.md) for the complete workflow
- See [Data Tables](../data-tables.md) for priority tables and values
- See [Rules Reference](../../reference.md#priority-baseline) for implementation details
- See [Sum-to-Ten](./sum-to-ten.md) for an alternative creation method
- See [Karma Point-Buy](./karma-point-buy.md) for karma-based creation

---

_Note: Detailed priority tables and implementation specifications are maintained in the edition JSON data files and referenced in the main character creation guide._
