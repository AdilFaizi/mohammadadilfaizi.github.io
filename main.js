/* ================================
   ADIL FAIZI — ePORTFOLIO SCRIPTS
================================ */

// ---- Particle background ----
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.2 + 0.3;
    this.dx = (Math.random() - 0.5) * 0.18;
    this.dy = (Math.random() - 0.5) * 0.18;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  function spawnParticles(n) {
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(140, 130, 255, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  spawnParticles(120);
  draw();
})();

// ---- Navbar scroll effect ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(9, 11, 19, 0.97)';
  } else {
    nav.style.background = 'rgba(9, 11, 19, 0.8)';
  }
});

// ---- Mobile menu ----
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
});

document.getElementById('menuClose').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.remove('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

// ---- Artifact filter ----
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

// ---- Scroll reveal for sections ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Trigger skill bars when skills section is visible
      if (entry.target.id === 'skills') {
        document.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.animationPlayState = 'running';
        });
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Pause skill bars initially
document.querySelectorAll('.skill-fill').forEach(bar => {
  bar.style.animationPlayState = 'paused';
});

document.querySelectorAll('section').forEach(s => observer.observe(s));

// ---- Active nav link highlighting ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = '#a78bfa';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- Smooth card entrance on scroll ----
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.artifact-card, .goal-item, .info-card, .reflection-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  cardObserver.observe(el);
});
