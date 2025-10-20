document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    if (!hamburgerButton) {
        console.error('ERROR: Could not find element with class "hamburger-menu"');
        return;
    }
    if (!mainNav) {
        console.error('ERROR: Could not find element with class "main-nav"');
        return;
    }
    hamburgerButton.addEventListener('click', function(event) {
        mainNav.classList.toggle('active');
        const isExpanded = mainNav.classList.contains('active');
        hamburgerButton.setAttribute('aria-expanded', isExpanded);
    });
});

