/* ========================================
   KME Pest Control - Main JavaScript
   Modern ES6+ Vanilla JavaScript
======================================== */

'use strict';

// ========================================
// GLOBAL VARIABLES & CONFIGURATION
// ========================================

const CONFIG = {
    API_BASE_URL: 'https://pakaranaianai.com/wp-json/wp/v2/',
    ANIMATION_DURATION: 300,
    CAROUSEL_AUTO_PLAY: true,
    CAROUSEL_INTERVAL: 5000,
    SCROLL_OFFSET: 100,
    MOBILE_BREAKPOINT: 768
};

// Global state
const APP_STATE = {
    isMobile: window.innerWidth < CONFIG.MOBILE_BREAKPOINT,
    isMenuOpen: false,
    currentCarouselIndex: 0,
    carouselTimer: null,
    isLoading: false
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit function calls
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function calls
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Check if element is in viewport
 */
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/**
 * Smooth scroll to element
 */
const smoothScrollTo = (element, offset = CONFIG.SCROLL_OFFSET) => {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
};

/**
 * Show loading overlay
 */
const showLoading = () => {
    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        APP_STATE.isLoading = true;
        loadingOverlay.classList.add('active');
    }
};

/**
 * Hide loading overlay
 */
const hideLoading = () => {
    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        APP_STATE.isLoading = false;
        loadingOverlay.classList.remove('active');
    }
};

/**
 * Show notification message
 */
const showNotification = (message, type = 'info') => {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type} active`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
};

// ========================================
// DROPDOWN MENU FUNCTIONALITY
// ========================================

class DropdownMenu {
    constructor() {
        this.dropdowns = document.querySelectorAll('.has-dropdown');
        this.init();
    }
    
    init() {
        this.dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            const submenu = dropdown.querySelector('.dropdown-submenu');
            
            if (link && submenu) {
                // Desktop hover events
                dropdown.addEventListener('mouseenter', () => {
                    submenu.classList.add('active');
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    submenu.classList.remove('active');
                });
                
                // Mobile touch/click events for dropdown toggle
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        // First click opens submenu, second click navigates
                        if (!submenu.classList.contains('active')) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Close other open dropdowns first
                            this.closeAllDropdowns();
                            
                            // Open this dropdown
                            submenu.classList.add('active');
                            dropdown.classList.add('dropdown-open');
                        }
                        // If submenu is already active, allow navigation on second click
                    }
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.has-dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }
    
    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const submenu = dropdown.querySelector('.dropdown-submenu');
            if (submenu) {
                submenu.classList.remove('active');
                dropdown.classList.remove('dropdown-open');
            }
        });
    }
}

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================

class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobile-toggle');
        this.menu = document.getElementById('nav-menu');
        this.links = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on links
            this.links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.main-navigation') && APP_STATE.isMenuOpen) {
                    this.closeMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && APP_STATE.isMenuOpen) {
                    this.closeMenu();
                }
            });
        }
    }
    
    toggleMenu() {
        if (APP_STATE.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        APP_STATE.isMenuOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('mobile-active');
        // Calculate available viewport height below header for scrollable menu
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const maxHeight = Math.max(0, window.innerHeight - headerHeight);
        this.menu.style.maxHeight = `${maxHeight}px`;
        this.menu.style.overflowY = 'auto';
        this.menu.style.webkitOverflowScrolling = 'touch';
        // Ensure body can scroll (we scroll inside menu)
        document.body.style.overflow = '';
    }
    
    closeMenu() {
        APP_STATE.isMenuOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('mobile-active');
        this.menu.style.maxHeight = '';
        this.menu.style.overflowY = '';
        document.body.style.overflow = ''; // Ensure scrolling enabled
    }
}

// ========================================
// CAROUSEL FUNCTIONALITY
// ========================================

class Carousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.container = this.carousel.querySelector('.carousel-container');
        this.slides = this.carousel.querySelectorAll('.cert-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-btn.prev');
        this.nextBtn = this.carousel.querySelector('.carousel-btn.next');
        
        this.currentIndex = 0;
        this.slideWidth = 220; // 200px + 20px gap
        this.visibleSlides = this.getVisibleSlides();
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Add event listeners
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        
        // Touch/swipe support
        this.addTouchSupport();
        
        // Auto play
        if (CONFIG.CAROUSEL_AUTO_PLAY) {
            this.startAutoPlay();
            
            // Pause on hover
            this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Update on resize
        window.addEventListener('resize', debounce(() => {
            this.visibleSlides = this.getVisibleSlides();
            this.updateCarousel();
        }, 250));
        
        // Initial update
        this.updateCarousel();
    }
    
    getVisibleSlides() {
        const containerWidth = this.container.offsetWidth;
        return Math.floor(containerWidth / this.slideWidth);
    }
    
    next() {
        const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
        this.currentIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }
    
    prev() {
        const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
        this.currentIndex = this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
        this.updateCarousel();
    }
    
    updateCarousel() {
        const translateX = -this.currentIndex * this.slideWidth;
        this.container.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        this.updateButtons();
    }
    
    updateButtons() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const maxIndex = Math.max(0, this.slides.length - this.visibleSlides);
        
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        APP_STATE.carouselTimer = setInterval(() => this.next(), CONFIG.CAROUSEL_INTERVAL);
    }
    
    stopAutoPlay() {
        if (APP_STATE.carouselTimer) {
            clearInterval(APP_STATE.carouselTimer);
            APP_STATE.carouselTimer = null;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoPlay();
        });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            if (CONFIG.CAROUSEL_AUTO_PLAY) {
                this.startAutoPlay();
            }
        });
    }
}

// ========================================
// ANIMATED COUNTER
// ========================================

class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-target]');
        this.hasStarted = false;
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        // Throttled scroll listener
        window.addEventListener('scroll', throttle(() => {
            this.checkCounters();
        }, 100));
        
        // Initial check
        this.checkCounters();
    }
    
    checkCounters() {
        if (this.hasStarted) return;
        
        const firstCounter = this.counters[0];
        if (firstCounter && isInViewport(firstCounter)) {
            this.hasStarted = true;
            this.startCounters();
        }
    }
    
    startCounters() {
        this.counters.forEach((counter, index) => {
            const target = parseInt(counter.dataset.target);
            const delay = index * 200; // Stagger animation
            
            setTimeout(() => {
                this.animateCounter(counter, target);
            }, delay);
        });
    }
    
    animateCounter(element, target) {
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas if needed
            const displayValue = target >= 1000 ? 
                Math.floor(current).toLocaleString() : 
                Math.floor(current);
                
            element.textContent = displayValue;
        }, 16);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }
    
    init() {
        // Add CSS for animations
        this.addAnimationStyles();
        
        // Initial check
        this.checkElements();
        
        // Throttled scroll listener
        window.addEventListener('scroll', throttle(() => {
            this.checkElements();
        }, 100));
    }
    
    addAnimationStyles() {
        if (document.getElementById('scroll-animations-css')) return;
        
        const style = document.createElement('style');
        style.id = 'scroll-animations-css';
        style.textContent = `
            [data-animate] {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            [data-animate].animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            [data-animate="fade-left"] {
                transform: translateX(-30px);
            }
            
            [data-animate="fade-right"] {
                transform: translateX(30px);
            }
            
            [data-animate="scale"] {
                transform: scale(0.9);
            }
            
            [data-animate="scale"].animate-in {
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);
    }
    
    checkElements() {
        this.elements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animate-in')) {
                element.classList.add('animate-in');
            }
        });
    }
}

// ========================================
// FORM HANDLING
// ========================================

class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form[data-form]');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            // Hook up date/time business rules for booking form
            if (form.dataset.form === 'booking') {
                this.attachBookingBusinessRules(form);
            }
        });

        // Booking UX: set minimum selectable date to today
        const preferredDateInput = document.getElementById('preferredDate');
        if (preferredDateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            preferredDateInput.min = `${yyyy}-${mm}-${dd}`;
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formType = form.dataset.form;
        const statusBox = form.querySelector('.form-status');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading
        showLoading();
        // Button spinner
        if (submitBtn) { submitBtn.classList.add('loading'); submitBtn.disabled = true; }
        if (statusBox) {
            statusBox.textContent = 'Menghantar...';
            statusBox.className = 'form-status show info';
        }
        
        try {
            // Basic validation
            if (!this.validateForm(form)) {
                hideLoading();
                if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
                if (statusBox) {
                    statusBox.textContent = 'Sila betulkan ralat di atas.';
                    statusBox.className = 'form-status show error';
                }
                return;
            }
            
            // Hantar ke API sebenar (booking) atau simulasi untuk lain-lain
            await this.submitForm(formType, formData);
            
            // Success
            const successMsg = formType === 'booking' ? 'Permintaan tempahan berjaya dihantar!' : 'Mesej anda telah berjaya dihantar!';
            showNotification(successMsg, 'success');
            if (statusBox) {
                statusBox.textContent = successMsg;
                statusBox.className = 'form-status show success';
            }
            // Analytics event for booking
            try {
                if (formType === 'booking' && typeof gtag !== 'undefined') {
                    const svc = formData.get('serviceType') || '(none)';
                    gtag('event', 'booking_submitted', {
                        event_category: 'Booking',
                        event_label: svc,
                        value: 1,
                        transport_type: 'beacon'
                    });
                }
            } catch (_) {}
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Maaf, terdapat ralat. Sila cuba lagi.', 'error');
            if (statusBox) {
                statusBox.textContent = 'Maaf, terdapat ralat. Sila cuba lagi.';
                statusBox.className = 'form-status show error';
            }
        } finally {
            hideLoading();
            if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
        }
    }
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Medan ini diperlukan');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Format emel tidak sah');
                isValid = false;
            }
        });
        
        // Phone validation (Malaysia)
        const phoneFields = form.querySelectorAll('input[type="tel"], input[name="phone"]');
        phoneFields.forEach(field => {
            if (field.value && !this.isValidPhone(field.value)) {
                this.showFieldError(field, 'Nombor telefon Malaysia tidak sah');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        // Normalize: remove non-digits, strip leading +/60/0
        let digits = String(phone).replace(/\D/g, '');
        if (digits.startsWith('60')) {
            digits = digits.slice(2);
        } else if (digits.startsWith('0')) {
            digits = digits.slice(1);
        }
        // Expect Malaysian mobile: 1[0-46-9] and 7-8 digits after
        const msiaRegex = /^1[0-46-9][0-9]{7,8}$/;
        return msiaRegex.test(digits);
    }
    
    async submitForm(formType, formData) {
        if (formType === 'booking') {
            // Map medan borang kepada keperluan endpoint WP kustom
            const fullName = (formData.get('fullName') || '').trim();
            let firstName = fullName;
            let lastName = '';
            if (fullName.includes(' ')) {
                const parts = fullName.split(/\s+/);
                firstName = parts.shift();
                lastName = parts.join(' ');
            }
            const email = (formData.get('email') || '').trim();
            const phone = (formData.get('phone') || '').trim();
            const serviceType = formData.get('serviceType') || '';
            const address = (formData.get('address') || '').trim();
            const preferredDate = formData.get('preferredDate') || '';
            const preferredTime = formData.get('preferredTime') || '';
            const notes = (formData.get('notes') || '').trim();

            const details = [
                serviceType && `Jenis Servis: ${serviceType}`,
                address && `Alamat: ${address}`,
                preferredTime && `Masa Pilihan: ${preferredTime}`,
                notes && `Nota: ${notes}`
            ].filter(Boolean).join('\n');

            const payload = {
                first_name: firstName || fullName,
                last_name: lastName || '-',
                email,
                phone,
                details,
                date: preferredDate
            };

            const endpoint = 'https://pakaranaianai.com/wp-json/kme/v1/booking-form';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errText = 'Ralat pelayan';
                try {
                    const errJson = await response.json();
                    errText = errJson && (errJson.message || JSON.stringify(errJson));
                } catch (_) {}
                throw new Error(errText);
            }

            const result = await response.json();
            if (!result || result.success !== true) {
                throw new Error((result && result.message) || 'Penghantaran gagal');
            }
            return result;
        }

        // Default: simulasi untuk borang lain
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 800);
        });
    }

    attachBookingBusinessRules(form) {
        const dateEl = form.querySelector('#preferredDate');
        const timeEl = form.querySelector('#preferredTime');
        const statusBox = form.querySelector('.form-status');
        const serviceSelect = form.querySelector('#serviceType');
        if (!dateEl || !timeEl) return;

        const SLOT_END = {
            'Pagi (9am-12pm)': 12,
            'Tengahari (12pm-3pm)': 15,
            'Petang (3pm-5pm)': 17
        };

        const updateTimeAvailability = () => {
            const value = dateEl.value;
            let isSunday = false;
            let isToday = false;
            if (value) {
                const d = new Date(value + 'T00:00:00');
                if (!isNaN(d)) {
                    isSunday = d.getDay() === 0; // 0 = Sunday
                    const now = new Date();
                    isToday = d.toDateString() === now.toDateString();
                }
            }
            // Reset disable state
            Array.from(timeEl.options).forEach(opt => { opt.disabled = false; });
            if (isSunday) {
                timeEl.value = '';
                Array.from(timeEl.options).forEach(opt => { opt.disabled = true; });
                if (statusBox) {
                    statusBox.textContent = 'Ahad kami tutup. Sila pilih tarikh lain.';
                    statusBox.className = 'form-status show info';
                }
                return;
            }

            if (isToday) {
                const now = new Date();
                const nowHour = now.getHours() + (now.getMinutes() > 0 ? 0.01 : 0);
                let disabledCount = 0;
                Array.from(timeEl.options).forEach(opt => {
                    const endHour = SLOT_END[opt.value];
                    if (typeof endHour === 'number' && nowHour >= endHour) {
                        opt.disabled = true;
                        disabledCount++;
                    }
                });
                if (disabledCount > 0 && disabledCount < timeEl.options.length) {
                    if (statusBox) {
                        statusBox.textContent = 'Beberapa slot untuk hari ini tidak lagi tersedia.';
                        statusBox.className = 'form-status show info';
                    }
                } else if (disabledCount === timeEl.options.length) {
                    timeEl.value = '';
                    if (statusBox) {
                        statusBox.textContent = 'Semua slot hari ini telah lepas. Sila pilih tarikh lain.';
                        statusBox.className = 'form-status show info';
                    }
                } else if (statusBox) {
                    statusBox.textContent = '';
                    statusBox.className = 'form-status';
                }
            } else if (statusBox) {
                statusBox.textContent = '';
                statusBox.className = 'form-status';
            }
        };

        const prefillService = () => {
            if (!serviceSelect) return;
            const params = new URLSearchParams(window.location.search);
            const raw = params.get('service') || params.get('type') || params.get('serviceType');
            if (!raw) return;
            const v = decodeURIComponent(raw).toLowerCase();
            const map = new Map([
                ['pemeriksaan', 'Pemeriksaan Anai-Anai'],
                ['pemeriksaan anai-anai', 'Pemeriksaan Anai-Anai'],
                ['anai', 'Pemeriksaan Anai-Anai'],
                ['general', 'Kawalan Serangga Umum'],
                ['kawalan serangga umum', 'Kawalan Serangga Umum'],
                ['kelawar', 'Pencegahan Kelawar'],
                ['pencegahan kelawar', 'Pencegahan Kelawar'],
                ['lain', 'Lain-lain'],
                ['lain-lain', 'Lain-lain']
            ]);
            let target = map.get(v) || null;
            if (!target) {
                Array.from(serviceSelect.options).forEach(opt => {
                    if (!target && opt.text.toLowerCase().includes(v)) target = opt.value;
                });
            }
            if (target) {
                serviceSelect.value = target;
            }
        };

        dateEl.addEventListener('change', updateTimeAvailability);
        prefillService();
        updateTimeAvailability();
    }
}

// ========================================
// HEADER SCROLL BEHAVIOR
// ========================================

class HeaderScroll {
    constructor() {
        this.header = document.getElementById('header');
        this.lastScrollY = 0;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateHeader();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    updateHeader() {
        if (this.lastScrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(target);
                }
            });
        });
    }
}

// ========================================
// LAZY LOADING FOR IMAGES
// ========================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            });
            
            this.images.forEach(img => this.observer.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            this.images.forEach(img => this.loadImage(img));
        }
    }
    
    loadImage(img) {
        img.classList.add('loading');
        
        img.addEventListener('load', () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
            img.classList.remove('loading');
            img.classList.add('error');
        });
    }
}

// ========================================
// RESPONSIVE HANDLER
// ========================================

class ResponsiveHandler {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('resize', debounce(() => {
            const wasMobile = APP_STATE.isMobile;
            APP_STATE.isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
            
            // If switching between mobile/desktop, close mobile menu
            if (wasMobile !== APP_STATE.isMobile && APP_STATE.isMenuOpen) {
                const mobileMenu = window.mobileMenu;
                if (mobileMenu) {
                    mobileMenu.closeMenu();
                }
            }
        }, 250));
    }
}

// ========================================
// INITIALIZATION
// ========================================

class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize all components
            window.dropdownMenu = new DropdownMenu();
            window.mobileMenu = new MobileMenu();
            window.carousel = new Carousel('#certifications-carousel');
            window.animatedCounter = new AnimatedCounter();
            window.scrollAnimations = new ScrollAnimations();
            window.formHandler = new FormHandler();
            window.headerScroll = new HeaderScroll();
            window.smoothScroll = new SmoothScroll();
            window.lazyLoader = new LazyLoader();
            window.responsiveHandler = new ResponsiveHandler();
            
            // Initialize call button tracking
            this.initCallButtonTracking();
            
            // Add custom CSS for enhanced functionality
            this.addCustomStyles();
            
            // Mark app as ready
            document.body.classList.add('app-ready');
            
            console.log('KME Pest Control website initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    initCallButtonTracking() {
        // Track mobile call button clicks
        const mobileCallBtn = document.getElementById('mobileCallBtn');
        if (mobileCallBtn) {
            mobileCallBtn.addEventListener('click', function() {
                // Track with Google Analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call_clicked', {
                        event_category: 'Contact',
                        event_label: 'Mobile Call Button',
                        transport_type: 'beacon'
                    });
                }
                
                // Track in console for development
                console.log('Mobile call button clicked:', new Date().toISOString());
            });
        }
        
        // Track header phone clicks
        const headerPhones = document.querySelectorAll('.contact-value');
        headerPhones.forEach(phone => {
            phone.addEventListener('click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call_clicked', {
                        event_category: 'Contact',
                        event_label: 'Header Phone',
                        transport_type: 'beacon'
                    });
                }
                console.log('Header phone clicked:', new Date().toISOString());
            });
        });
    }
    
    addCustomStyles() {
        if (document.getElementById('app-custom-css')) return;
        
        const style = document.createElement('style');
        style.id = 'app-custom-css';
        style.textContent = `
            /* Header scroll behavior */
            #header.scrolled {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
            }
            
            /* Form field errors */
            .field-error {
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 5px;
            }
            
            input.error,
            textarea.error {
                border-color: #dc3545;
            }
            
            /* Notification styles */
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .notification.active {
                transform: translateX(0);
            }
            
            .notification.success {
                background: #28a745;
            }
            
            .notification.error {
                background: #dc3545;
            }
            
            .notification.info {
                background: #17a2b8;
            }
            
            /* Image loading states */
            img.loading {
                opacity: 0.5;
                filter: blur(2px);
            }
            
            img.loaded {
                opacity: 1;
                filter: none;
                transition: opacity 0.3s ease, filter 0.3s ease;
            }
            
            img.error {
                opacity: 0.3;
                filter: grayscale(100%);
            }
            
            /* Carousel button disabled state */
            .carousel-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .carousel-btn:disabled:hover {
                transform: translateY(-50%);
                background: var(--primary-blue);
            }
            
            /* Dropdown menu styles */
            .dropdown-submenu {
                position: absolute;
                top: 100%;
                left: 0;
                background: var(--white);
                min-width: 200px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                border-radius: 8px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                padding: 10px 0;
            }
            
            .dropdown-submenu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .dropdown-submenu a {
                display: block;
                padding: 10px 20px;
                color: var(--dark-gray);
                text-decoration: none;
                transition: background 0.2s ease;
            }
            
            .dropdown-submenu a:hover {
                background: var(--light-gray);
                color: var(--primary-blue);
            }
            
            .has-dropdown {
                position: relative;
            }
            
            /* App ready state */
            body:not(.app-ready) {
                overflow: hidden;
            }
            
            body.app-ready {
                overflow: visible;
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// START APPLICATION
// ========================================

// Initialize the application
window.app = new App();

// Export for external use if needed
window.KMEApp = {
    CONFIG,
    APP_STATE,
    showLoading,
    hideLoading,
    showNotification,
    smoothScrollTo
};
