/**
 * One-off script: Add weight data to all physical items in SR5 core-rulebook.json
 *
 * Weights are in kilograms, based on real-world equivalents and SR5 source material.
 * Items that are purely digital, cybernetic implants, or negligible weight (patches,
 * RFID tags, credsticks) are excluded.
 *
 * Usage:
 *   npx tsx data/migrations/add-catalog-weights.ts [--dry-run]
 */

import path from "path";
import fs from "fs/promises";

const RULEBOOK_PATH = path.join(process.cwd(), "data", "editions", "sr5", "core-rulebook.json");

// =============================================================================
// WEIGHT DATA (kg) — keyed by item ID
// =============================================================================

const WEIGHTS: Record<string, number> = {
  // -------------------------------------------------------------------------
  // MELEE WEAPONS
  // -------------------------------------------------------------------------
  // club, combat-knife, katana already have weight set
  "combat-axe": 2.5, // Heavy two-handed axe
  "extendable-baton": 0.5, // Collapsible steel baton
  "forearm-snap-blades": 0.3, // Wrist-mounted blades
  knife: 0.15, // Simple knife
  knucks: 0.2, // Brass knuckles
  "monofilament-whip": 0.3, // Handle + retractable wire
  "pole-arm": 3.0, // Halberd/glaive
  sap: 0.3, // Leather blackjack
  "shock-gloves": 0.3, // Gloves with taser element
  staff: 1.5, // Wooden/composite staff
  "stun-baton": 0.6, // Electric baton with battery
  "survival-knife": 0.3, // Utility/survival blade
  sword: 1.5, // One-handed sword
  "telescoping-staff": 1.0, // Collapsible metal staff

  // -------------------------------------------------------------------------
  // PISTOLS
  // -------------------------------------------------------------------------
  // ares-predator-v already has weight set
  "ares-light-fire-70": 0.6, // Light pistol
  "ares-light-fire-75": 0.65, // Light pistol w/ silencer
  "ares-s-iii-super-squirt": 0.7, // Squirt gun (light pistol frame)
  "ares-viper-slivergun": 1.1, // Heavy pistol, 30-round mag
  "beretta-201t": 0.7, // Light pistol w/ folding stock
  "browning-ultra-power": 1.2, // Heavy pistol
  "colt-america-l36": 0.6, // Light pistol
  "colt-government-2066": 1.1, // Heavy pistol
  "defiance-ex-shocker": 0.5, // Taser pistol
  "fichetti-pain-inducer": 0.8, // Microwave pistol (exotic)
  "fichetti-security-600": 0.7, // Light pistol w/ extended mag
  "fichetti-tiffani-needler": 0.3, // Holdout flechette pistol
  "parashield-dart-pistol": 0.8, // Dart pistol (heavy frame)
  "parashield-dart-rifle": 3.5, // Dart rifle (sport rifle frame)
  "remington-roomsweeper": 1.2, // Heavy pistol (shotgun rounds)
  "ruger-super-warhawk": 1.3, // Heavy revolver
  "streetline-special": 0.25, // Holdout pistol
  "taurus-omni-6": 0.7, // Light revolver
  "walther-palm-pistol": 0.2, // Holdout derringer
  "yamaha-pulsar": 0.5, // Taser

  // -------------------------------------------------------------------------
  // SMGS (Machine Pistols & Submachine Guns)
  // -------------------------------------------------------------------------
  "ares-crusader-ii": 1.5, // Machine pistol
  "ceska-black-scorpion": 1.3, // Machine pistol
  "colt-cobra-tz-120": 2.5, // Full SMG
  "fn-p93-praetor": 3.0, // Heavy SMG
  "hk-227": 2.7, // Classic SMG
  "ingram-smartgun-x": 2.5, // SMG
  "sck-model-100": 2.8, // SMG w/ smartgun
  "steyr-tmp": 1.4, // Machine pistol
  "uzi-iv": 2.2, // Compact SMG

  // -------------------------------------------------------------------------
  // RIFLES (Assault Rifles, LMGs, HMGs, Launchers, Cannons)
  // -------------------------------------------------------------------------
  // ares-alpha already has weight set
  "ak-97": 3.5, // Standard assault rifle
  "ares-antioch-2": 4.5, // Grenade launcher
  "armtech-mgl-12": 5.5, // 12-round grenade launcher
  "aztechnology-striker": 3.0, // Disposable missile launcher
  "colt-m23": 3.2, // Light assault rifle
  "fn-har": 4.0, // Heavy assault rifle
  "ingram-valiant": 8.5, // Light machine gun
  "krime-cannon": 15.0, // Assault cannon (troll-sized)
  "onotari-interceptor": 9.0, // Dual-tube missile launcher
  "panther-xxl": 18.0, // Heavy assault cannon
  "rpk-hmg": 25.0, // Heavy machine gun w/ tripod
  "stoner-ares-m202": 12.0, // Medium machine gun
  "yamaha-raiden": 4.2, // High-end assault rifle

  // -------------------------------------------------------------------------
  // SHOTGUNS
  // -------------------------------------------------------------------------
  "defiance-t-250": 3.5, // Pump-action shotgun
  "enfield-as-7": 4.0, // Automatic shotgun
  "pjss-model-55": 3.2, // Double-barrel sporting shotgun

  // -------------------------------------------------------------------------
  // SNIPER RIFLES
  // -------------------------------------------------------------------------
  "ares-desert-strike": 5.5, // Semi-auto sniper
  "cavalier-arms-crockett-ebr": 5.0, // Battle rifle
  "ranger-arms-sm-5": 4.5, // Briefcase sniper (disassembles)
  "remington-950": 4.0, // Bolt-action sniper
  "ruger-101": 4.2, // Semi-auto sniper

  // -------------------------------------------------------------------------
  // THROWING WEAPONS
  // -------------------------------------------------------------------------
  shuriken: 0.05, // Single throwing star
  "throwing-knife": 0.15, // Single throwing knife

  // -------------------------------------------------------------------------
  // BOWS & CROSSBOWS
  // -------------------------------------------------------------------------
  bow: 1.0, // Composite bow (varies by rating)
  "light-crossbow": 1.5, // Light crossbow
  "medium-crossbow": 2.5, // Medium crossbow
  "heavy-crossbow": 4.0, // Heavy crossbow

  // -------------------------------------------------------------------------
  // GRENADES & ROCKETS (per unit)
  // -------------------------------------------------------------------------
  "anti-vehicle-rocket": 5.0, // Anti-vehicle warhead
  "flash-bang-grenade": 0.4, // Flashbang
  "flash-pak": 0.3, // Flash device
  "fragmentation-grenade": 0.4, // Frag grenade
  "fragmentation-rocket": 4.5, // Frag rocket
  gas: 0.4, // Gas grenade
  "gas-grenade-cs-tear": 0.4, // CS gas grenade
  "high-explosive-grenade": 0.4, // HE grenade
  "high-explosive-rocket": 5.0, // HE rocket
  "smoke-grenade": 0.4, // Smoke grenade
  "thermal-smoke-grenade": 0.4, // IR smoke grenade

  // -------------------------------------------------------------------------
  // PROJECTILE AMMUNITION
  // -------------------------------------------------------------------------
  arrow: 0.03, // Single arrow
  "injection-arrow": 0.04, // Hollow injection arrow
  bolt: 0.04, // Crossbow bolt
  "injection-bolt": 0.05, // Hollow injection bolt

  // -------------------------------------------------------------------------
  // AMMUNITION (per box of 10)
  // -------------------------------------------------------------------------
  "apds-rounds": 0.15, // 10 APDS rounds
  "assault-cannon-rounds": 1.5, // 10 assault cannon rounds
  "explosive-rounds": 0.15, // 10 explosive rounds
  "flechette-rounds": 0.1, // 10 flechette rounds
  "gel-rounds": 0.15, // 10 gel rounds
  "hollow-point-rounds": 0.15, // 10 hollow point rounds
  "injection-rounds": 0.15, // 10 injection rounds
  "regular-rounds": 0.15, // 10 standard rounds
  "tracer-rounds": 0.15, // 10 tracer rounds

  // -------------------------------------------------------------------------
  // ARMOR (items without weight already set)
  // -------------------------------------------------------------------------
  "synth-leather": 1.5, // Light leather jacket
  "actioneer-business-clothes": 2.0, // Armored business suit
  "armor-clothing": 1.5, // Armored casual wear
  // armor-jacket: 3 (already set)
  // armor-vest: 2.5 (already set)
  "ballistic-shield": 5.0, // Ballistic shield
  "chameleon-suit": 3.0, // Thermoptic camo suit
  clothing: 0.5, // Regular clothing
  "electrochromatic-tshirt": 0.3, // Smart t-shirt
  // full-body-armor: 10 (already set)
  "full-body-armor-helmet": 1.5, // FBA helmet
  helmet: 1.0, // Standard helmet
  "lined-coat": 2.5, // Armored long coat
  "riot-shield": 4.5, // Riot shield
  "urban-explorer-jumpsuit": 2.0, // Armored jumpsuit
  "urban-explorer-jumpsuit-helmet": 1.0, // UE helmet

  // -------------------------------------------------------------------------
  // COMMLINKS (small handheld devices)
  // -------------------------------------------------------------------------
  "meta-link": 0.1, // Cheap commlink
  "sony-emperor": 0.1, // Basic commlink
  "renraku-sensei": 0.1, // Mid-range commlink
  "erika-elite": 0.1, // High-end commlink
  "hermes-ikon": 0.1, // Executive commlink
  "transys-avalon": 0.1, // Luxury commlink
  "fairlight-caliban": 0.1, // Top-tier commlink

  // -------------------------------------------------------------------------
  // CYBERDECKS (portable computing hardware)
  // -------------------------------------------------------------------------
  "erika-mcd-1": 0.5, // Entry-level deck
  "microdeck-summit": 0.5, // Budget deck
  "microtronica-azteca-200": 0.5, // Mid-range deck
  "hermes-chariot": 0.5, // Professional deck
  "novatech-navigator": 0.5, // High-end deck
  "renraku-tsurugi": 0.5, // Corporate deck
  "sony-ciy-720": 0.5, // High-end deck
  "shiawase-cyber-5": 0.5, // Elite deck
  "fairlight-excalibur": 0.5, // Legendary deck

  // -------------------------------------------------------------------------
  // ELECTRONICS
  // -------------------------------------------------------------------------
  "area-jammer": 2.0, // Area signal jammer (briefcase)
  binoculars: 0.5, // Electronic binoculars
  "binoculars-optical": 0.4, // Simple optical binoculars
  "bug-scanner": 0.3, // Handheld scanner
  camera: 0.2, // Electronic camera
  "data-tap": 0.1, // Small physical device
  headjammer: 0.15, // Headband jammer
  "micro-transceiver": 0.05, // Tiny radio
  "tag-eraser": 0.2, // RFID eraser
  "white-noise-generator": 0.3, // White noise box
  "directional-jammer": 1.0, // Directional signal jammer
  "directional-mic": 0.4, // Directional microphone
  goggles: 0.15, // Electronic goggles
  contacts: 0.01, // Contact lenses
  glasses: 0.05, // Electronic glasses
  endoscope: 0.3, // Fiber-optic camera probe
  "mage-sight-goggles": 0.2, // Special goggles
  headphones: 0.2, // Full headset
  "laser-microphone": 0.5, // Laser listening device
  "directional-microphone": 0.4, // Directional audio pickup
  "ear-buds": 0.02, // Small ear pieces
  "omni-directional-microphone": 0.1, // Standard mic
  "micro-camera": 0.02, // Tiny camera
  monocle: 0.03, // Single-eye device
  "omni-directional-mic": 0.1, // Omni mic
  "subvocal-mic": 0.02, // Throat mic

  // -------------------------------------------------------------------------
  // ACCESSORIES
  // -------------------------------------------------------------------------
  "ar-gloves": 0.15, // AR interaction gloves
  "biometric-reader": 0.2, // Biometric scanner
  "electronic-paper": 0.01, // Flexible display
  printer: 2.0, // Standard printer
  "satellite-link": 1.5, // Satellite uplink
  simrig: 0.3, // Simsense recorder
  "trid-projector": 0.5, // Holographic projector
  trodes: 0.05, // External electrodes

  // -------------------------------------------------------------------------
  // TOOLS
  // -------------------------------------------------------------------------
  "lockpick-set": 0.3, // Lockpicking tools
  autopicker: 0.3, // Electronic lockpick
  sequencer: 0.3, // Electronic keypad bypasser
  "maglock-passkey": 0.1, // Universal key device
  "cellular-glove-molder": 0.4, // Fingerprint forger
  "keycard-copier": 0.2, // Card cloner
  "tool-kit": 5.0, // Portable toolkit
  "tool-shop": 200.0, // Van-sized workshop
  "tool-facility": 2000.0, // Building-sized facility
  "chisel-crowbar": 1.0, // Chisel or crowbar
  miniwelder: 1.5, // Portable welder
  "miniwelder-fuel-canister": 0.5, // Fuel cartridge
  "monofilament-chainsaw": 4.0, // Monofilament chainsaw

  // -------------------------------------------------------------------------
  // SENSORS
  // -------------------------------------------------------------------------
  "handheld-housing": 0.5, // Portable sensor housing
  "wall-mounted-housing": 1.5, // Fixed sensor unit
  "sensor-array": 5.0, // Multi-function sensor package
  "single-sensor": 0.3, // Single function sensor

  // -------------------------------------------------------------------------
  // SECURITY DEVICES
  // -------------------------------------------------------------------------
  "key-combination-lock": 0.3, // Mechanical lock
  maglock: 0.5, // Electronic lock
  "motion-sensor": 0.2, // Motion detector
  "pressure-mat": 0.5, // Floor pressure sensor
  tripwire: 0.05, // Thin wire alarm

  // -------------------------------------------------------------------------
  // RESTRAINTS
  // -------------------------------------------------------------------------
  "restraints-metal": 0.3, // Metal handcuffs
  "restraints-plasteel": 0.4, // Plasteel restraints
  "restraints-plastic": 0.1, // Pack of 10 zip ties
  "containment-manacles": 1.0, // Heavy manacles

  // -------------------------------------------------------------------------
  // SURVIVAL GEAR
  // -------------------------------------------------------------------------
  chemsuit: 1.0, // Chemical protection suit
  "climbing-gear": 5.0, // Full climbing kit
  "rappelling-gloves": 0.15, // Rappelling gloves
  flashlight: 0.2, // Flashlight
  "diving-gear": 12.0, // Full dive kit with tank
  "gecko-tape-gloves": 0.2, // Adhesive climbing gloves
  "hazmat-suit": 4.0, // Full hazmat suit w/ air
  "light-stick": 0.05, // Chemical glow stick
  "magnesium-torch": 0.1, // Magnesium flare
  "micro-flare-launcher": 0.5, // Flare launcher
  "micro-flares": 0.05, // Flare ammo
  "grapple-gun": 1.5, // Grapple launcher
  "catalyst-stick": 0.1, // Chemical dissolving stick
  microwire: 0.5, // 100m ultra-thin wire
  "myomeric-rope": 0.5, // 10m smart rope
  "standard-rope": 3.0, // 100m climbing rope
  "stealth-rope": 3.0, // 100m dissolving rope
  "survival-kit": 3.0, // Kit w/ supplies
  respirator: 0.2, // Filter mask
  "gas-mask": 0.5, // Full face gas mask

  // -------------------------------------------------------------------------
  // INDUSTRIAL CHEMICALS
  // -------------------------------------------------------------------------
  "glue-solvent": 0.3, // Spray can
  "glue-sprayer": 0.4, // Aerosol can
  "thermite-burning-bar": 1.0, // Thermite bar with handle

  // -------------------------------------------------------------------------
  // MEDICAL
  // -------------------------------------------------------------------------
  biomonitor: 0.1, // Wristband health monitor
  "disposable-syringe": 0.02, // Single syringe
  medkit: 1.0, // First aid kit (rating 3-)
  "medkit-supplies": 0.3, // Replacement supplies
};

// Items to SKIP (no weight needed):
// - Patches (stim-patch, tranq-patch, trauma-patch, antidote-patch, slap-patch, chem-patch) — negligible, worn on skin
// - RFID Tags (standard-tags, datachip, security-tags, sensor-tags, stealth-tags) — negligible
// - Credsticks (certified, standard, silver, gold, platinum, ebony) — negligible card-sized
// - Digital items (sim-module, sim-module-hot-sim, fake-sin, fake-license) — data, not physical bulk
// - Armor modifications (electrochromic, feedback, chemical-protection, etc.) — integrated, no separate weight
// - Vision/Audio enhancements (flare-compensation, image-link, etc.) — installed into devices
// - Sensor functions (atmosphere-sensor, camera-sensor, etc.) — installed into housings
// - Maglock accessories (keypad-cardreader, anti-tamper, biometric-reader) — installed components
// - Magical lodge materials — varies wildly, location-based
// - Full body armor add-ons (chemical-seal, environmental-adaptation) — integrated into armor

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (dryRun) {
    console.log("=== DRY RUN — no files will be modified ===\n");
  }

  console.log("Adding weight data to SR5 core-rulebook.json\n");

  const raw = await fs.readFile(RULEBOOK_PATH, "utf-8");
  const rulebook = JSON.parse(raw);

  const gearModule = rulebook.modules?.gear?.payload;
  if (!gearModule) {
    console.error("Could not find gear module in core-rulebook.json");
    process.exit(1);
  }

  let totalUpdated = 0;
  let alreadyHadWeight = 0;
  let notFound = 0;

  function addWeightToItem(item: { id: string; name: string; weight?: number }): boolean {
    if (item.weight != null) {
      alreadyHadWeight++;
      return false;
    }
    const weight = WEIGHTS[item.id];
    if (weight != null) {
      item.weight = weight;
      totalUpdated++;
      return true;
    }
    return false;
  }

  function processArray(
    items: Array<{ id: string; name: string; weight?: number }>,
    label: string
  ) {
    let count = 0;
    for (const item of items) {
      if (addWeightToItem(item)) count++;
    }
    if (count > 0) console.log(`  ${label}: ${count} items updated`);
  }

  // Process weapons (nested by subcategory)
  if (gearModule.weapons) {
    for (const [subcat, items] of Object.entries(gearModule.weapons)) {
      if (Array.isArray(items)) {
        processArray(
          items as Array<{ id: string; name: string; weight?: number }>,
          `weapons/${subcat}`
        );
      }
    }
  }

  // Process flat arrays
  const flatCategories = [
    "armor",
    "commlinks",
    "cyberdecks",
    "electronics",
    "accessories",
    "tools",
    "survival",
    "medical",
    "security",
    "miscellaneous",
    "ammunition",
    "industrialChemicals",
    "rfidTags",
    "restraints",
  ];

  for (const cat of flatCategories) {
    if (Array.isArray(gearModule[cat])) {
      processArray(gearModule[cat], cat);
    }
  }

  // Process sensors (nested: housings[], functions[])
  if (gearModule.sensors) {
    if (Array.isArray(gearModule.sensors.housings)) {
      processArray(gearModule.sensors.housings, "sensors/housings");
    }
    // Sensor functions don't need weight (they're installed in housings)
  }

  // Process security devices
  if (Array.isArray(gearModule.securityDevices)) {
    processArray(gearModule.securityDevices, "securityDevices");
  }

  // Check for weight entries that didn't match any item
  const allItemIds = new Set<string>();
  function collectIds(items: Array<{ id: string }>) {
    for (const item of items) allItemIds.add(item.id);
  }

  if (gearModule.weapons) {
    for (const items of Object.values(gearModule.weapons)) {
      if (Array.isArray(items)) collectIds(items as Array<{ id: string }>);
    }
  }
  for (const cat of [...flatCategories, "securityDevices"]) {
    if (Array.isArray(gearModule[cat])) collectIds(gearModule[cat]);
  }
  if (gearModule.sensors?.housings) collectIds(gearModule.sensors.housings);

  for (const id of Object.keys(WEIGHTS)) {
    if (!allItemIds.has(id)) {
      console.warn(`  WARNING: Weight defined for '${id}' but no matching catalog item found`);
      notFound++;
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Items updated with weight: ${totalUpdated}`);
  console.log(`Items already had weight:  ${alreadyHadWeight}`);
  if (notFound > 0) console.log(`Orphaned weight entries:   ${notFound}`);

  if (!dryRun) {
    const tmpPath = `${RULEBOOK_PATH}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(rulebook, null, 2), "utf-8");
    await fs.rename(tmpPath, RULEBOOK_PATH);
    console.log("\nFile updated successfully.");
  } else {
    console.log("\n(Dry run — no files were modified)");
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
