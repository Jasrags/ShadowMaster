# Rigging Control Capability

## Purpose

The Rigging Control capability guarantees the systematic integrity of vehicle interactions, drone coordination, and rigger-interface safety. It ensures that all rigging actions are governed by edition-specific vehicle control rig (VCR) protocols, jumping-in requirements, and sensor-driven resolution, providing a stable and verifiable state for vehicle-bound entities and their coordinated drone networks.

## Guarantees

- Rigger identity and presence MUST be authoritative and bound to a specific vehicle control interface or drone command node.
- Vehicle interactions MUST adhere to strictly defined control protocols and action economy rules (e.g., Jumping In vs. Remote Control) per the active ruleset.
- Drone network (WAN) states MUST be persistent, governing the coordination and limits of multiple subordinate entities.
- The system MUST enforce authoritative "Biofeedback" resolution to ensure rigger safety and state integrity during digital-physical transitions.

## Requirements

### Interface and Hardware

- The system MUST enforce mandatory hardware-specific attribute requirements (e.g., VCR Rating, RCC Noise Reduction) during rigging initialization.
- Control interfaces MUST be uniquely identified and linked to a verifiable source of command authority.
- Hardware-specific limits (e.g., RCC Data Processing, Speed/Handling caps) MUST be automatically applied to all relevant rigging actions.

### Drone and Vehicle Coordination

- Every drone and vehicle MUST be bound to a verifiable ruleset definition within a commander's network.
- Coordinated drone actions MUST be constrained by RCC-specific processing limits and active program sets.
- The system MUST automatically update rigger potential based on active sensor modifications and hardware state transitions.

### Operational Safety and Resolution

- The system MUST provide Authoritative resolution for rigging actions, including high-speed maneuvers, sensor-locked attacks, and biofeedback defense.
- "Jumped In" status MUST be persistent and verifiable, impacting both the rigger's physical state and the vehicle's maneuverability.

## Constraints

- A character MUST NOT engage in rigging control without a valid VCR or RCC interface.
- Rigging actions MUST NOT exceed the constraints defined by the character's current hardware and active vehicle set.
- The use of rigger-specific content from incompatible ruleset bundles MUST be strictly prohibited.

## Non-Goals

- This capability does not define the visual design of the vehicle dashboards or sensor-driven haptic displays.
- This capability does not govern the fuel economics or narrative repair logistics of drone fleets.
- This capability does not manage the literal dice roll resolution logic (see Action Resolution).
