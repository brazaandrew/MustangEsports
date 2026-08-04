// MUSTANG ESPORTS — CHALLONGE-STYLE TOURNAMENT BRACKET & MATCHMAKER ENGINE

let allBracketsHistory = [];
let currentBracketData = null;

// Initial Default Tournament Brackets (Multi-Game & History)
const defaultBrackets = [
  {
    id: 'tourney_vct_2026',
    name: 'VCT Masters 2026 World Championship',
    game: 'VALORANT',
    format: '8-Team Single Elimination',
    seriesFormat: 'Hybrid (Bo3 Quarters/Semis, Bo5 Finals)',
    status: 'In Progress',
    rounds: [
      {
        name: 'Quarterfinals (Best of 3)',
        matches: [
          { id: 'qf1', nextMatchId: 'sf1', nextMatchSlot: 'team1', team1: { seed: 1, name: 'Mustang Esports', logo: '/assets/images/logo.png', score: 2 }, team2: { seed: 8, name: 'Team Liquid', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Liquid', score: 0 }, winner: 'Mustang Esports', status: 'COMPLETED' },
          { id: 'qf2', nextMatchId: 'sf1', nextMatchSlot: 'team2', team1: { seed: 4, name: 'Paper Rex', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=PRX', score: 1 }, team2: { seed: 5, name: 'Fnatic', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Fnatic', score: 2 }, winner: 'Fnatic', status: 'COMPLETED' },
          { id: 'qf3', nextMatchId: 'sf2', nextMatchSlot: 'team1', team1: { seed: 2, name: 'Sentinels', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Sentinels', score: 2 }, team2: { seed: 7, name: 'DRX', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DRX', score: 1 }, winner: 'Sentinels', status: 'COMPLETED' },
          { id: 'qf4', nextMatchId: 'sf2', nextMatchSlot: 'team2', team1: { seed: 3, name: 'G2 Esports', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=G2', score: 2 }, team2: { seed: 6, name: 'T1', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=T1', score: 0 }, winner: 'G2 Esports', status: 'COMPLETED' }
        ]
      },
      {
        name: 'Semifinals (Best of 3)',
        matches: [
          { id: 'sf1', nextMatchId: 'gf1', nextMatchSlot: 'team1', team1: { seed: 1, name: 'Mustang Esports', logo: '/assets/images/logo.png', score: 2 }, team2: { seed: 5, name: 'Fnatic', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Fnatic', score: 1 }, winner: 'Mustang Esports', status: 'COMPLETED' },
          { id: 'sf2', nextMatchId: 'gf1', nextMatchSlot: 'team2', team1: { seed: 2, name: 'Sentinels', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Sentinels', score: 1 }, team2: { seed: 3, name: 'G2 Esports', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=G2', score: 2 }, winner: 'G2 Esports', status: 'COMPLETED' }
        ]
      },
      {
        name: 'Grand Finals (Best of 5)',
        matches: [
          { id: 'gf1', nextMatchId: null, nextMatchSlot: null, team1: { seed: 1, name: 'Mustang Esports', logo: '/assets/images/logo.png', score: 3 }, team2: { seed: 3, name: 'G2 Esports', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=G2', score: 1 }, winner: 'Mustang Esports', status: 'COMPLETED' }
        ]
      }
    ],
    champion: { name: 'Mustang Esports', logo: '/assets/images/logo.png' }
  },
  {
    id: 'tourney_cs2_major',
    name: 'CS2 BLAST Premier Major 2026',
    game: 'CS2',
    format: '8-Team Single Elimination',
    seriesFormat: 'Best of 3 (Bo3 all rounds)',
    status: 'Upcoming',
    rounds: [
      {
        name: 'Quarterfinals (Best of 3)',
        matches: [
          { id: 'qf1', nextMatchId: 'sf1', nextMatchSlot: 'team1', team1: { seed: 1, name: 'Mustang CS', logo: '/assets/images/logo.png', score: 0 }, team2: { seed: 8, name: 'FaZe Clan', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FaZe', score: 0 }, winner: null, status: 'PENDING' },
          { id: 'qf2', nextMatchId: 'sf1', nextMatchSlot: 'team2', team1: { seed: 4, name: 'Natus Vincere', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=NaVi', score: 0 }, team2: { seed: 5, name: 'Vitality', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Vitality', score: 0 }, winner: null, status: 'PENDING' },
          { id: 'qf3', nextMatchId: 'sf2', nextMatchSlot: 'team1', team1: { seed: 2, name: 'MOUZ', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=MOUZ', score: 0 }, team2: { seed: 7, name: 'Astralis', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Astralis', score: 0 }, winner: null, status: 'PENDING' },
          { id: 'qf4', nextMatchId: 'sf2', nextMatchSlot: 'team2', team1: { seed: 3, name: 'Virtus.pro', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=VP', score: 0 }, team2: { seed: 6, name: 'Heroic', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Heroic', score: 0 }, winner: null, status: 'PENDING' }
        ]
      },
      {
        name: 'Semifinals (Best of 3)',
        matches: [
          { id: 'sf1', nextMatchId: 'gf1', nextMatchSlot: 'team1', team1: null, team2: null, winner: null, status: 'PENDING' },
          { id: 'sf2', nextMatchId: 'gf1', nextMatchSlot: 'team2', team1: null, team2: null, winner: null, status: 'PENDING' }
        ]
      },
      {
        name: 'Grand Finals (Best of 3)',
        matches: [
          { id: 'gf1', nextMatchId: null, nextMatchSlot: null, team1: null, team2: null, winner: null, status: 'PENDING' }
        ]
      }
    ],
    champion: null
  }
];

document.addEventListener('DOMContentLoaded', () => {
  loadTournamentBracket();
});

async function loadTournamentBracket() {
  try {
    const res = await fetch('/api/brackets');
    const json = await res.json();
    if (json.success && json.brackets && json.brackets.length > 0) {
      allBracketsHistory = json.brackets;
      const activeId = json.activeId || allBracketsHistory[0].id;
      currentBracketData = allBracketsHistory.find(b => b.id === activeId) || allBracketsHistory[0];
    } else {
      allBracketsHistory = defaultBrackets;
      currentBracketData = defaultBrackets[0];
      for (let b of defaultBrackets) {
        await fetch('/api/brackets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(b)
        });
      }
    }
  } catch (err) {
    allBracketsHistory = defaultBrackets;
    currentBracketData = defaultBrackets[0];
  }
  renderBracketSelectorUI();
  renderBracketTree(currentBracketData);
}

function renderBracketSelectorUI() {
  const containers = document.querySelectorAll('.bracket-history-bar');
  const isAdminPage = window.location.pathname.includes('admin.html');

  containers.forEach(bar => {
    bar.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; background:var(--bg-surface-solid); padding:14px 20px; border:1px solid var(--border-subtle); border-radius:var(--radius-md); margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:280px;">
          <label style="font-family:var(--font-heading); font-size:0.85rem; color:var(--yellow-primary); text-transform:uppercase; white-space:nowrap; margin:0;">Saved Tournament History:</label>
          <select id="bracket-history-select" class="form-control" style="flex:1; padding:8px 12px; font-size:0.85rem;" onchange="switchBracketFromHistory(this.value)">
            ${allBracketsHistory.map(b => `
              <option value="${b.id}" ${currentBracketData && b.id === currentBracketData.id ? 'selected' : ''}>
                ${b.name} (${b.game}) — ${b.seriesFormat || b.format || 'Bo3'}
              </option>
            `).join('')}
          </select>
        </div>

        ${isAdminPage ? `
          <button class="btn-outline" style="padding:8px 14px; font-size:0.78rem; border-color:var(--red-accent); color:var(--red-accent);" onclick="deleteActiveBracketHistory()">
            Delete Selected Bracket
          </button>
        ` : ''}
      </div>
    `;
  });
}

async function switchBracketFromHistory(id) {
  const target = allBracketsHistory.find(b => b.id === id);
  if (target) {
    currentBracketData = target;
    renderBracketTree(currentBracketData);
    renderBracketSelectorUI();
    if (window.showToast) showToast(`Loaded Tournament: ${target.name}`);

    try {
      await fetch('/api/brackets/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {}
  }
}

async function deleteActiveBracketHistory() {
  if (!currentBracketData) return;
  if (!confirm(`Are you sure you want to delete tournament bracket "${currentBracketData.name}"?`)) return;

  try {
    const res = await fetch(`/api/brackets/${currentBracketData.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      if (window.showToast) showToast('Bracket deleted from history');
      loadTournamentBracket();
    }
  } catch (err) {
    if (window.showToast) showToast('Deleted bracket');
  }
}

function renderBracketTree(bracket) {
  const container = document.getElementById('bracket-tree-render');
  if (!container) return;

  const isAdminPage = window.location.pathname.includes('admin.html');

  const headerTitle = document.getElementById('bracket-tournament-title');
  if (headerTitle) {
    headerTitle.innerHTML = `${bracket.name} <span style="font-size:0.75rem; background:rgba(255,215,0,0.15); color:var(--yellow-primary); padding:4px 10px; border-radius:12px; margin-left:12px; vertical-align:middle;">${bracket.game} • ${bracket.seriesFormat || bracket.format}</span>`;
  }

  let html = `<div class="bracket-tree-container">`;

  bracket.rounds.forEach((round, roundIdx) => {
    html += `
      <div class="bracket-round-column">
        <div class="bracket-round-header">${round.name}</div>
    `;

    round.matches.forEach((m, matchIdx) => {
      const isT1Winner = m.winner && m.team1 && m.winner === m.team1.name;
      const isT2Winner = m.winner && m.team2 && m.winner === m.team2.name;

      const clickAttr = isAdminPage ? `onclick="openMatchScoreModal('${roundIdx}', '${matchIdx}')"` : '';
      const staticClass = isAdminPage ? '' : 'static';

      html += `
        <div class="bracket-match-node ${staticClass}" ${clickAttr}>
          <div class="bracket-match-header">
            <span>MATCH #${m.id.toUpperCase()}</span>
            <span style="color:${m.status === 'COMPLETED' ? '#00FF66' : 'var(--yellow-primary)'}; font-weight:700;">
              ${m.status || 'PENDING'}
            </span>
          </div>

          <div class="bracket-team-slot ${isT1Winner ? 'winner' : ''}">
            <div class="bracket-team-info">
              <span class="bracket-seed">${m.team1 ? m.team1.seed || '-' : '-'}</span>
              <img src="${m.team1 ? m.team1.logo : 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD'}" class="bracket-team-logo" alt="logo">
              <span class="bracket-team-name">${m.team1 ? m.team1.name : 'TBD'}</span>
            </div>
            <span class="bracket-score ${isT1Winner ? 'winner-score' : ''}">${m.team1 && m.team1.score !== undefined ? m.team1.score : '-'}</span>
          </div>

          <div class="bracket-team-slot ${isT2Winner ? 'winner' : ''}">
            <div class="bracket-team-info">
              <span class="bracket-seed">${m.team2 ? m.team2.seed || '-' : '-'}</span>
              <img src="${m.team2 ? m.team2.logo : 'https://api.dicebear.com/7.x/identicon/svg?seed=TBD'}" class="bracket-team-logo" alt="logo">
              <span class="bracket-team-name">${m.team2 ? m.team2.name : 'TBD'}</span>
            </div>
            <span class="bracket-score ${isT2Winner ? 'winner-score' : ''}">${m.team2 && m.team2.score !== undefined ? m.team2.score : '-'}</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  });

  // Champion Box Column
  if (bracket.champion && bracket.champion.name) {
    html += `
      <div class="bracket-round-column" style="justify-content: center;">
        <div class="bracket-round-header">TOURNAMENT CHAMPION</div>
        <div class="champion-card">
          <div class="champion-title">GRAND CHAMPION</div>
          <img src="${bracket.champion.logo}" style="width:50px; height:50px; object-fit:contain; margin:8px auto;" alt="Champion Logo">
          <div class="champion-team">${bracket.champion.name}</div>
        </div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// Modal for editing scores and setting winners
function openMatchScoreModal(roundIdx, matchIdx) {
  const isAdmin = !!localStorage.getItem('mustang_admin_token') || window.location.pathname.includes('admin.html');
  if (!isAdmin) {
    if (window.showToast) showToast('Match editing is restricted to the Admin Portal.', 'error');
    return;
  }

  if (!currentBracketData) return;
  const match = currentBracketData.rounds[roundIdx].matches[matchIdx];
  if (!match || !match.team1 || !match.team2) {
    if (window.showToast) showToast('Cannot update score until both teams are determined.', 'error');
    return;
  }

  const modalHtml = `
    <div id="bracket-score-modal" class="modal-overlay active" style="z-index:9000; background:rgba(0,0,0,0.85);">
      <div class="modal-content fade-in" style="max-width:440px; border-top:4px solid var(--yellow-primary);">
        <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--text-primary); text-transform:uppercase; margin-bottom:6px;">UPDATE MATCH SCORE</h3>
        <p style="color:var(--text-muted); font-size:0.82rem; margin-bottom:20px;">Round: ${currentBracketData.rounds[roundIdx].name} • Match ${match.id.toUpperCase()}</p>
        
        <form onsubmit="saveMatchScore(event, ${roundIdx}, ${matchIdx})">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
            <!-- Team 1 -->
            <div style="background:var(--bg-dark); padding:16px; border-radius:8px; text-align:center; border:1px solid var(--border-subtle);">
              <img src="${match.team1.logo}" style="width:36px; height:36px; object-fit:contain; margin-bottom:8px;" alt="t1">
              <h4 style="font-size:0.9rem; margin-bottom:8px; color:var(--text-primary);">${match.team1.name}</h4>
              <label class="form-label">Score</label>
              <input type="number" id="modal-score-t1" class="form-control" value="${match.team1.score || 0}" min="0" style="text-align:center;">
            </div>

            <!-- Team 2 -->
            <div style="background:var(--bg-dark); padding:16px; border-radius:8px; text-align:center; border:1px solid var(--border-subtle);">
              <img src="${match.team2.logo}" style="width:36px; height:36px; object-fit:contain; margin-bottom:8px;" alt="t2">
              <h4 style="font-size:0.9rem; margin-bottom:8px; color:var(--text-primary);">${match.team2.name}</h4>
              <label class="form-label">Score</label>
              <input type="number" id="modal-score-t2" class="form-control" value="${match.team2.score || 0}" min="0" style="text-align:center;">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Select Winner & Advance</label>
            <select id="modal-winner-select" class="form-control">
              <option value="${match.team1.name}" ${match.winner === match.team1.name ? 'selected' : ''}>${match.team1.name}</option>
              <option value="${match.team2.name}" ${match.winner === match.team2.name ? 'selected' : ''}>${match.team2.name}</option>
            </select>
          </div>

          <div style="display:flex; gap:12px; margin-top:20px;">
            <button type="button" class="btn-outline" style="flex:1;" onclick="closeBracketModal()">Cancel</button>
            <button type="submit" class="btn-yellow" style="flex:1;">Save & Advance</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const existing = document.getElementById('bracket-score-modal');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeBracketModal() {
  const modal = document.getElementById('bracket-score-modal');
  if (modal) modal.remove();
}

async function saveMatchScore(e, roundIdx, matchIdx) {
  e.preventDefault();
  const t1Score = parseInt(document.getElementById('modal-score-t1').value, 10) || 0;
  const t2Score = parseInt(document.getElementById('modal-score-t2').value, 10) || 0;
  const winnerName = document.getElementById('modal-winner-select').value;

  const match = currentBracketData.rounds[roundIdx].matches[matchIdx];
  match.team1.score = t1Score;
  match.team2.score = t2Score;
  match.winner = winnerName;
  match.status = 'COMPLETED';

  const winningTeamObj = (winnerName === match.team1.name) ? match.team1 : match.team2;

  // Advance winner to next match if applicable
  if (match.nextMatchId) {
    for (let r of currentBracketData.rounds) {
      for (let m of r.matches) {
        if (m.id === match.nextMatchId) {
          if (match.nextMatchSlot === 'team1') {
            m.team1 = { ...winningTeamObj, score: 0 };
          } else if (match.nextMatchSlot === 'team2') {
            m.team2 = { ...winningTeamObj, score: 0 };
          }
        }
      }
    }
  } else {
    // Grand Finals Winner becomes Tournament Champion!
    currentBracketData.champion = {
      name: winningTeamObj.name,
      logo: winningTeamObj.logo
    };
  }

  closeBracketModal();
  renderBracketTree(currentBracketData);
  if (window.showToast) showToast(`Winner recorded: ${winnerName}!`);

  // Save to backend history
  try {
    const res = await fetch('/api/brackets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentBracketData)
    });
    const json = await res.json();
    if (json.success && json.brackets) {
      allBracketsHistory = json.brackets;
      renderBracketSelectorUI();
    }
  } catch (err) {}
}

// Generate New Custom 8-Team Bracket
async function createNewTournamentBracket(e) {
  e.preventDefault();
  const nameInput = document.getElementById('b-name') || document.getElementById('admin-b-name');
  const gameInput = document.getElementById('b-game') || document.getElementById('admin-b-game');
  const seriesInput = document.getElementById('b-series') || document.getElementById('admin-b-series');
  const teamsInput = document.getElementById('b-teams') || document.getElementById('admin-b-teams');

  const name = (nameInput && nameInput.value) ? nameInput.value : 'Custom Community Tournament';
  const game = (gameInput && gameInput.value) ? gameInput.value : 'VALORANT';
  const seriesFormat = (seriesInput && seriesInput.value) ? seriesInput.value : 'Hybrid (Bo3 Quarters/Semis, Bo5 Finals)';
  const rawText = (teamsInput && teamsInput.value) ? teamsInput.value : '';
  const rawTeams = rawText.split('\n').map(t => t.trim()).filter(t => t.length > 0);

  if (rawTeams.length < 8) {
    if (window.showToast) showToast('Please enter at least 8 team names (one per line).', 'error');
    return;
  }

  const teams = rawTeams.slice(0, 8);

  // Set Round Names based on Series Format Choice (Bo1, Bo3, Bo5, Hybrid)
  let qfName = 'Quarterfinals (Best of 3)';
  let sfName = 'Semifinals (Best of 3)';
  let gfName = 'Grand Finals (Best of 5)';

  if (seriesFormat.includes('Best of 1')) {
    qfName = 'Quarterfinals (Best of 1)';
    sfName = 'Semifinals (Best of 1)';
    gfName = 'Grand Finals (Best of 1)';
  } else if (seriesFormat.includes('Best of 5')) {
    qfName = 'Quarterfinals (Best of 5)';
    sfName = 'Semifinals (Best of 5)';
    gfName = 'Grand Finals (Best of 5)';
  } else if (seriesFormat.includes('Best of 3')) {
    qfName = 'Quarterfinals (Best of 3)';
    sfName = 'Semifinals (Best of 3)';
    gfName = 'Grand Finals (Best of 3)';
  }

  const tourneyTypeInput = document.getElementById('admin-b-tournament-type');
  const tourneyType = tourneyTypeInput ? tourneyTypeInput.value : 'Single Elimination';

  const newBracket = {
    id: 'tourney_' + Date.now(),
    name: name,
    game: game,
    format: `8-Team ${tourneyType}`,
    seriesFormat: seriesFormat,
    status: 'In Progress',
    rounds: [
      {
        name: qfName,
        matches: [
          { id: 'qf1', nextMatchId: 'sf1', nextMatchSlot: 'team1', team1: { seed: 1, name: teams[0], logo: '/assets/images/logo.png', score: 0 }, team2: { seed: 8, name: teams[7], logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(teams[7]), score: 0 }, winner: null, status: 'PENDING' },
          { id: 'qf2', nextMatchId: 'sf1', nextMatchSlot: 'team2', team1: { seed: 4, name: teams[3], logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(teams[3]), score: 0 }, team2: { seed: 5, name: teams[4], logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(teams[4]), score: 0 }, winner: null, status: 'PENDING' },
          { id: 'qf3', nextMatchId: 'sf2', nextMatchSlot: 'team1', team1: { seed: 2, name: teams[1], logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(teams[1]), score: 0 }, team2: { seed: 7, name: teams[6], logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(teams[6]), score: 0 }, winner: null, status: 'PENDING' },
          { id: 'qf4', nextMatchId: 'sf2', nextMatchSlot: 'team2', team1: { seed: 3, name: teams[2], logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(teams[2]), score: 0 }, team2: { seed: 6, name: teams[5], logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + encodeURIComponent(teams[5]), score: 0 }, winner: null, status: 'PENDING' }
        ]
      },
      {
        name: sfName,
        matches: [
          { id: 'sf1', nextMatchId: 'gf1', nextMatchSlot: 'team1', team1: null, team2: null, winner: null, status: 'PENDING' },
          { id: 'sf2', nextMatchId: 'gf1', nextMatchSlot: 'team2', team1: null, team2: null, winner: null, status: 'PENDING' }
        ]
      },
      {
        name: gfName,
        matches: [
          { id: 'gf1', nextMatchId: null, nextMatchSlot: null, team1: null, team2: null, winner: null, status: 'PENDING' }
        ]
      }
    ],
    champion: null
  };

  currentBracketData = newBracket;
  renderBracketTree(currentBracketData);
  if (window.showToast) showToast(`Created ${tourneyType} Tournament Bracket!`);

  // Save to backend history
  try {
    const res = await fetch('/api/brackets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentBracketData)
    });
    const json = await res.json();
    if (json.success && json.brackets) {
      allBracketsHistory = json.brackets;
      renderBracketSelectorUI();
    }
  } catch (err) {}
}

// Select Tournament Format Card UI Handler
function selectTournamentFormatCard(formatName, el) {
  document.querySelectorAll('.format-card').forEach(card => card.classList.remove('active'));
  if (el) el.classList.add('active');
  const typeInput = document.getElementById('admin-b-tournament-type');
  if (typeInput) typeInput.value = formatName;
  if (window.showToast) showToast(`Selected Format: ${formatName}`);
}

// Shuffle Teams Function (Randomize Seeds)
function shuffleTeamsInput(targetId = 'admin-b-teams') {
  const el = document.getElementById(targetId) || document.getElementById('b-teams') || document.getElementById('admin-b-teams');
  if (!el) return;

  let lines = el.value.split('\n').map(t => t.trim()).filter(t => t.length > 0);
  if (lines.length === 0) {
    lines = ['Mustang Esports', 'Sentinels', 'Fnatic', 'Paper Rex', 'G2 Esports', 'DRX', 'T1', 'Team Liquid'];
  }

  // Fisher-Yates Shuffle
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }

  el.value = lines.join('\n');
  if (window.showToast) showToast('🔀 Teams shuffled randomly!');
}

