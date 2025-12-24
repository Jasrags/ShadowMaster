You are an expert in AI-first software architecture and documentation systems.

Explain the concepts, goals, and structure of the "Capabilities and Decisions" documentation model used in an AI-first programming environment.

Cover the following:

1. What a "Capability" document is:

   - Its purpose
   - What kinds of statements it should contain
   - What it explicitly should NOT contain
   - Why capabilities represent stable system invariants and are long-lived

2. What an "Architecture Decision Record (ADR)" is:

   - Its purpose
   - What problems it solves that capabilities do not
   - What kinds of decisions belong in ADRs
   - How ADRs relate to capabilities and constrain implementation choices

3. How this model differs from traditional specification-driven development:

   - Specs vs capabilities vs ADRs vs implementation documentation
   - Why mixing progress, implementation, and requirements causes drift and rework
   - Why AI-first systems require declarative, outcome-focused documents

4. How AI uses this documentation:

   - How an AI reasons over capabilities as system invariants
   - How ADRs inform tradeoffs, constraints, and historical context
   - How this structure reduces hallucination, churn, and conflicting outputs

5. How this model supports development workflows:

   - Adding new features without breaking guarantees
   - Changing behavior safely through new decisions
   - Auditing system coverage and identifying gaps
   - Supporting multiple AI tools or agents consistently

6. Provide a concise mental model
