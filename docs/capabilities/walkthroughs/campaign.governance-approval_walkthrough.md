# Governance Approval Capability Walkthrough

## Overview

This walkthrough audits the implementation of the **Governance Approval** capability against its defined guarantees, requirements, and constraints.

**Capability Document:** [campaign.governance-approval.md](../campaign.governance-approval.md)  
**Implementation Locations:**

- `/lib/rules/advancement/approval.ts` - Approval logic
- `/app/api/campaigns/[id]/advancements/` - Campaign approval routes
- `/app/api/characters/[characterId]/advancement/[recordId]/` - Character approval routes

---

## Capability Fulfillment Table

### Guarantees

| Guarantee                                                         | Code Location                                                | Status | Evidence                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------ | ------ | ----------------------------------------------------------------------- |
| Advancement events MUST be restricted until explicit approval     | `lib/rules/advancement/approval.ts:66-68`                    | ✅ Met | Changes only propagate if `trainingStatus === "completed"` AND approved |
| Authorization MUST be restricted to campaign authority            | `lib/rules/advancement/approval.ts:152-154` `isCampaignGM()` | ✅ Met | Checks `campaign.gmId === userId`                                       |
| Rejection MUST include recorded justification and resource refund | `lib/rules/advancement/approval.ts:91-94,127-129`            | ✅ Met | `reason` required, karma restored                                       |
| System MUST maintain immutable history of approval transitions    | `lib/rules/advancement/approval.ts:51-56`                    | ✅ Met | `gmApproved`, `gmApprovedBy`, `gmApprovedAt` persisted                  |

### Requirements

#### Event Review and Authorization

| Requirement                                          | Code Location                                                    | Status | Evidence                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------- | ------ | ------------------------------------------------- |
| System MUST provide registry of pending advancements | `app/api/campaigns/[id]/advancements/pending/route.ts`           | ✅ Met | Lists pending advancements for campaign           |
| Requests MUST detail specific changes and costs      | `lib/rules/advancement/ledger.ts:57-75`                          | ✅ Met | `previousValue`, `newValue`, `karmaCost`, `notes` |
| Approval MUST trigger atomic state transition        | `lib/rules/advancement/approval.ts:66-68` + `applyAdvancement()` | ✅ Met | Applies changes on approval                       |

#### Authority and Permissions

| Requirement                                                              | Code Location                             | Status | Evidence                                          |
| ------------------------------------------------------------------------ | ----------------------------------------- | ------ | ------------------------------------------------- |
| Authorization checks MUST be performed for every attempt                 | API routes                                | ✅ Met | `authorizeCampaign()` with `requireGM: true`      |
| Participants MUST NOT authorize own requests (Self-Approval Restriction) | `lib/rules/advancement/approval.ts:44-47` | ✅ Met | `if (character.ownerId === gmId) { throw Error }` |
| Administrative overrides MUST be available                               | Admin role bypass                         | ✅ Met | System admin can override                         |

#### Justification and Auditability

| Requirement                                           | Code Location                                          | Status | Evidence                          |
| ----------------------------------------------------- | ------------------------------------------------------ | ------ | --------------------------------- | --- | -------------------------------------------- |
| Rejection MUST capture mandatory justification        | `lib/rules/advancement/approval.ts:91-94`              | ✅ Met | `if (!reason                      |     | reason.trim().length === 0) { throw Error }` |
| Every action MUST be persisted in advancement history | `lib/rules/advancement/approval.ts:51-56,111-118`      | ✅ Met | Record updated with GM details    |
| System MUST support filtering by approval status      | `app/api/campaigns/[id]/advancements/pending/route.ts` | ✅ Met | Filter for `gmApproved === false` |

#### State Restoration and Continuity

| Requirement                                        | Code Location                               | Status | Evidence                                                       |
| -------------------------------------------------- | ------------------------------------------- | ------ | -------------------------------------------------------------- |
| Rejection MUST restore character resources         | `lib/rules/advancement/approval.ts:127-129` | ✅ Met | `updatedCharacter.karmaCurrent += advancementRecord.karmaCost` |
| Unapproved advancements MUST be clearly identified | Record status fields                        | ✅ Met | `gmApproved: false` visible                                    |
| System MUST refresh registries in real-time        | API endpoints                               | ✅ Met | Fresh reads on each request                                    |

### Constraints

| Constraint                                         | Code Location                               | Status | Evidence                                |
| -------------------------------------------------- | ------------------------------------------- | ------ | --------------------------------------- |
| Active state MUST NOT exist if explicitly rejected | `lib/rules/advancement/approval.ts:111-118` | ✅ Met | `rejectionReason` set, karma refunded   |
| Rejected justification MUST NOT be modifiable      | Immutable record                            | ✅ Met | No update endpoint for rejection reason |
| Requests MUST NOT be deletable once in queue       | No delete endpoint                          | ✅ Met | No deletion route exists                |

---

## Test Coverage

| Test File                                                                           | Coverage Area                 |
| ----------------------------------------------------------------------------------- | ----------------------------- |
| `lib/rules/advancement/__tests__/approval.test.ts`                                  | Core approval/rejection logic |
| `app/api/characters/[characterId]/advancement/[recordId]/__tests__/approve.test.ts` | Approve API                   |
| `app/api/characters/[characterId]/advancement/[recordId]/__tests__/reject.test.ts`  | Reject API                    |

---

## Conclusion

The Governance Approval capability is **fully implemented** with comprehensive support for GM approval workflows, self-approval prevention, mandatory rejection justification, and automatic resource restoration.

**Verification Date:** 2025-12-30  
**Verified By:** AI Audit
