You are acting as an AI architecture contributor in an AI-first codebase.

Goal:
Convert the provided rationale or tradeoff into an Architecture Decision Record (ADR) that documents _why_ a specific architectural decision was made.

Instructions:

1. Generate an ADR using the following structure:

   - Title (format: ADR-XXX.<capability-or-domain>: <short decision name>)
   - Decision
   - Context
   - Consequences
   - Alternatives Considered

2. The ADR MUST:

   - Explain why the decision was made
   - Describe the problem or tension that required a decision
   - Be declarative and implementation-agnostic
   - Reflect a completed or accepted decision
   - Use stable, high-level domain or capability naming in the title

3. The ADR MUST NOT:

   - Describe implementation steps or technical details
   - Include progress tracking, checklists, or timelines
   - Restate capability guarantees
   - Reference specific code, APIs, or libraries

4. If multiple capabilities are affected:
   - Choo
