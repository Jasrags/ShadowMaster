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
	data, err := loader.LoadVesselsFromXML("data/chummerxml/vessels.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateVesselsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/vessels_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	totalMetatypes := 0
	for _, metatypes := range data.Metatypes {
		totalMetatypes += len(metatypes.Metatype)
	}
	fmt.Printf("  Categories: %d, Metatypes: %d\n", len(data.Categories), totalMetatypes)
}

func generateVesselsDataCode(data *v5.VesselsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from vessels.xml. DO NOT EDIT.\n\n")
	b.WriteString("var vesselsData = &VesselsChummer{\n")

	if data.Version != nil {
		b.WriteString(fmt.Sprintf("\tVersion: stringPtr(%q),\n", *data.Version))
	}

	// Categories
	if len(data.Categories) > 0 {
		b.WriteString("\tCategories: []VesselCategories{\n")
		for _, cats := range data.Categories {
			b.WriteString("\t\t{\n")
			b.WriteString("\t\t\tCategory: []common.CategoryBase{\n")
			for _, cat := range cats.Category {
				b.WriteString("\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\tContent: %q,\n", cat.Content))
				b.WriteString("\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t},\n")
			b.WriteString("\t\t},\n")
		}
		b.WriteString("\t},\n")
	}

	// Metatypes
	b.WriteString("\tMetatypes: []VesselMetatypes{\n")
	b.WriteString("\t\t{\n")
	b.WriteString("\t\t\tMetatype: []VesselMetatype{\n")

	allMetatypes := make([]v5.VesselMetatype, 0)
	for _, metatypes := range data.Metatypes {
		allMetatypes = append(allMetatypes, metatypes.Metatype...)
	}

	for _, mt := range allMetatypes {
		b.WriteString("\t\t\t\t{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\tID: %q,\n", mt.ID))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tName: %q,\n", mt.Name))

		if mt.Category != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tCategory: stringPtr(%q),\n", *mt.Category))
		}
		if mt.ForceCreature != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tForceCreature: stringPtr(%q),\n", *mt.ForceCreature))
		}
		if mt.BP != nil {
			b.WriteString(fmt.Sprintf("\t\t\t\t\tBP: stringPtr(%q),\n", *mt.BP))
		}

		// All the min/max/aug fields
		b.WriteString(fmt.Sprintf("\t\t\t\t\tBodMin: %q,\n", mt.BodMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tBodMax: %q,\n", mt.BodMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tBodAug: %q,\n", mt.BodAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tAgiMin: %q,\n", mt.AgiMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tAgiMax: %q,\n", mt.AgiMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tAgiAug: %q,\n", mt.AgiAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tReaMin: %q,\n", mt.ReaMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tReaMax: %q,\n", mt.ReaMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tReaAug: %q,\n", mt.ReaAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tStrMin: %q,\n", mt.StrMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tStrMax: %q,\n", mt.StrMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tStrAug: %q,\n", mt.StrAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tChaMin: %q,\n", mt.ChaMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tChaMax: %q,\n", mt.ChaMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tChaAug: %q,\n", mt.ChaAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tIntMin: %q,\n", mt.IntMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tIntMax: %q,\n", mt.IntMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tIntAug: %q,\n", mt.IntAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tLogMin: %q,\n", mt.LogMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tLogMax: %q,\n", mt.LogMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tLogAug: %q,\n", mt.LogAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tWilMin: %q,\n", mt.WilMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tWilMax: %q,\n", mt.WilMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tWilAug: %q,\n", mt.WilAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tIniMin: %q,\n", mt.IniMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tIniMax: %q,\n", mt.IniMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tIniAug: %q,\n", mt.IniAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tEdgMin: %q,\n", mt.EdgMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tEdgMax: %q,\n", mt.EdgMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tEdgAug: %q,\n", mt.EdgAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tMagMin: %q,\n", mt.MagMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tMagMax: %q,\n", mt.MagMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tMagAug: %q,\n", mt.MagAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tResMin: %q,\n", mt.ResMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tResMax: %q,\n", mt.ResMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tResAug: %q,\n", mt.ResAug))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tEssMin: %q,\n", mt.EssMin))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tEssMax: %q,\n", mt.EssMax))
		b.WriteString(fmt.Sprintf("\t\t\t\t\tEssAug: %q,\n", mt.EssAug))

		b.WriteString(fmt.Sprintf("\t\t\t\t\tMovement: %q,\n", mt.Movement))

		// Optional QualityRestriction
		if mt.QualityRestriction != nil {
			b.WriteString("\t\t\t\t\tQualityRestriction: &VesselQualityRestriction{\n")
			if mt.QualityRestriction.Positive != nil && len(mt.QualityRestriction.Positive.Quality) > 0 {
				b.WriteString("\t\t\t\t\t\tPositive: &VesselPositiveQualities{\n")
				b.WriteString("\t\t\t\t\t\t\tQuality: []VesselQuality{\n")
				for _, q := range mt.QualityRestriction.Positive.Quality {
					b.WriteString("\t\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tContent: %q,\n", q.Content))
					if q.Removable != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tRemovable: stringPtr(%q),\n", *q.Removable))
					}
					if q.Select != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *q.Select))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			if mt.QualityRestriction.Negative != nil && len(mt.QualityRestriction.Negative.Quality) > 0 {
				b.WriteString("\t\t\t\t\t\tNegative: &VesselNegativeQualities{\n")
				b.WriteString("\t\t\t\t\t\t\tQuality: []VesselQuality{\n")
				for _, q := range mt.QualityRestriction.Negative.Quality {
					b.WriteString("\t\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tContent: %q,\n", q.Content))
					if q.Removable != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tRemovable: stringPtr(%q),\n", *q.Removable))
					}
					if q.Select != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *q.Select))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Qualities
		if mt.Qualities != nil {
			b.WriteString("\t\t\t\t\tQualities: &VesselQualities{\n")
			if mt.Qualities.Positive != nil && len(mt.Qualities.Positive.Quality) > 0 {
				b.WriteString("\t\t\t\t\t\tPositive: &VesselPositiveQualities{\n")
				b.WriteString("\t\t\t\t\t\t\tQuality: []VesselQuality{\n")
				for _, q := range mt.Qualities.Positive.Quality {
					b.WriteString("\t\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tContent: %q,\n", q.Content))
					if q.Removable != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tRemovable: stringPtr(%q),\n", *q.Removable))
					}
					if q.Select != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *q.Select))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			if mt.Qualities.Negative != nil && len(mt.Qualities.Negative.Quality) > 0 {
				b.WriteString("\t\t\t\t\t\tNegative: &VesselNegativeQualities{\n")
				b.WriteString("\t\t\t\t\t\t\tQuality: []VesselQuality{\n")
				for _, q := range mt.Qualities.Negative.Quality {
					b.WriteString("\t\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tContent: %q,\n", q.Content))
					if q.Removable != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tRemovable: stringPtr(%q),\n", *q.Removable))
					}
					if q.Select != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *q.Select))
					}
					b.WriteString("\t\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Bonus
		if mt.Bonus != nil && !isBaseBonusEmpty(mt.Bonus) {
			b.WriteString("\t\t\t\t\tBonus: &common.BaseBonus{\n")
			writeBaseBonusFields(&b, mt.Bonus, "\t\t\t\t\t\t")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Powers
		if mt.Powers != nil && len(mt.Powers.Power) > 0 {
			b.WriteString("\t\t\t\t\tPowers: &VesselPowers{\n")
			b.WriteString("\t\t\t\t\t\tPower: []VesselPower{\n")
			for _, p := range mt.Powers.Power {
				b.WriteString("\t\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", p.Content))
				if p.Select != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *p.Select))
				}
				if p.Rating != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *p.Rating))
				}
				if p.Cost != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tCost: stringPtr(%q),\n", *p.Cost))
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional OptionalPowers
		if mt.OptionalPowers != nil && len(mt.OptionalPowers.Power) > 0 {
			b.WriteString("\t\t\t\t\tOptionalPowers: &VesselOptionalPowers{\n")
			b.WriteString("\t\t\t\t\t\tPower: []VesselPower{\n")
			for _, p := range mt.OptionalPowers.Power {
				b.WriteString("\t\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", p.Content))
				if p.Select != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *p.Select))
				}
				if p.Rating != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *p.Rating))
				}
				if p.Cost != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tCost: stringPtr(%q),\n", *p.Cost))
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional Skills
		if mt.Skills != nil {
			b.WriteString("\t\t\t\t\tSkills: &VesselSkills{\n")
			if len(mt.Skills.Skill) > 0 {
				b.WriteString("\t\t\t\t\t\tSkill: []VesselSkill{\n")
				for _, s := range mt.Skills.Skill {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", s.Content))
					if s.Rating != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *s.Rating))
					}
					if s.Spec != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tSpec: stringPtr(%q),\n", *s.Spec))
					}
					if s.Select != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tSelect: stringPtr(%q),\n", *s.Select))
					}
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			if len(mt.Skills.Group) > 0 {
				b.WriteString("\t\t\t\t\t\tGroup: []VesselSkillGroup{\n")
				for _, g := range mt.Skills.Group {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", g.Content))
					if g.Rating != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *g.Rating))
					}
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			if len(mt.Skills.Knowledge) > 0 {
				b.WriteString("\t\t\t\t\t\tKnowledge: []VesselKnowledge{\n")
				for _, k := range mt.Skills.Knowledge {
					b.WriteString("\t\t\t\t\t\t\t{\n")
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", k.Content))
					if k.Rating != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *k.Rating))
					}
					if k.Category != nil {
						b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tCategory: stringPtr(%q),\n", *k.Category))
					}
					b.WriteString("\t\t\t\t\t\t\t},\n")
				}
				b.WriteString("\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional ComplexForms
		if mt.ComplexForms != nil && len(mt.ComplexForms.ComplexForm) > 0 {
			b.WriteString("\t\t\t\t\tComplexForms: &VesselComplexForms{\n")
			b.WriteString("\t\t\t\t\t\tComplexForm: []VesselComplexForm{\n")
			for _, cf := range mt.ComplexForms.ComplexForm {
				b.WriteString("\t\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", cf.Content))
				if cf.Rating != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *cf.Rating))
				}
				if cf.Category != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tCategory: stringPtr(%q),\n", *cf.Category))
				}
				if cf.Option != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tOption: stringPtr(%q),\n", *cf.Option))
				}
				if cf.OptionRating != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tOptionRating: stringPtr(%q),\n", *cf.OptionRating))
				}
				if cf.OptionSelect != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tOptionSelect: stringPtr(%q),\n", *cf.OptionSelect))
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Optional OptionalComplexForms
		if mt.OptionalComplexForms != nil && len(mt.OptionalComplexForms.ComplexForm) > 0 {
			b.WriteString("\t\t\t\t\tOptionalComplexForms: &VesselOptionalComplexForms{\n")
			b.WriteString("\t\t\t\t\t\tComplexForm: []VesselComplexForm{\n")
			for _, cf := range mt.OptionalComplexForms.ComplexForm {
				b.WriteString("\t\t\t\t\t\t\t{\n")
				b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tContent: %q,\n", cf.Content))
				if cf.Rating != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tRating: stringPtr(%q),\n", *cf.Rating))
				}
				if cf.Category != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tCategory: stringPtr(%q),\n", *cf.Category))
				}
				if cf.Option != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tOption: stringPtr(%q),\n", *cf.Option))
				}
				if cf.OptionRating != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tOptionRating: stringPtr(%q),\n", *cf.OptionRating))
				}
				if cf.OptionSelect != nil {
					b.WriteString(fmt.Sprintf("\t\t\t\t\t\t\t\tOptionSelect: stringPtr(%q),\n", *cf.OptionSelect))
				}
				b.WriteString("\t\t\t\t\t\t\t},\n")
			}
			b.WriteString("\t\t\t\t\t\t},\n")
			b.WriteString("\t\t\t\t\t},\n")
		}

		// Embedded SourceReference
		b.WriteString("\t\t\t\t\tSourceReference: common.SourceReference{\n")
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tSource: %q,\n", mt.Source))
		b.WriteString(fmt.Sprintf("\t\t\t\t\t\tPage: %q,\n", mt.Page))
		b.WriteString("\t\t\t\t\t},\n")

		b.WriteString("\t\t\t\t},\n")
	}

	b.WriteString("\t\t\t},\n")
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetVesselsData returns the loaded vessels data.\n")
	b.WriteString("func GetVesselsData() *VesselsChummer {\n")
	b.WriteString("\treturn vesselsData\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetAllVesselMetatypes returns all vessel metatypes.\n")
	b.WriteString("func GetAllVesselMetatypes() []VesselMetatype {\n")
	b.WriteString("\tif len(vesselsData.Metatypes) == 0 {\n")
	b.WriteString("\t\treturn []VesselMetatype{}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn vesselsData.Metatypes[0].Metatype\n")
	b.WriteString("}\n\n")

	b.WriteString("// GetVesselMetatypeByID returns the vessel metatype with the given ID, or nil if not found.\n")
	b.WriteString("func GetVesselMetatypeByID(id string) *VesselMetatype {\n")
	b.WriteString("\tmetatypes := GetAllVesselMetatypes()\n")
	b.WriteString("\tfor i := range metatypes {\n")
	b.WriteString("\t\tif metatypes[i].ID == id {\n")
	b.WriteString("\t\t\treturn &metatypes[i]\n")
	b.WriteString("\t\t}\n")
	b.WriteString("\t}\n")
	b.WriteString("\treturn nil\n")
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

