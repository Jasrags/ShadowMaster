/**
 * GearDisplay Component Tests
 *
 * Tests the general gear list. Always renders a DisplayCard (shows
 * empty state message when no gear). Shows name, rating, quantity, category.
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

import { GearDisplay } from "../GearDisplay";

describe("GearDisplay", () => {
  it("renders empty state message when no gear", () => {
    render(<GearDisplay gear={[]} />);
    expect(screen.getByText("No gear acquired")).toBeInTheDocument();
  });

  it("always renders DisplayCard even when empty", () => {
    render(<GearDisplay gear={[]} />);
    expect(screen.getByTestId("display-card")).toBeInTheDocument();
  });

  it("renders gear item name", () => {
    const gear = [{ name: "Commlink", category: "electronics", quantity: 1 }];
    render(<GearDisplay gear={gear} />);
    expect(screen.getByText("Commlink")).toBeInTheDocument();
  });

  it("renders gear item rating when present", () => {
    const gear = [{ name: "Commlink", category: "electronics", quantity: 1, rating: 6 }];
    render(<GearDisplay gear={gear} />);
    expect(screen.getByText("R6")).toBeInTheDocument();
  });

  it("does not render rating badge when no rating", () => {
    const gear = [{ name: "Medkit", category: "medical", quantity: 1 }];
    render(<GearDisplay gear={gear} />);
    expect(screen.queryByText(/^R\d/)).not.toBeInTheDocument();
  });

  it("renders quantity when greater than 1", () => {
    const gear = [{ name: "Flash-Bang", category: "ammunition", quantity: 5 }];
    render(<GearDisplay gear={gear} />);
    expect(screen.getByText("×5")).toBeInTheDocument();
  });

  it("does not render quantity for single items", () => {
    const gear = [{ name: "Grapple Gun", category: "tools", quantity: 1 }];
    render(<GearDisplay gear={gear} />);
    expect(screen.queryByText("×1")).not.toBeInTheDocument();
  });

  it("renders category display", () => {
    const gear = [{ name: "Autopicker", category: "b-and-e-gear", quantity: 1 }];
    render(<GearDisplay gear={gear} />);
    expect(screen.getByText("b-and-e-gear")).toBeInTheDocument();
  });

  it("renders multiple gear items", () => {
    const gear = [
      { name: "Commlink", category: "electronics", quantity: 1 },
      { name: "Medkit", category: "medical", quantity: 2 },
    ];
    render(<GearDisplay gear={gear} />);
    expect(screen.getByText("Commlink")).toBeInTheDocument();
    expect(screen.getByText("Medkit")).toBeInTheDocument();
  });
});
