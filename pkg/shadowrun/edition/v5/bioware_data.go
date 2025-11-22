package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Code generated from bioware.xml. DO NOT EDIT.

var biowareData = &BiowareChummer{
	Grades: []BiowareGrades{
		{
			Grade: []BiowareGrade{
				{
					ID: "ee71d4f8-0fd0-4992-8b4e-70ef4dfbcce1",
					Name: stringPtr("None"),
					Ess: stringPtr("1"),
					Cost: stringPtr("1"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "1",
					},
				},
				{
					ID: "f0a67dc0-6b0a-43fa-b389-a110ba1dd59d",
					Name: stringPtr("Standard"),
					Ess: stringPtr("1"),
					Cost: stringPtr("1"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "451",
					},
				},
				{
					ID: "9166244c-440b-44a1-8795-4917b53e6101",
					Name: stringPtr("Standard (Burnout's Way)"),
					Ess: stringPtr("0.8"),
					Cost: stringPtr("1"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SG",
						Page: "177",
					},
				},
				{
					ID: "c4bbffe4-5818-4055-bc5e-f44562bde855",
					Name: stringPtr("Used"),
					Ess: stringPtr("1.25"),
					Cost: stringPtr("0.75"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("-4"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "451",
					},
				},
				{
					ID: "c2c6a3cc-c4bf-42c8-9260-868fd44d34ce",
					Name: stringPtr("Alphaware"),
					Ess: stringPtr("0.8"),
					Cost: stringPtr("1.2"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("+2"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "451",
					},
				},
				{
					ID: "9e24f0ce-b41e-496f-844a-82805fcb65a9",
					Name: stringPtr("Betaware"),
					Ess: stringPtr("0.7"),
					Cost: stringPtr("1.5"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("+4"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "451",
					},
				},
				{
					ID: "2b599ecd-4e80-4669-a78e-4db232c80a83",
					Name: stringPtr("Deltaware"),
					Ess: stringPtr("0.5"),
					Cost: stringPtr("2.5"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("+8"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "451",
					},
				},
				{
					ID: "0c86e85c-7e3e-4b6f-aa4b-26d8b379a7c9",
					Name: stringPtr("Gammaware"),
					Ess: stringPtr("0.4"),
					Cost: stringPtr("5"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("+12"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "72",
					},
				},
				{
					ID: "a6fba72c-9fbe-41dc-8310-cd047b50c81e",
					Name: stringPtr("Omegaware"),
					Ess: stringPtr("1"),
					Cost: stringPtr("0.75"),
					DeviceRating: intPtr(0),
					Avail: stringPtr("-4"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "71",
					},
				},
			},
		},
	},
	Categories: []BiowareCategories{
		{
			Category: []BiowareCategory{
				{
					Content: "Basic",
				},
				{
					Content: "Biosculpting",
				},
				{
					Content: "Bio-Weapons",
				},
				{
					Content: "Chemical Gland Modifications",
				},
				{
					Content: "Cosmetic Bioware",
				},
				{
					Content: "Cultured",
				},
				{
					Content: "Orthoskin Upgrades",
				},
				{
					Content: "Symbionts",
				},
				{
					Content: "Genetic Restoration",
				},
				{
					Content: "Phenotype Adjustment",
				},
				{
					Content: "Exotic Metagenetics",
				},
				{
					Content: "Transgenics",
				},
				{
					Content: "Environmental Microadaptation",
				},
				{
					Content: "Immunization",
				},
				{
					Content: "Transgenic Alteration",
				},
				{
					Content: "Complimentary Genetics",
				},
			},
		},
	},
	Biowares: []BiowareItems{
		{
			Bioware: []BiowareItem{
				{
					ID: "ae0bb365-e40c-4aa2-9c30-0be902d992ac",
					Name: "Adrenaline Pump",
					Category: "Basic",
					Ess: "Rating * 0.75",
					Capacity: "0",
					Avail: "(Rating * 6)F",
					Cost: "Rating * 55000",
					RequireParent: "",
					Rating: stringPtr("3"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "b04871a1-6b7b-4a78-89fc-af8ec69bdd3d",
					Name: "Bone Density Augmentation",
					Category: "Basic",
					Ess: "Rating * 0.3",
					Capacity: "0",
					Avail: "(Rating * 4)",
					Cost: "Rating * 5000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Damageresistance: []string{
							// 1 items omitted
						},
						Unarmeddv: []string{
							// 1 items omitted
						},
						Unarmeddvphysical: []bool{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "f038260b-f2de-4a9a-9507-5602d0e64a22",
					Name: "Cat's Eyes",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "4000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "81b40aa8-98d1-4a5d-89d6-9b6d438006da",
					Name: "Cerebral Booster",
					Category: "Cultured",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "Rating * 6",
					Cost: "Rating * 31500",
					RequireParent: "",
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "c46fbaba-d941-44b5-9bdc-643c5c6f4b24",
					Name: "Damage Compensators",
					Category: "Cultured",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "(Rating * 3)F",
					Cost: "Rating * 2000",
					RequireParent: "",
					Rating: stringPtr("12"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Conditionmonitor: &common.Conditionmonitor{},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "dfada66f-73f7-4648-aff4-6b6bce25f84c",
					Name: "Enhanced Articulation",
					Category: "Basic",
					Ess: "0.3",
					Capacity: "0",
					Avail: "12",
					Cost: "24000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
						Physicallimit: []string{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "b2289ebe-4bb0-49d0-a151-38fc1261bba8",
					Name: "Mnemonic Enhancer",
					Category: "Cultured",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "Rating * 5",
					Cost: "Rating * 9000",
					RequireParent: "",
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 5 items omitted
						},
						Memory: []string{
							// 1 items omitted
						},
						Mentallimit: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "841572d6-0785-4a8d-acd3-e106fb464781",
					Name: "Muscle Augmentation",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "(Rating * 5)R",
					Cost: "Rating * 31000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "69ab0255-a76b-4190-a8be-0473fed231ef",
					Name: "Muscle Toner",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "(Rating * 5)R",
					Cost: "Rating * 32000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "96e4809a-71e6-4b98-9740-c6c44bc33aa9",
					Name: "Orthoskin",
					Category: "Basic",
					Ess: "Rating * 0.25",
					Capacity: "0",
					Avail: "(Rating * 4)R",
					Cost: "Rating * 6000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Armor: &common.Armor{},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "add913d1-6174-41d6-8021-b8bf35345e7a",
					Name: "Pain Editor",
					Category: "Cultured",
					Ess: "0.3",
					Capacity: "0",
					Avail: "18F",
					Cost: "48000",
					RequireParent: "",
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "5bd98093-6620-4b0a-8f2c-61727d5c38a6",
					Name: "Pathogenic Defense",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "(Rating * 2)",
					Cost: "Rating * 4500",
					RequireParent: "",
					Rating: stringPtr("6"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Pathogeningestionresist: []string{
							// 1 items omitted
						},
						Pathogeninhalationresist: []string{
							// 1 items omitted
						},
						Pathogeninjectionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "8c75648c-19d2-4734-b107-c04bb0e1904a",
					Name: "Platelet Factories",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "17000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "17a6ba49-c21c-461b-9830-3beae8a237fc",
					Name: "Reflex Recorder",
					Category: "Cultured",
					Ess: "0.1",
					Capacity: "0",
					Avail: "10",
					Cost: "14000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Selectskill: &common.Selectskill{},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "3fd172b8-0ff5-46ee-a468-91edd4cdc448",
					Name: "Skin Pocket",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "12000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "5ffb0e03-c281-4aee-bc13-639576d932ab",
					Name: "Sleep Regulator",
					Category: "Cultured",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "12000",
					RequireParent: "",
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "d1a314d9-3b83-4d62-854d-90e3788eea83",
					Name: "Suprathyroid Gland",
					Category: "Basic",
					Ess: "0.7",
					Capacity: "0",
					Avail: "20R",
					Cost: "140000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Lifestylecost: []common.Lifestylecost{
							// 1 items omitted
						},
						Specificattribute: []common.Specificattribute{
							// 4 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "a08ce525-4788-42d8-b5d6-35a378f71776",
					Name: "Symbiotes",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "Rating * 5",
					Cost: "Rating * 3500",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Physicalcmrecovery: []string{
							// 1 items omitted
						},
						Stuncmrecovery: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "459",
					},
				},
				{
					ID: "4a4e1079-5872-4f3f-a450-48c30a5504f3",
					Name: "Synaptic Booster",
					Category: "Cultured",
					Ess: "Rating * 0.5",
					Capacity: "0",
					Avail: "(Rating * 6)R",
					Cost: "Rating * 95000",
					RequireParent: "",
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Initiativepass: &common.Initiativepass{},
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "461",
					},
				},
				{
					ID: "109b0a32-320f-41c5-9acb-c49308525ce0",
					Name: "Synthacardium",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "Rating * 4",
					Cost: "Rating * 30000",
					RequireParent: "",
					Rating: stringPtr("3"),
					Bonus: &common.BaseBonus{
						Skillgroup: []common.Skillgroup{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "2faac78a-ab32-4541-ad9c-3ef6c1b2cd84",
					Name: "Tailored Pheromones",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "(Rating * 4)R",
					Cost: "Rating * 31000",
					RequireParent: "",
					Rating: stringPtr("3"),
					Bonus: &common.BaseBonus{
						Skillgroup: []common.Skillgroup{
							// 2 items omitted
						},
						Sociallimit: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "4acd62c6-fe89-44f3-a880-2751b1cf5512",
					Name: "Toxin Extractor",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "Rating * 3",
					Cost: "Rating * 4800",
					RequireParent: "",
					Rating: stringPtr("6"),
					Bonus: &common.BaseBonus{
						Toxincontactresist: []string{
							// 1 items omitted
						},
						Toxiningestionresist: []string{
							// 1 items omitted
						},
						Toxininhalationresist: []string{
							// 1 items omitted
						},
						Toxininjectionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "988cf8a6-cfa0-4a62-8f64-b2065feffc02",
					Name: "Tracheal Filter",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "Rating * 3",
					Cost: "Rating * 4500",
					RequireParent: "",
					Rating: stringPtr("6"),
					Bonus: &common.BaseBonus{
						Toxininhalationresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "460",
					},
				},
				{
					ID: "abdbc210-c1fa-45f1-9840-4f78d9eb8867",
					Name: "Chemical Gland (Internal Release or Gradual Release)",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "12R or Gear",
					Cost: "20000 + (99 * Gear Cost)",
					RequireParent: "",
					Limit: stringPtr("False"),
					Notes: stringPtr("Bonus is for whether this is Internal Release or Gradual Release, not the cost of the chemical."),
					AllowSubsystems: &BiowareAllowSubsystems{
						Category: []string{
							// 1 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "112",
					},
				},
				{
					ID: "87453396-197f-4f7a-a6a3-6087d299bbd7",
					Name: "Chemical Gland (Exhalation Sprayer)",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12R or Gear",
					Cost: "26000 + (99 * Gear Cost)",
					RequireParent: "",
					Limit: stringPtr("False"),
					AllowSubsystems: &BiowareAllowSubsystems{
						Category: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "112",
					},
				},
				{
					ID: "47608117-a4af-4dfe-81bb-0dc8c6c5122d",
					Name: "Chemical Gland (Spitter)",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12R or Gear",
					Cost: "26000 + (99 * Gear Cost)",
					RequireParent: "",
					Limit: stringPtr("False"),
					AllowSubsystems: &BiowareAllowSubsystems{
						Category: []string{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "112",
					},
				},
				{
					ID: "915b1458-e33c-4010-a093-47d40cfa11de",
					Name: "Chemical Gland (Weapon Reservoir)",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12F or Gear",
					Cost: "24000 + (99 * Gear Cost)",
					RequireParent: "",
					Limit: stringPtr("False"),
					AllowSubsystems: &BiowareAllowSubsystems{
						Category: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "112",
					},
				},
				{
					ID: "d2064cf2-e9f7-479f-92cc-7da7c6024121",
					Name: "Chemical Gland Expanded Reservoir",
					Category: "Chemical Gland Modifications",
					Ess: "0.1",
					Capacity: "0",
					Avail: "12",
					Cost: "2000 + (4 * Parent Gear Cost)",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddToParentEss: stringPtr(""),
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "112",
					},
				},
				{
					ID: "ce9a6ed6-1307-4565-a6c9-c8fabde5255f",
					Name: "Chemical Repulsion",
					Category: "Orthoskin Upgrades",
					Ess: "0.25",
					Capacity: "0",
					Avail: "12R",
					Cost: "20000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Fatigueresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "116",
					},
				},
				{
					ID: "8aa2590f-1fc5-4706-a7b9-9eec3db4fab9",
					Name: "Dragon Hide",
					Category: "Orthoskin Upgrades",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "2000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "116",
					},
				},
				{
					ID: "857bbf66-3fab-466b-9c2c-f302340e3788",
					Name: "Insulation",
					Category: "Orthoskin Upgrades",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Electricityarmor: []string{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "116",
					},
				},
				{
					ID: "b4ac7427-8d1d-4da7-b8dc-fd3f6cb0d433",
					Name: "Electroshock",
					Category: "Orthoskin Upgrades",
					Ess: "0.25",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Electricityarmor: []string{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "116",
					},
				},
				{
					ID: "33f7ea1c-1f3a-4b32-a0b4-5ffa48735bfa",
					Name: "Penguin Blubber",
					Category: "Orthoskin Upgrades",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "2000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "116",
					},
				},
				{
					ID: "927e5c2b-fd62-4aa7-8911-d5f4468a9ff8",
					Name: "Sealskin",
					Category: "Orthoskin Upgrades",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "2000",
					RequireParent: "",
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "116",
					},
				},
				{
					ID: "f84dc64d-a158-45bd-b81c-0a8c98f77415",
					Name: "Sharkskin",
					Category: "Orthoskin Upgrades",
					Ess: "0.25",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "116",
					},
				},
				{
					ID: "6423d6b2-fcea-4eb0-b1cf-ea343cfc2f93",
					Name: "Elastic Joints",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "112",
					},
				},
				{
					ID: "0958e1d4-36d0-4246-b955-541a4993ec91",
					Name: "Gills",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Fatigueresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "4a939488-bd12-42f9-847f-1034fc3b4154",
					Name: "Hand and Foot Webbing (Hands)",
					Category: "Basic",
					Ess: "0.05",
					Capacity: "0",
					Avail: "8",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("{arm}"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "c60d9b5f-080b-4209-8a8e-19a76eca7a5b",
					Name: "Hand and Foot Webbing (Feet)",
					Category: "Basic",
					Ess: "0.05",
					Capacity: "0",
					Avail: "8",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("{leg}"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "e9c07c59-96c8-4ac7-955b-2474ff81381e",
					Name: "Hearing Enhancement",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "4000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "0f6391e3-cf60-4ac0-91b8-44a990753120",
					Name: "Hearing Expansion",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "4000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "8b57132f-507f-4624-a892-2ec4b14b7be8",
					Name: "Joint Replacement",
					Category: "Basic",
					Ess: "0.05",
					Capacity: "0",
					Avail: "2",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "02e4af5e-22a6-4ebc-a3dd-05d71448be64",
					Name: "Spidersilk Gland",
					Category: "Basic",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "35000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "114",
					},
				},
				{
					ID: "c5069f19-dae1-45f3-a1d4-b57d02534efa",
					Name: "Spinal Realignment",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "4000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "114",
					},
				},
				{
					ID: "1f843110-0f53-4675-918f-855b1379181b",
					Name: "Tactile Sensitivity",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "12",
					Cost: "8000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "114",
					},
				},
				{
					ID: "bac3eaa6-c1d3-457e-a319-1ce141baef37",
					Name: "Tail",
					Category: "Basic",
					Ess: "0.25",
					Capacity: "0",
					Avail: "4",
					Cost: "2000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "115",
					},
				},
				{
					ID: "ada5468c-e350-4323-be31-29d0fe545c9e",
					Name: "Tail, Prehensile",
					Category: "Basic",
					Ess: "0.5",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "115",
					},
				},
				{
					ID: "11e000de-eaef-445f-88fb-6b679b5e57ab",
					Name: "Troll Eyes",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "8",
					Cost: "10000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "115",
					},
				},
				{
					ID: "a923c0c8-1ac8-455a-9674-9af0072673ac",
					Name: "Vocal Range Enhancer",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "10000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "115",
					},
				},
				{
					ID: "70bd2c89-3432-4270-8e4c-d8d979114148",
					Name: "Vocal Range Expander",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12R",
					Cost: "30000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "115",
					},
				},
				{
					ID: "4f3f0651-6e1b-4dc3-b25a-33f62874cba8",
					Name: "Nephritic screen",
					Category: "Basic",
					Ess: "Rating * 0.05",
					Capacity: "0",
					Avail: "Rating * 2",
					Cost: "Rating * 4000",
					RequireParent: "",
					Rating: stringPtr("6"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Pathogeningestionresist: []string{
							// 1 items omitted
						},
						Pathogeninhalationresist: []string{
							// 1 items omitted
						},
						Pathogeninjectionresist: []string{
							// 1 items omitted
						},
						Physiologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Physiologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
						Psychologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Psychologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
						Toxiningestionresist: []string{
							// 1 items omitted
						},
						Toxininhalationresist: []string{
							// 1 items omitted
						},
						Toxininjectionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "3d9e763c-fcda-4fcd-96cc-4f02e4e6661a",
					Name: "Nictitating Membranes",
					Category: "Basic",
					Ess: "0.05",
					Capacity: "0",
					Avail: "6",
					Cost: "1000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "113",
					},
				},
				{
					ID: "8f12d662-9fc6-475f-8435-a11829c14956",
					Name: "Tailored Critter Pheromones",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "Rating * 4",
					Cost: "Rating * 2000",
					RequireParent: "",
					Rating: stringPtr("3"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "115",
					},
				},
				{
					ID: "c75c8286-2673-48a0-8e9b-cbfeec5c6bc1",
					Name: "Expanded Volume",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "Rating * 4",
					Cost: "Rating * 2000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Fatigueresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "112",
					},
				},
				{
					ID: "82636229-f784-489d-8981-6a1479f0056c",
					Name: "Amplified Immune System",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "Rating * 7",
					Cost: "Rating * 4000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Pathogeningestionresist: []string{
							// 1 items omitted
						},
						Pathogeninhalationresist: []string{
							// 1 items omitted
						},
						Pathogeninjectionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "111",
					},
				},
				{
					ID: "3645B67A-F19E-4566-B257-4056D2848B2C",
					Name: "Minor Biosculpting Modification",
					Category: "Biosculpting",
					Ess: "0",
					Capacity: "0",
					Avail: "2",
					Cost: "Variable(50-500)",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "108",
					},
				},
				{
					ID: "0e54ccda-6ba9-4668-b100-0442efd56221",
					Name: "Moderate Biosculpting Modification",
					Category: "Biosculpting",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "Variable(500-2000)",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "108",
					},
				},
				{
					ID: "a4ca355b-6188-42c1-88c7-93947f233314",
					Name: "Severe Biosculpting Modification",
					Category: "Biosculpting",
					Ess: "0.25",
					Capacity: "0",
					Avail: "8",
					Cost: "Variable(2000-10000)",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "108",
					},
				},
				{
					ID: "aa347008-38f1-4cb4-a919-bc705a8efe71",
					Name: "Troll Reduction",
					Category: "Biosculpting",
					Ess: "FixedValues(0.2,0.5)",
					Capacity: "0",
					Avail: "FixedValues(8,12)",
					Cost: "FixedValues(15000,25000)",
					RequireParent: "",
					Rating: stringPtr("2"),
					Bonus: &common.BaseBonus{
						Armor: &common.Armor{},
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "108",
					},
				},
				{
					ID: "C24D24C6-5F00-41F2-A6AC-0289A0BC5DF7",
					Name: "Troll Reduction (Ork)",
					Category: "Biosculpting",
					Ess: "0.2",
					Capacity: "0",
					Avail: "8",
					Cost: "15000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "108",
					},
				},
				{
					ID: "af01e25f-1e95-4c1a-a937-8cbe922529ca",
					Name: "Ethnicity/Sex Change",
					Category: "Biosculpting",
					Ess: "0",
					Capacity: "0",
					Avail: "4",
					Cost: "10000",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "108",
					},
				},
				{
					ID: "4c6458ec-082e-423c-b3df-ed57a62561f4",
					Name: "Metatype Modification",
					Category: "Biosculpting",
					Ess: "0",
					Capacity: "0",
					Avail: "8",
					Cost: "20000",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "108",
					},
				},
				{
					ID: "dfd48ff5-3ecf-47b4-81fd-62b1ff3f74e4",
					Name: "Claws",
					Category: "Bio-Weapons",
					Ess: "0.1*Rating",
					Capacity: "0",
					Avail: "4R",
					Cost: "500",
					RequireParent: "",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Limit: stringPtr("False"),
					Rating: stringPtr("2"),
					Notes: stringPtr("Rating is used to indicate number of claws."),
					AddWeapon: []string{
						"Claws (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "885aa282-e624-4f8d-94e6-afafe672b3af",
					Name: "Claws (Retractable)",
					Category: "Bio-Weapons",
					Ess: "0.15*Rating",
					Capacity: "0",
					Avail: "6R",
					Cost: "Rating * 1000",
					RequireParent: "",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Limit: stringPtr("False"),
					Rating: stringPtr("2"),
					Notes: stringPtr("Rating is used to indicate number of claws."),
					AddWeapon: []string{
						"Retractable Claws (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "8832f6ac-0082-4b9b-9e1c-7f90874a23a1",
					Name: "Striking Callus",
					Category: "Bio-Weapons",
					Ess: "0.05*Rating",
					Capacity: "0",
					Avail: "2",
					Cost: "Rating*250",
					RequireParent: "",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Rating: stringPtr("4"),
					Notes: stringPtr("Rating is used to represent hands and feet. Every 2 Rating will grant +1 Unarmed damage."),
					Bonus: &common.BaseBonus{
						Unarmeddv: []string{
							// 1 items omitted
						},
						Unarmeddvphysical: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "f56ee63d-7ed3-4b5f-bde9-5b581eca9220",
					Name: "Tusk(s), Small",
					Category: "Bio-Weapons",
					Ess: "0",
					Capacity: "0",
					Avail: "2",
					Cost: "Rating*100",
					RequireParent: "",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Limit: stringPtr("False"),
					Rating: stringPtr("2"),
					Notes: stringPtr("Rating is used to indicate number of tusks."),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "3caa7752-63ee-40c9-ba3f-d11aef038812",
					Name: "Tusk(s), Medium",
					Category: "Bio-Weapons",
					Ess: "0.1*Rating",
					Capacity: "0",
					Avail: "2",
					Cost: "Rating*500",
					RequireParent: "",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Limit: stringPtr("False"),
					Rating: stringPtr("2"),
					Notes: stringPtr("Rating is used to indicate number of tusks."),
					AddWeapon: []string{
						"Medium Tusk(s)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "d5e4c407-58e4-4b24-ba11-65c45d256f97",
					Name: "Tusk(s), Large",
					Category: "Bio-Weapons",
					Ess: "0.2*Rating",
					Capacity: "0",
					Avail: "8R",
					Cost: "Rating*1000",
					RequireParent: "",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Limit: stringPtr("False"),
					Rating: stringPtr("2"),
					Notes: stringPtr("Rating is used to indicate number of tusks."),
					AddWeapon: []string{
						"Large Tusk(s)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "c0dedc5f-2c75-4dcb-9fc3-86fc44adea58",
					Name: "Claws, Fixed (Hands)",
					Category: "Bio-Weapons",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4R",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("{arm}"),
					BlocksMounts: stringPtr("wrist,elbow,shoulder"),
					AddWeapon: []string{
						"Claws (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "df52299c-321c-4cf8-9f38-038c5a44d455",
					Name: "Claws, Retractable (Hands)",
					Category: "Bio-Weapons",
					Ess: "0.15",
					Capacity: "0",
					Avail: "6R",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("{arm}"),
					BlocksMounts: stringPtr("wrist,elbow,shoulder"),
					AddWeapon: []string{
						"Retractable Claws (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "da38afc5-fe4c-4dfa-8f9f-e9e88adcb357",
					Name: "Claws, Fixed (Feet)",
					Category: "Bio-Weapons",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4R",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("{leg}"),
					BlocksMounts: stringPtr("ankle,knee,hip"),
					AddWeapon: []string{
						"Claws (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "ea389d15-539a-4d7b-aa2f-33ea6cf0d40b",
					Name: "Claws, Retractable (Feet)",
					Category: "Bio-Weapons",
					Ess: "0.15",
					Capacity: "0",
					Avail: "6R",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("{leg}"),
					BlocksMounts: stringPtr("ankle,knee,hip"),
					AddWeapon: []string{
						"Retractable Claws (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "ccd4b880-cf85-4b96-9de0-211dc6fb48e2",
					Name: "Striking Callus (Hands)",
					Category: "Bio-Weapons",
					Ess: "0.05",
					Capacity: "0",
					Avail: "2",
					Cost: "250",
					RequireParent: "",
					Limit: stringPtr("{arm}"),
					BlocksMounts: stringPtr("wrist,elbow,shoulder"),
					Bonus: &common.BaseBonus{
						Unarmeddvphysical: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "56f6c403-3d29-4055-a323-a7b67acb607d",
					Name: "Striking Callus (Feet)",
					Category: "Bio-Weapons",
					Ess: "0.05",
					Capacity: "0",
					Avail: "2",
					Cost: "250",
					RequireParent: "",
					Limit: stringPtr("{leg}"),
					BlocksMounts: stringPtr("ankle,knee,hip"),
					Bonus: &common.BaseBonus{
						Unarmeddvphysical: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "ee1d31e8-f5c9-4326-8139-3e591003f736",
					Name: "Tusk(s), Small",
					Category: "Bio-Weapons",
					Ess: "0",
					Capacity: "0",
					Avail: "2",
					Cost: "100",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "34310f59-55d5-4e95-8966-a97b20a388ce",
					Name: "Tusk(s), Medium",
					Category: "Bio-Weapons",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Medium Tusk(s)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "715d0e82-9fbf-42d6-94a6-efbb03540435",
					Name: "Tusk(s), Large",
					Category: "Bio-Weapons",
					Ess: "0.2",
					Capacity: "0",
					Avail: "8R",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Large Tusk(s)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "1c919d10-72ae-4cd9-bad2-6b4a23ae48b0",
					Name: "Replacement Tusk(s), Small",
					Category: "Bio-Weapons",
					Ess: "0",
					Capacity: "0",
					Avail: "2",
					Cost: "100",
					RequireParent: "",
					Limit: stringPtr("False"),
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "f97ba92a-bba5-4b52-ab4c-28102c67acd7",
					Name: "Replacement Tusk(s), Medium",
					Category: "Bio-Weapons",
					Ess: "0",
					Capacity: "0",
					Avail: "4",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Medium Tusk(s)",
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "787ff755-16f5-4dfa-9cf8-49b8399103e6",
					Name: "Electrical Discharge",
					Category: "Bio-Weapons",
					Ess: "0.3",
					Capacity: "0",
					Avail: "8",
					Cost: "10000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Electrical Discharge",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "82780b5b-41dd-49ae-964f-c14ca91a0f14",
					Name: "Fangs",
					Category: "Bio-Weapons",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Fangs (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "3f0fda69-a098-4c9a-855e-5dd2d46ae3da",
					Name: "Fangs (Retractable)",
					Category: "Bio-Weapons",
					Ess: "0.15",
					Capacity: "0",
					Avail: "6",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Retractable Fangs (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "cbe09df9-556d-44d4-9d68-073415850deb",
					Name: "Horns",
					Category: "Bio-Weapons",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Horns (Bio-Weapon)",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "120",
					},
				},
				{
					ID: "605b82f9-9f12-4a14-b567-091dd5fcde80",
					Name: "Muzzle",
					Category: "Bio-Weapons",
					Ess: "0.3",
					Capacity: "0",
					Avail: "8R",
					Cost: "2000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Weaponaccuracy: []common.Weaponaccuracy{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "828ca5e9-4409-42aa-a6df-87fc907fede2",
					Name: "Sprayer",
					Category: "Bio-Weapons",
					Ess: "0.25",
					Capacity: "0",
					Avail: "8",
					Cost: "4000",
					RequireParent: "",
					AddWeapon: []string{
						"",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "b9085cbe-8e67-4205-8e49-603e31f9d6f7",
					Name: "Stinger, Tiny",
					Category: "Bio-Weapons",
					Ess: "0.05",
					Capacity: "0",
					Avail: "8",
					Cost: "100",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "77bcbea4-fc69-42e6-b4e3-0debe6c08596",
					Name: "Stinger, Medium",
					Category: "Bio-Weapons",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8R",
					Cost: "2000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Medium Stinger",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "c466a6cf-bf31-4300-b53e-0f83af141342",
					Name: "Stinger, Large",
					Category: "Bio-Weapons",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12F",
					Cost: "8000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Large Stinger",
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "121",
					},
				},
				{
					ID: "f8195e35-fed4-463a-bd09-b559a6e05803",
					Name: "Bio-Tattoos",
					Category: "Cosmetic Bioware",
					Ess: "FixedValues(0,0.01,0.02)",
					Capacity: "0",
					Avail: "FixedValues(4,5,6)",
					Cost: "FixedValues(500,1000,1500)",
					RequireParent: "",
					Limit: stringPtr("False"),
					Rating: stringPtr("3"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "ebf3f1ed-700f-4b37-b61a-0b262937dea6",
					Name: "Chameleon Skin",
					Category: "Cosmetic Bioware",
					Ess: "0.2",
					Capacity: "0",
					Avail: "6",
					Cost: "2000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "98ae7b28-33ab-47ab-aa7b-5e1f4a90b8ce",
					Name: "Chameleon Skin (Dynamic)",
					Category: "Cosmetic Bioware",
					Ess: "0.3",
					Capacity: "0",
					Avail: "8",
					Cost: "4000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "e3897bf8-0961-4b77-863a-4fbc4c0860f2",
					Name: "Clean Metabolism",
					Category: "Cosmetic Bioware",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "1000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "a2ff0680-3083-40c4-9f8b-5677aacdeaa8",
					Name: "Chloroplast Skin",
					Category: "Cosmetic Bioware",
					Ess: "0.2",
					Capacity: "0",
					Avail: "4",
					Cost: "2000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "458010b9-f07f-4976-bd5b-7053c4837b79",
					Name: "Dietware",
					Category: "Cosmetic Bioware",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "1000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "89137e94-5bf3-4c6d-93d9-571c96fc5b2f",
					Name: "Hair Growth",
					Category: "Cosmetic Bioware",
					Ess: "0",
					Capacity: "0",
					Avail: "4",
					Cost: "200",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "a3e4a944-6463-4cd9-b3bc-6b940c6427f3",
					Name: "Hair Growth (Full-Body)",
					Category: "Cosmetic Bioware",
					Ess: "0",
					Capacity: "0",
					Avail: "5",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "9f86544d-da24-4312-b4d5-6ab47956b7fa",
					Name: "Perfect Eyes",
					Category: "Cosmetic Bioware",
					Ess: "0",
					Capacity: "0",
					Avail: "4",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "109",
					},
				},
				{
					ID: "e53383b8-ed64-4840-a2bf-baaa8885c61b",
					Name: "Sensitive Skin",
					Category: "Cosmetic Bioware",
					Ess: "0",
					Capacity: "0",
					Avail: "4",
					Cost: "Rating * 500",
					RequireParent: "",
					Limit: stringPtr("False"),
					Rating: stringPtr("20"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "110",
					},
				},
				{
					ID: "98e8f46f-e742-4456-95b7-f6f3eaa7d795",
					Name: "Silky Skin",
					Category: "Cosmetic Bioware",
					Ess: "0",
					Capacity: "0",
					Avail: "4",
					Cost: "500",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "110",
					},
				},
				{
					ID: "487ba675-b689-48e0-bd45-e6729d671a51",
					Name: "Skin Pigmentation",
					Category: "Cosmetic Bioware",
					Ess: "0",
					Capacity: "0",
					Avail: "8",
					Cost: "200",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "111",
					},
				},
				{
					ID: "9cd588c4-c93f-4fef-b216-9da2707066f7",
					Name: "Skin Pigmentation (Permanent)",
					Category: "Cosmetic Bioware",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "1000",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "111",
					},
				},
				{
					ID: "afbf823f-3116-4967-93d2-0e334bb35d3a",
					Name: "Cerebellum Booster",
					Category: "Cultured",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "Rating * 8",
					Cost: "Rating * 50000",
					RequireParent: "",
					Rating: stringPtr("2"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "1abeac7c-79c5-4774-ad45-cd355ebc1476",
					Name: "Boosted Reflexes",
					Category: "Cultured",
					Ess: "1",
					Capacity: "0",
					Avail: "8R",
					Cost: "10000",
					RequireParent: "",
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Initiativepass: &common.Initiativepass{},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "aece83ad-cec8-4117-adbd-3ec5e2049372",
					Name: "Knowledge Infusion",
					Category: "Cultured",
					Ess: "0.1",
					Capacity: "0",
					Avail: "12",
					Cost: "2000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Selectskill: &common.Selectskill{},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "19000eeb-099e-4d63-9e1f-39a321569abe",
					Name: "Limb replacement (Finger/Toe)",
					Category: "Cultured",
					Ess: "0.02",
					Capacity: "0",
					Avail: "4",
					Cost: "2000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "7346dc96-af61-48f4-a98c-3bbe5fa64005",
					Name: "Limb replacement (Hand/foot)",
					Category: "Cultured",
					Ess: "0.02",
					Capacity: "0",
					Avail: "8",
					Cost: "20000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "4a61e7db-b4e2-48e3-8744-6a44bff453a7",
					Name: "Limb replacement (Half arm/leg)",
					Category: "Cultured",
					Ess: "0.02",
					Capacity: "0",
					Avail: "12",
					Cost: "40000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "67be6b07-11e4-49e6-8f6f-6931a3f8bf1f",
					Name: "Limb replacement (Full arm/leg)",
					Category: "Cultured",
					Ess: "0.02",
					Capacity: "0",
					Avail: "12",
					Cost: "80000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "f0aa87d0-2d86-482c-808d-667f1078f357",
					Name: "Neuro Retention Amplification",
					Category: "Cultured",
					Ess: "0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "10000",
					RequireParent: "",
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Addqualities: &common.Addqualities{},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "0dc21074-6b2c-446a-aadc-e8304c9c124f",
					Name: "Reproductive Replacement, Male",
					Category: "Cultured",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "31b609ee-6856-44bb-b1f5-19066c0a74c0",
					Name: "Reproductive Replacement, Female",
					Category: "Cultured",
					Ess: "0.3",
					Capacity: "0",
					Avail: "4",
					Cost: "20000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "e99097a1-84d5-4038-8525-761d199c58a7",
					Name: "Trauma Damper",
					Category: "Cultured",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "(Rating * 4)R",
					Cost: "Rating * 4000",
					RequireParent: "",
					Rating: stringPtr("4"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "119",
					},
				},
				{
					ID: "e78a9465-d399-4e94-bea8-7e98c8fc960d",
					Name: "Tremor Reducer",
					Category: "Cultured",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "Rating * 6",
					Cost: "Rating * 10000",
					RequireParent: "",
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "119",
					},
				},
				{
					ID: "5f2c33a4-3472-4643-a0bb-9a6e52554c2f",
					Name: "Reception Enhancer",
					Category: "Cultured",
					Ess: "0.2",
					Capacity: "0",
					Avail: "4",
					Cost: "10000",
					RequireParent: "",
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "118",
					},
				},
				{
					ID: "4e9c11ed-730a-478f-a53d-d36220040506",
					Name: "Genewipe",
					Category: "Phenotype Adjustment",
					Ess: "0.2",
					Capacity: "0",
					Avail: "16F",
					Cost: "57000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "163a1d28-9f0d-414f-8b8f-473f78a3740d",
					Name: "Masque",
					Category: "Phenotype Adjustment",
					Ess: "0.1",
					Capacity: "0",
					Avail: "10F",
					Cost: "40000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "5f3da0ce-261f-4d1a-87a7-1e0614d65ef0",
					Name: "Reprint",
					Category: "Phenotype Adjustment",
					Ess: "0.1",
					Capacity: "0",
					Avail: "12F",
					Cost: "30000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "0f9ebf2e-d949-49f2-8f30-4e8413e92e39",
					Name: "Shuffle",
					Category: "Phenotype Adjustment",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12F",
					Cost: "20000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "6bd96ba6-1e0c-4de1-89e7-01b6973e1115",
					Name: "Elastic Stomach",
					Category: "Exotic Metagenetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "10000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "159",
					},
				},
				{
					ID: "4a529d50-45cd-4f2d-8766-4ecd7c15f292",
					Name: "Hyperthymesia",
					Category: "Exotic Metagenetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "10",
					Cost: "15000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Memory: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "159",
					},
				},
				{
					ID: "f3e1922e-cd73-4567-983c-7409e755f30a",
					Name: "Lung Expansion",
					Category: "Exotic Metagenetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "16500",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Fatigueresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "159",
					},
				},
				{
					ID: "b111b7c3-d44f-40b5-bba2-7d805cf9fd4c",
					Name: "Increased Myelination",
					Category: "Exotic Metagenetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "12000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Electricityarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "159",
					},
				},
				{
					ID: "1b6713f7-f5b6-49fb-a89a-68322c06f38d",
					Name: "Myostatin Inhibitor",
					Category: "Exotic Metagenetics",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "30500",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Attributekarmacost: []common.Attributekarmacost{
							// 1 items omitted
						},
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "159",
					},
				},
				{
					ID: "92a00ca4-7e2b-47ca-ac02-1d58e4932d0a",
					Name: "Narco",
					Category: "Exotic Metagenetics",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12F",
					Cost: "16420",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Physiologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Physiologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
						Psychologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Psychologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "159",
					},
				},
				{
					ID: "8d57009b-86c8-4fde-b8b5-1cf64942f517",
					Name: "Selective Hearing",
					Category: "Exotic Metagenetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "17000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "a2acbc5a-187c-4e6f-95e5-c015f1aab56b",
					Name: "Thickened Digestive Tract Lining",
					Category: "Exotic Metagenetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "8000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Lifestylecost: []common.Lifestylecost{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
						Toxiningestionresist: []string{
							// 1 items omitted
						},
						Toxininhalationresist: []string{
							// 1 items omitted
						},
						Toxininjectionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "3f8b9030-662e-4212-8f30-5aa394a41568",
					Name: "Adapsin",
					Category: "Transgenics",
					Ess: "0.2",
					Capacity: "0",
					Avail: "16",
					Cost: "30000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Adapsin: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "6a62e21f-f291-4e93-b109-df9c56c938f9",
					Name: "Dareadrenaline",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "61000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Addqualities: &common.Addqualities{},
						Skillattribute: []common.Skillattribute{
							// 1 items omitted
						},
						Composure: []bool{
							// 1 items omitted
						},
						Decreaseagiresist: []bool{
							// 1 items omitted
						},
						Decreasebodresist: []bool{
							// 1 items omitted
						},
						Decreasecharesist: []bool{
							// 1 items omitted
						},
						Decreaseintresist: []bool{
							// 1 items omitted
						},
						Decreaselogresist: []bool{
							// 1 items omitted
						},
						Decreaserearesist: []bool{
							// 1 items omitted
						},
						Decreasestrresist: []bool{
							// 1 items omitted
						},
						Decreasewilresist: []bool{
							// 1 items omitted
						},
						Detectionspellresist: []string{
							// 1 items omitted
						},
						Drainresist: []string{
							// 1 items omitted
						},
						Directmanaspellresist: []bool{
							// 1 items omitted
						},
						Fadingresist: []bool{
							// 1 items omitted
						},
						Judgeintentionsdefense: []string{
							// 1 items omitted
						},
						Manaillusionresist: []string{
							// 1 items omitted
						},
						Mentalmanipulationresist: []string{
							// 1 items omitted
						},
						Physiologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Physiologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
						Psychologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Psychologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "04bea47c-85f3-4efa-b058-72def7d0d73b",
					Name: "Double Elastin",
					Category: "Transgenics",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "18000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Fatigueresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "cd0d68d6-34e5-440e-9d78-5400008a5f71",
					Name: "Hyper-Glucagon",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "8000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Lifestylecost: []common.Lifestylecost{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "ef4a3bfe-5698-43ae-a4ff-8056aec4095d",
					Name: "Magnesense",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "7000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "bd4aade6-a0f2-40af-8073-f1e62ae4b3f9",
					Name: "Neo-EPO",
					Category: "Transgenics",
					Ess: "0.2",
					Capacity: "0",
					Avail: "6",
					Cost: "38000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Skillgroup: []common.Skillgroup{
							// 1 items omitted
						},
						Fatigueresist: []string{
							// 1 items omitted
						},
						Physicalcmrecovery: []string{
							// 1 items omitted
						},
						Physicallimit: []string{
							// 1 items omitted
						},
						Stuncmrecovery: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "2c988cbe-e6e6-4c22-ae3c-14ad6e1fff1f",
					Name: "PuSHed",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "14",
					Cost: "62000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Skilllinkedattribute: []common.Skilllinkedattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "160",
					},
				},
				{
					ID: "b110516e-36e8-4c69-a682-066e91c02351",
					Name: "Qualia",
					Category: "Transgenics",
					Ess: "0.4",
					Capacity: "0",
					Avail: "14",
					Cost: "65000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Skilllinkedattribute: []common.Skilllinkedattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "161",
					},
				},
				{
					ID: "eb25dd41-2649-4e75-b0fb-dc47df3a7daa",
					Name: "Reakt",
					Category: "Transgenics",
					Ess: "0.4",
					Capacity: "0",
					Avail: "10",
					Cost: "73000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Dodge: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "161",
					},
				},
				{
					ID: "afea1a35-d8ca-4cab-9555-7a7d5df1390d",
					Name: "Skeletal Pneumaticity",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "5",
					Cost: "9000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "161",
					},
				},
				{
					ID: "e1cf23c7-9c79-4007-a2e8-ff872ee212e2",
					Name: "Solus",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "8000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Lifestylecost: []common.Lifestylecost{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "161",
					},
				},
				{
					ID: "92b4c2a4-10a3-486a-8ab6-1e00d40dd69a",
					Name: "Synaptic Acceleration",
					Category: "Transgenics",
					Ess: "0.4",
					Capacity: "0",
					Avail: "8",
					Cost: "78000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Initiative: &common.Initiative{},
						Initiativepass: &common.Initiativepass{},
						Dodge: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "162",
					},
				},
				{
					ID: "89d6f0e2-f618-4a5f-b24f-e42603100fc3",
					Name: "Synch",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "14000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "162",
					},
				},
				{
					ID: "6aa86a49-d947-47ac-bf04-e1578c029333",
					Name: "Tetrachromacy",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "10",
					Cost: "8000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "161",
					},
				},
				{
					ID: "ae1d7612-7805-4962-8f9a-beb17619762d",
					Name: "Vasocon",
					Category: "Transgenics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "15000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "161",
					},
				},
				{
					ID: "7aad79ff-7722-440d-a9c6-5b33b4ad7440",
					Name: "Allergen Tolerance",
					Category: "Environmental Microadaptation",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "20000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "163",
					},
				},
				{
					ID: "d4f12de1-29bc-4d6e-9ef2-d395b446c9e4",
					Name: "Cold Adaptation",
					Category: "Environmental Microadaptation",
					Ess: "0.5",
					Capacity: "0",
					Avail: "5",
					Cost: "8000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "163",
					},
				},
				{
					ID: "f5b67712-1609-4f76-bb61-ad83d3d3e926",
					Name: "Cryo Tolerance",
					Category: "Environmental Microadaptation",
					Ess: "0.5",
					Capacity: "0",
					Avail: "18",
					Cost: "50000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "163",
					},
				},
				{
					ID: "7b5bfe60-c7f6-4df2-9e53-56a76a4e8a8e",
					Name: "Heat Adaptation",
					Category: "Environmental Microadaptation",
					Ess: "0.5",
					Capacity: "0",
					Avail: "5",
					Cost: "8000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "163",
					},
				},
				{
					ID: "0453cf1e-3224-46ce-82bb-fde03ef6e451",
					Name: "Low Oxygen Adaptation",
					Category: "Environmental Microadaptation",
					Ess: "0.5",
					Capacity: "0",
					Avail: "4",
					Cost: "8000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Lifestylecost: []common.Lifestylecost{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "163",
					},
				},
				{
					ID: "4c67dc6a-eafb-40c7-88a1-b32518800db2",
					Name: "Microgravity Adaptation",
					Category: "Environmental Microadaptation",
					Ess: "0.5",
					Capacity: "0",
					Avail: "4",
					Cost: "30000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "163",
					},
				},
				{
					ID: "5b3d3dce-2cd2-4720-84ae-4445092a4245",
					Name: "Pollution Tolerance",
					Category: "Environmental Microadaptation",
					Ess: "0.5",
					Capacity: "0",
					Avail: "5",
					Cost: "15000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Toxincontactresist: []string{
							// 1 items omitted
						},
						Toxiningestionresist: []string{
							// 1 items omitted
						},
						Toxininhalationresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "163",
					},
				},
				{
					ID: "3550fe0d-453d-431f-bd84-d9cd50581f39",
					Name: "Radiation Tolerance",
					Category: "Environmental Microadaptation",
					Ess: "0.5",
					Capacity: "0",
					Avail: "6",
					Cost: "15000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Radiationresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "164",
					},
				},
				{
					ID: "a950129b-00a6-4445-a1b6-d82f158e83dc",
					Name: "Transgenic Alteration",
					Category: "Transgenic Alteration",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "Variable(30000-1000000)",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "164",
					},
				},
				{
					ID: "5c277258-ea34-46a3-b10a-323e0eed4dfa",
					Name: "Control Rig Optimization",
					Category: "Complimentary Genetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "7",
					Cost: "4600",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "165",
					},
				},
				{
					ID: "dc3dbcd5-dc86-44db-8b99-ae69a8b60a1d",
					Name: "Reaction Optimization",
					Category: "Complimentary Genetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "6600",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Initiative: &common.Initiative{},
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "165",
					},
				},
				{
					ID: "afe25e41-8d6c-4476-9d18-ecd23219207c",
					Name: "Reflex Recorder Optimization",
					Category: "Complimentary Genetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "11",
					Cost: "3800",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Reflexrecorderoptimization: []bool{
							// 1 items omitted
						},
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "165",
					},
				},
				{
					ID: "99c04ae8-e1c0-4455-8f76-ff77edfb790f",
					Name: "Wired Reflex Optimization",
					Category: "Complimentary Genetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "9R",
					Cost: "9000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "165",
					},
				},
				{
					ID: "b6682632-5566-4156-8dab-4187e13901d8",
					Name: "Adrenaline Pump Optimization",
					Category: "Complimentary Genetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "7F",
					Cost: "6000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "165",
					},
				},
				{
					ID: "f0a72240-00e0-4b4f-b25f-b38f19e51a38",
					Name: "Enhanced Symbiosis",
					Category: "Complimentary Genetics",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "4000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "165",
					},
				},
				{
					ID: "c0c9314e-1fa2-4bd7-a02d-70beaf99def2",
					Name: "Genetic Optimization (Body)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "70552613-23ca-4e53-bf8f-83f87f134b05",
					Name: "Genetic Optimization (Agility)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "da01f3fc-e77a-419f-8cad-907fe7e995d5",
					Name: "Genetic Optimization (Reaction)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "4b10adbe-567f-4e7d-affd-70c312efdb22",
					Name: "Genetic Optimization (Strength)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "aeab29b0-4ac1-47cc-980e-36cfb562ac17",
					Name: "Genetic Optimization (Charisma)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "5ec34679-27d6-4bb7-b408-1ca1b2f81bd0",
					Name: "Genetic Optimization (Intuition)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "c388537e-e533-48c3-a101-c57be8426295",
					Name: "Genetic Optimization (Logic)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "19142a2e-1078-4b23-9996-313cb57daa07",
					Name: "Genetic Optimization (Willpower)",
					Category: "Phenotype Adjustment",
					Ess: "0.3",
					Capacity: "0",
					Avail: "10",
					Cost: "47000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "da62e249-cb11-4907-98d3-edc50e7efc2a",
					Name: "Cosmetic Alteration",
					Category: "Phenotype Adjustment",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "35000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "158",
					},
				},
				{
					ID: "cd268d9e-52c7-4f02-913c-ff37bdd14e6e",
					Name: "Print Removal",
					Category: "Phenotype Adjustment",
					Ess: "0.1",
					Capacity: "0",
					Avail: "10F",
					Cost: "18000",
					RequireParent: "",
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "158",
					},
				},
				{
					ID: "d23aac11-8e3c-4739-9da5-b8322f81d64c",
					Name: "Metaposeur",
					Category: "Phenotype Adjustment",
					Ess: "0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "38000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "158",
					},
				},
				{
					ID: "181f09c2-af17-4676-bb6a-62706c4fc521",
					Name: "Immunization",
					Category: "Immunization",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "20000",
					RequireParent: "",
					Limit: stringPtr("{BODUnaug}"),
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "164",
					},
				},
				{
					ID: "9a3cf302-b2bb-402f-93e2-7872eca63d31",
					Name: "Therapeutic Genetics",
					Category: "Genetic Restoration",
					Ess: "0.2",
					Capacity: "0",
					Avail: "10",
					Cost: "90000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					Bonus: &common.BaseBonus{
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "156",
					},
				},
				{
					ID: "669926ea-55ec-4365-adcf-f8028a464124",
					Name: "Leónization",
					Category: "Genetic Restoration",
					Ess: "1",
					Capacity: "0",
					Avail: "15",
					Cost: "2000000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "156",
					},
				},
				{
					ID: "78797e7f-020d-4e4a-a08b-207890f73fc5",
					Name: "Lifespan Extension",
					Category: "Genetic Restoration",
					Ess: "0.5",
					Capacity: "0",
					Avail: "12",
					Cost: "300000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "11e5627e-aeff-4910-bf06-b8817b46f786",
					Name: "Physical Vigor",
					Category: "Genetic Restoration",
					Ess: "0.5",
					Capacity: "0",
					Avail: "13",
					Cost: "250000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "156",
					},
				},
				{
					ID: "aa42b990-04db-4cae-81e3-a93bce93616f",
					Name: "Augmented Healing",
					Category: "Genetic Restoration",
					Ess: "0",
					Capacity: "0",
					Avail: "10",
					Cost: "35000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "156",
					},
				},
				{
					ID: "3af9942f-6e6c-4c0d-a962-a6cf30504a00",
					Name: "Cellular Repair",
					Category: "Genetic Restoration",
					Ess: "0",
					Capacity: "0",
					Avail: "10",
					Cost: "65000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "156",
					},
				},
				{
					ID: "b69a23aa-4543-4e8a-95a1-4a0f9f5250e9",
					Name: "Revitilization",
					Category: "Genetic Restoration",
					Ess: "-0.1",
					Capacity: "0",
					Avail: "14",
					Cost: "110000",
					RequireParent: "",
					Limit: stringPtr("False"),
					ForceGrade: stringPtr("None"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "157",
					},
				},
				{
					ID: "738c15f8-49ea-417e-9728-b4c78bc72c18",
					Name: "Cleaner Leech",
					Category: "Symbionts",
					Ess: "0",
					Capacity: "0",
					Avail: "4",
					Cost: "100",
					RequireParent: "",
					Limit: stringPtr("False"),
					Bonus: &common.BaseBonus{
						Physicalcmrecovery: []string{
							// 1 items omitted
						},
						Stuncmrecovery: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "573b2541-9e9a-4b9d-b219-27fb6c808d40",
					Name: "Booster Endosont",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "10000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "f829a2e5-ab36-499a-8c7d-9bd44a7284f3",
					Name: "Digester Endosont",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "10000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Lifestylecost: []common.Lifestylecost{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "5025417f-2a14-4b6f-8d53-52445bc16c31",
					Name: "Electroreceptor Endosont",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "10000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "c2700f31-a361-4ea2-974e-dd5bde62913a",
					Name: "Mild Allergy Resistance",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "8",
					Cost: "10000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "982290e5-2c21-41c0-9847-e47eb455c2f7",
					Name: "Moderate Allergy Resistance",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "30000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "3d2ee994-be0c-4e07-a2ce-b616a37d8ee8",
					Name: "Severe Allergy Resistance",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "16",
					Cost: "50000",
					RequireParent: "",
					Limit: stringPtr("False"),
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "6207437b-a8f9-420b-81de-970d832cba6d",
					Name: "Lactose Tolerance",
					Category: "Symbionts",
					Ess: "0",
					Capacity: "0",
					Avail: "2",
					Cost: "50",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "123",
					},
				},
				{
					ID: "ac744186-59f6-4105-a08a-0e8c7fd3c847",
					Name: "Mender Endosont",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "30000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Physicalcmrecovery: []string{
							// 1 items omitted
						},
						Stuncmrecovery: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "124",
					},
				},
				{
					ID: "91031d35-50e6-4b67-8dea-8c2ceda5278b",
					Name: "Slimworm",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "4",
					Cost: "1000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Toxiningestionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "124",
					},
				},
				{
					ID: "81396157-9981-42f2-bee9-540c6a175648",
					Name: "Stalwart Endosont",
					Category: "Symbionts",
					Ess: "0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "10000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "CF",
						Page: "124",
					},
				},
				{
					ID: "6289a426-e381-4ed6-a69d-3b94430efb2c",
					Name: "Bilateral Coordination Co-processor",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "6",
					Cost: "4500",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Ambidextrous: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "5b2c4c5d-a037-4970-8fcb-b6d47b9e819a",
					Name: "Bone Spike (No Bone Density)",
					Category: "Bio-Weapons",
					Ess: "0.2",
					Capacity: "0",
					Avail: "14F",
					Cost: "20000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Bone Spike I",
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "53d0d6b1-f5cd-4816-b772-7f50af81356a",
					Name: "Bone Spike (Bone Density 2-3)",
					Category: "Bio-Weapons",
					Ess: "0.2",
					Capacity: "0",
					Avail: "14F",
					Cost: "20000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Bone Spike II",
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "f994b8ac-0314-43ad-969a-f07d2d3fc0d8",
					Name: "Bone Spike (Bone Density 4)",
					Category: "Bio-Weapons",
					Ess: "0.2",
					Capacity: "0",
					Avail: "14F",
					Cost: "20000",
					RequireParent: "",
					Limit: stringPtr("False"),
					AddWeapon: []string{
						"Bone Spike III",
					},
					Required: &common.Required{},
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "0f5b811f-a761-410a-b675-fca5c5821b31",
					Name: "Spur Pocket",
					Category: "Cultured",
					Ess: "0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "8000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "9343f6b7-6d02-4706-aa7d-6c357b22c947",
					Name: "Adrenaline Pump (2050)",
					Category: "Basic",
					Ess: "Rating * 0.75",
					Capacity: "0",
					Avail: "10F",
					Cost: "Rating * 50000",
					RequireParent: "",
					Rating: stringPtr("3"),
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "b843eb04-8234-4fb4-a33d-87bd369cc8dc",
					Name: "Enhanced Articulation (2050)",
					Category: "Basic",
					Ess: "0.3",
					Capacity: "0",
					Avail: "5",
					Cost: "40000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "29711788-69f5-4b7a-8dd9-2ed615a448e3",
					Name: "Suprathyroid Gland (2050)",
					Category: "Basic",
					Ess: "0.7",
					Capacity: "0",
					Avail: "8F",
					Cost: "50000",
					RequireParent: "",
					Bonus: &common.BaseBonus{
						Lifestylecost: []common.Lifestylecost{
							// 1 items omitted
						},
						Specificattribute: []common.Specificattribute{
							// 4 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "bebdde65-cd72-4690-8436-945312c507ab",
					Name: "Tracheal Filter (2050)",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "Rating * 30000",
					RequireParent: "",
					Rating: stringPtr("6"),
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "9c66557a-5757-42ee-ac00-a875b7013ad8",
					Name: "Tailored Pheromones (2050)",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "12",
					Cost: "Rating * 22000",
					RequireParent: "",
					Rating: stringPtr("3"),
					Bonus: &common.BaseBonus{
						Sociallimit: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "aa992c89-3fc0-47bf-9275-f31acf83a615",
					Name: "Mnemonic Enhancer (2050)",
					Category: "Cultured",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "6",
					Cost: "Rating * 15000",
					RequireParent: "",
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 5 items omitted
						},
						Memory: []string{
							// 1 items omitted
						},
						Mentallimit: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "0603401c-183d-43e6-902e-fbdcc5a20fc4",
					Name: "Muscle Toner (2050)",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "(Rating * 5)R",
					Cost: "Rating * 25000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "d563a110-b8d8-460c-8fb2-da7d87d033a0",
					Name: "Muscle Augmentation (2050)",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "(Rating * 5)R",
					Cost: "Rating * 20000",
					RequireParent: "",
					Rating: stringPtr("4"),
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "fd8d10ee-4a08-4e0d-a9a4-eec8f4633467",
					Name: "Nephritic Screen (2050)",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "4",
					Cost: "Rating * 24000",
					RequireParent: "",
					Rating: stringPtr("6"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Pathogeningestionresist: []string{
							// 1 items omitted
						},
						Pathogeninhalationresist: []string{
							// 1 items omitted
						},
						Pathogeninjectionresist: []string{
							// 1 items omitted
						},
						Physiologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Physiologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
						Psychologicaladdictionalreadyaddicted: []string{
							// 1 items omitted
						},
						Psychologicaladdictionfirsttime: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
						Toxiningestionresist: []string{
							// 1 items omitted
						},
						Toxininhalationresist: []string{
							// 1 items omitted
						},
						Toxininjectionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "d52e5797-416f-414a-ba7f-8ba3c6aef35a",
					Name: "Orthoskin (2050)",
					Category: "Basic",
					Ess: "Rating * 0.25",
					Capacity: "0",
					Avail: "8R",
					Cost: "Rating * 30000",
					RequireParent: "",
					Rating: stringPtr("3"),
					Bonus: &common.BaseBonus{
						Armor: &common.Armor{},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "0dcfb784-e30b-4d29-b8a9-46786770c5d0",
					Name: "Pathogenic Defense (2050)",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "8",
					Cost: "Rating * 10000",
					RequireParent: "",
					Rating: stringPtr("6"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Pathogeningestionresist: []string{
							// 1 items omitted
						},
						Pathogeninhalationresist: []string{
							// 1 items omitted
						},
						Pathogeninjectionresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "20658b19-28c0-4e38-8523-768636510c7b",
					Name: "Reflex Recorder (2050)",
					Category: "Cultured",
					Ess: "0.1",
					Capacity: "0",
					Avail: "5",
					Cost: "10000",
					RequireParent: "",
					Limit: stringPtr("False"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Selectskill: &common.Selectskill{},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "9300c974-1591-4dca-95d4-53755c27126e",
					Name: "Damage Compensators (2050)",
					Category: "Cultured",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "10F",
					Cost: "Rating * 50000",
					RequireParent: "",
					Rating: stringPtr("12"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Conditionmonitor: &common.Conditionmonitor{},
					},
					Forbidden: &common.Forbidden{},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "206",
					},
				},
				{
					ID: "93325d96-77fd-4914-ad9d-e3fb4f5ba4db",
					Name: "Pain Editor (2050)",
					Category: "Cultured",
					Ess: "0.3",
					Capacity: "0",
					Avail: "6F",
					Cost: "60000",
					RequireParent: "",
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "596c2f2c-e76e-49db-996b-d05fb56d994d",
					Name: "Symbiotes (2050)",
					Category: "Basic",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "5",
					Cost: "Rating * 20000",
					RequireParent: "",
					Rating: stringPtr("3"),
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "418fc791-2ae8-4457-80ec-e89244f1497b",
					Name: "Synaptic Accelerator (2050)",
					Category: "Cultured",
					Ess: "Rating * 0.5",
					Capacity: "0",
					Avail: "6R",
					Cost: "Rating * 100000",
					RequireParent: "",
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Initiativepass: &common.Initiativepass{},
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "7ec6348a-2edd-4629-a984-e88f258e8599",
					Name: "Synthacardium (2050)",
					Category: "Basic",
					Ess: "Rating * 0.1",
					Capacity: "0",
					Avail: "4",
					Cost: "Rating * 10000",
					RequireParent: "",
					Rating: stringPtr("3"),
					Bonus: &common.BaseBonus{
						Skillgroup: []common.Skillgroup{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "8cf8dfaa-64b1-4b46-90a1-7fe01a43ad74",
					Name: "Platelet Factories (2050)",
					Category: "Basic",
					Ess: "0.2",
					Capacity: "0",
					Avail: "5",
					Cost: "30000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "773956b3-427b-4ed0-9510-8db622f01b66",
					Name: "Cerebral Booster (2050)",
					Category: "Cultured",
					Ess: "Rating * 0.2",
					Capacity: "0",
					Avail: "6",
					Cost: "Rating * 55000",
					RequireParent: "",
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 2 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Specificattribute: []common.Specificattribute{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "205",
					},
				},
				{
					ID: "b5af679d-e70d-43f3-9aa4-f3638796e948",
					Name: "MCT BioLink",
					Category: "Basic",
					Ess: "0.5",
					Capacity: "0",
					Avail: "10",
					Cost: "15000",
					RequireParent: "",
					SourceReference: common.SourceReference{
						Source: "KC",
						Page: "67",
					},
				},
				{
					ID: "ac03e91f-4a00-4df7-8ab8-cd840ac5c67f",
					Name: "Vocal Expansion",
					Category: "Basic",
					Ess: "0.1",
					Capacity: "0",
					Avail: "Rating*6",
					Cost: "Rating*8000",
					RequireParent: "",
					Limit: stringPtr("1"),
					Rating: stringPtr("3"),
					BannedGrades: &BiowareBannedGrades{
						Grade: []string{
							// 5 items omitted
						},
					},
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "NF",
						Page: "175",
					},
				},
				{
					ID: "81b90755-de0b-42d5-a7c9-6c7c72a1db05",
					Name: "Adrenaline Filter",
					Category: "Basic",
					Ess: "(Rating)*0.5",
					Capacity: "0",
					Avail: "(Rating*3)R",
					Cost: "Rating*35000",
					RequireParent: "",
					Limit: stringPtr("1"),
					Rating: stringPtr("3"),
					SourceReference: common.SourceReference{
						Source: "DTR",
						Page: "163",
					},
				},
			},
		},
	},
}

// GetBiowareData returns the loaded bioware data.
func GetBiowareData() *BiowareChummer {
	return biowareData
}

// GetAllBioware returns all bioware items.
func GetAllBioware() []BiowareItem {
	if len(biowareData.Biowares) == 0 {
		return []BiowareItem{}
	}
	return biowareData.Biowares[0].Bioware
}

// GetBiowareByID returns the bioware item with the given ID, or nil if not found.
func GetBiowareByID(id string) *BiowareItem {
	items := GetAllBioware()
	for i := range items {
		if items[i].ID == id {
			return &items[i]
		}
	}
	return nil
}
