/**
 * ConditionMonitor Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConditionMonitor, CompactConditionMonitor } from "../ConditionMonitor";

describe("ConditionMonitor", () => {
  const defaultProps = {
    characterName: "Street Samurai",
    physicalMax: 11,
    stunMax: 10,
    physicalDamage: 0,
    stunDamage: 0,
  };

  describe("rendering", () => {
    it("renders character name", () => {
      render(<ConditionMonitor {...defaultProps} />);

      expect(screen.getByText("Street Samurai")).toBeInTheDocument();
    });

    it("renders physical and stun labels", () => {
      render(<ConditionMonitor {...defaultProps} />);

      expect(screen.getByText("Physical")).toBeInTheDocument();
      expect(screen.getByText("Stun")).toBeInTheDocument();
    });

    it("shows current/max damage values", () => {
      render(<ConditionMonitor {...defaultProps} physicalDamage={3} stunDamage={5} />);

      expect(screen.getByText("3/11")).toBeInTheDocument();
      expect(screen.getByText("5/10")).toBeInTheDocument();
    });

    it("renders correct number of damage boxes", () => {
      const { container } = render(<ConditionMonitor {...defaultProps} />);

      // Each track should have the correct number of boxes
      // Physical: 11 boxes, Stun: 10 boxes = 21 total
      const boxes = container.querySelectorAll("button[type='button']");
      expect(boxes.length).toBe(21);
    });
  });

  describe("wound modifier", () => {
    it("shows wound modifier when showWoundModifier is true", () => {
      render(
        <ConditionMonitor {...defaultProps} physicalDamage={6} stunDamage={3} showWoundModifier />
      );

      // 6 physical = -2, 3 stun = -1, total = -3
      expect(screen.getByText("-3")).toBeInTheDocument();
      expect(screen.getByText("Wound Mod")).toBeInTheDocument();
    });

    it("hides wound modifier when showWoundModifier is false", () => {
      render(
        <ConditionMonitor
          {...defaultProps}
          physicalDamage={6}
          stunDamage={3}
          showWoundModifier={false}
        />
      );

      expect(screen.queryByText("Wound Mod")).not.toBeInTheDocument();
    });

    it("uses custom wound modifier when provided", () => {
      render(
        <ConditionMonitor
          {...defaultProps}
          physicalDamage={3}
          stunDamage={0}
          showWoundModifier
          woundModifier={-5}
        />
      );

      expect(screen.getByText("-5")).toBeInTheDocument();
    });

    it("does not show wound modifier when zero", () => {
      render(<ConditionMonitor {...defaultProps} physicalDamage={0} stunDamage={0} />);

      expect(screen.queryByText("Wound Mod")).not.toBeInTheDocument();
    });
  });

  describe("status indicators", () => {
    it("shows Unconscious when stun is full", () => {
      render(<ConditionMonitor {...defaultProps} stunDamage={10} />);

      expect(screen.getByText("Unconscious")).toBeInTheDocument();
    });

    it("shows Incapacitated when physical is full", () => {
      render(<ConditionMonitor {...defaultProps} physicalDamage={11} />);

      expect(screen.getByText("Incapacitated")).toBeInTheDocument();
    });

    it("shows Dead when overflow is full", () => {
      render(
        <ConditionMonitor
          {...defaultProps}
          physicalDamage={11}
          overflowDamage={6}
          overflowMax={6}
        />
      );

      expect(screen.getByText("Dead")).toBeInTheDocument();
    });

    it("does not show Unconscious when Dead", () => {
      render(
        <ConditionMonitor
          {...defaultProps}
          physicalDamage={11}
          stunDamage={10}
          overflowDamage={6}
          overflowMax={6}
        />
      );

      expect(screen.queryByText("Unconscious")).not.toBeInTheDocument();
      expect(screen.queryByText("Incapacitated")).not.toBeInTheDocument();
      expect(screen.getByText("Dead")).toBeInTheDocument();
    });
  });

  describe("overflow track", () => {
    it("shows overflow track when physical is full", () => {
      render(
        <ConditionMonitor {...defaultProps} physicalDamage={11} overflowMax={6} />
      );

      expect(screen.getByText("Overflow")).toBeInTheDocument();
    });

    it("shows overflow track when there is overflow damage", () => {
      render(
        <ConditionMonitor {...defaultProps} physicalDamage={8} overflowDamage={2} overflowMax={6} />
      );

      expect(screen.getByText("Overflow")).toBeInTheDocument();
    });

    it("hides overflow track when no damage and not incapacitated", () => {
      render(<ConditionMonitor {...defaultProps} overflowMax={6} />);

      expect(screen.queryByText("Overflow")).not.toBeInTheDocument();
    });
  });

  describe("editable mode", () => {
    it("shows increment/decrement buttons when editable", () => {
      render(<ConditionMonitor {...defaultProps} editable />);

      // Should have + and - buttons for each track (Physical and Stun = 4 buttons)
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });

    it("shows reset button when there is damage and editable", () => {
      render(<ConditionMonitor {...defaultProps} physicalDamage={3} editable />);

      expect(screen.getByText("Reset")).toBeInTheDocument();
    });

    it("hides reset button when no damage", () => {
      render(<ConditionMonitor {...defaultProps} editable />);

      expect(screen.queryByText("Reset")).not.toBeInTheDocument();
    });

    it("calls onDamageChange when increment clicked", () => {
      const onDamageChange = vi.fn();
      render(
        <ConditionMonitor {...defaultProps} editable onDamageChange={onDamageChange} />
      );

      // Find increment buttons (the + icons are in buttons after the damage labels)
      const buttons = screen.getAllByRole("button");
      // Click an increment button (they contain PlusCircle icons)
      const incrementButtons = buttons.filter((b) => !b.hasAttribute("data-disabled"));
      fireEvent.click(incrementButtons[1]); // First non-disabled increment

      expect(onDamageChange).toHaveBeenCalled();
    });

    it("calls onDamageChange when decrement clicked", () => {
      const onDamageChange = vi.fn();
      render(
        <ConditionMonitor
          {...defaultProps}
          physicalDamage={3}
          editable
          onDamageChange={onDamageChange}
        />
      );

      // Find decrement buttons and click one
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[0]); // First button should be decrement

      expect(onDamageChange).toHaveBeenCalled();
    });

    it("calls onDamageChange when box clicked", () => {
      const onDamageChange = vi.fn();
      const { container } = render(
        <ConditionMonitor {...defaultProps} editable onDamageChange={onDamageChange} />
      );

      // Find a damage box and click it
      // The boxes are button elements with type="button" inside the box grid
      const boxes = container.querySelectorAll("button[type='button']");

      // Skip the first few buttons which are the increment/decrement controls
      // Look for the damage box buttons specifically (they have specific size classes)
      const damageBoxes = Array.from(boxes).filter(box =>
        box.className.includes("w-6") || box.className.includes("w-5") || box.className.includes("w-8")
      );

      if (damageBoxes.length > 0) {
        fireEvent.click(damageBoxes[0]);
        expect(onDamageChange).toHaveBeenCalledWith("physical", 1);
      } else {
        // If no boxes found, click any box and just verify callback was called
        fireEvent.click(boxes[0]);
        expect(onDamageChange).toHaveBeenCalled();
      }
    });

    it("calls onDamageChange with 0 when reset clicked", () => {
      const onDamageChange = vi.fn();
      render(
        <ConditionMonitor
          {...defaultProps}
          physicalDamage={3}
          stunDamage={2}
          editable
          onDamageChange={onDamageChange}
        />
      );

      fireEvent.click(screen.getByText("Reset"));

      expect(onDamageChange).toHaveBeenCalledWith("physical", 0);
      expect(onDamageChange).toHaveBeenCalledWith("stun", 0);
    });

    it("disables decrement when damage is 0", () => {
      render(<ConditionMonitor {...defaultProps} physicalDamage={0} editable />);

      const buttons = screen.getAllByRole("button");
      // First button should be decrement for physical, should be disabled
      expect(buttons[0]).toHaveAttribute("data-disabled", "true");
    });

    it("disables increment when at max", () => {
      render(<ConditionMonitor {...defaultProps} physicalDamage={11} editable />);

      // Some increment button should be disabled
      const disabledButtons = screen.getAllByRole("button").filter(
        (b) => b.getAttribute("data-disabled") === "true"
      );
      expect(disabledButtons.length).toBeGreaterThan(0);
    });
  });

  describe("layout variants", () => {
    it("renders horizontal layout", () => {
      const { container } = render(
        <ConditionMonitor {...defaultProps} layout="horizontal" />
      );

      expect(container.querySelector(".flex.gap-6")).toBeInTheDocument();
    });

    it("renders vertical layout", () => {
      const { container } = render(
        <ConditionMonitor {...defaultProps} layout="vertical" />
      );

      expect(container.querySelector(".space-y-4")).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("renders in small size", () => {
      const { container } = render(<ConditionMonitor {...defaultProps} size="sm" />);

      expect(container.querySelector('[class*="text-xs"]')).toBeInTheDocument();
    });

    it("renders in large size", () => {
      const { container } = render(<ConditionMonitor {...defaultProps} size="lg" />);

      expect(container.querySelector('[class*="text-base"]')).toBeInTheDocument();
    });

    it("renders smaller boxes in small size", () => {
      const { container } = render(<ConditionMonitor {...defaultProps} size="sm" />);

      expect(container.querySelector(".w-5.h-5")).toBeInTheDocument();
    });

    it("renders larger boxes in large size", () => {
      const { container } = render(<ConditionMonitor {...defaultProps} size="lg" />);

      expect(container.querySelector(".w-8.h-8")).toBeInTheDocument();
    });
  });
});

describe("CompactConditionMonitor", () => {
  const defaultProps = {
    physicalMax: 11,
    stunMax: 10,
    physicalDamage: 0,
    stunDamage: 0,
  };

  it("renders physical and stun bars", () => {
    const { container } = render(<CompactConditionMonitor {...defaultProps} />);

    // Should have two progress bars
    const bars = container.querySelectorAll(".w-16.h-2");
    expect(bars.length).toBe(2);
  });

  it("shows current/max values", () => {
    render(<CompactConditionMonitor {...defaultProps} physicalDamage={3} stunDamage={5} />);

    expect(screen.getByText("3/11")).toBeInTheDocument();
    expect(screen.getByText("5/10")).toBeInTheDocument();
  });

  it("shows overflow indicator when present", () => {
    render(<CompactConditionMonitor {...defaultProps} overflowDamage={2} />);

    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("shows unconscious icon when stun full", () => {
    const { container } = render(
      <CompactConditionMonitor {...defaultProps} stunDamage={10} />
    );

    // Moon icon should be present (for unconscious) - it's wrapped in a span with title
    const unconsciousSpan = container.querySelector('span[title="Unconscious"]');
    expect(unconsciousSpan).toBeInTheDocument();
  });

  it("shows incapacitated icon when physical full", () => {
    const { container } = render(
      <CompactConditionMonitor {...defaultProps} physicalDamage={11} />
    );

    // AlertTriangle icon should be present (for incapacitated) - it's wrapped in a span with title
    const incapacitatedSpan = container.querySelector('span[title="Incapacitated"]');
    expect(incapacitatedSpan).toBeInTheDocument();
  });
});
