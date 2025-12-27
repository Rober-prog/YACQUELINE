// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Counter Animation =====
const counters = document.querySelectorAll('.stat-number[data-count]');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    });
};

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Trigger counter animation for stats section
            if (entry.target.classList.contains('stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== Reviews Slider - Step by Step Carousel =====
const reviewsTrack = document.querySelector('.reviews-track');
const reviewsSlider = document.querySelector('.reviews-slider');
const prevBtn = document.querySelector('.reviews-nav .prev');
const nextBtn = document.querySelector('.reviews-nav .next');
const dotsContainer = document.querySelector('.reviews-dots');

if (reviewsTrack && reviewsSlider) {
    const reviewCards = reviewsTrack.querySelectorAll('.review-card');
    const totalCards = reviewCards.length;
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Create dots
    reviewCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir a reseña ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    // Function to update the carousel position
    function updateCarousel() {
        const cardWidth = reviewCards[0].offsetWidth + 30; // card width + gap
        const sliderWidth = reviewsSlider.offsetWidth;
        const centerOffset = (sliderWidth - reviewCards[0].offsetWidth) / 2;
        const translateX = -currentIndex * cardWidth + centerOffset;
        
        reviewsTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update active states
        reviewCards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= totalCards) currentIndex = 0;
        if (currentIndex < 0) currentIndex = totalCards - 1;
        updateCarousel();
        resetAutoSlide();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Auto slide every 5 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Pause on hover
    reviewsSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    reviewsSlider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    reviewsSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    }, { passive: true });
    
    reviewsSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoSlide();
    }, { passive: true });
    
    // Handle resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    // Initialize
    updateCarousel();
    startAutoSlide();
}

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.service-card, .about-content, .about-image, .contact-item, .pros-list li');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ===== Video Lazy Loading =====
const video = document.querySelector('.video-section video');
if (video) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });
    
    videoObserver.observe(video);
}

// ===== Add hover effect to service cards =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===== Floating Cards Animation Enhancement =====
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Image Loading Animation =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    }
});

// ===== CTA Button Ripple Effect =====
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===== Schedule Popup =====
function openSchedulePopup() {
    const popup = document.getElementById('schedulePopup');
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSchedulePopup() {
    const popup = document.getElementById('schedulePopup');
    popup.classList.remove('active');
    document.body.style.overflow = '';
}

// Close popup when clicking outside
document.getElementById('schedulePopup')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('schedule-popup-overlay')) {
        closeSchedulePopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSchedulePopup();
    }
});

// ===== Cookie Consent =====
function showCookiePopup() {
    const popup = document.getElementById('cookiePopup');
    if (popup) {
        setTimeout(() => {
            popup.classList.add('active');
        }, 1500);
    }
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    hideCookiePopup();
}

function declineCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    hideCookiePopup();
}

function hideCookiePopup() {
    const popup = document.getElementById('cookiePopup');
    if (popup) {
        popup.classList.remove('active');
    }
}

// Check if user has already made a choice
if (!localStorage.getItem('cookiesAccepted')) {
    showCookiePopup();
}

// ===== Console Welcome Message =====
console.log('%c✨ Yacqueline Burgos Estilistas ✨', 'font-size: 20px; font-weight: bold; color: #b8860b;');
console.log('%cDesarrollado con ❤️', 'font-size: 12px; color: #666;');
