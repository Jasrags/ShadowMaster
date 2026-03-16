/**
 * ConditionDisplay Component Tests
 *
 * Tests the condition card showing wound modifier indicator,
 * physical/stun/overflow condition monitors, and damage callbacks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockInteractiveConditionMonitor = vi.fn(
  (props: { type: string; current: number; max: number }) => (
    <div data-testid={`condition-monitor-${props.type}`}>
      {props.type}: {props.current}/{props.max}
    </div>
  )
);

vi.mock("@/app/characters/[id]/components/InteractiveConditionMonitor", () => ({
  InteractiveConditionMonitor: (props: Record<string, unknown>) =>
    mockInteractiveConditionMonitor(props as { type: string; current: number; max: number }),
}));

import { ConditionDisplay } from "../ConditionDisplay";
import type { Character } from "@/lib/types";

const baseCharacter: Character = createSheetCharacter({
  condition: { physicalDamage: 2, stunDamage: 1, overflowDamage: 0 },
});

const defaultProps = {
  character: baseCharacter,
  woundModifier: 0,
  physicalMonitorMax: 11,
  stunMonitorMax: 10,
  readonly: false,
  onDamageApplied: vi.fn(),
};

describe("ConditionDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders card with Condition title", () => {
    render(<ConditionDisplay {...defaultProps} />);
    expect(screen.getByText("Condition")).toBeInTheDocument();
  });

  it("renders physical condition monitor with correct values", () => {
    render(<ConditionDisplay {...defaultProps} />);
    expect(screen.getByTestId("condition-monitor-physical")).toHaveTextContent("physical: 2/11");
  });

  it("renders stun condition monitor with correct values", () => {
    render(<ConditionDisplay {...defaultProps} />);
    expect(screen.getByTestId("condition-monitor-stun")).toHaveTextContent("stun: 1/10");
  });

  it("renders overflow condition monitor with body as max", () => {
    render(<ConditionDisplay {...defaultProps} />);
    // baseCharacter has body=5 from createSheetCharacter
    expect(screen.getByTestId("condition-monitor-overflow")).toHaveTextContent("overflow: 0/5");
  });

  it("does not show wound modifier when zero", () => {
    render(<ConditionDisplay {...defaultProps} woundModifier={0} />);
    expect(screen.queryByText(/Total Wound Modifier/)).not.toBeInTheDocument();
  });

  it("shows wound modifier warning when non-zero", () => {
    render(<ConditionDisplay {...defaultProps} woundModifier={-3} />);
    expect(screen.getByText(/Total Wound Modifier/)).toBeInTheDocument();
    expect(screen.getByText("-3")).toBeInTheDocument();
  });

  it("shows positive wound modifier", () => {
    render(<ConditionDisplay {...defaultProps} woundModifier={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("passes readonly to condition monitors", () => {
    render(<ConditionDisplay {...defaultProps} readonly={true} />);

    expect(mockInteractiveConditionMonitor).toHaveBeenCalledWith(
      expect.objectContaining({ type: "physical", readonly: true })
    );
    expect(mockInteractiveConditionMonitor).toHaveBeenCalledWith(
      expect.objectContaining({ type: "stun", readonly: true })
    );
    expect(mockInteractiveConditionMonitor).toHaveBeenCalledWith(
      expect.objectContaining({ type: "overflow", readonly: true })
    );
  });

  it("passes characterId to condition monitors", () => {
    render(<ConditionDisplay {...defaultProps} />);

    expect(mockInteractiveConditionMonitor).toHaveBeenCalledWith(
      expect.objectContaining({ characterId: baseCharacter.id })
    );
  });

  it("handles missing condition data gracefully", () => {
    const charNoCondition = createSheetCharacter({
      condition: undefined as unknown as Character["condition"],
    });

    render(<ConditionDisplay {...defaultProps} character={charNoCondition} />);

    // Should default to 0 for all damage types
    expect(screen.getByTestId("condition-monitor-physical")).toHaveTextContent("physical: 0/11");
    expect(screen.getByTestId("condition-monitor-stun")).toHaveTextContent("stun: 0/10");
    expect(screen.getByTestId("condition-monitor-overflow")).toHaveTextContent("overflow: 0/");
  });

  it("renders all three monitors (physical, stun, overflow)", () => {
    render(<ConditionDisplay {...defaultProps} />);

    expect(mockInteractiveConditionMonitor).toHaveBeenCalledTimes(3);
    const calls = mockInteractiveConditionMonitor.mock.calls.map(
      (call) => (call[0] as { type: string }).type
    );
    expect(calls).toContain("physical");
    expect(calls).toContain("stun");
    expect(calls).toContain("overflow");
  });
});
