/**
 * SpellsDisplay Component Tests
 *
 * Tests the spells display for magical characters.
 * Returns null when empty. Mocks useSpells hook.
 * Tests spell catalog lookup, metadata rendering, drain display,
 * and onSelect callback.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MOCK_SPELLS_CATALOG } from "./test-helpers";

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

vi.mock("@/lib/rules", () => ({
  useSpells: vi.fn(),
}));

import { useSpells } from "@/lib/rules";
import { SpellsDisplay } from "../SpellsDisplay";

describe("SpellsDisplay", () => {
  beforeEach(() => {
    vi.mocked(useSpells).mockReturnValue(MOCK_SPELLS_CATALOG);
  });

  it("returns null when spells array is empty", () => {
    const { container } = render(<SpellsDisplay spells={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when spells is undefined", () => {
    const { container } = render(<SpellsDisplay spells={undefined as unknown as string[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders spell name from catalog", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("Manabolt")).toBeInTheDocument();
  });

  it("renders spell category", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("combat")).toBeInTheDocument();
  });

  it("renders spell type", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("mana")).toBeInTheDocument();
  });

  it("renders spell range", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("LOS")).toBeInTheDocument();
  });

  it("renders spell duration", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("Instant")).toBeInTheDocument();
  });

  it("renders drain value", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("Drain")).toBeInTheDocument();
    expect(screen.getByText("F-3")).toBeInTheDocument();
  });

  it("renders spell description", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("A bolt of mana energy")).toBeInTheDocument();
  });

  it("does not render unmatched spells", () => {
    render(<SpellsDisplay spells={["nonexistent-spell"]} />);
    // SpellItem returns null when no catalog match
    expect(screen.queryByText("nonexistent-spell")).not.toBeInTheDocument();
  });

  it("calls onSelect with pool and spell name when clicked", () => {
    const onSelect = vi.fn();
    render(<SpellsDisplay spells={["manabolt"]} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Manabolt"));
    expect(onSelect).toHaveBeenCalledWith(6, "Manabolt");
  });

  it("renders multiple spells from different categories", () => {
    render(<SpellsDisplay spells={["manabolt", "heal"]} />);
    expect(screen.getByText("Manabolt")).toBeInTheDocument();
    expect(screen.getByText("Heal")).toBeInTheDocument();
  });

  it("handles object-format spell entries", () => {
    render(<SpellsDisplay spells={[{ id: "manabolt" }]} />);
    expect(screen.getByText("Manabolt")).toBeInTheDocument();
  });

  it("renders metadata labels", () => {
    render(<SpellsDisplay spells={["manabolt"]} />);
    expect(screen.getByText("TYPE")).toBeInTheDocument();
    expect(screen.getByText("RANGE")).toBeInTheDocument();
    expect(screen.getByText("DUR")).toBeInTheDocument();
  });
});
