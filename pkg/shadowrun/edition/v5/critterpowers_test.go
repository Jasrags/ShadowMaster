package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataCritterPowerCategories(t *testing.T) {
	assert.NotEmpty(t, DataCritterPowerCategories, "DataCritterPowerCategories should not be empty")
	assert.GreaterOrEqual(t, len(DataCritterPowerCategories), 10, "Should have at least 10 categories")
}

func TestDataCritterPowers(t *testing.T) {
	assert.NotEmpty(t, DataCritterPowers, "DataCritterPowers should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedCategory string
	}{
		{
			name:         "Combat Skill power",
			id:           "combat_skill",
			expectedName: "Combat Skill",
			expectedCategory: "Paranormal",
		},
		{
			name:         "Physical Skill power",
			id:           "physical_skill",
			expectedName: "Physical Skill",
			expectedCategory: "Paranormal",
		},
		{
			name:         "Sense Link power",
			id:           "sense_link",
			expectedName: "Sense Link",
			expectedCategory: "Mundane",
		},
		{
			name:         "Accident power",
			id:           "accident",
			expectedName: "Accident",
			expectedCategory: "Paranormal",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			power, ok := DataCritterPowers[tt.id]
			require.True(t, ok, "Critter power %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, power.Name)
			assert.Equal(t, tt.expectedCategory, power.Category)
		})
	}
}

func TestCritterPowerFields(t *testing.T) {
	power, ok := DataCritterPowers["combat_skill"]
	require.True(t, ok, "Critter power 'combat_skill' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return power.ID != "" }},
		{"Name", "Name", func() bool { return power.Name != "" }},
		{"Category", "Category", func() bool { return power.Category != "" }},
		{"Source", "Source", func() bool { return power.Source != "" }},
		{"Page", "Page", func() bool { return power.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestCritterPowerWithBonus(t *testing.T) {
	power, ok := DataCritterPowers["combat_skill"]
	require.True(t, ok, "Critter power 'combat_skill' should exist")

	if power.Bonus != nil {
		if power.Bonus.SelectSkill != nil {
			assert.NotEmpty(t, power.Bonus.SelectSkill.Val, "SelectSkill.Val should not be empty")
			assert.NotEmpty(t, power.Bonus.SelectSkill.SkillCategory, "SelectSkill.SkillCategory should not be empty")
		}
	}
}

func TestCritterPowerWithOptionalFields(t *testing.T) {
	power, ok := DataCritterPowers["sense_link"]
	require.True(t, ok, "Critter power 'sense_link' should exist")

	// Sense Link should have type, action, range, and duration
	if power.Type != nil {
		assert.NotEmpty(t, *power.Type, "Type should not be empty if set")
	}
	if power.Action != nil {
		assert.NotEmpty(t, *power.Action, "Action should not be empty if set")
	}
	if power.Range != nil {
		assert.NotEmpty(t, *power.Range, "Range should not be empty if set")
	}
	if power.Duration != nil {
		assert.NotEmpty(t, *power.Duration, "Duration should not be empty if set")
	}
}

