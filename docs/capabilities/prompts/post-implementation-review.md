**Senior Engineer Code Review: Plan Implementation Verification**

## Context

You are a senior engineer with deep expertise in the Shadow Master codebase - a Shadowrun 5e campaign management application built with Next.js 16, React 19, and TypeScript. You have intimate knowledge of the component architecture, state management patterns, data models, and testing practices used throughout the application.

I have just completed implementing a feature based on a plan we previously discussed and finalized.

## Step 1: Plan Identification

**Please help me confirm which implementation plan we're reviewing.**

Review the context of our recent conversation and identify:

1. What feature/change was planned?
2. What was the primary goal of this implementation?
3. Are there multiple plans we discussed that might cause confusion?

If you identify the plan clearly, state:

- **Plan Name/Title:** [what you understand the plan to be]
- **Core Functionality:** [brief description of what was implemented]
- **Key Components Changed:** [main areas affected]

If there's any ambiguity, ask me:

- "I see we discussed [Plan A] and [Plan B]. Which implementation are we reviewing?"
- "Can you confirm we're reviewing the plan for [specific feature]?"

**Once we've confirmed the correct plan, proceed to Step 2.**

---

## Step 2: Plan Review

Before diving into code review, let's ensure we're aligned on what was supposed to be implemented.

Please summarize your understanding of the plan including:

### Plan Requirements Checklist

- [ ] **Primary Feature:** What is the main functionality being added?
- [ ] **User Stories/Use Cases:** What can users now do that they couldn't before?
- [ ] **Business Rules:** What are the core rules/logic that must be enforced?
- [ ] **Data Model Changes:** What new data structures or schema changes were needed?
- [ ] **UI/UX Changes:** What new interfaces or modifications to existing interfaces were required?
- [ ] **Integration Points:** What existing systems/components needed to integrate with this?
- [ ] **Edge Cases:** What special scenarios needed handling?
- [ ] **Technical Constraints:** Any specific technical requirements or limitations?

**Ask me:** "Does this match your understanding of the plan? Should I proceed with the code review based on these requirements?"

---

## Step 3: Code Review Mission

Once we've confirmed the plan, conduct a thorough code review to ensure the implementation is **code complete** with **proper test coverage**. Approach this as if you're reviewing a critical pull request before it goes to production.

## Review Checklist

### 1. **Code Completeness**

Verify that ALL aspects of the plan are implemented:

**Requirements Traceability:**

- [ ] Every requirement from the plan has corresponding implementation
- [ ] No planned features are missing
- [ ] No unplanned features were added (scope creep)
- [ ] All acceptance criteria from the plan are met

**Data Model:**

- [ ] All required data structures are implemented
- [ ] Proper TypeScript types/interfaces for all new data
- [ ] Database schema changes (if applicable) are properly migrated
- [ ] Data validation logic is in place
- [ ] State management follows established patterns

**Business Logic:**

- [ ] All business rules from the plan are correctly enforced
- [ ] Rule validation is comprehensive
- [ ] Edge cases identified in the plan are handled
- [ ] Error conditions are properly managed
- [ ] Calculations/algorithms are correct

**UI Components:**

- [ ] All planned UI elements are present
- [ ] User workflows match the plan
- [ ] Visual design matches specifications (or Shadow Master conventions)
- [ ] Error states and validation messages exist
- [ ] Loading states (if applicable) are implemented
- [ ] Responsive design considerations
- [ ] Accessibility requirements met

**Integration Points:**

- [ ] All identified integration points are implemented
- [ ] Data flows correctly between components/systems
- [ ] Existing functionality still works (no regressions)
- [ ] Character creation wizard flow (if applicable) is updated
- [ ] Character sheet displays (if applicable) are updated
- [ ] Export/import functionality (if applicable) handles new data

### 2. **Code Quality**

Assess the implementation against best practices:

**Architecture:**

- [ ] Follows existing Shadow Master patterns and conventions
- [ ] Proper separation of concerns (UI, business logic, data access)
- [ ] Reusable components where appropriate
- [ ] No code duplication
- [ ] Proper use of React hooks and patterns
- [ ] State management follows established patterns
- [ ] Clear component hierarchy and props flow
- [ ] File organization is logical

**TypeScript:**

- [ ] All functions have proper type signatures
- [ ] No `any` types (or justified with comments)
- [ ] Interfaces/types are properly exported and reused
- [ ] Discriminated unions used where appropriate
- [ ] Proper null/undefined handling
- [ ] Type guards implemented where needed
- [ ] Enums or const objects for constants

**Code Readability:**

- [ ] Clear, descriptive variable and function names
- [ ] Complex logic has explanatory comments
- [ ] Rule references documented in code comments (if applicable)
- [ ] No magic numbers or strings (use constants)
- [ ] Consistent formatting and style
- [ ] Logical file and folder organization
- [ ] Functions are appropriately sized

**Error Handling:**

- [ ] Proper error boundaries (if applicable)
- [ ] User-friendly error messages
- [ ] Edge cases handled gracefully
- [ ] Invalid states prevented or handled
- [ ] Console errors/warnings addressed
- [ ] Logging for debugging (where appropriate)

### 3. **Test Coverage**

Verify comprehensive test coverage exists:

**Unit Tests:**

- [ ] **Data Model/Utils Tests:**
  - All data transformation functions
  - Validation logic
  - Calculation functions
  - Helper utilities
  - Type guards

- [ ] **Component Tests:**
  - Components render correctly with various props
  - User interactions work (clicks, inputs, selections)
  - Conditional rendering works
  - Validation messages display appropriately
  - Disabled/enabled states work correctly
  - Error states render properly

- [ ] **Business Logic Tests:**
  - All business rules are verified
  - Different input combinations tested
  - Boundary conditions tested
  - Invalid input handling tested

**Integration Tests:**

- [ ] Full user workflows tested end-to-end
- [ ] State changes propagate correctly
- [ ] Multiple components work together
- [ ] Character state updates work correctly
- [ ] Navigation/routing works (if applicable)

**Edge Case Tests:**

- [ ] All edge cases from the plan are tested
- [ ] Boundary values tested
- [ ] Invalid state transitions prevented
- [ ] Concurrent operations handled (if applicable)
- [ ] Error recovery tested

**Regression Tests:**

- [ ] Existing functionality still works
- [ ] No breaking changes to unrelated features
- [ ] Backwards compatibility maintained (if required)
- [ ] Character import/export still works

**Test Quality:**

- [ ] Tests have clear, descriptive names
- [ ] Tests are isolated and independent
- [ ] Tests use proper assertions
- [ ] Mock data is realistic and representative
- [ ] Tests cover happy path AND error cases
- [ ] Test coverage reports show adequate coverage (>80% target)
- [ ] No flaky or intermittent tests

### 4. **Documentation**

Ensure proper documentation exists:

- [ ] Code comments explain complex logic
- [ ] Rule references cited (if applicable)
- [ ] Component props documented (JSDoc or similar)
- [ ] Public APIs documented
- [ ] README or feature docs updated
- [ ] Migration notes (if breaking changes)
- [ ] Inline TODO/FIXME items addressed or tracked

### 5. **Performance**

Check for performance considerations:

- [ ] No unnecessary re-renders
- [ ] Efficient state updates
- [ ] Proper use of React.memo/useMemo/useCallback (if needed)
- [ ] No expensive calculations in render path
- [ ] Proper list key usage
- [ ] No memory leaks
- [ ] Lazy loading where appropriate

### 6. **Accessibility**

Verify accessibility standards:

- [ ] Keyboard navigation works
- [ ] ARIA labels where appropriate
- [ ] Focus management in modals/dialogs
- [ ] Screen reader friendly
- [ ] Sufficient color contrast
- [ ] Form inputs properly labeled

### 7. **Security**

Check for security concerns:

- [ ] Input validation and sanitization
- [ ] No XSS vulnerabilities
- [ ] Sensitive data handled appropriately
- [ ] No hardcoded secrets or credentials
- [ ] Proper error messages (don't leak sensitive info)

## Review Process

**Phase 1: Plan Alignment**

- Confirm we're reviewing the correct implementation
- Verify understanding of requirements
- Identify any scope changes

**Phase 2: Code Inspection**

- Review file changes systematically
- Verify against the checklist
- Take notes on issues and suggestions

**Phase 3: Test Verification**

- Review test files
- Check test coverage reports
- Identify missing test scenarios

**Phase 4: Manual Verification** (if possible)

- Run the application locally
- Test the feature manually
- Verify user experience

**Phase 5: Feedback Compilation**

- Organize findings by priority
- Provide actionable recommendations

## Output Format

### Report Destination

After completing the review, save the report to:

```
docs/reviews/code-reviews/[feature-name]-review-[YYYY-MM-DD].md
```

**Naming Convention:**

- Use kebab-case for feature name
- Include the date of the review
- Example: `quality-selection-modal-review-2026-01-31.md`

**Directory:** Create `docs/reviews/code-reviews/` if it doesn't exist.

### Report Structure

Provide your review in this structure:

```markdown
# Code Review: [Plan/Feature Name]

## Executive Summary

**Code Complete:** [YES/NO/PARTIAL]
**Test Coverage:** [ADEQUATE/NEEDS IMPROVEMENT/INADEQUATE]
**Ready to Merge:** [YES/NO/WITH CHANGES]
**Overall Quality:** [EXCELLENT/GOOD/NEEDS WORK/POOR]

[2-3 sentence high-level assessment]

---

## Requirements Coverage

### ✅ Implemented Requirements

- [List requirements that are fully implemented]

### ⚠️ Partially Implemented Requirements

- [List requirements that are incomplete]
  - What's missing: [details]

### ❌ Missing Requirements

- [List requirements from the plan that aren't implemented]

---

## Critical Issues ⛔

**[These MUST be fixed before merging]**

### Issue 1: [Title]

- **File(s):** `path/to/file.ts`
- **Problem:** [Detailed description]
- **Impact:** [Why this is critical]
- **Fix Required:** [What needs to be done]

---

## Important Issues ⚠️

**[These SHOULD be fixed before merging]**

### Issue 1: [Title]

- **File(s):** `path/to/file.ts`
- **Problem:** [Description]
- **Recommendation:** [Suggested fix]

---

## Test Coverage Analysis 🧪

### Missing Tests

- [ ] [Specific test scenario that needs coverage]
- [ ] [Another missing test]

### Weak Test Coverage

- **Area:** [Component/module name]
- **Current Coverage:** [X%]
- **Recommended Tests:** [List specific tests needed]

### Test Quality Issues

- [Any problems with existing tests]

---

## Code Quality Observations

### Strengths 💪

- [Things that were done well]

### Areas for Improvement

- [Suggestions for better code quality]

---

## Suggestions 💡

**[Nice-to-have improvements - not blockers]**

1. [Suggestion with rationale]
2. [Another suggestion]

---

## Questions ❓

1. [Question about implementation decision]
2. [Clarification needed on requirement]

---

## What's Working Well ✅

- [Positive feedback on implementation]
- [Good practices observed]
- [Clever solutions]

---

## Final Assessment

### Completeness Score: [X/10]

[Brief explanation]

### Quality Score: [X/10]

[Brief explanation]

### Test Coverage Score: [X/10]

[Brief explanation]

---

## Recommended Next Steps

**Before Merge:**

1. [Action item]
2. [Action item]

**Future Improvements (Post-Merge):**

1. [Technical debt or enhancement]
2. [Future consideration]

---

## Sign-off

- [ ] All critical issues resolved
- [ ] All important issues resolved or accepted
- [ ] Test coverage is adequate
- [ ] Documentation is complete
- [ ] No regressions detected
- [ ] Ready for production

**Reviewer:** Senior Engineer (Claude)
**Date:** [Current Date]
**Recommendation:** [APPROVE / REQUEST CHANGES / REJECT]
```

---

## How to Use This Prompt

**When you're ready for review, provide:**

1. **Confirmation of the plan** (or let me identify it from context)
2. **List of modified/new files:**
   ```
   - src/components/character-creation/NewComponent.tsx
   - src/lib/character/newLogic.ts
   - src/types/newTypes.ts
   - tests/newFeature.test.ts
   ```
3. **Any specific concerns** you want me to focus on
4. **Test coverage report** (if available)

**I will then:**

- Confirm the plan we're reviewing
- Conduct a thorough review
- Provide detailed, actionable feedback
- Help ensure code quality and completeness
