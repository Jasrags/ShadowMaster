# Architecture Decision Records (ADRs)

## Purpose

Architecture Decision Records document **why specific architectural choices were made**.

They capture context, tradeoffs, and consequences at the moment a decision was
necessary, preserving reasoning that would otherwise be lost over time.

In an AI-first development environment, ADRs provide essential constraint and
rationale context that capabilities intentionally omit.

---

## What an ADR Is

An ADR records:

- A significant architectural decision
- The context that required a decision
- The choice that was made
- The consequences of that choice
- The alternatives that were considered

ADRs answer the question:

> **“Why is the system this way?”**

---

## What an ADR Contains

Each ADR follows a consistent structure:

### Title

- Concise and descriptive
- Often prefixed with the relevant domain or capability

### Decision

- A clear, declarative statement of what was decided
- No implementation detail

### Context

- The problem, forces, or constraints that made a decision necessary
- References relevant capabilities when applicable

### Consequences

- Expected outcomes, benefits, and tradeoffs
- Includes both positive and negative impacts

### Alternatives Considered

- Other viable options and why they were not chosen

---

## What an ADR Must NOT Contain

ADRs must not include:

- Step-by-step implementation details
- Code-level descriptions
- UI designs
- Temporary progress notes
- Restatements of capability guarantees

ADRs explain _why_, not _how_.

---

## Relationship to Capabilities

- Capabilities define **stable guarantees**
- ADRs explain **decisions made to support or constrain those guarantees**

A capability may be supported by multiple ADRs over time.
An ADR should generally reference the capability it affects.

Capabilities should not be modified to reflect a decision;
instead, the decision is recorded here.

---

## ADR Lifecycle

- ADRs are append-only
- Past decisions are not rewritten or erased
- If a decision changes, a new ADR is created that supersedes the old one

This preserves historical context and prevents decision churn.

---

## How ADRs Are Used

ADRs are used to:

- Prevent repeated debates over settled decisions
- Provide context for future changes
- Help AI agents reason within intended constraints
- Explain non-obvious system behavior
- Support onboarding and long-term maintenance

When encountering a design constraint, ask:

> Is this a guarantee (capability) or a choice (ADR)?

---

## Naming and Organization

- ADR filenames should be descriptive and stable
- Domain or capability prefixes are recommended for clarity
- Files live in this folder regardless of implementation location

---

## ADR Index

| #   | ADR                                                                              | Domain    | Summary                                                                                       |
| --- | -------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------- |
| 001 | [Account Security Defense](./001-security.account-security-defense.md)           | Security  | Multi-layered defense: lockouts, rate limiting, session revocation, audit logging             |
| 002 | [Multi-Edition Sandbox](./002-ruleset.multi-edition-sandbox.md)                  | Ruleset   | Strict data/logic isolation between Shadowrun editions                                        |
| 003 | [Rule Merging Strategies](./003-ruleset.rule-merging-strategies.md)              | Ruleset   | Deterministic merge/replace/append/remove strategies for books                                |
| 004 | [Hybrid Snapshot Model](./004-ruleset.hybrid-snapshot-model.md)                  | Ruleset   | Live/Snapshot/Delta layers for character-ruleset synchronization                              |
| 005 | [Modular Step Wizard](./005-character.modular-step-wizard.md)                    | Character | Data-driven, ruleset-defined character creation wizard                                        |
| 006 | [File-Based Persistence](./006-storage.file-based-persistence.md)                | Storage   | JSON files with atomic writes; recognized as MVP-only                                         |
| 007 | [Character Authorization Model](./007-security.character-authorization-model.md) | Security  | Context-aware multi-role authorization (owner, GM, player, admin)                             |
| 008 | [Cookie-Based Sessions](./008-security.cookie-based-sessions.md)                 | Security  | httpOnly cookies with session versioning for instant revocation                               |
| 009 | [Append-Only Ledger Pattern](./009-storage.append-only-ledger-pattern.md)        | Storage   | Immutable transaction logs for karma, favors, actions, audits                                 |
| 010 | [Inventory State Management](./010-gear.inventory-state-management.md)           | Gear      | Unified gear state model: equipment readiness, per-item wireless, device condition, magazines |
| 011 | [Sheet-Driven Creation](./011-character.sheet-driven-creation.md)                | Character | Character creation on the sheet interface; extends ADR-005 wizard approach                    |

---

## Prompts and Automation

AI-first development relies on consistent application of the "Capabilities and Decisions" model. The following prompts are available to help maintain and extend this documentation:

### Core Model & Guidance

- [Explain the Model](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/0_explain_the_capabilities_&_decisions_model.md): Use this to onboard new agents or refresh understanding of the architectural decisions vs. system invariants.
- [Prompting Best Practices](file:///Users/jrags/Code/Jasrags/shadow-master/docs/prompts/governance/prompting_best_practices.md): General guidelines for effective AI collaboration in this repository.

### Document Generation

- [1. Generate Capability Doc](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/1_prompt-generate-cabability-doc.md): Use this when extraction of system-level outcome guarantees is needed from a specification.
- [2. Generate ADR](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/2_prompt-generate-adr.md): Use this to capture the "why" behind an architectural choice, ensuring the decision is documented separately from the capability itself.
- [3. Generate Implementation Plan](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/3_prompt-generate-implementation-plan.md): Use this to transition from Capability guarantees to a technical blueprint.
- [4. Execute Implementation Plan](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/4_prompt-execute-implementation-plan.md): Use this to generate code diffs that are anchored to the implementation plan and system constraints.
- [5. Generate Walkthrough](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/5_prompt-generate-walkthrough.md): Use this to audit code against capabilities and document proof of work.

---

## Audience

- Senior engineers
- Architects
- Technical leads
- AI agents reasoning about system design

This folder documents institutional knowledge.
Treat it as part of the system’s long-term memory.
