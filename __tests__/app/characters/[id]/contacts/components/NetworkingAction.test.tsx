import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
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
        border: "border-border",
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

// Mock dice engine to return predictable results
vi.mock("@/lib/rules/action-resolution/dice-engine", () => ({
  executeRoll: vi.fn().mockReturnValue({
    dice: [
      { value: 6, isHit: true, isOne: false },
      { value: 5, isHit: true, isOne: false },
      { value: 3, isHit: false, isOne: false },
      { value: 1, isHit: false, isOne: true },
    ],
    hits: 2,
    rawHits: 2,
    ones: 1,
    isGlitch: false,
    isCriticalGlitch: false,
    limitApplied: false,
    limitExceeded: false,
    limitEnforcement: "on" as const,
    poolSize: 4,
  }),
}));

import { NetworkingAction } from "@/app/characters/[id]/contacts/components/NetworkingAction";

describe("NetworkingAction - dice roller integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultProps = {
    characterId: "test-char-1",
    archetypes: [],
    characterNuyen: 5000,
  };

  describe("mode toggle", () => {
    it("renders in Roll mode by default showing dice roller", () => {
      render(<NetworkingAction {...defaultProps} />);

      // Roll mode shows the roll button
      expect(screen.getByRole("button", { name: /roll 6d6/i })).toBeInTheDocument();
      // Manual input should not be visible
      expect(screen.queryByPlaceholderText(/enter your hits/i)).not.toBeInTheDocument();
    });

    it("switches to Manual mode showing number input", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<NetworkingAction {...defaultProps} />);

      const manualButton = screen.getByRole("button", { name: /manual/i });
      await user.click(manualButton);

      expect(screen.getByPlaceholderText(/enter your hits/i)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /roll \d+d6/i })).not.toBeInTheDocument();
    });

    it("switches back to Roll mode from Manual", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<NetworkingAction {...defaultProps} />);

      // Go to manual
      await user.click(screen.getByRole("button", { name: /manual/i }));
      expect(screen.getByPlaceholderText(/enter your hits/i)).toBeInTheDocument();

      // Back to roll
      await user.click(screen.getByRole("button", { name: /^roll$/i }));
      expect(screen.getByRole("button", { name: /roll \d+d6/i })).toBeInTheDocument();
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

      // Pool = 5 + 4 = 9
      expect(screen.getByRole("button", { name: /roll 9d6/i })).toBeInTheDocument();
      expect(screen.getByText(/charisma 5 \+ etiquette 4/i)).toBeInTheDocument();
    });

    it("uses negotiation when higher than etiquette", () => {
      render(
        <NetworkingAction
          {...defaultProps}
          characterAttributes={{ charisma: 4 }}
          characterSkills={{ etiquette: 2, negotiation: 5 }}
        />
      );

      // Pool = 4 + 5 = 9
      expect(screen.getByRole("button", { name: /roll 9d6/i })).toBeInTheDocument();
      expect(screen.getByText(/charisma 4 \+ negotiation 5/i)).toBeInTheDocument();
    });

    it("falls back to short attribute code 'cha'", () => {
      render(
        <NetworkingAction
          {...defaultProps}
          characterAttributes={{ cha: 6 }}
          characterSkills={{ etiquette: 3 }}
        />
      );

      // Pool = 6 + 3 = 9
      expect(screen.getByRole("button", { name: /roll 9d6/i })).toBeInTheDocument();
    });

    it("defaults to pool of 6 when no stats provided", () => {
      render(<NetworkingAction {...defaultProps} />);

      expect(screen.getByRole("button", { name: /roll 6d6/i })).toBeInTheDocument();
      // The pool label shows "(Networking)" when no stats
      expect(screen.getByText("(Networking)")).toBeInTheDocument();
    });

    it("uses charisma-only pool when no social skills", () => {
      render(
        <NetworkingAction
          {...defaultProps}
          characterAttributes={{ charisma: 4 }}
          characterSkills={{ sneaking: 5 }}
        />
      );

      // Pool = 4 + 0 = 4
      expect(screen.getByRole("button", { name: /roll 4d6/i })).toBeInTheDocument();
    });
  });

  describe("dice rolling", () => {
    it("shows dice results after rolling", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<NetworkingAction {...defaultProps} />);

      const rollButton = screen.getByRole("button", { name: /roll 6d6/i });
      await user.click(rollButton);

      // Advance past the setTimeout delay inside act
      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      // Should show hit count from mocked executeRoll (2 hits)
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("hits")).toBeInTheDocument();
    });
  });

  describe("manual mode input", () => {
    it("allows entering hits manually", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<NetworkingAction {...defaultProps} />);

      // Switch to manual
      await user.click(screen.getByRole("button", { name: /manual/i }));

      const input = screen.getByPlaceholderText(/enter your hits/i);
      await user.clear(input);
      await user.type(input, "5");

      expect(input).toHaveValue(5);
    });
  });
});
