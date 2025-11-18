package v5

// DataVehicleCategories contains vehicle categories keyed by their ID (lowercase with underscores)
var DataVehicleCategories = map[string]VehicleCategory{
	"bikes": {
		Name: "Bikes", BlackMarket: "Vehicles",
	},
	"cars": {
		Name: "Cars", BlackMarket: "Vehicles",
	},
	"trucks": {
		Name: "Trucks", BlackMarket: "Vehicles",
	},
	"municipalconstruction": {
		Name: "Municipal/Construction", BlackMarket: "Vehicles",
	},
	"corpsecpolicemilitary": {
		Name: "Corpsec/Police/Military", BlackMarket: "Vehicles",
	},
	"boats": {
		Name: "Boats", BlackMarket: "Vehicles",
	},
	"submarines": {
		Name: "Submarines", BlackMarket: "Vehicles",
	},
	"fixed_wing_aircraft": {
		Name: "Fixed-Wing Aircraft", BlackMarket: "Vehicles",
	},
	"ltav": {
		Name: "LTAV", BlackMarket: "Vehicles",
	},
	"rotorcraft": {
		Name: "Rotorcraft", BlackMarket: "Vehicles",
	},
	"vtolvstol": {
		Name: "VTOL/VSTOL", BlackMarket: "Vehicles",
	},
	"drones_micro": {
		Name: "Drones: Micro", BlackMarket: "Vehicles",
	},
	"drones_mini": {
		Name: "Drones: Mini", BlackMarket: "Vehicles",
	},
	"drones_small": {
		Name: "Drones: Small", BlackMarket: "Vehicles",
	},
	"drones_medium": {
		Name: "Drones: Medium", BlackMarket: "Vehicles",
	},
	"drones_anthro": {
		Name: "Drones: Anthro", BlackMarket: "Vehicles",
	},
	"drones_large": {
		Name: "Drones: Large", BlackMarket: "Vehicles",
	},
	"drones_huge": {
		Name: "Drones: Huge", BlackMarket: "Vehicles",
	},
	"drones_missile": {
		Name: "Drones: Missile", BlackMarket: "Vehicles",
	},
}

// DataVehicleModCategories contains vehicle modification categories keyed by their ID (lowercase with underscores)
var DataVehicleModCategories = map[string]VehicleModCategory{
	"body": {
		Name: "Body", BlackMarket: "Vehicles",
	},
	"cosmetic": {
		Name: "Cosmetic", BlackMarket: "Vehicles",
	},
	"electromagnetic": {
		Name: "Electromagnetic", BlackMarket: "Software,Vehicles",
	},
	"model_specific": {
		Name: "Model-Specific", BlackMarket: "Vehicles",
	},
	"powertrain": {
		Name: "Powertrain", BlackMarket: "Vehicles",
	},
	"protection": {
		Name: "Protection", BlackMarket: "Vehicles",
	},
	"weapons": {
		Name: "Weapons", BlackMarket: "Vehicles",
	},
}

// DataVehicleWeaponMountCategories contains weapon mount categories keyed by their ID (lowercase with underscores)
var DataVehicleWeaponMountCategories = map[string]VehicleWeaponMountCategory{
	"size": {
		Name: "Size", BlackMarket: "Vehicles",
	},
}

// DataVehicles contains vehicle records keyed by their ID (lowercase with underscores)
var DataVehicles = map[string]Vehicle{
	"dodge_scoot_scooter": {
		Name:     "Dodge Scoot (Scooter)",
		Category: "Bikes",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "0",
		Body:     "4",
		Cost:     "3000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "1",
		Page:     "462",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Improved Economy",
				},
			},
		},
	},
	"daihatsu_caterpillar_horseman": {
		Name:     "Daihatsu-Caterpillar Horseman",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "2",
		Armor:    "3",
		Avail:    "0",
		Body:     "4",
		Cost:     "12000",
		Handling: "3/1",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "1",
		Page:     "41",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Enviroseal",
				},
			},
		},
	},
	"ares_segway_terrier": {
		Name:     "Ares-Segway Terrier",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "1",
		Armor:    "2",
		Avail:    "0",
		Body:     "2",
		Cost:     "4500",
		Handling: "5/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "1",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gyro-Stabilization",
				},
			},
		},
	},
	"horizon_doble_revolution": {
		Name:     "Horizon-Doble Revolution",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "4",
		Body:     "6",
		Cost:     "8000",
		Handling: "5/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "1",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gyro-Stabilization",
				}, {
					Name: "Smart Tires (Rating 1)",
				},
			},
		},
	},
	"evo_falcon_ex": {
		Name:     "Evo Falcon-EX",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "1/2",
		Armor:    "9",
		Avail:    "0",
		Body:     "7",
		Cost:     "10000",
		Handling: "3/5",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "2/3",
		Seats:    "2",
		Page:     "43",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Tracked Propulsion",
				},
			},
		},
	},
	"entertainment_systems_cyclops": {
		Name:     "Entertainment Systems Cyclops",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "2",
		Armor:    "4",
		Avail:    "0",
		Body:     "4",
		Cost:     "6500",
		Handling: "4/4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "4",
		Seats:    "1",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gyro-Stabilization",
				},
			},
		},
	},
	"echo_motors_zip": {
		Name:     "Echo Motors Zip",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "0",
		Body:     "6",
		Cost:     "3500",
		Handling: "3/2",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "1",
		Page:     "44",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 1)",
				},
			},
		},
	},
	"yamaha_kaburaya": {
		Name:     "Yamaha Kaburaya",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "3",
		Armor:    "4",
		Avail:    "0",
		Body:     "5",
		Cost:     "17000",
		Handling: "5/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "6",
		Seats:    "1",
		Page:     "44",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
	},
	"buell_spartan": {
		Name:     "Buell Spartan",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "7",
		Cost:     "11500",
		Handling: "3/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "1",
		Page:     "45",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				},
			},
		},
	},
	"harley_davidson_nightmare": {
		Name:     "Harley-Davidson Nightmare",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "2",
		Armor:    "8",
		Avail:    "0",
		Body:     "8",
		Cost:     "22000",
		Handling: "4/3",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "2",
		Page:     "45",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
	},
	"yamaha_nodachi": {
		Name:     "Yamaha Nodachi",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "2",
		Armor:    "9",
		Avail:    "12R",
		Body:     "8",
		Cost:     "28000",
		Handling: "4/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "2",
		Page:     "45",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
	},
	"thundercloud_mustang": {
		Name:     "Thundercloud Mustang",
		Category: "Bikes",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "3",
		Body:     "8",
		Cost:     "11000",
		Handling: "4/4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "2",
		Page:     "46",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Smart Tires (Rating 2)",
				}, {
					Name: "Secondary Propulsion (Amphibious, Surface)",
				},
			},
		},
	},
	"renault_fiat_funone": {
		Name:     "Renault-Fiat Funone",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "0",
		Body:     "6",
		Cost:     "8500",
		Handling: "3/1",
		Pilot:    "2",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "2",
		Page:     "47",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 2)",
				},
			},
		},
	},
	"dodge_xenon": {
		Name:     "Dodge Xenon",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "8",
		Cost:     "18000",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4/3",
		Seats:    "4",
		Page:     "47",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"echo_motors_metaway": {
		Name:     "Echo Motors Metaway",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "0",
		Body:     "10",
		Cost:     "24000",
		Handling: "4/2",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "1",
		Page:     "47",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 1)",
				}, {
					Name: "Enviroseal",
				},
			},
		},
	},
	"gmc_442_chameleon": {
		Name:     "GMC 442 Chameleon",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "0",
		Body:     "10",
		Cost:     "14000",
		Handling: "4/2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "4",
		Seats:    "4",
		Page:     "48",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"mercury_comet": {
		Name:     "Mercury Comet",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "11",
		Cost:     "20000",
		Handling: "4/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "4",
		Page:     "49",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"saab_gladius_998_ti": {
		Name:     "SAAB Gladius 998 TI",
		Category: "Cars",
		Source:   "R5",
		Accel:    "4",
		Armor:    "5",
		Avail:    "14",
		Body:     "10",
		Cost:     "154000",
		Handling: "7/3",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "9",
		Seats:    "2",
		Page:     "50",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"saab_dynamit": {
		Name:     "SAAB Dynamit",
		Category: "Cars",
		Source:   "R5",
		Accel:    "3",
		Armor:    "3",
		Avail:    "8",
		Body:     "10",
		Cost:     "98000",
		Handling: "5/1",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "9",
		Seats:    "2",
		Page:     "50",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"gmc_phoenix": {
		Name:     "GMC Phoenix",
		Category: "Cars",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "10",
		Cost:     "32000",
		Handling: "4/2",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "6",
		Seats:    "4",
		Page:     "51",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"hyundai_equus": {
		Name:     "Hyundai Equus",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "10",
		Avail:    "0",
		Body:     "12",
		Cost:     "40000",
		Handling: "3/3",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "4/3",
		Seats:    "4",
		Page:     "52",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Low)",
				},
			},
		},
	},
	"chevrolet_longboard": {
		Name:     "Chevrolet Longboard",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "12",
		Cost:     "31000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "52",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Low)",
				},
			},
		},
	},
	"rolls_royce_phaeton": {
		Name:     "Rolls-Royce Phaeton",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "18",
		Body:     "16",
		Cost:     "350000",
		Handling: "5/3",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "5/3",
		Seats:    "10",
		Page:     "52",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Luxury)",
				}, {
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Armor (Concealed) (Rating 3)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"thundercloud_morgan": {
		Name:     "Thundercloud Morgan",
		Category: "Cars",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "8",
		Body:     "14",
		Cost:     "7500",
		Handling: "3/5",
		Pilot:    "0",
		Sensor:   "0",
		Speed:    "4",
		Seats:    "2",
		Page:     "52",
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				}, {
					Name: "Manual Operation",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Manual", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"tata_hotspur": {
		Name:     "Tata Hotspur",
		Category: "Cars",
		Source:   "R5",
		Accel:    "3",
		Armor:    "12",
		Avail:    "8",
		Body:     "16",
		Cost:     "60000",
		Handling: "4/5",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "6",
		Seats:    "2",
		Page:     "53",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				},
			},
		},
	},
	"gmc_armadillo": {
		Name:     "GMC Armadillo",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "10",
		Avail:    "0",
		Body:     "13",
		Cost:     "22000",
		Handling: "3/4",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "6",
		Page:     "54",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				},
			},
		},
	},
	"ford_percheron": {
		Name:     "Ford Percheron",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "15",
		Cost:     "39000",
		Handling: "3/3",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "6",
		Page:     "54",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"jeep_trailblazer": {
		Name:     "Jeep Trailblazer",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "12",
		Cost:     "32000",
		Handling: "3/4",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "4",
		Page:     "54",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				}, {
					Name: "Multifuel Engine",
				},
			},
		},
	},
	"toyota_talon": {
		Name:     "Toyota Talon",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "12",
		Cost:     "30000",
		Handling: "4/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "5",
		Page:     "55",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"nissan_hauler": {
		Name:     "Nissan Hauler",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "8",
		Avail:    "0",
		Body:     "16",
		Cost:     "30000",
		Handling: "3/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4/3",
		Seats:    "8",
		Page:     "56",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"eurocar_northstar": {
		Name:     "Eurocar Northstar",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "8",
		Avail:    "12",
		Body:     "12",
		Cost:     "115000",
		Handling: "5/3",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "6",
		Seats:    "4",
		Page:     "56",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				},
			},
		},
	},
	"gmc_escalade": {
		Name:     "GMC Escalade",
		Category: "Cars",
		Source:   "R5",
		Accel:    "2",
		Armor:    "10",
		Avail:    "10",
		Body:     "16",
		Cost:     "125000",
		Handling: "3/3",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "6",
		Page:     "57",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (High)",
				}, {
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"ford_econovan": {
		Name:     "Ford Econovan",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "8",
		Avail:    "0",
		Body:     "14",
		Cost:     "30000",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "10",
		Page:     "58",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Low)",
				},
			},
		},
	},
	"dodge_caravaner": {
		Name:     "Dodge Caravaner",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "8",
		Avail:    "0",
		Body:     "12",
		Cost:     "28000",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "7",
		Page:     "58",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"gmc_universe": {
		Name:     "GMC Universe",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "8",
		Avail:    "0",
		Body:     "14",
		Cost:     "30000",
		Handling: "3/3",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "4/3",
		Seats:    "16",
		Page:     "59",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"ares_chuck_wagon": {
		Name:     "Ares Chuck Wagon",
		Category: "Cars",
		Source:   "R5",
		Accel:    "1",
		Armor:    "5",
		Avail:    "0",
		Body:     "16",
		Cost:     "40000",
		Handling: "2/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2",
		Page:     "59",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercury_comet_cruiser": {
		Name:     "Mercury Comet Cruiser",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "11",
		Avail:    "0",
		Body:     "14",
		Cost:     "21000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "5",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"chrysler_nissan_bobcat": {
		Name:     "Chrysler-Nissan Bobcat",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "10",
		Avail:    "0",
		Body:     "15",
		Cost:     "25000",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "8",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"dodge_hurricane": {
		Name:     "Dodge Hurricane",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "12",
		Avail:    "0",
		Body:     "15",
		Cost:     "37000",
		Handling: "4/4",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "3",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"dodge_hurricane_crew_modell": {
		Name:     "Dodge Hurricane Crew Modell",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "12",
		Avail:    "0",
		Body:     "16",
		Cost:     "43000",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "6",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"dodge_hurricane_security_modell": {
		Name:     "Dodge Hurricane Security Modell",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "14",
		Avail:    "0",
		Body:     "16",
		Cost:     "67000",
		Handling: "4/3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "5",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercedes_benz_tornado": {
		Name:     "Mercedes-Benz Tornado",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "12",
		Avail:    "0",
		Body:     "15",
		Cost:     "44400",
		Handling: "4/4",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "3",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercedes_benz_tornado_crew_modell": {
		Name:     "Mercedes-Benz Tornado Crew Modell",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "12",
		Avail:    "0",
		Body:     "16",
		Cost:     "51600",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "6",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercedes_benz_tornado_security_modell": {
		Name:     "Mercedes-Benz Tornado Security Modell",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "14",
		Avail:    "0",
		Body:     "16",
		Cost:     "80400",
		Handling: "4/3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "5",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"bmw_x_infinity": {
		Name:     "BMW X Infinity",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "2",
		Armor:    "13",
		Avail:    "10",
		Body:     "14",
		Cost:     "72000",
		Handling: "5/5",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "6",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"volkswagen_multycity": {
		Name:     "Volkswagen MultyCity",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "1",
		Armor:    "4",
		Avail:    "0",
		Body:     "12",
		Cost:     "18000",
		Handling: "3/2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "4",
		Seats:    "3",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"volkswagen_urban_allrounder": {
		Name:     "Volkswagen Urban Allrounder",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "1",
		Armor:    "6",
		Avail:    "0",
		Body:     "13",
		Cost:     "19500",
		Handling: "3/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "5",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercedes_benz_citymog_dodge_city_basis_modell": {
		Name:     "Mercedes-Benz CityMog / Dodge City Basis Modell",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "1",
		Armor:    "10",
		Avail:    "0",
		Body:     "18",
		Cost:     "44000",
		Handling: "5/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "3",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercedes_benz_citymog_dodge_city_cm_x_mit_pritsche": {
		Name:     "Mercedes-Benz CityMog / Dodge City CM-X (mit Pritsche)",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "1",
		Armor:    "10",
		Avail:    "0",
		Body:     "18",
		Cost:     "42000",
		Handling: "5/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "5",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercedes_benz_citymog_dodge_city_cm_traveller_mit_pritsche": {
		Name:     "Mercedes-Benz CityMog / Dodge City CM Traveller (mit Pritsche)",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "1",
		Armor:    "10",
		Avail:    "0",
		Body:     "18",
		Cost:     "56000",
		Handling: "5/4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "20",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mercedes_benz_citymog_dodge_city_cm_elite": {
		Name:     "Mercedes-Benz CityMog / Dodge City CM Elite",
		Category: "Cars",
		Source:   "SHB",
		Accel:    "1",
		Armor:    "12",
		Avail:    "0",
		Body:     "18",
		Cost:     "96000",
		Handling: "5/3",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "12",
		Page:     "42",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"airstream_traveler_chinook": {
		Name:     "Airstream Traveler Chinook",
		Category: "Trucks",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "0",
		Body:     "14",
		Cost:     "145000",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4/3",
		Seats:    "10",
		Page:     "59",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Extreme Environment Modification",
				}, {
					Name: "SunCell",
				}, {
					Name: "Satellite Link",
				},
			},
		},
	},
	"airstream_traveler_preserve": {
		Name:     "Airstream Traveler Preserve",
		Category: "Trucks",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "0",
		Body:     "16",
		Cost:     "134000",
		Handling: "3/3",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "4/4",
		Seats:    "10",
		Page:     "59",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "GridLink",
				}, {
					Name: "SunCell",
				}, {
					Name: "Satellite Link",
				},
			},
		},
	},
	"airstream_traveler_outback": {
		Name:     "Airstream Traveler Outback",
		Category: "Trucks",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "0",
		Body:     "14",
		Cost:     "158000",
		Handling: "3/4",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "3/4",
		Seats:    "8",
		Page:     "59",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Extreme Environment Modification",
				}, {
					Name: "SunCell",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Satellite Link",
				},
			},
		},
	},
	"mack_hellhound": {
		Name:     "Mack Hellhound",
		Category: "Trucks",
		Source:   "R5",
		Accel:    "1",
		Armor:    "15",
		Avail:    "16R",
		Body:     "20",
		Cost:     "150000",
		Handling: "3/2",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4/3",
		Seats:    "2",
		Page:     "60",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Low)",
				}, {
					Name: "Landing Drone Rack (Medium)",
				}, {
					Name: "Landing Drone Rack (Medium)",
				}, {
					Name: "Landing Drone Rack (Micro)",
				}, {
					Name: "Landing Drone Rack (Small)",
				}, {
					Name: "Landing Drone Rack (Small)",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Drone Rail",
				},
			},
		},
	},
	"omni_motors_omnibus": {
		Name:     "Omni Motors Omnibus",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "10",
		Avail:    "12",
		Body:     "18",
		Cost:     "296000",
		Handling: "2/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "53",
		Page:     "62",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "GridLink",
				}, {
					Name: "GridLink Override",
				},
			},
		},
	},
	"gmc_commercial_g_series": {
		Name:     "GMC Commercial G-Series",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "14",
		Body:     "18",
		Cost:     "287000",
		Handling: "2/2",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "2",
		Page:     "62",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "GridLink",
				}, {
					Name: "GridLink Override",
				}, {
					Name: "Special Equipment",
				},
			},
		},
	},
	"gmc_commercial_d_series": {
		Name:     "GMC Commercial D-Series",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "10",
		Avail:    "12",
		Body:     "16",
		Cost:     "248000",
		Handling: "2/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2",
		Page:     "63",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Special Equipment",
				},
			},
		},
	},
	"gmc_commercial_d_series_compact": {
		Name:     "GMC Commercial D-Series Compact",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "8",
		Avail:    "12",
		Body:     "12",
		Cost:     "196000",
		Handling: "2/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2",
		Page:     "63",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Special Equipment",
				},
			},
		},
	},
	"gmc_commercial_dd": {
		Name:     "GMC Commercial DD",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "12",
		Body:     "20",
		Cost:     "312000",
		Handling: "2/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2",
		Page:     "63",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Special Equipment",
				},
			},
		},
	},
	"saeder_krupp_konstructors": {
		Name:     "Saeder-Krupp Konstructors",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "18",
		Avail:    "16",
		Body:     "24",
		Cost:     "365000",
		Handling: "2/2",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "2",
		Page:     "64",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Special Equipment",
				},
			},
		},
	},
	"mostrans_kvp_28": {
		Name:     "Mostrans KVP-28",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "16",
		Body:     "18",
		Cost:     "87000",
		Handling: "2/2",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "2",
		Page:     "64",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Secondary Propulsion (Hovercraft)",
				},
			},
		},
	},
	"mostrans_minsk": {
		Name:     "Mostrans Minsk",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "1",
		Armor:    "10",
		Avail:    "16",
		Body:     "16",
		Cost:     "77000",
		Handling: "2/2",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "2",
		Page:     "64",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"universal_hovercraft_minnesota": {
		Name:     "Universal Hovercraft Minnesota",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "2",
		Armor:    "9",
		Avail:    "12R",
		Body:     "14",
		Cost:     "130000",
		Handling: "4/4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "14",
		Page:     "65",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"vodyanoy_assault_hovercraft": {
		Name:     "Vodyanoy Assault Hovercraft",
		Category: "Municipal/Construction",
		Source:   "R5",
		Accel:    "3",
		Armor:    "16",
		Avail:    "12F",
		Body:     "16",
		Cost:     "84000",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "10",
		Page:     "65",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Manual", Flexibility: "Turret", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"bmw_blitzkrieg": {
		Name:     "BMW Blitzkrieg",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "2",
		Armor:    "8",
		Avail:    "14R",
		Body:     "10",
		Cost:     "46000",
		Handling: "4/3",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "2",
		Page:     "66",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"dodge_charger": {
		Name:     "Dodge Charger",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "16R",
		Body:     "12",
		Cost:     "65000",
		Handling: "4/3",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "5",
		Page:     "67",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"bmw_i8_interceptor": {
		Name:     "BMW I8 Interceptor",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "4",
		Armor:    "8",
		Avail:    "20F",
		Body:     "12",
		Cost:     "114000",
		Handling: "5/3",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "8",
		Seats:    "3",
		Page:     "68",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Oil Slick Sprayer",
				}, {
					Name: "Smoke Projector",
				}, {
					Name: "Road Strip Ejector",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"dodge_goliath": {
		Name:     "Dodge Goliath",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "2",
		Armor:    "16",
		Avail:    "20R",
		Body:     "16",
		Cost:     "120000",
		Handling: "3/2",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "8",
		Page:     "70",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Extra Entry/Exit Points",
				}, {
					Name: "Ram Plate",
				}, {
					Name: "Special Equipment",
				},
			},
		},
	},
	"bmw_teufelkatze": {
		Name:     "BMW Teufelkatze",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "3",
		Armor:    "16",
		Avail:    "16F",
		Body:     "16",
		Cost:     "76000",
		Handling: "5/4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "7",
		Page:     "71",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "FlashTech",
				}, {
					Name: "Signature Dampening",
				}, {
					Name: "Anti-Theft System (Rating 3)",
				},
			},
		},
	},
	"dodge_stallion": {
		Name:     "Dodge Stallion",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "3",
		Armor:    "12",
		Avail:    "16R",
		Body:     "16",
		Cost:     "78000",
		Handling: "3/4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "4",
		Page:     "71",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Manual", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"dodge_minotaur": {
		Name:     "Dodge Minotaur",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "2",
		Armor:    "8",
		Avail:    "0",
		Body:     "14",
		Cost:     "45000",
		Handling: "4/5",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "4",
		Page:     "71",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Manual", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"bmw_luxus": {
		Name:     "BMW Luxus",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "3",
		Armor:    "16",
		Avail:    "14R",
		Body:     "18",
		Cost:     "398000",
		Handling: "5/5",
		Pilot:    "5",
		Sensor:   "6",
		Speed:    "5",
		Seats:    "8",
		Page:     "73",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "6", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Anti-Theft System (Rating 3)",
				}, {
					Name: "Life Support (Rating 2)",
				}, {
					Name: "Missile Defense System",
				}, {
					Name: "Passenger Protection System (Rating 6)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Turret", Size: "Heavy", Visibility: "Concealed",
				},
			},
		},
	},
	"dodge_general_command": {
		Name:     "Dodge General Command",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "1",
		Armor:    "16",
		Avail:    "18R",
		Body:     "20",
		Cost:     "344000",
		Handling: "3/3",
		Pilot:    "5",
		Sensor:   "7",
		Speed:    "4",
		Seats:    "10",
		Page:     "74",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "6", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Extra Entry/Exit Points",
				}, {
					Name: "Amenities (Middle)",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				},
			},
		},
	},
	"dodge_general_trailer": {
		Name:     "Dodge General Trailer",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "1",
		Armor:    "16",
		Avail:    "18R",
		Body:     "20",
		Cost:     "54000",
		Handling: "3/3",
		Pilot:    "3",
		Sensor:   "7",
		Speed:    "3",
		Seats:    "1",
		Page:     "74",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "6", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Special Equipment",
				}, {
					Name: "Rigger Adaptation",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Workshop",
				}, {
					Name: "Standard Drone Rack (Medium)",
				}, {
					Name: "Standard Drone Rack (Medium)",
				}, {
					Name: "Standard Drone Rack (Medium)",
				}, {
					Name: "Standard Drone Rack (Medium)",
				},
			},
		},
	},
	"bmw_sturmwagon": {
		Name:     "BMW Sturmwagon",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "2",
		Armor:    "18",
		Avail:    "20R",
		Body:     "17",
		Cost:     "145000",
		Handling: "5/4",
		Pilot:    "4",
		Sensor:   "5",
		Speed:    "4",
		Seats:    "10",
		Page:     "75",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Extra Entry/Exit Points",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Special Equipment",
				},
			},
		},
	},
	"dodge_rhino": {
		Name:     "Dodge Rhino",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "2",
		Armor:    "14",
		Avail:    "18R",
		Body:     "24",
		Cost:     "225000",
		Handling: "4/4",
		Pilot:    "6",
		Sensor:   "7",
		Speed:    "4",
		Seats:    "9",
		Page:     "77",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "6", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Extra Entry/Exit Points",
				}, {
					Name: "Anti-Theft System (Rating 1)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"ruhrmetal_wolf_ii": {
		Name:     "Ruhrmetal Wolf II",
		Category: "Corpsec/Police/Military",
		Source:   "R5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "20F",
		Body:     "24",
		Cost:     "330000",
		Handling: "3/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "77",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Enviroseal",
				}, {
					Name: "Life Support (Rating 2)",
				},
			},
		},
	},
	"evo_waterking": {
		Name:     "Evo Waterking",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "8",
		Avail:    "12",
		Body:     "14",
		Cost:     "74000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "12",
		Page:     "79",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Secondary Manual Controls",
				}, {
					Name: "Smuggling Compartment",
				},
			},
		},
	},
	"sea_ray_cottonmouth": {
		Name:     "Sea Ray Cottonmouth",
		Category: "Boats",
		Source:   "R5",
		Accel:    "4",
		Armor:    "4",
		Avail:    "12",
		Body:     "8",
		Cost:     "120000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "7",
		Seats:    "4",
		Page:     "80",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Speed Enhancement (Rating 1)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				},
			},
		},
	},
	"kawasaki_stingray": {
		Name:     "Kawasaki Stingray",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "8",
		Cost:     "13000",
		Handling: "5",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "5",
		Seats:    "2",
		Page:     "81",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"kawasaki_manta_ray": {
		Name:     "Kawasaki Manta Ray",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "9",
		Cost:     "16000",
		Handling: "4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "5",
		Seats:    "3",
		Page:     "81",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"aztechnology_nightrunner": {
		Name:     "Aztechnology Nightrunner",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "10",
		Body:     "12",
		Cost:     "56000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "6",
		Seats:    "6",
		Page:     "81",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Life Support (Rating 1)",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Signature Masking (Rating 4)",
				},
			},
		},
	},
	"zodiac_scorpio": {
		Name:     "Zodiac Scorpio",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "8",
		Body:     "10",
		Cost:     "26000",
		Handling: "4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "4",
		Seats:    "8",
		Page:     "82",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Manual", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Manual", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Manual", Flexibility: "Flexible", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"mitsubishi_waterbug": {
		Name:     "Mitsubishi Waterbug",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "4",
		Avail:    "0",
		Body:     "8",
		Cost:     "8000",
		Handling: "6",
		Pilot:    "1",
		Sensor:   "0",
		Speed:    "3",
		Seats:    "1",
		Page:     "83",
	},
	"mitsubishi_waveskipper": {
		Name:     "Mitsubishi Waveskipper",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "4",
		Avail:    "0",
		Body:     "10",
		Cost:     "10000",
		Handling: "5",
		Pilot:    "1",
		Sensor:   "0",
		Speed:    "3",
		Seats:    "2",
		Page:     "83",
	},
	"evo_water_strider": {
		Name:     "Evo Water Strider",
		Category: "Boats",
		Source:   "R5",
		Accel:    "1",
		Armor:    "5",
		Avail:    "16",
		Body:     "8",
		Cost:     "11000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "1",
		Page:     "84",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Life Support (Rating 1)",
				}, {
					Name: "Signature Masking (Rating 1)",
				},
			},
		},
	},
	"corsair_elysium": {
		Name:     "Corsair Elysium",
		Category: "Boats",
		Source:   "R5",
		Accel:    "1/2",
		Armor:    "10",
		Avail:    "12",
		Body:     "14",
		Cost:     "78000",
		Handling: "1/3",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "1/4",
		Seats:    "6",
		Page:     "85",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Improved Economy",
				}, {
					Name: "Satellite Link",
				},
			},
		},
	},
	"corsair_panther": {
		Name:     "Corsair Panther",
		Category: "Boats",
		Source:   "R5",
		Accel:    "1/3",
		Armor:    "10",
		Avail:    "12",
		Body:     "18",
		Cost:     "135000",
		Handling: "1/3",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "2/5",
		Seats:    "8",
		Page:     "85",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Improved Economy",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Secondary Manual Controls",
				}, {
					Name: "SunCell",
				}, {
					Name: "Signature Masking (Rating 2)",
				},
			},
		},
	},
	"corsair_trident": {
		Name:     "Corsair Trident",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2/3",
		Armor:    "10",
		Avail:    "12",
		Body:     "16",
		Cost:     "125000",
		Handling: "1/3",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "4/5",
		Seats:    "6",
		Page:     "87",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Improved Economy",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "SunCell",
				},
			},
		},
	},
	"corsair_triton": {
		Name:     "Corsair Triton",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "10",
		Avail:    "0",
		Body:     "16",
		Cost:     "104000",
		Handling: "1",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "6",
		Seats:    "6",
		Page:     "87",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Improved Economy",
				}, {
					Name: "Satellite Link",
				},
			},
		},
	},
	"blohm_and_voss_classic_111": {
		Name:     "Blohm and Voss Classic 111",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "14",
		Avail:    "16",
		Body:     "24",
		Cost:     "14870000",
		Handling: "3",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "14",
		Page:     "88",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (High)",
				}, {
					Name: "Interior Cameras",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Satellite Link",
				},
			},
		},
	},
	"lurssen_mobius": {
		Name:     "Lurssen Mobius",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "14",
		Avail:    "36",
		Body:     "36",
		Cost:     "84985000",
		Handling: "3",
		Pilot:    "6",
		Sensor:   "5",
		Speed:    "3",
		Seats:    "22",
		Page:     "89",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Luxury)",
				}, {
					Name: "Interior Cameras",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Manual Control Override",
				}, {
					Name: "Searchlight",
				},
			},
		},
	},
	"sun_tracker_lake_king": {
		Name:     "Sun Tracker Lake King",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "8",
		Avail:    "0",
		Body:     "14",
		Cost:     "35000",
		Handling: "2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "8",
		Page:     "90",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"evo_aquavida_1": {
		Name:     "Evo Aquavida 1",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "16",
		Avail:    "10",
		Body:     "20",
		Cost:     "115000",
		Handling: "2",
		Pilot:    "1",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "10",
		Page:     "90",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Winch (Basic)",
				},
			},
		},
	},
	"evo_aquavida_2": {
		Name:     "Evo Aquavida 2",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "16",
		Avail:    "10",
		Body:     "20",
		Cost:     "135000",
		Handling: "2",
		Pilot:    "1",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "12",
		Page:     "90",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Winch (Basic)",
				},
			},
		},
	},
	"ultramarine_kingfisher": {
		Name:     "Ultramarine Kingfisher",
		Category: "Boats",
		Source:   "R5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "12",
		Body:     "16",
		Cost:     "61000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "6",
		Page:     "92",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Smuggling Compartment",
				},
			},
		},
	},
	"american_airboat_airranger": {
		Name:     "American Airboat AirRanger",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "6",
		Body:     "10",
		Cost:     "25500",
		Handling: "4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "4",
		Seats:    "6",
		Page:     "92",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"american_airboat_airranger_heavy": {
		Name:     "American Airboat AirRanger Heavy",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "8",
		Body:     "12",
		Cost:     "35500",
		Handling: "4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "4",
		Seats:    "5",
		Page:     "92",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"gmc_riverine_security": {
		Name:     "GMC Riverine Security",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "12",
		Avail:    "15R",
		Body:     "16",
		Cost:     "100000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "8",
		Page:     "92",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Searchlight",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Heavy", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"gmc_riverine_police": {
		Name:     "GMC Riverine Police",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "14",
		Avail:    "15R",
		Body:     "16",
		Cost:     "154000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "5",
		Speed:    "5",
		Seats:    "8",
		Page:     "92",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Searchlight",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Heavy", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"gmc_riverine_military": {
		Name:     "GMC Riverine Military",
		Category: "Boats",
		Source:   "R5",
		Accel:    "3",
		Armor:    "20",
		Avail:    "20F",
		Body:     "20",
		Cost:     "225000",
		Handling: "4",
		Pilot:    "6",
		Sensor:   "6",
		Speed:    "5",
		Seats:    "8",
		Page:     "92",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "6", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Signature Masking (Rating 4)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Heavy", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"hughes_stallion_wk_4": {
		Name:     "Hughes Stallion WK-4",
		Category: "Rotorcraft",
		Source:   "R5",
		Accel:    "4",
		Armor:    "16",
		Avail:    "12",
		Body:     "16",
		Cost:     "440000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "8",
		Page:     "95",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"aztechnology_agular_gx_2": {
		Name:     "Aztechnology Agular GX-2",
		Category: "Rotorcraft",
		Source:   "R5",
		Accel:    "5",
		Armor:    "16",
		Avail:    "28F",
		Body:     "20",
		Cost:     "500000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "5",
		Speed:    "7",
		Seats:    "2",
		Page:     "97",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"aztechnology_agular_gx_3at": {
		Name:     "Aztechnology Agular GX-3AT",
		Category: "Rotorcraft",
		Source:   "R5",
		Accel:    "4",
		Armor:    "20",
		Avail:    "28F",
		Body:     "22",
		Cost:     "550000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "6",
		Seats:    "10",
		Page:     "97",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"s_k_aerospace_ska_008": {
		Name:     "S-K Aerospace SKA-008",
		Category: "Rotorcraft",
		Source:   "R5",
		Accel:    "8",
		Armor:    "18",
		Avail:    "24R",
		Body:     "16",
		Cost:     "525000",
		Handling: "6",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "12",
		Page:     "98",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"dassault_sea_sprite": {
		Name:     "Dassault Sea Sprite",
		Category: "Rotorcraft",
		Source:   "R5",
		Accel:    "3",
		Armor:    "12",
		Avail:    "18R",
		Body:     "18",
		Cost:     "400000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "4",
		Seats:    "14",
		Page:     "98",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Winch (Basic)",
				}, {
					Name: "Winch (Basic)",
				},
			},
		},
	},
	"federated_boeing_pby_70_catalina_ii": {
		Name:     "Federated-Boeing PBY-70 Catalina II",
		Category: "Fixed-Wing Aircraft",
		Source:   "R5",
		Accel:    "3",
		Armor:    "14",
		Avail:    "12",
		Body:     "22",
		Cost:     "250000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "16",
		Page:     "100",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Manual", Flexibility: "Flexible", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Manual", Flexibility: "Flexible", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Manual", Flexibility: "Flexible", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"airbus_lift_ticket_als_699": {
		Name:     "Airbus Lift Ticket ALS-699",
		Category: "Rotorcraft",
		Source:   "R5",
		Accel:    "3",
		Armor:    "12",
		Avail:    "14",
		Body:     "16",
		Cost:     "325000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "5",
		Page:     "102",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Winch (Basic)",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Winch (Enhanced)",
				}, {
					Name: "Winch (Enhanced)",
				}, {
					Name: "Winch (Enhanced)",
				}, {
					Name: "Winch (Enhanced)",
				},
			},
		},
	},
	"gmc_gryphon": {
		Name:     "GMC Gryphon",
		Category: "VTOL/VSTOL",
		Source:   "R5",
		Accel:    "7",
		Armor:    "24",
		Avail:    "28F",
		Body:     "24",
		Cost:     "3200000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "5",
		Speed:    "8",
		Seats:    "2",
		Page:     "103",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"evo_krime_krime_wing": {
		Name:     "Evo-Krime Krime Wing",
		Category: "VTOL/VSTOL",
		Source:   "R5",
		Accel:    "5",
		Armor:    "18",
		Avail:    "24F",
		Body:     "22",
		Cost:     "2275000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "5",
		Speed:    "6",
		Seats:    "20",
		Page:     "105",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 10)",
				},
			},
		},
	},
	"luftshiffbau_personal_zeppelin_lzp_2070": {
		Name:     "Luftshiffbau Personal Zeppelin LZP-2070",
		Category: "LTAV",
		Source:   "R5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "12",
		Body:     "12",
		Cost:     "85000",
		Handling: "4",
		Pilot:    "5",
		Sensor:   "4",
		Speed:    "2",
		Seats:    "6",
		Page:     "107",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"renegade_works_mothership_lavh": {
		Name:     "Renegade Works Mothership LAVH",
		Category: "LTAV",
		Source:   "R5",
		Accel:    "3",
		Armor:    "5",
		Avail:    "24R",
		Body:     "10",
		Cost:     "50000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "1",
		Page:     "105",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 1)",
				},
			},
		},
	},
	"horizon_noizquito_microdrone": {
		Name:     "Horizon Noizquito (Microdrone)",
		Category: "Drones: Micro",
		Source:   "R5",
		Accel:    "2",
		Armor:    "0",
		Avail:    "10R",
		Body:     "1",
		Cost:     "2000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "128",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Speakers",
				}, {
					Name: "Strobes",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"sony_goldfish_microdrone": {
		Name:     "Sony Goldfish (Microdrone)",
		Category: "Drones: Micro",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "6",
		Body:     "0",
		Cost:     "500",
		Handling: "2/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "129",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Submersible (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"aerodesign_systems_condor_ldsd_23_minidrone": {
		Name:     "Aerodesign Systems Condor LDSD-23 (Minidrone)",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "0",
		Armor:    "0",
		Avail:    "6R",
		Body:     "1",
		Cost:     "4000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "0",
		Seats:    "",
		Page:     "129",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"aztechnology_hedgehog_minidrone": {
		Name:     "Aztechnology Hedgehog (Minidrone)",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8F",
		Body:     "1",
		Cost:     "8000",
		Handling: "3",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "",
		Page:     "129",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"cyberspace_designs_dragonfly_minidrone": {
		Name:     "Cyberspace Designs Dragonfly (Minidrone)",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "1",
		Armor:    "3",
		Avail:    "12R",
		Body:     "1",
		Cost:     "4000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "129",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Built-In", Visibility: "Concealed",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Melee Bite",
				},
			},
		},
	},
	"festo_pigeon_20_minidrone": {
		Name:     "Festo Pigeon 2.0 (Minidrone)",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "1",
		Cost:     "3000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "129",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Realistic Features (Drone) (Rating 1)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"horizon_cu3_minidrone": {
		Name:     "Horizon CU^3 (Minidrone)",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "1",
		Cost:     "3000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "",
		Page:     "130",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"horizon_cu3_professional_minidrone": {
		Name:     "Horizon CU^3 Professional (Minidrone)",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "1",
		Cost:     "6000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "",
		Page:     "130",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"renraku_gerbil_minidrone": {
		Name:     "Renraku Gerbil (Minidrone)",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "1",
		Cost:     "2000",
		Handling: "4/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "130",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"ares_arms_sentry_v_small": {
		Name:     "Ares Arms Sentry V (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "6",
		Avail:    "4R",
		Body:     "2",
		Cost:     "4000",
		Handling: "4/0",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "130",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Smartsoft",
				}, {
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Colt Cobra TZ-120",
				},
			},
		},
		ModSlots: "0",
	},
	"citron_brouillard_smoke_generator_small": {
		Name:     "Citron-Brouillard Smoke Generator (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "2",
		Cost:     "4000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "131",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"cyberspace_designs_wolfhound_small": {
		Name:     "Cyberspace Designs Wolfhound (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "12",
		Body:     "2",
		Cost:     "30000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "2",
		Seats:    "",
		Page:     "131",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"evo_proletarian_small": {
		Name:     "Evo Proletarian (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "6",
		Body:     "2",
		Cost:     "4000",
		Handling: "4/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "132",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"ferret_rpd_1x_small": {
		Name:     "Ferret RPD-1X (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "3",
		Avail:    "6",
		Body:     "2",
		Cost:     "4000",
		Handling: "4/2",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "",
		Page:     "132",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				}, {
					Name: "Flashlight",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Mini (Drone)", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Defiance EX Shocker",
				},
			},
		},
		ModSlots: "1",
	},
	"festo_sewer_snake_small": {
		Name:     "Festo Sewer Snake (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1/1",
		Armor:    "0",
		Avail:    "10",
		Body:     "2",
		Cost:     "6000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1/1",
		Seats:    "",
		Page:     "132",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods:     nil,
		ModSlots: "1",
	},
	"horizon_mini_zep_small": {
		Name:     "Horizon Mini-Zep (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "0",
		Armor:    "0",
		Avail:    "4",
		Body:     "2",
		Cost:     "2000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "0",
		Seats:    "",
		Page:     "132",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "4",
	},
	"knight_errant_p5_small": {
		Name:     "Knight Errant P5 (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "2",
		Armor:    "0",
		Avail:    "10R",
		Body:     "2",
		Cost:     "8000",
		Handling: "4/2",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "6",
		Seats:    "",
		Page:     "133",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"lone_star_castle_guard_small": {
		Name:     "Lone Star Castle Guard (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "6",
		Avail:    "10R",
		Body:     "2",
		Cost:     "8000",
		Handling: "4/2",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "133",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				}, {
					Name: "",
				}, {
					Name: "Smartsoft",
				}, {
					Name: "SmartSafety Bracelet",
				}, {
					Name: "SmartSafety Bracelet",
				}, {
					Name: "SmartSafety Bracelet",
				}, {
					Name: "SmartSafety Bracelet",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Small (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"mct_gun_turret_small": {
		Name:     "MCT Gun Turret (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "0",
		Armor:    "6",
		Avail:    "4R",
		Body:     "2",
		Cost:     "4000",
		Handling: "0",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "0",
		Seats:    "",
		Page:     "133",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Immobile (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"mct_seven_wheelie_small": {
		Name:     "MCT Seven (Wheelie) (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "0",
		Body:     "1",
		Cost:     "2000",
		Handling: "4/2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"mct_seven_treads_small": {
		Name:     "MCT Seven (Treads) (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "2",
		Body:     "1",
		Cost:     "2000",
		Handling: "3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"mct_seven_dirty_small": {
		Name:     "MCT Seven (Dirty) (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "2",
		Body:     "1",
		Cost:     "2000",
		Handling: "2/4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"mct_seven_quad_small": {
		Name:     "MCT Seven (Quad) (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "1",
		Cost:     "2000",
		Handling: "4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "1",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"mct_seven_swims_small": {
		Name:     "MCT Seven (Swims) (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "1",
		Cost:     "1000",
		Handling: "3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"mct_seven_hovers_small": {
		Name:     "MCT Seven (Hovers) (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "6",
		Body:     "1",
		Cost:     "4000",
		Handling: "3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "1",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"mct_seven_soars_small": {
		Name:     "MCT Seven (Soars) (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "1",
		Cost:     "4000",
		Handling: "3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"neonet_prarie_dog_small": {
		Name:     "NeoNET Prarie Dog (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "3",
		Avail:    "12F",
		Body:     "2",
		Cost:     "8000",
		Handling: "2/4",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "2",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"pw_sundowner_small": {
		Name:     "PW Sundowner (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "2",
		Cost:     "10000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "",
		Page:     "134",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"proteus_krake_small": {
		Name:     "Proteus Krake (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "4",
		Armor:    "2",
		Avail:    "18F",
		Body:     "2",
		Cost:     "10000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "136",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				}, {
					Name: "",
				}, {
					Name: "Plasma Torch",
				}, {
					Name: "Ink Pouch",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Built-In", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Micro-Torpedo Launcher",
				},
			},
		},
		ModSlots: "0",
	},
	"saab_thyssen_bloodhound_small": {
		Name:     "Saab-Thyssen Bloodhound (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "2",
		Cost:     "10000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "",
		Page:     "136",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"renraku_dove_4_small": {
		Name:     "Renraku Dove-4 (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "2",
		Cost:     "5000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "136",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"renraku_jardinero_small": {
		Name:     "Renraku Jardinero (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "2",
		Cost:     "2000",
		Handling: "2/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "136",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"renraku_job_a_mat_small": {
		Name:     "Renraku Job-A-Mat (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "0",
		Armor:    "0",
		Avail:    "4",
		Body:     "2",
		Cost:     "3000",
		Handling: "0",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "0",
		Seats:    "",
		Page:     "137",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Immobile (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"renraku_pelican_small": {
		Name:     "Renraku Pelican (Small)",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "2",
		Body:     "2",
		Cost:     "4000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "137",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods:     nil,
		ModSlots: "1",
	},
	"telestrian_shamus": {
		Name:     "Telestrian Shamus",
		Category: "Drones: Small",
		Source:   "R5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "10",
		Body:     "4",
		Cost:     "30000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "8",
		Speed:    "3",
		Seats:    "",
		Page:     "138",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Quicksilver Camera",
				}, {
					Name: "Sensor Array", Rating: "8", MaxRating: "8",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"ares_cheetah_medium": {
		Name:     "Ares Cheetah (Medium)",
		Category: "Drones: Medium",
		Source:   "R5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "12R",
		Body:     "2",
		Cost:     "14000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "6",
		Seats:    "",
		Page:     "139",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Built-In", Visibility: "Concealed",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Jaws",
				},
			},
		},
		ModSlots: "0",
	},
	"evo_krokodil_medium": {
		Name:     "Evo Krokodil (Medium)",
		Category: "Drones: Medium",
		Source:   "R5",
		Accel:    "1",
		Armor:    "6",
		Avail:    "8R",
		Body:     "3",
		Cost:     "12000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2/3",
		Seats:    "",
		Page:     "140",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amphibious (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"federated_boeing_kull_medium": {
		Name:     "Federated-Boeing Kull (Medium)",
		Category: "Drones: Medium",
		Source:   "R5",
		Accel:    "2",
		Armor:    "0",
		Avail:    "4",
		Body:     "3",
		Cost:     "10000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "",
		Page:     "140",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"mct_tunneler_medium": {
		Name:     "MCT Tunneler (Medium)",
		Category: "Drones: Medium",
		Source:   "R5",
		Accel:    "0",
		Armor:    "6",
		Avail:    "8R",
		Body:     "3",
		Cost:     "10000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "0",
		Seats:    "",
		Page:     "140",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "2",
	},
	"renraku_lebd_2_medium": {
		Name:     "Renraku LEBD-2 (Medium)",
		Category: "Drones: Medium",
		Source:   "R5",
		Accel:    "1",
		Armor:    "9",
		Avail:    "12R",
		Body:     "3",
		Cost:     "20000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "2",
		Seats:    "",
		Page:     "140",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Mini (Drone)", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Yamaha Pulsar",
				},
			},
		},
		ModSlots: "0",
	},
	"transys_steed_medium": {
		Name:     "Transys Steed (Medium)",
		Category: "Drones: Medium",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "2",
		Body:     "3",
		Cost:     "4000",
		Handling: "4/2",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "",
		Page:     "141",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"ares_matilda_large": {
		Name:     "Ares Matilda (Large)",
		Category: "Drones: Large",
		Source:   "R5",
		Accel:    "1",
		Armor:    "8",
		Avail:    "12R",
		Body:     "8",
		Cost:     "18000",
		Handling: "1",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "2",
		Seats:    "",
		Page:     "141",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "5",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Underbarrel Grenade Launcher",
				}, {
					Name: "Riot Shield",
				}, {
					Name: "Riot Shield",
				},
			},
		},
	},
	"ares_mule_large": {
		Name:     "Ares Mule (Large)",
		Category: "Drones: Large",
		Source:   "R5",
		Accel:    "1",
		Armor:    "6",
		Avail:    "4",
		Body:     "4",
		Cost:     "8000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "142",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"ares_paladin_large": {
		Name:     "Ares Paladin (Large)",
		Category: "Drones: Large",
		Source:   "R5",
		Accel:    "1",
		Armor:    "18",
		Avail:    "8R",
		Body:     "5",
		Cost:     "5000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "",
		Page:     "142",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Tracked Propulsion",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"crashcart_medicart_large": {
		Name:     "CrashCart Medicart (Large)",
		Category: "Drones: Large",
		Source:   "R5",
		Accel:    "1",
		Armor:    "5",
		Avail:    "6",
		Body:     "6",
		Cost:     "10000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "",
		Page:     "143",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "5",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Tracked Propulsion",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "2",
	},
	"gts_tower_large": {
		Name:     "GTS Tower (Large)",
		Category: "Drones: Large",
		Source:   "R5",
		Accel:    "1",
		Armor:    "6",
		Avail:    "8",
		Body:     "4",
		Cost:     "10000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "143",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Standard Drone Rack (Mini)",
				}, {
					Name: "Standard Drone Rack (Mini)",
				}, {
					Name: "Standard Drone Rack (Mini)",
				}, {
					Name: "Standard Drone Rack (Mini)",
				}, {
					Name: "Retrans Unit",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"saeder_krupp_mk_170_neptune_large": {
		Name:     "Saeder-Krupp MK-170 Neptune (Large)",
		Category: "Drones: Large",
		Source:   "R5",
		Accel:    "1",
		Armor:    "3",
		Avail:    "10F",
		Body:     "5",
		Cost:     "17500",
		Handling: "2",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "143",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Submersible (Drone)",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"mitsuhama_malakim_large": {
		Name:     "Mitsuhama Malakim (Large)",
		Category: "Drones: Large",
		Source:   "R5",
		Accel:    "2",
		Armor:    "9",
		Avail:    "20F",
		Body:     "4",
		Cost:     "40000",
		Handling: "3",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "6",
		Seats:    "",
		Page:     "143",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "Sensor Array", Rating: "4", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"ares_kn_y2_deimos_huge": {
		Name:     "Ares KN-Y2: Deimos (Huge)",
		Category: "Drones: Huge",
		Source:   "R5",
		Accel:    "1",
		Armor:    "18",
		Avail:    "20F",
		Body:     "6",
		Cost:     "220000",
		Handling: "3",
		Pilot:    "5",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "144",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Smartsoft",
				}, {
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"ares_kn_y1_phobos_huge": {
		Name:     "Ares KN-Y1: Phobos (Huge)",
		Category: "Drones: Huge",
		Source:   "R5",
		Accel:    "1",
		Armor:    "18",
		Avail:    "16F",
		Body:     "6",
		Cost:     "250000",
		Handling: "3",
		Pilot:    "5",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "144",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Smartsoft",
				}, {
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"ares_kn_y4_eris_huge": {
		Name:     "Ares KN-Y4: Eris (Huge)",
		Category: "Drones: Huge",
		Source:   "R5",
		Accel:    "1",
		Armor:    "18",
		Avail:    "24F",
		Body:     "6",
		Cost:     "270000",
		Handling: "3",
		Pilot:    "5",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "144",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Smartsoft",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Large (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"mesametric_kodiak_huge": {
		Name:     "Mesametric Kodiak (Huge)",
		Category: "Drones: Huge",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "12R",
		Body:     "6",
		Cost:     "40000",
		Handling: "2/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "145",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "",
				}, {
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "2",
	},
	"neonet_avenging_angel_huge": {
		Name:     "NeoNET Avenging Angel (Huge)",
		Category: "Drones: Huge",
		Source:   "R5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "40F",
		Body:     "6",
		Cost:     "1000000",
		Handling: "3",
		Pilot:    "6",
		Sensor:   "6",
		Speed:    "6",
		Seats:    "",
		Page:     "145",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"criado_juan": {
		Name:     "Criado Juan",
		Category: "Drones: Anthro",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "2",
		Body:     "2",
		Cost:     "8000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "146",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"horizon_little_buddy": {
		Name:     "Horizon Little Buddy",
		Category: "Drones: Anthro",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "1",
		Cost:     "2000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "146",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"mct_kenchiku_kikai": {
		Name:     "MCT Kenchiku-Kikai",
		Category: "Drones: Anthro",
		Source:   "R5",
		Accel:    "1",
		Armor:    "3",
		Avail:    "8R",
		Body:     "5",
		Cost:     "20000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "147",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"neonet_juggernaut": {
		Name:     "NeoNET Juggernaut",
		Category: "Drones: Anthro",
		Source:   "R5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "14R",
		Body:     "6",
		Cost:     "100000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "147",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
	},
	"saeder_krupp_direktionssekretar": {
		Name:     "Saeder-Krupp Direktionssekretar",
		Category: "Drones: Anthro",
		Source:   "R5",
		Accel:    "2",
		Armor:    "3",
		Avail:    "12R",
		Body:     "4",
		Cost:     "40000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "",
		Page:     "148",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"shiawase_i_doll": {
		Name:     "Shiawase i-Doll",
		Category: "Drones: Anthro",
		Source:   "R5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "4",
		Body:     "3",
		Cost:     "20000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "148",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Synthetic Drone Arm",
				}, {
					Name: "Synthetic Drone Arm",
				}, {
					Name: "Synthetic Drone Leg",
				}, {
					Name: "Synthetic Drone Leg",
				}, {
					Name: "Realistic Features (Drone) (Rating 1)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"harley_davidson_scorpion_chopper": {
		Name:     "Harley-Davidson Scorpion (Chopper)",
		Category: "Bikes",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "9",
		Avail:    "0",
		Body:     "8",
		Cost:     "12000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "1",
		Page:     "462",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 1)",
				},
			},
		},
	},
	"yamaha_growler_off_road_bike": {
		Name:     "Yamaha Growler (Off-Road Bike)",
		Category: "Bikes",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "5",
		Avail:    "0",
		Body:     "5",
		Cost:     "5000",
		Handling: "4/5",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3/4",
		Seats:    "1",
		Page:     "462",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				},
			},
		},
	},
	"suzuki_mirage_racing_bike": {
		Name:     "Suzuki Mirage (Racing Bike)",
		Category: "Bikes",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "5",
		Cost:     "8500",
		Handling: "5/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "6",
		Seats:    "1",
		Page:     "462",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
	},
	"chrysler_nissan_jackrabbit_subcompact": {
		Name:     "Chrysler-Nissan Jackrabbit (Subcompact)",
		Category: "Cars",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "4",
		Avail:    "0",
		Body:     "8",
		Cost:     "10000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2",
		Page:     "462",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"chrysler_nissan_journey_car": {
		Name:     "Chrysler-Nissan Journey (Car)",
		Category: "Cars",
		Source:   "SS",
		Accel:    "3",
		Armor:    "5",
		Avail:    "0",
		Body:     "9",
		Cost:     "17000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "4",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"eurocar_westwind_3000_luxury_sports_car": {
		Name:     "Eurocar Westwind 3000 (Luxury Sports Car)",
		Category: "Cars",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "8",
		Avail:    "13",
		Body:     "10",
		Cost:     "110000",
		Handling: "6/4",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "7",
		Seats:    "2",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Passenger Protection System (Rating 6)",
				}, {
					Name: "Anti-Theft System (Rating 2)",
				},
			},
		},
	},
	"honda_spirit_subcompact": {
		Name:     "Honda Spirit (Subcompact)",
		Category: "Cars",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "8",
		Cost:     "12000",
		Handling: "3/2",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "2",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"honda_artemis_car": {
		Name:     "Honda Artemis (Car)",
		Category: "Cars",
		Source:   "SS",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "9",
		Cost:     "17000",
		Handling: "4/2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "4",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"saeder_krupp_lt_21_delivery_van": {
		Name:     "Saeder-Krupp LT-21 (Delivery Van)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "1",
		Armor:    "7",
		Avail:    "0",
		Body:     "15",
		Cost:     "31000",
		Handling: "2/1",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "2",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"hyundai_shin_hyung_sport_sedan": {
		Name:     "Hyundai Shin-Hyung (Sport Sedan)",
		Category: "Cars",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "10",
		Cost:     "28500",
		Handling: "5/4",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "6",
		Seats:    "4",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		BodyModSlots: "4",
	},
	"dodge_ram_industrial_large_garbage_truck": {
		Name:     "Dodge Ram Industrial (Large) (Garbage Truck)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "1",
		Armor:    "8",
		Avail:    "4",
		Body:     "16",
		Cost:     "51000",
		Handling: "2/1",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "4",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"dodge_ram_industrial_narrow_garbage_truck": {
		Name:     "Dodge Ram Industrial (Narrow) (Garbage Truck)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "1",
		Armor:    "8",
		Avail:    "4",
		Body:     "16",
		Cost:     "49000",
		Handling: "3/1",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "4",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"esprit_industries_watcher_suv": {
		Name:     "Esprit Industries Watcher (SUV)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "3",
		Armor:    "8",
		Avail:    "4",
		Body:     "9",
		Cost:     "40000",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "5",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mitsubishi_nightsky_limousine": {
		Name:     "Mitsubishi Nightsky (Limousine)",
		Category: "Cars",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "15",
		Avail:    "16",
		Body:     "15",
		Cost:     "320000",
		Handling: "4/3",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "4",
		Seats:    "8",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Luxury)",
				}, {
					Name: "Life Support (Rating 2)",
				},
			},
		},
	},
	"ford_americar_sedan": {
		Name:     "Ford Americar (Sedan)",
		Category: "Cars",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "11",
		Cost:     "16000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "4",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"saeder_krupp_bentley_concordat_luxury_sedan": {
		Name:     "Saeder-Krupp-Bentley Concordat (Luxury Sedan)",
		Category: "Cars",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "10",
		Body:     "12",
		Cost:     "65000",
		Handling: "5/4",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "4",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"rover_2072_suv": {
		Name:     "Rover 2072 (SUV)",
		Category: "Trucks",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "10",
		Body:     "15",
		Cost:     "68000",
		Handling: "5/5",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "6",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"toyota_gopher_heavy_duty_pickup": {
		Name:     "Toyota Gopher (Heavy-Duty Pickup)",
		Category: "Trucks",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "10",
		Avail:    "0",
		Body:     "14",
		Cost:     "25000",
		Handling: "5/5",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "3",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				}, {
					Name: "Special Equipment",
				},
			},
		},
	},
	"gmc_bulldog_step_van_van": {
		Name:     "GMC Bulldog Step-Van (Van)",
		Category: "Trucks",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "12",
		Avail:    "0",
		Body:     "16",
		Cost:     "35000",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "463",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		BodyModSlots: "4",
	},
	"gmc_endurance_van": {
		Name:     "GMC Endurance (Van)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "14",
		Cost:     "35000",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "8",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"gmc_sidewinder_suv": {
		Name:     "GMC Sidewinder (SUV)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "2",
		Armor:    "6",
		Avail:    "4",
		Body:     "10",
		Cost:     "33000",
		Handling: "4/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "6",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"ares_roadmaster_armored_transport": {
		Name:     "Ares Roadmaster (Armored Transport)",
		Category: "Trucks",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "18",
		Avail:    "8",
		Body:     "18",
		Cost:     "52000",
		Handling: "3/3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "8",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"conestoga_vista_bus": {
		Name:     "Conestoga Vista (Bus)",
		Category: "Trucks",
		Source:   "AR",
		Accel:    "15/25",
		Armor:    "4",
		Avail:    "0",
		Body:     "20",
		Cost:     "25000",
		Handling: "-3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "90",
		Seats:    "",
		Page:     "110",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				},
			},
		},
	},
	"conestoga_trailblazer_moving_truck": {
		Name:     "Conestoga Trailblazer (Moving Truck)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "1",
		Armor:    "6",
		Avail:    "4",
		Body:     "14",
		Cost:     "75000",
		Handling: "2/1",
		Pilot:    "2",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "2",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"conestoga_trailblazer_wtrailer_moving_truck": {
		Name:     "Conestoga Trailblazer w/Trailer (Moving Truck)",
		Category: "Trucks",
		Source:   "SS",
		Accel:    "1",
		Armor:    "6",
		Avail:    "4",
		Body:     "20",
		Cost:     "95000",
		Handling: "1/1",
		Pilot:    "2",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "2",
		Page:     "186",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"samuvani_criscraft_otter_sport_cruiser": {
		Name:     "Samuvani Criscraft Otter (Sport Cruiser)",
		Category: "Boats",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "12",
		Cost:     "21000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "8",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"yongkang_gala_trinity_speedboat": {
		Name:     "Yongkang Gala Trinity (Speedboat)",
		Category: "Boats",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "6",
		Avail:    "8",
		Body:     "10",
		Cost:     "37000",
		Handling: "5",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "6",
		Seats:    "3",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Smuggling Compartment",
				}, {
					Name: "Assembly/Disassembly",
				},
			},
		},
	},
	"morgan_cutlass_patrol_boat": {
		Name:     "Morgan Cutlass (Patrol Boat)",
		Category: "Boats",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "10",
		Avail:    "14R",
		Body:     "16",
		Cost:     "96000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "4",
		Seats:    "6",
		Page:     "454",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Armored Manual", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Armored Manual", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"proteus_lamprey_sea_sled": {
		Name:     "Proteus Lamprey (Sea Sled)",
		Category: "Submarines",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "6",
		Avail:    "0",
		Body:     "6",
		Cost:     "14000",
		Handling: "3",
		Pilot:    "1",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "4",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Landing Drone Rack (Medium)",
				},
			},
		},
	},
	"vulkan_electronaut_mini_sub": {
		Name:     "Vulkan Electronaut (Mini-sub)",
		Category: "Submarines",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "10",
		Avail:    "10",
		Body:     "12",
		Cost:     "108000",
		Handling: "3",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "2",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"artemis_industries_nightwing_glider": {
		Name:     "Artemis Industries Nightwing (Glider)",
		Category: "Fixed-Wing Aircraft",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "4",
		Cost:     "20000",
		Handling: "6",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "1",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Signature Masking (Rating 4)",
				},
			},
		},
	},
	"cessna_c750_twin_prop_airplane": {
		Name:     "Cessna C750 (Twin-Prop Airplane)",
		Category: "Fixed-Wing Aircraft",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "4",
		Avail:    "8",
		Body:     "18",
		Cost:     "146000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "4",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"renault_fiat_fokker_tundra_9_amphibious_jet": {
		Name:     "Renault-Fiat Fokker Tundra-9 (Amphibious Jet)",
		Category: "Fixed-Wing Aircraft",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "10",
		Avail:    "12",
		Body:     "20",
		Cost:     "300000",
		Handling: "2",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "24",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Secondary Propulsion (Amphibious, Surface)",
				},
			},
		},
	},
	"ares_dragon_cargo_helicopter": {
		Name:     "Ares Dragon (Cargo Helicopter)",
		Category: "Rotorcraft",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "8",
		Avail:    "12",
		Body:     "22",
		Cost:     "355000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "18",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"nissan_hound_transport_helicopter": {
		Name:     "Nissan Hound (Transport Helicopter)",
		Category: "Rotorcraft",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "16",
		Avail:    "13R",
		Body:     "16",
		Cost:     "425000",
		Handling: "5",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "12",
		Page:     "464",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"northrup_wasp_autogyro": {
		Name:     "Northrup Wasp (Autogyro)",
		Category: "Rotorcraft",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "8",
		Avail:    "12R",
		Body:     "10",
		Cost:     "86000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "1",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
		Mods: nil,
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"ares_venture_lav": {
		Name:     "Ares Venture (LAV)",
		Category: "VTOL/VSTOL",
		Source:   "SR5",
		Accel:    "4",
		Armor:    "14",
		Avail:    "12F",
		Body:     "16",
		Cost:     "400000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "7",
		Seats:    "6",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"gmc_banshee_thunderbird": {
		Name:     "GMC Banshee (Thunderbird)",
		Category: "VTOL/VSTOL",
		Source:   "SR5",
		Accel:    "4",
		Armor:    "18",
		Avail:    "24F",
		Body:     "20",
		Cost:     "2500000",
		Handling: "6",
		Pilot:    "4",
		Sensor:   "6",
		Speed:    "8",
		Seats:    "12",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "6", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Cocoon",
				}, {
					Name: "ECM (Rating 4)",
				},
			},
		},
	},
	"federated_boeing_commuter_tilt_wing_airplane": {
		Name:     "Federated Boeing Commuter (Tilt-Wing Airplane)",
		Category: "VTOL/VSTOL",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "8",
		Avail:    "10",
		Body:     "16",
		Cost:     "350000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "30",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"shiawase_kanmushi_microdrone": {
		Name:     "Shiawase Kanmushi (Microdrone)",
		Category: "Drones: Micro",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "0",
		Cost:     "1000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gecko Tips",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"sikorsky_bell_microskimmer_microdrone": {
		Name:     "Sikorsky-Bell Microskimmer (Microdrone)",
		Category: "Drones: Micro",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "0",
		Avail:    "6",
		Body:     "0",
		Cost:     "1000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"horizon_flying_eye_minidrone": {
		Name:     "Horizon Flying Eye (Minidrone)",
		Category: "Drones: Mini",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "0",
		Avail:    "8",
		Body:     "1",
		Cost:     "2000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"horizon_flying_eye_wflash_pak_and_grenade_minidrone": {
		Name:     "Horizon Flying Eye w/Flash-Pak and Grenade (Minidrone)",
		Category: "Drones: Mini",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "0",
		Avail:    "8",
		Body:     "1",
		Cost:     "2500",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "465",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Grenade: Flash-Pak",
				}, {
					Name: "Grenade: Smoke",
				}, {
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"ocular_drone": {
		Name:     "Ocular Drone",
		Category: "Drones: Mini",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "0",
		Avail:    "8",
		Body:     "1",
		Cost:     "0",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "453",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		Hide: &[]bool{true}[0],
	},
	"mct_fly_spy_minidrone": {
		Name:     "MCT Fly-Spy (Minidrone)",
		Category: "Drones: Mini",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "0",
		Avail:    "8",
		Body:     "1",
		Cost:     "2000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Realistic Features (Rating 2)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"aztechnology_crawler_small": {
		Name:     "Aztechnology Crawler (Small)",
		Category: "Drones: Small",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "3",
		Avail:    "4",
		Body:     "3",
		Cost:     "4000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"lockheed_optic_x2_small": {
		Name:     "Lockheed Optic-X2 (Small)",
		Category: "Drones: Small",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "2",
		Avail:    "10",
		Body:     "2",
		Cost:     "21000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Signature Masking (Rating 3)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"cyberspace_designs_dragonfly_small": {
		Name:     "Cyberspace Designs Dragonfly (Small)",
		Category: "Drones: Small",
		Source:   "SS",
		Accel:    "2",
		Armor:    "1",
		Avail:    "12R",
		Body:     "1",
		Cost:     "2500",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "",
		Page:     "179",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"ares_duelist_medium": {
		Name:     "Ares Duelist (Medium)",
		Category: "Drones: Anthro",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "5R",
		Body:     "4",
		Cost:     "4500",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Realistic Features (Rating 1)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Light", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Light", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Sword",
				}, {
					Name: "Sword",
				},
			},
		},
	},
	"bust_a_move_2nd_generation_medium": {
		Name:     "Bust-A-Move (2nd Generation) (Medium)",
		Category: "Drones: Medium",
		Source:   "SS",
		Accel:    "1",
		Armor:    "1",
		Avail:    "0",
		Body:     "2",
		Cost:     "Variable(700-1500)",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "",
		Page:     "178",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"transys_office_maid_medium": {
		Name:     "Transys Office Maid (Medium)",
		Category: "Drones: Medium",
		Source:   "SS",
		Accel:    "2",
		Armor:    "0",
		Avail:    "4",
		Body:     "3",
		Cost:     "8000",
		Handling: "3",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "179",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"gm_nissan_doberman_medium": {
		Name:     "GM-Nissan Doberman (Medium)",
		Category: "Drones: Medium",
		Source:   "SR5",
		Accel:    "1",
		Armor:    "4",
		Avail:    "4R",
		Body:     "4",
		Cost:     "5000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "External",
				},
			},
		},
	},
	"mct_nissan_roto_drone_medium": {
		Name:     "MCT-Nissan Roto-drone (Medium)",
		Category: "Drones: Medium",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "4",
		Avail:    "6",
		Body:     "4",
		Cost:     "5000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots:       "7",
		WeaponModSlots: "3",
	},
	"cyberspace_designs_dalmatian_large": {
		Name:     "Cyberspace Designs Dalmatian (Large)",
		Category: "Drones: Large",
		Source:   "SR5",
		Accel:    "3",
		Armor:    "5",
		Avail:    "6R",
		Body:     "5",
		Cost:     "10000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"gmc_snatchngrab_large": {
		Name:     "GMC Snatch'n'Grab (Large)",
		Category: "Drones: Large",
		Source:   "SS",
		Accel:    "2",
		Armor:    "4",
		Avail:    "12F",
		Body:     "2",
		Cost:     "8000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "179",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"modified_dassault_janitorial_drone_large": {
		Name:     "Modified Dassault Janitorial Drone (Large)",
		Category: "Drones: Large",
		Source:   "SS",
		Accel:    "2",
		Armor:    "2",
		Avail:    "8",
		Body:     "10",
		Cost:     "10000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "179",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"modified_renraku_manservant_3_large": {
		Name:     "Modified Renraku Manservant-3 (Large)",
		Category: "Drones: Anthro",
		Source:   "SS",
		Accel:    "2",
		Armor:    "5",
		Avail:    "14F",
		Body:     "3",
		Cost:     "9000",
		Handling: "2",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "180",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"steel_lynx_combat_drone_large": {
		Name:     "Steel Lynx Combat Drone (Large)",
		Category: "Drones: Large",
		Source:   "SR5",
		Accel:    "2",
		Armor:    "12",
		Avail:    "10R",
		Body:     "6",
		Cost:     "25000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "466",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"aeroquip_med_1_dustoff_medical_evacuation_drone_large": {
		Name:     "Aeroquip M.E.D.-1 'Dustoff' Medical Evacuation Drone (Large)",
		Category: "Drones: Large",
		Source:   "BB",
		Accel:    "4",
		Armor:    "5",
		Avail:    "10R",
		Body:     "4",
		Cost:     "12000",
		Handling: "3",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "23",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "5",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Dustoff Armored Valkyrie Module",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"shiawase_caduceus_cad_7_medium": {
		Name:     "Shiawase Caduceus 'CAD' 7 (Medium)",
		Category: "Drones: Anthro",
		Source:   "BB",
		Accel:    "1",
		Armor:    "3",
		Avail:    "12R",
		Body:     "5",
		Cost:     "16500",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "",
		Page:     "23",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Medkit", Rating: "4",
				}, {
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Adaptation",
				},
			},
		},
	},
	"f_b_bumblebee": {
		Name:     "F-B Bumblebee",
		Category: "Drones: Medium",
		Source:   "NP",
		Accel:    "1",
		Armor:    "14",
		Avail:    "12F",
		Body:     "4",
		Cost:     "24000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "23",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "4",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Heavy [SR5]", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Stoner-Ares M202",
				},
			},
		},
	},
	"cocotaxi": {
		Name:     "Cocotaxi",
		Category: "Bikes",
		Source:   "HT",
		Accel:    "2",
		Armor:    "4",
		Avail:    "0",
		Body:     "5",
		Cost:     "4000",
		Handling: "4/2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "3",
		Page:     "139",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"camellos": {
		Name:     "Camellos",
		Category: "Municipal/Construction",
		Source:   "HT",
		Accel:    "1",
		Armor:    "5",
		Avail:    "0",
		Body:     "16",
		Cost:     "150000",
		Handling: "3/2",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "200",
		Page:     "139",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"ares_garuda": {
		Name:     "Ares Garuda",
		Category: "Drones: Missile",
		Source:   "R5",
		Accel:    "2/4",
		Armor:    "2",
		Avail:    "20F",
		Body:     "2",
		Cost:     "8500",
		Handling: "6",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3/6",
		Seats:    "",
		Page:     "149",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"remote_cyberhand": {
		Name:     "Remote Cyberhand",
		Category: "Drones: Mini",
		Source:   "R5",
		Accel:    "0",
		Armor:    "0",
		Avail:    "8",
		Body:     "0",
		Cost:     "0",
		Handling: "0",
		Pilot:    "0",
		Sensor:   "0",
		Speed:    "0",
		Seats:    "",
		Page:     "130",
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		Hide: &[]bool{true}[0],
	},
	"ammo_drone_small": {
		Name:     "Ammo Drone (Small)",
		Category: "Drones: Small",
		Source:   "HT",
		Accel:    "2",
		Armor:    "4",
		Avail:    "5",
		Body:     "2",
		Cost:     "3000",
		Handling: "2",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "189",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"reloading_drone_medium": {
		Name:     "Reloading Drone (Medium)",
		Category: "Drones: Medium",
		Source:   "HT",
		Accel:    "2",
		Armor:    "4",
		Avail:    "6R",
		Body:     "3",
		Cost:     "4500",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "",
		Page:     "190",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"mitsuhama_akiyama_medium": {
		Name:     "Mitsuhama Akiyama (Medium)",
		Category: "Drones: Anthro",
		Source:   "HT",
		Accel:    "2",
		Armor:    "6",
		Avail:    "24F",
		Body:     "4",
		Cost:     "200000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "",
		Page:     "190",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Chameleon Coating",
				}, {
					Name: "Gecko Grips (Drone)",
				}, {
					Name: "Synthetic Drone Arm",
				}, {
					Name: "Synthetic Drone Arm",
				}, {
					Name: "Synthetic Drone Leg",
				}, {
					Name: "Synthetic Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"sparring_drone_large": {
		Name:     "Sparring Drone (Large)",
		Category: "Drones: Anthro",
		Source:   "HT",
		Accel:    "2",
		Armor:    "2",
		Avail:    "6",
		Body:     "4",
		Cost:     "5000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "190",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "4",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"clockwork_greyhound": {
		Name:     "Clockwork Greyhound",
		Category: "Drones: Medium",
		Source:   "TVG",
		Accel:    "1",
		Armor:    "1",
		Avail:    "16",
		Body:     "2",
		Cost:     "225000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "",
		Page:     "19",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"holo_conference_drone_small": {
		Name:     "Holo-Conference Drone (Small)",
		Category: "Drones: Small",
		Source:   "CA",
		Accel:    "1",
		Armor:    "3",
		Avail:    "11",
		Body:     "2",
		Cost:     "18000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "",
		Page:     "147",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"medusa_extensions_mini": {
		Name:     "Medusa Extensions (Mini)",
		Category: "Drones: Mini",
		Source:   "CA",
		Accel:    "0",
		Armor:    "0",
		Avail:    "7",
		Body:     "1",
		Cost:     "600",
		Handling: "1",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "0",
		Seats:    "",
		Page:     "147",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"microweave_spider_mini": {
		Name:     "Microweave Spider (Mini)",
		Category: "Drones: Mini",
		Source:   "CA",
		Accel:    "1",
		Armor:    "0",
		Avail:    "11",
		Body:     "1",
		Cost:     "18000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "147",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "4",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"dodge_scoot_2050": {
		Name:     "Dodge Scoot (2050)",
		Category: "Bikes",
		Source:   "2050",
		Accel:    "1",
		Armor:    "4",
		Avail:    "0",
		Body:     "4",
		Cost:     "1000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "1",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Improved Economy",
				},
			},
		},
	},
	"yamaha_rapier_2050": {
		Name:     "Yamaha Rapier (2050)",
		Category: "Bikes",
		Source:   "2050",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "5",
		Cost:     "10000",
		Handling: "5/3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "6",
		Seats:    "1",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
	},
	"harley_davidson_scorpion_2050": {
		Name:     "Harley-Davidson Scorpion (2050)",
		Category: "Bikes",
		Source:   "2050",
		Accel:    "2",
		Armor:    "9",
		Avail:    "0",
		Body:     "8",
		Cost:     "15000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "1",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
	},
	"mitsubishi_runabout_2050": {
		Name:     "Mitsubishi Runabout (2050)",
		Category: "Cars",
		Source:   "2050",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "8",
		Cost:     "10000",
		Handling: "3/2",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "2",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"chrysler_nissan_jackrabbit_2050": {
		Name:     "Chrysler-Nissan Jackrabbit (2050)",
		Category: "Cars",
		Source:   "2050",
		Accel:    "2",
		Armor:    "4",
		Avail:    "0",
		Body:     "8",
		Cost:     "15000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"ford_americar_2050": {
		Name:     "Ford Americar (2050)",
		Category: "Cars",
		Source:   "2050",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "11",
		Cost:     "20000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "4",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"eurocar_westwind_2000_2050": {
		Name:     "Eurocar Westwind 2000 (2050)",
		Category: "Cars",
		Source:   "2050",
		Accel:    "3",
		Armor:    "8",
		Avail:    "0",
		Body:     "10",
		Cost:     "100000",
		Handling: "6/4",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "6",
		Seats:    "2",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"toyota_elite_2050": {
		Name:     "Toyota Elite (2050)",
		Category: "Cars",
		Source:   "2050",
		Accel:    "2",
		Armor:    "12",
		Avail:    "0",
		Body:     "12",
		Cost:     "125000",
		Handling: "5/4",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "4",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"mitsubishi_nightsky_2050": {
		Name:     "Mitsubishi Nightsky (2050)",
		Category: "Cars",
		Source:   "2050",
		Accel:    "2",
		Armor:    "15",
		Avail:    "0",
		Body:     "15",
		Cost:     "250000",
		Handling: "4/3",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "4",
		Seats:    "8",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
	},
	"bulldog_step_van_2050": {
		Name:     "Bulldog Step-Van (2050)",
		Category: "Cars",
		Source:   "2050",
		Accel:    "1",
		Armor:    "12",
		Avail:    "0",
		Body:     "16",
		Cost:     "35000",
		Handling: "3/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"samuvani_criscraft_otter_2050": {
		Name:     "Samuvani-Criscraft Otter (2050)",
		Category: "Boats",
		Source:   "2050",
		Accel:    "2",
		Armor:    "6",
		Avail:    "0",
		Body:     "12",
		Cost:     "20000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "8",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"aztech_nightrunner_2050": {
		Name:     "Aztech Nightrunner (2050)",
		Category: "Boats",
		Source:   "2050",
		Accel:    "2",
		Armor:    "6",
		Avail:    "4R",
		Body:     "12",
		Cost:     "30000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"sendanko_marlin_2050": {
		Name:     "Sendanko Marlin (2050)",
		Category: "Boats",
		Source:   "2050",
		Accel:    "2",
		Armor:    "4",
		Avail:    "0",
		Body:     "14",
		Cost:     "15000",
		Handling: "2",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "6",
		Page:     "208",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"cessna_c750_2050": {
		Name:     "Cessna C750 (2050)",
		Category: "Fixed-Wing Aircraft",
		Source:   "2050",
		Accel:    "3",
		Armor:    "4",
		Avail:    "4",
		Body:     "18",
		Cost:     "200000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "6",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"lear_cessna_platinum_1_2050": {
		Name:     "Lear-Cessna Platinum 1 (2050)",
		Category: "Fixed-Wing Aircraft",
		Source:   "2050",
		Accel:    "4",
		Armor:    "6",
		Avail:    "8",
		Body:     "20",
		Cost:     "500000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "8",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"federated_boeing_commuter_2050": {
		Name:     "Federated-Boeing Commuter (2050)",
		Category: "VTOL/VSTOL",
		Source:   "2050",
		Accel:    "3",
		Armor:    "8",
		Avail:    "8R",
		Body:     "16",
		Cost:     "625000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "30",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"hughes_stallion_wk_4_2050": {
		Name:     "Hughes Stallion WK-4 (2050)",
		Category: "Rotorcraft",
		Source:   "2050",
		Accel:    "3",
		Armor:    "10",
		Avail:    "6",
		Body:     "16",
		Cost:     "300000",
		Handling: "5",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "6",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"ares_dragon_2050": {
		Name:     "Ares Dragon (2050)",
		Category: "Rotorcraft",
		Source:   "2050",
		Accel:    "3",
		Armor:    "8",
		Avail:    "6",
		Body:     "22",
		Cost:     "600000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "18",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"hughes_airstar_2050": {
		Name:     "Hughes Airstar (2050)",
		Category: "Rotorcraft",
		Source:   "2050",
		Accel:    "3",
		Armor:    "8",
		Avail:    "7",
		Body:     "16",
		Cost:     "900000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "6",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"efa_variant_2050": {
		Name:     "EFA-Variant (2050)",
		Category: "Fixed-Wing Aircraft",
		Source:   "2050",
		Accel:    "6",
		Armor:    "12",
		Avail:    "13F",
		Body:     "18",
		Cost:     "5000000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "8",
		Seats:    "2",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
	},
	"gmc_banshee_2050": {
		Name:     "GMC-Banshee (2050)",
		Category: "VTOL/VSTOL",
		Source:   "2050",
		Accel:    "4",
		Armor:    "18",
		Avail:    "0",
		Body:     "20",
		Cost:     "0",
		Handling: "6",
		Pilot:    "4",
		Sensor:   "6",
		Speed:    "8",
		Seats:    "12",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "6", MaxRating: "7",
				},
			},
		},
	},
	"ares_citymaster_2050": {
		Name:     "Ares Citymaster (2050)",
		Category: "Trucks",
		Source:   "2050",
		Accel:    "1",
		Armor:    "18",
		Avail:    "20R",
		Body:     "18",
		Cost:     "500000",
		Handling: "3/3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "8",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"chrysler_nissan_patrol_1_2050": {
		Name:     "Chrysler-Nissan Patrol-1 (2050)",
		Category: "Trucks",
		Source:   "2050",
		Accel:    "3",
		Armor:    "12",
		Avail:    "12R",
		Body:     "12",
		Cost:     "100000",
		Handling: "5/4",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "4",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"gmc_beachcraft_patroller_2050": {
		Name:     "GMC Beachcraft Patroller (2050)",
		Category: "Municipal/Construction",
		Source:   "2050",
		Accel:    "2",
		Armor:    "10",
		Avail:    "16R",
		Body:     "20",
		Cost:     "750000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "3",
		Seats:    "6",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
	},
	"gmc_riverine_2050": {
		Name:     "GMC Riverine (2050)",
		Category: "Boats",
		Source:   "2050",
		Accel:    "4",
		Armor:    "10",
		Avail:    "16R",
		Body:     "14",
		Cost:     "125000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "6",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"northrup_prc_42b_wasp_2050": {
		Name:     "Northrup PRC-42B Wasp (2050)",
		Category: "Rotorcraft",
		Source:   "2050",
		Accel:    "3",
		Armor:    "8",
		Avail:    "12R",
		Body:     "10",
		Cost:     "220000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "1",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"northrup_prc_44b_yellowjacket_2050": {
		Name:     "Northrup PRC-44B Yellowjacket (2050)",
		Category: "Rotorcraft",
		Source:   "2050",
		Accel:    "3",
		Armor:    "10",
		Avail:    "12R",
		Body:     "10",
		Cost:     "280000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "1",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"federated_boeing_eagle_2050": {
		Name:     "Federated-Boeing Eagle (2050)",
		Category: "VTOL/VSTOL",
		Source:   "2050",
		Accel:    "4",
		Armor:    "14",
		Avail:    "26F",
		Body:     "16",
		Cost:     "0",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "7",
		Seats:    "6",
		Page:     "210",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"surveillance_drone_2050": {
		Name:     "Surveillance Drone (2050)",
		Category: "Drones: Medium",
		Source:   "2050",
		Accel:    "2",
		Armor:    "4",
		Avail:    "6",
		Body:     "4",
		Cost:     "10000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "212",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "4",
	},
	"spotter_drone_2050": {
		Name:     "Spotter Drone (2050)",
		Category: "Drones: Medium",
		Source:   "2050",
		Accel:    "3",
		Armor:    "2",
		Avail:    "4",
		Body:     "4",
		Cost:     "15000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "",
		Page:     "212",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "4",
	},
	"hunter_drone_2050": {
		Name:     "Hunter Drone (2050)",
		Category: "Drones: Medium",
		Source:   "2050",
		Accel:    "3",
		Armor:    "5",
		Avail:    "6R",
		Body:     "4",
		Cost:     "20000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "",
		Page:     "212",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
	},
	"patrol_vehicle_2050": {
		Name:     "Patrol Vehicle (2050)",
		Category: "Drones: Large",
		Source:   "2050",
		Accel:    "2",
		Armor:    "12",
		Avail:    "6R",
		Body:     "6",
		Cost:     "10000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "212",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
	},
	"bmw_sleipnir": {
		Name:     "BMW Sleipnir",
		Category: "Bikes",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "8",
		Avail:    "0",
		Body:     "8",
		Cost:     "14000",
		Handling: "3/5",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "3",
		Page:     "43",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				}, {
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Metahuman Adjustment (Rating 3)",
				},
			},
		},
	},
	"shiawase_motors_shuriken": {
		Name:     "Shiawase Motors Shuriken",
		Category: "Bikes",
		Source:   "SAG",
		Accel:    "3",
		Armor:    "5",
		Avail:    "4",
		Body:     "5",
		Cost:     "32000",
		Handling: "5/2",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "6",
		Seats:    "1",
		Page:     "44",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Gyro-Stabilization",
				}, {
					Name: "GridLink",
				},
			},
		},
	},
	"bmw_gaia": {
		Name:     "BMW Gaia",
		Category: "Cars",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "8",
		Avail:    "0",
		Body:     "11",
		Cost:     "35000",
		Handling: "4/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "4",
		Page:     "45",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Passenger Protection System (Rating 2)",
				}, {
					Name: "Improved Economy",
				}, {
					Name: "GridLink",
				}, {
					Name: "Amenities (Middle)",
				},
			},
		},
	},
	"emc_celine": {
		Name:     "EMC Celine",
		Category: "Cars",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "10",
		Avail:    "0",
		Body:     "14",
		Cost:     "45000",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "46",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Passenger Protection System (Rating 4)",
				}, {
					Name: "ECM (Rating 2)",
				}, {
					Name: "Improved Economy",
				}, {
					Name: "GridLink",
				}, {
					Name: "Amenities (High)",
				}, {
					Name: "Interior Cameras",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Armor (Concealed) (Rating 3)",
				},
			},
		},
	},
	"eurocar_escape": {
		Name:     "Eurocar Escape",
		Category: "Trucks",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "12",
		Avail:    "0",
		Body:     "16",
		Cost:     "185000",
		Handling: "3/4",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "8",
		Page:     "47",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Standard Drone Rack (Small)",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Amenities (High)",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "SunCell",
				},
			},
		},
	},
	"mercedes_250_classic": {
		Name:     "Mercedes 250 Classic",
		Category: "Cars",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "7",
		Avail:    "0",
		Body:     "11",
		Cost:     "28000",
		Handling: "4/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "5",
		Page:     "48",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Passenger Protection System (Rating 1)",
				}, {
					Name: "Life Support (Rating 1)",
				},
			},
		},
	},
	"mercedes_click": {
		Name:     "Mercedes Click",
		Category: "Cars",
		Source:   "SAG",
		Accel:    "3",
		Armor:    "5",
		Avail:    "0",
		Body:     "10",
		Cost:     "24000",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "4",
		Page:     "49",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 4)",
				},
			},
		},
	},
	"mercedes_paladin": {
		Name:     "Mercedes Paladin",
		Category: "Cars",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "14",
		Avail:    "0",
		Body:     "16",
		Cost:     "260000",
		Handling: "5/3",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "8",
		Page:     "50",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Passenger Protection System (Rating 2)",
				}, {
					Name: "ECM (Rating 2)",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "GridLink",
				}, {
					Name: "Amenities (Luxury)",
				}, {
					Name: "Armor (Concealed) (Rating 4)",
				},
			},
		},
	},
	"nordseewerke_thetis": {
		Name:     "Nordseewerke Thetis",
		Category: "Hovercraft",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "10",
		Avail:    "14",
		Body:     "18",
		Cost:     "80000",
		Handling: "2/2",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "50",
		Page:     "51",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Interior Cameras",
				}, {
					Name: "SunCell",
				}, {
					Name: "Metahuman Adjustment (Rating 25)",
				},
			},
		},
	},
	"caterpillar_omniwinder": {
		Name:     "Caterpillar Omniwinder",
		Category: "Municipal/Construction",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "16",
		Avail:    "16",
		Body:     "20",
		Cost:     "235000",
		Handling: "2/2",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "3",
		Page:     "52",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 1)",
				}, {
					Name: "Passenger Protection System (Rating 4)",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Multifuel Engine",
				},
			},
		},
	},
	"emc_2073_catcher": {
		Name:     "EMC 2073 Catcher",
		Category: "Corpsec/Police/Military",
		Source:   "SAG",
		Accel:    "3",
		Armor:    "8",
		Avail:    "12R",
		Body:     "12",
		Cost:     "56000",
		Handling: "5/4",
		Pilot:    "4",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "4",
		Page:     "53",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Passenger Protection System (Rating 2)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				}, {
					Control: "Remote", Flexibility: "Flexible", Size: "Standard", Visibility: "Internal",
				},
			},
		},
	},
	"vw_freya": {
		Name:     "VW Freya",
		Category: "Municipal/Construction",
		Source:   "SAG",
		Accel:    "3",
		Armor:    "8",
		Avail:    "10",
		Body:     "14",
		Cost:     "38000",
		Handling: "3/3",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "3",
		Page:     "54",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Passenger Protection System (Rating 2)",
				}, {
					Name: "Valkyrie Module",
				},
			},
		},
	},
	"kamow_ka_226_sergej": {
		Name:     "Kamow Ka-226 Sergej",
		Category: "Rotorcraft",
		Source:   "SAG",
		Accel:    "3",
		Armor:    "6",
		Avail:    "10",
		Body:     "16",
		Cost:     "225000",
		Handling: "2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "6",
		Page:     "55",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "1",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Multifuel Engine",
				}, {
					Name: "Winch (Basic)",
				},
			},
		},
	},
	"kamow_ka_226_kasatka": {
		Name:     "Kamow Ka-226 Kasatka",
		Category: "Rotorcraft",
		Source:   "SAG",
		Accel:    "3",
		Armor:    "6",
		Avail:    "12",
		Body:     "14",
		Cost:     "300000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "6",
		Page:     "55",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Multifuel Engine",
				},
			},
		},
	},
	"airbus_a140": {
		Name:     "Airbus A140",
		Category: "Rotorcraft",
		Source:   "SAG",
		Accel:    "4",
		Armor:    "12",
		Avail:    "12",
		Body:     "18",
		Cost:     "420000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "8",
		Page:     "56",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 4)",
				}, {
					Name: "Amenities (Middle)",
				}, {
					Name: "Interior Cameras",
				}, {
					Name: "Life Support (Rating 1)",
				}, {
					Name: "Extra Entry/Exit Points",
				},
			},
		},
	},
	"cargolifter_industries_cl_180": {
		Name:     "Cargolifter Industries CL-180",
		Category: "LTAV",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "12",
		Avail:    "12",
		Body:     "12",
		Cost:     "82000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "2",
		Seats:    "4",
		Page:     "57",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "SunCell",
				},
			},
		},
	},
	"jena_robotnik_pilalux": {
		Name:     "Jena Robotnik Pilalux",
		Category: "Drones: Mini",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "0",
		Avail:    "10",
		Body:     "1",
		Cost:     "5500",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "0",
		Page:     "58",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Flash-Pak",
				}, {
					Name: "Gecko Grips (Drone)",
				}, {
					Name: "Spotlight (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"jena_robotnik_tegenaria": {
		Name:     "Jena Robotnik Tegenaria",
		Category: "Drones: Mini",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "1",
		Cost:     "3000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "0",
		Page:     "59",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gecko Grips (Drone)",
				}, {
					Name: "Realistic Features (Rating 1)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"jena_robotnik_araneus": {
		Name:     "Jena Robotnik Araneus",
		Category: "Drones: Mini",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "0",
		Avail:    "12",
		Body:     "1",
		Cost:     "5000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "0",
		Page:     "59",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gecko Grips (Drone)",
				}, {
					Name: "Realistic Features (Rating 1)",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"messerschmitt_kawasaki_hugin": {
		Name:     "Messerschmitt-Kawasaki Hugin",
		Category: "Drones: Small",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "2",
		Cost:     "1500",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "0",
		Page:     "60",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "2",
	},
	"messerschmitt_kawasaki_munin": {
		Name:     "Messerschmitt-Kawasaki Munin",
		Category: "Drones: Small",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "0",
		Avail:    "8",
		Body:     "2",
		Cost:     "8500",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "0",
		Page:     "60",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Realistic Features (Rating 4)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "2",
	},
	"messerschmitt_kawasaki_libelle": {
		Name:     "Messerschmitt-Kawasaki Libelle",
		Category: "Drones: Small",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "1",
		Avail:    "8",
		Body:     "2",
		Cost:     "4500",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "2",
		Seats:    "0",
		Page:     "61",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Assembly Time Improvement (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "1",
	},
	"ruhrmetall_skarabäus": {
		Name:     "Ruhrmetall Skarabäus",
		Category: "Drones: Small",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "6",
		Avail:    "12R",
		Body:     "3",
		Cost:     "9500",
		Handling: "4/2",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "0",
		Page:     "62",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				}, {
					Name: "",
				}, {
					Name: "Smartsoft",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Small (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "1",
	},
	"schiebel_robotic_crust_mark_ii": {
		Name:     "Schiebel Robotic Crust Mark II",
		Category: "Drones: Small",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "2",
		Avail:    "10",
		Body:     "2",
		Cost:     "9500",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "0",
		Page:     "63",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gecko Grips (Drone)",
				}, {
					Name: "Spotlight (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"krupp_minion_medium": {
		Name:     "Krupp Minion (Medium)",
		Category: "Drones: Medium",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "6",
		Avail:    "8",
		Body:     "4",
		Cost:     "5000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "0",
		Page:     "64",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Spotlight (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "4",
	},
	"messerschmitt_kawasaki_heuschrecke_2": {
		Name:     "Messerschmitt-Kawasaki Heuschrecke 2",
		Category: "Drones: Medium",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "6",
		Avail:    "10R",
		Body:     "5",
		Cost:     "12000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "0",
		Page:     "65",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				}, {
					Name: "Smartsoft",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "2",
	},
	"ruhrmetall_murmillo": {
		Name:     "Ruhrmetall Murmillo",
		Category: "Drones: Medium",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "12",
		Avail:    "10R",
		Body:     "5",
		Cost:     "8000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "1",
		Speed:    "1",
		Seats:    "0",
		Page:     "66",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "1",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Flash-Pak",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Standard (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"siemens_fwd_screamer": {
		Name:     "Siemens FWD Screamer",
		Category: "Drones: Medium",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "6",
		Avail:    "10R",
		Body:     "3",
		Cost:     "11000",
		Handling: "4",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "0",
		Page:     "67",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Spotlight (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "0",
	},
	"messerschmitt_kawasaki_jagdhund": {
		Name:     "Messerschmitt-Kawasaki Jagdhund",
		Category: "Drones: Large",
		Source:   "SAG",
		Accel:    "3",
		Armor:    "10",
		Avail:    "12R",
		Body:     "6",
		Cost:     "30000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "0",
		Page:     "68",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Small (Drone)", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Large (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"messerschmitt_kawasaki_jagdschrecke": {
		Name:     "Messerschmitt-Kawasaki Jagdschrecke",
		Category: "Drones: Large",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "8",
		Avail:    "10R",
		Body:     "6",
		Cost:     "32000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "0",
		Page:     "69",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "ECM (Rating 3)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Huge (Drone)", Visibility: "External",
				},
			},
		},
		ModSlots: "0",
	},
	"mitsuhama_fed_11": {
		Name:     "Mitsuhama FED-11",
		Category: "Drones: Large",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "4",
		Avail:    "8",
		Body:     "4",
		Cost:     "32000",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "0",
		Page:     "70",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "SkyGuide (Drone)",
				}, {
					Name: "SunCell",
				}, {
					Name: "Spotlight (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		ModSlots: "3",
	},
	"ruhrmetall_wolfspinne_8v2": {
		Name:     "Ruhrmetall Wolfspinne 8V2",
		Category: "Drones: Large",
		Source:   "SAG",
		Accel:    "1",
		Armor:    "14",
		Avail:    "16F",
		Body:     "8",
		Cost:     "110000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "1",
		Seats:    "0",
		Page:     "71",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "4",
				}, {
					Name: "",
				}, {
					Name: "Smartsoft",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gecko Grips (Drone)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Large (Drone)", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Fixed", Size: "Large (Drone)", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "GE Vindicator Mini-Gun",
				}, {
					Name: "GE Vindicator Mini-Gun",
				},
			},
		},
		ModSlots: "0",
	},
	"mitsuhama_honson": {
		Name:     "Mitsuhama Honson",
		Category: "Drones: Anthro",
		Source:   "SAG",
		Accel:    "2",
		Armor:    "6",
		Avail:    "10R",
		Body:     "5",
		Cost:     "30000",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "2",
		Seats:    "0",
		Page:     "72",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Touch Sensors",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Arm",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Drone Leg",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Fixed", Size: "Mini (Drone)", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Yamaha Pulsar",
				},
			},
		},
		ModSlots: "0",
	},
	"bmw_trollhammer": {
		Name:     "BMW Trollhammer",
		Category: "Bikes",
		Source:   "TCT",
		Accel:    "2",
		Armor:    "8",
		Avail:    "0",
		Body:     "10",
		Cost:     "12500",
		Handling: "4/3",
		Pilot:    "1",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "1",
		Page:     "184",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 1)",
				},
			},
		},
	},
	"ford_titan": {
		Name:     "Ford Titan",
		Category: "Cars",
		Source:   "TCT",
		Accel:    "1",
		Armor:    "8",
		Avail:    "0",
		Body:     "16",
		Cost:     "32500",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "4",
		Seats:    "8",
		Page:     "184",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 8)",
				},
			},
		},
	},
	"avibras_nissan_an_822": {
		Name:     "Avibras-Nissan AN 822",
		Category: "Rotorcraft",
		Source:   "SFME",
		Accel:    "0",
		Armor:    "10",
		Avail:    "10",
		Body:     "14",
		Cost:     "221500",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "6",
		Seats:    "5",
		Page:     "31",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				}, {
					Name: "",
				}, {
					Name: "",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				}, {
					Name: "Manual Controls",
				}, {
					Name: "Avibras-Nissan AN 822 Device Rating Upgrade",
				},
			},
		},
	},
	"lone_star_securesector_mk2": {
		Name:     "Lone Star SecureSector Mk2",
		Category: "Drones: Small",
		Source:   "TSG",
		Accel:    "2",
		Armor:    "4",
		Avail:    "10",
		Body:     "4",
		Cost:     "5000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "29",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Searchlight",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"plex_cab": {
		Name:     "Plex-Cab",
		Category: "Cars",
		Source:   "SHB3",
		Accel:    "2",
		Armor:    "6",
		Avail:    "8R",
		Body:     "9",
		Cost:     "14000",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "2-6",
		Page:     "215",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Removed Manual Controls",
				}, {
					Name: "GridLink",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Enhanced Image Screens",
				},
			},
		},
	},
	"otto": {
		Name:     "oTTo",
		Category: "Cars",
		Source:   "SHB3",
		Accel:    "1",
		Armor:    "13",
		Avail:    "9R",
		Body:     "12",
		Cost:     "26000",
		Handling: "3/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "4",
		Page:     "216",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Removed Manual Controls",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "GridLink",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"vw_urban_clipper": {
		Name:     "VW Urban Clipper",
		Category: "Trucks",
		Source:   "SHB3",
		Accel:    "1",
		Armor:    "6",
		Avail:    "0",
		Body:     "13",
		Cost:     "34000",
		Handling: "3/3",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "1",
		Page:     "217",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				}, {
					Name: "Sensor Enhancement (Rating 4)",
				},
			},
		},
	},
	"link_bus": {
		Name:     "Link-Bus",
		Category: "Trucks",
		Source:   "SHB3",
		Accel:    "1",
		Armor:    "8",
		Avail:    "10R",
		Body:     "20",
		Cost:     "75000",
		Handling: "2/2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "8-10",
		Page:     "218",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Removed Manual Controls",
				}, {
					Name: "GridLink",
				}, {
					Name: "Interior Cameras",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"eurocopter_fc": {
		Name:     "Eurocopter FC",
		Category: "Rotorcraft",
		Source:   "SHB3",
		Accel:    "3",
		Armor:    "16",
		Avail:    "11R",
		Body:     "16",
		Cost:     "360000",
		Handling: "6",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "5",
		Seats:    "8",
		Page:     "219",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "ECM",
				}, {
					Name: "Passenger Protection System (Rating 1)",
				}, {
					Name: "Amenities (Luxury)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"mk_revolution": {
		Name:     "MK R/Evolution",
		Category: "Bikes",
		Source:   "HAMG",
		Accel:    "3/2",
		Armor:    "6",
		Avail:    "0",
		Body:     "5",
		Cost:     "18500",
		Handling: "4/4",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "5/3",
		Seats:    "1",
		Page:     "174",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
	},
	"mct_guppy": {
		Name:     "MCT Guppy",
		Category: "Drones: Micro",
		Source:   "HAMG",
		Accel:    "1",
		Armor:    "0",
		Avail:    "6",
		Body:     "1",
		Cost:     "450",
		Handling: "2",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "1",
		Seats:    "",
		Page:     "173",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"proteus_nachtaal": {
		Name:     "Proteus Nachtaal",
		Category: "Drones: Mini",
		Source:   "HAMG",
		Accel:    "3",
		Armor:    "1",
		Avail:    "10",
		Body:     "1",
		Cost:     "4000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "",
		Page:     "173",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"evo_barrakuda": {
		Name:     "Evo Barrakuda",
		Category: "Drones: Medium",
		Source:   "HAMG",
		Accel:    "3",
		Armor:    "3",
		Avail:    "8",
		Body:     "4",
		Cost:     "12000",
		Handling: "5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "",
		Page:     "173",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"vulkan_delfin_rq_11": {
		Name:     "Vulkan Delfin RQ-11",
		Category: "Submarines",
		Source:   "HAMG",
		Accel:    "1",
		Armor:    "10",
		Avail:    "12",
		Body:     "12",
		Cost:     "85000",
		Handling: "2",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "2",
		Seats:    "7",
		Page:     "175",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "1", MaxRating: "7",
				},
			},
		},
	},
	"mk_harbor_sentry": {
		Name:     "MK Harbor Sentry",
		Category: "Boats",
		Source:   "HAMG",
		Accel:    "4",
		Armor:    "12",
		Avail:    "14R",
		Body:     "15",
		Cost:     "152500",
		Handling: "3",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "6",
		Seats:    "6",
		Page:     "176",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
	},
	"yongkang_water_spirit": {
		Name:     "Yongkang Water Spirit",
		Category: "Boats",
		Source:   "HAMG",
		Accel:    "1",
		Armor:    "3",
		Avail:    "0",
		Body:     "6",
		Cost:     "8500",
		Handling: "5",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "177",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"maersk_shipyards_wavecutter_mpac": {
		Name:     "Maersk Shipyards Wavecutter MPAC",
		Category: "Boats",
		Source:   "SL",
		Accel:    "3",
		Armor:    "25",
		Avail:    "22F",
		Body:     "25",
		Cost:     "360000",
		Handling: "5",
		Pilot:    "4",
		Sensor:   "5",
		Speed:    "5",
		Seats:    "12",
		Page:     "131",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				}, {
					Name: "",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "ECM (Rating 4)",
				}, {
					Name: "Manual Control Override",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "SunCell",
				}, {
					Name: "Signature Masking (Rating 4)",
				}, {
					Name: "Maersk Shipyards Wavecutter MPAC Small Craft Bay",
				},
			},
		},
		BodyModSlots:   "4",
		WeaponModSlots: "4",
	},
	"corporate_mobile_command_center_ares_roadmaster": {
		Name:     "Corporate Mobile Command Center (Ares Roadmaster)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "2",
		Armor:    "27",
		Avail:    "12R",
		Body:     "27",
		Cost:     "78000",
		Handling: "5/5",
		Pilot:    "5",
		Sensor:   "5",
		Speed:    "5",
		Seats:    "12",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "7",
				},
			},
		},
	},
	"law_enforcement_patrol_cruiser_chrysler_nissan_journey": {
		Name:     "Law Enforcement Patrol Cruiser (Chrysler-Nissan Journey)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "5",
		Armor:    "8",
		Avail:    "6R",
		Body:     "14",
		Cost:     "25500",
		Handling: "6/5",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "6",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"corporate_moving_truck_conestoga_trailblazer": {
		Name:     "Corporate Moving Truck (Conestoga Trailblazer)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "2",
		Armor:    "9",
		Avail:    "6R",
		Body:     "21",
		Cost:     "112500",
		Handling: "3/2",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "3",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"corporate_moving_truck_wtrailer_conestoga_trailblazer": {
		Name:     "Corporate Moving Truck w/Trailer (Conestoga Trailblazer)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "2",
		Armor:    "9",
		Avail:    "6R",
		Body:     "30",
		Cost:     "142500",
		Handling: "2/2",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "2",
		Seats:    "3",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
	},
	"corporate_garbage_hauler_dodge_ram_industrial_large": {
		Name:     "Corporate Garbage Hauler (Dodge Ram Industrial: Large)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "2",
		Armor:    "12",
		Avail:    "6R",
		Body:     "24",
		Cost:     "76500",
		Handling: "3/2",
		Pilot:    "3",
		Sensor:   "6",
		Speed:    "2",
		Seats:    "6",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"corporate_garbage_hauler_dodge_ram_industrial_narrow": {
		Name:     "Corporate Garbage Hauler (Dodge Ram Industrial: Narrow)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "2",
		Armor:    "12",
		Avail:    "6R",
		Body:     "24",
		Cost:     "73500",
		Handling: "5/2",
		Pilot:    "3",
		Sensor:   "6",
		Speed:    "2",
		Seats:    "6",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"government_black_suv_esprit_industries_watcher": {
		Name:     "Government Black SUV (Esprit Industries Watcher)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "5",
		Armor:    "12",
		Avail:    "6R",
		Body:     "14",
		Cost:     "60000",
		Handling: "5/5",
		Pilot:    "2",
		Sensor:   "5",
		Speed:    "5",
		Seats:    "8",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"corporate_ambulance_gmc_endurance": {
		Name:     "Corporate Ambulance (GMC Endurance)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "5",
		Armor:    "9",
		Avail:    "4R",
		Body:     "21",
		Cost:     "52500",
		Handling: "5/5",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "6",
		Seats:    "12",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"government_pursuit_suv_gmc_sidewinder": {
		Name:     "Government Pursuit SUV (GMC Sidewinder)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "3",
		Armor:    "9",
		Avail:    "6R",
		Body:     "15",
		Cost:     "49500",
		Handling: "6/5",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "6",
		Seats:    "9",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "7",
				},
			},
		},
	},
	"corporate_patrol_cruiser_honda_artemis": {
		Name:     "Corporate Patrol Cruiser (Honda Artemis)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "5",
		Armor:    "9",
		Avail:    "4R",
		Body:     "14",
		Cost:     "25500",
		Handling: "6/3",
		Pilot:    "2",
		Sensor:   "2",
		Speed:    "5",
		Seats:    "6",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"municipal_ambulance_s_k_lt_21": {
		Name:     "Municipal Ambulance (S-K LT-21)",
		Category: "Corpsec/Police/Military",
		Source:   "SS",
		Accel:    "2",
		Armor:    "11",
		Avail:    "4R",
		Body:     "23",
		Cost:     "46500",
		Handling: "3/2",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "3",
		Seats:    "3",
		Page:     "187",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"ford_broadcast": {
		Name:     "Ford Broadcast",
		Category: "Trucks",
		Source:   "NF",
		Accel:    "1",
		Armor:    "12",
		Avail:    "8R",
		Body:     "16",
		Cost:     "50000",
		Handling: "3/3",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "4",
		Page:     "174",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"sikorsky_bell_condor": {
		Name:     "Sikorsky-Bell Condor",
		Category: "Rotorcraft",
		Source:   "NF",
		Accel:    "2",
		Armor:    "9",
		Avail:    "12R",
		Body:     "12",
		Cost:     "120000",
		Handling: "4",
		Pilot:    "2",
		Sensor:   "6",
		Speed:    "4",
		Seats:    "2",
		Page:     "174",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "7",
				},
			},
		},
	},
	"bmw_ggx_sandleopard": {
		Name:     "BMW GGX Sandleopard",
		Category: "Bikes",
		Source:   "SOTG",
		Accel:    "2",
		Armor:    "9",
		Avail:    "0",
		Body:     "8",
		Cost:     "15000",
		Handling: "3/5",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "2",
		Page:     "15",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "2",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Off-Road Suspension",
				}, {
					Name: "Anti-Theft System (Rating 1)",
				}, {
					Name: "Multifuel Engine",
				},
			},
		},
	},
	"jena_robotik_mewero_minidrone": {
		Name:     "Jena Robotik Mewero (Minidrone)",
		Category: "Drones: Mini",
		Source:   "SOTG",
		Accel:    "1",
		Armor:    "0",
		Avail:    "6",
		Body:     "1",
		Cost:     "2500",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "1",
		Seats:    "",
		Page:     "23",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "3", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"porsche_dornier_aqua_503": {
		Name:     "Porsche-Dornier Aqua 503",
		Category: "Boats",
		Source:   "SOTG",
		Accel:    "3",
		Armor:    "6",
		Avail:    "0",
		Body:     "8",
		Cost:     "40000",
		Handling: "5",
		Pilot:    "2",
		Sensor:   "3",
		Speed:    "5",
		Seats:    "6",
		Page:     "18",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "7",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Squatter)",
				}, {
					Name: "Rigger Interface",
				},
			},
		},
	},
	"ruhrmetall_hovawart": {
		Name:     "Ruhrmetall Hovawart",
		Category: "Drones: Small",
		Source:   "SOTG",
		Accel:    "3",
		Armor:    "2",
		Avail:    "8R",
		Body:     "2",
		Cost:     "14000",
		Handling: "3",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "",
		Page:     "19",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"eurocar_escape_fükomkw": {
		Name:     "Eurocar Escape FüKomKW",
		Category: "Trucks",
		Source:   "SOTG",
		Accel:    "3",
		Armor:    "12",
		Avail:    "10",
		Body:     "16",
		Cost:     "145000",
		Handling: "3/4",
		Pilot:    "2",
		Sensor:   "4",
		Speed:    "3",
		Seats:    "10",
		Page:     "16",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Standard Drone Rack (Small)",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Amenities (Low)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Retrans Unit",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Enhanced Image Screens",
				}, {
					Name: "Increased Seating",
				},
			},
		},
	},
	"eurocar_escape_mzkw_d": {
		Name:     "Eurocar Escape MzKW D",
		Category: "Trucks",
		Source:   "SOTG",
		Accel:    "3",
		Armor:    "14",
		Avail:    "8",
		Body:     "18",
		Cost:     "165000",
		Handling: "3/4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "16",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Standard Drone Rack (Small)",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Amenities (Low)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Extreme Environment Modification",
				}, {
					Name: "Life Support (Rating 1)",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Armor Modification (Fire) (Rating 6)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Krupp Munitions 3E Firefighting Cannon",
				},
			},
		},
	},
	"eurocar_escape_dekw": {
		Name:     "Eurocar Escape DeKW",
		Category: "Trucks",
		Source:   "SOTG",
		Accel:    "2",
		Armor:    "14",
		Avail:    "14",
		Body:     "18",
		Cost:     "225000",
		Handling: "3/4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "6",
		Page:     "16",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Standard Drone Rack (Small)",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Amenities (Low)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Winch (Basic)",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Life Support (Rating 2)",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Armor Modification (Radiation) (Rating 6)",
				}, {
					Name: "Special Armor Modification (Chemical) (Rating 6)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				},
			},
		},
		Weapons: &VehicleWeapons{
			Weapon: []VehicleWeapon{
				{
					Name: "Krupp Munitions 3E Firefighting Cannon",
				},
			},
		},
	},
	"thw_mzkw_c": {
		Name:     "THW MzKW C",
		Category: "Cars",
		Source:   "SOTG",
		Accel:    "2",
		Armor:    "10",
		Avail:    "8",
		Body:     "14",
		Cost:     "125000",
		Handling: "5/5",
		Pilot:    "3",
		Sensor:   "5",
		Speed:    "4",
		Seats:    "5",
		Page:     "16",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "5", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Amenities (Low)",
				}, {
					Name: "Life Support (Rating 1)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Retrans Unit",
				}, {
					Name: "Special Armor Modification (Radiation) (Rating 6)",
				}, {
					Name: "Special Armor Modification (Chemical) (Rating 6)",
				}, {
					Name: "Extra Entry/Exit Points",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Manual", Flexibility: "Flexible", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"zet_commando": {
		Name:     "ZET Commando",
		Category: "Cars",
		Source:   "SOTG",
		Accel:    "3",
		Armor:    "14",
		Avail:    "12R",
		Body:     "16",
		Cost:     "170000",
		Handling: "3/4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "5",
		Page:     "16",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "4", MaxRating: "6",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Anti-Theft System (Rating 2)",
				}, {
					Name: "Off-Road Suspension",
				}, {
					Name: "Amenities (Low)",
				}, {
					Name: "Life Support (Rating 1)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Retrans Unit",
				}, {
					Name: "Special Armor Modification (Radiation) (Rating 6)",
				}, {
					Name: "Special Armor Modification (Chemical) (Rating 6)",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				},
			},
		},
	},
	"krime_runner": {
		Name:     "Krime Runner",
		Category: "Drones: Mini",
		Source:   "KK",
		Accel:    "1",
		Armor:    "1",
		Avail:    "9R",
		Body:     "2",
		Cost:     "1000",
		Handling: "1",
		Pilot:    "4",
		Sensor:   "1",
		Speed:    "1",
		Seats:    "",
		Page:     "28",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Rigger Interface",
				},
			},
		},
	},
	"krime_wageslave_pmv": {
		Name:     "Krime Wageslave PMV",
		Category: "Cars",
		Source:   "KK",
		Accel:    "2",
		Armor:    "5",
		Avail:    "0",
		Body:     "4",
		Cost:     "10000",
		Handling: "2/1",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "1",
		Seats:    "1",
		Page:     "30",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 1)",
				},
			},
		},
	},
	"krime_bazoo_basic": {
		Name:     "Krime Bazoo Basic",
		Category: "Cars",
		Source:   "KK",
		Accel:    "1",
		Armor:    "5",
		Avail:    "0",
		Body:     "9",
		Cost:     "22000",
		Handling: "2/1",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "4",
		Page:     "31",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				},
			},
		},
	},
	"krime_bazoo_redline": {
		Name:     "Krime Bazoo Redline",
		Category: "Cars",
		Source:   "KK",
		Accel:    "2",
		Armor:    "5",
		Avail:    "3",
		Body:     "9",
		Cost:     "25000",
		Handling: "2/1",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "5",
		Seats:    "4",
		Page:     "31",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				},
			},
		},
	},
	"krime_bazoo_chrome": {
		Name:     "Krime Bazoo Chrome",
		Category: "Cars",
		Source:   "KK",
		Accel:    "2",
		Armor:    "5",
		Avail:    "7",
		Body:     "9",
		Cost:     "40000",
		Handling: "2/1",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "5",
		Seats:    "4",
		Page:     "31",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				}, {
					Name: "Yerzed Out (Rating 2)",
				},
			},
		},
	},
	"krime_big_bazoo_basic": {
		Name:     "Krime Big Bazoo Basic",
		Category: "Cars",
		Source:   "KK",
		Accel:    "1",
		Armor:    "6",
		Avail:    "4",
		Body:     "9",
		Cost:     "23000",
		Handling: "1/3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "3",
		Seats:    "4",
		Page:     "31",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				}, {
					Name: "Off-Road Suspension",
				},
			},
		},
	},
	"krime_big_bazoo_redline": {
		Name:     "Krime Big Bazoo Redline",
		Category: "Cars",
		Source:   "KK",
		Accel:    "2",
		Armor:    "6",
		Avail:    "5",
		Body:     "9",
		Cost:     "26000",
		Handling: "1/3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "5",
		Seats:    "4",
		Page:     "31",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				}, {
					Name: "Off-Road Suspension",
				},
			},
		},
	},
	"krime_big_bazoo_chrome": {
		Name:     "Krime Big Bazoo Chrome",
		Category: "Cars",
		Source:   "KK",
		Accel:    "2",
		Armor:    "6",
		Avail:    "10",
		Body:     "9",
		Cost:     "45000",
		Handling: "1/3",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "5",
		Seats:    "4",
		Page:     "31",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				}, {
					Name: "Yerzed Out (Rating 2)",
				},
			},
		},
	},
	"krime_sv_2_crashtest": {
		Name:     "Krime SV-2 'Crashtest'",
		Category: "Cars",
		Source:   "KK",
		Accel:    "2",
		Armor:    "9",
		Avail:    "12",
		Body:     "11",
		Cost:     "120000",
		Handling: "3/1",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "4",
		Seats:    "2",
		Page:     "32",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Life Support (Rating 1)",
				}, {
					Name: "Metahuman Adjustment (Rating 2)",
				}, {
					Name: "Passenger Protection System (Rating 3)",
				}, {
					Name: "Personal Armor (Rating 4)",
				},
			},
		},
	},
	"krime_prowler": {
		Name:     "Krime Prowler",
		Category: "Cars",
		Source:   "KK",
		Accel:    "3",
		Armor:    "12",
		Avail:    "21R",
		Body:     "14",
		Cost:     "145000",
		Handling: "3/3",
		Pilot:    "3",
		Sensor:   "3",
		Speed:    "6",
		Seats:    "4",
		Page:     "34",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Gun Port",
				}, {
					Name: "Gun Port",
				}, {
					Name: "Passenger Protection System (Rating 3)",
				}, {
					Name: "Personal Armor (Rating 6)",
				}, {
					Name: "GridLink",
				}, {
					Name: "Metahuman Adjustment (Rating 4)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Ram Plate",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Road Strip Ejector",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Searchlight",
				}, {
					Name: "Winch (Enhanced)",
				}, {
					Name: "Yerzed Out (Rating 1)",
				},
			},
		},
		PowertrainModSlots: "-14",
		ProtectionModSlots: "-14",
	},
	"krime_detruck_sports_truck": {
		Name:     "Krime DeTruck Sports Truck",
		Category: "Trucks",
		Source:   "KK",
		Accel:    "1",
		Armor:    "7",
		Avail:    "21R",
		Body:     "16",
		Cost:     "100000",
		Handling: "4/4",
		Pilot:    "3",
		Sensor:   "2",
		Speed:    "3",
		Seats:    "3",
		Page:     "35",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Middle)",
				}, {
					Name: "Metahuman Adjustment (Rating 3)",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Yerzed Out (Rating 1)",
				},
			},
		},
	},
	"krime_dix_prime_mover": {
		Name:     "Krime Dix Prime Mover",
		Category: "Trucks",
		Source:   "KK",
		Accel:    "1",
		Armor:    "15",
		Avail:    "20",
		Body:     "21",
		Cost:     "200000",
		Handling: "2/3",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "2",
		Page:     "37",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Metahuman Adjustment (Rating 4)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Special Equipment",
				},
			},
		},
	},
	"krime_barco_de_pesca": {
		Name:     "Krime Barco de Pesca",
		Category: "Boats",
		Source:   "KK",
		Accel:    "2",
		Armor:    "6",
		Avail:    "12",
		Body:     "18",
		Cost:     "50000",
		Handling: "2/4",
		Pilot:    "1",
		Sensor:   "1",
		Speed:    "1/7",
		Seats:    "6",
		Page:     "38",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 6)",
				}, {
					Name: "Multifuel Engine",
				}, {
					Name: "Satellite Link",
				}, {
					Name: "Special Equipment",
				}, {
					Name: "Special Equipment",
				},
			},
		},
	},
	"krime_euskaldunak_tankette": {
		Name:     "Krime Euskaldunak Tankette",
		Category: "Corpsec/Police/Military",
		Source:   "KK",
		Accel:    "2",
		Armor:    "20",
		Avail:    "24F",
		Body:     "7",
		Cost:     "200000",
		Handling: "4",
		Pilot:    "4",
		Sensor:   "4",
		Speed:    "4",
		Seats:    "1",
		Page:     "41",
		Gears: &VehicleGears{
			Gear: []VehicleGear{
				{
					Name: "Sensor Array", Rating: "2", MaxRating: "3",
				},
			},
		},
		Mods: &VehicleMods{
			Name: []VehicleMod{
				{
					Name: "Amenities (Street)",
				}, {
					Name: "Metahuman Adjustment (Rating 1)",
				}, {
					Name: "Rigger Cocoon",
				}, {
					Name: "Rigger Interface",
				}, {
					Name: "Searchlight",
				},
			},
		},
		WeaponMounts: &VehicleWeaponMounts{
			WeaponMount: []VehicleWeaponMount{
				{
					Control: "Remote", Flexibility: "Turret", Size: "Heavy", Visibility: "External",
				}, {
					Control: "Remote", Flexibility: "Turret", Size: "Standard", Visibility: "External",
				},
			},
		},
		BodyModSlots:            "-7",
		CosmeticModSlots:        "-3",
		ElectromagneticModSlots: "-7",
		PowertrainModSlots:      "-7",
		ProtectionModSlots:      "-7",
		WeaponModSlots:          "-7",
	},
}

// DataVehicleModifications contains vehicle modification records keyed by their ID (lowercase with underscores)
var DataVehicleModifications = map[string]VehicleModification{
	"tracked_propulsion": {
		Name:     "Tracked Propulsion",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "?",
		Rating:   "0",
		Required: "",
	},
	"signature_dampening": {
		Name:     "Signature Dampening",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "?",
		Rating:   "0",
		Required: "",
	},
	"flashtech": {
		Name:     "FlashTech",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "?",
		Rating:   "0",
		Required: "",
	},
	"enviroseal": {
		Name:     "Enviroseal",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "?",
		Rating:   "0",
		Required: "",
	},
	"drone_rail": {
		Name:     "Drone Rail",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "?",
		Rating:   "0",
		Required: "",
	},
	"gyro_stabilization": {
		Name:     "Gyro-Stabilization",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "?",
		Rating:   "0",
		Required: "",
	},
	"smart_tires": {
		Name:     "Smart Tires",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "?",
		Rating:   "qty",
		Required: "",
	},
	"dustoff_armored_valkyrie_module": {
		Name:     "Dustoff Armored Valkyrie Module",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "BB",
		Page:     "23",
		Rating:   "0",
		Required: "",
	},
	"reloading_drone_forbidden_weapon_reloading_autosoft": {
		Name:     "Reloading Drone Forbidden Weapon Reloading Autosoft",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0F",
		Cost:     "250",
		Source:   "HT",
		Page:     "189",
		Rating:   "0",
		Required: "",
	},
	"avibras_nissan_an_822_device_rating_upgrade": {
		Name:     "Avibras-Nissan AN 822 Device Rating Upgrade",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "SFME",
		Page:     "31",
		Rating:   "0",
		Required: "",
	},
	"ruhrmetall_wolf_ii_troop_transport_module": {
		Name:     "Ruhrmetall Wolf II Troop Transport Module",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "77",
		Rating:   "0",
		Required: "",
	},
	"maersk_shipyards_wavecutter_mpac_small_craft_bay": {
		Name:     "Maersk Shipyards Wavecutter MPAC Small Craft Bay",
		Category: "Model-Specific",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "SL",
		Page:     "132",
		Rating:   "0",
		Required: "",
	},
	"speakers": {
		Name:     "Speakers",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "128",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"strobes": {
		Name:     "Strobes",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "128",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"acceleration_enhancement": {
		Name:     "Acceleration Enhancement",
		Category: "Powertrain",
		Slots:    "FixedValues(4,8)",
		Avail:    "6",
		Cost:     "FixedValues(number(Acceleration = 0) * 5000 + Acceleration * 10000,number(Acceleration = 0) * 12500 + Acceleration * 25000)",
		Source:   "R5",
		Page:     "154",
		Rating:   "2",
	},
	"gecko_tips": {
		Name:     "Gecko Tips",
		Category: "Powertrain",
		Slots:    "1 + 3*number(Body >= 4)",
		Avail:    "6",
		Cost:     "1000 + 4000*number(Body >= 4)",
		Source:   "R5",
		Page:     "154",
		Rating:   "0",
		Required: "",
	},
	"gliding_system": {
		Name:     "Gliding System",
		Category: "Powertrain",
		Slots:    "5 + 5*number(Body > 12)",
		Avail:    "(12 + 4*number(Body > 12))R",
		Cost:     "number(Body = 0) * 1500 + Body * 3000 + (Body * 1000)*number(Body > 12)",
		Source:   "R5",
		Page:     "154",
		Rating:   "0",
	},
	"handling_enhancement": {
		Name:     "Handling Enhancement",
		Category: "Powertrain",
		Slots:    "FixedValues(4,10,18)",
		Avail:    "FixedValues(6,8,10)",
		Cost:     "FixedValues(number(Handling = 0) * 1000 + Handling*2000,number(Handling = 0) * 2500 + Handling*5000,number(Handling = 0) * 6000 + Handling*12000)",
		Source:   "R5",
		Page:     "154",
		Rating:   "3",
	},
	"improved_economy": {
		Name:     "Improved Economy",
		Category: "Powertrain",
		Slots:    "2",
		Avail:    "4",
		Cost:     "7500",
		Source:   "R5",
		Page:     "154",
		Rating:   "0",
	},
	"manual_control_override": {
		Name:     "Manual Control Override",
		Category: "Powertrain",
		Slots:    "1",
		Avail:    "6",
		Cost:     "500",
		Source:   "R5",
		Page:     "154",
		Rating:   "0",
	},
	"multifuel_engine": {
		Name:     "Multifuel Engine",
		Category: "Powertrain",
		Slots:    "4",
		Avail:    "10",
		Cost:     "number(Body = 0) * 500 + Body * 1000",
		Source:   "R5",
		Page:     "155",
		Rating:   "0",
	},
	"off_road_suspension": {
		Name:     "Off-Road Suspension",
		Category: "Powertrain",
		Slots:    "2",
		Avail:    "4",
		Cost:     "Vehicle Cost * 0.25",
		Source:   "R5",
		Page:     "155",
		Rating:   "0",
	},
	"rigger_cocoon": {
		Name:     "Rigger Cocoon",
		Category: "Powertrain",
		Slots:    "2",
		Avail:    "8",
		Cost:     "1500",
		Source:   "R5",
		Page:     "155",
		Rating:   "0",
	},
	"removed_manual_controls": {
		Name:     "Removed Manual Controls",
		Category: "Powertrain",
		Slots:    "1",
		Avail:    "2",
		Cost:     "200",
		Source:   "R5",
		Page:     "155",
		Rating:   "0",
	},
	"rocket_booster": {
		Name:     "Rocket Booster",
		Category: "Powertrain",
		Slots:    "10",
		Avail:    "16F",
		Cost:     "number(Body = 0) * 2500 + Body * 5000",
		Source:   "R5",
		Page:     "156",
		Rating:   "0",
	},
	"secondary_manual_controls": {
		Name:     "Secondary Manual Controls",
		Category: "Powertrain",
		Slots:    "2",
		Avail:    "4",
		Cost:     "1000",
		Source:   "R5",
		Page:     "156",
		Rating:   "0",
	},
	"secondary_propulsion_amphibious_surface": {
		Name:     "Secondary Propulsion (Amphibious, Surface)",
		Category: "Powertrain",
		Slots:    "4",
		Avail:    "6",
		Cost:     "number(Body = 0) * 100 + Body * 200",
		Source:   "R5",
		Page:     "156",
		Rating:   "0",
	},
	"secondary_propulsion_amphibious_submersible": {
		Name:     "Secondary Propulsion (Amphibious, Submersible)",
		Category: "Powertrain",
		Slots:    "8",
		Avail:    "12R",
		Cost:     "number(Body = 0) * 1000 + Body * 2000",
		Source:   "R5",
		Page:     "156",
		Rating:   "0",
	},
	"secondary_propulsion_hovercraft": {
		Name:     "Secondary Propulsion (Hovercraft)",
		Category: "Powertrain",
		Slots:    "8",
		Avail:    "12",
		Cost:     "number(Body = 0) * 500 + Body * 1000",
		Source:   "R5",
		Page:     "156",
		Rating:   "0",
	},
	"secondary_propulsion_rotor": {
		Name:     "Secondary Propulsion (Rotor)",
		Category: "Powertrain",
		Slots:    "10",
		Avail:    "12R",
		Cost:     "number(Body = 0) * 1500 + Body * 3000",
		Source:   "R5",
		Page:     "157",
		Rating:   "0",
	},
	"secondary_propulsion_tracked": {
		Name:     "Secondary Propulsion (Tracked)",
		Category: "Powertrain",
		Slots:    "6",
		Avail:    "10",
		Cost:     "number(Body = 0) * 500 + Body * 1000",
		Source:   "R5",
		Page:     "157",
		Rating:   "0",
	},
	"secondary_propulsion_walker": {
		Name:     "Secondary Propulsion (Walker)",
		Category: "Powertrain",
		Slots:    "8",
		Avail:    "12",
		Cost:     "number(Body = 0) * 1000 + Body * 2000",
		Source:   "R5",
		Page:     "157",
		Rating:   "0",
	},
	"speed_enhancement": {
		Name:     "Speed Enhancement",
		Category: "Powertrain",
		Slots:    "FixedValues(5,14,20)",
		Avail:    "FixedValues(6,8,12)",
		Cost:     "FixedValues(number(Speed = 0) * 1000 + Speed * 2000,number(Speed = 0) * 2500 + Speed * 5000,number(Speed = 0) * 6000 + Speed * 12000)",
		Source:   "R5",
		Page:     "157",
		Rating:   "3",
	},
	"anti_theft_system": {
		Name:     "Anti-Theft System",
		Category: "Protection",
		Slots:    "FixedValues(1,2,4,6)",
		Avail:    "FixedValues(4,6,8R,12F)",
		Cost:     "FixedValues(500,1000,2500,5000)",
		Source:   "R5",
		Page:     "159",
		Rating:   "4",
	},
	"armor_standard": {
		Name:     "Armor (Standard)",
		Category: "Protection",
		Slots:    "Rating * 2",
		Avail:    "6R",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "159",
		Rating:   "body",
	},
	"armor_concealed": {
		Name:     "Armor (Concealed)",
		Category: "Protection",
		Slots:    "Rating * 3",
		Avail:    "12R",
		Cost:     "Rating * 3000",
		Source:   "R5",
		Page:     "159",
		Rating:   "body",
	},
	"passenger_protection_system": {
		Name:     "Passenger Protection System",
		Category: "Protection",
		Slots:    "2",
		Avail:    "6",
		Cost:     "Rating * 2000",
		Source:   "R5",
		Page:     "159",
		Rating:   "6",
	},
	"personal_armor": {
		Name:     "Personal Armor",
		Category: "Protection",
		Slots:    "2",
		Avail:    "(Rating)R",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "159",
		Rating:   "10",
	},
	"special_armor_modification_chemical": {
		Name:     "Special Armor Modification (Chemical)",
		Category: "Protection",
		Slots:    "2",
		Avail:    "6",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "159",
		Rating:   "50",
	},
	"special_armor_modification_fire": {
		Name:     "Special Armor Modification (Fire)",
		Category: "Protection",
		Slots:    "2",
		Avail:    "6",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "159",
		Rating:   "50",
	},
	"special_armor_modification_insulation": {
		Name:     "Special Armor Modification (Insulation)",
		Category: "Protection",
		Slots:    "2",
		Avail:    "6",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "159",
		Rating:   "50",
	},
	"special_armor_modification_nonconductivity": {
		Name:     "Special Armor Modification (Nonconductivity)",
		Category: "Protection",
		Slots:    "2",
		Avail:    "6",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "159",
		Rating:   "50",
	},
	"special_armor_modification_radiation": {
		Name:     "Special Armor Modification (Radiation)",
		Category: "Protection",
		Slots:    "2",
		Avail:    "(Rating * 2)",
		Cost:     "Rating * 400",
		Source:   "R5",
		Page:     "159",
		Rating:   "50",
	},
	"special_armor_modification_universal_mirror_material": {
		Name:     "Special Armor Modification (Universal Mirror Material)",
		Category: "Protection",
		Slots:    "2",
		Avail:    "4",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "159",
		Rating:   "50",
	},
	"standard_drone_rack_micro": {
		Name:     "Standard Drone Rack (Micro)",
		Category: "Weapons",
		Slots:    "1",
		Avail:    "4",
		Cost:     "350",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"standard_drone_rack_mini": {
		Name:     "Standard Drone Rack (Mini)",
		Category: "Weapons",
		Slots:    "1",
		Avail:    "4",
		Cost:     "500",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"standard_drone_rack_small": {
		Name:     "Standard Drone Rack (Small)",
		Category: "Weapons",
		Slots:    "2",
		Avail:    "4",
		Cost:     "1000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"standard_drone_rack_medium": {
		Name:     "Standard Drone Rack (Medium)",
		Category: "Weapons",
		Slots:    "3",
		Avail:    "6",
		Cost:     "2000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"standard_drone_rack_large": {
		Name:     "Standard Drone Rack (Large)",
		Category: "Weapons",
		Slots:    "4",
		Avail:    "8",
		Cost:     "4000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"landing_drone_rack_micro": {
		Name:     "Landing Drone Rack (Micro)",
		Category: "Weapons",
		Slots:    "2",
		Avail:    "6",
		Cost:     "750",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"landing_drone_rack_mini": {
		Name:     "Landing Drone Rack (Mini)",
		Category: "Weapons",
		Slots:    "2",
		Avail:    "6",
		Cost:     "1000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"landing_drone_rack_small": {
		Name:     "Landing Drone Rack (Small)",
		Category: "Weapons",
		Slots:    "3",
		Avail:    "6",
		Cost:     "4000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"landing_drone_rack_medium": {
		Name:     "Landing Drone Rack (Medium)",
		Category: "Weapons",
		Slots:    "4",
		Avail:    "8",
		Cost:     "10000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"landing_drone_rack_large": {
		Name:     "Landing Drone Rack (Large)",
		Category: "Weapons",
		Slots:    "5",
		Avail:    "12",
		Cost:     "20000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"gun_port": {
		Name:     "Gun Port",
		Category: "Weapons",
		Slots:    "1",
		Avail:    "6R",
		Cost:     "500",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"missile_defense_system": {
		Name:     "Missile Defense System",
		Category: "Weapons",
		Slots:    "3",
		Avail:    "12R",
		Cost:     "15000",
		Source:   "R5",
		Page:     "160",
		Rating:   "0",
	},
	"oil_slick_sprayer": {
		Name:     "Oil Slick Sprayer",
		Category: "Weapons",
		Slots:    "2",
		Avail:    "8F",
		Cost:     "500",
		Source:   "R5",
		Page:     "161",
		Rating:   "0",
	},
	"ram_plate": {
		Name:     "Ram Plate",
		Category: "Weapons",
		Slots:    "1",
		Avail:    "6R",
		Cost:     "number(Body = 0) * 125 + Body * 250",
		Source:   "R5",
		Page:     "161",
		Rating:   "0",
	},
	"smoke_projector": {
		Name:     "Smoke Projector",
		Category: "Weapons",
		Slots:    "2",
		Avail:    "6R",
		Cost:     "750",
		Source:   "R5",
		Page:     "161",
		Rating:   "0",
	},
	"smoke_projector_thermal": {
		Name:     "Smoke Projector (Thermal)",
		Category: "Weapons",
		Slots:    "2",
		Avail:    "6R",
		Cost:     "850",
		Source:   "R5",
		Page:     "161",
		Rating:   "0",
	},
	"road_strip_ejector": {
		Name:     "Road Strip Ejector",
		Category: "Weapons",
		Slots:    "2",
		Avail:    "10F",
		Cost:     "800",
		Source:   "R5",
		Page:     "161",
		Rating:   "0",
	},
	"assemblydisassembly": {
		Name:     "Assembly/Disassembly",
		Category: "Body",
		Slots:    "2",
		Avail:    "6",
		Cost:     "1000",
		Source:   "R5",
		Page:     "163",
		Rating:   "0",
	},
	"chameleon_coating": {
		Name:     "Chameleon Coating",
		Category: "Body",
		Slots:    "2",
		Avail:    "12F",
		Cost:     "number(Body = 0) * 500 + Body * 1000",
		Source:   "R5",
		Page:     "163",
		Rating:   "0",
	},
	"extra_entryexit_points": {
		Name:     "Extra Entry/Exit Points",
		Category: "Body",
		Slots:    "1",
		Avail:    "8",
		Cost:     "2500",
		Source:   "R5",
		Page:     "164",
		Rating:   "0",
	},
	"extreme_environment_modification": {
		Name:     "Extreme Environment Modification",
		Category: "Body",
		Slots:    "2",
		Avail:    "6",
		Cost:     "2000",
		Source:   "R5",
		Page:     "164",
		Rating:   "0",
	},
	"increased_seating": {
		Name:     "Increased Seating",
		Category: "Body",
		Slots:    "2",
		Avail:    "4",
		Cost:     "2000",
		Source:   "R5",
		Page:     "164",
		Rating:   "0",
	},
	"life_support": {
		Name:     "Life Support",
		Category: "Body",
		Slots:    "2",
		Avail:    "8",
		Cost:     "FixedValues(number(Body = 0) * 250 + Body * 500,number(Body = 0) * 1000 + Body * 2000)",
		Source:   "R5",
		Page:     "164",
		Rating:   "2",
	},
	"mechanical_arm_basic": {
		Name:     "Mechanical Arm (Basic)",
		Category: "Body",
		Slots:    "2",
		Avail:    "4",
		Cost:     "1000",
		Source:   "R5",
		Page:     "165",
		Rating:   "0",
	},
	"mechanical_arm_articulated": {
		Name:     "Mechanical Arm (Articulated)",
		Category: "Body",
		Slots:    "3",
		Avail:    "6",
		Cost:     "5000",
		Source:   "R5",
		Page:     "165",
		Rating:   "0",
	},
	"nanomaintenance_system": {
		Name:     "Nanomaintenance System",
		Category: "Body",
		Slots:    "Rating",
		Avail:    "(Rating * 5)R",
		Cost:     "Rating * 5000",
		Source:   "R5",
		Page:     "165",
		Rating:   "4",
	},
	"realistic_features": {
		Name:     "Realistic Features",
		Category: "Body",
		Slots:    "Rating",
		Avail:    "(Rating * 3)R",
		Cost:     "Rating * (number(Body = 0) * 500 + Body * 1000)",
		Source:   "R5",
		Page:     "165",
		Rating:   "4",
	},
	"smuggling_compartment": {
		Name:     "Smuggling Compartment",
		Category: "Body",
		Slots:    "3",
		Avail:    "8F",
		Cost:     "1500",
		Source:   "R5",
		Page:     "165",
		Rating:   "0",
	},
	"special_equipment": {
		Name:     "Special Equipment",
		Category: "Body",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "165",
		Rating:   "0",
	},
	"smuggling_compartment_shielding": {
		Name:     "Smuggling Compartment Shielding",
		Category: "Body",
		Slots:    "0",
		Avail:    "12F",
		Cost:     "3000",
		Source:   "R5",
		Page:     "165",
		Rating:   "0",
	},
	"valkyrie_module": {
		Name:     "Valkyrie Module",
		Category: "Body",
		Slots:    "4",
		Avail:    "8",
		Cost:     "2000",
		Source:   "R5",
		Page:     "166",
		Rating:   "0",
	},
	"winch_basic": {
		Name:     "Winch (Basic)",
		Category: "Body",
		Slots:    "1",
		Avail:    "4",
		Cost:     "750",
		Source:   "R5",
		Page:     "166",
		Rating:   "0",
	},
	"winch_enhanced": {
		Name:     "Winch (Enhanced)",
		Category: "Body",
		Slots:    "2",
		Avail:    "8",
		Cost:     "4000",
		Source:   "R5",
		Page:     "166",
		Rating:   "0",
	},
	"workshop": {
		Name:     "Workshop",
		Category: "Body",
		Slots:    "6",
		Avail:    "8",
		Cost:     "5000",
		Source:   "R5",
		Page:     "166",
		Rating:   "0",
	},
	"electromagnetic_shielding": {
		Name:     "Electromagnetic Shielding",
		Category: "Electromagnetic",
		Slots:    "2",
		Avail:    "6R",
		Cost:     "number(Body = 0) * 250 + Body * 500",
		Source:   "R5",
		Page:     "166",
		Rating:   "0",
	},
	"ecm": {
		Name:     "ECM",
		Category: "Electromagnetic",
		Slots:    "2",
		Avail:    "(Rating * 3)F",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "166",
		Rating:   "6",
	},
	"gridlink": {
		Name:     "GridLink",
		Category: "Electromagnetic",
		Slots:    "2",
		Avail:    "4",
		Cost:     "750",
		Source:   "R5",
		Page:     "166",
		Rating:   "0",
	},
	"gridlink_override": {
		Name:     "GridLink Override",
		Category: "Electromagnetic",
		Slots:    "1",
		Avail:    "8F",
		Cost:     "1000",
		Source:   "R5",
		Page:     "167",
		Rating:   "0",
	},
	"retrans_unit": {
		Name:     "Retrans Unit",
		Category: "Electromagnetic",
		Slots:    "2",
		Avail:    "8",
		Cost:     "4000",
		Source:   "R5",
		Page:     "168",
		Rating:   "0",
	},
	"satellite_link": {
		Name:     "Satellite Link",
		Category: "Electromagnetic",
		Slots:    "1",
		Avail:    "6",
		Cost:     "500",
		Source:   "R5",
		Page:     "168",
		Rating:   "0",
	},
	"pilot_enhancement": {
		Name:     "Pilot Enhancement",
		Category: "Electromagnetic",
		Slots:    "Rating",
		Avail:    "FixedValues(Rating * 2,Rating * 2,Rating * 2,Rating * 3,Rating * 3,Rating * 3)",
		Cost:     "FixedValues(Rating * 2000,Rating * 2000,Rating * 2000,Rating * 5000,Rating * 5000,Rating * 5000)",
		Source:   "R5",
		Page:     "167",
		Rating:   "6",
	},
	"sensor_enhancement": {
		Name:     "Sensor Enhancement",
		Category: "Electromagnetic",
		Slots:    "Rating",
		Avail:    "FixedValues(Rating * 2,Rating * 2,Rating * 2,Rating * 3,Rating * 3,Rating * 3)",
		Cost:     "FixedValues(Rating * 2000,Rating * 2000,Rating * 2000,Rating * 5000,Rating * 5000,Rating * 5000)",
		Source:   "R5",
		Page:     "167",
		Rating:   "6",
	},
	"signature_masking": {
		Name:     "Signature Masking",
		Category: "Electromagnetic",
		Slots:    "Rating",
		Avail:    "14F",
		Cost:     "Rating * 2000",
		Source:   "R5",
		Page:     "168",
		Rating:   "6",
	},
	"suncell": {
		Name:     "SunCell",
		Category: "Electromagnetic",
		Slots:    "2",
		Avail:    "6",
		Cost:     "number(Body = 0) * 250 + Body * 500",
		Source:   "R5",
		Page:     "168",
		Rating:   "0",
	},
	"touch_sensors": {
		Name:     "Touch Sensors",
		Category: "Electromagnetic",
		Slots:    "3",
		Avail:    "8",
		Cost:     "number(Body = 0) * 250 + Body * 500",
		Source:   "R5",
		Page:     "169",
		Rating:   "0",
	},
	"amenities_squatter": {
		Name:     "Amenities (Squatter)",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "0",
		Cost:     "100",
		Source:   "R5",
		Page:     "169",
		Rating:   "0",
	},
	"amenities_low": {
		Name:     "Amenities (Low)",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "169",
		Rating:   "0",
	},
	"amenities_middle": {
		Name:     "Amenities (Middle)",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "2",
		Cost:     "500",
		Source:   "R5",
		Page:     "169",
		Rating:   "0",
	},
	"amenities_high": {
		Name:     "Amenities (High)",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "8",
		Cost:     "1000",
		Source:   "R5",
		Page:     "169",
		Rating:   "0",
	},
	"amenities_luxury": {
		Name:     "Amenities (Luxury)",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "16",
		Cost:     "10000",
		Source:   "R5",
		Page:     "169",
		Rating:   "0",
	},
	"enhanced_image_screens": {
		Name:     "Enhanced Image Screens",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "8",
		Cost:     "5000",
		Source:   "R5",
		Page:     "170",
		Rating:   "0",
	},
	"máquina_conversion": {
		Name:     "Máquina Conversion",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Body * 500",
		Source:   "HT",
		Page:     "139",
		Rating:   "0",
	},
	"metahuman_adjustment": {
		Name:     "Metahuman Adjustment",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "4",
		Cost:     "Rating * 500",
		Source:   "R5",
		Page:     "170",
		Rating:   "Seats",
		Required: "",
	},
	"manual_operation": {
		Name:     "Manual Operation",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "+1",
		Cost:     "500",
		Source:   "SR5",
		Page:     "461",
		Rating:   "0",
	},
	"rigger_interface": {
		Name:     "Rigger Interface",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "4",
		Cost:     "1000",
		Source:   "SR5",
		Page:     "461",
		Rating:   "0",
	},
	"interior_cameras": {
		Name:     "Interior Cameras",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "6",
		Cost:     "2000",
		Source:   "R5",
		Page:     "171",
		Rating:   "0",
	},
	"searchlight": {
		Name:     "Searchlight",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "4",
		Cost:     "800",
		Source:   "R5",
		Page:     "171",
		Rating:   "0",
	},
	"vehicle_tag_eraser": {
		Name:     "Vehicle Tag Eraser",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "6R",
		Cost:     "750",
		Source:   "R5",
		Page:     "171",
		Rating:   "0",
	},
	"yerz_kit": {
		Name:     "Yerz Kit",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "0",
		Cost:     "500",
		Source:   "TCT",
		Page:     "187",
		Rating:   "0",
	},
	"yerzed_out": {
		Name:     "Yerzed Out",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "Rating * 2",
		Cost:     "Rating * 1000",
		Source:   "R5",
		Page:     "171",
		Rating:   "4",
	},
	"micro_weapon_mount_drone": {
		Name:     "Micro Weapon Mount (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "8R",
		Cost:     "400",
		Source:   "R5",
		Page:     "124",
		Rating:   "0",
		Required: "",
		Hide:     &[]bool{true}[0],
	},
	"mini_weapon_mount_drone": {
		Name:     "Mini Weapon Mount (Drone)",
		Category: "All",
		Slots:    "1",
		Avail:    "4R",
		Cost:     "800",
		Source:   "R5",
		Page:     "124",
		Rating:   "0",
		Required: "",
		Hide:     &[]bool{true}[0],
	},
	"gecko_grips_drone": {
		Name:     "Gecko Grips (Drone)",
		Category: "All",
		Slots:    "1",
		Avail:    "4R",
		Cost:     "number(Body = 0) * 75 + Body * 150",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"small_weapon_mount_drone": {
		Name:     "Small Weapon Mount (Drone)",
		Category: "All",
		Slots:    "2",
		Avail:    "8R",
		Cost:     "1600",
		Source:   "R5",
		Page:     "124",
		Rating:   "0",
		Required: "",
		Hide:     &[]bool{true}[0],
	},
	"standard_weapon_mount_drone": {
		Name:     "Standard Weapon Mount (Drone)",
		Category: "All",
		Slots:    "3",
		Avail:    "10F",
		Cost:     "2400",
		Source:   "R5",
		Page:     "124",
		Rating:   "0",
		Required: "",
		Hide:     &[]bool{true}[0],
	},
	"large_weapon_mount_drone": {
		Name:     "Large Weapon Mount (Drone)",
		Category: "All",
		Slots:    "4",
		Avail:    "12F",
		Cost:     "3200",
		Source:   "R5",
		Page:     "124",
		Rating:   "0",
		Required: "",
		Hide:     &[]bool{true}[0],
	},
	"huge_weapon_mount_drone": {
		Name:     "Huge Weapon Mount (Drone)",
		Category: "All",
		Slots:    "5",
		Avail:    "16F",
		Cost:     "4000",
		Source:   "R5",
		Page:     "124",
		Rating:   "0",
		Required: "",
		Hide:     &[]bool{true}[0],
	},
	"heavy_weapon_mount_drone": {
		Name:     "Heavy Weapon Mount (Drone)",
		Category: "All",
		Slots:    "6",
		Avail:    "20F",
		Cost:     "4800",
		Source:   "R5",
		Page:     "124",
		Rating:   "0",
		Required: "",
		Hide:     &[]bool{true}[0],
	},
	"realistic_features_drone": {
		Name:     "Realistic Features (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "FixedValues(2,4,8,12R)",
		Cost:     "FixedValues(number(Body = 0) * 25 + Body * Body * 100,number(Body = 0) * 125 + Body * Body * 500,number(Body = 0) * 250 + Body * Body * 1000,number(Body = 0) * 1250 + Body * Body * 5000)",
		Source:   "R5",
		Page:     "125",
		Rating:   "4",
		Required: "",
	},
	"amphibious_drone": {
		Name:     "Amphibious (Drone)",
		Category: "All",
		Slots:    "1",
		Avail:    "0",
		Cost:     "number(Body = 0) * 25 + Body * Body * 100",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"submersible_drone": {
		Name:     "Submersible (Drone)",
		Category: "All",
		Slots:    "2",
		Avail:    "0",
		Cost:     "number(Body = 0) * 250 + Body * Body * 1000",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"assembly_time_improvement_drone": {
		Name:     "Assembly Time Improvement (Drone)",
		Category: "All",
		Slots:    "1",
		Avail:    "0",
		Cost:     "number(Body = 0) * 50 + Body * 100",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"customized_drone": {
		Name:     "Customized (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Variable(10-10000)",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"drone_arm": {
		Name:     "Drone Arm",
		Category: "All",
		Slots:    "1",
		Avail:    "0",
		Cost:     "7500",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"synthetic_drone_arm": {
		Name:     "Synthetic Drone Arm",
		Category: "All",
		Slots:    "1",
		Avail:    "0",
		Cost:     "10000",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"primitive_drone_arm": {
		Name:     "Primitive Drone Arm",
		Category: "All",
		Slots:    "1",
		Avail:    "0",
		Cost:     "1500",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"drone_leg": {
		Name:     "Drone Leg",
		Category: "All",
		Slots:    "1",
		Avail:    "0",
		Cost:     "7500",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"synthetic_drone_leg": {
		Name:     "Synthetic Drone Leg",
		Category: "All",
		Slots:    "1",
		Avail:    "0",
		Cost:     "10000",
		Source:   "R5",
		Page:     "125",
		Rating:   "0",
		Required: "",
	},
	"immobile_drone": {
		Name:     "Immobile (Drone)",
		Category: "All",
		Slots:    "-2",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "126",
		Rating:   "0",
		Required: "",
	},
	"skyguide_drone": {
		Name:     "SkyGuide (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "5",
		Source:   "R5",
		Page:     "126",
		Rating:   "0",
		Required: "",
	},
	"spotlight_drone": {
		Name:     "Spotlight (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "50",
		Source:   "R5",
		Page:     "126",
		Rating:   "0",
		Required: "",
	},
	"suspension_drone": {
		Name:     "Suspension (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "number(Body = 0) * 150 + Body * 300",
		Source:   "R5",
		Page:     "126",
		Rating:   "0",
		Required: "",
	},
	"tire_mod_drone": {
		Name:     "Tire Mod (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "number(Body = 0) * 37.5 + Body * 75",
		Source:   "R5",
		Page:     "126",
		Rating:   "0",
		Required: "",
	},
	"pilot_program_drone": {
		Name:     "Pilot Program (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "FixedValues(4,0,8R,12R,16F,24F)",
		Cost:     "FixedValues(100,400,1800,3200,10000,20000)",
		Source:   "R5",
		Page:     "126",
		Rating:   "6",
		Required: "",
	},
	"spoof_chips": {
		Name:     "Spoof Chips",
		Category: "All",
		Slots:    "0",
		Avail:    "8F",
		Cost:     "500",
		Source:   "SS",
		Page:     "177",
		Rating:   "0",
	},
	"spoof_chips_1": {
		Name:     "Spoof Chips",
		Category: "All",
		Slots:    "0",
		Avail:    "8F",
		Cost:     "500",
		Source:   "R5",
		Page:     "152",
		Rating:   "0",
	},
	"fragile_drone": {
		Name:     "Fragile (Drone)",
		Category: "All",
		Slots:    "-Rating * 2",
		Avail:    "Rating * 3",
		Cost:     "0",
		Source:   "R5",
		Page:     "123",
		Rating:   "99",
		Required: "",
	},
	"single_sensor_drone": {
		Name:     "Single Sensor (Drone)",
		Category: "All",
		Slots:    "0",
		Avail:    "Rating * 2",
		Cost:     "Rating * 100",
		Source:   "R5",
		Page:     "123",
		Rating:   "99",
		Required: "",
	},
	"paraplegic_modification": {
		Name:     "Paraplegic Modification",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Vehicle Cost * 0.05",
		Source:   "RF",
		Page:     "157",
		Rating:   "0",
	},
	"daihatsu_caterpillar_horseman_passenger_pod": {
		Name:     "Daihatsu-Caterpillar Horseman Passenger Pod",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "6000",
		Source:   "R5",
		Page:     "42",
		Rating:   "0",
		Required: "",
	},
	"daihatsu_caterpillar_horseman_cargo_pod": {
		Name:     "Daihatsu-Caterpillar Horseman Cargo Pod",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "6000",
		Source:   "R5",
		Page:     "42",
		Rating:   "0",
		Required: "",
	},
	"daihatsu_caterpillar_horseman_advanced_cargo_pod": {
		Name:     "Daihatsu-Caterpillar Horseman Advanced Cargo Pod",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "5000",
		Source:   "R5",
		Page:     "42",
		Rating:   "0",
		Required: "",
	},
	"daihatsu_caterpillar_horseman_drone_pod": {
		Name:     "Daihatsu-Caterpillar Horseman Drone Pod",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "4000",
		Source:   "R5",
		Page:     "42",
		Rating:   "0",
		Required: "",
	},
	"daihatsu_caterpillar_horseman_security_pod": {
		Name:     "Daihatsu-Caterpillar Horseman Security Pod",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "5500",
		Source:   "R5",
		Page:     "42",
		Rating:   "0",
		Required: "",
	},
	"chameleon_coating_1": {
		Name:     "Chameleon Coating",
		Category: "All",
		Slots:    "0",
		Avail:    "12R",
		Cost:     "number(Body = 0) * 1000 + Body * 2000",
		Source:   "SS",
		Page:     "174",
		Rating:   "0",
	},
	"dash_light_bar": {
		Name:     "Dash Light Bar",
		Category: "All",
		Slots:    "0",
		Avail:    "15F",
		Cost:     "3500",
		Source:   "SS",
		Page:     "176",
		Rating:   "0",
	},
	"emergency_light_bar": {
		Name:     "Emergency Light Bar",
		Category: "All",
		Slots:    "0",
		Avail:    "15F",
		Cost:     "5000",
		Source:   "SS",
		Page:     "176",
		Rating:   "0",
	},
	"morphing_license_plate": {
		Name:     "Morphing License Plate",
		Category: "All",
		Slots:    "0",
		Avail:    "8F",
		Cost:     "1000",
		Source:   "SS",
		Page:     "186",
		Rating:   "0",
	},
	"morphing_license_plate_1": {
		Name:     "Morphing License Plate",
		Category: "All",
		Slots:    "0",
		Avail:    "8F",
		Cost:     "1000",
		Source:   "R5",
		Page:     "152",
		Rating:   "0",
	},
	"spike_strip": {
		Name:     "Spike Strip",
		Category: "All",
		Slots:    "0",
		Avail:    "8R",
		Cost:     "200",
		Source:   "R5",
		Page:     "152",
		Rating:   "0",
	},
	"zapper_strip": {
		Name:     "Zapper Strip",
		Category: "All",
		Slots:    "0",
		Avail:    "12R",
		Cost:     "2500",
		Source:   "R5",
		Page:     "152",
		Rating:   "0",
	},
	"tracking_strip": {
		Name:     "Tracking Strip",
		Category: "All",
		Slots:    "0",
		Avail:    "8R",
		Cost:     "600",
		Source:   "R5",
		Page:     "153",
		Rating:   "0",
	},
	"off_road_tires": {
		Name:     "Off-Road Tires",
		Category: "All",
		Slots:    "0",
		Avail:    "6",
		Cost:     "Rating * 400",
		Source:   "R5",
		Page:     "152",
		Rating:   "qty",
	},
	"racing_tires": {
		Name:     "Racing Tires",
		Category: "All",
		Slots:    "0",
		Avail:    "6",
		Cost:     "Rating * 250",
		Source:   "R5",
		Page:     "152",
		Rating:   "qty",
	},
	"run_flat_tires": {
		Name:     "Run-Flat Tires",
		Category: "All",
		Slots:    "0",
		Avail:    "4",
		Cost:     "Rating * 250",
		Source:   "R5",
		Page:     "152",
		Rating:   "qty",
	},
	"siren": {
		Name:     "Siren",
		Category: "All",
		Slots:    "0",
		Avail:    "15F",
		Cost:     "1400",
		Source:   "SS",
		Page:     "176",
		Rating:   "0",
	},
	"smuggling_compartment_dwarf_human_elf_or_ork": {
		Name:     "Smuggling Compartment (Dwarf, Human, Elf, or Ork)",
		Category: "All",
		Slots:    "0",
		Avail:    "12F",
		Cost:     "3500",
		Source:   "SS",
		Page:     "177",
		Rating:   "0",
	},
	"smuggling_compartment_troll": {
		Name:     "Smuggling Compartment (Troll)",
		Category: "All",
		Slots:    "0",
		Avail:    "12F",
		Cost:     "7000",
		Source:   "SS",
		Page:     "177",
		Rating:   "0",
	},
	"rigger_services_1_hour": {
		Name:     "Rigger Services (1 hour)",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "500",
		Source:   "SS",
		Page:     "186",
		Rating:   "1000000",
	},
	"extended_roof": {
		Name:     "Extended Roof",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "70",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"bathroom": {
		Name:     "Bathroom",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "74",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"holding_cell": {
		Name:     "Holding Cell",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "74",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"sleeping_quarters": {
		Name:     "Sleeping Quarters",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "74",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"advanced_lightbar": {
		Name:     "Advanced Lightbar",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "74",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"open_box_storage": {
		Name:     "Open Box Storage",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "74",
		Rating:   "0",
		Hide:     &[]bool{true}[0],
	},
	"interchangeable_bed_armory": {
		Name:     "Interchangeable Bed: Armory",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Variable(0-1000000)",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_cargo_pod": {
		Name:     "Interchangeable Bed: Cargo Pod",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Variable(0-1000000)",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_food_truck": {
		Name:     "Interchangeable Bed: Food Truck",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Variable(0-1000000)",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_sleeper_command_cabin": {
		Name:     "Interchangeable Bed: Sleeper Command Cabin",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Variable(0-1000000)",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_transport": {
		Name:     "Interchangeable Bed: Transport",
		Category: "All",
		Slots:    "0",
		Avail:    "0",
		Cost:     "Variable(0-1000000)",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_standard_drone_rack_micro": {
		Name:     "Interchangeable Bed: Standard Drone Rack (Micro)",
		Category: "All",
		Slots:    "0",
		Avail:    "4",
		Cost:     "350",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_standard_drone_rack_mini": {
		Name:     "Interchangeable Bed: Standard Drone Rack (Mini)",
		Category: "All",
		Slots:    "0",
		Avail:    "4",
		Cost:     "500",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_standard_drone_rack_small": {
		Name:     "Interchangeable Bed: Standard Drone Rack (Small)",
		Category: "All",
		Slots:    "0",
		Avail:    "4",
		Cost:     "1000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_standard_drone_rack_medium": {
		Name:     "Interchangeable Bed: Standard Drone Rack (Medium)",
		Category: "All",
		Slots:    "0",
		Avail:    "6",
		Cost:     "2000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_standard_drone_rack_large": {
		Name:     "Interchangeable Bed: Standard Drone Rack (Large)",
		Category: "All",
		Slots:    "0",
		Avail:    "8",
		Cost:     "4000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_landing_drone_rack_micro": {
		Name:     "Interchangeable Bed: Landing Drone Rack (Micro)",
		Category: "All",
		Slots:    "0",
		Avail:    "6",
		Cost:     "750",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_landing_drone_rack_mini": {
		Name:     "Interchangeable Bed: Landing Drone Rack (Mini)",
		Category: "All",
		Slots:    "0",
		Avail:    "6",
		Cost:     "1000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_landing_drone_rack_small": {
		Name:     "Interchangeable Bed: Landing Drone Rack (Small)",
		Category: "All",
		Slots:    "0",
		Avail:    "6",
		Cost:     "4000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_landing_drone_rack_medium": {
		Name:     "Interchangeable Bed: Landing Drone Rack (Medium)",
		Category: "All",
		Slots:    "0",
		Avail:    "8",
		Cost:     "10000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_landing_drone_rack_large": {
		Name:     "Interchangeable Bed: Landing Drone Rack (Large)",
		Category: "All",
		Slots:    "0",
		Avail:    "12",
		Cost:     "20000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_workshop": {
		Name:     "Interchangeable Bed: Workshop",
		Category: "All",
		Slots:    "0",
		Avail:    "8",
		Cost:     "5000",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_rigger_cocoon": {
		Name:     "Interchangeable Bed: Rigger Cocoon",
		Category: "All",
		Slots:    "0",
		Avail:    "8",
		Cost:     "1500",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"interchangeable_bed_custom": {
		Name:     "Interchangeable Bed: Custom",
		Category: "All",
		Slots:    "0",
		Avail:    "",
		Cost:     "Variable(0-1000000)",
		Source:   "R5",
		Page:     "54",
		Rating:   "0",
		Required: "",
	},
	"handling_drone": {
		Name:     "Handling (Drone)",
		Category: "Handling",
		Slots:    "(Rating - Handling - 1) * number(Rating - Handling - 1 >= 0)",
		Avail:    "Rating * 2",
		Cost:     "Rating * (number(Body = 0) * 100 + Body * 200)",
		Source:   "R5",
		Page:     "123",
		Rating:   "99",
		Required: "",
	},
	"speed_drone": {
		Name:     "Speed (Drone)",
		Category: "Speed",
		Slots:    "(Rating - Speed - 1) * number(Rating - Speed - 1 >= 0)",
		Avail:    "Rating * 2",
		Cost:     "Rating * (number(Body = 0) * 200 + Body * 400)",
		Source:   "R5",
		Page:     "123",
		Rating:   "99",
		Required: "",
	},
	"acceleration_drone": {
		Name:     "Acceleration (Drone)",
		Category: "Acceleration",
		Slots:    "(Rating - Acceleration - 1) * number(Rating - Acceleration - 1 >= 0)",
		Avail:    "Rating * 4",
		Cost:     "Rating * (number(Body = 0) * 100 + Body * 200)",
		Source:   "R5",
		Page:     "123",
		Rating:   "99",
		Required: "",
	},
	"armor_drone": {
		Name:     "Armor (Drone)",
		Category: "Armor",
		Slots:    "(Rating - Armor - 3) * number(Rating - Armor - 3 >= 0)",
		Avail:    "FixedValues(1,2,3,4,5,6,7R,8R,9R,10R,11R,12R,RatingF)",
		Cost:     "Rating * (number(Body = 0) * 100 + Body * 200)",
		Source:   "R5",
		Page:     "123",
		Rating:   "99",
		Required: "",
	},
	"sensor_drone": {
		Name:     "Sensor (Drone)",
		Category: "Sensor",
		Slots:    "(Rating - Sensor - 1) * number(Rating - Sensor - 1 >= 0)",
		Avail:    "Rating * 2",
		Cost:     "Rating * 1000",
		Source:   "R5",
		Page:     "123",
		Rating:   "8",
		Required: "",
	},
	"handling_downgrade_drone": {
		Name:     "Handling Downgrade (Drone)",
		Category: "Handling",
		Slots:    "-1",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "123",
		Rating:   "0",
		Required: "",
	},
	"speed_downgrade_drone": {
		Name:     "Speed Downgrade (Drone)",
		Category: "Speed",
		Slots:    "-1",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "123",
		Rating:   "0",
		Required: "",
	},
	"acceleration_downgrade_drone": {
		Name:     "Acceleration Downgrade (Drone)",
		Category: "Acceleration",
		Slots:    "-1",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "123",
		Rating:   "0",
		Required: "",
	},
	"body_downgrade_drone": {
		Name:     "Body Downgrade (Drone)",
		Category: "Body",
		Slots:    "-1",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "123",
		Rating:   "0",
		Required: "",
	},
	"armor_downgrade_drone": {
		Name:     "Armor Downgrade (Drone)",
		Category: "Armor",
		Slots:    "-1",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "123",
		Rating:   "0",
		Required: "",
	},
	"sensor_downgrade_drone": {
		Name:     "Sensor Downgrade (Drone)",
		Category: "Sensor",
		Slots:    "-1",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "123",
		Rating:   "0",
		Required: "",
	},
	"rigger_adaptation_2050": {
		Name:     "Rigger Adaptation (2050)",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "4",
		Cost:     "2800",
		Source:   "2050",
		Page:     "212",
		Rating:   "0",
	},
	"remote_adaptation_2050": {
		Name:     "Remote Adaptation (2050)",
		Category: "Cosmetic",
		Slots:    "0",
		Avail:    "4",
		Cost:     "number(Body = 0) * 500 + Body * 1000",
		Source:   "2050",
		Page:     "212",
		Rating:   "0",
		Required: "",
	},
}

// DataWeaponMounts contains weapon mount records keyed by their ID (lowercase with underscores)
var DataWeaponMounts = map[string]WeaponMount{
	"built_in": {
		Name:     "Built-In",
		Category: "Size",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "SR5",
		Page:     "0",
		Hide:     &[]bool{true}[0],
	},
	"standard_sr5": {
		Name:     "Standard [SR5]",
		Category: "Size",
		Slots:    "3",
		Avail:    "8F",
		Cost:     "2500",
		Source:   "SR5",
		Page:     "461",
	},
	"heavy_sr5": {
		Name:     "Heavy [SR5]",
		Category: "Size",
		Slots:    "6",
		Avail:    "14F",
		Cost:     "5000",
		Source:   "SR5",
		Page:     "461",
	},
	"light": {
		Name:     "Light",
		Category: "Size",
		Slots:    "1",
		Avail:    "6F",
		Cost:     "750",
		Source:   "R5",
		Page:     "163",
	},
	"standard": {
		Name:     "Standard",
		Category: "Size",
		Slots:    "2",
		Avail:    "8F",
		Cost:     "1500",
		Source:   "R5",
		Page:     "163",
	},
	"heavy": {
		Name:     "Heavy",
		Category: "Size",
		Slots:    "4",
		Avail:    "12F",
		Cost:     "4000",
		Source:   "R5",
		Page:     "163",
	},
	"external_sr5": {
		Name:     "External [SR5]",
		Category: "Visibility",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "SR5",
		Page:     "461",
	},
	"external": {
		Name:     "External",
		Category: "Visibility",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "163",
	},
	"internal": {
		Name:     "Internal",
		Category: "Visibility",
		Slots:    "2",
		Avail:    "2",
		Cost:     "1500",
		Source:   "R5",
		Page:     "163",
	},
	"concealed": {
		Name:     "Concealed",
		Category: "Visibility",
		Slots:    "4",
		Avail:    "4",
		Cost:     "4000",
		Source:   "R5",
		Page:     "163",
	},
	"flexible_sr5": {
		Name:     "Flexible [SR5]",
		Category: "Flexibility",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "SR5",
		Page:     "461",
	},
	"fixed": {
		Name:     "Fixed",
		Category: "Flexibility",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "163",
	},
	"flexible": {
		Name:     "Flexible",
		Category: "Flexibility",
		Slots:    "1",
		Avail:    "2",
		Cost:     "2000",
		Source:   "R5",
		Page:     "163",
	},
	"turret": {
		Name:     "Turret",
		Category: "Flexibility",
		Slots:    "2",
		Avail:    "6",
		Cost:     "5000",
		Source:   "R5",
		Page:     "163",
	},
	"remote": {
		Name:     "Remote",
		Category: "Control",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "163",
	},
	"remote_sr5": {
		Name:     "Remote [SR5]",
		Category: "Control",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "SR5",
		Page:     "461",
	},
	"manual": {
		Name:     "Manual",
		Category: "Control",
		Slots:    "1",
		Avail:    "1",
		Cost:     "500",
		Source:   "R5",
		Page:     "163",
	},
	"manual_sr5": {
		Name:     "Manual [SR5]",
		Category: "Control",
		Slots:    "0",
		Avail:    "1",
		Cost:     "500",
		Source:   "SR5",
		Page:     "461",
	},
	"armored_manual": {
		Name:     "Armored Manual",
		Category: "Control",
		Slots:    "2",
		Avail:    "4",
		Cost:     "1500",
		Source:   "R5",
		Page:     "163",
	},
	"micro_drone": {
		Name:     "Micro (Drone)",
		Category: "Size",
		Slots:    "0",
		Avail:    "8R",
		Cost:     "400",
		Source:   "R5",
		Page:     "124",
	},
	"mini_drone": {
		Name:     "Mini (Drone)",
		Category: "Size",
		Slots:    "1",
		Avail:    "4R",
		Cost:     "800",
		Source:   "R5",
		Page:     "124",
	},
	"small_drone": {
		Name:     "Small (Drone)",
		Category: "Size",
		Slots:    "2",
		Avail:    "8R",
		Cost:     "1600",
		Source:   "R5",
		Page:     "124",
	},
	"standard_drone": {
		Name:     "Standard (Drone)",
		Category: "Size",
		Slots:    "3",
		Avail:    "10F",
		Cost:     "2400",
		Source:   "R5",
		Page:     "124",
	},
	"large_drone": {
		Name:     "Large (Drone)",
		Category: "Size",
		Slots:    "4",
		Avail:    "12F",
		Cost:     "3200",
		Source:   "R5",
		Page:     "124",
	},
	"huge_drone": {
		Name:     "Huge (Drone)",
		Category: "Size",
		Slots:    "5",
		Avail:    "16F",
		Cost:     "4000",
		Source:   "R5",
		Page:     "124",
	},
	"heavy_drone": {
		Name:     "Heavy (Drone)",
		Category: "Size",
		Slots:    "6",
		Avail:    "20F",
		Cost:     "4800",
		Source:   "R5",
		Page:     "124",
	},
	"none": {
		Name:     "None",
		Category: "Control",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "163",
	},
	"none_1": {
		Name:     "None",
		Category: "Flexibility",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "163",
	},
	"none_2": {
		Name:     "None",
		Category: "Visibility",
		Slots:    "0",
		Avail:    "0",
		Cost:     "0",
		Source:   "R5",
		Page:     "163",
	},
}
