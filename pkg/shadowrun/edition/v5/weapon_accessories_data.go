package v5

// dataWeaponAccessories contains all weapon accessory definitions
var dataWeaponAccessories = map[string]WeaponAccessory{
	"airburst_link": {
		Name:        "Airburst Link",
		Description: "This grenade/rocket launcher smartgun accessory uses a \"smart\" rangefinder to air-burst the explosive projectile at a point deemed to be both a safe distance from the launcher and within the closest possible proximity to the target. An airburst link reduces the scatter distance for a launched grenade by two meters per net hit instead of by one meter per hit (Determine Scatter, p. 182) when you use the wireless link trigger.",
		MountTypes:  []AccessoryMountType{AccessoryMountNone},
		SpecialProperties: &AccessorySpecialProperty{
			RequiresWireless:        true,
			ScatterDistanceModifier: "reduces by 2 meters per net hit instead of 1 meter per hit",
		},
		WirelessBonus: &WirelessBonus{
			Description: "An airburst link requires wireless functionality to function at all. Both the grenades and the launcher must have wireless mode turned on.",
		},
		Availability: "6R",
		Cost:         "600",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"bipod": {
		Name:        "Bipod",
		Description: "This two-legged brace extends downward from the weapon, allowing it to be fired low to the ground with the user in a prone or sitting position. A bipod can be attached to the underbarrel mount of a weapon and provides 2 points of Recoil Compensation when properly deployed. Attaching a bipod takes one minute. Folding up or deploying a bipod is a Simple Action. Removing it is a Complex Action.",
		MountTypes:  []AccessoryMountType{AccessoryMountUnderbarrel},
		SpecialProperties: &AccessorySpecialProperty{
			RecoilCompensation: 2,
			InstallationTime:   "1 minute",
			DeploymentAction:   "Simple Action",
			RemovalAction:      "Complex Action",
		},
		WirelessBonus: &WirelessBonus{
			ActionChange: "Free Action instead of Simple Action",
			Description:  "Folding up or deploying the bipod is a Free Action.",
		},
		Availability: "2",
		Cost:         "200",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"concealable_holster": {
		Name:        "Concealable Holster",
		Description: "This small holster can be worn on the ankle, clipped to the forearm, in the small of the back, or anywhere else it's unlikely to be seen. The concealable holster adds –1 to the item's Concealability (p. 419). Only pistols and tasers fit in a Concealable Holster.",
		MountTypes:  []AccessoryMountType{AccessoryMountNone},
		SpecialProperties: &AccessorySpecialProperty{
			ConcealabilityModifier: -1,
			CompatibleWeaponTypes:  []string{"pistol", "taser"},
		},
		WirelessBonus: &WirelessBonus{
			Description: "Wireless sensors and a smart-fabric coated weave allow the holster to alter color and texture in real time adding an additional –1 to the item's Concealability.",
		},
		Availability: "2",
		Cost:         "150",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"gas_vent_system": {
		Name:        "Gas-Vent System",
		Description: "Gas-vent recoil compensation systems are barrel-mounted accessories that vent a weapon's barrel gases at a specific vector to counter muzzle climb. Once installed, a gas-vent cannot be removed. Gas-vent systems provide a number of points of Recoil Compensation equal to their rating.",
		MountTypes:  []AccessoryMountType{AccessoryMountBarrel},
		SpecialProperties: &AccessorySpecialProperty{
			CannotBeRemoved: true,
			// RecoilCompensation is equal to Rating, so it's dynamic
			MaxRating: 3, // Rating 1-3 per table
		},
		Availability: "(Rating × 3)R",
		Cost:         "Rating × 200",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"gyro_mount": {
		Name:        "Gyro Mount",
		Description: "This heavy upper-body harness features an attached, articulated, motorized gyro-stabilized arm that mounts an assault rifle or a heavy weapon. The system neutralizes up to 6 points of recoil and movement modifiers. Attaching or removing a weapon from the mount takes a Simple Action. Putting on a gyro-mount harness takes about five minutes, while the quick-release allows you to get out of it with a Complex Action.",
		MountTypes:  []AccessoryMountType{AccessoryMountUnderbarrel},
		SpecialProperties: &AccessorySpecialProperty{
			RecoilCompensation:             6,
			MovementModifierNeutralization: 6,
			InstallationTime:               "about five minutes",
			AttachmentTime:                 "Simple Action",
			RemovalAction:                  "Complex Action",
			CompatibleWeaponTypes:          []string{"assault rifle", "heavy weapon"},
		},
		WirelessBonus: &WirelessBonus{
			ActionChange: "Free Action instead of Complex Action",
			Description:  "Activating the harness's quick-release with a wireless signal to exit the harness is a Free Action.",
		},
		Availability: "7",
		Cost:         "1,400",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"hidden_arm_slide": {
		Name:        "Hidden Arm Slide",
		Description: "Attached to the forearm and worn under clothing, this slide can accommodate a pistol-sized weapon. It can fit a hold-out, light pistol, or taser. With a hand gesture, the slide releases the weapon/object right into your hand. If you quick draw the weapon in this slide, the threshold for the quick draw is 2. It also gives the weapon a –1 Concealability modifier.",
		MountTypes:  []AccessoryMountType{AccessoryMountNone},
		SpecialProperties: &AccessorySpecialProperty{
			QuickDrawThreshold:     2,
			ConcealabilityModifier: -1,
			CompatibleWeaponTypes:  []string{"hold-out", "light pistol", "taser"},
		},
		WirelessBonus: &WirelessBonus{
			ActionChange: "Free Action instead of Simple Action",
			Description:  "You can ready the weapon in the slide as a Free Action.",
		},
		Availability: "4R",
		Cost:         "350",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"imaging_scope": {
		Name:        "Imaging Scope",
		Description: "These classic scopes are attached to the top mount; attaching or removing them takes only a Simple Action. Imaging scopes include a micro camera and vision magnification, and they have a Capacity of 3 to hold vision enhancements (p. 444).",
		MountTypes:  []AccessoryMountType{AccessoryMountTop},
		SpecialProperties: &AccessorySpecialProperty{
			Capacity:                         3,
			AttachmentTime:                   "Simple Action",
			BuiltInFeatures:                  []string{"micro camera", "vision magnification"},
			CanUpgradeWithVisionEnhancements: true,
		},
		WirelessBonus: &WirelessBonus{
			Description: "The scope's \"line of sight\" can be shared, allowing you to share what your scope sees with your team (and yourself if you're using it to look around a corner).",
		},
		Availability: "2",
		Cost:         "300",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"laser_sight": {
		Name:        "Laser Sight",
		Description: "This device uses a laser beam to project a visible dot (in your choice of colors) on the target. This increases the weapon's Accuracy by 1, which is not cumulative with smartlink modifiers. The laser sight can be attached to either the underbarrel mount or top mount. Activating or deactivating a laser sight is a Simple Action.",
		MountTypes:  []AccessoryMountType{AccessoryMountTop, AccessoryMountUnderbarrel},
		SpecialProperties: &AccessorySpecialProperty{
			AccuracyBonus:    1,
			ActivationAction: "Simple Action",
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 1,
			ActionChange:  "Free Action instead of Simple Action",
			Description:   "The wireless laser sight provides a +1 dice pool bonus on attack tests, not cumulative with smartlink modifiers. Activating and deactivating the laser sight is a Free Action.",
		},
		Availability: "2",
		Cost:         "125",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"periscope": {
		Name:        "Periscope",
		Description: "This adjustable \"off-axis\" viewer attaches to a top mount and allows an operator to target a weapon around corners, reducing the usual –3 dice pool penalty to –2. A periscope can be upgraded with any of the vision enhancements noted on p. 444.",
		MountTypes:  []AccessoryMountType{AccessoryMountTop},
		SpecialProperties: &AccessorySpecialProperty{
			CornerShotPenaltyModifier:        1, // Reduces -3 to -2, so modifier of +1
			CanUpgradeWithVisionEnhancements: true,
		},
		WirelessBonus: &WirelessBonus{
			Description: "The dice pool penalty for shooting around corners is reduced to –1.",
		},
		Availability: "3",
		Cost:         "70",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"quick_draw_holster": {
		Name:        "Quick-Draw Holster",
		Description: "This easy access holster can hold any weapon of Machine Pistol or smaller size. It reduces the threshold for quick-drawing the holstered weapon by 1 (see Quick Draw, p. 165).",
		MountTypes:  []AccessoryMountType{AccessoryMountNone},
		SpecialProperties: &AccessorySpecialProperty{
			QuickDrawThresholdModifier: -1,
			WeaponSizeRestriction:      "Machine Pistol or smaller",
		},
		Availability: "4",
		Cost:         "175",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"shock_pad": {
		Name:        "Shock Pad",
		Description: "A shock-absorbing pad is situated on the rigid stock of a rifle, shotgun, or heavy weapon, and provides 1 point of recoil compensation.",
		MountTypes:  []AccessoryMountType{AccessoryMountStock},
		SpecialProperties: &AccessorySpecialProperty{
			RecoilCompensation:    1,
			CompatibleWeaponTypes: []string{"rifle", "shotgun", "heavy weapon"},
		},
		Availability: "2",
		Cost:         "50",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"silencer_suppressor": {
		Name:        "Silencer/Suppressor",
		Description: "This barrel-mounted accessory reduces the sound and flash of a weapon's discharge. It cannot be used with revolvers or shotguns. It applies a –4 dice pool modifier on all Perception Tests to notice the weapon's use or locate the weapon's firer. Attaching or removing a silencer takes a Complex Action.",
		MountTypes:  []AccessoryMountType{AccessoryMountBarrel},
		SpecialProperties: &AccessorySpecialProperty{
			PerceptionModifier:      -4,
			AttachmentTime:          "Complex Action",
			IncompatibleWeaponTypes: []string{"revolver", "shotgun"},
		},
		WirelessBonus: &WirelessBonus{
			Description: "The silencer/suppressor features a Rating 2 microphone with Rating 2 Select Sound Filter and simple software that alerts you via AR if your silencer detects the sound of someone nearby reacting to the sound of the silenced weapon.",
		},
		Availability: "9F",
		Cost:         "500",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"smart_firing_platform": {
		Name:        "Smart Firing Platform",
		Description: "This is a non-mobile robotic tripod equipped with a remote control pivot that allows for a 180-degree firing arc and a 60-degree inclination. You can mount one smartgun-equipped weapon to the platform, and it will be fired by the device's onboard Pilot (Device Rating 3). The platform is equipped with a Targeting Autosoft (Rating 3) and can be upgraded with additional autosofts, usually a Clearsight program. You need to set the parameters of who exactly the platform should and shouldn't shoot at, which are followed by the platform's pilot (Pilot Programs, p. 269). The platform provides 5 points of Recoil Compensation. It has an Initiative attribute of Pilot x 2 and 4D6 Initiative Dice when acting autonomously (see Drone Initiative, p. 270).",
		MountTypes:  []AccessoryMountType{AccessoryMountUnderbarrel},
		SpecialProperties: &AccessorySpecialProperty{
			RecoilCompensation: 5,
			FiringArc:          "180-degree",
			Inclination:        "60-degree",
			DeviceRating:       3,
			Autosofts:          []string{"Targeting Autosoft (Rating 3)"},
			InitiativeDice:     "4D6",
			RequiresSmartgun:   true,
			CanFireRemotely:    true,
		},
		WirelessBonus: &WirelessBonus{
			Description: "You can fire the mounted weapon remotely (Control Device, p. 238), like a drone with no rigger interface. You can use an implanted smartlink with the smartgun if you're in VR.",
		},
		Availability: "12F",
		Cost:         "2,500",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"smartgun_system_external": {
		Name:        "Smartgun System, External",
		Description: "This connects a firearm or a projectile weapon directly to the user's smartlink. Incorporating a small camera and laser range finder, the smartlink keeps track of ammunition, heat buildup, and material stress. If you have a smartlink, you can mentally switch between gun modes, eject a clip, and fire the gun without pulling the trigger. The camera lets you shoot around corners without exposing yourself to return fire (at a –3 dice pool penalty). The system makes use of advanced calculation software, allowing for precisely calculated trajectories and high precision over any distance. If you're using a smartlink, the smartgun system increases the gun's Accuracy by 2. The smartgun features are accessed either by universal access port cable to an imaging device (like glasses, goggles, or a datajack for someone with cybereyes) or by a wireless connection working in concert with direct neural interface. An external smartgun system can be attached to the top mount or underbarrel mount with an Armorer + Logic (4, 1 hour) Extended Test. The small camera has a capacity of 1 and can be equipped with vision enhancements (p. 444).",
		MountTypes:  []AccessoryMountType{AccessoryMountTop, AccessoryMountUnderbarrel},
		SpecialProperties: &AccessorySpecialProperty{
			AccuracyBonus:                    2, // When used with smartlink
			Capacity:                         1,
			InstallationTest:                 "Armorer + Logic (4, 1 hour) Extended Test",
			InstallationTime:                 "1 hour",
			BuiltInFeatures:                  []string{"small camera", "laser range finder"},
			RequiresSmartlink:                true,
			CanUpgradeWithVisionEnhancements: true,
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 1, // +1 if using gear with smartlink, +2 if using augmentation
			ActionChange:  "Free Action instead of Simple Action",
			Description:   "A wireless smartlink provides a dice pool bonus to all attacks with the weapon: +1 if you're using gear with a smartlink or +2 if you're using an augmentation for which you paid Essence. Ejecting a clip and changing fire modes are Free Actions.",
		},
		Availability: "4R",
		Cost:         "200",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"smartgun_system_internal": {
		Name:        "Smartgun System, Internal",
		Description: "This connects a firearm or a projectile weapon directly to the user's smartlink. Incorporating a small camera and laser range finder, the smartlink keeps track of ammunition, heat buildup, and material stress. If you have a smartlink, you can mentally switch between gun modes, eject a clip, and fire the gun without pulling the trigger. The camera lets you shoot around corners without exposing yourself to return fire (at a –3 dice pool penalty). The system makes use of advanced calculation software, allowing for precisely calculated trajectories and high precision over any distance. If you're using a smartlink, the smartgun system increases the gun's Accuracy by 2. Retrofitting a firearm with an internal smartgun system doubles the weapon's price and adds 2 to its Availability. The small camera has a capacity of 1 and can be equipped with vision enhancements (p. 444).",
		MountTypes:  []AccessoryMountType{AccessoryMountNone},
		SpecialProperties: &AccessorySpecialProperty{
			AccuracyBonus:                    2, // When used with smartlink
			Capacity:                         1,
			PriceMultiplier:                  2.0,
			AvailabilityModifier:             2,
			BuiltInFeatures:                  []string{"small camera", "laser range finder"},
			RequiresSmartlink:                true,
			CanUpgradeWithVisionEnhancements: true,
		},
		WirelessBonus: &WirelessBonus{
			DicePoolBonus: 1, // +1 if using gear with smartlink, +2 if using augmentation
			ActionChange:  "Free Action instead of Simple Action",
			Description:   "A wireless smartlink provides a dice pool bonus to all attacks with the weapon: +1 if you're using gear with a smartlink or +2 if you're using an augmentation for which you paid Essence. Ejecting a clip and changing fire modes are Free Actions.",
		},
		Availability: "(+2)R",
		Cost:         "(Weapon Cost) × 2",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"spare_clip": {
		Name:         "Spare Clip",
		Description:  "A spare clip comes unloaded but can hold the maximum rounds for the weapon. Each clip is specific to the weapon you buy it for, but they all cost the same. And yes, it's technically a detachable box magazine, but the Cityspeak word for it is so popular these days that even the catalogs call them clips.",
		MountTypes:   []AccessoryMountType{AccessoryMountNone},
		Availability: "4",
		Cost:         "5",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"speed_loader": {
		Name:        "Speed Loader",
		Description: "The speed loader is a simple device that holds a ring of bullets for fast insertion into a revolver's cylinder. Each speed loader is specific to the weapon it was designed for. It lets you fully reload a revolver as a Complex Action instead of having to load rounds one at a time (Reloading Weapons table, p. 163).",
		MountTypes:  []AccessoryMountType{AccessoryMountNone},
		SpecialProperties: &AccessorySpecialProperty{
			ReloadTimeModifier:    "Complex Action instead of loading rounds one at a time",
			CompatibleWeaponTypes: []string{"revolver"},
		},
		Availability: "2",
		Cost:         "25",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
	"tripod": {
		Name:        "Tripod",
		Description: "The tripod provides a stable base to fire a weapon low to the ground with the user kneeling or sitting. A tripod can be attached to the underbarrel mount and provides 6 points of Recoil Compensation when properly deployed. Attaching a tripod takes one minute. Folding up or deploying the tripod is a Free Action.",
		MountTypes:  []AccessoryMountType{AccessoryMountUnderbarrel},
		SpecialProperties: &AccessorySpecialProperty{
			RecoilCompensation: 6,
			InstallationTime:   "1 minute",
			DeploymentAction:   "Free Action",
		},
		WirelessBonus: &WirelessBonus{
			Description: "Folding up, deploying, or removing the tripod is a Free Action.",
		},
		Availability: "4",
		Cost:         "500",
		Source: &SourceReference{
			Source: "SR5",
			Page:   "431",
		},
	},
}
