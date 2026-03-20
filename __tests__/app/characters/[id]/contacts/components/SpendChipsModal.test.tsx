import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SocialContact } from "@/lib/types";

vi.mock("react-aria-components", () => ({
  ModalOverlay: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
    isOpen ? <div data-testid="modal-overlay">{children}</div> : null,
  Modal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Dialog: ({
    children,
  }: {
    children: ((opts: { close: () => void }) => React.ReactNode) | React.ReactNode;
  }) =>
    typeof children === "function" ? (
      <div>{children({ close: vi.fn() })}</div>
    ) : (
      <div>{children}</div>
    ),
  Button: ({
    children,
    onPress,
    isDisabled,
    ...props
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
    className?: string;
  }) => (
    <button onClick={onPress} disabled={isDisabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("lucide-react", () => ({}));

vi.mock("@/lib/themes", () => ({
  THEMES: {
    "neon-rain": {
      id: "neon-rain",
      colors: {
        background: "",
        card: "",
        border: "",
        accent: "",
        accentBg: "",
        muted: "",
        heading: "",
      },
      fonts: { heading: "", body: "", mono: "" },
      components: {
        section: { wrapper: "", header: "", title: "", cornerAccent: false },
        card: { wrapper: "", hover: "", border: "" },
        badge: { positive: "", negative: "", neutral: "" },
      },
    },
  },
  DEFAULT_THEME: "neon-rain",
}));

vi.mock("@/lib/rules/chips", () => ({
  calculateChipDiceBonus: (chips: number) => Math.min(chips, 4),
  calculateLoyaltyImprovementCost: (current: number, target: number) =>
    target > 6
      ? {
          valid: false,
          chipsRequired: 0,
          downtimeWeeks: 0,
          reason: "Target loyalty (7) exceeds maximum loyalty (6)",
        }
      : target !== current + 1
        ? {
            valid: false,
            chipsRequired: 0,
            downtimeWeeks: 0,
            reason: "Loyalty can only be improved one level at a time",
          }
        : { valid: true, chipsRequired: target, downtimeWeeks: target },
}));

vi.mock("@/lib/rules/relationship-qualities", () => ({
  getChipCostModifier: (cost: number) => ({
    adjustedCost: cost,
    reason: "No quality modifier",
  }),
}));

const makeContact = (overrides = {}): SocialContact => ({
  id: "cnt-test",
  characterId: "char-1",
  name: "Danny Ortega",
  connection: 4,
  loyalty: 3,
  archetype: "Fixer",
  status: "active",
  favorBalance: 3,
  group: "personal",
  visibility: {
    playerVisible: true,
    showConnection: true,
    showLoyalty: true,
    showFavorBalance: true,
    showSpecializations: true,
  },
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

import { SpendChipsModal } from "@/app/characters/[id]/contacts/components/SpendChipsModal";

const renderModal = (
  props: Partial<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
      action: "dice-bonus" | "loyalty-improvement";
      chipsToSpend?: number;
      targetLoyalty?: number;
      notes?: string;
    }) => Promise<void>;
    contact: SocialContact;
  }> = {}
) => {
  const defaults = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue(undefined),
    contact: makeContact(),
  };

  const mergedProps = { ...defaults, ...props };

  return render(<SpendChipsModal {...mergedProps} />);
};

describe("SpendChipsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("visibility", () => {
    it("renders modal title with contact name when open", async () => {
      await renderModal({ isOpen: true, contact: makeContact() });

      expect(screen.getByText(/Danny Ortega/i)).toBeInTheDocument();
    });

    it("does NOT render when isOpen is false", async () => {
      await renderModal({ isOpen: false });

      expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
    });

    it("shows Available chips matching contact favorBalance", async () => {
      await renderModal({ contact: makeContact({ favorBalance: 5 }) });

      // "Available chips:" label and "5" value are in separate elements
      expect(screen.getByText(/available chips/i)).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  describe("dice bonus mode", () => {
    it("shows 4 chip selector buttons", async () => {
      await renderModal({ contact: makeContact({ favorBalance: 4 }) });

      // The modal should default to dice-bonus mode or allow switching to it.
      // Look for buttons representing chip amounts 1–4.
      const chipButtons = screen
        .getAllByRole("button")
        .filter((btn) => /^[1-4]$/.test(btn.textContent?.trim() ?? ""));

      expect(chipButtons).toHaveLength(4);
    });

    it("disables chip buttons above the favor balance", async () => {
      await renderModal({ contact: makeContact({ favorBalance: 2 }) });

      const btn3 = screen.getAllByRole("button").find((btn) => btn.textContent?.trim() === "3");
      const btn4 = screen.getAllByRole("button").find((btn) => btn.textContent?.trim() === "4");

      expect(btn3).toBeDisabled();
      expect(btn4).toBeDisabled();
    });

    it("shows dice result text reflecting selected chips", async () => {
      const user = userEvent.setup();
      await renderModal({ contact: makeContact({ favorBalance: 3 }) });

      const btn2 = screen.getByRole("button", { name: "2" });
      await user.click(btn2);

      expect(screen.getByText(/\+\d+ dice.*negotiation|\d+ dice.*roll/i)).toBeInTheDocument();
    });
  });

  describe("loyalty improvement mode", () => {
    it("shows cost breakdown with chips required and downtime weeks", async () => {
      const user = userEvent.setup();
      await renderModal({ contact: makeContact({ loyalty: 3 }) });

      // Switch to loyalty improvement mode
      const loyaltyTab = screen.getByRole("button", {
        name: /improve loyalty/i,
      });
      await user.click(loyaltyTab);

      expect(screen.getByText(/chips required|cost/i)).toBeInTheDocument();
      expect(screen.getByText(/downtime|week/i)).toBeInTheDocument();
    });

    it("shows error when loyalty is already at maximum (6)", async () => {
      const user = userEvent.setup();
      await renderModal({ contact: makeContact({ loyalty: 6 }) });

      // Switch to loyalty improvement mode
      const loyaltyTab = screen.getByRole("button", {
        name: /improve loyalty/i,
      });
      await user.click(loyaltyTab);

      expect(screen.getByText(/already.*max|maximum loyalty|loyalty.*6/i)).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with correct data for dice bonus", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      await renderModal({
        onSubmit,
        contact: makeContact({ favorBalance: 3 }),
      });

      // Select 2 chips
      const btn2 = screen.getByRole("button", { name: "2" });
      await user.click(btn2);

      const submitButton = screen.getByRole("button", {
        name: /spend|confirm|submit/i,
      });
      await user.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "dice-bonus",
          chipsToSpend: 2,
        })
      );
    });

    it("calls onSubmit with correct data for loyalty improvement", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      await renderModal({
        onSubmit,
        contact: makeContact({ loyalty: 3, favorBalance: 10 }),
      });

      // Switch to loyalty improvement mode
      const loyaltyTab = screen.getByRole("button", {
        name: /improve loyalty/i,
      });
      await user.click(loyaltyTab);

      // Submit button says "Improve Loyalty" in this mode
      const submitButtons = screen.getAllByRole("button", { name: /improve loyalty/i });
      // The last one is the submit button (first is the mode toggle)
      await user.click(submitButtons[submitButtons.length - 1]);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "loyalty-improvement",
          targetLoyalty: 4,
        })
      );
    });

    it("calls onClose when Cancel is pressed", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      await renderModal({ onClose });

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalledOnce();
    });
  });
});
