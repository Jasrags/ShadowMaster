# Quality Governance Capability Walkthrough

## Overview

This walkthrough audits the implementation of the **Quality Governance** capability against its defined guarantees, requirements, and constraints. It maps specific code locations to capability requirements and documents proof of work.

**Capability Document:** [character.quality-governance.md](../character.quality-governance.md)  
**Implementation Location:** `/lib/rules/qualities/`  
**API Routes:** `/app/api/characters/[characterId]/qualities/`

---

## Capability Fulfillment Table

### Guarantees

| Guarantee | Code Location | Status | Evidence |
|-----------|---------------|--------|----------|
| Qualities MUST be authoritatively defined within the active ruleset, including Karma costs, bonuses, and prerequisites | `utils.ts` `getQualityDefinition()` | ✅ Met | Retrieves quality definitions from `ruleset.modules.qualities` |
| Every quality selection MUST undergo real-time validation for metatype, attributes, and incompatibilities | `validation.ts:27-155` `validatePrerequisites()`, `validation.ts:160-184` `checkIncompatibilities()` | ✅ Met | Full prerequisite and incompatibility checking |
| System MUST enforce strict Karma limits during character creation | `karma.ts:123-167` `validateKarmaLimits()` | ✅ Met | 25 Karma max for positive, 25 Karma max for negative |
| Dynamic quality states MUST be persistent and updateable | `dynamic-state.ts:155-214` `updateDynamicState()` | ✅ Met | State updates merge into character record |
| Quality-derived effects MUST be automatically exposed for integration | `effects.ts:323-364` `getActiveEffects()`, `effects/integration.ts:35-61` `getAllCharacterEffects()` | ✅ Met | Effects system with trigger matching and context filtering |

---

### Requirements

#### Trait Validation and Selection

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Validate quality eligibility based on metatype, magical path, attributes, and skills | `validation.ts:27-155` | ✅ Met | Checks `metatypes`, `hasMagic`, `hasResonance`, `attributes`, `skills`, `magicalPaths` |
| Mutually exclusive qualities MUST be identified and restricted | `validation.ts:160-184` `checkIncompatibilities()` | ✅ Met | Checks `quality.incompatibilities` array against character's qualities |
| Qualities requiring specification MUST capture and persist details | `validation.ts:226-283` `validateQualitySelection()` | ✅ Met | Validates `requiresSpecification`, `specificationOptions`, stores in selection |

#### Karma and Economic Governance

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Enforce maximum Karma expenditure/gain limits during creation | `karma.ts:123-167` | ✅ Met | `MAX_POSITIVE_KARMA = 25`, `MAX_NEGATIVE_KARMA = 25` |
| Post-creation acquisition governed by calibrated costs (2×) | `advancement.ts:97-99` `calculatePostCreationCost()` | ✅ Met | `return calculateQualityCost(quality, rating, true)` where `isPostCreation = true` → `baseCost * 2` |
| Removal of negative qualities via buy-off with Karma | `advancement.ts:291-304` `calculateBuyOffCost()` | ✅ Met | `Math.abs(baseBonus) * 2` |
| Every quality-related Karma transaction MUST be recorded | `advancement.ts:167-183` | ✅ Met | Creates `AdvancementRecord` with type `"quality"` |

#### Dynamic State Management

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Qualities with temporal/situational states MUST maintain persistent state model | `dynamic-state.ts:19-114` `initializeDynamicState()` | ✅ Met | Addiction, Allergy, Dependent, Code of Honor states initialized |
| Interfaces for updating dynamic states based on time/events | `dynamic-state.ts:155-214`, `dynamic-state/addiction.ts`, `dynamic-state/allergy.ts` | ✅ Met | `updateDynamicState()`, `recordDose()`, `calculateWithdrawalPenalties()`, etc. |
| Changes to dynamic quality states MUST propagate modifiers | `gameplay-integration.ts` | ✅ Met | Integrates `calculateWithdrawalPenalties()`, `calculateAllergyPenalties()` into gameplay |

#### Effect Resolution and Integration

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Quality effects MUST be defined in declarative format with triggers and targets | `effects.ts:42-78` `resolveTemplateVariable()` | ✅ Met | Template variables `{{rating}}`, `{{specification}}`, `{{specificationId}}` |
| Effects MUST support variable resolution based on rating/specification | `effects.ts:88-120` `resolveEffectValue()` | ✅ Met | Resolves numeric values from templates |
| Active effects MUST be consolidated for action resolution | `effects/integration.ts:63-72` `getDicePoolModifiers()` | ✅ Met | Returns total dice pool modifier from all active quality effects |

---

### Constraints

| Constraint | Code Location | Status | Evidence |
|------------|---------------|--------|----------|
| Qualities MUST NOT be modified post-creation without Karma or campaign authority | `advancement.ts:78-85` | ✅ Met | Checks `character.karmaCurrent < cost` before acquisition |
| Dynamic state transitions MUST NOT cause invalid structural state | `dynamic-state.ts:238-313` `validateDynamicState()` | ✅ Met | Type-specific validation for addiction, allergy, dependent, code-of-honor |
| Quality effects MUST NOT be applied if quality is inactive | `effects.ts:329-332` | ✅ Met | `if (selection.active === false) { return []; }` |

---

### Non-Goals Verification

| Non-Goal | Status | Evidence |
|----------|--------|----------|
| Does not define narrative justification or roleplaying manifestations | ✅ Respected | Optional `notes` field only |
| Does not manage flavor text or descriptive summaries | ✅ Respected | Quality definitions come from ruleset, not this module |
| Does not cover visual appearance of quality indicators | ✅ Respected | No UI code in `/lib/rules/qualities/` |

---

## Test Coverage

### Unit Tests

| Test File | Coverage Area |
|-----------|---------------|
| `__tests__/validation.test.ts` | Prerequisites, incompatibilities, quality selection validation |
| `__tests__/karma.test.ts` | Karma cost calculation, limits validation |
| `__tests__/advancement.test.ts` | Post-creation acquisition, buy-off costs |
| `__tests__/dynamic-state.test.ts` | State initialization, updates, validation |
| `__tests__/effects.test.ts` | Effect resolution, template variables, trigger matching |
| `__tests__/gameplay-integration.test.ts` | Integration with dice pools, wound modifiers |
| `__tests__/utils.test.ts` | Quality lookup, character quality queries |

---

## Implementation Architecture

```
/lib/rules/qualities/
├── index.ts                   # Module exports
├── validation.ts              # Prerequisites, incompatibilities, selection validation
├── karma.ts                   # Karma cost calculations and limits
├── advancement.ts             # Post-creation acquisition and removal
├── effects.ts                 # Effect resolution and template variables
├── dynamic-state.ts           # Dynamic state initialization and updates
├── gameplay-integration.ts    # Integration with gameplay systems
├── utils.ts                   # Quality lookup utilities
├── creation-helper.ts         # Character creation helpers
├── dynamic-state/
│   ├── addiction.ts           # Addiction-specific state logic
│   ├── allergy.ts             # Allergy-specific state logic
│   └── dependents.ts          # Dependents-specific state logic
├── effects/
│   ├── handlers.ts            # Effect type handlers
│   └── integration.ts         # Gameplay integration entry points
└── __tests__/                 # Test suite
```

---

## Dynamic State Types

The system supports the following dynamic quality states:

| Type | State Fields | Update Triggers |
|------|--------------|-----------------|
| `addiction` | substance, severity, lastDose, cravingActive, withdrawalPenalty, daysClean | Dose consumption, time passage, recovery attempts |
| `allergy` | allergen, prevalence, severity, currentlyExposed, damageAccumulated | Allergen exposure, healing |
| `dependent` | name, relationship, tier, currentStatus, lifestyleCostModifier, timeCommitmentHours | Status changes, lifestyle changes |
| `code-of-honor` | codeName, description, violations, totalKarmaLost | Violations recorded |

---

## Effect System

### Trigger Types

Effects are applied based on context triggers:
- `passive` - Always active
- `test` - During skill tests
- `defense` - During defense rolls
- `damage` - When taking damage
- `healing` - During healing
- `social` - During social interactions
- `magic` - During magic use
- `matrix` - During matrix actions
- `cost` - Affecting costs (karma, nuyen)

### Effect Targets

- `dicePool` - Modify dice pool (skill, attribute, or specific)
- `limit` - Modify limits (physical, mental, social)
- `woundModifier` - Modify wound penalties
- `attribute` - Modify attribute values
- `attributeMax` - Modify attribute maximums
- `cost` - Modify various costs

---

## Key Design Decisions

1. **Declarative effects system**: Effects defined in ruleset JSON with template variables for flexibility.

2. **Discriminated union for dynamic state**: Type-safe state management using `type` field to discriminate between addiction, allergy, dependent, code-of-honor.

3. **Post-creation cost multiplier**: 2× karma cost for acquiring positive qualities after creation, consistent with SR5 rules.

4. **Inactive quality filtering**: Effects check `selection.active === false` before applying, allowing qualities to be temporarily disabled.

5. **Specification validation**: Qualities can require freeform specification or constrain to predefined options via `specificationOptions`.

---

## Gaps and Technical Debt

| Issue | Severity | Notes |
|-------|----------|-------|
| Code of Honor violation tracking is basic | Low | `violations` array exists but no automated violation detection |
| Reputation dynamic state is placeholder | Low | Generic state object, not fully implemented |
| Custom dynamic state needs definition | Low | Exists for extensibility but no implementation |

---

## Conclusion

The Quality Governance capability is **fully implemented** with comprehensive coverage of:
- Quality validation (prerequisites, incompatibilities, specifications)
- Karma accounting (limits, post-creation costs, buy-off)
- Dynamic state management (addiction, allergy, dependents, code of honor)
- Effect resolution and integration with gameplay systems

All guarantees, requirements, and constraints from the capability document are satisfied.

**Verification Date:** 2025-12-30  
**Verified By:** AI Audit

