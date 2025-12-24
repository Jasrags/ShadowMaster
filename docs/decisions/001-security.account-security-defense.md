# ADR-001.security: Account Security Defense

## Decision

The system MUST incorporate a multi-layered defense strategy for user account security, encompassing:

- **Temporary Account Lockout**: Triggered by repeated authentication failures to impede automated brute-force discovery.
- **Hierarchical Rate Limiting**: Enforced per-account and per-source identifier for all authentication and registration surfaces.
- **Atomic Session Revocation**: Immediate global invalidation of all active authentication tokens upon security-sensitive state changes (specifically password modifications).
- **Security Audit Logging**: Precise records of all authentication lifecycle events and account state transitions.

## Context

User accounts represent the primary attack surface for credential-based incursions. Without defensive measures, the system is vulnerable to automated brute-force attacks, credential stuffing, and session hijacking. A secure baseline is required to maintain system trust without compromising the experience for legitimate participants.

The tension lies in balancing security rigor with accessibility. Indefinite lockouts or overly aggressive rate limiting can facilitate denial-of-service attacks by malicious actors against legitimate users. Furthermore, a password change—often an indicator of compromise—is only effective if it guarantees that any existing unauthorized access is immediately terminated across all platforms. Descriptive auditing is necessary to provide the visibility required for post-incident analysis and real-time security monitoring.

## Consequences

### Positive

- **Attack Resilience**: Enhanced defense against automated credential attacks through purposeful latency and volume restriction.
- **Guaranteed Termination**: Certainty that session hijacking windows are closed upon password recovery or reset.
- **High Observability**: Improved auditability and oversight of account lifecycle events.
- **Contractual Stability**: Implementation-agnostic security guarantees that remain valid across different technology stacks.

### Negative

- **Legitimate Friction**: Potential for temporary self-denial of service for users who repeatedly mis-enter credentials.
- **Storage Overhead**: Increased persistence requirements for long-term security audit records.
- **Architectural Constraints**: Session management must support coordinated invalidation mechanisms.

## Alternatives Considered

- **Indefinite Account Lockout**: Rejected. Facilitates permanent denial of service by third parties and introduces excessive administrative overhead.
- **Client-Side Rate Limiting Only**: Rejected. Easily bypassed and provides no protection for system resources or account integrity.
- **Lazy Session Invalidation**: Rejected. Leaves a significant security window open after a password change where unauthorized sessions could remain active.
