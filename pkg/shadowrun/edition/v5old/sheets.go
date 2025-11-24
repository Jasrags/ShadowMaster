package v5

// This file contains sheet structures generated from sheets.xml

// Sheet represents a sheet definition
type Sheet struct {
	// ID represents id
	// Usage: always present (100.0%)
	// Unique Values: 102
	// Examples: 8b16e238-18c6-40e0-85ca-a3a6c1854bd9, 88ffe3f4-f216-44bf-85f5-4dd27034599b, 57ba779b-c7aa-4699-bd3b-4d0cbc1f8bd7 (and 7 more)
	ID       string `xml:"id" json:"id"`
	Name     string `xml:"name" json:"name"`
	Filename string `xml:"filename" json:"filename"`
}

// Sheets represents a collection of sheets for a language
type Sheets struct {
	// Lang represents lang
	// Usage: always present (100.0%)
	// Unique Values: 6
	// Examples: en-us, de-de, fr-fr (and 3 more)
	// Enum Candidate: de-de, en-us, fr-fr, ja-jp, pt-br, zh-cn
	Lang  string  `xml:"lang,attr" json:"+@lang"`
	Sheet []Sheet `xml:"sheet" json:"sheet"`
}

// SheetsChummer represents the root chummer element for sheets
type SheetsChummer struct {
	Sheets []Sheets `xml:"sheets" json:"sheets"`
}
