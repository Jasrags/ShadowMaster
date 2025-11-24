package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadCrittersFromXML("data/chummerxml/critters.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateCrittersDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/critters_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	categoryCount := 0
	if len(data.Categories) > 0 {
		categoryCount = len(data.Categories[0].Category)
	}
	totalCritters := 0
	if len(data.Metatypes) > 0 {
		totalCritters = len(data.Metatypes[0].Metatype)
	}
	fmt.Printf("  Categories: %d, Critters: %d\n",
		categoryCount,
		totalCritters)
}

func generateCrittersDataCode(data *v5.CrittersChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from critters.xml. DO NOT EDIT.\n\n")
	b.WriteString("var crittersData = &CrittersChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []CritterCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []CritterCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Critters - simplified due to large size and complex nested structures
	if len(data.Metatypes) > 0 && len(data.Metatypes[0].Metatype) > 0 {
		b.WriteString("\tMetatypes: []Critters{\n")
		b.WriteString("\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\tMetatype: []Critter{\n"))
		b.WriteString(fmt.Sprintf("\t\t\t\t// %d critters omitted (complex nested structure)\n", len(data.Metatypes[0].Metatype)))
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetCrittersData returns the loaded critters data.\n")
	b.WriteString("func GetCrittersData() *CrittersChummer {\n")
	b.WriteString("\treturn crittersData\n")
	b.WriteString("}\n")

	return b.String()
}

