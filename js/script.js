// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      document.body.style.cursor = 'none';
    }, 2500);
  } else {
    document.body.style.overflow = 'auto';
    document.body.style.cursor = 'none';
  }
});

// Prevent scrolling during load
if (document.getElementById('loader')) {
  document.body.style.overflow = 'hidden';
} else {
  document.body.style.overflow = 'auto';
}
document.body.style.cursor = 'auto';

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Smooth follow for dot
  dotX += (mouseX - dotX) * 0.9;
  dotY += (mouseY - dotY) * 0.9;
  
  // Slower follow for ring
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top = dotY + 'px';
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .btn, .magnetic');

hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ===== STATS COUNTER =====
const statNums = document.querySelectorAll('.stat-num');

const animateStats = () => {
  statNums.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target;
      }
    };
    
    updateCounter();
  });
};

const statsObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== TYPING EFFECT =====
const phrases = [
  'Frontend Developer',
  'HTML & CSS Specialist',
  'JavaScript Learner',
  'UI Enthusiast',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, --charIndex);
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
  }

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => (isDeleting = true), 1800);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(type, isDeleting ? 60 : 100);
}

type();

// ===== SCROLL FADE IN =====
const fadeEls = document.querySelectorAll(
  '.about-card, .skill-item, .project-card, .contact-info, .contact-form'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeEls.forEach(el => observer.observe(el));

// ===== SKILL BARS =====
const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.style.display = 'block';
  this.reset();
  setTimeout(() => (success.style.display = 'none'), 4000);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.style.color = scrollY >= top && scrollY < top + height
        ? 'var(--accent)'
        : '';
    }
  });
});
