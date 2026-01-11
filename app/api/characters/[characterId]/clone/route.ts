/**
 * API Route: /api/characters/[characterId]/clone
 *
 * POST - Clone a character as a new draft
 *
 * Creates a copy of an existing character as a new draft,
 * allowing users to create variations without modifying the original.
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth/session";
import { importCharacter, updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import { createAuditEntry } from "@/lib/rules/character/state-machine";
import type { Character, CharacterDraft } from "@/lib/types/character";

interface CloneRequestBody {
  /** Optional new name for the cloned character */
  name?: string;
  /** Whether to include gear in the clone */
  includeGear?: boolean;
  /** Whether to include contacts in the clone */
  includeContacts?: boolean;
  /** Campaign to associate the clone with (optional) */
  campaignId?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Authorize view access (need to see the character to clone it)
    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "view");

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const sourceCharacter = authResult.character!;

    // Parse request body
    let body: CloneRequestBody = {};
    try {
      body = await request.json();
    } catch {
      // No body - use defaults
    }

    const includeGear = body.includeGear ?? true;
    const includeContacts = body.includeContacts ?? true;

    // Create the cloned character as a draft (id will be assigned by importCharacter)
    const clonedCharacter: Partial<CharacterDraft> = {
      // Set as draft
      status: "draft",

      // Copy edition and creation method
      editionId: sourceCharacter.editionId,
      editionCode: sourceCharacter.editionCode,
      creationMethodId: sourceCharacter.creationMethodId,
      creationMethodVersion: sourceCharacter.creationMethodVersion,
      attachedBookIds: [...sourceCharacter.attachedBookIds],

      // New name or copy with suffix
      name: body.name || `${sourceCharacter.name} (Copy)`,

      // Copy character data
      metatype: sourceCharacter.metatype,
      gender: sourceCharacter.gender,
      age: sourceCharacter.age,
      height: sourceCharacter.height,
      weight: sourceCharacter.weight,
      ethnicity: sourceCharacter.ethnicity,
      description: sourceCharacter.description,
      background: sourceCharacter.background,

      // Copy attributes
      attributes: { ...sourceCharacter.attributes },
      specialAttributes: { ...sourceCharacter.specialAttributes },

      // Copy skills
      skills: { ...sourceCharacter.skills },
      skillSpecializations: sourceCharacter.skillSpecializations
        ? { ...sourceCharacter.skillSpecializations }
        : undefined,
      knowledgeSkills: sourceCharacter.knowledgeSkills
        ? [...sourceCharacter.knowledgeSkills]
        : undefined,
      languages: sourceCharacter.languages ? [...sourceCharacter.languages] : undefined,

      // Copy qualities
      positiveQualities: [...sourceCharacter.positiveQualities],
      negativeQualities: [...sourceCharacter.negativeQualities],
      racialQualities: sourceCharacter.racialQualities
        ? [...sourceCharacter.racialQualities]
        : undefined,

      // Copy magic/resonance
      magicalPath: sourceCharacter.magicalPath,
      tradition: sourceCharacter.tradition,
      mentorSpirit: sourceCharacter.mentorSpirit,
      stream: sourceCharacter.stream,
      spells: sourceCharacter.spells ? [...sourceCharacter.spells] : undefined,
      adeptPowers: sourceCharacter.adeptPowers
        ? sourceCharacter.adeptPowers.map((p) => ({ ...p }))
        : undefined,
      complexForms: sourceCharacter.complexForms ? [...sourceCharacter.complexForms] : undefined,

      // Conditionally copy gear
      gear: includeGear ? sourceCharacter.gear.map((g) => ({ ...g })) : [],
      weapons:
        includeGear && sourceCharacter.weapons
          ? sourceCharacter.weapons.map((w) => ({ ...w }))
          : undefined,
      armor:
        includeGear && sourceCharacter.armor
          ? sourceCharacter.armor.map((a) => ({ ...a }))
          : undefined,
      cyberware:
        includeGear && sourceCharacter.cyberware
          ? sourceCharacter.cyberware.map((c) => ({ ...c }))
          : undefined,
      bioware:
        includeGear && sourceCharacter.bioware
          ? sourceCharacter.bioware.map((b) => ({ ...b }))
          : undefined,
      vehicles:
        includeGear && sourceCharacter.vehicles
          ? sourceCharacter.vehicles.map((v) => ({ ...v }))
          : undefined,
      drones:
        includeGear && sourceCharacter.drones
          ? sourceCharacter.drones.map((d) => ({ ...d }))
          : undefined,
      foci:
        includeGear && sourceCharacter.foci
          ? sourceCharacter.foci.map((f) => ({ ...f }))
          : undefined,

      // Conditionally copy contacts
      contacts: includeContacts ? sourceCharacter.contacts.map((c) => ({ ...c })) : [],

      // Copy identities and lifestyles (required for valid character)
      identities: sourceCharacter.identities
        ? sourceCharacter.identities.map((i) => ({
            ...i,
            id: uuidv4(), // New IDs for identities
          }))
        : undefined,
      lifestyles: sourceCharacter.lifestyles
        ? sourceCharacter.lifestyles.map((l) => ({
            ...l,
            id: uuidv4(), // New IDs for lifestyles
          }))
        : undefined,

      // Reset resources for draft
      nuyen: sourceCharacter.startingNuyen,
      startingNuyen: sourceCharacter.startingNuyen,

      // Reset karma
      karmaTotal: sourceCharacter.karmaSpentAtCreation,
      karmaCurrent: 0,
      karmaSpentAtCreation: sourceCharacter.karmaSpentAtCreation,

      // Copy derived stats
      derivedStats: { ...sourceCharacter.derivedStats },

      // Reset condition
      condition: {
        physicalDamage: 0,
        stunDamage: 0,
      },

      // Clear advancement history (this is a new character)
      advancementHistory: undefined,
      activeTraining: undefined,

      // Create audit log with clone entry
      auditLog: [
        createAuditEntry({
          action: "created",
          actor: { userId, role: "owner" },
          details: {
            clonedFrom: sourceCharacter.id,
            clonedFromName: sourceCharacter.name,
            includeGear,
            includeContacts,
          },
          note: `Cloned from "${sourceCharacter.name}"`,
        }),
      ],
    };

    // Save the cloned character using importCharacter
    let savedCharacter = await importCharacter(userId, clonedCharacter);

    // If a campaign was specified, update the character with the campaign association
    if (body.campaignId) {
      savedCharacter = await updateCharacter(userId, savedCharacter.id, {
        campaignId: body.campaignId,
      });
    }

    return NextResponse.json({
      success: true,
      character: savedCharacter,
      message: `Character cloned as "${savedCharacter.name}"`,
    });
  } catch (error) {
    console.error("Failed to clone character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clone character" },
      { status: 500 }
    );
  }
}
