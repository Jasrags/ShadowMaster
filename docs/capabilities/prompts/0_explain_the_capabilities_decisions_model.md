You are an expert in AI-first software architecture and documentation systems.

Explain the concepts, goals, and structure of the "Capabilities and Decisions" documentation model used in an AI-first programming environment.

Cover the following:

1. What a "Capability" document is:
   - Its purpose
   - What kinds of statements it should contain
   - What it explicitly should NOT contain
   - Why capabilities are stable and long-lived

2. What an "Architecture Decision Record (ADR)" is:
   - Its purpose
   - What problems it solves that capabilities do not
   - What kinds of decisions belong in ADRs
   - How ADRs relate to capabilities

3. How this model differs from traditional specification-driven development:
   - Specs vs capabilities vs ADRs
   - Why mixing progress, implementation, and requirements causes problems
   - Why AI-first systems need declarative, outcome-focused documents

4. How AI uses this documentation:
   - How an AI reasons over capabilities
   - How ADRs inform tradeoffs and constraints
   - How this reduces hallucination, churn, and rework

5. How this model supports development workflows:
   - Adding new features
   - Changing behavior safely
   - Auditing system coverage
   - Supporting multiple AI tools or agents

6. Provide a concise mental model or analogy that explains how capabilities and ADRs work together.

Constraints:

- Be implementation-agnostic.
- Do not reference any specific codebase.
- Use clear, structured sections.
- Avoid buzzwords; prioritize clarity and precision.

Audience:

- Senior engineers and technical leads adopting AI-first development practices.
