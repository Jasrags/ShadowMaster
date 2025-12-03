# AI Development Prompt Strategy

_Created: 2025-12-03_

This document provides templates and strategies for using AI assistants to implement ShadowMaster features systematically.

---

## Initial Prompt Template

Use this when starting work on a new story:

```markdown
I'm building a Shadowrun campaign management app with Next.js 15, TypeScript, 
SQLite (Drizzle ORM), and Tailwind CSS.

## Current Context
[Describe what's already built, or "Starting fresh"]

## Story
[Paste the user story from 06-nextjs-bootstrap-stories.md]

## Constraints
- Use App Router (not Pages Router)
- TypeScript strict mode
- Zod for validation
- No external auth providers yet (custom email/password)

## What I Need
[Specific ask: "Create the API route" or "Create the form component" etc.]
```

---

## Follow-up Prompt Template

Use this when iterating on an in-progress story:

```markdown
## Current State
[What exists now, any errors you're seeing]

## What's Working
[Confirm what succeeded]

## What's Not Working / What's Next
[Specific issue or next acceptance criteria item]
```

---

## Example: Story 3 (Registration) Prompts

### Prompt 1: API Route

```markdown
I'm building a Shadowrun campaign management app with Next.js 15, TypeScript, 
SQLite (Drizzle ORM), and Tailwind CSS.

## Current Context
- Project initialized with Next.js 15 App Router
- Drizzle ORM configured with SQLite
- User schema exists in src/db/schema.ts with fields: id, email, username, passwordHash, roles, createdAt, updatedAt

## Story
**As a** new user  
**I want** to register with email, username, and password  
**So that** I can create an account and access the application

## Constraints
- Use App Router (not Pages Router)
- TypeScript strict mode
- Zod for validation
- No external auth providers yet (custom email/password)

## What I Need
Create the POST `/api/auth/register` route that:
1. Validates input with Zod (email format, password min 8 chars, username 3-30 chars)
2. Checks for existing email/username (return 409 if conflict)
3. Hashes password with bcrypt
4. Creates user in database
5. Returns user object without password

Also create the shared Zod schema in `src/lib/validations/auth.ts`
```

### Prompt 2: Registration Form

```markdown
## Current State
- POST `/api/auth/register` endpoint is working
- Zod schemas defined in `src/lib/validations/auth.ts`
- shadcn/ui components available (Button, Input, Label, Card)

## What's Working
- API validates input and creates users correctly
- Passwords are hashed
- Unique constraint errors return 409

## What's Next
Create the registration form at `/register` that:
1. Uses the shared Zod schema for client-side validation
2. Shows validation errors inline below each field
3. Shows server errors (like "email already exists") in an alert
4. Redirects to /login on success
5. Uses shadcn/ui components for styling
```

---

## Debugging Prompt Template

When something isn't working:

```markdown
## The Problem
[Describe what's happening vs what you expected]

## Error Message
```
[Paste exact error]
```

## Relevant Code
```typescript
[Paste the specific code that's failing]
```

## What I've Tried
[List debugging steps you've already taken]
```

---

## Code Review Prompt

After completing a story:

```markdown
I just completed this story:

[Paste story]

Here's the code I implemented:

[Paste or describe files created]

Please review for:
1. Security issues
2. TypeScript best practices
3. Next.js App Router conventions
4. Anything that might cause problems as the app grows
```

---

## Tips for Effective AI Development

1. **One thing at a time** - Don't ask for the whole story at once. Break into API → Form → Integration.

2. **Show your work** - Paste actual error messages and code snippets rather than paraphrasing.

3. **Confirm before moving on** - Verify each acceptance criterion works before starting the next.

4. **Keep context fresh** - AI doesn't remember previous sessions. Re-state relevant context.

5. **Be specific about constraints** - "Use Zod, not Yup" or "Use server actions, not API routes" prevents wrong patterns.

6. **Ask for explanations** - If you don't understand generated code, ask "Why did you do X instead of Y?"

---

## Related Documents

- `06-nextjs-bootstrap-stories.md` - User stories to implement
- `08-tech-stack-recommendation.md` - Technology decisions and file structure

