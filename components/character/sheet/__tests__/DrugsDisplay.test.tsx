/**
 * DrugsDisplay Component Tests
 *
 * Tests the drugs & toxins display. Returns null when empty.
 * Shows drug name, rating badge, and quantity.
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

import { DrugsDisplay } from "../DrugsDisplay";

describe("DrugsDisplay", () => {
  it("returns null when drugs array is empty", () => {
    const { container } = render(<DrugsDisplay drugs={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders drug name", () => {
    render(<DrugsDisplay drugs={[{ name: "Jazz" }]} />);
    expect(screen.getByText("Jazz")).toBeInTheDocument();
  });

  it("renders rating badge when present", () => {
    render(<DrugsDisplay drugs={[{ name: "Novacoke", rating: 3 }]} />);
    expect(screen.getByText("R3")).toBeInTheDocument();
  });

  it("does not render rating when not present", () => {
    render(<DrugsDisplay drugs={[{ name: "Jazz" }]} />);
    expect(screen.queryByText(/^R\d/)).not.toBeInTheDocument();
  });

  it("renders quantity when greater than 1", () => {
    render(<DrugsDisplay drugs={[{ name: "Jazz", quantity: 3 }]} />);
    expect(screen.getByText("×3")).toBeInTheDocument();
  });

  it("does not render quantity when 1 or not provided", () => {
    render(<DrugsDisplay drugs={[{ name: "Jazz", quantity: 1 }]} />);
    expect(screen.queryByText("×1")).not.toBeInTheDocument();
  });

  it("renders multiple drugs", () => {
    render(
      <DrugsDisplay
        drugs={[
          { name: "Jazz", quantity: 2 },
          { name: "Novacoke", rating: 3 },
        ]}
      />
    );
    expect(screen.getByText("Jazz")).toBeInTheDocument();
    expect(screen.getByText("Novacoke")).toBeInTheDocument();
  });
});
