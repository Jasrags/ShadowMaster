/**
 * Tests for RuleReferenceTable component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RuleReferenceTable } from "../RuleReferenceTable";
import type { RuleReferenceTable as TableType } from "@/lib/types";

describe("RuleReferenceTable", () => {
  const table: TableType = {
    headers: ["Situation", "Modifier", "Notes"],
    rows: [
      ["Defender prone", "-2", ""],
      ["Defender running", "+2", "Applies to ranged only"],
      ["Good Cover", "+4", ""],
    ],
  };

  it("should render table headers", () => {
    render(<RuleReferenceTable table={table} />);

    expect(screen.getByText("Situation")).toBeInTheDocument();
    expect(screen.getByText("Modifier")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("should render table rows", () => {
    render(<RuleReferenceTable table={table} />);

    expect(screen.getByText("Defender prone")).toBeInTheDocument();
    expect(screen.getByText("-2")).toBeInTheDocument();
    expect(screen.getByText("Good Cover")).toBeInTheDocument();
    expect(screen.getByText("+4")).toBeInTheDocument();
  });

  it("should render all rows", () => {
    render(<RuleReferenceTable table={table} />);

    const rows = screen.getAllByRole("row");
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it("should render an empty table", () => {
    const emptyTable: TableType = {
      headers: ["Col A"],
      rows: [],
    };

    render(<RuleReferenceTable table={emptyTable} />);
    expect(screen.getByText("Col A")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(1); // header only
  });
});
