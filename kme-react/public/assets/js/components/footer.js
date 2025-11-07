// Reusable Footer Component
class FooterComponent {
    constructor() {
        this.footerHTML = this.createFooterHTML();
    }

    createFooterHTML() {
        return `
            <footer id="footer">
                <div class="footer-top">
                    <div class="container">
                        <div class="footer-content">
                            <!-- Company Info -->
                            <div class="footer-section">
                                <div class="footer-logo">
                                    <img src="${this.getLogoPath()}" alt="KME Pest Control">
                                </div>
                                <p>KME Pest Control adalah syarikat kawalan serangga yang dipercayai di Pahang dan Terengganu dengan pengalaman lebih 15 tahun.</p>
                                <div class="footer-contact">
                                    <p><i class="fas fa-map-marker-alt"></i> A13, Ground Floor Lorong IM2, Bandar Indera Mahkota, 25200 Kuantan, Pahang</p>
                                    <p><i class="fas fa-phone"></i> +6011 2962 3741</p>
                                </div>
                            </div>

                            <!-- Quick Links -->
                            <div class="footer-section">
                                <h3>Quick Links</h3>
                                <ul class="footer-links">
                                    <li><a href="${this.getLinkPath('')}">Homepage</a></li>
                                    <li><a href="${this.getLinkPath('pages/about.html')}">About Us</a></li>
                                    <li><a href="${this.getLinkPath('pages/services.html')}">Services</a></li>
                                    <li><a href="${this.getLinkPath('pages/contact.html')}">Contact Us</a></li>
                                </ul>
                            </div>

                            <!-- Services -->
                            <div class="footer-section">
                                <h3>Our Services</h3>
                                <ul class="footer-links">
                                    <li><a href="${this.getLinkPath('pages/services.html#ST')}">Soil Treatment</a></li>
                                    <li><a href="${this.getLinkPath('pages/services.html#BT')}">Bat Prevention</a></li>
                                    <li><a href="${this.getLinkPath('pages/services.html#CT')}">Corrective Treatment</a></li>
                                    <li><a href="${this.getLinkPath('pages/services.html')}">All Services</a></li>
                                </ul>
                            </div>

                            <!-- Social Media -->
                            <div class="footer-section">
                                <h3>Follow Us</h3>
                                <div class="footer-social">
                                    <a href="https://www.facebook.com/KMEpestcontrol" target="_blank">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="https://www.instagram.com/kmepest/" target="_blank">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                    <a href="https://www.tiktok.com/@kme.pest.control?_t=ZS-90wRGAfsTQo&_r=1" target="_blank">
                                        <i class="fab fa-tiktok"></i>
                                    </a>
                                    <a href="https://www.youtube.com/@kmepestcontrol8065" target="_blank">
                                        <i class="fab fa-youtube"></i>
                                    </a>
                                </div>
                                <p>Follow kami untuk tips dan updates terkini tentang kawalan serangga!</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <div class="container">
                        <div class="footer-bottom-content">
                            <p>&copy; 2024 KME Pest Control. All rights reserved.</p>
                            <div class="footer-bottom-links">
                                <a href="${this.getLinkPath('pages/contact.html')}">Privacy Policy</a>
                                <a href="#terms">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    // Automatically detect current page location and adjust paths
    getCurrentPath() {
        const currentPath = window.location.pathname;
        
        // Check if we're in root directory
        if (currentPath === '/' || currentPath.endsWith('index.html') || !currentPath.includes('/pages/')) {
            return 'root';
        }
        
        // Check if we're in pages directory
        if (currentPath.includes('/pages/') && !currentPath.includes('/services/')) {
            return 'pages';
        }
        
        // Check if we're in services subdirectory
        if (currentPath.includes('/services/')) {
            return 'services';
        }
        
        return 'root';
    }

    getLinkPath(relativePath) {
        const currentPath = this.getCurrentPath();
        
        switch (currentPath) {
            case 'root':
                return relativePath || 'index.html';
            case 'pages':
                if (relativePath === '') return '../index.html';
                if (relativePath.startsWith('pages/')) {
                    return relativePath.replace('pages/', '');
                }
                return relativePath;
            case 'services':
                if (relativePath === '') return '../../index.html';
                if (relativePath.startsWith('pages/services/')) {
                    return relativePath.replace('pages/services/', '');
                } else if (relativePath.startsWith('pages/')) {
                    return '../' + relativePath.replace('pages/', '');
                }
                return '../' + relativePath;
            default:
                return relativePath;
        }
    }

    getLogoPath() {
        const currentPath = this.getCurrentPath();
        
        switch (currentPath) {
            case 'root':
                return 'assets/images/home/kme-logo-softcopy-03.webp';
            case 'pages':
                return '../assets/images/home/kme-logo-softcopy-03.webp';
            case 'services':
                return '../../assets/images/home/kme-logo-softcopy-03.webp';
            default:
                return 'assets/images/home/kme-logo-softcopy-03.webp';
        }
    }

    // Method to render footer
    render(targetSelector = 'body') {
        // Remove existing footer if any
        const existingFooter = document.querySelector('#footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // Insert footer HTML
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.insertAdjacentHTML('beforeend', this.footerHTML);
        } else {
            // Fallback: append to body
            document.body.insertAdjacentHTML('beforeend', this.footerHTML);
        }
    }

    // Initialize footer (call this when DOM is ready)
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }
}

// Export for use in other files
window.FooterComponent = FooterComponent;

// Auto-initialize footer
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if no footer already exists
    if (!document.querySelector('#footer')) {
        const footer = new FooterComponent();
        footer.render();
    }
});
