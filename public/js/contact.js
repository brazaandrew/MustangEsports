// CONTACT & SCOUTING FORM CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('mustang-contact-form');
  const typeSelectorBtns = document.querySelectorAll('.form-type-btn');
  const scoutingFields = document.getElementById('scouting-fields');
  const formTypeInput = document.getElementById('form-type');

  if (!contactForm) return;

  const gameSelect = document.getElementById('contact-game');
  const roleSelect = document.getElementById('contact-role');

  const gameRoles = {
    'MLBB': ['Jungler / Assassin', 'EXP Lane', 'Gold Lane / Marksman', 'Mid Lane / Mage', 'Roamer / Tank / Support'],
    'CODM': ['Slayer / Entry', 'Sniper / Anchor', 'Objective / SMG', 'Flex / Support', 'IGL (In-Game Leader)'],
    'HOK': ['Clash Lane', 'Farm Lane', 'Mid Lane', 'Jungle', 'Roamer'],
    'VALORANT': ['Duelist / Entry', 'Initiator / IGL', 'Controller / Anchor', 'Sentinel / Defense', 'Flex / Operator'],
    'LEAGUE OF LEGENDS': ['Top Lane', 'Jungle', 'Mid Lane', 'ADC / Bot Lane', 'Support'],
    'TEKKEN 8': ['Point / Main Fighter', 'FGC Specialist', 'Anchor / Captain']
  };

  function updateRoles() {
    if (!gameSelect || !roleSelect) return;
    const selectedGame = gameSelect.value;
    const roles = gameRoles[selectedGame] || gameRoles['MLBB'];
    roleSelect.innerHTML = roles.map(r => `<option value="${r}">${r}</option>`).join('');
  }

  if (gameSelect) {
    gameSelect.addEventListener('change', updateRoles);
    updateRoles();
  }

  typeSelectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeSelectorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedType = btn.getAttribute('data-type');
      if (formTypeInput) formTypeInput.value = selectedType;

      if (selectedType === 'Player Recruitment / Scouting') {
        scoutingFields.style.display = 'block';
        updateRoles();
      } else {
        scoutingFields.style.display = 'none';
      }
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      type: document.getElementById('form-type')?.value || 'General',
      name: document.getElementById('contact-name')?.value,
      email: document.getElementById('contact-email')?.value,
      game: document.getElementById('contact-game')?.value || 'N/A',
      ign: document.getElementById('contact-ign')?.value || 'N/A',
      rank: document.getElementById('contact-rank')?.value || 'N/A',
      vodLink: document.getElementById('contact-vod')?.value || 'N/A',
      message: document.getElementById('contact-message')?.value
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json.success) {
        contactForm.reset();
        showToast(json.message);

        let modal = document.getElementById('contact-confirm-modal');
        if (!modal) {
          modal = document.createElement('div');
          modal.id = 'contact-confirm-modal';
          modal.className = 'modal-overlay';
          document.body.appendChild(modal);
        }

        modal.innerHTML = `
          <div class="modal-content fade-in" style="text-align: center; max-width: 500px;">
            <button class="close-modal-btn" onclick="document.getElementById('contact-confirm-modal').classList.remove('active')">✕</button>
            <div style="font-size: 3.5rem; color: var(--yellow-primary); margin-bottom: 12px;">📩</div>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; text-transform: uppercase; color: var(--text-light);">APPLICATION SUBMITTED!</h2>
            <p style="color: var(--text-muted); margin-bottom: 16px;">Reference Number: <strong style="color: var(--yellow-primary); font-family: var(--font-mono);">${json.referenceId}</strong></p>
            <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 24px;">Our scouts and management team will review your submission and contact you via email.</p>
            <button class="btn-yellow" onclick="document.getElementById('contact-confirm-modal').classList.remove('active')">Done</button>
          </div>
        `;
        modal.classList.add('active');
      } else {
        showToast(json.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Error submitting form');
    }
  });
});
