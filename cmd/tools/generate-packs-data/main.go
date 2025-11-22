package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadPacksFromXML("data/chummerxml/packs.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generatePacksDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/packs_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalPacks := 0
	if data.Packs != nil {
		totalPacks = len(data.Packs.Pack)
	}
	fmt.Printf("  Categories: %d, Packs: %d\n",
		len(data.Categories.Category),
		totalPacks)
}

func generatePacksDataCode(data *v5.PacksChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from packs.xml. DO NOT EDIT.\n\n")
	b.WriteString("var packsData = &PacksChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if data.Categories != nil && len(data.Categories.Category) > 0 {
		b.WriteString("\tCategories: &PackCategories{\n")
		b.WriteString("\t\tCategory: []PackCategory{\n")
		for _, cat := range data.Categories.Category {
			b.WriteString("\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t},\n")
		}
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Packs
	if data.Packs != nil && len(data.Packs.Pack) > 0 {
		b.WriteString("\tPacks: &Packs{\n")
		b.WriteString("\t\tPack: []Pack{\n")
		for _, pack := range data.Packs.Pack {
			b.WriteString("\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", pack.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\tCategory: %q,\n", pack.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\tNuyenBP: %d,\n", pack.NuyenBP))

			// Optional fields - simplified (omit complex nested structures)
			if pack.SelectMartialArt != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\tSelectMartialArt: stringPtr(%q),\n", *pack.SelectMartialArt))
			}

			// Complex nested structures - omit for now
			if pack.Armors != nil {
				b.WriteString("\t\t\t\tArmors: &PackArmors{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Attributes != nil {
				b.WriteString("\t\t\t\tAttributes: &PackAttributes{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Biowares != nil {
				b.WriteString("\t\t\t\tBiowares: &PackBiowares{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Cyberwares != nil {
				b.WriteString("\t\t\t\tCyberwares: &PackCyberwares{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Gears != nil {
				b.WriteString("\t\t\t\tGears: &PackGears{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Lifestyles != nil {
				b.WriteString("\t\t\t\tLifestyles: &PackLifestyles{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Powers != nil {
				b.WriteString("\t\t\t\tPowers: &PackPowers{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Programs != nil {
				b.WriteString("\t\t\t\tPrograms: &PackPrograms{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Qualities != nil {
				b.WriteString("\t\t\t\tQualities: &PackQualities{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Skills != nil {
				b.WriteString("\t\t\t\tSkills: &PackSkills{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Spells != nil {
				b.WriteString("\t\t\t\tSpells: &PackSpells{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Spirits != nil {
				b.WriteString("\t\t\t\tSpirits: &PackSpirits{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Vehicles != nil {
				b.WriteString("\t\t\t\tVehicles: &PackVehicles{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}
			if pack.Weapons != nil {
				b.WriteString("\t\t\t\tWeapons: &PackWeapons{},\n")
				b.WriteString("\t\t\t\t// Complex nested structure omitted\n")
			}

			b.WriteString("\t\t\t},\n")
		}
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// Helper function for string pointers\n")
	b.WriteString("func stringPtr(s string) *string { return &s }\n\n")

	b.WriteString("// GetPacksData returns the loaded packs data.\n")
	b.WriteString("func GetPacksData() *PacksChummer {\n")
	b.WriteString("\treturn packsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllPacks returns all packs.\n")
	b.WriteString("func GetAllPacks() []Pack {\n")
	b.WriteString("\tif packsData.Packs == nil {\n")
	b.WriteString("\t\treturn []Pack{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn packsData.Packs.Pack\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetPackByName returns the pack with the given name, or nil if not found.\n")
	b.WriteString("func GetPackByName(name string) *Pack {\n")
	b.WriteString("\tpacks := GetAllPacks()\n")
	b.WriteString("\tfor i := range packs {\n")
	b.WriteString("\t\tif packs[i].Name == name {\n")
	b.WriteString("\t\t\treturn &packs[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

