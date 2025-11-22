package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	// Load the XML data
	data, err := loader.LoadActionsFromXML("data/chummerxml/actions.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	// Generate Go code
	code := generateActionsDataCode(data)

	// Write to file
	outputPath := "pkg/shadowrun/edition/v5/actions_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Total actions: %d\n", len(data.Actions.Action))
}

func generateActionsDataCode(data *v5.ActionsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from actions.xml. DO NOT EDIT.\n\n")
	b.WriteString("var actionsData = &ActionsChummer{\n")
	b.WriteString(fmt.Sprintf("\tVersion: %q,\n", data.Version))
	b.WriteString("\tActions: Actions{\n")
	b.WriteString("\t\tAction: []Action{\n")

	for i, action := range data.Actions.Action {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", action.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", action.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tType: %q,\n", action.Type))

		if action.Category != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tCategory: stringPtr(%q),\n", *action.Category))
		}
		if action.SpecName != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tSpecName: stringPtr(%q),\n", *action.SpecName))
		}
		if action.InitiativeCost != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tInitiativeCost: intPtr(%d),\n", *action.InitiativeCost))
		}
		if action.EdgeCost != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tEdgeCost: intPtr(%d),\n", *action.EdgeCost))
		}
		if action.RequireUnlock != nil {
			b.WriteString("\t\t\t\tRequireUnlock: stringPtr(\"\"),\n")
		}

		if action.Test != nil {
			b.WriteString("\t\t\t\tTest: &ActionTest{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tDice: %q,\n", action.Test.Dice))
			if action.Test.Limit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tLimit: stringPtr(%q),\n", *action.Test.Limit))
			}
			if action.Test.BonusString != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tBonusString: stringPtr(%q),\n", escapeString(*action.Test.BonusString)))
			}
			if action.Test.DefenseLimit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDefenseLimit: stringPtr(%q),\n", *action.Test.DefenseLimit))
			}
			b.WriteString("\t\t\t\t},\n")
		}

		if action.Boosts != nil {
			b.WriteString("\t\t\t\tBoosts: &ActionBoosts{\n")
			b.WriteString("\t\t\t\t\tBoost: []ActionBoost{\n")
			for _, boost := range action.Boosts.Boost {
				b.WriteString("\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tName: %q,\n", boost.Name))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tDuration: %q,\n", boost.Duration))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tDiceBonus: %q,\n", boost.DiceBonus))
				if boost.AddLimit != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tAddLimit: stringPtr(%q),\n", *boost.AddLimit))
				}
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", action.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %q,\n", action.Page))
		b.WriteString("\t\t\t},\n")
	}

	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	// Add helper functions
	b.WriteString("// Helper functions for pointer creation\n")
	b.WriteString("func stringPtr(s string) *string { return &s }\n")
	b.WriteString("func intPtr(i int) *int { return &i }\n\n")

	// Add accessor functions
	b.WriteString("// GetActionsData returns the loaded actions data.\n")
	b.WriteString("func GetActionsData() *ActionsChummer {\n")
	b.WriteString("\treturn actionsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllActions returns the list of all actions.\n")
	b.WriteString("func GetAllActions() []Action {\n")
	b.WriteString("\treturn actionsData.Actions.Action\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetActionByID returns the action with the given ID, or nil if not found.\n")
	b.WriteString("func GetActionByID(id string) *Action {\n")
	b.WriteString("\tactions := GetAllActions()\n")
	b.WriteString("\tfor i := range actions {\n")
	b.WriteString("\t\tif actions[i].ID == id {\n")
	b.WriteString("\t\t\treturn &actions[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetActionsByType returns all actions of the given type.\n")
	b.WriteString("func GetActionsByType(actionType string) []Action {\n")
	b.WriteString("\tactions := GetAllActions()\n")
	b.WriteString("\tresult := make([]Action, 0)\n")
	b.WriteString("\tfor i := range actions {\n")
	b.WriteString("\t\tif actions[i].Type == actionType {\n")
	b.WriteString("\t\t\tresult = append(result, actions[i])\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn result\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetActionsBySource returns all actions from the given source book.\n")
	b.WriteString("func GetActionsBySource(source string) []Action {\n")
	b.WriteString("\tactions := GetAllActions()\n")
	b.WriteString("\tresult := make([]Action, 0)\n")
	b.WriteString("\tfor i := range actions {\n")
	b.WriteString("\t\tif actions[i].Source == source {\n")
	b.WriteString("\t\t\tresult = append(result, actions[i])\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn result\n")
	b.WriteString("}\n")

	return b.String()
}

func escapeString(s string) string {
	// Escape backticks and other special characters that might break Go string literals
	s = strings.ReplaceAll(s, "\\", "\\\\")
	s = strings.ReplaceAll(s, "\"", "\\\"")
	s = strings.ReplaceAll(s, "\n", "\\n")
	s = strings.ReplaceAll(s, "\r", "\\r")
	s = strings.ReplaceAll(s, "\t", "\\t")
	return s
}

