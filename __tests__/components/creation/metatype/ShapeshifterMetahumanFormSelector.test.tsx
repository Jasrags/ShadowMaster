/**
 * ShapeshifterMetahumanFormSelector Tests
 *
 * Tests for the shapeshifter metahuman form radio-button card selector.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShapeshifterMetahumanFormSelector } from "@/components/creation/metatype/ShapeshifterMetahumanFormSelector";

// =============================================================================
// RENDERING
// =============================================================================

describe("ShapeshifterMetahumanFormSelector - rendering", () => {
  it("should render all 5 metahuman form options", () => {
    render(
      <ShapeshifterMetahumanFormSelector selectedForm={undefined} onSelectForm={vi.fn()} />
    );

    expect(screen.getByTestId("metahuman-form-human")).toBeInTheDocument();
    expect(screen.getByTestId("metahuman-form-dwarf")).toBeInTheDocument();
    expect(screen.getByTestId("metahuman-form-elf")).toBeInTheDocument();
    expect(screen.getByTestId("metahuman-form-ork")).toBeInTheDocument();
    expect(screen.getByTestId("metahuman-form-troll")).toBeInTheDocument();
  });

  it("should display form names", () => {
    render(
      <ShapeshifterMetahumanFormSelector selectedForm={undefined} onSelectForm={vi.fn()} />
    );

    expect(screen.getByText("Human")).toBeInTheDocument();
    expect(screen.getByText("Dwarf")).toBeInTheDocument();
    expect(screen.getByText("Elf")).toBeInTheDocument();
    expect(screen.getByText("Ork")).toBeInTheDocument();
    expect(screen.getByText("Troll")).toBeInTheDocument();
  });

  it("should display karma costs", () => {
    render(
      <ShapeshifterMetahumanFormSelector selectedForm={undefined} onSelectForm={vi.fn()} />
    );

    // Human is free, others have karma costs
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("5 Karma")).toBeInTheDocument(); // Elf
    expect(screen.getByText("8 Karma")).toBeInTheDocument(); // Dwarf
    expect(screen.getByText("10 Karma")).toBeInTheDocument(); // Ork
    expect(screen.getByText("20 Karma")).toBeInTheDocument(); // Troll
  });

  it("should show the required label", () => {
    render(
      <ShapeshifterMetahumanFormSelector selectedForm={undefined} onSelectForm={vi.fn()} />
    );

    expect(screen.getByText("Metahuman Form (required)")).toBeInTheDocument();
  });

  it("should show explanatory text", () => {
    render(
      <ShapeshifterMetahumanFormSelector selectedForm={undefined} onSelectForm={vi.fn()} />
    );

    expect(
      screen.getByText(/your shapeshifter assumes this metahuman form/i)
    ).toBeInTheDocument();
  });
});

// =============================================================================
// SELECTION
// =============================================================================

describe("ShapeshifterMetahumanFormSelector - selection", () => {
  it("should highlight the selected form", () => {
    render(
      <ShapeshifterMetahumanFormSelector selectedForm="elf" onSelectForm={vi.fn()} />
    );

    const elfButton = screen.getByTestId("metahuman-form-elf");
    expect(elfButton.className).toContain("border-amber-500");
  });

  it("should not highlight unselected forms", () => {
    render(
      <ShapeshifterMetahumanFormSelector selectedForm="elf" onSelectForm={vi.fn()} />
    );

    const humanButton = screen.getByTestId("metahuman-form-human");
    expect(humanButton.className).not.toContain("border-amber-500");
  });

  it("should call onSelectForm when a form is clicked", async () => {
    const user = userEvent.setup();
    const onSelectForm = vi.fn();

    render(
      <ShapeshifterMetahumanFormSelector selectedForm={undefined} onSelectForm={onSelectForm} />
    );

    await user.click(screen.getByTestId("metahuman-form-dwarf"));
    expect(onSelectForm).toHaveBeenCalledWith("dwarf");
  });

  it("should call onSelectForm with correct ID for each form", async () => {
    const user = userEvent.setup();
    const onSelectForm = vi.fn();

    render(
      <ShapeshifterMetahumanFormSelector selectedForm={undefined} onSelectForm={onSelectForm} />
    );

    const forms = ["human", "dwarf", "elf", "ork", "troll"];
    for (const form of forms) {
      await user.click(screen.getByTestId(`metahuman-form-${form}`));
      expect(onSelectForm).toHaveBeenCalledWith(form);
    }

    expect(onSelectForm).toHaveBeenCalledTimes(5);
  });

  it("should allow changing selection", async () => {
    const user = userEvent.setup();
    const onSelectForm = vi.fn();

    const { rerender } = render(
      <ShapeshifterMetahumanFormSelector selectedForm="human" onSelectForm={onSelectForm} />
    );

    await user.click(screen.getByTestId("metahuman-form-troll"));
    expect(onSelectForm).toHaveBeenCalledWith("troll");

    // Simulate parent updating the selected form
    rerender(
      <ShapeshifterMetahumanFormSelector selectedForm="troll" onSelectForm={onSelectForm} />
    );

    const trollButton = screen.getByTestId("metahuman-form-troll");
    expect(trollButton.className).toContain("border-amber-500");
  });
});
