package v5

// Tradition represents a magical tradition definition
type Tradition struct {
	// Name is the tradition name (e.g., "The Hermetic Mage", "The Shaman")
	Name string `json:"name,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// CombatElement is the element/spirit associated with Combat spells
	CombatElement string `json:"combat_element,omitempty"`
	// DetectionElement is the element/spirit associated with Detection spells
	DetectionElement string `json:"detection_element,omitempty"`
	// HealthElement is the element/spirit associated with Health spells
	HealthElement string `json:"health_element,omitempty"`
	// IllusionElement is the element/spirit associated with Illusion spells
	IllusionElement string `json:"illusion_element,omitempty"`
	// ManipulationElement is the element/spirit associated with Manipulation spells
	ManipulationElement string `json:"manipulation_element,omitempty"`
	// DrainFormula describes the drain attribute formula (e.g., "Logic + Willpower", "Charisma + Willpower")
	DrainFormula string `json:"drain_formula,omitempty"`
	// DrainAttributes lists the attributes used for drain resistance
	DrainAttributes []string `json:"drain_attributes,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// dataTraditions contains all tradition definitions
// This is populated in traditions_data.go

// GetAllTraditions returns all magical traditions
func GetAllTraditions() []Tradition {
	traditions := make([]Tradition, 0, len(dataTraditions))
	for _, t := range dataTraditions {
		traditions = append(traditions, t)
	}
	return traditions
}

// GetTraditionByName returns the tradition definition with the given name, or nil if not found
func GetTraditionByName(name string) *Tradition {
	for _, tradition := range dataTraditions {
		if tradition.Name == name {
			return &tradition
		}
	}
	return nil
}

// GetTraditionByKey returns the tradition definition with the given key, or nil if not found
func GetTraditionByKey(key string) *Tradition {
	tradition, ok := dataTraditions[key]
	if !ok {
		return nil
	}
	return &tradition
}

// GetElementForCategory returns the element/spirit associated with a spell category for a given tradition
func (t *Tradition) GetElementForCategory(category SpellCategory) string {
	switch category {
	case SpellCategoryCombat:
		return t.CombatElement
	case SpellCategoryDetection:
		return t.DetectionElement
	case SpellCategoryHealth:
		return t.HealthElement
	case SpellCategoryIllusion:
		return t.IllusionElement
	case SpellCategoryManipulation:
		return t.ManipulationElement
	default:
		return ""
	}
}

