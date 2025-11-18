package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataGearCategories(t *testing.T) {
	assert.NotEmpty(t, DataGearCategories, "DataGearCategories should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Alchemical Tools category",
			id:           "alchemical_tools",
			expectedName: "Alchemical Tools",
		},
		{
			name:         "Ammunition category",
			id:           "ammunition",
			expectedName: "Ammunition",
		},
		{
			name:         "Commlinks category",
			id:           "commlinks",
			expectedName: "Commlinks",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataGearCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
		})
	}
}

func TestDataGears(t *testing.T) {
	assert.NotEmpty(t, DataGears, "DataGears should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Throwing Syringe",
			id:           "throwing_syringe",
			expectedName: "Throwing Syringe",
		},
		{
			name:         "Spare Clip",
			id:           "spare_clip",
			expectedName: "Spare Clip",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gear, ok := DataGears[tt.id]
			require.True(t, ok, "Gear %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, gear.Name)
		})
	}
}

func TestGearFields(t *testing.T) {
	gear, ok := DataGears["throwing_syringe"]
	require.True(t, ok, "Gear 'throwing_syringe' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return gear.Name != "" }},
		{"Category", "Category", func() bool { return gear.Category != "" }},
		{"Source", "Source", func() bool { return gear.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}
