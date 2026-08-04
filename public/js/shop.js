// MERCH SHOP & CART DRAWER CONTROLLER
document.addEventListener('DOMContentLoaded', () => {
  const shopGrid = document.getElementById('shop-grid');
  const cartIconBtn = document.querySelector('.cart-icon-btn');
  const closeCartBtn = document.querySelector('.close-cart-btn');
  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  const cartDrawer = document.querySelector('.cart-drawer');

  // Open / Close Cart Drawer
  if (cartIconBtn) {
    cartIconBtn.addEventListener('click', openCartDrawer);
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCartDrawer);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
  }

  if (shopGrid) {
    loadProducts();
  }

  renderCartItems();
});

let selectedSizes = {};

async function loadProducts() {
  const shopGrid = document.getElementById('shop-grid');
  try {
    const res = await fetch('/api/shop/products');
    const json = await res.json();
    if (json.success) {
      shopGrid.innerHTML = json.data.map(p => {
        selectedSizes[p.id] = p.sizes[0];
        return `
          <div class="product-card fade-in">
            <div class="product-img-wrap">
              ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
              <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-info">
              <div class="product-name">${p.name}</div>
              <div class="product-price">$${p.price.toFixed(2)}</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">${p.description}</p>
              
              <div class="product-size-select">
                ${p.sizes.map((s, idx) => `
                  <button class="size-btn ${idx === 0 ? 'active' : ''}" onclick="selectProductSize('${p.id}', '${s}', this)">${s}</button>
                `).join('')}
              </div>

              <button class="btn-yellow" style="width: 100%; margin-top: auto;" onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')">
                🛒 Add To Cart
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (e) {
    console.error(e);
  }
}

function selectProductSize(productId, size, btn) {
  selectedSizes[productId] = size;
  const parent = btn.parentElement;
  parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function getCart() {
  return JSON.parse(localStorage.getItem('mustang_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('mustang_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
}

function addToCart(id, name, price, image) {
  const cart = getCart();
  const size = selectedSizes[id] || 'Standard';
  const existing = cart.find(item => item.id === id && item.size === size);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, size, quantity: 1 });
  }

  saveCart(cart);
  showToast(`Added ${name} (${size}) to cart!`);
  openCartDrawer();
}

function removeFromCart(id, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === id && item.size === size));
  saveCart(cart);
}

function updateQuantity(id, size, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => !(i.id === id && i.size === size));
    }
  }
  saveCart(cart);
}

function renderCartItems() {
  const cartBody = document.querySelector('.cart-body');
  const cartTotalVal = document.getElementById('cart-subtotal');
  if (!cartBody) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); margin-top: 60px;">
        <div style="font-size: 3rem;">🛒</div>
        <p>Your Mustang merch cart is empty.</p>
      </div>
    `;
    if (cartTotalVal) cartTotalVal.textContent = '$0.00';
    return;
  }

  let total = 0;
  cartBody.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info" style="flex-grow: 1;">
          <h4>${item.name}</h4>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Size: ${item.size}</span>
          <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="size-btn" onclick="updateQuantity('${item.id}', '${item.size}', -1)">-</button>
          <span style="font-family: var(--font-mono); font-weight: 700;">${item.quantity}</span>
          <button class="size-btn" onclick="updateQuantity('${item.id}', '${item.size}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  if (cartTotalVal) cartTotalVal.textContent = `$${total.toFixed(2)}`;
}

function openCartDrawer() {
  document.querySelector('.cart-drawer-overlay')?.classList.add('active');
  document.querySelector('.cart-drawer')?.classList.add('active');
}

function closeCartDrawer() {
  document.querySelector('.cart-drawer-overlay')?.classList.remove('active');
  document.querySelector('.cart-drawer')?.classList.remove('active');
}

// Checkout Modal Processing Trigger
async function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart, shippingInfo: {} })
    });
    const json = await res.json();

    if (json.success) {
      saveCart([]); // clear cart
      closeCartDrawer();
      
      let modal = document.getElementById('checkout-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'checkout-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-content fade-in" style="text-align: center; max-width: 550px;">
          <button class="close-modal-btn" onclick="document.getElementById('checkout-modal').classList.remove('active')">✕</button>
          <div style="font-size: 4rem; color: var(--yellow-primary); margin-bottom: 12px;">✅</div>
          <h2 style="font-family: var(--font-heading); font-size: 2rem; text-transform: uppercase; color: var(--text-light);">ORDER CONFIRMED!</h2>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Order Ref: <strong style="color: var(--yellow-primary); font-family: var(--font-mono);">${json.orderId}</strong></p>

          <div style="background: var(--bg-dark); border: 1px solid var(--border-gray); padding: 20px; border-radius: 8px; text-align: left; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Total Paid:</span>
              <strong style="color: var(--yellow-primary); font-family: var(--font-mono);">$${json.total}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Estimated Delivery:</span>
              <strong>${json.estimatedDelivery}</strong>
            </div>
          </div>

          <button class="btn-yellow" onclick="document.getElementById('checkout-modal').classList.remove('active')">Continue Shopping</button>
        </div>
      `;
      modal.classList.add('active');
    }
  } catch (e) {
    console.error(e);
  }
}
