/**
 * FociDisplay Component Tests
 *
 * Tests the magical foci display. Returns null when empty.
 * Shows bonded vs unbonded styling and force rating.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="display-card">
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

import { FociDisplay } from "../FociDisplay";
import type { FocusItem } from "@/lib/types";
import { FocusType } from "@/lib/types/edition";

const baseFocus: FocusItem = {
  catalogId: "power-focus",
  name: "Power Focus",
  type: FocusType.Power,
  force: 3,
  bonded: true,
  karmaToBond: 18,
  cost: 18000,
  availability: 9,
};

describe("FociDisplay", () => {
  it("returns null when foci array is empty", () => {
    const { container } = render(<FociDisplay foci={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders focus name", () => {
    render(<FociDisplay foci={[baseFocus]} />);
    expect(screen.getByText("Power Focus")).toBeInTheDocument();
  });

  it("renders focus type badge", () => {
    render(<FociDisplay foci={[baseFocus]} />);
    expect(screen.getByText("power")).toBeInTheDocument();
  });

  it("renders force rating", () => {
    render(<FociDisplay foci={[baseFocus]} />);
    expect(screen.getByText("Force")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders Bonded badge for bonded foci", () => {
    render(<FociDisplay foci={[baseFocus]} />);
    expect(screen.getByText("Bonded")).toBeInTheDocument();
  });

  it("does not render Bonded badge for unbonded foci", () => {
    const unbonded = { ...baseFocus, bonded: false };
    render(<FociDisplay foci={[unbonded]} />);
    expect(screen.queryByText("Bonded")).not.toBeInTheDocument();
  });

  it("uses bonded styling (violet) for bonded foci", () => {
    render(<FociDisplay foci={[baseFocus]} />);
    // The containing div should have violet border class
    const focusDiv = screen.getByText("Power Focus").closest("div[class*='rounded']");
    expect(focusDiv?.className).toContain("violet");
  });

  it("uses default styling for unbonded foci", () => {
    const unbonded = { ...baseFocus, bonded: false };
    render(<FociDisplay foci={[unbonded]} />);
    const focusDiv = screen.getByText("Power Focus").closest("div[class*='rounded']");
    expect(focusDiv?.className).toContain("zinc");
  });

  it("renders multiple foci", () => {
    const secondFocus: FocusItem = {
      ...baseFocus,
      catalogId: "weapon-focus",
      name: "Weapon Focus",
      type: FocusType.Weapon,
      force: 4,
      bonded: false,
    };
    render(<FociDisplay foci={[baseFocus, secondFocus]} />);
    expect(screen.getByText("Power Focus")).toBeInTheDocument();
    expect(screen.getByText("Weapon Focus")).toBeInTheDocument();
  });
});
