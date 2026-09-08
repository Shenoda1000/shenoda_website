// Loader
window.addEventListener('load', () => {
    document.getElementById('loader').classList.add('fade-out');
});

// Theme toggle (persisted)
const themeSwitch = document.getElementById('theme-switch');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
root.setAttribute('data-theme', initialTheme);
themeSwitch.checked = initialTheme === 'light';

themeSwitch.addEventListener('change', () => {
    const theme = themeSwitch.checked ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// Nav menu
const menu = document.getElementById('menu');
const burger = document.getElementById('burger');
const overlay = document.getElementById('menuOverlay');

function openMenu() {
    menu.classList.add('show');
    overlay.classList.add('show');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    menu.classList.remove('show');
    overlay.classList.remove('show');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

burger.addEventListener('click', () => {
    menu.classList.contains('show') ? closeMenu() : openMenu();
});
overlay.addEventListener('click', closeMenu);
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

// Typewriter tagline
const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
    const cursor = taglineEl.querySelector('.job-cursor');
    const phrases = ['builds interfaces that hold up', 'ships small sites fast', 'sweats the little details'];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeStep() {
        const current = phrases[phraseIndex];
        charIndex += deleting ? -1 : 1;
        taglineEl.firstChild.textContent = current.slice(0, charIndex);

        let delay = deleting ? 35 : 55;

        if (!deleting && charIndex === current.length) {
            deleting = true;
            delay = 1800;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(typeStep, delay);
    }

    taglineEl.textContent = '';
    taglineEl.appendChild(document.createTextNode(''));
    taglineEl.appendChild(cursor);
    setTimeout(typeStep, 600);
}

// Drag-to-scroll work rail
const rail = document.getElementById('workRail');
if (rail) {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    rail.addEventListener('pointerdown', e => {
        isDown = true;
        rail.classList.add('dragging');
        startX = e.clientX;
        scrollStart = rail.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
        if (!isDown) return;
        rail.scrollLeft = scrollStart - (e.clientX - startX);
    });
    window.addEventListener('pointerup', () => {
        isDown = false;
        rail.classList.remove('dragging');
    });
}

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 500);
});
toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact form: inline validation + WhatsApp handoff
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const fields = [nameField, emailField, messageField];
    let valid = true;

    fields.forEach(field => {
        const wrapper = field.closest('.field');
        const fieldValid = field.checkValidity();
        wrapper.classList.toggle('invalid', !fieldValid);
        if (!fieldValid) valid = false;
    });

    if (!valid) return;

    const name = encodeURIComponent(nameField.value);
    const email = encodeURIComponent(emailField.value);
    const message = encodeURIComponent(messageField.value);
    const phoneNumber = '201275753325';
    const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank');
});

contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.closest('.field').classList.remove('invalid'));
});
