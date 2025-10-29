document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const mobileDropdown = document.getElementById('mobile-dropdown');

  

  function openMenu() {
    burgerBtn.classList.add('open');
    mobileDropdown.classList.add('open');
    overlay.classList.add('active');
    mobileDropdown.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    burgerBtn.classList.remove('open');
    mobileDropdown.classList.remove('open');
    overlay.classList.remove('active');
    mobileDropdown.setAttribute('aria-hidden', 'true');
  }

  burgerBtn.addEventListener('click', () => {
    if (mobileDropdown.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // закриваємо меню при кліку на overlay
  overlay.addEventListener('click', closeMenu);

  // закриваємо меню при виборі пункту
  mobileDropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // закриваємо меню при натисканні ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
});
