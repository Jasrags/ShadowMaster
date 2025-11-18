package v5

// MetatypeQualities represents qualities associated with a metatype
type MetatypeQualities struct {
	Positive *MetatypeQualityList `json:"positive,omitempty"` // Positive qualities
	Negative *MetatypeQualityList `json:"negative,omitempty"` // Negative qualities
}

// MetatypeQualityList represents a list of qualities (can be single string or array)
type MetatypeQualityList struct {
	Quality interface{} `json:"quality,omitempty"` // Can be string or []string
}

// MetatypeBonus represents bonuses provided by a metatype
type MetatypeBonus struct {
	LifestyleCost string `json:"lifestylecost,omitempty"` // Lifestyle cost modifier
	// Add other bonus fields as needed
}

// Metavariant represents a metavariant of a metatype
type Metavariant struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier
	Name     string `json:"name"`     // Metavariant name
	Category string `json:"category"` // Category (usually "Metavariant")
	Karma    string `json:"karma"`    // Karma cost

	// Attribute limits (min/max/augmented)
	BODMin int `json:"bodmin"` // Body minimum
	BODMax int `json:"bodmax"` // Body maximum
	BODAug int `json:"bodaug"` // Body augmented maximum
	AGIMin int `json:"agimin"` // Agility minimum
	AGIMax int `json:"agimax"` // Agility maximum
	AGIAug int `json:"agiaug"` // Agility augmented maximum
	REAMin int `json:"reamin"` // Reaction minimum
	REAMax int `json:"reamax"` // Reaction maximum
	REAAug int `json:"reaaug"` // Reaction augmented maximum
	STRMin int `json:"strmin"` // Strength minimum
	STRMax int `json:"strmax"` // Strength maximum
	STRAug int `json:"straug"` // Strength augmented maximum
	CHAMin int `json:"chamin"` // Charisma minimum
	CHAMax int `json:"chamax"` // Charisma maximum
	CHAAug int `json:"chaaug"` // Charisma augmented maximum
	INTMin int `json:"intmin"` // Intuition minimum
	INTMax int `json:"intmax"` // Intuition maximum
	INTAug int `json:"intaug"` // Intuition augmented maximum
	LOGMin int `json:"logmin"` // Logic minimum
	LOGMax int `json:"logmax"` // Logic maximum
	LOGAug int `json:"logaug"` // Logic augmented maximum
	WILMin int `json:"wilmin"` // Willpower minimum
	WILMax int `json:"wilmax"` // Willpower maximum
	WILAug int `json:"wilaug"` // Willpower augmented maximum
	INIMin int `json:"inimin"` // Initiative minimum
	INIMax int `json:"inimax"` // Initiative maximum
	INIAug int `json:"iniaug"` // Initiative augmented maximum
	EDGMin int `json:"edgmin"` // Edge minimum
	EDGMax int `json:"edgmax"` // Edge maximum
	EDGAug int `json:"edgaug"` // Edge augmented maximum
	MAGMin int `json:"magmin"` // Magic minimum
	MAGMax int `json:"magmax"` // Magic maximum
	MAGAug int `json:"magaug"` // Magic augmented maximum
	RESMin int `json:"resmin"` // Resonance minimum
	RESMax int `json:"resmax"` // Resonance maximum
	RESAug int `json:"resaug"` // Resonance augmented maximum
	ESSMin int `json:"essmin"` // Essence minimum
	ESSMax int `json:"essmax"` // Essence maximum
	ESSAug int `json:"essaug"` // Essence augmented maximum
	DEPMin int `json:"depmin"` // Depth minimum
	DEPMax int `json:"depmax"` // Depth maximum
	DEPAug int `json:"depaug"` // Depth augmented maximum

	// Optional fields
	Qualities *MetatypeQualities `json:"qualities,omitempty"` // Associated qualities
	Bonus     *MetatypeBonus     `json:"bonus,omitempty"`     // Bonuses
	Source    string             `json:"source,omitempty"`    // Source book
	Page      string             `json:"page,omitempty"`      // Page number
}

// Metatype represents a metatype from Shadowrun 5th Edition
type Metatype struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier
	Name     string `json:"name"`     // Metatype name
	Category string `json:"category"` // Category (Metahuman, Metavariant, etc.)
	Karma    string `json:"karma"`    // Karma cost

	// Attribute limits (min/max/augmented)
	BODMin int `json:"bodmin"` // Body minimum
	BODMax int `json:"bodmax"` // Body maximum
	BODAug int `json:"bodaug"` // Body augmented maximum
	AGIMin int `json:"agimin"` // Agility minimum
	AGIMax int `json:"agimax"` // Agility maximum
	AGIAug int `json:"agiaug"` // Agility augmented maximum
	REAMin int `json:"reamin"` // Reaction minimum
	REAMax int `json:"reamax"` // Reaction maximum
	REAAug int `json:"reaaug"` // Reaction augmented maximum
	STRMin int `json:"strmin"` // Strength minimum
	STRMax int `json:"strmax"` // Strength maximum
	STRAug int `json:"straug"` // Strength augmented maximum
	CHAMin int `json:"chamin"` // Charisma minimum
	CHAMax int `json:"chamax"` // Charisma maximum
	CHAAug int `json:"chaaug"` // Charisma augmented maximum
	INTMin int `json:"intmin"` // Intuition minimum
	INTMax int `json:"intmax"` // Intuition maximum
	INTAug int `json:"intaug"` // Intuition augmented maximum
	LOGMin int `json:"logmin"` // Logic minimum
	LOGMax int `json:"logmax"` // Logic maximum
	LOGAug int `json:"logaug"` // Logic augmented maximum
	WILMin int `json:"wilmin"` // Willpower minimum
	WILMax int `json:"wilmax"` // Willpower maximum
	WILAug int `json:"wilaug"` // Willpower augmented maximum
	INIMin int `json:"inimin"` // Initiative minimum
	INIMax int `json:"inimax"` // Initiative maximum
	INIAug int `json:"iniaug"` // Initiative augmented maximum
	EDGMin int `json:"edgmin"` // Edge minimum
	EDGMax int `json:"edgmax"` // Edge maximum
	EDGAug int `json:"edgaug"` // Edge augmented maximum
	MAGMin int `json:"magmin"` // Magic minimum
	MAGMax int `json:"magmax"` // Magic maximum
	MAGAug int `json:"magaug"` // Magic augmented maximum
	RESMin int `json:"resmin"` // Resonance minimum
	RESMax int `json:"resmax"` // Resonance maximum
	RESAug int `json:"resaug"` // Resonance augmented maximum
	ESSMin int `json:"essmin"` // Essence minimum
	ESSMax int `json:"essmax"` // Essence maximum
	ESSAug int `json:"essaug"` // Essence augmented maximum
	DEPMin int `json:"depmin"` // Depth minimum
	DEPMax int `json:"depmax"` // Depth maximum
	DEPAug int `json:"depaug"` // Depth augmented maximum

	// Movement
	Walk   string `json:"walk,omitempty"`   // Walk speed (format: "2/1/0")
	Run    string `json:"run,omitempty"`    // Run speed (format: "4/0/0")
	Sprint string `json:"sprint,omitempty"` // Sprint speed (format: "2/1/0")

	// Optional fields
	Qualities            *MetatypeQualities `json:"qualities,omitempty"`            // Associated qualities
	Bonus                *MetatypeBonus     `json:"bonus,omitempty"`                // Bonuses
	Metavariants         *Metavariants      `json:"metavariants,omitempty"`         // Metavariants
	Source               string             `json:"source,omitempty"`               // Source book
	Page                 string             `json:"page,omitempty"`                 // Page number
	Powers               interface{}        `json:"powers,omitempty"`               // Powers (complex structure)
	AddWeapon            string             `json:"addweapon,omitempty"`            // Weapon added
	HalveAttributePoints *bool              `json:"halveattributepoints,omitempty"` // Halve attribute points
	Movement             interface{}        `json:"movement,omitempty"`             // Movement (complex structure)
	QualityRestriction   interface{}        `json:"qualityrestriction,omitempty"`   // Quality restrictions
}

// Metavariants represents a collection of metavariants
type Metavariants struct {
	Metavariant interface{} `json:"metavariant,omitempty"` // Can be single Metavariant or []Metavariant
}
