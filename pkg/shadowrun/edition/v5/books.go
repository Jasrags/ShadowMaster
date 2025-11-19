package v5

// BookMatch represents a match entry for a book (used for identifying books by text)
type BookMatch struct {
	Language string `json:"language"` // Language code like "en-us", "de-de"
	Text     string `json:"text"`     // Matching text snippet
	Page     string `json:"page"`     // Page number where the text appears
}

// BookMatches represents a collection of matches for a book
type BookMatches struct {
	Match interface{} `json:"match,omitempty"` // Can be single BookMatch or []BookMatch
}

// Book represents a sourcebook from Shadowrun 5th Edition
type Book struct {
	// Required fields
	ID   string `json:"id"`   // Unique identifier (UUID)
	Name string `json:"name"` // Book name
	Code string `json:"code"` // Book code like "SR5", "RG", "SG", etc.

	// Optional fields
	Permanent *bool        `json:"permanent,omitempty"` // Whether the book is permanent
	Matches   *BookMatches `json:"matches,omitempty"`   // Text matches for book identification
}
