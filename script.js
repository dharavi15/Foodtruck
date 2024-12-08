/*const apiKey = "YOUR_API_KEY";
const tenantId = "YOUR_TENANT_ID";

// Sections
const menuSection = document.getElementById("menu-section");
const cartSection = document.getElementById("cart-section");
const receiptSection = document.getElementById("receipt-section");

// Containers
const menuContainer = document.getElementById("menu-container");
const cartContainer = document.getElementById("cart-container");
const receiptContainer = document.getElementById("receipt-container");

// Buttons
const placeOrderBtn = document.getElementById("place-order");
const newOrderBtn = document.getElementById("new-order");

// Cart
let cart = [];

// Fetch Menu
async function fetchMenu() {
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
        headers: { "x-zocom": apiKey }
    });
    const menu = await response.json();

    menu.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <button onclick="addToCart('${item.id}', '${item.name}', ${item.price})">Add to Cart</button>
        `;
        menuContainer.appendChild(itemDiv);
    });
}

// Add to Cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
}

// Update Cart
function updateCart() {
    cartContainer.innerHTML = "";
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        `;
        cartContainer.appendChild(itemDiv);
    });
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Place Order
async function placeOrder() {
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-zocom": apiKey
        },
        body: JSON.stringify({ tenantId, cart })
    });

    const order = await response.json();
    showReceipt(order.id);
}

// Show Receipt
async function showReceipt(orderId) {
    const response = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/receipts/${orderId}`, {
        headers: { "x-zocom": apiKey }
    });
    const receipt = await response.json();

    receiptContainer.innerHTML = `
        <h3>Order ID: ${receipt.id}</h3>
        <p>Total: $${receipt.total}</p>
    `;
    cartSection.classList.remove("active");
    receiptSection.classList.add("active");
}

// New Order
function newOrder() {
    cart = [];
    updateCart();
    receiptSection.classList.remove("active");
    menuSection.classList.add("active");
}

// Event Listeners
placeOrderBtn.addEventListener("click", placeOrder);
newOrderBtn.addEventListener("click", newOrder);

// Initialize
fetchMenu();
menuSection.classList.add("active");*/
