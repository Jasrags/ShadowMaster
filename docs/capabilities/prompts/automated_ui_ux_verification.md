**Automated UI/UX Verification: Plan Implementation Review**

## Context

You are a senior engineer with deep expertise in the Shadow Master codebase - a Shadowrun 5e campaign management application built with Next.js 16, React 19, and TypeScript. You have access to multiple testing tools to verify UI/UX implementations.

I have just completed implementing a feature based on a plan we previously discussed, and I need to verify the UI/UX changes are working as expected.

## Step 1: Plan Identification & UI/UX Scope

**First, help me confirm which implementation we're reviewing:**

Review our recent conversation and identify:

1. What feature/change was planned?
2. What UI/UX changes were part of this plan?
3. What user interactions need to be verified?

Then summarize:

- **Plan Name/Title:** [what you understand the plan to be]
- **UI/UX Changes:** [specific interface changes made]
- **User Workflows to Test:** [key interactions to verify]

**If there's any ambiguity, ask me to clarify before proceeding.**

---

## Step 2: Testing Strategy Selection

Based on the available testing tools in Shadow Master, recommend the best approach:

### Available Testing Tools

**1. Browser Automation (browser_eval MCP tool)**

- **Best For:** Ad-hoc visual verification, real browser testing, interactive testing
- **Strengths:** Immediate visual feedback, can interact with UI, tests actual rendering
- **Limitations:** Manual/interactive, not persistent, requires dev server running
- **When to Use:** Quick visual verification, checking layouts/styling, interactive flows

**2. Playwright E2E Tests (pnpm test:e2e)**

- **Best For:** Automated regression testing, user flows, CI/CD integration
- **Strengths:** Persistent tests, automated, catches regressions, visual comparisons
- **Limitations:** Requires test file to be written first, slower feedback loop
- **When to Use:** Long-term regression coverage, automated testing, complex workflows

**3. Vitest + React Testing Library**

- **Best For:** Component behavior, props validation, state management
- **Strengths:** Fast, unit-level testing, good for logic verification
- **Limitations:** No visual rendering, requires mocks, doesn't test actual appearance
- **When to Use:** Component logic, prop handling, state changes (not visual verification)

**4. Next.js Runtime (nextjs_index/nextjs_call MCP)**

- **Best For:** Detecting runtime errors, build issues, API route testing
- **Strengths:** Catches runtime errors, verifies compilation
- **Limitations:** Doesn't test visual appearance or user interactions
- **When to Use:** Runtime error detection, build verification

### Recommended Approach

For UI/UX verification, I recommend a **two-phase approach**:

**Phase 1: Quick Visual Verification (Browser Automation)**

- Use `browser_eval` to immediately verify visual changes
- Test user interactions in real browser
- Confirm layouts, styling, and workflows work as expected
- Fast feedback loop for iteration

**Phase 2: Regression Coverage (Playwright E2E)**

- Write E2E tests to lock in correct behavior
- Ensure changes don't break in future
- Automated testing in CI/CD
- Long-term protection

**Ask me:** "Would you like me to proceed with Phase 1 (browser automation), Phase 2 (E2E tests), or both?"

---

## Step 3: Browser Automation Test Plan

### Prerequisites Check

Before I can run browser automation testing:

**Required:**

- [ ] Development server is running (typically `pnpm dev`)
- [ ] Server is accessible (usually `http://localhost:3000`)
- [ ] The feature is accessible in the current build

**Ask me:** "Is your dev server currently running? If so, what URL is it running on?"

### Test Scenarios

Based on the plan's UI/UX changes, I will test the following scenarios:

#### Visual Verification

- [ ] Layout matches expectations (columns, spacing, alignment)
- [ ] Colors and styling are correct
- [ ] Typography is appropriate
- [ ] Responsive behavior (if applicable)
- [ ] Visual states (default, hover, active, disabled, error)
- [ ] Loading states (if applicable)
- [ ] Icons and imagery render correctly

#### Interactive Testing

- [ ] User can navigate to the new/modified interface
- [ ] Form inputs work (typing, selecting, etc.)
- [ ] Buttons and controls trigger expected actions
- [ ] Validation messages appear appropriately
- [ ] Error states display correctly
- [ ] Success states work as expected
- [ ] Modal/dialog behavior (open, close, backdrop)
- [ ] Data persists correctly

#### User Workflows

- [ ] Primary user flow works end-to-end
- [ ] Alternative paths work (if applicable)
- [ ] Edge cases are handled (empty states, max values, etc.)
- [ ] Navigation/routing works correctly
- [ ] Data flows between screens/components

#### Accessibility Quick Check

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Tab order is logical

### Browser Automation Execution Plan

I will use the `browser_eval` tool to:

1. **Navigate to the feature**
   - Start at appropriate entry point
   - Navigate to the modified interface
   - Screenshot for documentation

2. **Test each UI element**
   - Interact with controls
   - Verify visual feedback
   - Check data changes
   - Screenshot key states

3. **Execute user workflows**
   - Complete primary flow
   - Test alternative paths
   - Verify error handling
   - Screenshot completion states

4. **Document findings**
   - Note what works correctly ✅
   - Identify visual issues ⚠️
   - Report broken functionality ❌
   - Suggest improvements 💡

---

## Step 4: E2E Test Writing Plan

If we proceed with Playwright E2E tests, I will:

### Test File Structure

```typescript
// tests/e2e/[feature-name].spec.ts

import { test, expect } from "@playwright/test";

test.describe("[Feature Name]", () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to starting point
  });

  test("[User Story]: [Expected Behavior]", async ({ page }) => {
    // Arrange: Set up test conditions
    // Act: Perform user actions
    // Assert: Verify expected outcomes
  });

  // Additional test cases...
});
```

### Test Coverage Areas

Based on the plan, I will write tests for:

- [ ] **Happy Path:** Primary user workflow works correctly
- [ ] **Validation:** Required fields/selections are enforced
- [ ] **Error Handling:** Invalid inputs show appropriate messages
- [ ] **Edge Cases:** Boundary conditions, empty states, maximum values
- [ ] **Visual Regression:** Key layouts match expected appearance
- [ ] **Accessibility:** Basic keyboard navigation and ARIA attributes

### Test Best Practices

- Use Page Object Model for reusable selectors
- Clear, descriptive test names
- Proper wait conditions (avoid arbitrary timeouts)
- Independent tests (no dependencies between tests)
- Clean up state after tests
- Visual regression screenshots where appropriate

---

## Output Format

### Report Destination

After completing the verification, save the report to:

```
docs/reviews/ui-ux-verifications/[feature-name]-verification-[YYYY-MM-DD].md
```

**Naming Convention:**

- Use kebab-case for feature name
- Include the date of the verification
- Example: `quality-selection-modal-verification-2026-01-31.md`

**Directory:** Create `docs/reviews/ui-ux-verifications/` if it doesn't exist.

### Report Structure

After testing, I will provide results in this format:

```markdown
# UI/UX Verification Report: [Feature Name]

## Test Environment

- **Date:** [timestamp]
- **URL:** [application URL]
- **Browser:** [browser used]
- **Testing Method:** [Browser Automation / E2E Tests / Both]

---

## Visual Verification Results

### ✅ Working Correctly

- [List elements/behaviors that work as expected]
- [Include screenshots if helpful]

### ⚠️ Visual Issues Found

- **Issue:** [Description]
  - **Expected:** [What should happen]
  - **Actual:** [What actually happens]
  - **Severity:** [Low/Medium/High]
  - **Screenshot:** [If available]

### ❌ Broken Functionality

- **Issue:** [Description]
  - **Steps to Reproduce:**
    1. [Step 1]
    2. [Step 2]
  - **Expected:** [Expected behavior]
  - **Actual:** [Actual behavior]
  - **Impact:** [User impact]

---

## User Workflow Testing

### Primary Flow: [Workflow Name]

- **Status:** [✅ Pass / ⚠️ Issues / ❌ Fail]
- **Steps Tested:**
  1. [Step] - [Result]
  2. [Step] - [Result]
- **Notes:** [Any observations]

### Alternative Flows

[Similar structure for alternative workflows]

---

## Accessibility Check

- **Keyboard Navigation:** [Pass/Fail/Notes]
- **Focus Management:** [Pass/Fail/Notes]
- **ARIA Labels:** [Pass/Fail/Notes]

---

## Performance Observations

- **Load Time:** [Subjective impression]
- **Interaction Responsiveness:** [Any lag or delays?]
- **Rendering Issues:** [Any visual glitches?]

---

## Recommendations

### Critical Fixes Required

1. [Issue that must be fixed]
2. [Another critical issue]

### Suggested Improvements

1. [UX enhancement suggestion]
2. [Polish opportunity]

### Future Considerations

1. [Long-term improvement]
2. [Technical debt to address]

---

## Screenshots

### [Screenshot 1 Title]

[Description of what screenshot shows]
[Screenshot]

### [Screenshot 2 Title]

[Description]
[Screenshot]

---

## E2E Test Coverage (if applicable)

### Tests Written

- [ ] `test/e2e/[feature].spec.ts` - [X] tests
  - [Test 1 name]
  - [Test 2 name]

### Test Execution Results

- **Total Tests:** [X]
- **Passed:** [X]
- **Failed:** [X]
- **Duration:** [X]ms

---

## Sign-off

**UI/UX Verification:** [✅ APPROVED / ⚠️ APPROVED WITH NOTES / ❌ NEEDS FIXES]

**Overall Assessment:**
[Summary of findings and recommendation]
```

---

## How to Use This Prompt

**To verify your UI/UX implementation:**

1. **Confirm the plan/feature** we're testing (or let me identify it)
2. **Start your dev server** (if using browser automation)
3. **Tell me your preference:**
   - Quick visual check only (browser automation)
   - Full E2E test coverage (Playwright tests)
   - Both (visual verification first, then write tests)

**I will then:**

- Identify the UI/UX changes from the plan
- Execute the appropriate testing strategy
- Provide detailed verification results
- Write E2E tests if requested
- Give you a clear sign-off on the UI/UX quality

---

**Ready to begin UI/UX verification? Please:**

1. Confirm which feature/plan we're testing
2. Let me know if your dev server is running (and the URL)
3. Tell me which testing approach you prefer
