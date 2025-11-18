package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataQualityCategories(t *testing.T) {
	assert.NotEmpty(t, DataQualityCategories, "DataQualityCategories should not be empty")

	expectedCategories := []string{"Positive", "Negative"}
	found := make(map[string]bool)
	for _, cat := range DataQualityCategories {
		for _, expected := range expectedCategories {
			if cat == expected {
				found[expected] = true
			}
		}
	}
	assert.Equal(t, len(expectedCategories), len(found), "Expected to find both Positive and Negative quality categories")
}

func TestDataQualities(t *testing.T) {
	assert.NotEmpty(t, DataQualities, "DataQualities should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		category     string
	}{
		{
			name:         "Ambidextrous positive quality",
			id:           "ambidextrous",
			expectedName: "Ambidextrous",
			category:     "Positive",
		},
		{
			name:         "Analytical Mind positive quality",
			id:           "analytical_mind",
			expectedName: "Analytical Mind",
			category:     "Positive",
		},
		{
			name:         "Addiction Mild negative quality",
			id:           "addiction_mild",
			expectedName: "Addiction (Mild)",
			category:     "Negative",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			quality, ok := DataQualities[tt.id]
			require.True(t, ok, "Quality %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, quality.Name)
			assert.Equal(t, tt.category, quality.Category)
		})
	}
}

func TestQualityFields(t *testing.T) {
	quality, ok := DataQualities["ambidextrous"]
	require.True(t, ok, "Quality 'ambidextrous' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return quality.Name != "" }},
		{"Karma", "Karma", func() bool { return quality.Karma != "" }},
		{"Category", "Category", func() bool { return quality.Category != "" }},
		{"Source", "Source", func() bool { return quality.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}

	assert.Contains(t, []string{"Positive", "Negative"}, quality.Category, "Category should be 'Positive' or 'Negative'")
}

func TestPositiveQualities(t *testing.T) {
	positiveCount := 0
	for _, quality := range DataQualities {
		if quality.Category == "Positive" {
			positiveCount++
		}
	}
	assert.Greater(t, positiveCount, 0, "Expected to find at least one positive quality")
}

func TestNegativeQualities(t *testing.T) {
	negativeCount := 0
	for _, quality := range DataQualities {
		if quality.Category == "Negative" {
			negativeCount++
		}
	}
	assert.Greater(t, negativeCount, 0, "Expected to find at least one negative quality")
}
