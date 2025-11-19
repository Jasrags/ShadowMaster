package v5

// DataLimbCounts contains limb count options keyed by their ID (lowercase with underscores)
var DataLimbCounts = map[string]LimbCount{
	"4_2_arms_2_legs": {
		Name:      "4 (2 arms, 2 legs)",
		LimbCount: "4",
		Exclude:   &[]string{"torso,skull"}[0],
	},
	"5_2_arms_2_legs_skull": {
		Name:      "5 (2 arms, 2 legs, skull)",
		LimbCount: "5",
		Exclude:   &[]string{"torso"}[0],
	},
	"5_2_arms_2_legs_torso": {
		Name:      "5 (2 arms, 2 legs, torso)",
		LimbCount: "5",
		Exclude:   &[]string{"skull"}[0],
	},
	"6_2_arms_2_legs_torso_skull": {
		Name:      "6 (2 arms, 2 legs, torso, skull)",
		LimbCount: "6",
	},
}

// DataPDFArguments contains PDF argument configurations keyed by their ID (lowercase with underscores)
var DataPDFArguments = map[string]PDFArgument{
	"web_browser": {
		Name:     "Web Browser",
		Value:    "\"file://{absolutepath}#page={page}\"",
		AppNames: &PDFArgumentAppNames{AppName: []string{"iexplore.exe", "msedge.exe", "chrome.exe", "firefox.exe", "safari.exe", "opera.exe", "qqbrowser.exe", "sogouexplorer.exe", "browser.exe", "brave.exe"}},
	},
	"acrobat_style": {
		Name:     "Acrobat-style",
		Value:    "/A \"page={page}\" \"{localpath}\"",
		AppNames: &PDFArgumentAppNames{AppName: []string{"AcroRd32.exe", "Acrobat.exe", "FoxitReader.exe", "FoxitPDFReader.exe", "FoxitReaderPortable.exe", "PDFXCView.exe", "PDFXEdit.exe", "PDFXHost32.exe", "PDFXHost64.exe"}},
	},
	"acrobat_style_new_instance": {
		Name:     "Acrobat-style - New instance",
		Value:    "/A /N \"page={page}\" \"{localpath}\"",
		AppNames: &PDFArgumentAppNames{AppName: []string{"AcroRd32.exe", "Acrobat.exe", "FoxitReader.exe", "FoxitPDFReader.exe", "FoxitReaderPortable.exe", "PDFXCView.exe", "PDFXEdit.exe", "PDFXHost32.exe", "PDFXHost64.exe"}},
	},
	"unix_style": {
		Name:  "Unix-style",
		Value: "-p {page} \"{localpath}\"",
	},
	"sumatra_re_use_instance": {
		Name:     "Sumatra - Re-use instance",
		Value:    "-reuse-instance -page {page} \"{localpath}\"",
		AppNames: &PDFArgumentAppNames{AppName: []string{"sumatrapdf.exe", "sumatrapdfportable.exe"}},
	},
	"sumatra": {
		Name:     "Sumatra",
		Value:    "-page {page} \"{localpath}\"",
		AppNames: &PDFArgumentAppNames{AppName: []string{"sumatrapdf.exe", "sumatrapdfportable.exe"}},
	},
}

// DataBlackMarketPipelineCategories contains black market pipeline category names
var DataBlackMarketPipelineCategories = []string{
	"Armor",
	"Bioware",
	"Cyberware",
	"Drugs",
	"Electronics",
	"Geneware",
	"Magic",
	"Nanoware",
	"Software",
	"Vehicles",
	"Weapons",
}

// DataAvailMap contains availability mapping entries keyed by their ID (lowercase with underscores)
var DataAvailMap = map[string]AvailMapEntry{
	"1000": {
		ID:       "0A39C082-AE54-4096-94D3-0CA213ACDA0A",
		Value:    "100.0",
		Duration: "6",
		Interval: "String_Hours",
	},
	"10000": {
		ID:       "335BB55A-A1A7-48C4-8852-4EA11929F242",
		Value:    "1000.0",
		Duration: "1",
		Interval: "String_Day",
	},
	"100000": {
		ID:       "0DC43627-56E8-46DB-B4C8-3A389C6999D2",
		Value:    "10000.0",
		Duration: "2",
		Interval: "String_Days",
	},
	"1000000": {
		ID:       "06B72D98-3510-4A91-825E-CB55AD873749",
		Value:    "100000.0",
		Duration: "1",
		Interval: "String_Week",
	},
	"79228162514264337593543950335": {
		ID:       "67BC5453-8AD0-4C69-A91C-8259FD070A1D",
		Value:    "79228162514264337593543950335",
		Duration: "1",
		Interval: "String_Month",
	},
}
