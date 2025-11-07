/* ========================================
   KME Pest Control - Phase 3 Animation Enhancements
   Advanced Effects & Complex Interactions
   - Advanced 3D Effects
   - Particle Systems
   - Complex Parallax Scrolling
   - Advanced Carousels
   - Interactive Animations
   - Performance Monitoring
======================================== */

'use strict';

// ========================================
// ADVANCED 3D EFFECTS
// ========================================

class Advanced3DEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setup3DCards();
        this.setup3DButtons();
        this.setupServiceCards3D();
        this.setupMouseInteraction();
    }
    
    setup3DCards() {
        const cards3D = document.querySelectorAll('.card-3d');
        cards3D.forEach(card => {
            this.create3DCardFaces(card);
            card.addEventListener('mouseenter', (e) => {
                this.animate3DCardHover(card, e, true);
            });
            card.addEventListener('mousemove', (e) => {
                this.update3DCardRotation(card, e);
            });
            card.addEventListener('mouseleave', (e) => {
                this.animate3DCardHover(card, e, false);
            });
            card.addEventListener('click', () => {
                this.flip3DCard(card);
            });
        });
    }
    
    create3DCardFaces(card) {
        if (card.querySelector('.card-face')) return;
        const originalContent = card.innerHTML;
        card.innerHTML = `
            <div class="card-face front">
                ${originalContent}
            </div>
            <div class="card-face back">
                <div class="card-back-content">
                    <h3>More Info</h3>
                    <p>Additional details about this service</p>
                </div>
            </div>
        `;
    }
    
    animate3DCardHover(card, event, isHover) {
        if (isHover) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (event.clientX - centerX) / (rect.width / 2);
            const deltaY = (event.clientY - centerY) / (rect.height / 2);
            const rotateY = deltaX * 15;
            const rotateX = -deltaY * 15;
            card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(50px)`;
        } else {
            card.style.transform = '';
        }
    }
    
    update3DCardRotation(card, event) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (event.clientX - centerX) / (rect.width / 2);
        const deltaY = (event.clientY - centerY) / (rect.height / 2);
        const rotateY = deltaX * 10;
        const rotateX = -deltaY * 10;
        card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(30px)`;
    }
    
    flip3DCard(card) {
        card.classList.toggle('flipped');
    }
    
    setup3DButtons() {
        const buttons3D = document.querySelectorAll('.btn-3d');
        buttons3D.forEach(btn => {
            btn.classList.add('btn-3d');
            btn.addEventListener('mouseenter', (e) => {
                this.animate3DButton(btn, e, true);
            });
            btn.addEventListener('mouseleave', (e) => {
                this.animate3DButton(btn, e, false);
            });
        });
    }
    
    animate3DButton(button, event, isHover) {
        if (isHover) {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (event.clientX - centerX) / (rect.width / 2);
            const deltaY = (event.clientY - centerY) / (rect.height / 2);
            const rotateY = deltaX * 5;
            const rotateX = -deltaY * 5;
            button.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            button.style.transform = '';
        }
    }
    
    setupServiceCards3D() {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.classList.add('service-card-3d');
            card.addEventListener('mouseenter', (e) => {
                this.animateServiceCard3D(card, e, true);
            });
            card.addEventListener('mouseleave', (e) => {
                this.animateServiceCard3D(card, e, false);
            });
        });
    }
    
    animateServiceCard3D(card, event, isHover) {
        if (isHover) {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (event.clientX - centerX) / (rect.width / 2);
            const deltaY = (event.clientY - centerY) / (rect.height / 2);
            const rotateY = -deltaX * 8;
            const rotateX = deltaY * 8;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
        } else {
            card.style.transform = '';
        }
    }
    
    setupMouseInteraction() {
        document.addEventListener('mousemove', (e) => {
            this.updateGlobalMousePosition(e);
        });
    }
    
    updateGlobalMousePosition(event) {
        const x = (event.clientX / window.innerWidth) - 0.5;
        const y = (event.clientY / window.innerHeight) - 0.5;
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
    }
}

// ========================================
// PARTICLE SYSTEMS
// ========================================

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.init();
    }
    
    init() {
        this.createCanvas();
        if (!this.canvas) return;
        this.setupParticles();
        this.startAnimation();
        this.setupInteractiveParticles();
    }
    
    createCanvas() {
        const heroSection = document.querySelector('.value-prop-hero');
        if (!heroSection) return;
        const container = document.createElement('div');
        container.className = 'particles-container';
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        heroSection.appendChild(container);
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }
    
    setupParticles() {
        if (!this.canvas) return;
        const particleCount = window.innerWidth < 768 ? 20 : 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const width = this.canvas ? this.canvas.width : window.innerWidth;
        const height = this.canvas ? this.canvas.height : window.innerHeight;
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#6ec1e4' : '#f58220'
        };
    }
    
    startAnimation() {
        if (!this.ctx) return;
        const animate = () => {
            this.updateParticles();
            this.drawParticles();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    setupInteractiveParticles() {
        if (!this.canvas) return;
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.attractParticles(mouseX, mouseY);
        });
    }
    
    attractParticles(mouseX, mouseY) {
        this.particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                const force = (100 - distance) / 1000;
                particle.vx += dx * force;
                particle.vy += dy * force;
            }
        });
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.remove();
        }
    }
}

// ========================================
// COMPLEX PARALLAX SCROLLING
// ========================================

class ComplexParallax {
    constructor() {
        this.elements = [];
        this.ticking = false;
        this.init();
    }
    
    init() {
        this.setupParallaxElements();
        this.setupScrollListener();
        this.setupMouseParallax();
    }
    
    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const direction = element.dataset.parallaxDirection || 'vertical';
            this.elements.push({
                element,
                speed,
                direction,
                originalTransform: element.style.transform
            });
            element.classList.add('parallax-element-advanced');
        });
    }
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    updateParallax() {
        const scrollY = window.pageYOffset;
        this.elements.forEach(({ element, speed, direction }) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            const isInView = (elementTop < scrollY + windowHeight) && (elementTop + elementHeight > scrollY);
            if (isInView) {
                const progress = (scrollY - elementTop + windowHeight) / (windowHeight + elementHeight);
                const clampedProgress = Math.max(0, Math.min(1, progress));
                let offset = 0;
                if (direction === 'vertical') {
                    offset = (clampedProgress - 0.5) * 100 * speed;
                    element.style.setProperty('--scroll-y', `${offset}px`);
                } else if (direction === 'horizontal') {
                    offset = (clampedProgress - 0.5) * 100 * speed;
                    element.style.setProperty('--scroll-x', `${offset}px`);
                }
            }
        });
    }
    
    setupMouseParallax() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            document.documentElement.style.setProperty('--mouse-parallax-x', mouseX);
            document.documentElement.style.setProperty('--mouse-parallax-y', mouseY);
        });
    }
}

// ========================================
// ADVANCED CAROUSELS
// ========================================

class AdvancedCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        this.currentIndex = 0;
        this.items = [];
        this.autoRotateTimer = null;
        this.init();
    }
    
    init() {
        this.setup3DCarousel();
        this.setupNavigation();
        this.setupAutoRotate();
        this.setupKeyboardControls();
    }
    
    setup3DCarousel() {
        const items = this.carousel.querySelectorAll('.carousel-3d-item');
        this.items = Array.from(items);
        if (this.items.length === 0) return;
        this.carousel.classList.add('carousel-3d');
        const inner = document.createElement('div');
        inner.className = 'carousel-3d-inner';
        this.items.forEach(item => {
            inner.appendChild(item);
        });
        this.carousel.appendChild(inner);
        this.inner = inner;
        this.updateCarousel();
    }
    
    setupNavigation() {
        const nav = document.createElement('div');
        nav.className = 'carousel-3d-nav';
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-3d-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.prev());
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-3d-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.next());
        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);
        this.carousel.appendChild(nav);
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateCarousel();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.inner) return;
        const rotation = -(this.currentIndex * (360 / this.items.length));
        this.inner.style.transform = `rotateY(${rotation}deg)`;
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    setupAutoRotate() {
        this.startAutoRotate();
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoRotate();
        });
        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoRotate();
        });
    }
    
    startAutoRotate() {
        this.stopAutoRotate();
        this.autoRotateTimer = setInterval(() => {
            this.next();
        }, 4000);
    }
    
    stopAutoRotate() {
        if (this.autoRotateTimer) {
            clearInterval(this.autoRotateTimer);
            this.autoRotateTimer = null;
        }
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.carousel.matches(':hover')) return;
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prev();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
            }
        });
    }
}

// ========================================
// INTERACTIVE ANIMATIONS
// ========================================

class InteractiveAnimations {
    constructor() {
        this.mouseFollower = null;
        this.init();
    }
    
    init() {
        this.setupMagneticElements();
    }
    
    setupMouseFollower() {
        if ('ontouchstart' in window) return;
        this.mouseFollower = document.createElement('div');
        this.mouseFollower.className = 'mouse-follower';
        document.body.appendChild(this.mouseFollower);
        document.addEventListener('mousemove', (e) => {
            this.updateMouseFollower(e);
        });
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .certificate-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.mouseFollower.classList.add('active');
            });
            element.addEventListener('mouseleave', () => {
                this.mouseFollower.classList.remove('active');
            });
        });
    }
    
    updateMouseFollower(event) {
        if (!this.mouseFollower) return;
        const x = event.clientX;
        const y = event.clientY;
        this.mouseFollower.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    }
    
    setupMagneticElements() {
        const magneticElements = document.querySelectorAll('.btn');
        magneticElements.forEach(element => {
            element.classList.add('magnetic-element');
            element.addEventListener('mousemove', (e) => {
                this.updateMagneticElement(element, e);
            });
            element.addEventListener('mouseleave', () => {
                this.resetMagneticElement(element);
            });
        });
        const socialIcons = document.querySelectorAll('.social-icon.magnetic-element');
        socialIcons.forEach(icon => {
            icon.classList.remove('magnetic-element');
            icon.style.removeProperty('--magnetic-x');
            icon.style.removeProperty('--magnetic-y');
        });
    }
    
    updateMagneticElement(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (event.clientX - centerX) / (rect.width / 2);
        const deltaY = (event.clientY - centerY) / (rect.height / 2);
        element.style.setProperty('--magnetic-x', deltaX * 0.3);
        element.style.setProperty('--magnetic-y', deltaY * 0.3);
    }
    
    resetMagneticElement(element) {
        element.style.setProperty('--magnetic-x', 0);
        element.style.setProperty('--magnetic-y', 0);
    }
    
    setupInteractiveZones() {
        const zones = document.querySelectorAll('.hero-content, .section-header');
        zones.forEach(zone => {
            zone.classList.add('interactive-zone');
            zone.addEventListener('mousemove', (e) => {
                this.updateInteractiveZone(zone, e);
            });
        });
    }
    
    updateInteractiveZone(zone, event) {
        const rect = zone.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        zone.style.setProperty('--cursor-x', `${x}px`);
        zone.style.setProperty('--cursor-y', `${y}px`);
    }
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            animations: 0,
            renderTime: 0
        };
        this.isVisible = false;
        this.hud = null;
        this.init();
    }
    
    init() {
        this.createHUD();
        this.startMonitoring();
        this.setupToggle();
    }
    
    createHUD() {
        this.hud = document.createElement('div');
        this.hud.className = 'performance-hud';
        this.hud.innerHTML = `
            <div class="performance-metric">
                <span>FPS:</span>
                <span class="metric-value" id="fps-value">0</span>
            </div>
            <div class="performance-metric">
                <span>Memory:</span>
                <span class="metric-value" id="memory-value">0 MB</span>
            </div>
            <div class="performance-metric">
                <span>Animations:</span>
                <span class="metric-value" id="animations-value">0</span>
            </div>
            <div class="performance-metric">
                <span>Render:</span>
                <span class="metric-value" id="render-value">0ms</span>
            </div>
        `;
        document.body.appendChild(this.hud);
    }
    
    startMonitoring() {
        let lastTime = performance.now();
        let frames = 0;
        const monitor = () => {
            const currentTime = performance.now();
            frames++;
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.updateFPS();
                frames = 0;
                lastTime = currentTime;
            }
            this.updateMemory();
            this.updateAnimationCount();
            requestAnimationFrame(monitor);
        };
        monitor();
    }
    
    updateFPS() {
        const fpsValue = document.getElementById('fps-value');
        if (!fpsValue) return;
        fpsValue.textContent = this.metrics.fps;
        fpsValue.className = 'metric-value ' + this.getFPSClass(this.metrics.fps);
    }
    
    getFPSClass(fps) {
        if (fps >= 55) return 'good';
        if (fps >= 30) return 'warning';
        return 'critical';
    }
    
    updateMemory() {
        if (!performance.memory) return;
        const memoryValue = document.getElementById('memory-value');
        if (!memoryValue) return;
        const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
        memoryValue.textContent = `${used} MB`;
        memoryValue.className = 'metric-value ' + this.getMemoryClass(used);
    }
    
    getMemoryClass(memory) {
        if (memory < 50) return 'good';
        if (memory < 100) return 'warning';
        return 'critical';
    }
    
    updateAnimationCount() {
        const animationsValue = document.getElementById('animations-value');
        if (!animationsValue) return;
        const activeAnimations = document.querySelectorAll('[style*="transform"], [style*="animation"]').length;
        animationsValue.textContent = activeAnimations;
        animationsValue.className = 'metric-value ' + this.getAnimationClass(activeAnimations);
    }
    
    getAnimationClass(count) {
        if (count < 20) return 'good';
        if (count < 50) return 'warning';
        return 'critical';
    }
    
    setupToggle() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                this.toggle();
            }
        });
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        this.hud.classList.toggle('visible', this.isVisible);
        if (this.isVisible) {
            document.body.classList.add('debug-mode');
        } else {
            document.body.classList.remove('debug-mode');
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

class Phase3Animations {
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
            this.advanced3DEffects = new Advanced3DEffects();
            // this.particleSystem = new ParticleSystem(); // 🔒 Disabled - Removed moving circles
            this.complexParallax = new ComplexParallax();
            this.advancedCarousel = new AdvancedCarousel('#testimonials-carousel-3d');
            this.interactiveAnimations = new InteractiveAnimations();
            // this.performanceMonitor = new PerformanceMonitor(); // 🔒 Performance monitor disabled
            
            console.log('Phase 3 Advanced Animations initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Phase 3 animations:', error);
        }
    }
    
    destroy() {
        if (this.particleSystem) {
            this.particleSystem.destroy();
        }
        if (this.advancedCarousel) {
            this.advancedCarousel.stopAutoRotate();
        }
    }
}

// ========================================
// AUTO-INITIALIZE
// ========================================

// Initialize Phase 3 animations
window.phase3Animations = new Phase3Animations();

// Export for external use
window.Phase3Animations = {
    Advanced3DEffects,
    ParticleSystem,
    ComplexParallax,
    AdvancedCarousel,
    InteractiveAnimations,
    PerformanceMonitor
};

// Cleanup with Page Visibility API (safer alternative)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.phase3Animations) {
        window.phase3Animations.destroy();
    }
});