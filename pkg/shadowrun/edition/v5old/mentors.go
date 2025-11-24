package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains mentor structures generated from mentors.xsd

// MentorCategory represents a mentor category
type MentorCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// MentorCategories represents a collection of mentor categories
type MentorCategories struct {
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Physical Active, Social Active, Technical Active (and 1 more)
// Enum Candidate: Physical Active, Social Active, Technical Active, Vehicle Active
// Length: 13-16 characters
	Category []MentorCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// MentorChoice represents a mentor choice
type MentorChoice struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Engineering
	Name string `xml:"name" json:"name"`
	Hide *string `xml:"hide,omitempty" json:"hide,omitempty"`
// Bonus represents bonus
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2
// Note: 100.0% of values are numeric strings
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Set *int `xml:"set,attr,omitempty" json:"+@set,omitempty"`
}

// MentorChoices represents a collection of mentor choices
type MentorChoices struct {
	Choice []MentorChoice `xml:"choice" json:"choice"`
}

// Mentor represents a mentor
type Mentor struct {
// ID represents id
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 6
// Examples: 9baed162-5e84-4f19-9b94-d543a560c067, 85c12bae-3954-483c-a211-d8ee43a1c65e, d866f612-7160-41d2-8ce9-b64262327559 (and 3 more)
// Enum Candidate: 06d5a10b-b353-44bc-936a-4d6c08ebeaf8, 50f1bfce-a64d-4fac-b25d-d870e7ff312f, 85c12bae-3954-483c-a211-d8ee43a1c65e, 894e4bea-883e-421b-8a6f-6ca61274cca3, 9baed162-5e84-4f19-9b94-d543a560c067, d866f612-7160-41d2-8ce9-b64262327559
	ID string `xml:"id" json:"id"`
	common.Visibility
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: Engineering
	Name string `xml:"name" json:"name"`
// Category represents category
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 4
// Examples: Physical Active, Social Active, Technical Active (and 1 more)
// Enum Candidate: Physical Active, Social Active, Technical Active, Vehicle Active
// Length: 13-16 characters
	Category *string `xml:"category,omitempty" json:"category,omitempty"`
// Advantage represents advantage
// Usage: always present (100.0%)
// Unique Values: 81
// Examples: All: +2 dice for tests to resist damage (not including drain)., All: +2 dice to either Gymnastics or Sneaking Tests (choose one)., All: +2 dice for Tracking tests. (and 7 more)
// Length: 22-130 characters
	Advantage string `xml:"advantage" json:"advantage"`
// Disadvantage represents disadvantage
// Usage: always present (100.0%)
// Unique Values: 81
// Examples: You might go berserk when you take Physical damage in combat or if someone under your care is badly injured. Make a Simple Charisma + Willpower Test (wound modifiers apply). You go berserk for 3 turns minus 1 turn per hit, so 3 or more hits averts the berserk rage entirely. If you're already going berserk, increase the duration. When you're berserk, you go after your attacker(s) without regard for your own safety. If you incapacitate the target(s) before the time is up, the berserk fury dissipates., Cat magicians toy with their prey. Unless you succeed in a Charisma + Willpower (3) Test at the start of combat, you cannot make an attack that incapacitates your target. If you take any Physical damage, all this playing around stops., A Dog magician is stubbornly loyal. You can never leave someone behind, betray your comrades, or let another sacrifice themselves in your place without making a successful Charisma + Willpower (3) Test. (and 7 more)
// Length: 44-680 characters
	Disadvantage string `xml:"disadvantage" json:"disadvantage"`
// Bonus represents bonus
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 2
// Note: 100.0% of values are numeric strings
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

