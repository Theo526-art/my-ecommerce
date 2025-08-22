const teaProducts = [
    { id: 1, name: "ASSAM BLACK TEA", price: 10, image:"images/assama.webp" },
    { id: 2, name: "EARL GREY BLACK TEA", price: 12, image: "images/earl grey.webp" },
    { id: 3, name: "DARJEELING BLACK TEA", price: 9, image: "images/DARGILEENG.webp" },
    { id: 4, name: "ENGLISH BREAKFAST BLACK TEA", price: 11, image: "images/ENGLISGH.webp" },
    { id: 5, name: "CLASSIC GREEN TEA", price: 13, image: "images/classic green tea.webp" },
    { id: 6, name: "LEMON GREEN TEA", price: 15, image: "images/lemon green tea.webp" },
    { id: 7, name: "GINGER GREEN TEA", price: 14, image: "images/ginger green leaf.webp" },
    { id: 8, name: "HONEY GREEN TEA", price: 16, image: "images/honey green tea.webp" },
    { id: 9, name: "CLASSIC CEREMONIAL MATCHA", price: 8, image: "images/matcha.jpg" },
    { id: 10, name: "PREMIUM CULINARY MATCHA", price: 10, image: "images/matcha1.webp" },
    { id: 11, name: "MINT MATCHA", price: 10, image: "images/matcha2.webp" },
    { id: 12, name: "VANILLA MATCHA", price: 10, image: "images/matcha3.webp" }
];

// ==================== DOM ELEMENTS ====================
const productList = document.getElementById("product-list"); // shop only
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count"); 
const cartSubtotal = document.getElementById("cart-subtotal");
const cartShipping = document.getElementById("cart-shipping");
const cartTotal = document.getElementById("cart-total");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartIcon = document.getElementById("cart-icon");
const cartLink = document.getElementById("cart-link");

// ==================== CART STORAGE ====================
let shoppingCart = JSON.parse(localStorage.getItem('teaShopCart')) || [];

function saveCartToStorage() {
    localStorage.setItem('teaShopCart', JSON.stringify(shoppingCart));
}

// ==================== RENDER PRODUCTS (SHOP ONLY) ====================
if (productList) {
    teaProducts.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(div);
    });
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId) {
    const product = teaProducts.find(item => item.id === productId);
    const existingItem = shoppingCart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        shoppingCart.push({ ...product, quantity: 1 });
    }
    saveCartToStorage();
    updateCart();
    openCart();
}

function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCart();
}

function updateQuantity(productId, change) {
    const item = shoppingCart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(productId);
        else {
            saveCartToStorage();
            updateCart();
        }
    }
}

function updateCart() {
    const totalItems = shoppingCart.reduce((t, i) => t + i.quantity, 0);
    cartCount.textContent = totalItems;

    cartItems.innerHTML = '';
    if (shoppingCart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
        </div>`;
    } else {
        shoppingCart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="ri-close-line"></i>
                </button>
            `;
            cartItems.appendChild(el);
        });
    }

    const subtotal = shoppingCart.reduce((t, i) => t + (i.price * i.quantity), 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartShipping.textContent = subtotal > 0 ? `$${shipping.toFixed(2)}` : 'Free';
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    cartPanel.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartPanel() {
    cartPanel.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==================== EVENT LISTENERS ====================
if (cartIcon) cartIcon.addEventListener('click', openCart);
if (cartLink) cartLink.addEventListener('click', e => { e.preventDefault(); openCart(); });
if (closeCart) closeCart.addEventListener('click', closeCartPanel);
if (overlay) overlay.addEventListener('click', closeCartPanel);

// ==================== SEARCH BAR ====================
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

if (searchInput && searchResults) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length > 0) {
            const results = teaProducts.filter(p => p.name.toLowerCase().includes(query));
            if (results.length > 0) {
                results.forEach(p => {
                    const li = document.createElement("li");
                    li.textContent = p.name;
                    li.onclick = () => addToCart(p.id);
                    searchResults.appendChild(li);
                });
            } else {
                searchResults.innerHTML = `<li>No products found</li>`;
            }
        }
    });
}

// ==================== INIT CART ====================
updateCart();
