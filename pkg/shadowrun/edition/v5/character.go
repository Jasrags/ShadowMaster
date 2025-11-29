package v5

import (
	"fmt"
	"shadowmaster/internal/domain"
)

// applyPriorityMethod applies the Priority creation method
func (h *SR5Handler) applyPriorityMethod(char *domain.CharacterSR5, data map[string]interface{}) error {
	// Extract priority selections
	selection := PrioritySelection{
		Metatype:      getStringFromMap(data, "metatype_priority", ""),
		Attributes:    getStringFromMap(data, "attributes_priority", ""),
		Magic:         getStringFromMap(data, "magic_priority", ""),
		Skills:        getStringFromMap(data, "skills_priority", ""),
		Resources:     getStringFromMap(data, "resources_priority", ""),
		GameplayLevel: getStringFromMap(data, "gameplay_level", "experienced"),
	}

	if err := ValidatePrioritySelection(selection); err != nil {
		return err
	}

	// Store selected metatype and magic type from data if provided
	selectedMetatype := getStringFromMap(data, "selected_metatype", "")
	selectedMagicType := getStringFromMap(data, "magic_type", "")

	// Apply priority selection with selected metatype/magic type
	return h.applyPrioritySelectionWithSelections(char, selection, selectedMetatype, selectedMagicType)
}

// applyPrioritySelectionWithSelections applies priority selection with specific metatype and magic type
func (h *SR5Handler) applyPrioritySelectionWithSelections(char *domain.CharacterSR5, selection PrioritySelection, selectedMetatype string, selectedMagicType string) error {
	char.MetatypePriority = selection.Metatype
	char.AttributesPriority = selection.Attributes
	char.MagicPriority = selection.Magic
	char.SkillsPriority = selection.Skills
	char.ResourcesPriority = selection.Resources
	char.GameplayLevel = selection.GameplayLevel

	// Step 2: Metatype & Special Attributes
	// Use selected metatype if provided, otherwise use defaults based on priority
	metatypeName := selectedMetatype
	if metatypeName == "" {
		switch selection.Metatype {
		case "A", "B":
			metatypeName = "Human" // Default for A/B
		case "C":
			metatypeName = "Elf" // Default for C
		case "D":
			metatypeName = "Human" // Default for D
		case "E":
			metatypeName = "Human" // Only Human for E
		}
	}

	if err := h.applyMetatype(char, selection.Metatype, metatypeName); err != nil {
		return fmt.Errorf("failed to apply metatype: %w", err)
	}

	// Step 2: Apply attribute points
	if err := h.applyAttributePoints(char, selection.Attributes); err != nil {
		return fmt.Errorf("failed to apply attribute points: %w", err)
	}

	// Step 3: Magic or Resonance
	if selection.Magic != "none" && selection.Magic != "" {
		if err := h.applyMagicResonance(char, selection.Magic, selectedMagicType); err != nil {
			return fmt.Errorf("failed to apply magic/resonance: %w", err)
		}
	}

	// Step 4: Qualities (handled separately, but initialize karma)
	char.Karma = GetStartingKarmaForGameplayLevel(selection.GameplayLevel)

	// Step 5: Skills
	if err := h.applySkills(char, selection.Skills); err != nil {
		return fmt.Errorf("failed to apply skills: %w", err)
	}

	// Step 6: Resources
	char.Nuyen = GetResourcesForGameplayLevel(selection.Resources, selection.GameplayLevel)

	// Step 7: Karma spending (handled separately)

	return nil
}

// applyPrioritySelection applies priority-based character creation
func (h *SR5Handler) applyPrioritySelection(char *domain.CharacterSR5, selection PrioritySelection) error {
	return h.applyPrioritySelectionWithSelections(char, selection, "", "")
}

// applyMetatype applies metatype selection and special attribute points
func (h *SR5Handler) applyMetatype(char *domain.CharacterSR5, priority string, metatypeName string) error {
	table := GetPriorityTable()
	metatypePriority, ok := table.Metatype[priority]
	if !ok {
		return fmt.Errorf("invalid metatype priority: %s", priority)
	}

	specialPoints, ok := metatypePriority.Options[metatypeName]
	if !ok {
		return fmt.Errorf("metatype %s not available at priority %s", metatypeName, priority)
	}

	char.Metatype = metatypeName
	char.SpecialAttributePoints = specialPoints

	// Apply base attributes from metatype (minimum values)
	if err := h.setBaseAttributes(char, metatypeName); err != nil {
		return err
	}

	// Apply racial abilities
	h.applyRacialAbilities(char, metatypeName)

	return nil
}

// setBaseAttributes sets base attributes to metatype minimums
func (h *SR5Handler) setBaseAttributes(char *domain.CharacterSR5, metatypeName string) error {
	// Get metatype definition
	metatype := GetMetatypeByName(metatypeName)
	if metatype == nil {
		// Fallback to defaults if metatype not found in data
		char.Body = 1
		char.Agility = 1
		char.Reaction = 1
		char.Strength = 1
		char.Willpower = 1
		char.Logic = 1
		char.Intuition = 1
		char.Charisma = 1
		char.Edge = 1
		return nil
	}

	char.Body = metatype.Body.Min
	char.Agility = metatype.Agility.Min
	char.Reaction = metatype.Reaction.Min
	char.Strength = metatype.Strength.Min
	char.Willpower = metatype.Willpower.Min
	char.Logic = metatype.Logic.Min
	char.Intuition = metatype.Intuition.Min
	char.Charisma = metatype.Charisma.Min
	if metatype.Edge != nil {
		char.Edge = metatype.Edge.Min
	} else {
		char.Edge = 1
	}

	return nil
}

// applyRacialAbilities applies racial special abilities
func (h *SR5Handler) applyRacialAbilities(char *domain.CharacterSR5, metatypeName string) {
	char.RacialAbilities = []domain.RacialAbility{}

	metatype := GetMetatypeByName(metatypeName)
	if metatype == nil {
		return
	}

	for _, trait := range metatype.RacialTraits {
		char.RacialAbilities = append(char.RacialAbilities, domain.RacialAbility{
			Name:        trait.Name,
			Description: trait.Description,
		})
	}

	// Apply Troll dermal armor
	if metatypeName == "Troll" {
		char.Cyberware = append(char.Cyberware, domain.Cyberware{
			Name:        "Dermal Armor (Racial)",
			Rating:      1,
			EssenceCost: 0.0,
			Cost:        0,
			Racial:      true,
			Notes:       "Inherent Troll racial trait - +1 Body",
		})
	}
}

// applyAttributePoints applies attribute points from priority
func (h *SR5Handler) applyAttributePoints(_ *domain.CharacterSR5, priority string) error {
	table := GetPriorityTable()
	attrPoints, ok := table.Attributes[priority]
	if !ok {
		return fmt.Errorf("invalid attributes priority: %s", priority)
	}

	// Attribute points are allocated by the player, but we track the available points
	// The actual allocation happens in the UI/API layer
	// For now, we just validate that points are available
	_ = attrPoints // Will be used for validation

	return nil
}

// applyMagicResonance applies magic or resonance benefits from priority
func (h *SR5Handler) applyMagicResonance(char *domain.CharacterSR5, priority string, magicType string) error {
	table := GetPriorityTable()
	magicPriority, ok := table.Magic[priority]
	if !ok {
		return fmt.Errorf("invalid magic priority: %s", priority)
	}

	// Determine magic type if not specified
	if magicType == "" {
		// Default based on priority
		switch priority {
		case "A", "B":
			magicType = "Magician" // Default to Magician for high priorities
		case "D":
			magicType = "Adept" // Default to Adept for low priority
		default:
			magicType = "Magician"
		}
	}

	char.MagicType = magicType

	switch magicType {
	case "Magician", "Mystic Adept":
		char.Magic = magicPriority.MagicRating
		// Free spells are assigned later
	case "Adept":
		char.Magic = magicPriority.MagicRating
		char.PowerPoints = float64(magicPriority.MagicRating) // Adepts get free power points equal to Magic
	case "Aspected Magician":
		char.Magic = magicPriority.MagicRating
	case "Technomancer":
		char.Resonance = magicPriority.MagicRating
		char.ResonanceType = "Technomancer"
	}

	return nil
}

// applySkills applies skill points from priority
func (h *SR5Handler) applySkills(char *domain.CharacterSR5, priority string) error {
	table := GetPriorityTable()
	skillPriority, ok := table.Skills[priority]
	if !ok {
		return fmt.Errorf("invalid skills priority: %s", priority)
	}

	// Skill points are allocated by the player
	// We track available points for validation
	_ = skillPriority // Will be used for validation

	// Apply free knowledge skill points: (Intuition + Logic) × 2
	knowledgePoints := (char.Intuition + char.Logic) * 2
	_ = knowledgePoints // Will be used when allocating knowledge skills

	// Apply free native language (rating 6)
	if len(char.LanguageSkills) == 0 {
		char.LanguageSkills["English"] = domain.Skill{
			Name:   "English",
			Rating: 6,
		}
	}

	return nil
}

// Helper function to extract string from map
func getStringFromMap(m interface{}, key string, defaultValue string) string {
	dataMap, ok := m.(map[string]interface{})
	if !ok {
		return defaultValue
	}

	if val, ok := dataMap[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
	}
	return defaultValue
}
