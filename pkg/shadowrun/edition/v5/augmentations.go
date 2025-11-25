package v5

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// Cyberware represents a cyberware augmentation
type Cyberware struct {
	// ID is the unique identifier for the cyberware (derived from the map key)
	ID string `json:"id,omitempty"`
	// Part is the body part where the cyberware is installed (e.g., "Head", "Eye", "Ear", "Body", "Limb", "Limb Accessories", "Weapon")
	Part string `json:"part,omitempty"`
	// Device is the name of the cyberware device
	Device string `json:"device,omitempty"`
	// Essence is the essence cost (can be a formula like "Rating * 0.1" or a fixed value like "0.2")
	// Deprecated: Use EssenceFormula instead for structured formula handling
	Essence string `json:"essence,omitempty"`
	// EssenceFormula is the structured essence cost formula (new format)
	EssenceFormula *RatingFormula `json:"essence_formula,omitempty"`
	// Capacity is the capacity cost (can be a formula like "[Rating]" or "[2]", or "-" for no capacity)
	// Deprecated: Use CapacityFormula instead for structured formula handling
	Capacity string `json:"capacity,omitempty"`
	// CapacityFormula is the structured capacity formula (new format)
	CapacityFormula *RatingFormula `json:"capacity_formula,omitempty"`
	// Availability is the availability rating (e.g., "5R", "12F", "Rating * 2")
	// Deprecated: Use AvailabilityFormula instead for structured formula handling
	Availability string `json:"availability,omitempty"`
	// AvailabilityFormula is the structured availability formula (new format)
	AvailabilityFormula *RatingFormula `json:"availability_formula,omitempty"`
	// Cost is the cost in nuyen as displayed in the source (e.g., "1,000", "Rating * 20,000", "Deck Cost + 5,000")
	// Deprecated: Use CostFormula instead for structured formula handling
	Cost string `json:"cost,omitempty"`
	// CostFormula is the structured cost formula (new format)
	CostFormula *CostFormula `json:"cost_formula,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// Bioware represents a bioware augmentation
type Bioware struct {
	// ID is the unique identifier for the bioware (derived from the map key)
	ID string `json:"id,omitempty"`
	// Type is the bioware type (e.g., "Basic", "Cultured")
	Type string `json:"type,omitempty"`
	// Device is the name of the bioware device
	Device string `json:"device,omitempty"`
	// Essence is the essence cost (can be a formula like "Rating * 0.2" or a fixed value like "0.1")
	// Deprecated: Use EssenceFormula instead for structured formula handling
	Essence string `json:"essence,omitempty"`
	// EssenceFormula is the structured essence cost formula (new format)
	EssenceFormula *RatingFormula `json:"essence_formula,omitempty"`
	// Availability is the availability rating (e.g., "4", "12F", "(Rating * 6)F")
	// Deprecated: Use AvailabilityFormula instead for structured formula handling
	Availability string `json:"availability,omitempty"`
	// AvailabilityFormula is the structured availability formula (new format)
	AvailabilityFormula *RatingFormula `json:"availability_formula,omitempty"`
	// Cost is the cost in nuyen as displayed in the source (e.g., "4,000", "Rating * 55,000")
	// Deprecated: Use CostFormula instead for structured formula handling
	Cost string `json:"cost,omitempty"`
	// CostFormula is the structured cost formula (new format)
	CostFormula *CostFormula `json:"cost_formula,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// dataCyberware and dataBioware are declared in augmentations_data.go

// GetAllCyberware returns all cyberware definitions
func GetAllCyberware() []Cyberware {
	cyberware := make([]Cyberware, 0, len(dataCyberware))
	for key, c := range dataCyberware {
		c.ID = key
		cyberware = append(cyberware, c)
	}
	return cyberware
}

// GetCyberwareByName returns the cyberware definition with the given device name, or nil if not found
func GetCyberwareByName(name string) *Cyberware {
	for key, c := range dataCyberware {
		if c.Device == name {
			c.ID = key
			return &c
		}
	}
	return nil
}

// GetCyberwareByKey returns the cyberware definition with the given key, or nil if not found
func GetCyberwareByKey(key string) *Cyberware {
	c, ok := dataCyberware[key]
	if !ok {
		return nil
	}
	c.ID = key
	return &c
}

// GetCyberwareByPart returns all cyberware for the given body part
func GetCyberwareByPart(part string) []Cyberware {
	cyberware := make([]Cyberware, 0)
	for key, c := range dataCyberware {
		if c.Part == part {
			c.ID = key
			cyberware = append(cyberware, c)
		}
	}
	return cyberware
}

// GetAllBioware returns all bioware definitions
func GetAllBioware() []Bioware {
	bioware := make([]Bioware, 0, len(dataBioware))
	for key, b := range dataBioware {
		b.ID = key
		bioware = append(bioware, b)
	}
	return bioware
}

// GetBiowareByName returns the bioware definition with the given device name, or nil if not found
func GetBiowareByName(name string) *Bioware {
	for key, b := range dataBioware {
		if b.Device == name {
			b.ID = key
			return &b
		}
	}
	return nil
}

// GetBiowareByKey returns the bioware definition with the given key, or nil if not found
func GetBiowareByKey(key string) *Bioware {
	b, ok := dataBioware[key]
	if !ok {
		return nil
	}
	b.ID = key
	return &b
}

// GetBiowareByType returns all bioware of the given type (e.g., "Basic", "Cultured")
func GetBiowareByType(biowareType string) []Bioware {
	bioware := make([]Bioware, 0)
	for key, b := range dataBioware {
		if b.Type == biowareType {
			b.ID = key
			bioware = append(bioware, b)
		}
	}
	return bioware
}

// Rating formula parsing helpers
// Supports both formats:
// - Universal format: "Rating*3F", "Rating*5000¥", "(Rating*4)R"
// - Legacy format: "Rating * 3F", "Rating * 5,000¥", "(Rating * 4)R"
var ratingRegex = regexp.MustCompile(`(?i)rating\s*\*\s*([\d,]+\.?\d*)`)

// NormalizeFormula converts a formula string to the universal format
// Universal format: "Rating*MULTIPLIER[SUFFIX]" with no spaces, no commas in multiplier
// Examples:
//   "Rating * 3F" -> "Rating*3F"
//   "Rating * 5,000¥" -> "Rating*5000¥"
//   "(Rating * 4)R" -> "(Rating*4)R"
func NormalizeFormula(formula string) string {
	if !strings.Contains(strings.ToLower(formula), "rating") {
		return formula
	}

	// Normalize spaces around *
	formula = regexp.MustCompile(`(?i)rating\s*\*\s*`).ReplaceAllString(formula, "Rating*")

	// Remove commas from multipliers (they'll be added back during formatting)
	// Match "Rating*" followed by numbers with commas
	commaRegex := regexp.MustCompile(`(?i)(Rating\*)([\d,]+)`)
	formula = commaRegex.ReplaceAllStringFunc(formula, func(match string) string {
		parts := strings.SplitN(match, "*", 2)
		if len(parts) == 2 {
			multiplier := strings.ReplaceAll(parts[1], ",", "")
			return parts[0] + "*" + multiplier
		}
		return match
	})

	return formula
}


// RequiresRating returns true if the field contains a rating formula
func (c *Cyberware) RequiresRating() bool {
	// Check structured formulas first
	if c.EssenceFormula != nil && c.EssenceFormula.RequiresRating() {
		return true
	}
	if c.CapacityFormula != nil && c.CapacityFormula.RequiresRating() {
		return true
	}
	if c.AvailabilityFormula != nil && c.AvailabilityFormula.RequiresRating() {
		return true
	}
	if c.CostFormula != nil && c.CostFormula.RequiresRating() {
		return true
	}
	// Fall back to string-based formulas for backward compatibility
	return strings.Contains(strings.ToLower(c.Availability), "rating") ||
		strings.Contains(strings.ToLower(c.Cost), "rating") ||
		strings.Contains(strings.ToLower(c.Essence), "rating") ||
		strings.Contains(strings.ToLower(c.Capacity), "rating")
}

// Validate validates that the cyberware definition is well-formed
func (c *Cyberware) Validate() error {
	if c.Device == "" {
		return fmt.Errorf("cyberware device name is required")
	}
	// Validate structured formulas if present
	if c.EssenceFormula != nil && !c.EssenceFormula.IsValid() {
		return fmt.Errorf("invalid essence formula")
	}
	if c.CapacityFormula != nil && !c.CapacityFormula.IsValid() {
		return fmt.Errorf("invalid capacity formula")
	}
	if c.AvailabilityFormula != nil && !c.AvailabilityFormula.IsValid() {
		return fmt.Errorf("invalid availability formula")
	}
	if c.CostFormula != nil && !c.CostFormula.IsValid() {
		return fmt.Errorf("invalid cost formula")
	}
	return nil
}

// CalculateAvailability calculates the availability given a rating
// Returns the calculated availability string (e.g., "9F" for rating 3 with "Rating * 3F")
// Returns the original string if it doesn't contain a rating formula
func (c *Cyberware) CalculateAvailability(rating int) string {
	// Use structured formula if available
	if c.AvailabilityFormula != nil {
		result, err := c.AvailabilityFormula.Calculate(rating)
		if err == nil {
			return fmt.Sprintf("%.0f", result)
		}
	}
	// Fall back to string-based formula for backward compatibility
	return calculateRatingFormula(c.Availability, rating)
}

// CalculateCost calculates the cost given a rating
// Returns the calculated cost string (e.g., "15,000" for rating 3 with "Rating * 5,000")
// Returns the original string if it doesn't contain a rating formula
func (c *Cyberware) CalculateCost(rating int) string {
	// Use structured formula if available
	if c.CostFormula != nil {
		cost, err := c.CostFormula.Calculate(rating)
		if err == nil {
			// Format with commas if >= 1000
			if cost >= 1000 {
				return FormatCostWithCommas(cost)
			}
			return fmt.Sprintf("%d", cost)
		}
	}
	// Fall back to string-based formula for backward compatibility
	return calculateRatingFormula(c.Cost, rating)
}

// CalculateEssence calculates the essence cost given a rating
// Returns the calculated essence string (e.g., "0.3" for rating 3 with "Rating * 0.1")
// Returns the original string if it doesn't contain a rating formula
func (c *Cyberware) CalculateEssence(rating int) string {
	// Use structured formula if available
	if c.EssenceFormula != nil {
		result, err := c.EssenceFormula.Calculate(rating)
		if err == nil {
			// Format to remove trailing zeros
			resultStr := fmt.Sprintf("%.2f", result)
			resultStr = strings.TrimRight(resultStr, "0")
			resultStr = strings.TrimRight(resultStr, ".")
			return resultStr
		}
	}
	// Fall back to string-based formula for backward compatibility
	return calculateRatingFormula(c.Essence, rating)
}

// CalculateCapacity calculates the capacity cost given a rating
// Returns the calculated capacity string (e.g., "[3]" for rating 3 with "[Rating]")
// Returns the original string if it doesn't contain a rating formula
func (c *Cyberware) CalculateCapacity(rating int) string {
	capacity := c.Capacity
	if strings.Contains(strings.ToLower(capacity), "rating") {
		// Handle [Rating] format
		if strings.HasPrefix(capacity, "[") && strings.HasSuffix(capacity, "]") {
			return fmt.Sprintf("[%d]", rating)
		}
		// Handle Rating * X format
		return calculateRatingFormula(capacity, rating)
	}
	return capacity
}

// calculateRatingFormula parses and calculates a formula containing "Rating * X"
// Handles formats like "Rating * 3F", "Rating * 5,000", "(Rating * 4)R", etc.
func calculateRatingFormula(formula string, rating int) string {
	if !strings.Contains(strings.ToLower(formula), "rating") {
		return formula
	}

	// Extract the multiplier and suffix
	matches := ratingRegex.FindStringSubmatch(formula)
	if len(matches) < 2 {
		return formula
	}

	multiplierStr := strings.ReplaceAll(matches[1], ",", "")
	multiplier, err := strconv.ParseFloat(multiplierStr, 64)
	if err != nil {
		return formula
	}

	// Calculate the result
	result := float64(rating) * multiplier

	// Extract suffix (R, F, ¥, etc.) - everything after the number
	suffix := ""
	// Find the multiplier in the original formula (with commas)
	multiplierPattern := matches[0] // Full match like "Rating * 5,000"
	multiplierIndex := strings.Index(strings.ToLower(formula), strings.ToLower(multiplierPattern))
	if multiplierIndex >= 0 {
		afterMultiplier := formula[multiplierIndex+len(multiplierPattern):]
		// Extract any suffix characters (R, F, parentheses, etc.)
		for _, char := range afterMultiplier {
			if char == 'R' || char == 'F' || char == '¥' || char == ')' || char == ']' {
				suffix += string(char)
			} else if char == ' ' || char == '*' {
				continue
			} else {
				break
			}
		}
	}

	// Check for parentheses prefix
	prefix := ""
	if strings.HasPrefix(formula, "(") {
		prefix = "("
		suffix = ")" + suffix
	}

	// Format the result
	if result == float64(int(result)) {
		// Integer result - format with commas if >= 1000
		resultInt := int(result)
		if resultInt >= 1000 {
			// Format with commas
			resultStr := strconv.Itoa(resultInt)
			// Add commas every 3 digits from right
			n := len(resultStr)
			if n > 3 {
				var parts []string
				for n > 3 {
					parts = append([]string{resultStr[n-3:]}, parts...)
					resultStr = resultStr[:n-3]
					n = len(resultStr)
				}
				if n > 0 {
					parts = append([]string{resultStr}, parts...)
				}
				resultStr = strings.Join(parts, ",")
			}
			return fmt.Sprintf("%s%s%s", prefix, resultStr, suffix)
		}
		return fmt.Sprintf("%s%d%s", prefix, resultInt, suffix)
	}
	// Float result - format to 2 decimal places, but remove trailing zeros
	resultStr := fmt.Sprintf("%.2f", result)
	resultStr = strings.TrimRight(resultStr, "0")
	resultStr = strings.TrimRight(resultStr, ".")
	return fmt.Sprintf("%s%s%s", prefix, resultStr, suffix)
}

// RequiresRating returns true if the field contains a rating formula
func (b *Bioware) RequiresRating() bool {
	// Check structured formulas first
	if b.EssenceFormula != nil && b.EssenceFormula.RequiresRating() {
		return true
	}
	if b.AvailabilityFormula != nil && b.AvailabilityFormula.RequiresRating() {
		return true
	}
	if b.CostFormula != nil && b.CostFormula.RequiresRating() {
		return true
	}
	// Fall back to string-based formulas for backward compatibility
	return strings.Contains(strings.ToLower(b.Availability), "rating") ||
		strings.Contains(strings.ToLower(b.Cost), "rating") ||
		strings.Contains(strings.ToLower(b.Essence), "rating")
}

// Validate validates that the bioware definition is well-formed
func (b *Bioware) Validate() error {
	if b.Device == "" {
		return fmt.Errorf("bioware device name is required")
	}
	// Validate structured formulas if present
	if b.EssenceFormula != nil && !b.EssenceFormula.IsValid() {
		return fmt.Errorf("invalid essence formula")
	}
	if b.AvailabilityFormula != nil && !b.AvailabilityFormula.IsValid() {
		return fmt.Errorf("invalid availability formula")
	}
	if b.CostFormula != nil && !b.CostFormula.IsValid() {
		return fmt.Errorf("invalid cost formula")
	}
	return nil
}

// CalculateAvailability calculates the availability given a rating
// Returns the calculated availability string (e.g., "9F" for rating 3 with "Rating * 3F")
// Returns the original string if it doesn't contain a rating formula
func (b *Bioware) CalculateAvailability(rating int) string {
	// Use structured formula if available
	if b.AvailabilityFormula != nil {
		result, err := b.AvailabilityFormula.Calculate(rating)
		if err == nil {
			return fmt.Sprintf("%.0f", result)
		}
	}
	// Fall back to string-based formula for backward compatibility
	return calculateRatingFormula(b.Availability, rating)
}

// CalculateCost calculates the cost given a rating
// Returns the calculated cost string (e.g., "15,000" for rating 3 with "Rating * 5,000")
// Returns the original string if it doesn't contain a rating formula
func (b *Bioware) CalculateCost(rating int) string {
	// Use structured formula if available
	if b.CostFormula != nil {
		cost, err := b.CostFormula.Calculate(rating)
		if err == nil {
			// Format with commas if >= 1000
			if cost >= 1000 {
				return FormatCostWithCommas(cost)
			}
			return fmt.Sprintf("%d", cost)
		}
	}
	// Fall back to string-based formula for backward compatibility
	return calculateRatingFormula(b.Cost, rating)
}

// CalculateEssence calculates the essence cost given a rating
// Returns the calculated essence string (e.g., "0.6" for rating 3 with "Rating * 0.2")
// Returns the original string if it doesn't contain a rating formula
func (b *Bioware) CalculateEssence(rating int) string {
	// Use structured formula if available
	if b.EssenceFormula != nil {
		result, err := b.EssenceFormula.Calculate(rating)
		if err == nil {
			// Format to remove trailing zeros
			resultStr := fmt.Sprintf("%.2f", result)
			resultStr = strings.TrimRight(resultStr, "0")
			resultStr = strings.TrimRight(resultStr, ".")
			return resultStr
		}
	}
	// Fall back to string-based formula for backward compatibility
	return calculateRatingFormula(b.Essence, rating)
}
