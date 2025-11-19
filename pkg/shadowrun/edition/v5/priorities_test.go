package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataPriorities(t *testing.T) {
	assert.NotEmpty(t, DataPriorities, "DataPriorities should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedValue string
		expectedCategory string
	}{
		{
			name:         "A - Any metatype priority",
			id:           "a_any_metatype",
			expectedName: "A - Any metatype",
			expectedValue: "A",
			expectedCategory: "Heritage",
		},
		{
			name:         "B - Any metatype priority",
			id:           "b_any_metatype",
			expectedName: "B - Any metatype",
			expectedValue: "B",
			expectedCategory: "Heritage",
		},
		// Note: Talent priority IDs may vary, so we test by finding any Talent priority
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			priority, ok := DataPriorities[tt.id]
			require.True(t, ok, "Priority %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, priority.Name)
			assert.Equal(t, tt.expectedValue, priority.Value)
			assert.Equal(t, tt.expectedCategory, priority.Category)
		})
	}
}

func TestPriorityFields(t *testing.T) {
	priority, ok := DataPriorities["a_any_metatype"]
	require.True(t, ok, "Priority 'a_any_metatype' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return priority.ID != "" }},
		{"Name", "Name", func() bool { return priority.Name != "" }},
		{"Value", "Value", func() bool { return priority.Value != "" }},
		{"Category", "Category", func() bool { return priority.Category != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestPriorityWithMetatypes(t *testing.T) {
	priority, ok := DataPriorities["a_any_metatype"]
	require.True(t, ok, "Priority 'a_any_metatype' should exist")

	if priority.Metatypes != nil {
		assert.NotNil(t, priority.Metatypes.Metatype, "Metatypes.Metatype should not be nil")
	}
}

func TestPriorityWithTalents(t *testing.T) {
	// Find a Talent priority
	var talentPriority *Priority
	for _, p := range DataPriorities {
		if p.Category == "Talent" {
			talentPriority = &p
			break
		}
	}
	
	require.NotNil(t, talentPriority, "Should have at least one Talent priority")
	if talentPriority.Talents != nil {
		assert.NotNil(t, talentPriority.Talents.Talent, "Talents.Talent should not be nil")
	}
}

func TestPriorityWithAttributes(t *testing.T) {
	// Find an Attributes priority
	var attrPriority *Priority
	for _, p := range DataPriorities {
		if p.Category == "Attributes" {
			attrPriority = &p
			break
		}
	}
	
	require.NotNil(t, attrPriority, "Should have at least one Attributes priority")
	assert.NotEmpty(t, attrPriority.Attributes, "Attributes should not be empty")
}

func TestPriorityWithSkills(t *testing.T) {
	// Find a Skills priority
	var skillsPriority *Priority
	for _, p := range DataPriorities {
		if p.Category == "Skills" {
			skillsPriority = &p
			break
		}
	}
	
	require.NotNil(t, skillsPriority, "Should have at least one Skills priority")
	assert.NotEmpty(t, skillsPriority.Skills, "Skills should not be empty")
}

func TestPriorityWithResources(t *testing.T) {
	// Find a Resources priority
	var resourcesPriority *Priority
	for _, p := range DataPriorities {
		if p.Category == "Resources" {
			resourcesPriority = &p
			break
		}
	}
	
	require.NotNil(t, resourcesPriority, "Should have at least one Resources priority")
	assert.NotEmpty(t, resourcesPriority.Resources, "Resources should not be empty")
}

func TestDataPriorityCategories(t *testing.T) {
	assert.NotEmpty(t, DataPriorityCategories, "DataPriorityCategories should not be empty")
	assert.Contains(t, DataPriorityCategories, "Heritage")
	assert.Contains(t, DataPriorityCategories, "Talent")
	assert.Contains(t, DataPriorityCategories, "Attributes")
	assert.Contains(t, DataPriorityCategories, "Skills")
	assert.Contains(t, DataPriorityCategories, "Resources")
}

func TestDataPriorityTables(t *testing.T) {
	assert.NotEmpty(t, DataPriorityTables, "DataPriorityTables should not be empty")
	assert.Contains(t, DataPriorityTables, "Standard")
}

func TestDataPrioritySumToTenValues(t *testing.T) {
	assert.NotEmpty(t, DataPrioritySumToTenValues, "DataPrioritySumToTenValues should not be empty")
	
	tests := []struct {
		letter string
		expectedValue string
	}{
		{"A", "4"},
		{"B", "3"},
		{"C", "2"},
		{"D", "1"},
		{"E", "0"},
	}

	for _, tt := range tests {
		t.Run(tt.letter, func(t *testing.T) {
			value, ok := DataPrioritySumToTenValues[tt.letter]
			require.True(t, ok, "Priority letter %s should exist", tt.letter)
			assert.Equal(t, tt.expectedValue, value)
		})
	}
}

