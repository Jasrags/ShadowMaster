package common

// CategoryBase represents the base category structure
// Categories are used across multiple schemas (armor, bioware, cyberware, weapons, etc.)
// The base structure is a string name (content) with optional attributes
type CategoryBase struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// Category represents a generic category structure
// This is an alias for CategoryBase for backward compatibility
type Category = CategoryBase

// CategoryWithShow extends CategoryBase with a "show" attribute
// Used in gear and other schemas where categories have visibility control
type CategoryWithShow struct {
	CategoryBase
	Show *string `xml:"show,attr,omitempty" json:"+@show,omitempty"`
}

// CategoryWithBlackmarket extends CategoryBase with a "blackmarket" attribute
// Used in armor and armor mod categories
type CategoryWithBlackmarket struct {
	CategoryBase
	Blackmarket *string `xml:"blackmarket,attr,omitempty" json:"+@blackmarket,omitempty"`
}

