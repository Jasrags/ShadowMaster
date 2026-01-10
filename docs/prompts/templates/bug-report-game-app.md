# Bug Report Template

## (Tailored for Game/Character Management Applications)

## Basic Information

**Title:** [Brief, descriptive title]
**Severity:** [Critical/High/Medium/Low]
**Priority:** [P0/P1/P2/P3]
**Reported By:** [Your name]
**Date:** [Date]
**Environment:** [Production/Staging/Development]
**Edition:** [Which edition is affected? e.g., SR5, All editions]
**Character Creation Method:** [If applicable: Priority, Point Buy, Life Path, etc.]

---

## Description

**What happened?**
[Clear, concise description of the bug]

**What did you expect to happen?**
[Expected behavior based on game rules]

**What actually happened?**
[Actual behavior - incorrect calculation, validation error, etc.]

**Game Rules Reference:**

- [Edition: e.g., SR5]
- [Rulebook: e.g., Core Rulebook]
- [Page/Section: e.g., p. 65, Character Creation]
- [Expected rule: e.g., "Priority A should allocate 24 attribute points"]

---

## Steps to Reproduce

1. [Step 1: e.g., "Select SR5 edition"]
2. [Step 2: e.g., "Choose Priority creation method"]
3. [Step 3: e.g., "Assign Priority A to Attributes"]
4. [Step 4: e.g., "Observe incorrect point allocation"]
5. [Additional steps...]

**Reproducibility:** [Always/Sometimes/Rarely - % of time]

**Character Data:**

- [If applicable, provide character data that triggers the bug]

---

## Environment Details

**Browser/Platform:**

- Browser: [e.g., Chrome 120, Firefox 121, Safari 17]
- OS: [e.g., macOS 14.2, Windows 11, iOS 17]
- Device: [Desktop/Mobile/Tablet - Model if relevant]

**Application Version:**

- Version: [e.g., v1.2.3]
- Build: [e.g., commit hash, build number]

**Game Configuration:**

- Edition: [e.g., SR5]
- Creation Method: [e.g., Priority]
- Books/Modules Loaded: [e.g., Core, Run & Gun]
- House Rules: [If applicable]

---

## Error Details

**Error Message:**

```
[Paste error message here]
```

**Console Errors:**

```
[Paste console errors here]
```

**Calculation Errors:**

- [If calculation is wrong, show expected vs actual]
- [Example: "Expected: 24 attribute points, Got: 20 attribute points"]

**Validation Errors:**

- [If validation is incorrect, describe what should/shouldn't validate]
- [Example: "Character incorrectly flagged as invalid when it should be legal"]

**Network Errors:**

- [API endpoint that failed]
- [HTTP status code]
- [Response body if available]

**Stack Trace:**

```
[Paste stack trace if available]
```

---

## Game Rules Impact

**Rule Violation:**
[If the bug causes a rule violation, describe it]

**Correct Behavior:**
[What the correct behavior should be according to rules]

**Affected Game Mechanics:**

- [Mechanic 1: e.g., Attribute allocation]
- [Mechanic 2: e.g., Skill point calculation]
- [Mechanic 3: e.g., Dice pool generation]

---

## Visual Evidence

**Screenshots:**

- [Attach screenshots showing the bug]
- [Show incorrect calculations or validation errors]
- [Include character sheet if relevant]

**Screen Recording:**

- [Link to video/GIF if available]

**Before/After:**

- [If applicable, show expected vs actual]
- [Example: "Expected dice pool: 9, Actual: 7"]

**Character Data:**

```json
// If applicable, provide character JSON that demonstrates the bug
{
  "edition": "SR5",
  "attributes": {...},
  "skills": {...}
}
```

---

## Impact

**User Impact:**

- [How many users affected?]
- [Can users work around this?]
- [Does this prevent character creation/use?]

**Game Impact:**

- [Does this create illegal characters?]
- [Does this break game balance?]
- [Does this cause incorrect gameplay calculations?]

**Affected Features:**

- [List features that are broken or impacted]
- [Character creation, validation, calculations, etc.]

**Data Integrity:**

- [Are existing characters affected?]
- [Is data corrupted?]

---

## Additional Context

**Related Issues:**

- [Link to related bugs/features]

**Recent Changes:**

- [Any recent deployments or code changes]
- [When did this start happening?]
- [Recent ruleset updates?]

**Known Workarounds:**

- [If users have found workarounds, describe them]

**Community Reports:**

- [If others have reported similar issues]

**Ruleset Information:**

- [Ruleset version if applicable]
- [Book/module versions loaded]

---

## Proposed Solution (Optional)

[If you have ideas on how to fix this, describe them here]

**Suggested Fix:**

- [Technical approach]
- [Rule reference for correct implementation]

**Test Cases:**

- [Specific test cases that should catch this]
- [Character builds to verify fix]
