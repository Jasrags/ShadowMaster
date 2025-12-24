# ADR-003.ruleset: Rule Merging Strategies

## Decision

The system MUST utilize a deterministic, hierarchical merging algorithm to resolve conflicts between core rules and sourcebook content. The resolution order is:

1. **Core Edition Rules** (The base)
2. **Standard Sourcebooks** (In alphabetical order by code, or by explicit priority)
3. **Adventure/Campaign Content** (Most specific, overlays everything else)

The primary merge mechanism is based on four explicit strategies defined at the data level:

- `merge`: Performs a deep object merge (recursive).
- `replace`: Completely overwrites the base object or property.
- `append`: Explicitly adds items to an existing list.
- `remove`: Targets and removes specific keys or list items.

## Context

Shadowrun's system of "Book-Based Overrides" is a core system requirement. Later books often update the costs of earlier items, add new properties to existing metatypes, or replace entire subsystems (e.g., adding "Limits" to SR5 characters). A simple "last one wins" approach is insufficient for the nested data structures used to represent complex mechanics like metatypes or magic traditions.

Without clear merging strategies:

- Adding a single spell to a book would require redefining the entire spell list.
- Updates to gear attributes would be lost if another book added unrelated lore text to the same gear item.
- The system would be unpredictable when multiple optional books are toggled on.

## Consequences

### Positive

- **Granular Control**: Sourcebooks can modify exactly what they need (e.g., just the nuyen cost of a specific gun) without touching other metadata.
- **Predictability**: The same set of enabled books will always produce the same final ruleset.
- **Maintainability**: New content packs can be added with minimal risk to existing data structures.

### Negative

- **Validation Complexity**: The merging engine must be highly robust and strictly typed to prevent accidental data corruption.
- **Ordering Sensitivity**: While deterministic, the order of books matters; circular dependencies or conflicting overrides must be managed through clear priority assignments.

## Alternatives Considered

- **Flat Replace Only**: Rejected. Leads to massive data duplication and maintenance nightmares.
- **Dynamic Scripting/Hooks**: Rejected. Harder to audit and less performant for large-scale data merges during character validation.
- **Manual Reconciliation**: Rejected. Incompatible with an AI-first approach where data structure stability is paramount.
