// ShadowMaster Web Interface
const API_BASE = '/api';
let legacyInitialized = false;
const legacyEditionData = {};
function isAuthenticated() {
    if (typeof window !== 'undefined' && window.ShadowmasterAuth) {
        return Boolean(window.ShadowmasterAuth.user);
    }
    return true;
}


function legacyNotify(message, type = 'info', title) {
    const descriptor = {
        type,
        title: title || (type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Notice'),
        description: message
    };
    if (typeof window !== 'undefined') {
        if (typeof window.ShadowmasterNotify === 'function') {
            window.ShadowmasterNotify(descriptor);
        } else {
            const logger = type === 'error' ? console.error : type === 'warning' ? console.warn : console.log;
            logger.call(console, message);
        }
    }
}

// Load characters
async function loadCharacters() {
    const listEl = document.getElementById('characters-list');
    if (!listEl) {
        return;
    }

    if (document.body.classList.contains('react-characters-enabled') || listEl.querySelector('.characters-react-shell')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/characters`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const characters = await response.json();
        listEl.innerHTML = '';

        if (!Array.isArray(characters) || characters.length === 0) {
            if (!listEl.querySelector('.characters-empty-fallback')) {
                const empty = document.createElement('p');
                empty.className = 'characters-empty-fallback';
                empty.textContent = 'No characters found. Create your first character!';
                listEl.appendChild(empty);
            }
            return;
        }

        characters.forEach((char) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <h3>${char.name}</h3>
                <p>Player: ${char.player_name || 'N/A'}</p>
                <p>Edition: ${char.edition || 'N/A'}</p>
            `;
            card.addEventListener('click', () => viewCharacterSheet(char.id));
            listEl.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load characters:', error);
        listEl.innerHTML = '<p class="error">Failed to load characters. Please try again.</p>';
    }
}

// Load campaigns
async function loadCampaigns() {
    if (!isAuthenticated()) {
        return;
    }

    const listEl = document.getElementById('campaigns-list');
    if (!listEl) {
        return;
    }

    if (document.body.classList.contains('react-campaign-enabled') || listEl.querySelector('.campaigns-react-shell')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/campaigns`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const campaigns = await response.json();

        if (document.body.classList.contains('react-campaign-enabled') || listEl.querySelector('.campaigns-react-shell')) {
            return;
        }

        listEl.innerHTML = '';

        if (!Array.isArray(campaigns) || campaigns.length === 0) {
            listEl.innerHTML = '<p>No campaigns found. Create your first campaign!</p>';
            return;
        }

        campaigns.forEach((campaign) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${campaign.name}</h3>
                <p>GM: ${campaign.gm_name || 'N/A'}</p>
                <p>Status: ${campaign.status}</p>
            `;
            const actions = document.createElement('div');
            actions.className = 'card-actions';
            const createBtn = document.createElement('button');
            createBtn.type = 'button';
            createBtn.className = 'btn-primary btn-small';
            createBtn.textContent = 'Create Character';
            createBtn.addEventListener('click', () => {
                void openCampaignCharacterCreator(campaign);
            });
            actions.appendChild(createBtn);
            card.appendChild(actions);
            listEl.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load campaigns:', error);
        listEl.innerHTML = '<p class="error">Failed to load campaigns. Please try again.</p>';
    }
}

async function openCampaignCharacterCreator(campaign) {
    const campaignId = campaign && campaign.id ? campaign.id : null;

    try {
        if (campaignId && typeof window !== 'undefined' && window.ShadowmasterLegacyApp?.loadCampaignCharacterCreation) {
            await window.ShadowmasterLegacyApp.loadCampaignCharacterCreation(campaignId);
        }
    } catch (error) {
        console.error('Failed to load campaign character creation defaults:', error);
        legacyNotify('Failed to load campaign defaults. Using base rules instead.', 'warning', 'Campaign defaults unavailable');
    }

    if (typeof window !== 'undefined' && typeof window.openCharacterWizard === 'function') {
        window.openCharacterWizard(campaignId);
        return;
    }

    legacyNotify('The React character wizard is unavailable.', 'error', 'Wizard unavailable');
}

function showCreateCharacterModal(options = {}) {
    const payload = options && typeof options === 'object' ? options : {};
    const campaignId = payload.campaignId ?? null;

    if (typeof window !== 'undefined' && typeof window.openCharacterWizard === 'function') {
        window.openCharacterWizard(campaignId);
        return;
    }

    legacyNotify('The React character wizard is unavailable.', 'error', 'Wizard unavailable');
}

// View character sheet
function viewCharacterSheet(characterId) {
    fetch(`${API_BASE}/characters/${characterId}`)
        .then(response => response.json())
        .then(character => {
            displayCharacterSheet(character);
        })
        .catch(error => {
            console.error('Failed to load character:', error);
            legacyNotify('Failed to load character.', 'error', 'Character load failed');
        });
}

// Store current character for editing
let currentEditingCharacter = null;

// Display character sheet in modal
function displayCharacterSheet(character) {
    currentEditingCharacter = character;
    const content = document.getElementById('character-sheet-content');
    const sr3 = character.edition_data || {};
    const activeSkills = sr3.active_skills || {};
    const knowledgeSkills = sr3.knowledge_skills || {};
    const weapons = sr3.weapons || [];
    const armor = sr3.armor || [];
    const cyberware = sr3.cyberware || [];
    
    // Build skills HTML
    let activeSkillsHTML = '<p class="empty-message">No active skills</p>';
    if (Object.keys(activeSkills).length > 0) {
        activeSkillsHTML = '<table class="skills-table"><thead><tr><th>Skill</th><th>Rating</th><th>Specialization</th><th>Actions</th></tr></thead><tbody>';
        for (const [name, skill] of Object.entries(activeSkills)) {
            activeSkillsHTML += `
                <tr>
                    <td>${name}</td>
                    <td>${skill.rating || 0}</td>
                    <td>${skill.specialization || '-'}</td>
                    <td>
                        <button class="btn-small btn-edit" onclick="editSkill('active', '${name}')">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteSkill('active', '${name}')">Delete</button>
                    </td>
                </tr>
            `;
        }
        activeSkillsHTML += '</tbody></table>';
    }
    
    let knowledgeSkillsHTML = '<p class="empty-message">No knowledge skills</p>';
    if (Object.keys(knowledgeSkills).length > 0) {
        knowledgeSkillsHTML = '<table class="skills-table"><thead><tr><th>Skill</th><th>Rating</th><th>Specialization</th><th>Actions</th></tr></thead><tbody>';
        for (const [name, skill] of Object.entries(knowledgeSkills)) {
            knowledgeSkillsHTML += `
                <tr>
                    <td>${name}</td>
                    <td>${skill.rating || 0}</td>
                    <td>${skill.specialization || '-'}</td>
                    <td>
                        <button class="btn-small btn-edit" onclick="editSkill('knowledge', '${name}')">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteSkill('knowledge', '${name}')">Delete</button>
                    </td>
                </tr>
            `;
        }
        knowledgeSkillsHTML += '</tbody></table>';
    }
    
    // Build equipment HTML
    let weaponsHTML = '<p class="empty-message">No weapons</p>';
    if (weapons.length > 0) {
        weaponsHTML = '<table class="skills-table"><thead><tr><th>Name</th><th>Type</th><th>Damage</th><th>Actions</th></tr></thead><tbody>';
        weapons.forEach((weapon, idx) => {
            weaponsHTML += `
                <tr>
                    <td>${weapon.name || '-'}</td>
                    <td>${weapon.type || '-'}</td>
                    <td>${weapon.damage || '-'}</td>
                    <td>
                        <button class="btn-small btn-edit" onclick="editWeapon(${idx})">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteWeapon(${idx})">Delete</button>
                    </td>
                </tr>
            `;
        });
        weaponsHTML += '</tbody></table>';
    }
    
    content.innerHTML = `
        <div class="character-sheet">
            <div class="sheet-header">
                <div>
                    <h2>${character.name}</h2>
                    <p><strong>Player:</strong> ${character.player_name || 'N/A'}</p>
                    <p><strong>Edition:</strong> ${character.edition}</p>
                </div>
                <div class="header-actions">
                    <button id="edit-char-btn" onclick="toggleEditMode()">Edit Character</button>
                </div>
            </div>
            
            <h3>Attributes</h3>
            <div class="attribute-grid">
                <div class="attribute-card">
                    <div class="label">Body</div>
                    <div class="value" data-attr="body">${sr3.body || 0}</div>
                </div>
                <div class="attribute-card">
                    <div class="label">Quickness</div>
                    <div class="value" data-attr="quickness">${sr3.quickness || 0}</div>
                </div>
                <div class="attribute-card">
                    <div class="label">Strength</div>
                    <div class="value" data-attr="strength">${sr3.strength || 0}</div>
                </div>
                <div class="attribute-card">
                    <div class="label">Charisma</div>
                    <div class="value" data-attr="charisma">${sr3.charisma || 0}</div>
                </div>
                <div class="attribute-card">
                    <div class="label">Intelligence</div>
                    <div class="value" data-attr="intelligence">${sr3.intelligence || 0}</div>
                </div>
                <div class="attribute-card">
                    <div class="label">Willpower</div>
                    <div class="value" data-attr="willpower">${sr3.willpower || 0}</div>
                </div>
            </div>
            
            <h3>Derived Attributes</h3>
            <div class="stats-row">
                <div class="stat-item">
                    <label>Reaction</label>
                    <div class="value" data-attr="reaction">${sr3.reaction || 0}</div>
                </div>
                <div class="stat-item">
                    <label>Essence</label>
                    <div class="value" data-attr="essence">${sr3.essence !== undefined ? sr3.essence.toFixed(2) : '6.00'}</div>
                </div>
                <div class="stat-item">
                    <label>Magic Rating</label>
                    <div class="value" data-attr="magic_rating">${sr3.magic_rating || 0}</div>
                </div>
            </div>
            
            <h3>Character Info</h3>
            <div class="stats-row">
                <div class="stat-item">
                    <label>Metatype</label>
                    <div class="value" data-attr="metatype">${sr3.metatype || 'Human'}</div>
                </div>
                <div class="stat-item">
                    <label>Karma</label>
                    <div class="value" data-attr="karma">${sr3.karma || 0}</div>
                </div>
                <div class="stat-item">
                    <label>Nuyen</label>
                    <div class="value" data-attr="nuyen">${sr3.nuyen || 0}</div>
                </div>
            </div>
            
            <h3>Active Skills</h3>
            <div id="active-skills-section">
                ${activeSkillsHTML}
                <button class="btn-add" onclick="showAddSkillModal('active')">Add Active Skill</button>
            </div>
            
            <h3>Knowledge Skills</h3>
            <div id="knowledge-skills-section">
                ${knowledgeSkillsHTML}
                <button class="btn-add" onclick="showAddSkillModal('knowledge')">Add Knowledge Skill</button>
            </div>
            
            <h3>Weapons</h3>
            <div id="weapons-section">
                ${weaponsHTML}
                <button class="btn-add" onclick="showAddWeaponModal()">Add Weapon</button>
            </div>
            
            <h3>Armor</h3>
            <div id="armor-section">
                ${armor.length > 0 ? `
                    <table class="skills-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Rating</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            ${armor.map((a, idx) => `
                                <tr>
                                    <td>${a.name || '-'}</td>
                                    <td>${a.type || '-'}</td>
                                    <td>${a.rating || 0}</td>
                                    <td>
                                        <button class="btn-small btn-edit" onclick="editArmor(${idx})">Edit</button>
                                        <button class="btn-small btn-delete" onclick="deleteArmor(${idx})">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="empty-message">No armor</p>'}
                <button class="btn-add" onclick="showAddArmorModal()">Add Armor</button>
            </div>
            
            <h3>Cyberware</h3>
            <div id="cyberware-section">
                ${cyberware.length > 0 ? `
                    <table class="skills-table">
                        <thead>
                            <tr><th>Name</th><th>Rating</th><th>Essence Cost</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            ${cyberware.map((c, idx) => `
                                <tr>
                                    <td>${c.name || '-'}</td>
                                    <td>${c.rating || '-'}</td>
                                    <td>${c.essence_cost !== undefined ? c.essence_cost.toFixed(2) : '0.00'}</td>
                                    <td>
                                        <button class="btn-small btn-edit" onclick="editCyberware(${idx})">Edit</button>
                                        <button class="btn-small btn-delete" onclick="deleteCyberware(${idx})">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="empty-message">No cyberware</p>'}
                <button class="btn-add" onclick="showAddCyberwareModal()">Add Cyberware</button>
            </div>
            
            <h3>Contacts</h3>
            <div id="contacts-section">
                ${sr3.contacts && sr3.contacts.length > 0 ? `
                    <table class="skills-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Loyalty</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            ${sr3.contacts.map((c, idx) => `
                                <tr>
                                    <td>${c.name || '-'}</td>
                                    <td>${c.type || '-'}</td>
                                    <td>${c.loyalty || 0}</td>
                                    <td>
                                        <button class="btn-small btn-edit" onclick="editContact(${idx})">Edit</button>
                                        <button class="btn-small btn-delete" onclick="deleteContact(${idx})">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="empty-message">No contacts</p>'}
                <button class="btn-add" onclick="showAddContactModal()">Add Contact</button>
            </div>
        </div>
    `;
    
    const modal = document.getElementById('character-sheet-modal');
    modal.style.display = 'block';
}

// Edit mode state
let editMode = false;

// Toggle edit mode
function toggleEditMode() {
    editMode = !editMode;
    const btn = document.getElementById('edit-char-btn');
    if (btn) {
        btn.textContent = editMode ? 'Save Changes' : 'Edit Character';
    }
    
    // Make attributes editable
    document.querySelectorAll('[data-attr]').forEach(el => {
        if (editMode) {
            const value = el.textContent.trim();
            const attrName = el.getAttribute('data-attr');
            el.innerHTML = `<input type="number" data-attr="${attrName}" value="${value}" style="width: 60px; padding: 0.25rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0; text-align: center;">`;
        } else {
            // Save the value from input if in edit mode
            const input = el.querySelector('input');
            if (input) {
                const attrName = input.getAttribute('data-attr');
                const value = input.value;
                el.textContent = value;
                updateAttribute(attrName, value);
            }
        }
    });
    
    if (!editMode) {
        // Recalculate derived attributes
        recalculateDerivedAttributes();
        // Reload character sheet to show updated values
        viewCharacterSheet(currentEditingCharacter.id);
    }
}

// Update character attribute
async function updateAttribute(attrName, value) {
    if (!currentEditingCharacter) return;
    
    try {
        const character = await fetch(`${API_BASE}/characters/${currentEditingCharacter.id}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        // Handle numeric attributes
        const numericAttrs = ['body', 'quickness', 'strength', 'charisma', 'intelligence', 'willpower', 'reaction', 'magic_rating', 'karma', 'nuyen'];
        const floatAttrs = ['essence'];
        
        if (numericAttrs.includes(attrName)) {
            sr3[attrName] = parseInt(value) || 0;
        } else if (floatAttrs.includes(attrName)) {
            sr3[attrName] = parseFloat(value) || 0.0;
        } else {
            sr3[attrName] = value;
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${currentEditingCharacter.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to update attribute');
        
        // Update current character reference
        currentEditingCharacter = await response.json();
    } catch (error) {
        console.error('Failed to update attribute:', error);
        legacyNotify('Failed to update attribute: ' + error.message, 'error', 'Attribute update failed');
    }
}

// Recalculate derived attributes
async function recalculateDerivedAttributes() {
    if (!currentEditingCharacter) return;
    
    try {
        const character = await fetch(`${API_BASE}/characters/${currentEditingCharacter.id}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        // Recalculate Reaction (Quickness + Intelligence)
        sr3.reaction = (sr3.quickness || 0) + (sr3.intelligence || 0);
        
        // Update character
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${currentEditingCharacter.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to recalculate attributes');
    } catch (error) {
        console.error('Failed to recalculate attributes:', error);
    }
}

// Load skills from API
let activeSkillsList = [];
let knowledgeSkillsList = [];

// Load equipment from API
let weaponsList = [];
let armorList = [];
let cyberwareList = [];

async function loadSkillsLists() {
    try {
        const [activeRes, knowledgeRes] = await Promise.all([
            fetch(`${API_BASE}/skills/active`),
            fetch(`${API_BASE}/skills/knowledge`)
        ]);
        
        if (activeRes.ok) {
            const activeData = await activeRes.json();
            activeSkillsList = activeData.skills || [];
        }
        
        if (knowledgeRes.ok) {
            const knowledgeData = await knowledgeRes.json();
            knowledgeSkillsList = knowledgeData.skills || [];
        }
    } catch (error) {
        console.error('Failed to load skills lists:', error);
    }
}

async function loadEquipmentLists() {
    try {
        const [weaponsRes, armorRes, cyberwareRes] = await Promise.all([
            fetch(`${API_BASE}/equipment/weapons`),
            fetch(`${API_BASE}/equipment/armor`),
            fetch(`${API_BASE}/equipment/cyberware`)
        ]);
        
        if (weaponsRes.ok) {
            const weaponsData = await weaponsRes.json();
            weaponsList = weaponsData.weapons || [];
        }
        
        if (armorRes.ok) {
            const armorData = await armorRes.json();
            armorList = armorData.armor || [];
        }
        
        if (cyberwareRes.ok) {
            const cyberwareData = await cyberwareRes.json();
            cyberwareList = cyberwareData.cyberware || [];
        }
    } catch (error) {
        console.error('Failed to load equipment lists:', error);
    }
}

// Skill management functions
function showAddSkillModal(type) {
    const skillsList = type === 'active' ? activeSkillsList : knowledgeSkillsList;
    
    // Create modal HTML with select dropdown
    const modalHTML = `
        <div class="skill-select-modal" id="skill-modal" style="display: block;">
            <div class="skill-modal-content">
                <span class="close" onclick="closeSkillModal()">&times;</span>
                <h3>Add ${type === 'active' ? 'Active' : 'Knowledge'} Skill</h3>
                <form id="skill-form">
                    <div class="form-group">
                        <label for="skill-name-select">Skill:</label>
                        <select id="skill-name-select" name="skill_name" required style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0; font-size: 1rem;">
                            <option value="">-- Select Skill --</option>
                            ${skillsList.map(skill => `<option value="${skill}">${skill}</option>`).join('')}
                        </select>
                        <small style="color: #888; display: block; margin-top: 0.5rem;">Or enter custom skill:</small>
                        <input type="text" id="skill-name-custom" name="skill_name_custom" placeholder="Custom skill name" style="width: 100%; padding: 0.75rem; margin-top: 0.5rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                    </div>
                    <div class="form-group">
                        <label for="skill-rating">Rating (1-6):</label>
                        <input type="number" id="skill-rating" name="rating" min="1" max="6" value="1" required style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                    </div>
                    <div class="form-group">
                        <label for="skill-specialization">Specialization (optional):</label>
                        <input type="text" id="skill-specialization" name="specialization" placeholder="e.g., Pistols (Revolvers)" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                    </div>
                    <div class="form-actions">
                        <button type="submit">Add Skill</button>
                        <button type="button" onclick="closeSkillModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Insert modal before closing body tag or in a container
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Handle form submission
    document.getElementById('skill-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectValue = document.getElementById('skill-name-select').value;
        const customValue = document.getElementById('skill-name-custom').value;
        const skillName = selectValue || customValue;
        
        if (!skillName) {
            legacyNotify('Please select or enter a skill name.', 'warning', 'Skill selection required');
            return;
        }
        
        const rating = parseInt(document.getElementById('skill-rating').value) || 1;
        const specialization = document.getElementById('skill-specialization').value || '';
        
        addSkill(currentEditingCharacter.id, type, skillName, rating, specialization);
        closeSkillModal();
    });
}

function closeSkillModal() {
    const modal = document.getElementById('skill-modal');
    if (modal) {
        modal.remove();
    }
    const modalContainer = document.querySelector('.skill-select-modal');
    if (modalContainer) {
        modalContainer.remove();
    }
}

function editSkill(type, name) {
    const sr3 = currentEditingCharacter.edition_data || {};
    const skills = type === 'active' ? (sr3.active_skills || {}) : (sr3.knowledge_skills || {});
    const skill = skills[name];
    
    if (!skill) return;
    
    const newRating = parseInt(prompt(`New rating for ${name} (current: ${skill.rating}):`) || skill.rating.toString());
    const newSpecialization = prompt(`New specialization for ${name} (current: ${skill.specialization || ''}):`) || skill.specialization || '';
    
    updateSkill(currentEditingCharacter.id, type, name, newRating, newSpecialization);
}

function deleteSkill(type, name) {
    if (!confirm(`Delete ${name}?`)) return;
    removeSkill(currentEditingCharacter.id, type, name);
}

async function addSkill(characterId, type, name, rating, specialization) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (!sr3.active_skills) sr3.active_skills = {};
        if (!sr3.knowledge_skills) sr3.knowledge_skills = {};
        
        const skill = {
            name: name,
            rating: rating,
            specialization: specialization
        };
        
        if (type === 'active') {
            sr3.active_skills[name] = skill;
        } else {
            sr3.knowledge_skills[name] = skill;
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to add skill');
        
        viewCharacterSheet(characterId); // Reload sheet
    } catch (error) {
        legacyNotify('Failed to add skill: ' + error.message, 'error', 'Skill add failed');
    }
}

async function updateSkill(characterId, type, name, rating, specialization) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        const skills = type === 'active' ? (sr3.active_skills || {}) : (sr3.knowledge_skills || {});
        if (skills[name]) {
            skills[name].rating = rating;
            skills[name].specialization = specialization;
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to update skill');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to update skill: ' + error.message, 'error', 'Skill update failed');
    }
}

async function removeSkill(characterId, type, name) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        const skills = type === 'active' ? (sr3.active_skills || {}) : (sr3.knowledge_skills || {});
        delete skills[name];
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to remove skill');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to remove skill: ' + error.message, 'error', 'Skill removal failed');
    }
}

// Weapon management functions
function showAddWeaponModal() {
    // Create modal HTML with select dropdown
    const modalHTML = `
        <div class="skill-select-modal" id="weapon-modal" style="display: block;">
            <div class="skill-modal-content">
                <span class="close" onclick="closeWeaponModal()">&times;</span>
                <h3>Add Weapon</h3>
                <form id="weapon-form">
                    <div class="form-group">
                        <label for="weapon-name-select">Weapon:</label>
                        <select id="weapon-name-select" name="weapon_name" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0; font-size: 1rem;">
                            <option value="">-- Select Weapon --</option>
                            ${weaponsList.map(w => `<option value="${w.name}" data-type="${w.type}" data-damage="${w.damage || ''}" data-accuracy="${w.accuracy || 0}" data-conceal="${w.concealability || 0}" data-mode="${w.mode || ''}" data-range="${w.range || ''}">${w.name} (${w.type}) - ${w.damage || ''}</option>`).join('')}
                        </select>
                        <small style="color: #888; display: block; margin-top: 0.5rem;">Or enter custom weapon:</small>
                        <input type="text" id="weapon-name-custom" name="weapon_name_custom" placeholder="Custom weapon name" style="width: 100%; padding: 0.75rem; margin-top: 0.5rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                    </div>
                    <div class="form-group" id="weapon-details-group">
                        <div class="form-group">
                            <label for="weapon-type">Type:</label>
                            <input type="text" id="weapon-type" name="type" placeholder="Firearm, Melee, etc." style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                        <div class="form-group">
                            <label for="weapon-damage">Damage:</label>
                            <input type="text" id="weapon-damage" name="damage" placeholder="e.g., 8M" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                        <div class="form-group">
                            <label for="weapon-accuracy">Accuracy:</label>
                            <input type="number" id="weapon-accuracy" name="accuracy" value="0" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                        <div class="form-group">
                            <label for="weapon-concealability">Concealability:</label>
                            <input type="number" id="weapon-concealability" name="concealability" value="0" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit">Add Weapon</button>
                        <button type="button" onclick="closeWeaponModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Auto-fill details when weapon is selected
    document.getElementById('weapon-name-select').addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        if (selected.value && selected.dataset.type) {
            document.getElementById('weapon-type').value = selected.dataset.type;
            document.getElementById('weapon-damage').value = selected.dataset.damage || '';
            document.getElementById('weapon-accuracy').value = selected.dataset.accuracy || '0';
            document.getElementById('weapon-concealability').value = selected.dataset.conceal || '0';
        }
    });
    
    // Handle form submission
    document.getElementById('weapon-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectValue = document.getElementById('weapon-name-select').value;
        const customValue = document.getElementById('weapon-name-custom').value;
        const weaponName = selectValue || customValue;
        
        if (!weaponName) {
            legacyNotify('Please select or enter a weapon name.', 'warning', 'Weapon selection required');
            return;
        }
        
        const type = document.getElementById('weapon-type').value || 'Firearm';
        const damage = document.getElementById('weapon-damage').value || '';
        const accuracy = parseInt(document.getElementById('weapon-accuracy').value) || 0;
        const concealability = parseInt(document.getElementById('weapon-concealability').value) || 0;
        
        addWeapon(currentEditingCharacter.id, weaponName, type, damage, accuracy, concealability);
        closeWeaponModal();
    });
}

function closeWeaponModal() {
    const modal = document.getElementById('weapon-modal');
    if (modal) {
        modal.remove();
    }
    const modalContainer = document.querySelector('.skill-select-modal');
    if (modalContainer && modalContainer.id === 'weapon-modal') {
        modalContainer.remove();
    }
}

function editWeapon(idx) {
    const sr3 = currentEditingCharacter.edition_data || {};
    const weapon = (sr3.weapons || [])[idx];
    
    if (!weapon) return;
    
    const newName = prompt(`Weapon name (current: ${weapon.name}):`) || weapon.name;
    const newDamage = prompt(`Damage (current: ${weapon.damage}):`) || weapon.damage;
    const newAccuracy = parseInt(prompt(`Accuracy (current: ${weapon.accuracy || 0}):`) || (weapon.accuracy || 0).toString());
    const newConcealability = parseInt(prompt(`Concealability (current: ${weapon.concealability || 0}):`) || (weapon.concealability || 0).toString());
    
    updateWeapon(currentEditingCharacter.id, idx, newName, weapon.type, newDamage, newAccuracy, newConcealability);
}

function deleteWeapon(idx) {
    if (!confirm('Delete this weapon?')) return;
    removeWeapon(currentEditingCharacter.id, idx);
}

async function addWeapon(characterId, name, type, damage, accuracy, concealability = 0) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (!sr3.weapons) sr3.weapons = [];
        
        sr3.weapons.push({
            name: name,
            type: type,
            damage: damage,
            accuracy: accuracy || 0,
            concealability: concealability || 0
        });
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to add weapon');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to add weapon: ' + error.message, 'error', 'Weapon add failed');
    }
}

async function updateWeapon(characterId, idx, name, type, damage, accuracy, concealability = 0) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.weapons && sr3.weapons[idx]) {
            sr3.weapons[idx] = { 
                name, 
                type, 
                damage, 
                accuracy: accuracy || 0,
                concealability: concealability || 0
            };
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to update weapon');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to update weapon: ' + error.message, 'error', 'Weapon update failed');
    }
}

async function removeWeapon(characterId, idx) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.weapons) {
            sr3.weapons.splice(idx, 1);
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to remove weapon');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to remove weapon: ' + error.message, 'error', 'Weapon removal failed');
    }
}

// Armor management functions
function showAddArmorModal() {
    // Create modal HTML with select dropdown
    const modalHTML = `
        <div class="skill-select-modal" id="armor-modal" style="display: block;">
            <div class="skill-modal-content">
                <span class="close" onclick="closeArmorModal()">&times;</span>
                <h3>Add Armor</h3>
                <form id="armor-form">
                    <div class="form-group">
                        <label for="armor-name-select">Armor:</label>
                        <select id="armor-name-select" name="armor_name" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0; font-size: 1rem;">
                            <option value="">-- Select Armor --</option>
                            ${armorList.map(a => `<option value="${a.name}" data-type="${a.type}" data-rating="${a.rating}">${a.name} (${a.type}) - Rating ${a.rating}</option>`).join('')}
                        </select>
                        <small style="color: #888; display: block; margin-top: 0.5rem;">Or enter custom armor:</small>
                        <input type="text" id="armor-name-custom" name="armor_name_custom" placeholder="Custom armor name" style="width: 100%; padding: 0.75rem; margin-top: 0.5rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                    </div>
                    <div class="form-group" id="armor-details-group">
                        <div class="form-group">
                            <label for="armor-type">Type:</label>
                            <input type="text" id="armor-type" name="type" placeholder="Clothing, Armor, etc." style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                        <div class="form-group">
                            <label for="armor-rating">Rating:</label>
                            <input type="number" id="armor-rating" name="rating" min="0" value="0" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit">Add Armor</button>
                        <button type="button" onclick="closeArmorModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Auto-fill details when armor is selected
    document.getElementById('armor-name-select').addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        if (selected.value && selected.dataset.type) {
            document.getElementById('armor-type').value = selected.dataset.type;
            document.getElementById('armor-rating').value = selected.dataset.rating || '0';
        }
    });
    
    // Handle form submission
    document.getElementById('armor-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectValue = document.getElementById('armor-name-select').value;
        const customValue = document.getElementById('armor-name-custom').value;
        const armorName = selectValue || customValue;
        
        if (!armorName) {
            legacyNotify('Please select or enter an armor name.', 'warning', 'Armor selection required');
            return;
        }
        
        const type = document.getElementById('armor-type').value || 'Clothing';
        const rating = parseInt(document.getElementById('armor-rating').value) || 0;
        
        addArmor(currentEditingCharacter.id, armorName, rating, type);
        closeArmorModal();
    });
}

function closeArmorModal() {
    const modal = document.getElementById('armor-modal');
    if (modal) {
        modal.remove();
    }
    const modalContainer = document.querySelector('.skill-select-modal');
    if (modalContainer && modalContainer.id === 'armor-modal') {
        modalContainer.remove();
    }
}

function editArmor(idx) {
    const sr3 = currentEditingCharacter.edition_data || {};
    const armor = (sr3.armor || [])[idx];
    
    if (!armor) return;
    
    const newName = prompt(`Armor name (current: ${armor.name}):`) || armor.name;
    const newRating = parseInt(prompt(`Rating (current: ${armor.rating}):`) || armor.rating.toString());
    
    updateArmor(currentEditingCharacter.id, idx, newName, newRating, armor.type);
}

function deleteArmor(idx) {
    if (!confirm('Delete this armor?')) return;
    removeArmor(currentEditingCharacter.id, idx);
}

async function addArmor(characterId, name, rating, type) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (!sr3.armor) sr3.armor = [];
        
        sr3.armor.push({
            name: name,
            rating: rating || 0,
            type: type || 'Clothing'
        });
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to add armor');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to add armor: ' + error.message, 'error', 'Armor add failed');
    }
}

async function updateArmor(characterId, idx, name, rating, type) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.armor && sr3.armor[idx]) {
            sr3.armor[idx] = { name, rating: rating || 0, type: type || 'Clothing' };
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to update armor');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to update armor: ' + error.message, 'error', 'Armor update failed');
    }
}

async function removeArmor(characterId, idx) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.armor) {
            sr3.armor.splice(idx, 1);
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to remove armor');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to remove armor: ' + error.message, 'error', 'Armor removal failed');
    }
}

// Cyberware management functions
function showAddCyberwareModal() {
    // Create modal HTML with select dropdown
    const modalHTML = `
        <div class="skill-select-modal" id="cyberware-modal" style="display: block;">
            <div class="skill-modal-content">
                <span class="close" onclick="closeCyberwareModal()">&times;</span>
                <h3>Add Cyberware</h3>
                <form id="cyberware-form">
                    <div class="form-group">
                        <label for="cyberware-name-select">Cyberware:</label>
                        <select id="cyberware-name-select" name="cyberware_name" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0; font-size: 1rem;">
                            <option value="">-- Select Cyberware --</option>
                            ${cyberwareList.map(c => {
                                const ratingText = c.rating ? ` (Rating ${c.rating})` : '';
                                return `<option value="${c.name}" data-rating="${c.rating || 0}" data-essence="${c.essence_cost}">${c.name}${ratingText} - Essence ${c.essence_cost}</option>`;
                            }).join('')}
                        </select>
                        <small style="color: #888; display: block; margin-top: 0.5rem;">Or enter custom cyberware:</small>
                        <input type="text" id="cyberware-name-custom" name="cyberware_name_custom" placeholder="Custom cyberware name" style="width: 100%; padding: 0.75rem; margin-top: 0.5rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                    </div>
                    <div class="form-group" id="cyberware-details-group">
                        <div class="form-group">
                            <label for="cyberware-rating">Rating (optional):</label>
                            <input type="number" id="cyberware-rating" name="rating" min="0" value="0" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                        <div class="form-group">
                            <label for="cyberware-essence">Essence Cost:</label>
                            <input type="number" id="cyberware-essence" name="essence_cost" step="0.1" min="0" value="0" style="width: 100%; padding: 0.75rem; background-color: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: #e0e0e0;">
                        </div>
                        <small style="color: #888;">Current Essence: <span id="current-essence-display">${currentEditingCharacter?.edition_data?.essence || 6.0}</span></small>
                    </div>
                    <div class="form-actions">
                        <button type="submit">Add Cyberware</button>
                        <button type="button" onclick="closeCyberwareModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Auto-fill details when cyberware is selected
    document.getElementById('cyberware-name-select').addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        if (selected.value && selected.dataset.essence) {
            document.getElementById('cyberware-rating').value = selected.dataset.rating || '0';
            document.getElementById('cyberware-essence').value = selected.dataset.essence || '0';
        }
    });
    
    // Handle form submission
    document.getElementById('cyberware-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const selectValue = document.getElementById('cyberware-name-select').value;
        const customValue = document.getElementById('cyberware-name-custom').value;
        const cyberwareName = selectValue || customValue;
        
        if (!cyberwareName) {
            legacyNotify('Please select or enter a cyberware name.', 'warning', 'Cyberware selection required');
            return;
        }
        
        const rating = parseInt(document.getElementById('cyberware-rating').value) || 0;
        const essenceCost = parseFloat(document.getElementById('cyberware-essence').value) || 0;
        
        addCyberware(currentEditingCharacter.id, cyberwareName, rating, essenceCost);
        closeCyberwareModal();
    });
}

function closeCyberwareModal() {
    const modal = document.getElementById('cyberware-modal');
    if (modal) {
        modal.remove();
    }
    const modalContainer = document.querySelector('.skill-select-modal');
    if (modalContainer && modalContainer.id === 'cyberware-modal') {
        modalContainer.remove();
    }
}

function editCyberware(idx) {
    const sr3 = currentEditingCharacter.edition_data || {};
    const cyberware = (sr3.cyberware || [])[idx];
    
    if (!cyberware) return;
    
    const newName = prompt(`Cyberware name (current: ${cyberware.name}):`) || cyberware.name;
    const newEssence = parseFloat(prompt(`Essence cost (current: ${cyberware.essence_cost || 0}):`) || (cyberware.essence_cost || 0).toString());
    
    updateCyberware(currentEditingCharacter.id, idx, newName, cyberware.rating || 0, newEssence);
}

function deleteCyberware(idx) {
    if (!confirm('Delete this cyberware?')) return;
    removeCyberware(currentEditingCharacter.id, idx);
}

async function addCyberware(characterId, name, rating, essenceCost) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (!sr3.cyberware) sr3.cyberware = [];
        
        const newCyberware = {
            name: name,
            essence_cost: essenceCost || 0,
        };
        if (rating) newCyberware.rating = rating;
        
        sr3.cyberware.push(newCyberware);
        
        // Recalculate essence
        sr3.essence = (sr3.essence || 6.0) - essenceCost;
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to add cyberware');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to add cyberware: ' + error.message, 'error', 'Cyberware add failed');
    }
}

async function updateCyberware(characterId, idx, name, rating, essenceCost) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.cyberware && sr3.cyberware[idx]) {
            const oldEssence = sr3.cyberware[idx].essence_cost || 0;
            const newEssence = essenceCost || 0;
            
            sr3.cyberware[idx] = { 
                name, 
                essence_cost: newEssence,
            };
            if (rating) sr3.cyberware[idx].rating = rating;
            
            // Recalculate essence (remove old cost, add new cost)
            sr3.essence = (sr3.essence || 6.0) + oldEssence - newEssence;
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to update cyberware');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to update cyberware: ' + error.message, 'error', 'Cyberware update failed');
    }
}

async function removeCyberware(characterId, idx) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.cyberware && sr3.cyberware[idx]) {
            const essenceCost = sr3.cyberware[idx].essence_cost || 0;
            sr3.cyberware.splice(idx, 1);
            
            // Restore essence
            sr3.essence = (sr3.essence || 6.0) + essenceCost;
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to remove cyberware');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to remove cyberware: ' + error.message, 'error', 'Cyberware removal failed');
    }
}

// Contact management functions
function showAddContactModal() {
    const name = prompt('Contact name:');
    if (!name) return;
    
    const type = prompt('Type (Fixer, Dealer, etc.):') || 'Contact';
    const loyalty = parseInt(prompt('Loyalty (1-6):') || '1');
    
    addContact(currentEditingCharacter.id, name, type, loyalty);
}

function editContact(idx) {
    const sr3 = currentEditingCharacter.edition_data || {};
    const contact = (sr3.contacts || [])[idx];
    
    if (!contact) return;
    
    const newName = prompt(`Contact name (current: ${contact.name}):`) || contact.name;
    const newLoyalty = parseInt(prompt(`Loyalty (current: ${contact.loyalty || 1}):`) || (contact.loyalty || 1).toString());
    
    updateContact(currentEditingCharacter.id, idx, newName, contact.type || 'Contact', newLoyalty);
}

function deleteContact(idx) {
    if (!confirm('Delete this contact?')) return;
    removeContact(currentEditingCharacter.id, idx);
}

async function addContact(characterId, name, type, loyalty) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (!sr3.contacts) sr3.contacts = [];
        
        sr3.contacts.push({
            name: name,
            type: type || 'Contact',
            loyalty: loyalty || 1
        });
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to add contact');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to add contact: ' + error.message, 'error', 'Contact add failed');
    }
}

async function updateContact(characterId, idx, name, type, loyalty) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.contacts && sr3.contacts[idx]) {
            sr3.contacts[idx] = { name, type: type || 'Contact', loyalty: loyalty || 1 };
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to update contact');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to update contact: ' + error.message, 'error', 'Contact update failed');
    }
}

async function removeContact(characterId, idx) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.contacts) {
            sr3.contacts.splice(idx, 1);
        }
        
        character.edition_data = sr3;
        
        const response = await fetch(`${API_BASE}/characters/${characterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(character)
        });
        
        if (!response.ok) throw new Error('Failed to remove contact');
        
        viewCharacterSheet(characterId);
    } catch (error) {
        legacyNotify('Failed to remove contact: ' + error.message, 'error', 'Contact removal failed');
    }
}

// Update createCharacter to accept edition_data
async function createCharacter(name, playerName, edition = 'sr3', editionData = {}) {
    try {
        const response = await fetch(`${API_BASE}/characters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                player_name: playerName,
                edition: edition,
                edition_data: editionData
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const character = await response.json();
        window.dispatchEvent(new Event('shadowmaster:characters:refresh'));
        window.dispatchEvent(new Event('shadowmaster:campaigns:refresh'));
        return character;
    } catch (error) {
        console.error('Failed to create character:', error);
        throw error;
    }
}

// Initialize
function initializeLegacyApp() {
    if (legacyInitialized) {
        return;
    }
    legacyInitialized = true;

    loadSkillsLists();
    loadEquipmentLists();
    loadCampaigns();

    const createCharBtn = document.getElementById('create-character-btn');
    if (createCharBtn) {
        createCharBtn.addEventListener('click', (event) => {
            if (typeof window !== 'undefined') {
                window.ShadowmasterLegacyApp?.clearCampaignCharacterCreation?.();
            }
            if (typeof window.openCharacterWizard === 'function') {
                window.openCharacterWizard();
                if (event && typeof event.preventDefault === 'function') {
                    event.preventDefault();
                }
                return;
            }
            showCreateCharacterModal();
        });
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);

            document.querySelectorAll('main > div').forEach(view => {
                view.style.display = 'none';
            });

            if (target === 'characters') {
                document.getElementById('characters-view').style.display = 'block';
                loadCharacters();
            } else if (target === 'campaigns') {
                document.getElementById('campaigns-view').style.display = 'block';
                loadCampaigns();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeLegacyApp);

window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    initialize: initializeLegacyApp,
    isInitialized: () => legacyInitialized,
    setEditionData: (edition, data) => {
        if (!edition) return;
        legacyEditionData[edition] = data;
        window.ShadowmasterEditionData = Object.assign({}, legacyEditionData);
    },
    loadCharacters: () => {
        window.dispatchEvent(new Event('shadowmaster:characters:refresh'));
    },
    loadCampaigns: () => {
        window.dispatchEvent(new Event('shadowmaster:campaigns:refresh'));
    },
    loadCampaignCharacterCreation: async () => Promise.resolve(),
    clearCampaignCharacterCreation: () => {},
    applyCampaignCreationDefaults: () => {}
});
