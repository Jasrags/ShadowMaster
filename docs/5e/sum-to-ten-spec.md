# Shadowrun 5E – Sum-to-Ten Character Creation Spec

_Last updated: 2025-11-10_

This document captures the functional and technical requirements for implementing the SR5 **Sum-to-Ten** character creation method. It translates the narrative rules in `docs/SUM_TO_TEN_GENERATION.md` into concrete data, backend, and frontend tasks so we can enable the option once campaign creation methods move beyond Priority.

---

## 1. Design Summary

**Purpose:** Offer a flexible alternative to the Priority method where players allocate ten priority points across character creation columns.

**Availability:** Campaigns flagged `edition="sr5"` with `creation_method="sum_to_ten"` or `creation_method="priority"` when toggling fallback.

**Core Rule:** Players receive 10 points to spend; columns still obey single-choice constraint.

| Priority Choice | Point Cost | Notes |
| --- | --- | --- |
| A | 4 | Highest tier bundle |
| B | 3 | |
| C | 2 | |
| D | 1 | |
| E | 0 | Free selection |

*Columns remain mutually exclusive (Metatype, Attributes, Magic/Resonance, Skills, Resources). Multiple picks per column are not allowed.*

---

## 2. Data Requirements

### 2.1 Edition JSON (`data/editions/sr5/character_creation.json`)

Add new section:

```json
"creation_methods": {
  "sum_to_ten": {
    "label": "Sum-to-Ten",
    "description": "Allocate 10 points across priority columns (A=4, B=3, C=2, D=1, E=0).",
    "priority_costs": { "A": 4, "B": 3, "C": 2, "D": 1, "E": 0 },
    "point_budget": 10,
    "supports_multiple_A": true,
    "notes": [
      "Each column can still be selected only once.",
      "Priority bundles (metatype, attributes, etc.) reuse standard SR5 tables."
    ]
  }
}
```

Other JSON adjustments:
- Ensure `gameplay_levels` includes overrides applicable to Sum-to-Ten (resources, karma caps).
- Provide metadata linking back to `docs/SUM_TO_TEN_GENERATION.md` for traceability.

### 2.2 Documentation References

- Cross-link this spec from `docs/project-roadmap.md` “Edition Strategy & SR5 Rollout”.
- When Karma method is specified later, mirror this spec structure.

---

## 3. Backend Requirements

1. **Service Updates**
   - Extend `CampaignService` to validate `creation_method="sum_to_ten"` (already normalized) and expose the full method definition via `/api/campaigns/{id}/character-creation`.
   - Update `CharacterService` (or new SR5-specific ruleset) to:
     - Accept a `CreationMethod` enum.
     - Validate Sum-to-Ten allocations: total points ≤ 10, column uniqueness, allowed priority letters.
     - Resolve underlying bundles using existing SR5 priority tables.
   - Provide derived calculations (karma, resources) respecting campaign gameplay level overrides.

2. **Ruleset Interface**
   - Implement `SR5Ruleset.SumToTenOptions()` returning:
     - Cost mapping.
     - Remaining budget calculations.
     - Convenience helpers for UI (e.g., sorted permutations when generating suggestions).

3. **Persistence**
   - Characters created under Sum-to-Ten should store their chosen priority letters and remaining point budget (for validation/reporting).
   - Add migration guard to ensure pre-existing characters can’t switch creation method retroactively.

4. **Testing**
   - Unit tests covering valid/invalid point allocations.
   - Regression tests ensuring Priority logic unaffected.
   - Campaign-level tests verifying Sum-to-Ten defaults propagate to character endpoint.

---

## 4. Frontend Requirements

### 4.1 Campaign Creation
| Feature | Details |
| --- | --- |
| Dropdown Option | Add “Sum-to-Ten (SR5)” under creation method selector when `edition === 'sr5'`. |
| Messaging | Flag that non-implemented methods fall back to Priority until wizard support is ready. |
| API | Send `creation_method: 'sum_to_ten'` when creating campaigns. |

### 4.2 Character Wizard (React)
1. **Guard Rails**
   - Detect campaign method via `EditionContext` or `/api/campaigns/{id}/character-creation`.
   - Display budget (10 points), remaining points, and cost table.

2. **Priority Step**
   - Allow selecting ANY priority letter regardless of prior picks until per-column restriction or budget prevents.
   - Visual feedback for point cost and remaining budget.
   - Error state when exceeding budget or violating column uniqueness.

3. **Legacy Bridge**
   - Propagate assignments to legacy state for steps not yet Reactified (until full migration complete).

4. **Summary Step**
   - Show final point expenditure, highlight leftover points if < 10 (should be zero but enforce).

5. **Fallback Behavior**
   - If Sum-to-Ten is selected but React components are not ready, show modal warning and fall back to Priority (temporary safeguard).

### 4.3 UX Copy
Include short help text:
> “Allocate 10 priority points. A=4, B=3, C=2, D=1, E=0. Each column can be chosen only once.”

---

## 5. Testing Strategy

- **Backend**
  - Service/unit tests described above.
  - Integration tests for `/api/campaigns/{id}/character-creation` ensuring Sum-to-Ten metadata is returned.

- **Frontend**
  - React component tests verifying budget math.
  - E2E smoke test once wizard step is complete (campaign default -> character creation -> confirm summary).

- **Data Validation**
  - Lint script verifying `PriorityConfig` letters align across Priority and Sum-to-Ten definitions.

---

## 6. Open Questions / Follow-Up

- How should leftover points be handled (strictly disallowed vs. allowed but flagged)? Proposed: enforce exact 10-point usage.
- Do gameplay levels modify available point budget or costs? (Currently assumed “no”, but ensure documentation covers this if rulebooks say otherwise.)
- How do Sum-to-Ten characters interact with Karma buyouts? (Edge cases to be documented alongside Karma method implementation.)

---

### References
- `docs/SUM_TO_TEN_GENERATION.md` – narrative rule text.
- ShadowMaster Unified Roadmap – “Edition & Creation Method Support”.
- SR5 core rulebook p. 64–69 (Priority and Sum-to-Ten tables).


