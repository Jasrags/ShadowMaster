package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains contact structures generated from contacts.xml

// ContactTypesList represents a collection of contact types
type ContactTypesList struct {
	Contact []string `xml:"contact" json:"contact"`
}

// Genders represents a collection of gender options
type Genders struct {
	Gender []string `xml:"gender" json:"gender"`
}

// Ages represents a collection of age options
type Ages struct {
	Age []string `xml:"age" json:"age"`
}

// PersonalLives represents a collection of personal life options
type PersonalLives struct {
	// PersonalLife represents personallife
	// Usage: always present (100.0%)
	// Unique Values: 7
	PersonalLife []common.PersonalLife `xml:"personallife" json:"personallife"`
}

// ContactTypes represents a collection of contact types
type ContactTypes struct {
	Type []string `xml:"type" json:"type"`
}

// PreferredPayments represents a collection of preferred payment options
type PreferredPayments struct {
	PreferredPayment []string `xml:"preferredpayment" json:"preferredpayment"`
}

// HobbiesVices represents a collection of hobby/vice options
type HobbiesVices struct {
// HobbyVice represents hobbyvice
// Type: enum_candidate
// Usage: always present (100.0%)
// Unique Values: 33
// Examples: Animals (Paracritters), Bad Habit (Dream Chips), Bad Habit (Novacoke) (and 7 more)
// Enum Candidate: Yes
// Length: 14-44 characters
	HobbyVice []string `xml:"hobbyvice" json:"hobbyvice"`
}

// ContactsChummer represents the root chummer element for contacts
type ContactsChummer struct {
	Contacts          ContactTypesList  `xml:"contacts" json:"contacts"`
	Genders           Genders           `xml:"genders" json:"genders"`
	Ages              Ages              `xml:"ages" json:"ages"`
	PersonalLives     PersonalLives     `xml:"personallives" json:"personallives"`
	Types             ContactTypes      `xml:"types" json:"types"`
	PreferredPayments PreferredPayments `xml:"preferredpayments" json:"preferredpayments"`
	HobbiesVices      HobbiesVices      `xml:"hobbiesvices" json:"hobbiesvices"`
}
