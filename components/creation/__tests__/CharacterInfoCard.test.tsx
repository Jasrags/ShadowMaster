/**
 * CharacterInfoCard Component Tests
 *
 * Tests the character biographical info card in character creation.
 * Tests include rendering, input interactions, name length limits,
 * word count indicators, and state updates.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CharacterInfoCard } from "../CharacterInfoCard";

// Mock the shared CreationCard wrapper
vi.mock("../shared", () => ({
  CreationCard: ({
    title,
    description,
    status,
    children,
  }: {
    title: string;
    description: string;
    status: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-description">{description}</div>
      {children}
    </div>
  ),
}));

// Factory to create test state - using 'any' to allow flexible test data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 1,
  priorities: {},
  selections: {
    characterName: "",
    description: "",
    background: "",
    gender: "",
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("CharacterInfoCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Character Info");
    });

    it("renders all input fields", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByPlaceholderText("Your runner handle")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Character's gender")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Height, build, distinguishing features...")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("How did you become a shadowrunner? What drives you?")
      ).toBeInTheDocument();
    });

    it("renders field labels", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Street Name")).toBeInTheDocument();
      expect(screen.getByText("Gender")).toBeInTheDocument();
      expect(screen.getByText("Physical Description")).toBeInTheDocument();
      expect(screen.getByText("Background")).toBeInTheDocument();
    });

    it("shows Required tag for street name", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("(Required)")).toBeInTheDocument();
    });

    it("shows Optional tag for other fields", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getAllByText("(Optional)")).toHaveLength(3);
    });

    it("renders existing values from state", () => {
      const state = createBaseState({
        selections: {
          characterName: "Razor",
          description: "Tall and scarred",
          background: "Former corp security",
          gender: "Male",
        },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByDisplayValue("Razor")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Male")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Tall and scarred")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Former corp security")).toBeInTheDocument();
    });
  });

  describe("card status", () => {
    it("shows pending status when empty", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when name is provided", () => {
      const state = createBaseState({
        selections: { characterName: "Razor" },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows warning status when only description is provided (no name)", () => {
      const state = createBaseState({
        selections: { characterName: "", description: "Some description" },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("shows character name in card description when name exists", () => {
      const state = createBaseState({
        selections: { characterName: "Razor" },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("Razor");
    });

    it("shows 'Name your runner' when no name", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("Name your runner");
    });
  });

  describe("input interactions", () => {
    it("updates state when character name changes", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      const nameInput = screen.getByPlaceholderText("Your runner handle");
      fireEvent.change(nameInput, { target: { value: "Razor" } });

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          characterName: "Razor",
        }),
      });
    });

    it("updates state when gender changes", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      const genderInput = screen.getByPlaceholderText("Character's gender");
      fireEvent.change(genderInput, { target: { value: "Female" } });

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          gender: "Female",
        }),
      });
    });

    it("updates state when description changes", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      const descInput = screen.getByPlaceholderText("Height, build, distinguishing features...");
      fireEvent.change(descInput, { target: { value: "Tall elf with cybereyes" } });

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          description: "Tall elf with cybereyes",
        }),
      });
    });

    it("updates state when background changes", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      const bgInput = screen.getByPlaceholderText(
        "How did you become a shadowrunner? What drives you?"
      );
      fireEvent.change(bgInput, { target: { value: "Ex-Lone Star" } });

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          background: "Ex-Lone Star",
        }),
      });
    });
  });

  describe("name length tracking", () => {
    it("shows character count", () => {
      const state = createBaseState({
        selections: { characterName: "Razor" },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("5/100")).toBeInTheDocument();
    });

    it("shows 0/100 when name is empty", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("0/100")).toBeInTheDocument();
    });

    it("shows warning when name exceeds limit", () => {
      const longName = "A".repeat(100);
      const state = createBaseState({
        selections: { characterName: longName },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Name exceeds recommended length")).toBeInTheDocument();
    });

    it("does not show warning when name is under limit", () => {
      const state = createBaseState({
        selections: { characterName: "Razor" },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Name exceeds recommended length")).not.toBeInTheDocument();
    });
  });

  describe("word count indicators", () => {
    it("shows dash for empty description", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Description:.*—/)).toBeInTheDocument();
    });

    it("shows dash for empty background", () => {
      const state = createBaseState();
      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Background:.*—/)).toBeInTheDocument();
    });

    it("shows word count for description", () => {
      const state = createBaseState({
        selections: { description: "Tall and scarred runner" },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Description:.*4 words/)).toBeInTheDocument();
    });

    it("shows word count for background", () => {
      const state = createBaseState({
        selections: { background: "Former corp security turned runner" },
      });

      render(<CharacterInfoCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Background:.*5 words/)).toBeInTheDocument();
    });
  });
});
