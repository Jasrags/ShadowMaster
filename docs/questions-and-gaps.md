# Questions and Gaps in Character Creation Documentation

This document identifies questions and missing information needed to complete the Shadowrun 3rd Edition character creation system.

## Critical Gaps (Required for Implementation)

### 1. Skill Linked Attributes ✅ **RESOLVED**
**Status:** Skill linked attributes have been provided and integrated into the codebase.

**Source Data:**
- Body: Athletics, Driving
- Strength: Edged Weapons (Blades), Clubs, Polearms/Staffs, Cyber-Implant Combat, Unarmed Combat, Throwing Weapons, Projectile Weapons (Archery), Heavy Weapons, Underwater Combat
- Quickness: Pistols, Submachine Guns (Automatics), Rifles (Longarms), Assault Rifles (Longarms), Shotguns (Longarms specialization), Laser Weapons, Whips, Stealth
- Intelligence: Aura Reading, Demolitions, Gunnery, Launch Weapons, Computer, Electronics, Biotech (Biotechnology), Build/Repair (Electronics B/R), Knowledge Skills, Language Skills
- Charisma: Etiquette, Instruction, Interrogation, Intimidation, Leadership, Negotiation
- Willpower: Conjuring (Summoning), Sorcery (Spellcasting)
- Reaction: Bike, Car, Hovercraft, Motorboat, Ship, Sailboat, Winged Aircraft (Fixed Wing), Rotor Aircraft (Rotorcraft), Vector Thrust Aircraft (Vectored Thrust), Lighter-Than-Air Aircraft, Submarine

**Implementation Notes:**
- Skill-to-attribute mapping has been added to `pkg/shadowrun/edition/v3/skills.go`
- `GetSkillLinkedAttribute()` function implemented
- `CalculateSkillCost()` function implemented
- Knowledge and Language skills all link to Intelligence
- Some skill name mappings made (e.g., "Edged Weapons" → "Blades", "Submachine Guns" → "Automatics")

**Remaining Questions:**
- Some skills in source list not present in current skill database (e.g., "Polearms/Staffs", "Cyber-Implant Combat", "Underwater Combat", "Aura Reading", "Launch Weapons", "Whips", "Lighter-Than-Air Aircraft")
- Some skills may need specialization rules (e.g., Shotguns as Longarms specialization, Assault Rifles as Longarms specialization)
- "Driving" vs "Car" - both listed but may be different skills or same skill

**Impact:** ✅ Skill cost calculation now possible!

---

### 2. Metatype Attribute Maximums ⚠️
**Issue:** Document mentions metatypes have different attribute caps, but doesn't specify what they are.

**Questions:**
- What are the exact maximum attribute values for each metatype?
- When can attributes exceed 6 after racial modifiers are applied?
- Are there different maximums for different attributes within the same metatype?

**Current Info:**
- Document mentions: "After racial modifiers applied, attributes may exceed 6 (subject to metatype maximums)"
- But maximums are not specified

**Impact:** Cannot validate attributes during character creation.

---

### 2a. Racial Modifications Table ✅ **PROVIDED**
**Status:** Official racial modifiers have been provided and integrated into the codebase.

**Racial Modifications Table:**
| Race | Modifications |
|------|---------------|
| Human | No attribute modifiers (baseline) |
| Dwarf | +1 Body, +2 Strength, +1 Willpower<br>Thermographic Vision<br>Resistance (+2 Body to any disease or toxin) |
| Elf | +1 Quickness, +2 Charisma<br>Low-light Vision |
| Ork | +3 Body, +2 Strength, -1 Charisma, -1 Intelligence |
| Troll | +5 Body, -1 Quickness, +4 Strength, -2 Intelligence, -2 Charisma<br>Thermographic Vision<br>+1 Reach for Armed/Unarmed Combat<br>Dermal Armor (+1 Body) |

**Implementation Notes:**
- `GetMetatypeModifiers()` function implemented in `internal/service/character.go`
- Attribute modifiers have been corrected from previous documentation
- Special abilities (vision, resistance, reach, armor) noted but not yet tracked in domain model

**Remaining Questions:**
- ✅ Should special abilities (Thermographic Vision, Low-light Vision, Resistance, Reach, Dermal Armor) be tracked in the character model? **Yes** - Should be tracked in character model
- ✅ How should Dermal Armor (+1 Body) be tracked? **It should be considered as inherent cyberware dermal armor** - Added to Cyberware list with no essence cost, marked as racial
- Metatype attribute maximums still need to be specified

**Implementation Notes:**
- Special abilities should be tracked in character model
- Troll Dermal Armor should be added to Cyberware list as inherent (no essence cost, no nuyen cost, racial trait)
- Other special abilities (Thermographic Vision, Low-light Vision, Resistance, Reach) should be tracked separately

**Impact:** ✅ Racial attribute modifiers now correct! Ready for special abilities implementation.
---

### 3. Language Skills Details ✅ **RESOLVED**
**Status:** Language skill rules have been provided and integrated into the codebase.

**Rules:**
- **Languages:** Starting with English (can be expanded later)
- **Purpose:** Language skills represent the ability to understand and speak spoken and written language
- **Linked Attribute:** Intelligence (all language skills link to Intelligence)
- **Free Native Language:** Characters get one language at rating 6 for free
- **Language Skill Points:** Intelligence * 1.5 (rounded down) - separate from regular skill points
- **Understanding Complexity:** Uses Language Skill Table for target numbers

**Language Skill Table (Understanding Complexity):**
| Situation | Target Number |
|-----------|---------------|
| Universal concept (hunger, fear, bodily functions) | 2 |
| Basic conversation (Concerns of daily life) | 4 |
| Complex subject (special/limited-interest topics) | 6 |
| Intricate subject (almost any technical subject) | 9 |
| Obscure subject (deeply technical/rare knowledge) | 11 |
| Speaking lingo (or variation of a particular language) | +2 to the above target numbers |

**Implementation Notes:**
- `LanguageSkills` map added to `CharacterSR3` domain model
- `applyLanguageSkills()` function automatically gives free English at rating 6
- `GetLanguageSkillPoints()` function calculates available points (Intelligence * 1.5)
- `GetLanguageSkillTargetNumber()` function returns target numbers for complexity levels
- `LanguageSkillsDatabase` contains available languages (starting with English)
- Language skills use the same cost calculation as other skills (1 point per rating if ≤ Intelligence, 2 points per rating if > Intelligence)

**Impact:** ✅ Language skill system now implemented!

---

### 4. Contacts System ✅ **RESOLVED**
**Status:** Contact system rules have been provided and integrated into the codebase.

**Rules:**
- **Free Contacts:** Characters begin with two free level 1 contacts
- **Contact Levels:** 1-3 (Level 1: Contact, Level 2: Buddy, Level 3: Friend for life)
- **Loyalty:** 1-3 (not 1-6)
- **No Limits:** No limits on starting contacts

**Starting Character Extras Table - Contacts:**
| Extra Contacts | Cost |
|----------------|------|
| Contact (level 1) | 5,000¥ |
| Buddy (Level 2) | 10,000¥ |
| Friend for life (Level 3) | 200,000¥ |

**Contact Types:**
- Fixer, Dealer, Street Doc, Bartender, Information Broker, Corporate, Gang, Law Enforcement, Media, Smuggler, Talislegger, General

**Implementation Notes:**
- `applyFreeContacts()` function automatically gives two free level 1 contacts during character creation
- `GetContactCost()` function returns cost based on contact level
- `Contact` domain model updated with `Level` field (1-3)
- `Loyalty` field clarified as 1-3 (not 1-6)
- Contact types database created in `pkg/shadowrun/edition/v3/contacts.go`

**Impact:** ✅ Contact system now implemented!

---

### 5. Lifestyle System ✅ **RESOLVED**
**Status:** Lifestyle cost structure has been provided and integrated into the codebase.

**Starting Character Extras Table - Lifestyle:**
| Lifestyle | Cost (per month) |
|-----------|------------------|
| Street | 0¥ |
| Squatter | 100¥ |
| Low | 1,000¥ |
| Middle | 5,000¥ |
| High | 10,000¥ |
| Luxury | 100,000¥ |

**Implementation Notes:**
- `GetLifestyleCost()` function returns monthly cost based on lifestyle level
- Lifestyle levels database created in `pkg/shadowrun/edition/v3/lifestyle.go`
- Lifestyle is stored in `CharacterSR3.Lifestyle` field

**Impact:** ✅ Lifestyle system now implemented!

---

### 6. Adept Powers ✅ **PARTIALLY RESOLVED**
**Status:** Some adept powers have been provided and integrated into the codebase. More powers needed for complete implementation.

**Provided Powers:**
- **Astral Perception**: 2 Power Points (fixed cost)
- **Attribute Boost**: 0.25 Power Points per level (must specify an attribute)

**Rules:**
- Adepts receive 25 Power Points at creation (Priority B)
- Some powers have fixed costs (e.g., Astral Perception)
- Some powers have per-level costs (e.g., Attribute Boost)
- Some powers require additional specification (e.g., Attribute Boost requires specifying which attribute)
- Powers with "per level" in the cost will be listed as such

**Implementation Notes:**
- `AdeptPower` domain model created with support for:
  - Fixed-cost powers
  - Per-level powers (with rating/level)
  - Powers requiring specification (e.g., attribute for Attribute Boost)
- `AdeptPowersDatabase` created in `pkg/shadowrun/edition/v3/adept.go` with initial powers
- `CalculateAdeptPowerCost()` function handles both fixed and per-level costs
- `AdeptPowers` array added to `CharacterSR3` domain model

**Remaining Questions:**
- What other adept powers exist?
- Are there restrictions on which powers can be learned?
- Can powers be purchased at character creation only, or can they be learned later with karma?
- Maximum levels for per-level powers (if any)

**Impact:** ✅ Basic adept power structure implemented! Ready to add more powers as they are provided.

---

### 7. Spell Lists ⚠️
**Issue:** We know spell costs (1 point per Force) but not what spells exist.

**Questions:**
- What spells exist in Shadowrun 3rd Edition?
- Are there different spell lists for different traditions (Hermetic vs Shamanic)?
- Are there spell categories (Combat, Detection, Health, Illusion, Manipulation)?
- What is the Force range for spells at creation?
- Can any spell be learned, or are there restrictions by tradition?
- Are there spell schools or groups?

**Impact:** Cannot implement spell selection for magical characters.

---

### 8. Aspected Magician Restrictions ⚠️
**Issue:** Document mentions Aspected Magicians have "certain restrictions" and are "specialized in one aspect" but doesn't specify what these are.

**Questions:**
- What are the "certain restrictions"?
- What aspects exist (e.g., Spellcasting, Summoning, Ritual)?
- How does aspect specialization affect spell selection?
- Do Aspected Magicians get benefits or penalties compared to Full Magicians?
- Can they learn spells from their non-specialized aspect?
- Are they limited to specific spell categories?

**Impact:** Cannot properly implement Aspected Magician creation.

---

### 9. Specialization Details
**Issue:** We know specializations cost +1 point, but details are missing.

**Questions:**
- Can a skill have multiple specializations?
- What are valid specializations for each skill?
- Are there restrictions on which skills can have specializations?
- Do specializations have ratings, or are they binary (have it or don't)?
- Example: Pistols specialization in "Heavy Pistols" vs "Light Pistols" - how does this work?

**Impact:** Cannot implement specialization system.

---

### 10. Skill Groups
**Issue:** Mentioned but not explained.

**Questions:**
- What are skill groups?
- How do skill groups differ from individual skills?
- What skill groups exist?
- What are the cost differences for purchasing groups vs individual skills?
- Can you purchase a group and then specialize in individual skills within it?

**Impact:** Cannot implement skill group purchasing.

---

## Clarifications Needed

### 11. Spirit Conjuring Cost
**Issue:** Source document has potential typo: "1 spell point per power of the spirts force at a rate of 1 spell point per force and 2 spell points per service"

**Clarification Needed:**
- Should this be: "1 spell point per Force + 2 spell points per service"?
- Or is there a "power" component as well?
- Current interpretation: 1 point per Force, +2 points per service
- Verify correct interpretation

---

### 12. Attribute Distribution Verification
**Issue:** Document says attributes can be allocated "unevenly (e.g., 8 points to Body, 4 to Quickness, etc.)" but also says "Maximum per attribute: 6 points before racial modifiers"

**Clarification Needed:**
- The example "8 points to Body" conflicts with "max 6 points"
- Should the example be corrected to show max 6?
- Or can attributes exceed 6 during initial distribution?
- Verify: Maximum is 6 before modifiers, but after modifiers they can exceed 6 (subject to metatype max)

---

### 13. Knowledge Skill Linked Attributes
**Issue:** Document says knowledge skills use "typically Intelligence or Charisma" but doesn't specify which ones use which.

**Clarification Needed:**
- Which knowledge skills link to Intelligence?
- Which knowledge skills link to Charisma?
- Are there knowledge skills that link to other attributes?
- Do language skills have linked attributes, and which ones?

---

### 14. Bioware Essence Costs
**Issue:** Document says "Bioware costs nuyen but doesn't reduce Essence (much more expensive)" but earlier notes suggest some sources say bioware might have minimal essence cost.

**Clarification Needed:**
- Does bioware reduce Essence at all?
- If so, how much (percentage reduction, or flat cost)?
- Or is it truly no essence cost but just very expensive?

---

### 15. Equipment Availability
**Issue:** Availability ratings are mentioned but enforcement rules are unclear.

**Clarification Needed:**
- Should we enforce availability ratings during character creation?
- Or allow any equipment purchase (with GM oversight)?
- If enforced, how do availability rolls work during creation?
- Are there automatic successes or bonuses during creation?

---

## Nice-to-Have (Non-Critical)

### 16. Starting Karma Variations
**Question:** Is starting karma always 0, or can it vary based on character concept or GM discretion?

### 17. Contact Allocation vs Purchase
**Question:** Are there specific rules for when contacts can be allocated (free) vs purchased with nuyen, or is this GM discretion?

### 18. Magic Tradition Differences
**Question:** Beyond tradition name, are there mechanical differences between Hermetic and Shamanic traditions at character creation?

### 19. Racial Attribute Maximums Detail
**Question:** While we know maximums exist, having the exact numbers for each metatype would be helpful (e.g., Human all 6, Elf Quickness 7 Charisma 7, etc. - but what are the exact caps?).

### 20. Focus Types
**Question:** What types of foci exist? Are there categories or types with different rules?

---

## Priority Order for Implementation

1. **Skill Linked Attributes** (Critical - blocks skill cost calculation)
2. **Metatype Attribute Maximums** (Critical - blocks attribute validation)
3. **Contacts System** (High - needed for Resources step)
4. **Lifestyle System** (High - needed for Resources step)
5. **Spell Lists** (High - needed for magical character creation)
6. **Adept Powers** (High - needed for Adept creation)
7. **Aspected Magician Restrictions** (Medium - needed for Aspected creation)
8. **Specialization Details** (Medium - enhances skill system)
9. **Language Skills** (Medium - mentioned in creation order)
10. **Skill Groups** (Low - mentioned but not critical)

---

## Summary

**Total Critical Gaps:** 10 (need for implementation)
**Total Clarifications Needed:** 5 (unclear in documentation)
**Total Nice-to-Haves:** 5 (would be helpful but not blocking)

The most critical gap is **Skill Linked Attributes** - without this, we cannot calculate skill costs during character creation, which is a fundamental requirement.

