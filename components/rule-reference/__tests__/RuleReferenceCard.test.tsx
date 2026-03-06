/**
 * Tests for RuleReferenceCard component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RuleReferenceCard } from "../RuleReferenceCard";
import type { RuleReferenceEntry } from "@/lib/types";

describe("RuleReferenceCard", () => {
  const entry: RuleReferenceEntry = {
    id: "defense-modifiers",
    title: "Defense Modifiers",
    category: "combat",
    subcategory: "ranged",
    tags: ["defense", "dodge"],
    summary: "Dice pool modifiers for defense tests in combat.",
    tables: [
      {
        headers: ["Situation", "Modifier"],
        rows: [
          ["Defender prone", "-2"],
          ["Defender running", "+2"],
        ],
      },
    ],
    notes: ["Wound modifiers stack with defense modifiers."],
    source: { book: "SR5 Core", page: 188 },
  };

  it("should render the entry title", () => {
    render(<RuleReferenceCard entry={entry} />);
    expect(screen.getByText("Defense Modifiers")).toBeInTheDocument();
  });

  it("should render the category badge", () => {
    render(<RuleReferenceCard entry={entry} />);
    expect(screen.getByText("combat")).toBeInTheDocument();
  });

  it("should render the subcategory", () => {
    render(<RuleReferenceCard entry={entry} />);
    expect(screen.getByText("ranged")).toBeInTheDocument();
  });

  it("should render the summary", () => {
    render(<RuleReferenceCard entry={entry} />);
    expect(
      screen.getByText("Dice pool modifiers for defense tests in combat.")
    ).toBeInTheDocument();
  });

  it("should render table data", () => {
    render(<RuleReferenceCard entry={entry} />);
    expect(screen.getByText("Defender prone")).toBeInTheDocument();
    expect(screen.getByText("-2")).toBeInTheDocument();
  });

  it("should render notes", () => {
    render(<RuleReferenceCard entry={entry} />);
    expect(screen.getByText("Wound modifiers stack with defense modifiers.")).toBeInTheDocument();
  });

  it("should render source reference", () => {
    render(<RuleReferenceCard entry={entry} />);
    expect(screen.getByText("SR5 Core, p. 188")).toBeInTheDocument();
  });

  it("should not render notes section when no notes", () => {
    const entryWithoutNotes: RuleReferenceEntry = {
      ...entry,
      notes: undefined,
    };

    render(<RuleReferenceCard entry={entryWithoutNotes} />);
    expect(screen.queryByText("Notes")).not.toBeInTheDocument();
  });

  it("should not render subcategory when not present", () => {
    const entryWithoutSubcategory: RuleReferenceEntry = {
      ...entry,
      subcategory: undefined,
    };

    render(<RuleReferenceCard entry={entryWithoutSubcategory} />);
    expect(screen.queryByText("ranged")).not.toBeInTheDocument();
  });
});
