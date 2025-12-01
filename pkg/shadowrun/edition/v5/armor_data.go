package v5

/*
CLOTHING
(Synth)Leather 					Armor: 4, 	Capacity: 4, 	Device Raiting: 2, 	Cost: 220-100200
Clothing 						Armor: 0, 	apacity: 0, 	Device Rating: 2, 	Cost: 20-100000
ARMOR
Armor Clothing 					Armor: 6, 	Capacity: 6, 	Device Rating: 2, 	Cost: 450, 	Availability: 2
Armor Jacket					Armor: 10, 	Capacity: 12, 	Device Rating: 2, 	Cost: 1000,	Availability: 2
Armor Vest						Armor: 9, 	Capacity: 9, 	Device Rating: 2, 	Cost: 500, 	Availability: 2
Helmet							Armor: +2, 	Capacity: 6, 	Device Rating: 2, 	Cost: 100, 	Availability: 2
Lined Coat						Armor: 9, 	Capacity: 9, 	Device Rating: 2, 	Cost: 900, 	Availability: 4
Urban Explorer Jumpsuit 		Armor: 9, 	Capacity: 9, 	Device Rating: 2, 	Cost: 650, 	Availability: 8
Urban Explorer Jumpsuit Helmet	Armor: +2, 	Capacity: 6, 	Device Rating: 2, 	Cost: 100, 	Availability: 8
HIGH-FASHION ARMOR CLOTHING
Auctioneer Business Clothes 	Armor: 8, 	Capacity: 8, 	Device Rating: 2, 	Cost: 1500, Availability: 8, Manufacturer: Vashon Island
SPECIALTY ARMOR
Chameleon Suit					Armor: 9, 	Capacity: 9, 	Device Rating: 2, 	Cost: 1700, Availability: 10R
Full Body Armor					Armor: 15, 	Capacity: 15, 	Device Rating: 2, 	Cost: 2000, Availability: 14R
Full Body Armor Helmet			Armor: +3, 	Capacity: 6, 	Device Rating: 2, 	Cost: 500, 	Availability: 14R
SHIELDS
Ballistic Shield				Armor: +6, 	Capacity: 6, 	Device Rating: 2, 	Cost: 1200, Availability: 12R, Accuracy: 4, Damage Ratin: (STR+2)S, Reach: 0, Wearing will make the user Encumbered
Riot Shield						Armor: +6, 	Capacity: 6, 	Device Rating: 2, 	Cost: 1500, Availability: 10R, Accuracy: 4, Damage Raiting: (9S(e)v-5, Reach: 0, Wearing will make the user Encumbered
ENVIRONMENTAL PROTECTION - UNDERWATER
Diving Gear						Armor: 0, 	Capacity: 0, 	Device Rating: 2, 	Cost: 2000, Availability: 6, Resistance To Cold: +1
ENVIRONMENTAL PROTECTION - TOXIC
Chemsuit						Armor: 0, 	Capacity: 0, 	Device Rating: 2, 	Cost: 150*R, Availability: 2*R
Hazmat Suit						Armor: 0, 	Capacity: 0, 	Device Rating: 2, 	Cost: 3000, 	Availability: 8, Ratings: 1-6, Adds Chemical seal protection from contact and inhalation toxin, + Geiger counter, Wireless: Suit analyzes and transmits information about the environment thatn you not touching or breating.
SURVIVAL GEAR
Gas Mask						Armor: 0, 	Capacity: 0, 	Device Rating: 2, 	Cost: 200, 		Availability: 0, Wireless: Gas Mask analyzes and transmits information about the environment thatn you not touching or breating.
Respirator						Armor: 0, 	Capacity: 0, 	Device Rating: 2, 	Cost: R*50, 	Availability: 0, Ratings: 1-6, Wireless: Respirator analyzes and transmits information about the environment you're not touching or breating.
*/

var newDataArmor = map[string]NewArmor{
	"clothing": {
		ID:           "clothing",
		Name:         "Clothing",
		Type:         ArmorTypeClothing,
		Description:  "Clothing in 2075 comes with amazing features you'll likely completely take for granted. Commlinks, music players, and other electronic devices can be woven right into the fabric, powered by interwoven batteries or special energy-gathering fabrics. On the other side of the economy, cheap soy-based \"flats\" can be had for five nuyen per article of clothing from vending machines around the Sprawl. The more money you spend on your threads, the more impressive you look.",
		ArmorRating:  "0",
		Availability: "0",
		Cost:         "20-100,000",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "436",
		},
	},
	"electrochromic_modification": {
		ID:             "electrochromic_modification",
		Name:           "Electrochromic modification",
		Type:           ArmorTypeModification,
		Description:    "Electrochromic threads can change color with voltage, letting you alter the color of your clothing or display text, images, or patterns. This is good for fashion, but great for vanishing into a crowd if you need a quick costume change. You can even get armored clothing in electrochromic styles. It takes a Simple Action to change the settings on your electrochromic clothes, but a couple of Combat Turns to complete the change.",
		ArmorRating:    "0",
		Availability:   "+2",
		Cost:           "+500",
		CompatibleWith: []ArmorType{ArmorTypeClothing, ArmorTypeArmor, ArmorTypeHelmet, ArmorTypeShield},
		ModificationEffects: []ModificationEffect{
			{
				ActionType:      ActionTypeComplex,
				ColorChangeable: true,
				WirelessAction: &WirelessAction{
					ActionType: ActionTypeSimple,
					// ActionTime:  &time.Duration(2 * time.CombatTurn),
					Description: "It takes a Simple Action to change the settings on your electrochromic clothes, but a couple of Combat Turns to complete the change.",
				},
			},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "437",
		},
	},
}

var newDataArmorModification = map[string]NewArmorModification{
	"electrochromic_modification": {
		ID:             "electrochromic_modification",
		Name:           "Electrochromic modification",
		Description:    "Electrochromic threads can change color with voltage, letting you alter the color of your clothing or display text, images, or patterns. This is good for fashion, but great for vanishing into a crowd if you need a quick costume change. You can even get armored clothing in electrochromic styles. It takes a Simple Action to change the settings on your electrochromic clothes, but a couple of Combat Turns to complete the change.",
		Availability:   "+2",
		Cost:           "+500",
		CompatibleWith: []ArmorType{ArmorTypeClothing, ArmorTypeArmor, ArmorTypeHelmet, ArmorTypeShield},
		ModificationEffects: []ModificationEffect{
			{
				ActionType:      ActionTypeComplex,
				ColorChangeable: true,
				WirelessAction: &WirelessAction{
					ActionType: ActionTypeSimple,
					// ActionTime:  &time.Duration(2 * time.CombatTurn),
					Description: "It takes a Simple Action to change the settings on your electrochromic clothes, but a couple of Combat Turns to complete the change.",
				},
			},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "437",
		},
	},
	"feedback_clothing": {
		ID:           "feedback_clothing",
		Name:         "Feedback clothing",
		Description:  "This haptic clothing allows for a tactile component to an augmented reality experience.",
		Availability: "8",
		Cost:         "+500",
	},
	"synth_leather": {
		ID:           "synth_leather",
		Name:         "Synth leather",
		Description:  "This is a type of leather that is made from synthetic materials. It is often used in clothing and other items.",
		Availability: "8",
		Cost:         "+500",
	},
}

// dataArmor contains all armor definitions organized by category
var dataArmor = map[string]Armor{
	// CLOTHING
	"clothing": {
		Name:        "Clothing",
		Type:        ArmorTypeClothing,
		Description: "Clothing in 2075 comes with amazing features you'll likely completely take for granted. Commlinks, music players, and other electronic devices can be woven right into the fabric, powered by interwoven batteries or special energy-gathering fabrics. On the other side of the economy, cheap soy-based \"flats\" can be had for five nuyen per article of clothing from vending machines around the Sprawl. The more money you spend on your threads, the more impressive you look.",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"electrochromic_clothing": {
		Name:        "Electrochromic clothing",
		Type:        ArmorTypeModification,
		Description: "Electrochromic threads can change color with voltage, letting you alter the color of your clothing or display text, images, or patterns. This is good for fashion, but great for vanishing into a crowd if you need a quick costume change. You can even get armored clothing in electrochromic styles. It takes a Simple Action to change the settings on your electrochromic clothes, but a couple of Combat Turns to complete the change.",
		SpecialProperties: &ArmorSpecialProperty{
			ColorChangeable: true,
			// ActionChange:    ActionTypeSimple,
		},
		WirelessBonus: &WirelessBonus{
			ActionChange: ActionTypeFree,
			Description:  "Changing your clothes' settings is a Free Action, and while it's not good enough to be camouflage, it can display images, text files, or flat video from your commlink.",
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"feedback_clothing": {
		Name:        "Feedback clothing",
		Type:        ArmorTypeModification,
		Description: "This haptic clothing allows for a tactile component to an augmented reality experience.",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"leather_jacket_duster": {
		Name:        "Leather jacket/duster",
		Type:        ArmorTypeModification,
		Description: "Usually made of synthleather unless you've got mad nuyen, this type of jacket (waist-length to duster) never goes out of style and even offers a modicum of protection. Just don't expect it to stop bullets.",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	// ARMOR
	"actioneer_business_clothes": {
		Name:        "Actioneer Business Clothes",
		Type:        ArmorTypeArmor,
		Description: "A discreetly armored \"power suit\" is a popular choice among Mr. Johnsons, faces, and fixers looking for a little high-class protection coupled with style. It features a concealable holster (Firearm Accessories, p. 431) in the jacket.",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"armor_clothing": {
		Name:         "Armor clothing",
		Type:         ArmorTypeArmor,
		ArmorRating:  "6",
		Capacity:     "6",
		Availability: "2",
		Cost:         "450",
		Description:  "Lightweight ballistic fiber weave makes these garments almost impossible to detect as armor. It doesn't provide as much protection as real armor, but it's available in a wide variety of styles.",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"armor_jacket": {
		Name:        "Armor jacket",
		Type:        ArmorTypeArmor,
		Description: "The most popular armor solution on the streets comes in all styles imaginable. It offers good protection without catching too much attention. But don't think of wearing one to a dinner party.",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"armor_vest": {
		Name:        "Armor vest",
		Type:        ArmorTypeArmor,
		Description: "This modern flexible-wrap vest is designed to be worn under regular clothing without displaying any bulk. A popular and cost-effective option.",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"chameleon_suit": {
		Name:        "Chameleon suit",
		Type:        ArmorTypeArmor,
		Description: "This full-body suit has a smart ruthenium polymer coating supported by a sensor suite; the technology allows it to scan its surroundings and replicate the images at the proper perspectives. Add 2 to your limit when you make Sneaking tests to hide. A chameleon suit is also armored for the wearer's protection.",
		SpecialProperties: &ArmorSpecialProperty{
			SneakingBonus: 2,
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 2,
			Description:   "The suit uses the extra information about your surroundings and also gives you a +2 dice pool bonus to Sneaking Tests for hiding.",
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"full_body_armor": {
		Name:        "Full body armor",
		Type:        ArmorTypeArmor,
		Description: "Impossible to conceal, this armor is worn by military and security personnel around the world for heavy ops duty. It is styled for intimidation as well as ease of movement, with a full array of tactical holsters, pouches, and webbing, and is certain to draw attention. The suit can be modified for environmental adaptation (hot or cold environments) or chemically sealed to completely protect the wearer from toxic environments and attacks. The suit's helmet has a Capacity of 6 for the purpose of being equipped with vision or audio enhancements.",
		SpecialProperties: &ArmorSpecialProperty{
			EnvironmentalAdaptation: true,
			ChemicallySealable:      true,
			Capacity:                6, // for helmet
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"lined_coat": {
		Name:        "Lined coat",
		Type:        ArmorTypeArmor,
		Description: "This Wild West style duster has been consistently popular on the mean streets of the world's sprawls for the past thirty years. Besides its protective traits, the armored trenchcoat provides an additional –2 Concealability modifier to items hidden underneath.",
		SpecialProperties: &ArmorSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"urban_explorer_jumpsuit": {
		Name:        "Urban Explorer Jumpsuit",
		Type:        ArmorTypeArmor,
		Description: "Designed for couriers, athletes, and freerunners, these colorful jumpsuits are well ventilated and breathable but surprisingly protective with lightweight densiplast and liquid reactive armor. Urban explorer jumpsuits feature a built-in music player and biomonitor.",
		SpecialProperties: &ArmorSpecialProperty{
			BuiltInFeatures: []string{"music player", "biomonitor"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	// ARMOR MODIFICATIONS
	"chemical_protection": {
		Name:        "Chemical protection",
		Type:        ArmorTypeModification,
		Description: "Water-resistant, non-porous, impermeable materials, and a coating of neutralizing agents protect the wearer against contact-vector chemical attacks (Toxins, Drugs and BTLs, p. 408). Add the rating of the Chemical Protection modification to tests made to resist contact-vector toxin attacks.",
		MaxRating:   6,
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:                "Chemical",
				ResistanceTestBonus: 0, // Rating-based, handled dynamically
				TestType:            "contact-vector toxin attacks",
			},
		},
		CompatibleWith: []string{"any piece of worn armor"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"chemical_seal": {
		Name:        "Chemical seal",
		Type:        ArmorTypeModification,
		Description: "Available only to full body armor that includes a helmet, the chemical seal is an airtight environmental control that takes a Complex Action to activate (if you're already wearing the armor, natch). It provides complete protection against contact and inhalation vector chemicals, but can only be used for a total of an hour (the limit of the air supply) at a time.",
		Requires:    "full body armor that includes a helmet",
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:               "Chemical",
				CompleteProtection: true,
				DurationLimit:      "1 hour",
				ActivationAction:   ActionTypeComplex,
			},
		},
		WirelessBonus: &WirelessBonus{
			ActionChange: "Free Action instead of Complex Action",
			Description:  "Activating the chemical seal is a Free Action.",
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"fire_resistance": {
		Name:        "Fire resistance",
		Type:        ArmorTypeModification,
		Description: "Fire-retardant, nonflammable materials protect the wearer against Fire damage (p. 171). Add the full rating of the Fire Resistance modification to the Armor value when resisting Fire attacks or checking if the armor catches fire.",
		MaxRating:   6,
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:       "Fire",
				ArmorBonus: 0, // Rating-based, handled dynamically
			},
		},
		CompatibleWith: []string{"any piece of worn armor", "shields"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"insulation": {
		Name:        "Insulation",
		Type:        ArmorTypeModification,
		Description: "Thermal fibers and heat-retentive materials protect the wearer against Cold damage (p. 170). Add the full rating of the Insulation modification to the Armor value when resisting Cold attacks.",
		MaxRating:   6,
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:       "Cold",
				ArmorBonus: 0, // Rating-based, handled dynamically
			},
		},
		CompatibleWith: []string{"any piece of worn armor"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"nonconductivity": {
		Name:        "Nonconductivity",
		Type:        ArmorTypeModification,
		Description: "Electrical insulation and non-conductive materials protect the wearer against Electricity damage (p. 170). Add the full rating of this modification to the Armor value when resisting Electricity attacks.",
		MaxRating:   6,
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:       "Electricity",
				ArmorBonus: 0, // Rating-based, handled dynamically
			},
		},
		CompatibleWith: []string{"any piece of worn armor", "shields"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"shock_frills": {
		Name:        "Shock frills",
		Type:        ArmorTypeModification,
		Description: "These strips of \"fur\" are electrically charged when activated, standing on end and inflicting Electricity damage to anyone that touches you. Use Unarmed Combat to attack with the frills. The frills hold 10 charges; when attached to a power point, they recharge one charge per 10 seconds.",
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:       "Electricity",
				DamageInfo: "Electricity damage",
				Charges:    "10 charges, recharges one charge per 10 seconds at power point",
			},
		},
		WirelessBonus: &WirelessBonus{
			ActionChange: "activation/deactivation is a Free Action",
			Description:  "The shock frills can be activated or deactivated as a Free Action. They can also recharge by induction, recharging one charge per hour.",
		},
		CompatibleWith: []string{"any piece of worn armor"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"thermal_damping": {
		Name:        "Thermal damping",
		Type:        ArmorTypeModification,
		Description: "Designed to reduce your thermal signature, these inner layers capture or bleed heat, so the outer layers maintain a surface temperature equal to the surrounding air. Add the rating to your limit on any Sneaking test against thermographic vision or thermal sensors.",
		MaxRating:   6,
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:       "Thermal",
				LimitBonus: 0, // Rating-based, handled dynamically
				TestType:   "Sneaking test against thermographic vision or thermal sensors",
			},
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 0, // Rating-based, handled dynamically
			Description:   "The suit uses the extra information about your surroundings and also gives you its rating as a dice pool bonus to Sneaking tests against heat-based detection.",
		},
		CompatibleWith: []string{"any piece of worn armor"},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	// HELMETS
	"helmet": {
		Name:        "Helmet",
		Type:        ArmorTypeHelmet,
		Description: "Helmets come in a wide variety of shapes and sizes and protect your noggin from trauma. Helmets have Capacity 6 for being tricked out with accessories like trode nets and vision enhancements.",
		Capacity:    6,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	// SHIELDS
	"ballistic_shield": {
		Name:        "Ballistic shield",
		Type:        ArmorTypeShield,
		Description: "This large opaque shield is used by SWAT teams and in urban combat. It features a clear plastic window and a built-in ladder frame along the inside so that it can be used to climb over small obstacles.",
		SpecialProperties: &ArmorSpecialProperty{
			PhysicalLimitModifier: -1,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
	"riot_shield": {
		Name:        "Riot shield",
		Type:        ArmorTypeShield,
		Description: "As an added crowd control measure, a riot shield can be used to shock anyone who comes into contact with it, inflicting Electricity damage (p. 170). The taser shield holds 10 charges; when attached to a power point, it regains one charge per 10 seconds.",
		SpecialProperties: &ArmorSpecialProperty{
			PhysicalLimitModifier: -1,
		},
		ModificationEffects: []ArmorModificationEffect{
			{
				Type:       "Electricity",
				DamageInfo: "Electricity damage",
				Charges:    "10 charges, regains one charge per 10 seconds at power point",
			},
		},
		WirelessBonus: &WirelessBonus{
			Description: "The riot shield recharges by induction, recharging one charge per hour.",
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "",
		},
	},
}
