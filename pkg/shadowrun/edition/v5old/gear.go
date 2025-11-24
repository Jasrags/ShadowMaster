package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// GearCategory represents a gear category
// This uses CategoryWithShow from common package
type GearCategory = common.CategoryWithShow

// GearCategories represents a collection of gear categories
type GearCategories struct {
	Category []GearCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// GearsChummer represents the root chummer element for gear
type GearsChummer struct {
	Version    *string          `xml:"version,omitempty" json:"version,omitempty"`
	Categories []GearCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	Gears      []common.Gears   `xml:"gears,omitempty" json:"gears,omitempty"`
}

