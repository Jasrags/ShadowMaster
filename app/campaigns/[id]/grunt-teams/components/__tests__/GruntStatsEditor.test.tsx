/**
 * Tests for GruntStatsEditor component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GruntStatsEditor } from "../GruntStatsEditor";
import type { GruntStats } from "@/lib/types";

function createMockStats(overrides?: Partial<GruntStats>): GruntStats {
  return {
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    essence: 6,
    skills: { Firearms: 4, "Unarmed Combat": 3 },
    weapons: [],
    armor: [],
    gear: [],
    conditionMonitorSize: 10,
    ...overrides,
  };
}

describe("GruntStatsEditor", () => {
  it("should render all attribute inputs", () => {
    const stats = createMockStats();
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} />);

    expect(screen.getByText("BOD")).toBeInTheDocument();
    expect(screen.getByText("AGI")).toBeInTheDocument();
    expect(screen.getByText("REA")).toBeInTheDocument();
    expect(screen.getByText("STR")).toBeInTheDocument();
    expect(screen.getByText("WIL")).toBeInTheDocument();
    expect(screen.getByText("LOG")).toBeInTheDocument();
    expect(screen.getByText("INT")).toBeInTheDocument();
    expect(screen.getByText("CHA")).toBeInTheDocument();
    expect(screen.getByText("ESS")).toBeInTheDocument();
  });

  it("should display condition monitor size", () => {
    const stats = createMockStats({ conditionMonitorSize: 10 });
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} />);

    expect(screen.getByText("Condition Monitor: 10 boxes")).toBeInTheDocument();
  });

  it("should display skills", () => {
    const stats = createMockStats();
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} />);

    // Skills section is expanded by default
    expect(screen.getByDisplayValue("Firearms")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Unarmed Combat")).toBeInTheDocument();
  });

  it("should call onChange when attribute value changes", () => {
    const stats = createMockStats();
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} />);

    // Find BOD input (first number input after BOD label)
    const inputs = screen.getAllByRole("spinbutton");
    // First 8 inputs are for attributes
    fireEvent.change(inputs[0], { target: { value: "5" } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        attributes: expect.objectContaining({ body: 5 }),
        // conditionMonitorSize should be recalculated: 8 + ceil(5/2) = 11
        conditionMonitorSize: 11,
      })
    );
  });

  it("should render in readonly mode", () => {
    const stats = createMockStats();
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} readonly />);

    // In readonly mode, attribute values should be text, not inputs
    expect(screen.queryAllByRole("spinbutton")).toHaveLength(0);
  });

  it("should show Reset to Template button when templateStats provided", () => {
    const stats = createMockStats();
    const templateStats = createMockStats();
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} templateStats={templateStats} />);

    expect(screen.getByText("Reset to Template")).toBeInTheDocument();
  });

  it("should not show Reset to Template when no templateStats", () => {
    const stats = createMockStats();
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} />);

    expect(screen.queryByText("Reset to Template")).not.toBeInTheDocument();
  });

  it("should reset to template stats when Reset button clicked", () => {
    const stats = createMockStats({ attributes: { ...createMockStats().attributes, body: 5 } });
    const templateStats = createMockStats();
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} templateStats={templateStats} />);

    fireEvent.click(screen.getByText("Reset to Template"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        attributes: templateStats.attributes,
      })
    );
  });

  it("should display magic attribute when present in stats", () => {
    const stats = createMockStats({ magic: 5 });
    const onChange = vi.fn();

    render(<GruntStatsEditor stats={stats} onChange={onChange} />);

    expect(screen.getByText("MAG")).toBeInTheDocument();
  });
});
