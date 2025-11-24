package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// Code generated from vehicles.xml. DO NOT EDIT.

var vehiclesData = &VehiclesChummer{
	Categories: []VehicleCategories{
		{
			Category: []VehicleCategory{
				{
					Content: "Bikes",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Cars",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Trucks",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Municipal/Construction",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Corpsec/Police/Military",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Boats",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Submarines",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Fixed-Wing Aircraft",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "LTAV",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Rotorcraft",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "VTOL/VSTOL",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Micro",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Mini",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Small",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Medium",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Anthro",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Large",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Huge",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Drones: Missile",
					Blackmarket: stringPtr("Vehicles"),
				},
			},
		},
	},
	ModCategories: []ModCategories{
		{
			Category: []ModCategory{
				{
					Content: "Body",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Cosmetic",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Electromagnetic",
					Blackmarket: stringPtr("Software,Vehicles"),
				},
				{
					Content: "Model-Specific",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Powertrain",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Protection",
					Blackmarket: stringPtr("Vehicles"),
				},
				{
					Content: "Weapons",
					Blackmarket: stringPtr("Vehicles"),
				},
			},
		},
	},
	WeaponMountCategories: []WeaponMountCategories{
		{
			Category: []WeaponMountCategory{
				{
					Content: "Size",
					Blackmarket: stringPtr("Vehicles"),
				},
			},
		},
	},
	Vehicles: &Vehicles{
		Vehicle: []Vehicle{
			// 380 vehicles omitted (complex nested structure)
		},
	},
	Mods: &VehicleMods{},
	// Complex mods structure omitted
	WeaponMounts: &WeaponMountItems{
		WeaponMount: []WeaponMountItem{
			{
				ID: "ccc4f175-0a93-4a27-a069-29d5ba8375e2",
				Name: "Built-In",
				Avail: "0",
				Category: "Size",
				Cost: "0",
				Visibility: common.Visibility{
					Hide: stringPtr(""),
				},
				SourceReference: common.SourceReference{
					Source: "SR5",
					Page: "0",
				},
				Slots: stringPtr("0"),
			},
			{
				ID: "079a5c61-aee6-4383-81b7-32540f7a0a0b",
				Name: "Standard [SR5]",
				Avail: "8F",
				Category: "Size",
				Cost: "2500",
				SourceReference: common.SourceReference{
					Source: "SR5",
					Page: "461",
				},
				Slots: stringPtr("3"),
				WeaponCategories: stringPtr("Blades,Clubs,Exotic Melee Weapons,Crossbows,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Shotguns,Exotic Ranged Weapons,Flamethrowers,Special Weapons,Sporting Rifles"),
				Required: &common.Required{},
			},
			{
				ID: "a567c5d3-38b8-496a-add8-1e176384e935",
				Name: "Heavy [SR5]",
				Avail: "14F",
				Category: "Size",
				Cost: "5000",
				SourceReference: common.SourceReference{
					Source: "SR5",
					Page: "461",
				},
				Slots: stringPtr("6"),
				WeaponCategories: stringPtr("Blades,Clubs,Exotic Melee Weapons,Crossbows,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Sniper Rifles,Shotguns,Grenade Launchers,Missile Launchers,Laser Weapons,Light Machine Guns,Medium Machine Guns,Heavy Machine Guns,Assault Cannons,Flamethrowers,Sporting Rifles,Exotic Ranged Weapons"),
				Required: &common.Required{},
			},
			{
				ID: "1b44540c-b463-47ed-b288-cf4a8e130eab",
				Name: "Light",
				Avail: "6F",
				Category: "Size",
				Cost: "750",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("1"),
				WeaponCategories: stringPtr("Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns"),
				Forbidden: &common.Forbidden{},
			},
			{
				ID: "4e9da56b-622c-439f-9718-98ac3a792351",
				Name: "Standard",
				Avail: "8F",
				Category: "Size",
				Cost: "1500",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("2"),
				WeaponCategories: stringPtr("Tasers,Holdouts,Light Pistols,Heavy Pistols,Assault Rifles,Sniper Rifles,Shotguns,Exotic Ranged Weapons,Flamethrowers,Special Weapons"),
				Forbidden: &common.Forbidden{},
			},
			{
				ID: "73f6f721-9732-4773-8ce6-0e3f5222a49f",
				Name: "Heavy",
				Avail: "12F",
				Category: "Size",
				Cost: "4000",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("4"),
				WeaponCategories: stringPtr("Tasers,Holdouts,Light Pistols,Heavy Pistols,Assault Rifles,Sniper Rifles,Shotguns,Exotic Ranged Weapons,Flamethrowers,Special Weapons,Light Machine Guns,Medium Machine Guns,Heavy Machine Guns,Assault Cannons,Grenade Launchers,Missile Launchers,Laser Weapons"),
				Forbidden: &common.Forbidden{},
			},
			{
				ID: "582c31e0-1374-4ebb-b201-a20cb815d6dd",
				Name: "External [SR5]",
				Avail: "0",
				Category: "Visibility",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "SR5",
					Page: "461",
				},
				Slots: stringPtr("0"),
			},
			{
				ID: "20e7d5d5-da20-4466-99b7-977a578155e4",
				Name: "External",
				Avail: "0",
				Category: "Visibility",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("0"),
			},
			{
				ID: "4d90a1e3-8602-488e-b837-f155b4549084",
				Name: "Internal",
				Avail: "2",
				Category: "Visibility",
				Cost: "1500",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("2"),
			},
			{
				ID: "ad732625-c8bc-4e24-bc84-90c8449e82d5",
				Name: "Concealed",
				Avail: "4",
				Category: "Visibility",
				Cost: "4000",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("4"),
			},
			{
				ID: "4a020775-9258-486a-a03f-7a48dd5c3bf9",
				Name: "Flexible [SR5]",
				Avail: "0",
				Category: "Flexibility",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "SR5",
					Page: "461",
				},
				Slots: stringPtr("0"),
			},
			{
				ID: "5d53c232-c18d-4546-bb50-5325f57eb422",
				Name: "Fixed",
				Avail: "0",
				Category: "Flexibility",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("0"),
			},
			{
				ID: "8a0be4c4-5717-4a82-a1cd-35cd0315d180",
				Name: "Flexible",
				Avail: "2",
				Category: "Flexibility",
				Cost: "2000",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("1"),
			},
			{
				ID: "12342330-446f-4e2f-ad9b-6ccdc4d89a9b",
				Name: "Turret",
				Avail: "6",
				Category: "Flexibility",
				Cost: "5000",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("2"),
			},
			{
				ID: "df720a43-31aa-4053-9f2e-30ec4923cfe8",
				Name: "Remote",
				Avail: "0",
				Category: "Control",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("0"),
			},
			{
				ID: "70f99fae-470f-442c-a607-ef3465e27f37",
				Name: "Remote [SR5]",
				Avail: "0",
				Category: "Control",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "SR5",
					Page: "461",
				},
				Slots: stringPtr("0"),
			},
			{
				ID: "0c05f936-4826-418f-b798-848dafa4b4a0",
				Name: "Manual",
				Avail: "1",
				Category: "Control",
				Cost: "500",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("1"),
			},
			{
				ID: "741bb6e2-0c6b-4af2-82b0-0c4b14c60367",
				Name: "Manual [SR5]",
				Avail: "1",
				Category: "Control",
				Cost: "500",
				SourceReference: common.SourceReference{
					Source: "SR5",
					Page: "461",
				},
				Slots: stringPtr("0"),
				Forbidden: &common.Forbidden{},
			},
			{
				ID: "05995261-b645-48b5-9a54-9f26becc9d5d",
				Name: "Armored Manual",
				Avail: "4",
				Category: "Control",
				Cost: "1500",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				Slots: stringPtr("2"),
			},
			{
				ID: "4fdb0fb3-c987-41a0-b11e-d82fe6ac85b1",
				Name: "Micro (Drone)",
				Avail: "8R",
				Category: "Size",
				Cost: "400",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "124",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("0"),
				WeaponCategories: stringPtr("Micro-Drone Weapons"),
				Required: &common.Required{},
			},
			{
				ID: "94d06312-0487-4f3c-a8e9-e02ac2d04a2e",
				Name: "Mini (Drone)",
				Avail: "4R",
				Category: "Size",
				Cost: "800",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "124",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("1"),
				WeaponCategories: stringPtr("Tasers,Holdouts,Light Pistols,Grenades,Blades,Clubs"),
				WeaponFilter: stringPtr("((type != \"Melee\") or (type = \"Melee\" and reach = \"0\"))"),
				Required: &common.Required{},
			},
			{
				ID: "9ee5e112-8ced-4266-9141-02ef18e33f43",
				Name: "Small (Drone)",
				Avail: "8R",
				Category: "Size",
				Cost: "1600",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "124",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("2"),
				WeaponCategories: stringPtr("Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols"),
				Required: &common.Required{},
			},
			{
				ID: "0ec991be-a888-4547-8ca2-ad43d7c7399e",
				Name: "Standard (Drone)",
				Avail: "10F",
				Category: "Size",
				Cost: "2400",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "124",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("3"),
				WeaponCategories: stringPtr("Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Grenade Launchers"),
				Required: &common.Required{},
			},
			{
				ID: "2ab20ea4-441c-482d-977e-a5e90f37cb51",
				Name: "Large (Drone)",
				Avail: "12F",
				Category: "Size",
				Cost: "3200",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "124",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("4"),
				WeaponCategories: stringPtr("Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Shotguns,Grenade Launchers,Sporting Rifles"),
				Required: &common.Required{},
			},
			{
				ID: "30099989-d8ca-4f9c-adf0-1de36b6f8ab6",
				Name: "Huge (Drone)",
				Avail: "16F",
				Category: "Size",
				Cost: "4000",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "124",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("5"),
				WeaponCategories: stringPtr("Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Shotguns,Machine Guns,Grenade Launchers,Laser Weapons,Light Machine Guns,Medium Machine Guns,Sporting Rifles,Sniper Rifles"),
				Required: &common.Required{},
			},
			{
				ID: "52973ba7-3dbb-49fe-9a4c-8105eb6ab4bc",
				Name: "Heavy (Drone)",
				Avail: "20F",
				Category: "Size",
				Cost: "4800",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "124",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("6"),
				WeaponCategories: stringPtr("Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Shotguns,Machine Guns,Assault Cannons,Grenade Launchers,Missile Launchers,Laser Weapons,Light Machine Guns,Medium Machine Guns,Heavy Machine Guns,Sporting Rifles,Sniper Rifles"),
				Required: &common.Required{},
			},
			{
				ID: "be56fb91-88d3-4bfb-8e42-d12929b44fe5",
				Name: "None",
				Avail: "0",
				Category: "Control",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("0"),
				Required: &common.Required{},
			},
			{
				ID: "c6939caa-e94d-4db3-94f6-a46fbcc4df07",
				Name: "None",
				Avail: "0",
				Category: "Flexibility",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("0"),
				Required: &common.Required{},
			},
			{
				ID: "b7333366-24bf-4f47-bb68-b1cfe8f450fd",
				Name: "None",
				Avail: "0",
				Category: "Visibility",
				Cost: "0",
				SourceReference: common.SourceReference{
					Source: "R5",
					Page: "163",
				},
				OptionalDrone: stringPtr(""),
				Slots: stringPtr("0"),
				Required: &common.Required{},
			},
		},
	},
	WeaponMountMods: &VehicleWeaponMountMods{},
	// Complex weapon mount mods structure omitted
}

// GetVehiclesData returns the loaded vehicles data.
func GetVehiclesData() *VehiclesChummer {
	return vehiclesData
}
