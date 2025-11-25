package v5

// SpellCategory represents the category of spell
type SpellCategory string

const (
	SpellCategoryCombat       SpellCategory = "combat"
	SpellCategoryDetection    SpellCategory = "detection"
	SpellCategoryHealth       SpellCategory = "health"
	SpellCategoryIllusion     SpellCategory = "illusion"
	SpellCategoryManipulation SpellCategory = "manipulation"
)

// SpellType represents whether a spell is Physical or Mana
type SpellType string

const (
	SpellTypePhysical SpellType = "physical"
	SpellTypeMana     SpellType = "mana"
)

// SpellRange represents the range of a spell
type SpellRange string

const (
	SpellRangeLineOfSight     SpellRange = "LOS"    // Line of Sight
	SpellRangeTouch          SpellRange = "T"      // Touch
	SpellRangeLineOfSightArea SpellRange = "LOS(A)" // Line of Sight (Area)
)

// SpellDamageType represents the type of damage a spell inflicts
type SpellDamageType string

const (
	SpellDamageTypePhysical SpellDamageType = "physical"
	SpellDamageTypeStun     SpellDamageType = "stun"
)

// DurationType represents how long a spell's effect lasts
type DurationType string

const (
	DurationTypeInstantaneous DurationType = "instantaneous" // I
	DurationTypeSustained     DurationType = "sustained"     // S
	DurationTypePermanent     DurationType = "permanent"     // P
)

// DrainFormula represents how drain is calculated
type DrainFormula struct {
	// BaseModifier is the modifier to Force (e.g., -3, -1, 0, +1)
	// For formulas like F-3, this would be -3
	// For formulas like F, this would be 0
	// For formulas like F+1, this would be +1
	BaseModifier int `json:"base_modifier,omitempty"`
	// Formula describes the drain formula as text (e.g., "F-3", "F-1", "F", "F+1")
	Formula string `json:"formula,omitempty"`
	// MinimumDrain is the minimum drain value (always at least 2)
	MinimumDrain int `json:"minimum_drain,omitempty"`
}

// SpellEffect represents spell effects/keywords
type SpellEffect struct {
	// Keywords lists the effect keywords (e.g., ["Indirect", "Elemental"], ["Active", "Directional"])
	Keywords []string `json:"keywords,omitempty"`
	// Description describes the effects
	Description string `json:"description,omitempty"`
}

// Spell represents a spell definition
type Spell struct {
	// Name is the spell name (e.g., "Acid Stream", "Analyze Device", "Heal")
	Name string `json:"name,omitempty"`
	// Category indicates the spell category
	Category SpellCategory `json:"category,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// Effects describes the spell effects/keywords
	Effects SpellEffect `json:"effects,omitempty"`
	// Type indicates whether the spell is Physical (P) or Mana (M)
	Type SpellType `json:"type,omitempty"`
	// Range indicates the spell range
	Range SpellRange `json:"range,omitempty"`
	// IsArea indicates if the spell affects an area (for LOS(A) spells)
	IsArea bool `json:"is_area,omitempty"`
	// Damage indicates the damage type (Physical or Stun) if the spell inflicts damage
	Damage *SpellDamageType `json:"damage,omitempty"`
	// Duration indicates how long the spell's effect lasts
	Duration DurationType `json:"duration,omitempty"`
	// Drain describes the drain formula
	Drain DrainFormula `json:"drain,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// SpellData represents the complete spell data structure organized by category
type SpellData struct {
	Combat       []Spell `json:"combat,omitempty"`
	Detection    []Spell `json:"detection,omitempty"`
	Health       []Spell `json:"health,omitempty"`
	Illusion     []Spell `json:"illusion,omitempty"`
	Manipulation []Spell `json:"manipulation,omitempty"`
}

// dataSpells contains all spell definitions
// This is populated in spells_data.go

// GetAllSpells returns all spells
func GetAllSpells() []Spell {
	spells := make([]Spell, 0, len(dataSpells))
	for _, s := range dataSpells {
		spells = append(spells, s)
	}
	return spells
}

// GetSpellData returns the complete spell data structure organized by category
func GetSpellData() SpellData {
	data := SpellData{
		Combat:       []Spell{},
		Detection:    []Spell{},
		Health:       []Spell{},
		Illusion:     []Spell{},
		Manipulation: []Spell{},
	}

	for _, spell := range dataSpells {
		switch spell.Category {
		case SpellCategoryCombat:
			data.Combat = append(data.Combat, spell)
		case SpellCategoryDetection:
			data.Detection = append(data.Detection, spell)
		case SpellCategoryHealth:
			data.Health = append(data.Health, spell)
		case SpellCategoryIllusion:
			data.Illusion = append(data.Illusion, spell)
		case SpellCategoryManipulation:
			data.Manipulation = append(data.Manipulation, spell)
		}
	}

	return data
}

// GetSpellByName returns the spell definition with the given name, or nil if not found
func GetSpellByName(name string) *Spell {
	for _, spell := range dataSpells {
		if spell.Name == name {
			return &spell
		}
	}
	return nil
}

// GetSpellByKey returns the spell definition with the given key, or nil if not found
func GetSpellByKey(key string) *Spell {
	spell, ok := dataSpells[key]
	if !ok {
		return nil
	}
	return &spell
}

// GetSpellsByCategory returns all spells in the specified category
func GetSpellsByCategory(category SpellCategory) []Spell {
	spells := make([]Spell, 0)
	for _, s := range dataSpells {
		if s.Category == category {
			spells = append(spells, s)
		}
	}
	return spells
}

// GetSpellsByType returns all spells of the specified type (Physical or Mana)
func GetSpellsByType(spellType SpellType) []Spell {
	spells := make([]Spell, 0)
	for _, s := range dataSpells {
		if s.Type == spellType {
			spells = append(spells, s)
		}
	}
	return spells
}

