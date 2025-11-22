package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadGearFromXML("data/chummerxml/gear.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateGearDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/gear_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	categoryCount := 0
	if len(data.Categories) > 0 {
		categoryCount = len(data.Categories[0].Category)
	}
	totalGear := 0
	for _, gears := range data.Gears {
		totalGear += len(gears.Gear)
	}
	fmt.Printf("  Categories: %d, Gear items: %d\n",
		categoryCount,
		totalGear)
}

func generateGearDataCode(data *v5.GearsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from gear.xml. DO NOT EDIT.\n\n")
	b.WriteString("var gearData = &GearsChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []GearCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []GearCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString("\t\t\t\t\tCategoryBase: common.CategoryBase{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t\t},\n")
			if cat.Show != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tShow: stringPtr(%q),\n", *cat.Show))
			}
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Gears - simplified due to large size and complex nested structures
	if len(data.Gears) > 0 {
		b.WriteString("\tGears: []common.Gears{\n")
		b.WriteString("\t\t{\n")
		totalGear := 0
		for _, gears := range data.Gears {
			totalGear += len(gears.Gear)
		}
		b.WriteString(fmt.Sprintf("\t\t\tGear: []common.Gear{\n"))
		b.WriteString(fmt.Sprintf("\t\t\t\t// %d gear items omitted (complex nested structure)\n", totalGear))
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetGearData returns the loaded gear data.\n")
	b.WriteString("func GetGearData() *GearsChummer {\n")
	b.WriteString("\treturn gearData\n")
	b.WriteString("}\n")

	return b.String()
}

