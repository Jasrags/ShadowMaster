# Shadowrun Fifth Edition Matrix Spec

## Purpose

Document the rules, data structures, and interaction patterns for Matrix gameplay in Shadowrun 5e. This serves as the foundation for decking/rigging UI, automated tests, and rule enforcement across ShadowMaster.

## Scope

- Matrix personas (deckers, technomancers, hosts, agents, IC).
- Device ratings, attributes, and ownership.
- Matrix actions, tests, and limits.
- Noise, marks, Overwatch Score, and GOD intervention.
- Host topology, grids, and connection rules.
- Rigging, vehicle control, and drone operations where they intersect with Matrix rules.

## Wireless Matrix Context

- Crash 2.0 (2064) triggered the shift to a pervasive wireless Matrix, increasing openness but eventually enabling corporate consolidation of control.
- Corporations mitigate long-distance hacking by enforcing localized access, leveraging wired data nodes for sensitive assets.
- Cyberdecks re-emerged as specialized decking hardware, distinct from ubiquitous commlinks, enabling advanced intrusion within augmented and virtual environments.

## Interaction Modes

### Augmented Reality (AR)
- Overlay digital objects (AROs) onto the physical world via commlinks, cyberdecks, or smart optics.
- Supports interactive tasks (self-checkout, directories, overlays) while maintaining physical situational awareness—critical for mobile hacking alongside a runner team.
- Implement UX cues for mixed-reality operation: highlight actionable AROs, manage opacity, ensure accessibility for users opting out of overlays.

### Virtual Reality (VR)
- Provides full sensory immersion; essential for high-speed hacking, rigging, and intensive Matrix operations.
- Requires hot-sim/cold-sim gear, offering enhanced initiative and feedback at the cost of physical vulnerability.
- Record safety considerations (biofeedback, dumpshock) and ensure persona transition workflow between AR and VR.

## Key Concepts

- **Persona**: representation of a user in the Matrix (decker persona, technomancer living persona, jumped-in rigger persona).
- **Device**: Matrix-enabled hardware with attributes (Rating, Attack, Sleaze, Data Processing, Firewall).
- **Host**: virtual construct with its own attributes, file system, IC, and security protocols.
- **Grid**: public, corporate, or local grids affecting access and noise modifiers.
- **Marks**: permissions tracked per persona/device/host enabling specific actions.
- **OS (Overwatch Score)**: cumulative security attention leading to convergence at 40+.
- **Noise**: penalties to Matrix actions due to distance, interference, or poor connections.

## Data Model

- `persona`: { type, deviceId, attributes, activePrograms, conditionMonitor }.
- `device`: { id, rating, attack, sleaze, dataProcessing, firewall, ownerId, slavedTo, wirelessOn }.
- `host`: { id, rating, securityLevel, attributes, ICList, files, grid }.
- `mark`: { sourcePersonaId, targetId, count, expiresAt }.
- `grid`: { id, type (public/corp/local), noiseModifiers }.
- `osTracking`: { personaId, score, convergenceTimestamp }.

## Matrix Actions Overview

Categorize actions per SR5 core rules:
- **Sleaze Actions**: Hack on the Fly, Brute Force, Spoof Command, etc. (Opposed tests, OS gain on failure).
- **Data Processing Actions**: Matrix Perception, Edit File, Browse.
- **Attack Actions**: Data Spike, Blackout, Crash Program/IC.
- **Firewall Actions**: Full Matrix Defense, Reset Persona, Reboot Device.

Each action entry should store:
- Test notation (dice pool, limit, opposed pool).
- Required marks or permissions.
- OS impact, noise interaction.
- Duration (Instant, Complex Action with interval, sustained effects).

## Noise & Connectivity

- Define noise sources (distance bands, jammers, background count analogues) and mitigation (signal boosters, RCCs, sprites).
- Specify stacking rules and maximum noise reduction.
- Associate noise penalties with Matrix action dice pools and limits.

## Overwatch Score & GOD

- Track OS per persona once illegal actions begin.
- Increment rules (e.g., Hack on the Fly success +2, failure +2 + hits, time-based creep every 15 minutes).
- Convergence handling: forced dump, biofeedback damage, device bricking.

## Hosts & IC

- Host rating drives attributes and IC strength.
- Define host topology: root, subsystems, file access, security spiders.
- IC escalation tracks, trigger thresholds, and attack routines.

## Rigging Intersection

- Document how RCCs form personas, sharing autosofts, and noise reduction.
- Vehicle/drone attributes when jumped-in vs. remote control vs. autonomous.
- Crossover with physical initiative and combat (see future rigging spec).

## Implementation Notes

- Centralize action definitions to generate UI tooltips and validate tests.
- Ensure mark and OS tracking are event-driven to support real-time updates.
- Provide simulation hooks for automated Matrix encounters.
- Coordinate with future rigging and vehicle data files for shared structures.

## Open Questions & Data Gaps

- Need comprehensive Matrix action list and opposed pools from SR5 core and supplements.
- Host/IC tables, deck stat blocks, and program lists pending data ingestion.
- Technomancer complex forms, sprites, and living persona specifics require dedicated subsections.
- Rigging rules may warrant a separate spec once vehicle catalogs are in place.

*Last updated: 2025-11-08*