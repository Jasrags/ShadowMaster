/**
 * Contact network analysis and discovery
 *
 * Provides network analysis, gap detection, and contact discovery functions.
 *
 * Capability References:
 * - "Contact networks MUST be persistent and discoverable, allowing for filtering by archetype, location, and specialization"
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type {
  SocialContact,
  ContactArchetype,
  ContactStatus,
} from "../types/contacts";

// =============================================================================
// NETWORK ANALYSIS
// =============================================================================

/**
 * Network analysis result
 */
export interface NetworkAnalysis {
  /** Total value of the network (sum of connection + loyalty) */
  totalValue: number;
  /** Count of contacts by archetype */
  archetypeDistribution: Record<string, number>;
  /** Count of contacts by location */
  locationDistribution: Record<string, number>;
  /** Average connection rating */
  averageConnection: number;
  /** Average loyalty rating */
  averageLoyalty: number;
  /** Percentage of contacts that are burned */
  burnedPercentage: number;
  /** Network health score (0-100) */
  healthScore: number;
  /** Analysis warnings */
  warnings: string[];
}

/**
 * Analyze a character's contact network
 *
 * @param contacts - Character's contacts
 * @returns Network analysis
 */
export function analyzeContactNetwork(contacts: SocialContact[]): NetworkAnalysis {
  if (contacts.length === 0) {
    return {
      totalValue: 0,
      archetypeDistribution: {},
      locationDistribution: {},
      averageConnection: 0,
      averageLoyalty: 0,
      burnedPercentage: 0,
      healthScore: 0,
      warnings: ["No contacts in network"],
    };
  }

  const warnings: string[] = [];

  // Calculate distributions
  const archetypeDistribution: Record<string, number> = {};
  const locationDistribution: Record<string, number> = {};

  let totalConnection = 0;
  let totalLoyalty = 0;
  let totalValue = 0;
  let activeCount = 0;
  let burnedCount = 0;

  for (const contact of contacts) {
    // Archetype distribution
    const archetype = contact.archetype || "Unknown";
    archetypeDistribution[archetype] = (archetypeDistribution[archetype] || 0) + 1;

    // Location distribution
    if (contact.location) {
      locationDistribution[contact.location] =
        (locationDistribution[contact.location] || 0) + 1;
    }

    // Only count active contacts for averages
    if (contact.status === "active") {
      totalConnection += contact.connection;
      totalLoyalty += contact.loyalty;
      totalValue += contact.connection + contact.loyalty;
      activeCount++;
    }

    if (contact.status === "burned") {
      burnedCount++;
    }
  }

  const averageConnection = activeCount > 0 ? totalConnection / activeCount : 0;
  const averageLoyalty = activeCount > 0 ? totalLoyalty / activeCount : 0;
  const burnedPercentage =
    contacts.length > 0 ? (burnedCount / contacts.length) * 100 : 0;

  // Generate warnings
  if (burnedPercentage > 30) {
    warnings.push("High percentage of burned contacts - reputation may suffer");
  }

  if (averageLoyalty < 2.5) {
    warnings.push("Low average loyalty - contacts may be unreliable");
  }

  if (activeCount < 3) {
    warnings.push("Very small network - limited access to services");
  }

  const lowLoyaltyContacts = contacts.filter(
    (c) => c.status === "active" && c.loyalty === 1
  );
  if (lowLoyaltyContacts.length > 0) {
    warnings.push(
      `${lowLoyaltyContacts.length} contact(s) with loyalty 1 - betrayal risk`
    );
  }

  // Calculate health score (0-100)
  let healthScore = 50; // Base score

  // Active contacts boost score
  healthScore += Math.min(20, activeCount * 2);

  // Average loyalty affects score
  healthScore += (averageLoyalty - 3) * 5; // -10 to +15

  // Average connection affects score
  healthScore += (averageConnection - 3) * 3; // -6 to +27

  // Burned contacts reduce score
  healthScore -= burnedPercentage * 0.3;

  // Diversity bonus
  const archetypeCount = Object.keys(archetypeDistribution).length;
  healthScore += Math.min(10, archetypeCount * 2);

  // Clamp to 0-100
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  return {
    totalValue,
    archetypeDistribution,
    locationDistribution,
    averageConnection: Math.round(averageConnection * 10) / 10,
    averageLoyalty: Math.round(averageLoyalty * 10) / 10,
    burnedPercentage: Math.round(burnedPercentage * 10) / 10,
    healthScore,
    warnings,
  };
}

// =============================================================================
// CONTACT DISCOVERY
// =============================================================================

/**
 * Find contacts by specialization
 *
 * @param contacts - Contacts to search
 * @param specialization - Specialization to find
 * @returns Matching contacts sorted by relevance
 */
export function findContactBySpecialization(
  contacts: SocialContact[],
  specialization: string
): SocialContact[] {
  const searchLower = specialization.toLowerCase();

  return contacts
    .filter((contact) => {
      if (contact.status !== "active") return false;

      // Check specializations
      const hasSpecialization = contact.specializations?.some((s) =>
        s.toLowerCase().includes(searchLower)
      );

      // Check archetype
      const archetypeMatches = contact.archetype
        ?.toLowerCase()
        .includes(searchLower);

      // Check notes (might contain specialization info)
      const notesMatch = contact.notes?.toLowerCase().includes(searchLower);

      return hasSpecialization || archetypeMatches || notesMatch;
    })
    .sort((a, b) => {
      // Prioritize exact specialization matches
      const aExact = a.specializations?.some(
        (s) => s.toLowerCase() === searchLower
      );
      const bExact = b.specializations?.some(
        (s) => s.toLowerCase() === searchLower
      );

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Then by connection (higher is better for specialized services)
      return b.connection - a.connection;
    });
}

/**
 * Find contacts that can provide a specific service
 *
 * @param contacts - Contacts to search
 * @param serviceType - Type of service needed
 * @returns Matching contacts sorted by suitability
 */
export function findContactByService(
  contacts: SocialContact[],
  serviceType: string
): SocialContact[] {
  // Map service types to likely archetypes and specializations
  const serviceArchetypes: Record<string, string[]> = {
    weapons: ["armorer", "fixer", "smuggler"],
    cyberware: ["street doc", "ripperdoc", "fixer"],
    information: ["fixer", "decker", "journalist", "bartender"],
    transportation: ["rigger", "smuggler", "fixer"],
    magic: ["talismonger", "mage", "shaman"],
    medical: ["street doc", "ripperdoc", "medic"],
    identity: ["forger", "fixer", "id manufacturer"],
    jobs: ["fixer", "mr. johnson", "corporate"],
    legal: ["lawyer", "corp contact", "fixer"],
    muscle: ["gang leader", "mercenary", "bouncer"],
    housing: ["fixer", "landlord", "squatter"],
  };

  const serviceTypeLower = serviceType.toLowerCase();
  const targetArchetypes = serviceArchetypes[serviceTypeLower] || [];

  return contacts
    .filter((contact) => {
      if (contact.status !== "active") return false;

      const archetypeLower = contact.archetype?.toLowerCase() || "";

      // Check if archetype matches service
      const archetypeMatches = targetArchetypes.some(
        (a) =>
          archetypeLower.includes(a) ||
          a.includes(archetypeLower)
      );

      // Check specializations
      const hasRelevantSpecialization = contact.specializations?.some((s) =>
        s.toLowerCase().includes(serviceTypeLower)
      );

      return archetypeMatches || hasRelevantSpecialization;
    })
    .sort((a, b) => {
      // Sort by loyalty first (more reliable)
      if (b.loyalty !== a.loyalty) {
        return b.loyalty - a.loyalty;
      }
      // Then by connection (better access)
      return b.connection - a.connection;
    });
}

// =============================================================================
// GAP ANALYSIS
// =============================================================================

/**
 * Core archetype categories that a well-rounded network should have
 */
const CORE_ARCHETYPES = [
  { id: "fixer", name: "Fixer", description: "General purpose, job connections" },
  { id: "street-doc", name: "Street Doc", description: "Medical services" },
  { id: "armorer", name: "Armorer", description: "Weapons and equipment" },
  { id: "information", name: "Information Broker", description: "Intel and data" },
  { id: "transportation", name: "Transportation", description: "Smuggling, travel" },
  { id: "legal", name: "Legal Contact", description: "Lawyers, law enforcement" },
  { id: "technical", name: "Technical Contact", description: "Deckers, riggers" },
];

/**
 * Suggest archetypes missing from a contact network
 *
 * @param contacts - Current contacts
 * @param editionCode - Edition (for specific recommendations)
 * @returns Suggested archetypes to fill gaps
 */
export function suggestContactGaps(
  contacts: SocialContact[],
  editionCode: string
): string[] {
  const activeContacts = contacts.filter((c) => c.status === "active");
  const archetypes = new Set(
    activeContacts.map((c) => c.archetype?.toLowerCase() || "")
  );

  const suggestions: string[] = [];

  for (const core of CORE_ARCHETYPES) {
    // Check if any contact covers this category
    const hasCoverage = Array.from(archetypes).some(
      (arch) =>
        arch.includes(core.id) ||
        core.id.includes(arch) ||
        // Check common aliases
        (core.id === "street-doc" && (arch.includes("doc") || arch.includes("medic"))) ||
        (core.id === "information" &&
          (arch.includes("decker") ||
            arch.includes("journalist") ||
            arch.includes("bartender"))) ||
        (core.id === "transportation" &&
          (arch.includes("smuggler") || arch.includes("rigger"))) ||
        (core.id === "technical" &&
          (arch.includes("decker") || arch.includes("rigger") || arch.includes("technomancer"))) ||
        (core.id === "legal" &&
          (arch.includes("lawyer") || arch.includes("cop") || arch.includes("law")))
    );

    if (!hasCoverage) {
      suggestions.push(`${core.name}: ${core.description}`);
    }
  }

  // Edition-specific suggestions
  if (editionCode === "sr5" || editionCode === "sr6") {
    const hasTalismonger = Array.from(archetypes).some(
      (a) => a.includes("talismonger") || a.includes("mage") || a.includes("magic")
    );
    if (!hasTalismonger) {
      suggestions.push("Talismonger: Magical supplies and reagents");
    }
  }

  return suggestions;
}

// =============================================================================
// CONTACT RECOMMENDATIONS
// =============================================================================

/**
 * Get recommendations for improving a contact network
 *
 * @param contacts - Current contacts
 * @param analysis - Network analysis
 * @returns Improvement recommendations
 */
export function getNetworkRecommendations(
  contacts: SocialContact[],
  analysis: NetworkAnalysis
): string[] {
  const recommendations: string[] = [];

  // Low loyalty recommendations
  if (analysis.averageLoyalty < 3) {
    const lowLoyaltyContacts = contacts.filter(
      (c) => c.status === "active" && c.loyalty < 3
    );
    if (lowLoyaltyContacts.length > 0) {
      recommendations.push(
        `Consider investing karma in improving loyalty for ${lowLoyaltyContacts[0].name} ` +
          `(current loyalty: ${lowLoyaltyContacts[0].loyalty})`
      );
    }
  }

  // High burn rate
  if (analysis.burnedPercentage > 20) {
    recommendations.push(
      "High contact burn rate - consider being more careful with risky favors"
    );
  }

  // Low connection average
  if (analysis.averageConnection < 3) {
    recommendations.push(
      "Low average connection rating limits access to rare services - seek more connected contacts"
    );
  }

  // Concentration risk
  const archetypeCounts = Object.values(analysis.archetypeDistribution);
  const maxConcentration = Math.max(...archetypeCounts);
  if (maxConcentration > 3 && archetypeCounts.length > 1) {
    const concentratedType = Object.entries(analysis.archetypeDistribution).find(
      ([_, count]) => count === maxConcentration
    )?.[0];
    recommendations.push(
      `Heavy concentration in ${concentratedType} (${maxConcentration} contacts) - consider diversifying`
    );
  }

  // Small network
  const activeCount = contacts.filter((c) => c.status === "active").length;
  if (activeCount < 5) {
    recommendations.push(
      "Small contact network limits options - spend time networking to expand"
    );
  }

  // High value but low loyalty
  const highValueLowLoyalty = contacts.filter(
    (c) => c.status === "active" && c.connection >= 5 && c.loyalty <= 2
  );
  if (highValueLowLoyalty.length > 0) {
    recommendations.push(
      `${highValueLowLoyalty[0].name} is valuable (Connection ${highValueLowLoyalty[0].connection}) ` +
        `but unreliable (Loyalty ${highValueLowLoyalty[0].loyalty}) - invest in this relationship`
    );
  }

  return recommendations;
}

// =============================================================================
// CONTACT SORTING AND FILTERING
// =============================================================================

/**
 * Sort contacts by various criteria
 */
export type ContactSortField =
  | "name"
  | "connection"
  | "loyalty"
  | "value"
  | "favorBalance"
  | "lastContacted";

/**
 * Sort contacts by a specified field
 *
 * @param contacts - Contacts to sort
 * @param field - Field to sort by
 * @param ascending - Sort order
 * @returns Sorted contacts
 */
export function sortContacts(
  contacts: SocialContact[],
  field: ContactSortField,
  ascending: boolean = true
): SocialContact[] {
  const sorted = [...contacts].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "name":
        comparison = (a.name || "").localeCompare(b.name || "");
        break;
      case "connection":
        comparison = a.connection - b.connection;
        break;
      case "loyalty":
        comparison = a.loyalty - b.loyalty;
        break;
      case "value":
        comparison =
          a.connection + a.loyalty - (b.connection + b.loyalty);
        break;
      case "favorBalance":
        comparison = (a.favorBalance || 0) - (b.favorBalance || 0);
        break;
      case "lastContacted":
        comparison = (a.lastContactedAt || "").localeCompare(
          b.lastContactedAt || ""
        );
        break;
    }

    return ascending ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Group contacts by a field
 *
 * @param contacts - Contacts to group
 * @param field - Field to group by
 * @returns Grouped contacts
 */
export function groupContactsBy(
  contacts: SocialContact[],
  field: "archetype" | "location" | "status" | "organization"
): Record<string, SocialContact[]> {
  const groups: Record<string, SocialContact[]> = {};

  for (const contact of contacts) {
    let key: string;

    switch (field) {
      case "archetype":
        key = contact.archetype || "Unknown";
        break;
      case "location":
        key = contact.location || "Unknown";
        break;
      case "status":
        key = contact.status;
        break;
      case "organization":
        key = contact.organization || "Independent";
        break;
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(contact);
  }

  return groups;
}
