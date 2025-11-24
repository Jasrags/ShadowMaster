package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadSkillsFromXML("data/chummerxml/skills.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateSkillsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/skills_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalSkills := 0
	for _, skills := range data.Skills {
		totalSkills += len(skills.Skill)
	}
	totalKnowledgeSkills := 0
	for _, knowledgeSkills := range data.KnowledgeSkills {
		totalKnowledgeSkills += len(knowledgeSkills.Skill)
	}
	fmt.Printf("  Skill groups: %d, Categories: %d, Skills: %d, Knowledge skills: %d\n",
		len(data.SkillGroups[0].Name),
		len(data.Categories[0].Category),
		totalSkills,
		totalKnowledgeSkills)
}

func generateSkillsDataCode(data *v5.SkillsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from skills.xml. DO NOT EDIT.\n\n")
	b.WriteString("var skillsData = &SkillsChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// SkillGroups
	if len(data.SkillGroups) > 0 && len(data.SkillGroups[0].Name) > 0 {
		b.WriteString("\tSkillGroups: []SkillGroups{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tName: []SkillGroupName{\n")
		for _, name := range data.SkillGroups[0].Name {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", name.Content))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []SkillCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []SkillCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tType: %q,\n", cat.Type))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Skills
	if len(data.Skills) > 0 {
		b.WriteString("\tSkills: []Skills{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tSkill: []Skill{\n")
		for _, skill := range data.Skills[0].Skill {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", skill.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", skill.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAttribute: %q,\n", skill.Attribute))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", skill.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tDefault: %q,\n", skill.Default))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSkillGroup: %q,\n", skill.SkillGroup))

			// Embedded Visibility
			if skill.Hide != nil || skill.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if skill.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *skill.Hide))
				}
				if skill.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *skill.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional fields
			if skill.Exotic != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tExotic: stringPtr(%q),\n", *skill.Exotic))
			}
			if skill.RequiresGroundMovement != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRequiresGroundMovement: stringPtr(%q),\n", *skill.RequiresGroundMovement))
			}
			if skill.RequiresSwimMovement != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRequiresSwimMovement: stringPtr(%q),\n", *skill.RequiresSwimMovement))
			}
			if skill.RequiresFlyMovement != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRequiresFlyMovement: stringPtr(%q),\n", *skill.RequiresFlyMovement))
			}

			// Specs
			if len(skill.Specs.Spec) > 0 {
				b.WriteString("\t\t\t\t\tSpecs: Specs{\n")
				b.WriteString("\t\t\t\t\t\tSpec: []Spec{\n")
				for _, spec := range skill.Specs.Spec {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", spec.Content))
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", skill.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", skill.Page))
			b.WriteString("\t\t\t\t\t},\n")

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// KnowledgeSkills
	if len(data.KnowledgeSkills) > 0 {
		b.WriteString("\tKnowledgeSkills: []KnowledgeSkills{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tSkill: []Skill{\n")
		for _, skill := range data.KnowledgeSkills[0].Skill {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", skill.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", skill.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tAttribute: %q,\n", skill.Attribute))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", skill.Category))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tDefault: %q,\n", skill.Default))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tSkillGroup: %q,\n", skill.SkillGroup))

			// Embedded Visibility
			if skill.Hide != nil || skill.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if skill.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *skill.Hide))
				}
				if skill.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *skill.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional fields
			if skill.Exotic != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tExotic: stringPtr(%q),\n", *skill.Exotic))
			}
			if skill.RequiresGroundMovement != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRequiresGroundMovement: stringPtr(%q),\n", *skill.RequiresGroundMovement))
			}
			if skill.RequiresSwimMovement != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRequiresSwimMovement: stringPtr(%q),\n", *skill.RequiresSwimMovement))
			}
			if skill.RequiresFlyMovement != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRequiresFlyMovement: stringPtr(%q),\n", *skill.RequiresFlyMovement))
			}

			// Specs
			if len(skill.Specs.Spec) > 0 {
				b.WriteString("\t\t\t\t\tSpecs: Specs{\n")
				b.WriteString("\t\t\t\t\t\tSpec: []Spec{\n")
				for _, spec := range skill.Specs.Spec {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", spec.Content))
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", skill.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", skill.Page))
			b.WriteString("\t\t\t\t\t},\n")

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetSkillsData returns the loaded skills data.\n")
	b.WriteString("func GetSkillsData() *SkillsChummer {\n")
	b.WriteString("\treturn skillsData\n")
	b.WriteString("}\n")

	return b.String()
}

