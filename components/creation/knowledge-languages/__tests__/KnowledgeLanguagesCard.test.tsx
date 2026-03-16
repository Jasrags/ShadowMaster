/**
 * KnowledgeLanguagesCard Component Tests
 *
 * Tests the knowledge skills and languages allocation card in character creation.
 * Tests include rendering, budget tracking, validation status,
 * add/remove interactions, and summary footer.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KnowledgeLanguagesCard } from "../KnowledgeLanguagesCard";

// Mock the shared CreationCard, BudgetIndicator, SummaryFooter
vi.mock("../../shared", () => ({
  CreationCard: ({
    title,
    status,
    children,
  }: {
    title: string;
    status: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      {children}
    </div>
  ),
  BudgetIndicator: ({
    label,
    spent,
    total,
    note,
  }: {
    label: string;
    spent: number;
    total: number;
    note?: string;
  }) => (
    <div data-testid="budget-indicator" data-label={label} data-spent={spent} data-total={total}>
      {note && <span data-testid="budget-note">{note}</span>}
    </div>
  ),
  SummaryFooter: ({ count, total, label }: { count: number; total: string; label: string }) => (
    <div data-testid="summary-footer" data-count={count} data-total={total} data-label={label} />
  ),
}));

// Mock child components
vi.mock("../LanguageRow", () => ({
  LanguageRow: ({
    language,
    onRatingChange,
    onRemove,
  }: {
    language: { name: string; rating: number; isNative: boolean };
    onRatingChange: (delta: number) => void;
    onRemove: () => void;
  }) => (
    <div data-testid={`language-row-${language.name}`}>
      <span data-testid={`language-name-${language.name}`}>{language.name}</span>
      <span data-testid={`language-rating-${language.name}`}>{language.rating}</span>
      {language.isNative && <span data-testid={`language-native-${language.name}`}>Native</span>}
      <button data-testid={`language-increment-${language.name}`} onClick={() => onRatingChange(1)}>
        +
      </button>
      <button
        data-testid={`language-decrement-${language.name}`}
        onClick={() => onRatingChange(-1)}
      >
        -
      </button>
      <button data-testid={`language-remove-${language.name}`} onClick={onRemove}>
        Remove
      </button>
    </div>
  ),
}));

vi.mock("../KnowledgeSkillRow", () => ({
  KnowledgeSkillRow: ({
    skill,
    onRatingChange,
    onRemove,
    onAddSpecialization,
    onRemoveSpecialization,
    canAddSpecialization,
  }: {
    skill: { name: string; rating: number; category: string; specialization?: string };
    onRatingChange: (delta: number) => void;
    onRemove: () => void;
    onAddSpecialization?: () => void;
    onRemoveSpecialization?: () => void;
    canAddSpecialization?: boolean;
  }) => (
    <div data-testid={`knowledge-row-${skill.name}`}>
      <span data-testid={`knowledge-name-${skill.name}`}>{skill.name}</span>
      <span data-testid={`knowledge-rating-${skill.name}`}>{skill.rating}</span>
      <span data-testid={`knowledge-category-${skill.name}`}>{skill.category}</span>
      {skill.specialization && (
        <span data-testid={`knowledge-spec-${skill.name}`}>{skill.specialization}</span>
      )}
      <button data-testid={`knowledge-increment-${skill.name}`} onClick={() => onRatingChange(1)}>
        +
      </button>
      <button data-testid={`knowledge-decrement-${skill.name}`} onClick={() => onRatingChange(-1)}>
        -
      </button>
      <button data-testid={`knowledge-remove-${skill.name}`} onClick={onRemove}>
        Remove
      </button>
      {onAddSpecialization && (
        <button
          data-testid={`knowledge-add-spec-${skill.name}`}
          onClick={onAddSpecialization}
          disabled={!canAddSpecialization}
        >
          Add Spec
        </button>
      )}
      {onRemoveSpecialization && (
        <button
          data-testid={`knowledge-remove-spec-${skill.name}`}
          onClick={onRemoveSpecialization}
        >
          Remove Spec
        </button>
      )}
    </div>
  ),
}));

vi.mock("../KnowledgeLanguageModal", () => ({
  KnowledgeLanguageModal: ({
    isOpen,
    onClose,
    onAddLanguage,
    onAddKnowledgeSkill,
    defaultMode,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onAddLanguage: (name: string, rating: number, isNative: boolean) => void;
    onAddKnowledgeSkill: (
      name: string,
      category: string,
      rating: number,
      specialization?: string
    ) => void;
    defaultMode?: string;
  }) =>
    isOpen ? (
      <div data-testid="knowledge-language-modal" data-mode={defaultMode}>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        <button
          data-testid="modal-add-language"
          onClick={() => onAddLanguage("Japanese", 3, false)}
        >
          Add Language
        </button>
        <button
          data-testid="modal-add-native-language"
          onClick={() => onAddLanguage("English", 0, true)}
        >
          Add Native Language
        </button>
        <button
          data-testid="modal-add-knowledge"
          onClick={() => onAddKnowledgeSkill("Sprawl Life", "street", 2)}
        >
          Add Knowledge
        </button>
      </div>
    ) : null,
}));

vi.mock("../KnowledgeSkillSpecModal", () => ({
  KnowledgeSkillSpecModal: ({
    isOpen,
    onClose,
    onAdd,
    skillName,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (spec: string) => void;
    skillName: string;
  }) =>
    isOpen ? (
      <div data-testid="spec-modal" data-skill={skillName}>
        <button data-testid="spec-modal-close" onClick={onClose}>
          Close
        </button>
        <button data-testid="spec-modal-add" onClick={() => onAdd("Seattle")}>
          Add Spec
        </button>
      </div>
    ) : null,
}));

// Factory to create test state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 1,
  priorities: {},
  selections: {
    attributes: { intuition: 3, logic: 3 },
    languages: [],
    knowledgeSkills: [],
    positiveQualities: [],
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("KnowledgeLanguagesCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Knowledge & Languages");
    });

    it("renders Languages section label", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Languages")).toBeInTheDocument();
    });

    it("renders Knowledge Skills section label", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Knowledge Skills")).toBeInTheDocument();
    });

    it("shows empty state for languages when none added", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No languages added")).toBeInTheDocument();
    });

    it("shows empty state for knowledge skills when none added", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No knowledge skills added")).toBeInTheDocument();
    });

    it("shows attribute hint when attributes are at defaults", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 1, logic: 1 },
          languages: [],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(
        screen.getByText("Set attributes to see your knowledge point budget.")
      ).toBeInTheDocument();
    });

    it("does not show attribute hint when attributes are set", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(
        screen.queryByText("Set attributes to see your knowledge point budget.")
      ).not.toBeInTheDocument();
    });

    it("renders add language button", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Language")).toBeInTheDocument();
    });

    it("renders add skill button", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Skill")).toBeInTheDocument();
    });
  });

  describe("selected items display", () => {
    it("renders language rows for added languages", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 3, isNative: false },
          ],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("language-row-English")).toBeInTheDocument();
      expect(screen.getByTestId("language-row-Japanese")).toBeInTheDocument();
      expect(screen.getByTestId("language-native-English")).toBeInTheDocument();
    });

    it("renders knowledge skill rows for added skills", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [
            { name: "Sprawl Life", category: "street", rating: 2 },
            { name: "Parazoology", category: "academic", rating: 4 },
          ],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("knowledge-row-Sprawl Life")).toBeInTheDocument();
      expect(screen.getByTestId("knowledge-row-Parazoology")).toBeInTheDocument();
      expect(screen.getByTestId("knowledge-category-Sprawl Life")).toHaveTextContent("street");
      expect(screen.getByTestId("knowledge-category-Parazoology")).toHaveTextContent("academic");
    });

    it("renders knowledge skill with specialization", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [
            {
              name: "Sprawl Life",
              category: "street",
              rating: 3,
              specialization: "Seattle",
            },
          ],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("knowledge-spec-Sprawl Life")).toHaveTextContent("Seattle");
    });

    it("hides empty state when languages are present", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "English", rating: 0, isNative: true }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("No languages added")).not.toBeInTheDocument();
    });

    it("hides empty state when knowledge skills are present", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 2 }],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("No knowledge skills added")).not.toBeInTheDocument();
    });
  });

  describe("budget tracking", () => {
    it("calculates total knowledge points as (INT + LOG) x 2", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 4, logic: 5 },
          languages: [],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      expect(budget).toHaveAttribute("data-total", "18"); // (4 + 5) * 2
    });

    it("tracks spent points from non-native languages", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 3, isNative: false },
          ],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      expect(budget).toHaveAttribute("data-spent", "3");
    });

    it("tracks spent points from knowledge skills", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [
            { name: "Sprawl Life", category: "street", rating: 2 },
            { name: "Parazoology", category: "academic", rating: 4 },
          ],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      expect(budget).toHaveAttribute("data-spent", "6"); // 2 + 4
    });

    it("includes specialization cost in spent points", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [
            {
              name: "Sprawl Life",
              category: "street",
              rating: 2,
              specialization: "Seattle",
            },
          ],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      // 2 (rating) + 1 (spec cost) = 3
      expect(budget).toHaveAttribute("data-spent", "3");
    });

    it("native language does not cost points", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "English", rating: 0, isNative: true }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      expect(budget).toHaveAttribute("data-spent", "0");
    });

    it("shows over budget note when points exceeded", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 1, logic: 1 },
          languages: [{ name: "Japanese", rating: 6, isNative: false }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      // Total = (1+1)*2 = 4, spent = 6, over by 2
      expect(screen.getByTestId("budget-note")).toHaveTextContent("2 points over budget");
    });

    it("does not show budget note when within budget", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("budget-note")).not.toBeInTheDocument();
    });
  });

  describe("validation status", () => {
    it("shows pending status when no items added", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when all points spent exactly", () => {
      // Total = (3+3)*2 = 12, need to spend exactly 12
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "Japanese", rating: 6, isNative: false }],
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 6 }],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows warning status when items added but points remain", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "Japanese", rating: 2, isNative: false }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("shows error status when over budget", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 1, logic: 1 },
          languages: [{ name: "Japanese", rating: 6, isNative: false }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  describe("add/remove interactions", () => {
    it("opens modal in language mode when add language button clicked", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      // Click the "Language" add button
      const buttons = screen.getAllByText("Language");
      const addButton = buttons.find((btn) => btn.closest("button"));
      fireEvent.click(addButton!);

      expect(screen.getByTestId("knowledge-language-modal")).toHaveAttribute(
        "data-mode",
        "language"
      );
    });

    it("opens modal in knowledge mode when add skill button clicked", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const buttons = screen.getAllByText("Skill");
      const addButton = buttons.find((btn) => btn.closest("button"));
      fireEvent.click(addButton!);

      expect(screen.getByTestId("knowledge-language-modal")).toHaveAttribute(
        "data-mode",
        "knowledge"
      );
    });

    it("adds a language via modal callback", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      // Open modal
      const buttons = screen.getAllByText("Language");
      const addButton = buttons.find((btn) => btn.closest("button"));
      fireEvent.click(addButton!);

      // Click add language in modal
      fireEvent.click(screen.getByTestId("modal-add-language"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          languages: [{ name: "Japanese", rating: 3, isNative: false }],
        }),
      });
    });

    it("adds a native language via modal callback", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      // Open modal
      const buttons = screen.getAllByText("Language");
      const addButton = buttons.find((btn) => btn.closest("button"));
      fireEvent.click(addButton!);

      fireEvent.click(screen.getByTestId("modal-add-native-language"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          languages: [{ name: "English", rating: 0, isNative: true }],
        }),
      });
    });

    it("adds a knowledge skill via modal callback", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      // Open modal
      const buttons = screen.getAllByText("Skill");
      const addButton = buttons.find((btn) => btn.closest("button"));
      fireEvent.click(addButton!);

      fireEvent.click(screen.getByTestId("modal-add-knowledge"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 2 }],
        }),
      });
    });

    it("removes a language when remove button clicked", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 3, isNative: false },
          ],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("language-remove-Japanese"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          languages: [{ name: "English", rating: 0, isNative: true }],
        }),
      });
    });

    it("removes a knowledge skill when remove button clicked", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [
            { name: "Sprawl Life", category: "street", rating: 2 },
            { name: "Parazoology", category: "academic", rating: 4 },
          ],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("knowledge-remove-Sprawl Life"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          knowledgeSkills: [{ name: "Parazoology", category: "academic", rating: 4 }],
        }),
      });
    });

    it("increments language rating via stepper", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "Japanese", rating: 3, isNative: false }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("language-increment-Japanese"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          languages: [{ name: "Japanese", rating: 4, isNative: false }],
        }),
      });
    });

    it("decrements language rating via stepper", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "Japanese", rating: 3, isNative: false }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("language-decrement-Japanese"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          languages: [{ name: "Japanese", rating: 2, isNative: false }],
        }),
      });
    });

    it("does not change native language rating", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "English", rating: 0, isNative: true }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("language-increment-English"));

      expect(mockUpdateState).not.toHaveBeenCalled();
    });

    it("does not allow language rating below 1", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "Japanese", rating: 1, isNative: false }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("language-decrement-Japanese"));

      expect(mockUpdateState).not.toHaveBeenCalled();
    });

    it("does not allow language rating above max", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "Japanese", rating: 6, isNative: false }],
          knowledgeSkills: [],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("language-increment-Japanese"));

      expect(mockUpdateState).not.toHaveBeenCalled();
    });

    it("increments knowledge skill rating via stepper", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 2 }],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("knowledge-increment-Sprawl Life"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 3 }],
        }),
      });
    });

    it("removes specialization from knowledge skill", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [
            {
              name: "Sprawl Life",
              category: "street",
              rating: 3,
              specialization: "Seattle",
            },
          ],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("knowledge-remove-spec-Sprawl Life"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 3 }],
        }),
      });
    });

    it("opens specialization modal for knowledge skill", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 3 }],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("knowledge-add-spec-Sprawl Life"));

      expect(screen.getByTestId("spec-modal")).toHaveAttribute("data-skill", "Sprawl Life");
    });

    it("adds specialization via spec modal callback", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [],
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 3 }],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      // Open spec modal
      fireEvent.click(screen.getByTestId("knowledge-add-spec-Sprawl Life"));
      // Add specialization
      fireEvent.click(screen.getByTestId("spec-modal-add"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          knowledgeSkills: [
            {
              name: "Sprawl Life",
              category: "street",
              rating: 3,
              specialization: "Seattle",
            },
          ],
        }),
      });
    });

    it("closes modal when close button clicked", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      // Open modal
      const buttons = screen.getAllByText("Language");
      const addButton = buttons.find((btn) => btn.closest("button"));
      fireEvent.click(addButton!);

      expect(screen.getByTestId("knowledge-language-modal")).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByTestId("modal-close"));

      expect(screen.queryByTestId("knowledge-language-modal")).not.toBeInTheDocument();
    });
  });

  describe("summary footer", () => {
    it("shows zero count and zero points when empty", () => {
      const state = createBaseState();
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "0");
      expect(footer).toHaveAttribute("data-total", "0 pts");
      expect(footer).toHaveAttribute("data-label", "item");
    });

    it("shows combined count of languages and knowledge skills", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 3, isNative: false },
          ],
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 2 }],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "3");
    });

    it("shows total spent points in footer", () => {
      const state = createBaseState({
        selections: {
          attributes: { intuition: 3, logic: 3 },
          languages: [{ name: "Japanese", rating: 3, isNative: false }],
          knowledgeSkills: [{ name: "Sprawl Life", category: "street", rating: 2 }],
          positiveQualities: [],
        },
      });
      render(<KnowledgeLanguagesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "5 pts"); // 3 + 2
    });
  });
});
