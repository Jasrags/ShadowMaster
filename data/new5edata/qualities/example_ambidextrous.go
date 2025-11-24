package qualities

// This file demonstrates the AMBIDEXTROUS quality structure
// It shows how a simple quality with a fixed cost and a bonus effect is represented

import "fmt"

// ExampleAmbidextrousUsage demonstrates how to use the Ambidextrous quality
func ExampleAmbidextrousUsage() {
	quality := GetAmbidextrous()

	fmt.Printf("Quality: %s\n", quality.Name)
	fmt.Printf("Type: %s\n", quality.Type)
	fmt.Printf("Cost: %d Karma\n", quality.Cost.BaseCost)
	fmt.Printf("Description: %s\n", quality.Description)

	if quality.Bonus != nil && len(quality.Bonus.Ambidextrous) > 0 {
		fmt.Println("Effect: Removes off-hand penalty (-2 dice pool modifier)")
	}
}

// GetAmbidextrous returns the Ambidextrous quality definition
func GetAmbidextrous() Quality {
	for _, q := range dataQualities {
		if q.Name == "Ambidextrous" {
			return q
		}
	}
	return Quality{} // Return zero value if not found
}

// IsAmbidextrous checks if a quality is the Ambidextrous quality
func IsAmbidextrous(q Quality) bool {
	return q.Name == "Ambidextrous"
}
