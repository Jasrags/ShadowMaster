package v5

// VesselBonus represents bonuses for a vessel
type VesselBonus struct {
	Armor string `json:"armor,omitempty"` // Armor bonus
}

// Vessel represents a vessel (inanimate vessel material) from Shadowrun 5th Edition
// Note: This is similar to metatypes but for inanimate vessels
type Vessel struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Vessel name
	Category string `json:"category"` // Category (usually "Inanimate Vessels")
	BP       string `json:"bp"`       // Build points cost

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
	ESSMin int `json:"essmin"`
	ESSMax int `json:"essmax"`
	ESSAug int `json:"essaug"`

	// Movement
	Walk   string `json:"walk"`
	Run    string `json:"run"`
	Sprint string `json:"sprint"`

	// Optional fields
	Bonus  *VesselBonus `json:"bonus,omitempty"`  // Bonuses provided by this vessel
	Powers interface{}  `json:"powers,omitempty"` // Powers (can be null or complex)
	Source string       `json:"source,omitempty"` // Source book
	Page   string       `json:"page,omitempty"`   // Page number
}
