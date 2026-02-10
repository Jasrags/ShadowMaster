/**
 * ComplexFormsDisplay Component Tests
 *
 * Tests the complex forms display for technomancers.
 * Returns null when empty. Mocks useComplexForms hook.
 * Tests both catalog-matched and fallback (unmatched) rendering.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MOCK_COMPLEX_FORMS } from "./test-helpers";

vi.mock("../DisplayCard", () => ({
  DisplayCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="display-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Activity: (props: Record<string, unknown>) => <span data-testid="icon-Activity" {...props} />,
  Shield: (props: Record<string, unknown>) => <span data-testid="icon-Shield" {...props} />,
  Heart: (props: Record<string, unknown>) => <span data-testid="icon-Heart" {...props} />,
  Brain: (props: Record<string, unknown>) => <span data-testid="icon-Brain" {...props} />,
  Footprints: (props: Record<string, unknown>) => <span data-testid="icon-Footprints" {...props} />,
  ShieldCheck: (props: Record<string, unknown>) => (
    <span data-testid="icon-ShieldCheck" {...props} />
  ),
  BarChart3: (props: Record<string, unknown>) => <span data-testid="icon-BarChart3" {...props} />,
  Crosshair: (props: Record<string, unknown>) => <span data-testid="icon-Crosshair" {...props} />,
  Swords: (props: Record<string, unknown>) => <span data-testid="icon-Swords" {...props} />,
  Package: (props: Record<string, unknown>) => <span data-testid="icon-Package" {...props} />,
  Pill: (props: Record<string, unknown>) => <span data-testid="icon-Pill" {...props} />,
  Sparkles: (props: Record<string, unknown>) => <span data-testid="icon-Sparkles" {...props} />,
  Braces: (props: Record<string, unknown>) => <span data-testid="icon-Braces" {...props} />,
  Cpu: (props: Record<string, unknown>) => <span data-testid="icon-Cpu" {...props} />,
  BookOpen: (props: Record<string, unknown>) => <span data-testid="icon-BookOpen" {...props} />,
  Users: (props: Record<string, unknown>) => <span data-testid="icon-Users" {...props} />,
  Fingerprint: (props: Record<string, unknown>) => (
    <span data-testid="icon-Fingerprint" {...props} />
  ),
  Zap: (props: Record<string, unknown>) => <span data-testid="icon-Zap" {...props} />,
  Car: (props: Record<string, unknown>) => <span data-testid="icon-Car" {...props} />,
  Home: (props: Record<string, unknown>) => <span data-testid="icon-Home" {...props} />,
}));

vi.mock("@/lib/rules", () => ({
  useComplexForms: vi.fn(),
}));

import { useComplexForms } from "@/lib/rules";
import { ComplexFormsDisplay } from "../ComplexFormsDisplay";

describe("ComplexFormsDisplay", () => {
  beforeEach(() => {
    vi.mocked(useComplexForms).mockReturnValue(MOCK_COMPLEX_FORMS);
  });

  it("returns null when complexForms array is empty", () => {
    const { container } = render(<ComplexFormsDisplay complexForms={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders complex form from catalog with full metadata", () => {
    render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
    expect(screen.getByText("Cleaner")).toBeInTheDocument();
    expect(screen.getByText("Persona")).toBeInTheDocument();
    expect(screen.getByText("Permanent")).toBeInTheDocument();
    expect(screen.getByText("L+1")).toBeInTheDocument();
  });

  it("renders fading value", () => {
    render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
    expect(screen.getByText("Fading")).toBeInTheDocument();
    expect(screen.getByText("L+1")).toBeInTheDocument();
  });

  it("renders target and duration metadata", () => {
    render(<ComplexFormsDisplay complexForms={["resonance-spike"]} />);
    expect(screen.getByText("Device")).toBeInTheDocument();
    expect(screen.getByText("Instant")).toBeInTheDocument();
  });

  it("renders description when available", () => {
    render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
    expect(screen.getByText("Removes marks from a persona")).toBeInTheDocument();
  });

  it("renders fallback for unmatched form ID", () => {
    render(<ComplexFormsDisplay complexForms={["unknown-form"]} />);
    expect(screen.getByText("unknown form")).toBeInTheDocument();
  });

  it("calls onSelect callback when catalog form is clicked", () => {
    const onSelect = vi.fn();
    render(<ComplexFormsDisplay complexForms={["cleaner"]} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Cleaner"));
    expect(onSelect).toHaveBeenCalledWith(6, "Cleaner");
  });

  it("calls onSelect callback when fallback form is clicked", () => {
    const onSelect = vi.fn();
    render(<ComplexFormsDisplay complexForms={["unknown-form"]} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("unknown form"));
    expect(onSelect).toHaveBeenCalledWith(6, "unknown form");
  });

  it("renders multiple complex forms", () => {
    render(<ComplexFormsDisplay complexForms={["cleaner", "resonance-spike"]} />);
    expect(screen.getByText("Cleaner")).toBeInTheDocument();
    expect(screen.getByText("Resonance Spike")).toBeInTheDocument();
  });
});
