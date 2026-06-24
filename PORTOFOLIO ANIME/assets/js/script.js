// ── PARTICLE SYSTEM ──
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function createParticle() {
  const type = Math.random() > 0.6 ? 'ember' : 'dust';
  return {
    x: Math.random() * W,
    y: H + 10,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(Math.random() * 1.2 + 0.3),
    size: type === 'ember' ? Math.random() * 2.5 + 0.5 : Math.random() * 1 + 0.3,
    life: 1,
    decay: Math.random() * 0.003 + 0.001,
    type,
    hue: type === 'ember' ? Math.random() * 30 + 200 : 210,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: (Math.random() - 0.5) * 0.02,
  };
}

for (let i = 0; i < 60; i++) {
  const p = createParticle();
  p.y = Math.random() * H;
  particles.push(p);
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);

  if (particles.length < 80 && Math.random() > 0.6) {
    particles.push(createParticle());
  }

  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.wobble += p.wobbleSpeed;
    p.x += p.vx + Math.sin(p.wobble) * 0.3;
    p.y += p.vy;
    p.life -= p.decay;

    const alpha = p.life * 0.7;
    if (p.type === 'ember') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha * 0.15})`;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,150,255,${alpha * 0.5})`;
      ctx.fill();
    }
  });

  requestAnimationFrame(animParticles);
}
animParticles();

// ── SCROLL ANIMATION ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        const bar = entry.target.querySelector('.skill-bar-fill');
        if (bar) {
          const w = bar.dataset.width;
          setTimeout(() => { bar.style.width = w + '%'; }, 100);
        }
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.anim-item').forEach(el => observer.observe(el));

// ── NAV ACTIVE ──
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--white)' : '';
  });
});
