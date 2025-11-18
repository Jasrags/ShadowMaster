package v5

import (
	"math/rand"
	"testing"
)

func TestGetActionByName(t *testing.T) {
	tests := []struct {
		name        string
		searchName  string
		expectError bool
		expectName  string
	}{
		{
			name:        "exact match",
			searchName:  "Melee Defense",
			expectError: false,
			expectName:  "Melee Defense",
		},
		{
			name:        "case insensitive",
			searchName:  "melee defense",
			expectError: false,
			expectName:  "Melee Defense",
		},
		{
			name:        "mixed case",
			searchName:  "MeLeE DeFeNsE",
			expectError: false,
			expectName:  "Melee Defense",
		},
		{
			name:        "non-existent action",
			searchName:  "Non-Existent Action",
			expectError: true,
		},
		{
			name:        "empty string",
			searchName:  "",
			expectError: true,
		},
		{
			name:        "another valid action",
			searchName:  "Ranged Defense",
			expectError: false,
			expectName:  "Ranged Defense",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			action, err := GetActionByName(tt.searchName)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error but got none")
				}
				if action != nil {
					t.Errorf("expected nil action but got %+v", action)
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error: %v", err)
				}
				if action == nil {
					t.Fatal("expected action but got nil")
				}
				if action.Name != tt.expectName {
					t.Errorf("expected name %q but got %q", tt.expectName, action.Name)
				}
			}
		})
	}
}

func TestGetAllActions(t *testing.T) {
	actions := GetAllActions()
	if len(actions) == 0 {
		t.Error("expected at least one action but got none")
	}

	// Verify we have the expected number of actions (260 according to comment)
	if len(actions) != 260 {
		t.Errorf("expected 260 actions but got %d", len(actions))
	}

	// Verify all actions have required fields
	for i, action := range actions {
		if action.Name == "" {
			t.Errorf("action at index %d has empty name", i)
		}
		if action.Type == "" {
			t.Errorf("action at index %d has empty type", i)
		}
		if action.Source == "" {
			t.Errorf("action at index %d has empty source", i)
		}
	}
}

func TestEvaluateDiceFormula(t *testing.T) {
	// Mock resolvers
	attrResolver := func(attr string) (int, error) {
		attrs := map[string]int{
			"REA": 5,
			"INT": 4,
			"BOD": 6,
			"AGI": 5,
			"WIL": 4,
			"LOG": 5,
		}
		if val, ok := attrs[attr]; ok {
			return val, nil
		}
		return 0, nil
	}

	improvementResolver := func(improvement string) (int, error) {
		improvements := map[string]int{
			"Dodge":           2,
			"SpellResistance": 1,
		}
		if val, ok := improvements[improvement]; ok {
			return val, nil
		}
		return 0, nil
	}

	tests := []struct {
		name                string
		formula             string
		attrResolver        AttributeResolver
		improvementResolver ImprovementValueResolver
		expectError         bool
		expectedResult      int
	}{
		{
			name:                "None formula",
			formula:             "None",
			attrResolver:        nil,
			improvementResolver: nil,
			expectError:         false,
			expectedResult:      0,
		},
		{
			name:                "simple attribute",
			formula:             "{REA}",
			attrResolver:        attrResolver,
			improvementResolver: nil,
			expectError:         false,
			expectedResult:      5,
		},
		{
			name:                "two attributes addition",
			formula:             "{REA} + {INT}",
			attrResolver:        attrResolver,
			improvementResolver: nil,
			expectError:         false,
			expectedResult:      9,
		},
		{
			name:                "attribute with improvement",
			formula:             "{REA} + {INT} + {Improvement Value: Dodge}",
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			expectError:         false,
			expectedResult:      11,
		},
		{
			name:                "subtraction",
			formula:             "{REA} + {INT} - 2",
			attrResolver:        attrResolver,
			improvementResolver: nil,
			expectError:         false,
			expectedResult:      7,
		},
		{
			name:                "multiple attributes",
			formula:             "{BOD} + {WIL} + {Improvement Value: SpellResistance}",
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			expectError:         false,
			expectedResult:      11,
		},
		{
			name:                "unknown attribute defaults to 0",
			formula:             "{UNKNOWN} + 5",
			attrResolver:        attrResolver,
			improvementResolver: nil,
			expectError:         false,
			expectedResult:      5,
		},
		{
			name:                "unknown improvement defaults to 0",
			formula:             "{REA} + {Improvement Value: Unknown}",
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			expectError:         false,
			expectedResult:      5,
		},
		{
			name:                "nil resolvers",
			formula:             "{REA} + {INT}",
			attrResolver:        nil,
			improvementResolver: nil,
			expectError:         false,
			expectedResult:      0, // All attributes resolve to 0
		},
		{
			name:                "invalid formula component",
			formula:             "{REA} + abc",
			attrResolver:        attrResolver,
			improvementResolver: nil,
			expectError:         true,
		},
		{
			name:                "complex formula",
			formula:             "{AGI} + {LOG} + {WIL} - 3",
			attrResolver:        attrResolver,
			improvementResolver: nil,
			expectError:         false,
			expectedResult:      11,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := EvaluateDiceFormula(tt.formula, tt.attrResolver, tt.improvementResolver)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error but got none, result: %d", result)
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error: %v", err)
				}
				if result != tt.expectedResult {
					t.Errorf("expected result %d but got %d", tt.expectedResult, result)
				}
			}
		})
	}
}

func TestRollDice(t *testing.T) {
	// Use a fixed seed for reproducible tests
	rng := rand.New(rand.NewSource(42))

	tests := []struct {
		name             string
		dicePool         int
		rng              *rand.Rand
		expectDicePool   int
		expectRollsCount int
		validateGlitch   bool
		expectGlitch     bool
		validateCritical bool
		expectCritical   bool
	}{
		{
			name:             "zero dice pool",
			dicePool:         0,
			rng:              rng,
			expectDicePool:   0,
			expectRollsCount: 0,
		},
		{
			name:             "small dice pool",
			dicePool:         5,
			rng:              rng,
			expectDicePool:   5,
			expectRollsCount: 5,
		},
		{
			name:             "large dice pool",
			dicePool:         20,
			rng:              rng,
			expectDicePool:   20,
			expectRollsCount: 20,
		},
		{
			name:             "nil rng creates new one",
			dicePool:         5,
			rng:              nil,
			expectDicePool:   5,
			expectRollsCount: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := RollDice(tt.dicePool, tt.rng)

			if result.DicePool != tt.expectDicePool {
				t.Errorf("expected dice pool %d but got %d", tt.expectDicePool, result.DicePool)
			}

			if len(result.Rolls) != tt.expectRollsCount {
				t.Errorf("expected %d rolls but got %d", tt.expectRollsCount, len(result.Rolls))
			}

			// Verify all rolls are valid (1-6)
			for i, roll := range result.Rolls {
				if roll < 1 || roll > 6 {
					t.Errorf("roll at index %d is invalid: %d (expected 1-6)", i, roll)
				}
			}

			// Verify hits count (5s and 6s)
			expectedHits := 0
			for _, roll := range result.Rolls {
				if roll >= 5 {
					expectedHits++
				}
			}
			if result.Hits != expectedHits {
				t.Errorf("expected %d hits but got %d", expectedHits, result.Hits)
			}

			// Verify glitches count (1s)
			expectedGlitches := 0
			for _, roll := range result.Rolls {
				if roll == 1 {
					expectedGlitches++
				}
			}
			if result.Glitches != expectedGlitches {
				t.Errorf("expected %d glitches but got %d", expectedGlitches, result.Glitches)
			}

			// Verify glitch logic: more than half the dice show 1
			expectedIsGlitch := result.Glitches > tt.dicePool/2
			if result.IsGlitch != expectedIsGlitch {
				t.Errorf("expected IsGlitch %v but got %v (glitches: %d, pool: %d)",
					expectedIsGlitch, result.IsGlitch, result.Glitches, tt.dicePool)
			}

			// Verify critical glitch: glitch with no hits
			expectedCriticalGlitch := result.IsGlitch && result.Hits == 0
			if result.IsCriticalGlitch != expectedCriticalGlitch {
				t.Errorf("expected IsCriticalGlitch %v but got %v (glitch: %v, hits: %d)",
					expectedCriticalGlitch, result.IsCriticalGlitch, result.IsGlitch, result.Hits)
			}
		})
	}
}

func TestRollDice_GlitchScenarios(t *testing.T) {
	// Test glitch scenarios with controlled dice rolls
	// We'll use a custom RNG that we can control
	t.Run("glitch with hits", func(t *testing.T) {
		// Create a scenario where we have more than half 1s but also some hits
		// This is tricky to test deterministically, so we'll test the logic
		// by rolling many times and checking the glitch detection works
		rng := rand.New(rand.NewSource(123))
		glitchCount := 0
		criticalGlitchCount := 0
		totalRolls := 1000

		for i := 0; i < totalRolls; i++ {
			result := RollDice(10, rng)
			if result.IsGlitch {
				glitchCount++
				if result.IsCriticalGlitch {
					criticalGlitchCount++
					// Critical glitch must have no hits
					if result.Hits != 0 {
						t.Errorf("critical glitch should have 0 hits but got %d", result.Hits)
					}
				}
			}
		}

		// We should see some glitches in 1000 rolls of 10 dice
		if glitchCount == 0 {
			t.Log("warning: no glitches detected in 1000 rolls (this is possible but unlikely)")
		}

		// Critical glitches should be a subset of glitches
		if criticalGlitchCount > glitchCount {
			t.Errorf("critical glitches (%d) cannot exceed total glitches (%d)",
				criticalGlitchCount, glitchCount)
		}
	})
}

func TestRollAction(t *testing.T) {
	attrResolver := func(attr string) (int, error) {
		attrs := map[string]int{"REA": 5, "INT": 4}
		return attrs[attr], nil
	}

	improvementResolver := func(improvement string) (int, error) {
		improvements := map[string]int{"Dodge": 2}
		return improvements[improvement], nil
	}

	rng := rand.New(rand.NewSource(42))

	tests := []struct {
		name                string
		action              *Action
		attrResolver        AttributeResolver
		improvementResolver ImprovementValueResolver
		rng                 *rand.Rand
		expectError         bool
		expectDicePool      int
	}{
		{
			name:                "nil action",
			action:              nil,
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         true,
		},
		{
			name: "action with None dice",
			action: &Action{
				Name: "Test Action",
				Type: "Free",
				Test: Test{
					Dice: "None",
				},
				Source: "SR5",
			},
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         false,
			expectDicePool:      0,
		},
		{
			name: "valid action with formula",
			action: &Action{
				Name: "Melee Defense",
				Type: "No",
				Test: Test{
					Dice: "{REA} + {INT} + {Improvement Value: Dodge}",
				},
				Source: "SR5",
			},
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         false,
			expectDicePool:      11, // 5 + 4 + 2
		},
		{
			name: "action with invalid formula",
			action: &Action{
				Name: "Invalid Action",
				Type: "Simple",
				Test: Test{
					Dice: "{REA} + invalid",
				},
				Source: "SR5",
			},
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := RollAction(tt.action, tt.attrResolver, tt.improvementResolver, tt.rng)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error but got none")
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error: %v", err)
				}
				if result.ActionName != tt.action.Name {
					t.Errorf("expected action name %q but got %q", tt.action.Name, result.ActionName)
				}
				if result.DicePool != tt.expectDicePool {
					t.Errorf("expected dice pool %d but got %d", tt.expectDicePool, result.DicePool)
				}
			}
		})
	}
}

func TestRollActionByName(t *testing.T) {
	attrResolver := func(attr string) (int, error) {
		attrs := map[string]int{"REA": 5, "INT": 4}
		return attrs[attr], nil
	}

	improvementResolver := func(improvement string) (int, error) {
		improvements := map[string]int{"Dodge": 2}
		return improvements[improvement], nil
	}

	rng := rand.New(rand.NewSource(42))

	tests := []struct {
		name                string
		actionName          string
		attrResolver        AttributeResolver
		improvementResolver ImprovementValueResolver
		rng                 *rand.Rand
		expectError         bool
		expectName          string
	}{
		{
			name:                "valid action name",
			actionName:          "Melee Defense",
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         false,
			expectName:          "Melee Defense",
		},
		{
			name:                "case insensitive",
			actionName:          "melee defense",
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         false,
			expectName:          "Melee Defense",
		},
		{
			name:                "non-existent action",
			actionName:          "Non-Existent Action",
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         true,
		},
		{
			name:                "action with None dice",
			actionName:          "Drop Object",
			attrResolver:        attrResolver,
			improvementResolver: improvementResolver,
			rng:                 rng,
			expectError:         false,
			expectName:          "Drop Object",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := RollActionByName(tt.actionName, tt.attrResolver, tt.improvementResolver, tt.rng)
			if tt.expectError {
				if err == nil {
					t.Errorf("expected error but got none")
				}
			} else {
				if err != nil {
					t.Errorf("unexpected error: %v", err)
				}
				if result.ActionName != tt.expectName {
					t.Errorf("expected action name %q but got %q", tt.expectName, result.ActionName)
				}
			}
		})
	}
}

func TestRollDice_EdgeCases(t *testing.T) {
	rng := rand.New(rand.NewSource(999))

	t.Run("single die", func(t *testing.T) {
		result := RollDice(1, rng)
		if len(result.Rolls) != 1 {
			t.Errorf("expected 1 roll but got %d", len(result.Rolls))
		}
		// With 1 die, glitch requires > 0.5 ones, so 1 one = glitch
		// But critical glitch requires glitch AND no hits
		if result.Rolls[0] == 1 {
			if !result.IsGlitch {
				t.Error("expected glitch with 1 die showing 1")
			}
			if result.Hits == 0 && !result.IsCriticalGlitch {
				t.Error("expected critical glitch with 1 die showing 1 and no hits")
			}
		}
	})

	t.Run("two dice", func(t *testing.T) {
		result := RollDice(2, rng)
		if len(result.Rolls) != 2 {
			t.Errorf("expected 2 rolls but got %d", len(result.Rolls))
		}
		// With 2 dice, glitch requires > 1 one, so 2 ones = glitch
		expectedGlitch := result.Glitches > 1
		if result.IsGlitch != expectedGlitch {
			t.Errorf("expected IsGlitch %v but got %v (glitches: %d)",
				expectedGlitch, result.IsGlitch, result.Glitches)
		}
	})

	t.Run("three dice", func(t *testing.T) {
		result := RollDice(3, rng)
		if len(result.Rolls) != 3 {
			t.Errorf("expected 3 rolls but got %d", len(result.Rolls))
		}
		// With 3 dice, glitch requires > 1.5 ones, so 2+ ones = glitch
		expectedGlitch := result.Glitches > 1
		if result.IsGlitch != expectedGlitch {
			t.Errorf("expected IsGlitch %v but got %v (glitches: %d)",
				expectedGlitch, result.IsGlitch, result.Glitches)
		}
	})
}

func TestEvaluateDiceFormula_ComplexFormulas(t *testing.T) {
	attrResolver := func(attr string) (int, error) {
		attrs := map[string]int{
			"REA": 5,
			"INT": 4,
			"BOD": 6,
			"AGI": 5,
			"WIL": 4,
			"LOG": 5,
			"STR": 6,
			"CHA": 3,
		}
		return attrs[attr], nil
	}

	improvementResolver := func(improvement string) (int, error) {
		improvements := map[string]int{
			"Dodge":                2,
			"SpellResistance":      1,
			"SurpriseResist":       1,
			"DetectionSpellResist": 2,
		}
		return improvements[improvement], nil
	}

	tests := []struct {
		name           string
		formula        string
		expectedResult int
	}{
		{
			name:           "four attributes",
			formula:        "{LOG} + {WIL} + {Improvement Value: SpellResistance} + {Improvement Value: DetectionSpellResist}",
			expectedResult: 12, // 5 + 4 + 1 + 2
		},
		{
			name:           "subtraction with multiple terms",
			formula:        "{REA} + {INT} + {Improvement Value: Dodge} - 2",
			expectedResult: 9, // 5 + 4 + 2 - 2
		},
		{
			name:           "all physical attributes",
			formula:        "{BOD} + {AGI} + {STR}",
			expectedResult: 17, // 6 + 5 + 6
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := EvaluateDiceFormula(tt.formula, attrResolver, improvementResolver)
			if err != nil {
				t.Errorf("unexpected error: %v", err)
			}
			if result != tt.expectedResult {
				t.Errorf("expected result %d but got %d", tt.expectedResult, result)
			}
		})
	}
}
