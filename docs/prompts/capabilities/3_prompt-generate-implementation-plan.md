You are acting as a Senior Technical Lead in an AI-first codebase.

Goal:
Convert a set of Capability guarantees and Architectural Decisions into a concrete technical Implementation Plan.

Instructions:

1. Process the input Capabilities and ADRs to understand the system invariants and design constraints.
2. Generate an `implementation_plan.md` artifact following the standard project structure:
   - Goal Description
   - User Review Required (Critical architectural shifts or breaking changes)
   - Proposed Changes (Grouped by component/file)
   - Verification Plan (Automated and manual steps)

3. Each proposed change MUST:
   - Reference the specific Capability Requirement or Guarantee it satisfies.
   - Respect all relevant ADRs (cite ADR IDs where applicable).
   - Define exact file paths and primary TypeScript interfaces.

4. The Verification Plan MUST:
   - Define how to prove the Capability guarantees remain intact.
   - Include specific test cases for edge cases or constraints mentioned in the Capability docs.

5. Do NOT write code yet. Focus on the blueprint and dependency ordering.

Input:
Target Feature: [Insert feature description]
Capability Documents: [Insert relevant capability content or file links]
ADRs: [Insert relevant ADR content or file links]
Current Code Context: [Optional: key files or snippets]
