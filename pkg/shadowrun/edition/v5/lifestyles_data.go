package v5

// dataLifestyles contains all lifestyle definitions
var dataLifestyles = map[string]Lifestyle{
	"luxury": {
		Name:        "Luxury",
		Description: "This lifestyle offers the best of everything: ritzy digs, lots of high-tech toys, the best food and drink, you name it. The character has a household staff, maid service, or sophisticated drones to do the chores. She gets by in her massive mansion, snazzy condo, or the penthouse suite in a top hotel. Home security is top-of-the-line, with well-trained guards, astral security, and quick response times. Her home entertainment system is better than that in public theaters and accessible from anywhere in the home. She's on the VIP list at several exclusive restaurants and clubs, both real and virtual. This is the life for the high-stakes winners in the world of Shadowrun: high-level executives, government big shots, Yakuza bigwigs, and the few shadowrunners who pull off the big scores (and live to spend their pay).",
		Cost:        "100,000 nuyen a month and up!",
		Source: &SourceReference{Source: "SR5"},
	},
	"high": {
		Name:        "High",
		Description: "A High lifestyle offers a roomy house or condo, good food, and the technology that makes life easy. The character may not have the same perks as the really big boys, but neither does she have as many people gunning for her. Her home is in a secure zone or protected by good, solid bribes to the local police contractor and gang boss. She has a housekeeping service or enough tech to take care of most chores. This is the life for the well-to-do on either side of the law: mid-level managers, senior Mob bosses, and the like.",
		Cost:        "10,000 nuyen a month",
		Source: &SourceReference{Source: "SR5"},
	},
	"middle": {
		Name:        "Middle",
		Description: "The Middle lifestyle offers a nice house or condo with lots of comforts. Characters with this lifestyle sometimes eat nutrisoy as well as higher-priced natural food, but at least the autocook has a full suite of flavor faucets. This is the lifestyle of ordinary wage-earners or reasonably successful criminals.",
		Cost:        "5,000 nuyen a month",
		Source: &SourceReference{Source: "SR5"},
	},
	"low": {
		Name:        "Low",
		Description: "With this lifestyle, the character has an apartment, and nobody is likely to bother her much as long as she keeps the door bolted. She can count on regular meals; the nutrisoy may not taste great, but at least it's hot. Power and water are available during assigned rationing periods. Security depends on how regular the payments to the local street gang are. Factory workers, petty crooks, and other folks stuck in a rut, just starting out, or down on their luck tend to have Low lifestyles.",
		Cost:        "2,000 nuyen a month",
		Source: &SourceReference{Source: "SR5"},
	},
	"squatter": {
		Name:        "Squatter",
		Description: "Life stinks for the squatter, and most of the time so does the character. She eats low-grade nutrisoy and yeast, adding flavors with an eyedropper. Her home is a squatted building, perhaps fixed up a bit, possibly even converted into barracks or divided into closet-sized rooms and shared with other squatters. Or maybe she just rents a coffin-sized sleep tank by the night. The only thing worse than the Squatter lifestyle is living on the streets.",
		Cost:        "500 nuyen a month",
		Source: &SourceReference{Source: "SR5"},
	},
	"streets": {
		Name:        "Streets",
		Description: "The character lives on the streets—or in the sewers, steam tunnels, condemned buildings, or whatever temporary flop she can get. Food is wherever the character finds it, bathing is a thing of the past, and the character's only security is what she creates for herself. This lifestyle is the bottom of the ladder, inhabited by down-and-outers of all stripes.",
		Cost:        "Hey pal, life ain't all bad. It's free.",
		Source: &SourceReference{Source: "SR5"},
	},
	"hospitalized": {
		Name:        "Hospitalized",
		Description: "This special lifestyle applies only when a character is sick or injured. The character is confined to a hospital: a real one, a clinic equipped as a hospital, or a private location with the necessary equipment. Characters cannot own this lifestyle. They only pay for it until they get well or go broke, whichever comes first.",
		Cost:        "500 nuyen a day for basic care, 1,000 nuyen a day for intensive care.",
		Source: &SourceReference{Source: "SR5"},
	},
}

// dataLifestyleOptions contains all lifestyle option definitions
var dataLifestyleOptions = map[string]LifestyleOption{
	"special_work_area": {
		Name:        "Special Work Area",
		Description: "The place has a workshop, garage, office, studio, or other kind of large area that can hold a specialized work space of some kind. Specialized equipment can be set up \"just the way you like it\" so tasks can be accomplished quickly and easily. Skill checks relevant to the setting have their Limit increased by 2 when performed in this space.",
		Cost:        "+1,000 nuyen a month",
		Source: &SourceReference{Source: "SR5"},
	},
	"extra_secure": {
		Name:        "Extra Secure",
		Description: "Security where you live is particularly tight. The neighborhood may be surrounded by a wall, guarded by vigilant security contractors, patrolled by an altruistic gang, or near some particularly powerful individual that no one wants to mess with. Whatever the case, the security of the living space is above average for the area. All High Threat Response (see p. 356) and other security response rolls are made at one level better than the area would normally be.",
		Cost:        "+20 percent of the lifestyle",
		Source: &SourceReference{Source: "SR5"},
	},
	"obscure_difficult_to_find": {
		Name:        "Obscure/Difficult to Find",
		Description: "You live where? The corner of what and what? Your place is particularly difficult to find or in an obscure, not-well-known area of the city. Everyone needs directions, or a good map, to find your place and even then they often get lost. You've given up on the pizza delivery guy, you just meet him at the nearest intersection. Any Sneaking Skill checks (owner of the property excluded) made in the vicinity of the residence are made with a –2 penalty.",
		Cost:        "+10 percent of the lifestyle",
		Source: &SourceReference{Source: "SR5"},
	},
	"cramped": {
		Name:        "Cramped",
		Description: "It's not small, it's just cozy—or at least that's what the landlord said. There is just enough space in your place to live, and not do a whole lot else. Forget doing any hobbies or work, or even stretching your legs when you sit down—there just isn't the room. Any Skill checks tied to Logic have their Limit reduced by 2 (to a minimum of 1) when performed in this space.",
		Cost:        "–10 percent of the lifestyle",
		Source: &SourceReference{Source: "SR5"},
	},
	"dangerous_area": {
		Name:        "Dangerous Area",
		Description: "Isn't that where a guy got shot yesterday? The area you live in is particularly dangerous and prone to crime, including violence. Security and law enforcement are overwhelmed in the area, so will only respond to the most desperate need and will often be slower to respond. People in the area generally look out for themselves. Hey, at least your rent is cheaper, just don't keep any fancy stuff in your place. Any High Threat Response (see p. 356) or other similar security response rolls are made as if this area were one level lower than it actually is.",
		Cost:        "–20 percent of lifestyle",
		Source: &SourceReference{Source: "SR5"},
	},
}
