# NPC Governance Capability

## Purpose

The NPC Governance capability manages the lifecycle and operational integrity of non-player entities within the game environment. It provides a structured framework for both complex individual NPCs and simplified grunt groups, ensuring that all antagonistic or neutral entities are governed by ruleset-compliant attributes, specialized collective behaviors, and auditable state transitions.

## Guarantees

- NPC entities MUST be authoritatively defined with attributes and skills strictly compliant with the active campaign ruleset.
- Grunt teams MUST operate within a simplified condition and initiative model while maintaining precise casualty and state tracking.
- The system MUST enforce Professional Rating constraints on group morale, Edge allocation, and tactical resource expenditure.
- Participant visibility into NPC capabilities MUST be restricted according to campaign authority and active encounter scope.

## Requirements

### Entity Individualization

- The system MUST support the definition of individual NPC identities with full attribute and skill sets identical to participant characters.
- NPCs MUST support specialized roles, including magic-users, technomancers, and augmented combatants, with all associated resource tracking (e.g., Drain, Essence).
- Leadership entities (e.g., Lieutenants) MUST be able to apply verifiable bonuses to associated group entities.

### Group Dynamics and Grunts

- Grunt groups MUST share a common statistical foundation while supporting individual casualty markers.
- The system MUST manage a shared "Group Edge" pool for grunt teams, derived from their Professional Rating.
- Grunt teams MUST support specialization (e.g., specialists, heavy weapons) within the group structure without requiring full individual entity modeling.

### Combat and Condition Tracking

- The system MUST provide an authoritative tracker for NPC condition monitors, allowing for both Physical and Stun damage application.
- Casualty calculation MUST be automatic based on damage thresholds and condition monitor saturation.
- Initiative resolution MUST support both group-based and individual-based models depending on the entity's tactical role (e.g., lieutenants rolling individually).

### Professionalism and Morale

- Professional Ratings (0–6) MUST govern the default behavior, morale thresholds, and group quality of NPC teams.
- Morale state (e.g., Broken, Persistent) MUST be automatically evaluated based on casualty rates and leadership presence.
- The system MUST facilitate the implementation of "simplified rules" (e.g., one-hit-kill, unopposed rolls) for rapid encounter resolution.

## Constraints

- Modification of NPC attributes and group configurations MUST be restricted to campaign authorities.
- NPCs MUST NOT exceed the resource or attribute limits defined by the active campaign edition unless explicitly flagged as "supernatural" or "threat-level" entities.
- NPC state changes resulting from encounter actions MUST be permanently recorded in the campaign history.

## Non-Goals

- This capability does not provide AI-driven decision-making or tactical pathfinding for NPCs.
- This capability does not manage the narrative personality or dialogue for NPCs.
- This capability does not cover the loot or reward generation resulting from NPC defeat.
