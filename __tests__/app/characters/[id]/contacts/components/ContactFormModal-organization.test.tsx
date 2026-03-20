import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// Types imported indirectly via component

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
  getOrganizationDefinitions: () => [
    {
      id: "street-gang",
      name: "Street Gang",
      description: "Local street-level criminal organization",
      connectionBonus: 1,
      karmaCost: 5,
      sinnerRequired: false,
    },
    {
      id: "city-government",
      name: "City Government",
      description: "Municipal government offices and bureaucracy",
      connectionBonus: 1,
      karmaCost: 3,
      sinnerRequired: true,
    },
    {
      id: "humanis-policlub",
      name: "Humanis Policlub",
      description: "Anti-metahuman political organization",
      connectionBonus: 2,
      karmaCost: 10,
      sinnerRequired: false,
    },
    {
      id: "order-of-st-sylvester",
      name: "Order of St. Sylvester",
      description: "Catholic religious order with magical connections",
      connectionBonus: 2,
      karmaCost: 8,
      sinnerRequired: true,
    },
    {
      id: "lone-star-god",
      name: "Lone Star/GOD",
      description: "Law enforcement and Grid Overwatch Division",
      connectionBonus: 3,
      karmaCost: 12,
      sinnerRequired: true,
    },
  ],
}));

import { ContactFormModal } from "@/app/characters/[id]/contacts/components/ContactFormModal";

describe("ContactFormModal - organization contact flow", () => {
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

  it("organization checkbox is unchecked by default", () => {
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });
    expect(orgCheckbox).not.toBeChecked();
  });

  it("checking organization checkbox shows organization dropdown", async () => {
    const user = userEvent.setup();
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });

    // No org select before checking
    expect(screen.queryByText(/select organization/i)).not.toBeInTheDocument();

    await user.click(orgCheckbox);

    // Org select appears with placeholder option
    expect(screen.getByText(/select organization/i)).toBeInTheDocument();
  });

  it("selecting an organization auto-populates name and connection", async () => {
    const user = userEvent.setup();
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });
    await user.click(orgCheckbox);

    // Select "Street Gang" (connectionBonus: 1)
    const selects = screen.getAllByRole("combobox");
    const orgSelect = selects.find((s) =>
      Array.from(s.querySelectorAll("option")).some((o) => o.textContent?.includes("Street Gang"))
    )!;
    await user.selectOptions(orgSelect, "street-gang");

    // Name input should be populated (if empty)
    const nameInput = screen.getByPlaceholderText(/contact name/i);
    expect(nameInput).toHaveValue("Street Gang");
  });

  it("loyalty field is disabled when organization checkbox is checked", async () => {
    const user = userEvent.setup();
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });
    await user.click(orgCheckbox);

    // Loyalty input has "(locked to 1)" in its label
    const loyaltyInputs = screen.getAllByRole("spinbutton");
    const loyaltyInput = loyaltyInputs.find((i) => (i as HTMLInputElement).disabled);
    expect(loyaltyInput).toBeDefined();
    expect(loyaltyInput).toBeDisabled();
  });

  it("loyalty value is locked to 1 when organization checkbox is checked", async () => {
    const user = userEvent.setup();
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });
    await user.click(orgCheckbox);

    const loyaltyInputs = screen.getAllByRole("spinbutton");
    const loyaltyInput = loyaltyInputs.find((i) => (i as HTMLInputElement).disabled);
    expect(loyaltyInput).toHaveValue(1);
  });

  it("unchecking organization re-enables the loyalty field", async () => {
    const user = userEvent.setup();
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });

    await user.click(orgCheckbox);
    let loyaltyInputs = screen.getAllByRole("spinbutton");
    const loyaltyInput = loyaltyInputs.find((i) => (i as HTMLInputElement).disabled);
    expect(loyaltyInput).toBeDisabled();

    await user.click(orgCheckbox);
    loyaltyInputs = screen.getAllByRole("spinbutton");
    // After unchecking, no spinbutton should be disabled
    const disabledInputs = loyaltyInputs.filter((i) => (i as HTMLInputElement).disabled);
    expect(disabledInputs).toHaveLength(0);
  });

  it("shows org info panel with karma cost when an organization is selected", async () => {
    const user = userEvent.setup();
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });
    await user.click(orgCheckbox);

    const selects = screen.getAllByRole("combobox");
    const orgSelect = selects.find((s) =>
      Array.from(s.querySelectorAll("option")).some((o) => o.textContent?.includes("Street Gang"))
    )!;
    await user.selectOptions(orgSelect, "street-gang");

    // Info panel shows description and karma cost
    expect(screen.getByText(/local street-level criminal organization/i)).toBeInTheDocument();
    // Karma cost shown as "5K" in the info panel (also appears in option text, so use getAllByText)
    const karmaCostElements = screen.getAllByText(/5K/);
    expect(karmaCostElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows SIN Required for organizations that require a SIN", async () => {
    const user = userEvent.setup();
    render(<ContactFormModal {...defaultProps} />);

    const orgCheckbox = screen.getByRole("checkbox", {
      name: /organization contact/i,
    });
    await user.click(orgCheckbox);

    const selects = screen.getAllByRole("combobox");
    const orgSelect = selects.find((s) =>
      Array.from(s.querySelectorAll("option")).some((o) =>
        o.textContent?.includes("City Government")
      )
    )!;
    await user.selectOptions(orgSelect, "city-government");

    expect(screen.getByText(/sin required/i)).toBeInTheDocument();
  });
});
