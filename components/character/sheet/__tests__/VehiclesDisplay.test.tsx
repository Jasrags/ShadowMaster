/**
 * VehiclesDisplay Component Tests
 *
 * Tests the vehicles & drones display. Returns null when all arrays empty.
 * Shows vehicle stats grid, drone size labels, RCC device rating/firewall.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Vehicle, CharacterDrone, CharacterRCC } from "@/lib/types";

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

import { VehiclesDisplay } from "../VehiclesDisplay";

const mockVehicle: Vehicle = {
  catalogId: "dodge-scoot",
  name: "Dodge Scoot",
  type: "ground",
  handling: 4,
  speed: 3,
  acceleration: 1,
  body: 4,
  armor: 4,
  pilot: 1,
  sensor: 1,
  seats: 1,
  cost: 3000,
  availability: 4,
};

const mockDrone: CharacterDrone = {
  catalogId: "fly-spy",
  name: "MCT Fly-Spy",
  size: "mini",
  handling: 4,
  speed: 3,
  acceleration: 2,
  body: 1,
  armor: 0,
  pilot: 3,
  sensor: 3,
  cost: 2000,
  availability: 4,
};

const mockRCC: CharacterRCC = {
  catalogId: "rcc-standard",
  name: "RCC-Standard",
  deviceRating: 5,
  dataProcessing: 4,
  firewall: 3,
  cost: 11000,
  availability: 6,
};

describe("VehiclesDisplay", () => {
  it("returns null when all arrays are empty", () => {
    const { container } = render(<VehiclesDisplay vehicles={[]} drones={[]} rccs={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when no props provided", () => {
    const { container } = render(<VehiclesDisplay />);
    expect(container.innerHTML).toBe("");
  });

  it("renders vehicle name", () => {
    render(<VehiclesDisplay vehicles={[mockVehicle]} />);
    expect(screen.getByText("Dodge Scoot")).toBeInTheDocument();
  });

  it("renders vehicle type label", () => {
    render(<VehiclesDisplay vehicles={[mockVehicle]} />);
    expect(screen.getByText("Vehicle")).toBeInTheDocument();
  });

  it("renders vehicle stats grid (handling, speed, body, armor)", () => {
    render(<VehiclesDisplay vehicles={[mockVehicle]} />);
    expect(screen.getByText("Hand")).toBeInTheDocument();
    expect(screen.getByText("Spd")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    // "Armor" label in the stats grid
    const armorLabels = screen.getAllByText("Armor");
    expect(armorLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("renders drone name and size label", () => {
    render(<VehiclesDisplay drones={[mockDrone]} />);
    expect(screen.getByText("MCT Fly-Spy")).toBeInTheDocument();
    expect(screen.getByText("mini Drone")).toBeInTheDocument();
  });

  it("renders drone stats grid", () => {
    render(<VehiclesDisplay drones={[mockDrone]} />);
    expect(screen.getByText("Hand")).toBeInTheDocument();
    expect(screen.getByText("Spd")).toBeInTheDocument();
  });

  it("renders RCC name", () => {
    render(<VehiclesDisplay rccs={[mockRCC]} />);
    expect(screen.getByText("RCC-Standard")).toBeInTheDocument();
  });

  it("renders RCC type label", () => {
    render(<VehiclesDisplay rccs={[mockRCC]} />);
    expect(screen.getByText("RCC")).toBeInTheDocument();
  });

  it("renders RCC device rating", () => {
    render(<VehiclesDisplay rccs={[mockRCC]} />);
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders RCC data processing and firewall", () => {
    render(<VehiclesDisplay rccs={[mockRCC]} />);
    expect(screen.getByText("Data Proc")).toBeInTheDocument();
    expect(screen.getByText("Firewall")).toBeInTheDocument();
  });

  it("renders mixed vehicle types", () => {
    render(<VehiclesDisplay vehicles={[mockVehicle]} drones={[mockDrone]} rccs={[mockRCC]} />);
    expect(screen.getByText("Dodge Scoot")).toBeInTheDocument();
    expect(screen.getByText("MCT Fly-Spy")).toBeInTheDocument();
    expect(screen.getByText("RCC-Standard")).toBeInTheDocument();
  });

  it("renders only vehicles when drones/rccs not provided", () => {
    render(<VehiclesDisplay vehicles={[mockVehicle]} />);
    expect(screen.getByText("Dodge Scoot")).toBeInTheDocument();
    expect(screen.getByTestId("display-card")).toBeInTheDocument();
  });
});
