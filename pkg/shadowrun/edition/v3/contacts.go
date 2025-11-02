package v3

// ContactTypes contains common contact types in Shadowrun 3rd Edition
var ContactTypes = []string{
	"Fixer",
	"Dealer",
	"Street Doc",
	"Bartender",
	"Information Broker",
	"Corporate",
	"Gang",
	"Law Enforcement",
	"Media",
	"Smuggler",
	"Talislegger",
	"General",
}

// GetContactCost returns the cost in nuyen for a contact at the given level
// Based on Starting Character Extras Table
func GetContactCost(level int) int {
	switch level {
	case 1:
		return 5000 // Contact (level 1)
	case 2:
		return 10000 // Buddy (Level 2)
	case 3:
		return 200000 // Friend for life (Level 3)
	default:
		return 0
	}
}

// ContactLevelNames maps contact levels to their names
var ContactLevelNames = map[int]string{
	1: "Contact",
	2: "Buddy",
	3: "Friend for life",
}

