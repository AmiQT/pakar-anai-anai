/* ========================================
   KME Pest Control - Main JavaScript
   Modern ES6+ Vanilla JavaScript
======================================== */

'use strict';

// ========================================
// GLOBAL VARIABLES & CONFIGURATION
// ========================================

const CONFIG = {
    API_BASE_URL: '',
    ANIMATION_DURATION: 300,
    CAROUSEL_AUTO_PLAY: true,
    CAROUSEL_INTERVAL: 5000,
    SCROLL_OFFSET: 100,
    MOBILE_BREAKPOINT: 768
};

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

const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const smoothScrollTo = (element, offset = CONFIG.SCROLL_OFFSET) => {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
};

const showLoading = () => {
    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        APP_STATE.isLoading = true;
        loadingOverlay.classList.add('active');
    }
};

const hideLoading = () => {
    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        APP_STATE.isLoading = false;
        loadingOverlay.classList.remove('active');
    }
};

const showNotification = (message, type = 'info') => {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type} active`;
    
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
                dropdown.addEventListener('mouseenter', () => {
                    submenu.classList.add('active');
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    submenu.classList.remove('active');
                });
                
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        if (!submenu.classList.contains('active')) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.closeAllDropdowns();
                            submenu.classList.add('active');
                            dropdown.classList.add('dropdown-open');
                        }
                    }
                });
            }
        });
        
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
        this.slideWidth = 220;
        this.visibleSlides = this.getVisibleSlides();
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        
        this.addTouchSupport();
        
        if (CONFIG.CAROUSEL_AUTO_PLAY) {
            this.startAutoPlay();
            this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        window.addEventListener('resize', debounce(() => {
            this.visibleSlides = this.getVisibleSlides();
            this.updateCarousel();
        }, 250));
        
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
        
        window.addEventListener('scroll', throttle(() => {
            this.checkCounters();
        }, 100));
        
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
            const delay = index * 200;
            setTimeout(() => {
                this.animateCounter(counter, target);
            }, delay);
        });
    }
    
    animateCounter(element, target) {
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const displayValue = target >= 1000 ? Math.floor(current).toLocaleString() : Math.floor(current);
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
        this.addAnimationStyles();
        this.checkElements();
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
            if (form.dataset.form === 'booking') {
                this.attachBookingBusinessRules(form);
            }
        });

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
        
        showLoading();
        if (submitBtn) { submitBtn.classList.add('loading'); submitBtn.disabled = true; }
        if (statusBox) {
            statusBox.textContent = 'Menghantar...';
            statusBox.className = 'form-status show info';
        }
        
        try {
            if (!this.validateForm(form)) {
                hideLoading();
                if (submitBtn) { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
                if (statusBox) {
                    statusBox.textContent = 'Sila betulkan ralat di atas.';
                    statusBox.className = 'form-status show error';
                }
                return;
            }
            
            await this.submitForm(formType, formData);
            
            const successMsg = formType === 'booking' ? 'Permintaan tempahan berjaya dihantar!' : 'Mesej anda telah berjaya dihantar!';
            showNotification(successMsg, 'success');
            if (statusBox) {
                statusBox.textContent = successMsg;
                statusBox.className = 'form-status show success';
            }
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
        
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Format emel tidak sah');
                isValid = false;
            }
        });
        
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
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
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
        const emailRegex = /^[^S@]+@[^S@]+\.[^S@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        let digits = String(phone).replace(/\D/g, '');
        if (digits.startsWith('60')) {
            digits = digits.slice(2);
        } else if (digits.startsWith('0')) {
            digits = digits.slice(1);
        }
        const msiaRegex = /^1[0-46-9][0-9]{7,8}$/;
        return msiaRegex.test(digits);
    }
    
    async submitForm(formType, formData) {
        if (formType === 'booking') {
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

            await new Promise(resolve => setTimeout(resolve, 600));
            return { success: true, message: 'Booking submitted (simulated)' };
        }

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
                    isSunday = d.getDay() === 0;
                    const now = new Date();
                    isToday = d.toDateString() === now.toDateString();
                }
            }
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
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            window.dropdownMenu = new DropdownMenu();
            window.carousel = new Carousel('#certifications-carousel');
            window.animatedCounter = new AnimatedCounter();
            window.scrollAnimations = new ScrollAnimations();
            window.formHandler = new FormHandler();
            window.headerScroll = new HeaderScroll();
            window.smoothScroll = new SmoothScroll();
            window.lazyLoader = new LazyLoader();
            window.responsiveHandler = new ResponsiveHandler();
            
            this.initCallButtonTracking();
            this.addCustomStyles();
            
            document.body.classList.add('app-ready');
            
            console.log('KME Pest Control website initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    initCallButtonTracking() {
        const mobileCallBtn = document.getElementById('mobileCallBtn');
        if (mobileCallBtn) {
            mobileCallBtn.addEventListener('click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call_clicked', {
                        event_category: 'Contact',
                        event_label: 'Mobile Call Button',
                        transport_type: 'beacon'
                    });
                }
            });
        }
        
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
            });
        });
    }
    
    addCustomStyles() {
        if (document.getElementById('app-custom-css')) return;
        
        const style = document.createElement('style');
        style.id = 'app-custom-css';
        style.textContent = `
            #header.scrolled {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
            }
            .field-error {
                color: #dc3545;
                font-size: 0.875rem;
                margin-top: 5px;
            }
            input.error,
            textarea.error {
                border-color: #dc3545;
            }
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
            .carousel-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .carousel-btn:disabled:hover {
                transform: translateY(-50%);
                background: var(--primary-blue);
            }
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

window.app = new App();

window.KMEApp = {
    CONFIG,
    APP_STATE,
    showLoading,
    hideLoading,
    showNotification,
    smoothScrollTo
};