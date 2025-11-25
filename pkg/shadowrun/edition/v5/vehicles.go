package v5

import "fmt"

// dataVehicles contains all vehicle and drone definitions
// This is populated in vehicles_data.go

// VehicleType represents the category of vehicle
type VehicleType string

const (
	VehicleTypeGroundcraft VehicleType = "groundcraft"
	VehicleTypeWatercraft  VehicleType = "watercraft"
	VehicleTypeAircraft    VehicleType = "aircraft"
	VehicleTypeDrone       VehicleType = "drone"
)

// VehicleSubtype represents the subcategory of vehicle
type VehicleSubtype string

const (
	// Groundcraft subtypes
	VehicleSubtypeBike             VehicleSubtype = "bike"
	VehicleSubtypeCar              VehicleSubtype = "car"
	VehicleSubtypeTruck            VehicleSubtype = "truck"
	VehicleSubtypeOtherGroundcraft VehicleSubtype = "other_groundcraft"

	// Drone subtypes
	VehicleSubtypeMicroDrone   VehicleSubtype = "micro_drone"
	VehicleSubtypeMiniDrone    VehicleSubtype = "mini_drone"
	VehicleSubtypeSmallDrone   VehicleSubtype = "small_drone"
	VehicleSubtypeMediumDrone  VehicleSubtype = "medium_drone"
	VehicleSubtypeLargeDrone   VehicleSubtype = "large_drone"
	VehicleSubtypeHugeDrone    VehicleSubtype = "huge_drone"
	VehicleSubtypeAnthroDrone  VehicleSubtype = "anthro_drone"
	VehicleSubtypeMissileDrone VehicleSubtype = "missile_drone"
)

// MovementType represents the type of movement
type MovementType string

const (
	MovementTypeGround    MovementType = "G" // Ground
	MovementTypeWater     MovementType = "W" // Water
	MovementTypeJet       MovementType = "J" // Jet
	MovementTypeFlight    MovementType = "F" // Flight
	MovementTypePropeller MovementType = "P" // Propeller
)

// HandlingRating represents handling with optional off-road/on-road split
type HandlingRating struct {
	// OnRoad is the handling rating on roads
	OnRoad int `json:"on_road,omitempty"`
	// OffRoad is the handling rating off-road (optional)
	OffRoad *int `json:"off_road,omitempty"`
}

// SpeedRating represents speed with movement type
type SpeedRating struct {
	// Value is the speed rating
	Value int `json:"value,omitempty"`
	// MovementType indicates the type of movement (G, W, J, F, P)
	MovementType MovementType `json:"movement_type,omitempty"`
	// AlternativeSpeed is an alternative speed rating (for vehicles with different speeds)
	AlternativeSpeed *int `json:"alternative_speed,omitempty"`
}

// BodyRating represents body rating with optional structure rating
type BodyRating struct {
	// Value is the body rating
	Value int `json:"value,omitempty"`
	// Structure is the structure rating (in parentheses, e.g., 5(0))
	Structure *int `json:"structure,omitempty"`
}

// AvailabilityRating represents availability with optional restrictions
type AvailabilityRating struct {
	// Value is the base availability rating
	Value int `json:"value,omitempty"`
	// Restricted indicates if it's Restricted (R)
	Restricted bool `json:"restricted,omitempty"`
	// Forbidden indicates if it's Forbidden (F)
	Forbidden bool `json:"forbidden,omitempty"`
}

// Vehicle represents a vehicle or drone definition
type Vehicle struct {
	// Name is the vehicle/drone name
	Name string `json:"name,omitempty"`
	// Type indicates the main category (groundcraft, watercraft, aircraft, drone)
	Type VehicleType `json:"type,omitempty"`
	// Subtype indicates the subcategory (bike, car, truck, micro_drone, etc.)
	Subtype VehicleSubtype `json:"subtype,omitempty"`
	// VehicleTypeName is the specific type name for "Other Groundcraft" (e.g., "Limo", "Armored Vehicle")
	VehicleTypeName string `json:"vehicle_type_name,omitempty"`
	// Handling is the handling rating (may have off-road/on-road split)
	Handling HandlingRating `json:"handling,omitempty"`
	// Speed is the speed rating with movement type
	Speed SpeedRating `json:"speed,omitempty"`
	// Acceleration is the acceleration rating
	Acceleration int `json:"acceleration,omitempty"`
	// Body is the body rating (may include structure rating)
	Body BodyRating `json:"body,omitempty"`
	// Armor is the armor rating
	Armor int `json:"armor,omitempty"`
	// Pilot is the pilot rating
	Pilot int `json:"pilot,omitempty"`
	// Sensor is the sensor rating
	Sensor int `json:"sensor,omitempty"`
	// Seats is the number of seats (vehicles only, not applicable to drones)
	Seats *int `json:"seats,omitempty"`
	// Availability is the availability rating with restrictions
	Availability AvailabilityRating `json:"availability,omitempty"`
	// Cost is the price in nuyen
	Cost int `json:"cost,omitempty"`
	// Source contains source book reference information
	Source *SourceReference `json:"source,omitempty"`
}

// VehicleData represents the complete vehicle data structure organized by category
type VehicleData struct {
	Groundcraft struct {
		Bikes            []Vehicle `json:"bikes,omitempty"`
		Cars             []Vehicle `json:"cars,omitempty"`
		Trucks           []Vehicle `json:"trucks,omitempty"`
		OtherGroundcraft []Vehicle `json:"other_groundcraft,omitempty"`
	} `json:"groundcraft,omitempty"`
	Watercraft []Vehicle `json:"watercraft,omitempty"`
	Aircraft   []Vehicle `json:"aircraft,omitempty"`
	Drones     struct {
		Micro   []Vehicle `json:"micro,omitempty"`
		Mini    []Vehicle `json:"mini,omitempty"`
		Small   []Vehicle `json:"small,omitempty"`
		Medium  []Vehicle `json:"medium,omitempty"`
		Large   []Vehicle `json:"large,omitempty"`
		Huge    []Vehicle `json:"huge,omitempty"`
		Anthro  []Vehicle `json:"anthro,omitempty"`
		Missile []Vehicle `json:"missile,omitempty"`
	} `json:"drones,omitempty"`
}

// GetAllVehicles returns all vehicles and drones
func GetAllVehicles() []Vehicle {
	vehicles := make([]Vehicle, 0, len(dataVehicles))
	for _, v := range dataVehicles {
		vehicles = append(vehicles, v)
	}
	return vehicles
}

// GetVehicleData returns the complete vehicle data structure organized by category
func GetVehicleData() VehicleData {
	data := VehicleData{
		Groundcraft: struct {
			Bikes            []Vehicle `json:"bikes,omitempty"`
			Cars             []Vehicle `json:"cars,omitempty"`
			Trucks           []Vehicle `json:"trucks,omitempty"`
			OtherGroundcraft []Vehicle `json:"other_groundcraft,omitempty"`
		}{},
		Watercraft: []Vehicle{},
		Aircraft:   []Vehicle{},
		Drones: struct {
			Micro   []Vehicle `json:"micro,omitempty"`
			Mini    []Vehicle `json:"mini,omitempty"`
			Small   []Vehicle `json:"small,omitempty"`
			Medium  []Vehicle `json:"medium,omitempty"`
			Large   []Vehicle `json:"large,omitempty"`
			Huge    []Vehicle `json:"huge,omitempty"`
			Anthro  []Vehicle `json:"anthro,omitempty"`
			Missile []Vehicle `json:"missile,omitempty"`
		}{},
	}

	for _, vehicle := range dataVehicles {
		switch vehicle.Type {
		case VehicleTypeGroundcraft:
			switch vehicle.Subtype {
			case VehicleSubtypeBike:
				data.Groundcraft.Bikes = append(data.Groundcraft.Bikes, vehicle)
			case VehicleSubtypeCar:
				data.Groundcraft.Cars = append(data.Groundcraft.Cars, vehicle)
			case VehicleSubtypeTruck:
				data.Groundcraft.Trucks = append(data.Groundcraft.Trucks, vehicle)
			case VehicleSubtypeOtherGroundcraft:
				data.Groundcraft.OtherGroundcraft = append(data.Groundcraft.OtherGroundcraft, vehicle)
			}
		case VehicleTypeWatercraft:
			data.Watercraft = append(data.Watercraft, vehicle)
		case VehicleTypeAircraft:
			data.Aircraft = append(data.Aircraft, vehicle)
		case VehicleTypeDrone:
			switch vehicle.Subtype {
			case VehicleSubtypeMicroDrone:
				data.Drones.Micro = append(data.Drones.Micro, vehicle)
			case VehicleSubtypeMiniDrone:
				data.Drones.Mini = append(data.Drones.Mini, vehicle)
			case VehicleSubtypeSmallDrone:
				data.Drones.Small = append(data.Drones.Small, vehicle)
			case VehicleSubtypeMediumDrone:
				data.Drones.Medium = append(data.Drones.Medium, vehicle)
			case VehicleSubtypeLargeDrone:
				data.Drones.Large = append(data.Drones.Large, vehicle)
			case VehicleSubtypeHugeDrone:
				data.Drones.Huge = append(data.Drones.Huge, vehicle)
			case VehicleSubtypeAnthroDrone:
				data.Drones.Anthro = append(data.Drones.Anthro, vehicle)
			case VehicleSubtypeMissileDrone:
				data.Drones.Missile = append(data.Drones.Missile, vehicle)
			}
		}
	}

	return data
}

// GetVehicleByName returns the vehicle definition with the given name, or nil if not found
func GetVehicleByName(name string) *Vehicle {
	for _, vehicle := range dataVehicles {
		if vehicle.Name == name {
			return &vehicle
		}
	}
	return nil
}

// GetVehicleByKey returns the vehicle definition with the given key, or nil if not found
func GetVehicleByKey(key string) *Vehicle {
	vehicle, ok := dataVehicles[key]
	if !ok {
		return nil
	}
	return &vehicle
}

// GetVehiclesByType returns all vehicles in the specified type
func GetVehiclesByType(vehicleType VehicleType) []Vehicle {
	vehicles := make([]Vehicle, 0)
	for _, v := range dataVehicles {
		if v.Type == vehicleType {
			vehicles = append(vehicles, v)
		}
	}
	return vehicles
}

// GetVehiclesBySubtype returns all vehicles in the specified subtype
func GetVehiclesBySubtype(subtype VehicleSubtype) []Vehicle {
	vehicles := make([]Vehicle, 0)
	for _, v := range dataVehicles {
		if v.Subtype == subtype {
			vehicles = append(vehicles, v)
		}
	}
	return vehicles
}

// Validate validates that the vehicle definition is well-formed
func (v *Vehicle) Validate() error {
	if v.Name == "" {
		return fmt.Errorf("vehicle name is required")
	}
	if v.Type == "" {
		return fmt.Errorf("vehicle type is required")
	}
	// Validate handling rating
	if v.Handling.OnRoad == 0 {
		return fmt.Errorf("handling rating is required")
	}
	// Validate speed rating
	if v.Speed.Value == 0 {
		return fmt.Errorf("speed rating is required")
	}
	// Validate body rating
	if v.Body.Value == 0 {
		return fmt.Errorf("body rating is required")
	}
	return nil
}
