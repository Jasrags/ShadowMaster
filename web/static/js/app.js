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
            card.innerHTML = `
                <h3>${char.name}</h3>
                <p>Player: ${char.player_name || 'N/A'}</p>
                <p>Edition: ${char.edition || 'N/A'}</p>
            `;
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
    const name = prompt('Character name:');
    if (!name) return;
    
    const playerName = prompt('Player name:') || '';
    
    createCharacter(name, playerName)
        .then(() => {
            alert('Character created successfully!');
        })
        .catch(error => {
            alert('Failed to create character: ' + error.message);
        });
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

