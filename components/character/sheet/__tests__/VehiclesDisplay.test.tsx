/**
 * VehiclesDisplay Component Tests
 *
 * Tests the vehicles & drones display with expandable rows grouped into
 * Vehicles/Drones/RCCs sections. Validates section grouping, collapsed/expanded
 * states, type badges, primary pills, stats, catalog integration (description,
 * cost, source reference, weapon mounts), autosofts, and notes rendering.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  MOCK_VEHICLE,
  MOCK_VEHICLE_WITH_OPTIONS,
  MOCK_DRONE,
  MOCK_DRONE_WITH_AUTOSOFTS,
  MOCK_RCC,
  MOCK_RCC_WITH_OPTIONS,
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

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);
vi.mock("@/lib/rules", () => ({
  useVehiclesCatalog: () => MOCK_VEHICLES_CATALOG,
}));

import { VehiclesDisplay } from "../VehiclesDisplay";

describe("VehiclesDisplay", () => {
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
});
