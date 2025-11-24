package loader

import (
	"fmt"
	"os"
	"path/filepath"
)

// TestAllLoaders tests loading all XML files in the chummerxml directory
func TestAllLoaders(xmlDir string) error {
	smallFiles := map[string]func(string) error{
		"actions.xml":        testLoadActions,
		"books.xml":          testLoadBooks,
		"contacts.xml":        testLoadContacts,
		"echoes.xml":          testLoadEchoes,
		"improvements.xml":    testLoadImprovements,
		"licenses.xml":        testLoadLicenses,
		"mentors.xml":         testLoadMentors,
		"metamagic.xml":       testLoadMetamagic,
		"options.xml":         testLoadOptions,
		"paragons.xml":        testLoadParagons,
		"priorities.xml":      testLoadPriorities,
		"qualitylevels.xml":   testLoadQualityLevels,
		"ranges.xml":          testLoadRanges,
		"references.xml":      testLoadReferences,
		"settings.xml":        testLoadSettings,
		"sheets.xml":          testLoadSheets,
		"spiritpowers.xml":    testLoadSpiritPowers,
		"strings.xml":         testLoadStrings,
		"tips.xml":            testLoadTips,
	}

	mediumFiles := map[string]func(string) error{
		"armor.xml":          testLoadArmor,
		"bioware.xml":        testLoadBioware,
		"complexforms.xml":   testLoadComplexForms,
		"critterpowers.xml":  testLoadCritterPowers,
		"critters.xml":       testLoadCritters,
		"cyberware.xml":      testLoadCyberware,
		"drugcomponents.xml": testLoadDrugComponents,
		"lifemodules.xml":    testLoadLifeModules,
		"lifestyles.xml":     testLoadLifestyles,
		"martialarts.xml":    testLoadMartialArts,
		"metatypes.xml":      testLoadMetatypes,
		"packs.xml":          testLoadPacks,
		"powers.xml":         testLoadPowers,
		"programs.xml":       testLoadPrograms,
		"qualities.xml":      testLoadQualities,
		"skills.xml":         testLoadSkills,
		"spells.xml":         testLoadSpells,
		"streams.xml":        testLoadStreams,
		"traditions.xml":     testLoadTraditions,
		"vessels.xml":        testLoadVessels,
	}

	largeFiles := map[string]func(string) error{
		"gear.xml":     testLoadGear,
		"vehicles.xml": testLoadVehicles,
		"weapons.xml":  testLoadWeapons,
	}

	fmt.Println("=== Testing Small Files ===")
	for filename, testFunc := range smallFiles {
		filePath := filepath.Join(xmlDir, filename)
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			fmt.Printf("SKIP: %s (file not found)\n", filename)
			continue
		}
		if err := testFunc(filePath); err != nil {
			fmt.Printf("FAIL: %s - %v\n", filename, err)
		} else {
			fmt.Printf("PASS: %s\n", filename)
		}
	}

	fmt.Println("\n=== Testing Medium Files ===")
	for filename, testFunc := range mediumFiles {
		filePath := filepath.Join(xmlDir, filename)
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			fmt.Printf("SKIP: %s (file not found)\n", filename)
			continue
		}
		if err := testFunc(filePath); err != nil {
			fmt.Printf("FAIL: %s - %v\n", filename, err)
		} else {
			fmt.Printf("PASS: %s\n", filename)
		}
	}

	fmt.Println("\n=== Testing Large Files ===")
	for filename, testFunc := range largeFiles {
		filePath := filepath.Join(xmlDir, filename)
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			fmt.Printf("SKIP: %s (file not found)\n", filename)
			continue
		}
		if err := testFunc(filePath); err != nil {
			fmt.Printf("FAIL: %s - %v\n", filename, err)
		} else {
			fmt.Printf("PASS: %s\n", filename)
		}
	}

	return nil
}

// Test loader functions
func testLoadActions(path string) error {
	_, err := LoadActionsFromXML(path)
	return err
}

func testLoadBooks(path string) error {
	_, err := LoadBooksFromXML(path)
	return err
}

func testLoadContacts(path string) error {
	_, err := LoadContactsFromXML(path)
	return err
}

func testLoadEchoes(path string) error {
	_, err := LoadEchoesFromXML(path)
	return err
}

func testLoadImprovements(path string) error {
	_, err := LoadImprovementsFromXML(path)
	return err
}

func testLoadLicenses(path string) error {
	_, err := LoadLicensesFromXML(path)
	return err
}

func testLoadMentors(path string) error {
	_, err := LoadMentorsFromXML(path)
	return err
}

func testLoadMetamagic(path string) error {
	_, err := LoadMetamagicFromXML(path)
	return err
}

func testLoadOptions(path string) error {
	_, err := LoadOptionsFromXML(path)
	return err
}

func testLoadParagons(path string) error {
	_, err := LoadParagonsFromXML(path)
	return err
}

func testLoadPriorities(path string) error {
	_, err := LoadPrioritiesFromXML(path)
	return err
}

func testLoadQualityLevels(path string) error {
	_, err := LoadQualityLevelsFromXML(path)
	return err
}

func testLoadRanges(path string) error {
	_, err := LoadRangesFromXML(path)
	return err
}

func testLoadReferences(path string) error {
	_, err := LoadReferencesFromXML(path)
	return err
}

func testLoadSettings(path string) error {
	_, err := LoadSettingsFromXML(path)
	return err
}

func testLoadSheets(path string) error {
	_, err := LoadSheetsFromXML(path)
	return err
}

func testLoadSpiritPowers(path string) error {
	_, err := LoadSpiritPowersFromXML(path)
	return err
}

func testLoadStrings(path string) error {
	_, err := LoadStringsFromXML(path)
	return err
}

func testLoadTips(path string) error {
	_, err := LoadTipsFromXML(path)
	return err
}

func testLoadArmor(path string) error {
	_, err := LoadArmorFromXML(path)
	return err
}

func testLoadBioware(path string) error {
	_, err := LoadBiowareFromXML(path)
	return err
}

func testLoadComplexForms(path string) error {
	_, err := LoadComplexFormsFromXML(path)
	return err
}

func testLoadCritterPowers(path string) error {
	_, err := LoadCritterPowersFromXML(path)
	return err
}

func testLoadCritters(path string) error {
	_, err := LoadCrittersFromXML(path)
	return err
}

func testLoadCyberware(path string) error {
	_, err := LoadCyberwareFromXML(path)
	return err
}

func testLoadDrugComponents(path string) error {
	_, err := LoadDrugComponentsFromXML(path)
	return err
}

func testLoadLifeModules(path string) error {
	_, err := LoadLifeModulesFromXML(path)
	return err
}

func testLoadLifestyles(path string) error {
	_, err := LoadLifestylesFromXML(path)
	return err
}

func testLoadMartialArts(path string) error {
	_, err := LoadMartialArtsFromXML(path)
	return err
}

func testLoadMetatypes(path string) error {
	_, err := LoadMetatypesFromXML(path)
	return err
}

func testLoadPacks(path string) error {
	_, err := LoadPacksFromXML(path)
	return err
}

func testLoadPowers(path string) error {
	_, err := LoadPowersFromXML(path)
	return err
}

func testLoadPrograms(path string) error {
	_, err := LoadProgramsFromXML(path)
	return err
}

func testLoadQualities(path string) error {
	_, err := LoadQualitiesFromXML(path)
	return err
}

func testLoadSkills(path string) error {
	_, err := LoadSkillsFromXML(path)
	return err
}

func testLoadSpells(path string) error {
	_, err := LoadSpellsFromXML(path)
	return err
}

func testLoadStreams(path string) error {
	_, err := LoadStreamsFromXML(path)
	return err
}

func testLoadTraditions(path string) error {
	_, err := LoadTraditionsFromXML(path)
	return err
}

func testLoadVessels(path string) error {
	_, err := LoadVesselsFromXML(path)
	return err
}

func testLoadGear(path string) error {
	_, err := LoadGearFromXML(path)
	return err
}

func testLoadVehicles(path string) error {
	_, err := LoadVehiclesFromXML(path)
	return err
}

func testLoadWeapons(path string) error {
	_, err := LoadWeaponsFromXML(path)
	return err
}

