package common

// Grade represents a grade structure used by bioware and cyberware
// Grades define the quality/essence multiplier and cost multiplier for ware
// Common grades: Standard, Alphaware, Betaware, Deltaware, Used
type Grade struct {
	ID                string  `xml:"id" json:"id"`
	Name              *string `xml:"name,omitempty" json:"name,omitempty"`
	Ess               *string `xml:"ess,omitempty" json:"ess,omitempty"`               // Essence multiplier
	Cost              *string `xml:"cost,omitempty" json:"cost,omitempty"`             // Cost multiplier
	DeviceRating      *int    `xml:"devicerating,omitempty" json:"devicerating,omitempty"`
	Avail             *string `xml:"avail,omitempty" json:"avail,omitempty"`
	Source            *string `xml:"source,omitempty" json:"source,omitempty"`
	Page              *string `xml:"page,omitempty" json:"page,omitempty"`
	Visibility        // Embed visibility fields (hide, ignoresourcedisabled)
}

