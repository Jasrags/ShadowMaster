/**
 * AugmentationsDisplay Component Tests
 *
 * Tests the augmentations (cyberware/bioware) display.
 * Returns null when no augmentations. Shows cyberware vs bioware sections,
 * grade badges, essence cost, and attribute bonuses.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createSheetCharacter, MOCK_CYBERWARE, MOCK_BIOWARE } from "./test-helpers";

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

import { AugmentationsDisplay } from "../AugmentationsDisplay";

describe("AugmentationsDisplay", () => {
  it("returns null when no cyberware or bioware", () => {
    const character = createSheetCharacter({ cyberware: [], bioware: [] });
    const { container } = render(<AugmentationsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when cyberware and bioware are undefined", () => {
    const character = createSheetCharacter({ cyberware: undefined, bioware: undefined });
    const { container } = render(<AugmentationsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders cyberware section header", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Cyberware")).toBeInTheDocument();
  });

  it("renders bioware section header", () => {
    const character = createSheetCharacter({ bioware: [MOCK_BIOWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Bioware")).toBeInTheDocument();
  });

  it("renders both sections when character has both", () => {
    const character = createSheetCharacter({
      cyberware: [MOCK_CYBERWARE],
      bioware: [MOCK_BIOWARE],
    });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Cyberware")).toBeInTheDocument();
    expect(screen.getByText("Bioware")).toBeInTheDocument();
  });

  it("renders augmentation name", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Wired Reflexes")).toBeInTheDocument();
  });

  it("renders grade badge", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("standard")).toBeInTheDocument();
  });

  it("renders essence cost with 2 decimal places", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("2.00")).toBeInTheDocument();
  });

  it("renders attribute bonuses", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("REACTION +1")).toBeInTheDocument();
  });

  it("renders bioware attribute bonuses", () => {
    const character = createSheetCharacter({ bioware: [MOCK_BIOWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("AGILITY +2")).toBeInTheDocument();
  });

  it("renders rating when present", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Rating: 1")).toBeInTheDocument();
  });

  it("renders category", () => {
    const character = createSheetCharacter({ cyberware: [MOCK_CYBERWARE] });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("bodyware")).toBeInTheDocument();
  });
});
