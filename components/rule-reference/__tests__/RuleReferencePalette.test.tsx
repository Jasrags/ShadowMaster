/**
 * Tests for RuleReferencePalette component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RuleReferencePalette } from "../RuleReferencePalette";

const mockClose = vi.fn();

vi.mock("@/lib/contexts/RuleReferenceContext", () => ({
  useRuleReferenceContext: vi.fn(() => ({
    isOpen: true,
    close: mockClose,
    defaultCategory: null,
  })),
}));

vi.mock("react-aria-components", () => ({
  Dialog: ({ children }: { children: (props: { close: () => void }) => React.ReactNode }) => (
    <div data-testid="dialog">{children({ close: mockClose })}</div>
  ),
  Modal: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="modal" className={className}>
      {children}
    </div>
  ),
  ModalOverlay: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
    isDismissable?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
  }) => (isOpen ? <div data-testid="overlay">{children}</div> : null),
  Heading: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

describe("RuleReferencePalette", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            version: "1.0.0",
            editionCode: "sr5",
            entries: [
              {
                id: "test-entry",
                title: "Test Entry",
                category: "combat",
                tags: ["test"],
                summary: "A test entry",
                tables: [],
                source: { book: "SR5", page: 1 },
              },
            ],
          },
        }),
    });
  });

  it("should render the palette when open", () => {
    render(<RuleReferencePalette />);
    expect(screen.getByText("Rule Quick-Reference")).toBeInTheDocument();
  });

  it("should render search input", () => {
    render(<RuleReferencePalette />);
    expect(screen.getByLabelText("Search rule references")).toBeInTheDocument();
  });

  it("should render the All category tab", () => {
    render(<RuleReferencePalette />);
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("should not render when closed", async () => {
    const { useRuleReferenceContext } = await import("@/lib/contexts/RuleReferenceContext");
    vi.mocked(useRuleReferenceContext).mockReturnValue({
      isOpen: false,
      close: mockClose,
      open: vi.fn(),
      defaultCategory: null,
    });

    const { container } = render(<RuleReferencePalette />);
    expect(container.innerHTML).toBe("");
  });
});
