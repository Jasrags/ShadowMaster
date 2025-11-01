package v3

// Shadowrun 3rd Edition Skills Database

// SkillCategory represents a category of skills
type SkillCategory struct {
	Name   string   `json:"name"`
	Skills []string `json:"skills"`
}

// ActiveSkillCategories contains all active skill categories for SR3
var ActiveSkillCategories = []SkillCategory{
	{
		Name: "Combat",
		Skills: []string{
			"Archery",
			"Automatics",
			"Heavy Weapons",
			"Longarms",
			"Pistols",
			"Throwing Weapons",
			"Unarmed Combat",
			"Blades",
			"Clubs",
			"Exotic Melee Weapon",
		},
	},
	{
		Name: "Physical",
		Skills: []string{
			"Athletics",
			"Diving",
			"Flight",
			"Gymnastics",
			"Palming",
			"Parachuting",
			"Running",
			"Shadowing",
			"Stealth",
			"Swimming",
		},
	},
	{
		Name: "Vehicle",
		Skills: []string{
			"Bike",
			"Car",
			"Fixed Wing",
			"Hovercraft",
			"Motorcycle",
			"Rotorcraft",
			"Sailboat",
			"Skiing",
			"Snowmobile",
			"Vectored Thrust",
			"Yacht",
		},
	},
	{
		Name: "Weapon",
		Skills: []string{
			"Archery",
			"Artillery",
			"Automatics",
			"Blades",
			"Clubs",
			"Exotic Melee Weapon",
			"Exotic Ranged Weapon",
			"Heavy Weapons",
			"Longarms",
			"Pistols",
			"Throwing Weapons",
			"Unarmed Combat",
		},
	},
	{
		Name: "Magical",
		Skills: []string{
			"Astral Combat",
			"Banishing",
			"Binding",
			"Counterspelling",
			"Ritual Spellcasting",
			"Spellcasting",
			"Summoning",
		},
	},
	{
		Name: "Technical",
		Skills: []string{
			"Biotechnology",
			"Chemistry",
			"Computer",
			"Cybertechnology",
			"Demolitions",
			"Electronics",
			"Electronics B/R",
			"First Aid",
			"Forgery",
			"Medicine",
			"Navigation",
			"Software",
		},
	},
	{
		Name: "Social",
		Skills: []string{
			"Con",
			"Etiquette",
			"Instruction",
			"Interrogation",
			"Intimidation",
			"Leadership",
			"Negotiation",
			"Performance",
			"Street Etiquette",
		},
	},
	{
		Name: "Matrix",
		Skills: []string{
			"Computer",
			"Cybertechnology",
			"Data Search",
			"Electronic Warfare",
			"Hacking",
			"Hardware",
			"Software",
		},
	},
	{
		Name: "Athletic",
		Skills: []string{
			"Athletics",
			"Diving",
			"Flight",
			"Gymnastics",
			"Running",
			"Swimming",
		},
	},
}

// KnowledgeSkillCategories contains all knowledge skill categories for SR3
var KnowledgeSkillCategories = []SkillCategory{
	{
		Name: "Academic",
		Skills: []string{
			"Anthropology",
			"Archaeology",
			"Art History",
			"Biology",
			"Chemistry",
			"English",
			"Geography",
			"Geology",
			"History",
			"Literature",
			"Mathematics",
			"Philosophy",
			"Physics",
			"Theology",
		},
	},
	{
		Name: "Street",
		Skills: []string{
			"Aztlan",
			"Biker Gangs",
			"Gang Identification",
			"Gang Territories",
			"Organized Crime",
			"Safe Houses",
			"Smuggling Routes",
			"Street Drugs",
			"Trid Personalities",
			"Trid Shows",
		},
	},
	{
		Name: "Professional",
		Skills: []string{
			"Accounting",
			"Architecture",
			"Business",
			"Corporate Security",
			"Corporate Politics",
			"Journalism",
			"Law",
			"Military",
			"Stock Market",
			"Trid Production",
		},
	},
	{
		Name: "Technical",
		Skills: []string{
			"Aircraft Mechanics",
			"Astronomy",
			"Biology",
			"Chemistry",
			"Computer Programming",
			"Electronics",
			"Engineering",
			"Geology",
			"Mathematics",
			"Physics",
			"Software",
		},
	},
	{
		Name: "Interests",
		Skills: []string{
			"Gaming",
			"Music",
			"Sports",
			"Trideo Shows",
			"Matrix Games",
			"Fashion",
			"Cooking",
			"Art",
			"Literature",
			"Movies",
		},
	},
}

// GetAllActiveSkills returns a flattened list of all active skills
func GetAllActiveSkills() []string {
	var skills []string
	for _, category := range ActiveSkillCategories {
		skills = append(skills, category.Skills...)
	}
	// Remove duplicates
	seen := make(map[string]bool)
	result := []string{}
	for _, skill := range skills {
		if !seen[skill] {
			seen[skill] = true
			result = append(result, skill)
		}
	}
	return result
}

// GetAllKnowledgeSkills returns a flattened list of all knowledge skills
func GetAllKnowledgeSkills() []string {
	var skills []string
	for _, category := range KnowledgeSkillCategories {
		skills = append(skills, category.Skills...)
	}
	// Remove duplicates
	seen := make(map[string]bool)
	result := []string{}
	for _, skill := range skills {
		if !seen[skill] {
			seen[skill] = true
			result = append(result, skill)
		}
	}
	return result
}
