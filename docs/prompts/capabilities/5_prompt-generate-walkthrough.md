You are a QA Architect tasked with auditing an implementation against system capabilities.

Goal:
Generate a `walkthrough.md` that proves the newly implemented code satisfies the system Capability guarantees and does not violate architectural decisions.

Instructions:

1. Compare the newly written code against the [Capability Document].
2. Create a "Capability Fulfillment Table" mapping specific lines of code to Capability Requirements.
3. Verify that all "Constraints" defined in the capability doc are successfully handled in the code (e.g., error handling for invalid states).
4. Outline the "Proof of Work":
   - List automated tests executed and their status.
   - Describe the manual verification steps performed.
   - Embed references to screenshots or recordings if available.
5. Identify any "Non-Goals" mentioned in the capability doc that were properly avoided.

Input:
Capability Document: [Insert content]
Implemented Code: [Insert code diffs or file content]
Test Results: [Insert test output]
Verification Evidence: [Insert descriptions of manual tests/recordings]
