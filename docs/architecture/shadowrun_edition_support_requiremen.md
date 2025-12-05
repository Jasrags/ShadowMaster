# **Shadowrun Edition Support Requirements**

Your platform must support all major editions of Shadowrun as distinct, self-contained rulesets.
Each edition has different mechanics, character creation methods, dice systems, spell rules, cyberware structures, Matrix rules, and optional rules.
**No edition may assume or inherit data from another edition.**

---

# **Editions to Support**

Below is the canonical list of editions, including variant editions and the separate Anarchy system.
Each one must be treated as a separate ruleset.

---

## **1. Shadowrun First Edition (SR1) — 1989**

### **Design Notes**

* Establishes core concepts, world, attributes, skills, priority system.
* Early cyberware & magic systems.
* Basic Matrix (decking) rules.

### **System Requirements**

* Priority creation system.
* SR1 skills, spells, gear, metatypes.
* SR1 combat rules (exploding 6s).

---

## **2. Shadowrun Second Edition (SR2) — 1992**

### **Design Notes**

* Expanded mechanics, more cohesive Matrix rules.
* Magic refined.

### **System Requirements**

* Priority system with SR2 values.
* SR2-specific gear, cyberware, spells.
* Different derived stats from SR1.

---

## **3. Shadowrun Third Edition (SR3) — 1998**

### **Design Notes**

* More depth and balance, though some felt magic was strong.
* Full Rigger 3, Matrix rewrites (Matrix 3), bioware (introduced here).

### **System Requirements**

* Priority, Sum-to-10, Point-buy (book-dependent).
* SR3 cyberware/bioware system.
* SR3 combat, initiative, recoil, target numbers.
* Adept powers, spells, metamagic from SR3 books.

---

## **4. Shadowrun Fourth Edition (SR4) — 2005**

### **Design Notes**

* Complete overhaul.
* Fixed target numbers (5 hits) with variable dice pools.
* New Matrix/Wireless rules (AR/VR).
* Streamlined skills/attributes.

### **System Requirements**

* Build Point (BP) system.
* SR4 gear, spells, qualities, cyberware.
* New attribute list (Edge, Magic, Resonance included).
* The wireless Matrix becomes core.

---

## **4A. Shadowrun 20th Anniversary Edition (SR4A) — 2009**

### **Design Notes**

* Version of SR4 with errata and improvements.
* No mechanical overhaul, just refinement.

### **System Requirements**

* SR4A treated as a **separate ruleset** because:

  * Costs change
  * Dice pool modifiers change
  * Some skills/gear updated

---

## **5. Shadowrun Fifth Edition (SR5) — 2013**

### **Design Notes**

* Iteration based on SR4/SR4A.
* Introduces Limits.
* Initiative modified again.
* Complex gear & cyberware ecosystems.

### **System Requirements**

* Priority creation (core).
* Point Buy (from Run Faster).
* Life Modules (Run Faster).
* SR5 gear, cyberware, spells, metamagic.
* Matrix 3.0 rules (Deckers differ from SR4).
* Limits system for actions.

---

## **6. Shadowrun Sixth World Edition (SR6 / 6WE) — 2019**

### **Design Notes**

* Focus on the Edge economy.
* Simplified dice pools and action lists.
* Overhauled Matrix again.

### **System Requirements**

* Priority creation with new tables.
* New skill list.
* New cyberware system.
* Edge-based mechanics (core to SR6).
* Updateable via later sourcebooks.

---

## **Shadowrun: Anarchy (2016) — Separate System**

### **Design Notes**

* Narrative, rules-light version.
* Uses Cue System.
* Uses attributes + dice pools, but simplified.
* Designed to play with narrative beats rather than tactical mechanics.

### **System Requirements**

* Entirely separate ruleset.
* Character creation uses:

  * Cues
  * Shadow Amps
  * Plot Points

### **Integration Requirements**

* Characters created in Anarchy **cannot** join a standard SR1–SR6 campaign.
* Must support separate:

  * Creation method
  * Gear lists
  * Spells
  * Advancement system

---

# **Edition Support Requirements Summary**

Your system must support:

| Edition           | Year | Distinct Ruleset?   | Notes                               |
| ----------------- | ---- | ------------------- | ----------------------------------- |
| SR1               | 1989 | Yes                 | Original priority system            |
| SR2               | 1992 | Yes                 | Enhanced SR1                        |
| SR3               | 1998 | Yes                 | Adds bioware, refined magic         |
| SR4               | 2005 | Yes                 | Fixed TN dice pools, new Matrix     |
| SR4A              | 2009 | Yes                 | SR4 variant; treat independently    |
| SR5               | 2013 | Yes                 | Limits, Run Faster creation methods |
| SR6 / Sixth World | 2019 | Yes                 | Edge economy                        |
| Anarchy           | 2016 | Completely separate | Narrative Cue System                |

---

# **Edition Implementation Requirements**

## **1. Each edition must define:**

* Attribute list
* Skill list
* Derived stats and formulas
* Combat rules
* Action economy
* Damage system
* Dice mechanics
* Matrix rules
* Magic rules
* Spirit/summoning rules
* Cyberware/bioware/nanotech
* Metatypes and costs
* Gear lists
* Adept powers
* Vehicles/drones
* Ammunition rules
* Initiative rules

## **2. Each edition must define its own creation methods**

Examples:

| Edition | Creation Methods                                |
| ------- | ----------------------------------------------- |
| SR1     | Priority                                        |
| SR2     | Priority                                        |
| SR3     | Priority, Sum-to-10, Point-buy                  |
| SR4     | BP                                              |
| SR4A    | BP                                              |
| SR5     | Priority, Point Buy, Life Modules               |
| SR6     | Priority                                        |
| Anarchy | Narrative character assembly (Cues, Amps, etc.) |

## **3. Each edition must have isolated data modules**

No sharing, bending, or inheriting mechanics between:

* Skills
* Items
* Spell mechanics
* Cyberware rules
* Matrix actions
* Derived stats
* Magical traditions

## **4. Campaigns must lock to an Edition**

A campaign created under SR5 cannot include:

* SR6 Edge
* SR4A dice pool math
* SR3 bioware
* Anarchy narrative mechanics

Everything must validate against the edition RPG logic.

---

# **Next Steps**

I can now help with any of these:

### ✔ A complete PRD section titled “Edition Support & Ruleset Architecture”

### ✔ A database schema for editions, creation methods, books, and rules modules

### ✔ A merging algorithm for book-based rule overrides

### ✔ A system design diagram showing how rulesets load and validate

### ✔ Edition comparison tables (attributes, skills, combat, Matrix, etc.) to guide development

### ✔ A recommended MVP edition to start with (SR5 or SR6 usually easiest)

Just tell me which direction you want to continue.
