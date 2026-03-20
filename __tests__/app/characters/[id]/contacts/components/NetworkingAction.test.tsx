import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock react-aria-components
vi.mock("react-aria-components", () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
    type,
    ...props
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
    type?: string;
    className?: string;
  }) => (
    <button
      onClick={onPress}
      disabled={isDisabled}
      type={(type as "button") || "button"}
      {...props}
    >
      {children}
    </button>
  ),
  Label: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
    <label {...props}>{children}</label>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  TextField: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
    <div {...props}>{children}</div>
  ),
}));

vi.mock("lucide-react", () => ({
  Search: () => <svg data-testid="search-icon" />,
  DollarSign: () => <svg data-testid="dollar-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  CheckCircle: () => <svg data-testid="check-icon" />,
  XCircle: () => <svg data-testid="x-icon" />,
  Dice5: () => <svg data-testid="dice-icon" />,
  PenLine: () => <svg data-testid="pen-icon" />,
}));

vi.mock("@/lib/themes", () => ({
  THEMES: {
    "neon-rain": {
      id: "neon-rain",
      colors: {
        background: "",
        card: "",
        border: "",
        accent: "text-emerald-400",
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

// Capture the onRoll prop from DiceRoller
let capturedOnRoll: ((result: { hits: number }) => void) | undefined;
let capturedInitialPool: number | undefined;
let capturedContextLabel: string | undefined;

vi.mock("@/components/DiceRoller", () => ({
  DiceRoller: ({
    onRoll,
    initialPool,
    contextLabel,
  }: {
    onRoll?: (result: { hits: number }) => void;
    initialPool?: number;
    contextLabel?: string;
    compact?: boolean;
    showHistory?: boolean;
    label?: string;
  }) => {
    capturedOnRoll = onRoll;
    capturedInitialPool = initialPool;
    capturedContextLabel = contextLabel;
    return (
      <div data-testid="dice-roller">
        <span data-testid="dice-pool">{initialPool}</span>
        <span data-testid="dice-context">{contextLabel}</span>
        <button
          data-testid="mock-roll-button"
          onClick={() => onRoll?.({ hits: 3 } as { hits: number })}
        >
          Roll
        </button>
      </div>
    );
  },
}));

import { NetworkingAction } from "@/app/characters/[id]/contacts/components/NetworkingAction";

describe("NetworkingAction - dice roller integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnRoll = undefined;
    capturedInitialPool = undefined;
    capturedContextLabel = undefined;
  });

  const defaultProps = {
    characterId: "test-char-1",
    archetypes: [],
    characterNuyen: 5000,
  };

  describe("mode toggle", () => {
    it("renders in Roll mode by default showing DiceRoller", () => {
      render(<NetworkingAction {...defaultProps} />);

      expect(screen.getByTestId("dice-roller")).toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/enter your hits/i)).not.toBeInTheDocument();
    });

    it("switches to Manual mode showing number input", async () => {
      const user = userEvent.setup();
      render(<NetworkingAction {...defaultProps} />);

      const manualButton = screen.getByRole("button", { name: /manual/i });
      await user.click(manualButton);

      expect(screen.queryByTestId("dice-roller")).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your hits/i)).toBeInTheDocument();
    });

    it("switches back to Roll mode from Manual", async () => {
      const user = userEvent.setup();
      render(<NetworkingAction {...defaultProps} />);

      const manualButton = screen.getByRole("button", { name: /manual/i });
      await user.click(manualButton);

      const rollButton = screen.getByRole("button", { name: /roll/i });
      await user.click(rollButton);

      expect(screen.getByTestId("dice-roller")).toBeInTheDocument();
    });
  });

  describe("dice pool calculation from character stats", () => {
    it("calculates pool from charisma + etiquette", () => {
      render(
        <NetworkingAction
          {...defaultProps}
          characterAttributes={{ charisma: 5, body: 3, agility: 4 }}
          characterSkills={{ etiquette: 4, sneaking: 3 }}
        />
      );

      expect(capturedInitialPool).toBe(9); // 5 + 4
      expect(capturedContextLabel).toBe("Charisma 5 + Etiquette 4");
    });

    it("uses negotiation when higher than etiquette", () => {
      render(
        <NetworkingAction
          {...defaultProps}
          characterAttributes={{ charisma: 4 }}
          characterSkills={{ etiquette: 2, negotiation: 5 }}
        />
      );

      expect(capturedInitialPool).toBe(9); // 4 + 5
      expect(capturedContextLabel).toBe("Charisma 4 + Negotiation 5");
    });

    it("falls back to short attribute code 'cha'", () => {
      render(
        <NetworkingAction
          {...defaultProps}
          characterAttributes={{ cha: 6 }}
          characterSkills={{ etiquette: 3 }}
        />
      );

      expect(capturedInitialPool).toBe(9); // 6 + 3
      expect(capturedContextLabel).toBe("Charisma 6 + Etiquette 3");
    });

    it("defaults to pool of 6 when no stats provided", () => {
      render(<NetworkingAction {...defaultProps} />);

      expect(capturedInitialPool).toBe(6);
      expect(capturedContextLabel).toBe("Networking");
    });

    it("uses charisma-only pool when no social skills", () => {
      render(
        <NetworkingAction
          {...defaultProps}
          characterAttributes={{ charisma: 4 }}
          characterSkills={{ sneaking: 5 }}
        />
      );

      // hasStats is true (charisma > 0), pool = 4 + 0 = 4
      expect(capturedInitialPool).toBe(4);
      expect(capturedContextLabel).toContain("Charisma 4");
    });
  });

  describe("dice roll populates hits", () => {
    it("sets hits from DiceRoller onRoll callback", async () => {
      const user = userEvent.setup();
      render(<NetworkingAction {...defaultProps} />);

      // Click the mock roll button which fires onRoll with 3 hits
      const rollBtn = screen.getByTestId("mock-roll-button");
      await user.click(rollBtn);

      // The "Using X hits" text should appear
      expect(screen.getByText(/3 hits/)).toBeInTheDocument();
    });
  });

  describe("manual mode input", () => {
    it("allows entering hits manually", async () => {
      const user = userEvent.setup();
      render(<NetworkingAction {...defaultProps} />);

      // Switch to manual
      const manualButton = screen.getByRole("button", { name: /manual/i });
      await user.click(manualButton);

      const input = screen.getByPlaceholderText(/enter your hits/i);
      await user.clear(input);
      await user.type(input, "5");

      expect(input).toHaveValue(5);
    });
  });
});
