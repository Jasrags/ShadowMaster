package loader

import (
	"shadowmaster/pkg/shadowrun/edition/v5"
)

// LoadWeaponsFromXML loads weapons.xml into WeaponsChummer struct
// For large files, consider using streaming if memory becomes an issue
func LoadWeaponsFromXML(filePath string) (*v5.WeaponsChummer, error) {
	return LoadXMLFile[v5.WeaponsChummer](filePath)
}

// LoadVehiclesFromXML loads vehicles.xml into VehiclesChummer struct
// For large files, consider using streaming if memory becomes an issue
func LoadVehiclesFromXML(filePath string) (*v5.VehiclesChummer, error) {
	return LoadXMLFile[v5.VehiclesChummer](filePath)
}

// LoadGearFromXML loads gear.xml into GearsChummer struct
// For large files, consider using streaming if memory becomes an issue
func LoadGearFromXML(filePath string) (*v5.GearsChummer, error) {
	return LoadXMLFile[v5.GearsChummer](filePath)
}

