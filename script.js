/* ===========================================================
   script.js — Immersive Portfolio Interactions & Animations
   =========================================================== */

(function () {
  'use strict';

  // Initialize Lucide icons
  lucide.createIcons();

  /* ─────────── NEURAL NETWORK CANVAS ─────────── */
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let mouse = { x: -1000, y: -1000 };
  const NODE_COUNT = 40;
  const CONNECT_DIST = 150;
  const MOUSE_DIST = 200;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.4,
        baseOpacity: Math.random() * 0.4 + 0.15,
        hue: Math.random() > 0.5 ? 190 : 265, // blue or purple
      });
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.06;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `hsla(200, 100%, 60%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Nodes + mouse interaction
    for (const node of nodes) {
      const dmx = node.x - mouse.x;
      const dmy = node.y - mouse.y;
      const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
      let opacity = node.baseOpacity;
      let radius = node.radius;

      if (mouseDist < MOUSE_DIST) {
        const factor = 1 - mouseDist / MOUSE_DIST;
        opacity = Math.min(1, opacity + factor * 0.5);
        radius += factor * 2;

        // Draw mouse connections
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `hsla(${node.hue}, 100%, 60%, ${factor * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${node.hue}, 100%, 70%, ${opacity})`;
      ctx.fill();

      // Glow
      if (radius > 1.5) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.hue}, 100%, 70%, ${opacity * 0.08})`;
        ctx.fill();
      }

      // Update position
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -10) node.x = canvas.width + 10;
      if (node.x > canvas.width + 10) node.x = -10;
      if (node.y < -10) node.y = canvas.height + 10;
      if (node.y > canvas.height + 10) node.y = -10;
    }

    requestAnimationFrame(drawNetwork);
  }

  resizeCanvas();
  spawnNodes();
  drawNetwork();

  window.addEventListener('resize', () => { resizeCanvas(); spawnNodes(); });
  document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

  /* ─────────── CURSOR GLOW ─────────── */
  const cursorGlow = document.getElementById('cursor-glow');
  let glowX = 0, glowY = 0, currentGlowX = 0, currentGlowY = 0;

  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
  });

  function animateGlow() {
    currentGlowX += (glowX - currentGlowX) * 0.08;
    currentGlowY += (glowY - currentGlowY) * 0.08;
    cursorGlow.style.left = currentGlowX + 'px';
    cursorGlow.style.top = currentGlowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  /* ─────────── TYPEWRITER EFFECT ─────────── */
  const typedEl = document.getElementById('typed-role');
  const roles = [
    'Agentic AI Developer',
    'Data Scientist',
    'Full-Stack Engineer',
    'Cloud Enthusiast',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typewrite() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typewrite, 2200);
        return;
      }
      setTimeout(typewrite, 70 + Math.random() * 30);
    } else {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typewrite, 400);
        return;
      }
      setTimeout(typewrite, 35);
    }
  }
  setTimeout(typewrite, 1200);

  /* ─────────── MOBILE NAVIGATION ─────────── */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuIsOpen = false;

  mobileToggle.addEventListener('click', () => {
    menuIsOpen = !menuIsOpen;
    mobileMenu.classList.toggle('open', menuIsOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuIsOpen = false;
      mobileMenu.classList.remove('open');
    });
  });

  /* ─────────── ACTIVE NAV HIGHLIGHTING ─────────── */
  const navPills = document.querySelectorAll('.nav-pill');
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 140;
    let current = 'hero';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    navPills.forEach(pill => {
      pill.classList.remove('active');
      if (pill.getAttribute('href') === '#' + current) {
        pill.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ─────────── SCROLL REVEAL ─────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.section-reveal').forEach(el => revealObserver.observe(el));



  /* ─────────── COUNTER ANIMATION ─────────── */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 2200;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ─────────── CONTACT FORM ─────────── */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle><path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      successMsg.classList.remove('hidden');
      form.reset();
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.opacity = '1';
      lucide.createIcons();
      setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }, 1800);
  });

  /* ─────────── SMOOTH SCROLL ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
