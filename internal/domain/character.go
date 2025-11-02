package domain

import (
	"time"
)

// Character represents a player character or NPC
type Character struct {
	ID          string      `json:"id"`
	Name        string      `json:"name"`
	PlayerName  string      `json:"player_name,omitempty"`
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
	Spells     []Spell     `json:"spells"`
	Focuses    []Focus     `json:"focuses"`
	Spirits    []Spirit    `json:"spirits"`
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
	Cost         int     `json:"cost,omitempty"`        // Cost in nuyen
	Availability int     `json:"availability,omitempty"`
	Racial       bool    `json:"racial,omitempty"`      // True if this is inherent racial cyberware (e.g., Troll Dermal Armor)
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
	Level   int    `json:"level"`  // 1-3 (Level 1: Contact, Level 2: Buddy, Level 3: Friend for life)
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
	Name        string `json:"name"`        // Thermographic Vision, Low-light Vision, Resistance, Reach
	Description string `json:"description,omitempty"` // Description of the ability
	Effect      string `json:"effect,omitempty"`     // Mechanical effect (e.g., "+2 Body vs disease/toxin")
}

// AdeptPower represents an adept power purchased with Power Points
type AdeptPower struct {
	Name        string  `json:"name"`        // Astral Perception, Attribute Boost, etc.
	Rating      int     `json:"rating,omitempty"` // For powers with levels
	PowerPoints float64 `json:"power_points"`     // Power Points spent on this power
	Attribute   string  `json:"attribute,omitempty"` // For powers that specify an attribute (e.g., Attribute Boost)
	Notes       string  `json:"notes,omitempty"`
}
