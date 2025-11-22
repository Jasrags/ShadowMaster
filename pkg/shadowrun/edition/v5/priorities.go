package v5

// This file contains priority structures generated from priorities.xsd

// PriorityTalentRequired represents required conditions for a talent
type PriorityTalentRequired struct {
	OneOf PriorityTalentRequiredOneOf `xml:"oneof" json:"oneof"`
}

// PriorityTalentRequiredOneOf represents one-of requirement
type PriorityTalentRequiredOneOf struct {
// Metatype represents metatype
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: A.I., A.I., A.I. (and 2 more)
	Metatype string `xml:"metatype" json:"metatype"`
}

// PriorityTalentForbidden represents forbidden conditions for a talent
type PriorityTalentForbidden struct {
	OneOf PriorityTalentForbiddenOneOf `xml:"oneof" json:"oneof"`
}

// PriorityTalentForbiddenOneOf represents one-of forbidden condition
type PriorityTalentForbiddenOneOf struct {
// Metatype represents metatype
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: A.I., A.I., A.I. (and 2 more)
	Metatype string `xml:"metatype" json:"metatype"`
}

// PriorityTalentQualities represents qualities for a talent
type PriorityTalentQualities struct {
	Quality []string `xml:"quality" json:"quality"`
}

// PriorityTalentSkillGroupChoices represents skill group choices for a talent
type PriorityTalentSkillGroupChoices struct {
	SkillGroup []string `xml:"skillgroup" json:"skillgroup"`
}

// PriorityTalentSkillChoices represents skill choices for a talent
type PriorityTalentSkillChoices struct {
	Skill []string `xml:"skill" json:"skill"`
}

// PriorityTalent represents a talent in a priority
type PriorityTalent struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 27
// Examples: Magician - 6 Magic/10 Spells, Mystic Adept - 6 Magic/10 Spells, Technomancer - 6 Resonance/7 Complex Forms (and 7 more)
// Enum Candidate: Yes
// Length: 7-42 characters
	Name string `xml:"name" json:"name"`
	Value string `xml:"value" json:"value"`
	Depth *byte `xml:"depth,omitempty" json:"depth,omitempty"`
	SpecialAttribPoints *byte `xml:"specialattribpoints,omitempty" json:"specialattribpoints,omitempty"`
	Qualities *PriorityTalentQualities `xml:"qualities,omitempty" json:"qualities,omitempty"`
	SkillGroupChoices *PriorityTalentSkillGroupChoices `xml:"skillgroupchoices,omitempty" json:"skillgroupchoices,omitempty"`
	SkillChoices *PriorityTalentSkillChoices `xml:"skillchoices,omitempty" json:"skillchoices,omitempty"`
	Resonance *byte `xml:"resonance,omitempty" json:"resonance,omitempty"`
	CFP *byte `xml:"cfp,omitempty" json:"cfp,omitempty"`
	Magic *byte `xml:"magic,omitempty" json:"magic,omitempty"`
// SkillGroupQty represents skillgroupqty
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1, 1, 1 (and 3 more)
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	SkillGroupQty *byte `xml:"skillgroupqty,omitempty" json:"skillgroupqty,omitempty"`
	SkillGroupVal *byte `xml:"skillgroupval,omitempty" json:"skillgroupval,omitempty"`
	SkillGroupType *string `xml:"skillgrouptype,omitempty" json:"skillgrouptype,omitempty"`
	Spells *byte `xml:"spells,omitempty" json:"spells,omitempty"`
	SkillQty *byte `xml:"skillqty,omitempty" json:"skillqty,omitempty"`
	SkillVal *byte `xml:"skillval,omitempty" json:"skillval,omitempty"`
	SkillType *string `xml:"skilltype,omitempty" json:"skilltype,omitempty"`
	Required *PriorityTalentRequired `xml:"required,omitempty" json:"required,omitempty"`
	Forbidden *PriorityTalentForbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
}

// PriorityTalents represents a collection of talents
type PriorityTalents struct {
	Talent []PriorityTalent `xml:"talent" json:"talent"`
}

// PriorityMetavariant represents a metavariant in a priority
type PriorityMetavariant struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 27
// Examples: Magician - 6 Magic/10 Spells, Mystic Adept - 6 Magic/10 Spells, Technomancer - 6 Resonance/7 Complex Forms (and 7 more)
// Enum Candidate: Yes
// Length: 7-42 characters
	Name string `xml:"name" json:"name"`
	Value byte `xml:"value" json:"value"`
	Karma int8 `xml:"karma" json:"karma"`
}

// PriorityMetavariants represents a collection of metavariants
type PriorityMetavariants struct {
	Metavariant []PriorityMetavariant `xml:"metavariant,omitempty" json:"metavariant,omitempty"`
}

// PriorityMetatype represents a metatype in a priority
type PriorityMetatype struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 27
// Examples: Magician - 6 Magic/10 Spells, Mystic Adept - 6 Magic/10 Spells, Technomancer - 6 Resonance/7 Complex Forms (and 7 more)
// Enum Candidate: Yes
// Length: 7-42 characters
	Name string `xml:"name" json:"name"`
	Value byte `xml:"value" json:"value"`
	Karma byte `xml:"karma" json:"karma"`
	Metavariants *PriorityMetavariants `xml:"metavariants,omitempty" json:"metavariants,omitempty"`
}

// PriorityMetatypes represents a collection of metatypes
type PriorityMetatypes struct {
	Metatype []PriorityMetatype `xml:"metatype" json:"metatype"`
}

// PriorityCategories represents a collection of categories
type PriorityCategories struct {
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: Heritage, Heritage, Heritage (and 7 more)
// Enum Candidate: Attributes, Heritage, Resources, Skills, Talent
// Length: 6-10 characters
	Category []string `xml:"category" json:"category"`
}

// Priority represents a priority definition
type Priority struct {
	ID *string `xml:"id,omitempty" json:"id,omitempty"`
	Name *string `xml:"name,omitempty" json:"name,omitempty"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	Value *string `xml:"value,omitempty" json:"value,omitempty"`
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	GameplayOption *string `xml:"gameplayoption,omitempty" json:"gameplayoption,omitempty"`
// Skills represents skills
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 5
// Examples: 46, 36, 28 (and 2 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: 18, 22, 28, 36, 46
	Skills *byte `xml:"skills,omitempty" json:"skills,omitempty"`
	SkillGroups *byte `xml:"skillgroups,omitempty" json:"skillgroups,omitempty"`
	Attributes *byte `xml:"attributes,omitempty" json:"attributes,omitempty"`
	Talents *PriorityTalents `xml:"talents,omitempty" json:"talents,omitempty"`
	Metatypes *PriorityMetatypes `xml:"metatypes,omitempty" json:"metatypes,omitempty"`
	Resources *uint `xml:"resources,omitempty" json:"resources,omitempty"`
}

// Priorities represents a collection of priorities
type Priorities struct {
	Priority []Priority `xml:"priority" json:"priority"`
}

// PrioritiesChummer represents the root chummer element for priorities
type PrioritiesChummer struct {
	Version byte `xml:"version" json:"version"`
	Categories PriorityCategories `xml:"categories" json:"categories"`
	Priorities Priorities `xml:"priorities" json:"priorities"`
}

