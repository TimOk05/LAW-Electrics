const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');
const selector = document.querySelector('[data-job-selector]');
const selectorResult = document.querySelector('[data-selector-result]');
const mobileCall = document.querySelector('[data-mobile-call]');

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Open menu';
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open menu' : 'Close menu';
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });
}

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
  if (mobileCall) mobileCall.hidden = window.scrollY < 360;
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const nextSteps = {
  planned: 'A quick call or text is the best way to discuss the scope and arrange a free quote.',
  soon: 'Call or text with a short description and a photo if helpful. We’ll check the next available slot.',
  urgent: 'For an urgent electrical issue, call now so we can assess the situation and confirm availability.'
};

const jobLabels = {
  lighting: 'lighting work',
  socket: 'a socket or switch',
  fault: 'an electrical fault',
  project: 'a larger installation'
};

if (selector && selectorResult) {
  selector.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(selector);
    const job = data.get('job');
    const urgency = data.get('urgency');
    selectorResult.innerHTML = `<p><strong>For ${jobLabels[job]}:</strong> ${nextSteps[urgency]}</p><a href="tel:+447849971457">Call 07849 971457</a>`;
    selectorResult.hidden = false;
    selectorResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

