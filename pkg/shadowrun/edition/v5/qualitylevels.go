package v5

// This file contains quality level structures generated from qualitylevels.xsd

// QualityLevel represents a quality level entry
type QualityLevel struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Value int `xml:"value,attr" json:"+@value"`
}

// QualityLevels represents a collection of quality levels
type QualityLevels struct {
	Level []QualityLevel `xml:"level" json:"level"`
}

// QualityGroup represents a quality group definition
type QualityGroup struct {
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: SINner
	Name string `xml:"name" json:"name"`
	Levels QualityLevels `xml:"levels" json:"levels"`
}

// QualityGroups represents a collection of quality groups
type QualityGroups struct {
	QualityGroup []QualityGroup `xml:"qualitygroup,omitempty" json:"qualitygroup,omitempty"`
}

// QualityLevelsChummer represents the root chummer element for quality levels
type QualityLevelsChummer struct {
	QualityGroups *QualityGroups `xml:"qualitygroups,omitempty" json:"qualitygroups,omitempty"`
}

