package v5

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCyberware_Validate(t *testing.T) {
	tests := []struct {
		name      string
		cyberware Cyberware
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid cyberware",
			cyberware: Cyberware{
				Device:  "Datajack",
				Essence: "0.1",
				Source:  &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing device name",
			cyberware: Cyberware{
				Device:  "",
				Essence: "0.1",
				Source:  &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "device",
		},
		{
			name: "invalid essence formula",
			cyberware: Cyberware{
				Device:  "Datajack",
				Essence: "invalid formula",
				Source:  &SourceReference{Source: "SR5"},
			},
			expectErr: false, // Essence validation is lenient for backward compatibility
		},
		{
			name: "valid cyberware with structured formulas",
			cyberware: Cyberware{
				Device:         "Cyberarm",
				EssenceFormula: &RatingFormula{Formula: "Rating * 0.1"},
				CostFormula:    &CostFormula{Formula: "Rating * 5000", IsVariable: true},
				Source:         &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.cyberware.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

func TestBioware_Validate(t *testing.T) {
	tests := []struct {
		name      string
		bioware   Bioware
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid bioware",
			bioware: Bioware{
				Device:  "Adrenal Pump",
				Essence: "0.2",
				Source:  &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing device name",
			bioware: Bioware{
				Device:  "",
				Essence: "0.2",
				Source:  &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "device",
		},
		{
			name: "valid bioware with structured formulas",
			bioware: Bioware{
				Device:         "Muscle Augmentation",
				EssenceFormula: &RatingFormula{Formula: "Rating * 0.15"},
				CostFormula:    &CostFormula{Formula: "Rating * 15000", IsVariable: true},
				Source:         &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.bioware.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

func TestWeapon_Validate(t *testing.T) {
	tests := []struct {
		name      string
		weapon    Weapon
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid weapon",
			weapon: Weapon{
				Name:   "Ares Predator V",
				Type:   WeaponTypeHeavyPistol,
				Skill:  WeaponSkillPistols,
				Damage: "6P",
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing name",
			weapon: Weapon{
				Name:   "",
				Type:   WeaponTypeHeavyPistol,
				Skill:  WeaponSkillPistols,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "name is required",
		},
		{
			name: "missing type",
			weapon: Weapon{
				Name:   "Ares Predator V",
				Type:   "",
				Skill:  WeaponSkillPistols,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "type is required",
		},
		{
			name: "missing skill",
			weapon: Weapon{
				Name:   "Ares Predator V",
				Type:   WeaponTypeHeavyPistol,
				Skill:  "",
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "skill is required",
		},
		{
			name: "exotic weapon without exotic skill name",
			weapon: Weapon{
				Name:   "Exotic Weapon",
				Type:   WeaponTypeMeleeOther,
				Skill:  WeaponSkillExoticMeleeWeapon,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "exotic skill name is required",
		},
		{
			name: "valid exotic weapon with exotic skill name",
			weapon: Weapon{
				Name:            "Katana",
				Type:            WeaponTypeMeleeOther,
				Skill:           WeaponSkillExoticMeleeWeapon,
				ExoticSkillName: "Katana",
				Source:          &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.weapon.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

func TestArmor_Validate(t *testing.T) {
	tests := []struct {
		name      string
		armor     Armor
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid armor",
			armor: Armor{
				Name:   "Armor Jacket",
				Type:   ArmorTypeArmor,
				Rating: 6,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing name",
			armor: Armor{
				Name:   "",
				Type:   ArmorTypeArmor,
				Rating: 6,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "name is required",
		},
		{
			name: "missing type",
			armor: Armor{
				Name:   "Armor Jacket",
				Type:   "",
				Rating: 6,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "type is required",
		},
		{
			name: "rating exceeds max rating",
			armor: Armor{
				Name:      "Custom Armor",
				Type:      ArmorTypeArmor,
				Rating:    10,
				MaxRating: 6,
				Source:    &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "exceeds maximum rating",
		},
		{
			name: "valid armor with max rating",
			armor: Armor{
				Name:      "Custom Armor",
				Type:      ArmorTypeArmor,
				Rating:    5,
				MaxRating: 6,
				Source:    &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.armor.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

func TestVehicle_Validate(t *testing.T) {
	tests := []struct {
		name      string
		vehicle   Vehicle
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid vehicle",
			vehicle: Vehicle{
				Name:     "Yamaha Rapier",
				Type:     VehicleTypeGroundcraft,
				Handling: HandlingRating{OnRoad: 4},
				Speed:    SpeedRating{Value: 6, MovementType: MovementTypeGround},
				Body:     BodyRating{Value: 4},
				Source:   &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing name",
			vehicle: Vehicle{
				Name:   "",
				Type:   VehicleTypeGroundcraft,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "name is required",
		},
		{
			name: "missing type",
			vehicle: Vehicle{
				Name:   "Yamaha Rapier",
				Type:   "",
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "type is required",
		},
		{
			name: "missing required ratings",
			vehicle: Vehicle{
				Name:   "Custom Vehicle",
				Type:   VehicleTypeGroundcraft,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "handling rating is required",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.vehicle.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

func TestGear_Validate(t *testing.T) {
	tests := []struct {
		name      string
		gear      Gear
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid gear",
			gear: Gear{
				Name:     "Fake SIN",
				Category: GearCategoryIDAndCredit,
				Source:   &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing name",
			gear: Gear{
				Name:     "",
				Category: GearCategoryIDAndCredit,
				Source:   &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "name is required",
		},
		{
			name: "missing category",
			gear: Gear{
				Name:     "Fake SIN",
				Category: "",
				Source:   &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "category is required",
		},
		{
			name: "rating exceeds max rating in special properties",
			gear: Gear{
				Name:     "Custom Gear",
				Category: GearCategoryElectronics,
				Rating:   10,
				SpecialProperties: &GearSpecialProperty{
					MaxRating: 6,
				},
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "exceeds maximum rating",
		},
		{
			name: "valid gear with rating within max",
			gear: Gear{
				Name:     "Custom Gear",
				Category: GearCategoryElectronics,
				Rating:   5,
				SpecialProperties: &GearSpecialProperty{
					MaxRating: 6,
				},
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.gear.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

func TestPower_Validate(t *testing.T) {
	tests := []struct {
		name      string
		power     Power
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid power",
			power: Power{
				Name:       "Adrenaline Boost",
				Activation: ActivationTypeFreeAction,
				Cost: PowerCostFormula{
					BaseCost: floatPtr(0.5),
					IsVariable: false,
				},
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing name",
			power: Power{
				Name:       "",
				Activation: ActivationTypeFreeAction,
				Source:     &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "power name is required",
		},
		{
			name: "invalid activation type",
			power: Power{
				Name:       "Test Power",
				Activation: "invalid_activation",
				Source:     &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "invalid activation type",
		},
		{
			name: "invalid cost formula",
			power: Power{
				Name:       "Test Power",
				Activation: ActivationTypeFreeAction,
				Cost: PowerCostFormula{
					BaseCost: floatPtr(-1.0), // negative cost
					IsVariable: false,
				},
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "invalid cost formula",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.power.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

func TestProgram_Validate(t *testing.T) {
	tests := []struct {
		name      string
		program   Program
		expectErr bool
		errMsg    string
	}{
		{
			name: "valid program",
			program: Program{
				Name: "Bootstrap",
				Type: ProgramTypeCommon,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "missing name",
			program: Program{
				Name:   "",
				Type:   ProgramTypeCommon,
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "program name is required",
		},
		{
			name: "invalid program type",
			program: Program{
				Name:   "Test Program",
				Type:   "invalid_type",
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "invalid program type",
		},
		{
			name: "valid agent program with cost and availability",
			program: Program{
				Name: "Agent",
				Type: ProgramTypeAgent,
				Cost: &AgentCostFormula{
					CostPerRating: 1000,
				},
				Availability: &AgentAvailabilityFormula{
					AvailabilityPerRating: 3,
				},
				RatingRange: &AgentRatingRange{
					MinRating: 1,
					MaxRating: 6,
				},
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: false,
		},
		{
			name: "invalid cost formula",
			program: Program{
				Name: "Agent",
				Type: ProgramTypeAgent,
				Cost: &AgentCostFormula{
					CostPerRating: -100, // negative cost
				},
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "invalid cost formula",
		},
		{
			name: "invalid rating range",
			program: Program{
				Name: "Agent",
				Type: ProgramTypeAgent,
				RatingRange: &AgentRatingRange{
					MinRating: 6,
					MaxRating: 1, // max less than min
				},
				Source: &SourceReference{Source: "SR5"},
			},
			expectErr: true,
			errMsg:    "maximum rating cannot be less than minimum rating",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.program.Validate()
			if tt.expectErr {
				assert.Error(t, err, "Validate() should return an error")
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg, "Error message should contain expected text")
				}
			} else {
				assert.NoError(t, err, "Validate() should not return an error")
			}
		})
	}
}

