import { useState } from 'react'

const PageContent = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    if (window.innerWidth <= 768) {
      e.preventDefault()
      setActiveDropdown(activeDropdown === name ? null : name)
    }
  }

  return (
  <div>
  {/* Header */}
  <header id="header">
    {/* Top Contact Bar - Redesigned Layout */}
    <div className="top-contact-bar">
      <div className="container">
        {/* Left: Logo + Contact grouped together */}
        <div className="header-left-group">
          <div className="header-logo">
            <a href="index.html">
              <img src="assets/images/home/kme-logo-softcopy-03.webp" alt="KME Pest Control Logo" className="header-logo-img" />
            </a>
          </div>
          <div className="header-contact">
            <a href="https://wsap.to/kmepestcontrol" className="contact-whatsapp-text">
              Hubungi Kami (+6011 2962 3741)
            </a>
          </div>
        </div>
        {/* Right: Social Media Icons */}
        <div className="header-social">
          <a href="https://www.facebook.com/KMEpestcontrol" target="_blank" className="social-icon" aria-label="Ikuti kami di Facebook">
            <i className="fa-brands fa-facebook-f" />
          </a>
          <a href="https://www.instagram.com/kmepest/" target="_blank" className="social-icon" aria-label="Ikuti kami di Instagram">
            <i className="fa-brands fa-instagram" />
          </a>
          <a href="https://www.tiktok.com/@kme.pest.control?_t=ZS-90wRGAfsTQo&_r=1" target="_blank" className="social-icon" aria-label="Ikuti kami di TikTok">
            <i className="fa-brands fa-tiktok" />
          </a>
        </div>
      </div>
    </div>
    {/* Main Navigation - Exact Match Original */}
    <nav className="main-navigation">
      <div className="container">
        <div className="nav-logo">
          <a href="index.html">
            <img src="assets/images/home/kme-logo-softcopy-03.webp" alt="KME Pest Control Logo" className="logo-img" />
          </a>
        </div>
        <ul className="navigation-menu" id="nav-menu">
          <li className="nav-item">
            <a href="index.html" className="nav-link active">HOME</a>
          </li>
          <li className="nav-item has-dropdown">
            <a href="#" className="nav-link" onClick={(e) => toggleDropdown(e, 'about')}>
              ABOUT US <i className="fas fa-chevron-down dropdown-arrow" />
            </a>
            <ul className={`dropdown-submenu ${activeDropdown === 'about' ? 'active' : ''}`}>
              <li><a href="pages/about.html">Company Info</a></li>
              <li><a href="pages/testimoni.html">Testimonials</a></li>
              <li><a href="pages/gallery.html">Gallery</a></li>
            </ul>
          </li>
          <li className="nav-item has-dropdown">
            <a href="#" className="nav-link" onClick={(e) => toggleDropdown(e, 'services')}>
              SERVICES <i className="fas fa-chevron-down dropdown-arrow" />
            </a>
            <ul className={`dropdown-submenu ${activeDropdown === 'services' ? 'active' : ''}`}>
              <li><a href="pages/services.html#CT">Anai-Anai: Corrective Treatment</a></li>
              <li><a href="pages/services.html#ST">Anai-Anai: Soil Treatment</a></li>
              <li><a href="pages/services.html#BS">Anai-Anai: Baiting System</a></li>
              <li><a href="pages/services.html#PP">Semut, Tikus &amp; Lipas: Pest Protection</a></li>
            </ul>
          </li>
          <li className="nav-item">
            <a href="pages/contact.html" className="nav-link">CONTACT</a>
          </li>
        </ul>
        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" id="mobile-toggle">
          <span className="toggle-line" />
          <span className="toggle-line" />
          <span className="toggle-line" />
        </div>
      </div>
    </nav>
  </header>
  {/* Main Content */}
  <main id="main-content">
    {/* Value Proposition Hero Section */}
    <section className="value-prop-hero" data-scroll-animation="fade-up">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="value-proposition">
              <h1>Pakar Anai-Anai Pilihan</h1>
              <h1 className="hero-subtitle-year">Sejak Tahun 2007</h1>
              <div className="key-benefits" data-parallax="0.1">
                <div className="benefit-item">
                  <i className="fas fa-shield-alt" />
                  <span>Jaminan - 3 Tahun / 7 Tahun</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-certificate" />
                  <span>Berdaftar dengan Jabatan Pertanian Malaysia</span>
                </div>
              </div>
              <div className="primary-cta-container">
                <a href="https://wsap.to/kmepestcontrol" className="btn-whatsapp-primary" target="_blank">
                  <i className="fab fa-whatsapp" />
                  <div className="cta-content">
                    <span className="cta-main">HUBUNGI KAMI</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="media-showcase">
              {/* Featured Video - Awani */}
              <div className="awani-video-section">
                <div className="video-testimonial-card awani-video-card">
                  <div className="facebook-video-container coming-soon-placeholder">
                    {/* Video placeholder - Coming Soon */}
                  </div>
                  <div className="video-info">
                    <h4>
                      <i className="fas fa-tv" />
                      COMING SOON
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Trust Stats moved into Services Intro below */}
    {/* Maklum Balas Pelanggan - Facebook Video Testimonials */}
    <section className="video-testimonials-section" data-scroll-animation="fade-up">
      <div className="container">
        <div className="section-header" data-scroll-animation="fade-up">
          <h2>Maklum Balas Pelanggan</h2>
        </div>
        <div className="video-testimonials-grid">
          {/* Video Testimonial 1 - MR KEITH KHOO */}
          <div className="video-testimonial-card" data-scroll-animation="fade-up" data-scroll-stagger>
            <div className="facebook-video-container">
              <iframe loading="lazy" title="Video Testimoni Pelanggan - MR KEITH KHOO" src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Ffb.watch%2FC5Qs6WGNhU%2F&show_text=false&width=560&t=0" width="100%" height={314} style={{border: 'none', overflow: 'hidden'}} scrolling="no" frameBorder={0} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
              </iframe>
            </div>
            <div className="video-info">
              <h3>MR KEITH KHOO</h3>
              <p className="testimonial-quote">"Testimoni pelanggan yang berpuas hati dengan servis KME Pest Control"</p>
              <div className="rating"><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i></div>
            </div>
          </div>
          {/* Video Testimonial 2 - ENCIK MUHYIDDIN */}
          <div className="video-testimonial-card" data-scroll-animation="fade-up" data-scroll-stagger>
            <div className="facebook-video-container">
              <iframe loading="lazy" title="Video Testimoni Pelanggan - ENCIK MUHYIDDIN" src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1568372034144915%2F&show_text=false&width=560&t=0" width="100%" height={314} style={{border: 'none', overflow: 'hidden'}} scrolling="no" frameBorder={0} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
              </iframe>
            </div>
            <div className="video-info">
              <h3>ENCIK MUHYIDDIN</h3>
              <p className="testimonial-quote">"Pengalaman positif dengan servis profesional KME Pest Control"</p>
              <div className="rating"><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i></div>
            </div>
          </div>
          {/* Video Testimonial 3 - MR. DIN */}
          <div className="video-testimonial-card" data-scroll-animation="fade-up" data-scroll-stagger>
            <div className="facebook-video-container">
              <iframe loading="lazy" title="Video Testimoni Pelanggan - MR. DIN" src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1821995905335865%2F&show_text=false&width=560&t=0" width="100%" height={314} style={{border: 'none', overflow: 'hidden'}} scrolling="no" frameBorder={0} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
              </iframe>
            </div>
            <div className="video-info">
              <h3>MR. DIN</h3>
              <p className="testimonial-quote">"Berpuas hati dengan hasil rawatan dan servis yang diberikan"</p>
              <div className="rating"><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i></div>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="video-testimonials-cta">
          <h3>Sertai 10,000+ Pelanggan Yang Sudah Bebas Anai-Anai!</h3>
          <div className="cta-buttons">
            <a href="pages/testimoni.html" className="btn-outline">
              <span>Lihat Semua Testimoni</span>
              <i className="fas fa-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </section>
    {/* Services Section - Clean CTA + Trust Stats Combined */}
    <section className="services-intro" data-scroll-animation="fade-up">
      <div className="container">
        <h2 data-scroll-animation="fade-up">Kenapa Pilih KME?</h2>
        <p>Peneraju dalam industry kawalan serangga dengan komitmen memberikan servis terbaik untuk kebersihan dan keselamatan rumah anda.</p>
        <div className="services-highlights">
          <div className="highlight-item" data-scroll-animation="fade-left" data-scroll-stagger>
            <i className="fas fa-award" />
            <span>15+ Years Experience</span>
          </div>
          <div className="highlight-item" data-scroll-animation="fade-up" data-scroll-stagger>
            <i className="fas fa-shield-alt" />
            <span>Licensed &amp; Insured</span>
          </div>
          <div className="highlight-item" data-scroll-animation="fade-right" data-scroll-stagger>
            <i className="fas fa-handshake" />
            <span>Money Back Guarantee</span>
          </div>
        </div>
      </div>
    </section>
    {/* Main Services Section - Enhanced Design */}
    <section className="main-services-section">
      <div className="container">
        <h2 style={{textAlign: 'center', marginBottom: 40, color: 'var(--black)'}}>MAIN SERVICES</h2>
        <div className="services-grid">
          {/* Entry Service Card */}
          <div className="service-card entry-service" data-scroll-animation="scale-up" data-scroll-stagger>
            <div className="service-badge">
              <div className="badge-icon">
                <i className="fas fa-shield-alt" />
              </div>
              <div className="badge-text">ENTRY SERVICE</div>
            </div>
            <h3 className="service-title">Pest Protection</h3>
            <ul className="service-features">
              <li>
                <i className="fas fa-check" />
                Khas untuk masalah semut, tikus dan lipas
              </li>
              <li>
                <i className="fas fa-check" />
                Kadar kekerapan servis kebiasaannya 2 bulan sekali kecuali isu kritikal<br />
                <small>(1 bulan sekali lebih efisien)</small>
              </li>
              <li>
                <i className="fas fa-check" />
                <strong>Kos serendah RM150/treatment</strong>
              </li>
            </ul>
          </div>
          {/* Premium Service Card */}
          <div className="service-card premium-service" data-scroll-animation="scale-up" data-scroll-stagger>
            <div className="service-badge premium">
              <div className="badge-icon">
                <i className="fas fa-crown" />
              </div>
              <div className="badge-text">PREMIUM SERVICE</div>
            </div>
            <h3 className="service-title">Corrective Treatment</h3>
            <ul className="service-features">
              <li>
                <i className="fas fa-check" />
                Khas untuk masalah anai-anai.
              </li>
              <li>
                <i className="fas fa-check" />
                Jaminan 3 tahun bagi pakej ekonomi
              </li>
              <li>
                <i className="fas fa-check" />
                <strong>Jaminan 7 tahun bagi pakej premium</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    {/* Law Protection Section - Numbered Steps */}
    <section className="law-protection-section">
      <div className="container">
        <h2>LAW PROTECTION</h2>
        <div className="protection-steps">
          <div className="protection-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Perlindungan Undang-Undang Penuh</h3>
              <p>Kami mematuhi semua peraturan dan undang-undang tempatan dalam setiap rawatan</p>
            </div>
          </div>
          <div className="protection-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Jaminan Bertulis</h3>
              <p>Setiap rawatan disertakan dengan jaminan bertulis untuk ketenangan fikiran anda</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Simplified Process Steps - 3 Key Steps */}
    <section className="simple-process-section">
      <div className="container">
        <div className="process-header">
          <h2>Cara Mudah Dapatkan Servis Kami</h2>
          <p>3 langkah mudah untuk lindungi rumah anda dari anai-anai</p>
        </div>
        <div className="simple-process-steps">
          <div className="simple-step" data-step={1}>
            <div className="step-visual">
              <div className="step-icon">
                <i className="fab fa-whatsapp" />
              </div>
              <div className="step-number">01</div>
            </div>
            <div className="step-content">
              <h3>Hubungi Kami</h3>
              <p>Hubungi team KME untuk dapatkan konsultasi PERCUMA dan anggaran harga melalui telefon atau WhatsApp.</p>
            </div>
          </div>
          <div className="simple-step" data-step={2}>
            <div className="step-visual">
              <div className="step-icon">
                <i className="fas fa-search" />
              </div>
              <div className="step-number">02</div>
            </div>
            <div className="step-content">
              <h3>Pemeriksaan Percuma</h3>
              <p>Team KME akan visit rumah anda untuk pemeriksaan menyeluruh dan sebutharga.</p>
            </div>
          </div>
          <div className="simple-step" data-step={3}>
            <div className="step-visual">
              <div className="step-icon">
                <i className="fas fa-shield-alt" />
              </div>
              <div className="step-number">03</div>
            </div>
            <div className="step-content">
              <h3>Rawatan &amp; Jaminan</h3>
              <p>Pelaksanaan rawatan profesional dengan jaminan bertulis hingga 7 tahun.</p>
            </div>
          </div>
        </div>
        <div className="process-guarantee">
          <div className="guarantee-badge">
            <i className="fas fa-clock" />
            <span>Response dalam 24 jam</span>
          </div>
          <div className="guarantee-badge">
            <i className="fas fa-money-bill-wave" />
            <span>No hidden charges</span>
          </div>
          <div className="guarantee-badge">
            <i className="fas fa-handshake" />
            <span>Satisfaction guaranteed</span>
          </div>
        </div>
      </div>
    </section>
    {/* Professional Credentials - Enhanced Trust */}
    <section className="credentials-section">
      <div className="container">
        <div className="credentials-header">
          <h2>Government Approved &amp; Licensed</h2>
          <p>Fully licensed and certified by Malaysian government authorities for your peace of mind</p>
        </div>
        <div className="credentials-grid">
          <div className="credential-card" data-scroll-animation="fade-up">
            <div className="credential-image">
              <img src="assets/images/home/SSM-Logo.webp" alt="SSM Certificate" loading="lazy" />
            </div>
            <div className="credential-content">
              <h3>Suruhanjaya Syarikat Malaysia</h3>
              <p>Registered Company</p>
              <div className="credential-badge">
                <i className="fas fa-check-circle" />
                <span>Verified</span>
              </div>
            </div>
          </div>
          <div className="credential-card" data-scroll-animation="fade-up" data-scroll-delay={100}>
            <div className="credential-image">
              <img src="assets/images/home/KKM.webp" alt="KKM Certificate" loading="lazy" />
            </div>
            <div className="credential-content">
              <h3>Kementerian Kesihatan</h3>
              <p>Health Ministry Approved</p>
              <div className="credential-badge">
                <i className="fas fa-check-circle" />
                <span>Verified</span>
              </div>
            </div>
          </div>
          <div className="credential-card" data-scroll-animation="fade-up" data-scroll-delay={200}>
            <div className="credential-image">
              <img src="assets/images/home/MPK.webp" alt="MPK Certificate" loading="lazy" />
            </div>
            <div className="credential-content">
              <h3>Majlis Perbandaran Kuantan</h3>
              <p>Municipal Council Licensed</p>
              <div className="credential-badge">
                <i className="fas fa-check-circle" />
                <span>Verified</span>
              </div>
            </div>
          </div>
          <div className="credential-card" data-scroll-animation="fade-up" data-scroll-delay={300}>
            <div className="credential-image">
              <img src="assets/images/home/Jabatan-Pertanian-01.webp" alt="Jabatan Pertanian Certificate" loading="lazy" />
            </div>
            <div className="credential-content">
              <h3>Jabatan Pertanian</h3>
              <p>Agriculture Department</p>
              <div className="credential-badge">
                <i className="fas fa-check-circle" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
        {/* Trust Guarantees */}
        <div className="trust-guarantees">
          <div className="guarantee-item">
            <i className="fas fa-shield-alt" />
            <span>Licensed &amp; Insured</span>
          </div>
          <div className="guarantee-item">
            <i className="fas fa-award" />
            <span>15+ Years Experience</span>
          </div>
          <div className="guarantee-item">
            <i className="fas fa-handshake" />
            <span>Money Back Guarantee</span>
          </div>
          <div className="guarantee-item">
            <i className="fas fa-clock" />
            <span>7-Year Warranty</span>
          </div>
        </div>
      </div>
    </section>
    {/* Testimonials List (simple cards) */}
    <section className="home-testimonials-list" data-scroll-animation="fade-up">
      <div className="container">
        <div className="section-header" data-scroll-animation="fade-up">
          <h2>Apa Kata Pelanggan</h2>
          <p>Ringkasan maklum balas pelanggan tentang servis kami.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Selepas rawatan KME, masalah selesai dan servis terbaik."</p>
              <div className="rating"><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i></div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Team sangat profesional dan kemas bekerja."</p>
              <div className="rating"><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i></div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Harga okay, hasil pun memuaskan."</p>
              <div className="rating"><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i><i className="fas fa-star" aria-hidden="true"></i></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Final CTA Section - Action Focused */}
    <section className="final-cta-section">
      <div className="container">
        <div className="final-cta-content">
          <div className="urgency-message">
            <h2>Jangan Tunggu Anai-Anai Rosakkan Rumah Anda!</h2>
            <p className="urgency-text">Semakin lewat rawatan, semakin besar kerosakan. Dapatkan pemeriksaan PERCUMA hari ini.</p>
            <div className="cta-benefits">
              <div className="benefit">✓ Pemeriksaan PERCUMA</div>
              <div className="benefit">✓ Response 24 jam</div>
              <div className="benefit">✓ Sijil Jaminan</div>
            </div>
            <div className="final-cta-buttons">
              <a href="https://wsap.to/kmepestcontrol" className="btn-whatsapp-primary" target="_blank">
                <i className="fab fa-whatsapp" />
                <div className="cta-content">
                  <span className="cta-main">WhatsApp SEKARANG</span>
                  <span className="cta-sub">Pemeriksaan Percuma</span>
                </div>
              </a>
            </div>
            <div className="trust-reminder">
              <i className="fas fa-shield-alt" />
              <span>Licensed • Insured • 15+ Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Old Hero Section (keeping for reference) */}
    <section className="hero-section" style={{display: 'none'}}>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-subtitle">We Treat Your Home Like Our Own</p>
            <h1 className="hero-title">Sampai Bila</h1>
            <div className="hero-campaign">
              <div className="campaign-badge">
                <span className="badge-text">KEMPEN TERHAD</span>
              </div>
              <p className="hero-description">
                Sempena kempen <strong>Sampai Bila</strong>, kami nak hadiahkan 
                <span className="highlight-voucher">e-voucher bernilai RM100</span> 
                secara <strong>PERCUMA</strong> khas untuk warga 
                <span className="highlight-location">Pahang &amp; Terengganu</span>.
              </p>
            </div>
            <div className="hero-cta-container">
              <a href="https://wsap.to/kmepestcontrol" className="btn-whatsapp-secondary" target="_blank">
                <i className="fab fa-whatsapp" />
                <span>
                  <strong>Hubungi Kami</strong>
                  <small>WhatsApp Sekarang</small>
                </span>
              </a>
              <a href="https://www.kmepest.com/book/" className="hero-cta booking-btn" target="_blank">
                <i className="fas fa-calendar-alt" />
                <span>
                  <strong>Book Appointment</strong>
                  <small>Temujanji Online</small>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Contact Info */}
      <div className="floating-contact">
        <div className="contact-item">
          <i className="fas fa-phone" />
          <span>+609 573 2525</span>
        </div>
        <div className="contact-item">
          <i className="fas fa-clock" />
          <span>8:30am - 5:30pm</span>
        </div>
      </div>
    </section>
    {/* Duplicate BOOKING INSPECTION section removed */}
  </main>
  {/* JavaScript Files */}
  {/* Popup Overlay - Auto Trigger */}
  <div className="popup-overlay" id="anaiPopup">
    <div className="popup-content">
      <button className="popup-close" id="closePopup" aria-label="Tutup popup">
        &times;
      </button>
      <h3 className="popup-title-white popup-title-grid">
        <span className="popup-title-row">
          <span className="popup-title-cell popup-title-cell-left">JANGAN</span>
          <span className="popup-title-cell popup-title-cell-right">TUNGGU</span>
        </span>
        <span className="popup-title-row popup-title-row-words">
          <span className="popup-title-word popup-title-word-left">RUMAH</span>
          <span className="popup-title-word popup-title-word-center">ANDA</span>
          <span className="popup-title-word popup-title-word-right">ROBOH</span>
        </span>
      </h3>
      <h4 className="popup-subtitle-yellow">ANAI-ANAI MUSUH DALAM DIAM</h4>
      <p className="popup-message-regular">HUBUNGI KAMI UNTUK DAPATKAN</p>
      <p className="popup-message-emphasis"><span className="popup-emphasis-text">PEMERIKSAAN</span> <span className="popup-emphasis-highlight">PERCUMA</span></p>
      <a href="https://wsap.to/kmepestcontrol" className="btn-whatsapp-secondary" target="_blank">
        <i className="fab fa-whatsapp" />
        HUBUNGI PEST CONSULTANT
      </a>
    </div>
  </div>  {/* Loading indicator */}
  <div id="loading" className="loading-overlay">
    <div className="loading-spinner" />
  </div>
  {/* Footer Component - Loaded by footer.js */}
  <div id="footer-container" />
  </div>
  )
}

export default PageContent



