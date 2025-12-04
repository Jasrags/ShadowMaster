# Template Selection Guide

## Quick Reference

| Your Goal | Use This Template |
|-----------|------------------|
| Building a new feature (character creation, dice rolling, etc.) | `requirements-template-game-app.md` |
| Reporting a bug (calculation error, validation issue) | `bug-report-game-app.md` |
| Proposing a new feature | `feature-request-game-app.md` |
| Requesting code review | `code-review-template.md` |
| Improving/refactoring existing code | `refactoring-game-app.md` |
| General AI communication tips | `ai-communication-guide.md` |

## When to Use Game-Specific Templates

The **game-app** versions are tailored for your Shadowrun character management system and include:
- Edition-specific considerations (SR5, 6E, etc.)
- Ruleset and validation requirements
- Character data models
- Game mechanics and calculations
- Rule compliance verification

## When to Use Generic Templates

The generic templates (`requirements-template.md`, `bug-report-template.md`, etc.) are better for:
- General software development tasks
- Infrastructure work
- Non-game-specific features
- General project management

## Template Comparison

### Requirements Templates

**Generic (`requirements-template.md`):**
- General product/technical requirements
- Standard API/UI requirements
- Generic testing strategy

**Game-App (`requirements-template-game-app.md`):**
- ✅ Game mechanics integration
- ✅ Edition compatibility
- ✅ Ruleset management
- ✅ Character data models
- ✅ Calculation accuracy requirements
- ✅ Rule compliance validation

### Bug Report Templates

**Generic (`bug-report-template.md`):**
- Standard bug reporting
- General error handling

**Game-App (`bug-report-game-app.md`):**
- ✅ Edition-specific bug context
- ✅ Game rules reference
- ✅ Calculation error details
- ✅ Character data examples
- ✅ Rule violation identification

### Feature Request Templates

**Generic (`feature-request-template.md`):**
- General feature proposals
- Standard UX considerations

**Game-App (`feature-request-game-app.md`):**
- ✅ Game mechanics integration
- ✅ Rules compliance
- ✅ Edition considerations
- ✅ Character sheet integration
- ✅ Calculation engine requirements

### Refactoring Templates

**Generic (`refactoring-template.md`):**
- General code improvements
- Standard architecture patterns

**Game-App (`refactoring-game-app.md`):**
- ✅ Ruleset architecture improvements
- ✅ Edition compatibility refactoring
- ✅ Calculation engine optimization
- ✅ Character data model improvements
- ✅ Game rules compliance verification

## Best Practices

1. **Start with game-app templates** for any feature related to:
   - Character creation/management
   - Ruleset handling
   - Game calculations
   - Edition support
   - Validation logic

2. **Use generic templates** for:
   - Infrastructure setup
   - CI/CD pipelines
   - General UI components
   - Database migrations (unless game-data specific)
   - Authentication/authorization

3. **Mix and match** - You can combine sections from both if needed

4. **Customize further** - These templates are starting points; adapt them to your specific needs

## Example Scenarios

### Scenario 1: Adding SR6 Support
**Template:** `requirements-template-game-app.md`
**Why:** Needs edition-specific rules, character creation methods, validation logic

### Scenario 2: Fixing Dice Pool Calculation Bug
**Template:** `bug-report-game-app.md`
**Why:** Game-specific calculation error, needs rule references, character data examples

### Scenario 3: Adding Export to PDF Feature
**Template:** `feature-request-game-app.md` or `feature-request-template.md`
**Why:** Could use either, but game-app version helps with character sheet layout considerations

### Scenario 4: Refactoring Ruleset Loading
**Template:** `refactoring-game-app.md`
**Why:** Core game system refactoring, needs edition compatibility considerations

### Scenario 5: Setting Up CI/CD Pipeline
**Template:** `requirements-template.md`
**Why:** Infrastructure work, not game-specific

