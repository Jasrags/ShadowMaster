package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataBooks(t *testing.T) {
	assert.NotEmpty(t, DataBooks, "DataBooks should not be empty")

	tests := []struct {
		name         string
		id           string
		expectedName string
		expectedCode string
	}{
		{
			name:         "Shadowrun 5th Edition",
			id:           "sr5",
			expectedName: "Shadowrun 5th Edition",
			expectedCode: "SR5",
		},
		{
			name:         "Run and Gun",
			id:           "rg",
			expectedName: "Run and Gun",
			expectedCode: "RG",
		},
		{
			name:         "Street Grimoire",
			id:           "sg",
			expectedName: "Street Grimoire",
			expectedCode: "SG",
		},
		{
			name:         "Chrome Flesh",
			id:           "cf",
			expectedName: "Chrome Flesh",
			expectedCode: "CF",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			book, ok := DataBooks[tt.id]
			require.True(t, ok, "Book %s should exist", tt.id)
			assert.Equal(t, tt.expectedName, book.Name)
			assert.Equal(t, tt.expectedCode, book.Code)
		})
	}
}

func TestBookFields(t *testing.T) {
	book, ok := DataBooks["sr5"]
	require.True(t, ok, "Book 'sr5' should exist")

	tests := []struct {
		name    string
		field   string
		checkFn func() bool
	}{
		{"ID", "ID", func() bool { return book.ID != "" }},
		{"Name", "Name", func() bool { return book.Name != "" }},
		{"Code", "Code", func() bool { return book.Code != "" }},
	}

	for _, tt := range tests {
		t.Run(tt.field, func(t *testing.T) {
			assert.True(t, tt.checkFn(), "%s should not be empty", tt.field)
		})
	}
}

func TestBookMatches(t *testing.T) {
	book, ok := DataBooks["sr5"]
	require.True(t, ok, "Book 'sr5' should exist")

	if book.Matches != nil {
		assert.NotNil(t, book.Matches.Match, "Match should not be nil if Matches is set")
	}
}

func TestBookWithSingleMatch(t *testing.T) {
	// Test a book with a single match (not an array)
	book, ok := DataBooks["sge"]
	require.True(t, ok, "Book 'sge' should exist")

	if book.Matches != nil {
		assert.NotNil(t, book.Matches.Match, "Match should not be nil")
	}
}

func TestBookWithMultipleMatches(t *testing.T) {
	// Test a book with multiple matches (array)
	book, ok := DataBooks["sr5"]
	require.True(t, ok, "Book 'sr5' should exist")

	if book.Matches != nil {
		assert.NotNil(t, book.Matches.Match, "Match should not be nil")
	}
}
