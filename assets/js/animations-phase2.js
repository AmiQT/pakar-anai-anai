/* ========================================
   KME Pest Control - Phase 2 Animation Enhancements
   Medium Impact, Moderate Implementation
   - Page Transition Effects
   - Advanced Dropdown Animations  
   - Enhanced Certificate Gallery
   - Advanced Loading States
   - Scroll-triggered Animations
======================================== */

'use strict';

// ========================================
// PAGE TRANSITION EFFECTS
// ========================================

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.setupNavigationInterception();
        this.createLoadingOverlay();
        this.setupPageLoadAnimation();
    }
    
    /**
     * Intercept navigation links for smooth transitions
     */
    setupNavigationInterception() {
        const navLinks = document.querySelectorAll('a[href^="index.html"], a[href^="pages/"], a[href*=".html"]');
        
        navLinks.forEach(link => {
            // Skip external links and anchors
            if (link.hostname !== window.location.hostname || 
                link.getAttribute('href').startsWith('#') ||
                link.hasAttribute('target')) {
                return;
            }
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (!this.isTransitioning) {
                    this.navigateWithTransition(link.href, link);
                }
            });
        });
    }
    
    /**
     * Navigate with simple smooth transition effect
     */
    async navigateWithTransition(url, linkElement) {
        this.isTransitioning = true;
        
        try {
            // Add simple navigation effect to clicked link
            linkElement.classList.add('navigating');
            
            // Simple page fade out
            document.body.style.opacity = '0.8';
            document.body.style.transition = 'opacity 0.2s ease';
            
            // Navigate after short delay
            setTimeout(() => {
                window.location.href = url;
            }, 200);
            
        } catch (error) {
            console.error('Page transition error:', error);
            // Fallback: direct navigation
            window.location.href = url;
        }
    }
    
    /**
     * Create loading overlay element (simplified)
     */
    createLoadingOverlay() {
        // Simplified - no loading overlay needed
        return;
    }
    
    /**
     * Show loading overlay (simplified)
     */
    showLoadingOverlay() {
        // Simplified - no loading overlay
        return;
    }
    
    /**
     * Hide loading overlay (simplified)
     */
    hideLoadingOverlay() {
        // Simplified - no loading overlay
        return;
    }
    
    /**
     * Animate page exit
     */
    animatePageExit() {
        return new Promise((resolve) => {
            const main = document.getElementById('main-content') || document.body;
            
            main.style.animation = 'pageExit 0.4s ease-in-out forwards';
            
            setTimeout(() => {
                resolve();
            }, 400);
        });
    }
    
    /**
     * Setup page load animation
     */
    setupPageLoadAnimation() {
        // Animate page entrance on load
        window.addEventListener('load', () => {
            this.animatePageEnter();
        });
        
        // Also trigger on DOMContentLoaded as fallback
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.animatePageEnter();
            });
        } else {
            this.animatePageEnter();
        }
    }
    
    /**
     * Animate page entrance
     */
    animatePageEnter() {
        const main = document.getElementById('main-content');
        if (main) {
            main.classList.add('page-transition');
            
            // Trigger animation
            requestAnimationFrame(() => {
                main.classList.add('loaded');
            });
        }
        
        this.hideLoadingOverlay();
        this.isTransitioning = false;
    }
}

// ========================================
// ADVANCED DROPDOWN ANIMATIONS
// ========================================

class AdvancedDropdowns {
    constructor() {
        this.dropdowns = document.querySelectorAll('.has-dropdown');
        this.activeDropdown = null;
        this.init();
    }
    
    init() {
        this.setupDropdownInteractions();
        this.setupClickOutside();
        this.setupKeyboardNavigation();
    }
    
    /**
     * Setup dropdown interactions
     */
    setupDropdownInteractions() {
        this.dropdowns.forEach((dropdown, index) => {
            const link = dropdown.querySelector('.nav-link');
            const submenu = dropdown.querySelector('.dropdown-submenu');
            
            if (!link || !submenu) return;
            
            // Set up staggered animation for items
            this.setupStaggeredItems(submenu);
            
            // Desktop hover
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    this.openDropdown(dropdown, submenu);
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    this.closeDropdown(dropdown, submenu);
                }
            });
            
            // Mobile/tablet click
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.toggleDropdown(dropdown, submenu);
                }
            });
        });
    }
    
    /**
     * Setup staggered animation for dropdown items (simplified)
     */
    setupStaggeredItems(submenu) {
        // Simplified - no stagger animations
        return;
    }
    
    /**
     * Open dropdown with simple animation
     */
    openDropdown(dropdown, submenu) {
        // Close other dropdowns first
        this.closeAllDropdowns();
        
        this.activeDropdown = dropdown;
        dropdown.classList.add('active');
        submenu.classList.add('active');
    }
    
    /**
     * Close dropdown (simplified)
     */
    closeDropdown(dropdown, submenu) {
        dropdown.classList.remove('active');
        submenu.classList.remove('active');
        
        if (this.activeDropdown === dropdown) {
            this.activeDropdown = null;
        }
    }
    
    /**
     * Toggle dropdown (mobile)
     */
    toggleDropdown(dropdown, submenu) {
        if (submenu.classList.contains('active')) {
            this.closeDropdown(dropdown, submenu);
        } else {
            this.openDropdown(dropdown, submenu);
        }
    }
    
    /**
     * Close all dropdowns
     */
    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const submenu = dropdown.querySelector('.dropdown-submenu');
            if (submenu) {
                this.closeDropdown(dropdown, submenu);
            }
        });
    }
    
    /**
     * Setup click outside to close
     */
    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.has-dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }
    
    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }
}

// ========================================
// ENHANCED CERTIFICATE GALLERY
// ========================================

class EnhancedCertificateGallery {
    constructor() {
        this.certificates = document.querySelectorAll('.certificate-item, .certificate-item-enhanced');
        this.lightbox = null;
        this.init();
    }
    
    init() {
        this.setupCertificateClicks();
        this.createLightbox();
        this.setupKeyboardControls();
    }
    
    /**
     * Setup certificate click handlers
     */
    setupCertificateClicks() {
        this.certificates.forEach((cert, index) => {
            // Add overlay if not exists
            this.addOverlay(cert);
            
            // Prevent double click with debounce
            let clickTimeout = null;
            
            cert.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Prevent double clicks
                if (clickTimeout) return;
                
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                }, 300);
                
                const img = cert.querySelector('img');
                if (img && !document.querySelector('.certificate-lightbox-enhanced.active')) {
                    this.openLightbox(img, index);
                }
            });
            
            // Add hover effects
            cert.addEventListener('mouseenter', () => {
                this.animateCertificateHover(cert, true);
            });
            
            cert.addEventListener('mouseleave', () => {
                this.animateCertificateHover(cert, false);
            });
        });
    }
    
    /**
     * Add overlay to certificate (disabled)
     */
    addOverlay(cert) {
        // Overlay disabled
        return;
    }
    
    /**
     * Animate certificate hover effects (disabled)
     */
    animateCertificateHover(cert, isHover) {
        // Hover animations disabled
        return;
    }
    
    /**
     * Create lightbox element
     */
    createLightbox() {
        if (document.querySelector('.certificate-lightbox-enhanced')) return;
        
        const lightbox = document.createElement('div');
        lightbox.className = 'certificate-lightbox-enhanced';
        lightbox.innerHTML = `
            <div class="certificate-lightbox-content">
                <img class="certificate-lightbox-img" src="" alt="">
                <button class="certificate-lightbox-close" aria-label="Close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        this.lightbox = lightbox;
        
        // Setup close handlers
        const closeBtn = lightbox.querySelector('.certificate-lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox());
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });
    }
    
    /**
     * Open lightbox with certificate
     */
    openLightbox(img, index) {
        if (!this.lightbox) return;
        
        const lightboxImg = this.lightbox.querySelector('.certificate-lightbox-img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || `Certificate ${index + 1}`;
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const closeBtn = this.lightbox.querySelector('.certificate-lightbox-close');
        closeBtn.focus();
    }
    
    /**
     * Close lightbox
     */
    closeLightbox() {
        if (this.lightbox) {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Setup keyboard controls
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox || !this.lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.showPreviousCertificate();
                    break;
                case 'ArrowRight':
                    this.showNextCertificate();
                    break;
            }
        });
    }
    
    /**
     * Show previous certificate (for future carousel implementation)
     */
    showPreviousCertificate() {
        // Placeholder for carousel functionality
        console.log('Previous certificate');
    }
    
    /**
     * Show next certificate (for future carousel implementation)
     */
    showNextCertificate() {
        // Placeholder for carousel functionality
        console.log('Next certificate');
    }
}

// ========================================
// ADVANCED LOADING STATES
// ========================================

class AdvancedLoadingStates {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFormLoadingStates();
        this.setupSkeletonLoaders();
        this.setupContentLoading();
        this.createScrollProgressIndicator();
    }
    
    /**
     * Setup advanced form loading states
     */
    setupFormLoadingStates() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (submitBtn) {
                form.addEventListener('submit', (e) => {
                    this.setAdvancedButtonLoading(submitBtn, true);
                });
            }
        });
    }
    
    /**
     * Set advanced button loading state
     */
    setAdvancedButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading-advanced');
            button.disabled = true;
            
            // Store original content
            if (!button.dataset.originalContent) {
                button.dataset.originalContent = button.innerHTML;
            }
            
            button.innerHTML = `
                <span class="loading-dots">Menghantar</span>
            `;
            
        } else {
            button.classList.remove('btn-loading-advanced');
            button.disabled = false;
            
            // Restore original content
            if (button.dataset.originalContent) {
                button.innerHTML = button.dataset.originalContent;
            }
        }
    }
    
    /**
     * Setup skeleton loaders for content
     */
    setupSkeletonLoaders() {
        const skeletonContainers = document.querySelectorAll('[data-skeleton]');
        
        skeletonContainers.forEach(container => {
            const type = container.dataset.skeleton;
            this.createSkeletonLoader(container, type);
        });
    }
    
    /**
     * Create skeleton loader
     */
    createSkeletonLoader(container, type) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader';
        
        switch (type) {
            case 'card':
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-button"></div>
                `;
                break;
            case 'profile':
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-avatar"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                `;
                break;
            default:
                skeleton.innerHTML = `
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                `;
        }
        
        container.appendChild(skeleton);
        
        // Auto remove after delay (demo purposes)
        setTimeout(() => {
            skeleton.remove();
        }, 3000);
    }
    
    /**
     * Setup content loading indicators
     */
    setupContentLoading() {
        const loadableContent = document.querySelectorAll('[data-loadable]');
        
        loadableContent.forEach(content => {
            // Add loading state initially
            content.classList.add('content-loading');
            
            // Remove loading state after content loads
            if (content.tagName === 'IMG') {
                content.addEventListener('load', () => {
                    content.classList.remove('content-loading');
                });
            }
        });
    }
    
    /**
     * Create scroll progress indicator
     */
    createScrollProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        this.updateScrollProgress();
        window.addEventListener('scroll', () => this.updateScrollProgress());
    }
    
    /**
     * Update scroll progress
     */
    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.setProperty('--scroll-progress', `${scrollPercent}%`);
        }
    }
}

// ========================================
// SCROLL-TRIGGERED ANIMATIONS
// ========================================

class ScrollTriggeredAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-animation]');
        this.parallaxElements = document.querySelectorAll('.parallax-element');
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupParallaxScrolling();
        this.setupTextRevealAnimations();
        this.enhanceCounterAnimations();
    }
    
    /**
     * Setup intersection observer for scroll animations
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.elements.forEach(el => el.classList.add('animate-in'));
            return;
        }
        
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.elements.forEach(el => {
            this.observer.observe(el);
            
            // Set up stagger delay if specified
            if (el.hasAttribute('data-scroll-stagger')) {
                const staggerIndex = Array.from(el.parentNode.children).indexOf(el);
                el.style.setProperty('--stagger-delay', staggerIndex);
            }
        });
    }
    
    /**
     * Animate element when it comes into view
     */
    animateElement(element) {
        const animationType = element.dataset.scrollAnimation;
        const delay = element.dataset.scrollDelay || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            
            // Trigger specific animation behaviors
            switch (animationType) {
                case 'counter':
                    this.animateCounter(element);
                    break;
                case 'text-reveal':
                    this.animateTextReveal(element);
                    break;
                case 'section-reveal':
                    this.animateSectionReveal(element);
                    break;
            }
        }, delay);
    }
    
    /**
     * Setup parallax scrolling effects
     */
    setupParallaxScrolling() {
        if (this.parallaxElements.length === 0) return;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            this.parallaxElements.forEach(element => {
                const speed = element.dataset.parallaxSpeed || 0.5;
                const yPos = -(scrollY * speed);
                element.style.setProperty('--parallax-offset', `${yPos}px`);
            });
        };
        
        // Throttled scroll handler
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    /**
     * Setup text reveal animations
     */
    setupTextRevealAnimations() {
        const textRevealElements = document.querySelectorAll('.text-reveal');
        
        textRevealElements.forEach(element => {
            const text = element.textContent;
            const words = text.split(' ');
            
            element.innerHTML = words.map((word, index) => 
                `<span style="--char-index: ${index}">${word}</span>`
            ).join(' ');
        });
    }
    
    /**
     * Animate text reveal
     */
    animateTextReveal(element) {
        element.classList.add('animate-in');
    }
    
    /**
     * Animate section reveal
     */
    animateSectionReveal(element) {
        element.classList.add('section-reveal', 'animate-in');
    }
    
    /**
     * Animate counter with enhanced effects
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.target || element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        // Add background animation
        element.classList.add('counter-enhanced', 'counting');
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            
            // Format number
            const displayValue = target >= 1000 ? 
                Math.floor(current).toLocaleString() : 
                Math.floor(current);
                
            element.textContent = displayValue;
        }, 16);
    }
    
    /**
     * Enhance existing counter animations
     */
    enhanceCounterAnimations() {
        const existingCounters = document.querySelectorAll('.stat-number[data-target]');
        
        existingCounters.forEach(counter => {
            counter.setAttribute('data-scroll-animation', 'counter');
            if (this.observer) {
                this.observer.observe(counter);
            }
        });
    }
}

// ========================================
// MICRO-INTERACTIONS
// ========================================

class MicroInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupInteractiveElements();
        this.setupHoverEffects();
        this.setupClickEffects();
    }
    
    /**
     * Setup interactive element behaviors
     */
    setupInteractiveElements() {
        const interactiveElements = document.querySelectorAll(
            '.service-card, .credential-card, .video-testimonial-card, .nav-link'
        );
        
        interactiveElements.forEach(element => {
            element.classList.add('interactive-element');
        });
    }
    
    /**
     * Setup enhanced hover effects
     */
    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('.interactive-element');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createHoverEffect(e.target, e);
            });
        });
    }
    
    /**
     * Create hover effect
     */
    createHoverEffect(element, event) {
        // Create ripple effect at cursor position
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(110, 193, 228, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            animation: hover-ripple 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    /**
     * Setup click effects
     */
    setupClickEffects() {
        const clickableElements = document.querySelectorAll('button, .btn, .nav-link, .social-icon');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createClickEffect(e.target, e);
            });
        });
    }
    
    /**
     * Create click effect
     */
    createClickEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const clickEffect = document.createElement('div');
        clickEffect.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: click-ripple 0.4s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(clickEffect);
        
        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.parentNode.removeChild(clickEffect);
            }
        }, 400);
    }
}

// ========================================
// KEYFRAME ANIMATIONS (CSS-in-JS)
// ========================================

class Phase2Keyframes {
    constructor() {
        this.init();
    }
    
    init() {
        this.injectKeyframes();
    }
    
    injectKeyframes() {
        const style = document.createElement('style');
        style.id = 'phase2-keyframes';
        style.textContent = `
            @keyframes hover-ripple {
                0% {
                    width: 4px;
                    height: 4px;
                    opacity: 1;
                }
                100% {
                    width: 60px;
                    height: 60px;
                    opacity: 0;
                }
            }
            
            @keyframes click-ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes pageEnter {
                0% {
                    opacity: 0;
                    transform: translateX(30px) scale(0.98);
                    filter: blur(3px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                    filter: blur(0);
                }
            }
            
            @keyframes pageExit {
                0% {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                    filter: blur(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-30px) scale(0.98);
                    filter: blur(3px);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// ========================================
// INITIALIZATION
// ========================================

class Phase2Animations {
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
            // Initialize all Phase 2 animation components
            this.pageTransitions = new PageTransitions();
            this.advancedDropdowns = new AdvancedDropdowns();
            
            this.advancedLoadingStates = new AdvancedLoadingStates();
            this.scrollTriggeredAnimations = new ScrollTriggeredAnimations();
            this.microInteractions = new MicroInteractions();
            this.phase2Keyframes = new Phase2Keyframes();
            
            console.log('Phase 2 Animations initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Phase 2 animations:', error);
        }
    }
}

// ========================================
// AUTO-INITIALIZE
// ========================================

// Initialize Phase 2 animations
window.phase2Animations = new Phase2Animations();

// Export for external use
window.Phase2Animations = {
    PageTransitions,
    AdvancedDropdowns,
    EnhancedCertificateGallery,
    AdvancedLoadingStates,
    ScrollTriggeredAnimations,
    MicroInteractions
};
