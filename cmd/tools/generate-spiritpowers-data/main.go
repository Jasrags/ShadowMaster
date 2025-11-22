package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadSpiritPowersFromXML("data/chummerxml/spiritpowers.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateSpiritPowersDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/spiritpowers_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Total spirit powers: %d\n", len(data.Powers.Power))
}

func generateSpiritPowersDataCode(data *v5.SpiritPowersChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from spiritpowers.xml. DO NOT EDIT.\n\n")
	b.WriteString("var spiritPowersData = &SpiritPowersChummer{\n")
	b.WriteString("\tPowers: SpiritPowerItems{\n")
	b.WriteString("\t\tPower: []SpiritPowerItem{\n")

	for _, power := range data.Powers.Power {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", power.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", power.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %q,\n", power.Page))
		b.WriteString("\t\t\t},\n")
	}

	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetSpiritPowersData returns the loaded spirit powers data.\n")
	b.WriteString("func GetSpiritPowersData() *SpiritPowersChummer {\n")
	b.WriteString("\treturn spiritPowersData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllSpiritPowers returns all spirit powers.\n")
	b.WriteString("func GetAllSpiritPowers() []SpiritPowerItem {\n")
	b.WriteString("\treturn spiritPowersData.Powers.Power\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetSpiritPowerByName returns the spirit power with the given name, or nil if not found.\n")
	b.WriteString("func GetSpiritPowerByName(name string) *SpiritPowerItem {\n")
	b.WriteString("\tpowers := GetAllSpiritPowers()\n")
	b.WriteString("\tfor i := range powers {\n")
	b.WriteString("\t\tif powers[i].Name == name {\n")
	b.WriteString("\t\t\treturn &powers[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

