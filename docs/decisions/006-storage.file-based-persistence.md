# ADR-006.storage: File-Based Persistence

## Decision

The system MUST use file-based JSON storage for all persistent entities (users, characters, campaigns, locations, combat sessions, etc.) rather than a traditional database system. All file operations MUST use atomic writes (temporary file + rename pattern) to prevent data corruption.

## Context

Shadow Master began as a rapid prototype requiring minimal infrastructure overhead. A file-based storage approach was chosen to:

- **Eliminate external dependencies**: No database server to configure, maintain, or pay for during development.
- **Simplify local development**: Contributors can clone the repository and run immediately without database setup.
- **Enable direct data inspection**: JSON files are human-readable, simplifying debugging and manual data corrections.
- **Support version control of test data**: Sample characters and rulesets can be committed alongside code.

The system stores data in a structured directory hierarchy:

```
/data
├── users/{userId}.json
├── characters/{userId}/{characterId}.json
├── campaigns/{campaignId}.json
├── locations/{campaignId}/{locationId}.json
├── combat/{sessionId}.json
└── editions/{editionCode}/...
```

All write operations follow an atomic pattern:
1. Write content to a temporary file (`{target}.tmp`)
2. Rename temporary file to target path
3. Filesystem guarantees atomicity of rename operations

This prevents partial writes from corrupting data if the process is interrupted.

## Consequences

### Positive

- **Zero Infrastructure**: No database installation, connection pooling, or schema migrations required.
- **Portability**: Data can be backed up, restored, or migrated by copying directories.
- **Transparency**: Data format is immediately inspectable without specialized tools.
- **Simplicity**: Storage layer is ~200 lines of TypeScript with no ORM complexity.

### Negative

- **No Concurrent Write Protection**: Multiple simultaneous writes to the same file may cause data loss. File locking is not implemented.
- **No Query Capability**: Finding entities requires loading files and filtering in memory (O(n) for list operations).
- **No Transactions**: Multi-entity updates cannot be rolled back atomically.
- **Not Horizontally Scalable**: Cannot distribute across multiple servers without a shared filesystem.
- **Memory Pressure**: Large datasets must be loaded entirely into memory for processing.

### Technical Debt

This architecture is explicitly recognized as **not production-ready**. A database migration (PostgreSQL or MongoDB) is planned for production deployment. The storage layer abstraction (`lib/storage/base.ts`) is designed to make this migration feasible without rewriting business logic.

## Alternatives Considered

- **SQLite**: Rejected for initial development. Would provide query capability and transactions, but adds complexity and doesn't solve horizontal scaling.
- **PostgreSQL/MongoDB**: Rejected for MVP phase. Correct long-term choice, but infrastructure overhead was deemed premature.
- **In-Memory Only**: Rejected. Data persistence across restarts is a core requirement.
- **LocalStorage/IndexedDB**: Rejected. Server-side persistence is required for multi-user scenarios.

## Related Capabilities

- All storage-dependent capabilities rely on this pattern
- `security.account-governance` - User data persistence
- `character.management` - Character data persistence
- `campaign.management` - Campaign data persistence

