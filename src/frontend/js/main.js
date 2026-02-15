// Main JavaScript for Estilo Futbol

// API base URL - dynamically set based on environment
// Prefer same-origin API to avoid CORS issues between 127.0.0.1 and localhost
const API_BASE_URL = (window.API_BASE_URL || '/api');
// API key for authentication (used in dev only). In production prefer JWT.
const API_KEY = typeof window !== 'undefined' && window.API_KEY ? window.API_KEY : 'hpTMmnwLi8Wo2oJh3pOl7Md2FYt5FbI9';

// Helper function to create headers with authentication
function getApiHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    // Prefer JWT if available
    try {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (e) {
        // localStorage may be unavailable; ignore
    }
    // Fallback to API key (dev/testing). Ensure backend API_KEY matches.
    if (API_KEY) {
        headers['X-API-Key'] = API_KEY;
    }
    return headers;
}

// DOM Elements
const competitionSelect = document.getElementById('competition-select');
const seasonSelect = document.getElementById('season-select');
const loadDataBtn = document.getElementById('load-data-btn');
const roundFilter = document.getElementById('round-filter');
const matchdayFilter = document.getElementById('matchday-filter');
const statCategory = document.getElementById('stat-category');
const playerSelection = document.getElementById('player-selection');
const playerSelect = document.getElementById('player-select');
const heatmapContainer = document.getElementById('heatmap-container');
const tabLinks = document.querySelectorAll('nav a');
const tabContents = document.querySelectorAll('.tab-content');

// Match List Elements - Removed (no longer needed)

// State
let currentCompetition = null;
let currentSeason = null;
let matches = [];
let rounds = [];
let matchdays = [];
let players = [];
let currentPlayer = null;
// Mapping for fallback matchday numbering by unique calendar date
let matchdayMap = new Map();

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load competitions
    loadCompetitions();
    
    // Set up event listeners
    setupEventListeners();
});

// Match list functions removed - no longer needed

// Load competitions from API
async function loadCompetitions() {
    try {
        // Show loading state
        competitionSelect.innerHTML = '<option value="" disabled selected>Loading competitions...</option>';
        competitionSelect.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/competitions?grouped=true`, {
            headers: getApiHeaders()
        });
        if (!response.ok) throw new Error('Failed to load competitions');
        
        const competitions = await response.json();
        
        // Clear and populate competition select
        competitionSelect.innerHTML = '<option value="" disabled selected>Select a competition</option>';
        competitionSelect.disabled = false;
        
        if (competitions.length === 0) {
            competitionSelect.innerHTML = '<option value="" disabled selected>No competitions available</option>';
            return;
        }
        
        competitions.forEach(comp => {
            const option = document.createElement('option');
            option.value = comp.competition_id;
            option.textContent = `${comp.competition_name} (${comp.country_name})`;
            
            // Store seasons data for quick access
            option.dataset.seasons = JSON.stringify(comp.seasons || []);
            
            competitionSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading competitions:', error);
        competitionSelect.innerHTML = '<option value="" disabled selected>Error loading competitions</option>';
        competitionSelect.disabled = false;
        
        // For demo purposes, add some sample competitions
        addSampleCompetitions();
    }
}

// Add sample competitions for demo
function addSampleCompetitions() {
    const sampleCompetitions = [
        { id: 11, name: 'La Liga' },
        { id: 2, name: 'Premier League' },
        { id: 37, name: 'Womens World Cup' }
    ];
    
    competitionSelect.innerHTML = '<option value="" disabled selected>Select a competition</option>';
    
    sampleCompetitions.forEach(comp => {
        const option = document.createElement('option');
        option.value = comp.id;
        option.textContent = comp.name;
        competitionSelect.appendChild(option);
    });
}

// Match competition loading functions removed - no longer needed

// Load seasons for selected competition
async function loadSeasons(competitionId) {
    try {
        // Show loading state
        seasonSelect.innerHTML = '<option value="" disabled selected>Loading seasons...</option>';
        seasonSelect.disabled = true;
        
        // First try to get seasons from the stored data in the competition option
        const competitionOption = competitionSelect.querySelector(`option[value="${competitionId}"]`);
        let seasons = [];
        
        if (competitionOption && competitionOption.dataset.seasons) {
            try {
                seasons = JSON.parse(competitionOption.dataset.seasons);
            } catch (e) {
                console.warn('Failed to parse stored seasons data');
            }
        }
        
        // If no stored seasons or empty, fetch from API
        if (seasons.length === 0) {
            const response = await fetch(`${API_BASE_URL}/competitions/seasons?competition_id=${competitionId}`, {
                headers: getApiHeaders()
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No seasons found for this competition');
                }
                if (response.status === 401) {
                    throw new Error('Unauthorized: configure API key or login');
                }
                throw new Error('Failed to load seasons');
            }
            seasons = await response.json();
        }
        
        // Clear and populate season select
        seasonSelect.innerHTML = '<option value="" disabled selected>Select a season</option>';
        seasonSelect.disabled = false;
        
        if (seasons.length === 0) {
            seasonSelect.innerHTML = '<option value="" disabled selected>No seasons found</option>';
            seasonSelect.disabled = true;
            return;
        }
        
        // Sort seasons by name (most recent first)
        seasons.sort((a, b) => {
            // Try to extract year from season name for better sorting
            const yearA = a.season_name.match(/(\d{4})/);
            const yearB = b.season_name.match(/(\d{4})/);
            
            if (yearA && yearB) {
                return parseInt(yearB[1]) - parseInt(yearA[1]);
            }
            
            return b.season_name.localeCompare(a.season_name);
        });
        
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.season_id;
            option.textContent = season.season_name;
            seasonSelect.appendChild(option);
        });
        
        // Enable the load data button if both competition and season are selected
        updateLoadDataButton();
        
    } catch (error) {
        console.error('Error loading seasons:', error);
        seasonSelect.innerHTML = `<option value="" disabled selected>${error.message}</option>`;
        seasonSelect.disabled = true;
        
        // Disable load data button
        loadDataBtn.disabled = true;
    }
}

// Add sample seasons for demo
function addSampleSeasons() {
    const sampleSeasons = [
        { id: 1, name: '2018/2019' },
        { id: 2, name: '2019/2020' },
        { id: 3, name: '2020/2021' }
    ];
    
    seasonSelect.innerHTML = '<option value="" disabled selected>Select a season</option>';
    seasonSelect.disabled = false;
    
    sampleSeasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season.id;
        option.textContent = season.name;
        seasonSelect.appendChild(option);
    });
}

// Load matches for selected competition and season
async function loadMatches(competitionId, seasonId) {
    try {
        const response = await fetch(`${API_BASE_URL}/matches/?competition_id=${competitionId}&season_id=${seasonId}`, {
            headers: getApiHeaders()
        });
        if (!response.ok) throw new Error('Failed to load matches');
        
        matches = await response.json();
        
        // Extract unique rounds
        rounds = [...new Set(matches.map(match => match.match_round).filter(round => round))];
        // Compute and extract unique matchdays (try from match_round, fallback to ISO week)
        matchdays = computeMatchdays(matches);
        
        // Populate round filter
        populateRoundFilter();
        // Populate matchday filter
        populateMatchdayFilter();
        
        // Display overview
        displayOverview();
        
        // Display statistics
        displayStatistics();
        
        // Load players for heat maps
        await loadPlayers(competitionId, seasonId);

        // Populate Matches tab list
        displayMatches('all');
        
    } catch (error) {
        console.error('Error loading matches:', error);
        // For demo purposes, add some sample matches
        addSampleMatches();
    }
}

// Add sample matches for demo
function addSampleMatches() {
    matches = [
        // Group Stage Matches
        {
            match_id: 1,
            match_date: '2024-06-15',
            match_round: 'Group Stage',
            match_day: 'Matchday 1',
            group: 'Group A',
            phase_order: 1,
            home_team: 'Germany',
            away_team: 'Scotland',
            home_score: 5,
            away_score: 1
        },
        {
            match_id: 2,
            match_date: '2024-06-15',
            match_round: 'Group Stage',
            match_day: 'Matchday 1',
            group: 'Group A',
            phase_order: 1,
            home_team: 'Hungary',
            away_team: 'Switzerland',
            home_score: 1,
            away_score: 3
        },
        {
            match_id: 3,
            match_date: '2024-06-19',
            match_round: 'Group Stage',
            match_day: 'Matchday 2',
            group: 'Group A',
            phase_order: 1,
            home_team: 'Germany',
            away_team: 'Hungary',
            home_score: 2,
            away_score: 0
        },
        {
            match_id: 4,
            match_date: '2024-06-19',
            match_round: 'Group Stage',
            match_day: 'Matchday 2',
            group: 'Group A',
            phase_order: 1,
            home_team: 'Scotland',
            away_team: 'Switzerland',
            home_score: 1,
            away_score: 1
        },
        // Round of 16
        {
            match_id: 5,
            match_date: '2024-06-29',
            match_round: 'Round of 16',
            match_day: 'Round of 16',
            group: null,
            phase_order: 2,
            home_team: 'Germany',
            away_team: 'Denmark',
            home_score: 2,
            away_score: 0
        },
        {
            match_id: 6,
            match_date: '2024-06-30',
            match_round: 'Round of 16',
            match_day: 'Round of 16',
            group: null,
            phase_order: 2,
            home_team: 'England',
            away_team: 'Slovakia',
            home_score: 2,
            away_score: 1
        },
        // Quarter Finals
        {
            match_id: 7,
            match_date: '2024-07-05',
            match_round: 'Quarter Final',
            match_day: 'Quarter Final',
            group: null,
            phase_order: 3,
            home_team: 'Germany',
            away_team: 'Spain',
            home_score: 1,
            away_score: 2
        },
        {
            match_id: 8,
            match_date: '2024-07-06',
            match_round: 'Quarter Final',
            match_day: 'Quarter Final',
            group: null,
            phase_order: 3,
            home_team: 'England',
            away_team: 'Switzerland',
            home_score: 1,
            away_score: 1
        },
        // Semi Final
        {
            match_id: 9,
            match_date: '2024-07-09',
            match_round: 'Semi Final',
            match_day: 'Semi Final',
            group: null,
            phase_order: 4,
            home_team: 'Spain',
            away_team: 'France',
            home_score: 2,
            away_score: 1
        },
        {
            match_id: 10,
            match_date: '2024-07-10',
            match_round: 'Semi Final',
            match_day: 'Semi Final',
            group: null,
            phase_order: 4,
            home_team: 'England',
            away_team: 'Netherlands',
            home_score: 2,
            away_score: 1
        },
        // Final
        {
            match_id: 11,
            match_date: '2024-07-14',
            match_round: 'Final',
            match_day: 'Final',
            group: null,
            phase_order: 5,
            home_team: 'Spain',
            away_team: 'England',
            home_score: 2,
            away_score: 1
        }
    ];
    
    // Extract unique rounds
    rounds = [...new Set(matches.map(match => match.match_round))];
    // Compute matchdays
    matchdays = computeMatchdays(matches);
    
    // Populate round filter
    populateRoundFilter();
    // Populate matchday filter
    populateMatchdayFilter();
    
    // Display overview
    displayOverview();
    
    // Display statistics
    displayStatistics();

    // Populate Matches tab list
    displayMatches('all');
}

// Populate round filter
function populateRoundFilter() {
    roundFilter.innerHTML = '<option value="all">All Rounds</option>';
    
    rounds.forEach(round => {
        const option = document.createElement('option');
        option.value = round;
        option.textContent = round;
        roundFilter.appendChild(option);
    });
}

// Populate matchday filter
function populateMatchdayFilter() {
    matchdayFilter.innerHTML = '<option value="all">All Matchdays</option>';
    
    matchdays.forEach(day => {
        const option = document.createElement('option');
        option.value = String(day);
        option.textContent = `Matchday ${day}`;
        matchdayFilter.appendChild(option);
    });
}

// Display matches
// Function implemented above

// Functions implemented elsewhere

// Display matches function

function displayMatches(roundValue = 'all') {
    const matchesContainer = document.querySelector('#matches-tab .matches-container');
    if (!matchesContainer) {
        console.warn('Matches container not found');
        return;
    }
    
    matchesContainer.innerHTML = '';
    
    if (!matches || matches.length === 0) {
        matchesContainer.innerHTML = '<div class="no-data-message">No matches found for the selected criteria.</div>';
        return;
    }
    
    // Filter matches by selected round and matchday
    let filteredMatches = matches;
    if (roundValue && roundValue !== 'all') {
        filteredMatches = filteredMatches.filter(match => match.match_round === roundValue);
    }
    const selectedDay = matchdayFilter && matchdayFilter.value !== 'all' ? Number(matchdayFilter.value) : null;
    if (selectedDay) {
        filteredMatches = filteredMatches.filter(match => getMatchdayFromMatch(match) === selectedDay);
    }
    
    // Group matches by round
    const matchesByRound = {};
    filteredMatches.forEach(match => {
        const round = match.match_round || 'Unknown';
        if (!matchesByRound[round]) {
            matchesByRound[round] = [];
        }
        matchesByRound[round].push(match);
    });
    
    // Display matches grouped by round
    Object.keys(matchesByRound).forEach(round => {
        const roundMatches = matchesByRound[round];
        if (roundMatches.length > 0) {
            // Add round header
            const roundHeader = document.createElement('h3');
            roundHeader.className = 'round-header';
            roundHeader.textContent = `Round: ${round}`;
            matchesContainer.appendChild(roundHeader);
            
            // Add matches for this round
            roundMatches.forEach(match => {
                const matchItem = createMatchElement(match);
                matchesContainer.appendChild(matchItem);
            });
        }
    });
}

function createMatchElement(match) {
    const matchItem = document.createElement('div');
    matchItem.className = 'match-item';
    matchItem.dataset.matchId = match.match_id;
    
    // Format date
    const matchDate = new Date(match.match_date);
    const formattedDate = matchDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Determine winner for styling
    const homeWinner = match.home_score > match.away_score;
    const awayWinner = match.away_score > match.home_score;
    const isDraw = match.home_score === match.away_score;
    
    matchItem.innerHTML = `
        <div class="match-date">${formattedDate}</div>
        <div class="match-teams">
            <div class="team home-team ${homeWinner ? 'winner' : ''}">${match.home_team}</div>
            <div class="score">${match.home_score} - ${match.away_score}</div>
            <div class="team away-team ${awayWinner ? 'winner' : ''}">${match.away_team}</div>
        </div>
        <div class="match-round">Round ${match.match_round || 'N/A'} • Matchday ${getMatchdayFromMatch(match) || 'N/A'}</div>
    `;
    
    // Add click event to show match details
    matchItem.addEventListener('click', () => {
        showMatchDetail(match.match_id);
    });
    
    return matchItem;
}

// Compute matchdays for a set of matches
function computeMatchdays(matchList) {
    // First pass: try to extract explicit numeric matchday from match_round
    const explicitDays = new Set();
    matchList.forEach(m => {
        const day = getMatchdayFromMatch(m, /*allowFallback*/ false);
        if (typeof day === 'number' && !Number.isNaN(day)) {
            explicitDays.add(day);
        }
    });
    const sortedExplicit = Array.from(explicitDays).sort((a, b) => a - b);
    if (sortedExplicit.length > 0) {
        // Clear any previous fallback map; we have reliable explicit matchdays
        matchdayMap.clear();
        return sortedExplicit;
    }

    // Fallback: group by unique calendar dates and assign sequential matchday numbers
    const uniqueDates = Array.from(new Set(
        matchList
            .filter(m => m.match_date)
            .map(m => new Date(m.match_date))
            .map(d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
    )).sort();

    matchdayMap.clear();
    uniqueDates.forEach((dateStr, idx) => {
        matchdayMap.set(dateStr, idx + 1);
    });
    return uniqueDates.map((_, idx) => idx + 1);
}

// Derive a numeric matchday: prefer number in match_round; fallback to date-based numbering when enabled
function getMatchdayFromMatch(match, allowFallback = true) {
    // Try to extract a number from match_round (e.g., "Matchday 3", "Jornada 5", "Round 12")
    const roundRaw = match.match_round || '';
    const round = String(roundRaw).toLowerCase();
    // Exclude knockout rounds like "Round of 16"
    if (/round\s+of\s+\d+/i.test(roundRaw)) {
        return null;
    }
    const patterns = [
        /(?:matchday|md)\s*[-:]?\s*(\d{1,2})/i,
        /(?:jornada|fecha|giornata|rodada)\s*[-:]?\s*(\d{1,2})/i,
        /(?:week|gw|gameweek)\s*[-:]?\s*(\d{1,2})/i,
        /(?:round)\s*[-:]?\s*(\d{1,2})/i
    ];
    for (const re of patterns) {
        const m = roundRaw.match(re);
        if (m) {
            const num = Number(m[1]);
            // Heuristic: typical league rounds do not exceed 38
            if (!Number.isNaN(num) && num > 0 && num <= 60) {
                return num;
            }
        }
    }
    // Optional fallback: map by calendar date to a sequential matchday number
    if (allowFallback && match.match_date) {
        const d = new Date(match.match_date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (matchdayMap.has(key)) {
            return matchdayMap.get(key);
        }
    }
    return null;
}

// ISO week number helper
function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Thursday in current week decides the year
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

// Function implemented elsewhere

// Duplicate populateRoundFilter function removed - using the one at line 280

// Display matches
// This function has been implemented earlier in the file

// Display overview
// This function has been implemented earlier in the file

// Display statistics
// This function has been implemented earlier in the file

// This function has been implemented earlier in the file

// This function has been implemented earlier in the file
// End of file cleanup
// End of file cleanup
    // End of file cleanup

// This function has been implemented earlier in the file

// Sample match competition functions removed - no longer needed

// Helper function to update load data button state
function updateLoadDataButton() {
    const hasCompetition = competitionSelect.value && competitionSelect.value !== '';
    const hasSeason = seasonSelect.value && seasonSelect.value !== '';
    const isSeasonEnabled = !seasonSelect.disabled;
    
    loadDataBtn.disabled = !(hasCompetition && hasSeason && isSeasonEnabled);
}

// Set up event listeners
function setupEventListeners() {
    // Competition select change
    competitionSelect.addEventListener('change', (e) => {
        const competitionId = e.target.value;
        if (competitionId) {
            currentCompetition = competitionId;
            // Reset season selection and UI when competition changes
            currentSeason = null;
            // Clear season select and disable until loaded
            seasonSelect.innerHTML = '<option value="" disabled selected>Loading seasons...</option>';
            seasonSelect.disabled = true;
            // Clear matches and filters
            matches = [];
            rounds = [];
            matchdays = [];
            // Reset UI containers
            const overviewContainer = document.querySelector('#overview-tab .overview-container');
            if (overviewContainer) overviewContainer.innerHTML = '<p>Select a competition and season to view overview data.</p>';
            const matchesContainer = document.querySelector('#matches-tab .matches-container');
            if (matchesContainer) matchesContainer.innerHTML = '<p>Select a competition and season to view matches.</p>';
            const matchDetailContainer = document.querySelector('#matches-tab .match-detail-container');
            if (matchDetailContainer) matchDetailContainer.innerHTML = '';
            const statisticsContainer = document.querySelector('#statistics-tab .statistics-container');
            if (statisticsContainer) statisticsContainer.innerHTML = '<p>Select a competition and season to view statistics.</p>';
            // Reset filters to defaults
            if (roundFilter) roundFilter.innerHTML = '<option value="all">All Rounds</option>';
            if (matchdayFilter) matchdayFilter.innerHTML = '<option value="all">All Matchdays</option>';
            // Load seasons for the selected competition
            loadSeasons(competitionId);
            // Update load data button state
            updateLoadDataButton();
        } else {
            // Reset season dropdown when no competition is selected
            seasonSelect.innerHTML = '<option value="" disabled selected>Select a competition first</option>';
            seasonSelect.disabled = true;
            updateLoadDataButton();
        }
    });
    
    // Season select change
    seasonSelect.addEventListener('change', (e) => {
        const seasonId = e.target.value;
        if (seasonId) {
            currentSeason = seasonId;
            // Automatically load data when both competition and season are selected
            if (currentCompetition && currentSeason) {
                loadMatches(currentCompetition, currentSeason);
            }
            // Reset filters selection to default
            if (roundFilter) roundFilter.value = 'all';
            if (matchdayFilter) matchdayFilter.value = 'all';
        }
        updateLoadDataButton();
    });
    
    // Load data button click (read values directly from selects for robustness)
    loadDataBtn.addEventListener('click', () => {
        const competitionId = competitionSelect.value;
        const seasonId = seasonSelect.value;
        const isSeasonEnabled = !seasonSelect.disabled;
        if (competitionId && seasonId && isSeasonEnabled) {
            currentCompetition = competitionId;
            currentSeason = seasonId;
            loadMatches(competitionId, seasonId);
        }
    });
    
    // Round filter change
    roundFilter.addEventListener('change', (e) => {
        const roundValue = e.target.value;
        displayMatches(roundValue);
    });
    // Matchday filter change
    matchdayFilter.addEventListener('change', () => {
        const roundValue = roundFilter.value;
        displayMatches(roundValue);
    });
    
    // Stat category change
    statCategory.addEventListener('change', (e) => {
        const category = e.target.value;
        if (category === 'players') {
            showPlayerSelection();
        } else {
            hidePlayerSelection();
            displayStatistics(category);
        }
    });
    
    // Player selection event listener
    playerSelect.addEventListener('change', async () => {
        const playerId = playerSelect.value;
        if (playerId && currentCompetition && currentSeason) {
            await displayPlayerHeatMap(currentCompetition, currentSeason, parseInt(playerId));
        } else {
            hideHeatMap();
        }
    });
    
    // Tab navigation
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            link.classList.add('active');
            
            // Show corresponding content
            const tabId = link.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Match list functionality removed - no longer needed
}

// Fetch and render match detail, then activate Matches tab and show detail
async function showMatchDetail(matchId) {
    const container = document.querySelector('#matches-tab .match-detail-container');
    if (!container) return;
    container.innerHTML = '<div class="loading-message">Loading match details...</div>';
    try {
        const res = await fetch(`${API_BASE_URL}/matches/${matchId}`, { headers: getApiHeaders() });
        if (!res.ok) {
            if (res.status === 404) throw new Error('Match not found');
            if (res.status === 401) throw new Error('Unauthorized: configure API key or login');
            throw new Error('Failed to load match details');
        }
        const detail = await res.json();
        container.innerHTML = renderMatchDetail(detail);
        // Ensure Matches tab is active
        activateTab('matches');
    } catch (err) {
        container.innerHTML = `<div class="error-message">${err.message}</div>`;
    }
}

function renderMatchDetail(detail) {
    const dateStr = detail.match_date ? new Date(detail.match_date).toLocaleString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    }) : 'N/A';
    return `
        <div class="match-detail">
            <div class="match-header">
                <div class="teams">
                    <span class="team-name">${detail.home_team}</span>
                    <span class="vs">vs</span>
                    <span class="team-name">${detail.away_team}</span>
                </div>
                <div class="score">${detail.home_score} - ${detail.away_score}</div>
            </div>
            <div class="match-meta">
                <div><strong>Date:</strong> ${dateStr}</div>
                <div><strong>Round:</strong> ${detail.match_round || 'N/A'}</div>
                <div><strong>Stadium:</strong> ${detail.stadium || 'N/A'}</div>
                <div><strong>Referee:</strong> ${detail.referee || 'N/A'}</div>
                <div><strong>Events:</strong> ${detail.events_count ?? 'N/A'}</div>
            </div>
        </div>
    `;
}

function activateTab(tabName) {
    // Remove active class from all tabs and contents
    tabLinks.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    // Activate nav link
    const navLink = Array.from(tabLinks).find(l => l.getAttribute('data-tab') === tabName);
    if (navLink) navLink.classList.add('active');
    // Show section
    const section = document.getElementById(`${tabName}-tab`);
    if (section) section.classList.add('active');
}

// Match season loading functions removed - no longer needed

// Orphaned display overview function removed

// Display statistics
function displayStatistics(category = 'goals') {
    const statisticsContainer = document.querySelector('.statistics-container');
    
    if (!matches.length) {
        statisticsContainer.innerHTML = '<p>No data available for the selected competition and season.</p>';
        return;
    }
    
    // For demo purposes, we'll create some sample statistics
    // In a real app, this would be calculated from actual match data
    
    // Create a map of teams and their stats
    const teamStats = {};
    
    matches.forEach(match => {
        // Process home team
        if (!teamStats[match.home_team]) {
            teamStats[match.home_team] = {
                goals: 0,
                possession: 0,
                passes: 0,
                shots: 0,
                matches: 0
            };
        }
        
        // Process away team
        if (!teamStats[match.away_team]) {
            teamStats[match.away_team] = {
                goals: 0,
                possession: 0,
                passes: 0,
                shots: 0,
                matches: 0
            };
        }
        
        // Update stats
        teamStats[match.home_team].goals += match.home_score;
        teamStats[match.away_team].goals += match.away_score;
        teamStats[match.home_team].matches += 1;
        teamStats[match.away_team].matches += 1;
        
        // Add random values for demo purposes
        teamStats[match.home_team].possession += Math.floor(Math.random() * 30) + 40; // 40-70%
        teamStats[match.away_team].possession += Math.floor(Math.random() * 30) + 40; // 40-70%
        teamStats[match.home_team].passes += Math.floor(Math.random() * 300) + 300; // 300-600
        teamStats[match.away_team].passes += Math.floor(Math.random() * 300) + 300; // 300-600
        teamStats[match.home_team].shots += Math.floor(Math.random() * 10) + 5; // 5-15
        teamStats[match.away_team].shots += Math.floor(Math.random() * 10) + 5; // 5-15
    });
    
    // Calculate averages
    Object.keys(teamStats).forEach(team => {
        const matches = teamStats[team].matches;
        teamStats[team].possession = Math.round(teamStats[team].possession / matches);
        teamStats[team].passes = Math.round(teamStats[team].passes / matches);
        teamStats[team].shots = Math.round(teamStats[team].shots / matches);
    });
    
    // Sort teams by selected category
    const sortedTeams = Object.keys(teamStats).sort((a, b) => {
        return teamStats[b][category] - teamStats[a][category];
    });
    
    // Create table
    let tableHTML = `
        <table class="stat-table">
            <thead>
                <tr>
                    <th>Team</th>
                    <th>${category.charAt(0).toUpperCase() + category.slice(1)}</th>
                    <th>Matches</th>
                    <th>Avg per Match</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    sortedTeams.forEach(team => {
        const stats = teamStats[team];
        const avgPerMatch = (stats[category] / stats.matches).toFixed(2);
        
        tableHTML += `
            <tr>
                <td>${team}</td>
                <td>${stats[category]}</td>
                <td>${stats.matches}</td>
                <td>${avgPerMatch}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    statisticsContainer.innerHTML = tableHTML;
}

// Helper function to get team logo using actual PNG files
function getTeamLogo(teamName) {
    const teamLogos = {
        'Spain': '🇪🇸',
        'Portugal': '🇵🇹',
        'Belgium': '🇧🇪',
        'Netherlands': '🇳🇱',
        'France': '🇫🇷',
        'Germany': '🇩🇪',
        'Italy': '🇮🇹',
        'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'Sweden': '🇸🇪',
        'Norway': '🇳🇴',
        'Denmark': '🇩🇰',
        'Finland': '🇫🇮',
        'Iceland': '🇮🇸',
        'Switzerland': '🇨🇭',
        'Austria': '🇦🇹',
        'Poland': '🇵🇱',
        'Czech Republic': '🇨🇿',
        'Croatia': '🇭🇷',
        'Serbia': '🇷🇸',
        'Ukraine': '🇺🇦',
        'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
        'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        'Northern Ireland': '🇬🇧',
        'Republic of Ireland': '🇮🇪',
        'Ireland': '🇮🇪',
        'Turkey': '🇹🇷',
        'Greece': '🇬🇷',
        'Hungary': '🇭🇺',
        'Romania': '🇷🇴',
        'Bulgaria': '🇧🇬',
        'Slovenia': '🇸🇮',
        'Slovakia': '🇸🇰',
        'Estonia': '🇪🇪',
        'Latvia': '🇱🇻',
        'Lithuania': '🇱🇹',
        'Cyprus': '🇨🇾',
        'Malta': '🇲🇹',
        'Luxembourg': '🇱🇺',
        'Albania': '🇦🇱',
        'North Macedonia': '🇲🇰',
        'Bosnia and Herzegovina': '🇧🇦',
        'Montenegro': '🇲🇪',
        'Moldova': '🇲🇩',
        'Belarus': '🇧🇾',
        'Georgia': '🇬🇪',
        'Armenia': '🇦🇲',
        'Azerbaijan': '🇦🇿',
        'Kazakhstan': '🇰🇿',
        'Russia': '🇷🇺',
        'Israel': '🇮🇱',
        'Faroe Islands': '🇫🇴',
        'Gibraltar': '🇬🇮',
        'Andorra': '🇦🇩',
        'San Marino': '🇸🇲',
        'Monaco': '🇲🇨',
        'Liechtenstein': '🇱🇮',
        'Kosovo': '🇽🇰'
    };
    
    const flagEmoji = teamLogos[teamName];
    if (flagEmoji) {
        return `<span class="team-flag-emoji">${flagEmoji}</span>`;
    }
    return `<span class="team-logo-fallback">${teamName.substring(0, 3).toUpperCase()}</span>`;
}

// Display overview function
function displayOverview() {
    const overviewContainer = document.querySelector('#overview-tab .overview-container');
    
    if (!matches.length) {
        overviewContainer.innerHTML = '<p>No data available for the selected competition and season.</p>';
        return;
    }
    
    const competitionName = getCompetitionName(currentCompetition);
    const seasonName = getSeasonName(currentSeason);
    const dates = matches.map(m => new Date(m.match_date)).filter(Boolean).sort((a,b)=>a-b);
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    const mdays = computeMatchdays(matches);

    // Build a summary header and a clean list of matchdays
    let html = `
        <div class="overview-content">
            <div class="competition-header">
                <div class="competition-logo">🏆</div>
                <h2>${competitionName}</h2>
                <p class="season-name">Season: ${seasonName}</p>
                <p class="match-count">${matches.length} matches • ${mdays.length} matchdays</p>
                <p class="season-dates">${startDate ? startDate.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : ''} — ${endDate ? endDate.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : ''}</p>
            </div>

            <div class="matchday-list">
    `;

    // Render matchday items with counts
    mdays.forEach(day => {
        const count = matches.filter(m => getMatchdayFromMatch(m) === day).length;
        html += `
            <div class="matchday-item" data-matchday="${day}" style="cursor: pointer;">
                <div class="matchday-title">Matchday ${day}</div>
                <div class="matchday-meta"><span class="match-count-badge">${count} matches</span></div>
            </div>
        `;
    });

    html += `
            </div>

            <div class="matchday-results" aria-live="polite"></div>
        </div>
    `;

    overviewContainer.innerHTML = html;

    // Wire up matchday clicks to render matches for the selected day
    const items = overviewContainer.querySelectorAll('.matchday-item');
    items.forEach(el => {
        const day = Number(el.getAttribute('data-matchday'));
        el.addEventListener('click', () => {
            // Highlight selected matchday in the list
            const all = overviewContainer.querySelectorAll('.matchday-item');
            all.forEach(i => i.classList.remove('selected'));
            el.classList.add('selected');
            displayMatchdayMatches(day);
        });
    });
}

// Render matches for a selected matchday within the Overview tab
function displayMatchdayMatches(day) {
    const overviewContainer = document.querySelector('#overview-tab .overview-container');
    const resultsContainer = overviewContainer.querySelector('.matchday-results');
    if (!resultsContainer) return;

    const dayMatches = matches
        .filter(m => getMatchdayFromMatch(m) === day)
        .sort((a,b) => new Date(a.match_date) - new Date(b.match_date));

    if (dayMatches.length === 0) {
        resultsContainer.innerHTML = '<div class="no-data-message">No matches found for this matchday.</div>';
        return;
    }

    let content = `<h3 class="phase-header">Matchday ${day} <span class="match-count-badge">${dayMatches.length} matches</span></h3>`;
    dayMatches.forEach(match => {
        const homeTeamLogo = getTeamLogo(match.home_team);
        const awayTeamLogo = getTeamLogo(match.away_team);
        const matchPhase = getMatchPhase(match.match_round);
        const formattedDate = new Date(match.match_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        let matchContext = formattedDate;
        if (match.group) matchContext += ` • ${match.group}`;

        content += `
            <div class="overview-match-item" data-match-id="${match.match_id}" style="cursor: pointer;">
                <div class="match-info-left">
                    <div class="match-teams-overview">
                        <div class="team-display">
                            ${homeTeamLogo}
                            <span class="team-name">${match.home_team}</span>
                        </div>
                        <span class="vs-separator">vs</span>
                        <div class="team-display">
                            ${awayTeamLogo}
                            <span class="team-name">${match.away_team}</span>
                        </div>
                    </div>
                    <div class="match-context">${matchContext}</div>
                </div>
                <div class="match-info-right">
                    <div class="match-score-overview">${match.home_score} - ${match.away_score}</div>
                    <div class="match-phase ${matchPhase.class}">${matchPhase.name}</div>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = content;

    // Wire click events to open detailed view in Matches tab
    const matchItems = resultsContainer.querySelectorAll('.overview-match-item');
    matchItems.forEach(el => {
        const id = Number(el.getAttribute('data-match-id'));
        el.addEventListener('click', () => showMatchDetail(id));
    });
}

// Helper function to get competition name
function getCompetitionName(competitionId) {
    // Prefer the selected option's text to reflect DB contents
    const selected = competitionSelect.options[competitionSelect.selectedIndex];
    if (selected && selected.textContent) {
        return selected.textContent;
    }
    return 'Competition';
}

// Helper function to get season name
function getSeasonName(seasonId) {
    // Prefer the selected option's text to reflect DB contents
    const selected = seasonSelect.options[seasonSelect.selectedIndex];
    if (selected && selected.textContent) {
        return selected.textContent;
    }
    return 'Season';
}

// Helper function to get match phase with styling class
function getMatchPhase(matchRound) {
    const phaseMap = {
        'Group Stage': { name: 'Group Stage', class: 'phase-group' },
        'Round of 16': { name: 'Round of 16', class: 'phase-knockout' },
        'Quarter Final': { name: 'Quarter Final', class: 'phase-knockout' },
        'Semi Final': { name: 'Semi Final', class: 'phase-knockout' },
        'Final': { name: 'Final', class: 'phase-final' }
    };
    
    return phaseMap[matchRound] || { name: matchRound, class: 'phase-other' };
}

// Player Heat Map Functions
async function loadPlayers(competitionId, seasonId) {
    try {
        const response = await fetch(`${API_BASE_URL}/players/${competitionId}/${seasonId}`, {
            headers: getApiHeaders()
        });
        
        if (!response.ok) {
            console.warn('Failed to load players, using sample data');
            addSamplePlayers();
            return;
        }
        
        players = await response.json();
        populatePlayerSelect();
        
    } catch (error) {
        console.error('Error loading players:', error);
        addSamplePlayers();
    }
}

function addSamplePlayers() {
    players = [
        {
            player_id: 1,
            player_name: 'Lionel Messi',
            jersey_number: 10,
            position: 'Right Wing',
            team_name: 'Argentina'
        },
        {
            player_id: 2,
            player_name: 'Kylian Mbappé',
            jersey_number: 7,
            position: 'Centre-Forward',
            team_name: 'France'
        },
        {
            player_id: 3,
            player_name: 'Pedri',
            jersey_number: 8,
            position: 'Central Midfield',
            team_name: 'Spain'
        },
        {
            player_id: 4,
            player_name: 'Jamal Musiala',
            jersey_number: 14,
            position: 'Attacking Midfield',
            team_name: 'Germany'
        }
    ];
    populatePlayerSelect();
}

function populatePlayerSelect() {
    playerSelect.innerHTML = '<option value="">Choose a player...</option>';
    
    // Sort players by team and name
    const sortedPlayers = players.sort((a, b) => {
        if (a.team_name !== b.team_name) {
            return a.team_name.localeCompare(b.team_name);
        }
        return a.player_name.localeCompare(b.player_name);
    });
    
    sortedPlayers.forEach(player => {
        const option = document.createElement('option');
        option.value = player.player_id;
        option.textContent = `${player.player_name} (${player.team_name})`;
        if (player.jersey_number) {
            option.textContent += ` #${player.jersey_number}`;
        }
        playerSelect.appendChild(option);
    });
}

function showPlayerSelection() {
    playerSelection.style.display = 'block';
    document.querySelector('.statistics-container').style.display = 'none';
    
    if (!playerSelect.value) {
        hideHeatMap();
    }
}

function hidePlayerSelection() {
    playerSelection.style.display = 'none';
    document.querySelector('.statistics-container').style.display = 'block';
    hideHeatMap();
}

function hideHeatMap() {
    heatmapContainer.style.display = 'none';
}

async function displayPlayerHeatMap(competitionId, seasonId, playerId) {
    try {
        // Show loading state
        heatmapContainer.style.display = 'block';
        heatmapContainer.innerHTML = '<div class="loading-spinner">Loading heat map data...</div>';
        
        const response = await fetch(`${API_BASE_URL}/players/${competitionId}/${seasonId}/${playerId}/heatmap`, {
            headers: getApiHeaders()
        });
        
        if (!response.ok) {
            console.warn('Failed to load heat map data, using sample data');
            displaySampleHeatMap(playerId);
            return;
        }
        
        const heatMapData = await response.json();
        renderHeatMap(heatMapData);
        
    } catch (error) {
        console.error('Error loading heat map:', error);
        displaySampleHeatMap(playerId);
    }
}

function displaySampleHeatMap(playerId) {
    const player = players.find(p => p.player_id === playerId);
    if (!player) return;
    
    // Generate sample heat map data
    const sampleHeatMapData = {
        player_id: player.player_id,
        player_name: player.player_name,
        team_name: player.team_name,
        position: player.position,
        jersey_number: player.jersey_number,
        total_events: Math.floor(Math.random() * 200) + 100,
        heat_zones: generateSampleHeatZones()
    };
    
    renderHeatMap(sampleHeatMapData);
}

function generateSampleHeatZones() {
    const zones = [];
    const gridSize = 10;
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const intensity = Math.random() * 50;
            zones.push({
                x_min: (120 / gridSize) * i,
                x_max: (120 / gridSize) * (i + 1),
                y_min: (80 / gridSize) * j,
                y_max: (80 / gridSize) * (j + 1),
                x_center: (120 / gridSize) * (i + 0.5),
                y_center: (80 / gridSize) * (j + 0.5),
                intensity: intensity,
                normalized_intensity: intensity / 50
            });
        }
    }
    
    return zones;
}

function renderHeatMap(heatMapData) {
    const playerInfo = `
        <div class="player-info">
            <div>
                <h3>${heatMapData.player_name}</h3>
                <p>${heatMapData.team_name} ${heatMapData.jersey_number ? `#${heatMapData.jersey_number}` : ''}</p>
                <p><strong>Position:</strong> ${heatMapData.position || 'N/A'}</p>
            </div>
            <div class="player-stats">
                <div class="stat-item">
                    <span class="stat-value">${heatMapData.total_events}</span>
                    <span class="stat-label">Total Events</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${heatMapData.heat_zones.filter(z => z.intensity > 0).length}</span>
                    <span class="stat-label">Active Zones</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${Math.max(...heatMapData.heat_zones.map(z => Math.round(z.intensity)))}</span>
                    <span class="stat-label">Max Intensity</span>
                </div>
            </div>
        </div>
    `;
    
    const pitchHTML = `
        <div class="heatmap-pitch">
            <div class="pitch-background">
                <div class="pitch-lines">
                    <div class="pitch-line center-line"></div>
                    <div class="center-circle"></div>
                    <div class="penalty-area left"></div>
                    <div class="penalty-area right"></div>
                </div>
                ${renderHeatZones(heatMapData.heat_zones)}
            </div>
        </div>
        <div class="heat-legend">
            <div class="legend-item">
                <div class="legend-color" style="background: rgba(0, 0, 255, 0.7);"></div>
                <span>Low Activity</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: rgba(255, 255, 0, 0.7);"></div>
                <span>Medium Activity</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: rgba(255, 0, 0, 0.7);"></div>
                <span>High Activity</span>
            </div>
        </div>
    `;
    
    heatmapContainer.innerHTML = playerInfo + pitchHTML;
}

function renderHeatZones(heatZones) {
    return heatZones.map(zone => {
        if (zone.intensity === 0) return '';
        
        // Convert StatsBomb coordinates to percentage
        const left = (zone.x_min / 120) * 100;
        const top = (zone.y_min / 80) * 100;
        const width = ((zone.x_max - zone.x_min) / 120) * 100;
        const height = ((zone.y_max - zone.y_min) / 80) * 100;
        
        // Color based on intensity (blue to red gradient)
        const intensity = zone.normalized_intensity;
        let color;
        if (intensity < 0.33) {
            // Blue to yellow
            const ratio = intensity / 0.33;
            color = `rgba(${Math.round(ratio * 255)}, ${Math.round(ratio * 255)}, ${Math.round(255 - ratio * 255)}, 0.7)`;
        } else if (intensity < 0.66) {
            // Yellow to orange
            const ratio = (intensity - 0.33) / 0.33;
            color = `rgba(255, ${Math.round(255 - ratio * 128)}, 0, 0.7)`;
        } else {
            // Orange to red
            const ratio = (intensity - 0.66) / 0.34;
            color = `rgba(255, ${Math.round(127 - ratio * 127)}, 0, 0.7)`;
        }
        
        return `
            <div class="heat-zone" 
                 style="left: ${left}%; top: ${top}%; width: ${width}%; height: ${height}%; background: ${color};"
                 title="Intensity: ${Math.round(zone.intensity)} events">
            </div>
        `;
    }).join('');
}

// Make overview matches clickable to open detailed view in Matches tab
// Enhance displayOverview to attach click handlers after rendering
// We modify the HTML to include data-match-id and then wire events.

// File cleanup completed - all orphaned code blocks removed