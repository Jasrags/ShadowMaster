package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadLifeModulesFromXML("data/chummerxml/lifemodules.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateLifeModulesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/lifemodules_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Stages: %d, Modules: %d\n",
		len(data.Stages.Stage),
		len(data.Modules.Module))
}

func generateLifeModulesDataCode(data *v5.LifeModulesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("// Code generated from lifemodules.xml. DO NOT EDIT.\n\n")
	b.WriteString("var lifemodulesData = &LifeModulesChummer{\n")

	// Stages
	b.WriteString("\tStages: LifeModuleStages{\n")
	b.WriteString("\t\tStage: []LifeModuleStage{\n")
	for _, stage := range data.Stages.Stage {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tContent: %q,\n", stage.Content))
		b.WriteString(fmt.Sprintf("\t\t\t\tOrder: %d,\n", stage.Order))
		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// Modules
	b.WriteString("\tModules: LifeModules{\n")
	b.WriteString("\t\tModule: []LifeModule{\n")
	for _, module := range data.Modules.Module {
		b.WriteString("\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\tID: %q,\n", module.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\tStage: %q,\n", module.Stage))
		b.WriteString(fmt.Sprintf("\t\t\t\tCategory: %q,\n", module.Category))
		b.WriteString(fmt.Sprintf("\t\t\t\tName: %q,\n", module.Name))
		b.WriteString(fmt.Sprintf("\t\t\t\tKarma: %d,\n", module.Karma))
		b.WriteString(fmt.Sprintf("\t\t\t\tSource: %q,\n", module.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\tPage: %q,\n", module.Page))

		// Optional fields
		if module.Story != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\tStory: stringPtr(%q),\n", *module.Story))
		}

		// Versions
		if module.Versions != nil && len(module.Versions.Version) > 0 {
			b.WriteString("\t\t\t\tVersions: &LifeModuleVersions{\n")
			b.WriteString("\t\t\t\t\tVersion: []LifeModuleVersion{\n")
			for _, version := range module.Versions.Version {
				b.WriteString("\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tID: %q,\n", version.ID))
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tName: %q,\n", version.Name))
				if version.Story != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\tStory: stringPtr(%q),\n", *version.Story))
				}
				if version.Bonus != nil {
					b.WriteString("\t\t\t\t\t\t\tBonus: &LifeModuleBonus{\n")
					writeLifeModuleBonusFields(&b, version.Bonus, "\t\t\t\t\t\t\t\t")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t},\n")
		}

		// Bonus
		if module.Bonus != nil {
			b.WriteString("\t\t\t\tBonus: &LifeModuleBonus{\n")
			writeLifeModuleBonusFields(&b, module.Bonus, "\t\t\t\t\t")
			b.WriteString("\t\t\t\t},\n")
		}

		b.WriteString("\t\t\t},\n")
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetLifeModulesData returns the loaded life modules data.\n")
	b.WriteString("func GetLifeModulesData() *LifeModulesChummer {\n")
	b.WriteString("\treturn lifemodulesData\n")
	b.WriteString("}\n")

	return b.String()
}

func writeLifeModuleBonusFields(b *strings.Builder, bonus *v5.LifeModuleBonus, indent string) {
	// AttributeLevel
	if len(bonus.AttributeLevel) > 0 {
		b.WriteString(fmt.Sprintf("%sAttributeLevel: []LifeModuleAttributeLevel{\n", indent))
		for _, attr := range bonus.AttributeLevel {
			b.WriteString(fmt.Sprintf("%s\t{\n", indent))
			b.WriteString(fmt.Sprintf("%s\t\tName: %q,\n", indent, attr.Name))
			if attr.Val != nil {
				b.WriteString(fmt.Sprintf("%s\t\tVal: intPtr(%d),\n", indent, *attr.Val))
			}
			b.WriteString(fmt.Sprintf("%s\t},\n", indent))
		}
		b.WriteString(fmt.Sprintf("%s},\n", indent))
	}

	// SkillLevel
	if len(bonus.SkillLevel) > 0 {
		b.WriteString(fmt.Sprintf("%sSkillLevel: []LifeModuleSkillLevel{\n", indent))
		for _, skill := range bonus.SkillLevel {
			b.WriteString(fmt.Sprintf("%s\t{\n", indent))
			b.WriteString(fmt.Sprintf("%s\t\tName: %q,\n", indent, skill.Name))
			if skill.Val != nil {
				b.WriteString(fmt.Sprintf("%s\t\tVal: intPtr(%d),\n", indent, *skill.Val))
			}
			b.WriteString(fmt.Sprintf("%s\t},\n", indent))
		}
		b.WriteString(fmt.Sprintf("%s},\n", indent))
	}

	// KnowledgeSkillLevel
	if len(bonus.KnowledgeSkillLevel) > 0 {
		b.WriteString(fmt.Sprintf("%sKnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{\n", indent))
		for _, kskill := range bonus.KnowledgeSkillLevel {
			b.WriteString(fmt.Sprintf("%s\t{\n", indent))
			if kskill.ID != nil {
				b.WriteString(fmt.Sprintf("%s\t\tID: stringPtr(%q),\n", indent, *kskill.ID))
			}
			if kskill.Group != nil {
				b.WriteString(fmt.Sprintf("%s\t\tGroup: stringPtr(%q),\n", indent, *kskill.Group))
			}
			if kskill.Name != nil {
				b.WriteString(fmt.Sprintf("%s\t\tName: stringPtr(%q),\n", indent, *kskill.Name))
			}
			if kskill.Val != nil {
				b.WriteString(fmt.Sprintf("%s\t\tVal: intPtr(%d),\n", indent, *kskill.Val))
			}
			if kskill.Options != nil {
				b.WriteString(fmt.Sprintf("%s\t\tOptions: &LifeModuleKnowledgeSkillLevelOptions{\n", indent))
				if kskill.Options.Spanish != nil {
					b.WriteString(fmt.Sprintf("%s\t\t\tSpanish: stringPtr(%q),\n", indent, *kskill.Options.Spanish))
				}
				if kskill.Options.German != nil {
					b.WriteString(fmt.Sprintf("%s\t\t\tGerman: stringPtr(%q),\n", indent, *kskill.Options.German))
				}
				if kskill.Options.Italian != nil {
					b.WriteString(fmt.Sprintf("%s\t\t\tItalian: stringPtr(%q),\n", indent, *kskill.Options.Italian))
				}
				if kskill.Options.Flee != nil {
					b.WriteString(fmt.Sprintf("%s\t\t\tFlee: stringPtr(%q),\n", indent, *kskill.Options.Flee))
				}
				if kskill.Options.Orange != nil {
					b.WriteString(fmt.Sprintf("%s\t\t\tOrange: stringPtr(%q),\n", indent, *kskill.Options.Orange))
				}
				if kskill.Options.Polish != nil {
					b.WriteString(fmt.Sprintf("%s\t\t\tPolish: stringPtr(%q),\n", indent, *kskill.Options.Polish))
				}
				if kskill.Options.Yiddish != nil {
					b.WriteString(fmt.Sprintf("%s\t\t\tYiddish: stringPtr(%q),\n", indent, *kskill.Options.Yiddish))
				}
				b.WriteString(fmt.Sprintf("%s\t\t},\n", indent))
			}
			b.WriteString(fmt.Sprintf("%s\t},\n", indent))
		}
		b.WriteString(fmt.Sprintf("%s},\n", indent))
	}

	// PushText
	if bonus.PushText != nil {
		b.WriteString(fmt.Sprintf("%sPushText: stringPtr(%q),\n", indent, *bonus.PushText))
	}

	// FreeNegativeQualities
	if bonus.FreeNegativeQualities != nil {
		b.WriteString(fmt.Sprintf("%sFreeNegativeQualities: intPtr(%d),\n", indent, *bonus.FreeNegativeQualities))
	}

	// QualityLevel
	if len(bonus.QualityLevel) > 0 {
		b.WriteString(fmt.Sprintf("%sQualityLevel: []LifeModuleQualityLevel{\n", indent))
		for _, quality := range bonus.QualityLevel {
			b.WriteString(fmt.Sprintf("%s\t{\n", indent))
			b.WriteString(fmt.Sprintf("%s\t\tContent: %q,\n", indent, quality.Content))
			if quality.Group != nil {
				b.WriteString(fmt.Sprintf("%s\t\tGroup: stringPtr(%q),\n", indent, *quality.Group))
			}
			b.WriteString(fmt.Sprintf("%s\t},\n", indent))
		}
		b.WriteString(fmt.Sprintf("%s},\n", indent))
	}
}

