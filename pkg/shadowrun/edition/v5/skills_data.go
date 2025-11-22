package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Code generated from skills.xml. DO NOT EDIT.

var skillsData = &SkillsChummer{
	SkillGroups: []SkillGroups{
		{
			Name: []SkillGroupName{
				{
					Content: "Acting",
				},
				{
					Content: "Athletics",
				},
				{
					Content: "Biotech",
				},
				{
					Content: "Close Combat",
				},
				{
					Content: "Conjuring",
				},
				{
					Content: "Cracking",
				},
				{
					Content: "Electronics",
				},
				{
					Content: "Enchanting",
				},
				{
					Content: "Firearms",
				},
				{
					Content: "Influence",
				},
				{
					Content: "Engineering",
				},
				{
					Content: "Outdoors",
				},
				{
					Content: "Sorcery",
				},
				{
					Content: "Stealth",
				},
				{
					Content: "Tasking",
				},
			},
		},
	},
	Categories: []SkillCategories{
		{
			Category: []SkillCategory{
				{
					Content: "Combat Active",
					Type: "active",
				},
				{
					Content: "Physical Active",
					Type: "active",
				},
				{
					Content: "Social Active",
					Type: "active",
				},
				{
					Content: "Magical Active",
					Type: "active",
				},
				{
					Content: "Pseudo-Magical Active",
					Type: "active",
				},
				{
					Content: "Resonance Active",
					Type: "active",
				},
				{
					Content: "Technical Active",
					Type: "active",
				},
				{
					Content: "Vehicle Active",
					Type: "active",
				},
				{
					Content: "Academic",
					Type: "knowledge",
				},
				{
					Content: "Interest",
					Type: "knowledge",
				},
				{
					Content: "Language",
					Type: "knowledge",
				},
				{
					Content: "Professional",
					Type: "knowledge",
				},
				{
					Content: "Street",
					Type: "knowledge",
				},
			},
		},
	},
	Skills: []Skills{
		{
			Skill: []Skill{
				{
					ID: "b52f7575-eebf-41c4-938d-df3397b5ee68",
					Name: "Aeronautics Mechanic",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Engineering",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Aerospace",
							},
							{
								Content: "Fixed Wing",
							},
							{
								Content: "LTA (blimp)",
							},
							{
								Content: "Rotary Wing",
							},
							{
								Content: "Tilt Wing",
							},
							{
								Content: "Vector Thrust",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "fc89344f-daa6-438e-b61d-23f10dd13e44",
					Name: "Alchemy",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Enchanting",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Combat",
							},
							{
								Content: "Command",
							},
							{
								Content: "Contact",
							},
							{
								Content: "Detection",
							},
							{
								Content: "Health",
							},
							{
								Content: "Illusion",
							},
							{
								Content: "Manipulation",
							},
							{
								Content: "Time",
							},
							{
								Content: "[Trigger]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "e09e5aa7-e496-41a2-97ce-17f577361888",
					Name: "Animal Handling",
					Attribute: "CHA",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Herding",
							},
							{
								Content: "Riding",
							},
							{
								Content: "Training",
							},
							{
								Content: "[Animal Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "74a68a9e-8c5b-4998-8dbb-08c1e768afc3",
					Name: "Arcana",
					Attribute: "LOG",
					Category: "Pseudo-Magical Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Focus Design",
							},
							{
								Content: "Magical Artifacts",
							},
							{
								Content: "Spell Design",
							},
							{
								Content: "Spirit Formula",
							},
							{
								Content: "Spirit Theory",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "1537ca5c-fa93-4c05-b073-a2a0eed91b8e",
					Name: "Archery",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Bow",
							},
							{
								Content: "Crossbow",
							},
							{
								Content: "Non-Standard Ammunition",
							},
							{
								Content: "Slingshot",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "130",
					},
				},
				{
					ID: "ada6d9b2-e451-4289-be45-7085fa34a51a",
					Name: "Armorer",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Armor",
							},
							{
								Content: "Artillery",
							},
							{
								Content: "Explosives",
							},
							{
								Content: "Firearms",
							},
							{
								Content: "Melee Weapons",
							},
							{
								Content: "Heavy Weapons",
							},
							{
								Content: "Weapon Accessories",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "955d9376-3066-469d-8670-5170c1d59020",
					Name: "Artificing",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Enchanting",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Focus Analysis",
							},
							{
								Content: "[Focus Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "2f4c706f-5ac5-4774-8a45-3b4667989a20",
					Name: "Artisan",
					Attribute: "INT",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Carpentry",
							},
							{
								Content: "Cooking",
							},
							{
								Content: "Drawing",
							},
							{
								Content: "Sculpting",
							},
							{
								Content: "Fashion",
							},
							{
								Content: "Writing",
							},
							{
								Content: "[Discipline]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "59318078-e071-411b-9194-7222560e9f4a",
					Name: "Assensing",
					Attribute: "INT",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Aura Reading",
							},
							{
								Content: "Astral Signatures",
							},
							{
								Content: "Psychometry",
							},
							{
								Content: "[Aura Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "b7599a42-ceed-4558-b357-865aa3e317f5",
					Name: "Astral Combat",
					Attribute: "WIL",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Magicians",
							},
							{
								Content: "Mana Barriers",
							},
							{
								Content: "Spirits",
							},
							{
								Content: "[Weapon Focus Type]",
							},
							{
								Content: "[Other Opponent Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "788b387b-ee41-4e6a-bf22-481a8cc4cf9f",
					Name: "Automatics",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "Firearms",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Assault Rifles",
							},
							{
								Content: "Cyber-Implant",
							},
							{
								Content: "Machine Pistols",
							},
							{
								Content: "Submachine Guns",
							},
							{
								Content: "Carbines",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "130",
					},
				},
				{
					ID: "5e5f2f7f-f63b-4f65-a65d-91b3d4523c6f",
					Name: "Automotive Mechanic",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Engineering",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Hover",
							},
							{
								Content: "Tracked",
							},
							{
								Content: "Walker",
							},
							{
								Content: "Wheeled",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "9a2d9175-d445-45ca-842d-90223ad13f05",
					Name: "Banishing",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Conjuring",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Spirits of Air",
							},
							{
								Content: "Spirits of Beasts",
							},
							{
								Content: "Spirits of Earth",
							},
							{
								Content: "Spirits of Fire",
							},
							{
								Content: "Spirits of Man",
							},
							{
								Content: "Spirits of Water",
							},
							{
								Content: "Guardian Spirit",
							},
							{
								Content: "Guidance Spirit",
							},
							{
								Content: "Plant Spirit",
							},
							{
								Content: "Task Spirit",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "dfba7c09-3d95-43fd-be75-39b3e8b22cd3",
					Name: "Binding",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Conjuring",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Spirits of Air",
							},
							{
								Content: "Spirits of Beasts",
							},
							{
								Content: "Spirits of Earth",
							},
							{
								Content: "Spirits of Fire",
							},
							{
								Content: "Spirits of Man",
							},
							{
								Content: "Spirits of Water",
							},
							{
								Content: "Guardian Spirit",
							},
							{
								Content: "Guidance Spirit",
							},
							{
								Content: "Plant Spirit",
							},
							{
								Content: "Task Spirit",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "ba624682-a5c0-4cf5-b47b-1021e6a1800d",
					Name: "Biotechnology",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Biotech",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Bioinformatics",
							},
							{
								Content: "Bioware",
							},
							{
								Content: "Cloning",
							},
							{
								Content: "Gene Therapy",
							},
							{
								Content: "Vat Maintenance",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "48763fa5-4b89-48c7-80ff-d0a2761de4c0",
					Name: "Blades",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "Close Combat",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Axes",
							},
							{
								Content: "Knives",
							},
							{
								Content: "Swords",
							},
							{
								Content: "Parrying",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "130",
					},
				},
				{
					ID: "bd4d977a-cbd4-4289-99bb-896caed6786a",
					Name: "Chemistry",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Analytical",
							},
							{
								Content: "Biochemistry",
							},
							{
								Content: "Drugs",
							},
							{
								Content: "Inorganic",
							},
							{
								Content: "Organic",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Toxins",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "cd9f6bf7-fa48-464b-9a8f-c7ce26713a72",
					Name: "Clubs",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "Close Combat",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Batons",
							},
							{
								Content: "Hammers",
							},
							{
								Content: "Saps",
							},
							{
								Content: "Staves",
							},
							{
								Content: "Parrying",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "131",
					},
				},
				{
					ID: "f338d383-ffd8-4ff8-b99b-cf4c2ed1b159",
					Name: "Compiling",
					Attribute: "RES",
					Category: "Resonance Active",
					Default: "False",
					SkillGroup: "Tasking",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "[Sprite Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "1c14bf0d-cc69-4126-9a95-1f2429c11aa5",
					Name: "Computer",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "Electronics",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Edit File",
							},
							{
								Content: "Matrix Perception",
							},
							{
								Content: "Matrix Search",
							},
							{
								Content: "[Computer Matrix Action]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "6d7f48d3-84a1-4fce-90d3-58d566f70fa6",
					Name: "Con",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "Acting",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Fast Talk",
							},
							{
								Content: "Seduction",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "138",
					},
				},
				{
					ID: "3db81bcc-264b-47e1-847c-06bdacd88973",
					Name: "Counterspelling",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Sorcery",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Combat",
							},
							{
								Content: "Detection",
							},
							{
								Content: "Health",
							},
							{
								Content: "Illusion",
							},
							{
								Content: "Manipulation",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "7143f979-aa48-4cc8-a29c-e010400e6e11",
					Name: "Cybercombat",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "Cracking",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Devices",
							},
							{
								Content: "Grids",
							},
							{
								Content: "IC",
							},
							{
								Content: "Personas",
							},
							{
								Content: "Sprites",
							},
							{
								Content: "[Target Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "9b386fe5-83b3-436f-9035-efd1c0f7a680",
					Name: "Cybertechnology",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Biotech",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Bodyware",
							},
							{
								Content: "Cyberlimbs",
							},
							{
								Content: "Headware",
							},
							{
								Content: "Nanoware",
							},
							{
								Content: "Repair",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "64eed2e9-e61c-4cba-81d4-18a612cf2df6",
					Name: "Decompiling",
					Attribute: "RES",
					Category: "Resonance Active",
					Default: "False",
					SkillGroup: "Tasking",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "[Sprite Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "276877e1-5cdf-4e95-befd-13c1abb5ae02",
					Name: "Demolitions",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Commercial Explosives",
							},
							{
								Content: "Defusing",
							},
							{
								Content: "Improvised Explosives",
							},
							{
								Content: "Plastic Explosives",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "a9d9b686-bc4a-4347-b011-ff8f41455965",
					Name: "Disenchanting",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Enchanting",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "[Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "9b2416b2-3e2b-4dd6-ab9d-530f493c1c22",
					Name: "Disguise",
					Attribute: "INT",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "Stealth",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Camouflage",
							},
							{
								Content: "Cosmetic",
							},
							{
								Content: "Theatrical",
							},
							{
								Content: "Trideo & Video",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "23c3320c-5010-4b2e-ac46-76f0a86af0b9",
					Name: "Diving",
					Attribute: "BOD",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Arctic",
							},
							{
								Content: "Cave",
							},
							{
								Content: "Commercial",
							},
							{
								Content: "Controlled Hyperventilation",
							},
							{
								Content: "Liquid Breathing Apparatus",
							},
							{
								Content: "Military",
							},
							{
								Content: "Mixed Gas",
							},
							{
								Content: "Oxygen Extraction",
							},
							{
								Content: "SCUBA",
							},
							{
								Content: "[Other Breathing Apparatus]",
							},
							{
								Content: "[Other Condition]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "2c8e5f20-e52d-4844-89e9-51b92dba47df",
					Name: "Electronic Warfare",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Cracking",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Communications",
							},
							{
								Content: "Encryption",
							},
							{
								Content: "Jamming",
							},
							{
								Content: "Sensor Operations",
							},
							{
								Content: "[Electronic Warfare Matrix Action]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "3f93335c-49d6-4904-a97e-4c942ab05b59",
					Name: "Escape Artist",
					Attribute: "AGI",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Contortionism",
							},
							{
								Content: "Cuffs",
							},
							{
								Content: "Ropes",
							},
							{
								Content: "Zip Ties",
							},
							{
								Content: "[Other Restraint]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "b20acd11-f102-40f3-a641-e3c420fbdb91",
					Name: "Etiquette",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "Influence",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Catholic Church",
							},
							{
								Content: "Corporate",
							},
							{
								Content: "High Society",
							},
							{
								Content: "Mafia",
							},
							{
								Content: "Magic",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Media",
							},
							{
								Content: "Mercenary",
							},
							{
								Content: "Street",
							},
							{
								Content: "Yakuza",
							},
							{
								Content: "[Culture or Subculture]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "138",
					},
				},
				{
					ID: "a1366ec2-772d-4f08-8c65-5f79464d975b",
					Name: "Exotic Melee Weapon",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "False",
					SkillGroup: "",
					Exotic: stringPtr("True"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "131",
					},
				},
				{
					ID: "88ee65ba-c797-4f9c-91fe-39bc43b0f9c8",
					Name: "Exotic Ranged Weapon",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "False",
					SkillGroup: "",
					Exotic: stringPtr("True"),
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Blowguns",
							},
							{
								Content: "Gyrojet Pistols",
							},
							{
								Content: "Flamethrowers",
							},
							{
								Content: "Lasers",
							},
							{
								Content: "Spidersilk",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "131",
					},
				},
				{
					ID: "b5f95b50-e630-4162-a6a4-7dd6ab8d0256",
					Name: "Pilot Exotic Vehicle",
					Attribute: "REA",
					Category: "Vehicle Active",
					Default: "False",
					SkillGroup: "",
					Exotic: stringPtr("True"),
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Festo Pigeon 2.0",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "131",
					},
				},
				{
					ID: "47cb1e8b-c285-4c54-9aaa-75305ad6dd4f",
					Name: "First Aid",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "Biotech",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Broken Bones",
							},
							{
								Content: "Burns",
							},
							{
								Content: "Gunshot Wounds",
							},
							{
								Content: "Resuscitation",
							},
							{
								Content: "[Type of Treatment]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "27db6e2a-a49f-4232-b150-e676b8dacb52",
					Name: "Flight",
					Attribute: "AGI",
					Category: "Physical Active",
					Default: "False",
					SkillGroup: "Athletics",
					RequiresFlyMovement: stringPtr("True"),
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Desert",
							},
							{
								Content: "Distance",
							},
							{
								Content: "Sprinting",
							},
							{
								Content: "Urban",
							},
							{
								Content: "Wilderness",
							},
							{
								Content: "[Terrain]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "394",
					},
				},
				{
					ID: "c9f52f97-a284-44a7-8af6-802dd3ed554f",
					Name: "Forgery",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Counterfeiting",
							},
							{
								Content: "Credstick Forgery",
							},
							{
								Content: "False ID",
							},
							{
								Content: "Image Doctoring",
							},
							{
								Content: "Paper Forgery",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "144",
					},
				},
				{
					ID: "f510ccc3-cf95-4461-b2f7-e966daaa5a91",
					Name: "Free-Fall",
					Attribute: "BOD",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "BASE Jumping",
							},
							{
								Content: "Break-Fall",
							},
							{
								Content: "Bungee",
							},
							{
								Content: "HALO",
							},
							{
								Content: "Low Altitude",
							},
							{
								Content: "Parachute",
							},
							{
								Content: "Rappelling",
							},
							{
								Content: "Static Line",
							},
							{
								Content: "Wingsuit",
							},
							{
								Content: "Zipline",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "58452cff-44ea-41c6-a554-28a869149b27",
					Name: "Gunnery",
					Attribute: "AGI",
					Category: "Vehicle Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Artillery",
							},
							{
								Content: "Ballistic",
							},
							{
								Content: "Energy",
							},
							{
								Content: "Guided Missile",
							},
							{
								Content: "Rocket",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "146",
					},
				},
				{
					ID: "a9fa961d-07e5-46da-8edc-403ae3e6cc75",
					Name: "Gymnastics",
					Attribute: "AGI",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "Athletics",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Balance",
							},
							{
								Content: "Climbing",
							},
							{
								Content: "Dance",
							},
							{
								Content: "Dodging",
							},
							{
								Content: "Leaping",
							},
							{
								Content: "Parkour",
							},
							{
								Content: "Rolling",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "c2bb65f5-4a6b-49bf-9925-ef6434cb6929",
					Name: "Hacking",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "Cracking",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Devices",
							},
							{
								Content: "Files",
							},
							{
								Content: "Hosts",
							},
							{
								Content: "Personas",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "41e184e0-7273-403a-9300-fa29a1707bf0",
					Name: "Hardware",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Electronics",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Commlinks",
							},
							{
								Content: "Cyberdecks",
							},
							{
								Content: "Jack Out",
							},
							{
								Content: "Smartguns",
							},
							{
								Content: "[Hardware Type]",
							},
							{
								Content: "[Hardware Matrix Action]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "64841e6e-9487-4b63-80a1-dcad6eb78179",
					Name: "Heavy Weapons",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Assault Cannons",
							},
							{
								Content: "Grenade Launchers",
							},
							{
								Content: "Guided Missiles",
							},
							{
								Content: "Machine Guns",
							},
							{
								Content: "Rocket Launchers",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "132",
					},
				},
				{
					ID: "e7e5a43f-9762-4863-86dc-3fd7799e53a2",
					Name: "Impersonation",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "Acting",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Dwarf",
							},
							{
								Content: "Elf",
							},
							{
								Content: "Human",
							},
							{
								Content: "Ork",
							},
							{
								Content: "Troll",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "138",
					},
				},
				{
					ID: "935621c5-d384-42f2-a740-1fa349fa85a1",
					Name: "Industrial Mechanic",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Engineering",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Electrical Power Systems",
							},
							{
								Content: "Hydraulics",
							},
							{
								Content: "HVAC",
							},
							{
								Content: "Industrial Robotics",
							},
							{
								Content: "Structural",
							},
							{
								Content: "Welding",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "3b34b209-00be-42b8-b4ac-cc7dea08af8a",
					Name: "Instruction",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "[Active or Knowledge Skill Category]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "138",
					},
				},
				{
					ID: "9de43fad-b365-4e73-bc06-91dd571b858a",
					Name: "Intimidation",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Interrogation",
							},
							{
								Content: "Mental",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Torture",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "139",
					},
				},
				{
					ID: "963a548d-c629-4a13-a3e3-31b085a42e20",
					Name: "Leadership",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "Influence",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Command",
							},
							{
								Content: "Direct",
							},
							{
								Content: "Inspire",
							},
							{
								Content: "Rally",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "139",
					},
				},
				{
					ID: "09fbc992-9fad-4f2d-ab56-725bac943dc6",
					Name: "Locksmith",
					Attribute: "AGI",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Combination",
							},
							{
								Content: "Keypad",
							},
							{
								Content: "Maglock",
							},
							{
								Content: "Tumbler",
							},
							{
								Content: "Voice Recognition",
							},
							{
								Content: "[Lock Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "64088b25-de37-4d71-8800-4a430fde08af",
					Name: "Longarms",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "Firearms",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Extended-Range Shots",
							},
							{
								Content: "Long-Range Shots",
							},
							{
								Content: "Shotguns",
							},
							{
								Content: "Sniper Rifles",
							},
							{
								Content: "Sporting Rifles",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "132",
					},
				},
				{
					ID: "938be691-4b3d-49a2-a673-bbf9924ce8f0",
					Name: "Medicine",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Biotech",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Cosmetic Surgery",
							},
							{
								Content: "Extended Care",
							},
							{
								Content: "Implant Surgery",
							},
							{
								Content: "Magical Health",
							},
							{
								Content: "Organ Culture",
							},
							{
								Content: "Trauma Surgery",
							},
							{
								Content: "Veterinary",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "48cc79be-f75e-4fe6-8721-7864c9f231f6",
					Name: "Nautical Mechanic",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Engineering",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Motorboat",
							},
							{
								Content: "Sailboat",
							},
							{
								Content: "Ship",
							},
							{
								Content: "Submarine",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "f8037e7f-d48b-452b-8f66-2e0c36677fea",
					Name: "Navigation",
					Attribute: "INT",
					Category: "Technical Active",
					Default: "True",
					SkillGroup: "Outdoors",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Augmented Reality Markers",
							},
							{
								Content: "Celestial",
							},
							{
								Content: "Compass",
							},
							{
								Content: "Maps",
							},
							{
								Content: "GPS",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "729c9cee-ef8f-492d-aa7f-17ec1bc3816e",
					Name: "Negotiation",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "Influence",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Bargaining",
							},
							{
								Content: "Contracts",
							},
							{
								Content: "Diplomacy",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "139",
					},
				},
				{
					ID: "17fbaafa-8dbb-4f29-9244-5ae1cd4ac42f",
					Name: "Palming",
					Attribute: "AGI",
					Category: "Physical Active",
					Default: "False",
					SkillGroup: "Stealth",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Legerdemain",
							},
							{
								Content: "Pickpocket",
							},
							{
								Content: "Pilfering",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "04e1eb3e-e82d-485b-a7fd-1e677df2a070",
					Name: "Perception",
					Attribute: "INT",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Hearing",
							},
							{
								Content: "Numinous Perception",
							},
							{
								Content: "Scent",
							},
							{
								Content: "Searching",
							},
							{
								Content: "Taste",
							},
							{
								Content: "Touch",
							},
							{
								Content: "Visual",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "53f96d6a-363b-4c14-be1d-68e74930c67b",
					Name: "Performance",
					Attribute: "CHA",
					Category: "Social Active",
					Default: "True",
					SkillGroup: "Acting",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Acting",
							},
							{
								Content: "Comedy",
							},
							{
								Content: "Dance",
							},
							{
								Content: "Presentation",
							},
							{
								Content: "[Musical Instrument]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "139",
					},
				},
				{
					ID: "3ba9397e-f790-44ca-ae40-15a2356e348d",
					Name: "Pilot Aerospace",
					Attribute: "REA",
					Category: "Vehicle Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Deep Space",
							},
							{
								Content: "Launch Craft",
							},
							{
								Content: "Remote Operation",
							},
							{
								Content: "Semiballistic",
							},
							{
								Content: "Suborbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "146",
					},
				},
				{
					ID: "10d5c887-a1e5-4cca-8613-3a28f1aab810",
					Name: "Pilot Aircraft",
					Attribute: "REA",
					Category: "Vehicle Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Fixed-Wing",
							},
							{
								Content: "Lighter-Than-Air",
							},
							{
								Content: "Remote Operation",
							},
							{
								Content: "Rotary Wing",
							},
							{
								Content: "Tilt Wing",
							},
							{
								Content: "Vectored Thrust",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "147",
					},
				},
				{
					ID: "ae91a8a6-80e7-4f52-b9eb-21725a5528a4",
					Name: "Pilot Ground Craft",
					Attribute: "REA",
					Category: "Vehicle Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Bike",
							},
							{
								Content: "Hovercraft",
							},
							{
								Content: "Remote Operation",
							},
							{
								Content: "Tracked",
							},
							{
								Content: "Wheeled",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "147",
					},
				},
				{
					ID: "b8a24d87-465a-4365-9948-038fe1ac62c4",
					Name: "Pilot Walker",
					Attribute: "REA",
					Category: "Vehicle Active",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Biped",
							},
							{
								Content: "Multiped",
							},
							{
								Content: "Quadruped",
							},
							{
								Content: "Remote Operation",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "147",
					},
				},
				{
					ID: "1579818e-af85-47cd-8c9f-2e86e9dc19da",
					Name: "Pilot Watercraft",
					Attribute: "REA",
					Category: "Vehicle Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Hydrofoil",
							},
							{
								Content: "Motorboat",
							},
							{
								Content: "Remote Operation",
							},
							{
								Content: "Sail",
							},
							{
								Content: "Ship",
							},
							{
								Content: "Submarine",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "147",
					},
				},
				{
					ID: "adf31a50-b228-4e09-a09c-46ab9f5e59a1",
					Name: "Pistols",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "Firearms",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Holdouts",
							},
							{
								Content: "Revolvers",
							},
							{
								Content: "Semi-Automatics",
							},
							{
								Content: "Tasers",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "132",
					},
				},
				{
					ID: "3a38bbcf-38b0-435b-98f2-4ce8c50e8490",
					Name: "Registering",
					Attribute: "RES",
					Category: "Resonance Active",
					Default: "False",
					SkillGroup: "Tasking",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "[Sprite Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "a6287e62-6a3b-43ce-b6e0-20f3655910e2",
					Name: "Ritual Spellcasting",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Sorcery",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "[Keyword]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "142",
					},
				},
				{
					ID: "1531b2d8-6116-4be4-87b0-232dba1fc447",
					Name: "Running",
					Attribute: "STR",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "Athletics",
					RequiresGroundMovement: stringPtr("True"),
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Desert",
							},
							{
								Content: "Distance",
							},
							{
								Content: "Sprinting",
							},
							{
								Content: "Urban",
							},
							{
								Content: "Wilderness",
							},
							{
								Content: "[Terrain]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "9cff9aa7-d092-4f89-8b7b-3ab835818874",
					Name: "Sneaking",
					Attribute: "AGI",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "Stealth",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Desert",
							},
							{
								Content: "Jungle",
							},
							{
								Content: "Urban",
							},
							{
								Content: "Vehicle",
							},
							{
								Content: "Wilderness",
							},
							{
								Content: "[Terrain]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "b693f3bf-48dc-4570-9743-d94d14ee698b",
					Name: "Software",
					Attribute: "LOG",
					Category: "Technical Active",
					Default: "False",
					SkillGroup: "Electronics",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Data Bombs",
							},
							{
								Content: "[Complex Form]",
							},
							{
								Content: "[Program Type]",
							},
							{
								Content: "[Software Matrix Action]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "145",
					},
				},
				{
					ID: "c4367a39-4065-4b1d-aa62-e9dce377e452",
					Name: "Spellcasting",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Sorcery",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Combat",
							},
							{
								Content: "Detection",
							},
							{
								Content: "Health",
							},
							{
								Content: "Illusion",
							},
							{
								Content: "Manipulation",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "51e34c6c-b07f-45f4-8a5e-8f2b617ed32f",
					Name: "Summoning",
					Attribute: "MAG",
					Category: "Magical Active",
					Default: "False",
					SkillGroup: "Conjuring",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Spirits of Air",
							},
							{
								Content: "Spirits of Beasts",
							},
							{
								Content: "Spirits of Earth",
							},
							{
								Content: "Spirits of Fire",
							},
							{
								Content: "Spirits of Man",
							},
							{
								Content: "Spirits of Water",
							},
							{
								Content: "Guardian Spirit",
							},
							{
								Content: "Guidance Spirit",
							},
							{
								Content: "Plant Spirit",
							},
							{
								Content: "Task Spirit",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "143",
					},
				},
				{
					ID: "89ee1730-053a-400f-a13a-4fbadae015f0",
					Name: "Survival",
					Attribute: "WIL",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "Outdoors",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Desert",
							},
							{
								Content: "Forest",
							},
							{
								Content: "Jungle",
							},
							{
								Content: "Mountain",
							},
							{
								Content: "Polar",
							},
							{
								Content: "Urban",
							},
							{
								Content: "[Terrain]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "133",
					},
				},
				{
					ID: "0dbcb9cd-f824-4b5d-a387-90d33318b04c",
					Name: "Swimming",
					Attribute: "STR",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "Athletics",
					RequiresSwimMovement: stringPtr("True"),
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Dash",
							},
							{
								Content: "Long Distance",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "134",
					},
				},
				{
					ID: "867a6fa0-7d98-4cde-83a4-b33dd39de08e",
					Name: "Throwing Weapons",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Aerodynamic",
							},
							{
								Content: "Blades",
							},
							{
								Content: "Non-Aerodynamic",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "132",
					},
				},
				{
					ID: "7ed2f3e0-a791-4cb7-ba3e-ac785fdc3d7e",
					Name: "Tracking",
					Attribute: "INT",
					Category: "Physical Active",
					Default: "True",
					SkillGroup: "Outdoors",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Desert",
							},
							{
								Content: "Forest",
							},
							{
								Content: "Jungle",
							},
							{
								Content: "Mountain",
							},
							{
								Content: "Polar",
							},
							{
								Content: "Urban",
							},
							{
								Content: "[Terrain]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "134",
					},
				},
				{
					ID: "4fcd40cb-4b02-4b7e-afcb-f44d46cd5706",
					Name: "Unarmed Combat",
					Attribute: "AGI",
					Category: "Combat Active",
					Default: "True",
					SkillGroup: "Close Combat",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Blocking",
							},
							{
								Content: "Cyber Implants",
							},
							{
								Content: "Subduing Combat",
							},
							{
								Content: "[Martial Art]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "132",
					},
				},
			},
		},
	},
	KnowledgeSkills: []KnowledgeSkills{
		{
			Skill: []Skill{
				{
					ID: "9f348c99-27e8-47ac-a098-a8a6a54c446a",
					Name: "Administration",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Corporate",
							},
							{
								Content: "Government",
							},
							{
								Content: "Religious",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "60156c75-78e9-4d79-af3f-494baa20edb7",
					Name: "Alchemy",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Combat",
							},
							{
								Content: "Command",
							},
							{
								Content: "Contact",
							},
							{
								Content: "Detection",
							},
							{
								Content: "Health",
							},
							{
								Content: "Illusion",
							},
							{
								Content: "Manipulation",
							},
							{
								Content: "Time",
							},
							{
								Content: "[Trigger]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "40d28f1b-2171-4a3b-a640-6b097a4dea95",
					Name: "Alcohol",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Beers",
							},
							{
								Content: "Coolers",
							},
							{
								Content: "Hard Liquor",
							},
							{
								Content: "Wines",
							},
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "f43b2a75-a556-4d3a-8f8b-f1615a78538c",
					Name: "Anishinaabe",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "534600a0-395e-4bbc-8dc9-97a007e97504",
					Name: "Anatomy",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "05eb2251-81aa-4dfb-8619-75102fc7b895",
					Name: "Arabic",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "6cc80a0b-a9e2-46fe-8951-af4f34bfe3b3",
					Name: "Architecture",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Art Nouveau",
							},
							{
								Content: "Brutalist",
							},
							{
								Content: "Commercial",
							},
							{
								Content: "Residential",
							},
							{
								Content: "Elven",
							},
							{
								Content: "Orkish",
							},
							{
								Content: "Medieval",
							},
							{
								Content: "Gothic",
							},
							{
								Content: "Renaissance",
							},
							{
								Content: "Baroque",
							},
							{
								Content: "Victorian",
							},
							{
								Content: "Neo-Classical",
							},
							{
								Content: "Modern",
							},
							{
								Content: "High-Tech",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "3ea2eb75-69d3-4ecd-9f63-6dfc690cadf8",
					Name: "Area Knowledge: Atlanta",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ad99dbbc-e1b3-46a2-82cc-8f5ec4bfbed2",
					Name: "Area Knowledge: Cheyenne",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "c8b1f29f-38d7-4364-b160-7b163f6bf715",
					Name: "Area Knowledge: Chicago",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Chicago Matrix",
							},
							{
								Content: "Containment Zone",
							},
							{
								Content: "Matrix Hot Spots",
							},
							{
								Content: "Safe Houses",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "4952de53-b333-45cd-bceb-cffe57b1e5a6",
					Name: "Area Knowledge: Denver",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "67885d5a-4e26-40d9-8196-eebc7a2e49ec",
					Name: "Area Knowledge: FDC",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "8337e83f-af9a-4396-9cbe-0e6679e15b4e",
					Name: "Area Knowledge: Hong Kong",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7041437e-b98b-4605-a95a-c93ed45f1de5",
					Name: "Area Knowledge: LA",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "eec57f7e-0e91-4a58-8b0e-5d3de98b7b44",
					Name: "Area Knowledge: Manhattan",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "8879baa1-4e10-4667-bd00-62f4f594dbbb",
					Name: "Area Knowledge: Neo-Tokyo",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "f9f9badb-0f5e-4662-8b34-fdd8e2994caa",
					Name: "Area Knowledge: Portland",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "822b059f-c132-45ee-8c0b-df6912d5c862",
					Name: "Area Knowledge: Seattle",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Auburn",
							},
							{
								Content: "Bellevue",
							},
							{
								Content: "Council Island",
							},
							{
								Content: "Downtown",
							},
							{
								Content: "Everett",
							},
							{
								Content: "Fort Lewis",
							},
							{
								Content: "Matrix Hot Spots",
							},
							{
								Content: "Puyallup",
							},
							{
								Content: "Redmond",
							},
							{
								Content: "Renton",
							},
							{
								Content: "Safe Houses",
							},
							{
								Content: "Snohomish",
							},
							{
								Content: "Outremer",
							},
							{
								Content: "Seattle Matrix",
							},
							{
								Content: "Salish-Shide",
							},
							{
								Content: "Tacoma",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "3f7935ef-dc5d-4b53-88ef-cb7db7cbe1a9",
					Name: "Art",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Da Vinci",
							},
							{
								Content: "Monet",
							},
							{
								Content: "Matisse",
							},
							{
								Content: "Michelangelo",
							},
							{
								Content: "Picasso",
							},
							{
								Content: "Rembrandt",
							},
							{
								Content: "Van Gogh",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "15f89f34-cdbd-4523-a1eb-4d8043252389",
					Name: "Athabaskan",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "bee29957-affb-4593-a4fe-002f6dd5be9c",
					Name: "Bars and Clubs",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Awakened",
							},
							{
								Content: "Biker",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Corporate",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Dwarf",
							},
							{
								Content: "Elf",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Gay",
							},
							{
								Content: "High-Class",
							},
							{
								Content: "Hotel",
							},
							{
								Content: "Jazz",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Low-Class",
							},
							{
								Content: "Mafia",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "Ork",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Piano",
							},
							{
								Content: "Pubs",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Rock",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Sports",
							},
							{
								Content: "Surge",
							},
							{
								Content: "Triad",
							},
							{
								Content: "Troll",
							},
							{
								Content: "Vory",
							},
							{
								Content: "Yakuza",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d6e4efdd-d0a2-4727-8425-b43e480b3256",
					Name: "Bengali",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "2d757c45-14af-43fb-98d4-0db9380ab073",
					Name: "Biology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Anatomy",
							},
							{
								Content: "Microbiology",
							},
							{
								Content: "Physiology",
							},
							{
								Content: "Parazoology",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "c0be1393-e4a1-4af6-8c0d-f9eef89a93b1",
					Name: "Zoology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "6331a44a-ad26-4b08-8b7a-2dbe3c2d0584",
					Name: "Black Markets",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "c52d63de-ddc0-477f-bf46-33002f8f4aaa",
					Name: "BTLs",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Bunraku",
							},
							{
								Content: "Calhots",
							},
							{
								Content: "Crime Fantasy",
							},
							{
								Content: "Drug Emulation",
							},
							{
								Content: "Historical Fantasy",
							},
							{
								Content: "Hot-Sim Pornography",
							},
							{
								Content: "Mind Control Chips",
							},
							{
								Content: "Power Fantasy",
							},
							{
								Content: "Reality Enhancer",
							},
							{
								Content: "Revenge Fantasy",
							},
							{
								Content: "Snuff",
							},
							{
								Content: "Soma Chips",
							},
							{
								Content: "Synesthesia",
							},
							{
								Content: "Ultraviolence",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a621ba8f-92e9-4032-b506-c1b2408dfa4e",
					Name: "Bulgarian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0a1dfc0e-dcb9-448d-a2d3-718670d79df1",
					Name: "Business",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Budgeting",
							},
							{
								Content: "Compliance",
							},
							{
								Content: "Digital Accountancy",
							},
							{
								Content: "Distribution",
							},
							{
								Content: "Finance",
							},
							{
								Content: "Manufacturing",
							},
							{
								Content: "Megacorp",
							},
							{
								Content: "People Management",
							},
							{
								Content: "Project Management",
							},
							{
								Content: "Reporting",
							},
							{
								Content: "Retail",
							},
							{
								Content: "Supply and Demand",
							},
							{
								Content: "Small Business",
							},
							{
								Content: "Time Management",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "dcf38896-6054-4ece-90e1-901352eb0201",
					Name: "Cantonese",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d5412408-46a4-4871-945e-7983ad43857e",
					Name: "Charity Shelters",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "aa6199a5-717e-42b8-984b-0dd2ccd5369f",
					Name: "Chemistry",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Industrial",
							},
							{
								Content: "Inorganic",
							},
							{
								Content: "Organic",
							},
							{
								Content: "Pharmaceuticals",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ac86aba3-a7d6-4938-b5f1-186955912643",
					Name: "Combat Tactics",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Ambush",
							},
							{
								Content: "Guerrilla",
							},
							{
								Content: "Hostage Rescue",
							},
							{
								Content: "Magic",
							},
							{
								Content: "Anti-Magic",
							},
							{
								Content: "Open Field",
							},
							{
								Content: "Outer Space",
							},
							{
								Content: "Terror",
							},
							{
								Content: "Underwater",
							},
							{
								Content: "Urban",
							},
							{
								Content: "Wilderness",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "47c41bfc-2cfa-47ca-b20e-ec3351979791",
					Name: "Critters",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Alligators",
							},
							{
								Content: "Barracudas",
							},
							{
								Content: "Bears",
							},
							{
								Content: "Boars",
							},
							{
								Content: "Chimpanzees",
							},
							{
								Content: "Cockroaches",
							},
							{
								Content: "Crows",
							},
							{
								Content: "Deer",
							},
							{
								Content: "Dogs",
							},
							{
								Content: "Dolphins",
							},
							{
								Content: "Domestic Cats",
							},
							{
								Content: "Eagles",
							},
							{
								Content: "Elephants",
							},
							{
								Content: "Ferrets",
							},
							{
								Content: "Giraffes",
							},
							{
								Content: "Great Cats",
							},
							{
								Content: "Horses",
							},
							{
								Content: "Killer Whales",
							},
							{
								Content: "Raccoons",
							},
							{
								Content: "Rats",
							},
							{
								Content: "Sea Lions",
							},
							{
								Content: "Sharks",
							},
							{
								Content: "Snakes",
							},
							{
								Content: "Spiders",
							},
							{
								Content: "Squids",
							},
							{
								Content: "Wolves",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "17c50e74-f009-4794-9dda-19062abb1d90",
					Name: "Croatian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "48bd3a3e-9ea8-425a-b2cd-c764479e9565",
					Name: "Crook Hangouts",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "FDC",
							},
							{
								Content: "High-Class",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Low-Class",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Seattle",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "878181d4-2f54-4993-ae30-06c9bf1ee11b",
					Name: "Danish",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "4fa93586-b5b4-4bf7-ad18-aacecc3a6894",
					Name: "Data Havens",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Hacking",
							},
							{
								Content: "Magic",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Shadows",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "5227212f-507d-4aa7-8894-7d35a1eb98cf",
					Name: "DIY",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Electronics",
							},
							{
								Content: "Carpentry",
							},
							{
								Content: "Plumbing",
							},
							{
								Content: "Sewing",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "be9be259-3109-489f-91d4-6e62e44f5ea3",
					Name: "Disease",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "c9ca1da3-11d0-4921-8a87-4726f342a04b",
					Name: "Drones",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Wheeled",
							},
							{
								Content: "Walker",
							},
							{
								Content: "Hovercraft",
							},
							{
								Content: "Tracked",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "b1d33738-a93a-46f3-a64a-0fc329ab1740",
					Name: "Economics",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Micro-economics",
							},
							{
								Content: "Macro-economics",
							},
							{
								Content: "Corporate",
							},
							{
								Content: "Tribal",
							},
							{
								Content: "Underworld",
							},
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "cbb44acf-10cd-4b67-afc6-bf28efe74ea4",
					Name: "Engineering",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Chemical",
							},
							{
								Content: "Civil",
							},
							{
								Content: "Electrical",
							},
							{
								Content: "Mechanical",
							},
							{
								Content: "Nuclear",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "907a3a8f-2c40-4543-a5a9-891bcde41f6b",
					Name: "English",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Cityspeak",
							},
							{
								Content: "Creole",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "f5a57bc4-8131-4a73-9c9a-03276d24a513",
					Name: "Eskimo-Aleut",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "b21c9f0f-9db0-4de1-b901-2a911d9abd62",
					Name: "Fashion",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Harajuku Scene",
							},
							{
								Content: "London Scene",
							},
							{
								Content: "New York Scene",
							},
							{
								Content: "Paris Scene",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "cee3de6f-4947-4947-b2e1-75fde02a5d78",
					Name: "Fashion Design",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Harajuku Scene",
							},
							{
								Content: "London Scene",
							},
							{
								Content: "New York Scene",
							},
							{
								Content: "Paris Scene",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "6d9880ee-c017-4e7f-a7ee-502eb542709b",
					Name: "Firearms",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Accessories",
							},
							{
								Content: "Ammunition",
							},
							{
								Content: "Automatics",
							},
							{
								Content: "Design",
							},
							{
								Content: "Heavy Weapons",
							},
							{
								Content: "History",
							},
							{
								Content: "Longarms",
							},
							{
								Content: "Modification",
							},
							{
								Content: "Pistols",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7ace94b0-ab82-446a-93d0-e1fdb380d1d8",
					Name: "Blade Design",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Accessories",
							},
							{
								Content: "Axes",
							},
							{
								Content: "Knives",
							},
							{
								Content: "Swords",
							},
							{
								Content: "Throwing Weapons",
							},
							{
								Content: "History",
							},
							{
								Content: "Modification",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a0ab7534-8f74-4690-be2b-040adc1413d7",
					Name: "Gun Trivia",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Accessories",
							},
							{
								Content: "Ammunition",
							},
							{
								Content: "Automatics",
							},
							{
								Content: "Design",
							},
							{
								Content: "Heavy Weapons",
							},
							{
								Content: "History",
							},
							{
								Content: "Longarms",
							},
							{
								Content: "Modification",
							},
							{
								Content: "Pistols",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "026062e0-9bdd-4a06-9cca-c3640c634cfd",
					Name: "French",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Creole",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7e1204ab-fc99-4453-9ec2-cc3f60ec2349",
					Name: "Gaming",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Dawn of Atlantis",
							},
							{
								Content: "Dark Eye",
							},
							{
								Content: "Grand Larceny",
							},
							{
								Content: "Killing Floor",
							},
							{
								Content: "Paranormal Crisis",
							},
							{
								Content: "Miracle Shooter",
							},
							{
								Content: "Spectrum Delta",
							},
							{
								Content: "SC IV: Protoss Gate",
							},
							{
								Content: "World of Shadows",
							},
							{
								Content: "Urban Brawl League 70",
							},
							{
								Content: "Guild Ages",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a1c95207-1864-4723-b26f-b0a8c5b6290d",
					Name: "Gangs",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Ancients",
							},
							{
								Content: "Area Boys",
							},
							{
								Content: "Cirque du Sorciere",
							},
							{
								Content: "Chaos Engine",
							},
							{
								Content: "Cocotona",
							},
							{
								Content: "Comando Verdge",
							},
							{
								Content: "Cutters",
							},
							{
								Content: "Desolation Angels",
							},
							{
								Content: "First Nations",
							},
							{
								Content: "Ghost Cartels",
							},
							{
								Content: "Halloweeners",
							},
							{
								Content: "Hell's Angels",
							},
							{
								Content: "Iron Crosses",
							},
							{
								Content: "Los Verdugos",
							},
							{
								Content: "Los Angeles Ardientes",
							},
							{
								Content: "Lynch Mob",
							},
							{
								Content: "Merlyns",
							},
							{
								Content: "Numbers Gang",
							},
							{
								Content: "Spikes",
							},
							{
								Content: "Steppin Wulfs",
							},
							{
								Content: "Thunder Boys",
							},
							{
								Content: "Yardies",
							},
							{
								Content: "Vikings",
							},
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a72084f6-3a4c-4c23-82aa-4697e543ee0b",
					Name: "German",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "85dc4a4c-57e2-4066-9de4-171f367a74ab",
					Name: "Ghost Cartels",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Turf",
							},
							{
								Content: "Politics",
							},
							{
								Content: "Signs",
							},
							{
								Content: "History",
							},
							{
								Content: "Organizations",
							},
							{
								Content: "Safe Houses",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "b4d3d48a-bff1-4303-ac69-4dd9269d1b2c",
					Name: "Hebrew",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "406ddc53-6635-4cd7-8ad0-90024b683492",
					Name: "Hindi-Urdu",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a68b4d38-9e7b-4f0d-be04-d28d2bec3803",
					Name: "History",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Ancient",
							},
							{
								Content: "Medieval",
							},
							{
								Content: "Modern",
							},
							{
								Content: "Art",
							},
							{
								Content: "Corporate",
							},
							{
								Content: "Military",
							},
							{
								Content: "Political",
							},
							{
								Content: "Religion",
							},
							{
								Content: "Social",
							},
							{
								Content: "Tribal",
							},
							{
								Content: "Underworld",
							},
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a03b153c-1f16-484c-b229-1090e61c1f92",
					Name: "Indonesian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "71407a60-c753-40d9-9d5b-416c43b51fef",
					Name: "Infected",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "c66aff30-b99b-47c3-94df-e5b4cc4e06d2",
					Name: "Iroquoian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "87627536-a185-427a-bb14-54a4ff89901c",
					Name: "Italian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "f876953e-a14e-4ca5-b454-b0090907da28",
					Name: "Japanese",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Cityspeak",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0ecbddff-4e99-485b-b54a-6c087c03f07b",
					Name: "Korean",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "bcf6bfe5-a454-43b3-9de0-bbdc7e18b5a5",
					Name: "Latin",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "cca8e4dc-4c67-45d2-bee6-57366d277206",
					Name: "Literature",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Japanese",
							},
							{
								Content: "Early Twentieth Century",
							},
							{
								Content: "Science Fiction",
							},
							{
								Content: "Poetry",
							},
							{
								Content: "Fiction",
							},
							{
								Content: "Romance",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7e942ac9-8c2c-4f7c-91d5-cfaf5d0e9262",
					Name: "Mafia",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Turf",
							},
							{
								Content: "Politics",
							},
							{
								Content: "Signs",
							},
							{
								Content: "History",
							},
							{
								Content: "Organizations",
							},
							{
								Content: "Safe Houses",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "f8a3a8da-e177-49c7-9b3d-2749fd3704cd",
					Name: "Magic Traditions",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Adepts",
							},
							{
								Content: "Shamans",
							},
							{
								Content: "Mages",
							},
							{
								Content: "Mystic Adepts",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0bbb3078-a940-4003-b4f3-fa23937cf227",
					Name: "Magical Theory (Academic)",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Sorcery",
							},
							{
								Content: "Conjuring",
							},
							{
								Content: "Enchanting",
							},
							{
								Content: "Foci",
							},
							{
								Content: "Astral World",
							},
							{
								Content: "Metaplanes",
							},
							{
								Content: "Initiation",
							},
							{
								Content: "Mentor Spirits",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "49f3497e-0111-42f3-8e36-6119a51995cd",
					Name: "Magical Theory (Street)",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Sorcery",
							},
							{
								Content: "Conjuring",
							},
							{
								Content: "Enchanting",
							},
							{
								Content: "Foci",
							},
							{
								Content: "Astral World",
							},
							{
								Content: "Metaplanes",
							},
							{
								Content: "Initiation",
							},
							{
								Content: "Mentor Spirits",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a1adb39d-6bac-4c10-a01e-692a4edac293",
					Name: "Magical Security",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Government",
							},
							{
								Content: "Military",
							},
							{
								Content: "Private",
							},
							{
								Content: "Home",
							},
							{
								Content: "[Corporation]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "9843709f-803a-4424-88a2-d972d3405955",
					Name: "Magical Threats",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Blood Magic",
							},
							{
								Content: "Toxic Magic",
							},
							{
								Content: "Insect Spirits",
							},
							{
								Content: "Shadow Spirits",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7f7fea00-e656-4c7c-afd3-03f34aafa9f4",
					Name: "Mandarin",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a02ee5ad-42a4-4f3c-8e9f-24730fadd440",
					Name: "Mathematics",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Arithmetic",
							},
							{
								Content: "Calculus",
							},
							{
								Content: "Geometry",
							},
							{
								Content: "Algebra",
							},
							{
								Content: "Number Theory",
							},
							{
								Content: "Game Theory",
							},
							{
								Content: "Graph Theory",
							},
							{
								Content: "Group Theory",
							},
							{
								Content: "Combinatorics",
							},
							{
								Content: "Statistics",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "95730d81-d189-4cbe-8ee7-23b62f6efdb6",
					Name: "Matrix Games",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Astral Dreams: Legend of Tenku",
							},
							{
								Content: "Awakening: 1949",
							},
							{
								Content: "Beat the Market",
							},
							{
								Content: "Dawn of Atlantis III",
							},
							{
								Content: "Dragon Storm",
							},
							{
								Content: "Fermat's Last Hermetic Equation",
							},
							{
								Content: "Galaxy Ten",
							},
							{
								Content: "Grand Larceny",
							},
							{
								Content: "Killing Floor",
							},
							{
								Content: "Life's a Bitch",
							},
							{
								Content: "Miracle Shooter",
							},
							{
								Content: "Noir Confidential",
							},
							{
								Content: "Run, Run Runner",
							},
							{
								Content: "Shadowrun Online",
							},
							{
								Content: "The Seelie Court",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "3b29366e-bbb9-43a7-9cbc-4c7c17a2bbb3",
					Name: "Mechanics",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Automotive",
							},
							{
								Content: "Aeronautic",
							},
							{
								Content: "Industrial",
							},
							{
								Content: "Nautical",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "58a3da0b-86da-48ec-953b-11ffcf6d283f",
					Name: "Military",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Air Force",
							},
							{
								Content: "Army",
							},
							{
								Content: "Coast Guard",
							},
							{
								Content: "Marines",
							},
							{
								Content: "Military Magic",
							},
							{
								Content: "Navy",
							},
							{
								Content: "Special Forces",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "05388bd3-e3c6-4d61-b902-72f8163a2134",
					Name: "Foreign Military",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Air Force",
							},
							{
								Content: "Army",
							},
							{
								Content: "Coast Guard",
							},
							{
								Content: "Marines",
							},
							{
								Content: "Military Magic",
							},
							{
								Content: "Navy",
							},
							{
								Content: "Special Forces",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "1862a5ed-7b7b-4fa8-bf25-5d10ec45223f",
					Name: "Military Vehicles",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Air Force",
							},
							{
								Content: "Army",
							},
							{
								Content: "Coast Guard",
							},
							{
								Content: "Marines",
							},
							{
								Content: "Navy",
							},
							{
								Content: "Special Forces",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0e5b89c5-1143-4e73-ab71-0700910fcaaa",
					Name: "Mixed Unit Tactics",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Aerial/Aircraft",
							},
							{
								Content: "Armored Infantry",
							},
							{
								Content: "Artillery",
							},
							{
								Content: "Naval",
							},
							{
								Content: "Mechanized Infantry",
							},
							{
								Content: "Standard Infantry",
							},
							{
								Content: "[Single Unit Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "8feeb71f-8864-4ece-88b2-52f77eb1851f",
					Name: "NAN Military",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Air Force",
							},
							{
								Content: "Army",
							},
							{
								Content: "Coast Guard",
							},
							{
								Content: "Marines",
							},
							{
								Content: "Military Magic",
							},
							{
								Content: "Navy",
							},
							{
								Content: "Special Forces",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "9cc48c53-ebc4-49a4-87b9-be0ec5efac0a",
					Name: "Peacekeepers",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Air Force",
							},
							{
								Content: "Army",
							},
							{
								Content: "Coast Guard",
							},
							{
								Content: "Marines",
							},
							{
								Content: "Military Magic",
							},
							{
								Content: "Navy",
							},
							{
								Content: "Special Forces",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a068c0d8-5c87-46f2-a13d-f981fda80a06",
					Name: "Tir Military Vehicles",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Air Force",
							},
							{
								Content: "Army",
							},
							{
								Content: "Coast Guard",
							},
							{
								Content: "Marines",
							},
							{
								Content: "Navy",
							},
							{
								Content: "Special Forces",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ee36423c-21c7-4af3-81da-93778da83a45",
					Name: "Club Music",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Astral Rock",
							},
							{
								Content: "Electron Wave",
							},
							{
								Content: "Goblin Rock",
							},
							{
								Content: "Powernoize",
							},
							{
								Content: "Rockabilly",
							},
							{
								Content: "Sinthcore",
							},
							{
								Content: "Wizpunk",
							},
							{
								Content: "Trash Metal Troll",
							},
							{
								Content: "Retro Gothic",
							},
							{
								Content: "Elven Rap",
							},
							{
								Content: "Neo-J Pop",
							},
							{
								Content: "Nova K Rock",
							},
							{
								Content: "Beatpace",
							},
							{
								Content: "Bugstomp",
							},
							{
								Content: "Fractal",
							},
							{
								Content: "Plex",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "516713c4-8022-46ea-b1d1-f843922731d4",
					Name: "National Threats",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "5ea73805-1e96-4770-afef-647322f1eeff",
					Name: "News",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Business",
							},
							{
								Content: "Entertainment",
							},
							{
								Content: "Health",
							},
							{
								Content: "Science/Environment",
							},
							{
								Content: "Sports",
							},
							{
								Content: "Technology",
							},
							{
								Content: "Underworld",
							},
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "3057f850-d7d8-4c5d-9315-556ebb12f0e1",
					Name: "Or'zet",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0b90b4b9-2290-45ad-9827-82fd0c6454be",
					Name: "Parazoology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Spirits",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "004ef112-3f24-4ca1-bc9c-b0e4229fc3b6",
					Name: "Persian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "5fc15c3f-7b1c-4b87-a469-ccefb7d60820",
					Name: "Polish",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "57090b04-5d4c-47ec-9cf3-9b414c40cb09",
					Name: "Politics",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Corporate",
							},
							{
								Content: "Military",
							},
							{
								Content: "Social",
							},
							{
								Content: "Tribal",
							},
							{
								Content: "Underworld",
							},
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
							{
								Content: "N. America",
							},
							{
								Content: "S. America",
							},
							{
								Content: "Central America",
							},
							{
								Content: "Antarctica",
							},
							{
								Content: "Africa",
							},
							{
								Content: "Western Europe",
							},
							{
								Content: "Eastern Europe",
							},
							{
								Content: "Northern Europe",
							},
							{
								Content: "Asia - Pacific",
							},
							{
								Content: "Asia - Minor",
							},
							{
								Content: "Middle East",
							},
							{
								Content: "Australia",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d11e8181-215e-41b3-8775-521b1d629123",
					Name: "Portuguese",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a8187f25-74d6-43f5-9a43-8d03cef04a6e",
					Name: "Punjabi",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "bce7ec73-39ef-43bf-a74f-8fa7627753ab",
					Name: "Religion",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Islam",
							},
							{
								Content: "Judaism",
							},
							{
								Content: "Buddhism",
							},
							{
								Content: "Christianity",
							},
							{
								Content: "Hinduism",
							},
							{
								Content: "Zoroastrianism",
							},
							{
								Content: "Shinto",
							},
							{
								Content: "Paganism",
							},
							{
								Content: "Taoism",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7ba1f555-f6b5-4d3a-b0f6-38f9a030b661",
					Name: "Russian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "09ae5c16-0b45-4ab9-9634-cab22ad781c4",
					Name: "Security Companies",
					Attribute: "LOG",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Lone Star",
							},
							{
								Content: "Knight Errant",
							},
							{
								Content: "Hard Corps",
							},
							{
								Content: "Minutemen Security",
							},
							{
								Content: "Seattle Sec Corps",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "3dc3854e-5d67-4ee8-8ffa-c637394859a6",
					Name: "Security Design",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Bank",
							},
							{
								Content: "Corporate",
							},
							{
								Content: "Government",
							},
							{
								Content: "Home",
							},
							{
								Content: "Public Event",
							},
							{
								Content: "Vehicle",
							},
							{
								Content: "VIP",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "86ac486a-6e5b-4c04-b575-f63beb10b809",
					Name: "Security Tactics",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Corporate",
							},
							{
								Content: "Crimson Rush",
							},
							{
								Content: "Entertainment",
							},
							{
								Content: "Government",
							},
							{
								Content: "Security Company",
							},
							{
								Content: "Rapid Response",
							},
							{
								Content: "Border Patrol",
							},
							{
								Content: "Customs",
							},
							{
								Content: "VIP",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "083e28e0-885a-4123-a8db-847c3509d14a",
					Name: "Sioux",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d06dfd90-1df0-4f05-84d5-1fea9d146f87",
					Name: "Small Unit Tactics",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Arctic",
							},
							{
								Content: "Desert",
							},
							{
								Content: "Forest",
							},
							{
								Content: "Jungle",
							},
							{
								Content: "Mountains",
							},
							{
								Content: "Urban",
							},
							{
								Content: "[Terrain]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "b6aa3faa-64e0-4323-9617-49add784064a",
					Name: "Spanish",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a364caab-f0bd-49b8-859e-1fa0d73c3c53",
					Name: "Sperethiel",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "67e74b72-7970-4243-ad68-4db92894a12d",
					Name: "Spirits",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Beast",
							},
							{
								Content: "Earth",
							},
							{
								Content: "Fire",
							},
							{
								Content: "Guardian",
							},
							{
								Content: "Guidance",
							},
							{
								Content: "Man",
							},
							{
								Content: "Plant",
							},
							{
								Content: "Task",
							},
							{
								Content: "Water",
							},
							{
								Content: "Watcher",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "219d4e62-a378-480d-ba6a-9278490e4539",
					Name: "Sports",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Baseball",
							},
							{
								Content: "Basketball",
							},
							{
								Content: "Boxing",
							},
							{
								Content: "Combat Biking",
							},
							{
								Content: "Court Ball",
							},
							{
								Content: "Drone Racing",
							},
							{
								Content: "Duello Magicae",
							},
							{
								Content: "E-Sports",
							},
							{
								Content: "Football",
							},
							{
								Content: "Hockey",
							},
							{
								Content: "Hoverball",
							},
							{
								Content: "Hurling",
							},
							{
								Content: "Piloted Racing",
							},
							{
								Content: "MMA",
							},
							{
								Content: "Soccer",
							},
							{
								Content: "Stickball",
							},
							{
								Content: "UFC",
							},
							{
								Content: "Underground Fighting",
							},
							{
								Content: "Urban Brawl",
							},
							{
								Content: "Wrestling",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0af06344-3637-4160-813b-a33dda2d16aa",
					Name: "Sprawl Life",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Scavenging",
							},
							{
								Content: "Soup Kitchens",
							},
							{
								Content: "Squats",
							},
							{
								Content: "Street Docs",
							},
							{
								Content: "Street Rumors",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d0f7dabe-667a-45b1-ab51-a17f463b1bb1",
					Name: "Smuggler Routes",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "4a046ac0-b5fe-40d8-9ec6-305ffbac189c",
					Name: "Smuggler Safe Houses",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "51ea095a-2f1f-4090-afcb-d2cbb88c8f91",
					Name: "Street Drugs",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Betel",
							},
							{
								Content: "Binaural Beats",
							},
							{
								Content: "BTLs",
							},
							{
								Content: "Cram",
							},
							{
								Content: "Deepweed",
							},
							{
								Content: "Novacoke",
							},
							{
								Content: "Spike",
							},
							{
								Content: "Tempo",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ac2d2cb7-e602-42cc-bc53-9bb45588244c",
					Name: "Strategy",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Logistics",
							},
							{
								Content: "Reconnaissance",
							},
							{
								Content: "Offensive",
							},
							{
								Content: "Defensive",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "19a3925e-7ae7-4037-9d59-de63a7ab7a92",
					Name: "Syndicates",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Personalities",
							},
							{
								Content: "Ghost Cartels",
							},
							{
								Content: "Mafia",
							},
							{
								Content: "Triad",
							},
							{
								Content: "Yakuza",
							},
							{
								Content: "Vory",
							},
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "f1714745-01ae-4d17-95a8-68c94cc48d58",
					Name: "Tamazight",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "bb231493-bc95-4783-8ad9-e66078ee31ef",
					Name: "Thai",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0e364dfa-7160-46a7-bd98-601afcc08dd5",
					Name: "Triads",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Turf",
							},
							{
								Content: "Politics",
							},
							{
								Content: "Signs",
							},
							{
								Content: "History",
							},
							{
								Content: "Organizations",
							},
							{
								Content: "Safe Houses",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "8f81d25b-a1e3-4d3a-8eea-ea66711a3454",
					Name: "Trids",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Action",
							},
							{
								Content: "Comedy",
							},
							{
								Content: "Cop",
							},
							{
								Content: "Documentary",
							},
							{
								Content: "Drama",
							},
							{
								Content: "Fantasy",
							},
							{
								Content: "Horror",
							},
							{
								Content: "Rom-Com",
							},
							{
								Content: "Sci-fi",
							},
							{
								Content: "Thriller",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "2ffc7361-466a-4f9e-a09c-f6c56046f2ef",
					Name: "Trideo Shows",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Action",
							},
							{
								Content: "Comedy",
							},
							{
								Content: "Cop",
							},
							{
								Content: "Documentary",
							},
							{
								Content: "Drama",
							},
							{
								Content: "Fantasy",
							},
							{
								Content: "Game Shows",
							},
							{
								Content: "Horror",
							},
							{
								Content: "Reality Shows",
							},
							{
								Content: "Rom-Com",
							},
							{
								Content: "Sci-fi",
							},
							{
								Content: "Thriller",
							},
							{
								Content: "BattleRun",
							},
							{
								Content: "Berlin Nights",
							},
							{
								Content: "Blood Runners",
							},
							{
								Content: "The Coffee Clutch",
							},
							{
								Content: "DASH: Star Loner!",
							},
							{
								Content: "Debonair Dave",
							},
							{
								Content: "Desert Wars",
							},
							{
								Content: "Dessert Wars",
							},
							{
								Content: "Dis is Uz",
							},
							{
								Content: "Granny Sweetspell's Magical Kitchen",
							},
							{
								Content: "Karl Kombatmage",
							},
							{
								Content: "Reloaded",
							},
							{
								Content: "The Master Wizard",
							},
							{
								Content: "Max Wild",
							},
							{
								Content: "A Murder to Kill For",
							},
							{
								Content: "Ningyo: The Digital",
							},
							{
								Content: "Geisha Diaries",
							},
							{
								Content: "On Point",
							},
							{
								Content: "Ork and Mindy",
							},
							{
								Content: "Polar Wars",
							},
							{
								Content: "Porky's Landing",
							},
							{
								Content: "Red Samurai Run",
							},
							{
								Content: "The Runners",
							},
							{
								Content: "Seas of Death: The Tale of Kane",
							},
							{
								Content: "Space Fleet",
							},
							{
								Content: "Street by Street",
							},
							{
								Content: "Temple Terror",
							},
							{
								Content: "The Wrong Shift",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "dad44f50-efc1-4dc9-a1ac-ca7d89a18218",
					Name: "Turkish",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "974e376f-5eec-4df8-b7d5-e53e900058e9",
					Name: "Undead",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "5c3ebb6f-d075-4486-8900-d7a19bae958f",
					Name: "Underworld",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Arson",
							},
							{
								Content: "Black Magic",
							},
							{
								Content: "Black Market Pipeline",
							},
							{
								Content: "Blackmail",
							},
							{
								Content: "BTL",
							},
							{
								Content: "Counterfeiting",
							},
							{
								Content: "Drugs",
							},
							{
								Content: "Drug Dealers",
							},
							{
								Content: "Fencing",
							},
							{
								Content: "Financial Crime",
							},
							{
								Content: "Fixing",
							},
							{
								Content: "Forgery",
							},
							{
								Content: "Gambling",
							},
							{
								Content: "Grifting",
							},
							{
								Content: "Hijacking",
							},
							{
								Content: "Illegal Goods",
							},
							{
								Content: "Kidnapping",
							},
							{
								Content: "Loansharking",
							},
							{
								Content: "Local Runners",
							},
							{
								Content: "Medicine",
							},
							{
								Content: "Matrix Crime",
							},
							{
								Content: "Money Laundering",
							},
							{
								Content: "Organleggers",
							},
							{
								Content: "Pornography",
							},
							{
								Content: "Prostitution",
							},
							{
								Content: "Protection",
							},
							{
								Content: "Robbery",
							},
							{
								Content: "Smugglers",
							},
							{
								Content: "Smuggling",
							},
							{
								Content: "Talislegger",
							},
							{
								Content: "Tamanous groups",
							},
							{
								Content: "White Collar",
							},
							{
								Content: "Wetwork",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "250f080a-9a79-4e8b-8980-d19bef402852",
					Name: "Vory",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Turf",
							},
							{
								Content: "Politics",
							},
							{
								Content: "Signs",
							},
							{
								Content: "History",
							},
							{
								Content: "Organizations",
							},
							{
								Content: "Safe Houses",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "20041f7e-7725-403e-8771-0904090bdfd1",
					Name: "Wu",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ea024ba4-dabf-4da5-be96-a1bccfead27e",
					Name: "Xiang",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "e216aad1-15fa-48c5-9d0e-0c6a92e819e0",
					Name: "Yakuza",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Turf",
							},
							{
								Content: "Politics",
							},
							{
								Content: "Signs",
							},
							{
								Content: "History",
							},
							{
								Content: "Organizations",
							},
							{
								Content: "Safe Houses",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "99d3b5ed-7862-410f-b3d9-ca7427bc2791",
					Name: "Astronomy",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Comets",
							},
							{
								Content: "Mars",
							},
							{
								Content: "Moon",
							},
							{
								Content: "Stars",
							},
							{
								Content: "[category]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "37013018-70bd-4016-827c-c366949622f5",
					Name: "Awakened Hangouts",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "63bb99a1-457c-4ee6-ab63-05267b0b0e09",
					Name: "City Speak",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a7d0c675-ca0d-4df0-9023-b03674d79d0e",
					Name: "Classical Music",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Ballet",
							},
							{
								Content: "Baroque",
							},
							{
								Content: "Chamber Music",
							},
							{
								Content: "Medieval",
							},
							{
								Content: "Opera",
							},
							{
								Content: "Orchestral",
							},
							{
								Content: "Renaissance",
							},
							{
								Content: "[music style]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "40829746-9376-4a0a-a80c-25c3767582df",
					Name: "Codes",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Mathematical",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "678da16f-6446-4e0c-8bef-cc1d619e1d1a",
					Name: "Connoisseur",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Fine Arts",
							},
							{
								Content: "Beers",
							},
							{
								Content: "Cuisines",
							},
							{
								Content: "Cuisine (Aztlaner)",
							},
							{
								Content: "Cuisine (French)",
							},
							{
								Content: "Cuisine (Italian)",
							},
							{
								Content: "Teas",
							},
							{
								Content: "Wines",
							},
							{
								Content: "Wine (Elven)",
							},
							{
								Content: "[Cuisine, Wine]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d9c2e7c4-b9c6-4904-b4a4-56ecca7c9530",
					Name: "Corporation: Ares Macrotechnology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Damien Knight",
							},
							{
								Content: "Ares Arms",
							},
							{
								Content: "AresSpace",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "50a4cbd7-a0f7-474a-97ae-a781320d6780",
					Name: "Corporation: Aztechnology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "987d7063-73ec-4170-beb2-1851c0dd7cee",
					Name: "Corporation: Evo",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "CrashCart Medical Services",
							},
							{
								Content: "Red Star Clinics",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "6a3bd597-09e5-45ba-8719-d4eda627e780",
					Name: "Corporation: Horizon Group",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "dd4779db-4c54-4fa3-b56c-7caf0ba6926b",
					Name: "Corporation: Mitsuhama Computer Technologies",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Magical Goods and Services",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ee28a346-d0a8-476e-93a9-6db56ae4b298",
					Name: "Corporation: NeoNET",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "603f7245-62ef-477e-923e-f8a4681dec35",
					Name: "Corporation: Renraku Computer Systems",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Haruhiko Nakada",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "8db5cc64-5dc4-4ae9-a56b-e0c54a6e2413",
					Name: "Corporation: Saeder-Krupp",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Saeder-Krupp Heavy Industries",
							},
							{
								Content: "Saeder-Krupp Prime ",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "03707f22-bebe-469a-817b-f6dfd4d7d6a1",
					Name: "Corporation: Shiawase",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "c9826bde-bb0b-4e45-9348-aa77546dfc7c",
					Name: "Corporation: Wuxing, Inc.",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Magical Goods and Services",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "44181f85-9472-4ab6-8da7-d4d2aeb38a96",
					Name: "Corporation: Brackhaven Investments",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Kenneth Brackhaven",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7592dc37-0d4f-4790-a1a8-188601b0d137",
					Name: "Corporation: DocWagon",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Denny Coleman",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0346bd5b-4a87-47b9-86de-9b322ef0a2c7",
					Name: "Corporation: Federated-Boeing",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7d76f579-eec5-4521-a7bb-c4dedfd85af4",
					Name: "Corporation: Gaeatronics",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "dc767e9a-796a-494a-b200-d018efd4fa49",
					Name: "Corporation: Global Technologies",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "23efe0de-0830-40f4-ab54-ee5e324b31e9",
					Name: "Corporation: Knight Errant",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Damien Knight",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d62f9a9e-9614-4421-a70c-b20b0f60641e",
					Name: "Corporation: Kong-Walmart",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "43378bcc-7ca9-4f26-9ee5-8bbc69953628",
					Name: "Corporation: Lone Star Security Services",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Chicago Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "183d5e40-4c27-4068-a30d-e75176f4da67",
					Name: "Corporation: Regency MegaMedia",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a142e6ff-b97c-4cf6-9fbc-caebe1c3ba9f",
					Name: "Corporation: Stuffer Shack",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "eb92764d-5dff-4454-88a0-f7c8233c9016",
					Name: "Corporation: Telestrian Industries Corporation",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "0b1dfbba-c787-4455-95e0-0b87b885011b",
					Name: "Corporation: Universal Omnitech",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Ingersoll and Berkley",
							},
							{
								Content: "Seattle Operations",
							},
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "cb35837e-09bd-4c53-96de-6fbd92b3d99f",
					Name: "Corporation: Zurich-Orbit Gemeinschaft Bank (ZOG)",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Corporate Finances",
							},
							{
								Content: "Corporate Politics",
							},
							{
								Content: "Corporate Rumors",
							},
							{
								Content: "Corporate Security",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "decebd3c-5fb0-426e-8e9c-431e0fa3b880",
					Name: "Creole",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "94f7ee6d-e79d-4236-9787-c7bc45727e9f",
					Name: "Cybertechnology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Cyberware",
							},
							{
								Content: "Cyberware Design",
							},
							{
								Content: "SOTA",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d768f35f-9c1f-4792-a609-9f7c61aea557",
					Name: "Entertainment",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Classical Music",
							},
							{
								Content: "Kaiju Monster Movies",
							},
							{
								Content: "Music",
							},
							{
								Content: "Neo-Classical Music",
							},
							{
								Content: "Sports",
							},
							{
								Content: "[Gambling]",
							},
							{
								Content: "[Pornography]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "2d74b337-f0c4-465c-a03a-23af8d93082b",
					Name: "Fight Clubs",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "FDC",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Seattle",
							},
							{
								Content: "Saskatoon",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Algonkian-Manitou Council",
							},
							{
								Content: "Athabaskan Council",
							},
							{
								Content: "Amazonia",
							},
							{
								Content: "Aztlan",
							},
							{
								Content: "Caribbean League",
							},
							{
								Content: "California Free State",
							},
							{
								Content: "Pueblo Corporate Council",
							},
							{
								Content: "CAS",
							},
							{
								Content: "UCAS",
							},
							{
								Content: "Quebec",
							},
							{
								Content: "Salish-Shidhe Council",
							},
							{
								Content: "Sioux",
							},
							{
								Content: "Tir Tairngire",
							},
							{
								Content: "Tsimshian Protectorate",
							},
							{
								Content: "Yucatan",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "abeaf83e-edeb-4780-baff-4662e73ea8e6",
					Name: "Farming",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Organic",
							},
							{
								Content: "Factory",
							},
							{
								Content: "Awakened",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "487f0a4f-584d-484f-8778-942c5ecda065",
					Name: "Forensics",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Cleaning",
							},
							{
								Content: "Thaumaturgic",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "cd7444d3-8eb4-41f7-a8a9-753df5958d0c",
					Name: "Foster System",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "UCAS",
							},
							{
								Content: "CAS",
							},
							{
								Content: "[Jurisdiction]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "fe04fd63-2d4f-4046-8356-0bad4d251e50",
					Name: "Journalism",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Investigative",
							},
							{
								Content: "Editorial",
							},
							{
								Content: "Print",
							},
							{
								Content: "Trid",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "e48a5194-57e7-420a-b176-5f51bdb235c4",
					Name: "Megacorp Law (Street)",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Contracts",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "227bcaa5-0cc0-4f85-99e6-345a5d7e696d",
					Name: "Law",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Contracts",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d6304862-cfa6-4916-aee1-40789798b590",
					Name: "Matrix",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Host Design",
							},
							{
								Content: "Host Networking",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "cb491fb5-2fa9-422e-b572-9ff84fcd5616",
					Name: "Matrix Threats",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Protosapients",
							},
							{
								Content: "Xenosapients",
							},
							{
								Content: "Technocritters",
							},
							{
								Content: "Dissonant Technomancers",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "4dd0d947-b1e1-471b-bfc0-9ba8ecd827dc",
					Name: "Magical Law",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Contracts",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "e93e443e-7b21-41f7-9f8e-ba316b1e385a",
					Name: "Metahumans",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Dwarves",
							},
							{
								Content: "Elves",
							},
							{
								Content: "Humans",
							},
							{
								Content: "Orks",
							},
							{
								Content: "Trolls",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a2a68932-b602-4387-931b-03b2408a416d",
					Name: "Medicine",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Field Medicine",
							},
							{
								Content: "Medical Advances",
							},
							{
								Content: "Technology",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "85334671-01ec-42ef-9908-dae556376a2c",
					Name: "Psychology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Mental Illnesses",
							},
							{
								Content: "Mental Reprogramming",
							},
							{
								Content: "Xenosapient",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "2d107401-7319-4b41-8800-e0cbdf7251f0",
					Name: "Sociology",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Cultural",
							},
							{
								Content: "Medical",
							},
							{
								Content: "Behavioral",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Political",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a69c0dc0-891d-4d06-8fd4-0312b1288c0c",
					Name: "Philosophy",
					Attribute: "LOG",
					Category: "Academic",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Christian",
							},
							{
								Content: "Buddhist",
							},
							{
								Content: "Taoist",
							},
							{
								Content: "Confucian",
							},
							{
								Content: "Kantian",
							},
							{
								Content: "Socialist",
							},
							{
								Content: "Fascist",
							},
							{
								Content: "Utilitarian",
							},
							{
								Content: "Existentialist",
							},
							{
								Content: "Rationalist",
							},
							{
								Content: "Anti-Rationalist",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "4df60d90-2b0a-414c-955e-f52a57ff9760",
					Name: "Neo-Classical Music",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Rock n Roll",
							},
							{
								Content: "The (19)60's",
							},
							{
								Content: "The (19)70's",
							},
							{
								Content: "Early Millennial",
							},
							{
								Content: "Mid-century",
							},
							{
								Content: "[musical era]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "d232a676-7550-4e5a-8b5a-57417bb8038d",
					Name: "Organized Crime: Chicago",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Turf",
							},
							{
								Content: "Politics",
							},
							{
								Content: "Signs",
							},
							{
								Content: "History",
							},
							{
								Content: "Organizations",
							},
							{
								Content: "Safe Houses",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "8ba59909-186d-4629-97ee-62880189b5c3",
					Name: "Police Procedures (Professional)",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Government",
							},
							{
								Content: "Military Security Design",
							},
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Military",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Private",
							},
							{
								Content: "Home",
							},
							{
								Content: "[Corporation]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "a9ba4d49-7a9c-4d3f-9e71-99ef8458ca5f",
					Name: "Police Procedures (Street)",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Government",
							},
							{
								Content: "Military Security Design",
							},
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Military",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Private",
							},
							{
								Content: "Home",
							},
							{
								Content: "[Corporation]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "8a82edaa-9ff0-447d-acb7-3a72a8bcfb9f",
					Name: "Security Procedures",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Government",
							},
							{
								Content: "Military Security Design",
							},
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Military",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Private",
							},
							{
								Content: "Home",
							},
							{
								Content: "[Corporation]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "af8ea3b6-5ffd-41b6-892a-7e77ee8e247a",
					Name: "Law Enforcement Procedures (Professional)",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Government",
							},
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Military",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Private",
							},
							{
								Content: "[Corporation]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "687a25c8-2f47-40fd-a9f8-a44bedb2c1f3",
					Name: "Law Enforcement Procedures (Street)",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Government",
							},
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Military",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Private",
							},
							{
								Content: "[Corporation]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "31357280-24e0-4146-b5ee-ad532decaa5e",
					Name: "Government Procedures",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Bureaucratic",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "1d68ed58-91ff-495a-a456-2bc04d82a3b7",
					Name: "Lone Star Procedures",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Government",
							},
							{
								Content: "Magical",
							},
							{
								Content: "Matrix",
							},
							{
								Content: "Physical",
							},
							{
								Content: "Home",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "c345b536-1406-4d32-9ae1-0fc5002cd9c5",
					Name: "Politics: UCAS",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Presidential",
							},
							{
								Content: "Congressional",
							},
							{
								Content: "[state, party, lobby group]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "519e73c7-d1d4-4c53-9654-e4974f9e531b",
					Name: "Popular Culture",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "9176d81a-ac8b-4168-afe6-affd4bb9514e",
					Name: "Popular Music",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Dwarven Punkbilly",
							},
							{
								Content: "Modern Punk",
							},
							{
								Content: "Feathercore",
							},
							{
								Content: "Beatpace",
							},
							{
								Content: "Bugstomp",
							},
							{
								Content: "Fractal",
							},
							{
								Content: "Plex",
							},
							{
								Content: "[genre]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "06c125c8-01cc-40ba-9a11-2fdad092398f",
					Name: "Radical Groups",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Alamos 20K",
							},
							{
								Content: "Ex Pacis",
							},
							{
								Content: "GreenWar",
							},
							{
								Content: "Logos",
							},
							{
								Content: "Neo-Anarchist Movement",
							},
							{
								Content: "Seed",
							},
							{
								Content: "TerraFirst!",
							},
							{
								Content: "[group]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "85a3fe58-b638-4272-949e-bd7549e32e00",
					Name: "Runner Hangouts",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Atlanta",
							},
							{
								Content: "Cheyenne",
							},
							{
								Content: "Chicago",
							},
							{
								Content: "Denver",
							},
							{
								Content: "FDC",
							},
							{
								Content: "High-Class",
							},
							{
								Content: "Hong Kong",
							},
							{
								Content: "LA",
							},
							{
								Content: "Low-Class",
							},
							{
								Content: "Manhattan",
							},
							{
								Content: "Portland",
							},
							{
								Content: "Quebec City",
							},
							{
								Content: "Sacramento",
							},
							{
								Content: "Seattle",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "79a0069c-4517-4698-91b5-3d24b928c5ee",
					Name: "Salish",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "1708eff8-a7fe-491f-b349-a6130c83e8d0",
					Name: "Serbo-Croatian",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "fe3ccfd5-9e14-4e0a-962d-f9601fc24950",
					Name: "Shadow Community",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Turf",
							},
							{
								Content: "Politics",
							},
							{
								Content: "History",
							},
							{
								Content: "Organizations",
							},
							{
								Content: "Safe Houses",
							},
							{
								Content: "News",
							},
							{
								Content: "Personalities",
							},
							{
								Content: "Rumors",
							},
							{
								Content: "Famous Shadowrunners",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "4c0b7b81-5dd4-4247-82da-88161992a374",
					Name: "Aztlaner Spanish",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "39f7b0cb-dd7c-4196-808b-8910119ea884",
					Name: "Street Gangs: Seattle",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "405 Hellhounds",
							},
							{
								Content: "Ancients",
							},
							{
								Content: "Black Rains",
							},
							{
								Content: "Blood Mountains Boys",
							},
							{
								Content: "Bloody Screamers",
							},
							{
								Content: "Brain Eaters",
							},
							{
								Content: "Crimson Crush",
							},
							{
								Content: "Disassemblers",
							},
							{
								Content: "First Nations",
							},
							{
								Content: "Forever Tacoma",
							},
							{
								Content: "Halloweeners",
							},
							{
								Content: "Kabuki Ronin",
							},
							{
								Content: "Lake Acids",
							},
							{
								Content: "Leather Devils",
							},
							{
								Content: "Night Hunters",
							},
							{
								Content: "Nova Rich",
							},
							{
								Content: "Princes",
							},
							{
								Content: "Reality Hackers",
							},
							{
								Content: "Red Hot Nukes",
							},
							{
								Content: "Red Rovers",
							},
							{
								Content: "Rusted Stilettos",
							},
							{
								Content: "Scatterbrains",
							},
							{
								Content: "Spiders",
							},
							{
								Content: "Spikes",
							},
							{
								Content: "The Ragers",
							},
							{
								Content: "Troll Killers",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ea016ac9-8000-4cb3-ae84-102e9c989667",
					Name: "Telesma",
					Attribute: "LOG",
					Category: "Professional",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "[Focus Type]",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "9d03c940-d018-40eb-8273-c33215de3948",
					Name: "Tlingit",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "ca63887a-1cee-4364-8fb9-126aa3526908",
					Name: "Triads: Hong Kong",
					Attribute: "INT",
					Category: "Street",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Black Chrysanthemums",
							},
							{
								Content: "Red Dragons",
							},
							{
								Content: "Yellow Lotus",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "7dd3d095-fdfb-4d95-b910-205f6e980434",
					Name: "Tsimshianic",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "3fcfdd55-03f6-4e08-aaa6-6c98f15b1cd3",
					Name: "Uto-Aztecan",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "4e62ab4f-4877-4a7f-bcb9-3023fc443078",
					Name: "Vehicles",
					Attribute: "INT",
					Category: "Interest",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Military",
							},
							{
								Content: "Aircraft",
							},
							{
								Content: "Bikes",
							},
							{
								Content: "Boats",
							},
							{
								Content: "Cars",
							},
							{
								Content: "Spacecraft",
							},
							{
								Content: "Trains",
							},
							{
								Content: "Trucks",
							},
							{
								Content: "Vintage Cars",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "53b99129-39d5-4bc4-9815-6bab79144c7c",
					Name: "Yiddish",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
				{
					ID: "037f8de4-9485-4efe-8e93-d7b929c62b29",
					Name: "Zuni",
					Attribute: "INT",
					Category: "Language",
					Default: "False",
					SkillGroup: "",
					Specs: Specs{
						Spec: []Spec{
							{
								Content: "Read/Write",
							},
							{
								Content: "Speak",
							},
							{
								Content: "[Dialect]",
							},
							{
								Content: "[Lingo]",
							},
							{
								Content: "Street",
							},
							{
								Content: "l33tspeak",
							},
							{
								Content: "Milspec",
							},
							{
								Content: "Corp",
							},
							{
								Content: "Orbital",
							},
						},
					},
					SourceReference: common.SourceReference{
						Source: "",
						Page: "",
					},
				},
			},
		},
	},
}

// GetSkillsData returns the loaded skills data.
func GetSkillsData() *SkillsChummer {
	return skillsData
}
