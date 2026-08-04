// MUSTANG ESPORTS - CORE APPLICATION SCRIPT

// Toast Notification Manager
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Highlight Active Nav Link based on Current Page
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (toggleBtn && navLinksContainer) {
    toggleBtn.addEventListener('click', () => {
      if (navLinksContainer.style.display === 'flex') {
        navLinksContainer.style.display = 'none';
      } else {
        navLinksContainer.style.display = 'flex';
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = 'var(--nav-height)';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.right = '0';
        navLinksContainer.style.background = 'var(--bg-card)';
        navLinksContainer.style.padding = '20px';
        navLinksContainer.style.borderBottom = '1px solid var(--border-gray)';
      }
    });
  }

  // Update Cart Badge Count
  updateCartBadge();
});

// Global Cart Badge Helper
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('mustang_cart') || '[]');
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = totalCount;
  }
}
