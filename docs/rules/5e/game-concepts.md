# Shadowrun Fifth Edition Game Concepts

## Overview

This specification distills the recurring gameplay concepts that span Shadowrun 5e systems. Use it as the shared reference for character creation, action resolution, UI modeling, and future rule automation.

## Roles at the Table

### Players
- Drive the narrative by declaring character intentions and applying mechanics to resolve challenges.
- Expect rules to adjudicate outcomes quickly; routine tasks auto-succeed, extraordinary actions require tests.

### Gamemaster (GM)
- Frames scenes, portrays non-player characters, and serves as final arbiter of rules.
- Keeps the story moving, balancing player agency with pacing; leans on guidelines here plus deeper coverage in the core GM advice (SR5, p. 332).

## Core Gameplay Loop

1. GM sets the fiction and presents obstacles.
2. Players declare actions; determine whether narrative resolution is sufficient or a mechanical test is needed.
3. When tests are required, build an appropriate dice pool, apply limits and modifiers, roll, and interpret hits vs. thresholds or opposition.
4. GM narrates outcomes, including complications from glitches.

## Dice Pools & Hits

- Standard test uses `Attribute + Skill` (substitute attribute-only, skill-only, or other derived pools as specified).
- Roll six-sided dice; results of 5 or 6 count as hits. Sum hits, respecting limits.
- Net hits = hits beyond the requirement (threshold or opponent); grant bonus effects such as extra damage.
- Dice pool notation in documentation should explicitly state pool components, limit, and threshold (see Test Framework).

### Success Threshold Guidelines

| Difficulty | Threshold |
|------------|-----------|
| Easy       | 1         |
| Average    | 2         |
| Hard       | 4         |
| Very Hard  | 6         |
| Extreme    | 8–10      |

## Buying Hits

- Shortcut for predictable outcomes: convert every four dice (rounded down) into one automatic hit.
- Requires GM approval; disallowed when glitch risk or dramatic uncertainty is important.
- Binary choice: either buy with the full pool or roll all dice—no mixed approaches.

## Glitches & Critical Glitches

- Glitch: more than half the dice show 1s. Outcome succeeds or fails per hits, but an additional complication occurs.
- Critical glitch: glitch with zero hits. Represents major failure; GM imposes severe narrative consequences without necessarily killing characters outright.
- Players may spend Edge (Close Call) to downgrade or cancel glitches, subject to standard Edge rules.

## Test Framework

When documenting or implementing a test, capture four elements:
1. Test Type (Success, Opposed, Extended, Teamwork).
2. Dice Pool (skills, attributes, situational modifiers).
3. Limit (inherent or gear-based cap on usable hits).
4. Threshold or opposing dice pool.

### Limits
- Inherent limits: Physical, Mental, Social—derived from attributes (formulas stored in attributes spec).
- Gear limits override inherent limits when applicable (e.g., weapon Accuracy, deck attributes).
- Limits typically apply to skill+attribute pools; attribute-only tests often ignore limits unless specified.
- Spending Edge (Push the Limit) can ignore limits for a single test.

### Success Tests
- Single roll to beat a fixed threshold.
- Document notation as: `[Skill] + [Attribute] [Limit] (Threshold)`.

### Opposed Tests
- Two parties roll competing pools; higher hits win.
- Notation: `[Skill] + [Attribute] [Limit] vs. Opposed Pool`.

### Extended Tests
- Multiple intervals to accumulate hits until threshold met or attempts exhausted.
- Notation: `[Skill] + [Attribute] [Limit] (Threshold, Interval)`.
- Dice pool degrades by 1 die after each roll.
- Suggested intervals for pacing:

| Interval Label | Time Increment |
|----------------|----------------|
| Fast           | 1 Combat Turn  |
| Quick          | 1 minute       |
| Short          | 10 minutes     |
| Average        | 30 minutes     |
| Long           | 1 hour         |
| Consuming      | 1 day          |
| Exhaustive     | 1 week         |
| Mammoth        | 1 month        |

- Extended Test Threshold guidance mirrors success tests (see table above).
- Glitch on an Extended Test typically incurs setbacks (e.g., subtract 1d6 accumulated hits). Critical glitch ends the effort with failure.

### Teamwork Tests
- Assistants roll the relevant pool; each helper with ≥1 hit grants +1 limit and +1 die to the leader (capped by leader’s skill rating or highest attribute for attribute-only pools).
- Helper glitches remove their contribution; helper critical glitches negate all limit bonuses and introduce complications.

### Retrying Tests
- Re-attempts suffer a cumulative –2 dice penalty per retry until adequate downtime resets the attempt (GM discretion).
- Separate discrete actions (e.g., multiple attacks) are not retries for this rule.

## Time & Action Economy

- Narrative time flows freely until precision matters.
- Combat Turns structure high-intensity scenes: each turn ≈ 3 seconds and contains initiative order plus available actions.
- Actions fall into free, simple, or complex categories (detailed in action economy spec / SR5 p. 163).
- Initiative systems (physical, astral, matrix) reference attributes, gear, and magical states; see initiative subsystem specs for formulas and pass handling.

## Cross-System Touchpoints

- Condition monitors (Physical, Stun) derive from attributes and augmentations; see attributes spec for calculations and overflow rules.
- Matrix, Magic, and Resonance subsystems apply bespoke limits, actions, and initiative variants; refer to dedicated specs for test definitions and gear interactions.
- Advancement consumes Karma to raise attributes, skills, qualities, spells, and other traits; cost tables live in advancement documentation.

## Implementation Notes

- Centralize helpers to build dice pools, apply limits, and evaluate glitches so that different subsystems reuse shared logic.
- Surface GM override controls in tooling to allow buying hits, forcing glitches, or adjusting thresholds.
- Store references to SR5 core pages for traceability (e.g., GM advice p. 332, Edge effects p. 56, action catalog p. 163).

## Open Questions & Data Gaps

- Need finalized formulas for inherent limits, initiative variants, and condition monitor calculations (tracked in attributes spec).
- Action taxonomy and Edge options require dedicated specs to avoid duplication.

*Last updated: 2025-11-08*
