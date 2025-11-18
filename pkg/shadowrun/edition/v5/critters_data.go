package v5

// DataCritterCategories contains critter categories keyed by their ID (lowercase with underscores)
var DataCritterCategories = map[string]CritterCategory{
	"ais": {
		Name: "A.I.s",
	},
	"dracoforms": {
		Name: "Dracoforms",
	},
	"entropic_sprites": {
		Name: "Entropic Sprites",
	},
	"fey": {
		Name: "Fey",
	},
	"ghosts_and_haunts": {
		Name: "Ghosts and Haunts",
	},
	"harbingers": {
		Name: "Harbingers",
	},
	"imps": {
		Name: "Imps",
	},
	"infected": {
		Name: "Infected",
	},
	"insect_spirits": {
		Name: "Insect Spirits",
	},
	"mundane_critters": {
		Name: "Mundane Critters",
	},
	"mutant_critters": {
		Name: "Mutant Critters",
	},
	"paranormal_critters": {
		Name: "Paranormal Critters",
	},
	"primordial_spirits": {
		Name: "Primordial Spirits",
	},
	"protosapients": {
		Name: "Protosapients",
	},
	"ritual": {
		Name: "Ritual",
	},
	"shadow_spirits": {
		Name: "Shadow Spirits",
	},
	"shedim": {
		Name: "Shedim",
	},
	"spirits": {
		Name: "Spirits",
	},
	"sprites": {
		Name: "Sprites",
	},
	"technocritters": {
		Name: "Technocritters",
	},
	"toxic_critters": {
		Name: "Toxic Critters",
	},
	"toxic_spirits": {
		Name: "Toxic Spirits",
	},
	"warforms": {
		Name: "Warforms",
	},
	"extraplanar_travelers": {
		Name: "Extraplanar Travelers",
	},
	"necro_spirits": {
		Name: "Necro Spirits",
	},
}

// DataCritters contains critter records keyed by their ID (lowercase with underscores)
var DataCritters = map[string]Critter{}
