package v5

// Chummer represents the root element of the books XML file
type Chummer struct {
	Version string     `xml:"version,omitempty" json:"version,omitempty"`
	Books   BookList   `xml:"books,omitempty" json:"books,omitempty"`
}

// BookList represents the collection of book elements
type BookList struct {
	Book []Book `xml:"book,omitempty" json:"book,omitempty"`
}

// Book represents a sourcebook from Shadowrun 5th Edition
// This supports both XML parsing (from chummerxml) and JSON marshaling
type Book struct {
	// Required fields (minOccurs="1")
	ID   string `xml:"id" json:"id"`         // Unique identifier (UUID)
	Name string `xml:"name" json:"name"`     // Book name
	Code string `xml:"code" json:"code"`     // Book code like "SR5", "RG", "SG", etc.

	// Optional fields
	Hide      string       `xml:"hide,omitempty" json:"hide,omitempty"`           // Hide flag (if present)
	Permanent string       `xml:"permanent,omitempty" json:"permanent,omitempty"` // Permanent flag (empty element = present, absent = not present)
	Matches   *BookMatches `xml:"matches,omitempty" json:"matches,omitempty"`     // Text matches for book identification
}

// BookMatches represents a collection of match elements
type BookMatches struct {
	Match []BookMatch `xml:"match,omitempty" json:"match,omitempty"`
}

// BookMatch represents a match entry for a book (used for identifying books by text)
type BookMatch struct {
	Language string `xml:"language" json:"language"` // Language code like "en-us", "de-de", "fr-fr"
	Text     string `xml:"text" json:"text"`         // Matching text snippet
	Page     int    `xml:"page" json:"page"`         // Page number where the text appears (xs:int in XSD)
}
