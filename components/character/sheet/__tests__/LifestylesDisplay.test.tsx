/**
 * LifestylesDisplay Component Tests
 *
 * Tests the lifestyles display. Returns null when empty.
 * Shows primary lifestyle highlighting, monthly cost formatting,
 * and location display.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Lifestyle } from "@/lib/types";

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

import { LifestylesDisplay } from "../LifestylesDisplay";

const baseLifestyle: Lifestyle = {
  id: "lifestyle-1",
  type: "medium",
  monthlyCost: 5000,
  location: "Downtown Seattle",
};

describe("LifestylesDisplay", () => {
  it("returns null when lifestyles array is empty", () => {
    const { container } = render(<LifestylesDisplay lifestyles={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when lifestyles is undefined", () => {
    const { container } = render(
      <LifestylesDisplay lifestyles={undefined as unknown as Lifestyle[]} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders lifestyle type", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("renders monthly cost with yen symbol and /mo suffix", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    expect(screen.getByText("¥5,000/mo")).toBeInTheDocument();
  });

  it("renders location when present", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} />);
    expect(screen.getByText("Downtown Seattle")).toBeInTheDocument();
  });

  it("does not render location when not present", () => {
    const noLocation: Lifestyle = { ...baseLifestyle, location: undefined };
    render(<LifestylesDisplay lifestyles={[noLocation]} />);
    expect(screen.queryByText("Downtown Seattle")).not.toBeInTheDocument();
  });

  it("highlights primary lifestyle", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} primaryLifestyleId="lifestyle-1" />);
    expect(screen.getByText("Primary")).toBeInTheDocument();
  });

  it("uses emerald styling for primary lifestyle", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} primaryLifestyleId="lifestyle-1" />);
    const card = screen.getByText("medium").closest("div[class*='rounded']");
    expect(card?.className).toContain("emerald");
  });

  it("does not show Primary badge for non-primary lifestyles", () => {
    render(<LifestylesDisplay lifestyles={[baseLifestyle]} primaryLifestyleId="other-id" />);
    expect(screen.queryByText("Primary")).not.toBeInTheDocument();
  });

  it("renders multiple lifestyles", () => {
    const secondLifestyle: Lifestyle = {
      id: "lifestyle-2",
      type: "low",
      monthlyCost: 2000,
      location: "Redmond Barrens",
    };
    render(
      <LifestylesDisplay
        lifestyles={[baseLifestyle, secondLifestyle]}
        primaryLifestyleId="lifestyle-1"
      />
    );
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("¥5,000/mo")).toBeInTheDocument();
    expect(screen.getByText("¥2,000/mo")).toBeInTheDocument();
  });

  it("formats large monthly costs with commas", () => {
    const expensive: Lifestyle = {
      id: "lifestyle-3",
      type: "luxury",
      monthlyCost: 100000,
    };
    render(<LifestylesDisplay lifestyles={[expensive]} />);
    expect(screen.getByText("¥100,000/mo")).toBeInTheDocument();
  });
});
