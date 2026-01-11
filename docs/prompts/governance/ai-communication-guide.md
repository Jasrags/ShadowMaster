# AI Communication Guide

## Best Practices for Communicating with AI Assistants

### 1. Be Specific and Clear

- ✅ **Good:** "Add error handling to the login function that catches network errors and displays a user-friendly message"
- ❌ **Bad:** "Fix the login"

### 2. Provide Context

- Include relevant file paths, function names, or code snippets
- Mention the technology stack you're using
- Share any constraints or requirements upfront

### 3. Structure Your Requests

Use the templates provided:

- **Requirements Template** - For new features or major changes
- **Bug Report Template** - For reporting issues
- **Feature Request Template** - For proposing new features
- **Code Review Template** - For requesting code reviews
- **Refactoring Template** - For refactoring requests

### 4. Break Down Complex Tasks

Instead of one large request, break it into smaller, manageable pieces:

- ✅ **Good:**
  1. "Create the database schema for user authentication"
  2. "Implement the registration endpoint"
  3. "Add validation and error handling"
- ❌ **Bad:** "Build a complete authentication system"

### 5. Include Examples

- Show what you want with code examples
- Reference similar implementations in your codebase
- Provide mock data or sample inputs/outputs

### 6. Specify Constraints

- Performance requirements
- Security considerations
- Browser/platform support
- Time/budget constraints

### 7. Ask for Explanations

When you want to understand something:

- "Explain how [feature] works"
- "Why did you choose [approach]?"
- "What are the trade-offs of [solution]?"

### 8. Iterate and Refine

- Start with a high-level request
- Review the output
- Ask for refinements or adjustments
- Provide feedback on what works and what doesn't

### 9. Use Code References

When discussing existing code:

- Reference specific files and line numbers
- Quote relevant code sections
- Point to related functions or components

### 10. Be Explicit About Preferences

- Coding style preferences
- Framework/library preferences
- Architecture patterns you prefer
- Testing approach preferences

---

## Common Communication Patterns

### For New Features

1. Use the **Requirements Template**
2. Start with the problem statement
3. Provide acceptance criteria
4. Include technical constraints

### For Bug Fixes

1. Use the **Bug Report Template**
2. Include steps to reproduce
3. Show error messages/logs
4. Describe expected vs actual behavior

### For Code Improvements

1. Use the **Refactoring Template**
2. Explain current issues
3. Describe desired outcome
4. Include examples if possible

### For Understanding Code

1. Ask specific questions
2. Reference the code you're asking about
3. Request explanations of complex logic
4. Ask about alternatives

---

## Template Selection Guide

| Scenario                | Template to Use          |
| ----------------------- | ------------------------ |
| Building a new feature  | Requirements Template    |
| Reporting a bug         | Bug Report Template      |
| Proposing a feature     | Feature Request Template |
| Requesting code review  | Code Review Template     |
| Improving existing code | Refactoring Template     |
| General questions       | No template needed       |

---

## Tips for Better Results

1. **Start with "What" before "How"**
   - First describe what you want to achieve
   - Then let AI suggest the implementation approach

2. **Provide Error Messages**
   - Include full error messages
   - Share stack traces
   - Include relevant logs

3. **Share Your Codebase Context**
   - Mention relevant files
   - Reference existing patterns
   - Note architectural decisions

4. **Be Patient with Iterations**
   - AI may need clarification
   - Refine requests based on output
   - Build on previous responses

5. **Verify and Test**
   - Always review AI-generated code
   - Test thoroughly
   - Check for edge cases

---

## Example: Good vs Bad Requests

### ❌ Bad Request

"Make the app faster"

### ✅ Good Request

"I need to improve the performance of the user dashboard. Currently, it takes 3-4 seconds to load. The dashboard is in `src/components/Dashboard.tsx` and it fetches data from `/api/user/stats`. I'd like to:

1. Add caching for the stats endpoint
2. Implement lazy loading for the chart components
3. Optimize the database query if possible
   Target: Load time under 1 second"

---

## Remember

- AI assistants are tools to augment your work, not replace your judgment
- Always review and understand the code generated
- Test thoroughly before deploying
- Ask questions when something is unclear
- Provide feedback to help AI improve its responses
