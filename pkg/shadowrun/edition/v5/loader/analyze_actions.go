package loader

import (
	"fmt"
)

// AnalyzeActions loads and analyzes actions.xml
func AnalyzeActions(filePath string) error {
	fmt.Printf("Loading and analyzing: %s\n\n", filePath)

	// Load the file
	data, err := LoadActionsFromXML(filePath)
	if err != nil {
		return fmt.Errorf("error loading file: %w", err)
	}

	fmt.Printf("✓ Successfully loaded actions.xml\n\n")

	// Basic statistics
	fmt.Printf("=== Statistics ===\n")
	fmt.Printf("Version: %s\n", data.Version)
	fmt.Printf("Total Actions: %d\n\n", len(data.Actions.Action))

	// Validate IDs
	fmt.Printf("=== ID Validation ===\n")
	result := NewValidationResult()
	ids := make([]string, 0, len(data.Actions.Action))
	actionsWithTest := 0
	actionsWithBoosts := 0
	actionsWithNeither := 0
	for i, action := range data.Actions.Action {
		ids = append(ids, action.ID)
		ValidateID("action.id", action.ID, result)
		ValidateRequired("action.name", action.Name, result)
		ValidateRequired("action.type", action.Type, result)
		ValidateRequired("action.source", action.Source, result)
		ValidateRequired("action.page", action.Page, result)

		// Check for test or boosts (mutually exclusive)
		hasTest := action.Test != nil
		hasBoosts := action.Boosts != nil
		if hasTest {
			actionsWithTest++
			if action.Test.Dice != "" {
				// Only validate dice if test exists and has dice
			}
		} else if hasBoosts {
			actionsWithBoosts++
		} else {
			actionsWithNeither++
			result.AddError(fmt.Sprintf("action[%d]", i), action.Name, "action must have either test or boosts element")
		}

		// Check for empty IDs
		if action.ID == "" {
			fmt.Printf("  ERROR: Action at index %d has empty ID\n", i)
		}
	}

	// Check for duplicate IDs
	CheckDuplicateIDs(ids, result)

	// Report statistics
	fmt.Printf("Actions with Test: %d\n", actionsWithTest)
	fmt.Printf("Actions with Boosts: %d\n", actionsWithBoosts)
	if actionsWithNeither > 0 {
		fmt.Printf("Actions with Neither: %d (ERROR)\n", actionsWithNeither)
	}
	fmt.Printf("\n")

	// Report issues
	fmt.Printf("Validation Results: %s\n", result.Summary())
	if result.HasErrors() {
		fmt.Printf("\n=== Errors ===\n")
		// Show errors
		for _, err := range result.Errors {
			fmt.Printf("  - %s\n", err)
		}
	}
	if result.HasIssues() && len(result.Warnings) > 0 {
		fmt.Printf("\n=== Warnings ===\n")
		for i, warn := range result.Warnings {
			if i < 10 {
				fmt.Printf("  - %s\n", warn)
			}
		}
		if len(result.Warnings) > 10 {
			fmt.Printf("  ... and %d more warnings\n", len(result.Warnings)-10)
		}
	}

	// Sample data
	fmt.Printf("\n=== Sample Actions (first 5) ===\n")
	max := 5
	if len(data.Actions.Action) < max {
		max = len(data.Actions.Action)
	}
	for i := 0; i < max; i++ {
		action := data.Actions.Action[i]
		fmt.Printf("\n%d. %s (ID: %s)\n", i+1, action.Name, action.ID)
		fmt.Printf("   Type: %s\n", action.Type)
		if action.Category != nil {
			fmt.Printf("   Category: %s\n", *action.Category)
		}
		if action.SpecName != nil {
			fmt.Printf("   SpecName: %s\n", *action.SpecName)
		}
		if action.InitiativeCost != nil {
			fmt.Printf("   InitiativeCost: %d\n", *action.InitiativeCost)
		}
		if action.EdgeCost != nil {
			fmt.Printf("   EdgeCost: %d\n", *action.EdgeCost)
		}
		if action.RequireUnlock != nil {
			fmt.Printf("   RequireUnlock: true\n")
		}
		fmt.Printf("   Source: %s, Page: %s\n", action.Source, action.Page)
		if action.Test != nil {
			fmt.Printf("   Test.Dice: %s\n", action.Test.Dice)
			if action.Test.Limit != nil {
				fmt.Printf("   Test.Limit: %s\n", *action.Test.Limit)
			}
			if action.Test.BonusString != nil {
				fmt.Printf("   Test.BonusString: %s\n", (*action.Test.BonusString)[:min(50, len(*action.Test.BonusString))])
			}
			if action.Test.DefenseLimit != nil {
				fmt.Printf("   Test.DefenseLimit: %s\n", *action.Test.DefenseLimit)
			}
		}
		if action.Boosts != nil {
			fmt.Printf("   Boosts: %d boost(s)\n", len(action.Boosts.Boost))
			for j, boost := range action.Boosts.Boost {
				fmt.Printf("     Boost %d: %s (Duration: %s, DiceBonus: %s)\n", j+1, boost.Name, boost.Duration, boost.DiceBonus)
			}
		}
	}

	// Check for unique action types
	fmt.Printf("\n=== Action Types ===\n")
	typeCount := make(map[string]int)
	for _, action := range data.Actions.Action {
		typeCount[action.Type]++
	}
	for actionType, count := range typeCount {
		fmt.Printf("  %s: %d\n", actionType, count)
	}

	// Check for unique sources
	fmt.Printf("\n=== Source Books ===\n")
	sourceCount := make(map[string]int)
	for _, action := range data.Actions.Action {
		sourceCount[action.Source]++
	}
	for source, count := range sourceCount {
		fmt.Printf("  %s: %d\n", source, count)
	}

	if !result.HasErrors() && len(result.Warnings) == 0 {
		fmt.Printf("\n✓ No issues found!\n")
	}

	return nil
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 || 
		(len(s) > len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || 
		containsHelper(s, substr))))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

