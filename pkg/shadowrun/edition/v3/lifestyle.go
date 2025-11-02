package v3

// LifestyleLevels contains all available lifestyle levels
var LifestyleLevels = []string{
	"Street",
	"Squatter",
	"Low",
	"Middle",
	"High",
	"Luxury",
}

// GetLifestyleCost returns the monthly cost in nuyen for a lifestyle
// Based on Starting Character Extras Table
func GetLifestyleCost(lifestyle string) int {
	switch lifestyle {
	case "Street":
		return 0
	case "Squatter":
		return 100
	case "Low":
		return 1000
	case "Middle":
		return 5000
	case "High":
		return 10000
	case "Luxury":
		return 100000
	default:
		return 0
	}
}

