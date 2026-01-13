# ADR-011.character: Sheet-Driven Character Creation

## Decision

The system MUST support a **Sheet-Driven Character Creation Mode** where character creation occurs directly on the character sheet interface rather than through a separate step-based wizard. In this mode, all character components (attributes, skills, gear, spells, contacts, etc.) are visible and editable simultaneously, with real-time budget tracking and validation displayed inline.

This decision **extends** ADR-005 (Modular Step Wizard) by providing an alternative creation paradigm. Both modes may coexist, with users able to choose their preferred creation experience.

## Context

ADR-005 established a modular step-based wizard as the primary character creation interface. While this approach successfully supports multiple editions and creation methods, user feedback and design exploration revealed friction points:

1. **Disconnection from Pen-and-Paper Experience**: Tabletop players are accustomed to seeing the entire character sheet while creating a character. The wizard's sequential nature hides information that experienced players want to reference simultaneously.

2. **Context Loss Between Steps**: Decisions in early steps (e.g., Priority selection) affect options in later steps (e.g., available spells). Users cannot easily see downstream consequences without navigating forward and back.

3. **Duplicate Component Development**: The wizard requires step-specific components that are functionally similar to character sheet display components, leading to parallel implementations for the same data domains.

4. **Mode Transition Friction**: After creation, users must learn a different interface (the character sheet) for viewing and advancing their character. A unified interface reduces cognitive overhead.

The sheet-driven approach aligns with how experienced Shadowrun players actually create characters: with a blank character sheet in front of them, filling in sections as they make decisions, and constantly cross-referencing between sections.

## Consequences

### Positive

- **Familiar Mental Model**: Mirrors the physical character sheet experience that tabletop players expect.
- **Simultaneous Visibility**: All budgets (karma, nuyen, attribute points, skill points, spell slots) visible at once, enabling informed tradeoff decisions.
- **Component Reuse**: A single `AttributesComponent` serves creation, viewing, and advancement modes with conditional editability.
- **Reduced Learning Curve**: Users learn one interface that serves creation, play, and advancement.
- **Better Cross-Section Awareness**: Purchasing cyberware immediately shows Essence loss affecting Magic; buying a gun shows remaining nuyen for armor.

### Negative

- **Increased Validation Complexity**: All sections must validate simultaneously rather than sequentially. Invalid states in one section must not block progress in others during creation.
- **Layout Density**: Fitting all components on screen requires careful responsive design and possibly collapsible sections.
- **Onboarding for New Players**: The wizard's guided steps may be more approachable for players unfamiliar with Shadowrun. Consider retaining wizard as an optional "guided mode."
- **State Management Complexity**: More components are mounted simultaneously, requiring careful attention to performance and state synchronization.

## Alternatives Considered

### 1. Wizard-Only (Status Quo per ADR-005)

**Rejected as sole approach.** While the wizard works, it does not serve experienced players who prefer the sheet-based mental model. The wizard remains valuable for onboarding but should not be the only option.

### 2. Hybrid: Wizard for Foundation, Sheet for Details

Create a two-phase approach where the wizard handles Priority Selection, Metatype, and Magic Path (the "foundation" choices), then transitions to the full sheet for attributes, skills, gear, and other purchases.

**Considered but deferred.** This may be a valid middle ground but adds complexity in determining where the wizard ends and the sheet begins. The full sheet-driven approach is cleaner to implement and test.

### 3. Tabbed Sheet Sections

Display the sheet but with tabs for major domains (Combat, Magic, Social, Gear) to reduce visual density.

**Partially adopted.** The three-column layout with collapsible sections achieves similar goals while maintaining the "everything visible" principle. Tabs may be added later for mobile viewports.

### 4. Full Sheet-Driven (Selected)

All creation happens on the character sheet. Budget summaries and validation states are displayed inline. Components adapt their behavior based on character lifecycle state (draft vs. active).

**Selected.** Best alignment with user expectations and maximum component reuse. Complexity is manageable with proper state management patterns.

## Related Capabilities

- `character.management`: Defines lifecycle guarantees (draft, active, retired) that the sheet must respect
- `character.sheet`: Defines presentation guarantees that apply equally to creation and viewing modes

## Related ADRs

- **ADR-005 (Modular Step Wizard)**: Extended, not replaced. The wizard infrastructure remains available for guided creation or edition-specific flows that require strict sequencing.

## Implementation Notes

> These notes are for context only; implementation details belong in plans, not ADRs.

The sheet-driven mode requires:

- Components that accept an `editable` or `mode` prop to switch between view/edit states
- A unified budget tracking context that all purchase components can read
- Inline validation feedback rather than step-gate validation
- Draft auto-persistence consistent with the wizard's existing behavior
