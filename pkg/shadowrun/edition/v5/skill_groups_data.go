package v5

// dataSkillGroups contains all skill group definitions
var dataSkillGroups = map[string]SkillGroupDefinition{
	"acting": {
		Name:        "Acting",
		Description: "Skills for performance, deception, and assuming false identities. These skills allow characters to manipulate others through confidence games, impersonate others, and entertain audiences.",
		Skills:      []string{"Con", "Impersonation", "Performance"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"athletics": {
		Name:        "Athletics",
		Description: "Physical movement and athletic skills covering balance, running, and swimming. These skills govern a character's ability to move their body effectively in various environments.",
		Skills:      []string{"Gymnastics", "Running", "Swimming"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"biotech": {
		Name:        "Biotech",
		Description: "Biological and medical technology skills covering biotechnology, cybertechnology, first aid, and medicine. These skills are essential for medical care, bioware, and cyberware maintenance.",
		Skills:      []string{"Biotechnology", "Cybertechnology", "First Aid", "Medicine"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"close_combat": {
		Name:        "Close Combat",
		Description: "Melee combat skills for hand-to-hand fighting. These skills cover edged weapons, blunt weapons, and unarmed combat techniques.",
		Skills:      []string{"Blades", "Clubs", "Unarmed Combat"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"conjuring": {
		Name:        "Conjuring",
		Description: "Magical skills for working with spirits. These skills allow characters to summon spirits, bind them to service, and banish them back to their native plane.",
		Skills:      []string{"Banishing", "Binding", "Summoning"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"cracking": {
		Name:        "Cracking",
		Description: "Matrix hacking and cybercombat skills for breaking into systems and fighting in the Matrix. These skills are essential for deckers and technomancers who need to exploit security flaws and defend against Matrix threats.",
		Skills:      []string{"Cybercombat", "Electronic Warfare", "Hacking"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"electronics": {
		Name:        "Electronics",
		Description: "Electronic device skills covering computer use, hardware repair, and software programming. These skills are fundamental for interacting with the Matrix and maintaining electronic equipment.",
		Skills:      []string{"Computer", "Hardware", "Software"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"enchanting": {
		Name:        "Enchanting",
		Description: "Magical skills for creating and manipulating enchanted items. These skills allow characters to brew alchemical preparations, craft magical foci, and remove enchantments from items.",
		Skills:      []string{"Alchemy", "Artificing", "Disenchanting"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"engineering": {
		Name:        "Engineering",
		Description: "Mechanical repair skills for various vehicle types. These skills cover the maintenance and repair of aerospace, ground, industrial, and watercraft vehicles.",
		Skills:      []string{"Aeronautics Mechanic", "Automotive Mechanic", "Industrial Mechanic", "Nautical Mechanic"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"firearms": {
		Name:        "Firearms",
		Description: "Ranged weapon skills for firearms. These skills cover automatic weapons, longarms, and pistols, representing proficiency with various types of projectile weapons.",
		Skills:      []string{"Automatics", "Longarms", "Pistols"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"influence": {
		Name:        "Influence",
		Description: "Social manipulation skills for navigating social situations and leading others. These skills allow characters to understand social rituals, lead teams, and negotiate deals effectively.",
		Skills:      []string{"Etiquette", "Leadership", "Negotiation"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"outdoors": {
		Name:        "Outdoors",
		Description: "Wilderness survival skills for navigating and surviving in natural environments. These skills cover navigation, survival techniques, and tracking through various terrains.",
		Skills:      []string{"Navigation", "Survival", "Tracking"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"sorcery": {
		Name:        "Sorcery",
		Description: "Spellcasting skills for channeling mana into magical effects. These skills allow characters to cast spells, perform ritual spellcasting, and defend against magical attacks.",
		Skills:      []string{"Counterspelling", "Ritual Spellcasting", "Spellcasting"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"stealth": {
		Name:        "Stealth",
		Description: "Skills for remaining undetected and hiding objects. These skills allow characters to disguise themselves, palm small objects, and move without being noticed.",
		Skills:      []string{"Disguise", "Palming", "Sneaking"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"tasking": {
		Name:        "Tasking",
		Description: "Technomancer skills for working with sprites in the Matrix. These skills allow technomancers to compile sprites from machine code, decompile them, and register them on the Matrix grids.",
		Skills:      []string{"Compiling", "Decompiling", "Registering"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
}
