// ===== DATOS DE PRODUCTOS =====
const products = [
  {
    id: 1,
    name: "Bidón Agua 20L",
    price: 1200,
    category: "aguas",
    description: "Agua purificada en bidón de 20 litros",
    image: "IMAGENES/agua.png",
    emoji: "💧",
    stock: 50,
  },
  {
    id: 2,
    name: "Coca Cola 2L",
    price: 1800,
    category: "gaseosas",
    description: "Gaseosa Coca Cola 2 litros",
    image: "IMAGENES/coca.png",
    emoji: "🥤",
    stock: 40,
  },
  {
    id: 3,
    name: "Sprite 2L",
    price: 1500,
    category: "gaseosas",
    description: "Gaseosa Sprite 2 litros",
    image: "IMAGENES/sprite.png",
    emoji: "🥤",
    stock: 35,
  },
  {
    id: 4,
    name: "Monster 473ml",
    price: 1200,
    category: "energizantes",
    description: "Bebida energizante Monster",
    image: "IMAGENES/moster.png",
    emoji: "⚡",
    stock: 45,
  },
  {
    id: 5,
    name: "Stella ligth 1L",
    price: 1100,
    category: "cervezas",
    description: "Cerveza Stella Artois ligth",
    image: "IMAGENES/stella light.png",
    emoji: "🍺",
    stock: 50,
  },
  {
    id: 6,
    name: "Stella Artois 1L",
    price: 1300,
    category: "cervezas",
    description: "Cerveza Stella Artois 1 litro",
    image: "IMAGENES/stella.png",
    emoji: "🍺",
    stock: 25,
  },
];

// ===== VARIABLES GLOBALES =====
let selectedProducts = [];
let currentFilter = "todos";

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  renderProducts();
  setupEventListeners();
  updateOrderSummary();
  setupMobileImprovements();
  setupMascotaClicks();
}

// ===== MEJORAS MÓVIL =====
function setupMobileImprovements() {
  document.addEventListener("touchstart", function () {}, { passive: true });

  const filtersContainer = document.querySelector(".category-filters");
  if (filtersContainer && window.innerWidth <= 768) {
    filtersContainer.style.overflowX = "auto";
    filtersContainer.style.webkitOverflowScrolling = "touch";
  }

  if ("ontouchstart" in window) {
    document.body.classList.add("touch-device");
  }
}

function isMobileDevice() {
  return window.innerWidth <= 768 || "ontouchstart" in window;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  setupOrderForm();
  setupMobileNavigation();
  setupTouchOptimizations();
}

function setupOrderForm() {
  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      sendWhatsAppOrder();
    });
  }
}

function setupMobileNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      this.classList.toggle("active");
    });

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
  }
}

function setupTouchOptimizations() {
  document.body.style.overscrollBehaviorY = "contain";

  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && isMobileDevice()) {
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
    );
  }
}

// ===== SISTEMA DE PRODUCTOS =====
function renderProducts() {
  const productsGrid = document.querySelector(".products-grid");
  if (productsGrid) {
    productsGrid.innerHTML = "";
    products.forEach((product) => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
    });
  }
}

function createProductCard(product) {
  const productCard = document.createElement("div");
  productCard.className = "product-card";
  productCard.setAttribute("data-category", product.category);

  const stockInfo =
    product.stock > 10
      ? `<span class="stock-available">✅ ${product.stock} disponibles</span>`
      : product.stock > 0
      ? `<span class="stock-low">⚠️ Últimas ${product.stock} unidades</span>`
      : `<span class="stock-out">❌ Sin stock</span>`;

  productCard.innerHTML = `
    <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
    </div>
    <h3>${product.name}</h3>
    <div class="product-price">$${product.price}</div>
    <p class="product-description">${product.description}</p>
    <div class="stock-info">${stockInfo}</div>
    <div class="quantity-selector">
        <button class="quantity-btn minus" data-product-id="${product.id}">-</button>
        <span class="quantity-display" id="quantity-${product.id}">1</span>
        <button class="quantity-btn plus" data-product-id="${product.id}">+</button>
    </div>
    <button class="add-to-cart" data-product-id="${product.id}">Agregar al Pedido</button>
  `;

  setupQuantityListeners(productCard, product.id);

  const addButton = productCard.querySelector(".add-to-cart");
  addButton.addEventListener("click", function () {
    const quantity = parseInt(
      document.getElementById(`quantity-${product.id}`).textContent
    );
    addToCart(product.id, quantity);
  });

  return productCard;
}

// ===== SISTEMA DE CANTIDADES =====
function setupQuantityListeners(productCard, productId) {
  const minusBtn = productCard.querySelector(".quantity-btn.minus");
  const plusBtn = productCard.querySelector(".quantity-btn.plus");
  const quantityDisplay = productCard.querySelector(".quantity-display");

  minusBtn.addEventListener("click", function () {
    let quantity = parseInt(quantityDisplay.textContent);
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
      updateAddButtonState(productId, quantity);
    }
  });

  plusBtn.addEventListener("click", function () {
    let quantity = parseInt(quantityDisplay.textContent);
    const product = products.find((p) => p.id === productId);
    if (quantity < product.stock) {
      quantity++;
      quantityDisplay.textContent = quantity;
      updateAddButtonState(productId, quantity);
    } else {
      showStockMessage(
        `Máximo ${product.stock} unidades disponibles`,
        "warning"
      );
    }
  });
}

function updateAddButtonState(productId, quantity) {
  const product = products.find((p) => p.id === productId);
  const addButton = document.querySelector(
    `.add-to-cart[data-product-id="${productId}"]`
  );

  if (!product || !addButton) return;

  if (product.stock === 0) {
    addButton.textContent = "Sin Stock";
    addButton.disabled = true;
    addButton.style.background = "#ccc";
  } else if (quantity > product.stock) {
    addButton.textContent = "Stock Insuficiente";
    addButton.disabled = true;
    addButton.style.background = "#ff6b6b";
  } else {
    addButton.textContent =
      quantity > 1 ? `Agregar ${quantity} al Pedido` : "Agregar al Pedido";
    addButton.disabled = false;
    addButton.style.background = "";
  }
}

function showStockMessage(message, type = "info") {
  const messageEl = document.createElement("div");
  messageEl.className = `stock-message stock-message-${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    animation: slideDown 0.3s ease;
    ${type === "warning" ? "background: #ffa502;" : "background: #2ed573;"}
  `;

  document.body.appendChild(messageEl);
  setTimeout(() => {
    messageEl.remove();
  }, 3000);
}

// ===== SISTEMA DE CARRITO =====
function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (quantity > product.stock) {
    showStockMessage(
      `No hay suficiente stock. Máximo: ${product.stock} unidades`,
      "warning"
    );
    return;
  }

  const existingItem = selectedProducts.find((item) => item.id === productId);
  if (existingItem) {
    const newTotalQuantity = existingItem.quantity + quantity;
    if (newTotalQuantity > product.stock) {
      showStockMessage(
        `No puedes agregar más. Máximo ${product.stock} unidades`,
        "warning"
      );
      return;
    }
    existingItem.quantity = newTotalQuantity;
  } else {
    selectedProducts.push({ ...product, quantity: quantity });
  }

  updateProductStock(productId, -quantity);
  updateOrderSummary();
  showAddToCartAnimation(productId, quantity);
  resetQuantity(productId);
}

function updateProductStock(productId, quantityChange) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    product.stock += quantityChange;
    const productCard = document.querySelector(
      `.product-card[data-category="${product.category}"]`
    );
    if (productCard) {
      const stockInfo = productCard.querySelector(".stock-info");
      if (stockInfo) stockInfo.innerHTML = getStockHTML(product);
    }
    updateAddButtonState(productId, 1);
  }
}

function getStockHTML(product) {
  if (product.stock > 10)
    return `<span class="stock-available">✅ ${product.stock} disponibles</span>`;
  if (product.stock > 0)
    return `<span class="stock-low">⚠️ Últimas ${product.stock} unidades</span>`;
  return `<span class="stock-out">❌ Sin stock</span>`;
}

function resetQuantity(productId) {
  const quantityDisplay = document.getElementById(`quantity-${productId}`);
  if (quantityDisplay) quantityDisplay.textContent = "1";
}

function removeFromCart(productId) {
  const itemIndex = selectedProducts.findIndex((item) => item.id === productId);
  if (itemIndex !== -1) {
    const removedItem = selectedProducts[itemIndex];
    selectedProducts.splice(itemIndex, 1);
    updateProductStock(productId, removedItem.quantity);
    updateOrderSummary();
  }
}

function updateOrderSummary() {
  const selectedItems = document.getElementById("selected-items");
  const totalAmount = document.getElementById("total-amount");

  const total = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  totalAmount.textContent = total;

  if (selectedProducts.length === 0) {
    selectedItems.innerHTML =
      '<p class="empty-message">Aún no has seleccionado productos</p>';
    return;
  }

  selectedItems.innerHTML = selectedProducts
    .map(
      (item) => `
    <div class="selected-item">
      <div class="item-info">
        <h4>${item.name}</h4>
        <div class="item-details">
          <span class="item-price">$${item.price} c/u</span>
          <span class="item-quantity">Cantidad: ${item.quantity}</span>
          <span class="item-subtotal">Subtotal: $${
            item.price * item.quantity
          }</span>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `
    )
    .join("");
}

function showAddToCartAnimation(productId, quantity) {
  const button = document.querySelector(
    `.add-to-cart[data-product-id="${productId}"]`
  );
  if (!button) return;

  const originalText = button.textContent;
  button.textContent = quantity > 1 ? `✓ ${quantity} agregados` : "✓ Agregado";
  button.style.background = "#25D366";
  button.disabled = true;

  setTimeout(
    () => {
      button.textContent = originalText;
      button.style.background = "";
      button.disabled = false;
    },
    isMobileDevice() ? 1500 : 2000
  );
}

// ===== WHATSAPP =====
function sendWhatsAppOrder() {
  if (selectedProducts.length === 0) {
    alert(
      "Por favor, selecciona al menos un producto antes de enviar el pedido."
    );
    return;
  }

  const name = document.getElementById("customer-name").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const notes = document.getElementById("customer-notes").value.trim();

  if (!name || !address || !phone) {
    alert(
      "Por favor, completa todos los campos obligatorios (Nombre, Dirección y Teléfono)."
    );
    return;
  }

  const phoneNumber = "5491127564077";
  const message = generateWhatsAppMessage(name, address, phone, notes);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const whatsappUrl = isMobile
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`;

  window.open(whatsappUrl, "_blank");
}

function generateWhatsAppMessage(name, address, phone, notes) {
  const total = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const productsList = selectedProducts
    .map(
      (item) =>
        `• ${item.name} - $${item.price} x ${item.quantity} = $${
          item.price * item.quantity
        }`
    )
    .join("\n");

  return `¡Hola Bebidas Mattaldi! 👋

Quiero realizar el siguiente pedido:

${productsList}

*Total: $${total}*

*Mis datos:*
📝 Nombre: ${name}
🏠 Dirección: ${address}
📞 Teléfono: ${phone}
${notes ? `📋 Observaciones: ${notes}` : ""}

¡Espero su confirmación! 🚚💨`;
}

// ===== FUNCIONES EXTRA =====
function scrollToAbout() {
  const aboutSection = document.getElementById("nosotros");
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    const mascota = document.querySelector(".mascota");
    if (mascota) {
      mascota.style.transform = "scale(0.95)";
      setTimeout(() => {
        mascota.style.transform = "";
      }, 200);
    }
  }
}

function setupMascotaClicks() {
  const mascotas = document.querySelectorAll(".mascota, .mascota-hero");
  mascotas.forEach((mascota) => {
    mascota.style.cursor = "pointer";
    mascota.addEventListener("click", scrollToAbout);
  });
}

console.log("🛒 Bebidas Mattaldi - Sistema cargado correctamente");
