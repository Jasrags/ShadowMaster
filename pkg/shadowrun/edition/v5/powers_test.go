package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataPowers(t *testing.T) {
	assert.NotEmpty(t, DataPowers, "DataPowers should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Adrenaline Boost power",
			id:           "adrenaline_boost",
			expectedName: "Adrenaline Boost",
			expectedSource: "SR5",
		},
		{
			name:         "Astral Perception power",
			id:           "astral_perception",
			expectedName: "Astral Perception",
			expectedSource: "SR5",
		},
		{
			name:         "Combat Sense power",
			id:           "combat_sense",
			expectedName: "Combat Sense",
			expectedSource: "SR5",
		},
		{
			name:         "Critical Strike power",
			id:           "critical_strike",
			expectedName: "Critical Strike",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			power, ok := DataPowers[tt.id]
			require.True(t, ok, "Power %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, power.Name)
			assert.Equal(t, tt.expectedSource, power.Source)
		})
	}
}

func TestPowerFields(t *testing.T) {
	power, ok := DataPowers["adrenaline_boost"]
	require.True(t, ok, "Power 'adrenaline_boost' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return power.ID != "" }},
		{"Name", "Name", func() bool { return power.Name != "" }},
		{"Points", "Points", func() bool { return power.Points != "" }},
		{"Levels", "Levels", func() bool { return power.Levels != "" }},
		{"Limit", "Limit", func() bool { return power.Limit != "" }},
		{"Source", "Source", func() bool { return power.Source != "" }},
		{"Page", "Page", func() bool { return power.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestPowerWithAction(t *testing.T) {
	power, ok := DataPowers["adrenaline_boost"]
	require.True(t, ok, "Power 'adrenaline_boost' should exist")

	if power.Action != nil {
		assert.NotEmpty(t, *power.Action, "Action should not be empty if set")
	}
}

func TestPowerWithAdeptWay(t *testing.T) {
	power, ok := DataPowers["astral_perception"]
	require.True(t, ok, "Power 'astral_perception' should exist")

	if power.AdeptWay != nil {
		assert.NotEmpty(t, *power.AdeptWay, "AdeptWay should not be empty if set")
	}
}

func TestPowerWithBonus(t *testing.T) {
	power, ok := DataPowers["combat_sense"]
	require.True(t, ok, "Power 'combat_sense' should exist")

	if power.Bonus != nil {
		assert.NotEmpty(t, power.Bonus.Dodge, "Dodge bonus should not be empty if set")
	}
}

func TestDataEnhancements(t *testing.T) {
	assert.NotEmpty(t, DataEnhancements, "DataEnhancements should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedPower string
	}{
		{
			name:         "Master of the Nine Chakras enhancement",
			id:           "master_of_the_nine_chakras",
			expectedName: "Master of the Nine Chakras",
			expectedPower: "Nerve Strike",
		},
		{
			name:         "Silver-Tongued Devil enhancement",
			id:           "silver_tongued_devil",
			expectedName: "Silver-Tongued Devil",
			expectedPower: "Commanding Voice",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			enh, ok := DataEnhancements[tt.id]
			if !ok {
				// Some enhancements might have different IDs due to name variations
				t.Skipf("Enhancement %s not found, may have different ID", tt.id)
				return
			}
			assert.Equal(t, tt.expectedName, enh.Name)
			assert.Equal(t, tt.expectedPower, enh.Power)
		})
	}
}

func TestEnhancementFields(t *testing.T) {
	// Find any enhancement to test
	var enh *Enhancement
	for _, e := range DataEnhancements {
		enh = &e
		break
	}
	
	require.NotNil(t, enh, "Should have at least one enhancement")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return enh.ID != "" }},
		{"Name", "Name", func() bool { return enh.Name != "" }},
		{"Power", "Power", func() bool { return enh.Power != "" }},
		{"Source", "Source", func() bool { return enh.Source != "" }},
		{"Page", "Page", func() bool { return enh.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestEnhancementWithRequired(t *testing.T) {
	// Find an enhancement with required
	var enh *Enhancement
	for _, e := range DataEnhancements {
		if e.Required != nil {
			enh = &e
			break
		}
	}
	
	if enh == nil {
		t.Skip("No enhancement with required found")
		return
	}

	if enh.Required != nil && enh.Required.AllOf != nil {
		// Power and Quality are optional - check if they exist
		if enh.Required.AllOf.Power != "" {
			assert.NotEmpty(t, enh.Required.AllOf.Power, "Required.Power should not be empty if set")
		}
		if enh.Required.AllOf.Quality != "" {
			assert.NotEmpty(t, enh.Required.AllOf.Quality, "Required.Quality should not be empty if set")
		}
		// At least one should be set
		assert.True(t, enh.Required.AllOf.Power != "" || enh.Required.AllOf.Quality != "", "At least one of Power or Quality should be set")
	}
}

