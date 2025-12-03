# Codebase Architecture Analysis for Documentation

I need you to analyze my Shadowrun webapp codebase to help me document the current architecture before a major refactor. Please examine the codebase and provide a comprehensive analysis covering:

## 1. Tech Stack Identification
- Frontend framework(s) and key libraries
- Backend framework(s) and runtime
- Database(s) and ORM/query tools
- Build tools and package managers
- Any real-time communication libraries (WebSockets, etc.)

## 2. Project Structure Analysis
- High-level folder organization
- Number of files/components in frontend
- Number of files/routes in backend
- Key directories and their purposes
- Configuration file locations

## 3. API Architecture
- API style (REST, GraphQL, mixed)
- List all API endpoints with their methods and purposes
- Authentication/authorization approach
- Request/response patterns
- Error handling conventions
- Any real-time/websocket endpoints

## 4. Validation Systems
- Where validation occurs (client, server, both)
- Validation libraries used
- Common validation patterns
- Shadowrun-specific business rules implemented
- Data schema definitions

## 5. Frontend Patterns
- Component organization approach
- State management strategy
- Routing structure
- Common component patterns
- Prop passing conventions
- Error handling on frontend

## 6. Backend Patterns
- Route/controller organization
- Middleware usage
- Database query patterns
- Error handling on backend
- Logging approach
- Environment configuration

## 7. Key Design Decisions
- Why certain architectural choices were made (if evident from code/comments)
- Naming conventions
- Code organization principles
- Testing approach (if any tests exist)

## 8. Integration Points
- How frontend communicates with backend
- Database interaction patterns
- External services or APIs used
- File upload/storage approach (if applicable)

## Output Format
Please structure your analysis in clear sections with:
- **Findings**: What you discovered
- **Code Examples**: 2-3 representative snippets per pattern
- **File References**: Specific files that exemplify each pattern
- **Observations**: Things that work well vs. potential issues

Focus on **patterns and conventions** rather than exhaustive file lists. I want to understand the "how and why" of the current architecture.