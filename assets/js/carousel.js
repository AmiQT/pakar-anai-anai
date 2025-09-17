// Reference Design Inspired Carousel
document.addEventListener('DOMContentLoaded', function() {
    const servicesGrid = document.getElementById('servicesGrid');
    const prevButton = document.getElementById('carouselPrev');
    const nextButton = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    
    if (!servicesGrid || !prevButton || !nextButton) return;
    
    let currentSlide = 0;
    const totalSlides = 2; // 2 sets of cards
    
    // Calculate scroll amount based on screen size
    function getScrollAmount() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) return 292; // Mobile: 280px + 12px
        if (screenWidth <= 768) return 276; // Tablet: 260px + 16px
        return 320; // Desktop: 300px + 20px
    }
    
    // Previous button functionality
    prevButton.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });
    
    // Next button functionality
    nextButton.addEventListener('click', function() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    });
    
    // Dots functionality
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateCarousel();
        });
    });
    
    // Update carousel position and dots
    function updateCarousel() {
        const scrollAmount = getScrollAmount() * currentSlide;
        servicesGrid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        updateButtonVisibility();
    }
    
    // Update button visibility based on current slide
    function updateButtonVisibility() {
        // Hide/show prev button
        if (currentSlide <= 0) {
            prevButton.style.opacity = '0.5';
            prevButton.style.pointerEvents = 'none';
        } else {
            prevButton.style.opacity = '1';
            prevButton.style.pointerEvents = 'auto';
        }
        
        // Hide/show next button
        if (currentSlide >= totalSlides - 1) {
            nextButton.style.opacity = '0.5';
            nextButton.style.pointerEvents = 'none';
        } else {
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
        }
    }
    
    // Initial setup
    updateCarousel();
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDown = false;
    
    servicesGrid.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDown = true;
    });
    
    servicesGrid.addEventListener('touchmove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            const scrollAmount = getScrollAmount();
            if (diff > 0) {
                // Swipe left - next
                servicesGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                // Swipe right - prev
                servicesGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
            isDown = false;
        }
    });
    
    servicesGrid.addEventListener('touchend', function() {
        isDown = false;
    });
    
    // Handle resize to recalculate scroll amounts
    window.addEventListener('resize', updateButtonVisibility);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
});
