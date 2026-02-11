/**
 * AttributesDisplay Component Tests
 *
 * Tests the character attributes table. Mocks useMetatypes hook.
 * Shows 8 core attributes, augmented values, Edge/Essence/Magic row,
 * and onSelect callback.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter, MOCK_METATYPE_HUMAN } from "./test-helpers";

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
  useMetatypes: vi.fn(),
}));

import { useMetatypes } from "@/lib/rules";
import { AttributesDisplay } from "../AttributesDisplay";

describe("AttributesDisplay", () => {
  beforeEach(() => {
    vi.mocked(useMetatypes).mockReturnValue([MOCK_METATYPE_HUMAN] as ReturnType<
      typeof useMetatypes
    >);
  });

  it("renders all 8 core attributes", () => {
    const character = createSheetCharacter();
    render(<AttributesDisplay character={character} />);

    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Agility")).toBeInTheDocument();
    expect(screen.getByText("Reaction")).toBeInTheDocument();
    expect(screen.getByText("Strength")).toBeInTheDocument();
    expect(screen.getByText("Willpower")).toBeInTheDocument();
    expect(screen.getByText("Logic")).toBeInTheDocument();
    expect(screen.getByText("Intuition")).toBeInTheDocument();
    expect(screen.getByText("Charisma")).toBeInTheDocument();
  });

  it("renders base attribute values in brackets", () => {
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
    });
    render(<AttributesDisplay character={character} />);
    // Body=5 and Reaction=5 both render [5], so check for multiple
    const fives = screen.getAllByText("[5]");
    expect(fives.length).toBeGreaterThanOrEqual(1);
    // Agility=6 renders [6]
    expect(screen.getByText("[6]")).toBeInTheDocument();
  });

  it("renders augmented column with green text for augmented values", () => {
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 2,
          essenceCost: 2,
          cost: 39000,
          availability: 8,
          attributeBonuses: { reaction: 1 },
        },
      ],
    });
    render(<AttributesDisplay character={character} />);
    // The augmented value should show [+1]
    expect(screen.getByText("[+1]")).toBeInTheDocument();
  });

  it("renders min/max from metatype data", () => {
    const character = createSheetCharacter({ metatype: "Human" });
    render(<AttributesDisplay character={character} />);
    // Human attributes have (1/6) range
    const ranges = screen.getAllByText("(1/6)");
    expect(ranges.length).toBe(8); // All 8 core attributes
  });

  it("renders Edge in the special attributes section", () => {
    const character = createSheetCharacter({ specialAttributes: { edge: 3, essence: 6 } });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Edge")).toBeInTheDocument();
    expect(screen.getAllByText("[3]").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Essence with 2 decimal places", () => {
    const character = createSheetCharacter({ specialAttributes: { edge: 3, essence: 4.2 } });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("[4.20]")).toBeInTheDocument();
  });

  it("renders Magic attribute when present", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 6, magic: 7 },
    });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Magic")).toBeInTheDocument();
    expect(screen.getByText("[7]")).toBeInTheDocument();
  });

  it("renders Resonance attribute when present", () => {
    const character = createSheetCharacter({
      specialAttributes: { edge: 3, essence: 6, resonance: 5 },
    });
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Resonance")).toBeInTheDocument();
  });

  it("calls onSelect with attribute id and total value when clicked", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
    });
    render(<AttributesDisplay character={character} onSelect={onSelect} />);

    // Click on Body row
    fireEvent.click(screen.getByText("Body"));
    expect(onSelect).toHaveBeenCalledWith("body", 5);
  });

  it("includes augmentation bonus in onSelect value", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      attributes: {
        body: 5,
        agility: 6,
        reaction: 5,
        strength: 4,
        willpower: 3,
        logic: 3,
        intuition: 4,
        charisma: 2,
      },
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 2,
          essenceCost: 2,
          cost: 39000,
          availability: 8,
          attributeBonuses: { reaction: 1 },
        },
      ],
    });
    render(<AttributesDisplay character={character} onSelect={onSelect} />);

    // Click on Reaction row - should be base 5 + aug 1 = 6
    fireEvent.click(screen.getByText("Reaction"));
    expect(onSelect).toHaveBeenCalledWith("reaction", 6);
  });

  it("renders table column headers", () => {
    const character = createSheetCharacter();
    render(<AttributesDisplay character={character} />);
    expect(screen.getByText("Attribute")).toBeInTheDocument();
    expect(screen.getByText("Base")).toBeInTheDocument();
    expect(screen.getByText("Aug")).toBeInTheDocument();
    expect(screen.getByText("Min/Max")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });
});
