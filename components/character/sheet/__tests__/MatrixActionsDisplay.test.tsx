/**
 * MatrixActionsDisplay Component Tests
 *
 * Tests the matrix actions card showing categorized actions
 * with legality badges, dice pools, mark requirements,
 * session-aware pool calculations, and device compatibility.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createDeckerCharacter } from "./test-helpers";
import type { ActionDefinition } from "@/lib/types/action-definitions";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const MOCK_MATRIX_ACTIONS: ActionDefinition[] = [
  {
    id: "hack-on-the-fly",
    name: "Hack on the Fly",
    description: "Gain a mark on a target without being noticed.",
    type: "complex",
    domain: "matrix",
    subcategory: "hacking",
    cost: { actionType: "complex" },
    prerequisites: [],
    modifiers: [],
    effects: [],
    tags: ["illegal"],
    rollConfig: {
      skill: "hacking",
      attribute: "logic",
      limitType: "Sleaze",
    },
    source: { book: "SR5 Core", page: 240 },
  },
  {
    id: "brute-force",
    name: "Brute Force",
    description: "Force a mark on a target through raw power.",
    type: "complex",
    domain: "matrix",
    subcategory: "cybercombat",
    cost: { actionType: "complex" },
    prerequisites: [{ type: "resource", requirement: "marks", minimumValue: 0 }],
    modifiers: [],
    effects: [],
    tags: ["illegal"],
    rollConfig: {
      skill: "cybercombat",
      attribute: "logic",
      limitType: "Attack",
    },
  },
  {
    id: "matrix-perception",
    name: "Matrix Perception",
    description: "Observe the Matrix around you.",
    type: "complex",
    domain: "matrix",
    subcategory: "electronic-warfare",
    cost: { actionType: "complex" },
    prerequisites: [],
    modifiers: [],
    effects: [],
    tags: [],
    rollConfig: {
      skill: "computer",
      attribute: "intuition",
      limitType: "Data Processing",
    },
  },
  {
    id: "edit-file",
    name: "Edit File",
    description: "Edit or create a file on a host.",
    type: "complex",
    domain: "matrix",
    subcategory: "hacking",
    cost: { actionType: "complex" },
    prerequisites: [{ type: "resource", requirement: "marks", minimumValue: 1 }],
    modifiers: [],
    effects: [],
    tags: ["illegal"],
    rollConfig: {
      skill: "computer",
      attribute: "logic",
      limitType: "Data Processing",
    },
  },
];

vi.mock("@/lib/rules/RulesetContext", () => ({
  useMatrixActions: vi.fn(),
}));

vi.mock("@/lib/matrix", () => ({
  useMatrixMarks: vi.fn(),
  useMatrixSession: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/action-mapper", () => ({
  actionDefinitionToMatrixAction: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/dice-pool-calculator", () => ({
  calculateMatrixDicePool: vi.fn(),
}));

vi.mock("@/lib/rules/matrix/action-validator", () => ({
  isActionSupportedByDevice: vi.fn(),
}));

import { MatrixActionsDisplay } from "../MatrixActionsDisplay";
import { useMatrixActions } from "@/lib/rules/RulesetContext";
import { useMatrixMarks, useMatrixSession } from "@/lib/matrix";
import { actionDefinitionToMatrixAction } from "@/lib/rules/matrix/action-mapper";
import { calculateMatrixDicePool } from "@/lib/rules/matrix/dice-pool-calculator";
import { isActionSupportedByDevice } from "@/lib/rules/matrix/action-validator";

const mockUseMatrixActions = vi.mocked(useMatrixActions);
const mockUseMatrixMarks = vi.mocked(useMatrixMarks);
const mockUseMatrixSession = vi.mocked(useMatrixSession);
const mockActionMapper = vi.mocked(actionDefinitionToMatrixAction);
const mockCalculatePool = vi.mocked(calculateMatrixDicePool);
const mockIsActionSupported = vi.mocked(isActionSupportedByDevice);

const deckerCharacter = createDeckerCharacter();

// Default no-session state (useMatrixSession returns this when no provider)
const NO_SESSION = {
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
  placeMark: vi.fn().mockReturnValue({ success: false, mark: null, errors: [], newMarkCount: 0 }),
  removeMark: vi.fn().mockReturnValue({ success: false, marksRemoved: 0, remainingMarks: 0 }),
  clearAllMarks: vi.fn(),
  receiveMarkOnSelf: vi.fn(),
  removeReceivedMark: vi.fn(),
  applyMatrixDamage: vi.fn(),
  healMatrixDamage: vi.fn(),
  triggerConvergence: vi.fn().mockReturnValue(null),
  enterHost: vi.fn(),
  leaveHost: vi.fn(),
  clearError: vi.fn(),
};

// Reusable mock MatrixState for cyberdeck sessions
const MOCK_CYBERDECK_STATE = {
  isConnected: true,
  connectionMode: "cold-sim-vr" as const,
  activeDeviceType: "cyberdeck" as const,
  persona: {
    personaId: "p1",
    attack: 3,
    sleaze: 6,
    dataProcessing: 5,
    firewall: 4,
    deviceRating: 4,
  },
  marksHeld: [] as never[],
  marksReceived: [] as never[],
  loadedPrograms: [] as never[],
  programSlotsUsed: 0,
  programSlotsMax: 5,
  matrixConditionMonitor: 12,
  matrixDamageTaken: 0,
  overwatchScore: 0,
  overwatchThreshold: 40,
  overwatchConverged: false,
};

describe("MatrixActionsDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMatrixActions.mockReturnValue(MOCK_MATRIX_ACTIONS);
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [],
      marksReceived: [],
      getMarksOnTarget: () => 0,
      hasRequiredMarks: () => false,
    });
    // Default: no active session
    mockUseMatrixSession.mockReturnValue(NO_SESSION);
    // Mapper returns null by default (no session calculation)
    mockActionMapper.mockReturnValue(null);
    // All actions supported by default
    mockIsActionSupported.mockReturnValue(true);
  });

  it("groups actions by category with section headers", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    expect(screen.getByText("Matrix Actions")).toBeInTheDocument();
    expect(screen.getByText("Hacking")).toBeInTheDocument();
    expect(screen.getByText("Cybercombat")).toBeInTheDocument();
    expect(screen.getByText("Electronic Warfare")).toBeInTheDocument();
  });

  it("shows legality badges (legal/illegal)", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Hack on the Fly, Brute Force, Edit File are illegal; Matrix Perception is legal
    const illegalBadges = screen.getAllByText("Illegal");
    expect(illegalBadges.length).toBe(3);
    const legalBadges = screen.getAllByText("Legal");
    expect(legalBadges.length).toBe(1);
  });

  it("shows dice pool pills", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Hack on the Fly: hacking(6) + logic(6) = 12
    expect(screen.getByText("12d6")).toBeInTheDocument();
  });

  it("shows mark requirements", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Edit File requires 1 mark
    expect(screen.getByText("1M")).toBeInTheDocument();
  });

  it("expandable rows show formula breakdown", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Click on Hack on the Fly to expand
    fireEvent.click(screen.getByText("Hack on the Fly"));
    expect(screen.getByText("Gain a mark on a target without being noticed.")).toBeInTheDocument();
    expect(screen.getByText(/hacking \+ logic/)).toBeInTheDocument();
    expect(screen.getByText(/Sleaze/)).toBeInTheDocument();
  });

  it("click pool pill calls onSelect", () => {
    const onSelect = vi.fn();
    render(<MatrixActionsDisplay character={deckerCharacter} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("12d6"));
    expect(onSelect).toHaveBeenCalledWith(12, "Hack on the Fly");
  });

  it("OS risk indicator on illegal actions", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Expand an illegal action
    fireEvent.click(screen.getByText("Hack on the Fly"));
    expect(screen.getByText("Generates Overwatch Score")).toBeInTheDocument();
  });

  it("does not render when no matrix actions available", () => {
    mockUseMatrixActions.mockReturnValue([]);
    const { container } = render(<MatrixActionsDisplay character={deckerCharacter} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows source reference in expanded view", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByText("Hack on the Fly"));
    expect(screen.getByText("SR5 Core p.240")).toBeInTheDocument();
  });

  it("mark badge is red when no marks held", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Edit File requires 1 mark — badge should have red styling
    const badge = screen.getByText("1M");
    expect(badge.className).toContain("text-red-600");
  });

  it("mark badge is amber when marks exist", () => {
    mockUseMatrixMarks.mockReturnValue({
      marksHeld: [
        {
          id: "m1",
          targetId: "target-1",
          targetType: "host",
          targetName: "Test Host",
          markCount: 1,
          placedAt: "2025-01-01T00:00:00.000Z",
        },
      ],
      marksReceived: [],
      getMarksOnTarget: () => 1,
      hasRequiredMarks: () => true,
    });
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    const badge = screen.getByText("1M");
    expect(badge.className).toContain("text-amber-700");
  });

  it("shows mark warning text in expanded row when no marks", () => {
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Expand Edit File which requires 1 mark
    fireEvent.click(screen.getByText("Edit File"));
    expect(screen.getByText("Requires 1 mark(s) on target before use")).toBeInTheDocument();
  });

  // =========================================================================
  // Session-aware pool calculation tests
  // =========================================================================

  it("shows limit value in expanded row when session active", () => {
    mockUseMatrixSession.mockReturnValue({
      ...NO_SESSION,
      matrixState: MOCK_CYBERDECK_STATE,
      isJackedIn: true,
      connectionMode: "cold-sim-vr",
    });

    // Mapper returns a valid MatrixAction for hack-on-the-fly
    mockActionMapper.mockImplementation((action) => {
      if (action.id === "hack-on-the-fly") {
        return {
          id: "hack-on-the-fly",
          name: "Hack on the Fly",
          category: "sleaze",
          legality: "illegal",
          marksRequired: 0,
          limitAttribute: "sleaze" as const,
          skill: "hacking",
          attribute: "logic",
        };
      }
      return null;
    });

    mockCalculatePool.mockReturnValue({
      pool: {
        totalDice: 12,
        basePool: 12,
        attribute: "logic",
        skill: "hacking",
        modifiers: [],
        limit: 6,
        limitSource: "Sleaze",
      },
      formula: "logic (6) + hacking (6)",
      breakdown: [
        { source: "Attribute", attribute: "logic", value: 6 },
        { source: "Skill", skill: "hacking", value: 6 },
      ],
      limit: 6,
      limitType: "sleaze",
      limitSource: "Sleaze",
    });

    render(<MatrixActionsDisplay character={deckerCharacter} />);
    fireEvent.click(screen.getByText("Hack on the Fly"));
    // Limit should show numeric value
    expect(screen.getByText(/\(6\)/)).toBeInTheDocument();
  });

  it("shows hot-sim badge when in hot-sim VR mode", () => {
    mockUseMatrixSession.mockReturnValue({
      ...NO_SESSION,
      matrixState: { ...MOCK_CYBERDECK_STATE, connectionMode: "hot-sim-vr" as const },
      isJackedIn: true,
      connectionMode: "hot-sim-vr",
    });

    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Hot-Sim badges should appear on each action row
    const hotSimBadges = screen.getAllByText("Hot-Sim");
    expect(hotSimBadges.length).toBeGreaterThan(0);
  });

  it("shows connection mode badge in header", () => {
    mockUseMatrixSession.mockReturnValue({
      ...NO_SESSION,
      matrixState: MOCK_CYBERDECK_STATE,
      isJackedIn: true,
      connectionMode: "cold-sim-vr",
    });

    render(<MatrixActionsDisplay character={deckerCharacter} />);
    expect(screen.getByText("Cold-Sim VR")).toBeInTheDocument();
  });

  it("dims unsupported actions on commlink", () => {
    mockUseMatrixSession.mockReturnValue({
      ...NO_SESSION,
      matrixState: {
        ...MOCK_CYBERDECK_STATE,
        activeDeviceType: "commlink" as const,
        connectionMode: "ar" as const,
        persona: {
          personaId: "p1",
          attack: 0,
          sleaze: 0,
          dataProcessing: 4,
          firewall: 4,
          deviceRating: 4,
        },
      },
      isJackedIn: true,
      connectionMode: "ar",
    });

    // Illegal actions unsupported on commlink
    mockIsActionSupported.mockImplementation((action) => {
      return action.legality === "legal";
    });
    mockActionMapper.mockReturnValue({
      id: "test",
      name: "test",
      category: "attack",
      legality: "illegal",
      marksRequired: 0,
      limitAttribute: "attack",
      skill: "cybercombat",
      attribute: "logic",
    });

    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Expand an unsupported action
    fireEvent.click(screen.getByText("Hack on the Fly"));
    expect(screen.getByText("Not supported by current device")).toBeInTheDocument();
  });

  it("falls back to basic pool when no session", () => {
    // Default NO_SESSION is already set in beforeEach
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    // Should still show basic pool (hacking 6 + logic 6 = 12)
    expect(screen.getByText("12d6")).toBeInTheDocument();
    // calculateMatrixDicePool should not have been called
    expect(mockCalculatePool).not.toHaveBeenCalled();
  });

  it("shows OS warning in header when overwatch elevated", () => {
    mockUseMatrixSession.mockReturnValue({
      ...NO_SESSION,
      matrixState: { ...MOCK_CYBERDECK_STATE, overwatchScore: 25 },
      isJackedIn: true,
      connectionMode: "cold-sim-vr",
      overwatchScore: 25,
      overwatchWarningLevel: "warning",
    });

    render(<MatrixActionsDisplay character={deckerCharacter} />);
    expect(screen.getByText("OS warning")).toBeInTheDocument();
  });

  it("no connection badge when not jacked in", () => {
    // Default NO_SESSION (matrixState: null)
    render(<MatrixActionsDisplay character={deckerCharacter} />);
    expect(screen.queryByText("AR")).not.toBeInTheDocument();
    expect(screen.queryByText("Cold-Sim VR")).not.toBeInTheDocument();
    expect(screen.queryByText("Hot-Sim VR")).not.toBeInTheDocument();
  });
});
