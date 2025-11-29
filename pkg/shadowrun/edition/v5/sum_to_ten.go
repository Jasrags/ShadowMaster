package v5

import (
	"fmt"
	"shadowmaster/internal/domain"
)

// applySumToTenMethod applies the Sum-to-Ten creation method
func (h *SR5Handler) applySumToTenMethod(char *domain.CharacterSR5, data map[string]interface{}) error {
	selection := SumToTenSelection{
		Metatype:      getStringFromMap(data, "metatype_priority", ""),
		Attributes:    getStringFromMap(data, "attributes_priority", ""),
		Magic:         getStringFromMap(data, "magic_priority", ""),
		Skills:        getStringFromMap(data, "skills_priority", ""),
		Resources:     getStringFromMap(data, "resources_priority", ""),
		GameplayLevel: getStringFromMap(data, "gameplay_level", "experienced"),
	}

	if err := ValidateSumToTenSelection(selection); err != nil {
		return err
	}

	return h.applySumToTenSelection(char, selection)
}

// applySumToTenSelection applies Sum-to-Ten character creation
func (h *SR5Handler) applySumToTenSelection(char *domain.CharacterSR5, selection SumToTenSelection) error {
	char.CreationMethod = "sum_to_ten"
	char.MetatypePriority = selection.Metatype
	char.AttributesPriority = selection.Attributes
	char.MagicPriority = selection.Magic
	char.SkillsPriority = selection.Skills
	char.ResourcesPriority = selection.Resources
	char.GameplayLevel = selection.GameplayLevel

	// Sum-to-Ten uses the same priority table, just with different validation
	// Apply the same logic as Priority method
	prioritySelection := PrioritySelection{
		Metatype:      selection.Metatype,
		Attributes:    selection.Attributes,
		Magic:         selection.Magic,
		Skills:        selection.Skills,
		Resources:     selection.Resources,
		GameplayLevel: selection.GameplayLevel,
	}

	return h.applyPrioritySelection(char, prioritySelection)
}

// ValidateSumToTenSelection validates that the sum of priority costs equals 10
func ValidateSumToTenSelection(selection SumToTenSelection) error {
	priorityCosts := map[string]int{
		"A": 4,
		"B": 3,
		"C": 2,
		"D": 1,
		"E": 0,
	}

	priorities := []string{
		selection.Metatype,
		selection.Attributes,
		selection.Magic,
		selection.Skills,
		selection.Resources,
	}

	total := 0
	for _, p := range priorities {
		if p == "none" {
			continue // Magic can be "none"
		}
		if p < "A" || p > "E" {
			return fmt.Errorf("invalid priority level: %s (must be A-E)", p)
		}
		cost, ok := priorityCosts[p]
		if !ok {
			return fmt.Errorf("invalid priority level: %s", p)
		}
		total += cost
	}

	if total != 10 {
		return fmt.Errorf("sum-to-ten total must equal 10, got %d", total)
	}

	return nil
}

