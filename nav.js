// Shared nav dropdown toggle — include this on every page that uses .nav
document.querySelectorAll('.nav-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const content = btn.closest('.nav').querySelector('.nav-content');
    const isOpen = content.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });
});