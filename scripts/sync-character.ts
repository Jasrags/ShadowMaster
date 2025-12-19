
import fs from 'fs';
import path from 'path';

// Constants
const CORE_RULEBOOK_PATH = path.join(process.cwd(), 'data/editions/sr5/core-rulebook.json');
const CHARACTERS_BASE_DIR = path.join(process.cwd(), 'data/characters');

interface RulesetData {
    modules: {
        qualities: { payload: { positive: any[]; negative: any[]; racial?: any[] } };
        gear: { payload: { [key: string]: any } };
    };
}

async function syncCharacter(characterId: string) {
    console.log(`Starting sync for character: ${characterId}`);

    // 1. Load Rulebook
    if (!fs.existsSync(CORE_RULEBOOK_PATH)) {
        console.error(`Core rulebook not found at ${CORE_RULEBOOK_PATH}`);
        return;
    }
    const rulebook: RulesetData = JSON.parse(fs.readFileSync(CORE_RULEBOOK_PATH, 'utf-8'));

    // 2. Find Character File
    let characterPath = '';
    const findCharacterFile = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                findCharacterFile(fullPath);
            } else if (file === `${characterId}.json`) {
                characterPath = fullPath;
            }
        }
    };

    if (!fs.existsSync(CHARACTERS_BASE_DIR)) {
        console.error(`Characters directory not found at ${CHARACTERS_BASE_DIR}`);
        return;
    }
    findCharacterFile(CHARACTERS_BASE_DIR);

    if (!characterPath) {
        console.error(`Character file ${characterId}.json not found in ${CHARACTERS_BASE_DIR}`);
        return;
    }

    // 3. Load Character
    const character = JSON.parse(fs.readFileSync(characterPath, 'utf-8'));
    const charData = character.creationState?.data || character;

    // Flatten all catalog items from gear payload
    const gearPayload = rulebook.modules.gear.payload;
    const allCatalogItems: any[] = [];

    Object.keys(gearPayload).forEach(key => {
        if (key === 'categories') return;
        if (key === 'weapons') {
            Object.values(gearPayload.weapons).forEach((weaponList: any) => {
                allCatalogItems.push(...weaponList);
            });
        } else if (Array.isArray(gearPayload[key])) {
            allCatalogItems.push(...gearPayload[key]);
        }
    });

    const syncItems = (items: any[]) => {
        if (!items) return;
        items.forEach(item => {
            const rulebookItem = allCatalogItems.find(ri => ri.id === (item.catalogId || item.id) || ri.name === item.name);
            if (rulebookItem) {
                console.log(`Syncing item: ${item.name || item.id}`);
                Object.keys(rulebookItem).forEach(key => {
                    if (key !== 'id' && key !== 'name' && key !== 'quantity' && key !== 'equipped') {
                        item[key] = rulebookItem[key];
                    }
                });
            }
        });
    };

    // Sync Weapons, Armor, Gear, Vehicles
    syncItems(charData.weapons);
    syncItems(charData.armor);
    syncItems(charData.gear);
    syncItems(charData.vehicles);

    if (character.weapons) syncItems(character.weapons);
    if (character.armor) syncItems(character.armor);
    if (character.gear) syncItems(character.gear);
    if (character.vehicles) syncItems(character.vehicles);

    // Sync Qualities
    const syncQualities = (charQuals: any[], rulebookQuals: any[]) => {
        if (!charQuals) return;
        charQuals.forEach((q, index) => {
            const qId = typeof q === 'string' ? q : q.id;
            const rbQ = rulebookQuals.find(rq => rq.id === qId || rq.name === qId);
            if (rbQ) {
                console.log(`Verified quality: ${qId}`);
            } else {
                console.warn(`Quality not found in rulebook: ${qId}`);
            }
        });
    };

    const posQuals = rulebook.modules.qualities.payload.positive;
    const negQuals = rulebook.modules.qualities.payload.negative;

    syncQualities(charData.positiveQualities, posQuals);
    syncQualities(charData.negativeQualities, negQuals);
    if (character.positiveQualities) syncQualities(character.positiveQualities, posQuals);
    if (character.negativeQualities) syncQualities(character.negativeQualities, negQuals);

    // 4. Save Character
    fs.writeFileSync(characterPath, JSON.stringify(character, null, 2));
    console.log(`Sync complete. Saved to ${characterPath}`);
}

const targetId = process.argv[2];
if (!targetId) {
    console.error('Please provide a character ID.');
    process.exit(1);
}

syncCharacter(targetId).catch(console.error);
