package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataMentors(t *testing.T) {
	assert.NotEmpty(t, DataMentors, "DataMentors should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedSource string
	}{
		{
			name:         "Bear mentor",
			id:           "bear",
			expectedName: "Bear",
			expectedSource: "SR5",
		},
		{
			name:         "Cat mentor",
			id:           "cat",
			expectedName: "Cat",
			expectedSource: "SR5",
		},
		{
			name:         "Dog mentor",
			id:           "dog",
			expectedName: "Dog",
			expectedSource: "SR5",
		},
		{
			name:         "Eagle mentor",
			id:           "eagle",
			expectedName: "Eagle",
			expectedSource: "SR5",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mentor, ok := DataMentors[tt.id]
			require.True(t, ok, "Mentor %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, mentor.Name)
			assert.Equal(t, tt.expectedSource, mentor.Source)
		})
	}
}

func TestMentorFields(t *testing.T) {
	mentor, ok := DataMentors["bear"]
	require.True(t, ok, "Mentor 'bear' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return mentor.ID != "" }},
		{"Name", "Name", func() bool { return mentor.Name != "" }},
		{"Advantage", "Advantage", func() bool { return mentor.Advantage != "" }},
		{"Disadvantage", "Disadvantage", func() bool { return mentor.Disadvantage != "" }},
		{"Source", "Source", func() bool { return mentor.Source != "" }},
		{"Page", "Page", func() bool { return mentor.Page != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestMentorWithBonus(t *testing.T) {
	mentor, ok := DataMentors["bear"]
	require.True(t, ok, "Mentor 'bear' should exist")

	if mentor.Bonus != nil {
		assert.NotEmpty(t, mentor.Bonus.DamageResistance, "DamageResistance should not be empty if set")
	}
}

func TestMentorWithChoices(t *testing.T) {
	mentor, ok := DataMentors["bear"]
	require.True(t, ok, "Mentor 'bear' should exist")

	if mentor.Choices != nil {
		assert.NotNil(t, mentor.Choices.Choice, "Choices.Choice should not be nil")
	}
}

