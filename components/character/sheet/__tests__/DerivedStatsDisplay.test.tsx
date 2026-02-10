/**
 * DerivedStatsDisplay Component Tests
 *
 * Tests the derived stats panel (limits, initiative, condition monitors,
 * pools, movement, armor). Optional sections only render when data is provided.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid={`display-card-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Activity: (props: Record<string, unknown>) => <span data-testid="icon-Activity" {...props} />,
  Shield: (props: Record<string, unknown>) => <span data-testid="icon-Shield" {...props} />,
  Heart: (props: Record<string, unknown>) => <span data-testid="icon-Heart" {...props} />,
  Brain: (props: Record<string, unknown>) => <span data-testid="icon-Brain" {...props} />,
  Footprints: (props: Record<string, unknown>) => <span data-testid="icon-Footprints" {...props} />,
  ShieldCheck: (props: Record<string, unknown>) => (
    <span data-testid="icon-ShieldCheck" {...props} />
  ),
  BarChart3: (props: Record<string, unknown>) => <span data-testid="icon-BarChart3" {...props} />,
  Crosshair: (props: Record<string, unknown>) => <span data-testid="icon-Crosshair" {...props} />,
  Swords: (props: Record<string, unknown>) => <span data-testid="icon-Swords" {...props} />,
  Package: (props: Record<string, unknown>) => <span data-testid="icon-Package" {...props} />,
  Pill: (props: Record<string, unknown>) => <span data-testid="icon-Pill" {...props} />,
  Sparkles: (props: Record<string, unknown>) => <span data-testid="icon-Sparkles" {...props} />,
  Braces: (props: Record<string, unknown>) => <span data-testid="icon-Braces" {...props} />,
  Cpu: (props: Record<string, unknown>) => <span data-testid="icon-Cpu" {...props} />,
  BookOpen: (props: Record<string, unknown>) => <span data-testid="icon-BookOpen" {...props} />,
  Users: (props: Record<string, unknown>) => <span data-testid="icon-Users" {...props} />,
  Fingerprint: (props: Record<string, unknown>) => (
    <span data-testid="icon-Fingerprint" {...props} />
  ),
  Zap: (props: Record<string, unknown>) => <span data-testid="icon-Zap" {...props} />,
  Car: (props: Record<string, unknown>) => <span data-testid="icon-Car" {...props} />,
  Home: (props: Record<string, unknown>) => <span data-testid="icon-Home" {...props} />,
}));

import { DerivedStatsDisplay } from "../DerivedStatsDisplay";

const requiredProps = {
  physicalLimit: 7,
  mentalLimit: 5,
  socialLimit: 4,
  initiative: 9,
};

describe("DerivedStatsDisplay", () => {
  describe("required stats", () => {
    it("renders initiative with dice notation", () => {
      render(<DerivedStatsDisplay {...requiredProps} />);
      expect(screen.getByText("9+1d6")).toBeInTheDocument();
    });

    it("renders all three limits", () => {
      render(<DerivedStatsDisplay {...requiredProps} />);
      expect(screen.getByText("Physical")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("Mental")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("Social")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("renders section headers", () => {
      render(<DerivedStatsDisplay {...requiredProps} />);
      // "Initiative" appears both as a section header and a stat label
      expect(screen.getAllByText("Initiative").length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("Limits")).toBeInTheDocument();
    });
  });

  describe("condition monitors (optional)", () => {
    it("does not render condition monitors section when not provided", () => {
      render(<DerivedStatsDisplay {...requiredProps} />);
      expect(screen.queryByText("Condition Monitors")).not.toBeInTheDocument();
    });

    it("renders condition monitors when provided", () => {
      render(
        <DerivedStatsDisplay
          {...requiredProps}
          physicalMonitorMax={11}
          stunMonitorMax={10}
          overflow={5}
        />
      );
      expect(screen.getByText("Condition Monitors")).toBeInTheDocument();
      expect(screen.getByText("Physical CM")).toBeInTheDocument();
      expect(screen.getByText("11")).toBeInTheDocument();
      expect(screen.getByText("Stun CM")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("Overflow")).toBeInTheDocument();
    });
  });

  describe("pools (optional)", () => {
    it("does not render pools section when not provided", () => {
      render(<DerivedStatsDisplay {...requiredProps} />);
      expect(screen.queryByText("Pools")).not.toBeInTheDocument();
    });

    it("renders pools when provided", () => {
      render(
        <DerivedStatsDisplay
          {...requiredProps}
          composure={5}
          judgeIntentions={6}
          memory={7}
          liftCarry={8}
        />
      );
      expect(screen.getByText("Pools")).toBeInTheDocument();
      expect(screen.getByText("Composure")).toBeInTheDocument();
      expect(screen.getByText("Judge Intentions")).toBeInTheDocument();
      expect(screen.getByText("Memory")).toBeInTheDocument();
      expect(screen.getByText("8 kg")).toBeInTheDocument();
    });
  });

  describe("movement (optional)", () => {
    it("does not render movement section when not provided", () => {
      render(<DerivedStatsDisplay {...requiredProps} />);
      expect(screen.queryByText("Movement")).not.toBeInTheDocument();
    });

    it("renders movement when provided", () => {
      render(<DerivedStatsDisplay {...requiredProps} walkSpeed={10} runSpeed={20} />);
      expect(screen.getByText("Movement")).toBeInTheDocument();
      expect(screen.getByText("10m")).toBeInTheDocument();
      expect(screen.getByText("20m")).toBeInTheDocument();
    });
  });

  describe("armor (optional)", () => {
    it("does not render armor section when not provided", () => {
      render(<DerivedStatsDisplay {...requiredProps} />);
      // Armor section header should not appear
      const armorHeaders = screen.queryAllByText("Armor");
      // There should be no "Armor" section header (the stat block label is "Total")
      expect(armorHeaders.length).toBe(0);
    });

    it("renders armor total when provided", () => {
      render(<DerivedStatsDisplay {...requiredProps} armorTotal={12} />);
      expect(screen.getByText("Total")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
    });
  });
});
