package v5

// LifeModuleStage represents a life module stage
type LifeModuleStage struct {
	Content string `json:"+content"` // Stage name
	Order   string `json:"+@order"`  // Order number
}

// LifeModuleVersionBonus represents bonuses for a life module version
type LifeModuleVersionBonus struct {
	AttributeLevel        interface{} `json:"attributelevel,omitempty"`        // Attribute level bonus (can be complex)
	SkillLevel            interface{} `json:"skilllevel,omitempty"`            // Skill level bonus (can be single or list)
	KnowledgeSkillLevel   interface{} `json:"knowledgeskilllevel,omitempty"`   // Knowledge skill level bonus (can be single or list)
	PushText              string      `json:"pushtext,omitempty"`              // Push text
	FreeNegativeQualities string      `json:"freenegativequalities,omitempty"` // Free negative qualities
	AddQualities          interface{} `json:"addqualities,omitempty"`          // Add qualities (can be complex)
}

// LifeModuleVersion represents a version of a life module
type LifeModuleVersion struct {
	ID    string                  `json:"id"`              // Unique identifier (UUID)
	Name  string                  `json:"name"`            // Version name
	Story string                  `json:"story,omitempty"` // Story text
	Bonus *LifeModuleVersionBonus `json:"bonus,omitempty"` // Bonuses for this version
}

// LifeModuleVersions represents a collection of versions for a life module
type LifeModuleVersions struct {
	Version interface{} `json:"version,omitempty"` // Can be single LifeModuleVersion or []LifeModuleVersion
}

// LifeModuleBonus represents bonuses for a life module
type LifeModuleBonus struct {
	SkillLevel          interface{} `json:"skilllevel,omitempty"`          // Skill level bonus (can be single or list)
	KnowledgeSkillLevel interface{} `json:"knowledgeskilllevel,omitempty"` // Knowledge skill level bonus (can be single or list)
	AttributeLevel      interface{} `json:"attributelevel,omitempty"`      // Attribute level bonus (can be complex)
	AddQualities        interface{} `json:"addqualities,omitempty"`        // Add qualities (can be complex)
}

// LifeModule represents a life module from Shadowrun 5th Edition
type LifeModule struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Stage    string `json:"stage"`    // Stage name
	Category string `json:"category"` // Category (usually "LifeModule")
	Name     string `json:"name"`     // Module name
	Karma    string `json:"karma"`    // Karma cost

	// Optional fields
	Source string `json:"source,omitempty"` // Source book
	Page   string `json:"page,omitempty"`   // Page number

	// Optional fields
	Versions *LifeModuleVersions `json:"versions,omitempty"` // Versions of this module
	Bonus    *LifeModuleBonus    `json:"bonus,omitempty"`    // Bonuses for this module
	Story    string              `json:"story,omitempty"`    // Story text
}
