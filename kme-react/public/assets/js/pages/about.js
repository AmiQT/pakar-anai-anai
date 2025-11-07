/* ========================================
   KME Pest Control - About Page JavaScript
   Handles tab navigation and partner carousel
======================================== */

'use strict';

// ========================================
// ABOUT PAGE FUNCTIONALITY
// ========================================

class AboutPage {
    constructor() {
        this.tabLinks = document.querySelectorAll('.tab-link');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.partnersCarousel = null;
        
        this.init();
    }
    
    init() {
        this.setupTabs();
        this.setupPartnersCarousel();
        this.handleHashNavigation();
    }
    
    /**
     * Setup tab navigation
     */
    setupTabs() {
        this.tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabId = link.getAttribute('data-tab');
                this.switchTab(tabId);
                
                // Update URL hash
                window.history.pushState(null, null, `#${tabId}`);
            });
        });
    }
    
    /**
     * Switch between tabs
     */
    switchTab(tabId) {
        // Remove active class from all tabs and contents
        this.tabLinks.forEach(link => link.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        const activeLink = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        
        if (activeLink && activeContent) {
            activeLink.classList.add('active');
            activeContent.classList.add('active');
            
            // Trigger animation
            activeContent.style.opacity = '0';
            activeContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    /**
     * Handle hash navigation (direct links to tabs)
     */
    handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        const validTabs = ['company', 'services', 'team', 'certificate'];
        
        if (hash && validTabs.includes(hash)) {
            this.switchTab(hash);
        }
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.substring(1);
            if (newHash && validTabs.includes(newHash)) {
                this.switchTab(newHash);
            }
        });
    }
    
    /**
     * Setup partners carousel
     */
    setupPartnersCarousel() {
        const carousel = document.getElementById('partners-carousel');
        if (!carousel) return;
        
        this.partnersCarousel = new PartnersCarousel(carousel);
    }
}

// ========================================
// PARTNERS CAROUSEL CLASS
// ========================================

class PartnersCarousel {
    constructor(element) {
        this.carousel = element;
        this.container = element.querySelector('.carousel-container');
        this.slides = element.querySelectorAll('.partner-slide');
        this.prevBtn = element.querySelector('.carousel-btn.prev');
        this.nextBtn = element.querySelector('.carousel-btn.next');
        
        this.currentIndex = 0;
        this.slideWidth = 200; // Adjust based on CSS
        this.visibleSlides = this.getVisibleSlides();
        this.autoPlayTimer = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Add event listeners
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
        
        // Touch support
        this.addTouchSupport();
        
        // Auto play
        this.startAutoPlay();
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        
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
        this.autoPlayTimer = setInterval(() => this.next(), 3000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
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
            
            this.startAutoPlay();
        });
    }
}

// ========================================
// DEPARTMENTS ANIMATION
// ========================================

class DepartmentsAnimation {
    constructor() {
        this.departmentCards = document.querySelectorAll('.department-card');
        this.init();
    }
    
    init() {
        this.observeCards();
    }
    
    observeCards() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 100); // Stagger animation
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            this.departmentCards.forEach(card => {
                card.classList.add('animate-ready');
                observer.observe(card);
            });
        }
    }
}

// ========================================
// CERTIFICATIONS LIGHTBOX
// ========================================

class CertificationsLightbox {
    constructor() {
        this.certImages = document.querySelectorAll('.cert-card img');
        this.lightbox = null;
        this.init();
    }
    
    init() {
        this.createLightbox();
        this.bindEvents();
    }
    
    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(this.lightbox);
    }
    
    bindEvents() {
        // Open lightbox
        this.certImages.forEach(img => {
            img.addEventListener('click', (e) => {
                this.openLightbox(img.src, img.alt);
            });
            
            // Add cursor pointer
            img.style.cursor = 'pointer';
        });
        
        // Close lightbox
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox());
        
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        });
    }
    
    openLightbox(src, caption) {
        const img = this.lightbox.querySelector('.lightbox-image');
        const captionEl = this.lightbox.querySelector('.lightbox-caption');
        
        img.src = src;
        captionEl.textContent = caption;
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aboutPage = new AboutPage();
    window.departmentsAnimation = new DepartmentsAnimation();
    window.certificationsLightbox = new CertificationsLightbox();
});

// Add custom CSS for about page animations
const aboutPageStyles = `
    /* Tab content transitions */
    .tab-content {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    /* Department cards animation */
    .department-card.animate-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .department-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Partners carousel */
    .partners-carousel {
        position: relative;
        margin: 40px 0;
    }
    
    .partners-carousel h4 {
        text-align: center;
        margin-bottom: 30px;
        color: var(--dark-gray);
        font-size: 1.5rem;
    }
    
    .partner-slide {
        flex: 0 0 200px;
        padding: 20px;
        text-align: center;
    }
    
    .partner-slide img {
        width: 100%;
        height: 100px;
        object-fit: contain;
        filter: grayscale(100%);
        transition: filter 0.3s ease, transform 0.3s ease;
    }
    
    .partner-slide img:hover {
        filter: grayscale(0%);
        transform: scale(1.05);
    }
    
    /* Departments grid */
    .departments-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }
    
    .department-card {
        background: var(--white);
        padding: 30px;
        border-radius: var(--border-radius-large);
        text-align: center;
        box-shadow: var(--shadow-light);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .department-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-medium);
    }
    
    .department-card i {
        font-size: 2.5rem;
        color: var(--primary-blue);
        margin-bottom: 15px;
    }
    
    .department-card h4 {
        color: var(--dark-gray);
        font-size: 1.1rem;
        font-weight: 600;
    }
    
    /* Certifications grid */
    .certifications-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }
    
    .cert-card {
        background: var(--white);
        border-radius: var(--border-radius-large);
        overflow: hidden;
        box-shadow: var(--shadow-light);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .cert-card:hover {
        transform: scale(1.02);
        box-shadow: var(--shadow-medium);
    }
    
    .cert-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    
    .cert-card h4 {
        padding: 20px;
        text-align: center;
        color: var(--dark-gray);
        font-size: 1rem;
        font-weight: 600;
    }
    
    /* Lightbox */
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .lightbox.active {
        opacity: 1;
        visibility: visible;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 1;
    }
    
    .lightbox-image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
    }
    
    .lightbox-caption {
        color: white;
        text-align: center;
        padding: 15px;
        font-size: 1.1rem;
    }
    
    /* Mobile responsiveness */
    @media (max-width: 767px) {
        .departments-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .certifications-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .partner-slide {
            flex: 0 0 150px;
        }
    }
`;

// Add styles to document
const aboutStyleSheet = document.createElement('style');
aboutStyleSheet.textContent = aboutPageStyles;
document.head.appendChild(aboutStyleSheet);
