package v5

// StringsData represents string lists from Shadowrun 5th Edition
// These are various lists of strings used throughout the system
type StringsData struct {
	MatrixAttributes []string `json:"matrixattributes,omitempty"`
	Elements         []string `json:"elements,omitempty"`
	Immunities       []string `json:"immunities,omitempty"`
	SpiritCategories []string `json:"spiritcategories,omitempty"`
}
