package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataSpiritPowers(t *testing.T) {
	assert.NotEmpty(t, DataSpiritPowers, "DataSpiritPowers should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Accident spirit power",
			id:           "accident",
			expectedName: "Accident",
			expectedSource: "SR5",
		},
		{
			name:         "Animal Control spirit power",
			id:           "animal_control",
			expectedName: "Animal Control",
			expectedSource: "SR5",
		},
		{
			name:         "Armor spirit power",
			id:           "armor",
			expectedName: "Armor",
			expectedSource: "SR5",
		},
		{
			name:         "Astral Form spirit power",
			id:           "astral_form",
			expectedName: "Astral Form",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			power, ok := DataSpiritPowers[tt.id]
			require.True(t, ok, "Spirit power %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, power.Name)
			assert.Equal(t, tt.expectedSource, power.Source)
		})
	}
}

func TestSpiritPowerFields(t *testing.T) {
	power, ok := DataSpiritPowers["accident"]
	require.True(t, ok, "Spirit power 'accident' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return power.Name != "" }},
		{"Source", "Source", func() bool { return power.Source != "" }},
		{"Page", "Page", func() bool { return power.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

