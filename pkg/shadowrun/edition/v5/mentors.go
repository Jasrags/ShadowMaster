package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains mentor structures generated from mentors.xsd

// MentorCategory represents a mentor category
type MentorCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// MentorCategories represents a collection of mentor categories
type MentorCategories struct {
	Category []MentorCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// MentorChoice represents a mentor choice
type MentorChoice struct {
	Name string `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Set *int `xml:"set,attr,omitempty" json:"+@set,omitempty"`
}

// MentorChoices represents a collection of mentor choices
type MentorChoices struct {
	Choice []MentorChoice `xml:"choice" json:"choice"`
}

// Mentor represents a mentor
type Mentor struct {
	ID string `xml:"id" json:"id"`
	common.Visibility
	Name string `xml:"name" json:"name"`
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
	Advantage string `xml:"advantage" json:"advantage"`
	Disadvantage string `xml:"disadvantage" json:"disadvantage"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Choices *MentorChoices `xml:"choices,omitempty" json:"choices,omitempty"`
	common.SourceReference
}

// Mentors represents a collection of mentors
type Mentors struct {
	Mentor []Mentor `xml:"mentor,omitempty" json:"mentor,omitempty"`
}

// MentorsChummer represents the root chummer element for mentors
type MentorsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []MentorCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Mentors []Mentors `xml:"mentors,omitempty" json:"mentors,omitempty"`
}

