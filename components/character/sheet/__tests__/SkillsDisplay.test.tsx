/**
 * SkillsDisplay Component Tests
 *
 * Tests the grouped flex skills display. Mocks useSkills hook.
 * Covers empty state, sorted skills, dice pool calculation,
 * specializations, section headers, icons, and onSelect callback.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter, MOCK_ACTIVE_SKILLS, LUCIDE_MOCK } from "./test-helpers";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => LUCIDE_MOCK);

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
    expect(screen.getByText("Pistols")).toBeInTheDocument();
    expect(screen.getByText("Sneaking")).toBeInTheDocument();
  });

  it("renders skills sorted by rating descending within each section", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5, automatics: 4, "unarmed-combat": 3, blades: 4 },
    });
    const { container } = render(<SkillsDisplay character={character} />);

    const rows = container.querySelectorAll('[data-testid="skill-row"]');
    // All 4 are combat — sorted: pistols(5), automatics(4), blades(4), unarmed-combat(3)
    expect(rows[0].textContent).toContain("Pistols");
    expect(rows[3].textContent).toContain("Unarmed Combat");
  });

  it("renders linked attribute abbreviation with color", () => {
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

  it("renders specializations as individual amber pills", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
      skillSpecializations: { pistols: ["Semi-Automatics", "Revolvers"] },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("Semi-Automatics")).toBeInTheDocument();
    expect(screen.getByText("Revolvers")).toBeInTheDocument();
  });

  it("does not render specialization placeholder for skills without specs", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.queryByText("__________")).not.toBeInTheDocument();
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

    fireEvent.click(screen.getByText("Pistols"));
    expect(onSelect).toHaveBeenCalledWith("pistols", 11, "AGI");
  });

  it("renders section headers for populated categories", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5, sneaking: 3 },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("Combat")).toBeInTheDocument();
    expect(screen.getByText("Physical")).toBeInTheDocument();
  });

  it("does not render section headers for empty categories", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    expect(screen.getByText("Combat")).toBeInTheDocument();
    expect(screen.queryByText("Physical")).not.toBeInTheDocument();
    expect(screen.queryByText("Social")).not.toBeInTheDocument();
    expect(screen.queryByText("Technical")).not.toBeInTheDocument();
  });

  it("renders BookOpen icon for individual skills, Users icon for group skills", () => {
    const character = createSheetCharacter({
      skills: { "unarmed-combat": 3, pistols: 5 },
    });
    const { container } = render(<SkillsDisplay character={character} />);

    // unarmed-combat has group: null → BookOpen
    // pistols has group: "firearms" → Users
    const bookOpenIcons = container.querySelectorAll('[data-testid="icon-BookOpen"]');
    const usersIcons = container.querySelectorAll('[data-testid="icon-Users"]');
    expect(bookOpenIcons.length).toBeGreaterThanOrEqual(1);
    expect(usersIcons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders skill rating in value pill (no brackets)", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    const { container } = render(<SkillsDisplay character={character} />);
    const ratingPill = container.querySelector('[data-testid="rating-pill"]');
    expect(ratingPill).toBeInTheDocument();
    expect(ratingPill!.textContent).toBe("5");
    // No brackets
    expect(screen.queryByText("[5]")).not.toBeInTheDocument();
  });

  it("renders dice pool in emerald pill", () => {
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
    const { container } = render(<SkillsDisplay character={character} />);
    const poolPill = container.querySelector('[data-testid="dice-pool-pill"]');
    expect(poolPill).toBeInTheDocument();
    expect(poolPill!.textContent).toBe("11");
  });

  it("renders group name on line 2 for group skills", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    // pistols has group: "firearms"
    expect(screen.getByText(/firearms/)).toBeInTheDocument();
  });
});
