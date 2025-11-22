package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadReferencesFromXML("data/chummerxml/references.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateReferencesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/references_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Total rules: %d\n", len(data.Rules.Rule))
}

func generateReferencesDataCode(data *v5.ReferencesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from references.xml. DO NOT EDIT.\n\n")
	b.WriteString("var referencesData = &ReferencesChummer{\n")

	// Rules
	b.WriteString("\tRules: Rules{\n")
	b.WriteString("\t\tRule: []Rule{\n")
	for _, rule := range data.Rules.Rule {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", rule.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", rule.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", rule.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %d,\n", rule.Page))
		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetReferencesData returns the loaded references data.\n")
	b.WriteString("func GetReferencesData() *ReferencesChummer {\n")
	b.WriteString("\treturn referencesData\n")
	b.WriteString("}\n")

	return b.String()
}

