package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataGrades(t *testing.T) {
	assert.NotEmpty(t, DataGrades, "DataGrades should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Standard grade",
			id:           "standard",
			expectedName: "Standard",
		},
		{
			name:         "Used grade",
			id:           "used",
			expectedName: "Used",
		},
		{
			name:         "Alphaware grade",
			id:           "alphaware",
			expectedName: "Alphaware",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			grade, ok := DataGrades[tt.id]
			require.True(t, ok, "Grade %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, grade.Name)
			assert.NotEmpty(t, grade.Source, "Source should not be empty")
		})
	}
}

func TestDataBiowareCategories(t *testing.T) {
	assert.NotEmpty(t, DataBiowareCategories, "DataBiowareCategories should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
	}{
		{
			name:         "Basic category",
			id:           "basic",
			expectedName: "Basic",
		},
		{
			name:         "Biosculpting category",
			id:           "biosculpting",
			expectedName: "Biosculpting",
		},
		{
			name:         "Bio-Weapons category",
			id:           "bio_weapons",
			expectedName: "Bio-Weapons",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			category, ok := DataBiowareCategories[tt.id]
			require.True(t, ok, "Category %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, category.Name)
			assert.NotEmpty(t, category.BlackMarket, "BlackMarket should not be empty")
		})
	}
}

func TestDataBiowares(t *testing.T) {
	assert.NotEmpty(t, DataBiowares, "DataBiowares should not be empty")

	bioware, ok := DataBiowares["adrenaline_pump"]
	require.True(t, ok, "Bioware 'adrenaline_pump' should exist")
	assert.NotEmpty(t, bioware.Name, "Name should not be empty")
	assert.NotEmpty(t, bioware.Category, "Category should not be empty")
	assert.NotEmpty(t, bioware.Source, "Source should not be empty")
}

func TestBiowareFields(t *testing.T) {
	bioware, ok := DataBiowares["adrenaline_pump"]
	require.True(t, ok, "Bioware 'adrenaline_pump' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return bioware.Name != "" }},
		{"Category", "Category", func() bool { return bioware.Category != "" }},
		{"Ess", "Ess", func() bool { return bioware.Ess != "" }},
		{"Capacity", "Capacity", func() bool { return bioware.Capacity != "" }},
		{"Avail", "Avail", func() bool { return bioware.Avail != "" }},
		{"Cost", "Cost", func() bool { return bioware.Cost != "" }},
		{"Source", "Source", func() bool { return bioware.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestGradeFields(t *testing.T) {
	grade, ok := DataGrades["standard"]
	require.True(t, ok, "Grade 'standard' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"Name", "Name", func() bool { return grade.Name != "" }},
		{"Ess", "Ess", func() bool { return grade.Ess != "" }},
		{"Cost", "Cost", func() bool { return grade.Cost != "" }},
		{"Source", "Source", func() bool { return grade.Source != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}
