/**
 * MatrixSummaryDisplay Component Tests
 *
 * Tests the matrix summary card showing active device info,
 * ASDF stats, condition monitor, connection mode, and overwatch score.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createDeckerCharacter,
  createCommlinkCharacter,
  createSheetCharacter,
  MOCK_CYBERDECK,
} from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/matrix/cyberdeck-validator", () => ({
  getActiveCyberdeck: vi.fn(),
  getCharacterCommlinks: vi.fn(),
  calculateMatrixConditionMonitor: vi.fn(),
  getInitiativeDiceBonus: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/overwatch-calculator", () => ({
  getOverwatchWarningLevel: vi.fn(),
}));

import { MatrixSummaryDisplay } from "../MatrixSummaryDisplay";
import {
  getActiveCyberdeck,
  getCharacterCommlinks,
  calculateMatrixConditionMonitor,
  getInitiativeDiceBonus,
} from "@/lib/rules/matrix/cyberdeck-validator";
import { getOverwatchWarningLevel } from "@/lib/rules/matrix/overwatch-calculator";

const mockGetActiveCyberdeck = vi.mocked(getActiveCyberdeck);
const mockGetCharacterCommlinks = vi.mocked(getCharacterCommlinks);
const mockCalculateMatrixConditionMonitor = vi.mocked(calculateMatrixConditionMonitor);
const mockGetInitiativeDiceBonus = vi.mocked(getInitiativeDiceBonus);
const mockGetOverwatchWarningLevel = vi.mocked(getOverwatchWarningLevel);

function setupDeckerMocks() {
  mockGetActiveCyberdeck.mockReturnValue(MOCK_CYBERDECK);
  mockGetCharacterCommlinks.mockReturnValue([]);
  mockCalculateMatrixConditionMonitor.mockReturnValue(12); // DR 4 + 8
  mockGetInitiativeDiceBonus.mockReturnValue(0);
  mockGetOverwatchWarningLevel.mockReturnValue("safe");
}

function setupCommlinkMocks() {
  mockGetActiveCyberdeck.mockReturnValue(null);
  mockGetCharacterCommlinks.mockReturnValue([
    { id: "comm-1", catalogId: "hermes-ikon", name: "Hermes Ikon", deviceRating: 5 },
  ]);
  mockCalculateMatrixConditionMonitor.mockReturnValue(13);
  mockGetInitiativeDiceBonus.mockReturnValue(0);
  mockGetOverwatchWarningLevel.mockReturnValue("safe");
}

function setupNoMatrixMocks() {
  mockGetActiveCyberdeck.mockReturnValue(null);
  mockGetCharacterCommlinks.mockReturnValue([]);
  mockCalculateMatrixConditionMonitor.mockReturnValue(0);
  mockGetInitiativeDiceBonus.mockReturnValue(0);
  mockGetOverwatchWarningLevel.mockReturnValue("safe");
}

const deckerCharacter = createDeckerCharacter();
const commlinkCharacter = createCommlinkCharacter();
const mundaneCharacter = createSheetCharacter();

describe("MatrixSummaryDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders active device name and type badge for cyberdeck", () => {
    setupDeckerMocks();
    render(<MatrixSummaryDisplay character={deckerCharacter} />);
    expect(screen.getByText("Matrix")).toBeInTheDocument();
    expect(screen.getByText("Novatech Navigator")).toBeInTheDocument();
    expect(screen.getByText("Cyberdeck")).toBeInTheDocument();
    expect(screen.getByText("DR 4")).toBeInTheDocument();
  });

  it("shows ASDF stats from active cyberdeck config", () => {
    setupDeckerMocks();
    render(<MatrixSummaryDisplay character={deckerCharacter} />);
    expect(screen.getByText("ASDF Configuration")).toBeInTheDocument();
    expect(screen.getByText("ATK")).toBeInTheDocument();
    expect(screen.getByText("SLZ")).toBeInTheDocument();
    expect(screen.getByText("DP")).toBeInTheDocument();
    expect(screen.getByText("FW")).toBeInTheDocument();
    // Check values: attack=3, sleaze=4, dp=6, fw=5
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows matrix condition monitor (DR + 8)", () => {
    setupDeckerMocks();
    render(<MatrixSummaryDisplay character={deckerCharacter} />);
    expect(screen.getByText("Matrix Condition Monitor")).toBeInTheDocument();
    expect(screen.getByText("12 boxes")).toBeInTheDocument();
    expect(mockCalculateMatrixConditionMonitor).toHaveBeenCalledWith(4);
  });

  it("shows connection mode badge", () => {
    setupDeckerMocks();
    render(<MatrixSummaryDisplay character={deckerCharacter} />);
    expect(screen.getByText("Connection Mode")).toBeInTheDocument();
    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("shows OS bar when overwatchScore prop > 0", () => {
    setupDeckerMocks();
    mockGetOverwatchWarningLevel.mockReturnValue("warning");
    render(<MatrixSummaryDisplay character={deckerCharacter} overwatchScore={25} />);
    expect(screen.getByText("Overwatch Score")).toBeInTheDocument();
    expect(screen.getByText("25 / 40")).toBeInTheDocument();
  });

  it("hides OS bar when OS is 0 (default)", () => {
    setupDeckerMocks();
    render(<MatrixSummaryDisplay character={deckerCharacter} />);
    expect(screen.queryByText("Overwatch Score")).not.toBeInTheDocument();
  });

  it("hides entirely when character has no matrix access", () => {
    setupNoMatrixMocks();
    const { container } = render(<MatrixSummaryDisplay character={mundaneCharacter} />);
    expect(container.innerHTML).toBe("");
  });

  it("commlink-only: shows simplified view (no ASDF config)", () => {
    setupCommlinkMocks();
    render(<MatrixSummaryDisplay character={commlinkCharacter} />);
    expect(screen.getByText("Hermes Ikon")).toBeInTheDocument();
    expect(screen.getByText("Commlink")).toBeInTheDocument();
    expect(screen.getByText("DR 5")).toBeInTheDocument();
    expect(screen.queryByText("ASDF Configuration")).not.toBeInTheDocument();
  });

  it("shows initiative bonus for VR modes", () => {
    setupDeckerMocks();
    mockGetInitiativeDiceBonus.mockReturnValue(2);
    render(<MatrixSummaryDisplay character={deckerCharacter} connectionMode="hot-sim-vr" />);
    expect(screen.getByText("Hot-Sim VR")).toBeInTheDocument();
    expect(screen.getByText("+2d6 Init")).toBeInTheDocument();
  });

  it("highlights highest ASDF attribute with emerald styling", () => {
    setupDeckerMocks();
    render(<MatrixSummaryDisplay character={deckerCharacter} />);
    // DP (6) is the highest - check its value element has emerald styling
    const dpValue = screen.getByText("6");
    expect(dpValue.className).toContain("emerald");
  });
});
