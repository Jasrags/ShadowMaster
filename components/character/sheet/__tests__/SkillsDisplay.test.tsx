/**
 * SkillsDisplay Component Tests
 *
 * Tests the grouped flex skills display. Mocks useSkills hook.
 * Covers empty state, sorted skills, dice pool calculation,
 * specializations, section headers, icons, and onSelect callback.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import {
  createSheetCharacter,
  MOCK_ACTIVE_SKILLS,
  MOCK_BIOWARE,
  LUCIDE_MOCK,
} from "./test-helpers";

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

vi.mock("@/components/ui", () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div>
      {children}
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
}));

vi.mock("react-aria-components", () => ({
  Button: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
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

  it("shows linked attribute abbreviation in expanded section", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    // Not visible when collapsed
    expect(screen.queryByText("AGI")).not.toBeInTheDocument();
    // Expand the skill row
    fireEvent.click(screen.getByTestId("expand-button"));
    const expanded = screen.getByTestId("expanded-content");
    expect(within(expanded).getByText("AGI")).toBeInTheDocument();
    expect(within(expanded).getByText("Agility")).toBeInTheDocument();
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
    const { container } = render(<SkillsDisplay character={character} />);
    // Pool = pistols(5) + agility(6) = 11
    const poolPill = container.querySelector('[data-testid="dice-pool-pill"]');
    expect(poolPill!.textContent).toBe("11");
  });

  it("renders specializations inline on collapsed row and in expanded section", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
      skillSpecializations: { pistols: ["Semi-Automatics", "Revolvers"] },
    });
    render(<SkillsDisplay character={character} />);
    // Visible inline on collapsed row as parenthetical
    expect(screen.getByText("(Semi-Automatics, Revolvers)")).toBeInTheDocument();
    // Also visible as tags in expanded section
    fireEvent.click(screen.getByTestId("expand-button"));
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

  it("renders skill rating inline with skill name", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    const { container } = render(<SkillsDisplay character={character} />);
    const ratingEl = container.querySelector('[data-testid="rating-pill"]');
    expect(ratingEl).toBeInTheDocument();
    expect(ratingEl!.textContent).toBe("5");
    // Rating is inline text (span), not a boxed pill
    expect(ratingEl!.tagName).toBe("SPAN");
    // Sits within the same row as the skill name
    const row = container.querySelector('[data-testid="skill-row"]')!;
    expect(row.textContent).toContain("Pistols");
    expect(row.textContent).toContain("5");
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

  it("shows group name in expanded section", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    // Not visible when collapsed
    expect(screen.queryByText(/firearms/)).not.toBeInTheDocument();
    // Expand the skill row
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByText(/firearms/)).toBeInTheDocument();
  });

  it("shows defaultable badge in expanded section", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("default-badge")).toHaveTextContent("Can Default");
  });

  it("toggles expanded section on chevron click", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);
    // Initially collapsed
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    // Expand
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    // Collapse
    fireEvent.click(screen.getByTestId("expand-button"));
    expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
  });

  it("clicking expanded content does not trigger onSelect", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId("expand-button"));
    fireEvent.click(screen.getByTestId("expanded-content"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("shows pool breakdown tooltip with attribute and skill values", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);

    const tooltipContent = screen.getByTestId("tooltip-content");
    expect(within(tooltipContent).getByText("Agility")).toBeInTheDocument();
    expect(within(tooltipContent).getByText("6")).toBeInTheDocument();
    expect(within(tooltipContent).getByText("Skill")).toBeInTheDocument();
    expect(within(tooltipContent).getByText("Total")).toBeInTheDocument();
  });

  it("shows augmentation bonuses in pool breakdown tooltip", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
      bioware: [MOCK_BIOWARE], // Muscle Toner: agility +2
    });
    render(<SkillsDisplay character={character} />);

    const tooltipContent = screen.getByTestId("tooltip-content");
    expect(within(tooltipContent).getByText("Muscle Toner")).toBeInTheDocument();
    expect(within(tooltipContent).getByText("+2")).toBeInTheDocument();
  });

  it("renders dice pool pill as focusable button with aria-label", () => {
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} />);

    const pill = screen.getByTestId("dice-pool-pill");
    expect(pill.tagName).toBe("BUTTON");
    expect(pill).toHaveAttribute("aria-label", "Pistols dice pool breakdown");
  });

  it("clicking dice pool pill does not trigger onSelect", () => {
    const onSelect = vi.fn();
    const character = createSheetCharacter({
      skills: { pistols: 5 },
    });
    render(<SkillsDisplay character={character} onSelect={onSelect} />);

    const pill = screen.getByTestId("dice-pool-pill");
    fireEvent.click(pill);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
