package v5

import "shadowmaster/pkg/shadowrun/edition/v5/common"

// This file contains complex form structures generated from complexforms.xsd

// ComplexFormCategory represents a complex form category
type ComplexFormCategory struct {
	Content string `xml:",chardata" json:"+content,omitempty"`
}

// ComplexFormCategories represents a collection of complex form categories
type ComplexFormCategories struct {
	Category []ComplexFormCategory `xml:"category,omitempty" json:"category,omitempty"`
}

// ComplexFormItem represents a complex form definition
type ComplexFormItem struct {
	ID string `xml:"id" json:"id"`
	Name string `xml:"name" json:"name"`
	Target string `xml:"target" json:"target"`
	Duration string `xml:"duration" json:"duration"`
	FV string `xml:"fv" json:"fv"`
	common.SourceReference
	common.Visibility
	UseSkill *string `xml:"useskill,omitempty" json:"useskill,omitempty"`
	Bonus *common.BaseBonus `xml:"bonus,omitempty" json:"bonus,omitempty"`
	Required *common.Required `xml:"required,omitempty" json:"required,omitempty"`
	Forbidden *common.Forbidden `xml:"forbidden,omitempty" json:"forbidden,omitempty"`
}

// ComplexFormItems represents a collection of complex forms
type ComplexFormItems struct {
	ComplexForm []ComplexFormItem `xml:"complexform,omitempty" json:"complexform,omitempty"`
}

// ComplexFormsChummer represents the root chummer element for complex forms
type ComplexFormsChummer struct {
	Version *string `xml:"version,omitempty" json:"version,omitempty"`
	Categories []ComplexFormCategories `xml:"categories,omitempty" json:"categories,omitempty"`
	ComplexForms []ComplexFormItems `xml:"complexforms,omitempty" json:"complexforms,omitempty"`
}

