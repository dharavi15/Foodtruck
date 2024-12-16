document.addEventListener('DOMContentLoaded', () => {
    const keysApiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys';
    const menuApiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu';
    
    const wontonSvgs = [
        document.getElementById('menu-svg1'),
        document.getElementById('menu-svg2'),
        document.getElementById('menu-svg3'),
        document.getElementById('menu-svg4'),
        document.getElementById('menu-svg5')
    ];

    const dipSvg = document.getElementById('dip-item');
    const smallDipRects = [
        document.getElementById('dip-item-2'),
        document.getElementById('dip-item-3'),
        document.getElementById('dip-item-4'),
        document.getElementById('dip-item-5'),
        document.getElementById('dip-item-6'),
        document.getElementById('dip-item-7'),
    ];

    const drinkSvg = document.getElementById('drink-item');
    const smallDrinkRects = [
        document.getElementById('drink-item-2'),
        document.getElementById('drink-item-3'),
        document.getElementById('drink-item-4'),
        document.getElementById('drink-item-5'),
        document.getElementById('drink-item-6'),
        document.getElementById('drink-item-7'),
    ];

    
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];;
    const cartCountElement = document.getElementById('cart-count');

    const errorDialog = document.getElementById('errorDialog');
    const errorMessage = document.getElementById('errorMessage');
    const closeDialogButton = document.getElementById('closeDialogButton');

    closeDialogButton.addEventListener('click', () => errorDialog.close());

    document.getElementById('navigateToCartPage').addEventListener('click', function() {


        // Redirect to index.html to start a new session
        window.location.href = 'cart.html';  // Adjust the path to index.html if needed
    });
    function showDialog(message) {
        errorMessage.textContent = message;
        errorDialog.showModal();
    }
    
    function fetchAndDisplayWontons() {
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
                sessionStorage.setItem('apiKey', apiKey);
                return fetch(menuApiUrl, {
                    headers: { 'x-zocom': apiKey },
                });
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch menu data');
                return response.json();
            })
            .then(menuData => {
                const wontons = menuData.items.filter(item => item.type === 'wonton');
                const dips = menuData.items.filter(item => item.type === 'dip');
                const drinks = menuData.items.filter(item => item.type === 'drink');

                // Assign each wonton to an SVG
                wontons.forEach((wonton, index) => {
                    if (wontonSvgs[index]) {
                        updateSvgWithWonton(wontonSvgs[index], wonton,'wonton');
                        updateMainDipRectangle(dipSvg, dips);
                        updateMainDrinkRectangle(drinkSvg, drinks);
                    }
                });

                dips.forEach((dip, index) => {
                    if (smallDipRects[index]) {
                        updateSmallDipRectangle(smallDipRects[index], dip,'dip');
                    }
                });
                drinks.forEach((drink, index) => {
                    if (smallDrinkRects[index]) {
                        updateSmallDrinkRectangle(smallDrinkRects[index], drink,'drink');
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                showDialog('Failed to load menu. Please try again later.');
            });
    }

    /**
     * Updates an SVG with wonton data.
     * @param {SVGElement} svgElement 
     * @param {Object} wonton 
     */
    function updateSvgWithWonton(svgElement, item, itemType) {
        // Add name and price
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', '20');
        textElement.setAttribute('y', '40');
        textElement.setAttribute('font-size', '24');
        textElement.setAttribute('fill', '#FFFFFF');
        textElement.textContent = `${item.name}....................${item.price}kr`;
        svgElement.appendChild(textElement);

        // Add ingredients
        const ingredientsElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ingredientsElement.setAttribute('x', '20');
        ingredientsElement.setAttribute('y', '60');
        ingredientsElement.setAttribute('font-size', '12');
        ingredientsElement.setAttribute('fill', '#CCCCCC');
        ingredientsElement.textContent = `(${item.ingredients.join(', ')})`;
        svgElement.appendChild(ingredientsElement);

        svgElement.style.cursor = 'pointer';
        svgElement.addEventListener('click', () => addToCart(item));
    }

    /**
     * @param {SVGElement} svgElement 
     * @param {Array} dips 
     */
    function updateMainDipRectangle(svgElement, dips) {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', '20');
        textElement.setAttribute('y', '40');
        textElement.setAttribute('font-size', '14');
        textElement.setAttribute('fill', '#FFFFFF');
        textElement.textContent = `DIPSÅS.................................................................19kr`;
        svgElement.appendChild(textElement);
      
       
    }

    /**
     * @param {SVGElement} rectElement 
     * @param {Object} dip 
     */
    function updateSmallDipRectangle(rectElement, item, itemType) {
        const parentSvg = rectElement.closest('svg');
        const rectX = parseInt(rectElement.getAttribute('x'), 10) || 0;
        const rectY = parseInt(rectElement.getAttribute('y'), 10) || 0;

        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', rectX + 6); 
        textElement.setAttribute('y', rectY + 20); 
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', '#FFFFFF');
        textElement.textContent = item.name;

        parentSvg.appendChild(textElement);

        rectElement.style.cursor = 'pointer';
        rectElement.addEventListener('click', () => addToCart(item));
    }

    /**
     * @param {SVGElement} svgElement 
     * @param {Array} drinks 
     */
    function updateMainDrinkRectangle(svgElement, drinks) {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', '20');
        textElement.setAttribute('y', '40');
        textElement.setAttribute('font-size', '14');
        textElement.setAttribute('fill', '#FFFFFF');
        textElement.textContent = `DRICKA................................................................19kr`;
        svgElement.appendChild(textElement);

        

    }

    /**
     * @param {SVGElement} rectElement 
     * @param {Object} drink 
     */
    function updateSmallDrinkRectangle(rectElement,  item, itemType) {
        const parentSvg = rectElement.closest('svg');
        const rectX = parseInt(rectElement.getAttribute('x'), 10) || 0;
        const rectY = parseInt(rectElement.getAttribute('y'), 10) || 0;

        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', rectX + 5); 
        textElement.setAttribute('y', rectY + 20); 
        textElement.setAttribute('font-size', '12');
        textElement.setAttribute('fill', '#FFFFFF');
        textElement.textContent = item.name;

        parentSvg.appendChild(textElement);

        rectElement.style.cursor = 'pointer';
        rectElement.addEventListener('click', () => addToCart(item));

    }

   

    function addToCart(item) {
 
      

        const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item already exists
    } else {
        // Add new item with quantity property
        cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    sessionStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
       // const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      //  cartCountElement.textContent = totalItems; 
        //cartCountElement.textContent = cart.length;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    }

    fetchAndDisplayWontons();
});