package v5

// Code generated from critters.xml. DO NOT EDIT.

var crittersData = &CrittersChummer{
	Categories: []CritterCategories{
		{
			Category: []CritterCategory{
				{
					Content: "Dracoforms",
				},
				{
					Content: "Infected",
				},
				{
					Content: "Insect Spirits",
				},
				{
					Content: "Mundane Critters",
				},
				{
					Content: "Mutant Critters",
				},
				{
					Content: "Paranormal Critters",
				},
				{
					Content: "Protosapients",
				},
				{
					Content: "Ritual",
				},
				{
					Content: "Shadow Spirits",
				},
				{
					Content: "Shedim",
				},
				{
					Content: "Spirits",
				},
				{
					Content: "Sprites",
				},
				{
					Content: "Technocritters",
				},
				{
					Content: "Toxic Critters",
				},
				{
					Content: "Toxic Spirits",
				},
				{
					Content: "Warforms",
				},
				{
					Content: "Extraplanar Travelers",
				},
				{
					Content: "Necro Spirits",
				},
			},
		},
	},
	Metatypes: []Critters{
		{
			Metatype: []Critter{
				// 269 critters omitted (complex nested structure)
			},
		},
	},
}

// GetCrittersData returns the loaded critters data.
func GetCrittersData() *CrittersChummer {
	return crittersData
}
