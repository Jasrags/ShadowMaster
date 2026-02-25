import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createRiggerCharacter,
  createSheetCharacter,
  MOCK_DRONE,
  MOCK_VEHICLE,
} from "./test-helpers";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockHasVehicleControlRig = vi.fn();
const mockGetVehicleControlRig = vi.fn();
const mockCalculateJumpedInInitiative = vi.fn();
const mockGetHotSimRiskDescription = vi.fn();
const mockGetColdSimBenefitsDescription = vi.fn();
const mockGetOwnedDrones = vi.fn();

vi.mock("@/lib/rules/rigging", () => ({
  hasVehicleControlRig: (...args: unknown[]) => mockHasVehicleControlRig(...args),
  getVehicleControlRig: (...args: unknown[]) => mockGetVehicleControlRig(...args),
  calculateJumpedInInitiative: (...args: unknown[]) => mockCalculateJumpedInInitiative(...args),
  getHotSimRiskDescription: () => mockGetHotSimRiskDescription(),
  getColdSimBenefitsDescription: () => mockGetColdSimBenefitsDescription(),
  getOwnedDrones: (...args: unknown[]) => mockGetOwnedDrones(...args),
}));

import { JumpInControlDisplay } from "../JumpInControlDisplay";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("JumpInControlDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetOwnedDrones.mockReturnValue([]);
    mockGetHotSimRiskDescription.mockReturnValue(
      "Hot-sim provides additional initiative dice but biofeedback causes physical damage."
    );
    mockGetColdSimBenefitsDescription.mockReturnValue(
      "Cold-sim provides safer operation with biofeedback causing only stun damage."
    );
    mockCalculateJumpedInInitiative.mockReturnValue({
      initiative: 12,
      initiativeDice: 3,
      breakdown: { base: 10, reactionBonus: 5, intuitionBonus: 5, vcrBonus: 2, vrModeBonus: 1 },
    });
  });

  it("returns null when character has no VCR", () => {
    mockHasVehicleControlRig.mockReturnValue(false);
    mockGetVehicleControlRig.mockReturnValue(null);

    const character = createSheetCharacter();
    const { container } = render(<JumpInControlDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders VCR info with rating and control bonus", () => {
    mockHasVehicleControlRig.mockReturnValue(true);
    mockGetVehicleControlRig.mockReturnValue({
      rating: 2,
      controlBonus: 2,
      initiativeDiceBonus: 2,
      essenceCost: 1.0,
    });

    const character = createRiggerCharacter();
    render(<JumpInControlDisplay character={character} />);

    expect(screen.getByTestId("vcr-info")).toBeInTheDocument();
    expect(screen.getByTestId("vcr-rating")).toHaveTextContent("Rating 2");
    expect(screen.getByTestId("control-bonus")).toHaveTextContent("+2 to vehicle tests");
  });

  it("lists jumpable targets with type badges", () => {
    mockHasVehicleControlRig.mockReturnValue(true);
    mockGetVehicleControlRig.mockReturnValue({
      rating: 2,
      controlBonus: 2,
      initiativeDiceBonus: 2,
      essenceCost: 1.0,
    });
    mockGetOwnedDrones.mockReturnValue([MOCK_DRONE]);

    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<JumpInControlDisplay character={character} />);

    expect(screen.getByTestId("jump-targets")).toBeInTheDocument();
    const rows = screen.getAllByTestId("jump-target-row");
    expect(rows).toHaveLength(2); // 1 vehicle + 1 drone

    expect(screen.getByText("Dodge Scoot")).toBeInTheDocument();
    expect(screen.getByText("MCT Fly-Spy")).toBeInTheDocument();
    expect(screen.getByText("Vehicle")).toBeInTheDocument();
    expect(screen.getByText("Drone")).toBeInTheDocument();
  });

  it("displays VR mode badges with descriptions", () => {
    mockHasVehicleControlRig.mockReturnValue(true);
    mockGetVehicleControlRig.mockReturnValue({
      rating: 2,
      controlBonus: 2,
      initiativeDiceBonus: 2,
      essenceCost: 1.0,
    });

    const character = createRiggerCharacter();
    render(<JumpInControlDisplay character={character} />);

    expect(screen.getByTestId("vr-modes")).toBeInTheDocument();
    expect(screen.getByText("Cold-Sim")).toBeInTheDocument();
    expect(screen.getByText("Hot-Sim")).toBeInTheDocument();
  });

  it("shows hot-sim warning text", () => {
    mockHasVehicleControlRig.mockReturnValue(true);
    mockGetVehicleControlRig.mockReturnValue({
      rating: 2,
      controlBonus: 2,
      initiativeDiceBonus: 2,
      essenceCost: 1.0,
    });

    const character = createRiggerCharacter();
    render(<JumpInControlDisplay character={character} />);

    expect(screen.getByTestId("hotsim-warning")).toHaveTextContent(
      "biofeedback causes physical damage"
    );
  });

  it("displays initiative preview for VR modes", () => {
    mockHasVehicleControlRig.mockReturnValue(true);
    mockGetVehicleControlRig.mockReturnValue({
      rating: 2,
      controlBonus: 2,
      initiativeDiceBonus: 2,
      essenceCost: 1.0,
    });
    mockCalculateJumpedInInitiative.mockReturnValue({
      initiative: 12,
      initiativeDice: 3,
      breakdown: { base: 10, reactionBonus: 5, intuitionBonus: 5, vcrBonus: 2, vrModeBonus: 1 },
    });

    const character = createRiggerCharacter();
    render(<JumpInControlDisplay character={character} />);

    // Initiative values should be displayed
    expect(screen.getAllByText(/Init 12\+3D6/)).toHaveLength(2); // cold-sim and hot-sim
  });
});
