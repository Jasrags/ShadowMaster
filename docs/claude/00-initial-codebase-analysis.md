# Initial Codebase Analysis Prompt

## Instructions
Run this prompt first in Cursor with Claude Sonnet 4/4.5. This will give Claude a comprehensive understanding of your codebase before generating specific documentation.

---

# Codebase Architecture Analysis for Documentation

I need you to analyze my Shadowrun webapp codebase to help me document the current architecture before a major refactor. Please examine the codebase and provide a comprehensive analysis covering:

## 1. Tech Stack Identification
- Frontend framework(s) and key libraries (React, Vue, Svelte, etc.)
- Backend framework(s) and runtime (Express, FastAPI, Next.js API routes, etc.)
- Database(s) and ORM/query tools
- Build tools and package managers
- Any real-time communication libraries (WebSockets, Socket.io, etc.)
- Testing frameworks (if present)
- Deployment/infrastructure tools

## 2. Project Structure Analysis
- High-level folder organization
- Number of files/components in frontend
- Number of files/routes in backend
- Key directories and their purposes
- Configuration file locations
- Environment variable usage
- Monorepo vs separate repos (if applicable)

## 3. API Architecture
- API style (REST, GraphQL, tRPC, mixed)
- List all API endpoints with their methods and purposes
- Authentication/authorization approach (JWT, sessions, OAuth, etc.)
- Request/response patterns
- Error handling conventions
- Middleware chain
- Rate limiting or security measures
- Any real-time/websocket endpoints
- API versioning strategy (if any)

## 4. Validation Systems
- Where validation occurs (client-side, server-side, both)
- Validation libraries used (Zod, Yup, Joi, class-validator, etc.)
- Common validation patterns
- Shadowrun-specific business rules implemented (dice pools, skill checks, character limits, etc.)
- Data schema definitions
- Type safety approach (TypeScript interfaces, PropTypes, etc.)

## 5. Frontend Patterns
- Component organization approach (atomic design, feature-based, etc.)
- State management strategy (Context, Redux, Zustand, etc.)
- Routing structure and navigation
- Common component patterns (HOCs, render props, hooks)
- Prop passing conventions
- Error boundary implementation
- Form handling approach
- UI library or component system used
- Styling approach (CSS modules, Tailwind, styled-components, etc.)

## 6. Backend Patterns
- Route/controller organization
- Service layer architecture
- Middleware usage and patterns
- Database query patterns
- Transaction handling
- Error handling on backend
- Logging approach and tools
- Environment configuration
- Dependency injection (if used)
- Background jobs or queues (if any)

## 7. Data Layer
- Database schema overview
- Table/collection relationships
- Migration strategy
- Seeding approach
- Query optimization patterns
- Caching strategy (if any)

## 8. Key Design Decisions
- Why certain architectural choices were made (if evident from code/comments)
- Naming conventions for files, variables, functions
- Code organization principles
- Testing approach and coverage (if tests exist)
- Documentation practices
- Code review or quality gates

## 9. Integration Points
- How frontend communicates with backend
- API client implementation (fetch, axios, etc.)
- Database interaction patterns
- External services or APIs used
- File upload/storage approach (if applicable)
- Third-party integrations (payment, auth providers, etc.)

## 10. Shadowrun-Specific Features
- Character sheet implementation
- Dice rolling mechanics
- Initiative tracking
- Combat system
- Skill checks and tests
- Inventory/gear management
- Any game rules enforcement

## Output Format
Please structure your analysis in clear sections with:

- **Findings**: What you discovered about each area
- **Code Examples**: 2-3 representative snippets per pattern (keep them concise)
- **File References**: Specific files that exemplify each pattern
- **Observations**: Things that work well vs. potential issues or technical debt
- **Conventions**: Implicit patterns or standards followed

Focus on **patterns and conventions** rather than exhaustive file lists. I want to understand the "how and why" of the current architecture, not just inventory every file.

## Additional Notes
- If you find multiple competing patterns for the same concern, note that
- Highlight any inconsistencies in approach across the codebase
- Note any missing patterns (e.g., no error handling, no validation, etc.)
- Identify any performance concerns or security issues you observe
- Flag any deprecated dependencies or outdated patterns

---

## After Running This Prompt
Once you receive the analysis, use the follow-up prompts (01-06) to generate specific documentation files.