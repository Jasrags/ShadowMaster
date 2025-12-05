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

## Matrix Basics

Everything in the Matrix is an icon, a virtual representation that allows you to interact with something in the Matrix. Every object's owner can choose what the icon looks like, within certain limits. An icon doesn't just represent a Matrix object in an abstract way; it shows you what it is and how to access it.

Matrix protocols limit the relative sizes of everything to give users a standard experience they can share. Personas (people in the Matrix) are kept between dwarf and troll sizes. Files and devices are smaller than personas, and hosts are larger (much larger in the case of big sites, like the megas' corporate hosts).

### Icon Types

Every icon in the Matrix is one of six things: a persona, a device, a PAN, a file, a host, or a mark.

- **Personas**: A persona is a person in the Matrix. A persona is the combination of a user and a device that gets the user onto the Matrix. Persona icons usually look like the people they represent.
- **Devices**: Device icons in the Matrix represent electronic devices in the real world. By default, a device's icon looks like the object it represents, in miniature if the real thing is larger than a person.
- **PANs (Personal Area Networks)**: Most individuals have multiple electronic devices on them at once. Often, what shows up instead is an icon representing an individual's personal area network. Some devices are not merged into the single PAN icon; if an individual is carrying a wireless-enabled gun—or any other wireless device that might kill you—it will show up separately.
- **Files**: A file is a collection of data. Files have icons that are smaller than persona icons, typically small enough to fit in the palm of the virtual hand.
- **Hosts**: Hosts are virtual places you can go in the Matrix. They have no physical location, being made up of the stuff of the Matrix itself. From the outside, hosts are as big as buildings in the electronic landscape. Inside a host is a completely different story—a host can be (and usually is) bigger on the inside than on the outside.
- **Marks**: Matrix Authentication Recognition Keys (marks) are how the Matrix keeps track of which personas have access to which devices, files, hosts, and other personas. Marks look like small personalized labels or tattoos on whichever icons you place them. 1 Mark = Guest, 2 Marks = User, 3 Marks = Admin.

### User Modes

| USER MODE | INITIATIVE | INITIATIVE DICE | NOTES |
| --- | --- | --- | --- |
| Augmented Reality | Physical Initiative | Physical Initiative Dice | can be distracting |
| Cold-Sim | Data Processing + Intuition | 3D6 |  |
| Hot-Sim | Data Processing + Intuition | 4D6 | +2 dice pool bonus to Matrix actions |

## Matrix Actions Overview

Categorize actions per SR5 core rules:
- **Sleaze Actions**: Hack on the Fly, Brute Force, Spoof Command, etc. (Opposed tests, OS gain on failure).
- **Data Processing Actions**: Matrix Perception, Edit File, Browse.
- **Attack Actions**: Data Spike, Blackout, Crash Program/IC.
- **Firewall Actions**: Full Matrix Defense, Reset Persona, Reboot Device.

### Free Actions

- Load Program
- Switch Two Matrix Attributes
- Swap Two Programs
- Unload Program

### Simple Actions

| ACTION | FUNCTION | TEST | LIMIT | MARKS |
| --- | --- | --- | --- | --- |
| Change Icon | Misc |  | Data Processing | Owner |
| Jack Out | Misc | Hardware + Willpower vs. Attack + Logic | Firewall | Owner |
| Invite Mark | Mark Manipulation |  | Data Processing | Owner |
| Send Message | Misc |  | Data Processing | 1 |
| Switch Interface Mode | Misc |  | Data Processing | Owner |

### Complex Actions

| ACTION | FUNCTION | TEST | LIMIT | MARKS |
| --- | --- | --- | --- | --- |
| Brute Force | Mark Manipulation | Cybercombat + Logic vs. Firewall + Willpower | Attack | None |
| Check Overwatch Score | Information Gathering | Electronic Warfare + Logic | Sleaze | None |
| Crack File | File Manipulation | Hacking + Logic vs. 2 * Protection Rating | Attack | 1 |
| Crash Program | Matrix Combat | Cybercombat + Logic vs. Firewall + Intuition | Attack | 1 |
| Data Spike | Matrix Combat | Cybercombat + Logic vs. Firewall + Intuition | Attack | None |
| Disarm Data Bomb | File Manipulation | Software + Intuition vs. 2 * Data Bomb Rating | Firewall | None |
| Edit File | File Manipulation | Computer + Logic vs. Firewall + Intuition | Data Processing | 1 |
| Enter/Exit Host | Misc |  | Data Processing | 1 |
| Erase Mark | Mark Manipulation | Cybercombat + Logic vs. Firewall + Willpower | Attack | Special |
| Erase Matrix Signature | Mark Manipulation | Computer + Resonance vs. 2 * Signature Rating | Attack | None |
| Format Device | Device Manipulation | Computer + Logic vs. Firewall + Willpower | Sleaze | 3 |
| Grid-Hop | Misc |  | Data Processing | None |
| Hack on the Fly | Mark Manipulation | Hacking + Logic vs. Firewall + Intuition | Sleaze | None |
| Hide | Misc | Electronic Warfare + Intuition vs. Data Processing + Intuition | Sleaze | 0 |
| Jam Signals | Misc | Electronic Warfare + Logic | Attack | Owner |
| Jump Into Rigged Device | Misc | Electronic Warfare + Logic vs. Firewall + Willpower | Data Processing | 3 |
| Matrix Perception | Information Gathering | Computer + Intuition (vs. Sleaze + Logic if Running Silent) | Data Processing | None |
| Reboot Device | Device Manipulation | Computer + Logic vs. Firewall + Willpower | Data Processing | 3 |
| Set Data Bomb | File Manipulation | Cybercombat + Logic vs. 2 * Device Rating | Sleaze | 1 |
| Snoop | Information Gathering | Electronic Warfare + Intuition vs. Firewall + Logic | Sleaze | 1 |
| Spoof Command | Device Manipulation | Hacking + Intuition vs. Firewall + Logic | Sleaze | 1 |
| Trace Icon | Information Gathering | Computer + Intuition vs. Sleaze + Willpower | Data Processing | 2 |

### Variable Actions

| ACTION | FUNCTION | TEST | LIMIT | MARKS |
| --- | --- | --- | --- | --- |
| Control Device | Device Manipulation |  | Data Processing * | Varies |
| Matrix Search | Information Gathering | Computer + Intuition | Data Processing | Special |

*Control Device may or may not use Data Processing as its limit

### Interrupt Actions

| ACTION | FUNCTION | LIMIT | INIT COST | MARKS |
| --- | --- | --- | --- | --- |
| Full Matrix Defense | Matrix Combat | Firewall | -10 | Owner |

### Matrix Perception

When you take a Matrix Perception action, each hit can reveal one piece of information you ask of your gamemaster. Matrix Perception can tell you:
- Spot a target icon you're looking for
- The most recent edit date of a file
- The number of boxes of Matrix damage on the target's Condition Monitor
- The presence of a data bomb on a file
- The programs being run by a persona
- The target's device rating
- The target's commcode
- The rating of one of the target's Matrix attributes
- The type of icon (host, persona, device, file), if it is using a non-standard (or even illegal) look
- Whether a file is protected, and at what rating
- The grid a persona, device, or host is using
- If you're out on the grid, whether there is an icon running silent within 100 meters
- If you're in a host, whether there is an icon running silent in the host
- If you know at least one feature of an icon running silent, you can spot the icon
- The last Matrix action an icon performed, and when
- The marks on an icon, but not their owners

### Matrix Search

| INFORMATION IS | THRESHOLD | TIME |
| --- | --- | --- |
| General Knowledge or Public | 1 | 1 minute |
| Limited Interest or Not Publicized | 3 | 30 minutes |
| Hidden or Actively Hunted and Erased | 6 | 12 hours |
| Protected or Secret | N/A | N/A |

**Dice Pool Modifiers:**
- Intricate or Specialized: –1
- Obscure: –2
- On another grid: –2

### Matrix Spotting

| TARGET IS | NOT RUNNING SILENT | RUNNING SILENT |
| --- | --- | --- |
| Within 100 meters | Automatic | Opposed Computer + Intuition [Data Processing] v. Logic + Sleaze Test |
| Outside 100 meters | Simple Computer + Intuition [Data Processing] |  |
| A Host | Automatic |  |

## Technomancer Actions

### Complex Actions

| ACTION | TEST | LIMIT |
| --- | --- | --- |
| Compile Sprite | Compiling + Resonance vs. Spirit Level | Level |
| Decompile Sprite | Decompiling + Resonance vs. Spirit Level (+ Compiler's Resonance if Registered) | Level |
| Erase Resonance Signature | Computer + Resonance vs. 2 * Signature Rating | Attack |
| Kill Complex Form | Software + Resonance vs. Complex Form Level + Resonance | Level |
| Register Sprite | Registering + Resonance vs. 2 * Spirit Level | Level |
| Thread Complex Form | Software + Resonance vs. | Level |

### Simple Actions

- Call/Dismiss Sprite
- Command Sprite

## Complex Forms

Technomancers can thread complex forms, which are unique abilities that technomancers can use. Common complex forms include:
- Cleaner
- Coriolis
- Derezz
- Diffusion of [Matrix Attribute]
- Editor
- FAQ
- Infusion of [Matrix Attribute]
- Misread Marks
- Pulse Storm
- Puppeteer
- Redundancy
- Resonance Channel
- Resonance Spike
- Resonance Veil
- Static Bomb
- Static Veil
- Stitches
- Tattletale
- Transcendent Grid

Each complex form entry should store:
- Target
- Duration
- Fading Value
- Effect description

## Sprites

Sprites are Matrix entities created by technomancers. They have attributes based on their Level (L) and type. Common sprite types include:
- Crack Sprite: Attack L, Sleaze L+3, Data Processing L+1, Firewall L+2
- Data Sprite: Attack L, Sleaze L+3, Data Processing L+2, Firewall L+1
- Fault Sprite: Attack L-1, Sleaze L, Data Processing L+4, Firewall L+1
- Machine Sprite: Attack L+3, Sleaze L, Data Processing L+1, Firewall L+2
- Task Sprite: Attack L+1, Sleaze L, Data Processing L+3, Firewall L+2

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