package v5

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// WeaponConsumable represents a weapon consumable (ammunition, grenades, rockets, etc.)
type WeaponConsumable struct {
	// ID is the unique identifier for the consumable (derived from the map key)
	ID string `json:"id,omitempty"`
	// Name is the consumable name (e.g., "APDS", "Fragmentation Grenade")
	Name string `json:"name,omitempty"`
	// Category is the consumable category (e.g., "Ammunition", "Ballistic Projectile", "Grenade", "Rocket & Missile")
	Category string `json:"category,omitempty"`
	// Description is the full text description of the consumable
	Description string `json:"description,omitempty"`
	// Source is the source book code (e.g., "SR5", "SR5:R&G")
	Source string `json:"source,omitempty"`

	// Base weapon stats (for ammunition that replaces weapon stats)
	// BaseDV is the base damage value (e.g., "8S(e)", "10S")
	BaseDV string `json:"base_dv,omitempty"`
	// BaseAP is the base armor penetration (e.g., "-5", "-4")
	BaseAP string `json:"base_ap,omitempty"`
	// BaseAcc is the base accuracy modifier
	BaseAcc string `json:"base_acc,omitempty"`

	// Modifier stats (for ammunition that modifies weapon stats)
	// ModifierDV is the damage value modifier (e.g., "+1", "+2", "-2S(e)")
	ModifierDV string `json:"modifier_dv,omitempty"`
	// ModifierAP is the armor penetration modifier (e.g., "-1", "+5", "-4")
	ModifierAP string `json:"modifier_ap,omitempty"`
	// ModifierAcc is the accuracy modifier (e.g., "-1", "-2")
	ModifierAcc string `json:"modifier_acc,omitempty"`

	// Direct stats (for grenades, rockets, missiles)
	// DV is the damage value (e.g., "10S", "18P(f)", "24P")
	DV string `json:"dv,omitempty"`
	// AP is the armor penetration (e.g., "-4", "+5", "-4 / -10")
	AP string `json:"ap,omitempty"`
	// Blast is the blast radius/pattern (e.g., "10 m radius", "-1/m", "-2/m")
	Blast string `json:"blast,omitempty"`

	// Availability is the availability rating (e.g., "12F", "6R", "4")
	Availability string `json:"availability,omitempty"`
	// Cost is the cost in nuyen as displayed in the source (e.g., "120", "100", "Rating×2")
	Cost string `json:"cost,omitempty"`
	// QuantityPerPurchase is the number of units included in one purchase (e.g., 10 for ammunition sold in packs of 10, 1 for individual items)
	QuantityPerPurchase int `json:"quantity_per_purchase,omitempty"`
	// UnitType is the type of unit being purchased (e.g., "rounds", "grenades", "rockets", "missiles")
	UnitType string `json:"unit_type,omitempty"`
}

// dataWeaponConsumables is declared in weapon_consumables_data.go

// GetAllWeaponConsumables returns all weapon consumable definitions
func GetAllWeaponConsumables() []WeaponConsumable {
	consumables := make([]WeaponConsumable, 0, len(dataWeaponConsumables))
	for key, c := range dataWeaponConsumables {
		c.ID = key
		consumables = append(consumables, c)
	}
	return consumables
}

// GetWeaponConsumableByName returns the weapon consumable definition with the given name, or nil if not found
func GetWeaponConsumableByName(name string) *WeaponConsumable {
	for key, consumable := range dataWeaponConsumables {
		if consumable.Name == name {
			consumable.ID = key
			return &consumable
		}
	}
	return nil
}

// GetWeaponConsumableByKey returns the weapon consumable definition with the given key, or nil if not found
func GetWeaponConsumableByKey(key string) *WeaponConsumable {
	consumable, ok := dataWeaponConsumables[key]
	if !ok {
		return nil
	}
	consumable.ID = key
	return &consumable
}

// GetWeaponConsumablesByCategory returns all weapon consumables in the given category
func GetWeaponConsumablesByCategory(category string) []WeaponConsumable {
	consumables := make([]WeaponConsumable, 0)
	for key, c := range dataWeaponConsumables {
		if c.Category == category {
			c.ID = key
			consumables = append(consumables, c)
		}
	}
	return consumables
}

// GetQuantityPerPurchase returns the quantity per purchase, defaulting to 1 if not set
func (wc *WeaponConsumable) GetQuantityPerPurchase() int {
	if wc.QuantityPerPurchase <= 0 {
		return 1
	}
	return wc.QuantityPerPurchase
}

// GetUnitType returns the unit type, defaulting to "unit" if not set
func (wc *WeaponConsumable) GetUnitType() string {
	if wc.UnitType == "" {
		return "unit"
	}
	return wc.UnitType
}

// GetCostPerUnit attempts to parse the cost string and calculate cost per unit
// Returns the cost per unit if the cost is a simple numeric value, otherwise returns 0
// For formula-based costs (e.g., "Rating×2¥"), returns 0 as they require additional context
func (wc *WeaponConsumable) GetCostPerUnit() float64 {
	// Remove currency symbol and parse
	costStr := wc.Cost
	if costStr == "" {
		return 0
	}

	// Remove ¥ symbol and commas
	costStr = strings.ReplaceAll(costStr, "¥", "")
	costStr = strings.ReplaceAll(costStr, ",", "")
	costStr = strings.TrimSpace(costStr)

	// Check if it's a formula (contains ×, +, -, Rating, Chemical, etc.)
	if strings.Contains(costStr, "×") || strings.Contains(costStr, "+") ||
		strings.Contains(costStr, "-") || strings.Contains(costStr, "Rating") ||
		strings.Contains(costStr, "Chemical") || strings.Contains(costStr, "Sensor") {
		return 0 // Formula-based cost requires additional context
	}

	// Try to parse as float
	var cost float64
	_, err := fmt.Sscanf(costStr, "%f", &cost)
	if err != nil {
		return 0
	}

	// Calculate cost per unit
	quantity := float64(wc.GetQuantityPerPurchase())
	if quantity <= 0 {
		quantity = 1
	}
	return cost / quantity
}

// CalculatePurchaseCost calculates the total cost for purchasing a given quantity
// For formula-based costs, returns 0 as they require additional context (rating, chemical type, etc.)
func (wc *WeaponConsumable) CalculatePurchaseCost(quantity int) float64 {
	costPerUnit := wc.GetCostPerUnit()
	if costPerUnit == 0 {
		return 0 // Formula-based cost
	}
	return costPerUnit * float64(quantity)
}

// RequiresRating returns true if the cost formula requires a rating value
func (wc *WeaponConsumable) RequiresRating() bool {
	return strings.Contains(wc.Cost, "Rating")
}

// RequiresChemical returns true if the cost formula requires a chemical value
func (wc *WeaponConsumable) RequiresChemical() bool {
	return strings.Contains(wc.Cost, "Chemical")
}

// RequiresSensor returns true if the cost formula requires a sensor rating
func (wc *WeaponConsumable) RequiresSensor() bool {
	return strings.Contains(wc.Cost, "Sensor")
}

// CalculateAvailability calculates the availability given optional parameters
// Supports: "Rating", "(Rating+2)R", "Chemical+2"
func (wc *WeaponConsumable) CalculateAvailability(rating int, chemical int) string {
	avail := wc.Availability
	
	// Handle simple "Rating" case
	if avail == "Rating" {
		return fmt.Sprintf("%d", rating)
	}
	
	// Handle "(Rating+X)R" format
	if strings.Contains(avail, "Rating") {
		return calculateWeaponConsumableFormula(avail, rating, chemical, 0)
	}
	
	// Handle "Chemical+X" format
	if strings.Contains(avail, "Chemical") {
		return calculateWeaponConsumableFormula(avail, rating, chemical, 0)
	}
	
	return avail
}

// CalculateCost calculates the cost given optional parameters
// Supports: "Rating×2", "Rating×20", "Chemical+40", "+Sensor rating×500"
func (wc *WeaponConsumable) CalculateCost(rating int, chemical int, sensorRating int) string {
	cost := wc.Cost
	
	// Handle formulas
	if strings.Contains(cost, "Rating") || strings.Contains(cost, "Chemical") || strings.Contains(cost, "Sensor") {
		return calculateWeaponConsumableFormula(cost, rating, chemical, sensorRating)
	}
	
	return cost
}

// calculateWeaponConsumableFormula parses and calculates formulas for weapon consumables
// Handles formats like:
// - "Rating×2" (multiplication with ×)
// - "(Rating+2)R" (addition)
// - "Chemical+2" (chemical variable)
// - "Chemical+40" (chemical variable with cost)
// - "+Sensor rating×500" (sensor variable)
func calculateWeaponConsumableFormula(formula string, rating int, chemical int, sensorRating int) string {
	result := formula
	
	// Handle Rating*X format (multiplication with * or ×)
	ratingMultRegex := regexp.MustCompile(`(?i)rating\s*[×*]\s*([\d,]+\.?\d*)`)
	if matches := ratingMultRegex.FindStringSubmatch(formula); len(matches) >= 2 {
		multiplierStr := strings.ReplaceAll(matches[1], ",", "")
		multiplier, err := strconv.ParseFloat(multiplierStr, 64)
		if err == nil {
			calculated := float64(rating) * multiplier
			// Extract suffix
			suffix := extractSuffixAfter(formula, matches[0])
			if calculated == float64(int(calculated)) {
				result = fmt.Sprintf("%d%s", int(calculated), suffix)
			} else {
				result = fmt.Sprintf("%.2f%s", calculated, suffix)
			}
		}
	}
	
	// Handle (Rating+X) format (addition)
	ratingAddRegex := regexp.MustCompile(`(?i)\(rating\s*\+\s*(\d+)\)`)
	if matches := ratingAddRegex.FindStringSubmatch(formula); len(matches) >= 2 {
		addend, err := strconv.Atoi(matches[1])
		if err == nil {
			calculated := rating + addend
			// Extract suffix after the closing parenthesis
			afterParen := formula[strings.Index(formula, ")")+1:]
			suffix := extractSuffixAfter(formula, afterParen)
			result = fmt.Sprintf("(%d)%s", calculated, suffix)
		}
	}
	
	// Handle Chemical+X format
	chemicalRegex := regexp.MustCompile(`(?i)chemical\s*\+\s*(\d+)`)
	if matches := chemicalRegex.FindStringSubmatch(formula); len(matches) >= 2 {
		addend, err := strconv.Atoi(matches[1])
		if err == nil {
			calculated := chemical + addend
			// Extract suffix
			suffix := extractSuffixAfter(formula, matches[0])
			result = fmt.Sprintf("%d%s", calculated, suffix)
		}
	}
	
	// Handle Sensor*X format (normalized from "Sensor rating×X")
	sensorRegex := regexp.MustCompile(`(?i)sensor\s*[×*]\s*(\d+)`)
	if matches := sensorRegex.FindStringSubmatch(formula); len(matches) >= 2 {
		multiplier, err := strconv.Atoi(matches[1])
		if err == nil {
			calculated := sensorRating * multiplier
			// Extract prefix and suffix
			prefix := ""
			if strings.HasPrefix(formula, "+") {
				prefix = "+"
			}
			suffix := extractSuffixAfter(formula, matches[0])
			result = fmt.Sprintf("%s%d%s", prefix, calculated, suffix)
		}
	}
	
	return result
}

// extractSuffixAfter extracts suffix characters (R, F, etc.) after a given pattern
func extractSuffixAfter(formula string, pattern string) string {
	suffix := ""
	patternIndex := strings.Index(strings.ToLower(formula), strings.ToLower(pattern))
	if patternIndex >= 0 {
		afterPattern := formula[patternIndex+len(pattern):]
		for _, char := range afterPattern {
			if char == 'R' || char == 'F' || char == '¥' || char == ')' || char == ']' {
				suffix += string(char)
			} else if char == ' ' || char == '×' || char == '*' || char == '+' || char == '-' {
				continue
			} else {
				break
			}
		}
	}
	return suffix
}

