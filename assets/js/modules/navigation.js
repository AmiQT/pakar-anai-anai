/* ========================================
   KME Pest Control - Navigation Module
   Handles navigation menu and mobile functionality
======================================== */

'use strict';

// ========================================
// NAVIGATION MODULE
// ========================================

export class Navigation {
    constructor() {
        this.menuToggle = document.getElementById('mobile-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.header = document.getElementById('header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.dropdownItems = document.querySelectorAll('.has-dropdown');
        
        this.isMenuOpen = false;
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupDropdowns();
        this.setupScrollEffects();
        this.setupActiveStates();
        this.bindEvents();
    }
    
    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        if (!this.menuToggle || !this.navMenu) return;
        
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on window resize if opened
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }
    
    /**
     * Open mobile menu
     */
    openMobileMenu() {
        this.isMenuOpen = true;
        this.menuToggle?.classList.add('active');
        this.navMenu?.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add accessibility attributes
        this.menuToggle?.setAttribute('aria-expanded', 'true');
        this.navMenu?.setAttribute('aria-hidden', 'false');
        
        // Focus first menu item for accessibility
        const firstMenuItem = this.navMenu?.querySelector('.nav-link');
        firstMenuItem?.focus();
    }
    
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.menuToggle?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Add accessibility attributes
        this.menuToggle?.setAttribute('aria-expanded', 'false');
        this.navMenu?.setAttribute('aria-hidden', 'true');
    }
    
    /**
     * Setup dropdown functionality
     */
    setupDropdowns() {
        this.dropdownItems.forEach(item => {
            const dropdownMenu = item.querySelector('.dropdown-submenu');
            const mainLink = item.querySelector('.nav-link');
            
            if (!dropdownMenu || !mainLink) return;
            
            // Mouse events for desktop
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    this.showDropdown(dropdownMenu);
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    this.hideDropdown(dropdownMenu);
                }
            });
            
            // Prevent navigation for dropdown headers on all devices
            mainLink.addEventListener('click', (e) => {
                // Always prevent navigation for dropdown headers
                e.preventDefault();
                
                if (window.innerWidth <= 768) {
                    // Toggle dropdown on mobile
                    this.toggleDropdown(dropdownMenu);
                } else {
                    // Toggle dropdown on desktop
                    const isVisible = dropdownMenu.style.opacity === '1';
                    if (isVisible) {
                        this.hideDropdown(dropdownMenu);
                    } else {
                        this.showDropdown(dropdownMenu);
                    }
                }
            });
        });
    }
    
    /**
     * Show dropdown
     */
    showDropdown(dropdown) {
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
    }
    
    /**
     * Hide dropdown
     */
    hideDropdown(dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px)';
    }
    
    /**
     * Toggle dropdown for mobile
     */
    toggleDropdown(dropdown) {
        const isVisible = dropdown.style.opacity === '1';
        
        if (isVisible) {
            this.hideDropdown(dropdown);
        } else {
            this.showDropdown(dropdown);
        }
    }
    
    /**
     * Setup scroll effects for header
     */
    setupScrollEffects() {
        if (!this.header) return;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class based on scroll position
            if (currentScrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll (optional enhancement)
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                this.header.classList.add('hide-header');
            } else {
                this.header.classList.remove('hide-header');
            }
            
            this.lastScrollY = currentScrollY;
        };
        
        // Throttle scroll events for performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', throttledScroll);
    }
    
    /**
     * Setup active navigation states
     */
    setupActiveStates() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove existing active classes
            link.classList.remove('active');
            
            // Add active class if this is the current page
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Bind additional events
     */
    bindEvents() {
        // Handle navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Handle smooth scrolling for anchor links
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    /**
     * Smooth scroll to section
     */
    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = this.header?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Update active state (useful for SPA navigation)
     */
    updateActiveState(activePage) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === activePage) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Destroy navigation (cleanup)
     */
    destroy() {
        // Remove event listeners and clean up
        this.closeMobileMenu();
        document.body.style.overflow = '';
    }
}

// Auto-initialize if not imported as module
if (typeof window !== 'undefined' && !window.navigationModule) {
    window.navigationModule = new Navigation();
}
