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

/* ---------- 8. SONG PLAYER: play/pause, fake visualizer, progress bar ---------- */
function initSongPlayer() {
  const audio = document.getElementById('song-audio');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const visualizer = document.getElementById('visualizer');
  const progressFill = document.getElementById('song-progress-fill');

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // If assets/song.mp3 hasn't been added yet, playback will fail silently.
        console.warn('Could not play song — make sure assets/song.mp3 exists.');
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    iconPlay.style.display = 'none';
    iconPause.style.display = 'inline-block';
    playPauseBtn.setAttribute('aria-label', 'Pause song');
    visualizer.classList.add('playing');
  });

  audio.addEventListener('pause', () => {
    iconPlay.style.display = 'inline-block';
    iconPause.style.display = 'none';
    playPauseBtn.setAttribute('aria-label', 'Play song');
    visualizer.classList.remove('playing');
  });

  audio.addEventListener('ended', () => {
    progressFill.style.width = '0%';
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
    }
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
  initSongPlayer();
  initLetter();
  initSurprise();
});
