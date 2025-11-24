package v5

// Code generated from options.xml. DO NOT EDIT.

var optionsData = &OptionsChummer{
	LimbCounts: LimbCounts{
		Limb: []Limb{
			{
				Name: "4 (2 arms, 2 legs)",
				LimbCount: 4,
				Exclude: "torso,skull",
			},
			{
				Name: "5 (2 arms, 2 legs, skull)",
				LimbCount: 5,
				Exclude: "torso",
			},
			{
				Name: "5 (2 arms, 2 legs, torso)",
				LimbCount: 5,
				Exclude: "skull",
			},
			{
				Name: "6 (2 arms, 2 legs, torso, skull)",
				LimbCount: 6,
				Exclude: "",
			},
		},
	},
	PDFArguments: PDFArguments{
		PDFArgument: []PDFArgument{
			{
				Name: "Web Browser",
				Value: "\\\"file://{absolutepath}#page={page}\\\"",
				AppNames: &PDFAppNames{
					AppName: []string{
						"iexplore.exe",
						"msedge.exe",
						"chrome.exe",
						"firefox.exe",
						"safari.exe",
						"opera.exe",
						"qqbrowser.exe",
						"sogouexplorer.exe",
						"browser.exe",
						"brave.exe",
					},
				},
			},
			{
				Name: "Acrobat-style",
				Value: "/A \\\"page={page}\\\" \\\"{localpath}\\\"",
				AppNames: &PDFAppNames{
					AppName: []string{
						"AcroRd32.exe",
						"Acrobat.exe",
						"FoxitReader.exe",
						"FoxitPDFReader.exe",
						"FoxitReaderPortable.exe",
						"PDFXCView.exe",
						"PDFXEdit.exe",
						"PDFXHost32.exe",
						"PDFXHost64.exe",
					},
				},
			},
			{
				Name: "Acrobat-style - New instance",
				Value: "/A /N \\\"page={page}\\\" \\\"{localpath}\\\"",
				AppNames: &PDFAppNames{
					AppName: []string{
						"AcroRd32.exe",
						"Acrobat.exe",
						"FoxitReader.exe",
						"FoxitPDFReader.exe",
						"FoxitReaderPortable.exe",
						"PDFXCView.exe",
						"PDFXEdit.exe",
						"PDFXHost32.exe",
						"PDFXHost64.exe",
					},
				},
			},
			{
				Name: "Unix-style",
				Value: "-p {page} \\\"{localpath}\\\"",
			},
			{
				Name: "Sumatra - Re-use instance",
				Value: "-reuse-instance -page {page} \\\"{localpath}\\\"",
				AppNames: &PDFAppNames{
					AppName: []string{
						"sumatrapdf.exe",
						"sumatrapdfportable.exe",
					},
				},
			},
			{
				Name: "Sumatra",
				Value: "-page {page} \\\"{localpath}\\\"",
				AppNames: &PDFAppNames{
					AppName: []string{
						"sumatrapdf.exe",
						"sumatrapdfportable.exe",
					},
				},
			},
		},
	},
	BlackMarketPipelineCategories: BlackMarketPipelineCategories{
		Category: []string{
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
		},
	},
	AvailMap: AvailMap{
		Avail: []Avail{
			{
				ID: "0A39C082-AE54-4096-94D3-0CA213ACDA0A",
				Value: 100,
				Duration: 6,
				Interval: "String_Hours",
			},
			{
				ID: "335BB55A-A1A7-48C4-8852-4EA11929F242",
				Value: 1000,
				Duration: 1,
				Interval: "String_Day",
			},
			{
				ID: "0DC43627-56E8-46DB-B4C8-3A389C6999D2",
				Value: 10000,
				Duration: 2,
				Interval: "String_Days",
			},
			{
				ID: "06B72D98-3510-4A91-825E-CB55AD873749",
				Value: 100000,
				Duration: 1,
				Interval: "String_Week",
			},
			{
				ID: "67BC5453-8AD0-4C69-A91C-8259FD070A1D",
				Value: 7.922816251426434e+28,
				Duration: 1,
				Interval: "String_Month",
			},
		},
	},
}

// GetOptionsData returns the loaded options data.
func GetOptionsData() *OptionsChummer {
	return optionsData
}
