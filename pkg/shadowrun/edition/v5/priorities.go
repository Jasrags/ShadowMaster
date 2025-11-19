package v5

// PriorityMetavariant represents a metavariant option in a priority
type PriorityMetavariant struct {
	Name  string `json:"name"`  // Metavariant name
	Value string `json:"value"` // Priority value
	Karma string `json:"karma"` // Karma cost
}

// PriorityMetavariants represents a collection of metavariants
type PriorityMetavariants struct {
	Metavariant interface{} `json:"metavariant,omitempty"` // Can be single PriorityMetavariant or []PriorityMetavariant
}

// PriorityMetatype represents a metatype option in a priority
type PriorityMetatype struct {
	Name         string                `json:"name"`                   // Metatype name
	Value        string                `json:"value"`                  // Priority value
	Karma        string                `json:"karma"`                  // Karma cost
	Metavariants *PriorityMetavariants `json:"metavariants,omitempty"` // Metavariants for this metatype
}

// PriorityMetatypes represents a collection of metatypes
type PriorityMetatypes struct {
	Metatype interface{} `json:"metatype,omitempty"` // Can be single PriorityMetatype or []PriorityMetatype
}

// TalentForbidden represents forbidden options for a talent
type TalentForbidden struct {
	OneOf interface{} `json:"oneof,omitempty"` // One-of requirement (can be complex)
}

// TalentQualities represents qualities for a talent
type TalentQualities struct {
	Quality interface{} `json:"quality,omitempty"` // Quality (can be string or []string)
}

// PriorityTalent represents a talent option in a priority
type PriorityTalent struct {
	Name      string           `json:"name"`                // Talent name
	Value     string           `json:"value"`               // Talent value
	Qualities *TalentQualities `json:"qualities,omitempty"` // Qualities
	Magic     string           `json:"magic,omitempty"`     // Magic rating
	Spells    string           `json:"spells,omitempty"`    // Number of spells
	SkillQty  string           `json:"skillqty,omitempty"`  // Skill quantity
	SkillVal  string           `json:"skillval,omitempty"`  // Skill value
	SkillType interface{}      `json:"skilltype,omitempty"` // Skill type (can be string or complex object)
	Forbidden *TalentForbidden `json:"forbidden,omitempty"` // Forbidden options
}

// PriorityTalents represents a collection of talents
type PriorityTalents struct {
	Talent interface{} `json:"talent,omitempty"` // Can be single PriorityTalent or []PriorityTalent
}

// Priority represents a priority option from Shadowrun 5th Edition
type Priority struct {
	// Required fields
	ID       string `json:"id"`       // Unique identifier (UUID)
	Name     string `json:"name"`     // Priority name (e.g., "A - Any metatype")
	Value    string `json:"value"`    // Priority value (A, B, C, D, E)
	Category string `json:"category"` // Category (Heritage, Talent, Attributes, Skills, Resources)

	// Category-specific fields
	Metatypes     *PriorityMetatypes `json:"metatypes,omitempty"`     // For Heritage category
	Talents       *PriorityTalents   `json:"talents,omitempty"`       // For Talent category
	Attributes    string             `json:"attributes,omitempty"`    // For Attributes category (attribute points as string)
	Skills        string             `json:"skills,omitempty"`        // For Skills category (skill points as string)
	SkillGroups   string             `json:"skillgroups,omitempty"`   // For Skills category (skill group points as string)
	Resources     string             `json:"resources,omitempty"`     // For Resources category (nuyen as string)
	PriorityTable string             `json:"prioritytable,omitempty"` // For Resources category (table name)
}

// PriorityCategory represents a priority category name
type PriorityCategory struct {
	Name string `json:"name"` // Category name
}

// PriorityTable represents a priority table name
type PriorityTable struct {
	Name string `json:"name"` // Table name
}
