package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadStreamsFromXML("data/chummerxml/streams.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateStreamsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/streams_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalTraditions := 0
	for _, traditions := range data.Traditions {
		totalTraditions += len(traditions.Tradition)
	}
	fmt.Printf("  Traditions: %d, Spirits: %d\n", totalTraditions, len(data.Spirits.Spirit))
}

func generateStreamsDataCode(data *v5.StreamsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from streams.xml. DO NOT EDIT.\n\n")
	b.WriteString("var streamsData = &StreamsChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Traditions
	if len(data.Traditions) > 0 {
		b.WriteString("\tTraditions: []Streams{\n")
		for _, traditions := range data.Traditions {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tTradition: []Stream{\n")
			for _, stream := range traditions.Tradition {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", stream.ID))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", stream.Name))
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDrain: %q,\n", stream.Drain))

				// Embedded Visibility
				if stream.Hide != nil || stream.IgnoreSourceDisabled != nil {
					b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
					if stream.Hide != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *stream.Hide))
					}
					if stream.IgnoreSourceDisabled != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *stream.IgnoreSourceDisabled))
					}
					b.WriteString("\t\t\t\t\t},\n")
				}

				// Optional Bonus
				if stream.Bonus != nil {
					b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{},\n")
				}

				// Optional Spirits
				if stream.Spirits != nil && len(stream.Spirits.Spirit) > 0 {
					b.WriteString("\t\t\t\t\tSpirits: &StreamSpirits{\n")
					b.WriteString("\t\t\t\t\t\tSpirit: []StreamSpirit{\n")
					for _, spirit := range stream.Spirits.Spirit {
						b.WriteString("\t\t\t\t\t\t\t{\n")
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", spirit.Content))
						b.WriteString("\t\t\t\t\t\t\t},\n")
					}
					b.WriteString("\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t},\n")
				}

				// Embedded SourceReference
				b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", stream.Source))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", stream.Page))
				b.WriteString("\t\t\t\t\t},\n")

				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	// Spirits
	b.WriteString("\tSpirits: StreamSpiritsContainer{\n")
	b.WriteString("\t\tSpirit: []StreamSpiritItem{\n")
	for _, spirit := range data.Spirits.Spirit {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", spirit.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", spirit.Name))

		// Embedded Visibility
		if spirit.Hide != nil || spirit.IgnoreSourceDisabled != nil {
			b.WriteString("\t\t\t\tVisibility: common.Visibility{\n")
			if spirit.Hide != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tHide: stringPtr(%q),\n", *spirit.Hide))
			}
			if spirit.IgnoreSourceDisabled != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *spirit.IgnoreSourceDisabled))
			}
			b.WriteString("\t\t\t\t},\n")
		}

		b.WriteString(fmt.Sprintf("\t\t\t\tBod: %q,\n", spirit.Bod))
		b.WriteString(fmt.Sprintf("\t\t\t\tAgi: %q,\n", spirit.Agi))
		b.WriteString(fmt.Sprintf("\t\t\t\tRea: %q,\n", spirit.Rea))
		b.WriteString(fmt.Sprintf("\t\t\t\tStr: %q,\n", spirit.Str))
		b.WriteString(fmt.Sprintf("\t\t\t\tCha: %q,\n", spirit.Cha))
		b.WriteString(fmt.Sprintf("\t\t\t\tInt: %q,\n", spirit.Int))
		b.WriteString(fmt.Sprintf("\t\t\t\tLog: %q,\n", spirit.Log))
		b.WriteString(fmt.Sprintf("\t\t\t\tWil: %q,\n", spirit.Wil))
		b.WriteString(fmt.Sprintf("\t\t\t\tIni: %q,\n", spirit.Ini))

		if spirit.Edg != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tEdg: stringPtr(%q),\n", *spirit.Edg))
		}
		if spirit.Mag != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tMag: stringPtr(%q),\n", *spirit.Mag))
		}
		if spirit.Res != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tRes: uint8Ptr(%d),\n", *spirit.Res))
		}
		if spirit.Dep != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tDep: uint8Ptr(%d),\n", *spirit.Dep))
		}
		if spirit.Ess != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tEss: stringPtr(%q),\n", *spirit.Ess))
		}

		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", spirit.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %d,\n", spirit.Page))

		// Optional Bonus
		if spirit.Bonus != nil {
			b.WriteString("\t\t\t\tBonus: &StreamSpiritBonus{},\n")
		}

		// Optional OptionalPowers
		if spirit.OptionalPowers != nil && len(spirit.OptionalPowers.Power) > 0 {
			b.WriteString("\t\t\t\tOptionalPowers: &StreamSpiritOptionalPowers{\n")
			b.WriteString("\t\t\t\t\tPower: []string{\n")
			for _, power := range spirit.OptionalPowers.Power {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", power))
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		// Powers (required)
		b.WriteString("\t\t\t\tPowers: StreamSpiritPowers{\n")
		b.WriteString("\t\t\t\t\tPower: []StreamSpiritPower{\n")
		for _, power := range spirit.Powers.Power {
			b.WriteString("\t\t\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tContent: %q,\n", power.Content))
			if power.Select != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *power.Select))
			}
			b.WriteString("\t\t\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t\t\t},\n")
		b.WriteString("\t\t\t\t},\n")

		// Skills (required)
		b.WriteString("\t\t\t\tSkills: StreamSpiritSkills{\n")
		b.WriteString("\t\t\t\t\tSkill: []StreamSpiritSkill{\n")
		for _, skill := range spirit.Skills.Skill {
			b.WriteString("\t\t\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tContent: %q,\n", skill.Content))
			if skill.Attr != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tAttr: stringPtr(%q),\n", *skill.Attr))
			}
			b.WriteString("\t\t\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t\t\t},\n")
		b.WriteString("\t\t\t\t},\n")

		// Optional Weaknesses
		if spirit.Weaknesses != nil && len(spirit.Weaknesses.Weakness) > 0 {
			b.WriteString("\t\t\t\tWeaknesses: &StreamWeaknesses{\n")
			b.WriteString("\t\t\t\t\tWeakness: []string{\n")
			for _, weakness := range spirit.Weaknesses.Weakness {
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", weakness))
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// Helper function for uint8 pointers\n")
	b.WriteString("func uint8Ptr(u uint8) *uint8 { return &u }\n\n")

	b.WriteString("// GetStreamsData returns the loaded streams data.\n")
	b.WriteString("func GetStreamsData() *StreamsChummer {\n")
	b.WriteString("\treturn streamsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllStreamTraditions returns all stream traditions.\n")
	b.WriteString("func GetAllStreamTraditions() []Stream {\n")
	b.WriteString("\tif len(streamsData.Traditions) == 0 {\n")
	b.WriteString("\t\treturn []Stream{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn streamsData.Traditions[0].Tradition\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllStreamSpirits returns all stream spirits.\n")
	b.WriteString("func GetAllStreamSpirits() []StreamSpiritItem {\n")
	b.WriteString("\treturn streamsData.Spirits.Spirit\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetStreamSpiritByID returns the stream spirit with the given ID, or nil if not found.\n")
	b.WriteString("func GetStreamSpiritByID(id string) *StreamSpiritItem {\n")
	b.WriteString("\tspirits := GetAllStreamSpirits()\n")
	b.WriteString("\tfor i := range spirits {\n")
	b.WriteString("\t\tif spirits[i].ID == id {\n")
	b.WriteString("\t\t\treturn &spirits[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
	b.WriteString("}\n")

	return b.String()
}

