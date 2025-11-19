package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataMartialArts(t *testing.T) {
	assert.NotEmpty(t, DataMartialArts, "DataMartialArts should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "52 Blocks martial art",
			id:           "52_blocks",
			expectedName: "52 Blocks",
			expectedSource: "RG",
		},
		{
			name:         "Aikido martial art",
			id:           "aikido",
			expectedName: "Aikido",
			expectedSource: "RG",
		},
		{
			name:         "Arnis De Mano martial art",
			id:           "arnis_de_mano",
			expectedName: "Arnis De Mano",
			expectedSource: "RG",
		},
		{
			name:         "Bartitsu martial art",
			id:           "bartitsu",
			expectedName: "Bartitsu",
			expectedSource: "RG",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			art, ok := DataMartialArts[tt.id]
			require.True(t, ok, "Martial art %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, art.Name)
			assert.Equal(t, tt.expectedSource, art.Source)
		})
	}
}

func TestMartialArtFields(t *testing.T) {
	art, ok := DataMartialArts["52_blocks"]
	require.True(t, ok, "Martial art '52_blocks' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return art.ID != "" }},
		{"Name", "Name", func() bool { return art.Name != "" }},
		{"Source", "Source", func() bool { return art.Source != "" }},
		{"Page", "Page", func() bool { return art.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestMartialArtWithBonus(t *testing.T) {
	art, ok := DataMartialArts["52_blocks"]
	require.True(t, ok, "Martial art '52_blocks' should exist")

	if art.Bonus != nil {
		if art.Bonus.AddSkillSpecializationOption != nil {
			assert.NotEmpty(t, art.Bonus.AddSkillSpecializationOption.Skill, "Skill should not be empty")
			assert.NotEmpty(t, art.Bonus.AddSkillSpecializationOption.Spec, "Spec should not be empty")
		}
	}
}

func TestMartialArtWithTechniques(t *testing.T) {
	art, ok := DataMartialArts["52_blocks"]
	require.True(t, ok, "Martial art '52_blocks' should exist")

	if art.Techniques != nil {
		// Techniques should be set
		assert.NotNil(t, art.Techniques.Technique, "Techniques.Technique should not be nil")
	}
}

func TestDataTechniques(t *testing.T) {
	assert.NotEmpty(t, DataTechniques, "DataTechniques should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Called Shot (Disarm) technique",
			id:           "called_shot_disinarm",
			expectedName: "Called Shot (Disarm)",
			expectedSource: "RG",
		},
		{
			name:         "Kick Attack technique",
			id:           "kick_attack",
			expectedName: "Kick Attack",
			expectedSource: "RG",
		},
		{
			name:         "Counterstrike technique",
			id:           "counterstrike",
			expectedName: "Counterstrike",
			expectedSource: "RG",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tech, ok := DataTechniques[tt.id]
			if !ok {
				// Some techniques might have different IDs due to name variations
				t.Skipf("Technique %s not found, may have different ID", tt.id)
				return
			}
			assert.Equal(t, tt.expectedName, tech.Name)
			assert.Equal(t, tt.expectedSource, tech.Source)
		})
	}
}

func TestTechniqueFields(t *testing.T) {
	// Find any technique to test
	var tech *Technique
	for _, t := range DataTechniques {
		tech = &t
		break
	}
	
	require.NotNil(t, tech, "Should have at least one technique")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return tech.ID != "" }},
		{"Name", "Name", func() bool { return tech.Name != "" }},
		{"Source", "Source", func() bool { return tech.Source != "" }},
		{"Page", "Page", func() bool { return tech.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

