package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataMetatypeCategories(t *testing.T) {
	assert.NotEmpty(t, DataMetatypeCategories, "DataMetatypeCategories should not be empty")

	expectedCategories := []string{"Metahuman", "Metavariant", "Metasapient", "Shapeshifter"}
	found := make(map[string]bool)
	for _, cat := range DataMetatypeCategories {
		for _, expected := range expectedCategories {
			if cat == expected {
				found[expected] = true
			}
		}
	}
	assert.Greater(t, len(found), 0, "Expected to find at least one known metatype category")
}

func TestDataMetatypes(t *testing.T) {
	assert.NotEmpty(t, DataMetatypes, "DataMetatypes should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Human metatype",
			id:           "human",
			expectedName: "Human",
		},
		{
			name:         "Elf metatype",
			id:           "elf",
			expectedName: "Elf",
		},
		{
			name:         "Dwarf metatype",
			id:           "dwarf",
			expectedName: "Dwarf",
		},
		{
			name:         "Ork metatype",
			id:           "ork",
			expectedName: "Ork",
		},
		{
			name:         "Troll metatype",
			id:           "troll",
			expectedName: "Troll",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			metatype, ok := DataMetatypes[tt.id]
			require.True(t, ok, "Metatype %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, metatype.Name)
		})
	}
}

func TestMetatypeFields(t *testing.T) {
	metatype, ok := DataMetatypes["human"]
	require.True(t, ok, "Metatype 'human' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return metatype.ID != "" }},
		{"Name", "Name", func() bool { return metatype.Name != "" }},
		{"Category", "Category", func() bool { return metatype.Category != "" }},
		{"Karma", "Karma", func() bool { return metatype.Karma != "" }},
		{"Walk", "Walk", func() bool { return metatype.Walk != "" }},
		{"Run", "Run", func() bool { return metatype.Run != "" }},
		{"Sprint", "Sprint", func() bool { return metatype.Sprint != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}

	// Test attribute limits
	assert.GreaterOrEqual(t, metatype.BODMin, 1, "BODMin should be at least 1")
	assert.GreaterOrEqual(t, metatype.BODMax, metatype.BODMin, "BODMax should be >= BODMin")
	assert.GreaterOrEqual(t, metatype.AGIMin, 1, "AGIMin should be at least 1")
	assert.GreaterOrEqual(t, metatype.AGIMax, metatype.AGIMin, "AGIMax should be >= AGIMin")
}

func TestMetatypeAttributeLimits(t *testing.T) {
	metatype, ok := DataMetatypes["human"]
	require.True(t, ok, "Metatype 'human' should exist")

	tests := []struct {
		name string
		min  int
		max  int
	}{
		{"BOD", metatype.BODMin, metatype.BODMax},
		{"AGI", metatype.AGIMin, metatype.AGIMax},
		{"REA", metatype.REAMin, metatype.REAMax},
		{"STR", metatype.STRMin, metatype.STRMax},
		{"CHA", metatype.CHAMin, metatype.CHAMax},
		{"INT", metatype.INTMin, metatype.INTMax},
		{"LOG", metatype.LOGMin, metatype.LOGMax},
		{"WIL", metatype.WILMin, metatype.WILMax},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.LessOrEqual(t, tt.min, tt.max, "%s min (%d) should not be greater than max (%d)", tt.name, tt.min, tt.max)
			assert.GreaterOrEqual(t, tt.min, 1, "%s min (%d) should be at least 1", tt.name, tt.min)
		})
	}
}
