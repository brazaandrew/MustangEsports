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
      if (json.success) {
        renderRosters(json.data);
      }
    } catch (err) {
      console.error('Failed to load rosters API:', err);
    }
  }

  function renderRosters(players) {
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

  // Handle Tab Clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedGame = btn.getAttribute('data-game');
      fetchRosters(selectedGame);
    });
  });

  // Initial Load
  fetchRosters('All');
});

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
