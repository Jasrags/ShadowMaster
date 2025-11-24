# Proposed Changes to actions.go Structure

## Overview

After examining `actions.xml`, the current `actions.go` struct is missing several fields and incorrectly requires the `test` element when some actions use `boosts` instead.

## Current Issues

1. **Test field is required** but 12 actions don't have a `<test>` element - they use `<boosts>` instead
2. **Missing optional fields**: category, specname, initiativecost, edgecost, requireunlock
3. **ActionTest is incomplete**: missing limit, bonusstring, defenselimit fields
4. **Missing Boosts structure** entirely

## Proposed Changes

### 1. Update ActionTest Structure

**Current:**
```go
type ActionTest struct {
    Dice string `xml:"dice" json:"dice"`
}
```

**Proposed:**
```go
type ActionTest struct {
    // Dice - required when test element is present
    Dice string `xml:"dice" json:"dice"`
    
    // Limit - optional
    Limit *string `xml:"limit,omitempty" json:"limit,omitempty"`
    
    // BonusString - optional descriptive text
    BonusString *string `xml:"bonusstring,omitempty" json:"bonusstring,omitempty"`
    
    // DefenseLimit - optional
    DefenseLimit *string `xml:"defenselimit,omitempty" json:"defenselimit,omitempty"`
}
```

### 2. Add ActionBoost and ActionBoosts Structures

**New Types:**
```go
// ActionBoost represents a single boost within a boosts element
// Used for defensive/interrupt actions that modify other actions
type ActionBoost struct {
    // Name - required: name of the action being boosted
    // Examples: "Melee Defense", "Ranged Defense", "LOG Attack Defense"
    Name string `xml:"name" json:"name"`
    
    // Duration - required: how long the boost lasts
    // Examples: "One Attack", "Rest of Turn"
    Duration string `xml:"duration" json:"duration"`
    
    // DiceBonus - required: dice bonus formula
    // Examples: "{Unarmed Combat}", "{Gymnastics}", "{WIL}"
    DiceBonus string `xml:"dicebonus" json:"dicebonus"`
    
    // AddLimit - optional: additional limit
    // Examples: "{Physical}", "{Weapon: Accuracy}"
    AddLimit *string `xml:"addlimit,omitempty" json:"addlimit,omitempty"`
}

// ActionBoosts represents a collection of boosts
type ActionBoosts struct {
    Boost []ActionBoost `xml:"boost" json:"boost"`
}
```

### 3. Update Action Structure

**Current:**
```go
type Action struct {
    ID string `xml:"id" json:"id"`
    Name string `xml:"name" json:"name"`
    Type string `xml:"type" json:"type"`
    Test ActionTest `xml:"test" json:"test"`  // REQUIRED - WRONG!
    Source string `xml:"source" json:"source"`
    Page string `xml:"page" json:"page"`
}
```

**Proposed:**
```go
type Action struct {
    // Required fields
    ID string `xml:"id" json:"id"`
    Name string `xml:"name" json:"name"`
    Type string `xml:"type" json:"type"`
    Source string `xml:"source" json:"source"`
    Page string `xml:"page" json:"page"`
    
    // Optional fields
    Category *string `xml:"category,omitempty" json:"category,omitempty"`
    SpecName *string `xml:"specname,omitempty" json:"specname,omitempty"`
    InitiativeCost *int `xml:"initiativecost,omitempty" json:"initiativecost,omitempty"`
    EdgeCost *int `xml:"edgecost,omitempty" json:"edgecost,omitempty"`
    RequireUnlock *string `xml:"requireunlock,omitempty" json:"requireunlock,omitempty"`
    
    // Mutually exclusive: actions have either Test OR Boosts, not both
    Test *ActionTest `xml:"test,omitempty" json:"test,omitempty"`      // OPTIONAL
    Boosts *ActionBoosts `xml:"boosts,omitempty" json:"boosts,omitempty"`  // OPTIONAL
}
```

## XML Structure Examples

### Action with Test Element
```xml
<action>
    <id>c649963a-b88f-473f-96d0-2f38cd054d86</id>
    <name>Melee Defense</name>
    <type>No</type>
    <test>
        <dice>{REA} + {INT} + {Improvement Value: Dodge}</dice>
    </test>
    <source>SR5</source>
    <page>168</page>
</action>
```

### Action with Boosts Element
```xml
<action>
    <id>072fb7bd-0e7b-4f81-a2d6-5356f398dd5a</id>
    <name>Block</name>
    <type>Interrupt</type>
    <initiativecost>5</initiativecost>
    <specname>Blocking</specname>
    <boosts>
        <boost>
            <name>Melee Defense</name>
            <duration>One Attack</duration>
            <dicebonus>{Unarmed Combat}</dicebonus>
            <addlimit>{Physical}</addlimit>
        </boost>
    </boosts>
    <source>SR5</source>
    <page>168</page>
</action>
```

### Action with Complete Test Element
```xml
<action>
    <id>5790e39b-2600-4b98-9a04-dcdf1643188e</id>
    <name>Fire Bow</name>
    <type>Simple</type>
    <test>
        <dice>{AGI} + {Weapon: Skill} v. {Action: Ranged Defense}</dice>
        <limit>{Weapon: Accuracy}</limit>
        <bonusstring>On success, target must resist {Weapon: DV} + net hits damage...</bonusstring>
    </test>
    <source>SR5</source>
    <page>165</page>
</action>
```

## Statistics from actions.xml

- **Total Actions**: 260
- **Actions with Test**: 248 (95.4%)
- **Actions with Boosts**: 12 (4.6%)
- **Actions with Category**: ~50 (Matrix actions)
- **Actions with SpecName**: ~10
- **Actions with InitiativeCost**: ~30 (Interrupt actions)
- **Actions with EdgeCost**: ~2
- **Actions with RequireUnlock**: ~20 (Martial arts techniques)

## Impact

- **Breaking Change**: Making `Test` optional will require updating any code that assumes it's always present
- **New Fields**: Adding optional fields is non-breaking
- **Validation**: Should validate that actions have either Test OR Boosts (not both, not neither)

## Implementation Notes

1. Empty element `<requireunlock />` is handled as `*string` - presence indicates true
2. Test and Boosts are mutually exclusive - an action should have one or the other
3. All 12 actions with boosts are defensive/interrupt actions
4. The Dice field in ActionTest can be "None" or "Variable" for some actions

