// ROSTERS & PLAYER CARDS INTERACTIVE CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  const rosterGrid = document.getElementById('roster-grid');

  if (!rosterGrid) return;

  loadDynamicGameFilterTabs();

  async function loadDynamicGameFilterTabs() {
    const tabsContainer = document.querySelector('.game-filter-tabs');
    if (!tabsContainer) return;

    try {
      const res = await fetch('/api/games');
      const json = await res.json();
      if (json.success && json.games && json.games.length > 0) {
        tabsContainer.innerHTML = `
          <button class="filter-btn active" data-game="All">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:6px; vertical-align:-1px;"><circle cx="12" cy="12" r="10"/><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ALL GAMES
          </button>
          ${json.games.map(g => `
            <button class="filter-btn" data-game="${g.name}">
              <img src="${g.logoUrl}" style="width:16px; height:16px; object-fit:contain; margin-right:6px; vertical-align:-2px;" alt="${g.name}">
              ${g.name}
            </button>
          `).join('')}
        `;
        bindFilterEvents();
      }
    } catch (err) {
      bindFilterEvents();
    }
  }

  function bindFilterEvents() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const game = btn.getAttribute('data-game');
        fetchRosters(game);
      });
    });
  }

  // Fetch Rosters from API
  async function fetchRosters(game = 'All') {
    try {
      const res = await fetch(`/api/rosters?game=${encodeURIComponent(game)}`);
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        renderRosters(json.data);
        return;
      }
    } catch (err) {
      console.error('Failed to load rosters API:', err);
    }

    // Fallback if API is offline
    const filtered = (game && game !== 'All') 
      ? defaultFallbackRosters.filter(p => p.game.toLowerCase() === game.toLowerCase())
      : defaultFallbackRosters;
    renderRosters(filtered);
  }

  function renderRosters(players) {
    if (!players || players.length === 0) {
      rosterGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
          No athletes found for this game category.
        </div>
      `;
      return;
    }
    rosterGrid.innerHTML = players.map(player => `
      <div class="player-card fade-in" onclick="openPlayerModal('${player.id}')">
        <div class="player-image-wrap">
          <img src="${player.image}" alt="${player.handle}">
          <span class="player-game-tag">${player.game}</span>
          <span class="player-flag" title="${player.country}">${player.flag}</span>
        </div>
        <div class="player-details">
          <div class="player-handle">${player.handle}</div>
          <div class="player-real-name">${player.name}</div>
          <span class="player-role">${player.role}</span>
          
          <div class="player-stats-row">
            <div class="stat-item">
              <div class="stat-label">KDA / Stat</div>
              <div class="stat-value">${player.kda}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Win Rate</div>
              <div class="stat-value" style="color: var(--green-accent);">${player.winRate}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Initial Load
  fetchRosters('All');
});

const defaultFallbackRosters = [
  {
    id: 'p1',
    name: 'Karl Santos',
    handle: 'KARL',
    game: 'MLBB',
    role: 'Jungler / Assassin',
    kda: '4.95',
    winRate: '86%',
    country: 'Philippines',
    flag: '🇵🇭',
    image: '/assets/images/player_phantom.png',
    signatureAgent: 'Ling / Fanny / Hayabusa',
    gear: 'ROG Phone 8 Pro, RedMagic Cyber Controller'
  },
  {
    id: 'p2',
    name: 'Ethan Vance',
    handle: 'STRIKER',
    game: 'CODM',
    role: 'Slayer / Sniper',
    kda: '3.42',
    winRate: '82%',
    country: 'USA',
    flag: '🇺🇸',
    image: '/assets/images/player_vortex.png',
    signatureAgent: 'DL Q33 / Locus / Switchblade',
    gear: 'iPad Pro 12.9, Razer Gaming Sleeves'
  },
  {
    id: 'p3',
    name: 'Chen Wei',
    handle: 'TIGER',
    game: 'HOK',
    role: 'Clash Lane / Captain',
    kda: '5.10',
    winRate: '88%',
    country: 'China',
    flag: '🇨🇳',
    image: '/assets/images/player_cypher.png',
    signatureAgent: 'Mayene / Guan Yu / Allain',
    gear: 'IQOO 12 Pro, Corsair Gaming Trigger'
  },
  {
    id: 'p4',
    name: 'Lucas Vance',
    handle: 'PHANTOM',
    game: 'VALORANT',
    role: 'Duelist / Entry',
    kda: '1.48',
    winRate: '78%',
    country: 'USA',
    flag: '🇺🇸',
    image: '/assets/images/player_apex.png',
    signatureAgent: 'Jett / Yoru / Iso',
    gear: 'Logitech G Pro X Superlight 2, Huntsman V3 Pro'
  },
  {
    id: 'p5',
    name: 'Jin-Woo Park',
    handle: 'SOLAR',
    game: 'LEAGUE OF LEGENDS',
    role: 'Mid Lane',
    kda: '4.80',
    winRate: '80%',
    country: 'South Korea',
    flag: '🇰🇷',
    image: '/assets/images/player_solar.png',
    signatureAgent: 'Azir / Ahri / LeBlanc',
    gear: 'Corsair Sabre RGB, K70 RGB PRO'
  },
  {
    id: 'p6',
    name: 'Arslan Malik',
    handle: 'KSTRIKE',
    game: 'TEKKEN 8',
    role: 'FGC Specialist',
    kda: '92% Set Win',
    winRate: '92%',
    country: 'Pakistan',
    flag: '🇵🇰',
    image: '/assets/images/player_ronin.png',
    signatureAgent: 'Kazuya / Jin / Mishima',
    gear: 'Qanba Obsidian 2 Arcade Stick, Hitbox Leverless'
  }
];

// Player Detail Modal Popup
async function openPlayerModal(playerId) {
  try {
    const res = await fetch('/api/rosters');
    const json = await res.json();
    const player = json.data.find(p => p.id === playerId);
    if (!player) return;

    let modal = document.getElementById('player-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'player-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content fade-in">
        <button class="close-modal-btn" onclick="closePlayerModal()">✕</button>
        <div style="display: grid; grid-template-columns: 260px 1fr; gap: 32px; align-items: start;">
          <img src="${player.image}" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-gray);" alt="${player.handle}">
          <div>
            <span style="color: var(--yellow-primary); font-family: var(--font-mono); text-transform: uppercase;">${player.game} • ${player.flag} ${player.country}</span>
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; text-transform: uppercase; margin: 6px 0;">${player.handle}</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px;">${player.name} — <strong style="color: var(--text-light);">${player.role}</strong></p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; background: var(--bg-dark); padding: 16px; border-radius: 8px; border: 1px solid var(--border-gray);">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Performance Stat</div>
                <div style="font-family: var(--font-mono); font-size: 1.4rem; color: var(--yellow-primary); font-weight: 800;">${player.kda}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Competitive Win Rate</div>
                <div style="font-family: var(--font-mono); font-size: 1.4rem; color: var(--green-accent); font-weight: 800;">${player.winRate}</div>
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <h4 style="font-family: var(--font-heading); color: var(--yellow-primary); text-transform: uppercase;">Signature Agent / Mains</h4>
              <p style="color: var(--text-light); font-size: 0.95rem;">${player.signatureAgent}</p>
            </div>

            <div style="margin-bottom: 24px;">
              <h4 style="font-family: var(--font-heading); color: var(--yellow-primary); text-transform: uppercase;">Pro Hardware & Setup</h4>
              <p style="color: var(--text-muted); font-size: 0.9rem;">${player.gear}</p>
            </div>

            <button class="btn-yellow" onclick="showToast('Subscribed to ${player.handle}\\'s highlights!')">Follow Stream</button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  } catch (e) {
    console.error(e);
  }
}

function closePlayerModal() {
  const modal = document.getElementById('player-modal');
  if (modal) modal.classList.remove('active');
}
