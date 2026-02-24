/**
 * VehiclesDisplay Component Tests
 *
 * Tests the vehicles & drones display with expandable rows grouped into
 * Vehicles/Drones/RCCs sections. Validates section grouping, collapsed/expanded
 * states, type badges, primary pills, stats, catalog integration (description,
 * cost, source reference, weapon mounts), autosofts, notes rendering,
 * condition badges, wireless icons, and wireless toggles.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Character } from "@/lib/types";
import {
  setupDisplayCardMock,
  createSheetCharacter,
  LUCIDE_MOCK,
  MOCK_VEHICLE,
  MOCK_VEHICLE_WITH_OPTIONS,
  MOCK_VEHICLE_BRICKED,
  MOCK_VEHICLE_DESTROYED,
  MOCK_DRONE,
  MOCK_DRONE_WITH_AUTOSOFTS,
  MOCK_DRONE_BRICKED,
  MOCK_DRONE_DESTROYED,
  MOCK_DRONE_WIRELESS,
  MOCK_RCC,
  MOCK_RCC_WITH_OPTIONS,
  MOCK_RCC_BRICKED,
  MOCK_RCC_WIRELESS,
} from "./test-helpers";
import type { VehiclesCatalogData } from "@/lib/rules/RulesetContext";

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------

const MOCK_VEHICLES_CATALOG: VehiclesCatalogData = {
  categories: [{ id: "ground", name: "Ground Vehicles" }],
  droneSizes: [
    { id: "mini", name: "Mini", bodyRange: "0-1" },
    { id: "medium", name: "Medium", bodyRange: "3-5" },
  ],
  groundcraft: [
    {
      id: "dodge-scoot",
      name: "Dodge Scoot",
      category: "ground",
      handling: 4,
      speed: 3,
      acceleration: 1,
      body: 4,
      armor: 4,
      pilot: 1,
      sensor: 1,
      seats: 1,
      cost: 3000,
      availability: 4,
      description: "A compact scooter for urban commuting.",
      page: 462,
      source: "Core",
    },
    {
      id: "ares-roadmaster",
      name: "Ares Roadmaster",
      category: "ground",
      handling: 3,
      speed: 4,
      acceleration: 2,
      body: 18,
      armor: 14,
      pilot: 3,
      sensor: 3,
      seats: 6,
      cost: 52000,
      availability: 12,
      legality: "restricted",
      description: "Heavy-duty armored transport.",
      page: 463,
      source: "Core",
    },
  ],
  watercraft: [],
  aircraft: [],
  drones: [
    {
      id: "fly-spy",
      name: "MCT Fly-Spy",
      size: "mini",
      droneType: "surveillance",
      handling: 4,
      speed: 3,
      acceleration: 2,
      body: 1,
      armor: 0,
      pilot: 3,
      sensor: 3,
      cost: 2000,
      availability: 4,
      description: "Insect-sized surveillance drone.",
      page: 466,
      source: "Core",
    },
    {
      id: "gm-nissan-doberman",
      name: "GM-Nissan Doberman",
      size: "medium",
      droneType: "combat",
      handling: 5,
      speed: 4,
      acceleration: 2,
      body: 4,
      armor: 4,
      pilot: 3,
      sensor: 3,
      cost: 5000,
      availability: 4,
      weaponMounts: { standard: 1 },
      description: "Medium combat drone with weapon mount.",
      page: 466,
      source: "Core",
    },
  ],
  rccs: [
    {
      id: "rcc-standard",
      name: "RCC-Standard",
      deviceRating: 5,
      dataProcessing: 4,
      firewall: 3,
      cost: 11000,
      availability: 6,
      description: "Standard rigger command console.",
      page: 267,
      source: "Core",
    },
    {
      id: "vulcan-liegelord",
      name: "Vulcan Liegelord",
      deviceRating: 7,
      dataProcessing: 6,
      firewall: 6,
      cost: 68500,
      availability: 14,
      legality: "restricted",
      description: "High-end rigger command console.",
      page: 267,
      source: "Core",
    },
  ],
  autosofts: [],
};

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);
vi.mock("@/lib/rules", () => ({
  useVehiclesCatalog: () => MOCK_VEHICLES_CATALOG,
}));

vi.mock("@/app/characters/[id]/components/WirelessIndicator", () => ({
  WirelessIndicator: (props: {
    enabled: boolean;
    globalEnabled?: boolean;
    condition?: string;
    onToggle?: (v: boolean) => void;
  }) => (
    <div
      data-testid="wireless-indicator"
      data-enabled={String(props.enabled)}
      data-global-enabled={String(props.globalEnabled)}
      data-condition={props.condition ?? ""}
    >
      {props.onToggle && (
        <button
          data-testid="wireless-indicator-toggle"
          onClick={() => props.onToggle!(!props.enabled)}
        >
          toggle
        </button>
      )}
    </div>
  ),
}));

const mockIsGlobalWirelessEnabled = vi.fn((_character?: unknown) => true);
vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: (character: unknown) => mockIsGlobalWirelessEnabled(character),
}));

import { VehiclesDisplay } from "../VehiclesDisplay";

describe("VehiclesDisplay", () => {
  beforeEach(() => {
    mockIsGlobalWirelessEnabled.mockReturnValue(true);
  });

  // --- Empty state ---

  it("returns null when all arrays are empty", () => {
    const { container } = render(<VehiclesDisplay vehicles={[]} drones={[]} rccs={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when no props provided", () => {
    const { container } = render(<VehiclesDisplay />);
    expect(container.innerHTML).toBe("");
  });

  // --- Section grouping ---

  it("renders Vehicles section for vehicles", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    expect(screen.getByText("Vehicles")).toBeInTheDocument();
  });

  it("renders Drones section for drones", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    expect(screen.getByText("Drones")).toBeInTheDocument();
  });

  it("renders RCCs section for RCCs", () => {
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    expect(screen.getByText("RCCs")).toBeInTheDocument();
  });

  it("hides Drones section when only vehicles present", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    expect(screen.queryByText("Drones")).not.toBeInTheDocument();
    expect(screen.queryByText("RCCs")).not.toBeInTheDocument();
  });

  it("hides Vehicles section when only drones present", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    expect(screen.queryByText("Vehicles")).not.toBeInTheDocument();
    expect(screen.queryByText("RCCs")).not.toBeInTheDocument();
  });

  it("renders all three sections when all types present", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} drones={[MOCK_DRONE]} rccs={[MOCK_RCC]} />);
    expect(screen.getByText("Vehicles")).toBeInTheDocument();
    expect(screen.getByText("Drones")).toBeInTheDocument();
    expect(screen.getByText("RCCs")).toBeInTheDocument();
  });

  // --- Collapsed row: Name ---

  it("renders vehicle name in collapsed row", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    expect(screen.getByText("Dodge Scoot")).toBeInTheDocument();
  });

  it("renders drone name in collapsed row", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    expect(screen.getByText("MCT Fly-Spy")).toBeInTheDocument();
  });

  it("renders drone customName when present", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE_WITH_AUTOSOFTS]} />);
    expect(screen.getByText("Rex")).toBeInTheDocument();
  });

  it("renders RCC name in collapsed row", () => {
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    expect(screen.getByText("RCC-Standard")).toBeInTheDocument();
  });

  it("renders RCC customName when present", () => {
    render(<VehiclesDisplay rccs={[MOCK_RCC_WITH_OPTIONS]} />);
    expect(screen.getByText("Command Node")).toBeInTheDocument();
  });

  // --- Collapsed row: Type badge ---

  it("renders vehicle type badge on collapsed row", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    expect(screen.getByTestId("type-badge")).toHaveTextContent("Ground");
  });

  it("renders drone size badge on collapsed row", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    expect(screen.getByTestId("type-badge")).toHaveTextContent("Mini");
  });

  it("renders RCC badge on collapsed row", () => {
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    expect(screen.getByTestId("type-badge")).toHaveTextContent("RCC");
  });

  // --- Collapsed row: Name title tooltip ---

  it("renders title attribute on vehicle name for truncation tooltip", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    expect(screen.getByTitle("Dodge Scoot")).toBeInTheDocument();
  });

  it("renders title attribute with customName for drones", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE_WITH_AUTOSOFTS]} />);
    expect(screen.getByTitle("Rex")).toBeInTheDocument();
  });

  // --- Expand/collapse ---

  it("does not show expanded content by default", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("expands row on chevron click", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("collapses row on second chevron click", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  // --- Expanded: Description from catalog ---

  it("renders catalog description when expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("description")).toHaveTextContent(
      "A compact scooter for urban commuting."
    );
  });

  it("renders drone catalog description when expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("description")).toHaveTextContent("Insect-sized surveillance drone.");
  });

  it("renders RCC catalog description when expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("description")).toHaveTextContent("Standard rigger command console.");
  });

  // --- Expanded stats: Body/DR ---

  it("renders vehicle Body in expanded view", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-body")).toHaveTextContent("Body 4");
  });

  it("renders drone Body in expanded view", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-body")).toHaveTextContent("Body 1");
  });

  it("renders RCC DR in expanded view", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-body")).toHaveTextContent("DR 5");
  });

  // --- Expanded stats: Vehicle/Drone ---

  it("renders handling stat when vehicle expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-handling")).toHaveTextContent("4");
  });

  it("renders speed stat when vehicle expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-speed")).toHaveTextContent("3");
  });

  it("renders acceleration stat when vehicle expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-acceleration")).toHaveTextContent("1");
  });

  it("renders pilot stat when vehicle expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-pilot")).toHaveTextContent("1");
  });

  it("renders sensor stat when vehicle expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-sensor")).toHaveTextContent("1");
  });

  it("renders armor stat when vehicle expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-armor")).toHaveTextContent("4");
  });

  it("renders seats stat for vehicles when expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-seats")).toHaveTextContent("1");
  });

  it("does not render seats stat for drones", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-seats")).not.toBeInTheDocument();
  });

  // --- Expanded stats: RCC ---

  it("renders data processing stat when RCC expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-data-processing")).toHaveTextContent("4");
  });

  it("renders firewall stat when RCC expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-firewall")).toHaveTextContent("3");
  });

  it("does not render vehicle stats for RCC", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("stat-handling")).not.toBeInTheDocument();
    expect(screen.queryByTestId("stat-speed")).not.toBeInTheDocument();
    expect(screen.queryByTestId("stat-armor")).not.toBeInTheDocument();
  });

  // --- Availability + Cost ---

  it("renders availability when expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("4");
  });

  it("renders availability with legality suffix", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE_WITH_OPTIONS]} />);
    await user.click(screen.getByTestId("expand-button"));
    const avail = screen.getByTestId("stat-availability");
    expect(avail).toHaveTextContent("12R");
  });

  it("renders cost when expanded", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("stat-cost")).toHaveTextContent("¥3,000");
  });

  // --- Weapon Mounts ---

  it("renders weapon mounts section for drones with mounts", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay drones={[MOCK_DRONE_WITH_AUTOSOFTS]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("weapon-mounts-section")).toBeInTheDocument();
    expect(screen.getByTestId("weapon-mount-standard")).toHaveTextContent("Standard ×1");
  });

  it("does not render weapon mounts for drones without mounts", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("weapon-mounts-section")).not.toBeInTheDocument();
  });

  it("does not render weapon mounts for vehicles", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("weapon-mounts-section")).not.toBeInTheDocument();
  });

  // --- Autosofts ---

  it("renders installed autosofts for drone", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay drones={[MOCK_DRONE_WITH_AUTOSOFTS]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("autosofts-section")).toBeInTheDocument();
    expect(screen.getByText("Installed Autosofts")).toBeInTheDocument();
    const rows = screen.getAllByTestId("autosoft-row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Clearsight")).toBeInTheDocument();
    expect(screen.getByText("Targeting (Automatics)")).toBeInTheDocument();
  });

  it("renders running autosofts for RCC", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay rccs={[MOCK_RCC_WITH_OPTIONS]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("autosofts-section")).toBeInTheDocument();
    expect(screen.getByText("Running Autosofts")).toBeInTheDocument();
    const rows = screen.getAllByTestId("autosoft-row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Electronic Warfare")).toBeInTheDocument();
    expect(screen.getByText("Stealth")).toBeInTheDocument();
  });

  it("does not render autosofts section when none present", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("autosofts-section")).not.toBeInTheDocument();
  });

  // --- Notes ---

  it("renders notes when present", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE_WITH_OPTIONS]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("notes")).toHaveTextContent("Armored transport vehicle");
  });

  it("does not render notes when absent", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("notes")).not.toBeInTheDocument();
  });

  // --- Source reference ---

  it("renders source reference from catalog", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("source-reference")).toHaveTextContent("Core p.462");
  });

  it("renders source reference for RCC", async () => {
    const user = userEvent.setup();
    render(<VehiclesDisplay rccs={[MOCK_RCC]} />);
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("source-reference")).toHaveTextContent("Core p.267");
  });

  // --- Multiple items ---

  it("renders multiple items in the same section", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE, MOCK_VEHICLE_WITH_OPTIONS]} />);
    expect(screen.getByText("Dodge Scoot")).toBeInTheDocument();
    expect(screen.getByText("Ares Roadmaster")).toBeInTheDocument();
    const rows = screen.getAllByTestId("vehicle-row");
    expect(rows).toHaveLength(2);
  });

  it("renders items across multiple sections", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} drones={[MOCK_DRONE]} rccs={[MOCK_RCC]} />);
    expect(screen.getByText("Dodge Scoot")).toBeInTheDocument();
    expect(screen.getByText("MCT Fly-Spy")).toBeInTheDocument();
    expect(screen.getByText("RCC-Standard")).toBeInTheDocument();
    const rows = screen.getAllByTestId("vehicle-row");
    expect(rows).toHaveLength(3);
  });

  // =========================================================================
  // Condition badges
  // =========================================================================

  it("shows BRICKED badge for bricked drone", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE_BRICKED]} />);
    const badge = screen.getByTestId("condition-badge");
    expect(badge).toHaveTextContent("BRICKED");
    expect(badge.className).toContain("red-500");
  });

  it("shows DESTROYED badge for destroyed drone", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE_DESTROYED]} />);
    const badge = screen.getByTestId("condition-badge");
    expect(badge).toHaveTextContent("DESTROYED");
    expect(badge.className).toContain("red-800");
  });

  it("shows BRICKED badge for bricked vehicle", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE_BRICKED]} />);
    const badge = screen.getByTestId("condition-badge");
    expect(badge).toHaveTextContent("BRICKED");
  });

  it("shows DESTROYED badge for destroyed vehicle", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE_DESTROYED]} />);
    const badge = screen.getByTestId("condition-badge");
    expect(badge).toHaveTextContent("DESTROYED");
  });

  it("shows BRICKED badge for bricked RCC", () => {
    render(<VehiclesDisplay rccs={[MOCK_RCC_BRICKED]} />);
    const badge = screen.getByTestId("condition-badge");
    expect(badge).toHaveTextContent("BRICKED");
  });

  it("does not show condition badge for functional drone (no state)", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    expect(screen.queryByTestId("condition-badge")).not.toBeInTheDocument();
  });

  it("does not show condition badge for drone with wireless-only state", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE_WIRELESS]} />);
    expect(screen.queryByTestId("condition-badge")).not.toBeInTheDocument();
  });

  // =========================================================================
  // Wireless icon (collapsed row)
  // =========================================================================

  it("shows Wifi icon when drone wireless is active", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE_WIRELESS]} />);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon-off")).not.toBeInTheDocument();
  });

  it("shows WifiOff icon when drone wireless is disabled", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE_BRICKED]} />);
    expect(screen.getByTestId("wireless-icon-off")).toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
  });

  it("shows WifiOff icon when global wireless is disabled", () => {
    mockIsGlobalWirelessEnabled.mockReturnValue(false);
    const character = createSheetCharacter({ drones: [MOCK_DRONE_WIRELESS] });
    render(<VehiclesDisplay drones={[MOCK_DRONE_WIRELESS]} character={character} />);
    expect(screen.getByTestId("wireless-icon-off")).toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
  });

  it("shows Wifi icon for RCC with wireless enabled", () => {
    render(<VehiclesDisplay rccs={[MOCK_RCC_WIRELESS]} />);
    expect(screen.getByTestId("wireless-icon")).toBeInTheDocument();
  });

  it("does not show wireless icon for vehicle (not Matrix-capable)", () => {
    render(<VehiclesDisplay vehicles={[MOCK_VEHICLE]} />);
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon-off")).not.toBeInTheDocument();
  });

  it("does not show wireless icon for drone without state", () => {
    render(<VehiclesDisplay drones={[MOCK_DRONE]} />);
    expect(screen.queryByTestId("wireless-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("wireless-icon-off")).not.toBeInTheDocument();
  });

  // =========================================================================
  // Wireless toggle (expanded, editable)
  // =========================================================================

  it("hides wireless toggle when not editable", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ drones: [MOCK_DRONE_WIRELESS] });
    render(
      <VehiclesDisplay
        drones={[MOCK_DRONE_WIRELESS]}
        character={character}
        onCharacterUpdate={vi.fn()}
        editable={false}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("wireless-toggle")).not.toBeInTheDocument();
  });

  it("hides wireless toggle for vehicles (not Matrix-capable)", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ vehicles: [MOCK_VEHICLE] });
    render(
      <VehiclesDisplay
        vehicles={[MOCK_VEHICLE]}
        character={character}
        onCharacterUpdate={vi.fn()}
        editable={true}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("wireless-toggle")).not.toBeInTheDocument();
  });

  it("shows wireless toggle for editable drone", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ drones: [MOCK_DRONE_WIRELESS] });
    render(
      <VehiclesDisplay
        drones={[MOCK_DRONE_WIRELESS]}
        character={character}
        onCharacterUpdate={vi.fn()}
        editable={true}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("wireless-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("wireless-indicator")).toBeInTheDocument();
  });

  it("shows wireless toggle for editable RCC", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ rccs: [MOCK_RCC_WIRELESS] });
    render(
      <VehiclesDisplay
        rccs={[MOCK_RCC_WIRELESS]}
        character={character}
        onCharacterUpdate={vi.fn()}
        editable={true}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("wireless-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("wireless-indicator")).toBeInTheDocument();
  });

  it("passes correct enabled/globalEnabled to WirelessIndicator", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ drones: [MOCK_DRONE_WIRELESS] });
    render(
      <VehiclesDisplay
        drones={[MOCK_DRONE_WIRELESS]}
        character={character}
        onCharacterUpdate={vi.fn()}
        editable={true}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    const indicator = screen.getByTestId("wireless-indicator");
    expect(indicator).toHaveAttribute("data-enabled", "true");
    expect(indicator).toHaveAttribute("data-global-enabled", "true");
  });

  it("passes globalEnabled=false when global wireless is off", async () => {
    mockIsGlobalWirelessEnabled.mockReturnValue(false);
    const user = userEvent.setup();
    const character = createSheetCharacter({ drones: [MOCK_DRONE_WIRELESS] });
    render(
      <VehiclesDisplay
        drones={[MOCK_DRONE_WIRELESS]}
        character={character}
        onCharacterUpdate={vi.fn()}
        editable={true}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    const indicator = screen.getByTestId("wireless-indicator");
    expect(indicator).toHaveAttribute("data-global-enabled", "false");
  });

  it("calls onCharacterUpdate when drone wireless is toggled", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ drones: [MOCK_DRONE_WIRELESS] });
    const onUpdate = vi.fn();
    render(
      <VehiclesDisplay
        drones={[MOCK_DRONE_WIRELESS]}
        character={character}
        onCharacterUpdate={onUpdate}
        editable={true}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    fireEvent.click(screen.getByTestId("wireless-indicator-toggle"));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0] as Character;
    expect(updated.drones?.[0].state?.wirelessEnabled).toBe(false);
  });

  it("calls onCharacterUpdate when RCC wireless is toggled", async () => {
    const user = userEvent.setup();
    const character = createSheetCharacter({ rccs: [MOCK_RCC_WIRELESS] });
    const onUpdate = vi.fn();
    render(
      <VehiclesDisplay
        rccs={[MOCK_RCC_WIRELESS]}
        character={character}
        onCharacterUpdate={onUpdate}
        editable={true}
      />
    );
    await user.click(screen.getByTestId("expand-button"));
    fireEvent.click(screen.getByTestId("wireless-indicator-toggle"));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    const updated = onUpdate.mock.calls[0][0] as Character;
    expect(updated.rccs?.[0].state?.wirelessEnabled).toBe(false);
  });
});
