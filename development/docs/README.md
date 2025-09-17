# 🐛 KME Pest Control - Modern Website

**Professional pest control website built with vanilla JavaScript and WordPress headless CMS**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![WordPress](https://img.shields.io/badge/CMS-WordPress%20Headless-blue)](https://wordpress.org)
[![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JavaScript-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🌟 Features

- **🚀 Lightning Fast** - Vanilla JavaScript, no frameworks
- **📱 Fully Responsive** - Mobile-first design
- **♿ Accessible** - WCAG 2.1 AA compliant
- **🔍 SEO Optimized** - Meta tags, structured data, sitemap
- **💨 Performance** - 95+ Lighthouse score
- **🔒 Secure** - Security headers, HTTPS only
- **🎨 Modern Design** - Clean, professional UI/UX

## 🏗️ Architecture

```
Frontend (Vercel)     ←→     WordPress Headless CMS
├── HTML5 Semantic           ├── REST API Endpoints
├── Modern CSS3              ├── Content Management
├── Vanilla JavaScript       ├── Media Library
└── Progressive Enhancement  └── Admin Dashboard
```

## 📁 Project Structure

```
kme-pest-control/
├── index.html              # Homepage
├── about.html              # About Us page
├── services.html           # Services page
├── products.html           # Products page
├── contact.html            # Contact page
├── booking.html            # Booking form page
├── assets/
│   ├── css/
│   │   ├── main.css        # Main styles
│   │   └── responsive.css  # Responsive styles
│   ├── js/
│   │   ├── main.js         # Core functionality
│   │   └── api.js          # WordPress API integration
│   └── images/             # Optimized images
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies & scripts
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm 8+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kme-pest-control/website.git
   cd kme-pest-control-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build & Deploy

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

## 🔧 Configuration

### WordPress API Setup

Update the API configuration in `assets/js/api.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://your-wordpress-site.com/wp-json/wp/v2/',
    TIMEOUT: 10000,
    CACHE_DURATION: 300000,
    RETRY_ATTEMPTS: 3
};
```

### Vercel Configuration

The `vercel.json` file handles:
- Static file serving
- URL rewrites for clean URLs
- Security headers
- Cache optimization

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#4A90E2`
- **Secondary Blue**: `#357ABD`
- **Accent Orange**: `#FF8C00`
- **White**: `#FFFFFF`
- **Light Gray**: `#F8F9FA`
- **Medium Gray**: `#6C757D`
- **Dark Gray**: `#343A40`

### Typography
- **Primary Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Secondary Font**: Arial, sans-serif

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: ≥ 1440px

## 🔌 API Integration

### WordPress REST API Endpoints

```javascript
// Pages
GET /wp/v2/pages
GET /wp/v2/pages/{id}
GET /wp/v2/pages?slug={slug}

// Posts
GET /wp/v2/posts
GET /wp/v2/posts/{id}

// Media
GET /wp/v2/media

// Custom Endpoints (if implemented)
POST /wp/v2/contact-form
POST /wp/v2/booking-form
```

### Content Loading

```javascript
// Load page content
const page = await wpAPI.getPageBySlug('about');

// Load recent posts
const posts = await wpAPI.getPosts({ per_page: 5 });

// Submit contact form
const result = await wpAPI.submitContactForm(formData);
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### HTML Validation
```bash
npm run validate-html
```

### Lighthouse Audit
```bash
npm run lighthouse
```

### Manual Testing Checklist

- [ ] All pages load correctly
- [ ] Navigation works on all devices
- [ ] Forms submit successfully
- [ ] Images load and are optimized
- [ ] Accessibility features work
- [ ] Performance meets targets

## 📱 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile Safari**: iOS 12+
- **Chrome Mobile**: Latest version

## 🔒 Security Features

- **Content Security Policy** headers
- **X-Frame-Options** protection
- **XSS Protection** enabled
- **HTTPS** enforcement
- **Secure cookie** settings
- **Input sanitization**

## 📈 SEO Features

- **Semantic HTML** structure
- **Meta tags** optimization
- **Open Graph** tags
- **Twitter Cards**
- **Structured data** (JSON-LD)
- **XML sitemap**
- **Clean URLs**
- **Fast loading** times

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to Vercel |
| `npm run preview` | Preview deployment |
| `npm run validate-html` | Validate HTML |
| `npm run optimize-images` | Optimize images |
| `npm run lighthouse` | Run Lighthouse audit |
| `npm test` | Run all tests |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Use semantic HTML
- Follow BEM CSS methodology
- Write vanilla JavaScript (ES6+)
- Ensure accessibility compliance
- Test on multiple devices
- Optimize for performance

## 📞 Support & Contact

- **Website**: [https://pakaranaianai.com](https://pakaranaianai.com)
- **Email**: support@kmepest.com
- **Phone**: +609 573 2525
- **Address**: A13, Ground Floor Lorong IM2, 94, Taman Medan Mansyur, Bandar Indera Mahkota, 25200 Kuantan, Pahang

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WordPress** - Content management system
- **Vercel** - Hosting and deployment platform
- **Font Awesome** - Icon library
- **Google Fonts** - Typography

---

**Built with ❤️ by the KME Pest Control team**

*Expert In Pest Control - Pakar kawalan serangga perosak seluruh Pahang dan Terengganu*
