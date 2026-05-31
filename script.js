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
  rx += (mx - rx) * 0.10;
  ry += (my - ry) * 0.10;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

/* ===== SCROLL PROGRESS ===== */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
}, { passive: true });

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

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|/\\$#@%';
const fSize = 14;
let cols  = Math.floor(canvas.width / fSize);
let drops = Array.from({ length: cols }, () => Math.random() * -80);

function drawMatrix() {
  ctx.fillStyle = 'rgba(5,9,19,0.06)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fSize}px 'JetBrains Mono', monospace`;
  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const opacity = Math.random() > 0.5 ? 0.85 : 0.3;
    ctx.fillStyle = `rgba(0,255,136,${opacity})`;
    ctx.fillText(char, i * fSize, y * fSize);
    if (y * fSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 55);

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
  let delay = deleting ? 46 : 75;
  if (!deleting && cIdx === word.length) { delay = 2400; deleting = true; }
  else if (deleting && cIdx === 0)       { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 350; }
  setTimeout(typeRole, delay);
}
typeRole();

/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--g)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));

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
  const step = target / 30;
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n);
    if (n >= target) clearInterval(t);
  }, 36);
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
}, { threshold: 0.07 });

document.querySelectorAll(
  '.pcard, .trait, .tl-item, .cert, .sg, .sec-hdr, .about-grid, .contact-inner'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 5) * 60}ms`;
  revealObs.observe(el);
});

/* ===== CARD 3D TILT ===== */
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 4;
    const rotY =  dx * 4;
    card.style.transform = `translateY(-5px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s ease, border-color .3s, box-shadow .3s';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color .3s, box-shadow .3s';
  });
});

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.22;
    const dy = (e.clientY - cy) * 0.22;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform .4s ease, background .25s, box-shadow .25s, border-color .25s, color .25s';
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'background .25s, box-shadow .25s, border-color .25s, color .25s';
  });
});

/* ===== CERT ROW STAGGER ===== */
document.querySelectorAll('.cert').forEach((cert, i) => {
  cert.style.transitionDelay = `${i * 30}ms`;
});
