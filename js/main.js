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


// vimJS
const state = {
  isNormalMode: true,
  VERTICAL_STEP: 80,
  HORIZONTAL_STEP: 60
};
function handleVimKey(e) {
  const active = document.activeElement;
  const isTyping = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;
  if (isTyping) return;
  const halfPage = window.innerHeight / 2;
  switch (e.key) {
    case 'j': window.scrollBy({ top: state.VERTICAL_STEP }); break;
    case 'k': window.scrollBy({ top: -state.VERTICAL_STEP }); break;
    case 'h': window.scrollBy({ left: -state.HORIZONTAL_STEP }); break;
    case 'l': window.scrollBy({ left: state.HORIZONTAL_STEP }); break;
    case 'd': window.scrollBy({ top: halfPage }); break;
    case 'u': window.scrollBy({ top: -halfPage }); break;
    case 'G': window.scrollTo({ top: document.documentElement.scrollHeight }); break;
    case 'g': 
      if (e.target.dataset.last === 'g') {
        window.scrollTo({ top: 0 });
        e.target.dataset.last = '';
      } else {
        e.target.dataset.last = 'g';
      }
      break;
  }
}

document.addEventListener('keydown', handleVimKey);