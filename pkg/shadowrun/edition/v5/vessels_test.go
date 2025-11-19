package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataVesselCategory(t *testing.T) {
	assert.NotEmpty(t, DataVesselCategory, "DataVesselCategory should not be empty")
	assert.Equal(t, "Inanimate Vessels", DataVesselCategory)
}

func TestDataVessels(t *testing.T) {
	assert.NotEmpty(t, DataVessels, "DataVessels should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Fragile Material vessel",
			id:           "fragile_material",
			expectedName: "Fragile Material",
			expectedSource: "SR5",
		},
		{
			name:         "Cheap Material vessel",
			id:           "cheap_material",
			expectedName: "Cheap Material",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			vessel, ok := DataVessels[tt.id]
			require.True(t, ok, "Vessel %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, vessel.Name)
			assert.Equal(t, tt.expectedSource, vessel.Source)
		})
	}
}

func TestVesselFields(t *testing.T) {
	vessel, ok := DataVessels["fragile_material"]
	require.True(t, ok, "Vessel 'fragile_material' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return vessel.ID != "" }},
		{"Name", "Name", func() bool { return vessel.Name != "" }},
		{"Category", "Category", func() bool { return vessel.Category != "" }},
		{"BP", "BP", func() bool { return vessel.BP != "" }},
		{"Walk", "Walk", func() bool { return vessel.Walk != "" }},
		{"Run", "Run", func() bool { return vessel.Run != "" }},
		{"Sprint", "Sprint", func() bool { return vessel.Sprint != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestVesselWithBonus(t *testing.T) {
	vessel, ok := DataVessels["fragile_material"]
	require.True(t, ok, "Vessel 'fragile_material' should exist")

	if vessel.Bonus != nil {
		assert.NotNil(t, vessel.Bonus, "Bonus should not be nil if set")
		assert.NotEmpty(t, vessel.Bonus.Armor, "Armor bonus should not be empty if set")
	}
}

func TestVesselCount(t *testing.T) {
	// Verify we have a reasonable number of vessels
	assert.Greater(t, len(DataVessels), 5, "Should have several vessels")
	assert.Less(t, len(DataVessels), 15, "Should not have too many vessels")
}

