// NEWS & MEDIA CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid) return;

  async function loadNews() {
    try {
      const res = await fetch('/api/news');
      const json = await res.json();
      if (json.success) {
        renderNews(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function renderNews(articles) {
    newsGrid.innerHTML = articles.map(a => `
      <div class="esports-card fade-in" style="cursor: pointer;" onclick="openNewsModal('${a.id}')">
        <div style="height: 200px; overflow: hidden; border-radius: 6px; margin-bottom: 16px;">
          <img src="${a.image}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.3s ease;" alt="${a.title}">
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--yellow-primary); text-transform: uppercase;">${a.category} • ${a.date}</span>
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 8px 0; color: var(--text-light); line-height: 1.2;">${a.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${a.summary}</p>
        <span style="display: inline-block; margin-top: 16px; font-family: var(--font-heading); font-size: 0.85rem; color: var(--yellow-primary); text-transform: uppercase;">Read Article →</span>
      </div>
    `).join('');
  }

  loadNews();
});

async function openNewsModal(articleId) {
  try {
    const res = await fetch('/api/news');
    const json = await res.json();
    const article = json.data.find(a => a.id === articleId);
    if (!article) return;

    let modal = document.getElementById('news-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'news-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content fade-in" style="max-width: 800px;">
        <button class="close-modal-btn" onclick="closeNewsModal()">✕</button>
        <span style="color: var(--yellow-primary); font-family: var(--font-mono); font-weight: 700; text-transform: uppercase;">${article.category} • ${article.date}</span>
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; text-transform: uppercase; margin: 12px 0; line-height: 1.1;">${article.title}</h1>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 24px;">By ${article.author}</p>
        
        <img src="${article.image}" style="width: 100%; max-height: 380px; object-fit: cover; border-radius: 8px; margin-bottom: 24px; border: 1px solid var(--border-gray);" alt="${article.title}">
        
        <div style="line-height: 1.8; color: var(--text-light); font-size: 1rem; white-space: pre-line;">
          ${article.content}
        </div>
      </div>
    `;

    modal.classList.add('active');
  } catch (e) {
    console.error(e);
  }
}

function closeNewsModal() {
  const modal = document.getElementById('news-modal');
  if (modal) modal.classList.remove('active');
}
