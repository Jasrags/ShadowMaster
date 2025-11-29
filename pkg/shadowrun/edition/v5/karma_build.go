package v5

import (
	"fmt"
	"shadowmaster/internal/domain"
)

const (
	KarmaBudget = 800
	KarmaPerNuyen = 2000 // 1 karma = 2,000 nuyen
	MaxKarmaForGear = 200
	MaxStartingNuyen = 5000
)

var (
	MetatypeCosts = map[string]int{
		"Human": 0,
		"Dwarf": 50,
		"Elf":   40,
		"Ork":   50,
		"Troll": 90,
	}

	MagicQualityCosts = map[string]int{
		"Adept":            20,
		"Aspected Magician": 15,
		"Magician":         30,
		"Mystic Adept":     35,
		"Technomancer":     15,
	}
)

// applyKarmaMethod applies the Karma Point-Buy creation method
func (h *SR5Handler) applyKarmaMethod(char *domain.CharacterSR5, data map[string]interface{}) error {
	selection := KarmaSelection{
		Metatype:      getStringFromMap(data, "metatype", ""),
		MagicType:     getStringFromMap(data, "magic_type", ""),
		Tradition:     getStringFromMap(data, "tradition", ""),
		GameplayLevel: getStringFromMap(data, "gameplay_level", "experienced"),
	}

	// Extract attributes
	if attrs, ok := data["attributes"].(map[string]interface{}); ok {
		selection.Attributes = make(map[string]int)
		for k, v := range attrs {
			if val, ok := v.(float64); ok {
				selection.Attributes[k] = int(val)
			} else if val, ok := v.(int); ok {
				selection.Attributes[k] = val
			}
		}
	}

	// Extract skills
	if skills, ok := data["skills"].(map[string]interface{}); ok {
		selection.Skills = make(map[string]int)
		for k, v := range skills {
			if val, ok := v.(float64); ok {
				selection.Skills[k] = int(val)
			} else if val, ok := v.(int); ok {
				selection.Skills[k] = val
			}
		}
	}

	if err := ValidateKarmaSelection(selection); err != nil {
		return err
	}

	return h.applyKarmaSelection(char, selection)
}

// applyKarmaSelection applies Karma Point-Buy character creation
func (h *SR5Handler) applyKarmaSelection(char *domain.CharacterSR5, selection KarmaSelection) error {
	char.CreationMethod = "karma"
	char.GameplayLevel = selection.GameplayLevel

	// Start with 800 karma
	remainingKarma := KarmaBudget

	// Purchase metatype
	metatypeCost, ok := MetatypeCosts[selection.Metatype]
	if !ok {
		return fmt.Errorf("unknown metatype: %s", selection.Metatype)
	}
	remainingKarma -= metatypeCost
	char.Metatype = selection.Metatype

	// Set base attributes to metatype minimums
	if err := h.setBaseAttributes(char, selection.Metatype); err != nil {
		return err
	}

	// Purchase attribute increases
	for attrName, targetValue := range selection.Attributes {
		currentValue := h.getAttributeValue(char, attrName)
		if targetValue > currentValue {
			cost := h.calculateAttributeCost(currentValue, targetValue)
			remainingKarma -= cost
			h.setAttributeValue(char, attrName, targetValue)
		}
	}

	// Purchase magic quality if specified
	if selection.MagicType != "" {
		magicCost, ok := MagicQualityCosts[selection.MagicType]
		if !ok {
			return fmt.Errorf("unknown magic type: %s", selection.MagicType)
		}
		remainingKarma -= magicCost
		char.MagicType = selection.MagicType
		char.Tradition = selection.Tradition

		// Set initial magic/resonance rating
		switch selection.MagicType {
		case "Adept":
			char.Magic = 1 // Start at 1, can be increased with karma
			char.PowerPoints = 1.0 // Adepts get power points equal to Magic
		case "Magician", "Aspected Magician", "Mystic Adept":
			char.Magic = 1
		case "Technomancer":
			char.Resonance = 1
			char.ResonanceType = "Technomancer"
		}
	}

	// Purchase skills
	for skillName, rating := range selection.Skills {
		if rating > 0 {
			cost := h.calculateSkillCost(skillName, rating)
			remainingKarma -= cost
			char.ActiveSkills[skillName] = domain.Skill{
				Name:   skillName,
				Rating: rating,
			}
		}
	}

	// Apply qualities (costs handled separately)
	// Apply equipment (karma→nuyen conversion handled separately)

	// Set remaining karma
	char.Karma = remainingKarma
	if char.Karma < 0 {
		return fmt.Errorf("karma budget exceeded by %d", -char.Karma)
	}

	// Apply racial abilities
	h.applyRacialAbilities(char, selection.Metatype)

	return nil
}

// ValidateKarmaSelection validates karma selection
func ValidateKarmaSelection(selection KarmaSelection) error {
	if selection.Metatype == "" {
		return fmt.Errorf("metatype must be specified")
	}

	_, ok := MetatypeCosts[selection.Metatype]
	if !ok {
		return fmt.Errorf("unknown metatype: %s", selection.Metatype)
	}

	return nil
}

// calculateAttributeCost calculates karma cost to raise attribute from current to target
func (h *SR5Handler) calculateAttributeCost(current, target int) int {
	cost := 0
	for rating := current + 1; rating <= target; rating++ {
		cost += rating * 5 // New Rating × 5
	}
	return cost
}

// calculateSkillCost calculates karma cost for a skill
func (h *SR5Handler) calculateSkillCost(skillName string, rating int) int {
	// Active skills: New Rating × 2
	// Knowledge skills: New Rating × 1
	// For now, assume active skills (can be refined later)
	cost := 0
	for r := 1; r <= rating; r++ {
		cost += r * 2
	}
	return cost
}

// getAttributeValue gets the current value of an attribute
func (h *SR5Handler) getAttributeValue(char *domain.CharacterSR5, attrName string) int {
	switch attrName {
	case "body":
		return char.Body
	case "agility":
		return char.Agility
	case "reaction":
		return char.Reaction
	case "strength":
		return char.Strength
	case "willpower":
		return char.Willpower
	case "logic":
		return char.Logic
	case "intuition":
		return char.Intuition
	case "charisma":
		return char.Charisma
	case "edge":
		return char.Edge
	case "magic":
		return char.Magic
	case "resonance":
		return char.Resonance
	default:
		return 0
	}
}

// setAttributeValue sets the value of an attribute
func (h *SR5Handler) setAttributeValue(char *domain.CharacterSR5, attrName string, value int) {
	switch attrName {
	case "body":
		char.Body = value
	case "agility":
		char.Agility = value
	case "reaction":
		char.Reaction = value
	case "strength":
		char.Strength = value
	case "willpower":
		char.Willpower = value
	case "logic":
		char.Logic = value
	case "intuition":
		char.Intuition = value
	case "charisma":
		char.Charisma = value
	case "edge":
		char.Edge = value
	case "magic":
		char.Magic = value
	case "resonance":
		char.Resonance = value
	}
}

