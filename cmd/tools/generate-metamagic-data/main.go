package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadMetamagicFromXML("data/chummerxml/metamagic.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateMetamagicDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/metamagic_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalMetamagics := 0
	for _, metamagics := range data.Metamagics {
		totalMetamagics += len(metamagics.Metamagic)
	}
	fmt.Printf("  Total metamagics: %d\n", totalMetamagics)
}

func generateMetamagicDataCode(data *v5.MetamagicChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from metamagic.xml. DO NOT EDIT.\n\n")
	b.WriteString("var metamagicData = &MetamagicChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Metamagics
	b.WriteString("\tMetamagics: []MetamagicItems{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tMetamagic: []MetamagicItem{\n")

	allMetamagics := make([]v5.MetamagicItem, 0)
	for _, metamagics := range data.Metamagics {
		allMetamagics = append(allMetamagics, metamagics.Metamagic...)
	}

	for _, mm := range allMetamagics {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", mm.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", mm.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tAdept: %q,\n", mm.Adept))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tMagician: %q,\n", mm.Magician))

		// Embedded SourceReference
		b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", mm.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", mm.Page))
		b.WriteString("\t\t\t\t\t},\n")

		// Embedded Visibility
		if mm.Hide != nil || mm.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
			if mm.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *mm.Hide))
			}
			if mm.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *mm.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		if mm.Limit != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tLimit: stringPtr(%q),\n", *mm.Limit))
		}

		// Optional Bonus
		if mm.Bonus != nil {
			b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{},\n")
		}

		// Optional Required
		if mm.Required != nil {
			b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
		}

		// Optional Forbidden
		if mm.Forbidden != nil {
			b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
		}

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetMetamagicData returns the loaded metamagic data.\n")
	b.WriteString("func GetMetamagicData() *MetamagicChummer {\n")
	b.WriteString("\treturn metamagicData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllMetamagics returns all metamagics.\n")
	b.WriteString("func GetAllMetamagics() []MetamagicItem {\n")
	b.WriteString("\tif len(metamagicData.Metamagics) == 0 {\n")
	b.WriteString("\t\treturn []MetamagicItem{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn metamagicData.Metamagics[0].Metamagic\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetMetamagicByID returns the metamagic with the given ID, or nil if not found.\n")
	b.WriteString("func GetMetamagicByID(id string) *MetamagicItem {\n")
	b.WriteString("\tmetamagics := GetAllMetamagics()\n")
	b.WriteString("\tfor i := range metamagics {\n")
	b.WriteString("\t\tif metamagics[i].ID == id {\n")
	b.WriteString("\t\t\treturn &metamagics[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

