package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataLifestyleCategories(t *testing.T) {
	assert.NotEmpty(t, DataLifestyleCategories, "DataLifestyleCategories should not be empty")
	assert.GreaterOrEqual(t, len(DataLifestyleCategories), 6, "Should have at least 6 categories")
}

func TestDataLifestyles(t *testing.T) {
	assert.NotEmpty(t, DataLifestyles, "DataLifestyles should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Street lifestyle",
			id:           "street",
			expectedName: "Street",
			expectedSource: "SR5",
		},
		{
			name:         "Squatter lifestyle",
			id:           "squatter",
			expectedName: "Squatter",
			expectedSource: "SR5",
		},
		{
			name:         "Low lifestyle",
			id:           "low",
			expectedName: "Low",
			expectedSource: "SR5",
		},
		{
			name:         "Medium lifestyle",
			id:           "medium",
			expectedName: "Medium",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			lifestyle, ok := DataLifestyles[tt.id]
			require.True(t, ok, "Lifestyle %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, lifestyle.Name)
			assert.Equal(t, tt.expectedSource, lifestyle.Source)
		})
	}
}

func TestLifestyleFields(t *testing.T) {
	lifestyle, ok := DataLifestyles["street"]
	require.True(t, ok, "Lifestyle 'street' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return lifestyle.ID != "" }},
		{"Name", "Name", func() bool { return lifestyle.Name != "" }},
		{"Cost", "Cost", func() bool { return lifestyle.Cost != "" }},
		{"Dice", "Dice", func() bool { return lifestyle.Dice != "" }},
		{"LP", "LP", func() bool { return lifestyle.LP != "" }},
		{"Multiplier", "Multiplier", func() bool { return lifestyle.Multiplier != "" }},
		{"Source", "Source", func() bool { return lifestyle.Source != "" }},
		{"Page", "Page", func() bool { return lifestyle.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestLifestyleWithFreeGrids(t *testing.T) {
	lifestyle, ok := DataLifestyles["street"]
	require.True(t, ok, "Lifestyle 'street' should exist")

	if lifestyle.FreeGrids != nil {
		assert.NotNil(t, lifestyle.FreeGrids.FreeGrid, "FreeGrids.FreeGrid should not be nil")
	}
}

func TestDataComforts(t *testing.T) {
	assert.NotEmpty(t, DataComforts, "DataComforts should not be empty")
}

func TestDataNeighborhoods(t *testing.T) {
	assert.NotEmpty(t, DataNeighborhoods, "DataNeighborhoods should not be empty")
}

func TestDataSecurities(t *testing.T) {
	assert.NotEmpty(t, DataSecurities, "DataSecurities should not be empty")
}

func TestDataLifestyleQualities(t *testing.T) {
	assert.NotEmpty(t, DataLifestyleQualities, "DataLifestyleQualities should not be empty")
}

func TestDataCities(t *testing.T) {
	assert.NotEmpty(t, DataCities, "DataCities should not be empty")
}

