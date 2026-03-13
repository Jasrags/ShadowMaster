# Sample Contacts

**Source:** Run Faster, p.182–195
**PDF Pages:** 184–197

---

## Overview

Run Faster provides 46 fully statted sample contact archetypes for use in SR5 campaigns. Each contact includes a metatype, sex, age, Connection Rating, contact type, preferred payment method, hobbies/vices, personal life, full attribute block, condition monitor, limits, initiative, skills, knowledge skills, a description of services, and a list of similar contacts. No armor, equipment, cyberware, or magic is included -- the GM is expected to add those as appropriate.

> **Cross-reference:** Sample contacts in the SR5 Core Rulebook (p.390, SR5) provide additional archetypes. The Street Doc and Talismonger descriptions in this section explicitly reference CRB p.391–392.

---

## Rules

### Contact Attributes

Each sample contact is defined with:

- **Metatype** - One of Human, Elf, Dwarf, Ork, Troll
- **Sex** - Male or Female
- **Age** - Young, Middle-aged, Old
- **Connection Rating** - 1 to 6 (determines access to resources and influence)
- **Type** - One of: Legwork, Support, Networking, Shadow Service, Swag, Personal Favor
- **Preferred Payment Method** - How the contact prefers to be compensated: Cash (credstick), Cash (corporate scrip), Cash (hard currency), Barter (hobby/vice items), Barter (easy items to sell), Barter (items related to the profession), Barter (items needed for the profession), Service (shadowrunner job), Service (shadowrun job), Service (drek jobs), Service (free-labor jobs), Personal Favor
- **Hobbies/Vice** - What the contact does in their spare time or their weakness
- **Personal Life** - Relationship status: Single, In a Relationship, Divorced, Widowed, Family, Family Man, None of Your Damn Business!
- **Attributes** - B, A, R, S, W, L, I, C, Ess, Edg (some have Res instead of Edg)
- **Condition Monitor** - Physical/Stun boxes
- **Limits** - Physical, Mental, Social
- **Initiative** - Base + dice
- **Skills** - Active skills with ratings and specializations
- **Knowledge Skills** - Knowledge/language skills with ratings
- **Description** - Services the contact provides
- **Similar Contacts** - Alternative archetypes that function similarly

### Contact Type Definitions

| Type               | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| **Legwork**        | Provides information, investigation, and intelligence gathering       |
| **Support**        | Offers ongoing assistance, shelter, or emotional/spiritual support    |
| **Networking**     | Connects people, knows who's who, facilitates introductions           |
| **Shadow Service** | Provides illegal or grey-market services directly                     |
| **Swag**           | Sells or trades physical goods (legal or illegal)                     |
| **Personal Favor** | Operates on a favor-for-favor basis rather than standard transactions |

### Contact Archetype Summary

| Archetype                  | Connection | Type           | Metatype |
| -------------------------- | ---------- | -------------- | -------- |
| Arms Dealer                | 4          | Swag           | Human    |
| Bartender                  | 1          | Legwork        | Elf      |
| Bodyguard                  | 2          | Support        | Human    |
| Bookie                     | 2          | Shadow Service | Ork      |
| Border Patrol Agent        | 2          | Legwork        | Troll    |
| Bounty Hunter              | 3          | Legwork        | Dwarf    |
| Chop Shop Mechanic         | 3          | Shadow Service | Human    |
| Church Pastor              | 2          | Support        | Ork      |
| City Official              | 6          | Personal Favor | Human    |
| Club Kid                   | 3          | Networking     | Human    |
| Company Suit               | 4          | Legwork        | Human    |
| Con Fanatic                | 1          | Support        | Human    |
| Corporate Administrator    | 3          | Legwork        | Ork      |
| Corporate Wageslave        | 2          | Support        | Human    |
| Coyote                     | 3          | Shadow Service | Human    |
| Cybernetic Technician      | 4          | Shadow Service | Troll    |
| Gang Boss                  | 3          | Legwork        | Human    |
| Government Official        | 6          | Networking     | Human    |
| ID Manufacturer            | 5          | Shadow Service | Elf      |
| Informant                  | 2          | Shadow Service | Human    |
| International Courier      | 6          | Shadow Service | Human    |
| Knight Errant Dispatcher   | 2          | Legwork        | Dwarf    |
| Lone Star Detective        | 5          | Legwork        | Human    |
| Mafia Consigliere          | 5          | Personal Favor | Human    |
| Media Mogul                | 5          | Networking     | Elf      |
| Metahuman Rights Activist  | 3          | Support        | Ork      |
| News Reporter              | 2          | Legwork        | Human    |
| Parazoologist              | 1          | Legwork        | Human    |
| Pawn Broker                | 2          | Swag           | Human    |
| Pharmacy Tech              | 3          | Swag           | Elf      |
| Popular MeFeed Personality | 1          | Networking     | Human    |
| Recicladore                | 1          | Swag           | Troll    |
| Rent-a-Cop                 | 1          | Personal Favor | Human    |
| Rockstar                   | 4          | Networking     | Human    |
| Safehouse Master           | 3          | Support        | Dwarf    |
| Script Kiddie              | 2          | Networking     | Human    |
| Sprawl Ganger              | 1          | Networking     | Ork      |
| Squatter                   | 1          | Support        | Human    |
| Store Owner                | 1          | Shadow Service | Elf      |
| Street Doc                 | 4          | Shadow Service | Human    |
| Street Kid                 | 1          | Support        | Human    |
| Talismonger                | 3          | Swag           | Human    |
| Taxi Driver                | 2          | Support        | Human    |
| TerraFirst! Activist       | 4          | Personal Favor | Dwarf    |
| Trid Pirate                | 2          | Shadow Service | Ork      |
| Used Car Salesman          | 2          | Swag           | Human    |

---

## Tables

> Full contact stat blocks extracted to companion JSON file (`sample-contacts.json`).

---

## Validation Checklist

- [ ] 46 contact archetypes are defined
- [ ] Every contact has: metatype, sex, age, Connection Rating, type, preferred payment method, hobbies/vice, personal life
- [ ] Every contact has full attributes: B, A, R, S, W, L, I, C, Ess, Edg
- [ ] Every contact has condition monitor, limits, initiative, skills, knowledge skills
- [ ] Every contact has a description and similar contacts list
- [ ] Connection Ratings range from 1 to 6
- [ ] Contact types are one of: Legwork, Support, Networking, Shadow Service, Swag, Personal Favor
- [ ] All five metatypes are represented across the 46 archetypes

---

## Implementation Notes

- These contacts serve as templates for GMs to customize. The `similarContacts` field provides alternative archetype names that share the same mechanical profile.
- The `type` field maps to the contact type system in SR5 CRB (p.386-393). Use it to determine what services a contact can provide.
- `preferredPaymentMethod` should be modeled as an enum with a category (Cash, Barter, Service, Personal Favor) and a subtype descriptor.
- Some contacts reference CRB pages for full descriptions (Street Doc p.392, Talismonger p.392, Bartender p.390). These should link to CRB data.
- The Cybernetic Technician has Res (Resonance) instead of Edg in attributes -- likely an error or indicating the character is a technomancer. Model defensively.
- Consider generating contact instances from these archetypes, allowing GMs to customize metatype, sex, age, and names while preserving the mechanical template.
