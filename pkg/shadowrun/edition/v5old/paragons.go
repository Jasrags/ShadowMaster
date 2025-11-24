package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains paragon structures generated from paragons.xsd

// ParagonCategory represents a paragon category
type ParagonCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// ParagonCategories represents a collection of paragon categories
type ParagonCategories struct {
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Resonance, Resonance, Resonance (and 6 more)
	Category []ParagonCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// ParagonChoice represents a paragon choice
type ParagonChoice struct {
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Archery, Automatics, Blades (and 7 more)
// Enum Candidate: Archery, Automatics, Blades, Clubs, Exotic Melee Weapon, Exotic Ranged Weapon, Gunnery, Heavy Weapons, Longarms, Pistols, Throwing Weapons, Unarmed Combat
// Length: 5-20 characters
	Name string `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
// Bonus represents bonus
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 1 (and 3 more)
// Note: 100.0% of values are numeric strings
// Note: 83.3% of values are boolean strings
// Enum Candidate: -2, 1
// Length: 1-2 characters
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Set *int `xml:"set,attr,omitempty" json:"+@set,omitempty"`
}

// ParagonChoices represents a collection of paragon choices
type ParagonChoices struct {
	Choice []ParagonChoice `xml:"choice" json:"choice"`
}

// Paragon represents a paragon
type Paragon struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: acadd628-ebb5-4c79-a3c2-953ce7fa1885, 46f88748-8c6c-4230-ad59-2eccb463cc35, 690ccad8-3f42-4d62-a358-e099747fc4e4 (and 6 more)
// Enum Candidate: 117e7c69-abea-4637-b5e7-3a927ae0ad60, 46f88748-8c6c-4230-ad59-2eccb463cc35, 690ccad8-3f42-4d62-a358-e099747fc4e4, acadd628-ebb5-4c79-a3c2-953ce7fa1885, b74d032e-5d39-4e4a-b043-0707ffa00b5e, c45c123c-06c7-42b3-a2ee-01e37f2f7bf8, da2f3bad-d934-461a-aa92-60fc6e5c3ef7, de755412-5cae-4859-880f-75a7bd68d5a4, df42911f-0542-4fae-80d1-39573547ff68
	ID string `xml:"id" json:"id"`
	common.Visibility
// Name represents name
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 12
// Examples: Archery, Automatics, Blades (and 7 more)
// Enum Candidate: Archery, Automatics, Blades, Clubs, Exotic Melee Weapon, Exotic Ranged Weapon, Gunnery, Heavy Weapons, Longarms, Pistols, Throwing Weapons, Unarmed Combat
// Length: 5-20 characters
	Name string `xml:"name" json:"name"`
// Category represents category
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Resonance, Resonance, Resonance (and 6 more)
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
// Advantage represents advantage
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: If a follower of 01 has at least one mark on a target, they may act as if they have an extra mark on it., +1 limit and +1 dice pool bonus for Edit actions., +1 limit and +1 dice pool bonus for Browse actions and digital legwork. (and 6 more)
// Length: 39-104 characters
	Advantage string `xml:"advantage" json:"advantage"`
// Disadvantage represents disadvantage
// Usage: always present (100.0%)
// Unique Values: 9
// Examples: –1 limit and –1 dice pool penalty when acting only in AR., –1 limit and –1 dice for Snoop actions., –1 limit for Edit actions designed to destroy data. (and 6 more)
// Length: 39-57 characters
	Disadvantage string `xml:"disadvantage" json:"disadvantage"`
// Bonus represents bonus
// Type: numeric_string, boolean_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 2
// Examples: 1, 1, 1 (and 3 more)
// Note: 100.0% of values are numeric strings
// Note: 83.3% of values are boolean strings
// Enum Candidate: -2, 1
// Length: 1-2 characters
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Choices *ParagonChoices `xml:"choices,omitempty" json:"choices,omitempty"`
	common.SourceReference
}

// Paragons represents a collection of paragons
type Paragons struct {
	Paragon []Paragon `xml:"paragon,omitempty" json:"paragon,omitempty"`
}

// ParagonsChummer represents the root chummer element for paragons
type ParagonsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []ParagonCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Paragons []Paragons `xml:"paragons,omitempty" json:"paragons,omitempty"`
}

