//BurgerJS
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

//ThemeJS
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeStylesheet = document.getElementById('theme-stylesheet');
const logoImage = document.querySelector('.logo-container img');  // Select the logo image

function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function setTheme(theme) {
    if (theme === 'dark') {
        themeStylesheet.href = 'style-neon.css';
        themeIcon.textContent = 'Dark';
        logoImage.src = 'media/wordmark-black.svg';
    } else {
        themeStylesheet.href = 'style.css';
        themeIcon.textContent = 'Light';
        logoImage.src = 'media/wordmark.svg';
    }
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || getPreferredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}
setTheme(getPreferredTheme());
themeToggle.addEventListener('click', toggleTheme);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});
