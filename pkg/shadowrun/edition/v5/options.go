package v5

// LimbCount represents a limb count option
type LimbCount struct {
	Name      string  `json:"name"`              // Display name
	LimbCount string  `json:"limbcount"`         // Number of limbs
	Exclude   *string `json:"exclude,omitempty"` // Excluded body parts (comma-separated)
}

// PDFArgumentAppNames represents application names for a PDF argument
type PDFArgumentAppNames struct {
	AppName []string `json:"appname"` // List of application names
}

// PDFArgument represents a PDF viewer argument configuration
type PDFArgument struct {
	Name     string               `json:"name"`               // Argument name
	Value    string               `json:"value"`              // Argument value template
	AppNames *PDFArgumentAppNames `json:"appnames,omitempty"` // Application names (optional)
}

// AvailMapEntry represents an availability mapping entry
type AvailMapEntry struct {
	ID       string `json:"id"`       // Unique identifier (UUID)
	Value    string `json:"value"`    // Value threshold
	Duration string `json:"duration"` // Duration number
	Interval string `json:"interval"` // Interval type (e.g., "String_Hours", "String_Day")
}
