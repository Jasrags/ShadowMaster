# New Quality: Rank

**Source:** Run Faster, p.86–87
**PDF Pages:** 88–89

---

## Overview

Rank is a positive quality representing a character's position within an organization or institution. It provides a Social Limit bonus when interacting with members of that organization (or, for military/law enforcement, with the general public). The quality has multiple levels with escalating karma costs, and the rank categories vary by organization type.

---

## Rules

### Rank (Positive Quality)

**Type:** Positive Quality
**Cost:** Variable (see Rank Table)
**Effect:** +1 to Social Limit per level for interactions with members of your organization. For military or law enforcement characters, the Social Limit modifier applies to the general public over whom they have authority.

**Key Mechanics:**

- Each row in the Rank Table represents a level of rank within the organization.
- The "Points" column shows the karma cost. The number on the right side of the slash is the cost for military or law enforcement ranks; the number on the left side is for all other ranks.
- Rank exists across all facets of life: military, business, policlubs, hobby groups, and more.
- The quality can be taken at character creation or acquired during play by spending the listed karma cost.

> **Ambiguity:** The book states the social limit modifier applies "per level" but does not explicitly clarify whether the bonus is cumulative (i.e., a Captain gets +3 total) or whether it is simply +1 at any rank. The most common reading is that each rank level provides +1, so a character at the third rank tier would have +3 Social Limit. However, this is not stated with absolute clarity.

> **Cross-reference:** Social Limit is defined in SR5 Core Rulebook, p.46. The Rank quality interacts with Social Limit tests during social encounters (Etiquette, Negotiation, Leadership, etc.).

### Rank Categories

The Rank Table defines six parallel career tracks, each with three tiers:

| Track          | Tier 1           | Tier 2             | Tier 3           |
| -------------- | ---------------- | ------------------ | ---------------- |
| **NCO**        | [Lance] Corporal | Sergeant           | Sergeant Major   |
| **Officer**    | Lieutenant       | Captain            | Major            |
| **Beat**       | Officer          | Corporal           | Sergeant         |
| **Detectives** | Detective        | Detective Sergeant | Captain          |
| **Workers**    | 5 Year           | 10 Year            | 20 Year          |
| **Management** | Manager          | Area Manager       | Regional Manager |

- **NCO / Officer / Beat / Detectives** tracks are for military and law enforcement organizations.
- **Workers / Management** tracks are for corporate, business, hobby, and other civilian organizations.

### Karma Cost by Tier

| Tier | Military/Law Enforcement Cost | Other Ranks Cost |
| ---- | ----------------------------- | ---------------- |
| 1    | 20                            | 5                |
| 2    | 25                            | 10               |
| 3    | 30                            | 15               |

> **Ambiguity:** It is unclear whether the karma costs are cumulative (i.e., to reach Tier 3, you pay 5+10+15=30 for civilian) or whether each tier is a flat cost. The table layout suggests each row is a discrete purchase level.

---

## Tables

> Tabular data extracted to companion JSON file (`new-quality.json`).

---

## Validation Checklist

- [ ] Rank quality provides +1 Social Limit per level within the organization
- [ ] Military/law enforcement Social Limit bonus applies to the general public
- [ ] Non-military Social Limit bonus applies only to members of the same organization
- [ ] Karma costs differ between military/law enforcement and other rank types
- [ ] Three tiers of rank exist for each career track
- [ ] Six career tracks are defined: NCO, Officer, Beat, Detectives, Workers, Management

---

## Implementation Notes

- Model Rank as a multi-level positive quality with a `tier` (1-3) and a `track` (one of the six career tracks).
- The karma cost depends on both the tier and whether the track is military/law-enforcement or civilian.
- The Social Limit modifier should be applied conditionally: check whether the interaction target is within the same organization (civilian) or is a member of the public (military/law enforcement).
- Consider storing the track type as a discriminator: `"military-law-enforcement"` vs `"civilian"` to determine cost and applicability.
- The quality `id` could follow the pattern `rank-{track}-{tier}` (e.g., `rank-officer-2` for Captain).
