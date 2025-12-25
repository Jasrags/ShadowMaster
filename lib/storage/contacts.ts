/**
 * Contact storage layer
 *
 * File-based storage for social contacts.
 *
 * Storage locations:
 * - Character contacts: stored within character JSON at data/characters/{userId}/{characterId}.json
 * - Campaign shared contacts: data/campaigns/{campaignId}/contacts/{contactId}.json
 *
 * Capability References:
 * - "Contact identities MUST be uniquely defined and bound to a persistent set of loyalty and connection attributes"
 * - "Contact networks MUST be persistent and discoverable"
 * - "Transitions in contact state MUST satisfy all prerequisites and resource requirements"
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ID, Character, Contact } from "../types";
import type {
  SocialContact,
  ContactStatus,
  ContactGroup,
  ContactFilters,
  CreateContactRequest,
  UpdateContactRequest,
  ContactVisibility,
} from "../types/contacts";
import {
  ensureDirectory,
  readJsonFile,
  writeJsonFile,
  deleteFile,
  readAllJsonFiles,
} from "./base";
import { getCharacter, updateCharacter } from "./characters";

// =============================================================================
// PATH UTILITIES
// =============================================================================

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Get the campaign contacts directory
 */
function getCampaignContactsDir(campaignId: ID): string {
  return path.join(DATA_DIR, "campaigns", campaignId, "contacts");
}

/**
 * Get the file path for a campaign contact
 */
function getCampaignContactPath(campaignId: ID, contactId: ID): string {
  return path.join(getCampaignContactsDir(campaignId), `${contactId}.json`);
}

// =============================================================================
// CHARACTER CONTACT OPERATIONS
// =============================================================================

/**
 * Get all contacts for a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns Array of contacts
 */
export async function getCharacterContacts(
  userId: ID,
  characterId: ID
): Promise<SocialContact[]> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    return [];
  }

  // Convert legacy Contact[] to SocialContact[] if needed
  return (character.contacts || []).map((c) => ensureSocialContact(c, characterId));
}

/**
 * Get a specific contact for a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @returns Contact or null if not found
 */
export async function getCharacterContact(
  userId: ID,
  characterId: ID,
  contactId: ID
): Promise<SocialContact | null> {
  const contacts = await getCharacterContacts(userId, characterId);
  return contacts.find((c) => c.id === contactId) || null;
}

/**
 * Add a new contact to a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param request - Contact creation request
 * @returns Created contact
 */
export async function addCharacterContact(
  userId: ID,
  characterId: ID,
  request: CreateContactRequest
): Promise<SocialContact> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const now = new Date().toISOString();
  const contactId = uuidv4();

  const contact: SocialContact = {
    id: contactId,
    characterId,
    name: request.name,
    connection: request.connection,
    loyalty: request.loyalty,
    archetype: request.archetype,
    archetypeId: request.archetypeId,
    description: request.description,
    specializations: request.specializations,
    location: request.location,
    locationId: request.locationId,
    organization: request.organization,
    metatype: request.metatype,
    notes: request.notes,
    status: "active",
    favorBalance: request.favorBalance ?? 0,
    group: request.group ?? "personal",
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
      ...request.visibility,
    },
    acquisitionMethod: "creation",
    createdAt: now,
  };

  // Add to character's contacts array
  const updatedContacts = [...(character.contacts || []), contact];

  await updateCharacter(userId, characterId, {
    contacts: updatedContacts as Character["contacts"],
  });

  return contact;
}

/**
 * Update a character's contact
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @param updates - Partial contact updates
 * @returns Updated contact
 */
export async function updateCharacterContact(
  userId: ID,
  characterId: ID,
  contactId: ID,
  updates: UpdateContactRequest
): Promise<SocialContact> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const contacts = (character.contacts || []).map((c) =>
    ensureSocialContact(c, characterId)
  );

  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const existingContact = contacts[contactIndex];

  // Build merged visibility with all required fields
  const mergedVisibility: ContactVisibility = {
    playerVisible: updates.visibility?.playerVisible ?? existingContact.visibility.playerVisible,
    showConnection: updates.visibility?.showConnection ?? existingContact.visibility.showConnection,
    showLoyalty: updates.visibility?.showLoyalty ?? existingContact.visibility.showLoyalty,
    showFavorBalance: updates.visibility?.showFavorBalance ?? existingContact.visibility.showFavorBalance,
    showSpecializations: updates.visibility?.showSpecializations ?? existingContact.visibility.showSpecializations,
  };

  const updatedContact: SocialContact = {
    ...existingContact,
    ...updates,
    id: existingContact.id, // Prevent ID change
    characterId: existingContact.characterId, // Prevent owner change
    visibility: mergedVisibility,
    updatedAt: new Date().toISOString(),
  };

  contacts[contactIndex] = updatedContact;

  await updateCharacter(userId, characterId, {
    contacts: contacts as Character["contacts"],
  });

  return updatedContact;
}

/**
 * Remove a contact from a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @returns True if removed, false if not found
 */
export async function removeCharacterContact(
  userId: ID,
  characterId: ID,
  contactId: ID
): Promise<boolean> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    return false;
  }

  const contacts = character.contacts || [];
  const initialLength = contacts.length;
  const filteredContacts = contacts.filter((c) => {
    const socialContact = ensureSocialContact(c, characterId);
    return socialContact.id !== contactId;
  });

  if (filteredContacts.length === initialLength) {
    return false;
  }

  await updateCharacter(userId, characterId, {
    contacts: filteredContacts as Character["contacts"],
  });

  return true;
}

/**
 * Burn a contact (change status to burned)
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @param reason - Reason for burning the contact
 * @returns Updated contact
 */
export async function burnContact(
  userId: ID,
  characterId: ID,
  contactId: ID,
  reason: string
): Promise<SocialContact> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const contacts = (character.contacts || []).map((c) =>
    ensureSocialContact(c, characterId)
  );

  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const existingContact = contacts[contactIndex];
  if (existingContact.status === "burned") {
    throw new Error(`Contact ${contactId} is already burned`);
  }

  const now = new Date().toISOString();
  const updatedContact: SocialContact = {
    ...existingContact,
    status: "burned",
    burnedReason: reason,
    burnedAt: now,
    updatedAt: now,
  };

  contacts[contactIndex] = updatedContact;

  await updateCharacter(userId, characterId, {
    contacts: contacts as Character["contacts"],
  });

  return updatedContact;
}

/**
 * Reactivate a burned/inactive contact
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @returns Updated contact
 */
export async function reactivateContact(
  userId: ID,
  characterId: ID,
  contactId: ID
): Promise<SocialContact> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const contacts = (character.contacts || []).map((c) =>
    ensureSocialContact(c, characterId)
  );

  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const existingContact = contacts[contactIndex];
  if (existingContact.status === "active") {
    throw new Error(`Contact ${contactId} is already active`);
  }

  if (existingContact.status === "deceased") {
    throw new Error(`Cannot reactivate deceased contact ${contactId}`);
  }

  const now = new Date().toISOString();
  const updatedContact: SocialContact = {
    ...existingContact,
    status: "active",
    updatedAt: now,
  };

  contacts[contactIndex] = updatedContact;

  await updateCharacter(userId, characterId, {
    contacts: contacts as Character["contacts"],
  });

  return updatedContact;
}

/**
 * Update contact loyalty
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @param newLoyalty - New loyalty rating
 * @returns Updated contact
 */
export async function updateContactLoyalty(
  userId: ID,
  characterId: ID,
  contactId: ID,
  newLoyalty: number
): Promise<SocialContact> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const contacts = (character.contacts || []).map((c) =>
    ensureSocialContact(c, characterId)
  );

  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const existingContact = contacts[contactIndex];
  const updatedContact: SocialContact = {
    ...existingContact,
    loyalty: newLoyalty,
    updatedAt: new Date().toISOString(),
  };

  contacts[contactIndex] = updatedContact;

  await updateCharacter(userId, characterId, {
    contacts: contacts as Character["contacts"],
  });

  return updatedContact;
}

/**
 * Update contact connection
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @param newConnection - New connection rating
 * @returns Updated contact
 */
export async function updateContactConnection(
  userId: ID,
  characterId: ID,
  contactId: ID,
  newConnection: number
): Promise<SocialContact> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const contacts = (character.contacts || []).map((c) =>
    ensureSocialContact(c, characterId)
  );

  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const existingContact = contacts[contactIndex];
  const updatedContact: SocialContact = {
    ...existingContact,
    connection: newConnection,
    updatedAt: new Date().toISOString(),
  };

  contacts[contactIndex] = updatedContact;

  await updateCharacter(userId, characterId, {
    contacts: contacts as Character["contacts"],
  });

  return updatedContact;
}

/**
 * Update contact favor balance
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @param change - Change to favor balance (+/-)
 * @returns Updated contact
 */
export async function updateContactFavorBalance(
  userId: ID,
  characterId: ID,
  contactId: ID,
  change: number
): Promise<SocialContact> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const contacts = (character.contacts || []).map((c) =>
    ensureSocialContact(c, characterId)
  );

  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const existingContact = contacts[contactIndex];
  const updatedContact: SocialContact = {
    ...existingContact,
    favorBalance: (existingContact.favorBalance || 0) + change,
    updatedAt: new Date().toISOString(),
  };

  contacts[contactIndex] = updatedContact;

  await updateCharacter(userId, characterId, {
    contacts: contacts as Character["contacts"],
  });

  return updatedContact;
}

// =============================================================================
// CAMPAIGN CONTACT OPERATIONS
// =============================================================================

/**
 * Get all contacts for a campaign
 *
 * @param campaignId - Campaign ID
 * @returns Array of campaign contacts
 */
export async function getCampaignContacts(
  campaignId: ID
): Promise<SocialContact[]> {
  const dir = getCampaignContactsDir(campaignId);
  return readAllJsonFiles<SocialContact>(dir);
}

/**
 * Get a specific campaign contact
 *
 * @param campaignId - Campaign ID
 * @param contactId - Contact ID
 * @returns Contact or null if not found
 */
export async function getCampaignContact(
  campaignId: ID,
  contactId: ID
): Promise<SocialContact | null> {
  const filePath = getCampaignContactPath(campaignId, contactId);
  return readJsonFile<SocialContact>(filePath);
}

/**
 * Create a new campaign contact
 *
 * @param campaignId - Campaign ID
 * @param request - Contact creation request
 * @returns Created contact
 */
export async function createCampaignContact(
  campaignId: ID,
  request: CreateContactRequest
): Promise<SocialContact> {
  const dir = getCampaignContactsDir(campaignId);
  await ensureDirectory(dir);

  const now = new Date().toISOString();
  const contactId = uuidv4();

  const contact: SocialContact = {
    id: contactId,
    campaignId,
    name: request.name,
    connection: request.connection,
    loyalty: request.loyalty,
    archetype: request.archetype,
    archetypeId: request.archetypeId,
    description: request.description,
    specializations: request.specializations,
    location: request.location,
    locationId: request.locationId,
    organization: request.organization,
    metatype: request.metatype,
    notes: request.notes,
    status: "active",
    favorBalance: request.favorBalance ?? 0,
    group: request.group ?? "campaign",
    visibility: {
      playerVisible: false,
      showConnection: false,
      showLoyalty: false,
      showFavorBalance: false,
      showSpecializations: false,
      ...request.visibility,
    },
    createdAt: now,
  };

  const filePath = getCampaignContactPath(campaignId, contactId);
  await writeJsonFile(filePath, contact);

  return contact;
}

/**
 * Update a campaign contact
 *
 * @param campaignId - Campaign ID
 * @param contactId - Contact ID
 * @param updates - Partial contact updates
 * @returns Updated contact
 */
export async function updateCampaignContact(
  campaignId: ID,
  contactId: ID,
  updates: UpdateContactRequest
): Promise<SocialContact> {
  const contact = await getCampaignContact(campaignId, contactId);
  if (!contact) {
    throw new Error(`Campaign contact ${contactId} not found`);
  }

  // Build merged visibility with all required fields
  const mergedVisibility: ContactVisibility = {
    playerVisible: updates.visibility?.playerVisible ?? contact.visibility.playerVisible,
    showConnection: updates.visibility?.showConnection ?? contact.visibility.showConnection,
    showLoyalty: updates.visibility?.showLoyalty ?? contact.visibility.showLoyalty,
    showFavorBalance: updates.visibility?.showFavorBalance ?? contact.visibility.showFavorBalance,
    showSpecializations: updates.visibility?.showSpecializations ?? contact.visibility.showSpecializations,
  };

  const updatedContact: SocialContact = {
    ...contact,
    ...updates,
    id: contact.id, // Prevent ID change
    campaignId: contact.campaignId, // Prevent campaign change
    visibility: mergedVisibility,
    updatedAt: new Date().toISOString(),
  };

  const filePath = getCampaignContactPath(campaignId, contactId);
  await writeJsonFile(filePath, updatedContact);

  return updatedContact;
}

/**
 * Delete a campaign contact
 *
 * @param campaignId - Campaign ID
 * @param contactId - Contact ID
 * @returns True if deleted, false if not found
 */
export async function deleteCampaignContact(
  campaignId: ID,
  contactId: ID
): Promise<boolean> {
  const filePath = getCampaignContactPath(campaignId, contactId);
  return deleteFile(filePath);
}

// =============================================================================
// SEARCH AND FILTER OPERATIONS
// =============================================================================

/**
 * Search contacts with filters
 *
 * @param characterId - Character ID for character contacts
 * @param userId - User ID for character contacts
 * @param campaignId - Optional campaign ID for campaign contacts
 * @param filters - Search filters
 * @returns Filtered contacts
 */
export async function searchContacts(
  userId: ID,
  characterId: ID,
  filters?: ContactFilters
): Promise<SocialContact[]> {
  let contacts = await getCharacterContacts(userId, characterId);

  if (!filters) {
    return contacts;
  }

  // Apply filters
  if (filters.archetype) {
    const archetypeLower = filters.archetype.toLowerCase();
    contacts = contacts.filter(
      (c) => c.archetype?.toLowerCase().includes(archetypeLower)
    );
  }

  if (filters.archetypeId) {
    contacts = contacts.filter((c) => c.archetypeId === filters.archetypeId);
  }

  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    contacts = contacts.filter(
      (c) => c.location?.toLowerCase().includes(locationLower)
    );
  }

  if (filters.locationId) {
    contacts = contacts.filter((c) => c.locationId === filters.locationId);
  }

  if (filters.organization) {
    const orgLower = filters.organization.toLowerCase();
    contacts = contacts.filter(
      (c) => c.organization?.toLowerCase().includes(orgLower)
    );
  }

  if (filters.organizationId) {
    contacts = contacts.filter((c) => c.organizationId === filters.organizationId);
  }

  if (filters.minConnection !== undefined) {
    contacts = contacts.filter((c) => c.connection >= filters.minConnection!);
  }

  if (filters.maxConnection !== undefined) {
    contacts = contacts.filter((c) => c.connection <= filters.maxConnection!);
  }

  if (filters.minLoyalty !== undefined) {
    contacts = contacts.filter((c) => c.loyalty >= filters.minLoyalty!);
  }

  if (filters.maxLoyalty !== undefined) {
    contacts = contacts.filter((c) => c.loyalty <= filters.maxLoyalty!);
  }

  if (filters.status) {
    contacts = contacts.filter((c) => c.status === filters.status);
  }

  if (filters.group) {
    contacts = contacts.filter((c) => c.group === filters.group);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    contacts = contacts.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(searchLower);
      const archetypeMatch = c.archetype?.toLowerCase().includes(searchLower);
      const notesMatch = c.notes?.toLowerCase().includes(searchLower);
      const specializationMatch = c.specializations?.some((s) =>
        s.toLowerCase().includes(searchLower)
      );
      return nameMatch || archetypeMatch || notesMatch || specializationMatch;
    });
  }

  return contacts;
}

/**
 * Search campaign contacts with filters
 *
 * @param campaignId - Campaign ID
 * @param filters - Search filters
 * @returns Filtered campaign contacts
 */
export async function searchCampaignContacts(
  campaignId: ID,
  filters?: ContactFilters
): Promise<SocialContact[]> {
  let contacts = await getCampaignContacts(campaignId);

  if (!filters) {
    return contacts;
  }

  // Apply same filters as character contacts
  if (filters.archetype) {
    const archetypeLower = filters.archetype.toLowerCase();
    contacts = contacts.filter(
      (c) => c.archetype?.toLowerCase().includes(archetypeLower)
    );
  }

  if (filters.archetypeId) {
    contacts = contacts.filter((c) => c.archetypeId === filters.archetypeId);
  }

  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    contacts = contacts.filter(
      (c) => c.location?.toLowerCase().includes(locationLower)
    );
  }

  if (filters.minConnection !== undefined) {
    contacts = contacts.filter((c) => c.connection >= filters.minConnection!);
  }

  if (filters.maxConnection !== undefined) {
    contacts = contacts.filter((c) => c.connection <= filters.maxConnection!);
  }

  if (filters.minLoyalty !== undefined) {
    contacts = contacts.filter((c) => c.loyalty >= filters.minLoyalty!);
  }

  if (filters.maxLoyalty !== undefined) {
    contacts = contacts.filter((c) => c.loyalty <= filters.maxLoyalty!);
  }

  if (filters.status) {
    contacts = contacts.filter((c) => c.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    contacts = contacts.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(searchLower);
      const archetypeMatch = c.archetype?.toLowerCase().includes(searchLower);
      const notesMatch = c.notes?.toLowerCase().includes(searchLower);
      return nameMatch || archetypeMatch || notesMatch;
    });
  }

  return contacts;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Ensure a contact has all SocialContact fields
 * Handles conversion from legacy Contact type
 */
function ensureSocialContact(
  contact: SocialContact | Contact,
  characterId?: ID
): SocialContact {
  // If it already has the id field and status, assume it's a SocialContact
  if ("id" in contact && "status" in contact && contact.id) {
    return contact as SocialContact;
  }

  // Convert from legacy Contact type
  const legacyContact = contact as Contact;

  return {
    id: uuidv4(), // Generate new ID for legacy contacts
    characterId,
    name: legacyContact.name,
    connection: legacyContact.connection,
    loyalty: legacyContact.loyalty,
    archetype: legacyContact.type || "Unknown",
    notes: legacyContact.notes,
    status: "active" as ContactStatus,
    favorBalance: 0,
    group: "personal" as ContactGroup,
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Calculate total contact points (connection + loyalty) for a contact
 */
export function calculateContactPoints(contact: SocialContact): number {
  return contact.connection + contact.loyalty;
}

/**
 * Calculate total contact points used by a character
 */
export async function calculateTotalContactPoints(
  userId: ID,
  characterId: ID
): Promise<number> {
  const contacts = await getCharacterContacts(userId, characterId);
  return contacts
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + calculateContactPoints(c), 0);
}

/**
 * Count contacts by status
 */
export async function countContactsByStatus(
  userId: ID,
  characterId: ID
): Promise<Record<ContactStatus, number>> {
  const contacts = await getCharacterContacts(userId, characterId);

  const counts: Record<ContactStatus, number> = {
    active: 0,
    burned: 0,
    inactive: 0,
    missing: 0,
    deceased: 0,
  };

  for (const contact of contacts) {
    counts[contact.status]++;
  }

  return counts;
}
