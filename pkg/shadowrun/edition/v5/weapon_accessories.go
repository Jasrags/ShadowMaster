package v5

// AccessoryMountType represents where an accessory can be mounted
type AccessoryMountType string

const (
	AccessoryMountBarrel      AccessoryMountType = "barrel"
	AccessoryMountUnderbarrel AccessoryMountType = "underbarrel"
	AccessoryMountSide        AccessoryMountType = "side"
	AccessoryMountTop         AccessoryMountType = "top"
	AccessoryMountStock       AccessoryMountType = "stock"
	AccessoryMountInternal    AccessoryMountType = "internal"
	AccessoryMountNone        AccessoryMountType = "none" // For holsters and non-mounted accessories
)

// AccessorySpecialProperty represents special properties of a weapon accessory
type AccessorySpecialProperty struct {
	// RecoilCompensation indicates points of recoil compensation provided
	RecoilCompensation int `json:"recoil_compensation,omitempty"`
	// AccuracyBonus indicates accuracy bonus provided
	AccuracyBonus int `json:"accuracy_bonus,omitempty"`
	// ConcealabilityModifier modifies concealability (negative = easier to conceal)
	ConcealabilityModifier int `json:"concealability_modifier,omitempty"`
	// QuickDrawThresholdModifier modifies quick draw threshold
	QuickDrawThresholdModifier int `json:"quick_draw_threshold_modifier,omitempty"`
	// QuickDrawThreshold sets a specific quick draw threshold
	QuickDrawThreshold int `json:"quick_draw_threshold,omitempty"`
	// Rating indicates accessory rating (for rated accessories like gas-vent system)
	Rating int `json:"rating,omitempty"`
	// MaxRating indicates maximum rating available
	MaxRating int `json:"max_rating,omitempty"`
	// Capacity indicates capacity for enhancements (e.g., imaging scope)
	Capacity int `json:"capacity,omitempty"`
	// RequiresWireless indicates if accessory requires wireless to function
	RequiresWireless bool `json:"requires_wireless,omitempty"`
	// CannotBeRemoved indicates if accessory cannot be removed once installed
	CannotBeRemoved bool `json:"cannot_be_removed,omitempty"`
	// InstallationTime describes time required to install
	InstallationTime string `json:"installation_time,omitempty"`
	// InstallationTest describes test required for installation
	InstallationTest string `json:"installation_test,omitempty"`
	// AttachmentTime describes time to attach/detach
	AttachmentTime string `json:"attachment_time,omitempty"`
	// DeploymentAction describes action required to deploy (e.g., "Simple Action", "Free Action")
	DeploymentAction string `json:"deployment_action,omitempty"`
	// RemovalAction describes action required to remove
	RemovalAction string `json:"removal_action,omitempty"`
	// ActivationAction describes action required to activate/deactivate
	ActivationAction string `json:"activation_action,omitempty"`
	// CompatibleWeaponTypes lists weapon types this accessory is compatible with
	CompatibleWeaponTypes []string `json:"compatible_weapon_types,omitempty"`
	// IncompatibleWeaponTypes lists weapon types this accessory cannot be used with
	IncompatibleWeaponTypes []string `json:"incompatible_weapon_types,omitempty"`
	// WeaponSizeRestriction describes size restrictions (e.g., "Machine Pistol or smaller")
	WeaponSizeRestriction string `json:"weapon_size_restriction,omitempty"`
	// PerceptionModifier modifies Perception Tests to notice weapon use
	PerceptionModifier int `json:"perception_modifier,omitempty"`
	// CornerShotPenaltyModifier modifies penalty for shooting around corners
	CornerShotPenaltyModifier int `json:"corner_shot_penalty_modifier,omitempty"`
	// ScatterDistanceModifier modifies scatter distance (e.g., "reduces by 2 meters per net hit")
	ScatterDistanceModifier string `json:"scatter_distance_modifier,omitempty"`
	// FiringArc describes firing arc (e.g., "180-degree firing arc")
	FiringArc string `json:"firing_arc,omitempty"`
	// Inclination describes inclination range (e.g., "60-degree inclination")
	Inclination string `json:"inclination,omitempty"`
	// DeviceRating indicates device rating for autonomous devices
	DeviceRating int `json:"device_rating,omitempty"`
	// Autosofts lists included autosofts
	Autosofts []string `json:"autosofts,omitempty"`
	// InitiativeDice indicates initiative dice for autonomous devices
	InitiativeDice string `json:"initiative_dice,omitempty"`
	// ReloadTimeModifier describes how reload time is modified
	ReloadTimeModifier string `json:"reload_time_modifier,omitempty"`
	// PriceMultiplier indicates if price is based on weapon cost (e.g., "2×Weapon Cost")
	PriceMultiplier float64 `json:"price_multiplier,omitempty"`
	// PriceFormula describes price formula if not a simple multiplier
	PriceFormula string `json:"price_formula,omitempty"`
	// AvailabilityModifier indicates if availability is modified based on weapon
	AvailabilityModifier int `json:"availability_modifier,omitempty"`
	// BuiltInFeatures lists built-in features (e.g., "microphone", "camera", "laser range finder")
	BuiltInFeatures []string `json:"built_in_features,omitempty"`
	// CanUpgradeWithVisionEnhancements indicates if can be upgraded with vision enhancements
	CanUpgradeWithVisionEnhancements bool `json:"can_upgrade_with_vision_enhancements,omitempty"`
	// CanShareLineOfSight indicates if line of sight can be shared wirelessly
	CanShareLineOfSight bool `json:"can_share_line_of_sight,omitempty"`
	// RequiresSmartlink indicates if requires smartlink to function
	RequiresSmartlink bool `json:"requires_smartlink,omitempty"`
	// RequiresSmartgun indicates if requires smartgun-equipped weapon
	RequiresSmartgun bool `json:"requires_smartgun,omitempty"`
	// CanFireRemotely indicates if weapon can be fired remotely
	CanFireRemotely bool `json:"can_fire_remotely,omitempty"`
	// MovementModifierNeutralization indicates points of movement modifier neutralized
	MovementModifierNeutralization int `json:"movement_modifier_neutralization,omitempty"`
}

// WeaponAccessory represents a weapon accessory definition
type WeaponAccessory struct {
	// Name is the accessory name (e.g., "Laser Sight", "Silencer/Suppressor")
	Name string `json:"name,omitempty"`
	// Description is the full text description
	Description string `json:"description,omitempty"`
	// MountTypes lists where this accessory can be mounted
	MountTypes []AccessoryMountType `json:"mount_types,omitempty"`
	// SpecialProperties describes special properties of the accessory
	SpecialProperties *AccessorySpecialProperty `json:"special_properties,omitempty"`
	// WirelessBonus describes wireless-enabled functionality
	WirelessBonus *WirelessBonus `json:"wireless_bonus,omitempty"`
	// Availability is the availability rating (e.g., "2", "6R", "9F")
	Availability string `json:"availability,omitempty"`
	// Cost is the cost in nuyen (e.g., "125", "Rating×200", "2×Weapon Cost")
	// Cost is the cost in nuyen (may be a formula like "2×Weapon Cost")
	// Deprecated: Use CostFormula instead for structured cost handling
	Cost string `json:"cost,omitempty"`
	// CostFormula is the structured cost formula (new format)
	CostFormula *CostFormula `json:"cost_formula,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// GetAllWeaponAccessories returns all weapon accessories
func GetAllWeaponAccessories() []WeaponAccessory {
	accessories := make([]WeaponAccessory, 0, len(dataWeaponAccessories))
	for _, a := range dataWeaponAccessories {
		accessories = append(accessories, a)
	}
	return accessories
}

// GetWeaponAccessoryByName returns the weapon accessory definition with the given name, or nil if not found
func GetWeaponAccessoryByName(name string) *WeaponAccessory {
	for _, accessory := range dataWeaponAccessories {
		if accessory.Name == name {
			return &accessory
		}
	}
	return nil
}

// GetWeaponAccessoryByKey returns the weapon accessory definition with the given key, or nil if not found
func GetWeaponAccessoryByKey(key string) *WeaponAccessory {
	accessory, ok := dataWeaponAccessories[key]
	if !ok {
		return nil
	}
	return &accessory
}

// GetWeaponAccessoriesByMountType returns all accessories that can be mounted on the specified mount type
func GetWeaponAccessoriesByMountType(mountType AccessoryMountType) []WeaponAccessory {
	accessories := make([]WeaponAccessory, 0)
	for _, a := range dataWeaponAccessories {
		for _, mt := range a.MountTypes {
			if mt == mountType {
				accessories = append(accessories, a)
				break
			}
		}
	}
	return accessories
}
