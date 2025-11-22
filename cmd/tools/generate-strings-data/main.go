package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadStringsFromXML("data/chummerxml/strings.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateStringsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/strings_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
}

func generateStringsDataCode(data *v5.StringsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from strings.xml. DO NOT EDIT.\n\n")
	b.WriteString("var stringsData = &StringsChummer{\n")

	b.WriteString("\tMatrixAttributes: MatrixAttributes{\n")
	b.WriteString("\t\tKey: []string{\n")
	for _, key := range data.MatrixAttributes.Key {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", key))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("\tElements: Elements{\n")
	b.WriteString("\t\tElement: []string{\n")
	for _, element := range data.Elements.Element {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", element))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("\tImmunities: Immunities{\n")
	b.WriteString("\t\tImmunity: []string{\n")
	for _, immunity := range data.Immunities.Immunity {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", immunity))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("\tSpiritCategories: SpiritCategories{\n")
	b.WriteString("\t\tCategory: []string{\n")
	for _, category := range data.SpiritCategories.Category {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", category))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetStringsData returns the loaded strings data.\n")
	b.WriteString("func GetStringsData() *StringsChummer {\n")
	b.WriteString("\treturn stringsData\n")
	b.WriteString("}\n")

	return b.String()
}

