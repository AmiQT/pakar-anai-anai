/* ========================================
   KME Pest Control - Services Page JavaScript
   Handles smooth scrolling, animations, and interactions
======================================== */

'use strict';

// ========================================
// SERVICES PAGE FUNCTIONALITY
// ========================================

class ServicesPage {
    constructor() {
        this.serviceNavLinks = document.querySelectorAll('.service-nav-link');
        this.serviceSections = document.querySelectorAll('.service-section');
        this.pestCards = document.querySelectorAll('.pest-card');
        
        this.init();
    }
    
    init() {
        this.setupServiceNavigation();
        this.setupScrollSpy();
        this.setupAnimations();
        this.handleHashNavigation();
    }
    
    /**
     * Setup service navigation links
     */
    setupServiceNavigation() {
        this.serviceNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    this.updateActiveNavLink(link);
                }
            });
        });
    }
    
    /**
     * Smooth scroll to section
     */
    scrollToSection(section) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
    
    /**
     * Update active navigation link
     */
    updateActiveNavLink(activeLink) {
        this.serviceNavLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    /**
     * Setup scroll spy for navigation
     */
    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const navLink = document.querySelector(`[href="#${sectionId}"]`);
                    
                    if (navLink) {
                        this.updateActiveNavLink(navLink);
                    }
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0.1
        });
        
        this.serviceSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    /**
     * Setup animations for pest cards
     */
    setupAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 100); // Stagger animation
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            });
            
            this.pestCards.forEach(card => {
                card.classList.add('animate-ready');
                animationObserver.observe(card);
            });
        }
    }
    
    /**
     * Handle hash navigation (direct links to sections)
     */
    handleHashNavigation() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                // Delay to ensure page is loaded
                setTimeout(() => {
                    this.scrollToSection(targetSection);
                }, 500);
            }
        }
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash;
            if (newHash) {
                const targetSection = document.querySelector(newHash);
                if (targetSection) {
                    this.scrollToSection(targetSection);
                }
            }
        });
    }
}

// ========================================
// SERVICE CARD INTERACTIONS
// ========================================

class ServiceCardInteractions {
    constructor() {
        this.serviceCards = document.querySelectorAll('.service-section');
        this.init();
    }
    
    init() {
        this.setupHoverEffects();
        this.setupClickToExpand();
    }
    
    setupHoverEffects() {
        this.serviceCards.forEach(card => {
            const image = card.querySelector('.service-image img');
            
            if (image) {
                card.addEventListener('mouseenter', () => {
                    image.style.transform = 'scale(1.05)';
                });
                
                card.addEventListener('mouseleave', () => {
                    image.style.transform = 'scale(1)';
                });
            }
        });
    }
    
    setupClickToExpand() {
        this.serviceCards.forEach(card => {
            const steps = card.querySelectorAll('.service-steps li');
            
            steps.forEach(step => {
                step.addEventListener('click', () => {
                    step.classList.toggle('expanded');
                });
            });
        });
    }
}

// ========================================
// PEST TYPES FILTER
// ========================================

class PestTypesFilter {
    constructor() {
        this.pestCards = document.querySelectorAll('.pest-card');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.init();
    }
    
    init() {
        this.setupFilterButtons();
        this.setupSearchFilter();
    }
    
    setupFilterButtons() {
        // Add filter buttons if needed in future
        // Currently showing all pest types
    }
    
    setupSearchFilter() {
        // Add search functionality if needed
        // Currently not implemented but structure is ready
    }
    
    filterPests(category) {
        this.pestCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.classList.add('animate-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('animate-in');
            }
        });
    }
}

// ========================================
// SERVICES COMPARISON TOOL - REMOVED
// ========================================
// Comparison modal functionality has been removed as requested

// ========================================
// PRICING CALCULATOR
// ========================================

class PricingCalculator {
    constructor() {
        this.calculatorForm = document.getElementById('pricing-calculator');
        this.priceDisplay = document.getElementById('estimated-price');
        
        if (this.calculatorForm) {
            this.init();
        }
    }
    
    init() {
        this.setupCalculator();
    }
    
    setupCalculator() {
        const inputs = this.calculatorForm.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.calculatePrice();
            });
        });
    }
    
    calculatePrice() {
        const formData = new FormData(this.calculatorForm);
        const serviceType = formData.get('service-type');
        const propertySize = parseInt(formData.get('property-size')) || 0;
        const severity = formData.get('severity');
        
        // Basic pricing calculation (implement actual pricing logic)
        let basePrice = 0;
        
        switch (serviceType) {
            case 'ST':
                basePrice = 500;
                break;
            case 'PP':
                basePrice = 150;
                break;
            case 'CT':
                basePrice = 800;
                break;
            case 'BT':
                basePrice = 300;
                break;
            default:
                basePrice = 200;
        }
        
        // Adjust for property size
        const sizeMultiplier = Math.max(1, propertySize / 1000);
        
        // Adjust for severity
        const severityMultiplier = severity === 'high' ? 1.5 : severity === 'medium' ? 1.2 : 1;
        
        const estimatedPrice = Math.round(basePrice * sizeMultiplier * severityMultiplier);
        
        if (this.priceDisplay) {
            this.priceDisplay.textContent = `RM ${estimatedPrice.toLocaleString()}`;
            this.priceDisplay.classList.add('updated');
            
            setTimeout(() => {
                this.priceDisplay.classList.remove('updated');
            }, 1000);
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.servicesPage = new ServicesPage();
    window.serviceCardInteractions = new ServiceCardInteractions();
    window.pestTypesFilter = new PestTypesFilter();
    // window.servicesComparison = new ServicesComparison(); // Removed comparison modal
    window.pricingCalculator = new PricingCalculator();
});

// Add custom CSS for services page
const servicesPageStyles = `
    /* Page header */
    .page-header {
        background: linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%);
        color: var(--white);
        padding: 60px 0 40px;
        text-align: center;
        margin-top: 0;
    }
    
    .page-header h1 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 20px;
    }
    
    .page-header p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
    }
    
    /* Services navigation */
    .services-nav {
        background: var(--white);
        padding: 20px 0;
        box-shadow: var(--shadow-light);
        position: static;
        z-index: auto;
    }
    
    .services-nav-list {
        display: flex;
        justify-content: center;
        gap: 40px;
        list-style: none;
        flex-wrap: wrap;
    }
    
    .service-nav-link {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--medium-gray);
        text-decoration: none;
        font-weight: 600;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        transition: var(--transition-fast);
        border: 2px solid transparent;
    }
    
    .service-nav-link:hover,
    .service-nav-link.active {
        color: var(--primary-blue);
        background: var(--light-gray);
        border-color: var(--primary-blue);
    }
    
    .service-nav-link i {
        font-size: 1.2rem;
    }
    
    /* Services introduction */
    .services-intro {
        padding: 60px 0;
        background: var(--light-gray);
    }
    
    .intro-content {
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .intro-content p {
        font-size: 1.1rem;
        color: var(--medium-gray);
        line-height: 1.7;
        margin-bottom: 30px;
    }
    
    .intro-highlight {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        background: var(--white);
        padding: 20px;
        border-radius: var(--border-radius-large);
        box-shadow: var(--shadow-light);
    }
    
    .intro-highlight i {
        font-size: 1.5rem;
        color: var(--accent-orange);
    }
    
    .intro-highlight p {
        margin: 0;
        font-weight: 600;
        color: var(--dark-gray);
    }
    
    /* Service sections */
    .main-services {
        padding: 80px 0;
    }
    
    .service-section {
        margin-bottom: 100px;
        scroll-margin-top: 140px;
    }
    
    .service-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
    }
    
    .service-content.reverse {
        direction: rtl;
    }
    
    .service-content.reverse > * {
        direction: ltr;
    }
    
    .service-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    
    .service-header h2 {
        font-size: 2.5rem;
        color: var(--dark-gray);
        font-weight: 800;
    }
    
    .service-link {
        color: var(--primary-blue);
        text-decoration: none;
        font-weight: 600;
        border: 2px solid var(--primary-blue);
        padding: 8px 16px;
        border-radius: var(--border-radius);
        transition: var(--transition-fast);
    }
    
    .service-link:hover {
        background: var(--primary-blue);
        color: var(--white);
    }
    
    .service-description {
        font-size: 1.1rem;
        color: var(--medium-gray);
        line-height: 1.6;
        margin-bottom: 30px;
    }
    
    .service-steps {
        list-style: none;
    }
    
    .service-steps li {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 20px;
        font-size: 1rem;
        line-height: 1.6;
        color: var(--dark-gray);
        cursor: pointer;
        transition: var(--transition-fast);
        padding: 10px;
        border-radius: var(--border-radius);
    }
    
    .service-steps li:hover {
        background: var(--light-gray);
    }
    
    .step-number {
        background: var(--primary-blue);
        color: var(--white);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        flex-shrink: 0;
    }
    
    .service-image img {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: var(--border-radius-large);
        box-shadow: var(--shadow-medium);
        transition: transform 0.3s ease;
    }
    
    /* Pest types section */
    .pest-types-section {
        padding: 80px 0;
        background: var(--light-gray);
    }
    
    .pest-types-section .section-header {
        text-align: center;
        margin-bottom: 60px;
    }
    
    .pest-types-section .pest-icon {
        width: 80px;
        height: 80px;
        background: var(--accent-orange);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 30px;
    }
    
    .pest-types-section .pest-icon i {
        font-size: 2.5rem;
        color: var(--white);
    }
    
    .pest-types-section h2 {
        font-size: 2.5rem;
        color: var(--dark-gray);
        margin-bottom: 20px;
        font-weight: 700;
    }
    
    .pest-types-section p {
        font-size: 1.1rem;
        color: var(--medium-gray);
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
    }
    
    .pest-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }
    
    .pest-card {
        background: var(--white);
        padding: 40px 30px;
        border-radius: var(--border-radius-large);
        text-align: center;
        box-shadow: var(--shadow-light);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        opacity: 0;
        transform: translateY(30px);
    }
    
    .pest-card.animate-ready {
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .pest-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .pest-card:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-heavy);
    }
    
    .pest-card .pest-icon {
        width: 60px;
        height: 60px;
        background: var(--primary-blue);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        transition: var(--transition-medium);
    }
    
    .pest-card:hover .pest-icon {
        background: var(--accent-orange);
        transform: scale(1.1);
    }
    
    .pest-card .pest-icon i {
        font-size: 1.5rem;
        color: var(--white);
    }
    
    .pest-card h3 {
        font-size: 1.3rem;
        color: var(--dark-gray);
        margin-bottom: 15px;
        font-weight: 700;
    }
    
    .pest-card p {
        color: var(--medium-gray);
        line-height: 1.6;
    }
    
    /* Services CTA */
    .services-cta {
        padding: 80px 0;
        background: var(--white);
    }
    
    .services-cta .cta-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
    }
    
    .services-cta h2 {
        font-size: 2.5rem;
        color: var(--dark-gray);
        margin-bottom: 20px;
        font-weight: 700;
    }
    
    .services-cta p {
        font-size: 1.1rem;
        color: var(--medium-gray);
        line-height: 1.7;
        margin-bottom: 30px;
    }
    
    .cta-buttons {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }
    
    .whatsapp-cta,
    .contact-cta {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 15px 30px;
        border-radius: var(--border-radius-large);
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        transition: var(--transition-medium);
    }
    
    .whatsapp-cta {
        background: #25D366;
        color: var(--white);
    }
    
    .whatsapp-cta:hover {
        background: #20BA5A;
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }
    
    .contact-cta {
        background: var(--primary-blue);
        color: var(--white);
    }
    
    .contact-cta:hover {
        background: var(--secondary-blue);
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }
    
    .cta-image img {
        width: 100%;
        height: auto;
        border-radius: var(--border-radius-large);
        box-shadow: var(--shadow-medium);
    }
    
    /* Mobile responsiveness */
    @media (max-width: 767px) {
        .page-header h1 {
            font-size: 2rem;
        }
        
        .page-header p {
            font-size: 1rem;
        }
        
        .services-nav-list {
            gap: 15px;
        }
        
        .service-nav-link {
            padding: 8px 12px;
            font-size: 0.9rem;
        }
        
        .service-content {
            grid-template-columns: 1fr;
            gap: 40px;
        }
        
        .service-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .service-header h2 {
            font-size: 2rem;
        }
        
        .pest-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .services-cta .cta-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
        }
        
        .services-cta h2 {
            font-size: 2rem;
        }
        
        .cta-buttons {
            justify-content: center;
        }
    }
`;

// Add styles to document
const servicesStyleSheet = document.createElement('style');
servicesStyleSheet.textContent = servicesPageStyles;
document.head.appendChild(servicesStyleSheet);
