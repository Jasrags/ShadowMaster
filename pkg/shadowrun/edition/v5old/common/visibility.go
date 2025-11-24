package common

// Visibility provides common visibility control fields
// These fields control whether items are hidden or ignored based on source settings
// Embed this struct in other types to include hide/ignore fields
type Visibility struct {
	Hide                *string `xml:"hide,omitempty" json:"hide,omitempty"`
	IgnoreSourceDisabled *string `xml:"ignoresourcedisabled,omitempty" json:"ignoresourcedisabled,omitempty"`
}

