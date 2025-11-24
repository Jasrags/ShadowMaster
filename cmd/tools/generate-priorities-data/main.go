package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadPrioritiesFromXML("data/chummerxml/priorities.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generatePrioritiesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/priorities_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Categories: %d, Priorities: %d\n",
		len(data.Categories.Category),
		len(data.Priorities.Priority))
}

func generatePrioritiesDataCode(data *v5.PrioritiesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from priorities.xml. DO NOT EDIT.\n\n")
	b.WriteString("var prioritiesData = &PrioritiesChummer{\n")

	// Version
	b.WriteString(fmt.Sprintf("\tVersion: %d,\n", data.Version))

	// Categories
	b.WriteString("\tCategories: PriorityCategories{\n")
	b.WriteString("\t\tCategory: []string{\n")
	for _, cat := range data.Categories.Category {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", cat))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// Priorities
	b.WriteString("\tPriorities: Priorities{\n")
	b.WriteString("\t\tPriority: []Priority{\n")
	for _, priority := range data.Priorities.Priority {
		b.WriteString("\t\t\t{\n")

		// Optional fields
		if priority.ID != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tID: stringPtr(%q),\n", *priority.ID))
		}
		if priority.Name != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tName: stringPtr(%q),\n", *priority.Name))
		}
		if priority.Hide != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tHide: stringPtr(%q),\n", *priority.Hide))
		}
		if priority.Value != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tValue: stringPtr(%q),\n", *priority.Value))
		}
		if priority.Category != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tCategory: stringPtr(%q),\n", *priority.Category))
		}
		if priority.GameplayOption != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tGameplayOption: stringPtr(%q),\n", *priority.GameplayOption))
		}
		if priority.Skills != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tSkills: bytePtr(%d),\n", *priority.Skills))
		}
		if priority.SkillGroups != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tSkillGroups: bytePtr(%d),\n", *priority.SkillGroups))
		}
		if priority.Attributes != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tAttributes: bytePtr(%d),\n", *priority.Attributes))
		}
		if priority.Resources != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tResources: uintPtr(%d),\n", *priority.Resources))
		}

		// Talents
		if priority.Talents != nil && len(priority.Talents.Talent) > 0 {
			b.WriteString("\t\t\t\tTalents: &PriorityTalents{\n")
			b.WriteString("\t\t\t\t\tTalent: []PriorityTalent{\n")
			for _, talent := range priority.Talents.Talent {
				b.WriteString("\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tName: %q,\n", talent.Name))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tValue: %q,\n", talent.Value))
				if talent.Depth != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tDepth: bytePtr(%d),\n", *talent.Depth))
				}
				if talent.SpecialAttribPoints != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSpecialAttribPoints: bytePtr(%d),\n", *talent.SpecialAttribPoints))
				}
				if talent.Resonance != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tResonance: bytePtr(%d),\n", *talent.Resonance))
				}
				if talent.CFP != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tCFP: bytePtr(%d),\n", *talent.CFP))
				}
				if talent.Magic != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tMagic: bytePtr(%d),\n", *talent.Magic))
				}
				if talent.SkillGroupQty != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSkillGroupQty: bytePtr(%d),\n", *talent.SkillGroupQty))
				}
				if talent.SkillGroupVal != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSkillGroupVal: bytePtr(%d),\n", *talent.SkillGroupVal))
				}
				if talent.SkillGroupType != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSkillGroupType: stringPtr(%q),\n", *talent.SkillGroupType))
				}
				if talent.Spells != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSpells: bytePtr(%d),\n", *talent.Spells))
				}
				if talent.SkillQty != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSkillQty: bytePtr(%d),\n", *talent.SkillQty))
				}
				if talent.SkillVal != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSkillVal: bytePtr(%d),\n", *talent.SkillVal))
				}
				if talent.SkillType != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tSkillType: stringPtr(%q),\n", *talent.SkillType))
				}

				// Qualities
				if talent.Qualities != nil && len(talent.Qualities.Quality) > 0 {
					b.WriteString("\t\t\t\t\t\t\tQualities: &PriorityTalentQualities{\n")
					b.WriteString("\t\t\t\t\t\t\t\tQuality: []string{\n")
					for _, quality := range talent.Qualities.Quality {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\t%q,\n", quality))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}

				// SkillGroupChoices
				if talent.SkillGroupChoices != nil && len(talent.SkillGroupChoices.SkillGroup) > 0 {
					b.WriteString("\t\t\t\t\t\t\tSkillGroupChoices: &PriorityTalentSkillGroupChoices{\n")
					b.WriteString("\t\t\t\t\t\t\t\tSkillGroup: []string{\n")
					for _, sg := range talent.SkillGroupChoices.SkillGroup {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\t%q,\n", sg))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}

				// SkillChoices
				if talent.SkillChoices != nil && len(talent.SkillChoices.Skill) > 0 {
					b.WriteString("\t\t\t\t\t\t\tSkillChoices: &PriorityTalentSkillChoices{\n")
					b.WriteString("\t\t\t\t\t\t\t\tSkill: []string{\n")
					for _, skill := range talent.SkillChoices.Skill {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\t%q,\n", skill))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}

				// Required
				if talent.Required != nil {
					b.WriteString("\t\t\t\t\t\t\tRequired: &PriorityTalentRequired{\n")
					b.WriteString("\t\t\t\t\t\t\t\tOneOf: PriorityTalentRequiredOneOf{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tMetatype: %q,\n", talent.Required.OneOf.Metatype))
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}

				// Forbidden
				if talent.Forbidden != nil {
					b.WriteString("\t\t\t\t\t\t\tForbidden: &PriorityTalentForbidden{\n")
					b.WriteString("\t\t\t\t\t\t\t\tOneOf: PriorityTalentForbiddenOneOf{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tMetatype: %q,\n", talent.Forbidden.OneOf.Metatype))
					b.WriteString("\t\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}

				b.WriteString("\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		// Metatypes
		if priority.Metatypes != nil && len(priority.Metatypes.Metatype) > 0 {
			b.WriteString("\t\t\t\tMetatypes: &PriorityMetatypes{\n")
			b.WriteString("\t\t\t\t\tMetatype: []PriorityMetatype{\n")
			for _, metatype := range priority.Metatypes.Metatype {
				b.WriteString("\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tName: %q,\n", metatype.Name))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tValue: %d,\n", metatype.Value))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tKarma: %d,\n", metatype.Karma))
				if metatype.Metavariants != nil && len(metatype.Metavariants.Metavariant) > 0 {
					b.WriteString("\t\t\t\t\t\t\tMetavariants: &PriorityMetavariants{\n")
					b.WriteString("\t\t\t\t\t\t\t\tMetavariant: []PriorityMetavariant{\n")
					for _, variant := range metatype.Metavariants.Metavariant {
						b.WriteString("\t\t\t\t\t\t\t\t\t{\n")
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\t\tName: %q,\n", variant.Name))
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\t\tValue: %d,\n", variant.Value))
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\t\tKarma: %d,\n", variant.Karma))
						b.WriteString("\t\t\t\t\t\t\t\t\t},\n")
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetPrioritiesData returns the loaded priorities data.\n")
	b.WriteString("func GetPrioritiesData() *PrioritiesChummer {\n")
	b.WriteString("\treturn prioritiesData\n")
	b.WriteString("}\n\n")

	b.WriteString("// Helper functions for pointers\n")
	b.WriteString("func bytePtr(b byte) *byte { return &b }\n")
	b.WriteString("func uintPtr(u uint) *uint { return &u }\n")

	return b.String()
}

