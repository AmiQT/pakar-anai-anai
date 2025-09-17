# 🎨 Frontend Developer Guide - KME Pest Control

**Complete technical guide for frontend development pada KME Pest Control website**

---

## 📋 Project Overview

### **Company Profile**
- **Business**: KME Pest Control - Expert kawalan serangga
- **Market**: Pahang & Terengganu, Malaysia  
- **Experience**: 15+ years, 20,000+ customers
- **Website**: Professional business website dengan booking system

### **Technical Stack**
- **Framework**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 + Responsive Design
- **Markup**: HTML5 Semantic Structure
- **Backend**: WordPress Headless CMS
- **Deployment**: Vercel (Static Hosting)
- **Performance**: 90+ Lighthouse Score Target

---

## 🏗️ Architecture Overview

### **Frontend Architecture**
```
Frontend (Vercel)     ←→     WordPress API
├── Static HTML               ├── REST Endpoints
├── Modern CSS                ├── Content Management  
├── Vanilla JS                ├── Media Library
└── Progressive Enhancement   └── Custom Fields
```

### **File Structure**
```
/
├── index.html              # Homepage
├── pages/                  # All static pages
│   ├── about.html         # About page
│   ├── services.html      # Services overview
│   ├── booking.html       # Appointment booking
│   ├── contact.html       # Contact + FAQ
│   └── services/          # Individual service pages
├── assets/
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Core styles (126KB)
│   │   ├── booking.css    # Booking page styles
│   │   └── contact-new.css # Contact page styles
│   ├── js/                # JavaScript modules
│   │   ├── main.js        # Core functionality
│   │   ├── components/    # Reusable components
│   │   ├── modules/       # Feature modules
│   │   ├── pages/         # Page-specific scripts
│   │   └── utils/         # Helper functions
│   └── images/            # Optimized media assets
└── vercel.json            # Deployment configuration
```

---

## 🎯 Core Technologies & Patterns

### **JavaScript Architecture**

#### **1. Modular Class-Based Structure**
```javascript
// Core application structure
class App {
    constructor() {
        this.initializeComponents();
    }
    
    initializeComponents() {
        window.dropdownMenu = new DropdownMenu();
        window.mobileMenu = new MobileMenu();
        window.carousel = new Carousel('#certifications-carousel');
        window.formHandler = new FormHandler();
        // ... other components
    }
}
```

#### **2. Component Pattern**
```javascript
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobile-toggle');
        this.menu = document.getElementById('nav-menu');
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', () => this.toggleMenu());
    }
    
    toggleMenu() {
        // Implementation
    }
}
```

#### **3. Configuration Management**
```javascript
const CONFIG = {
    API_BASE_URL: 'https://pakaranaianai.com/wp-json/wp/v2/',
    ANIMATION_DURATION: 300,
    MOBILE_BREAKPOINT: 768,
    CAROUSEL_AUTO_PLAY: true
};
```

### **CSS Architecture**

#### **1. BEM Methodology** 
```css
/* Block */
.navigation-menu { }

/* Element */
.navigation-menu__item { }

/* Modifier */
.navigation-menu__item--active { }
```

#### **2. CSS Custom Properties**
```css
:root {
    --primary-blue: #4A90E2;
    --secondary-blue: #357ABD;
    --accent-orange: #FF8C00;
    --white: #FFFFFF;
    --light-gray: #F8F9FA;
    --dark-gray: #343A40;
}
```

#### **3. Responsive Breakpoints**
```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

---

## 📱 Key Components & Features

### **1. Navigation System**

#### **Desktop Navigation**
- Main navigation dengan dropdown menus
- Trust badges (Licensed, 15+ Years, 7yr Warranty)
- Booking CTA button
- Smooth transitions

#### **Mobile Navigation**
- Hamburger menu toggle
- Slide-out mobile menu
- Touch-friendly interactions
- Scroll-aware behavior

```javascript
class MobileMenu {
    openMenu() {
        APP_STATE.isMenuOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('mobile-active');
        // Calculate viewport height for scrollable menu
        const headerHeight = document.getElementById('header').offsetHeight;
        const maxHeight = window.innerHeight - headerHeight;
        this.menu.style.maxHeight = `${maxHeight}px`;
    }
}
```

### **2. Form System**

#### **Booking Form** (`booking.html`)
- Real-time validation
- Business rules (Sunday closed, time slots)
- WordPress API integration
- Success/error feedback

```javascript
class FormHandler {
    async submitForm(formType, formData) {
        if (formType === 'booking') {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                details: details,
                date: preferredDate
            };
            
            const endpoint = 'https://pakaranaianai.com/wp-json/kme/v1/booking-form';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
    }
}
```

#### **Contact Form** (`contact.html`)
- Multi-step validation
- Email format validation
- Malaysian phone number validation
- FAQ integration

### **3. Interactive Elements**

#### **Carousel System**
```javascript
class Carousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        this.slides = this.carousel.querySelectorAll('.cert-slide');
        this.currentIndex = 0;
        this.init();
    }
    
    next() {
        const maxIndex = this.slides.length - this.visibleSlides;
        this.currentIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }
}
```

#### **Popup System**
- Smart timing (20s desktop, 25s mobile)
- Scroll-based triggers
- Exit intent detection
- Session-based dismissal

### **4. Performance Features**

#### **Lazy Loading**
```javascript
class LazyLoader {
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                    }
                });
            });
        }
    }
}
```

#### **Scroll Animations**
```javascript
class ScrollAnimations {
    checkElements() {
        this.elements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animate-in')) {
                element.classList.add('animate-in');
            }
        });
    }
}
```

---

## 🚀 Development Workflow

### **1. Development Setup**

#### **Prerequisites**
```bash
# Required tools
- Node.js 16+
- npm 8+
- Git
```

#### **Development Server**
```bash
# Clone repository
git clone [repository-url]
cd kme-pest-control-website

# Install dependencies
npm install

# Start development server
npm run dev
# Opens http://localhost:3000
```

### **2. Build Process**

#### **Available Scripts**
```json
{
  "scripts": {
    "start": "node test-server.js",
    "dev": "node test-server.js", 
    "build": "npm run minify-css && npm run minify-js",
    "test": "npm run test:html && npm run test:css && npm run test:js",
    "validate-html": "npx html-validate *.html",
    "lighthouse": "npx lighthouse http://localhost:3000",
    "deploy": "vercel --prod"
  }
}
```

#### **Production Build**
```bash
# Build optimized assets
npm run build

# Validate code
npm run test

# Performance audit  
npm run lighthouse

# Deploy to production
npm run deploy
```

### **3. File Organization Best Practices**

#### **CSS Organization**
```css
/* 1. CSS Custom Properties */
:root { }

/* 2. Reset & Base Styles */
*, *::before, *::after { }

/* 3. Typography */
h1, h2, h3 { }

/* 4. Layout Components */
.container { }

/* 5. UI Components */
.button { }

/* 6. Page-Specific Styles */
.homepage-hero { }

/* 7. Responsive Overrides */
@media (min-width: 768px) { }
```

#### **JavaScript Organization**
```javascript
// 1. Constants & Configuration
const CONFIG = { };

// 2. Global State
const APP_STATE = { };

// 3. Utility Functions
const debounce = (func, wait) => { };

// 4. Component Classes
class ComponentName { }

// 5. Application Initialization
class App { }
```

---

## 🎨 Design System Implementation

### **Color Palette**
```css
:root {
    /* Primary Colors */
    --primary-blue: #4A90E2;      /* Main brand color */
    --secondary-blue: #357ABD;    /* Darker blue for hover */
    --accent-orange: #FF8C00;     /* Call-to-action color */
    
    /* Neutral Colors */
    --white: #FFFFFF;
    --light-gray: #F8F9FA;        /* Background sections */
    --medium-gray: #6C757D;       /* Text secondary */
    --dark-gray: #343A40;         /* Text primary */
    --black: #000000;
}
```

### **Typography System**
```css
/* Font Stack */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Heading Scales */
h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2rem); }
```

### **Spacing System**
```css
:root {
    --spacing-xs: 0.5rem;    /* 8px */
    --spacing-sm: 1rem;      /* 16px */
    --spacing-md: 1.5rem;    /* 24px */
    --spacing-lg: 2rem;      /* 32px */
    --spacing-xl: 3rem;      /* 48px */
    --spacing-xxl: 4rem;     /* 64px */
}
```

### **Component Patterns**

#### **Button Components**
```css
.btn {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
}

.btn--primary {
    background: var(--primary-blue);
    color: var(--white);
}

.btn--primary:hover {
    background: var(--secondary-blue);
    transform: translateY(-2px);
}
```

#### **Card Components**
```css
.card {
    background: var(--white);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-8px);
}
```

---

## 📊 Performance Guidelines

### **Core Web Vitals Targets**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **Optimization Techniques**

#### **1. CSS Optimization**
```css
/* Critical CSS inline dalam <head> */
/* Non-critical CSS loaded asynchronously */

/* Use transform untuk animations (GPU accelerated) */
.animate-element {
    transform: translateX(0);
    transition: transform 0.3s ease;
}

/* Avoid layout-triggering properties */
/* ❌ Bad */
.element { left: 100px; }

/* ✅ Good */
.element { transform: translateX(100px); }
```

#### **2. JavaScript Optimization**
```javascript
// Debounce expensive operations
const debouncedResize = debounce(() => {
    // Expensive operation
}, 250);

// Throttle scroll events
const throttledScroll = throttle(() => {
    // Scroll handler
}, 100);

// Lazy load non-critical features
const loadCarousel = () => {
    import('./carousel.js').then(module => {
        new module.Carousel('#gallery');
    });
};
```

#### **3. Image Optimization**
```html
<!-- Responsive images -->
<img src="image-mobile.jpg" 
     srcset="image-mobile.jpg 480w, image-tablet.jpg 768w, image-desktop.jpg 1024w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="Description"
     loading="lazy">

<!-- WebP with fallback -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

### **4. Loading Strategies**
```html
<!-- Critical resources -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.webp" as="image">

<!-- Non-critical resources -->
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">

<!-- JavaScript modules -->
<script type="module" src="main.js"></script>
<script nomodule src="main.legacy.js"></script>
```

---

## 🧪 Testing & Quality Assurance

### **Development Testing**

#### **HTML Validation**
```bash
# Validate all HTML files
npm run test:html

# Manual validation
npx html-validate pages/*.html
```

#### **CSS Validation**
```bash
# Check CSS syntax
npx stylelint assets/css/*.css

# Check unused CSS
npx purgecss --css assets/css/main.css --content *.html --output clean.css
```

#### **JavaScript Testing**
```bash
# Lint JavaScript
npx eslint assets/js/**/*.js

# Type checking (if using TypeScript)
npx tsc --noEmit
```

### **Performance Testing**

#### **Lighthouse Audits**
```bash
# Generate performance report
npm run lighthouse

# Specific categories
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility
```

#### **Manual Testing Checklist**
```
Frontend Testing Checklist:

Navigation:
□ Desktop navigation works
□ Mobile menu toggles correctly  
□ Dropdown menus function
□ Smooth scrolling active

Forms:
□ Booking form submits successfully
□ Contact form validation works
□ Error messages display properly
□ Success feedback shows

Responsive Design:
□ Mobile layout (< 768px)
□ Tablet layout (768px - 1023px)
□ Desktop layout (1024px+)
□ Large desktop layout (1440px+)

Performance:
□ Images load with lazy loading
□ Animations are smooth (60fps)
□ No layout shift during load
□ Fast First Contentful Paint

Browser Compatibility:
□ Chrome (latest 2 versions)
□ Firefox (latest 2 versions)
□ Safari (latest 2 versions)
□ Edge (latest 2 versions)
```

---

## 🚀 Deployment Guide

### **Pre-Deployment Checklist**
```bash
# 1. Build optimized assets
npm run build

# 2. Validate all code
npm run test

# 3. Performance audit
npm run lighthouse

# 4. Update API endpoints (production)
# Update assets/js/utils/api.js with production URLs

# 5. Verify vercel.json configuration
```

### **Vercel Deployment**

#### **Configuration** (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        }
      ]
    }
  ]
}
```

#### **Deployment Commands**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
npm run deploy
# or
vercel --prod
```

### **Post-Deployment Validation**
```bash
# Test live website
curl -I https://your-domain.vercel.app/

# Check all pages load
curl -I https://your-domain.vercel.app/about
curl -I https://your-domain.vercel.app/services
curl -I https://your-domain.vercel.app/contact

# Verify forms work
# Manual testing required for form submissions

# Performance check on live site
npx lighthouse https://your-domain.vercel.app/
```

---

## 🔧 Troubleshooting Guide

### **Common Issues & Solutions**

#### **1. JavaScript Errors**
```javascript
// Problem: Module not loading
// Solution: Check file paths and imports

// Problem: API calls failing
// Solution: Verify CORS settings and endpoints
const testAPI = async () => {
    try {
        const response = await fetch('https://api-endpoint');
        console.log(await response.json());
    } catch (error) {
        console.error('API Error:', error);
    }
};
```

#### **2. CSS Issues**
```css
/* Problem: Styles not applying */
/* Solution: Check specificity and selector validity */

/* Problem: Layout breaks on mobile */
/* Solution: Verify responsive breakpoints */
@media (max-width: 767px) {
    .desktop-only { display: none; }
}
```

#### **3. Performance Issues**
```html
<!-- Problem: Slow loading -->
<!-- Solution: Optimize images and defer non-critical resources -->

<link rel="preload" href="critical.css" as="style">
<link rel="prefetch" href="next-page.html">
```

### **Debug Tools**
```javascript
// Enable debug mode
const DEBUG = true;

// Console logging utility
const log = (message, data) => {
    if (DEBUG) {
        console.log(`[KME Debug] ${message}`, data);
    }
};

// Performance monitoring
const measurePerformance = (name, fn) => {
    if (DEBUG) {
        console.time(name);
        fn();
        console.timeEnd(name);
    } else {
        fn();
    }
};
```

---

## 📚 Resources & Documentation

### **Official Documentation**
- [MDN Web Docs](https://developer.mozilla.org/) - Web technologies reference
- [CSS-Tricks](https://css-tricks.com/) - CSS techniques and patterns
- [Web.dev](https://web.dev/) - Performance best practices
- [Vercel Docs](https://vercel.com/docs) - Deployment platform

### **Tools & Utilities**
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
- [BEM Methodology](https://getbem.com/) - CSS naming convention
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - WCAG 2.1

### **Internal Resources**
- `development/docs/` - Project-specific documentation
- `development/test-server.js` - Development server
- `package.json` - Project scripts and dependencies

---

## ✅ Frontend Development Best Practices

### **Code Quality Standards**
1. **Semantic HTML** - Use appropriate HTML5 elements
2. **Progressive Enhancement** - Start with core functionality
3. **Mobile-First CSS** - Design for mobile, enhance for desktop
4. **Modern JavaScript** - Use ES6+ features with appropriate polyfills
5. **Performance First** - Optimize for Core Web Vitals
6. **Accessibility** - WCAG 2.1 AA compliance
7. **Browser Support** - Latest 2 versions of major browsers

### **Maintenance Guidelines**
1. **Regular Updates** - Keep dependencies current
2. **Performance Monitoring** - Monthly Lighthouse audits  
3. **Code Reviews** - Peer review all changes
4. **Documentation** - Keep guides updated with changes
5. **Testing** - Test on real devices and browsers
6. **Backup Strategy** - Regular code repository backups

---

*Happy coding! Build amazing experiences for KME Pest Control customers! 🚀*
