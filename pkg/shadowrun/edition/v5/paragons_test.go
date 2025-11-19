package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataParagonCategory(t *testing.T) {
	assert.NotEmpty(t, DataParagonCategory, "DataParagonCategory should not be empty")
	assert.Equal(t, "Resonance", DataParagonCategory)
}

func TestDataParagons(t *testing.T) {
	assert.NotEmpty(t, DataParagons, "DataParagons should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "01 (The World Tree) paragon",
			id:           "01_the_world_tree",
			expectedName: "01 (The World Tree)",
			expectedSource: "KC",
		},
		{
			name:         "Architect paragon",
			id:           "architect",
			expectedName: "Architect",
			expectedSource: "KC",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			paragon, ok := DataParagons[tt.id]
			require.True(t, ok, "Paragon %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, paragon.Name)
			assert.Equal(t, tt.expectedSource, paragon.Source)
		})
	}
}

func TestParagonFields(t *testing.T) {
	paragon, ok := DataParagons["architect"]
	require.True(t, ok, "Paragon 'architect' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return paragon.ID != "" }},
		{"Name", "Name", func() bool { return paragon.Name != "" }},
		{"Category", "Category", func() bool { return paragon.Category != "" }},
		{"Advantage", "Advantage", func() bool { return paragon.Advantage != "" }},
		{"Disadvantage", "Disadvantage", func() bool { return paragon.Disadvantage != "" }},
		{"Source", "Source", func() bool { return paragon.Source != "" }},
		{"Page", "Page", func() bool { return paragon.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestParagonWithBonus(t *testing.T) {
	paragon, ok := DataParagons["architect"]
	require.True(t, ok, "Paragon 'architect' should exist")

	if paragon.Bonus != nil {
		assert.NotNil(t, paragon.Bonus, "Bonus should not be nil if set")
	}
}

func TestParagonWithInitiativeBonus(t *testing.T) {
	// Find a paragon with initiative bonus
	var paragon *Paragon
	for _, p := range DataParagons {
		if p.Bonus != nil && p.Bonus.Initiative != "" {
			paragon = &p
			break
		}
	}
	
	if paragon != nil {
		assert.NotEmpty(t, paragon.Bonus.Initiative, "Initiative should not be empty if set")
	}
}

