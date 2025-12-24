# Merge Precedence Model

This document describes the deterministic precedence model used to resolve conflicts when multiple ruleset bundles (Core Rulebook + Sourcebooks) modify the same data.

> [!IMPORTANT]
> This documentation satisfies the Ruleset Integrity Capability requirement:
> _"Data conflicts across multiple active bundles MUST be resolved using a predefined precedence model, ensuring a predictable and verifiable ruleset state."_

## Overview

Shadow Master uses a **layered merge approach** where later layers overlay earlier ones. The system applies merge strategies (`merge`, `replace`, `append`, `remove`) as defined in [ADR-003: Rule Merging Strategies](../decisions/003-ruleset.rule-merging-strategies.md).

## Precedence Order (Lowest to Highest)

| Priority | Layer                             | Description                                              |
| -------- | --------------------------------- | -------------------------------------------------------- |
| 1 (Base) | **Core Rulebook**                 | The edition's primary rulebook (e.g., SR5 Core)          |
| 2        | **Standard Sourcebooks**          | Additional rulebooks in alphabetical order by `bookCode` |
| 3        | **Explicit Priority Sourcebooks** | Books with a `priority` field, sorted ascending          |
| 4 (Top)  | **Campaign Overrides**            | GM-specific house rules (future enhancement)             |

### Resolution Rules

1. **Higher priority wins**: When the same property is modified by multiple books, the highest priority book's value is used.

2. **Alphabetical fallback**: Books without explicit priority are processed alphabetically by `bookCode`. Example: `chrome-flesh` < `rigger-5` < `run-faster`.

3. **Explicit removal always wins**: If any book uses the `remove` strategy, the removal is applied regardless of priority.

4. **Strategy-specific merging**:
   - `merge`: Deep recursive merge (objects combine, arrays merge by ID)
   - `replace`: Complete overwrite of the target
   - `append`: Items added to array without removing existing
   - `remove`: Specific keys or items are deleted

## Examples

### Example 1: Cost Override

```
Core Rulebook (priority 1):
  Ares Predator V: { cost: 725 }

Run & Gun (priority 2):
  Ares Predator V: { cost: 700, strategy: "merge" }

Result:
  Ares Predator V: { cost: 700 }  ← Run & Gun wins
```

### Example 2: Attribute Addition

```
Core Rulebook:
  Weapon: { damage: "8P", ap: -1 }

Chrome Flesh:
  Weapon: { smartgunIntegrated: true, strategy: "merge" }

Result:
  Weapon: { damage: "8P", ap: -1, smartgunIntegrated: true }
```

### Example 3: Removal

```
Core Rulebook:
  Skills: ["etiquette", "con", "intimidation"]

Errata 2.0:
  Skills: ["con"], strategy: "remove"

Result:
  Skills: ["etiquette", "intimidation"]  ← "con" removed
```

## Implementation Reference

The merge logic is implemented in [`lib/rules/merge.ts`](file:///Users/jrags/Code/Jasrags/shadow-master/lib/rules/merge.ts).

Key functions:

- `produceMergedRuleset()` — Main merge orchestrator
- `mergeRules()` — Applies strategy-based merge
- `deepMerge()` — Recursive object/array merging

## Silent Resolution

Per design decision, merge conflicts are resolved silently without UI notification. GMs who need to inspect merge behavior can:

1. Review the source data files in `data/editions/{edition}/books/`
2. Examine the `snapshotId` on the merged ruleset
3. (Future) Access an audit log of applied merges

## Related Documents

- [ADR-003: Rule Merging Strategies](../decisions/003-ruleset.rule-merging-strategies.md)
- [Ruleset Integrity Capability](../capabilities/ruleset.integrity.md)
