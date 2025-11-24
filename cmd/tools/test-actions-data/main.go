package main

import (
	"fmt"
	"shadowmaster/pkg/shadowrun/edition/v5"
)

func main() {
	// Test getting the data (now embedded in code)
	data := v5.GetActionsData()
	if data == nil {
		fmt.Printf("Error: data is nil\n")
		return
	}

	fmt.Printf("✓ Successfully loaded actions data\n")
	fmt.Printf("Version: %s\n", data.Version)
	fmt.Printf("Total Actions: %d\n\n", len(data.Actions.Action))

	// Test helper functions
	allActions := v5.GetAllActions()
	fmt.Printf("GetAllActions() returned %d actions\n", len(allActions))

	// Test GetActionByID
	if len(allActions) > 0 {
		firstAction := allActions[0]
		found := v5.GetActionByID(firstAction.ID)
		if found != nil {
			fmt.Printf("✓ GetActionByID found: %s\n", found.Name)
		}
	}

	// Test GetActionsByType
	interruptActions := v5.GetActionsByType("Interrupt")
	fmt.Printf("GetActionsByType(\"Interrupt\") returned %d actions\n", len(interruptActions))

	// Test GetActionsBySource
	sr5Actions := v5.GetActionsBySource("SR5")
	fmt.Printf("GetActionsBySource(\"SR5\") returned %d actions\n", len(sr5Actions))

	// Show a sample action with boosts
	fmt.Printf("\n=== Sample Actions with Boosts ===\n")
	count := 0
	for _, action := range allActions {
		if action.Boosts != nil && count < 2 {
			fmt.Printf("\n%s (Type: %s)\n", action.Name, action.Type)
			fmt.Printf("  Boosts: %d\n", len(action.Boosts.Boost))
			for i, boost := range action.Boosts.Boost {
				fmt.Printf("    %d. %s - %s\n", i+1, boost.Name, boost.Duration)
			}
			count++
		}
	}
}

