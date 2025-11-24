package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Code generated from drugcomponents.xml. DO NOT EDIT.

var drugComponentsData = &DrugComponentsChummer{
	Grades: &DrugGrades{
		Grade: []DrugGrade{
			{
				ID: "b00a075a-2c2c-4816-bb4a-0d0a33d06370",
				Name: stringPtr("Standard"),
				Cost: stringPtr("1"),
				SourceReference: common.SourceReference{
					Source: "CF",
					Page: "",
				},
			},
			{
				ID: "b8b70858-6433-451a-835b-49b67d7b63e2",
				Name: stringPtr("Street Cooked"),
				Cost: stringPtr("0.5"),
				SourceReference: common.SourceReference{
					Source: "CF",
					Page: "",
				},
			},
			{
				ID: "b3366009-4884-44d7-9efa-34e213a75e7e",
				Name: stringPtr("Pharmaceutical"),
				Cost: stringPtr("2"),
				AddictionThreshold: intPtr(-1),
				SourceReference: common.SourceReference{
					Source: "CF",
					Page: "",
				},
			},
			{
				ID: "cd20695d-fedb-476b-956b-1a1ecdd65f03",
				Name: stringPtr("Designer"),
				Cost: stringPtr("6"),
				SourceReference: common.SourceReference{
					Source: "CF",
					Page: "",
				},
			},
		},
	},
	DrugComponents: DrugComponents{
		DrugComponent: []DrugComponent{
			{
				ID: "33ae6b1c-62f6-4824-967d-0e2b37c7d1b9",
				Name: "Tank",
				Category: "Foundation",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("BOD"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("CHA"),
									Value: intPtr(-2),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(1),
								},
							},
							Quality: stringPtr("High Pain Tolerance"),
						},
					},
				},
				Availability: "+4R",
				Cost: 75,
				Rating: intPtr(6),
				Threshold: intPtr(2),
				Source: "CF",
				Page: 190,
			},
			{
				ID: "ca5e7e5e-6aab-472a-a273-6d21d4e9ad2e",
				Name: "Defender",
				Category: "Foundation",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("AGI"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("REA"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
							},
						},
					},
				},
				Availability: "+4R",
				Cost: 75,
				Rating: intPtr(6),
				Threshold: intPtr(2),
				Source: "CF",
				Page: 190,
			},
			{
				ID: "cf8a2d2b-03b9-4440-873b-829c7d82489e",
				Name: "Genius",
				Category: "Foundation",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("LOG"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("REA"),
									Value: intPtr(-1),
								},
							},
						},
					},
				},
				Availability: "+4R",
				Cost: 75,
				Rating: intPtr(6),
				Threshold: intPtr(2),
				Source: "CF",
				Page: 190,
			},
			{
				ID: "8ec241f7-31c0-4655-80dd-3d4ce2a0b56d",
				Name: "Charmer",
				Category: "Foundation",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("CHA"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("AGI"),
									Value: intPtr(-1),
								},
							},
							Limit: []DrugEffectLimit{
								{
									Name: stringPtr("Social"),
									Value: intPtr(1),
								},
							},
						},
					},
				},
				Availability: "+4R",
				Cost: 75,
				Rating: intPtr(6),
				Threshold: intPtr(2),
				Source: "CF",
				Page: 190,
			},
			{
				ID: "e93015ca-12ff-48c4-b45e-f1387f2ea1ef",
				Name: "Warrior",
				Category: "Foundation",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("STR"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("AGI"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("BOD"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(-1),
								},
							},
						},
					},
				},
				Availability: "+4R",
				Cost: 75,
				Rating: intPtr(6),
				Threshold: intPtr(2),
				Source: "CF",
				Page: 190,
			},
			{
				ID: "9f4c87ba-4a0d-48e8-8c90-08b689da7203",
				Name: "Crush",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("STR"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("STR"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("STR"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
							Quality: stringPtr("Low Pain Tolerance"),
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 190,
			},
			{
				ID: "7eebc516-8298-4a7f-afef-10dceebb5e58",
				Name: "Brute",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("BOD"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("BOD"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("BOD"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 190,
			},
			{
				ID: "e6001189-e413-43bc-86ee-2136ca5d10bf",
				Name: "Strike",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("AGI"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("AGI"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("AGI"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
							Quality: stringPtr("Unsteady Hands"),
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 190,
			},
			{
				ID: "04f24ebd-e1cc-4b57-abe7-c8aa3fa91539",
				Name: "Lighting",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("REA"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("REA"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("REA"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 190,
			},
			{
				ID: "7b479fef-bcb4-4f9e-80c9-b1c17c79466b",
				Name: "Einstein",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("LOG"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("LOG"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("LOG"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(-1),
								},
							},
							Info: stringPtr("Crash Effect: -1d6 initiative dice"),
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 190,
			},
			{
				ID: "ef191753-a06e-4762-9674-47e3fe90ed1e",
				Name: "Gut Check",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("INT"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("INT"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("REA"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("INT"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("REA"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 190,
			},
			{
				ID: "47387cd3-836c-4283-a1ce-c62487dd669b",
				Name: "Stonewall",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("WIL"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("BOD"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("WIL"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("BOD"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("AGI"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("WIL"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("BOD"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("AGI"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 191,
			},
			{
				ID: "41018f6e-beb4-4a6c-8d59-501db802ce1a",
				Name: "Smoothtalk",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("CHA"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("CHA"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
						{
							Level: intPtr(2),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("CHA"),
									Value: intPtr(3),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
							Quality: stringPtr("Uncouth"),
						},
					},
				},
				Availability: "+1",
				Cost: 20,
				Source: "CF",
				Page: 191,
			},
			{
				ID: "ebbb6a0e-f3b1-47f3-85c1-e408b4a6ceb2",
				Name: "Shock and Awe",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							CrashDamage: intPtr(4),
							InitiativeDice: intPtr(1),
						},
						{
							Level: intPtr(1),
							CrashDamage: intPtr(4),
							InitiativeDice: intPtr(2),
							Limit: []DrugEffectLimit{
								{
									Name: stringPtr("Physical"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("Mental"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("Social"),
									Value: intPtr(-1),
								},
							},
						},
						{
							Level: intPtr(2),
							CrashDamage: intPtr(8),
							InitiativeDice: intPtr(3),
							Limit: []DrugEffectLimit{
								{
									Name: stringPtr("Physical"),
									Value: intPtr(-2),
								},
								{
									Name: stringPtr("Mental"),
									Value: intPtr(-2),
								},
								{
									Name: stringPtr("Social"),
									Value: intPtr(-2),
								},
							},
						},
					},
				},
				Availability: "+2",
				Cost: 40,
				Source: "CF",
				Page: 191,
			},
			{
				ID: "5ff4db39-aa0e-42f5-ae24-2bf79560670b",
				Name: "Razor Mind",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("INT"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("CHA"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(1),
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("INT"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("CHA"),
									Value: intPtr(-2),
								},
							},
							CrashDamage: intPtr(2),
						},
					},
				},
				Availability: "+2",
				Cost: 30,
				Source: "CF",
				Page: 191,
			},
			{
				ID: "c1a7dd91-61c9-49e1-8dfd-892882bd1816",
				Name: "The General",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("CHA"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("CHA"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("AGI"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
					},
				},
				Availability: "+2",
				Cost: 30,
				Source: "CF",
				Page: 191,
			},
			{
				ID: "c98d587d-5651-4a53-a9ab-cc2262236658",
				Name: "Resist",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("BOD"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(1),
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("BOD"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("WIL"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("LOG"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("REA"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
					},
				},
				Availability: "+2",
				Cost: 30,
				Source: "CF",
				Page: 191,
			},
			{
				ID: "1ed8c102-3b31-42ae-bf0f-4d9fe22fc4fb",
				Name: "Speed Demon",
				Category: "Block",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Level: intPtr(0),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("AGI"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("REA"),
									Value: intPtr(1),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(1),
						},
						{
							Level: intPtr(1),
							Attribute: []DrugEffectAttribute{
								{
									Name: stringPtr("AGI"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("REA"),
									Value: intPtr(2),
								},
								{
									Name: stringPtr("STR"),
									Value: intPtr(-1),
								},
								{
									Name: stringPtr("INT"),
									Value: intPtr(-1),
								},
							},
							CrashDamage: intPtr(2),
						},
					},
				},
				Availability: "+2",
				Cost: 30,
				Source: "CF",
				Page: 191,
			},
			{
				ID: "a4d7e764-5aa7-4394-92f1-43ff58c1a801",
				Name: "Ingestion Enhancer",
				Category: "Enhancer",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Info: stringPtr("Ingestion"),
						},
					},
				},
				Availability: "+1",
				Cost: 50,
				Rating: intPtr(1),
				Threshold: intPtr(1),
				Source: "CF",
				Page: 191,
			},
			{
				ID: "0737b976-ec7d-45cf-a84f-1c0524dac6f9",
				Name: "Inhalation Enhancer",
				Category: "Enhancer",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Info: stringPtr("Inhalation"),
						},
					},
				},
				Availability: "+1",
				Cost: 50,
				Rating: intPtr(1),
				Threshold: intPtr(1),
				Source: "CF",
				Page: 191,
			},
			{
				ID: "fdca4090-a933-4393-a3bd-7633aad967a2",
				Name: "Speed Enhancer",
				Category: "Enhancer",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Speed: intPtr(-3),
						},
					},
				},
				Availability: "+1",
				Cost: 50,
				Rating: intPtr(1),
				Threshold: intPtr(1),
				Source: "CF",
				Page: 191,
			},
			{
				ID: "d67dbda7-b03f-4914-9f1d-a6a238f6944e",
				Name: "Duration Enhancer",
				Category: "Enhancer",
				Effects: DrugEffects{
					Effect: []DrugEffect{
						{
							Duration: intPtr(1),
						},
					},
				},
				Availability: "+1",
				Cost: 50,
				Rating: intPtr(1),
				Threshold: intPtr(1),
				Source: "CF",
				Page: 191,
			},
		},
	},
}

// GetDrugComponentsData returns the loaded drug components data.
func GetDrugComponentsData() *DrugComponentsChummer {
	return drugComponentsData
}

// GetAllDrugComponents returns all drug components.
func GetAllDrugComponents() []DrugComponent {
	return drugComponentsData.DrugComponents.DrugComponent
}

// GetDrugComponentByID returns the drug component with the given ID, or nil if not found.
func GetDrugComponentByID(id string) *DrugComponent {
	components := GetAllDrugComponents()
	for i := range components {
		if components[i].ID == id {
			return &components[i]
		}
	}
	return nil
}
