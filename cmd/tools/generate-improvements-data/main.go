package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadImprovementsFromXML("data/chummerxml/improvements.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateImprovementsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/improvements_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Improvements: %d\n", len(data.Improvements.Improvement))
}

func generateImprovementsDataCode(data *v5.ImprovementsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from improvements.xml. DO NOT EDIT.\n\n")
	b.WriteString("var improvementsData = &ImprovementsChummer{\n")

	// Improvements
	b.WriteString("\tImprovements: ImprovementItems{\n")
	b.WriteString("\t\tImprovement: []ImprovementItem{\n")
	for _, imp := range data.Improvements.Improvement {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", imp.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", imp.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tInternal: %q,\n", imp.Internal))

		// Fields
		if imp.Fields != nil && len(imp.Fields.Field) > 0 {
			b.WriteString("\t\t\t\tFields: &ImprovementFields{\n")
			b.WriteString("\t\t\t\t\tField: []string{\n")
			for _, field := range imp.Fields.Field {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", field))
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		if imp.XML != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tXML: stringPtr(%q),\n", escapeString(*imp.XML)))
		}
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %q,\n", escapeString(imp.Page)))

		b.WriteString("\t\t\t},\n")
	}

	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetImprovementsData returns the loaded improvements data.\n")
	b.WriteString("func GetImprovementsData() *ImprovementsChummer {\n")
	b.WriteString("\treturn improvementsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllImprovements returns all improvements.\n")
	b.WriteString("func GetAllImprovements() []ImprovementItem {\n")
	b.WriteString("\treturn improvementsData.Improvements.Improvement\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetImprovementByID returns the improvement with the given ID, or nil if not found.\n")
	b.WriteString("func GetImprovementByID(id string) *ImprovementItem {\n")
	b.WriteString("\timprovements := GetAllImprovements()\n")
	b.WriteString("\tfor i := range improvements {\n")
	b.WriteString("\t\tif improvements[i].ID == id {\n")
	b.WriteString("\t\t\treturn &improvements[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

func escapeString(s string) string {
	s = strings.ReplaceAll(s, "\\", "\\\\")
	s = strings.ReplaceAll(s, "\"", "\\\"")
	s = strings.ReplaceAll(s, "\n", "\\n")
	s = strings.ReplaceAll(s, "\r", "\\r")
	s = strings.ReplaceAll(s, "\t", "\\t")
	return s
}

