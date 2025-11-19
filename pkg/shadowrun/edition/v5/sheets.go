package v5

// Sheet represents a character sheet template from Shadowrun 5th Edition
type Sheet struct {
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Display name (localized)
	Filename string `json:"filename"` // Filename for the sheet template
}

// SheetLanguageGroup represents a group of sheets for a specific language
type SheetLanguageGroup struct {
	Lang  string  `json:"+@lang"` // Language code (e.g., "en-us", "de-de")
	Sheet []Sheet `json:"sheet"`  // List of sheets for this language
}
