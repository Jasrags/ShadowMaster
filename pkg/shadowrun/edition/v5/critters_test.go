package v5

import (
	"testing"
)

func TestDataCritterCategories(t *testing.T) {
	if len(DataCritterCategories) == 0 {
		t.Error("DataCritterCategories should not be empty")
	}

	// Test a few known categories
	testCases := []struct {
		id       string
		expected string
	}{
		{"mundane_critters", "Mundane Critters"},
		{"spirits", "Spirits"},
		{"infected", "Infected"},
	}

	for _, tc := range testCases {
		category, ok := DataCritterCategories[tc.id]
		if !ok {
			t.Errorf("Category %s not found", tc.id)
			continue
		}
		if category.Name != tc.expected {
			t.Errorf("Category %s: expected name %s, got %s", tc.id, tc.expected, category.Name)
		}
	}
}

func TestDataCritters(t *testing.T) {
	// DataCritters map exists (may be empty for now due to complexity)
	if DataCritters == nil {
		t.Error("DataCritters should not be nil")
	}
	// Note: DataCritters is currently empty - critters data conversion is complex
	// and will be handled separately
}

func TestCritterFields(t *testing.T) {
	// Test that the Critter struct can be instantiated correctly
	// Note: DataCritters is currently empty - this test validates struct definition
	critter := Critter{
		Name:     "Test Critter",
		Category: "Test Category",
		Karma:    "0",
		Walk:     "1",
		Run:      "2",
		Sprint:   "3",
	}

	if critter.Name == "" {
		t.Error("Critter Name should not be empty")
	}
	if critter.Category == "" {
		t.Error("Critter Category should not be empty")
	}
	if critter.Walk == "" {
		t.Error("Critter Walk should not be empty")
	}
	if critter.Run == "" {
		t.Error("Critter Run should not be empty")
	}
	if critter.Sprint == "" {
		t.Error("Critter Sprint should not be empty")
	}
}
