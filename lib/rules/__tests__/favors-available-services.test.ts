import { describe, it, expect } from "vitest";
import { getAvailableServices } from "../favors";
import type { SocialContact, FavorServiceDefinition } from "@/lib/types";

function makeContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "c-1",
    characterId: "char-1",
    name: "Test Contact",
    archetype: "Fixer",
    connection: 3,
    loyalty: 3,
    favorBalance: 0,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as SocialContact;
}

function makeService(overrides: Partial<FavorServiceDefinition> = {}): FavorServiceDefinition {
  return {
    id: "svc-1",
    name: "Test Service",
    description: "A test service",
    minimumConnection: 1,
    minimumLoyalty: 1,
    favorCost: 1,
    riskLevel: "low",
    burnRiskOnFailure: false,
    ...overrides,
  } as FavorServiceDefinition;
}

describe("getAvailableServices", () => {
  it("returns generic services (no archetypeIds) for any contact", () => {
    const contact = makeContact({ connection: 2 });
    const services = [
      makeService({ id: "generic-1", minimumConnection: 1 }),
      makeService({ id: "generic-2", minimumConnection: 2 }),
    ];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(2);
  });

  it("filters by minimumConnection", () => {
    const contact = makeContact({ connection: 2 });
    const services = [
      makeService({ id: "low", minimumConnection: 1 }),
      makeService({ id: "high", minimumConnection: 5 }),
    ];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("low");
  });

  it("matches archetype by archetypeId field", () => {
    const contact = makeContact({
      archetype: "Fixer",
      archetypeId: "fixer",
    } as Partial<SocialContact>);
    const services = [
      makeService({ id: "fixer-svc", archetypeIds: ["fixer"] }),
      makeService({ id: "doc-svc", archetypeIds: ["street-doc"] }),
    ];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("fixer-svc");
  });

  it("matches display name to kebab-case archetype IDs", () => {
    // Contact has display name "Street Doc" but no archetypeId
    const contact = makeContact({ archetype: "Street Doc" });
    const services = [
      makeService({ id: "medical", archetypeIds: ["street-doc"] }),
      makeService({ id: "fixer-svc", archetypeIds: ["fixer"] }),
    ];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("medical");
  });

  it("matches display name 'Mr. Johnson' to 'mr-johnson'", () => {
    const contact = makeContact({ archetype: "Mr. Johnson" });
    const services = [makeService({ id: "job", archetypeIds: ["fixer", "mr-johnson"] })];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(1);
  });

  it("matches display name 'Gang Leader' to 'gang-leader'", () => {
    const contact = makeContact({ archetype: "Gang Leader" });
    const services = [makeService({ id: "muscle", archetypeIds: ["gang-leader", "fixer"] })];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(1);
  });

  it("matches display name 'ID Manufacturer' to 'id-manufacturer'", () => {
    const contact = makeContact({ archetype: "ID Manufacturer" });
    const services = [makeService({ id: "fake-sin", archetypeIds: ["id-manufacturer"] })];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(1);
  });

  it("excludes services with archetype mismatch even when connection is sufficient", () => {
    const contact = makeContact({ archetype: "Bartender", connection: 10 });
    const services = [
      makeService({ id: "medical", archetypeIds: ["street-doc"], minimumConnection: 1 }),
    ];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(0);
  });

  it("returns both generic and archetype-matched services", () => {
    const contact = makeContact({ archetype: "Fixer", connection: 3 });
    const services = [
      makeService({ id: "generic", minimumConnection: 1 }),
      makeService({ id: "fixer-svc", archetypeIds: ["fixer"], minimumConnection: 2 }),
      makeService({ id: "doc-svc", archetypeIds: ["street-doc"], minimumConnection: 1 }),
    ];

    const result = getAvailableServices(contact, services);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id).sort()).toEqual(["fixer-svc", "generic"]);
  });
});
