// ============================================================
// 황경화 포트폴리오 — main.js
// ============================================================

// 첫 화면에서 자동으로 타이핑되는 문구 (여기만 고치면 됩니다)
const ROTATING_WORDS = [
  'Space Tourism Demand Modeling',
  'XR User Experience Analytics',
  'AI for Policy Decision-Making',
  'Mixed-Methods Research',
];

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 스크롤: 네비게이션 배경 + 진행률 바 ---------- */
  const nav = document.getElementById('siteNav');
  const progress = document.getElementById('scrollProgress');

  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 모바일 메뉴 ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------- 스크롤 리빌 ---------- */
  const revealEls = document.querySelectorAll('.reveal, .section-title');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 70);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 첫 화면 타이핑 효과 ---------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl && ROTATING_WORDS.length) {
    if (reduceMotion) {
      typedEl.textContent = ROTATING_WORDS[0];
    } else {
      let wordIndex = 0, charIndex = 0, deleting = false;
      const type = () => {
        const word = ROTATING_WORDS[wordIndex];
        charIndex = deleting ? charIndex - 1 : charIndex + 1;
        typedEl.textContent = word.slice(0, charIndex);

        let delay = deleting ? 40 : 85;
        if (!deleting && charIndex === word.length) {
          delay = 2000;
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % ROTATING_WORDS.length;
          delay = 340;
        }
        setTimeout(type, delay);
      };
      setTimeout(type, 1400);
    }
  }

  /* ---------- 숫자 카운트업 ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }

    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(el => cio.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- 프로필 사진: 마우스를 따라 살짝 기울어짐 ---------- */
  const photoWrap = document.getElementById('photoWrap');
  if (photoWrap && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const MAX_TILT = 9;   // 최대 기울기(도)
    photoWrap.addEventListener('mousemove', (e) => {
      const r = photoWrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      photoWrap.style.animation = 'none';   // 떠다니는 애니메이션 잠시 정지
      photoWrap.style.transform =
        `rotateY(${px * MAX_TILT * 2}deg) rotateX(${-py * MAX_TILT * 2}deg) scale(1.03)`;
    });
    photoWrap.addEventListener('mouseleave', () => {
      photoWrap.style.transform = '';
      photoWrap.style.animation = '';       // 다시 떠다니게
    });
  }

  /* ---------- 프로젝트 카드: 마우스 위치에 따라 살짝 기울어짐 ---------- */
  const cards = document.querySelectorAll('.project-card');
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `translateY(-8px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- 별자리(파티클) 캔버스 ---------- */
  if (!reduceMotion) {
    initStarField('starCanvas');
    initStarField('starCanvas2');
  }

  function initStarField(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const MAX_PARTICLES = 48;
    const LINK_DIST = 140;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }
    function createParticles() {
      particles = Array.from({ length: MAX_PARTICLES }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.5 + 0.6,
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,163,78,0.72)';
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.11 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }

    resize();
    createParticles();
    requestAnimationFrame(tick);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); createParticles(); }, 200);
    });
  }

});
