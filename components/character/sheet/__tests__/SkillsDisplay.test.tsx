/**
 * SkillsDisplay Component Tests
 *
 * Tests the skills table. Mocks useSkills hook.
 * Covers empty state, sorted skills, dice pool calculation,
 * specializations, and onSelect callback.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter, MOCK_ACTIVE_SKILLS } from "./test-helpers";

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
  useSkills: vi.fn(),
}));

import { useSkills } from "@/lib/rules";
import { SkillsDisplay } from "../SkillsDisplay";

describe("SkillsDisplay", () => {
  beforeEach(() => {
    vi.mocked(useSkills).mockReturnValue({
      activeSkills: MOCK_ACTIVE_SKILLS,
      skillGroups: [],
      knowledgeCategories: [],
      creationLimits: { maxSkillRating: 6, maxGroupRating: 5, maxKnowledgeSkillRating: 6 },
      exampleKnowledgeSkills: [],
    } as unknown as ReturnType<typeof useSkills>);
  });

  it("renders empty state when no skills", () => {
    const character = createSheetCharacter({ skills: {} });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("No skills assigned")).toBeInTheDocument();
  });

  it("renders skill names", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5, sneaking: 3 },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("pistols")).toBeInTheDocument();
    expect(screen.getByText("sneaking")).toBeInTheDocument();
  });

  it("renders skills sorted by rating (highest first)", () => {
    const character = createSheetCharacter({
      skills: { sneaking: 2, pistols: 5, perception: 3 },
    });
    render(<SkillsDisplay character={character} />);

    const rows = screen.getAllByRole("row");
    // First data row (after header) should be the highest rated skill
    const firstDataRow = rows[1];
    expect(firstDataRow.textContent).toContain("pistols");
  });

  it("renders linked attribute abbreviation", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    // Pistols is linked to Agility → AGI
    expect(screen.getByText("AGI")).toBeInTheDocument();
  });

  it("calculates dice pool (skill rating + attribute + augmentation)", () => {
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
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    // Pool = pistols(5) + agility(6) = 11
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("renders specialization when present", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
      skillSpecializations: { pistols: ["Semi-Automatics"] },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("Semi-Automatics")).toBeInTheDocument();
  });

  it("renders placeholder for skills without specialization", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("__________")).toBeInTheDocument();
  });

  it("calls onSelect with skillId, dicePool, and attrAbbr", () => {
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
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("pistols"));
    expect(onSelect).toHaveBeenCalledWith("pistols", 11, "AGI");
  });

  it("renders table column headers", () => {
    const character = createSheetCharacter({ skills: { pistols: 5 } });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("Skill")).toBeInTheDocument();
    expect(screen.getByText("Attr")).toBeInTheDocument();
    expect(screen.getByText("Rtg")).toBeInTheDocument();
    expect(screen.getByText("Spec")).toBeInTheDocument();
    expect(screen.getByText("Dice Pool")).toBeInTheDocument();
  });

  it("renders skill rating in brackets", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("[5]")).toBeInTheDocument();
  });
});
