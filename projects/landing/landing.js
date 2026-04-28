// ===== LOADING OVERLAY =====
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
  }, 1000);
});

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.pageYOffset / windowHeight) * 100;
  scrollProgress.style.width = scrolled + '%';
});

// ===== PARTICLES =====
const particlesContainer = document.getElementById('particles');
const particleCount = 30;

for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 15 + 's';
  particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
  particlesContainer.appendChild(particle);
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu when clicking on links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .service-card, .pricing-card, .testimonial-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ===== PARALLAX EFFECT FOR FLOATING CARDS =====
window.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.floating-card');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  cards.forEach((card, index) => {
    const speed = (index + 1) * 15;
    const xMove = (x - 0.5) * speed;
    const yMove = (y - 0.5) * speed;
    card.style.transform = `translate(${xMove}px, ${yMove}px)`;
  });
});

// ===== BUTTON RIPPLE EFFECT =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== PRICING CARD SELECTION =====
document.querySelectorAll('.pricing-card .btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.pricing-card');
    const plan = card.querySelector('h3').textContent;
    const price = card.querySelector('.amount').textContent;
    showToast(`🎉 You selected the ${plan} plan ($${price}/month)!`, 'success');
  });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.padding = '12px 0';
    navbar.style.background = 'rgba(10, 10, 15, 0.95)';
  } else {
    navbar.style.padding = '20px 0';
    navbar.style.background = 'rgba(10, 10, 15, 0.8)';
  }
  
  lastScroll = currentScroll;
});

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

// Initialize counters when visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', function() {
    const faqItem = this.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Hide and remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ===== CURSOR TRAIL =====
let cursorTrailTimeout;

document.addEventListener('mousemove', (e) => {
  clearTimeout(cursorTrailTimeout);
  
  cursorTrailTimeout = setTimeout(() => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 500);
  }, 50);
});

// ===== CTA BUTTONS =====
document.querySelectorAll('.cta .btn, .hero .btn, .nav-cta, .btn-cta').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.textContent.includes('Start') || this.textContent.includes('Get Started')) {
      e.preventDefault();
      showToast('🚀 Free trial starting soon! We\'ll notify you.', 'success');
    } else if (this.textContent.includes('Contact') || this.textContent.includes('Sales')) {
      e.preventDefault();
      showToast('📞 Our team will contact you shortly!', 'success');
    } else if (this.textContent.includes('Demo')) {
      e.preventDefault();
      showToast('🎬 Demo video coming soon!', 'success');
    }
  });
});

// ===== HERO BUTTONS =====
document.querySelectorAll('.hero .btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.textContent.includes('Get Started')) {
      e.preventDefault();
      document.querySelector('#pricing').scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== FORM VALIDATION (if forms exist) =====
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('✅ Form submitted successfully!', 'success');
    this.reset();
  });
});

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  // ESC to close mobile menu
  if (e.key === 'Escape') {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
  
  // Ctrl/Cmd + K for search (if implemented)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    showToast('🔍 Search feature coming soon!', 'success');
  }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Apply throttle to scroll events
window.addEventListener('scroll', throttle(() => {
  // Scroll-based animations
}, 100));

// ===== CONSOLE MESSAGE =====
console.log('%c🚀 NextLevel Landing Page', 'font-size: 20px; font-weight: bold; color: #6c63ff;');
console.log('%cBuilt with ❤️ by Maaz', 'font-size: 14px; color: #8888aa;');
console.log('%cAll features are working perfectly! 🎉', 'font-size: 12px; color: #22c55e;');

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Landing page initialized successfully!');
  
  // Add animation classes
  setTimeout(() => {
    document.querySelectorAll('.hero-content > *').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'all 0.6s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 100);
});


// ===== NEWSLETTER POPUP =====
setTimeout(() => {
  const newsletterHTML = `
    <div class="newsletter-popup" id="newsletterPopup">
      <button class="newsletter-close" onclick="closeNewsletter()">✕</button>
      <div class="newsletter-icon">
        <i class="fas fa-envelope"></i>
      </div>
      <h3>Stay Updated! 📬</h3>
      <p>Subscribe to get exclusive offers and latest updates</p>
      <form class="newsletter-form" onsubmit="submitNewsletter(event)">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Subscribe Now</button>
      </form>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', newsletterHTML);
  
  setTimeout(() => {
    document.getElementById('newsletterPopup').classList.add('show');
  }, 100);
}, 5000); // Show after 5 seconds

function closeNewsletter() {
  const popup = document.getElementById('newsletterPopup');
  popup.classList.remove('show');
  setTimeout(() => popup.remove(), 500);
}

function submitNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  showToast(`✅ Thanks for subscribing! We'll send updates to ${email}`, 'success');
  closeNewsletter();
}

// ===== VIDEO MODAL =====
function showVideoModal(videoUrl) {
  const modalHTML = `
    <div class="video-modal-overlay" id="videoModal" onclick="closeVideoModal()">
      <div class="video-modal" onclick="event.stopPropagation()">
        <button class="video-close" onclick="closeVideoModal()">✕</button>
        <div class="video-container">
          <iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  setTimeout(() => {
    document.getElementById('videoModal').classList.add('show');
  }, 10);
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }
}

// Add video modal trigger to demo buttons
document.querySelectorAll('.btn').forEach(btn => {
  if (btn.textContent.includes('Demo') || btn.textContent.includes('Watch')) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showVideoModal('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1');
    });
  }
});

// ===== LIVE CHAT WIDGET =====
const chatHTML = `
  <div class="chat-widget">
    <button class="chat-button" id="chatButton">
      <i class="fas fa-comments"></i>
      <span class="chat-badge">1</span>
    </button>
    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">AI</div>
          <div>
            <div><strong>Support Bot</strong></div>
            <div class="chat-status">
              <span class="status-dot"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
        <button class="chat-close-btn" onclick="toggleChat()">✕</button>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-message bot">
          👋 Hi! I'm here to help. How can I assist you today?
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
        <button class="chat-send" onclick="sendMessage()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', chatHTML);

function toggleChat() {
  const chatWindow = document.getElementById('chatWindow');
  const chatBadge = document.querySelector('.chat-badge');
  chatWindow.classList.toggle('show');
  if (chatWindow.classList.contains('show')) {
    chatBadge.style.display = 'none';
  }
}

document.getElementById('chatButton').addEventListener('click', toggleChat);

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (message) {
    // Add user message
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.insertAdjacentHTML('beforeend', `
      <div class="chat-message user">${message}</div>
    `);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Our team will get back to you soon. 😊",
        "That's a great question! Let me help you with that. 🚀",
        "I understand. Would you like to schedule a call with our team? 📞",
        "Absolutely! We'd love to help you with that. ✨",
        "Great! You can also check our FAQ section for more info. 📚"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      messagesContainer.insertAdjacentHTML('beforeend', `
        <div class="chat-message bot">${randomResponse}</div>
      `);
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  }
}

// Send message on Enter key
document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// ===== SCROLL REVEAL ANIMATIONS =====
const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');

const scrollRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      scrollRevealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

scrollRevealElements.forEach(el => {
  scrollRevealObserver.observe(el);
});

// ===== TYPING EFFECT =====
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Apply typing effect to hero title
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
  const originalText = heroTitle.textContent;
  setTimeout(() => {
    typeWriter(heroTitle, originalText, 80);
  }, 1500);
}

// ===== PROGRESS CIRCLES =====
function animateProgressCircle(element, percentage) {
  const circle = element.querySelector('.progress-circle');
  const value = element.querySelector('.progress-value');
  
  let current = 0;
  const increment = percentage / 50;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= percentage) {
      current = percentage;
      clearInterval(timer);
    }
    
    circle.style.background = `conic-gradient(var(--primary) ${current * 3.6}deg, var(--glass) 0deg)`;
    value.textContent = Math.round(current) + '%';
  }, 30);
}

// ===== CONFETTI EFFECT =====
function createConfetti() {
  const colors = ['#6c63ff', '#ff6584', '#00f5ff', '#ffd700'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = '10001';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;
    
    confetti.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight + 20}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => confetti.remove(), duration * 1000);
  }
}

// Trigger confetti on certain actions
document.querySelectorAll('.pricing-card.featured .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    createConfetti();
  });
});

// ===== DARK MODE TOGGLE =====
function toggleDarkMode() {
  document.body.classList.toggle('light-mode');
  const isDark = !document.body.classList.contains('light-mode');
  localStorage.setItem('darkMode', isDark);
  showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'success');
}

// Check saved preference
if (localStorage.getItem('darkMode') === 'false') {
  document.body.classList.add('light-mode');
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Copied to clipboard!', 'success');
  });
}

// ===== SHARE FUNCTIONALITY =====
function shareWebsite() {
  if (navigator.share) {
    navigator.share({
      title: 'NextLevel - Modern Landing Page',
      text: 'Check out this amazing landing page!',
      url: window.location.href
    }).then(() => {
      showToast('✅ Thanks for sharing!', 'success');
    }).catch(() => {
      copyToClipboard(window.location.href);
    });
  } else {
    copyToClipboard(window.location.href);
  }
}

// ===== EASTER EGG =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    createConfetti();
    showToast('🎉 Easter Egg Found! You unlocked confetti mode!', 'success');
    konamiCode = [];
  }
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`⚡ Page loaded in ${(loadTime / 1000).toFixed(2)} seconds`);
  
  if (loadTime > 3000) {
    console.warn('⚠️ Page load time is slow. Consider optimization.');
  }
});

// ===== ANALYTICS TRACKING (Simulated) =====
function trackEvent(category, action, label) {
  console.log(`📊 Event tracked: ${category} - ${action} - ${label}`);
  // In production, integrate with Google Analytics or similar
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('Button', 'Click', btn.textContent.trim());
  });
});

// Track section views
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionName = entry.target.id || entry.target.className;
      trackEvent('Section', 'View', sectionName);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(section => {
  sectionObserver.observe(section);
});

// ===== AUTO-SAVE FORM DATA =====
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  const inputs = form.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    // Load saved data
    const savedValue = localStorage.getItem(`form_${input.name}`);
    if (savedValue) {
      input.value = savedValue;
    }
    
    // Save on input
    input.addEventListener('input', () => {
      localStorage.setItem(`form_${input.name}`, input.value);
    });
  });
  
  // Clear on submit
  form.addEventListener('submit', () => {
    inputs.forEach(input => {
      localStorage.removeItem(`form_${input.name}`);
    });
  });
});

// ===== ENHANCED CONSOLE =====
console.log('%c🎨 Design System', 'font-size: 16px; font-weight: bold; color: #6c63ff;');
console.log('%cColors:', 'font-weight: bold;');
console.log('%c■ Primary: #6c63ff', 'color: #6c63ff;');
console.log('%c■ Secondary: #ff6584', 'color: #ff6584;');
console.log('%c■ Success: #22c55e', 'color: #22c55e;');
console.log('%c\n💡 Tips:', 'font-weight: bold;');
console.log('- Try the Konami Code for a surprise!');
console.log('- All interactions are tracked in console');
console.log('- Form data is auto-saved');

console.log('%c\n✨ All features loaded successfully!', 'font-size: 14px; color: #22c55e; font-weight: bold;');
