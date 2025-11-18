package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataSpellCategories(t *testing.T) {
	assert.NotEmpty(t, DataSpellCategories, "DataSpellCategories should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Combat category",
			id:           "combat",
			expectedName: "Combat",
		},
		{
			name:         "Detection category",
			id:           "detection",
			expectedName: "Detection",
		},
		{
			name:         "Health category",
			id:           "health",
			expectedName: "Health",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataSpellCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
		})
	}
}

func TestDataSpells(t *testing.T) {
	assert.NotEmpty(t, DataSpells, "DataSpells should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Acid Stream spell",
			id:           "acid_stream",
			expectedName: "Acid Stream",
		},
		{
			name:         "Fireball spell",
			id:           "fireball",
			expectedName: "Fireball",
		},
		{
			name:         "Heal spell",
			id:           "heal",
			expectedName: "Heal",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			spell, ok := DataSpells[tt.id]
			require.True(t, ok, "Spell %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, spell.Name)
		})
	}
}

func TestSpellCategoryFields(t *testing.T) {
	category, ok := DataSpellCategories["combat"]
	require.True(t, ok, "Category 'combat' should exist")
	assert.NotEmpty(t, category.UseSkill, "UseSkill should not be empty")
}

func TestSpellFields(t *testing.T) {
	spell, ok := DataSpells["acid_stream"]
	require.True(t, ok, "Spell 'acid_stream' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return spell.Name != "" }},
		{"Category", "Category", func() bool { return spell.Category != "" }},
		{"Type", "Type", func() bool { return spell.Type != "" }},
		{"Range", "Range", func() bool { return spell.Range != "" }},
		{"Duration", "Duration", func() bool { return spell.Duration != "" }},
		{"DV", "DV", func() bool { return spell.DV != "" }},
		{"Source", "Source", func() bool { return spell.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}
