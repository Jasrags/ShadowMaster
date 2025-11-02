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

// SkillLinkedAttribute maps each skill to its linked attribute
// This map is based on the official Shadowrun 3rd Edition rules
var SkillLinkedAttribute = map[string]string{
	// Body linked skills
	"Athletics": "Body",
	"Driving":   "Body",
	"Car":       "Reaction", // Note: Car is listed under Reaction in source, but "Driving" is under Body
	// Vehicle skills are Reaction-linked, but some may use different names

	// Strength linked skills
	"Blades":               "Strength", // "Edged Weapons" in source
	"Clubs":                "Strength",
	"Exotic Melee Weapon":  "Strength", // May include Polearms/Staffs
	"Unarmed Combat":       "Strength",
	"Throwing Weapons":     "Strength",
	"Archery":              "Strength", // "Projectile Weapons" in source
	"Heavy Weapons":        "Strength",
	"Exotic Ranged Weapon": "Strength", // May include Laser Weapons, Whips

	// Quickness linked skills
	"Pistols":    "Quickness",
	"Automatics": "Quickness", // "Submachine Guns" in source
	"Longarms":   "Quickness", // "Rifles" and "Assault Rifles" in source - may need specialization
	"Stealth":    "Quickness",
	// Note: Shotguns would be Longarms specialization
	// Note: Laser Weapons may be Quickness or Strength depending on type

	// Intelligence linked skills
	"Computer":           "Intelligence",
	"Electronics":        "Intelligence",
	"Electronics B/R":    "Intelligence", // "Build/Repair" in source
	"Biotechnology":      "Intelligence", // "Biotech" in source
	"Demolitions":        "Intelligence",
	"Gunnery":            "Intelligence",
	"Navigation":         "Intelligence",
	"Software":           "Intelligence",
	"Cybertechnology":    "Intelligence",
	"Data Search":        "Intelligence",
	"Electronic Warfare": "Intelligence",
	"Hacking":            "Intelligence",
	"Hardware":           "Intelligence",
	"First Aid":          "Intelligence",
	"Medicine":           "Intelligence",
	"Chemistry":          "Intelligence",
	"Forgery":            "Intelligence",
	// Knowledge Skills all link to Intelligence
	// Language Skills all link to Intelligence

	// Charisma linked skills
	"Etiquette":        "Charisma",
	"Instruction":      "Charisma", // "Instructon" typo in source
	"Interrogation":    "Charisma",
	"Intimidation":     "Charisma",
	"Leadership":       "Charisma",
	"Negotiation":      "Charisma",
	"Con":              "Charisma",
	"Performance":      "Charisma",
	"Street Etiquette": "Charisma",

	// Willpower linked skills
	"Summoning":           "Willpower", // "Conjuring" in source
	"Spellcasting":        "Willpower", // "Sorcery" in source
	"Banishing":           "Willpower",
	"Binding":             "Willpower",
	"Counterspelling":     "Willpower",
	"Ritual Spellcasting": "Willpower",
	"Astral Combat":       "Willpower",

	// Reaction linked skills (all vehicle skills)
	"Bike":            "Reaction",
	"Hovercraft":      "Reaction",
	"Motorcycle":      "Reaction", // May be same as Bike
	"Motorboat":       "Reaction",
	"Ship":            "Reaction", // "Ship" in source
	"Sailboat":        "Reaction",
	"Fixed Wing":      "Reaction", // "Winged Aircraft" in source
	"Rotorcraft":      "Reaction", // "Rotor Aircraft" in source
	"Vectored Thrust": "Reaction", // "Vector Thrust Aircraft" in source
	"Yacht":           "Reaction", // May be same as Sailboat or Ship
	"Submarine":       "Reaction",
	// Note: "Lighter-Than-Air Aircraft" not in our current list, would link to Reaction

	// Skills that may need clarification or have multiple possible attributes
	"Diving":      "Body",         // Likely Body or Quickness
	"Flight":      "Quickness",    // Likely Quickness or Body
	"Gymnastics":  "Quickness",    // Likely Quickness or Body
	"Running":     "Body",         // Likely Body
	"Swimming":    "Body",         // Likely Body
	"Palming":     "Quickness",    // Likely Quickness
	"Parachuting": "Quickness",    // Likely Quickness or Body
	"Shadowing":   "Quickness",    // Likely Quickness or Intelligence
	"Artillery":   "Intelligence", // Likely Intelligence (Gunnery related)
}

// LanguageSkillsDatabase contains available languages
var LanguageSkillsDatabase = []string{
	"English",
	// Add more languages as needed: Spanish, Japanese, Sperethiel (Elvish), Or'zet (Orkish), etc.
}

// GetLanguageSkillTargetNumber returns the target number for understanding language based on complexity
// Based on Shadowrun 3rd Edition Language Skill Table
func GetLanguageSkillTargetNumber(complexity string) int {
	switch complexity {
	case "universal":
		return 2 // Universal concept (hunger, fear, bodily functions)
	case "basic":
		return 4 // Basic conversation (Concerns of daily life)
	case "complex":
		return 6 // Complex subject (special/limited-interest topics)
	case "intricate":
		return 9 // Intricate subject (almost any technical subject)
	case "obscure":
		return 11 // Obscure subject (deeply technical/rare knowledge)
	default:
		return 4 // Default to basic conversation
	}
}

// GetLanguageSkillLingoModifier returns the modifier for speaking lingo/variation
// +2 to the target number for lingo or variation of a particular language
func GetLanguageSkillLingoModifier() int {
	return 2
}

// GetSkillLinkedAttribute returns the linked attribute for a given skill
// Returns empty string if the skill is not found or is a knowledge/language skill
// Knowledge and Language skills all link to Intelligence
func GetSkillLinkedAttribute(skillName string) string {
	// Knowledge and language skills all link to Intelligence
	// Check if it's a knowledge skill
	for _, category := range KnowledgeSkillCategories {
		for _, skill := range category.Skills {
			if skill == skillName {
				return "Intelligence"
			}
		}
	}

	// Check if it's a language skill
	for _, lang := range LanguageSkillsDatabase {
		if lang == skillName {
			return "Intelligence"
		}
	}

	// Check the explicit mapping
	if attr, ok := SkillLinkedAttribute[skillName]; ok {
		return attr
	}

	// Default to empty string for unknown skills
	return ""
}

// CalculateSkillCost calculates the cost in skill points for a skill rating
// based on the skill's linked attribute and the character's attribute rating
func CalculateSkillCost(skillName string, skillRating int, linkedAttributeValue int) int {
	// Minimum cost is 1 point per rating
	cost := skillRating

	// If skill rating is greater than linked attribute, double the cost
	if skillRating > linkedAttributeValue {
		cost = skillRating * 2
	}

	return cost
}
