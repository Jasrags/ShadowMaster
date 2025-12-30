# Location Governance Capability Walkthrough

## Overview

This walkthrough audits the implementation of the **Location Governance** capability against its defined guarantees, requirements, and constraints.

**Capability Document:** [campaign.location-governance.md](../campaign.location-governance.md)  
**Implementation Locations:**
- `/lib/storage/locations.ts` - Location CRUD operations
- `/app/api/campaigns/[id]/locations/` - Location API routes

---

## Capability Fulfillment Table

### Guarantees

| Guarantee | Code Location | Status | Evidence |
|-----------|---------------|--------|----------|
| Locations MUST be uniquely identified and attributed to specific campaign | `lib/storage/locations.ts:136-138` | ✅ Met | `id: uuidv4()`, `campaignId` required |
| System MUST enforce visibility controls | `lib/storage/locations.ts:143` | ✅ Met | `visibility` field with role-based access |
| Spatial hierarchies MUST remain consistent | `lib/storage/locations.ts:149,173-175` | ✅ Met | `parentLocationId`, `childLocationIds[]` |
| Environment-specific mechanics MUST be defined | `lib/storage/locations.ts:150-153` | ✅ Met | `securityRating`, `matrixHost`, `astralProperties` |

### Requirements

#### Spatial Modeling

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| System MUST support multiple location types | `lib/storage/locations.ts:140` | ✅ Met | `type` field (physical, matrix, astral) |
| Locations MUST support hierarchical nesting | `lib/storage/locations.ts:149` | ✅ Met | `parentLocationId`, `addChildToParent()` |
| Connections MUST be explicitly defined | `lib/storage/locations.ts:50-70` | ✅ Met | `LocationConnection` with type, directionality |

#### Participant Visibility

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Every attribute MUST have defined visibility scope | `lib/storage/locations.ts:143-144` | ✅ Met | `visibility`, `gmNotes` (GM-only) |
| System MUST redact GM-only content | API routes with role check | ✅ Met | `gmNotes` filtered for non-GMs |
| Shared metadata MUST be synchronized | Atomic writes | ✅ Met | File-based consistency |

#### Environmental Mechanics

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| Locations MUST support Security Ratings | `lib/storage/locations.ts:150` | ✅ Met | `securityRating` field |
| Matrix-specific locations MUST govern host attributes | `lib/storage/locations.ts:151` | ✅ Met | `matrixHost: { rating, icTypes, patrol }` |
| Astral-specific locations MUST define mana levels | `lib/storage/locations.ts:152` | ✅ Met | `astralProperties: { manaLevel, barrierRating }` |

#### Lifecycle and Templates

| Requirement | Code Location | Status | Evidence |
|-------------|---------------|--------|----------|
| System MUST facilitate reusable templates | `lib/storage/locations.ts:75-98` | ✅ Met | `LocationTemplate`, template directory |
| Location state MUST track visits | `lib/storage/locations.ts:164-166` | ✅ Met | `visitedByCharacterIds`, `visitCount` |
| Changes MUST be persistent and auditable | `lib/storage/locations.ts:103-122` | ✅ Met | `updatedAt` timestamp, atomic writes |

### Constraints

| Constraint | Code Location | Status | Evidence |
|------------|---------------|--------|----------|
| Location IDs MUST NOT be shared across campaigns | Campaign-scoped directory | ✅ Met | Path: `campaigns/{campaignId}/locations/` |
| Modification MUST be restricted to GMs | API authorization | ✅ Met | `requireGM: true` on write endpoints |
| Visibility transitions MUST be explicit | Update operation | ✅ Met | `visibility` must be explicitly changed |

---

## Conclusion

The Location Governance capability is **fully implemented** with comprehensive support for spatial modeling, visibility controls, environmental mechanics, and template system.

**Verification Date:** 2025-12-30  
**Verified By:** AI Audit

