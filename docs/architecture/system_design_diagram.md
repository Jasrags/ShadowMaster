# System Design Diagram: Ruleset Loading & Validation

     ┌────────────────────┐
     │     Edition DB      │
     └─────────┬──────────┘
               │
               ▼
     ┌────────────────────┐
     │  Load Edition Base │
     └─────────┬──────────┘
               │
               ▼
     ┌────────────────────┐
     │   Load Book List   │
     └─────────┬──────────┘
               │
               ▼
     ┌────────────────────────────────────┐
     │ Merge Engine (Modules + Overrides) │
     └─────────┬──────────────────────────┘
               │ Final Ruleset
               ▼
     ┌────────────────────┐
     │ Validation Engine  │
     └─────────┬──────────┘
               │
               ▼
         Character Data

## Notes

- Ruleset is immutable after merge.
- Character sheet generator references module metadata.
