# Refactoring Request Template

## (Tailored for Game/Character Management Applications)

## Overview

**Refactoring Name:** [Name/description of refactoring]
**Requested By:** [Your name]
**Date:** [Date]
**Priority:** [High/Medium/Low]
**Type:** [Code Quality/Performance/Architecture/Maintainability/Technical Debt/Rules Engine]
**Affected Editions:** [Which editions are impacted?]

---

## Current State

**What needs refactoring?**
[Description of the code/system that needs refactoring]

**File(s)/Component(s) Affected:**

- [File/Component 1: e.g., "Character validation engine"]
- [File/Component 2: e.g., "Dice pool calculator"]

**Current Issues:**

- [Issue 1: e.g., "Calculation logic duplicated across editions"]
- [Issue 2: e.g., "Ruleset validation is slow for complex characters"]
- [Issue 3: e.g., "Hard to add new editions"]
- [Issue 4: e.g., "Character data model inconsistent"]

**Code Smells:**

- [Long methods: e.g., "500-line character validation method"]
- [Large classes: e.g., "Monolithic ruleset loader"]
- [Complex conditionals: e.g., "Nested if/else for edition-specific rules"]
- [Magic numbers/strings: e.g., "Hardcoded attribute caps"]
- [Tight coupling: e.g., "Character model tightly coupled to SR5 rules"]

**Game-Specific Issues:**

- [Rule calculation inaccuracies]
- [Edition compatibility problems]
- [Performance issues with complex calculations]
- [Difficulty maintaining rule compliance]

---

## Motivation

**Why refactor this?**
[Business/technical reasons for refactoring]

**Problems it's causing:**

- [Problem 1: e.g., "Adding 6E support requires duplicating 80% of SR5 code"]
- [Problem 2: e.g., "Character validation takes 5+ seconds for complex characters"]
- [Problem 3: e.g., "Rule changes require updates in multiple places"]
- [Problem 4: e.g., "Calculation bugs due to inconsistent logic"]

**Benefits of refactoring:**

- [Benefit 1: e.g., "Easier to add new editions"]
- [Benefit 2: e.g., "Faster character validation (< 1 second)"]
- [Benefit 3: e.g., "Single source of truth for calculations"]
- [Benefit 4: e.g., "Better rule compliance"]

**Game Impact:**

- [How this improves gameplay experience]
- [How this ensures rule accuracy]
- [How this enables new features]

---

## Proposed Solution

**Refactoring Approach:**
[High-level approach to refactoring]

**Design Patterns/Principles:**

- [Pattern 1: e.g., "Strategy Pattern for edition-specific calculations"]
- [Pattern 2: e.g., "Factory Pattern for ruleset creation"]
- [Pattern 3: e.g., "Template Method for character creation flow"]
- [Principle: e.g., "Single Responsibility - separate calculation from validation"]

**New Structure:**
[Description of how code will be organized after refactoring]

**Key Changes:**

1. [Change 1: e.g., "Extract common calculation logic to base class"]
2. [Change 2: e.g., "Create edition-specific strategy classes"]
3. [Change 3: e.g., "Implement ruleset caching for performance"]

**Architecture Improvements:**

- [Modular ruleset system]
- [Pluggable calculation engines]
- [Unified character data model]

---

## Technical Details

**Architecture Changes:**

- [Structural changes: e.g., "Move from monolithic to modular ruleset system"]
- [New abstractions: e.g., "BaseCalculationEngine interface"]
- [Interface changes: e.g., "Standardized character validation API"]

**Ruleset Changes:**

- [How rulesets are structured]
- [How edition differences are handled]
- [How overrides are applied]

**Data Model Changes:**

- [Character data structure changes]
- [Ruleset data structure changes]
- [Migration requirements]

**API Changes:**

- [Public API changes]
- [Breaking changes]
- [Migration path for existing characters]

**Performance Improvements:**

- [Expected performance changes]
- [Caching strategies]
- [Optimization techniques]
- [Benchmarks if available]

---

## Implementation Plan

**Phases:**

1. **Phase 1: Extract Common Logic**
   - [ ] [Task 1: e.g., "Create base calculation engine"]
   - [ ] [Task 2: e.g., "Identify common patterns across editions"]

2. **Phase 2: Implement Edition Strategies**
   - [ ] [Task 1: e.g., "Create SR5 calculation strategy"]
   - [ ] [Task 2: e.g., "Create 6E calculation strategy"]

3. **Phase 3: Refactor Character Validation**
   - [ ] [Task 1: e.g., "Update validation to use new structure"]
   - [ ] [Task 2: e.g., "Add performance optimizations"]

4. **Phase 4: Testing & Migration**
   - [ ] [Task 1: e.g., "Verify all existing characters still work"]
   - [ ] [Task 2: e.g., "Performance testing"]

**Estimated Effort:**

- [Time estimate]
- [Complexity: Low/Medium/High]

**Risk Level:**

- [Low/Medium/High]
- [Why?]

---

## Testing Strategy

**Test Coverage:**

- [Current test coverage]
- [Test coverage after refactoring]

**Testing Approach:**

- [ ] Write tests before refactoring (if needed)
- [ ] Ensure existing tests pass
- [ ] Add new tests for edge cases
- [ ] Game rules compliance tests
- [ ] Performance tests
- [ ] Integration testing
- [ ] Manual testing with real characters

**Game Rules Validation:**

- [Verify calculations against rulebook examples]
- [Test known character builds]
- [Validate edge cases and boundary conditions]

**Risk Mitigation:**

- [How to ensure behavior doesn't change]
- [How to catch regressions]
- [How to verify rule compliance]
- [Character data migration testing]

---

## Risks & Considerations

**Risks:**

- [Risk 1: e.g., "Breaking existing character data"]
- [Risk 2: e.g., "Introducing calculation errors"]
- [Risk 3: e.g., "Performance regression"]
- [Mitigation strategies]

**Edition Compatibility:**

- [Impact on different editions]
- [Migration path for each edition]
- [Backward compatibility requirements]

**Data Migration:**

- [Existing character data migration]
- [Ruleset data migration]
- [Data validation after migration]

**Dependencies:**

- [What depends on this code]
- [What this code depends on]
- [External dependencies]

**Timing:**

- [Best time to do this refactoring]
- [Dependencies on other work]
- [User impact considerations]

---

## Success Criteria

**How will we know it's successful?**

- [ ] [Criterion 1: e.g., "All existing characters still work correctly"]
- [ ] [Criterion 2: e.g., "Character validation < 1 second"]
- [ ] [Criterion 3: e.g., "Adding new edition takes < 2 days"]
- [ ] [Criterion 4: e.g., "All calculations match rulebook examples"]
- [ ] [Criterion 5: e.g., "Code coverage > 80%"]

**Metrics:**

- **Before:**
  - [Calculation time: e.g., 5 seconds]
  - [Code duplication: e.g., 60%]
  - [Test coverage: e.g., 50%]

- **After (Target):**
  - [Calculation time: e.g., < 1 second]
  - [Code duplication: e.g., < 10%]
  - [Test coverage: e.g., > 80%]

**Game Rules Compliance:**

- [100% rule accuracy maintained]
- [All test characters validate correctly]
- [No calculation errors]

---

## Rollback Plan

**If something goes wrong:**

- [How to rollback]
- [Checkpoint/backup strategy]
- [Character data backup]
- [Ruleset data backup]

**Recovery Steps:**

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Additional Context

**Related Issues:**

- [Links to related refactoring or technical debt issues]

**References:**

- [Design patterns documentation]
- [Best practices references]
- [Similar refactorings in other projects]
- [Game rules references]

**Code Examples:**

```language
// Before: Monolithic calculation
[Example of current code with issues]

// After: Modular strategy pattern
[Example of refactored code]
```

**Architecture Diagrams:**

- [If applicable, describe or link to architecture diagrams]
