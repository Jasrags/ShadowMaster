package domain

// SourceBook represents a reference source that can be enabled for a campaign.
type SourceBook struct {
	ID      string            `json:"id"`
	Name    string            `json:"name"`
	Code    string            `json:"code"`
	Matches []SourceBookMatch `json:"matches,omitempty"`
}

// SourceBookMatch captures localized page references for a source book entry.
type SourceBookMatch struct {
	Language string `json:"language"`
	Page     string `json:"page"`
	Text     string `json:"text"`
}
