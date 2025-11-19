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
        <footer id="footer" className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-[#1a2e6b] text-white py-16 pb-5 bg-footer-grid">
            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr,1fr] gap-10 mb-10">
                    {/* Company Info */}
                    <div className="footer-section">
                        <div className="mb-4">
                            <img src={getLogoPath()} alt="KME Pest Control" className="w-32" />
                        </div>
                        <p className="text-white/80 leading-relaxed mb-5 text-base">KME Pest Control adalah syarikat kawalan serangga yang dipercayai di Pahang dan Terengganu dengan pengalaman lebih 15 tahun.</p>
                        <div className="text-sm">
                            <p className="flex items-center gap-2.5 mb-2.5"><i className="fas fa-map-marker-alt text-brand-blue w-5"></i> A13, Ground Floor Lorong IM2, Bandar Indera Mahkota, 25200 Kuantan, Pahang</p>
                            <p className="flex items-center gap-2.5 mb-2.5"><i className="fas fa-phone text-brand-blue w-5"></i> +6011 2962 3741</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><a href={getPath('')} className="text-white/80 text-base transition-colors duration-200 block py-1 hover:text-brand-blue">Homepage</a></li>
                            <li><a href={getPath('pages/about.html')} className="text-white/80 text-base transition-colors duration-200 block py-1 hover:text-brand-blue">About Us</a></li>
                            <li><a href={getPath('pages/services.html')} className="text-white/80 text-base transition-colors duration-200 block py-1 hover:text-brand-blue">Services</a></li>
                            <li><a href={getPath('pages/contact.html')} className="text-white/80 text-base transition-colors duration-200 block py-1 hover:text-brand-blue">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-section">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Our Services</h3>
                        <ul className="space-y-3">
                            <li><a href={getPath('pages/services.html#ST')} className="text-white/80 text-base transition-colors duration-200 block py-1 hover:text-brand-blue">Soil Treatment</a></li>
                            <li><a href={getPath('pages/services.html#CT')} className="text-white/80 text-base transition-colors duration-200 block py-1 hover:text-brand-blue">Corrective Treatment</a></li>
                            <li><a href={getPath('pages/services.html')} className="text-white/80 text-base transition-colors duration-200 block py-1 hover:text-brand-blue">All Services</a></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="footer-section">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-4">Follow Us</h3>
                        <div className="flex gap-4 mb-5">
                            <a href="https://www.facebook.com/KMEpestcontrol" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 text-white/80 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:text-white hover:bg-brand-blue hover:border-brand-blue hover:-translate-y-1">
                                <i className="fab fa-facebook-f text-lg"></i>
                            </a>
                            <a href="https://www.instagram.com/kmepest/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 text-white/80 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:text-white hover:bg-brand-blue hover:border-brand-blue hover:-translate-y-1">
                                <i className="fab fa-instagram text-lg"></i>
                            </a>
                            <a href="https://www.tiktok.com/@kme.pest.control?_r=1&_t=ZS-91SXqOgl1kt" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-11 h-11 text-white/80 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:text-white hover:bg-brand-blue hover:border-brand-blue hover:-translate-y-1">
                                <i className="fab fa-tiktok text-lg"></i>
                            </a>
                        </div>
                        <p className="text-white/80 leading-relaxed text-base">Follow kami untuk tips dan updates terkini tentang kawalan serangga!</p>
                    </div>
                </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 relative z-10">
                <div className="container mx-auto flex justify-between items-center flex-wrap gap-5">
                    <p className="text-white/70 text-base">&copy; 2024 KME Pest Control. All rights reserved.</p>
                    <div className="flex gap-5">
                        <a href={getPath('pages/contact.html')} className="text-white/70 text-sm transition-colors duration-200 hover:text-brand-blue">Privacy Policy</a>
                        <a href="#terms" className="text-white/70 text-sm transition-colors duration-200 hover:text-brand-blue">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LegacyFooter;
