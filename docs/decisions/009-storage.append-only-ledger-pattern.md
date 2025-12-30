# ADR-009.storage: Append-Only Ledger Pattern

## Decision

The system MUST use an **append-only ledger pattern** for recording all state-changing transactions that require auditability. Ledger entries are immutable once written; corrections are made by appending compensating entries rather than modifying or deleting existing records.

This pattern applies to:

- **Karma Transactions**: Character advancement history (karma earned, spent, refunded)
- **Favor Transactions**: Social capital exchanges with contacts
- **Action History**: Combat and gameplay actions for session replay
- **Audit Logs**: Security-critical events (logins, failures, account changes)

## Context

Role-playing game systems require:

- **Auditability**: GMs must be able to review how a character reached their current state.
- **Dispute Resolution**: When questions arise about validity, the historical record provides evidence.
- **Undo/Rejection**: Advancement requests may be rejected by GMs, requiring karma restoration.
- **Integrity**: Players should not be able to silently modify past transactions.

Traditional CRUD operations (update, delete) would allow records to be altered, destroying the audit trail. An append-only ledger preserves every state transition.

### Ledger Entry Structure

Each ledger entry contains:

```typescript
interface LedgerEntry {
  id: ID;                    // Unique entry identifier
  timestamp: string;         // ISO 8601 creation time
  type: TransactionType;     // e.g., "spend", "earn", "refund"
  amount: number;            // Quantity (positive or negative)
  reason: string;            // Human-readable description
  sourceId?: ID;             // Reference to originating entity
  metadata?: Record<string, unknown>; // Additional context
}
```

### Balance Calculation

Current balance is derived by summing all entries:

```typescript
const currentBalance = ledger.entries.reduce(
  (sum, entry) => sum + entry.amount,
  initialBalance
);
```

### Corrections via Compensating Entries

To "undo" a transaction (e.g., GM rejects an advancement):

1. Original entry remains in the ledger unchanged.
2. A new entry is appended with the inverse amount and a reference to the original.
3. Net effect: balance returns to pre-transaction state while history is preserved.

## Consequences

### Positive

- **Complete History**: Every state change is recorded permanently.
- **Tamper Evidence**: Modifications to the ledger file would be detectable through inconsistencies.
- **GM Oversight**: Game Masters can review the full advancement history of any character.
- **Reversibility**: Rejected advancements are handled by compensating entries, preserving both the request and rejection.
- **Debugging**: Issues can be diagnosed by replaying the transaction log.

### Negative

- **Storage Growth**: Ledgers grow indefinitely as entries accumulate. Long-running campaigns may have large files.
- **Performance**: Balance calculation requires reading the entire ledger. (Mitigated by caching current balance as a derived field.)
- **Complexity**: "Deleting" a transaction requires understanding compensating entries rather than simple removal.
- **No True Deletion**: GDPR/privacy requirements for data deletion would require ledger compaction (not yet implemented).

## Implementation Locations

| Ledger Type | File Location | Key Functions |
|-------------|---------------|---------------|
| Karma | Character JSON (`advancementHistory`) | `spendKarma()`, `recordAdvancement()` |
| Favor | `data/characters/{userId}/{charId}/favor-ledger.json` | `addFavorTransaction()` |
| Action | `data/characters/{userId}/{charId}/action-history.json` | `recordAction()` |
| Audit | `data/audit/{date}.log` | `AuditLogger.log()` |

## Alternatives Considered

- **Mutable Records with Soft Delete**: Rejected. "Deleted" records can still be shown/hidden, but modifications destroy original values.
- **Event Sourcing**: Considered but deemed over-engineered for current scale. The ledger pattern is a simplified subset of event sourcing that meets current needs.
- **Database Triggers/Temporal Tables**: Rejected. Would require database infrastructure (conflicts with ADR-006).
- **Periodic Snapshots Only**: Rejected. Loses granular history between snapshots.

## Related Capabilities

- `character.advancement` - Karma expenditure and history
- `campaign.social-governance` - Favor transactions with contacts
- `campaign.governance-approval` - Rejection workflow with karma refund
- `security.account-security` - Security audit logging

## Related ADRs

- ADR-006: File-Based Persistence (ledgers stored as JSON files)

