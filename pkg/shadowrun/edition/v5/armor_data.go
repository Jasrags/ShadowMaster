package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Code generated from armor.xml. DO NOT EDIT.

var armorData = &ArmorChummer{
	Categories: []ArmorCategories{
		{
			Category: []ArmorCategory{
				{
					CategoryBase: common.CategoryBase{
						Content: "Armor",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Clothing",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Cloaks",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "High-Fashion Armor Clothing",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Specialty Armor",
					},
					Blackmarket: stringPtr("Armor"),
				},
			},
		},
	},
	ModCategories: []ArmorModCategories{
		{
			Category: []ArmorModCategory{
				{
					CategoryBase: common.CategoryBase{
						Content: "Customized Ballistic Mask",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Full Body Armor Mods",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "General",
					},
					Blackmarket: stringPtr("Armor,Electronics,Magic,Software"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Custom Liners (Rating 1)",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Custom Liners (Rating 2)",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Custom Liners (Rating 3)",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Custom Liners (Rating 4)",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Custom Liners (Rating 5)",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Custom Liners (Rating 6)",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Nightshade IR",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Rapid Transit Detailing",
					},
					Blackmarket: stringPtr("Armor"),
				},
				{
					CategoryBase: common.CategoryBase{
						Content: "Urban Explorer Jumpsuit Accessories",
					},
					Blackmarket: stringPtr("Armor"),
				},
			},
		},
	},
	Armors: []ArmorItems{
		{
			Armor: []ArmorItem{
				{
					ID: "31c68476-6328-476a-ae8a-94f65d505a04",
					Name: "Clothing",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "Variable(20-100000)",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "5a650844-8f24-48e7-829f-0443d9ff5cf7",
					Name: "Actioneer Business Clothes",
					Category: "Armor",
					Armor: "8",
					ArmorCapacity: "8",
					Avail: "8",
					Cost: "1500",
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "40826eaa-c22a-43da-8730-bc1867ea65a1",
					Name: "Armor Clothing",
					Category: "Armor",
					Armor: "6",
					ArmorCapacity: "6",
					Avail: "2",
					Cost: "450",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "36a4cd30-c32c-44d0-847a-0c15fb51072a",
					Name: "Armor Jacket",
					Category: "Armor",
					Armor: "12",
					ArmorCapacity: "12",
					Avail: "2",
					Cost: "1000",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "4ad1eeab-daf3-4495-a73d-fbb0ce89be5b",
					Name: "Armor Vest",
					Category: "Armor",
					Armor: "9",
					ArmorCapacity: "9",
					Avail: "4",
					Cost: "500",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "aacafde3-ff9a-4de0-85ac-3870645a9197",
					Name: "Chameleon Suit",
					Category: "Armor",
					Armor: "9",
					ArmorCapacity: "9",
					Avail: "10R",
					Cost: "1700",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "9ee80c97-9197-4dd5-baed-f77cfd2cee17",
					Name: "Full Body Armor",
					Category: "Armor",
					Armor: "15",
					ArmorCapacity: "15",
					Avail: "14R",
					Cost: "2000",
					AddModCategory: stringPtr("Full Body Armor Mods"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "013b9f3f-533b-4545-aa51-c6cf8d50f3b6",
					Name: "Lined Coat",
					Category: "Armor",
					Armor: "9",
					ArmorCapacity: "9",
					Avail: "4",
					Cost: "900",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "d8d9154d-c8d3-4593-a408-9f5b259f0363",
					Name: "Urban Explorer Jumpsuit",
					Category: "Armor",
					Armor: "9",
					ArmorCapacity: "9",
					Avail: "8",
					Cost: "650",
					AddModCategory: stringPtr("Urban Explorer Jumpsuit Accessories"),
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "fd6e194b-89ea-4030-9203-87341442eadb",
					Name: "Helmet",
					Category: "Armor",
					Armor: "+2",
					ArmorCapacity: "6",
					Avail: "2",
					Cost: "100",
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "438",
					},
				},
				{
					ID: "943d19f7-ee6b-4ce9-8a43-93d3fe5100f2",
					Name: "Ballistic Shield",
					Category: "Armor",
					Armor: "+6",
					ArmorCapacity: "6",
					Avail: "12R",
					Cost: "1200",
					AddWeapon: []string{
						"Ballistic Shield",
					},
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "438",
					},
				},
				{
					ID: "b0d6d8a6-b74a-4ea3-9c04-cc0d057e51b6",
					Name: "Riot Shield",
					Category: "Armor",
					Armor: "+6",
					ArmorCapacity: "6",
					Avail: "10R",
					Cost: "1500",
					AddWeapon: []string{
						"Riot Shield",
					},
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "438",
					},
				},
				{
					ID: "ef42a5ce-3423-4018-b84f-5cc84238ccaf",
					Name: "Armanté Suit",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "10",
					Cost: "2500",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "57",
					},
				},
				{
					ID: "d2d13b9e-dcc9-4427-96e5-65348f4f2766",
					Name: "Armanté Dress",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "10",
					Cost: "2500",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "57",
					},
				},
				{
					ID: "e95b254f-c95d-41c4-b618-7c68c3456112",
					Name: "Mortimer of London: Berwick Suit",
					Category: "High-Fashion Armor Clothing",
					Armor: "9",
					ArmorCapacity: "5",
					Avail: "9",
					Cost: "2600",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "998a55b0-2307-45db-99fc-ae2d1501f6dc",
					Name: "Mortimer of London: Berwick Dress",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "8",
					Cost: "2300",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "39a446e4-694a-44e2-bc47-bbfe722c7c68",
					Name: "Mortimer of London: Crimson Sky Suit",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "5",
					Avail: "6",
					Cost: "2400",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "328fb32e-9c69-49ea-a15d-aa50dd169209",
					Name: "Mortimer of London: Summit Suit",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "6",
					Avail: "7",
					Cost: "2500",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "de7aa792-a274-46dc-a89a-970d08afa814",
					Name: "Mortimer of London: Summit Dress",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "5",
					Avail: "7",
					Cost: "2200",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "446ec9ad-9a52-46fe-8f27-873a51ef6291",
					Name: "Mortimer of London: Greatcoat Coat",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "10",
					Avail: "8",
					Cost: "3000",
					ArmorOverride: stringPtr("+3"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "994c7cfb-54a1-4a47-8ca5-9d5381ba2994",
					Name: "Mortimer of London: Ulysses Coat",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "12",
					Avail: "8",
					Cost: "3100",
					ArmorOverride: stringPtr("+3"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "dceda713-a138-4161-8bd2-b909ffed7f85",
					Name: "Mortimer of London: Argentum Coat",
					Category: "High-Fashion Armor Clothing",
					Armor: "12",
					ArmorCapacity: "14",
					Avail: "10",
					Cost: "3600",
					ArmorOverride: stringPtr("+4"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "58",
					},
				},
				{
					ID: "bedcc69e-1b7b-44bf-b916-22821696c3b0",
					Name: "Vashon Island: Ace of Cups",
					Category: "High-Fashion Armor Clothing",
					Armor: "9",
					ArmorCapacity: "8",
					Avail: "6",
					Cost: "1600",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "4b2502ef-03e4-4cf5-b8f5-375b7aa4ddb9",
					Name: "Vashon Island: Ace of Swords",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "8",
					Avail: "6",
					Cost: "1300",
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "87f81743-37ca-4030-a588-07d109a31f75",
					Name: "Vashon Island: Ace of Wands",
					Category: "High-Fashion Armor Clothing",
					Armor: "6",
					ArmorCapacity: "8",
					Avail: "6",
					Cost: "1200",
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "cf582ec4-0e5d-4ddb-a38e-4c6be954c514",
					Name: "Vashon Island: Ace of Coins",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "10",
					Avail: "4",
					Cost: "2100",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "00ca9c50-383c-47ed-9347-b7733d62c3bd",
					Name: "Vashon Island: Ace of Spades",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "1000",
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "f12794c9-3600-4fc6-aeae-748eb3b324a0",
					Name: "Vashon Island: Ace of Clubs",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "1000",
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "7d046fdf-5c71-462d-bd51-e6ed718dd4fb",
					Name: "Vashon Island: Ace of Hearts",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "1000",
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "f90b52b6-1a4e-400f-b32f-9af5d7d932cd",
					Name: "Vashon Island: Ace of Diamonds",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "6",
					Avail: "8",
					Cost: "1400",
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "60",
					},
				},
				{
					ID: "164ad072-4e3a-4398-9d43-b47d9ee9083b",
					Name: "Vashon Island: Steampunk",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "14",
					Avail: "7",
					Cost: "2250",
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "61",
					},
				},
				{
					ID: "6db86bf0-0d3f-4e51-88cb-867b7247dbfb",
					Name: "Vashon Island: Synergist Business Line",
					Category: "High-Fashion Armor Clothing",
					Armor: "9",
					ArmorCapacity: "5",
					Avail: "8",
					Cost: "1500",
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "61",
					},
				},
				{
					ID: "cb1e1f7e-a711-44a7-8ed7-a8fc50802c62",
					Name: "Vashon Island: Synergist Business Line Longcoat",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "6",
					Avail: "8",
					Cost: "2300",
					ArmorOverride: stringPtr("+3"),
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "61",
					},
				},
				{
					ID: "fc8fd2e8-4856-4830-b241-a5128a08f902",
					Name: "Vashon Island: Sleeping Tiger",
					Category: "High-Fashion Armor Clothing",
					Armor: "13",
					ArmorCapacity: "10",
					Avail: "10",
					Cost: "13500",
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "61",
					},
				},
				{
					ID: "5341cfd0-5cd7-49d5-8a95-0266355f391a",
					Name: "Zoé: Executive Suite",
					Category: "High-Fashion Armor Clothing",
					Armor: "12",
					ArmorCapacity: "4",
					Avail: "12",
					Cost: "2000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "61",
					},
				},
				{
					ID: "30d98329-8e2b-46f4-bf2d-d36a2b5fa702",
					Name: "Zoé: Heritage 4",
					Category: "High-Fashion Armor Clothing",
					Armor: "4",
					ArmorCapacity: "2",
					Avail: "16",
					Cost: "4000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "7863f434-df16-46ab-9aeb-eba1d4e9f036",
					Name: "Zoé: Heritage 6",
					Category: "High-Fashion Armor Clothing",
					Armor: "6",
					ArmorCapacity: "3",
					Avail: "16",
					Cost: "5000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "cd5144e6-cad3-45ba-85c1-fb5edf2a8074",
					Name: "Zoé: Heritage 8",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "16",
					Cost: "6000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "35598cd3-17cb-4d9e-b02f-3f5b00f1f140",
					Name: "Zoé: Heritage 10",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "5",
					Avail: "16",
					Cost: "7000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "d4804f1b-4443-4e97-a7d2-9c1659732c6b",
					Name: "Zoé: Heritage 12",
					Category: "High-Fashion Armor Clothing",
					Armor: "12",
					ArmorCapacity: "6",
					Avail: "16",
					Cost: "8000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "1bb248fd-7a8f-4e5c-8aea-222546e70282",
					Name: "Zoé: Nightshade/Moonsilver",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "2",
					Avail: "10",
					Cost: "8500",
					AddModCategory: stringPtr("Nightshade IR"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "739b029d-b2a0-48cb-ac2e-51636fc495c2",
					Name: "Zoé: Second Skin",
					Category: "High-Fashion Armor Clothing",
					Armor: "6",
					ArmorCapacity: "2",
					Avail: "14",
					Cost: "12000",
					ArmorOverride: stringPtr("+2"),
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "63",
					},
				},
				{
					ID: "90b0ab96-661b-417c-9933-8113ab6d52d2",
					Name: "Ares Victory: Globetrotter Jacket",
					Category: "High-Fashion Armor Clothing",
					Armor: "12",
					ArmorCapacity: "10",
					Avail: "10",
					Cost: "1300",
					SelectModsFromCategory: &SelectModsFromCategory{
						Category: []string{
							"Custom Liners (Rating 4)",
						},
					},
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "63",
					},
				},
				{
					ID: "21c8ae9d-3d08-4908-814f-ae195e4ea03d",
					Name: "Ares Victory: Globetrotter Vest",
					Category: "High-Fashion Armor Clothing",
					Armor: "9",
					ArmorCapacity: "10",
					Avail: "7",
					Cost: "900",
					SelectModsFromCategory: &SelectModsFromCategory{
						Category: []string{
							"Custom Liners (Rating 3)",
						},
					},
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "63",
					},
				},
				{
					ID: "2de9a781-0b44-43a4-bfdf-2ca3c1e90bc0",
					Name: "Ares Victory: Globetrotter Clothing",
					Category: "High-Fashion Armor Clothing",
					Armor: "7",
					ArmorCapacity: "10",
					Avail: "6",
					Cost: "600",
					SelectModsFromCategory: &SelectModsFromCategory{
						Category: []string{
							"Custom Liners (Rating 2)",
						},
					},
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "63",
					},
				},
				{
					ID: "401891e4-293c-4308-bd95-bdfb1eb08a72",
					Name: "Ares Victory: Wild Hunt",
					Category: "High-Fashion Armor Clothing",
					Armor: "12",
					ArmorCapacity: "10",
					Avail: "12",
					Cost: "3000",
					SelectModsFromCategory: &SelectModsFromCategory{
						Category: []string{
							"Custom Liners (Rating 6)",
						},
					},
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "63",
					},
				},
				{
					ID: "3d0f09b9-2e73-4c10-9d44-184395be7aa2",
					Name: "Ares Victory: Industrious",
					Category: "High-Fashion Armor Clothing",
					Armor: "9",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "1100",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "64",
					},
				},
				{
					ID: "a71e62ca-bf6f-43d0-bacf-454908d92fbb",
					Name: "Ares Victory: Big Game Hunter",
					Category: "High-Fashion Armor Clothing",
					Armor: "14",
					ArmorCapacity: "12",
					Avail: "12",
					Cost: "5000",
					SelectModsFromCategory: &SelectModsFromCategory{
						Category: []string{
							"Custom Liners (Rating 6)",
						},
					},
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "64",
					},
				},
				{
					ID: "e6c9f9cb-fa30-445f-b6c7-b2017f63cbdd",
					Name: "Ares Victory: Rapid Transit",
					Category: "High-Fashion Armor Clothing",
					Armor: "9",
					ArmorCapacity: "6",
					Avail: "10",
					Cost: "400",
					AddModCategory: stringPtr("Rapid Transit Detailing"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "65",
					},
				},
				{
					ID: "790918b5-93fe-461e-8973-23d445bfaf93",
					Name: "Form-Fitting Body Armor",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "3",
					Avail: "8",
					Cost: "1300",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "65",
					},
				},
				{
					ID: "e11b7746-40e2-493a-b35d-87b0dec5f3ca",
					Name: "Hardened Mil-Spec Battle Armor: Light",
					Category: "Specialty Armor",
					Armor: "15",
					ArmorCapacity: "15",
					Avail: "16F",
					Cost: "15000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "66",
					},
				},
				{
					ID: "1c5ad9bc-35af-4079-b27c-f29a75ffe02f",
					Name: "Hardened Mil-Spec Battle Armor: Medium",
					Category: "Specialty Armor",
					Armor: "18",
					ArmorCapacity: "18",
					Avail: "18F",
					Cost: "20000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "66",
					},
				},
				{
					ID: "5542ff34-3eb7-4482-806f-d5a1cd56064f",
					Name: "Hardened Mil-Spec Battle Armor: Heavy",
					Category: "Specialty Armor",
					Armor: "20",
					ArmorCapacity: "20",
					Avail: "22F",
					Cost: "25000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "66",
					},
				},
				{
					ID: "eba04b96-c253-4fe0-8431-988d5a45d456",
					Name: "Hardened Mil-Spec Battle Armor: Helmet",
					Category: "Specialty Armor",
					Armor: "+3",
					ArmorCapacity: "8",
					Avail: "8F",
					Cost: "10000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "66",
					},
				},
				{
					ID: "2c5b1217-c36a-4386-8f98-6657518ba91d",
					Name: "Security Armor: Light",
					Category: "Specialty Armor",
					Armor: "15",
					ArmorCapacity: "12",
					Avail: "14R",
					Cost: "8000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "67",
					},
				},
				{
					ID: "20606e03-592a-4bb8-938b-3985054505fa",
					Name: "Security Armor: Medium",
					Category: "Specialty Armor",
					Armor: "18",
					ArmorCapacity: "14",
					Avail: "16R",
					Cost: "14000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "67",
					},
				},
				{
					ID: "d553f4be-85cb-48b9-b7bd-4eea8a67418d",
					Name: "Security Armor: Heavy",
					Category: "Specialty Armor",
					Armor: "20",
					ArmorCapacity: "16",
					Avail: "18R",
					Cost: "20000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "67",
					},
				},
				{
					ID: "7270c272-fef6-4b93-ae78-aa4906d9dbd5",
					Name: "Security Armor: Helmet",
					Category: "Specialty Armor",
					Armor: "+3",
					ArmorCapacity: "5",
					Avail: "8R",
					Cost: "5000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "67",
					},
				},
				{
					ID: "8f0c06ee-9915-415f-bf5b-26a4e3e517ea",
					Name: "Bike Racing Armor",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "8",
					Avail: "6",
					Cost: "500",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "68",
					},
				},
				{
					ID: "43119c33-3c4a-4c71-acf4-71a277aa8118",
					Name: "Bike Racing Helmet",
					Category: "Specialty Armor",
					Armor: "+2",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "68",
					},
				},
				{
					ID: "acc71656-e891-4bb2-a8ef-fb077bb5eefd",
					Name: "Bunker Gear",
					Category: "Specialty Armor",
					Armor: "6",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "3000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Skillcategory: []common.Skillcategory{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "69",
					},
				},
				{
					ID: "5116893c-8102-4397-b7b8-f568f50560ab",
					Name: "Bunker Gear Helmet",
					Category: "Specialty Armor",
					Armor: "+2",
					ArmorCapacity: "3",
					Avail: "6",
					Cost: "750",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "69",
					},
				},
				{
					ID: "4cf22984-065a-4959-ab6c-2bf1b826f493",
					Name: "Riot Control Armor",
					Category: "Specialty Armor",
					Armor: "14",
					ArmorCapacity: "8",
					Avail: "10R",
					Cost: "5000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "69",
					},
				},
				{
					ID: "9c03e0c2-251a-496b-902b-d0c6743568fd",
					Name: "Riot Control Helmet",
					Category: "Specialty Armor",
					Armor: "+2",
					ArmorCapacity: "6",
					Avail: "6R",
					Cost: "1000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "69",
					},
				},
				{
					ID: "c6b7ed25-c5ff-464c-a6e1-776d9cdb7ac7",
					Name: "SWAT Armor",
					Category: "Specialty Armor",
					Armor: "15",
					ArmorCapacity: "15",
					Avail: "16R",
					Cost: "8000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "70",
					},
				},
				{
					ID: "8408b3e7-87ff-4b6e-bfdc-19433ba356da",
					Name: "SWAT Helmet",
					Category: "Specialty Armor",
					Armor: "+3",
					ArmorCapacity: "8",
					Avail: "10R",
					Cost: "1500",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "70",
					},
				},
				{
					ID: "0997c43e-d59b-433f-b213-4de1cc5ab83a",
					Name: "Securetech PPP: Arms Kit",
					Category: "Specialty Armor",
					Armor: "+1",
					ArmorCapacity: "1",
					Avail: "6",
					Cost: "250",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "70",
					},
				},
				{
					ID: "9bf19d62-ff32-49df-8e70-f1b1f8e8d769",
					Name: "Securetech PPP: Legs Kit",
					Category: "Specialty Armor",
					Armor: "+1",
					ArmorCapacity: "1",
					Avail: "6",
					Cost: "300",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "70",
					},
				},
				{
					ID: "f3e262d5-c6ec-4e2e-9081-21d160d8c21b",
					Name: "Securetech PPP: Vitals Kit",
					Category: "Specialty Armor",
					Armor: "+1",
					ArmorCapacity: "1",
					Avail: "6",
					Cost: "350",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "70",
					},
				},
				{
					ID: "b4a000b6-b256-48c1-a008-541eb13acf4b",
					Name: "Body Armor Bag",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "8",
					Cost: "750",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "70",
					},
				},
				{
					ID: "3134bbd7-350b-4d10-8902-25cb156e094f",
					Name: "Chain Mail",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "2",
					Avail: "8",
					Cost: "900",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "71",
					},
				},
				{
					ID: "deef9bf9-b4a5-4084-baea-98045cdb4389",
					Name: "Padded Leather",
					Category: "Specialty Armor",
					Armor: "7",
					ArmorCapacity: "2",
					Avail: "8",
					Cost: "600",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "72",
					},
				},
				{
					ID: "d90a8823-7387-4c50-bc47-3d63f0ffd543",
					Name: "Ares FlaShield",
					Category: "Specialty Armor",
					Armor: "+6",
					ArmorCapacity: "4",
					Avail: "12R",
					Cost: "4000",
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "72",
					},
				},
				{
					ID: "31675672-3476-4a2f-8acf-605702ae4c66",
					Name: "Murder Armor",
					Category: "Specialty Armor",
					Armor: "13",
					ArmorCapacity: "4",
					Avail: "12R",
					Cost: "5000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "72",
					},
				},
				{
					ID: "1c5f484a-996c-4518-bf23-677a506b2ea5",
					Name: "Forearm Guards",
					Category: "Specialty Armor",
					Armor: "+1",
					ArmorCapacity: "3",
					Avail: "6",
					Cost: "300",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "73",
					},
				},
				{
					ID: "9f88a210-9ec6-4fc5-ad91-ffb7e7051447",
					Name: "Ballistic Mask",
					Category: "Specialty Armor",
					Armor: "+2",
					ArmorCapacity: "8",
					Avail: "6",
					Cost: "150",
					AddModCategory: stringPtr("Customized Ballistic Mask"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "74",
					},
				},
				{
					ID: "608d5c68-aba1-40e5-8100-d2615a39a2f3",
					Name: "Custom Ballistic Mask",
					Category: "Specialty Armor",
					Armor: "+2",
					ArmorCapacity: "8",
					Avail: "6",
					Cost: "300",
					AddModCategory: stringPtr("Customized Ballistic Mask"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "74",
					},
				},
				{
					ID: "3b4717da-bdbf-4ca6-8399-85399afeafa6",
					Name: "Ghillie Suit",
					Category: "Specialty Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "6",
					Cost: "600",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "75",
					},
				},
				{
					ID: "54ce4431-5cbe-461b-bd52-16e9236f0694",
					Name: "Ares Armored Survivalist",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "6",
					Avail: "10",
					Cost: "1500",
					SelectModsFromCategory: &SelectModsFromCategory{
						Category: []string{
							"Custom Liners (Rating 4)",
						},
					},
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "75",
					},
				},
				{
					ID: "984a0c2e-d3e1-4137-bbc7-8a7f9009eac4",
					Name: "Desert Suit",
					Category: "Specialty Armor",
					Armor: "3",
					ArmorCapacity: "2",
					Avail: "8",
					Cost: "1000",
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "75",
					},
				},
				{
					ID: "541acec2-bd2f-4684-b0f8-c85bb45d1e8d",
					Name: "Snake Mesh Socks",
					Category: "Specialty Armor",
					Armor: "+2",
					ArmorCapacity: "0",
					Avail: "6",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "76",
					},
				},
				{
					ID: "a13859be-0889-4554-84b4-7f62a513233e",
					Name: "Coldsuit",
					Category: "Specialty Armor",
					Armor: "0",
					ArmorCapacity: "4",
					Avail: "4",
					Cost: "800",
					WirelessBonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "76",
					},
				},
				{
					ID: "fa5c069b-416c-4938-adf5-62e155455161",
					Name: "Polar Survival Suit",
					Category: "Specialty Armor",
					Armor: "6",
					ArmorCapacity: "6",
					Avail: "8",
					Cost: "2000",
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "76",
					},
				},
				{
					ID: "28c1d806-5db7-4d22-8ce2-66bc8778a29b",
					Name: "Ares Arctic Forces Suit",
					Category: "Specialty Armor",
					Armor: "15",
					ArmorCapacity: "14",
					Avail: "16R",
					Cost: "11000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					WirelessBonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 4 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "77",
					},
				},
				{
					ID: "e76e2b43-e81e-49df-90a6-6f1a466a4009",
					Name: "Ares Armored Coldsuit",
					Category: "Specialty Armor",
					Armor: "9",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "1200",
					Bonus: &common.BaseBonus{
						Fatigueresist: []string{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "78",
					},
				},
				{
					ID: "1b1c717f-740a-41e0-b0fc-605e38575c91",
					Name: "Ares Polar Sneak Suit",
					Category: "Specialty Armor",
					Armor: "6",
					ArmorCapacity: "4",
					Avail: "16F",
					Cost: "10000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "78",
					},
				},
				{
					ID: "025f360f-f143-46a5-bfc7-e4e7ec5af37c",
					Name: "Enclosed Breathing Helmet",
					Category: "Specialty Armor",
					Armor: "+0",
					ArmorCapacity: "6",
					Avail: "8",
					Cost: "900",
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "79",
					},
				},
				{
					ID: "feb98de4-5e5b-473f-a31a-a73ca36d0e1d",
					Name: "Full Face Mask",
					Category: "Specialty Armor",
					Armor: "+0",
					ArmorCapacity: "4",
					Avail: "8",
					Cost: "300",
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "79",
					},
				},
				{
					ID: "b53bd60a-2687-4554-ae10-8309ee3c2991",
					Name: "Drysuit",
					Category: "Specialty Armor",
					Armor: "+0",
					ArmorCapacity: "4",
					Avail: "6",
					Cost: "2500",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "79",
					},
				},
				{
					ID: "f2aab6fa-645a-4d39-a612-91d3ee9e6bce",
					Name: "Diving Armor",
					Category: "Specialty Armor",
					Armor: "7",
					ArmorCapacity: "4",
					Avail: "6",
					Cost: "1750",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "80",
					},
				},
				{
					ID: "321a8d8f-5bbd-46cf-b6f9-3c79e662c311",
					Name: "Arctic Diving Suit",
					Category: "Specialty Armor",
					Armor: "1",
					ArmorCapacity: "4",
					Avail: "8",
					Cost: "3000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "80",
					},
				},
				{
					ID: "81fdc8a3-7106-4b08-a1f4-c72140bc90fc",
					Name: "Evo HEL Suit",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "5",
					Avail: "10",
					Cost: "3000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 5 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "81",
					},
				},
				{
					ID: "ff733b15-c489-467d-b8cf-ac5e24639ed3",
					Name: "Spacesuit",
					Category: "Specialty Armor",
					Armor: "12",
					ArmorCapacity: "6",
					Avail: "16",
					Cost: "12000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 4 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 3 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "81",
					},
				},
				{
					ID: "ed958de6-17e6-47e6-8374-815ae2cba02a",
					Name: "Security Spacesuit",
					Category: "Specialty Armor",
					Armor: "15",
					ArmorCapacity: "10",
					Avail: "24",
					Cost: "25000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 4 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 3 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "81",
					},
				},
				{
					ID: "8c47595f-b22c-44b7-8191-a5fd04f6a07a",
					Name: "Evo Armadillo Armored Spacesuit",
					Category: "Specialty Armor",
					Armor: "16",
					ArmorCapacity: "10",
					Avail: "24R",
					Cost: "35000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 5 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "82",
					},
				},
				{
					ID: "5f6058e9-d026-492e-8f3f-0da6a54d90d6",
					Name: "Magnetic Boots",
					Category: "Specialty Armor",
					Armor: "+0",
					ArmorCapacity: "4",
					Avail: "12",
					Cost: "2500",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "6189e85c-e944-40bf-bad7-4e2c2eb881cd",
					Name: "Survival Bubble, Rating 1",
					Category: "Specialty Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "3",
					Cost: "2000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "05c38a2d-237d-49ba-94b8-e549bdfb5f84",
					Name: "Survival Bubble, Rating 2",
					Category: "Specialty Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "6",
					Cost: "2000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "6f23a99f-40a1-41e0-ac15-f768c04beb82",
					Name: "Survival Bubble, Rating 3",
					Category: "Specialty Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "9",
					Cost: "2000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "cbce4c66-d75e-4fea-8b6a-0564f5ef01c0",
					Name: "Survival Bubble, Rating 4",
					Category: "Specialty Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "12",
					Cost: "2000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "6c773f91-8be3-4610-94f9-bfef1bc1c91d",
					Name: "Survival Bubble, Rating 5",
					Category: "Specialty Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "15",
					Cost: "2000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "5b95ee2b-2e3c-405a-8f56-ee1d78ad4d51",
					Name: "Survival Bubble, Rating 6",
					Category: "Specialty Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "18",
					Cost: "2000",
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "c9861472-4784-44bf-ab25-8d71c03954e6",
					Name: "MCT EE Suit",
					Category: "Specialty Armor",
					Armor: "6",
					ArmorCapacity: "5",
					Avail: "10",
					Cost: "2500",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 3 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "83",
					},
				},
				{
					ID: "93d7a7d9-02d7-418d-a30e-e31cbb21c103",
					Name: "Pneumatic Anti-Shock Garments",
					Category: "Specialty Armor",
					Armor: "3",
					ArmorCapacity: "4",
					Avail: "6",
					Cost: "500",
					SourceReference: common.SourceReference{
						Source: "BB",
						Page: "23",
					},
				},
				{
					ID: "e3ab6aec-a4ef-4a04-92fe-ffca02ebd92a",
					Name: "Shiawase Arms Simoom",
					Category: "Specialty Armor",
					Armor: "+1",
					ArmorCapacity: "0",
					Avail: "14R",
					Cost: "1500",
					AddWeapon: []string{
						"Shiawase Arms Simoom",
					},
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "184",
					},
				},
				{
					ID: "6a50c63e-f6a9-4023-9ee9-d4b13ded6a9e",
					Name: "Cloak",
					Category: "Cloaks",
					Armor: "0",
					ArmorCapacity: "Rating",
					Avail: "1",
					Cost: "100 * Rating",
					Rating: stringPtr("6"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "184",
					},
				},
				{
					ID: "fc4074b5-b48a-43d4-8d9c-25a11da2a6a8",
					Name: "Designer Cloak",
					Category: "Cloaks",
					Armor: "0",
					ArmorCapacity: "Rating",
					Avail: "1",
					Cost: "(100 * Rating) + 300",
					Rating: stringPtr("6"),
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "184",
					},
				},
				{
					ID: "678353a1-b697-442a-aa3a-6e34b9178c4b",
					Name: "Ruthenium Polymer Cloak",
					Category: "Cloaks",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "14F",
					Cost: "4000 * Rating",
					Rating: stringPtr("4"),
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "184",
					},
				},
				{
					ID: "76770acb-ec35-4e8b-ba8c-f757c34ca47f",
					Name: "One-Use Shoes",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "2",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "7fdd5a97-2608-4f5e-b377-744b8001942e",
					Name: "One-Use Pants",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "2",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "cd46bf71-1cc1-4a0c-af75-60f1c91d7daf",
					Name: "One-Use Shirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "2",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "d34a47eb-6f2d-449a-ac81-5a450c776c4a",
					Name: "One-Use Skirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "2",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "dc78601d-7171-470e-8d7d-2e772cbcbfb2",
					Name: "Cheap Shoes",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "024cca53-0d3a-4c89-bb73-a885b7d6111e",
					Name: "Cheap Pants",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "fe363b10-a801-4049-9d5b-1908c6a6b9fc",
					Name: "Cheap Shirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "9a680b0f-adcc-42a1-9ab5-417f51cf6b2f",
					Name: "Cheap Skirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "99912fac-51df-4afb-88d1-1ff1a2c6fd2a",
					Name: "Good Shoes",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "da996700-0e80-48a0-88fa-407828efc902",
					Name: "Good Pants",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "f07da344-b605-4756-9a2e-ec6a40520d09",
					Name: "Good Shirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "f354f55c-17c2-480b-88d2-f2b84ddd5b6f",
					Name: "Good Skirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "b7d83159-2840-4a10-985f-4ef346715c80",
					Name: "Nice Shoes",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "4f17f85d-1dbb-446c-b531-56b2b12997f4",
					Name: "Nice Pants",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "473a06bb-e675-439b-bf60-51849402662d",
					Name: "Nice Shirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "2665c5dd-cb7b-40f6-afc3-ea820136948b",
					Name: "Nice Skirt",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "d0ff6dbc-e089-4ad0-88e3-79db8ff9f5b1",
					Name: "Cheap Dress",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "a2deaf94-855d-4d90-a711-07d590e22618",
					Name: "Cheap Suit",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "fdcdc666-a830-4b5c-8215-c61aae183d95",
					Name: "Good Dress",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "4",
					Cost: "1000",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "3a2a9343-7c56-480a-90c8-e510be2ea80f",
					Name: "Good Suit",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "4",
					Cost: "1000",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "0f452a31-054c-48f2-9021-9b430c07301e",
					Name: "Nice Dress",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "8",
					Cost: "10000",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "9414386d-cc22-4dd9-9a0a-ce94c79d4f09",
					Name: "Nice Suit",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "8",
					Cost: "10000",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "7c2bb0b3-ae60-4c27-a720-561ad6953e83",
					Name: "Tuxedo Rental",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "75",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "2b09566c-ece5-497d-bafd-600f9cec9763",
					Name: "Hat",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "20",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "ec3b8987-f7d2-470d-ab08-72325b2c6a12",
					Name: "Ski Mask",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "5",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "040b3f4b-014c-46fa-bdf8-1a96334ecc27",
					Name: "Coveralls",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "1e440489-b800-4e5f-904b-98ef1591402b",
					Name: "Cheap Socks",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "2",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "7e13ee6d-5698-4b1e-bf93-7735bec4c0bc",
					Name: "Cheap Undergarments",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "2",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "079d6bd6-d778-4bff-a2fb-23e849e74ec4",
					Name: "Good Socks",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "68eabf76-7e06-41a7-8717-2fdce3be8082",
					Name: "Good Undergarments",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "5293b8a8-32fd-4df4-ae86-6b909b952432",
					Name: "Nice Socks",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "675b4735-227e-4395-8f62-bd9a62670474",
					Name: "Nice Undergarments",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "bc259ccc-e96b-48b4-a3ac-0ff67b35b24f",
					Name: "One-Use Gloves",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "2",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "d8016291-050d-413d-8896-0ee1bc1063a6",
					Name: "Cheap Gloves",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "f93ceb9d-1736-4e51-b550-0275822c4d3e",
					Name: "Cheap Watch",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "fd904a19-c1d3-4926-90a8-697dc77ea42b",
					Name: "Cheap Jewelry",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "feff1c2b-deab-4280-bc98-55e9b856bb42",
					Name: "Good Gloves",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "86a9692a-ad7c-4c37-bd52-aac1680c91a0",
					Name: "Good Watch",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "4a2e90f7-487a-4fa2-a51d-1d9695e0f66f",
					Name: "Good Jewelry",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "e98c2113-306a-4596-abcb-46607c432cfb",
					Name: "Nice Gloves",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "7e081824-e64e-4d7a-8621-eba30197362a",
					Name: "Nice Watch",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "9fc5642a-1670-4907-82cb-179a441d11f0",
					Name: "Nice Jewelry",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "f3cc02db-5049-462c-957b-75859e852408",
					Name: "Decent Diamond Ring",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "500",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "5bdb85d7-41b9-4885-a37c-fc27f6b2c2e0",
					Name: "Large Diamond Ring",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "5000",
					SourceReference: common.SourceReference{
						Source: "RF",
						Page: "253",
					},
				},
				{
					ID: "beae253f-bd4f-495e-89ab-63a07ef8d82a",
					Name: "Sensor Collar",
					Category: "Specialty Armor",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "2",
					Cost: "200",
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "HS",
						Page: "185",
					},
				},
				{
					ID: "39ba5cd4-01f2-4202-8ed2-fba09f490fbb",
					Name: "Critter Body Armor",
					Category: "Specialty Armor",
					Armor: "Rating",
					ArmorCapacity: "Rating",
					Avail: "6",
					Cost: "50 * Rating",
					Rating: stringPtr("24"),
					SourceReference: common.SourceReference{
						Source: "HS",
						Page: "185",
					},
				},
				{
					ID: "c38ca685-f333-4529-93e8-a8248df52e64",
					Name: "Team Jersey (Licensed)",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "8",
					Avail: "4",
					Cost: "750",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CA",
						Page: "136",
					},
				},
				{
					ID: "6adcc6aa-cb83-434f-b9a4-2c263f738829",
					Name: "Team Jersey (Unlicensed)",
					Category: "Specialty Armor",
					Armor: "6",
					ArmorCapacity: "6",
					Avail: "2",
					Cost: "500",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 2 items omitted
						},
						Selecttext: nil, // Omitted complex structure
					},
					SourceReference: common.SourceReference{
						Source: "CA",
						Page: "136",
					},
				},
				{
					ID: "b9554fe8-fc04-4746-8f5f-32d5ee9053be",
					Name: "Ares Briefcase Shield",
					Category: "Armor",
					Armor: "+4",
					ArmorCapacity: "0",
					Avail: "14R",
					Cost: "1800",
					AddWeapon: []string{
						"Ares Briefcase Shield",
					},
					SourceReference: common.SourceReference{
						Source: "CA",
						Page: "136",
					},
				},
				{
					ID: "c9424dfb-1e01-4073-995a-7935efc1894d",
					Name: "Catsuit",
					Category: "Specialty Armor",
					Armor: "9",
					ArmorCapacity: "10",
					Avail: "6",
					Cost: "900",
					SourceReference: common.SourceReference{
						Source: "CA",
						Page: "136",
					},
				},
				{
					ID: "f22a86ba-e660-4c32-a998-d04def23d287",
					Name: "Scout's Tux",
					Category: "Specialty Armor",
					Armor: "8",
					ArmorCapacity: "6",
					Avail: "10",
					Cost: "2000",
					Bonus: &common.BaseBonus{
						Sociallimit: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "CA",
						Page: "136",
					},
				},
				{
					ID: "134e6912-d3b8-47cc-8804-fc02e66a0ee6",
					Name: "Form Fitting, Shirt (2050)",
					Category: "Armor",
					Armor: "+1",
					ArmorCapacity: "0",
					Avail: "3",
					Cost: "150",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "6747e88b-b884-4400-aa33-3ccbbe71f135",
					Name: "Form Fitting, Half Suit (2050)",
					Category: "Armor",
					Armor: "+2",
					ArmorCapacity: "0",
					Avail: "4",
					Cost: "250",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "40544ce0-eee7-4273-80fe-ffa111fa9c35",
					Name: "Form Fitting, Full Suit (2050)",
					Category: "Armor",
					Armor: "+3",
					ArmorCapacity: "0",
					Avail: "5",
					Cost: "500",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "5cc0962f-a803-46a1-b077-a22528da13f6",
					Name: "Lined Coat (2050)",
					Category: "Armor",
					Armor: "9",
					ArmorCapacity: "9",
					Avail: "2",
					Cost: "700",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "cd1e1725-6c1f-4e15-83ad-e6f30d3d0b6e",
					Name: "Helmet (2050)",
					Category: "Armor",
					Armor: "+2",
					ArmorCapacity: "9",
					Avail: "12",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "27b0f29c-87e0-44f1-bff4-00e733b367fb",
					Name: "Clothing, Ordinary (2050)",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "50",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "c4a7c60c-d2e0-419c-bdc8-efabdfa114c1",
					Name: "Clothing, Fine (2050)",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "500",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "84cf66ad-15e7-48cc-a587-f0716e4b9d4b",
					Name: "Clothing, Tres Chic (2050)",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "Variable(1000-100000)",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "11986c47-c928-4a5b-9667-ae4860caeacc",
					Name: "Leather, Synthetic (2050)",
					Category: "Armor",
					Armor: "3",
					ArmorCapacity: "3",
					Avail: "0",
					Cost: "250",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "7df0bbe3-b616-4942-816d-2b5e57617a38",
					Name: "Leather, Real (2050)",
					Category: "Armor",
					Armor: "4",
					ArmorCapacity: "4",
					Avail: "0",
					Cost: "750",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "811d9335-d784-4d69-a7de-6551bac37ea8",
					Name: "Armor Jacket (2050)",
					Category: "Armor",
					Armor: "12",
					ArmorCapacity: "12",
					Avail: "3",
					Cost: "900",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "52f8cc10-655b-4813-b038-f135d6a24786",
					Name: "Armor Clothing (2050)",
					Category: "Armor",
					Armor: "6",
					ArmorCapacity: "6",
					Avail: "2",
					Cost: "500",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "bd6dd017-c6b8-4df2-a96f-eb920fc5499d",
					Name: "Armor Vest (2050)",
					Category: "Armor",
					Armor: "9",
					ArmorCapacity: "9",
					Avail: "2",
					Cost: "200",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "4ca1e01b-24bb-42f9-a27d-b284a13e739b",
					Name: "Heavy Armor, Full (2050)",
					Category: "Armor",
					Armor: "18",
					ArmorCapacity: "18",
					Avail: "16R",
					Cost: "20000",
					AddModCategory: stringPtr("Full Body Armor Mods"),
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "fc36610c-5a0a-4757-852c-062e59b1a568",
					Name: "Heavy Armor, Partial (2050)",
					Category: "Armor",
					Armor: "15",
					ArmorCapacity: "15",
					Avail: "8R",
					Cost: "10000",
					SourceReference: common.SourceReference{
						Source: "2050",
						Page: "192",
					},
				},
				{
					ID: "7f87a60e-67f8-4952-8c3a-8de22fd76a06",
					Name: "E'lyzée Elio: Bra's Suit",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "8",
					Cost: "3500",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "91",
					},
				},
				{
					ID: "1af8a121-e0b6-4ea1-bcb1-a51e200d05a1",
					Name: "E'lyzée Elio: Tha'il Dress",
					Category: "High-Fashion Armor Clothing",
					Armor: "6",
					ArmorCapacity: "2",
					Avail: "10",
					Cost: "4500",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "91",
					},
				},
				{
					ID: "7418141b-ec31-4334-a642-6acf469c0e5f",
					Name: "E'lyzée Elio: Bra's Cape",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "12",
					Avail: "10",
					Cost: "4000",
					ArmorOverride: stringPtr("+2"),
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "91",
					},
				},
				{
					ID: "7cc0ee32-7f67-495c-91d1-2ab9e19ec54b",
					Name: "E'lyzée Elio: Tha'il Cape",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "8",
					Cost: "1500",
					ArmorOverride: stringPtr("+2"),
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "91",
					},
				},
				{
					ID: "60c7a349-d3a9-4a5c-a9cc-6e9d473c1e20",
					Name: "Franzinger Fashion Tenor: Tailcoat Combination",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "5",
					Avail: "8",
					Cost: "2400",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "92",
					},
				},
				{
					ID: "6dad32b2-8714-4dab-a9e7-0692f233a2e7",
					Name: "Franzinger Fashion Tenor: Coat",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "8",
					Avail: "8",
					Cost: "3200",
					ArmorOverride: stringPtr("+2"),
					SelectModsFromCategory: &SelectModsFromCategory{
						Category: []string{
							"Custom Liners (Rating 3)",
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "92",
					},
				},
				{
					ID: "afa5351a-8da5-48f4-90c3-5baf04178534",
					Name: "Rheingold Pro Tec Plus: Suit",
					Category: "High-Fashion Armor Clothing",
					Armor: "9",
					ArmorCapacity: "5",
					Avail: "8",
					Cost: "2700",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "92",
					},
				},
				{
					ID: "92123f54-66ae-4945-a4c5-c0baf36801fa",
					Name: "Rheingold Pro Tec Plus: Coat",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "10",
					Avail: "10",
					Cost: "3500",
					ArmorOverride: stringPtr("+3"),
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "92",
					},
				},
				{
					ID: "afbd4fed-07ef-4ff2-ba8e-b5a6696d4b6b",
					Name: "StattKrieg: Armor Vest",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "4",
					Avail: "4",
					Cost: "550",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "93",
					},
				},
				{
					ID: "81a3db95-9248-4645-bc9d-b65e422455a5",
					Name: "StattKrieg: Armor Jacket",
					Category: "High-Fashion Armor Clothing",
					Armor: "10",
					ArmorCapacity: "5",
					Avail: "4",
					Cost: "800",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "93",
					},
				},
				{
					ID: "2d77e609-b848-468d-bac0-ed3ae296f2dd",
					Name: "StattKrieg: Padded Overall",
					Category: "High-Fashion Armor Clothing",
					Armor: "8",
					ArmorCapacity: "8",
					Avail: "6",
					Cost: "550",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "93",
					},
				},
				{
					ID: "369adf84-0fe4-41b4-a837-ad2a34201f81",
					Name: "StattKrieg: Helmet",
					Category: "High-Fashion Armor Clothing",
					Armor: "+2",
					ArmorCapacity: "2",
					Avail: "4",
					Cost: "150",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SAG",
						Page: "93",
					},
				},
				{
					ID: "efa1f97d-1408-4f75-befe-4e0b22f9f2c5",
					Name: "Rockblood Old School Line",
					Category: "Armor",
					Armor: "8",
					ArmorCapacity: "10",
					Avail: "8",
					Cost: "1900",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "TCT",
						Page: "186",
					},
				},
				{
					ID: "74ccca34-925c-4149-a58b-501e69cabe46",
					Name: "Rockblood Signature Armored Shirt",
					Category: "Armor",
					Armor: "6",
					ArmorCapacity: "4",
					Avail: "14",
					Cost: "800",
					Bonus: &common.BaseBonus{
						Specificskill: []common.Specificskill{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "TCT",
						Page: "186",
					},
				},
				{
					ID: "403adcb1-0739-4b20-816f-7854005eb227",
					Name: "Urban Explorer Daedalus",
					Category: "Specialty Armor",
					Armor: "9",
					ArmorCapacity: "4",
					Avail: "8",
					Cost: "3200",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SL",
						Page: "48",
					},
				},
				{
					ID: "7f7cfaaf-d28c-4cd2-b1c2-55ece741732f",
					Name: "Urban Explorer Daedalus: Helmet",
					Category: "Specialty Armor",
					Armor: "+2",
					ArmorCapacity: "6",
					Avail: "0",
					Cost: "100",
					SourceReference: common.SourceReference{
						Source: "SL",
						Page: "48",
					},
				},
				{
					ID: "40cf0da9-29d7-4a7b-8ef0-822ba05917b7",
					Name: "Ares Arms Bug Stomper Custom Armor",
					Category: "Armor",
					Armor: "20",
					ArmorCapacity: "20",
					Avail: "30F",
					Cost: "35000",
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SL",
						Page: "130",
					},
				},
				{
					ID: "8136ccfb-d5ce-4e18-bc4a-21d33bb6b089",
					Name: "Yamatetsu Naval Technologies Rampart",
					Category: "Armor",
					Armor: "+10",
					ArmorCapacity: "10",
					Avail: "12F",
					Cost: "3000",
					SourceReference: common.SourceReference{
						Source: "SL",
						Page: "130",
					},
				},
				{
					ID: "5ad79730-ee4b-4191-822d-205af7320281",
					Name: "Pantheon Industries Hard Case CCOB",
					Category: "Armor",
					Armor: "12",
					ArmorCapacity: "8",
					Avail: "12R",
					Cost: "1700",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 6 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "KC",
						Page: "70",
					},
				},
				{
					ID: "62ad0f12-c603-4c88-b778-e456ca2355f6",
					Name: "Generic CCOB",
					Category: "Armor",
					Armor: "8",
					ArmorCapacity: "8",
					Avail: "10",
					Cost: "1000",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "KC",
						Page: "70",
					},
				},
				{
					ID: "4b16a172-b328-4717-b632-39a3d07eeb41",
					Name: "FleetHead Sou'wester",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "3",
					Avail: "4",
					Cost: "200",
					Gears: &ArmorGears{
						UseGear: []ArmorUseGear{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "HAMG",
						Page: "173",
					},
				},
				{
					ID: "fc1c9de6-4600-4c14-8e8a-9fed51389e4a",
					Name: "Rheingold Oilskin",
					Category: "Armor",
					Armor: "8",
					ArmorCapacity: "6",
					Avail: "6",
					Cost: "850",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "HAMG",
						Page: "173",
					},
				},
				{
					ID: "e8065f02-68f3-46f6-8cca-298a1806b97b",
					Name: "Ares Victory Oilskin",
					Category: "Armor",
					Armor: "6",
					ArmorCapacity: "5",
					Avail: "7",
					Cost: "920",
					Mods: &ArmorItemMods{
						Name: []ArmorModName{
							// 2 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "HAMG",
						Page: "173",
					},
				},
				{
					ID: "c05c3865-7a13-4c49-989e-a258b71f0d0c",
					Name: "Trenchcoat",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "100",
					SourceReference: common.SourceReference{
						Source: "NF",
						Page: "173",
					},
				},
				{
					ID: "257d642f-c90b-4dac-90c8-7a4f9a1ccdd0",
					Name: "Fedora",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "30",
					SourceReference: common.SourceReference{
						Source: "NF",
						Page: "173",
					},
				},
				{
					ID: "a9135760-65dd-4c77-84a1-ed6460cf350e",
					Name: "Trilby",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "20",
					SourceReference: common.SourceReference{
						Source: "NF",
						Page: "173",
					},
				},
				{
					ID: "b91be09d-b428-495c-a334-31b316a4ef79",
					Name: "Homburg",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "40",
					SourceReference: common.SourceReference{
						Source: "NF",
						Page: "173",
					},
				},
				{
					ID: "90d87a38-fe51-4bbf-bbb3-5b26cacd9834",
					Name: "Bowler",
					Category: "Clothing",
					Armor: "0",
					ArmorCapacity: "0",
					Avail: "0",
					Cost: "10",
					SourceReference: common.SourceReference{
						Source: "NF",
						Page: "173",
					},
				},
			},
		},
	},
	Mods: []ArmorModItems{
		{
			Mod: []ArmorModItem{
				{
					ID: "9ee8e6ad-2472-485d-ae42-d1978749b456",
					Name: "Electrochromic Clothing",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "+2",
					Cost: "500",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "3fdd4706-9052-4c6b-8c2c-61dbb5c1f16f",
					Name: "Feedback Clothing",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[3]",
					Avail: "8",
					Cost: "500",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "142031f9-ab13-4dd0-a5a4-2cc4d06055ea",
					Name: "(Synth)Leather",
					Category: "Clothing",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "200",
					Armor: stringPtr("4"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "480b7c5d-758b-4833-8bfd-9487e2455f7d",
					Name: "Chemical Protection",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "FixedValues([1],[2],[3],[4],[5],[6])",
					Avail: "6",
					Cost: "Rating * 250",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "1e002d2e-cd93-4cef-a666-b6c6449f4e9f",
					Name: "Chemical Seal",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[6]",
					Avail: "12R",
					Cost: "3000",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactimmune: []bool{
							// 1 items omitted
						},
						Pathogeninhalationimmune: []bool{
							// 1 items omitted
						},
						Toxincontactimmune: []bool{
							// 1 items omitted
						},
						Toxininhalationimmune: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "dd246520-7306-40fb-88b4-c9cb031208fc",
					Name: "Fire Resistance",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "FixedValues([1],[2],[3],[4],[5],[6])",
					Avail: "6",
					Cost: "Rating * 250",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "497b5d6b-df0c-401d-91de-42a224b1fa87",
					Name: "Insulation",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "FixedValues([1],[2],[3],[4],[5],[6])",
					Avail: "6",
					Cost: "Rating * 250",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "0cfb049a-a1bd-4daa-96be-9468c37d9c3c",
					Name: "Nonconductivity",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "FixedValues([1],[2],[3],[4],[5],[6])",
					Avail: "6",
					Cost: "Rating * 250",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Electricityarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "438",
					},
				},
				{
					ID: "ba32a6e9-4e6f-47fe-8fd7-c3194a5174d6",
					Name: "Thermal Damping",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "FixedValues([1],[2],[3],[4],[5],[6])",
					Avail: "10R",
					Cost: "Rating * 500",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "438",
					},
				},
				{
					ID: "71c20b15-de11-49eb-93fe-f4d7491283e3",
					Name: "Full Body Armor: Helmet",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "500",
					Armor: stringPtr("+3"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "69423033-a7f8-4b80-96c6-0c4a91cd32aa",
					Name: "Full Body Armor: Chemical Seal",
					Category: "Full Body Armor Mods",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "+6",
					Cost: "6000",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactimmune: []bool{
							// 1 items omitted
						},
						Pathogeninhalationimmune: []bool{
							// 1 items omitted
						},
						Toxincontactimmune: []bool{
							// 1 items omitted
						},
						Toxininhalationimmune: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "ab16b276-00b3-402e-8629-b38e2905e12f",
					Name: "Full Body Armor: Environment Adaptation",
					Category: "Full Body Armor Mods",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "+3",
					Cost: "1000",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "812a7926-3980-4c26-9935-5f1b66abacda",
					Name: "Urban Explorer Jumpsuit: Helmet",
					Category: "Urban Explorer Jumpsuit Accessories",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "100",
					Armor: stringPtr("+2"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "dbdaf817-9bfa-4938-a195-b53c63b53e7c",
					Name: "Shock Frills",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[2]",
					Avail: "6R",
					Cost: "250",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "438",
					},
				},
				{
					ID: "84c3dbd2-6d47-4045-a5d6-7dc926b3ff42",
					Name: "Liner - Fire Resistance (6)",
					Category: "Custom Liners (Rating 6)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "0cbf733c-1fd0-48ae-be2c-b3afe0036fd0",
					Name: "Liner - Chemical Protection (6)",
					Category: "Custom Liners (Rating 6)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "af3208a9-05b5-47bb-92a1-f3d2ea82f6f0",
					Name: "Liner - Insulation (6)",
					Category: "Custom Liners (Rating 6)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "a2d20826-cc8f-4cb7-84b9-70aee5daae71",
					Name: "Liner - Fire Resistance (5)",
					Category: "Custom Liners (Rating 5)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "995423dc-2fb4-405c-943f-261e6f52df15",
					Name: "Liner - Chemical Protection (5)",
					Category: "Custom Liners (Rating 5)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "53669b97-36a8-4c54-b894-76c507933be9",
					Name: "Liner - Insulation (5)",
					Category: "Custom Liners (Rating 5)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "b3965c7d-3e19-4aad-9dc0-1ec5b62daea5",
					Name: "Liner - Fire Resistance (4)",
					Category: "Custom Liners (Rating 4)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "ca385470-fdfb-4ac2-bb4d-f88de768541b",
					Name: "Liner - Chemical Protection (4)",
					Category: "Custom Liners (Rating 4)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "a0043353-1825-42cb-94b2-ddf35b3089b5",
					Name: "Liner - Insulation (4)",
					Category: "Custom Liners (Rating 4)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "f22cd9de-78ce-4ec1-9485-932c47638f52",
					Name: "Liner - Fire Resistance (3)",
					Category: "Custom Liners (Rating 3)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "ba6e7ab8-9e19-41ea-b124-bad6c8d1a515",
					Name: "Liner - Chemical Protection (3)",
					Category: "Custom Liners (Rating 3)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "cee9f035-3668-4736-b0f2-7607d7156995",
					Name: "Liner - Insulation (3)",
					Category: "Custom Liners (Rating 3)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "8a119129-4c6f-40ab-9832-a61295ee715f",
					Name: "Liner - Fire Resistance (2)",
					Category: "Custom Liners (Rating 2)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "fed9e56c-c1b8-4c68-a16a-4bceb011bc62",
					Name: "Liner - Chemical Protection (2)",
					Category: "Custom Liners (Rating 2)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "1bff09e4-ea20-4705-ac7b-5bea4a03d925",
					Name: "Liner - Insulation (2)",
					Category: "Custom Liners (Rating 2)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "825652da-5c82-4362-b84e-9fee4c5c6fe1",
					Name: "Liner - Fire Resistance (1)",
					Category: "Custom Liners (Rating 1)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Firearmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "38942921-ff61-4cdc-937e-3afc951dfcc8",
					Name: "Liner - Chemical Protection (1)",
					Category: "Custom Liners (Rating 1)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Pathogencontactresist: []string{
							// 1 items omitted
						},
						Toxincontactresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "2cd3a1ed-e44e-4e62-a1d8-9d7271e97575",
					Name: "Liner - Insulation (1)",
					Category: "Custom Liners (Rating 1)",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Coldarmor: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "SR5",
						Page: "437",
					},
				},
				{
					ID: "38168e21-833e-4ab3-8e5c-186468b70ef9",
					Name: "Custom Fit",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "0d74f2f6-74bf-4c7e-afdf-d44f24c3ac12",
					Name: "Custom Fit (Stack)",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Selectarmor: []bool{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "6a4274bb-307d-433d-a1a7-75be52eacb93",
					Name: "Gear Access",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "13835ff2-7b9e-47c3-9d8b-7b9a2dbe499d",
					Name: "Newest Model",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "a164ac4e-4225-4d82-9785-02ffd39f6566",
					Name: "Illuminating",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "8be2bd6a-5fe5-4931-8d6e-9cb95a0b959f",
					Name: "Restrictive",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "ebabbd5f-6fd9-4b9a-9350-a251e8652b4b",
					Name: "Padded",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "6226742c-d950-46af-af1a-fc483e14be5c",
					Name: "Concealability",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "59",
					},
				},
				{
					ID: "53a61bf1-65c3-4c28-b47f-026de40973a4",
					Name: "Rapid Transit: Elite",
					Category: "Rapid Transit Detailing",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "600",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "65",
					},
				},
				{
					ID: "a071b454-8a50-4c76-a162-8e086b0ec001",
					Name: "Rapid Transit: Platinum",
					Category: "Rapid Transit Detailing",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "1100",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "65",
					},
				},
				{
					ID: "9a1a569f-4c0c-4291-af5b-89e1334e95b4",
					Name: "Rapid Transit: Diamond",
					Category: "Rapid Transit Detailing",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "2400",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Limitmodifier: []common.Limitmodifier{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "65",
					},
				},
				{
					ID: "a7d97d66-1f6e-4521-a283-907ca1cd7436",
					Name: "Nightshade IR and Contacts",
					Category: "Nightshade IR",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "1500",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "8b1bc34c-4de9-4111-a5f6-bae7fa35b8af",
					Name: "Ballistic Mask",
					Category: "Customized Ballistic Mask",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "150",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "62",
					},
				},
				{
					ID: "5a0965bd-759c-4e41-8c47-2b87c9de06d6",
					Name: "Auto-Injector",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[2]",
					Avail: "4",
					Cost: "1500",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "84",
					},
				},
				{
					ID: "1a76f859-9511-42cc-85a7-560b813f6a92",
					Name: "Fresnel Fabric",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "[2]",
					Avail: "14R",
					Cost: "Rating * 1000",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "84",
					},
				},
				{
					ID: "6c18ff9b-7b46-4311-ac4b-a57733d01df7",
					Name: "Pulse Weave",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "[3]",
					Avail: "+8R",
					Cost: "Rating * 3000",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "84",
					},
				},
				{
					ID: "13047906-3ea3-425c-a3ff-4666cb1a05f5",
					Name: "Shock Weave",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[3]",
					Avail: "8",
					Cost: "1000",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "84",
					},
				},
				{
					ID: "c5a66977-3a0b-489f-b7e5-e30965171f8b",
					Name: "Universal Mirror Material",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "[3]",
					Avail: "4",
					Cost: "Rating * 250",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "84",
					},
				},
				{
					ID: "cf8accf5-4117-4419-ab73-957489038ab9",
					Name: "YNT Softweave Armor",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[-(Capacity * 0.5 + 0.5*(Capacity mod 2))]",
					Avail: "+4",
					Cost: "Armor Cost",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "84",
					},
				},
				{
					ID: "63f94362-9778-47a6-8317-f306b199277e",
					Name: "Ruthenium Polymer Coating",
					Category: "General",
					MaxRating: "4",
					ArmorCapacity: "[4]",
					Avail: "16F",
					Cost: "Rating * 5000",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "85",
					},
				},
				{
					ID: "b5283cb0-3676-44d3-a7e9-dee099416295",
					Name: "Radiation Shielding",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "FixedValues([1],[2],[3],[4],[5],[6])",
					Avail: "Rating * 2",
					Cost: "Rating * 200",
					Armor: stringPtr("0"),
					Bonus: &common.BaseBonus{
						Radiationresist: []string{
							// 1 items omitted
						},
					},
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "84",
					},
				},
				{
					ID: "ed43ded4-1b2f-410a-9322-166c39306d03",
					Name: "Gel Packs",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "6",
					Cost: "1500",
					Armor: stringPtr("+2"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "85",
					},
				},
				{
					ID: "a523fbcf-58d5-4727-9dd5-6fbe6b4acbdf",
					Name: "Responsive Interface Gear: Armor",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[4]",
					Avail: "8",
					Cost: "2500",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "85",
					},
				},
				{
					ID: "a9c0aeb2-e7c5-4cc3-819e-f865545c7b66",
					Name: "Responsive Interface Gear: Helmet",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[2]",
					Avail: "0",
					Cost: "0",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "RG",
						Page: "85",
					},
				},
				{
					ID: "9e96176f-1a4d-45dd-94d4-fba00ccffcf2",
					Name: "Pneumatic Anti-Shock Garment",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[6]",
					Avail: "6",
					Cost: "500",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "BB",
						Page: "23",
					},
				},
				{
					ID: "aec187e5-5eca-4f27-9181-b39991579d76",
					Name: "Drag Handle",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[1]",
					Avail: "0",
					Cost: "50",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "BB",
						Page: "23",
					},
				},
				{
					ID: "4e673143-6a61-4075-95c6-1950b9eda8e0",
					Name: "Concealed Pocket",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[1]",
					Avail: "4",
					Cost: "40",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "49addc2c-ee9b-4f97-9c4b-4d49259734bc",
					Name: "Attachable Gear Access",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[4]",
					Avail: "4",
					Cost: "150",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "c3ea670b-45e7-4b75-a85d-1801c91d1c8c",
					Name: "Faraday Pocket",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[1]",
					Avail: "7R",
					Cost: "50",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "ff4c87d4-da62-4b85-b1a3-8de9a0d2838a",
					Name: "Biofiber Pocket",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[2]",
					Avail: "10F",
					Cost: "700",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "HT",
						Page: "185",
					},
				},
				{
					ID: "151d8957-aeb1-4fda-af19-35f4c9c602e1",
					Name: "Voidblack Coating",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[6]",
					Avail: "14F",
					Cost: "3000",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "CA",
						Page: "138",
					},
				},
				{
					ID: "851f226f-2116-4001-8937-408d4570396e",
					Name: "AR Fashion",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "50",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "CA",
						Page: "138",
					},
				},
				{
					ID: "0a7930f5-5466-439a-956d-2bba57f25ed9",
					Name: "Parachute (Urban Explorer Daedalus)",
					Category: "General",
					MaxRating: "0",
					ArmorCapacity: "[0]",
					Avail: "8",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "SL",
						Page: "48",
					},
				},
				{
					ID: "f4c1163d-bf9e-42c5-8504-37b21c01531e",
					Name: "Pantheon Armored Shell",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "4",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "KC",
						Page: "73",
					},
				},
				{
					ID: "52b315a3-cf10-4534-a0d9-86b4ac346136",
					Name: "Pantheon Quick-Charge Battery Pack",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "4",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "KC",
						Page: "73",
					},
				},
				{
					ID: "c2fdc729-bc1d-4d3a-a0da-1d5dfa3b897d",
					Name: "Micro-Hardpoint",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "KC",
						Page: "73",
					},
				},
				{
					ID: "b7be75a4-72ff-49a2-8b7b-0bf36a9f40d8",
					Name: "Internal Air Tank (5 Minutes)",
					Category: "General",
					MaxRating: "1",
					ArmorCapacity: "[0]",
					Avail: "0",
					Cost: "0",
					Visibility: common.Visibility{
						Hide: stringPtr(""),
					},
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "HAMG",
						Page: "173",
					},
				},
				{
					ID: "80effbdd-047d-4b1f-8159-f13f86bba4e6",
					Name: "Grey Mana Integration",
					Category: "General",
					MaxRating: "6",
					ArmorCapacity: "[Rating]",
					Avail: "FixedValues(6F,6F,6F,9F,9F,9F)",
					Cost: "FixedValues(Rating*1000,Rating*1000,Rating*1000,Rating*2000,Rating*2000,Rating*2000)",
					Armor: stringPtr("0"),
					SourceReference: common.SourceReference{
						Source: "BTB",
						Page: "156",
					},
				},
			},
		},
	},
}

// GetArmorData returns the loaded armor data.
func GetArmorData() *ArmorChummer {
	return armorData
}

// GetAllArmor returns all armor items.
func GetAllArmor() []ArmorItem {
	if len(armorData.Armors) == 0 {
		return []ArmorItem{}
	}
	return armorData.Armors[0].Armor
}

// GetArmorByID returns the armor item with the given ID, or nil if not found.
func GetArmorByID(id string) *ArmorItem {
	items := GetAllArmor()
	for i := range items {
		if items[i].ID == id {
			return &items[i]
		}
	}
	return nil
}

// GetAllArmorMods returns all armor mods.
func GetAllArmorMods() []ArmorModItem {
	if len(armorData.Mods) == 0 {
		return []ArmorModItem{}
	}
	return armorData.Mods[0].Mod
}

// GetArmorModByID returns the armor mod with the given ID, or nil if not found.
func GetArmorModByID(id string) *ArmorModItem {
	mods := GetAllArmorMods()
	for i := range mods {
		if mods[i].ID == id {
			return &mods[i]
		}
	}
	return nil
}
