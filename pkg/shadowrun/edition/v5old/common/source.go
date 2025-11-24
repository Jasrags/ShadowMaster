package common

// SourceReference provides source book and page information
// This is a common pattern across all data structures in Shadowrun
// Embed this struct in other types to include source/page fields
type SourceReference struct {
	Source string `xml:"source" json:"source"`
	Page   string `xml:"page" json:"page"`
}

