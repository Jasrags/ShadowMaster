package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadRangesFromXML("data/chummerxml/ranges.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateRangesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/ranges_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalRanges := 0
	for _, ranges := range data.Ranges {
		totalRanges += len(ranges.Range)
	}
	fmt.Printf("  Total ranges: %d\n", totalRanges)
}

func generateRangesDataCode(data *v5.RangesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from ranges.xml. DO NOT EDIT.\n\n")
	b.WriteString("var rangesData = &RangesChummer{\n")

	// Modifiers
	b.WriteString("\tModifiers: RangeModifiers{\n")
	if data.Modifiers.Short != nil {
		b.WriteString(fmt.Sprintf("\t\tShort: stringPtr(%q),\n", *data.Modifiers.Short))
	}
	if data.Modifiers.Medium != nil {
		b.WriteString(fmt.Sprintf("\t\tMedium: stringPtr(%q),\n", *data.Modifiers.Medium))
	}
	if data.Modifiers.Long != nil {
		b.WriteString(fmt.Sprintf("\t\tLong: stringPtr(%q),\n", *data.Modifiers.Long))
	}
	if data.Modifiers.Extreme != nil {
		b.WriteString(fmt.Sprintf("\t\tExtreme: stringPtr(%q),\n", *data.Modifiers.Extreme))
	}
	b.WriteString("\t},\n")

	// Ranges
	b.WriteString("\tRanges: []Ranges{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tRange: []Range{\n")

	// Flatten all ranges
	allRanges := make([]v5.Range, 0)
	for _, ranges := range data.Ranges {
		allRanges = append(allRanges, ranges.Range...)
	}

	for _, r := range allRanges {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", r.Name))

		if r.Min != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tMin: stringPtr(%q),\n", *r.Min))
		}
		if r.Short != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tShort: stringPtr(%q),\n", *r.Short))
		}
		if r.Medium != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tMedium: stringPtr(%q),\n", *r.Medium))
		}
		if r.Long != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tLong: stringPtr(%q),\n", *r.Long))
		}
		if r.Extreme != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tExtreme: stringPtr(%q),\n", *r.Extreme))
		}

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetRangesData returns the loaded ranges data.\n")
	b.WriteString("func GetRangesData() *RangesChummer {\n")
	b.WriteString("\treturn rangesData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllRanges returns all range definitions.\n")
	b.WriteString("func GetAllRanges() []Range {\n")
	b.WriteString("\tif len(rangesData.Ranges) == 0 {\n")
	b.WriteString("\t\treturn []Range{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn rangesData.Ranges[0].Range\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetRangeByName returns the range with the given name, or nil if not found.\n")
	b.WriteString("func GetRangeByName(name string) *Range {\n")
	b.WriteString("\tranges := GetAllRanges()\n")
	b.WriteString("\tfor i := range ranges {\n")
	b.WriteString("\t\tif ranges[i].Name == name {\n")
	b.WriteString("\t\t\treturn &ranges[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

