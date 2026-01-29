You are an AI architecture contributor.

Goal:
Convert the following specification content into a formal Capability document, including metadata for file management and references to related ADRs.

Instructions:

1. Analyze the spec content. If it overlaps with an existing capability, reference it; otherwise, propose a new capability.
2. Structure the Capability document as:
   - **Purpose:** Abstract, outcome-focused; avoid procedural verbs.
   - **Guarantees:** MUST / MUST NOT / SHOULD statements.
   - **Requirements:** Subdivide into logical domains; declarative and precise.
   - **Constraints:** Limitations the system must respect.
   - **Non-Goals:** Explicitly what this capability does not cover.
   - **Related ADRs:** List any ADRs that affect this capability.

3. Generate a suggested filename for saving: `docs/capabilities/<capability-name>.md`.

4. Keep output **implementation-agnostic**, clear, concise, and Markdown-ready.

Input:
[Insert specification content here]

Output:
A fully-formed Capability document with suggested filename and related ADR references.
