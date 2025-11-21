package common

// Category represents a generic category structure
// Categories are used across multiple schemas (armor, bioware, cyberware, weapons, etc.)
// The base structure is a string name with optional attributes
type Category struct {
	Name string `xml:",chardata" json:"+content"`
	// Optional attributes vary by schema (e.g., "show" in gear categories)
	// Specific category types can extend this with their own attributes
}

// CategoryWithShow extends Category with a "show" attribute
// Used in gear and other schemas where categories have visibility control
type CategoryWithShow struct {
	Name string  `xml:",chardata" json:"+content"`
	Show *string `xml:"show,attr,omitempty" json:"+@show,omitempty"`
}

