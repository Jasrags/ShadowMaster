package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains lifestyle structures generated from lifestyles.xsd

// LifestyleCategory represents a lifestyle category
type LifestyleCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// LifestyleCategories represents a collection of lifestyle categories
type LifestyleCategories struct {
	Category []LifestyleCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// FreeGrid represents a free grid entry
type FreeGrid struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// FreeGrids represents a collection of free grids
type FreeGrids struct {
	FreeGrid []FreeGrid `xml:"freegrid,omitempty" json:"freegrid,omitempty"`
}

// LifestyleItem represents a lifestyle definition
type LifestyleItem struct {
	ID string `xml:"id" json:"id"`
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	common.Visibility
	Cost string `xml:"cost" json:"cost"`
	Dice string `xml:"dice" json:"dice"`
	FreeGrids *FreeGrids `xml:"freegrids,omitempty" json:"freegrids,omitempty"`
	LP string `xml:"lp" json:"lp"`
	CostForArea *int `xml:"costforarea,omitempty" json:"costforarea,omitempty"`
	CostForComforts *int `xml:"costforcomforts,omitempty" json:"costforcomforts,omitempty"`
	CostForSecurity *int `xml:"costforsecurity,omitempty" json:"costforsecurity,omitempty"`
	AllowBonusLP *string `xml:"allowbonuslp,omitempty" json:"allowbonuslp,omitempty"`
// Multiplier represents multiplier
// Type: numeric_string, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 3
// Examples: -10, -20, 10 (and 2 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -10, -20, 10
// Length: 2-3 characters
	Multiplier string `xml:"multiplier" json:"multiplier"`
	Increment *string `xml:"increment,omitempty" json:"increment,omitempty"`
	common.SourceReference
}

// LifestyleItems represents a collection of lifestyles
type LifestyleItems struct {
	Lifestyle []LifestyleItem `xml:"lifestyle,omitempty" json:"lifestyle,omitempty"`
}

// Comfort represents a comfort entry
type Comfort struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	Minimum int `xml:"minimum" json:"minimum"`
	Limit *int `xml:"limit,omitempty" json:"limit,omitempty"`
}

// Comforts represents a collection of comforts
type Comforts struct {
	Comfort []Comfort `xml:"comfort" json:"comfort"`
}

// Entertainment represents an entertainment entry
type Entertainment struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	Minimum int `xml:"minimum" json:"minimum"`
	Limit *int `xml:"limit,omitempty" json:"limit,omitempty"`
}

// Entertainments represents a collection of entertainments
type Entertainments struct {
	Entertainment []Entertainment `xml:"entertainment" json:"entertainment"`
}

// Necessity represents a necessity entry
type Necessity struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	Minimum int `xml:"minimum" json:"minimum"`
	Limit *int `xml:"limit,omitempty" json:"limit,omitempty"`
}

// Necessities represents a collection of necessities
type Necessities struct {
	Necessity []Necessity `xml:"necessity" json:"necessity"`
}

// Neighborhood represents a neighborhood entry
type Neighborhood struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	Minimum int `xml:"minimum" json:"minimum"`
	Limit *int `xml:"limit,omitempty" json:"limit,omitempty"`
}

// Neighborhoods represents a collection of neighborhoods
type Neighborhoods struct {
	Neighborhood []Neighborhood `xml:"neighborhood" json:"neighborhood"`
}

// Security represents a security entry
type Security struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	Minimum int `xml:"minimum" json:"minimum"`
	Limit *int `xml:"limit,omitempty" json:"limit,omitempty"`
}

// Securities represents a collection of securities
type Securities struct {
	Security []Security `xml:"security" json:"security"`
}

// LifestyleSelectText represents a selecttext element
type LifestyleSelectText struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
	XML *string `xml:"xml,attr,omitempty" json:"+@xml,omitempty"`
	XPath *string `xml:"xpath,attr,omitempty" json:"+@xpath,omitempty"`
	AllowEdit *string `xml:"allowedit,attr,omitempty" json:"+@allowedit,omitempty"`
	Select *string `xml:"select,attr,omitempty" json:"+@select,omitempty"`
}

// LifestyleQualityBonus represents a lifestyle quality bonus
type LifestyleQualityBonus struct {
	SelectText []LifestyleSelectText `xml:"selecttext,omitempty" json:"selecttext,omitempty"`
}

// LifestyleQuality represents a lifestyle quality
type LifestyleQuality struct {
// ID represents id
// Usage: always present (100.0%)
// Unique Values: 112
// Examples: 91ac54bf-0f7d-40f3-81bf-dc32e62fd94e, af5b1436-abc9-4f3d-9521-64cf58724e0a, 6f638af3-39c0-4d29-8a5d-1e0bc67ea922 (and 7 more)
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	common.Visibility
	Category string `xml:"category" json:"category"`
	LP int `xml:"lp" json:"lp"`
	Cost *string `xml:"cost,omitempty" json:"cost,omitempty"`
	Bonus *LifestyleQualityBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Multiplier *int `xml:"multiplier,omitempty" json:"multiplier,omitempty"`
	MultiplierBaseOnly *int `xml:"multiplierbaseonly,omitempty" json:"multiplierbaseonly,omitempty"`
	AreaMaximum *int `xml:"areamaximum,omitempty" json:"areamaximum,omitempty"`
// ComfortsMaximum represents comfortsmaximum
// Type: numeric_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: -1
// Note: 100.0% of values are numeric strings
	ComfortsMaximum *int `xml:"comfortsmaximum,omitempty" json:"comfortsmaximum,omitempty"`
	SecurityMaximum *int `xml:"securitymaximum,omitempty" json:"securitymaximum,omitempty"`
	AreaMinimum *int `xml:"areaminimum,omitempty" json:"areaminimum,omitempty"`
	ComfortsMinimum *int `xml:"comfortsminimum,omitempty" json:"comfortsminimum,omitempty"`
	SecurityMinimum *int `xml:"securityminimum,omitempty" json:"securityminimum,omitempty"`
	Area *int `xml:"area,omitempty" json:"area,omitempty"`
	Comforts *int `xml:"comforts,omitempty" json:"comforts,omitempty"`
	Security *int `xml:"security,omitempty" json:"security,omitempty"`
	Allowed *string `xml:"allowed,omitempty" json:"allowed,omitempty"`
	AllowMultiple *string `xml:"allowmultiple,omitempty" json:"allowmultiple,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
	common.SourceReference
}

// LifestyleQualityItems represents a collection of lifestyle qualities
type LifestyleQualityItems struct {
	Quality []LifestyleQuality `xml:"quality" json:"quality"`
}

// LifestyleCost represents a lifestyle cost entry
type LifestyleCost struct {
// LP represents lp
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: 2, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -1, 0, 1, 2, 3, 4, 5
// Length: 1-2 characters
	LP string `xml:"lp" json:"lp"`
	Cost string `xml:"cost" json:"cost"`
}

// LifestyleCosts represents a collection of lifestyle costs
type LifestyleCosts struct {
	Cost []LifestyleCost `xml:"cost" json:"cost"`
}

// SafehouseCost represents a safehouse cost entry
type SafehouseCost struct {
// LP represents lp
// Type: numeric_string, mixed_boolean, enum_candidate
// Usage: always present (100.0%)
// Unique Values: 7
// Examples: 2, 1, 1 (and 7 more)
// Note: 100.0% of values are numeric strings
// Enum Candidate: -1, 0, 1, 2, 3, 4, 5
// Length: 1-2 characters
	LP string `xml:"lp" json:"lp"`
	Cost string `xml:"cost" json:"cost"`
}

// SafehouseCosts represents a collection of safehouse costs
type SafehouseCosts struct {
	Cost []SafehouseCost `xml:"cost" json:"cost"`
}

// Borough represents a borough entry
type Borough struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	SecRating *string `xml:"secRating,omitempty" json:"secRating,omitempty"`
}

// District represents a district entry
type District struct {
	Name string `xml:"name" json:"name"`
	Borough []Borough `xml:"borough,omitempty" json:"borough,omitempty"`
}

// City represents a city entry
type City struct {
// Name represents name
// Usage: always present (100.0%)
// Unique Values: 134
// Examples: Black Diamond, Bolse, Algona (and 7 more)
// Length: 4-31 characters
	Name string `xml:"name" json:"name"`
	District []District `xml:"district,omitempty" json:"district,omitempty"`
}

// Cities represents a collection of cities
type Cities struct {
	City []City `xml:"city" json:"city"`
}

// LifestylesChummer represents the root chummer element for lifestyles
type LifestylesChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []LifestyleCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Lifestyles *LifestyleItems `xml:"lifestyles,omitempty" json:"lifestyles,omitempty"`
// Comforts represents comforts
// Type: numeric_string, boolean_string
// Usage: always present (100.0%)
// Unique Values: 1
// Examples: 1
// Note: 100.0% of values are numeric strings
// Note: 100.0% of values are boolean strings
	Comforts *Comforts `xml:"comforts,omitempty" json:"comforts,omitempty"`
	Entertainments *Entertainments `xml:"entertainments,omitempty" json:"entertainments,omitempty"`
	Necessities *Necessities `xml:"necessities,omitempty" json:"necessities,omitempty"`
	Neighborhoods *Neighborhoods `xml:"neighborhoods,omitempty" json:"neighborhoods,omitempty"`
	Securities *Securities `xml:"securities,omitempty" json:"securities,omitempty"`
	Qualities *LifestyleQualityItems `xml:"qualities,omitempty" json:"qualities,omitempty"`
	Costs *LifestyleCosts `xml:"costs,omitempty" json:"costs,omitempty"`
	SafehouseCosts *SafehouseCosts `xml:"safehousecosts,omitempty" json:"safehousecosts,omitempty"`
	Cities *Cities `xml:"cities,omitempty" json:"cities,omitempty"`
}

