# API Specification Documentation Prompt

## Instructions
Run this prompt after completing the initial analysis. This will generate comprehensive API documentation.

---

# Generate API Specification Documentation

Based on your previous analysis of the codebase, create a comprehensive API documentation file that captures all endpoints, their specifications, and usage patterns.

## Requirements

### 1. Endpoint Inventory
For each API endpoint, document:
- HTTP Method (GET, POST, PUT, PATCH, DELETE)
- Full path/route
- Description of purpose
- Authentication requirements
- Authorization/permission requirements

### 2. Request Specifications
For each endpoint, document:
- URL parameters (path params)
- Query parameters
- Request headers required
- Request body schema (with TypeScript/JSON schema format)
- Content-Type expectations
- Example request with realistic data

### 3. Response Specifications
For each endpoint, document:
- Success response codes (200, 201, 204, etc.)
- Success response schema
- Example success response with realistic data
- Error response codes (400, 401, 403, 404, 500, etc.)
- Error response format
- Example error responses

### 4. Validation Rules
For each endpoint, document:
- Required vs optional fields
- Field types and formats
- Min/max lengths or values
- Pattern validation (regex)
- Custom business rules (Shadowrun-specific)
- Cross-field validation rules

### 5. Business Logic
For endpoints with Shadowrun-specific logic, document:
- Game rules implemented
- Dice rolling calculations
- Skill check mechanics
- Character creation/advancement rules
- Combat or initiative rules
- Any other game-specific validations

### 6. API Patterns
Document common patterns:
- Pagination approach (if used)
- Filtering/sorting patterns
- Bulk operation patterns
- Batch endpoints
- Error response standardization
- Success response envelope format

### 7. Authentication Flow
- How authentication tokens are obtained
- Token format (JWT structure, session cookies, etc.)
- Token expiration and refresh mechanism
- Protected vs public endpoints

## Output Format

Create the file as `/docs/claude/api-specification.md` with this structure:

```markdown
# API Specification

## Overview
[Brief description of API design philosophy and conventions]

## Authentication
[How auth works across all endpoints]

## Common Patterns
[Pagination, filtering, error handling, etc.]

## Endpoints

### [Feature Area - e.g., Characters]

#### POST /api/characters
**Purpose**: Create a new character

**Authentication**: Required (JWT)

**Authorization**: User must be authenticated

**Request**:
```typescript
interface CreateCharacterRequest {
  name: string;
  metatype: string;
  // etc.
}
```

```json
{
  "name": "Shadowjack",
  "metatype": "human",
  "attributes": {...}
}
```

**Validation Rules**:
- name: Required, 1-50 characters, alphanumeric with spaces
- metatype: Required, must be valid Shadowrun metatype
- [List all validation rules]

**Success Response** (201):
```json
{
  "id": "char_123",
  "name": "Shadowjack",
  "metatype": "human",
  "createdAt": "2025-12-02T10:00:00Z"
}
```

**Error Responses**:
- 400: Validation error
  ```json
  {
    "error": "VALIDATION_ERROR",
    "message": "Invalid character data",
    "details": [
      {"field": "name", "message": "Name is required"}
    ]
  }
  ```
- 401: Unauthorized
- 403: Forbidden

**Business Logic**:
- Validates attribute points against metatype limits
- Applies metatype attribute modifiers
- Checks starting resources

---

[Repeat for each endpoint, grouped by feature area]

### [Another Feature Area - e.g., Dice Rolls]

[Continue pattern...]
```

## Additional Notes
- Group endpoints by feature area or resource type
- Use realistic Shadowrun-themed examples (character names, skills, gear)
- Include edge cases in validation examples
- Note any deprecated endpoints or planned changes
- Flag any inconsistencies between endpoints
- Document any rate limiting per endpoint
- Note any caching headers or strategies

---

**Output File**: Save the complete documentation to `/docs/claude/api-specification.md`