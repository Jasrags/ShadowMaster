/**
 * ActionSelector Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionSelector } from "../ActionSelector";
import type { ActionDefinition, ActionAllocation } from "@/lib/types";

// Mock action factory - creates a minimal action that satisfies ActionWithStatus
function createMockAction(overrides: Partial<ActionDefinition & { canPerform: boolean; blockers: string[] }> = {}) {
  return {
    id: "action-1",
    name: "Test Action",
    description: "A test action for testing",
    domain: "combat" as const,
    type: "simple" as const,
    cost: {
      actionType: "simple" as const,
    },
    prerequisites: [],
    modifiers: [],
    canPerform: true,
    blockers: [] as string[],
    ...overrides,
  } as ActionDefinition & { canPerform: boolean; blockers: string[] };
}

const defaultActionsRemaining: ActionAllocation = {
  free: 1,
  simple: 2,
  complex: 1,
  interrupt: true,
};

describe("ActionSelector", () => {
  describe("rendering", () => {
    it("renders available actions", () => {
      const actions = [
        createMockAction({ id: "fire-weapon", name: "Fire Weapon" }),
        createMockAction({ id: "melee-attack", name: "Melee Attack" }),
      ];

      render(
        <ActionSelector
          availableActions={actions}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.getByText("Melee Attack")).toBeInTheDocument();
    });

    it("renders unavailable actions when showUnavailable is true", () => {
      const unavailableActions = [
        createMockAction({
          id: "cast-spell",
          name: "Cast Spell",
          canPerform: false,
          blockers: ["No Magic attribute"],
        }),
      ];

      render(
        <ActionSelector
          availableActions={[]}
          unavailableActions={unavailableActions}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
          showUnavailable
        />
      );

      expect(screen.getByText("Cast Spell")).toBeInTheDocument();
    });

    it("hides unavailable actions when showUnavailable is false", () => {
      const unavailableActions = [
        createMockAction({
          id: "cast-spell",
          name: "Cast Spell",
          canPerform: false,
          blockers: ["No Magic attribute"],
        }),
      ];

      render(
        <ActionSelector
          availableActions={[]}
          unavailableActions={unavailableActions}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
          showUnavailable={false}
        />
      );

      expect(screen.queryByText("Cast Spell")).not.toBeInTheDocument();
    });

    it("shows action economy summary", () => {
      render(
        <ActionSelector
          availableActions={[]}
          actionsRemaining={{ free: 1, simple: 1, complex: 1, interrupt: true }}
          onSelectAction={() => {}}
        />
      );

      // Should show "1S / 1C / Int" format
      expect(screen.getByText(/1S/)).toBeInTheDocument();
      expect(screen.getByText(/1C/)).toBeInTheDocument();
    });

    it("shows no matching actions message when empty", () => {
      render(
        <ActionSelector
          availableActions={[]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      expect(screen.getByText("No matching actions")).toBeInTheDocument();
    });
  });

  describe("action selection", () => {
    it("calls onSelectAction when action selected", () => {
      const onSelectAction = vi.fn();
      const action = createMockAction({ id: "fire-weapon", name: "Fire Weapon" });

      render(
        <ActionSelector
          availableActions={[action]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={onSelectAction}
        />
      );

      fireEvent.click(screen.getByText("Select"));
      expect(onSelectAction).toHaveBeenCalledWith(action);
    });

    it("highlights selected action", () => {
      const action = createMockAction({ id: "fire-weapon", name: "Fire Weapon" });

      render(
        <ActionSelector
          availableActions={[action]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
          selectedActionId="fire-weapon"
        />
      );

      expect(screen.getByText("Selected")).toBeInTheDocument();
    });

    it("disables selection when isDisabled is true", () => {
      const onSelectAction = vi.fn();
      const action = createMockAction({ id: "fire-weapon", name: "Fire Weapon" });

      render(
        <ActionSelector
          availableActions={[action]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={onSelectAction}
          isDisabled
        />
      );

      const selectButton = screen.getByText("Select");
      expect(selectButton).toHaveAttribute("data-disabled", "true");
    });

    it("disables selection for unavailable actions", () => {
      const onSelectAction = vi.fn();
      const action = createMockAction({
        id: "fire-weapon",
        name: "Fire Weapon",
        canPerform: false,
        blockers: ["No weapon equipped"],
      });

      render(
        <ActionSelector
          availableActions={[action]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={onSelectAction}
        />
      );

      // Button should have disabled styling (cursor-not-allowed class)
      const selectButton = screen.getByText("Select");
      expect(selectButton.className).toContain("cursor-not-allowed");
    });
  });

  describe("category filtering", () => {
    it("filters by category when category button clicked", () => {
      const combatAction = createMockAction({ id: "fire-weapon", name: "Fire Weapon", domain: "combat" });
      const magicAction = createMockAction({ id: "cast-spell", name: "Cast Spell", domain: "magic" });

      render(
        <ActionSelector
          availableActions={[combatAction, magicAction]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      // Initially both visible (All category is default)
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.getByText("Cast Spell")).toBeInTheDocument();

      // Click Combat filter - there are multiple "Combat" texts (category button and action label)
      // so we need to click the button specifically
      const combatButtons = screen.getAllByText("Combat");
      // The first one should be in the category filter section
      fireEvent.click(combatButtons[0]);

      // Only combat action visible
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.queryByText("Cast Spell")).not.toBeInTheDocument();
    });

    it("shows all categories when All clicked", () => {
      const combatAction = createMockAction({ id: "fire-weapon", name: "Fire Weapon", domain: "combat" });
      const magicAction = createMockAction({ id: "cast-spell", name: "Cast Spell", domain: "magic" });

      render(
        <ActionSelector
          availableActions={[combatAction, magicAction]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
          defaultCategory="combat"
        />
      );

      // Initially filtered to combat
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.queryByText("Cast Spell")).not.toBeInTheDocument();

      // Click All filter
      fireEvent.click(screen.getByText("All"));

      // Both visible
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.getByText("Cast Spell")).toBeInTheDocument();
    });
  });

  describe("search filtering", () => {
    it("filters actions by search query", () => {
      const actions = [
        createMockAction({ id: "fire-weapon", name: "Fire Weapon" }),
        createMockAction({ id: "melee-attack", name: "Melee Attack" }),
      ];

      render(
        <ActionSelector
          availableActions={actions}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      const searchInput = screen.getByPlaceholderText("Search actions...");
      fireEvent.change(searchInput, { target: { value: "Fire" } });

      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.queryByText("Melee Attack")).not.toBeInTheDocument();
    });

    it("clears search when X clicked", () => {
      const actions = [
        createMockAction({ id: "fire-weapon", name: "Fire Weapon" }),
        createMockAction({ id: "melee-attack", name: "Melee Attack" }),
      ];

      const { container } = render(
        <ActionSelector
          availableActions={actions}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      const searchInput = screen.getByPlaceholderText("Search actions...");
      fireEvent.change(searchInput, { target: { value: "Fire" } });

      // Only Fire Weapon should be visible after search
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.queryByText("Melee Attack")).not.toBeInTheDocument();

      // Find and click the clear button (the X button in the search field)
      // It's a button containing an X icon
      const searchContainer = container.querySelector(".relative");
      const clearButton = searchContainer?.querySelector("button");
      if (clearButton) {
        fireEvent.click(clearButton);
      }

      // Both should be visible again
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();
      expect(screen.getByText("Melee Attack")).toBeInTheDocument();
    });
  });

  describe("action expansion", () => {
    it("renders action with expand button", () => {
      const action = createMockAction({
        id: "fire-weapon",
        name: "Fire Weapon",
        description: "Fire your equipped ranged weapon at a target",
      });

      const { container } = render(
        <ActionSelector
          availableActions={[action]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      // Action should be rendered with name
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();

      // Should have expand/collapse buttons (ChevronRight icons)
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("renders action with blockers in unavailable state", () => {
      const action = createMockAction({
        id: "fire-weapon",
        name: "Fire Weapon",
        canPerform: false,
        blockers: ["No weapon equipped", "Not enough ammo"],
      });

      render(
        <ActionSelector
          availableActions={[action]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      // Action should be rendered but disabled
      expect(screen.getByText("Fire Weapon")).toBeInTheDocument();

      // Select button should have disabled styling
      const selectButton = screen.getByText("Select");
      expect(selectButton.className).toContain("cursor-not-allowed");
    });
  });

  describe("action type display", () => {
    it("shows action type badge", () => {
      const simpleAction = createMockAction({
        id: "simple-action",
        name: "Simple Action",
        cost: { actionType: "simple" },
      });
      const complexAction = createMockAction({
        id: "complex-action",
        name: "Complex Action",
        cost: { actionType: "complex" },
      });

      render(
        <ActionSelector
          availableActions={[simpleAction, complexAction]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
        />
      );

      expect(screen.getByText("Simple Actions (1)")).toBeInTheDocument();
      expect(screen.getByText("Complex Actions (1)")).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("renders in small size", () => {
      const { container } = render(
        <ActionSelector
          availableActions={[]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
          size="sm"
        />
      );

      expect(container.querySelector('[class*="text-xs"]')).toBeInTheDocument();
    });

    it("renders in large size", () => {
      const { container } = render(
        <ActionSelector
          availableActions={[]}
          actionsRemaining={defaultActionsRemaining}
          onSelectAction={() => {}}
          size="lg"
        />
      );

      expect(container.querySelector('[class*="text-base"]')).toBeInTheDocument();
    });
  });
});
