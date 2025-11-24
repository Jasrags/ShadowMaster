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
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 195
// Examples: 9f348c99-27e8-47ac-a098-a8a6a54c446a, 60156c75-78e9-4d79-af3f-494baa20edb7, 40d28f1b-2171-4a3b-a640-6b097a4dea95 (and 7 more)
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 195
// Examples: Administration, Alchemy, Alcohol (and 7 more)
// Length: 2-49 characters
	Name string `xml:"name" json:"name"`
	common.Visibility
// Attribute represents attribute
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: LOG, LOG, INT (and 7 more)
// Enum Candidate: INT, LOG
	Attribute string `xml:"attribute" json:"attribute"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Professional, Professional, Interest (and 7 more)
// Enum Candidate: Academic, Interest, Language, Professional, Street
// Length: 6-12 characters
	Category string `xml:"category" json:"category"`
// Default represents default
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: False, False, False (and 7 more)
// Note: 100.0% of values are boolean strings
	Default string `xml:"default" json:"default"`
// Exotic represents exotic
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True, True, True
// Note: 100.0% of values are boolean strings
	Exotic *string `xml:"exotic,omitempty" json:"exotic,omitempty"`
// SkillGroup represents skillgroup
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 15
// Examples: Engineering, Enchanting, Enchanting (and 7 more)
// Enum Candidate: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking
// Length: 6-12 characters
	SkillGroup string `xml:"skillgroup" json:"skillgroup"`
// RequiresGroundMovement represents requiresgroundmovement
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True
// Note: 100.0% of values are boolean strings
	RequiresGroundMovement *string `xml:"requiresgroundmovement,omitempty" json:"requiresgroundmovement,omitempty"`
// RequiresSwimMovement represents requiresswimmovement
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True
// Note: 100.0% of values are boolean strings
	RequiresSwimMovement *string `xml:"requiresswimmovement,omitempty" json:"requiresswimmovement,omitempty"`
// RequiresFlyMovement represents requiresflymovement
// Type: boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: True
// Note: 100.0% of values are boolean strings
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
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Professional, Professional, Interest (and 7 more)
// Enum Candidate: Academic, Interest, Language, Professional, Street
// Length: 6-12 characters
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

