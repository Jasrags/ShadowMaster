package v5

// Code generated from lifemodules.xml. DO NOT EDIT.

var lifemodulesData = &LifeModulesChummer{
	Stages: LifeModuleStages{
		Stage: []LifeModuleStage{
			{
				Content: "Nationality",
				Order: 1,
			},
			{
				Content: "Formative Years",
				Order: 2,
			},
			{
				Content: "Teen Years",
				Order: 3,
			},
			{
				Content: "Further Education",
				Order: 4,
			},
			{
				Content: "Real Life",
				Order: 5,
			},
		},
	},
	Modules: LifeModules{
		Module: []LifeModule{
			{
				ID: "f35ba316-dd0f-48ab-9f06-d7329305a44e",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "United Canadian American States",
				Karma: 15,
				Source: "RF",
				Page: "66",
				Story: stringPtr("Allan, please add story UCAS"),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "f9e684bb-d7fa-4fc7-87e0-d140cc6fc64d",
							Name: "General UCAS",
							Story: stringPtr("$real was born somewhere in the UCAS, in a city like $UCASORIGIN , or one of the many other places that no-one cares about."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[City]"),
										Val: intPtr(2),
									},
									{
										ID: stringPtr("a9df9852-6f4d-423d-8251-c92a709c1476"),
										Group: stringPtr("Language"),
										Val: intPtr(2),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
											Spanish: stringPtr("Spanish"),
											German: stringPtr("German"),
											Italian: stringPtr("Italian"),
											Flee: stringPtr("French"),
											Orange: stringPtr("Mandarin"),
											Polish: stringPtr("Polish"),
											Yiddish: stringPtr("Yiddish"),
										},
									},
								},
								PushText: stringPtr("United Canadian American States"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "5cf12de1-b41b-4a0f-9a2a-03bf08faa3d0",
							Name: "Canada",
							Story: stringPtr("$real was born in the tiny sliver of the northern UCAS that was once Canada."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Navigation",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Etiquette",
									},
								},
								PushText: stringPtr("United Canadian American States"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "7fdfff94-5c90-4af5-808a-f96e5d0643bb",
							Name: "Denver (UCAS Sector)",
							Story: stringPtr("$real was born in the UCAS exclave making up one sixth of Denver, Colorado."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "INT",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Negotiation",
									},
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Name: stringPtr("Denver"),
										Val: intPtr(2),
									},
								},
								PushText: stringPtr("United Canadian American States"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "b332fa10-e0f5-43aa-bb38-52cdb0060da1",
							Name: "Seattle",
							Story: stringPtr("$real was born in the UCAS exclave of Seattle, the UCAS's only pacific port."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "REA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Perception",
									},
									{
										Name: "Intimidation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Seattle"),
										Val: intPtr(2),
									},
								},
								PushText: stringPtr("United Canadian American States"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "4fe5e4fd-0275-48bd-9fec-678b86c5f024",
							Name: "SINless",
							Story: stringPtr("While born in the UCAS, $real is a citizen of nowhere, for one of several reasons."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "AGI",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[City]"),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("History"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("UCAS"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("English"),
							Val: intPtr(0),
						},
						{
							ID: stringPtr("a9df9852-6f4d-423d-8251-c92a709c1476"),
							Group: stringPtr("Language"),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
								Spanish: stringPtr("Spanish"),
								German: stringPtr("German"),
								Italian: stringPtr("Italian"),
								Flee: stringPtr("French"),
								Orange: stringPtr("Mandarin"),
								Polish: stringPtr("Polish"),
								Yiddish: stringPtr("Yiddish"),
							},
						},
					},
				},
			},
			{
				ID: "85f1c4ab-5f3c-411c-8c01-8ee54e2d4f89",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "Confederation of American States",
				Karma: 15,
				Source: "RF",
				Page: "66",
				Story: stringPtr("$real was born in the Confederation of American States, a nation formed after the south finally got around to rising again."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "d0f2538f-5fc2-4f98-acc4-fbf497861866",
							Name: "General CAS",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "CHA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
										Val: intPtr(2),
									},
								},
								PushText: stringPtr("Confederation of American States"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "665a11ae-8f7e-44db-8c08-2bae2fb03ba7",
							Name: "Denver",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "INT",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Denver"),
										Val: intPtr(2),
									},
								},
								PushText: stringPtr("Confederation of American States"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "b70de7f3-844f-40ec-92c6-5b3b4bacbe4b",
							Name: "SINless",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[city]"),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("History"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("CAS"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("English"),
							Val: intPtr(0),
						},
						{
							Group: stringPtr("Language"),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
								Spanish: stringPtr("Spanish"),
								German: stringPtr("German"),
								Italian: stringPtr("Italian"),
								Polish: stringPtr("Polish"),
								Yiddish: stringPtr("Yiddish"),
							},
						},
					},
				},
			},
			{
				ID: "83c132b5-fcf5-4a43-b9de-6c8ab206a586",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "Tír Tairngire",
				Karma: 15,
				Source: "RF",
				Page: "67",
				Story: stringPtr("$real was born in Tir Tairngire, $TIRDESC ."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "604831d9-0fdc-4579-aa7e-bc5d99bcee5d",
							Name: "Elves/Humans",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "CHA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "db539cd7-d694-4f9c-9e4c-e24a3bcd0128",
							Name: "Orks/Trolls/Dwarfs",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Con",
										Val: intPtr(2),
									},
									{
										Name: "Disguise",
									},
									{
										Name: "Intimidation",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Perception",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Counterculture"),
										Val: intPtr(2),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Language"),
							Name: stringPtr("Sperethiel"),
							Val: intPtr(0),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("English"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("History"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Tír Tairngire"),
						},
					},
					PushText: stringPtr("Tír Tairngire"),
					FreeNegativeQualities: intPtr(-5),
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "1",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "67023613-54af-4950-9a6e-a33bee9ecf59",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "Native American Nations",
				Karma: 15,
				Source: "RF",
				Page: "67",
				Story: stringPtr("$real was born in the northern part of America, in the Native American Nations"),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "1c0a266e-0ca2-4aee-bcd0-fc2960c9834e",
							Name: "Algonkian-Manitou Council",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Perception",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Unarmed Combat",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Val: intPtr(0),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Language"),
										Val: intPtr(1),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[Tribe]"),
									},
								},
								PushText: stringPtr("Algonkian-Manitou Council"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "97b5d738-0166-482b-be3b-bca2b247f275",
							Name: "Athabaskan Council",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Survival",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Val: intPtr(0),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Language"),
										Val: intPtr(1),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
								PushText: stringPtr("Athabaskan Council"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "89e16098-3034-4f25-8c2f-e8bb7e94d832",
							Name: "Pueblo Corporate Council",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Val: intPtr(0),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Language"),
										Val: intPtr(1),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Business Practices"),
									},
								},
								PushText: stringPtr("Pueblo Corporate Council"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "042ede14-e0fb-4fb9-95d6-8ddad27d96a3",
							Name: "Salish-Shidhe Council",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Survival",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Val: intPtr(0),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Language"),
										Val: intPtr(1),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
								PushText: stringPtr("Salish-Shidhe Council"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "969d1f17-c944-44a7-8997-e62e250e7946",
							Name: "Sioux Nation",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Blades",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Val: intPtr(0),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Language"),
										Val: intPtr(1),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Sioux Culture"),
									},
								},
								PushText: stringPtr("Sioux Nation"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "24e4b3e9-49fc-4c71-b088-3f958e3c1ac6",
							Name: "Trans-Polar Aleut Nation",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Perception",
									},
									{
										Name: "Survival",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("Eskimo-Aleut"),
										Val: intPtr(0),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("English"),
										Val: intPtr(0),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Polar Critters"),
										Val: intPtr(2),
									},
								},
								PushText: stringPtr("Trans-Polar Aleut Nation"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "9bffa38c-0332-4348-9a92-9734074cb292",
							Name: "Tsimshian Nation",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "STR",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Blades",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Val: intPtr(0),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
									{
										Group: stringPtr("Language"),
										Val: intPtr(1),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
								FreeNegativeQualities: intPtr(-5),
							},
						},
						{
							ID: "9c59f21b-1130-4277-b896-0d45bafcd9c6",
							Name: "Denver",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "INT",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Language]"),
										Val: intPtr(0),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[OtherLanguage]"),
									},
								},
								PushText: stringPtr("Denver"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "7ede647e-920c-43bf-8f2e-ac26cdb611d4",
							Name: "Las Vegas",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Perception",
									},
									{
										Name: "Con",
										Val: intPtr(2),
									},
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Gambling Games"),
										Val: intPtr(2),
									},
								},
								PushText: stringPtr("Las Vegas"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "1b4f84a0-0b2a-4a49-ab5f-b92d4d75e44a",
							Name: "Salt Lake City",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
									{
										Name: "Computer",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
									{
										Name: "Perception",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Language]"),
										Val: intPtr(0),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[OtherLanguage]"),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Mormons"),
										Val: intPtr(2),
									},
								},
								PushText: stringPtr("Salt Lake City"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Archery",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("History"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("UCAS"),
						},
					},
				},
			},
			{
				ID: "924ccfd0-136c-4385-94fe-a8d7be2eb7ed",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Arcology Living",
				Karma: 40,
				Source: "RF",
				Page: "67",
				Story: stringPtr("$real was  $LUCK  enough to grow up in an Arcology: a corporate fortress city that $ARCOLOGY."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Corporation]"),
							Val: intPtr(3),
						},
					},
					FreeNegativeQualities: intPtr(-15),
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "14c2accf-2875-4239-a5be-47dce27312eb",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Corp Drone",
				Karma: 40,
				Source: "RF",
				Page: "68",
				Story: stringPtr("$real was  $LUCK  enough to be the child of wageslaves, who via endless hours of toil managed to keep a roof over $real 's head."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Corporation]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "111f66cd-be47-4e1e-8ee7-15cc67ed2cc8",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Farm Living",
				Karma: 40,
				Source: "RF",
				Page: "68",
				Story: stringPtr("$real spent their formative years on a farm, not moving around hay like the farmhands of yesteryear, but instead $FARMDESC."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(1),
						},
						{
							Name: "STR",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Industrial Mechanic",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Farming"),
							Val: intPtr(5),
						},
					},
				},
			},
			{
				ID: "f98daafb-cf5f-4d83-976b-8cb9a49f1c4f",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Fugitive",
				Karma: 40,
				Source: "RF",
				Page: "68",
				Story: stringPtr("$real spent their formative years with their parents as they ran away from $FLEE."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "REA",
						},
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Perception",
						},
						{
							Name: "Sneaking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Name: stringPtr("[city]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-24),
				},
			},
			{
				ID: "f2435c28-5bf9-4c72-8f6d-f5d02439833b",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Isolated Rural Upbringing",
				Karma: 40,
				Source: "RF",
				Page: "68",
				Story: stringPtr("$real grew up in an isolated portion of the wilderness like the rednecks of old."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Farming"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-22),
				},
			},
			{
				ID: "7acbd745-50d4-4fb1-839c-65a6f07e1e50",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Military Brat",
				Karma: 40,
				Source: "RF",
				Page: "69",
				Story: stringPtr("$real grew up almost everywhere, shifted from place to place by their $PARRENT 's military duties."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "STR",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Negotiation",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Military"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Military History"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-14),
				},
			},
			{
				ID: "06b4cc0f-3008-4209-ac32-04614a3dc354",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Orphan",
				Karma: 40,
				Source: "RF",
				Page: "69",
				Story: stringPtr("$real was an orphan, growing up either in a $ORPHAN or on the streets."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[city]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Foster System"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "4f078a7f-bfa5-4eba-97f9-a97f06eab6e8",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Rich Kid",
				Karma: 40,
				Source: "RF",
				Page: "69",
				Story: stringPtr("$real was literally born with a gold spoon in their mouth, and looked down on those with silver spoons, as those could tarnish."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Artisan",
						},
						{
							Name: "Leadership",
							Val: intPtr(2),
						},
						{
							Name: "Computer",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
					},
					PushText: stringPtr("Poor"),
					FreeNegativeQualities: intPtr(-7),
				},
			},
			{
				ID: "fe3d36d3-6e0a-4d65-8516-3350f1b5b812",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Street Urchin",
				Karma: 40,
				Source: "RF",
				Page: "69",
				Story: stringPtr("$real was a child of the streets, best described with words like plucky or $INSULTA."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Perception",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(3),
						},
					},
					FreeNegativeQualities: intPtr(-22),
				},
			},
			{
				ID: "1521128b-0b5e-41ce-a2dd-61512f2dff2c",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "White Collar",
				Karma: 40,
				Source: "RF",
				Page: "69",
				Story: stringPtr("$real had fairly well off parents who paid for a better than average education."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
							Val: intPtr(0),
						},
						{
							Name: "Negotiation",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "f0393b9e-2698-4955-bd31-112b619ac7b8",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Corporate Education",
				Karma: 50,
				Source: "RF",
				Page: "70",
				Story: stringPtr("$real was educated by a megacorp so that he might make a better wageslave when he graduated."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Chemistry",
						},
						{
							Name: "Gymnastics",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Any]"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Any]"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Corporation]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Job]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "07797a05-d7a7-4f49-b69f-3f79aec242f3",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Farm Living",
				Karma: 50,
				Source: "RF",
				Page: "70",
				Story: stringPtr("$real spent their teenage years on a farm, $FARMTASK ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Industrial Mechanic",
							Val: intPtr(2),
						},
						{
							Name: "Longarms",
						},
						{
							Name: "Pilot Ground Craft",
							Val: intPtr(2),
						},
						{
							Name: "Pistols",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Farming"),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
						},
					},
				},
			},
			{
				ID: "8d4a26a0-8280-42d8-b61d-052591f84edd",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Gang Warfare",
				Karma: 50,
				Source: "RF",
				Page: "70",
				Story: stringPtr("$real spent their teenage years shooting at other teenagers just to gain control over a few city blocks. Just to be clear, $real was in a gang, not the Battle of Stalingrad."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
							Val: intPtr(2),
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-25),
				},
			},
			{
				ID: "abf41e28-123f-bb00-da29-124ce213dca2",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "High School",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real went to high school like a normal person."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Chemistry",
							Val: intPtr(2),
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Language]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "68fdb83d-5447-4414-b2ff-2377873521b5",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Home Tutored",
				Karma: 50,
				Source: "RF",
				Page: "70",
				Story: stringPtr("$real was taught at home, by $HOMEDESC . While they managed to avoid the main pitfall of homeschooling and somehow ended up with a better education than their peers, $real was left emotionally stunted due to the lack of contact with others."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
							Val: intPtr(1),
						},
						{
							Name: "WIL",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Chemistry",
						},
						{
							Name: "Computer",
							Val: intPtr(3),
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Language]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-8),
				},
			},
			{
				ID: "0f415a05-5a6f-4279-9fb4-c43e0435bab5",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Isolated Rural Upbringing",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real spent their teenage years in the middle of nowhere, leaving them with very little knowledge of the outside world, but a lot of knowledge about $OUTDOOR ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(1),
						},
						{
							Name: "WIL",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Longarms",
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Critters"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-5),
				},
			},
			{
				ID: "ccf41ccc-f752-469b-ad92-5bdc38e6714f",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Magical Education (Magician)",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real was identified as awakened at an early age and was sent off to a wizarding school that, sadly, was much less awesome than Hogwarts."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Arcana",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Magical Theory (Academic)"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-15),
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "1d2a61a6-3fd0-4c07-9a9e-8db5da92590e",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Magical Education (Aspected)",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real was identified as awakened at an early age and was sent off to a wizarding school that, sadly, was much less awesome than Hogwarts."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Arcana",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Magical Theory (Academic)"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-15),
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "abbd6496-e90f-4159-a677-e4b35ccd05f9",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Magical Education (Mystic Adept)",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real was identified as awakened at an early age and was sent off to a wizarding school that, sadly, was much less awesome than Hogwarts."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Arcana",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Magical Theory (Academic)"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-15),
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "603bead6-2827-4468-a69b-4e8a7a93c2ee",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Magical Education (Adept)",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real was identified as awakened at an early age and was sent off to a wizarding school that, sadly, was much less awesome than Hogwarts."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Arcana",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Magical Theory (Academic)"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-15),
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "15bd4283-f287-4be7-b174-9e5ab97bda1a",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Military School",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real was educated at a military school designed to instill discipline and patriotism in those  $LUCK  to be sent there."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(1),
						},
						{
							Name: "CHA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Unarmed Combat",
						},
						{
							Name: "Running",
						},
						{
							Name: "Swimming",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Military"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Military History"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Strategy"),
							Val: intPtr(1),
						},
					},
					FreeNegativeQualities: intPtr(-15),
				},
			},
			{
				ID: "b3b641d1-70e2-46c9-99b3-b89b7b84e24c",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Preparatory School",
				Karma: 50,
				Source: "RF",
				Page: "71",
				Story: stringPtr("$real was $LUCK enough to go to a respected private school."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
							Val: intPtr(1),
						},
						{
							Name: "LOG",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Chemistry",
						},
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "21c3cb79-e0d9-49b8-9ad3-9232bab4f12b",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Street Kid",
				Karma: 50,
				Source: "RF",
				Page: "72",
				Story: stringPtr("$real graduated summa cum laude from the school of hard knocks, with a major in $STREETDESC and a minor in women's studies."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Clubs",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Running",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "5a2eee69-cedb-403e-9649-fdc9a1377374",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Skipped Further Education",
				Karma: 0,
				Source: "RF",
				Page: "0",
				Story: stringPtr("$real either never received the opportunity for a further education, or decided it wasn't for them. Either way, the wide range of life's choices spread before them!"),
			},
			{
				ID: "9e601908-df9a-4fe1-b58e-74bfd6f5d7b5",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Community College",
				Karma: 55,
				Source: "RF",
				Page: "72",
				Story: stringPtr("$real wanted to get something that resembled higher education, but couldn't afford to go to a real college. The solution: community college."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "cb7cf388-ca3b-4344-b6ba-7f813a8c347f",
							Name: "Architecture",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Buildings"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "5233f360-4ad7-4b03-aab6-fd6a81f5fbaf",
							Name: "Business",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Con",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Economics"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "3204c2db-d015-4da4-bcd4-cdedb127e5ca",
							Name: "Computer Science",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Cybercombat",
									},
									{
										Name: "Hacking",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Matrix Design"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "b86653c5-96fd-46d4-9b97-b1e57d4049be",
							Name: "Engineering",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
									{
										Name: "Hardware",
									},
									{
										Name: "Industrial Mechanic",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Engineering"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "f5bf36b6-3d72-4daf-9d97-3a17ac31e91e",
							Name: "Law",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
									{
										Name: "Performance",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Law"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "c3486abc-87e5-4bb4-be65-144bd6c8b692",
							Name: "Magic",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(5),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "6277e39c-10ff-4a7f-83ca-f9a8d84dc644",
							Name: "Mathematics",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Mathematics"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "558dfe69-711c-4ca3-b16c-3678c3ef3083",
							Name: "Medicine",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Medicine"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "9a0e5409-7a46-4afe-91ae-ac93b101ba37",
							Name: "Natural Sciences",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(5),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "7da1dbda-242f-4b42-8e91-fdb553033297",
							Name: "Art",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
										Val: intPtr(3),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Art History"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "d29437b7-c771-4fe6-a36a-994091ec8df1",
							Name: "History",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[National or World] History"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "117e5150-c50f-44dc-828c-9adfe06e589d",
							Name: "Languages",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Negotiation",
									},
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Name: stringPtr("[Any]"),
										Val: intPtr(6),
									},
									{
										Name: stringPtr("[Any]"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "bc75eec6-c413-4457-b581-59590b792aca",
							Name: "Literature",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Literature"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "953b9a51-745f-442a-b1e5-e5e9a24901c8",
							Name: "Metahumanities",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Ancient Language/Philosophy/Religion]"),
										Val: intPtr(13),
									},
								},
							},
						},
						{
							ID: "9615d244-4ff5-4de2-b810-f5afeb90f4f6",
							Name: "Social Science",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Sociology/Psychology/Archaeology/Criminology/Politics]"),
										Val: intPtr(13),
									},
								},
							},
						},
						{
							ID: "45b62128-12f9-4d3f-89b9-b5ee34af16db",
							Name: "Trade School Shop",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Practical Mechanics]"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Industrial Manufacturers]"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Machine Parts]"),
										Val: intPtr(2),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
				},
			},
			{
				ID: "1156fac7-e8d2-4599-94c3-64b8464037d7",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Ivy League University",
				Karma: 80,
				Source: "RF",
				Page: "73",
				Story: stringPtr("$real either had a scholarship or money to burn, because they managed to get into one of the most exclusive institutions in the country, gaining them a first class education, as well as something nice to put on their resume."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "7581d130-4069-41c6-b225-97849752aa7e",
							Name: "Architecture",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "First Aid",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Buildings"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "b45413d9-14e7-45ad-bddf-3c42fe2a87e2",
							Name: "Business",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Economics"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "45d86c5a-5bd9-43bc-8921-44d66c803856",
							Name: "Computer Science",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Matrix Design"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "42708de0-730d-4ef7-8ff0-7a16903c3329",
							Name: "Engineering",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Engineering"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "a08255ed-dba9-440f-8383-42b455c2164b",
							Name: "Law",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Negotiation",
									},
									{
										Name: "Performance",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Law"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "c3e76118-bda2-43f5-bfd4-f2e98e7daf25",
							Name: "Magic",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(5),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "0322a99c-1107-469f-898e-da3dbae07243",
							Name: "Mathematics",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Software",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Mathematics"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "ee24346b-47b1-485f-8e2a-98e064280594",
							Name: "Medicine",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Medicine"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "f1c5322e-3504-4e61-bcde-bbd9efdc5372",
							Name: "Natural Sciences",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Software",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(6),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "be73703f-6327-40f3-8233-a5081382b09a",
							Name: "Art",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Art History"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "3f2a336c-8d68-44bf-b8a3-2269a5b8f439",
							Name: "History",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Software",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("History"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "b2aa8b08-4f4a-4d9a-8846-4b9e18f3f86e",
							Name: "Languages",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(4),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "c3f42446-c9cc-4488-91aa-20508c69bbee",
							Name: "Literature",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Literature"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "621ffabc-0488-463c-89d9-768e79abea86",
							Name: "Metahumanities",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Ancient Language/Philosophy/Religion]"),
										Val: intPtr(10),
									},
								},
							},
						},
						{
							ID: "5b0d7428-6c89-4f9c-aa6c-18ceabb8df2c",
							Name: "Social Sciences",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Sociology/Psychology/Archaeology/Criminology/Politics]"),
										Val: intPtr(10),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
					},
				},
			},
			{
				ID: "87ad3d80-8d96-4c16-aa62-d63eb2575ff3",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Military Academy",
				Karma: 115,
				Source: "RF",
				Page: "73",
				Story: stringPtr("$real got into a military academy, where they trained to become a commissioned officer in the army of their country."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "259fd0f1-6c88-41f5-946a-37652f4c67b5",
							Name: "Architecture",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Buildings"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "589be566-a9b2-4edd-86f1-35317651071a",
							Name: "Business",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Con",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Economics"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "12a24df3-7966-4099-be59-2da09eb7da7a",
							Name: "Computer Science",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Cybercombat",
									},
									{
										Name: "Hacking",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Matrix Design"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "1096f721-d609-44a7-a844-b8a2d7b186af",
							Name: "Engineering",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
									{
										Name: "Hardware",
									},
									{
										Name: "Industrial Mechanic",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Engineering"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "9a36d74e-c831-4520-97fb-bd2a1ec9c0a2",
							Name: "Law",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
									{
										Name: "Performance",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Law"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "6889a574-9b76-4238-8c52-4482408d6dbe",
							Name: "Magic",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(5),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "a0e143b5-07e0-4296-90d2-a065d6ea6a01",
							Name: "Mathematics",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Mathematics"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "5e574e02-573f-40f2-b804-711afebe33b0",
							Name: "Medicine",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Medicine"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "17b012c8-8f06-4ffc-97da-4d374a2415ad",
							Name: "Natural Sciences",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(5),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "2c97c28c-2b56-41b7-a5c0-be340905ff76",
							Name: "Art",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
										Val: intPtr(3),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Art History"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "f0def2ac-238f-4769-89bd-d69651c31848",
							Name: "History",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[National] or [World] History"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "622282e0-857a-482e-b9e9-af4c3b2e88b0",
							Name: "Languages",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(6),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "1246e18b-4914-4da1-a364-6e3aa1519bb5",
							Name: "Literature",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Literature"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "51d66e5e-82da-4ef1-8c6c-bb97a98c1549",
							Name: "Metahumanities",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Ancient Language/Philosophy/Religion]"),
										Val: intPtr(13),
									},
								},
							},
						},
						{
							ID: "63ed5c38-b044-4863-95dd-416394c88ffb",
							Name: "Social Sciences",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Sociology/Psychology/Archaeology/Criminology/Politics]"),
										Val: intPtr(13),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Swimming",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Military History"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Military"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "142d7a1b-c676-4bf6-a71f-bc2d29617a14",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "State University",
				Karma: 65,
				Source: "RF",
				Page: "75",
				Story: stringPtr("$real was either not intelligent enough for the ivy league, or unable to afford it. Either way, they got into one of the many other colleges out there."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "08943cfe-8b1a-49d0-b79b-c3e13f8c0e65",
							Name: "Architecture",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Buildings"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "e5b8fad6-b50b-40a9-93ba-7e6377aae061",
							Name: "Business",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Con",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Economics"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "3d810ee7-601d-43b6-ac46-d60d3a138408",
							Name: "Computer Science",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Cybercombat",
									},
									{
										Name: "Hacking",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Matrix Design"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "92e48827-089d-439b-9f4d-dd30d4dcc1f6",
							Name: "Engineering",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
									{
										Name: "Hardware",
									},
									{
										Name: "Industrial Mechanic",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Engineering"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "1d6939e0-c6dc-4ab2-bec8-e07e1d21c0f1",
							Name: "Law",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
									{
										Name: "Performance",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Law"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "fd563e32-b32c-437e-9aaa-966ed6d493ab",
							Name: "Magic",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(5),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "dd5b8431-a443-483d-845f-86c5b9aea4a1",
							Name: "Mathematics",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Mathematics"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "1e3a77c0-09ea-4448-9cb0-8a759f59d0ab",
							Name: "Medicine",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Medicine"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "97bceeca-ceba-49ce-ba09-2f64293046db",
							Name: "Natural Sciences",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Val: intPtr(5),
										Options: &LifeModuleKnowledgeSkillLevelOptions{
										},
									},
								},
							},
						},
						{
							ID: "e0c2ce7a-2b88-4488-b356-c11a4ce39aec",
							Name: "Art",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
										Val: intPtr(3),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Art History"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "24458c88-de4e-4f1d-9e0a-926a466dce7c",
							Name: "History",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[National] History or [World] History"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "c4be9942-2731-4ced-8b00-a8d990c64b6e",
							Name: "Languages",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(6),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "329bba18-8822-458f-8c7f-1682ecbae666",
							Name: "Literature",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
									{
										Name: "Computer",
									},
									{
										Name: "Instruction",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Literature"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "8560107b-cd7f-43ce-a15b-7e914ec75a6e",
							Name: "Metahumanities",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Ancient Language/Philosophy/Religion]"),
										Val: intPtr(13),
									},
								},
							},
						},
						{
							ID: "a30a53d0-097b-4153-9858-41ac51657a54",
							Name: "Social Sciences",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Sociology/Psychology/Archaeology/Criminology/Politics]"),
										Val: intPtr(13),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(4),
						},
					},
				},
			},
			{
				ID: "3f82fc4f-9cbf-4baf-a8a2-51ab9c75a7f6",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Trade/Technical School",
				Karma: 40,
				Source: "RF",
				Page: "75",
				Story: stringPtr("Not even capable of making it into a community college, $real had to settle for a trade school, which taught practical things they could use in their future life."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "58c7cf14-6b38-485e-9243-3d8fb8194ec5",
							Name: "Architect",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "First Aid",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Buildings"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "3725ac65-3d76-4e05-afc6-d08b8d33a05e",
							Name: "Fashion Designer",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Fashion"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "864c49cf-b44d-4c12-b70a-22228c282f2c",
							Name: "Graphic Designer",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Artisan",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Corporate Logos"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "2c0e2e6d-464b-4fa6-8a96-d04a72cd4f0e",
							Name: "Journalist",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Con",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Politics"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "b1fe2222-98e4-4d29-825d-7b65bc9deccc",
							Name: "Lawyer",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
									{
										Name: "Performance",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Law"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "4ef7e4e3-bbf4-454b-b1f7-2309e96ef4f3",
							Name: "Mechanic",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "First Aid",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Mechanics"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "8e84f31f-f2b3-4251-8943-c595b1cb4851",
							Name: "Media Studies",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Trid Shows"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "b9d11af9-c703-4c89-9598-2d947c9bfaa4",
							Name: "Nurse",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Medicine"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "adc42cf4-bf48-4f19-9741-6f1b89d185fd",
							Name: "Tradesman",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Automotive Mechanic",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("DIY"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "53720714-f91b-43d9-97d8-317f4def9d29",
							Name: "Divinity School/Seminary",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
									{
										Name: "Performance",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Ancient Language]"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Religion]"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "83e7a3b7-0d32-4288-839d-3de22389da33",
							Name: "Divinity School Dropout",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Performance",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Religion]"),
										Val: intPtr(4),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Ancient Language]"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "e1ba9a64-a528-493f-b2d2-86b1eeeaca47",
							Name: "Counseling/Behavioral Therapy",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Psychology"),
										Val: intPtr(4),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Gymnastics",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
						},
						{
							Name: "Computer",
						},
						{
							Name: "Gymnastics",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
						},
					},
				},
			},
			{
				ID: "47bf63cf-9a2a-4008-b455-c8ab68add581",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Bounty Hunter",
				Karma: 100,
				Source: "RF",
				Page: "76",
				Story: stringPtr("$real became a bounty hunter, stalking people who skip out on their bail. On the plus side, they might have gotten to star in a shitty reality trideo."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Longarms",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Lone Star Procedures"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Crook Hangouts"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "efae10db-297b-4355-97f0-e64b4bb21a23",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Celebrity",
				Karma: 100,
				Source: "RF",
				Page: "76",
				Story: stringPtr("$real became famous because they $FAMOUSDESC ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "",
						},
						{
							Name: "",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Escape Artist",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Val: intPtr(3),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
							},
						},
					},
				},
			},
			{
				ID: "47f4572b-8199-47dd-a997-77e7c1bbc297",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Combat Correspondent",
				Karma: 100,
				Source: "RF",
				Page: "76",
				Story: stringPtr("$real decided that muckraking with the Corp's filth was too likely to get them silenced, so they decided to go for an easier job: covering foreign wars."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Navigation",
						},
						{
							Name: "Negotiation",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Journalism"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "adeea2d5-ef7a-4852-81da-627197a31dd2",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Corporate",
				Karma: 100,
				Source: "RF",
				Page: "77",
				Story: stringPtr("$real got a job at $RMEGA , becoming another gear in the corporate machine."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "edbb6b67-e541-4c42-bf69-266787846337",
							Name: "Company Man",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Demolitions",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Ground Craft",
										Val: intPtr(2),
									},
									{
										Name: "Sneaking",
										Val: intPtr(3),
									},
									{
										Name: "Unarmed Combat",
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "fb6e0db3-e1a9-4b91-b6a9-d231c3524efb",
							Name: "Hacker/Decker",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "First Aid",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Physics"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Matrix Security Design"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "f1d79b39-46c7-4f0c-b86e-cce8ab7f86ea",
							Name: "Security Guard",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Perception",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Security Procedures"),
										Val: intPtr(5),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Law Enforcement Procedures"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "a4ca3282-22c9-4fc7-9224-7cbaf6802261",
							Name: "Security Rigger",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Gunnery",
										Val: intPtr(3),
									},
									{
										Name: "Perception",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Aircraft",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Walker",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Ground Craft",
										Val: intPtr(3),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Drones"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "f9bc766b-c902-4fab-a33a-6bedbaa4ab5e",
							Name: "Wage Mage",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
										Val: intPtr(2),
									},
									{
										Name: "Assensing",
										Val: intPtr(3),
									},
									{
										Name: "Astral Combat",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Magical Law"),
										Val: intPtr(1),
									},
								},
							},
						},
						{
							ID: "2c0070c5-2284-4161-8a90-2c89e0482b85",
							Name: "Wage Slave",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "CHA",
									},
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Con",
									},
									{
										Name: "Etiquette",
										Val: intPtr(2),
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Administration"),
										Val: intPtr(6),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Corporation]"),
							Val: intPtr(3),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "81e2f441-c13d-4cfd-815f-d27daf1dfc82",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Covert Operations",
				Karma: 100,
				Source: "RF",
				Page: "77",
				Story: stringPtr("$real was an genuine secret agent, spying on $ENTITY for $ENTITY"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Chemistry",
						},
						{
							Name: "Con",
						},
						{
							Name: "Escape Artist",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Codes"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "8b103553-5ad9-4183-a09b-d17983dc5df6",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Drifter",
				Karma: 100,
				Source: "RF",
				Page: "77",
				Story: stringPtr("$real decided getting a job just wasn't for them, instead choosing to couchsurf, or possibly live in their mother's basement."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "",
						},
						{
							Name: "",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
							Val: intPtr(2),
						},
						{
							Name: "Escape Artist",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Survival",
							Val: intPtr(2),
						},
						{
							Name: "Swimming",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Grey Market"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Black Market"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "a29aa9fa-d06e-4d5d-9d82-ae8a386fa4a4",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Ganger",
				Karma: 100,
				Source: "RF",
				Page: "78",
				Story: stringPtr("$real became a criminal, their main income coming from selling other people's cyber-VCRs, and occasionally mugging people and stealing the money they got by selling cyber-VCRs."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
							Val: intPtr(3),
						},
						{
							Name: "Demolitions",
						},
						{
							Name: "Escape Artist",
						},
						{
							Name: "Heavy Weapons",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Running",
						},
					},
				},
			},
			{
				ID: "3fb24f67-9d15-49d8-a598-5abbea335e8b",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Government Agent",
				Karma: 100,
				Source: "RF",
				Page: "78",
				Story: stringPtr("$real somehow managed to get a job with one of the few government organizations that hasn't yet been privatized. Be it with the FBI, MI5, NSA, TAO, Unit 61398, or some other organization, they get to be paid less than normal people in return for working longer hours and being hated by everyone."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Pistols",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
							Val: intPtr(3),
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Running",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Government Procedures"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Law Enforcement Protocols"),
							Val: intPtr(5),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("National Threats"),
							Val: intPtr(4),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "1",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "92eb874c-f932-403c-a33d-00f3f083c3cc",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Law Enforcement",
				Karma: 100,
				Source: "RF",
				Page: "78",
				Story: stringPtr("$real  $COPDESC"),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "eb4fe138-77a9-4f45-b630-4d5111d61fa5",
							Name: "Beat Cop",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Intimidation",
										Val: intPtr(2),
									},
									{
										Name: "Navigation",
									},
									{
										Name: "Pilot Ground Craft",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[City]"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "6b03d0e4-2f88-47ca-b186-7dc4efdef57a",
							Name: "Cyber Crime",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Matrix Criminals"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "bc024c41-9145-4736-8c12-ad015f9e5874",
							Name: "Cyber Division",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Cybertechnology",
									},
									{
										Name: "Heavy Weapons",
										Val: intPtr(2),
									},
									{
										Name: "Unarmed Combat",
									},
								},
							},
						},
						{
							ID: "129c4cd4-b03a-40b6-a5eb-59efb9ca65dc",
							Name: "Mage Division",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
									},
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Magical Threats"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "0da2be70-a3ad-4a13-865d-3ebcf99538a3",
							Name: "Rigger",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Automotive Mechanic",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Aircraft",
									},
									{
										Name: "Pilot Walker",
									},
									{
										Name: "Pilot Ground Craft",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Drones"),
										Val: intPtr(1),
									},
								},
							},
						},
						{
							ID: "0f5a42ed-2a43-4226-9f51-871fb7d7dd82",
							Name: "SWAT Team",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Gymnastics",
									},
									{
										Name: "Throwing Weapons",
										Val: intPtr(2),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Clubs",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pistols",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Police Procedures"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "0f4b3ba5-c4db-4906-8d39-c2afe92c5c65",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Organized Crime",
				Karma: 100,
				Source: "RF",
				Page: "78",
				Story: stringPtr("$real decided the best way to wealth and power was also the most brutal: organized crime. Specializing in $GANGDESC , $real became well known in the $GANGTYPE"),
				Bonus: &LifeModuleBonus{
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "Con",
							Val: intPtr(2),
						},
						{
							Name: "Demolitions",
						},
						{
							Name: "Escape Artist",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Forgery",
						},
						{
							Name: "Hardware",
						},
						{
							Name: "Intimidation",
							Val: intPtr(2),
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Unarmed Combat",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Syndicate]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "a2fb0e59-3921-432c-ac9c-ae4c3ac0145a",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Political Activist",
				Karma: 100,
				Source: "RF",
				Page: "79",
				Story: stringPtr("$real was one of the most dangerous things in the world: an idealist. Working for a small policlub or interest group, they got arrested multiple times in their quest to make the world a better place."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Disguise",
						},
						{
							Name: "Etiquette",
							Val: intPtr(2),
						},
						{
							Name: "Forgery",
							Val: intPtr(2),
						},
						{
							Name: "Instruction",
						},
						{
							Name: "Leadership",
							Val: intPtr(2),
						},
						{
							Name: "Negotiation",
							Val: intPtr(2),
						},
						{
							Name: "Palming",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Pistols",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Police Procedures"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Policlub]"),
							Val: intPtr(4),
						},
					},
				},
			},
			{
				ID: "304aa6bb-031b-4042-9258-4b4c4de09fc3",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Postgraduate Studies",
				Karma: 100,
				Source: "RF",
				Page: "79",
				Story: stringPtr("$real surfaced from the waters of academia, looked at the real world, said nope, and went straight back into academia."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Instruction",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Major]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "5e300502-2485-4cde-9aff-21c50d120738",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Private Investigator/Detective",
				Karma: 100,
				Source: "RF",
				Page: "79",
				Story: stringPtr("$real overdosed on $CRIMEDESC decided to become a private investigator."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Pistols",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Tracking",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Law Enforcement Procedures"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "85d549a0-4057-426f-b146-c2fd3dde5c9b",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Regular Job",
				Karma: 100,
				Source: "RF",
				Page: "79",
				Story: stringPtr("$real got a job, exchanging labor for currency like a normal person."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Leadership",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Negotiation",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Job]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Job]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "406ee650-fa40-4bf0-9e5f-77b7f9b37b23",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Shadow Work (Shadowrunner)",
				Karma: 100,
				Source: "RF",
				Page: "80",
				Story: stringPtr("$real is more than a criminal for hire: they're a very expensive criminal for hire, with multiple break-ins, kidnappings, and assassinations on their resume."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "096705a0-e145-4849-84bf-9e4421122d5e",
							Name: "Face",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "CHA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Con",
									},
									{
										Name: "Intimidation",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Pistols",
									},
								},
							},
						},
						{
							ID: "93c2318e-261e-48c6-ab79-72205ca94e00",
							Name: "Decker",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "INT",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Forgery",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Pistols",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Matrix Security Procedures"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "5d93a7da-9a2d-4bb3-ab58-f1716e10e8ba",
							Name: "Smuggler",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Electronic Warfare",
										Val: intPtr(2),
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "Gunnery",
										Val: intPtr(2),
									},
									{
										Name: "",
										Val: intPtr(2),
									},
									{
										Name: "Navigation",
									},
									{
										Name: "Negotiation",
									},
									{
										Name: "Perception",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Aircraft",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Ground Craft",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Watercraft",
										Val: intPtr(2),
									},
									{
										Name: "Pistols",
									},
									{
										Name: "Sneaking",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Border Patrol Tactics"),
										Val: intPtr(6),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Smuggler Safe Houses"),
										Val: intPtr(6),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Smuggler Routes"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "ff08139f-6d49-4149-87e2-15c9628c4288",
							Name: "Street Samurai",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "AGI",
									},
									{
										Name: "REA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Blades",
										Val: intPtr(2),
									},
									{
										Name: "Heavy Weapons",
									},
									{
										Name: "Negotiation",
									},
									{
										Name: "Perception",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Unarmed Combat",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Safe Houses"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "66fa0fe9-860e-4668-9805-9dfb9e39a810",
							Name: "Weapon Specialist",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Archery",
									},
									{
										Name: "Armorer",
										Val: intPtr(3),
									},
									{
										Name: "Chemistry",
										Val: intPtr(2),
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Heavy Weapons",
									},
									{
										Name: "Negotiation",
									},
									{
										Name: "Throwing Weapons",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Blade Design"),
										Val: intPtr(4),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Gun Design"),
										Val: intPtr(5),
									},
									{
										Group: stringPtr("Interest"),
										Name: stringPtr("Gun Trivia"),
										Val: intPtr(3),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
					},
				},
			},
			{
				ID: "30179edf-9494-498a-bdba-52947e011585",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Street Magic",
				Karma: 100,
				Source: "RF",
				Page: "80",
				Story: stringPtr("$real decided to put his awakened talents to some other use than for the corps."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "a7ae7061-c30f-4fc0-aa3a-03b0d1531d7b",
							Name: "Aspected Magician",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
										Val: intPtr(2),
									},
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
									{
										Name: "Blades",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Survival",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Magical Security"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Magical Theory (Street)"),
										Val: intPtr(1),
									},
								},
							},
						},
						{
							ID: "6ae62116-0acd-471a-8391-faa288122b0a",
							Name: "Occult Investigator",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
									},
									{
										Name: "Assensing",
										Val: intPtr(3),
									},
									{
										Name: "Locksmith",
									},
									{
										Name: "Perception",
										Val: intPtr(3),
									},
									{
										Name: "Pistols",
									},
									{
										Name: "Tracking",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Forensics"),
										Val: intPtr(5),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[City]"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "e7121806-2605-4d1a-9a0a-8ec4ad445a20",
							Name: "Eco-Shaman",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
									{
										Name: "Astral Combat",
										Val: intPtr(2),
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Etiquette",
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Forgery",
										Val: intPtr(2),
									},
									{
										Name: "Perception",
										Val: intPtr(2),
									},
									{
										Name: "Pistols",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Megacorp Law"),
										Val: intPtr(5),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Magical Theory"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "b3aa39b9-b8fc-4cd4-81fe-74bd9dc88341",
							Name: "Street Mage",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
									{
										Name: "Blades",
									},
									{
										Name: "Palming",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Survival",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Charity Shelters"),
										Val: intPtr(5),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[City]"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "d7a3229e-e83a-4748-b694-b176c8152f90",
							Name: "Street Shaman",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
									{
										Name: "Blades",
									},
									{
										Name: "Palming",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Survival",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Charity Shelters"),
										Val: intPtr(5),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[sprawl]"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "3c97d148-c3b2-4200-8fc1-ba20b347505d",
							Name: "Talismonger",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Assensing",
										Val: intPtr(3),
									},
									{
										Name: "Chemistry",
									},
									{
										Name: "Etiquette",
										Val: intPtr(2),
									},
									{
										Name: "First Aid",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
									{
										Name: "Pistols",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Telesma"),
										Val: intPtr(5),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Alchemy"),
										Val: intPtr(5),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
					},
				},
			},
			{
				ID: "011c1897-2bde-47f4-89d3-c28df64501ba",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Terrorist",
				Karma: 100,
				Source: "RF",
				Page: "81",
				Story: stringPtr("$real decided activism is for fools. The only way to get your voice heard is force. Blowing up pubs, executing civilians, assassinations, $real has done it all."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Demolitions",
							Val: intPtr(3),
						},
						{
							Name: "Disguise",
							Val: intPtr(2),
						},
						{
							Name: "Leadership",
							Val: intPtr(2),
						},
						{
							Name: "Palming",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Ground Craft",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Law Enforcement Procedures"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "81b605dd-dd60-4a41-bf77-e7fe706b04f6",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Think Tank",
				Karma: 100,
				Source: "RF",
				Page: "81",
				Story: stringPtr("$real is an intellectual whore, paid by megacorps to explain why $MEGAWHORE ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "LOG",
							Val: intPtr(2),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(6),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "da7c24fa-689a-4bd2-b83a-85196024ba44",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Tour of Duty (Mercenary)",
				Karma: 100,
				Source: "RF",
				Page: "82",
				Story: stringPtr("$real worked as a mercenary, fighting for fun and profit instead of for freedom or prophets."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "9319a416-e5b0-4c04-a5ca-39da62e47368",
							Name: "Air Force",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Aeronautics Mechanic",
									},
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Aircraft",
										Val: intPtr(2),
									},
									{
										Name: "Survival",
									},
								},
							},
						},
						{
							ID: "3030f32b-4d01-457e-aefa-88cfcd473ae0",
							Name: "Army",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Heavy Weapons",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Running",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Swimming",
									},
									{
										Name: "Throwing Weapons",
									},
								},
							},
						},
						{
							ID: "d0cfe27f-5261-4a58-adf5-93a2f8fbb6fb",
							Name: "Engineering Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
										Val: intPtr(2),
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Gunnery",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Military Vehicles"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "78597cb6-e4df-4402-aac1-691ecc8c34f3",
							Name: "Mage Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
									{
										Name: "Arcana",
									},
								},
							},
						},
						{
							ID: "311bbf30-6f51-43ae-9acf-33f426d897ef",
							Name: "Medical Corps",
							Bonus: &LifeModuleBonus{
							},
						},
						{
							ID: "5b02439c-6ae5-4446-a594-ce36b8cb3abe",
							Name: "Navy",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Pilot Watercraft",
										Val: intPtr(2),
									},
									{
										Name: "Survival",
									},
									{
										Name: "Swimming",
									},
								},
							},
						},
						{
							ID: "21c4ae77-ba32-4371-87f5-f4dc8eb41055",
							Name: "Rigger Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Gunnery",
										Val: intPtr(2),
									},
									{
										Name: "Electronic Warfare",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Aircraft",
									},
									{
										Name: "Pilot Walker",
									},
									{
										Name: "Pilot Ground Craft",
									},
								},
							},
						},
						{
							ID: "bc606cbf-f884-4f48-979a-368d10166580",
							Name: "Special Forces",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Pilot Watercraft",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Survival",
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Navigation",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Foreign Military"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "c81a2706-4b08-4ce4-bc0d-adb42634c59f",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Tour of Duty (NAN)",
				Karma: 100,
				Source: "RF",
				Page: "82",
				Story: stringPtr("$real signed on with the armed forces of one of the NANs, fighting to defend their freedom from $WARNAN ."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "67ec0fb9-7aaa-40bc-825d-c735e03be981",
							Name: "Air Force",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Blades",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Aircraft",
										Val: intPtr(2),
									},
									{
										Name: "Survival",
									},
									{
										Name: "Tracking",
									},
								},
							},
						},
						{
							ID: "25a8c69e-5720-423f-91c5-ec3c192aae97",
							Name: "Army",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Heavy Weapons",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Survival",
										Val: intPtr(2),
									},
									{
										Name: "Throwing Weapons",
									},
								},
							},
						},
						{
							ID: "2332eab3-df15-470a-848d-d10e9251352d",
							Name: "Engineering Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
										Val: intPtr(2),
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Gunnery",
									},
								},
							},
						},
						{
							ID: "72b55e93-e903-421c-a9c0-a8ed1971ae16",
							Name: "Mage Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Assensing",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Survival",
									},
								},
							},
						},
						{
							ID: "2a499a9b-ce9f-476b-81e8-9d381b712fb2",
							Name: "Medical Corps",
							Bonus: &LifeModuleBonus{
							},
						},
						{
							ID: "0485eb7a-6ad3-4c01-9c47-1f8fa0f248b7",
							Name: "Navy",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Watercraft",
									},
									{
										Name: "Survival",
										Val: intPtr(2),
									},
									{
										Name: "Swimming",
									},
								},
							},
						},
						{
							ID: "a9c38e90-8357-4d1a-bde1-0741f4e2f117",
							Name: "Rigger Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Archery",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Electronic Warfare",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Aircraft",
									},
									{
										Name: "Pilot Walker",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Survival",
									},
								},
							},
						},
						{
							ID: "de863670-8c10-4ebc-aa47-922ad273c10c",
							Name: "Special Forces",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Pilot Watercraft",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Sneaking",
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "STR",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("NAN Military"),
							Val: intPtr(3),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "1",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "61b6f290-95d2-4cfd-b7d6-336782a42c1b",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Tour of Duty (Tír Tairngire)",
				Karma: 100,
				Source: "RF",
				Page: "83",
				Story: stringPtr("$real was a greenshirt in service of the Tir, fighting to preserve quite possibly the most dysfunctional nation on the continent."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "8ac31c2d-c758-41a7-b7f5-c2684f3d822c",
							Name: "Air Force",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "REA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Aircraft",
										Val: intPtr(2),
									},
									{
										Name: "Survival",
									},
								},
							},
						},
						{
							ID: "7a434b14-8ad7-4158-a6ab-d379f0bb44c8",
							Name: "Border Patrol ",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "CHA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Heavy Weapons",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Swimming",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Throwing Weapons",
									},
								},
							},
						},
						{
							ID: "5c16f220-e0b7-4994-a773-26a04e77a378",
							Name: "Engineering Corps",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
										Val: intPtr(2),
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Gunnery",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Tír Military Vehicles"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "1a9d578f-534d-48b1-805a-576e95dd8d11",
							Name: "Ghosts",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Pilot Watercraft",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Survival",
									},
								},
							},
						},
						{
							ID: "202e69a4-9b52-4afd-be95-246ab9d56a86",
							Name: "Mage Corps",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
									},
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "0476d948-a6f8-407b-ac46-c15a4732e91b",
							Name: "Medical Corps",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
							},
						},
						{
							ID: "4bab3a60-3119-4664-bd78-4e03b04095da",
							Name: "Navy",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Blades",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Watercraft",
										Val: intPtr(2),
									},
									{
										Name: "Armorer",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Swimming",
									},
								},
							},
						},
						{
							ID: "4f0eac09-eabe-4cac-9c51-b7ebc65a55d5",
							Name: "Netwatch",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "INT",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Perception",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Matrix Threats"),
										Val: intPtr(6),
									},
								},
							},
						},
						{
							ID: "dad1be40-68a1-46a2-b7a4-5f2c7c86fbcf",
							Name: "Peace Keepers",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Clubs",
									},
									{
										Name: "Heavy Weapons",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Throwing Weapons",
									},
								},
							},
						},
						{
							ID: "9788eeb2-8ae1-44d0-b754-947ff282668d",
							Name: "Rigger Corp",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "REA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Electronic Warfare",
										Val: intPtr(2),
									},
									{
										Name: "Gunnery",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Aircraft",
									},
									{
										Name: "Pilot Walker",
									},
									{
										Name: "Pilot Ground Craft",
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Peacekeepers"),
							Val: intPtr(4),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "1",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "f1770715-63ea-45cb-bc08-061996dbb6be",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Tour of Duty (UCAS, CAS and CFS)",
				Karma: 100,
				Source: "RF",
				Page: "82",
				Story: stringPtr("$real was a soldier in service of the UCAS, CAS or CFS, training and drilling for the day the Azzies push north through the NANs so that they might be ready to… liberate them."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "8ddf9d3d-9e63-4879-a3d1-546d9928d5c0",
							Name: "Air Force",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
										Val: intPtr(2),
									},
									{
										Name: "Blades",
									},
									{
										Name: "Free-Fall",
									},
									{
										Name: "Gunnery",
									},
									{
										Name: "Pilot Aircraft",
										Val: intPtr(2),
									},
									{
										Name: "Survival",
									},
								},
							},
						},
						{
							ID: "8d40938c-1fbc-4dc1-9a45-647582608525",
							Name: "Army",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Free-Fall",
									},
									{
										Name: "Heavy Weapons",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Throwing Weapons",
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "77a62f13-2dd8-4b35-9b5a-bd2ae6ebf209",
							Name: "Engineering Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
										Val: intPtr(2),
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Gunnery",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Military Vehicles"),
										Val: intPtr(5),
									},
								},
							},
						},
						{
							ID: "48030cf2-5c87-4084-812b-6419bce4c011",
							Name: "Mage Corps",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Assensing",
										Val: intPtr(2),
									},
									{
										Name: "Perception",
									},
								},
							},
						},
						{
							ID: "7f26a610-5e04-48b9-ae98-02059de6821e",
							Name: "Medical Corps",
							Bonus: &LifeModuleBonus{
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Medicine"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "e14e4cac-a993-436a-b51a-829b2589a098",
							Name: "Navy",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Gunnery",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Watercraft",
										Val: intPtr(2),
									},
									{
										Name: "Survival",
									},
									{
										Name: "Swimming",
									},
								},
							},
						},
						{
							ID: "5fce080b-251e-4ae3-b201-0e67fa1e2411",
							Name: "Rigger Corps ",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Electronic Warfare",
										Val: intPtr(2),
									},
									{
										Name: "Gunnery",
										Val: intPtr(2),
									},
									{
										Name: "Pilot Aircraft",
									},
									{
										Name: "Pilot Walker",
									},
									{
										Name: "Pilot Ground Craft",
									},
								},
							},
						},
						{
							ID: "e6ec50d2-7721-4a94-9abe-ff786cf89bd3",
							Name: "Special Forces",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Armorer",
									},
									{
										Name: "Blades",
									},
									{
										Name: "Demolitions",
									},
									{
										Name: "Free-Fall",
									},
									{
										Name: "Perception",
									},
									{
										Name: "Pilot Ground Craft",
									},
									{
										Name: "Pilot Watercraft",
									},
									{
										Name: "Sneaking",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Tracking",
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Navigation",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Military"),
							Val: intPtr(4),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "1",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "4b56f994-84d5-4acc-8d6f-278eae90f624",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Early Emergence",
				Karma: 40,
				Source: "DT",
				Page: "51",
				Story: stringPtr("$real was coding before other kids could read, emerging as a technomancer around the age normal kids are working out that $ALPHABET"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Decompiling",
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Technical]"),
							Val: intPtr(4),
						},
					},
				},
			},
			{
				ID: "eb8c935b-6e60-475b-b909-27f6d7f54a8f",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Part of the Machine",
				Karma: 40,
				Source: "DT",
				Page: "51",
				Story: stringPtr("$real grew up among mechanics, and some of their skill brushed off on him. On the downside, so did a lot of $STICKY."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Hardware",
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Hobby]"),
							Val: intPtr(4),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Technical]"),
							Val: intPtr(4),
						},
					},
				},
			},
			{
				ID: "cb023d87-0312-4a50-a17d-87444fed10da",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Hacker Club",
				Karma: 50,
				Source: "DT",
				Page: "51",
				Story: stringPtr("$real grew up in a commune of hackers, who taught him the basics of hacking, and nothing else."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Hacking",
						},
						{
							Name: "Hardware",
						},
						{
							Name: "Electronic Warfare",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Technical]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "91abc09e-7564-4126-9c03-15d26989dcf8",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Technomancer Boarding School",
				Karma: 50,
				Source: "DT",
				Page: "51",
				Story: stringPtr("$real was lucky enough that their Emergence was noticed by one of the more techno friendly corporations, who gave them a free scholarship to a school that taught them how to use their powers instead of just black bagging and vivisecting them to see how they tick."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "RES",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Compiling",
						},
						{
							Name: "Decompiling",
						},
						{
							Name: "Electronic Warfare",
						},
						{
							Name: "Registering",
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Technical]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "e40f60aa-2269-4d3d-a34b-e2be24af496d",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Escaped Technomancer",
				Karma: 100,
				Source: "DT",
				Page: "52",
				Story: stringPtr("$real was blackbagged by a corp who wanted to take $real apart and see how they tick. Fortunately, they managed to escape, and even got to keep most of their organs."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Compiling",
							Val: intPtr(2),
						},
						{
							Name: "Con",
						},
						{
							Name: "Decompiling",
							Val: intPtr(2),
						},
						{
							Name: "Hacking",
							Val: intPtr(2),
						},
						{
							Name: "Registering",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Tech corporations]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "aaa6ec70-467e-4345-b5e1-f14ce038ef51",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Hacker Assassin",
				Karma: 100,
				Source: "DT",
				Page: "52",
				Story: stringPtr("$real serves the Old Man of the Mountain via the matrix, hitting their enemies with enough biofeedback to leave their enemies brain leaking out of their ears."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Cybercombat",
							Val: intPtr(3),
						},
						{
							Name: "Electronic Warfare",
						},
						{
							Name: "Hacking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Tech corporations]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "b8aea58a-e447-46f6-b96d-cf3bf3ff19e4",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Hacker Hobbyist",
				Karma: 100,
				Source: "DT",
				Page: "53",
				Story: stringPtr("$real hacks as a hobby, cracking code with nothing but sheer willpower and a lot of mountain dew."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "",
						},
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Cybercombat",
							Val: intPtr(2),
						},
						{
							Name: "Electronic Warfare",
							Val: intPtr(2),
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Hacking",
							Val: intPtr(2),
						},
						{
							Name: "Hardware",
							Val: intPtr(2),
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Tech corporations]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "3d08b696-1c7c-4bb6-af37-1b4d68fd985c",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "High-Profile Hack",
				Karma: 100,
				Source: "DT",
				Page: "53",
				Story: stringPtr("$real pulled off a big job. How big? I shit you not, they $HACKDESC ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Cybercombat",
							Val: intPtr(2),
						},
						{
							Name: "Electronic Warfare",
							Val: intPtr(2),
						},
						{
							Name: "Hacking",
							Val: intPtr(2),
						},
						{
							Name: "Leadership",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Secure Matrix Locations"),
							Val: intPtr(5),
						},
					},
				},
			},
			{
				ID: "ac0eb0cc-bae1-41e4-bffd-e684c5f51b2b",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "IT Ace",
				Karma: 100,
				Source: "DT",
				Page: "53",
				Story: stringPtr("$real had the misfortune to work as a sysadmin, an unappreciated job where one has to somehow fulfill requests made by people without even the most basic computer knowledge."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Cybercombat",
							Val: intPtr(2),
						},
						{
							Name: "Electronic Warfare",
						},
						{
							Name: "Etiquette",
							Val: intPtr(2),
						},
						{
							Name: "Hacking",
							Val: intPtr(2),
						},
						{
							Name: "Hardware",
							Val: intPtr(2),
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Tech corporations]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "243b126d-a71e-4398-b646-76780b6e7379",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Matrix Ghost",
				Karma: 100,
				Source: "DT",
				Page: "53",
				Story: stringPtr("$real is an expert at staying unseen in the matrix, especially when it comes to $MATRIXHIDE ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Con",
						},
						{
							Name: "Cybercombat",
							Val: intPtr(2),
						},
						{
							Name: "Electronic Warfare",
						},
						{
							Name: "Hacking",
							Val: intPtr(2),
						},
						{
							Name: "Hardware",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Matrix security]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Tech corporations]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "3c0549e6-d58a-4658-a7e5-4593ac8f1388",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Otaku Time",
				Karma: 100,
				Source: "DT",
				Page: "53",
				Story: stringPtr("$real was an Otaku. No, not a Japanese nerd, but instead a child of the Matrix. Thankfully, Crash 2.0 hit before they suffered Fading, leaving them as a Technomancer, allowing them to keep their odd connection to the matrix for the rest of their life."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Compiling",
							Val: intPtr(2),
						},
						{
							Name: "Decompiling",
						},
						{
							Name: "Cybercombat",
						},
						{
							Name: "Electronic Warfare",
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
						{
							Name: "Hacking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Tech corporations]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "c211d6f3-c773-4ff7-a1a1-64b16f47757e",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Slave",
				Karma: 40,
				Source: "CF",
				Page: "60",
				Story: stringPtr("$real was a slave, and spent their childhood $SLAVE"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "d91ba242-11bb-43a9-abed-4cb5c6b34819",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Bag of Organs",
				Karma: 40,
				Source: "CF",
				Page: "60",
				Story: stringPtr("$real was used as a host for bioware, as implanting it in a metahuman is cheaper than keeping it on ice. One day, $real knew they would be killed, and their organs $BAGORGAN . On the other hand, free bioware! Score!"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(2),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Biology"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Bioware"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Organleggers"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "f8413f32-3ed3-488f-989a-2fe961e94dee",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Child of the Shadows",
				Karma: 40,
				Source: "CF",
				Page: "61",
				Story: stringPtr("$real 's parents were shadowrunners. At a young age, $real was learning important skills such as $SHADOWCHILD ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Con",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Safehouses"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "a576c25e-2ca1-4d53-83de-1b58e9f72082",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Test Subject",
				Karma: 50,
				Source: "CF",
				Page: "61",
				Story: stringPtr("$real grew up a lab rat, used by mad scientists to test augmentations. On one hand, $real essence was irreparably shredded. On the other hand free ware! Score!"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Biotechnology",
						},
						{
							Name: "Cybertechnology",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Metahuman Biology"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Transhumanist Philosophy"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "737d188a-85b5-47d8-91f2-39863983b464",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Factory Child Worker",
				Karma: 50,
				Source: "CF",
				Page: "61",
				Story: stringPtr("$real was a child laborer in one of the few factories that hadn't fully mechanized. Their pay almost managed to pay for limbs to replace those they lost via work. Almost."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Perception",
						},
						{
							Name: "Armorer",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Machinist"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Industrial Facilities"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "70fe2ad0-1311-486c-b183-8b2620fc5056",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Pit Fighter",
				Karma: 100,
				Source: "CF",
				Page: "61",
				Story: stringPtr("$real fought in a blood sport, punching the shit out of other people for fun and profit."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Cybertechnology",
						},
						{
							Name: "First Aid",
							Val: intPtr(2),
						},
						{
							Name: "Intimidation",
							Val: intPtr(2),
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Performance",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Pit Fighting"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Syndicates"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "4e6da910-e160-4aec-8dfb-caafda2e952e",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Urban Brawler",
				Karma: 100,
				Source: "CF",
				Page: "61",
				Story: stringPtr("$real fought in Urban Brawl, which, despite all appearances, is somehow not a blood sport. It did, however, teach them quite a lot of things about $URBANBRAWL ."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "BOD",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Intimidation",
						},
						{
							Name: "Performance",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Urban Brawl"),
							Val: intPtr(3),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "1",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "b94d89fc-7ade-4942-9f85-b56c2f78847e",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Street Doc",
				Karma: 100,
				Source: "CF",
				Page: "61",
				Story: stringPtr("$real may very well only have a doctorate in fine arts, if they have one at all, but they still somehow manage to make it as a street doc, as asking no questions and working on the cheap is considered more important than actual medical training in some circles. Zoidberg would be proud."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Chemistry",
						},
						{
							Name: "Con",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Biology"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Drugs"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Street Gangs"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "efdee4d0-f6fb-4d75-816e-859e85ec29d4",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "Caribbean League",
				Karma: 15,
				Source: "HT",
				Page: "138",
				Story: stringPtr(""),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "62a71e87-d427-4b96-93f2-33d96c6226f2",
							Name: "Greater Antilles",
							Story: stringPtr("$real was born somewhere in the Greater Antilles area."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "AGI",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Navigation",
									},
									{
										Name: "Swimming",
									},
								},
								PushText: stringPtr("Caribbean League"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "ebce1884-43ef-4e22-bb4d-69c9856b2959",
							Name: "Lesser Antilles",
							Story: stringPtr("$real was born in the tiny sliver of the Lesser Antilles region."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Navigation",
									},
									{
										Name: "Swimming",
									},
									{
										Name: "Diving",
									},
								},
								PushText: stringPtr("Caribbean League"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "0aea1207-b2ba-409d-8424-36c3366515e3",
							Name: "Bahama Archipelago",
							Story: stringPtr("$real was born in the Bahamas."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Navigation",
									},
									{
										Name: "Swimming",
									},
									{
										Name: "Survival",
									},
								},
								PushText: stringPtr("Caribbean League"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "79179499-26e7-49d8-a354-910a1c46eeb8",
							Name: "Miami",
							Story: stringPtr("$real was born in Miami."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Navigation",
									},
									{
										Name: "Tracking",
									},
									{
										Name: "Etiquette",
									},
								},
								PushText: stringPtr("Caribbean League"),
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "35ece27f-6bd0-4e23-bed6-512952ff2818",
							Name: "SINless",
							Story: stringPtr("While born in the Caribbean, $real is a citizen of nowhere, for one of several reasons."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "AGI",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[City]"),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Caribbean History"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Island Nation]"),
						},
						{
							Group: stringPtr("Language"),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
								Spanish: stringPtr("Spanish"),
							},
						},
						{
							Group: stringPtr("Language"),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
							},
						},
					},
				},
			},
			{
				ID: "cf75cd28-5992-40d4-a9b4-837f3b3c4867",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Shanghaied",
				Karma: 50,
				Source: "HT",
				Page: "138",
				Story: stringPtr("$real was conscripted onto a ship."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Diving",
						},
						{
							Name: "Nautical Mechanic",
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Swimming",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("(Geography)"),
						},
					},
				},
			},
			{
				ID: "445984f2-d607-4124-afd3-b7c536016caa",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Pirate Captain",
				Karma: 100,
				Source: "HT",
				Page: "138",
				Story: stringPtr("$real was a crime boss of the sea."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "REA",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Diving",
						},
						{
							Name: "Gunnery",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Nautical Mechanic",
						},
						{
							Name: "Pilot Watercraft",
							Val: intPtr(2),
						},
						{
							Name: "Swimming",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Watercraft"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Local area] Waterways"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "caf84e62-05cd-4638-81d2-6d788f303e36",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Pirate Crewmember",
				Karma: 100,
				Source: "HT",
				Page: "139",
				Story: stringPtr("$real was a pirate on the high seas."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "STR",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Locksmith",
						},
						{
							Name: "Gunnery",
						},
						{
							Name: "Swimming",
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Nautical Mechanic",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Watercraft",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Knots"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Local area] Waterways"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "923cf93a-7892-43b5-8b2a-9b2cfba11acd",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Bocor Slave",
				Karma: 100,
				Source: "HT",
				Page: "139",
				Story: stringPtr("$real was imprisoned with vodou, living life as a zombie."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "STR",
						},
						{
							Name: "LOG",
						},
						{
							Name: "BOD",
						},
						{
							Name: "AGI",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Armorer",
						},
						{
							Name: "Artisan",
							Val: intPtr(2),
						},
						{
							Name: "Automotive Mechanic",
						},
						{
							Name: "Industrial Mechanic",
						},
						{
							Name: "Nautical Mechanic",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Buildings"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Construction"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Farming"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-10),
				},
			},
			{
				ID: "469157a3-d76d-46d9-9562-031a48baa2be",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Assassin's Apprentice",
				Karma: 100,
				Source: "HT",
				Page: "200",
				Story: stringPtr("$real spent time as a triggerman's assistant."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Armorer",
						},
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Demolitions",
						},
						{
							Name: "Disguise",
						},
						{
							Name: "Forgery",
						},
						{
							Name: "Gunnery",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Sneaking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Retail Operations"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Sniper Nests"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Language]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Language]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "67f740bd-b3a8-40d0-9590-2a3d0d90d0da",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Guardian Angel",
				Karma: 100,
				Source: "HT",
				Page: "200",
				Story: stringPtr("$real had a change of heart and instead of killing people for money protected people for free."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Clubs",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Gymnastics",
							Val: intPtr(2),
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Medicine",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Small Group Tactics"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Assassin Networks"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Runner Hangouts"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Weapons Manufacturers"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "716c4baf-5944-46da-8c1e-905ccd8962fc",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Ritual Killer",
				Karma: 100,
				Source: "HT",
				Page: "200",
				Story: stringPtr("$real used ritual magic to complete contracts.  Quite scary."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
							Val: intPtr(2),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Arcana",
						},
						{
							Name: "Counterspelling",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Ritual Spellcasting",
							Val: intPtr(3),
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Spellcasting",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Tracking",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Security Techniques"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Material Links"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "95b89172-5189-4841-9e89-c14754336382",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Minor Wheelman",
				Karma: 40,
				Source: "R5",
				Page: "34",
				Story: stringPtr("$real was driving before other kids could read the street signs, emerging as one of the best getaway drivers around the age normal kids were learning traffic signals"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automotive Mechanic",
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Pilot Ground Craft",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Vehicle Models]"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Vehicle Stunts]"),
						},
					},
				},
			},
			{
				ID: "195a5953-42ee-40ab-80fd-8c5e4c9d5fac",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Shop Kid",
				Karma: 40,
				Source: "R5",
				Page: "35",
				Story: stringPtr("Tinkering was what $real lived for. It started with simply identifying the limited cars in the neighborhood. From there scavenging parts and putting them back together. Totally self taught $real worked their way into shops if they weren't chased off"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automotive Mechanic",
							Val: intPtr(2),
						},
						{
							Name: "Industrial Mechanic",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Vehicle Models]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Vehicle Parts]"),
						},
					},
				},
			},
			{
				ID: "cc16eb63-8930-42ed-ac1a-390bd5ccc2d3",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Booster",
				Karma: 50,
				Source: "R5",
				Page: "35",
				Story: stringPtr("By the time $real was a teen, they were stealing cars to order, driving the boosts to any one of the chop shops in the city. Now, when $real sees a new car in the 'hood, what $real sees is the fee in Nuyen"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "REA",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Hacking",
						},
						{
							Name: "Locksmith",
						},
						{
							Name: "Pilot Ground Craft",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Vehicle Models]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Chop Shops]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "95504862-5150-4360-87fa-9086269cbdce",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Drone Hobbyist",
				Karma: 100,
				Source: "R5",
				Page: "35",
				Story: stringPtr("$real flies drones in competitions around the city. Taking jobs using their drones on the side to help pay for upgrades"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automotive Mechanic",
							Val: intPtr(2),
						},
						{
							Name: "Gunnery",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pilot Aircraft",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Ground Craft",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Walker",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Watercraft",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Drone Manufacturers"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Drone Software"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "e070e446-b3fd-4446-aa3a-35e73417ef06",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Getaway Driver",
				Karma: 100,
				Source: "R5",
				Page: "35",
				Story: stringPtr("Need a driver for that job you want doing? Feel the need for a getaway? Contact $real at getawaydriver.me for all your driving needs, flat rates for routes inside [CITY]"),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automotive Mechanic",
						},
						{
							Name: "Gunnery",
						},
						{
							Name: "Pilot Ground Craft",
							Val: intPtr(3),
						},
						{
							Name: "Pilot Watercraft",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Tracking",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[City] Streets"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Stunt Techniques"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "e7ec9b76-54c0-4dfd-8329-741bcc6abce8",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Trid Stunt Driver",
				Karma: 100,
				Source: "R5",
				Page: "35",
				Story: stringPtr("Need a driver for that TRI-D you're financing? Contact $real at actor-driver.me for all your driving needs."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automotive Mechanic",
						},
						{
							Name: "Demolitions",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Gunnery",
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Pilot Aircraft",
						},
						{
							Name: "Pilot Ground Craft",
							Val: intPtr(3),
						},
						{
							Name: "Pilot Walker",
						},
						{
							Name: "Pilot Watercraft",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Stunt Techniques"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Trid Studios"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "e80c51ca-d71e-47e5-91e4-22bff1a0d330",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Brothel Child",
				Karma: 40,
				Source: "CA",
				Page: "103",
				Story: stringPtr("$real was brought up in a syndicate-run brothel with the help of $real's many \"aunts\". They taught $real to be polite and discreet, so as to never be seen by the clients, and some of the many languages $real heard during this time stuck with $real."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
						{
							Name: "Escape Artist",
						},
						{
							Name: "Sneaking",
							Val: intPtr(3),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Syndicate]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "8f17dd9b-6dc4-419a-94be-584ef6f24e41",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Con Prop",
				Karma: 40,
				Source: "CA",
				Page: "103",
				Story: stringPtr("$real's parents were con artists, and the best thing to happen to them was $real. Who would ever suspect two doting parents and their lovely child? Who wouldn't pay attention to a terrified child that had \"lost their parents\"? With a cute animal or two added to the mix, $real could distract the best of them."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
							Val: intPtr(2),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Animal Handling",
							Val: intPtr(2),
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Palming",
							Val: intPtr(2),
						},
						{
							Name: "Performance",
							Val: intPtr(2),
						},
						{
							Name: "Running",
						},
					},
				},
			},
			{
				ID: "8da867a2-29cd-440f-b567-ef32cbe0da30",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "The Easiest Mark",
				Karma: 50,
				Source: "CA",
				Page: "103",
				Story: stringPtr("$real's parents never saw it coming. $real sold them out and milked them for all they had. $real was the invincible, the best in the world... at least, according to $real's assessment. It wasn't a walk in the park to constantly stay under the law's radar, but $real managed, even with the occasional unwelcome thoughts about $real's parents creeping into $real's mind."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Forgery",
							Val: intPtr(3),
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "e04175cd-7fde-4e10-83e3-4952a209f956",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Mr. Johnson",
				Karma: 100,
				Source: "CA",
				Page: "103",
				Story: stringPtr("$real is a professional Johnson. $real's job is to be the line between civilization - $real's corporation - and the necessary evil of the wild men, the savages of the street."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Intimidation",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pistols",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Runner Hangouts"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Megacorp]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Economics"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "814c5115-d978-4a20-8123-7e746ce52983",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Spy",
				Karma: 100,
				Source: "CA",
				Page: "104",
				Story: stringPtr("$real is a real spy, a working spy. $real is embedded where they need to be, undercover, and keeps an eye out for documents their handlers want, always being cautious, discreet, and misleading."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(3),
						},
						{
							Name: "Con",
							Val: intPtr(2),
						},
						{
							Name: "Impersonation",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
						{
							Name: "Unarmed Combat",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "01438e64-30aa-4555-8b24-0833dfdcad99",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Escort",
				Karma: 100,
				Source: "CA",
				Page: "104",
				Story: stringPtr("An escort is nothing as vulgar as a prostitute: prostitutes sell their flesh, $real sells an experience. $real knows how to set the mood, to build something up, to be something the rich and powerful must seem to have to earn and conquer."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
							Val: intPtr(2),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
							Val: intPtr(3),
						},
						{
							Name: "Etiquette",
							Val: intPtr(3),
						},
						{
							Name: "Blades",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Performance",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "9ac85595-f57c-4197-86c2-e2c9e8b37ea0",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Street Preacher",
				Karma: 100,
				Source: "CA",
				Page: "104",
				Story: stringPtr("A flood is coming that will wash away the filth from the streets, and $real has a message of salvation to deliver. Their mission is paramount, they know it. $real understands that salvation comes from odd angles in these godless times, and that they might have to do unconventional things for the greater good. $real's body is strong, and their resolve is stronger."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "WIL",
							Val: intPtr(2),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Instruction",
							Val: intPtr(2),
						},
						{
							Name: "Intimidation",
							Val: intPtr(2),
						},
						{
							Name: "Leadership",
							Val: intPtr(3),
						},
						{
							Name: "Survival",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Theology"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Area Knowledge: [City]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Sprawl Life"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "36b14645-f416-4598-ae10-f60f80d93155",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "Amazonian",
				Karma: 15,
				Source: "SFME",
				Page: "31",
				Story: stringPtr("$real was born in eastern South America, in the country now known as Amazonia."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "047e3fb2-1d43-480c-baed-2b333472eb7d",
							Name: "Metropole - Rio de Janeiro",
							Story: stringPtr("$real was born in Rio de Janeiro."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "CHA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
									{
										Name: "Swimming",
									},
								},
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "569ef9c9-3576-4d88-973b-df184a20675b",
							Name: "Metropole - Centro",
							Story: stringPtr("$real was born in Centro."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Law"),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Paranormal Critters"),
									},
								},
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "5129c5a5-066f-47b6-a37e-fae8d3e87471",
							Name: "Metropole - Sao Paolo",
							Story: stringPtr("$real was born in Sao Paolo."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Language]"),
									},
								},
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
						{
							ID: "60de16a9-72e8-48d6-aefa-e4e89b1620cb",
							Name: "Metropole - SINless",
							Story: stringPtr("$real was born in the Metropole without the luxury of a SIN."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "AGI",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Metropole"),
									},
								},
							},
						},
						{
							ID: "25d61719-2056-437b-80b8-376f70bd7cb3",
							Name: "Amazonian Tribal",
							Story: stringPtr("$real was born in the Amazonian wilds."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Archery",
									},
									{
										Name: "Survival",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Amazonian Rainforest"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Flora"),
									},
								},
								FreeNegativeQualities: intPtr(-8),
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Football"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Amazonia"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Paranormal Critters"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("Amazonian Portugese"),
							Val: intPtr(0),
						},
						{
							ID: stringPtr("a9df9852-6f4d-423d-8251-c92a709c1476"),
							Group: stringPtr("Language"),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
								Spanish: stringPtr("Spanish"),
								German: stringPtr("German"),
							},
						},
					},
				},
			},
			{
				ID: "7b009ba2-dbd6-47a2-a13f-28709a625374",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Anarchist Brat",
				Karma: 40,
				Source: "SAG",
				Page: "148",
				Story: stringPtr("$real was brought up consistently exposed to the Anarchist's way of seeing the world."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(1),
						},
						{
							Name: "REA",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Unarmed Combat",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Anarchy"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Anarchist City]"),
						},
					},
					PushText: stringPtr("Corp-Citizens"),
				},
			},
			{
				ID: "66b0b6d9-1afb-4218-92b9-54d529905639",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Life on the Coast",
				Karma: 40,
				Source: "SAG",
				Page: "148",
				Story: stringPtr("$real was brought up in one of the few small coastal towns around the world."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(1),
						},
						{
							Name: "STR",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Pilot Watercraft",
						},
						{
							Name: "Swimming",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Fishing"),
						},
					},
				},
			},
			{
				ID: "99b853b4-62f5-40ba-9d61-e6f853f6d0c1",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Life by the Toxic Sea",
				Karma: 40,
				Source: "SAG",
				Page: "148",
				Story: stringPtr("$real was brought up in proximity to of the world's many blighted coasts."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(1),
						},
						{
							Name: "INT",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Perception",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Toxic Critters"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Toxic Spirits"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "169485e7-4598-44c6-816a-d9282c18c9a0",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Migratory Background",
				Karma: 40,
				Source: "SAG",
				Page: "148",
				Story: stringPtr("$real and their family may have been war refugees or hoping for a better life elsewhere, as they where leaving their home country. You are part of the next generation, brought in between two cultures."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
							Val: intPtr(1),
						},
						{
							Name: "WIL",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
						{
							Name: "Running",
						},
						{
							Name: "Unarmed Combat",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Area Knowledge: [City]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "32f753ce-0696-45e2-8a65-9f62d583feb9",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Religious Upbringing",
				Karma: 40,
				Source: "SAG",
				Page: "148",
				Story: stringPtr("$real was brought up in a strictly religious family."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
							Val: intPtr(2),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Artisan",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[specific Religion]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Prayers/Meditation]"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Religious]"),
						},
					},
					PushText: stringPtr("Members of different Religions"),
				},
			},
			{
				ID: "746cde0e-1ca3-46ae-96b6-cb3971656673",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Anarcho-Teen",
				Karma: 50,
				Source: "SAG",
				Page: "150",
				Story: stringPtr("$real spent their teen years living the anarchist life."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Gymnastics",
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Industrial Mechanic",
						},
						{
							Name: "Clubs",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Unarmed Combat",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Anarchy"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Agriculture"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Politics"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[anarchist City]"),
						},
					},
					PushText: stringPtr("Policeman"),
				},
			},
			{
				ID: "feaaa9a3-774e-4a6c-9a83-968da043c06d",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Life on the Coast",
				Karma: 50,
				Source: "SAG",
				Page: "150",
				Story: stringPtr("$real spent his teen years living in a small coastal town, working in the fishing industry."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "Pilot Watercraft",
							Val: intPtr(2),
						},
						{
							Name: "Swimming",
							Val: intPtr(2),
						},
						{
							Name: "Nautical Mechanic",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Anarchy"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Fishing"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("[Any]"),
							Name: stringPtr("Interest"),
						},
					},
				},
			},
			{
				ID: "f0523ed1-9d9b-48fe-957c-1f64079d4e41",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Life by the Toxic Sea",
				Karma: 50,
				Source: "SAG",
				Page: "150",
				Story: stringPtr("$real spent his teen years helping his small community at the toxic coast."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Hardware",
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Ecological Groups"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Shipping Companies"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Smuggling Routes"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Toxic Critters"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Toxic Spirits"),
						},
					},
				},
			},
			{
				ID: "cb3be5ba-587f-4009-a19b-0b6b40ab6bda",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Religious School",
				Karma: 50,
				Source: "SAG",
				Page: "151",
				Story: stringPtr("$real spent his teen years in a private, religious school."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Arcana",
						},
						{
							Name: "Artisan",
						},
						{
							Name: "Con",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any I]"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any II]"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[specific Religion]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Prayers/Meditation]"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Religious]"),
						},
					},
				},
			},
			{
				ID: "256848e3-c5eb-4e5f-b8b1-85efcc52d596",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Religious Study",
				Karma: 80,
				Source: "RF",
				Page: "72",
				Story: stringPtr("$real achieved their higher education via their religious community."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "42504898-5de8-45f9-8577-a3187cff17ab",
							Name: "Priestly Formation",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Intimidation",
									},
									{
										Name: "Negotiation",
										Val: intPtr(2),
									},
									{
										Name: "Con",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Magic Theory"),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[specific Religion]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Philosophy/Religion I]"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Philosophy/Religion II]"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Prayers/Meditation]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Religious]"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Any]"),
										Val: intPtr(3),
									},
								},
							},
						},
						{
							ID: "0ccd44f1-90d1-4b51-9964-9bb7fce0d689",
							Name: "Monastery Residence",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
									},
									{
										Name: "First Aid",
										Val: intPtr(3),
									},
									{
										Name: "Medicine",
										Val: intPtr(2),
									},
									{
										Name: "Instruction",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Magic Theory"),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[specific Religion]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Prayers/Meditation]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Religious]"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "deb3d65a-ab9e-4da7-978f-917f8cf81485",
							Name: "Religious College",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
									},
									{
										Name: "Negotiation",
									},
									{
										Name: "Con",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Magic Theory"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[specific Religion]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Philosophy/Religion I]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[Philosophy/Religion II]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Prayers/Meditation]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Religious]"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "9170ccaa-0e4c-4ec4-b6be-06fc4b73137c",
							Name: "Neo-Pagan Education",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Arcana",
										Val: intPtr(3),
									},
									{
										Name: "First Aid",
										Val: intPtr(2),
									},
									{
										Name: "Medicine",
									},
									{
										Name: "Perception",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Magic Theory"),
									},
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("[specific Religion]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Prayers/Meditation]"),
										Val: intPtr(3),
									},
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Religious]"),
										Val: intPtr(2),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
						{
							Name: "CHA",
						},
					},
				},
			},
			{
				ID: "7eef2cb1-e0f7-4e99-8fdb-92bd453f1a7c",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Craft Apprenticeship",
				Karma: 55,
				Source: "RF",
				Page: "72",
				Story: stringPtr("$real achieved their higher education via their religious community."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "040183f6-607b-4b81-9999-d9600458090c",
							Name: "Creative",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Forgery",
									},
									{
										Name: "Artisan",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Profession]"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "c9d9d7dd-ffef-4e04-aa65-492383010acb",
							Name: "Practical",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "First Aid",
									},
									{
										Name: "Artisan",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Profession]"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "21026fc6-f943-4097-a76c-1444b4be19ce",
							Name: "Industrial",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Hardware",
									},
									{
										Name: "Industrial Mechanic",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Profession]"),
										Val: intPtr(4),
									},
								},
							},
						},
						{
							ID: "608db28c-3df0-4b64-b100-97d2c3eec85a",
							Name: "Engineering",
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("[Profession]"),
										Val: intPtr(4),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
				},
			},
			{
				ID: "db8443eb-94e0-4922-a2a2-f3824e4f6e2c",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Ork/Troll Slum Dweller",
				Karma: 40,
				Source: "TCG",
				Page: "189",
				Story: stringPtr("$real lived in the sprawl and learned how to survive in difficult circumstances."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Clubs",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "054a1a00-7745-495b-86b0-301c7917ac76",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Black Forest Baby",
				Karma: 40,
				Source: "TCG",
				Page: "190",
				Story: stringPtr("$real was born in the Black Forest Kingdom and saw it evolve into the Black Forest Troll Republic."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Longarms",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Survival",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Black Forest Government"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Black Forest History"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Black Forest People"),
						},
					},
				},
			},
			{
				ID: "ce6dbac8-6016-44dc-90f0-719a8928bf98",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Trog Ganger",
				Karma: 50,
				Source: "TCG",
				Page: "190",
				Story: stringPtr("$real was involved in trog gangs."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
							Val: intPtr(1),
						},
						{
							Name: "WIL",
							Val: intPtr(1),
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Escape Artist",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Survival",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
						},
					},
				},
			},
			{
				ID: "a9007966-38dd-429f-a661-cff06a776729",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Survivor",
				Karma: 50,
				Source: "TCG",
				Page: "190",
				Story: stringPtr("$real had a tough set of teen years but managed to survive."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "Clubs",
						},
						{
							Name: "Con",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
							Val: intPtr(2),
						},
						{
							Name: "Swimming",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
						},
					},
				},
			},
			{
				ID: "9220f169-be3f-48f1-bfa3-cb7fb4dec985",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Biloxi Technical Institute",
				Karma: 65,
				Source: "TCG",
				Page: "190",
				Story: stringPtr("$real had a tough set of teen years but managed to survive."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "d381b167-b5f5-425c-ba33-5a6876b4e45c",
							Name: "Computer Science",
							Story: stringPtr("$name studied Computer Science."),
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Cybercombat",
									},
									{
										Name: "Hacking",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Hardware Design"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "57893be6-0a91-4d93-bc4f-f1484e93c889",
							Name: "Computer Science",
							Story: stringPtr("$name studied Engineering."),
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Chemistry",
									},
									{
										Name: "Hardware",
									},
									{
										Name: "Industrial Mechanic",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Academic"),
										Name: stringPtr("Engineering"),
										Val: intPtr(4),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "6b55f9a1-257f-4ee2-b735-7a61772c8a3c",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Trog Professional",
				Karma: 100,
				Source: "TCG",
				Page: "191",
				Story: stringPtr("$real worked for a corp."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Hardware",
						},
						{
							Name: "Instruction",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Medicine",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Corporate Procedures"),
							Val: intPtr(3),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "d20c08f7-0e54-4a48-bd61-31279d99689f",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Trog Rebel",
				Karma: 100,
				Source: "TCG",
				Page: "191",
				Story: stringPtr("$real spent time rebelling against society with explosives."),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Demolitions",
						},
						{
							Name: "Escape Artist",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Covert Tactics"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "c674ae2c-e5ef-4bfa-8993-884769560644",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Student Athlete",
				Karma: 55,
				Source: "",
				Page: "",
				Story: stringPtr("$real was a student athlete."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "e3a7c927-6e82-453d-b24c-80bcbe8f6bc3",
							Name: "E-Sports",
							Story: stringPtr("$real did E-Sports."),
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Electronic Warfare",
									},
									{
										Name: "Hardware",
									},
									{
										Name: "Software",
									},
								},
							},
						},
						{
							ID: "b28917e0-5ef1-444d-bf4a-484da992cccd",
							Name: "Vehicle/Drone Sports",
							Story: stringPtr("$real did drone sports."),
							Bonus: &LifeModuleBonus{
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "",
									},
								},
							},
						},
						{
							ID: "b9b0906c-a795-44c6-a0de-aaccc2fa7795",
							Name: "Physical Sports",
							Story: stringPtr("$real did physical sports."),
							Bonus: &LifeModuleBonus{
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "51a990d8-3e7b-497e-b6dc-6b85ab3d1fe6",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Professional Athlete",
				Karma: 100,
				Source: "NF",
				Page: "178",
				Story: stringPtr(""),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "ad321336-0a5d-46df-a713-bb67d9340e7d",
							Name: "Awakened Athlete",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
									{
										Name: "WIL",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Magical Theory"),
										Val: intPtr(2),
									},
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Magical Law"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "32d88731-8174-437e-b150-86bfa669968d",
							Name: "Combat Biker/Urban Brawl Outrider",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
									{
										Name: "REA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Automotive Mechanic",
									},
									{
										Name: "Pilot Ground Craft",
										Val: intPtr(2),
									},
									{
										Name: "",
										Val: intPtr(2),
									},
									{
										Name: "",
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "dc646f6c-6ff8-4017-bfd6-2cc4d83b1c77",
							Name: "Courtballer",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
									{
										Name: "STR",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Blades",
										Val: intPtr(2),
									},
									{
										Name: "Clubs",
									},
									{
										Name: "Intimidation",
									},
									{
										Name: "Unarmed Combat",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("Spanish"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "c1d9d00d-01bc-48e3-a7c4-fb357dcc2732",
							Name: "Drone Racer",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "REA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Electronic Warfare",
									},
									{
										Name: "",
										Val: intPtr(2),
									},
									{
										Name: "",
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "62aebe0f-513a-45c6-8826-d356160ce13d",
							Name: "Freestyle Fighter",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "REA",
									},
									{
										Name: "STR",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "First Aid",
										Val: intPtr(2),
									},
									{
										Name: "Intimidation",
										Val: intPtr(2),
									},
									{
										Name: "Unarmed Combat",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Martial Arts"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "4de8cbb4-de52-480c-9113-30bbe6454436",
							Name: "Hurler/Stickballer",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "REA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Clubs",
										Val: intPtr(2),
									},
									{
										Name: "Running",
										Val: intPtr(2),
									},
									{
										Name: "Gymnastics",
									},
									{
										Name: "Throwing Weapons",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Language"),
										Name: stringPtr("[Sperethiel or any NAN]"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "3f2de14d-6538-410d-bcb0-a877f855af92",
							Name: "Miracle Shooter",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "AGI",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
									},
									{
										Name: "Gymnastics",
									},
									{
										Name: "Running",
									},
									{
										Name: "Software",
									},
									{
										Name: "Running",
									},
								},
							},
						},
						{
							ID: "6f06bb2c-a3e6-425a-bde9-fb8488bc558f",
							Name: "Professional Gamer",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "LOG",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Computer",
										Val: intPtr(2),
									},
									{
										Name: "Cybercombat",
										Val: intPtr(2),
									},
									{
										Name: "Electronic Warfare",
										Val: intPtr(2),
									},
									{
										Name: "Leadership",
									},
									{
										Name: "Software",
										Val: intPtr(2),
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Professional"),
										Name: stringPtr("Video Games"),
										Val: intPtr(3),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "REA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Chosen Sport]"),
							Val: intPtr(4),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "392b5600-34ac-40a9-a246-f3b5a11689ee",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Teen Diva",
				Karma: 100,
				Source: "NF",
				Page: "179",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Artisan",
						},
						{
							Name: "Performance",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Dance"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("High Fashion"),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Music"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Entertainment Industry"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Corporate Sponsor]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "baa9a6cc-2fb8-49d3-b503-d1f74bd0d915",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "Azanian Confederation",
				Karma: 15,
				Source: "BTB",
				Page: "162",
				Story: stringPtr(""),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "dd15394c-da02-49d4-9f12-bc07b781dbdd",
							Name: "General Azania",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "WIL",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Survival",
									},
									{
										Name: "Negotiation",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[City]"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "b715f0ad-4385-44d8-a9d9-415ed7219a4a",
							Name: "Pretoria (PWV Metroplex)",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "BOD",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Perception",
									},
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Pretoria"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "614be459-0eb9-4eb8-b75f-92b6520d6661",
							Name: "SINless",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "REA",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("[City]"),
										Val: intPtr(2),
									},
								},
							},
						},
						{
							ID: "c36e13c7-561b-4fe5-9335-7f300b5b70fe",
							Name: "Zulu Nation",
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "CHA",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Val: intPtr(2),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Val: intPtr(0),
						},
						{
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("History"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Azanian Confederation"),
						},
					},
				},
			},
			{
				ID: "476490f9-24d8-4eef-b397-22cad0d578f6",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Devout",
				Karma: 40,
				Source: "BTB",
				Page: "",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
						{
							Name: "Performance",
						},
						{
							Name: "Artisan",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Religious Text]"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "4c51d90e-7bcd-486f-b119-3adcc4cfd050",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Pastor's Kid",
				Karma: 40,
				Source: "BTB",
				Page: "163",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
						},
						{
							Name: "Performance",
						},
						{
							Name: "Artisan",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Name: stringPtr("[Religion]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "39fe4e90-e3ba-463d-9a6d-410c863c41a4",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Raised By Hooders",
				Karma: 40,
				Source: "BTB",
				Page: "163",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Escape Artist",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
					},
				},
			},
			{
				ID: "550d0752-da63-400d-a8bb-4f0778abafc5",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Tribal",
				Karma: 40,
				Source: "BTB",
				Page: "163",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "BOD",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Throwing Weapons",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Running",
						},
						{
							Name: "Survival",
						},
					},
				},
			},
			{
				ID: "b5d7eafe-1d7e-493a-b0de-7e8dfc1502b8",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Poor Kid",
				Karma: 40,
				Source: "BTB",
				Page: "163",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Survival",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Food Banks"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "cc2de2db-31c3-470d-b209-3ef019bd797b",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Framed",
				Karma: 100,
				Source: "BTB",
				Page: "163",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "REA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Disguise",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Running",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
						},
					},
				},
			},
			{
				ID: "64250875-5ffe-425e-9651-f09737f2bb2b",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Dead",
				Karma: 100,
				Source: "BTB",
				Page: "164",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
							Val: intPtr(2),
						},
						{
							Name: "Escape Artist",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Survival",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Police Hangouts and Checkpoints"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "5b8db9d6-4a23-435a-8ec0-2749b23cbec6",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Merc Kid",
				Karma: 40,
				Source: "SL",
				Page: "179",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Sneaking",
						},
						{
							Name: "Con",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Running",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Swimming",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Mercenary Units"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "00a565e8-4094-46fc-a9e0-6b8a9468b68d",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Dock Rat",
				Karma: 40,
				Source: "SL",
				Page: "179",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "STR",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Swimming",
							Val: intPtr(2),
						},
						{
							Name: "Con",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Running",
						},
						{
							Name: "Gymnastics",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Shipping Corps"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "0b6d0f7d-79e5-48c7-acc1-493344d8f363",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Corp Kid",
				Karma: 40,
				Source: "SL",
				Page: "127",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Etiquette",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Corp Politics"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
					},
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "3",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "8b05f9be-4713-4d96-9c8b-25952b538b3a",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Corp Silver Spooner",
				Karma: 40,
				Source: "SL",
				Page: "128",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Corporate"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
						},
					},
				},
			},
			{
				ID: "5b6feab4-e5dc-4c71-aa06-8303faf010a3",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Corp Teen",
				Karma: 50,
				Source: "SL",
				Page: "128",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Intimidation",
						},
						{
							Name: "Con",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Performance",
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
						},
					},
				},
			},
			{
				ID: "e5af6b42-a73c-4580-ab46-ac98718369cb",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Merc Teen",
				Karma: 50,
				Source: "SL",
				Page: "179",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "REA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Sneaking",
						},
						{
							Name: "Con",
						},
						{
							Name: "Demolitions",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Merc Corps"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Geography"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "0ce0e867-5fa9-4492-8452-1459ecf392a2",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Boat Brat",
				Karma: 50,
				Source: "SL",
				Page: "179",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Nautical Mechanic",
							Val: intPtr(2),
						},
						{
							Name: "Diving",
							Val: intPtr(2),
						},
						{
							Name: "Swimming",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Watercraft",
							Val: intPtr(2),
						},
						{
							Name: "Navigation",
							Val: intPtr(3),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Specific location near lake, river, or ocean]"),
							Val: intPtr(4),
						},
					},
				},
			},
			{
				ID: "d886934b-b937-4791-9512-cd7257ca721d",
				Stage: "Further Education",
				Category: "LifeModule",
				Name: "Corp College Student",
				Karma: 65,
				Source: "SL",
				Page: "128",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Etiquette",
							Val: intPtr(1),
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Instruction",
						},
						{
							Name: "Performance",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("\n            \n          "),
							Name: stringPtr("[Any]"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
						},
					},
				},
			},
			{
				ID: "14dfb0c8-4748-490c-876d-f65f55e81d95",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Warm Body",
				Karma: 100,
				Source: "SL",
				Page: "129",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Running",
						},
						{
							Name: "Sneaking",
							Val: intPtr(2),
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Local] Geography"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "9b9f3b96-10ed-497c-816c-9692cfe3e523",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Rising Star",
				Karma: 100,
				Source: "SL",
				Page: "129",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Any]"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "d847b2bc-1ff6-4fce-a799-17129fef4ff7",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Company Troubleshooter",
				Karma: 100,
				Source: "SL",
				Page: "129",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automatics",
						},
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Instruction",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Tracking",
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Small Unit Tactics"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "040e3551-315a-41b4-aceb-181479ef9841",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Corpsec Officer, Basic",
				Karma: 100,
				Source: "SL",
				Page: "128",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "AGI",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Running",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Small Unit Tactics"),
							Val: intPtr(1),
						},
					},
				},
			},
			{
				ID: "5544cbc8-d77e-43fa-ab07-dbc160f9b403",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Lost At Sea",
				Karma: 100,
				Source: "SL",
				Page: "180",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "AGI",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
							Val: intPtr(2),
						},
						{
							Name: "Diving",
							Val: intPtr(4),
						},
						{
							Name: "Swimming",
							Val: intPtr(4),
						},
						{
							Name: "Survival",
							Val: intPtr(4),
						},
						{
							Name: "Throwing Weapons",
							Val: intPtr(3),
						},
						{
							Name: "Pilot Watercraft",
							Val: intPtr(2),
						},
						{
							Name: "Navigation",
							Val: intPtr(3),
						},
						{
							Name: "Nautical Mechanic",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Local] Nature"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "7349cc93-667b-4b36-8cc7-f42134c2b319",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Environmental Combat Specialist (By Type)",
				Karma: 100,
				Source: "SL",
				Page: "180",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
							Val: intPtr(2),
						},
						{
							Name: "Navigation",
							Val: intPtr(2),
						},
						{
							Name: "Survival",
							Val: intPtr(3),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Geography [Area]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "45057214-38fd-4824-ba7c-985a3da22ef5",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Tour of Duty (Desert Wars)",
				Karma: 100,
				Source: "SL",
				Page: "180",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "WIL",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
							Val: intPtr(1),
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Heavy Weapons",
							Val: intPtr(2),
						},
						{
							Name: "Navigation",
						},
						{
							Name: "Performance",
							Val: intPtr(3),
						},
						{
							Name: "Pilot Ground Craft",
							Val: intPtr(1),
						},
						{
							Name: "Running",
							Val: intPtr(1),
						},
						{
							Name: "Swimming",
							Val: intPtr(1),
						},
						{
							Name: "Throwing Weapons",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Megacorporate Military"),
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "ad4fea0f-037e-43c2-a153-55ea606d46a2",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "In The Thick",
				Karma: 100,
				Source: "SL",
				Page: "180",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "REA",
						},
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
							Val: intPtr(2),
						},
						{
							Name: "Heavy Weapons",
							Val: intPtr(2),
						},
						{
							Name: "Intimidation",
							Val: intPtr(2),
						},
						{
							Name: "Throwing Weapons",
							Val: intPtr(3),
						},
					},
				},
			},
			{
				ID: "0f4e4c01-f781-44a7-a630-a92e59b63a28",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Gone AWOL",
				Karma: 100,
				Source: "SL",
				Page: "181",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "REA",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automotive Mechanic",
							Val: intPtr(3),
						},
						{
							Name: "Clubs",
							Val: intPtr(2),
						},
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Locksmith",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Ground Craft",
							Val: intPtr(3),
						},
						{
							Name: "Pistols",
							Val: intPtr(2),
						},
						{
							Name: "Running",
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "991a62d3-456e-4c86-94a2-2c20ea11c7e1",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Gone Native",
				Karma: 100,
				Source: "SL",
				Page: "180",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "AGI",
						},
						{
							Name: "INT",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Throwing Weapons",
							Val: intPtr(4),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Native Language]"),
							Val: intPtr(3),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[Local] Nature"),
							Val: intPtr(4),
						},
					},
				},
			},
			{
				ID: "3e6efacd-4503-45f7-a5a8-4fbed9c2f5bc",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Lost In The Wilds",
				Karma: 100,
				Source: "SL",
				Page: "180",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "STR",
						},
						{
							Name: "WIL",
						},
						{
							Name: "INT",
						},
						{
							Name: "BOD",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Blades",
						},
						{
							Name: "Sneaking",
							Val: intPtr(4),
						},
						{
							Name: "Throwing Weapons",
						},
					},
				},
			},
			{
				ID: "bab07751-2d37-4079-aa0d-274cf1038c92",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Bootstrap Cliche",
				Karma: 40,
				Source: "KC",
				Page: "79",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Hardware",
						},
						{
							Name: "Locksmith",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Street"),
							Name: stringPtr("Sprawl Life"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Public Grid"),
						},
					},
				},
			},
			{
				ID: "516ece95-6b51-48b6-9806-24087dc344c2",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Hacking Savant",
				Karma: 40,
				Source: "KC",
				Page: "80",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Hacking",
						},
						{
							Name: "Hardware",
							Val: intPtr(2),
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Matrix-related]"),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Grid"),
						},
					},
				},
			},
			{
				ID: "22d06d59-ccf0-49ce-a17d-5bb3431a03cf",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Have You Heard The Good Word?",
				Karma: 40,
				Source: "KC",
				Page: "80",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "CHA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Con",
						},
						{
							Name: "Hardware",
						},
						{
							Name: "Perception",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Hobby]"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Religion]"),
						},
					},
				},
			},
			{
				ID: "ed378222-f6c4-4d7f-971c-6d6b2d01a6b3",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "The Itsy-Bitsy Spider",
				Karma: 40,
				Source: "KC",
				Page: "80",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Cybercombat",
						},
						{
							Name: "Electronic Warfare",
						},
						{
							Name: "Hacking",
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Matrix Security"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Technical]"),
						},
					},
				},
			},
			{
				ID: "2dff667c-7d61-496c-9999-cffdebb56007",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "ATH133T",
				Karma: 50,
				Source: "KC",
				Page: "80",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "RES",
						},
						{
							Name: "STR",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Software",
							Val: intPtr(2),
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Sports]"),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Technomancers]"),
						},
					},
				},
			},
			{
				ID: "8e34871f-d1e0-4c3b-8c63-5c06b21553f0",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Destined For Greatness",
				Karma: 50,
				Source: "KC",
				Page: "80",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "RES",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Leadership",
						},
						{
							Name: "Negotiation",
						},
						{
							Name: "Registering",
							Val: intPtr(2),
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Corp Culture"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Business"),
						},
					},
				},
			},
			{
				ID: "4ba4b426-c333-4216-af95-58c1114c447a",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Hack-A-Thon Medalist",
				Karma: 50,
				Source: "KC",
				Page: "80",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "AGI",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "First Aid",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Software",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Matrix Related]"),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("[Any]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "30f5af48-0df1-431e-9ae7-6d5266e0ab92",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "The Flow",
				Karma: 50,
				Source: "KC",
				Page: "81",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "WIL",
						},
						{
							Name: "BOD",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Chemistry",
						},
						{
							Name: "Hacking",
							Val: intPtr(2),
						},
						{
							Name: "Palming",
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Matrix Related]"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Drug Related]"),
						},
					},
				},
			},
			{
				ID: "fc502702-45f4-4b70-9e09-cb3c6cad5da0",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Jacked Out",
				Karma: 50,
				Source: "KC",
				Page: "79",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "RES",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Perception",
							Val: intPtr(2),
						},
						{
							Name: "Registering",
							Val: intPtr(2),
						},
						{
							Name: "Software",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Any]"),
						},
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("[Matrix Related]"),
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "c1133c0e-1c5a-4ba0-a207-0274cd90b25c",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Matrix Royalty",
				Karma: 50,
				Source: "KC",
				Page: "81",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
						},
						{
							Name: "Con",
						},
						{
							Name: "Electronic Warfare",
							Val: intPtr(2),
						},
						{
							Name: "Intimidation",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Psychology"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("[Matrix Related]"),
						},
					},
				},
			},
			{
				ID: "801d6ce7-080b-4a87-b49e-cc83c467a1bf",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Techno-Rigger, Qu'est Que C'est",
				Karma: 50,
				Source: "KC",
				Page: "81",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "RES",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Compiling",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Aircraft",
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Registering",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Vehicles"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
						},
					},
				},
			},
			{
				ID: "53bbb6ff-dd83-41c6-83df-474c5ede08e7",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Moroccan Citizen",
				Karma: 100,
				Source: "SFMO",
				Page: "29",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Computer",
							Val: intPtr(2),
						},
						{
							Name: "Pilot Ground Craft",
						},
					},
					FreeNegativeQualities: intPtr(-5),
					QualityLevel: []LifeModuleQualityLevel{
						{
							Content: "1",
							Group: stringPtr("SINner"),
						},
					},
				},
			},
			{
				ID: "d90bad82-303e-4c0b-b00b-f8649af99db6",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Business Apprentice",
				Karma: 100,
				Source: "SFMO",
				Page: "29",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "LOG",
						},
						{
							Name: "CHA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
							Val: intPtr(2),
						},
						{
							Name: "Negotiation",
							Val: intPtr(2),
						},
						{
							Name: "Perception",
							Val: intPtr(2),
						},
					},
				},
			},
			{
				ID: "bb1f877c-6826-41ad-a4cc-b4bad9b4eb28",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "RMAF Short-Timer/Auxiliary Forces Member",
				Karma: 100,
				Source: "SFMO",
				Page: "29",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "LOG",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automatics",
						},
						{
							Name: "Blades",
						},
						{
							Name: "First Aid",
							Val: intPtr(2),
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "6a32e5d6-23cd-41fc-9225-5919e42fe979",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Former Royal Gendarmerie or National Police Force",
				Karma: 100,
				Source: "SFMO",
				Page: "29",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "INT",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Clubs",
							Val: intPtr(2),
						},
						{
							Name: "Intimidation",
							Val: intPtr(2),
						},
						{
							Name: "Pistols",
						},
						{
							Name: "Pilot Ground Craft",
						},
						{
							Name: "Running",
						},
						{
							Name: "Tracking",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Professional"),
							Name: stringPtr("Criminal Investigation"),
						},
					},
					FreeNegativeQualities: intPtr(-7),
				},
			},
			{
				ID: "b70926e9-2150-461e-9c3f-6340e7bd8236",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "RMAF Veteran",
				Karma: 100,
				Source: "SFMO",
				Page: "30",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Automatics",
							Val: intPtr(2),
						},
						{
							Name: "Blades",
						},
						{
							Name: "First Aid",
						},
						{
							Name: "Heavy Weapons",
						},
						{
							Name: "Pistols",
							Val: intPtr(2),
						},
						{
							Name: "Sneaking",
						},
						{
							Name: "Throwing Weapons",
						},
						{
							Name: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "8aa2a54f-3afd-4fe3-b30a-7a525b1c52d0",
				Stage: "Nationality",
				Category: "LifeModule",
				Name: "Morocco",
				Karma: 15,
				Source: "SFCR",
				Page: "27",
				Story: stringPtr("$real was born in Morocco in Northeast Africa."),
				Versions: &LifeModuleVersions{
					Version: []LifeModuleVersion{
						{
							ID: "9bc6c8ed-7ec1-4eb2-ad2f-714f580483ac",
							Name: "Casablanca-Rabat",
							Story: stringPtr("$real was born in Casablanca-Rabat."),
							Bonus: &LifeModuleBonus{
								AttributeLevel: []LifeModuleAttributeLevel{
									{
										Name: "INT",
									},
								},
								SkillLevel: []LifeModuleSkillLevel{
									{
										Name: "Navigation",
									},
									{
										Name: "Survival",
									},
									{
										Name: "Etiquette",
									},
								},
								KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
									{
										Group: stringPtr("Street"),
										Name: stringPtr("Area Knowledge: Casablanca-Rabat"),
									},
								},
								FreeNegativeQualities: intPtr(-5),
								QualityLevel: []LifeModuleQualityLevel{
									{
										Content: "1",
										Group: stringPtr("SINner"),
									},
								},
							},
						},
					},
				},
				Bonus: &LifeModuleBonus{
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Morocco History"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("SINless Intuition"),
						},
						{
							ID: stringPtr("1082e017-a93f-4b64-a478-b329668d57d6"),
							Group: stringPtr("Language"),
							Val: intPtr(0),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
							},
						},
						{
							ID: stringPtr("6715b9d9-5445-4bc0-886c-b6ac309181b3"),
							Group: stringPtr("Language"),
							Options: &LifeModuleKnowledgeSkillLevelOptions{
								Spanish: stringPtr("Spanish"),
							},
						},
					},
				},
			},
			{
				ID: "4aa7d75c-538f-4f36-9d19-5be9e29e6335",
				Stage: "Formative Years",
				Category: "LifeModule",
				Name: "Desert Nomad",
				Karma: 40,
				Source: "SFCR",
				Page: "27",
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "BOD",
						},
						{
							Name: "AGI",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Animal Handling",
						},
						{
							Name: "Perception",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Geography"),
						},
					},
				},
			},
			{
				ID: "845921f5-9481-49df-bd1f-138889459c4a",
				Stage: "Teen Years",
				Category: "LifeModule",
				Name: "Wharf Rat",
				Karma: 50,
				Source: "SFCR",
				Page: "27",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "BOD",
						},
						{
							Name: "WIL",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Clubs",
						},
						{
							Name: "Survival",
						},
						{
							Name: "Swimming",
						},
						{
							Name: "Unarmed Combat",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Ship Identification"),
						},
						{
							Group: stringPtr("Language"),
							Name: stringPtr("[Language]"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(2),
						},
					},
					FreeNegativeQualities: intPtr(-10),
				},
			},
			{
				ID: "13149d3c-9454-416e-983a-86828554bdb7",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Bardi (Berber Rider)",
				Karma: 100,
				Source: "SFCR",
				Page: "27",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "REA",
						},
						{
							Name: "INT",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Animal Handling",
						},
						{
							Name: "Longarms",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Intimidation",
						},
						{
							Name: "Leadership",
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Moroccan History"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Berber Tribes"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
						},
					},
				},
			},
			{
				ID: "45dc7fce-c096-4515-b98b-ccedf8341dec",
				Stage: "Real Life",
				Category: "LifeModule",
				Name: "Snake Charmer",
				Karma: 100,
				Source: "SFCR",
				Page: "27",
				Story: stringPtr(""),
				Bonus: &LifeModuleBonus{
					AttributeLevel: []LifeModuleAttributeLevel{
						{
							Name: "AGI",
						},
						{
							Name: "CHA",
						},
						{
							Name: "REA",
						},
					},
					SkillLevel: []LifeModuleSkillLevel{
						{
							Name: "Con",
						},
						{
							Name: "Etiquette",
						},
						{
							Name: "Gymnastics",
						},
						{
							Name: "Palming",
						},
						{
							Name: "Performance",
							Val: intPtr(2),
						},
						{
							Name: "Tracking",
						},
					},
					KnowledgeSkillLevel: []LifeModuleKnowledgeSkillLevel{
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Herpetology"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Academic"),
							Name: stringPtr("Berber Tribes"),
							Val: intPtr(2),
						},
						{
							Group: stringPtr("Interest"),
							Name: stringPtr("Music"),
						},
						{
							Group: stringPtr("Street"),
							Name: stringPtr("[City]"),
							Val: intPtr(2),
						},
					},
				},
			},
		},
	},
}

// GetLifeModulesData returns the loaded life modules data.
func GetLifeModulesData() *LifeModulesChummer {
	return lifemodulesData
}
