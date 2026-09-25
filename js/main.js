/* ============================================================
   MAIN.JS — everything the site DOES
   ============================================================
   Plain JavaScript. No libraries, nothing to install.

   CONTENTS
     0. Setup
    1. Page load (editorial intro)
     2. Left rail: ticks, playhead, timecode
     3. Scroll: scrubber, sticky nav, active menu link
     4. Hero parallax
     5. Reveal on scroll
     6. Counting numbers
     7. Work filters
     8. Marquee
     9. Mobile menu
    10. Footer year
    11. Background particles
   ============================================================ */

/* ============================================================
   0. SETUP
   ============================================================ */

const $  = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('DOMContentLoaded', () => {
  const intro = $('#intro-overlay');
  if (!intro || prefersReduced) {
    document.body.classList.add('is-open', 'intro-complete');
    if (intro) intro.remove();
    return;
  }

  setTimeout(() => {
    intro.classList.add('fade-out');
    document.body.classList.add('is-open', 'intro-complete');
  }, 800);
  setTimeout(() => {
    intro.style.pointerEvents = 'none';
    intro.style.display = 'none';
    intro.remove();
  }, 2300);
});

/* ============================================================
   1. LEFT RAIL — ticks, playhead and timecode
   ============================================================
   The ruler on the left edge. The timecode counts up as you
   scroll, like the playhead position in an editing timeline.
   ============================================================ */

const railTicks    = $('#railTicks');
const railPlayhead = $('#railPlayhead');
const railTimecode = $('#railTimecode');

// Draw 40 small tick marks down the ruler, every 5th one longer.
if (railTicks) {
  const TICKS = 40;
  let html = '';
  for (let i = 0; i <= TICKS; i++) {
    const isMajor = i % 5 === 0;
    html += `<span style="top:${(i / TICKS) * 100}%; width:${isMajor ? 18 : 9}px; opacity:${isMajor ? 1 : .5}"></span>`;
  }
  railTicks.innerHTML = html;
}

// Turn a 0–1 scroll progress into a timecode string: HH:MM:SS:FF
// We pretend the whole page is a 2-minute clip running at 24fps.
function toTimecode(progress) {
  const TOTAL_SECONDS = 120;
  const FPS = 24;
  const totalFrames = Math.floor(progress * TOTAL_SECONDS * FPS);
  const frames  = totalFrames % FPS;
  const seconds = Math.floor(totalFrames / FPS) % 60;
  const minutes = Math.floor(totalFrames / (FPS * 60)) % 60;
  const hours   = Math.floor(totalFrames / (FPS * 3600));
  const pad = n => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}


/* ============================================================
   4. SCROLL — scrubber, sticky nav, active menu link
   ============================================================ */

const scrubberFill = $('#scrubberFill');
const nav          = $('#nav');
const navAnchors   = $$('#navLinks a[href^="#"]');
const sections     = $$('main section[id]');

let lastScroll = 0;   // used by the marquee further down

function onScroll() {
  const y       = window.scrollY;
  const height  = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? Math.min(y / height, 1) : 0;

  // a) the thin bar at the top fills up
  if (scrubberFill) scrubberFill.style.width = (progress * 100) + '%';

  // b) the playhead slides down the ruler + the timecode updates
  if (railPlayhead) railPlayhead.style.top = (progress * 100) + '%';
  if (railTimecode) railTimecode.textContent = toTimecode(progress);

  // c) the nav gets a background once you leave the hero
  if (nav) nav.classList.toggle('scrolled', y > window.innerHeight * 0.6);

  // d) highlight the menu link for whichever section you're looking at
  let current = '';
  sections.forEach(section => {
    if (y >= section.offsetTop - 140) current = section.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('is-current', a.getAttribute('href') === '#' + current);
  });

  lastScroll = y;
}

// requestAnimationFrame keeps scrolling smooth by only doing this
// work once per screen refresh instead of on every scroll event.
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => { onScroll(); parallax(); ticking = false; });
    ticking = true;
  }
}, { passive: true });


/* ============================================================
   5. HERO PARALLAX
   ============================================================
   Anything with data-parallax="0.18" drifts slower than the page.
   A bigger number = more movement. 0 = no movement.
   ============================================================ */

const parallaxItems = $$('[data-parallax]');

function parallax() {
  if (prefersReduced) return;
  const y = window.scrollY;
  parallaxItems.forEach(el => {
    const strength = parseFloat(el.dataset.parallax) || 0;
    // only move it while it's still roughly on screen
    if (y < window.innerHeight * 1.4) {
      el.style.transform = `translate3d(0, ${y * strength}px, 0)`;
    }
  });
}


/* ============================================================
   6. REVEAL ON SCROLL
   ============================================================
   IntersectionObserver watches elements and tells us the moment
   they enter the screen. We add .is-in and CSS does the wipe.
   To animate something new, just add class="reveal" to it.
   ============================================================ */

const revealItems = $$('.reveal');

if (prefersReduced) {
  revealItems.forEach(el => el.classList.add('is-in'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);   // animate once only
      }
    });
  }, {
    // fire when the element is 12% up from the bottom of the screen
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.08
  });

  revealItems.forEach(el => revealObserver.observe(el));
}


/* ============================================================
   7. COUNTING NUMBERS
   ============================================================
   <dd class="counter" data-count="120">0</dd> counts 0 -> 120
   the first time it scrolls into view.
   ============================================================ */

const counters = $$('.counter');

if (counters.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;

      if (prefersReduced) { el.textContent = target; countObserver.unobserve(el); return; }

      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);          // slows down at the end
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => countObserver.observe(el));
}


/* ============================================================
   7. WORK FILTERS
   ============================================================
   Simple, reliable filtering for the hardcoded cards.
   ============================================================ */

const filterButtons = $$('.filter');
const cards = $$('#workGrid .card');
const gridEmpty = $('#gridEmpty');
const videos = $$('#workGrid video');
const audioButtons = $$('.audio-toggle-btn');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const want = button.dataset.filter;

    filterButtons.forEach(b => b.classList.toggle('is-active', b === button));

    let shown = 0;
    cards.forEach(card => {
      const match = want === 'all' || card.dataset.cat === want;
      card.classList.toggle('is-hidden', !match);
      if (match) shown++;
    });

    if (gridEmpty) gridEmpty.hidden = shown !== 0;
  });
});

audioButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetVideo = button.closest('.video-card').querySelector('video');
    videos.forEach(otherVideo => {
      otherVideo.muted = otherVideo !== targetVideo;
    });
    audioButtons.forEach(otherButton => {
      if (otherButton !== button) otherButton.textContent = '🔊 Click for Audio';
    });
    targetVideo.muted = !targetVideo.muted;
    button.textContent = targetVideo.muted ? '🔊 Click for Audio' : '🔊 Sound On (Click to Mute)';
    targetVideo.play().catch(() => {});
  });
});


/* ============================================================
   8. MARQUEE
   ============================================================
   The strip of words that drifts sideways, and speeds up
   while you're scrolling.
   ============================================================ */

const marqueeTrack = $('#marqueeTrack');

if (marqueeTrack && !prefersReduced) {
  // Duplicate the words so the loop never shows a gap.
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;

  let offset = 0;
  let lastY  = window.scrollY;

  function driftMarquee() {
    const half = marqueeTrack.scrollWidth / 2;

    // base speed, plus a boost based on how fast you're scrolling
    const scrollDelta = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;

    offset -= 0.4 + Math.min(scrollDelta * 0.25, 6);
    if (Math.abs(offset) >= half) offset = 0;      // loop back around

    marqueeTrack.style.transform = `translate3d(${offset}px,0,0)`;
    requestAnimationFrame(driftMarquee);
  }
  requestAnimationFrame(driftMarquee);
}


/* ============================================================
   9. MOBILE MENU
   ============================================================ */

const navToggle = $('#navToggle');
const navLinks  = $('#navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // close the menu after tapping a link
  navAnchors.forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}


/* ============================================================
   10. FOOTER YEAR — updates itself every January
   ============================================================ */

const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


const bgCanvas = document.getElementById('bg-canvas');

if (bgCanvas) {
  const ctx = bgCanvas.getContext('2d');
  const particles = [];
  const particleCount = 110;
  const fieldRadius = 180;
  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    previousX: window.innerWidth / 2,
    previousY: window.innerHeight / 2,
    velocityX: 0,
    velocityY: 0,
    active: false
  };

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    bgCanvas.width = window.innerWidth * ratio;
    bgCanvas.height = window.innerHeight * ratio;
    bgCanvas.style.width = `${window.innerWidth}px`;
    bgCanvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticle(index) {
    const homeX = Math.random() * window.innerWidth;
    const homeY = Math.random() * window.innerHeight;
    return {
      homeX,
      homeY,
      x: homeX,
      y: homeY,
      velocityX: 0,
      velocityY: 0,
      radius: 2,
      color: '#0F6E6E'
    };
  }

  function resetParticles() {
    particles.length = 0;
    for (let index = 0; index < particleCount; index++) particles.push(createParticle(index));
  }

  window.addEventListener('mousemove', (event) => {
    mouse.velocityX = event.clientX - mouse.previousX;
    mouse.velocityY = event.clientY - mouse.previousY;
    mouse.previousX = event.clientX;
    mouse.previousY = event.clientY;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function drawParticles() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const cursorSpeed = Math.min(Math.hypot(mouse.velocityX, mouse.velocityY), 32);
    const wakeStrength = cursorSpeed / 32;

    particles.forEach((particle, index) => {
      const toCursorX = particle.x - mouse.x;
      const toCursorY = particle.y - mouse.y;
      const distance = Math.hypot(toCursorX, toCursorY) || 1;
      const falloff = Math.max(0, 1 - distance / fieldRadius);
      const smoothFalloff = falloff * falloff * (3 - 2 * falloff);

      if (mouse.active && distance < fieldRadius) {
        const repulsion = (0.22 + wakeStrength * 0.28) * smoothFalloff;
        particle.velocityX += (toCursorX / distance) * repulsion;
        particle.velocityY += (toCursorY / distance) * repulsion;
        particle.velocityX += (mouse.velocityX / 32) * smoothFalloff * 0.12;
        particle.velocityY += (mouse.velocityY / 32) * smoothFalloff * 0.12;
      }

      particle.velocityX += (particle.homeX - particle.x) * 0.03;
      particle.velocityY += (particle.homeY - particle.y) * 0.03;
      particle.velocityX *= 0.88;
      particle.velocityY *= 0.88;
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = 0.2;
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex++) {
        const other = particles[otherIndex];
        const distanceX = particle.x - other.x;
        const distanceY = particle.y - other.y;
        const distanceBetween = Math.hypot(distanceX, distanceY);
        if (distanceBetween < 120) {
          ctx.beginPath();
          ctx.strokeStyle = '#18A7A7';
          ctx.globalAlpha = 0.15;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    mouse.velocityX *= 0.9;
    mouse.velocityY *= 0.9;
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  resetParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    resetParticles();
  });
}

onScroll();
