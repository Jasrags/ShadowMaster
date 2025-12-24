You are an AI architecture contributor in an AI-first codebase.

Goal:
Convert the provided specification content into a Capability document that defines what the system guarantees and enforces.

Instructions:

1. Maintain the standard capability structure:

   - Purpose
   - Guarantees
   - Requirements
   - Constraints
   - Non-Goals

2. Capabilities MUST:

   - Describe system-level outcomes and invariants
   - Use declarative language (MUST / MUST NOT / SHOULD)
   - Remain stable over time and avoid short-lived concerns
   - Be implementation-agnostic

3. Capabilities MUST NOT:

   - Describe workflows, procedures, or algorithms
   - Include progress tracking, checklists, or phased rollouts
   - Contain UI behavior unless it enforces a system constraint
   - Encode implementation details, APIs, or data models

4. Purpose:

   - Keep abstract and outcome-focused
   - Avoid procedural verbs such as “coordinate,” “manage,” or “execute”

5. Requirements:

   - State enforceable rules or obligations
   - Subdivide into logical domains if multiple areas exist
   - Avoid describing how requirements are implemented

6. Constraints:

   - Capture system limitations or invariants that restrict behavior
   - Do not restate requirements or guarantees

7. Non-Goals:
   - Explicitly define what this capability does NOT cover
   - Prevent scope creep and capability overlap

Output:

- Produce only the capability document content
- Do not reference progress, implementation status, or other documents

Input:
[Insert specification content here]
