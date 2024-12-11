document.addEventListener('DOMContentLoaded', () => {
    const keysApiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys';
    const menuApiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu';
    const outputElement = document.getElementById('output');
    const menuButton = document.querySelector('.menu-button');
    const cartButton = document.querySelector('.cart-button');
    const cartSection = document.getElementById('cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');

    let cart = []; // Store cart items

    window.showCart = showCart;

    /**
     * Fetch the menu from the API.
     */
    function fetchMenu() {
        fetch(keysApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch API key');
                return response.json();
            })
            .then(apiKeyData => {
                const apiKey = apiKeyData.apiKey;
                return fetch(menuApiUrl, {
                    headers: { 'x-zocom': apiKey },
                });
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch menu data');
                return response.json();
            })
            .then(menuData => {
                displayMenu(menuData.items);
            })
            .catch(error => {
                console.error('Error:', error);
                outputElement.textContent = 'Failed to load menu. Please try again later.';
            });
    }

    /**
     * Display the menu grouped by categories.
     * @param {Array} items - The menu items.
     */
    function displayMenu(items) {
        outputElement.innerHTML = '';

        // Group items by type
        const groupedItems = {
            wonton: [],
            dip: [],
            drink: [],
        };

        items.forEach(item => {
            if (groupedItems[item.type]) {
                groupedItems[item.type].push(item);
            }
        });

        // Function to create menu sections
        function createSection(title, items) {
            const section = document.createElement('div');
            section.classList.add('menu-section');
            section.innerHTML = `<h2>${title}</h2>`;

            items.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');
                menuItem.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>${item.ingredients ? item.ingredients.join(', ') : ''}</p>
                    <p><strong>Price:</strong> $${item.price}</p>
                `;
                menuItem.addEventListener('click', () => addToCart(item));
                menuItem.style.cursor = 'pointer'; // Make items clickable
                section.appendChild(menuItem);
            });

            return section;
        }

        // Append menu sections to output
        outputElement.appendChild(createSection('Wontons', groupedItems.wonton));
        outputElement.appendChild(createSection('Dips', groupedItems.dip));
        outputElement.appendChild(createSection('Drinks', groupedItems.drink));
    }

    /**
     * Add an item to the cart.
     * @param {Object} item - The item to add to the cart.
     */
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartCount();
    }

    /**
     * Update the cart count badge.
     */
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems; // Update cart count
    }

    /**
     * Display the cart with items, quantity controls, and total.
     */
    function showCart() {
        console.log('Cart contents:', cart);
        cartItemsContainer.innerHTML = ''; // Clear previous cart display

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>';
            cartTotalElement.textContent = '';
            return;
        }
    
        let total = 0;

     cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.name} - $${item.price}</span>
                <div>
                    <button class="decrease-button">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-button">+</button>
                </div>
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            `;

            const decreaseButton = cartItem.querySelector('.decrease-button');
            const increaseButton = cartItem.querySelector('.increase-button');

            decreaseButton.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(cartItem => cartItem.name !== item.name);
                }
                updateCartDisplay();
            });

            increaseButton.addEventListener('click', () => {
                item.quantity += 1;
                updateCartDisplay();
            });

            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
        cartSection.classList.remove('hidden'); // Show cart section
        cartSection.scrollIntoView({ behavior: 'smooth' });
    }

  
    function updateCartDisplay() {
        updateCartCount();
        showCart();
    }
    
    if (!menuButton || !cartButton) {
        console.error('Menu button or Cart button not found in the DOM');
        return;
    }
   

    // Event listeners
    menuButton.addEventListener('click', () => {
        console.log('Menu button clicked');
        fetchMenu();
    });
    cartButton.addEventListener('click', () => {
        console.log('Cart button clicked');
        cartSection.classList.toggle('hidden'); // Toggle the "hidden" class
        cartSection.scrollIntoView({ behavior: 'smooth' }); // Ensure visibility
        showCart();
    })
});