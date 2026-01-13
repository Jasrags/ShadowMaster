# ADR-008.security: Cookie-Based Sessions

## Decision

The system MUST use **httpOnly, secure cookies** for session management rather than JWT tokens or OAuth flows. Sessions are identified by a compound value containing the user ID and a session version number:

```
session={userId}:{sessionVersion}
```

Session validity is determined by:

1. Presence of the session cookie
2. Existence of the referenced user
3. Match between the cookie's version and the user's current `sessionVersion` field

## Context

Web authentication requires a mechanism to identify users across requests. The primary options are:

- **Stateless tokens (JWT)**: Self-contained, cryptographically signed tokens that encode user identity and claims.
- **Server-side sessions**: Session identifiers that reference server-stored state.
- **Cookie-based sessions**: A hybrid where minimal state (user ID) is stored in cookies, with validation against server data.

Shadow Master chose cookie-based sessions because:

- **Simplicity**: No token signing, refresh logic, or key rotation required.
- **Revocation Support**: Incrementing `sessionVersion` immediately invalidates all existing sessions (critical for password changes per ADR-001).
- **httpOnly Protection**: Cookies marked httpOnly cannot be accessed by JavaScript, mitigating XSS token theft.
- **Automatic Transmission**: Browsers automatically include cookies in requests, simplifying client code.

The session version mechanism provides a **global session kill switch**:

- When a user changes their password, `sessionVersion` is incremented.
- All existing cookies with the old version become invalid on next validation.
- No session database or token blacklist is required.

## Consequences

### Positive

- **Instant Revocation**: Password changes invalidate all sessions across all devices immediately.
- **XSS Mitigation**: httpOnly cookies cannot be exfiltrated by malicious scripts.
- **No Token Management**: No refresh tokens, no token storage, no expiration handling on the client.
- **CSRF Protection**: SameSite=Lax provides baseline CSRF protection.

### Negative

- **Server Validation Required**: Every request requires a user lookup to validate the session version.
- **No Stateless Scaling**: Unlike JWTs, sessions cannot be validated without database access.
- **Cookie Size Limits**: While not a concern for this simple format, cookies have size restrictions (~4KB).
- **Cross-Origin Complexity**: Cookies require careful configuration for cross-origin scenarios.

## Session Configuration

| Property | Value               | Rationale                                 |
| -------- | ------------------- | ----------------------------------------- |
| Name     | `session`           | Simple, conventional                      |
| Duration | 7 days              | Balance between convenience and security  |
| httpOnly | `true`              | Prevent JavaScript access                 |
| Secure   | `true` (production) | HTTPS only in production                  |
| SameSite | `Lax`               | CSRF protection while allowing navigation |
| Path     | `/`                 | Available to all routes                   |

## Alternatives Considered

- **JWT (JSON Web Tokens)**: Rejected. Revocation requires token blacklists or short expiration with refresh tokens, adding complexity. The claimed "stateless" benefit is lost when revocation is required.
- **OAuth/OIDC**: Rejected. External identity providers add infrastructure dependencies inappropriate for an MVP. May be reconsidered for enterprise deployments.
- **Session Database (Redis)**: Rejected. Adds infrastructure overhead. The current approach achieves revocation without external state stores.
- **Signed Cookies**: Rejected. Would require key management and doesn't provide revocation without version tracking anyway.

## Related Capabilities

- `security.account-security` - Session invalidation on password change
- `security.account-governance` - User session lifecycle

## Related ADRs

- ADR-001: Account Security Defense (defines the requirement for atomic session revocation)
