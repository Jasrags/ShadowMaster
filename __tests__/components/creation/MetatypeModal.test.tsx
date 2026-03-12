import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MetatypeModal } from "@/components/creation/metatype/MetatypeModal";
import type { MetatypeOption } from "@/components/creation/metatype/types";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Check: ({ className }: { className?: string }) => (
    <svg data-testid="check-icon" className={className} />
  ),
  X: ({ className }: { className?: string }) => <svg data-testid="x-icon" className={className} />,
  Search: ({ className }: { className?: string }) => (
    <svg data-testid="search-icon" className={className} />
  ),
}));

// ─── Test Data ───────────────────────────────────────────────────────────────

const BASE_ATTRS = {
  body: { min: 1, max: 6 },
  agility: { min: 1, max: 6 },
  reaction: { min: 1, max: 6 },
  strength: { min: 1, max: 6 },
  willpower: { min: 1, max: 6 },
  logic: { min: 1, max: 6 },
  intuition: { min: 1, max: 6 },
  charisma: { min: 1, max: 6 },
  edge: { min: 2, max: 7 },
};

const ELF_ATTRS = {
  body: { min: 1, max: 6 },
  agility: { min: 2, max: 7 },
  reaction: { min: 1, max: 6 },
  strength: { min: 1, max: 6 },
  willpower: { min: 1, max: 6 },
  logic: { min: 1, max: 6 },
  intuition: { min: 1, max: 6 },
  charisma: { min: 3, max: 8 },
  edge: { min: 1, max: 6 },
};

const METATYPES: MetatypeOption[] = [
  {
    id: "human",
    name: "Human",
    baseMetatype: null,
    description: "Standard human",
    specialAttributePoints: 7,
    racialTraits: [],
    attributes: BASE_ATTRS,
    priorityAvailability: { A: 9, B: 7, C: 5, D: 3, E: 1 },
  },
  {
    id: "elf",
    name: "Elf",
    baseMetatype: null,
    description: "Graceful and long-lived",
    specialAttributePoints: 6,
    racialTraits: ["Low-Light Vision"],
    attributes: ELF_ATTRS,
    priorityAvailability: { A: 8, B: 6, C: 3, D: 0, E: null },
  },
  {
    id: "nocturna",
    name: "Nocturna",
    baseMetatype: "elf",
    description: "Nocturnal elf variant",
    specialAttributePoints: 3,
    racialTraits: ["Allergy (Sunlight, Mild)", "Low-Light Vision", "Keen-eared"],
    attributes: {
      ...ELF_ATTRS,
      agility: { min: 3, max: 8 },
      charisma: { min: 2, max: 7 },
    },
    priorityAvailability: { A: 8, B: 6, C: 3, D: 0, E: null },
  },
  {
    id: "dwarf",
    name: "Dwarf",
    baseMetatype: null,
    description: "Stout and resilient",
    specialAttributePoints: 4,
    racialTraits: ["Thermographic Vision", "Resistance to Pathogens/Toxins"],
    attributes: {
      body: { min: 3, max: 8 },
      agility: { min: 1, max: 6 },
      reaction: { min: 1, max: 5 },
      strength: { min: 3, max: 8 },
      willpower: { min: 2, max: 7 },
      logic: { min: 1, max: 6 },
      intuition: { min: 1, max: 6 },
      charisma: { min: 1, max: 5 },
      edge: { min: 1, max: 6 },
    },
    priorityAvailability: { A: 7, B: 4, C: 1, D: null, E: null },
  },
  {
    id: "centaur",
    name: "Centaur",
    baseMetatype: null,
    description: "Four-legged metasapient",
    specialAttributePoints: 3,
    racialTraits: ["Astral Perception", "Natural Weapon (Kick)"],
    attributes: BASE_ATTRS,
    priorityAvailability: { A: 6, B: 3, C: 0, D: null, E: null },
  },
];

const POINT_BUY_METATYPES: MetatypeOption[] = METATYPES.map((m) => ({
  ...m,
  specialAttributePoints: 0,
  karmaCost: m.id === "human" ? 0 : m.id === "centaur" ? 25 : 15,
  priorityAvailability: undefined,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function defaultProps(overrides: Partial<Parameters<typeof MetatypeModal>[0]> = {}) {
  return {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    metatypes: METATYPES,
    priorityLevel: "B",
    currentSelection: null,
    ...overrides,
  };
}

/** Get the left list panel */
function getListPanel() {
  return screen.getByTestId("metatype-list");
}

/** Get the right detail panel */
function getDetailPanel() {
  return screen.getByTestId("metatype-detail");
}

/** Get the filter pills container */
function getFilterPills() {
  return screen.getByTestId("filter-pills");
}

/** Click a metatype in the list panel by name */
async function clickListItem(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
  const list = getListPanel();
  const item = within(list).getByRole("button", { name });
  await user.click(item);
}

/** Click a filter pill by name */
async function clickFilterPill(user: ReturnType<typeof userEvent.setup>, name: string) {
  const pills = getFilterPills();
  await user.click(within(pills).getByRole("button", { name }));
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("MetatypeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders nothing when closed", () => {
      const { container } = render(<MetatypeModal {...defaultProps({ isOpen: false })} />);
      expect(container.innerHTML).toBe("");
    });

    it("renders the modal when open", () => {
      render(<MetatypeModal {...defaultProps()} />);
      expect(screen.getByText("Select Metatype")).toBeInTheDocument();
    });

    it("renders all metatype groups in the list panel", () => {
      render(<MetatypeModal {...defaultProps()} />);
      const list = getListPanel();
      // Group labels have counts like "Human (2)" — check for those patterns
      expect(within(list).getByText("(2)")).toBeInTheDocument(); // Human group: Human + (count)
      expect(within(list).getByText("Metasapients")).toBeInTheDocument();
      // At least 4 groups rendered (Human, Elf, Dwarf, Metasapients)
      const groupHeaders = list.querySelectorAll(".sticky");
      expect(groupHeaders.length).toBeGreaterThanOrEqual(4);
    });

    it("renders all metatypes in the list", () => {
      render(<MetatypeModal {...defaultProps()} />);
      const list = getListPanel();
      for (const m of METATYPES) {
        expect(within(list).getByRole("button", { name: new RegExp(m.name) })).toBeInTheDocument();
      }
    });

    it("shows filter pills", () => {
      render(<MetatypeModal {...defaultProps()} />);
      const pills = getFilterPills();
      expect(within(pills).getByRole("button", { name: "All" })).toBeInTheDocument();
      expect(within(pills).getByRole("button", { name: "Elf" })).toBeInTheDocument();
      expect(within(pills).getByRole("button", { name: "Sapient" })).toBeInTheDocument();
    });

    it("shows search input", () => {
      render(<MetatypeModal {...defaultProps()} />);
      expect(screen.getByPlaceholderText("Search metatypes...")).toBeInTheDocument();
    });

    it("shows empty detail panel when nothing selected", () => {
      render(<MetatypeModal {...defaultProps()} />);
      expect(screen.getByText("Select a metatype to see details")).toBeInTheDocument();
    });

    it("shows priority info in footer when priorityLevel provided", () => {
      render(<MetatypeModal {...defaultProps()} />);
      expect(screen.getByText(/Priority B/)).toBeInTheDocument();
    });

    it("shows point buy info in footer when no priorityLevel", () => {
      render(
        <MetatypeModal
          {...defaultProps({ priorityLevel: undefined, metatypes: POINT_BUY_METATYPES })}
        />
      );
      expect(screen.getByText(/Karma cost from budget/)).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("selects a metatype and shows detail panel", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /^Elf/);

      const detail = getDetailPanel();
      // Description comes from METATYPE_DESCRIPTIONS constant or option.description
      expect(within(detail).getByText(/Graceful and long-lived/)).toBeInTheDocument();
      expect(within(detail).getByText("Low-Light Vision")).toBeInTheDocument();
    });

    it("shows attributes in the detail panel", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /^Elf/);

      const detail = getDetailPanel();
      expect(within(detail).getByText("AGI")).toBeInTheDocument();
      expect(within(detail).getByText("CHA")).toBeInTheDocument();
      expect(within(detail).getByText("2 / 7")).toBeInTheDocument();
      expect(within(detail).getByText("3 / 8")).toBeInTheDocument();
    });

    it("highlights above-range attributes", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /^Elf/);

      const detail = getDetailPanel();
      const agiCell = within(detail).getByText("AGI").closest("div");
      expect(agiCell?.className).toContain("amber");
    });

    it("shows priority availability table for priority-based creation", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /^Elf/);

      const detail = getDetailPanel();
      expect(within(detail).getByText("Priority Availability")).toBeInTheDocument();
    });

    it("does not show priority availability for point buy", async () => {
      const user = userEvent.setup();
      render(
        <MetatypeModal
          {...defaultProps({ priorityLevel: undefined, metatypes: POINT_BUY_METATYPES })}
        />
      );

      await clickListItem(user, /^Elf/);

      const detail = getDetailPanel();
      expect(within(detail).queryByText("Priority Availability")).not.toBeInTheDocument();
    });

    it("shows karma cost for point buy metatypes", async () => {
      const user = userEvent.setup();
      render(
        <MetatypeModal
          {...defaultProps({ priorityLevel: undefined, metatypes: POINT_BUY_METATYPES })}
        />
      );

      await clickListItem(user, /Centaur/);

      const detail = getDetailPanel();
      expect(within(detail).getByText("25")).toBeInTheDocument();
    });

    it("shows footer preview when metatype selected", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /Nocturna/);

      expect(screen.getByText(/3 traits/)).toBeInTheDocument();
    });

    it("pre-selects currentSelection when provided", () => {
      render(<MetatypeModal {...defaultProps({ currentSelection: "elf" })} />);

      const detail = getDetailPanel();
      expect(within(detail).getByText(/Graceful and long-lived/)).toBeInTheDocument();
      expect(screen.getByText(/1 trait/)).toBeInTheDocument();
    });
  });

  describe("search", () => {
    it("filters metatypes by search query", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await user.type(screen.getByPlaceholderText("Search metatypes..."), "noct");

      const list = getListPanel();
      expect(within(list).getByRole("button", { name: /Nocturna/ })).toBeInTheDocument();
      expect(within(list).queryByRole("button", { name: /^Human/ })).not.toBeInTheDocument();
      expect(within(list).queryByRole("button", { name: /^Dwarf/ })).not.toBeInTheDocument();
    });

    it("shows empty state when no matches", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await user.type(screen.getByPlaceholderText("Search metatypes..."), "zzzzz");

      expect(screen.getByText("No metatypes match")).toBeInTheDocument();
    });
  });

  describe("filter pills", () => {
    it("filters by metatype family when pill clicked", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickFilterPill(user, "Elf");

      const list = getListPanel();
      expect(within(list).getByRole("button", { name: /^Elf/ })).toBeInTheDocument();
      expect(within(list).getByRole("button", { name: /Nocturna/ })).toBeInTheDocument();
      expect(within(list).queryByRole("button", { name: /^Human/ })).not.toBeInTheDocument();
      expect(within(list).queryByRole("button", { name: /Centaur/ })).not.toBeInTheDocument();
    });

    it("shows all when All pill clicked after filtering", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickFilterPill(user, "Elf");
      await clickFilterPill(user, "All");

      const list = getListPanel();
      for (const m of METATYPES) {
        expect(within(list).getByRole("button", { name: new RegExp(m.name) })).toBeInTheDocument();
      }
    });

    it("filters sapient metatypes", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickFilterPill(user, "Sapient");

      const list = getListPanel();
      expect(within(list).getByRole("button", { name: /Centaur/ })).toBeInTheDocument();
      expect(within(list).queryByRole("button", { name: /^Elf/ })).not.toBeInTheDocument();
    });
  });

  describe("confirm and cancel", () => {
    it("calls onConfirm and onClose when Confirm clicked", async () => {
      const user = userEvent.setup();
      const props = defaultProps();
      render(<MetatypeModal {...props} />);

      await clickListItem(user, /^Elf/);
      await user.click(screen.getByRole("button", { name: "Confirm" }));

      expect(props.onConfirm).toHaveBeenCalledWith("elf");
      expect(props.onClose).toHaveBeenCalled();
    });

    it("disables Confirm when nothing selected", () => {
      render(<MetatypeModal {...defaultProps()} />);

      const confirmBtn = screen.getByRole("button", { name: "Confirm" });
      expect(confirmBtn).toBeDisabled();
    });

    it("calls onClose when Cancel clicked", async () => {
      const user = userEvent.setup();
      const props = defaultProps();
      render(<MetatypeModal {...props} />);

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(props.onClose).toHaveBeenCalled();
      expect(props.onConfirm).not.toHaveBeenCalled();
    });

    it("calls onClose when Escape key is pressed", async () => {
      const user = userEvent.setup();
      const props = defaultProps();
      render(<MetatypeModal {...props} />);

      await user.keyboard("{Escape}");

      expect(props.onClose).toHaveBeenCalled();
    });

    it("does not call onConfirm on cancel even after selecting", async () => {
      const user = userEvent.setup();
      const props = defaultProps({ currentSelection: "human" });
      render(<MetatypeModal {...props} />);

      await clickListItem(user, /^Elf/);
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(props.onConfirm).not.toHaveBeenCalled();
    });
  });

  describe("type badges", () => {
    it("shows Base badge for base metatypes", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /^Human/);

      const detail = getDetailPanel();
      expect(within(detail).getByText("Base")).toBeInTheDocument();
    });

    it("shows Variant badge for metavariants", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /Nocturna/);

      const detail = getDetailPanel();
      expect(within(detail).getByText("Elf Variant")).toBeInTheDocument();
    });

    it("shows Metasapient badge for metasapients", async () => {
      const user = userEvent.setup();
      render(<MetatypeModal {...defaultProps()} />);

      await clickListItem(user, /Centaur/);

      const detail = getDetailPanel();
      expect(within(detail).getByText("Metasapient")).toBeInTheDocument();
    });
  });
});
