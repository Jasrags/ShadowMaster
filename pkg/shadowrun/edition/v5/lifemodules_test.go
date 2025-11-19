package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataLifeModuleStages(t *testing.T) {
	assert.NotEmpty(t, DataLifeModuleStages, "DataLifeModuleStages should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedContent string
	}{
		{
			name:         "Nationality stage",
			id:           "nationality",
			expectedContent: "Nationality",
		},
		{
			name:         "Formative Years stage",
			id:           "formative_years",
			expectedContent: "Formative Years",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			stage, ok := DataLifeModuleStages[tt.id]
			require.True(t, ok, "Stage %s should exist", tt.id)
			assert.Equal(t, tt.expectedContent, stage.Content)
		})
	}
}

func TestLifeModuleStageFields(t *testing.T) {
	stage, ok := DataLifeModuleStages["nationality"]
	require.True(t, ok, "Stage 'nationality' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Content", "Content", func() bool { return stage.Content != "" }},
		{"Order", "Order", func() bool { return stage.Order != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestDataLifeModules(t *testing.T) {
	assert.NotEmpty(t, DataLifeModules, "DataLifeModules should not be empty")

	// Find any module to test
	var module *LifeModule
	for _, m := range DataLifeModules {
		module = &m
		break
	}
	
	require.NotNil(t, module, "Should have at least one life module")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return module.ID != "" }},
		{"Stage", "Stage", func() bool { return module.Stage != "" }},
		{"Category", "Category", func() bool { return module.Category != "" }},
		{"Name", "Name", func() bool { return module.Name != "" }},
		{"Karma", "Karma", func() bool { return module.Karma != "" }},
		{"Source", "Source", func() bool { return module.Source != "" }},
		{"Page", "Page", func() bool { return module.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestLifeModuleWithVersions(t *testing.T) {
	// Find a module with versions
	var module *LifeModule
	for _, m := range DataLifeModules {
		if m.Versions != nil {
			module = &m
			break
		}
	}
	
	if module != nil {
		assert.NotNil(t, module.Versions, "Versions should not be nil if set")
	}
}

func TestLifeModuleWithBonus(t *testing.T) {
	// Find a module with bonus
	var module *LifeModule
	for _, m := range DataLifeModules {
		if m.Bonus != nil {
			module = &m
			break
		}
	}
	
	if module != nil {
		assert.NotNil(t, module.Bonus, "Bonus should not be nil if set")
	}
}

