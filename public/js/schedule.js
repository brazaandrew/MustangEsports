// MATCHES & STREAM EMBED CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  const matchesList = document.getElementById('matches-list');
  const matchTabs = document.querySelectorAll('.match-tab-btn');

  if (!matchesList) return;

  async function loadMatches(type = 'upcoming') {
    try {
      const endpoint = type === 'past' ? '/api/matches/history' : '/api/matches/upcoming';
      const res = await fetch(endpoint);
      const json = await res.json();

      if (json.success) {
        if (type === 'past') {
          renderPastMatches(json.data);
        } else {
          renderUpcomingMatches(json.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  function renderUpcomingMatches(matches) {
    matchesList.innerHTML = matches.map(m => `
      <div class="match-card fade-in">
        <div class="match-info-column">
          <div class="tournament">${m.tournament}</div>
          <div class="stage">${m.stage} • ${m.game}</div>
          <div style="font-size: 0.8rem; color: var(--yellow-primary); margin-top: 4px;">📍 ${m.venue}</div>
        </div>
        
        <div class="match-teams-vs">
          <div class="team-box">
            <img src="${m.teamLogo}" style="width: 40px; height: 40px; object-fit: contain;" alt="${m.team}">
            <span>${m.team}</span>
          </div>
          <div class="vs-badge">VS</div>
          <div class="team-box">
            <span>${m.opponent}</span>
            <img src="${m.opponentLogo}" style="width: 40px; height: 40px; object-fit: contain;" alt="${m.opponent}">
          </div>
        </div>

        <div style="text-align: right;">
          <button class="btn-yellow" onclick="openStreamModal('${m.tournament}', '${m.embedId}')" style="padding: 10px 20px; font-size: 0.85rem;">
            🔴 Watch Live
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderPastMatches(matches) {
    matchesList.innerHTML = matches.map(m => `
      <div class="match-card fade-in" style="border-left-color: ${m.result === 'WIN' ? 'var(--green-accent)' : 'var(--red-accent)'}">
        <div class="match-info-column">
          <div class="tournament">${m.tournament}</div>
          <div class="stage">${m.stage} • ${m.game} • ${m.date}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">MVP: <strong style="color: var(--yellow-primary);">${m.mvp}</strong></div>
        </div>
        
        <div class="match-teams-vs">
          <div class="team-box">
            <span>${m.team}</span>
          </div>
          <div class="score-badge">${m.teamScore} - ${m.opponentScore}</div>
          <div class="team-box">
            <span>${m.opponent}</span>
          </div>
        </div>

        <div style="text-align: right;">
          <button class="btn-outline" onclick="openStreamModal('${m.tournament}', '${m.vodUrl.split('/').pop()}')" style="padding: 10px 20px; font-size: 0.85rem;">
            ▶ Watch VOD
          </button>
        </div>
      </div>
    `).join('');
  }

  matchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      matchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const tabType = tab.getAttribute('data-tab');
      const bracketsView = document.getElementById('brackets-view');
      
      if (tabType === 'brackets') {
        matchesList.style.display = 'none';
        if (bracketsView) bracketsView.style.display = 'block';
        if (window.loadTournamentBracket) loadTournamentBracket();
      } else {
        matchesList.style.display = 'block';
        if (bracketsView) bracketsView.style.display = 'none';
        loadMatches(tabType);
      }
    });
  });

  loadMatches('upcoming');
});

// Stream Modal Player Trigger
function openStreamModal(title, embedId) {
  let modal = document.getElementById('stream-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'stream-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content fade-in" style="max-width: 900px; padding: 24px;">
      <button class="close-modal-btn" onclick="closeStreamModal()">✕</button>
      <h3 style="font-family: var(--font-heading); color: var(--yellow-primary); text-transform: uppercase; margin-bottom: 16px;">🔴 LIVE STREAM BROADCAST — ${title}</h3>
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; border: 1px solid var(--border-gray);">
        <iframe src="https://www.youtube.com/embed/${embedId}?autoplay=1" style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeStreamModal() {
  const modal = document.getElementById('stream-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.innerHTML = '';
  }
}
