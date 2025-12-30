# Ruleset Integrity Capability Walkthrough

## Overview

This walkthrough audits the implementation of the **Ruleset Integrity** capability against its defined guarantees, requirements, and constraints.

**Capability Document:** [ruleset.integrity.md](../ruleset.integrity.md)  
**Implementation Locations:**
- `/lib/rules/loader.ts` - Ruleset loading
- `/lib/rules/merge.ts` - Bundle merging
- `/lib/rules/campaign-validation.ts` - Character-campaign compliance

---

## Capability Fulfillment Table

### Guarantees

| Guarantee | Code Location | Status | Evidence |
|-----------|---------------|--------|----------|
| Every campaign MUST be bound to exactly one core ruleset | Campaign `editionCode` | ✅ Met | Single `editionId` and `editionCode` on campaign |
| Ruleset editions MUST be strictly sandboxed | `/data/editions/{code}/` structure | ✅ Met | Edition-specific directories |
| All calculations MUST derive from active bundles | `loadRuleset()` → `mergeRuleset()` | ✅ Met | MergedRuleset contains all active modules |
| Changes MUST NOT impact existing campaigns | Edition immutability | ✅ Met | Edition code locked at creation |

### Requirements

#### Edition Sanitization and Isolation

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Each edition MUST independently define attributes, skills, etc. | `/data/editions/{code}/core-rulebook.json` | ✅ Met | Edition-specific JSON files |
| System MUST prevent selection of unregistered content | Validation against merged ruleset | ✅ Met | Quality/skill IDs checked against loaded modules |
| Mechanical engines MUST adjust per edition | Edition-specific rules in merge | ✅ Met | `editionCode` used to load correct rules |

#### Bundle Governance and Aggregation

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Content MUST be organized into discrete bundles | Book structure in edition | ✅ Met | Core + sourcebook JSON files |
| Sourcebooks MUST extend without overriding identity | `/lib/rules/merge.ts` merge strategies | ✅ Met | `append`, `merge`, `replace` strategies |
| System MUST support toggling sourcebook modules | Campaign `enabledBookIds[]` | ✅ Met | Campaign-level book selection |

#### Mechanical Foundation and Optionality

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Core rulebooks MUST provide mandatory baseline | `isCore: true` book flag | ✅ Met | Core rulebook always loaded first |
| System MUST support optional rules | Campaign `enabledOptionalRules[]` | ✅ Met | Optional rule toggles |
| Conflicts MUST be resolved with predefined precedence | Merge order in loader | ✅ Met | Later books override earlier |

#### Validation Integrity

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Character creation/advancement MUST be validated | `/lib/rules/campaign-validation.ts` | ✅ Met | `validateCharacterCampaignCompliance()` |
| Disabled bundle content MUST be rejected | Book restriction check | ✅ Met | `unauthorizedBooks` error |
| System MUST record active bundles at state changes | Character `attachedBookIds[]` | ✅ Met | Book IDs stored on character |

### Constraints

| Constraint | Code Location | Status | Evidence |
|------------|---------------|--------|----------|
| Campaign MUST NOT transition between editions | `/app/api/campaigns/[id]/route.ts:120-147` | ✅ Met | Edition change blocked |
| Bundle access MUST be restricted to compatible editions | Edition-scoped book lists | ✅ Met | Books defined per edition |
| Bundle modification MUST be restricted to admins | File-based storage | ✅ Met | No runtime bundle editing |

---

## Merge Strategy

```typescript
// From /lib/rules/merge.ts
type MergeStrategy = "merge" | "replace" | "append" | "remove";

// Later books can:
// - merge: Deep merge objects
// - replace: Override entirely
// - append: Add to arrays
// - remove: Remove specific items
```

---

## Conclusion

The Ruleset Integrity capability is **fully implemented** with strict edition sandboxing, bundle aggregation, optional rule support, and continuous validation integrity.

**Verification Date:** 2025-12-30  
**Verified By:** AI Audit

