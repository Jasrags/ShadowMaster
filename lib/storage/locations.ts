/**
 * Location storage layer
 *
 * File-based storage for locations in data/campaigns/{campaignId}/locations/{id}.json
 */

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationFilters,
  LocationTemplate,
  CreateLocationTemplateRequest,
  LocationTemplateFilters,
  ID,
  LocationConnection,
} from "../types";

/**
 * Get the locations directory for a campaign
 */
function getLocationsDir(campaignId: string): string {
  return path.join(process.cwd(), "data", "campaigns", campaignId, "locations");
}

/**
 * Ensures the locations directory exists for a campaign
 */
async function ensureLocationsDirectory(campaignId: string): Promise<void> {
  const locationsDir = getLocationsDir(campaignId);
  try {
    await fs.mkdir(locationsDir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

function getLocationFilePath(campaignId: string, locationId: string): string {
  return path.join(getLocationsDir(campaignId), `${locationId}.json`);
}

/**
 * Get the connections directory for a campaign
 */
function getConnectionsDir(campaignId: string): string {
  return path.join(process.cwd(), "data", "campaigns", campaignId, "connections");
}

/**
 * Ensures the connections directory exists for a campaign
 */
async function ensureConnectionsDirectory(campaignId: string): Promise<void> {
  const connectionsDir = getConnectionsDir(campaignId);
  try {
    await fs.mkdir(connectionsDir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

function getConnectionFilePath(campaignId: string, connectionId: string): string {
  return path.join(getConnectionsDir(campaignId), `${connectionId}.json`);
}

/**
 * Get the templates directory
 */
function getTemplatesDir(): string {
  return path.join(process.cwd(), "data", "templates");
}

/**
 * Ensures the templates directory exists
 */
async function ensureTemplatesDirectory(): Promise<void> {
  const templatesDir = getTemplatesDir();
  try {
    await fs.mkdir(templatesDir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Get the file path for a template by ID
 */
function getTemplateFilePath(templateId: string): string {
  return path.join(getTemplatesDir(), `${templateId}.json`);
}

/**
 * Write location to file atomically
 */
async function writeLocation(campaignId: string, location: Location): Promise<void> {
  await ensureLocationsDirectory(campaignId);
  const filePath = getLocationFilePath(campaignId, location.id);
  const tempFilePath = `${filePath}.tmp`;

  try {
    await fs.writeFile(tempFilePath, JSON.stringify(location, null, 2), "utf-8");
    await fs.rename(tempFilePath, filePath);
  } catch (error) {
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

// -----------------------------------------------------------------------------
// CRUD Operations
// -----------------------------------------------------------------------------

/**
 * Create a new location
 */
export async function createLocation(
  campaignId: ID,
  data: CreateLocationRequest
): Promise<Location> {
  const now = new Date().toISOString();
  const location: Location = {
    id: uuidv4(),
    campaignId,
    name: data.name,
    type: data.type,
    description: data.description,
    visibility: data.visibility,
    gmNotes: data.gmNotes,
    address: data.address,
    coordinates: data.coordinates,
    district: data.district,
    city: data.city,
    country: data.country,
    parentLocationId: data.parentLocationId,
    securityRating: data.securityRating,
    matrixHost: data.matrixHost,
    astralProperties: data.astralProperties,
    modifiers: data.modifiers,
    imageUrl: data.imageUrl,
    images: data.images,
    mapUrl: data.mapUrl,
    tags: data.tags,
    childLocationIds: [],
    relatedLocationIds: [],
    npcIds: [],
    gruntTeamIds: [],
    encounterIds: [],
    sessionIds: [],
    visitedByCharacterIds: [],
    visitCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await writeLocation(campaignId, location);

  // If parent location exists, add this as child
  if (data.parentLocationId) {
    await addChildToParent(campaignId, data.parentLocationId, location.id);
  }

  return location;
}

/**
 * Get location by ID
 */
export async function getLocation(
  campaignId: string,
  locationId: string
): Promise<Location | null> {
  try {
    const filePath = getLocationFilePath(campaignId, locationId);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as Location;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get all locations for a campaign
 */
export async function getLocationsByCampaign(
  campaignId: ID,
  filters?: LocationFilters
): Promise<Location[]> {
  try {
    await ensureLocationsDirectory(campaignId);
    const locationsDir = getLocationsDir(campaignId);
    const files = await fs.readdir(locationsDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    let locations: Location[] = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(locationsDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const location = JSON.parse(fileContent) as Location;
        locations.push(location);
      } catch (error) {
        console.error(`Error reading location file ${file}:`, error);
      }
    }

    // Apply filters
    if (filters) {
      if (filters.type) {
        locations = locations.filter((l) => l.type === filters.type);
      }
      if (filters.visibility) {
        locations = locations.filter((l) => l.visibility === filters.visibility);
      }
      if (filters.parentId) {
        locations = locations.filter((l) => l.parentLocationId === filters.parentId);
      }
      if (filters.tags && filters.tags.length > 0) {
        locations = locations.filter((l) => filters.tags!.some((tag) => l.tags?.includes(tag)));
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        locations = locations.filter(
          (l) =>
            l.name.toLowerCase().includes(searchLower) ||
            l.description?.toLowerCase().includes(searchLower)
        );
      }
    }

    return locations;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Update a location
 */
export async function updateLocation(
  campaignId: string,
  locationId: string,
  updates: UpdateLocationRequest
): Promise<Location> {
  const location = await getLocation(campaignId, locationId);
  if (!location) {
    throw new Error(`Location with ID ${locationId} not found`);
  }

  const oldParentId = location.parentLocationId;
  const newParentId = updates.parentLocationId;

  const updatedLocation: Location = {
    ...location,
    ...updates,
    id: location.id, // Ensure ID cannot be changed
    campaignId: location.campaignId, // Ensure campaign cannot be changed
    createdAt: location.createdAt,
    updatedAt: new Date().toISOString(),
    // Handle null parentLocationId to remove parent
    parentLocationId:
      updates.parentLocationId === null
        ? undefined
        : (updates.parentLocationId ?? location.parentLocationId),
  };

  await writeLocation(campaignId, updatedLocation);

  // Handle parent relationship changes
  if (oldParentId !== newParentId) {
    if (oldParentId) {
      await removeChildFromParent(campaignId, oldParentId, locationId);
    }
    if (newParentId && newParentId !== null) {
      await addChildToParent(campaignId, newParentId, locationId);
    }
  }

  return updatedLocation;
}

/**
 * Delete a location
 */
export async function deleteLocation(campaignId: string, locationId: string): Promise<void> {
  const location = await getLocation(campaignId, locationId);
  if (!location) {
    throw new Error(`Location with ID ${locationId} not found`);
  }

  // Remove from parent's child list
  if (location.parentLocationId) {
    await removeChildFromParent(campaignId, location.parentLocationId, locationId);
  }

  // Update children to remove parent reference
  if (location.childLocationIds) {
    for (const childId of location.childLocationIds) {
      const child = await getLocation(campaignId, childId);
      if (child) {
        await updateLocation(campaignId, childId, { parentLocationId: null });
      }
    }
  }

  const filePath = getLocationFilePath(campaignId, locationId);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

// -----------------------------------------------------------------------------
// Hierarchy Operations
// -----------------------------------------------------------------------------

/**
 * Add a child to parent location
 */
async function addChildToParent(
  campaignId: string,
  parentId: string,
  childId: string
): Promise<void> {
  const parent = await getLocation(campaignId, parentId);
  if (parent) {
    const childIds = parent.childLocationIds || [];
    if (!childIds.includes(childId)) {
      const updatedParent: Location = {
        ...parent,
        childLocationIds: [...childIds, childId],
        updatedAt: new Date().toISOString(),
      };
      await writeLocation(campaignId, updatedParent);
    }
  }
}

/**
 * Remove a child from parent location
 */
async function removeChildFromParent(
  campaignId: string,
  parentId: string,
  childId: string
): Promise<void> {
  const parent = await getLocation(campaignId, parentId);
  if (parent && parent.childLocationIds) {
    const updatedParent: Location = {
      ...parent,
      childLocationIds: parent.childLocationIds.filter((id) => id !== childId),
      updatedAt: new Date().toISOString(),
    };
    await writeLocation(campaignId, updatedParent);
  }
}

/**
 * Get location hierarchy (tree structure)
 */
export async function getLocationHierarchy(
  campaignId: ID,
  rootLocationId?: ID
): Promise<Location[]> {
  const allLocations = await getLocationsByCampaign(campaignId);

  if (rootLocationId) {
    // Return only locations under specified root
    const root = allLocations.find((l) => l.id === rootLocationId);
    if (!root) return [];

    function getDescendants(parentId: ID): Location[] {
      const children = allLocations.filter((l) => l.parentLocationId === parentId);
      let result = [...children];
      for (const child of children) {
        result = [...result, ...getDescendants(child.id)];
      }
      return result;
    }

    return [root, ...getDescendants(rootLocationId)];
  }

  // Return all top-level locations (no parent)
  return allLocations.filter((l) => !l.parentLocationId);
}

// -----------------------------------------------------------------------------
// Content Linking Operations
// -----------------------------------------------------------------------------

/**
 * Link content to a location
 */
export async function linkContentToLocation(
  campaignId: string,
  locationId: string,
  type: "npc" | "grunt" | "encounter" | "session",
  targetId: ID,
  hidden: boolean = false
): Promise<Location> {
  const location = await getLocation(campaignId, locationId);
  if (!location) {
    throw new Error(`Location with ID ${locationId} not found`);
  }

  const fieldMap: Record<string, keyof Location> = {
    npc: "npcIds",
    grunt: "gruntTeamIds",
    encounter: "encounterIds",
    session: "sessionIds",
  };

  const field = fieldMap[type];

  // Handle hidden content
  if (hidden) {
    if (type === "session") {
      // Sessions cannot be hidden currently as per type definition, or we treat them as normal notes?
      // For now, let's just ignore or throw, but better to just return if not supported.
      // gmOnlyContent doesn't have sessionIds.
      return location;
    }

    if (field === "npcIds" || field === "gruntTeamIds" || field === "encounterIds") {
      const gmOnlyContent = location.gmOnlyContent || {};
      const currentIds = (gmOnlyContent[field] as ID[] | undefined) || [];

      if (currentIds.includes(targetId)) {
        return location;
      }

      const updatedLocation: Location = {
        ...location,
        gmOnlyContent: {
          ...gmOnlyContent,
          [field]: [...currentIds, targetId],
        },
        updatedAt: new Date().toISOString(),
      };

      await writeLocation(campaignId, updatedLocation);
      return updatedLocation;
    }

    // If field is not supported in gmOnlyContent (e.g. sessionIds)
    return location;
  }

  const currentIds = (location[field] as ID[] | undefined) || [];

  if (currentIds.includes(targetId)) {
    return location; // Already linked
  }

  const updatedLocation: Location = {
    ...location,
    [field]: [...currentIds, targetId],
    updatedAt: new Date().toISOString(),
  };

  await writeLocation(campaignId, updatedLocation);
  return updatedLocation;
}

/**
 * Unlink content from a location
 */
export async function unlinkContentFromLocation(
  campaignId: string,
  locationId: string,
  type: "npc" | "grunt" | "encounter" | "session",
  targetId: ID,
  hidden: boolean = false
): Promise<Location> {
  const location = await getLocation(campaignId, locationId);
  if (!location) {
    throw new Error(`Location with ID ${locationId} not found`);
  }

  const fieldMap: Record<string, keyof Location> = {
    npc: "npcIds",
    grunt: "gruntTeamIds",
    encounter: "encounterIds",
    session: "sessionIds",
  };

  const field = fieldMap[type];

  // Handle hidden content
  if (hidden) {
    if (type === "session") return location;

    if (field === "npcIds" || field === "gruntTeamIds" || field === "encounterIds") {
      const gmOnlyContent = location.gmOnlyContent || {};
      const currentIds = (gmOnlyContent[field] as ID[] | undefined) || [];

      const updatedLocation: Location = {
        ...location,
        gmOnlyContent: {
          ...gmOnlyContent,
          [field]: currentIds.filter((id) => id !== targetId),
        },
        updatedAt: new Date().toISOString(),
      };

      await writeLocation(campaignId, updatedLocation);
      return updatedLocation;
    }

    return location;
  }

  const currentIds = (location[field] as ID[] | undefined) || [];

  const updatedLocation: Location = {
    ...location,
    [field]: currentIds.filter((id) => id !== targetId),
    updatedAt: new Date().toISOString(),
  };

  await writeLocation(campaignId, updatedLocation);
  return updatedLocation;
}

// -----------------------------------------------------------------------------
// Visit Tracking Operations
// -----------------------------------------------------------------------------

/**
 * Record a location visit
 */
export async function recordLocationVisit(
  campaignId: string,
  locationId: string,
  characterId: ID,
  sessionId?: ID
): Promise<Location> {
  const location = await getLocation(campaignId, locationId);
  if (!location) {
    throw new Error(`Location with ID ${locationId} not found`);
  }

  const now = new Date().toISOString();
  const visitedByCharacterIds = location.visitedByCharacterIds || [];
  const isFirstVisit = !visitedByCharacterIds.includes(characterId);

  const updatedLocation: Location = {
    ...location,
    firstVisitedAt: location.firstVisitedAt || now,
    lastVisitedAt: now,
    visitCount: (location.visitCount || 0) + 1,
    visitedByCharacterIds: isFirstVisit
      ? [...visitedByCharacterIds, characterId]
      : visitedByCharacterIds,
    sessionIds: sessionId
      ? [...(location.sessionIds || []).filter((id) => id !== sessionId), sessionId]
      : location.sessionIds,
    updatedAt: now,
  };

  await writeLocation(campaignId, updatedLocation);
  return updatedLocation;
}

// -----------------------------------------------------------------------------
// Search Operations
// -----------------------------------------------------------------------------

/**
 * Search locations by query
 */
export async function searchLocations(campaignId: ID, query: string): Promise<Location[]> {
  return getLocationsByCampaign(campaignId, { search: query });
}

// -----------------------------------------------------------------------------
// Template Operations
// -----------------------------------------------------------------------------

/**
 * Create a location template
 */
export async function createLocationTemplate(
  userId: ID,
  data: CreateLocationTemplateRequest
): Promise<LocationTemplate> {
  await ensureTemplatesDirectory();
  const now = new Date().toISOString();

  const template: LocationTemplate = {
    id: uuidv4(),
    createdBy: userId,
    name: data.name,
    description: data.description,
    type: data.type,
    templateData: data.templateData,
    tags: data.tags,
    isPublic: data.isPublic,
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getTemplateFilePath(template.id);
  await fs.writeFile(filePath, JSON.stringify(template, null, 2), "utf-8");

  return template;
}

/**
 * Get location templates
 */
export async function getLocationTemplates(
  filters?: LocationTemplateFilters
): Promise<LocationTemplate[]> {
  try {
    await ensureTemplatesDirectory();
    const templatesDir = getTemplatesDir();
    const files = await fs.readdir(templatesDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    let templates: LocationTemplate[] = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(templatesDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const template = JSON.parse(fileContent) as LocationTemplate;
        templates.push(template);
      } catch (error) {
        console.error(`Error reading template file ${file}:`, error);
      }
    }

    // Apply filters
    if (filters) {
      if (filters.userId) {
        // Return templates created by user OR public templates
        templates = templates.filter((t) => t.createdBy === filters.userId || t.isPublic);
      } else if (filters.public !== undefined) {
        templates = templates.filter((t) => t.isPublic === filters.public);
      }

      if (filters.type) {
        templates = templates.filter((t) => t.type === filters.type);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        templates = templates.filter(
          (t) =>
            t.name.toLowerCase().includes(searchLower) ||
            t.description?.toLowerCase().includes(searchLower)
        );
      }
    }

    return templates;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Get a single location template
 */
export async function getLocationTemplate(templateId: ID): Promise<LocationTemplate | null> {
  try {
    const filePath = getTemplateFilePath(templateId);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as LocationTemplate;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Increment template usage count
 */
export async function incrementTemplateUsage(templateId: ID): Promise<void> {
  const template = await getLocationTemplate(templateId);
  if (template) {
    const updatedTemplate: LocationTemplate = {
      ...template,
      usageCount: template.usageCount + 1,
      updatedAt: new Date().toISOString(),
    };
    const filePath = getTemplateFilePath(templateId);
    await fs.writeFile(filePath, JSON.stringify(updatedTemplate, null, 2), "utf-8");
  }
}

// -----------------------------------------------------------------------------
// Export/Import Operations
// -----------------------------------------------------------------------------

/**
 * Export all locations for a campaign
 */
export async function exportLocations(campaignId: ID): Promise<Location[]> {
  return getLocationsByCampaign(campaignId);
}

/**
 * Import locations into a campaign
 *
 * Generates new IDs for all imported locations to avoid conflicts.
 * Updates hierarchy and relationship references to point to the new IDs.
 * Strips campaign-specific data like visit history and session links.
 */
export async function importLocations(campaignId: ID, locations: Location[]): Promise<Location[]> {
  const now = new Date().toISOString();
  // Use Object.create(null) for prototype-less object to prevent property injection
  const idMap: Record<string, string> = Object.create(null);
  const newLocations: Location[] = [];

  // 1. Generate new IDs for all imported locations
  for (const loc of locations) {
    idMap[loc.id] = uuidv4();
  }

  // 2. Process each location
  for (const loc of locations) {
    // Remap parent ID if it exists in the import set
    const newParentId =
      loc.parentLocationId && idMap[loc.parentLocationId] ? idMap[loc.parentLocationId] : undefined; // Orphan if parent not included in import

    // Remap child IDs
    const newChildIds = (loc.childLocationIds || [])
      .map((id) => idMap[id])
      .filter((id) => id !== undefined);

    // Remap related IDs
    const newRelatedIds = (loc.relatedLocationIds || [])
      .map((id) => idMap[id])
      .filter((id) => id !== undefined);

    const newLocation: Location = {
      ...loc,
      id: idMap[loc.id],
      campaignId: campaignId,
      parentLocationId: newParentId,
      childLocationIds: newChildIds,
      relatedLocationIds: newRelatedIds,
      // Reset tracking data
      npcIds: [], // NPCs might not exist in new campaign
      gruntTeamIds: [],
      encounterIds: [],
      sessionIds: [],
      visitedByCharacterIds: [],
      visitCount: 0,
      firstVisitedAt: undefined,
      lastVisitedAt: undefined,
      createdAt: now,
      updatedAt: now,
    };

    newLocations.push(newLocation);
  }

  // 3. Save all new locations
  // We update parent/child relationships automatically via createLocation if we used it,
  // but here we have pre-calculated them. However, writeLocation just writes the file.
  // We need to be careful about order or just write them all.
  // Since we've already remapped childIds and parentId, we can just write them.
  // Double linking (parent->child and child->parent) is handled by the remapping above,
  // assuming the input data was consistent.

  for (const loc of newLocations) {
    await writeLocation(campaignId, loc);
  }

  return newLocations;
}

// -----------------------------------------------------------------------------
// Connection Operations
// -----------------------------------------------------------------------------

/**
 * Create a connection between locations
 */
export async function createLocationConnection(
  campaignId: string,
  data: Omit<LocationConnection, "id">
): Promise<LocationConnection> {
  await ensureConnectionsDirectory(campaignId);

  const connection: LocationConnection = {
    ...data,
    id: uuidv4(),
  };

  const filePath = getConnectionFilePath(campaignId, connection.id);
  await fs.writeFile(filePath, JSON.stringify(connection, null, 2), "utf-8");

  return connection;
}

/**
 * Get all connections for a campaign or specific location
 */
export async function getLocationConnections(
  campaignId: string,
  locationId?: string
): Promise<LocationConnection[]> {
  try {
    await ensureConnectionsDirectory(campaignId);
    const connectionsDir = getConnectionsDir(campaignId);
    const files = await fs.readdir(connectionsDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const connections: LocationConnection[] = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(connectionsDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const connection = JSON.parse(fileContent) as LocationConnection;

        if (
          !locationId ||
          connection.fromLocationId === locationId ||
          connection.toLocationId === locationId
        ) {
          connections.push(connection);
        }
      } catch (error) {
        console.error(`Error reading connection file ${file}:`, error);
      }
    }

    return connections;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Delete a location connection
 */
export async function deleteLocationConnection(
  campaignId: string,
  connectionId: string
): Promise<void> {
  const filePath = getConnectionFilePath(campaignId, connectionId);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
