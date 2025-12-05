# **Character Creation Framework (Edition-Aware + Extensible)**

## **1. Core Requirement**

Each edition defines **its own set of character creation frameworks**, and any book (usually sourcebooks) can **extend**, **modify**, or **replace** those frameworks.

This means character creation is not a single fixed workflow — it is a **ruleset-defined module system**.

---

# **2. Requirements for Character Creation Systems**

### **2.1 A “Creation Method” is a First-Class Object**

A creation method is a reusable, versioned module that defines:

* The workflow steps
* Attribute allocation rules
* Skill point systems / caps
* Availability rules
* Magic/Resonance creation steps
* Gear/nuyen acquisition rules
* Metatype selection rules
* Resource budgets (BP, Karma, Priority tables, Build Points, etc.)
* Derived stat formulas
* Validation rules
* Optional rules
* UI presentation (optional metadata)

Each edition can have multiple creation methods.

---

## **2.2 Examples by Edition**

### **Shadowrun 3E**

* Priority
* Sum-to-10
* Point-buy (optional, from specific books)

### **Shadowrun 4E**

* BP (Build Points)
* Karma Generation (from later books)

### **Shadowrun 5E**

* Priority System (Core)
* Point Buy (optional)
* Life Modules (appears in later books)
* Street-Level rules (reduced starting nuyen, gear caps)
* Prime Runner rules (enhanced budgets)

### **Shadowrun 6E**

* Priority System
* Downtime Character Creation (later expansion)

Each of these must exist as **discrete creation method modules**.

---

# **3. Book-Driven Extension of Character Creation**

Each book can:

### **3.1 Add a New Method**

* Example: *SR5: Run Faster* introduces **Life Modules**
* Example: *SR4: Runner’s Companion* introduces **Modified BP/karma systems**

### **3.2 Modify an Existing Method**

Books may update:

* Metatype BP costs
* Attribute caps
* Starting gear limits
* Magic initiation rules
* Available qualities
* Skill rating maximums

### **3.3 Extend a Method with New Options**

This is extremely common.

Examples:

* New qualities
* New spells
* New adept powers
* New cyberware options
* New metavariants
* Alternate priority tables
* Street-level / Prime-runner variants

### **3.4 Override Rules When Enabled**

A book may say:

> “If your GM allows this content, replace table X with table Y.”

Therefore the system must support **conditional overrides**.

---

# **4. Technical Requirements for Creation Method Architecture**

To support the above, the system must:

## **4.1 Treat Creation Methods as Versioned, Plug-in Modules**

Each creation method module contains:

* Metadata (edition, book, name, version, dependencies)
* Workflows (defined as steps or states)
* Budget definitions (BP, Karma, Priority A–E tables)
* Attribute constraints
* Skill/quality availability rules
* Optional rules flags
* Validation schemas
* References to item categories (gear, spells, cyberware)
* Override hooks (from later books)

The system resolves:

1. Edition core →
2. Allowed books →
3. Creation method overrides →
4. Final merged creation workflow

---

## **4.2 Character Validation Must Be Method-Aware**

Validation requires:

* Correct budgets spent
* Rules of the selected method applied
* Legal choices based on enabled books
* Edition-correct stat calculations

A character built using SR5 Priority cannot validate against SR6 Karma.

---

## **4.3 GM Controls for Campaigns**

The GM selects:

* **Edition**
* **Enabled Books / Modules**
* **Allowed Character Creation Methods**

For example:

> GM enables SR5 + Run Faster + Street Grimoire
> → available creation methods: Priority, Point-Buy, Life Modules
> → available optional rules: Street-Level, Prime Runner

Players must select from these options.

---

# **5. UI/UX Requirements**

### **5.1 Dynamic Step Builder**

Character creation UI is not fixed — the edition defines steps like:

* Choose metatype
* Assign attributes
* Choose magical type
* Choices vary dramatically across editions

The interface must load this from the ruleset rather than being hardcoded.

### **5.2 Live Validation**

At each step:

* Show available points
* Show warnings/errors
* Prevent completion if rules are violated

---

# **6. Storage Schema Requirements**

### **6.1 Entities required:**

* `CreationMethod`
* `CreationMethodStep`
* `CreationMethodBudget`
* `CreationMethodOverride`
* `BookBundle` (provides extensions)
* `EditionRuleset`
* `Character` (tied to edition + creation method version)

Where:

* A `CreationMethod` belongs to an edition.
* Books contain `CreationMethodOverrides`.
* A GM or player chooses a creation method at the start.

---

# **7. Summary of the Expanded Requirement**

### **The system must support:**

* Distinct creation workflows per edition
* Multiple creation systems within the same edition
* Extensions, overrides, and new workflows provided by books
* Validation tied to the selected workflow and book set
* A dynamic UI that loads steps and rules from the ruleset
* Safe, versioned, edition-specific data isolation
* GM control over allowed creation methods and optional rules

This requirement is essential for correctly modeling Shadowrun’s real-world rule complexity and modularity.

---

# **Next – I can help you with:**

* A **JSON schema** for a `CreationMethod` module
* A **database model for rulesets + creation methods**
* A **ruleset loading/merging algorithm**
* A more formal PRD section incorporating this
* A **flowchart** of how character creation loads and validates
* The **UI/UX design** for a modular character creation wizard

Tell me where you'd like to go next!
