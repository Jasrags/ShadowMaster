package main

import (
	"fmt"
	"os"
	"reflect"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/common"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadQualitiesFromXML("data/chummerxml/qualities.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateQualitiesDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/qualities_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalQualities := 0
	for _, qualities := range data.Qualities {
		totalQualities += len(qualities.Quality)
	}
	categoryCount := 0
	if len(data.Categories) > 0 {
		categoryCount = len(data.Categories[0].Category)
	}
	fmt.Printf("  Categories: %d, Qualities: %d\n", categoryCount, totalQualities)
}

func generateQualitiesDataCode(data *v5.QualitiesChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from qualities.xml. DO NOT EDIT.\n\n")
	b.WriteString("var qualitiesData = &QualitiesChummer{\n")

	// Version
	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 && len(data.Categories[0].Category) > 0 {
		b.WriteString("\tCategories: []QualityCategories{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tCategory: []QualityCategory{\n")
		for _, cat := range data.Categories[0].Category {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	// Qualities
	if len(data.Qualities) > 0 {
		b.WriteString("\tQualities: []QualityItems{\n")
		b.WriteString("\t\t{\n")
		b.WriteString("\t\t\tQuality: []QualityItem{\n")
		for _, quality := range data.Qualities[0].Quality {
			b.WriteString("\t\t\t\t{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", quality.ID))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", quality.Name))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tKarma: %q,\n", quality.Karma))
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: %q,\n", quality.Category))

			// Embedded Visibility
			if quality.Hide != nil || quality.IgnoreSourceDisabled != nil {
				b.WriteString("\t\t\t\t\tVisibility: common.Visibility{\n")
				if quality.Hide != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tHide: stringPtr(%q),\n", *quality.Hide))
				}
				if quality.IgnoreSourceDisabled != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\tIgnoreSourceDisabled: stringPtr(%q),\n", *quality.IgnoreSourceDisabled))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// SourceReference
			b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", quality.Source))
			b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", quality.Page))
			b.WriteString("\t\t\t\t\t},\n")

			// Optional fields
			if quality.CanBuyWithSpellPoints != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tCanBuyWithSpellPoints: &common.Boolean{},\n"))
			}
			if quality.CareerOnly != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tCareerOnly: stringPtr(%q),\n", *quality.CareerOnly))
			}
			if quality.ChargenLimit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tChargenLimit: stringPtr(%q),\n", *quality.ChargenLimit))
			}
			if quality.ChargenOnly != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tChargenOnly: stringPtr(%q),\n", *quality.ChargenOnly))
			}
			if quality.ContributeToBP != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tContributeToBP: stringPtr(%q),\n", *quality.ContributeToBP))
			}
			if quality.ContributeToLimit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tContributeToLimit: stringPtr(%q),\n", *quality.ContributeToLimit))
			}
			if quality.DoubleCareer != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tDoubleCareer: stringPtr(%q),\n", *quality.DoubleCareer))
			}
			if quality.Implemented != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tImplemented: stringPtr(%q),\n", *quality.Implemented))
			}
			if quality.Limit != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tLimit: stringPtr(%q),\n", *quality.Limit))
			}
			if quality.LimitWithInclusions != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tLimitWithInclusions: stringPtr(%q),\n", *quality.LimitWithInclusions))
			}
			if quality.Metagenic != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tMetagenic: stringPtr(%q),\n", *quality.Metagenic))
			}
			if quality.Mutant != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tMutant: stringPtr(%q),\n", *quality.Mutant))
			}
			if quality.NoLevels != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tNoLevels: stringPtr(%q),\n", *quality.NoLevels))
			}
			if quality.OnlyPriorityGiven != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tOnlyPriorityGiven: stringPtr(%q),\n", *quality.OnlyPriorityGiven))
			}
			if quality.Print != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tPrint: stringPtr(%q),\n", *quality.Print))
			}
			if quality.RefundKarmaOnRemove != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tRefundKarmaOnRemove: stringPtr(%q),\n", *quality.RefundKarmaOnRemove))
			}
			if quality.StagedPurchase != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tStagedPurchase: stringPtr(%q),\n", *quality.StagedPurchase))
			}
			if quality.NameOnPage != nil {
				b.WriteString(fmt.Sprintf("\t\t\t\t\tNameOnPage: stringPtr(%q),\n", *quality.NameOnPage))
			}

			// Optional slices
			if len(quality.AddWeapon) > 0 {
				b.WriteString("\t\t\t\t\tAddWeapon: []string{\n")
				for _, weapon := range quality.AddWeapon {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t%q,\n", weapon))
				}
				b.WriteString("\t\t\t\t\t},\n")
			}

			// AddQualities
			if quality.AddQualities != nil && len(quality.AddQualities.AddQuality) > 0 {
				b.WriteString("\t\t\t\t\tAddQualities: &AddQualities{\n")
				b.WriteString("\t\t\t\t\t\tAddQuality: []AddQuality{\n")
				for _, aq := range quality.AddQualities.AddQuality {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", aq.Content))
					if aq.ContributeToBP != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContributeToBP: boolPtr(%t),\n", *aq.ContributeToBP))
					}
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// CostDiscount
			if quality.CostDiscount != nil {
				b.WriteString("\t\t\t\t\tCostDiscount: &CostDiscount{\n")
				b.WriteString("\t\t\t\t\t\tRequired: common.Required{},\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\tValue: %d,\n", quality.CostDiscount.Value))
				b.WriteString("\t\t\t\t\t},\n")
			}

			// CritterPowers
			if quality.CritterPowers != nil && len(quality.CritterPowers.Power) > 0 {
				b.WriteString("\t\t\t\t\tCritterPowers: &QualityCritterPowers{\n")
				b.WriteString("\t\t\t\t\t\tPower: []QualityPower{\n")
				for _, power := range quality.CritterPowers.Power {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", power.Content))
					if power.Select != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *power.Select))
					}
					if power.Rating != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *power.Rating))
					}
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// IncludeInLimit
			if quality.IncludeInLimit != nil && len(quality.IncludeInLimit.Name) > 0 {
				b.WriteString("\t\t\t\t\tIncludeInLimit: &IncludeInLimit{\n")
				b.WriteString("\t\t\t\t\t\tName: []string{\n")
				for _, name := range quality.IncludeInLimit.Name {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t%q,\n", name))
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// NaturalWeapons
			if quality.NaturalWeapons != nil && len(quality.NaturalWeapons.NaturalWeapon) > 0 {
				b.WriteString("\t\t\t\t\tNaturalWeapons: &NaturalWeapons{\n")
				b.WriteString("\t\t\t\t\t\tNaturalWeapon: []NaturalWeapon{\n")
				for _, nw := range quality.NaturalWeapons.NaturalWeapon {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tName: %q,\n", nw.Name))
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tReach: %q,\n", nw.Reach))
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tDamage: %q,\n", nw.Damage))
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tAP: %q,\n", nw.AP))
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tUseSkill: %q,\n", nw.UseSkill))
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tAccuracy: %q,\n", nw.Accuracy))
					b.WriteString("\t\t\t\t\t\t\t\tSourceReference: common.SourceReference{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tSource: %q,\n", nw.Source))
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tPage: %q,\n", nw.Page))
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Powers
			if quality.Powers != nil && len(quality.Powers.Power) > 0 {
				b.WriteString("\t\t\t\t\tPowers: &QualityPowers{\n")
				b.WriteString("\t\t\t\t\t\tPower: []string{\n")
				for _, power := range quality.Powers.Power {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t%q,\n", power))
				}
				b.WriteString("\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Bonus
			if quality.Bonus != nil && !isBaseBonusEmpty(quality.Bonus) {
				b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, quality.Bonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional FirstLevelBonus
			if quality.FirstLevelBonus != nil && !isBaseBonusEmpty(quality.FirstLevelBonus) {
				b.WriteString("\t\t\t\t\tFirstLevelBonus: &common.BaseBonus{\n")
				writeBaseBonusFields(&b, quality.FirstLevelBonus, "\t\t\t\t\t\t")
				b.WriteString("\t\t\t\t\t},\n")
			}

			// Optional Forbidden
			if quality.Forbidden != nil {
				b.WriteString("\t\t\t\t\tForbidden: &common.Forbidden{},\n")
			}

			// Optional Required
			if quality.Required != nil {
				b.WriteString("\t\t\t\t\tRequired: &common.Required{},\n")
			}

			b.WriteString("\t\t\t\t},\n")
		}
		b.WriteString("\t\t\t},\n")
		b.WriteString("\t\t},\n")
		b.WriteString("\t},\n")
	}

	b.WriteString("}\n\n")

	b.WriteString("// GetQualitiesData returns the loaded qualities data.\n")
	b.WriteString("func GetQualitiesData() *QualitiesChummer {\n")
	b.WriteString("\treturn qualitiesData\n")
	b.WriteString("}\n")

	return b.String()
}

func isBaseBonusEmpty(b *common.BaseBonus) bool {
	v := reflect.ValueOf(b).Elem()
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		if !field.IsZero() {
			return false
		}
	}
	return true
}

func writeBaseBonusFields(b *strings.Builder, bonus *common.BaseBonus, indent string) {
	v := reflect.ValueOf(bonus).Elem()
	t := reflect.TypeOf(bonus).Elem()
	
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)
		
		if field.IsZero() {
			continue
		}
		
		fieldName := fieldType.Name
		
		switch field.Kind() {
		case reflect.Ptr:
			if !field.IsNil() {
				elemType := fieldType.Type.Elem()
				if elemType.Name() == "Livingpersona" {
					b.WriteString(fmt.Sprintf("%s%s: &common.Livingpersona{\n", indent, fieldName))
					writeLivingpersonaFields(b, field.Elem().Interface().(common.Livingpersona), indent+"\t")
					b.WriteString(fmt.Sprintf("%s},\n", indent))
				} else {
					b.WriteString(fmt.Sprintf("%s%s: &common.%s{},\n", indent, fieldName, elemType.Name()))
				}
			}
		case reflect.Slice:
			if field.Len() > 0 {
				elemType := fieldType.Type.Elem()
				var typeName string
				switch elemType.Kind() {
				case reflect.Bool:
					typeName = "bool"
				case reflect.String:
					typeName = "string"
				case reflect.Int:
					typeName = "int"
				default:
					if elemType.PkgPath() != "" {
						pkgName := "common"
						if elemType.PkgPath() != "shadowmaster/pkg/shadowrun/edition/v5/common" {
							parts := strings.Split(elemType.PkgPath(), "/")
							pkgName = parts[len(parts)-1]
						}
						typeName = pkgName + "." + elemType.Name()
					} else {
						typeName = elemType.Name()
					}
				}
				b.WriteString(fmt.Sprintf("%s%s: []%s{\n", indent, fieldName, typeName))
				b.WriteString(fmt.Sprintf("%s\t// %d items omitted\n", indent, field.Len()))
				b.WriteString(fmt.Sprintf("%s},\n", indent))
			}
		}
	}
}

func writeLivingpersonaFields(b *strings.Builder, lp common.Livingpersona, indent string) {
	if lp.Attack != nil {
		b.WriteString(fmt.Sprintf("%sAttack: stringPtr(%q),\n", indent, *lp.Attack))
	}
	if lp.Dataprocessing != nil {
		b.WriteString(fmt.Sprintf("%sDataprocessing: stringPtr(%q),\n", indent, *lp.Dataprocessing))
	}
	if lp.Devicerating != nil {
		b.WriteString(fmt.Sprintf("%sDevicerating: stringPtr(%q),\n", indent, *lp.Devicerating))
	}
	if lp.Firewall != nil {
		b.WriteString(fmt.Sprintf("%sFirewall: stringPtr(%q),\n", indent, *lp.Firewall))
	}
	if lp.Sleaze != nil {
		b.WriteString(fmt.Sprintf("%sSleaze: stringPtr(%q),\n", indent, *lp.Sleaze))
	}
}

