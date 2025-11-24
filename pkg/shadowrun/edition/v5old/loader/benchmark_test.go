package loader

import (
	"os"
	"path/filepath"
	"testing"
)

const benchmarkDataDir = "../../../../data/chummerxml"

func BenchmarkLoadContacts(b *testing.B) {
	filePath := filepath.Join(benchmarkDataDir, "contacts.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		b.Skipf("Test file not found: %s", filePath)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := LoadContactsFromXML(filePath)
		if err != nil {
			b.Fatalf("Failed to load: %v", err)
		}
	}
}

func BenchmarkLoadArmor(b *testing.B) {
	filePath := filepath.Join(benchmarkDataDir, "armor.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		b.Skipf("Test file not found: %s", filePath)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := LoadArmorFromXML(filePath)
		if err != nil {
			b.Fatalf("Failed to load: %v", err)
		}
	}
}

func BenchmarkLoadGear(b *testing.B) {
	filePath := filepath.Join(benchmarkDataDir, "gear.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		b.Skipf("Test file not found: %s", filePath)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := LoadGearFromXML(filePath)
		if err != nil {
			b.Fatalf("Failed to load: %v", err)
		}
	}
}

func BenchmarkLoadWeapons(b *testing.B) {
	filePath := filepath.Join(benchmarkDataDir, "weapons.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		b.Skipf("Test file not found: %s", filePath)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := LoadWeaponsFromXML(filePath)
		if err != nil {
			b.Fatalf("Failed to load: %v", err)
		}
	}
}

func BenchmarkLoadVehicles(b *testing.B) {
	filePath := filepath.Join(benchmarkDataDir, "vehicles.xml")
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		b.Skipf("Test file not found: %s", filePath)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := LoadVehiclesFromXML(filePath)
		if err != nil {
			b.Fatalf("Failed to load: %v", err)
		}
	}
}

