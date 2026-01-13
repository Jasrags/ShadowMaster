# ADR-007.security: Character Authorization Model

## Decision

The system MUST implement a **context-aware, multi-role authorization model** for character access. Authorization decisions are based on the combination of:

1. **Actor Role**: The relationship between the requesting user and the target character
2. **Resource Context**: Whether the character is independent or campaign-linked
3. **Action Type**: The specific operation being attempted (view, edit, advance, delete)

The defined roles are:

- **Owner**: The user who created the character
- **GM**: A Game Master of the campaign the character is linked to
- **Player**: A non-GM member of the campaign
- **Admin**: A system administrator with elevated privileges
- **Guest**: An unauthenticated or unrelated user

Permissions are granted based on role and context according to a defined permission matrix.

## Context

Shadowrun characters exist in multiple contexts:

- **Independent characters** belong solely to their creator and require no external approval.
- **Campaign-linked characters** participate in shared games where Game Masters have authority over rule enforcement, advancement approval, and narrative control.

A simple "owner-only" model would prevent GMs from performing necessary campaign management tasks. Conversely, allowing any campaign member full access would violate player privacy and undermine character ownership.

The system must balance:

- **Player Autonomy**: Owners control their characters' fundamental identity
- **GM Authority**: Campaign runners can enforce rules and approve changes
- **Privacy**: Players should not see each other's private character details
- **Security**: Actions must be auditable and reversible

## Consequences

### Positive

- **Granular Control**: Different actions (view_basic, edit_mechanics, approve_advancement) can be gated independently.
- **Context Sensitivity**: The same user may have different permissions for the same character depending on campaign membership.
- **Explicit Permission Matrix**: Authorization rules are documented and testable.
- **Audit Trail Support**: Role information can be logged with each action for accountability.

### Negative

- **Complexity**: Authorization logic is distributed across multiple files and requires careful maintenance.
- **Performance Overhead**: Determining role requires loading campaign data in addition to character data.
- **Edge Cases**: Characters can be unlinked from campaigns, changing their authorization context mid-lifecycle.

## Permission Matrix

| Action              | Owner | GM  | Player | Admin | Guest |
| ------------------- | ----- | --- | ------ | ----- | ----- |
| View Basic Info     | ✓     | ✓   | ✓      | ✓     | ✓\*   |
| View Full Sheet     | ✓     | ✓   | ✗      | ✓     | ✗     |
| Edit Mechanics      | ✓     | ✓   | ✗      | ✓     | ✗     |
| Request Advancement | ✓     | ✗   | ✗      | ✓     | ✗     |
| Approve Advancement | ✗     | ✓   | ✗      | ✓     | ✗     |
| Delete Character    | ✓     | ✗   | ✗      | ✓     | ✗     |
| Transfer Ownership  | ✗     | ✗   | ✗      | ✓     | ✗     |

\*Guest access to basic info depends on campaign visibility settings.

## Alternatives Considered

- **Owner-Only Model**: Rejected. GMs cannot perform necessary campaign management tasks.
- **Role-Based Access Control (RBAC) with Global Roles**: Rejected. Does not account for per-campaign context. A user might be a GM in one campaign and a player in another.
- **Access Control Lists (ACLs)**: Rejected. Too granular; managing individual permission entries per character would be unwieldy.
- **Capability-Based Security**: Rejected. Tokens or capabilities that grant access would complicate the API and session management.

## Related Capabilities

- `character.management` - Character CRUD operations
- `character.advancement` - Advancement request and approval workflow
- `campaign.participant-governance` - Campaign membership and roles
- `campaign.governance-approval` - GM approval workflow
