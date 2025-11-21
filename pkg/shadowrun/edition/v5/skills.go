package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains skill structures generated from skills.xsd

// Spec represents a skill specialization
type Spec struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// Specs represents a collection of skill specializations
type Specs struct {
	Spec []Spec `xml:"spec,omitempty" json:"spec,omitempty"`
}

// Skill represents a skill definition
type Skill struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.Visibility
	Attribute string `xml:"attribute" json:"attribute"`
	Category string `xml:"category" json:"category"`
	Default string `xml:"default" json:"default"`
	Exotic *string `xml:"exotic,omitempty" json:"exotic,omitempty"`
	SkillGroup string `xml:"skillgroup" json:"skillgroup"`
	RequiresGroundMovement *string `xml:"requiresgroundmovement,omitempty" json:"requiresgroundmovement,omitempty"`
	RequiresSwimMovement *string `xml:"requiresswimmovement,omitempty" json:"requiresswimmovement,omitempty"`
	RequiresFlyMovement *string `xml:"requiresflymovement,omitempty" json:"requiresflymovement,omitempty"`
	Specs Specs `xml:"specs" json:"specs"`
	common.SourceReference
}

// SkillGroupName represents a skill group name
type SkillGroupName struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// SkillGroups represents a collection of skill group names
type SkillGroups struct {
	Name []SkillGroupName `xml:"name,omitempty" json:"name,omitempty"`
}

// SkillCategory represents a skill category with a type attribute
type SkillCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Type string `xml:"type,attr" json:"+@type"`
}

// SkillCategories represents a collection of skill categories
type SkillCategories struct {
	Category []SkillCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// Skills represents a collection of skills
type Skills struct {
	Skill []Skill `xml:"skill,omitempty" json:"skill,omitempty"`
}

// KnowledgeSkills represents a collection of knowledge skills
type KnowledgeSkills struct {
	Skill []Skill `xml:"skill,omitempty" json:"skill,omitempty"`
}

// SkillsChummer represents the root chummer element for skills
type SkillsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	SkillGroups []SkillGroups `xml:"skillgroups,omitempty" json:"skillgroups,omitempty"`
	Categories []SkillCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Skills []Skills `xml:"skills,omitempty" json:"skills,omitempty"`
	KnowledgeSkills []KnowledgeSkills `xml:"knowledgeskills,omitempty" json:"knowledgeskills,omitempty"`
}

