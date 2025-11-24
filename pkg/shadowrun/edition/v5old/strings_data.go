package v5

// Code generated from strings.xml. DO NOT EDIT.

var stringsData = &StringsChummer{
	MatrixAttributes: MatrixAttributes{
		Key: []string{
			"String_Attack",
			"String_DataProcessing",
			"String_Firewall",
			"String_Sleaze",
		},
	},
	Elements: Elements{
		Element: []string{
			"Acid",
			"Cold",
			"Electricity",
			"Fire",
			"Pollutant",
			"Radiation",
			"Water",
		},
	},
	Immunities: Immunities{
		Immunity: []string{
			"Age",
			"Normal Weapons",
		},
	},
	SpiritCategories: SpiritCategories{
		Category: []string{
			"Combat",
			"Detection",
			"Health",
			"Illusion",
			"Manipulation",
		},
	},
}

// GetStringsData returns the loaded strings data.
func GetStringsData() *StringsChummer {
	return stringsData
}
