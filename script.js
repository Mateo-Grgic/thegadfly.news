// Wait for the entire HTML document to load
document.addEventListener('DOMContentLoaded', function() {

    // Log to console to confirm script is running
    console.log('Script loaded and DOMContentLoaded fired');

    // Find the hamburger button element
    const hamburgerButton = document.querySelector('.hamburger-menu');

    // Find the navigation menu element
    const mainNav = document.querySelector('.main-nav');

    // Log what we found (for debugging)
    console.log('Hamburger button:', hamburgerButton);
    console.log('Main nav:', mainNav);

    // Check if both elements were found
    if (!hamburgerButton) {
        console.error('ERROR: Could not find element with class "hamburger-menu"');
        return;
    }

    if (!mainNav) {
        console.error('ERROR: Could not find element with class "main-nav"');
        return;
    }

    // If we got here, both elements exist
    console.log('Both elements found successfully');

    // Add click event listener to the hamburger button
    hamburgerButton.addEventListener('click', function(event) {
        console.log('Hamburger button was clicked!');

        // Toggle the 'active' class on the navigation menu
        mainNav.classList.toggle('active');

        // Log the current state
        console.log('Menu is now:', mainNav.classList.contains('active') ? 'OPEN' : 'CLOSED');
        console.log('Current classes on mainNav:', mainNav.className);

        // Update aria-expanded for accessibility
        const isExpanded = mainNav.classList.contains('active');
        hamburgerButton.setAttribute('aria-expanded', isExpanded);
    });

    console.log('Click event listener added successfully');
});

