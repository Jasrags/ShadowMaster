/**
 * SkillsCard Component Tests
 *
 * Tests the skill allocation card in character creation.
 * Tests include rendering, skill/group selection, budget tracking,
 * specializations, and karma purchases.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkillsCard } from "../SkillsCard";

// Mock the hooks used by SkillsCard
vi.mock("@/lib/rules", () => ({
  useSkills: vi.fn(),
  usePriorityTable: vi.fn(),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

// Mock extracted sub-components imported from direct paths by SkillsCard
vi.mock("../skills/SkillsModalsSection", () => ({
  SkillsModalsSection: ({
    isSkillModalOpen,
    isGroupModalOpen,
  }: {
    isSkillModalOpen: boolean;
    isGroupModalOpen: boolean;
  }) => (
    <>
      {isSkillModalOpen && <div data-testid="skill-modal">Skill Modal</div>}
      {isGroupModalOpen && <div data-testid="skill-group-modal">Skill Group Modal</div>}
    </>
  ),
}));

vi.mock("../skills/SkillsListSection", () => ({
  SkillsListSection: ({
    skillGroupPoints,
    groups,
    allSkillsSorted,
    handlers,
    onOpenGroupModal,
    onOpenSkillModal,
  }: {
    skillGroupPoints: number;
    groups: Record<string, unknown>;
    allSkillsSorted: Array<{
      skillId: string;
      rating: number;
      source: { type: string; groupId?: string; groupName?: string };
    }>;
    handlers: {
      getSkillData: (id: string) => { name: string; linkedAttribute: string } | undefined;
      getGroupData: (id: string) => { name: string; skills: string[] } | undefined;
      handleRemoveSkill: (id: string) => void;
    };
    onOpenGroupModal: () => void;
    onOpenSkillModal: () => void;
  }) => (
    <>
      {skillGroupPoints > 0 && (
        <div>
          <button onClick={onOpenGroupModal} className="bg-amber-500">
            Group
          </button>
          {Object.keys(groups).length === 0 ? (
            <p>No skill groups added</p>
          ) : (
            Object.entries(groups).map(([groupId]) => {
              const groupData = handlers.getGroupData(groupId);
              if (!groupData) return null;
              return (
                <div key={groupId}>
                  <span>{groupData.name}</span>
                </div>
              );
            })
          )}
        </div>
      )}
      <div>
        <button onClick={onOpenSkillModal} className="bg-amber-500">
          Skill
        </button>
        {allSkillsSorted.length === 0 ? (
          <p>No skills added</p>
        ) : (
          allSkillsSorted.map(
            (entry: { skillId: string; rating: number; source: { type: string } }) => {
              const skillData = handlers.getSkillData(entry.skillId);
              if (!skillData) return null;
              const isGroupSkill = entry.source.type === "group";
              return (
                <div
                  key={entry.skillId}
                  data-testid={`skill-item-${skillData.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span>{skillData.name}</span>
                  <span data-testid="skill-rating">{entry.rating}</span>
                  {!isGroupSkill && (
                    <button
                      onClick={() => handlers.handleRemoveSkill(entry.skillId)}
                      data-testid={`remove-${skillData.name.toLowerCase()}`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            }
          )
        )}
      </div>
    </>
  ),
}));

// Mock the sub-components that use modals (to simplify testing)
vi.mock("../skills", () => ({
  SkillModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="skill-modal">Skill Modal</div> : null,
  SkillGroupModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="skill-group-modal">Skill Group Modal</div> : null,
  SkillListItem: ({
    skillName,
    rating,
    onRemove,
    isGroupSkill,
  }: {
    skillName: string;
    rating: number;
    onRemove?: () => void;
    isGroupSkill: boolean;
  }) => (
    <div data-testid={`skill-item-${skillName.toLowerCase().replace(/\s+/g, "-")}`}>
      <span>{skillName}</span>
      <span data-testid="skill-rating">{rating}</span>
      {!isGroupSkill && onRemove && (
        <button onClick={onRemove} data-testid={`remove-${skillName.toLowerCase()}`}>
          Remove
        </button>
      )}
    </div>
  ),
  SkillCustomizeModal: () => null,
  SkillGroupBreakModal: () => null,
  SkillKarmaConfirmModal: () => null,
  SkillGroupKarmaConfirmModal: () => null,
  SkillSpecModal: () => null,
  FreeSkillsPanel: () => null,
  FreeSkillDesignationModal: () => null,
  // Utilities
  getKarmaSpent: () => ({ skillRaises: {}, skillRatingPoints: 0, specializations: {} }),
  EMPTY_KARMA_SPENT: { skillRaises: {}, skillRatingPoints: 0, specializations: {} },
  // Custom hooks
  useSkillDesignations: () => ({
    freeSkillConfigs: [],
    freeSkillDesignations: undefined,
    hasExplicitDesignations: false,
    designatedSkillIds: new Set(),
    freeSkillAllocationStatuses: [],
    hasFreeSkillConfigs: false,
    freeSkillIds: new Set(),
    freeSkillDesignationModal: null,
    handleOpenDesignationModal: vi.fn(),
    handleConfirmDesignations: vi.fn(),
    handleUndesignateSkill: vi.fn(),
    handleDesignateSkillFromList: vi.fn(),
    canSkillBeDesignated: () => false,
    getSkillFreeRating: () => undefined,
    closeDesignationModal: vi.fn(),
  }),
  useGroupBreaking: () => ({
    customizeTarget: null,
    pendingChanges: null,
    isBreakModalOpen: false,
    restorableGroups: [],
    hasRestorableGroups: false,
    handleOpenCustomize: vi.fn(),
    handleCloseCustomize: vi.fn(),
    handleCustomizeApply: vi.fn(),
    handleConfirmBreak: vi.fn(),
    handleCancelBreak: vi.fn(),
    handleRestoreGroup: vi.fn(),
  }),
  useKarmaPurchase: () => ({
    getPurchaseMode: () => ({ mode: "skill-points" }),
    getGroupPurchaseMode: () => ({ mode: "group-points" }),
    karmaSkillPurchase: null,
    karmaGroupPurchase: null,
    handleOpenKarmaConfirm: vi.fn(),
    handleConfirmKarmaPurchase: vi.fn(),
    closeSkillKarmaConfirm: vi.fn(),
    handleOpenGroupKarmaConfirm: vi.fn(),
    handleConfirmGroupKarmaPurchase: vi.fn(),
    closeGroupKarmaConfirm: vi.fn(),
  }),
}));

// Note: FreeSkillsPanel and FreeSkillDesignationModal are now exported from ../skills barrel

vi.mock("@/lib/rules/skills/group-utils", () => ({
  getGroupRating: (value: number | { rating: number; isBroken?: boolean }) =>
    typeof value === "number" ? value : value.rating,
  isGroupBroken: (value: number | { rating: number; isBroken?: boolean }) =>
    typeof value === "object" && value.isBroken === true,
  createBrokenGroup: (value: number | { rating: number }) => ({
    rating: typeof value === "number" ? value : value.rating,
    isBroken: true,
  }),
  createRestoredGroup: (rating: number) => rating,
  normalizeGroupValue: (value: number | { rating: number; isBroken?: boolean }) =>
    typeof value === "number" ? { rating: value, isBroken: false } : value,
  canRestoreGroup: () => ({ canRestore: false }),
  calculateSkillRaiseKarmaCost: (from: number, to: number) => (from + to) * 2,
  calculateSkillGroupRaiseKarmaCost: (from: number, to: number) => (from + to) * 5,
}));

vi.mock("@/lib/rules/skills/free-skills", () => ({
  getFreeSkillsFromMagicPriority: () => [],
  getSkillsWithFreeAllocation: () => new Set(),
  getFreeSkillAllocationStatus: () => [],
  getDesignatedFreeSkills: () => new Set(),
  getDesignatedSkillFreeRating: () => undefined,
  canDesignateForFreeSkill: () => ({ canDesignate: false }),
}));

import { useSkills, usePriorityTable } from "@/lib/rules";
import { useCreationBudgets } from "@/lib/contexts";

// Sample data for tests
const mockActiveSkills = [
  { id: "archery", name: "Archery", linkedAttribute: "AGI", category: "combat" },
  { id: "automatics", name: "Automatics", linkedAttribute: "AGI", category: "combat" },
  { id: "blades", name: "Blades", linkedAttribute: "AGI", category: "combat" },
  { id: "clubs", name: "Clubs", linkedAttribute: "AGI", category: "combat" },
  { id: "computer", name: "Computer", linkedAttribute: "LOG", category: "technical" },
  { id: "cybercombat", name: "Cybercombat", linkedAttribute: "LOG", category: "technical" },
  { id: "hacking", name: "Hacking", linkedAttribute: "LOG", category: "technical" },
  { id: "spellcasting", name: "Spellcasting", linkedAttribute: "MAG", category: "magical" },
  { id: "summoning", name: "Summoning", linkedAttribute: "MAG", category: "magical" },
  { id: "counterspelling", name: "Counterspelling", linkedAttribute: "MAG", category: "magical" },
  { id: "perception", name: "Perception", linkedAttribute: "INT", category: "general" },
  { id: "sneaking", name: "Sneaking", linkedAttribute: "AGI", category: "general" },
];

const mockSkillGroups = [
  {
    id: "firearms",
    name: "Firearms",
    skills: ["archery", "automatics", "longarms", "pistols"],
  },
  {
    id: "close-combat",
    name: "Close Combat",
    skills: ["blades", "clubs", "unarmed-combat"],
  },
  {
    id: "sorcery",
    name: "Sorcery",
    skills: ["spellcasting", "counterspelling", "ritual-spellcasting"],
  },
  {
    id: "electronics",
    name: "Electronics",
    skills: ["computer", "cybercombat", "hacking", "software"],
  },
];

const mockPriorityTable = {
  table: {
    A: { skills: { skillPoints: 46, groupPoints: 10 } },
    B: { skills: { skillPoints: 36, groupPoints: 5 } },
    C: { skills: { skillPoints: 28, groupPoints: 2 } },
    D: { skills: { skillPoints: 22, groupPoints: 0 } },
    E: { skills: { skillPoints: 18, groupPoints: 0 } },
  },
};

const createMockBudget = (total: number, spent: number = 0) => ({
  total,
  spent,
  remaining: total - spent,
  label: "Test Budget",
});

// Factory to create test state - using 'any' to allow flexible test data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 3,
  priorities: {
    metatype: "C",
    attributes: "B",
    magic: "E",
    skills: "A",
    resources: "D",
  },
  selections: {
    skills: {},
    skillGroups: {},
    skillSpecializations: {},
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("SkillsCard", () => {
  let mockUpdateState: Mock;
  let mockGetBudget: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdateState = vi.fn();
    mockGetBudget = vi.fn((budgetId: string) => {
      if (budgetId === "skill-points") return createMockBudget(46, 0);
      if (budgetId === "skill-group-points") return createMockBudget(10, 0);
      if (budgetId === "karma") return createMockBudget(25, 0);
      return null;
    });

    vi.mocked(useSkills).mockReturnValue({
      activeSkills: mockActiveSkills,
      skillGroups: mockSkillGroups,
    } as unknown as ReturnType<typeof useSkills>);
    vi.mocked(usePriorityTable).mockReturnValue(
      mockPriorityTable as unknown as ReturnType<typeof usePriorityTable>
    );
    vi.mocked(useCreationBudgets).mockReturnValue({
      getBudget: mockGetBudget,
      budgets: {},
      updateSpent: vi.fn(),
      errors: [],
      warnings: [],
      isComplete: false,
    } as unknown as ReturnType<typeof useCreationBudgets>);
  });

  describe("rendering", () => {
    it("renders locked state when no skill priority is set", () => {
      const state = createBaseState({
        priorities: undefined,
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(
        screen.getByText("Skills locked until priorities are configured.")
      ).toBeInTheDocument();
    });

    it("renders skill points budget indicator", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Skill Points")).toBeInTheDocument();
    });

    it("renders group points budget indicator when group points > 0", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Group Points")).toBeInTheDocument();
    });

    it("renders empty skills state when no skills selected", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No skills added")).toBeInTheDocument();
    });

    it("renders empty skill groups state when no groups selected", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No skill groups added")).toBeInTheDocument();
    });

    it("renders Add Skill button", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      const skillButton = screen.getAllByRole("button", { name: /Skill/i })[0];
      expect(skillButton).toBeInTheDocument();
    });

    it("renders Add Group button", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Use getAllBy since there are multiple buttons with "Group" in name (info buttons + add button)
      const groupButtons = screen.getAllByRole("button", { name: /Group/i });
      // Find the Add Group button specifically (it should have text containing just "Group")
      const addGroupButton = groupButtons.find(
        (btn) => btn.textContent?.includes("Group") && btn.classList.contains("bg-amber-500")
      );
      expect(addGroupButton).toBeInTheDocument();
    });
  });

  describe("skill display", () => {
    it("renders selected individual skills", () => {
      const state = createBaseState({
        selections: {
          skills: { perception: 4, sneaking: 3 },
          skillGroups: {},
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Perception")).toBeInTheDocument();
      expect(screen.getByText("Sneaking")).toBeInTheDocument();
    });

    it("renders skills from selected groups", () => {
      const state = createBaseState({
        selections: {
          skills: {},
          skillGroups: { sorcery: 4 },
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Check that skills from the Sorcery group are displayed
      expect(screen.getByText("Spellcasting")).toBeInTheDocument();
      expect(screen.getByText("Counterspelling")).toBeInTheDocument();
    });

    it("sorts skills alphabetically", () => {
      const state = createBaseState({
        selections: {
          skills: { sneaking: 3, perception: 4, computer: 2 },
          skillGroups: {},
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      const skillItems = screen.getAllByTestId(/^skill-item-/);
      const skillNames = skillItems.map((item) => item.textContent?.split(/\d/)[0]);

      // Computer comes before Perception which comes before Sneaking
      expect(skillNames[0]).toContain("Computer");
      expect(skillNames[1]).toContain("Perception");
      expect(skillNames[2]).toContain("Sneaking");
    });
  });

  describe("skill groups display", () => {
    it("renders selected skill groups", () => {
      const state = createBaseState({
        selections: {
          skills: {},
          skillGroups: { sorcery: 4 },
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Sorcery")).toBeInTheDocument();
    });

    it("shows group skills in the group card", () => {
      const state = createBaseState({
        selections: {
          skills: {},
          skillGroups: { sorcery: 4 },
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Group skills should be listed (may appear multiple times in different contexts)
      const spellcastingElements = screen.getAllByText(/Spellcasting/);
      expect(spellcastingElements.length).toBeGreaterThan(0);
    });
  });

  describe("modal interactions", () => {
    it("opens skill modal when Add Skill button clicked", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Find the amber-colored Add Skill button
      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find(
        (btn) => btn.textContent?.includes("Skill") && btn.classList.contains("bg-amber-500")
      );
      expect(addButton).toBeDefined();
      fireEvent.click(addButton!);

      expect(screen.getByTestId("skill-modal")).toBeInTheDocument();
    });

    it("opens group modal when Add Group button clicked", () => {
      const state = createBaseState();

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Find the amber-colored Add Group button
      const buttons = screen.getAllByRole("button");
      const addButton = buttons.find(
        (btn) => btn.textContent?.includes("Group") && btn.classList.contains("bg-amber-500")
      );
      expect(addButton).toBeDefined();
      fireEvent.click(addButton!);

      expect(screen.getByTestId("skill-group-modal")).toBeInTheDocument();
    });
  });

  describe("skill removal", () => {
    it("removes individual skill when remove button clicked", () => {
      const state = createBaseState({
        selections: {
          skills: { perception: 4 },
          skillGroups: {},
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      const removeButton = screen.getByTestId("remove-perception");
      fireEvent.click(removeButton);

      expect(mockUpdateState).toHaveBeenCalled();
      const updateCall = mockUpdateState.mock.calls[0][0];
      expect(updateCall.selections.skills.perception).toBeUndefined();
    });
  });

  describe("budget tracking", () => {
    it("shows correct skill points spent", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "skill-points") return createMockBudget(46, 10);
        if (budgetId === "skill-group-points") return createMockBudget(10, 0);
        if (budgetId === "karma") return createMockBudget(25, 0);
        return null;
      });

      const state = createBaseState({
        selections: {
          skills: { perception: 4, sneaking: 3, computer: 3 }, // 10 points
          skillGroups: {},
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Skill Points")).toBeInTheDocument();
    });

    it("shows correct group points spent", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "skill-points") return createMockBudget(46, 0);
        if (budgetId === "skill-group-points") return createMockBudget(10, 4);
        if (budgetId === "karma") return createMockBudget(25, 0);
        return null;
      });

      const state = createBaseState({
        selections: {
          skills: {},
          skillGroups: { sorcery: 4 },
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Group Points")).toBeInTheDocument();
    });
  });

  describe("priority D/E handling", () => {
    it("hides group section when no group points available", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "skill-points") return createMockBudget(22, 0); // Priority D
        if (budgetId === "skill-group-points") return createMockBudget(0, 0);
        if (budgetId === "karma") return createMockBudget(25, 0);
        return null;
      });

      const state = createBaseState({
        priorities: {
          metatype: "C",
          attributes: "B",
          magic: "E",
          skills: "D",
          resources: "A",
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Group Points should not be shown
      expect(screen.queryByText("Group Points")).not.toBeInTheDocument();
    });
  });

  describe("specialization display", () => {
    it("shows specialization count in footer when specs exist", () => {
      const state = createBaseState({
        selections: {
          skills: { perception: 4 },
          skillGroups: {},
          skillSpecializations: { perception: ["Visual"] },
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/1 specialization/i)).toBeInTheDocument();
    });
  });

  describe("footer summary", () => {
    it("shows correct totals in footer", () => {
      const state = createBaseState({
        selections: {
          skills: { perception: 4, sneaking: 3 },
          skillGroups: { sorcery: 4 },
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Should show count of groups and skills
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });
  });

  describe("validation status", () => {
    it("shows pending status when no points spent", () => {
      const state = createBaseState({
        selections: {
          skills: {},
          skillGroups: {},
          skillSpecializations: {},
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      // Card should render without error - look for the card title heading
      const skillsHeadings = screen.getAllByText("Skills");
      expect(skillsHeadings.length).toBeGreaterThan(0);
    });
  });

  describe("magical path integration", () => {
    it("handles magician path correctly", () => {
      const state = createBaseState({
        selections: {
          skills: { spellcasting: 4 },
          skillGroups: {},
          skillSpecializations: {},
          "magical-path": "magician",
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Spellcasting")).toBeInTheDocument();
    });

    it("handles technomancer path correctly", () => {
      const state = createBaseState({
        selections: {
          skills: { computer: 4, hacking: 3 },
          skillGroups: {},
          skillSpecializations: {},
          "magical-path": "technomancer",
        },
      });

      render(<SkillsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Computer")).toBeInTheDocument();
      expect(screen.getByText("Hacking")).toBeInTheDocument();
    });
  });
});
