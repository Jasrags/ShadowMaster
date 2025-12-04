# Product & Technical Requirements Template
## (Tailored for Game/Character Management Applications)

## Project Context
**Project Name:** [Feature/Component Name]
**Current Status:** [e.g., New feature, Enhancement, Bug fix, Refactor]
**Priority:** [High/Medium/Low]
**Timeline:** [e.g., ASAP, This week, This month]
**Game System:** [e.g., Shadowrun 5E, Multi-edition]
**Affected Editions:** [Which editions are impacted?]

---

## Product Requirements

### Problem Statement
**What problem are we solving?**
- [Clear description of the user problem or game-related need]
- [Example: "Players can't create characters using Priority system for SR5"]

**Who is the target user?**
- [e.g., Game Masters, Players, Character Builders, System Administrators]

**Why is this important?**
- [User experience impact, gameplay functionality, or strategic importance]

### User Stories / Use Cases
**As a [user type], I want to [action] so that [benefit].**

1. [Primary user story - e.g., "As a player, I want to create a SR5 character using Priority so that I can quickly build a character"]
2. [Secondary user story]
3. [Edge case - e.g., "As a GM, I want to validate custom house rules so that I can ensure character legality"]

### Game Mechanics / Rules Requirements
**Core Mechanics:**
- [Game mechanic 1: e.g., Attribute calculation]
- [Game mechanic 2: e.g., Skill point allocation]
- [Game mechanic 3: e.g., Dice pool generation]

**Rules References:**
- [Edition: e.g., SR5 Core Rulebook]
- [Page/Section: e.g., p. 65-70, Character Creation]
- [Specific Rules: e.g., Priority Table A-E]

**Edge Cases:**
- [Special rules or exceptions]
- [House rule considerations]

### Acceptance Criteria
- [ ] [Specific, testable condition 1 - e.g., "Priority system correctly allocates attribute points per SR5 rules"]
- [ ] [Specific, testable condition 2 - e.g., "Character validation catches illegal attribute combinations"]
- [ ] [Specific, testable condition 3 - e.g., "UI displays correct attribute caps for selected metatype"]

### Success Metrics
- [User adoption: e.g., % of users successfully creating characters]
- [Error rate: e.g., Validation errors caught vs. user-reported bugs]
- [Performance: e.g., Character creation time < 2 minutes]

---

## Technical Requirements

### Architecture & Design
**System/Component:** [Which part of the system? e.g., Character Creation Engine, Ruleset Validator]
**Architecture Pattern:** [e.g., Rules Engine, Module-based, Event-driven]
**Design Considerations:**
- [Edition compatibility requirements]
- [Ruleset merging strategy]
- [Data validation approach]
- [Performance for complex calculations]

### Technology Stack
**Frontend:**
- [Framework/library: e.g., React, Vue, Angular]
- [UI components for character sheets]
- [Form handling for character creation]

**Backend:**
- [Language/framework: e.g., Node.js, Python, Go]
- [Database: e.g., PostgreSQL, MongoDB]
- [Rules engine: e.g., Custom, Drools, etc.]

**Game Data:**
- [Ruleset storage: e.g., JSON, Database, YAML]
- [Character data format]
- [Calculation engine]

### Functional Requirements

#### Character Management
1. **Character Creation:**
   - Input: [e.g., Edition selection, Creation method, User choices]
   - Processing: [e.g., Apply ruleset, Calculate derived stats, Validate constraints]
   - Output: [e.g., Validated character object, Character sheet data]

2. **Character Validation:**
   - Input: [Character data]
   - Processing: [Apply edition ruleset, Check constraints, Verify legality]
   - Output: [Validation results, Error messages]

3. **Character Calculations:**
   - [Dice pool calculations]
   - [Derived attribute calculations]
   - [Skill totals and specializations]

#### Ruleset Management
1. **Edition Loading:**
   - [Load base edition rules]
   - [Load book modules]
   - [Apply overrides]

2. **Ruleset Merging:**
   - [Merge strategy: replace/merge/append/remove]
   - [Conflict resolution]
   - [Validation of merged ruleset]

#### Data Models
**Character Model:**
- [Attributes: e.g., Body, Agility, Strength, etc.]
- [Skills: e.g., Firearms, Hacking, Magic]
- [Derived stats: e.g., Initiative, Condition Monitor]
- [Equipment/Gear]
- [Magic/Matrix capabilities]

**Ruleset Model:**
- [Edition metadata]
- [Rule modules: attributes, skills, combat, matrix, magic, edge]
- [Creation methods: Priority, Point Buy, Life Path]
- [Validation rules]

### Non-Functional Requirements
- **Performance:** 
  - [e.g., Character creation < 2 seconds]
  - [e.g., Dice pool calculation < 100ms]
  - [e.g., Ruleset loading < 500ms]

- **Accuracy:**
  - [100% rule compliance]
  - [Correct mathematical calculations]
  - [Proper validation logic]

- **Usability:**
  - [Intuitive character creation flow]
  - [Clear error messages]
  - [Helpful tooltips with rule references]

- **Data Integrity:**
  - [Character data validation]
  - [Ruleset versioning]
  - [Audit trail for character changes]

- **Extensibility:**
  - [Easy to add new editions]
  - [Modular rule system]
  - [Custom house rule support]

### API Requirements (if applicable)
**Endpoints:**
- `POST /api/characters` - Create new character
- `GET /api/characters/:id` - Get character
- `POST /api/characters/:id/validate` - Validate character
- `GET /api/editions/:id/ruleset` - Get edition ruleset
- `POST /api/characters/:id/calculate` - Calculate derived stats

**Request/Response Formats:**
```json
// Character Creation Request
{
  "edition": "SR5",
  "creationMethod": "priority",
  "priorities": {
    "metatype": "A",
    "attributes": "B",
    "skills": "C",
    "resources": "D",
    "magic": "E"
  },
  "choices": {
    "metatype": "Human",
    "attributes": {...}
  }
}

// Character Response
{
  "id": "char_123",
  "edition": "SR5",
  "attributes": {
    "body": 3,
    "agility": 4,
    ...
  },
  "skills": {...},
  "validation": {
    "isValid": true,
    "errors": []
  }
}
```

### UI/UX Requirements
**Character Creation Flow:**
1. [Step 1: e.g., Select edition and creation method]
2. [Step 2: e.g., Allocate priorities]
3. [Step 3: e.g., Select metatype and attributes]
4. [Step 4: e.g., Allocate skills]
5. [Step 5: e.g., Review and validate]

**Character Sheet Display:**
- [Layout requirements]
- [Printable format]
- [Mobile responsiveness]

**User Interactions:**
- [Real-time validation feedback]
- [Calculation previews]
- [Rule reference tooltips]
- [Undo/redo for character creation]

**Error States:**
- [Clear validation error messages]
- [Rule violation explanations]
- [Suggestions for fixing issues]

---

## Game-Specific Considerations

### Edition Compatibility
**Supported Editions:**
- [ ] 1E
- [ ] 2E
- [ ] 3E
- [ ] 4E/4A
- [ ] 5E
- [ ] 6E
- [ ] Anarchy

**Edition-Specific Features:**
- [Feature differences between editions]
- [Migration considerations]

### Ruleset Versioning
- [How to handle ruleset updates]
- [Character compatibility with new rulesets]
- [Migration path for existing characters]

### House Rules Support
- [Custom rule configuration]
- [Override mechanisms]
- [Validation with house rules]

### Calculation Accuracy
**Critical Calculations:**
- [Dice pool formulas]
- [Attribute calculations]
- [Skill point allocations]
- [Derived stat formulas]

**Test Cases:**
- [Known character builds to verify]
- [Edge case calculations]
- [Rule boundary conditions]

---

## Constraints & Assumptions

### Constraints
- [Edition rule limitations]
- [Performance constraints for complex calculations]
- [Data storage limitations]
- [Browser compatibility for dice rolling/animations]

### Assumptions
- [Ruleset data is accurate and complete]
- [Users have basic knowledge of game system]
- [Character data format assumptions]

### Out of Scope
- [What we're explicitly NOT building]
- [Future edition considerations]
- [Features for other game systems]

---

## Implementation Notes

### Technical Approach
[High-level approach: e.g., "Implement Priority system as a ruleset module that validates against SR5 core rules"]

### Key Decisions
- [Decision 1: e.g., "Store rulesets as JSONB for flexibility" - Rationale]
- [Decision 2: e.g., "Use immutable ruleset objects after merge" - Rationale]

### Potential Challenges
- [Challenge 1: e.g., "Handling conflicting rules from multiple books" - Mitigation: merge strategy with precedence]
- [Challenge 2: e.g., "Performance of complex validation" - Mitigation: caching and optimization]

### Testing Strategy
- **Unit Tests:** 
  - [Calculation functions]
  - [Validation logic]
  - [Ruleset merging]

- **Integration Tests:**
  - [End-to-end character creation]
  - [Ruleset loading and merging]
  - [API endpoints]

- **Game Rules Tests:**
  - [Verify against official rulebook examples]
  - [Test known character builds]
  - [Validate edge cases]

- **Manual Testing:**
  - [User acceptance testing with actual players]
  - [GM validation of rule compliance]

---

## References & Resources

### Game Rules References
- [Edition rulebook: e.g., "Shadowrun 5E Core Rulebook, p. 65-90"]
- [Official errata or FAQs]
- [Community rule interpretations]

### Related Documentation
- [Link to ruleset architecture docs]
- [Link to database schema]
- [Link to related features]

### Examples/Inspiration
- [Similar character management tools]
- [Reference implementations]
- [Community tools or spreadsheets]

---

## Questions for Clarification
- [ ] [Question 1: e.g., "Should we support custom priority tables?"]
- [ ] [Question 2: e.g., "How to handle unofficial rule interpretations?"]
- [ ] [Question 3: e.g., "What's the migration path for existing characters?"]

