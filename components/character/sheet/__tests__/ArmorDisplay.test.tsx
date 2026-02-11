/**
 * ArmorDisplay Component Tests
 *
 * Tests the armor table display. Returns null when armor array is empty.
 * Shows name, rating, and equipped/stored status badges.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MOCK_ARMOR_EQUIPPED, MOCK_ARMOR_STORED } from "./test-helpers";

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

import { ArmorDisplay } from "../ArmorDisplay";

describe("ArmorDisplay", () => {
  it("returns null when armor array is empty", () => {
    const { container } = render(<ArmorDisplay armor={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders armor table with name and rating", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.getByText("Armor Jacket")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows Equipped badge for equipped armor", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.getByText("Equipped")).toBeInTheDocument();
  });

  it("shows Stored badge for unequipped armor", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_STORED]} />);
    expect(screen.getByText("Stored")).toBeInTheDocument();
  });

  it("renders multiple armor items", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED, MOCK_ARMOR_STORED]} />);
    expect(screen.getByText("Armor Jacket")).toBeInTheDocument();
    expect(screen.getByText("Lined Coat")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<ArmorDisplay armor={[MOCK_ARMOR_EQUIPPED]} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
