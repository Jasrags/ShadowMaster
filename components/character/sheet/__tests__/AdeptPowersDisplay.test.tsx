/**
 * AdeptPowersDisplay Component Tests
 *
 * Tests the adept powers display. Returns null when empty.
 * Shows rating badge, specification text, and PP cost.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { AdeptPower } from "@/lib/types";

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

import { AdeptPowersDisplay } from "../AdeptPowersDisplay";

const basePower: AdeptPower = {
  id: "improved-reflexes",
  catalogId: "improved-reflexes",
  name: "Improved Reflexes",
  rating: 2,
  powerPointCost: 2.5,
};

describe("AdeptPowersDisplay", () => {
  it("returns null when adeptPowers array is empty", () => {
    const { container } = render(<AdeptPowersDisplay adeptPowers={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when adeptPowers is undefined", () => {
    const { container } = render(
      <AdeptPowersDisplay adeptPowers={undefined as unknown as AdeptPower[]} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders power name", () => {
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);
    expect(screen.getByText("Improved Reflexes")).toBeInTheDocument();
  });

  it("renders rating badge when present", () => {
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);
    expect(screen.getByText("Level 2")).toBeInTheDocument();
  });

  it("does not render rating badge when no rating", () => {
    const noRating: AdeptPower = {
      id: "traceless-walk",
      catalogId: "traceless-walk",
      name: "Traceless Walk",
      powerPointCost: 1,
    };
    render(<AdeptPowersDisplay adeptPowers={[noRating]} />);
    expect(screen.queryByText(/Level/)).not.toBeInTheDocument();
  });

  it("renders PP cost", () => {
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);
    expect(screen.getByText("Cost")).toBeInTheDocument();
    expect(screen.getByText("2.5 PP")).toBeInTheDocument();
  });

  it("renders specification text when present", () => {
    const withSpec: AdeptPower = {
      id: "improved-ability",
      catalogId: "improved-ability",
      name: "Improved Ability",
      rating: 2,
      powerPointCost: 1,
      specification: "Pistols",
    };
    render(<AdeptPowersDisplay adeptPowers={[withSpec]} />);
    expect(screen.getByText("Spec: Pistols")).toBeInTheDocument();
  });

  it("does not render specification when not present", () => {
    render(<AdeptPowersDisplay adeptPowers={[basePower]} />);
    expect(screen.queryByText(/Spec:/)).not.toBeInTheDocument();
  });

  it("renders multiple powers", () => {
    const secondPower: AdeptPower = {
      id: "killing-hands",
      catalogId: "killing-hands",
      name: "Killing Hands",
      powerPointCost: 0.5,
    };
    render(<AdeptPowersDisplay adeptPowers={[basePower, secondPower]} />);
    expect(screen.getByText("Improved Reflexes")).toBeInTheDocument();
    expect(screen.getByText("Killing Hands")).toBeInTheDocument();
  });
});
