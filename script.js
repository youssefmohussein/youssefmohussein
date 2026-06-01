/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

/* ===== MATRIX RAIN ===== */
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  cols  = Math.floor(canvas.width / fSize);
  drops = Array.from({ length: cols }, () => Math.random() * -80);
});

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|/\\$#@%^&*';
const fSize = 14;
let cols  = Math.floor(canvas.width / fSize);
let drops = Array.from({ length: cols }, () => Math.random() * -80);

function drawMatrix() {
  ctx.fillStyle = 'rgba(2,4,8,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fSize}px 'JetBrains Mono', monospace`;

  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const opacity = Math.random() > 0.5 ? 0.9 : 0.4;
    ctx.fillStyle = `rgba(0,255,136,${opacity})`;
    ctx.fillText(char, i * fSize, y * fSize);
    if (y * fSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 52);

/* ===== TYPING ANIMATION ===== */
const roles = [
  'Cybersecurity Engineer',
  'SOC Analyst in Training',
  'Penetration Tester',
  'Network Architect',
  'Red Team Mindset',
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeRole() {
  const word = roles[rIdx];
  if (deleting) {
    typedEl.textContent = word.slice(0, --cIdx);
  } else {
    typedEl.textContent = word.slice(0, ++cIdx);
  }

  let delay = deleting ? 48 : 78;
  if (!deleting && cIdx === word.length) { delay = 2200; deleting = true; }
  else if (deleting && cIdx === 0)       { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 320; }

  setTimeout(typeRole, delay);
}
typeRole();

/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ===== HAMBURGER ===== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

/* ===== STATS COUNTER ===== */
function countUp(el) {
  const target = parseInt(el.dataset.count);
  if (isNaN(target)) return;
  let n = 0;
  const step = target / 28;
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n);
    if (n >= target) clearInterval(t);
  }, 38);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.h-stats').forEach(el => statsObs.observe(el));

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.pcard, .trait, .tl-item, .cert, .sg, .sec-hdr, .about-grid'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 55}ms`;
  revealObs.observe(el);
});
