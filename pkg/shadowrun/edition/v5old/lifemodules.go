package v5

// This file contains life module structures generated from lifemodules.xml

// LifeModuleStage represents a life module stage
type LifeModuleStage struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Order int `xml:"order,attr" json:"+@order"`
}

// LifeModuleStages represents a collection of life module stages
type LifeModuleStages struct {
	Stage []LifeModuleStage `xml:"stage" json:"stage"`
}

// LifeModuleAttributeLevel represents an attribute level bonus
type LifeModuleAttributeLevel struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Electronics, Electronics, Acting (and 7 more)
// Enum Candidate: Acting, Athletics, Biotech, Close Combat, Cracking, Electronics, Engineering, Firearms, Influence, Outdoors, Stealth, Tasking
// Length: 6-12 characters
	Name string `xml:"name" json:"name"`
	Val *int `xml:"val,omitempty" json:"val,omitempty"`
}

// LifeModuleSkillLevel represents a skill level bonus
type LifeModuleSkillLevel struct {
	Name string `xml:"name" json:"name"`
	Val *int `xml:"val,omitempty" json:"val,omitempty"`
}

// LifeModuleKnowledgeSkillLevelOptions represents options for a knowledge skill level
type LifeModuleKnowledgeSkillLevelOptions struct {
// Spanish represents spanish
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Spanish, Spanish, Spanish (and 2 more)
	Spanish *string `xml:"spanish,omitempty" json:"spanish,omitempty"`
	German *string `xml:"german,omitempty" json:"german,omitempty"`
	Italian *string `xml:"italian,omitempty" json:"italian,omitempty"`
	Flee *string `xml:"flee,omitempty" json:"flee,omitempty"`
	Orange *string `xml:"orange,omitempty" json:"orange,omitempty"`
	Polish *string `xml:"polish,omitempty" json:"polish,omitempty"`
	Yiddish *string `xml:"yiddish,omitempty" json:"yiddish,omitempty"`
}

// LifeModuleKnowledgeSkillLevel represents a knowledge skill level bonus
type LifeModuleKnowledgeSkillLevel struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: a9df9852-6f4d-423d-8251-c92a709c1476, a9df9852-6f4d-423d-8251-c92a709c1476, 1082e017-a93f-4b64-a478-b329668d57d6 (and 1 more)
// Enum Candidate: 1082e017-a93f-4b64-a478-b329668d57d6, 6715b9d9-5445-4bc0-886c-b6ac309181b3, a9df9852-6f4d-423d-8251-c92a709c1476
	ID *string `xml:"id,omitempty" json:"id,omitempty"`
	Group *string `xml:"group,omitempty" json:"group,omitempty"`
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Val *int `xml:"val,omitempty" json:"val,omitempty"`
	Options *LifeModuleKnowledgeSkillLevelOptions `xml:"options,omitempty" json:"options,omitempty"`
}

// LifeModuleQualityLevel represents a quality level bonus
type LifeModuleQualityLevel struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
// Group represents group
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: Academic, Academic, Language (and 7 more)
// Enum Candidate: Academic, Interest, Language, Professional, Street, [Any]
// Length: 5-12 characters
	Group *string `xml:"group,attr,omitempty" json:"+@group,omitempty"`
}

// LifeModuleBonus represents a bonus structure for life modules
type LifeModuleBonus struct {
	AttributeLevel []LifeModuleAttributeLevel `xml:"attributelevel,omitempty" json:"attributelevel,omitempty"`
	SkillLevel []LifeModuleSkillLevel `xml:"skilllevel,omitempty" json:"skilllevel,omitempty"`
	KnowledgeSkillLevel []LifeModuleKnowledgeSkillLevel `xml:"knowledgeskilllevel,omitempty" json:"knowledgeskilllevel,omitempty"`
	PushText *string `xml:"pushtext,omitempty" json:"pushtext,omitempty"`
	FreeNegativeQualities *int `xml:"freenegativequalities,omitempty" json:"freenegativequalities,omitempty"`
// QualityLevel represents qualitylevel
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 2, 2, 2 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 2, 3
	QualityLevel []LifeModuleQualityLevel `xml:"qualitylevel,omitempty" json:"qualitylevel,omitempty"`
}

// LifeModuleVersion represents a version of a life module
type LifeModuleVersion struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Story *string `xml:"story,omitempty" json:"story,omitempty"`
	Bonus *LifeModuleBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
}

// LifeModuleVersions represents a collection of life module versions
type LifeModuleVersions struct {
	Version []LifeModuleVersion `xml:"version" json:"version"`
}

// LifeModule represents a life module definition
type LifeModule struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: a9df9852-6f4d-423d-8251-c92a709c1476, a9df9852-6f4d-423d-8251-c92a709c1476, 1082e017-a93f-4b64-a478-b329668d57d6 (and 1 more)
// Enum Candidate: 1082e017-a93f-4b64-a478-b329668d57d6, 6715b9d9-5445-4bc0-886c-b6ac309181b3, a9df9852-6f4d-423d-8251-c92a709c1476
	ID string `xml:"id" json:"id"`
	Stage string `xml:"stage" json:"stage"`
	Category string `xml:"category" json:"category"`
	Name string `xml:"name" json:"name"`
	Karma int `xml:"karma" json:"karma"`
	Versions *LifeModuleVersions `xml:"versions,omitempty" json:"versions,omitempty"`
	Bonus *LifeModuleBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Story *string `xml:"story,omitempty" json:"story,omitempty"`
	Source string `xml:"source" json:"source"`
	Page string `xml:"page" json:"page"`
}

// LifeModules represents a collection of life modules
type LifeModules struct {
	Module []LifeModule `xml:"module" json:"module"`
}

// LifeModulesChummer represents the root chummer element for life modules
type LifeModulesChummer struct {
	Stages LifeModuleStages `xml:"stages" json:"stages"`
	Modules LifeModules `xml:"modules" json:"modules"`
}

