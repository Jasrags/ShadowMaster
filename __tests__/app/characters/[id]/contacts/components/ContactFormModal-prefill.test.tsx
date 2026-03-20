import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { SocialContact } from "@/lib/types";

vi.mock("react-aria-components", () => ({
  ModalOverlay: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    isDismissable?: boolean;
    className?: string | ((state: unknown) => string);
  }) => (isOpen ? <div data-testid="modal-overlay">{children}</div> : null),
  Modal: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string | ((state: unknown) => string);
  }) =>
    typeof children === "function" ? (
      <div>
        {(children as (opts: unknown) => React.ReactNode)({ isEntering: false, isExiting: false })}
      </div>
    ) : (
      <div>{children}</div>
    ),
  Dialog: ({
    children,
  }: {
    children: ((opts: { close: () => void }) => React.ReactNode) | React.ReactNode;
    className?: string;
  }) =>
    typeof children === "function" ? (
      <div>{children({ close: vi.fn() })}</div>
    ) : (
      <div>{children}</div>
    ),
  Heading: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    slot?: string;
    className?: string;
  }) => <h2 {...props}>{children}</h2>,
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
    type?: "button" | "submit" | "reset";
    className?: string;
  }) => (
    <button onClick={onPress} disabled={isDisabled} type={type || "button"} {...props}>
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
  TextArea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

vi.mock("lucide-react", () => ({
  X: () => <svg data-testid="x-icon" />,
}));

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

vi.mock("@/lib/rules/group-contacts", () => ({
  getOrganizationDefinitions: () => [],
}));

import { ContactFormModal } from "@/app/characters/[id]/contacts/components/ContactFormModal";

describe("ContactFormModal - prefillContact", () => {
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    onSubmit.mockResolvedValue(undefined);
  });

  const defaultProps = {
    isOpen: true,
    onClose,
    onSubmit,
    archetypes: [],
    maxContactPoints: 20,
    usedContactPoints: 0,
  };

  const partialContact: Partial<SocialContact> = {
    name: "Fast Eddie",
    connection: 3,
    loyalty: 2,
    archetype: "Fixer",
    description: "Street-level fixer from the Barrens",
  };

  it("pre-populates form fields from prefillContact", () => {
    render(<ContactFormModal {...defaultProps} prefillContact={partialContact} />);

    const nameInput = screen.getByPlaceholderText(/contact name/i);
    expect(nameInput).toHaveValue("Fast Eddie");

    const spinbuttons = screen.getAllByRole("spinbutton");
    // Connection and loyalty are the first two spinbuttons
    const connectionInput = spinbuttons[0];
    const loyaltyInput = spinbuttons[1];
    expect(connectionInput).toHaveValue(3);
    expect(loyaltyInput).toHaveValue(2);
  });

  it("uses default values for missing fields in prefillContact", () => {
    const sparse: Partial<SocialContact> = {
      name: "Unknown Runner",
    };

    render(<ContactFormModal {...defaultProps} prefillContact={sparse} />);

    const nameInput = screen.getByPlaceholderText(/contact name/i);
    expect(nameInput).toHaveValue("Unknown Runner");

    const spinbuttons = screen.getAllByRole("spinbutton");
    const connectionInput = spinbuttons[0];
    const loyaltyInput = spinbuttons[1];
    // Missing connection/loyalty should default to 1
    expect(connectionInput).toHaveValue(1);
    expect(loyaltyInput).toHaveValue(1);
  });

  it("shows empty form when prefillContact is null", () => {
    render(<ContactFormModal {...defaultProps} prefillContact={null} />);

    const nameInput = screen.getByPlaceholderText(/contact name/i);
    expect(nameInput).toHaveValue("");

    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons[0]).toHaveValue(1);
    expect(spinbuttons[1]).toHaveValue(1);
  });

  it("contact prop takes priority over prefillContact", () => {
    const fullContact = {
      id: "c-001",
      characterId: "char-001",
      name: "Mama Grande",
      connection: 5,
      loyalty: 4,
      archetype: "Street Doc",
      description: "Underground clinic operator",
      specializations: ["surgery"],
      favorBalance: 0,
      status: "active",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    } as SocialContact;

    render(
      <ContactFormModal {...defaultProps} contact={fullContact} prefillContact={partialContact} />
    );

    // Should use contact (Mama Grande), not prefillContact (Fast Eddie)
    const nameInput = screen.getByPlaceholderText(/contact name/i);
    expect(nameInput).toHaveValue("Mama Grande");

    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons[0]).toHaveValue(5);
    expect(spinbuttons[1]).toHaveValue(4);
  });

  it("renders as 'Add Contact' mode when only prefillContact is supplied", () => {
    render(<ContactFormModal {...defaultProps} prefillContact={partialContact} />);

    // Should show "Add" title, not "Edit"
    expect(screen.getByText(/add new contact/i)).toBeInTheDocument();
  });
});
