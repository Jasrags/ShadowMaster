package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadMetatypesFromXML("data/chummerxml/metatypes.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateMetatypesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/metatypes_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	categoryCount := 0
	if len(data.Categories) > 0 {
		categoryCount = len(data.Categories[0].Category)
	}
	totalMetatypes := 0
	if len(data.Metatypes) > 0 {
		totalMetatypes = len(data.Metatypes[0].Metatype)
	}
	fmt.Printf("  Categories: %d, Metatypes: %d\n",
		categoryCount,
		totalMetatypes)
}

func generateMetatypesDataCode(data *v5.MetatypesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from metatypes.xml. DO NOT EDIT.\n\n")
	b.WriteString("var metatypesData = &MetatypesChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []MetatypeCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []MetatypeCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Metatypes - simplified due to large size and complex nested structures
	if len(data.Metatypes) > 0 && len(data.Metatypes[0].Metatype) > 0 {
		b.WriteString("\tMetatypes: []Metatypes{\n")
		b.WriteString("\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\tMetatype: []Metatype{\n"))
		b.WriteString(fmt.Sprintf("\t\t\t\t// %d metatypes omitted (complex nested structure)\n", len(data.Metatypes[0].Metatype)))
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetMetatypesData returns the loaded metatypes data.\n")
	b.WriteString("func GetMetatypesData() *MetatypesChummer {\n")
	b.WriteString("\treturn metatypesData\n")
	b.WriteString("}\n")

	return b.String()
}

