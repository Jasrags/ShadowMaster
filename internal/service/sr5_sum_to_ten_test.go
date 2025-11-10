package service

import (
	"testing"

	"shadowmaster/internal/domain"
)

func TestValidateSumToTenSelection(t *testing.T) {
	data := &domain.CharacterCreationData{
		CreationMethods: map[string]domain.CreationMethod{
			"sum_to_ten": {
				PointBudget:   10,
				PriorityCosts: map[string]int{"A": 4, "B": 3, "C": 2, "D": 1, "E": 0},
			},
		},
	}

	selection := SumToTenSelection{
		"magic":      "B",
		"metatype":   "A",
		"attributes": "C",
		"skills":     "D",
		"resources":  "E",
	}

	if err := ValidateSumToTenSelection(data, selection); err != nil {
		t.Fatalf("expected selection to be valid, got %v", err)
	}
}

func TestValidateSumToTenSelectionMissingCategory(t *testing.T) {
	data := &domain.CharacterCreationData{
		CreationMethods: map[string]domain.CreationMethod{
			"sum_to_ten": {
				PointBudget:   10,
				PriorityCosts: map[string]int{"A": 4, "B": 3, "C": 2, "D": 1, "E": 0},
			},
		},
	}

	selection := SumToTenSelection{
		"magic":      "A",
		"metatype":   "A",
		"attributes": "B",
		"skills":     "C",
	}

	if err := ValidateSumToTenSelection(data, selection); err == nil {
		t.Fatal("expected error for missing category")
	}
}

func TestValidateSumToTenSelectionBudgetMismatch(t *testing.T) {
	data := &domain.CharacterCreationData{
		CreationMethods: map[string]domain.CreationMethod{
			"sum_to_ten": {
				PointBudget:   10,
				PriorityCosts: map[string]int{"A": 4, "B": 3, "C": 2, "D": 1, "E": 0},
			},
		},
	}

	selection := SumToTenSelection{
		"magic":      "A",
		"metatype":   "A",
		"attributes": "A",
		"skills":     "A",
		"resources":  "A",
	}

	if err := ValidateSumToTenSelection(data, selection); err == nil {
		t.Fatal("expected budget mismatch error")
	}
}

func TestValidateSumToTenSelectionUnknownPriority(t *testing.T) {
	data := &domain.CharacterCreationData{
		CreationMethods: map[string]domain.CreationMethod{
			"sum_to_ten": {
				PointBudget:   10,
				PriorityCosts: map[string]int{"A": 4, "B": 3, "C": 2, "D": 1, "E": 0},
			},
		},
	}

	selection := SumToTenSelection{
		"magic":      "Z",
		"metatype":   "A",
		"attributes": "B",
		"skills":     "C",
		"resources":  "D",
	}

	if err := ValidateSumToTenSelection(data, selection); err == nil {
		t.Fatal("expected error for unknown priority code")
	}
}

func TestValidateSumToTenSelectionUnsupportedMethod(t *testing.T) {
	data := &domain.CharacterCreationData{
		CreationMethods: map[string]domain.CreationMethod{
			"priority": {
				Label: "Priority",
			},
		},
	}

	selection := SumToTenSelection{
		"magic":      "A",
		"metatype":   "A",
		"attributes": "B",
		"skills":     "C",
		"resources":  "D",
	}

	if err := ValidateSumToTenSelection(data, selection); err != ErrCreationMethodUnsupported {
		t.Fatalf("expected ErrCreationMethodUnsupported, got %v", err)
	}
}
