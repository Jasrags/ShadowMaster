> [!NOTE]
> This implementation guide is governed by the [Capability (TBD)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/TBD).

# **Ruleset Architecture & Source Material System (Expanded Requirements)**

## **1. Ruleset Isolation & Edition-Specific Data**

Each Shadowrun edition must exist as a **self-contained, sandboxed ruleset** that does *not* assume the presence of mechanics or content from other editions.

### **Key Requirements**

* **No cross-contamination**:
  SR5 can have *bioware* and *limits*; SR2/SR3 might not.
  SR6 has *Edge economy*; SR4/SR5 do not share that exact system.
* **Each ruleset must define ALL of the following independently**:

  * Attributes
  * Skills
  * Skill groups (if applicable)
  * Derived stats
  * Damage systems
  * Combat turn structure
  * Item systems (gear, weapons, armor)
  * Cyberware / Bioware / Nanotech (per edition capability)
  * Magic/Resonance structures
  * Priority or point-buy rules
  * Metatypes and their costs/limits
  * Availability rules
  * Karma advancement rules
  * Edge mechanics (SR6 only)
  * Matrix/rigger action sets (edition-specific)

### **Version Containment**

* Each ruleset is versioned by **Edition → Book → Release**
  Example: `SR5.Core.1.0` or `SR3.MagicInTheShadows.1.2`
* Updating data for one edition cannot break a campaign or character tied to another.

---

## **2. Book-Based Data Model**

Because Shadowrun organizes rules and content by book type, your system should reflect these categories.

### **2.1 Core Rulebooks**

These define the **baseline ruleset for an edition**.

#### Content Provided

* Base attributes, skills, derived stats
* Combat and action economy
* Base spells and adept powers
* Base cyberware/bioware/nanotech
* Base gear, weapons, armor
* Metatypes
* Magic and resonance mechanics
* Matrix rules
* Priority/point buy creation methods
* Lifestyle, contacts, and core game systems
* Equipment availability and cost rules

#### Requirements

* The **Core Rulebook becomes the foundation bundle** for a ruleset.
* All characters for that edition require this bundle.
* Additional books extend the core (never replace it).

---

### **2.2 Sourcebooks (Optional Rule Expansions + Gear + Lore)**

Each sourcebook provides *optional* or *expanded* systems for its edition.

#### Examples

* **Arsenal (SR4)** — new weapons, mods, vehicles
* **Street Grimoire (SR5)** — new spells, traditions, metamagic
* **Run & Gun (SR5)** — combat maneuvers, armor mods
* **Man & Machine (SR3)** — in SR3 this may be core bioware/cyberware

#### Content Provided

* Additional gear, spells, magic traditions
* Optional rule modules (e.g., advanced recoil, martial arts)
* New character creation options
* New qualities / flaws
* Additional metatypes or variants
* New mechanics (e.g., drug use, toxins, advanced combat)

#### Requirements

* A user (or GM) can toggle **sourcebook modules** on/off per campaign.
* Characters must validate against whichever modules the GM enables.
* Data conflicts resolved by “last defined wins” or book priority rules.

---

### **2.3 Adventures / Modules**

These are narrative expansions but also may include mechanical content.

#### Content Provided

* NPCs
* Locations
* Pre-written encounters
* Maps and scene descriptions
* New spells / items (occasionally)
* New gear or weapons relevant to the adventure

#### Requirements

* Adventures import as **campaign components**, not global rules.
* Any mechanical content included must be:

  * Either tagged as **adventure-specific**
  * Or pushed to the global ruleset only if GM chooses to allow it

---

### **2.4 Novels**

These rarely introduce hard rules, but can include:

* Named characters
* Corporate history
* Lore bits
* Weapons or cyberware mentioned in fiction

#### Requirements (Optional)

* Novels may be included as **lore-only modules**.
* No mechanical changes unless GM opts into a “fiction content pack.”

(You can deprioritize novels unless you later want a lore database.)

---

### **2.5 Mission Books**

Mission books resemble mini-campaigns or episodic content.

#### Content Provided

* NPCs
* Locations
* Mission structure
* Encounter templates
* Occasionally new gear or minor rules adjustments

#### Requirements

* Missions import like Adventures → as campaign content only.
* Their mechanical content is opt-in, not global by default.

---

# **3. Ruleset Data Storage Requirements**

## **3.1 Structure**

Each ruleset edition must consist of:

* **Core Bundle** (mandatory)
* Zero or more **Sourcebook Bundles**
* Zero or more **Adventure/Mission Bundles**
* Zero or more **Lore Bundles (Novels)**

A “bundle” contains:

1. Metadata (name, publisher, ISBN, etc.)
2. Mechanical content
3. Lore content
4. Optional rules
5. Tags indicating category and dependencies

---

## **3.2 Data Isolation**

### **Requirement**

A player selecting *Shadowrun 3E* should only ever see:

* SR3 core content
* SR3-compatible sourcebooks
* SR3 adventures (if linked to a campaign)
* No bioware (unless using a book that adds it!)
* No 4E/5E/6E mechanics

### GM Controls

The GM chooses:

* Which edition the campaign uses
* Which book bundles are enabled
* Which optional rules apply

Players’ characters must always validate against that set.

---

# **4. How This Integrates with the System**

## **4.1 Character Creation**

* The system loads **only the books/bundles allowed by the GM or user** for that character.
* Validation uses:

  * Edition → Core → Active Sourcebooks
  * Optional rules toggles

## **4.2 Campaign Management**

* The GM picks an edition and selects which bundles apply:

  * Core Rulebook (mandatory)
  * Sourcebooks (toggle)
  * Optional rules (toggle)
  * Adventure/Mission content (auto-loaded but optional to expose)

## **4.3 Dice and Automation Engine**

* Every mechanical calculation consults the **edition’s ruleset sandbox**.
* No shared assumptions across editions.

---

# **5. Additional Enhancements (Optional Future Scope)**

### **AI-based rules linking**

* Automatically link characters, gear, spells, and cyberware to page references in the books.

### **Module Marketplace**

* Homebrew books or content packs could be added later.

---

# **Next Steps I can help with**

If you want, I can produce any of the following based on this:

1. **Database schema** for the ruleset/book system
2. **Ruleset bundle JSON specification** (how each book’s data files should be structured)
3. **Architecture diagram** showing how rulesets load into the engine
4. **Expanded PRD incorporating these details section-by-section**
5. **GM+Player personas** specifically for Shadowrun
6. **Edition selection UX flow**
7. **A complete MVP → Beta → V1 roadmap**

Just tell me which direction you’d like to go next.
