package v5

// SkillCategory represents the category a skill belongs to
type SkillCategory string

const (
	SkillCategoryCombatActive   SkillCategory = "combat_active"
	SkillCategoryPhysicalActive SkillCategory = "physical_active"
	SkillCategorySocial         SkillCategory = "social"
	SkillCategoryMagical        SkillCategory = "magical"
	SkillCategoryResonance      SkillCategory = "resonance"
	SkillCategoryTechnical      SkillCategory = "technical"
	SkillCategoryVehicle        SkillCategory = "vehicle"
	SkillCategoryKnowledge      SkillCategory = "knowledge"
	SkillCategoryLanguage       SkillCategory = "language"
)

// SkillType represents whether a skill is Active, Knowledge, or Language
type SkillType string

const (
	SkillTypeActive    SkillType = "active"
	SkillTypeKnowledge SkillType = "knowledge"
	SkillTypeLanguage  SkillType = "language"
)

// Attribute represents the attribute a skill is linked to
type Attribute string

const (
	AttributeAgility   Attribute = "agility"
	AttributeBody      Attribute = "body"
	AttributeCharisma  Attribute = "charisma"
	AttributeIntuition Attribute = "intuition"
	AttributeLogic     Attribute = "logic"
	AttributeMagic     Attribute = "magic"
	AttributeReaction  Attribute = "reaction"
	AttributeResonance Attribute = "resonance"
	AttributeStrength  Attribute = "strength"
	AttributeWillpower Attribute = "willpower"
)

// Skill represents a Shadowrun 5th Edition skill definition
type Skill struct {
	// Name is the skill name (e.g., "Archery", "Automatics")
	Name string `json:"name,omitempty"`
	// Type indicates if this is an active, knowledge, or language skill
	Type SkillType `json:"type,omitempty"`
	// Category is the skill category
	Category SkillCategory `json:"category,omitempty"`
	// LinkedAttribute is the attribute this skill is linked to
	LinkedAttribute Attribute `json:"linked_attribute,omitempty"`
	// Description is the full text description of the skill
	Description string `json:"description,omitempty"`
	// CanDefault indicates if this skill can be defaulted (used untrained)
	CanDefault bool `json:"can_default,omitempty"`
	// SkillGroup is the name of the skill group this belongs to (empty if none)
	SkillGroup string `json:"skill_group,omitempty"`
	// Specializations is a list of available specializations (empty if none)
	Specializations []string `json:"specializations,omitempty"`
	// IsSpecific indicates if this skill must be taken once per specific instance
	// (e.g., "Exotic Ranged Weapon (Specific)", "Pilot Exotic Vehicle (Specific)")
	IsSpecific bool `json:"is_specific,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// SkillGroupDefinition represents a skill group definition
type SkillGroupDefinition struct {
	// Name is the skill group name (e.g., "Acting", "Athletics", "Biotech")
	Name string `json:"name,omitempty"`
	// Description is the description of the skill group (if any)
	Description string `json:"description,omitempty"`
	// Skills is a list of skill names that belong to this group
	Skills []string `json:"skills,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// SkillsData represents the skills data structure (legacy format for backward compatibility)
type SkillsData struct {
	Skills          []SkillsGroup
	KnowledgeSkills []KnowledgeSkillsGroup
}

// SkillsGroup represents a group of skills (legacy format)
type SkillsGroup struct {
	Skill []Skill
}

// KnowledgeSkillsGroup represents a group of knowledge skills (legacy format)
type KnowledgeSkillsGroup struct {
	Skill []Skill
}

// dataActiveSkills, dataKnowledgeSkills, and dataLanguageSkills are declared in their respective data files

// GetAllSkills returns all skill definitions (active, knowledge, and language).
func GetAllSkills() []Skill {
	skills := make([]Skill, 0, len(dataActiveSkills)+len(dataKnowledgeSkills)+len(dataLanguageSkills))
	for _, s := range dataActiveSkills {
		skills = append(skills, s)
	}
	for _, s := range dataKnowledgeSkills {
		skills = append(skills, s)
	}
	for _, s := range dataLanguageSkills {
		skills = append(skills, s)
	}
	return skills
}

// GetAllActiveSkills returns all active skill definitions.
func GetAllActiveSkills() []Skill {
	skills := make([]Skill, 0, len(dataActiveSkills))
	for _, s := range dataActiveSkills {
		skills = append(skills, s)
	}
	return skills
}

// GetAllKnowledgeSkills returns all knowledge skill definitions.
func GetAllKnowledgeSkills() []Skill {
	skills := make([]Skill, 0, len(dataKnowledgeSkills))
	for _, s := range dataKnowledgeSkills {
		skills = append(skills, s)
	}
	return skills
}

// GetAllLanguageSkills returns all language skill definitions.
func GetAllLanguageSkills() []Skill {
	skills := make([]Skill, 0, len(dataLanguageSkills))
	for _, s := range dataLanguageSkills {
		skills = append(skills, s)
	}
	return skills
}

// GetSkillByName returns the skill definition with the given name, or nil if not found.
func GetSkillByName(name string) *Skill {
	// Check active skills first
	for _, s := range dataActiveSkills {
		if s.Name == name {
			return &s
		}
	}
	// Check knowledge skills
	for _, s := range dataKnowledgeSkills {
		if s.Name == name {
			return &s
		}
	}
	// Check language skills
	for _, s := range dataLanguageSkills {
		if s.Name == name {
			return &s
		}
	}
	return nil
}

// GetSkillByKey returns the skill definition with the given key, or nil if not found.
func GetSkillByKey(key string) *Skill {
	// Check active skills first
	if s, ok := dataActiveSkills[key]; ok {
		return &s
	}
	// Check knowledge skills
	if s, ok := dataKnowledgeSkills[key]; ok {
		return &s
	}
	// Check language skills
	if s, ok := dataLanguageSkills[key]; ok {
		return &s
	}
	return nil
}

// GetAllSkillGroups returns all skill group definitions.
func GetAllSkillGroups() []SkillGroupDefinition {
	groups := make([]SkillGroupDefinition, 0, len(dataSkillGroups))
	for _, g := range dataSkillGroups {
		groups = append(groups, g)
	}
	return groups
}

// GetSkillGroupByName returns the skill group definition with the given name, or nil if not found.
func GetSkillGroupByName(name string) *SkillGroupDefinition {
	for _, g := range dataSkillGroups {
		if g.Name == name {
			return &g
		}
	}
	return nil
}

// GetSkillGroupByKey returns the skill group definition with the given key, or nil if not found.
func GetSkillGroupByKey(key string) *SkillGroupDefinition {
	g, ok := dataSkillGroups[key]
	if !ok {
		return nil
	}
	return &g
}

// GetSkillsByGroup returns all skills that belong to the specified skill group.
func GetSkillsByGroup(groupName string) []Skill {
	skills := make([]Skill, 0)
	for _, skill := range dataActiveSkills {
		if skill.SkillGroup == groupName {
			skills = append(skills, skill)
		}
	}
	// Knowledge and language skills don't belong to skill groups
	return skills
}

// GetSkillsData returns skills data organized by groups (for backward compatibility)
func GetSkillsData() SkillsData {
	// Group active skills by category for the legacy structure
	skillsByCategory := make(map[SkillCategory][]Skill)

	for _, skill := range dataActiveSkills {
		skillsByCategory[skill.Category] = append(skillsByCategory[skill.Category], skill)
	}

	// Convert to SkillsGroup format
	skillsGroups := make([]SkillsGroup, 0)
	for category, skills := range skillsByCategory {
		if category == SkillCategoryKnowledge {
			continue // Knowledge skills go in separate group
		}
		skillsGroups = append(skillsGroups, SkillsGroup{
			Skill: skills,
		})
	}

	// Handle knowledge skills separately
	knowledgeGroups := make([]KnowledgeSkillsGroup, 0)
	knowledgeSkills := make([]Skill, 0, len(dataKnowledgeSkills))
	for _, skill := range dataKnowledgeSkills {
		knowledgeSkills = append(knowledgeSkills, skill)
	}
	if len(knowledgeSkills) > 0 {
		knowledgeGroups = append(knowledgeGroups, KnowledgeSkillsGroup{
			Skill: knowledgeSkills,
		})
	}

	return SkillsData{
		Skills:          skillsGroups,
		KnowledgeSkills: knowledgeGroups,
	}
}
