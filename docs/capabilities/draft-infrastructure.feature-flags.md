# Feature Flag Infrastructure Capability

> [!NOTE] > **Draft Status:** This capability is in draft. This is a cross-cutting infrastructure capability that enables progressive feature rollouts and edition-specific functionality.

## Purpose

The Feature Flag Infrastructure capability ensures controlled and configurable activation of system features across different contexts. It provides a self-hosted flag management system with edition-specific targeting, user segment controls, and environment-aware evaluation, enabling safe progressive rollouts and edition-specific feature gating without redeployment.

## Guarantees

- Flag evaluation MUST be consistent for the same context inputs.
- Flag state changes MUST take effect without application restart.
- The system MUST provide sensible defaults when flag service is unavailable.
- Flag evaluation MUST NOT introduce perceptible latency to user-facing operations.
- All flag changes MUST be auditable with attribution and timestamp.

## Requirements

### Flag Types

- The system MUST support **boolean flags** (on/off toggles).
- The system MUST support **multivariate flags** (string, number, or JSON values).
- The system MUST support **percentage rollout** flags for gradual enablement.
- Each flag MUST have a defined default value for fallback scenarios.
- Flags MUST be uniquely identified by a string key.

### Edition-Specific Targeting

- The system MUST support targeting flags by **Shadowrun edition** (SR1-SR6, Anarchy).
- Edition targeting MUST integrate with the ruleset system to determine active edition.
- Flags MAY have different values per edition (e.g., feature X enabled for SR5, disabled for SR6).
- Edition-specific flag overrides MUST be explicitly configurable.
- The system MUST support "all editions" as a default target.

### User and Segment Targeting

- The system MUST support targeting flags by **user ID** for individual opt-in/opt-out.
- The system MUST support targeting by **user role** (GM, player, admin).
- The system MUST support targeting by **campaign membership**.
- The system MAY support custom segments defined by arbitrary user attributes.
- Targeting rules MUST be combinable (AND/OR logic).

### Environment Management

- The system MUST maintain separate flag states per **environment** (development, staging, production).
- Environment configuration MUST be isolated to prevent cross-contamination.
- Flag definitions MUST be promotable across environments.
- Production flag changes MUST require explicit confirmation.

### Server and Client Evaluation

- The system MUST support **server-side flag evaluation** for API routes and SSR.
- The system MUST support **client-side flag evaluation** for React components.
- Client-side evaluation MUST receive resolved flag values, not evaluation logic.
- Client flag state MUST be initialized during SSR to prevent flicker.
- Flag updates SHOULD be propagated to clients without full page refresh.

### Flag Lifecycle

- The system MUST track flag creation, modification, and deletion events.
- The system MUST support **flag archival** for deprecated features.
- Archived flags MUST remain queryable for historical reference.
- The system SHOULD warn when code references an archived or unknown flag.
- Flags MUST support descriptive metadata (name, description, owner, tags).

### Configuration Storage

- Flag configurations MUST be stored in a persistent, self-hosted data store.
- The system MUST support loading flags from **JSON configuration files** for simple deployments.
- The system MAY support loading flags from a **database** for dynamic management.
- Configuration MUST be cacheable to minimize repeated reads.
- Cache invalidation MUST occur within configurable time bounds.

### Administration Interface

- The system MUST provide an API for flag CRUD operations.
- The system MAY provide a web-based administration UI for flag management.
- Administration operations MUST be restricted to authorized users (admin role).
- Bulk operations (enable/disable multiple flags) MUST be supported.

### Audit and Observability

- All flag state changes MUST be logged with:
  - Timestamp
  - User who made the change
  - Previous and new values
  - Affected environments
- Flag evaluation metrics MAY be collected for usage analysis.
- The system MUST support querying flag change history.

---

## Recommended Tooling

For a self-hosted deployment with Next.js and TypeScript:

| Tool               | Notes                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| **Unleash**        | Open-source, excellent Next.js SDK, self-hosted, gradual rollout support |
| **Flagsmith**      | Open-source, strong TypeScript support, self-hosted or on-premise        |
| **Custom JSON/DB** | Simple implementation for MVP, migrate to platform later                 |

### Development Testing

- Development environments MUST support flag overrides via:
  - Environment variables
  - Query parameters (development mode only)
  - Local configuration file overrides
- Test suites MUST be able to set flag values programmatically.

---

## Constraints

- Flag evaluation MUST complete within 10ms for cached values.
- The system MUST function with degraded capability if flag service is unreachable.
- Flag keys MUST follow a consistent naming convention (e.g., `feature.vtt.dynamicLighting`).
- Production flag changes MUST NOT require code deployment.
- Client-side flag bundles MUST NOT expose sensitive targeting rules.

## Non-Goals

- This capability does not provide A/B testing or experimentation analytics.
- This capability does not provide user session recording or heatmaps.
- This capability does not define specific features to be flagged.
- This capability does not address feature flag content (that's per-capability).

## Dependencies

- `security.account-governance` - User identity for targeting.
- `ruleset.discovery` - Edition context for edition-specific targeting.

## Dependents

The following capabilities may use feature flags:

- `vtt.tactical-display` - Progressive rollout of VTT features.
- `mechanics.magic-mastery` - Edition-specific magic rule variations.
- `campaign.async-play` - Beta feature gating.
