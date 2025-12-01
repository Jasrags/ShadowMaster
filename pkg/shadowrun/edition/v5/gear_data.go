package v5

// dataGear contains all gear definitions organized by category
var dataGear = map[string]Gear{
	// ELECTRONICS - COMMLINKS
	"meta_link": {
		Name:         "Meta Link",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "Commlinks are universal communication devices; they're used by everyone all the time. Commlinks are essentially the digital Swiss army knives of the modern world. Even the most basic of them includes AR Matrix browsing capability, multiple telephone and radio modes of real-time talk and text, music players, micro trid-projectors, touch-screen displays, built in high-resolution digital video and still image cameras, image/text and RFID tag scanners, built-in GPS guidance systems, chip players, credstick readers, retractable earbuds, voice-access dialing, text-to-speech and speech-to-text technologies, and a shock and water resistant case. And all of this at an inexpensive price that a few decades ago would have seemed absurd.",
		Rating:       1,
		Availability: "2",
		Cost:         100,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"sony_emperor": {
		Name:         "Sony Emperor",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "Commlinks are universal communication devices; they're used by everyone all the time. Commlinks are essentially the digital Swiss army knives of the modern world. Even the most basic of them includes AR Matrix browsing capability, multiple telephone and radio modes of real-time talk and text, music players, micro trid-projectors, touch-screen displays, built in high-resolution digital video and still image cameras, image/text and RFID tag scanners, built-in GPS guidance systems, chip players, credstick readers, retractable earbuds, voice-access dialing, text-to-speech and speech-to-text technologies, and a shock and water resistant case. And all of this at an inexpensive price that a few decades ago would have seemed absurd.",
		Rating:       2,
		Availability: "4",
		Cost:         700,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"renraku_sensei": {
		Name:         "Renraku Sensei",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "Commlinks are universal communication devices; they're used by everyone all the time. Commlinks are essentially the digital Swiss army knives of the modern world. Even the most basic of them includes AR Matrix browsing capability, multiple telephone and radio modes of real-time talk and text, music players, micro trid-projectors, touch-screen displays, built in high-resolution digital video and still image cameras, image/text and RFID tag scanners, built-in GPS guidance systems, chip players, credstick readers, retractable earbuds, voice-access dialing, text-to-speech and speech-to-text technologies, and a shock and water resistant case. And all of this at an inexpensive price that a few decades ago would have seemed absurd.",
		Rating:       3,
		Availability: "6",
		Cost:         1000,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"erika_elite": {
		Name:         "Erika Elite",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "Commlinks are universal communication devices; they're used by everyone all the time. Commlinks are essentially the digital Swiss army knives of the modern world. Even the most basic of them includes AR Matrix browsing capability, multiple telephone and radio modes of real-time talk and text, music players, micro trid-projectors, touch-screen displays, built in high-resolution digital video and still image cameras, image/text and RFID tag scanners, built-in GPS guidance systems, chip players, credstick readers, retractable earbuds, voice-access dialing, text-to-speech and speech-to-text technologies, and a shock and water resistant case. And all of this at an inexpensive price that a few decades ago would have seemed absurd.",
		Rating:       4,
		Availability: "8",
		Cost:         2500,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"hermes_ikon": {
		Name:         "Hermes Ikon",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "Commlinks are universal communication devices; they're used by everyone all the time. Commlinks are essentially the digital Swiss army knives of the modern world. Even the most basic of them includes AR Matrix browsing capability, multiple telephone and radio modes of real-time talk and text, music players, micro trid-projectors, touch-screen displays, built in high-resolution digital video and still image cameras, image/text and RFID tag scanners, built-in GPS guidance systems, chip players, credstick readers, retractable earbuds, voice-access dialing, text-to-speech and speech-to-text technologies, and a shock and water resistant case. And all of this at an inexpensive price that a few decades ago would have seemed absurd.",
		Rating:       5,
		Availability: "10",
		Cost:         3000,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"transys_avalon": {
		Name:         "Transys Avalon",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "Commlinks are universal communication devices; they're used by everyone all the time. Commlinks are essentially the digital Swiss army knives of the modern world. Even the most basic of them includes AR Matrix browsing capability, multiple telephone and radio modes of real-time talk and text, music players, micro trid-projectors, touch-screen displays, built in high-resolution digital video and still image cameras, image/text and RFID tag scanners, built-in GPS guidance systems, chip players, credstick readers, retractable earbuds, voice-access dialing, text-to-speech and speech-to-text technologies, and a shock and water resistant case. And all of this at an inexpensive price that a few decades ago would have seemed absurd.",
		Rating:       6,
		Availability: "12",
		Cost:         5000,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"fairlight_caliban": {
		Name:         "Fairlight Caliban",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "Commlinks are universal communication devices; they're used by everyone all the time. Commlinks are essentially the digital Swiss army knives of the modern world. Even the most basic of them includes AR Matrix browsing capability, multiple telephone and radio modes of real-time talk and text, music players, micro trid-projectors, touch-screen displays, built in high-resolution digital video and still image cameras, image/text and RFID tag scanners, built-in GPS guidance systems, chip players, credstick readers, retractable earbuds, voice-access dialing, text-to-speech and speech-to-text technologies, and a shock and water resistant case. And all of this at an inexpensive price that a few decades ago would have seemed absurd.",
		Rating:       7,
		Availability: "14",
		Cost:         8000,
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"sim_module": {
		Name:        "Sim Module",
		Category:    GearCategoryElectronics,
		Subcategory: "Commlinks",
		Description: "This commlink upgrade gives you the simsense experience, translating computer data into neural signals that allow you to directly experience simsense programs and augmented reality. A sim module must be accessed via a direct neural interface (trodes, datajack, or implanted commlink). Sim modules are a must-have for virtual reality of sorts, including VR clubs, VR games, simsense, and darker virtual pleasures. Sim modules can be modified for hot-sim, which opens up the full (and dangerous) range of VR experiences.",
		Cost:        100,
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"direct neural interface (trodes, datajack, or implanted commlink)"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"sim_module_hot_sim": {
		Name:         "Sim Module w/ Hot-Sim",
		Category:     GearCategoryElectronics,
		Subcategory:  "Commlinks",
		Description:  "This commlink upgrade gives you the simsense experience, translating computer data into neural signals that allow you to directly experience simsense programs and augmented reality. A sim module must be accessed via a direct neural interface (trodes, datajack, or implanted commlink). Sim modules are a must-have for virtual reality of sorts, including VR clubs, VR games, simsense, and darker virtual pleasures. This version includes hot-sim modification, which opens up the full (and dangerous) range of VR experiences.",
		Availability: "4F",
		Cost:         250,
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"direct neural interface (trodes, datajack, or implanted commlink)"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"erika_mcd_1": {
		Name:         "Erika MCD-1",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeSimple,
		DeviceRating: 1,
		Rating:       1,
		Availability: "3R",
		Cost:         49500,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"microdeck_summit": {
		Name:         "Microdeck Summit",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeSimple,
		DeviceRating: 1,
		Rating:       1,
		Availability: "3R",
		Cost:         58000,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"microtronica_azteca_200": {
		Name:         "Microtrónica Azteca 200",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeAverage,
		DeviceRating: 2,
		Rating:       2,
		Availability: "6R",
		Cost:         110250,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"hermes_chariot": {
		Name:         "Hermes Chariot",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeAverage,
		DeviceRating: 2,
		Rating:       2,
		Availability: "6R",
		Cost:         123000,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"novatech_navigator": {
		Name:         "Novatech Navigator",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeSmart,
		DeviceRating: 3,
		Rating:       3,
		Availability: "9R",
		Cost:         205750,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"renraku_tsurugi": {
		Name:         "Renraku Tsurugi",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeSmart,
		DeviceRating: 3,
		Rating:       3,
		Availability: "9R",
		Cost:         214125,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"sony_ciy_720": {
		Name:         "Sony CIY-720",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeAdvanced,
		DeviceRating: 4,
		Rating:       4,
		Availability: "12R",
		Cost:         345000,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"shiawase_cyber_5": {
		Name:         "Shiawase Cyber-5",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeCuttingEdge,
		DeviceRating: 5,
		Rating:       5,
		Availability: "15R",
		Cost:         549375,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"fairlight_excalibur": {
		Name:         "Fairlight Excalibur",
		Category:     GearCategoryElectronics,
		Subcategory:  "Cyberdecks",
		Description:  "If you were a decker and someone swung a monofilament claymore at you, you'd protect your cyberdeck with your body, and not the other way around. This isn't just because the things are fraggin' expensive—cyberdecks (or decks) are a decker's life's blood, an all-in-one ticket to hacking the planet. The most common form of a deck is a smooth, flat, elongated rectangle, slim with plenty of display space for touch controls, although they can take many forms. For more information about them, see Cyberdecks, p. 227. All cyberdecks include illegal hot-sim modules right out of the box.",
		DeviceType:   DeviceTypeBleedingEdge,
		DeviceRating: 6,
		Rating:       6,
		Availability: "18R",
		Cost:         823250,
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	// ELECTRONICS ACCESSORIES
	"ar_gloves": {
		Name:        "AR Gloves",
		Category:    GearCategoryElectronics,
		Subcategory: "Electronics Accessories",
		Description: "Available in numerous styles, AR gloves allow you to manually interact with the Matrix in Augmented Reality mode, letting you \"touch\" and \"hold\" virtual AROs and receiving tactile force-feedback. AR Gloves can provide the exact weight, temperature, and hardness of touched or held objects, and more at the gamemaster's discretion.",
		Rating:      3,
		Cost:        150,
		SpecialProperties: &GearSpecialProperty{
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"biometric_reader": {
		Name:         "Biometric reader",
		Category:     GearCategoryElectronics,
		Subcategory:  "Electronics Accessories",
		Description:  "Sometimes someone online likes to know it's really you. This handheld device can be used for fingerprints, retina scans, voice patterns, tongue prints—pretty much anything but a DNA scan. You can use it to lock your electronics so only you (or one of your body parts) can unlock it.",
		Rating:       3,
		Availability: "4",
		Cost:         200,
		SpecialProperties: &GearSpecialProperty{
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"electronic_paper": {
		Name:        "Electronic paper",
		Category:    GearCategoryElectronics,
		Subcategory: "Electronics Accessories",
		Description: "This electronic sheet is anywhere from post-it note to poster sized, and it can be folded or rolled up. It digitally displays images, text, data, or video and can act as a touchscreen. Electronic paper is wireless and can be written on or erased wirelessly. Sometimes hacker gangs cover the surfaces of buildings in electronic paper so they are constantly changing and overwritten with graffiti that can be seen even by people with their AR image-links turned off.",
		Rating:      1,
		Cost:        5,
		SpecialProperties: &GearSpecialProperty{
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"printer": {
		Name:        "Printer",
		Category:    GearCategoryElectronics,
		Subcategory: "Electronics Accessories",
		Description: "In case you need something in hardcopy (perhaps if Mr. Johnson hired you through a time portal), this full-color printer comes attached to a paper supply.",
		Rating:      3,
		Cost:        25,
		SpecialProperties: &GearSpecialProperty{
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"satellite_link": {
		Name:         "Satellite link",
		Category:     GearCategoryElectronics,
		Subcategory:  "Electronics Accessories",
		Description:  "This allows the user to uplink to communication satellites in low-Earth orbit, connecting to the Matrix from places where no local wireless networks exist (which is rare but unfortunately extant). This link limits Noise due to distance to –5. Includes a portable satellite dish.",
		Rating:       4,
		Availability: "6",
		Cost:         500,
		MechanicalEffects: &GearMechanicalEffect{
			NoiseReduction: 5,
		},
		SpecialProperties: &GearSpecialProperty{
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"simrig": {
		Name:         "Simrig",
		Category:     GearCategoryElectronics,
		Subcategory:  "Electronics Accessories",
		Description:  "This simsense recorder can record experience data (sensory and emotive) from you or whoever is wearing it. Simrig rigs are used to make most of the simsense chips sold on the market. You'll need to have a working sim module (with the DNI interface) to make a recording.",
		Rating:       3,
		Availability: "12",
		Cost:         1000,
		SpecialProperties: &GearSpecialProperty{
			Requires:       []string{"sim module (with the DNI interface)"},
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"subvocal_microphone": {
		Name:         "Subvocal mic",
		Category:     GearCategoryElectronics,
		Subcategory:  "Electronics Accessories",
		Description:  "The next best thing to telepathy is the ability to stage-whisper at any range. Attached with adhesive to your throat, this hard-to-spot microphone lets you communicate via subvocalized speech. A –4 dice pool modifier is applied to Perception Tests to overhear you when you're subvocalizing.",
		Rating:       3,
		Availability: "4",
		Cost:         50,
		MechanicalEffects: &GearMechanicalEffect{
			PerceptionPenalty: -4,
			TestType:          "Perception",
		},
		SpecialProperties: &GearSpecialProperty{
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"trid_projector": {
		Name:        "Trid projector",
		Category:    GearCategoryElectronics,
		Subcategory: "Electronics Accessories",
		Description: "This device projects a trideo hologram into a five-meter cube right next to or above the device. The hologram can be quite realistic, but unless you're really artistic about it, it's pretty obvious that it's just trid.",
		Rating:      3,
		Cost:        200,
		MechanicalEffects: &GearMechanicalEffect{
			Range: "5-meter cube",
		},
		SpecialProperties: &GearSpecialProperty{
			CompatibleWith: []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	"trodes": {
		Name:        "Trodes",
		Category:    GearCategoryElectronics,
		Subcategory: "Electronics Accessories",
		Description: "Available as a headband, net, or full-on cap, this electrode-and-ultrasound net gives you a direct neural interface. Useful if you're too squeamish to get a hole drilled in your head for a datajack. Adding this to headgear takes two slots of Capacity.",
		Rating:      3,
		Cost:        70,
		SpecialProperties: &GearSpecialProperty{
			RequiresCapacity: 2,
			CompatibleWith:   []string{"commlinks", "cyberdecks", "other electronic devices"},
		},
		Source: &SourceReference{
			Source: "SR5",
			Page:   "439",
		},
	},
	// RFID TAGS
	"rfid_tag": {
		Name:        "RFID tag",
		Category:    GearCategoryRFIDTags,
		Subcategory: "RFID Tags",
		Description: "These tiny computers (named after old-fashioned radio frequency identification tags) form an integral part of every product commercially available in the Sixth World. Ranging in size from microscopic to slightly larger than a price tag, RFID tags have a stick-to-anything adhesive backing and can be tricky to spot. Tags are used for geo-tagging locations and objects, leaving a virtual AR message for anyone who comes by, employee tracking, access control, owner-contact information for everything from vehicles to pets, vehicle and weapon registration, and so on. They can also be used as tracking devices, periodically transmitting GPS data to the Matrix. RFID tags are devices (p. 234) that can hold one or more files, but not much else. The physical location of a tag can be found via the Matrix (Trace Icon, p. 243). Tag data can be erased with a tag eraser (p. 441) or programmed with an Edit File action (p. 239). RFID tags have owners like all other devices, but unlike other devices a tag's owner can be changed to \"nobody.\"",
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -6,
			CanChangeOwner:         true,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"datachip": {
		Name:        "Datachip",
		Category:    GearCategoryRFIDTags,
		Subcategory: "RFID Tags",
		Description: "For occasions when you want to transfer data by physical means—like bringing the project specs on the competition's new cyberdeck to Mr. Johnson in person at the meet—a datachip can hold enormous quantities of data in a small finger-sized chip, accessible by any electronic device. Datachips have no wireless capability, so you need to plug them into a universal data connector (found on any device) if you want to read or write to them.",
		SpecialProperties: &GearSpecialProperty{
			NoWirelessCapability: true,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"security_tag": {
		Name:        "Security tags",
		Category:    GearCategoryRFIDTags,
		Subcategory: "RFID Tags",
		Description: "Security-conscious megacorps often implant these security tags in their sararimen and valued citizens, either to monitor employee workplace productivity, grant and deny clearance and security access, or track employees in the case of abduction or extraction (or escape). These same tags are used on incarcerated and paroled criminals, and parents and schools also use them to track students. Security tags cannot be erased with a tag eraser due to EMP hardening. If a tag is implanted under the skin, an Extended Medicine + Logic [Mental] (10, 1 minute) Test is needed to remove it.",
		SpecialProperties: &GearSpecialProperty{
			EMPHardened: true,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"sensor_tag": {
		Name:        "Sensor tags",
		Category:    GearCategoryRFIDTags,
		Subcategory: "RFID Tags",
		Description: "A sensor RFID tag can be equipped with a single sensor (sold separately) of up to Rating 2 (Sensors, p. 445). It then records everything it can, to a maximum of 24 hours of time, at which point you can program it to either shut off or overwrite data older than 24 hours. Sensor tags are often used for diagnostic purposes in various devices, including cyberware.",
		MechanicalEffects: &GearMechanicalEffect{
			Duration: "24 hours maximum recording time",
		},
		SpecialProperties: &GearSpecialProperty{
			MaxRating: 2,
		},
		WirelessBonus: &WirelessBonus{
			Description: "You can monitor the data in real time, if you're the tag's owner. The tag still records the last 24 hours for you.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"stealth_tag": {
		Name:        "Stealth tags",
		Category:    GearCategoryRFIDTags,
		Subcategory: "RFID Tags",
		Description: "A stealth tag always runs silent (p. 235) and has a Sleaze rating equal to its Device Rating. It's disguised to not look like RFID tags, which gives it an additional –2 Concealability modifier. Stealth tags are often used as a backup for security tags by megacorps that are security conscious (and sneaky). They can be implanted the same way security tags can.",
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -8, // -6 base + -2 additional
			AlwaysRunsSilent:       true,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// COMMUNICATIONS AND COUNTERMEASURES
	"bug_scanner": {
		Name:        "Bug scanner",
		Category:    GearCategoryCommunications,
		Subcategory: "Communications and Countermeasures",
		Description: "Also called a radio signal scanner, this device locates and locks in wireless devices within 20 meters. The scanner can also measure a signal's strength and pinpoint its location. To operate a bug scanner, roll Electronic Warfare + Logic [Rating]. A device that is running silent (like a Stealth tag) can use its Logic + Sleaze to defend against the scan. If you get any net hits at all, you find the device.",
		MechanicalEffects: &GearMechanicalEffect{
			Range:    "20 meters",
			TestType: "Electronic Warfare + Logic",
		},
		WirelessBonus: &WirelessBonus{
			SkillSubstitution: "substitute the scanner's Rating for your Electronic Warfare skill when you use it",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"data_tap": {
		Name:        "Data Tap",
		Category:    GearCategoryCommunications,
		Subcategory: "Communications and Countermeasures",
		Description: "You use this hacking tool by attaching it to a data cable. Once it's clamped onto the cable, you can use it via universal data connector. Any device directly connected to the data tap also has a direct connection with the devices on either end of the cable (see Direct Connections, p. 232) and vice versa. The tap can be removed without damaging the cable.",
		WirelessBonus: &WirelessBonus{
			ActionChange: "The data-tap can be wirelessly commanded to self-destruct as a Free Action, immediately and instantly severing the direct connection. This does not harm the cable.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"headjammer": {
		Name:        "Headjammer",
		Category:    GearCategoryCommunications,
		Subcategory: "Communications and Countermeasures",
		Description: "The headjammer is used by security personnel to neutralize implanted commlinks. When it's attached to your head (or other body part) and activated, it works in the same way as any other jammer, with its effects limited to you and your augmentations. Removing a headjammer from someone without the proper key requires a Hardware + Logic [Mental] or a Locksmith + Agility [Physical] (8, 1 Complex Action) Extended Test. Removing a Headjammer from yourself without the proper key is an Escape Artist + Agility [Physical] (4) Test, requiring a Complex Action.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"jammer": {
		Name:        "Jammer",
		Category:    GearCategoryCommunications,
		Subcategory: "Communications and Countermeasures",
		Description: "This device floods the airwaves with electromagnetic jamming signals to block out wireless and radio communication. The jammer generates noise equal to its Device Rating. The area jammer affects a spherical area—its rating is reduced by 1 for every 5 meters from the center (similar to the blast rules for grenades). The directional jammer affects a conical area with a 30-degree spread—its rating is reduced by 1 for every 20 meters from the center. The jammer only affects devices (and personas on those devices) that are within the jamming area, but it affects all of them. Walls and other obstacles may prevent the jamming signal from spreading or reduce its effect (gamemaster's discretion).",
		MechanicalEffects: &GearMechanicalEffect{
			AreaEffect: "spherical area (area jammer) or conical area with 30-degree spread (directional jammer)",
		},
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -2,
		},
		WirelessBonus: &WirelessBonus{
			Description: "You can set your jammer to not interfere with devices and personas you designate.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"micro_transceiver": {
		Name:        "Micro-transceiver",
		Category:    GearCategoryCommunications,
		Subcategory: "Communications and Countermeasures",
		Description: "This classic short-range communicator has been favored by professional operatives since the 2050s. It doesn't do anything special, it just lets you communicate by voice with other micro-transceivers and commlinks that you (and the other person) choose, within a kilometer. The micro-transceiver consists of an ear bud and an adhesive subvocal microphone (p. 439), both of which are commonly available in hard-to-spot designs.",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "1 kilometer",
		},
		WirelessBonus: &WirelessBonus{
			RangeChange: "range becomes worldwide",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"tag_eraser": {
		Name:        "Tag eraser",
		Category:    GearCategoryCommunications,
		Subcategory: "Communications and Countermeasures",
		Description: "This handheld device creates a strong electromagnetic field perfect for burning out RFID tags and other unshielded electronics. It is probably strong enough to destroy a commlink, and you might want to keep it away from your cyberdeck just in case. When you bring the eraser within 5 millimeters of an electronic device and push the button, the device takes 10 boxes of Matrix damage (resisted normally). The extremely short range makes it hard to use on targets like vehicles, most drones, maglocks, and cyberware (and by the time you open them up to get at the electronics, you've already done plenty of damage). The tag eraser has one charge but can be fully recharged at a power point in 10 seconds.",
		MechanicalEffects: &GearMechanicalEffect{
			Range:       "5 millimeters",
			DamageValue: "10 boxes of Matrix damage",
			Charges:     "1 charge, recharges in 10 seconds at power point",
		},
		WirelessBonus: &WirelessBonus{
			Description: "The tag eraser recharges fully in an hour by induction.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"white_noise_generator": {
		Name:        "White noise generator",
		Category:    GearCategoryCommunications,
		Subcategory: "Communications and Countermeasures",
		Description: "This device creates a field of random noise, masking the sounds within its area and preventing direct audio surveillance. All Perception Tests to overhear a conversation within (Rating) meters of a white noise generator receive a negative dice pool modifier equal to the generator's Rating. If more than one generator is in use, only count the highest rating. A white noise generator is redundant in a noisy environment (such as a nightclub or a firefight) and does not help to curtail video surveillance or jam wireless signals.",
		MechanicalEffects: &GearMechanicalEffect{
			Range:    "(Rating) meters",
			TestType: "Perception",
		},
		WirelessBonus: &WirelessBonus{
			RangeChange: "effective radius is tripled",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// SOFTWARE
	"datasoft": {
		Name:        "Datasoft",
		Category:    GearCategorySoftware,
		Subcategory: "Software",
		Description: "Datasofts encompass a wide variety of information files, databases containing information on everything from hydraulic fracturing to 18th century romantic poetry. An appropriate datasoft gives you a +1 bonus to your Mental limit on related Knowledge Skill Tests.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 1,
			TestType:   "Knowledge Skill Tests",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"mapsoft": {
		Name:        "Mapsoft",
		Category:    GearCategorySoftware,
		Subcategory: "Software",
		Description: "Mapsoft programs feature detailed information about a particular area, from streets to business/residential listings to topographical, census, GPS and environmental data. An interactive interface allows you to quickly determine the best routes and directions, locate the nearest spot of your choice, or create your own customized maps. If a wireless link is maintained, the map automatically self-updates with the latest data from GridGuide. Of course, this feature also means that the mapsoft can be used to track your location. At the gamemaster's discretion, mapsofts provide a +1 limit bonus to Navigation Tests made to navigate the area they cover.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 1,
			TestType:   "Navigation Tests",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"shopsoft": {
		Name:        "Shopsoft",
		Category:    GearCategorySoftware,
		Subcategory: "Software",
		Description: "Shopping apps like Clothes Horse, Caveat Emptour, and Guns Near Me provide pricing breakdowns and user reviews for comparison shopping purposes, both for standard goods and black market purchases. Shopsofts self-update regularly to stay current. An appropriate shopsoft—one exists for each type of product like electronics, firearms, melee weapons, armor, et cetera—provides a +1 bonus to your Social limit for all Availability and Negotiation tests you make to buy and sell those items.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 1,
			TestType:   "Availability and Negotiation tests",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"tutorsoft": {
		Name:        "Tutorsoft",
		Category:    GearCategorySoftware,
		Subcategory: "Software",
		Description: "These virtual private tutors aid you in learning a specific skill. The tutorsoft makes Instruction Tests with a dice pool equal to its Rating x 2. Tutorsofts cannot teach skills based on Magic or Resonance.",
		MechanicalEffects: &GearMechanicalEffect{
			DicePoolBonus: 0, // Rating x 2, so handled dynamically
			TestType:      "Instruction Tests",
		},
		SpecialProperties: &GearSpecialProperty{
			OtherProperties: "Cannot teach skills based on Magic or Resonance",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// SKILLSOFTS
	"activesoft": {
		Name:        "Activesoft",
		Category:    GearCategorySkillsofts,
		Subcategory: "Skillsofts",
		Description: "Activesofts replace physical active skills, basically every Active skill that isn't based on Magic or Resonance. A skillwire system (p. 455) is needed to translate the 'softs into usable muscle memory. There's a limit to the number of skills you can use at once, based on your skillwire's rating.",
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"skillwire system"},
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"knowsoft": {
		Name:        "Knowsoft",
		Category:    GearCategorySkillsofts,
		Subcategory: "Skillsofts",
		Description: "Knowsofts replicate Knowledge skills, actively overwriting the user's knowledge with their own data. Knowsofts must be accessed with a skilljack, and the number you can use at once is limited by the skilljack.",
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"skilljack"},
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"linguasoft": {
		Name:        "Linguasoft",
		Category:    GearCategorySkillsofts,
		Subcategory: "Skillsofts",
		Description: "Linguasofts replicate language skills, allowing a user to speak a foreign language by automatically translating signals from the speech cortex, although chipped speech can be awkward and stilted—then again, so can anyone speaking a language that's not their native tongue. Linguasofts must be accessed with a skilljack, which limits how many skillsofts you can use at a time.",
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"skilljack"},
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// ID AND CREDIT
	"certified_credstick": {
		Name:        "Certified credstick",
		Category:    GearCategoryIDAndCredit,
		Subcategory: "ID and Credit",
		Description: "Cash for the late 21st century. A certified credstick is not registered to any specific person—the electronic funds encoded on it belong to the holder, requiring no special ID or authorization to use. The bad news is that you can be physically mugged, any money you have on your credstick jacked and rolled. The good news is that certified credsticks are completely untraceable. They're not even wireless—you have to slot them into a universal data connector to transfer cash onto or off of them. This makes them enduringly popular with shadowrunners and the Mr. Johnsons who love to hire them. Each type of credstick can only hold up to a certain amount of money, listed on the table. This is the maximum amount it can carry, not the amount it always has on it—so don't get excited when you see a gold credstick until you've slotted it and checked its balance.",
		SpecialProperties: &GearSpecialProperty{
			NoWirelessCapability:   true,
			ConcealabilityModifier: -4,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"credit_account": {
		Name:        "Credit account",
		Category:    GearCategoryIDAndCredit,
		Subcategory: "ID and Credit",
		Description: "A credit account is an online banking account that can be accessed at any time via your commlink. Transactions require passcode or biometric verification to be authorized. The good news is no one can (physically) steal your bank account, and hacking credit accounts often requires a run to Zurich Orbital or something equally suicidal. The bad news is that digital transactions leave a \"paper trail\" that, while it can be hidden or concealed, is entirely too traceable for serious criminal activities. Each account must be registered to a particular (usually fake) SIN, unless the account is handled by an anonymous underworld banking service (with its own risks and complications). The cost of banking services is included in your lifestyle costs if you've got a Low Lifestyle or better—otherwise you'll need to keep all your money on credsticks.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"fake_sin": {
		Name:        "Fake system identification number (SIN)",
		Category:    GearCategoryIDAndCredit,
		Subcategory: "ID and Credit",
		Description: "In 2075, you're just a number. A SIN (or its international equivalents) is what makes a mere metahuman into a real person. Solid citizens receive their SINs at birth and carry them until they die. Not having a SIN means living outside the system, living with restricted or non-existent civil rights. Shadowrunners by default are SINless—they have a SIN only if they have the SINner quality (p. 84). Most runners don't have one, either because they were unfortunate enough to be born poor, or because they lost it or ditched it somewhere along the way. SINs are digital, not physical objects. They exist on your commlink, or in your PAN. Getting by without a SIN can be a pain, so most runners settle for the next best thing: a fake. High quality fakes are difficult for The Man to spot; low quality fakes are … less good. The rating of the fake SIN is used in tests against verification systems (Fake SINs, p. 367). Just like a real SIN, anytime you use a fake SIN for legitimate activity, you leave a datatrail in your wake. The fact that criminal activities can be tracked to fake SINs makes fake SINs inherently disposable. Most runners operate two or more fake SINs at a time, one for legal activity like paying rent and going shopping, another for shadier activity, and possibly a third to be used only when it's time to get the hell outta Dodge.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"fake_license": {
		Name:        "Fake license",
		Category:    GearCategoryIDAndCredit,
		Subcategory: "ID and Credit",
		Description: "For those who can't or won't go through the standard legal channels, fake licenses are available for all kinds of restricted items and activities. Items with no letter next to their availability don't require licenses. Items that are Forbidden have no license available. Licenses, therefore, are for Restricted items. Each type of item/activity permission requires a separate license. Things that require licenses include hunting (bow and rifle), possession of a firearm, concealed carry of a firearm (separate license), spellcasting, and any Restricted gear or augmentations, etc. Just as SINs essentially exist on your commlink, fake licenses exist on your SIN and are linked to it. When you buy a fake concealed-carry license, you don't buy it for Murderman the professional shadowrunner, you buy it for John Doe, one of Murderman's fake SINs. Each license must be assigned to a particular (fake) SIN of the player's choosing. Use the fake license's rating against verification systems (Fake SIN, p. 367).",
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"fake SIN"},
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// TOOLS - Note: Tools are described generically, specific tools would be per skill
	"tools_kit": {
		Name:        "Tools (Kit)",
		Category:    GearCategoryTools,
		Subcategory: "Tools",
		Description: "Building and repairing items requires the right tools for the job. Tools must be bought separately for a specific skill (for example, an Armorer shop, a Disguise kit, a Nautical Mechanic facility, etc.). A kit is portable and contains the basic gear to make standard repairs.",
		SpecialProperties: &GearSpecialProperty{
			Size: "portable",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"tools_shop": {
		Name:        "Tools (Shop)",
		Category:    GearCategoryTools,
		Subcategory: "Tools",
		Description: "A shop is transportable in the back of a van and contains more advanced tools for building and repairing. Shops are stocked with standard spare parts.",
		SpecialProperties: &GearSpecialProperty{
			Size: "transportable in the back of a van",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"tools_facility": {
		Name:        "Tools (Facility)",
		Category:    GearCategoryTools,
		Subcategory: "Tools",
		Description: "A facility needs a building and is immobile because of the bulky and heavy machines involved, but it can be used for very advanced constructions and modifications. Facilities are stocked with standard spare parts.",
		SpecialProperties: &GearSpecialProperty{
			Size: "immobile, needs a building",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// OPTICAL AND IMAGING DEVICES
	"binoculars": {
		Name:        "Binoculars",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical and Imaging Devices",
		Description: "Typically handheld, binoculars come with built-in vision magnification. Binoculars are available in optical (which can't take additional vision enhancements) and electronic versions (which can take vision enhancements).",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"camera": {
		Name:        "Camera",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical and Imaging Devices",
		Description: "A common visual device, cameras can capture still photos, video, and trideo, including sound. Cameras may also be upgraded with vision enhancements and audio enhancements. A micro version is available with a Capacity 1.",
		SpecialProperties: &GearSpecialProperty{
			Capacity: 1, // for micro version
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"contacts": {
		Name:        "Contacts",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical and Imaging Devices",
		Description: "The most recent display devices are worn directly on the eyes. They are nearly undetectable, but they offer a bit of space for enhancements. Contacts have to be wireless; they don't have room for a universal data connector.",
		SpecialProperties: &GearSpecialProperty{
			WirelessRequired:       true,
			ConcealabilityModifier: -6,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"glasses": {
		Name:        "Glasses",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical and Imaging Devices",
		Description: "Glasses are lenses contained in lightweight frames worn on the bridge of the nose; numerous cosmetic styles are available, and vision-enhancement-equipped glasses are hard to distinguish from prescription glasses or sunglasses at a glance.",
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -4,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"goggles": {
		Name:        "Goggles",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical and Imaging Devices",
		Description: "Relatively large and bulky, goggles are strapped to the head, making them difficult to dislodge. Goggles have the potential to install a wide array of vision enhancements.",
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: 0,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"imaging_scope": {
		Name:        "Imaging Scopes",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical and Imaging Devices",
		Description: "These are vision enhancers and display devices that are usually top-mounted on weapons (Firearm Accessories, p. 431).",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"monocle": {
		Name:        "Monocle",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical and Imaging Devices",
		Description: "A monocle is worn on a headband or helmet with a flip-down arm, or (for the old-fashioned look) on a chain.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// OPTICAL DEVICES
	"endoscope": {
		Name:        "Endoscope",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical Devices",
		Description: "This fiber-optic cable is at least 1 meter long, with the first 20 centimeters on either side made up of myomeric rope (p. 449) and an optical lens. It allows the user to look around corners, under door slits, or into narrow spaces. It is available in any number of lengths, although longer segments can be unwieldy.",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "at least 1 meter long",
		},
		SpecialProperties: &GearSpecialProperty{
			OpticalOnly: true,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"mage_sight_goggles": {
		Name:        "Mage Sight Goggles",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical Devices",
		Description: "These heavy goggles are connected to a myomeric rope (p. 449) wrapped around a fiber-optic cable that ends in an optical lens. The rope is available in lengths of 10, 20, or 30 meters.",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "10, 20, or 30 meters",
		},
		SpecialProperties: &GearSpecialProperty{
			OpticalOnly: true,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"periscope": {
		Name:        "Periscope",
		Category:    GearCategoryOpticalAndImaging,
		Subcategory: "Optical Devices",
		Description: "An L-shaped tube with two mirrors, the periscope allows the user to look, shoot, or cast spells around corners.",
		MechanicalEffects: &GearMechanicalEffect{
			DicePoolBonus: -3,
			TestType:      "Spellcasting",
		},
		SpecialProperties: &GearSpecialProperty{
			OpticalOnly: true,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// VISION ENHANCEMENTS
	"low_light_vision": {
		Name:        "Low-light vision",
		Category:    GearCategoryVisionEnhancements,
		Subcategory: "Vision Enhancements",
		Description: "This accessory allows you to see normally in light levels as low as starlight. It doesn't help in total darkness, though.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"flare_compensation": {
		Name:        "Flare compensation",
		Category:    GearCategoryVisionEnhancements,
		Subcategory: "Vision Enhancements",
		Description: "This protects you from blinding flashes of light as well as simple glare. It mitigates the vision modifiers for glare and reduces the penalty from flashing lights, like from a flash-pak.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"image_link": {
		Name:        "Image link",
		Category:    GearCategoryVisionEnhancements,
		Subcategory: "Vision Enhancements",
		Description: "A standard upgrade, this lets you display visual information (text, pictures, movies, the current time, etc.) in your field of vision. This is usually AROs, but you can display pretty much whatever you want on it. You and your team can use it to share tactical and situational info in real time. An image link is what you need to truly \"see\" AR and participate in the modern world.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"smartlink": {
		Name:        "Smartlink",
		Category:    GearCategoryVisionEnhancements,
		Subcategory: "Vision Enhancements",
		Description: "This accessory works with a smartgun system to give you the full benefit of the system. The smartgun will tell you the range to various targets, as well as ammunition level (and type), heat buildup, mechanical stress and so on. Without a smartlink, a smartgun system just sends out data that isn't received by anyone and has no effect. A smartlink installed in a natural eye or in a pair of cybereyes is more effective than a smartlink installed in an external device; see Smartgun System, p. 433.",
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"smartgun system"},
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"thermographic_vision": {
		Name:        "Thermographic vision",
		Category:    GearCategoryVisionEnhancements,
		Subcategory: "Vision Enhancements",
		Description: "This enhancement enables vision in the infrared spectrum, enabling you to see heat patterns. It's a very practical way to spot living beings in areas of total darkness, to check if a motor or machine has been running lately, and so on.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"vision_enhancement": {
		Name:        "Vision enhancement",
		Category:    GearCategoryVisionEnhancements,
		Subcategory: "Vision Enhancements",
		Description: "This sharpens a character's vision at all ranges, providing visual acuity closer to that of the average hawk than that of the average metahuman. It adds its Rating as a positive modifier to your limit on visual Perception Tests.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 0, // Rating-based, handled dynamically
			TestType:   "visual Perception Tests",
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 0, // Rating-based, handled dynamically
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"vision_magnification": {
		Name:        "Vision magnification",
		Category:    GearCategoryVisionEnhancements,
		Subcategory: "Vision Enhancements",
		Description: "This zoom function digitally magnifies vision by up to fifty times, allowing distant targets to be seen clearly. For rules on using vision magnification in ranged combat, see p. 177.",
		MechanicalEffects: &GearMechanicalEffect{
			OtherEffects: "magnifies vision by up to fifty times",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// AUDIO DEVICES
	"directional_microphone": {
		Name:         "Directional microphone",
		Category:     GearCategoryAudioDevices,
		Subcategory:  "Audio Devices",
		Description:  "This lets you listen in on distant conversations. Solid objects or loud sounds along the line of eavesdropping interfere, of course. It's as if you're up to one hundred meters closer to whatever you're pointing the mic at.",
		Availability: "4",
		CostFormulaString:  "Capacity*50",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "effectively 100 meters closer",
		},
		SpecialProperties: &GearSpecialProperty{
			MaxRating: 6, // Capacity 1-6
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"ear_buds": {
		Name:        "Ear buds",
		Category:    GearCategoryAudioDevices,
		Subcategory: "Audio Devices",
		Description: "These ergonomic ear plugs are hard to spot and harder still to differentiate from the standard kind that comes with every music player and commlink.",
		CostFormulaString: "Capacity*50",
		SpecialProperties: &GearSpecialProperty{
			MaxRating: 3, // Capacity 1-3
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"headphones": {
		Name:        "Headphones",
		Category:    GearCategoryAudioDevices,
		Subcategory: "Audio Devices",
		Description: "A full headset with an adjustable headband strap, or attached to a headphone. Earbuds are harder to spot, but headphones pack more capacity.",
		CostFormulaString: "Capacity*50",
		SpecialProperties: &GearSpecialProperty{
			MaxRating: 6, // Capacity 1-6
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"laser_microphone": {
		Name:         "Laser microphone",
		Category:     GearCategoryAudioDevices,
		Subcategory:  "Audio Devices",
		Description:  "This sophisticated sensor bounces a laser beam against a solid object like a windowpane, reads the vibrations on the surface, and translates them into the sounds that are occurring on the other side of the surface. Maximum range is 100 meters. A laser microphone cannot fit the spatial recognizer audio enhancement.",
		Availability: "6R",
		CostFormulaString:  "Capacity*100",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "100 meters maximum",
		},
		SpecialProperties: &GearSpecialProperty{
			MaxRating:         6, // Capacity 1-6
			CannotCombineWith: []string{"spatial recognizer audio enhancement"},
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"omni_directional_microphone": {
		Name:        "Omni-directional microphone",
		Category:    GearCategoryAudioDevices,
		Subcategory: "Audio Devices",
		Description: "A standard omni-directional audio pickup and recorder. Usually incorporated into, connected to, or wirelessly linked with a commlink or other recording device. Micro versions are available at Capacity 1 only and have a Maximum Range of only 5 meters.",
		CostFormulaString: "Capacity*50",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "5 meters (micro version)",
		},
		SpecialProperties: &GearSpecialProperty{
			MaxRating: 6, // Capacity 1-6
			Capacity:  1, // for micro version
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// AUDIO ENHANCEMENTS
	"audio_enhancement": {
		Name:        "Audio enhancement",
		Category:    GearCategoryAudioEnhancements,
		Subcategory: "Audio Enhancements",
		Description: "Audio enhancement allows the user to hear a broader spectrum of audio frequencies, including high and low frequencies outside the normal metahuman audible spectrum. The user also experiences fine discrimination of nuances and can block out distracting background noise. Audio enhancement adds its Rating to your limit in audio Perception Tests.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 0, // Rating-based, handled dynamically
			TestType:   "audio Perception Tests",
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 0, // Rating-based, handled dynamically
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"select_sound_filter": {
		Name:        "Select sound filter",
		Category:    GearCategoryAudioEnhancements,
		Subcategory: "Audio Enhancements",
		Description: "This lets you block out background noise and focus on specific sounds or patterns of sounds. It even includes speech, word, and sound pattern recognition. Each Rating point lets you select a single sound group (such as the footsteps of a patrolling guard or the rotors of a distant helicopter) and focus on it. You only actively listen to one group at a time, but you can record the others for later playback or set them to triggered monitoring (such as sounding an alert if a conversation brings up a certain topic, or if there's a variation in the breathing pattern of a guard dog).",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"spatial_recognizer": {
		Name:        "Spatial recognizer",
		Category:    GearCategoryAudioEnhancements,
		Subcategory: "Audio Enhancements",
		Description: "This hearing accessory pinpoints the source of a sound. You get a +2 bonus on your limit in Perception Tests to find the source of a specific sound.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 2,
			TestType:   "Perception Tests to find the source of a specific sound",
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 2,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// SENSORS
	"sensor_array": {
		Name:        "Sensor array",
		Category:    GearCategorySensors,
		Subcategory: "Sensors",
		Description: "This sensor package includes up to eight functions listed under Sensor Functions. When you use the sensor array for Perception Tests, you may use your Electronic Warfare skill in place of your Perception skill, and you may use the sensor's Rating as your limit.",
		MechanicalEffects: &GearMechanicalEffect{
			SkillSubstitution: "Electronic Warfare skill in place of Perception skill",
			LimitBonus:        0, // Rating-based, handled dynamically
			TestType:          "Perception Tests",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"single_sensor": {
		Name:        "Single sensor",
		Category:    GearCategorySensors,
		Subcategory: "Sensors",
		Description: "This is a sensor that can do only one function listed under Sensor Functions.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// SENSOR FUNCTIONS
	"atmosphere_sensor": {
		Name:        "Atmosphere sensor",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "Weather forecasts are notoriously untrustworthy (thanks to pollution, the Awakening, and other factors), but atmospheric sensors can keep you from getting caught in the rain with up-to-the second analysis of what's happening in the air around you.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"cyberware_scanner": {
		Name:        "Cyberware scanner",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "This millimeter-wave scanner is primarily intended to detect cyber-implants but can be used to identify other contraband as well. Maximum range 15 meters.",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "15 meters maximum",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"geiger_counter": {
		Name:        "Geiger counter",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "This sensor picks up the amount of radioactivity surrounding it.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"laser_range_finder": {
		Name:        "Laser range finder",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "This simple sensor emits a laser beam that is reflected off a target's surface and picked up by a detector to calculate the exact distance to the target.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"mad_scanner": {
		Name:        "MAD scanner",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "The MAD (Magnetic Anomaly Detection) scanner is used to detect weapons and concentrations of metal. It has a maximum range of 5 meters.",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "5 meters maximum",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"motion_sensor": {
		Name:        "Motion sensor",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "This sensor uses a mix of ultrasound and low-power infrared to detect motion and drastic changes in the ambient temperature. Maximum range is 25 meters.",
		MechanicalEffects: &GearMechanicalEffect{
			Range: "25 meters maximum",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"olfactory_scanner": {
		Name:        "Olfactory scanner",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "The olfactory sensor picks up and analyzes the molecules in the air. It works in the same way as the olfactory booster cyberware.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"radio_signal_scanner": {
		Name:        "Radio signal scanner",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "This can be used as a bug scanner (p. 440).",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"ultrasound": {
		Name:        "Ultrasound",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "The ultrasound accessory consists of an emitter that sends out continuous ultrasonic pulses and a receiver that picks up the echoes of these pulses to create a topographic ultrasound map. Ultrasound is perfect to \"see\" textures, calculate distances between objects, and pick up things otherwise invisible to the naked eye (like people cloaked by an Invisibility spell), it can't handle colors or brightness. It also can't penetrate materials like glass that would be transparent to optical sensors. You can set it to a passive mode, where it doesn't emit ultrasonic pulses but still picks up ultrasound from outside sources, such as motion sensors or someone else's ultrasound sensors on active mode (or bats).",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"sensor_vision_magnification": {
		Name:        "Vision magnification (Sensor)",
		Category:    GearCategorySensors,
		Subcategory: "Sensor Functions",
		Description: "This zoom function digitally magnifies vision by up to 50 times, allowing distant targets to be seen clearly assuming a clear line of sight. For rules on using vision magnification in ranged combat, see p. 178.",
		MechanicalEffects: &GearMechanicalEffect{
			OtherEffects: "magnifies vision by up to 50 times",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// SECURITY DEVICES
	"key_lock": {
		Name:        "Key lock",
		Category:    GearCategorySecurityDevices,
		Subcategory: "Security Devices",
		Description: "Even in the wireless world, there are still some mechanical key locks and combination locks around. Some of them are old infrastructure that is still in place to save money, others for nostalgia, still others because modern burglars don't expect them. For more details, see p. 363.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"maglock": {
		Name:        "Maglock",
		Category:    GearCategorySecurityDevices,
		Subcategory: "Security Devices",
		Description: "Maglocks are electronic locks with a variety of access control options, from biometrics, to keycards, to passcards. For more information about maglocks and their options, see Maglocks, p. 363.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"restraints": {
		Name:        "Restraints",
		Category:    GearCategorySecurityDevices,
		Subcategory: "Security Devices",
		Description: "Standard metal restraints (Armor 16, Structure 2) come with a mechanical or a wireless-controlled lock (Barriers, p. 197). Modern plasteel restraints (Armor 20, Structure 2) are flash-fused and remain in place until the subject is cut free. Disposable plastic straps (Armor 6, Structure 1) are lightweight and easy to carry in bundles. Containment manacles are metal (Armor 16, Structure 2) and attached to a prisoner's wrists or ankles to prevent her from moving faster than a shuffle or extending a cyber-implant weapon.",
		MechanicalEffects: &GearMechanicalEffect{
			ArmorValue:     16, // Standard metal, 20 for plasteel, 6 for plastic
			StructureValue: 2,  // Standard metal/plasteel, 1 for plastic
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// BREAKING AND ENTERING GEAR
	"autopicker": {
		Name:        "Autopicker",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "This lockpick gun is a quick and effective way of bypassing mechanical locks. The autopicker's rating is added to your limit when picking a mechanical lock.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 0, // Rating-based, handled dynamically
			TestType:   "picking a mechanical lock",
		},
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -4,
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 0, // Rating-based, handled dynamically
			Description:   "Having access to a huge online database of mechanical locks lets you add the autopicker's rating as a dice pool modifier to your test when picking a mechanical lock.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"cellular_glove_molder": {
		Name:        "Cellular glove molder",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "This device will take a finger or palm print and mold a \"sleeve\" you can wear to mimic the print to fool some biometric locks (Maglocks, p. 363).",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"chisel_crowbar": {
		Name:        "Chisel/crowbar",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "The chisel (or crowbar if you prefer) doubles your effective Strength when you're forcing a door or container.",
		MechanicalEffects: &GearMechanicalEffect{
			StrengthMultiplier: 2,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"keycard_copier": {
		Name:        "Keycard copier",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "The keycard copier allows the user to copy a (stolen) keycard in seconds. A new keycard can then be manufactured with a Hardware kit, about ten minutes, and a Hardware + Logic [Mental] (2) Test. When used, the forged keycard uses its Rating x 2 in an Opposed Test against the Maglock Rating x 2 (Maglocks, p. 363). Some security systems may note the unusual usage of duplicate keys, like when \"Dr. Scientist\" accesses a lab that she just accessed and hasn't left yet.",
		MechanicalEffects: &GearMechanicalEffect{
			OtherEffects: "forged keycard uses its Rating x 2 in an Opposed Test against the Maglock Rating x 2",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"lockpick_set": {
		Name:        "Lockpick set",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "These mechanical burglary devices have undergone only slight improvements in the last several centuries. They are necessary tools for picking locks.",
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -4,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"maglock_passkey": {
		Name:        "Maglock passkey",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "This maglock \"skeleton key\" can be inserted into any cardreader's maglock, cleverly fooling it into believing that a legitimate passkey has been swiped. See Maglocks, p. 363.",
		WirelessBonus: &WirelessBonus{
			RatingBonus: 1,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"miniwelder": {
		Name:        "Miniwelder",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "This portable device creates a small electric arc to melt metals, either to cut through metal or to weld it together. Its power supply allows it to operate for 30 minutes. While creating an intense heat, the arc is much too small to make a good weapon (it would be like trying to stab someone with a lighter). The miniwelder has a Damage Value of 25 when used to cut through barriers.",
		MechanicalEffects: &GearMechanicalEffect{
			DamageValue:   "25",
			OperatingTime: "30 minutes",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"monofilament_chainsaw": {
		Name:        "Monofilament chainsaw",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "The top of each chain segment on this portable motorized saw is covered with monofilament wire. Ideal for cutting through trees, doors, and other immovable objects. A monofilament chainsaw is too unwieldy to make a good melee weapon (use Exotic Melee Weapon skill). When used against barriers, double the monofilament chainsaw's Damage Value of 8P.",
		MechanicalEffects: &GearMechanicalEffect{
			DamageValue: "8P (doubled against barriers = 16P)",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"sequencer": {
		Name:        "Sequencer",
		Category:    GearCategoryBreakingAndEntering,
		Subcategory: "Breaking and Entering Gear",
		Description: "An electronic device required to defeat keypad-maglocks. See Maglocks, p. 363.",
		WirelessBonus: &WirelessBonus{
			RatingBonus: 1,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// INDUSTRIAL CHEMICALS
	"glue_solvent": {
		Name:        "Glue solvent",
		Category:    GearCategoryIndustrialChemicals,
		Subcategory: "Industrial Chemicals",
		Description: "This spray can has enough solvent to dissolve about a square meter of fast-drying aerosol superglue.",
		MechanicalEffects: &GearMechanicalEffect{
			OtherEffects: "dissolves about a square meter of fast-drying aerosol superglue",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"glue_sprayer": {
		Name:        "Glue sprayer",
		Category:    GearCategoryIndustrialChemicals,
		Subcategory: "Industrial Chemicals",
		Description: "This fast-drying aerosol superglue allows you to quickly glue two rigid surfaces together, and holds enough for about a square meter of glue (enough to glue an exterior door or picture window shut). The glue takes 1 Combat Turn to harden. The glue has Body and Strength Ratings of 5 for the purpose of trying to force it (an Opposed Body + Strength Test).",
		MechanicalEffects: &GearMechanicalEffect{
			OtherEffects: "glue has Body and Strength Ratings of 5, takes 1 Combat Turn to harden",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"thermite_burning_bar": {
		Name:        "Thermite burning bar",
		Category:    GearCategoryIndustrialChemicals,
		Subcategory: "Industrial Chemicals",
		Description: "Thermite gel is an incendiary material that burns at extremely high temperatures. It is applied with the help of a burning bar—a rod of thermite and oxygen mounted on a handle and in a frame—that can be used to melt holes in iron, steel, and even plasteel. The thermite burning bar inflicts Fire Damage with a DV of 30P. It has to be set carefully, so a thermite bar can't be used as a weapon (unless your target is tied up or unconscious or something, in which case, wow, ouch).",
		MechanicalEffects: &GearMechanicalEffect{
			DamageValue: "30P Fire",
		},
		WirelessBonus: &WirelessBonus{
			Description: "The burning bar can be activated wirelessly.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// SURVIVAL GEAR
	"chemsuit": {
		Name:        "Chemsuit",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "This impermeable coverall is worn over clothes or armor and provides chemical protection equal to its Rating (Chemical Protection, p. 437). It is not to be confused with a full hazmat suit, as it is not vacuum sealed. If a chemsuit is worn on top of chemical-resistant armor, only the highest chemical protection rating applies.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"climbing_gear": {
		Name:        "Climbing gear",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "This is a backpack full of rope (400-kilo test), an ascent/descent harness, gloves, carabiners, crampons, and so forth needed for assisted climbing (Climbing, p. 134).",
		MechanicalEffects: &GearMechanicalEffect{
			WeightCapacity: 400, // 400-kilo test rope
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"diving_gear": {
		Name:        "Diving gear",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "Underwater diving equipment, including a diving suit, partial facemask with snorkel, breathing regulator, an air tank with 2 hours of air, and an inflatable vest for quick returns to the surface. The regulator and air tank protect against inhalation toxins just like a gas mask. The wet suit provides Rating 1 resistance to Cold damage (p. 170). Wireless signals don't work very well underwater, but the wireless systems in the diving gear help with prep and maintenance.",
		MechanicalEffects: &GearMechanicalEffect{
			OperatingTime: "2 hours of air",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"flashlight": {
		Name:        "Flashlight",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "By 2075, most flashlights are long lasting and super bright. Durability and brightness depend on the size—the bulkier, the better. Flashlights are also available in low-light and infrared versions, reducing visibility modifiers for low-light and thermographic vision, respectively. A flashlight can also be mounted to a weapon's top or under-barrel mount (Mounts, p. 417).",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"gas_mask": {
		Name:        "Gas mask",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "This air-supplied re-breather completely covers your face and gives you immunity to inhalation-vector toxin attacks (Toxins, Drugs, and BTLs, p. 408). It comes with a one-hour clean-air supply (replacements cost 40 nuyen) and can be attached to larger air tanks. It cannot be combined with a regular respirator.",
		MechanicalEffects: &GearMechanicalEffect{
			OperatingTime: "1 hour clean-air supply",
		},
		SpecialProperties: &GearSpecialProperty{
			CannotCombineWith: []string{"regular respirator"},
		},
		WirelessBonus: &WirelessBonus{
			Description: "The gas mask analyzes and gives you information about the surrounding air that you're not breathing.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"gecko_tape_gloves": {
		Name:        "Gecko tape gloves",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "The outer layer of these gloves is made of a special dry adhesive that incorporates millions of fine microscopic hairs that bond to other surfaces. Individually, these bonding forces are tiny, but combined they're strong enough to attach a troll, upside down, to the ceiling. Gecko tape gloves come as a set that includes gloves, kneepads, and slip-on-soles. You get to use assisted climbing (p. 134) when you're wearing the set. Gecko tape gloves are useless when they're wet.",
		WirelessBonus: &WirelessBonus{
			Description: "The adhesive outer layer can be temporarily neutralized with a wireless signal, useful for getting the gloves on and off without getting them stuck to yourself or each other.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"hazmat_suit": {
		Name:        "Hazmat suit",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "The hazmat suit covers your whole body and includes an internal air tank with four hours of air. As long as it's not damaged, it provides you with a chemical seal (p. 437) and protects you from contact and inhalation vector toxin attacks (Toxins, Drugs, and BTLs, p. 408). Many hazmat suits come standard with a Geiger counter (Sensors, p. 445).",
		MechanicalEffects: &GearMechanicalEffect{
			OperatingTime: "4 hours of air",
		},
		WirelessBonus: &WirelessBonus{
			Description: "The suit analyzes and transmits information about the environment that you're not touching or breathing.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"light_stick": {
		Name:        "Light stick",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "Bend, snap, and shake it to produce three hours of soft chemical illumination that covers a ten-meter radius.",
		MechanicalEffects: &GearMechanicalEffect{
			Duration: "3 hours",
			Range:    "10-meter radius",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"magnesium_torch": {
		Name:        "Magnesium torch",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "Strike and activate for five minutes of bright torchlight.",
		MechanicalEffects: &GearMechanicalEffect{
			Duration: "5 minutes",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"micro_flare_launcher": {
		Name:        "Micro flare launcher",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "The flare launcher can shoot colored flares about 200 meters into the air, illuminating an area the size of a city block for a couple of minutes and negating the modifier for poor or low lighting. If you shoot it at someone, use the Exotic Ranged Weapon skill; the micro flare deals 5P Fire damage.",
		MechanicalEffects: &GearMechanicalEffect{
			Range:       "200 meters",
			DamageValue: "5P Fire",
			Duration:    "a couple of minutes",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"rappelling_gloves": {
		Name:        "Rappelling gloves",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "These gloves are made of a special fabric that allows you to get a tighter grip on a grapple line, giving you a +2 dice pool bonus on all tests to hold your grip on the line. These gloves are necessary in order to use ultrathin microwire without gruesomely slicing your hands apart as you slide down it.",
		MechanicalEffects: &GearMechanicalEffect{
			DicePoolBonus: 2,
			TestType:      "tests to hold your grip on the line",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"respirator": {
		Name:        "Respirator",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "A respirator is a filter-mask worn over the mouth and nose that protects against inhalation-vector toxins (Toxins, Drugs, and BTLs, p. 408). The respirator adds its rating to toxin resistance tests against inhalation-vector toxins.",
		MechanicalEffects: &GearMechanicalEffect{
			RatingBonus: 0, // Rating-based, handled dynamically
			TestType:    "toxin resistance tests against inhalation-vector toxins",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"survival_kit": {
		Name:        "Survival kit",
		Category:    GearCategorySurvivalGear,
		Subcategory: "Survival Gear",
		Description: "An assortment of survival gear in a rugged bag. Includes a knife, lighter, matches, compass, lightweight thermal blanket, several days' worth of ration bars, a water-purification unit, and more. A good item to consider for your go-bag.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// GRAPPLE GUN
	"grapple_gun": {
		Name:        "Grapple gun",
		Category:    GearCategoryGrappleGun,
		Subcategory: "Grapple Gun",
		Description: "This gun can shoot a grappling hook and attached rope, using Light Crossbow ranges. It comes equipped with an internal winch to pull back the grapple (or pull up small loads). Use the Exotic Ranged Weapon skill to shoot it. Micro rope can support a weight of up to 100 kilograms; standard and stealth ropes can support a weight of up to 400 kilograms.",
		MechanicalEffects: &GearMechanicalEffect{
			WeightCapacity: 100, // micro rope, 400 for standard/stealth
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"microwire": {
		Name:        "Microwire",
		Category:    GearCategoryGrappleGun,
		Subcategory: "Grapple Gun",
		Description: "This micro rope is made of an extremely thin (nearly monofilament) and resilient fiber; a great length of it can be stored in a very small compartment, and it is very difficult to see. The downside is that it can only be grabbed with special protective rappelling gloves without slicing straight through the climber's hands, inflicting 8P damage with an AP of –8.",
		MechanicalEffects: &GearMechanicalEffect{
			WeightCapacity: 100,
			DamageValue:    "8P (AP -8) if grabbed without rappelling gloves",
		},
		SpecialProperties: &GearSpecialProperty{
			Requires: []string{"rappelling gloves"},
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"myomeric_rope": {
		Name:        "Myomeric rope",
		Category:    GearCategoryGrappleGun,
		Subcategory: "Grapple Gun",
		Description: "Made of a special myomeric fiber, this rope's movement can be controlled remotely (over a maximum length of thirty meters). For example, the controller can wind it like a snake to reach around an obstacle or tie to a ledge. The rope moves at a rate of two meters per Combat Turn.",
		MechanicalEffects: &GearMechanicalEffect{
			Range:    "30 meters maximum",
			Duration: "moves at 2 meters per Combat Turn",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"stealth_rope_catalyst_stick": {
		Name:        "Stealth rope & catalyst stick",
		Category:    GearCategoryGrappleGun,
		Subcategory: "Grapple Gun",
		Description: "When stealth rope is touched with the catalyst stick, the chemical reaction that is triggered crumbles the rope to dust within seconds, leaving almost no trace. The catalyst stick is reusable.",
		MechanicalEffects: &GearMechanicalEffect{
			WeightCapacity: 400,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// BIOTECH
	"biomonitor": {
		Name:        "Biomonitor",
		Category:    GearCategoryBiotech,
		Subcategory: "Biotech",
		Description: "This compact device measures life signs—heart rate, blood pressure, temperature, and so on. The biomonitor can also analyze blood, sweat, and skin samples. Used by medical services and patients who need to monitor their own health, biomonitors can be worn as an armband or wristband or integrated into clothing or commlinks.",
		WirelessBonus: &WirelessBonus{
			Description: "The biomonitor shares information with other wireless devices you designate and can auto-alert DocWagon or another ambulance service if your life signs reach certain thresholds.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"disposable_syringe": {
		Name:        "Disposable syringe",
		Category:    GearCategoryBiotech,
		Subcategory: "Biotech",
		Description: "Made of plastic with a metal needle, syringes are intended for a single use. Syringes can be used to apply injection-vector toxins. An uncooperative victim might need to be immobilized or at least grappled first.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"medkit": {
		Name:        "Medkit",
		Category:    GearCategoryBiotech,
		Subcategory: "Biotech",
		Description: "The medkit includes drug supplies, bandages, tools, and a (talkative) doctor expert system that can advise the user on techniques to handle most typical medical emergencies (including fractures, gunshot wounds, chemical wounds, and poisoning, as well as offering advice for the treating of shock, handling blood loss, and of course performing resuscitations). Add the medkit's rating to your limit on First Aid tests. A medkit of Rating 3 or lower fits in a pocket; at Rating 4+ it's a handheld case. The medkit needs to be restocked after every (Rating) uses.",
		MechanicalEffects: &GearMechanicalEffect{
			LimitBonus: 0, // Rating-based, handled dynamically
			TestType:   "First Aid tests",
		},
		SpecialProperties: &GearSpecialProperty{
			Size:                   "fits in pocket (Rating 3 or lower), handheld case (Rating 4+)",
			RestockingRequirement:  "after every (Rating) uses",
			ConcealabilityModifier: 2,
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 0, // Rating-based, handled dynamically
			Description:   "The Medkit provides a dice pool bonus equal to its rating to First Aid + Logic tests, or can operate itself with a dice pool of Medkit Rating x 2 and a limit equal to its Rating.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"docwagon_contract": {
		Name:        "DocWagon contract",
		Category:    GearCategoryBiotech,
		Subcategory: "Biotech",
		Description: "Don't leave home without it! DocWagon offers first-class emergency medical care on a twenty-four-hour basis, and they come to you! Four contract service levels are available: basic, gold, platinum, and super-platinum. A DocWagon contract requires the filing of tissue samples (held in a secure vault staffed by bonded guards, spiders, and mages) and comes with a biomonitor RFID tag implant or wristband that can be activated to call for help and then to serve as a homing beacon for DocWagon armed ambulances and fast-response choppers in the area. Rupture of the band will also alert DocWagon representatives. Upon receiving a call from a contract-holder, DocWagon franchises guarantee arrival of an armed trauma team in less than ten minutes, or else the emergency medical care is free. Resuscitation service carries a high premium (5,000 nuyen), as does High Threat Response (HTR) service (5,000 nuyen). In the latter case, the client or their next of kin is expected to pay medical bills up to and including death compensation for DocWagon employees (20,000 nuyen per cold body). Gold service includes one free resuscitation per year, a fifty percent reduction on HTR service charges, and a ten percent discount on extended care. Platinum service includes four free resuscitations per year and a fifty percent discount on extended care. There is no charge for HTR services, but employee death compensation still applies. Super-platinum subscribers are entitled to five free resuscitations a year and do not have to pay for HTR services or death compensation. Doc Wagon does not respond to calls on extraterritorial government or corporate property without permission from the controlling authority.",
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	// SLAP PATCHES
	"antidote_patch": {
		Name:        "Antidote patch",
		Category:    GearCategorySlapPatches,
		Subcategory: "Slap Patches",
		Description: "Add the rating of an antidote patch to any toxin resistance tests made within twenty minutes after it has been applied. The window to apply an antidote patch after being poisoned is often very narrow, depending on the toxin (Toxins, Drugs, and BTLs, p. 408).",
		MechanicalEffects: &GearMechanicalEffect{
			RatingBonus: 0, // Rating-based, handled dynamically
			TestType:    "toxin resistance tests",
			Duration:    "20 minutes after application",
		},
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -6,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"chem_patch": {
		Name:        "Chem patch",
		Category:    GearCategorySlapPatches,
		Subcategory: "Slap Patches",
		Description: "This is a \"blank\" patch. You can add one dose of a chemical or toxin (p. 408) to it, and then apply it later to a patient (or yourself).",
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -6,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"stim_patch": {
		Name:        "Stim patch",
		Category:    GearCategorySlapPatches,
		Subcategory: "Slap Patches",
		Description: "This patch removes a number of boxes of Stun damage equal to its Rating. This effect lasts for (Rating x 10) minutes—after that period of time, the patient takes (Rating + 1) unresisted Stun damage (which may be well become physical overflow by that point). While a stimulant patch is in effect, the character is unable to rest. Frequent use of stimulant patches may require Addiction Tests. Treat it as Addiction Rating 2, Addiction Threshold 1.",
		MechanicalEffects: &GearMechanicalEffect{
			OtherEffects: "removes Rating boxes of Stun damage, lasts (Rating x 10) minutes, then inflicts (Rating + 1) unresisted Stun damage",
		},
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -6,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"tranq_patch": {
		Name:        "Tranq patch",
		Category:    GearCategorySlapPatches,
		Subcategory: "Slap Patches",
		Description: "This patch inflicts Stun damage equal to its rating, resisted with only Body.",
		MechanicalEffects: &GearMechanicalEffect{
			DamageValue: "Rating Stun damage, resisted with only Body",
		},
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -6,
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
	"trauma_patch": {
		Name:        "Trauma patch",
		Category:    GearCategorySlapPatches,
		Subcategory: "Slap Patches",
		Description: "If placed on a dying patient, it allows her to make an immediate stabilization test (Physical Damage Overflow, p. 209) using her Body instead of First Aid or Medicine.",
		SpecialProperties: &GearSpecialProperty{
			ConcealabilityModifier: -6,
		},
		WirelessBonus: &WirelessBonus{
			Description: "Instead of making a test, the patient is automatically stabilized immediately.",
		},
		Source: &SourceReference{
			Source: "SR5",
		},
	},
}
