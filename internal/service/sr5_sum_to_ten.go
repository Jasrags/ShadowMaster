package service

import (
	"fmt"
	"strings"

	"shadowmaster/internal/domain"
)

// SumToTenSelection represents the priority assignments for SR5 Sum-to-Ten creation.
// Keys should map to the standard priority categories (magic, metatype, attributes, skills, resources).
type SumToTenSelection map[string]string

// ValidateSumToTenSelection ensures a Sum-to-Ten selection respects campaign rules, priority costs, and budget.
func ValidateSumToTenSelection(data *domain.CharacterCreationData, selection SumToTenSelection) error {
	if data == nil {
		return fmt.Errorf("%w: character creation data is required", ErrSumToTenInvalidSelection)
	}

	method, ok := data.CreationMethods["sum_to_ten"]
	if !ok {
		return ErrCreationMethodUnsupported
	}

	if method.PointBudget <= 0 {
		return fmt.Errorf("%w: invalid point budget configured", ErrSumToTenInvalidSelection)
	}

	costs := method.PriorityCosts
	if len(costs) == 0 {
		return fmt.Errorf("%w: priority costs are not configured", ErrSumToTenInvalidSelection)
	}

	requiredCategories := []string{"magic", "metatype", "attributes", "skills", "resources"}

	total := 0
	normalizedSelection := make(map[string]string, len(selection))

	for _, category := range requiredCategories {
		rawValue := strings.ToUpper(strings.TrimSpace(selection[category]))
		if rawValue == "" {
			return fmt.Errorf("%w: %s", ErrSumToTenMissingCategory, category)
		}
		normalizedSelection[category] = rawValue

		cost, ok := costs[rawValue]
		if !ok {
			return fmt.Errorf("%w: %s (category %s)", ErrSumToTenUnknownPriorityCode, rawValue, category)
		}
		if cost < 0 {
			return fmt.Errorf("%w: %s (category %s)", ErrSumToTenInvalidSelection, rawValue, category)
		}
		total += cost
	}

	if total != method.PointBudget {
		return fmt.Errorf("%w: spent %d of %d points", ErrSumToTenBudgetMismatch, total, method.PointBudget)
	}

	return nil
}
