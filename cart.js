document.addEventListener('DOMContentLoaded', () => {
    const cartBox = document.getElementById('cart-box'); // Main cart SVG container
    const totalElement = document.getElementById('totalt'); // Total price container (rect)
    const cartData = JSON.parse(sessionStorage.getItem('cart')) || []; // Retrieve cart data


    function showCustomDialog(message) {
        const dialog = document.getElementById('custom-dialog');
        const content = document.getElementById('dialog-content');
        const closeButton = document.getElementById('dialog-close');
    
        // Update content with the dynamic message
        content.textContent = message;
    
        // Show the dialog
        dialog.showModal();
    
        // Handle the close button click
        closeButton.addEventListener('click', () => {
            dialog.close();
        });
    }

    // Function to display cart items
    function displayCartItems() {
        clearPreviousItems(); // Clear previously rendered cart items

        let totalPrice = 0;
        const startY = 100; // Starting Y position for the first cart item
        let currentY = startY;

        cartData.forEach(item => {
            totalPrice += item.price * item.quantity;

            // Create text element for cart item name, quantity, and price
            const textElement = createSVGTextElement(
                ` ${item.name} (${item.quantity} stycken) .......... ${item.price} SEK`,
                20,
                currentY,
                16,
                '#353131'
            );

            cartBox.appendChild(textElement);

            // Create "+" button
            const plusButton = createSVGTextElement('+', 310, currentY, 16, '#0000FF', 'pointer');
            plusButton.addEventListener('click', () => updateCart(item, 1));
            cartBox.appendChild(plusButton);

            // Create "-" button
            const minusButton = createSVGTextElement('-', 350, currentY, 16, '#FF0000', 'pointer');
            minusButton.addEventListener('click', () => updateCart(item, -1));
            cartBox.appendChild(minusButton);

            currentY += 30; // Increment Y position for next item
        });

        updateTotal(totalPrice); // Update total price
        addTakeMyMoneyText();
    }

    // Function to create SVG text elements
    function createSVGTextElement(text, x, y, fontSize, fill, cursor = 'default') {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('fill', fill);
        textElement.style.cursor = cursor;
        textElement.textContent = text;
        return textElement;
    }

    // Function to clear previous cart items from the SVG
    function clearPreviousItems() {
        const allTextElements = cartBox.querySelectorAll('text');
        allTextElements.forEach(text => {
            if (text.getAttribute('y') > 80 && text.id !== 'total-text') text.remove(); // Exclude total-text
        });
    }

    // Update cart quantities and re-render items
    function updateCart(item, change) {
        const cartItem = cartData.find(cartItem => cartItem.id === item.id);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                // Remove item if quantity is 0
                const index = cartData.indexOf(cartItem);
                cartData.splice(index, 1);
            }
        }
        sessionStorage.setItem('cart', JSON.stringify(cartData)); // Update sessionStorage
        displayCartItems(); // Re-render cart
    }

    // Function to update total price display
    function updateTotal(totalPrice) {
        // Make sure we're updating an element that can show text content
        const totalTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        totalTextElement.setAttribute('x', 20);
        totalTextElement.setAttribute('y', 690); // Adjust Y position as needed
        totalTextElement.setAttribute('font-size', 16);
        totalTextElement.setAttribute('fill', '#353131');
        totalTextElement.textContent = `TOTALT: ${totalPrice} SEK inkl 20% moms`;

        // Remove existing total text if present
        const existingTotalText = cartBox.querySelector('#total-text');
        if (existingTotalText) {
            existingTotalText.remove();
        }

        // Add the new total text element
        totalTextElement.setAttribute('id', 'total-text');
        cartBox.appendChild(totalTextElement);
    }

    function addTakeMyMoneyText() {
        const existingText = cartBox.querySelector('#take-my-money-text');
        
        totalt
        if (!existingText) {
            const takeMyMoneyText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            takeMyMoneyText.setAttribute('id', 'take-my-money-text');
            takeMyMoneyText.setAttribute('x', 190);
            takeMyMoneyText.setAttribute('y', 790); // Adjust Y for the center of the rect
            takeMyMoneyText.setAttribute('font-size', 20);
            takeMyMoneyText.setAttribute('fill', '#FFF');
            takeMyMoneyText.setAttribute('text-anchor', 'middle');
            takeMyMoneyText.setAttribute('dominant-baseline', 'middle');
            takeMyMoneyText.textContent = 'TAKE MY MONEY';
            cartBox.appendChild(takeMyMoneyText);
            takeMyMoneyText.style.cursor = 'pointer';
            takeMyMoneyText.addEventListener('click', handleTakeMyMoneyClick);
           // takeMyMoneyText.addEventListener('click', () => {
       // window.location.href = 'checkout.html'; // Replace 'checkout.html' with your target page
   // });
        }
       
    }

    async function handleTakeMyMoneyClick() {
        try {
            const tenantName = generateUniqueTenantName();

            // Step 1: Generate a tenant
            const tenantId = await generateTenant(tenantName);
    
            if (!tenantId) {
                showCustomDialog('Failed to generate tenant. Please try again.');
                return;
            }
    
            // Step 2: Post the order
            const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            const items = cart.map(item => item.id); // Extract item IDs from cart
    
            if (items.length === 0) {
                showCustomDialog('Your cart is empty. Please add items before proceeding.');
                return;
            }
    
            const orderResponse = await postOrder(tenantId, items);
            if (orderResponse) {
                window.location.href = 'checkout.html'; 
            } else {
                showCustomDialog('Failed to place the order. Please try again.');
            }
        } catch (error) {
            console.error('Error handling order:', error);
            showCustomDialog('Something went wrong. Please try again.');
        }
    }
    
    function generateUniqueTenantName() {
        // You can use a random string, timestamp, or other methods to ensure uniqueness
        return 'tenant_' + Date.now(); // Example: 'tenant_1628185392814'
    }

    async function generateTenant(tenantName) {
        const tenantApiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants';
        const apiKey = sessionStorage.getItem('apiKey'); // Replace with your actual API key
        
        if (!apiKey) {
            console.error('API key not found in sessionStorage');
            return null;
        }
    
        try {
            // Make the POST request to generate the tenant
            const response = await fetch(tenantApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-zocom': apiKey,
                },
                body: JSON.stringify({ name: tenantName }), // You can replace 'ji' with a dynamic value if needed
            });
    
            // Check if the response was successful
            if (!response.ok) {
                console.error(`Failed to generate tenant. Status: ${response.status}, Status Text: ${response.statusText}`);
                
                // Try to log the response body if available
                const errorData = await response.text(); // Attempt to parse as text (if not JSON)
                console.error('Response body:', errorData);
    
                throw new Error('Failed to generate tenant');
            }
    
            // Check if the response is a valid JSON object
            const data = await response.json().catch(err => {
                console.error('Error parsing JSON response:', err);
                throw new Error('Failed to parse JSON response');
            });
    
            console.log('Tenant generated:', data);
    
            return data.id; // Return the tenant ID
        } catch (error) {
            console.error('Error generating tenant:', error);
            return null;
        }
    }
    
    
    async function postOrder(tenantId, items) {
        const orderApiUrl = `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders`;
        const apiKey = sessionStorage.getItem('apiKey');; // Replace with your actual API key
    
        const body = {
            items: items, // Array of item IDs
        };
    
        try {
            const response = await fetch(orderApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-zocom': apiKey,
                },
                body: JSON.stringify(body),
            });
    
            if (!response.ok) {
                console.error('Failed to place order:', response.statusText);
                return false;
            }
    
            return true; // Indicate success
        } catch (error) {
            console.error('Error placing order:', error);
            return false;
        }
    }

    displayCartItems(); // Initial call to display cart items
    addTakeMyMoneyText();
});
