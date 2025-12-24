# ADR-002.ruleset: Multi-Edition Sandbox

## Decision

The system architecture MUST enforce strict data and logic isolation between Shadowrun editions through a "Multi-Edition Sandbox" model. Each edition (SR3, SR5, SR6, etc.) exists as a self-contained ruleset that does not share mechanics, attribute definitions, or derived stat formulas with other editions.

## Context

Shadowrun has undergone significant mechanical shifts across its six editions (e.g., the introduction of Limits in 5E, the complete overhaul of Edge in 6E, the transition from fixed to variable target numbers). Attempting to create a unified data model that spans all editions leads to "leaky abstractions," where edition-specific logic pollutes the global codebase, increasing complexity and risk of regressive bugs.

A shared "Universal Runner" model was considered but rejected because:

- Attributes present in one edition (e.g., Initiative in 3E) function differently or are absent in others.
- The cost curves for advancement vary wildly (Linear vs. Square-based Karma).
- Matrix and Magic subsystems are often rewritten entirely between editions.

## Consequences

### Positive

- **Reduced Complexity**: Developers only need to reason about a single edition's rules when working within that sandbox.
- **Improved Stability**: Updates or bug fixes to one edition (e.g., SR5) cannot break the mechanics of another (e.g., SR3).
- **High Fidelity**: Features can be implemented to exactly match the source material without compromise for cross-edition compatibility.
- **Cleaner APIs**: API endpoints and UI components are scoped to a specific ruleset context.

### Negative

- **Code Duplication**: Similar concepts (like "Physical Damage Track") may be implemented multiple times, though they often have subtle differences that justify the separation.
- **Cross-Edition Limitations**: It is difficult to "migrate" a character from one edition to another without a manual transformation process.

## Alternatives Considered

- **Unified Generic Model**: Rejected. Leads to an overly complex schema with hundreds of optional fields and conditional logic clusters.
- **Strategy Pattern for specific mechanics only**: Rejected. While useful for isolated math, it doesn't solve the problem of incompatible data structures (e.g., how Armor works in SR3 vs. SR5).
