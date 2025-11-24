package v5

// Code generated from licenses.xml. DO NOT EDIT.

var licensesData = &LicensesChummer{
	Licenses: Licenses{
		License: []string{
			"Adept License",
			"Automatic Weapons License",
			"Blunt Weapons License",
			"Bodyguard License",
			"Bounty Hunter's License",
			"Concealed Carry Permit",
			"Cyberdeck License",
			"Driver's License",
			"Drone License",
			"Exotic Weapons License",
			"Explosives License",
			"Firearms License",
			"Heavy Weapons License",
			"Hunting License",
			"Large Blades License",
			"Mage License",
			"Marine License",
			"Matrix Software License",
			"Medical License",
			"Military Ammunition License",
			"Military Armor License",
			"Military Weapons License",
			"Pet License",
			"Pilot License",
			"Pistol License",
			"Private Investigator License",
			"Projectile License",
			"Restricted Armor License",
			"Restricted Bioware License",
			"Restricted Cyberware License",
			"Rifle License",
			"Shotgun License",
			"Small Blades License",
			"Summoner License",
			"Talismonger License",
			"Weapon License",
		},
	},
}

// GetLicensesData returns the loaded licenses data.
func GetLicensesData() *LicensesChummer {
	return licensesData
}

// GetAllLicenses returns all license types.
func GetAllLicenses() []string {
	return licensesData.Licenses.License
}
