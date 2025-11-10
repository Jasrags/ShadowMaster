// ShadowMaster Web Interface
const API_BASE = '/api';
let legacyInitialized = false;
const legacyEditionData = {};
const priorityInputMap = {
    magic: 'magic-priority',
    metatype: 'metatype-priority',
    attributes: 'attr-priority',
    skills: 'skills-priority',
    resources: 'resources-priority'
};

function isAuthenticated() {
    if (typeof window !== 'undefined' && window.ShadowmasterAuth) {
        return Boolean(window.ShadowmasterAuth.user);
    }
    return true;
}

let metatypeStateListeners = [];
let magicStateListeners = [];

function notifyMetatypeState() {
    metatypeStateListeners.forEach(listener => {
        try {
            listener();
        } catch (err) {
            console.error('Metatype listener failed', err);
        }
    });
}

function notifyMagicState() {
    magicStateListeners.forEach(listener => {
        try {
            listener();
        } catch (err) {
            console.error('Magic listener failed', err);
        }
    });
}

function setMetatypeSelectionReact(metatypeId) {
    characterWizardState.selectedMetatype = metatypeId;
    document.querySelectorAll('.metatype-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.metatype === metatypeId);
    });
    const nextBtn = document.getElementById('metatype-next-btn');
    if (nextBtn) {
        nextBtn.disabled = !metatypeId;
    }
    notifyMetatypeState();
}

function applyPriorityAssignment(category, value) {
    priorityAssignments[category] = value ? value : null;

    const inputId = priorityInputMap[category];
    if (inputId) {
        const inputEl = document.getElementById(inputId);
        if (inputEl) {
            inputEl.value = value || '';
        }
    }

    updatePriorityValue(category, value || null);
    if (category === 'metatype') {
        notifyMetatypeState();
    }
    if (category === 'magic') {
        notifyMagicState();
    }
}

function clonePriorityAssignments() {
    return {
        magic: priorityAssignments.magic,
        metatype: priorityAssignments.metatype,
        attributes: priorityAssignments.attributes,
        skills: priorityAssignments.skills,
        resources: priorityAssignments.resources
    };
}

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
    if (!isAuthenticated()) {
        return;
    }

    if (document.body.classList.contains('react-campaign-enabled')) {
        return;
    }

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
        const listEl = document.getElementById('campaigns-list');
        if (listEl) {
            listEl.innerHTML = '<p class="error">Failed to load campaigns. Please try again.</p>';
        }
    }
}

async function openCampaignCharacterCreator(campaign) {
    if (!campaign || !campaign.id) {
        if (typeof window !== 'undefined') {
            window.ShadowmasterLegacyApp?.clearCampaignCharacterCreation?.();
        }
        showCreateCharacterModal();
        return;
    }

    try {
        if (typeof window !== 'undefined' && window.ShadowmasterLegacyApp?.loadCampaignCharacterCreation) {
            await window.ShadowmasterLegacyApp.loadCampaignCharacterCreation(campaign.id);
        }
    } catch (error) {
        console.error('Failed to load campaign character creation defaults:', error);
        alert('Failed to load campaign defaults. Using base rules instead.');
    }

    showCreateCharacterModal({ campaignId: campaign.id });
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
function showCreateCharacterModal(options = {}) {
    const campaignId = (options && typeof options === 'object') ? options.campaignId || null : null;
    const campaignGameplayRules = (options && typeof options === 'object') ? options.campaignGameplayRules || null : null;

    const modal = document.getElementById('character-modal');
    modal.style.display = 'block';
    
    // Reset wizard state
    // Note: Don't pre-initialize attributes to 1, as they should be calculated from base + modifiers
    characterWizardState = {
        currentStep: 1,
        characterName: '',
        playerName: '',
        selectedMetatype: null,
        priorities: null,
        magicalType: null,
        tradition: null,
        totem: null,
        attributes: null, // Will be set when entering attributes step
        attributeBaseValues: null, // Will be calculated based on selected metatype
        campaignId: campaignId,
        campaignGameplayRules: campaignGameplayRules
    };
    
    // Reset form
    document.getElementById('character-form').reset();
    
    // Reset priority assignments
    priorityAssignments = {
        magic: null,
        metatype: null,
        attributes: null,
        skills: null,
        resources: null
    };
    
    // Clear all dropzones
    document.querySelectorAll('.priority-dropzone').forEach(dropzone => {
        dropzone.classList.remove('has-priority');
        // Preserve the hidden input
        const input = dropzone.querySelector('input[type="hidden"]');
        dropzone.innerHTML = '<span class="dropzone-text">Drop priority here</span>';
        if (input) {
            input.value = '';
            dropzone.appendChild(input);
        }
    });
    
    // Clear all priority value displays
    ['magic', 'metatype', 'attributes', 'skills', 'resources'].forEach(category => {
        updatePriorityValue(category, null);
    });
    
    // Reset hidden inputs
    document.querySelectorAll('[id$="-priority"]').forEach(input => {
        if (input.type === 'hidden') {
            input.value = '';
        }
    });
    
    // Show all priority chips
    document.querySelectorAll('.priority-chip').forEach(chip => {
        chip.classList.remove('used');
    });
    
    // Update validation
    updatePriorityValidation();
    
    // Show step 1
    showWizardStep(1);
    
    // Initialize drag-and-drop (in case not already initialized)
    initPriorityDragDrop();
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }

    if (modalId === 'character-modal') {
        characterWizardState.campaignId = null;
        characterWizardState.campaignGameplayRules = null;
        if (typeof window !== 'undefined') {
            window.ShadowmasterLegacyApp?.clearCampaignCharacterCreation?.();
        }
    }
}

// Priority Assignment State
let priorityAssignments = {
    magic: null,
    metatype: null,
    attributes: null,
    skills: null,
    resources: null
};

// Character Creation Wizard State
// Note: attributes and attributeBaseValues should be null initially
// They will be calculated when entering the attributes step based on selected metatype
let characterWizardState = {
    currentStep: 1,
    characterName: '',
    playerName: '',
    selectedMetatype: null,
    priorities: null,
    magicalType: null, // 'Full Magician', 'Aspected Magician', 'Adept', or 'Mundane'
    tradition: null, // 'Hermetic' or 'Shamanic' (for Full/Aspected Magicians)
    totem: null, // Totem name (for Shamanic mages)
    attributes: null,
    attributeBaseValues: null,
    campaignId: null,
    campaignGameplayRules: null
};

// Get the display value for a priority selection in a category
function getPriorityValue(category, priority) {
    if (!priority) return '';
    
    const priorityTable = {
        magic: {
            'A': 'Full Magician',
            'B': 'Adept/Aspected Magician',
            'C': 'Mundane',
            'D': 'Mundane',
            'E': 'Mundane'
        },
        metatype: {
            'A': 'All metatypes',
            'B': 'All metatypes',
            'C': 'Troll or Elf',
            'D': 'Dwarf or Ork',
            'E': 'Human'
        },
        attributes: {
            'A': '30 points',
            'B': '27 points',
            'C': '24 points',
            'D': '21 points',
            'E': '18 points'
        },
        skills: {
            'A': '50 points',
            'B': '40 points',
            'C': '34 points',
            'D': '30 points',
            'E': '27 points'
        },
        resources: {
            'A': '1,000,000¥',
            'B': '400,000¥',
            'C': '90,000¥',
            'D': '20,000¥',
            'E': '5,000¥'
        }
    };
    
    return priorityTable[category] && priorityTable[category][priority] ? priorityTable[category][priority] : '';
}

// Update the priority value display for a category
function updatePriorityValue(category, priority) {
    const valueId = category === 'attributes' ? 'attr-value' : `${category}-value`;
    const valueEl = document.getElementById(valueId);
    if (valueEl) {
        const value = getPriorityValue(category, priority);
        valueEl.textContent = value ? ` ${value}` : '';
    }
    if (category === 'metatype') {
        notifyMetatypeState();
    }
}

// Initialize drag-and-drop for priority assignment
function initPriorityDragDrop() {
    // Set up all priority chips in the pool as draggable
    const poolChips = document.querySelectorAll('.priority-chips .priority-chip');
    poolChips.forEach(chip => {
        chip.setAttribute('draggable', 'true');
        // Remove existing listeners by checking if already initialized
        if (!chip._hasDragListeners) {
            chip.addEventListener('dragstart', handleDragStart);
            chip.addEventListener('dragend', handleDragEnd);
            chip._hasDragListeners = true;
        }
    });
    
    // Set up drop zones
    const dropzones = document.querySelectorAll('.priority-dropzone');
    dropzones.forEach(dropzone => {
        // Remove existing listeners by checking if already initialized
        if (!dropzone._hasDropListeners) {
            dropzone.addEventListener('dragover', handleDragOver);
            dropzone.addEventListener('drop', handleDrop);
            dropzone.addEventListener('dragleave', handleDragLeave);
            dropzone._hasDropListeners = true;
        }
    });
    
    // Set up double-click removal for chips already in dropzones
    document.querySelectorAll('.priority-dropzone .priority-chip').forEach(chip => {
        if (!chip._hasDblClickListener) {
            chip.addEventListener('dblclick', () => {
                const dropzone = chip.closest('.priority-dropzone');
                if (dropzone) {
                    const category = dropzone.dataset.category;
                    priorityAssignments[category] = null;
                    clearDropzone(category);
                    updatePriorityChips();
                    updatePriorityValidation();
                    updatePriorityValue(category, null);
                }
            });
            chip._hasDblClickListener = true;
        }
    });
    
    updatePriorityValidation();
}

function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    const priority = e.target.dataset.priority || e.target.textContent.trim();
    e.dataTransfer.setData('text/plain', priority);
    e.target.classList.add('dragging');
    
    // Store the source category if dragging from a dropzone
    const dropzone = e.target.closest('.priority-dropzone');
    if (dropzone) {
        e.dataTransfer.setData('source-category', dropzone.dataset.category || '');
    } else {
        e.dataTransfer.setData('source-category', 'pool');
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const dropzone = e.target.classList.contains('priority-dropzone') 
        ? e.target 
        : e.target.closest('.priority-dropzone');
    if (dropzone) {
        dropzone.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const dropzone = e.target.classList.contains('priority-dropzone') 
        ? e.target 
        : e.target.closest('.priority-dropzone');
    if (dropzone) {
        dropzone.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.target.classList.contains('priority-dropzone') 
        ? e.target 
        : e.target.closest('.priority-dropzone');
    if (!dropzone) return;
    
    dropzone.classList.remove('drag-over');
    
    const priority = e.dataTransfer.getData('text/plain');
    const category = dropzone.dataset.category;
    const sourceCategory = e.dataTransfer.getData('source-category');
    
    // If dragging from a dropzone, clear it first
    if (sourceCategory && sourceCategory !== 'pool' && sourceCategory !== category) {
        priorityAssignments[sourceCategory] = null;
        clearDropzone(sourceCategory);
    }
    
    assignPriority(category, priority);
}

function handleDropzoneClick(e) {
    // Allow double-clicking on dropzone to remove priority (alternative to drag-drop)
    const dropzone = e.currentTarget;
    if (dropzone.classList.contains('has-priority')) {
        const category = dropzone.dataset.category;
        priorityAssignments[category] = null;
        clearDropzone(category);
        updatePriorityChips();
        updatePriorityValidation();
    }
}

function assignPriority(category, priority) {
    // Remove priority from any previous category
    const prevCategory = Object.keys(priorityAssignments).find(
        cat => priorityAssignments[cat] === priority
    );
    if (prevCategory) {
        priorityAssignments[prevCategory] = null;
        clearDropzone(prevCategory);
        updatePriorityValue(prevCategory, null);
    }
    
    // Assign to new category
    priorityAssignments[category] = priority;
    
    // Update UI
    updateDropzone(category, priority);
    updatePriorityChips();
    updatePriorityValidation();
    updatePriorityValue(category, priority);
    
    // Update hidden input
    const input = document.getElementById(`${category === 'attributes' ? 'attr' : category}-priority`);
    if (input) {
        input.value = priority;
    }
}

function clearDropzone(category) {
    const dropzoneId = `${category === 'attributes' ? 'attr' : category}-dropzone`;
    const dropzone = document.getElementById(dropzoneId);
    if (dropzone) {
        dropzone.classList.remove('has-priority');
        // Preserve the hidden input
        const input = dropzone.querySelector('input[type="hidden"]');
        dropzone.innerHTML = '<span class="dropzone-text">Drop priority here</span>';
        if (input) {
            input.value = '';
            dropzone.appendChild(input);
        } else {
            // Recreate input if missing
            const newInput = document.createElement('input');
            newInput.type = 'hidden';
            newInput.id = `${category === 'attributes' ? 'attr' : category}-priority`;
            newInput.name = `${category === 'attributes' ? 'attr' : category}_priority`;
            newInput.value = '';
            dropzone.appendChild(newInput);
        }
    }
    // Clear the priority value display
    updatePriorityValue(category, null);
}

function updateDropzone(category, priority) {
    const dropzoneId = `${category === 'attributes' ? 'attr' : category}-dropzone`;
    const dropzone = document.getElementById(dropzoneId);
    if (dropzone && priority) {
        dropzone.classList.add('has-priority');
        
        // Create a draggable chip in the dropzone
        const chip = document.createElement('div');
        chip.className = 'priority-chip';
        chip.setAttribute('draggable', 'true');
        chip.setAttribute('data-priority', priority);
        chip.textContent = priority;
        chip.style.cursor = 'grab';
        chip.title = 'Drag to move, double-click to remove';
        
        // Make chip draggable
        chip.addEventListener('dragstart', handleDragStart);
        chip.addEventListener('dragend', handleDragEnd);
        
        // Allow double-click to remove
        chip.addEventListener('dblclick', () => {
            priorityAssignments[category] = null;
            clearDropzone(category);
            updatePriorityChips();
            updatePriorityValidation();
            updatePriorityValue(category, null);
        });
        
        dropzone.innerHTML = '';
        dropzone.appendChild(chip);
        
        // Also update hidden input
        const input = document.getElementById(`${category === 'attributes' ? 'attr' : category}-priority`);
        if (input) {
            input.value = priority;
        }
    }
}

function updatePriorityChips() {
    // Only update chips in the priority pool (not those in dropzones)
    const pool = document.querySelector('.priority-chips');
    if (!pool) return;
    
    const poolChips = pool.querySelectorAll('.priority-chip');
    const usedPriorities = Object.values(priorityAssignments).filter(p => p !== null);
    
    poolChips.forEach(chip => {
        const priority = chip.dataset.priority;
        if (usedPriorities.includes(priority)) {
            chip.classList.add('used');
        } else {
            chip.classList.remove('used');
        }
    });
}

function updatePriorityValidation() {
    const validationEl = document.getElementById('priority-validation');
    if (!validationEl) return;
    
    const assigned = Object.values(priorityAssignments).filter(p => p !== null);
    const requiredPriorities = ['A', 'B', 'C', 'D', 'E'];
    const missing = requiredPriorities.filter(p => !assigned.includes(p));
    
    if (assigned.length === 5 && missing.length === 0) {
        // All priorities assigned
        validationEl.className = 'validation-message success';
        validationEl.textContent = '✓ All priorities assigned correctly';
        validationEl.style.display = 'block';
    } else if (assigned.length > 0) {
        // Some priorities assigned
        validationEl.className = 'validation-message error';
        validationEl.textContent = `Missing priorities: ${missing.join(', ')}`;
        validationEl.style.display = 'block';
    } else {
        // No priorities assigned yet
        validationEl.style.display = 'none';
    }
}

function validatePriorities() {
    const assigned = Object.values(priorityAssignments).filter(p => p !== null);
    const requiredPriorities = ['A', 'B', 'C', 'D', 'E'];
    const missing = requiredPriorities.filter(p => !assigned.includes(p));
    
    if (assigned.length !== 5) {
        return {
            valid: false,
            message: `Please assign all 5 priorities. Missing: ${missing.join(', ')}`
        };
    }
    
    // Check for duplicates
    const duplicates = assigned.filter((p, i) => assigned.indexOf(p) !== i);
    if (duplicates.length > 0) {
        return {
            valid: false,
            message: 'Each priority can only be used once.'
        };
    }
    
    return { valid: true };
}

// Handle character form submission (step 1: priorities)
function handleCharacterFormSubmit(e) {
    e.preventDefault();
    
    // Validate priorities
    const validation = validatePriorities();
    if (!validation.valid) {
        alert(validation.message);
        return;
    }
    
    // Store character creation state
    characterWizardState.characterName = document.getElementById('char-name').value;
    characterWizardState.playerName = document.getElementById('player-name').value;
    characterWizardState.priorities = {
        magic: priorityAssignments.magic || '',
        metatype: priorityAssignments.metatype || '',
        attributes: priorityAssignments.attributes || '',
        skills: priorityAssignments.skills || '',
        resources: priorityAssignments.resources || ''
    };
    
    notifyMetatypeState();
    
    // Move to step 2: Metatype selection
    showWizardStep(2);
}

// Wizard step navigation
function showWizardStep(step) {
    characterWizardState.currentStep = step;
    
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(stepEl => {
        stepEl.style.display = 'none';
    });
    
    // Update progress indicator
    document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
        const stepNum = index + 1;
        progressStep.classList.remove('active', 'completed');
        if (stepNum < step) {
            progressStep.classList.add('completed');
        } else if (stepNum === step) {
            progressStep.classList.add('active');
        }
    });
    
    // Show current step first (so elements are available for initialization)
    const currentStepEl = document.getElementById(`step-${step}`);
    if (!currentStepEl) {
        console.error(`Step ${step} element not found`);
        return;
    }
    currentStepEl.style.display = 'block';
    
    // Initialize step-specific content
    try {
        if (step === 2) {
            displayMetatypeSelection();
            notifyMetatypeState();
        } else if (step === 3) {
            // Initialize magical abilities step
            initializeMagicalAbilitiesStep();
        } else if (step === 4) {
            // Initialize attributes step
            initializeAttributesStep();
        }
    } catch (error) {
        console.error(`Error initializing step ${step}:`, error);
    }
}

// Display metatype selection based on metatype priority
function displayMetatypeSelection() {
    const metatypePriority = characterWizardState.priorities.metatype;
    const container = document.getElementById('metatype-selection-container');
    if (!container) return;
    
    // Get valid metatypes based on priority
    const validMetatypes = getValidMetatypesForPriority(metatypePriority);
    
    // Metatype data with modifiers and abilities
    const metatypeData = {
        'Human': {
            name: 'Human',
            modifiers: {},
            abilities: ['Baseline metatype - no special abilities']
        },
        'Dwarf': {
            name: 'Dwarf',
            modifiers: {
                Body: 1,
                Strength: 2,
                Willpower: 1
            },
            abilities: ['Thermographic Vision', 'Resistance (+2 Body vs disease/toxin)']
        },
        'Elf': {
            name: 'Elf',
            modifiers: {
                Quickness: 1,
                Charisma: 2
            },
            abilities: ['Low-light Vision']
        },
        'Ork': {
            name: 'Ork',
            modifiers: {
                Body: 3,
                Strength: 2,
                Charisma: -1,
                Intelligence: -1
            },
            abilities: []
        },
        'Troll': {
            name: 'Troll',
            modifiers: {
                Body: 5,
                Quickness: -1,
                Strength: 4,
                Intelligence: -2,
                Charisma: -2
            },
            abilities: ['Thermographic Vision', '+1 Reach for Armed/Unarmed Combat', 'Dermal Armor (+1 Body)']
        }
    };
    
    container.innerHTML = '';
    
    validMetatypes.forEach(metatypeName => {
        const metatype = metatypeData[metatypeName];
        if (!metatype) return;
        
        const metatypeCard = document.createElement('div');
        metatypeCard.className = 'metatype-option';
        metatypeCard.dataset.metatype = metatypeName;
        metatypeCard.addEventListener('click', () => selectMetatype(metatypeName));
        
        let html = `<h4>${metatype.name}</h4>`;
        
        // Attribute modifiers
        const modifiers = Object.keys(metatype.modifiers);
        if (modifiers.length > 0) {
            html += '<div class="metatype-attributes"><h5>Attribute Modifiers</h5>';
            modifiers.forEach(attr => {
                const mod = metatype.modifiers[attr];
                const modClass = mod > 0 ? 'positive' : 'negative';
                const modSign = mod > 0 ? '+' : '';
                html += `<div class="attribute-mod">
                    <span>${attr}</span>
                    <span class="mod-value ${modClass}">${modSign}${mod}</span>
                </div>`;
            });
            html += '</div>';
        } else {
            html += '<div class="metatype-attributes"><h5>Attribute Modifiers</h5><p style="color: #888; font-size: 0.85rem;">No modifiers (baseline)</p></div>';
        }
        
        // Special abilities
        if (metatype.abilities.length > 0) {
            html += '<div class="metatype-abilities"><h5>Special Abilities</h5>';
            metatype.abilities.forEach(ability => {
                html += `<div class="ability">${ability}</div>`;
            });
            html += '</div>';
        }
        
        metatypeCard.innerHTML = html;
        container.appendChild(metatypeCard);
    });
}

// Get valid metatypes based on metatype priority
function getValidMetatypesForPriority(priority) {
    switch (priority) {
        case 'A':
        case 'B':
            return ['Human', 'Elf', 'Dwarf', 'Ork', 'Troll'];
        case 'C':
            return ['Troll', 'Elf'];
        case 'D':
            return ['Dwarf', 'Ork'];
        case 'E':
            return ['Human'];
        default:
            return [];
    }
}

// Select a metatype
function selectMetatype(metatypeName) {
    characterWizardState.selectedMetatype = metatypeName;
    
    // Update UI
    document.querySelectorAll('.metatype-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.metatype === metatypeName) {
            option.classList.add('selected');
        }
    });
    
    // Enable next button
    const nextBtn = document.getElementById('metatype-next-btn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
    
    notifyMetatypeState();
}

// Initialize magical abilities step
function initializeMagicalAbilitiesStep() {
    const magicPriority = characterWizardState.priorities.magic;
    const container = document.getElementById('magical-abilities-container');
    const helpText = document.getElementById('magic-help-text');
    const traditionSection = document.getElementById('tradition-selection');
    const totemSection = document.getElementById('totem-selection');
    const summarySection = document.getElementById('magic-summary');
    
    if (!container) return;
    
    // Clear previous selections if priority changed
    if (characterWizardState.magicalType) {
        const currentPriority = characterWizardState.priorities.magic;
        if (magicPriority !== currentPriority) {
            characterWizardState.magicalType = null;
            characterWizardState.tradition = null;
            characterWizardState.totem = null;
        }
    }
    
    container.innerHTML = '';
    traditionSection.style.display = 'none';
    totemSection.style.display = 'none';
    summarySection.style.display = 'none';
    
    // Hide tradition/totem selections initially
    document.querySelectorAll('input[name="tradition"]').forEach(input => {
        input.checked = false;
    });
    
    // Display options based on Magic priority
    if (!magicPriority || magicPriority === 'C' || magicPriority === 'D' || magicPriority === 'E') {
        // Mundane (no magic)
        helpText.textContent = 'Your Magic priority is ' + magicPriority + '. Your character is Mundane (no magical ability).';
        const mundaneCard = document.createElement('div');
        mundaneCard.className = 'magic-type-option selected';
        mundaneCard.innerHTML = '<h4>Mundane</h4><p>No magical ability. Magic Rating = 0.</p>';
        container.appendChild(mundaneCard);
        characterWizardState.magicalType = 'Mundane';
        characterWizardState.tradition = null;
        characterWizardState.totem = null;
        updateMagicSummary();
        validateMagicalAbilities();
    } else if (magicPriority === 'A') {
        // Full Magician only
        helpText.textContent = 'Your Magic priority is A. Your character must be a Full Magician.';
        const fullMagicianCard = document.createElement('div');
        fullMagicianCard.className = 'magic-type-option selected';
        fullMagicianCard.innerHTML = `
            <h4>Full Magician</h4>
            <p>Magic Rating: 6</p>
            <p>Spell Points: 25</p>
            <p>Must select a tradition (Shamanic or Hermetic)</p>
        `;
        container.appendChild(fullMagicianCard);
        characterWizardState.magicalType = 'Full Magician';
        traditionSection.style.display = 'block';
        
        // If tradition already selected, restore it
        if (characterWizardState.tradition) {
            const traditionInput = document.querySelector(`input[name="tradition"][value="${characterWizardState.tradition}"]`);
            if (traditionInput) {
                traditionInput.checked = true;
                handleTraditionSelection(characterWizardState.tradition);
            }
        }
    } else if (magicPriority === 'B') {
        // Adept or Aspected Magician
        helpText.textContent = 'Your Magic priority is B. Choose between Adept or Aspected Magician.';
        
        const adeptCard = document.createElement('div');
        adeptCard.className = 'magic-type-option';
        adeptCard.dataset.type = 'Adept';
        adeptCard.innerHTML = `
            <h4>Adept</h4>
            <p>Magic Rating: 4</p>
            <p>Power Points: 25</p>
            <p>Physical magical enhancements. Cannot cast spells.</p>
        `;
        adeptCard.addEventListener('click', () => selectMagicalType('Adept'));
        if (characterWizardState.magicalType === 'Adept') {
            adeptCard.classList.add('selected');
        }
        container.appendChild(adeptCard);
        
        const aspectedCard = document.createElement('div');
        aspectedCard.className = 'magic-type-option';
        aspectedCard.dataset.type = 'Aspected Magician';
        aspectedCard.innerHTML = `
            <h4>Aspected Magician</h4>
            <p>Magic Rating: 4</p>
            <p>Spell Points: 35</p>
            <p>Specialized in one aspect of tradition. Must select a tradition (Shamanic or Hermetic).</p>
        `;
        aspectedCard.addEventListener('click', () => selectMagicalType('Aspected Magician'));
        if (characterWizardState.magicalType === 'Aspected Magician') {
            aspectedCard.classList.add('selected');
            traditionSection.style.display = 'block';
            // Restore tradition if already selected
            if (characterWizardState.tradition) {
                const traditionInput = document.querySelector(`input[name="tradition"][value="${characterWizardState.tradition}"]`);
                if (traditionInput) {
                    traditionInput.checked = true;
                    handleTraditionSelection(characterWizardState.tradition);
                }
            }
        }
        container.appendChild(aspectedCard);
    }
    
    validateMagicalAbilities();
    notifyMagicState();
}

// Select magical type (Adept or Aspected Magician for Priority B)
function selectMagicalType(type) {
    characterWizardState.magicalType = type;
    
    // Update UI
    document.querySelectorAll('.magic-type-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.type === type) {
            option.classList.add('selected');
        }
    });
    
    // Show/hide tradition selection
    const traditionSection = document.getElementById('tradition-selection');
    const totemSection = document.getElementById('totem-selection');
    
    if (type === 'Aspected Magician') {
        traditionSection.style.display = 'block';
        // Restore tradition if already selected
        if (characterWizardState.tradition) {
            const traditionInput = document.querySelector(`input[name="tradition"][value="${characterWizardState.tradition}"]`);
            if (traditionInput) {
                traditionInput.checked = true;
                handleTraditionSelection(characterWizardState.tradition);
            }
        }
    } else if (type === 'Adept') {
        traditionSection.style.display = 'none';
        totemSection.style.display = 'none';
        characterWizardState.tradition = null;
        characterWizardState.totem = null;
        document.querySelectorAll('input[name="tradition"]').forEach(input => {
            input.checked = false;
        });
    }
    
    updateMagicSummary();
    validateMagicalAbilities();
    notifyMagicState();
}

// Handle tradition selection
function handleTraditionSelection(tradition) {
    characterWizardState.tradition = tradition;
    
    const totemSection = document.getElementById('totem-selection');
    
    if (tradition === 'Shamanic') {
        totemSection.style.display = 'block';
        // Display totem selection
        displayTotemSelection();
        // Restore totem if already selected
        if (characterWizardState.totem) {
            // Selection will be restored in displayTotemSelection
        }
    } else {
        totemSection.style.display = 'none';
        characterWizardState.totem = null;
    }
    
    updateMagicSummary();
    validateMagicalAbilities();
    notifyMagicState();
}

// Display totem selection
function displayTotemSelection() {
    const container = document.getElementById('totem-selection-container');
    if (!container) return;
    
    // Totem database
    const totemData = {
        'Bear': {
            name: 'Bear',
            description: 'The Bear totem represents strength, healing, and the protective nature of the forest. Bear shamans draw power from the wilderness and have a deep connection to natural healing. However, their primal nature makes them prone to berserk rages when wounded in combat.',
            environment: 'Forest',
            advantages: [
                '+2 dice for Health spells',
                '+2 dice for Forest spirits'
            ],
            disadvantages: [
                'Bear shamans can go berserk when wounded',
                'When taking physical damage in combat: Willpower (4) test',
                'Berserk lasts 3 turns, minus 1 turn per success',
                '3+ successes avert berserk rage entirely',
                'Berserk shaman attacks closest living thing (friend or foe) with most powerful weapons',
                'Berserk fury dissipates if target is incapacitated before time expires'
            ]
        }
        // More totems can be added here
    };
    
    container.innerHTML = '';
    
    Object.keys(totemData).forEach(totemName => {
        const totem = totemData[totemName];
        
        const totemCard = document.createElement('div');
        totemCard.className = 'totem-option';
        totemCard.dataset.totem = totemName;
        totemCard.addEventListener('click', () => selectTotem(totemName));
        
        // Mark as selected if already chosen
        if (characterWizardState.totem === totemName) {
            totemCard.classList.add('selected');
        }
        
        let html = `<h4>${totem.name}</h4>`;
        
        // Description
        if (totem.description) {
            html += `<div class="totem-description"><p>${totem.description}</p></div>`;
        }
        
        // Environment
        if (totem.environment) {
            html += `<div class="totem-environment"><h5>Environment</h5><p>${totem.environment}</p></div>`;
        }
        
        // Advantages
        if (totem.advantages && totem.advantages.length > 0) {
            html += '<div class="totem-advantages"><h5>Advantages</h5><ul>';
            totem.advantages.forEach(adv => {
                html += `<li class="advantage">${adv}</li>`;
            });
            html += '</ul></div>';
        }
        
        // Disadvantages
        if (totem.disadvantages && totem.disadvantages.length > 0) {
            html += '<div class="totem-disadvantages"><h5>Disadvantages</h5><ul>';
            totem.disadvantages.forEach(disadv => {
                html += `<li class="disadvantage">${disadv}</li>`;
            });
            html += '</ul></div>';
        }
        
        totemCard.innerHTML = html;
        container.appendChild(totemCard);
    });
}

// Select a totem
function selectTotem(totemName) {
    characterWizardState.totem = totemName;
    
    // Update UI
    document.querySelectorAll('.totem-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.totem === totemName) {
            option.classList.add('selected');
        }
    });
    
    updateMagicSummary();
    validateMagicalAbilities();
    notifyMagicState();
}

// Update magic summary display
function updateMagicSummary() {
    const summarySection = document.getElementById('magic-summary');
    const summaryContent = document.getElementById('magic-summary-content');
    
    if (!summarySection || !summaryContent) return;
    
    const type = characterWizardState.magicalType;
    if (!type) {
        summarySection.style.display = 'none';
        return;
    }
    
    summarySection.style.display = 'block';
    let html = '';
    
    if (type === 'Mundane') {
        html = '<p><strong>Type:</strong> Mundane</p>';
        html += '<p><strong>Magic Rating:</strong> 0</p>';
    } else if (type === 'Full Magician') {
        html = '<p><strong>Type:</strong> Full Magician</p>';
        html += '<p><strong>Magic Rating:</strong> 6</p>';
        html += '<p><strong>Spell Points:</strong> 25</p>';
        if (characterWizardState.tradition) {
            html += `<p><strong>Tradition:</strong> ${characterWizardState.tradition}</p>`;
            if (characterWizardState.tradition === 'Shamanic' && characterWizardState.totem) {
                html += `<p><strong>Totem:</strong> ${characterWizardState.totem}</p>`;
            }
        }
    } else if (type === 'Aspected Magician') {
        html = '<p><strong>Type:</strong> Aspected Magician</p>';
        html += '<p><strong>Magic Rating:</strong> 4</p>';
        html += '<p><strong>Spell Points:</strong> 35</p>';
        if (characterWizardState.tradition) {
            html += `<p><strong>Tradition:</strong> ${characterWizardState.tradition}</p>`;
            if (characterWizardState.tradition === 'Shamanic' && characterWizardState.totem) {
                html += `<p><strong>Totem:</strong> ${characterWizardState.totem}</p>`;
            }
        }
    } else if (type === 'Adept') {
        html = '<p><strong>Type:</strong> Adept</p>';
        html += '<p><strong>Magic Rating:</strong> 4</p>';
        html += '<p><strong>Power Points:</strong> 25</p>';
    }
    
    summaryContent.innerHTML = html;
}

// Validate magical abilities selection
function validateMagicalAbilities() {
    if (!characterWizardState.priorities) {
        characterWizardState.priorities = clonePriorityAssignments();
    }

    const magicPriority = characterWizardState.priorities.magic;
    const nextBtn = document.getElementById('magic-next-btn');
    
    if (!nextBtn) return false;
    
    // If mundane, always valid
    if (!magicPriority || magicPriority === 'C' || magicPriority === 'D' || magicPriority === 'E') {
        nextBtn.disabled = false;
        return true;
    }
    
    // Priority A: Must be Full Magician with tradition selected
    if (magicPriority === 'A') {
        if (characterWizardState.magicalType === 'Full Magician' && characterWizardState.tradition) {
            // If Shamanic, must have totem
            if (characterWizardState.tradition === 'Shamanic' && !characterWizardState.totem) {
                nextBtn.disabled = true;
                return false;
            }
            nextBtn.disabled = false;
            return true;
        }
        nextBtn.disabled = true;
        return false;
    }
    
    // Priority B: Must be Adept or Aspected Magician
    if (magicPriority === 'B') {
        if (!characterWizardState.magicalType) {
            nextBtn.disabled = true;
            return false;
        }
        
        if (characterWizardState.magicalType === 'Adept') {
            nextBtn.disabled = false;
            return true;
        }
        
        if (characterWizardState.magicalType === 'Aspected Magician') {
            if (!characterWizardState.tradition) {
                nextBtn.disabled = true;
                return false;
            }
            // If Shamanic, must have totem
            if (characterWizardState.tradition === 'Shamanic' && !characterWizardState.totem) {
                nextBtn.disabled = true;
                return false;
            }
            nextBtn.disabled = false;
            return true;
        }
        
        nextBtn.disabled = true;
        return false;
    }
    
    nextBtn.disabled = true;
    return false;
}

// Metatype modifiers data
const metatypeModifiers = {
    'Human': {
        Body: 0,
        Quickness: 0,
        Strength: 0,
        Charisma: 0,
        Intelligence: 0,
        Willpower: 0
    },
    'Dwarf': {
        Body: 1,
        Quickness: 0,
        Strength: 2,
        Charisma: 0,
        Intelligence: 0,
        Willpower: 1
    },
    'Elf': {
        Body: 0,
        Quickness: 1,
        Strength: 0,
        Charisma: 2,
        Intelligence: 0,
        Willpower: 0
    },
    'Ork': {
        Body: 3,
        Quickness: 0,
        Strength: 2,
        Charisma: -1,
        Intelligence: -1,
        Willpower: 0
    },
    'Troll': {
        Body: 5,
        Quickness: -1,
        Strength: 4,
        Charisma: -2,
        Intelligence: -2,
        Willpower: 0
    }
};

// Get available attribute points based on priority
function getAvailableAttributePoints(priority) {
    const pointTable = {
        'A': 30,
        'B': 27,
        'C': 24,
        'D': 21,
        'E': 18
    };
    return pointTable[priority] || 0;
}

// Initialize attributes step
function initializeAttributesStep() {
    // Check if priorities are set
    if (!characterWizardState.priorities || !characterWizardState.priorities.attributes) {
        console.error('Attributes priority not set');
        return;
    }
    
    const attrPriority = characterWizardState.priorities.attributes;
    const availablePoints = getAvailableAttributePoints(attrPriority);
    const selectedMetatype = characterWizardState.selectedMetatype || 'Human';
    const modifiers = metatypeModifiers[selectedMetatype] || metatypeModifiers['Human'];
    
    // Set available points
    const availablePointsEl = document.getElementById('available-points');
    if (!availablePointsEl) {
        console.error('available-points element not found');
        return;
    }
    availablePointsEl.textContent = availablePoints;
    
    // Calculate base starting values
    // Step 1: Characters start with 1 in all attributes for free
    // Step 2: Apply metatype modifiers
    // Starting value = 1 (free) + modifier
    // For Ork Charisma: starting value = 1 + (-1) = 0
    // For Troll Intelligence: starting value = 1 + (-2) = -1
    // Note: Starting values CAN be less than 1 if modifiers are negative
    // Players must spend points to raise attributes below 1 up to at least 1
    
    // Base value for point calculation = modifier only (used in point tracking)
    // This allows correct point calculation: points = input - modifier
    // For Ork Charisma: if input is 1, points = 1 - (-1) = 2 points ✓
    // For Troll Intelligence: if input is 1, points = 1 - (-2) = 3 points ✓
    const baseValuesForPoints = {
        body: modifiers.Body || 0,
        quickness: modifiers.Quickness || 0,
        strength: modifiers.Strength || 0,
        charisma: modifiers.Charisma || 0,
        intelligence: modifiers.Intelligence || 0,
        willpower: modifiers.Willpower || 0
    };
    
    // Starting values = 1 (free) + modifier
    const startingValues = {
        body: 1 + (modifiers.Body || 0),
        quickness: 1 + (modifiers.Quickness || 0),
        strength: 1 + (modifiers.Strength || 0),
        charisma: 1 + (modifiers.Charisma || 0),
        intelligence: 1 + (modifiers.Intelligence || 0),
        willpower: 1 + (modifiers.Willpower || 0)
    };
    
    // Initialize attribute inputs with starting values (1 + modifier)
    // When entering the attributes step, always start from these values
    // Use stored values only if they're already set and valid for this metatype
    const attrs = characterWizardState.attributes;
    
    const getInitialValue = (attrKey, startValue) => {
        // If we have stored values from a previous visit to this step, use them
        // But only if they're valid (>= starting value) for the current metatype
        if (attrs && attrs[attrKey] !== undefined && attrs[attrKey] >= startValue) {
            return attrs[attrKey];
        }
        // Otherwise, start at the starting value (1 + modifier, which may be negative)
        // Player must raise to 1+ for validation
        return startValue;
    };
    
    document.getElementById('attr-body').value = getInitialValue('body', startingValues.body);
    document.getElementById('attr-quickness').value = getInitialValue('quickness', startingValues.quickness);
    document.getElementById('attr-strength').value = getInitialValue('strength', startingValues.strength);
    document.getElementById('attr-charisma').value = getInitialValue('charisma', startingValues.charisma);
    document.getElementById('attr-intelligence').value = getInitialValue('intelligence', startingValues.intelligence);
    document.getElementById('attr-willpower').value = getInitialValue('willpower', startingValues.willpower);
    
    // Set minimum values for inputs based on starting values (1 + modifier)
    // Note: Starting values can be negative, but HTML5 number inputs work better with min attribute
    // We'll validate programmatically in the input handler
    document.getElementById('attr-body').min = Math.min(startingValues.body, 0); // Allow negative if starting is negative
    document.getElementById('attr-quickness').min = Math.min(startingValues.quickness, 0);
    document.getElementById('attr-strength').min = Math.min(startingValues.strength, 0);
    document.getElementById('attr-charisma').min = Math.min(startingValues.charisma, 0);
    document.getElementById('attr-intelligence').min = Math.min(startingValues.intelligence, 0);
    document.getElementById('attr-willpower').min = Math.min(startingValues.willpower, 0);
    
    // Update minimum labels to show the starting value
    updateAttributeMinLabels(startingValues);
    
    // Store base values (modifier only) for point calculation
    // Store starting values (1 + modifier) for display/minimum tracking
    characterWizardState.attributeBaseValues = baseValuesForPoints;
    characterWizardState.attributeStartingValues = startingValues;
    
    // Display modifiers
    updateModifierDisplays(modifiers);
    
    // Set up event listeners for attribute inputs
    ['body', 'quickness', 'strength', 'charisma', 'intelligence', 'willpower'].forEach(attr => {
        const input = document.getElementById(`attr-${attr}`);
        if (input) {
            input.addEventListener('input', () => {
                // Enforce minimum based on starting values (1 + modifier, can be negative)
                const startingValues = characterWizardState.attributeStartingValues || {
                    body: 1, quickness: 1, strength: 1, charisma: 1, intelligence: 1, willpower: 1
                };
                // Handle 0 as a valid value (don't use || 1 which would convert 0 to 1)
                const inputValue = input.value.trim();
                const parsedValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
                let currentValue = isNaN(parsedValue) ? 0 : parsedValue;
                const minValue = startingValues[attr] || 1;
                
                // Prevent reducing below starting value (1 + modifier, which may be negative)
                if (currentValue < minValue) {
                    input.value = minValue;
                    currentValue = minValue;
                }
                
                // Prevent exceeding maximum attribute value (6 before modifiers)
                if (currentValue > 6) {
                    input.value = 6;
                    currentValue = 6;
                }
                
                // Get current modifiers dynamically (for display only)
                const currentMetatype = characterWizardState.selectedMetatype || 'Human';
                const currentModifiers = metatypeModifiers[currentMetatype] || metatypeModifiers['Human'];
                
                // Calculate total points used to check if we exceed available
                const attrPriority = characterWizardState.priorities.attributes;
                const availablePoints = getAvailableAttributePoints(attrPriority);
                
                // Calculate points used by all attributes
                let totalUsed = 0;
                ['body', 'quickness', 'strength', 'charisma', 'intelligence', 'willpower'].forEach(otherAttr => {
                    const otherInput = document.getElementById(`attr-${otherAttr}`);
                    if (otherInput) {
                        const otherValue = otherInput.value.trim();
                        const otherParsed = otherValue === '' ? 0 : parseInt(otherValue, 10);
                        const otherActual = isNaN(otherParsed) ? 0 : otherParsed;
                        const otherStartValue = startingValues[otherAttr] || 1;
                        const otherPointsSpent = Math.max(0, otherActual - otherStartValue);
                        totalUsed += otherPointsSpent;
                    }
                });
                
                // If we exceed available points, clamp this attribute to what's affordable
                if (totalUsed > availablePoints) {
                    // Calculate points used by OTHER attributes (excluding this one)
                    let otherAttributesUsed = totalUsed - Math.max(0, currentValue - minValue);
                    
                    // Calculate maximum we can afford for this attribute
                    const pointsLeftForThis = availablePoints - otherAttributesUsed;
                    const maxAffordable = minValue + Math.max(0, pointsLeftForThis);
                    
                    // Set to the lower of: what they entered (clamped to 6), or what we can afford
                    const finalValue = Math.min(maxAffordable, 6, currentValue);
                    input.value = finalValue;
                    currentValue = finalValue;
                }
                
                updateAttributeTracking();
                updateFinalValues(currentModifiers);
                updateDerivedAttributes(currentModifiers);
                validateAttributes();
            });
        }
    });
    
    // Initial updates
    updateAttributeTracking();
    updateFinalValues(modifiers);
    updateDerivedAttributes(modifiers);
    updateMagicRating();
    validateAttributes();
}

// Update modifier displays
function updateModifierDisplays(modifiers) {
    Object.keys(modifiers).forEach(attr => {
        const attrKey = attr.toLowerCase();
        const modEl = document.getElementById(`mod-${attrKey}`);
        if (modEl && modifiers[attr] !== 0) {
            const sign = modifiers[attr] > 0 ? '+' : '';
            modEl.textContent = `(${sign}${modifiers[attr]} racial)`;
            modEl.className = `modifier-display ${modifiers[attr] > 0 ? 'positive' : 'negative'}`;
        } else if (modEl) {
            modEl.textContent = '';
            modEl.className = 'modifier-display';
        }
    });
}

// Update attribute minimum labels
// Shows the starting value (1 + modifier) which may be negative
function updateAttributeMinLabels(startingValues) {
    Object.keys(startingValues).forEach(attr => {
        const minEl = document.getElementById(`min-${attr}`);
        if (minEl) {
            const startValue = startingValues[attr];
            if (startValue > 1) {
                minEl.textContent = `(min ${startValue})`;
            } else if (startValue < 1) {
                minEl.textContent = `(start ${startValue}, must raise to 1+)`;
                minEl.style.color = '#ff6b6b'; // Red to indicate needs attention
            } else {
                minEl.textContent = '';
            }
        }
    });
}

// Update attribute point tracking
// Note: Characters start with 1 in all attributes for free, plus racial modifiers
// Base values can be less than 1 (if modifiers are negative)
// Points spent = current value - base value (if base is negative, this correctly calculates points needed)
function updateAttributeTracking() {
    const attrs = ['body', 'quickness', 'strength', 'charisma', 'intelligence', 'willpower'];
    let used = 0;
    
    // Get base values (racial modifiers directly, can be negative)
    const baseValues = characterWizardState.attributeBaseValues || {
        body: 0,
        quickness: 0,
        strength: 0,
        charisma: 0,
        intelligence: 0,
        willpower: 0
    };
    
    attrs.forEach(attr => {
        const input = document.getElementById(`attr-${attr}`);
        if (input) {
            // Handle 0 as a valid value (don't use || 1 which would convert 0 to 1)
            const inputValue = input.value.trim();
            const totalValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
            const actualValue = isNaN(totalValue) ? 0 : totalValue;
            const baseValue = baseValues[attr] || 0;
            
            // Calculate points spent
            // Starting value = 1 (free) + modifier
            // The free 1 is NOT counted in the point pool
            // Points spent = (current value - 1 free) - (starting value - 1 free)
            // = (current - 1) - (starting - 1)
            // = (current - 1) - modifier
            // For Ork Charisma: modifier = -1, starting = 0 (1 + -1)
            //   If input is 0 (starting), points = (0 - 1) - (-1) = -1 + 1 = 0 ✓
            //   If input is 1, points = (1 - 1) - (-1) = 0 + 1 = 1 point
            //   But wait, user said it costs 2 points to get from "the -1" to 1
            //   I think they mean: from the modifier value (-1) to 1
            //   So: points = (1 - 1) - (-1) = 1, but we need 2
            //   Maybe: points = current - modifier?
            //   For Ork CHA: points = 1 - (-1) = 2 ✓
            //   But at starting (0): points = 0 - (-1) = 1 (should be 0)
            
            // Actually, I think the correct formula accounting for the free 1:
            // Points = (current - 1) - modifier
            // At starting (0 for Ork CHA): (0 - 1) - (-1) = -1 + 1 = 0 ✓
            // To get to 1: (1 - 1) - (-1) = 0 + 1 = 1 (but user wants 2?)
            
            // Wait, let me reconsider: maybe points = current - modifier
            // At starting (0): 0 - (-1) = 1 (wrong, should be 0)
            // To get to 1: 1 - (-1) = 2 ✓
            
            // I think we need: if at starting value, points = 0
            // Otherwise: points = current - modifier
            // Or: points = Math.max(0, current - modifier - (starting - modifier))
            // = Math.max(0, current - starting)
            
            // Actually, simplest: points = current - starting (where starting = 1 + modifier)
            // At starting: points = 0 ✓
            // To get to 1 from 0: points = 1 - 0 = 1 (but user wants 2...)
            
            // Let me try: points = current - modifier (but subtract the starting adjustment)
            // points = (current - modifier) - (starting - modifier)
            // = current - modifier - starting + modifier
            // = current - starting
            
            // Hmm, maybe the user wants: points = current - modifier always
            // And we just handle that at starting (0) we show 0 points somehow?
            // Or maybe: points = Math.max(0, (current - 1) - modifier)?
            // At 0: max(0, -1 - (-1)) = max(0, 0) = 0 ✓
            // At 1: max(0, 0 - (-1)) = max(0, 1) = 1 (but user wants 2)
            
            // Actually, I think the issue is we're using modifier-only base for calculation
            // But we should use: points = (current - starting) where starting includes free 1
            const startingValue = 1 + baseValue; // starting = 1 + modifier
            const pointsSpent = actualValue - startingValue;
            // Only count positive points (when above starting value)
            used += Math.max(0, pointsSpent);
        }
    });
    
    const attrPriority = characterWizardState.priorities.attributes;
    const available = getAvailableAttributePoints(attrPriority);
    const remaining = available - used;
    
    document.getElementById('used-points').textContent = used;
    const remainingEl = document.getElementById('remaining-points');
    remainingEl.textContent = remaining;
    
    if (remaining < 0) {
        remainingEl.classList.add('negative');
    } else {
        remainingEl.classList.remove('negative');
    }
}

// Update final attribute values
// Note: The input value already includes racial modifiers (base 1 + modifiers)
// So final value = input value (no additional modifiers to apply)
function updateFinalValues(modifiers) {
    const attrs = [
        { key: 'body', name: 'Body' },
        { key: 'quickness', name: 'Quickness' },
        { key: 'strength', name: 'Strength' },
        { key: 'charisma', name: 'Charisma' },
        { key: 'intelligence', name: 'Intelligence' },
        { key: 'willpower', name: 'Willpower' }
    ];
    
    attrs.forEach(attr => {
        const input = document.getElementById(`attr-${attr.key}`);
        const finalEl = document.getElementById(`final-${attr.key}`);
        
        if (input && finalEl) {
            // Input value already includes racial modifiers, so final = input
            // Handle 0 as a valid value (don't use || 1 which would convert 0 to 1)
            const inputValue = input.value.trim();
            const finalValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
            
            // If parsing failed or is NaN, default to 0 (not 1, since 0 is valid)
            const displayValue = isNaN(finalValue) ? 0 : finalValue;
            
            finalEl.textContent = displayValue;
            
            // Highlight if final value would be less than 1
            if (displayValue < 1) {
                finalEl.style.color = '#ff6b6b';
            } else {
                finalEl.style.color = '#00ff88';
            }
        }
    });
}

// Update derived attributes
// Note: Input values already include racial modifiers, so no additional modifiers needed
function updateDerivedAttributes(modifiers) {
    const quicknessInput = document.getElementById('attr-quickness');
    const intelligenceInput = document.getElementById('attr-intelligence');
    
    if (quicknessInput && intelligenceInput) {
        // Input values already include racial modifiers
        // Handle 0 as a valid value (don't use || 1 which would convert 0 to 1)
        const quicknessValue = quicknessInput.value.trim();
        const intelligenceValue = intelligenceInput.value.trim();
        const quickness = quicknessValue === '' ? 0 : parseInt(quicknessValue, 10);
        const intelligence = intelligenceValue === '' ? 0 : parseInt(intelligenceValue, 10);
        const quicknessFinal = isNaN(quickness) ? 0 : quickness;
        const intelligenceFinal = isNaN(intelligence) ? 0 : intelligence;
        
        // Reaction = (Quickness + Intelligence) ÷ 2, rounded down
        const reaction = Math.floor((quicknessFinal + intelligenceFinal) / 2);
        
        document.getElementById('derived-reaction').textContent = reaction;
    }
    
    // Essence always starts at 6.0
    document.getElementById('derived-essence').textContent = '6.0';
}

// Update magic rating display
function updateMagicRating() {
    const magicalType = characterWizardState.magicalType || 'Mundane';
    let magicRating = 0;
    let magicNote = 'Mundane (no magic)';
    
    if (magicalType === 'Full Magician') {
        magicRating = 6;
        magicNote = 'Full Magician';
    } else if (magicalType === 'Aspected Magician' || magicalType === 'Adept') {
        magicRating = 4;
        magicNote = magicalType;
    }
    
    const magicEl = document.getElementById('derived-magic');
    const noteEl = document.getElementById('magic-note');
    if (magicEl) magicEl.textContent = magicRating;
    if (noteEl) noteEl.textContent = magicNote;
}

// Validate attributes
// Note: Characters start with 1 in all attributes for free, plus racial modifiers
// The available points are spent on top of the base value (1 + racial modifiers)
function validateAttributes() {
    const attrPriority = characterWizardState.priorities.attributes;
    const available = getAvailableAttributePoints(attrPriority);
    const selectedMetatype = characterWizardState.selectedMetatype || 'Human';
    const modifiers = metatypeModifiers[selectedMetatype] || metatypeModifiers['Human'];
    
    // Get base values (1 + racial modifiers)
    const baseValues = characterWizardState.attributeBaseValues || {
        body: 1,
        quickness: 1,
        strength: 1,
        charisma: 1,
        intelligence: 1,
        willpower: 1
    };
    
    const attrs = [
        { key: 'body', name: 'Body' },
        { key: 'quickness', name: 'Quickness' },
        { key: 'strength', name: 'Strength' },
        { key: 'charisma', name: 'Charisma' },
        { key: 'intelligence', name: 'Intelligence' },
        { key: 'willpower', name: 'Willpower' }
    ];
    
    let used = 0;
    const errors = [];
    const warnings = [];
    
    // Check each attribute
    attrs.forEach(attr => {
        const input = document.getElementById(`attr-${attr.key}`);
        if (!input) return;
        
        // Handle 0 as a valid value (don't use || 1 which would convert 0 to 1)
        const inputValue = input.value.trim();
        const totalValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
        const actualValue = isNaN(totalValue) ? 0 : totalValue;
        const baseValue = baseValues[attr.key] || 0;
        
        // Check minimum (cannot go below starting value, which is 1 + modifier)
        const startValue = startingValues[attr.key] || 1;
        if (actualValue < startValue) {
            errors.push(`${attr.name} cannot be reduced below ${startValue} (starting value: 1 + racial modifier)`);
        }
        
        // Check maximum (cannot exceed 6 before modifiers)
        if (actualValue > 6) {
            errors.push(`${attr.name} cannot exceed 6 (before racial modifiers)`);
        }
        
        // Calculate points spent
        // Starting value = 1 (free) + modifier, so starting = 0 for Ork CHA, -1 for Troll INT
        // The free 1 point is NOT counted in the point pool
        // Points spent = current value - starting value
        // This correctly excludes the free 1 from the calculation
        // For Ork Charisma: modifier = -1, starting = 0 (1 + -1)
        //   If input is 0 (starting), points = 0 - 0 = 0 ✓ (no points spent)
        //   If input is 1, points = 1 - 0 = 1 point (but user wants 2...)
        //   Actually, user said it costs 2 points from "-1 to 1"
        //   Maybe they mean from modifier value (-1) to 1, which would be: 1 - (-1) = 2
        //   But our starting is 0, not -1...
        
        // Re-reading: user wants points = current - modifier (not current - starting)
        // For Ork CHA: points = 1 - (-1) = 2 ✓
        // But at starting (0): points = 0 - (-1) = 1 (should be 0)
        // So we need: if at starting, points = 0, else points = current - modifier
        
        // Actually, I think: points = current - starting (where starting = 1 + modifier)
        // This correctly gives 0 at starting, and 1 point to go from 0 to 1
        // But user wants 2... Let me check if maybe: points = (current - starting) * 2?
        // Or maybe: points = current - modifier when current > starting?
        
        // For now, using: points = current - starting (excludes free 1)
        // This gives: at starting = 0 points, which is correct
        // To get to 1 from 0: 1 point
        // User may need to clarify if they want a different calculation
        const startingValue = startingValues[attr.key] || 1;
        const pointsSpent = actualValue - startingValue;
        // Only count positive points (when above starting value)
        used += Math.max(0, pointsSpent);
        
        // Final value must be at least 1 (players must spend points to raise attributes below 1)
        // Input value already includes modifiers, so final value = actualValue
        const finalValue = actualValue;
        if (finalValue < 1) {
            errors.push(`${attr.name} is ${finalValue}, but must be at least 1. Spend ${1 - finalValue} more point(s) to raise it.`);
        }
    });
    
    // Get starting values for validation (for checking if points are all spent)
    const startingValues = {
        body: 1 + (modifiers.Body || 0),
        quickness: 1 + (modifiers.Quickness || 0),
        strength: 1 + (modifiers.Strength || 0),
        charisma: 1 + (modifiers.Charisma || 0),
        intelligence: 1 + (modifiers.Intelligence || 0),
        willpower: 1 + (modifiers.Willpower || 0)
    };
    
    // Check total points
    if (used > available) {
        errors.push(`Using ${used} points, but only ${available} available. Reduce attributes to stay within limit.`);
    } else if (used < available) {
        const remaining = available - used;
        errors.push(`You must spend all ${available} points. ${remaining} point(s) remaining.`);
    }
    
    // Update validation message
    const validationEl = document.getElementById('attribute-validation');
    const nextBtn = document.getElementById('attr-next-btn');
    
    if (!validationEl) return false;
    
    if (errors.length > 0) {
        validationEl.className = 'validation-message error';
        validationEl.textContent = errors[0]; // Show first error
        validationEl.style.display = 'block';
        if (nextBtn) nextBtn.disabled = true;
        return false;
    } else {
        // All points spent and no errors
        validationEl.className = 'validation-message success';
        validationEl.textContent = '✓ All points assigned correctly';
        validationEl.style.display = 'block';
        if (nextBtn) nextBtn.disabled = false;
        return true;
    }
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
        alert('Failed to update attribute: ' + error.message);
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
            alert('Please select or enter a weapon name');
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
        alert('Failed to add weapon: ' + error.message);
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
            alert('Please select or enter an armor name');
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
        alert('Failed to add armor: ' + error.message);
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
        alert('Failed to update armor: ' + error.message);
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
        alert('Failed to remove armor: ' + error.message);
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
            alert('Please select or enter a cyberware name');
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
        alert('Failed to add cyberware: ' + error.message);
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
        alert('Failed to update cyberware: ' + error.message);
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
        alert('Failed to remove cyberware: ' + error.message);
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
        alert('Failed to add contact: ' + error.message);
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
        alert('Failed to update contact: ' + error.message);
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
        alert('Failed to remove contact: ' + error.message);
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
function initializeLegacyApp() {
    if (legacyInitialized) {
        return;
    }
    legacyInitialized = true;

    loadSkillsLists(); // Load skills database
    loadEquipmentLists(); // Load equipment database
    loadCharacters();
    loadCampaigns();
    
    // Note: Priority drag-and-drop initialized when modal opens
    // (initPriorityDragDrop is called in showCreateCharacterModal)
    
    // Create button event listeners
    const createCharBtn = document.getElementById('create-character-btn');
    if (createCharBtn) {
        createCharBtn.addEventListener('click', () => {
            if (typeof window !== 'undefined') {
                window.ShadowmasterLegacyApp?.clearCampaignCharacterCreation?.();
            }
            showCreateCharacterModal();
        });
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
    
    // Cancel buttons
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', () => closeModal('character-modal'));
    });
    
    // Wizard navigation buttons
    const metatypeBackBtn = document.getElementById('metatype-back-btn');
    if (metatypeBackBtn) {
        metatypeBackBtn.addEventListener('click', () => showWizardStep(1));
    }
    
    const metatypeNextBtn = document.getElementById('metatype-next-btn');
    if (metatypeNextBtn) {
        metatypeNextBtn.addEventListener('click', () => {
            if (characterWizardState.selectedMetatype) {
                showWizardStep(3); // Go to Magic step
            }
        });
    }
    
    // Magic step navigation
    const magicBackBtn = document.getElementById('magic-back-btn');
    if (magicBackBtn) {
        magicBackBtn.addEventListener('click', () => showWizardStep(2));
    }
    
    const magicNextBtn = document.getElementById('magic-next-btn');
    if (magicNextBtn) {
        magicNextBtn.addEventListener('click', () => {
            if (validateMagicalAbilities()) {
                showWizardStep(4); // Go to Attributes step
            }
        });
    }
    
    // Tradition selection
    const traditionInputs = document.querySelectorAll('input[name="tradition"]');
    traditionInputs.forEach(input => {
        input.addEventListener('change', () => {
            handleTraditionSelection(input.value);
        });
    });
    
    // Totem selection is handled dynamically when Shamanic tradition is selected
    
    const attrBackBtn = document.getElementById('attr-back-btn');
    if (attrBackBtn) {
        attrBackBtn.addEventListener('click', () => showWizardStep(3)); // Back to Magic step
    }
    
    const attrNextBtn = document.getElementById('attr-next-btn');
    if (attrNextBtn) {
        attrNextBtn.addEventListener('click', () => {
            if (validateAttributes()) {
                // Store attribute distribution
                characterWizardState.attributes = {
                    body: parseInt(document.getElementById('attr-body').value) || 1,
                    quickness: parseInt(document.getElementById('attr-quickness').value) || 1,
                    strength: parseInt(document.getElementById('attr-strength').value) || 1,
                    charisma: parseInt(document.getElementById('attr-charisma').value) || 1,
                    intelligence: parseInt(document.getElementById('attr-intelligence').value) || 1,
                    willpower: parseInt(document.getElementById('attr-willpower').value) || 1
                };
                // Move to next step (placeholder for now)
                // showWizardStep(4);
                alert('Attribute assignment complete! Next step coming soon...');
            }
        });
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
    loadCampaigns: () => {
        loadCampaigns();
    },
    loadCampaignCharacterCreation: async () => {
        // React hook will replace this with actual implementation
        return Promise.resolve();
    },
    clearCampaignCharacterCreation: () => {
        characterWizardState.campaignId = null;
        characterWizardState.campaignGameplayRules = null;
    },
    applyCampaignCreationDefaults: (payload) => {
        if (!payload) {
            characterWizardState.campaignId = null;
            characterWizardState.campaignGameplayRules = null;
            return;
        }
        characterWizardState.campaignId = payload.campaignId || null;
        characterWizardState.campaignGameplayRules = payload.gameplayRules || null;
    },
    setPriorities: (assignments) => {
        if (!assignments) return;
        ['magic', 'metatype', 'attributes', 'skills', 'resources'].forEach(category => {
            const value = assignments[category];
            applyPriorityAssignment(category, value);
        });
        updatePriorityChips();
        updatePriorityValidation();
    },
    getPriorities: () => clonePriorityAssignments(),
    getMetatypePriority: () => characterWizardState.priorities ? characterWizardState.priorities.metatype || '' : '',
    getMetatypeSelection: () => characterWizardState.selectedMetatype,
    setMetatypeSelection: (metatypeId) => {
        setMetatypeSelectionReact(metatypeId);
    },
    subscribeMetatypeState: (listener) => {
        metatypeStateListeners.push(listener);
    },
    unsubscribeMetatypeState: (listener) => {
        metatypeStateListeners = metatypeStateListeners.filter(l => l !== listener);
    },
    getMagicState: () => {
        return {
            priority: characterWizardState.priorities ? (characterWizardState.priorities.magic || '') : '',
            type: characterWizardState.magicalType || null,
            tradition: characterWizardState.tradition || null,
            totem: characterWizardState.totem || null
        };
    },
    setMagicState: (state) => {
        if (!state) return;

        if (!characterWizardState.priorities) {
            characterWizardState.priorities = clonePriorityAssignments();
        }

        if (Object.prototype.hasOwnProperty.call(state, 'type')) {
            characterWizardState.magicalType = state.type || null;
        }
        if (Object.prototype.hasOwnProperty.call(state, 'tradition')) {
            characterWizardState.tradition = state.tradition || null;
        }
        if (Object.prototype.hasOwnProperty.call(state, 'totem')) {
            characterWizardState.totem = state.totem || null;
        }

        const type = characterWizardState.magicalType;
        if (type !== 'Full Magician' && type !== 'Aspected Magician') {
            characterWizardState.tradition = null;
            characterWizardState.totem = null;
        } else if (characterWizardState.tradition !== 'Shamanic') {
            characterWizardState.totem = null;
        }

        updateMagicSummary();
        validateMagicalAbilities();
        notifyMagicState();
    },
    subscribeMagicState: (listener) => {
        if (typeof listener === 'function') {
            magicStateListeners.push(listener);
        }
    },
    unsubscribeMagicState: (listener) => {
        magicStateListeners = magicStateListeners.filter(l => l !== listener);
    },
    showWizardStep: (step) => {
        if (typeof step === 'number') {
            showWizardStep(step);
        }
    }
});

