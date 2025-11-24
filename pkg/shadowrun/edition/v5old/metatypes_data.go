package v5

// Code generated from metatypes.xml. DO NOT EDIT.

var metatypesData = &MetatypesChummer{
	Categories: []MetatypeCategories{
		{
			Category: []MetatypeCategory{
				{
					Content: "Metahuman",
				},
				{
					Content: "Metavariant",
				},
				{
					Content: "Metasapient",
				},
				{
					Content: "Shapeshifter",
				},
			},
		},
	},
	Metatypes: []Metatypes{
		{
			Metatype: []Metatype{
				// 21 metatypes omitted (complex nested structure)
			},
		},
	},
}

// GetMetatypesData returns the loaded metatypes data.
func GetMetatypesData() *MetatypesChummer {
	return metatypesData
}
