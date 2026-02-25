import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createRiggerCharacter,
  createSheetCharacter,
  MOCK_VEHICLE,
  MOCK_DRONE,
} from "./test-helpers";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/rigging", () => ({
  requiresJumpedIn: (actionType: string) =>
    ["stunt", "ram", "evasive_driving"].includes(actionType),
  canPerformRemotely: (actionType: string) =>
    [
      "accelerate",
      "decelerate",
      "turn",
      "catch_up",
      "cut_off",
      "fire_weapon",
      "sensor_targeting",
    ].includes(actionType),
  getActionTypeDescription: (actionType: string) => {
    const map: Record<string, string> = {
      accelerate: "Accelerate",
      decelerate: "Decelerate",
      turn: "Turn",
      catch_up: "Catch Up / Overtake",
      cut_off: "Cut Off",
      evasive_driving: "Evasive Driving",
      ram: "Ram",
      fire_weapon: "Fire Vehicle Weapon",
      sensor_targeting: "Sensor Targeting",
      stunt: "Stunt",
    };
    return map[actionType] || actionType;
  },
  getTestTypeForAction: (actionType: string) => {
    const map: Record<string, string> = {
      accelerate: "control",
      decelerate: "control",
      turn: "control",
      catch_up: "chase",
      cut_off: "chase",
      ram: "ramming",
      stunt: "stunt",
      fire_weapon: "gunnery",
      sensor_targeting: "sensor",
      evasive_driving: "control",
    };
    return map[actionType] || "control";
  },
  getSkillForAction: (actionType: string) => {
    if (actionType === "fire_weapon") return "gunnery";
    if (actionType === "sensor_targeting") return "perception";
    return "pilot";
  },
}));

import { VehicleActionsDisplay } from "../VehicleActionsDisplay";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("VehicleActionsDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no vehicles and no drones", () => {
    const character = createSheetCharacter({ vehicles: undefined, drones: undefined });
    const { container } = render(<VehicleActionsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders action categories in order", () => {
    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<VehicleActionsDisplay character={character} />);

    expect(screen.getByText("Movement")).toBeInTheDocument();
    expect(screen.getByText("Pursuit")).toBeInTheDocument();
    expect(screen.getByText("Combat")).toBeInTheDocument();
  });

  it("renders action rows with names", () => {
    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<VehicleActionsDisplay character={character} />);

    expect(screen.getByText("Accelerate")).toBeInTheDocument();
    expect(screen.getByText("Turn")).toBeInTheDocument();
    expect(screen.getByText("Fire Vehicle Weapon")).toBeInTheDocument();
  });

  it("shows Jumped-In badge for actions requiring it", () => {
    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<VehicleActionsDisplay character={character} />);

    const jumpedInBadges = screen.getAllByTestId("jumped-in-badge");
    expect(jumpedInBadges.length).toBeGreaterThan(0);
  });

  it("shows Remote badge for remote-capable actions", () => {
    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<VehicleActionsDisplay character={character} />);

    const remoteBadges = screen.getAllByTestId("remote-badge");
    expect(remoteBadges.length).toBeGreaterThan(0);
  });

  it("shows dice pool pills for actions with calculated pools", () => {
    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<VehicleActionsDisplay character={character} />);

    const poolPills = screen.getAllByTestId("pool-pill");
    expect(poolPills.length).toBeGreaterThan(0);
  });

  it("expands action row to show details on click", () => {
    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<VehicleActionsDisplay character={character} />);

    // Click the first action row
    const actionRows = screen.getAllByTestId("action-row");
    fireEvent.click(actionRows[0]);

    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
  });

  it("calls onSelect when pool pill is clicked", () => {
    const onSelect = vi.fn();
    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<VehicleActionsDisplay character={character} onSelect={onSelect} />);

    const poolPills = screen.getAllByTestId("pool-pill");
    fireEvent.click(poolPills[0]);

    expect(onSelect).toHaveBeenCalledWith(expect.any(Number), expect.any(String));
  });

  it("renders with drones only (no vehicles)", () => {
    const character = createRiggerCharacter({ vehicles: undefined, drones: [MOCK_DRONE] });
    render(<VehicleActionsDisplay character={character} />);

    expect(screen.getByText("Movement")).toBeInTheDocument();
  });
});
