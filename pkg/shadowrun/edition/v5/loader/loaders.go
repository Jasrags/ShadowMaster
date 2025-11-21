package loader

import (
	"shadowmaster/pkg/shadowrun/edition/v5"
)

// LoadActionsFromXML loads actions.xml into ActionsChummer struct
func LoadActionsFromXML(filePath string) (*v5.ActionsChummer, error) {
	return LoadXMLFile[v5.ActionsChummer](filePath)
}

// LoadBooksFromXML loads books.xml into BooksChummer struct
func LoadBooksFromXML(filePath string) (*v5.BooksChummer, error) {
	return LoadXMLFile[v5.BooksChummer](filePath)
}

// LoadContactsFromXML loads contacts.xml into ContactsChummer struct
func LoadContactsFromXML(filePath string) (*v5.ContactsChummer, error) {
	return LoadXMLFile[v5.ContactsChummer](filePath)
}

// LoadStringsFromXML loads strings.xml into StringsChummer struct
func LoadStringsFromXML(filePath string) (*v5.StringsChummer, error) {
	return LoadXMLFile[v5.StringsChummer](filePath)
}

// LoadSheetsFromXML loads sheets.xml into SheetsChummer struct
func LoadSheetsFromXML(filePath string) (*v5.SheetsChummer, error) {
	return LoadXMLFile[v5.SheetsChummer](filePath)
}

// LoadTipsFromXML loads tips.xml into TipsChummer struct
func LoadTipsFromXML(filePath string) (*v5.TipsChummer, error) {
	return LoadXMLFile[v5.TipsChummer](filePath)
}

// LoadReferencesFromXML loads references.xml into ReferencesChummer struct
func LoadReferencesFromXML(filePath string) (*v5.ReferencesChummer, error) {
	return LoadXMLFile[v5.ReferencesChummer](filePath)
}

// LoadRangesFromXML loads ranges.xml into RangesChummer struct
func LoadRangesFromXML(filePath string) (*v5.RangesChummer, error) {
	return LoadXMLFile[v5.RangesChummer](filePath)
}

// LoadQualityLevelsFromXML loads qualitylevels.xml into QualityLevelsChummer struct
func LoadQualityLevelsFromXML(filePath string) (*v5.QualityLevelsChummer, error) {
	return LoadXMLFile[v5.QualityLevelsChummer](filePath)
}

// LoadEchoesFromXML loads echoes.xml into EchoesChummer struct
func LoadEchoesFromXML(filePath string) (*v5.EchoesChummer, error) {
	return LoadXMLFile[v5.EchoesChummer](filePath)
}

// LoadImprovementsFromXML loads improvements.xml into ImprovementsChummer struct
func LoadImprovementsFromXML(filePath string) (*v5.ImprovementsChummer, error) {
	return LoadXMLFile[v5.ImprovementsChummer](filePath)
}

// LoadLicensesFromXML loads licenses.xml into LicensesChummer struct
func LoadLicensesFromXML(filePath string) (*v5.LicensesChummer, error) {
	return LoadXMLFile[v5.LicensesChummer](filePath)
}

// LoadMentorsFromXML loads mentors.xml into MentorsChummer struct
func LoadMentorsFromXML(filePath string) (*v5.MentorsChummer, error) {
	return LoadXMLFile[v5.MentorsChummer](filePath)
}

// LoadMetamagicFromXML loads metamagic.xml into MetamagicChummer struct
func LoadMetamagicFromXML(filePath string) (*v5.MetamagicChummer, error) {
	return LoadXMLFile[v5.MetamagicChummer](filePath)
}

// LoadOptionsFromXML loads options.xml into OptionsChummer struct
func LoadOptionsFromXML(filePath string) (*v5.OptionsChummer, error) {
	return LoadXMLFile[v5.OptionsChummer](filePath)
}

// LoadParagonsFromXML loads paragons.xml into ParagonsChummer struct
func LoadParagonsFromXML(filePath string) (*v5.ParagonsChummer, error) {
	return LoadXMLFile[v5.ParagonsChummer](filePath)
}

// LoadPrioritiesFromXML loads priorities.xml into PrioritiesChummer struct
func LoadPrioritiesFromXML(filePath string) (*v5.PrioritiesChummer, error) {
	return LoadXMLFile[v5.PrioritiesChummer](filePath)
}

// LoadSpiritPowersFromXML loads spiritpowers.xml into SpiritPowersChummer struct
func LoadSpiritPowersFromXML(filePath string) (*v5.SpiritPowersChummer, error) {
	return LoadXMLFile[v5.SpiritPowersChummer](filePath)
}

// LoadSettingsFromXML loads settings.xml into SettingsChummer struct
func LoadSettingsFromXML(filePath string) (*v5.SettingsChummer, error) {
	return LoadXMLFile[v5.SettingsChummer](filePath)
}

