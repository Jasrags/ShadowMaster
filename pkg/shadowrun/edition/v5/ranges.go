package v5

// Range represents a weapon range table entry from Shadowrun 5th Edition
type Range struct {
	Name    string `json:"name"`    // Range category name (e.g., "Tasers", "Holdouts")
	Min     string `json:"min"`     // Minimum range
	Short   string `json:"short"`   // Short range (can be formula like "{STR}")
	Medium  string `json:"medium"`  // Medium range (can be formula like "{STR}*10")
	Long    string `json:"long"`    // Long range (can be formula like "{STR}*30")
	Extreme string `json:"extreme"` // Extreme range (can be formula like "{STR}*60")
}
