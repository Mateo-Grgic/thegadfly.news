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

// Theme management
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeStylesheet = document.getElementById('theme-stylesheet');

// Get saved theme or system preference
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme
function setTheme(theme) {
    if (theme === 'dark') {
        themeStylesheet.href = 'style-neon.css';
        themeIcon.textContent = '☀️';
    } else {
        themeStylesheet.href = 'style.css';
        themeIcon.textContent = '🌙';
    }
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || getPreferredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme on page load
setTheme(getPreferredTheme());

// Listen for toggle clicks
themeToggle.addEventListener('click', toggleTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

