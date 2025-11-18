package v5

// CritterCategory represents a critter category (just a string name)
type CritterCategory struct {
	Name string `json:"name"` // Category name
}

// CritterPower represents a critter power (can be string or complex object)
type CritterPower struct {
	Content string `json:"content,omitempty"` // Power name
	Select  string `json:"select,omitempty"`  // Selection/option for the power
}

// CritterSkill represents a critter skill
type CritterSkill struct {
	Name   string `json:"name"`           // Skill name
	Rating string `json:"rating"`         // Skill rating
	Spec   string `json:"spec,omitempty"` // Specialization
}

// CritterPowers represents a collection of critter powers
type CritterPowers struct {
	Power interface{} `json:"power,omitempty"` // Can be string, []string, CritterPower, or []CritterPower
}

// CritterSkills represents a collection of critter skills
type CritterSkills struct {
	Skill interface{} `json:"skill,omitempty"` // Can be CritterSkill or []CritterSkill
}

// CritterBonus represents bonuses for a critter
type CritterBonus struct {
	EnableTab      interface{} `json:"enabletab,omitempty"`      // Enable tab (can be complex)
	InitiativePass string      `json:"initiativepass,omitempty"` // Initiative pass bonus
	// Add other bonus fields as needed
}

// Critter represents a critter from Shadowrun 5th Edition
type Critter struct {
	// Required fields
	ID       string `json:"id"`       // Unique ID
	Name     string `json:"name"`     // Critter name
	Category string `json:"category"` // Category
	Karma    string `json:"karma"`    // Karma cost

	// Attribute limits
	BODMin int `json:"bodmin"`
	BODMax int `json:"bodmax"`
	BODAug int `json:"bodaug"`
	AGIMin int `json:"agimin"`
	AGIMax int `json:"agimax"`
	AGIAug int `json:"agiaug"`
	REAMin int `json:"reamin"`
	REAMax int `json:"reamax"`
	REAAug int `json:"reaaug"`
	STRMin int `json:"strmin"`
	STRMax int `json:"strmax"`
	STRAug int `json:"straug"`
	CHAMin int `json:"chamin"`
	CHAMax int `json:"chamax"`
	CHAAug int `json:"chaaug"`
	INTMin int `json:"intmin"`
	INTMax int `json:"intmax"`
	INTAug int `json:"intaug"`
	LOGMin int `json:"logmin"`
	LOGMax int `json:"logmax"`
	LOGAug int `json:"logaug"`
	WILMin int `json:"wilmin"`
	WILMax int `json:"wilmax"`
	WILAug int `json:"wilaug"`
	INIMin int `json:"inimin"`
	INIMax int `json:"inimax"`
	INIAug int `json:"iniaug"`
	EDGMin int `json:"edgmin"`
	EDGMax int `json:"edgmax"`
	EDGAug int `json:"edgaug"`
	MAGMin int `json:"magmin"`
	MAGMax int `json:"magmax"`
	MAGAug int `json:"magaug"`
	RESMin int `json:"resmin"`
	RESMax int `json:"resmax"`
	RESAug int `json:"resaug"`
	DEPMin int `json:"depmin"`
	DEPMax int `json:"depmax"`
	DEPAug int `json:"depaug"`
	ESSMin int `json:"essmin"`
	ESSMax int `json:"essmax"`
	ESSAug int `json:"essaug"`

	// Movement
	Walk   string `json:"walk"`
	Run    string `json:"run"`
	Sprint string `json:"sprint"`

	// Optional fields
	Bonus  *CritterBonus  `json:"bonus,omitempty"`  // Bonuses
	Powers *CritterPowers `json:"powers,omitempty"` // Powers
	Skills *CritterSkills `json:"skills,omitempty"` // Skills
	Source string         `json:"source,omitempty"` // Source book
	Page   string         `json:"page,omitempty"`   // Page number
}
