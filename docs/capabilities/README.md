# Capabilities Documentation

## Purpose

Capability documents define **what the system guarantees**.

They describe the stable, long-lived responsibilities of the system in
declarative, outcome-focused terms. Capabilities are the primary source of truth
for _what must always be true_ about system behavior, regardless of
implementation, technology, or UI.

In an AI-first development environment, capabilities serve as the **contract**
that both humans and AI agents reason against.

---

## What a Capability Is

A capability describes:

- A coherent system responsibility or domain concern
- The guarantees the system provides to its users or other systems
- The constraints under which those guarantees hold
- The explicit non-goals that are out of scope

Capabilities answer the question:

> **“What must this system always guarantee?”**

---

## What a Capability Contains

Each capability document follows a standard structure:

### Purpose

- A concise, abstract description of the outcome the capability exists to ensure
- Written at the _intent_ level, not the process level
- Stable over time

### Guarantees

- Declarative statements of what the system MUST provide
- Observable outcomes, not internal mechanics
- Suitable for validation, audit, and reasoning

### Requirements

- Conditions the system MUST satisfy to uphold the guarantees
- Grouped by logical domains when appropriate
- Still declarative, not procedural

### Constraints

- Limits, invariants, or restrictions the system MUST respect
- Cross-capability interactions or safety boundaries often belong here

### Non-Goals

- Explicit exclusions
- Clarifies what this capability intentionally does NOT cover
- Prevents scope creep and misinterpretation

---

## What a Capability Must NOT Contain

Capabilities must not include:

- Implementation details
- Algorithms, data structures, or APIs
- UI layouts or workflows
- Progress updates or roadmap information
- Rationale or tradeoff explanations (these belong in ADRs)
- Temporary or experimental behavior

If a statement explains _why_ a choice was made, it likely belongs in an ADR.
If it explains _how_ something works, it likely belongs elsewhere.

---

## Why Capabilities Are Stable and Long-Lived

Capabilities are designed to change **slowly**.

- Implementations may evolve
- Technologies may be replaced
- UX may change
- AI agents may come and go

But the guarantees the system provides should remain consistent.
When a guarantee truly changes, that represents a meaningful architectural shift.

---

## How Capabilities Are Used

Capabilities are used to:

- Guide feature design and implementation
- Evaluate whether new work fits existing responsibilities
- Detect gaps or overlaps in system behavior
- Anchor AI reasoning and reduce hallucination
- Audit documentation coverage and system completeness

When adding new behavior, first ask:

> Does this belong to an existing capability, or does it require a new one?

---

## Relationship to ADRs

Capabilities define **what must be true**.  
Architecture Decision Records (ADRs) define **why certain choices were made** to support those guarantees.

Capabilities should not be rewritten to reflect decisions.
Instead, decisions reference capabilities.

---

## Prompts and Automation

AI-first development relies on consistent application of the "Capabilities and Decisions" model. The following prompts are available to help maintain and extend this documentation:

### Core Model & Guidance

- [Explain the Model](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/0_explain_the_capabilities_&_decisions_model.md): Use this to onboard new agents or refresh understanding of the system invariants vs. architectural decisions.
- [Prompting Best Practices](file:///Users/jrags/Code/Jasrags/shadow-master/docs/prompts/governance/prompting_best_practices.md): General guidelines for effective AI collaboration in this repository.

### Document Generation

- [1. Generate Capability Doc](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/1_prompt-generate-cabability-doc.md): Use this when you have a feature specification and need to extract the stable system guarantees into a new capability document.
- [2. Generate ADR](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/2_prompt-generate-adr.md): Use this to capture the "why" behind an architectural choice, ensuring the decision is documented separately from the capability itself.
- [3. Generate Implementation Plan](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/3_prompt-generate-implementation-plan.md): Use this to transition from Capability guarantees to a technical blueprint.
- [4. Execute Implementation Plan](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/4_prompt-execute-implementation-plan.md): Use this to generate code diffs that are anchored to the implementation plan and system constraints.
- [5. Generate Walkthrough](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/prompts/5_prompt-generate-walkthrough.md): Use this to audit code against capabilities and document proof of work.

---

## Audience

- Senior engineers
- Technical leads
- Architects
- AI agents operating in this codebase

This folder is authoritative. Treat changes with care.
