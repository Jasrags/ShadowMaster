package v5

// Code generated from qualitylevels.xml. DO NOT EDIT.

var qualityLevelsData = &QualityLevelsChummer{
	QualityGroups: &QualityGroups{
		QualityGroup: []QualityGroup{
			{
				ID: "",
				Name: "SINner",
				Levels: QualityLevels{
					Level: []QualityLevel{
						{
							Content: "SINner (National)",
							Value: 1,
						},
						{
							Content: "SINner (Criminal)",
							Value: 2,
						},
						{
							Content: "SINner (Corporate Limited)",
							Value: 3,
						},
						{
							Content: "SINner (Corporate)",
							Value: 4,
						},
					},
				},
			},
		},
	},
}

// GetQualityLevelsData returns the loaded quality levels data.
func GetQualityLevelsData() *QualityLevelsChummer {
	return qualityLevelsData
}

// GetAllQualityGroups returns all quality groups.
func GetAllQualityGroups() []QualityGroup {
	if qualityLevelsData.QualityGroups == nil {
		return []QualityGroup{}
	}
	return qualityLevelsData.QualityGroups.QualityGroup
}

// GetQualityGroupByID returns the quality group with the given ID, or nil if not found.
func GetQualityGroupByID(id string) *QualityGroup {
	groups := GetAllQualityGroups()
	for i := range groups {
		if groups[i].ID == id {
			return &groups[i]
		}
	}
	return nil
}

// GetQualityGroupByName returns the quality group with the given name, or nil if not found.
func GetQualityGroupByName(name string) *QualityGroup {
	groups := GetAllQualityGroups()
	for i := range groups {
		if groups[i].Name == name {
			return &groups[i]
		}
	}
	return nil
}
