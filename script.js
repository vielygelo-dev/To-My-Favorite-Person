/* ==========================================================================
   TO MY FAVORITE PERSON — script.js
   Organized into small, independent functions. Each one is called once
   from the "INIT" block at the bottom.
   ========================================================================== */

/* ---------- 1. NIGHT SKY: stars + drifting particles on <canvas> ---------- */
function initSky() {
  const canvas = document.getElementById('sky-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, stars, particles;
  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    // Star count scales gently with screen size, capped for performance
    const count = Math.min(140, Math.floor((width * height) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));

    // Soft glowing particles that drift slowly upward
    const particleCount = Math.min(28, Math.floor(width / 40));
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      speed: Math.random() * 0.15 + 0.03,
      drift: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.25 + 0.05
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.phase += s.twinkleSpeed;
      const alpha = s.baseAlpha + Math.sin(s.phase) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(246, 239, 225, ${Math.max(0, alpha)})`;
      ctx.fill();
    });

    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(159, 195, 234, ${p.alpha})`;
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
  if (reduceMotion) draw(); // draw one static frame only
}

/* ---------- 2. FLOATING HEARTS: occasional hearts drifting upward ---------- */
function initFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = '❤';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    heart.style.fontSize = (Math.random() * 0.8 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 6 + 9) + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 16000);
  }

  setInterval(spawnHeart, 2200);
  spawnHeart();
}

/* ---------- 3. NAVIGATION: mobile menu toggle + smooth-scroll links ---------- */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 4. HERO BUTTON: scroll to "Our Story" ---------- */
function initHeroButton() {
  const btn = document.getElementById('open-heart-btn');
  btn.addEventListener('click', () => {
    document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- 5. SCROLL REVEAL: fade sections in as they enter view ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.section, .timeline-item');
  targets.forEach(t => t.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(t => observer.observe(t));
}

/* ---------- 6. GALLERY LIGHTBOX ---------- */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  function openLightbox(item) {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* ---------- 7. REASON CARDS: tap to flip (mobile-friendly; hover works on desktop via CSS) ---------- */
function initReasonCards() {
  document.querySelectorAll('.reason-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

/* ---------- 8. BACKGROUND MUSIC: autoplay on load, loop, mute toggle ---------- */
function initBackgroundMusic() {
  const audio = document.getElementById('bg-audio');
  const toggleBtn = document.getElementById('music-toggle');
  const iconOn = document.getElementById('icon-sound-on');
  const iconOff = document.getElementById('icon-sound-off');

  audio.volume = 0.5; // gentle background level, not full blast

  function showMuted(isMuted) {
    iconOn.style.display = isMuted ? 'none' : 'inline-block';
    iconOff.style.display = isMuted ? 'inline-block' : 'none';
    toggleBtn.setAttribute('aria-pressed', String(isMuted));
    toggleBtn.setAttribute('aria-label', isMuted ? 'Unmute music' : 'Mute music');
  }

  toggleBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    showMuted(audio.muted);
    if (!audio.muted && audio.paused) {
      audio.play().catch(() => {});
    }
  });

  // --- Try to autoplay as soon as the page opens ---
  // Most browsers block audio-with-sound autoplay until the visitor has
  // interacted with the page at least once. We try immediately; if that
  // fails (it usually will, the first time), we fall back to starting
  // playback silently-muted right away, then un-muting on the visitor's
  // very first click/tap/keypress/scroll anywhere on the page — so music
  // still kicks in almost the instant they land and start exploring.
  audio.play().catch(() => {
    audio.muted = true;
    showMuted(true);
    audio.play().catch(() => {
      console.warn('Could not play background music — make sure assets/song.mp3 exists.');
    });

    const unmuteOnFirstInteraction = () => {
      audio.muted = false;
      showMuted(false);
      audio.play().catch(() => {});
      document.removeEventListener('click', unmuteOnFirstInteraction);
      document.removeEventListener('keydown', unmuteOnFirstInteraction);
      document.removeEventListener('touchstart', unmuteOnFirstInteraction);
      document.removeEventListener('scroll', unmuteOnFirstInteraction);
    };
    document.addEventListener('click', unmuteOnFirstInteraction, { once: true });
    document.addEventListener('keydown', unmuteOnFirstInteraction, { once: true });
    document.addEventListener('touchstart', unmuteOnFirstInteraction, { once: true });
    document.addEventListener('scroll', unmuteOnFirstInteraction, { once: true });
  });
}

/* ---------- 9. LOVE LETTER: click envelope to reveal the letter ---------- */
function initLetter() {
  const envelope = document.getElementById('letter-envelope');
  const paper = document.getElementById('letter-paper');

  envelope.addEventListener('click', () => {
    envelope.classList.add('opened');
    paper.hidden = false;
    paper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ---------- 10. SURPRISE SECTION: reveal hidden message ---------- */
function initSurprise() {
  const btn = document.getElementById('surprise-btn');
  const message = document.getElementById('surprise-message');

  btn.addEventListener('click', () => {
    message.hidden = false;
    btn.hidden = true;
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ---------- INIT: run everything once the DOM is ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initSky();
  initFloatingHearts();
  initNav();
  initHeroButton();
  initScrollReveal();
  initGalleryLightbox();
  initReasonCards();
  initBackgroundMusic();
  initLetter();
  initSurprise();
});
