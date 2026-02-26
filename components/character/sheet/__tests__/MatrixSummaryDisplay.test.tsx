/**
 * MatrixSummaryDisplay Component Tests
 *
 * Tests the matrix summary card showing active device info,
 * ASDF stats, condition monitor, connection mode, and overwatch score.
 * Includes tests for the enhanced context-driven overwatch tracker.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
  getOverwatchStatusDescription: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/overwatch-tracker", () => ({
  getSessionEvents: vi.fn(),
  getSessionDuration: vi.fn(),
  getScoreUntilConvergence: vi.fn(),
}));

vi.mock("@/lib/matrix", () => ({
  useOverwatchState: vi.fn(),
  useMatrixSession: vi.fn(),
}));

import { MatrixSummaryDisplay } from "../MatrixSummaryDisplay";
import {
  getActiveCyberdeck,
  getCharacterCommlinks,
  calculateMatrixConditionMonitor,
  getInitiativeDiceBonus,
} from "@/lib/rules/matrix/cyberdeck-validator";
import {
  getOverwatchWarningLevel,
  getOverwatchStatusDescription,
} from "@/lib/rules/matrix/overwatch-calculator";
import {
  getSessionEvents,
  getSessionDuration,
  getScoreUntilConvergence,
} from "@/lib/rules/matrix/overwatch-tracker";
import { useOverwatchState, useMatrixSession } from "@/lib/matrix";
import type { OverwatchSession, OverwatchEvent } from "@/lib/types/matrix";

const mockGetActiveCyberdeck = vi.mocked(getActiveCyberdeck);
const mockGetCharacterCommlinks = vi.mocked(getCharacterCommlinks);
const mockCalculateMatrixConditionMonitor = vi.mocked(calculateMatrixConditionMonitor);
const mockGetInitiativeDiceBonus = vi.mocked(getInitiativeDiceBonus);
const mockGetOverwatchWarningLevel = vi.mocked(getOverwatchWarningLevel);
const mockGetOverwatchStatusDescription = vi.mocked(getOverwatchStatusDescription);
const mockGetSessionEvents = vi.mocked(getSessionEvents);
const mockGetSessionDuration = vi.mocked(getSessionDuration);
const mockGetScoreUntilConvergence = vi.mocked(getScoreUntilConvergence);
const mockUseOverwatchState = vi.mocked(useOverwatchState);
const mockUseMatrixSession = vi.mocked(useMatrixSession);

// Default overwatch state (no active session)
const defaultOverwatchState = {
  score: 0,
  threshold: 40,
  warningLevel: "safe" as const,
  isConverged: false,
  progress: 0,
  session: null,
};

// Default matrix session returns
const defaultMatrixSession = {
  matrixState: null,
  overwatchSession: null,
  hasMatrixHardware: false,
  isJackedIn: false,
  connectionMode: "ar" as const,
  overwatchScore: 0,
  overwatchWarningLevel: "safe" as const,
  isConverged: false,
  isLoading: false,
  error: null,
  jackIn: vi.fn(),
  jackOut: vi.fn(),
  changeConnectionMode: vi.fn(),
  addOverwatchScore: vi.fn(),
  resetOverwatchScore: vi.fn(),
  placeMark: vi.fn(),
  removeMark: vi.fn(),
  clearAllMarks: vi.fn(),
  receiveMarkOnSelf: vi.fn(),
  removeReceivedMark: vi.fn(),
  applyMatrixDamage: vi.fn(),
  healMatrixDamage: vi.fn(),
  triggerConvergence: vi.fn(),
  enterHost: vi.fn(),
  leaveHost: vi.fn(),
  clearError: vi.fn(),
};

function setupDeckerMocks() {
  mockGetActiveCyberdeck.mockReturnValue(MOCK_CYBERDECK);
  mockGetCharacterCommlinks.mockReturnValue([]);
  mockCalculateMatrixConditionMonitor.mockReturnValue(12); // DR 4 + 8
  mockGetInitiativeDiceBonus.mockReturnValue(0);
  mockGetOverwatchWarningLevel.mockReturnValue("safe");
  mockGetOverwatchStatusDescription.mockReturnValue("Clean - No GOD attention");
  mockUseOverwatchState.mockReturnValue(defaultOverwatchState);
  mockUseMatrixSession.mockReturnValue(defaultMatrixSession);
  mockGetSessionEvents.mockReturnValue([]);
  mockGetSessionDuration.mockReturnValue(0);
  mockGetScoreUntilConvergence.mockReturnValue(40);
}

function setupCommlinkMocks() {
  mockGetActiveCyberdeck.mockReturnValue(null);
  mockGetCharacterCommlinks.mockReturnValue([
    { id: "comm-1", catalogId: "hermes-ikon", name: "Hermes Ikon", deviceRating: 5 },
  ]);
  mockCalculateMatrixConditionMonitor.mockReturnValue(13);
  mockGetInitiativeDiceBonus.mockReturnValue(0);
  mockGetOverwatchWarningLevel.mockReturnValue("safe");
  mockGetOverwatchStatusDescription.mockReturnValue("Clean - No GOD attention");
  mockUseOverwatchState.mockReturnValue(defaultOverwatchState);
  mockUseMatrixSession.mockReturnValue(defaultMatrixSession);
  mockGetSessionEvents.mockReturnValue([]);
  mockGetSessionDuration.mockReturnValue(0);
  mockGetScoreUntilConvergence.mockReturnValue(40);
}

function setupNoMatrixMocks() {
  mockGetActiveCyberdeck.mockReturnValue(null);
  mockGetCharacterCommlinks.mockReturnValue([]);
  mockCalculateMatrixConditionMonitor.mockReturnValue(0);
  mockGetInitiativeDiceBonus.mockReturnValue(0);
  mockGetOverwatchWarningLevel.mockReturnValue("safe");
  mockGetOverwatchStatusDescription.mockReturnValue("Clean - No GOD attention");
  mockUseOverwatchState.mockReturnValue(defaultOverwatchState);
  mockUseMatrixSession.mockReturnValue(defaultMatrixSession);
  mockGetSessionEvents.mockReturnValue([]);
  mockGetSessionDuration.mockReturnValue(0);
  mockGetScoreUntilConvergence.mockReturnValue(40);
}

/** Create a mock OverwatchSession */
function createMockSession(overrides?: Partial<OverwatchSession>): OverwatchSession {
  return {
    sessionId: "os-test-session-1",
    characterId: "char-1",
    startedAt: "2025-01-15T10:00:00.000Z" as import("@/lib/types").ISODateString,
    currentScore: 0,
    threshold: 40,
    events: [],
    converged: false,
    ...overrides,
  };
}

/** Create a mock OverwatchEvent */
function createMockEvent(overrides?: Partial<OverwatchEvent>): OverwatchEvent {
  return {
    timestamp: "2025-01-15T10:05:00.000Z" as import("@/lib/types").ISODateString,
    action: "Hack on the Fly",
    scoreAdded: 7,
    totalScore: 7,
    ...overrides,
  };
}

const deckerCharacter = createDeckerCharacter();
const commlinkCharacter = createCommlinkCharacter();
const mundaneCharacter = createSheetCharacter();

describe("MatrixSummaryDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Original tests (device info, ASDF, condition monitor, connection mode)
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Legacy OS bar (prop-driven, no active session)
  // ---------------------------------------------------------------------------

  it("shows legacy OS bar when overwatchScore prop > 0 and no active session", () => {
    setupDeckerMocks();
    mockGetOverwatchWarningLevel.mockReturnValue("warning");
    render(<MatrixSummaryDisplay character={deckerCharacter} overwatchScore={25} />);
    expect(screen.getByText("Overwatch Score")).toBeInTheDocument();
    expect(screen.getByText("25 / 40")).toBeInTheDocument();
  });

  it("hides OS bar when OS is 0 and no active session", () => {
    setupDeckerMocks();
    render(<MatrixSummaryDisplay character={deckerCharacter} />);
    expect(screen.queryByText("Overwatch Score")).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Enhanced overwatch tracker (context-driven, active session)
  // ---------------------------------------------------------------------------

  it("shows live overwatch tracker when session is active", () => {
    setupDeckerMocks();
    const session = createMockSession({ currentScore: 15 });
    mockUseOverwatchState.mockReturnValue({
      score: 15,
      threshold: 40,
      warningLevel: "caution",
      isConverged: false,
      progress: 37.5,
      session,
    });
    mockGetOverwatchStatusDescription.mockReturnValue("On the radar - GOD tracking initiated");
    mockGetScoreUntilConvergence.mockReturnValue(25);
    mockGetSessionDuration.mockReturnValue(60000);
    mockGetSessionEvents.mockReturnValue([]);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    expect(screen.getByText("Overwatch Score")).toBeInTheDocument();
    expect(screen.getByText("15 / 40")).toBeInTheDocument();
  });

  it("shows status description from calculator", () => {
    setupDeckerMocks();
    const session = createMockSession({ currentScore: 20 });
    mockUseOverwatchState.mockReturnValue({
      score: 20,
      threshold: 40,
      warningLevel: "warning",
      isConverged: false,
      progress: 50,
      session,
    });
    mockGetOverwatchStatusDescription.mockReturnValue("On the radar - GOD tracking initiated");
    mockGetScoreUntilConvergence.mockReturnValue(20);
    mockGetSessionDuration.mockReturnValue(0);
    mockGetSessionEvents.mockReturnValue([]);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    expect(screen.getByText("On the radar - GOD tracking initiated")).toBeInTheDocument();
  });

  it("shows score until convergence", () => {
    setupDeckerMocks();
    const session = createMockSession({ currentScore: 15 });
    mockUseOverwatchState.mockReturnValue({
      score: 15,
      threshold: 40,
      warningLevel: "caution",
      isConverged: false,
      progress: 37.5,
      session,
    });
    mockGetScoreUntilConvergence.mockReturnValue(25);
    mockGetSessionDuration.mockReturnValue(0);
    mockGetSessionEvents.mockReturnValue([]);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    expect(screen.getByText("25 until convergence")).toBeInTheDocument();
  });

  it("shows convergence alert when converged", () => {
    setupDeckerMocks();
    const session = createMockSession({ currentScore: 42, converged: true });
    mockUseOverwatchState.mockReturnValue({
      score: 42,
      threshold: 40,
      warningLevel: "critical",
      isConverged: true,
      progress: 100,
      session,
    });
    mockGetScoreUntilConvergence.mockReturnValue(0);
    mockGetSessionDuration.mockReturnValue(0);
    mockGetSessionEvents.mockReturnValue([]);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    expect(screen.getByText(/convergence — god has found you/i)).toBeInTheDocument();
  });

  it("shows Physical dumpshock type for hot-sim VR convergence", () => {
    setupDeckerMocks();
    const session = createMockSession({ currentScore: 42, converged: true });
    mockUseOverwatchState.mockReturnValue({
      score: 42,
      threshold: 40,
      warningLevel: "critical",
      isConverged: true,
      progress: 100,
      session,
    });
    mockUseMatrixSession.mockReturnValue({
      ...defaultMatrixSession,
      connectionMode: "hot-sim-vr",
    });
    mockGetScoreUntilConvergence.mockReturnValue(0);
    mockGetSessionDuration.mockReturnValue(0);
    mockGetSessionEvents.mockReturnValue([]);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    expect(screen.getByText(/physical/i)).toBeInTheDocument();
  });

  it("shows Stun dumpshock type for cold-sim VR convergence", () => {
    setupDeckerMocks();
    const session = createMockSession({ currentScore: 42, converged: true });
    mockUseOverwatchState.mockReturnValue({
      score: 42,
      threshold: 40,
      warningLevel: "critical",
      isConverged: true,
      progress: 100,
      session,
    });
    mockUseMatrixSession.mockReturnValue({
      ...defaultMatrixSession,
      connectionMode: "cold-sim-vr",
    });
    mockGetScoreUntilConvergence.mockReturnValue(0);
    mockGetSessionDuration.mockReturnValue(0);
    mockGetSessionEvents.mockReturnValue([]);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    expect(screen.getByText(/stun/i)).toBeInTheDocument();
  });

  it("expandable event log shows events on click", () => {
    setupDeckerMocks();
    const events: OverwatchEvent[] = [
      createMockEvent({ action: "Hack on the Fly", scoreAdded: 7, totalScore: 7 }),
      createMockEvent({
        action: "Brute Force",
        scoreAdded: 5,
        totalScore: 12,
        timestamp: "2025-01-15T10:06:00.000Z" as import("@/lib/types").ISODateString,
      }),
    ];
    const session = createMockSession({ currentScore: 12, events });
    mockUseOverwatchState.mockReturnValue({
      score: 12,
      threshold: 40,
      warningLevel: "caution",
      isConverged: false,
      progress: 30,
      session,
    });
    mockGetScoreUntilConvergence.mockReturnValue(28);
    mockGetSessionDuration.mockReturnValue(60000);
    mockGetSessionEvents.mockReturnValue(events);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    // Event log toggle should be visible
    expect(screen.getByText("Event Log (2)")).toBeInTheDocument();

    // Events should not be visible yet
    expect(screen.queryByText("Hack on the Fly")).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText("Event Log (2)"));

    // Events should now be visible
    expect(screen.getByText("Hack on the Fly")).toBeInTheDocument();
    expect(screen.getByText("Brute Force")).toBeInTheDocument();
    expect(screen.getByText("+7")).toBeInTheDocument();
    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("hides enhanced section when no session, shows legacy bar with props", () => {
    setupDeckerMocks();
    mockGetOverwatchWarningLevel.mockReturnValue("warning");
    mockUseOverwatchState.mockReturnValue(defaultOverwatchState);

    render(<MatrixSummaryDisplay character={deckerCharacter} overwatchScore={20} />);

    // Legacy bar should show
    expect(screen.getByText("Overwatch Score")).toBeInTheDocument();
    expect(screen.getByText("20 / 40")).toBeInTheDocument();

    // Enhanced features should not show (no session)
    expect(screen.queryByText("until convergence")).not.toBeInTheDocument();
  });

  it("shows session duration", () => {
    setupDeckerMocks();
    const session = createMockSession({ currentScore: 10 });
    mockUseOverwatchState.mockReturnValue({
      score: 10,
      threshold: 40,
      warningLevel: "caution",
      isConverged: false,
      progress: 25,
      session,
    });
    mockGetScoreUntilConvergence.mockReturnValue(30);
    mockGetSessionDuration.mockReturnValue(125000); // 2m 5s
    mockGetSessionEvents.mockReturnValue([]);

    render(<MatrixSummaryDisplay character={deckerCharacter} />);

    expect(screen.getByText("2m 5s")).toBeInTheDocument();
  });
});
