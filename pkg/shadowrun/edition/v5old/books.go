package v5

// This file contains book structures generated from books.xsd

// Match represents a book match entry
type Match struct {
// Language represents language
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: en-us, de-de, en-us (and 7 more)
// Enum Candidate: de-de, en-us, fr-fr
	Language string `xml:"language" json:"language"`
	Text     string `xml:"text" json:"text"`
	Page     int    `xml:"page" json:"page"`
}

// Matches represents a collection of book matches
type Matches struct {
	Match []Match `xml:"match" json:"match"`
}

// Book represents a book definition
type Book struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 63
// Examples: 289bc41d-6dd5-4216-9bc7-e6f0cabae9ac, b68175bc-e10f-4e11-9361-ed62bb371c8d, 5d6626a2-2400-44b5-b777-d7dac6cb512f (and 7 more)
	ID        string   `xml:"id" json:"id"`
	Name      string   `xml:"name" json:"name"`
	Hide      *string  `xml:"hide,omitempty" json:"hide,omitempty"`
	Code      string   `xml:"code" json:"code"`
	Permanent *string  `xml:"permanent,omitempty" json:"permanent,omitempty"`
	Matches   *Matches `xml:"matches,omitempty" json:"matches,omitempty"`
}

// Books represents a collection of books
type Books struct {
	Book []Book `xml:"book,omitempty" json:"book,omitempty"`
}

// BooksChummer represents the root chummer element for books
type BooksChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Books   []Books `xml:"books,omitempty" json:"books,omitempty"`
}
