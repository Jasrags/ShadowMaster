// ShadowMaster Web Interface
const API_BASE = '/api';

// Load characters
async function loadCharacters() {
    try {
        const response = await fetch(`${API_BASE}/characters`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const characters = await response.json();
        const listEl = document.getElementById('characters-list');
        listEl.innerHTML = '';
        
        // Handle null or undefined responses
        if (!characters || !Array.isArray(characters) || characters.length === 0) {
            listEl.innerHTML = '<p>No characters found. Create your first character!</p>';
            return;
        }
        
        characters.forEach(char => {
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
        const listEl = document.getElementById('characters-list');
        if (listEl) {
            listEl.innerHTML = '<p class="error">Failed to load characters. Please try again.</p>';
        }
    }
}

// Load campaigns
async function loadCampaigns() {
    try {
        const response = await fetch(`${API_BASE}/campaigns`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const campaigns = await response.json();
        const listEl = document.getElementById('campaigns-list');
        listEl.innerHTML = '';
        
        // Handle null or undefined responses
        if (!campaigns || !Array.isArray(campaigns) || campaigns.length === 0) {
            listEl.innerHTML = '<p>No campaigns found. Create your first campaign!</p>';
            return;
        }
        
        campaigns.forEach(campaign => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${campaign.name}</h3>
                <p>GM: ${campaign.gm_name || 'N/A'}</p>
                <p>Status: ${campaign.status}</p>
            `;
            listEl.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load campaigns:', error);
        const listEl = document.getElementById('campaigns-list');
        if (listEl) {
            listEl.innerHTML = '<p class="error">Failed to load campaigns. Please try again.</p>';
        }
    }
}

// Create character
async function createCharacter(name, playerName, edition = 'sr3') {
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
                edition_data: {}
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const character = await response.json();
        loadCharacters(); // Reload the list
        return character;
    } catch (error) {
        console.error('Failed to create character:', error);
        throw error;
    }
}

// Create campaign
async function createCampaign(name, groupId, gmName, edition = 'sr3') {
    try {
        const response = await fetch(`${API_BASE}/campaigns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                group_id: groupId,
                gm_name: gmName,
                edition: edition,
                status: 'Active'
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const campaign = await response.json();
        loadCampaigns(); // Reload the list
        return campaign;
    } catch (error) {
        console.error('Failed to create campaign:', error);
        throw error;
    }
}

// Show create character modal
function showCreateCharacterModal() {
    const modal = document.getElementById('character-modal');
    modal.style.display = 'block';
    
    // Reset form
    document.getElementById('character-form').reset();
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Handle character form submission
function handleCharacterFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('char-name').value,
        player_name: document.getElementById('player-name').value,
        edition: 'sr3',
        edition_data: {
            magic_priority: document.getElementById('magic-priority').value,
            race_priority: document.getElementById('race-priority').value,
            attr_priority: document.getElementById('attr-priority').value,
            skills_priority: document.getElementById('skills-priority').value,
            resources_priority: document.getElementById('resources-priority').value
        }
    };
    
    createCharacter(formData.name, formData.player_name, formData.edition, formData.edition_data)
        .then(() => {
            closeModal('character-modal');
            alert('Character created successfully!');
        })
        .catch(error => {
            alert('Failed to create character: ' + error.message);
        });
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
            alert('Failed to load character');
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
                ${armor.length > 0 ? armor.map(a => `<div class="equipment-item"><strong>${a.name}</strong> (Rating: ${a.rating})</div>`).join('') : '<p class="empty-message">No armor</p>'}
                <button class="btn-add" onclick="showAddArmorModal()">Add Armor</button>
            </div>
        </div>
    `;
    
    const modal = document.getElementById('character-sheet-modal');
    modal.style.display = 'block';
}

// Toggle edit mode (placeholder for now)
function toggleEditMode() {
    alert('Edit mode coming soon!');
}

// Load skills from API
let activeSkillsList = [];
let knowledgeSkillsList = [];

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
            alert('Please select or enter a skill name');
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
        alert('Failed to add skill: ' + error.message);
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
        alert('Failed to update skill: ' + error.message);
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
        alert('Failed to remove skill: ' + error.message);
    }
}

// Weapon management functions
function showAddWeaponModal() {
    const name = prompt('Weapon name:');
    if (!name) return;
    
    const type = prompt('Type (Firearm, Melee, etc.):') || 'Firearm';
    const damage = prompt('Damage code (e.g., 8M):') || '';
    const accuracy = parseInt(prompt('Accuracy:') || '0');
    
    addWeapon(currentEditingCharacter.id, name, type, damage, accuracy);
}

function editWeapon(idx) {
    const sr3 = currentEditingCharacter.edition_data || {};
    const weapon = (sr3.weapons || [])[idx];
    
    if (!weapon) return;
    
    const newName = prompt(`Weapon name (current: ${weapon.name}):`) || weapon.name;
    const newDamage = prompt(`Damage (current: ${weapon.damage}):`) || weapon.damage;
    
    updateWeapon(currentEditingCharacter.id, idx, newName, weapon.type, newDamage, weapon.accuracy);
}

function deleteWeapon(idx) {
    if (!confirm('Delete this weapon?')) return;
    removeWeapon(currentEditingCharacter.id, idx);
}

async function addWeapon(characterId, name, type, damage, accuracy) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (!sr3.weapons) sr3.weapons = [];
        
        sr3.weapons.push({
            name: name,
            type: type,
            damage: damage,
            accuracy: accuracy || 0
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
        alert('Failed to add weapon: ' + error.message);
    }
}

async function updateWeapon(characterId, idx, name, type, damage, accuracy) {
    try {
        const character = await fetch(`${API_BASE}/characters/${characterId}`).then(r => r.json());
        const sr3 = character.edition_data || {};
        
        if (sr3.weapons && sr3.weapons[idx]) {
            sr3.weapons[idx] = { name, type, damage, accuracy: accuracy || 0 };
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
        alert('Failed to update weapon: ' + error.message);
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
        alert('Failed to remove weapon: ' + error.message);
    }
}

function showAddArmorModal() {
    alert('Armor management coming soon!');
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
        loadCharacters(); // Reload the list
        return character;
    } catch (error) {
        console.error('Failed to create character:', error);
        throw error;
    }
}

// Show create campaign modal
function showCreateCampaignModal() {
    const name = prompt('Campaign name:');
    if (!name) return;
    
    const gmName = prompt('GM name:') || '';
    
    // For now, we'll create without a group (group_id can be empty or we'll create one later)
    const groupId = prompt('Group ID (optional, press Cancel to skip):') || '';
    
    createCampaign(name, groupId, gmName)
        .then(() => {
            alert('Campaign created successfully!');
        })
        .catch(error => {
            alert('Failed to create campaign: ' + error.message);
        });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSkillsLists(); // Load skills database
    loadCharacters();
    loadCampaigns();
    
    // Create button event listeners
    const createCharBtn = document.getElementById('create-character-btn');
    if (createCharBtn) {
        createCharBtn.addEventListener('click', showCreateCharacterModal);
    }
    
    const createCampaignBtn = document.getElementById('create-campaign-btn');
    if (createCampaignBtn) {
        createCampaignBtn.addEventListener('click', showCreateCampaignModal);
    }
    
    // Character form submission
    const characterForm = document.getElementById('character-form');
    if (characterForm) {
        characterForm.addEventListener('submit', handleCharacterFormSubmit);
    }
    
    // Close modal handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Cancel button handlers
    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal('character-modal'));
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Navigation
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
});

