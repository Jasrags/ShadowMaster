# Shadowrun 5e Character Model Implementation Plan

_Last updated: 2025-01-27_

## Executive Summary

Before extending the Character domain model for NPC library features, we need to complete the SR5 character data structure. Currently, only `CharacterSR3` exists in the codebase, but the system supports SR5 campaigns and character creation workflows. This plan outlines the implementation of a complete `CharacterSR5` domain model that aligns with SR5 rules and supports all character creation methods (Priority, Sum-to-Ten, Karma).

---

## 1. Current State Assessment

### 1.1 What Exists
- ✅ `Character` base struct with `Edition` and `EditionData interface{}`
- ✅ `CharacterSR3` complete implementation
- ✅ SR5 character creation documentation (`docs/rules/5e/character-creation.md`)
- ✅ SR5 data tables (`docs/rules/5e/data-tables.md`)
- ✅ SR5 validation services (`internal/service/sr5_sum_to_ten.go`, `sr5_karma.go`)
- ✅ Campaign support for SR5 edition
- ✅ React wizard steps for Priority, Metatype, Magic selection (SR5-aware)

### 1.2 What's Missing
- ❌ `CharacterSR5` domain struct
- ❌ SR5-specific attribute handling (Agility, Reaction, Intuition, Logic vs SR3's Quickness, Intelligence)
- ❌ Special attributes (Edge, Magic, Resonance) tracking
- ❌ Qualities system (positive/negative qualities with karma costs)
- ❌ SR5 contact system (Connection/Loyalty vs SR3's Level/Loyalty)
- ❌ Technomancer support (Resonance, Complex Forms, Living Persona)
- ❌ SR5 derived stats calculation (Initiative = Reaction + Intuition, Limits)
- ❌ SR5 reputation system (Street Cred, Notoriety, Public Awareness)
- ❌ SR5 lifestyle system (with modifiers and options)
- ❌ SR5 augmentation tracking (cyberware/bioware with Essence impact on Magic/Resonance)

---

## 2. SR5 vs SR3 Key Differences

### 2.1 Attributes

| Aspect | SR3 | SR5 |
|--------|-----|-----|
| **Physical Attributes** | Body, Quickness, Strength | Body, Agility, Reaction, Strength |
| **Mental Attributes** | Intelligence, Willpower, Charisma | Logic, Intuition, Willpower, Charisma |
| **Special Attributes** | Magic | Edge, Magic, Resonance |
| **Derived: Initiative** | Quickness + Intelligence | Reaction + Intuition |
| **Derived: Reaction** | Quickness + Intelligence | Separate attribute (Reaction) |

### 2.2 Magic System

| Aspect | SR3 | SR5 |
|--------|-----|-----|
| **Magic Types** | Magician, Adept | Magician, Mystic Adept, Adept, Aspected Magician, Technomancer |
| **Technomancers** | ❌ Not in SR3 | ✅ Resonance attribute, Complex Forms, Living Persona |
| **Power Points** | Adepts only | Adepts + Mystic Adepts (purchased with Karma) |
| **Magic Loss** | Essence reduction reduces Magic | Same, but also affects Resonance |

### 2.3 Contacts

| Aspect | SR3 | SR5 |
|--------|-----|-----|
| **Ratings** | Level (1-3), Loyalty (1-3) | Connection (1+), Loyalty (1+) |
| **Free Contacts** | Based on Charisma | Charisma × 3 Karma worth |
| **Meaning** | Level = Contact, Buddy, Friend | Connection = influence/reach, Loyalty = willingness |

### 2.4 New Systems in SR5

- **Qualities**: Positive (cost Karma) and Negative (grant Karma) traits
- **Reputation**: Street Cred, Notoriety, Public Awareness (three separate scores)
- **Lifestyle Options**: Special Work Area, Extra Secure, etc. (modifiers)
- **Limits**: Physical, Mental, Social limits (derived from attributes)
- **Condition Monitors**: Physical and Stun tracks (calculated from Body/Willpower)

---

## 3. CharacterSR5 Domain Model Design

### 3.1 Core Structure

```go
// CharacterSR5 represents Shadowrun 5th edition specific character data
type CharacterSR5 struct {
    // ===== ATTRIBUTES =====
    // Physical Attributes
    Body      int `json:"body"`
    Agility   int `json:"agility"`
    Reaction  int `json:"reaction"`  // Separate attribute in SR5
    Strength  int `json:"strength"`
    
    // Mental Attributes
    Logic      int `json:"logic"`      // Replaces Intelligence
    Intuition  int `json:"intuition"` // New in SR5
    Willpower  int `json:"willpower"`
    Charisma   int `json:"charisma"`
    
    // Special Attributes
    Edge      int `json:"edge"`      // New: luck/hero points
    Magic     int `json:"magic"`     // 0 for mundanes
    Resonance int `json:"resonance"`  // New: technomancer attribute
    
    // Derived Attributes (calculated, but stored for quick access)
    Essence        float64 `json:"essence"`         // Starts at 6.0
    Initiative     int     `json:"initiative"`     // Reaction + Intuition
    InitiativeDice int     `json:"initiative_dice"` // Usually 1D6, can be modified
    
    // Limits (derived from attributes)
    PhysicalLimit int `json:"physical_limit"`
    MentalLimit   int `json:"mental_limit"`
    SocialLimit   int `json:"social_limit"`
    
    // Condition Monitors
    PhysicalBoxes int `json:"physical_boxes"` // (Body / 2) + 8, round up
    StunBoxes     int `json:"stun_boxes"`     // (Willpower / 2) + 8, round up
    OverflowBoxes int `json:"overflow_boxes"`  // Body, can be modified by qualities
    
    // ===== METATYPE & CREATION =====
    Metatype string `json:"metatype"` // Human, Elf, Dwarf, Ork, Troll
    
    // Priority System (SR5)
    PriorityAssignments PriorityAssignmentsSR5 `json:"priority_assignments"`
    
    // Creation Method
    CreationMethod string `json:"creation_method"` // "priority", "sum_to_ten", "karma"
    
    // ===== QUALITIES =====
    PositiveQualities []QualitySelection `json:"positive_qualities"`
    NegativeQualities []QualitySelection `json:"negative_qualities"`
    
    // ===== SKILLS =====
    ActiveSkills    map[string]Skill `json:"active_skills"`
    KnowledgeSkills map[string]KnowledgeSkill `json:"knowledge_skills"`
    LanguageSkills  map[string]LanguageSkill `json:"language_skills"`
    
    // ===== MAGIC & RESONANCE =====
    // Magic User Type
    MagicUserType string `json:"magic_user_type,omitempty"` // "magician", "mystic_adept", "adept", "aspected", "technomancer", ""
    
    // Tradition/Discipline
    Tradition  string `json:"tradition,omitempty"`  // Hermetic, Shamanic, etc.
    Discipline string `json:"discipline,omitempty"` // Technomancer tradition
    
    // Spells & Magic
    Spells      []SpellSR5      `json:"spells"`
    Rituals     []RitualSR5     `json:"rituals,omitempty"`
    Focuses     []FocusSR5      `json:"focuses"`
    BoundSpirits []BoundSpiritSR5 `json:"bound_spirits"`
    
    // Adept Powers
    AdeptPowers []AdeptPowerSR5 `json:"adept_powers,omitempty"`
    PowerPoints float64         `json:"power_points,omitempty"` // For adepts/mystic adepts
    
    // Technomancer
    ComplexForms []ComplexFormSR5 `json:"complex_forms,omitempty"`
    RegisteredSprites []RegisteredSpriteSR5 `json:"registered_sprites,omitempty"`
    LivingPersona *LivingPersonaSR5 `json:"living_persona,omitempty"`
    
    // Initiation/Submersion
    InitiationGrade int `json:"initiation_grade,omitempty"` // For magicians
    SubmersionGrade int `json:"submersion_grade,omitempty"` // For technomancers
    
    // ===== AUGMENTATIONS =====
    Cyberware []CyberwareSR5 `json:"cyberware"`
    Bioware  []BiowareSR5    `json:"bioware"`
    
    // Augmented Attributes (track natural vs augmented)
    AugmentedAttributes map[string]int `json:"augmented_attributes,omitempty"` // e.g., {"strength": 6} when natural is 4
    
    // ===== EQUIPMENT =====
    Weapons   []WeaponSR5   `json:"weapons"`
    Armor     []ArmorSR5    `json:"armor"`
    Gear      []ItemSR5     `json:"gear"`
    Vehicles  []VehicleSR5   `json:"vehicles"`
    Drones    []DroneSR5    `json:"drones,omitempty"`
    
    // Commlinks & Matrix Gear
    Commlinks []CommlinkSR5 `json:"commlinks,omitempty"`
    Cyberdecks []CyberdeckSR5 `json:"cyberdecks,omitempty"`
    
    // ===== SOCIAL =====
    Contacts []ContactSR5 `json:"contacts"`
    Lifestyle LifestyleSR5 `json:"lifestyle"`
    
    // Reputation (SR5 has three separate scores)
    Reputation ReputationSR5 `json:"reputation"`
    
    // ===== RESOURCES =====
    Nuyen        int `json:"nuyen"`
    StartingNuyen int `json:"starting_nuyen,omitempty"`
    
    // ===== ADVANCEMENT =====
    Karma      int `json:"karma"`
    TotalKarma int `json:"total_karma"`
    KarmaLedger []KarmaEntry `json:"karma_ledger,omitempty"` // Track karma history
    
    // ===== NARRATIVE =====
    Concept     string `json:"concept,omitempty"`
    Backstory   string `json:"backstory,omitempty"`
    Personality string `json:"personality,omitempty"`
    Appearance  string `json:"appearance,omitempty"`
    Notes       string `json:"notes,omitempty"`
    
    // ===== PLAY STATE =====
    CurrentPhysicalDamage int `json:"current_physical_damage,omitempty"`
    CurrentStunDamage     int `json:"current_stun_damage,omitempty"`
    CurrentEdge           int `json:"current_edge,omitempty"` // Can fluctuate during play
    TemporaryModifiers    []TemporaryModifier `json:"temporary_modifiers,omitempty"`
}
```

### 3.2 Supporting Types

```go
// PriorityAssignmentsSR5 tracks SR5 priority selections
type PriorityAssignmentsSR5 struct {
    MetatypePriority    string `json:"metatype_priority"`    // A-E
    AttributePriority    string `json:"attribute_priority"`  // A-E
    MagicPriority        string `json:"magic_priority"`      // A-E
    SkillsPriority       string `json:"skills_priority"`     // A-E
    ResourcesPriority    string `json:"resources_priority"`  // A-E
    SpecialAttributePoints int  `json:"special_attribute_points"` // From metatype priority
}

// QualitySelection represents a selected quality
type QualitySelection struct {
    QualityID   string `json:"quality_id"`
    Name        string `json:"name"`
    Type        string `json:"type"`        // "positive" or "negative"
    KarmaValue  int    `json:"karma_value"`
    Rating      int    `json:"rating,omitempty"` // For per-rating qualities
    Source      string `json:"source"`      // "creation", "advancement", "story"
    Notes       string `json:"notes,omitempty"`
}

// KnowledgeSkill extends Skill with category
type KnowledgeSkill struct {
    Skill
    Category string `json:"category"` // "Academic", "Interests", "Professional", "Street"
    LinkedAttribute string `json:"linked_attribute"` // "Logic" or "Intuition"
}

// LanguageSkill extends Skill
type LanguageSkill struct {
    Skill
    IsNative bool `json:"is_native"` // True for native languages
}

// SpellSR5 represents an SR5 spell
type SpellSR5 struct {
    Name       string `json:"name"`
    Type       string `json:"type"`       // Combat, Detection, Health, Illusion, Manipulation
    Category   string `json:"category"`   // Spell category
    DrainCode  string `json:"drain_code"` // Physical/Stun and value (e.g., "P-2")
    Range      string `json:"range,omitempty"`
    Duration   string `json:"duration,omitempty"`
    Notes      string `json:"notes,omitempty"`
}

// RitualSR5 represents a ritual spell
type RitualSR5 struct {
    Name       string `json:"name"`
    Type       string `json:"type"`
    DrainCode  string `json:"drain_code"`
    Notes      string `json:"notes,omitempty"`
}

// FocusSR5 represents a magical focus
type FocusSR5 struct {
    Name   string `json:"name"`
    Type   string `json:"type"`   // Spell, Power, Weapon, etc.
    Rating int    `json:"rating"`
    Force  int    `json:"force,omitempty"`
    Bonded bool   `json:"bonded"`
    Notes  string `json:"notes,omitempty"`
}

// BoundSpiritSR5 represents a bound spirit
type BoundSpiritSR5 struct {
    Type     string `json:"type"` // Fire, Earth, Air, Water, Man, etc.
    Force    int    `json:"force"`
    Services int    `json:"services"` // Services owed
    Notes    string `json:"notes,omitempty"`
}

// AdeptPowerSR5 represents an adept power
type AdeptPowerSR5 struct {
    Name        string  `json:"name"`
    Rating      int     `json:"rating,omitempty"`
    PowerPoints float64 `json:"power_points"` // Power Points spent
    Attribute   string  `json:"attribute,omitempty"` // For Attribute Boost, etc.
    Notes       string  `json:"notes,omitempty"`
}

// ComplexFormSR5 represents a technomancer complex form
type ComplexFormSR5 struct {
    Name      string `json:"name"`
    FadingCode string `json:"fading_code"` // Physical/Stun and value
    Notes     string `json:"notes,omitempty"`
}

// RegisteredSpriteSR5 represents a registered sprite
type RegisteredSpriteSR5 struct {
    Type     string `json:"type"` // Machine, Fault, Data, etc.
    Level    int    `json:"level"`
    Services int    `json:"services"`
    Notes    string `json:"notes,omitempty"`
}

// LivingPersonaSR5 represents technomancer's Living Persona stats
type LivingPersonaSR5 struct {
    Attack  int `json:"attack"`  // Logic
    Sleaze  int `json:"sleaze"`  // Intuition
    DataProcessing int `json:"data_processing"` // Logic
    Firewall int `json:"firewall"` // Willpower
    Resonance int `json:"resonance"` // Resonance attribute
}

// CyberwareSR5 extends Cyberware with SR5-specific fields
type CyberwareSR5 struct {
    Name         string  `json:"name"`
    Rating       int     `json:"rating,omitempty"`
    EssenceCost  float64 `json:"essence_cost"`
    Cost         int     `json:"cost,omitempty"`
    Availability int     `json:"availability,omitempty"`
    Grade        string  `json:"grade,omitempty"` // "standard", "alphaware", "betaware", "deltaware"
    Notes        string  `json:"notes,omitempty"`
}

// BiowareSR5 extends Bioware with SR5-specific fields
type BiowareSR5 struct {
    Name         string `json:"name"`
    Rating       int    `json:"rating,omitempty"`
    EssenceCost  float64 `json:"essence_cost"`
    Cost         int    `json:"cost"`
    Availability int    `json:"availability,omitempty"`
    Grade        string `json:"grade,omitempty"`
    Notes        string `json:"notes,omitempty"`
}

// WeaponSR5 extends Weapon with SR5-specific fields
type WeaponSR5 struct {
    Name           string `json:"name"`
    Type           string `json:"type"`   // Firearm, Melee, Thrown, etc.
    Damage         string `json:"damage"` // Damage code (e.g., "8P" for 8 Physical)
    Accuracy       int    `json:"accuracy"`
    AP             int    `json:"ap,omitempty"` // Armor Penetration
    Mode           string `json:"mode,omitempty"` // SS, SA, BF, FA
    Range          string `json:"range,omitempty"`
    Ammo           string `json:"ammo,omitempty"`
    Availability   int    `json:"availability,omitempty"`
    Notes          string `json:"notes,omitempty"`
}

// ArmorSR5 extends Armor with SR5-specific fields
type ArmorSR5 struct {
    Name       string `json:"name"`
    Rating     int    `json:"rating"`
    Type       string `json:"type"`
    Capacity   int    `json:"capacity,omitempty"` // For mods
    Modifications []string `json:"modifications,omitempty"`
    Notes      string `json:"notes,omitempty"`
}

// ItemSR5 extends Item with SR5-specific fields
type ItemSR5 struct {
    Name         string `json:"name"`
    Type         string `json:"type"`
    Count        int    `json:"count"`
    Availability int    `json:"availability,omitempty"`
    Notes        string `json:"notes,omitempty"`
}

// VehicleSR5 extends Vehicle with SR5-specific fields
type VehicleSR5 struct {
    Name          string   `json:"name"`
    Type          string   `json:"type"`
    Handling      int      `json:"handling"`
    Speed         int      `json:"speed"`
    Acceleration  int      `json:"acceleration"`
    Body          int      `json:"body"`
    Armor         int      `json:"armor,omitempty"`
    Pilot         int      `json:"pilot,omitempty"`
    Sensor        int      `json:"sensor,omitempty"`
    Modifications []string `json:"modifications,omitempty"`
    Notes         string   `json:"notes,omitempty"`
}

// DroneSR5 represents a drone
type DroneSR5 struct {
    Name          string   `json:"name"`
    Type          string   `json:"type"`
    Handling      int      `json:"handling"`
    Speed         int      `json:"speed"`
    Acceleration  int      `json:"acceleration"`
    Body          int      `json:"body"`
    Armor         int      `json:"armor,omitempty"`
    Pilot         int      `json:"pilot,omitempty"`
    Sensor        int      `json:"sensor,omitempty"`
    Modifications []string `json:"modifications,omitempty"`
    Notes         string   `json:"notes,omitempty"`
}

// CommlinkSR5 represents a commlink
type CommlinkSR5 struct {
    Name          string `json:"name"`
    DeviceRating  int    `json:"device_rating"`
    DataProcessing int  `json:"data_processing"`
    Firewall      int    `json:"firewall"`
    Programs      []string `json:"programs,omitempty"`
    Notes         string `json:"notes,omitempty"`
}

// CyberdeckSR5 represents a cyberdeck
type CyberdeckSR5 struct {
    Name          string `json:"name"`
    DeviceRating  int    `json:"device_rating"`
    Attack        int    `json:"attack"`
    Sleaze        int    `json:"sleaze"`
    DataProcessing int  `json:"data_processing"`
    Firewall      int    `json:"firewall"`
    Programs      []string `json:"programs,omitempty"`
    Notes         string `json:"notes,omitempty"`
}

// ContactSR5 represents an SR5 contact
type ContactSR5 struct {
    Name       string `json:"name"`
    Type       string `json:"type"`       // Fixer, Dealer, etc.
    Connection int    `json:"connection"` // 1+ (replaces Level)
    Loyalty    int    `json:"loyalty"`    // 1+ (same name, different meaning)
    Notes      string `json:"notes,omitempty"`
}

// LifestyleSR5 represents SR5 lifestyle
type LifestyleSR5 struct {
    Tier        string   `json:"tier"`        // Street, Squatter, Low, Middle, High, Luxury
    Cost        int       `json:"cost"`        // Monthly cost
    Modifiers   []string  `json:"modifiers,omitempty"` // Special Work Area, Extra Secure, etc.
    Notes       string    `json:"notes,omitempty"`
}

// ReputationSR5 represents SR5 reputation scores
type ReputationSR5 struct {
    StreetCred      int `json:"street_cred"`
    Notoriety       int `json:"notoriety"`
    PublicAwareness int `json:"public_awareness"`
}

// KarmaEntry tracks karma history
type KarmaEntry struct {
    Timestamp   time.Time `json:"timestamp"`
    Amount      int       `json:"amount"`      // Positive for earned, negative for spent
    Source      string    `json:"source"`     // "session", "advancement", "quality", etc.
    Description string    `json:"description"`
}

// TemporaryModifier represents temporary bonuses/penalties
type TemporaryModifier struct {
    Type        string    `json:"type"`        // "dice", "limit", "attribute"
    Target      string    `json:"target"`     // What it affects
    Amount      int       `json:"amount"`
    ExpiresAt   *time.Time `json:"expires_at,omitempty"`
    Description string    `json:"description"`
}
```

---

## 4. Implementation Phases

### Phase 1: Core Domain Model
**Goal**: Define complete `CharacterSR5` struct and supporting types

- [ ] Create `CharacterSR5` struct in `internal/domain/character.go`
- [ ] Define all supporting types (QualitySelection, ContactSR5, etc.)
- [ ] Add type assertions and conversion helpers
- [ ] Write Go unit tests for struct validation
- [ ] Update `Character.EditionData` to support `*CharacterSR5`

**Deliverables**: Complete domain model ready for use

---

### Phase 2: Derived Stats Calculation
**Goal**: Implement SR5-specific derived attribute calculations

- [ ] Create `internal/service/sr5_calculations.go`
- [ ] Implement Initiative calculation (Reaction + Intuition)
- [ ] Implement Limit calculations (Physical, Mental, Social)
- [ ] Implement Condition Monitor calculations
- [ ] Implement Essence tracking with Magic/Resonance impact
- [ ] Handle augmented attributes in calculations
- [ ] Write unit tests for all calculations

**Deliverables**: Service functions to calculate all SR5 derived stats

---

### Phase 3: Repository Integration
**Goal**: Update repositories to handle SR5 characters

- [ ] Update `CharacterRepository` to serialize/deserialize `CharacterSR5`
- [ ] Add validation for SR5-specific fields
- [ ] Update index management for SR5 characters
- [ ] Handle migration from legacy characters (if needed)
- [ ] Write repository tests for SR5 characters

**Deliverables**: Repository layer supports SR5 character persistence

---

### Phase 4: Service Layer Updates
**Goal**: Update character service to work with SR5

- [ ] Update `CharacterService` to handle SR5 creation
- [ ] Integrate SR5 validation (Sum-to-Ten, Karma already exist)
- [ ] Add SR5-specific business rules (qualities limits, attribute caps, etc.)
- [ ] Implement SR5 character creation workflow
- [ ] Update character update/retrieval to work with SR5
- [ ] Write service tests for SR5 workflows

**Deliverables**: Service layer supports SR5 character lifecycle

---

### Phase 5: API & Frontend Integration
**Goal**: Wire SR5 model into API and React UI

- [ ] Update API handlers to work with `CharacterSR5`
- [ ] Update React wizard to populate SR5 fields
- [ ] Add SR5-specific UI components (qualities selector, contact manager, etc.)
- [ ] Update character detail views for SR5
- [ ] Add SR5 validation feedback in UI
- [ ] Write API integration tests

**Deliverables**: End-to-end SR5 character creation working

---

### Phase 6: Advanced Features
**Goal**: Complete SR5-specific systems

- [ ] Implement qualities system (selection, validation, effects)
- [ ] Implement reputation tracking (Street Cred, Notoriety, Public Awareness)
- [ ] Implement lifestyle system with modifiers
- [ ] Implement technomancer support (Living Persona, Complex Forms)
- [ ] Implement augmentation tracking with Essence impact
- [ ] Add play state tracking (condition monitors, temporary modifiers)
- [ ] Write comprehensive tests

**Deliverables**: Full SR5 character system operational

---

## 5. Migration Strategy

### 5.1 Existing SR5 Characters
- Characters with `Edition="sr5"` but using `CharacterSR3` structure need migration
- Create migration script to convert SR3 structure to SR5 where possible
- Map attributes: `Quickness` → `Agility`, `Intelligence` → `Logic`, add `Intuition`, `Reaction`
- Map contacts: `Level` → `Connection` (1:1 mapping)
- Set default values for new fields (Edge=1 for humans, etc.)

### 5.2 Backward Compatibility
- Keep `CharacterSR3` for existing SR3 characters
- Type switch on `Edition` field to determine which struct to use
- API endpoints handle both SR3 and SR5 transparently

---

## 6. Validation Rules

### 6.1 Attribute Validation
- Enforce metatype attribute limits (from data tables)
- Ensure only one attribute at natural maximum during creation
- Validate special attributes (Edge max 7 for humans, 6 otherwise)
- Validate Magic/Resonance based on metatype and priority

### 6.2 Qualities Validation
- Max 25 Karma in positive qualities at creation
- Max 25 Karma from negative qualities at creation
- Enforce prerequisites (metatype, Magic rating, etc.)
- Enforce incompatibilities (Lucky vs Exceptional Attribute (Edge))

### 6.3 Skills Validation
- Max rating 6 at creation (7 with Aptitude quality)
- Enforce skill group integrity
- Validate restricted skills (Magic/Resonance requirements)
- Validate Knowledge/Language skill categories

### 6.4 Resources Validation
- Enforce Availability 12 limit at creation
- Enforce Device Rating 6 limit at creation
- Validate augmentation attribute caps (+4 over natural)
- Enforce 5,000¥ carryover limit

---

## 7. Testing Strategy

### 7.1 Unit Tests
- Domain model validation
- Derived stats calculations
- Validation rule enforcement
- Type conversions

### 7.2 Integration Tests
- Character creation workflows (Priority, Sum-to-Ten, Karma)
- Repository persistence
- Service layer business logic
- API endpoint responses

### 7.3 Test Data
- Create fixture characters for each creation method
- Create fixture characters for each metatype
- Create fixture characters for each magic user type
- Create edge case fixtures (max attributes, all qualities, etc.)

---

## 8. Documentation Updates

- [ ] Update `docs/rules/5e/character.md` with implementation details
- [ ] Add SR5 character model reference to architecture docs
- [ ] Update API documentation with SR5 endpoints
- [ ] Create migration guide for existing characters
- [ ] Update developer guide with SR5 patterns

---

## 9. Dependencies & Prerequisites

- ✅ SR5 character creation documentation exists
- ✅ SR5 validation services (Sum-to-Ten, Karma) exist
- ✅ Campaign support for SR5 edition
- ⚙️ React wizard partially supports SR5 (needs completion)
- ❌ Qualities data catalog (needs to be created/imported)
- ❌ Full SR5 gear/spell catalogs (partial, needs completion)

---

## 10. Success Criteria

- [ ] `CharacterSR5` struct complete and tested
- [ ] All SR5 derived stats calculate correctly
- [ ] Character creation (Priority, Sum-to-Ten, Karma) works end-to-end
- [ ] Repository persists and retrieves SR5 characters correctly
- [ ] API endpoints handle SR5 characters
- [ ] React UI supports SR5 character creation
- [ ] Migration path exists for existing characters
- [ ] Documentation updated

---

## 11. Open Questions

1. **Living Persona**: Should Living Persona be calculated on-the-fly or stored? (Decision: Store for quick access, recalculate on attribute changes)

2. **Augmented Attributes**: Should we store natural and augmented separately, or calculate augmented on-the-fly? (Decision: Store both for clarity and performance)

3. **Temporary Modifiers**: Should play state be in the character model or separate session state? (Decision: Include in character model for persistence, but consider session-only for live play)

4. **Qualities Effects**: How to model quality effects programmatically? (Decision: Store quality selections, effects calculated in service layer)

5. **Migration Granularity**: Migrate all characters at once or on-demand? (Decision: On-demand migration when character is accessed)

---

## 12. Related Plans

- **NPC Library Plan** (`docs/development/plans/npc-library-plan.md`) - Depends on SR5 character model
- **Character Creation Wizard** - Needs SR5 model for completion
- **Session/Scene Integration** - Needs SR5 characters for initiative/combat

---

**Document Owner**: Engineering Team  
**Status**: Draft - Ready for Review  
**Priority**: High (blocks NPC library and SR5 character creation completion)
