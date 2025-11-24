package loader

import (
	"shadowmaster/pkg/shadowrun/edition/v5"
)

// LoadArmorFromXML loads armor.xml into ArmorChummer struct
func LoadArmorFromXML(filePath string) (*v5.ArmorChummer, error) {
	return LoadXMLFile[v5.ArmorChummer](filePath)
}

// LoadBiowareFromXML loads bioware.xml into BiowareChummer struct
func LoadBiowareFromXML(filePath string) (*v5.BiowareChummer, error) {
	return LoadXMLFile[v5.BiowareChummer](filePath)
}

// LoadComplexFormsFromXML loads complexforms.xml into ComplexFormsChummer struct
func LoadComplexFormsFromXML(filePath string) (*v5.ComplexFormsChummer, error) {
	return LoadXMLFile[v5.ComplexFormsChummer](filePath)
}

// LoadCritterPowersFromXML loads critterpowers.xml into CritterPowersChummer struct
func LoadCritterPowersFromXML(filePath string) (*v5.CritterPowersChummer, error) {
	return LoadXMLFile[v5.CritterPowersChummer](filePath)
}

// LoadCrittersFromXML loads critters.xml into CrittersChummer struct
func LoadCrittersFromXML(filePath string) (*v5.CrittersChummer, error) {
	return LoadXMLFile[v5.CrittersChummer](filePath)
}

// LoadCyberwareFromXML loads cyberware.xml into CyberwareChummer struct
func LoadCyberwareFromXML(filePath string) (*v5.CyberwareChummer, error) {
	return LoadXMLFile[v5.CyberwareChummer](filePath)
}

// LoadDrugComponentsFromXML loads drugcomponents.xml into DrugComponentsChummer struct
func LoadDrugComponentsFromXML(filePath string) (*v5.DrugComponentsChummer, error) {
	return LoadXMLFile[v5.DrugComponentsChummer](filePath)
}

// LoadLifeModulesFromXML loads lifemodules.xml into LifeModulesChummer struct
func LoadLifeModulesFromXML(filePath string) (*v5.LifeModulesChummer, error) {
	return LoadXMLFile[v5.LifeModulesChummer](filePath)
}

// LoadLifestylesFromXML loads lifestyles.xml into LifestylesChummer struct
func LoadLifestylesFromXML(filePath string) (*v5.LifestylesChummer, error) {
	return LoadXMLFile[v5.LifestylesChummer](filePath)
}

// LoadMartialArtsFromXML loads martialarts.xml into MartialArtsChummer struct
func LoadMartialArtsFromXML(filePath string) (*v5.MartialArtsChummer, error) {
	return LoadXMLFile[v5.MartialArtsChummer](filePath)
}

// LoadMetatypesFromXML loads metatypes.xml into MetatypesChummer struct
func LoadMetatypesFromXML(filePath string) (*v5.MetatypesChummer, error) {
	return LoadXMLFile[v5.MetatypesChummer](filePath)
}

// LoadPacksFromXML loads packs.xml into PacksChummer struct
func LoadPacksFromXML(filePath string) (*v5.PacksChummer, error) {
	return LoadXMLFile[v5.PacksChummer](filePath)
}

// LoadPowersFromXML loads powers.xml into PowersChummer struct
func LoadPowersFromXML(filePath string) (*v5.PowersChummer, error) {
	return LoadXMLFile[v5.PowersChummer](filePath)
}

// LoadProgramsFromXML loads programs.xml into ProgramsChummer struct
func LoadProgramsFromXML(filePath string) (*v5.ProgramsChummer, error) {
	return LoadXMLFile[v5.ProgramsChummer](filePath)
}

// LoadQualitiesFromXML loads qualities.xml into QualitiesChummer struct
func LoadQualitiesFromXML(filePath string) (*v5.QualitiesChummer, error) {
	return LoadXMLFile[v5.QualitiesChummer](filePath)
}

// LoadSkillsFromXML loads skills.xml into SkillsChummer struct
func LoadSkillsFromXML(filePath string) (*v5.SkillsChummer, error) {
	return LoadXMLFile[v5.SkillsChummer](filePath)
}

// LoadSpellsFromXML loads spells.xml into SpellsChummer struct
func LoadSpellsFromXML(filePath string) (*v5.SpellsChummer, error) {
	return LoadXMLFile[v5.SpellsChummer](filePath)
}

// LoadStreamsFromXML loads streams.xml into StreamsChummer struct
func LoadStreamsFromXML(filePath string) (*v5.StreamsChummer, error) {
	return LoadXMLFile[v5.StreamsChummer](filePath)
}

// LoadTraditionsFromXML loads traditions.xml into TraditionsChummer struct
func LoadTraditionsFromXML(filePath string) (*v5.TraditionsChummer, error) {
	return LoadXMLFile[v5.TraditionsChummer](filePath)
}

// LoadVesselsFromXML loads vessels.xml into VesselsChummer struct
func LoadVesselsFromXML(filePath string) (*v5.VesselsChummer, error) {
	return LoadXMLFile[v5.VesselsChummer](filePath)
}

