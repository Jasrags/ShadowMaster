import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createRiggerCharacter,
  createSheetCharacter,
  MOCK_RCC,
  MOCK_DRONE,
  MOCK_VEHICLE,
} from "./test-helpers";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

// Mock rigging functions
const mockHasVehicleControlRig = vi.fn();
const mockGetVehicleControlRig = vi.fn();
const mockHasRCC = vi.fn();
const mockGetActiveRCC = vi.fn();
const mockCalculateMaxSlavedDrones = vi.fn();
const mockCalculateNoiseReduction = vi.fn();
const mockGetOwnedDrones = vi.fn();
const mockGetOwnedAutosofts = vi.fn();
const mockCanPerformRiggingActions = vi.fn();

vi.mock("@/lib/rules/rigging", () => ({
  hasVehicleControlRig: (...args: unknown[]) => mockHasVehicleControlRig(...args),
  getVehicleControlRig: (...args: unknown[]) => mockGetVehicleControlRig(...args),
  hasRCC: (...args: unknown[]) => mockHasRCC(...args),
  getActiveRCC: (...args: unknown[]) => mockGetActiveRCC(...args),
  calculateMaxSlavedDrones: (...args: unknown[]) => mockCalculateMaxSlavedDrones(...args),
  calculateNoiseReduction: (...args: unknown[]) => mockCalculateNoiseReduction(...args),
  getOwnedDrones: (...args: unknown[]) => mockGetOwnedDrones(...args),
  getOwnedAutosofts: (...args: unknown[]) => mockGetOwnedAutosofts(...args),
  canPerformRiggingActions: (...args: unknown[]) => mockCanPerformRiggingActions(...args),
}));

import { RiggingSummaryDisplay } from "../RiggingSummaryDisplay";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("RiggingSummaryDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetOwnedDrones.mockReturnValue([]);
    mockGetOwnedAutosofts.mockReturnValue([]);
  });

  it("returns null when character has no rigging gear", () => {
    mockCanPerformRiggingActions.mockReturnValue(false);
    mockHasVehicleControlRig.mockReturnValue(false);
    mockGetVehicleControlRig.mockReturnValue(null);
    mockHasRCC.mockReturnValue(false);
    mockGetActiveRCC.mockReturnValue(null);

    const character = createSheetCharacter();
    const { container } = render(<RiggingSummaryDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders VCR section with rating, control bonus, and initiative dice", () => {
    mockCanPerformRiggingActions.mockReturnValue(true);
    mockHasVehicleControlRig.mockReturnValue(true);
    mockGetVehicleControlRig.mockReturnValue({
      rating: 2,
      controlBonus: 2,
      initiativeDiceBonus: 2,
      essenceCost: 1.0,
    });
    mockHasRCC.mockReturnValue(false);
    mockGetActiveRCC.mockReturnValue(null);

    const character = createRiggerCharacter();
    render(<RiggingSummaryDisplay character={character} />);

    expect(screen.getByTestId("vcr-section")).toBeInTheDocument();
    expect(screen.getByTestId("vcr-rating")).toHaveTextContent("R2");
    expect(screen.getByTestId("vcr-control-bonus")).toHaveTextContent("+2 Control");
    expect(screen.getByTestId("vcr-init-dice")).toHaveTextContent("+2D6 Init");
  });

  it("renders RCC section with DR, DP, FW, and noise reduction", () => {
    mockCanPerformRiggingActions.mockReturnValue(true);
    mockHasVehicleControlRig.mockReturnValue(false);
    mockGetVehicleControlRig.mockReturnValue(null);
    mockHasRCC.mockReturnValue(true);
    mockGetActiveRCC.mockReturnValue(MOCK_RCC);
    mockCalculateMaxSlavedDrones.mockReturnValue(12);
    mockCalculateNoiseReduction.mockReturnValue(5);

    const character = createRiggerCharacter();
    render(<RiggingSummaryDisplay character={character} />);

    expect(screen.getByTestId("rcc-section")).toBeInTheDocument();
    expect(screen.getByText("RCC-Standard")).toBeInTheDocument();
    expect(screen.getByText("DR 5")).toBeInTheDocument();
    expect(screen.getByTestId("rcc-dp")).toBeInTheDocument();
    expect(screen.getByTestId("rcc-fw")).toBeInTheDocument();
    expect(screen.getByTestId("rcc-noise-reduction")).toBeInTheDocument();
  });

  it("displays network capacity when RCC is present", () => {
    mockCanPerformRiggingActions.mockReturnValue(true);
    mockHasVehicleControlRig.mockReturnValue(false);
    mockGetVehicleControlRig.mockReturnValue(null);
    mockHasRCC.mockReturnValue(true);
    mockGetActiveRCC.mockReturnValue(MOCK_RCC);
    mockCalculateMaxSlavedDrones.mockReturnValue(12);
    mockCalculateNoiseReduction.mockReturnValue(5);

    const character = createRiggerCharacter();
    render(<RiggingSummaryDisplay character={character} />);

    expect(screen.getByTestId("network-capacity")).toBeInTheDocument();
    expect(screen.getByText("0 / 12")).toBeInTheDocument();
  });

  it("displays equipment counts", () => {
    mockCanPerformRiggingActions.mockReturnValue(true);
    mockHasVehicleControlRig.mockReturnValue(false);
    mockGetVehicleControlRig.mockReturnValue(null);
    mockHasRCC.mockReturnValue(false);
    mockGetActiveRCC.mockReturnValue(null);
    mockGetOwnedDrones.mockReturnValue([MOCK_DRONE]);
    mockGetOwnedAutosofts.mockReturnValue([{ name: "Clearsight", rating: 3 }]);

    const character = createRiggerCharacter({ vehicles: [MOCK_VEHICLE] });
    render(<RiggingSummaryDisplay character={character} />);

    const counts = screen.getByTestId("equipment-counts");
    expect(counts).toHaveTextContent("1 Vehicle");
    expect(counts).toHaveTextContent("1 Drone");
    expect(counts).toHaveTextContent("1 Autosoft");
  });
});
