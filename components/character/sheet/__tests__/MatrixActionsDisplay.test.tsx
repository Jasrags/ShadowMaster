/**
 * MatrixActionsDisplay Component Tests
 *
 * Tests the matrix actions card showing categorized actions
 * with legality badges, dice pools, and mark requirements.
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
}));

import { MatrixActionsDisplay } from "../MatrixActionsDisplay";
import { useMatrixActions } from "@/lib/rules/RulesetContext";
import { useMatrixMarks } from "@/lib/matrix";

const mockUseMatrixActions = vi.mocked(useMatrixActions);
const mockUseMatrixMarks = vi.mocked(useMatrixMarks);

const deckerCharacter = createDeckerCharacter();

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
});
