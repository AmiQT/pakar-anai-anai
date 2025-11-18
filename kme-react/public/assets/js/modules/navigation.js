/* ========================================
   KME Pest Control - Navigation Module
   Handles navigation menu and mobile functionality
======================================== */

'use strict';

// ========================================
// NAVIGATION MODULE
// ========================================

class Navigation {
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
        if (!this.menuToggle || !this.navMenu) {
            console.error('Mobile menu elements not found:', { menuToggle: !!this.menuToggle, navMenu: !!this.navMenu });
            return;
        }
        
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });
        
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu.contains(e.target) && 
                !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMenuOpen = true;
        this.menuToggle?.classList.add('active');
        this.navMenu?.classList.add('mobile-active');
        document.body.style.overflow = 'hidden';
        
        this.menuToggle?.setAttribute('aria-expanded', 'true');
        this.navMenu?.setAttribute('aria-hidden', 'false');
        
        setTimeout(() => {
            this.navMenu?.querySelector('.nav-link')?.focus();
        }, 100);
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.menuToggle?.classList.remove('active');
        this.navMenu?.classList.remove('mobile-active');
        document.body.style.overflow = '';

        this.dropdownItems.forEach(item => {
            const dropdownMenu = item.querySelector('.dropdown-submenu');
            if (dropdownMenu?.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
            }
        });
        
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
            
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) this.showDropdown(dropdownMenu);
            });
            
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) this.hideDropdown(dropdownMenu);
            });
            
            mainLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation(); // Stop other scripts from interfering
                    this.toggleDropdown(dropdownMenu);
                }
            });

            dropdownMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                });
            });
        });
    }
    
    showDropdown(dropdown) {
        if (window.innerWidth <= 768) {
            dropdown.classList.add('active');
        } else {
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
        }
    }
    
    hideDropdown(dropdown) {
        if (window.innerWidth <= 768) {
            dropdown.classList.remove('active');
        } else {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
        }
    }
    
    toggleDropdown(dropdown) {
        const isVisible = dropdown.classList.contains('active');
        if (isVisible) {
            this.hideDropdown(dropdown);
        } else {
            this.showDropdown(dropdown);
        }
    }
    
    setupScrollEffects() {
        if (!this.header) return;
        let ticking = false;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            this.header.classList.toggle('scrolled', currentScrollY > 100);
            this.header.classList.toggle('hide-header', currentScrollY > this.lastScrollY && currentScrollY > 200);
            this.lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupActiveStates() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === currentPage || (currentPage === 'index.html' && href === 'index.html'));
        });
    }
    
    /**
     * Bind additional events
     */
    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const isDropdownToggle = link.parentElement.classList.contains('has-dropdown');

                if (this.isMenuOpen && (!isDropdownToggle || window.innerWidth > 768)) {
                    this.closeMobileMenu();
                }
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }
    
    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = this.header?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }
    
    updateActiveState(activePage) {
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === activePage);
        });
    }
    
    destroy() {
        this.closeMobileMenu();
        document.body.style.overflow = '';
    }
}

// Export class for React
if (typeof window !== 'undefined') {
    window.KMENavigation = Navigation;
}

// Auto-initialize for non-React pages
if (typeof window !== 'undefined' && !window.navigationModule) {
    document.addEventListener('DOMContentLoaded', () => {
        window.navigationModule = new Navigation();
    });
}
