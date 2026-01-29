# SR5 Errata 2014-02-09 Analysis

This document analyzes the official Shadowrun 5th Edition errata dated 2014-02-09 against the current `core-rulebook.json` data to identify what changes are needed for the errata book.

## Status Summary

| Category             | Count |
| -------------------- | ----- |
| Already Correct      | 10    |
| Needs Errata Changes | 3     |
| Not in Data Model    | 27    |

---

## Already Correct in core-rulebook.json

These items from the errata are already correctly implemented:

### 1. Dwarf Thermographic Vision (P. 66)

- **Errata:** Add Thermographic Vision as racial bonus for dwarves
- **Status:** ✅ Already present
- **Location:** `modules.metatypes.payload.metatypes[id=dwarf].racialTraits`
- **Current Value:** `["Thermographic Vision", "+2 dice vs. pathogens/toxins", "Lifestyle cost ×1.2"]`

### 2. Resist Pain Drain (P. 289)

- **Errata:** Change drain from "(Damage Value) – 6" to "F – 4"
- **Status:** ✅ Already correct
- **Location:** `modules.magic.payload.spells.health[id=resist-pain].drain`
- **Current Value:** `"F-4"`

### 3. Homunculus Movement (P. 298)

- **Errata:** Change movement from "15/30" to "x2/x4/+1"
- **Status:** ✅ Already correct
- **Location:** `modules.magic.payload.rituals[id=homunculus].minionStats.movement`
- **Current Value:** `"x2/x4/+1"`

### 4. Periscope Wireless Bonus (P. 432)

- **Errata:** Change penalty from "–2" to "–1"
- **Status:** ✅ Already correct
- **Location:** `modules.modifications.payload.weaponAccessories[id=periscope].wirelessBonus`
- **Current Value:** `"Dice pool penalty for shooting around corners is –1 instead of –2."`

### 5. Monocle Availability and Price (P. 444)

- **Errata:** Change to Rating × 120¥, availability —
- **Status:** ✅ Already correct
- **Location:** `modules.gear.payload.electronics[id=monocle].ratings`
- **Current Values:** Rating 1: 120¥, Rating 2: 240¥, Rating 3: 360¥, Rating 4: 480¥ (all availability 0)

### 6. Devil Rat Skill Correction (P. 404)

- **Errata:** Remove "Dodge 5" from skill list
- **Status:** ✅ Already correct (Dodge not present)
- **Location:** `modules.critters.payload.critters[id=devil-rat].skills`
- **Current Skills:** Climbing 5, Perception 4, Running 2, Sneaking 6, Unarmed Combat 5

### 7. Natural Weapon Power Correction (P. 399)

- **Errata:** Change "Action: Complex" to "Action: Auto"
- **Status:** ✅ Already correct
- **Location:** `modules.critterPowers.payload.powers[id=natural-weapon].action`
- **Current Value:** `"auto"`

### 8. Herding Not a Skill (P. 90)

- **Errata:** Remove "Herding" from Agility skill list
- **Status:** ✅ Correct - Herding is only a specialization for Animal Handling, not a standalone skill
- **Location:** `modules.skills.payload.skills[id=animal-handling].suggestedSpecializations`

### 9. Lockpicking Not a Skill (P. 90)

- **Errata:** Remove "Lockpicking" from Agility skill list
- **Status:** ✅ Correct - Lockpicking does not exist as a skill, only as gear (lockpick-set)

### 10. Autosoft Prices (P. 442)

- **Errata:** Rating × 2 availability, Rating × 500¥ cost
- **Status:** ✅ Already correct
- **Location:** `modules.gear.payload.autosofts[*]`
- **Current Values:** `costPerRating: 500, availabilityPerRating: 2`

---

## Needs Errata Changes

These items require modifications via the errata book:

### 1. Combat Sense Activation Type (P. 286)

- **Errata:** Change from "(Active, Psychic)" to "(Passive, Psychic)"
- **Status:** ⚠️ Missing `activation` field
- **Location:** `modules.adeptPowers.payload.powers[id=combat-sense]`
- **Required Change:** Add `"activation": "passive"`
- **Notes:** Other adept powers have activation fields (e.g., adrenaline-boost: "free", astral-perception: "simple")

### 2. Biotechnology Skill Group Assignment (P. 153)

- **Errata:** Add Biotechnology to Biotech skill group
- **Status:** ⚠️ Biotechnology skill has `group: null`
- **Location:** `modules.skills.payload.skills[id=biotechnology].group`
- **Current Value:** `null`
- **Required Change:** Change to `"biotech"`

### 3. Biotech Skill Group Members (P. 153)

- **Errata:** Add Biotechnology to Biotech skill group
- **Status:** ⚠️ Biotechnology not in group's skill list
- **Location:** `modules.skills.payload.skillGroups[id=biotech].skills`
- **Current Value:** `["cybertechnology", "first-aid", "medicine"]`
- **Required Change:** Add `"biotechnology"` to array

---

## Not in Data Model

These errata items are narrative text, table clarifications, or reference content not captured in our mechanical data model. Listed with details for future implementation consideration.

### Narrative/Text Clarifications

#### 1. Playtesting Credits (P. 7)

- **Type:** Credits/meta
- **Change:** Add missing playtester names
- **Data Model Gap:** No credits data in rulebook JSON

#### 2. Troll Lifestyle Costs Description (P. 65)

- **Type:** Metatype description text
- **Errata:** Change wording from "pay an additional fifty percent for gear" to "Lifestyle costs doubled"
- **Data Model Gap:** We store `racialTraits: ["Lifestyle cost ×2"]` but not the full descriptive text
- **Current:** Description field exists but is brief summary only

#### 3. Troll and Dwarf Gear Costs Paragraph (P. 94)

- **Type:** Character creation guidance text
- **Errata:** Remove outdated paragraph about gear costs, replace with new text about essential gear
- **Data Model Gap:** Character creation guidance text not stored

#### 4. Sample Character Changes

- **Type:** Pre-generated character stats
- **Errata Changes:**
  - Street Samurai: Add Fixer contact (Connection 4, Loyalty 2)
  - Street Shaman: Social limit 7 → 8
  - Combat Mage: Physical limit 6 → 5
  - Face: Physical limit 3 → 4, Mental limit 5 → 6
  - Tank: Physical limit 10 → 9 (11)
  - Decker: Mental limit 6 (7) → 7
  - Drone Rigger: Physical limit 6 → 5 (6), Mental limit 5 → 6
  - Sprawl Ganger: Physical 8→9, Mental 4→5, Social 5→6
  - Bounty Hunter: Physical limit 7 → 9, Social limit 4 → 5
- **Data Model Gap:** Sample characters not stored in edition data

### Combat/Action Rules

#### 5. Rappelling Distance (P. 134)

- **Type:** Movement table entry
- **Errata:** Change from "2 meters" to "20 meters + 1 meter per hit"
- **Data Model Gap:** No movement distance tables in current data model
- **Future Consideration:** Add `modules.movement` with climbing/rappelling/swimming tables

#### 6. Target Roll on Intimidation Tests (P. 141)

- **Type:** Social skill test table
- **Errata:** Change target defense from "Intimidation + Willpower [Social]" to "Charisma + Willpower"
- **Data Model Gap:** Skill descriptions exist but not the full opposed test specifications
- **Current:** `skills[id=intimidation].description` mentions the test but uses Social Modifiers Table reference

#### 7. Block & Parry Clarification (P. 168)

- **Type:** Interrupt action rules
- **Errata:** Move weapon foci bonus dice text from Block to Parry description
- **Data Model Gap:** Actions have descriptions but not detailed bonus dice rules
- **Current Locations:**
  - `modules.actions.payload.actions[id=block]`
  - `modules.actions.payload.actions[id=parry]`
- **Notes:** Neither currently mentions weapon foci bonus dice

#### 8. Roll Initiative Term Correction (P. 158)

- **Type:** Terminology correction
- **Errata:** Change "Action Phase" to "Combat Turn"
- **Data Model Gap:** Initiative rules text not stored

#### 9. Fire Example Correction (P. 172)

- **Type:** Example text
- **Change:** Add sentence about fire DV increasing
- **Data Model Gap:** Examples not stored

#### 10. Recoil Clarification (P. 175)

- **Type:** Combat rules text
- **Errata:** Change "action other than shooting" to "Simple or Complex Action other than shooting"
- **Data Model Gap:** Recoil rules not stored as data

#### 11. Vehicle-Mounted Weapons Correction (P. 183)

- **Type:** Gunnery rules
- **Errata:** Change "Weapon Skill + Agility" to "Gunnery + Agility"
- **Status:** Gunnery skill description is correct
- **Data Model Gap:** Vehicle combat rules not stored
- **Current:** `skills[id=gunnery].description` correctly says "firing any vehicle-mounted weapon"

#### 12. Sensor Defense Test Correction (P. 184)

- **Type:** Defense table
- **Errata:** Change drone defense from "Pilot + [Model] Stealth" to "Pilot + [Model] Evasion"
- **Data Model Gap:** Sensor defense tables not stored
- **Future Consideration:** Add `modules.vehicles.payload.sensorDefense` table

#### 13. Multiple Attack and Edge Clarification (P. 196)

- **Type:** Combat rules text
- **Errata:** Clarify Edge application in multiple attacks (dice added before split, re-rolls apply to both pools)
- **Data Model Gap:** Multiple attack rules not stored as data

#### 14. Damaging Vehicle Passengers Correction (P. 205)

- **Type:** Vehicle combat rules
- **Errata:** Change "full-automatic bursts" to "suppressive fire"
- **Data Model Gap:** Vehicle damage rules not stored

### Matrix Rules

#### 15. Matrix Actions Correction (P. 244)

- **Type:** Matrix actions by limit table
- **Errata:** Remove "Crack File" from Sleaze section
- **Data Model Gap:** No matrix actions by limit table
- **Notes:** We have programs but not the categorization of actions by which Matrix attribute limits them
- **Future Consideration:** Add `modules.matrix.payload.actionsByLimit` or tag each action with its limit attribute

#### 16. IC and Marks Clarification (P. 247)

- **Type:** Matrix rules text
- **Errata:** Clarify that IC and host share marks they place, not marks placed on them
- **Data Model Gap:** IC/host mark sharing rules not stored

### Resonance/Technomancer Rules

#### 17. Resonance and Essence Clarification (P. 250)

- **Type:** Resonance rules text
- **Errata:** Clarify that Essence loss reduces both current and maximum Resonance
- **Data Model Gap:** Resonance/Essence interaction rules not stored
- **Future Consideration:** Add to `modules.resonance.payload.essenceRules`

#### 18. Registering Sprite Limit (P. 256)

- **Type:** Technomancer rules
- **Errata:** Add "You can register a number of sprites equal to or less than your Logic attribute"
- **Data Model Gap:** Sprite registration limits not stored
- **Future Consideration:** Add to `modules.resonance.payload.spriteRules`

### Magic Rules

#### 19. Magical Skills Clarification (P. 142)

- **Type:** Skills requirement text
- **Errata:** Change "characters must have a quality that provides a Magic rating" to "must be an Aspected Magician, Magician, or Mystic Adept"
- **Data Model Gap:** Skill prerequisites text not fully captured
- **Current:** Skills have `category: "magical"` but not the detailed requirement text

#### 20. Power Points and Magic Clarification (P. 279)

- **Type:** Adept/Mystic Adept rules
- **Errata:** Clarify free Power Points on Magic increase don't apply to mystic adepts
- **Data Model Gap:** Power point acquisition rules not stored
- **Future Consideration:** Add to `modules.adeptPowers.payload.powerPointRules`

#### 21. Preparations and Lynchpins Clarification (P. 305)

- **Type:** Alchemy rules text
- **Errata:** Add "or the lynchpin is broken" to preparation expiration text
- **Data Model Gap:** Preparation/alchemy rules not stored

#### 22. Astral Intersection Test Correction (P. 316)

- **Type:** Astral projection rules
- **Errata:** Remove limits from two-attribute tests (Magic + Charisma, Force x 2)
- **Data Model Gap:** Astral intersection test rules not stored

#### 23. Deactivating Focus Clarification (P. 318)

- **Type:** Focus rules
- **Errata:** Add "with a Free Action" to focus deactivation
- **Data Model Gap:** Focus activation/deactivation action costs not stored
- **Current:** `modules.foci` exists but doesn't specify deactivation action cost
- **Future Consideration:** Add `deactivationAction: "free"` to foci module

### Gear/Equipment

#### 24. Motion Sensor Test Correction (P. 365)

- **Type:** Security gear rules
- **Errata:** Change test from "Infiltration + Agility" to "Sneaking + Agility"
- **Data Model Gap:** Gear-specific test references not stored
- **Current:** Motion sensor exists at `modules.gear.payload.security[id=motion-sensor]` but doesn't specify the opposed test

#### 25. Autosoft Reference (P. 441)

- **Type:** Cross-reference text
- **Errata:** Add "For information on these programs for drones, see p. 269"
- **Data Model Gap:** Cross-reference text not stored (just cosmetic)

### NPC Stat Corrections

#### 26. NPC Stat Changes (PP. 391-392)

- **Type:** NPC stat blocks
- **Errata Changes:**
  - Fixer: Computer 6 → 7, remove Data Search 8
  - Mafia Consiglieri: Computer 4 → 5, remove Data Search 5
  - Mr. Johnson: remove Data Search 5
- **Data Model Gap:** These are narrative NPC stat blocks, not contact templates
- **Notes:** Our `contactTemplates` and `contactArchetypes` don't include full stat blocks
- **Future Consideration:** Add `modules.npcs` for pre-built NPC stat blocks

### Mystic Adept Rules

#### 27. Mystic Adept Power Points Cost (P. 71)

- **Type:** Character creation rules
- **Errata:** Change karma cost from 2 to 5 per Power Point
- **Data Model Gap:** Mystic adept power point purchase rules not explicitly stored
- **Notes:** This affects character creation, not stored in current priority/creation method data
- **Future Consideration:** Add `mysticAdeptPowerPointKarmaCost` to creation methods or magic paths

---

## Errata Book Implementation Plan

When creating `errata-2014-02-09.json`, include these modules:

```json
{
  "meta": {
    "bookId": "errata-2014-02-09",
    "title": "SR5 Core Errata (February 2014)",
    "edition": "sr5",
    "version": "1.0.0",
    "category": "sourcebook"
  },
  "modules": {
    "adeptPowers": {
      "mergeStrategy": "merge",
      "payload": {
        "powers": [
          {
            "id": "combat-sense",
            "activation": "passive"
          }
        ]
      }
    },
    "skills": {
      "mergeStrategy": "merge",
      "payload": {
        "skills": [
          {
            "id": "biotechnology",
            "group": "biotech"
          }
        ],
        "skillGroups": [
          {
            "id": "biotech",
            "skills": ["biotechnology", "cybertechnology", "first-aid", "medicine"]
          }
        ]
      }
    }
  }
}
```

---

## Future Data Model Enhancements

To fully support all errata items, consider adding these modules:

1. **Movement Tables** - Climbing, rappelling, swimming distances
2. **Opposed Tests** - Skill test specifications with defense rolls
3. **Matrix Action Categories** - Actions categorized by limiting attribute
4. **NPC Stat Blocks** - Pre-built NPCs for GMs
5. **Creation Rules** - Detailed character creation rules (mystic adept costs, etc.)
6. **Focus Rules** - Activation/deactivation action costs
7. **Sprite Rules** - Registration limits, task rules
8. **Sensor Defense** - Defense test table for drones/vehicles
9. **Vehicle Combat** - Passenger damage, mounted weapon rules

---

_Analysis performed: 2026-01-21_
_Source: Shadowrun 5th Edition Errata, February 9, 2014_
