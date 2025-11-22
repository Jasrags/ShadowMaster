package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Code generated from traditions.xml. DO NOT EDIT.

var traditionsData = &TraditionsChummer{
	Version: 0,
	Traditions: Traditions{
		Tradition: []Tradition{
			{
				ID: "616ba093-306c-45fc-8f41-0b98c8cccb46",
				Name: "Custom",
				Drain: "",
				Source: "SR5",
				Page: 279,
				Spirits: TraditionSpirits{
				},
			},
			{
				ID: "19320625-bc1a-492f-8904-da6a847e5700",
				Name: "Hermetic",
				Drain: "{WIL} + {LOG}",
				Source: "SR5",
				Page: 279,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Spirit of Man"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "8d185e0e-5f49-4992-babd-d1ac9c848f68",
				Name: "Shamanic",
				Drain: "{WIL} + {CHA}",
				Source: "SR5",
				Page: 279,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "4fba452f-a240-4530-82b6-5ffd4bb83f28",
				Name: "Aztec",
				Drain: "{WIL} + {CHA}",
				Source: "SG",
				Page: 41,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Fire"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Beasts"),
				},
			},
			{
				ID: "66ceefed-2cb1-4027-96ca-756ab4eed7ad",
				Name: "Black Magic",
				Drain: "{WIL} + {CHA}",
				Source: "SG",
				Page: 41,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "09843ed9-6fd1-4c43-9e9f-f6d66493ebdc",
				Name: "Black Magic [Alt]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 61,
				Bonus: &common.BaseBonus{
					Addqualities: &common.Addqualities{},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "a283220f-2197-4526-b15a-331b9185b326",
				Name: "Buddhism",
				Drain: "{WIL} + {INT}",
				Source: "SG",
				Page: 43,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Air"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Fire"),
					SpiritManipulation: stringPtr("Spirit of Water"),
				},
			},
			{
				ID: "20b8e39f-a956-49bd-b417-6e1bd4a14604",
				Name: "Chaos Magic",
				Drain: "{WIL} + {INT}",
				Source: "SG",
				Page: 44,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Man"),
					SpiritManipulation: stringPtr("Spirit of Water"),
				},
			},
			{
				ID: "5d98ea69-29b1-4fb4-b9f3-56396d1dce16",
				Name: "Christian Theurgy",
				Drain: "{WIL} + {CHA}",
				Source: "SG",
				Page: 44,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Air"),
					SpiritIllusion: stringPtr("Spirit of Earth"),
					SpiritManipulation: stringPtr("Guidance Spirit"),
				},
			},
			{
				ID: "fb6f9683-47bb-4b04-9d15-4b59a003bf69",
				Name: "Druid",
				Drain: "{WIL} + {INT}",
				Source: "SG",
				Page: 45,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "2c924aa1-2298-4b02-b28b-946d0769dbd3",
				Name: "Hinduism",
				Drain: "{WIL} + {LOG}",
				Source: "SG",
				Page: 46,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "9acc0a3e-3209-4274-9c98-4cbc42c456a7",
				Name: "Islam",
				Drain: "{WIL} + {LOG}",
				Source: "SG",
				Page: 46,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "7f6073fd-e7f3-41f5-a40f-2a5b1cde382e",
				Name: "Path of the Wheel",
				Drain: "{WIL} + {CHA}",
				Source: "SG",
				Page: 47,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Earth"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Spirit of Air"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "c3604051-9f2b-4cc3-9525-f3029c611926",
				Name: "Qabbalism",
				Drain: "{WIL} + {LOG}",
				Source: "SG",
				Page: 48,
				SpiritForm: stringPtr("Possession"),
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Air"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Spirit of Fire"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Task Spirit"),
				},
			},
			{
				ID: "93604cb7-2e12-47be-9c2d-4b227439f07b",
				Name: "Quimbanda",
				Drain: "{WIL} + {CHA}",
				Source: "SFME",
				Page: 13,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "9abbebc1-48a3-4dde-960a-af565b163a3d",
				Name: "Shinto",
				Drain: "{WIL} + {CHA}",
				Source: "SG",
				Page: 48,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Air"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Beasts"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "e548b126-5df3-4da5-a603-c0b6b252e982",
				Name: "Sioux",
				Drain: "{WIL} + {INT}",
				Source: "SG",
				Page: 49,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Plant Spirit"),
					SpiritHealth: stringPtr("Spirit of Fire"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Guardian Spirit"),
				},
			},
			{
				ID: "8A0D8BC6-47AC-4043-A916-E2681A4D5BD7",
				Name: "Toxic",
				Drain: "",
				Source: "SG",
				Page: 84,
				Bonus: &common.BaseBonus{
					Limitspiritcategory: &common.Limitspiritcategory{},
				},
				Spirits: TraditionSpirits{
				},
			},
			{
				ID: "35ecfae9-0c2d-4084-a899-e91c230e209d",
				Name: "Vodou",
				Drain: "{WIL} + {CHA}",
				Source: "SG",
				Page: 50,
				SpiritForm: stringPtr("Possession"),
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Man"),
					SpiritIllusion: stringPtr("Guidance Spirit"),
					SpiritManipulation: stringPtr("Task Spirit"),
				},
			},
			{
				ID: "24601762-ef67-44d8-b974-03f626db848a",
				Name: "Wicca, Gardnerian",
				Drain: "{WIL} + {LOG}",
				Source: "SG",
				Page: 50,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "895b2dd2-f401-477e-9cb5-a5620598582e",
				Name: "Wicca, Goddess",
				Drain: "{WIL} + {INT}",
				Source: "SG",
				Page: 50,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "0cd0412c-cba4-4417-bc8f-f785fa5b821d",
				Name: "Wuxing",
				Drain: "{WIL} + {LOG}",
				Source: "SG",
				Page: 51,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Guidance Spirit"),
				},
			},
			{
				ID: "9f4bae13-56fd-43ac-a6aa-8e2384018065",
				Name: "Zoroastrianism",
				Drain: "{WIL} + {LOG}",
				Source: "SG",
				Page: 52,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Man"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Fire"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Plant Spirit"),
				},
			},
			{
				ID: "0d13bad3-9fa2-45fb-879c-068916944e1b",
				Name: "Insect Shaman",
				Drain: "{WIL} + {INT}",
				Source: "SG",
				Page: 94,
				SpiritForm: stringPtr("Inhabitation"),
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Soldier Spirit"),
					SpiritDetection: stringPtr("Scout Spirit"),
					SpiritHealth: stringPtr("Caretaker Spirit"),
					SpiritIllusion: stringPtr("Nymph Spirit"),
					SpiritManipulation: stringPtr("Worker Spirit"),
				},
			},
			{
				ID: "b8b6ba39-5f5e-4581-9145-6409bd59776c",
				Name: "Aboriginal",
				Drain: "{WIL} + {CHA}",
				Source: "SSP",
				Page: 3,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Guidance Spirit"),
					SpiritManipulation: stringPtr("Spirit of Air"),
				},
			},
			{
				ID: "30109563-d9cb-4ced-b06b-6c3d0c4f5a34",
				Name: "Egyptian",
				Drain: "{WIL} + {INT}",
				Source: "SSP",
				Page: 3,
				SpiritForm: stringPtr("Possession"),
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Spirit of Air"),
					SpiritIllusion: stringPtr("Guidance Spirit"),
					SpiritManipulation: stringPtr("Spirit of Water"),
				},
			},
			{
				ID: "43bc28ad-8818-4062-9b55-317f45d1e04e",
				Name: "Norse",
				Drain: "{WIL} + {LOG}",
				Source: "SSP",
				Page: 4,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "cc9f9b43-ef41-4581-8f9c-e1000e5a1578",
				Name: "Psionic",
				Drain: "{WIL} + {INT}",
				Source: "SSP",
				Page: 5,
				SpiritForm: stringPtr("Possession"),
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Spirit of Man"),
					SpiritIllusion: stringPtr("Guidance Spirit"),
					SpiritManipulation: stringPtr("Task Spirit"),
				},
			},
			{
				ID: "acbf5a08-cd21-410d-8d04-4e12cca8a927",
				Name: "Obeah",
				Drain: "{WIL} + {CHA}",
				Source: "HT",
				Page: 130,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Man"),
					SpiritIllusion: stringPtr("Guidance Spirit"),
					SpiritManipulation: stringPtr("Task Spirit"),
				},
			},
			{
				ID: "81789f32-779d-488e-ac76-d1005b5a2d2a",
				Name: "Santeria",
				Drain: "{WIL} + {INT}",
				Source: "HT",
				Page: 130,
				SpiritForm: stringPtr("Possession"),
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guidance Spirit"),
					SpiritDetection: stringPtr("Guardian Spirit"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Man"),
					SpiritManipulation: stringPtr("Spirit of Water"),
				},
			},
			{
				ID: "8b7a391e-8d4c-40e8-93a8-9dd031cce0f5",
				Name: "Buddhism [Traditionalist]",
				Drain: "{WIL} + {INT}",
				Source: "FA",
				Page: 62,
				Bonus: &common.BaseBonus{
					Addqualities: &common.Addqualities{},
					Skillgroupdisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Air"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Fire"),
					SpiritManipulation: stringPtr("Spirit of Water"),
				},
			},
			{
				ID: "dd97bcc9-a731-41fb-a558-9175bc56b587",
				Name: "Christian Theurgy [Traditional]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 64,
				Bonus: &common.BaseBonus{
					Addmetamagic: []common.Addmetamagic{
						// 1 items omitted
					},
					Skilldisable: []string{
						// 1 items omitted
					},
					Skillgroupdisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Air"),
					SpiritIllusion: stringPtr("Spirit of Earth"),
					SpiritManipulation: stringPtr("Guidance Spirit"),
				},
			},
			{
				ID: "ca673acd-961e-4491-8a8d-ddf0c577441b",
				Name: "Christian Theurgy [Vigila Evangelica]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 64,
				Bonus: &common.BaseBonus{
					Addmetamagic: []common.Addmetamagic{
						// 1 items omitted
					},
					Addqualities: &common.Addqualities{},
					Skilldisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Air"),
					SpiritIllusion: stringPtr("Spirit of Earth"),
					SpiritManipulation: stringPtr("Guidance Spirit"),
				},
			},
			{
				ID: "3a7bf066-7b13-4a92-ae31-37a58f84bc8e",
				Name: "Christian Theurgy [Westphalian]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 64,
				Bonus: &common.BaseBonus{
					Addmetamagic: []common.Addmetamagic{
						// 1 items omitted
					},
					Addqualities: &common.Addqualities{},
					Limitspellcategory: []common.Limitspellcategory{
						// 2 items omitted
					},
					Specificskill: []common.Specificskill{
						// 1 items omitted
					},
					Skilldisable: []string{
						// 2 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Air"),
					SpiritIllusion: stringPtr("Spirit of Earth"),
					SpiritManipulation: stringPtr("Guidance Spirit"),
				},
			},
			{
				ID: "54944188-d58b-4a45-859c-d62be9f966c2",
				Name: "Cosmic",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 75,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Earth"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Spirit of Water"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "9394d173-eee7-4e5a-b520-edfdfac3cf8b",
				Name: "Draconic",
				Drain: "{WIL} + {MAG}",
				Source: "FA",
				Page: 76,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("All"),
					SpiritDetection: stringPtr("All"),
					SpiritHealth: stringPtr("All"),
					SpiritIllusion: stringPtr("All"),
					SpiritManipulation: stringPtr("All"),
				},
			},
			{
				ID: "a0c2d67d-158a-4fdf-9c45-7f420fbdce8e",
				Name: "Druid [Alt]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 65,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "77288f4d-e262-47b6-aad8-2edff23859cb",
				Name: "Druid [Traditional]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 65,
				Bonus: &common.BaseBonus{
					Addqualities: &common.Addqualities{},
					Skilldisable: []string{
						// 1 items omitted
					},
					Skillgroupdisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "4bbe470b-51a7-494b-8ccf-5c638e141049",
				Name: "Elder God",
				Drain: "{WIL} + {INT}",
				Source: "FA",
				Page: 78,
				Bonus: &common.BaseBonus{
					Spellcategory: []common.Spellcategory{
						// 1 items omitted
					},
					Drainresist: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Task Spirit"),
					SpiritDetection: stringPtr("Guardian Spirit"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Fire"),
					SpiritManipulation: stringPtr("Spirit of Water"),
				},
			},
			{
				ID: "61819d3f-2ca6-4e1e-9d66-5d94c1560733",
				Name: "Green Magic",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 80,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Plant Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Spirit of Water"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "ad6f8984-f0c2-41e9-a2d1-73a719d21a06",
				Name: "Islam [Islamic Alchemist]",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 69,
				Bonus: &common.BaseBonus{
					Skilldisable: []string{
						// 2 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "328d6c96-9e10-424f-bbed-b6e1d1035bd2",
				Name: "Islam [Licit Qur'anic]",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 69,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "b8b93cfb-5bdf-47c6-b773-45c59ef7bd34",
				Name: "Missionist",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 81,
				Bonus: &common.BaseBonus{
					Spellcategory: []common.Spellcategory{
						// 2 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Man"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Spirit of Water"),
					SpiritIllusion: stringPtr("Spirit of Fire"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "68a35424-6de8-4922-95ec-eb289838acb2",
				Name: "Necro Magic",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 82,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Corpse Spirit"),
					SpiritDetection: stringPtr("Carcass Spirit"),
					SpiritHealth: stringPtr("Rot Spirit"),
					SpiritIllusion: stringPtr("Detritus Spirit"),
					SpiritManipulation: stringPtr("Palefire Spirit"),
				},
			},
			{
				ID: "9c211dbe-6a37-4872-80fa-37d845d76668",
				Name: "Norse [Alt]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 68,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "2ea02939-030b-407b-b569-c2f39f301999",
				Name: "Norse [Godi/Runemaster]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 68,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "fa341243-5134-42ad-9259-454bf18a26fd",
				Name: "Norse [Cunning Woman]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 68,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "52668f12-2895-48e1-8b84-2382ef0fcee0",
				Name: "Norse [Berserker]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 68,
				Bonus: &common.BaseBonus{
					Specificpower: []common.Specificpower{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "990cdff5-2fd1-48aa-b085-a7d0ff183d00",
				Name: "Norse [Seidman]",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 68,
				Bonus: &common.BaseBonus{
					Addqualities: &common.Addqualities{},
					Skillgroupdisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "f87723cf-ed66-4372-8064-365151dd1089",
				Name: "Olympianism",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 84,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "52348ffc-2d9b-427b-a546-863a9670127e",
				Name: "Pariah",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 85,
				Bonus: &common.BaseBonus{
					Specificskill: []common.Specificskill{
						// 3 items omitted
					},
					Skilldisable: []string{
						// 6 items omitted
					},
				},
				Spirits: TraditionSpirits{
				},
			},
			{
				ID: "eca20088-da31-4b00-bf81-93db882f3575",
				Name: "Planar Magic",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 87,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Spirit of Water"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Task Spirit"),
				},
			},
			{
				ID: "a5c6f673-bd53-4e70-a574-af2f5a1c2e60",
				Name: "Red Magic",
				Drain: "{WIL} + {INT}",
				Source: "FA",
				Page: 88,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Spirit of Water"),
					SpiritIllusion: stringPtr("Spirit of Earth"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "bd5bb80f-d1be-4ec8-b972-af45dc05e0fb",
				Name: "Romani",
				Drain: "{WIL} + {WIL}",
				Source: "FA",
				Page: 90,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "9d0cec5d-4350-47da-9ced-6619bbcb1936",
				Name: "Traditionalist Shaman",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 74,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "10c2a345-3bbf-4368-b093-e1da08530f12",
				Name: "Ancestor Shaman",
				Drain: "{WIL} + {CHA}",
				Source: "FA",
				Page: 74,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Water"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "2cd90e8a-3674-470e-b95d-eb80c008fc4a",
				Name: "Tarot",
				Drain: "{WIL} + {LOG}",
				Source: "FA",
				Page: 91,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Air"),
					SpiritDetection: stringPtr("Spirit of Fire"),
					SpiritHealth: stringPtr("Spirit of Water"),
					SpiritIllusion: stringPtr("Spirit of Man"),
					SpiritManipulation: stringPtr("Spirit of Earth"),
				},
			},
			{
				ID: "9147b372-b55f-4b4b-8f24-04a4dd05aa1a",
				Name: "Armanentradition",
				Drain: "{WIL} + {LOG}",
				Source: "SAG",
				Page: 111,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Task Spirit"),
				},
			},
			{
				ID: "7d2ee0fa-92ab-4fec-86c9-e2f3964456e7",
				Name: "Dianism",
				Drain: "{WIL} + {INT}",
				Source: "SAG",
				Page: 112,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Fire"),
					SpiritHealth: stringPtr("Spirit of Air"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "a8f9687a-0999-4509-87a2-4b122fb2187c",
				Name: "Frisian Magic",
				Drain: "{WIL} + {LOG}",
				Source: "SAG",
				Page: 113,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Water"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Guidance Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Plant Spirit"),
				},
			},
			{
				ID: "27109795-aead-463c-848c-fa63e5aa11cd",
				Name: "Magic of Roma and Street Nomads",
				Drain: "{WIL} + {CHA}",
				Source: "SAG",
				Page: 114,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Beasts"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "4eaf37d8-1fa9-4ba3-898a-3130a62fe09e",
				Name: "Svetoid",
				Drain: "{WIL} + {CHA}",
				Source: "SAG",
				Page: 115,
				SpiritForm: stringPtr("Possession"),
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Earth"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Man"),
					SpiritManipulation: stringPtr("Spirit of Water"),
				},
			},
			{
				ID: "232c8cfe-b70a-4fb8-9dc3-ecc993cf6203",
				Name: "Troll Shamanism",
				Drain: "{WIL} + {CHA}",
				Source: "SAG",
				Page: 115,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Guardian Spirit"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Plant Spirit"),
				},
			},
			{
				ID: "66826a89-61fb-4f4d-99d9-d96c0956b83f",
				Name: "Dark Magic",
				Drain: "{WIL} + {CHA}",
				Source: "DTR",
				Page: 165,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Spirit of Water"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "c0405095-5304-4fbd-b955-203a11f88b73",
				Name: "Dr. Singer School",
				Drain: "{WIL} + {CHA}",
				Source: "DATG",
				Page: 40,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Task Spirit"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Guidance Spirit"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "53a919e6-739d-4418-aaff-79e9df17e3b6",
				Name: "Storm Children",
				Drain: "{WIL} + {INT}",
				Source: "DATG",
				Page: 41,
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Beasts"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Plant Spirit"),
					SpiritManipulation: stringPtr("Spirit of Air"),
				},
			},
			{
				ID: "bfea19e7-4a68-4394-905b-0f2f8503f424",
				Name: "Faustian [Alt]",
				Drain: "{WIL} + {LOG}",
				Source: "SOTG",
				Page: 25,
				Bonus: &common.BaseBonus{
					Addqualities: &common.Addqualities{},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Guidance Spirit"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
			{
				ID: "9147493a-4cab-418b-9a5c-0f16958610c6",
				Name: "Brocken Witches [Alt], Cauldron",
				Drain: "{WIL} + {INT}",
				Source: "SOTG",
				Page: 25,
				Bonus: &common.BaseBonus{
					Specificskill: []common.Specificskill{
						// 1 items omitted
					},
					Skilldisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "204e51fb-917a-4863-a5fe-a7eb36dfcc91",
				Name: "Brocken Witches [Alt], Helsmägde",
				Drain: "{WIL} + {INT}",
				Source: "SOTG",
				Page: 25,
				Bonus: &common.BaseBonus{
					Spellcategory: []common.Spellcategory{
						// 1 items omitted
					},
					Skilldisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Beasts"),
					SpiritDetection: stringPtr("Spirit of Air"),
					SpiritHealth: stringPtr("Plant Spirit"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Fire"),
				},
			},
			{
				ID: "2245e751-68b0-4c10-911b-3131fdba85cc",
				Name: "Frisian Magic [Alt], Frijskwart",
				Drain: "{WIL} + {LOG}",
				Source: "SOTG",
				Page: 26,
				Bonus: &common.BaseBonus{
					Skilldisable: []string{
						// 2 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Water"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Guidance Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Plant Spirit"),
				},
			},
			{
				ID: "6a11a8ff-e779-4da8-944c-c68dc38abc6b",
				Name: "Frisian Magic [Alt], Sea Monk",
				Drain: "{WIL} + {LOG}",
				Source: "SOTG",
				Page: 26,
				Bonus: &common.BaseBonus{
					Specificskill: []common.Specificskill{
						// 1 items omitted
					},
					Skilldisable: []string{
						// 2 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Water"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Guidance Spirit"),
					SpiritIllusion: stringPtr("Spirit of Air"),
					SpiritManipulation: stringPtr("Plant Spirit"),
				},
			},
			{
				ID: "27461184-741a-48ea-a2ae-51d00589d42c",
				Name: "Freudian Tradition",
				Drain: "{WIL} + {LOG}",
				Source: "SOTG",
				Page: 27,
				Bonus: &common.BaseBonus{
					Addqualities: &common.Addqualities{},
					Skillgroupdisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Spirit of Fire"),
					SpiritDetection: stringPtr("Spirit of Earth"),
					SpiritHealth: stringPtr("Spirit of Man"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Spirit of Air"),
				},
			},
			{
				ID: "8a7c8a87-6092-4e74-9aff-be771aa2a67f",
				Name: "Guardian Order",
				Drain: "{WIL} + {CHA}",
				Source: "SOTG",
				Page: 28,
				Bonus: &common.BaseBonus{
					Addmetamagic: []common.Addmetamagic{
						// 1 items omitted
					},
					Addqualities: &common.Addqualities{},
					Skillgroupdisable: []string{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Guidance Spirit"),
					SpiritHealth: stringPtr("Spirit of Earth"),
					SpiritIllusion: stringPtr("Spirit of Water"),
					SpiritManipulation: stringPtr("Task Spirit"),
				},
			},
			{
				ID: "deea732f-5768-4d13-8796-c93d0000c5c6",
				Name: "Storyteller",
				Drain: "{WIL} + {CHA}",
				Source: "GE",
				Page: 68,
				Bonus: &common.BaseBonus{
					Spellcategory: []common.Spellcategory{
						// 1 items omitted
					},
				},
				Spirits: TraditionSpirits{
					SpiritCombat: stringPtr("Guardian Spirit"),
					SpiritDetection: stringPtr("Spirit of Beasts"),
					SpiritHealth: stringPtr("Task Spirit"),
					SpiritIllusion: stringPtr("Guidance Spirit"),
					SpiritManipulation: stringPtr("Spirit of Man"),
				},
			},
		},
	},
	Spirits: Spirits{
		Spirit: []Spirit{
			{
				ID: "380a4860-e5b7-4d07-9b8f-24951c1d656a",
				Name: "Spirit of Air",
				Bod: "F-2",
				Agi: "F+3",
				Rea: "F+4",
				Str: "F-3",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+4",
				Source: "SR5",
				Page: 303,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Elemental Attack",
						"Energy Aura",
						"Fear",
						"Guard",
						"Noxious Breath",
						"Psychokinesis",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Running",
							Attr: stringPtr("str"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "2a0352be-9b13-4e1e-a610-af480f6a1841",
				Name: "Spirit of Earth",
				Bod: "F+4",
				Agi: "F-2",
				Rea: "F-1",
				Str: "F+4",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-1",
				Wil: "F+0",
				Ini: "(F*2)-1",
				Source: "SR5",
				Page: 303,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Confusion",
						"Engulf",
						"Elemental Attack",
						"Fear",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "c5e35ac9-5737-4003-8c9e-eb016d2bccd2",
				Name: "Spirit of Beasts",
				Bod: "F+2",
				Agi: "F+1",
				Rea: "F+0",
				Str: "F+2",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "SR5",
				Page: 303,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Confusion",
						"Guard",
						"Natural Weapon",
						"Noxious Breath",
						"Search",
						"Venom",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Enhanced Senses (Hearing)",
						},
						{
							Content: "Enhanced Senses (Low-Light Vision)",
						},
						{
							Content: "Enhanced Senses (Smell)",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "c0178bf8-1fc5-4c56-9ce1-92a3ae1adc45",
				Name: "Spirit of Fire",
				Bod: "F+1",
				Agi: "F+2",
				Rea: "F+3",
				Str: "F-2",
				Cha: "F+0",
				Int: "F+1",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+3",
				Source: "SR5",
				Page: 303,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Fear",
						"Guard",
						"Noxious Breath",
						"Search",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Elemental Attack",
						},
						{
							Content: "Energy Aura",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Flight",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Water, Severe)",
					},
				},
			},
			{
				ID: "d590d5ad-df91-486c-abb1-21a08a5b8a50",
				Name: "Spirit of Man",
				Bod: "F+1",
				Agi: "F+0",
				Rea: "F+2",
				Str: "F-2",
				Cha: "F+0",
				Int: "F+1",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "SR5",
				Page: 304,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Fear",
						"Innate Spell",
						"Movement",
						"Psychokinesis",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Enhanced Senses (Low-Light Vision)",
						},
						{
							Content: "Enhanced Senses (Thermographic Vision)",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Influence",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Spellcasting",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "5f284fc2-13dc-42cc-9cd9-231f815ea0bf",
				Name: "Spirit of Water",
				Bod: "F+0",
				Agi: "F+1",
				Rea: "F+2",
				Str: "F+0",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "SR5",
				Page: 304,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Accident",
						"Binding",
						"Elemental Attack",
						"Energy Aura",
						"Guard",
						"Weather Control",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Fire, Severe)",
					},
				},
			},
			{
				ID: "de5f01da-a334-4b64-b491-549e420ac6d3",
				Name: "Homunculus (Fragile)",
				Bod: "1",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "28d8859b-21da-43f7-b401-181cf1284f97",
				Name: "Homunculus (Cheap Material)",
				Bod: "2",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "2ed43bda-6773-462d-b850-db4b82d9bac0",
				Name: "Homunculus (Average Material)",
				Bod: "1",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "f1262445-f4fd-43ab-b874-b9111f02ac96",
				Name: "Homunculus (Heavy Material)",
				Bod: "6",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "eb454ca4-2260-4f1c-91c4-901abf010f2b",
				Name: "Homunculus (Reinforced Material)",
				Bod: "8",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "ce4e5b8b-3d15-4cbe-b0ed-3ed150300779",
				Name: "Homunculus (Structural Material)",
				Bod: "1",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "d19a52fe-1c68-4032-9459-662b0b80a633",
				Name: "Homunculus (Heavy Structural Material)",
				Bod: "1",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
					},
				},
			},
			{
				ID: "d8a0781e-c5bf-451a-939c-97f68a3ceacb",
				Name: "Homunculus (Armored Material)",
				Bod: "1",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "01cea6c7-1b92-4e71-a56c-4059ab105382",
				Name: "Homunculus (Hardened Material)",
				Bod: "1",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "0",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "04d2cdc8-7876-4865-93d6-76a46f628014",
				Name: "Watcher",
				Bod: "0",
				Agi: "0",
				Rea: "0",
				Str: "0",
				Cha: "F-2",
				Int: "F-2",
				Log: "F-2",
				Wil: "F-2",
				Ini: "0",
				Source: "SR5",
				Page: 298,
				Edg: stringPtr("F"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Manifest",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
					},
				},
			},
			{
				ID: "ea797271-de7e-4e55-ac03-93a8be90b47a",
				Name: "Guardian Spirit",
				Bod: "F+1",
				Agi: "F+2",
				Rea: "F+3",
				Str: "F+2",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+1",
				Source: "SG",
				Page: 193,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Animal Control",
						"Concealment",
						"Elemental Attack",
						"Natural Weaponry",
						"Psychokinesis",
						"Skill (any Combat skill)",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Magical Guard",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Blades",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Clubs",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Counterspelling",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "12028356-5d37-406b-83d1-d25ef18030d1",
				Name: "Guidance Spirit",
				Bod: "F+3",
				Agi: "F-1",
				Rea: "F+2",
				Str: "F+1",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "SG",
				Page: 193,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Engulf",
						"Enhanced Senses (Hearing)",
						"Enhanced Senses (Low-Light Vision)",
						"Enhanced Senses (Thermographic Vision)",
						"Enhanced Senses (Smell)",
						"Fear",
						"Influence",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Divining",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Magical Guard",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
						{
							Content: "Shadow Cloak",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Arcana",
							Attr: stringPtr("log"),
						},
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Counterspelling",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "22efb7b7-b822-4243-9fa3-6d87d407e9e5",
				Name: "Plant Spirit",
				Bod: "F+2",
				Agi: "F-1",
				Rea: "F+0",
				Str: "F+1",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-1",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "SG",
				Page: 193,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Accident",
						"Confusion",
						"Movement",
						"Noxious Breath",
						"Search",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Magical Guard",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Silence",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Counterspelling",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "a6906b58-489e-4100-a84d-866a3af4e37a",
				Name: "Task Spirit",
				Bod: "F+0",
				Agi: "F+0",
				Rea: "F+2",
				Str: "F+2",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "SG",
				Page: 193,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Enhanced Senses (Hearing)",
						"Enhanced Senses (Low-Light Vision)",
						"Enhanced Senses (Thermographic Vision)",
						"Enhanced Senses (Smell)",
						"Influence",
						"Psychokinesis",
						"Skill (any Technical or Physical skill)",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Artisan",
							Attr: stringPtr("int"),
						},
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "8011bd8a-847f-4527-89d1-58c559ef9480",
				Name: "Ally Spirit",
				Bod: "F",
				Agi: "F",
				Rea: "F",
				Str: "F",
				Cha: "F",
				Int: "F",
				Log: "F",
				Wil: "F",
				Ini: "(F*2)+4",
				Source: "SG",
				Page: 200,
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "magician",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Banishing Resistance",
						},
						{
							Content: "Realistic Form",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Sense Link",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "05f52567-0406-41ce-ab5b-bea370963207",
				Name: "Noxious",
				Bod: "F-2",
				Agi: "F+3",
				Rea: "F+4",
				Str: "F-3",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+4",
				Source: "SG",
				Page: 387,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Fear",
						"Guard",
						"Noxious Breath",
						"Psychokinesis",
						"Weather Control",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Engulf (Air)",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Running",
							Attr: stringPtr("str"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "b76a6219-0308-4225-a4c2-07682c409741",
				Name: "Barren",
				Bod: "F+4",
				Agi: "F-2",
				Rea: "F-1",
				Str: "F+4",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-1",
				Wil: "F+0",
				Ini: "(F*2)-1",
				Source: "SG",
				Page: 88,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Accident",
						"Concealment",
						"Confusion",
						"Fear",
						"Guard",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Elemental Attack (Pollutant)",
						},
						{
							Content: "Engulf (Earth)",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Clean Earth, Severe)",
					},
				},
			},
			{
				ID: "3a65e42f-fbc5-494c-80b7-9221b8c9cc24",
				Name: "Abomination",
				Bod: "F+2",
				Agi: "F+1",
				Rea: "F+0",
				Str: "F+2",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "SG",
				Page: 87,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Corrosive Spit",
						"Fear",
						"Guard",
						"Mimicry",
						"Search",
						"Venom",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control (Toxic Critters)",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Enhanced Senses (Hearing)",
						},
						{
							Content: "Enhanced Senses (Low-Light Vision)",
						},
						{
							Content: "Enhanced Senses (Smell)",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Mutagen",
						},
						{
							Content: "Natural Weapon",
						},
						{
							Content: "Pestilence",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Gymnastics",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Running",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "433695d0-94ca-4bb6-afad-a95f391786d7",
				Name: "Nuclear",
				Bod: "F+1",
				Agi: "F+2",
				Rea: "F+3",
				Str: "F-2",
				Cha: "F+0",
				Int: "F+1",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+3",
				Source: "SG",
				Page: 88,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Confusion",
						"Fear",
						"Guard",
						"Search",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Elemental Attack (Radiation)",
						},
						{
							Content: "Energy Aura (Radiation)",
						},
						{
							Content: "Engulf (Fire)",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Flight",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "bc720993-d169-4d4e-a836-72464f6b0eda",
				Name: "Plague",
				Bod: "F+0",
				Agi: "F+0",
				Rea: "F+2",
				Str: "F-2",
				Cha: "F+0",
				Int: "F+1",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "SG",
				Page: 88,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Confusion",
						"Guard",
						"Innate Spell",
						"Movement",
						"Psychokinesis",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Desire Reflection",
						},
						{
							Content: "Enhanced Senses (Low-Light Vision)",
						},
						{
							Content: "Enhanced Senses (Thermographic Vision)",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Mutagen",
						},
						{
							Content: "Pestilence",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Spellcasting",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "b986e478-0d37-4175-a144-9e59f4b2c88c",
				Name: "Sludge",
				Bod: "F+0",
				Agi: "F+1",
				Rea: "F+2",
				Str: "F+0",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "SG",
				Page: 88,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Accident",
						"Concealment",
						"Confusion",
						"Fear",
						"Guard",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Elemental Attack (Pollutant)",
						},
						{
							Content: "Engulf (Water)",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Mutagen",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Clean Water, Severe)",
					},
				},
			},
			{
				ID: "6630bbe6-60e5-44fc-8c5c-15a97b41ee5f",
				Name: "Blood Spirit",
				Bod: "F+2",
				Agi: "F+2",
				Rea: "F+0",
				Str: "F+2",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-1",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "SG",
				Page: 91,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Confusion",
						"Guard",
						"Movement",
						"Natural Weapon",
						"Noxious Breath",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Energy Drain (Essence, Touch, Physical Damage)",
						},
						{
							Content: "Evanescence",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Materialization",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Running",
							Attr: stringPtr("str"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Essence Loss (1 point per day)",
					},
				},
			},
			{
				ID: "8263b5dc-80d5-4fa2-86ab-e1608acf7342",
				Name: "Caretaker Spirit",
				Bod: "F+0",
				Agi: "F+1",
				Rea: "F+1",
				Str: "F+0",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+1",
				Source: "SG",
				Page: 98,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Binding",
						"Confusion",
						"Enhanced Senses (Smell)",
						"Enhanced Senses (Thermographic Vision)",
						"Enhanced Senses (Ultrasound)",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control (Insect Type)",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Hive Mind",
						},
						{
							Content: "Inhabitation (Living Vessels)",
						},
						{
							Content: "Innate Spell (Physical Barrier)",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Leadership",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Insecticides, Severe)",
						"Evanescence",
					},
				},
			},
			{
				ID: "19a87e05-f929-4db9-b7f8-94eed7a13020",
				Name: "Nymph Spirit",
				Bod: "F-1",
				Agi: "F+0",
				Rea: "F+3",
				Str: "F-1",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+3",
				Source: "SG",
				Page: 98,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Compulsion",
						"Fear",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control (Insect Type)",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Enhanced Senses (Smell)",
						},
						{
							Content: "Enhanced Senses (Thermographic Vision)",
						},
						{
							Content: "Enhanced Senses (Ultrasound)",
						},
						{
							Content: "Hive Mind",
						},
						{
							Content: "Inhabitation (Living Vessels)",
						},
						{
							Content: "Innate Spell (Illusion Spell)",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Gymnastics",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Spellcasting",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Insecticides, Severe)",
						"Evanescence",
					},
				},
			},
			{
				ID: "5673d266-2da5-4912-93bd-b153f14ec87e",
				Name: "Scout Spirit",
				Bod: "F+0",
				Agi: "F+2",
				Rea: "F+2",
				Str: "F+0",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "SG",
				Page: 98,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Confusion",
						"Guard",
						"Natural Weapon",
						"Noxious Breath",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control (Insect Type)",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Enhanced Senses (Smell)",
						},
						{
							Content: "Enhanced Senses (Thermographic Vision)",
						},
						{
							Content: "Enhanced Senses (Ultrasound)",
						},
						{
							Content: "Hive Mind",
						},
						{
							Content: "Inhabitation (Living Vessels)",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Gymnastics",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Sneaking",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Insecticides, Severe)",
						"Evanescence",
					},
				},
			},
			{
				ID: "caf8f724-e1a9-4469-998d-76d23fe4014e",
				Name: "Soldier Spirit",
				Bod: "F+3",
				Agi: "F+1",
				Rea: "F+1",
				Str: "F+3",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+1",
				Source: "SG",
				Page: 98,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Binding",
						"Magical Guard",
						"Noxious Breath",
						"Skill (any combat skill)",
						"Venom",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control (Insect Type)",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Hive Mind",
						},
						{
							Content: "Inhabitation (Living Vessels)",
						},
						{
							Content: "Natural Weapon  Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Counterspelling",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Gymnastics",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Insecticides, Severe)",
						"Evanescence",
					},
				},
			},
			{
				ID: "3e9ed319-1fed-4867-90f1-68b62497516a",
				Name: "Worker Spirit",
				Bod: "F+0",
				Agi: "F+0",
				Rea: "F+0",
				Str: "F+1",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "SG",
				Page: 99,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Enhanced Senses (Ultrasound)",
						"Venom",
						"Skill (any Technical or Physical skill )",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control (Insect Type)",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Enhanced Senses (Smell)",
						},
						{
							Content: "Enhanced Senses (Thermographic Vision)",
						},
						{
							Content: "Hive Mind",
						},
						{
							Content: "Inhabitation (Living Vessels)",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Insecticides, Severe)",
						"Evanescence",
					},
				},
			},
			{
				ID: "ad2dd39f-4fb0-4e89-8d73-b76184ecb1cf",
				Name: "Queen Spirit",
				Bod: "F+5",
				Agi: "F+3",
				Rea: "F+4",
				Str: "F+5",
				Cha: "F+0",
				Int: "F+1",
				Log: "F+1",
				Wil: "F+1",
				Ini: "(F*2)+5",
				Source: "SG",
				Page: 99,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Guard",
						"Natural Weapon",
						"Noxious Breath",
						"Venom",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control (Insect Type)",
						},
						{
							Content: "Astral Gateway",
						},
						{
							Content: "Banishing Resistance",
						},
						{
							Content: "Compulsion",
						},
						{
							Content: "Enhanced Senses (Smell)",
						},
						{
							Content: "Enhanced Senses (Thermographic Vision)",
						},
						{
							Content: "Enhanced Senses (Ultrasound)",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Hive Mind",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
						{
							Content: "Spirit Pact",
						},
						{
							Content: "Wealth",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Con",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Counterspelling",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Gymnastics",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Leadership",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Negotiation",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Spellcasting",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Insecticides, Severe)",
					},
				},
			},
			{
				ID: "bf79c864-3276-452d-86d4-957e9f2f53ca",
				Name: "Corps Cadavre",
				Bod: "F",
				Agi: "F-2",
				Rea: "F-2",
				Str: "F",
				Cha: "1",
				Int: "1",
				Log: "1",
				Wil: "1",
				Ini: "(F-1)",
				Source: "HT",
				Page: 129,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Magic Resistance",
						"Combat Skill",
						"Physical Skill",
						"Social Skill",
						"Technical Skill",
						"Vehicle Skill",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "6237233f-1872-45da-b828-16df75a30127",
				Name: "Bone Spirit",
				Bod: "F+3",
				Agi: "F+0",
				Rea: "F+0",
				Str: "F+2",
				Cha: "F-1",
				Int: "F+0",
				Log: "F-1",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "FA",
				Page: 135,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Enhanced Senses (Hearing)",
						"Enhanced Senses (Low-Light Vision)",
						"Enhanced Senses (Thermographic Vision)",
						"Enhanced Senses (Smell)",
						"Guard",
						"Noxious Breath",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Natural Weapon",
						},
						{
							Content: "Possession (Bones)",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "0ba85f5b-c05c-4858-8314-4dd3a7c5764f",
				Name: "Blood Shade",
				Bod: "F+0",
				Agi: "F+2",
				Rea: "F+2",
				Str: "F-1",
				Cha: "F+1",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "FA",
				Page: 135,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Accident",
						"Banishing Resistance",
						"Compulsion",
						"Paralyzing Touch",
						"Search",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Aura Masking",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Energy Drain (Essence)",
						},
						{
							Content: "Evanescence",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Magical Guard",
						},
						{
							Content: "Mimicry",
						},
						{
							Content: "Possession (Blood)",
						},
						{
							Content: "Realistic Form",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Counterspelling",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Impersonation",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "865881e1-4674-4808-b540-beb0d07f8dd2",
				Name: "Carcass Spirit",
				Bod: "F+3",
				Agi: "F",
				Rea: "F",
				Str: "F+2",
				Cha: "F-1",
				Int: "F",
				Log: "F",
				Wil: "F",
				Ini: "0",
				Source: "FA",
				Page: 52,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Animal Control",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Enhanced Senses",
							Select: stringPtr("Hearing"),
						},
						{
							Content: "Enhanced Senses",
							Select: stringPtr("Low-Light Vision"),
						},
						{
							Content: "Enhanced Senses",
							Select: stringPtr("Smell"),
						},
						{
							Content: "Fear",
						},
						{
							Content: "Immunity",
							Select: stringPtr("Normal Weapons"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Pathogens"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Toxins"),
						},
						{
							Content: "Movement",
						},
						{
							Content: "Possession",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "1b9737c5-f3dc-4ede-acdb-81ad35afcb7e",
				Name: "Corpse Spirit",
				Bod: "F+2",
				Agi: "F-1",
				Rea: "F+2",
				Str: "F-2",
				Cha: "F-1",
				Int: "F+1",
				Log: "F",
				Wil: "F",
				Ini: "0",
				Source: "FA",
				Page: 53,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Enhanced Senses",
							Select: stringPtr("Low-Light"),
						},
						{
							Content: "Thermographic Vision",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Immunity",
							Select: stringPtr("Normal Weapons"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Pathogens"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Toxins"),
						},
						{
							Content: "Influence",
						},
						{
							Content: "Possession",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search ",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "eeca5858-c087-4489-9ad9-469f0664726f",
				Name: "Rot Spirit",
				Bod: "F+3",
				Agi: "F-2",
				Rea: "F",
				Str: "F+1",
				Cha: "F-1",
				Int: "F",
				Log: "F-1",
				Wil: "F",
				Ini: "0",
				Source: "FA",
				Page: 53,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Immunity",
							Select: stringPtr("Normal Weapons"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Pathogens"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Toxins"),
						},
						{
							Content: "Magical Guard",
						},
						{
							Content: "Possession",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Silence ",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Counterspelling",
							Attr: stringPtr("mag"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "1788c4f3-67a8-4b21-8f5a-1e0fb9ab20d0",
				Name: "Palefire Spirit",
				Bod: "F+2",
				Agi: "F+1",
				Rea: "F+3",
				Str: "F-2",
				Cha: "F-1",
				Int: "F+1",
				Log: "F",
				Wil: "F",
				Ini: "0",
				Source: "FA",
				Page: 53,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Elemental Attack",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Immunity",
							Select: stringPtr("Normal Weapons"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Pathogens"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Toxins"),
						},
						{
							Content: "Possession",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Flight",
							Attr: stringPtr("str"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat ",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "8e7d505f-4c97-4dad-ae15-955080c2fbaf",
				Name: "Detritus Spirit",
				Bod: "F+5",
				Agi: "F-3",
				Rea: "F-1",
				Str: "F+4",
				Cha: "F-1",
				Int: "F",
				Log: "F-1",
				Wil: "F",
				Ini: "0",
				Source: "FA",
				Page: 53,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Immunity",
							Select: stringPtr("Normal Weapons"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Pathogens"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Toxins"),
						},
						{
							Content: "Possession",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "4eb2ac59-72bd-4dda-8709-aa822614ff94",
				Name: "Ceramic Spirit",
				Bod: "F+0",
				Agi: "F+1",
				Rea: "F+2",
				Str: "F+0",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+2",
				Source: "FA",
				Page: 180,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Accident",
						"Binding",
						"Elemental Attack",
						"Energy Aura",
						"Enhanced Senses (Vision)",
						"Guard",
						"Skill (any Technical Skill)",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "75de5aea-77e7-4559-abe1-9f11b1c0004b",
				Name: "Metal Spirit",
				Bod: "F+4",
				Agi: "F-2",
				Rea: "F-1",
				Str: "F+4",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-1",
				Wil: "F+0",
				Ini: "(F*2)-1",
				Source: "FA",
				Page: 180,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Confusion",
						"Engulf",
						"Elemental Attack",
						"Fear",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "e69f5b99-7c0b-4174-9343-5424c18c17f2",
				Name: "Energy Spirit",
				Bod: "F+1",
				Agi: "F+2",
				Rea: "F+3",
				Str: "F-2",
				Cha: "F+0",
				Int: "F+1",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+3",
				Source: "FA",
				Page: 180,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Fear",
						"Guard",
						"Noxious Breath",
						"Search",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Elemental Attack",
						},
						{
							Content: "Energy Aura",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Flight",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Water, Severe)",
					},
				},
			},
			{
				ID: "ffdf57e1-319c-4772-bb43-c80a91baf290",
				Name: "Airwave Spirit",
				Bod: "F+2",
				Agi: "F+3",
				Rea: "F+4",
				Str: "F-3",
				Cha: "F+0",
				Int: "F+0",
				Log: "F+0",
				Wil: "F+0",
				Ini: "(F*2)+4",
				Source: "FA",
				Page: 180,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Elemental Attack",
						"Energy Aura",
						"Fear",
						"Guard",
						"Psychokinesis",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Impersonation",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Running",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "dbd6d567-1376-4847-b822-10a1f1d0a029",
				Name: "Ship Spirit",
				Bod: "F+4",
				Agi: "F-1",
				Rea: "F-1",
				Str: "F+2",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-2",
				Wil: "F+0",
				Ini: "(F*2)-1",
				Source: "FA",
				Page: 180,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Aura Masking",
						"Haunt",
						"Natural Weapon",
						"Storm",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Armor (F)",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Toughness",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Navigation",
							Attr: stringPtr("int"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Pilot Watercraft",
							Attr: stringPtr("rea"),
						},
						{
							Content: "Survival",
							Attr: stringPtr("int"),
						},
						{
							Content: "Swimming",
							Attr: stringPtr("str"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "fc8c2451-6314-4a44-b3da-92966df9c9f4",
				Name: "Train Spirit",
				Bod: "F+3",
				Agi: "F-1",
				Rea: "F-1",
				Str: "F+2",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-2",
				Wil: "F+1",
				Ini: "(F*2)-1",
				Source: "FA",
				Page: 181,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Aura Masking",
						"Haunt",
						"Natural Weapon",
						"Reinforcement",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Armor (F)",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Intimidation",
							Attr: stringPtr("cha"),
						},
						{
							Content: "Navigation",
							Attr: stringPtr("int"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Pilot Ground Craft",
							Attr: stringPtr("rea"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "8dabb592-0860-469c-aa86-12eba627ddf4",
				Name: "Automotive Spirit",
				Bod: "F+1",
				Agi: "F+2",
				Rea: "F+1",
				Str: "F+0",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-2",
				Wil: "F+0",
				Ini: "(F*2)+1",
				Source: "FA",
				Page: 181,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Aura Masking",
						"Haunt",
						"Movement",
						"Natural Weapon",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Armor (F)",
						},
						{
							Content: "Evasion",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Navigation",
							Attr: stringPtr("int"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Pilot Ground Craft",
							Attr: stringPtr("rea"),
						},
						{
							Content: "Running",
							Attr: stringPtr("str"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "51203ea9-db22-4ec0-8b95-8ae68addf2f0",
				Name: "Aircraft Spirit",
				Bod: "F+2",
				Agi: "F+1",
				Rea: "F+0",
				Str: "F+1",
				Cha: "F+0",
				Int: "F+0",
				Log: "F-2",
				Wil: "F+0",
				Ini: "(F*2)",
				Source: "FA",
				Page: 181,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Aura Masking",
						"Dive Attack",
						"Haunt",
						"Natural Weapon",
						"Search",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Evasion",
						},
						{
							Content: "Maneuvering",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Stealth",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Free-Fall",
							Attr: stringPtr("bod"),
						},
						{
							Content: "Navigation",
							Attr: stringPtr("int"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Pilot Aircraft",
							Attr: stringPtr("rea"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "df28f999-2da1-49cc-a214-37207e9d58bc",
				Name: "Air Elemental",
				Bod: "F-2",
				Agi: "F+3",
				Rea: "F+4",
				Str: "F-3",
				Cha: "F/2",
				Int: "F/2",
				Log: "F/2",
				Wil: "F/2",
				Ini: "F+(F/2)+4",
				Source: "FA",
				Page: 181,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Elemental Attack",
						"Energy Aura",
						"Fear",
						"Guard",
						"Noxious Breath",
						"Psychokinesis",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Running",
							Attr: stringPtr("str"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "1f3d1a7d-f8b4-49f9-ac23-2dac7089d58e",
				Name: "Earth Elemental",
				Bod: "F+4",
				Agi: "F-2",
				Rea: "F-1",
				Str: "F+4",
				Cha: "F/2",
				Int: "F/2",
				Log: "(F/2)-1",
				Wil: "F/2",
				Ini: "F+(F/2)-1",
				Source: "FA",
				Page: 181,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Concealment",
						"Confusion",
						"Engulf",
						"Elemental Attack",
						"Fear",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Binding",
						},
						{
							Content: "Guard",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
			},
			{
				ID: "a33bc432-338f-417d-8959-9bfcbfad61b1",
				Name: "Fire Elemental",
				Bod: "F+1",
				Agi: "F+2",
				Rea: "F+3",
				Str: "F-2",
				Cha: "F-2",
				Int: "(F/2)+1",
				Log: "F+0",
				Wil: "F+0",
				Ini: "F+(F/2)+3",
				Source: "FA",
				Page: 181,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Fear",
						"Guard",
						"Noxious Breath",
						"Search",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Accident",
						},
						{
							Content: "Astral Form",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Elemental Attack",
						},
						{
							Content: "Energy Aura",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Sapience",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Flight",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Water, Severe)",
					},
				},
			},
			{
				ID: "c04bcb45-e2ca-4f70-a63a-6f354c6cbecb",
				Name: "Water Elemental",
				Bod: "F+0",
				Agi: "F+1",
				Rea: "F+2",
				Str: "F+0",
				Cha: "F/2",
				Int: "F/2",
				Log: "F/2",
				Wil: "F/2",
				Ini: "F+(F/2)+2",
				Source: "FA",
				Page: 181,
				OptionalPowers: &SpiritOptionalPowers{
					Power: []string{
						"Accident",
						"Binding",
						"Elemental Attack",
						"Energy Aura",
						"Guard",
						"Weather Control",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Concealment",
						},
						{
							Content: "Confusion",
						},
						{
							Content: "Engulf",
						},
						{
							Content: "Materialization",
						},
						{
							Content: "Movement",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Search",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
							Attr: stringPtr("int"),
						},
						{
							Content: "Astral Combat",
							Attr: stringPtr("wil"),
						},
						{
							Content: "Exotic Ranged Weapon",
							Attr: stringPtr("agi"),
						},
						{
							Content: "Perception",
							Attr: stringPtr("int"),
						},
						{
							Content: "Unarmed Combat",
							Attr: stringPtr("agi"),
						},
					},
				},
				Weaknesses: &Weaknesses{
					Weakness: []string{
						"Allergy (Fire, Severe)",
					},
				},
			},
			{
				ID: "7499b2df-7a18-4390-a812-30c3ba528856",
				Name: "Boggle",
				Bod: "F-2",
				Agi: "F-1",
				Rea: "F-1",
				Str: "F-2",
				Cha: "F",
				Int: "F",
				Log: "F",
				Wil: "F+2",
				Ini: "0",
				Source: "HS",
				Page: 117,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Aura Masking",
						},
						{
							Content: "Banishing Resistance",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
					},
				},
			},
			{
				ID: "67ac70ce-554b-45bb-affc-1de3b29e0696",
				Name: "Shedim",
				Bod: "F",
				Agi: "F",
				Rea: "F+2",
				Str: "F+1",
				Cha: "F",
				Int: "F",
				Log: "F",
				Wil: "F",
				Ini: "0",
				Source: "SG",
				Page: 93,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Energy Drain",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Immunity",
							Select: stringPtr("Age"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Pathogens"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Toxins"),
						},
						{
							Content: "Paralyzing Touch",
						},
						{
							Content: "Possession",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Allergy",
							Select: stringPtr("Sunlight, Mild"),
						},
						{
							Content: "Evanescence",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
			{
				ID: "5b122a59-408e-4634-855a-763b25fbad16",
				Name: "Master Shedim",
				Bod: "F",
				Agi: "F",
				Rea: "F+2",
				Str: "F+1",
				Cha: "F",
				Int: "F+1",
				Log: "F+1",
				Wil: "F+1",
				Ini: "3",
				Source: "SG",
				Page: 93,
				Edg: stringPtr("F/2"),
				Mag: stringPtr("F"),
				Res: uint8Ptr(0),
				Dep: uint8Ptr(0),
				Ess: stringPtr("F"),
				Bonus: &SpiritBonus{
					EnableTab: &EnableTab{
						Name: "critter",
					},
				},
				Powers: SpiritPowers{
					Power: []SpiritPower{
						{
							Content: "Astral Form",
						},
						{
							Content: "Astral Gateway",
						},
						{
							Content: "Aura Masking",
						},
						{
							Content: "Banishing Resistance",
						},
						{
							Content: "Compulsion",
						},
						{
							Content: "Deathly Aura",
						},
						{
							Content: "Energy Drain",
						},
						{
							Content: "Fear",
						},
						{
							Content: "Immunity",
							Select: stringPtr("Age"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Pathogens"),
						},
						{
							Content: "Immunity",
							Select: stringPtr("Toxins"),
						},
						{
							Content: "Possession",
						},
						{
							Content: "Regeneration",
						},
						{
							Content: "Sapience",
						},
						{
							Content: "Shadow Cloak",
						},
						{
							Content: "Spirit Pact",
						},
						{
							Content: "Allergy",
							Select: stringPtr("Sunlight, Mild"),
						},
						{
							Content: "Evanescence",
						},
					},
				},
				Skills: SpiritSkills{
					Skill: []SpiritSkill{
						{
							Content: "Assensing",
						},
						{
							Content: "Astral Combat",
						},
						{
							Content: "Counterspelling",
						},
						{
							Content: "Gymnastics",
						},
						{
							Content: "Perception",
						},
						{
							Content: "Spellcasting",
						},
						{
							Content: "Unarmed Combat",
						},
					},
				},
			},
		},
	},
	DrainAttributes: DrainAttributes{
		DrainAttribute: []DrainAttribute{
			{
				ID: "f10d9639-45c8-4c45-87b9-6af0fef73723",
				Name: "{WIL} + {CHA}",
			},
			{
				ID: "06b8b7da-1301-4963-aba7-4862024559a8",
				Name: "{WIL} + {INT}",
			},
			{
				ID: "aca1fd74-0c25-41d5-b621-434c3892cfb3",
				Name: "{WIL} + {LOG}",
			},
			{
				ID: "c8adb0ec-7592-4801-b560-94805ef1c13e",
				Name: "{WIL} + {MAG}",
			},
			{
				ID: "f59248c7-7843-4b68-9a26-b966c32c8cae",
				Name: "{WIL} + {WIL}",
			},
		},
	},
}

// GetTraditionsData returns the loaded traditions data.
func GetTraditionsData() *TraditionsChummer {
	return traditionsData
}

// GetAllTraditions returns all traditions.
func GetAllTraditions() []Tradition {
	return traditionsData.Traditions.Tradition
}

// GetTraditionByID returns the tradition with the given ID, or nil if not found.
func GetTraditionByID(id string) *Tradition {
	traditions := GetAllTraditions()
	for i := range traditions {
		if traditions[i].ID == id {
			return &traditions[i]
		}
	}
	return nil
}

// GetAllSpirits returns all spirits.
func GetAllSpirits() []Spirit {
	return traditionsData.Spirits.Spirit
}

// GetSpiritByID returns the spirit with the given ID, or nil if not found.
func GetSpiritByID(id string) *Spirit {
	spirits := GetAllSpirits()
	for i := range spirits {
		if spirits[i].ID == id {
			return &spirits[i]
		}
	}
	return nil
}
