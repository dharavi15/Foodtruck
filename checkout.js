document.addEventListener('DOMContentLoaded', () => {
    // Get the "GÖR EN NY BESTÄLLNING" button by its ID
    document.getElementById('new-order-button').addEventListener('click', function() {
        // Clear session storage to reset the cart or any session data
        sessionStorage.clear();
    
        // Redirect to menu.html to start a new session
        window.location.href = 'index.html';  // Adjust the path to index.html if needed
    });
    
    });