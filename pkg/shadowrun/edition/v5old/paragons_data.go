package v5

// Code generated from paragons.xml. DO NOT EDIT.

var paragonsData = &ParagonsChummer{
	Categories: []ParagonCategories{
		{
			Category: []ParagonCategory{
				{
					Content: "Resonance",
				},
			},
		},
	},
	Paragons: []Paragons{
		{
			Paragon: []Paragon{},
		},
	},
}

// GetParagonsData returns the loaded paragons data.
func GetParagonsData() *ParagonsChummer {
	return paragonsData
}

// GetAllParagons returns all paragons.
func GetAllParagons() []Paragon {
	if len(paragonsData.Paragons) == 0 {
		return []Paragon{}
	}
	return paragonsData.Paragons[0].Paragon
}

// GetParagonByID returns the paragon with the given ID, or nil if not found.
func GetParagonByID(id string) *Paragon {
	paragons := GetAllParagons()
	for i := range paragons {
		if paragons[i].ID == id {
			return &paragons[i]
		}
	}
	return nil
}
