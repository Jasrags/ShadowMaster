# ADR-005.character: Modular Step Wizard

## Decision

The system MUST implement a **Modular Step-Based Wizard** for character creation. This wizard will be driven by the ruleset metadata rather than hardcoded UI flows. Each edition ruleset defines its own sequence of "Creation Steps" (e.g., Priority, Metatype, Attributes, Gear), and the UI dynamically renders the appropriate component for each step.

A step is defined by:

- A unique identifier and display name.
- A functional component responsible for that step's logic.
- A set of validation requirements that must be met to proceed.
- A budget impact (e.g., spending Karma, Assigning Priority).

## Context

Character creation in Shadowrun varies significantly by edition (e.g., Priority System vs. Point Buy vs. Life Modules). Hardcoding these flows into a single monolithic component or creating separate wizard implementations for every edition and book combination leads to massive technical debt and UI inconsistency.

By moving to a modular wizard:

- New creation methods can be added by defining new step sequences in the ruleset data.
- UI components (like a `GearStep` or `SkillStep`) can be reused across different editions if they share common logic.
- The wizard can handle "Draft" states and auto-saves consistently across all paths.

## Consequences

### Positive

- **Flexibility**: The system can support Priority systems (SR5), Path/Life Modules (SR5 expansions), and Point Buy systems within the same framework.
- **Maintainability**: Individual steps are decoupled and can be tested or styled in isolation.
- **State Integrity**: The `CreationWizard` orchestrator manages the global draft state and persistence, ensuring no data is lost between steps.

### Negative

- **Component Discovery**: The mapping between ruleset step names (e.g., `"gear"`) and React components must be meticulously maintained.
- **Inter-Step Dependencies**: Logic where one step affects another (e.g., Metatype choice defining Attribute caps) requires a centralized validation and state broadcast mechanism.

## Alternatives Considered

- **Edition-Specific Wizards**: Rejected. Common functionality (persistence, navigation, basic validation) would be duplicated across 10+ wizard components.
- **Condition-Heavy Monolithic Page**: Rejected. Becomes unreadable and impossible to audit as more editions and sourcebooks are added.
- **Purely Dynamic (JSON-to-Form)**: Rejected. RPG character creation is too complex for generic form builders; custom UI components are required for features like priority tables or gear purchasing.
