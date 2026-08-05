// ============================================================
// 황경화 포트폴리오 — main.js
// ============================================================

// 첫 화면에서 자동으로 타이핑되는 문구 (여기만 고치면 됩니다)
const ROTATING_WORDS = [
  '우주관광 수요 예측 모델',
  'XR 사용자 경험 데이터',
  'AI 기반 정책 의사결정',
  '혼합연구방법론(Mixed-Methods)',
];

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 스크롤 시 네비게이션 배경 + 진행률 바 ---------- */
  const nav = document.getElementById('siteNav');
  const progress = document.getElementById('scrollProgress');

  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 모바일 메뉴 토글 ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------- 스크롤 리빌 애니메이션 ---------- */
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

  /* ---------- 히어로 타이핑 효과 ---------- */
  const typedEl = document.getElementById('typedText');
  if (typedEl && ROTATING_WORDS.length) {
    if (reduceMotion) {
      typedEl.textContent = ROTATING_WORDS[0];
    } else {
      let wordIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const word = ROTATING_WORDS[wordIndex];
        charIndex = deleting ? charIndex - 1 : charIndex + 1;
        typedEl.textContent = word.slice(0, charIndex);

        let delay = deleting ? 45 : 95;

        if (!deleting && charIndex === word.length) {
          delay = 1900;                 // 다 쓰고 잠시 멈춤
          deleting = true;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % ROTATING_WORDS.length;
          delay = 350;
        }
        setTimeout(type, delay);
      };
      setTimeout(type, 1200);          // 히어로 등장 후 시작
    }
  }

  /* ---------- 숫자 카운트업 ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }

    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);       // ease-out
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(el => cio.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- 히어로 별자리(파티클) 캔버스 ---------- */
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
    const MAX_PARTICLES = 46;
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
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.6,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,163,78,0.75)';
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
            ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist / LINK_DIST)})`;
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
