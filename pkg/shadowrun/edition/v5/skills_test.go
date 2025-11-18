package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataSkillGroups(t *testing.T) {
	assert.NotEmpty(t, DataSkillGroups, "DataSkillGroups should not be empty")

	expectedGroups := []string{"Engineering", "Firearms", "Close Combat"}
	found := make(map[string]bool)
	for _, group := range DataSkillGroups {
		for _, expected := range expectedGroups {
			if group == expected {
				found[expected] = true
			}
		}
	}
	assert.Greater(t, len(found), 0, "Expected to find at least one common skill group")
}

func TestDataSkillCategories(t *testing.T) {
	assert.NotEmpty(t, DataSkillCategories, "DataSkillCategories should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedType string
	}{
		{
			name:         "Combat Active category",
			id:           "combat_active",
			expectedName: "Combat Active",
			expectedType: "active",
		},
		{
			name:         "Physical Active category",
			id:           "physical_active",
			expectedName: "Physical Active",
			expectedType: "active",
		},
		{
			name:         "Academic category",
			id:           "academic",
			expectedName: "Academic",
			expectedType: "knowledge",
		},
		{
			name:         "Interest category",
			id:           "interest",
			expectedName: "Interest",
			expectedType: "knowledge",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataSkillCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
			assert.Equal(t, tt.expectedType, category.Type)
		})
	}
}

func TestDataSkills(t *testing.T) {
	assert.NotEmpty(t, DataSkills, "DataSkills should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Archery skill",
			id:           "archery",
			expectedName: "Archery",
		},
		{
			name:         "Armorer skill",
			id:           "armorer",
			expectedName: "Armorer",
		},
		{
			name:         "Alchemy skill",
			id:           "alchemy",
			expectedName: "Alchemy",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			skill, ok := DataSkills[tt.id]
			require.True(t, ok, "Skill %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, skill.Name)
		})
	}
}

func TestDataKnowledgeSkills(t *testing.T) {
	assert.NotEmpty(t, DataKnowledgeSkills, "DataKnowledgeSkills should not be empty")

	skill, ok := DataKnowledgeSkills["administration"]
	require.True(t, ok, "Knowledge skill 'administration' should exist")
	assert.NotEmpty(t, skill.Name, "Name should not be empty")
}

func TestSkillFields(t *testing.T) {
	skill, ok := DataSkills["archery"]
	require.True(t, ok, "Skill 'archery' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return skill.Name != "" }},
		{"Attribute", "Attribute", func() bool { return skill.Attribute != "" }},
		{"Category", "Category", func() bool { return skill.Category != "" }},
		{"Default", "Default", func() bool { return skill.Default != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestSkillCategoryFields(t *testing.T) {
	category, ok := DataSkillCategories["combat_active"]
	require.True(t, ok, "Category 'combat_active' should exist")

	assert.NotEmpty(t, category.Name, "Name should not be empty")
	assert.NotEmpty(t, category.Type, "Type should not be empty")
	assert.Contains(t, []string{"active", "knowledge"}, category.Type, "Type should be 'active' or 'knowledge'")
}
