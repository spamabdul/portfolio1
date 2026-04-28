// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// Cart functionality
let cartCount = 0;
let cartItems = [];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  const cartCountEl = document.querySelector('.cart-count');
  const cartBtn = document.querySelector('.cart-btn');
  const addToCartBtns = document.querySelectorAll('.btn-add-cart');
  
  console.log('🛒 Cart System Initialized');
  console.log('Cart elements found:', {
    cartCountEl: !!cartCountEl,
    cartBtn: !!cartBtn,
    addToCartBtns: addToCartBtns.length
  });
  
  // Make sure cart count is visible
  if (cartCountEl) {
    cartCountEl.style.display = 'flex';
    console.log('✅ Cart counter is visible');
  }
  
  // Add to cart functionality
  addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get product details
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.price-new').textContent;
      
      // Add to cart
      cartCount++;
      cartItems.push({ name: productName, price: productPrice });
      
      console.log('✅ Item Added:', productName, '- Count:', cartCount);
      
      // Update cart count with animation
      if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.classList.add('show');
        
        // Animate cart button
        cartBtn.style.transform = 'scale(1.2)';
        cartBtn.style.background = 'rgba(34, 197, 94, 0.2)';
        
        setTimeout(() => {
          cartBtn.style.transform = 'scale(1)';
          cartBtn.style.background = '';
          cartCountEl.classList.remove('show');
        }, 400);
      }
      
      // Change button text and color
      const originalHTML = this.innerHTML;
      
      this.innerHTML = '<i class="fas fa-check"></i> Added!';
      this.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      this.style.color = '#fff';
      this.disabled = true;
      
      // Show success notification
      showNotification(`✅ ${productName} added to cart!`);
      
      // Reset button after 2 seconds
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.background = '';
        this.style.color = '';
        this.disabled = false;
      }, 2000);
    });
  });
  
  // Cart button click - show cart items
  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (cartCount === 0) {
        showNotification('🛒 Your cart is empty!\nAdd some products to get started.', 'info');
      } else {
        showCartModal();
      }
    });
  }
});

// Show notification
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.cart-notification');
  if (existing) existing.remove();
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `cart-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Show cart modal
function showCartModal() {
  let cartHTML = `
    <div class="cart-modal-overlay" onclick="closeCartModal()">
      <div class="cart-modal" onclick="event.stopPropagation()">
        <div class="cart-modal-header">
          <h3>🛒 Your Cart (${cartCount} items)</h3>
          <button class="cart-close" onclick="closeCartModal()">✕</button>
        </div>
        <div class="cart-modal-body">
  `;
  
  let total = 0;
  cartItems.forEach((item, index) => {
    const price = parseFloat(item.price.replace('$', ''));
    total += price;
    cartHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${index + 1}. ${item.name}</strong>
          <span>${item.price}</span>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
  
  cartHTML += `
        </div>
        <div class="cart-modal-footer">
          <div class="cart-total">
            <strong>Total:</strong>
            <span>$${total.toFixed(2)}</span>
          </div>
          <button class="btn btn-primary" onclick="checkout()">Checkout</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', cartHTML);
  setTimeout(() => {
    document.querySelector('.cart-modal-overlay').classList.add('show');
  }, 10);
}

// Close cart modal
function closeCartModal() {
  const overlay = document.querySelector('.cart-modal-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  }
}

// Remove cart item
function removeCartItem(index) {
  const item = cartItems[index];
  cartItems.splice(index, 1);
  cartCount--;
  
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
  }
  
  showNotification(`🗑️ ${item.name} removed from cart`);
  closeCartModal();
  
  if (cartCount > 0) {
    setTimeout(() => showCartModal(), 300);
  }
}

// Checkout
function checkout() {
  if (cartCount === 0) {
    showNotification('❌ Your cart is empty!', 'error');
    return;
  }
  
  // Calculate total
  let total = 0;
  cartItems.forEach(item => {
    total += parseFloat(item.price.replace('$', ''));
  });
  
  // Show checkout confirmation
  showNotification('🎉 Order placed successfully!\nTotal: $' + total.toFixed(2), 'success');
  
  // Clear cart
  cartItems = [];
  cartCount = 0;
  
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = '0';
  }
  
  closeCartModal();
  
  // Show thank you message after delay
  setTimeout(() => {
    showThankYouModal(total);
  }, 500);
}

// Show thank you modal
function showThankYouModal(total) {
  const modalHTML = `
    <div class="cart-modal-overlay" onclick="closeThankYouModal()">
      <div class="thank-you-modal" onclick="event.stopPropagation()">
        <div class="thank-you-icon">✅</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase!</p>
        <div class="order-summary">
          <div class="summary-row">
            <span>Total Amount:</span>
            <strong>$${total.toFixed(2)}</strong>
          </div>
          <div class="summary-row">
            <span>Order ID:</span>
            <strong>#${Math.random().toString(36).substr(2, 9).toUpperCase()}</strong>
          </div>
        </div>
        <p class="thank-you-message">We'll send you an email confirmation shortly.</p>
        <button class="btn btn-primary" onclick="closeThankYouModal()">Continue Shopping</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  setTimeout(() => {
    document.querySelector('.cart-modal-overlay').classList.add('show');
  }, 10);
}

// Close thank you modal
function closeThankYouModal() {
  const overlay = document.querySelector('.cart-modal-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  }
}

// Smooth scroll
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Scroll reveal animation
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.product-card, .benefit-card, .review-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
});

// Newsletter
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter');
  if (newsletterForm) {
    const newsletterBtn = newsletterForm.querySelector('button');
    const newsletterInput = newsletterForm.querySelector('input');
    
    newsletterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (newsletterInput.value.trim() === '') {
        alert('Please enter your email address!');
        return;
      }
      
      newsletterBtn.innerHTML = '<i class="fas fa-check"></i>';
      newsletterBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      
      setTimeout(() => {
        newsletterInput.value = '';
        newsletterBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        newsletterBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
        alert('✅ Thank you for subscribing!');
      }, 1500);
    });
  }
});


// Product hover 3D effect
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar.style.padding = '12px 0';
    navbar.style.background = 'rgba(10, 10, 15, 0.95)';
  } else {
    navbar.style.padding = '16px 0';
    navbar.style.background = 'rgba(10, 10, 15, 0.8)';
  }
  
  lastScroll = currentScroll;
});

// Search button functionality
const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    alert('Search functionality coming soon! 🔍');
  });
}

// Hero buttons
document.querySelectorAll('.hero .btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.textContent.includes('Shop Now')) {
      document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
    } else if (this.textContent.includes('Learn More')) {
      document.querySelector('#benefits').scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Product quick view (optional enhancement)
document.querySelectorAll('.product-card h3').forEach(title => {
  title.style.cursor = 'pointer';
  title.addEventListener('click', function() {
    const productName = this.textContent;
    const productPrice = this.closest('.product-card').querySelector('.price-new').textContent;
    alert(`${productName}\nPrice: ${productPrice}\n\nClick "Add to Cart" to purchase! 🛒`);
  });
});

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stat = entry.target;
      const text = stat.textContent;
      const number = parseInt(text.replace(/\D/g, ''));
      
      if (number) {
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= number) {
            stat.textContent = text;
            clearInterval(timer);
          } else {
            stat.textContent = Math.floor(current) + (text.includes('%') ? '%' : text.includes('K') ? 'K+' : '');
          }
        }, 30);
      }
      
      statsObserver.unobserve(stat);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats strong').forEach(stat => {
  statsObserver.observe(stat);
});

// Add loading animation for images
window.addEventListener('load', () => {
  document.querySelectorAll('.product-bottle, .bottle-3d').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.8)';
    setTimeout(() => {
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
    }, 100);
  });
});


// Wishlist functionality
let wishlistItems = [];

document.addEventListener('DOMContentLoaded', function() {
  // Add wishlist buttons to products
  document.querySelectorAll('.product-card').forEach(card => {
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'wishlist-btn';
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
    wishlistBtn.title = 'Add to Wishlist';
    
    card.querySelector('.product-img').appendChild(wishlistBtn);
    
    wishlistBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleWishlist(card, this);
    });
  });
  
  // Add quick view buttons
  document.querySelectorAll('.product-card').forEach(card => {
    const quickViewBtn = document.createElement('button');
    quickViewBtn.className = 'quick-view-btn';
    quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Quick View';
    
    card.querySelector('.product-img').appendChild(quickViewBtn);
    
    quickViewBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showQuickView(card);
    });
  });
});

// Toggle wishlist
function toggleWishlist(card, btn) {
  const productName = card.querySelector('h3').textContent;
  const icon = btn.querySelector('i');
  
  if (icon.classList.contains('far')) {
    // Add to wishlist
    icon.classList.remove('far');
    icon.classList.add('fas');
    btn.classList.add('active');
    wishlistItems.push(productName);
    showNotification(`💖 ${productName} added to wishlist!`);
  } else {
    // Remove from wishlist
    icon.classList.remove('fas');
    icon.classList.add('far');
    btn.classList.remove('active');
    wishlistItems = wishlistItems.filter(item => item !== productName);
    showNotification(`${productName} removed from wishlist`);
  }
}

// Quick view modal
function showQuickView(card) {
  const productName = card.querySelector('h3').textContent;
  const productCategory = card.querySelector('.product-category').textContent;
  const productDesc = card.querySelector('p').textContent;
  const productPrice = card.querySelector('.price-new').textContent;
  const productImg = card.querySelector('.product-img').style.background;
  
  const modalHTML = `
    <div class="cart-modal-overlay" onclick="closeQuickView()">
      <div class="quick-view-modal" onclick="event.stopPropagation()">
        <button class="cart-close" onclick="closeQuickView()">✕</button>
        <div class="quick-view-content">
          <div class="quick-view-img" style="background:${productImg}">
            <div class="product-bottle">
              <div class="mini-bottle"></div>
            </div>
          </div>
          <div class="quick-view-info">
            <span class="product-category">${productCategory}</span>
            <h2>${productName}</h2>
            <div class="product-rating">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <span>(4.9)</span>
            </div>
            <p>${productDesc}</p>
            <div class="quick-view-price">${productPrice}</div>
            <div class="quick-view-features">
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>100% Natural</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>Cruelty Free</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>Organic</span>
              </div>
            </div>
            <button class="btn btn-primary btn-full" onclick="addToCartFromQuickView('${productName}', '${productPrice}')">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  setTimeout(() => {
    document.querySelector('.cart-modal-overlay').classList.add('show');
  }, 10);
}

function closeQuickView() {
  const overlay = document.querySelector('.cart-modal-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  }
}

function addToCartFromQuickView(name, price) {
  cartCount++;
  cartItems.push({ name, price });
  
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
    cartCountEl.classList.add('show');
    
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    cartBtn.style.background = 'rgba(34, 197, 94, 0.2)';
    
    setTimeout(() => {
      cartBtn.style.transform = 'scale(1)';
      cartBtn.style.background = '';
      cartCountEl.classList.remove('show');
    }, 400);
  }
  
  showNotification(`✅ ${name} added to cart!`);
  closeQuickView();
}

// Product filter
document.addEventListener('DOMContentLoaded', function() {
  const productsSection = document.querySelector('.products .container');
  
  const filterHTML = `
    <div class="product-filters">
      <button class="filter-btn active" data-filter="all">All Products</button>
      <button class="filter-btn" data-filter="bestseller">Bestsellers</button>
      <button class="filter-btn" data-filter="new">New Arrivals</button>
      <button class="filter-btn" data-filter="hot">Hot Deals</button>
    </div>
  `;
  
  const sectionHeader = productsSection.querySelector('.section-header');
  sectionHeader.insertAdjacentHTML('afterend', filterHTML);
  
  // Filter functionality
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      const products = document.querySelectorAll('.product-card');
      
      products.forEach(product => {
        if (filter === 'all') {
          product.style.display = 'block';
          setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
          }, 10);
        } else {
          const badge = product.querySelector('.product-badge');
          if (badge && badge.textContent.toLowerCase().includes(filter)) {
            product.style.display = 'block';
            setTimeout(() => {
              product.style.opacity = '1';
              product.style.transform = 'translateY(0)';
            }, 10);
          } else {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
              product.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });
});

// Promo code functionality
document.addEventListener('DOMContentLoaded', function() {
  const promoCodes = {
    'WELCOME10': 10,
    'SAVE20': 20,
    'FIRST50': 50
  };
  
  window.applyPromoCode = function() {
    const input = document.querySelector('.promo-input');
    if (!input) return;
    
    const code = input.value.toUpperCase().trim();
    
    if (promoCodes[code]) {
      const discount = promoCodes[code];
      showNotification(`🎉 Promo code applied! ${discount}% discount`, 'success');
      
      // Update total in cart
      const totalEl = document.querySelector('.cart-total span');
      if (totalEl) {
        const currentTotal = parseFloat(totalEl.textContent.replace('$', ''));
        const newTotal = currentTotal - (currentTotal * discount / 100);
        totalEl.textContent = '$' + newTotal.toFixed(2);
      }
    } else {
      showNotification('❌ Invalid promo code', 'error');
    }
  };
});

// Add promo code to cart modal
const originalShowCartModal = showCartModal;
showCartModal = function() {
  originalShowCartModal();
  
  const footer = document.querySelector('.cart-modal-footer');
  if (footer && !footer.querySelector('.promo-section')) {
    const promoHTML = `
      <div class="promo-section">
        <input type="text" class="promo-input" placeholder="Enter promo code">
        <button class="btn-promo" onclick="applyPromoCode()">Apply</button>
      </div>
    `;
    footer.insertAdjacentHTML('afterbegin', promoHTML);
  }
};

// Image zoom on hover
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.product-img').forEach(img => {
    img.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    img.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
});

// Scroll to top on page load
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
