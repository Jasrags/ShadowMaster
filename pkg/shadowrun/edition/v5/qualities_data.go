package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// DataQualityCategories contains quality category names
var DataQualityCategories = []string{
	"Positive",
	"Negative",
}

// DataQualities contains quality records keyed by their ID (lowercase with underscores)
var DataQualities = map[string]Quality{
	"ambidextrous": {
		Name:     "Ambidextrous",
		Karma:    "4",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "{arm} - 1",
		Bonus: &QualityBonus{
			Ambidextrous: true,
		},
		Page: "71",
	},
	"analytical_mind": {
		Name:     "Analytical Mind",
		Karma:    "5",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SkillAttribute: &SkillAttributeBonus{
				Name: "LOG", Bonus: "2", Condition: "Involving pattern recognition, evidence analysis, clue hunting, or solving puzzles",
			},
		},
		Page: "72",
	},
	"aptitude": {
		Name:     "Aptitude",
		Karma:    "14",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SelectSkill: &SelectSkill{
				Max: "1",
			},
		},
		Page: "72",
	},
	"astral_chameleon": {
		Name:     "Astral Chameleon",
		Karma:    "10",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Centaur", "Naga", "Pixie", "Sasquatch"}, Quality: []string{"Adept", "Aware", "Aspected Magician", "Enchanter", "Explorer", "Apprentice", "Magician", "Mystic Adept", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"}, MageEnabled: true,
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Astral Beacon"},
			},
		},
		Page: "72",
	},
	"bilingual": {
		Name:     "Bilingual",
		Karma:    "5",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			NativeLanguageLimit: "1",
		},
		Page:        "72",
		ChargenOnly: true,
	},
	"blandness": {
		Name:     "Blandness",
		Karma:    "8",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "-1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Distinctive Style"},
			},
		},
		Page: "72",
	},
	"catlike": {
		Name:     "Catlike",
		Karma:    "7",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Sneaking", Bonus: 2,
			},
		},
		Page:   "72",
		Mutant: "True",
	},
	"codeslinger": {
		Name:     "Codeslinger",
		Karma:    "10",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			ActionDicePool: &ActionDicePool{
				Category: "Matrix",
			},
		},
		Page: "72",
	},
	"double_jointed": {
		Name:     "Double Jointed",
		Karma:    "6",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Escape Artist", Bonus: 2,
			},
		},
		Page: "72",
	},
	"exceptional_attribute": {
		Name:     "Exceptional Attribute",
		Karma:    "14",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SelectAttributes: &SelectSkill{
				Max: "1", ExcludeAttribute: "EDG",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Lucky"},
			},
		},
		Page: "72",
	},
	"first_impression": {
		Name:     "First Impression",
		Karma:    "11",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "2",
			},
			Notoriety: "-1",
		},
		Page: "74",
	},
	"focused_concentration": {
		Name:     "Focused Concentration",
		Karma:    "4",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "6",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Barehanded Adept", "Aware", "Magician", "Mystic Adept", "Apprentice", "Aspected Magician", "Enchanter", "Explorer", "Technomancer", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"}, Power: "Adept Spell",
			},
		},
		Page: "74",
	},
	"gearhead": {
		Name:     "Gearhead",
		Karma:    "11",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "74",
	},
	"guts": {
		Name:     "Guts",
		Karma:    "10",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "74",
	},
	"high_pain_tolerance": {
		Name:     "High Pain Tolerance",
		Karma:    "7",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "3",
		Bonus: &QualityBonus{
			ConditionMonitor: &ConditionMonitorBonus{
				ThresholdOffset: "1",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Damage Compensators", "Damage Compensators (2050)"}, Power: "Pain Resistance",
			},
		},
		Page: "74",
	},
	"home_ground": {
		Name:     "Home Ground",
		Karma:    "10",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "74",
	},
	"human_looking": {
		Name:     "Human-Looking",
		Karma:    "6",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Elf", "Dwarf", "Ork"},
			},
		},
		Page: "75",
	},
	"indomitable_mental": {
		Name:     "Indomitable (Mental)",
		Karma:    "8",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "3",
		Bonus: &QualityBonus{
			MentalLimit: "1",
		},
		Page: "75",
		IncludeInLimit: &IncludeInLimit{
			Name: []interface{}{"Indomitable (Physical)", "Indomitable (Social)"},
		},
	},
	"indomitable_physical": {
		Name:     "Indomitable (Physical)",
		Karma:    "8",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "3",
		Bonus: &QualityBonus{
			PhysicalLimit: "1",
		},
		Page: "75",
		IncludeInLimit: &IncludeInLimit{
			Name: []interface{}{"Indomitable (Mental)", "Indomitable (Social)"},
		},
	},
	"indomitable_social": {
		Name:     "Indomitable (Social)",
		Karma:    "8",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "3",
		Bonus: &QualityBonus{
			SocialLimit: "1",
		},
		Page: "75",
		IncludeInLimit: &IncludeInLimit{
			Name: []interface{}{"Indomitable (Physical)", "Indomitable (Mental)"},
		},
	},
	"juryrigger": {
		Name:     "Juryrigger",
		Karma:    "10",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "75",
	},
	"lucky": {
		Name:     "Lucky",
		Karma:    "12",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
			Notoriety:         "-1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Exceptional Attribute"},
			},
		},
		Page: "76",
	},
	"magic_resistance": {
		Name:     "Magic Resistance",
		Karma:    "6",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "4",
		Bonus: &QualityBonus{
			SpellResistance: "1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Adept", "Aware", "Magician", "Mystic Adept", "Aspected Magician", "Enchanter", "Explorer", "Apprentice", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"},
			},
		},
		Page: "76",
	},
	"mentor_spirit": {
		Name:     "Mentor Spirit",
		Karma:    "5",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aspected Magician", "Aware", "Enchanter", "Explorer", "Apprentice", "Magician", "Mystic Adept"},
			},
		},
		Page: "76",
	},
	"natural_athlete": {
		Name:     "Natural Athlete",
		Karma:    "7",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Running", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Gymnastics", Bonus: 2,
			}},
		},
		Page: "76",
	},
	"natural_hardening": {
		Name:     "Natural Hardening",
		Karma:    "10",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "76",
	},
	"natural_immunity_natural": {
		Name:     "Natural Immunity (Natural)",
		Karma:    "4",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Weak Immune System"},
			},
		},
		Page: "76",
	},
	"natural_immunity_synthetic": {
		Name:     "Natural Immunity (Synthetic)",
		Karma:    "10",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Weak Immune System"},
			},
		},
		Page: "76",
	},
	"photographic_memory": {
		Name:     "Photographic Memory",
		Karma:    "6",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Memory: "2",
		},
		Page: "76",
	},
	"quick_healer": {
		Name:     "Quick Healer",
		Karma:    "3",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			StunCMRecovery:     "2",
			PhysicalCMRecovery: "2",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Uncanny Healer"},
			},
		},
		Page: "77",
	},
	"resistance_to_pathogens": {
		Name:     "Resistance to Pathogens",
		Karma:    "4",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			PathogenContactResist:    "1",
			PathogenIngestionResist:  "1",
			PathogenInhalationResist: "1",
			PathogenInjectionResist:  "1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resistance to Pathogens and Toxins", "Weak Immune System"},
			},
		},
		Page: "77",
	},
	"resistance_to_toxins": {
		Name:     "Resistance to Toxins",
		Karma:    "4",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			ToxinContactResist:    "1",
			ToxinIngestionResist:  "1",
			ToxinInhalationResist: "1",
			ToxinInjectionResist:  "1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resistance to Pathogens and Toxins", "Weak Immune System"},
			},
		},
		Page: "77",
	},
	"resistance_to_pathogenstoxins": {
		Name:     "Resistance to Pathogens/Toxins",
		Karma:    "8",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			ToxinContactResist:       "2",
			ToxinIngestionResist:     "2",
			ToxinInhalationResist:    "2",
			ToxinInjectionResist:     "2",
			PathogenContactResist:    "2",
			PathogenIngestionResist:  "2",
			PathogenInhalationResist: "2",
			PathogenInjectionResist:  "2",
		},
		Page: "77",
		Hide: true,
	},
	"resistance_to_pathogens_and_toxins": {
		Name:     "Resistance to Pathogens and Toxins",
		Karma:    "8",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			ToxinContactResist:       "1",
			ToxinIngestionResist:     "1",
			ToxinInhalationResist:    "1",
			ToxinInjectionResist:     "1",
			PathogenContactResist:    "1",
			PathogenIngestionResist:  "1",
			PathogenInhalationResist: "1",
			PathogenInjectionResist:  "1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resistance to Pathogens", "Resistance to Toxins", "Weak Immune System"},
			},
		},
		Page: "77",
	},
	"spirit_affinity": {
		Name:     "Spirit Affinity",
		Karma:    "7",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Aware", "Magician", "Mystic Adept", "Aspected Magician", "Enchanter", "Explorer", "Apprentice", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"},
			},
		},
		Page: "77",
	},
	"toughness": {
		Name:     "Toughness",
		Karma:    "9",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			DamageResistance: "1",
		},
		Page: "77",
	},
	"will_to_live": {
		Name:     "Will to Live",
		Karma:    "3",
		Category: "Positive",
		Source:   "SR5",
		Limit:    "3",
		Bonus: &QualityBonus{
			ConditionMonitor: nil,
		},
		Page: "77",
	},
	"deus_vult": {
		Name:     "Deus Vult!",
		Karma:    "4",
		Category: "Positive",
		Source:   "AP",
		Bonus:    nil,
		Page:     "16",
	},
	"my_country_right_or_wrong": {
		Name:     "My Country, Right or Wrong",
		Karma:    "4",
		Category: "Positive",
		Source:   "AP",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "17",
	},
	"out_for_myself": {
		Name:     "Out For Myself",
		Karma:    "4",
		Category: "Positive",
		Source:   "AP",
		Bonus: &QualityBonus{
			Surprise: "3",
		},
		Page: "17",
	},
	"strive_for_perfection": {
		Name:     "Strive For Perfection",
		Karma:    "12",
		Category: "Positive",
		Source:   "AP",
		Bonus:    nil,
		Page:     "17",
	},
	"acrobatic_defender": {
		Name:     "Acrobatic Defender",
		Karma:    "4",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Page:     "127",
	},
	"agile_defender": {
		Name:     "Agile Defender",
		Karma:    "3",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Page:     "127",
	},
	"brand_loyalty_manufacturer": {
		Name:     "Brand Loyalty (Manufacturer)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RG",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "127",
	},
	"brand_loyalty_product": {
		Name:     "Brand Loyalty (Product)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RG",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "127",
	},
	"one_trick_pony": {
		Name:     "One Trick Pony",
		Karma:    "7",
		Category: "Positive",
		Source:   "RG",
		Bonus: &QualityBonus{
			MartialArt: "One Trick Pony",
		},
		Page: "127",
	},
	"perceptive_defender": {
		Name:     "Perceptive Defender",
		Karma:    "4",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Page:     "127",
	},
	"sharpshooter": {
		Name:     "Sharpshooter",
		Karma:    "4",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Page:     "127",
	},
	"too_pretty_to_hit": {
		Name:     "Too Pretty To Hit",
		Karma:    "3",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Page:     "127",
	},
	"radiation_sponge": {
		Name:     "Radiation Sponge",
		Karma:    "5",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Rad-Tolerant"},
			},
		},
		Page: "169",
	},
	"rad_tolerant": {
		Name:     "Rad-Tolerant",
		Karma:    "3",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Radiation Sponge"},
			},
		},
		Page: "169",
	},
	"spacer": {
		Name:     "Spacer",
		Karma:    "3",
		Category: "Positive",
		Source:   "RG",
		Bonus:    nil,
		Page:     "169",
	},
	"low_light_vision": {
		Name:     "Low-Light Vision",
		Karma:    "4",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "66",
		Hide:     true,
	},
	"thermographic_vision": {
		Name:     "Thermographic Vision",
		Karma:    "3",
		Category: "Positive",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "66",
		Hide:     true,
	},
	"magician": {
		Name:     "Magician",
		Karma:    "30",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			UnlockSkills:    "Magician",
			EnableAttribute: "",
			EnableTab:       "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Adept", "Mystic Adept", "Aspected Magician", "Enchanter", "Explorer", "Aware", "Apprentice"},
			},
		},
		Page:              "69",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
		NameOnPage:        "Magicians",
	},
	"adept": {
		Name:     "Adept",
		Karma:    "20",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			LimitSpellCategory:   "Rituals",
			BlockSpellDescriptor: "Spell",
			UnlockSkills:         "Adept",
			EnableAttribute:      "",
			EnableTab:            "",
			UseSelected:          "False",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Aware", "Magician", "Mystic Adept", "Aspected Magician", "Enchanter", "Explorer", "Apprentice"},
			},
		},
		Page:              "69",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
		NameOnPage:        "Adepts",
	},
	"mystic_adept": {
		Name:     "Mystic Adept",
		Karma:    "35",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			UnlockSkills:    "Magician",
			EnableAttribute: "",
			EnableTab:       "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Aware", "Magician", "Adept", "Aspected Magician", "Enchanter", "Explorer", "Apprentice"},
			},
		},
		Page:              "69",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
		NameOnPage:        "Mystic Adepts",
	},
	"technomancer": {
		Name:     "Technomancer",
		Karma:    "15",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Computer", Bonus: 2,
			},
			AddGear:         "",
			UnlockSkills:    "Technomancer",
			EnableAttribute: "",
			EnableTab:       "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Latent Dracomorphosis"},
			},
		},
		Page:              "69",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
	},
	"aspected_magician": {
		Name:     "Aspected Magician",
		Karma:    "15",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			UnlockSkills:    "Sorcery,Conjuring,Enchanting",
			EnableAttribute: "",
			EnableTab:       "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Aware", "Enchanter", "Explorer", "Apprentice", "Magician", "Mystic Adept", "Adept"},
			},
		},
		Page:              "69",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
		NameOnPage:        "Aspected Magicians",
	},
	"aware": {
		Name:     "Aware",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			UnlockSkills:    "Aware",
			EnableAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Apprentice", "Aspected Magician", "Enchanter", "Explorer", "Magician", "Mystic Adept", "Adept", "Technomancer"},
			},
		},
		Page:              "49",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
	},
	"addiction_mild": {
		Name:     "Addiction (Mild)",
		Karma:    "-4",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
			Notoriety:  "1",
		},
		Page: "77",
	},
	"addiction_moderate": {
		Name:     "Addiction (Moderate)",
		Karma:    "-9",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
			Notoriety:  "1",
		},
		Page: "78",
	},
	"addiction_severe": {
		Name:     "Addiction (Severe)",
		Karma:    "-20",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
			Notoriety:  "1",
		},
		Page: "78",
	},
	"addiction_burnout": {
		Name:     "Addiction (Burnout)",
		Karma:    "-25",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "-3",
			},
			SelectText: &common.SelectTextBonus{},
			Notoriety:  "1",
		},
		Page: "78",
	},
	"allergy_uncommon_mild": {
		Name:     "Allergy (Uncommon, Mild)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"allergy_uncommon_moderate": {
		Name:     "Allergy (Uncommon, Moderate)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"allergy_uncommon_severe": {
		Name:     "Allergy (Uncommon, Severe)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"allergy_uncommon_extreme": {
		Name:     "Allergy (Uncommon, Extreme)",
		Karma:    "-20",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"allergy_common_mild": {
		Name:     "Allergy (Common, Mild)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"allergy_common_moderate": {
		Name:     "Allergy (Common, Moderate)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"allergy_common_severe": {
		Name:     "Allergy (Common, Severe)",
		Karma:    "-20",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"allergy_common_extreme": {
		Name:     "Allergy (Common, Extreme)",
		Karma:    "-25",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "78",
	},
	"astral_beacon": {
		Name:     "Astral Beacon",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Centaur", "Naga", "Pixie", "Sasquatch"}, Quality: []string{"Adept", "Aware", "Aspected Magician", "Enchanter", "Explorer", "Apprentice", "Magician", "Mystic Adept", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"}, MageEnabled: true,
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Astral Chameleon"},
			},
		},
		Page: "78",
	},
	"bad_luck": {
		Name:     "Bad Luck",
		Karma:    "-12",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Page: "79",
	},
	"bad_rep": {
		Name:     "Bad Rep",
		Karma:    "-7",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "3",
		},
		Page: "79",
	},
	"code_of_honor": {
		Name:     "Code of Honor",
		Karma:    "-15",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "79",
	},
	"codeblock": {
		Name:     "Codeblock",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "80",
	},
	"combat_paralysis": {
		Name:     "Combat Paralysis",
		Karma:    "-12",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "1",
			Surprise:  "-3",
		},
		Page: "80",
	},
	"dependent_nuisance": {
		Name:     "Dependent (Nuisance)",
		Karma:    "-3",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			LifestyleCost: "10",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dependent (Inconvenience)", "Dependent (Demanding)"},
			},
		},
		Page: "80",
	},
	"dependent_inconvenience": {
		Name:     "Dependent (Inconvenience)",
		Karma:    "-6",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			LifestyleCost: "20",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dependent (Nuisance)", "Dependent (Demanding)"},
			},
		},
		Page: "80",
	},
	"dependent_demanding": {
		Name:     "Dependent (Demanding)",
		Karma:    "-9",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			LifestyleCost: "30",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dependent (Nuisance)", "Dependent (Inconvenience)"},
			},
		},
		Page: "80",
	},
	"distinctive_style": {
		Name:     "Distinctive Style",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SR5",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Blandness"},
			},
		},
		Page: "80",
	},
	"elf_poser": {
		Name:     "Elf Poser",
		Karma:    "-6",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Human",
			},
		},
		Page: "81",
	},
	"gremlins": {
		Name:            "Gremlins",
		Karma:           "-4",
		Category:        "Negative",
		Source:          "SR5",
		Limit:           "4",
		Page:            "81",
		FirstLevelBonus: false,
	},
	"incompetent": {
		Name:     "Incompetent",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Page: "81",
	},
	"insomnia_basic": {
		Name:     "Insomnia (Basic)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Insomnia (Full)"},
			},
		},
		Page: "81",
	},
	"insomnia_full": {
		Name:     "Insomnia (Full)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "SR5",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Insomnia (Basic)"},
			},
		},
		Page: "81",
	},
	"loss_of_confidence": {
		Name:     "Loss of Confidence",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectSkill: &SelectSkill{
				Val: "-2",
			},
		},
		Page: "82",
	},
	"low_pain_tolerance": {
		Name:     "Low Pain Tolerance",
		Karma:    "-9",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			ConditionMonitor: nil,
		},
		Page: "82",
	},
	"ork_poser": {
		Name:     "Ork Poser",
		Karma:    "-6",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Human", "Elf"},
			},
		},
		Page: "82",
	},
	"prejudiced_common_biased": {
		Name:     "Prejudiced (Common, Biased)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "82",
	},
	"prejudiced_common_outspoken": {
		Name:     "Prejudiced (Common, Outspoken)",
		Karma:    "-7",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "82",
	},
	"prejudiced_common_radical": {
		Name:     "Prejudiced (Common, Radical)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "82",
	},
	"prejudiced_specific_biased": {
		Name:     "Prejudiced (Specific, Biased)",
		Karma:    "-3",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "82",
	},
	"prejudiced_specific_outspoken": {
		Name:     "Prejudiced (Specific, Outspoken)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "82",
	},
	"prejudiced_specific_radical": {
		Name:     "Prejudiced (Specific, Radical)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "82",
	},
	"scorched": {
		Name:     "Scorched",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
			Notoriety:  "1",
		},
		Page: "83",
	},
	"sensitive_system": {
		Name:     "Sensitive System",
		Karma:    "-12",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			CyberwareTotalEssMultiplier: "200",
		},
		Page: "83",
	},
	"simsense_vertigo": {
		Name:     "Simsense Vertigo",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "83",
	},
	"sinner_corporate": {
		Name:     "SINner (Corporate)",
		Karma:    "-25",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"SINner (Criminal)", "SINner (National)", "SINner (Corporate Limited)"},
			},
		},
		Page: "85",
	},
	"sinner_national": {
		Name:     "SINner (National)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"SINner (Criminal)", "SINner (Corporate)", "SINner (Corporate Limited)"},
			},
		},
		Page: "84",
	},
	"sinner_corporate_limited": {
		Name:     "SINner (Corporate Limited)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"SINner (Criminal)", "SINner (National)", "SINner (Corporate)"},
			},
		},
		Page: "84",
	},
	"sinner_criminal": {
		Name:     "SINner (Criminal)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
			Notoriety:  "1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"SINner (Corporate)", "SINner (National)", "SINner (Corporate Limited)"},
			},
		},
		Page: "84",
	},
	"social_stress": {
		Name:     "Social Stress",
		Karma:    "-8",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "85",
	},
	"spirit_bane": {
		Name:     "Spirit Bane",
		Karma:    "-7",
		Category: "Negative",
		Source:   "SR5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: nil,
			Notoriety:  "1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Aspected Magician", "Enchanter", "Explorer", "Apprentice", "Aware", "Adept", "Magician", "Mystic Adept", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"},
			},
		},
		Page: "85",
	},
	"uncouth": {
		Name:     "Uncouth",
		Karma:    "-14",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			SkillGroupCategoryDisable: "Social Active",
			Notoriety:                 "1",
		},
		Page: "85",
	},
	"consummate_professional": {
		Name:     "Consummate Professional",
		Karma:    "-3",
		Category: "Negative",
		Source:   "AP",
		Bonus: &QualityBonus{
			StreetCredMultiplier: "10",
		},
		Page: "17",
	},
	"combat_junkie": {
		Name:     "Combat Junkie",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RG",
		Bonus:    nil,
		Page:     "127",
	},
	"blighted_6_months": {
		Name:     "Blighted (6 Months)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RG",
		Bonus:    nil,
		Page:     "169",
	},
	"blighted_12_months": {
		Name:     "Blighted (12 Months)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RG",
		Bonus:    nil,
		Page:     "169",
	},
	"blighted_24_months": {
		Name:     "Blighted (24 Months)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RG",
		Bonus:    nil,
		Page:     "169",
	},
	"earther": {
		Name:     "Earther",
		Karma:    "-3",
		Category: "Negative",
		Source:   "RG",
		Bonus:    nil,
		Page:     "169",
	},
	"uneducated": {
		Name:     "Uneducated",
		Karma:    "-8",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			BlockSkillCategoryDefaulting: []interface{}{"Professional", "Academic", "Technical Active"},
			Notoriety:                    "1",
			SkillCategorySpecializationKarmaCostMultiplier: "",
			SkillGroupCategoryKarmaCostMultiplier:          "",
		},
		Page: "87",
	},
	"unsteady_hands": {
		Name:     "Unsteady Hands",
		Karma:    "-7",
		Category: "Negative",
		Source:   "SR5",
		Bonus:    nil,
		Page:     "87",
	},
	"weak_immune_system": {
		Name:     "Weak Immune System",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SR5",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resistance to Pathogens", "Resistance to Toxins", "Resistance to Pathogens and Toxins", "Natural Immunity (Natural)", "Natural Immunity (Synthetic)"},
			},
		},
		Page: "87",
	},
	"tattoo_magic": {
		Name:     "Tattoo Magic",
		Karma:    "5",
		Category: "Positive",
		Source:   "SG",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Apprentice", "Aspected Magician", "Enchanter", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:         "131",
		DoubleCareer: false,
	},
	"spirit_champion": {
		Name:     "Spirit Champion",
		Karma:    "14",
		Category: "Positive",
		Source:   "SG",
		Bonus:    nil,
		Page:     "199",
	},
	"the_artisans_way": {
		Name:     "The Artisan's Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			FocusBindingKarmaCost: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artist's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "176",
		DoubleCareer: false,
	},
	"the_artists_way": {
		Name:     "The Artist's Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			FocusBindingKarmaCost: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "176",
		DoubleCareer: false,
	},
	"the_athletes_way": {
		Name:     "The Athlete's Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			FocusBindingKarmaCost: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artist's Way", "The Artisan's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "176",
		DoubleCareer: false,
	},
	"the_beasts_way": {
		Name:     "The Beast's Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Animal Handling", Bonus: 1,
			},
			FreeQuality: []string{"ced3fecf-2277-4b20-b1e0-894162ca9ae2"},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Athlete's Way", "The Artist's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "176",
		DoubleCareer: false,
		CostDiscount: "",
	},
	"the_burnouts_way": {
		Name:     "The Burnout's Way",
		Karma:    "15",
		Category: "Positive",
		Source:   "SG",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Athlete's Way", "The Beast's Way", "The Artist's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "177",
		DoubleCareer: false,
	},
	"the_invisible_way": {
		Name:     "The Invisible Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			FocusBindingKarmaCost: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Artist's Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "177",
		DoubleCareer: false,
	},
	"the_magicians_way": {
		Name:     "The Magician's Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			MagiciansWayDiscount: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Artist's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "178",
		DoubleCareer: false,
	},
	"the_speakers_way": {
		Name:     "The Speaker's Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			FocusBindingKarmaCost: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Artist's Way", "The Spiritual Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "178",
		DoubleCareer: false,
	},
	"the_spiritual_way": {
		Name:     "The Spiritual Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Conjuring", Bonus: "1", Condition: "",
			},
			FreeQuality: []string{"ced3fecf-2277-4b20-b1e0-894162ca9ae2"},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Artist's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Twisted Way", "The Warrior's Way"},
			},
		},
		Page:         "178",
		DoubleCareer: false,
	},
	"the_twisted_way": {
		Name:     "The Twisted Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Apprentice", "Aspected Magician", "Enchanter", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Artist's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Warrior's Way"},
			},
		},
		Page:         "85",
		DoubleCareer: false,
	},
	"the_warriors_way": {
		Name:     "The Warrior's Way",
		Karma:    "20",
		Category: "Positive",
		Source:   "SG",
		Bonus: &QualityBonus{
			FocusBindingKarmaCost: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"The Artisan's Way", "The Artist's Way", "The Athlete's Way", "The Beast's Way", "The Burnout's Way", "The Invisible Way", "The Magician's Way", "The Speaker's Way", "The Spiritual Way", "The Twisted Way"},
			},
		},
		Page:         "178",
		DoubleCareer: false,
	},
	"spirit_pariah": {
		Name:     "Spirit Pariah",
		Karma:    "-14",
		Category: "Negative",
		Source:   "SG",
		Bonus:    nil,
		Page:     "199",
	},
	"conjuring_geas": {
		Name:     "Conjuring Geas",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SG",
		Bonus: &QualityBonus{
			AstralReputation: "-1",
		},
		Page:       "199",
		CareerOnly: true,
	},
	"gifted_healer": {
		Name:     "Gifted Healer",
		Karma:    "2",
		Category: "Positive",
		Source:   "BB",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "11",
	},
	"aged": {
		Name:     "Aged",
		Karma:    "-7",
		Category: "Negative",
		Source:   "BB",
		Limit:    "3",
		Bonus: &QualityBonus{
			SpecificAttribute:    []interface{}{nil, nil, nil, nil},
			KnowledgeskillPoints: "",
		},
		Page: "12",
	},
	"illness": {
		Name:     "Illness",
		Karma:    "-5",
		Category: "Negative",
		Source:   "BB",
		Limit:    "3",
		Bonus:    nil,
		Page:     "12",
	},
	"pregnant": {
		Name:     "Pregnant",
		Karma:    "-9",
		Category: "Negative",
		Source:   "BB",
		Bonus:    nil,
		Page:     "12",
	},
	"college_education": {
		Name:     "College Education",
		Karma:    "2",
		Category: "Positive",
		Source:   "SASS",
		Bonus: &QualityBonus{
			LimitModifier: &common.LimitModifier{
				Limit: "Mental", Value: "1", Condition: "LimitCondition_SkillsKnowledgeAcademic",
			},
		},
		Page: "31",
	},
	"inspired": {
		Name:     "Inspired",
		Karma:    "4",
		Category: "Positive",
		Source:   "SASS",
		Bonus: &QualityBonus{
			SelectExpertise: "",
		},
		Page: "31",
	},
	"changeling_class_i_surge": {
		Name:     "Changeling (Class I SURGE)",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			MetagenicLimit: "30",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Changeling (Class II SURGE)", "Changeling (Class III SURGE)", "Latent Dracomorphosis"},
			},
		},
		Page:              "103",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"changeling_class_ii_surge": {
		Name:     "Changeling (Class II SURGE)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			MetagenicLimit: "30",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class III SURGE)", "Latent Dracomorphosis"},
			},
		},
		Page:              "103",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"changeling_class_iii_surge": {
		Name:     "Changeling (Class III SURGE)",
		Karma:    "30",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			MetagenicLimit: "30",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Latent Dracomorphosis"},
			},
		},
		Page:              "103",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"adrenaline_surge": {
		Name:     "Adrenaline Surge",
		Karma:    "12",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "145",
	},
	"animal_empathy": {
		Name:     "Animal Empathy",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Animal Handling", Bonus: 2,
			},
		},
		Page: "145",
	},
	"black_market_pipeline": {
		Name:     "Black Market Pipeline",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			BlackMarketDiscount: "",
		},
		Page:        "145",
		ChargenOnly: true,
	},
	"born_rich": {
		Name:     "Born Rich",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			NuyenMaxBP: "30",
		},
		Page:        "145",
		ChargenOnly: true,
	},
	"city_slicker": {
		Name:     "City Slicker",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -1,
			}, common.SpecificSkillBonus{
				Name: "Survival", Bonus: -1,
			}, common.SpecificSkillBonus{
				Name: "Survival", Bonus: 2,
			}},
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Outdoors", Bonus: "1", Condition: "Urban",
			},
		},
		Page: "145",
	},
	"college_education_0": {
		Name:     "College Education",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategoryKarmaCost:                         "",
			SkillCategorySpecializationKarmaCostMultiplier: "",
		},
		Page: "145",
	},
	"common_sense": {
		Name:     "Common Sense",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "145",
	},
	"daredevil": {
		Name:     "Daredevil",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "146",
	},
	"digital_doppelganger": {
		Name:     "Digital Doppelganger",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"SINner (Criminal)", "SINner (National)", "SINner (Corporate Limited)", "SINner (Corporate)"},
			},
		},
		Page: "146",
	},
	"disgraced": {
		Name:     "Disgraced",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "146",
	},
	"erased": {
		Name:     "Erased",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			Erased: "",
		},
		Page: "146",
	},
	"fame_local": {
		Name:     "Fame: Local",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			LimitModifier: &common.LimitModifier{
				Limit: "Social", Value: "1", Condition: "LimitCondition_Sprawl",
			},
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "1",
			},
			PublicAwareness: "2",
			Fame:            "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Fame: National", "Fame: Megacorporate", "Fame: Global"},
			},
		},
		Page: "146",
	},
	"fame_national": {
		Name:     "Fame: National",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			LimitModifier: &common.LimitModifier{
				Limit: "Social", Value: "1", Condition: "LimitCondition_NationalLanguageRanks",
			},
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "2",
			},
			PublicAwareness: "3",
			Fame:            "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Fame: Local", "Fame: Megacorporate", "Fame: Global"},
			},
		},
		Page: "146",
	},
	"fame_megacorporate": {
		Name:     "Fame: Megacorporate",
		Karma:    "12",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			LimitModifier: &common.LimitModifier{
				Limit: "Social", Value: "2", Condition: "LimitCondition_Megacorp",
			},
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "2",
			},
			PublicAwareness: "5",
			Fame:            "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Fame: National", "Fame: Local", "Fame: Global"},
			},
		},
		Page: "147",
	},
	"fame_global": {
		Name:     "Fame: Global",
		Karma:    "16",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			LimitModifier: nil,
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "3",
			},
			PublicAwareness: "8",
			Fame:            "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Fame: National", "Fame: Megacorporate", "Fame: Local"},
			},
		},
		Page: "147",
	},
	"friends_in_high_places": {
		Name:     "Friends in High Places",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			FriendsInHighPlaces: "",
		},
		Page: "147",
	},
	"hawk_eye": {
		Name:     "Hawk Eye",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: 1,
			},
		},
		Page: "147",
	},
	"inspired_0": {
		Name:     "Inspired",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectSkill: &SelectSkill{
				Val: "1",
			},
		},
		Page: "147",
	},
	"jack_of_all_trades_master_of_none": {
		Name:     "Jack of All Trades Master of None",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			KnowledgeskillKarmaCost:    "",
			KnowledgeskillKarmaCostMin: "",
			ActiveskillKarmaCost:       "",
		},
		Page: "147",
	},
	"lightning_reflexes": {
		Name:     "Lightning Reflexes",
		Karma:    "20",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			Initiative: &InitiativeBonus{
				Content: "1", Precedence: "0",
			},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "0",
			},
			Dodge: "1",
		},
		Page: "148",
	},
	"linguist": {
		Name:     "Linguist",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Language", Bonus: "1",
			},
			SkillCategoryKarmaCost: "",
		},
		Page: "148",
	},
	"made_man": {
		Name:     "Made Man",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			AddContact: "",
			MadeMan:    "",
		},
		Page: "148",
	},
	"night_vision": {
		Name:     "Night Vision",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "148",
	},
	"outdoorsman": {
		Name:     "Outdoorsman",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -1,
			}, common.SpecificSkillBonus{
				Name: "Survival", Bonus: -1,
			}},
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Outdoors", Bonus: "2", Condition: "Rural",
			}, &common.SkillGroupBonus{
				Name: "Outdoors", Bonus: "2", Condition: "Desert",
			}, &common.SkillGroupBonus{
				Name: "Outdoors", Bonus: "2", Condition: "Forest",
			}, &common.SkillGroupBonus{
				Name: "Outdoors", Bonus: "2", Condition: "Jungle",
			}, &common.SkillGroupBonus{
				Name: "Outdoors", Bonus: "2", Condition: "Mountain",
			}, &common.SkillGroupBonus{
				Name: "Outdoors", Bonus: "2", Condition: "Polar",
			}},
		},
		Page: "148",
	},
	"overclocker": {
		Name:     "Overclocker",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "148",
	},
	"perceptive": {
		Name:     "Perceptive",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Limit:    "2",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: 1,
			}, common.SpecificSkillBonus{
				Name: "Assensing", Bonus: 1,
			}},
		},
		Page: "148",
	},
	"perfect_time": {
		Name:     "Perfect Time",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "148",
	},
	"poor_link": {
		Name:     "Poor Link",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "148",
	},
	"privileged_family_name": {
		Name:     "Privileged Family Name",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"SINner (National)", "SINner (Corporate)"},
			},
		},
		Page: "149",
	},
	"rank_neither_military_nor_law_enforcement_i": {
		Name:     "Rank (Neither Military nor Law Enforcement) I",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "86",
	},
	"rank_neither_military_nor_law_enforcement_ii": {
		Name:     "Rank (Neither Military nor Law Enforcement) II",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "86",
	},
	"rank_neither_military_nor_law_enforcement_iii": {
		Name:     "Rank (Neither Military nor Law Enforcement) III",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "86",
	},
	"rank_military_or_law_enforcement_i": {
		Name:     "Rank (Military or Law Enforcement) I",
		Karma:    "20",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "86",
	},
	"rank_military_or_law_enforcement_ii": {
		Name:     "Rank (Military or Law Enforcement) II",
		Karma:    "25",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "86",
	},
	"rank_military_or_law_enforcement_iii": {
		Name:     "Rank (Military or Law Enforcement) III",
		Karma:    "30",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "86",
	},
	"restricted_gear": {
		Name:     "Restricted Gear",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Limit:    "3",
		Bonus: &QualityBonus{
			RestrictGear: "",
		},
		Page:         "149",
		NoLevels:     true,
		ChargenLimit: "1",
	},
	"school_of_hard_knocks": {
		Name:     "School of Hard Knocks",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategoryKarmaCost: "",
		},
		Page: "149",
	},
	"sense_of_direction": {
		Name:     "Sense of Direction",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Navigation", Bonus: 1,
			},
		},
		Page: "149",
	},
	"sensei": {
		Name:     "Sensei",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Page: "149",
	},
	"solid_rep": {
		Name:     "Solid Rep",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Legendary Rep"},
			},
		},
		Page: "149",
	},
	"legendary_rep": {
		Name:     "Legendary Rep",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Solid Rep"},
			},
		},
		Page: "149",
	},
	"speed_reading": {
		Name:     "Speed Reading",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "149",
	},
	"spike_resistance": {
		Name:     "Spike Resistance",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Limit:    "3",
		Bonus:    nil,
		Page:     "150",
	},
	"spirit_whisperer": {
		Name:     "Spirit Whisperer",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Aspected Magician", "Enchanter", "Explorer", "Apprentice", "Magician", "Adept", "Mystic Adept", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"},
			},
		},
		Page: "150",
	},
	"steely_eyed_wheelman": {
		Name:     "Steely Eyed Wheelman",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Page:     "150",
	},
	"technical_school_education": {
		Name:     "Technical School Education",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategoryKarmaCost: "",
		},
		Page: "150",
	},
	"tough_as_nails_physical": {
		Name:     "Tough as Nails (Physical)",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Limit:    "3",
		Bonus: &QualityBonus{
			ConditionMonitor: nil,
		},
		Page:                  "150",
		LimitWithinInclusions: true,
		IncludeInLimit: &IncludeInLimit{
			Name: "Tough as Nails (Stun)",
		},
	},
	"tough_as_nails_stun": {
		Name:     "Tough as Nails (Stun)",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Limit:    "3",
		Bonus: &QualityBonus{
			ConditionMonitor: nil,
		},
		Page:                  "150",
		LimitWithinInclusions: true,
		IncludeInLimit: &IncludeInLimit{
			Name: "Tough as Nails (Physical)",
		},
	},
	"trust_fund_i": {
		Name:     "Trust Fund I",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			TrustFund: "1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"SINner (National)", "SINner (Corporate)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Trust Fund II", "Trust Fund III", "Trust Fund IV"},
			},
		},
		Page: "151",
	},
	"trust_fund_ii": {
		Name:     "Trust Fund II",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			TrustFund: "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"SINner (National)", "SINner (Corporate)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Trust Fund I", "Trust Fund III", "Trust Fund IV"},
			},
		},
		Page: "151",
	},
	"trust_fund_iii": {
		Name:     "Trust Fund III",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			TrustFund: "3",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"SINner (National)", "SINner (Corporate)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Trust Fund I", "Trust Fund II", "Trust Fund IV"},
			},
		},
		Page: "151",
	},
	"trust_fund_iv": {
		Name:     "Trust Fund IV",
		Karma:    "20",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			TrustFund: "4",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"SINner (National)", "SINner (Corporate)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Trust Fund I", "Trust Fund II", "Trust Fund III"},
			},
		},
		Page: "151",
	},
	"trustworthy": {
		Name:     "Trustworthy",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			LimitModifier: &common.LimitModifier{
				Limit: "Social", Value: "2", Condition: "LimitCondition_QualityTrustworthy",
			},
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Influence", Bonus: "1", Condition: "",
			},
		},
		Page: "151",
	},
	"vehicle_empathy": {
		Name:     "Vehicle Empathy",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Vehicle Active", Bonus: "1",
			},
		},
		Page: "151",
	},
	"water_sprite": {
		Name:     "Water Sprite",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Diving", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Swimming", Bonus: 2,
			}},
		},
		Page: "151",
	},
	"witness_my_hate": {
		Name:     "Witness My Hate",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpellDescriptorDamage: "",
			SpellDescriptorDrain:  "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Aspected Magician", "Magician"},
			},
		},
		Page: "151",
	},
	"albinism_i": {
		Name:     "Albinism I",
		Karma:    "-4",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Albinism II"},
			},
		},
		Page: "151",
	},
	"albinism_ii": {
		Name:     "Albinism II",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Albinism I"},
			},
		},
		Page: "151",
	},
	"amnesia_surface_loss": {
		Name:     "Amnesia (Surface Loss)",
		Karma:    "-4",
		Category: "Negative",
		Source:   "RF",
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Amnesia (Neural Deletion)"},
			},
		},
		Page: "152",
	},
	"amnesia_neural_deletion": {
		Name:     "Amnesia (Neural Deletion)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Amnesia (Surface Loss)"},
			},
		},
		Page: "152",
	},
	"asthma": {
		Name:     "Asthma",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "152",
	},
	"bi_polar": {
		Name:     "Bi-Polar",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "152",
	},
	"big_regret": {
		Name:     "Big Regret",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "153",
	},
	"blind": {
		Name:     "Blind",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Reduced Sense (Sight)"},
			},
		},
		Page:         "153",
		CostDiscount: "",
	},
	"borrowed_time": {
		Name:     "Borrowed Time",
		Karma:    "-20",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "153",
	},
	"carrier_hmhvv_strain_ii": {
		Name:     "Carrier (HMHVV Strain II)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Page: "141",
	},
	"carrier_hmhvv_strain_iii": {
		Name:     "Carrier (HMHVV Strain III)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Page: "141",
	},
	"computer_illiterate": {
		Name:     "Computer Illiterate",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Electronics", Bonus: "-4", Condition: "",
			},
		},
		Page: "153",
	},
	"creature_of_comfort_middle": {
		Name:     "Creature of Comfort (Middle)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Creature of Comfort (High)", "Creature of Comfort (Luxury)"},
			},
		},
		Page: "153",
	},
	"creature_of_comfort_high": {
		Name:     "Creature of Comfort (High)",
		Karma:    "-17",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Creature of Comfort (Middle)", "Creature of Comfort (Luxury)"},
			},
		},
		Page: "153",
	},
	"creature_of_comfort_luxury": {
		Name:     "Creature of Comfort (Luxury)",
		Karma:    "-25",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Creature of Comfort (Middle)", "Creature of Comfort (High)"},
			},
		},
		Page: "153",
	},
	"day_job_10_hrs": {
		Name:     "Day Job (10 hrs)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Day Job (20 hrs)", "Day Job (40 hrs)"},
			},
		},
		Page: "154",
	},
	"day_job_20_hrs": {
		Name:     "Day Job (20 hrs)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Day Job (10 hrs)", "Day Job (40 hrs)"},
			},
		},
		Page: "154",
	},
	"day_job_40_hrs": {
		Name:     "Day Job (40 hrs)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Day Job (10 hrs)", "Day Job (20 hrs)"},
			},
		},
		Page: "154",
	},
	"deaf": {
		Name:     "Deaf",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Reduced Sense (Hearing)"},
			},
		},
		Page: "154",
	},
	"did_you_just_call_me_dumb": {
		Name:     "Did You Just Call Me Dumb?",
		Karma:    "-3",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "154",
	},
	"dimmer_bulb": {
		Name:     "Dimmer Bulb",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Limit:    "3",
		Bonus: &QualityBonus{
			SkillAttribute:                        nil,
			Dodge:                                 "-Rating",
			Memory:                                "-Rating",
			Surprise:                              "-Rating",
			JudgeIntentionsOffense:                "-Rating",
			DecreaseIntResist:                     "-Rating",
			DecreaseLogResist:                     "-Rating",
			DetectionSpellResist:                  "-Rating",
			ManaIllusionResist:                    "-Rating",
			MentalManipulationResist:              "-Rating",
			PhysicalIllusionResist:                "-Rating",
			PhysiologicalAddictionFirstTime:       "-Rating",
			PhysiologicalAddictionAlreadyAddicted: "-Rating",
		},
		Page: "154",
	},
	"driven": {
		Name:     "Driven",
		Karma:    "-2",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "154",
	},
	"emotional_attachment": {
		Name:     "Emotional Attachment",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "154",
	},
	"ex_con": {
		Name:     "Ex-Con",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			AddQuality: nil,
			ExCon:      "",
		},
		Page: "155",
	},
	"flashbacks_i": {
		Name:     "Flashbacks I",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "155",
	},
	"flashbacks_ii": {
		Name:     "Flashbacks II",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "155",
	},
	"hobo_with_a_shotgun": {
		Name:     "Hobo with a Shotgun",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "155",
	},
	"hung_out_to_dry": {
		Name:     "Hung Out to Dry",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "155",
	},
	"illiterate": {
		Name:     "Illiterate",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "155",
	},
	"in_debt": {
		Name:     "In Debt",
		Karma:    "-1",
		Category: "Negative",
		Source:   "RF",
		Limit:    "15",
		Bonus: &QualityBonus{
			NuyenAmt:   "5000",
			NuyenMaxBP: "-1",
		},
		Page: "156",
	},
	"incomplete_deprogramming": {
		Name:     "Incomplete Deprogramming",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "156",
	},
	"infirm": {
		Name:     "Infirm",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Limit:    "5",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{nil, nil, nil, nil},
		},
		Page:            "156",
		FirstLevelBonus: false,
	},
	"liar": {
		Name:     "Liar",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			LimitModifier: nil,
		},
		Page: "156",
	},
	"night_blindness": {
		Name:     "Night Blindness",
		Karma:    "-6",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "156",
	},
	"oblivious_i": {
		Name:     "Oblivious I",
		Karma:    "-6",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Oblivious II"},
			},
		},
		Page: "157",
	},
	"oblivious_ii": {
		Name:     "Oblivious II",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Oblivious I"},
			},
		},
		Page: "157",
	},
	"pacifist_i": {
		Name:     "Pacifist I",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Pacifist II"},
			},
		},
		Page: "157",
	},
	"pacifist_ii": {
		Name:     "Pacifist II",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Pacifist I"},
			},
		},
		Page: "157",
	},
	"paranoia": {
		Name:     "Paranoia",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "157",
	},
	"paraplegic": {
		Name:     "Paraplegic",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			LifestyleCost:      "10",
			BasicLifestyleCost: "10",
		},
		Page: "157",
	},
	"phobia_uncommon_mild": {
		Name:     "Phobia (Uncommon, Mild)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "157",
	},
	"phobia_uncommon_moderate": {
		Name:     "Phobia (Uncommon, Moderate)",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "157",
	},
	"phobia_uncommon_severe": {
		Name:     "Phobia (Uncommon, Severe)",
		Karma:    "-12",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "157",
	},
	"phobia_common_mild": {
		Name:     "Phobia (Common, Mild)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "157",
	},
	"phobia_common_moderate": {
		Name:     "Phobia (Common, Moderate)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "157",
	},
	"phobia_common_severe": {
		Name:     "Phobia (Common, Severe)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "157",
	},
	"pie_iesu_domine_dona_eis_requiem": {
		Name:     "Pie Iesu Domine. Dona Eis Requiem.",
		Karma:    "-2",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			AddQuality: nil,
		},
		Page: "158",
	},
	"poor_self_control_braggart": {
		Name:     "Poor Self Control (Braggart)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "158",
	},
	"poor_self_control_compulsive_i_personal": {
		Name:     "Poor Self Control (Compulsive I, Personal)",
		Karma:    "-4",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_ii_personal": {
		Name:     "Poor Self Control (Compulsive II, Personal)",
		Karma:    "-6",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_iii_personal": {
		Name:     "Poor Self Control (Compulsive III, Personal)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_iv_personal": {
		Name:     "Poor Self Control (Compulsive IV, Personal)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_i_public_single_aspect": {
		Name:     "Poor Self Control (Compulsive I, Public Single Aspect)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_ii_public_single_aspect": {
		Name:     "Poor Self Control (Compulsive II, Public Single Aspect)",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_iii_public_single_aspect": {
		Name:     "Poor Self Control (Compulsive III, Public Single Aspect)",
		Karma:    "-9",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_iv_public_single_aspect": {
		Name:     "Poor Self Control (Compulsive IV, Public Single Aspect)",
		Karma:    "-11",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_i_public_broad_aspect": {
		Name:     "Poor Self Control (Compulsive I, Public Broad Aspect)",
		Karma:    "-6",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_ii_public_broad_aspect": {
		Name:     "Poor Self Control (Compulsive II, Public Broad Aspect)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_iii_public_broad_aspect": {
		Name:     "Poor Self Control (Compulsive III, Public Broad Aspect)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_compulsive_iv_public_broad_aspect": {
		Name:     "Poor Self Control (Compulsive IV, Public Broad Aspect)",
		Karma:    "-12",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "158",
	},
	"poor_self_control_thrill_seeker": {
		Name:     "Poor Self Control (Thrill Seeker)",
		Karma:    "-4",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "158",
	},
	"poor_self_control_thrill_seeker_dareadrenaline": {
		Name:     "Poor Self Control (Thrill Seeker) (Dareadrenaline)",
		Karma:    "0",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "160",
		Hide:     true,
	},
	"poor_self_control_vindictive": {
		Name:     "Poor Self Control (Vindictive)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "158",
	},
	"poor_self_control_combat_monster": {
		Name:     "Poor Self Control (Combat Monster)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "158",
	},
	"records_on_file": {
		Name:     "Records on File",
		Karma:    "-1",
		Category: "Negative",
		Source:   "RF",
		Limit:    "10",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Erased"},
			},
		},
		Page:     "158",
		NoLevels: true,
	},
	"reduced_sense_smell": {
		Name:     "Reduced Sense (Smell)",
		Karma:    "-2",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Page: "159",
	},
	"reduced_sense_taste": {
		Name:     "Reduced Sense (Taste)",
		Karma:    "-2",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Page: "159",
	},
	"reduced_sense_touch": {
		Name:     "Reduced Sense (Touch)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Page: "159",
	},
	"reduced_sense_hearing": {
		Name:     "Reduced Sense (Hearing)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Deaf"},
			},
		},
		Page: "159",
	},
	"reduced_sense_sight": {
		Name:     "Reduced Sense (Sight)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Blind"},
			},
		},
		Page: "159",
	},
	"reduced_sense_astral_sight": {
		Name:     "Reduced Sense (Astral Sight)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Assensing", Bonus: -2,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Magician", "Aware", "Aspected Magician", "Enchanter", "Explorer", "Mystic Adept", "Apprentice", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"},
			},
		},
		Page: "159",
	},
	"sensory_overload_syndrome": {
		Name:     "Sensory Overload Syndrome",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Page:     "159",
	},
	"signature": {
		Name:     "Signature",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "159",
	},
	"vendetta": {
		Name:     "Vendetta",
		Karma:    "-7",
		Category: "Negative",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "159",
	},
	"wanted": {
		Name:     "Wanted",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "159",
	},
	"natural_weapon_kick_centaur": {
		Name:     "Natural Weapon: Kick (Centaur)",
		Karma:    "0",
		Category: "Positive",
		Source:   "RF",
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Centaur",
			},
		},
		Page:      "105",
		AddWeapon: "Kick (Centaur)",
	},
	"centaur_body": {
		Name:     "Centaur Body",
		Karma:    "0",
		Category: "Positive",
		Source:   "RF",
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Centaur",
			},
		},
		Page: "105",
		Hide: true,
	},
	"natural_weapon_bite_naga": {
		Name:     "Natural Weapon: Bite (Naga)",
		Karma:    "0",
		Category: "Positive",
		Source:   "RF",
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Naga",
			},
		},
		Page:      "105",
		AddWeapon: "Bite (Naga)",
	},
	"astral_perception": {
		Name:     "Astral Perception",
		Karma:    "0",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			UnlockSkills: "",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Pixie",
			},
		},
		Page: "309",
		Hide: true,
	},
	"360_degree_eyesight": {
		Name:     "360-degree Eyesight",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "111",
		Metagenic: "True",
	},
	"animal_pelage_quills": {
		Name:     "Animal Pelage (Quills)",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Feathers", "Scales"},
			},
		},
		Page:      "111",
		Metagenic: "True",
	},
	"animal_pelage_insulating_pelt": {
		Name:     "Animal Pelage (Insulating Pelt)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			ColdArmor: "4",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Feathers", "Scales"},
			},
		},
		Page:      "111",
		Metagenic: "True",
	},
	"animal_pelage_camo_fur": {
		Name:     "Animal Pelage (Camo Fur)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Feathers", "Scales"},
			},
		},
		Page:      "111",
		Metagenic: "True",
	},
	"arcane_arrester": {
		Name:     "Arcane Arrester",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Limit:    "2",
		Bonus: &QualityBonus{
			SpellResistance: "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance"},
			},
		},
		Page:      "111",
		Metagenic: "True",
	},
	"balance_receptor": {
		Name:     "Balance Receptor",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Gymnastics", Bonus: 1,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
	},
	"beak": {
		Name:     "Beak",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			ToxinIngestionResist: "1",
			LifestyleCost:        "-10",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
	},
	"raptor_beak": {
		Name:     "Raptor Beak",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			ToxinIngestionResist: "1",
			LifestyleCost:        "-10",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
		AddWeapon: "Raptor Beak",
	},
	"bicardiac": {
		Name:     "Bicardiac",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
	},
	"biosonar": {
		Name:     "Biosonar",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
	},
	"bone_spikes": {
		Name:     "Bone Spikes",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			UnarmedDVPhysical: true,
			UnarmedDV:         "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
	},
	"broadened_auditory_system_infrasound": {
		Name:     "Broadened Auditory System (Infrasound)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "111",
		Metagenic: "True",
	},
	"broadened_auditory_system_ultrasound": {
		Name:     "Broadened Auditory System (Ultrasound)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
	},
	"camouflage": {
		Name:     "Camouflage",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"dynamic_coloration": {
		Name:     "Dynamic Coloration",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"celerity": {
		Name:     "Celerity",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			MovementReplace: []interface{}{nil, nil},
			SprintBonus:     "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Satyr Legs"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"claws": {
		Name:     "Claws",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Razor Claws", "Retractable Claws"},
			},
		},
		Page:      "113",
		Metagenic: "True",
		AddWeapon: "Digging Claws",
	},
	"razor_claws": {
		Name:     "Razor Claws",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Claws", "Retractable Claws"},
			},
		},
		Page:      "113",
		Metagenic: "True",
		AddWeapon: "Razor Claws",
	},
	"retractable_claws": {
		Name:     "Retractable Claws",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Razor Claws", "Claws"},
			},
		},
		Page:      "113",
		Metagenic: "True",
		AddWeapon: "Retractable Claws",
	},
	"climate_adaptation_arctic": {
		Name:     "Climate Adaptation (Arctic)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Climate Adaptation (Desert)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"climate_adaptation_desert": {
		Name:     "Climate Adaptation (Desert)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Climate Adaptation (Arctic)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"corrosive_spit": {
		Name:     "Corrosive Spit",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Natural Venom"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"dermal_alteration_bark_skin": {
		Name:     "Dermal Alteration (Bark Skin)",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			Armor: &ArmorBonus{
				Content: "2", Group: "0",
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dermal Alteration (Blubber)", "Dermal Alteration (Dragon Skin)", "Dermal Alteration (Granite Shell)", "Dermal Alteration (Rhino Hide)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"dermal_alteration_blubber": {
		Name:     "Dermal Alteration (Blubber)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			ColdArmor: "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dermal Alteration (Bark Skin)", "Dermal Alteration (Dragon Skin)", "Dermal Alteration (Granite Shell)", "Dermal Alteration (Rhino Hide)"},
			},
		},
		Page:      "112",
		Metagenic: "True",
	},
	"dermal_alteration_dragon_skin": {
		Name:     "Dermal Alteration (Dragon Skin)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			FireArmor: "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dermal Alteration (Bark Skin)", "Dermal Alteration (Blubber)", "Dermal Alteration (Granite Shell)", "Dermal Alteration (Rhino Hide)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"dermal_alteration_granite_shell": {
		Name:     "Dermal Alteration (Granite Shell)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			Armor: &ArmorBonus{
				Content: "4", Group: "0",
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dermal Alteration (Bark Skin)", "Dermal Alteration (Blubber)", "Dermal Alteration (Dragon Skin)", "Dermal Alteration (Rhino Hide)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"dermal_alteration_rhino_hide": {
		Name:     "Dermal Alteration (Rhino Hide)",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			Armor: &ArmorBonus{
				Content: "3", Group: "0",
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dermal Alteration (Bark Skin)", "Dermal Alteration (Blubber)", "Dermal Alteration (Dragon Skin)", "Dermal Alteration (Granite Shell)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"dermal_deposits": {
		Name:     "Dermal Deposits",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			Armor: "1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "114",
		Metagenic: "True",
	},
	"defensive_secretion": {
		Name:     "Defensive Secretion",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "114",
		Metagenic: "True",
	},
	"electroception_electrosense": {
		Name:     "Electroception (Electrosense)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			AddSkill: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "114",
		Metagenic: "True",
	},
	"electroception_technosense": {
		Name:     "Electroception (Technosense)",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			AddSkill: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "114",
		Metagenic: "True",
	},
	"elongated_limbs": {
		Name:     "Elongated Limbs",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			Reach: "1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "113",
		Metagenic: "True",
	},
	"fangs": {
		Name:     "Fangs",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
		AddWeapon: "Fangs",
	},
	"frog_tongue": {
		Name:     "Frog Tongue",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"functional_tail_balance": {
		Name:     "Functional Tail (Balance)",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Gymnastics", Bonus: 1,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Vestigial Tail", "Functional Tail (Paddle)", "Functional Tail (Prehensile)", "Functional Tail (Thagomizer)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"functional_tail_paddle": {
		Name:     "Functional Tail (Paddle)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Swimming", Bonus: 2,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Vestigial Tail", "Functional Tail (Balance)", "Functional Tail (Prehensile)", "Functional Tail (Thagomizer)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"functional_tail_prehensile": {
		Name:     "Functional Tail (Prehensile)",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Gymnastics", Bonus: 1,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Vestigial Tail", "Functional Tail (Balance)", "Functional Tail (Paddle)", "Functional Tail (Thagomizer)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"functional_tail_thagomizer": {
		Name:     "Functional Tail (Thagomizer)",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Vestigial Tail", "Functional Tail (Balance)", "Functional Tail (Paddle)", "Functional Tail (Prehensile)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
		AddWeapon: "Functional Tail (Thagomizer)",
	},
	"gills_air": {
		Name:     "Gills (Air)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Gills (Aqua)", "Gills (Full)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"gills_aqua": {
		Name:     "Gills (Aqua)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Gills (Air)", "Gills (Full)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"gills_full": {
		Name:     "Gills (Full)",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Gills (Aqua)", "Gills (Air)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"glamour": {
		Name:     "Glamour",
		Karma:    "12",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "1",
			},
			AddQuality:  nil,
			SocialLimit: "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
	},
	"greasy_skin": {
		Name:     "Greasy Skin",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"goring_horns": {
		Name:     "Goring Horns",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "115",
		Metagenic: "True",
		AddWeapon: "Goring Horns",
	},
	"keen_eared": {
		Name:     "Keen-Eared",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"larger_tusks": {
		Name:     "Larger Tusks",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
		AddWeapon: "Larger Tusks",
	},
	"low_light_vision_changeling": {
		Name:     "Low-Light Vision (Changeling)",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"low_light_vision_feline": {
		Name:     "Low-Light Vision (Feline)",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"magic_sense": {
		Name:     "Magic Sense",
		Karma:    "7",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Centaur"}, Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"magnetoception": {
		Name:     "Magnetoception",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Navigation", Bonus: 1,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"marsupial_pouch": {
		Name:     "Marsupial Pouch",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_body": {
		Name:     "Metagenic Improvement (Body)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_agility": {
		Name:     "Metagenic Improvement (Agility)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_reaction": {
		Name:     "Metagenic Improvement (Reaction)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_strength": {
		Name:     "Metagenic Improvement (Strength)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_charisma": {
		Name:     "Metagenic Improvement (Charisma)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_intuition": {
		Name:     "Metagenic Improvement (Intuition)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_logic": {
		Name:     "Metagenic Improvement (Logic)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metagenic_improvement_willpower": {
		Name:     "Metagenic Improvement (Willpower)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"metahuman_traits": {
		Name:     "Metahuman Traits",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			}, AllOf: &QualityRequiredAllOf{
				Metatype: "Human",
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"monkey_paws": {
		Name:     "Monkey Paws",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "116",
		Metagenic: "True",
	},
	"nasty_vibe": {
		Name:     "Nasty Vibe",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Intimidation", Bonus: 2,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_exhaled_mild": {
		Name:     "Natural Venom (Exhaled, Mild)",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_exhaled_moderate": {
		Name:     "Natural Venom (Exhaled, Moderate)",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_exhaled_serious": {
		Name:     "Natural Venom (Exhaled, Serious)",
		Karma:    "13",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_exhaled_deadly": {
		Name:     "Natural Venom (Exhaled, Deadly)",
		Karma:    "18",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Mild)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_spat_mild": {
		Name:     "Natural Venom (Spat, Mild)",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Exhaled, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_spat_moderate": {
		Name:     "Natural Venom (Spat, Moderate)",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Exhaled, Mild)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_spat_serious": {
		Name:     "Natural Venom (Spat, Serious)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_spat_deadly": {
		Name:     "Natural Venom (Spat, Deadly)",
		Karma:    "20",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_injected_mild": {
		Name:     "Natural Venom (Injected, Mild)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_injected_moderate": {
		Name:     "Natural Venom (Injected, Moderate)",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_injected_serious": {
		Name:     "Natural Venom (Injected, Serious)",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Moderate)", "Natural Venom (Injected, Deadly)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"natural_venom_injected_deadly": {
		Name:     "Natural Venom (Injected, Deadly)",
		Karma:    "15",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Corrosive Spit", "Natural Venom (Exhaled, Mild)", "Natural Venom (Exhaled, Moderate)", "Natural Venom (Exhaled, Serious)", "Natural Venom (Exhaled, Deadly)", "Natural Venom (Spat, Mild)", "Natural Venom (Spat, Moderate)", "Natural Venom (Spat, Serious)", "Natural Venom (Spat, Deadly)", "Natural Venom (Injected, Mild)", "Natural Venom (Injected, Serious)", "Natural Venom (Injected, Moderate)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"ogre_stomach": {
		Name:     "Ogre Stomach",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			ToxinIngestionResist: "2",
			LifestyleCost:        "-20",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"photometabolism": {
		Name:     "Photometabolism",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			LifestyleCost: "-10",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Nocturnal"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"proboscis": {
		Name:     "Proboscis",
		Karma:    "5",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "117",
		Metagenic: "True",
	},
	"satyr_legs": {
		Name:     "Satyr Legs",
		Karma:    "10",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			MovementReplace: "",
			SprintBonus:     "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"setae": {
		Name:     "Setae",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"shiva_arms_pair": {
		Name:     "Shiva Arms (Pair)",
		Karma:    "8",
		Category: "Positive",
		Source:   "RF",
		Limit:    "2",
		Bonus: &QualityBonus{
			AddLimb: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"thermal_sensitivity": {
		Name:     "Thermal Sensitivity",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"thermographic_vision_surge": {
		Name:     "Thermographic Vision (SURGE)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"thorns": {
		Name:     "Thorns",
		Karma:    "2",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Physical Active", Bonus: "-1",
			},
			UnarmedDV: "1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"underwater_vision": {
		Name:     "Underwater Vision",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"vomeronasal_organ": {
		Name:     "Vomeronasal Organ",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: 2,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "118",
		Metagenic: "True",
	},
	"webbed_digits": {
		Name:     "Webbed Digits",
		Karma:    "4",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Swimming", Bonus: 2,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)"},
			},
		},
		Page:      "119",
		Metagenic: "True",
	},
	"adiposis": {
		Name:     "Adiposis",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Physical Active", Bonus: "-1",
			},
			MovementReplace: []interface{}{nil, nil, nil},
		},
		Page:      "119",
		Metagenic: "True",
	},
	"astral_hazing": {
		Name:         "Astral Hazing",
		Karma:        "-5",
		Category:     "Negative",
		Source:       "RF",
		Bonus:        nil,
		Page:         "119",
		Metagenic:    "True",
		CostDiscount: "",
	},
	"berserker": {
		Name:      "Berserker",
		Karma:     "-6",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "119",
		Metagenic: "True",
	},
	"bioluminescence": {
		Name:      "Bioluminescence",
		Karma:     "-5",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "119",
		Metagenic: "True",
	},
	"cephalopod_skull": {
		Name:      "Cephalopod Skull",
		Karma:     "-6",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "120",
		Metagenic: "True",
	},
	"cold_blooded": {
		Name:      "Cold-Blooded",
		Karma:     "-5",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "120",
		Metagenic: "True",
	},
	"critter_spook": {
		Name:     "Critter Spook",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Animal Handling", Bonus: -2,
			},
		},
		Page:      "120",
		Metagenic: "True",
	},
	"cyclopean_eye": {
		Name:     "Cyclopean Eye",
		Karma:    "-6",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Combat Active", Bonus: "-1",
			},
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Gunnery", Bonus: -1,
			},
			DefenseTest: "-1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Third Eye"},
			},
		},
		Page:      "120",
		Metagenic: "True",
	},
	"deformity_picasso": {
		Name:     "Deformity (Picasso)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Perception", Bonus: -2,
			},
		},
		Page:      "120",
		Metagenic: "True",
	},
	"deformity_quasimodo": {
		Name:     "Deformity (Quasimodo)",
		Karma:    "-15",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Physical Active", Bonus: "-2",
			},
		},
		Page:      "120",
		Metagenic: "True",
	},
	"feathers": {
		Name:     "Feathers",
		Karma:    "-3",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Animal Pelage (Quills)", "Animal Pelage (Insulating Pelt)", "Animal Pelage (Camo Fur)", "Mood Hair", "Scales"},
			},
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_body": {
		Name:     "Impaired Attribute (Body)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_agility": {
		Name:     "Impaired Attribute (Agility)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_reaction": {
		Name:     "Impaired Attribute (Reaction)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_strength": {
		Name:     "Impaired Attribute (Strength)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_charisma": {
		Name:     "Impaired Attribute (Charisma)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_intuition": {
		Name:     "Impaired Attribute (Intuition)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_logic": {
		Name:     "Impaired Attribute (Logic)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"impaired_attribute_willpower": {
		Name:     "Impaired Attribute (Willpower)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page:      "120",
		Metagenic: "True",
	},
	"insectoid_features": {
		Name:      "Insectoid Features",
		Karma:     "-6",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "121",
		Metagenic: "True",
	},
	"mood_hair": {
		Name:     "Mood Hair",
		Karma:    "-4",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Feathers", "Scales", "Unusual Hair"},
			},
		},
		Page:      "121",
		Metagenic: "True",
	},
	"neoteny": {
		Name:     "Neoteny",
		Karma:    "-6",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			ConditionMonitor: nil,
			LifestyleCost:    "10",
		},
		Page:      "121",
		Metagenic: "True",
	},
	"nocturnal": {
		Name:     "Nocturnal",
		Karma:    "-4",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Photometabolism"},
			},
		},
		Page:      "121",
		Metagenic: "True",
	},
	"progeria": {
		Name:     "Progeria",
		Karma:    "-9",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Physical Active", Bonus: "-2",
			},
		},
		Page:      "121",
		Metagenic: "True",
	},
	"scales": {
		Name:     "Scales",
		Karma:    "-5",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Animal Pelage (Quills)", "Animal Pelage (Insulating Pelt)", "Animal Pelage (Camo Fur)", "Feathers", "Mood Hair"},
			},
		},
		Page:      "121",
		Metagenic: "True",
	},
	"scent_glands": {
		Name:      "Scent Glands",
		Karma:     "-4",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "121",
		Metagenic: "True",
	},
	"slow_healer": {
		Name:     "Slow Healer",
		Karma:    "-3",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			StunCMRecovery:     "-2",
			PhysicalCMRecovery: "-2",
		},
		Page:      "122",
		Metagenic: "True",
	},
	"striking_skin_pigmentation": {
		Name:      "Striking Skin Pigmentation",
		Karma:     "-4",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "122",
		Metagenic: "True",
	},
	"stubby_arms": {
		Name:     "Stubby Arms",
		Karma:    "-10",
		Category: "Negative",
		Source:   "RF",
		Bonus: &QualityBonus{
			Reach: "-1",
		},
		Page:      "122",
		Metagenic: "True",
	},
	"symbiosis": {
		Name:      "Symbiosis",
		Karma:     "-5",
		Category:  "Negative",
		Source:    "RF",
		Bonus:     nil,
		Page:      "122",
		Metagenic: "True",
	},
	"third_eye": {
		Name:     "Third Eye",
		Karma:    "-3",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Cyclopean Eye"},
			},
		},
		Page:      "122",
		Metagenic: "True",
	},
	"unusual_hair": {
		Name:     "Unusual Hair",
		Karma:    "-3",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mood Hair"},
			},
		},
		Page:      "122",
		Metagenic: "True",
	},
	"vestigial_tail": {
		Name:     "Vestigial Tail",
		Karma:    "-6",
		Category: "Negative",
		Source:   "RF",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Functional Tail (Balance)", "Functional Tail (Paddle)", "Functional Tail (Prehensile)", "Functional Tail (Thagomizer)"},
			},
		},
		Page:      "123",
		Metagenic: "True",
	},
	"infected_bandersnatch": {
		Name:     "Infected: Bandersnatch",
		Karma:    "22",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			Reach:                     "1",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Sasquatch",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "136",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_banshee": {
		Name:     "Infected: Banshee",
		Karma:    "32",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Elf",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "136",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Infected Bite",
				Reach:    "-1",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "RF",
				Page:     "137",
			},
		},
	},
	"infected_dzoo_noo_qua": {
		Name:     "Infected: Dzoo-Noo-Qua",
		Karma:    "43",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			Reach:                     "1",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Troll",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "137",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_fomoraig": {
		Name:     "Infected: Fomoraig",
		Karma:    "22",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			Reach:                     "1",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Troll",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_ghoul_dwarf": {
		Name:     "Infected: Ghoul (Dwarf)",
		Karma:    "29",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Dwarf"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_ghoul_elf": {
		Name:     "Infected: Ghoul (Elf)",
		Karma:    "29",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Elf"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_ghoul_human": {
		Name:     "Infected: Ghoul (Human)",
		Karma:    "29",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Human"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_ghoul_ork": {
		Name:     "Infected: Ghoul (Ork)",
		Karma:    "29",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Ork"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_ghoul_sasquatch": {
		Name:     "Infected: Ghoul (Sasquatch)",
		Karma:    "29",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Sasquatch"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_ghoul_troll": {
		Name:     "Infected: Ghoul (Troll)",
		Karma:    "29",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Troll"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_gnawer": {
		Name:     "Infected: Gnawer",
		Karma:    "35",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Dwarf",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Infected Bite",
				Reach:    "-1",
				Damage:   "({STR}+2)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "RF",
				Page:     "137",
			},
		},
	},
	"infected_goblin": {
		Name:     "Infected: Goblin",
		Karma:    "27",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Dwarf",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "138",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_grendel": {
		Name:     "Infected: Grendel",
		Karma:    "32",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Initiative: &InitiativeBonus{
				Content: "1",
			},
			Armor:                     "1",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Ork",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "139",
		ContributeToLimit: false,
		Implemented:       false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_harvester": {
		Name:     "Infected: Harvester",
		Karma:    "29",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Initiative: &InitiativeBonus{
				Content: "1",
			},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			Armor:                     "2",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Elf",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "139",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+3)P",
					AP:       "-2",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_loup_garou": {
		Name:     "Infected: Loup-Garou",
		Karma:    "30",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "CHA", Val: "-1",
			}, &SpecificAttributeBonus{
				Name: "LOG", Val: "-1",
			}},
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			Initiative: &InitiativeBonus{
				Content: "1",
			},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			Armor:                     "2",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			EssencePenalty:            "-1",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Human",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "139",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+3)P",
					AP:       "-2",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+2)P",
					AP:       "-2",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
	},
	"infected_mutaqua": {
		Name:     "Infected: Mutaqua",
		Karma:    "54",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			Armor:                     "1",
			UnlockSkills:              "Adept",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			Reach:                     "1",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Troll",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Infected: Fomoraig", "Infected: Dzoo-Noo-Qua", "Infected: Ghoul (Troll)", "Infected: Mutaqua", "Infected: Vampire (Non-Human)", "Latent Dracomorphosis"},
			},
		},
		Page:              "139",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
		CostDiscount: "",
	},
	"infected_nosferatu": {
		Name:     "Infected: Nosferatu",
		Karma:    "48",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			UnlockSkills:              "Magician",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Human",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "139",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Infected Bite",
				Reach:    "-1",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "RF",
				Page:     "137",
			},
		},
		CostDiscount: "",
	},
	"infected_vampire_human": {
		Name:     "Infected: Vampire (Human)",
		Karma:    "27",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Human",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "140",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Infected Bite",
				Reach:    "-1",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "RF",
				Page:     "137",
			},
		},
	},
	"infected_vampire_non_human": {
		Name:     "Infected: Vampire (Non-Human)",
		Karma:    "37",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "140",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Infected Bite",
				Reach:    "-1",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "RF",
				Page:     "137",
			},
		},
	},
	"infected_sukuyan_human": {
		Name:     "Infected: Sukuyan (Human)",
		Karma:    "27",
		Category: "Positive",
		Source:   "HT",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Human",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "127",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Infected Bite",
				Reach:    "-1",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "RF",
				Page:     "137",
			},
		},
	},
	"infected_sukuyan_non_human": {
		Name:     "Infected: Sukuyan (Non-Human)",
		Karma:    "37",
		Category: "Positive",
		Source:   "HT",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "127",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Infected Bite",
				Reach:    "-1",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "RF",
				Page:     "137",
			},
		},
	},
	"infected_wendigo": {
		Name:     "Infected: Wendigo",
		Karma:    "47",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			SelectAttributes: []interface{}{&SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}, &SelectSkill{
				Val: "1",
			}},
			InitiativePass: &InitiativePassBonus{
				Content: "1", Precedence: "-1",
			},
			UnlockSkills:              "Magician",
			EnableAttribute:           "",
			EnableTab:                 "",
			ReplaceAttributes:         "",
			OptionalPowers:            "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Infected",
			WalkMultiplier:            "",
			RunMultiplier:             "",
			UseSelected:               "False",
		},
		Required: &QualityRequired{
			AllOf: &QualityRequiredAllOf{
				Metatype: "Ork",
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Magic Resistance", "Latent Dracomorphosis"},
			},
		},
		Page:              "140",
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: []*NaturalWeapon{
				{
					Name:     "Infected Claws",
					Reach:    "0",
					Damage:   "({STR}+2)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
				{
					Name:     "Infected Bite",
					Reach:    "-1",
					Damage:   "({STR}+1)P",
					AP:       "-1",
					UseSkill: "Unarmed Combat",
					Accuracy: "Physical",
					Source:   "RF",
					Page:     "137",
				},
			},
		},
		CostDiscount: "",
	},
	"infected_optional_power_armor": {
		Name:     "Infected Optional Power: Armor",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Limit:    "False",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Dzoo-Noo-Qua", "Infected: Fomoraig", "Infected: Gnawer", "Infected: Mutaqua"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_compulsion": {
		Name:     "Infected Optional Power: Compulsion",
		Karma:    "9",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Nosferatu"},
			},
		},
		Forbidden:    nil,
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_enhanced_sense_hearing": {
		Name:     "Infected Optional Power: Enhanced Sense (Hearing)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee", "Infected: Dzoo-Noo-Qua", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_enhanced_sense_low_light_vision": {
		Name:     "Infected Optional Power: Enhanced Sense (Low-Light Vision)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Mutaqua", "Infected: Nosferatu"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_enhanced_sense_smell": {
		Name:     "Infected Optional Power: Enhanced Sense (Smell)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee", "Infected: Goblin", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_enhanced_sense_taste": {
		Name:     "Infected Optional Power: Enhanced Sense (Taste)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Goblin"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_enhanced_sense_thermographic_vision": {
		Name:     "Infected Optional Power: Enhanced Sense (Thermographic Vision)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_enhanced_sense_visual_acuity": {
		Name:     "Infected Optional Power: Enhanced Sense (Visual Acuity)",
		Karma:    "3",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Wendigo"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_fear": {
		Name:     "Infected Optional Power: Fear",
		Karma:    "9",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Wendigo"},
			},
		},
		Forbidden:    nil,
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_immunity_fire": {
		Name:     "Infected Optional Power: Immunity (Fire)",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Goblin"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_immunity_pathogens": {
		Name:     "Infected Optional Power: Immunity (Pathogens)",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_immunity_toxins": {
		Name:     "Infected Optional Power: Immunity (Toxins)",
		Karma:    "6",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee", "Infected: Dzoo-Noo-Qua", "Infected: Goblin", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_influence": {
		Name:     "Infected Optional Power: Influence",
		Karma:    "9",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Nosferatu", "Infected: Wendigo"},
			},
		},
		Forbidden:    nil,
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_magical_guard": {
		Name:     "Infected Optional Power: Magical Guard",
		Karma:    "9",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Dzoo-Noo-Qua", "Infected: Mutaqua"},
			},
		},
		Forbidden:    nil,
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_advanced_optional_power_mimicry": {
		Name:     "Infected Advanced Optional Power: Mimicry",
		Karma:    "9",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Nosferatu"},
			},
		},
		Forbidden:    nil,
		Page:         "398",
		DoubleCareer: false,
	},
	"infected_optional_power_mist_form": {
		Name:     "Infected Optional Power: Mist Form",
		Karma:    "12",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)"},
			},
		},
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_optional_power_paralyzing_howl": {
		Name:     "Infected Optional Power: Paralyzing Howl",
		Karma:    "9",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee"},
			},
		},
		Forbidden:    nil,
		Page:         "136",
		DoubleCareer: false,
	},
	"infected_advanced_optional_power_psychokinesis": {
		Name:     "Infected Advanced Optional Power: Psychokinesis",
		Karma:    "9",
		Category: "Positive",
		Source:   "SR5",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Nosferatu"},
			},
		},
		Forbidden:    nil,
		Page:         "400",
		DoubleCareer: false,
	},
	"infected_optional_power_regeneration": {
		Name:     "Infected Optional Power: Regeneration",
		Karma:    "12",
		Category: "Positive",
		Source:   "RF",
		Bonus: &QualityBonus{
			CritterPowers: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Banshee", "Infected: Dzoo-Noo-Qua", "Infected: Goblin", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Forbidden:    nil,
		Page:         "136",
		DoubleCareer: false,
	},
	"data_anomaly": {
		Name:     "Data Anomaly",
		Karma:    "3",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "44",
	},
	"fade_to_black": {
		Name:     "Fade to Black",
		Karma:    "7",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "44",
	},
	"go_big_or_go_home": {
		Name:     "Go Big or Go Home",
		Karma:    "6",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "44",
	},
	"golden_screwdriver": {
		Name:     "Golden Screwdriver",
		Karma:    "8",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "44",
	},
	"i_c_u": {
		Name:     "I C U",
		Karma:    "6",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "44",
	},
	"ninja_vanish": {
		Name:     "Ninja Vanish",
		Karma:    "5",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "44",
	},
	"online_fame": {
		Name:     "Online Fame",
		Karma:    "4",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "45",
	},
	"otaku_to_technomancer": {
		Name:     "Otaku to Technomancer",
		Karma:    "10",
		Category: "Positive",
		Source:   "DT",
		Bonus: &QualityBonus{
			FadingResist: "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "45",
	},
	"pain_is_gain": {
		Name:     "Pain is Gain",
		Karma:    "5",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "45",
	},
	"prime_datahaven_membership": {
		Name:     "Prime Datahaven Membership",
		Karma:    "7",
		Category: "Positive",
		Source:   "DT",
		Bonus: &QualityBonus{
			AddContact: "",
		},
		Page: "45",
	},
	"profiler": {
		Name:     "Profiler",
		Karma:    "3",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "46",
	},
	"quick_config": {
		Name:     "Quick Config",
		Karma:    "5",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Page:     "46",
	},
	"wildcard_chimera": {
		Name:     "Wildcard Chimera",
		Karma:    "0",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SelectQuality: []string{""},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Bandersnatch", "Infected: Banshee", "Infected: Dzoo-Noo-Qua", "Infected: Fomoraig", "Infected: Ghoul (Dwarf)", "Infected: Ghoul (Elf)", "Infected: Ghoul (Human)", "Infected: Ghoul (Ork)", "Infected: Ghoul (Sasquatch)", "Infected: Ghoul (Troll)", "Infected: Gnawer", "Infected: Goblin", "Infected: Grendel", "Infected: Harvester", "Infected: Loup-Garou", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page: "163",
	},
	"it_works_if_you_work_it": {
		Name:     "It Works If You Work It",
		Karma:    "5",
		Category: "Positive",
		Source:   "DTR",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Bandersnatch", "Infected: Banshee", "Infected: Dzoo-Noo-Qua", "Infected: Fomoraig", "Infected: Ghoul (Dwarf)", "Infected: Ghoul (Elf)", "Infected: Ghoul (Human)", "Infected: Ghoul (Ork)", "Infected: Ghoul (Sasquatch)", "Infected: Ghoul (Troll)", "Infected: Gnawer", "Infected: Goblin", "Infected: Grendel", "Infected: Harvester", "Infected: Loup-Garou", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page: "164",
	},
	"soul_swallower": {
		Name:     "Soul Swallower",
		Karma:    "7",
		Category: "Positive",
		Source:   "DTR",
		Bonus:    nil,
		Required: nil,
		Page:     "164",
	},
	"metaviral_attunement": {
		Name:     "Metaviral Attunement",
		Karma:    "5",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Infected: Bandersnatch", "Infected: Banshee", "Infected: Dzoo-Noo-Qua", "Infected: Fomoraig", "Infected: Ghoul (Dwarf)", "Infected: Ghoul (Elf)", "Infected: Ghoul (Human)", "Infected: Ghoul (Ork)", "Infected: Ghoul (Sasquatch)", "Infected: Ghoul (Troll)", "Infected: Gnawer", "Infected: Goblin", "Infected: Grendel", "Infected: Harvester", "Infected: Loup-Garou", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page: "164",
	},
	"code_of_honor_like_a_boss": {
		Name:     "Code of Honor: Like a Boss",
		Karma:    "-15",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "46",
	},
	"curiosity_killed_the_cat": {
		Name:     "Curiosity Killed the Cat",
		Karma:    "-7",
		Category: "Negative",
		Source:   "DT",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Hacking", Bonus: 2,
			},
		},
		Required: nil,
		Page:     "46",
	},
	"data_liberator": {
		Name:     "Data Liberator",
		Karma:    "-12",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Page:     "46",
	},
	"decaying_dissonance": {
		Name:     "Decaying Dissonance",
		Karma:    "-25",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "47",
	},
	"electronic_witness": {
		Name:     "Electronic Witness",
		Karma:    "-5",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Page:     "48",
	},
	"faraday_himself": {
		Name:     "Faraday Himself",
		Karma:    "-7",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Page:     "48",
	},
	"latest_and_greatest": {
		Name:     "Latest and Greatest",
		Karma:    "-5",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Page:     "48",
	},
	"leeeeeeeroy_jenkins": {
		Name:     "Leeeeeeeroy Jenkins",
		Karma:    "-20",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Page:     "48",
	},
	"nerdrage": {
		Name:     "Nerdrage",
		Karma:    "-8",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Page:     "48",
	},
	"prank_warrior": {
		Name:     "Prank Warrior",
		Karma:    "-15",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Page:     "49",
	},
	"wanted_by_god": {
		Name:     "Wanted by GOD",
		Karma:    "-12",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "49",
	},
	"chatty": {
		Name:     "Chatty",
		Karma:    "5",
		Category: "Positive",
		Source:   "DT",
		Bonus: &QualityBonus{
			LimitModifier: &common.LimitModifier{
				Limit: "Social", Value: "1", Condition: "LimitCondition_QualityChatty",
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "146",
	},
	"designer": {
		Name:     "Designer",
		Karma:    "6",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "146",
	},
	"exceptional_entity": {
		Name:     "Exceptional Entity",
		Karma:    "25",
		Category: "Positive",
		Source:   "DT",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{nil, nil, nil, nil, nil},
			SelectAttributes: &SelectSkill{
				Max: "96",
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "147",
	},
	"hello_world": {
		Name:     "Hello World!",
		Karma:    "8",
		Category: "Positive",
		Source:   "DT",
		Limit:    "3",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "147",
	},
	"inherent_program": {
		Name:     "Inherent Program",
		Karma:    "7",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "148",
	},
	"improved_restoration": {
		Name:     "Improved Restoration",
		Karma:    "3",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "149",
	},
	"low_profile": {
		Name:     "Low Profile",
		Karma:    "15",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "149",
	},
	"munge": {
		Name:     "Munge",
		Karma:    "15",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "149",
	},
	"multiprocessing": {
		Name:     "Multiprocessing",
		Karma:    "8",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "150",
	},
	"pilot_origins": {
		Name:     "Pilot Origins",
		Karma:    "8",
		Category: "Positive",
		Source:   "DT",
		Limit:    "3",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "150",
	},
	"redundancy": {
		Name:     "Redundancy",
		Karma:    "12",
		Category: "Positive",
		Source:   "DT",
		Bonus: &QualityBonus{
			ConditionMonitor: nil,
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "151",
	},
	"sapper": {
		Name:     "Sapper",
		Karma:    "7",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "151",
	},
	"sensor_upgrade": {
		Name:     "Sensor Upgrade",
		Karma:    "5",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "151",
	},
	"snooper": {
		Name:     "Snooper",
		Karma:    "7",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "151",
	},
	"virtual_stability": {
		Name:     "Virtual Stability",
		Karma:    "5",
		Category: "Positive",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "151",
	},
	"corrupter": {
		Name:     "Corrupter",
		Karma:    "-10",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "151",
	},
	"easily_exploitable": {
		Name:     "Easily Exploitable",
		Karma:    "-8",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page:        "151",
		Implemented: false,
	},
	"fragmentation": {
		Name:     "Fragmentation",
		Karma:    "-18",
		Category: "Negative",
		Source:   "DT",
		Bonus: &QualityBonus{
			EssenceMax: "-1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "151",
	},
	"persnickety_renter": {
		Name:     "Persnickety Renter",
		Karma:    "-6",
		Category: "Negative",
		Source:   "DT",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "152",
	},
	"real_world_naiveté": {
		Name:     "Real World Naiveté",
		Karma:    "-8",
		Category: "Negative",
		Source:   "DT",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"A.I."},
			},
		},
		Page: "152",
	},
	"biocompatibility_cyberware": {
		Name:     "Biocompatibility (Cyberware)",
		Karma:    "5",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			CyberwareEssMultiplier: "90",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Biocompatibility (Bioware)"},
			},
		},
		Page: "54",
	},
	"biocompatibility_bioware": {
		Name:     "Biocompatibility (Bioware)",
		Karma:    "5",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			BiowareEssMultiplier: "90",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Biocompatibility (Cyberware)"},
			},
		},
		Page: "54",
	},
	"better_to_be_feared_than_loved": {
		Name:     "Better to be Feared Than Loved",
		Karma:    "5",
		Category: "Positive",
		Source:   "CF",
		Bonus:    nil,
		Page:     "54",
	},
	"cyber_singularity_seeker": {
		Name:     "Cyber-Singularity Seeker",
		Karma:    "12",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			CyberSeeker: "WIL",
		},
		Page: "54",
	},
	"drug_tolerant": {
		Name:     "Drug Tolerant",
		Karma:    "6",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			PhysiologicalAddictionFirstTime: "2",
			PsychologicalAddictionFirstTime: "2",
		},
		Page: "54",
	},
	"prototype_transhuman": {
		Name:     "Prototype Transhuman",
		Karma:    "10",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SelectQuality:       "",
			PrototypeTranshuman: "1",
		},
		Page:        "54",
		ChargenOnly: true,
	},
	"redliner": {
		Name:     "Redliner",
		Karma:    "10",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			CyberSeeker: []interface{}{"AGI", "STR", "BOX"},
		},
		Page: "55",
	},
	"revels_in_murder": {
		Name:     "Revels in Murder",
		Karma:    "8",
		Category: "Positive",
		Source:   "CF",
		Bonus:    nil,
		Page:     "56",
	},
	"uncanny_healer": {
		Name:     "Uncanny Healer",
		Karma:    "12",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			AddEssToPhysicalCMRecovery: "",
			AddEssToStunCMRecovery:     "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Quick Healer"},
			},
		},
		Page: "56",
	},
	"phenotypic_variation_genewipe": {
		Name:        "Phenotypic Variation - Genewipe",
		Karma:       "32",
		Category:    "Positive",
		Source:      "CF",
		Bonus:       nil,
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_masque": {
		Name:        "Phenotypic Variation - Masque",
		Karma:       "23",
		Category:    "Positive",
		Source:      "CF",
		Bonus:       nil,
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_reprint": {
		Name:        "Phenotypic Variation - Reprint",
		Karma:       "18",
		Category:    "Positive",
		Source:      "CF",
		Bonus:       nil,
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_shuffle": {
		Name:        "Phenotypic Variation - Shuffle",
		Karma:       "13",
		Category:    "Positive",
		Source:      "CF",
		Bonus:       nil,
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_body": {
		Name:     "Phenotypic Variation - Genetic Optimization (Body)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Body)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_agility": {
		Name:     "Phenotypic Variation - Genetic Optimization (Agility)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Agility)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_reaction": {
		Name:     "Phenotypic Variation - Genetic Optimization (Reaction)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Reaction)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_strength": {
		Name:     "Phenotypic Variation - Genetic Optimization (Strength)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Strength)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_charisma": {
		Name:     "Phenotypic Variation - Genetic Optimization (Charisma)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Charisma)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_intuition": {
		Name:     "Phenotypic Variation - Genetic Optimization (Intuition)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Intuition)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_logic": {
		Name:     "Phenotypic Variation - Genetic Optimization (Logic)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Logic)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_genetic_optimization_willpower": {
		Name:     "Phenotypic Variation - Genetic Optimization (Willpower)",
		Karma:    "27",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Bioware: []string{"Genetic Optimization (Willpower)"},
			},
		},
		Page:        "157",
		ChargenOnly: true,
	},
	"phenotypic_variation_cosmetic_alteration": {
		Name:     "Phenotypic Variation - Cosmetic Alteration",
		Karma:    "21",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page:        "158",
		ChargenOnly: true,
	},
	"phenotypic_variation_print_removal": {
		Name:        "Phenotypic Variation - Print Removal",
		Karma:       "12",
		Category:    "Positive",
		Source:      "CF",
		Bonus:       nil,
		Page:        "158",
		ChargenOnly: true,
	},
	"phenotypic_variation_metaposeur": {
		Name:     "Phenotypic Variation - Metaposeur",
		Karma:    "22",
		Category: "Positive",
		Source:   "CF",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Page:        "158",
		ChargenOnly: true,
	},
	"antipathy": {
		Name:     "Antipathy",
		Karma:    "-8",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "57",
	},
	"aips": {
		Name:     "AIPS",
		Karma:    "-10",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "57",
	},
	"blank_slate": {
		Name:     "Blank Slate",
		Karma:    "-15",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "57",
	},
	"cyberpsychosis": {
		Name:     "Cyberpsychosis",
		Karma:    "-10",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "57",
	},
	"cyber_snob": {
		Name:     "Cyber-snob",
		Karma:    "-12",
		Category: "Negative",
		Source:   "CF",
		Bonus: &QualityBonus{
			DisableBiowareGrade:   []interface{}{"Standard", "Standard (Burnout's Way)", "Used", "Alphaware", "Omegaware"},
			DisableCyberwareGrade: []interface{}{"Standard", "Standard (Burnout's Way)", "Used", "Alphaware", "Omegaware", "Greyware", "Standard (Adapsin)", "Standard (Burnout's Way) (Adapsin)", "Used (Adapsin)", "Alphaware (Adapsin)", "Omegaware (Adapsin)", "Greyware (Adapsin)"},
		},
		Required: nil,
		Page:     "57",
	},
	"dead_emotion": {
		Name:     "Dead Emotion",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "57",
	},
	"dry_addict_mild": {
		Name:     "Dry Addict (Mild)",
		Karma:    "-2",
		Category: "Negative",
		Source:   "CF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "57",
	},
	"dry_addict_moderate": {
		Name:     "Dry Addict (Moderate)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "57",
	},
	"dry_addict_severe": {
		Name:     "Dry Addict (Severe)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "CF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "57",
	},
	"dry_addict_burnout": {
		Name:     "Dry Addict (Burnout)",
		Karma:    "-13",
		Category: "Negative",
		Source:   "CF",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "57",
	},
	"family_curse": {
		Name:     "Family Curse",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CF",
		Bonus: &QualityBonus{
			PhysiologicalAddictionFirstTime:       "-2",
			PsychologicalAddictionFirstTime:       "-2",
			PhysiologicalAddictionAlreadyAddicted: "-2",
			PsychologicalAddictionAlreadyAddicted: "-2",
		},
		Page: "58",
	},
	"implant_induced_immune_deficiency": {
		Name:     "Implant-induced Immune Deficiency",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CF",
		Bonus: &QualityBonus{
			ToxinContactResist:                    "-2",
			ToxinIngestionResist:                  "-2",
			ToxinInhalationResist:                 "-2",
			ToxinInjectionResist:                  "-2",
			PathogenContactResist:                 "-2",
			PathogenIngestionResist:               "-2",
			PathogenInhalationResist:              "-2",
			PathogenInjectionResist:               "-2",
			PhysiologicalAddictionFirstTime:       "-2",
			PhysiologicalAddictionAlreadyAddicted: "-2",
		},
		Required: nil,
		Page:     "58",
	},
	"lack_of_focus": {
		Name:     "Lack of Focus",
		Karma:    "-6",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "58",
	},
	"lightweight": {
		Name:     "Lightweight",
		Karma:    "-6",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "58",
	},
	"one_of_them": {
		Name:     "One of Them",
		Karma:    "-7",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "58",
	},
	"poor_self_control_attention_seeking": {
		Name:     "Poor Self Control (Attention-Seeking)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CF",
		Page:     "58",
	},
	"poor_self_control_sadistic": {
		Name:     "Poor Self Control (Sadistic)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "CF",
		Page:     "58",
	},
	"quasimodo": {
		Name:     "Quasimodo",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CF",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "-3",
			},
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Intimidation", Bonus: 2,
			},
		},
		Page: "59",
	},
	"so_jacked_up": {
		Name:     "So Jacked Up",
		Karma:    "-10",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "59",
	},
	"superhuman_psychosis": {
		Name:     "Superhuman Psychosis",
		Karma:    "-2",
		Category: "Negative",
		Source:   "CF",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Exotic Melee Weapon", Bonus: 1,
			}, common.SpecificSkillBonus{
				Name: "Etiquette", Bonus: -2,
			}, common.SpecificSkillBonus{
				Name: "Leadership", Bonus: -2,
			}},
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Close Combat", Bonus: "1", Condition: "",
			},
		},
		Page: "59",
	},
	"tle_x": {
		Name:     "TLE-X",
		Karma:    "-15",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "59",
	},
	"tough_and_targeted": {
		Name:     "Tough and Targeted",
		Karma:    "-10",
		Category: "Negative",
		Source:   "CF",
		Bonus:    nil,
		Page:     "60",
	},
	"barrens_rat": {
		Name:     "Barrens Rat",
		Karma:    "5",
		Category: "Positive",
		Source:   "HT",
		Bonus:    nil,
		Page:     "191",
	},
	"elemental_focus": {
		Name:     "Elemental Focus",
		Karma:    "10",
		Category: "Positive",
		Source:   "HT",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Page: "191",
	},
	"poisoner": {
		Name:     "Poisoner",
		Karma:    "5",
		Category: "Positive",
		Source:   "HT",
		Bonus:    nil,
		Page:     "191",
	},
	"practice_practice_practice": {
		Name:     "Practice, Practice, Practice",
		Karma:    "2",
		Category: "Positive",
		Source:   "HT",
		Bonus: &QualityBonus{
			WeaponSkillAccuracy: "",
		},
		Page: "191",
	},
	"code_of_honor_avenging_angel": {
		Name:     "Code of Honor: Avenging Angel",
		Karma:    "-8",
		Category: "Negative",
		Source:   "HT",
		Bonus:    nil,
		Page:     "191",
	},
	"impassive": {
		Name:     "Impassive",
		Karma:    "-7",
		Category: "Negative",
		Source:   "HT",
		Bonus: &QualityBonus{
			LimitModifier: &common.LimitModifier{
				Limit: "Social", Value: "-1", Condition: "LimitCondition_ExcludeIntimidation",
			},
		},
		Page: "191",
	},
	"faceless": {
		Name:     "Faceless",
		Karma:    "-6",
		Category: "Negative",
		Source:   "HT",
		Page:     "191",
	},
	"chaser": {
		Name:     "Chaser",
		Karma:    "4",
		Category: "Positive",
		Source:   "R5",
		Bonus:    nil,
		Page:     "33",
	},
	"dealer_connection": {
		Name:     "Dealer Connection",
		Karma:    "3",
		Category: "Positive",
		Source:   "R5",
		Limit:    "4",
		Bonus: &QualityBonus{
			DealerConnection: "",
		},
		Page:     "33",
		NoLevels: true,
	},
	"grease_monkey": {
		Name:     "Grease Monkey",
		Karma:    "8",
		Category: "Positive",
		Source:   "R5",
		Bonus: &QualityBonus{
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Engineering", Bonus: "1", Condition: "",
			},
		},
		Page: "33",
	},
	"speed_demon": {
		Name:     "Speed Demon",
		Karma:    "3",
		Category: "Positive",
		Source:   "R5",
		Bonus:    nil,
		Page:     "33",
	},
	"stunt_driver": {
		Name:     "Stunt Driver",
		Karma:    "4",
		Category: "Positive",
		Source:   "R5",
		Bonus:    nil,
		Page:     "33",
	},
	"subtle_pilot": {
		Name:     "Subtle Pilot",
		Karma:    "4",
		Category: "Positive",
		Source:   "R5",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "33",
	},
	"accident_prone": {
		Name:     "Accident Prone",
		Karma:    "-4",
		Category: "Negative",
		Source:   "R5",
		Bonus:    nil,
		Page:     "33",
	},
	"motion_sickness": {
		Name:     "Motion Sickness",
		Karma:    "-4",
		Category: "Negative",
		Source:   "R5",
		Bonus:    nil,
		Page:     "33",
	},
	"too_much_data": {
		Name:     "Too Much Data",
		Karma:    "-3",
		Category: "Negative",
		Source:   "R5",
		Bonus:    nil,
		Page:     "34",
	},
	"latent_dracomorphosis": {
		Name:     "Latent Dracomorphosis",
		Karma:    "5",
		Category: "Positive",
		Source:   "HS",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dracoform (Eastern Drake)", "Dracoform (Western Drake)", "Dracoform (Feathered Drake)", "Dracoform (Sea Drake)", "Changeling (Class I SURGE)", "Changeling (Class II SURGE)", "Changeling (Class III SURGE)", "Infected: Bandersnatch", "Infected: Banshee", "Infected: Dzoo-Noo-Qua", "Infected: Fomoraig", "Infected: Ghoul (Dwarf)", "Infected: Ghoul (Elf)", "Infected: Ghoul (Human)", "Infected: Ghoul (Ork)", "Infected: Ghoul (Sasquatch)", "Infected: Ghoul (Troll)", "Infected: Gnawer", "Infected: Goblin", "Infected: Grendel", "Infected: Harvester", "Infected: Loup-Garou", "Infected: Mutaqua", "Infected: Nosferatu", "Infected: Vampire (Human)", "Infected: Vampire (Non-Human)", "Infected: Sukuyan (Human)", "Infected: Sukuyan (Non-Human)", "Infected: Wendigo"},
			},
		},
		Page:                "164",
		RefundKarmaOnRemove: true,
		ContributeToLimit:   false,
	},
	"dracoform_eastern_drake": {
		Name:     "Dracoform (Eastern Drake)",
		Karma:    "75",
		Category: "Positive",
		Source:   "HS",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "BOD", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "STR", Val: "2",
			}, &SpecificAttributeBonus{
				Name: "AGI", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "LOG", Val: "1",
			}},
			AddQuality:                nil,
			EnableAttribute:           "",
			EnableTab:                 "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Drake",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dracoform (Western Drake)", "Dracoform (Feathered Drake)", "Dracoform (Sea Drake)", "Latent Dracomorphosis"},
			},
		},
		Page:              "163",
		StagedPurchase:    true,
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Dracoform Claws",
				Reach:    "0",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "HS",
				Page:     "163",
			},
		},
	},
	"dracoform_western_drake": {
		Name:     "Dracoform (Western Drake)",
		Karma:    "75",
		Category: "Positive",
		Source:   "HS",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "BOD", Val: "2",
			}, &SpecificAttributeBonus{
				Name: "STR", Val: "2",
			}, &SpecificAttributeBonus{
				Name: "CHA", Val: "1",
			}},
			AddQuality:                nil,
			EnableAttribute:           "",
			EnableTab:                 "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Drake",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dracoform (Eastern Drake)", "Dracoform (Feathered Drake)", "Dracoform (Sea Drake)", "Latent Dracomorphosis"},
			},
		},
		Page:              "163",
		StagedPurchase:    true,
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Dracoform Horns",
				Reach:    "0",
				Damage:   "({STR}+2)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "HS",
				Page:     "163",
			},
		},
	},
	"dracoform_feathered_drake": {
		Name:     "Dracoform (Feathered Drake)",
		Karma:    "75",
		Category: "Positive",
		Source:   "HS",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "BOD", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "STR", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "AGI", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "REA", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "WIL", Val: "1",
			}},
			AddQuality:                nil,
			EnableAttribute:           "",
			EnableTab:                 "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Drake",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dracoform (Eastern Drake)", "Dracoform (Western Drake)", "Dracoform (Sea Drake)", "Latent Dracomorphosis"},
			},
		},
		Page:              "163",
		StagedPurchase:    true,
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Dracoform Tail",
				Reach:    "1",
				Damage:   "({STR}+3)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "HS",
				Page:     "163",
			},
		},
	},
	"dracoform_sea_drake": {
		Name:     "Dracoform (Sea Drake)",
		Karma:    "75",
		Category: "Positive",
		Source:   "HS",
		Bonus: &QualityBonus{
			SpecificAttribute: []interface{}{&SpecificAttributeBonus{
				Name: "BOD", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "STR", Val: "1",
			}, &SpecificAttributeBonus{
				Name: "REA", Val: "2",
			}, &SpecificAttributeBonus{
				Name: "INT", Val: "1",
			}},
			AddQuality:                nil,
			EnableAttribute:           "",
			EnableTab:                 "",
			CritterPowers:             "",
			LimitCritterPowerCategory: "Drake",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Dracoform (Eastern Drake)", "Dracoform (Western Drake)", "Dracoform (Feathered Drake)", "Latent Dracomorphosis"},
			},
		},
		Page:              "163",
		StagedPurchase:    true,
		ContributeToLimit: false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Dracoform Fangs",
				Reach:    "0",
				Damage:   "({STR}+1)P",
				AP:       "-2",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "HS",
				Page:     "163",
			},
		},
	},
	"alibi": {
		Name:     "Alibi",
		Karma:    "4",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Con", Bonus: 2,
			},
		},
		Page: "150",
	},
	"closer": {
		Name:     "Closer",
		Karma:    "4",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Negotiation", Bonus: 2,
			},
		},
		Page: "150",
	},
	"cynic": {
		Name:     "Cynic",
		Karma:    "6",
		Category: "Positive",
		Source:   "CA",
		Bonus:    nil,
		Page:     "150",
	},
	"empathic_listener": {
		Name:     "Empathic Listener",
		Karma:    "10",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			SwapSkillAttribute: nil,
		},
		Page: "150",
	},
	"good_looking_and_knows_it": {
		Name:     "Good Looking and Knows It",
		Karma:    "10",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			Notoriety: "1",
		},
		Page: "150",
	},
	"groupthink": {
		Name:     "Groupthink",
		Karma:    "5",
		Category: "Positive",
		Source:   "CA",
		Bonus:    nil,
		Page:     "150",
	},
	"honest_face": {
		Name:     "Honest Face",
		Karma:    "5",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			JudgeIntentionsDefense: "2",
		},
		Page: "151",
	},
	"innocuous": {
		Name:     "Innocuous",
		Karma:    "5",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Sneaking", Bonus: 2,
			},
		},
		Page: "151",
	},
	"master_debater": {
		Name:     "Master Debater",
		Karma:    "10",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			SwapSkillSpecAttribute: "",
		},
		Page: "151",
	},
	"memory_palace": {
		Name:     "Memory Palace",
		Karma:    "6",
		Category: "Positive",
		Source:   "CA",
		Bonus: &QualityBonus{
			Memory: "1",
		},
		Page: "151",
	},
	"method_actor": {
		Name:     "Method Actor",
		Karma:    "7",
		Category: "Positive",
		Source:   "CA",
		Bonus:    nil,
		Page:     "151",
	},
	"mnemonic_vault": {
		Name:     "Mnemonic Vault",
		Karma:    "8",
		Category: "Positive",
		Source:   "CA",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Memory Palace"},
			},
		},
		Page: "151",
	},
	"watch_the_suit": {
		Name:     "Watch the Suit",
		Karma:    "3",
		Category: "Positive",
		Source:   "CA",
		Bonus:    nil,
		Page:     "151",
	},
	"alpha_junkie": {
		Name:     "Alpha Junkie",
		Karma:    "-12",
		Category: "Negative",
		Source:   "CA",
		Bonus:    nil,
		Page:     "151",
	},
	"designated_omega": {
		Name:     "Designated Omega",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CA",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Leadership", Bonus: -2,
			},
		},
		Page: "152",
	},
	"disheveled": {
		Name:     "Disheveled",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CA",
		Bonus:    nil,
		Page:     "152",
	},
	"favored_common_target_biased": {
		Name:     "Favored (Common Target, Biased)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CA",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "152",
	},
	"favored_common_target_outspoken": {
		Name:     "Favored (Common Target, Outspoken)",
		Karma:    "-7",
		Category: "Negative",
		Source:   "CA",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "152",
	},
	"favored_common_target_fanatic": {
		Name:     "Favored (Common Target, Fanatic)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "CA",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "152",
	},
	"favored_specific_target_biased": {
		Name:     "Favored (Specific Target, Biased)",
		Karma:    "-3",
		Category: "Negative",
		Source:   "CA",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "152",
	},
	"favored_specific_target_outspoken": {
		Name:     "Favored (Specific Target, Outspoken)",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CA",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "152",
	},
	"favored_specific_target_fanatic": {
		Name:     "Favored (Specific Target, Fanatic)",
		Karma:    "-8",
		Category: "Negative",
		Source:   "CA",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "152",
	},
	"one_born_every_minute": {
		Name:     "One Born Every Minute",
		Karma:    "-5",
		Category: "Negative",
		Source:   "CA",
		Bonus:    nil,
		Page:     "152",
	},
	"social_appearance_anxiety": {
		Name:     "Social Appearance Anxiety",
		Karma:    "-3",
		Category: "Negative",
		Source:   "CA",
		Limit:    "3",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "-Rating",
			},
		},
		Page: "152",
	},
	"the_goat": {
		Name:     "The Goat",
		Karma:    "-8",
		Category: "Negative",
		Source:   "CA",
		Bonus:    nil,
		Page:     "152",
	},
	"ugly_and_doesnt_care": {
		Name:     "Ugly And Doesn't Care",
		Karma:    "-10",
		Category: "Negative",
		Source:   "CA",
		Bonus: &QualityBonus{
			SpecificAttribute: "",
		},
		Page: "152",
	},
	"free_insect_spirit_cutter_ant": {
		Name:     "Free Insect Spirit: Cutter Ant",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_fire_ant": {
		Name:     "Free Insect Spirit: Fire Ant",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_desert_locust": {
		Name:     "Free Insect Spirit: Desert Locust",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_mole_cricket": {
		Name:     "Free Insect Spirit: Mole Cricket",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			MovementReplace:   []interface{}{nil, nil, nil},
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_subterranean_termite": {
		Name:     "Free Insect Spirit: Subterranean Termite",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
			DamageResistance:  "2",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_hunter_wasp": {
		Name:     "Free Insect Spirit: Hunter Wasp",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_bee": {
		Name:     "Free Insect Spirit: Bee",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_goliath_beetle": {
		Name:     "Free Insect Spirit: Goliath Beetle",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
			DamageResistance:  "4",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_water_beetle": {
		Name:     "Free Insect Spirit: Water Beetle",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_house_centipede": {
		Name:     "Free Insect Spirit: House Centipede",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_tropical_centipede": {
		Name:     "Free Insect Spirit: Tropical Centipede",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_century_cicada": {
		Name:     "Free Insect Spirit: Century Cicada",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_trapdoor_spider": {
		Name:     "Free Insect Spirit: Trapdoor Spider",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_black_widow": {
		Name:     "Free Insect Spirit: Black Widow",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_burster_firefly": {
		Name:     "Free Insect Spirit: Burster Firefly",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_botfly": {
		Name:     "Free Insect Spirit: Botfly",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_dragonfly": {
		Name:     "Free Insect Spirit: Dragonfly",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_mimic_mantis": {
		Name:     "Free Insect Spirit: Mimic Mantis",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_orchid_mantis": {
		Name:     "Free Insect Spirit: Orchid Mantis",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_vampire_mosquito": {
		Name:     "Free Insect Spirit: Vampire Mosquito",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_tick": {
		Name:     "Free Insect Spirit: Tick",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_deaths_head_moth": {
		Name:     "Free Insect Spirit: Death's Head Moth",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			MovementReplace:   []interface{}{nil, nil, nil},
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_cryptid_moth": {
		Name:     "Free Insect Spirit: Cryptid Moth",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			MovementReplace:   []interface{}{nil, nil, nil},
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_cave_roach": {
		Name:     "Free Insect Spirit: Cave Roach",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"free_insect_spirit_silverfish": {
		Name:     "Free Insect Spirit: Silverfish",
		Karma:    "42",
		Category: "Positive",
		Source:   "DTR",
		Bonus: &QualityBonus{
			SkillGroupDisable: "Conjuring",
			EnableAttribute:   "",
			EnableTab:         "",
			CritterPowers:     "",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "151",
		ContributeToLimit: false,
	},
	"adept_healer": {
		Name:     "Adept Healer",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Power: "Empathic Healing",
			},
		},
		Page:                  "31",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"alchemical_armorer": {
		Name:     "Alchemical Armorer",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			AddSpell: "",
		},
		Required:              nil,
		Page:                  "31",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"alchemical_bomb_maker": {
		Name:                  "Alchemical Bomb Maker",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "31",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"animal_familiar": {
		Name:                  "Animal Familiar",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "31",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"apt_pupil": {
		Name:                  "Apt Pupil",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "32",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"arcane_bodyguard": {
		Name:                  "Arcane Bodyguard",
		Karma:                 "20",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "32",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"arcane_improviser": {
		Name:                  "Arcane Improviser",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "32",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"archivist": {
		Name:                  "Archivist",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "32",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"astral_bouncer": {
		Name:                  "Astral Bouncer",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "32",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"astral_infiltrator": {
		Name:                  "Astral Infiltrator",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "32",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"barehanded_adept": {
		Name:     "Barehanded Adept",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			AllowSpellRange: []interface{}{"T", "T (A)"},
			FreeSpells:      "",
			UseSelected:     "False",
		},
		Required:              nil,
		Page:                  "33",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"blood_necromancer": {
		Name:                  "Blood Necromancer",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "33",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"chain_breaker": {
		Name:     "Chain Breaker",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			AddSpirit:    []interface{}{nil, nil},
			SkillDisable: "Binding",
		},
		Required:              nil,
		Page:                  "33",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
		CostDiscount:          "",
	},
	"chakra_interrupter": {
		Name:                  "Chakra Interrupter",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "34",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"charlatan": {
		Name:                  "Charlatan",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "34",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"chosen_follower": {
		Name:     "Chosen Follower",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:                  "35",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"close_combat_mage": {
		Name:     "Close Combat Mage",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Limit:    "3",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Required:              nil,
		Page:                  "35",
		NoLevels:              true,
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"dark_ally": {
		Name:                  "Dark Ally",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "35",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"death_dealer": {
		Name:     "Death Dealer",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Limit:    "3",
		Bonus: &QualityBonus{
			SpellCategoryDamage: "",
			SpellCategoryDrain:  "",
		},
		Required:              nil,
		Forbidden:             nil,
		Page:                  "35",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"death_dealer_adept": {
		Name:     "Death Dealer (Adept)",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			SpellCategoryDamage: "",
			SpellCategoryDrain:  "",
			WeaponCategoryDV:    "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Mystic Adept"},
			},
		},
		Page:                  "35",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"dedicated_conjurer": {
		Name:     "Dedicated Conjurer",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			SkillDisable: "Spellcasting",
		},
		Required:              nil,
		Page:                  "36",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
		CostDiscount:          "",
	},
	"dedicated_spellslinger": {
		Name:     "Dedicated Spellslinger",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			SkillDisable:      []interface{}{"Summoning", "Binding"},
			NewspellKarmaCost: "",
			FreeSpells:        "",
		},
		Required:              nil,
		Page:                  "36",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
		CostDiscount:          "",
	},
	"dual_natured_defender": {
		Name:                  "Dual-Natured Defender",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "36",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"durable_preparations": {
		Name:                  "Durable Preparations",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "36",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"elemental_master": {
		Name:                  "Elemental Master",
		Karma:                 "20",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "36",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"flesh_sculpter": {
		Name:                  "Flesh Sculpter",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Limit:                 "3",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "37",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"healer": {
		Name:                  "Healer",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "37",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"illusionist": {
		Name:     "Illusionist",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Limit:    "3",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Required:              nil,
		Page:                  "37",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"items_of_power": {
		Name:                  "Items of Power",
		Karma:                 "25",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "38",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"mage_hunter_i": {
		Name:                  "Mage Hunter I",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "38",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"mage_hunter_ii": {
		Name:                  "Mage Hunter II",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "38",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"mage_hunter_iii": {
		Name:                  "Mage Hunter III",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "38",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"missile_deflector": {
		Name:                  "Missile Deflector",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "38",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"mystic_foreman": {
		Name:                  "Mystic Foreman",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "38",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"mystic_pitcher": {
		Name:                  "Mystic Pitcher",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "38",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"pacifist_adept": {
		Name:     "Pacifist Adept",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Pacifist I", "Pacifist II"},
			},
		},
		Page:                  "39",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"potion_maker": {
		Name:                  "Potion Maker",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "39",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"practiced_alchemist": {
		Name:                  "Practiced Alchemist",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "39",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"puppet_master": {
		Name:                  "Puppet Master",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Limit:                 "3",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "39",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"reckless_spell_master": {
		Name:                  "Reckless Spell Master",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Limit:                 "6",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "39",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"renaissance_ritualist": {
		Name:                  "Renaissance Ritualist",
		Karma:                 "8",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"revenant_adept": {
		Name:     "Revenant Adept",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Power: "Rapid Healing",
			},
		},
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"shock_mage": {
		Name:                  "Shock Mage",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"skinwalker": {
		Name:                  "Skinwalker",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Limit:                 "3",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"spectral_warden": {
		Name:                  "Spectral Warden",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"spell_jammer": {
		Name:                  "Spell Jammer",
		Karma:                 "20",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"spirit_hunter_i": {
		Name:     "Spirit Hunter I",
		Karma:    "20",
		Category: "Positive",
		Source:   "FA",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Power: "Killing Hands",
			},
		},
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"spirit_hunter_ii": {
		Name:                  "Spirit Hunter II",
		Karma:                 "20",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"spirit_hunter_iii": {
		Name:                  "Spirit Hunter III",
		Karma:                 "20",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "40",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"spiritual_lodge": {
		Name:                  "Spiritual Lodge",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "41",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"spiritual_pilgrim": {
		Name:                  "Spiritual Pilgrim",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "41",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"sprawl_tamer": {
		Name:                  "Sprawl Tamer",
		Karma:                 "10",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "41",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"stalwart_ally": {
		Name:                  "Stalwart Ally",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "42",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"taboo_transformer": {
		Name:                  "Taboo Transformer",
		Karma:                 "15",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "42",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"vexcraft": {
		Name:                  "Vexcraft",
		Karma:                 "7",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "42",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"worship_leader": {
		Name:                  "Worship Leader",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "FA",
		Bonus:                 nil,
		Required:              nil,
		Page:                  "42",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"crystal_breath": {
		Name:     "Crystal Breath",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinInhalationResist:     "2",
			FatigueResist:             "1",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required:          nil,
		Page:              "132",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_eye_one_eye": {
		Name:     "Crystal Eye (One Eye)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Limit:    "False",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required:          nil,
		Page:              "132",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_eye_two_eyes": {
		Name:     "Crystal Eye (Two Eyes)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Limit:    "False",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Cyclopean Eye"},
			},
		},
		Page:              "132",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver": {
		Name:     "Crystal Gut (Liver)",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			FatigueResist:             "1",
			EssencePenaltyMagonlyT100: "50",
			EssencePenaltyT100:        "-50",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_kidneys": {
		Name:     "Crystal Gut (Kidneys)",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinInjectionResist:      "2",
			FatigueResist:             "1",
			EssencePenaltyMagonlyT100: "50",
			EssencePenaltyT100:        "-50",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver, Kidneys)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_stomach": {
		Name:     "Crystal Gut (Stomach)",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			FatigueResist:             "1",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "50",
			EssencePenaltyT100:        "-50",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver, Stomach)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_intestines": {
		Name:     "Crystal Gut (Intestines)",
		Karma:    "5",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			FatigueResist:             "1",
			EssencePenaltyMagonlyT100: "50",
			EssencePenaltyT100:        "-50",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver_kidneys": {
		Name:     "Crystal Gut (Liver, Kidneys)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			ToxinInjectionResist:      "2",
			FatigueResist:             "2",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver)", "Crystal Gut (Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver_stomach": {
		Name:     "Crystal Gut (Liver, Stomach)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			FatigueResist:             "2",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver)", "Crystal Gut (Stomach)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver_intestines": {
		Name:     "Crystal Gut (Liver, Intestines)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			FatigueResist:             "2",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver)", "Crystal Gut (Intestines)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_kidneys_stomach": {
		Name:     "Crystal Gut (Kidneys, Stomach)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinInjectionResist:      "2",
			FatigueResist:             "2",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Kidneys)", "Crystal Gut (Stomach)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_kidneys_intestines": {
		Name:     "Crystal Gut (Kidneys, Intestines)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinInjectionResist:      "2",
			FatigueResist:             "2",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Kidneys)", "Crystal Gut (Intestines)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_stomach_intestines": {
		Name:     "Crystal Gut (Stomach, Intestines)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			FatigueResist:             "2",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Stomach)", "Crystal Gut (Intestines)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver_kidneys_stomach": {
		Name:     "Crystal Gut (Liver, Kidneys, Stomach)",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			ToxinInjectionResist:      "2",
			FatigueResist:             "3",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "150",
			EssencePenaltyT100:        "-150",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver)", "Crystal Gut (Kidneys)", "Crystal Gut (Stomach)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver_kidneys_intestines": {
		Name:     "Crystal Gut (Liver, Kidneys, Intestines)",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			ToxinInjectionResist:      "2",
			FatigueResist:             "3",
			EssencePenaltyMagonlyT100: "150",
			EssencePenaltyT100:        "-150",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver)", "Crystal Gut (Kidneys)", "Crystal Gut (Intestines)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver_stomach_intestines": {
		Name:     "Crystal Gut (Liver, Stomach, Intestines)",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			FatigueResist:             "3",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "150",
			EssencePenaltyT100:        "-150",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver)", "Crystal Gut (Stomach)", "Crystal Gut (Intestines)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_kidneys_stomach_intestines": {
		Name:     "Crystal Gut (Kidneys, Stomach, Intestines)",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinInjectionResist:      "2",
			FatigueResist:             "3",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "150",
			EssencePenaltyT100:        "-150",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Kidneys)", "Crystal Gut (Stomach)", "Crystal Gut (Intestines)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_gut_liver_kidneys_stomach_intestines": {
		Name:     "Crystal Gut (Liver, Kidneys, Stomach, Intestines)",
		Karma:    "20",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			ToxinIngestionResist:      "2",
			ToxinInjectionResist:      "2",
			FatigueResist:             "4",
			LifestyleCost:             "-10",
			EssencePenaltyMagonlyT100: "200",
			EssencePenaltyT100:        "-200",
		},
		Required: nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Crystal Gut (Liver)", "Crystal Gut (Kidneys)", "Crystal Gut (Stomach)", "Crystal Gut (Intestines)", "Crystal Gut (Liver, Kidneys)", "Crystal Gut (Liver, Stomach)", "Crystal Gut (Liver, Intestines)", "Crystal Gut (Kidneys, Stomach)", "Crystal Gut (Kidneys, Intestines)", "Crystal Gut (Stomach, Intestines)", "Crystal Gut (Liver, Kidneys, Stomach)", "Crystal Gut (Liver, Kidneys, Intestines)", "Crystal Gut (Liver, Stomach, Intestines)", "Crystal Gut (Kidneys, Stomach, Intestines)"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_jaw": {
		Name:     "Crystal Jaw",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required:          nil,
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Crystal Jaw",
				Reach:    "-1",
				Damage:   "({STR}+2)P",
				AP:       "-4",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "FA",
				Page:     "133",
			},
		},
	},
	"crystal_limb_arm": {
		Name:     "Crystal Limb (Arm)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Limit:    "False",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			Armor:                     "1",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required:          nil,
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_limb_leg": {
		Name:     "Crystal Limb (Leg)",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Limit:    "False",
		Bonus: &QualityBonus{
			ConditionMonitor:          nil,
			Armor:                     "1",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required:          nil,
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystal_spine": {
		Name:     "Crystal Spine",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			ConditionMonitor: nil,
			Initiative: &InitiativeBonus{
				Content: "2", Precedence: "0",
			},
			Armor:                     "1",
			EssencePenaltyMagonlyT100: "100",
			EssencePenaltyT100:        "-100",
		},
		Required:          nil,
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystalline_blade": {
		Name:              "Crystalline Blade",
		Karma:             "10",
		Category:          "Positive",
		Source:            "FA",
		Required:          nil,
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Crystalline Blade",
				Reach:    "1",
				Damage:   "({STR}+3)P",
				AP:       "-2",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "FA",
				Page:     "133",
			},
		},
	},
	"crystalline_claws": {
		Name:              "Crystalline Claws",
		Karma:             "5",
		Category:          "Positive",
		Source:            "FA",
		Required:          nil,
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Crystal Claw",
				Reach:    "0",
				Damage:   "({STR}+1)P",
				AP:       "-1",
				UseSkill: "Unarmed Combat",
				Accuracy: "Physical",
				Source:   "FA",
				Page:     "133",
			},
		},
	},
	"crystalline_diver": {
		Name:     "Crystalline Diver",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Crystal Breath"},
			},
		},
		Page:              "133",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystalline_grace": {
		Name:     "Crystalline Grace",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Crystal Limb (Leg)"},
			},
		},
		Page:              "134",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystalline_reflexes": {
		Name:     "Crystalline Reflexes",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			Dodge: "2",
		},
		Required:          nil,
		Page:              "134",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"crystalline_shards": {
		Name:     "Crystalline Shards",
		Karma:    "10",
		Category: "Positive",
		Source:   "FA",
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Crystal Limb (Arm)"},
			},
		},
		Page:              "134",
		ContributeToLimit: false,
		DoubleCareer:      false,
		NaturalWeapons: &NaturalWeapons{
			NaturalWeapon: &NaturalWeapon{
				Name:     "Crystalline Shards",
				Reach:    "0",
				Damage:   "({STR}+3)P",
				AP:       "4",
				UseSkill: "Throwing Weapons",
				Accuracy: "Physical",
				Source:   "FA",
				Page:     "133",
			},
		},
	},
	"crystalline_vision": {
		Name:     "Crystalline Vision",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			UnlockSkills: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Crystal Eye (One Eye)", "Crystal Eye (Two Eyes)", "Crystal Eye (Three Eyes)"},
			},
		},
		Page:              "134",
		ContributeToLimit: false,
		DoubleCareer:      false,
	},
	"apprentice": {
		Name:     "Apprentice",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			UnlockSkills:    []interface{}{"Sorcery", "Conjuring"},
			EnableAttribute: "",
			EnableTab:       "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Aware", "Aspected Magician", "Enchanter", "Explorer", "Magician", "Mystic Adept", "Adept"},
			},
		},
		Page:              "47",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
	},
	"enchanter": {
		Name:     "Enchanter",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			UnlockSkills:    "Enchanting",
			EnableAttribute: "",
			EnableTab:       "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept", "Adept"},
			},
		},
		Page:              "47",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
	},
	"explorer": {
		Name:     "Explorer",
		Karma:    "15",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			UnlockSkills:    "Explorer",
			EnableAttribute: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Aware", "Aspected Magician", "Enchanter", "Apprentice", "Magician", "Mystic Adept", "Adept"},
			},
		},
		Page:              "47",
		ContributeToLimit: false,
		OnlyPriorityGiven: true,
	},
	"elementalist_air": {
		Name:     "Elementalist (Air)",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			SkillGroupDisable:   "Enchanting",
			LimitSpiritCategory: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:              "43",
		ContributeToLimit: false,
	},
	"elementalist_earth": {
		Name:     "Elementalist (Earth)",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			SkillGroupDisable:   "Enchanting",
			LimitSpiritCategory: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:              "43",
		ContributeToLimit: false,
	},
	"elementalist_fire": {
		Name:     "Elementalist (Fire)",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			SkillGroupDisable:   "Enchanting",
			LimitSpiritCategory: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:              "43",
		ContributeToLimit: false,
	},
	"elementalist_water": {
		Name:     "Elementalist (Water)",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			SkillGroupDisable:   "Enchanting",
			LimitSpiritCategory: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:              "43",
		ContributeToLimit: false,
	},
	"hedge_witchwizard": {
		Name:     "Hedge Witch/Wizard",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			AllowSpellCategory: "Rituals",
			LimitSpellCategory: "",
			SkillGroupDisable:  "Conjuring",
			SpellCategoryDrain: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:              "43",
		ContributeToLimit: false,
	},
	"seer": {
		Name:     "Seer",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			AddMetamagic:      []interface{}{nil, nil},
			SkillGroupDisable: []interface{}{"Sorcery", "Conjuring", "Enchanting"},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:              "43",
		ContributeToLimit: false,
	},
	"null_wizard": {
		Name:     "Null Wizard",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			AddQuality:   nil,
			AddMetamagic: "",
			SkillDisable: []interface{}{"Binding", "Spellcasting", "Ritual Spellcasting", "Alchemy", "Artificing"},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Adept", "Aware", "Aspected Magician", "Apprentice", "Explorer", "Magician", "Mystic Adept"},
			},
		},
		Page:              "43",
		ContributeToLimit: false,
	},
	"mentors_mask": {
		Name:     "Mentor's Mask",
		Karma:    "0",
		Category: "Positive",
		Source:   "FA",
		Bonus: &QualityBonus{
			DrainValue:       "-1",
			AdeptPowerPoints: "1",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Mentor Spirit"},
			},
		},
		Page:              "182",
		ContributeToLimit: false,
	},
	"arcology_tantrum": {
		Name:     "Arcology Tantrum",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SAG",
		Page:     "147",
	},
	"peoples_sin": {
		Name:     "People's SIN",
		Karma:    "-3",
		Category: "Negative",
		Source:   "SAG",
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"SINner (Corporate)", "SINner (Criminal)", "SINner (National)", "SINner (Corporate Limited)", "People's SIN (Criminal)"},
			},
		},
		Page: "148",
	},
	"peoples_sin_criminal": {
		Name:     "People's SIN (Criminal)",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SAG",
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"SINner (Corporate)", "SINner (Criminal)", "SINner (National)", "SINner (Corporate Limited)", "People's SIN"},
			},
		},
		Page: "148",
	},
	"black_forest_native": {
		Name:     "Black Forest Native",
		Karma:    "22",
		Category: "Positive",
		Source:   "TCT",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
			AddQuality: nil,
		},
		Page: "188",
	},
	"community_connection": {
		Name:     "Community Connection",
		Karma:    "5",
		Category: "Positive",
		Source:   "TCT",
		Bonus: &QualityBonus{
			LifestyleCost: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Troll", "Ork"},
			},
		},
		Page: "188",
	},
	"delicate_fingers": {
		Name:     "Delicate Fingers",
		Karma:    "5",
		Category: "Positive",
		Source:   "TCT",
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Troll"},
			},
		},
		Page: "188",
	},
	"human_lifespan": {
		Name:     "Human Lifespan",
		Karma:    "10",
		Category: "Positive",
		Source:   "TCT",
		Page:     "188",
	},
	"nasty_trog": {
		Name:     "Nasty Trog",
		Karma:    "5",
		Category: "Positive",
		Source:   "TCT",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Intimidation", Bonus: 3,
			},
		},
		Page: "188",
	},
	"trog_artisan": {
		Name:     "Trog Artisan",
		Karma:    "8",
		Category: "Positive",
		Source:   "TCT",
		Page:     "188",
	},
	"trog_historian": {
		Name:     "Trog Historian",
		Karma:    "4",
		Category: "Positive",
		Source:   "TCT",
		Page:     "188",
	},
	"trog_leader": {
		Name:     "Trog Leader",
		Karma:    "7",
		Category: "Positive",
		Source:   "TCT",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Leadership", Bonus: 3,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Troll", "Ork"},
			},
		},
		Page: "188",
	},
	"trog_networker": {
		Name:     "Trog Networker",
		Karma:    "12",
		Category: "Positive",
		Source:   "TCT",
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Metatype: []string{"Troll", "Ork"},
			},
		},
		Page: "189",
	},
	"bad_credit": {
		Name:     "Bad Credit",
		Karma:    "-8",
		Category: "Negative",
		Source:   "TCT",
		Bonus: &QualityBonus{
			LifestyleCost:      "10",
			BasicLifestyleCost: "10",
		},
		Page: "189",
	},
	"elevated_stress": {
		Name:     "Elevated Stress",
		Karma:    "-8",
		Category: "Negative",
		Source:   "TCT",
		Bonus: &QualityBonus{
			ToxinContactResist:                    "-1",
			ToxinIngestionResist:                  "-1",
			ToxinInhalationResist:                 "-1",
			ToxinInjectionResist:                  "-1",
			PhysiologicalAddictionFirstTime:       "-1",
			PsychologicalAddictionFirstTime:       "-1",
			PhysiologicalAddictionAlreadyAddicted: "-1",
			PsychologicalAddictionAlreadyAddicted: "-1",
		},
		Page: "189",
	},
	"force_of_chaos": {
		Name:     "Force of Chaos",
		Karma:    "-4",
		Category: "Negative",
		Source:   "TCT",
		Page:     "189",
	},
	"trog_traitor": {
		Name:     "Trog Traitor",
		Karma:    "-5",
		Category: "Negative",
		Source:   "TCT",
		Page:     "189",
	},
	"busted_cyberware": {
		Name:     "Busted Cyberware",
		Karma:    "-4",
		Category: "Negative",
		Source:   "TSG",
		Limit:    "11",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
			AddWare:    "",
		},
		Page:        "30",
		ChargenOnly: true,
	},
	"corporate_loyalist": {
		Name:     "Corporate Loyalist",
		Karma:    "7",
		Category: "Positive",
		Source:   "SL",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "126",
	},
	"location_attunement_i": {
		Name:     "Location Attunement I",
		Karma:    "5",
		Category: "Positive",
		Source:   "SL",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "126",
	},
	"location_attunement_ii": {
		Name:     "Location Attunement II",
		Karma:    "7",
		Category: "Positive",
		Source:   "SL",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "126",
	},
	"location_attunement_iii": {
		Name:     "Location Attunement III",
		Karma:    "9",
		Category: "Positive",
		Source:   "SL",
		Limit:    "False",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Page: "126",
	},
	"natural_leader": {
		Name:     "Natural Leader",
		Karma:    "5",
		Category: "Positive",
		Source:   "SL",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Leadership", Bonus: 1,
			},
		},
		Page: "127",
	},
	"observant": {
		Name:     "Observant",
		Karma:    "5",
		Category: "Positive",
		Source:   "SL",
		Bonus:    nil,
		Page:     "127",
	},
	"battle_hardened": {
		Name:     "Battle Hardened",
		Karma:    "2",
		Category: "Positive",
		Source:   "SL",
		Limit:    "3",
		Bonus:    nil,
		Page:     "181",
	},
	"corporate_pariah_i": {
		Name:     "Corporate Pariah I",
		Karma:    "-7",
		Category: "Negative",
		Source:   "SL",
		Limit:    "False",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "-2",
			},
			SelectText: &common.SelectTextBonus{},
		},
		Page: "127",
	},
	"corporate_pariah_ii": {
		Name:     "Corporate Pariah II",
		Karma:    "-10",
		Category: "Negative",
		Source:   "SL",
		Limit:    "False",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "-3",
			},
			SelectText: &common.SelectTextBonus{},
		},
		Page: "127",
	},
	"every_man_for_himself": {
		Name:     "Every Man For Himself",
		Karma:    "-5",
		Category: "Negative",
		Source:   "SL",
		Bonus:    nil,
		Page:     "181",
	},
	"no_man_left_behind": {
		Name:     "No Man Left Behind",
		Karma:    "-7",
		Category: "Negative",
		Source:   "SL",
		Bonus:    nil,
		Page:     "181",
	},
	"stay_out_of_my_way": {
		Name:     "Stay Out of My Way",
		Karma:    "-9",
		Category: "Negative",
		Source:   "SL",
		Bonus:    nil,
		Page:     "127",
	},
	"this_is_your_last_chance": {
		Name:     "This Is Your Last Chance",
		Karma:    "-3",
		Category: "Negative",
		Source:   "SL",
		Bonus:    nil,
		Page:     "127",
	},
	"thousand_yard_stare": {
		Name:     "Thousand-Yard Stare",
		Karma:    "-3",
		Category: "Negative",
		Source:   "SL",
		Limit:    "3",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "-Rating",
			},
		},
		Page: "181",
	},
	"deck_builder": {
		Name:     "Deck Builder",
		Karma:    "4",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Page:     "76",
	},
	"impenetrable_logic": {
		Name:     "Impenetrable Logic",
		Karma:    "3",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Page:     "76",
	},
	"rootkit": {
		Name:     "Rootkit",
		Karma:    "8",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Page:     "76",
	},
	"silence_is_golden": {
		Name:     "Silence is Golden",
		Karma:    "9",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Page:     "76",
	},
	"avrse": {
		Name:     "AVRse",
		Karma:    "-9",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "76",
	},
	"basement_dweller": {
		Name:     "Basement Dweller",
		Karma:    "-8",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "-2",
			},
		},
		Page: "77",
	},
	"big_baby": {
		Name:     "Big Baby",
		Karma:    "-4",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "77",
	},
	"buddy_system": {
		Name:     "Buddy System",
		Karma:    "-9",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "77",
	},
	"discombobulated": {
		Name:     "Discombobulated",
		Karma:    "-12",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "77",
	},
	"down_the_rabbit_hole": {
		Name:     "Down the Rabbit Hole",
		Karma:    "-2",
		Category: "Negative",
		Source:   "KC",
		Limit:    "4",
		Bonus:    nil,
		Page:     "77",
	},
	"echo_chamber": {
		Name:     "Echo Chamber",
		Karma:    "-10",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "78",
	},
	"frostbite": {
		Name:     "Frostbite",
		Karma:    "-3",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			SelectSkill: nil,
		},
		Page: "78",
	},
	"information_auctioneer": {
		Name:     "Information Auctioneer",
		Karma:    "-4",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "78",
	},
	"lazy_fingers": {
		Name:     "Lazy Fingers",
		Karma:    "-10",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "79",
	},
	"malware_infection": {
		Name:     "Malware Infection",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Computer", Bonus: -2,
			},
		},
		Page: "79",
	},
	"matrix_troll": {
		Name:     "Matrix Troll",
		Karma:    "-7",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "79",
	},
	"sloppy_code": {
		Name:     "Sloppy Code",
		Karma:    "-3",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			SkillGroup: []*common.SkillGroupBonus{{
				Name: "Stealth", Bonus: "-2", Condition: "When in hosts",
			},
		},
		Page: "79",
	},
	"well_actually": {
		Name:     "Well, Actually...",
		Karma:    "-12",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Page:     "79",
	},
	"better_on_the_net_attack": {
		Name:     "Better on the Net [Attack]",
		Karma:    "9",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"better_on_the_net_data_processing": {
		Name:     "Better on the Net [Data Processing]",
		Karma:    "9",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"better_on_the_net_firewall": {
		Name:     "Better on the Net [Firewall]",
		Karma:    "9",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"better_on_the_net_sleaze": {
		Name:     "Better on the Net [Sleaze]",
		Karma:    "9",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"brilliant_heuristics": {
		Name:     "Brilliant Heuristics",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"groveler": {
		Name:     "Groveler",
		Karma:    "10",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"hold_the_door": {
		Name:     "Hold the Door",
		Karma:    "7",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"fractal_punch": {
		Name:     "Fractal Punch",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "96",
	},
	"lone_wolf": {
		Name:     "Lone Wolf",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Team Player"},
			},
		},
		Page: "96",
	},
	"natural_hacker": {
		Name:     "Natural Hacker",
		Karma:    "14",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			SelectText: nil,
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "97",
	},
	"one_with_the_matrix_i": {
		Name:     "One With the Matrix I",
		Karma:    "2",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"One With the Matrix III"},
			},
		},
		Page: "97",
	},
	"one_with_the_matrix_ii": {
		Name:     "One With the Matrix II",
		Karma:    "8",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"One With the Matrix III"},
			},
		},
		Page: "97",
	},
	"one_with_the_matrix_iii": {
		Name:     "One With the Matrix III",
		Karma:    "10",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"One With the Matrix I", "One With the Matrix II"},
			},
		},
		Page: "97",
	},
	"reverberant": {
		Name:     "Reverberant",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "97",
	},
	"sprite_affinity": {
		Name:     "Sprite Affinity",
		Karma:    "7",
		Category: "Positive",
		Source:   "KC",
		Limit:    "False",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "97",
	},
	"team_player": {
		Name:     "Team Player",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "97",
	},
	"trust_data_not_lore": {
		Name:     "Trust Data, Not Lore",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Trust Lore, Not Data"},
			},
		},
		Page: "97",
	},
	"trust_lore_not_data": {
		Name:     "Trust Lore, Not Data",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Trust Data, Not Lore"},
			},
		},
		Page: "97",
	},
	"unique_avatar": {
		Name:     "Unique Avatar",
		Karma:    "5",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Digital Doppelganger"},
			},
		},
		Page: "98",
	},
	"paragon": {
		Name:     "Paragon",
		Karma:    "0",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "102",
	},
	"brittle_attack": {
		Name:     "Brittle [Attack]",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"brittle_sleaze": {
		Name:     "Brittle [Sleaze]",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"brittle_data_processing": {
		Name:     "Brittle [Data Processing]",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"brittle_firewall": {
		Name:     "Brittle [Firewall]",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			LivingPersona: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"code_of_honor_black_hat": {
		Name:     "Code of Honor: Black Hat",
		Karma:    "-15",
		Category: "Negative",
		Source:   "KC",
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"data_hog": {
		Name:     "Data Hog",
		Karma:    "-10",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"escaped_custody": {
		Name:     "Escaped Custody",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			SelectText: &common.SelectTextBonus{},
		},
		Required: nil,
		Page:     "99",
	},
	"know_your_limit": {
		Name:     "Know Your Limit",
		Karma:    "-4",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"on_the_wagon": {
		Name:     "On the Wagon",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Addiction (Mild)", "Addiction (Moderate)", "Addiction (Severe)", "Addiction (Burnout)"},
			},
		},
		Page: "99",
	},
	"resonant_burnout": {
		Name:     "Resonant Burnout",
		Karma:    "-15",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			SpecialAttBurnMultiplier: "20",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"sprite_combustion": {
		Name:     "Sprite Combustion",
		Karma:    "-13",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Registering", Bonus: -1,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "99",
	},
	"taint_of_dissonance": {
		Name:     "Taint of Dissonance",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "100",
	},
	"ware_intolerance": {
		Name:     "'Ware Intolerance",
		Karma:    "-15",
		Category: "Negative",
		Source:   "KC",
		Bonus: &QualityBonus{
			BiowareEssMultiplier:   "120",
			CyberwareEssMultiplier: "120",
		},
		Page: "100",
	},
	"wired_user": {
		Name:     "Wired User",
		Karma:    "-5",
		Category: "Negative",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Addiction (Mild)", "Addiction (Moderate)", "Addiction (Severe)", "Addiction (Burnout)"},
			},
		},
		Page: "100",
	},
	"resonant_stream_cyberadept": {
		Name:     "Resonant Stream: Cyberadept",
		Karma:    "20",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Compiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Compiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Decompiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Decompiling", Bonus: 2,
			}},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resonant Stream: Machinist", "Resonant Stream: Sourceror", "Resonant Stream: Technoshaman", "Dissonant Stream: Apophenian", "Dissonant Stream: Erisian", "Dissonant Stream: Morphinae"},
			},
		},
		Page:         "89",
		DoubleCareer: false,
	},
	"resonant_stream_machinist": {
		Name:     "Resonant Stream: Machinist",
		Karma:    "20",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Compiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Compiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Decompiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Decompiling", Bonus: 2,
			}},
			FadingValue: "",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resonant Stream: Cyberadept", "Resonant Stream: Sourceror", "Resonant Stream: Technoshaman", "Dissonant Stream: Apophenian", "Dissonant Stream: Erisian", "Dissonant Stream: Morphinae"},
			},
		},
		Page:         "90",
		DoubleCareer: false,
	},
	"resonant_stream_sourceror": {
		Name:     "Resonant Stream: Sourceror",
		Karma:    "20",
		Category: "Positive",
		Source:   "KC",
		Bonus: &QualityBonus{
			AddEcho:     "Sourcerer Daemon",
			FadingValue: "-2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resonant Stream: Cyberadept", "Resonant Stream: Machinist", "Resonant Stream: Technoshaman", "Dissonant Stream: Apophenian", "Dissonant Stream: Erisian", "Dissonant Stream: Morphinae"},
			},
		},
		Page:         "91",
		DoubleCareer: false,
	},
	"resonant_stream_technoshaman": {
		Name:     "Resonant Stream: Technoshaman",
		Karma:    "20",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resonant Stream: Cyberadept", "Resonant Stream: Machinist", "Resonant Stream: Sourceror", "Dissonant Stream: Apophenian", "Dissonant Stream: Erisian", "Dissonant Stream: Morphinae"},
			},
		},
		Page:         "91",
		DoubleCareer: false,
	},
	"dissonant_stream_apophenian": {
		Name:     "Dissonant Stream: Apophenian",
		Karma:    "20",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resonant Stream: Cyberadept", "Resonant Stream: Machinist", "Resonant Stream: Sourceror", "Resonant Stream: Technoshaman", "Dissonant Stream: Erisian", "Dissonant Stream: Morphinae"},
			},
		},
		Page:         "133",
		DoubleCareer: false,
	},
	"dissonant_stream_erisian": {
		Name:     "Dissonant Stream: Erisian",
		Karma:    "20",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resonant Stream: Cyberadept", "Resonant Stream: Machinist", "Resonant Stream: Sourceror", "Resonant Stream: Technoshaman", "Dissonant Stream: Apophenian", "Dissonant Stream: Morphinae"},
			},
		},
		Page:         "134",
		DoubleCareer: false,
	},
	"dissonant_stream_morphinae": {
		Name:     "Dissonant Stream: Morphinae",
		Karma:    "20",
		Category: "Positive",
		Source:   "KC",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Resonant Stream: Cyberadept", "Resonant Stream: Machinist", "Resonant Stream: Sourceror", "Resonant Stream: Technoshaman", "Dissonant Stream: Apophenian", "Dissonant Stream: Erisian"},
			},
		},
		Page:         "132",
		DoubleCareer: false,
	},
	"dead_sin": {
		Name:     "Dead SIN",
		Karma:    "-20",
		Category: "Negative",
		Source:   "BTB",
		Bonus: &QualityBonus{
			AddGear: "",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"SINner (Criminal)", "SINner (National)", "SINner (Corporate Limited)", "SINner (Corporate)"},
			},
		},
		Page: "162",
	},
	"hard_luck": {
		Name:     "Hard Luck",
		Karma:    "-5",
		Category: "Negative",
		Source:   "BTB",
		Bonus:    nil,
		Page:     "162",
	},
	"quadriplegic": {
		Name:     "Quadriplegic",
		Karma:    "-25",
		Category: "Negative",
		Source:   "BTB",
		Bonus: &QualityBonus{
			ReplaceAttributes: "",
			LifestyleCost:     "30",
		},
		Page: "139",
	},
	"hair_trigger": {
		Name:     "Hair Trigger",
		Karma:    "2",
		Category: "Positive",
		Source:   "BTB",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "160",
	},
	"hi_rez": {
		Name:     "Hi-Rez",
		Karma:    "4",
		Category: "Positive",
		Source:   "BTB",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Computer", Bonus: 2,
			},
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Technomancer"},
			},
		},
		Page: "160",
	},
	"instinctive_hack": {
		Name:     "Instinctive Hack",
		Karma:    "2",
		Category: "Positive",
		Source:   "BTB",
		Bonus:    nil,
		Page:     "160",
	},
	"rabble_rouser": {
		Name:     "Rabble Rouser",
		Karma:    "6",
		Category: "Positive",
		Source:   "BTB",
		Bonus: &QualityBonus{
			SkillCategory: &BiowareSkillCategoryBonus{
				Name: "Social Active", Bonus: "2",
			},
		},
		Page: "161",
	},
	"social_chameleon": {
		Name:     "Social Chameleon",
		Karma:    "7",
		Category: "Positive",
		Source:   "BTB",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Etiquette", Bonus: 2,
			},
		},
		Page: "139",
	},
	"resonant_discordance": {
		Name:     "Resonant Discordance",
		Karma:    "13",
		Category: "Positive",
		Source:   "BTB",
		Bonus: &QualityBonus{
			SpecificSkill: []common.SpecificSkillBonus{{
				Name: "Compiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Decompiling", Bonus: 2,
			}, common.SpecificSkillBonus{
				Name: "Software", Bonus: 2,
			}},
		},
		Required:              nil,
		Page:                  "161",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"prototype_materials": {
		Name:     "Prototype Materials",
		Karma:    "5",
		Category: "Positive",
		Source:   "BTB",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Special Modifications"},
			},
		},
		Forbidden: nil,
		Page:      "160",
	},
	"shoot_first_dont_ask": {
		Name:     "Shoot First, Don't Ask",
		Karma:    "2",
		Category: "Positive",
		Source:   "BTB",
		Bonus:    nil,
		Page:     "161",
	},
	"special_modifications": {
		Name:     "Special Modifications",
		Karma:    "5",
		Category: "Positive",
		Source:   "BTB",
		Limit:    "2",
		Bonus: &QualityBonus{
			SpecialModificationLimit: "2",
		},
		Forbidden: nil,
		Page:      "161",
	},
	"special_modifications_prototype_materials": {
		Name:     "Special Modifications (Prototype Materials)",
		Karma:    "5",
		Category: "Positive",
		Source:   "BTB",
		Bonus: &QualityBonus{
			SpecialModificationLimit: "2",
		},
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Prototype Materials"},
			},
		},
		Forbidden:  nil,
		Page:       "161",
		NameOnPage: "Special Modifications",
	},
	"elemental_attunement": {
		Name:                  "Elemental Attunement",
		Karma:                 "5",
		Category:              "Positive",
		Source:                "BTB",
		Required:              nil,
		Page:                  "161",
		CanBuyWithSpellPoints: true,
		DoubleCareer:          false,
	},
	"candle_in_the_darkness": {
		Name:     "Candle in the Darkness",
		Karma:    "5",
		Category: "Positive",
		Source:   "NF",
		Bonus:    nil,
		Required: &QualityRequired{
			OneOf: &QualityRequiredOneOf{
				Quality: []string{"Code of Honor", "Code of Honor: Avenging Angel", "Code of Honor: Black Hat", "Code of Honor: Like a Boss"},
			},
		},
		Page: "177",
	},
	"massive_network": {
		Name:     "Massive Network",
		Karma:    "20",
		Category: "Positive",
		Source:   "NF",
		Bonus: &QualityBonus{
			ContactKarma: "-2",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Networker"},
			},
		},
		Page: "177",
	},
	"networker": {
		Name:     "Networker",
		Karma:    "5",
		Category: "Positive",
		Source:   "NF",
		Bonus: &QualityBonus{
			ContactKarma:        "-1",
			ContactKarmaMinimum: "-1",
		},
		Forbidden: &QualityForbidden{
			OneOf: &QualityForbiddenOneOf{
				Quality: []string{"Massive Network"},
			},
		},
		Page: "177",
	},
	"stolen_gear": {
		Name:     "Stolen Gear",
		Karma:    "-1",
		Category: "Negative",
		Source:   "NF",
		Limit:    "20",
		Bonus: &QualityBonus{
			NuyenAmt:   "",
			NuyenMaxBP: "-1",
		},
		Page:           "177",
		ContributeToBP: false,
	},
}
