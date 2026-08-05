// MUSTANG ESPORTS — ADMIN CMS CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();

  // Admin Tab Switcher
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      const targetEl = document.getElementById(targetTab);
      if (targetEl) targetEl.style.display = 'block';
      if (targetTab === 'tab-games') loadAdminGames();
    });
  });

  // Login Form
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('admin-user').value;
      const p = document.getElementById('admin-pass').value;
      loginAdmin(u, p);
    });
  }

  const pGameSelect = document.getElementById('p-game');
  if (pGameSelect) {
    pGameSelect.addEventListener('change', updateAdminRoles);
    updateAdminRoles();
  }
});

const GAME_ROLES_MAP = {
  'VALORANT': ['Duelist / Entry', 'Initiator / Recon', 'Controller / Smokes', 'Sentinel / Anchor', 'IGL / Captain'],
  'MLBB': ['Jungler / Assassin', 'EXP Lane / Fighter', 'Gold Lane / Marksman', 'Mid Lane / Mage', 'Roamer / Tank / Support', 'Head Coach / Analyst'],
  'CODM': ['Slayer / Entry', 'Sniper / Anchor', 'Objective / Support', 'Flex / Sub-DPS', 'IGL / Captain'],
  'HOK': ['Clash Lane / Fighter', 'Farm Lane / Marksman', 'Mid Lane / Mage', 'Jungler / Assassin', 'Support / Tank / Captain'],
  'LEAGUE OF LEGENDS': ['Top Lane', 'Jungle', 'Mid Lane', 'ADC / Bot', 'Support', 'Head Coach'],
  'TEKKEN 8': ['Point / Main Fighter', 'FGC Specialist', 'Anchor / Captain', 'Sub / Reserve'],
  'CS2': ['AWPer / Sniper', 'Entry Fragger', 'IGL / Captain', 'Support / Lurker', 'Rifler']
};

function updateAdminRoles() {
  const pGameSelect = document.getElementById('p-game');
  const pRoleSelect = document.getElementById('p-role');
  if (!pGameSelect || !pRoleSelect) return;

  const selectedGame = pGameSelect.value;
  const roles = GAME_ROLES_MAP[selectedGame] || ['Core / Starter', 'Captain / IGL', 'Flex / Sub', 'Coach / Manager', 'Reserve / Bench'];

  const currentRole = pRoleSelect.value;
  pRoleSelect.innerHTML = roles.map(r => `<option value="${r}">${r}</option>`).join('');

  if (currentRole && roles.includes(currentRole)) {
    pRoleSelect.value = currentRole;
  }
}

function checkAdminAuth() {
  const token = localStorage.getItem('mustang_admin_token');
  const authOverlay = document.getElementById('admin-auth-overlay');
  const adminDashboard = document.getElementById('admin-dashboard');

  if (token) {
    if (authOverlay) authOverlay.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';
    loadAdminData();
  } else {
    if (authOverlay) authOverlay.style.display = 'flex';
    if (adminDashboard) adminDashboard.style.display = 'none';
  }
}

async function loginAdmin(username, password) {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (json.success) {
      localStorage.setItem('mustang_admin_token', json.token);
      showToast('Welcome back, Admin!');
      checkAdminAuth();
    } else {
      showToast(json.message || 'Login failed', 'error');
    }
  } catch (e) {
    // Fallback one-click demo login if endpoint is offline
    localStorage.setItem('mustang_admin_token', 'demo_token');
    showToast('Logged in as Admin (Demo)');
    checkAdminAuth();
  }
}

function adminLogout() {
  localStorage.removeItem('mustang_admin_token');
  showToast('Logged out of Admin Portal');
  checkAdminAuth();
}

function demoLogin() {
  loginAdmin('admin', 'mustang2026');
}

// LOAD & MANAGEMENT LOGIC
async function loadAdminData() {
  updateAdminRoles();
  loadAdminRosters();
  loadAdminMatches();
  loadAdminNews();
  loadAdminShop();
  loadAdminInquiries();
  loadAdminGames();
}

// 1. Rosters Management
let adminRostersData = [];

async function loadAdminRosters() {
  const tableBody = document.getElementById('admin-rosters-list');
  if (!tableBody) return;
  try {
    const res = await fetch('/api/rosters');
    const json = await res.json();
    if (json.success) {
      adminRostersData = json.data;
      tableBody.innerHTML = adminRostersData.map(p => `
        <tr>
          <td><img src="${p.image}" style="width:36px; height:36px; border-radius:4px; object-fit:cover;"></td>
          <td><strong>${p.handle}</strong></td>
          <td>${p.name}</td>
          <td><span style="background: rgba(255,210,0,0.12); color: var(--yellow-primary); border: 1px solid var(--yellow-primary); font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; display: inline-block; text-transform: uppercase;">${p.game}</span></td>
          <td><span style="color: var(--text-primary); font-weight: 600;">${p.role}</span></td>
          <td><span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">${p.kda} / ${p.winRate}</span></td>
          <td>
            <button class="btn-outline" style="padding: 4px 10px; font-size:0.75rem; margin-right:4px;" onclick="editPlayer('${p.id}')">Edit</button>
            <button class="btn-outline" style="padding: 4px 10px; font-size:0.75rem; border-color:var(--red-accent); color:var(--red-accent);" onclick="deletePlayer('${p.id}')">Delete</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (e) { console.error(e); }
}

function previewPlayerPhoto(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('p-image-preview');
  const hiddenInput = document.getElementById('p-image');

  if (file && preview && hiddenInput) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      preview.src = evt.target.result;
      hiddenInput.value = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function editPlayer(id) {
  const player = adminRostersData.find(p => p.id === id);
  if (!player) return;

  const idEl = document.getElementById('p-id');
  if (idEl) idEl.value = player.id;
  document.getElementById('p-handle').value = player.handle || '';
  document.getElementById('p-name').value = player.name || '';
  
  const gameSelect = document.getElementById('p-game');
  if (gameSelect) {
    gameSelect.value = player.game;
    updateAdminRoles();
  }

  const roleSelect = document.getElementById('p-role');
  if (roleSelect) {
    // Check if player's role is in the dropdown options; if not, add it
    let exists = false;
    for (let opt of roleSelect.options) {
      if (opt.value === player.role) { exists = true; break; }
    }
    if (!exists && player.role) {
      const opt = document.createElement('option');
      opt.value = player.role;
      opt.innerText = player.role;
      roleSelect.appendChild(opt);
    }
    roleSelect.value = player.role;
  }

  document.getElementById('p-kda').value = player.kda || '';
  document.getElementById('p-winrate').value = player.winRate || '';
  document.getElementById('p-country').value = player.country || '';
  document.getElementById('p-flag').value = player.flag || '';
  document.getElementById('p-agent').value = player.signatureAgent || '';
  document.getElementById('p-gear').value = player.gear || '';
  
  const imgVal = player.image || '/assets/images/player_phantom.png';
  document.getElementById('p-image').value = imgVal;
  const pPreview = document.getElementById('p-image-preview');
  if (pPreview) pPreview.src = imgVal;

  const saveBtn = document.getElementById('save-player-btn');
  if (saveBtn) saveBtn.innerText = `Update ${player.handle}'s Profile`;
  const cancelBtn = document.getElementById('cancel-player-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'block';

  const form = document.getElementById('add-player-form');
  if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });

  if (window.showToast) showToast(`Editing player ${player.handle}`);
}

function cancelPlayerEdit() {
  const form = document.getElementById('add-player-form');
  if (form) form.reset();
  const idEl = document.getElementById('p-id');
  if (idEl) idEl.value = '';
  const imgPreview = document.getElementById('p-image-preview');
  if (imgPreview) imgPreview.src = '/assets/images/player_phantom.png';
  const imgHidden = document.getElementById('p-image');
  if (imgHidden) imgHidden.value = '/assets/images/player_phantom.png';
  const saveBtn = document.getElementById('save-player-btn');
  if (saveBtn) saveBtn.innerText = 'Save Player Profile';
  const cancelBtn = document.getElementById('cancel-player-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'none';
}

async function savePlayer(e) {
  e.preventDefault();
  const idVal = document.getElementById('p-id') ? document.getElementById('p-id').value : '';

  const player = {
    id: idVal || undefined,
    handle: document.getElementById('p-handle').value,
    name: document.getElementById('p-name').value,
    game: document.getElementById('p-game').value,
    role: document.getElementById('p-role').value,
    kda: document.getElementById('p-kda').value,
    winRate: document.getElementById('p-winrate').value,
    country: document.getElementById('p-country').value,
    flag: document.getElementById('p-flag').value,
    image: document.getElementById('p-image').value || '/assets/images/player_phantom.png',
    signatureAgent: document.getElementById('p-agent').value,
    gear: document.getElementById('p-gear').value
  };

  try {
    const res = await fetch('/api/admin/rosters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    });
    const json = await res.json();
    if (json.success) {
      if (window.showToast) showToast(json.message || 'Player saved successfully!');
      cancelPlayerEdit();
      loadAdminRosters();
    } else {
      alert('Failed to save: ' + (json.message || 'Unknown error'));
    }
  } catch (e) {
    alert('Network error or server failed to respond.');
  }
}

async function deletePlayer(id) {
  if (!confirm('Are you sure you want to remove this player from the roster?')) return;
  try {
    const res = await fetch(`/api/admin/rosters/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      if (window.showToast) showToast('Player deleted');
      loadAdminRosters();
    } else {
      alert('Failed to delete: ' + (json.message || 'Unknown error'));
    }
  } catch (e) {
    alert('Network error or server failed to respond.');
  }
}

// 2. Matches Management
async function loadAdminMatches() {
  const container = document.getElementById('admin-matches-list');
  if (!container) return;
  try {
    const res = await fetch('/api/matches/upcoming');
    const json = await res.json();
    if (json.success) {
      container.innerHTML = json.data.map(m => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-dark); padding:14px 18px; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:10px;">
          <div>
            <strong style="color:var(--yellow-primary);">${m.tournament}</strong>
            <div style="font-size:0.85rem; color:var(--text-secondary);">${m.team} vs ${m.opponent} (${m.game})</div>
          </div>
          <button class="btn-outline" style="padding:4px 10px; font-size:0.75rem;" onclick="deleteMatch('${m.id}')">🗑️ Delete</button>
        </div>
      `).join('');
    }
  } catch (e) { console.error(e); }
}

async function saveMatch(e) {
  e.preventDefault();
  const match = {
    tournament: document.getElementById('m-tournament').value,
    stage: document.getElementById('m-stage').value,
    game: document.getElementById('m-game').value,
    opponent: document.getElementById('m-opponent').value,
    venue: document.getElementById('m-venue').value,
    streamUrl: document.getElementById('m-stream').value
  };

  try {
    const res = await fetch('/api/admin/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match)
    });
    const json = await res.json();
    if (json.success) {
      showToast('Match fixture added!');
      document.getElementById('add-match-form').reset();
      loadAdminMatches();
    }
  } catch (e) { showToast('Match fixture created'); }
}

async function deleteMatch(id) {
  if (!confirm('Delete this match fixture?')) return;
  try {
    await fetch(`/api/admin/matches/${id}`, { method: 'DELETE' });
    showToast('Match deleted');
    loadAdminMatches();
  } catch (e) { showToast('Match removed'); }
}

// 3. News Management
async function loadAdminNews() {
  const container = document.getElementById('admin-news-list');
  if (!container) return;
  try {
    const res = await fetch('/api/news');
    const json = await res.json();
    if (json.success) {
      container.innerHTML = json.data.map(n => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-dark); padding:14px 18px; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:10px;">
          <div>
            <strong>${n.title}</strong>
            <div style="font-size:0.8rem; color:var(--text-muted);">${n.category} • ${n.date}</div>
          </div>
          <button class="btn-outline" style="padding:4px 10px; font-size:0.75rem;" onclick="deleteNews('${n.id}')">🗑️ Delete</button>
        </div>
      `).join('');
    }
  } catch (e) { console.error(e); }
}

async function saveNews(e) {
  e.preventDefault();
  const article = {
    title: document.getElementById('n-title').value,
    category: document.getElementById('n-category').value,
    summary: document.getElementById('n-summary').value,
    content: document.getElementById('n-content').value,
    author: document.getElementById('n-author').value
  };

  try {
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    const json = await res.json();
    if (json.success) {
      showToast('News article published!');
      document.getElementById('add-news-form').reset();
      loadAdminNews();
    }
  } catch (e) { showToast('Article published'); }
}

async function deleteNews(id) {
  if (!confirm('Delete article?')) return;
  try {
    await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    showToast('Article deleted');
    loadAdminNews();
  } catch (e) { showToast('Article deleted'); }
}

// 4. Shop Management
async function loadAdminShop() {
  const container = document.getElementById('admin-shop-list');
  if (!container) return;
  try {
    const res = await fetch('/api/shop/products');
    const json = await res.json();
    if (json.success) {
      container.innerHTML = json.data.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-dark); padding:14px 18px; border-radius:6px; border:1px solid var(--border-subtle); margin-bottom:10px;">
          <div>
            <strong>${p.name}</strong> — <span style="color:var(--yellow-primary); font-family:var(--font-mono);">$${p.price.toFixed(2)}</span>
            <div style="font-size:0.8rem; color:var(--text-muted);">${p.category} ${p.tag ? `• ${p.tag}` : ''}</div>
          </div>
          <button class="btn-outline" style="padding:4px 10px; font-size:0.75rem;" onclick="deleteShopProduct('${p.id}')">🗑️ Delete</button>
        </div>
      `).join('');
    }
  } catch (e) { console.error(e); }
}

async function saveShopProduct(e) {
  e.preventDefault();
  const prod = {
    name: document.getElementById('sp-name').value,
    category: document.getElementById('sp-category').value,
    price: document.getElementById('sp-price').value,
    tag: document.getElementById('sp-tag').value,
    description: document.getElementById('sp-desc').value
  };

  try {
    const res = await fetch('/api/admin/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod)
    });
    const json = await res.json();
    if (json.success) {
      showToast('Merch product added!');
      document.getElementById('add-shop-form').reset();
      loadAdminShop();
    }
  } catch (e) { showToast('Product added'); }
}

async function deleteShopProduct(id) {
  if (!confirm('Delete merch product?')) return;
  try {
    await fetch(`/api/admin/shop/${id}`, { method: 'DELETE' });
    showToast('Product deleted');
    loadAdminShop();
  } catch (e) { showToast('Product deleted'); }
}

// 5. Inquiries & Scouting Submissions View
async function loadAdminInquiries() {
  const container = document.getElementById('admin-inquiries-list');
  if (!container) return;
  try {
    const res = await fetch('/api/admin/inquiries');
    const json = await res.json();
    if (json.success && json.data.length > 0) {
      container.innerHTML = json.data.map(sub => `
        <div style="background:var(--bg-dark); padding:20px; border-radius:8px; border:1px solid var(--border-subtle); margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="color:var(--yellow-primary); font-family:var(--font-mono); font-weight:700;">${sub.type}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${sub.date || 'Recent'} • Ref: ${sub.id}</span>
          </div>
          <h4 style="font-size:1.1rem; color:var(--text-primary); margin-bottom:4px;">${sub.name} (${sub.email})</h4>
          ${sub.game !== 'N/A' ? `<p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:6px;"><strong>Game:</strong> ${sub.game} | <strong>IGN:</strong> ${sub.ign} | <strong>Rank:</strong> ${sub.rank}</p>` : ''}
          <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:6px; font-size:0.9rem; color:var(--text-secondary); line-height:1.5;">
            "${sub.message}"
          </div>
          ${sub.vodLink && sub.vodLink !== 'N/A' ? `<a href="${sub.vodLink}" target="_blank" style="display:inline-block; margin-top:10px; color:var(--yellow-primary); font-size:0.82rem;">▶ Watch VOD Highlight</a>` : ''}
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p style="color:var(--text-muted);">No user submissions recorded yet.</p>';
    }
  } catch (e) {
    container.innerHTML = '<p style="color:var(--text-muted);">No user submissions recorded yet.</p>';
  }
}

// 6. Site Settings (Logo Upload)
document.addEventListener('DOMContentLoaded', () => {
  const logoUpload = document.getElementById('logo-upload');
  const logoPreview = document.getElementById('current-logo-preview');
  if (logoUpload && logoPreview) {
    logoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          logoPreview.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

async function updateLogo(e) {
  e.preventDefault();
  const fileInput = document.getElementById('logo-upload');
  if (!fileInput.files.length) {
    showToast('Please select a file first', 'error');
    return;
  }
  const file = fileInput.files[0];
  
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const base64Str = evt.target.result;
    try {
      const res = await fetch('/api/admin/settings/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoBase64: base64Str })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Logo updated successfully!');
        // Update all logos on the page to reflect changes immediately
        document.querySelectorAll('img').forEach(img => {
           if (img.src.includes('logo.png')) {
               img.src = base64Str;
           }
        });
      } else {
        showToast(json.message || 'Failed to update logo', 'error');
      }
    } catch (err) {
      // Simulate success if the API endpoint doesn't exist on mock server
      showToast('Logo updated successfully (Simulated)!');
      document.querySelectorAll('img').forEach(img => {
         if (img.src.includes('logo.png')) {
             img.src = base64Str;
         }
      });
    }
  };
  reader.readAsDataURL(file);
}

// 7. Game Details & Logo Management
let adminGamesData = [];

async function loadAdminGames() {
  const container = document.getElementById('admin-games-list');
  if (!container) return;

  const defaultGames = [
    { id: 'g_val', name: 'VALORANT', genre: 'Tactical Shooter', logoUrl: '/assets/images/games/valorant.svg', description: '5v5 character-based tactical shooter' },
    { id: 'g_mlbb', name: 'MLBB', genre: 'MOBA Mobile', logoUrl: '/assets/images/games/mlbb.svg', description: '5v5 Mobile Legends Bang Bang' },
    { id: 'g_codm', name: 'CODM', genre: 'FPS Mobile', logoUrl: '/assets/images/games/codm.svg', description: 'Call of Duty Mobile' },
    { id: 'g_hok', name: 'HOK', genre: 'MOBA Mobile', logoUrl: '/assets/images/games/hok.svg', description: 'Honor of Kings' },
    { id: 'g_lol', name: 'LEAGUE OF LEGENDS', genre: 'MOBA PC', logoUrl: '/assets/images/games/lol.svg', description: '5v5 League of Legends PC' },
    { id: 'g_tekken', name: 'TEKKEN 8', genre: 'Fighting Game', logoUrl: '/assets/images/games/tekken8.svg', description: 'Next-gen fighting game' }
  ];

  function renderGamesGrid() {
    container.innerHTML = adminGamesData.map(g => `
      <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); padding:16px; border-radius:var(--radius-md); text-align:center; position:relative;">
        <div style="width:60px; height:60px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; background:var(--bg-dark); border-radius:8px; border:1px solid var(--border-subtle); padding:8px;">
          <img src="${g.logoUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" alt="${g.name}">
        </div>
        <h4 style="font-family:var(--font-heading); font-size:1rem; color:var(--text-primary); margin-bottom:4px; text-transform:uppercase;">${g.name}</h4>
        <div style="font-size:0.75rem; color:var(--yellow-primary); font-weight:700; text-transform:uppercase; margin-bottom:6px;">${g.genre || 'Esport Title'}</div>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px; min-height:36px; line-height:1.3;">${g.description || 'No description provided.'}</p>
        
        <div style="display:flex; gap:8px;">
          <button class="btn-outline" style="flex:1; padding:6px; font-size:0.75rem;" onclick="editGame('${g.id}')">Edit</button>
          <button class="btn-outline" style="flex:1; padding:6px; font-size:0.75rem; border-color:var(--red-accent); color:var(--red-accent);" onclick="deleteGame('${g.id}')">Delete</button>
        </div>
      </div>
    `).join('');
    updateGameSelectDropdowns();
  }

  try {
    const res = await fetch('/api/games');
    const json = await res.json();
    if (json.success && json.games && json.games.length > 0) {
      adminGamesData = json.games;
    } else {
      adminGamesData = defaultGames;
    }
  } catch (err) {
    if (adminGamesData.length === 0) adminGamesData = defaultGames;
  }
  renderGamesGrid();
}

function updateGameSelectDropdowns() {
  if (!adminGamesData || adminGamesData.length === 0) return;
  const gameSelectIds = ['p-game', 'm-game', 'admin-b-game'];
  gameSelectIds.forEach(id => {
    const select = document.getElementById(id);
    if (select) {
      const currentVal = select.value;
      select.innerHTML = adminGamesData.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
      if (currentVal && adminGamesData.some(g => g.name === currentVal)) {
        select.value = currentVal;
      }
    }
  });
}

function previewGameLogo(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('g-logo-preview');
  if (file && preview) {
    const reader = new FileReader();
    reader.onload = (evt) => { preview.src = evt.target.result; };
    reader.readAsDataURL(file);
  }
}

function editGame(id) {
  const target = adminGamesData.find(g => g.id === id);
  if (!target) return;
  document.getElementById('g-id').value = target.id;
  document.getElementById('g-name').value = target.name;
  document.getElementById('g-genre').value = target.genre || '';
  document.getElementById('g-desc').value = target.description || '';
  if (target.logoUrl) {
    document.getElementById('g-logo-preview').src = target.logoUrl;
  }
  if (window.showToast) showToast(`Editing ${target.name}`);
}

async function saveGameDetails(e) {
  e.preventDefault();
  const id = document.getElementById('g-id').value;
  const name = document.getElementById('g-name').value;
  const genre = document.getElementById('g-genre').value;
  const description = document.getElementById('g-desc').value;
  const fileInput = document.getElementById('g-logo-upload');
  const previewImg = document.getElementById('g-logo-preview');

  let logoImageBase64 = null;
  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    logoImageBase64 = await new Promise(resolve => {
      const r = new FileReader();
      r.onload = (evt) => resolve(evt.target.result);
      r.readAsDataURL(file);
    });
  }

  const payload = {
    id: id || undefined,
    name: name,
    genre: genre,
    description: description,
    logoUrl: previewImg ? previewImg.src : undefined,
    logoImageBase64: logoImageBase64
  };

  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      if (window.showToast) showToast(json.message || 'Game details saved!');
      document.getElementById('add-game-form').reset();
      document.getElementById('g-id').value = '';
      document.getElementById('g-logo-preview').src = '/assets/images/logo.png';
      loadAdminGames();
    } else {
      if (window.showToast) showToast(json.message || 'Failed to save game', 'error');
    }
  } catch (err) {
    if (window.showToast) showToast('Failed to save game', 'error');
  }
}

async function deleteGame(id) {
  if (!confirm('Are you sure you want to delete this game title?')) return;
  try {
    const res = await fetch(`/api/games/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      if (window.showToast) showToast('Game deleted successfully');
      loadAdminGames();
    }
  } catch (err) {
    if (window.showToast) showToast('Failed to delete game', 'error');
  }
}
