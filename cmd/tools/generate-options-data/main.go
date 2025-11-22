package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadOptionsFromXML("data/chummerxml/options.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateOptionsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/options_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  LimbCounts: %d, PDFArguments: %d, Categories: %d, AvailMap: %d\n",
		len(data.LimbCounts.Limb),
		len(data.PDFArguments.PDFArgument),
		len(data.BlackMarketPipelineCategories.Category),
		len(data.AvailMap.Avail))
}

func generateOptionsDataCode(data *v5.OptionsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from options.xml. DO NOT EDIT.\n\n")
	b.WriteString("var optionsData = &OptionsChummer{\n")

	// LimbCounts
	b.WriteString("\tLimbCounts: LimbCounts{\n")
	b.WriteString("\t\tLimb: []Limb{\n")
	for _, limb := range data.LimbCounts.Limb {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", limb.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tLimbCount: %d,\n", limb.LimbCount))
		b.WriteString(fmt.Sprintf("\t\t\t\tExclude: %q,\n", limb.Exclude))
		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// PDFArguments
	b.WriteString("\tPDFArguments: PDFArguments{\n")
	b.WriteString("\t\tPDFArgument: []PDFArgument{\n")
	for _, arg := range data.PDFArguments.PDFArgument {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", arg.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tValue: %q,\n", escapeString(arg.Value)))
		if arg.AppNames != nil && len(arg.AppNames.AppName) > 0 {
			b.WriteString("\t\t\t\tAppNames: &PDFAppNames{\n")
			b.WriteString("\t\t\t\t\tAppName: []string{\n")
			for _, appName := range arg.AppNames.AppName {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", appName))
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// BlackMarketPipelineCategories
	b.WriteString("\tBlackMarketPipelineCategories: BlackMarketPipelineCategories{\n")
	b.WriteString("\t\tCategory: []string{\n")
	for _, cat := range data.BlackMarketPipelineCategories.Category {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", cat))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// AvailMap
	b.WriteString("\tAvailMap: AvailMap{\n")
	b.WriteString("\t\tAvail: []Avail{\n")
	for _, avail := range data.AvailMap.Avail {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", avail.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tValue: %g,\n", avail.Value))
		b.WriteString(fmt.Sprintf("\t\t\t\tDuration: %d,\n", avail.Duration))
		b.WriteString(fmt.Sprintf("\t\t\t\tInterval: %q,\n", avail.Interval))
		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetOptionsData returns the loaded options data.\n")
	b.WriteString("func GetOptionsData() *OptionsChummer {\n")
	b.WriteString("\treturn optionsData\n")
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

