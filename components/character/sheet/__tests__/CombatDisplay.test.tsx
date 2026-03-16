/**
 * CombatDisplay Component Tests
 *
 * Tests the combat card showing CombatQuickReference delegation
 * and encumbrance warning display.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockCombatQuickReference = vi.fn((_props: Record<string, unknown>) => (
  <div data-testid="combat-quick-reference">CombatQuickReference</div>
));

vi.mock("@/app/characters/[id]/components/CombatQuickReference", () => ({
  CombatQuickReference: (props: Record<string, unknown>) => mockCombatQuickReference(props),
}));

const mockCalculateEncumbrance = vi.fn();

vi.mock("@/lib/rules/encumbrance/calculator", () => ({
  calculateEncumbrance: (...args: unknown[]) => mockCalculateEncumbrance(...args),
}));

import { CombatDisplay } from "../CombatDisplay";
import type { Character } from "@/lib/types";

const baseCharacter: Character = createSheetCharacter();
const defaultProps = {
  character: baseCharacter,
  woundModifier: 0,
  physicalLimit: 5,
  onPoolSelect: vi.fn(),
};

describe("CombatDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCalculateEncumbrance.mockReturnValue({
      isEncumbered: false,
      overweightPenalty: 0,
      totalWeight: 5,
      carryCapacity: 40,
    });
  });

  it("renders card with Combat title", () => {
    render(<CombatDisplay {...defaultProps} />);
    expect(screen.getByText("Combat")).toBeInTheDocument();
  });

  it("renders CombatQuickReference with correct props", () => {
    const onPoolSelect = vi.fn();
    render(
      <CombatDisplay
        {...defaultProps}
        woundModifier={-2}
        physicalLimit={7}
        onPoolSelect={onPoolSelect}
      />
    );

    expect(mockCombatQuickReference).toHaveBeenCalledWith(
      expect.objectContaining({
        character: baseCharacter,
        woundModifier: -2,
        physicalLimit: 7,
        onPoolSelect,
      })
    );
  });

  it("passes resolveEffects to CombatQuickReference when provided", () => {
    const resolveEffects = vi.fn();
    render(<CombatDisplay {...defaultProps} resolveEffects={resolveEffects} />);

    expect(mockCombatQuickReference).toHaveBeenCalledWith(
      expect.objectContaining({ resolveEffects })
    );
  });

  it("does not show encumbrance warning when not encumbered", () => {
    render(<CombatDisplay {...defaultProps} />);
    expect(screen.queryByTestId("encumbrance-warning")).not.toBeInTheDocument();
  });

  it("shows encumbrance warning when character is encumbered", () => {
    mockCalculateEncumbrance.mockReturnValue({
      isEncumbered: true,
      overweightPenalty: -3,
      totalWeight: 55,
      carryCapacity: 40,
    });

    render(<CombatDisplay {...defaultProps} />);

    const warning = screen.getByTestId("encumbrance-warning");
    expect(warning).toBeInTheDocument();
    expect(warning).toHaveTextContent("-3 penalty");
  });

  it("shows correct penalty value in encumbrance warning", () => {
    mockCalculateEncumbrance.mockReturnValue({
      isEncumbered: true,
      overweightPenalty: -1,
      totalWeight: 42,
      carryCapacity: 40,
    });

    render(<CombatDisplay {...defaultProps} />);
    expect(screen.getByTestId("encumbrance-warning")).toHaveTextContent("-1 penalty");
  });

  it("calculates encumbrance from the character", () => {
    render(<CombatDisplay {...defaultProps} />);
    expect(mockCalculateEncumbrance).toHaveBeenCalledWith(baseCharacter);
  });
});
