import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EdgeActionSelector } from "../EdgeActionSelector";

// Mock react-aria-components
vi.mock("react-aria-components", () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
    className?: string;
  }) => (
    <button onClick={onPress} disabled={isDisabled} className={className} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Zap: ({ className }: { className?: string }) => (
    <span data-testid="zap-icon" className={className} />
  ),
}));

describe("EdgeActionSelector", () => {
  const defaultProps = {
    selectedAction: null as import("@/lib/types").EdgeActionType | null,
    onSelect: vi.fn(),
    currentEdge: 3,
    maxEdge: 6,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("pre-roll timing", () => {
    it("renders Push the Limit and Blitz buttons", () => {
      render(<EdgeActionSelector {...defaultProps} timing="pre-roll" />);

      expect(screen.getByText("Push the Limit")).toBeDefined();
      expect(screen.getByText("Blitz")).toBeDefined();
    });

    it("toggles selection on click", () => {
      render(<EdgeActionSelector {...defaultProps} timing="pre-roll" />);

      fireEvent.click(screen.getByText("Push the Limit"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith("push-the-limit");
    });

    it("deselects when clicking selected action", () => {
      render(
        <EdgeActionSelector {...defaultProps} timing="pre-roll" selectedAction="push-the-limit" />
      );

      fireEvent.click(screen.getByText("Push the Limit"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith(null);
    });

    it("shows description when action is selected", () => {
      render(
        <EdgeActionSelector {...defaultProps} timing="pre-roll" selectedAction="push-the-limit" />
      );

      expect(screen.getByText("Add Edge to pool, no limit, exploding 6s")).toBeDefined();
    });
  });

  describe("post-roll timing", () => {
    it("renders Second Chance button", () => {
      render(<EdgeActionSelector {...defaultProps} timing="post-roll" />);

      expect(screen.getByText("Second Chance")).toBeDefined();
    });

    it("hides Close Call when hasGlitch is false", () => {
      render(<EdgeActionSelector {...defaultProps} timing="post-roll" hasGlitch={false} />);

      expect(screen.queryByText("Close Call")).toBeNull();
    });

    it("shows Close Call when hasGlitch is true", () => {
      render(<EdgeActionSelector {...defaultProps} timing="post-roll" hasGlitch={true} />);

      expect(screen.getByText("Close Call")).toBeDefined();
    });

    it("disables Second Chance when hasRerolled is true", () => {
      render(<EdgeActionSelector {...defaultProps} timing="post-roll" hasRerolled={true} />);

      const button = screen.getByText("Second Chance").closest("button");
      expect(button?.disabled).toBe(true);
    });
  });

  describe("non-roll timing", () => {
    it("renders Seize Initiative and Dead Man's Trigger buttons", () => {
      render(<EdgeActionSelector {...defaultProps} timing="non-roll" />);

      expect(screen.getByText("Seize Initiative")).toBeDefined();
      expect(screen.getByText("Dead Man's Trigger")).toBeDefined();
    });

    it("fires onSelect immediately (no toggle) for non-roll actions", () => {
      render(<EdgeActionSelector {...defaultProps} timing="non-roll" />);

      fireEvent.click(screen.getByText("Seize Initiative"));
      expect(defaultProps.onSelect).toHaveBeenCalledWith("seize-the-initiative");
    });
  });

  describe("Edge exhaustion", () => {
    it("disables all buttons when currentEdge is 0", () => {
      render(<EdgeActionSelector {...defaultProps} timing="pre-roll" currentEdge={0} />);

      const pushButton = screen.getByText("Push the Limit").closest("button");
      const blitzButton = screen.getByText("Blitz").closest("button");
      expect(pushButton?.disabled).toBe(true);
      expect(blitzButton?.disabled).toBe(true);
    });
  });

  describe("disabled state", () => {
    it("disables all buttons when isDisabled is true", () => {
      render(<EdgeActionSelector {...defaultProps} timing="pre-roll" isDisabled={true} />);

      const pushButton = screen.getByText("Push the Limit").closest("button");
      const blitzButton = screen.getByText("Blitz").closest("button");
      expect(pushButton?.disabled).toBe(true);
      expect(blitzButton?.disabled).toBe(true);
    });
  });

  describe("Edge display", () => {
    it("shows current/max Edge in header", () => {
      render(<EdgeActionSelector {...defaultProps} timing="pre-roll" />);

      expect(screen.getByText("Edge Actions (3/6)")).toBeDefined();
    });
  });

  describe("returns null when no visible actions", () => {
    it("returns null for post-roll without glitch (only Second Chance visible)", () => {
      // Second Chance is always visible, so this should render
      render(<EdgeActionSelector {...defaultProps} timing="post-roll" hasGlitch={false} />);

      // Should still render Second Chance
      expect(screen.getByText("Second Chance")).toBeDefined();
    });
  });

  describe("disabledActionIds (GM house rule)", () => {
    it("hides pre-roll actions listed in disabledActionIds", () => {
      render(
        <EdgeActionSelector
          {...defaultProps}
          timing="pre-roll"
          disabledActionIds={["push-the-limit"]}
        />
      );

      expect(screen.queryByText("Push the Limit")).toBeNull();
      expect(screen.getByText("Blitz")).toBeDefined();
    });

    it("hides non-roll actions listed in disabledActionIds", () => {
      render(
        <EdgeActionSelector
          {...defaultProps}
          timing="non-roll"
          disabledActionIds={["seize-the-initiative"]}
        />
      );

      expect(screen.queryByText("Seize Initiative")).toBeNull();
      expect(screen.getByText("Dead Man's Trigger")).toBeDefined();
    });

    it("returns null when every action for the timing is disabled", () => {
      const { container } = render(
        <EdgeActionSelector
          {...defaultProps}
          timing="pre-roll"
          disabledActionIds={["push-the-limit", "blitz"]}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
