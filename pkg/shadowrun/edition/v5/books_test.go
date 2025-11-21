package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDataBooks(t *testing.T) {
	assert.NotEmpty(t, DataBooks, "DataBooks should not be empty")
	assert.Greater(t, len(DataBooks), 60, "Should have many books")
	assert.Less(t, len(DataBooks), 70, "Should not have too many books")
}

func TestDataBooksSpecific(t *testing.T) {
	tests := []struct {
		name         string
		code         string
		expectedName string
	}{
		{
			name:         "Assassin's Primer",
			code:         "AP",
			expectedName: "Assassin's Primer",
		},
		{
			name:         "Gun Heaven 3",
			code:         "GH3",
			expectedName: "Gun Heaven 3",
		},
		{
			name:         "Run and Gun",
			code:         "RG",
			expectedName: "Run and Gun",
		},
		{
			name:         "Shadowrun 5th Edition",
			code:         "SR5",
			expectedName: "Shadowrun 5th Edition",
		},
		{
			name:         "Street Grimoire",
			code:         "SG",
			expectedName: "Street Grimoire",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var found *Book
			for i := range DataBooks {
				if DataBooks[i].Code == tt.code {
					found = &DataBooks[i]
					break
				}
			}
			require.NotNil(t, found, "Book with code %s should exist", tt.code)
			assert.Equal(t, tt.expectedName, found.Name)
			assert.Equal(t, tt.code, found.Code)
			assert.NotEmpty(t, found.ID, "ID should not be empty")
		})
	}
}

func TestBookFields(t *testing.T) {
	// Find first book
	require.NotEmpty(t, DataBooks, "DataBooks should not be empty")
	book := DataBooks[0]

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

func TestBookWithMatches(t *testing.T) {
	// Find a book with matches
	var book *Book
	for i := range DataBooks {
		if DataBooks[i].Matches != nil && len(DataBooks[i].Matches.Match) > 0 {
			book = &DataBooks[i]
			break
		}
	}

	require.NotNil(t, book, "Should have at least one book with matches")
	assert.NotNil(t, book.Matches, "Matches should not be nil")
	assert.NotEmpty(t, book.Matches.Match, "Match slice should not be empty")

	match := book.Matches.Match[0]
	assert.NotEmpty(t, match.Language, "Language should not be empty")
	assert.NotEmpty(t, match.Text, "Text should not be empty")
	assert.Greater(t, match.Page, 0, "Page should be greater than 0")
}

func TestBookPermanent(t *testing.T) {
	// Find permanent book
	var book *Book
	for i := range DataBooks {
		if DataBooks[i].Permanent != "" {
			book = &DataBooks[i]
			break
		}
	}

	require.NotNil(t, book, "Should have at least one permanent book")
	assert.Equal(t, "Shadowrun 5th Edition", book.Name)
	assert.NotEmpty(t, book.Permanent, "Permanent field should be set")
}
