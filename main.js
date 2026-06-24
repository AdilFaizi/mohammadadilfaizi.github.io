/* ================================
   ADIL FAIZI — ePORTFOLIO
   Warm Engineering Terminal Theme
================================ */

// ============================================================
// CIRCUIT GRID BACKGROUND
// ============================================================
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  // Grid lines
  const CELL = 60;
  // Animated particles along grid paths
  const pulses = [];
  const NUM_PULSES = 18;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomGridX() { return Math.round(Math.random() * Math.floor(W / CELL)) * CELL; }
  function randomGridY() { return Math.round(Math.random() * Math.floor(H / CELL)) * CELL; }

  function makePulse() {
    const horiz = Math.random() > 0.5;
    const startX = randomGridX();
    const startY = randomGridY();
    const length = (Math.floor(Math.random() * 4) + 2) * CELL;
    return {
      x: startX, y: startY,
      horiz,
      length,
      progress: 0,
      speed: 0.004 + Math.random() * 0.006,
      color: Math.random() > 0.6 ? '#FF6A1C' : '#FFAE56',
      alpha: 0.4 + Math.random() * 0.4,
      startX, startY,
    };
  }

  for (let i = 0; i < NUM_PULSES; i++) {
    const p = makePulse();
    p.progress = Math.random(); // stagger starts
    pulses.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ── Static grid ──
    ctx.strokeStyle = 'rgba(255, 174, 86, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += CELL) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += CELL) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // ── Grid node dots ──
    ctx.fillStyle = 'rgba(255, 174, 86, 0.07)';
    for (let x = 0; x < W; x += CELL) {
      for (let y = 0; y < H; y += CELL) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── Animated pulses ──
    pulses.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1) {
        Object.assign(p, makePulse());
        p.progress = 0;
      }

      const t = p.progress;
      const dist = t * p.length;
      const headX = p.horiz ? p.startX + dist : p.startX;
      const headY = p.horiz ? p.startY : p.startY + dist;

      // Trail
      const trailLen = Math.min(dist, CELL * 1.5);
      const tailX = p.horiz ? headX - trailLen : headX;
      const tailY = p.horiz ? headY : headY - trailLen;

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, 'rgba(255,106,28,0)');
      grad.addColorStop(1, p.color);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = p.alpha;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Head glow dot
      ctx.beginPath();
      ctx.arc(headX, headY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Outer glow
      ctx.beginPath();
      ctx.arc(headX, headY, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,106,28,0.08)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(14, 10, 6, 0.97)';
  } else {
    nav.style.background = 'rgba(14, 10, 6, 0.85)';
  }
});

// ============================================================
// MOBILE MENU
// ============================================================
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
});
document.getElementById('menuClose').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.remove('open');
});
document.querySelectorAll('.mob-link, .mob-sub-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

// ============================================================
// ARTIFACT FILTER
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.artifact-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(s => observer.observe(s));

// Pause skill bars initially, trigger on scroll
document.querySelectorAll('.skill-fill').forEach(bar => {
  bar.style.animationPlayState = 'paused';
});
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.animationPlayState = 'running';
      });
      skillObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
const interestsSection = document.getElementById('interests');
if (interestsSection) skillObserver.observe(interestsSection);

// ============================================================
// ACTIVE NAV HIGHLIGHT
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = '#FFAE56';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ============================================================
// CARD ENTRANCE ANIMATION
// ============================================================
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 70);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.artifact-card, .goal-item, .info-card, .reflection-item, .edu-entry').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  cardObserver.observe(el);
});

// ============================================================
// TERMINAL TYPEWRITER on hero roles line
// ============================================================
const rolesEl = document.querySelector('.hero-roles');
if (rolesEl) {
  const lines = [
    '> Electrical Engineering Student @ York University',
    '> Co-op @ Hydro One · Distribution Investment Planning',
    '> Future P.Eng. · Power Systems · HESS Research',
  ];
  let lineIdx = 0, charIdx = 0, deleting = false, pauseTimer = null;

  function type() {
    const current = lines[lineIdx];
    if (!deleting) {
      charIdx++;
      rolesEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        clearTimeout(pauseTimer);
        pauseTimer = setTimeout(type, 2200);
        return;
      }
    } else {
      charIdx--;
      rolesEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(type, deleting ? 28 : 48);
  }
  setTimeout(type, 1000);
}
