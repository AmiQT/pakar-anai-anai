import React from 'react';

const LegacyFooter: React.FC = () => {
    const getPath = (relativePath: string) => {
        const currentPath = window.location.pathname;

        if (currentPath.includes('/pages/services/')) {
            if (relativePath === '') return '../../index.html';
            if (relativePath.startsWith('pages/')) return `../${relativePath.replace('pages/', '')}`;
            return `../${relativePath}`;
        }
        if (currentPath.includes('/pages/')) {
            if (relativePath === '') return '../index.html';
            if (relativePath.startsWith('pages/')) return relativePath.replace('pages/', '');
            return `../${relativePath}`;
        }
        // Root path
        return relativePath || 'index.html';
    };

    const getLogoPath = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/services/')) return '../../assets/images/home/kme-logo-softcopy-03.webp';
        if (currentPath.includes('/pages/')) return '../assets/images/home/kme-logo-softcopy-03.webp';
        return 'assets/images/home/kme-logo-softcopy-03.webp';
    };

    return (
        <footer id="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Company Info */}
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src={getLogoPath()} alt="KME Pest Control" />
                        </div>
                        <p>KME Pest Control adalah syarikat kawalan serangga yang dipercayai di Pahang dan Terengganu dengan pengalaman lebih 15 tahun.</p>
                        <div className="footer-contact">
                            <p><i className="fas fa-map-marker-alt"></i> A13, Ground Floor Lorong IM2, Bandar Indera Mahkota, 25200 Kuantan, Pahang</p>
                            <p><i className="fas fa-phone"></i> +6011 2962 3741</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href={getPath('')}>Homepage</a></li>
                            <li><a href={getPath('pages/about.html')}>About Us</a></li>
                            <li><a href={getPath('pages/services.html')}>Services</a></li>
                            <li><a href={getPath('pages/contact.html')}>Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-section">
                        <h3>Our Services</h3>
                        <ul>
                            <li><a href={getPath('pages/services.html#ST')}>Soil Treatment</a></li>
                            <li><a href={getPath('pages/services.html#CT')}>Corrective Treatment</a></li>
                            <li><a href={getPath('pages/services.html')}>All Services</a></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="footer-section">
                        <h3>Follow Us</h3>
                        <div className="footer-social">
                            <a href="https://www.facebook.com/KMEpestcontrol" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com/kmepest/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.tiktok.com/@kme.pest.control?_r=1&_t=ZS-91SXqOgl1kt" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                <i className="fab fa-tiktok"></i>
                            </a>
                        </div>
                        <p>Follow kami untuk tips dan updates terkini tentang kawalan serangga!</p>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p>&copy; 2024 KME Pest Control. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <a href={getPath('pages/contact.html')}>Privacy Policy</a>
                            <a href="#terms">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LegacyFooter;
