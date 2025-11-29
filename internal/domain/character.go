package domain

import (
	"fmt"
	"time"
)

// Character represents a player character or NPC
type Character struct {
	ID          string      `json:"id"`
	Name        string      `json:"name"`
	PlayerName  string      `json:"player_name,omitempty"`
	UserID      string      `json:"user_id,omitempty"`
	CampaignID  string      `json:"campaign_id,omitempty"`
	IsNPC       bool        `json:"is_npc"`
	Status      string      `json:"status,omitempty"`
	Edition     string      `json:"edition"`      // "sr3", "sr4", etc.
	EditionData interface{} `json:"edition_data"` // Edition-specific character data
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

// CharacterSR3 represents Shadowrun 3rd edition specific character data
type CharacterSR3 struct {
	// Attributes
	Body         int `json:"body"`
	Quickness    int `json:"quickness"`
	Strength     int `json:"strength"`
	Charisma     int `json:"charisma"`
	Intelligence int `json:"intelligence"`
	Willpower    int `json:"willpower"`

	// Derived attributes
	Reaction int `json:"reaction"` // Quickness + Intelligence

	// Priority system
	MagicPriority     string `json:"magic_priority"`     // A-E (A/B: Magical, C/D/E: Mundane)
	MetatypePriority  string `json:"metatype_priority"`  // A-E
	AttrPriority      string `json:"attr_priority"`      // A-E
	SkillsPriority    string `json:"skills_priority"`    // A-E
	ResourcesPriority string `json:"resources_priority"` // A-E

	// Metatype
	Metatype string  `json:"metatype"` // Human, Elf, Dwarf, Ork, Troll
	Essence  float64 `json:"essence"`  // Starting at 6.0, reduced by cyberware

	// Racial Special Abilities
	RacialAbilities []RacialAbility `json:"racial_abilities,omitempty"` // Vision, resistance, reach, etc.

	// Magic
	MagicRating int    `json:"magic_rating,omitempty"`
	Tradition   string `json:"tradition,omitempty"`  // Hermetic, Shaman, etc.
	Initiation  int    `json:"initiation,omitempty"` // Initiation grade

	// Skills
	ActiveSkills    map[string]Skill `json:"active_skills"`
	KnowledgeSkills map[string]Skill `json:"knowledge_skills"`
	LanguageSkills  map[string]Skill `json:"language_skills"`

	// Equipment
	Weapons   []Weapon    `json:"weapons"`
	Armor     []Armor     `json:"armor"`
	Cyberware []Cyberware `json:"cyberware"`
	Bioware   []Bioware   `json:"bioware"`
	Gear      []Item      `json:"gear"`
	Vehicles  []Vehicle   `json:"vehicles"`

	// Magic
	Spells      []Spell      `json:"spells"`
	Focuses     []Focus      `json:"focuses"`
	Spirits     []Spirit     `json:"spirits"`
	AdeptPowers []AdeptPower `json:"adept_powers,omitempty"` // For Adepts only

	// Social
	Contacts   []Contact  `json:"contacts"`
	Reputation Reputation `json:"reputation"`
	Lifestyle  string     `json:"lifestyle"` // Street, Squatter, Low, Middle, High, Luxury

	// Advancement
	Karma      int `json:"karma"`
	TotalKarma int `json:"total_karma"`

	// Resources
	Nuyen int `json:"nuyen"`

	// Notes
	Notes string `json:"notes,omitempty"`
}

// CharacterSR5 represents Shadowrun 5th edition specific character data
type CharacterSR5 struct {
	// Physical Attributes
	Body     int `json:"body"`
	Agility  int `json:"agility"`
	Reaction int `json:"reaction"`
	Strength int `json:"strength"`

	// Mental Attributes
	Willpower int `json:"willpower"`
	Logic     int `json:"logic"`
	Intuition int `json:"intuition"`
	Charisma  int `json:"charisma"`

	// Special Attributes
	Edge      int `json:"edge"`
	Magic     int `json:"magic,omitempty"`     // Mutually exclusive with Resonance
	Resonance int `json:"resonance,omitempty"` // Mutually exclusive with Magic

	// Priority System
	MetatypePriority    string `json:"metatype_priority"`    // A-E
	AttributesPriority  string `json:"attributes_priority"`  // A-E
	MagicPriority       string `json:"magic_priority"`       // A-E (or "none" for mundane)
	SkillsPriority      string `json:"skills_priority"`      // A-E
	ResourcesPriority   string `json:"resources_priority"`  // A-E
	CreationMethod      string `json:"creation_method"`      // "priority", "sum_to_ten", "karma"
	GameplayLevel       string `json:"gameplay_level"`      // "experienced", "street", "prime"

	// Metatype
	Metatype              string `json:"metatype"`              // Human, Elf, Dwarf, Ork, Troll
	SpecialAttributePoints int    `json:"special_attribute_points"` // Points available for Edge/Magic/Resonance

	// Racial Abilities
	RacialAbilities []RacialAbility `json:"racial_abilities,omitempty"`

	// Magic/Resonance Details
	MagicType      string  `json:"magic_type,omitempty"`      // "Magician", "Adept", "Aspected Magician", "Mystic Adept"
	Tradition      string  `json:"tradition,omitempty"`        // Hermetic, Shaman, etc.
	Initiation     int     `json:"initiation,omitempty"`       // Initiation grade
	PowerPoints    float64 `json:"power_points,omitempty"`     // For Adepts and Mystic Adepts
	ResonanceType  string  `json:"resonance_type,omitempty"`  // For Technomancers

	// Skills
	ActiveSkills    map[string]Skill `json:"active_skills"`
	KnowledgeSkills map[string]Skill  `json:"knowledge_skills"`
	LanguageSkills  map[string]Skill  `json:"language_skills"`

	// Qualities
	PositiveQualities []Quality `json:"positive_qualities,omitempty"`
	NegativeQualities []Quality `json:"negative_qualities,omitempty"`

	// Equipment
	Weapons   []Weapon    `json:"weapons"`
	Armor     []Armor     `json:"armor"`
	Cyberware []Cyberware `json:"cyberware"`
	Bioware   []Bioware   `json:"bioware"`
	Gear      []Item      `json:"gear"`
	Vehicles  []Vehicle   `json:"vehicles"`

	// Magic/Resonance Items
	Spells       []Spell       `json:"spells"`
	ComplexForms []ComplexForm `json:"complex_forms,omitempty"` // For Technomancers
	Focuses      []Focus       `json:"focuses"`
	Spirits      []Spirit       `json:"spirits"`
	AdeptPowers  []AdeptPower  `json:"adept_powers,omitempty"` // For Adepts and Mystic Adepts

	// Social
	Contacts   []Contact  `json:"contacts"`
	Reputation Reputation `json:"reputation"`
	Lifestyle  string     `json:"lifestyle"` // Street, Squatter, Low, Middle, High, Luxury

	// Resources
	Karma      int     `json:"karma"`      // Remaining karma
	TotalKarma int     `json:"total_karma"` // Total karma spent
	Nuyen      int     `json:"nuyen"`      // Remaining nuyen
	Essence    float64 `json:"essence"`    // Starting at 6.0, reduced by cyberware

	// Derived Attributes
	Initiative      InitiativeData      `json:"initiative"`
	InherentLimits  InherentLimits      `json:"inherent_limits"`
	ConditionMonitor ConditionMonitor   `json:"condition_monitor"`
	LivingPersona   *LivingPersona     `json:"living_persona,omitempty"` // For Technomancers

	// Notes
	Notes string `json:"notes,omitempty"`
}

// Quality represents a positive or negative quality
type Quality struct {
	Name        string `json:"name"`
	Type        string `json:"type"`        // "positive" or "negative"
	KarmaCost   int    `json:"karma_cost"` // Positive: cost, Negative: bonus karma
	Description string `json:"description,omitempty"`
}

// ComplexForm represents a technomancer complex form
type ComplexForm struct {
	Name        string `json:"name"`
	Type        string `json:"type,omitempty"`
	FadeCode    string `json:"fade_code,omitempty"` // Fade code (e.g., "P-2")
	Description string `json:"description,omitempty"`
}

// InitiativeData represents all initiative calculations
type InitiativeData struct {
	Physical    InitiativeValue `json:"physical"`    // Intuition + Reaction + 1D6
	Astral      InitiativeValue `json:"astral"`      // Intuition × 2 + 2D6
	MatrixAR    InitiativeValue `json:"matrix_ar"`   // Intuition + Reaction + 1D6
	MatrixVRCold InitiativeValue `json:"matrix_vr_cold"` // Data Processing + Intuition + 3D6
	MatrixVRHot  InitiativeValue `json:"matrix_vr_hot"`  // Data Processing + Intuition + 4D6
}

// InitiativeValue represents a single initiative value
type InitiativeValue struct {
	Base      int `json:"base"`      // Base initiative (before dice)
	Augmented int `json:"augmented"` // Augmented initiative
	Dice      int `json:"dice"`      // Number of dice (e.g., 1D6, 2D6)
}

// InherentLimits represents the three inherent limits
type InherentLimits struct {
	Mental   int `json:"mental"`   // [(Logic × 2) + Intuition + Willpower] / 3
	Physical int `json:"physical"` // [(Strength × 2) + Body + Reaction] / 3
	Social   int `json:"social"`   // [(Charisma × 2) + Willpower + Essence] / 3
}

// ConditionMonitor represents physical and stun condition monitors
type ConditionMonitor struct {
	Physical int `json:"physical"` // [Body / 2] + 8
	Stun     int `json:"stun"`     // [Willpower / 2] + 8
	Overflow int `json:"overflow"` // Body + Augmentation bonuses
}

// LivingPersona represents technomancer Living Persona attributes
type LivingPersona struct {
	Attack        int `json:"attack"`        // Charisma
	DataProcessing int `json:"data_processing"` // Logic
	DeviceRating  int `json:"device_rating"` // Resonance
	Firewall      int `json:"firewall"`      // Willpower
	Sleaze        int `json:"sleaze"`        // Intuition
}

// Skill represents a character skill
type Skill struct {
	Name           string `json:"name"`
	Rating         int    `json:"rating"`
	Specialization string `json:"specialization,omitempty"`
	Group          string `json:"group,omitempty"` // Skill group name
}

// Weapon represents a weapon
type Weapon struct {
	Name           string `json:"name"`
	Type           string `json:"type"`   // Firearm, Melee, etc.
	Damage         string `json:"damage"` // Damage code (e.g., "8M" for 8 Medium)
	Accuracy       int    `json:"accuracy"`
	Concealability int    `json:"concealability"`
	Mode           string `json:"mode,omitempty"` // SS, SA, BF, FA
	Range          string `json:"range,omitempty"`
	Notes          string `json:"notes,omitempty"`
}

// Armor represents armor/clothing
type Armor struct {
	Name   string `json:"name"`
	Rating int    `json:"rating"` // Armor rating
	Type   string `json:"type"`   // Clothing, Armor Jacket, etc.
	Notes  string `json:"notes,omitempty"`
}

// Cyberware represents cybernetic enhancements
type Cyberware struct {
	Name         string  `json:"name"`
	Rating       int     `json:"rating,omitempty"`
	EssenceCost  float64 `json:"essence_cost"`
	Cost         int     `json:"cost,omitempty"` // Cost in nuyen
	Availability int     `json:"availability,omitempty"`
	Racial       bool    `json:"racial,omitempty"` // True if this is inherent racial cyberware (e.g., Troll Dermal Armor)
	Notes        string  `json:"notes,omitempty"`
}

// Bioware represents biological enhancements
type Bioware struct {
	Name         string `json:"name"`
	Rating       int    `json:"rating,omitempty"`
	Cost         int    `json:"cost"`
	Availability int    `json:"availability,omitempty"`
	Notes        string `json:"notes,omitempty"`
}

// Item represents generic equipment
type Item struct {
	Name  string `json:"name"`
	Type  string `json:"type"`
	Count int    `json:"count"`
	Notes string `json:"notes,omitempty"`
}

// Vehicle represents a vehicle
type Vehicle struct {
	Name          string   `json:"name"`
	Type          string   `json:"type"` // Car, Bike, Aircraft, etc.
	Handling      int      `json:"handling"`
	Speed         int      `json:"speed"`
	Acceleration  int      `json:"acceleration"`
	Body          int      `json:"body"`
	Armor         int      `json:"armor,omitempty"`
	Modifications []string `json:"modifications,omitempty"`
	Notes         string   `json:"notes,omitempty"`
}

// Spell represents a magical spell
type Spell struct {
	Name      string `json:"name"`
	Type      string `json:"type"`       // Combat, Detection, Health, Illusion, Manipulation
	DrainCode string `json:"drain_code"` // Physical/Stun and value (e.g., "P-2")
	Category  string `json:"category,omitempty"`
	Notes     string `json:"notes,omitempty"`
}

// Focus represents a magical focus
type Focus struct {
	Name   string `json:"name"`
	Type   string `json:"type"` // Spell, Power, Weapon, etc.
	Rating int    `json:"rating"`
	Notes  string `json:"notes,omitempty"`
}

// Spirit represents a summoned spirit
type Spirit struct {
	Type     string `json:"type"` // Fire, Earth, Air, Water, Man, etc.
	Force    int    `json:"force"`
	Services int    `json:"services"` // Services owed
	Notes    string `json:"notes,omitempty"`
}

// Contact represents a contact/NPC relationship
type Contact struct {
	Name    string `json:"name"`
	Type    string `json:"type"`    // Fixer, Dealer, etc.
	Level   int    `json:"level"`   // 1-3 (Level 1: Contact, Level 2: Buddy, Level 3: Friend for life)
	Loyalty int    `json:"loyalty"` // 1-3
	Notes   string `json:"notes,omitempty"`
}

// Reputation tracks character reputation
type Reputation struct {
	StreetCred      int `json:"street_cred"`
	Notoriety       int `json:"notoriety"`
	PublicAwareness int `json:"public_awareness"`
}

// RacialAbility represents a special ability granted by a metatype
type RacialAbility struct {
	Name        string `json:"name"`                  // Thermographic Vision, Low-light Vision, Resistance, Reach
	Description string `json:"description,omitempty"` // Description of the ability
	Effect      string `json:"effect,omitempty"`      // Mechanical effect (e.g., "+2 Body vs disease/toxin")
}

// AdeptPower represents an adept power purchased with Power Points
type AdeptPower struct {
	Name        string  `json:"name"`                // Astral Perception, Attribute Boost, etc.
	Rating      int     `json:"rating,omitempty"`    // For powers with levels
	PowerPoints float64 `json:"power_points"`        // Power Points spent on this power
	Attribute   string  `json:"attribute,omitempty"` // For powers that specify an attribute (e.g., Attribute Boost)
	Notes       string  `json:"notes,omitempty"`
}

// GetSR3Data returns the SR3-specific character data with type safety.
// Returns an error if the character is not SR3 or if the data type is invalid.
func (c *Character) GetSR3Data() (*CharacterSR3, error) {
	if c.Edition != "sr3" {
		return nil, fmt.Errorf("character is not SR3 edition (got: %s)", c.Edition)
	}
	
	if c.EditionData == nil {
		return nil, fmt.Errorf("character edition data is nil")
	}
	
	// Handle both pointer and value types
	switch data := c.EditionData.(type) {
	case *CharacterSR3:
		return data, nil
	case CharacterSR3:
		return &data, nil
	case map[string]interface{}:
		// For JSON unmarshaling cases where it comes as a map
		// This is a fallback - ideally we'd use proper JSON unmarshaling
		return nil, fmt.Errorf("edition data is a map, needs proper unmarshaling")
	default:
		return nil, fmt.Errorf("invalid SR3 data type: %T", c.EditionData)
	}
}

// SetSR3Data sets the SR3-specific character data and updates the edition field.
func (c *Character) SetSR3Data(data *CharacterSR3) {
	c.Edition = "sr3"
	c.EditionData = data
}

// GetSR5Data returns the SR5-specific character data with type safety.
// Returns an error if the character is not SR5 or if the data type is invalid.
func (c *Character) GetSR5Data() (*CharacterSR5, error) {
	if c.Edition != "sr5" {
		return nil, fmt.Errorf("character is not SR5 edition (got: %s)", c.Edition)
	}
	
	if c.EditionData == nil {
		return nil, fmt.Errorf("character edition data is nil")
	}
	
	// Handle both pointer and value types
	switch data := c.EditionData.(type) {
	case *CharacterSR5:
		return data, nil
	case CharacterSR5:
		return &data, nil
	case map[string]interface{}:
		// For JSON unmarshaling cases where it comes as a map
		// This is a fallback - ideally we'd use proper JSON unmarshaling
		return nil, fmt.Errorf("edition data is a map, needs proper unmarshaling")
	default:
		return nil, fmt.Errorf("invalid SR5 data type: %T", c.EditionData)
	}
}

// SetSR5Data sets the SR5-specific character data and updates the edition field.
func (c *Character) SetSR5Data(data *CharacterSR5) {
	c.Edition = "sr5"
	c.EditionData = data
}
